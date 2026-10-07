'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Save, Sparkles } from 'lucide-react';
import type { TripPlan } from '@/lib/ai/schemas/trip-plan';
import { ChatMessage, type ChatMessageData } from '../../app/planner/chat-message';
import { LiveItinerary } from './live-itinerary';

type DestinationOption = { id: string; name: string; slug: string };

const suggestedPrompts = [
  '5-day Goa family trip for 2 adults and 2 kids under 90,000 rupees',
  'Weekend in the mountains for 4 people, budget 40,000 rupees',
  '4-day Kerala backwaters trip for 2 adults',
];

function formatMoney(minor: number, currency: string) {
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

export function PlannerClient({ destinations }: { destinations: DestinationOption[] }) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [destinationId, setDestinationId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend(promptOverride?: string) {
  const prompt = (promptOverride ?? input).trim();
  if (!prompt || loading) return;

  setError(null);
  setInput('');

  setMessages((prev) => [
    ...prev,
    { id: `u-${Date.now()}`, role: 'user', content: prompt },
  ]);
  setLoading(true);

  const isRefinement = plan !== null;

  try {
    const endpoint = isRefinement
      ? '/api/v1/planner/refine'
      : '/api/v1/planner/generate';

    const body = isRefinement
      ? {
          currentPlan: plan,
          userRequest: prompt,
          destinationId: destinationId || undefined,
        }
      : {
          userPrompt: prompt,
          destinationId: destinationId || undefined,
        };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      const errMsg =
        data.error === 'INSUFFICIENT_KNOWLEDGE'
          ? "I don't have enough information about that destination yet."
          : isRefinement
            ? `Could not apply that change: ${data.error ?? 'unknown'}`
            : `Planning failed: ${data.error ?? 'unknown'}`;
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'ai', content: errMsg },
      ]);
      return;
    }

    setPlan(data.plan);

    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: isRefinement
          ? `Updated. ${data.plan.days.length} days, now estimated at ${formatMoney(data.plan.totalCostMinor, data.plan.currency)}.`
          : `Here's a draft. ${data.plan.days.length} days in ${data.plan.destination}, estimated at ${formatMoney(data.plan.totalCostMinor, data.plan.currency)}. Want me to adjust anything?`,
        suggestions: isRefinement
          ? ['Make it cheaper', 'Add a rest day', 'Swap the hotel']
          : [
              'Make day 3 more relaxing',
              'Reduce the budget',
              'Add more kid-friendly activities',
            ],
      },
    ]);
  } catch {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
}

  async function handleSave() {
    if (!plan || saving) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/trips/save-plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          plan,
          destinationId: destinationId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.tripId) {
        setError('Could not save the trip. Please try again.');
        return;
      }

      router.push(`/trips/${data.tripId}`);
    } catch {
      setError('Could not save the trip.');
    } finally {
      setSaving(false);
    }
  }

  const showWelcome = messages.length === 0 && !loading;

  return (
    <div className="grid h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[1fr_420px]">
      {/* ================= LEFT: CHAT ================= */}
      <div className="flex flex-col border-r border-[var(--color-paper-line)] bg-[#FEFDFA]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-paper-line)] bg-white px-6 py-4">
          <div>
            <div className="text-sm font-semibold text-[var(--color-pine)]">
              Planning session
            </div>
            <div className="text-xs text-[#8A8270]">
              {destinationId
                ? destinations.find((d) => d.id === destinationId)?.name
                : 'Any destination'}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-lagoon-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-lagoon)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-lagoon)]" />
            Live
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {showWelcome && (
            <WelcomeBlock
              destinations={destinations}
              destinationId={destinationId}
              onDestinationChange={setDestinationId}
              onPromptClick={handleSend}
            />
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onSuggestionClick={handleSend} />
          ))}
          {loading && <TypingIndicator />}
        </div>

        {error && (
          <div className="mx-6 mb-3 rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-4 py-2.5 text-sm text-[#C94E2C]">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-[var(--color-paper-line)] bg-white px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your trip…"
              rows={1}
              className="max-h-32 flex-1 resize-none rounded-xl border border-[var(--color-paper-line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-coral)]"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-coral)] text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="mt-2 text-[10.5px] text-[#8A8270]">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>

      {/* ================= RIGHT: ITINERARY ================= */}
      <aside className="hidden flex-col bg-[var(--color-sand)] lg:flex">
        <div className="border-b border-[var(--color-paper-line)] px-6 py-4">
          <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--color-brass)]">
            Draft itinerary
          </div>
          <div className="mt-0.5 font-serif text-lg text-[var(--color-pine)]">
            {plan ? plan.title : 'Waiting for a plan…'}
          </div>
        </div>

        {plan ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <LiveItinerary plan={plan} />
            </div>
            <div className="border-t border-[var(--color-paper-line)] p-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-pine)] py-3 text-sm font-semibold text-[var(--color-sand)] transition hover:bg-[var(--color-pine-2)] disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? 'Saving…' : 'Save trip'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div className="max-w-[220px]">
              <Sparkles size={24} className="mx-auto mb-3 text-[var(--color-brass)]" />
              <p className="text-sm text-[#7A7261]">
                Describe your trip on the left. Your itinerary will appear here.
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ---------- Sub-components (local to this file) ---------- */

function WelcomeBlock({
  destinations,
  destinationId,
  onDestinationChange,
  onPromptClick,
}: {
  destinations: DestinationOption[];
  destinationId: string;
  onDestinationChange: (id: string) => void;
  onPromptClick: (p: string) => void;
}) {
  return (
    <div className="mx-auto max-w-md pt-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-coral-soft)]">
          <Sparkles size={20} className="text-[var(--color-coral)]" />
        </div>
        <h2 className="font-serif text-xl text-[var(--color-pine)]">
          Let's plan your next trip.
        </h2>
        <p className="mt-1.5 text-sm text-[#7A7261]">
          Describe it in one sentence. I'll ask if I need more detail.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Destination (optional)
        </label>
        <select
          value={destinationId}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
        >
          <option value="">Any destination</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-[var(--color-pine-2)]">
          Try one of these
        </div>
        <div className="space-y-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPromptClick(p)}
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-4 py-2.5 text-left text-sm text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-[var(--color-paper-line)] bg-white px-4 py-3">
        <div className="flex gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#B7AE96]"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#B7AE96]"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#B7AE96]"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}