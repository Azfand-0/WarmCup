"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdSenseUnit from "@/components/AdSenseUnit";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [onlineCount, setOnlineCount]   = useState<number | null>(null);
  const [therapistHint, setTherapistHint] = useState(false);

  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787").replace(/^ws/, "http");
    fetch(`${base}/presence/global`)
      .then((r) => r.json())
      .then((d: { count?: number }) => setOnlineCount(d.count ?? 0))
      .catch(() => setOnlineCount(0));
  }, []);

  function enter() {
    setLoading(true);
    router.push("/chat");
  }

  function handleTherapist(e: React.MouseEvent) {
    e.preventDefault();
    setTherapistHint(true);
    setTimeout(() => setTherapistHint(false), 3000);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,149,106,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-xs">

        {/* Brand */}
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
          warmcup
        </p>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-snug" style={{ color: "var(--text)" }}>
            Feeling panic?{" "}
            <span style={{ color: "var(--accent)" }}>Open this.</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
            Real people dealing with the same thing are here right now —
            chat, breathe, and feel better together.
          </p>
        </div>

        {/* Live count */}
        {onlineCount !== null && onlineCount > 0 && (
          <div
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
            style={{ background: "rgba(126,200,160,0.08)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.2)" }}
          >
            <span className="online-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--online)" }} />
            {onlineCount === 1 ? "1 person here right now" : `${onlineCount} people here right now`}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={enter}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
          style={{
            background: loading ? "var(--accent-hover)" : "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)",
            color: "#0f0d0a",
            boxShadow: "0 0 40px rgba(196,149,106,0.25)",
            animation: loading ? "none" : "glow-pulse 3s ease-in-out infinite",
          }}
        >
          {loading ? "Opening…" : "Enter the room →"}
        </button>

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Free · Anonymous · No signup
        </p>

        {/* Therapist link — coming soon */}
        <div className="relative">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Need professional help?{" "}
            <a
              href="#"
              onClick={handleTherapist}
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              Talk to a therapist →
            </a>
          </p>
          {therapistHint && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap"
              style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              🕐 Therapist directory coming soon
            </div>
          )}
        </div>

        {/* AdSense */}
        <div className="w-full mt-2">
          <AdSenseUnit slot="XXXXXXXXXX" />
        </div>
      </div>
    </main>
  );
}
