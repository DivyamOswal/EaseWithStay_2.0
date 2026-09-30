import Link from 'next/link';

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'AI Trip Planner', href: '/planner' },
      { label: 'Destinations', href: '/destinations' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'How it works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '/help' },
      { label: 'Cancellations & refunds', href: '/help' },
      { label: 'Contact us', href: '/contact' },
      { label: 'Trust & safety', href: '/help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '/terms' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Payment terms', href: '/terms' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-pine)] text-[var(--color-sand)]">
      <div className="grid grid-cols-1 gap-8 px-12 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg font-semibold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12L21 4L13 22L11 13L3 12Z"
                stroke="#FBF6EC"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            EaseWithStay
          </div>
          <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-[#9DB8B5]">
            AI-planned trips with transparent pricing, from first prompt to final booking.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h5 className="mb-3 text-xs font-bold tracking-wide text-[var(--color-brass)]">
              {col.title}
            </h5>
            {col.links.map((link) =>
              link.href === '#' ? (
                <span
                  key={link.label}
                  className="mb-2 block cursor-not-allowed text-sm text-[#7A8F8C]"
                  title="Coming soon"
                >
                  {link.label}
                </span>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="mb-2 block text-sm text-[#CFE0DE] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 px-12 py-5 text-xs text-[#8FA8A5] md:flex-row md:items-center">
        <span>© 2026 EaseWithStay. All prices shown in INR unless stated.</span>
        <div className="flex gap-3">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition hover:border-white/40"
          >
            in
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition hover:border-white/40"
          >
            X
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition hover:border-white/40"
          >
            ig
          </a>
        </div>
      </div>
    </footer>
  ); 
}