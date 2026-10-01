import { RestaurantsTable } from '@/components/admin/restaurants-table';
import { listRestaurants } from '@/lib/services/restaurants';

export const dynamic = 'force-dynamic';

export default async function AdminRestaurantsPage() {
  const rows = await listRestaurants();
  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Restaurants/</h1>
        <p className="mt-1 text-sm text-[#8A8270]">Places to eat across your destinations.</p>
      </div>
      <RestaurantsTable initial={rows} />
    </div>
  );
}