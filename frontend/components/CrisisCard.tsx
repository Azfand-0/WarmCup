"use client";

// Localized crisis hotlines — keyed by browser language prefix
const HOTLINES: Record<string, { name: string; number: string; tel: string }> = {
  en_US: { name: "988 Suicide & Crisis Lifeline", number: "988",            tel: "988"          },
  en_GB: { name: "Samaritans",                    number: "116 123",        tel: "116123"        },
  en_AU: { name: "Lifeline Australia",            number: "13 11 14",       tel: "131114"        },
  en_CA: { name: "Crisis Services Canada",        number: "1-833-456-4566", tel: "18334564566"   },
  en_IN: { name: "iCall",                         number: "9152987821",     tel: "9152987821"    },
  de:    { name: "TelefonSeelsorge",              number: "0800 111 0 111", tel: "08001110111"   },
  fr:    { name: "Numéro national prévention",    number: "3114",           tel: "3114"          },
  es:    { name: "Teléfono de la Esperanza",      number: "717 003 717",    tel: "717003717"     },
  pt:    { name: "CVV Brasil",                    number: "188",            tel: "188"           },
  nl:    { name: "Zelfmoordlijn",                 number: "0800 0113",      tel: "08000113"      },
  ar:    { name: "KSA Mental Health",             number: "920033360",      tel: "920033360"     },
  ur:    { name: "Umang Pakistan",                number: "0317-4288665",   tel: "03174288665"   },
  hi:    { name: "iCall India",                   number: "9152987821",     tel: "9152987821"    },
};

function getHotline() {
  if (typeof navigator === "undefined") return HOTLINES.en_US;
  const lang = navigator.language ?? "en-US";
  const full  = lang.replace("-", "_");
  const short = lang.split("-")[0];
  return HOTLINES[full] ?? HOTLINES[short] ?? HOTLINES.en_US;
}

interface Props {
  onDismiss: () => void;
}

export default function CrisisCard({ onDismiss }: Props) {
  const hotline = getHotline();

  return (
    <div
      className="mx-4 my-2 p-4 rounded-2xl flex-shrink-0"
      style={{
        background: "rgba(196,122,106,0.08)",
        border: "1px solid rgba(196,122,106,0.25)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">💜</span>
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            It sounds like you're going through something really hard right now.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-soft)" }}>
            This room is here for you. If you're in danger, a trained crisis counsellor is one call away — free and confidential.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={`tel:${hotline.tel}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "rgba(196,122,106,0.18)", color: "#e8a090", border: "1px solid rgba(196,122,106,0.35)" }}
            >
              📞 {hotline.name} · {hotline.number}
            </a>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all hover:opacity-70"
              style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              Other countries →
            </a>
          </div>
        </div>
        <button onClick={onDismiss} className="text-xs flex-shrink-0 hover:opacity-70" style={{ color: "var(--muted)" }}>✕</button>
      </div>
    </div>
  );
}
