import type {
  FusionAgreement,
  FusionInsight,
  FusionSignal,
  FusionTheme,
} from "./fusion-types";

export function clampFusionConfidence(value: number) {
  return Math.max(0, Math.min(0.98, Number(value.toFixed(2))));
}

export function getThemeSignals(signals: FusionSignal[], theme: FusionTheme) {
  return signals.filter((signal) => signal.theme === theme);
}

export function calculateFusionAgreement(params: {
  palmCount: number;
  astroCount: number;
  timingCount: number;
  numerologyCount: number;
  challengeCount: number;
}): FusionAgreement {
  const totalAstro = params.astroCount + params.timingCount + params.numerologyCount;

  if (params.palmCount > 0 && totalAstro === 0) return "palm_only";
  if (params.palmCount === 0 && totalAstro > 0) return "astro_only";
  if (params.challengeCount >= 2) return "contradictory";

  if (params.palmCount > 0 && params.astroCount > 0 && (params.timingCount > 0 || params.numerologyCount > 0)) {
    return "strong_alignment";
  }

  if (params.palmCount > 0 && totalAstro > 0) return "partial_alignment";

  return "mixed";
}

export function calculateThemeConfidence(params: {
  palmSignals: FusionSignal[];
  astroSignals: FusionSignal[];
  timingSignals: FusionSignal[];
  numerologySignals: FusionSignal[];
  agreement: FusionAgreement;
}) {
  const allSignals = [
    ...params.palmSignals,
    ...params.astroSignals,
    ...params.timingSignals,
    ...params.numerologySignals,
  ];

  if (allSignals.length === 0) return 0;

  const avgStrength = allSignals.reduce((sum, signal) => sum + signal.strength, 0) / allSignals.length;
  const sourceDiversity = new Set(allSignals.map((signal) => signal.source)).size * 0.06;
  const supportBoost = allSignals.filter((signal) => signal.polarity === "support").length * 0.03;
  const challengePenalty = allSignals.filter((signal) => signal.polarity === "challenge").length * 0.08;

  const agreementBoost: Record<FusionAgreement, number> = {
    strong_alignment: 0.18,
    partial_alignment: 0.1,
    mixed: 0,
    contradictory: -0.18,
    palm_only: -0.03,
    astro_only: -0.04,
  };

  const confidence = clampFusionConfidence(avgStrength + sourceDiversity + supportBoost + agreementBoost[params.agreement] - challengePenalty);
  const agreementCap: Record<FusionAgreement, number> = {
    strong_alignment: 0.98,
    partial_alignment: 0.9,
    mixed: 0.78,
    contradictory: 0.62,
    palm_only: 0.72,
    astro_only: 0.78,
  };

  return Math.min(confidence, agreementCap[params.agreement]);
}

export function sortFusionInsights(insights: FusionInsight[]) {
  return [...insights].sort((a, b) => {
    const confidenceDiff = b.confidence - a.confidence;
    if (Math.abs(confidenceDiff) > 0.001) return confidenceDiff;

    const sourceDiff =
      b.palmSignals.length + b.astroSignals.length + b.timingSignals.length + b.numerologySignals.length -
      (a.palmSignals.length + a.astroSignals.length + a.timingSignals.length + a.numerologySignals.length);

    return sourceDiff;
  });
}
