import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export type LegalSection = {
  id: string;
  heading: string;
  body: string;
};

type Props = {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
  activeId?: string;
};

export function LegalLayout({ title, subtitle, updated, sections, activeId }: Props) {
  return (
    <>
      <SiteNav />

      <div className="grid grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[220px_1fr] md:px-12">
        {/* TOC sidebar */}
        <aside className="h-fit md:sticky md:top-24">
          <p className="mb-4 text-xs text-[#8A8270]">Last updated {updated}</p>
          <nav className="space-y-0.5">
            {sections.map((s, i) => {
              const isActive = activeId ? s.id === activeId : i === 0;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={
                    isActive
                      ? 'block rounded-md bg-[var(--color-lagoon-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-pine)]'
                      : 'block rounded-md px-3 py-2 text-sm text-[var(--color-pine-2)] transition hover:bg-[var(--color-lagoon-soft)] hover:text-[var(--color-pine)]'
                  }
                >
                  {i + 1}. {s.heading}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <article className="max-w-[640px]">
          <h1 className="font-serif text-3xl text-[var(--color-pine)]">{title}</h1>
          <p className="mt-2 mb-10 text-sm text-[#8A8270]">{subtitle}</p>

          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="mb-2.5 font-serif text-lg text-[var(--color-pine)]">
                  {s.heading}
                </h2>
                <p className="text-sm leading-[1.75] text-[#5B5343]">{s.body}</p>
              </section>
            ))}
          </div>
        </article>
      </div>

      <SiteFooter />
    </>
  );
}