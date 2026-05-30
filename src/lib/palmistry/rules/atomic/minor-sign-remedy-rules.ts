import type { PalmCondition, PalmRule } from "../../types";

const medicalGuardrail = "This is not a medical diagnosis. Use only as vitality/lifestyle reflection.";
const relationshipGuardrail = "Do not guarantee marriage, divorce, breakup, loyalty, childbirth or relationship outcome. Present only as emotional or relational tendency.";
const childrenGuardrail = "Do not guarantee childbirth, fertility, number of children or pregnancy outcome. Present children-line reading only as traditional family-theme symbolism.";
const travelGuardrail = "Do not guarantee foreign settlement, visa, migration or travel. Present this only as a traditional travel/relocation tendency when supported by multiple signs.";
const careerGuardrail = "Do not guarantee job, business success, wealth, promotion or legal outcome. Present only as career tendency and confidence-scored potential.";
const fameGuardrail = "Do not guarantee fame or public success. Present this only as creative visibility or recognition potential.";
const remedyGuardrail = "Remedies should be framed as reflective, devotional, meditative or lifestyle support. Do not create fear, dependency or guaranteed outcomes.";
const moralGuardrail = "Do not shame, label or morally judge the user. Present this only as a self-awareness and habit-refinement tendency.";

const eq = (feature: string, value: string | number | boolean): PalmCondition => ({
  feature,
  operator: "equals",
  value,
});

type MinorLineKey = "affection" | "children" | "travel" | "influence" | "intuition" | "mars" | "via_lascivia" | "rascette";

type MinorLineConfig = {
  key: MinorLineKey;
  base: number;
  path: string;
  englishName: string;
  hindiName: string;
  tradition: PalmRule["tradition"];
  category: PalmRule["category"];
  sourceIds: string[];
  coreTheme: string;
  coreMeaning: string;
  classicalCore: string;
  relatedSupport: PalmCondition;
  primarySupport: PalmCondition;
  secondarySupport: PalmCondition;
  specialSupport: PalmCondition;
  riskLevel?: PalmRule["riskLevel"];
  guardrail?: string;
};

type RuleInput = {
  slug: string;
  offset: number;
  type?: PalmRule["type"];
  title: string;
  category?: PalmRule["category"];
  tier?: PalmRule["tier"];
  status?: PalmRule["status"];
  riskLevel?: PalmRule["riskLevel"];
  required: PalmCondition[];
  supporting?: PalmCondition[];
  contradicting?: PalmCondition[];
  meaning: string;
  hindi: string;
  luxury: string;
  confidenceBase: number;
  severity?: PalmRule["severity"];
  reportPriority: number;
  guardrail?: string;
};

const visible = (path: string) => eq(`${path}.visible`, true);
const absent = (path: string) => eq(`${path}.visible`, false);

const defaultGuardrail = (category: PalmRule["category"], riskLevel: PalmRule["riskLevel"]) => {
  if (riskLevel === "medical_guarded") return medicalGuardrail;
  if (category === "relationship") return relationshipGuardrail;
  if (category === "family") return childrenGuardrail;
  if (category === "travel") return travelGuardrail;
  if (category === "career" || category === "wealth") return careerGuardrail;
  if (category === "fame") return fameGuardrail;
  if (category === "remedy") return remedyGuardrail;
  return undefined;
};

const makeRule = (
  id: string,
  sourceIds: string[],
  tradition: PalmRule["tradition"],
  input: RuleInput,
): PalmRule => {
  const category = input.category ?? "general";
  const riskLevel = input.riskLevel ?? (category === "health_vitality" ? "medical_guarded" : "safe");

  return {
    id,
    type: input.type ?? "combination",
    title: input.title,
    sourceIds,
    sourceNotes:
      "Rule derived from classical palmistry structure. Minor lines, signs and remedies must be interpreted with major lines, mounts, fingers, thumb, image quality and confirmation.",
    pageRef: "Phase 3A Batch 4 minor line, sign and remedy inventory",
    tradition,
    category,
    tier: input.tier ?? "premium",
    status: input.status ?? "active",
    riskLevel,
    required: input.required,
    supporting: input.supporting ?? [],
    contradicting: input.contradicting ?? [],
    interpretation: {
      classical: `${input.hindi} इसे मुख्य रेखाओं, पर्वतों और अन्य संकेतों के साथ मिलाकर पढ़ना चाहिए।`,
      scientific: `${input.meaning} This is a tendency-based interpretation and should be weighed with supporting and contradicting features.`,
      luxury: input.luxury,
    },
    confidenceBase: input.confidenceBase,
    severity: input.severity ?? "medium",
    reportPriority: input.reportPriority,
    guardrail: input.guardrail ?? defaultGuardrail(category, riskLevel),
  };
};

const makeMinorLineRule = (cfg: MinorLineConfig, input: RuleInput): PalmRule =>
  makeRule(`minor_${cfg.key}_${input.slug}_${cfg.base + input.offset}`, cfg.sourceIds, cfg.tradition, {
    ...input,
    category: input.category ?? cfg.category,
    riskLevel: input.riskLevel ?? cfg.riskLevel,
    guardrail: input.guardrail ?? cfg.guardrail,
  });

const MINOR_LINE_CONFIGS: MinorLineConfig[] = [
  {
    key: "affection",
    base: 451,
    path: "lines.affection",
    englishName: "Affection/Relationship Line",
    hindiName: "संबंध/स्नेह रेखा",
    tradition: "western",
    category: "relationship",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "affection style, attachment pattern and relationship sensitivity",
    coreMeaning: "Affection lines are read as relationship tendency and emotional attachment style, not guaranteed marriage count.",
    classicalCore: "स्नेह/संबंध रेखा प्रेम, लगाव और संबंधों की प्रवृत्ति का संकेत देती है।",
    relatedSupport: eq("lines.heart.clarity", "clear"),
    primarySupport: eq("mounts.venus.prominence", "strong"),
    secondarySupport: eq("thumb.length", "long"),
    specialSupport: eq("lines.heart.ending", "jupiter"),
    riskLevel: "sensitive",
    guardrail: relationshipGuardrail,
  },
  {
    key: "children",
    base: 463,
    path: "lines.children",
    englishName: "Children/Family Line",
    hindiName: "संतान/परिवार रेखा",
    tradition: "dayanand",
    category: "family",
    sourceIds: ["DAYANAND_MASTER", "DAYANAND_SECRETS"],
    coreTheme: "family responsibility, nurturing and traditional children-line symbolism",
    coreMeaning: "Children lines should be treated only as traditional family-theme symbolism, never as fertility or childbirth guarantee.",
    classicalCore: "संतान रेखा को केवल पारंपरिक पारिवारिक संकेत के रूप में सावधानी से पढ़ना चाहिए।",
    relatedSupport: eq("mounts.venus.prominence", "strong"),
    primarySupport: eq("lines.heart.clarity", "clear"),
    secondarySupport: eq("lines.life.depth", "deep"),
    specialSupport: eq("palm.lineDensity", "balanced"),
    riskLevel: "sensitive",
    guardrail: childrenGuardrail,
  },
  {
    key: "travel",
    base: 475,
    path: "lines.travel",
    englishName: "Travel Line",
    hindiName: "यात्रा रेखा",
    tradition: "dayanand",
    category: "travel",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "travel pull, movement, relocation tendency and distant connections",
    coreMeaning: "Travel lines suggest movement or distant-place pull only when supported by Moon, Life Line or other signs.",
    classicalCore: "यात्रा रेखा यात्रा, स्थान परिवर्तन और दूरस्थ संबंधों की प्रवृत्ति दिखा सकती है।",
    relatedSupport: eq("mounts.moon.prominence", "strong"),
    primarySupport: eq("lines.life.forkDirection", "moon"),
    secondarySupport: eq("lines.head.direction", "moon"),
    specialSupport: eq("lines.life.endFork", true),
    guardrail: travelGuardrail,
  },
  {
    key: "influence",
    base: 487,
    path: "lines.influence",
    englishName: "Influence Line",
    hindiName: "प्रभाव रेखा",
    tradition: "western",
    category: "relationship",
    sourceIds: ["DAYANAND_SECRETS", "WRITER_LINES_III"],
    coreTheme: "important influences, support, relationships and life-impacting connections",
    coreMeaning: "Influence lines suggest people, support or environmental influences affecting the life pattern.",
    classicalCore: "प्रभाव रेखा जीवन में महत्वपूर्ण लोगों, सहयोग या बाहरी प्रभावों का संकेत देती है।",
    relatedSupport: eq("lines.life.visible", true),
    primarySupport: eq("mounts.venus.prominence", "strong"),
    secondarySupport: eq("lines.heart.clarity", "clear"),
    specialSupport: eq("lines.saturn.visible", true),
    riskLevel: "sensitive",
    guardrail: relationshipGuardrail,
  },
  {
    key: "intuition",
    base: 499,
    path: "lines.intuition",
    englishName: "Intuition Line",
    hindiName: "अंतर्ज्ञान रेखा",
    tradition: "western",
    category: "spirituality",
    sourceIds: ["WRITER_LINES_III", "DAYANAND_SECRETS"],
    coreTheme: "intuition, subtle perception and inner sensing",
    coreMeaning: "The Intuition Line is read as inner sensing, symbolic perception and intuitive processing.",
    classicalCore: "अंतर्ज्ञान रेखा सूक्ष्म अनुभूति, आंतरिक संकेत और अंतर्दृष्टि का संकेत देती है।",
    relatedSupport: eq("mounts.moon.prominence", "strong"),
    primarySupport: eq("lines.head.direction", "moon"),
    secondarySupport: eq("fingers.tips", "pointed"),
    specialSupport: eq("palm.shape", "long"),
  },
  {
    key: "mars",
    base: 511,
    path: "lines.mars",
    englishName: "Mars Line",
    hindiName: "मंगल रेखा",
    tradition: "dayanand",
    category: "personality",
    sourceIds: ["DAYANAND_SECRETS", "WRITER_LINES_III"],
    coreTheme: "protection, courage, resistance and backup vitality",
    coreMeaning: "The Mars Line is read as protective force, courage and resistance around the Life Line theme.",
    classicalCore: "मंगल रेखा संरक्षण, साहस, संघर्ष-शक्ति और सहायक ऊर्जा का संकेत देती है।",
    relatedSupport: eq("mounts.mars.prominence", "strong"),
    primarySupport: eq("lines.life.depth", "deep"),
    secondarySupport: eq("thumb.firstPhalange", "long"),
    specialSupport: eq("palm.texture", "hard"),
  },
  {
    key: "via_lascivia",
    base: 523,
    path: "lines.viaLascivia",
    englishName: "Via Lascivia",
    hindiName: "विया लसिविया",
    tradition: "western",
    category: "health_vitality",
    sourceIds: ["WRITER_LINES_III", "DAYANAND_SECRETS"],
    coreTheme: "sensitivity, indulgence tendency, nervous restlessness and habit awareness",
    coreMeaning: "Via Lascivia should be read as habit-awareness and sensitivity, never as moral judgement.",
    classicalCore: "विया लसिविया को संवेदनशीलता, आदत-जागरूकता और संयम की आवश्यकता के रूप में सावधानी से पढ़ें।",
    relatedSupport: eq("palm.lineDensity", "many"),
    primarySupport: eq("mounts.venus.prominence", "strong"),
    secondarySupport: eq("mounts.moon.prominence", "strong"),
    specialSupport: eq("lines.head.direction", "moon"),
    riskLevel: "medical_guarded",
    guardrail: moralGuardrail,
  },
  {
    key: "rascette",
    base: 535,
    path: "lines.rascette",
    englishName: "Rascette/Bracelet Line",
    hindiName: "मणिबंध/कंगन रेखा",
    tradition: "dayanand",
    category: "general",
    sourceIds: ["DAYANAND_SECRETS", "WRITER_LINES_III"],
    coreTheme: "foundation, life rhythm, grounding and traditional wrist-line symbolism",
    coreMeaning: "Rascette lines are read as foundation and grounding symbolism, not lifespan measurement.",
    classicalCore: "मणिबंध रेखाएँ आधार, जीवन-लय और स्थिरता के पारंपरिक संकेत के रूप में पढ़ी जाती हैं।",
    relatedSupport: eq("lines.life.depth", "deep"),
    primarySupport: eq("palm.texture", "hard"),
    secondarySupport: eq("palm.lineDensity", "balanced"),
    specialSupport: eq("mounts.mars.prominence", "strong"),
    guardrail: "Do not use rascette lines for lifespan or death prediction. Read only as grounding and traditional foundation symbolism.",
  },
];

const createMinorLineRules = (cfg: MinorLineConfig): PalmRule[] => {
  const v = visible(cfg.path);
  const a = absent(cfg.path);

  return [
    makeMinorLineRule(cfg, { offset: 0, slug: "visible_core", type: "atomic", tier: "free", title: `${cfg.englishName} visible core meaning`, required: [v], meaning: cfg.coreMeaning, hindi: cfg.classicalCore, luxury: `Your ${cfg.englishName} is visible, adding ${cfg.coreTheme} to the AstroLife palm report.`, confidenceBase: 0.62, reportPriority: 68 }),
    makeMinorLineRule(cfg, { offset: 1, slug: "absent_no_overclaim", type: "modifier", tier: "free", status: "reviewed", category: "general", title: `${cfg.englishName} absent should avoid overclaim`, required: [a], meaning: `If the ${cfg.englishName} is absent or unclear, the engine should avoid strong claims from this minor line.`, hindi: `${cfg.hindiName} स्पष्ट न हो तो उससे जुड़े मजबूत निष्कर्ष नहीं देने चाहिए।`, luxury: `AstroLife could not clearly read the ${cfg.englishName}, so this theme stays low-confidence.`, confidenceBase: 0.25, severity: "low", reportPriority: 12 }),
    makeMinorLineRule(cfg, { offset: 2, slug: "related_support", title: `${cfg.englishName} with related support`, required: [v, cfg.relatedSupport], meaning: `The ${cfg.englishName} is supported by a related sign, increasing confidence.`, hindi: `संबंधित संकेत ${cfg.hindiName} के फल को पुष्ट करता है।`, luxury: `A related marker strengthens your ${cfg.englishName} signature.`, confidenceBase: 0.7, reportPriority: 78 }),
    makeMinorLineRule(cfg, { offset: 3, slug: "primary_support", title: `${cfg.englishName} with primary support`, required: [v, cfg.primarySupport], meaning: `A primary support marker makes the ${cfg.englishName} theme more reliable.`, hindi: `मुख्य सहायक संकेत ${cfg.hindiName} के फल को अधिक विश्वसनीय बनाता है।`, luxury: `Your ${cfg.englishName} receives strong confirmation through a primary support marker.`, confidenceBase: 0.72, reportPriority: 82 }),
    makeMinorLineRule(cfg, { offset: 4, slug: "secondary_support", title: `${cfg.englishName} with secondary support`, required: [v, cfg.secondarySupport], meaning: `A secondary support marker gives more context to the ${cfg.englishName}.`, hindi: `दूसरा सहायक संकेत ${cfg.hindiName} को अधिक संदर्भ देता है।`, luxury: `A secondary sign gives your ${cfg.englishName} theme a more grounded context.`, confidenceBase: 0.68, reportPriority: 74 }),
    makeMinorLineRule(cfg, { offset: 5, slug: "clear_head_support", title: `${cfg.englishName} with clear Head Line support`, required: [v, eq("lines.head.clarity", "clear")], category: cfg.category, meaning: `Mental clarity helps refine the ${cfg.englishName} theme.`, hindi: `स्पष्ट मस्तिष्क रेखा ${cfg.hindiName} के फल को विवेकपूर्ण दिशा देती है।`, luxury: `Your ${cfg.englishName} theme is refined by a clearer mental pattern.`, confidenceBase: 0.67, reportPriority: 70 }),
    makeMinorLineRule(cfg, { offset: 6, slug: "clear_heart_support", title: `${cfg.englishName} with clear Heart Line support`, required: [v, eq("lines.heart.clarity", "clear")], category: cfg.category === "travel" ? "travel" : "relationship", meaning: `Emotional clarity gives relational context to the ${cfg.englishName}.`, hindi: `स्पष्ट हृदय रेखा ${cfg.hindiName} को भावनात्मक संदर्भ देती है।`, luxury: `The Heart Line gives your ${cfg.englishName} theme emotional clarity.`, confidenceBase: 0.66, reportPriority: 68, guardrail: cfg.category === "travel" ? travelGuardrail : relationshipGuardrail }),
    makeMinorLineRule(cfg, { offset: 7, slug: "square_protection", type: "modifier", title: `${cfg.englishName} with square sign protection`, required: [v, eq("signs.square", true)], meaning: `A square sign can stabilize or protect the ${cfg.englishName} theme.`, hindi: `वर्ग चिन्ह ${cfg.hindiName} के फल को संरक्षण या स्थिरता दे सकता है।`, luxury: `The square marker stabilizes your ${cfg.englishName} field.`, confidenceBase: 0.62, reportPriority: 62 }),
    makeMinorLineRule(cfg, { offset: 8, slug: "island_caution", type: "modifier", title: `${cfg.englishName} with island sign caution`, required: [v, eq("signs.island", true)], riskLevel: cfg.category === "health_vitality" ? "medical_guarded" : "sensitive", meaning: `An island sign can show delay, pressure or sensitivity around the ${cfg.englishName}.`, hindi: `द्वीप चिन्ह ${cfg.hindiName} के फल में दबाव, देरी या संवेदनशीलता जोड़ सकता है।`, luxury: `The island marker asks for patience and awareness around your ${cfg.englishName} theme.`, confidenceBase: 0.56, reportPriority: 54 }),
    makeMinorLineRule(cfg, { offset: 9, slug: "star_intensity", type: "modifier", title: `${cfg.englishName} with star sign intensity`, required: [v, eq("signs.star", true)], riskLevel: "sensitive", meaning: `A star sign can intensify the ${cfg.englishName}, but should never be treated as certainty.`, hindi: `तारा चिन्ह ${cfg.hindiName} के फल को तीव्र कर सकता है, पर इसे निश्चितता नहीं मानना चाहिए।`, luxury: `The star marker intensifies your ${cfg.englishName} theme, but AstroLife keeps it probability-based.`, confidenceBase: 0.6, reportPriority: 58 }),
    makeMinorLineRule(cfg, { offset: 10, slug: "many_lines_excess", type: "modifier", title: `${cfg.englishName} with many-line background`, required: [v, eq("palm.lineDensity", "many")], riskLevel: "sensitive", meaning: `Many palm lines can add excess, restlessness or over-processing to the ${cfg.englishName}.`, hindi: `अधिक रेखाएँ ${cfg.hindiName} के फल में चंचलता या अधिक सोच जोड़ सकती हैं।`, luxury: `The many-line background makes your ${cfg.englishName} field more sensitive and high-frequency.`, confidenceBase: 0.6, reportPriority: 56 }),
    makeMinorLineRule(cfg, { offset: 11, slug: "premium_signature", title: `${cfg.englishName} premium signature`, tier: "elite", required: [v, cfg.specialSupport], meaning: `This is a stronger ${cfg.englishName} signature because the minor line is confirmed by a specific supporting marker.`, hindi: `यह ${cfg.hindiName} का उन्नत संयुक्त संकेत है।`, luxury: `This is a premium ${cfg.englishName} signature, giving this theme stronger presence in the AstroLife report.`, confidenceBase: 0.74, severity: "high", reportPriority: 88 }),
  ];
};

export const AFFECTION_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[0]);
export const CHILDREN_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[1]);
export const TRAVEL_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[2]);
export const INFLUENCE_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[3]);
export const INTUITION_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[4]);
export const MARS_MINOR_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[5]);
export const VIA_LASCIVIA_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[6]);
export const RASCETTE_LINE_RULES = createMinorLineRules(MINOR_LINE_CONFIGS[7]);

export const MINOR_LINE_RULES: PalmRule[] = [
  ...AFFECTION_LINE_RULES,
  ...CHILDREN_LINE_RULES,
  ...TRAVEL_LINE_RULES,
  ...INFLUENCE_LINE_RULES,
  ...INTUITION_LINE_RULES,
  ...MARS_MINOR_LINE_RULES,
  ...VIA_LASCIVIA_LINE_RULES,
  ...RASCETTE_LINE_RULES,
];

type SignConfig = {
  key: "island" | "cross" | "star" | "square" | "triangle" | "grille" | "fork" | "branch" | "break";
  base: number;
  englishName: string;
  hindiName: string;
  modifierMeaning: string;
  luxuryMeaning: string;
  riskLevel?: PalmRule["riskLevel"];
};

const SIGN_CONFIGS: SignConfig[] = [
  { key: "island", base: 547, englishName: "Island", hindiName: "द्वीप", modifierMeaning: "An island sign may indicate delay, pressure, sensitivity or energy drain around the area it affects.", luxuryMeaning: "The island marker asks for patience, repair and conscious energy management.", riskLevel: "sensitive" },
  { key: "cross", base: 551, englishName: "Cross", hindiName: "क्रॉस", modifierMeaning: "A cross sign may indicate friction, conflict, interruption or karmic pressure around the affected zone.", luxuryMeaning: "The cross marker shows a friction point that needs awareness and mature handling.", riskLevel: "sensitive" },
  { key: "star", base: 555, englishName: "Star", hindiName: "तारा", modifierMeaning: "A star sign may intensify or spotlight the affected zone, but it should never be treated as guaranteed success.", luxuryMeaning: "The star marker intensifies the field, creating a high-voltage signature.", riskLevel: "sensitive" },
  { key: "square", base: 559, englishName: "Square", hindiName: "वर्ग", modifierMeaning: "A square sign is traditionally read as protection, containment or stabilization around the affected zone.", luxuryMeaning: "The square marker adds structure, protection and containment." },
  { key: "triangle", base: 563, englishName: "Triangle", hindiName: "त्रिकोण", modifierMeaning: "A triangle sign may show skill, strategy, intelligence or focused development around the affected zone.", luxuryMeaning: "The triangle marker adds skill, intelligence and designed growth." },
  { key: "grille", base: 567, englishName: "Grille", hindiName: "जाल", modifierMeaning: "A grille sign may scatter, diffuse or complicate the energy of the affected zone.", luxuryMeaning: "The grille marker asks for discipline because energy may scatter.", riskLevel: "sensitive" },
  { key: "fork", base: 571, englishName: "Fork", hindiName: "फाँक", modifierMeaning: "A fork may indicate branching, split direction, expansion or dual possibilities.", luxuryMeaning: "The fork marker opens more than one path in the affected theme." },
  { key: "branch", base: 575, englishName: "Branch", hindiName: "शाखा", modifierMeaning: "A branch may indicate growth, diversion, support or movement from the main line.", luxuryMeaning: "The branch marker shows extension, growth or a side-path opening." },
  { key: "break", base: 579, englishName: "Break", hindiName: "टूटन", modifierMeaning: "A break may indicate interruption, transition or instability in the affected theme.", luxuryMeaning: "The break marker points to a transition point, not a final outcome.", riskLevel: "sensitive" },
];

const makeSignRules = (cfg: SignConfig): PalmRule[] => {
  const sign = eq(`signs.${cfg.key}`, true);

  return [
    makeRule(`sign_${cfg.key}_core_modifier_${cfg.base}`, ["DAYANAND_SECRETS", "WRITER_LINES_III"], "western", { offset: 0, slug: "core", type: "modifier", title: `${cfg.englishName} sign core modifier`, category: "general", tier: "premium", riskLevel: cfg.riskLevel ?? "safe", required: [sign], meaning: cfg.modifierMeaning, hindi: `${cfg.hindiName} चिन्ह प्रभावित क्षेत्र के फल को बदलता या संशोधित करता है।`, luxury: cfg.luxuryMeaning, confidenceBase: 0.56, severity: cfg.riskLevel === "sensitive" ? "medium" : "low", reportPriority: 56 }),
    makeRule(`sign_${cfg.key}_life_line_modifier_${cfg.base + 1}`, ["DAYANAND_MASTER", "WRITER_LINES_III"], "dayanand", { offset: 1, slug: "life", type: "modifier", title: `${cfg.englishName} sign modifying Life Line`, category: "health_vitality", riskLevel: "medical_guarded", required: [sign, eq("lines.life.visible", true)], meaning: `${cfg.modifierMeaning} On Life Line themes, this must be read only as vitality/lifestyle reflection.`, hindi: `${cfg.hindiName} चिन्ह आयु रेखा के साथ जीवन-ऊर्जा के संकेत को संशोधित करता है।`, luxury: `${cfg.luxuryMeaning} On the Life Line, AstroLife reads this only as vitality-awareness.`, confidenceBase: 0.52, reportPriority: 52, guardrail: medicalGuardrail }),
    makeRule(`sign_${cfg.key}_head_line_modifier_${cfg.base + 2}`, ["DAYANAND_MASTER", "WRITER_LINES_III"], "western", { offset: 2, slug: "head", type: "modifier", title: `${cfg.englishName} sign modifying Head Line`, category: "education", riskLevel: cfg.riskLevel ?? "safe", required: [sign, eq("lines.head.visible", true)], meaning: `${cfg.modifierMeaning} On Head Line themes, this modifies thinking, focus or decision style.`, hindi: `${cfg.hindiName} चिन्ह मस्तिष्क रेखा के साथ विचार और निर्णय शैली को संशोधित करता है।`, luxury: `${cfg.luxuryMeaning} In the Head Line zone, it changes the mental pattern.`, confidenceBase: 0.54, reportPriority: 54 }),
    makeRule(`sign_${cfg.key}_heart_line_modifier_${cfg.base + 3}`, ["DAYANAND_MASTER", "WRITER_LINES_III"], "western", { offset: 3, slug: "heart", type: "modifier", title: `${cfg.englishName} sign modifying Heart Line`, category: "relationship", riskLevel: "sensitive", required: [sign, eq("lines.heart.visible", true)], meaning: `${cfg.modifierMeaning} On Heart Line themes, this modifies emotional processing and relationship tendencies.`, hindi: `${cfg.hindiName} चिन्ह हृदय रेखा के साथ भावना और संबंधों की प्रवृत्ति को संशोधित करता है।`, luxury: `${cfg.luxuryMeaning} In the Heart Line zone, it becomes an emotional-awareness marker.`, confidenceBase: 0.54, reportPriority: 54, guardrail: relationshipGuardrail }),
  ];
};

export const SIGN_MARKING_RULES: PalmRule[] = SIGN_CONFIGS.flatMap(makeSignRules);

export const REMEDY_RULES: PalmRule[] = [
  makeRule("remedy_many_lines_meditation_583", ["DAYANAND_MASTER", "FIFTY_HANDPRINTS"], "dayanand", { offset: 0, slug: "many_lines_meditation", type: "remedy", title: "Meditation remedy for many-line overthinking pattern", category: "remedy", tier: "free", required: [eq("palm.lineDensity", "many")], meaning: "Many-line sensitivity can be supported through daily quiet sitting, breath awareness and mental decluttering.", hindi: "अधिक रेखाओं की मानसिक चंचलता में ध्यान, श्वास-जागरूकता और मन की सफाई सहायक हो सकती है।", luxury: "Your palm benefits from a daily stillness ritual: breath, silence and mental decluttering.", confidenceBase: 0.62, reportPriority: 70, guardrail: remedyGuardrail }),
  makeRule("remedy_broken_head_journaling_584", ["DAYANAND_MASTER"], "dayanand", { offset: 0, slug: "broken_head_journaling", type: "remedy", title: "Journaling remedy for broken Head Line pattern", category: "remedy", tier: "free", required: [eq("lines.head.clarity", "broken")], meaning: "Decision inconsistency can be supported with journaling, written planning and slower decision windows.", hindi: "मस्तिष्क रेखा की टूटन में लेखन, योजना और निर्णय से पहले विराम सहायक हो सकते हैं।", luxury: "Your mind benefits from written clarity: journal, plan and pause before major decisions.", confidenceBase: 0.6, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_heart_broken_compassion_585", ["DAYANAND_MASTER", "WRITER_LINES_III"], "western", { offset: 0, slug: "heart_broken_compassion", type: "remedy", title: "Compassion remedy for broken Heart Line pattern", category: "remedy", tier: "free", required: [eq("lines.heart.clarity", "broken")], meaning: "Emotional inconsistency can be supported through self-compassion, honest communication and boundary clarity.", hindi: "हृदय रेखा की टूटन में आत्म-करुणा, स्पष्ट संवाद और स्वस्थ सीमाएँ सहायक हो सकती हैं।", luxury: "Your heart field asks for gentleness, honest communication and clean boundaries.", confidenceBase: 0.6, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_mars_grounding_586", ["DAYANAND_SECRETS"], "dayanand", { offset: 0, slug: "strong_mars_grounding", type: "remedy", title: "Grounding remedy for strong Mars pattern", category: "remedy", tier: "premium", required: [eq("mounts.mars.prominence", "strong")], meaning: "Strong Mars energy can be refined through physical discipline, exercise, breath control and conflict awareness.", hindi: "प्रबल मंगल ऊर्जा में व्यायाम, अनुशासन, श्वास-नियंत्रण और क्रोध-जागरूकता सहायक हो सकती है।", luxury: "Your Mars energy becomes powerful when disciplined through movement, breath and conscious response.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_moon_sleep_creativity_587", ["DAYANAND_SECRETS", "WRITER_LINES_III"], "dayanand", { offset: 0, slug: "strong_moon_sleep_creativity", type: "remedy", title: "Creative grounding remedy for strong Moon pattern", category: "remedy", tier: "premium", required: [eq("mounts.moon.prominence", "strong")], meaning: "Strong Moon energy can be supported through sleep discipline, creative expression and emotional grounding.", hindi: "प्रबल चंद्र ऊर्जा में नींद का अनुशासन, रचनात्मक अभिव्यक्ति और भावनात्मक स्थिरता सहायक हो सकती है।", luxury: "Your Moon field needs rhythm: sleep, art, water, silence and emotional grounding.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_mercury_communication_588", ["DAYANAND_SECRETS"], "dayanand", { offset: 0, slug: "strong_mercury_communication", type: "remedy", title: "Communication refinement remedy for strong Mercury pattern", category: "remedy", tier: "premium", required: [eq("mounts.mercury.prominence", "strong")], meaning: "Strong Mercury benefits from ethical communication, clear writing and mindful speech.", hindi: "प्रबल बुध में सत्य वाणी, स्पष्ट लेखन और सजग संवाद सहायक होते हैं।", luxury: "Your Mercury field becomes premium when speech is clean, written and consciously directed.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_venus_relationship_balance_589", ["DAYANAND_SECRETS"], "western", { offset: 0, slug: "strong_venus_relationship_balance", type: "remedy", title: "Relationship balance remedy for strong Venus pattern", category: "remedy", tier: "premium", required: [eq("mounts.venus.prominence", "strong")], meaning: "Strong Venus benefits from affection with boundaries, beauty with discipline and love with self-respect.", hindi: "प्रबल शुक्र में प्रेम के साथ सीमा, सौंदर्य के साथ अनुशासन और स्नेह के साथ आत्म-सम्मान सहायक है।", luxury: "Your Venus field thrives when warmth is matched with self-respect and clean boundaries.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_jupiter_humility_590", ["DAYANAND_SECRETS"], "dayanand", { offset: 0, slug: "strong_jupiter_humility", type: "remedy", title: "Humility remedy for strong Jupiter pattern", category: "remedy", tier: "premium", required: [eq("mounts.jupiter.prominence", "strong")], meaning: "Strong Jupiter benefits from humility, mentorship, service and ethical leadership.", hindi: "प्रबल गुरु में विनम्रता, सेवा, मार्गदर्शन और नैतिक नेतृत्व सहायक हैं।", luxury: "Your Jupiter field rises through dignity, humility and ethical leadership.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_saturn_routine_591", ["DAYANAND_SECRETS"], "dayanand", { offset: 0, slug: "strong_saturn_routine", type: "remedy", title: "Routine remedy for strong Saturn pattern", category: "remedy", tier: "premium", required: [eq("mounts.saturn.prominence", "strong")], meaning: "Strong Saturn benefits from routine, patience, realistic planning and avoiding isolation overload.", hindi: "प्रबल शनि में दिनचर्या, धैर्य, यथार्थ योजना और अत्यधिक एकांत से बचना सहायक है।", luxury: "Your Saturn field becomes a strength when shaped through rhythm, patience and mature structure.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_strong_sun_skill_visibility_592", ["DAYANAND_SECRETS"], "western", { offset: 0, slug: "strong_sun_skill_visibility", type: "remedy", title: "Skill refinement remedy for strong Sun pattern", category: "remedy", tier: "premium", required: [eq("mounts.sun.prominence", "strong")], meaning: "Strong Sun benefits from skill refinement, consistent creative output and humility in visibility.", hindi: "प्रबल सूर्य में कौशल-विकास, नियमित रचनात्मकता और प्रसिद्धि में विनम्रता सहायक है।", luxury: "Your Sun field shines best when talent is disciplined into consistent work.", confidenceBase: 0.62, reportPriority: 68, guardrail: remedyGuardrail }),
  makeRule("remedy_travel_lines_grounded_planning_593", ["DAYANAND_MASTER", "WRITER_LINES_III"], "dayanand", { offset: 0, slug: "travel_lines_grounded_planning", type: "remedy", title: "Grounded planning remedy for travel-line pattern", category: "remedy", tier: "premium", required: [eq("lines.travel.visible", true)], meaning: "Travel tendencies should be supported with practical planning, documentation and emotional grounding.", hindi: "यात्रा संकेतों में व्यवहारिक योजना, दस्तावेज़ व्यवस्था और भावनात्मक स्थिरता सहायक है।", luxury: "Your travel field needs planning: documents, timing, grounding and clear intention.", confidenceBase: 0.6, reportPriority: 66, guardrail: travelGuardrail }),
  makeRule("remedy_affection_line_clear_communication_594", ["DAYANAND_MASTER", "WRITER_LINES_III"], "western", { offset: 0, slug: "affection_line_clear_communication", type: "remedy", title: "Clear communication remedy for affection-line pattern", category: "remedy", tier: "premium", required: [eq("lines.affection.visible", true)], meaning: "Affection-line sensitivity is supported by honest communication and expectation clarity.", hindi: "स्नेह रेखा के संकेतों में स्पष्ट संवाद और अपेक्षाओं की साफ़ समझ सहायक है।", luxury: "Your affection field benefits from clean communication and clear emotional agreements.", confidenceBase: 0.6, reportPriority: 66, guardrail: relationshipGuardrail }),
  makeRule("remedy_via_lascivia_habit_awareness_595", ["WRITER_LINES_III"], "western", { offset: 0, slug: "via_lascivia_habit_awareness", type: "remedy", title: "Habit awareness remedy for Via Lascivia pattern", category: "remedy", tier: "elite", riskLevel: "medical_guarded", required: [eq("lines.viaLascivia.visible", true)], meaning: "Via Lascivia patterns should be handled through non-judgmental habit awareness, grounding and nervous-system care.", hindi: "विया लसिविया संकेतों में बिना दोषारोपण के आदत-जागरूकता, स्थिरता और संयम सहायक हैं।", luxury: "Your Via Lascivia pattern asks for gentle habit refinement, not shame.", confidenceBase: 0.58, reportPriority: 60, guardrail: moralGuardrail }),
  makeRule("remedy_intuition_line_silence_596", ["WRITER_LINES_III"], "western", { offset: 0, slug: "intuition_line_silence", type: "remedy", title: "Silence practice remedy for intuition-line pattern", category: "remedy", tier: "elite", required: [eq("lines.intuition.visible", true)], meaning: "Intuition-line sensitivity is supported by silence, reflection, dream journaling and emotional discernment.", hindi: "अंतर्ज्ञान रेखा में मौन, आत्म-चिंतन, स्वप्न-लेखन और भावनात्मक विवेक सहायक हैं।", luxury: "Your intuition field grows through silence, symbols, dreams and emotional discernment.", confidenceBase: 0.6, reportPriority: 64, guardrail: remedyGuardrail }),
  makeRule("remedy_grille_energy_cleanup_597", ["DAYANAND_SECRETS", "WRITER_LINES_III"], "western", { offset: 0, slug: "grille_energy_cleanup", type: "remedy", title: "Energy cleanup remedy for grille sign pattern", category: "remedy", tier: "premium", riskLevel: "sensitive", required: [eq("signs.grille", true)], meaning: "A grille sign asks for simplifying commitments, reducing scattered effort and focusing on one path at a time.", hindi: "जाल चिन्ह में बिखरी ऊर्जा को कम करना, काम सरल करना और एक दिशा पर ध्यान रखना सहायक है।", luxury: "The grille marker asks you to simplify, declutter and stop leaking energy across too many directions.", confidenceBase: 0.58, reportPriority: 60, guardrail: remedyGuardrail }),
  makeRule("remedy_square_structure_598", ["DAYANAND_SECRETS", "WRITER_LINES_III"], "western", { offset: 0, slug: "square_structure", type: "remedy", title: "Structure remedy for square sign pattern", category: "remedy", tier: "premium", required: [eq("signs.square", true)], meaning: "A square sign supports structure, protection and containment when the user creates disciplined boundaries.", hindi: "वर्ग चिन्ह में संरचना, अनुशासन और सीमाएँ संरक्षण को मजबूत कर सकती हैं।", luxury: "The square marker becomes powerful when you build structure around the relevant life area.", confidenceBase: 0.58, reportPriority: 60, guardrail: remedyGuardrail }),
  makeRule("remedy_break_transition_plan_599", ["FIFTY_HANDPRINTS", "WRITER_LINES_III"], "dayanand", { offset: 0, slug: "break_transition_plan", type: "remedy", title: "Transition planning remedy for break sign pattern", category: "remedy", tier: "premium", riskLevel: "sensitive", required: [eq("signs.break", true)], meaning: "A break marker should be handled with transition planning, patience and stepwise change.", hindi: "टूटन चिन्ह में धैर्य, क्रमिक परिवर्तन और योजना सहायक हो सकती है।", luxury: "The break marker is not an ending; it asks for conscious transition planning.", confidenceBase: 0.56, reportPriority: 58, guardrail: remedyGuardrail }),
  makeRule("remedy_overclaim_prevention_600", ["FIFTY_HANDPRINTS", "DAYANAND_MASTER"], "dayanand", { offset: 0, slug: "overclaim_prevention", type: "contradiction", title: "Overclaim prevention for unclear minor lines and signs", category: "general", tier: "free", status: "active", required: [eq("lines.affection.visible", false), eq("lines.travel.visible", false), eq("lines.intuition.visible", false)], meaning: "If minor lines are not visible, the engine should avoid strong predictions from minor-line symbolism.", hindi: "छोटी रेखाएँ स्पष्ट न हों तो उनसे जुड़े मजबूत फलादेश नहीं करने चाहिए।", luxury: "AstroLife keeps the minor-line layer conservative because key minor lines are not clearly visible.", confidenceBase: 0.25, severity: "low", reportPriority: 10, guardrail: "This rule prevents overclaiming when minor-line evidence is missing." }),
];

export const PHASE3A_BATCH4_MINOR_SIGN_REMEDY_RULES: PalmRule[] = [
  ...MINOR_LINE_RULES,
  ...SIGN_MARKING_RULES,
  ...REMEDY_RULES,
];

export const PHASE3A_BATCH4_MINOR_SIGN_REMEDY_RULE_COUNT = PHASE3A_BATCH4_MINOR_SIGN_REMEDY_RULES.length;
