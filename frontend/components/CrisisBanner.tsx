"use client";
import { useEffect, useState } from "react";

const ALL_HOTLINES = [
  { flag: "🇺🇸", country: "US",  lang: ["en-US","en"],  name: "988 Suicide & Crisis",      number: "988",            tel: "988"            },
  { flag: "🇬🇧", country: "UK",  lang: ["en-GB"],       name: "Samaritans",                number: "116 123",        tel: "116123"         },
  { flag: "🇨🇦", country: "CA",  lang: ["en-CA","fr-CA"],name: "Crisis Services Canada",   number: "1-833-456-4566", tel: "18334564566"    },
  { flag: "🇦🇺", country: "AU",  lang: ["en-AU"],       name: "Lifeline",                  number: "13 11 14",       tel: "131114"         },
  { flag: "🇮🇳", country: "IN",  lang: ["hi","en-IN"],  name: "iCall",                     number: "9152987821",     tel: "9152987821"     },
  { flag: "🇵🇰", country: "PK",  lang: ["ur"],          name: "Umang",                     number: "0317-4288665",   tel: "03174288665"    },
  { flag: "🇩🇪", country: "DE",  lang: ["de"],          name: "TelefonSeelsorge",          number: "0800 111 0 111", tel: "08001110111"    },
  { flag: "🇫🇷", country: "FR",  lang: ["fr"],          name: "Numéro national",           number: "3114",           tel: "3114"           },
  { flag: "🇪🇸", country: "ES",  lang: ["es"],          name: "Teléfono de la Esperanza",  number: "717 003 717",    tel: "717003717"      },
  { flag: "🇧🇷", country: "BR",  lang: ["pt","pt-BR"],  name: "CVV Brasil",                number: "188",            tel: "188"            },
  { flag: "🇳🇱", country: "NL",  lang: ["nl"],          name: "Zelfmoordlijn",             number: "0800 0113",      tel: "08000113"       },
  { flag: "🌍",  country: "INT", lang: [],              name: "Find A Helpline",            number: "findahelpline.com", tel: null           },
];

function detectHotlineIndex(): number {
  if (typeof navigator === "undefined") return 0;
  const lang = navigator.language ?? "en-US";
  const exact = lang.toLowerCase();
  const short = exact.split("-")[0];
  const idx   = ALL_HOTLINES.findIndex((h) =>
    h.lang.some((l) => l.toLowerCase() === exact || l.toLowerCase() === short)
  );
  return idx >= 0 ? idx : 0;
}

// Reorder so the detected local hotline is first
function orderedHotlines() {
  const idx = detectHotlineIndex();
  if (idx === 0) return ALL_HOTLINES;
  const list = [...ALL_HOTLINES];
  const [local] = list.splice(idx, 1);
  return [local, ...list];
}

export default function CrisisBanner({ autoExpand }: { autoExpand?: boolean }) {
  const [expanded, setExpanded]     = useState(false);
  const [dismissed, setDismissed]   = useState(false);
  const [hotlines, setHotlines]     = useState(ALL_HOTLINES);

  useEffect(() => {
    setHotlines(orderedHotlines());
    if (autoExpand && !dismissed) setExpanded(true);
  }, [autoExpand]); // eslint-disable-line react-hooks/exhaustive-deps

  if (dismissed) return null;

  const local = hotlines[0];

  return (
    <div
      className="flex-shrink-0 text-xs"
      style={{ background: "rgba(196,149,106,0.06)", borderBottom: "1px solid rgba(196,149,106,0.15)" }}
    >
      {/* Collapsed bar — shows local hotline inline */}
      <div className="flex items-center justify-between px-4 py-2 gap-2">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80 min-w-0"
          style={{ color: "var(--accent)" }}
        >
          <span className="flex-shrink-0">🆘</span>
          <span className="truncate">
            In crisis? {local.flag} {local.name} —{" "}
            {local.tel
              ? <strong>{local.number}</strong>
              : <span>{local.number}</span>
            }
          </span>
          <span style={{ color: "var(--muted)", fontSize: "10px", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
        </button>
        {local.tel && (
          <a
            href={`tel:${local.tel}`}
            className="flex-shrink-0 px-2.5 py-1 rounded-full font-semibold transition-opacity hover:opacity-80"
            style={{ background: "rgba(196,149,106,0.15)", color: "var(--accent)", border: "1px solid rgba(196,149,106,0.3)" }}
          >
            Call now
          </a>
        )}
        <button onClick={() => setDismissed(true)} style={{ color: "var(--muted)", flexShrink: 0 }} aria-label="Dismiss">✕</button>
      </div>

      {/* Expanded hotline list */}
      {expanded && (
        <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5" style={{ borderTop: "1px solid rgba(196,149,106,0.1)" }}>
          <p className="col-span-full pt-2 mb-1" style={{ color: "var(--muted)" }}>
            Free, confidential, 24/7 crisis support:
          </p>
          {hotlines.map((h) => (
            <div key={h.country} className="flex items-center gap-2 py-1.5 px-2 rounded-lg" style={{ background: "var(--surface2)" }}>
              <span>{h.flag}</span>
              <div className="flex-1 min-w-0">
                <span style={{ color: "var(--text-soft)" }}>{h.name}</span>
              </div>
              {h.tel ? (
                <a href={`tel:${h.tel}`} className="font-semibold flex-shrink-0" style={{ color: "var(--accent)" }}>{h.number}</a>
              ) : (
                <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="font-semibold flex-shrink-0" style={{ color: "var(--accent)" }}>Open →</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
