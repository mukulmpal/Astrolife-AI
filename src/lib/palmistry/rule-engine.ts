import { CATEGORY_TITLES, PALMISTRY_DISCLAIMERS, PALMISTRY_ENGINE_VERSION } from "./constants";
import { scoreRuleConfidence, averageConfidence } from "./confidence";
import { ALL_PALM_RULES } from "./rules";
import type { PalmAnalyzeInput, PalmCondition, PalmFeatures, PalmRule, PalmRuleHit, PalmRuleReport, PalmRuleTier } from "./types";

const tierRank: Record<PalmRuleTier, number> = {
  free: 1,
  premium: 2,
  elite: 3,
};

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) return (current as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function conditionMatches(features: PalmFeatures, condition: PalmCondition) {
  const path = condition.path ?? condition.feature;
  if (!path) return false;
  const value = getPath(features, path);
  if (condition.operator === "exists" || "exists" in condition) return condition.exists === false ? value === undefined || value === false : value !== undefined && value !== false;
  const expected = "value" in condition ? condition.value : condition.equals;
  if (condition.operator === "not_equals") return value !== expected;
  return value === expected;
}

function ruleMatches(features: PalmFeatures, rule: PalmRule) {
  return rule.required.every((condition) => conditionMatches(features, condition));
}

export function getActivePalmRules(rules: PalmRule[], tier: PalmRuleTier) {
  return rules.filter((rule) => {
    if (rule.status !== "active") return false;
    if (rule.riskLevel === "blocked") return false;
    return tierRank[rule.tier] <= tierRank[tier];
  });
}

function limitRepetitiveHits(hits: PalmRuleHit[]) {
  const bucketCounts = new Map<string, number>();
  return hits.filter((hit) => {
    const key = `${hit.rule.category}:${hit.rule.type}:${hit.rule.required.map((condition) => condition.path ?? condition.feature).join("|")}`;
    const count = bucketCounts.get(key) ?? 0;
    bucketCounts.set(key, count + 1);
    return count < 2;
  });
}

function selectTopInsightHits(hits: PalmRuleHit[]) {
  const seen = new Set<string>();
  return hits.filter((hit) => {
    const key = `${hit.rule.category}:${hit.rule.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5);
}

export function runPalmRuleEngine(input: PalmAnalyzeInput): PalmRuleReport {
  const features: PalmFeatures = {
    handSide: input.handSide,
    dominantHand: input.dominantHand,
    ...input.features,
  };

  const tier = input.tier ?? "elite";
  const hits: PalmRuleHit[] = limitRepetitiveHits(getActivePalmRules(ALL_PALM_RULES, tier)
    .filter((rule) => ruleMatches(features, rule))
    .map((rule) => {
      const matchedSupport = rule.supporting.filter((condition) => conditionMatches(features, condition)).length;
      const contradicted = rule.contradicting.filter((condition) => conditionMatches(features, condition)).length;
      return {
        rule,
        confidence: scoreRuleConfidence(rule, input.imageQuality, matchedSupport, contradicted, input.userConfirmed ?? true),
        sourceIds: rule.sourceIds,
        matchedSupport,
        contradicted,
      };
    })
    .sort((a, b) => (b.confidence + b.rule.reportPriority / 10) - (a.confidence + a.rule.reportPriority / 10)));

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

  const topInsights = selectTopInsightHits(hits).map((hit) => hit.rule.interpretation[input.reportStyle]);
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
