import { ALL_PALMISTRY_RULES } from ".";
import { validatePalmRules } from "./rule-quality";
import type { PalmRule } from "../types";

function countBy<T extends string>(rules: PalmRule[], getKey: (rule: PalmRule) => T) {
  return rules.reduce<Record<T, number>>((acc, rule) => {
    const key = getKey(rule);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

export function getPalmRuleBankSummary() {
  const rules = ALL_PALMISTRY_RULES;
  const validationErrors = validatePalmRules(rules);

  return {
    totalRules: rules.length,
    activeRules: rules.filter((rule) => rule.status === "active").length,
    reviewedRules: rules.filter((rule) => rule.status === "reviewed").length,
    draftRules: rules.filter((rule) => rule.status === "draft").length,
    disabledRules: rules.filter((rule) => rule.status === "disabled").length,
    blockedRules: rules.filter((rule) => rule.riskLevel === "blocked").length,
    rulesByType: countBy(rules, (rule) => rule.type),
    rulesByCategory: countBy(rules, (rule) => rule.category),
    rulesByTier: countBy(rules, (rule) => rule.tier),
    rulesByRiskLevel: countBy(rules, (rule) => rule.riskLevel),
    validationErrorCount: validationErrors.length,
    validationErrors,
    quality: {
      ok: validationErrors.length === 0,
      totalRules: rules.length,
      issues: validationErrors.map((error) => ({
        ruleId: error.ruleId,
        issue: `${error.field}: ${error.message}`,
      })),
    },
  };
}
