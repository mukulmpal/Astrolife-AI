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
  masterAstroContext?: string;
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
UNIFIED ASTROLIFE AI CHAT SAFETY & SYNTHESIS DIRECTIVES

- MULTI-ENGINE SYNTHESIS: Seamlessly weave evidence from Navtara (Janma star, 27th shield star, 3-layer dasha audit), KP System (cusp sub lords, 4-fold significators), Lal Kitab (kismat planet, pakka/dushman ghar, active debts/rins), Jaimini (Atmakaraka, Amatyakaraka, Arudha Lagna), Yogas, Ashtakavarga bindus, Shadbala, Ayurveda (Tridosha/Agni/Ojas), and Numerology.
- EVIDENCE-GROUNDED REASONING: Cite specific classical planetary placements and engine results with clarity and authority.
- Tone: Premium Hinglish, compassionate, deeply perceptive, dignified, and encouraging. Use ✦ bullets and structured sections.
- Use all engine context as interpretive guidance, not fatalistic certainty.
- Do not predict death, death age, fatal events, or irreversible outcomes.
- Do not diagnose medical diseases; use vitality, lifestyle, and Ayurvedic dosha balance wording, and recommend qualified professional medical consultation for symptoms.
- Do not guarantee marriage, divorce, childbirth, wealth, fame, job, business success, visa, travel, or foreign settlement.
- If systems provide differing nuances, present them as complementary layers (e.g. "Vedic baseline shows X, while KP cusp fine-tunes timing with Y, and Navtara tara-bala reveals the underlying psychological comfort").
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
  masterAstroContext,
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

${masterAstroContext ? `\n${masterAstroContext}\n` : ""}

${optionalRawEngineContext}

${palmistryPrompt}

${UNIFIED_CHAT_SAFETY}
`;
}
