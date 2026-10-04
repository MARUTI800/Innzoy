import 'server-only';
import { createHash, randomUUID } from 'node:crypto';
import {
  BOOKING_TIMEZONE, bookingDateBounds, isBookingRoomId, validateAvailabilityQuery, validateBookingRequest,
  type Booking, type BookingAvailability, type BookingApiError, type BookingCreated, type BookingRoomOption,
} from './booking';

const BODY_LIMIT = 16_384;
const RESPONSE_HEADERS = { 'Cache-Control': 'no-store, private', 'Vary': 'Authorization', 'X-Content-Type-Options': 'nosniff' };
const UNAVAILABLE = 'Reservations are temporarily unavailable. Please contact our team with your stay details.';
type Environment = { SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
type Dependencies = { fetch?: typeof globalThis.fetch; now?: () => Date; env?: () => Environment };
class BookingError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string>;
  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
function errorResponse(error: unknown) {
  const known = error instanceof BookingError ? error : new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
  const body: BookingApiError = { error: { code: known.code, message: known.message, ...(known.fields ? { fields: known.fields } : {}) } };
  return Response.json(body, { status: known.status, headers: RESPONSE_HEADERS });
}
function sha256(value: string) { return createHash('sha256').update(value).digest('hex'); }
function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
function assertSameOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  let expectedOrigin = requestUrl.origin;
  const host = request.headers.get('host');
  if (host !== null) {
    // Next may normalize Request.url's hostname while preserving the browser's
    // actual Host. Accept only an authority, never forwarded hosts or URL syntax.
    const authority = /^(?:([a-z0-9.-]+)|(\[[a-f0-9:.]+\]))(?::(\d{1,5}))?$/i.exec(host);
    const hostname = authority?.[1]?.replace(/\.$/, '');
    const validDomain = hostname === undefined || (hostname.length <= 253 && hostname.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)));
    if (!authority || !validDomain || (authority[3] !== undefined && (Number(authority[3]) < 1 || Number(authority[3]) > 65535))) {
      throw new BookingError(403, 'FORBIDDEN', 'Open reservations from the Innzoy website.');
    }
    try { expectedOrigin = new URL(`${requestUrl.protocol}//${host}`).origin; }
    catch { throw new BookingError(403, 'FORBIDDEN', 'Open reservations from the Innzoy website.'); }
  }
  const origin = request.headers.get('origin');
  if ((origin && origin !== expectedOrigin) || request.headers.get('sec-fetch-site') === 'cross-site') throw new BookingError(403, 'FORBIDDEN', 'Open reservations from the Innzoy website.');
}

/** Explicit allowlist: only an explicitly requested public room is returned; allocation and secrets stay private. */
function safeBooking(value: unknown): Booking {
  if (!object(value)) throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
  const keys = ['id', 'booking_reference', 'property_id', 'check_in', 'check_out', 'arrival_time', 'first_name', 'last_name', 'email', 'phone', 'notes', 'status', 'created_at'] as const;
  if (keys.some((key) => typeof value[key] !== 'string') || !Number.isInteger(value.guests) || !['pending', 'confirmed', 'cancelled', 'completed'].includes(String(value.status))) {
    throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
  }
  return {
    id: value.id as string, booking_reference: value.booking_reference as string,
    property_id: value.property_id as string, check_in: value.check_in as string,
    check_out: value.check_out as string, arrival_time: value.arrival_time as string,
    guests: value.guests as number, first_name: value.first_name as string,
    ...(isBookingRoomId(value.room_unit_id) ? { room_unit_id: value.room_unit_id.toLowerCase() } : {}),
    last_name: value.last_name as string, email: value.email as string,
    phone: value.phone as string, notes: value.notes as string,
    status: value.status as Booking['status'], created_at: value.created_at as string,
  };
}
function publicRoomImage(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048 || /[\u0000-\u0020\u007f]/.test(value)) return false;
  try {
    const image = new URL(value);
    return ['https:', 'http:'].includes(image.protocol) && !!image.hostname && !image.username && !image.password;
  } catch { return false; }
}
/** Inventory metadata is opt-in at the database; this allowlist never leaks operational room labels. */
function publicRooms(value: unknown, guests: number, stayAvailable: boolean): BookingRoomOption[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((room): BookingRoomOption[] => {
    if (!object(room) || !isBookingRoomId(room.id) || typeof room.name !== 'string' || !room.name.trim()
      || room.name.trim().length > 120 || /[\u0000-\u001f\u007f]/.test(room.name)
      || !Number.isInteger(room.max_guests) || Number(room.max_guests) < guests || Number(room.max_guests) > 12
      || typeof room.available !== 'boolean' || !Array.isArray(room.images)) return [];
    const id = room.id.toLowerCase();
    const images = room.images.filter(publicRoomImage).slice(0, 12);
    if (seen.has(id) || !images.length) return [];
    const description = typeof room.description === 'string' ? room.description.trim() : '';
    if (description.length > 1500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(description)) return [];
    seen.add(id);
    return [{ id, name: room.name.trim(), description, images, max_guests: Number(room.max_guests), available: stayAvailable && room.available }];
  });
}
async function readJson(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new BookingError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Submit the reservation as JSON.');
  }
  if (Number(request.headers.get('content-length')) > BODY_LIMIT) throw new BookingError(413, 'REQUEST_TOO_LARGE', 'Your request is too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new BookingError(422, 'VALIDATION_ERROR', 'Enter your reservation details.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > BODY_LIMIT) {
      await reader.cancel();
      throw new BookingError(413, 'REQUEST_TOO_LARGE', 'Your request is too large.');
    }
    chunks.push(value);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(data)) as unknown; }
  catch { throw new BookingError(422, 'VALIDATION_ERROR', 'Enter valid reservation details.'); }
}

export function createBookingService(dependencies: Dependencies = {}) {
  const fetcher = dependencies.fetch ?? globalThis.fetch;
  const now = dependencies.now ?? (() => new Date());
  const environment = dependencies.env ?? (() => ({ SUPABASE_URL: process.env.SUPABASE_URL, SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY }));

  async function rpc(name: string, args: Record<string, unknown>): Promise<unknown> {
    const env = environment();
    const modernKey = env.SUPABASE_SECRET_KEY?.trim();
    const legacyKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const serverKey = modernKey || legacyKey;
    if (!env.SUPABASE_URL || !serverKey || (modernKey && !/^sb_secret_[A-Za-z0-9_-]+$/.test(modernKey)) || (!modernKey && legacyKey?.startsWith('sb_'))) {
      throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
    }
    let base: URL;
    try { base = new URL(env.SUPABASE_URL); }
    catch { throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE); }
    if (base.protocol !== 'https:' && !(base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname))) {
      throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
    }
    if (base.username || base.password || base.search || base.hash || base.pathname !== '/') throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
    let response: Response;
    try {
      response = await fetcher(new URL(`/rest/v1/rpc/${name}`, base), {
        method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(10_000), redirect: 'error',
        // Modern secret keys are opaque, not JWTs. Only legacy service-role
        // keys belong in the Authorization bearer header.
        headers: { 'Content-Type': 'application/json', apikey: serverKey, ...(!modernKey ? { Authorization: `Bearer ${serverKey}` } : {}) },
        body: JSON.stringify(args),
      });
    } catch { throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE); }
    let data: unknown;
    try { data = await response.json(); }
    catch { throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE); }
    if (!response.ok) {
      const code = object(data) ? data.code : '';
      const message = object(data) ? data.message : '';
      if (message === 'BOOKING_CONFLICT' || code === '23P01') throw new BookingError(409, 'BOOKING_CONFLICT', 'This stay or arrival time is no longer available. Please choose another.');
      if (message === 'IDEMPOTENCY_CONFLICT') throw new BookingError(409, 'IDEMPOTENCY_CONFLICT', 'This reservation request has changed. Please review it and try again.');
      if (message === 'BOOKING_NOT_FOUND') throw new BookingError(404, 'NOT_FOUND', 'We could not find this reservation.');
      if (message === 'BOOKING_VALIDATION_ERROR') throw new BookingError(422, 'VALIDATION_ERROR', 'Please review your reservation details.');
      throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
    }
    return data;
  }

  return {
    async requestKey(request: Request) {
      try {
        assertSameOrigin(request);
        const raw = await readJson(request);
        const idempotency_key = randomUUID();
        const validated = validateBookingRequest({ ...(object(raw) ? raw : {}), idempotency_key }, now(), { enforceDateWindow: false });
        if (!validated.valid) throw new BookingError(422, 'VALIDATION_ERROR', 'Please review your reservation details.', validated.fields);
        const { idempotency_key: _key, ...details } = validated.value;
        return Response.json({ fingerprint: sha256(JSON.stringify(details)), idempotency_key }, { headers: RESPONSE_HEADERS });
      } catch (error) { return errorResponse(error); }
    },
    async availability(request: Request) {
      try {
        const instant = now();
        const validated = validateAvailabilityQuery(new URL(request.url).searchParams, instant);
        if (!validated.valid) throw new BookingError(422, 'VALIDATION_ERROR', 'Please review your stay details.', validated.fields);
        const value = validated.value;
        const data = await rpc('booking_availability', {
          p_property_id: value.property_id, p_month: `${value.month}-01`, p_guests: value.guests,
          p_check_in: value.check_in ?? null, p_check_out: value.check_out ?? null,
        });
        if (!object(data) || !Array.isArray(data.dates) || !Array.isArray(data.slots) || typeof data.available !== 'boolean'
          || data.dates.some((item: unknown) => !object(item) || typeof item.date !== 'string' || typeof item.available !== 'boolean')
          || data.slots.some((item: unknown) => !object(item) || typeof item.time !== 'string' || typeof item.available !== 'boolean')) {
          throw new BookingError(503, 'BOOKING_UNAVAILABLE', UNAVAILABLE);
        }
        const result: BookingAvailability = {
          property_id: value.property_id, month: value.month,
          dates: data.dates.map((item) => ({ date: item.date as string, available: item.available as boolean })),
          slots: data.slots.map((item) => ({ time: item.time as string, available: item.available as boolean })),
          available: data.available, timezone: BOOKING_TIMEZONE, ...bookingDateBounds(instant),
          room_options: value.check_in && value.check_out ? publicRooms(data.room_options, value.guests, data.available) : [],
        };
        return Response.json(result, { headers: RESPONSE_HEADERS });
      } catch (error) { return errorResponse(error); }
    },
    async create(request: Request) {
      try {
        assertSameOrigin(request);
        const raw = await readJson(request);
        const instant = now();
        const windowValidation = validateBookingRequest(raw, instant);
        // A successful request whose response was lost must remain recoverable after
        // its arrival time passes. PostgreSQL authenticates replay hashes first, and
        // applies the current date/time window before allocating any NEW reservation.
        const validated = windowValidation.valid ? windowValidation : validateBookingRequest(raw, instant, { enforceDateWindow: false });
        if (!validated.valid) throw new BookingError(422, 'VALIDATION_ERROR', 'Please review your reservation details.', windowValidation.valid ? validated.fields : windowValidation.fields);
        const { idempotency_key, ...details } = validated.value;
        // The random UUID is a recovery secret. A retry returns the same opaque credential;
        // database storage contains only hashes, and the credential never appears in a URL.
        const access_token = createHash('sha256').update(`innzoy-booking-access-v1:${idempotency_key}`).digest('base64url');
        let data: unknown;
        try {
          data = await rpc('create_booking', {
            ...Object.fromEntries(Object.entries(details).map(([key, value]) => [`p_${key}`, value])),
            p_idempotency_hash: sha256(idempotency_key), p_request_hash: sha256(JSON.stringify(details)),
            p_access_hash: sha256(access_token),
          });
        } catch (error) {
          if (error instanceof BookingError && error.status === 422 && !windowValidation.valid) {
            throw new BookingError(422, 'VALIDATION_ERROR', 'Please review your reservation details.', windowValidation.fields);
          }
          throw error;
        }
        const result: BookingCreated = { booking: safeBooking(data), access_token };
        return Response.json(result, { status: 201, headers: RESPONSE_HEADERS });
      } catch (error) { return errorResponse(error); }
    },
    async lookup(request: Request, reference: string) {
      try {
        const match = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.headers.get('authorization') ?? '');
        if (!match) throw new BookingError(401, 'UNAUTHORIZED', 'Use your private reservation link to view this booking.');
        if (!/^INZ-[A-F0-9]{20}$/.test(reference)) throw new BookingError(404, 'NOT_FOUND', 'We could not find this reservation.');
        const data = await rpc('get_booking', { p_reference: reference, p_access_hash: sha256(match[1]) });
        return Response.json({ booking: safeBooking(data) }, { headers: RESPONSE_HEADERS });
      } catch (error) { return errorResponse(error); }
    },
  };
}

export const bookingService = createBookingService();
