import test from 'node:test';
import assert from 'node:assert/strict';
import { departurePreview } from '../src/components/booking/calendar-preview.ts';

test('departure preview excludes the departure night, even when it is unavailable', () => {
  const nights = new Map([['2026-10-12', true], ['2026-10-13', true], ['2026-10-14', false]]);
  assert.deepEqual(departurePreview('2026-10-12', '2026-10-14', nights), {
    start: '2026-10-12', end: '2026-10-14', nights: 2, state: 'preview',
  });
  assert.equal(departurePreview('2026-10-12', '2026-10-15', nights).blockedNight, '2026-10-14');
});

test('cross-month preview labels missing nights unchecked and known blocks take priority', () => {
  const november = new Map([['2026-11-01', true], ['2026-11-02', true]]);
  assert.equal(departurePreview('2026-10-30', '2026-11-02', november).state, 'unchecked');
  november.set('2026-11-01', false);
  assert.equal(departurePreview('2026-10-30', '2026-11-02', november).state, 'blocked');
});

test('offline preview describes preferred dates without asserting inventory', () => {
  const nights = new Map([['2026-10-12', false]]);
  assert.equal(departurePreview('2026-10-12', '2026-10-14', nights, true).state, 'request');
});

test('departure preview accepts 1–30 nights and rejects invalid or reversed dates', () => {
  assert.equal(departurePreview('2028-02-28', '2028-02-29', new Map()).nights, 1);
  assert.equal(departurePreview('2026-10-12', '2026-11-11', new Map()).nights, 30);
  for (const [start, end] of [['2026-10-12', '2026-11-12'], ['2026-10-12', '2026-10-12'], ['2026-10-12', '2026-10-11'], ['2026-02-30', '2026-03-02'], ['', '2026-10-12']]) {
    assert.equal(departurePreview(start, end, new Map()), null);
  }
});
