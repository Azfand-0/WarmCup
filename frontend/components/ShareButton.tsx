"use client";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.origin;
    const text = "I found a real-time safe space for when anxiety hits — warmcup. Anonymous, no signup, people are always there.";

    if (navigator.share) {
      try {
        await navigator.share({ title: "WarmCup", text, url });
        return;
      } catch { /* user cancelled */ }
    }

    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all hover:opacity-80 w-full"
      style={{
        background: copied ? "rgba(126,200,160,0.1)" : "var(--surface2)",
        color: copied ? "var(--online)" : "var(--muted)",
        border: "1px solid var(--border)",
      }}
    >
      <span>{copied ? "✓" : "🔗"}</span>
      <span>{copied ? "Link copied!" : "Share this space"}</span>
    </button>
  );
}
