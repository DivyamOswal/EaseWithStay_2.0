import Link from 'next/link';

export function SiteFooter() {
  const columns = [
    {
      title: 'Product',
      links: ['AI Trip Planner', 'Hotels', 'Flights', 'Activities'],
    },
    { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
    {
      title: 'Support',
      links: ['Help center', 'Cancellations & refunds', 'Contact us', 'Trust & safety'],
    },
    { title: 'Legal', links: ['Terms of service', 'Privacy policy', 'Payment terms'] },
  ];

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
            {col.links.map((label) => (
              <Link
                key={label}
                href="#"
                className="mb-2 block text-sm text-[#CFE0DE] hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 px-12 py-5 text-xs text-[#8FA8A5] md:flex-row md:items-center">
        <span>© 2026 EaseWithStay. All prices shown in INR unless stated.</span>
        <div className="flex gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
            in
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
            X
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
            ig
          </span>
        </div>
      </div>
    </footer>
  );
}