import Link from 'next/link';

export default function AuthNotFound() {
  return (
    <div className="text-center">
      <p className="mb-2 font-serif text-sm italic text-[var(--color-brass)]"> not found</p>
      <h1 className="font-serif text-4xl text-[var(--color-pine)]">404</h1>
      <p className="mt-4 text-sm text-[#7A7261]">
        This account page doesn't exist or has expired.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-lg bg-[var(--color-coral)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
      >
        Go to log in
      </Link>
    </div>
  );
}