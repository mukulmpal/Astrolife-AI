import type { PalmReportStyle, PalmRuleReport } from "../types";
import type { AstroPalmFusionOutput, FusionInsight } from "../fusion/fusion-types";

export type PremiumPalmReport = {
  title: string;
  subtitle: string;
  style: PalmReportStyle;
  executiveSummary: string;
  palmSummary: string;
  fusionSummary: string;
  sections: {
    id: string;
    title: string;
    summary: string;
    confidence?: number;
    bullets: string[];
    guardrails: string[];
  }[];
  disclaimers: string[];
};

function formatConfidence(value?: number) {
  if (typeof value !== "number") return "Confidence not available";
  return `${Math.round(value * 100)}% confidence`;
}

function insightToSection(insight: FusionInsight) {
  return {
    id: insight.id,
    title: insight.title,
    summary: `${insight.summary} (${formatConfidence(insight.confidence)})`,
    confidence: insight.confidence,
    bullets: [
      ...insight.palmSignals.map((signal) => `Palm: ${signal.title}`),
      ...insight.astroSignals.map((signal) => `Kundli: ${signal.title}`),
      ...insight.timingSignals.map((signal) => `Dasha: ${signal.title}`),
      ...insight.numerologySignals.map((signal) => `Numerology: ${signal.title}`),
      ...insight.guidance,
    ].slice(0, 12),
    guardrails: insight.guardrails,
  };
}

export function buildPremiumPalmReport(params: {
  palmResult: PalmRuleReport;
  fusion: AstroPalmFusionOutput;
  style: PalmReportStyle;
}): PremiumPalmReport {
  const { palmResult, fusion, style } = params;

  return {
    title: "AstroLife AI Palmistry Fusion Report",
    subtitle: "Palmistry + Kundli + Dasha + Numerology",
    style,
    executiveSummary:
      style === "classical"
        ? "Hast sanketon, janma-kundli, dasha aur ank-laya ko milakar yah sanyukt sanket nikala gaya hai."
        : style === "scientific"
          ? "This report combines visible palm features with chart, timing and numerology signals using confidence-scored fusion."
          : "Your hand reveals the visible pattern; your chart reveals the blueprint; your dasha reveals timing; numerology reveals rhythm.",
    palmSummary: palmResult.summary,
    fusionSummary: fusion.overallSummary,
    sections: fusion.insights.map(insightToSection),
    disclaimers: [...palmResult.disclaimers, ...fusion.disclaimers],
  };
}
