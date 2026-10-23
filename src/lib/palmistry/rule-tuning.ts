import "server-only";

import { createClient } from "@supabase/supabase-js";
import { RAW_PALMISTRY_RULES } from "./rules";
import {
  getPalmistryEngineAnalytics,
  type PalmistryRuleAccuracy,
} from "./admin-analytics";
import type { PalmRule } from "./types";

export type PalmistryRuleTuningAction =
  | "increase_confidence"
  | "decrease_confidence"
  | "increase_priority"
  | "decrease_priority"
  | "review_rule"
  | "no_change";

export type PalmistryRuleTuningSuggestion = {
  ruleId: string;
  title: string;
  category: string;
  recommendation: PalmistryRuleAccuracy["recommendation"];
  action: PalmistryRuleTuningAction;
  currentConfidenceBase: number;
  suggestedConfidenceBase: number;
  currentReportPriority: number;
  suggestedReportPriority: number;
  deltaConfidence: number;
  deltaPriority: number;
  sampleSize: number;
  accuracyScore: number;
  avgRating: number;
  avgConfidence: number;
  reason: string;
  overrideSnippet: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase credentials missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function round(value: number) {
  return Number(value.toFixed(2));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function confidenceRatio(value: number) {
  return value > 1 ? value / 100 : value;
}

function getRuleMap() {
  return new Map(RAW_PALMISTRY_RULES.map((rule) => [rule.id, rule]));
}

function getConfidenceDelta(metric: PalmistryRuleAccuracy) {
  if (metric.totalFeedback < 2) return 0;

  if (metric.recommendation === "promote") {
    if (metric.accuracyScore >= 0.9 && metric.avgRating >= 4.5) return 0.06;
    return 0.04;
  }

  if (metric.recommendation === "reduce_confidence") {
    if (metric.accuracyScore < 0.35 || metric.avgRating <= 2) return -0.12;
    return -0.08;
  }

  if (metric.recommendation === "review") {
    return -0.04;
  }

  return 0;
}

function getPriorityDelta(metric: PalmistryRuleAccuracy) {
  if (metric.totalFeedback < 2) return 0;

  if (metric.recommendation === "promote") return 6;
  if (metric.recommendation === "reduce_confidence") return -10;
  if (metric.recommendation === "review") return -4;

  return 0;
}

function getAction(metric: PalmistryRuleAccuracy): PalmistryRuleTuningAction {
  if (metric.totalFeedback < 2) return "no_change";

  if (metric.recommendation === "promote") {
    return "increase_confidence";
  }

  if (metric.recommendation === "reduce_confidence") {
    return "decrease_confidence";
  }

  if (metric.recommendation === "review") {
    return "review_rule";
  }

  return "no_change";
}

function getReason(metric: PalmistryRuleAccuracy, rule: PalmRule) {
  if (metric.totalFeedback < 2) {
    return "Not enough feedback yet. Keep rule unchanged.";
  }

  if (metric.recommendation === "promote") {
    return `Rule is performing strongly. Accuracy ${Math.round(
      metric.accuracyScore * 100,
    )}%, average rating ${metric.avgRating}, sample size ${metric.totalFeedback}.`;
  }

  if (metric.recommendation === "reduce_confidence") {
    return `Rule is underperforming. Accuracy ${Math.round(
      metric.accuracyScore * 100,
    )}%, average rating ${metric.avgRating}, sample size ${metric.totalFeedback}. Reduce confidence and review wording.`;
  }

  if (metric.recommendation === "review") {
    return `Rule has mixed feedback. Accuracy ${Math.round(
      metric.accuracyScore * 100,
    )}%, average rating ${metric.avgRating}. Review interpretation and supporting/contradicting conditions.`;
  }

  return `Rule appears stable. Current confidenceBase ${confidenceRatio(rule.confidenceBase)}.`;
}

function buildOverrideSnippet(params: {
  ruleId: string;
  suggestedConfidenceBase: number;
  suggestedReportPriority: number;
  reason: string;
}) {
  return `"${params.ruleId}": {
  confidenceBase: ${params.suggestedConfidenceBase},
  reportPriority: ${params.suggestedReportPriority},
  note: ${JSON.stringify(params.reason)},
},`;
}

function buildSuggestion(
  metric: PalmistryRuleAccuracy,
  rule: PalmRule,
): PalmistryRuleTuningSuggestion {
  const currentConfidenceBase = round(confidenceRatio(rule.confidenceBase));
  const confidenceDelta = getConfidenceDelta(metric);
  const priorityDelta = getPriorityDelta(metric);

  const suggestedConfidenceBase = round(
    clamp(currentConfidenceBase + confidenceDelta, 0.25, 0.9),
  );

  const currentReportPriority = Math.round(rule.reportPriority);
  const suggestedReportPriority = Math.round(
    clamp(currentReportPriority + priorityDelta, 0, 100),
  );

  const reason = getReason(metric, rule);

  return {
    ruleId: rule.id,
    title: rule.title,
    category: rule.category,
    recommendation: metric.recommendation,
    action: getAction(metric),
    currentConfidenceBase,
    suggestedConfidenceBase,
    currentReportPriority,
    suggestedReportPriority,
    deltaConfidence: round(suggestedConfidenceBase - currentConfidenceBase),
    deltaPriority: suggestedReportPriority - currentReportPriority,
    sampleSize: metric.totalFeedback,
    accuracyScore: metric.accuracyScore,
    avgRating: metric.avgRating,
    avgConfidence: metric.avgConfidence,
    reason,
    overrideSnippet: buildOverrideSnippet({
      ruleId: rule.id,
      suggestedConfidenceBase,
      suggestedReportPriority,
      reason,
    }),
  };
}

export async function generatePalmistryRuleTuningSuggestions(params?: {
  days?: number;
  minFeedback?: number;
}) {
  const days = params?.days ?? 90;
  const minFeedback = params?.minFeedback ?? 2;

  const analytics = await getPalmistryEngineAnalytics({
    days,
  });

  const ruleMap = getRuleMap();

  return analytics.ruleAccuracy
    .filter((metric) => metric.totalFeedback >= minFeedback)
    .map((metric) => {
      const rule = ruleMap.get(metric.ruleId);
      if (!rule) return null;

      return buildSuggestion(metric, rule);
    })
    .filter((item): item is PalmistryRuleTuningSuggestion => Boolean(item))
    .filter((item) => item.action !== "no_change")
    .sort((a, b) => {
      const severityA =
        a.action === "decrease_confidence" ? 3 : a.action === "review_rule" ? 2 : 1;
      const severityB =
        b.action === "decrease_confidence" ? 3 : b.action === "review_rule" ? 2 : 1;

      if (severityB !== severityA) return severityB - severityA;

      return b.sampleSize - a.sampleSize;
    });
}

export async function savePalmistryRuleTuningSuggestions(
  suggestions: PalmistryRuleTuningSuggestion[],
) {
  if (suggestions.length === 0) return [];

  const supabase = getSupabaseAdmin();

  const rows = suggestions.map((item) => ({
    rule_id: item.ruleId,
    title: item.title,
    category: item.category,
    recommendation: item.recommendation,
    action: item.action,
    current_confidence_base: item.currentConfidenceBase,
    suggested_confidence_base: item.suggestedConfidenceBase,
    current_report_priority: item.currentReportPriority,
    suggested_report_priority: item.suggestedReportPriority,
    delta_confidence: item.deltaConfidence,
    delta_priority: item.deltaPriority,
    sample_size: item.sampleSize,
    accuracy_score: item.accuracyScore,
    avg_rating: item.avgRating,
    avg_confidence: item.avgConfidence,
    reason: item.reason,
    status: "pending",
    metadata: {
      overrideSnippet: item.overrideSnippet,
    },
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("palmistry_rule_tuning")
    .upsert(rows, {
      onConflict: "rule_id",
    })
    .select("*");

  if (error) {
    throw new Error(`Failed to save rule tuning suggestions: ${error.message}`);
  }

  return data ?? [];
}

export async function listPalmistryRuleTuningSuggestions(params?: {
  status?: "pending" | "approved" | "rejected" | "applied";
  limit?: number;
}) {
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("palmistry_rule_tuning")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(Math.min(Math.max(params?.limit ?? 200, 1), 500));

  if (params?.status) {
    query = query.eq("status", params.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list rule tuning suggestions: ${error.message}`);
  }

  return data ?? [];
}

export async function updatePalmistryRuleTuningStatus(params: {
  ruleId: string;
  status: "pending" | "approved" | "rejected" | "applied";
}) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("palmistry_rule_tuning")
    .update({
      status: params.status,
      updated_at: new Date().toISOString(),
    })
    .eq("rule_id", params.ruleId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update tuning status: ${error.message}`);
  }

  return data;
}
