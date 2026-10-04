import { addBookingDays, bookingNights, isBookingDate, MAX_BOOKING_NIGHTS } from '@/lib/booking';

export type DeparturePreview = {
  start: string;
  end: string;
  nights: number;
  state: 'preview' | 'blocked' | 'unchecked' | 'request';
  blockedNight?: string;
};

/** A date preview is never a whole-stay availability promise. Nights exclude departure. */
export function departurePreview(
  start: string,
  end: string,
  availability: ReadonlyMap<string, boolean>,
  requestOnly = false,
): DeparturePreview | null {
  if (!isBookingDate(start) || !isBookingDate(end)) return null;
  const nights = bookingNights(start, end);
  if (nights < 1 || nights > MAX_BOOKING_NIGHTS) return null;
  const preview = { start, end, nights };
  if (requestOnly) return { ...preview, state: 'request' };

  let unchecked = false;
  for (let night = start; night < end; night = addBookingDays(night, 1)) {
    if (availability.get(night) === false) return { ...preview, state: 'blocked', blockedNight: night };
    if (!availability.has(night)) unchecked = true;
  }
  return { ...preview, state: unchecked ? 'unchecked' : 'preview' };
}
