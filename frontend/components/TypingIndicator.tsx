"use client";

interface Props {
  typingUsers: Record<string, string>; // userId -> username
  myUserId: string;
}

export default function TypingIndicator({ typingUsers, myUserId }: Props) {
  const others = Object.entries(typingUsers)
    .filter(([uid]) => uid !== myUserId)
    .map(([, name]) => name);

  if (others.length === 0) return null;

  const label =
    others.length === 1
      ? `${others[0]} is typing`
      : others.length === 2
      ? `${others[0]} and ${others[1]} are typing`
      : `${others.length} people are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5">
      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--muted)",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: "var(--muted)" }}>
        {label}…
      </span>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
