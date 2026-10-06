import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { TripDayTimeline } from '@/components/trips/trip-day-timeline';
import { DeleteTripButton } from '@/components/trips/delete-trip-button';
import { DownloadTripPDFButton } from '@/components/trips/download-trip-pdf-button';
import { getCurrentUser } from '@/lib/auth';
import { getTripForUser } from '@/lib/services/trips';

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  PLANNING: 'Planning',
  READY: 'Ready',
  BOOKED: 'Booked',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-[#F1EFEA] text-[#8A8270]',
  PLANNING: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  READY: 'bg-[#EFF6EE] text-[var(--color-success)]',
  BOOKED: 'bg-[var(--color-coral-soft)] text-[var(--color-coral-dark)]',
  COMPLETED: 'bg-[#F1EFEA] text-[#8A8270]',
  CANCELLED: 'bg-[#FDEDE7] text-[#C94E2C]',
};

function formatMoney(minor: number | null, currency: string) {
  if (minor == null) return '—';
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

function formatDateRange(start: Date | null, end: Date | null) {
  if (!start || !end) return 'Dates not set';
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${new Date(start).toLocaleDateString('en-IN', opts)} – ${new Date(
    end,
  ).toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/trips');

  const { id } = await params;
  const trip = await getTripForUser(id, user.id);
  if (!trip) notFound();

  return (
    <>
      <SiteNav />

      <section className="border-b border-[var(--color-paper-line)] bg-[var(--color-sand)] px-6 py-8 md:px-12">
        <Link
          href="/trips"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]"
        >
          <ArrowLeft size={14} />
          Back to My Trips
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${statusStyles[trip.status]}`}
              >
                {statusLabels[trip.status]}
              </span>
              <span className="text-xs text-[#8A8270]">
                {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'}
              </span>
            </div>

            <h1 className="font-serif text-3xl text-[var(--color-pine)]">
              {trip.title}
            </h1>

            <div className="mt-3 flex flex-wrap gap-5 text-sm text-[#7A7261]">
              {trip.destination && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {trip.destination.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="font-serif text-2xl text-[var(--color-pine)] md:text-right">
              {formatMoney(trip.budgetMinor, trip.currency)}
              <span className="block text-xs font-normal text-[#8A8270]">
                estimated total
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <DownloadTripPDFButton trip={trip} />
              <DeleteTripButton tripId={trip.id} tripTitle={trip.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12">
        {trip.days.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
            <h3 className="font-serif text-lg text-[var(--color-pine)]">
              No itinerary days yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#7A7261]">
              This trip was saved without a day-by-day plan.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {trip.days.map((day) => (
              <TripDayTimeline key={day.id} day={day} currency={trip.currency} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  );
}