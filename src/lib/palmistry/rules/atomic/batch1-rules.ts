import type { PalmCategory, PalmCondition, PalmRule, PalmRuleRiskLevel } from "../../types";

const medicalGuardrail = "This is not a medical diagnosis. Use only as vitality/lifestyle reflection.";

type BatchSeed = {
  id: string;
  title: string;
  required: PalmCondition[];
  supporting?: PalmCondition[];
  category?: PalmCategory;
  riskLevel?: PalmRuleRiskLevel;
  meaning: string;
  base?: number;
  priority?: number;
};

const eq = (feature: string, value: string | boolean): PalmCondition => ({ feature, operator: "equals", value });

function rule(seed: BatchSeed): PalmRule {
  const riskLevel = seed.riskLevel ?? "safe";
  return {
    id: seed.id,
    type: "atomic",
    title: seed.title,
    sourceIds: ["DAYANAND_SECRETS", "FIFTY_HANDPRINTS", "WRITER_SCIENTIFIC_IV"],
    sourceNotes: "Phase 3A Batch 1 inventory. Read with supporting and contradicting signs, never as a one-line prediction.",
    pageRef: "Phase 3A Batch 1 rule inventory",
    tradition: "dayanand",
    category: seed.category ?? "personality",
    tier: seed.id.includes("unknown") ? "free" : "premium",
    status: seed.id.includes("unknown") ? "reviewed" : "active",
    riskLevel,
    required: seed.required,
    supporting: seed.supporting ?? [],
    contradicting: [],
    interpretation: {
      classical: `${seed.meaning} Classical reading requires confirmation from the full hand, thumb, fingers, mounts and lines.`,
      scientific: `${seed.meaning} Treat this as a probability marker and weigh it against image quality and contradictory features.`,
      luxury: `${seed.meaning} AstroLife uses this as one refined signal inside the larger palm intelligence map.`,
    },
    confidenceBase: seed.base ?? 0.64,
    severity: riskLevel === "medical_guarded" ? "medium" : "low",
    guardrail: riskLevel === "medical_guarded" ? medicalGuardrail : undefined,
    reportPriority: seed.priority ?? 60,
  };
}

const handShapeSeeds: BatchSeed[] = [
  { id: "hand_square_practical_001", title: "Square palm indicates practical grounded nature", required: [eq("palm.shape", "square")], meaning: "A square palm is read as practical, grounded and methodical.", base: 0.66, priority: 70 },
  { id: "hand_rectangular_ambition_002", title: "Rectangular palm indicates planning and ambition", required: [eq("palm.shape", "rectangular")], meaning: "A rectangular palm suggests planning ability, ambition and long-range thinking.", base: 0.66, priority: 70 },
  { id: "hand_long_sensitive_003", title: "Long palm indicates sensitivity and imagination", required: [eq("palm.shape", "long")], meaning: "A long palm is associated with sensitivity, imagination and inner receptivity." },
  { id: "hand_broad_action_004", title: "Broad palm indicates action orientation", required: [eq("palm.shape", "broad")], meaning: "A broad palm is read as action-oriented, direct and physically expressive." },
  { id: "hand_square_few_lines_stable_005", title: "Square palm with few lines indicates stability", required: [eq("palm.shape", "square"), eq("palm.lineDensity", "few")], meaning: "Square palm with fewer lines suggests stability, simplicity and steady decisions.", base: 0.72, priority: 78 },
  { id: "hand_square_many_lines_restless_006", title: "Square palm with many lines indicates practical restlessness", required: [eq("palm.shape", "square"), eq("palm.lineDensity", "many")], meaning: "A practical nature is present, but many lines add mental restlessness.", base: 0.7 },
  { id: "hand_rectangular_long_fingers_planner_007", title: "Rectangular palm with long fingers indicates strategic planning", required: [eq("palm.shape", "rectangular"), eq("fingers.length", "long")], category: "career", meaning: "This combination suggests strategic planning, detail and foresight.", base: 0.73, priority: 82 },
  { id: "hand_rectangular_short_fingers_executor_008", title: "Rectangular palm with short fingers indicates fast execution", required: [eq("palm.shape", "rectangular"), eq("fingers.length", "short")], category: "career", meaning: "Planning combines with quick execution and action bias.", base: 0.71 },
  { id: "hand_broad_long_thumb_command_009", title: "Broad palm with long thumb indicates command and willpower", required: [eq("palm.shape", "broad"), eq("thumb.length", "long")], meaning: "This combination supports command, endurance and self-directed action.", base: 0.74, priority: 84 },
  { id: "hand_long_moon_imagination_010", title: "Long palm with strong Moon mount indicates imagination", required: [eq("palm.shape", "long"), eq("mounts.moon.prominence", "strong")], category: "travel", meaning: "A long palm with Moon strength suggests imagination, emotion and travel pull.", base: 0.72 },
  { id: "hand_unknown_low_confidence_011", title: "Unknown palm shape should reduce hand-shape confidence", required: [eq("palm.shape", "unknown")], category: "general", meaning: "Palm shape is not clear enough, so hand-shape interpretation should be limited.", base: 0.35, priority: 20 },
  { id: "hand_broad_hard_endurance_012", title: "Broad hard palm indicates endurance", required: [eq("palm.shape", "broad"), eq("palm.texture", "hard")], category: "health_vitality", meaning: "A broad hard palm suggests endurance, toughness and persistence.", base: 0.72 },
  { id: "hand_soft_long_receptive_013", title: "Soft long palm indicates receptivity", required: [eq("palm.texture", "soft"), eq("palm.shape", "long")], meaning: "Softness with a long palm indicates emotional receptivity and sensitivity.", base: 0.68 },
  { id: "hand_rectangular_clear_head_strategy_014", title: "Rectangular palm with clear Head Line indicates strategy", required: [eq("palm.shape", "rectangular"), eq("lines.head.clarity", "clear")], category: "career", meaning: "This combination supports strategy, structure and practical intelligence.", base: 0.75, priority: 86 },
  { id: "hand_square_saturn_discipline_015", title: "Square palm with strong Saturn mount indicates discipline", required: [eq("palm.shape", "square"), eq("mounts.saturn.prominence", "strong")], category: "career", meaning: "Square palm and Saturn strength indicate discipline and responsibility.", base: 0.72 },
  { id: "hand_broad_mars_courage_016", title: "Broad palm with strong Mars indicates courage", required: [eq("palm.shape", "broad"), eq("mounts.mars.prominence", "strong")], meaning: "This combination suggests courage, resistance and fighting spirit.", base: 0.72 },
  { id: "hand_long_clear_heart_empathy_017", title: "Long palm with clear Heart Line indicates empathy", required: [eq("palm.shape", "long"), eq("lines.heart.clarity", "clear")], category: "relationship", meaning: "A long palm with a clear Heart Line suggests empathy and emotional refinement.", base: 0.71 },
  { id: "hand_square_long_thumb_logic_018", title: "Square palm with long thumb indicates practical logic", required: [eq("palm.shape", "square"), eq("thumb.length", "long")], meaning: "Practical structure is strengthened by will and judgement.", base: 0.72 },
  { id: "hand_broad_few_lines_direct_019", title: "Broad palm with few lines indicates directness", required: [eq("palm.shape", "broad"), eq("palm.lineDensity", "few")], meaning: "This combination suggests direct expression and simpler decision loops.", base: 0.69 },
  { id: "hand_long_many_lines_overload_020", title: "Long palm with many lines indicates emotional overload tendency", required: [eq("palm.shape", "long"), eq("palm.lineDensity", "many")], category: "remedy", meaning: "Sensitivity may become overloaded when many fine lines are present.", base: 0.68 },
  { id: "hand_rectangular_fate_visible_021", title: "Rectangular palm with Fate Line indicates career direction", required: [eq("palm.shape", "rectangular"), eq("lines.saturn.visible", true)], category: "career", meaning: "Planning ability is supported by visible career-direction markings.", base: 0.73 },
  { id: "hand_square_mercury_visible_022", title: "Square palm with Mercury Line indicates practical business sense", required: [eq("palm.shape", "square"), eq("lines.mercury.visible", true)], category: "wealth", meaning: "Practicality combines with communication and business indicators.", base: 0.71 },
  { id: "hand_broad_sun_visible_023", title: "Broad palm with Sun Line indicates expressive action", required: [eq("palm.shape", "broad"), eq("lines.sun.visible", true)], category: "fame", meaning: "Action orientation gains a visible creative or public-expression channel.", base: 0.69 },
  { id: "hand_long_sun_visible_024", title: "Long palm with Sun Line indicates creative sensitivity", required: [eq("palm.shape", "long"), eq("lines.sun.visible", true)], category: "fame", meaning: "Sensitivity and creativity may support refined public expression.", base: 0.7 },
  { id: "hand_rectangular_mercury_business_025", title: "Rectangular palm with Mercury Line indicates business planning", required: [eq("palm.shape", "rectangular"), eq("lines.mercury.visible", true)], category: "wealth", meaning: "Planning ability is supported by communication and commerce indicators.", base: 0.72 },
  { id: "hand_square_heart_jupiter_ethics_026", title: "Square palm with Heart ending Jupiter indicates ethical standards", required: [eq("palm.shape", "square"), eq("lines.heart.ending", "jupiter")], category: "relationship", meaning: "Practicality combines with high standards in relationships.", base: 0.7 },
  { id: "hand_long_head_moon_creative_027", title: "Long palm with Head Line to Moon indicates creative mind", required: [eq("palm.shape", "long"), eq("lines.head.direction", "moon")], category: "spirituality", meaning: "Sensitivity and imagination support creative inner intelligence.", base: 0.72 },
  { id: "hand_broad_life_deep_stamina_028", title: "Broad palm with deep Life Line indicates stamina", required: [eq("palm.shape", "broad"), eq("lines.life.depth", "deep")], category: "health_vitality", meaning: "Action orientation is supported by vitality and recovery indicators.", base: 0.73 },
  { id: "hand_rectangular_jupiter_leadership_029", title: "Rectangular palm with strong Jupiter indicates leadership ambition", required: [eq("palm.shape", "rectangular"), eq("mounts.jupiter.prominence", "strong")], category: "career", meaning: "Planning ability combines with leadership ambition.", base: 0.72 },
  { id: "hand_square_venus_balanced_030", title: "Square palm with balanced Venus indicates steady affection", required: [eq("palm.shape", "square"), eq("mounts.venus.prominence", "balanced")], category: "relationship", meaning: "Practical temperament supports steady warmth and affection.", base: 0.68 },
];

const textureSeeds: BatchSeed[] = [
  { id: "palm_hard_endurance_031", title: "Hard palm indicates endurance", required: [eq("palm.texture", "hard")], category: "health_vitality", meaning: "A hard palm suggests endurance, toughness and practical stamina." },
  { id: "palm_soft_receptive_032", title: "Soft palm indicates receptivity", required: [eq("palm.texture", "soft")], meaning: "A soft palm suggests sensitivity, receptivity and emotional response." },
  { id: "palm_supple_adaptable_033", title: "Supple palm indicates adaptability", required: [eq("palm.texture", "supple")], meaning: "A supple palm suggests adaptability and responsive adjustment." },
  { id: "palm_stiff_resistant_034", title: "Stiff palm indicates resistance to change", required: [eq("palm.flexibility", "stiff")], category: "remedy", meaning: "A stiff palm can indicate resistance to change and slower adjustment." },
  { id: "palm_flexible_adaptable_035", title: "Flexible palm indicates adaptability", required: [eq("palm.flexibility", "flexible")], meaning: "A flexible palm suggests openness and adaptive behavior." },
  { id: "palm_few_lines_focus_036", title: "Few lines indicate focus", required: [eq("palm.lineDensity", "few")], meaning: "Few lines suggest focus, simplicity and fewer scattered impulses." },
  { id: "palm_many_lines_overthinking_037", title: "Many lines indicate sensitivity", required: [eq("palm.lineDensity", "many")], category: "remedy", meaning: "Many lines suggest high processing, sensitivity and possible overthinking." },
  { id: "palm_balanced_lines_moderation_038", title: "Balanced line density indicates moderation", required: [eq("palm.lineDensity", "balanced")], meaning: "Balanced line density suggests a moderate mental rhythm." },
  { id: "palm_pink_vitality_safe_039", title: "Pink palm color indicates vitality tone", required: [eq("palm.color", "pink")], category: "health_vitality", riskLevel: "medical_guarded", meaning: "Pink palm color can be used only as a soft vitality-tone marker." },
  { id: "palm_pale_energy_sensitive_040", title: "Pale palm color indicates vitality caution", required: [eq("palm.color", "pale")], category: "health_vitality", riskLevel: "medical_guarded", meaning: "Pale palm color should be treated only as a wellness and energy-caution marker." },
  { id: "palm_reddish_intensity_041", title: "Reddish palm color indicates intensity", required: [eq("palm.color", "reddish")], meaning: "Reddish palm color may reflect intensity, drive and strong response." },
  { id: "palm_yellowish_caution_042", title: "Yellowish palm color requires guarded wording", required: [eq("palm.color", "yellowish")], category: "health_vitality", riskLevel: "medical_guarded", meaning: "Yellowish palm color must be framed only as a vitality reflection." },
  { id: "palm_bluish_caution_043", title: "Bluish palm color requires guarded wording", required: [eq("palm.color", "bluish")], category: "health_vitality", riskLevel: "medical_guarded", meaning: "Bluish palm color must never diagnose and only triggers wellness caution wording." },
  { id: "palm_unknown_color_no_claim_044", title: "Unknown palm color blocks color claims", required: [eq("palm.color", "unknown")], category: "general", meaning: "No color-based palm claim should be made when color is unknown.", base: 0.35, priority: 20 },
  { id: "hard_palm_few_lines_direct_045", title: "Hard palm with few lines indicates direct effort", required: [eq("palm.texture", "hard"), eq("palm.lineDensity", "few")], category: "career", meaning: "Hard texture and few lines suggest direct hard-working effort." },
  { id: "hard_palm_many_lines_tension_046", title: "Hard palm with many lines indicates pressure tension", required: [eq("palm.texture", "hard"), eq("palm.lineDensity", "many")], category: "remedy", meaning: "Hard texture with many lines suggests tension under pressure." },
  { id: "soft_palm_many_lines_sensitive_047", title: "Soft palm with many lines indicates emotional sensitivity", required: [eq("palm.texture", "soft"), eq("palm.lineDensity", "many")], category: "relationship", meaning: "Soft texture with many lines suggests heightened emotional sensitivity." },
  { id: "supple_palm_clear_head_flexible_mind_048", title: "Supple palm with clear Head Line indicates flexible intelligence", required: [eq("palm.texture", "supple"), eq("lines.head.clarity", "clear")], category: "education", meaning: "Supple texture with clear thinking supports flexible intelligence." },
  { id: "stiff_palm_closed_thumb_rigidity_049", title: "Stiff palm with closed thumb indicates rigidity", required: [eq("palm.flexibility", "stiff"), eq("thumb.angle", "closed")], category: "remedy", meaning: "Stiffness with a closed thumb suggests guarded or rigid decision style." },
  { id: "flexible_palm_wide_thumb_openness_050", title: "Flexible palm with wide thumb indicates openness", required: [eq("palm.flexibility", "flexible"), eq("thumb.angle", "wide")], category: "relationship", meaning: "Flexibility and wide thumb angle support openness." },
  { id: "many_lines_heart_clear_emotional_processing_051", title: "Many lines with clear Heart Line indicate emotional processing", required: [eq("palm.lineDensity", "many"), eq("lines.heart.clarity", "clear")], category: "relationship", meaning: "Many lines with a clear Heart Line suggest active emotional processing." },
  { id: "few_lines_deep_life_simple_strength_052", title: "Few lines with deep Life Line indicate simple strength", required: [eq("palm.lineDensity", "few"), eq("lines.life.depth", "deep")], category: "health_vitality", meaning: "Few lines with a deep Life Line suggest simple stamina and recovery." },
  { id: "balanced_lines_clear_head_order_053", title: "Balanced lines with clear Head Line indicate ordered thought", required: [eq("palm.lineDensity", "balanced"), eq("lines.head.clarity", "clear")], category: "education", meaning: "Balanced line density with a clear Head Line suggests ordered thought." },
  { id: "many_lines_broken_head_scattered_054", title: "Many lines with broken Head Line indicate scattered focus", required: [eq("palm.lineDensity", "many"), eq("lines.head.clarity", "broken")], category: "remedy", meaning: "Many lines with broken Head Line suggest scattered focus and need for structure." },
  { id: "reddish_palm_mars_strong_temper_055", title: "Reddish palm with strong Mars indicates intensity", required: [eq("palm.color", "reddish"), eq("mounts.mars.prominence", "strong")], meaning: "Reddish color with Mars strength suggests intense temperament and drive." },
  { id: "pink_palm_venus_strong_warmth_056", title: "Pink palm with strong Venus indicates warmth", required: [eq("palm.color", "pink"), eq("mounts.venus.prominence", "strong")], category: "relationship", meaning: "Pink tone with Venus strength suggests warmth and affectionate vitality." },
  { id: "pale_palm_mercury_visible_vitality_caution_057", title: "Pale palm with Mercury Line needs vitality caution", required: [eq("palm.color", "pale"), eq("lines.mercury.visible", true)], category: "health_vitality", riskLevel: "medical_guarded", meaning: "Pale color with Mercury Line should only trigger guarded wellness language." },
  { id: "line_density_unknown_low_confidence_058", title: "Unknown line density reduces confidence", required: [eq("palm.lineDensity", "unknown")], category: "general", meaning: "Line-density reading should be lowered when density is unknown.", base: 0.35, priority: 20 },
  { id: "color_unknown_low_confidence_059", title: "Unknown color blocks color reading", required: [eq("palm.color", "unknown")], category: "general", meaning: "Color-based reading should be ignored when color is unknown.", base: 0.35, priority: 20 },
  { id: "texture_unknown_low_confidence_060", title: "Unknown texture reduces texture reading", required: [eq("palm.texture", "unknown")], category: "general", meaning: "Texture-based reading should be lowered when texture is unknown.", base: 0.35, priority: 20 },
];

const thumbSeeds: BatchSeed[] = [
  ["thumb_long_judgement_061", "thumb.length", "long", "Long thumb supports judgement and discretion."],
  ["thumb_short_haste_062", "thumb.length", "short", "Short thumb can suggest haste and quick reaction."],
  ["thumb_medium_balance_063", "thumb.length", "medium", "Medium thumb suggests balanced will."],
  ["thumb_wide_angle_openness_064", "thumb.angle", "wide", "Wide thumb angle suggests openness and independence."],
  ["thumb_closed_angle_caution_065", "thumb.angle", "closed", "Closed thumb angle suggests guarded or conservative responses."],
  ["thumb_balanced_angle_moderation_066", "thumb.angle", "balanced", "Balanced thumb angle supports moderate openness."],
  ["thumb_first_long_willpower_067", "thumb.firstPhalange", "long", "Long first phalange supports willpower and action."],
  ["thumb_first_short_weak_initiation_068", "thumb.firstPhalange", "short", "Short first phalange can suggest slower initiation."],
  ["thumb_second_long_logic_069", "thumb.secondPhalange", "long", "Long second phalange supports logic and reasoning."],
  ["thumb_second_short_impulse_070", "thumb.secondPhalange", "short", "Short second phalange can suggest impulse before analysis."],
].map(([id, feature, value, meaning]) => ({ id, title: meaning, required: [eq(feature, value)], meaning })) as BatchSeed[];

thumbSeeds.push(
  { id: "thumb_long_clear_head_decision_071", title: "Long thumb with clear Head Line indicates decision capacity", required: [eq("thumb.length", "long"), eq("lines.head.clarity", "clear")], category: "career", meaning: "Long thumb with clear Head Line supports sound decision capacity.", base: 0.74 },
  { id: "thumb_long_jupiter_strong_leadership_072", title: "Long thumb with strong Jupiter indicates leadership will", required: [eq("thumb.length", "long"), eq("mounts.jupiter.prominence", "strong")], category: "career", meaning: "Long thumb with strong Jupiter supports leadership will.", base: 0.73 },
  { id: "thumb_short_many_lines_reactivity_073", title: "Short thumb with many lines indicates reactivity", required: [eq("thumb.length", "short"), eq("palm.lineDensity", "many")], category: "remedy", meaning: "Short thumb with many lines suggests reactive mental patterns." },
  { id: "thumb_short_broken_head_caution_074", title: "Short thumb with broken Head Line needs decision caution", required: [eq("thumb.length", "short"), eq("lines.head.clarity", "broken")], category: "remedy", meaning: "Short thumb with broken Head Line lowers decision confidence." },
  { id: "thumb_wide_venus_strong_generosity_075", title: "Wide thumb with strong Venus indicates generosity", required: [eq("thumb.angle", "wide"), eq("mounts.venus.prominence", "strong")], category: "relationship", meaning: "Wide thumb with strong Venus supports generosity and warmth." },
  { id: "thumb_closed_saturn_strong_reserved_076", title: "Closed thumb with strong Saturn indicates reserved discipline", required: [eq("thumb.angle", "closed"), eq("mounts.saturn.prominence", "strong")], category: "career", meaning: "Closed thumb with strong Saturn suggests reserved discipline." },
  { id: "thumb_first_long_life_deep_drive_077", title: "Long first phalange with deep Life Line indicates drive", required: [eq("thumb.firstPhalange", "long"), eq("lines.life.depth", "deep")], category: "health_vitality", meaning: "Long first phalange with deep Life Line supports drive and endurance." },
  { id: "thumb_second_long_mercury_business_logic_078", title: "Long second phalange with Mercury Line indicates business logic", required: [eq("thumb.secondPhalange", "long"), eq("lines.mercury.visible", true)], category: "wealth", meaning: "Long logic phalange with Mercury Line supports business reasoning." },
  { id: "thumb_first_long_second_short_action_first_079", title: "Long first and short second phalange indicate action first", required: [eq("thumb.firstPhalange", "long"), eq("thumb.secondPhalange", "short")], category: "career", meaning: "Action may come before analysis when will exceeds logic." },
  { id: "thumb_first_short_second_long_thinker_080", title: "Short first and long second phalange indicate thinker pattern", required: [eq("thumb.firstPhalange", "short"), eq("thumb.secondPhalange", "long")], category: "education", meaning: "Thinking and analysis may be stronger than initiation." },
  { id: "thumb_equal_phalanges_balance_081", title: "Equal thumb phalanges indicate balance", required: [eq("thumb.firstPhalange", "medium"), eq("thumb.secondPhalange", "medium")], meaning: "Medium will and logic phalanges suggest balanced decision style." },
  { id: "thumb_long_sun_visible_public_will_082", title: "Long thumb with Sun Line indicates public will", required: [eq("thumb.length", "long"), eq("lines.sun.visible", true)], category: "fame", meaning: "Willpower supports public or creative ambition when Sun Line is visible." },
  { id: "thumb_long_fate_visible_career_control_083", title: "Long thumb with Fate Line indicates career self-direction", required: [eq("thumb.length", "long"), eq("lines.saturn.visible", true)], category: "career", meaning: "Long thumb with Fate Line supports career self-direction." },
  { id: "thumb_short_fate_visible_external_push_084", title: "Short thumb with Fate Line indicates external push", required: [eq("thumb.length", "short"), eq("lines.saturn.visible", true)], category: "career", meaning: "Career direction may exist, but external influence may be stronger." },
  { id: "thumb_closed_many_lines_inner_pressure_085", title: "Closed thumb with many lines indicates inner pressure", required: [eq("thumb.angle", "closed"), eq("palm.lineDensity", "many")], category: "remedy", meaning: "Guardedness and many lines suggest inner pressure." },
  { id: "thumb_wide_head_moon_imaginative_independence_086", title: "Wide thumb with Head Line to Moon indicates independent imagination", required: [eq("thumb.angle", "wide"), eq("lines.head.direction", "moon")], category: "spirituality", meaning: "Independence and imagination combine strongly." },
  { id: "thumb_long_heart_jupiter_high_standards_087", title: "Long thumb with Heart ending Jupiter indicates high standards", required: [eq("thumb.length", "long"), eq("lines.heart.ending", "jupiter")], category: "relationship", meaning: "Willpower and idealistic heart standards combine." },
  { id: "thumb_short_heart_mercury_light_attachment_088", title: "Short thumb with Heart ending Mercury indicates flexible attachment", required: [eq("thumb.length", "short"), eq("lines.heart.ending", "mercury")], category: "relationship", meaning: "Attachment may be more flexible and less fixed." },
  ...[
    ["thumb_unknown_no_thumb_claim_089", "thumb.length", "unknown", "No thumb-length claim should be made when thumb length is unknown."],
    ["thumb_angle_unknown_no_angle_claim_090", "thumb.angle", "unknown", "No thumb-angle claim should be made when thumb angle is unknown."],
    ["thumb_first_unknown_no_will_claim_091", "thumb.firstPhalange", "unknown", "No willpower phalange claim should be made when first phalange is unknown."],
    ["thumb_second_unknown_no_logic_claim_092", "thumb.secondPhalange", "unknown", "No logic phalange claim should be made when second phalange is unknown."],
  ].map(([id, feature, value, meaning]) => ({ id, title: meaning, required: [eq(feature, value)], category: "general" as PalmCategory, meaning, base: 0.35, priority: 20 })),
  { id: "thumb_long_supports_confidence_modifier_093", title: "Long thumb supports decision confidence", required: [eq("thumb.length", "long")], supporting: [eq("lines.head.clarity", "clear")], category: "career", meaning: "Long thumb can support confidence in decision-related rules.", base: 0.67 },
  { id: "thumb_short_reduces_certainty_modifier_094", title: "Short thumb reduces long-term decision certainty", required: [eq("thumb.length", "short")], category: "remedy", meaning: "Short thumb should reduce certainty in long-term decision claims.", base: 0.58 },
  { id: "thumb_balanced_supports_moderation_095", title: "Balanced thumb supports moderation", required: [eq("thumb.angle", "balanced")], meaning: "Balanced thumb angle supports moderate interpretation.", base: 0.63 },
);

const fingerSeeds: BatchSeed[] = [
  ["fingers_long_detail_096", "fingers.length", "long", "Long fingers suggest detail, planning and patience."],
  ["fingers_short_action_097", "fingers.length", "short", "Short fingers suggest action, execution and faster movement."],
  ["fingers_medium_balance_098", "fingers.length", "medium", "Medium fingers suggest balanced approach."],
  ["fingertips_square_practical_099", "fingers.tips", "square", "Square fingertips suggest practical method."],
  ["fingertips_conic_artistic_100", "fingers.tips", "conic", "Conic fingertips suggest artistic taste."],
  ["fingertips_pointed_idealistic_101", "fingers.tips", "pointed", "Pointed fingertips suggest idealism."],
  ["fingertips_spatulate_inventive_102", "fingers.tips", "spatulate", "Spatulate fingertips suggest invention and action."],
  ["fingertips_mixed_adaptive_103", "fingers.tips", "mixed", "Mixed fingertips suggest adaptive talents."],
  ["finger_setting_high_aspiration_104", "fingers.setting", "high", "High finger setting suggests aspiration."],
  ["finger_setting_low_practicality_105", "fingers.setting", "low", "Low finger setting suggests grounded practicality."],
  ["finger_setting_balanced_106", "fingers.setting", "balanced", "Balanced finger setting supports balanced expression."],
  ["finger_spacing_wide_independence_107", "fingers.spacing", "wide", "Wide finger spacing suggests independence."],
  ["finger_spacing_close_caution_108", "fingers.spacing", "close", "Close finger spacing suggests caution or reserve."],
  ["index_long_leadership_109", "fingers.indexRelative", "long", "Long index finger suggests leadership and ambition."],
  ["index_short_modesty_110", "fingers.indexRelative", "short", "Short index finger suggests modest ego expression."],
  ["ring_long_creativity_111", "fingers.ringRelative", "long", "Long ring finger suggests creativity and display appetite."],
  ["ring_short_low_display_112", "fingers.ringRelative", "short", "Short ring finger suggests lower need for display."],
  ["little_long_communication_113", "fingers.littleRelative", "long", "Long little finger suggests communication and business ability."],
  ["little_short_reserved_speech_114", "fingers.littleRelative", "short", "Short little finger suggests reserved speech."],
].map(([id, feature, value, meaning]) => ({ id, title: meaning, required: [eq(feature, value)], meaning })) as BatchSeed[];

fingerSeeds.push(
  ...[
    ["long_fingers_clear_head_research_115", "fingers.length", "long", "lines.head.clarity", "clear", "Long fingers with clear Head Line suggest research and detail skill.", "education"],
    ["short_fingers_deep_life_execution_116", "fingers.length", "short", "lines.life.depth", "deep", "Short fingers with deep Life Line suggest execution stamina.", "career"],
    ["conic_tips_sun_visible_art_117", "fingers.tips", "conic", "lines.sun.visible", true, "Conic tips with Sun Line support artistic visibility.", "fame"],
    ["square_tips_mercury_visible_practical_business_118", "fingers.tips", "square", "lines.mercury.visible", true, "Square tips with Mercury Line support practical business.", "wealth"],
    ["spatulate_tips_mars_strong_invention_119", "fingers.tips", "spatulate", "mounts.mars.prominence", "strong", "Spatulate tips with Mars strength support inventive action.", "career"],
    ["pointed_tips_moon_strong_idealism_120", "fingers.tips", "pointed", "mounts.moon.prominence", "strong", "Pointed tips with Moon strength suggest idealistic imagination.", "spirituality"],
    ["wide_spacing_wide_thumb_independent_121", "fingers.spacing", "wide", "thumb.angle", "wide", "Wide spacing with wide thumb supports independence.", "career"],
    ["close_spacing_closed_thumb_guarded_122", "fingers.spacing", "close", "thumb.angle", "closed", "Close spacing with closed thumb suggests guarded nature.", "relationship"],
    ["long_index_jupiter_strong_authority_123", "fingers.indexRelative", "long", "mounts.jupiter.prominence", "strong", "Long index with strong Jupiter supports authority desire.", "career"],
    ["long_ring_sun_visible_public_creativity_124", "fingers.ringRelative", "long", "lines.sun.visible", true, "Long ring finger with Sun Line supports public creativity.", "fame"],
    ["long_little_mercury_visible_business_125", "fingers.littleRelative", "long", "lines.mercury.visible", true, "Long little finger with Mercury Line supports business communication.", "wealth"],
    ["short_little_many_lines_speech_caution_126", "fingers.littleRelative", "short", "palm.lineDensity", "many", "Short little finger with many lines suggests communication caution.", "remedy"],
    ["long_fingers_many_lines_overanalysis_127", "fingers.length", "long", "palm.lineDensity", "many", "Long fingers with many lines can suggest over-analysis.", "remedy"],
    ["short_fingers_short_thumb_impulsive_128", "fingers.length", "short", "thumb.length", "short", "Short fingers with short thumb suggest impulsive action.", "remedy"],
  ].map(([id, f1, v1, f2, v2, meaning, category]) => ({ id: String(id), title: String(meaning), required: [eq(String(f1), v1 as string | boolean), eq(String(f2), v2 as string | boolean)], category: category as PalmCategory, meaning: String(meaning) })),
  { id: "mixed_tips_multi_talent_129", title: "Mixed fingertips indicate multi-domain talent", required: [eq("fingers.tips", "mixed")], category: "general", meaning: "Mixed fingertips suggest multi-domain talent." },
  ...[
    ["fingers_unknown_no_finger_claim_130", "fingers.length", "unknown", "No finger-length claim should be made when length is unknown."],
    ["tips_unknown_no_tip_claim_131", "fingers.tips", "unknown", "No fingertip claim should be made when tips are unknown."],
    ["setting_unknown_no_setting_claim_132", "fingers.setting", "unknown", "No finger-setting claim should be made when setting is unknown."],
    ["index_unknown_no_jupiter_finger_claim_133", "fingers.indexRelative", "unknown", "No index-finger claim should be made when index relation is unknown."],
    ["ring_unknown_no_apollo_finger_claim_134", "fingers.ringRelative", "unknown", "No ring-finger claim should be made when ring relation is unknown."],
    ["little_unknown_no_mercury_finger_claim_135", "fingers.littleRelative", "unknown", "No little-finger claim should be made when little relation is unknown."],
  ].map(([id, feature, value, meaning]) => ({ id, title: meaning, required: [eq(feature, value)], category: "general" as PalmCategory, meaning, base: 0.35, priority: 20 })),
);

const nailSeeds: BatchSeed[] = [
  ["nails_long_sensitivity_136", "nails.shape", "long", "Long nails suggest sensitivity and refinement.", "personality", "safe"],
  ["nails_short_impatience_137", "nails.shape", "short", "Short nails suggest action tendency and impatience.", "remedy", "safe"],
  ["nails_broad_directness_138", "nails.shape", "broad", "Broad nails suggest direct temperament.", "personality", "safe"],
  ["nails_narrow_sensitivity_139", "nails.shape", "narrow", "Narrow nails suggest sensitivity.", "personality", "safe"],
  ["nails_oval_balance_140", "nails.shape", "oval", "Oval nails suggest balanced refinement.", "personality", "safe"],
  ["nails_square_practical_141", "nails.shape", "square", "Square nails suggest practical temperament.", "career", "safe"],
  ["nails_pink_vitality_safe_142", "nails.color", "pink", "Pink nails can be used only as a guarded vitality-tone marker.", "health_vitality", "medical_guarded"],
  ["nails_pale_vitality_caution_143", "nails.color", "pale", "Pale nails should trigger only guarded vitality caution.", "health_vitality", "medical_guarded"],
  ["nails_reddish_intensity_144", "nails.color", "reddish", "Reddish nails suggest intensity.", "personality", "safe"],
  ["nails_bluish_medical_guarded_145", "nails.color", "bluish", "Bluish nails must never diagnose and only trigger wellness caution.", "health_vitality", "medical_guarded"],
  ["nails_yellowish_medical_guarded_146", "nails.color", "yellowish", "Yellowish nails must never diagnose and only trigger wellness caution.", "health_vitality", "medical_guarded"],
  ["nails_smooth_balance_147", "nails.texture", "smooth", "Smooth nails suggest balanced constitution tone.", "health_vitality", "medical_guarded"],
  ["nails_ridged_stress_caution_148", "nails.texture", "ridged", "Ridged nails should be framed only as stress or vitality caution.", "health_vitality", "medical_guarded"],
  ["nails_brittle_caution_149", "nails.texture", "brittle", "Brittle nails should be framed only as wellness caution.", "health_vitality", "medical_guarded"],
  ["nails_unknown_no_claim_150", "nails.shape", "unknown", "No nail-based claim should be made when nails are unknown.", "general", "safe"],
].map(([id, feature, value, meaning, category, riskLevel]) => ({ id, title: meaning, required: [eq(feature, value)], category: category as PalmCategory, riskLevel: riskLevel as PalmRuleRiskLevel, meaning, base: id === "nails_unknown_no_claim_150" ? 0.35 : 0.6, priority: id === "nails_unknown_no_claim_150" ? 20 : 55 })) as BatchSeed[];

export const BATCH1_HAND_SHAPE_RULES = handShapeSeeds.map(rule);
export const BATCH1_PALM_TEXTURE_RULES = textureSeeds.map(rule);
export const BATCH1_THUMB_RULES = thumbSeeds.map(rule);
export const BATCH1_FINGER_RULES = fingerSeeds.map(rule);
export const BATCH1_NAIL_RULES = nailSeeds.map(rule);

export const PHASE3A_BATCH1_RULES: PalmRule[] = [
  ...BATCH1_HAND_SHAPE_RULES,
  ...BATCH1_PALM_TEXTURE_RULES,
  ...BATCH1_THUMB_RULES,
  ...BATCH1_FINGER_RULES,
  ...BATCH1_NAIL_RULES,
];
