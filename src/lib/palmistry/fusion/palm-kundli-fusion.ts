import type {
  AstroFusionChartContext,
  FusionSignal,
  FusionTheme,
} from "./fusion-types";

const PLANET_THEME_MAP: Record<string, FusionTheme[]> = {
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

const HOUSE_THEME_MAP: Record<number, FusionTheme[]> = {
  1: ["personality"],
  2: ["wealth", "family"],
  3: ["career", "education"],
  4: ["family", "health_vitality"],
  5: ["education", "fame"],
  6: ["career", "health_vitality"],
  7: ["relationship"],
  8: ["spirituality", "health_vitality"],
  9: ["spirituality", "travel", "education"],
  10: ["career", "fame"],
  11: ["wealth", "career"],
  12: ["travel", "spirituality"],
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function indicatorSignals(params: {
  sourceId: string;
  theme: FusionTheme;
  title: string;
  indicators?: string[];
  strength?: number;
}): FusionSignal[] {
  return (params.indicators ?? []).map((indicator, index) => ({
    id: `kundli_${params.sourceId}_${index}`,
    source: "kundli",
    theme: params.theme,
    polarity: "support",
    strength: params.strength ?? 0.66,
    title: params.title,
    description: indicator,
    evidence: [`Kundli indicator: ${indicator}`],
  }));
}

export function extractKundliFusionSignals(chart?: AstroFusionChartContext): FusionSignal[] {
  if (!chart) return [];

  const signals: FusionSignal[] = [];

  for (const planet of chart.strongPlanets ?? []) {
    const themes = PLANET_THEME_MAP[normalize(planet)] ?? [];

    for (const theme of themes) {
      signals.push({
        id: `kundli_strong_${normalize(planet)}_${theme}`,
        source: "kundli",
        theme,
        polarity: "support",
        strength: 0.68,
        title: `Strong ${planet} support`,
        description: `Kundli shows ${planet} as a strong planet, supporting ${theme} themes.`,
        evidence: [`Strong planet: ${planet}`],
      });
    }
  }

  for (const planet of chart.weakPlanets ?? []) {
    const themes = PLANET_THEME_MAP[normalize(planet)] ?? [];

    for (const theme of themes) {
      signals.push({
        id: `kundli_weak_${normalize(planet)}_${theme}`,
        source: "kundli",
        theme,
        polarity: "challenge",
        strength: 0.5,
        title: `Weak ${planet} caution`,
        description: `Kundli shows ${planet} as weaker, so ${theme} claims should be softened.`,
        evidence: [`Weak planet: ${planet}`],
      });
    }
  }

  for (const house of chart.activeHouses ?? []) {
    const themes = HOUSE_THEME_MAP[house] ?? [];

    for (const theme of themes) {
      signals.push({
        id: `kundli_house_${house}_${theme}`,
        source: "kundli",
        theme,
        polarity: "support",
        strength: 0.62,
        title: `Active ${house}th house`,
        description: `Kundli active house ${house} supports ${theme} themes.`,
        evidence: [`Active house: ${house}`],
      });
    }
  }

  signals.push(
    ...indicatorSignals({ sourceId: "career", theme: "career", title: "Kundli career indicator", indicators: chart.careerIndicators, strength: 0.68 }),
    ...indicatorSignals({ sourceId: "wealth", theme: "wealth", title: "Kundli wealth indicator", indicators: chart.wealthIndicators, strength: 0.66 }),
    ...indicatorSignals({ sourceId: "relationship", theme: "relationship", title: "Kundli relationship indicator", indicators: chart.relationshipIndicators, strength: 0.64 }),
    ...indicatorSignals({ sourceId: "travel", theme: "travel", title: "Kundli travel indicator", indicators: chart.travelIndicators, strength: 0.64 }),
    ...indicatorSignals({ sourceId: "spiritual", theme: "spirituality", title: "Kundli spirituality indicator", indicators: chart.spiritualIndicators, strength: 0.64 }),
    ...indicatorSignals({ sourceId: "vitality", theme: "health_vitality", title: "Kundli vitality indicator", indicators: chart.vitalityIndicators, strength: 0.56 }),
    ...indicatorSignals({ sourceId: "fame", theme: "fame", title: "Kundli fame indicator", indicators: chart.fameIndicators, strength: 0.64 }),
    ...indicatorSignals({ sourceId: "education", theme: "education", title: "Kundli education indicator", indicators: chart.educationIndicators, strength: 0.64 }),
  );

  return signals;
}
