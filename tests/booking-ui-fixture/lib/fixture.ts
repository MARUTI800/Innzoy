import 'server-only';
import { randomUUID } from 'node:crypto';
import { createBookingService } from '@/lib/booking-server';
import { addBookingDays, bookingLocalNow, type Booking, type BookingRoomOption } from '@/lib/booking';
import { PROPERTIES } from '@/data/innzoyData';

type Entry = { booking: Booking; allocatedRoomId: string; requestHash: string; accessHash: string };
type Occupied = { property: string; start: string; end: string; roomId?: string };
type FixtureState = { offline: boolean; slow: boolean; conflictNext: boolean; records: Map<string, Entry>; occupied: Occupied[] };
const fixtureGlobal = globalThis as typeof globalThis & { __innzoyBookingUiFixture?: FixtureState };
export const state = fixtureGlobal.__innzoyBookingUiFixture ??= {
  offline: false, slow: false, conflictNext: false, records: new Map(), occupied: [],
};

/** Test identities and capacities exist only in this isolated fixture. */
function rooms(propertyId: string) {
  const propertyIndex = PROPERTIES.findIndex(property => property.id === propertyId);
  const property = PROPERTIES[propertyIndex];
  if (!property || property.bookingUrl || property.comingSoon) return null;
  const roomId = (unit: number) => `10000000-0000-4000-8000-${String(propertyIndex * 10 + unit).padStart(12, '0')}`;
  const sourcePhotos = property.gallery.length ? property.gallery : [property.heroImage];
  const options = [
    { id: roomId(1), name: 'Test room A', description: 'Synthetic local QA only. Hotel photographs illustrate the layout; they are not verified room inventory.', images: sourcePhotos.slice(0, 2), max_guests: 2 },
    { id: roomId(2), name: 'Test room B · occupied', description: 'Synthetic occupied room for the unavailable-choice check. These hotel photographs are not an inventory mapping.', images: sourcePhotos.slice(2, 4).length ? sourcePhotos.slice(2, 4) : sourcePhotos.slice(0, 2), max_guests: 8 },
  ];
  return { options, automaticId: roomId(3) };
}

function free(property: string, start: string, end: string, roomId: string) {
  const blocked = addBookingDays(bookingLocalNow().date, 20);
  if (start <= blocked && blocked < end) return false;
  const published = rooms(property);
  if (!published || published.options[1].id === roomId) return false;
  const occupied = [...state.occupied, ...Array.from(state.records.values(), record => ({ property: record.booking.property_id, roomId: record.allocatedRoomId, start: record.booking.check_in, end: record.booking.check_out }))];
  return !occupied.some(room => room.property === property && (!room.roomId || room.roomId === roomId) && room.start < end && room.end > start);
}

function availableUnits(property: string, start: string, end: string, guests: number) {
  const inventory = rooms(property);
  if (!inventory) return [];
  return [...inventory.options, { id: inventory.automaticId, max_guests: 8 }]
    .filter(room => room.max_guests >= guests && free(property, start, end, room.id));
}

const transport: typeof globalThis.fetch = async (input, init) => {
  await new Promise(resolve => setTimeout(resolve, state.slow ? 3000 : 300));
  if (state.offline) throw new Error('Synthetic backend outage');
  const rpc = new URL(String(input)).pathname.split('/').at(-1);
  const args = JSON.parse(String(init?.body ?? '{}')) as Record<string, string | number | null>;
  const fail = (message: string) => Response.json({ message }, { status: 400 });
  if (rpc === 'booking_availability') {
    const first = String(args.p_month);
    const last = new Date(`${first}T12:00:00Z`);
    last.setUTCMonth(last.getUTCMonth() + 1, 0);
    const count = last.getUTCDate();
    const property = String(args.p_property_id);
    const guests = Number(args.p_guests);
    const inventory = rooms(property);
    if (!inventory) return fail('BOOKING_UNAVAILABLE');
    const dates = Array.from({ length: count }, (_, index) => {
      const date = addBookingDays(first, index);
      return { date, available: availableUnits(property, date, addBookingDays(date, 1), guests).length > 0 };
    });
    const start = args.p_check_in ? String(args.p_check_in) : '';
    const end = args.p_check_out ? String(args.p_check_out) : '';
    const available = Boolean(start && end && availableUnits(property, start, end, guests).length > 0);
    const local = bookingLocalNow();
    const slots = start && end ? ['09:00', '10:30', '12:00', '14:00', '16:30', '18:00'].map(time => ({
      time, available: available && time !== '12:00' && (start !== local.date || time > local.time),
    })) : [];
    const room_options: BookingRoomOption[] = start && end ? inventory.options
      .filter(room => room.max_guests >= guests)
      .map(room => ({ ...room, available: available && free(property, start, end, room.id) })) : [];
    return Response.json({ dates, slots, available, room_options });
  }
  if (rpc === 'create_booking') {
    const hash = String(args.p_idempotency_hash);
    const previous = state.records.get(hash);
    if (previous) return previous.requestHash === args.p_request_hash && previous.accessHash === args.p_access_hash ? Response.json(previous.booking) : fail('IDEMPOTENCY_CONFLICT');
    const property = String(args.p_property_id);
    const start = String(args.p_check_in);
    const end = String(args.p_check_out);
    const guests = Number(args.p_guests);
    const requestedRoomId = args.p_room_unit_id ? String(args.p_room_unit_id) : '';
    const inventory = rooms(property);
    if (!inventory) return fail('BOOKING_UNAVAILABLE');
    if (state.conflictNext) {
      state.conflictNext = false;
      state.occupied.push({ property, start, end });
      return fail('BOOKING_CONFLICT');
    }
    const candidates = availableUnits(property, start, end, guests);
    const allocatedRoomId = requestedRoomId
      ? candidates.find(room => room.id === requestedRoomId && inventory.options.some(option => option.id === requestedRoomId))?.id
      : candidates[0]?.id;
    if (!allocatedRoomId || args.p_arrival_time === '12:00') return fail('BOOKING_CONFLICT');
    const id = randomUUID();
    const booking: Booking = {
      id, booking_reference: `INZ-${id.replace(/-/g, '').slice(0, 20).toUpperCase()}`,
      property_id: property, check_in: start, check_out: end, arrival_time: String(args.p_arrival_time),
      guests, ...(requestedRoomId ? { room_unit_id: requestedRoomId } : {}), first_name: String(args.p_first_name), last_name: String(args.p_last_name),
      email: String(args.p_email), phone: String(args.p_phone), notes: String(args.p_notes),
      status: 'confirmed', created_at: new Date().toISOString(),
    };
    state.records.set(hash, { booking, allocatedRoomId, requestHash: String(args.p_request_hash), accessHash: String(args.p_access_hash) });
    return Response.json(booking);
  }
  if (rpc === 'get_booking') {
    const found = Array.from(state.records.values()).find(record => record.booking.booking_reference === args.p_reference && record.accessHash === args.p_access_hash);
    return found ? Response.json(found.booking) : fail('BOOKING_NOT_FOUND');
  }
  return fail('Unknown test RPC');
};

export const fixtureService = createBookingService({
  fetch: transport,
  env: () => ({ SUPABASE_URL: 'https://synthetic-booking.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-only-no-network' }),
});
