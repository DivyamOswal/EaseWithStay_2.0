import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import type { TripSummary } from '@/lib/services/trips';

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-[#F1EFEA] text-[#8A8270]',
  PLANNING: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  READY: 'bg-[#EFF6EE] text-[var(--color-success)]',
  BOOKED: 'bg-[var(--color-coral-soft)] text-[var(--color-coral-dark)]',
  COMPLETED: 'bg-[#F1EFEA] text-[#8A8270]',
  CANCELLED: 'bg-[#FDEDE7] text-[#C94E2C]',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  PLANNING: 'Planning',
  READY: 'Ready',
  BOOKED: 'Booked',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

function formatMoney(minor: number | null, currency: string) {
  if (minor == null) return '—';
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

function formatDateRange(start: Date | null, end: Date | null) {
  if (!start || !end) return 'Dates not set';
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${new Date(start).toLocaleDateString('en-IN', opts)} – ${new Date(end).toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
}

export function TripCard({ trip }: { trip: TripSummary }) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-paper-line)] bg-white transition hover:-translate-y-0.5 hover:border-[var(--color-coral)] hover:shadow-[0_12px_26px_-10px_rgba(20,43,69,.18)]"
    >
      {/* Hero strip — decorative pine gradient, no image dependency */}
      <div className="relative h-[130px] w-full overflow-hidden bg-gradient-to-br from-[var(--color-pine)] via-[var(--color-pine)] to-[var(--color-pine-2)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin size={36} className="text-white/20" />
        </div>
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur ${statusStyles[trip.status]}`}
        >
          {statusLabels[trip.status]}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 py-4">
        <h3 className="line-clamp-1 font-serif text-base text-[var(--color-pine)]">
          {trip.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A8270]">
          <MapPin size={12} />
          <span className="line-clamp-1">
            {trip.destinationName ?? 'No destination'}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A8270]">
          <Calendar size={12} />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-paper-line)] pt-3.5">
          <span className="text-xs text-[#8A8270]">
            {trip.dayCount} {trip.dayCount === 1 ? 'day' : 'days'}
          </span>
          <span className="text-sm font-bold text-[var(--color-pine)]">
            {formatMoney(trip.budgetMinor, trip.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}