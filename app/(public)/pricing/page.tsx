'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

type Feature = { label: string; included: boolean };

type Tier = {
  name: string;
  tagline: string;
  monthly: number | null;
  annual: number | null;
  annualNote?: string;
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  features: Feature[];
};

const tiers: Tier[] = [
  {
    name: 'Explorer',
    tagline: 'Plan any trip with AI, free forever.',
    monthly: 0,
    annual: 0,
    cta: 'Get started',
    ctaHref: '/register',
    features: [
      { label: 'AI trip planner', included: true },
      { label: 'Live hotel, flight & activity search', included: true },
      { label: 'Day-by-day itinerary', included: true },
      { label: 'Budget breakdown in INR', included: true },
      { label: 'Save up to 3 trips', included: true },
      { label: 'Price drop alerts', included: false },
      { label: 'Priority AI responses', included: false },
      { label: 'Free cancellation on first booking', included: false },
      { label: 'Dedicated trip designer', included: false },
    ],
  },
  {
    name: 'Voyager',
    tagline: 'For frequent travellers who want more control.',
    monthly: 299,
    annual: 2490,
    annualNote: 'Save ₹1,098 vs monthly',
    cta: 'Start free trial',
    ctaHref: '/register',
    highlight: true,
    features: [
      { label: 'Everything in Explorer', included: true },
      { label: 'Unlimited saved trips', included: true },
      { label: 'Price drop alerts', included: true },
      { label: 'Priority AI responses', included: true },
      { label: 'Free cancellation on first booking', included: true },
      { label: 'Multi-trip budget tracking', included: true },
      { label: 'Ad-free experience', included: true },
      { label: 'Dedicated trip designer', included: false },
      { label: 'Group bookings (up to 12)', included: false },
    ],
  },
  {
    name: 'Concierge',
    tagline: 'A human trip designer for high-stakes travel.',
    monthly: null,
    annual: null,
    cta: 'Talk to us',
    ctaHref: '/contact',
    features: [
      { label: 'Everything in Voyager', included: true },
      { label: 'Dedicated human trip designer', included: true },
      { label: '24/7 WhatsApp support', included: true },
      { label: 'Custom multi-city itineraries', included: true },
      { label: 'VIP hotel upgrades (where available)', included: true },
      { label: 'Group bookings (up to 12 travelers)', included: true },
      { label: 'Post-trip support & rebooking', included: true },
    ],
  },
];

const faqs = [
  {
    q: 'Is trip planning really free?',
    a: 'Yes. The AI planner, live pricing, and saved itineraries are free forever on the Explorer tier. We make money on bookings, not on keeping you out of the planner.',
  },
  {
    q: 'What\'s the difference between Voyager and Concierge?',
    a: 'Voyager is a self-serve subscription with tools to help you plan faster and smarter. Concierge is a fully managed service where a human trip designer builds the itinerary with you, available 24/7.',
  },
  {
    q: 'Can I cancel Voyager anytime?',
    a: 'Yes. Cancel in your account settings with one click. You\'ll keep access until the end of the current billing period, and we\'ll refund the unused portion of annual plans on request.',
  },
  {
    q: 'Do you charge a booking fee on top?',
    a: 'No hidden fees. Hotel, flight, and activity prices are shown at checkout exactly as they are. Taxes and any provider charges are itemized before you pay.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Voyager comes with a 14-day free trial. No card required to start — you only pay if you decide to continue.',
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center md:px-12">
        <p className="mb-4 inline-block rounded-full bg-[var(--color-lagoon-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-lagoon)]">
          Simple pricing. No surprises.
        </p>
        <h1 className="font-serif text-3xl leading-tight text-[var(--color-pine)] sm:text-4xl md:text-[44px]">
          Plan trips for free. Upgrade when it saves you more.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#4B4436]">
          Planning is free forever. Pay only if you want faster AI, price drop alerts, or a
          human trip designer.
        </p>
      </section>

      {/* Billing toggle */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex items-center rounded-lg bg-[#F0EBDD] p-1">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={
              billing === 'monthly'
                ? 'rounded-md bg-white px-5 py-2 text-sm font-semibold text-[var(--color-pine)] shadow-sm'
                : 'rounded-md px-5 py-2 text-sm font-medium text-[#8A8270] transition hover:text-[var(--color-pine)]'
            }
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={
              billing === 'annual'
                ? 'rounded-md bg-white px-5 py-2 text-sm font-semibold text-[var(--color-pine)] shadow-sm'
                : 'rounded-md px-5 py-2 text-sm font-medium text-[#8A8270] transition hover:text-[var(--color-pine)]'
            }
          >
            Annual
            <span className="ml-2 rounded-full bg-[var(--color-coral-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-coral-dark)]">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      {/* Tier cards */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const price =
              billing === 'monthly' ? tier.monthly : tier.annual;
            const isCustom = tier.monthly === null;

            return (
              <div
                key={tier.name}
                className={
                  tier.highlight
                    ? 'relative rounded-2xl border-[1.5px] border-[var(--color-coral)] bg-white p-7 shadow-[0_20px_40px_-20px_rgba(20,43,69,0.25)]'
                    : 'relative rounded-2xl border border-[var(--color-paper-line)] bg-white p-7'
                }
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-7 rounded-full bg-[var(--color-coral)] px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}

                <h3 className="font-serif text-xl text-[var(--color-pine)]">
                  {tier.name}
                </h3>
                <p className="mt-1.5 min-h-[2.5rem] text-sm leading-relaxed text-[#7A7261]">
                  {tier.tagline}
                </p>

                <div className="mt-6 mb-1 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className="font-serif text-3xl text-[var(--color-pine)]">
                      Custom
                    </span>
                  ) : price === 0 ? (
                    <span className="font-serif text-3xl text-[var(--color-pine)]">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="font-serif text-3xl text-[var(--color-pine)]">
                        ₹{price?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-[#8A8270]">
                        /{billing === 'monthly' ? 'month' : 'year'}
                      </span>
                    </>
                  )}
                </div>
                <p className="mb-6 min-h-[1rem] text-xs text-[var(--color-brass)]">
                  {billing === 'annual' && !isCustom && price !== 0
                    ? tier.annualNote
                    : ''}
                </p>

                <Link
                  href={tier.ctaHref}
                  className={
                    tier.highlight
                      ? 'mb-7 block w-full rounded-lg bg-[var(--color-coral)] py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]'
                      : 'mb-7 block w-full rounded-lg border-[1.5px] border-[var(--color-pine)] py-3 text-center text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]'
                  }
                >
                  {tier.cta}
                </Link>

                <div className="space-y-3">
                  {tier.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      {f.included ? (
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-[var(--color-success)]"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Minus
                          size={16}
                          className="mt-0.5 shrink-0 text-[#B7AE96]"
                          strokeWidth={2.5}
                        />
                      )}
                      <span
                        className={
                          f.included
                            ? 'text-[var(--color-pine-2)]'
                            : 'text-[#B7AE96] line-through'
                        }
                      >
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[var(--color-paper-line)] px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div>
            <div className="font-serif text-2xl text-[var(--color-coral)]">40K+</div>
            <div className="mt-1 text-xs text-[#7A7261]">Trips planned</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-[var(--color-coral)]">4.7★</div>
            <div className="mt-1 text-xs text-[#7A7261]">Average trip rating</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-[var(--color-coral)]">120+</div>
            <div className="mt-1 text-xs text-[#7A7261]">Destinations</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-[var(--color-coral)]">0%</div>
            <div className="mt-1 text-xs text-[#7A7261]">Hidden booking fees</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <h2 className="mb-8 text-center font-serif text-2xl text-[var(--color-pine)]">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-[var(--color-paper-line)] border-y border-[var(--color-paper-line)]">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-[var(--color-pine)]">
                <span>{faq.q}</span>
                <span className="ml-4 select-none text-lg text-[#8A8270] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5B5343]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-20 text-center md:px-12">
        <h2 className="font-serif text-2xl text-[var(--color-pine)]">
          Still have questions?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#7A7261]">
          Our team replies within 4 hours, every day.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:w-auto"
          >
            Start for free
          </Link>
          <Link
            href="/contact"
            className="w-full rounded-lg border-[1.5px] border-[var(--color-pine)] px-6 py-3 text-sm font-semibold text-[var(--color-pine)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] sm:w-auto"
          >
            Contact support
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}