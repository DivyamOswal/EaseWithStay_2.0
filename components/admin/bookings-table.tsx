'use client';

import { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import type { BookingRow } from '@/lib/services/bookings';

type Props = { initial: BookingRow[] };

const statusStyles: Record<string, string> = {
  PENDING: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  PAYMENT_PENDING: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  PAID: 'bg-[var(--color-coral-soft)] text-[var(--color-coral-dark)]',
  CONFIRMING: 'bg-[var(--color-coral-soft)] text-[var(--color-coral-dark)]',
  CONFIRMED: 'bg-[#EFF6EE] text-[var(--color-success)]',
  PAYMENT_FAILED: 'bg-[#FDEDE7] text-[#C94E2C]',
  BOOKING_FAILED: 'bg-[#FDEDE7] text-[#C94E2C]',
  CANCELLED: 'bg-[#F1EFEA] text-[#8A8270]',
  REFUND_PENDING: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  REFUNDED: 'bg-[#F1EFEA] text-[#8A8270]',
};

function formatMoney(minor: number, currency: string) {
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

export function BookingsTable({ initial }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const filtered = initial.filter((r) => {
    const matchesStatus = status === 'ALL' || r.status === status;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.reference.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8270]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference or customer…"
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-coral)]"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-[var(--color-paper-line)] bg-white px-3 py-2 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
          >
            <option value="ALL">All statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
          <Calendar size={28} className="mx-auto mb-3 text-[#B7AE96]" />
          <h3 className="font-serif text-lg text-[var(--color-pine)]">
            {initial.length === 0 ? 'No bookings yet' : 'No matches'}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#7A7261]">
            {initial.length === 0
              ? 'Booking appears here once travelers complete checkout. Bookings arrive in Phase 15.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-paper-line)] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-paper-line)] bg-[#FEFDFA]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Reference</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Customer</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Trip</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Amount</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[var(--color-paper-line)] last:border-0 hover:bg-[#FEFDFA]">
                  <td className="px-5 py-3.5 font-mono text-sm text-[var(--color-pine)]">{r.reference}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-semibold text-[var(--color-pine)]">{r.userName}</div>
                    <div className="text-xs text-[#8A8270]">{r.userEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-pine-2)]">{r.tripTitle ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${statusStyles[r.status] ?? statusStyles.PENDING}`}>
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-pine)]">
                    {formatMoney(r.totalMinor, r.currency)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8270]">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="mt-4 text-xs text-[#8A8270]">
          Showing {filtered.length} of {initial.length} {initial.length === 1 ? 'booking' : 'bookings'}
        </p>
      )}
    </>
  );
}