'use client';

import type { TripPlan } from '@/lib/ai/schemas/trip-plan';

function formatMoney(minor: number, currency: string) {
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

export function LiveItinerary({ plan }: { plan: TripPlan }) {
  return (
    <div className="space-y-3 p-5">
      {/* Summary card */}
      <div className="rounded-xl border border-[var(--color-paper-line)] bg-white p-4">
        <div className="text-xs font-semibold text-[#8A8270]">Destination</div>
        <div className="mt-0.5 text-sm font-semibold text-[var(--color-pine)]">
          {plan.destination}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-semibold text-[#8A8270]">Days</div>
            <div className="mt-0.5 text-sm text-[var(--color-pine)]">
              {plan.days.length}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#8A8270]">Est. total</div>
            <div className="mt-0.5 text-sm font-semibold text-[var(--color-coral)]">
              {formatMoney(plan.totalCostMinor, plan.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Days */}
      {plan.days.map((day) => (
        <div
          key={day.dayIndex}
          className="rounded-xl border border-[var(--color-paper-line)] bg-white p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--color-brass)]">
              Day {day.dayIndex + 1}
            </div>
            {day.location && (
              <div className="text-xs text-[#8A8270]">{day.location}</div>
            )}
          </div>
          <div className="mb-3 font-serif text-sm text-[var(--color-pine)]">
            {day.title}
          </div>
          <ul className="space-y-2">
            {day.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-lagoon)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[var(--color-pine-2)]">
                    {item.startTime && (
                      <span className="mr-1.5 font-semibold">{item.startTime}</span>
                    )}
                    {item.title}
                  </div>
                </div>
                {item.costMinor > 0 && (
                  <div className="shrink-0 font-medium text-[var(--color-pine-2)]">
                    {formatMoney(item.costMinor, plan.currency)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <div className="rounded-xl border border-[var(--color-paper-line)] bg-[var(--color-lagoon-soft)] p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-lagoon)]">
            Good to know
          </div>
          <ul className="space-y-1.5">
            {plan.tips.map((tip, i) => (
              <li
                key={i}
                className="text-xs leading-relaxed text-[var(--color-pine-2)]"
              >
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}