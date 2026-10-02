import { BookingsTable } from '@/components/admin/bookings-table';
import { listBookings } from '@/lib/services/bookings';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const rows = await listBookings();
  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Bookings</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Every booking across all customers. Read-only view.
        </p>
      </div>
      <BookingsTable initial={rows} />
    </div>
  );
}