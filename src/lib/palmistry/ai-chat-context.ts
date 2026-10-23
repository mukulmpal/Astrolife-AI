import "server-only";

import { getPalmistrySession } from "./storage";
import type { PalmRuleHit, PalmRuleReport } from "./types";

type BuildPalmistryChatContextInput = {
  palmSessionId?: string | null;
  userId?: string | null;
};

type PalmistryChatInsight = {
  title: string;
  category: string;
  confidence: number;
  interpretation: string;
  guardrail?: string;
  matchedRequired?: string[];
};

function safeSlice<T>(items: T[] | undefined | null, limit: number): T[] {
  return Array.isArray(items) ? items.slice(0, limit) : [];
}

function confidencePercent(value: number) {
  return Math.round(value > 1 ? value : value * 100);
}

function insightFromHit(hit: PalmRuleHit): PalmistryChatInsight {
  return {
    title: hit.title ?? hit.rule.title,
    category: hit.category ?? hit.rule.category,
    confidence: hit.confidence,
    interpretation: hit.interpretation ?? hit.rule.interpretation.luxury,
    guardrail: hit.guardrail ?? hit.rule.guardrail,
    matchedRequired: hit.matchedRequired ?? hit.rule.required.map((condition) => condition.path ?? condition.feature).filter(Boolean) as string[],
  };
}

export async function buildPalmistryChatContext({
  palmSessionId,
  userId,
}: BuildPalmistryChatContextInput) {
  if (!palmSessionId) return null;

  try {
    const session = await getPalmistrySession({
      sessionId: palmSessionId,
      userId: userId ?? null,
    });

    const result = session.result as PalmRuleReport | undefined;
    const hits = safeSlice(result?.hits, 20);
    const topInsights = hits.map(insightFromHit);

    return {
      source: "palmistry" as const,
      sessionId: session.id as string,
      handSide: session.hand_side as string,
      dominantHand: session.dominant_hand as string | null,
      reportStyle: session.report_style as string,
      userTier: session.user_tier as string | null,
      engineVersion: session.engine_version as string | null,
      summary: (session.summary as string | null) ?? result?.summary,
      imageQuality: session.image_quality as unknown,
      topCategories: session.top_categories as string[] | null ?? [],
      totalHits: (session.total_hits as number | null) ?? hits.length,
      topInsights,
      disclaimers: result?.disclaimers ?? [],
      safetyInstructions: [
        "Use palmistry context as reflective tendency, not certainty.",
        "Do not predict death age, death timing, or fatal events.",
        "Do not diagnose disease from palm lines, nail colour, palm colour, or Mercury/Health line.",
        "Do not guarantee marriage, divorce, childbirth, wealth, fame, career result, visa, travel, or foreign settlement.",
        "For health-related questions, use vitality/lifestyle wording only and advise professional consultation for symptoms.",
        "Combine palmistry with Kundli, Dasha, Transit, Numerology and other AstroLife engine context when available.",
        "If palmistry conflicts with Kundli/Dasha context, explain softly as mixed signals, not certainty.",
      ],
    };
  } catch (error) {
    console.error("Failed to build palmistry chat context:", error);
    return null;
  }
}

export function palmistryChatContextToPrompt(
  context: Awaited<ReturnType<typeof buildPalmistryChatContext>>,
) {
  if (!context) return "";

  const insights = context.topInsights
    .map((hit, index) => {
      return `${index + 1}. ${hit.title}
Category: ${hit.category}
Confidence: ${confidencePercent(hit.confidence)}%
Interpretation: ${hit.interpretation}
Matched features: ${hit.matchedRequired?.join(", ") || "not listed"}
${hit.guardrail ? `Guardrail: ${hit.guardrail}` : ""}`;
    })
    .join("\n\n");

  return `
PALMISTRY CONTEXT FOR ASTROLIFE AI CHAT

Palm Session:
- Session ID: ${context.sessionId}
- Hand side: ${context.handSide}
- Dominant hand: ${context.dominantHand ?? "unknown"}
- Report style: ${context.reportStyle}
- User tier: ${context.userTier ?? "unknown"}
- Engine version: ${context.engineVersion ?? "unknown"}

Palm Report Summary:
${context.summary ?? "No summary available."}

Top Palm Categories:
${context.topCategories.join(", ") || "Not available"}

Top Palmistry Insights:
${insights || "No palmistry insights available."}

Palmistry Safety Instructions:
${context.safetyInstructions.map((item) => `- ${item}`).join("\n")}
`;
}
