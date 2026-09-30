import Link from 'next/link';
import { requireAdminPage } from '@/lib/auth/admin-guard';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/destinations', label: 'Destinations' },
  { href: '/admin/hotels', label: 'Hotels' },
  { href: '/admin/activities', label: 'Activities' },
  { href: '/admin/restaurants', label: 'Restaurants' },
  { href: '/admin/documents', label: 'Documents' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/settings', label: 'Settings' },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage('/admin');

  return (
    <div className="grid min-h-screen grid-cols-[230px_1fr] bg-[#FEFDFA]">
      <aside className="flex flex-col bg-[var(--color-pine)] px-4 py-6 text-[var(--color-sand)]">
        <Link
          href="/admin"
          className="mb-7 flex items-center gap-2 px-2 font-serif text-base font-semibold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12L21 4L13 22L11 13L3 12Z"
              stroke="#FBF6EC"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          EaseWithStay
        </Link>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#B9D0CD] transition hover:bg-white/5 hover:text-[var(--color-sand)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 rounded-lg bg-white/5 p-3.5 text-xs leading-relaxed text-[#9DB8B5]">
          Signed in as
          <br />
          <strong className="text-[var(--color-sand)]">
            {admin.name ?? admin.email}
          </strong>
          <br />
          <span className="text-[10.5px] uppercase tracking-wide text-[#7A8F8C]">
            {admin.role}
          </span>
        </div>
      </aside>

      <main className="overflow-x-auto">{children}</main>
    </div>
  );
}