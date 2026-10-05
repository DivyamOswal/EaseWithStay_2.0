import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {
  getTripForUser,
  deleteTripForUser,
  updateTripTitle,
} from '@/lib/services/trips';

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
  const trip = await getTripForUser(id, user.id);
  if (!trip) {
    return Response.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
  }

  return Response.json({ ok: true, trip });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title || title.length < 2) {
    return Response.json({ ok: false, error: 'INVALID_TITLE' }, { status: 400 });
  }

  const { id } = await ctx.params;
  const ok = await updateTripTitle(id, user.id, title);
  if (!ok) {
    return Response.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const ok = await deleteTripForUser(id, user.id);
  if (!ok) {
    return Response.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
  }

  return Response.json({ ok: true });
}