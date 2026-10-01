import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ActivityForm } from '@/components/admin/activity-form';
import { listDestinationsForSelect } from '@/lib/services/activities';

export const dynamic = 'force-dynamic';

export default async function NewActivityPage() {
  const destinations = await listDestinationsForSelect();
  return (
    <div className="p-9">
      <Link href="/admin/activities" className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]">
        <ArrowLeft size={14} /> Back to activities
      </Link>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">New activity</h1>
      </div>
      <ActivityForm mode="create" destinations={destinations} />
    </div>
  );
}