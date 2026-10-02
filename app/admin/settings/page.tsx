import { requireAdminPage } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

const groups = [
  {
    title: 'Platform',
    items: [
      { label: 'Allow public signups', value: 'Enabled', note: 'Users can create accounts at /register' },
      { label: 'Require email verification', value: 'Disabled', note: 'Users can log in without confirming email' },
      { label: 'Maintenance mode', value: 'Off', note: 'Public site stays up' },
    ],
  },
  {
    title: 'AI Planner',
    items: [
      { label: 'Model', value: 'Groq (Phase 10)', note: 'Configured in lib/ai' },
      { label: 'Retrieval top-K', value: '8 chunks', note: 'Per query' },
      { label: 'Max context tokens', value: '6000', note: 'Bounded context window' },
    ],
  },
  {
    title: 'Payments',
    items: [
      { label: 'Provider', value: 'Razorpay (Phase 16)', note: 'Test mode' },
      { label: 'Currency', value: 'INR', note: 'Stored as minor units (paise)' },
    ],
  },
  {
    title: 'Storage',
    items: [
      { label: 'Provider', value: 'ImageKit', note: 'CDN + transformations' },
      { label: 'Document folder', value: '/destination-documents', note: 'Set on upload' },
    ],
  },
];

export default async function AdminSettingsPage() {
  const admin = await requireAdminPage('/admin/settings');

  return (
    <div className="p-9">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Settings</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Signed in as <strong className="text-[var(--color-pine)]">{admin.email}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-[var(--color-paper-line)] bg-white"
          >
            <div className="border-b border-[var(--color-paper-line)] px-5 py-3.5">
              <h2 className="font-serif text-base text-[var(--color-pine)]">
                {group.title}
              </h2>
            </div>
            <div className="divide-y divide-[var(--color-paper-line)]">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 px-5 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-[var(--color-pine)]">{item.label}</div>
                    <div className="mt-0.5 text-xs text-[#8A8270]">{item.note}</div>
                  </div>
                  <div className="shrink-0 rounded-md bg-[#F1EFEA] px-2.5 py-1 text-xs font-semibold text-[var(--color-pine-2)]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-paper-line)] bg-[var(--color-sand)] p-6">
        <h3 className="font-serif text-base text-[var(--color-pine)]">Editable settings — coming in Phase 20</h3>
        <p className="mt-1.5 text-sm text-[#7A7261]">
          These values are currently read-only. Editable toggles land after security hardening so
          that changes are properly audited and role-gated.
        </p>
      </div>
    </div>
  );
}