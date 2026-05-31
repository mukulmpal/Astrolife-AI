import type { PalmRule } from "../types";

export type PalmistryRuleTuningOverride = {
  confidenceBase?: number;
  reportPriority?: number;
  status?: PalmRule["status"];
  note: string;
};

/**
 * Admin-reviewed tuning overrides.
 *
 * Do not auto-fill this file from feedback. Paste only approved suggestions
 * after reviewing the admin tuning dashboard.
 */
export const PALMISTRY_RULE_TUNING_OVERRIDES: Record<
  string,
  PalmistryRuleTuningOverride
> = {};
