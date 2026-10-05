import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { listUserTrips } from '@/lib/services/trips';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const trips = await listUserTrips(user.id);
  return Response.json({ ok: true, count: trips.length, trips });
}