import { bookingService } from '@/lib/booking-server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  return bookingService.availability(request);
}
