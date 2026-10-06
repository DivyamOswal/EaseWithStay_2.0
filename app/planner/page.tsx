import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function PlannerPage() {
  return (
    <>
      <SiteNav />

      <main className="flex min-h-[60vh] items-center justify-center px-6 py-20 md:px-12">
        <div className="max-w-lg text-center">
          <p className="mb-4 font-serif text-sm italic text-[var(--color-brass)]">
            — coming next
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[var(--color-pine)]">
            The AI planner is being built.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#4B4436]">
            Phase 10.2 delivers the chat interface: describe your trip in one sentence,
            watch the itinerary build itself on the right.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/trips"
              className="w-full rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:w-auto"
            >
              See my trips
            </Link>
            <Link
              href="/destinations"
              className="w-full rounded-lg border-[1.5px] border-[var(--color-pine)] px-6 py-3 text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] sm:w-auto"
            >
              Browse destinations
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}