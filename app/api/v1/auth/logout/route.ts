import { NextRequest } from 'next/server';
import { readSessionCookie } from '@/lib/auth/cookies';
import { deleteSession } from '@/lib/auth/session';
import { clearSessionCookie } from '@/lib/auth/cookies';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest) {
  const rawToken = await readSessionCookie();
  if (rawToken) await deleteSession(rawToken);
  await clearSessionCookie();
  return Response.json({ ok: true });
}