import { fixtureService } from '../../../../lib/fixture';
export const runtime = 'nodejs';
export async function GET(request: Request) { return fixtureService.availability(request); }
