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
// 4. Two Hit Dimensions: Planet-to-House Hits & Planet-to-Planet "Traffic Police" Blockade.
// 5. Active Dasha Priority (MD / AD / PD focus).
// 6. 120° Protective Shield Shifting Technique (180° किलर को 120° रक्षक ढाल में बदलना).
// 7. 12-Sign Human Body-Part Mapping for Dot/Thread Therapy.
// 8. Personal Astro-Vastu vs Generic MahaVastu Conflict Detection.
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";

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

export interface AstroVastuHitDossier {
  nativeName: string;
  lagnaSign: string;
  lagnaSignNum: number;
  lagnaCompoundDeg: number;
  activeDasha: {
    mahadasha: string;
    antardasha: string;
    pratyantardasha?: string;
  };
  trafficPoliceBlockades: TrafficPoliceBlockade[];
  killerHits180: EvaluatedHit[];
  dangerousHits90: EvaluatedHit[];
  badHits45: EvaluatedHit[];
  protectiveShields120: EvaluatedHit[];
  allHits: EvaluatedHit[];
  shiftingPrescriptions: ShiftingPrescription[];
  genericVastuConflicts: GenericVastuConflict[];
  directionPlanetaryInventory: Record<string, { sign: string; signNum: number; planets: string[]; karakaObjects: string[] }>;
  familyCrossHitIsolationRule: {
    title: string;
    rule: string;
    practicalAdvice: string;
  };
}

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
    description: "अत्यधिक गंभीर रुकावट। ट्रैफिक पुलिस की तरह कार्य को पूर्णतः लॉकअप में डाल देती है।"
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
 * Helper to get sign index from 1 to 12.
 */
function getSignNumber(signNameOrNum: string | number): number {
  if (typeof signNameOrNum === "number") {
    return signNameOrNum;
  }
  const idx = RASHIS_ORDER.indexOf(signNameOrNum as typeof RASHIS_ORDER[number]);
  return idx >= 0 ? idx + 1 : 1;
}

// ── Master Engine Function ──────────────────────────────────────────────────

/**
 * Runs the full Astro-Vastu Hit Theory calculation on any chart.
 */
export function runAstroVastuHitEngine(
  chart: ChartData | null | undefined,
  evaluationDate: Date = new Date()
): AstroVastuHitDossier | null {
  if (!chart || !chart.planets || !chart.lagnaRashi) {
    return null;
  }

  const lagnaSignNum = chart.lagnaNum || getSignNumber(chart.lagnaRashi);
  const lagnaDegInSign = (chart.lagnaLon ?? 0) % 30;
  const lagnaCompoundDeg = calculateCompoundDegree(lagnaSignNum, lagnaDegInSign);

  // 1. Resolve Active Dasha Lords
  let activeMD = chart.dashas?.find(d => {
    const s = new Date(d.start), e = new Date(d.end);
    return evaluationDate >= s && evaluationDate < e;
  })?.planet || chart.dashas?.find(d => d.active)?.planet || "Mars";

  let activeAD = chart.antardasha?.find(a => {
    const s = new Date(a.start), e = new Date(a.end);
    return evaluationDate >= s && evaluationDate < e;
  })?.planet || chart.antardasha?.find(a => a.active)?.planet || activeMD;

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
    const d = chart.planets[p];
    if (d?.nakshatraLord) occupiedNakLords.add(d.nakshatraLord);
  });

  planetNames.forEach(p => {
    const d = chart.planets[p];
    if (!d) return;
    const sNum = d.signNum !== undefined ? (d.signNum >= 1 && d.signNum <= 12 ? d.signNum : d.signNum + 1) : getSignNumber(d.sign);
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
      const sNum = hc.signNum !== undefined ? (hc.signNum >= 1 && hc.signNum <= 12 ? hc.signNum : hc.signNum + 1) : getSignNumber(hc.sign);
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

  // 5. Evaluate Planet-to-Planet Hits & Traffic Police Blockades
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
                blockageTheme: `${blocker.name} acts as a Traffic Police Officer stopping ${role} Lord ${lord} with a ${hit.hitDef.name}, detaining its positive results!`,
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
  const protectiveShields120 = allHits.filter(h => h.hitDef.angle === 120 && h.hitDef.category === "Positive");

  // 7. Generate Shifting Prescriptions (Turning 180°/90° Hit into 120° Shield)
  const shiftingPrescriptions: ShiftingPrescription[] = [];

  // Focus on 180° hits on Lagna or 4th/7th/10th house, or hits on Dasha lords
  const criticalHits = [...killerHits180, ...dangerousHits90].filter(h =>
    h.targetType === "House" && [1, 4, 7, 10].includes(h.targetHouse || 0)
  );

  criticalHits.forEach(ch => {
    const plName = ch.sourceName;
    const plCoord = planetCoords[plName];
    if (!plCoord) return;

    // Find target house from which this planet would cast a 120° trine on the afflicted house
    const affHouse = ch.targetHouse || 1;
    // Trines are 5th (4 houses away) and 9th (8 houses away)
    const targetHouse5 = ((affHouse - 1 + 4) % 12) + 1;
    const targetHouse9 = ((affHouse - 1 + 8) % 12) + 1;

    // Pick target house that is empty or has benefics
    const targetHouse = targetHouse5;
    const targetCusp = cuspCoords[targetHouse];
    if (!targetCusp) return;

    const bodyMapping = SIGN_BODY_PART_MAPPINGS[targetCusp.signNum];
    const items = PLANET_KARAKA_OBJECTS[plName] || [];

    shiftingPrescriptions.push({
      afflictedTarget: ch.targetName,
      problematicPlanet: plName,
      currentHit: ch.hitDef.angle === 180 ? "180° Killer Hit" : "90° Dangerous Hit",
      targetHouse,
      targetSignNum: targetCusp.signNum,
      targetSignName: targetCusp.sign,
      targetDirection: targetCusp.direction.direction,
      targetDirectionHindi: targetCusp.direction.directionHindi,
      shiftingMethod: `Shift the energy of ${plName} to the ${targetCusp.direction.direction} zone (House ${targetHouse} - ${targetCusp.sign}) so it casts a 120° Protective Shield over ${ch.targetName}.`,
      itemsToPlace: [
        plName === "Mars" ? "सिंदूरी हनुमान जी का चित्र / तांबे का त्रिकोण" :
        plName === "Saturn" ? "शनि का स्वच्छ प्रतीक / काले चने या उड़द दान पात्र" :
        plName === "Mercury" ? "हरा इनडोर पौधा / बुध यंत्र" :
        `${plName} का सकारात्मक प्रतीक या रंग`
      ],
      itemsToRemoveFromCurrentZone: items.slice(0, 4),
      bodyPartTherapy: {
        targetBodyPart: bodyMapping.bodyPartHi,
        action: plName === "Saturn" ? "Dot" : plName === "Mercury" ? "Remove_Thread" : "Apply_Oil_Ghee",
        color: plName === "Saturn" ? "Black" : plName === "Mars" ? "Red" : "Green",
        instructions: plName === "Saturn" && targetCusp.signNum === 10
          ? "बाएं घुटने (10 नंबर मकर) पर परमानेंट मार्कर से एक काला डॉट लगाएं।"
          : plName === "Mercury" && targetCusp.signNum === 6
          ? "नाभि पर प्रतिदिन सुबह 2 बूंद शुद्ध गाय का घी लगाएं।"
          : `${bodyMapping.bodyPartHi} पर ${plName} के अनुसार उपचार करें।`
      }
    });
  });

  // 8. Generic MahaVastu vs Personal Astro-Vastu Conflicts
  const genericVastuConflicts: GenericVastuConflict[] = [];

  // Scorpio (Sign 8) Check: Generic Vastu says SSW is Disposal / Toilet
  const scorpioDir = ASTRO_VASTU_SIGN_DIRECTIONS[8];
  const scorpioHouse = Object.values(cuspCoords).find(c => c.signNum === 8)?.house || 8;
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
  const house9Sign = Object.values(cuspCoords).find(c => c.signNum === 9)?.house || 9;
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
  const house2Sign = Object.values(cuspCoords).find(c => c.signNum === 2)?.house || 2;
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
  const house3Sign = Object.values(cuspCoords).find(c => c.signNum === 3)?.house || 3;
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

  return {
    nativeName: chart.name || "Seeker",
    lagnaSign: chart.lagnaRashi,
    lagnaSignNum,
    lagnaCompoundDeg,
    activeDasha: {
      mahadasha: activeMD,
      antardasha: activeAD,
    },
    trafficPoliceBlockades,
    killerHits180,
    dangerousHits90,
    badHits45,
    protectiveShields120,
    allHits,
    shiftingPrescriptions,
    genericVastuConflicts,
    directionPlanetaryInventory,
    familyCrossHitIsolationRule: {
      title: "पारिवारिक क्रॉस-हिट निवारण नियम (Personal vs Household Vastu Isolation)",
      rule: "यदि घर के सामान्य/साझा कमरे में कोई वस्तु या रंग स्थापित करने से परिवार के किसी अन्य सदस्य की कुंडली पर विपरीत प्रभाव (Cross-Hit) पड़ने की संभावना हो, तो उस उपाय को पूरे घर या साझा हॉल में न करें।",
      practicalAdvice: "उस वस्तु को केवल जातक के व्यक्तिगत शयनकक्ष (Personal Bedroom), निजी स्टडी डेस्क, जेब (Pocket), या पर्स में ही रखें। उदाहरण के लिए, लाल कपड़े में 4-5 लाल मिर्च या तांबे का सिक्का अपनी जेब में रखने से केवल जातक का मंगल सक्रिय होगा, परिवार के बाकी सदस्यों की शांति भंग नहीं होगी।",
    },
  };
}

