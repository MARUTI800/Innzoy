import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingCalendar, dateAfter, formatStayDate, guestErrors, nightsBetween } from '../src/components/booking/booking-client.ts';
import { bookingSelectionFromSearch, hotelBrowseHref, resolveBookingSelection } from '../src/components/booking/booking-selection.ts';

test('stay dates format independently of host timezone and cross month/year boundaries', () => {
  assert.equal(dateAfter('2028-02-28', 1), '2028-02-29');
  assert.equal(dateAfter('2026-12-31', 1), '2027-01-01');
  assert.equal(nightsBetween('2026-10-30', '2026-11-02'), 3);
  assert.equal(nightsBetween('', ''), 0);
  assert.equal(formatStayDate('2026-10-12'), '12 October 2026');
});

test('hotel discovery passes only public preferences and keeps corporate intent', () => {
  const search = new URLSearchParams('check_in=2026-10-12&check_out=2026-10-14&guests=3&email=private@example.com&access_token=private');
  const preferences = bookingSelectionFromSearch(search);
  assert.deepEqual(preferences, { checkIn: '2026-10-12', checkOut: '2026-10-14', guests: 3 });
  const href = hotelBrowseHref(preferences, 'corporate');
  assert.match(href, /^\/stays\?category=hotel&/);
  assert.match(href, /booking_intent=corporate/);
  assert.ok(!href.includes('private'));
  assert.equal(bookingSelectionFromSearch(new URLSearchParams('booking_intent=corporate')), undefined);
});

test('empty date preferences remain explicit throughout hotel discovery', () => {
  const preferences = bookingSelectionFromSearch(new URLSearchParams('check_in=&check_out=&guests=2'));
  assert.deepEqual(preferences, { checkIn: '', checkOut: '', guests: 2 });
  assert.equal(hotelBrowseHref(preferences), '/stays?category=hotel&check_in=&check_out=&guests=2');
});

test('malformed discovery preferences cannot create an invalid opening selection', () => {
  for (const guests of ['1e1', 'Infinity', '13', '-1', '01', '']) {
    const preferences = bookingSelectionFromSearch(new URLSearchParams({ check_in: 'not-a-date', check_out: '2026-99-99', guests }));
    assert.deepEqual(resolveBookingSelection(preferences, undefined, '2026-10-04'), { checkIn: '', checkOut: '', guests: 2 });
  }
});

test('guest validation accepts international names/phones and identifies invalid contact fields', () => {
  assert.deepEqual(guestErrors({ first_name: 'Zoë', last_name: '王', email: 'guest+stay@example.com', phone: '+91 (90000) 00000' }), {});
  const fields = guestErrors({ first_name: ' ', last_name: 'Guest', email: 'bad', phone: '123' });
  assert.deepEqual(Object.keys(fields), ['first_name', 'email', 'phone']);
});

test('calendar file preserves hotel-night exclusivity, escapes text, folds UTF-8 and excludes contact PII', () => {
  const booking = { id: 'fixture', booking_reference: 'INZ-123', check_in: '2026-10-12', check_out: '2026-10-14', arrival_time: '14:00', guests: 2, created_at: '2026-10-02T05:00:00Z', email: 'private@example.com', phone: '+91 9000000000' };
  const file = bookingCalendar(booking, 'Hyderabad; welcome, guest', 'Address\n' + 'é'.repeat(100));
  assert.match(file, /DTSTART;VALUE=DATE:20261012\r\n/);
  assert.match(file, /DTEND;VALUE=DATE:20261014\r\n/);
  assert.match(file, /Arrival 14:00 \(Asia\/Kolkata\)/);
  assert.match(file, /Hyderabad\\; welcome\\, guest/);
  assert.ok(!file.includes(booking.email));
  assert.ok(!file.includes(booking.phone));
  assert.ok(file.split('\r\n').every(line => Buffer.byteLength(line, 'utf8') <= 75));
  assert.match(file, /\r\n /);
});

test('explicit hero preferences replace saved dates and guests without mixing reservations', () => {
  const draft = { checkIn: '2026-10-12', checkOut: '2026-10-14', guests: 3 };
  const hero = { checkIn: '2026-10-20', checkOut: '2026-10-23', guests: 5 };
  assert.deepEqual(resolveBookingSelection(hero, draft, '2026-10-03'), hero);
  assert.deepEqual(resolveBookingSelection({ checkIn: '2026-10-20' }, draft, '2026-10-03'), { checkIn: '2026-10-20', checkOut: '', guests: 3 });
  assert.deepEqual(draft, { checkIn: '2026-10-12', checkOut: '2026-10-14', guests: 3 });
});

test('unseeded openings retain valid draft preferences and an explicitly empty hero clears saved dates', () => {
  const draft = { checkIn: '2026-10-12', checkOut: '2026-10-14', guests: 3 };
  assert.deepEqual(resolveBookingSelection(undefined, draft, '2026-10-03'), draft);
  assert.deepEqual(resolveBookingSelection({ guests: 4 }, draft, '2026-10-03'), { ...draft, guests: 4 });
  assert.deepEqual(resolveBookingSelection({ checkIn: '', checkOut: '', guests: 2 }, draft, '2026-10-03'), { checkIn: '', checkOut: '', guests: 2 });
  assert.deepEqual(resolveBookingSelection(undefined, undefined, '2026-10-03'), { checkIn: '', checkOut: '', guests: 2 });
});

test('opening dates reject impossible, past, reversed and overlong ranges rather than claiming a valid stay', () => {
  const today = '2026-10-03';
  for (const checkIn of ['2026-10-02', '2026-11-31', '2027-02-29', '2026-10-03T12:00:00Z', '2027-10-03']) {
    assert.deepEqual(resolveBookingSelection({ checkIn, checkOut: '2027-10-04' }, undefined, today), { checkIn: '', checkOut: '', guests: 2 });
  }
  for (const checkOut of ['2026-10-12', '2026-10-11', '2026-11-12', '2026-10-32']) {
    assert.deepEqual(resolveBookingSelection({ checkIn: '2026-10-12', checkOut }, undefined, today), { checkIn: '2026-10-12', checkOut: '', guests: 2 });
  }
  assert.deepEqual(resolveBookingSelection({ checkOut: '2026-10-14' }, undefined, today), { checkIn: '', checkOut: '', guests: 2 });
});

test('opening selection honors leap days, exactly 30 nights and the final permitted departure', () => {
  assert.deepEqual(resolveBookingSelection({ checkIn: '2028-02-29', checkOut: '2028-03-01' }, undefined, '2028-02-27'), { checkIn: '2028-02-29', checkOut: '2028-03-01', guests: 2 });
  assert.deepEqual(resolveBookingSelection({ checkIn: '2026-10-12', checkOut: '2026-11-11' }, undefined, '2026-10-03'), { checkIn: '2026-10-12', checkOut: '2026-11-11', guests: 2 });
  assert.deepEqual(resolveBookingSelection({ checkIn: '2027-10-02', checkOut: '2027-10-03' }, undefined, '2026-10-03'), { checkIn: '2027-10-02', checkOut: '2027-10-03', guests: 2 });
  assert.deepEqual(resolveBookingSelection({ checkIn: '2027-10-02', checkOut: '2027-10-04' }, undefined, '2026-10-03'), { checkIn: '2027-10-02', checkOut: '', guests: 2 });
});

test('opening guest preferences enforce integer contract bounds and reject malformed stored values', () => {
  for (const guests of [1, 12]) assert.equal(resolveBookingSelection({ guests }, undefined, '2026-10-03').guests, guests);
  for (const guests of [0, 13, 2.5, NaN, Infinity, '3', null]) {
    assert.equal(resolveBookingSelection({ guests }, { guests: 6 }, '2026-10-03').guests, 2);
    assert.equal(resolveBookingSelection(undefined, { guests }, '2026-10-03').guests, 2);
  }
});
