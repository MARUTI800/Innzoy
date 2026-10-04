import type { Booking } from '@/lib/booking';

export function formatStayDate(date: string, short = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Select a date';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: short ? 'short' : 'long', ...(short ? {} : { year: 'numeric' }), timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

export function dateAfter(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function nightsBetween(start: string, end: string) {
  return start && end ? Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) : 0;
}

export function todayInHyderabad() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return `${parts.find(p => p.type === 'year')!.value}-${parts.find(p => p.type === 'month')!.value}-${parts.find(p => p.type === 'day')!.value}`;
}

export function guestErrors(details: { first_name: string; last_name: string; email: string; phone: string }) {
  const errors: Record<string, string> = {};
  for (const key of ['first_name', 'last_name'] as const) {
    if (!details[key].trim() || details[key].trim().length > 80) errors[key] = 'Enter a name between 1 and 80 characters.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()) || details.email.length > 254) errors.email = 'Enter a valid email address.';
  if (!/^\+?[\d\s().-]{7,25}$/.test(details.phone.trim()) || details.phone.replace(/\D/g, '').length < 7 || details.phone.replace(/\D/g, '').length > 15) errors.phone = 'Enter a valid phone number, including country code.';
  return errors;
}

// Calendar export uses all-day stay dates; no unverified check-out policy is implied.
export function bookingCalendar(booking: Booking, propertyName: string, address: string) {
  const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  const rows = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Innzoy//Reservations//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${booking.id}@innzoy.in`, `DTSTAMP:${new Date(booking.created_at).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART;VALUE=DATE:${booking.check_in.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${booking.check_out.replace(/-/g, '')}`, `SUMMARY:${escape(`Innzoy · ${propertyName}`)}`, `LOCATION:${escape(address)}`, `DESCRIPTION:${escape(`Reservation ${booking.booking_reference}. Arrival ${booking.arrival_time} (Asia/Kolkata). ${booking.guests} guest(s).`)}`, 'END:VEVENT', 'END:VCALENDAR'];
  // RFC 5545 folds at 75 octets, including multi-byte property names.
  return rows.map(row => {
    const lines: string[] = []; let line = ''; let bytes = 0;
    for (const char of row) { const size = new TextEncoder().encode(char).length; if (bytes + size > 75) { lines.push(line); line = ' '; bytes = 1; } line += char; bytes += size; }
    lines.push(line); return lines.join('\r\n');
  }).join('\r\n') + '\r\n';
}
