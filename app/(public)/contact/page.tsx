'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Phase 17: real submission via /api/v1/contact + Nodemailer
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      <SiteNav />

      <section className="grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:px-12 md:py-20">
        {/* Left: info */}
        <div className="max-w-[420px]">
          <h1 className="font-serif text-3xl text-[var(--color-pine)]">
            We&rsquo;re here if something&rsquo;s wrong.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#7A7261]">
            For an existing booking, have your reference code ready  it speeds things up
            considerably.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-lagoon-soft)] text-[var(--color-lagoon)]">
                <Mail size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--color-pine)]">
                  Email support
                </div>
                <div className="mt-0.5 text-sm text-[#7A7261]">
                  support@easewithstay.com · replies within 4 hours
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-lagoon-soft)] text-[var(--color-lagoon)]">
                <Phone size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--color-pine)]">
                  Call us
                </div>
                <div className="mt-0.5 text-sm text-[#7A7261]">
                  +91 1800-123-4567 · 7 AM – 11 PM IST, every day
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-lagoon-soft)] text-[var(--color-lagoon)]">
                <MapPin size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--color-pine)]">
                  Registered office
                </div>
                <div className="mt-0.5 text-sm text-[#7A7261]">
                  4th Floor, Prestige Tech Park, Bengaluru, India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl border border-[var(--color-paper-line)] bg-[var(--color-sand)] p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
                ✓
              </div>
              <h2 className="mt-4 font-serif text-xl text-[var(--color-pine)]">
                Message sent
              </h2>
              <p className="mx-auto mt-2 max-w-xs text-sm text-[#7A7261]">
                We&rsquo;ll get back to you within 4 hours at the email you provided.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
                  Booking reference (optional)
                </label>
                <input
                  placeholder="EWS-GOA-88421"
                  className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
                    Name
                  </label>
                  <input
                    required
                    className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
                  What&rsquo;s this about?
                </label>
                <select
                  className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
                >
                  <option>General question</option>
                  <option>Cancellation &amp; refund</option>
                  <option>Modify booking</option>
                  <option>Payment issue</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what happened…"
                  className="w-full resize-none rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[var(--color-coral)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}