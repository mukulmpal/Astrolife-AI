import { CATEGORY_TITLES, PALMISTRY_DISCLAIMERS, PALMISTRY_ENGINE_VERSION } from "./constants";
import { scoreRuleConfidence, averageConfidence } from "./confidence";
import { ALL_PALM_RULES } from "./rules";
import type { PalmAnalyzeInput, PalmCondition, PalmFeatures, PalmRule, PalmRuleHit, PalmRuleReport } from "./types";

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) return (current as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function conditionMatches(features: PalmFeatures, condition: PalmCondition) {
  const value = getPath(features, condition.path);
  if ("exists" in condition) return condition.exists ? value !== undefined && value !== false : value === undefined || value === false;
  return value === condition.equals;
}

function ruleMatches(features: PalmFeatures, rule: PalmRule) {
  return rule.required.every((condition) => conditionMatches(features, condition));
}

export function runPalmRuleEngine(input: PalmAnalyzeInput): PalmRuleReport {
  const features: PalmFeatures = {
    handSide: input.handSide,
    dominantHand: input.dominantHand,
    ...input.features,
  };

  const hits: PalmRuleHit[] = ALL_PALM_RULES
    .filter((rule) => ruleMatches(features, rule))
    .map((rule) => {
      const matchedSupport = rule.supporting.filter((condition) => conditionMatches(features, condition)).length;
      const contradicted = rule.contradicting.filter((condition) => conditionMatches(features, condition)).length;
      return {
        rule,
        confidence: scoreRuleConfidence(rule, input.imageQuality, matchedSupport, contradicted),
        sourceIds: rule.sourceIds,
        matchedSupport,
        contradicted,
      };
    })
    .sort((a, b) => b.confidence - a.confidence);

  const sections = Object.entries(CATEGORY_TITLES).map(([id, title]) => {
    const sectionHits = hits.filter((hit) => hit.rule.category === id);
    return {
      id: id as keyof typeof CATEGORY_TITLES,
      title,
      summary: sectionHits.length
        ? sectionHits.slice(0, 3).map((hit) => hit.rule.interpretation[input.reportStyle]).join(" ")
        : "No strong pattern was confirmed in this category. Confidence is kept conservative.",
      confidence: averageConfidence(sectionHits),
      hits: sectionHits,
    };
  });

  const topInsights = hits.slice(0, 5).map((hit) => hit.rule.interpretation[input.reportStyle]);
  return {
    engineVersion: PALMISTRY_ENGINE_VERSION,
    summary: topInsights.length
      ? topInsights.join(" ")
      : "The current manual feature set is not enough for a strong reading. Add clearer line, mount, thumb, and finger details.",
    hits,
    sections,
    disclaimers: PALMISTRY_DISCLAIMERS,
  };
}
