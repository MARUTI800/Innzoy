import { fixtureService } from '../../../../lib/fixture';
export const runtime = 'nodejs';
export async function GET(request: Request, context: { params: Promise<{ reference: string }> }) {
  return fixtureService.lookup(request, (await context.params).reference);
}
