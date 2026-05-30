import { ALL_PALMISTRY_RULES } from ".";
import { validatePalmRules } from "./rule-quality";
import type { PalmRule } from "../types";

function countBy<K extends string>(rules: PalmRule[], getKey: (rule: PalmRule) => K) {
  return rules.reduce<Record<K, number>>((acc, rule) => {
    const key = getKey(rule);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}

export function getPalmRuleBankSummary() {
  const rules = ALL_PALMISTRY_RULES;
  const quality = validatePalmRules(rules);
  return {
    totalRules: rules.length,
    activeRules: rules.filter((rule) => rule.status === "active" && rule.riskLevel !== "blocked").length,
    rulesByType: countBy(rules, (rule) => rule.type),
    rulesByCategory: countBy(rules, (rule) => rule.category),
    rulesByTier: countBy(rules, (rule) => rule.tier),
    rulesByRiskLevel: countBy(rules, (rule) => rule.riskLevel),
    quality,
  };
}
