/** Never let allocation fixtures target a remote or non-test database. */
export function bookingTestDatabaseUrl(raw = process.env.BOOKING_TEST_DATABASE_URL) {
  if (!raw) throw new Error('Set BOOKING_TEST_DATABASE_URL to a new, disposable localhost PostgreSQL database whose name includes test.');
  let url;
  try { url = new URL(raw); }
  catch { throw new Error('Database integration is restricted to a disposable localhost test database. Remote production databases are refused.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol)
    || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    || !/^\/[a-z0-9_-]*test[a-z0-9_-]*$/i.test(url.pathname)
    // libpq query options can override the URI's host and database name.
    || url.search || url.hash) {
    throw new Error('Database integration is restricted to a disposable localhost test database. Remote production databases are refused.');
  }
  return raw;
}
