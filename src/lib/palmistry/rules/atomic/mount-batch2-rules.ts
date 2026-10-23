import type { PalmCondition, PalmRule } from "../../types";

const medicalGuardrail = "This is not a medical diagnosis. Use only as vitality/lifestyle reflection.";
const travelGuardrail = "Do not guarantee foreign settlement or travel. Present this only as a traditional tendency when supported by multiple signs.";
const fameGuardrail = "Do not guarantee fame or public success. Present this only as visibility/creative potential.";
const relationshipGuardrail = "Do not guarantee marriage, divorce, childbirth or relationship outcome. Present only as emotional tendency.";

const eq = (feature: string, value: string | number | boolean): PalmCondition => ({
  feature,
  operator: "equals",
  value,
});

type MountKey = "jupiter" | "saturn" | "sun" | "mercury" | "venus" | "moon" | "mars";

type MountConfig = {
  key: MountKey;
  base: number;
  englishName: string;
  hindiName: string;
  tradition: PalmRule["tradition"];
  category: PalmRule["category"];
  sourceIds: string[];
  coreTheme: string;
  strongMeaning: string;
  balancedMeaning: string;
  weakMeaning: string;
  classicalStrong: string;
  primarySupport: PalmCondition;
  secondarySupport: PalmCondition;
  specificSignature: PalmCondition;
  matchingShape: PalmCondition;
  specificCategory?: PalmRule["category"];
  specificGuardrail?: string;
};

type MountRuleInput = {
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

const mountProminence = (mount: MountKey, value: "strong" | "balanced" | "weak" | "unknown") =>
  eq(`mounts.${mount}.prominence`, value);

const defaultGuardrail = (category: PalmRule["category"], riskLevel: PalmRule["riskLevel"]) => {
  if (riskLevel === "medical_guarded") return medicalGuardrail;
  if (category === "travel") return travelGuardrail;
  if (category === "fame") return fameGuardrail;
  if (category === "relationship") return relationshipGuardrail;
  return undefined;
};

const makeMountRule = (cfg: MountConfig, input: MountRuleInput): PalmRule => {
  const category = input.category ?? cfg.category;
  const riskLevel = input.riskLevel ?? (category === "health_vitality" ? "medical_guarded" : "safe");

  return {
    id: `mount_${cfg.key}_${input.slug}_${cfg.base + input.offset}`,
    type: input.type ?? "combination",
    title: input.title,
    sourceIds: cfg.sourceIds,
    sourceNotes:
      "Mount rule derived from classical palmistry. Mounts should be interpreted with fingers, lines, signs, palm shape and image confidence, not in isolation.",
    pageRef: "Phase 3A Batch 2 mount rule inventory",
    tradition: cfg.tradition,
    category,
    tier: input.tier ?? "premium",
    status: input.status ?? "active",
    riskLevel,
    required: input.required,
    supporting: input.supporting ?? [],
    contradicting: input.contradicting ?? [],
    interpretation: {
      classical: `${input.hindi} इसे अन्य रेखाओं, उंगलियों और पर्वतों के साथ मिलाकर पढ़ना चाहिए।`,
      scientific: `${input.meaning} This is a tendency-based interpretation and should be weighed with supporting and contradicting features.`,
      luxury: input.luxury,
    },
    confidenceBase: input.confidenceBase,
    severity: input.severity ?? "medium",
    reportPriority: input.reportPriority,
    guardrail: input.guardrail ?? defaultGuardrail(category, riskLevel),
  };
};

const MOUNT_CONFIGS: MountConfig[] = [
  {
    key: "jupiter",
    base: 151,
    englishName: "Jupiter",
    hindiName: "गुरु",
    tradition: "dayanand",
    category: "career",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER"],
    coreTheme: "leadership, ambition, dignity and self-respect",
    strongMeaning: "A strong Jupiter mount supports leadership, ambition, self-respect and desire for recognition.",
    balancedMeaning: "A balanced Jupiter mount suggests healthy ambition without excessive ego.",
    weakMeaning: "A weak Jupiter mount may suggest modest ambition or hesitation in claiming authority.",
    classicalStrong: "प्रबल गुरु पर्वत नेतृत्व, मान, महत्वाकांक्षा और आत्म-सम्मान का संकेत देता है।",
    primarySupport: eq("fingers.indexRelative", "long"),
    secondarySupport: eq("lines.saturn.visible", true),
    specificSignature: eq("lines.heart.ending", "jupiter"),
    matchingShape: eq("palm.shape", "rectangular"),
  },
  {
    key: "saturn",
    base: 172,
    englishName: "Saturn",
    hindiName: "शनि",
    tradition: "dayanand",
    category: "career",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "discipline, responsibility, depth and patience",
    strongMeaning: "A strong Saturn mount supports discipline, seriousness, patience and responsibility.",
    balancedMeaning: "A balanced Saturn mount suggests mature discipline without excessive heaviness.",
    weakMeaning: "A weak Saturn mount may suggest difficulty with discipline or long-term consistency.",
    classicalStrong: "प्रबल शनि पर्वत अनुशासन, गंभीरता, धैर्य और जिम्मेदारी का संकेत देता है।",
    primarySupport: eq("lines.saturn.visible", true),
    secondarySupport: eq("lines.head.clarity", "clear"),
    specificSignature: eq("fingers.length", "long"),
    matchingShape: eq("palm.shape", "square"),
  },
  {
    key: "sun",
    base: 193,
    englishName: "Sun/Apollo",
    hindiName: "सूर्य",
    tradition: "western",
    category: "fame",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "creativity, recognition, expression and public visibility",
    strongMeaning: "A strong Sun mount supports creativity, recognition, expression and public visibility.",
    balancedMeaning: "A balanced Sun mount suggests refined creativity without excessive showmanship.",
    weakMeaning: "A weak Sun mount may suggest low need for display or under-expressed creativity.",
    classicalStrong: "प्रबल सूर्य पर्वत यश, कला, अभिव्यक्ति और सार्वजनिक पहचान का संकेत देता है।",
    primarySupport: eq("fingers.ringRelative", "long"),
    secondarySupport: eq("fingers.tips", "conic"),
    specificSignature: eq("lines.sun.visible", true),
    matchingShape: eq("palm.shape", "long"),
    specificCategory: "fame",
    specificGuardrail: fameGuardrail,
  },
  {
    key: "mercury",
    base: 214,
    englishName: "Mercury",
    hindiName: "बुध",
    tradition: "dayanand",
    category: "career",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "communication, business, intelligence and adaptability",
    strongMeaning: "A strong Mercury mount supports communication, business sense, adaptability and negotiation.",
    balancedMeaning: "A balanced Mercury mount suggests practical communication and social intelligence.",
    weakMeaning: "A weak Mercury mount may suggest reserved communication or business hesitation.",
    classicalStrong: "प्रबल बुध पर्वत वाणी, व्यापार, बुद्धि और व्यवहार-कौशल का संकेत देता है।",
    primarySupport: eq("fingers.littleRelative", "long"),
    secondarySupport: eq("lines.mercury.visible", true),
    specificSignature: eq("thumb.secondPhalange", "long"),
    matchingShape: eq("palm.shape", "rectangular"),
  },
  {
    key: "venus",
    base: 235,
    englishName: "Venus",
    hindiName: "शुक्र",
    tradition: "western",
    category: "relationship",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "warmth, affection, vitality and emotional magnetism",
    strongMeaning: "A strong Venus mount supports warmth, affection, emotional magnetism and life-force.",
    balancedMeaning: "A balanced Venus mount suggests steady affection and healthy warmth.",
    weakMeaning: "A weak Venus mount may suggest emotional reserve or lower outward warmth.",
    classicalStrong: "प्रबल शुक्र पर्वत प्रेम, आकर्षण, ऊष्मा और जीवन-रस का संकेत देता है।",
    primarySupport: eq("lines.heart.clarity", "clear"),
    secondarySupport: eq("lines.life.depth", "deep"),
    specificSignature: eq("palm.color", "pink"),
    matchingShape: eq("palm.shape", "square"),
    specificCategory: "relationship",
    specificGuardrail: relationshipGuardrail,
  },
  {
    key: "moon",
    base: 256,
    englishName: "Moon/Luna",
    hindiName: "चंद्र",
    tradition: "dayanand",
    category: "travel",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "imagination, travel pull, emotion and intuition",
    strongMeaning: "A strong Moon mount supports imagination, emotional depth, travel pull and inner sensitivity.",
    balancedMeaning: "A balanced Moon mount suggests imagination with emotional control.",
    weakMeaning: "A weak Moon mount may suggest lower imaginative pull or more practical orientation.",
    classicalStrong: "प्रबल चंद्र पर्वत कल्पना, यात्रा-आकर्षण, भावना और अंतर्ज्ञान का संकेत देता है।",
    primarySupport: eq("lines.head.direction", "moon"),
    secondarySupport: eq("lines.travel.visible", true),
    specificSignature: eq("lines.intuition.visible", true),
    matchingShape: eq("palm.shape", "long"),
    specificCategory: "travel",
    specificGuardrail: travelGuardrail,
  },
  {
    key: "mars",
    base: 277,
    englishName: "Mars",
    hindiName: "मंगल",
    tradition: "dayanand",
    category: "personality",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER", "WRITER_LINES_III"],
    coreTheme: "courage, resistance, stamina and conflict-handling",
    strongMeaning: "A strong Mars mount supports courage, resistance, stamina and fighting spirit.",
    balancedMeaning: "A balanced Mars mount suggests controlled courage and steady resistance.",
    weakMeaning: "A weak Mars mount may suggest avoidance of conflict or lower assertiveness.",
    classicalStrong: "प्रबल मंगल पर्वत साहस, प्रतिरोध, संघर्ष-शक्ति और धैर्य का संकेत देता है।",
    primarySupport: eq("lines.life.depth", "deep"),
    secondarySupport: eq("thumb.firstPhalange", "long"),
    specificSignature: eq("palm.texture", "hard"),
    matchingShape: eq("palm.shape", "broad"),
  },
];

const createMountRules = (cfg: MountConfig): PalmRule[] => {
  const strong = mountProminence(cfg.key, "strong");
  const balanced = mountProminence(cfg.key, "balanced");
  const weak = mountProminence(cfg.key, "weak");
  const unknown = mountProminence(cfg.key, "unknown");

  return [
    makeMountRule(cfg, { offset: 0, slug: "strong_core", type: "atomic", tier: "free", title: `Strong ${cfg.englishName} mount core meaning`, category: cfg.category, required: [strong], meaning: cfg.strongMeaning, hindi: cfg.classicalStrong, luxury: `Your ${cfg.englishName} mount is active, adding a signature of ${cfg.coreTheme} to your palm architecture.`, confidenceBase: 0.66, reportPriority: 76 }),
    makeMountRule(cfg, { offset: 1, slug: "balanced_core", type: "atomic", tier: "free", title: `Balanced ${cfg.englishName} mount core meaning`, category: cfg.category, required: [balanced], meaning: cfg.balancedMeaning, hindi: `संतुलित ${cfg.hindiName} पर्वत ${cfg.coreTheme} को मध्यम और नियंत्रित रूप में दिखाता है।`, luxury: `Your ${cfg.englishName} mount appears balanced, showing a composed expression of ${cfg.coreTheme}.`, confidenceBase: 0.6, severity: "low", reportPriority: 60 }),
    makeMountRule(cfg, { offset: 2, slug: "weak_core", type: "atomic", tier: "free", title: `Weak ${cfg.englishName} mount core meaning`, category: "personality", required: [weak], meaning: cfg.weakMeaning, hindi: `कमज़ोर ${cfg.hindiName} पर्वत ${cfg.coreTheme} में कमी या संकोच दिखा सकता है।`, luxury: `Your ${cfg.englishName} field looks softer, so ${cfg.coreTheme} may express more quietly.`, confidenceBase: 0.54, severity: "low", reportPriority: 48 }),
    makeMountRule(cfg, { offset: 3, slug: "primary_support", title: `Strong ${cfg.englishName} mount with primary support`, required: [strong, cfg.primarySupport], meaning: `The ${cfg.englishName} mount is reinforced by its related physical or line support, strengthening ${cfg.coreTheme}.`, hindi: `${cfg.hindiName} पर्वत को संबंधित उंगली/रेखा का सहयोग मिल रहा है, जिससे उसका फल अधिक स्पष्ट होता है।`, luxury: `Your ${cfg.englishName} signature is reinforced, making ${cfg.coreTheme} more visible in your life pattern.`, confidenceBase: 0.74, reportPriority: 86 }),
    makeMountRule(cfg, { offset: 4, slug: "secondary_support", title: `Strong ${cfg.englishName} mount with secondary support`, required: [strong, cfg.secondarySupport], meaning: `A second supporting sign confirms the ${cfg.englishName} theme and raises confidence.`, hindi: `दूसरा सहायक संकेत ${cfg.hindiName} पर्वत के फल को मजबूत करता है।`, luxury: `A second marker supports your ${cfg.englishName} field, giving the report stronger confidence.`, confidenceBase: 0.75, reportPriority: 87 }),
    makeMountRule(cfg, { offset: 5, slug: "long_thumb_will", title: `Strong ${cfg.englishName} mount with long thumb`, required: [strong, eq("thumb.length", "long")], meaning: "The mount theme is supported by judgement and self-command from the long thumb.", hindi: `${cfg.hindiName} पर्वत को लंबे अंगूठे की इच्छा-शक्ति और विवेक का सहयोग मिलता है।`, luxury: `Your ${cfg.englishName} field is not passive; the long thumb adds command and conscious direction.`, confidenceBase: 0.72, reportPriority: 80 }),
    makeMountRule(cfg, { offset: 6, slug: "clear_head", title: `Strong ${cfg.englishName} mount with clear Head Line`, required: [strong, eq("lines.head.clarity", "clear")], category: "education", meaning: "The mount theme is filtered through clearer judgement and mental structure.", hindi: `स्पष्ट मस्तिष्क रेखा ${cfg.hindiName} पर्वत के फल को विवेकपूर्ण दिशा देती है।`, luxury: `Your ${cfg.englishName} energy is supported by mental clarity, making it more useful and focused.`, confidenceBase: 0.73, reportPriority: 82 }),
    makeMountRule(cfg, { offset: 7, slug: "fate_line_career", title: `Strong ${cfg.englishName} mount with Fate Line`, required: [strong, eq("lines.saturn.visible", true)], category: "career", meaning: "The mount theme connects with career direction and responsibility when the Fate Line is visible.", hindi: `शनि/भाग्य रेखा ${cfg.hindiName} पर्वत के फल को कर्म और करियर दिशा से जोड़ती है।`, luxury: `Your ${cfg.englishName} field connects with your path of work, duty and life direction.`, confidenceBase: 0.72, reportPriority: 82 }),
    makeMountRule(cfg, { offset: 8, slug: "sun_line_visibility", title: `Strong ${cfg.englishName} mount with Sun Line`, required: [strong, eq("lines.sun.visible", true)], category: "fame", meaning: "The mount theme gains visibility, expression and recognition support through the Sun Line.", hindi: `सूर्य रेखा ${cfg.hindiName} पर्वत के फल को पहचान और अभिव्यक्ति से जोड़ती है।`, luxury: `Your ${cfg.englishName} energy has a visibility channel through the Sun Line.`, confidenceBase: 0.7, reportPriority: 78, guardrail: fameGuardrail }),
    makeMountRule(cfg, { offset: 9, slug: "mercury_line_communication", title: `Strong ${cfg.englishName} mount with Mercury Line`, required: [strong, eq("lines.mercury.visible", true)], category: "career", meaning: "The mount theme is expressed through communication, business sense or adaptability.", hindi: `बुध रेखा ${cfg.hindiName} पर्वत के फल को वाणी, व्यापार और व्यवहार से जोड़ती है।`, luxury: `Your ${cfg.englishName} energy finds a practical channel through communication and adaptability.`, confidenceBase: 0.7, reportPriority: 78 }),
    makeMountRule(cfg, { offset: 10, slug: "clear_heart", title: `Strong ${cfg.englishName} mount with clear Heart Line`, required: [strong, eq("lines.heart.clarity", "clear")], category: "relationship", meaning: "The mount theme is emotionally clearer when supported by a clear Heart Line.", hindi: `स्पष्ट हृदय रेखा ${cfg.hindiName} पर्वत के फल को भावनात्मक स्पष्टता देती है।`, luxury: `Your ${cfg.englishName} field interacts with emotional clarity and relational warmth.`, confidenceBase: 0.69, reportPriority: 74, guardrail: relationshipGuardrail }),
    makeMountRule(cfg, { offset: 11, slug: "deep_life_vitality", title: `Strong ${cfg.englishName} mount with deep Life Line`, required: [strong, eq("lines.life.depth", "deep")], category: "health_vitality", riskLevel: "medical_guarded", meaning: "The mount theme has stronger stamina and vitality support when the Life Line is deep.", hindi: `गहरी आयु रेखा ${cfg.hindiName} पर्वत के फल को ऊर्जा और स्थिरता देती है।`, luxury: `Your ${cfg.englishName} field receives a stronger vitality current through the deep Life Line.`, confidenceBase: 0.69, reportPriority: 72, guardrail: medicalGuardrail }),
    makeMountRule(cfg, { offset: 12, slug: "many_lines_excess", title: `Strong ${cfg.englishName} mount with many lines indicates excess tendency`, required: [strong, eq("palm.lineDensity", "many")], type: "modifier", category: "personality", riskLevel: "sensitive", meaning: "The mount is strong, but many lines may create excess, restlessness or over-processing around its theme.", hindi: `प्रबल ${cfg.hindiName} पर्वत के साथ अधिक रेखाएँ उसके फल में अधिकता या चंचलता जोड़ सकती हैं।`, luxury: `Your ${cfg.englishName} energy is strong, but the many-line pattern asks for grounding and refinement.`, confidenceBase: 0.66, reportPriority: 66 }),
    makeMountRule(cfg, { offset: 13, slug: "weak_but_supported", title: `Weak ${cfg.englishName} mount with support indicates latent theme`, required: [weak, cfg.secondarySupport], category: cfg.category, meaning: "The mount appears weak, but a supporting sign shows the theme is latent rather than absent.", hindi: `कमज़ोर ${cfg.hindiName} पर्वत के बावजूद सहायक संकेत उसका फल पूरी तरह समाप्त नहीं होने देते।`, luxury: `Your ${cfg.englishName} field is quieter, but a support marker shows hidden potential.`, confidenceBase: 0.62, severity: "low", reportPriority: 62 }),
    makeMountRule(cfg, { offset: 14, slug: "balanced_clear_head", title: `Balanced ${cfg.englishName} mount with clear Head Line indicates mature expression`, required: [balanced, eq("lines.head.clarity", "clear")], category: "education", meaning: "Balanced mount energy and clear thinking create mature expression of the theme.", hindi: `संतुलित ${cfg.hindiName} पर्वत और स्पष्ट मस्तिष्क रेखा परिपक्व अभिव्यक्ति देती है।`, luxury: `Your ${cfg.englishName} field is mature, steady and mentally well-directed.`, confidenceBase: 0.67, reportPriority: 70 }),
    makeMountRule(cfg, { offset: 15, slug: "matching_shape", title: `Strong ${cfg.englishName} mount with matching palm shape`, required: [strong, cfg.matchingShape], category: cfg.category, meaning: "The palm shape reinforces the mount theme and makes it more integrated.", hindi: `हथेली का आकार ${cfg.hindiName} पर्वत के फल को और संगठित बनाता है।`, luxury: `Your palm shape supports the ${cfg.englishName} field, making this theme more integrated.`, confidenceBase: 0.7, reportPriority: 76 }),
    makeMountRule(cfg, { offset: 16, slug: "star_sign", title: `Strong ${cfg.englishName} mount with star sign`, required: [strong, eq("signs.star", true)], type: "modifier", category: cfg.specificCategory ?? cfg.category, riskLevel: "sensitive", meaning: "A star sign traditionally intensifies the mount theme, but it must be confirmed carefully.", hindi: `${cfg.hindiName} पर्वत पर तारा चिन्ह उसके फल को तीव्र कर सकता है, पर इसे सावधानी से पढ़ना चाहिए।`, luxury: `The star marker intensifies your ${cfg.englishName} field, but AstroLife keeps this as a probability marker, not a guarantee.`, confidenceBase: 0.66, reportPriority: 72, guardrail: cfg.specificGuardrail }),
    makeMountRule(cfg, { offset: 17, slug: "grille_sign", title: `Strong ${cfg.englishName} mount with grille sign`, required: [strong, eq("signs.grille", true)], type: "modifier", category: "personality", riskLevel: "sensitive", meaning: "A grille sign may scatter or complicate the mount energy.", hindi: `${cfg.hindiName} पर्वत पर जाल/ग्रिल चिन्ह उसके फल में बिखराव या उलझन जोड़ सकता है।`, luxury: `Your ${cfg.englishName} field is powerful, but the grille marker asks for discipline and cleanup of scattered energy.`, confidenceBase: 0.62, reportPriority: 64 }),
    makeMountRule(cfg, { offset: 18, slug: "square_sign", title: `Strong ${cfg.englishName} mount with square sign`, required: [strong, eq("signs.square", true)], type: "modifier", category: cfg.category, meaning: "A square sign is traditionally treated as a protective or stabilizing modifier around the mount theme.", hindi: `${cfg.hindiName} पर्वत पर वर्ग चिन्ह उसके फल को संरक्षण या स्थिरता दे सकता है।`, luxury: `The square marker stabilizes your ${cfg.englishName} field, adding protection and structure.`, confidenceBase: 0.66, reportPriority: 68 }),
    makeMountRule(cfg, { offset: 19, slug: "unknown_no_claim", type: "modifier", title: `Unknown ${cfg.englishName} mount should make no mount claim`, category: "general", tier: "free", status: "reviewed", required: [unknown], meaning: `The ${cfg.englishName} mount is unclear, so its interpretation should be skipped or treated as low confidence.`, hindi: `${cfg.hindiName} पर्वत स्पष्ट न हो तो उससे जुड़ा फलादेश नहीं करना चाहिए।`, luxury: `AstroLife could not clearly read the ${cfg.englishName} field, so this theme is kept low-confidence.`, confidenceBase: 0.28, severity: "low", reportPriority: 18 }),
    makeMountRule(cfg, { offset: 20, slug: "specific_signature", title: `Strong ${cfg.englishName} mount with specific signature`, required: [strong, cfg.specificSignature], category: cfg.specificCategory ?? cfg.category, meaning: `This is the strongest mount-specific signature for ${cfg.coreTheme}.`, hindi: `यह ${cfg.hindiName} पर्वत के फल को उसके विशेष संकेत के साथ मजबूत करता है।`, luxury: `This is a premium ${cfg.englishName} signature: ${cfg.coreTheme} becomes a major theme in the report.`, confidenceBase: 0.76, reportPriority: 88, guardrail: cfg.specificGuardrail }),
  ];
};

export const BATCH2_JUPITER_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[0]);
export const BATCH2_SATURN_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[1]);
export const BATCH2_SUN_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[2]);
export const BATCH2_MERCURY_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[3]);
export const BATCH2_VENUS_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[4]);
export const BATCH2_MOON_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[5]);
export const BATCH2_MARS_MOUNT_RULES = createMountRules(MOUNT_CONFIGS[6]);

export const BATCH2_GENERAL_MOUNT_COMBINATION_RULES: PalmRule[] = [
  {
    id: "mounts_all_unknown_no_mount_claim_298",
    type: "modifier",
    title: "All mounts unknown should disable mount-based reading",
    sourceIds: ["DAYANAND_SECRETS", "FIFTY_HANDPRINTS"],
    sourceNotes: "If mount prominence is not clear from image or user confirmation, mount claims should not be made.",
    pageRef: "Phase 3A Batch 2 mount rule inventory",
    tradition: "dayanand",
    category: "general",
    tier: "free",
    status: "reviewed",
    riskLevel: "safe",
    required: [
      mountProminence("jupiter", "unknown"),
      mountProminence("saturn", "unknown"),
      mountProminence("sun", "unknown"),
      mountProminence("mercury", "unknown"),
      mountProminence("venus", "unknown"),
      mountProminence("moon", "unknown"),
      mountProminence("mars", "unknown"),
    ],
    supporting: [],
    contradicting: [],
    interpretation: {
      classical: "सभी पर्वत अस्पष्ट हों तो पर्वत-आधारित फलादेश नहीं करना चाहिए।",
      scientific: "All mount fields are unclear, so mount-based interpretation should be disabled or kept very low confidence.",
      luxury: "AstroLife could not confidently read the mount field, so this report avoids mount-based overclaims.",
    },
    confidenceBase: 0.25,
    severity: "low",
    reportPriority: 10,
  },
  {
    id: "mounts_career_triad_strong_299",
    type: "combination",
    title: "Career leadership triad: Jupiter, Sun and Mercury strong",
    sourceIds: ["DAYANAND_SECRETS", "DAYANAND_MASTER"],
    sourceNotes: "Jupiter, Sun and Mercury combine leadership, visibility and communication themes.",
    pageRef: "Phase 3A Batch 2 mount rule inventory",
    tradition: "dayanand",
    category: "career",
    tier: "elite",
    status: "active",
    riskLevel: "safe",
    required: [mountProminence("jupiter", "strong"), mountProminence("sun", "strong"), mountProminence("mercury", "strong")],
    supporting: [eq("lines.head.clarity", "clear"), eq("lines.saturn.visible", true)],
    contradicting: [],
    interpretation: {
      classical: "गुरु, सूर्य और बुध का संयुक्त बल नेतृत्व, पहचान और वाणी/व्यापार कौशल देता है।",
      scientific: "Strong Jupiter, Sun and Mercury mounts form a career-leadership triad involving ambition, visibility and communication.",
      luxury: "This is a premium AstroLife career signature: leadership, visibility and communication working together.",
    },
    confidenceBase: 0.8,
    severity: "high",
    reportPriority: 96,
    guardrail: "Do not guarantee career success, wealth or fame. Present this as a strong potential signature.",
  },
  {
    id: "mounts_emotional_energy_triad_300",
    type: "combination",
    title: "Emotional energy triad: Venus, Moon and Mars strong",
    sourceIds: ["DAYANAND_SECRETS", "WRITER_LINES_III"],
    sourceNotes: "Venus, Moon and Mars combine warmth, imagination and courage themes.",
    pageRef: "Phase 3A Batch 2 mount rule inventory",
    tradition: "dayanand",
    category: "relationship",
    tier: "elite",
    status: "active",
    riskLevel: "sensitive",
    required: [mountProminence("venus", "strong"), mountProminence("moon", "strong"), mountProminence("mars", "strong")],
    supporting: [eq("lines.heart.clarity", "clear"), eq("lines.life.depth", "deep")],
    contradicting: [],
    interpretation: {
      classical: "शुक्र, चंद्र और मंगल का संयुक्त बल प्रेम, कल्पना और साहस को बढ़ाता है।",
      scientific: "Strong Venus, Moon and Mars mounts create an emotional-energy triad involving affection, imagination and assertiveness.",
      luxury: "This is a powerful emotional-energy signature: warmth, imagination and courage moving together.",
    },
    confidenceBase: 0.76,
    severity: "high",
    reportPriority: 92,
    guardrail: relationshipGuardrail,
  },
];

export const PHASE3A_BATCH2_MOUNT_RULES: PalmRule[] = [
  ...BATCH2_JUPITER_MOUNT_RULES,
  ...BATCH2_SATURN_MOUNT_RULES,
  ...BATCH2_SUN_MOUNT_RULES,
  ...BATCH2_MERCURY_MOUNT_RULES,
  ...BATCH2_VENUS_MOUNT_RULES,
  ...BATCH2_MOON_MOUNT_RULES,
  ...BATCH2_MARS_MOUNT_RULES,
  ...BATCH2_GENERAL_MOUNT_COMBINATION_RULES,
];

export const PHASE3A_BATCH2_MOUNT_RULE_COUNT = PHASE3A_BATCH2_MOUNT_RULES.length;
