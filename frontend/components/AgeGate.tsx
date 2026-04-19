"use client";
import { useEffect, useState } from "react";

const KEY = "warmcup_age_confirmed";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState(true); // optimistic — avoid flash on return visits

  useEffect(() => {
    setConfirmed(!!localStorage.getItem(KEY));
  }, []);

  function confirm() {
    localStorage.setItem(KEY, "1");
    setConfirmed(true);
  }

  if (confirmed) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,149,106,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-sm w-full text-center space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>warmcup</p>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Before you enter</h1>
        </div>

        <div
          className="px-5 py-4 rounded-2xl text-sm leading-relaxed space-y-3 text-left"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-soft)" }}
        >
          <p>WarmCup is a space for adults dealing with anxiety and panic. It contains real conversations about distress and mental health.</p>
          <p>You may encounter people in difficult moments. The community is here to support, not to harm.</p>
          <p style={{ color: "var(--muted)" }}>This space is intended for people <strong style={{ color: "var(--text)" }}>18 years or older</strong>.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={confirm}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)",
              color: "#0f0d0a",
              boxShadow: "0 0 30px rgba(196,149,106,0.2)",
            }}
          >
            I am 18 or older — Enter
          </button>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            If you are under 18 and in crisis, please reach out to a trusted adult or call{" "}
            <a href="tel:988" className="underline" style={{ color: "var(--accent)" }}>988</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
