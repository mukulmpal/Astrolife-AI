import type { PalmImageQuality, PalmRule, PalmRuleHit } from "./types";

export function scoreRuleConfidence(rule: PalmRule, imageQuality: PalmImageQuality, matchedSupport: number, contradicted: number): number {
  const supportBoost = Math.min(16, matchedSupport * 4);
  const contradictionPenalty = contradicted * 12;
  const qualityPenalty = imageQuality.canAnalyze ? Math.round((1 - imageQuality.score) * 25) : 40;
  const issuePenalty = Math.min(15, imageQuality.issues.length * 3);
  return Math.max(20, Math.min(98, Math.round(rule.confidenceBase + supportBoost - contradictionPenalty - qualityPenalty - issuePenalty)));
}

export function averageConfidence(hits: PalmRuleHit[]) {
  if (hits.length === 0) return 0;
  return Math.round(hits.reduce((sum, hit) => sum + hit.confidence, 0) / hits.length);
}
