"use client";

import { PLAN_LIMITS, isBillingEnforced } from "@/lib/access";
import { createClient } from "@/lib/supabase/client";

const FREE_MONTHLY_AI_LIMIT = PLAN_LIMITS.free.aiQuestionsPerMonth;
const AI_USAGE_KEY_PREFIX = "astrolife_ai_usage_";

export type AiUsageStatus = {
  enforcementEnabled: boolean;
  isBlocked: boolean;
  isUnlimited: boolean;
  limit: number;
  used: number;
  left: number;
};

function getUsageKey(date = new Date()) {
  return `${AI_USAGE_KEY_PREFIX}${getUsagePeriodKey(date)}`;
}

export function getUsagePeriodKey(date = new Date()) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function getFreeMonthlyAiLimit() {
  return FREE_MONTHLY_AI_LIMIT;
}

export function getMonthlyAiUsage() {
  if (typeof window === "undefined") return 0;
  const stored = window.localStorage.getItem(getUsageKey());
  const used = Number.parseInt(stored ?? "0", 10);
  return Number.isNaN(used) ? 0 : used;
}

export function incrementMonthlyAiUsage() {
  if (typeof window === "undefined") return 0;
  const next = getMonthlyAiUsage() + 1;
  window.localStorage.setItem(getUsageKey(), String(next));
  return next;
}

export async function getAccountMonthlyAiUsage() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return getMonthlyAiUsage();

    const periodKey = getUsagePeriodKey();
    const { data, error } = await supabase
      .from("usage_limits")
      .select("ai_questions_used")
      .eq("user_id", user.id)
      .eq("period_key", periodKey)
      .maybeSingle();

    if (error) return getMonthlyAiUsage();
    const used = typeof data?.ai_questions_used === "number" ? data.ai_questions_used : 0;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getUsageKey(), String(used));
    }
    return used;
  } catch (error) {
    console.warn("Account usage load skipped:", error);
    return getMonthlyAiUsage();
  }
}

export async function incrementAccountMonthlyAiUsage() {
  const localUsed = incrementMonthlyAiUsage();

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return localUsed;

    const periodKey = getUsagePeriodKey();
    const { data: existing } = await supabase
      .from("usage_limits")
      .select("id,ai_questions_used")
      .eq("user_id", user.id)
      .eq("period_key", periodKey)
      .maybeSingle();

    const next = (typeof existing?.ai_questions_used === "number" ? existing.ai_questions_used : 0) + 1;

    if (existing?.id) {
      await supabase
        .from("usage_limits")
        .update({ ai_questions_used: next, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("usage_limits")
        .insert({ user_id: user.id, period_key: periodKey, ai_questions_used: next });
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(getUsageKey(), String(next));
    }
    return next;
  } catch (error) {
    console.warn("Account usage persistence skipped:", error);
    return localUsed;
  }
}

export function getAiQuestionsLeft(subscriptionTier?: string | null) {
  if (subscriptionTier && subscriptionTier !== "free") return "Unlimited";
  return String(Math.max(FREE_MONTHLY_AI_LIMIT - getMonthlyAiUsage(), 0));
}

export function getAiUsageStatus(subscriptionTier?: string | null): AiUsageStatus {
  if (subscriptionTier && subscriptionTier !== "free") {
    return {
      enforcementEnabled: isBillingEnforced(),
      isBlocked: false,
      isUnlimited: true,
      limit: FREE_MONTHLY_AI_LIMIT,
      used: 0,
      left: FREE_MONTHLY_AI_LIMIT,
    };
  }

  const used = getMonthlyAiUsage();
  const left = Math.max(FREE_MONTHLY_AI_LIMIT - used, 0);
  const enforcementEnabled = isBillingEnforced();

  return {
    enforcementEnabled,
    isBlocked: enforcementEnabled && left === 0,
    isUnlimited: false,
    limit: FREE_MONTHLY_AI_LIMIT,
    used,
    left,
  };
}

export async function getAccountAiUsageStatus(subscriptionTier?: string | null): Promise<AiUsageStatus> {
  if (subscriptionTier && subscriptionTier !== "free") {
    return getAiUsageStatus(subscriptionTier);
  }

  const used = await getAccountMonthlyAiUsage();
  const left = Math.max(FREE_MONTHLY_AI_LIMIT - used, 0);
  const enforcementEnabled = isBillingEnforced();

  return {
    enforcementEnabled,
    isBlocked: enforcementEnabled && left === 0,
    isUnlimited: false,
    limit: FREE_MONTHLY_AI_LIMIT,
    used,
    left,
  };
}
