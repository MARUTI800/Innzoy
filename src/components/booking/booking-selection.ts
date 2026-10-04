import { BOOKING_HORIZON_DAYS, MAX_BOOKING_GUESTS, MAX_BOOKING_NIGHTS, isBookingDate } from '@/lib/booking';
import { dateAfter, nightsBetween, todayInHyderabad } from './booking-client';

/** An opening preference, never an availability result or a reservation. */
export type BookingSelection = { checkIn?: string; checkOut?: string; guests?: number };
type StoredSelection = { checkIn?: unknown; checkOut?: unknown; guests?: unknown };

/** Only public stay preferences travel between the hotel catalogue and detail page. */
export function bookingSelectionFromSearch(search: Pick<URLSearchParams, 'get' | 'has'>): BookingSelection | undefined {
  if (!['check_in', 'check_out', 'guests'].some(key => search.has(key))) return undefined;
  const value = search.get('guests') ?? '';
  return {
    ...(search.has('check_in') ? { checkIn: search.get('check_in') ?? '' } : {}),
    ...(search.has('check_out') ? { checkOut: search.get('check_out') ?? '' } : {}),
    ...(search.has('guests') ? { guests: /^[1-9]\d?$/.test(value) ? Number(value) : Number.NaN } : {}),
  };
}

export function hotelBrowseHref(selection?: BookingSelection, intent?: 'stay' | 'corporate') {
  const query = new URLSearchParams({ category: 'hotel' });
  if (selection) {
    const valid = resolveBookingSelection(selection);
    if (selection.checkIn !== undefined) query.set('check_in', valid.checkIn);
    if (selection.checkOut !== undefined) query.set('check_out', valid.checkOut);
    if (selection.guests !== undefined) query.set('guests', String(valid.guests));
  }
  if (intent === 'corporate') query.set('booking_intent', 'corporate');
  return `/stays?${query}`;
}

export function resolveBookingSelection(selection?: BookingSelection, draft?: StoredSelection, today = todayInHyderabad()) {
  // A supplied date pair belongs together: never combine a new arrival with an old departure.
  // Empty strings deliberately clear saved dates when the hero has no date preference.
  const explicitDates = selection?.checkIn !== undefined || selection?.checkOut !== undefined;
  const requestedIn = explicitDates ? selection?.checkIn : draft?.checkIn;
  const requestedOut = explicitDates ? selection?.checkOut : draft?.checkOut;
  const maximum = dateAfter(today, BOOKING_HORIZON_DAYS);
  // Arrival must leave room for at least one night before the final permitted departure.
  const checkIn = isBookingDate(requestedIn) && requestedIn >= today && requestedIn < maximum ? requestedIn : '';
  const nights = checkIn && isBookingDate(requestedOut) ? nightsBetween(checkIn, requestedOut) : 0;
  const checkOut = checkIn && isBookingDate(requestedOut) && requestedOut <= maximum && nights >= 1 && nights <= MAX_BOOKING_NIGHTS ? requestedOut : '';
  const requestedGuests = selection?.guests !== undefined ? selection.guests : draft?.guests;
  const guests = typeof requestedGuests === 'number' && Number.isInteger(requestedGuests) && requestedGuests >= 1 && requestedGuests <= MAX_BOOKING_GUESTS ? requestedGuests : 2;
  return { checkIn, checkOut, guests };
}
