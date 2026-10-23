import type { AstroLifeFusionContext } from "./fusion-types";

type JsonObject = Record<string, unknown>;

function objectValue(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => stringValue(item)).filter(Boolean) as string[];
  }

  const single = stringValue(value);
  return single ? [single] : undefined;
}

function numberArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => numberValue(item)).filter((item): item is number => typeof item === "number");
  }

  const single = numberValue(value);
  return typeof single === "number" ? [single] : undefined;
}

function firstObject(raw: JsonObject, keys: string[]) {
  for (const key of keys) {
    const candidate = objectValue(raw[key]);
    if (Object.keys(candidate).length > 0) return candidate;
  }

  return {};
}

export function normalizeAstroLifeFusionContext(rawInput: unknown): AstroLifeFusionContext {
  const raw = objectValue(rawInput);
  const chart = firstObject(raw, ["chart", "kundli", "birthChart"]);
  const dasha = firstObject(raw, ["dasha", "dashaContext", "timing"]);
  const numerology = firstObject(raw, ["numerology", "numbers", "numberContext"]);

  const context: AstroLifeFusionContext = {};

  if (Object.keys(chart).length > 0) {
    context.chart = {
      ascendant: stringValue(chart.ascendant ?? chart.lagna),
      moonSign: stringValue(chart.moonSign ?? chart.rashi),
      sunSign: stringValue(chart.sunSign),
      strongPlanets: stringArray(chart.strongPlanets ?? chart.strong_planets),
      weakPlanets: stringArray(chart.weakPlanets ?? chart.weak_planets),
      activeHouses: numberArray(chart.activeHouses ?? chart.active_houses),
      yogas: stringArray(chart.yogas),
      careerIndicators: stringArray(chart.careerIndicators ?? chart.career_indicators),
      wealthIndicators: stringArray(chart.wealthIndicators ?? chart.wealth_indicators),
      relationshipIndicators: stringArray(chart.relationshipIndicators ?? chart.relationship_indicators),
      travelIndicators: stringArray(chart.travelIndicators ?? chart.travel_indicators),
      spiritualIndicators: stringArray(chart.spiritualIndicators ?? chart.spiritual_indicators),
      vitalityIndicators: stringArray(chart.vitalityIndicators ?? chart.vitality_indicators),
      fameIndicators: stringArray(chart.fameIndicators ?? chart.fame_indicators),
      educationIndicators: stringArray(chart.educationIndicators ?? chart.education_indicators),
      raw: chart,
    };
  }

  if (Object.keys(dasha).length > 0) {
    context.dasha = {
      currentMD: stringValue(dasha.currentMD ?? dasha.mahadasha ?? dasha.md),
      currentAD: stringValue(dasha.currentAD ?? dasha.antardasha ?? dasha.ad),
      currentPD: stringValue(dasha.currentPD ?? dasha.pratyantarDasha ?? dasha.pd),
      activePlanets: stringArray(dasha.activePlanets ?? dasha.active_planets),
      startDate: stringValue(dasha.startDate ?? dasha.start_date),
      endDate: stringValue(dasha.endDate ?? dasha.end_date),
      themes: stringArray(dasha.themes),
      raw: dasha,
    };
  }

  if (Object.keys(numerology).length > 0) {
    context.numerology = {
      lifePathNumber: numberValue(numerology.lifePathNumber ?? numerology.life_path_number ?? numerology.lifePath),
      destinyNumber: numberValue(numerology.destinyNumber ?? numerology.destiny_number),
      personalYearNumber: numberValue(numerology.personalYearNumber ?? numerology.personal_year_number),
      favorableNumbers: numberArray(numerology.favorableNumbers ?? numerology.favorable_numbers),
      themes: stringArray(numerology.themes),
      raw: numerology,
    };
  }

  return context;
}

export function getMissingFusionContext(context: AstroLifeFusionContext) {
  const missing: string[] = [];
  if (!context.chart) missing.push("kundli/chart context");
  if (!context.dasha) missing.push("dasha context");
  if (!context.numerology) missing.push("numerology context");
  return missing;
}
