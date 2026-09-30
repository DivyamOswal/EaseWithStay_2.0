import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="mb-4 font-serif text-sm italic text-[var(--color-brass)]">
             a small detour
          </p>

          <h1 className="font-serif text-6xl leading-none text-[var(--color-pine)] sm:text-7xl">
            404
          </h1>

          <h2 className="mt-6 font-serif text-2xl text-[var(--color-pine)]">
            This page isn't on the map.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#4B4436]">
            The page you're looking for may have moved, been renamed, or never existed.
            Let's get you back to planning something better.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="w-full rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:w-auto"
            >
              Back to home
            </Link>
            <Link
              href="/destinations"
              className="w-full rounded-lg border-[1.5px] border-[var(--color-pine)] px-6 py-3 text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] sm:w-auto"
            >
              Browse destinations
            </Link>
          </div>

          <div className="mt-12 border-t border-[var(--color-paper-line)] pt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8270]">
              Or try one of these
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/planner"
                className="rounded-full border border-[var(--color-paper-line)] bg-white px-4 py-2 text-xs font-medium text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              >
                Start planning
              </Link>
              <Link
                href="/trips"
                className="rounded-full border border-[var(--color-paper-line)] bg-white px-4 py-2 text-xs font-medium text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              >
                My trips
              </Link>
              <Link
                href="/help"
                className="rounded-full border border-[var(--color-paper-line)] bg-white px-4 py-2 text-xs font-medium text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              >
                Help center
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-[var(--color-paper-line)] bg-white px-4 py-2 text-xs font-medium text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}