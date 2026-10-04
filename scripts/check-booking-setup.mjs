import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bookingDateBounds, validateAvailabilityQuery } from '../src/lib/booking.ts';

const HOTELS = new Set(['khajaguda', 'dlf-road', 'tngo-colony', 'hitec-city']);
const HELP = `Innzoy hotel booking readiness (read-only)

  node scripts/check-booking-setup.mjs
    Check local server configuration without making a network request.

  node scripts/check-booking-setup.mjs --online --hotel khajaguda
    Check the selected hotel's configured inventory using only booking_availability.

  node scripts/check-booking-setup.mjs --online --hotel khajaguda --guests 2 --check-in YYYY-MM-DD --check-out YYYY-MM-DD
    Check actual availability for a stay. No reservation is created or held.

Credentials are loaded from the project's .env.local/environment and are never printed.
The online check never applies migrations, enables hotels, or creates bookings.`;

function configuredKey(env) {
  return env.SUPABASE_SECRET_KEY?.trim() || env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
}

/** Report only names/statuses. Never return credentials or their substrings. */
export function inspectBookingEnvironment(env) {
  const messages = [];
  const rawUrl = env.SUPABASE_URL?.trim() || '';
  const key = configuredKey(env);
  if (!rawUrl) messages.push('Add SUPABASE_URL to .env.local with the project root URL.');
  else {
    try {
      const url = new URL(rawUrl);
      if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))
        || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
        messages.push('SUPABASE_URL must be an HTTPS project root URL without credentials, paths, queries or fragments (local HTTP is supported).');
      }
    } catch { messages.push('SUPABASE_URL is not a valid project root URL.'); }
  }
  if (!key) messages.push('Add the server-only SUPABASE_SECRET_KEY from the project API Keys page.');
  else if (env.SUPABASE_SECRET_KEY?.trim()) {
    if (!/^sb_secret_[A-Za-z0-9_-]+$/.test(key)) messages.push('SUPABASE_SECRET_KEY must contain a secret key, not a publishable/anon key.');
  } else {
    try {
      const parts = key.split('.');
      const payload = JSON.parse(Buffer.from(parts[1] || '', 'base64url').toString('utf8'));
      if (parts.length !== 3 || payload.role !== 'service_role') throw new Error();
    } catch { messages.push('The legacy SUPABASE_SERVICE_ROLE_KEY must be a service_role key. Prefer the current secret key.'); }
  }
  if (env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    messages.push('Remove server secrets from NEXT_PUBLIC_ variables and rotate any exposed key.');
  }
  return { ok: messages.length === 0, state: messages.length ? 'configuration_needed' : 'local_configuration_ready', messages: messages.length ? messages : ['Server configuration is present. Database and hotel readiness have not been checked yet.'] };
}

export function parseReadinessArgs(args, now = new Date()) {
  const options = { online: false, hotel: '', guests: '2', checkIn: '', checkOut: '', help: false };
  const values = new Map([['--hotel', 'hotel'], ['--guests', 'guests'], ['--check-in', 'checkIn'], ['--check-out', 'checkOut']]);
  for (let index = 0; index < args.length; index += 1) {
    const name = args[index];
    if (name === '--help' || name === '-h') options.help = true;
    else if (name === '--online') options.online = true;
    else if (values.has(name) && args[index + 1] && !args[index + 1].startsWith('--')) options[values.get(name)] = args[++index];
    else throw new Error('Use --help for supported readiness arguments. Do not pass credentials on the command line.');
  }
  if (options.help) return options;
  if (options.online && !HOTELS.has(options.hotel)) throw new Error('Choose --hotel khajaguda, dlf-road, tngo-colony or hitec-city.');
  if (options.hotel && !HOTELS.has(options.hotel)) throw new Error('The readiness check supports the four native hotel properties.');
  const bounds = bookingDateBounds(now);
  const query = new URLSearchParams({ property_id: options.hotel || 'khajaguda', month: (options.checkIn || bounds.min_date).slice(0, 7), guests: options.guests });
  if (options.checkIn || options.checkOut) { query.set('check_in', options.checkIn); query.set('check_out', options.checkOut); }
  const validation = validateAvailabilityQuery(query, now);
  if (!validation.valid) throw new Error(Object.values(validation.fields).join(' '));
  return { ...options, query: validation.value };
}

/** This calls exactly one read-only RPC; it cannot create/hold/cancel a reservation. */
export async function checkBookingAvailability(env, options, fetcher = fetch) {
  const local = inspectBookingEnvironment(env);
  if (!local.ok) return local;
  if (!options.online || !options.query || !HOTELS.has(options.query.property_id)) {
    return { ok: false, state: 'online_check_not_requested', messages: ['Choose --online and a hotel to check database readiness.'] };
  }
  const key = configuredKey(env);
  const headers = { 'Content-Type': 'application/json', apikey: key };
  // Current secret keys belong in apikey. Only legacy JWT keys use Bearer auth.
  if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`;
  let response;
  let data;
  try {
    response = await fetcher(new URL('/rest/v1/rpc/booking_availability', env.SUPABASE_URL.trim()), {
      method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10_000), headers,
      body: JSON.stringify({ p_property_id: options.query.property_id, p_month: `${options.query.month}-01`, p_guests: options.query.guests, p_check_in: options.query.check_in ?? null, p_check_out: options.query.check_out ?? null }),
    });
    data = await response.json();
  } catch {
    return { ok: false, state: 'network_unavailable', messages: ['The project could not be reached. Check connectivity, project status and the configured URL, then retry.'] };
  }
  // Never print remote error messages, response bodies, URLs or credentials.
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) return { ok: false, state: 'credentials_rejected', messages: ['The project rejected the server credential. Check the key belongs to this project and has server access.'] };
    if (response.status === 404 || data?.code === 'PGRST202' || data?.code === '42883') return { ok: false, state: 'migration_needed', messages: ['The booking RPC is missing. Apply the unapplied SQL migrations in timestamp order and allow the API schema cache to reload.'] };
    if (data?.message === 'BOOKING_UNAVAILABLE') return { ok: false, state: 'hotel_not_enabled', messages: ['The booking schema is reachable, but this hotel is disabled or missing active inventory/arrival times. Complete the verified hotel setup before enabling it.'] };
    return { ok: false, state: 'database_check_failed', messages: ['The database readiness check failed. Verify migrations, Data API exposure of public, and server-role permissions in the Supabase dashboard.'] };
  }
  if (!Array.isArray(data?.dates) || !Array.isArray(data?.slots) || typeof data.available !== 'boolean'
    || data.dates.some(item => typeof item?.date !== 'string' || typeof item.available !== 'boolean')
    || data.slots.some(item => typeof item?.time !== 'string' || typeof item.available !== 'boolean')) {
    return { ok: false, state: 'invalid_response', messages: ['The booking RPC returned an unexpected shape. Verify the current migrations are applied.'] };
  }
  if (!Array.isArray(data.room_options)) return { ok: false, state: 'migration_needed', messages: ['Hotel availability is reachable, but the second migration is missing. Apply 202610030001_room_selection.sql; public room selection can stay disabled.'] };
  return {
    ok: true, state: 'hotel_ready', hotel: options.query.property_id,
    availableDates: data.dates.filter(item => item.available).length,
    stayChecked: !!options.query.check_in, stayAvailable: options.query.check_in ? data.available : null,
    availableArrivalTimes: data.slots.filter(item => item.available).length,
    messages: [options.query.check_in ? 'Hotel booking is enabled. The selected stay was checked against actual inventory; no reservation was created.' : 'Hotel booking is enabled and the inventory RPC is reachable. A month-only check does not select or reserve a stay.'],
  };
}

async function main() {
  let options;
  try { options = parseReadinessArgs(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 2; return; }
  if (options.help) { console.log(HELP); return; }
  try {
    const envModule = await import('@next/env');
    const loadEnvConfig = envModule.loadEnvConfig ?? envModule.default.loadEnvConfig;
    loadEnvConfig(resolve(fileURLToPath(new URL('..', import.meta.url))), process.env.NODE_ENV !== 'production', { info() {}, error() {} });
  } catch { console.error('Could not load local environment files. Check .env.local formatting without printing its contents.'); process.exitCode = 2; return; }
  const report = options.online ? await checkBookingAvailability(process.env, options) : inspectBookingEnvironment(process.env);
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
