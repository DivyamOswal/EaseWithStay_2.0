import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Check, Calendar, MapPin, Download } from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { getCurrentUser } from '@/lib/auth';
import { getBookingForUser } from '@/lib/services/bookings';

export const dynamic = 'force-dynamic';

function formatMoney(minor: number, currency: string) {
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

const itemTypeLabels: Record<string, string> = {
  HOTEL: 'Stay',
  FLIGHT: 'Flight',
  ACTIVITY: 'Activity',
  TRANSFER: 'Transport',
  FEE: 'Fee',
};

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/bookings/${(await params).id}`);

  const { id } = await params;
  const booking = await getBookingForUser(id, user.id);
  if (!booking) notFound();

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-[var(--color-paper-line)] bg-[var(--color-sand)] px-6 py-14 text-center md:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-dashed border-[var(--color-success)] text-[var(--color-success)]">
          <Check size={28} strokeWidth={3} />
        </div>
        <h1 className="mt-5 font-serif text-3xl text-[var(--color-pine)]">
          You are all set
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5B5343]">
          Your booking is confirmed. A confirmation has been sent to your email.
        </p>

        <div className="mx-auto mt-6 inline-block rounded-lg border border-dashed border-[var(--color-paper-line)] bg-white px-6 py-3 font-mono text-sm font-semibold tracking-wider text-[var(--color-pine)]">
          {booking.reference}
        </div>
      </section>

      {/* Summary */}
      <section className="mx-auto max-w-3xl px-6 py-10 md:px-12">
        <div className="rounded-2xl border border-[var(--color-paper-line)] bg-white">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-paper-line)] px-6 py-5">
            <div>
              <h2 className="font-serif text-xl text-[var(--color-pine)]">
                {booking.trip?.title ?? 'Your trip'}
              </h2>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#8A8270]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {booking.items.length} {booking.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A8270]">
                Total paid
              </div>
              <div className="mt-1 font-serif text-2xl text-[var(--color-pine)]">
                {formatMoney(booking.totalMinor, booking.currency)}
              </div>
            </div>
          </div>

          <ul className="divide-y divide-[var(--color-paper-line)]">
            {booking.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded bg-[var(--color-lagoon-soft)] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[var(--color-lagoon)]">
                      {itemTypeLabels[item.type] ?? item.type}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-pine)]">
                      {item.title}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-sm font-semibold text-[var(--color-pine)]">
                  {item.priceMinor > 0
                    ? formatMoney(item.priceMinor, booking.currency)
                    : '—'}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/trips/${booking.trip?.id ?? ''}`}
            className="w-full rounded-lg border-[1.5px] border-[var(--color-pine)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] sm:w-auto"
          >
            View trip details
          </Link>
          <Link
            href="/trips"
            className="w-full rounded-lg bg-[var(--color-coral)] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:w-auto"
          >
            Back to My Trips
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}