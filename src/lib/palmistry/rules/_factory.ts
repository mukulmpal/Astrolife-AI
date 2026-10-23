import type { PalmCategory, PalmCondition, PalmRule, PalmSeverity, PalmTradition } from "../types";

function defaultGuardrail(category: PalmCategory): PalmRule["guardrail"] | undefined {
  if (category === "health_vitality" || category === "vitality") return "no_diagnosis";
  if (category === "relationship" || category === "family" || category === "travel") return "no_guarantee";
  return undefined;
}

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
  const guardrail = args.guardrail ?? defaultGuardrail(args.category);

  return {
    id: args.id,
    type: "atomic",
    title: args.title,
    sourceIds: args.sourceIds ?? ["DAYANAND_MASTER", "WRITER_SCIENTIFIC_IV"],
    tradition: args.tradition ?? "hybrid",
    category: args.category,
    tier: "premium",
    status: "active",
    riskLevel: guardrail === "no_diagnosis" ? "medical_guarded" : guardrail ? "sensitive" : "safe",
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
    guardrail,
    reportPriority: args.reportPriority ?? 60,
  };
}
