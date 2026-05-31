import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { PalmCategory, PalmRuleHit, PalmRuleReport } from "./types";

export type PalmistryRuleRecommendation =
  | "promote"
  | "keep"
  | "reduce_confidence"
  | "review";

export type PalmistryRuleAccuracy = {
  ruleId: string;
  title: string;
  category: PalmCategory;
  totalFeedback: number;
  accuracyScore: number;
  avgRating: number;
  avgConfidence: number;
  recommendation: PalmistryRuleRecommendation;
};

export type PalmistryEngineAnalytics = {
  days: number;
  feedbackCount: number;
  sessionCount: number;
  ruleAccuracy: PalmistryRuleAccuracy[];
};

type FeedbackRow = {
  session_id: string;
  rating: number | null;
  accurate_sections: string[] | null;
  inaccurate_sections: string[] | null;
};

type SessionRow = {
  id: string;
  result: PalmRuleReport | null;
};

type RuleAccumulator = {
  ruleId: string;
  title: string;
  category: PalmCategory;
  feedbackScores: number[];
  ratings: number[];
  confidences: number[];
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

function confidenceRatio(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value > 1 ? value / 100 : value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function getHitRuleId(hit: PalmRuleHit) {
  return hit.ruleId ?? hit.rule?.id;
}

function getHitTitle(hit: PalmRuleHit) {
  return hit.title ?? hit.rule?.title ?? "Untitled palmistry rule";
}

function getHitCategory(hit: PalmRuleHit) {
  return (hit.category ?? hit.rule?.category ?? "general") as PalmCategory;
}

function scoreHitFromFeedback(hit: PalmRuleHit, feedback: FeedbackRow) {
  const category = getHitCategory(hit);
  const accurateSections = new Set(feedback.accurate_sections ?? []);
  const inaccurateSections = new Set(feedback.inaccurate_sections ?? []);

  if (accurateSections.has(category)) return 1;
  if (inaccurateSections.has(category)) return 0;

  const rating = feedback.rating ?? 3;
  return Math.max(0, Math.min(1, rating / 5));
}

function getRecommendation(params: {
  totalFeedback: number;
  accuracyScore: number;
  avgRating: number;
}): PalmistryRuleRecommendation {
  if (params.totalFeedback < 2) return "keep";

  if (params.accuracyScore >= 0.82 && params.avgRating >= 4.2) {
    return "promote";
  }

  if (params.accuracyScore <= 0.45 || params.avgRating <= 2.6) {
    return "reduce_confidence";
  }

  if (params.accuracyScore < 0.62 || params.avgRating < 3.4) {
    return "review";
  }

  return "keep";
}

export async function getPalmistryEngineAnalytics(params?: {
  days?: number;
}): Promise<PalmistryEngineAnalytics> {
  const days = Math.min(Math.max(params?.days ?? 90, 1), 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const supabase = getSupabaseAdmin();

  const { data: feedbackRows, error: feedbackError } = await supabase
    .from("palmistry_feedback")
    .select("session_id,rating,accurate_sections,inaccurate_sections,created_at")
    .gte("created_at", since);

  if (feedbackError) {
    throw new Error(`Failed to load palmistry feedback analytics: ${feedbackError.message}`);
  }

  const feedback = (feedbackRows ?? []) as FeedbackRow[];
  const sessionIds = [...new Set(feedback.map((item) => item.session_id).filter(Boolean))];

  if (sessionIds.length === 0) {
    return {
      days,
      feedbackCount: 0,
      sessionCount: 0,
      ruleAccuracy: [],
    };
  }

  const { data: sessionRows, error: sessionError } = await supabase
    .from("palmistry_sessions")
    .select("id,result")
    .in("id", sessionIds);

  if (sessionError) {
    throw new Error(`Failed to load palmistry sessions for analytics: ${sessionError.message}`);
  }

  const sessions = new Map(
    ((sessionRows ?? []) as SessionRow[]).map((session) => [session.id, session]),
  );
  const accumulators = new Map<string, RuleAccumulator>();

  for (const feedbackItem of feedback) {
    const session = sessions.get(feedbackItem.session_id);
    const hits = session?.result?.hits ?? [];

    for (const hit of hits) {
      const ruleId = getHitRuleId(hit);
      if (!ruleId) continue;

      const existing =
        accumulators.get(ruleId) ??
        {
          ruleId,
          title: getHitTitle(hit),
          category: getHitCategory(hit),
          feedbackScores: [],
          ratings: [],
          confidences: [],
        };

      existing.feedbackScores.push(scoreHitFromFeedback(hit, feedbackItem));
      existing.ratings.push(feedbackItem.rating ?? 3);
      existing.confidences.push(confidenceRatio(hit.confidence));
      accumulators.set(ruleId, existing);
    }
  }

  const ruleAccuracy = [...accumulators.values()]
    .map((item) => {
      const totalFeedback = item.feedbackScores.length;
      const accuracyScore = average(item.feedbackScores);
      const avgRating = average(item.ratings);
      const avgConfidence = average(item.confidences);

      return {
        ruleId: item.ruleId,
        title: item.title,
        category: item.category,
        totalFeedback,
        accuracyScore,
        avgRating,
        avgConfidence,
        recommendation: getRecommendation({
          totalFeedback,
          accuracyScore,
          avgRating,
        }),
      };
    })
    .sort((a, b) => b.totalFeedback - a.totalFeedback);

  return {
    days,
    feedbackCount: feedback.length,
    sessionCount: sessionIds.length,
    ruleAccuracy,
  };
}
