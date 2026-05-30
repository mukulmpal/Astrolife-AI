import type { PalmCategory, PalmRuleHit, PalmRuleTier } from "../types";

export type PrunablePalmRuleHit = PalmRuleHit;

export interface PalmReportPruningOptions {
  tier?: PalmRuleTier;
  maxTotal?: number;
  maxPerCategory?: Partial<Record<PalmCategory, number>>;
  minConfidence?: number;
  includeReviewedNoClaimRules?: boolean;
}

const DEFAULT_TOTAL_LIMITS: Record<PalmRuleTier, number> = {
  free: 12,
  premium: 32,
  elite: 50,
};

const DEFAULT_CATEGORY_LIMITS: Record<PalmCategory, number> = {
  hand_shape: 4,
  thumb: 4,
  fingers: 5,
  mounts: 8,
  major_lines: 8,
  relationship: 4,
  career: 5,
  vitality: 4,
  travel: 3,
  remedies: 4,
  personality: 6,
  wealth: 5,
  health_vitality: 4,
  spirituality: 4,
  education: 3,
  family: 3,
  fame: 3,
  remedy: 4,
  general: 4,
};

function confidenceScore(hit: PalmRuleHit) {
  return hit.confidence > 1 ? hit.confidence / 100 : hit.confidence;
}

function ruleIdOf(hit: PalmRuleHit) {
  return hit.ruleId ?? hit.rule.id;
}

function categoryOf(hit: PalmRuleHit) {
  return hit.category ?? hit.rule.category;
}

function titleOf(hit: PalmRuleHit) {
  return hit.title ?? hit.rule.title;
}

function interpretationOf(hit: PalmRuleHit) {
  return hit.interpretation
    ?? hit.rule.interpretation.luxury
    ?? hit.rule.interpretation.scientific
    ?? hit.rule.interpretation.classical
    ?? "";
}

function priorityOf(hit: PalmRuleHit) {
  return hit.reportPriority ?? hit.rule.reportPriority ?? 0;
}

function riskLevelOf(hit: PalmRuleHit) {
  return hit.riskLevel ?? hit.rule.riskLevel;
}

function severityRank(hit: PalmRuleHit) {
  const severity = hit.severity ?? hit.rule.severity;
  if (severity === "high" || severity === "strong") return 3;
  if (severity === "medium" || severity === "supportive") return 2;
  return 1;
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function makeRequiredKey(hit: PalmRuleHit) {
  const matchedRequired = hit.matchedRequired?.filter(Boolean);
  const required = matchedRequired?.length
    ? matchedRequired
    : hit.rule.required.map((condition) => condition.path ?? condition.feature).filter(Boolean);

  return `${categoryOf(hit)}:${hit.rule.type}:${required.sort().join("|")}`;
}

function makeSemanticKey(hit: PalmRuleHit) {
  const text = `${titleOf(hit)} ${interpretationOf(hit)}`;
  return `${categoryOf(hit)}:${normalizeText(text).split(" ").slice(0, 12).join(" ")}`;
}

function shouldSuppressNoClaimRule(hit: PalmRuleHit, includeReviewedNoClaimRules: boolean) {
  if (includeReviewedNoClaimRules) return false;

  const text = normalizeText(`${titleOf(hit)} ${interpretationOf(hit)}`);
  const lowSignal = /\b(no strong|not enough|unclear|unknown|not confirmed|insufficient)\b/i.test(text);
  return lowSignal && confidenceScore(hit) < 0.72;
}

function sortHits(a: PalmRuleHit, b: PalmRuleHit) {
  return (
    priorityOf(b) - priorityOf(a)
    || confidenceScore(b) - confidenceScore(a)
    || severityRank(b) - severityRank(a)
    || ruleIdOf(a).localeCompare(ruleIdOf(b))
  );
}

export function prunePalmRuleHits(hits: PalmRuleHit[], options: PalmReportPruningOptions = {}): PalmRuleHit[] {
  const tier = options.tier ?? "elite";
  const maxTotal = options.maxTotal ?? DEFAULT_TOTAL_LIMITS[tier];
  const minConfidence = options.minConfidence ?? 0.35;
  const categoryLimits = { ...DEFAULT_CATEGORY_LIMITS, ...options.maxPerCategory };

  const seenRuleIds = new Set<string>();
  const seenSemantic = new Set<string>();
  const seenRequired = new Set<string>();
  const categoryCounts = new Map<PalmCategory, number>();

  const pruned: PalmRuleHit[] = [];
  for (const hit of [...hits].sort(sortHits)) {
    if (pruned.length >= maxTotal) break;
    if (confidenceScore(hit) < minConfidence) continue;
    if (riskLevelOf(hit) === "blocked") continue;
    if (shouldSuppressNoClaimRule(hit, options.includeReviewedNoClaimRules ?? false)) continue;

    const ruleId = ruleIdOf(hit);
    if (seenRuleIds.has(ruleId)) continue;

    const semanticKey = makeSemanticKey(hit);
    if (seenSemantic.has(semanticKey)) continue;

    const requiredKey = makeRequiredKey(hit);
    if (seenRequired.has(requiredKey)) continue;

    const category = categoryOf(hit);
    const count = categoryCounts.get(category) ?? 0;
    if (count >= (categoryLimits[category] ?? 4)) continue;

    seenRuleIds.add(ruleId);
    seenSemantic.add(semanticKey);
    seenRequired.add(requiredKey);
    categoryCounts.set(category, count + 1);
    pruned.push(hit);
  }

  return pruned.sort(sortHits);
}

export function groupPalmHitsByCategory(hits: PalmRuleHit[]) {
  return hits.reduce<Partial<Record<PalmCategory, PalmRuleHit[]>>>((groups, hit) => {
    const category = categoryOf(hit);
    groups[category] = groups[category] ?? [];
    groups[category]?.push(hit);
    return groups;
  }, {});
}
