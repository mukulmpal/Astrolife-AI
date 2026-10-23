import { runPalmRuleEngine } from "./rule-engine";
import type { PalmAnalyzeInput } from "./types";

export function generatePalmistryRuleReport(input: PalmAnalyzeInput) {
  return runPalmRuleEngine(input);
}
