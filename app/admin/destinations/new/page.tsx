import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DestinationForm } from '@/components/admin/destination-form';

export const dynamic = 'force-dynamic';

export default function NewDestinationPage() {
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
          New destination
        </h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Add a new place travelers can plan trips around.
        </p>
      </div>

      <DestinationForm initialState={{ ok: false }} />
    </div>
  );
}