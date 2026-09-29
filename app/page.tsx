import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex min-h-[70vh] items-center justify-center px-12 py-24">
        <div className="max-w-xl text-center">
          <h1 className="font-serif text-5xl leading-tight text-[var(--color-pine)]">
            Tell us where you want to feel different.
          </h1>
          <p className="mt-5 text-lg text-[#4B4436]">
            The full landing experience arrives in the next UI phase. For now, use{' '}
            <a
              href="/login"
              className="font-semibold text-[var(--color-coral)] hover:underline"
            >
              login
            </a>{' '}
            or{' '}
            <a
              href="/register"
              className="font-semibold text-[var(--color-coral)] hover:underline"
            >
              register
            </a>{' '}
            to try the auth flow.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}