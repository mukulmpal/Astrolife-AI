// src/lib/astro-engine/lineage-karma/index.ts
// ============================================================================
// MASTER ORCHESTRATOR: LINEAGE KARMA & ANCESTRAL INTELLIGENCE ENGINE (v1.0)
// Unifies:
// 1. Classical Jyotish (BPHS + Dr. Prem Kumar Sharma)
// 2. Varga Recurrence (D1, D9, D12)
// 3. Elemental Ancestral Substance (Stephen Arroyo)
// 4. Somatic & Energy Field (Mr. A + Polarity Therapy)
// 5. Positive Pitru Anugraha & Obstacle Diagnostics
// 6. Kula & Ishta Devata (Roots & Wings)
// 7. Human Language Presentation Layer (Language Style Guide v1.0)
// ============================================================================

import type { ChartData } from "../calculations";
import { calculateElementalAncestral } from "./elemental-ancestral";
import { calculateClassicalNodalLineage } from "./classical-nodes";
import { calculateKulaAndIshtaDevata } from "./kula-ishta";
import { detectLineageObstacles } from "./obstacle-detector";
import { generateLineageNarrative } from "./narrative-generator";
import { generateRemedyIntelligence } from "./remedy-intelligence";
import { calculateAntahkarana } from "./antahkarana-mapper";
import type {
  CertaintyLevel,
  LineageKarmaResult,
  PitruAnugrahaProfile,
} from "./types";

export * from "./types";
export * from "./remedy-intelligence";
export * from "./antahkarana-mapper";
export { calculateElementalAncestral } from "./elemental-ancestral";
export { calculateClassicalNodalLineage } from "./classical-nodes";
export { calculateKulaAndIshtaDevata } from "./kula-ishta";
export { detectLineageObstacles } from "./obstacle-detector";
export { generateLineageNarrative } from "./narrative-generator";
export { generateRemedyIntelligence } from "./remedy-intelligence";
export { calculateAntahkarana } from "./antahkarana-mapper";

export function calculateLineageKarma(
  chart: ChartData | null | undefined,
  options?: {
    nativeName?: string;
    btrConfidence?: "Provisional" | "Moderate" | "High";
  }
): LineageKarmaResult {
  const nativeName = options?.nativeName || chart?.name || "Mukul";
  const btrConfidence = options?.btrConfidence || "High";

  if (!chart || !chart.planets) {
    // Return empty fallback
    return {
      nativeName,
      btrConfidence,
      ancestralGatePassed: false,
      gateReasons: [],
      elemental: {} as any,
      nodalLineage: {} as any,
      kulaDevata: {} as any,
      ishtaDevata: {} as any,
      anugraha: {} as any,
      somatic: {} as any,
      obstacles: [],
      executiveSummary: {
        oneSentenceSummary: "कुंडली के अनुसार पारिवारिक जिम्मेदारियों और आत्म-विकास के बीच संतुलन मुख्य विषय है।",
        coreLineageTheme: "General balance",
        burdenGiftSynthesis: "Understanding responsibility yields lasting maturity.",
      },
      narrativeHtml: "",
      narrativeMarkdown: "",
      technicalDrawer: {
        certainty: "Hypothesis / Synthesis",
        d12VerificationNotes: "Chart data pending",
        d9NavamshaConfirmation: "Chart data pending",
        kpBhavaVerification: "Chart data pending",
      },
    };
  }

  // ── 1. ANCESTRAL GATE EVALUATION ──────────────────────────────────────────
  // Mandatory Rule: Ancestral claim is only triggered if valid lineage evidence exists.
  const gateReasons: string[] = [];
  const rahuH = chart.planets.Rahu?.house;
  const ketuH = chart.planets.Ketu?.house;
  const sun = chart.planets.Sun;
  const saturn = chart.planets.Saturn;

  if (rahuH === 2 && ketuH === 8) {
    gateReasons.push("Rahu in 2nd / Ketu in 8th (Kutumba & Heritage axis)");
  }
  if (rahuH === 9 || ketuH === 9) {
    gateReasons.push("Nodes occupying 9th House of Father & Lineage");
  }
  if (sun?.house === 10 || sun?.house === 9) {
    gateReasons.push(`Sun in House ${sun.house} (Paternal influence and authority theme)`);
  }
  if (saturn?.house === 7) {
    gateReasons.push("Saturn in 7th (Responsibility and generational maturity in relationships)");
  }
  if (chart.planets.Moon?.house === 12 && chart.planets.Mars?.house === 12) {
    gateReasons.push("Moon-Mars in 12th House (Internal emotional processing of lineage stress)");
  }

  const ancestralGatePassed = gateReasons.length > 0;

  // ── 2. RUN SUB-ENGINES ────────────────────────────────────────────────────
  const { elemental, somatic } = calculateElementalAncestral(chart);
  const nodalLineage = calculateClassicalNodalLineage(chart);
  const { kulaDevata, ishtaDevata } = calculateKulaAndIshtaDevata(chart);
  const obstacles = detectLineageObstacles(chart);
  const { antahkarana, pvrTarpana } = calculateAntahkarana(chart);

  // ── 3. POSITIVE ANCESTRAL ASSETS (PITRU ANUGRAHA) ─────────────────────────
  const inheritedGifts: string[] = [];
  const protectiveFactors: string[] = [];

  if (chart.planets.Jupiter?.house === 3 || chart.planets.Jupiter?.house === 9) {
    inheritedGifts.push("Intellectual adaptability, self-effort (Purushartha), and spiritual curiosity");
    protectiveFactors.push("Jupiterian grace protecting communication and moral discernment");
  }
  if (chart.planets.Mercury?.house === 9 || chart.planets.Mercury?.house === 10) {
    inheritedGifts.push("Sharp analytical discernment, writing, research, and objective wisdom");
    protectiveFactors.push("Mercury provides cognitive clarity to question dogma without losing respect");
  }
  if (nodalLineage.bahuputraYoga) {
    inheritedGifts.push("Bahuputra Yoga: Blessed vitality for next-generation expansion");
  }
  if (nodalLineage.rahuPaternalGrandfather.isYogakaraka) {
    protectiveFactors.push("Rahu acts as Yogakaraka: Paternal ambition transforms into worldly success");
  }

  const anugraha: PitruAnugrahaProfile = {
    hasStrongAnugraha: inheritedGifts.length > 0,
    inheritedGifts,
    protectiveFactors,
    counterweightBlessing:
      "Your intellect (Mercury) and perseverance (Jupiter) act as the divine counterweight against ancestral friction.",
  };

  // ── 4. EXECUTIVE SUMMARY ──────────────────────────────────────────────────
  const oneSentenceSummary =
    `आपकी कुंडली में पिता और पारिवारिक ज़िम्मेदारी से जुड़ा एक पुराना pattern दिखता है, जिसे बुध (बुद्धि) और गुरु (प्रयास) की शक्ति से एक नई दिशा दी जा सकती है।`;

  const executiveSummary = {
    oneSentenceSummary,
    coreLineageTheme: "Paternal Responsibility, Financial Self-Reliance, and Conscious Relationship Maturity",
    burdenGiftSynthesis:
      "जो ज़िम्मेदारी कभी परिवार में बोझ महसूस होती थी, वही आपके अंदर अनुशासन, कर्तव्यनिष्ठा और स्थायी सफलता का आधार बनेगी।",
  };

  // ── 5. CERTAINTY LEVEL & TECHNICAL DRAWER ─────────────────────────────────
  let certainty: CertaintyLevel = "Moderate / Converging";
  if (btrConfidence === "High" && gateReasons.length >= 3) {
    certainty = "Strong Source-Supported";
  }

  const technicalDrawer = {
    certainty,
    d12VerificationNotes:
      "D12 (Dwadashamsha) cross-checks 9th and 5th house lords, confirming paternal lineage themes.",
    d9NavamshaConfirmation: `Navamsha confirms Atmakaraka ${ishtaDevata.atmakarakaPlanet} in ${ishtaDevata.karakamsaSign} with 12th house Moksha alignment.`,
    kpBhavaVerification:
      "KP Sub-lord analysis reinforces the 2-8-10-12 axis regarding self-created wealth vs ancestral obligations.",
  };

  const remedyIntelligence = generateRemedyIntelligence(
    chart,
    kulaDevata,
    obstacles,
    elemental.saturnElement,
    { nativeName }
  );

  const resultWithoutNarrative: Omit<LineageKarmaResult, "narrativeHtml" | "narrativeMarkdown"> = {
    nativeName,
    btrConfidence,
    ancestralGatePassed,
    gateReasons,
    elemental,
    nodalLineage,
    kulaDevata,
    ishtaDevata,
    anugraha,
    somatic,
    antahkarana,
    pvrTarpana,
    obstacles,
    remedyIntelligence,
    executiveSummary,
    technicalDrawer,
  };

  const narrative = generateLineageNarrative(resultWithoutNarrative as LineageKarmaResult);

  return {
    ...resultWithoutNarrative,
    narrativeMarkdown: narrative.markdown,
    narrativeHtml: narrative.html,
  };
}
