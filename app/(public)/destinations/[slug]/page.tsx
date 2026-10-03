import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { prisma } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dest = await prisma.destination.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      country: true,
      region: true,
      description: true,
      heroImageId: true,
      status: true,
    },
  });

  if (!dest || dest.status !== 'PUBLISHED') notFound();

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="relative h-[280px] md:h-[340px] bg-[var(--color-pine)]">
        {dest.heroImageId ? (
          <>
            <Image
              src={dest.heroImageId}
              alt={dest.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,43,69,0.75)] via-[rgba(20,43,69,0.35)] to-transparent" />
          </>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
          <h1 className="font-serif text-3xl text-[var(--color-sand)] sm:text-4xl">
            {dest.name}
          </h1>
          <p className="mt-1.5 text-sm text-[#E4ECF7]">
            {dest.region ?? dest.country}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="grid grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1fr_300px] md:px-12">
        <div>
          <div className="mb-6">
            <h3 className="mb-2 font-serif text-base text-[var(--color-pine)]">
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-[#5B5343]">
              {dest.description ?? 'More details coming soon.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-[var(--color-paper-line)] bg-[var(--color-sand)] p-6">
          <div className="font-serif text-xl text-[var(--color-pine)]">
            Plan a trip here
          </div>
          <p className="mt-2 mb-5 text-xs text-[#8A8270]">
            The AI planner will use {dest.name} as the destination for your itinerary.
          </p>
          <Link
            href={`/planner?destinationId=${dest.id}`}
            className="mb-2.5 block w-full rounded-lg bg-[var(--color-coral)] py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
          >
            Start planning
          </Link>
          <Link
            href="/destinations"
            className="block w-full rounded-lg border-[1.5px] border-[var(--color-pine)] py-3 text-center text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
          >
            See other destinations
          </Link>
        </aside>
      </section>

      <SiteFooter />
    </>
  );
}