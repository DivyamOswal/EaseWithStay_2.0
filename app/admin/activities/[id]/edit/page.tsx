import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ActivityForm } from '@/components/admin/activity-form';
import { getActivityById, listDestinationsForSelect } from '@/lib/services/activities';

export const dynamic = 'force-dynamic';

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [activity, destinations] = await Promise.all([
    getActivityById(id),
    listDestinationsForSelect(),
  ]);
  if (!activity) notFound();
  return (
    <div className="p-9">
      <Link href="/admin/activities" className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]">
        <ArrowLeft size={14} /> Back to activities
      </Link>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Edit activity</h1>
        <p className="mt-1 text-sm text-[#8A8270]">/{activity.slug}</p>
      </div>
      <ActivityForm
        mode="edit"
        destinations={destinations}
        initialValues={{
          id: activity.id,
          destinationId: activity.destinationId,
          name: activity.name,
          slug: activity.slug,
          description: activity.description ?? '',
          durationMin: activity.durationMin,
          priceMinor: activity.priceMinor,
          minAge: activity.minAge,
          tags: activity.tags,
          imageId: activity.imageId ?? '',
          status: activity.status,
        }}
      />
    </div>
  );
}