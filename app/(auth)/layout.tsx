import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[var(--color-pine)] p-12 text-[var(--color-sand)] lg:flex">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-lg font-semibold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12L21 4L13 22L11 13L3 12Z"
              stroke="#FBF6EC"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          EaseWithStay
        </Link>

        <div className="max-w-[380px]">
          <p className="font-serif text-2xl leading-snug">
            "Told it we were a family of four on a tight budget  it asked about the kids'
            ages before it asked about hotels."
          </p>
          <p className="mt-4 text-sm text-[#9DB8B5]">
             Rohan M., booked a 5-day Goa trip
          </p>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -right-10 h-32 w-48 rounded-xl bg-[var(--color-lagoon)] opacity-90"
        />
      </aside>

      {/* Right: form panel */}
      <main className="flex items-center justify-center bg-white px-8 py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}