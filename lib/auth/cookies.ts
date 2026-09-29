import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './session';

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
};

export async function setSessionCookie(rawToken: string, expiresAt: Date) {
  const store = await cookies();
  store.set(SESSION_COOKIE, rawToken, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', {
    ...COOKIE_OPTIONS,
    expires: new Date(0),
  });
}

export async function readSessionCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}