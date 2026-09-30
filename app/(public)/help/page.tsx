'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Compass, Hotel, CreditCard, RotateCcw } from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

const categories = [
  { icon: Compass, title: 'Planning & AI', count: '12 articles', href: '#planning' },
  { icon: Hotel, title: 'Bookings', count: '18 articles', href: '#bookings' },
  { icon: CreditCard, title: 'Payments', count: '9 articles', href: '#payments' },
  { icon: RotateCcw, title: 'Cancellations & refunds', count: '11 articles', href: '#refunds' },
];

const faqs = [
  {
    q: 'Can I change my travel dates after booking?',
    a: "Yes  go to Trip Details → Modify booking. Date changes are subject to the hotel and airline's own change policy, and any fare or rate difference will be shown before you confirm.",
  },
  {
    q: 'How long do refunds take?',
    a: 'Once a cancellation is approved, refunds are issued to your original payment method and typically appear within 5–7 business days, depending on your bank.',
  },
  {
    q: 'Why did the AI ask so many questions before planning my trip?',
    a: 'A handful of clarifying questions  dates, traveler count, budget  lets the planner search real inventory instead of guessing, so the plan you see is bookable, not illustrative.',
  },
  {
    q: "Is my payment information stored on EaseWithStay's servers?",
    a: 'No  card and UPI details are handled directly by our payment partner. We only store a payment reference and status, never your full card number.',
  },
  {
    q: 'Are the prices shown the final prices?',
    a: 'Prices shown during planning are estimates. At checkout, they are re-verified against the provider immediately before payment. If a price has changed, you will be shown the new price and asked to confirm before anything is charged.',
  },
  {
    q: 'Can I plan a trip without creating an account?',
    a: "You can explore the planner without an account, but you'll need to sign up to save a trip, receive price alerts, or book anything.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = query
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(query.toLowerCase()) ||
          f.a.toLowerCase().includes(query.toLowerCase()),
      )
    : faqs;

  return (
    <>
      <SiteNav />

      {/* Pine hero with search */}
      <section className="bg-[var(--color-pine)] px-6 py-16 text-center md:px-12">
        <h1 className="font-serif text-3xl text-[var(--color-sand)] sm:text-4xl">
          How can we help?
        </h1>
        <div className="mx-auto mt-6 max-w-[520px]">
          <div className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3.5">
            <Search size={18} className="shrink-0 text-[#8A8270]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search for "cancellation", "refund", "change dates"…'
              className="w-full border-0 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[#8A8270]"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-6 py-14 md:px-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                href={c.href}
                className="rounded-2xl border border-[var(--color-paper-line)] bg-white p-6 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-coral)] hover:shadow-[0_12px_26px_-10px_rgba(20,43,69,.2)]"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-lagoon-soft)] text-[var(--color-lagoon)]">
                  <Icon size={18} />
                </div>
                <div className="text-sm font-semibold text-[var(--color-pine)]">
                  {c.title}
                </div>
                <div className="mt-1 text-xs text-[#8A8270]">{c.count}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ list */}
      <section className="mx-auto max-w-3xl px-6 pb-16 md:px-12">
        <h2 className="mb-6 font-serif text-2xl text-[var(--color-pine)]">
          Frequently asked questions
        </h2>

        {filteredFaqs.length === 0 ? (
          <p className="text-sm text-[#7A7261]">
            No results for &ldquo;{query}&rdquo;. Try different keywords or{' '}
            <Link href="/contact" className="font-semibold text-[var(--color-coral)] hover:underline">
              contact support
            </Link>
            .
          </p>
        ) : (
          <div className="divide-y divide-[var(--color-paper-line)] border-y border-[var(--color-paper-line)]">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-sm font-semibold text-[var(--color-pine)]">
                      {faq.q}
                    </span>
                    <span
                      className={`select-none text-xl leading-none text-[#8A8270] transition-transform ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="max-w-2xl pb-5 text-sm leading-relaxed text-[#5B5343]">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Contact strip */}
      <section className="border-t border-[var(--color-paper-line)] px-6 py-14 text-center md:px-12">
        <h2 className="font-serif text-xl text-[var(--color-pine)]">
          Still stuck?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#7A7261]">
          Support replies within 4 hours, every day between 7 AM and 11 PM IST.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
        >
          Contact support
        </Link>
      </section>

      <SiteFooter />
    </>
  );
}