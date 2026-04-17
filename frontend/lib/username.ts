// Expanded word lists for more unique, warm, anonymous names
const ADJECTIVES = [
  "Calm",  "Gentle", "Brave",  "Warm",   "Quiet",  "Kind",   "Soft",
  "Still", "Steady", "Safe",   "Clear",  "Bright", "Cool",   "Light",
  "Mild",  "Tender", "Serene", "Peaceful","Golden", "Misty",  "Velvet",
  "Amber", "Silver", "Cozy",   "Humble", "Tender", "Vivid",  "Swift",
  "Lunar", "Solar",  "Arctic", "Autumn", "Spring", "Dusk",   "Dawn",
];

const NOUNS = [
  "Wave",   "Cloud",  "Star",   "Moon",   "Rain",   "Wind",   "River",
  "Light",  "Leaf",   "Dawn",   "Brook",  "Shore",  "Field",  "Stone",
  "Sky",    "Forest", "Candle", "Harbor", "Meadow", "Pebble", "Flame",
  "Ember",  "Lantern","Feather","Willow", "Cedar",  "Birch",  "Maple",
  "Breeze", "Fog",    "Mist",   "Spark",  "Pearl",  "Coral",  "Jasper",
];

function generate(): string {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num  = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

export function getUsername(): string {
  if (typeof window === "undefined") return "Anonymous";
  let name = localStorage.getItem("warmcup_username");
  if (!name) {
    name = generate();
    localStorage.setItem("warmcup_username", name);
  }
  return name;
}

export function resetUsername(): string {
  const name = generate();
  localStorage.setItem("warmcup_username", name);
  return name;
}
