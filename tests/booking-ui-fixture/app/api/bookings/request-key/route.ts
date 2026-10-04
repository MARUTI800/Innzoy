import { fixtureService } from '../../../../lib/fixture';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return fixtureService.requestKey(request);
}
