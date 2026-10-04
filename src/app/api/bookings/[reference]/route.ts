import { bookingService } from '@/lib/booking-server';

export const runtime = 'nodejs';

export async function GET(request: Request, context: { params: Promise<{ reference: string }> }) {
  const { reference } = await context.params;
  return bookingService.lookup(request, reference);
}
