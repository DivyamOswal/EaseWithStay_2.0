import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { getCurrentUser } from '@/lib/auth';

const popularDestinations = [
  { name: 'Goa, India', price: 'From ₹21,000 / person', img: '/images/goa.jpg' },
  { name: 'Munnar, Kerala', price: 'From ₹14,000 / person', img: '/images/munnar.jpg' },
  { name: 'Jaipur, Rajasthan', price: 'From ₹18,500 / person', img: '/images/jaipur.jpg' },
  { name: 'Coorg, Karnataka', price: 'From ₹12,800 / person', img: '/images/coorg.jpg' },
];

const chips = [
  'Weekend in the mountains',
  'Family trip to Kerala',
  'Solo trip, low budget',
];

const postcards = [
  {
    img: '/images/goa.jpg',
    alt: 'Goa beach',
    label: 'Goa, India',
    days: '5D',
    wrapper: 'top-0 left-0 z-20 -rotate-6',
    hideOnMobile: false,
  },
  {
    img: '/images/delhi.jpeg',
    alt: 'Delhi',
    label: 'Delhi, India',
    days: '4D',
    wrapper: 'top-0 right-0 z-10 rotate-[5deg]',
    hideOnMobile: true,
  },
  {
    img: '/images/hyderabad.avif',
    alt: 'Hyderabad',
    label: 'Hyderabad',
    days: '3D',
    wrapper: 'bottom-0 left-0 z-10 -rotate-[4deg]',
    hideOnMobile: true,
  },
  {
    img: '/images/manali.jpeg',
    alt: 'Manali mountains',
    label: 'Manali, HP',
    days: '4D',
    wrapper: 'bottom-0 right-0 z-20 rotate-[6deg]',
    hideOnMobile: false,
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  const plannerHref = user ? '/planner' : '/register';

  return (
    <>
      <SiteNav />

      {/* ================= HERO ================= */}
      <section className="grid grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:px-12 md:py-16 lg:py-20">
        {/* Left: copy + prompt */}
        <div className="max-w-[560px]">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold text-[var(--color-coral)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-coral)]" />
            Powered by conversational AI
          </p>

          <h1 className="font-serif text-4xl leading-[1.08] text-[var(--color-pine)] sm:text-5xl md:text-[47px]">
            Tell us where you want to feel different.
          </h1>

          <p className="mt-5 max-w-[440px] text-base leading-relaxed text-[#4B4436]">
            Describe the trip in your own words — EaseWithStay asks the right follow-up
            questions, builds a day-by-day plan, and shows real prices before you book
            anything.
          </p>

          <div className="mt-8 max-w-[500px] rounded-2xl border-[1.5px] border-[var(--color-pine)] bg-white p-4 shadow-[0_10px_24px_-10px_rgba(20,43,69,0.18)]">
            <textarea
              defaultValue="Plan a 5-day Goa family trip for 2 adults and 2 kids under ₹90,000. Beaches, a pool, and kid-friendly food."
              className="h-16 w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-[var(--color-ink)] outline-none"
              readOnly
            />
            <div className="mt-3 flex items-center justify-between border-t border-[var(--color-paper-line)] pt-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--color-lagoon-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-pine-2)]">
                  ✦ Suggests dates
                </span>
                <span className="rounded-full bg-[var(--color-lagoon-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-pine-2)]">
                  ✦ Sets budget
                </span>
              </div>
              <Link
                href={plannerHref}
                className="rounded-lg bg-[var(--color-coral)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
              >
                Plan my trip
              </Link>
            </div>
          </div>

          <div className="mt-5 flex max-w-[500px] flex-wrap gap-2">
            {chips.map((c) => (
              <Link
                key={c}
                href={plannerHref}
                className="rounded-full border border-[var(--color-paper-line)] bg-white px-4 py-2 text-xs text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: 4 postcards in the corners */}
        <div className="relative mx-auto h-[400px] w-full max-w-[520px] sm:h-[480px] md:h-[520px]">
          {postcards.map((p) => (
            <div
              key={p.label}
              className={`absolute w-44 overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_-14px_rgba(20,43,69,0.35)] sm:w-52 md:w-56 ${p.wrapper} ${
                p.hideOnMobile ? 'hidden sm:block' : ''
              }`}
            >
              <div className="relative h-[130px] w-full sm:h-[150px]">
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 224px, 176px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5 font-serif text-sm text-[var(--color-pine)]">
                <span className="truncate pr-2">{p.label}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--color-coral)] text-[10px] font-bold text-[var(--color-coral)]">
                  {p.days}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS STRIP ================= */}
      <section className="grid grid-cols-1 gap-10 border-t border-[var(--color-paper-line)] px-6 py-14 md:grid-cols-3 md:px-12">
        <div>
          <div className="mb-2.5 font-serif text-2xl italic text-[var(--color-brass)]">01</div>
          <h3 className="mb-2 font-serif text-lg text-[var(--color-pine)]">Say what you want</h3>
          <p className="text-sm leading-relaxed text-[#5B5343]">
            One sentence is enough. Mention people, dates, budget, or vibe — the AI fills
            the gaps by asking.
          </p>
        </div>
        <div>
          <div className="mb-2.5 font-serif text-2xl italic text-[var(--color-brass)]">02</div>
          <h3 className="mb-2 font-serif text-lg text-[var(--color-pine)]">Review a real plan</h3>
          <p className="text-sm leading-relaxed text-[#5B5343]">
            Live hotel, flight and activity pricing — not a guess. Swap anything with a
            message.
          </p>
        </div>
        <div>
          <div className="mb-2.5 font-serif text-2xl italic text-[var(--color-brass)]">03</div>
          <h3 className="mb-2 font-serif text-lg text-[var(--color-pine)]">Book with confidence</h3>
          <p className="text-sm leading-relaxed text-[#5B5343]">
            Prices are re-verified before payment. Cancellations and refunds are tracked in
            one place.
          </p>
        </div>
      </section>

      {/* ================= POPULAR DESTINATIONS ================= */}
      <section className="px-6 pb-16 md:px-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-[var(--color-pine)]">
            Where families are going this month
          </h2>
          <Link
            href="/destinations"
            className="text-sm font-semibold text-[var(--color-lagoon)] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {popularDestinations.map((d) => (
            <Link
              key={d.name}
              href="/destinations"
              className="group overflow-hidden rounded-xl bg-white shadow-[0_8px_20px_-10px_rgba(20,43,69,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-10px_rgba(20,43,69,.32)]"
            >
              <div className="relative h-[130px] w-full overflow-hidden">
                <Image
                  src={d.img}
                  alt={d.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-3.5 py-3">
                <div className="font-serif text-[15px] text-[var(--color-pine)]">
                  {d.name}
                </div>
                <div className="mt-0.5 text-xs text-[#7A7261]">{d.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}