import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { prisma } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

const allTags = [
  'All',
  'Beaches',
  'Mountains',
  'Family-friendly',
  'Budget',
  'International',
  'Food',
];

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      country: true,
      region: true,
      heroImageId: true,
    },
  });

  return (
    <>
      <SiteNav />

      <section className="px-6 pt-12 md:px-12">
        <h1 className="font-serif text-3xl text-[var(--color-pine)] sm:text-4xl">
          Explore destinations
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#4B4436]">
          Every destination below has live hotel, flight and activity pricing behind it —
          no stock estimates.
        </p>
      </section>

      {/* Filter chips (visual only for now) */}
      <div className="flex flex-wrap gap-2.5 px-6 py-6 md:px-12">
        {allTags.map((tag, i) => (
          <button
            key={tag}
            className={
              i === 0
                ? 'rounded-full border-[1.5px] border-[var(--color-pine)] bg-[var(--color-pine)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)]'
                : 'rounded-full border-[1.5px] border-[var(--color-paper-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]'
            }
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="px-6 pb-16 md:px-12">
        {destinations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
            <h3 className="font-serif text-lg text-[var(--color-pine)]">
              No destinations published yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#7A7261]">
              Publish a destination from the admin panel to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-[0_8px_20px_-10px_rgba(20,43,69,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-10px_rgba(20,43,69,.32)]"
              >
                <div className="relative h-[150px] w-full overflow-hidden bg-[var(--color-lagoon-soft)]">
                  {d.heroImageId ? (
                    <Image
                      src={d.heroImageId}
                      alt={d.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">
                      🌍
                    </div>
                  )}
                </div>
                <div className="px-4 py-3.5">
                  <div className="font-serif text-base text-[var(--color-pine)]">
                    {d.name}
                  </div>
                  <div className="mt-0.5 text-xs text-[#7A7261]">
                    {d.region ?? d.country}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  );
}