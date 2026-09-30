import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

const steps = [
  {
    title: 'You describe the trip',
    sub: '"5-day Goa family trip, 2 adults, 2 kids, under ₹90,000"',
    highlight: true,
  },
  {
    title: "AI asks what's missing",
    sub: "Kids' ages, preferred area, dates",
  },
  {
    title: 'Searches real hotels, flights & activities',
    sub: 'Live provider inventory, not guesses',
  },
  {
    title: 'Builds your itinerary & budget',
    sub: 'Day-by-day plan, itemized costs',
  },
  {
    title: 'You refine it conversationally',
    sub: '"Make day 3 more relaxing"',
  },
  {
    title: 'Prices are re-verified',
    sub: 'Checked again right before payment',
  },
  {
    title: 'You pay, and it\'s booked',
    sub: 'Reference, vouchers, and support in one place',
    highlight: true,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center md:px-12">
        <h1 className="font-serif text-3xl leading-tight text-[var(--color-pine)] sm:text-4xl">
          From one sentence to a booked trip.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#4B4436]">
          Every trip on EaseWithStay follows the same transparent path  nothing books
          itself without your say-so.
        </p>
      </section>

      {/* Flow diagram */}
      <section className="mx-auto max-w-2xl px-6 py-16 md:px-12">
        <div className="flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={step.title} className="flex w-full flex-col items-center">
              <div
                className={
                  step.highlight
                    ? 'w-full max-w-[420px] rounded-xl border-[1.5px] border-[var(--color-coral)] bg-[var(--color-coral-soft)] px-6 py-4 text-center'
                    : 'w-full max-w-[420px] rounded-xl border-[1.5px] border-[var(--color-paper-line)] bg-white px-6 py-4 text-center'
                }
              >
                <div
                  className={
                    step.highlight
                      ? 'text-sm font-semibold text-[var(--color-coral-dark)]'
                      : 'text-sm font-semibold text-[var(--color-pine)]'
                  }
                >
                  {step.title}
                </div>
                {step.sub && (
                  <div className="mt-1 text-xs text-[#7A7261]">{step.sub}</div>
                )}
              </div>

              {i < steps.length - 1 && (
                <div className="my-1.5 select-none text-lg leading-none text-[var(--color-brass)]">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-[var(--color-paper-line)] px-6 py-16 text-center md:px-12">
        <h2 className="font-serif text-2xl text-[var(--color-pine)]">
          Ready to plan your next trip?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#7A7261]">
          Describe it in one sentence. The AI handles the rest.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:w-auto"
          >
            Start planning
          </Link>
          <Link
            href="/destinations"
            className="w-full rounded-lg border-[1.5px] border-[var(--color-pine)] px-6 py-3 text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] sm:w-auto"
          >
            Browse destinations
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}