import { prisma } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [
    userCount,
    destinationCount,
    tripCount,
    bookingCount,
    confirmedBookings,
    pendingBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.destination.count(),
    prisma.trip.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
  ]);

  const stats = [
    { label: 'Total users', value: userCount },
    { label: 'Destinations', value: destinationCount },
    { label: 'Trips planned', value: tripCount },
    { label: 'Bookings', value: bookingCount },
  ];

  return (
    <div className="p-9">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[var(--color-pine)]">Overview</h1>
          <p className="mt-1 text-sm text-[#8A8270]">
            Counts update in real time from your Neon database.
          </p>
        </div>
      </div>

      {/* Stat grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--color-paper-line)] bg-white p-5"
          >
            <div className="text-xs font-semibold text-[#8A8270]">{s.label}</div>
            <div className="mt-2 font-serif text-3xl text-[var(--color-pine)]">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Booking status split */}
      <div className="mb-8 rounded-xl border border-[var(--color-paper-line)] bg-white">
        <div className="border-b border-[var(--color-paper-line)] px-5 py-4 text-sm font-semibold text-[var(--color-pine)]">
          Bookings by status
        </div>
        <div className="grid grid-cols-2 divide-x divide-[var(--color-paper-line)]">
          <div className="p-5">
            <div className="text-xs font-semibold text-[#8A8270]">Confirmed</div>
            <div className="mt-2 font-serif text-2xl text-[var(--color-success)]">
              {confirmedBookings}
            </div>
          </div>
          <div className="p-5">
            <div className="text-xs font-semibold text-[#8A8270]">Pending</div>
            <div className="mt-2 font-serif text-2xl text-[var(--color-brass)]">
              {pendingBookings}
            </div>
          </div>
        </div>
      </div>

      {/* Next steps callout */}
      <div className="rounded-xl border border-dashed border-[var(--color-paper-line)] bg-[var(--color-sand)] p-6">
        <h2 className="font-serif text-base text-[var(--color-pine)]">
          Coming next
        </h2>
        <p className="mt-1.5 text-sm text-[#7A7261]">
          Sub-step 6.2 adds the destinations list. Sub-step 6.3 adds create/edit forms.
          Sub-step 6.7 wires ImageKit document uploads.
        </p>
      </div>
    </div>
  );
}