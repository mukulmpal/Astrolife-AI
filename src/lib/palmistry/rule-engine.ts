import { CATEGORY_TITLES, PALMISTRY_DISCLAIMERS, PALMISTRY_ENGINE_VERSION } from "./constants";
import { scoreRuleConfidence, averageConfidence } from "./confidence";
import { prunePalmRuleHits } from "./report/report-pruning";
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
  if (!rule.required.every((condition) => conditionMatches(features, condition))) return false;
  if (rule.type === "contradiction" && rule.contradicting.length > 0) {
    return rule.contradicting.some((condition) => conditionMatches(features, condition));
  }
  return true;
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
    const key = `${hit.rule.category}:${hit.rule.type}:${hit.rule.required.map((condition) => condition.path ?? condition.feature).filter(Boolean).join("|")}`;
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
  const rawHits: PalmRuleHit[] = limitRepetitiveHits(getActivePalmRules(ALL_PALM_RULES, tier)
    .filter((rule) => ruleMatches(features, rule))
    .map((rule) => {
      const matchedSupporting = rule.supporting.filter((condition) => conditionMatches(features, condition)).map((condition) => condition.path ?? condition.feature).filter(Boolean) as string[];
      const matchedContradicting = rule.contradicting.filter((condition) => conditionMatches(features, condition)).map((condition) => condition.path ?? condition.feature).filter(Boolean) as string[];
      const matchedSupport = matchedSupporting.length;
      const contradicted = matchedContradicting.length;
      return {
        rule,
        confidence: scoreRuleConfidence(rule, input.imageQuality, matchedSupport, contradicted, input.userConfirmed ?? true),
        sourceIds: rule.sourceIds,
        matchedSupport,
        contradicted,
        ruleId: rule.id,
        title: rule.title,
        category: rule.category,
        tradition: rule.tradition,
        severity: rule.severity,
        interpretation: rule.interpretation[input.reportStyle],
        matchedRequired: rule.required.map((condition) => condition.path ?? condition.feature).filter(Boolean) as string[],
        matchedSupporting,
        matchedContradicting,
        guardrail: rule.guardrail,
        type: rule.type,
        tier: rule.tier,
        riskLevel: rule.riskLevel,
        reportPriority: rule.reportPriority,
      };
    })
    .sort((a, b) => (b.confidence + b.rule.reportPriority / 10) - (a.confidence + a.rule.reportPriority / 10)));
  const hits = prunePalmRuleHits(rawHits, {
    tier,
    minConfidence: tier === "free" ? 0.45 : 0.35,
    includeReviewedNoClaimRules: false,
  });

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
