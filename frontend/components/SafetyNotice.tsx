"use client";
import { useEffect, useState } from "react";

export default function SafetyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("safety_ack")) {
      setVisible(true);
      // Auto-dismiss after 8s — panicking users don't need to read it
      const t = setTimeout(() => dismiss(), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem("safety_ack", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs shadow-2xl"
      style={{
        background: "var(--surface2)",
        border: "1px solid rgba(196,122,106,0.3)",
        color: "var(--muted)",
        maxWidth: "calc(100vw - 2rem)",
        whiteSpace: "nowrap",
      }}
    >
      <span>🛡️</span>
      <span>
        Safe space · Predatory behavior is{" "}
        <span style={{ color: "#e8a090" }}>reported to local police</span>
      </span>
      <button
        onClick={dismiss}
        className="flex-shrink-0 ml-1 hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        ✕
      </button>
    </div>
  );
}
