import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { bookingTestDatabaseUrl } from './booking-local-database.mjs';

// Validation must happen before importing a client or opening any connection.
const connectionString = bookingTestDatabaseUrl();
const requestedModule = process.env.BOOKING_TEST_PG_MODULE || 'pg';
let Client;
try {
  const pg = await import(requestedModule === 'pg' ? 'pg' : pathToFileURL(resolve(requestedModule)).href);
  Client = pg.Client || pg.default?.Client;
  if (!Client) throw new Error('Missing Client export');
} catch {
  throw new Error('Install the optional pg test client, or set BOOKING_TEST_PG_MODULE to its local module file.');
}

async function client() {
  const db = new Client({ connectionString, connectionTimeoutMillis: 5_000, query_timeout: 15_000, statement_timeout: 10_000, application_name: 'innzoy-disposable-booking-test' });
  await db.connect();
  return db;
}
const hash = value => createHash('sha256').update(value).digest('hex');
const roles = `DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;`;
const bookingSql = `SELECT public.create_booking(
  $1::text, $2::date, $3::date, $4::time, 2,
  'Synthetic', 'Guest', 'synthetic@example.test', '+91 9999999999', '',
  $5::text, $6::text, $7::text
) AS booking`;
const admin = await client();
try {
  const preflight = await admin.query("SELECT to_regclass('public.booking_properties') AS existing");
  assert.equal(preflight.rows[0].existing, null, 'Use a fresh disposable database: an existing booking schema is refused.');
  await admin.query(roles);
  for (const migration of (await readdir(resolve('supabase/migrations'))).filter(name => name.endsWith('.sql')).sort()) {
    await admin.query(await readFile(resolve('supabase/migrations', migration), 'utf8'));
  }
  await admin.query(await readFile(resolve('tests/booking-database.sql'), 'utf8'));
  console.log('PASS: real PostgreSQL migration, allocation, capacity, privacy, retry and optional-room SQL checks.');

  // SET ROLE verifies denial on the database itself, rather than only inspecting ACLs.
  for (const role of ['anon', 'authenticated']) {
    await admin.query(`SET ROLE ${role}`);
    await assert.rejects(admin.query('SELECT * FROM public.bookings'), error => error.code === '42501');
    await assert.rejects(admin.query("SELECT public.get_booking('INZ-NOTAREALREFERENCE', repeat('0',64))"), error => error.code === '42501');
    await admin.query('RESET ROLE');
  }
  console.log('PASS: anonymous and authenticated database roles cannot read reservations or private receipts.');

  const dates = (await admin.query("SELECT ((clock_timestamp() AT TIME ZONE 'Asia/Kolkata')::date + 20)::text AS arrival, ((clock_timestamp() AT TIME ZONE 'Asia/Kolkata')::date + 22)::text AS departure")).rows[0];
  const testProperties = [];
  async function property(units) {
    const id = `booking-contention-test-${randomUUID()}`;
    testProperties.push(id);
    await admin.query("INSERT INTO public.booking_properties(id,name,booking_enabled) VALUES($1,'Synthetic concurrency fixture only',true)", [id]);
    await admin.query("INSERT INTO public.booking_room_units(property_id,label,max_guests,active) SELECT $1, 'Synthetic unit ' || n, 2, true FROM generate_series(1,$2::integer) n", [id, units]);
    await admin.query("INSERT INTO public.booking_arrival_slots(property_id,arrival_time,enabled) VALUES($1,'11:00',true),($1,'16:30',true)", [id]);
    return id;
  }
  function args(id, key = randomUUID(), time = '11:00', requestLabel = 'unchanged') {
    return [id, dates.arrival, dates.departure, time, hash(key), hash(`request:${requestLabel}`), hash(`access:${key}`)];
  }
  async function race(id, requests) {
    const workers = await Promise.all(requests.map(() => client()));
    let locked = false;
    try {
      for (const worker of workers) await worker.query('SET ROLE service_role');
      const pids = (await Promise.all(workers.map(worker => worker.query('SELECT pg_backend_pid() AS pid')))).map(result => result.rows[0].pid);
      await admin.query('BEGIN');
      locked = true;
      await admin.query('SELECT id FROM public.booking_properties WHERE id=$1 FOR UPDATE', [id]);
      const pending = workers.map((worker, index) => worker.query(bookingSql, requests[index]));
      // Attach rejection handlers immediately; every request must wait on an actual
      // PostgreSQL lock before the coordinator releases them together.
      const completion = Promise.allSettled(pending);
      let waiting = 0;
      const deadline = Date.now() + 5_000;
      while (Date.now() < deadline) {
        await admin.query('SELECT pg_stat_clear_snapshot()');
        waiting = Number((await admin.query("SELECT count(*) FROM pg_stat_activity WHERE pid=ANY($1::int[]) AND state='active' AND wait_event_type='Lock'", [pids])).rows[0].count);
        if (waiting === workers.length) break;
        await new Promise(resolveWait => setTimeout(resolveWait, 25));
      }
      assert.equal(waiting, workers.length, 'Requests did not establish simultaneous database lock contention.');
      await admin.query('COMMIT');
      locked = false;
      return await completion;
    } finally {
      if (locked) await admin.query('ROLLBACK');
      await Promise.allSettled(workers.map(worker => worker.end()));
    }
  }
  function successes(results) { return results.filter(result => result.status === 'fulfilled').map(result => result.value.rows[0].booking); }
  function failures(results, expected) {
    const rejected = results.filter(result => result.status === 'rejected');
    for (const result of rejected) assert.equal(result.reason.message, expected);
    return rejected;
  }
  try {
    const single = await property(1);
    const overlap = await race(single, [args(single), args(single, randomUUID(), '16:30')]);
    assert.equal(successes(overlap).length, 1);
    assert.equal(failures(overlap, 'BOOKING_CONFLICT').length, 1);
    assert.equal(Number((await admin.query('SELECT count(*) FROM public.bookings WHERE property_id=$1', [single])).rows[0].count), 1);
    console.log('PASS: two simultaneous stays at different arrival times cannot double-book one unit.');

    const retries = await property(1);
    const retryKey = randomUUID();
    const retry = await race(retries, Array.from({ length: 6 }, () => args(retries, retryKey)));
    assert.equal(successes(retry).length, 6);
    assert.equal(new Set(successes(retry).map(booking => booking.id)).size, 1);
    assert.equal(Number((await admin.query('SELECT count(*) FROM public.bookings WHERE property_id=$1', [retries])).rows[0].count), 1);
    console.log('PASS: six simultaneous retries return exactly one reservation.');

    const changed = await property(1);
    const changedKey = randomUUID();
    const altered = await race(changed, [args(changed, changedKey), args(changed, changedKey, '11:00', 'changed')]);
    assert.equal(successes(altered).length, 1);
    assert.equal(failures(altered, 'IDEMPOTENCY_CONFLICT').length, 1);
    console.log('PASS: a simultaneous changed retry is rejected without a second reservation.');

    const capacity = await property(3);
    const contention = await race(capacity, Array.from({ length: 10 }, (_, index) => args(capacity, randomUUID(), index % 2 ? '16:30' : '11:00')));
    assert.equal(successes(contention).length, 3);
    assert.equal(failures(contention, 'BOOKING_CONFLICT').length, 7);
    const allocated = await admin.query('SELECT count(*) AS bookings, count(DISTINCT room_unit_id) AS units FROM public.bookings WHERE property_id=$1', [capacity]);
    assert.equal(Number(allocated.rows[0].bookings), 3);
    assert.equal(Number(allocated.rows[0].units), 3);
    console.log('PASS: ten concurrent guests allocate exactly three available units; seven receive conflicts.');
  } finally {
    // Only this harness's random synthetic property IDs are removed. The guarded
    // disposable database retains its schema and must be recreated for another run.
    await admin.query('DELETE FROM public.bookings WHERE property_id=ANY($1::text[])', [testProperties]);
    await admin.query('DELETE FROM public.booking_room_units WHERE property_id=ANY($1::text[])', [testProperties]);
    await admin.query('DELETE FROM public.booking_arrival_slots WHERE property_id=ANY($1::text[])', [testProperties]);
    await admin.query('DELETE FROM public.booking_properties WHERE id=ANY($1::text[])', [testProperties]);
  }
  console.log(`PASS: PostgreSQL ${(await admin.query('SHOW server_version')).rows[0].server_version}; no production connection or reservation was used.`);
} finally {
  await admin.end();
}
