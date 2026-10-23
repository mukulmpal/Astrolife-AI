import type { PalmCondition, PalmRule } from "../../types";

const medicalGuardrail = "This is not a medical diagnosis. Use only as vitality/lifestyle reflection.";
const lifeGuardrail = "Do not predict lifespan, death age or fatal events. Read the Life Line only as vitality, resilience, family/environment and life-force tendency.";
const relationshipGuardrail = "Do not guarantee marriage, divorce, childbirth or relationship outcome. Present only as emotional or relational tendency.";
const careerGuardrail = "Do not guarantee career success, job outcome, wealth or status. Present only as career tendency and confidence-scored potential.";
const fameGuardrail = "Do not guarantee fame or public success. Present this only as creative visibility or recognition potential.";
const mercuryGuardrail = "Do not diagnose disease from the Mercury/Health Line. Use communication, business, adaptability and vitality-safe wording only.";
const travelGuardrail = "Do not guarantee foreign settlement or travel. Present this only as a traditional tendency when supported by multiple signs.";

const eq = (feature: string, value: string | number | boolean): PalmCondition => ({
  feature,
  operator: "equals",
  value,
});

type MajorLineKey = "life" | "head" | "heart" | "saturn" | "sun" | "mercury";

type MajorLineConfig = {
  key: MajorLineKey;
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
  qualityRequired: PalmCondition[];
  cautionRequired: PalmCondition[];
  relatedMount: PalmCondition;
  relatedFingerOrThumb: PalmCondition;
  supportLine: PalmCondition;
  specialCondition: PalmCondition;
  specialCategory: PalmRule["category"];
  signatureCondition: PalmCondition;
  signatureMeaning: string;
  specialGuardrail?: string;
};

type MajorLineRuleInput = {
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

const defaultGuardrail = (key: MajorLineKey, category: PalmRule["category"], riskLevel: PalmRule["riskLevel"]) => {
  if (key === "life") return lifeGuardrail;
  if (key === "mercury") return mercuryGuardrail;
  if (riskLevel === "medical_guarded") return medicalGuardrail;
  if (category === "relationship") return relationshipGuardrail;
  if (category === "career" || category === "wealth") return careerGuardrail;
  if (category === "fame") return fameGuardrail;
  if (category === "travel") return travelGuardrail;
  return undefined;
};

const makeMajorLineRule = (cfg: MajorLineConfig, input: MajorLineRuleInput): PalmRule => {
  const category = input.category ?? cfg.category;
  const riskLevel = input.riskLevel ?? (category === "health_vitality" ? "medical_guarded" : "safe");

  return {
    id: `line_${cfg.key}_${input.slug}_${cfg.base + input.offset}`,
    type: input.type ?? "combination",
    title: input.title,
    sourceIds: cfg.sourceIds,
    sourceNotes:
      "Major-line rule derived from classical palmistry line reading. Major lines must be interpreted with mounts, fingers, thumb, signs, image quality and other palm features, not in isolation.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: cfg.tradition,
    category,
    tier: input.tier ?? "premium",
    status: input.status ?? "active",
    riskLevel,
    required: input.required,
    supporting: input.supporting ?? [],
    contradicting: input.contradicting ?? [],
    interpretation: {
      classical: `${input.hindi} इसे अन्य पर्वतों, उंगलियों, चिह्नों और रेखाओं के साथ मिलाकर पढ़ना चाहिए।`,
      scientific: `${input.meaning} This is a tendency-based interpretation and should be weighed with supporting and contradicting features.`,
      luxury: input.luxury,
    },
    confidenceBase: input.confidenceBase,
    severity: input.severity ?? "medium",
    reportPriority: input.reportPriority,
    guardrail: input.guardrail ?? defaultGuardrail(cfg.key, category, riskLevel),
  };
};

const visible = (cfg: MajorLineConfig) => eq(`${cfg.path}.visible`, true);
const absent = (cfg: MajorLineConfig) => eq(`${cfg.path}.visible`, false);

const MAJOR_LINE_CONFIGS: MajorLineConfig[] = [
  {
    key: "life",
    base: 301,
    path: "lines.life",
    englishName: "Life Line",
    hindiName: "आयु रेखा",
    tradition: "dayanand",
    category: "health_vitality",
    sourceIds: ["DAYANAND_MASTER", "DAYANAND_SECRETS", "WRITER_LINES_III"],
    coreTheme: "vitality, resilience, family environment and life-force",
    coreMeaning: "The Life Line is read as vitality, resilience, environmental support and life-force tendency, not exact lifespan.",
    classicalCore: "आयु रेखा जीवन-शक्ति, सहनशक्ति, पारिवारिक वातावरण और जीवन-ऊर्जा का संकेत देती है।",
    qualityRequired: [eq("lines.life.visible", true), eq("lines.life.depth", "deep"), eq("lines.life.clarity", "clear")],
    cautionRequired: [eq("lines.life.visible", true), eq("lines.life.clarity", "broken")],
    relatedMount: eq("mounts.venus.prominence", "strong"),
    relatedFingerOrThumb: eq("thumb.firstPhalange", "long"),
    supportLine: eq("lines.head.clarity", "clear"),
    specialCondition: eq("lines.life.forkDirection", "moon"),
    specialCategory: "travel",
    signatureCondition: eq("lines.life.endFork", true),
    signatureMeaning: "A Life Line fork becomes meaningful only when direction and supporting signs are also checked.",
    specialGuardrail: travelGuardrail,
  },
  {
    key: "head",
    base: 325,
    path: "lines.head",
    englishName: "Head Line",
    hindiName: "मस्तिष्क रेखा",
    tradition: "western",
    category: "education",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "mind, judgement, decision style, imagination and thinking pattern",
    coreMeaning: "The Head Line is read as mental clarity, judgement, learning style and imagination.",
    classicalCore: "मस्तिष्क रेखा विचार-शक्ति, निर्णय, बुद्धि और कल्पना का संकेत देती है।",
    qualityRequired: [eq("lines.head.visible", true), eq("lines.head.clarity", "clear")],
    cautionRequired: [eq("lines.head.visible", true), eq("lines.head.clarity", "broken")],
    relatedMount: eq("mounts.mercury.prominence", "strong"),
    relatedFingerOrThumb: eq("thumb.secondPhalange", "long"),
    supportLine: eq("lines.life.depth", "deep"),
    specialCondition: eq("lines.head.direction", "moon"),
    specialCategory: "spirituality",
    signatureCondition: eq("lines.head.direction", "straight"),
    signatureMeaning: "A straight Head Line supports practical judgement; a Moon direction supports imagination.",
  },
  {
    key: "heart",
    base: 349,
    path: "lines.heart",
    englishName: "Heart Line",
    hindiName: "हृदय रेखा",
    tradition: "western",
    category: "relationship",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "emotion, affection, love style and relational expectations",
    coreMeaning: "The Heart Line is read as emotional style, affection and relationship expectations.",
    classicalCore: "हृदय रेखा प्रेम, भावना, स्नेह और संबंधों की अपेक्षाओं का संकेत देती है।",
    qualityRequired: [eq("lines.heart.visible", true), eq("lines.heart.clarity", "clear")],
    cautionRequired: [eq("lines.heart.visible", true), eq("lines.heart.clarity", "broken")],
    relatedMount: eq("mounts.venus.prominence", "strong"),
    relatedFingerOrThumb: eq("thumb.length", "long"),
    supportLine: eq("lines.head.clarity", "clear"),
    specialCondition: eq("lines.heart.ending", "jupiter"),
    specialCategory: "relationship",
    signatureCondition: eq("lines.heart.ending", "between_jupiter_saturn"),
    signatureMeaning: "Heart Line ending modifies emotional style and love expectations.",
    specialGuardrail: relationshipGuardrail,
  },
  {
    key: "saturn",
    base: 373,
    path: "lines.saturn",
    englishName: "Fate/Saturn Line",
    hindiName: "शनि/भाग्य रेखा",
    tradition: "dayanand",
    category: "career",
    sourceIds: ["DAYANAND_MASTER", "DAYANAND_SECRETS", "WRITER_LINES_III"],
    coreTheme: "career direction, worldly duties, responsibility and life structure",
    coreMeaning: "The Fate/Saturn Line is read as career direction, responsibility and worldly structure.",
    classicalCore: "शनि/भाग्य रेखा कर्म, करियर दिशा, जिम्मेदारी और सांसारिक व्यवस्था का संकेत देती है।",
    qualityRequired: [eq("lines.saturn.visible", true), eq("mounts.saturn.prominence", "strong")],
    cautionRequired: [eq("lines.saturn.visible", true), eq("signs.break", true)],
    relatedMount: eq("mounts.saturn.prominence", "strong"),
    relatedFingerOrThumb: eq("fingers.length", "long"),
    supportLine: eq("lines.head.clarity", "clear"),
    specialCondition: eq("mounts.jupiter.prominence", "strong"),
    specialCategory: "career",
    signatureCondition: eq("lines.sun.visible", true),
    signatureMeaning: "Fate Line with Sun Line links career direction with recognition potential.",
    specialGuardrail: careerGuardrail,
  },
  {
    key: "sun",
    base: 397,
    path: "lines.sun",
    englishName: "Sun/Apollo Line",
    hindiName: "सूर्य रेखा",
    tradition: "western",
    category: "fame",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "recognition, creativity, reputation and public visibility",
    coreMeaning: "The Sun/Apollo Line is read as creative visibility, recognition and reputation potential.",
    classicalCore: "सूर्य रेखा यश, कला, अभिव्यक्ति और सार्वजनिक पहचान का संकेत देती है।",
    qualityRequired: [eq("lines.sun.visible", true), eq("mounts.sun.prominence", "strong")],
    cautionRequired: [eq("lines.sun.visible", true), eq("signs.grille", true)],
    relatedMount: eq("mounts.sun.prominence", "strong"),
    relatedFingerOrThumb: eq("fingers.ringRelative", "long"),
    supportLine: eq("lines.head.clarity", "clear"),
    specialCondition: eq("fingers.tips", "conic"),
    specialCategory: "fame",
    signatureCondition: eq("lines.saturn.visible", true),
    signatureMeaning: "Sun Line with Fate Line connects recognition with career direction.",
    specialGuardrail: fameGuardrail,
  },
  {
    key: "mercury",
    base: 421,
    path: "lines.mercury",
    englishName: "Mercury Line",
    hindiName: "बुध रेखा",
    tradition: "dayanand",
    category: "career",
    sourceIds: ["DAYANAND_MASTER", "DAYANAND_SECRETS", "WRITER_LINES_III"],
    coreTheme: "communication, business, adaptability and vitality-safe sensitivity",
    coreMeaning: "The Mercury Line is read through communication, business, adaptability and vitality-safe tendencies, not diagnosis.",
    classicalCore: "बुध रेखा वाणी, व्यापार, व्यवहार-बुद्धि और जीवनशैली-संवेदनशीलता का संकेत देती है।",
    qualityRequired: [eq("lines.mercury.visible", true), eq("mounts.mercury.prominence", "strong")],
    cautionRequired: [eq("lines.mercury.visible", true), eq("signs.island", true)],
    relatedMount: eq("mounts.mercury.prominence", "strong"),
    relatedFingerOrThumb: eq("fingers.littleRelative", "long"),
    supportLine: eq("thumb.secondPhalange", "long"),
    specialCondition: eq("lines.head.clarity", "clear"),
    specialCategory: "career",
    signatureCondition: eq("lines.saturn.visible", true),
    signatureMeaning: "Mercury Line with Fate Line links communication/business skill with career direction.",
    specialGuardrail: mercuryGuardrail,
  },
];

const createMajorLineRules = (cfg: MajorLineConfig): PalmRule[] => {
  const lineVisible = visible(cfg);
  const lineAbsent = absent(cfg);

  return [
    makeMajorLineRule(cfg, { offset: 0, slug: "visible_core", type: "atomic", tier: "free", title: `${cfg.englishName} visible core meaning`, category: cfg.category, required: [lineVisible], meaning: cfg.coreMeaning, hindi: cfg.classicalCore, luxury: `Your ${cfg.englishName} is visible, bringing ${cfg.coreTheme} into the AstroLife reading.`, confidenceBase: 0.64, reportPriority: 74 }),
    makeMajorLineRule(cfg, { offset: 1, slug: "absent_no_overclaim", type: "modifier", tier: "free", status: "reviewed", title: `${cfg.englishName} absent should avoid overclaim`, category: "general", required: [lineAbsent], meaning: `If the ${cfg.englishName} is absent or not visible, the engine should avoid strong claims from this line.`, hindi: `${cfg.hindiName} स्पष्ट न हो तो उससे जुड़े मजबूत निष्कर्ष नहीं देने चाहिए।`, luxury: `AstroLife could not clearly read the ${cfg.englishName}, so this section stays low-confidence.`, confidenceBase: 0.28, severity: "low", reportPriority: 18 }),
    makeMajorLineRule(cfg, { offset: 2, slug: "quality_high", title: `${cfg.englishName} with high quality indication`, required: cfg.qualityRequired, category: cfg.category, meaning: `A clear or well-supported ${cfg.englishName} strengthens ${cfg.coreTheme}.`, hindi: `स्पष्ट ${cfg.hindiName} ${cfg.coreTheme} को मजबूत करती है।`, luxury: `Your ${cfg.englishName} has a stronger quality marker, making this theme more reliable.`, confidenceBase: 0.73, reportPriority: 84 }),
    makeMajorLineRule(cfg, { offset: 3, slug: "caution_marker", type: "modifier", title: `${cfg.englishName} with caution marker`, required: cfg.cautionRequired, category: cfg.category, riskLevel: cfg.category === "health_vitality" ? "medical_guarded" : "sensitive", meaning: `A caution marker on or around the ${cfg.englishName} may show interruption, pressure or inconsistency in its theme.`, hindi: `${cfg.hindiName} पर सावधानी-चिन्ह उसके फल में रुकावट, दबाव या अस्थिरता जोड़ सकता है।`, luxury: `Your ${cfg.englishName} is active, but the caution marker asks for grounded interpretation.`, confidenceBase: 0.62, reportPriority: 64 }),
    makeMajorLineRule(cfg, { offset: 4, slug: "long_thumb_support", title: `${cfg.englishName} with long thumb support`, required: [lineVisible, eq("thumb.length", "long")], category: cfg.category, meaning: `The ${cfg.englishName} is supported by judgement and self-command from the long thumb.`, hindi: `${cfg.hindiName} को लंबे अंगूठे की विवेक-शक्ति और नियंत्रण का सहयोग मिलता है।`, luxury: `The long thumb gives conscious command to the ${cfg.englishName} theme.`, confidenceBase: 0.7, reportPriority: 78 }),
    makeMajorLineRule(cfg, { offset: 5, slug: "clear_head_support", title: `${cfg.englishName} with clear mental support`, required: [lineVisible, eq("lines.head.clarity", "clear")], category: cfg.key === "head" ? "education" : cfg.category, meaning: `Mental clarity supports the expression of the ${cfg.englishName}.`, hindi: `स्पष्ट मस्तिष्क रेखा ${cfg.hindiName} के फल को विवेकपूर्ण दिशा देती है।`, luxury: `Your ${cfg.englishName} theme is supported by clearer thinking and judgement.`, confidenceBase: 0.71, reportPriority: 78 }),
    makeMajorLineRule(cfg, { offset: 6, slug: "related_mount_support", title: `${cfg.englishName} with related mount support`, required: [lineVisible, cfg.relatedMount], category: cfg.category, meaning: `The related mount reinforces the ${cfg.englishName} and makes the theme stronger.`, hindi: `संबंधित पर्वत ${cfg.hindiName} के फल को मजबूत करता है।`, luxury: `The related mount powers up your ${cfg.englishName} signature.`, confidenceBase: 0.74, reportPriority: 86 }),
    makeMajorLineRule(cfg, { offset: 7, slug: "related_finger_thumb_support", title: `${cfg.englishName} with related finger/thumb support`, required: [lineVisible, cfg.relatedFingerOrThumb], category: cfg.category, meaning: `The related finger or thumb feature confirms the line theme and raises confidence.`, hindi: `संबंधित उंगली/अंगूठा ${cfg.hindiName} के फल को पुष्ट करता है।`, luxury: `A supporting finger/thumb marker confirms the ${cfg.englishName} theme.`, confidenceBase: 0.74, reportPriority: 86 }),
    makeMajorLineRule(cfg, { offset: 8, slug: "support_line", title: `${cfg.englishName} with supporting line`, required: [lineVisible, cfg.supportLine], category: cfg.category, meaning: `A supporting line confirms the ${cfg.englishName} theme in a more practical way.`, hindi: `सहायक रेखा ${cfg.hindiName} के संकेत को अधिक व्यावहारिक बनाती है।`, luxury: `Another line supports your ${cfg.englishName}, making the reading more grounded.`, confidenceBase: 0.72, reportPriority: 82 }),
    makeMajorLineRule(cfg, { offset: 9, slug: "square_protection", type: "modifier", title: `${cfg.englishName} with square sign protection`, required: [lineVisible, eq("signs.square", true)], category: cfg.category, meaning: `A square sign is traditionally treated as a protective or stabilizing modifier around the ${cfg.englishName}.`, hindi: `${cfg.hindiName} के साथ वर्ग चिन्ह संरक्षण या स्थिरता दे सकता है।`, luxury: `The square marker stabilizes the ${cfg.englishName} theme and adds protection.`, confidenceBase: 0.66, reportPriority: 68 }),
    makeMajorLineRule(cfg, { offset: 10, slug: "star_intensity", type: "modifier", title: `${cfg.englishName} with star sign intensity`, required: [lineVisible, eq("signs.star", true)], category: cfg.category, riskLevel: "sensitive", meaning: `A star sign may intensify the ${cfg.englishName} theme, but it must not be treated as certainty.`, hindi: `${cfg.hindiName} के साथ तारा चिन्ह उसके फल को तीव्र कर सकता है, पर निश्चितता नहीं देता।`, luxury: `The star marker intensifies your ${cfg.englishName}, but AstroLife keeps it probability-based.`, confidenceBase: 0.65, reportPriority: 68 }),
    makeMajorLineRule(cfg, { offset: 11, slug: "grille_scatter", type: "modifier", title: `${cfg.englishName} with grille sign scatter`, required: [lineVisible, eq("signs.grille", true)], category: cfg.category, riskLevel: "sensitive", meaning: `A grille sign may scatter or complicate the expression of the ${cfg.englishName}.`, hindi: `${cfg.hindiName} के साथ जाल/ग्रिल चिन्ह बिखराव या उलझन जोड़ सकता है।`, luxury: `The grille marker asks for discipline and refinement around the ${cfg.englishName} theme.`, confidenceBase: 0.6, reportPriority: 58 }),
    makeMajorLineRule(cfg, { offset: 12, slug: "break_interruption", type: "modifier", title: `${cfg.englishName} with break sign interruption`, required: [lineVisible, eq("signs.break", true)], category: cfg.category, riskLevel: "sensitive", meaning: `A break sign may show interruption, transition or inconsistency in the ${cfg.englishName} theme.`, hindi: `${cfg.hindiName} के साथ टूटन रुकावट, परिवर्तन या अस्थिरता दिखा सकती है।`, luxury: `The break marker suggests a transition point in your ${cfg.englishName} field.`, confidenceBase: 0.61, reportPriority: 60 }),
    makeMajorLineRule(cfg, { offset: 13, slug: "island_pressure", type: "modifier", title: `${cfg.englishName} with island sign pressure`, required: [lineVisible, eq("signs.island", true)], category: cfg.category, riskLevel: cfg.category === "health_vitality" ? "medical_guarded" : "sensitive", meaning: `An island sign may show pressure, delay or energy drain around the ${cfg.englishName} theme.`, hindi: `${cfg.hindiName} के साथ द्वीप चिन्ह दबाव, देरी या ऊर्जा-क्षय दिखा सकता है।`, luxury: `The island marker asks for patience and correction around the ${cfg.englishName} theme.`, confidenceBase: 0.58, reportPriority: 56 }),
    makeMajorLineRule(cfg, { offset: 14, slug: "fork_branch_expansion", type: "modifier", title: `${cfg.englishName} with fork or branch expansion`, required: [lineVisible, eq("signs.branch", true)], category: cfg.category, meaning: `A branch sign may show expansion, diversion or branching of the ${cfg.englishName} theme.`, hindi: `${cfg.hindiName} के साथ शाखा चिन्ह विस्तार या दिशा-विभाजन दिखा सकता है।`, luxury: `The branch marker shows that the ${cfg.englishName} energy may express through more than one path.`, confidenceBase: 0.62, reportPriority: 62 }),
    makeMajorLineRule(cfg, { offset: 15, slug: "many_lines_excess", type: "modifier", title: `${cfg.englishName} with many-line background`, required: [lineVisible, eq("palm.lineDensity", "many")], category: cfg.category, riskLevel: "sensitive", meaning: `A dense palm background may create over-processing or excess around the ${cfg.englishName} theme.`, hindi: `अधिक रेखाएँ ${cfg.hindiName} के फल में चंचलता या अधिक सोच जोड़ सकती हैं।`, luxury: `The many-line background makes your ${cfg.englishName} theme more sensitive and high-frequency.`, confidenceBase: 0.62, reportPriority: 60 }),
    makeMajorLineRule(cfg, { offset: 16, slug: "few_lines_focus", type: "modifier", title: `${cfg.englishName} with few-line background`, required: [lineVisible, eq("palm.lineDensity", "few")], category: cfg.category, meaning: `A few-line background may make the ${cfg.englishName} theme simpler, more focused and less scattered.`, hindi: `कम रेखाएँ ${cfg.hindiName} के फल को सरल और केंद्रित बनाती हैं।`, luxury: `The few-line background gives your ${cfg.englishName} theme cleaner focus.`, confidenceBase: 0.64, reportPriority: 62 }),
    makeMajorLineRule(cfg, { offset: 17, slug: "deep_life_vitality_support", title: `${cfg.englishName} with deep Life Line vitality support`, required: [lineVisible, eq("lines.life.depth", "deep")], category: cfg.key === "life" ? "health_vitality" : cfg.category, riskLevel: cfg.key === "life" ? "medical_guarded" : "safe", meaning: `A deep Life Line adds stamina and resilience support to the ${cfg.englishName} theme.`, hindi: `गहरी आयु रेखा ${cfg.hindiName} के फल को ऊर्जा और स्थिरता देती है।`, luxury: `The deep Life Line gives vitality support to your ${cfg.englishName} theme.`, confidenceBase: 0.68, reportPriority: 66 }),
    makeMajorLineRule(cfg, { offset: 18, slug: "career_link", title: `${cfg.englishName} with career direction link`, required: [lineVisible, eq("lines.saturn.visible", true)], category: "career", meaning: `The ${cfg.englishName} connects with career direction when the Fate/Saturn Line is also visible.`, hindi: `${cfg.hindiName} शनि/भाग्य रेखा के साथ करियर दिशा से जुड़ती है।`, luxury: `Your ${cfg.englishName} theme connects with the path of work and responsibility.`, confidenceBase: 0.68, reportPriority: 68, guardrail: careerGuardrail }),
    makeMajorLineRule(cfg, { offset: 19, slug: "relationship_link", title: `${cfg.englishName} with Heart Line link`, required: [lineVisible, eq("lines.heart.clarity", "clear")], category: "relationship", meaning: `The ${cfg.englishName} receives emotional context when the Heart Line is clear.`, hindi: `स्पष्ट हृदय रेखा ${cfg.hindiName} को भावनात्मक संदर्भ देती है।`, luxury: `Your ${cfg.englishName} theme interacts with emotional clarity and relational intelligence.`, confidenceBase: 0.66, reportPriority: 64, guardrail: relationshipGuardrail }),
    makeMajorLineRule(cfg, { offset: 20, slug: "moon_travel_creativity_link", title: `${cfg.englishName} with Moon/travel link`, required: [lineVisible, eq("mounts.moon.prominence", "strong")], category: cfg.key === "life" || cfg.key === "head" ? "travel" : "spirituality", meaning: `The ${cfg.englishName} connects with imagination, travel pull or inner sensitivity through the Moon mount.`, hindi: `चंद्र पर्वत ${cfg.hindiName} को कल्पना, यात्रा या अंतर्ज्ञान से जोड़ता है।`, luxury: `Your ${cfg.englishName} theme opens toward the Moon field of imagination and movement.`, confidenceBase: 0.66, reportPriority: 64, guardrail: cfg.key === "life" ? travelGuardrail : undefined }),
    makeMajorLineRule(cfg, { offset: 21, slug: "contradiction_broken_head", type: "contradiction", title: `${cfg.englishName} weakened by broken Head Line`, required: [lineVisible, eq("lines.head.clarity", "broken")], category: cfg.category, riskLevel: "sensitive", meaning: `The ${cfg.englishName} is visible, but a broken Head Line may reduce consistency, planning or mental steadiness around its theme.`, hindi: `मस्तिष्क रेखा की टूटन ${cfg.hindiName} के फल में निर्णय या निरंतरता की कमी जोड़ सकती है।`, luxury: `Your ${cfg.englishName} is active, but decision discipline is needed before major moves.`, confidenceBase: 0.6, reportPriority: 58 }),
    makeMajorLineRule(cfg, { offset: 22, slug: "special_condition", title: `${cfg.englishName} special condition`, required: [lineVisible, cfg.specialCondition], category: cfg.specialCategory, meaning: `A special condition modifies the ${cfg.englishName} and gives it a more specific expression.`, hindi: `विशेष संकेत ${cfg.hindiName} के फल को अधिक विशिष्ट दिशा देता है।`, luxury: `A special marker gives your ${cfg.englishName} a more precise AstroLife signature.`, confidenceBase: 0.72, reportPriority: 84, guardrail: cfg.specialGuardrail }),
    makeMajorLineRule(cfg, { offset: 23, slug: "premium_signature", title: `${cfg.englishName} premium signature`, required: [lineVisible, cfg.signatureCondition], category: cfg.category, tier: "elite", meaning: cfg.signatureMeaning, hindi: `यह ${cfg.hindiName} का उन्नत संयुक्त संकेत है।`, luxury: `This is a premium ${cfg.englishName} signature: ${cfg.signatureMeaning}`, confidenceBase: 0.76, severity: "high", reportPriority: 90 }),
  ];
};

export const BATCH3_LIFE_LINE_RULES = createMajorLineRules(MAJOR_LINE_CONFIGS[0]);
export const BATCH3_HEAD_LINE_RULES = createMajorLineRules(MAJOR_LINE_CONFIGS[1]);
export const BATCH3_HEART_LINE_RULES = createMajorLineRules(MAJOR_LINE_CONFIGS[2]);
export const BATCH3_FATE_SATURN_LINE_RULES = createMajorLineRules(MAJOR_LINE_CONFIGS[3]);
export const BATCH3_SUN_APOLLO_LINE_RULES = createMajorLineRules(MAJOR_LINE_CONFIGS[4]);
export const BATCH3_MERCURY_LINE_RULES = createMajorLineRules(MAJOR_LINE_CONFIGS[5]);

export const BATCH3_MAJOR_LINE_COMBINATION_RULES: PalmRule[] = [
  {
    id: "major_lines_three_main_clear_445",
    type: "combination",
    title: "Three main lines clear: Life, Head and Heart",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    sourceNotes: "Life, Head and Heart lines are the three core lines and should be read together for a balanced foundation.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: "dayanand",
    category: "general",
    tier: "premium",
    status: "active",
    riskLevel: "safe",
    required: [eq("lines.life.clarity", "clear"), eq("lines.head.clarity", "clear"), eq("lines.heart.clarity", "clear")],
    supporting: [eq("palm.lineDensity", "balanced")],
    contradicting: [],
    interpretation: {
      classical: "आयु, मस्तिष्क और हृदय रेखा का स्पष्ट होना जीवन-ऊर्जा, विचार और भावना में संतुलन दिखाता है।",
      scientific: "Clear Life, Head and Heart lines together suggest a stronger basic balance between vitality, thinking and emotion.",
      luxury: "Your three core lines form a clean foundation: vitality, mind and emotion are all readable with stronger confidence.",
    },
    confidenceBase: 0.8,
    severity: "high",
    reportPriority: 96,
  },
  {
    id: "major_lines_career_visibility_combo_446",
    type: "combination",
    title: "Career visibility combo: Fate, Sun and Mercury lines",
    sourceIds: ["DAYANAND_MASTER", "DAYANAND_SECRETS", "WRITER_LINES_III"],
    sourceNotes: "Fate/Saturn, Sun and Mercury lines combine career direction, recognition and communication/business themes.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: "dayanand",
    category: "career",
    tier: "elite",
    status: "active",
    riskLevel: "safe",
    required: [eq("lines.saturn.visible", true), eq("lines.sun.visible", true), eq("lines.mercury.visible", true)],
    supporting: [eq("lines.head.clarity", "clear"), eq("mounts.jupiter.prominence", "strong")],
    contradicting: [],
    interpretation: {
      classical: "शनि, सूर्य और बुध रेखाएँ मिलकर करियर दिशा, यश और वाणी/व्यापार की शक्ति दिखाती हैं।",
      scientific: "Fate, Sun and Mercury lines together form a career-visibility pattern involving direction, recognition and communication.",
      luxury: "This is a premium AstroLife career signature: direction, visibility and communication moving together.",
    },
    confidenceBase: 0.8,
    severity: "high",
    reportPriority: 96,
    guardrail: careerGuardrail,
  },
  {
    id: "major_lines_emotional_mind_balance_447",
    type: "combination",
    title: "Emotional-mind balance: clear Head and Heart lines",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    sourceNotes: "Head and Heart lines together describe the relationship between thought and feeling.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: "western",
    category: "relationship",
    tier: "premium",
    status: "active",
    riskLevel: "safe",
    required: [eq("lines.head.clarity", "clear"), eq("lines.heart.clarity", "clear")],
    supporting: [eq("thumb.length", "long")],
    contradicting: [],
    interpretation: {
      classical: "स्पष्ट मस्तिष्क और हृदय रेखा विचार और भावना के संतुलन का संकेत देती हैं।",
      scientific: "Clear Head and Heart lines together suggest better balance between reasoning and emotional processing.",
      luxury: "Your mind and heart lines speak clearly together; reason and feeling can cooperate when you stay aware.",
    },
    confidenceBase: 0.76,
    severity: "medium",
    reportPriority: 88,
    guardrail: relationshipGuardrail,
  },
  {
    id: "major_lines_travel_imagination_combo_448",
    type: "combination",
    title: "Travel-imagination combo: Life fork, Moon Head direction and Travel line",
    sourceIds: ["DAYANAND_MASTER", "WRITER_LINES_III"],
    sourceNotes: "Life Line fork toward Moon, Head Line direction toward Moon and travel lines together strengthen travel or relocation tendency.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: "dayanand",
    category: "travel",
    tier: "elite",
    status: "active",
    riskLevel: "safe",
    required: [eq("lines.life.endFork", true), eq("lines.life.forkDirection", "moon"), eq("lines.head.direction", "moon"), eq("lines.travel.visible", true)],
    supporting: [eq("mounts.moon.prominence", "strong")],
    contradicting: [],
    interpretation: {
      classical: "आयु रेखा का चंद्र की ओर फटना, मस्तिष्क रेखा का चंद्र की ओर जाना और यात्रा रेखा मिलकर दूरस्थान/यात्रा की प्रवृत्ति बढ़ाते हैं।",
      scientific: "Life Line fork to Moon, Head Line toward Moon and visible travel lines together strengthen the travel/relocation tendency.",
      luxury: "This is a strong movement signature: your palm opens toward the Moon field of distance, imagination and relocation possibilities.",
    },
    confidenceBase: 0.78,
    severity: "high",
    reportPriority: 92,
    guardrail: travelGuardrail,
  },
  {
    id: "major_lines_sensitive_vitality_combo_449",
    type: "combination",
    title: "Sensitive vitality combo: Life Line, Mercury Line and many lines",
    sourceIds: ["DAYANAND_MASTER", "DAYANAND_SECRETS", "WRITER_LINES_III"],
    sourceNotes: "Life Line and Mercury Line can be used for vitality/lifestyle reflection only, not medical diagnosis.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: "dayanand",
    category: "health_vitality",
    tier: "premium",
    status: "active",
    riskLevel: "medical_guarded",
    required: [eq("lines.life.visible", true), eq("lines.mercury.visible", true), eq("palm.lineDensity", "many")],
    supporting: [eq("lines.head.clarity", "broken")],
    contradicting: [],
    interpretation: {
      classical: "आयु रेखा, बुध रेखा और अधिक रेखाएँ मिलकर जीवनशैली-संवेदनशीलता और मानसिक दबाव का संकेत दे सकती हैं।",
      scientific: "Life Line, Mercury Line and dense line pattern together may suggest vitality/stress sensitivity. This is not a medical diagnosis.",
      luxury: "Your palm carries a sensitive vitality pattern. AstroLife reads this as a lifestyle-awareness signal, not a diagnosis.",
    },
    confidenceBase: 0.66,
    severity: "medium",
    reportPriority: 72,
    guardrail: medicalGuardrail,
  },
  {
    id: "major_lines_overclaim_prevention_combo_450",
    type: "contradiction",
    title: "Major line overclaim prevention",
    sourceIds: ["FIFTY_HANDPRINTS", "DAYANAND_MASTER"],
    sourceNotes: "Practical palmistry warns against simplistic one-line predictions. This rule reduces overclaiming when major signs are missing or unclear.",
    pageRef: "Phase 3A Batch 3 major-line rule inventory",
    tradition: "dayanand",
    category: "general",
    tier: "free",
    status: "active",
    riskLevel: "safe",
    required: [eq("lines.life.visible", false), eq("lines.head.visible", false), eq("lines.heart.visible", false)],
    supporting: [],
    contradicting: [],
    interpretation: {
      classical: "मुख्य रेखाएँ स्पष्ट न हों तो मजबूत फलादेश नहीं करना चाहिए।",
      scientific: "If the three main lines are not visible, the engine should avoid strong interpretation and request a clearer image or manual confirmation.",
      luxury: "AstroLife cannot confidently read the three core lines, so this report should stay conservative and ask for a clearer palm image.",
    },
    confidenceBase: 0.25,
    severity: "low",
    reportPriority: 10,
  },
];

export const PHASE3A_BATCH3_MAJOR_LINE_RULES: PalmRule[] = [
  ...BATCH3_LIFE_LINE_RULES,
  ...BATCH3_HEAD_LINE_RULES,
  ...BATCH3_HEART_LINE_RULES,
  ...BATCH3_FATE_SATURN_LINE_RULES,
  ...BATCH3_SUN_APOLLO_LINE_RULES,
  ...BATCH3_MERCURY_LINE_RULES,
  ...BATCH3_MAJOR_LINE_COMBINATION_RULES,
];

export const PHASE3A_BATCH3_MAJOR_LINE_RULE_COUNT = PHASE3A_BATCH3_MAJOR_LINE_RULES.length;
