/** Shared, browser-safe booking contract. Hotel stays reserve nights, not arrival slots. */
export const BOOKING_TIMEZONE = 'Asia/Kolkata' as const;
export const MAX_BOOKING_NIGHTS = 30;
export const MAX_BOOKING_GUESTS = 12;
export const BOOKING_HORIZON_DAYS = 365;
// Guesthouses keep their existing external booking journeys in this release.
export const HOTEL_BOOKING_IDS = ['khajaguda', 'dlf-road', 'tngo-colony', 'hitec-city'] as const;

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export interface BookingRequest {
  property_id: string;
  /** An explicitly selected published room. Omit to let the hotel allocate a fitting room. */
  room_unit_id?: string;
  check_in: string;
  check_out: string;
  arrival_time: string;
  guests: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
  idempotency_key: string;
}
export interface Booking extends Omit<BookingRequest, 'idempotency_key'> {
  id: string;
  booking_reference: string;
  status: BookingStatus;
  created_at: string;
}
export interface BookingAvailability {
  property_id: string;
  month: string;
  dates: { date: string; available: boolean }[];
  slots: { time: string; available: boolean }[];
  available: boolean;
  room_options: BookingRoomOption[];
  timezone: typeof BOOKING_TIMEZONE;
  min_date: string;
  max_date: string;
  max_nights: number;
}
export interface BookingRoomOption {
  id: string;
  name: string;
  description: string;
  images: string[];
  max_guests: number;
  available: boolean;
}
export interface BookingCreated { booking: Booking; access_token: string }
export type BookingDraft = Omit<BookingRequest, 'idempotency_key'>;
export interface BookingRequestKey { fingerprint: string; idempotency_key: string }
export interface BookingApiError {
  error: { code: string; message: string; fields?: Record<string, string> };
}
export interface AvailabilityQuery {
  property_id: string;
  month: string;
  guests: number;
  check_in?: string;
  check_out?: string;
}
export type ValidationResult<T> = { valid: true; value: T } | { valid: false; fields: Record<string, string> };

export function bookingLocalNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { date: `${part('year')}-${part('month')}-${part('day')}`, time: `${part('hour')}:${part('minute')}` };
}
export function isBookingDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function addBookingDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function bookingNights(checkIn: string, checkOut: string) {
  return Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000);
}
export function bookingDateBounds(now = new Date()) {
  const min_date = bookingLocalNow(now).date;
  return { min_date, max_date: addBookingDays(min_date, BOOKING_HORIZON_DAYS), max_nights: MAX_BOOKING_NIGHTS };
}

export function validateBookingStay(checkIn: unknown, checkOut: unknown, now = new Date(), options: { enforceDateWindow?: boolean } = {}) {
  const fields: Record<string, string> = {};
  const bounds = bookingDateBounds(now);
  if (!isBookingDate(checkIn)) fields.check_in = 'Choose a valid check-in date.';
  else if (options.enforceDateWindow !== false && (checkIn < bounds.min_date || checkIn >= bounds.max_date)) fields.check_in = 'Choose a check-in date within the next year.';
  if (!isBookingDate(checkOut)) fields.check_out = 'Choose a valid check-out date.';
  else if (options.enforceDateWindow !== false && checkOut > bounds.max_date) fields.check_out = 'Choose a check-out date within the next year.';
  if (isBookingDate(checkIn) && isBookingDate(checkOut)) {
    const nights = bookingNights(checkIn, checkOut);
    if (nights < 1) fields.check_out = 'Check-out must be after check-in.';
    else if (nights > MAX_BOOKING_NIGHTS) fields.check_out = `For stays longer than ${MAX_BOOKING_NIGHTS} nights, please contact our team.`;
  }
  return fields;
}

function propertyValid(value: unknown): value is string {
  return typeof value === 'string' && HOTEL_BOOKING_IDS.some(id => id === value);
}
function guestsValid(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= MAX_BOOKING_GUESTS;
}
const controls = /[\u0000-\u001f\u007f]/;
export function isBookingRoomId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
export function validateBookingRequest(raw: unknown, now = new Date(), options: { enforceDateWindow?: boolean } = {}): ValidationResult<BookingRequest> {
  const input = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const fields = validateBookingStay(input.check_in, input.check_out, now, options);
  const string = (key: string) => typeof input[key] === 'string' ? (input[key] as string).trim() : '';
  if (!propertyValid(input.property_id)) fields.property_id = 'Choose an Innzoy hotel.';
  const requestedRoom = input.room_unit_id;
  const room_unit_id = typeof requestedRoom === 'string' ? requestedRoom.trim().toLowerCase() : '';
  if (requestedRoom !== undefined && requestedRoom !== null && (typeof requestedRoom !== 'string' || (room_unit_id && !isBookingRoomId(room_unit_id)))) fields.room_unit_id = 'Choose a valid room or let the hotel allocate one.';
  if (!guestsValid(input.guests)) fields.guests = `Choose between 1 and ${MAX_BOOKING_GUESTS} guests.`;
  const time = string('arrival_time');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) fields.arrival_time = 'Choose an arrival time.';
  else {
    const local = bookingLocalNow(now);
    if (options.enforceDateWindow !== false && input.check_in === local.date && time <= local.time) fields.arrival_time = 'Choose a future arrival time.';
  }
  for (const key of ['first_name', 'last_name']) {
    if (!string(key) || string(key).length > 80 || controls.test(string(key))) fields[key] = 'Enter a name of up to 80 characters.';
  }
  const email = string('email').toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || controls.test(email)) fields.email = 'Enter a valid email address.';
  const phone = string('phone');
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > 30 || controls.test(phone)) fields.phone = 'Enter a valid phone number, including country code.';
  const notes = string('notes');
  if (notes.length > 1500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(notes)) fields.notes = 'Use up to 1,500 characters for your requests.';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(string('idempotency_key'))) fields.idempotency_key = 'Refresh the reservation request and try again.';
  if (Object.keys(fields).length) return { valid: false, fields };
  return { valid: true, value: {
    property_id: input.property_id as string, check_in: input.check_in as string, check_out: input.check_out as string,
    ...(room_unit_id ? { room_unit_id } : {}),
    arrival_time: time, guests: input.guests as number, first_name: string('first_name'), last_name: string('last_name'),
    email, phone, notes, idempotency_key: string('idempotency_key').toLowerCase(),
  } };
}

export function validateAvailabilityQuery(raw: URLSearchParams, now = new Date()): ValidationResult<AvailabilityQuery> {
  const fields: Record<string, string> = {};
  const property_id = raw.get('property_id') ?? '';
  const month = raw.get('month') ?? '';
  const guestsRaw = raw.get('guests') ?? '2';
  const guests = /^\d{1,2}$/.test(guestsRaw) ? Number(guestsRaw) : NaN;
  const bounds = bookingDateBounds(now);
  if (!propertyValid(property_id)) fields.property_id = 'Choose an Innzoy hotel.';
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || month < bounds.min_date.slice(0, 7) || month > bounds.max_date.slice(0, 7)) fields.month = 'Choose a month within the next year.';
  if (!guestsValid(guests)) fields.guests = `Choose between 1 and ${MAX_BOOKING_GUESTS} guests.`;
  const check_in = raw.get('check_in') ?? undefined;
  const check_out = raw.get('check_out') ?? undefined;
  if (check_in !== undefined || check_out !== undefined) Object.assign(fields, validateBookingStay(check_in, check_out, now));
  if (Object.keys(fields).length) return { valid: false, fields };
  return { valid: true, value: { property_id, month, guests, check_in, check_out } };
}
