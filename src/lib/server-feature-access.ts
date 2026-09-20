import { FEATURE_ACCESS, isBillingEnforced, isEliteEmail, isFullAccessEnabled, normalizeTier, type FeatureKey, type SubscriptionTier } from "@/lib/access";
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

    const isElite = (user.email && isEliteEmail(user.email)) ||
      user.app_metadata?.subscription_tier === "elite" ||
      user.user_metadata?.subscription_tier === "elite";

    if (isElite) {
      return {
        allowed: true,
        authenticated: true,
        enforced,
        feature,
        tier: "elite",
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

    let tier = normalizeTier(profile?.subscription_tier, user.email);

    if (!profile) {
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "AstroLife User",
          subscription_tier: "free",
        }, { onConflict: "id" });
      tier = "free";
    }

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
  const label = access.feature === "basic_kundli" ? "report" : "premium engine";
  return {
    success: false,
    error: access.reason === "login_required"
      ? `Login required to use this ${label}.`
      : `Upgrade required to use this ${label}.`,
    access,
  };
}
