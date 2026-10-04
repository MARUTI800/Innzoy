import { state } from '../../../lib/fixture';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const { action } = await request.json();
  if (action === 'reset') {
    state.offline = false; state.slow = false; state.conflictNext = false; state.records.clear(); state.occupied = [];
    return Response.json({ message: 'Fixture reset. Synthetic backend ready; no saved test bookings.' });
  }
  state.offline = action === 'offline'; state.slow = action === 'slow'; state.conflictNext = action === 'conflict';
  return Response.json({ message: action === 'offline' ? 'Synthetic backend failure enabled.' : action === 'slow' ? 'Synthetic requests take three seconds.' : 'The next confirmation will lose its room to a synthetic competing reservation.' });
}
