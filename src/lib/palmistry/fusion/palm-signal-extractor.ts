import type { PalmCategory, PalmRuleHit, PalmRuleReport } from "../types";
import type {
  FusionSignal,
  FusionTheme,
  PalmHitThemeMap,
} from "./fusion-types";

const CATEGORY_TO_THEME: PalmHitThemeMap = {
  personality: "personality",
  career: "career",
  wealth: "wealth",
  relationship: "relationship",
  vitality: "health_vitality",
  health_vitality: "health_vitality",
  travel: "travel",
  spirituality: "spirituality",
  education: "education",
  family: "family",
  fame: "fame",
};

function categoryToTheme(category?: PalmCategory): FusionTheme | null {
  if (!category) return null;
  return CATEGORY_TO_THEME[category] ?? null;
}

function confidenceStrength(confidence: number) {
  return confidence > 1 ? confidence / 100 : confidence;
}

function hitCategory(hit: PalmRuleHit) {
  return hit.category ?? hit.rule?.category;
}

function hitRuleId(hit: PalmRuleHit) {
  return hit.ruleId ?? hit.rule?.id ?? "unknown";
}

function hitTitle(hit: PalmRuleHit) {
  return hit.title ?? hit.rule?.title ?? "Palmistry signal";
}

function hitInterpretation(hit: PalmRuleHit) {
  return hit.interpretation
    ?? hit.rule?.interpretation?.luxury
    ?? hit.rule?.interpretation?.scientific
    ?? hit.rule?.interpretation?.classical
    ?? "";
}

export function extractPalmFusionSignals(palmResult: PalmRuleReport): FusionSignal[] {
  return (palmResult.hits ?? [])
    .map((hit): FusionSignal | null => {
      const theme = categoryToTheme(hitCategory(hit));
      if (!theme) return null;

      const ruleId = hitRuleId(hit);

      return {
        id: `palm_${ruleId}`,
        source: "palmistry",
        theme,
        polarity: hit.type === "contradiction" || hit.riskLevel === "sensitive" ? "challenge" : "support",
        strength: confidenceStrength(hit.confidence),
        title: hitTitle(hit),
        description: hitInterpretation(hit),
        evidence: [
          `Palm rule: ${ruleId}`,
          `Matched: ${(hit.matchedRequired ?? []).join(", ") || "required features"}`,
        ],
        guardrail: hit.guardrail ?? hit.rule?.guardrail,
      };
    })
    .filter(Boolean) as FusionSignal[];
}
