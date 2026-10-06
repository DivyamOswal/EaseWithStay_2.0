'use client';

export type ChatMessageData = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  suggestions?: string[];
};

export function ChatMessage({
  message,
  onSuggestionClick,
}: {
  message: ChatMessageData;
  onSuggestionClick: (p: string) => void;
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-[var(--color-pine)] px-4 py-3 text-sm leading-relaxed text-[var(--color-sand)]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-[var(--color-paper-line)] bg-white px-4 py-3">
        <div className="mb-1.5 text-[10.5px] font-bold text-[var(--color-coral)]">
          EASEWITHSTAY
        </div>
        <div className="text-sm leading-relaxed text-[var(--color-ink)]">
          {message.content}
        </div>
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestionClick(s)}
                className="rounded-full border border-[var(--color-paper-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}