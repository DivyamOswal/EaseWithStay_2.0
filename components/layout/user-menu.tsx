'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, User, MapPin, Shield, LogOut } from 'lucide-react';

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
};

export function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('[logout]', err);
    }
    // Hard navigation with cache-bust query so the browser is guaranteed
    // to reload. `router.push('/')` would leave SiteNav mounted with a
    // stale session; `window.location.href = '/'` is a no-op when the
    // current URL is already '/'.
    window.location.href = '/?logged_out=' + Date.now();
  }

  const initials =
    (user.name ?? user.email)
      .split(/[\s@]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? '')
      .join('') || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[var(--color-paper-line)] bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-coral)] text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden sm:inline max-w-[120px] truncate">
          {user.name ?? user.email}
        </span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition' : 'transition'} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--color-paper-line)] bg-white py-1.5 shadow-lg">
          <div className="border-b border-[var(--color-paper-line)] px-4 py-2.5">
            <div className="text-sm font-semibold text-[var(--color-pine)] truncate">
              {user.name ?? 'Traveler'}
            </div>
            <div className="text-xs text-[#8A8270] truncate">{user.email}</div>
          </div>

          <Link
            href="/trips"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-pine-2)] transition hover:bg-[#FEFDFA]"
          >
            <MapPin size={14} />
            My Trips
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-pine-2)] transition hover:bg-[#FEFDFA]"
          >
            <User size={14} />
            Profile
          </Link>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-pine-2)] transition hover:bg-[#FEFDFA]"
            >
              <Shield size={14} />
              Admin
            </Link>
          )}

          <div className="my-1 border-t border-[var(--color-paper-line)]" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-[#C94E2C] transition hover:bg-[#FDEDE7] disabled:opacity-50"
          >
            <LogOut size={14} />
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  );
}