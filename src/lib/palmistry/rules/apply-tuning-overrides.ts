import type { PalmRule } from "../types";
import { PALMISTRY_RULE_TUNING_OVERRIDES } from "./tuning-overrides";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function applyPalmistryTuningOverrides(rules: PalmRule[]): PalmRule[] {
  return rules.map((rule) => {
    const override = PALMISTRY_RULE_TUNING_OVERRIDES[rule.id];

    if (!override) return rule;

    return {
      ...rule,
      confidenceBase:
        typeof override.confidenceBase === "number"
          ? clamp(override.confidenceBase, 0, 1)
          : rule.confidenceBase,
      reportPriority:
        typeof override.reportPriority === "number"
          ? clamp(Math.round(override.reportPriority), 0, 100)
          : rule.reportPriority,
      status: override.status ?? rule.status,
      sourceNotes: `${rule.sourceNotes ?? ""}\nTuning note: ${override.note}`.trim(),
    };
  });
}
