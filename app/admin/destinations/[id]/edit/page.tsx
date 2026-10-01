import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DestinationForm } from '@/components/admin/destination-form';
import { getDestinationById } from '@/lib/services/destinations';

export const dynamic = 'force-dynamic';

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = await getDestinationById(id);

  if (!dest) notFound();

  return (
    <div className="p-9">
      <Link
        href="/admin/destinations"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]"
      >
        <ArrowLeft size={14} />
        Back to destinations
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">
          Edit destination
        </h1>
        <p className="mt-1 text-sm text-[#8A8270]">/{dest.slug}</p>
      </div>

      <DestinationForm
        mode="edit"
        initialValues={{
          id: dest.id,
          name: dest.name,
          slug: dest.slug,
          country: dest.country,
          region: dest.region ?? '',
          heroImageId: dest.heroImageId ?? '',
          description: dest.description ?? '',
          status: dest.status,
        }}
      />
    </div>
  );
}