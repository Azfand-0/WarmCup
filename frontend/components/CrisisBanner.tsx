"use client";
import { useState } from "react";

const HOTLINES = [
  { flag: "🇺🇸", country: "US",  name: "988 Suicide & Crisis",     number: "988",           tel: "988"             },
  { flag: "🇬🇧", country: "UK",  name: "Samaritans",               number: "116 123",       tel: "116123"          },
  { flag: "🇨🇦", country: "CA",  name: "Crisis Services Canada",   number: "1-833-456-4566",tel: "18334564566"     },
  { flag: "🇦🇺", country: "AU",  name: "Lifeline",                 number: "13 11 14",      tel: "131114"          },
  { flag: "🇮🇳", country: "IN",  name: "iCall",                    number: "9152987821",    tel: "9152987821"      },
  { flag: "🇵🇰", country: "PK",  name: "Umang",                    number: "0317-4288665",  tel: "03174288665"     },
  { flag: "🇩🇪", country: "DE",  name: "TelefonSeelsorge",         number: "0800 111 0 111",tel: "08001110111"     },
  { flag: "🌍", country: "INT", name: "Find A Helpline",           number: "findahelpline.com", tel: null          },
];

export default function CrisisBanner() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="flex-shrink-0 text-xs"
      style={{
        background: "rgba(196,149,106,0.06)",
        borderBottom: "1px solid rgba(196,149,106,0.15)",
      }}
    >
      {/* Collapsed bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          <span>🆘</span>
          <span>In danger? Crisis hotlines available</span>
          <span style={{ color: "var(--muted)", fontSize: "10px" }}>
            {expanded ? "▲" : "▼"}
          </span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{ color: "var(--muted)" }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Expanded hotline list */}
      {expanded && (
        <div
          className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
          style={{ borderTop: "1px solid rgba(196,149,106,0.1)" }}
        >
          <p className="col-span-full pt-2 mb-1" style={{ color: "var(--muted)" }}>
            These services are free, confidential, and available 24/7:
          </p>
          {HOTLINES.map((h) => (
            <div
              key={h.country}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
              style={{ background: "var(--surface2)" }}
            >
              <span>{h.flag}</span>
              <div className="flex-1 min-w-0">
                <span style={{ color: "var(--text-soft)" }}>{h.name}</span>
              </div>
              {h.tel ? (
                <a
                  href={`tel:${h.tel}`}
                  className="font-semibold flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                >
                  {h.number}
                </a>
              ) : (
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                >
                  Open →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
