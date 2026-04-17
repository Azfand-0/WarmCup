import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6"
        style={{ background: "rgba(196,149,106,0.1)", border: "1px solid rgba(196,149,106,0.2)" }}
      >
        🕯️
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
        Page not found
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        But you are. You&apos;re not alone.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-80"
        style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
      >
        Back to safety →
      </Link>
    </main>
  );
}
