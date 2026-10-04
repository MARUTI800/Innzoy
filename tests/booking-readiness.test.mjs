import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectBookingEnvironment, parseReadinessArgs, checkBookingAvailability } from '../scripts/check-booking-setup.mjs';

const now = new Date('2026-10-04T10:00:00Z');
const env = { SUPABASE_URL: 'https://readiness-test.supabase.co', SUPABASE_SECRET_KEY: 'sb_secret_local-test-only' };
const options = parseReadinessArgs(['--online', '--hotel', 'khajaguda', '--check-in', '2026-10-12', '--check-out', '2026-10-14'], now);
const availability = { dates: [{ date: '2026-10-12', available: true }], slots: [{ time: '16:00', available: true }], available: true, room_options: [] };

test('setup inspection reports missing configuration without exposing any credential', () => {
  assert.equal(inspectBookingEnvironment({}).state, 'configuration_needed');
  assert.equal(inspectBookingEnvironment(env).state, 'local_configuration_ready');
  const exposed = { ...env, NEXT_PUBLIC_SUPABASE_SECRET_KEY: env.SUPABASE_SECRET_KEY };
  const report = inspectBookingEnvironment(exposed);
  assert.equal(report.ok, false);
  assert.equal(JSON.stringify(report).includes(env.SUPABASE_SECRET_KEY), false);
  assert.equal(JSON.stringify(report).includes(env.SUPABASE_URL), false);
});

test('setup rejects publishable keys, unsafe URLs and wrong legacy roles', () => {
  for (const SUPABASE_URL of ['https://user:password@supabase.test', 'http://remote.test', 'https://remote.test/rest/v1', 'https://remote.test/?secret=value']) {
    assert.equal(inspectBookingEnvironment({ ...env, SUPABASE_URL }).ok, false);
  }
  assert.equal(inspectBookingEnvironment({ ...env, SUPABASE_SECRET_KEY: 'sb_publishable_test' }).ok, false);
  const jwt = `header.${Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url')}.signature`;
  assert.equal(inspectBookingEnvironment({ SUPABASE_URL: env.SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: jwt }).ok, false);
});

test('readiness accepts only native hotels and valid complete future stays', () => {
  for (const args of [ ['--online'], ['--online', '--hotel', 'mokila'], ['--online', '--hotel', 'khajaguda', '--check-in', '2026-10-12'], ['--online', '--hotel', 'khajaguda', '--guests', '0'], ['--secret', env.SUPABASE_SECRET_KEY] ]) {
    assert.throws(() => parseReadinessArgs(args, now));
  }
  assert.equal(options.query.property_id, 'khajaguda');
  assert.equal(options.query.guests, 2);
});

test('offline or missing configuration never contacts the database', async () => {
  let calls = 0;
  const transport = async () => { calls++; throw new Error('should not run'); };
  assert.equal((await checkBookingAvailability({}, options, transport)).ok, false);
  assert.equal((await checkBookingAvailability(env, parseReadinessArgs([], now), transport)).state, 'online_check_not_requested');
  assert.equal(calls, 0);
});

test('online readiness performs exactly one availability RPC without mutation or secret output', async () => {
  const calls = [];
  const result = await checkBookingAvailability(env, options, async (url, init) => {
    calls.push({ url: String(url), init });
    return Response.json(availability);
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${env.SUPABASE_URL}/rest/v1/rpc/booking_availability`);
  assert.equal(calls[0].init.headers.apikey, env.SUPABASE_SECRET_KEY);
  assert.equal(calls[0].init.headers.Authorization, undefined);
  assert.equal(calls[0].init.redirect, 'error');
  assert.equal(JSON.parse(calls[0].init.body).p_check_out, '2026-10-14');
  assert.equal(result.state, 'hotel_ready');
  assert.equal(result.stayAvailable, true);
  assert.equal(JSON.stringify(result).includes(env.SUPABASE_SECRET_KEY), false);
});

test('readiness distinguishes missing migration, disabled hotel and rejected credentials while redacting remote errors', async () => {
  for (const [status, body, expected] of [
    [404, { code: 'PGRST202', message: env.SUPABASE_SECRET_KEY }, 'migration_needed'],
    [400, { message: 'BOOKING_UNAVAILABLE' }, 'hotel_not_enabled'],
    [401, { message: env.SUPABASE_SECRET_KEY }, 'credentials_rejected'],
    [500, { message: env.SUPABASE_SECRET_KEY }, 'database_check_failed'],
  ]) {
    const report = await checkBookingAvailability(env, options, async () => Response.json(body, { status }));
    assert.equal(report.state, expected);
    assert.equal(JSON.stringify(report).includes(env.SUPABASE_SECRET_KEY), false);
  }
  assert.equal((await checkBookingAvailability(env, options, async () => Response.json({ ...availability, room_options: undefined }))).state, 'migration_needed');
});
