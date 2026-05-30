import type { PalmCategory, PalmCondition, PalmRule, PalmRuleRiskLevel, PalmRuleTier, PalmRuleType } from "../types";

type FeatureSeed = {
  key: string;
  feature: string;
  value: unknown;
  label: string;
  sourceIds: string[];
  category: PalmCategory;
  base: number;
};

type LensSeed = {
  key: string;
  type: PalmRuleType;
  tier: PalmRuleTier;
  riskLevel: PalmRuleRiskLevel;
  category?: PalmCategory;
  support?: PalmCondition[];
  contradict?: PalmCondition[];
  priority: number;
  classical: string;
  scientific: string;
  luxury: string;
};

const sources = {
  dayanand: ["DAYANAND_MASTER", "DAYANAND_SECRETS"],
  writer: ["WRITER_LINES_III", "WRITER_SCIENTIFIC_IV"],
  samudrik: ["SAMUDRIK_SHASTRA", "DAYANAND_MASTER"],
  handprints: ["FIFTY_HANDPRINTS", "WRITER_LINES_III"],
};

const featureSeeds: FeatureSeed[] = [
  { key: "palm_rectangular", feature: "palm.shape", value: "rectangular", label: "rectangular palm", sourceIds: sources.samudrik, category: "personality", base: 0.62 },
  { key: "palm_square", feature: "palm.shape", value: "square", label: "square palm", sourceIds: sources.samudrik, category: "career", base: 0.62 },
  { key: "palm_conic", feature: "palm.shape", value: "conic", label: "conic palm", sourceIds: sources.samudrik, category: "fame", base: 0.6 },
  { key: "palm_spatulate", feature: "palm.shape", value: "spatulate", label: "spatulate palm", sourceIds: sources.samudrik, category: "career", base: 0.61 },
  { key: "texture_supple", feature: "palm.texture", value: "supple", label: "supple palm texture", sourceIds: sources.handprints, category: "personality", base: 0.59 },
  { key: "texture_firm", feature: "palm.texture", value: "firm", label: "firm palm texture", sourceIds: sources.handprints, category: "health_vitality", base: 0.6 },
  { key: "density_many", feature: "palm.lineDensity", value: "many", label: "many fine palm lines", sourceIds: sources.handprints, category: "personality", base: 0.58 },
  { key: "density_few", feature: "palm.lineDensity", value: "few", label: "few strong palm lines", sourceIds: sources.handprints, category: "general", base: 0.57 },
  { key: "thumb_long", feature: "thumb.length", value: "long", label: "long thumb", sourceIds: sources.dayanand, category: "personality", base: 0.66 },
  { key: "thumb_short", feature: "thumb.length", value: "short", label: "short thumb", sourceIds: sources.dayanand, category: "personality", base: 0.56 },
  { key: "thumb_wide", feature: "thumb.angle", value: "wide", label: "wide thumb angle", sourceIds: sources.dayanand, category: "relationship", base: 0.6 },
  { key: "thumb_closed", feature: "thumb.angle", value: "closed", label: "closed thumb angle", sourceIds: sources.dayanand, category: "relationship", base: 0.56 },
  { key: "thumb_will", feature: "thumb.firstPhalange", value: "long", label: "long will phalange", sourceIds: sources.dayanand, category: "career", base: 0.64 },
  { key: "thumb_logic", feature: "thumb.secondPhalange", value: "long", label: "long logic phalange", sourceIds: sources.dayanand, category: "education", base: 0.64 },
  { key: "fingers_long", feature: "fingers.length", value: "long", label: "long fingers", sourceIds: sources.writer, category: "education", base: 0.61 },
  { key: "fingers_short", feature: "fingers.length", value: "short", label: "short fingers", sourceIds: sources.writer, category: "career", base: 0.58 },
  { key: "tips_square", feature: "fingers.tips", value: "square", label: "square fingertips", sourceIds: sources.writer, category: "career", base: 0.59 },
  { key: "tips_conic", feature: "fingers.tips", value: "conic", label: "conic fingertips", sourceIds: sources.writer, category: "fame", base: 0.58 },
  { key: "tips_spatulate", feature: "fingers.tips", value: "spatulate", label: "spatulate fingertips", sourceIds: sources.writer, category: "career", base: 0.58 },
  { key: "fingers_low", feature: "fingers.setting", value: "low", label: "low finger setting", sourceIds: sources.handprints, category: "general", base: 0.55 },
  ...["jupiter", "saturn", "sun", "mercury", "venus", "moon", "mars"].flatMap((mount) => [
    { key: `mount_${mount}_strong`, feature: `mounts.${mount}.prominence`, value: "strong", label: `strong ${mount} mount`, sourceIds: sources.samudrik, category: mount === "sun" ? "fame" : mount === "mercury" ? "wealth" : mount === "moon" ? "travel" : mount === "venus" ? "relationship" : "career", base: 0.62 },
    { key: `mount_${mount}_weak`, feature: `mounts.${mount}.prominence`, value: "weak", label: `weak ${mount} mount`, sourceIds: sources.samudrik, category: mount === "venus" ? "relationship" : "remedy", base: 0.54 },
  ] as FeatureSeed[]),
  ...["life", "head", "heart", "saturn", "sun", "mercury", "travel", "intuition"].map((line) => ({
    key: `line_${line}_visible`,
    feature: `lines.${line}.visible`,
    value: true,
    label: `visible ${line} line`,
    sourceIds: sources.writer,
    category: line === "life" ? "health_vitality" : line === "heart" ? "relationship" : line === "saturn" ? "career" : line === "sun" ? "fame" : line === "travel" ? "travel" : line === "intuition" ? "spirituality" : "general",
    base: 0.6,
  } as FeatureSeed)),
  { key: "life_deep", feature: "lines.life.depth", value: "deep", label: "deep life line", sourceIds: sources.writer, category: "health_vitality", base: 0.62 },
  { key: "life_clear", feature: "lines.life.clarity", value: "clear", label: "clear life line", sourceIds: sources.writer, category: "health_vitality", base: 0.63 },
  { key: "head_clear", feature: "lines.head.clarity", value: "clear", label: "clear head line", sourceIds: sources.writer, category: "education", base: 0.64 },
  { key: "head_moon", feature: "lines.head.direction", value: "moon", label: "head line moving toward Moon", sourceIds: sources.writer, category: "spirituality", base: 0.62 },
  { key: "head_straight", feature: "lines.head.direction", value: "straight", label: "straight head line", sourceIds: sources.writer, category: "career", base: 0.61 },
  { key: "heart_clear", feature: "lines.heart.clarity", value: "clear", label: "clear heart line", sourceIds: sources.writer, category: "relationship", base: 0.63 },
  { key: "heart_jupiter", feature: "lines.heart.ending", value: "jupiter", label: "heart line ending near Jupiter", sourceIds: sources.writer, category: "relationship", base: 0.62 },
  { key: "heart_between", feature: "lines.heart.ending", value: "between", label: "heart line ending between Jupiter and Saturn", sourceIds: sources.writer, category: "relationship", base: 0.61 },
  ...["island", "cross", "square", "star", "triangle", "grille", "fork", "branch", "break"].map((sign) => ({
    key: `sign_${sign}`,
    feature: `signs.${sign}`,
    value: true,
    label: `${sign} marking`,
    sourceIds: sources.handprints,
    category: sign === "triangle" || sign === "star" ? "fame" : sign === "island" || sign === "break" ? "remedy" : "general",
    base: 0.55,
  } as FeatureSeed)),
];

const lenses: LensSeed[] = [
  { key: "core", type: "atomic", tier: "free", riskLevel: "safe", priority: 55, classical: "Is sanket ko akela nishchit phal na maankar anya rekhaon ke saath milana chahiye.", scientific: "This is a single-feature signal and should be weighted with corroborating signs.", luxury: "This marker adds one clean data point to the AstroLife palm map." },
  { key: "confirmed", type: "modifier", tier: "premium", riskLevel: "safe", support: [{ feature: "thumb.length", operator: "equals", value: "long" }], priority: 62, classical: "Angutha sahayak ho to sanket ki kriyatmak shakti badhti hai.", scientific: "Thumb support increases confidence because intention and execution are aligned.", luxury: "When willpower supports this marker, the pattern becomes more usable in real decisions." },
  { key: "mental_clarity", type: "combination", tier: "premium", riskLevel: "safe", support: [{ feature: "lines.head.clarity", operator: "equals", value: "clear" }], priority: 72, classical: "Mastishk rekha spasht ho to sanket ka vivekpoorvak upyog hota hai.", scientific: "Clear head-line evidence improves the reading by adding decision quality.", luxury: "Strategic clarity turns this sign from raw potential into an operating advantage." },
  { key: "emotional_filter", type: "combination", tier: "premium", riskLevel: "sensitive", category: "relationship", support: [{ feature: "lines.heart.clarity", operator: "equals", value: "clear" }], contradict: [{ feature: "lines.heart.clarity", operator: "equals", value: "broken" }], priority: 70, classical: "Hridaya rekha ke saath milkar sambandh sambandhi arth nikalta hai.", scientific: "Relationship interpretations require emotional-line confirmation and lower certainty if contradicted.", luxury: "This relationship signal is useful only when the emotional pattern confirms it." },
  { key: "career_filter", type: "combination", tier: "premium", riskLevel: "safe", category: "career", support: [{ feature: "lines.saturn.visible", operator: "equals", value: true }], contradict: [{ feature: "lines.head.clarity", operator: "equals", value: "broken" }], priority: 78, classical: "Shani rekha aur vivek rekha ke sanyog se karmakshetra ka arth nikalein.", scientific: "Career potential needs direction plus decision stability before it is treated as strong.", luxury: "Career force becomes credible when direction and judgement appear together." },
  { key: "visibility_filter", type: "combination", tier: "elite", riskLevel: "safe", category: "fame", support: [{ feature: "lines.sun.visible", operator: "equals", value: true }], priority: 82, classical: "Surya sanket se pratishtha ka yog bal paata hai, par nishchit lokpriyata nahi.", scientific: "Visibility indicators increase recognition potential without guaranteeing fame.", luxury: "This gives the report a refined public-influence signature, not a fame guarantee." },
  { key: "fusion_ready", type: "fusion", tier: "elite", riskLevel: "safe", priority: 76, classical: "Is sanket ko bhavishya mein kundli, dasha aur gochar ke saath milakar dekha ja sakta hai.", scientific: "This rule is prepared for later palm-chart-dasha correlation and should not overrule the palm evidence.", luxury: "This marker is reserved for AstroLife's future palm plus kundli fusion layer." },
  { key: "remedy_filter", type: "remedy", tier: "premium", riskLevel: "safe", category: "remedy", support: [{ feature: "palm.lineDensity", operator: "equals", value: "many" }], priority: 65, classical: "Upay vyavaharik, shant aur ahimsa-poorvak hone chahiye.", scientific: "Behavioral remedies focus on routine, clarity and nervous-system regulation.", luxury: "The remedy is practical: simplify inputs, protect recovery and choose disciplined rhythm." },
  { key: "overclaim_guard", type: "contradiction", tier: "free", riskLevel: "sensitive", contradict: [{ feature: "signs.break", operator: "equals", value: true }], priority: 92, classical: "Ek chihna se bhay ya nishchit ghatna ka nirdharan nahi kiya jaata.", scientific: "Contradictions reduce certainty and prevent deterministic conclusions.", luxury: "AstroLife lowers confidence here and refuses to turn a single mark into destiny." },
];

function makePhase3Rule(seed: FeatureSeed, lens: LensSeed, index: number): PalmRule {
  const category = lens.category ?? seed.category;
  const guarded = category === "health_vitality" ? "Health language is limited to vitality, stress and lifestyle balance." : undefined;
  return {
    id: `p3_${seed.key}_${lens.key}_${String(index).padStart(3, "0")}`,
    type: lens.type,
    title: `${seed.label}: ${lens.key.replaceAll("_", " ")}`,
    sourceIds: seed.sourceIds,
    sourceNotes: "Phase 3 rule-bank expansion: multi-sign reading, confidence scoring and guardrailed interpretation.",
    pageRef: "Rule bank expansion synthesis",
    tradition: seed.sourceIds.includes("SAMUDRIK_SHASTRA") ? "samudrik" : seed.sourceIds.includes("WRITER_LINES_III") ? "anthony_writer" : "dayanand",
    category,
    tier: lens.tier,
    status: "active",
    riskLevel: category === "health_vitality" ? "medical_guarded" : lens.riskLevel,
    required: [{ feature: seed.feature, operator: "equals", value: seed.value }],
    supporting: lens.support ?? [],
    contradicting: lens.contradict ?? [],
    interpretation: {
      classical: `${seed.label} parampara mein ek mahatvapurn sanket maana gaya hai. ${lens.classical}`,
      scientific: `${seed.label} is treated as a probability marker, not a fixed prediction. ${lens.scientific}`,
      luxury: `${seed.label} refines this AstroLife intelligence layer. ${lens.luxury}`,
    },
    confidenceBase: Math.min(0.84, seed.base + (lens.type === "combination" ? 0.08 : lens.type === "contradiction" ? 0.03 : 0)),
    severity: lens.type === "combination" ? "high" : lens.type === "contradiction" ? "medium" : "low",
    guardrail: guarded ?? (lens.riskLevel === "sensitive" ? "Use soft probability language. Do not guarantee life events." : undefined),
    reportPriority: Math.min(100, lens.priority + Math.round(seed.base * 10)),
    modifiesRuleIds: lens.type === "modifier" || lens.type === "contradiction" ? [`p3_${seed.key}_core_000`] : undefined,
  };
}

export const PHASE3_RULE_BANK: PalmRule[] = featureSeeds.flatMap((seed, seedIndex) =>
  lenses.map((lens, lensIndex) => makePhase3Rule(seed, lens, seedIndex * lenses.length + lensIndex)),
);
