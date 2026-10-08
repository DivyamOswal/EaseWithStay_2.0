import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getBookingForUser } from '@/lib/services/bookings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const booking = await getBookingForUser(id, user.id);
  if (!booking) {
    return Response.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
  }
  return Response.json({ ok: true, booking });
}