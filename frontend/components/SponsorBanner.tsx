"use client";
import { useState } from "react";
import { getSponsor } from "@/lib/sponsors";

interface Props { roomId: string; }

export default function SponsorBanner({ roomId }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const sponsor = getSponsor(roomId);

  if (!sponsor || dismissed) return null;

  const color = sponsor.color ?? "var(--accent)";

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 text-xs flex-shrink-0"
      style={{
        background: `${color}08`,
        borderBottom: `1px solid ${color}25`,
      }}
    >
      {/* Sponsor logo */}
      {sponsor.logo && (
        <span className="text-lg flex-shrink-0">{sponsor.logo}</span>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <span style={{ color: "var(--muted)" }}>Sponsored · </span>
        <span className="font-semibold" style={{ color }}>{sponsor.name}</span>
        <span style={{ color: "var(--muted)" }}> — {sponsor.tagline}</span>
      </div>

      {/* CTA */}
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex-shrink-0 px-3 py-1 rounded-full font-semibold transition-opacity hover:opacity-80"
        style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
      >
        Learn more →
      </a>

      <button onClick={() => setDismissed(true)} style={{ color: "var(--muted)", flexShrink: 0 }}>✕</button>
    </div>
  );
}
