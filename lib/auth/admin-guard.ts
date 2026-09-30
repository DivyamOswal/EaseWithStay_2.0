import 'server-only';
import { redirect } from 'next/navigation';
import { getCurrentUser, type SessionUser } from './current-user';

/**
 * Use inside any server component under app/admin/*.
 * - Not logged in  → redirect to /login?next=<current>
 * - Logged in non-admin → redirect to /
 * - Admin → returns the user
 */
export async function requireAdminPage(nextPath?: string): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    const target = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login';
    redirect(target);
  }

  if (user.role !== 'ADMIN') {
    redirect('/');
  }

  return user;
}