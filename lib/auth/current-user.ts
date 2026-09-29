import 'server-only';
import { readSessionCookie } from './cookies';
import { verifySession } from './session';

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
  image: string | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const rawToken = await readSessionCookie();
  if (!rawToken) return null;

  const session = await verifySession(rawToken);
  if (!session) return null;

  return session.user;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}