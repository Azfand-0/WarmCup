export interface Channel {
  id: string;
  name: string;
  flag: string;
  group: "general" | "country" | "themed";
  quiet?: boolean;  // quiet room — no chatting
}

// Country channels
export const COUNTRY_CHANNELS: Channel[] = [
  { id: "global", name: "Global",          flag: "🌍", group: "country" },
  { id: "us",     name: "United States",   flag: "🇺🇸", group: "country" },
  { id: "uk",     name: "United Kingdom",  flag: "🇬🇧", group: "country" },
  { id: "ca",     name: "Canada",          flag: "🇨🇦", group: "country" },
  { id: "au",     name: "Australia",       flag: "🇦🇺", group: "country" },
  { id: "in",     name: "India",           flag: "🇮🇳", group: "country" },
  { id: "pk",     name: "Pakistan",        flag: "🇵🇰", group: "country" },
  { id: "bd",     name: "Bangladesh",      flag: "🇧🇩", group: "country" },
  { id: "de",     name: "Germany",         flag: "🇩🇪", group: "country" },
  { id: "fr",     name: "France",          flag: "🇫🇷", group: "country" },
  { id: "es",     name: "Spain",           flag: "🇪🇸", group: "country" },
  { id: "it",     name: "Italy",           flag: "🇮🇹", group: "country" },
  { id: "nl",     name: "Netherlands",     flag: "🇳🇱", group: "country" },
  { id: "se",     name: "Sweden",          flag: "🇸🇪", group: "country" },
  { id: "pl",     name: "Poland",          flag: "🇵🇱", group: "country" },
  { id: "ru",     name: "Russia",          flag: "🇷🇺", group: "country" },
  { id: "tr",     name: "Turkey",          flag: "🇹🇷", group: "country" },
  { id: "br",     name: "Brazil",          flag: "🇧🇷", group: "country" },
  { id: "mx",     name: "Mexico",          flag: "🇲🇽", group: "country" },
  { id: "ar",     name: "Argentina",       flag: "🇦🇷", group: "country" },
  { id: "ng",     name: "Nigeria",         flag: "🇳🇬", group: "country" },
  { id: "za",     name: "South Africa",    flag: "🇿🇦", group: "country" },
  { id: "eg",     name: "Egypt",           flag: "🇪🇬", group: "country" },
  { id: "sa",     name: "Saudi Arabia",    flag: "🇸🇦", group: "country" },
  { id: "ae",     name: "UAE",             flag: "🇦🇪", group: "country" },
  { id: "jp",     name: "Japan",           flag: "🇯🇵", group: "country" },
  { id: "kr",     name: "South Korea",     flag: "🇰🇷", group: "country" },
  { id: "ph",     name: "Philippines",     flag: "🇵🇭", group: "country" },
  { id: "id",     name: "Indonesia",       flag: "🇮🇩", group: "country" },
];

// Themed / hangout channels
export const THEMED_CHANNELS: Channel[] = [
  { id: "night-owls",      name: "Night Owls",       flag: "🦉", group: "themed" },
  { id: "morning-coffee",  name: "Morning Coffee",   flag: "☕", group: "themed" },
  { id: "music-vibes",     name: "Music Vibes",      flag: "🎵", group: "themed" },
  { id: "just-venting",    name: "Just Venting",     flag: "💭", group: "themed" },
  { id: "silly-stuff",     name: "Silly Stuff",      flag: "😄", group: "themed" },
  { id: "deep-talks",      name: "Deep Talks",       flag: "🌊", group: "themed" },
  { id: "quiet-room",      name: "Quiet Room",       flag: "🤫", group: "themed", quiet: true },
];

export const CHANNELS: Channel[] = [...COUNTRY_CHANNELS, ...THEMED_CHANNELS];

const LANG_TO_CHANNEL: Record<string, string> = {
  "en-US": "us", "en-GB": "uk", "en-CA": "ca", "en-AU": "au", "en-IN": "in",
  "hi": "in", "ur": "pk", "ur-PK": "pk", "bn": "bd",
  "de": "de", "fr": "fr", "es": "es", "it": "it",
  "nl": "nl", "sv": "se", "pl": "pl", "ru": "ru", "tr": "tr",
  "pt-BR": "br", "es-MX": "mx", "es-AR": "ar",
  "ja": "jp", "ko": "kr", "ar": "eg",
};

export function detectCountryChannel(): string {
  if (typeof navigator === "undefined") return "global";
  const lang = navigator.language ?? "";
  return LANG_TO_CHANNEL[lang] ?? LANG_TO_CHANNEL[lang.split("-")[0]] ?? "global";
}
