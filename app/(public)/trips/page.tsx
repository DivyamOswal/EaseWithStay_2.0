import Link from 'next/link';
import { MapPinned, Plus } from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { TripCard } from '@/components/trips/trip-card';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { listUserTrips } from '@/lib/services/trips';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?next=/trips');
  }

  const trips = await listUserTrips(user.id);

  const upcoming = trips.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED',
  );
  const past = trips.filter(
    (t) => t.status === 'COMPLETED' || t.status === 'CANCELLED',
  );

  return (
    <>
      <SiteNav />

      <section className="px-6 pt-12 md:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[var(--color-pine)]">
              My Trips
            </h1>
            <p className="mt-1.5 text-sm text-[#8A8270]">
              Every itinerary you've saved with EaseWithStay.
            </p>
          </div>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
          >
            <Plus size={15} />
            Plan a new trip
          </Link>
        </div>
      </section>

      {trips.length === 0 ? (
        <section className="px-6 py-16 md:px-12">
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-lagoon-soft)]">
              <MapPinned size={22} className="text-[var(--color-lagoon)]" />
            </div>
            <h2 className="font-serif text-xl text-[var(--color-pine)]">
              No trips yet
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-[#7A7261]">
              Describe your next trip in one sentence. We'll build a day-by-day plan you can save here.
            </p>
            <Link
              href="/planner"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
            >
              <Plus size={15} />
              Start planning
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className="px-6 py-10 md:px-12">
              <h2 className="mb-5 font-serif text-xl text-[var(--color-pine)]">
                Upcoming
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section className="border-t border-[var(--color-paper-line)] px-6 py-10 md:px-12">
              <h2 className="mb-5 font-serif text-xl text-[var(--color-pine)]">
                Past trips
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <SiteFooter />
    </>
  );
}