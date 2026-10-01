import { ActivitiesTable } from '@/components/admin/activities-table';
import { listActivities } from '@/lib/services/activities';

export const dynamic = 'force-dynamic';

export default async function AdminActivitiesPage() {
  const rows = await listActivities();
  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Activities</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Things travelers can book within a destination.
        </p>
      </div>
      <ActivitiesTable initial={rows} />
    </div>
  );
}