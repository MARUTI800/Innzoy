import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createBookingService } from '../src/lib/booking-server.ts';
import { bookingLocalNow, bookingDateBounds, bookingNights, isBookingDate, validateBookingRequest, validateAvailabilityQuery } from '../src/lib/booking.ts';

const now = () => new Date('2026-10-02T10:00:00Z'); // 15:30 in Hyderabad.
const key = '3735ef8a-dbc4-4f4a-9d25-3b6eed049837';
const roomA = '2c1504db-251c-47a9-a927-46a3bf083b4d';
const roomB = 'a89d7410-66f2-4a33-a25b-d5fc2f194d30';
const valid = {
  property_id: 'khajaguda', check_in: '2026-10-12', check_out: '2026-10-14', arrival_time: '16:30',
  guests: 2, first_name: 'Priya', last_name: 'Rao', email: 'priya@example.test', phone: '+91 9876543210',
  notes: 'Late arrival', idempotency_key: key,
};
const booking = {
  ...valid, id: '811e37c0-d3ad-4277-b624-c71a6c851aca', booking_reference: 'INZ-811E37C0D3AD4277B624',
  status: 'confirmed', created_at: '2026-10-02T10:00:00Z', access_token_hash: 'must-not-return', room_unit_id: 'private',
};
const env = () => ({ SUPABASE_URL: 'https://booking-test.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'server-secret-test-only' });
const request = (body = valid, options = {}) => new Request('https://innzoy.test/api/bookings', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...options.headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const hash = (text) => createHash('sha256').update(text).digest('hex');
const mockService = (response, options = {}) => {
  const calls = [];
  const service = createBookingService({ now, env, fetch: async (url, init) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    return typeof response === 'function' ? response(calls.at(-1)) : Response.json(response);
  }, ...options });
  return { service, calls };
};

test('timezone dates do not depend on host timezone; leap dates and nights are correct', () => {
  assert.deepEqual(bookingLocalNow(new Date('2026-10-02T19:00:00Z')), { date: '2026-10-03', time: '00:30' });
  assert.equal(isBookingDate('2027-02-29'), false);
  assert.equal(isBookingDate('2028-02-29'), true);
  assert.equal(bookingNights('2026-10-02', '2026-10-05'), 3);
  assert.deepEqual(bookingDateBounds(now()), { min_date: '2026-10-02', max_date: '2027-10-02', max_nights: 30 });
});
test('valid details normalize without losing Unicode names or requests', () => {
  const result = validateBookingRequest({ ...valid, first_name: '  प्रिया  ', email: ' PRIYA@EXAMPLE.TEST ', notes: 'A quiet room\nThank you' }, now());
  assert.equal(result.valid, true);
  assert.equal(result.value.first_name, 'प्रिया');
  assert.equal(result.value.email, 'priya@example.test');
  assert.match(result.value.notes, /\n/);
});
test('invalid calendar dates, zero-night stays, past dates, and 31-night stays are rejected', () => {
  for (const changes of [
    { check_in: '2026-02-30' }, { check_in: '2026-10-01' }, { check_out: valid.check_in },
    { check_out: '2026-11-12' }, { check_out: '2027-10-03' },
  ]) assert.equal(validateBookingRequest({ ...valid, ...changes }, now()).valid, false);
});
test('same-day arrivals must be later than local current minute', () => {
  for (const time of ['15:00', '15:30']) {
    const result = validateBookingRequest({ ...valid, check_in: '2026-10-02', arrival_time: time }, now());
    assert.equal(result.valid, false);
    assert.ok(result.fields.arrival_time);
  }
  assert.equal(validateBookingRequest({ ...valid, check_in: '2026-10-02', arrival_time: '15:31' }, now()).valid, true);
});
test('guest counts, contact details, control characters, notes, and idempotency secrets are validated', () => {
  for (const changes of [
    { guests: 0 }, { guests: 1.5 }, { guests: 13 }, { guests: '2' }, { first_name: '\u0000Priya' },
    { email: 'invalid@' }, { phone: 'abc123' }, { notes: 'a'.repeat(1501) }, { idempotency_key: 'predictable' },
  ]) assert.equal(validateBookingRequest({ ...valid, ...changes }, now()).valid, false);
});
test('room selection is optional, accepts a canonical UUID, and rejects malformed or non-string identifiers', () => {
  const automatic = validateBookingRequest(valid, now());
  assert.equal(automatic.valid, true);
  assert.equal(automatic.value.room_unit_id, undefined);
  for (const room_unit_id of [null, '', '   ']) {
    const empty = validateBookingRequest({ ...valid, room_unit_id }, now());
    assert.equal(empty.valid, true);
    assert.equal(empty.value.room_unit_id, undefined);
  }
  const chosen = validateBookingRequest({ ...valid, room_unit_id: roomA.toUpperCase() }, now());
  assert.equal(chosen.valid, true);
  assert.equal(chosen.value.room_unit_id, roomA);
  for (const room_unit_id of ['private', `${roomA}/other`, 'a'.repeat(36), 42, {}, []]) {
    const result = validateBookingRequest({ ...valid, room_unit_id }, now());
    assert.equal(result.valid, false);
    assert.ok(result.fields.room_unit_id);
  }
});
test('availability validates the month, guest count and complete stay range', () => {
  const query = new URLSearchParams({ property_id: 'khajaguda', month: '2026-10', guests: '2' });
  assert.equal(validateAvailabilityQuery(query, now()).valid, true);
  query.set('guests', '2.1');
  assert.equal(validateAvailabilityQuery(query, now()).valid, false);
  query.set('guests', '2'); query.set('check_in', '2026-10-12');
  assert.ok(validateAvailabilityQuery(query, now()).fields.check_out);
  query.set('check_out', '2026-10-14'); query.set('month', '2026-09');
  assert.ok(validateAvailabilityQuery(query, now()).fields.month);
});

test('native booking APIs accept the four hotels and reject guesthouse or unknown inventory before access', async () => {
  for (const property_id of ['jubilee-hills', 'manikonda', 'kondapur', 'gopanpally', 'mokila', 'unknown-hotel']) {
    const { service, calls } = mockService(booking);
    assert.equal((await service.create(request({ ...valid, property_id }))).status, 422);
    assert.equal((await service.requestKey(request({ ...valid, property_id }))).status, 422);
    const query = new URLSearchParams({ property_id, month: '2026-10', guests: '2' });
    assert.equal((await service.availability(new Request(`https://innzoy.test/api/bookings/availability?${query}`))).status, 422);
    assert.equal(calls.length, 0);
  }
  for (const property_id of ['khajaguda', 'dlf-road', 'tngo-colony', 'hitec-city']) assert.equal(validateBookingRequest({ ...valid, property_id }, now()).valid, true);
});
test('unconfigured backend returns 503 and never sends a network request', async () => {
  const { service, calls } = mockService(booking, { env: () => ({}) });
  const response = await service.create(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, 'BOOKING_UNAVAILABLE');
  assert.equal(calls.length, 0);
});

test('modern Supabase secret uses apikey only and takes precedence over the legacy JWT', async () => {
  const secret = 'sb_secret_test-only-opaque-key';
  const { service, calls } = mockService(booking, { env: () => ({ ...env(), SUPABASE_SECRET_KEY: secret }) });
  assert.equal((await service.create(request())).status, 201);
  assert.equal(calls[0].init.headers.apikey, secret);
  assert.equal(calls[0].init.headers.Authorization, undefined);
});

test('publishable or malformed server keys fail closed before database access', async () => {
  for (const secret of ['sb_publishable_test-only', 'wrong-key', 'sb_secret_', 'sb_secret_contains space']) {
    const { service, calls } = mockService(booking, { env: () => ({ ...env(), SUPABASE_SECRET_KEY: secret }) });
    assert.equal((await service.create(request())).status, 503);
    assert.equal(calls.length, 0);
  }
  const { service, calls } = mockService(booking, { env: () => ({ SUPABASE_URL: env().SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: 'sb_publishable_test-only' }) });
  assert.equal((await service.create(request())).status, 503);
  assert.equal(calls.length, 0);
});
test('invalid requests return 422 with fields before accessing backend', async () => {
  const { service, calls } = mockService(booking);
  const response = await service.create(request({ ...valid, guests: 0, email: 'invalid' }));
  assert.equal(response.status, 422);
  const data = await response.json();
  assert.ok(data.error.fields.guests); assert.ok(data.error.fields.email);
  assert.equal(calls.length, 0);
});
test('invalid room choices fail validation before either reservation or request-key database access', async () => {
  const { service, calls } = mockService(booking);
  for (const handler of ['create', 'requestKey']) {
    const response = await service[handler](request({ ...valid, room_unit_id: 'not-a-room-uuid' }));
    assert.equal(response.status, 422);
    assert.ok((await response.json()).error.fields.room_unit_id);
  }
  assert.equal(calls.length, 0);
});
test('malformed JSON and oversized chunked bodies are rejected', async () => {
  const { service, calls } = mockService(booking);
  assert.equal((await service.create(request('{invalid'))).status, 422);
  assert.equal((await service.create(request('a'.repeat(16_385)))).status, 413);
  assert.equal(calls.length, 0);
});
test('cross-origin requests cannot create a booking', async () => {
  const { service, calls } = mockService(booking);
  assert.equal((await service.create(request(valid, { headers: { Origin: 'https://other.test' } }))).status, 403);
  assert.equal((await service.create(request(valid, { headers: { 'Sec-Fetch-Site': 'cross-site' } }))).status, 403);
  assert.equal(calls.length, 0);
});
test('creation sends normalized RPC arguments, only hashes recovery secrets, and strips private data', async () => {
  const { service, calls } = mockService(booking);
  const response = await service.create(request());
  assert.equal(response.status, 201);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const data = await response.json();
  assert.equal(data.booking.booking_reference, booking.booking_reference);
  for (const secret of ['access_token_hash', 'room_unit_id', 'idempotency_key']) assert.equal(data.booking[secret], undefined);
  assert.match(data.access_token, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(calls[0].body.p_access_hash, hash(data.access_token));
  assert.equal(calls[0].body.p_idempotency_hash, hash(key));
  assert.equal(calls[0].body.p_guests, 2);
  assert.ok(calls[0].init.signal);
  assert.equal(calls[0].init.cache, 'no-store');
  assert.equal(JSON.stringify(calls[0].body).includes(key), false);
  assert.equal(calls[0].init.headers.apikey, 'server-secret-test-only');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer server-secret-test-only');
});
test('network retry uses the same reservation fingerprint and private token', async () => {
  const { service, calls } = mockService(booking);
  const first = await (await service.create(request())).json();
  const second = await (await service.create(request())).json();
  assert.equal(first.access_token, second.access_token);
  assert.deepEqual(calls[0].body, calls[1].body);
  await service.create(request({ ...valid, notes: 'Changed request' }));
  assert.notEqual(calls[0].body.p_request_hash, calls[2].body.p_request_hash);
});
test('a selected room reaches allocation, scopes the retry fingerprint, and exposes only its public identifier', async () => {
  const { service, calls } = mockService({ ...booking, room_unit_id: roomA, internal_label: 'Staff label', unit_lock: 'private' });
  const response = await service.create(request({ ...valid, room_unit_id: roomA }));
  assert.equal(response.status, 201);
  const data = await response.json();
  assert.equal(data.booking.room_unit_id, roomA);
  assert.equal(calls[0].body.p_room_unit_id, roomA);
  for (const privateKey of ['access_token_hash', 'idempotency_key', 'internal_label', 'unit_lock']) assert.equal(data.booking[privateKey], undefined);
  await service.create(request({ ...valid, room_unit_id: roomB }));
  assert.equal(calls[1].body.p_room_unit_id, roomB);
  assert.notEqual(calls[0].body.p_request_hash, calls[1].body.p_request_hash);
  await service.create(request());
  assert.notEqual(calls[0].body.p_request_hash, calls[2].body.p_request_hash);
});
test('matching retries recover after same-day arrival and after the check-in date passes', async () => {
  let clock = new Date('2026-10-02T10:00:00Z');
  const sameDay = { ...valid, check_in: '2026-10-02', check_out: '2026-10-04', arrival_time: '16:30' };
  const { service, calls } = mockService({ ...booking, ...sameDay }, { now: () => clock });
  const original = await (await service.create(request(sameDay))).json();
  for (const shifted of ['2026-10-02T12:00:00Z', '2026-10-03T10:00:00Z']) {
    clock = new Date(shifted);
    const response = await service.create(request(sameDay));
    assert.equal(response.status, 201);
    const replay = await response.json();
    assert.equal(replay.access_token, original.access_token);
    assert.equal(replay.booking.id, original.booking.id);
    assert.deepEqual(calls.at(-1).body, calls[0].body);
  }
});
test('a new expired request is still rejected by database policy with temporal field errors', async () => {
  const { service } = mockService(() => Response.json({ message: 'BOOKING_VALIDATION_ERROR' }, { status: 400 }));
  const response = await service.create(request({ ...valid, check_in: '2026-10-01', check_out: '2026-10-04' }));
  assert.equal(response.status, 422);
  assert.ok((await response.json()).error.fields.check_in);
});
test('database overlap and idempotency conflicts have actionable 409 states', async () => {
  for (const [backend, expected] of [
    [{ code: '23P01', message: 'details containing PII' }, 'BOOKING_CONFLICT'],
    [{ code: 'P0001', message: 'BOOKING_CONFLICT' }, 'BOOKING_CONFLICT'],
    [{ code: 'P0001', message: 'IDEMPOTENCY_CONFLICT' }, 'IDEMPOTENCY_CONFLICT'],
  ]) {
    const { service } = mockService(() => Response.json(backend, { status: 400 }));
    const response = await service.create(request());
    assert.equal(response.status, 409);
    assert.equal((await response.json()).error.code, expected);
  }
});
test('network failure, malformed backend data, and backend exceptions fail closed with no PII', async () => {
  for (const behavior of [
    () => { throw new Error('customer personal details'); },
    () => Response.json({ code: 'XX000', message: 'customer personal details' }, { status: 500 }),
    () => Response.json({ id: 'incomplete record' }),
    () => new Response('not JSON'),
  ]) {
    const { service } = mockService(behavior);
    const response = await service.create(request());
    assert.equal(response.status, 503);
    assert.equal((await response.text()).includes('customer personal details'), false);
  }
});
test('availability forwards guest capacity and selected stay, and strips unrelated backend fields', async () => {
  const { service, calls } = mockService({ dates: [{ date: '2026-10-12', available: false, capacity: 'private' }], slots: [{ time: '16:30', available: false }], available: false, private: 'hidden' });
  const response = await service.availability(new Request('https://innzoy.test/api/bookings/availability?property_id=khajaguda&month=2026-10&guests=3&check_in=2026-10-12&check_out=2026-10-14'));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0].body, { p_property_id: 'khajaguda', p_month: '2026-10-01', p_guests: 3, p_check_in: '2026-10-12', p_check_out: '2026-10-14' });
  const result = await response.json();
  assert.equal(result.timezone, 'Asia/Kolkata');
  assert.equal(result.available, false);
  assert.equal(result.private, undefined); assert.equal(result.dates[0].capacity, undefined);
});
test('month-only availability sends no selected stay and returns no slots', async () => {
  const { service, calls } = mockService({ dates: [], slots: [], available: false });
  const response = await service.availability(new Request('https://innzoy.test/api/bookings/availability?property_id=khajaguda&month=2026-10&guests=2'));
  assert.deepEqual((await response.json()).slots, []);
  assert.equal(calls[0].body.p_check_in, null); assert.equal(calls[0].body.p_check_out, null);
});
test('room choices require selected stay dates even when the backend includes room metadata', async () => {
  const { service } = mockService({ dates: [], slots: [], available: false, room_options: [{
    id: roomA, name: 'Corner room', description: 'A real room', images: ['https://innzoy.test/room.jpg'], max_guests: 2, available: true,
  }] });
  const response = await service.availability(new Request('https://innzoy.test/api/bookings/availability?property_id=khajaguda&month=2026-10&guests=2'));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).room_options?.length ?? 0, 0);
});
test('selected-date room options publish only usable public metadata with safe images and guest capacity', async () => {
  const room = { id: roomA, name: '  Corner room  ', description: 'A real room', images: [
    'https://innzoy.test/room.jpg', 'http://localhost/room-two.jpg', 'javascript:alert(1)',
    'data:image/jpeg;base64,secret', 'file:///private.jpg', 'https://staff:password@innzoy.test/private.jpg',
    'https://innzoy.test/room\n.jpg',
  ], max_guests: 3, available: true, label: 'Staff A', property_id: 'private', access_token_hash: 'private' };
  const { service } = mockService({ dates: [], slots: [], available: true, room_options: [
    room,
    { ...room, id: roomB, max_guests: 2 },
    { ...room, id: 'internal-key' },
    { ...room, name: '' },
    { ...room, images: ['javascript:alert(1)'] },
    { ...room, max_guests: 13 },
    { ...room, max_guests: 2.5 },
    { ...room, available: 'yes' },
  ] });
  const response = await service.availability(new Request('https://innzoy.test/api/bookings/availability?property_id=khajaguda&month=2026-10&guests=3&check_in=2026-10-12&check_out=2026-10-14'));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.deepEqual(result.room_options, [{ id: roomA, name: 'Corner room', description: 'A real room', images: [
    'https://innzoy.test/room.jpg', 'http://localhost/room-two.jpg',
  ], max_guests: 3, available: true }]);
});
test('room availability cannot override an unavailable whole stay and old RPCs remain compatible', async () => {
  const room = { id: roomA, name: 'Corner room', images: ['https://innzoy.test/room.jpg'], max_guests: 2, available: true };
  const { service } = mockService({ dates: [], slots: [], available: false, room_options: [room] });
  const response = await service.availability(new Request('https://innzoy.test/api/bookings/availability?property_id=khajaguda&month=2026-10&guests=2&check_in=2026-10-12&check_out=2026-10-14'));
  const result = await response.json();
  assert.equal(result.room_options[0].available, false);
  assert.equal(result.room_options[0].description, '');
  const { service: oldService } = mockService({ dates: [], slots: [], available: true });
  const oldResponse = await oldService.availability(new Request('https://innzoy.test/api/bookings/availability?property_id=khajaguda&month=2026-10&guests=2&check_in=2026-10-12&check_out=2026-10-14'));
  assert.equal(oldResponse.status, 200);
  assert.deepEqual((await oldResponse.json()).room_options, []);
});
test('private lookup requires a bearer token and returns generic404 for mismatched credentials', async () => {
  const { service, calls } = mockService(() => Response.json({ message: 'BOOKING_NOT_FOUND' }, { status: 400 }));
  assert.equal((await service.lookup(new Request('https://innzoy.test'), booking.booking_reference)).status, 401);
  assert.equal(calls.length, 0);
  const token = 'A'.repeat(43);
  const response = await service.lookup(new Request('https://innzoy.test', { headers: { Authorization: `Bearer ${token}` } }), booking.booking_reference);
  assert.equal(response.status, 404);
  assert.equal(calls[0].body.p_access_hash, hash(token));
  assert.equal(JSON.stringify(calls[0].body).includes(token), false);
});
test('valid private lookup returns sanitized no-store details', async () => {
  const { service } = mockService(booking);
  const response = await service.lookup(new Request('https://innzoy.test', { headers: { Authorization: `Bearer ${'A'.repeat(43)}` } }), booking.booking_reference);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('cache-control'), /private/);
  const data = await response.json();
  assert.equal(data.booking.email, valid.email);
  assert.equal(data.booking.room_unit_id, undefined);
});
test('private receipt lookup may return a verified room UUID while credential and internal room fields stay private', async () => {
  const { service } = mockService({ ...booking, room_unit_id: roomA, room_label: 'Internal A', request_hash: 'private' });
  const response = await service.lookup(new Request('https://innzoy.test', { headers: { Authorization: `Bearer ${'A'.repeat(43)}` } }), booking.booking_reference);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.booking.room_unit_id, roomA);
  for (const privateKey of ['room_label', 'request_hash', 'access_token_hash', 'idempotency_key']) assert.equal(data.booking[privateKey], undefined);
});
test('Next route exports delegate to real server handlers with promised dynamic params', async () => {
  const [create, availability, lookup, requestKey] = await Promise.all([
    import('../src/app/api/bookings/route.ts'), import('../src/app/api/bookings/availability/route.ts'), import('../src/app/api/bookings/[reference]/route.ts'), import('../src/app/api/bookings/request-key/route.ts'),
  ]);
  assert.equal(create.runtime, 'nodejs');
  assert.equal((await create.POST(request({}))).status, 422);
  assert.equal((await availability.GET(new Request('https://innzoy.test/api/bookings/availability'))).status, 422);
  assert.equal((await lookup.GET(new Request('https://innzoy.test'), { params: Promise.resolve({ reference: booking.booking_reference }) })).status, 401);
  assert.equal((await requestKey.POST(request({}))).status, 422);
});
test('request keys use fresh cryptographic UUIDv4 values and stable normalized fingerprints without database effects', async () => {
  const { service, calls } = mockService(() => { throw new Error('must not reach database'); }, { env: () => ({}) });
  const { idempotency_key: ignored, ...details } = valid;
  const firstResponse = await service.requestKey(request(details));
  assert.equal(firstResponse.status, 200);
  assert.match(firstResponse.headers.get('cache-control'), /no-store/);
  const first = await firstResponse.json();
  assert.match(first.idempotency_key, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(first.fingerprint, hash(JSON.stringify(details)));
  const second = await (await service.requestKey(request({ ...details, first_name: ' Priya ', email: ' PRIYA@EXAMPLE.TEST ', notes: ' Late arrival ' }))).json();
  assert.notEqual(first.idempotency_key, second.idempotency_key);
  assert.equal(first.fingerprint, second.fingerprint);
  const changed = await (await service.requestKey(request({ ...details, guests: 3 }))).json();
  assert.notEqual(changed.fingerprint, first.fingerprint);
  assert.equal(calls.length, 0);
});
test('request-key fingerprints include a normalized optional room choice without contacting inventory', async () => {
  const { service, calls } = mockService(() => { throw new Error('must not reach database'); }, { env: () => ({}) });
  const first = await (await service.requestKey(request({ ...valid, room_unit_id: roomA }))).json();
  const same = await (await service.requestKey(request({ ...valid, room_unit_id: roomA.toUpperCase() }))).json();
  const different = await (await service.requestKey(request({ ...valid, room_unit_id: roomB }))).json();
  const automatic = await (await service.requestKey(request(valid))).json();
  assert.equal(same.fingerprint, first.fingerprint);
  assert.notEqual(different.fingerprint, first.fingerprint);
  assert.notEqual(automatic.fingerprint, first.fingerprint);
  assert.equal(calls.length, 0);
});
test('request-key endpoint validates inputs, rejects oversized bodies, and applies same-origin protection', async () => {
  const { service, calls } = mockService(booking);
  const invalid = await service.requestKey(request({ ...valid, phone: 'bad-phone' }));
  assert.equal(invalid.status, 422);
  assert.ok((await invalid.json()).error.fields.phone);
  assert.equal((await service.requestKey(request('x'.repeat(16_385)))).status, 413);
  assert.equal((await service.requestKey(request('{'))).status, 422);
  assert.equal((await service.requestKey(request(valid, { headers: { Origin: 'https://other.test' } }))).status, 403);
  assert.equal((await service.requestKey(request(valid, { headers: { 'Sec-Fetch-Site': 'cross-site' } }))).status, 403);
  assert.equal(calls.length, 0);
});
test('request-key preparation permits elapsed dates for recovery but retains date syntax and stay constraints', async () => {
  const { service, calls } = mockService(booking);
  assert.equal((await service.requestKey(request({ ...valid, check_in: '2026-10-01', check_out: '2026-10-02' }))).status, 200);
  assert.equal((await service.requestKey(request({ ...valid, check_in: '2026-02-30' }))).status, 422);
  assert.equal((await service.requestKey(request({ ...valid, check_out: '2026-11-12' }))).status, 422);
  assert.equal(calls.length, 0);
});
test('same-origin checks use validated incoming Host when Next normalizes the request URL', async () => {
  const { service } = mockService(booking);
  const headers = { Host: '127.0.0.1:3001', Origin: 'http://127.0.0.1:3001', 'Sec-Fetch-Site': 'same-origin' };
  const prepare = new Request('http://localhost:3001/api/bookings/request-key', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(valid) });
  assert.equal((await service.requestKey(prepare)).status, 200);
  const create = new Request('http://localhost:3001/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(valid) });
  assert.equal((await service.create(create)).status, 201);
  assert.equal((await service.requestKey(request(valid, { headers: { Origin: 'https://innzoy.test' } }))).status, 200);
});
test('Host validation rejects malformed authorities and never trusts forwarded hosts', async () => {
  const { service, calls } = mockService(booking);
  for (const host of ['evil.test/path', 'trusted.test@evil.test', 'evil.test:65536', 'evil.test:0', 'evil.test,innzoy.test', 'evil..test', '[::1]:bad', 'evil test', '', '-evil.test', '[xyz]:3001']) {
    const response = await service.requestKey(request(valid, { headers: { Host: host, Origin: 'https://innzoy.test' } }));
    assert.equal(response.status, 403, host);
  }
  assert.equal((await service.requestKey(request(valid, { headers: { Host: 'innzoy.test', Origin: 'https://attacker.test', 'X-Forwarded-Host': 'attacker.test' } }))).status, 403);
  assert.equal((await service.requestKey(request(valid, { headers: { Host: 'innzoy.test', Origin: 'https://innzoy.test', 'Sec-Fetch-Site': 'cross-site' } }))).status, 403);
  assert.equal(calls.length, 0);
});
