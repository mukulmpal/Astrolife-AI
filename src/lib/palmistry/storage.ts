import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { PalmAnalyzeInput, PalmCategory, PalmRuleReport } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase server credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type SavePalmistrySessionInput = {
  userId?: string | null;
  imageUrl?: string | null;
  input: PalmAnalyzeInput;
  result: PalmRuleReport;
};

export type SavePalmistryFeedbackInput = {
  sessionId: string;
  userId?: string | null;
  rating: number;
  accurateSections?: string[];
  inaccurateSections?: string[];
  feedback?: string;
};

function getTopCategories(result: PalmRuleReport): PalmCategory[] {
  return (result.sections ?? [])
    .filter((section) => Array.isArray(section.hits) && section.hits.length > 0)
    .map((section) => section.id)
    .slice(0, 8);
}

export async function savePalmistrySession(payload: SavePalmistrySessionInput) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("palmistry_sessions")
    .insert({
      user_id: payload.userId ?? null,
      hand_side: payload.input.handSide,
      dominant_hand: payload.input.dominantHand ?? null,
      report_style: payload.input.reportStyle,
      user_tier: payload.input.tier ?? "free",
      image_url: payload.imageUrl ?? null,
      image_quality: payload.input.imageQuality ?? null,
      features: payload.input.features,
      result: payload.result,
      summary: payload.result.summary,
      top_categories: getTopCategories(payload.result),
      total_hits: payload.result.hits?.length ?? 0,
      engine_version: payload.result.engineVersion,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to save palmistry session: ${error.message}`);
  }

  return data;
}

export async function savePalmistryFeedback(payload: SavePalmistryFeedbackInput) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("palmistry_feedback")
    .insert({
      session_id: payload.sessionId,
      user_id: payload.userId ?? null,
      rating: payload.rating,
      accurate_sections: payload.accurateSections ?? [],
      inaccurate_sections: payload.inaccurateSections ?? [],
      feedback: payload.feedback?.trim() ? payload.feedback.trim() : null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to save palmistry feedback: ${error.message}`);
  }

  return data;
}

export async function listPalmistrySessions(params: {
  userId?: string | null;
  limit?: number;
}) {
  const supabase = getSupabaseAdmin();
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 50);

  let query = supabase
    .from("palmistry_sessions")
    .select("id,user_id,hand_side,dominant_hand,report_style,user_tier,image_url,summary,top_categories,total_hits,engine_version,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params.userId) {
    query = query.eq("user_id", params.userId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list palmistry sessions: ${error.message}`);
  }

  return data ?? [];
}

export async function getPalmistrySession(params: {
  sessionId: string;
  userId?: string | null;
}) {
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("palmistry_sessions")
    .select("*")
    .eq("id", params.sessionId);

  if (params.userId) {
    query = query.eq("user_id", params.userId);
  }

  const { data, error } = await query.single();

  if (error) {
    throw new Error(`Failed to get palmistry session: ${error.message}`);
  }

  return data;
}

function createShareToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function enablePalmistryShare(params: {
  sessionId: string;
  userId?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  const shareToken = createShareToken();

  let query = supabase
    .from("palmistry_sessions")
    .update({
      share_token: shareToken,
      is_share_enabled: true,
      shared_at: new Date().toISOString(),
    })
    .eq("id", params.sessionId);

  if (params.userId) {
    query = query.eq("user_id", params.userId);
  }

  const { data, error } = await query
    .select("id,share_token,is_share_enabled,shared_at")
    .single();

  if (error) {
    throw new Error(`Failed to enable palmistry share: ${error.message}`);
  }

  return data;
}

export async function getPalmistrySessionByShareToken(shareToken: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("palmistry_sessions")
    .select("*")
    .eq("share_token", shareToken)
    .eq("is_share_enabled", true)
    .single();

  if (error) {
    throw new Error(`Failed to get shared palmistry session: ${error.message}`);
  }

  return data;
}
