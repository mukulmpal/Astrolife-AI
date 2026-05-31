import "server-only";

import {
  buildPalmistryChatContext,
  palmistryChatContextToPrompt,
} from "@/lib/palmistry/ai-chat-context";

type BuildUnifiedAstroLifeChatPromptInput = {
  existingPrompt: string;
  palmSessionId?: string | null;
  userId?: string | null;
  includeRawEngineContext?: boolean;
  kundliContext?: unknown;
  dashaContext?: unknown;
  transitContext?: unknown;
  numerologyContext?: unknown;
};

function compactJson(value: unknown, maxChars = 6000) {
  if (!value) return "";

  try {
    const text = JSON.stringify(value, null, 2);
    return text.length > maxChars
      ? `${text.slice(0, maxChars)}\n...TRUNCATED_FOR_CHAT_CONTEXT`
      : text;
  } catch {
    return "";
  }
}

function engineBlock(title: string, value: unknown) {
  const text = compactJson(value);
  if (!text.trim()) return "";

  return `
${title}

${text}
`;
}

const UNIFIED_CHAT_SAFETY = `
UNIFIED ASTROLIFE AI CHAT SAFETY

- Use all engine context as interpretive guidance, not certainty.
- Do not predict death, death age, fatal events, or irreversible outcomes.
- Do not diagnose disease from astrology, palmistry, nails, palm colour, or any line.
- Do not guarantee marriage, divorce, childbirth, wealth, fame, job, business success, visa, travel, or foreign settlement.
- If systems disagree, say "mixed signals" and explain softly.
- When palmistry, Kundli, Dasha, Transit, and Numerology agree, confidence can be higher but still not guaranteed.
- For health-related questions, use vitality/lifestyle wording only and recommend qualified professional consultation for symptoms.
`;

export async function buildUnifiedAstroLifeChatPrompt({
  existingPrompt,
  palmSessionId,
  userId,
  includeRawEngineContext = false,
  kundliContext,
  dashaContext,
  transitContext,
  numerologyContext,
}: BuildUnifiedAstroLifeChatPromptInput) {
  const palmistryContext = await buildPalmistryChatContext({
    palmSessionId,
    userId: userId ?? null,
  });

  const palmistryPrompt = palmistryChatContextToPrompt(palmistryContext);

  const optionalRawEngineContext = includeRawEngineContext
    ? [
        engineBlock("KUNDLI CONTEXT", kundliContext),
        engineBlock("DASHA CONTEXT", dashaContext),
        engineBlock("TRANSIT CONTEXT", transitContext),
        engineBlock("NUMEROLOGY CONTEXT", numerologyContext),
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return `
${existingPrompt}

${optionalRawEngineContext}

${palmistryPrompt}

${UNIFIED_CHAT_SAFETY}
`;
}
