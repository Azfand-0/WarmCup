"use client";

interface Props { enabled: boolean; onToggle: () => void; }

export default function SlowModeIndicator({ enabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? "Slow mode on — click to turn off" : "Turn on slow mode (1 msg/5s)"}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all hover:opacity-80"
      style={{
        background: enabled ? "rgba(232,180,106,0.15)" : "var(--surface2)",
        color: enabled ? "#e8b46a" : "var(--muted)",
        border: `1px solid ${enabled ? "rgba(232,180,106,0.3)" : "var(--border)"}`,
      }}
    >
      🐢 {enabled ? "Slow mode on" : "Slow mode"}
    </button>
  );
}
