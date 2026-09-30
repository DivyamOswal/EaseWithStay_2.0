import { DestinationsTable } from '@/components/admin/destinations-table';
import { listDestinations } from '@/lib/services/destinations';

export const dynamic = 'force-dynamic';

export default async function AdminDestinationsPage() {
  const rows = await listDestinations();

  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">
          Destinations
        </h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          What travelers can browse and plan trips around.
        </p>
      </div>

      <DestinationsTable initial={rows} />
    </div>
  );
}