import { bookingService } from '@/lib/booking-server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return bookingService.requestKey(request);
}
