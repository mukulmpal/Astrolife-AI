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
  strongestWarningReason: string;
  methodNote: string;
  sadeSatiZone: SadeSatiPurchaseZone;
  transit: TransitPurchaseGuidanceResult;
  lalKitab: LalKitabPurchaseResult[];
  avoid: Array<{ title: string; reason: string; source: "transit" | "lal_kitab" }>;
  buyCarefully: Array<{ title: string; reason: string; source: "transit" | "lal_kitab" }>;
  favourable: Array<{ title: string; reason: string; source: "transit" | "lal_kitab" }>;
  summary: string;
}

const LAL_KITAB_PLANETS: LalKitabPlanet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export interface SadeSatiPurchaseZone {
  active: boolean;
  phase: "entry" | "peak" | "exit" | "kantak" | "clear";
  severity: "low" | "medium" | "high";
  scoreImpact: number;
  title: string;
  description: string;
  purchaseCautions: string[];
  remedies: string[];
}

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

function sadeSatiPhase(title: string): SadeSatiPurchaseZone["phase"] {
  if (title.includes("Entry")) return "entry";
  if (title.includes("Exit")) return "exit";
  if (title.includes("Peak")) return "peak";
  return "peak";
}

function buildSadeSatiZone(report: TransitReport): SadeSatiPurchaseZone {
  const saturnAlert = report.alerts.find((alert) => alert.type === "sade_sati" || alert.type === "ashtama_shani");

  if (!saturnAlert) {
    return {
      active: false,
      phase: "clear",
      severity: "low",
      scoreImpact: 0,
      title: "Sade Sati Zone Clear",
      description:
        "No Sade Sati or Kantak Shani alert is active from Moon transit right now. Use normal practical purchase checks.",
      purchaseCautions: [
        "Keep normal bill, warranty, return policy and budget checks active.",
        "Do not buy old, damaged or undocumented Saturn-type objects casually.",
      ],
      remedies: [
        "Maintain steady Saturday discipline without fear-based remedies.",
        "Keep old, broken and unused items cleaned or responsibly removed.",
      ],
    };
  }

  const phase = saturnAlert.type === "ashtama_shani" ? "kantak" : sadeSatiPhase(saturnAlert.title);
  const scoreImpact = saturnAlert.severity === "high" ? -18 : saturnAlert.severity === "medium" ? -10 : -5;
  const title =
    phase === "kantak"
      ? "Kantak Shani Purchase Zone"
      : `Sade Sati ${phase.charAt(0).toUpperCase()}${phase.slice(1)} Purchase Zone`;

  return {
    active: true,
    phase,
    severity: saturnAlert.severity,
    scoreImpact,
    title,
    description:
      `${saturnAlert.description} Purchase guidance is Moon-first here because Chandra Lagna shows lived pressure, anxiety, delay and emotional load.`,
    purchaseCautions: [
      "Avoid high-value used leather, old shoes, scrap iron, heavy machinery or repair-heavy objects without full verification.",
      "Do not accept Saturn-type gifts casually: used shoes, damaged tools, broken machinery, old black items or unclear-liability objects.",
      "For property, vehicle, machinery and long-term contracts, re-check papers, warranty, hidden dues and service history.",
    ],
    remedies: [
      "Use practical Saturn remedies: discipline, patience, clean commitments and honest documentation.",
      "On Saturday, serve elderly people, workers or people carrying heavy responsibility; keep it simple and non-fear based.",
      "Donate food, black sesame or useful essentials according to capacity, without superstition or panic.",
      "Chant Om Sham Shanaishcharaya Namah 108 times on Saturday only if it feels grounding to the user.",
    ],
  };
}

export function generateCombinedTransitPurchaseGuidance(
  input: CombinedTransitPurchaseInput
): CombinedTransitPurchaseResult {
  const transit = generateTransitPurchaseGuidance(input.transitReport);
  const sadeSatiZone = buildSadeSatiZone(input.transitReport);
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
  const transitWarning = transit.strongestWarning;
  const lalKitabIsStrongWarning = topLalKitab?.verdict === "AVOID" || topLalKitab?.verdict === "GIFT_CAUTION";
  const saturnZoneIsStrongWarning = sadeSatiZone.active && sadeSatiZone.severity !== "low";
  const strongestWarning =
    lalKitabIsStrongWarning
      ? topLalKitab.title
      : saturnZoneIsStrongWarning
        ? sadeSatiZone.title
      : transitWarning?.title ?? topLalKitab?.title ?? "No strong warning";
  const strongestWarningReason =
    lalKitabIsStrongWarning
      ? topLalKitab.activeTriggers.join(" · ") || topLalKitab.explanation
      : saturnZoneIsStrongWarning
        ? sadeSatiZone.purchaseCautions[0]
      : transitWarning?.timing ?? topLalKitab?.activeTriggers.join(" · ") ?? "No urgent warning trigger.";

  const avoid = [
    ...(sadeSatiZone.active
      ? [{ title: sadeSatiZone.title, reason: sadeSatiZone.purchaseCautions[0], source: "transit" as const }]
      : []),
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
    strongestWarningReason,
    methodNote:
      "This combines Moon-first standard Gochar transit purchase timing with Lal Kitab object/gift grammar. It is not Lal Kitab 35-sala chakra, Lal Kitab varshphal, or monthly phal.",
    sadeSatiZone,
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
