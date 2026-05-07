import { isBillingEnforced, isFullAccessEnabled, PLAN_LIMITS } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

type ServerUsageState = {
  allowed: boolean;
  authenticated: boolean;
  dbAvailable: boolean;
  enforced: boolean;
  tier: string;
  used: number;
  left: number | null;
  limit: number | null;
  reason?: string;
};

function getUsagePeriodKey(date = new Date()) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

function isPaidTier(tier?: string | null) {
  return tier === "premium" || tier === "elite";
}

export async function getServerAiUsageState(): Promise<ServerUsageState> {
  const enforced = isBillingEnforced();
  const limit = PLAN_LIMITS.free.aiQuestionsPerMonth;

  if (isFullAccessEnabled()) {
    return {
      allowed: true,
      authenticated: true,
      dbAvailable: false,
      enforced: false,
      tier: "elite",
      used: 0,
      left: null,
      limit: null,
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
        dbAvailable: false,
        enforced,
        tier: "free",
        used: 0,
        left: limit,
        limit,
        reason: enforced ? "login_required" : "anonymous_testing",
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .maybeSingle();

    const tier = typeof profile?.subscription_tier === "string" ? profile.subscription_tier : "free";
    if (isPaidTier(tier)) {
      return {
        allowed: true,
        authenticated: true,
        dbAvailable: true,
        enforced,
        tier,
        used: 0,
        left: null,
        limit: null,
      };
    }

    const { data, error } = await supabase
      .from("usage_limits")
      .select("ai_questions_used")
      .eq("user_id", user.id)
      .eq("period_key", getUsagePeriodKey())
      .maybeSingle();

    if (error) {
      return {
        allowed: !enforced,
        authenticated: true,
        dbAvailable: false,
        enforced,
        tier,
        used: 0,
        left: limit,
        limit,
        reason: "usage_table_unavailable",
      };
    }

    const used = typeof data?.ai_questions_used === "number" ? data.ai_questions_used : 0;
    const left = Math.max(limit - used, 0);

    return {
      allowed: !enforced || left > 0,
      authenticated: true,
      dbAvailable: true,
      enforced,
      tier,
      used,
      left,
      limit,
      reason: enforced && left <= 0 ? "free_limit_reached" : undefined,
    };
  } catch (error) {
    console.warn("Server usage check skipped:", error);
    return {
      allowed: !enforced,
      authenticated: false,
      dbAvailable: false,
      enforced,
      tier: "free",
      used: 0,
      left: limit,
      limit,
      reason: "usage_check_failed",
    };
  }
}

export async function incrementServerAiUsage(state: ServerUsageState): Promise<ServerUsageState & { trackedOnServer: boolean }> {
  if (!state.authenticated || !state.dbAvailable || isPaidTier(state.tier)) {
    return { ...state, trackedOnServer: false };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ...state, trackedOnServer: false };

    const periodKey = getUsagePeriodKey();
    const { data: existing } = await supabase
      .from("usage_limits")
      .select("id,ai_questions_used")
      .eq("user_id", user.id)
      .eq("period_key", periodKey)
      .maybeSingle();

    const nextUsed = (typeof existing?.ai_questions_used === "number" ? existing.ai_questions_used : 0) + 1;

    if (existing?.id) {
      await supabase
        .from("usage_limits")
        .update({ ai_questions_used: nextUsed, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("usage_limits")
        .insert({ user_id: user.id, period_key: periodKey, ai_questions_used: nextUsed });
    }

    const left = state.limit === null ? null : Math.max(state.limit - nextUsed, 0);

    return {
      ...state,
      used: nextUsed,
      left,
      trackedOnServer: true,
    };
  } catch (error) {
    console.warn("Server usage increment skipped:", error);
    return { ...state, trackedOnServer: false };
  }
}
