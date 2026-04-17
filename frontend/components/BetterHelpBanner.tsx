"use client";
import { useEffect, useState } from "react";

const SHOW_AFTER_MS = 10 * 60 * 1000; // 10 minutes

export default function BetterHelpBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("bh_dismissed")) return;

    const id = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(id);
  }, []);

  function dismiss() {
    sessionStorage.setItem("bh_dismissed", "1");
    setDismissed(true);
  }

  if (!visible || dismissed) return null;

  return (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-4 py-3 text-sm"
      style={{
        background: "rgba(184,169,212,0.07)",
        borderTop: "1px solid rgba(184,169,212,0.12)",
      }}
    >
      <span className="text-lg">🧠</span>
      <p className="flex-1 text-xs leading-relaxed" style={{ color: "var(--text-soft)" }}>
        Talking regularly helps.{" "}
        <a
          href="https://betterhelp.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="underline font-medium"
          style={{ color: "var(--lavender)" }}
        >
          BetterHelp
        </a>{" "}
        connects you with a real therapist from home.
      </p>
      <button onClick={dismiss} style={{ color: "var(--muted)", fontSize: "12px" }}>
        ✕
      </button>
    </div>
  );
}
