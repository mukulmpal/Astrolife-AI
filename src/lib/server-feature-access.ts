import { FEATURE_ACCESS, isBillingEnforced, isFullAccessEnabled, normalizeTier, type FeatureKey, type SubscriptionTier } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export type ServerFeatureAccess = {
  allowed: boolean;
  authenticated: boolean;
  enforced: boolean;
  feature: FeatureKey;
  tier: SubscriptionTier;
  reason?: "temporary_full_access" | "testing_mode" | "login_required" | "upgrade_required" | "profile_unavailable";
};

export async function getServerFeatureAccess(feature: FeatureKey): Promise<ServerFeatureAccess> {
  const enforced = isBillingEnforced();

  if (isFullAccessEnabled()) {
    return {
      allowed: true,
      authenticated: true,
      enforced: false,
      feature,
      tier: "elite",
      reason: "temporary_full_access",
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        allowed: !enforced,
        authenticated: false,
        enforced,
        feature,
        tier: "free",
        reason: enforced ? "login_required" : "testing_mode",
      };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return {
        allowed: !enforced,
        authenticated: true,
        enforced,
        feature,
        tier: "free",
        reason: enforced ? "profile_unavailable" : "testing_mode",
      };
    }

    const tier = normalizeTier(profile?.subscription_tier);
    const allowedByPlan = FEATURE_ACCESS[feature].includes(tier);

    return {
      allowed: allowedByPlan || !enforced,
      authenticated: true,
      enforced,
      feature,
      tier,
      reason: allowedByPlan ? undefined : enforced ? "upgrade_required" : "testing_mode",
    };
  } catch {
    return {
      allowed: !enforced,
      authenticated: false,
      enforced,
      feature,
      tier: "free",
      reason: enforced ? "login_required" : "testing_mode",
    };
  }
}

export function premiumBlockedResponse(access: ServerFeatureAccess) {
  return {
    success: false,
    error: access.reason === "login_required"
      ? "Login required to use this premium engine."
      : "Upgrade required to use this premium engine.",
    access,
  };
}
