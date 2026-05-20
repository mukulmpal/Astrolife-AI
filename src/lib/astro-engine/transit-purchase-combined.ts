import {
  getLalKitabPurchaseGuidance,
  type LalKitabPlanet,
  type LalKitabPurchaseInput,
  type LalKitabPurchaseResult,
} from "@/lib/lal-kitab";
import {
  generateTransitPurchaseGuidance,
  type PurchaseVerdict,
  type TransitPurchaseGuidanceResult,
} from "./transit-purchase-guidance";
import type { PlanetName, TransitReport } from "./transits";

export interface CombinedTransitPurchaseInput {
  transitReport: TransitReport;
  lalKitab?: Omit<LalKitabPurchaseInput, "transitHouses"> & {
    transitHouses?: LalKitabPurchaseInput["transitHouses"];
  };
}

export interface CombinedTransitPurchaseResult {
  overall: PurchaseVerdict;
  strongestWarning: string;
  methodNote: string;
  transit: TransitPurchaseGuidanceResult;
  lalKitab: LalKitabPurchaseResult[];
  avoid: Array<{ title: string; reason: string; source: "transit" | "lal_kitab" }>;
  buyCarefully: Array<{ title: string; reason: string; source: "transit" | "lal_kitab" }>;
  favourable: Array<{ title: string; reason: string; source: "transit" | "lal_kitab" }>;
  summary: string;
}

const LAL_KITAB_PLANETS: LalKitabPlanet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

function toLalKitabPlanet(planet: PlanetName): LalKitabPlanet | null {
  return LAL_KITAB_PLANETS.includes(planet as LalKitabPlanet) ? planet as LalKitabPlanet : null;
}

function transitHouses(report: TransitReport): LalKitabPurchaseInput["transitHouses"] {
  return report.planets.reduce((acc, planet) => {
    const key = toLalKitabPlanet(planet.planet);
    if (!key) return acc;
    acc[key] = [...(acc[key] ?? []), planet.houseFromBase];
    return acc;
  }, {} as NonNullable<LalKitabPurchaseInput["transitHouses"]>);
}

function mergeOverall(transit: PurchaseVerdict, lalKitab: LalKitabPurchaseResult[]): PurchaseVerdict {
  if (lalKitab.some((item) => item.verdict === "AVOID") || transit === "AVOID") return "AVOID";
  if (transit === "WAIT") return "WAIT";
  if (lalKitab.some((item) => item.verdict === "GIFT_CAUTION" || item.verdict === "CAUTION")) return "BUY_CAREFULLY";
  return transit;
}

export function generateCombinedTransitPurchaseGuidance(
  input: CombinedTransitPurchaseInput
): CombinedTransitPurchaseResult {
  const transit = generateTransitPurchaseGuidance(input.transitReport);
  const lalKitabInput: LalKitabPurchaseInput = {
    ...(input.lalKitab ?? {}),
    transitHouses: {
      ...transitHouses(input.transitReport),
      ...(input.lalKitab?.transitHouses ?? {}),
    },
  };
  const lalKitab = getLalKitabPurchaseGuidance(lalKitabInput);
  const overall = mergeOverall(transit.overall, lalKitab);
  const topLalKitab = lalKitab[0];
  const strongestWarning =
    topLalKitab?.verdict === "AVOID" || topLalKitab?.verdict === "GIFT_CAUTION"
      ? topLalKitab.title
      : transit.strongestWarning?.title ?? topLalKitab?.title ?? "No strong warning";

  const avoid = [
    ...transit.windows
      .filter((window) => window.verdict === "AVOID" || window.verdict === "WAIT")
      .map((window) => ({ title: window.title, reason: window.timing, source: "transit" as const })),
    ...lalKitab
      .filter((item) => item.verdict === "AVOID")
      .map((item) => ({ title: item.title, reason: item.purchaseCaution[0] ?? item.explanation, source: "lal_kitab" as const })),
  ];

  const buyCarefully = [
    ...transit.windows
      .filter((window) => window.verdict === "BUY_CAREFULLY")
      .map((window) => ({ title: window.title, reason: window.timing, source: "transit" as const })),
    ...lalKitab
      .filter((item) => item.verdict === "CAUTION" || item.verdict === "GIFT_CAUTION")
      .map((item) => ({ title: item.title, reason: item.giftCaution[0] ?? item.purchaseCaution[0] ?? item.explanation, source: "lal_kitab" as const })),
  ];

  const favourable = [
    ...transit.windows
      .filter((window) => window.verdict === "BUY")
      .map((window) => ({ title: window.title, reason: window.timing, source: "transit" as const })),
    ...lalKitab
      .filter((item) => item.verdict === "SAFE")
      .map((item) => ({ title: item.title, reason: item.favourableWhen[0] ?? item.explanation, source: "lal_kitab" as const })),
  ];

    return {
    overall,
    strongestWarning,
    methodNote:
      "This combines standard Gochar transit purchase timing with Lal Kitab object/gift grammar. It is not Lal Kitab 35-sala chakra, Lal Kitab varshphal, or monthly phal.",
    transit,
    lalKitab,
    avoid,
    buyCarefully,
    favourable,
    summary:
      overall === "AVOID"
        ? "Overall: AVOID. Gochar timing and Lal Kitab object signals show strong caution."
        : overall === "WAIT"
          ? "Overall: WAIT. Delay non-essential purchases and re-check documents."
          : overall === "BUY_CAREFULLY"
            ? "Overall: BUY CAREFULLY. Buy only after practical checks and object-specific caution."
            : "Overall: BUY. Current signals are workable for sensible purchases.",
  };
}
