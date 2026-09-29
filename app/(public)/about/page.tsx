import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

const stats = [
  { num: '2024', lbl: 'Founded' },
  { num: '40K+', lbl: 'Trips planned' },
  { num: '120+', lbl: 'Destinations covered' },
  { num: '4.7★', lbl: 'Average trip rating' },
];

const values = [
  {
    icon: '💬',
    title: 'AI that asks, not assumes',
    body: 'Clarifying questions before a plan, not a wall of generic suggestions.',
  },
  {
    icon: '₹',
    title: 'Transparent pricing',
    body: 'Every rupee of your budget is itemized, and prices are re-checked before you pay.',
  },
  {
    icon: '🤝',
    title: 'A real person if it breaks',
    body: "Support isn't a chatbot loop — a human picks up cancellations and disputes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-coral)]">
          Our story
        </p>
        <h1 className="font-serif text-3xl leading-[1.15] text-[var(--color-pine)] sm:text-4xl md:text-[40px]">
          We got tired of 40 open tabs to plan one trip.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[#4B4436]">
          EaseWithStay started with a simple frustration: planning a family trip meant one
          tab for flights, another for hotels, a spreadsheet for budget, and a dozen reviews
          to sift through — and most of it went stale before you'd even booked anything. We
          build one conversation that does all of that, with real prices and a plan you can
          actually trust.
        </p>
      </section>

      {/* Stats strip */}
      <section className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-6 border-y border-[var(--color-paper-line)] px-6 py-10 md:grid-cols-4 md:px-12">
        {stats.map((s) => (
          <div key={s.lbl} className="text-center md:text-left">
            <div className="font-serif text-3xl text-[var(--color-coral)]">
              {s.num}
            </div>
            <div className="mt-1.5 text-xs text-[#7A7261]">{s.lbl}</div>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-12">
        <h2 className="mb-8 font-serif text-2xl text-[var(--color-pine)]">
          What we build around
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-[var(--color-paper-line)] bg-white p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-lagoon-soft)] text-lg">
                {v.icon}
              </div>
              <h3 className="mb-2 font-serif text-base text-[var(--color-pine)]">
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#5B5343]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-[var(--color-paper-line)] px-6 py-16 text-center md:px-12">
        <h2 className="font-serif text-2xl text-[var(--color-pine)]">
          Come plan something.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#7A7261]">
          One sentence is enough to get started.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:w-auto"
          >
            Start planning
          </Link>
          <Link
            href="/how-it-works"
            className="w-full rounded-lg border-[1.5px] border-[var(--color-pine)] px-6 py-3 text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] sm:w-auto"
          >
            See how it works
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}