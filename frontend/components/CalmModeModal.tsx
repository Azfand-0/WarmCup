"use client";

interface Props { onClose: () => void; onActivate: () => void; isActive: boolean; }

const FEATURES = [
  { emoji: "🎨", text: "Custom username color — stand out warmly" },
  { emoji: "🏅", text: "Supporter badge next to your name" },
  { emoji: "🚫", text: "No affiliate banners ever" },
  { emoji: "💌", text: "Exclusive #warm-circle lounge channel" },
  { emoji: "🌙", text: "Priority support from moderators" },
  { emoji: "❤️", text: "Directly fund a free community space" },
];

export default function CalmModeModal({ onClose, onActivate, isActive }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.93)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header gradient */}
        <div
          className="px-6 py-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(196,149,106,0.15), rgba(184,169,212,0.15))" }}
        >
          <p className="text-3xl mb-2">🕯️</p>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Calm Mode</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>Support the community. Unlock perks.</p>
          <div className="mt-4">
            <span className="text-3xl font-bold" style={{ color: "var(--accent)" }}>$2.99</span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>/month</span>
          </div>
        </div>

        <div className="p-6">
          <ul className="space-y-3 mb-6">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-soft)" }}>
                <span className="flex-shrink-0">{f.emoji}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          {isActive ? (
            <div
              className="w-full py-3 rounded-xl text-sm font-semibold text-center"
              style={{ background: "rgba(126,200,160,0.15)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.3)" }}
            >
              ✓ Calm Mode is active — thank you 💚
            </div>
          ) : (
            <button
              onClick={onActivate}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
            >
              Unlock Calm Mode →
            </button>
          )}

          <p className="text-xs text-center mt-3" style={{ color: "var(--muted)" }}>
            Stripe checkout · Cancel anytime · Payments coming soon
          </p>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-xs"
            style={{ color: "var(--muted)" }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
