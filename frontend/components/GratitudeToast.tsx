"use client";
import type { GratitudeToast as GratitudeData } from "@/lib/useChat";

interface Props { data: GratitudeData | null; }

export default function GratitudeToast({ data }: Props) {
  if (!data) return null;

  return (
    <div
      className="fixed bottom-28 right-4 z-40 w-72 rounded-2xl p-4 shadow-2xl"
      style={{
        background: "var(--surface2)",
        border: "1px solid rgba(196,149,106,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤍</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: data.fromColor || "var(--accent)" }}>
            {data.fromUsername}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-soft)" }}>
            sent you a thank you: &ldquo;{data.message}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
