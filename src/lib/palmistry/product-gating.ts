import type { PalmRuleTier } from "./types";

export type PalmistryProductFeature =
  | "basic_report"
  | "full_report"
  | "pdf_export"
  | "share_report"
  | "history"
  | "fusion_report"
  | "ask_my_palm"
  | "before_after";

const FEATURE_TIERS: Record<PalmistryProductFeature, PalmRuleTier> = {
  basic_report: "free",
  full_report: "premium",
  pdf_export: "premium",
  share_report: "premium",
  history: "premium",
  fusion_report: "elite",
  ask_my_palm: "elite",
  before_after: "elite",
};

const TIER_RANK: Record<PalmRuleTier, number> = {
  free: 1,
  premium: 2,
  elite: 3,
};

export function canUsePalmistryFeature(userTier: PalmRuleTier, feature: PalmistryProductFeature) {
  return TIER_RANK[userTier] >= TIER_RANK[FEATURE_TIERS[feature]];
}

export function getPalmistryUpgradeMessage(feature: PalmistryProductFeature) {
  const tier = FEATURE_TIERS[feature];

  if (tier === "premium") return "Upgrade to Premium to unlock this palmistry feature.";
  if (tier === "elite") return "Upgrade to Elite to unlock AstroLife Fusion and advanced palmistry features.";

  return "This feature is available.";
}
