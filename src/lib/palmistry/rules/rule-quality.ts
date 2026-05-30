import type { PalmRule } from "../types";

export type PalmRuleQualityIssue = {
  ruleId: string;
  issue: string;
};

export function validatePalmRules(rules: PalmRule[]) {
  const issues: PalmRuleQualityIssue[] = [];
  const ids = new Set<string>();

  for (const rule of rules) {
    if (ids.has(rule.id)) issues.push({ ruleId: rule.id, issue: "Duplicate rule id" });
    ids.add(rule.id);
    if (!rule.sourceIds.length) issues.push({ ruleId: rule.id, issue: "Missing sourceIds" });
    if (!rule.required.length) issues.push({ ruleId: rule.id, issue: "Missing required conditions" });
    const confidence = rule.confidenceBase > 1 ? rule.confidenceBase / 100 : rule.confidenceBase;
    if (confidence < 0 || confidence > 1) issues.push({ ruleId: rule.id, issue: "confidenceBase must be between 0 and 1" });
    if (rule.reportPriority < 0 || rule.reportPriority > 100) issues.push({ ruleId: rule.id, issue: "reportPriority must be between 0 and 100" });
    if (rule.riskLevel === "medical_guarded" && !rule.guardrail) issues.push({ ruleId: rule.id, issue: "medical_guarded rules require guardrail" });
    if (rule.riskLevel === "blocked" && rule.status === "active") issues.push({ ruleId: rule.id, issue: "blocked rules cannot be active" });
    if (!rule.interpretation.classical || !rule.interpretation.scientific || !rule.interpretation.luxury) {
      issues.push({ ruleId: rule.id, issue: "Missing one or more report interpretations" });
    }
  }

  return {
    ok: issues.length === 0,
    totalRules: rules.length,
    issues,
  };
}
