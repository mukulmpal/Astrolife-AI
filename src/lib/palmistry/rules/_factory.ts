import type { PalmCategory, PalmCondition, PalmRule, PalmSeverity, PalmTradition } from "../types";

export function makeRule(args: {
  id: string;
  title: string;
  category: PalmCategory;
  path: string;
  value: unknown;
  sourceIds?: string[];
  tradition?: PalmTradition;
  supporting?: PalmCondition[];
  contradicting?: PalmCondition[];
  classical: string;
  scientific: string;
  luxury: string;
  confidenceBase?: number;
  severity?: PalmSeverity;
  guardrail?: PalmRule["guardrail"];
  reportPriority?: number;
}): PalmRule {
  return {
    id: args.id,
    type: "atomic",
    title: args.title,
    sourceIds: args.sourceIds ?? ["DAYANAND_MASTER", "WRITER_SCIENTIFIC_IV"],
    tradition: args.tradition ?? "hybrid",
    category: args.category,
    tier: "premium",
    status: "active",
    riskLevel: args.guardrail === "no_diagnosis" ? "medical_guarded" : args.guardrail ? "sensitive" : "safe",
    required: [{ path: args.path, equals: args.value }],
    supporting: args.supporting ?? [],
    contradicting: args.contradicting ?? [],
    interpretation: {
      classical: args.classical,
      scientific: args.scientific,
      luxury: args.luxury,
    },
    confidenceBase: args.confidenceBase ?? 0.68,
    severity: args.severity ?? "supportive",
    guardrail: args.guardrail,
    reportPriority: args.reportPriority ?? 60,
  };
}
