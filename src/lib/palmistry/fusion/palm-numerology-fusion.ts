import type {
  AstroFusionNumerologyContext,
  FusionSignal,
  FusionTheme,
} from "./fusion-types";

const PERSONAL_YEAR_THEMES: Record<number, FusionTheme[]> = {
  1: ["career", "personality"],
  2: ["relationship", "family"],
  3: ["fame", "education"],
  4: ["career", "health_vitality"],
  5: ["travel", "career"],
  6: ["relationship", "family"],
  7: ["spirituality", "education"],
  8: ["wealth", "career"],
  9: ["spirituality", "travel"],
};

const LIFE_PATH_THEMES: Record<number, FusionTheme[]> = {
  1: ["personality", "career"],
  2: ["relationship", "family"],
  3: ["fame", "education"],
  4: ["career", "health_vitality"],
  5: ["travel", "career"],
  6: ["relationship", "family"],
  7: ["spirituality", "education"],
  8: ["wealth", "career"],
  9: ["spirituality", "relationship"],
};

function normalizeNumber(value?: number) {
  if (!value || Number.isNaN(value)) return null;
  let n = Math.abs(Math.trunc(value));

  while (n > 9) {
    n = String(n).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }

  return n;
}

function themeFromText(text: string): FusionTheme[] {
  const lower = text.toLowerCase();
  const themes: FusionTheme[] = [];

  if (/career|job|profession|business|work/.test(lower)) themes.push("career");
  if (/wealth|money|income|finance|gain/.test(lower)) themes.push("wealth");
  if (/love|marriage|relationship|partner/.test(lower)) themes.push("relationship");
  if (/travel|foreign|relocation|abroad/.test(lower)) themes.push("travel");
  if (/spiritual|meditation|inner|awakening/.test(lower)) themes.push("spirituality");
  if (/health|vitality|energy|stress/.test(lower)) themes.push("health_vitality");
  if (/fame|recognition|public|creative/.test(lower)) themes.push("fame");
  if (/education|study|learning|skill/.test(lower)) themes.push("education");

  return [...new Set(themes)];
}

export function extractNumerologyFusionSignals(numerology?: AstroFusionNumerologyContext): FusionSignal[] {
  if (!numerology) return [];

  const signals: FusionSignal[] = [];

  const personalYear = normalizeNumber(numerology.personalYearNumber);
  const lifePath = normalizeNumber(numerology.lifePathNumber);
  const destiny = normalizeNumber(numerology.destinyNumber);

  if (personalYear) {
    for (const theme of PERSONAL_YEAR_THEMES[personalYear] ?? []) {
      signals.push({
        id: `numerology_personal_year_${personalYear}_${theme}`,
        source: "numerology",
        theme,
        polarity: "support",
        strength: 0.58,
        title: `Personal Year ${personalYear}`,
        description: `Numerology personal year ${personalYear} supports ${theme} rhythm this year.`,
        evidence: [`Personal Year: ${personalYear}`],
      });
    }
  }

  if (lifePath) {
    for (const theme of LIFE_PATH_THEMES[lifePath] ?? []) {
      signals.push({
        id: `numerology_life_path_${lifePath}_${theme}`,
        source: "numerology",
        theme,
        polarity: "support",
        strength: 0.56,
        title: `Life Path ${lifePath}`,
        description: `Life Path ${lifePath} supports ${theme} as a life-pattern theme.`,
        evidence: [`Life Path: ${lifePath}`],
      });
    }
  }

  if (destiny) {
    for (const theme of LIFE_PATH_THEMES[destiny] ?? []) {
      signals.push({
        id: `numerology_destiny_${destiny}_${theme}`,
        source: "numerology",
        theme,
        polarity: "support",
        strength: 0.54,
        title: `Destiny Number ${destiny}`,
        description: `Destiny Number ${destiny} adds support to ${theme} themes.`,
        evidence: [`Destiny Number: ${destiny}`],
      });
    }
  }

  for (const themeText of numerology.themes ?? []) {
    for (const theme of themeFromText(themeText)) {
      signals.push({
        id: `numerology_theme_${theme}_${signals.length}`,
        source: "numerology",
        theme,
        polarity: "support",
        strength: 0.54,
        title: "Numerology theme",
        description: themeText,
        evidence: [`Numerology theme: ${themeText}`],
      });
    }
  }

  return signals;
}
