"use client";

interface Props { count: number; }

export default function QuietRoomBanner({ count }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 gap-6"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
        style={{ background: "rgba(184,169,212,0.1)", border: "1px solid rgba(184,169,212,0.2)" }}
      >
        🤫
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
          Quiet Room
        </h2>
        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "var(--text-soft)" }}>
          No need to talk. Just be here. You are not alone in the silence.
        </p>
      </div>
      {count > 0 && (
        <div
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full"
          style={{ background: "rgba(184,169,212,0.08)", color: "var(--lavender)", border: "1px solid rgba(184,169,212,0.15)" }}
        >
          <span
            className="w-2 h-2 rounded-full online-dot"
            style={{ background: "var(--lavender)" }}
          />
          {count} {count === 1 ? "person" : "people"} sitting quietly together
        </div>
      )}
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Chat is disabled in this room intentionally.
      </p>
    </div>
  );
}
