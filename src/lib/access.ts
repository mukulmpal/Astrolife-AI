export type SubscriptionTier = "free" | "premium" | "elite";

export type FeatureKey =
  | "basic_kundli"
  | "ai_chat"
  | "yogas"
  | "destiny"
  | "psychology"
  | "ashtakavarga"
  | "numerology"
  | "divisional"
  | "vastu"
  | "kundali_milan"
  | "lalkitab"
  | "shadbala"
  | "reports"
  | "family_charts";

export const PLAN_LIMITS = {
  free: {
    aiQuestionsPerMonth: 5,
    savedCharts: 1,
    familyCharts: 0,
  },
  premium: {
    aiQuestionsPerMonth: null,
    savedCharts: 5,
    familyCharts: 5,
  },
  elite: {
    aiQuestionsPerMonth: null,
    savedCharts: null,
    familyCharts: null,
  },
} as const;

export const FEATURE_ACCESS: Record<FeatureKey, SubscriptionTier[]> = {
  basic_kundli: ["free", "premium", "elite"],
  ai_chat: ["free", "premium", "elite"],
  yogas: ["free", "premium", "elite"],
  destiny: ["premium", "elite"],
  psychology: ["premium", "elite"],
  ashtakavarga: ["premium", "elite"],
  numerology: ["premium", "elite"],
  divisional: ["premium", "elite"],
  vastu: ["premium", "elite"],
  kundali_milan: ["premium", "elite"],
  lalkitab: ["premium", "elite"],
  shadbala: ["premium", "elite"],
  reports: ["premium", "elite"],
  family_charts: ["elite"],
};

export function normalizeTier(tier?: string | null): SubscriptionTier {
  if (isFullAccessEnabled()) return "elite";
  return tier === "premium" || tier === "elite" ? tier : "free";
}

export function isFullAccessEnabled() {
  return process.env.NEXT_PUBLIC_FULL_ACCESS_ENABLED === "true";
}

export function isBillingEnforced() {
  if (isFullAccessEnabled()) return false;
  return process.env.NEXT_PUBLIC_BILLING_ENFORCED === "true";
}

export function canAccessFeature(feature: FeatureKey, tier?: string | null) {
  if (isFullAccessEnabled()) return true;
  return FEATURE_ACCESS[feature].includes(normalizeTier(tier));
}

export function shouldSoftGateFeature(feature: FeatureKey, tier?: string | null) {
  return !canAccessFeature(feature, tier) && !isBillingEnforced();
}

export function shouldBlockFeature(feature: FeatureKey, tier?: string | null) {
  return !canAccessFeature(feature, tier) && isBillingEnforced();
}
