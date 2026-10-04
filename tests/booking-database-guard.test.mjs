import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('database harnesses refuse remote databases and connection overrides before loading a client', () => {
  const refused = [
    'postgresql://example.supabase.co/innzoy_test',
    'postgresql://localhost/innzoy_production',
    'postgresql://localhost/innzoy_test?host=example.supabase.co',
    'postgresql://localhost/innzoy_test?dbname=innzoy_production',
    'postgresql://localhost/innzoy_test?service=production',
    'postgresql://localhost/innzoy_test#connection-options',
    'not-a-database-url',
    'postgresql://localhost:99999/innzoy_test',
  ];
  for (const databaseUrl of refused) for (const harness of ['tests/booking-database.mjs', 'tests/booking-database-pg.mjs']) {
    const result = spawnSync(process.execPath, [harness], {
      encoding: 'utf8',
      env: { ...process.env, BOOKING_TEST_DATABASE_URL: databaseUrl },
      shell: false,
    });
    assert.equal(result.status, 1, databaseUrl);
    assert.match(result.stderr, /Database integration is restricted to a disposable localhost test database/, databaseUrl);
    assert.doesNotMatch(result.stderr, /psql is required/, databaseUrl);
    assert.doesNotMatch(result.stderr, /Install the optional pg test client/, databaseUrl);
  }
});
