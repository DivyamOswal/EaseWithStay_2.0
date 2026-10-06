import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, hashSessionToken } from '@/lib/auth/session';
import { readSessionCookie } from '@/lib/auth/cookies';
import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest) {
  const rawToken = await readSessionCookie();

  if (rawToken) {
    try {
      const tokenHash = hashSessionToken(rawToken);
      await prisma.session.deleteMany({ where: { tokenHash } });
    } catch (err) {
      console.error('[logout] session delete failed:', err);
    }
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });

  return res;
}