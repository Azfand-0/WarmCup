"use client";
import { useState } from "react";

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  country: string;
  flag: string;
  available: boolean;
  languages: string[];
  bookUrl: string;
  affiliateNote?: string;
}

// Seed data — in production this would be fetched from your API / CMS
// Therapists pay to be listed. Affiliate commission on bookings.
const THERAPISTS: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah M.",
    title: "Clinical Psychologist",
    specialties: ["Panic disorder", "Anxiety", "CBT"],
    country: "United States",
    flag: "🇺🇸",
    available: true,
    languages: ["English"],
    bookUrl: "https://betterhelp.com",
    affiliateNote: "via BetterHelp",
  },
  {
    id: "2",
    name: "Dr. Amir K.",
    title: "Psychotherapist",
    specialties: ["Anxiety", "Trauma", "EMDR"],
    country: "United Kingdom",
    flag: "🇬🇧",
    available: true,
    languages: ["English", "Arabic"],
    bookUrl: "https://betterhelp.com",
    affiliateNote: "via BetterHelp",
  },
  {
    id: "3",
    name: "Priya S.",
    title: "Counsellor",
    specialties: ["Panic attacks", "Stress", "Mindfulness"],
    country: "India",
    flag: "🇮🇳",
    available: false,
    languages: ["English", "Hindi"],
    bookUrl: "https://betterhelp.com",
    affiliateNote: "via BetterHelp",
  },
];

interface Props { onClose: () => void; }

export default function TherapistDirectory({ onClose }: Props) {
  const [filter, setFilter] = useState("");

  const filtered = THERAPISTS.filter(
    (t) =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.country.toLowerCase().includes(filter.toLowerCase()) ||
      t.specialties.some((s) => s.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,13,10,0.93)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden flex flex-col"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "85vh" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex-shrink-0 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="font-bold text-base" style={{ color: "var(--text)" }}>
              🧠 Talk to a therapist
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Professional support, online · Affiliate partnerships
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--muted)" }}>✕</button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name, country, or specialty…"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>No matches found</p>
          )}

          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-4"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: "rgba(196,149,106,0.15)", color: "var(--accent)", border: "1px solid rgba(196,149,106,0.25)" }}
                >
                  {t.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{t.name}</span>
                    <span>{t.flag}</span>
                    {/* Available dot */}
                    <span
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: t.available ? "rgba(126,200,160,0.1)" : "rgba(100,116,139,0.1)",
                        color: t.available ? "var(--online)" : "var(--muted)",
                        border: `1px solid ${t.available ? "rgba(126,200,160,0.25)" : "var(--border)"}`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: t.available ? "var(--online)" : "var(--muted)" }}
                      />
                      {t.available ? "Available now" : "Busy"}
                    </span>
                  </div>

                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{t.title} · {t.country}</p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.specialties.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(184,169,212,0.1)", color: "var(--lavender)", border: "1px solid rgba(184,169,212,0.2)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                    🗣 {t.languages.join(", ")}
                  </p>

                  {t.available ? (
                    <a
                      href={t.bookUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #c4956a, #b8a9d4)",
                        color: "#0f0d0a",
                        boxShadow: "0 0 18px rgba(196,149,106,0.35)",
                        animation: "glow-pulse 2.5s ease-in-out infinite",
                      }}
                    >
                      💬 Talk to {t.name.split(" ")[0]} now
                    </a>
                  ) : (
                    <div
                      className="mt-3 flex items-center justify-center w-full py-2.5 rounded-xl text-sm"
                      style={{ background: "var(--surface3)", color: "var(--muted)", border: "1px solid var(--border)" }}
                    >
                      Not available right now
                    </div>
                  )}
                  {t.affiliateNote && (
                    <p className="text-xs mt-1.5 text-center" style={{ color: "var(--muted)" }}>
                      via {t.affiliateNote.replace("via ", "")} · affiliate link
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* CTA to list your practice */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(196,149,106,0.06)", border: "1px dashed rgba(196,149,106,0.3)" }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--accent)" }}>Are you a therapist?</p>
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
              Reach thousands of people actively seeking help. $100–500/mo listing.
            </p>
            <a
              href="mailto:hello@warmcup.app?subject=Therapist listing"
              className="inline-block text-xs px-5 py-2 rounded-xl font-semibold"
              style={{ background: "rgba(196,149,106,0.15)", color: "var(--accent)", border: "1px solid rgba(196,149,106,0.3)" }}
            >
              Apply to be listed →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
