import type {
  AstroFusionDashaContext,
  FusionSignal,
  FusionTheme,
} from "./fusion-types";

const PLANET_DASHA_THEMES: Record<string, FusionTheme[]> = {
  sun: ["career", "fame", "personality"],
  surya: ["career", "fame", "personality"],
  moon: ["relationship", "travel", "spirituality"],
  chandra: ["relationship", "travel", "spirituality"],
  mars: ["career", "personality"],
  mangal: ["career", "personality"],
  mercury: ["career", "education", "wealth"],
  budh: ["career", "education", "wealth"],
  jupiter: ["education", "wealth", "spirituality"],
  guru: ["education", "wealth", "spirituality"],
  venus: ["relationship", "fame", "wealth"],
  shukra: ["relationship", "fame", "wealth"],
  saturn: ["career", "personality"],
  shani: ["career", "personality"],
  rahu: ["career", "travel", "fame"],
  ketu: ["spirituality", "personality"],
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function themeFromText(text: string): FusionTheme[] {
  const lower = text.toLowerCase();
  const themes: FusionTheme[] = [];

  if (/career|job|profession|business|work/.test(lower)) themes.push("career");
  if (/wealth|money|income|finance|gain/.test(lower)) themes.push("wealth");
  if (/love|marriage|relationship|partner/.test(lower)) themes.push("relationship");
  if (/travel|foreign|relocation|abroad/.test(lower)) themes.push("travel");
  if (/spiritual|meditation|moksha|inner/.test(lower)) themes.push("spirituality");
  if (/health|vitality|energy|stress/.test(lower)) themes.push("health_vitality");
  if (/fame|recognition|public|creative/.test(lower)) themes.push("fame");
  if (/education|study|learning|skill/.test(lower)) themes.push("education");

  return [...new Set(themes)];
}

export function extractDashaFusionSignals(dasha?: AstroFusionDashaContext): FusionSignal[] {
  if (!dasha) return [];

  const signals: FusionSignal[] = [];
  const activePlanets = [
    dasha.currentMD,
    dasha.currentAD,
    dasha.currentPD,
    ...(dasha.activePlanets ?? []),
  ].filter(Boolean) as string[];

  for (const planet of activePlanets) {
    const themes = PLANET_DASHA_THEMES[normalize(planet)] ?? [];

    for (const theme of themes) {
      signals.push({
        id: `dasha_${normalize(planet)}_${theme}`,
        source: "dasha",
        theme,
        polarity: "support",
        strength: 0.66,
        title: `${planet} dasha activation`,
        description: `${planet} dasha/antardasha activates ${theme} themes in timing.`,
        evidence: [
          dasha.currentMD ? `MD: ${dasha.currentMD}` : "",
          dasha.currentAD ? `AD: ${dasha.currentAD}` : "",
          dasha.currentPD ? `PD: ${dasha.currentPD}` : "",
        ].filter(Boolean),
      });
    }
  }

  for (const themeText of dasha.themes ?? []) {
    for (const theme of themeFromText(themeText)) {
      signals.push({
        id: `dasha_theme_${theme}_${signals.length}`,
        source: "dasha",
        theme,
        polarity: "support",
        strength: 0.62,
        title: "Dasha theme activation",
        description: themeText,
        evidence: [`Dasha theme: ${themeText}`],
      });
    }
  }

  return signals;
}
