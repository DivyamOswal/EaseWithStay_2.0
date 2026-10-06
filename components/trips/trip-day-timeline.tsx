import { Hotel, Plane, Compass, Utensils, Car, StickyNote } from 'lucide-react';
import type { TripDetail } from '@/lib/services/trips';

type Day = TripDetail['days'][number];

const typeIcons = {
  HOTEL: Hotel,
  FLIGHT: Plane,
  ACTIVITY: Compass,
  RESTAURANT: Utensils,
  TRANSPORT: Car,
  NOTE: StickyNote,
} as const;

function formatMoney(minor: number | null, currency: string) {
  if (minor == null || minor === 0) return null;
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

function readTime(metadata: unknown): { start: string; end: string } {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    const m = metadata as Record<string, unknown>;
    return {
      start: typeof m.startTime === 'string' ? m.startTime : '',
      end: typeof m.endTime === 'string' ? m.endTime : '',
    };
  }
  return { start: '', end: '' };
}

export function TripDayTimeline({
  day,
  currency,
}: {
  day: Day;
  currency: string;
}) {
  const dayTotal = day.items.reduce(
    (sum, item) => sum + (item.costMinor ?? 0),
    0,
  );

  return (
    <article className="rounded-2xl border border-[var(--color-paper-line)] bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-paper-line)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-[var(--color-brass)]">
            Day {day.dayIndex + 1}
          </span>
          <h2 className="font-serif text-lg text-[var(--color-pine)]">
            {day.title ?? 'Untitled day'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {day.notes && (
            <span className="text-xs text-[#8A8270]">{day.notes}</span>
          )}
          {dayTotal > 0 && (
            <span className="text-sm font-semibold text-[var(--color-pine)]">
              {formatMoney(dayTotal, currency)}
            </span>
          )}
        </div>
      </header>

      <ol className="divide-y divide-[var(--color-paper-line)]">
        {day.items.map((item) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] ?? StickyNote;
          const { start, end } = readTime(item.metadata);
          const cost = formatMoney(item.costMinor, currency);

          return (
            <li key={item.id} className="flex items-start gap-4 px-6 py-4">
              <div className="flex w-16 shrink-0 flex-col items-end pt-0.5 text-right">
                {start ? (
                  <span className="text-xs font-semibold text-[var(--color-pine)]">
                    {start}
                  </span>
                ) : (
                  <span className="text-xs text-[#B7AE96]">—</span>
                )}
                {end && (
                  <span className="mt-0.5 text-[10.5px] text-[#B7AE96]">
                    {end}
                  </span>
                )}
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-lagoon-soft)] text-[var(--color-lagoon)]">
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[var(--color-pine)]">
                  {item.title}
                </div>
                {item.notes && (
                  <p className="mt-1 text-xs leading-relaxed text-[#7A7261]">
                    {item.notes}
                  </p>
                )}
              </div>

              {cost && (
                <div className="shrink-0 pt-0.5 text-sm font-semibold text-[var(--color-pine)]">
                  {cost}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </article>
  );
}