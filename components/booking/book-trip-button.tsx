'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { CalendarCheck, Loader2 } from 'lucide-react';

export function BookTripButton({
  tripId,
  totalMinor,
  currency,
}: {
  tripId: string;
  totalMinor: number | null;
  currency: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !totalMinor || totalMinor <= 0;

  async function handleBook() {
    if (disabled || loading) return;
    setError(null);
    setLoading(true);

    // Idempotency key generated once per click — retrying the same
    // request returns the same booking instead of duplicating.
    const idempotencyKey = nanoid(24);

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tripId, idempotencyKey }),
      });
      const data = await res.json();

      if (!res.ok || !data.bookingId) {
        setError(data.message ?? 'Could not create the booking.');
        setLoading(false);
        return;
      }

      router.push(`/bookings/${data.bookingId}`);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  const symbol = currency === 'INR' ? '₹' : currency + ' ';

  return (
    <div>
      <button
        type="button"
        onClick={handleBook}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-pine)] px-5 py-3 text-sm font-semibold text-[var(--color-sand)] transition hover:bg-[var(--color-pine-2)] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Booking…
          </>
        ) : (
          <>
            <CalendarCheck size={15} />
            Book this trip
            {totalMinor ? ` — ${symbol}${(totalMinor / 100).toLocaleString('en-IN')}` : ''}
          </>
        )}
      </button>
      {error && <p className="mt-2 text-xs text-[#C94E2C]">{error}</p>}
    </div>
  );
}