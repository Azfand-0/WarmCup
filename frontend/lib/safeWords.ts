// Content moderation — client-side first pass. Worker applies same rules server-side.
// Three tiers: replace (soft), warn (show crisis), block (return null = don't send)

// Tier 1 — replace with gentler phrasing
const REPLACEMENTS: [RegExp, string][] = [
  [/\bkill (my)?self\b/gi,            "I'm really struggling"],
  [/\bwant to die\b/gi,               "this pain feels unbearable"],
  [/\bend my life\b/gi,               "I need things to change"],
  [/\bno (reason|point) to live\b/gi, "I'm feeling hopeless"],
  [/\bhate (my)?self\b/gi,            "I'm being really hard on myself"],
];

// Tier 2 — allow through but show crisis banner
const CRISIS_PATTERNS = [
  /\bsuicid/i,
  /\bself.?harm\b/i,
  /\bcutting myself\b/i,
  /\bwant to die\b/i,
  /\bend my life\b/i,
];

// Tier 3 — block entirely, return null
// Sexual solicitation, grooming, slurs, hardcore harassment
const BLOCK_PATTERNS = [
  // Grooming / predatory
  /\bhow old are you\b/i,
  /\basl\b/i,
  /\bsend (nudes?|pics?|photos?)\b/i,
  /\bwanna (meet|hookup|fuck)\b/i,
  /\bcome to my\b/i,
  /\bmeet (me|up) (irl|in person|tonight|now)\b/i,
  /\b(snap|insta|ig|whatsapp|telegram|discord)[:?\s].{1,30}(#\d{4})?\b/i,
  // Hate speech / slurs (abbreviated to avoid listing them)
  /\bn[i1!]gg[ae3r]/i,
  /\bf[a4]gg[o0]t/i,
  /\bretard(ed)?\b/i,
  /\bk[i1]ll (all|every|those)\b/i,
  // Hardcore harassment
  /\bi (will|'ll) (find|kill|hurt|rape) you\b/i,
  /\byour (address|location|ip)\b/i,
  // Phone/contact farming
  /\b\+?\d[\d\s\-]{9,14}\d\b/,   // phone numbers
];

export function filterText(text: string): {
  filtered: string | null;   // null = block entirely
  showCrisis: boolean;
  blocked: boolean;
  reason?: string;
} {
  // Tier 3 — block
  for (const p of BLOCK_PATTERNS) {
    if (p.test(text)) {
      return { filtered: null, showCrisis: false, blocked: true, reason: "inappropriate" };
    }
  }

  // Tier 1 — replace
  let filtered = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    filtered = filtered.replace(pattern, replacement);
  }

  // Tier 2 — crisis flag
  const showCrisis = CRISIS_PATTERNS.some((p) => p.test(text));

  return { filtered, showCrisis, blocked: false };
}
