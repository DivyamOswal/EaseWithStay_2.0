import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'ews_session';

// Routes that require login
const PROTECTED_PREFIXES = ['/planner', '/trips', '/bookings', '/profile', '/notifications'];

// Routes that require ADMIN role (full check happens in the page)
const ADMIN_PREFIXES = ['/admin'];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  const needsAuth =
    PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!needsAuth) return NextResponse.next();

  if (!hasSession) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image
     * - favicon, public assets
     * - /api routes (handled by route handlers themselves)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};