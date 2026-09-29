import Link from 'next/link';

export function SiteNav() {
  return (
    <nav className="flex items-center justify-between px-12 py-5 border-b border-[var(--color-paper-line)] bg-[var(--color-sand)]">
      <Link
        href="/"
        className="flex items-center gap-2 font-serif text-lg font-semibold text-[var(--color-pine)]"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12L21 4L13 22L11 13L3 12Z"
            stroke="#142B45"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        EaseWithStay
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--color-pine-2)]">
        <Link href="/how-it-works" className="hover:text-[var(--color-coral)] transition">
          How it works
        </Link>
        <Link href="/destinations" className="hover:text-[var(--color-coral)] transition">
          Destinations
        </Link>
        <Link href="/pricing" className="hover:text-[var(--color-coral)] transition">
          Pricing
        </Link>
        <Link href="/login" className="hover:text-[var(--color-coral)] transition">
          Log in
        </Link>
      </div>

      <Link
        href="/register"
        className="rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-coral-dark)] transition"
      >
        Start planning
      </Link>
    </nav>
  );
}