import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HotelForm } from '@/components/admin/hotel-form';
import { listDestinationsForSelect } from '@/lib/services/hotels';

export const dynamic = 'force-dynamic';

export default async function NewHotelPage() {
  const destinations = await listDestinationsForSelect();

  return (
    <div className="p-9">
      <Link
        href="/admin/hotels"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]"
      >
        <ArrowLeft size={14} />
        Back to hotels
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">New hotel</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Add a hotel to one of your destinations.
        </p>
      </div>

      <HotelForm mode="create" destinations={destinations} />
    </div>
  );
}