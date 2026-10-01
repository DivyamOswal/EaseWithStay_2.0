import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { RestaurantForm } from '@/components/admin/restaurant-form';
import { getRestaurantById, listDestinationsForSelect } from '@/lib/services/restaurants';

export const dynamic = 'force-dynamic';

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [restaurant, destinations] = await Promise.all([
    getRestaurantById(id),
    listDestinationsForSelect(),
  ]);
  if (!restaurant) notFound();
  return (
    <div className="p-9">
      <Link href="/admin/restaurants" className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-lagoon)] transition hover:text-[var(--color-coral)]">
        <ArrowLeft size={14} /> Back to restaurants
      </Link>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Edit restaurant</h1>
        <p className="mt-1 text-sm text-[#8A8270]">{restaurant.name}</p>
      </div>
      <RestaurantForm
        mode="edit"
        destinations={destinations}
        initialValues={{
          id: restaurant.id,
          destinationId: restaurant.destinationId,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          dietary: restaurant.dietary,
          lat: restaurant.lat,
          lng: restaurant.lng,
          priceLevel: restaurant.priceLevel,
          rating: restaurant.rating,
          imageId: restaurant.imageId ?? '',
          status: restaurant.status,
        }}
      />
    </div>
  );
}