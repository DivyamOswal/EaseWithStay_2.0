import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { destinations, getDestinationBySlug } from '@/lib/data/destinations';

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) notFound();

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="relative h-[280px] md:h-[340px]">
        <Image
          src={dest.img}
          alt={dest.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,43,69,0.75)] via-[rgba(20,43,69,0.35)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
          <h1 className="font-serif text-3xl text-[var(--color-sand)] sm:text-4xl">
            {dest.name}
          </h1>
          <p className="mt-1.5 text-sm text-[#E4ECF7]">{dest.region}</p>
        </div>
      </section>

      {/* Body */}
      <section className="grid grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1fr_300px] md:px-12">
        <div>
          {/* Stats row */}
          <div className="mb-8 flex flex-wrap gap-8 border-b border-[var(--color-paper-line)] pb-6">
            <div>
              <div className="text-[11.5px] font-semibold text-[#8A8270]">
                Best time to visit
              </div>
              <div className="mt-1 font-serif text-lg text-[var(--color-pine)]">
                {dest.bestTime}
              </div>
            </div>
            <div>
              <div className="text-[11.5px] font-semibold text-[#8A8270]">
                Typical budget
              </div>
              <div className="mt-1 font-serif text-lg text-[var(--color-pine)]">
                {dest.budget}
              </div>
            </div>
            <div>
              <div className="text-[11.5px] font-semibold text-[#8A8270]">
                Flight time
              </div>
              <div className="mt-1 font-serif text-lg text-[var(--color-pine)]">
                {dest.flightTime}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 font-serif text-base text-[var(--color-pine)]">Overview</h3>
            <p className="text-sm leading-relaxed text-[#5B5343]">{dest.overview}</p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-serif text-base text-[var(--color-pine)]">Good for</h3>
            <div className="flex flex-wrap gap-2">
              {dest.goodFor.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-[var(--color-paper-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-pine-2)]"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-serif text-base text-[var(--color-pine)]">
              Popular activities
            </h3>
            <p className="text-sm leading-relaxed text-[#5B5343]">{dest.activities}</p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-[var(--color-paper-line)] bg-[var(--color-sand)] p-6">
          <div className="font-serif text-2xl text-[var(--color-pine)]">
            {dest.price.replace(' / person', '')}
            <span className="text-sm font-normal text-[#8A8270]"> / person</span>
          </div>
          <p className="mt-1 mb-5 text-xs text-[#8A8270]">
            Based on a 5-day family trip, current pricing
          </p>
          <Link
            href="/register"
            className="mb-2.5 block w-full rounded-lg bg-[var(--color-coral)] py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
          >
            Plan a trip here
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