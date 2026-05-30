import type { PalmImageQuality, PalmRule, PalmRuleHit, PalmRuleRiskLevel } from "./types";

function normalizeBase(base: number) {
  return base > 1 ? base / 100 : base;
}

export function calculateAdvancedPalmConfidence(params: {
  base: number;
  imageQualityScore: number;
  supportingCount: number;
  contradictionCount: number;
  userConfirmed: boolean;
  sourceStrength: number;
  riskLevel: PalmRuleRiskLevel;
}) {
  const supportBoost = Math.min(params.supportingCount * 0.06, 0.24);
  const contradictionPenalty = Math.min(params.contradictionCount * 0.12, 0.36);
  const userBoost = params.userConfirmed ? 0.08 : 0;
  const sourceBoost = Math.min(params.sourceStrength, 1) * 0.08;
  const imageFactor = params.imageQualityScore * 0.18;
  const riskPenalty = params.riskLevel === "medical_guarded" ? 0.12 : params.riskLevel === "sensitive" ? 0.08 : 0;

  return Math.max(0, Math.min(1, normalizeBase(params.base) + supportBoost + userBoost + sourceBoost + imageFactor - contradictionPenalty - riskPenalty));
}

export function scoreRuleConfidence(rule: PalmRule, imageQuality: PalmImageQuality, matchedSupport: number, contradicted: number, userConfirmed = true): number {
  const issuePenalty = Math.min(0.15, imageQuality.issues.length * 0.03);
  const confidence = calculateAdvancedPalmConfidence({
    base: rule.confidenceBase,
    imageQualityScore: Math.max(0, imageQuality.score - issuePenalty),
    supportingCount: matchedSupport,
    contradictionCount: contradicted,
    userConfirmed,
    sourceStrength: Math.min(rule.sourceIds.length / 3, 1),
    riskLevel: rule.riskLevel,
  });
  return Math.max(20, Math.min(98, Math.round(confidence * 100)));
}

export function averageConfidence(hits: PalmRuleHit[]) {
  if (hits.length === 0) return 0;
  return Math.round(hits.reduce((sum, hit) => sum + hit.confidence, 0) / hits.length);
}
