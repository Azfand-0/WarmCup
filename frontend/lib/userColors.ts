// Deterministic warm color per username — same name always gets same color
const WARM_COLORS = [
  "#c4956a", // amber
  "#b8a9d4", // lavender
  "#7ec8a0", // mint
  "#e8b4a0", // peach
  "#a0c4e8", // soft blue
  "#e8c4a0", // warm sand
  "#c4a0e8", // soft purple
  "#a0e8c4", // sea green
  "#e8a0b4", // rose
  "#a0b4e8", // periwinkle
  "#d4c4a0", // warm beige
  "#b4d4a0", // sage
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getUserColor(username: string): string {
  return WARM_COLORS[hashString(username) % WARM_COLORS.length];
}
