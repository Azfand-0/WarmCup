// Country room sponsors — mental health brands pay $100-500/mo
// Add sponsors here when brands sign up. Empty array = no banner shown.

export interface Sponsor {
  roomId: string;       // country channel ID, e.g. "us", "uk", "pk"
  name: string;
  tagline: string;
  url: string;
  logo?: string;        // emoji or image URL
  color?: string;       // accent color for the banner
}

const SPONSORS: Sponsor[] = [
  // Example entries — replace with real sponsors
  // {
  //   roomId: "us",
  //   name: "BetterHelp",
  //   tagline: "Professional therapy, online & affordable",
  //   url: "https://betterhelp.com",
  //   logo: "🧠",
  //   color: "#7ec8a0",
  // },
  // {
  //   roomId: "uk",
  //   name: "Calm",
  //   tagline: "The #1 app for sleep and meditation",
  //   url: "https://calm.com",
  //   logo: "🌊",
  //   color: "#a0c4e8",
  // },
];

export function getSponsor(roomId: string): Sponsor | null {
  return SPONSORS.find((s) => s.roomId === roomId) ?? null;
}
