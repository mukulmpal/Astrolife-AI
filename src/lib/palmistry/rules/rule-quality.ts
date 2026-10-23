import type { PalmRule } from "../types";

export type PalmRuleValidationError = {
  ruleId: string;
  field: string;
  message: string;
};

const UNSAFE_PATTERNS = [
  /\bdeath\b/i,
  /\bdie\b/i,
  /\bwill die\b/i,
  /\bdeath age\b/i,
  /\bguaranteed\b/i,
  /\b100%\b/i,
  /\bdisease\b/i,
  /\bdiagnosis\b/i,
  /\bdivorce will\b/i,
  /\bmarriage will\b/i,
  /\bchildbirth will\b/i,
  /\bforeign settlement guaranteed\b/i,
];

function textFromRule(rule: PalmRule): string {
  return [
    rule.title,
    rule.sourceNotes,
    rule.guardrail,
    rule.interpretation?.classical,
    rule.interpretation?.scientific,
    rule.interpretation?.luxury,
  ].filter(Boolean).join(" ");
}

function hasMeaningfulText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasProtectiveLanguage(text: string) {
  return /not a medical diagnosis|do not|never|avoid|not guarantee|never guarantee|should not|must not|no_death|no_diagnosis|no_guarantee/i.test(text);
}

function normalizeConfidenceBase(value: number) {
  return value > 1 ? value / 100 : value;
}

export function validatePalmRules(rules: PalmRule[]): PalmRuleValidationError[] {
  const errors: PalmRuleValidationError[] = [];
  const ids = new Map<string, number>();

  for (const rule of rules) ids.set(rule.id, (ids.get(rule.id) ?? 0) + 1);

  for (const rule of rules) {
    if (!hasMeaningfulText(rule.id)) {
      errors.push({ ruleId: "UNKNOWN", field: "id", message: "Rule id is required." });
      continue;
    }

    if ((ids.get(rule.id) ?? 0) > 1) errors.push({ ruleId: rule.id, field: "id", message: "Duplicate rule id found." });
    if (!hasMeaningfulText(rule.title)) errors.push({ ruleId: rule.id, field: "title", message: "Rule title is required." });
    if (!Array.isArray(rule.sourceIds) || rule.sourceIds.length === 0) errors.push({ ruleId: rule.id, field: "sourceIds", message: "sourceIds must not be empty." });
    if (!Array.isArray(rule.required) || rule.required.length === 0) errors.push({ ruleId: rule.id, field: "required", message: "required conditions must not be empty." });
    const confidenceBase = typeof rule.confidenceBase === "number" ? normalizeConfidenceBase(rule.confidenceBase) : Number.NaN;
    if (!Number.isFinite(confidenceBase) || confidenceBase < 0 || confidenceBase > 1) errors.push({ ruleId: rule.id, field: "confidenceBase", message: "confidenceBase must normalize to a value between 0 and 1." });
    if (typeof rule.reportPriority !== "number" || rule.reportPriority < 0 || rule.reportPriority > 100) errors.push({ ruleId: rule.id, field: "reportPriority", message: "reportPriority must be between 0 and 100." });

    if (!rule.interpretation) {
      errors.push({ ruleId: rule.id, field: "interpretation", message: "interpretation object is required." });
    } else {
      if (!hasMeaningfulText(rule.interpretation.classical)) errors.push({ ruleId: rule.id, field: "interpretation.classical", message: "classical interpretation is required." });
      if (!hasMeaningfulText(rule.interpretation.scientific)) errors.push({ ruleId: rule.id, field: "interpretation.scientific", message: "scientific interpretation is required." });
      if (!hasMeaningfulText(rule.interpretation.luxury)) errors.push({ ruleId: rule.id, field: "interpretation.luxury", message: "luxury interpretation is required." });
    }

    if (rule.riskLevel === "blocked" && rule.status === "active") errors.push({ ruleId: rule.id, field: "riskLevel/status", message: "blocked rules cannot be active." });
    if (rule.riskLevel === "medical_guarded" && !hasMeaningfulText(rule.guardrail)) errors.push({ ruleId: rule.id, field: "guardrail", message: "medical_guarded rules must have a guardrail." });

    if (["relationship", "family", "travel", "health_vitality"].includes(rule.category) && !hasMeaningfulText(rule.guardrail)) {
      errors.push({
        ruleId: rule.id,
        field: "guardrail",
        message: "Sensitive categories should include a guardrail: relationship, family, travel, health_vitality.",
      });
    }

    const combinedText = textFromRule(rule);
    for (const pattern of UNSAFE_PATTERNS) {
      if (pattern.test(combinedText) && !hasProtectiveLanguage(combinedText)) {
        errors.push({ ruleId: rule.id, field: "safety", message: `Unsafe/fatalistic wording detected: ${pattern.toString()}` });
      }
    }
  }

  return errors;
}

export function assertPalmRulesValid(rules: PalmRule[]) {
  const errors = validatePalmRules(rules);
  if (errors.length > 0) {
    const message = errors.slice(0, 20).map((error) => `${error.ruleId}.${error.field}: ${error.message}`).join("\n");
    throw new Error(`Palmistry rule validation failed:\n${message}`);
  }
}
