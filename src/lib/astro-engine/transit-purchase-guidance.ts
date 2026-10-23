import type { PlanetName, TransitPlanetResult, TransitReport } from "./transits";

export type PurchaseVerdict = "BUY" | "BUY_CAREFULLY" | "WAIT" | "AVOID";

export interface TransitPurchaseWindow {
  id: string;
  title: string;
  category: "electronics" | "vehicle_property" | "luxury" | "gold_education" | "tools_machinery" | "general";
  planets: PlanetName[];
  verdict: PurchaseVerdict;
  score: number;
  timing: string;
  guidance: string;
  checks: string[];
}

export interface TransitPurchaseGuidanceResult {
  overall: PurchaseVerdict;
  strongestWindow?: TransitPurchaseWindow;
  strongestWarning?: TransitPurchaseWindow;
  windows: TransitPurchaseWindow[];
  summary: string;
}

const CATEGORY_RULES: Array<{
  category: TransitPurchaseWindow["category"];
  title: string;
  planets: PlanetName[];
  checks: string[];
  guidance: string;
}> = [
  {
    category: "electronics",
    title: "Electronics, Documents & Business Tools",
    planets: ["Mercury", "Rahu"],
    checks: ["Verify bill, warranty and return policy.", "Avoid unclear second-hand devices.", "Check documents twice before payment."],
    guidance: "Mercury should be clear for gadgets, documents, software and business tools. Rahu pressure increases hidden-defect risk.",
  },
  {
    category: "vehicle_property",
    title: "Vehicle, Land & Property",
    planets: ["Mars", "Venus", "Saturn"],
    checks: ["Inspect vehicle/property physically.", "Check ownership documents and liabilities.", "Avoid ego-based urgent purchase."],
    guidance: "Mars drives vehicles and land; Venus shows comfort; Saturn shows long-term burden, repair and paperwork.",
  },
  {
    category: "luxury",
    title: "Luxury, Jewellery, Beauty & Decor",
    planets: ["Venus", "Jupiter"],
    checks: ["Stay within budget.", "Use certified seller for jewellery.", "Avoid relationship-pressure purchases."],
    guidance: "Venus supports beauty and comfort when clean; Jupiter protects value and wisdom in spending.",
  },
  {
    category: "gold_education",
    title: "Gold, Education & Spiritual Items",
    planets: ["Jupiter", "Sun"],
    checks: ["Check purity/certification.", "Spend for real learning, not status.", "Avoid blind gemstone purchase."],
    guidance: "Jupiter favours gold, education and spiritual items when it is supportive and not pressured by difficult houses.",
  },
  {
    category: "tools_machinery",
    title: "Tools, Machinery & Heavy Items",
    planets: ["Mars", "Saturn"],
    checks: ["Avoid repair-heavy deals.", "Check service history.", "Do not buy only because it is cheap."],
    guidance: "Mars gives force and tools; Saturn gives machinery, iron, oldness and responsibility.",
  },
];

function planetScore(planets: TransitPlanetResult[], planet: PlanetName) {
  return planets.find((p) => p.planet === planet)?.score ?? 50;
}

function planetHouse(planets: TransitPlanetResult[], planet: PlanetName) {
  return planets.find((p) => p.planet === planet)?.houseFromBase;
}

function verdictFromScore(score: number, difficultHouseCount: number): PurchaseVerdict {
  if (score < 35 || difficultHouseCount >= 2) return "AVOID";
  if (score < 48 || difficultHouseCount === 1) return "WAIT";
  if (score < 65) return "BUY_CAREFULLY";
  return "BUY";
}

function timingText(verdict: PurchaseVerdict) {
  if (verdict === "BUY") return "Favourable window: proceed with normal practical checks.";
  if (verdict === "BUY_CAREFULLY") return "Mixed window: buy only after documents, warranty and budget checks.";
  if (verdict === "WAIT") return "Wait window: delay non-urgent purchases if possible.";
  return "Avoid window: skip risky, used, unclear or high-value purchases.";
}

export function generateTransitPurchaseGuidance(report: TransitReport): TransitPurchaseGuidanceResult {
  const windows = CATEGORY_RULES.map((rule) => {
    const relevant = rule.planets.map((planet) => planetScore(report.planets, planet));
    const avg = Math.round(relevant.reduce((sum, score) => sum + score, 0) / relevant.length);
    const difficultHouseCount = rule.planets.filter((planet) => {
      const house = planetHouse(report.planets, planet);
      return house ? [6, 8, 12].includes(house) : false;
    }).length;
    const verdict = verdictFromScore(avg, difficultHouseCount);

    return {
      id: `transit-${rule.category}`,
      title: rule.title,
      category: rule.category,
      planets: rule.planets,
      verdict,
      score: Math.max(5, Math.min(95, avg - difficultHouseCount * 7)),
      timing: timingText(verdict),
      guidance: rule.guidance,
      checks: rule.checks,
    };
  }).sort((a, b) => a.score - b.score);

  const strongestWarning = windows.find((window) => window.verdict === "AVOID" || window.verdict === "WAIT");
  const strongestWindow = [...windows].reverse().find((window) => window.verdict === "BUY" || window.verdict === "BUY_CAREFULLY");
  const avoidCount = windows.filter((window) => window.verdict === "AVOID").length;
  const waitCount = windows.filter((window) => window.verdict === "WAIT").length;
  const overall: PurchaseVerdict = avoidCount > 0 ? "AVOID" : waitCount > 0 ? "WAIT" : strongestWindow?.verdict ?? "BUY_CAREFULLY";

  return {
    overall,
    strongestWindow,
    strongestWarning,
    windows,
    summary:
      overall === "AVOID"
        ? "High caution: transit pressure is active. Avoid risky or unclear purchases."
        : overall === "WAIT"
          ? "Moderate caution: delay non-essential purchases and verify documents."
          : "Purchase window is workable when practical checks are completed.",
  };
}
