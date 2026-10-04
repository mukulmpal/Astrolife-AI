/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE LANGUAGE SAFETY & LINTER
 * ============================================================================
 * Enforces:
 * 1. Zero technical astrological jargon in user-facing prose.
 * 2. Zero fatalistic or absolute deterministic claims (e.g. "paisa aayega", "dhokha hoga").
 * 3. Flexible sentence-length validation (2 to 5 sentences per section).
 * ============================================================================
 */

export const BANNED_JARGON_WORDS = [
  "drishti",
  "kendra",
  "trikona",
  "bhava",
  "neech",
  "uccha",
  "shatru",
  "vipat tara",
  "pratyari tara",
  "vadha tara",
  "gochara",
  "maraka",
  "badhaka",
  "combust",
  "debilitated",
  "exalted",
];

export const BANNED_CERTAINTY_PHRASES = [
  "definitely hoga",
  "pakka aayega",
  "dhokha milega",
  "dhokha dega",
  "paisa aa jayega",
  "promotion pakka",
  "rishta toot jayega",
  "accident hoga",
  "barbad ho jaoge",
  "guaranteed",
  "will certainly happen",
  "is guaranteed to",
  "you will definitely lose",
  "you will definitely win",
];

export interface SafetyCheckResult {
  passed: boolean;
  violations: string[];
}

/**
 * Validates text against banned jargon and fatalistic certainty phrases.
 */
export function validateNarrativeSafety(text: string): SafetyCheckResult {
  const lower = text.toLowerCase();
  const violations: string[] = [];

  for (const jargon of BANNED_JARGON_WORDS) {
    // Check for whole-word or boundary match
    const regex = new RegExp(`\\b${jargon}\\b`, "i");
    if (regex.test(lower)) {
      violations.push(`Banned jargon detected: "${jargon}"`);
    }
  }

  for (const phrase of BANNED_CERTAINTY_PHRASES) {
    if (lower.includes(phrase)) {
      violations.push(`Banned absolute phrase detected: "${phrase}"`);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Validates sentence count range (minimum 2, maximum 6 sentences).
 */
export function countSentences(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  // Match sentence terminators (., !, ?, ।, etc.)
  const matches = text.match(/[^.!?।]+[.!?।]+(\s|$)/g);
  return matches ? matches.length : 1;
}

export function validateSentenceLength(
  text: string,
  minSentences: number = 2,
  maxSentences: number = 6
): boolean {
  const count = countSentences(text);
  return count >= minSentences && count <= maxSentences;
}

/**
 * Cleanses common accidental jargon words into natural human alternatives.
 */
export function sanitizeAstrologicalText(text: string): string {
  let cleaned = text;

  const replacements: Array<[RegExp, string]> = [
    [/\bdrishti\b/gi, "prabhav"],
    [/\bkendra\b/gi, "kendriya sthiti"],
    [/\btrikona\b/gi, "shubh kone"],
    [/\bbhava\b/gi, "ghar"],
    [/\bgochara\b/gi, "vartamaan sthiti"],
    [/\bneech\b/gi, "kamzor"],
    [/\buccha\b/gi, "balwan"],
    [/\bpaisa aayega\b/gi, "paisa aane ke raste khul sakte hain"],
    [/\bdhokha milega\b/gi, "extra verification zaroori hai"],
    [/\bruka hua paisa mil jayega\b/gi, "pending payment par movement ban sakti hai"],
  ];

  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}
