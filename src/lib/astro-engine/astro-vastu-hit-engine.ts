// src/lib/astro-engine/astro-vastu-hit-engine.ts
// ============================================================================
// ASTROLIFE ASTRO-VASTU HIT THEORY COMPUTATIONAL ENGINE (v1.0)
// ============================================================================
// Principles codified directly from authentic Astro-Vastu Hit Theory:
// 1. 360° Zodiac Compound Degree System (0°, 30°, 60° ... 330° + degreeInSign).
// 2. Exact "3 - 5 - 8" Orb Formula:
//    - Negative: 45° (±3° [42°-48°]), 90° (±5° [85°-95°]), 180° (±8° [172°-188°]).
//    - Positive: 30° (±3° [27°-33°]), 60° (±5° [55°-65°]), 120° (±8° [112°-128°]).
// 3. Specialized Astro-Vastu 12-Sign Direction Grid (1=E, 2=NW, 3=NNW, 4=NE... 8=SSW).
// 4. Two Hit Dimensions: Planet-to-House Hits & Planet-to-Planet "Cosmic Friction" Lock.
// 5. Active Dasha Priority (MD / AD / PD focus).
// 6. 120° Protective Shield Shifting Technique (180° किलर को 120° रक्षक ढाल में बदलना).
// 7. 12-Sign Human Body-Part Mapping for Dot/Thread Therapy.
// 8. Personal Astro-Vastu vs Generic MahaVastu Conflict Detection.
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import {
  runVastuPurushaMandalaEngine,
  MASTER_45_DEVATAS,
  getElementalBalancingGuide,
  evaluateOccultKundliDiagnostic,
  type VastuPurushaMandalaDossier,
  type DevataEntity,
  type NativeDevataMapping,
  type OccultKundliDiagnostic,
  type ElementalBarChartBalancing,
  type BrahmasthanSanctificationProtocol,
  type SubtleShastricDirectives,
} from "./vastu-purusha-mandala-engine";
import {
  evaluateAstroPrescriptionFormula,
  type AstroPharmacologicalPrescription,
} from "./astro-prescription-engine";

export {
  runVastuPurushaMandalaEngine,
  MASTER_45_DEVATAS,
  getElementalBalancingGuide,
  evaluateOccultKundliDiagnostic,
  type VastuPurushaMandalaDossier,
  type DevataEntity,
  type NativeDevataMapping,
  type OccultKundliDiagnostic,
  type ElementalBarChartBalancing,
  type BrahmasthanSanctificationProtocol,
  type SubtleShastricDirectives,
  evaluateAstroPrescriptionFormula,
  type AstroPharmacologicalPrescription,
};

// ── Types ───────────────────────────────────────────────────────────────────

export type HitCategory = "Negative" | "Positive";

export type HitAngleType = 45 | 90 | 180 | 30 | 60 | 120;

export interface HitDefinition {
  angle: HitAngleType;
  category: HitCategory;
  name: string;
  hindiName: string;
  orb: number;
  minDiff: number;
  maxDiff: number;
  severity: "Killer" | "Dangerous" | "Bad" | "Shield" | "Opportunity" | "Minor";
  description: string;
}

export interface AstroVastuDirection {
  signNum: number;
  signName: string;
  direction: string;
  directionHindi: string;
  code: string;
  notes: string;
}

export interface BodyPartMapping {
  signNum: number;
  signName: string;
  bodyPartEn: string;
  bodyPartHi: string;
  therapyNotes: string;
}

export interface EvaluatedHit {
  sourceType: "Planet";
  sourceName: string;
  sourceHouse: number;
  sourceSign: string;
  sourceSignNum: number;
  sourceDirection: string;
  sourceCompoundDeg: number;

  targetType: "House" | "Planet";
  targetName: string;
  targetHouse?: number;
  targetSign: string;
  targetSignNum: number;
  targetDirection: string;
  targetCompoundDeg: number;

  hitDef: HitDefinition;
  exactDiff: number;
  orbDistance: number;
  isUntenantedAlert?: boolean;
  effectSummary: string;
}

export interface TrafficPoliceBlockade {
  dashaLordRole: "MD" | "AD" | "PD";
  dashaLordName: string;
  blockingPlanet: string;
  hitAngle: 90 | 180;
  hitSeverity: "Dangerous" | "Killer";
  exactDiff: number;
  orbDistance: number;
  blockageTheme: string;
  physicalLocation: {
    direction: string;
    directionHindi: string;
    itemsToInspect: string[];
    actionRequired: string;
  };
}

export interface ShiftingPrescription {
  afflictedTarget: string; // e.g. "Lagna (Self)" or "House 4 (Domestic Peace)"
  problematicPlanet: string;
  currentHit: "180° Killer Hit" | "90° Dangerous Hit";
  targetHouse: number;
  targetSignNum: number;
  targetSignName: string;
  targetDirection: string;
  targetDirectionHindi: string;
  shiftingMethod: string;
  itemsToPlace: string[];
  itemsToRemoveFromCurrentZone: string[];
  bodyPartTherapy: {
    targetBodyPart: string;
    action: "Dot" | "Remove_Thread" | "Apply_Oil_Ghee";
    color?: string;
    instructions: string;
  };
}

export interface GenericVastuConflict {
  zoneCode: string;
  zoneName: string;
  genericRule: string;
  personalAstroVastuReality: string;
  dangerLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  recommendation: string;
}

export interface StudyAndWorkDirection {
  fourthHouseSign: string;
  fourthHouseDirection: string;
  fourthHouseHindi: string;
  ninthHouseSign: string;
  ninthHouseDirection: string;
  ninthHouseHindi: string;
  tenthHouseSign: string;
  tenthHouseDirection: string;
  tenthHouseHindi: string;
  recommendedStudyZone: string;
  recommendedStudyZoneHindi: string;
  recommendedOnlineWorkZone: string;
  recommendedOnlineWorkZoneHindi: string;
  rationale: string;
}

export interface MarsDietaryLifestyleProtocol {
  isMarsAfflicted: boolean;
  afflictionType?: string;
  prohibitedDiet: string[];
  prohibitedItems: string[];
  recommendedReplacements: string[];
  directiveText: string;
}

export interface WristThreadTrapAlert {
  geminiHouse: number;
  isDusthana: boolean;
  severity: "CRITICAL" | "HIGH" | "NONE";
  alertTitle: string;
  explanation: string;
  correctiveAction: string;
}

export interface PlanetCoordinateRow {
  name: string;
  hindiName: string;
  house: number;
  sign: string;
  signHindi: string;
  signNum: number;
  degInSign: number;
  degInSignFormatted: string;
  startDeg: number;
  compoundDeg: number;
  compoundDegFormatted: string;
  nakshatra: string;
  nakshatraLord: string;
  direction: AstroVastuDirection;
  isUntenanted: boolean;
}

export interface HouseCuspCoordinateRow {
  house: number;
  sign: string;
  signHindi: string;
  signNum: number;
  degInSign: number;
  degInSignFormatted: string;
  startDeg: number;
  compoundDeg: number;
  compoundDegFormatted: string;
  direction: AstroVastuDirection;
}

export interface PlanetaryCluster {
  house: number;
  sign: string;
  signHindi: string;
  signNum: number;
  direction: AstroVastuDirection;
  planets: string[];
  isPowerCenter: boolean;
  narrative: string;
}

export interface DashaLordHitNarrative {
  hitTitle: string;
  hitAngle: number;
  severity: "Killer" | "Dangerous" | "Bad" | "Shield";
  sourcePlanet: string;
  sourceCompoundDeg: number;
  targetName: string;
  targetCompoundDeg: number;
  exactDiff: number;
  effectiveDiff: number;
  orbDistance: number;
  orbLimit: number;
  calculationFormula: string;
  predictiveNarrative: string;
  realLifeSymptoms: string[];
}

export interface SpatialZoneDiagnostic {
  zoneCode: string;
  zoneName: string;
  directionHindi: string;
  signName: string;
  signHindi: string;
  signNum: number;
  houseNumbers: number[];
  planetsPresent: string[];
  isCluster: boolean;
  isDashaLordZone: boolean;
  isAfflictedByHits: boolean;
  predictedItemsParagraph: string;
  mahaVastuWarningParagraph?: string;
  correctiveActionParagraph: string;
}

export interface BodyPartPlanetOccupant {
  name: string;
  hindi: string;
  degreesFormatted: string;
  compoundDeg: number;
  isDashaLord: boolean;
  isBenefic: boolean;
}

export interface BodyPartActiveHit {
  aspectName: string;
  hittingPlanet: string;
  angle: number;
  severity: "Killer" | "Dangerous" | "Bad" | "Shield" | "Opportunity" | "Minor";
  orbDeg: number;
}

export interface BodyPartRemedyItem {
  signNum: number;
  signName: string;
  signHindi: string;
  bodyPartHi: string;
  bodyPartEn: string;
  houseNum: number;
  houseNameHi: string;
  planetsInSign: BodyPartPlanetOccupant[];
  activeHits: BodyPartActiveHit[];
  statusVerdict: {
    statusType: "critical_hit" | "dangerous_hit" | "dasha_active" | "dusthana_warning" | "shielded" | "balanced";
    badgeText: string;
    badgeColor: string;
    summaryText: string;
  };
  personalizedDiagnosis: string;
  dotColor: string;
  dotSubstance: string;
  dotApplicationRules: string;
  threadColor: string;
  isThreadHarmful: boolean;
  threadVerdict: string;
  associatedPlanets: string[];
}

export interface AstroVastuHitDossier {
  nativeName: string;
  lagnaSign: string;
  lagnaSignHindi: string;
  lagnaSignNum: number;
  lagnaCompoundDeg: number;
  activeDasha: {
    mahadasha: string;
    antardasha: string;
    pratyantardasha?: string;
    mahadashaStart?: string;
    mahadashaEnd?: string;
    antardashaStart?: string;
    antardashaEnd?: string;
  };
  planetCoordinates: PlanetCoordinateRow[];
  cuspCoordinates: HouseCuspCoordinateRow[];
  clusters: PlanetaryCluster[];
  dashaLordHitsAnalysis: DashaLordHitNarrative[];
  spatialFieldTest: SpatialZoneDiagnostic[];
  trafficPoliceBlockades: TrafficPoliceBlockade[];
  cosmicFrictionLocks: TrafficPoliceBlockade[];
  astroPrescription: AstroPharmacologicalPrescription;
  killerHits180: EvaluatedHit[];
  dangerousHits90: EvaluatedHit[];
  badHits45: EvaluatedHit[];
  supportiveHits60: EvaluatedHit[];
  protectiveShields120: EvaluatedHit[];
  allHits: EvaluatedHit[];
  shiftingPrescriptions: ShiftingPrescription[];
  bodyPartRemedyRegistry: BodyPartRemedyItem[];
  genericVastuConflicts: GenericVastuConflict[];
  directionPlanetaryInventory: Record<string, { sign: string; signNum: number; planets: string[]; karakaObjects: string[] }>;
  familyCrossHitIsolationRule: {
    title: string;
    rule: string;
    practicalAdvice: string;
  };
  studyAndWorkDirection: StudyAndWorkDirection;
  marsDietaryLifestyleProtocol: MarsDietaryLifestyleProtocol;
  wristThreadTrapAlert: WristThreadTrapAlert;
  mandalaDossier: VastuPurushaMandalaDossier;
}

export const RASHIS_HINDI: Record<number, string> = {
  1: "मेष", 2: "वृषभ", 3: "मिथुन", 4: "कर्क", 5: "सिंह", 6: "कन्या",
  7: "तुला", 8: "वृश्चिक", 9: "धनु", 10: "मकर", 11: "कुंभ", 12: "मीन"
};

export const PLANETS_HINDI: Record<string, string> = {
  Sun: "सूर्य (Sun)", Moon: "चंद्र (Moon)", Mars: "मंगल (Mars)", Mercury: "बुध (Mercury)",
  Jupiter: "गुरु (Jupiter)", Venus: "शुक्र (Venus)", Saturn: "शनि (Saturn)", Rahu: "राहु (Rahu)", Ketu: "केतु (Ketu)"
};

// ── Master Definitions & Constants ──────────────────────────────────────────

export const RASHIS_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

/**
 * 12 Signs mapped to Directions in Astro-Vastu Hit Theory.
 */
export const ASTRO_VASTU_SIGN_DIRECTIONS: Record<number, AstroVastuDirection> = {
  1: { signNum: 1, signName: "Aries", direction: "East", directionHindi: "पूर्व", code: "E", notes: "0° to 30° - Surya & Mangal domain" },
  2: { signNum: 2, signName: "Taurus", direction: "North-West", directionHindi: "उत्तर-पश्चिम (वायव्य)", code: "NW", notes: "30° to 60° - Shukra domain" },
  3: { signNum: 3, signName: "Gemini", direction: "North-North-West", directionHindi: "उत्तर-उत्तर-पश्चिम (NNW/NW)", code: "NNW", notes: "60° to 90° - Budh domain" },
  4: { signNum: 4, signName: "Cancer", direction: "North-East", directionHindi: "उत्तर-पूर्व (ईशान)", code: "NE", notes: "90° to 120° - Chandra domain" },
  5: { signNum: 5, signName: "Leo", direction: "East-North-East", directionHindi: "पूर्व-उत्तर-पूर्व (ENE)", code: "ENE", notes: "120° to 150° - Surya domain" },
  6: { signNum: 6, signName: "Virgo", direction: "North", directionHindi: "उत्तर", code: "N", notes: "150° to 180° - Budh/Kubera domain" },
  7: { signNum: 7, signName: "Libra", direction: "West-South-West", directionHindi: "पश्चिम-दक्षिण-पश्चिम (WSW)", code: "WSW", notes: "180° to 210° - Shukra domain" },
  8: { signNum: 8, signName: "Scorpio", direction: "South-South-West", directionHindi: "दक्षिण-दक्षिण-पश्चिम (SSW)", code: "SSW", notes: "210° to 240° - 95% SSW focus (rarely SW)" },
  9: { signNum: 9, signName: "Sagittarius", direction: "North-East", directionHindi: "उत्तर-पूर्व (NE/NNE)", code: "NE", notes: "240° to 270° - Guru/Dharma domain" },
  10: { signNum: 10, signName: "Capricorn", direction: "South", directionHindi: "दक्षिण (South/SSE)", code: "S", notes: "270° to 300° - Shani domain" },
  11: { signNum: 11, signName: "Aquarius", direction: "West", directionHindi: "पश्चिम (West/WSW)", code: "W", notes: "300° to 330° - Shani/Varuna domain" },
  12: { signNum: 12, signName: "Pisces", direction: "South-East", directionHindi: "दक्षिण-पूर्व (SE/ESE)", code: "SE", notes: "330° to 360° - Guru/Moksha domain" },
};

/**
 * 12 Signs mapped to Human Body Parts for Dot/Thread Therapy.
 */
export const SIGN_BODY_PART_MAPPINGS: Record<number, BodyPartMapping> = {
  1: { signNum: 1, signName: "Aries", bodyPartEn: "Head & Face", bodyPartHi: "सिर एवं चेहरा", therapyNotes: "माथा, मस्तिष्क, चेहरे पर तिल/डॉट" },
  2: { signNum: 2, signName: "Taurus", bodyPartEn: "Neck & Throat", bodyPartHi: "गला एवं वाणी", therapyNotes: "गले में धागा/कंठहार का ध्यान रखें" },
  3: { signNum: 3, signName: "Gemini", bodyPartEn: "Shoulders, Arms & Wrists", bodyPartHi: "कंधे, बाजुएं एवं कलाई", therapyNotes: "कलाई सीधे मिथुन (3) को सक्रिय करती है। यदि मिथुन 8वें/12वें भाव में हो तो कलाई पर धागे बांधना तुरंत तनाव, चिंता व मित्रों से अलगाव लाता है।" },
  4: { signNum: 4, signName: "Cancer", bodyPartEn: "Chest & Lungs", bodyPartHi: "छाती एवं फेफड़े", therapyNotes: "हृदय के ऊपर का हिस्सा, भावनात्मक केंद्र" },
  5: { signNum: 5, signName: "Leo", bodyPartEn: "Upper Stomach & Heart", bodyPartHi: "हृदय एवं ऊपरी पेट", therapyNotes: "सोलर प्लेक्सस, आत्मविश्वास केंद्र" },
  6: { signNum: 6, signName: "Virgo", bodyPartEn: "Navel & 2-inch perimeter", bodyPartHi: "नाभि एवं नाभि के 2 इंच का क्षेत्र", therapyNotes: "नाभि के ठीक 2 इंच ऊपर या 2 इंच नीचे ही डॉट लगाएं, उससे बाहर नहीं जाना। नाभि पर 2 बूंद शुद्ध गाय का घी लगाना स्वास्थ्य व बुध को तुरंत स्थिरता देता है।" },
  7: { signNum: 7, signName: "Libra", bodyPartEn: "Waist & Lower Abdomen", bodyPartHi: "कमर एवं पेडू", therapyNotes: "कमर के आसपास का संतुलन" },
  8: { signNum: 8, signName: "Scorpio", bodyPartEn: "Genitals & Excretory Organs", bodyPartHi: "गुप्तांग एवं उत्सर्जन तंत्र", therapyNotes: "मूल ऊर्जा व हार्मोनल संतुलन" },
  9: { signNum: 9, signName: "Sagittarius", bodyPartEn: "Thighs", bodyPartHi: "जांघें", therapyNotes: "चलने-फिरने व गति का केंद्र" },
  10: { signNum: 10, signName: "Capricorn", bodyPartEn: "Knees", bodyPartHi: "घुटने (स्त्री बायां, पुरुष दायां)", therapyNotes: "घुटने पर काला डॉट लगाना 180° शनि की हिट को 120° में बदल देता है" },
  11: { signNum: 11, signName: "Aquarius", bodyPartEn: "Calves, Shins & Ankles", bodyPartHi: "पिंडलियां एवं टखने", therapyNotes: "टखनों पर तेल मालिश या काला धागा वर्जित/अनुशंसित" },
  12: { signNum: 12, signName: "Pisces", bodyPartEn: "Feet & Soles", bodyPartHi: "पैर एवं तलवे", therapyNotes: "तलवों पर मालिश से राहु/शनि का प्रभाव शांत होता है" },
};

/**
 * 3-5-8 Rule Master Definitions.
 */
export const HIT_DEFINITIONS: Record<HitAngleType, HitDefinition> = {
  45: {
    angle: 45,
    category: "Negative",
    name: "45° Bad Hit",
    hindiName: "45° कष्टकारी हिट",
    orb: 3,
    minDiff: 42,
    maxDiff: 48,
    severity: "Bad",
    description: "मानसिक तनाव, असुविधा और बार-बार होने वाली छोटी-मोटी परेशानियां पैदा करती है।"
  },
  90: {
    angle: 90,
    category: "Negative",
    name: "90° Dangerous Hit",
    hindiName: "90° खतरनाक / अवरोधक हिट",
    orb: 5,
    minDiff: 85,
    maxDiff: 95,
    severity: "Dangerous",
    description: "अत्यधिक गंभीर रुकावट। कॉस्मिक फ्रिक्शन लॉक की तरह कार्य को पूर्णतः रोक देती है।"
  },
  180: {
    angle: 180,
    category: "Negative",
    name: "180° Killer Hit",
    hindiName: "180° किलर हिट (घातक / विनाशकारी)",
    orb: 8,
    minDiff: 172,
    maxDiff: 188,
    severity: "Killer",
    description: "घातक किलर हिट — जिस भाव या ग्रह पर पड़े, वहां दुर्घटना, सर्जरी, विच्छेद या भारी संकट लाती है।"
  },
  30: {
    angle: 30,
    category: "Positive",
    name: "30° Minor Benefic",
    hindiName: "30° सौम्य शुभ दृष्टि",
    orb: 3,
    minDiff: 27,
    maxDiff: 33,
    severity: "Minor",
    description: "हल्की सकारात्मक सहायता और दैनिक कार्यों में सुविधा देती है।"
  },
  60: {
    angle: 60,
    category: "Positive",
    name: "60° Opportunity Sextile",
    hindiName: "60° अवसर एवं सहयोग कोण",
    orb: 5,
    minDiff: 55,
    maxDiff: 65,
    severity: "Opportunity",
    description: "प्रयास करने पर नए अवसर, मित्रों का सहयोग और सहज मार्ग प्रशस्त करती है।"
  },
  120: {
    angle: 120,
    category: "Positive",
    name: "120° Protector Shield",
    hindiName: "120° रक्षक ढाल (कवच)",
    orb: 8,
    minDiff: 112,
    maxDiff: 128,
    severity: "Shield",
    description: "परम रक्षक ढाल! जो ग्रह किलर मूड में मार रहा था, वह यहाँ आकर जातक की रक्षा करने वाली ढाल बन जाता है।"
  },
};

/**
 * Physical Karakatva Objects for each planet (used to inspect household clutter).
 */
export const PLANET_KARAKA_OBJECTS: Record<string, string[]> = {
  Sun: ["तांबे के बर्तन", "तेज रोशनी/लैंप", "सरकारी दस्तावेज", "पिता की तस्वीर", "माणिक्य/लाल रत्न", "लकड़ी का भारी फर्नीचर"],
  Moon: ["पीने का पानी/RO/मटका", "चांदी की वस्तुएं", "दूध/सफेद तरल", "चावल का भंडार", "माता की वस्तुएं", "दर्पण/आईना"],
  Mars: ["गैस चूल्हा/गैस गीज़र", "मेन बिजली मीटर/इनवर्टर", "लाल डिब्बे/लाल पर्दे", "चाकू/कैंची/धारदार औजार", "हथियार", "लाल मिर्च/सिंदूर/मौली"],
  Mercury: ["किताबों का ढेर/फाइलें", "हरे इंडोर पौधे/गमले/तुलसी", "लैपटॉप/वाई-फाई राउटर/स्पीकर", "हरा धागा", "स्टेशनरी", "कांच का सामान"],
  Jupiter: ["पूजा का मंदिर/धार्मिक पुस्तकें", "पीले वस्त्र/हल्दी/चना दाल", "सोने के आभूषण", "गुरु/संतों की तस्वीरें", "कांस्य के बर्तन"],
  Venus: ["मेकअप व सौंदर्य प्रसाधन", "परफ्यूम/इत्र", "सिल्क के कपड़े/पर्दे", "सफेद संगमरमर", "कलात्मक पेंटिंग्स", "डिजाइनर कपड़े"],
  Saturn: ["जंग लगा पुराना लोहा", "कबाड़/टूटी मशीनरी", "पुराने काले जूते-चप्पल", "सरसों का तेल", "काले कपड़े/कंबल", "सीमेंट/कोयला/रद्दी"],
  Rahu: ["खराब/बंद पड़े इलेक्ट्रॉनिक्स", "तारों का उलझा गुच्छा", "बंद घड़ियां", "नीला/ग्रे कबाड़", "सीलन व धुएं की जगह", "टॉयलेट डस्टबिन"],
  Ketu: ["झंडे/पताका", "सिलाई मशीन/धागे", "पूजा की राख/धूनी", "कुत्तों का सामान", "आध्यात्मिक ध्यान कुशन", "कटे-फटे पुराने वस्त्र"],
};

// ── Core Helper Functions ───────────────────────────────────────────────────

/**
 * Calculates compound degree: Sign Start (0°, 30°, 60°...) + Degree in Sign.
 */
export function calculateCompoundDegree(signNum: number, degreeInSign: number): number {
  const normalizedSign = ((signNum - 1) % 12 + 12) % 12; // 0 to 11
  const baseStart = normalizedSign * 30;
  return baseStart + (degreeInSign % 30);
}

/**
 * Evaluates angular difference between two compound degrees and checks 3-5-8 Rule.
 */
export function check358Hit(deg1: number, deg2: number): { hitDef: HitDefinition; exactDiff: number; orbDistance: number } | null {
  let diff = Math.abs(deg1 - deg2) % 360;
  if (diff > 180) diff = 360 - diff;

  const hitAngles: HitAngleType[] = [45, 90, 180, 30, 60, 120];
  for (const angle of hitAngles) {
    const def = HIT_DEFINITIONS[angle];
    if (diff >= def.minDiff && diff <= def.maxDiff) {
      return {
        hitDef: def,
        exactDiff: Math.round(diff * 100) / 100,
        orbDistance: Math.round(Math.abs(diff - angle) * 100) / 100,
      };
    }
  }
  return null;
}

/**
 * Canonical 1-indexed sign number (1 = Aries ... 12 = Pisces).
 * Always prioritizes the text sign name when available to prevent
 * 0-indexed (0..11) vs 1-indexed (1..12) mismatches.
 */
export function getSignNumber(signNameOrNum?: string | number, signStringFallback?: string): number {
  const candidateStr = typeof signNameOrNum === "string" ? signNameOrNum : signStringFallback;
  if (candidateStr && typeof candidateStr === "string") {
    const idx = RASHIS_ORDER.findIndex(r => r.toLowerCase() === candidateStr.toLowerCase());
    if (idx >= 0) return idx + 1;
  }
  if (typeof signNameOrNum === "number") {
    if (signNameOrNum === 0) return 1;
    if (signNameOrNum >= 1 && signNameOrNum <= 12) return signNameOrNum;
  }
  return 1;
}

// ── Master Engine Function ──────────────────────────────────────────────────

/**
 * Runs the full Astro-Vastu Hit Theory calculation on any chart.
 */
export function runAstroVastuHitEngine(
  chart: ChartData | null | undefined,
  evaluationDate: Date = new Date()
): AstroVastuHitDossier | null {
  if (!chart || !chart.planets) {
    return null;
  }

  // Helper for resilient planet data access (handles titlecase, lowercase, or named objects)
  const getPlanetData = (p: string) => {
    if (!chart?.planets) return undefined;
    if (chart.planets[p]) return chart.planets[p];
    if (chart.planets[p.toLowerCase()]) return chart.planets[p.toLowerCase()];
    const entry = Object.entries(chart.planets).find(
      ([k, v]: [string, any]) =>
        k.toLowerCase() === p.toLowerCase() ||
        (v?.name && String(v.name).toLowerCase() === p.toLowerCase()) ||
        (v?.planet && String(v.planet).toLowerCase() === p.toLowerCase())
    );
    return entry ? entry[1] : undefined;
  };

  const resolveLagnaSign = (): string => {
    if (typeof chart.lagnaRashi === "string" && chart.lagnaRashi.trim()) return chart.lagnaRashi.trim();
    if (typeof (chart as any).ascendant?.sign === "string") return (chart as any).ascendant.sign;
    if (typeof (chart as any).lagna?.sign === "string") return (chart as any).lagna.sign;
    if (typeof (chart as any).ascendant === "string") return (chart as any).ascendant;
    if (typeof (chart as any).lagna === "string") return (chart as any).lagna;
    if (typeof chart.lagnaLon === "number") {
      const idx = Math.floor((((chart.lagnaLon % 360) + 360) % 360) / 30);
      return RASHIS_ORDER[idx] || "Aries";
    }
    if (typeof chart.lagnaNum === "number") {
      if (chart.lagnaNum >= 0 && chart.lagnaNum <= 11) return RASHIS_ORDER[chart.lagnaNum];
      if (chart.lagnaNum === 12) return "Pisces";
    }
    return "Aries";
  };

  const lagnaSign = resolveLagnaSign();
  const lagnaSignNum = getSignNumber(lagnaSign, typeof chart.lagnaRashi === "string" ? chart.lagnaRashi : undefined);
  const lagnaDegInSign = (chart.lagnaLon ?? 0) % 30;
  const lagnaCompoundDeg = calculateCompoundDegree(lagnaSignNum, lagnaDegInSign);

  // 1. Resolve Active Dasha Lords
  const moonData = getPlanetData("Moon");
  const fallbackLord = moonData?.nakshatraLord || "Sun";

  let activeMD = chart.dashas?.find(d => {
    const s = new Date(d.start), e = new Date(d.end);
    return evaluationDate >= s && evaluationDate < e;
  })?.planet || chart.dashas?.find(d => d.active)?.planet || (chart as any).currentDasha?.mahadasha || fallbackLord;

  let activeAD = chart.antardasha?.find(a => {
    const s = new Date(a.start), e = new Date(a.end);
    return evaluationDate >= s && evaluationDate < e;
  })?.planet || chart.antardasha?.find(a => a.active)?.planet || (chart as any).currentDasha?.antardasha || activeMD;

  // 2. Build Planet Coordinates Map
  const planetCoords: Record<string, {
    name: string;
    house: number;
    sign: string;
    signNum: number;
    degInSign: number;
    compoundDeg: number;
    direction: AstroVastuDirection;
    nakshatra: string;
    isUntenanted: boolean;
  }> = {};

  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  // Find all nakshatra lords to detect Untenanted planets
  const occupiedNakLords = new Set<string>();
  planetNames.forEach(p => {
    const d = getPlanetData(p);
    if (d?.nakshatraLord) occupiedNakLords.add(d.nakshatraLord);
  });

  planetNames.forEach(p => {
    const d = getPlanetData(p);
    if (!d) return;
    const sNum = getSignNumber(d.sign, d.sign);
    const deg = (d.degree || 0) + (d.minutes || 0) / 60;
    const compound = calculateCompoundDegree(sNum, deg);
    const dir = ASTRO_VASTU_SIGN_DIRECTIONS[sNum];
    const isUntenanted = !occupiedNakLords.has(p);

    planetCoords[p] = {
      name: p,
      house: d.house || d.rashiHouse || 1,
      sign: d.sign,
      signNum: sNum,
      degInSign: deg,
      compoundDeg: compound,
      direction: dir,
      nakshatra: d.nakshatra,
      isUntenanted,
    };
  });

  // 3. Build House Cusps Map
  const cuspCoords: Record<number, {
    house: number;
    sign: string;
    signNum: number;
    degInSign: number;
    compoundDeg: number;
    direction: AstroVastuDirection;
  }> = {};

  if (chart.houseCusps && chart.houseCusps.length >= 12) {
    chart.houseCusps.forEach(hc => {
      const sNum = getSignNumber(hc.sign, hc.sign);
      const deg = (hc.degree || 0) + (hc.minutes || 0) / 60;
      const compound = calculateCompoundDegree(sNum, deg);
      cuspCoords[hc.house] = {
        house: hc.house,
        sign: hc.sign,
        signNum: sNum,
        degInSign: deg,
        compoundDeg: compound,
        direction: ASTRO_VASTU_SIGN_DIRECTIONS[sNum],
      };
    });
  } else {
    // Equal bhava fallback starting from Lagna
    for (let h = 1; h <= 12; h++) {
      const sNum = ((lagnaSignNum - 1 + (h - 1)) % 12) + 1;
      const compound = calculateCompoundDegree(sNum, lagnaDegInSign);
      cuspCoords[h] = {
        house: h,
        sign: RASHIS_ORDER[sNum - 1],
        signNum: sNum,
        degInSign: lagnaDegInSign,
        compoundDeg: compound,
        direction: ASTRO_VASTU_SIGN_DIRECTIONS[sNum],
      };
    }
  }

  // 4. Evaluate Planet-to-House Hits
  const allHits: EvaluatedHit[] = [];

  planetNames.forEach(p => {
    const pl = planetCoords[p];
    if (!pl) return;

    for (let h = 1; h <= 12; h++) {
      const cs = cuspCoords[h];
      if (!cs) continue;

      const hit = check358Hit(pl.compoundDeg, cs.compoundDeg);
      if (hit) {
        allHits.push({
          sourceType: "Planet",
          sourceName: pl.name,
          sourceHouse: pl.house,
          sourceSign: pl.sign,
          sourceSignNum: pl.signNum,
          sourceDirection: pl.direction.direction,
          sourceCompoundDeg: pl.compoundDeg,
          targetType: "House",
          targetName: `House ${h} (${cs.sign})`,
          targetHouse: h,
          targetSign: cs.sign,
          targetSignNum: cs.signNum,
          targetDirection: cs.direction.direction,
          targetCompoundDeg: cs.compoundDeg,
          hitDef: hit.hitDef,
          exactDiff: hit.exactDiff,
          orbDistance: hit.orbDistance,
          isUntenantedAlert: pl.isUntenanted,
          effectSummary: `${pl.name} (H${pl.house} ${pl.direction.direction}) casts ${hit.hitDef.name} on House ${h} (${cs.direction.direction})`,
        });
      }
    }
  });

  // 5. Evaluate Planet-to-Planet Hits & Cosmic Friction Locks
  const trafficPoliceBlockades: TrafficPoliceBlockade[] = [];

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const p1 = planetCoords[planetNames[i]];
      const p2 = planetCoords[planetNames[j]];
      if (!p1 || !p2) continue;

      const hit = check358Hit(p1.compoundDeg, p2.compoundDeg);
      if (hit) {
        allHits.push({
          sourceType: "Planet",
          sourceName: p1.name,
          sourceHouse: p1.house,
          sourceSign: p1.sign,
          sourceSignNum: p1.signNum,
          sourceDirection: p1.direction.direction,
          sourceCompoundDeg: p1.compoundDeg,
          targetType: "Planet",
          targetName: p2.name,
          targetHouse: p2.house,
          targetSign: p2.sign,
          targetSignNum: p2.signNum,
          targetDirection: p2.direction.direction,
          targetCompoundDeg: p2.compoundDeg,
          hitDef: hit.hitDef,
          exactDiff: hit.exactDiff,
          orbDistance: hit.orbDistance,
          effectSummary: `${p1.name} (H${p1.house}) <-> ${p2.name} (H${p2.house}) mutually form ${hit.hitDef.name}`,
        });

        // Check if either planet is the active Dasha Lord being stopped!
        const dashaRoles: { lord: string; role: "MD" | "AD" | "PD" }[] = [
          { lord: activeMD, role: "MD" },
          { lord: activeAD, role: "AD" },
        ];

        dashaRoles.forEach(({ lord, role }) => {
          if (hit.hitDef.angle === 90 || hit.hitDef.angle === 180) {
            let blocker: typeof p1 | null = null;
            if (p1.name === lord && p2.name !== lord) blocker = p2;
            else if (p2.name === lord && p1.name !== lord) blocker = p1;

            if (blocker) {
              const items = PLANET_KARAKA_OBJECTS[blocker.name] || [];
              trafficPoliceBlockades.push({
                dashaLordRole: role,
                dashaLordName: lord,
                blockingPlanet: blocker.name,
                hitAngle: hit.hitDef.angle as 90 | 180,
                hitSeverity: hit.hitDef.angle === 180 ? "Killer" : "Dangerous",
                exactDiff: hit.exactDiff,
                orbDistance: hit.orbDistance,
                blockageTheme: `${blocker.name} creates a Cosmic Friction Lock stopping ${role} Lord ${lord} with a ${hit.hitDef.name}, detaining its positive results!`,
                physicalLocation: {
                  direction: blocker.direction.direction,
                  directionHindi: blocker.direction.directionHindi,
                  itemsToInspect: items,
                  actionRequired: `Inspect the ${blocker.direction.direction} zone. Remove or neutralize any ${blocker.name}-related objects (${items.slice(0, 3).join(", ")}) immediately to free ${lord} from lockup!`,
                },
              });
            }
          }
        });
      }
    }
  }

  // 6. Partition Hits by Category and Severity
  const killerHits180 = allHits.filter(h => h.hitDef.angle === 180 && h.hitDef.category === "Negative");
  const dangerousHits90 = allHits.filter(h => h.hitDef.angle === 90 && h.hitDef.category === "Negative");
  const badHits45 = allHits.filter(h => h.hitDef.angle === 45 && h.hitDef.category === "Negative");
  const supportiveHits60 = allHits.filter(h => h.hitDef.angle === 60 && h.hitDef.category === "Positive");
  const protectiveShields120 = allHits.filter(h => h.hitDef.angle === 120 && h.hitDef.category === "Positive");

  // 7. Generate Shifting Prescriptions (Turning Blockades & 180°/90° Hits into 120° Shield)
  const shiftingPrescriptions: ShiftingPrescription[] = [];
  const processedPlanets = new Set<string>();

  // A. First: Address EVERY Cosmic Friction blocker holding up the Dasha Lord!
  // Astro-Vastu Shastric Rule: "जिस ग्रह ने दशा स्वामी को रोक रखा है (Cosmic Friction Lock), उसी के सामान को 120° त्रिकोण मित्र दिशा में शिफ्ट करना है!"
  trafficPoliceBlockades.forEach(blockade => {
    const plName = blockade.blockingPlanet;
    if (processedPlanets.has(plName)) return;
    processedPlanets.add(plName);

    const plCoord = planetCoords[plName];
    if (!plCoord) return;

    // Source sign of the blocker
    const sourceSign = plCoord.signNum;
    // 120° trine is 5th or 9th sign from source sign
    const targetSignNum = ((sourceSign - 1 + 4) % 12) + 1;
    const targetDir = ASTRO_VASTU_SIGN_DIRECTIONS[targetSignNum];
    const targetHouse = Object.values(cuspCoords).find(c => c.signNum === targetSignNum)?.house || ((plCoord.house - 1 + 4) % 12) + 1;
    const bodyMapping = SIGN_BODY_PART_MAPPINGS[targetSignNum] || SIGN_BODY_PART_MAPPINGS[1];
    const items = PLANET_KARAKA_OBJECTS[plName] || [];

    const placeItems: string[] = [];
    if (plName === "Mars") placeItems.push("सिंदूरी हनुमान जी का चित्र", "तांबे का त्रिकोण यंत्र");
    else if (plName === "Saturn") placeItems.push("शनि का स्वच्छ प्रतीक", "काले चने/उड़द का पात्र", "लोहे का स्वच्छ छल्ला/घोड़े की नाल");
    else if (plName === "Moon") placeItems.push("चांदी का चौकोर सिक्का", "स्वच्छ जल कलश/चांदी का पात्र");
    else if (plName === "Sun") placeItems.push("तांबे का सूर्य यंत्र", "पिता का आशीर्वाद स्वरूप उपहार");
    else if (plName === "Mercury") placeItems.push("हरा इनडोर पौधा (तुलसी/मनी प्लांट)", "बुध यंत्र");
    else if (plName === "Jupiter") placeItems.push("पीतल की घंटी", "केसर/हल्दी स्वस्तिक", "श्रीयंत्र");
    else if (plName === "Venus") placeItems.push("सफेद सुगंधित फूल", "कपूर की कटोरी", "सफेद संगमरमर कलाकृति");
    else if (plName === "Rahu") placeItems.push("ठोस चांदी का टुकड़ा", "नीला क्रिस्टल");
    else placeItems.push(`${plName} का शुभ सात्विक प्रतीक`);

    shiftingPrescriptions.push({
      afflictedTarget: `दशा स्वामी ${blockade.dashaLordName}`,
      problematicPlanet: plName,
      currentHit: blockade.hitAngle === 180 ? "180° Killer Hit" : "90° Dangerous Hit",
      targetHouse,
      targetSignNum,
      targetSignName: targetDir.signName,
      targetDirection: targetDir.direction,
      targetDirectionHindi: targetDir.directionHindi,
      shiftingMethod: `दशा स्वामी ${blockade.dashaLordName} को ${plName} द्वारा 90°/180° के जाम से मुक्त करने के लिए ${plName} के सामान को वर्तमान दिशा (${plCoord.direction.code} - ${plCoord.direction.directionHindi}) से हटाकर इसकी 120° त्रिकोण मित्र दिशा (${targetDir.code} - ${targetDir.directionHindi}) में स्थापित करें। इससे रुकावट तुरंत 120° सुरक्षा कवच में परिवर्तित हो जाएगी।`,
      itemsToPlace: placeItems,
      itemsToRemoveFromCurrentZone: items.slice(0, 4),
      bodyPartTherapy: {
        targetBodyPart: bodyMapping.bodyPartHi,
        action: plName === "Saturn" ? "Dot" : plName === "Mercury" ? "Remove_Thread" : "Apply_Oil_Ghee",
        color: plName === "Saturn" ? "Black" : plName === "Mars" ? "Red" : plName === "Jupiter" ? "Yellow" : "White",
        instructions: plName === "Saturn"
          ? "घुटने (पुरुष दायां, स्त्री बायां) पर काजल से एक सूक्ष्म काली बिंदी लगाएं।"
          : plName === "Mars"
          ? "नाभि के 2 इंच के घेरे में शुद्ध गाय का घी लगाएं और लाल रंग का वस्त्र/धागा त्यागें।"
          : plName === "Moon"
          ? "छाती या नाभि पर सफेद चंदन का लेप लगाएं।"
          : `${bodyMapping.bodyPartHi} पर ${plName} के अनुसार उपचार करें।`
      }
    });
  });

  // B. Next: Address core house hits (Lagna, 4th, 7th, 10th) from killerHits180 & dangerousHits90
  const criticalHits = [...killerHits180, ...dangerousHits90].filter(h =>
    h.targetType === "House" && [1, 4, 7, 10].includes(h.targetHouse || 0)
  );

  criticalHits.forEach(ch => {
    const plName = ch.sourceName;
    if (processedPlanets.has(plName)) return;
    processedPlanets.add(plName);

    const plCoord = planetCoords[plName];
    if (!plCoord) return;

    const affHouse = ch.targetHouse || 1;
    const targetHouse5 = ((affHouse - 1 + 4) % 12) + 1;
    const targetHouse = targetHouse5;
    const targetCusp = cuspCoords[targetHouse];
    if (!targetCusp) return;

    const bodyMapping = SIGN_BODY_PART_MAPPINGS[targetCusp.signNum] || SIGN_BODY_PART_MAPPINGS[1];
    const items = PLANET_KARAKA_OBJECTS[plName] || [];

    const placeItems: string[] = [];
    if (plName === "Sun") placeItems.push("तांबे का सूर्य यंत्र", "पीतल का पात्र");
    else if (plName === "Mars") placeItems.push("सिंदूरी हनुमान जी का चित्र", "तांबे का त्रिकोण यंत्र");
    else if (plName === "Saturn") placeItems.push("शनि का स्वच्छ प्रतीक", "काले चने का पात्र");
    else if (plName === "Moon") placeItems.push("चांदी का चौकोर सिक्का", "स्वच्छ जल कलश");
    else placeItems.push(`${plName} का सकारात्मक प्रतीक`);

    shiftingPrescriptions.push({
      afflictedTarget: ch.targetName,
      problematicPlanet: plName,
      currentHit: ch.hitDef.angle === 180 ? "180° Killer Hit" : "90° Dangerous Hit",
      targetHouse,
      targetSignNum: targetCusp.signNum,
      targetSignName: targetCusp.sign,
      targetDirection: targetCusp.direction.direction,
      targetDirectionHindi: targetCusp.direction.directionHindi,
      shiftingMethod: `${ch.targetName} पर ${plName} की ${ch.hitDef.angle}° हिट को शांत करने के लिए ${plName} की भौतिक वस्तुओं को ${plCoord.direction.direction} ज़ोन से हटाकर ${targetCusp.direction.directionHindi} (${targetCusp.direction.code}) में शिफ्ट करें ताकि यह 120° रक्षक ढाल में बदल जाए।`,
      itemsToPlace: placeItems,
      itemsToRemoveFromCurrentZone: items.slice(0, 4),
      bodyPartTherapy: {
        targetBodyPart: bodyMapping.bodyPartHi,
        action: plName === "Sun" ? "Apply_Oil_Ghee" : plName === "Saturn" ? "Dot" : "Apply_Oil_Ghee",
        color: plName === "Sun" ? "Red" : plName === "Saturn" ? "Black" : "White",
        instructions: plName === "Sun" && affHouse === 4
          ? "नाभि के 2 इंच के घेरे में प्रतिदिन सुबह शुद्ध गाय का देशी घी लगाएं ताकि चतुर्थ भाव (घरेलू शांति) पर सूर्य की अग्नि शांत हो।"
          : plName === "Mars"
          ? "नाभि के 2 इंच के घेरे में चंदन लगाएं और भोजन के बाद सौंफ-मिश्री लें।"
          : `${bodyMapping.bodyPartHi} पर ${plName} के अनुसार उपचार करें।`
      }
    });
  });

  // 8. Generic MahaVastu vs Personal Astro-Vastu Conflicts
  const genericVastuConflicts: GenericVastuConflict[] = [];

  // Scorpio (Sign 8) Check: Generic Vastu says SSW is Disposal / Toilet
  const scorpioDir = ASTRO_VASTU_SIGN_DIRECTIONS[8];
  const scorpioHouse = Object.values(cuspCoords).find(c => c.signNum === 8)?.house || (((8 - lagnaSignNum + 12) % 12) + 1);
  const scorpioPlanets = Object.values(planetCoords).filter(p => p.signNum === 8).map(p => p.name);

  if (scorpioHouse === 1 || scorpioHouse === 10 || scorpioHouse === 2 || scorpioHouse === 11 || scorpioPlanets.length >= 2 || scorpioPlanets.includes(activeMD)) {
    genericVastuConflicts.push({
      zoneCode: "SSW",
      zoneName: "South-South-West (दक्षिण-दक्षिण-पश्चिम)",
      genericRule: "MahaVastu considers SSW a 'Disposal & De-clutter' zone suitable for toilets/dustbins.",
      personalAstroVastuReality: `In your chart, Sign 8 (Scorpio) rules House ${scorpioHouse}${scorpioPlanets.length ? ` and houses ${scorpioPlanets.join(", ")}` : ""}! Treating SSW as a toilet will directly flush away your ${scorpioHouse === 1 ? "Health & Vitality" : scorpioHouse === 10 ? "Career & Reputation" : "Wealth & Savings"}!`,
      dangerLevel: "CRITICAL",
      recommendation: "Keep SSW sturdy, solid, clean, and free from open drains or toilet leakage. It is an active power center in your chart.",
    });
  }

  // Sagittarius / Pisces (Sign 9 & 12) Check: Generic Vastu says Temple in NE
  const neDir = ASTRO_VASTU_SIGN_DIRECTIONS[9];
  const house9Sign = Object.values(cuspCoords).find(c => c.signNum === 9)?.house || (((9 - lagnaSignNum + 12) % 12) + 1);
  if (house9Sign === 8 || house9Sign === 12 || house9Sign === 6) {
    genericVastuConflicts.push({
      zoneCode: "NE",
      zoneName: "North-East (उत्तर-पूर्व)",
      genericRule: "Generic Vastu prescribes building the home temple/mandir in the North-East.",
      personalAstroVastuReality: `In your chart, Sagittarius (Sign 9 - NE) falls in Dusthana House ${house9Sign} (Loss/Illness/Obstacles). Heavy devotional activation here can activate House ${house9Sign} expenses or health disruptions.`,
      dangerLevel: "HIGH",
      recommendation: `Keep the North-East clean, light, and peaceful with water or white light, but place your primary worship altar in House 1, 5, or 9 direction.`,
    });
  }

  // Taurus (Sign 2 - NW) Check: Generic Vastu says Put Silver Elephant / 7 White Horses in NW
  const house2Sign = Object.values(cuspCoords).find(c => c.signNum === 2)?.house || (((2 - lagnaSignNum + 12) % 12) + 1);
  if (house2Sign === 12 || house2Sign === 8 || house2Sign === 6) {
    genericVastuConflicts.push({
      zoneCode: "NW",
      zoneName: "North-West (उत्तर-पश्चिम - वायव्य)",
      genericRule: "Generic Vastu suggests placing a Silver Elephant, 7 White Running Horses, or Raw Rice in North-West for support & banking.",
      personalAstroVastuReality: `In your chart, Sign 2 (Taurus - NW) falls in House ${house2Sign} (${house2Sign === 12 ? "Losses, Hospital, Insomnia & Bedroom Drain" : "Dusthana"}). Activating NW with heavy silver/horses activates House ${house2Sign} expenses, financial leakage, and severe sleep disturbances!`,
      dangerLevel: "HIGH",
      recommendation: "Avoid placing silver elephants, running white horses, or wealth symbols in NW. Keep NW clean and aerated without symbolic wealth activation.",
    });
  }

  // Gemini (Sign 3 - NNW) Check: Wrist thread trap
  const house3Sign = Object.values(cuspCoords).find(c => c.signNum === 3)?.house || (((3 - lagnaSignNum + 12) % 12) + 1);
  if (house3Sign === 8 || house3Sign === 12) {
    genericVastuConflicts.push({
      zoneCode: "NNW",
      zoneName: "North-North-West / Arms & Wrists (कलाई व बाजू)",
      genericRule: "Priests and generic practitioners frequently tie green or colored sacred threads on client wrists (Gemini = Arms/Wrists).",
      personalAstroVastuReality: `In your chart, Gemini rules Dusthana House ${house3Sign}. Tying green threads around your wrists directly locks Mercury/Gemini into House ${house3Sign} energy, triggering tension, anxiety, and cutting off friends or social gains!`,
      dangerLevel: "HIGH",
      recommendation: "Do NOT tie green or colored threads on your wrists. Keep wrists clear. If honoring Kubera, place his emblem in the North direction of the house, never on the body.",
    });
  }

  // 9. Direction Inventory
  const directionPlanetaryInventory: Record<string, { sign: string; signNum: number; planets: string[]; karakaObjects: string[] }> = {};
  for (let s = 1; s <= 12; s++) {
    const dirInfo = ASTRO_VASTU_SIGN_DIRECTIONS[s];
    const occupants = Object.values(planetCoords).filter(p => p.signNum === s).map(p => p.name);
    const objects = occupants.flatMap(p => PLANET_KARAKA_OBJECTS[p] || []);
    directionPlanetaryInventory[dirInfo.code] = {
      sign: dirInfo.signName,
      signNum: s,
      planets: occupants,
      karakaObjects: Array.from(new Set(objects)),
    };
  }

  // 10. Study and Work Direction Calculation (4th House comfort & 9th/10th House direction)
  const cusp4 = cuspCoords[4];
  const cusp9 = cuspCoords[9];
  const cusp10 = cuspCoords[10];

  const cusp4DefaultSign = RASHIS_ORDER[((lagnaSignNum - 1 + 3) % 12)];
  const cusp4DefaultSignNum = ((lagnaSignNum - 1 + 3) % 12) + 1;
  const cusp9DefaultSign = RASHIS_ORDER[((lagnaSignNum - 1 + 8) % 12)];
  const cusp9DefaultSignNum = ((lagnaSignNum - 1 + 8) % 12) + 1;
  const cusp10DefaultSign = RASHIS_ORDER[((lagnaSignNum - 1 + 9) % 12)];
  const cusp10DefaultSignNum = ((lagnaSignNum - 1 + 9) % 12) + 1;

  const studyAndWorkDirection: StudyAndWorkDirection = {
    fourthHouseSign: cusp4?.sign || cusp4DefaultSign,
    fourthHouseDirection: cusp4?.direction.direction || ASTRO_VASTU_SIGN_DIRECTIONS[cusp4DefaultSignNum]?.direction || "NE",
    fourthHouseHindi: cusp4?.direction.directionHindi || ASTRO_VASTU_SIGN_DIRECTIONS[cusp4DefaultSignNum]?.directionHindi || "उत्तर-पूर्व (ईशान)",
    ninthHouseSign: cusp9?.sign || cusp9DefaultSign,
    ninthHouseDirection: cusp9?.direction.direction || ASTRO_VASTU_SIGN_DIRECTIONS[cusp9DefaultSignNum]?.direction || "NE",
    ninthHouseHindi: cusp9?.direction.directionHindi || ASTRO_VASTU_SIGN_DIRECTIONS[cusp9DefaultSignNum]?.directionHindi || "उत्तर-पूर्व (ईशान)",
    tenthHouseSign: cusp10?.sign || cusp10DefaultSign,
    tenthHouseDirection: cusp10?.direction.direction || ASTRO_VASTU_SIGN_DIRECTIONS[cusp10DefaultSignNum]?.direction || "South",
    tenthHouseHindi: cusp10?.direction.directionHindi || ASTRO_VASTU_SIGN_DIRECTIONS[cusp10DefaultSignNum]?.directionHindi || "दक्षिण",
    recommendedStudyZone: `${cusp4?.direction.direction || "NE"} (${cusp4?.sign || ""}) या ${cusp9?.direction.direction || "NE"} (${cusp9?.sign || ""})`,
    recommendedStudyZoneHindi: `${cusp4?.direction.directionHindi || ""} या ${cusp9?.direction.directionHindi || ""}`,
    recommendedOnlineWorkZone: `${cusp10?.direction.direction || "South"} (${cusp10?.sign || ""}) या ${cusp4?.direction.direction || "NE"}`,
    recommendedOnlineWorkZoneHindi: `${cusp10?.direction.directionHindi || ""} या ${cusp4?.direction.directionHindi || ""}`,
    rationale: `किताबी वास्तु केवल उत्तर/पूर्व बताता है, परंतु एस्ट्रो-वास्तु के अनुसार आपकी शिक्षा व मानसिक सुख 4थे भाव (${cusp4?.sign} - ${cusp4?.direction.direction}) और 9वें भाव (${cusp9?.sign} - ${cusp9?.direction.direction}) से संचालित है। इस दिशा में बैठकर पूर्व या उत्तर की ओर मुख करके अध्ययन करने से उच्चतम एकाग्रता प्राप्त होती है। ऑनलाइन व्यापार व करियर के लिए 10वें भाव (${cusp10?.sign} - ${cusp10?.direction.direction}) की दिशा में बैठना सर्वोत्तम है।`,
  };

  // 11. Mars Dietary & Lifestyle Protocol (180°/90° Hit or Cosmic Friction Lock)
  const marsAffliction = killerHits180.find(h => h.sourceName === "Mars") || dangerousHits90.find(h => h.sourceName === "Mars") || trafficPoliceBlockades.find(b => b.blockingPlanet === "Mars");
  const marsDietaryLifestyleProtocol: MarsDietaryLifestyleProtocol = {
    isMarsAfflicted: Boolean(marsAffliction),
    afflictionType: marsAffliction
      ? "hitAngle" in marsAffliction
        ? `Cosmic Friction ${marsAffliction.hitAngle}° Lock on ${marsAffliction.dashaLordName}`
        : `${marsAffliction.hitDef.name} on ${marsAffliction.targetName}`
      : undefined,
    prohibitedDiet: [
      "तीखी लाल मिर्च (Spicy red chilies) का सेवन तत्काल बंद करें",
      "साबुत या धुली मसूर की दाल (Red Lentils / Masoor Dal) पूर्णतः वर्जित रखें",
      "अत्यधिक गरम मसाले, सिरका व उत्तेजक भोजन से परहेज करें",
    ],
    prohibitedItems: [
      "कलाई, गले या शरीर पर लाल मौली/धागा या गहरे लाल रंग के वस्त्र न पहनें",
      "घर के ENE (पूर्व-उत्तर-पूर्व) या पीड़ित जोन में धारदार चाकू, हथियार या जलते हीटर न रखें",
    ],
    recommendedReplacements: [
      "120° त्रिकोण भाव (House 9 / 5) की दिशा में सिंदूरी हनुमान जी का चित्र लगाएं",
      "भोजन में सौम्य सात्विक आहार लें और क्रोध/उत्तेजना से बचें",
    ],
    directiveText: Boolean(marsAffliction)
      ? "आपकी कुंडली में मंगल सक्रिय आघात या दशा अवरोध उत्पन्न कर रहा है। जब तक मसूर की दाल, तीखी लाल मिर्च और लाल मौली का त्याग नहीं किया जाता, तब तक प्रत्यंतर दशा आते ही सर्जरी, चोट या कलह का खतरा बना रहेगा।"
      : "मंगल सामान्य स्थिति में है; कोई गंभीर खान-पान निषेध लागू नहीं है।",
  };

  // 12. Wrist-Thread Trap Alert (Gemini / 3rd Sign)
  const geminiCusp = Object.values(cuspCoords).find(c => c.signNum === 3);
  const geminiHouse = geminiCusp?.house || (((3 - lagnaSignNum + 12) % 12) + 1);
  const isGeminiDusthana = [6, 8, 12].includes(geminiHouse);
  const wristThreadTrapAlert: WristThreadTrapAlert = {
    geminiHouse,
    isDusthana: isGeminiDusthana,
    severity: isGeminiDusthana ? "HIGH" : "NONE",
    alertTitle: isGeminiDusthana
      ? `⚠️ कलाई पर धागे का चक्रव्यूह: मिथुन राशि भाव ${geminiHouse} में स्थित है`
      : `कलाई ऊर्जा सामान्य: मिथुन राशि भाव ${geminiHouse} में स्थित है`,
    explanation: isGeminiDusthana
      ? `कलाई और बाजुएं सीधे कालपुरुष के 3रे भाव (मिथुन) का प्रतिनिधित्व करती हैं। आपकी जन्मकुंडली में मिथुन राशि भाव ${geminiHouse} (${geminiHouse === 8 ? "मृत्यु/बाधा/चिंता" : geminiHouse === 12 ? "व्यय/हानि/अनिद्रा" : "रोग/ऋण"}) की स्वामी है। यदि आप कलाई पर किसी मंदिर या पंडित जी का दिया हुआ हरा, लाल या काला धागा बांधते हैं, तो वह सीधे भाव ${geminiHouse} की नकारात्मक ऊर्जा को सक्रिय कर देता है, जिससे भारी तनाव व मित्रों से विच्छेद होता है!`
      : `आपकी कुंडली में मिथुन राशि केंद्र/त्रिकोण (भाव ${geminiHouse}) में है, इसलिए कलाई पर धागा बांधने से कोई दुस्थान जनित दोष उत्पन्न नहीं होता।`,
    correctiveAction: isGeminiDusthana
      ? "कलाई को किसी भी प्रकार के धागे से तुरंत मुक्त रखें। यदि कुबेर जी या किसी देवता की पूजा करनी है तो उनका प्रतीक घर की उत्तर दिशा में स्थापित करें, शरीर पर धागा न बांधें।"
      : "कलाई पर सामान्य रक्षा सूत्र धारण किया जा सकता है।",
  };

  // 13. Dynamic Compound Degree Coordinates for Table (Section 2)
  const planetCoordinates: PlanetCoordinateRow[] = planetNames.map(p => {
    const pl = planetCoords[p];
    if (!pl) return null;
    const startDeg = (pl.signNum - 1) * 30;
    const rawData = getPlanetData(p);
    return {
      name: p,
      hindiName: PLANETS_HINDI[p] || p,
      house: pl.house,
      sign: pl.sign,
      signHindi: RASHIS_HINDI[pl.signNum] || pl.sign,
      signNum: pl.signNum,
      degInSign: pl.degInSign,
      degInSignFormatted: `${pl.degInSign.toFixed(2)}°`,
      startDeg,
      compoundDeg: pl.compoundDeg,
      compoundDegFormatted: `${pl.compoundDeg.toFixed(2)}°`,
      direction: pl.direction,
      nakshatra: pl.nakshatra || "—",
      nakshatraLord: rawData?.nakshatraLord || "—",
      isUntenanted: pl.isUntenanted,
    };
  }).filter(Boolean) as PlanetCoordinateRow[];

  const cuspCoordinates: HouseCuspCoordinateRow[] = [];
  for (let h = 1; h <= 12; h++) {
    const cs = cuspCoords[h];
    if (!cs) continue;
    const startDeg = (cs.signNum - 1) * 30;
    cuspCoordinates.push({
      house: h,
      sign: cs.sign,
      signHindi: RASHIS_HINDI[cs.signNum] || cs.sign,
      signNum: cs.signNum,
      degInSign: cs.degInSign,
      degInSignFormatted: `${cs.degInSign.toFixed(2)}°`,
      startDeg,
      compoundDeg: cs.compoundDeg,
      compoundDegFormatted: `${cs.compoundDeg.toFixed(2)}°`,
      direction: cs.direction,
    });
  }

  // 14. Planetary Clusters & Power Center Detection
  const clusters: PlanetaryCluster[] = [];
  for (let s = 1; s <= 12; s++) {
    const occupants = Object.values(planetCoords).filter(p => p.signNum === s);
    if (occupants.length >= 2) {
      const signDir = ASTRO_VASTU_SIGN_DIRECTIONS[s];
      const matchedCusp = Object.values(cuspCoords).find(c => c.signNum === s);
      const houseNum = occupants[0]?.house || matchedCusp?.house || (((s - lagnaSignNum + 12) % 12) + 1);
      const isPowerCenter = occupants.length >= 3;
      const planetListHi = occupants.map(o => PLANETS_HINDI[o.name] || o.name).join(", ");
      const narrative = `भाव ${houseNum} (${RASHIS_HINDI[s]} - ${s}) में ${planetListHi} — कुल ${occupants.length} ग्रह एक साथ बैठे हैं! एस्ट्रो-वास्तु पद्धति के अनुसार ${s} नंबर राशि की दिशा ${signDir.code} (${signDir.directionHindi}) है। यानी जातक के घर का ${signDir.code} ज़ोन इनकी पूरी ज़िंदगी का ${isPowerCenter ? "महा-ऊर्जा केंद्र (Power Center)" : "अत्यधिक संवेदनशील ऊर्जा क्षेत्र"} है!`;
      clusters.push({
        house: houseNum,
        sign: RASHIS_ORDER[s - 1],
        signHindi: RASHIS_HINDI[s] || RASHIS_ORDER[s - 1],
        signNum: s,
        direction: signDir,
        planets: occupants.map(o => o.name),
        isPowerCenter,
        narrative,
      });
    }
  }

  // 15. Descriptive Narrative for Dasha Lord Hits (Paragraph Style Predictive Section)
  const dashaLordHitsAnalysis: DashaLordHitNarrative[] = [];
  allHits.forEach(h => {
    const isDashaHit = h.sourceName === activeMD || h.sourceName === activeAD;
    const isKeyHouseHit = h.targetType === "House" && [1, 4, 7, 10].includes(h.targetHouse || 0);
    if (!isDashaHit && !isKeyHouseHit) return;

    const diff = Math.abs(h.sourceCompoundDeg - h.targetCompoundDeg);
    const effectiveDiff = diff > 180 ? 360 - diff : diff;
    const orb = Math.abs(effectiveDiff - h.hitDef.angle);

    let narrative = "";
    const symptoms: string[] = [];

    if (h.targetType === "House") {
      const hNum = h.targetHouse || 1;
      if (hNum === 4) {
        narrative = `जैसे ही ${h.sourceName} की सक्रिय दशा का प्रभाव प्रारंभ हुआ है, चतुर्थ भाव (${h.targetSign} - घरेलू सुख, मानसिक शांति, माता, वाहन एवं भवन) पर ${h.hitDef.hindiName || h.hitDef.name} का सीधा आघात पड़ा है। एस्ट्रो-वास्तु सिद्धांत के अनुसार जब भी चतुर्थ भाव पर 180° किलर हिट या 90° का दबाव आता है, तो व्यक्ति का बाहरी कार्यक्षेत्र भले ही गति पकड़े, परंतु घर में प्रवेश करते ही भारी मानसिक अशांति, अनिद्रा और बेचैनी महसूस होती है। प्रॉपर्टी, वाहन या माता के स्वास्थ्य को लेकर भी अचानक तनाव उत्पन्न होता है।`;
        symptoms.push("घर के वातावरण में अचानक बेचैनी, सुकून की कमी व अनिद्रा (Insomnia)");
        symptoms.push("परिजनों या माता के साथ अकारण तीखी बहस व वैचारिक मतभेद");
        symptoms.push("वाहन या प्रॉपर्टी को लेकर रुकावटें अथवा अप्रत्याशित खर्चे");
        symptoms.push("दिनभर की मेहनत के बाद भी घर आकर मानसिक शांति न मिलना");
      } else if (hNum === 1) {
        narrative = `${h.sourceName} (${h.sourceSign} से) सीधे लग्न कस्प पर ${h.hitDef.hindiName || h.hitDef.name} मार रहा है (ऑर्ब केवल ${orb.toFixed(2)}°!)। लग्न व्यक्ति का शरीर, आत्म-बल, स्वास्थ्य और जीवन की मुख्य दिशा है। इस हिट के कारण व्यक्ति के आत्म-विश्वास में अचानक उतार-चढ़ाव आता है, सिर में भारीपन रहता है और ऊर्जा का स्तर बार-बार गिरता है।`;
        symptoms.push("शारीरिक थकावट, सिर में भारीपन और ऊर्जा में अचानक गिरावट");
        symptoms.push("स्वयं के निर्णयों पर अकारण संशय व मानसिक असमंजस");
        symptoms.push("दूसरों की समस्याओं और तनाव को अपने ऊपर ले लेना");
      } else if (hNum === 7) {
        narrative = `सप्तम भाव (दांपत्य जीवन, वैवाहिक सुख एवं साझेदारियां) पर ${h.hitDef.hindiName || h.hitDef.name} का प्रहार है। इससे जीवनसाथी के साथ संवादहीनता, गलतफहमियां और छोटी-छोटी बातों पर तीखा तनाव उत्पन्न होता है। व्यापारिक साझेदारियों में भी अनुबंध टूटने का जोखिम रहता है।`;
        symptoms.push("दांपत्य जीवन में गलतफहमियां व भावनात्मक दूरियां");
        symptoms.push("पार्टनरशिप व व्यवसाय में ऐन वक्त पर असहयोग");
      } else if (hNum === 10) {
        narrative = `दशम भाव (करियर, पद-प्रतिष्ठा, एवं कर्मक्षेत्र) पर यह आघात कार्यक्षेत्र में अचानक रुकावटें, बॉस या उच्चाधिकारियों के साथ मतभेद, और बनते हुए काम में ऐन वक्त पर बाधा खड़ी करता है।`;
        symptoms.push("कार्यक्षेत्र में अकारण तनाव व अधिकारियों से मतभेद");
        symptoms.push("परिश्रम के अनुरूप पदोन्नति या प्रतिष्ठा मिलने में अड़चन");
      } else {
        narrative = `भाव ${hNum} (${h.targetSign}) पर ${h.sourceName} द्वारा ${h.hitDef.hindiName || h.hitDef.name} का आघात इस भाव से जुड़े सभी शुभ फलों को संकुचित कर रहा है।`;
        symptoms.push(`भाव ${hNum} के कारक तत्वों में रुकावट व विलंब`);
      }
    } else {
      narrative = `${h.sourceName} और ${h.targetName} के बीच परस्पर ${h.hitDef.hindiName || h.hitDef.name} बन रही है। जब दो ग्रह परस्पर विरोधी कोण में आते हैं, तो वे एक-दूसरे के कार्यक्षेत्र को बाधित करते हैं और जातक को मानसिक अंतर्द्वंद्व में डालते हैं।`;
      symptoms.push(`${h.sourceName} और ${h.targetName} के क्षेत्रों में आपसी टकराव`);
    }

    const formula = `${h.sourceName} (${h.sourceCompoundDeg.toFixed(2)}°) - ${h.targetName} (${h.targetCompoundDeg.toFixed(2)}°) = ${diff.toFixed(2)}° ⇒ 360° - ${diff.toFixed(2)}° = ${effectiveDiff.toFixed(2)}° [Orb: ±${orb.toFixed(2)}° / Limit: ±${h.hitDef.orb}°]`;

    dashaLordHitsAnalysis.push({
      hitTitle: `${h.sourceName} की ${h.targetName} पर ${h.hitDef.hindiName || h.hitDef.name}`,
      hitAngle: h.hitDef.angle,
      severity: h.hitDef.severity as any,
      sourcePlanet: h.sourceName,
      sourceCompoundDeg: h.sourceCompoundDeg,
      targetName: h.targetName,
      targetCompoundDeg: h.targetCompoundDeg,
      exactDiff: diff,
      effectiveDiff,
      orbDistance: orb,
      orbLimit: h.hitDef.orb,
      calculationFormula: formula,
      predictiveNarrative: narrative,
      realLifeSymptoms: symptoms,
    });
  });

  // 16. Spatial Field Test ("घर के किस ज़ोन में क्या सामान पड़ा होगा?")
  const spatialFieldTest: SpatialZoneDiagnostic[] = [];
  for (let s = 1; s <= 12; s++) {
    const dirInfo = ASTRO_VASTU_SIGN_DIRECTIONS[s];
    const occupants = Object.values(planetCoords).filter(p => p.signNum === s);
    const occupantNames = occupants.map(o => o.name);
    const matchedCusp = Object.values(cuspCoords).find(c => c.signNum === s);
    const houseNum = matchedCusp?.house || occupants[0]?.house || (((s - lagnaSignNum + 12) % 12) + 1);
    const isDashaZone = occupantNames.includes(activeMD) || occupantNames.includes(activeAD);
    const isCluster = occupantNames.length >= 2;

    let itemsText = "";
    if (occupantNames.length === 0) {
      itemsText = `यह ज़ोन ग्रहों से रिक्त है। यहाँ ${dirInfo.notes} का सामान्य प्रभाव रहता है। इसे स्वच्छ और संतुलित रखें।`;
    } else {
      const karakaDetails: string[] = [];
      if (occupantNames.includes("Sun")) karakaDetails.push("तांबे की वस्तुएं, सरकारी कागजात, तेज रोशनी, पिता की वस्तुएं, दवाइयां");
      if (occupantNames.includes("Moon")) karakaDetails.push("पानी का स्थान/आरो, चांदी, आईना, सफेद वस्त्र, दूध/तरल पदार्थ");
      if (occupantNames.includes("Mars")) karakaDetails.push("अग्नि, लाल रंग, इलेक्ट्रॉनिक टूल्स, इनवर्टर, हीटर, धारदार चाकू, लाल मिर्च/मसाले, जिम उपकरण");
      if (occupantNames.includes("Mercury")) karakaDetails.push("किताबें, अध्ययन सामग्री, हरे पौधे, लैपटॉप बैग, स्टेशनरी, गैजेट्स");
      if (occupantNames.includes("Jupiter")) karakaDetails.push("धार्मिक ग्रंथ, पीला रंग, पीतल के पात्र, पूजा सामग्री, शुद्ध घी, हल्दी");
      if (occupantNames.includes("Venus")) karakaDetails.push("मेकअप/सौंदर्य प्रसाधन, परफ्यूम, रेशमी वस्त्र, सजे-धजे आभूषण, सजावटी वस्तुएं");
      if (occupantNames.includes("Saturn")) karakaDetails.push("पुराना लोहा, पुराने जूते/चप्पल, झाड़ू/पोछा, कबाड़, मशीनरी के औजार, तेल की बोतलें");
      if (occupantNames.includes("Rahu")) karakaDetails.push("तारों का जंजाल, बंद पड़े इलेक्ट्रॉनिक उपकरण, वाई-फाई राउटर, धूल-मिट्टी या डस्टबिन");
      if (occupantNames.includes("Ketu")) karakaDetails.push("त्रिकोण झंडा, सिलाई का सामान, अगरबत्ती/धूप, सीढ़ियों का कोना");

      itemsText = `इस ज़ोन में ${occupantNames.map(p => PLANETS_HINDI[p] || p).join(", ")} का संयुक्त प्रभाव है। एस्ट्रो-वास्तु फील्ड टेस्ट के अनुसार यहाँ ${karakaDetails.join("; ")} रखे होने की सर्वाधिक संभावना है।`;
    }

    let warningText: string | undefined = undefined;
    if (s === 8 && (occupants.length >= 2 || occupantNames.includes(activeMD) || houseNum === 10 || houseNum === 1)) {
      warningText = `आम वास्तु वाले SSW को 'डिस्पोज़ल ज़ोन' मानकर यहाँ टॉयलेट या डस्टबिन की सलाह देते हैं। चेतावनी: आपकी कुंडली में SSW आपका ${houseNum}वां भाव (कर्म, मान-सम्मान व जीवन शक्ति) है। यदि यहाँ टॉयलेट बनाया या गंदगी रखी गई, तो आपका पूरा करियर और स्वास्थ्य नष्ट हो जाएगा!`;
    } else if (s === 2 && (houseNum === 12 || houseNum === 8)) {
      warningText = `आम वास्तु वाले NW में चांदी का हाथी या सफेद दौड़ते घोड़े रखने की सलाह देते हैं। आपकी कुंडली में वृषभ (NW) भाव ${houseNum} में है। यहाँ चांदी का हाथी रखने से अस्पताल के खर्चे व अनिद्रा भयंकर रूप से बढ़ जाएगी!`;
    } else if (s === 9 && (houseNum === 6 || houseNum === 8 || houseNum === 12)) {
      warningText = `किताबी वास्तु NE में भारी मंदिर बनाने को कहता है। आपकी कुंडली में धनु राशि भाव ${houseNum} में है। यहाँ भारी धार्मिक सामान रखने से रोग या व्यय का भाव सक्रिय हो जाता है।`;
    }

    let actionText = "";
    if (s === 8) {
      actionText = "SSW को बिल्कुल साफ, भारी, स्थिर और सुव्यवस्थित रखें। इसे कभी गंदा न छोड़ें और यहाँ कोई खुला ड्रेनेज या डस्टबिन न रखें।";
    } else if (s === 2) {
      actionText = "NW को बिल्कुल सफेद/क्रीम, हवादार और हल्का रखें। यहाँ से कोई भी लाल रंग, हीटर या भारी धातु तुरंत हटाएं।";
    } else {
      actionText = `इस ज़ोन को ${dirInfo.directionHindi} के प्राकृतिक तत्वों के अनुसार संतुलित और स्वच्छ रखें।`;
    }

    spatialFieldTest.push({
      zoneCode: dirInfo.code,
      zoneName: dirInfo.direction,
      directionHindi: dirInfo.directionHindi,
      signName: dirInfo.signName,
      signHindi: RASHIS_HINDI[s] || dirInfo.signName,
      signNum: s,
      houseNumbers: [houseNum],
      planetsPresent: occupantNames,
      isCluster,
      isDashaLordZone: isDashaZone,
      isAfflictedByHits: false,
      predictedItemsParagraph: itemsText,
      mahaVastuWarningParagraph: warningText,
      correctiveActionParagraph: actionText,
    });
  }

  // Active Dasha Dates formatting
  const activeMDEntry = chart.dashas?.find(d => {
    const s = new Date(d.start), e = new Date(d.end);
    return evaluationDate >= s && evaluationDate < e;
  }) || chart.dashas?.find(d => d.active);

  const activeADEntry = chart.antardasha?.find(a => {
    const s = new Date(a.start), e = new Date(a.end);
    return evaluationDate >= s && evaluationDate < e;
  }) || chart.antardasha?.find(a => a.active);

  const formatDateShort = (d?: string | Date) => {
    if (!d) return undefined;
    const date = new Date(d);
    return isNaN(date.getTime()) ? undefined : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // 17. Prescriptive Body-Part Dot & Thread Therapy Registry (100% Dynamic & Chart-Driven)
  const HOUSE_NAMES_HI: Record<number, string> = {
    1: "प्रथम भाव (लग्न - देह व मस्तक)",
    2: "द्वितीय भाव (धन, कुटुंब व वाणी/कंठ)",
    3: "तृतीय भाव (पराक्रम, भ्राता व बाजुएं)",
    4: "चतुर्थ भाव (सुख, माता, गृह व हृदय)",
    5: "पंचम भाव (बुद्धि, संतान व उदर)",
    6: "षष्ठ भाव (रोग, ऋण, शत्रु व नाभि)",
    7: "सप्तम भाव (दांपत्य, साझेदारी व पेल्विक)",
    8: "अष्टम भाव (आयु, गुप्त रोग व मूलाधार)",
    9: "नवम भाव (भाग्य, धर्म व जांघ)",
    10: "दशम भाव (कर्म, मान-सम्मान व घुटने)",
    11: "एकादश भाव (लाभ, आय व पिंडलियां)",
    12: "द्वादश भाव (व्यय, हानि, मोक्ष व पैर के तलवे)",
  };

  const SIGN_MEDICINAL_DOT_BASICS: Record<number, {
    dotColor: string;
    dotSubstance: string;
    baseApplicationRules: string;
    threadColor: string;
    defaultThreadVerdict: string;
  }> = {
    1: {
      dotColor: "लाल / केसरिया",
      dotSubstance: "शुद्ध कुमकुम (लाल सिंदूर) अथवा केसर का तिलक",
      baseApplicationRules: "माथे के मध्य (आज्ञा चक्र) पर लगाएं। यह सूर्य व मंगल की शक्ति को प्रखर करता है और आलस्य/भय को समाप्त करता है।",
      threadColor: "लाल या पीला धागा",
      defaultThreadVerdict: "दाएं हाथ में लाल मौली/रक्षा सूत्र धारण कर सकते हैं।",
    },
    2: {
      dotColor: "सफेद",
      dotSubstance: "सफेद चंदन अथवा शुद्ध गुलाब जल",
      baseApplicationRules: "कंठ कूप पर सफेद चंदन की एक बूंद लगाएं। यह वाणी में आकर्षण, धन-आकर्षण और शुक्र के शुभ प्रभाव को जागृत करता है।",
      threadColor: "सफेद रेशमी धागा",
      defaultThreadVerdict: "गले या कलाई में सफेद रेशमी धागा धारण करना शुभ है।",
    },
    3: {
      dotColor: "हरा / तुलसी अर्क",
      dotSubstance: "तुलसी का ताजा रस अथवा हल्का हरा चंदन",
      baseApplicationRules: "कलाई के भीतरी हिस्से पर तुलसी अर्क लगाएं। यह सीधे नर्वस सिस्टम को शांति देता है।",
      threadColor: "हरा धागा / मौली",
      defaultThreadVerdict: "कलाई पर सामान्य रक्षा सूत्र या हरा धागा धारण किया जा सकता है।",
    },
    4: {
      dotColor: "सफेद",
      dotSubstance: "सफेद चंदन का लेप या शुद्ध गाय के दूध की बूंद",
      baseApplicationRules: "हृदय के केंद्र पर सफेद चंदन का गोलाकार तिलक लगाएं। यह मानसिक अशांति, डिप्रेशन, फोबिया और बेचैनी को समाप्त करता है।",
      threadColor: "सफेद सूती धागा",
      defaultThreadVerdict: "सफेद धागा धारण कर सकते हैं।",
    },
    5: {
      dotColor: "केसरिया / लाल",
      dotSubstance: "केसर मिश्रित जल या लाल कुमकुम",
      baseApplicationRules: "नाभि से ठीक 2 इंच ऊपर सोलर प्लेक्सस पर केसर की बिंदी लगाएं। यह आत्म-विश्वास, नेतृत्व क्षमता और पाचन शक्ति को तीव्र करता है।",
      threadColor: "नारंगी / पीला धागा",
      defaultThreadVerdict: "सूर्य की कृपा हेतु कलाई या कंठ पर पीला/नारंगी धागा पहन सकते हैं।",
    },
    6: {
      dotColor: "पारदर्शी / स्वर्णिम",
      dotSubstance: "शुद्ध देशी गाय का घी (2 बूंद)",
      baseApplicationRules: "नाभि के ठीक 2 इंच के दायरे में प्रतिदिन सुबह 2 बूंद शुद्ध गाय का घी हल्के हाथ से लगाएं। यह नर्वस सिस्टम, अनिद्रा व बुध की अशांति को तत्काल शांत करता है।",
      threadColor: "धागा वर्जित",
      defaultThreadVerdict: "कमर में काला या रंगीन धागा कभी न बांधें।",
    },
    7: {
      dotColor: "सफेद / सुगंधित",
      dotSubstance: "सफेद चंदन या बिना अल्कोहल का शुद्ध गुलाब इत्र",
      baseApplicationRules: "नाभि के नीचे पेल्विक क्षेत्र पर चंदन लगाएं। दांपत्य जीवन के तनाव को दूर करता है।",
      threadColor: "सफेद रेशमी धागा",
      defaultThreadVerdict: "कमर में धागा न बांधें।",
    },
    8: {
      dotColor: "शीतल चंदन",
      dotSubstance: "कपूर मिश्रित सफेद चंदन",
      baseApplicationRules: "नाभि के निचले हिस्से / मूलाधार पर चंदन लगाएं ताकि उग्र मंगल/वृश्चिक की अत्यधिक ऊष्मा शांत हो सके।",
      threadColor: "लाल धागा वर्जित",
      defaultThreadVerdict: "शरीर पर लाल धागा/लाल वस्त्र पहनना वर्जित रखें।",
    },
    9: {
      dotColor: "पीला",
      dotSubstance: "शुद्ध कस्तूरी हल्दी या केसर",
      baseApplicationRules: "माथे या कंठ पर पीला तिलक लगाएं (धनु गुरु की राशि है)। यह भाग्य में अवरोधों को नष्ट करता है।",
      threadColor: "पीला सूती धागा",
      defaultThreadVerdict: "गले में पीला धागा पहनना शुभ फलदायी है।",
    },
    10: {
      dotColor: "काला / काजल",
      dotSubstance: "काजल की सूक्ष्म बिंदी अथवा सरसों का तेल",
      baseApplicationRules: "एस्ट्रो-वास्तु का गुप्त सूत्र: जब भी दशम भाव या शनि की क्रूर 180° किलर हिट आ रही हो, तो संबंधित घुटने पर परमानेंट मार्कर या काजल से एक सूक्ष्म काली बिंदी लगाएं। यह किलर हिट को तत्काल 120° रक्षा ढाल में बदल देता है!",
      threadColor: "काला धागा (केवल टखने पर)",
      defaultThreadVerdict: "काले धागे को कभी कलाई या गले में न बांधें, केवल पैर के टखने पर बांधें।",
    },
    11: {
      dotColor: "नीला / तेल",
      dotSubstance: "सरसों के तेल की हल्की मालिश",
      baseApplicationRules: "शनिवार को पिंडलियों पर सरसों के तेल से मालिश करें। यह शनि के पैरों पर पड़ने वाले भार और काम के तनाव को मुक्त करता है।",
      threadColor: "काला धागा",
      defaultThreadVerdict: "पैर के टखने पर काला धागा बांधना शनि व राहु की बुरी नजर से रक्षा करता है।",
    },
    12: {
      dotColor: "तेल मालिश",
      dotSubstance: "शुद्ध तिल का तेल या सरसों का तेल",
      baseApplicationRules: "रात्रि को सोने से पूर्व पैरों के दोनों तलवों पर 2 मिनट तिल के तेल से मालिश करें। यह 12वें भाव के व्यय, अनिद्रा, डिप्रेशन और हॉस्पिटल के खर्चों को तुरंत शांत करता है।",
      threadColor: "धागा वर्जित",
      defaultThreadVerdict: "पैरों के पंजों पर कोई धागा न बांधें।",
    },
  };

  const bodyPartRemedyRegistry: BodyPartRemedyItem[] = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map(signNum => {
    const mapping = SIGN_BODY_PART_MAPPINGS[signNum];
    const basics = SIGN_MEDICINAL_DOT_BASICS[signNum];

    // 1. Dynamic House Resolution
    const matchedCusp = Object.values(cuspCoords).find(c => c.signNum === signNum);
    const houseNum = matchedCusp?.house || (((signNum - lagnaSignNum + 12) % 12) + 1);
    const houseNameHi = HOUSE_NAMES_HI[houseNum] || `${houseNum}वां भाव`;
    const isDusthana = [6, 8, 12].includes(houseNum);

    // 2. Planets occupying this sign
    const occupyingPlanets: BodyPartPlanetOccupant[] = Object.values(planetCoords)
      .filter(p => p.signNum === signNum)
      .map(p => ({
        name: p.name,
        hindi: PLANETS_HINDI[p.name] || p.name,
        degreesFormatted: `${p.degInSign.toFixed(2)}°`,
        compoundDeg: p.compoundDeg,
        isDashaLord: [activeMD, activeAD].includes(p.name),
        isBenefic: ["Jupiter", "Venus", "Mercury", "Moon"].includes(p.name),
      }));

    // 3. Hits directly targeting this sign, its cusp, or planets inside it
    const relevantHits: BodyPartActiveHit[] = allHits
      .filter(h => h.targetSignNum === signNum)
      .map(h => ({
        aspectName: h.hitDef.name,
        hittingPlanet: h.sourceName,
        angle: h.hitDef.angle,
        severity: h.hitDef.severity,
        orbDeg: h.orbDistance,
      }));

    // 4. Status Verdict Synthesis
    let statusType: "critical_hit" | "dangerous_hit" | "dasha_active" | "dusthana_warning" | "shielded" | "balanced" = "balanced";
    let badgeText = "✅ संतुलित / शांत";
    let badgeColor = "#4B5563";
    let summaryText = "कोई प्रतिकूल आघात नहीं — प्राकृतिक अवस्था में रखें।";

    const hasKillerHit = relevantHits.some(h => h.angle === 180);
    const hasDangerousHit = relevantHits.some(h => h.angle === 90);
    const hasSupportiveOrShield = relevantHits.some(h => h.angle === 60 || h.angle === 120);
    const hasDashaLord = occupyingPlanets.some(p => p.isDashaLord);

    if (hasKillerHit) {
      statusType = "critical_hit";
      const hittingP = relevantHits.find(h => h.angle === 180)?.hittingPlanet || "पापी ग्रह";
      badgeText = `🚨 180° किलर हिट (${hittingP})`;
      badgeColor = "#DC2626";
      summaryText = `गंभीर मारक आघात! इस अंग पर तत्काल ${basics.dotSubstance} लगाना अनिवार्य है।`;
    } else if (hasDangerousHit) {
      statusType = "dangerous_hit";
      const hittingP = relevantHits.find(h => h.angle === 90)?.hittingPlanet || "ग्रह";
      badgeText = `⚠️ 90° बाधा आघात (${hittingP})`;
      badgeColor = "#EA580C";
      summaryText = `बाधा व तनाव ऊर्जा। शांति हेतु ${basics.dotSubstance} का प्रयोग करें।`;
    } else if (hasDashaLord) {
      statusType = "dasha_active";
      badgeText = `⚡ वर्तमान दशा केंद्र (${occupyingPlanets.find(p => p.isDashaLord)?.hindi})`;
      badgeColor = "#D97706";
      summaryText = `सक्रिय दशानाथ का ऊर्जा केंद्र — देह-वास्तु नियंत्रण अनिवार्य।`;
    } else if (isDusthana) {
      statusType = "dusthana_warning";
      badgeText = `⚠️ दुस्थान (${houseNum}वां भाव)`;
      badgeColor = "#B45309";
      summaryText = `कमजोर/संवेदनशील भाव — कलाई/कमर पर धागा बांधना सख्त वर्जित है।`;
    } else if (hasSupportiveOrShield) {
      statusType = "shielded";
      badgeText = `🛡️ 120° रक्षा ढाल`;
      badgeColor = "#16A34A";
      summaryText = `सकारात्मक त्रिकोण ऊर्जा — शक्ति संतुलित है।`;
    }

    // 5. Thread Verdict personalized to this chart
    let threadVerdict = basics.defaultThreadVerdict;
    let isThreadHarmful = isDusthana;
    if (signNum === 3) { // Gemini
      isThreadHarmful = isGeminiDusthana;
      threadVerdict = isGeminiDusthana
        ? "🚨 सख्त चेतावनी (Wrist Thread Trap): आपकी कुंडली में मिथुन दुस्थान (6/8/12) में है! कलाई पर किसी भी प्रकार का धागा (मौली/कलावा) बांधना तुरंत मानसिक तनाव व रोग लाता है। कलाई को सर्वथा मुक्त रखें!"
        : "कलाई पर सामान्य रक्षा सूत्र या हरा धागा धारण किया जा सकता है।";
    } else if (isDusthana) {
      isThreadHarmful = true;
      threadVerdict = `सावधानी: यह राशि आपकी कुंडली में ${houseNum}वें दुस्थान भाव में है। इस अंग या कलाई पर ${basics.threadColor} बांधना वर्जित है।`;
    }

    // 6. Dynamic Personalized Diagnosis Note
    let personalizedDiagnosis = "";
    if (occupyingPlanets.length > 0) {
      const pNames = occupyingPlanets.map(p => `${p.hindi} (${p.degreesFormatted}${p.isDashaLord ? " ★दशानाथ" : ""})`).join(", ");
      personalizedDiagnosis = `आपकी कुंडली में ${houseNameHi} में ${pNames} विराजमान हैं। `;
    } else {
      personalizedDiagnosis = `आपकी कुंडली में ${houseNameHi} रिक्त है। `;
    }
    if (relevantHits.length > 0) {
      personalizedDiagnosis += `इस अंग पर ${relevantHits.map(h => `${h.aspectName} (${h.hittingPlanet})`).join(", ")} का प्रभाव आ रहा है। `;
    }
    personalizedDiagnosis += basics.baseApplicationRules;

    return {
      signNum,
      signName: mapping.signName,
      signHindi: RASHIS_HINDI[signNum],
      bodyPartHi: mapping.bodyPartHi,
      bodyPartEn: mapping.bodyPartEn,
      houseNum,
      houseNameHi,
      planetsInSign: occupyingPlanets,
      activeHits: relevantHits,
      statusVerdict: {
        statusType,
        badgeText,
        badgeColor,
        summaryText,
      },
      personalizedDiagnosis,
      dotColor: basics.dotColor,
      dotSubstance: basics.dotSubstance,
      dotApplicationRules: basics.baseApplicationRules,
      threadColor: basics.threadColor,
      isThreadHarmful,
      threadVerdict,
      associatedPlanets: occupyingPlanets.map(p => p.name),
    };
  });

  const dossier = {
    nativeName: chart.name || "Seeker",
    lagnaSign,
    lagnaSignHindi: RASHIS_HINDI[lagnaSignNum] || lagnaSign,
    lagnaSignNum,
    lagnaCompoundDeg,
    activeDasha: {
      mahadasha: activeMD,
      antardasha: activeAD,
      mahadashaStart: formatDateShort(activeMDEntry?.start),
      mahadashaEnd: formatDateShort(activeMDEntry?.end),
      antardashaStart: formatDateShort(activeADEntry?.start),
      antardashaEnd: formatDateShort(activeADEntry?.end),
    },
    planetCoordinates,
    cuspCoordinates,
    clusters,
    dashaLordHitsAnalysis,
    spatialFieldTest,
    trafficPoliceBlockades,
    killerHits180,
    dangerousHits90,
    badHits45,
    supportiveHits60,
    protectiveShields120,
    allHits,
    shiftingPrescriptions,
    bodyPartRemedyRegistry,
    genericVastuConflicts,
    directionPlanetaryInventory,
    familyCrossHitIsolationRule: {
      title: "पारिवारिक क्रॉस-हिट निवारण नियम (Personal vs Household Vastu Isolation)",
      rule: "यदि घर के सामान्य/साझा कमरे में कोई वस्तु या रंग स्थापित करने से परिवार के किसी अन्य सदस्य की कुंडली पर विपरीत प्रभाव (Cross-Hit) पड़ने की संभावना हो, तो उस उपाय को पूरे घर या साझा हॉल में न करें।",
      practicalAdvice: "उस वस्तु को केवल जातक के व्यक्तिगत शयनकक्ष (Personal Bedroom), निजी स्टडी डेस्क, जेब (Pocket), या पर्स में ही रखें। उदाहरण के लिए, लाल कपड़े में 4-5 लाल मिर्च या तांबे का सिक्का अपनी जेब में रखने से केवल जातक का मंगल सक्रिय होगा, परिवार के बाकी सदस्यों की शांति भंग नहीं होगी।",
    },
    studyAndWorkDirection,
    marsDietaryLifestyleProtocol,
    wristThreadTrapAlert,
    mandalaDossier: runVastuPurushaMandalaEngine(chart),
  };

  const astroPrescription = evaluateAstroPrescriptionFormula(chart, dossier as any);

  return {
    ...dossier,
    cosmicFrictionLocks: trafficPoliceBlockades,
    astroPrescription,
  };
}

