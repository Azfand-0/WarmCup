"use client";
import { useState } from "react";
import { activatePremium, type PremiumTier } from "@/lib/usePremium";

const CALM_COLORS = [
  "#c4956a", "#b8a9d4", "#7ec8a0", "#e8b4a0",
  "#a0c4e8", "#e8c4a0", "#c4a0e8", "#a0e8c4",
  "#e8a0b4", "#a0b4e8", "#f4c97e", "#9ecfb0",
];

const GLOW_COLORS = [
  "#c4956a", "#b8a9d4", "#7ec8a0", "#ff9d72",
  "#72d4ff", "#ff72c4", "#c4a0e8", "#72ffd4",
  "#ffd472", "#72b4ff", "#ffb872", "#d472ff",
];

const TIERS = [
  {
    id: "calm" as PremiumTier,
    name: "Calm",
    price: "$0.99",
    period: "/mo",
    emoji: "✨",
    color: "#c4956a",
    features: [
      "Pick your own username color",
      "System join/leave messages hidden",
      "✨ badge next to your name",
      "Support the community",
    ],
  },
  {
    id: "glow" as PremiumTier,
    name: "Glow",
    price: "$2.99",
    period: "/mo",
    emoji: "🌟",
    color: "#b8a9d4",
    badge: "Most popular",
    features: [
      "Everything in Calm",
      "Animated glowing ring on avatar",
      "Gradient username that stands out",
      "Shimmer effect on your messages",
      "🌟 Supporter badge",
      "Custom glow color",
    ],
  },
];

interface Props {
  onClose: () => void;
  onActivated: (tier: PremiumTier, color: string) => void;
}

export default function PremiumModal({ onClose, onActivated }: Props) {
  const [selected, setSelected]       = useState<PremiumTier>("glow");
  const [pickedColor, setPickedColor] = useState(CALM_COLORS[0]);
  const [step, setStep]               = useState<"pick" | "color" | "done">("pick");

  const tier = TIERS.find((t) => t.id === selected)!;
  const colors = selected === "glow" ? GLOW_COLORS : CALM_COLORS;

  function handleSubscribe() {
    // Both tiers get color picker before confirming
    setStep("color");
  }

  function handleColorConfirm() {
    // TODO: swap this block for real Stripe when Payment Links are ready:
    //   const LINKS = { calm: "https://buy.stripe.com/YOUR_CALM", glow: "https://buy.stripe.com/YOUR_GLOW" };
    //   window.open(LINKS[selected], "_blank");
    //   (then verify via webhook before calling activatePremium)
    activatePremium(selected, pickedColor);
    onActivated(selected, pickedColor);
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,13,10,0.94)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-6 text-center relative"
          style={{ background: "linear-gradient(135deg, rgba(196,149,106,0.12), rgba(184,169,212,0.12))" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ background: "var(--surface2)", color: "var(--muted)" }}
          >
            ✕
          </button>
          <p className="text-3xl mb-2">⭐</p>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Stand out. Support us.</h2>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Cancel anytime · Helps keep the space free</p>
        </div>

        {/* ── Step 1: Pick tier ───────────────────────────────── */}
        {step === "pick" && (
          <div className="p-5 space-y-3">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className="w-full rounded-2xl p-4 text-left transition-all relative"
                style={{
                  background: selected === t.id ? `${t.color}12` : "var(--surface2)",
                  border: `1.5px solid ${selected === t.id ? t.color + "60" : "var(--border)"}`,
                }}
              >
                {t.badge && (
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${t.color}20`, color: t.color }}
                  >
                    {t.badge}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{t.name}</p>
                    <p className="text-sm font-semibold" style={{ color: t.color }}>
                      {t.price}
                      <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>{t.period}</span>
                    </p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-soft)" }}>
                      <span style={{ color: t.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}

            <button
              onClick={handleSubscribe}
              className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95 mt-2"
              style={{
                background: `linear-gradient(135deg, ${tier.color}, ${tier.id === "glow" ? "#c4956a" : "#b8a9d4"})`,
                color: "#0f0d0a",
              }}
            >
              {tier.emoji} Get {tier.name} — {tier.price}/mo
            </button>
            <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
              Powered by Stripe · Secure · Cancel anytime
            </p>
          </div>
        )}

        {/* ── Step 2: Pick color (both tiers) ────────────────── */}
        {step === "color" && (
          <div className="p-5">
            <button
              onClick={() => setStep("pick")}
              className="flex items-center gap-1 text-xs mb-4 hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              ← Back
            </button>

            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
              {selected === "glow" ? "Pick your glow color" : "Pick your username color"}
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              {selected === "glow"
                ? "Sets your avatar glow, gradient username, and message shimmer color"
                : "This color shows next to your name for everyone in the room"}
            </p>

            {/* Color grid */}
            <div className="grid grid-cols-6 gap-2 mb-5">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setPickedColor(c)}
                  className="w-full aspect-square rounded-full transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: c,
                    border: pickedColor === c ? "3px solid white" : "3px solid transparent",
                    boxShadow: pickedColor === c ? `0 0 12px ${c}` : "none",
                  }}
                />
              ))}
            </div>

            {/* Live preview */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              {/* Avatar preview */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: `${pickedColor}22`,
                  color: pickedColor,
                  border: selected === "glow" ? `2px solid ${pickedColor}` : `1px solid ${pickedColor}50`,
                  boxShadow: selected === "glow"
                    ? `0 0 10px ${pickedColor}90, 0 0 20px ${pickedColor}40`
                    : "none",
                }}
              >
                Y
              </div>

              {/* Name + badge preview */}
              <div>
                {selected === "glow" ? (
                  <span
                    className="text-sm font-semibold"
                    style={{
                      background: `linear-gradient(90deg, ${pickedColor}, #b8a9d4)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    YourName 🌟
                  </span>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: pickedColor }}>
                    YourName ✨
                  </span>
                )}
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {selected === "glow" ? "gradient · glow ring · shimmer messages" : "custom color · calm badge"}
                </p>
              </div>
            </div>

            <button
              onClick={handleColorConfirm}
              className="w-full py-3 rounded-2xl text-sm font-bold active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${pickedColor}, ${selected === "glow" ? "#b8a9d4" : tier.color})`,
                color: "#0f0d0a",
              }}
            >
              Confirm &amp; Subscribe →
            </button>
            <p className="text-xs text-center mt-2" style={{ color: "var(--muted)" }}>
              You can change your color anytime in settings
            </p>
          </div>
        )}

        {/* ── Step 3: Done ────────────────────────────────────── */}
        {step === "done" && (
          <div className="p-6 text-center">
            <p className="text-5xl mb-4">{tier.emoji}</p>
            <p className="font-bold text-lg mb-2" style={{ color: "var(--online)" }}>
              Welcome to {tier.name}!
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--text-soft)" }}>
              Your badge and effects are active. Thank you for supporting the community 💚
            </p>
            {/* Color preview in done state */}
            <div
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl mb-5"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: `${pickedColor}22`,
                  color: pickedColor,
                  border: selected === "glow" ? `2px solid ${pickedColor}` : `1px solid ${pickedColor}50`,
                  boxShadow: selected === "glow" ? `0 0 10px ${pickedColor}80` : "none",
                }}
              >
                Y
              </div>
              {selected === "glow" ? (
                <span
                  className="text-sm font-semibold"
                  style={{
                    background: `linear-gradient(90deg, ${pickedColor}, #b8a9d4)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  YourName 🌟
                </span>
              ) : (
                <span className="text-sm font-semibold" style={{ color: pickedColor }}>
                  YourName ✨
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl text-sm font-semibold"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Back to chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
