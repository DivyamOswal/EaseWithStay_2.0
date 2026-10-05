'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserMenu, type SessionUser } from './user-menu';

type SessionState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; user: SessionUser };

export function SiteNav() {
  const [session, setSession] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/v1/auth/session', { cache: 'no-store' });
        if (cancelled) return;

        if (!res.ok) {
          setSession({ status: 'guest' });
          return;
        }
        const data = await res.json();
        setSession({
          status: 'authenticated',
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          },
        });
      } catch {
        if (!cancelled) setSession({ status: 'guest' });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav className="flex items-center justify-between border-b border-[var(--color-paper-line)] bg-[var(--color-sand)] px-6 py-5 md:px-12">
      <Link
        href="/"
        className="flex items-center gap-2 font-serif text-lg font-semibold text-[var(--color-pine)]"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12L21 4L13 22L11 13L3 12Z"
            stroke="#142B45"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        EaseWithStay
      </Link>

      <div className="hidden gap-8 text-sm font-medium text-[var(--color-pine-2)] md:flex">
        <Link href="/how-it-works" className="transition hover:text-[var(--color-coral)]">
          How it works
        </Link>
        <Link href="/destinations" className="transition hover:text-[var(--color-coral)]">
          Destinations
        </Link>
        <Link href="/pricing" className="transition hover:text-[var(--color-coral)]">
          Pricing
        </Link>
        {session.status !== 'authenticated' && (
          <Link href="/login" className="transition hover:text-[var(--color-coral)]">
            Log in
          </Link>
        )}
      </div>

      {/* Right-hand side: state-dependent */}
      <div className="flex items-center gap-3">
        {session.status === 'loading' && (
          <div className="h-9 w-24 animate-pulse rounded-full bg-[var(--color-paper-line)]" />
        )}

        {session.status === 'guest' && (
          <Link
            href="/register"
            className="rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
          >
            Start planning
          </Link>
        )}

        {session.status === 'authenticated' && (
          <>
            <Link
              href="/planner"
              className="hidden rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:inline-block"
            >
              Plan a trip
            </Link>
            <UserMenu user={session.user} />
          </>
        )}
      </div>
    </nav>
  );
}