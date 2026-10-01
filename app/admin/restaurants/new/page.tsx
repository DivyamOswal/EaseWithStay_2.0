import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RestaurantForm } from '@/components/admin/restaurant-form';
import { listDestinationsForSelect } from '@/lib/services/restaurants';

export const dynamic = 'force-dynamic';

export default async function NewRestaurantPage() {
  const destinations = await listDestinationsForSelect();
  return (
    <div className="p-9">
      <Link href="/admin/restaurants" className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]">
        <ArrowLeft size={14} /> Back to restaurants
      </Link>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">New restaurant</h1>
      </div>
      <RestaurantForm mode="create" destinations={destinations} />
    </div>
  );
}