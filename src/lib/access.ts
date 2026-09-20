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
  | "family_charts"
  | "transit_ripple"
  | "marriage_timing"
  | "palmistry"
  | "transit_purchase"
  | "astro_sound";

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
  transit_ripple: ["premium", "elite"],
  marriage_timing: ["premium", "elite"],
  palmistry: ["premium", "elite"],
  transit_purchase: ["premium", "elite"],
  astro_sound: ["premium", "elite"],
};

export const ELITE_EMAILS = new Set([
  "mukulpal9@gmail.com",
  "9palmukul@gmail.com",
  "prachi269pal@gmail.com",
]);

export function isEliteEmail(email?: string | null): boolean {
  if (!email) return false;
  return ELITE_EMAILS.has(email.toLowerCase().trim());
}

export const ADMIN_EMAILS = new Set([
  "mukulpal9@gmail.com",
  "9palmukul@gmail.com",
]);

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase().trim());
}


export function normalizeTier(tier?: string | null, email?: string | null): SubscriptionTier {
  if (isFullAccessEnabled()) return "elite";
  if (email && isEliteEmail(email)) return "elite";
  return tier === "premium" || tier === "elite" ? tier : "free";
}

export function isFullAccessEnabled() {
  return process.env.NEXT_PUBLIC_FULL_ACCESS_ENABLED === "true";
}

export function isBillingEnforced() {
  if (isFullAccessEnabled()) return false;
  return process.env.NEXT_PUBLIC_BILLING_ENFORCED === "true";
}

export function canAccessFeature(feature: FeatureKey, tier?: string | null, email?: string | null) {
  if (isFullAccessEnabled()) return true;
  if (email && isEliteEmail(email)) return true;
  return FEATURE_ACCESS[feature].includes(normalizeTier(tier, email));
}

export function shouldSoftGateFeature(feature: FeatureKey, tier?: string | null, email?: string | null) {
  return !canAccessFeature(feature, tier, email) && !isBillingEnforced();
}

export function shouldBlockFeature(feature: FeatureKey, tier?: string | null, email?: string | null) {
  return !canAccessFeature(feature, tier, email) && isBillingEnforced();
}

