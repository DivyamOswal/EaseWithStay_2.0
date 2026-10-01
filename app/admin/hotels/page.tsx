import { HotelsTable } from '@/components/admin/hotels-table';
import { listHotels } from '@/lib/services/hotels';

export const dynamic = 'force-dynamic';

export default async function AdminHotelsPage() {
  const rows = await listHotels();

  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Hotels</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Your hotel inventory across all destinations.
        </p>
      </div>

      <HotelsTable initial={rows} />
    </div>
  );
}