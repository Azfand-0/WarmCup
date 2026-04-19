"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const WORKER = (process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787")
  .replace(/^wss?:\/\//, (m) => m.startsWith("wss") ? "https://" : "http://");

const TESTIMONIALS = [
  { text: "I typed \"I can't breathe\" and someone said \"I know, I'm here.\" That was enough.", time: "3am" },
  { text: "It's 2am and my family is asleep. Just knowing someone else is awake feeling this… it helped more than I expected.", time: "last night" },
  { text: "I've been mid-panic for 20 minutes. I found this, posted once, and someone talked me through it. I'm okay now.", time: "an hour ago" },
];

interface WallPost { id: string; message: string; timestamp: number; }

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [onlineCount, setOnlineCount]   = useState<number | null>(null);
  const [wallPosts, setWallPosts]       = useState<WallPost[]>([]);

  useEffect(() => {
    fetch(`${WORKER}/presence/global`)
      .then((r) => r.json())
      .then((d: { count?: number }) => setOnlineCount(d.count ?? 0))
      .catch(() => setOnlineCount(0));

    fetch(`${WORKER}/wall`)
      .then((r) => r.json())
      .then((d: { posts?: WallPost[] }) => {
        const posts = d.posts ?? [];
        setWallPosts(posts.slice(-3).reverse());
      })
      .catch(() => {});
  }, []);

  function enter() {
    setLoading(true);
    router.push("/chat");
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,149,106,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-16 flex flex-col gap-16">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center gap-6">
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>warmcup</p>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: "var(--text)" }}>
              Someone is awake right now<br />
              <span style={{ color: "var(--accent)" }}>feeling exactly what you feel.</span>
            </h1>
            <p className="text-base leading-relaxed max-w-sm mx-auto" style={{ color: "var(--text-soft)" }}>
              When panic hits at 2am, you don't need a hotline or a therapist.
              You need to know you're not alone. Open the door — someone's already here.
            </p>
          </div>

          {/* Live count */}
          {onlineCount !== null && (
            <div
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
              style={{ background: "rgba(126,200,160,0.08)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.2)" }}
            >
              <span className="online-dot w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--online)" }} />
              {onlineCount === 0
                ? "The room is quiet — be the first one in"
                : onlineCount === 1
                  ? "1 person here right now"
                  : `${onlineCount} people here right now`}
            </div>
          )}

          <button
            onClick={enter}
            disabled={loading}
            className="w-full max-w-xs py-4 rounded-2xl text-base font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)",
              color: "#0f0d0a",
              boxShadow: "0 0 40px rgba(196,149,106,0.25)",
              animation: loading ? "none" : "glow-pulse 3s ease-in-out infinite",
            }}
          >
            {loading ? "Opening…" : "Open the door →"}
          </button>

          <p className="text-xs" style={{ color: "var(--muted)" }}>Free · Anonymous · No signup · No judgment</p>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-center" style={{ color: "var(--muted)" }}>How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🚪", title: "Open the room", body: "No account, no name — just you. Takes two seconds." },
              { icon: "🫂", title: "Someone's there", body: "Real people, real-time, same struggle. No scripts, no bots." },
              { icon: "🌿", title: "You get through it", body: "Together. Then share 'I made it through' for the next person." },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="px-4 py-4 rounded-2xl space-y-2"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-center" style={{ color: "var(--muted)" }}>What people say</h2>
          <div className="space-y-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="px-4 py-4 rounded-2xl"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-soft)" }}>&ldquo;{t.text}&rdquo;</p>
                <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>— Anonymous · {t.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── I made it through wall ────────────────────────── */}
        {wallPosts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>I made it through 💚</h2>
              <Link href="/wall" className="text-xs hover:opacity-70" style={{ color: "var(--accent)" }}>See all →</Link>
            </div>
            <div className="space-y-3">
              {wallPosts.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-3 rounded-2xl"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{p.message}</p>
                </div>
              ))}
            </div>
            <Link
              href="/wall"
              className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "rgba(126,200,160,0.08)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.2)" }}
            >
              💚 I made it through — share yours
            </Link>
          </section>
        )}

        {/* ── Safety promise ────────────────────────────────── */}
        <section
          className="px-5 py-4 rounded-2xl text-center space-y-2"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>You are safe here</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            Moderated 24/7 · Free crisis hotlines always visible · Anonymous conversations ·
            Content filtered for safety · No data sold · No ads in the room
          </p>
          <div className="flex items-center justify-center gap-4 pt-1 text-xs" style={{ color: "var(--muted)" }}>
            <span>🔒 Anonymous</span>
            <span>🛡️ Moderated</span>
            <span>💜 Free forever</span>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────── */}
        <section className="text-center space-y-4">
          <p className="text-base font-medium" style={{ color: "var(--text-soft)" }}>
            You don&apos;t have to white-knuckle this alone.
          </p>
          <button
            onClick={enter}
            disabled={loading}
            className="w-full max-w-xs py-4 rounded-2xl text-base font-semibold transition-all active:scale-[0.97] disabled:opacity-60 mx-auto block"
            style={{
              background: "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)",
              color: "#0f0d0a",
            }}
          >
            {loading ? "Opening…" : "Open the door →"}
          </button>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Need professional help?{" "}
            <a href="tel:988" className="underline hover:opacity-80" style={{ color: "var(--accent)" }}>Call 988</a>
            {" "}or{" "}
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: "var(--accent)" }}>find a helpline near you →</a>
          </p>
        </section>

      </div>
    </main>
  );
}
