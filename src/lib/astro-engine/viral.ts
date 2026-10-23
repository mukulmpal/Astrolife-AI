import type { ChartData } from "./calculations";

export interface RoastResult {
  title: string;
  hook: string;
  roasts: string[];
  strengths: string[];
  shareText: string;
  shareHashtags: string[];
}

export interface CoupleAnalysis {
  compatibility: number;
  vibe: string;
  positives: string[];
  challenges: string[];
  verdict: string;
  shareText: string;
  shareHashtags: string[];
}

export interface FamilyCurseAnalysis {
  curseTitle: string;
  pattern: string;
  generations: string[];
  rootCause: string;
  remedies: string[];
  shareText: string;
  shareHashtags: string[];
}

export function generateRoastPrompt(chart: ChartData): string {
  const sunSign = chart.planets.Sun?.sign || "Unknown";
  const moonSign = chart.planets.Moon?.sign || "Unknown";
  const lagnaSign = chart.lagnaRashi || "Unknown";
  const weakPlanets = Object.entries(chart.planets)
    .filter(([, p]) => p.dignity?.includes("Debilitated"))
    .map(([name]) => name);

  return `You are an entertaining Vedic astrology roast comedian. Generate a hilarious but accurate roast for someone with this chart:
- Lagna: ${lagnaSign}
- Sun: ${sunSign} (core self)
- Moon: ${moonSign} (emotions)
- Weak planets: ${weakPlanets.join(", ") || "none (lucky them)"}

Roast rules:
1. Be funny and entertaining, not mean-spirited
2. Reference actual astrology (houses, planets, dignity)
3. Mix real astrological insights with humor
4. Mention one funny contradiction in their chart
5. Highlight 2-3 actual strengths they probably don't realize

Return JSON: { roastHook: "opening line", roasts: ["roast1", "roast2", "roast3"], strengths: ["strength1", "strength2"] }`;
}

export function generateCouplePrompt(chart1: ChartData, chart2: ChartData): string {
  return `You are a cosmic relationship analyst. Analyze compatibility between these two charts:

Chart 1: Lagna ${chart1.lagnaRashi}, Moon ${chart1.planets.Moon?.sign}, Venus placement ${chart1.planets.Venus?.sign} H${chart1.planets.Venus?.house}
Chart 2: Lagna ${chart2.lagnaRashi}, Moon ${chart2.planets.Moon?.sign}, Venus placement ${chart2.planets.Venus?.sign} H${chart2.planets.Venus?.house}

Analyze:
1. Guna Milan (natural compatibility)
2. Moon compatibility
3. Venus (love/desire) alignment
4. Challenging aspects
5. Overall karmic purpose

Return JSON: {
  compatibilityScore: 0-100,
  vibe: "relationship archetype",
  positives: ["positive1", "positive2"],
  challenges: ["challenge1", "challenge2"],
  verdict: "one sentence prediction"
}`;
}

export function generateFamilyCursePrompt(chart: ChartData): string {
  return `You are a Vedic family karma analyst. Look at this chart and identify recurring family patterns:

Chart: Lagna ${chart.lagnaRashi}, Saturn ${chart.planets.Saturn?.sign} H${chart.planets.Saturn?.house}, Moon ${chart.planets.Moon?.sign} H${chart.planets.Moon?.house}

Look for generational curses:
1. 4th/10th house afflictions (family karma)
2. Saturn/Rahu involvement (karmic debts)
3. Repetitive planetary patterns
4. Moon's emotional legacy

Return JSON: {
  curseTitle: "one sentence curse name",
  pattern: "the repeating pattern across generations",
  generations: ["grandmother pattern", "parent pattern", "your pattern"],
  rootCause: "astrological cause",
  remedies: ["remedy1", "remedy2"]
}`;
}

export function calculateRoastMetrics(chart: ChartData): {
  dramaScore: number;
  luckScore: number;
  personalityClash: number;
} {
  const debilitatedCount = Object.values(chart.planets).filter((p) =>
    p.dignity?.includes("Debilitated")
  ).length;
  const exaltedCount = Object.values(chart.planets).filter((p) =>
    p.dignity?.includes("Exalted")
  ).length;
  const afflictedHouses = [6, 8, 12].filter((h) =>
    Object.values(chart.planets).some((p) => p.house === h)
  ).length;

  return {
    dramaScore: Math.min(100, debilitatedCount * 15 + afflictedHouses * 20),
    luckScore: Math.min(100, exaltedCount * 25),
    personalityClash: Math.abs(exaltedCount - debilitatedCount) * 10,
  };
}

export function calculateCoupleCompatibility(chart1: ChartData, chart2: ChartData): number {
  const moon1 = chart1.planets.Moon?.sign;
  const moon2 = chart2.planets.Moon?.sign;
  const venus1 = chart1.planets.Venus?.sign;
  const venus2 = chart2.planets.Venus?.sign;

  let score = 50;

  // Moon sign compatibility (28% of guna milan)
  if (moon1 && moon2) {
    const moonDiff = Math.abs(
      ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].indexOf(moon1) -
      ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].indexOf(moon2)
    );
    if (moonDiff <= 2 || moonDiff >= 10) score += 12;
    else if (moonDiff <= 5) score += 6;
  }

  // Venus sign compatibility (attraction)
  if (venus1 && venus2) {
    const venusDiff = Math.abs(
      ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].indexOf(venus1) -
      ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].indexOf(venus2)
    );
    if (venusDiff <= 2 || venusDiff >= 10) score += 15;
    else if (venusDiff <= 5) score += 10;
  }

  // Complementary strong planets
  const strong1 = Object.values(chart1.planets).filter((p) => p.dignity?.includes("Exalted")).length;
  const strong2 = Object.values(chart2.planets).filter((p) => p.dignity?.includes("Exalted")).length;
  if (strong1 > 0 && strong2 > 0) score += 8;

  return Math.min(100, score);
}

export function identifyFamilyPattern(chart: ChartData): { pattern: string; severity: "mild" | "moderate" | "intense" } {
  const saturn = chart.planets.Saturn;
  const rahu = chart.planets.Rahu;
  const moon = chart.planets.Moon;
  const sun = chart.planets.Sun;

  if (saturn && [4, 10].includes(saturn.house)) {
    return { pattern: "Ancestral Weight", severity: "moderate" };
  }

  if (rahu && rahu.house === 1) {
    return { pattern: "Identity Fog", severity: "moderate" };
  }

  if (moon && moon.house === 8) {
    return { pattern: "Emotional Undertow", severity: "intense" };
  }

  if (sun && saturn && sun.house === 10 && saturn.house === 10) {
    return { pattern: "Authority Conflict", severity: "intense" };
  }

  return { pattern: "Standard Life Lessons", severity: "mild" };
}
