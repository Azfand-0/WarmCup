"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface WallPost {
  id: string;
  message: string;
  timestamp: number;
  room?: string;
}

const WORKER = (process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787")
  .replace(/^wss:\/\//, "https://")
  .replace(/^ws:\/\//, "http://");

const COOLDOWN_KEY = "warmcup_wall_last_post";
const COOLDOWN_MS  = 5 * 60 * 1000; // 5 minutes between posts

export default function WallPage() {
  const [posts, setPosts]     = useState<WallPost[]>([]);
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted]   = useState(false);
  const [canPost, setCanPost] = useState(true);

  useEffect(() => {
    const last = parseInt(localStorage.getItem(COOLDOWN_KEY) ?? "0", 10);
    setCanPost(Date.now() - last > COOLDOWN_MS);
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res  = await fetch(`${WORKER}/wall`);
      const data = await res.json() as { posts: WallPost[] };
      setPosts(data.posts ?? []);
    } catch { /* offline */ }
    setLoading(false);
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || posting || !canPost) return;
    setPosting(true);
    try {
      await fetch(`${WORKER}/wall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim().slice(0, 200) }),
      });
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setText("");
      setPosted(true);
      setCanPost(false);
      setTimeout(() => setPosted(false), 4000);
      await fetchPosts();
    } catch { /* offline */ }
    setPosting(false);
  }

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60_000)   return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
  };

  return (
    <div className="min-h-screen px-4 py-10 max-w-lg mx-auto" style={{ background: "var(--bg)" }}>
      <div className="mb-8">
        <Link href="/" className="text-sm hover:opacity-70" style={{ color: "var(--muted)" }}>← back</Link>
        <h1 className="text-2xl font-bold mt-4" style={{ color: "var(--text)" }}>I made it through 💚</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Share that you got through a panic attack. You&apos;ll help someone who&apos;s struggling right now.
        </p>
      </div>

      {/* Post form */}
      <form onSubmit={handlePost} className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="I felt like I couldn't breathe, but I got through it. It passed."
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
          style={{
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(196,149,106,0.5)")}
          onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>{text.length}/200</span>
          <button
            type="submit"
            disabled={!text.trim() || posting || !canPost}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
          >
            {posted ? "Shared 💚" : posting ? "Posting…" : !canPost ? "Posted recently" : "Share"}
          </button>
        </div>
      </form>

      {/* Feed */}
      {loading ? (
        <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>Be the first to share 🌱</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="px-4 py-3 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{p.message}</p>
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>{timeAgo(p.timestamp)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
