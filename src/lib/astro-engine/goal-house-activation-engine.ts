// src/lib/astro-engine/goal-house-activation-engine.ts
// ============================================================================
// Goal-Based House Activation & Astro-Vastu Cusp Precision Engine
// Implements:
// 1. Goal-Based House Auto-Calculation (Foreign Travel 3-9-12 with 11 negation,
//    Property Buy 4-11, Property Sell 3-10-7, De-addiction W8, BP/Anger 25g Kada,
//    Partnership Risk Jachika 7th-in-5th rule, Coma Vitality 0.5" dot, etc.)
// 2. Planet-to-House Hit Auto-Calculation (Exact compound cusp degrees)
// 3. Lagna Mandatory Shield (180° / 90° priority override on 1st House Cusp)
// 4. 45 Devtas Floor Hardware Protocols (4"x4"x4" excavation, tape fallback,
//    anti-clockwise springs, Naga dalchini, Varun white spring, Savitra SE)
// 5. Virtual Door Protocol (6ft height above floor, dual-zone thresholding)
// ============================================================================

import type { ChartData, HouseCuspData } from "./calculations";
import {
  type AstroVastuDirection,
  ASTRO_VASTU_SIGN_DIRECTIONS,
  RASHIS_HINDI,
  getSignNumber,
} from "./astro-vastu-types";
import {
  calculateCompoundDegree,
  check358Hit,
  SIGN_BODY_PART_MAPPINGS,
  SIGN_LORDS_MAP,
} from "./astro-vastu-hit-engine";

// ── Types & Interfaces ──────────────────────────────────────────────────────

export type GoalActivationId =
  | "foreign_travel"
  | "property_purchase"
  | "property_sale"
  | "addiction_relief"
  | "high_bp_anger_calm"
  | "partnership_risk_audit"
  | "coma_critical_vitality"
  | "devata_floor_hardware"
  | "virtual_door_protocol"
  | "lagna_mandatory_shield";

export interface GoalActivationHouseDetail {
  house: number;
  houseSign: string;
  houseSignHi: string;
  houseSignNum: number;
  cuspCompoundDeg: number;
  cuspDegreeFormatted: string;
  directionCode: string;
  directionHi: string;
  directionFullEn: string;
  anatomicalPartEn: string;
  anatomicalPartHi: string;
  activationObjectiveHi: string;
  recommendedObjectsHi: string[];
  objectsToAvoidHi: string[];
  biometricDotInstructionHi: string;
}

export interface GoalActivationResult {
  goalId: GoalActivationId;
  goalNameHi: string;
  goalNameEn: string;
  descriptionHi: string;
  primaryHouses: number[];
  negationHouseWarning?: {
    house: number;
    warningHi: string;
    reasonHi: string;
  };
  houseDetails: GoalActivationHouseDetail[];
  shastricVerdictHi: string;
  activeDashaInterplay?: {
    mdLord: string;
    adLord?: string;
    summaryHi: string;
  };
  specificHardwareRemedy?: {
    titleHi: string;
    materialsHi: string[];
    procedureStepsHi: string[];
    precautionHi: string;
  };
  riskAlertHi?: string;
}

export interface CuspEvaluatedHit {
  planetName: string;
  planetSign: string;
  planetCompoundDeg: number;
  house: number;
  cuspSign: string;
  cuspCompoundDeg: number;
  exactDiff: number;
  angleType: 45 | 90 | 180 | 120 | 60 | 30;
  severity: "CRITICAL_KILLER" | "HIGH_DANGER" | "PROBLEM_HIT" | "PROTECTIVE_SHIELD";
  impactCategoryHi: string;
  houseSignificanceHi: string;
  remedyActionHi: string;
}

export interface LagnaMandatoryShieldAssessment {
  isLagnaUnderHit: boolean;
  lagnaCompoundDeg: number;
  lagnaSign: string;
  lagnaSignHi: string;
  criticalHits: CuspEvaluatedHit[];
  urgentActionRequired: boolean;
  shieldBannerHi: string;
  remediationDirectivesHi: string[];
}

export interface PartnershipRiskAssessment {
  seventhHouseSign: string;
  seventhHouseLord: string;
  seventhLordPlacementHouse: number;
  isSeventhLordInFifth: boolean;
  partnerProfitAdvantage: boolean;
  nativeRecoveryNegated: boolean;
  riskSeverity: "HIGH_CRITICAL_RISK" | "MODERATE_CAUTION" | "FAVORABLE_BALANCED";
  verdictHi: string;
  reasoningChainHi: string[];
  spouseNameBusinessSafe: boolean;
}

export interface DevataFloorProtocol {
  excavationStandard: {
    dimensions: string;
    depth: string;
    methodHi: string;
  };
  noDrillingAlternative: {
    methodName: string;
    toolRequired: string;
    instructionHi: string;
  };
  springMechanics: {
    boostEnergy: string;
    suppressEnergy: string;
  };
  metalGuidelinesByZone: Record<string, string>;
  sacredDevataOfferings: {
    devata: string;
    zone: string;
    foodOrMaterialHi: string;
    hardwareHi: string;
    purposeHi: string;
  }[];
}

// ── House Significance Master Map ───────────────────────────────────────────

const HOUSE_SIGNIFICANCE_HI: Record<number, string> = {
  1: "प्रथम भाव (लग्न): शारीरिक स्वास्थ्य, ओज, निर्णय शक्ति एवं व्यक्तित्व",
  2: "द्वितीय भाव: धन संचय, परिवार, वाणी एवं खान-पान की आदतें",
  3: "तृतीय भाव: वीज़ा दस्तावेज़, पराक्रम, छोटे भाई-बहन एवं यात्रा की शुरुआत",
  4: "चतुर्थ भाव: अचल संपत्ति, मकान, वाहन, माता एवं गृह शांति",
  5: "पंचम भाव: बुद्धि, संतान, पूर्व पुण्य एवं स्वास्थ्य सुधार/रोग-मुक्ति",
  6: "षष्ठ भाव: कोर्ट-कचहरी, लिटिगेशन, ऋण, प्रतिस्पर्धी एवं रोग",
  7: "सप्तम भाव: साझेदारी (पार्टनरशिप), वैवाहिक जीवन एवं प्रत्यक्ष ग्राहक",
  8: "अष्टम भाव: अचानक संकट, गुप्त पीड़ा, मानसिक आघात एवं विषाक्तता",
  9: "नवम भाव: लंबी दूरी की विदेश यात्रा, भाग्य, धर्म एवं पिता",
  10: "दशम भाव: कर्म, आजीविका, प्रतिष्ठा, और प्रॉपर्टी का ग्राहक के नाम होना",
  11: "एकादश भाव: लाभ, मनोकामना पूर्ति, मित्र मंडली एवं विदेशी यात्रा की निगेशन",
  12: "द्वादश भाव: विदेशी भूमि पर निवास, व्यय, मोक्ष, और अस्पताल/कोर्ट का खर्च",
};

// ── Polymorphic Helpers ─────────────────────────────────────────────────────

function getPlanetList(chart: ChartData): any[] {
  if (!chart || !chart.planets) return [];
  if (Array.isArray(chart.planets)) {
    return chart.planets.map((p: any) => ({
      name: p.name || p.planet || "Planet",
      ...p,
    }));
  }
  return Object.entries(chart.planets).map(([name, data]: [string, any]) => ({
    name: data.name || data.planet || name,
    ...data,
  }));
}

function findPlanetData(chart: ChartData, name: string): any | null {
  if (!chart || !chart.planets) return null;
  const pList = getPlanetList(chart);
  const target = name.trim().toLowerCase();
  return (
    pList.find(
      (p: any) =>
        p?.name?.toLowerCase() === target ||
        p?.planet?.toLowerCase() === target ||
        p?.id?.toLowerCase() === target
    ) || null
  );
}

export function resolveEffectiveCusps(chart: ChartData): HouseCuspData[] {
  let baseCusps: HouseCuspData[] = [];
  if (chart.kpCusps && Array.isArray(chart.kpCusps) && chart.kpCusps.length >= 12) {
    baseCusps = chart.kpCusps;
  } else if (chart.houseCusps && Array.isArray(chart.houseCusps) && chart.houseCusps.length === 12) {
    baseCusps = chart.houseCusps;
  } else {
    const lagna1to12 = getSignNumber(chart.lagnaRashi, chart.lagnaNum);
    const lagnaLon = chart.lagnaLon || 0;
    const lagnaDegInSign = lagnaLon % 30;

    const RASHIS = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    const generated: HouseCuspData[] = [];
    for (let h = 1; h <= 12; h++) {
      const existing = chart.houseCusps?.find((c) => c.house === h);
      if (existing) {
        generated.push(existing);
        continue;
      }
      const sNum = ((lagna1to12 - 1 + (h - 1)) % 12) + 1;
      const sName = RASHIS[sNum - 1];
      const lon = ((sNum - 1) * 30 + lagnaDegInSign) % 360;
      generated.push({
        house: h,
        lon,
        sign: sName,
        signNum: sNum,
        degree: Math.floor(lagnaDegInSign),
        minutes: Math.round((lagnaDegInSign - Math.floor(lagnaDegInSign)) * 60),
        nakshatra: "Ashwini",
        nakshatraLord: "Ketu",
        pada: 1,
        source: "degree-equal-bhava",
      });
    }
    baseCusps = generated;
  }

  // Ensure every single cusp has guaranteed 1-indexed signNum (1..12)
  return baseCusps.map((c) => {
    const sNum = getSignNumber(c.sign, c.signNum);
    return {
      ...c,
      signNum: sNum,
    };
  });
}

export function getCuspCompoundDegree(cusp: HouseCuspData): number {
  const degInSign = (cusp.degree || 0) + (cusp.minutes || 0) / 60;
  const sNum = getSignNumber(cusp.sign, cusp.signNum);
  return calculateCompoundDegree(sNum, degInSign);
}

// ── Planet-to-House Hit Calculation ─────────────────────────────────────────

/**
 * Calculates compound degree hits from all planets to all 12 house cusps.
 * Uses 3-5-8 Rule:
 * 180° Killer Hit (±8° -> [172°-188°])
 * 90° Dangerous Hit (±5° -> [85°-95°])
 * 45° Bad Hit (±3° -> [42°-48°])
 * 120° Protective Trine (±8° -> [112°-128°])
 */
export function evaluatePlanetToHouseHits(chart: ChartData | null | undefined): CuspEvaluatedHit[] {
  if (!chart) return [];
  const cusps = resolveEffectiveCusps(chart);
  const planets = getPlanetList(chart);
  const hits: CuspEvaluatedHit[] = [];

  for (const pl of planets) {
    if (!pl || pl.lon === undefined) continue;
    const plSignNum = pl.signNum || Math.floor(pl.lon / 30) + 1;
    const plDegInSign = pl.degree !== undefined ? pl.degree : pl.lon % 30;
    const plCompound = calculateCompoundDegree(plSignNum, plDegInSign);

    for (const cs of cusps) {
      const csCompound = getCuspCompoundDegree(cs);
      const hitRes = check358Hit(plCompound, csCompound);
      if (!hitRes) continue;

      const angle = hitRes.hitDef.angle;
      let severity: CuspEvaluatedHit["severity"] = "PROBLEM_HIT";
      if (angle === 180) severity = "CRITICAL_KILLER";
      else if (angle === 90) severity = "HIGH_DANGER";
      else if (angle === 120) severity = "PROTECTIVE_SHIELD";

      let impactCategoryHi = "साधारण प्रभाव";
      if (cs.house === 1) impactCategoryHi = "शारीरिक ओज, स्वास्थ्य एवं मस्तिष्क पर दबाव";
      else if (cs.house === 6) impactCategoryHi = "कोर्ट-कचहरी, ज़मीन विवाद या असाध्य रोग";
      else if (cs.house === 7) impactCategoryHi = "दांपत्य कलह अथवा पार्टनरशिप में धोखा";
      else if (cs.house === 8) impactCategoryHi = "अचानक रुकावटें, चोट अथवा गहरा मानसिक कष्ट";
      else if (cs.house === 10) impactCategoryHi = "करियर, पद-प्रतिष्ठा अथवा व्यवसाय में व्यवधान";
      else if (cs.house === 12) impactCategoryHi = "अस्पताल, कोर्ट अथवा अनियंत्रित आर्थिक व्यय";
      else impactCategoryHi = `${cs.house}वें भाव के कार्यक्षेत्र में असंतुलन`;

      const dirData = ASTRO_VASTU_SIGN_DIRECTIONS[plSignNum];
      const remedyActionHi =
        angle === 180 || angle === 90
          ? `${pl.name} के कारक सामान को ${dirData.directionHindi} (${dirData.code}) ज़ोन से हटाकर इसके 120° त्रिकोण ज़ोन में विस्थापित करें।`
          : `${dirData.directionHindi} ज़ोन को स्वच्छ एवं संतुलित रखें।`;

      hits.push({
        planetName: pl.name || "Planet",
        planetSign: pl.sign || "",
        planetCompoundDeg: Math.round(plCompound * 100) / 100,
        house: cs.house,
        cuspSign: cs.sign,
        cuspCompoundDeg: Math.round(csCompound * 100) / 100,
        exactDiff: hitRes.exactDiff,
        angleType: angle,
        severity,
        impactCategoryHi,
        houseSignificanceHi: HOUSE_SIGNIFICANCE_HI[cs.house] || `${cs.house}वां भाव`,
        remedyActionHi,
      });
    }
  }

  return hits;
}

// ── Lagna Mandatory Shield ──────────────────────────────────────────────────

/**
 * Checks if the 1st House (Lagna Cusp) receives a 180° Killer Hit or 90° Dangerous Hit.
 * When present, this is a top-priority alert that overrides standard Dasha delays.
 */
export function evaluateLagnaMandatoryShield(chart: ChartData | null | undefined): LagnaMandatoryShieldAssessment {
  if (!chart) {
    return {
      isLagnaUnderHit: false,
      lagnaCompoundDeg: 0,
      lagnaSign: "",
      lagnaSignHi: "",
      criticalHits: [],
      urgentActionRequired: false,
      shieldBannerHi: "कुंडली डेटा उपलब्ध नहीं है।",
      remediationDirectivesHi: [],
    };
  }

  const cusps = resolveEffectiveCusps(chart);
  const lagnaCusp = cusps.find((c) => c.house === 1) || cusps[0];
  const lagnaCompound = getCuspCompoundDegree(lagnaCusp);
  const allCuspHits = evaluatePlanetToHouseHits(chart);

  const criticalLagnaHits = allCuspHits.filter(
    (h) => h.house === 1 && (h.angleType === 180 || h.angleType === 90)
  );

  const isUnderHit = criticalLagnaHits.length > 0;
  const lagnaSignHi = RASHIS_HINDI[lagnaCusp.signNum] || lagnaCusp.sign;

  const remediationDirectivesHi: string[] = [];
  if (isUnderHit) {
    for (const h of criticalLagnaHits) {
      remediationDirectivesHi.push(
        `• ${h.planetName} का ${h.angleType}° हिट लग्न (${lagnaSignHi}) पर है: ${h.remedyActionHi}`
      );
    }
    remediationDirectivesHi.push(
      "• लग्न की रक्षा हेतु सिर/माथे के भाग पर कोई काला या अवांछित धागा/निशान न लगाएं।"
    );
  }

  const shieldBannerHi = isUnderHit
    ? `⚠️ उच्च-प्राथमिकता लग्न सुरक्षा शील्ड: प्रथम भाव (लग्न बिंदु ${Math.round(lagnaCompound)}°) पर ${criticalLagnaHits.map((h) => `${h.planetName} (${h.angleType}°)`).join(", ")} का सीधा प्रहार है। दशा की प्रतीक्षा किए बिना इसका तत्काल विस्थापन अनिवार्य है।`
    : `✅ लग्न बिंदु (${lagnaSignHi} ${Math.round(lagnaCompound)}°) पर कोई 180°/90° का पापी प्रहार नहीं है। लग्न ऊर्जा सुरक्षित है।`;

  return {
    isLagnaUnderHit: isUnderHit,
    lagnaCompoundDeg: Math.round(lagnaCompound * 100) / 100,
    lagnaSign: lagnaCusp.sign,
    lagnaSignHi,
    criticalHits: criticalLagnaHits,
    urgentActionRequired: isUnderHit,
    shieldBannerHi,
    remediationDirectivesHi,
  };
}

// ── Partnership Risk Audit (Jachika Rule) ───────────────────────────────────

/**
 * Evaluates 7th house and placement of 7th Lord.
 * Detects if 7th Lord sits in 5th house (which is 11th from 7th):
 * - Partner captures 100% of profits (11th from 7th).
 * - Native's 6th house (recovery & competitive gain) is negated (5th is 12th from 6th).
 * - High alert against partnership and against running business in spouse's name.
 */
export function evaluatePartnershipRiskAudit(chart: ChartData | null | undefined): PartnershipRiskAssessment {
  if (!chart) {
    return {
      seventhHouseSign: "",
      seventhHouseLord: "",
      seventhLordPlacementHouse: 0,
      isSeventhLordInFifth: false,
      partnerProfitAdvantage: false,
      nativeRecoveryNegated: false,
      riskSeverity: "FAVORABLE_BALANCED",
      verdictHi: "चार्ट उपलब्ध नहीं है।",
      reasoningChainHi: [],
      spouseNameBusinessSafe: true,
    };
  }

  const cusps = resolveEffectiveCusps(chart);
  const seventhCusp = cusps.find((c) => c.house === 7) || cusps[6];
  const seventhSign = seventhCusp.sign;
  const seventhLord = SIGN_LORDS_MAP[seventhSign] || "Mercury";

  const seventhLordData = findPlanetData(chart, seventhLord);
  const placementHouse = seventhLordData?.house || 1;
  const isLordInFifth = placementHouse === 5;

  const reasoningChainHi: string[] = [];
  reasoningChainHi.push(`1. सप्तम भाव (साझेदारी/पार्टनर) का स्वामी ${seventhLord} है (${seventhSign} राशि)।`);
  reasoningChainHi.push(`2. सप्तमेश ${seventhLord} कुंडली के ${placementHouse}वें भाव में स्थित है।`);

  let riskSeverity: PartnershipRiskAssessment["riskSeverity"] = "FAVORABLE_BALANCED";
  let verdictHi = "साझेदारी में ऊर्जा सामान्य व संतुलित है।";
  let spouseNameSafe = true;

  if (isLordInFifth) {
    riskSeverity = "HIGH_CRITICAL_RISK";
    spouseNameSafe = false;
    reasoningChainHi.push(
      "3. पंचम भाव सप्तम से 11वां (सप्तम का लाभ भाव) है $\\rightarrow$ व्यापार का सारा लाभ/प्रॉफिट पार्टनर की झोली में जाएगा।"
    );
    reasoningChainHi.push(
      "4. पंचम भाव जातक के छठे भाव का 12वां (व्यय/निगेशन) है $\\rightarrow$ जातक की पूंजी, दैनिक रिकवरी और कानूनी सुरक्षा शून्य हो जाएगी।"
    );
    reasoningChainHi.push(
      "5. जीवनसाथी (पत्नी/पति) भी सप्तम भाव से देखा जाता है, अतः उनके नाम से भी साझेदारी करना समान घाटा देगा।"
    );
    verdictHi =
      "🚨 अत्यंत संवेदनशील पार्टनरशिप अलर्ट: सप्तमेश पंचम में बैठकर पार्टनर को 11वें का पूर्ण लाभ दे रहा है और जातक का 6ठा भाव निगेट कर रहा है। पार्टनरशिप में निवेश करने से भारी आर्थिक क्षति निश्चित है।";
  } else {
    reasoningChainHi.push("3. सप्तमेश पंचम भाव में न होने से पार्टनर लाभ का एकतरफा अपहरण नहीं कर पाएगा।");
  }

  return {
    seventhHouseSign: seventhSign,
    seventhHouseLord: seventhLord,
    seventhLordPlacementHouse: placementHouse,
    isSeventhLordInFifth: isLordInFifth,
    partnerProfitAdvantage: isLordInFifth,
    nativeRecoveryNegated: isLordInFifth,
    riskSeverity,
    verdictHi,
    reasoningChainHi,
    spouseNameBusinessSafe: spouseNameSafe,
  };
}

// ── 45 Devtas Floor Hardware Protocols ──────────────────────────────────────

export function getDevataFloorHardwareProtocols(): DevataFloorProtocol {
  return {
    excavationStandard: {
      dimensions: "4 इंच × 4 इंच (4'' × 4'')",
      depth: "4 इंच फर्श के नीचे (4'' deep under floor cement/tile)",
      methodHi:
        "फर्श की टाइल को 4'' × 4'' काटकर 4 इंच सीमेंट गहरा खोदें। वहां संबंधित देवता का भोग या धातु/स्प्रिंग स्थापित कर ऊपर से सीमेंट भरकर पुनः टाइल लगा दें।",
    },
    noDrillingAlternative: {
      methodName: "डबल-साइडेड हेवी टेप विधि (Double-sided Heavy Tape Protocol)",
      toolRequired: "औद्योगिक डबल-साइडेड टेप (Industrial Double-Sided Foam Tape)",
      instructionHi:
        "किराए के मकान अथवा मार्बल फ्लोर पर जहां ड्रिल या कटिंग निषिद्ध हो, वहां ठीक उस देवता के पद/कोऑर्डिनेट पर फर्श के ऊपर धातु की पत्ती या प्लेट को डबल टेप से मजबूती से चिपका दें।",
    },
    springMechanics: {
      boostEnergy:
        "एंटी-क्लॉकवाइज स्प्रिंग (Anti-clockwise Spring): दबी हुई या क्षीण ऊर्जा को ऊपर खींचकर सक्रिय करने के लिए एंटी-क्लॉकवाइज स्प्रिंग जमीन में स्थापित की जाती है।",
      suppressEnergy:
        "क्लॉकवाइज स्प्रिंग (Clockwise Spring): अत्यधिक आक्रामक अथवा अवांछित ऊर्जा को दबाने/शांत करने के लिए क्लॉकवाइज स्प्रिंग प्रयोग की जाती है।",
    },
    metalGuidelinesByZone: {
      North: "एल्युमिनियम (Aluminium - सफेद/हल्की धातु)",
      East: "स्टेनलेस स्टील / कॉपर (Stainless Steel / Copper)",
      South: "कॉपर / ब्रास (तांबा / पीतल)",
      West: "आयरन (सफेद रंग का लोहा) / ब्रास",
    },
    sacredDevataOfferings: [
      {
        devata: "नागा देवता (Naga Devta)",
        zone: "ENE/NE (ईशान कोण के समीप)",
        foodOrMaterialHi: "दालचीनी (Cinnamon Stick/Powder)",
        hardwareHi: "एंटी-क्लॉकवाइज स्प्रिंग अथवा तांबे की पत्ती",
        purposeHi: "विषहरण, भावनात्मक सुरक्षा और पारिवारिक समन्वय की ऊर्जा सक्रिय करना।",
      },
      {
        devata: "वरुण देवता (Varun Devta)",
        zone: "West (पश्चिम दिशा)",
        foodOrMaterialHi: "कच्चा दूध अथवा मखाने का भोग",
        hardwareHi: "सफेद रंग की लोहे (Iron) की एंटी-क्लॉकवाइज स्प्रिंग",
        purposeHi: "धन के प्रवाह को सुगम बनाना और पश्चिम दिशा की रुकावटें खोलना।",
      },
      {
        devata: "सोमा देवता (Soma Devta)",
        zone: "North (उत्तर दिशा - कुबेर क्षेत्र)",
        foodOrMaterialHi: "सफेद मिष्ठान्न अथवा खीर",
        hardwareHi: "एल्युमिनियम स्प्रिंग अथवा चांदी/सफेद धातु प्लेट",
        purposeHi: "व्यापारिक तरलता, नए अवसर और मानसिक शीतलता को पुष्ट करना।",
      },
      {
        devata: "पितृ देवता (Pitru Devta)",
        zone: "SW (नैऋत्य कोण)",
        foodOrMaterialHi: "गुड़ व उड़द दाल का भोग",
        hardwareHi: "पीतल (Brass) की पत्ती या भारी ब्रास पिरामिड",
        purposeHi: "पूर्वजों के आशीर्वाद से स्थायित्व, गृह-स्वामी का प्रभाव और रिश्तों की रक्षा।",
      },
      {
        devata: "W8 पद — नशा मुक्ति (W8 Substance Addiction Cure)",
        zone: "W8 (पश्चिम-दक्षिण-पश्चिम पद)",
        foodOrMaterialHi: "साबुत गोल सुपारी (Whole Solid Betel Nut)",
        hardwareHi: "फर्श में 4 इंच गहरा छेद करके सुपारी स्थापित करना",
        purposeHi: "सूर्य-राहु दशा जनित शराब/ड्रग्स की लत और आवेगी व्यवहार को जड़ से काटना।",
      },
      {
        devata: "सावित्रा देवता (Savitra - Impulse Control)",
        zone: "ब्रह्मस्थान से ठीक आगे साउथ-ईस्ट (SE)",
        foodOrMaterialHi: "तांबे का गोल सिक्का अथवा पीला सरसों",
        hardwareHi: "तांबे की गोल चकती फर्श पर डबल टेप से लगाना",
        purposeHi: "मस्तिष्क के न्यूरोलॉजिकल आवेग और दैनिक मदिरापान की तलब को शांत करना।",
      },
    ],
  };
}

// ── Virtual Door Protocol ───────────────────────────────────────────────────

export function getVirtualDoorProtocol() {
  return {
    installationHeight: "फर्श स्तर से ठीक 6 फीट ऊपर (6 ft from finished floor level upwards)",
    wallPlacement: "दीवार के ऊर्ध्वाधर मध्य से थोड़ा ऊपर (Slightly above physical center)",
    dualZoneDivisionHi:
      "यदि कोई मुख्य प्रवेश द्वार दो ज़ोन्स में आ रहा हो (उदाहरण: एक सकारात्मक शुभ पद और एक नकारात्मक पद), तो नकारात्मक पद वाले भाग के नीचे फर्श पर ब्रास/धातु की विभाजक पट्टी लगाकर उसे ब्लॉक करें और शुभ पद वाले भाग को खुला रखें।",
  };
}

// ── Master Goal-Based House Activation Function ─────────────────────────────

export function evaluateGoalHouseActivation(
  chart: ChartData | null | undefined,
  goalId: GoalActivationId
): GoalActivationResult {
  if (!chart) {
    return {
      goalId,
      goalNameHi: "अज्ञात लक्ष्य",
      goalNameEn: "Unknown Goal",
      descriptionHi: "चार्ट डेटा उपलब्ध नहीं है।",
      primaryHouses: [],
      houseDetails: [],
      shastricVerdictHi: "कुंडली इनपुट की प्रतीक्षा है।",
    };
  }

  const cusps = resolveEffectiveCusps(chart);

  // Helper to construct house detail
  const buildHouseDetail = (
    houseNum: number,
    objectiveHi: string,
    recommendedObjectsHi: string[],
    objectsToAvoidHi: string[],
    biometricDotInstructionHi: string
  ): GoalActivationHouseDetail => {
    const cusp = cusps.find((c) => c.house === houseNum) || cusps[(houseNum - 1) % 12];
    const sNum = getSignNumber(cusp?.sign, cusp?.signNum);
    const compoundDeg = getCuspCompoundDegree(cusp);
    const dirData = ASTRO_VASTU_SIGN_DIRECTIONS[sNum] || ASTRO_VASTU_SIGN_DIRECTIONS[1];
    const bodyPart = SIGN_BODY_PART_MAPPINGS[sNum] || SIGN_BODY_PART_MAPPINGS[1];

    return {
      house: houseNum,
      houseSign: cusp.sign,
      houseSignHi: RASHIS_HINDI[sNum] || cusp.sign,
      houseSignNum: sNum,
      cuspCompoundDeg: Math.round(compoundDeg * 100) / 100,
      cuspDegreeFormatted: `${cusp.degree}° ${cusp.minutes}'`,
      directionCode: dirData.code,
      directionHi: dirData.directionHindi,
      directionFullEn: dirData.direction,
      anatomicalPartEn: bodyPart.bodyPartEn,
      anatomicalPartHi: bodyPart.bodyPartHi,
      activationObjectiveHi: objectiveHi,
      recommendedObjectsHi,
      objectsToAvoidHi,
      biometricDotInstructionHi,
    };
  };

  switch (goalId) {
    case "foreign_travel": {
      const h3 = buildHouseDetail(
        3,
        "वीज़ा दस्तावेज़, पासपोर्ट, स्वदेश से प्रस्थान (Leaving Hometown) एवं कागजी औपचारिकताएं",
        ["पासपोर्ट की प्रतिलिपि", "विमान टिकट का प्रिंट", "यात्रा डायरी", "हल्के हरे/सफेद रंग का लिफाफा"],
        ["भारी कबाड़", "खराब बंद घड़ियां", "पुराने लाल डिब्बे"],
        "तृतीय भाव के राशि-अंग पर हल्के हरे रंग का 1mm सूक्ष्म डॉट लगाएं।"
      );
      const h9 = buildHouseDetail(
        9,
        "दीर्घ-दूरी अंतरराष्ट्रीय यात्रा, विदेशी विश्वविद्यालय/नौकरी एवं भाग्य का समर्थन",
        ["ग्लोब (World Globe)", "विदेशी गंतव्य का मानचित्र/तस्वीर", "हवाई जहाज का धातु मॉडल"],
        ["गंदा पानी", "अव्यवस्थित जूते-चप्पल"],
        "नवम भाव के राशि-अंग पर हल्के पीले अथवा चंदन का डॉट लगाएं।"
      );
      const h12 = buildHouseDetail(
        12,
        "विदेशी धरती पर निवास, स्थायी नागरिकता (PR/Work Visa) एवं अंतरराष्ट्रीय सैटलमेंट",
        ["विदेशी मुद्रा (Foreign Currency Notes)", "विदेशी भाषा की पुस्तक", "अंतरराष्ट्रीय घड़ी"],
        ["जंग लगा लोहा", "काले कपड़े का गट्ठर"],
        "द्वादश भाव के राशि-अंग (पैर/तलवे) पर नारियल तेल अथवा गुलाब जल से अभिमंत्रित बिंदु।"
      );

      return {
        goalId: "foreign_travel",
        goalNameHi: "विदेश यात्रा, वीज़ा व सैटलमेंट सक्रियण",
        goalNameEn: "Foreign Travel & Overseas Settlement",
        descriptionHi: "तृतीय (कागजात), नवम (यात्रा) एवं द्वादश (विदेशी भूमि) का त्रिकोणीय सक्रियण।",
        primaryHouses: [3, 9, 12],
        negationHouseWarning: {
          house: 11,
          warningHi: "⚠️ 11वें भाव को भूलकर भी सक्रिय न करें!",
          reasonHi:
            "11वां भाव द्वादश भाव (विदेश निवास) का 12वां (व्यय/निगेशन) होता है। यदि विदेश यात्रा के समय 11वें भाव को सक्रिय किया गया, तो वीज़ा निरस्त हो जाएगा या व्यक्ति तत्काल स्वदेश लौट आएगा।",
        },
        houseDetails: [h3, h9, h12],
        shastricVerdictHi:
          "विदेश यात्रा के लिए केवल 3, 9, और 12 के दिशा-ज़ोन्स को सक्रिय करें। 11वें भाव के ज़ोन में कोई विदेशी सामान या ऊर्जा-वर्धक वस्तु न रखें।",
      };
    }

    case "property_purchase": {
      const h4 = buildHouseDetail(
        4,
        "अचल संपत्ति, भूमि, मकान, फ्लैट व ईंट-पत्थर का ठोस ढांचा (Fixed Asset)",
        ["मकान का नक्शा/ब्रोशर", "नए घर की चाबियों का गुच्छा", "पीली मिट्टी का गमला", "चौकोर ब्रास प्लेट"],
        ["टूटा हुआ फर्नीचर", "गीला कचरा", "काले रंग के पर्दे"],
        "चतुर्थ भाव के राशि-अंग पर हल्दी अथवा चंदन का स्वास्तिक बिंदु लगाएं।"
      );
      const h11 = buildHouseDetail(
        11,
        "रजिस्ट्री, स्वामित्व, लाभ व मनोकामना पूर्ति (Registered Title & Possession)",
        ["मेटैलिक विंड चाइम (Metallic Wind Chime)", "सफेद/पीला क्रिस्टल", "इच्छापूर्ति पत्र"],
        ["बंद इलेक्ट्रॉनिक कचरा", "टूटी क्रॉकरी"],
        "एकादश भाव के राशि-अंग (पिंडली/टखना) पर सफेद चंदन का बिंदु लगाएं।"
      );

      return {
        goalId: "property_purchase",
        goalNameHi: "मकान व अचल संपत्ति क्रय (खरीदना)",
        goalNameEn: "Property Purchase & Acquisition",
        descriptionHi: "चतुर्थ भाव (मकान) एवं एकादश भाव (प्राप्ति व इच्छापूर्ति) का संयुक्त सक्रियण।",
        primaryHouses: [4, 11],
        houseDetails: [h4, h11],
        shastricVerdictHi:
          "चतुर्थ भाव संपत्ति के मूर्त रूप को और एकादश भाव उसकी कानूनी रजिस्ट्री व प्राप्ति को नियंत्रित करता है। दोनों दिशाओं को ऊर्जावान करने से संपत्ति क्रय का मार्ग प्रशस्त होता है।",
      };
    }

    case "property_sale": {
      const h3 = buildHouseDetail(
        3,
        "संपत्ति से विच्छेद (चतुर्थ का 12वां भाव = संपत्ति का आपसे छूटना/बिकना)",
        ["'फॉर सेल' (FOR SALE) का ड्राफ्ट", "संपत्ति के कागजात की फोटोकॉपी", "पवन चक्की प्रतीक"],
        ["भारी तिजोरी", "विशाल पत्थर"],
        "तृतीय भाव के राशि-अंग पर हल्के नीले/हरे रंग का बिंदु लगाएं।"
      );
      const h10 = buildHouseDetail(
        10,
        "ग्राहक का चतुर्थ भाव (सप्तम से चतुर्थ = संपत्ति ग्राहक के अधिकार में जाना)",
        ["कैश काउंटर अथवा सिक्कों का कटोरा", "विक्रय अनुबंध पत्र", "धातु का कलश"],
        ["गंदा पोछा", "कूड़ेदान"],
        "दशम भाव के राशि-अंग (घुटने) पर सरसों तेल अथवा कपूर का स्पर्श।"
      );
      const h7 = buildHouseDetail(
        7,
        "सच्चे खरीदार/क्लाइंट का आगमन (Buyer Attraction)",
        ["गुलाब जल का स्प्रे", "दो सुनहरी घंटियां", "शुभ ग्राहक प्रतीक"],
        ["कांटेदार कैक्टस", "जंग लगे औजार"],
        "सप्तम भाव के राशि-अंग पर इत्र (Perfume) का छिड़काव।"
      );

      return {
        goalId: "property_sale",
        goalNameHi: "संपत्ति विक्रय व त्वरित निस्तारण (बेचना)",
        goalNameEn: "Property Sale & Swift Liquidation",
        descriptionHi: "तृतीय (4थे का व्यय), सप्तम (ग्राहक) एवं दशम (ग्राहक की संपत्ति) का निस्तारण चक्र।",
        primaryHouses: [3, 10, 7],
        houseDetails: [h3, h10, h7],
        shastricVerdictHi:
          "संपत्ति तब बिकती है जब वह आपके चतुर्थ भाव से छूटकर (3H) ग्राहक के पास जाती है (10H = सप्तम से चतुर्थ)। मात्र 3 और 10 के ज़ोन सक्रिय करने से फंसी हुई प्रॉपर्टी तुरंत बिक जाती है।",
      };
    }

    case "addiction_relief": {
      const h2 = buildHouseDetail(
        2,
        "मुख, वाणी एवं खान-पान/मादक पदार्थ सेवन का प्राथमिक द्वार",
        ["गंगाजल की बोतल", "चांदी का चौकोर टुकड़ा", "मिश्री/सौंफ का पात्र"],
        ["शराब की खाली/भरी बोतलें", "सिगरेट के ऐशट्रे", "गुटखा पाउच"],
        "गले/कंठ क्षेत्र पर शुद्ध जल का मार्जन।"
      );
      const h8 = buildHouseDetail(
        8,
        "गुप्तांग, विषाक्तता, व्यसन की लत और अवचेतन गहरा आकर्षण",
        ["साबुत अनार", "कपूर की टिकिया"],
        ["खराब दवाइयां", "रासायनिक कीटनाशक"],
        "अष्टम भाव के राशि-अंग पर तिल के तेल का हल्का स्पर्श।"
      );

      return {
        goalId: "addiction_relief",
        goalNameHi: "नशा व व्यसन मुक्ति (शराब/ड्रग्स मुक्ति)",
        goalNameEn: "Addiction Relief & Habit Neutralization",
        descriptionHi: "W8 पद में सुपारी स्थापन एवं सावित्रा देवता द्वारा न्यूरो-इंपल्स नियंत्रण।",
        primaryHouses: [2, 8],
        houseDetails: [h2, h8],
        specificHardwareRemedy: {
          titleHi: "W8 पद सुपारी निष्कासन एवं सावित्रा सक्रियण",
          materialsHi: ["साबुत गोल सुपारी (Betel Nut)", "तांबे का गोल सिक्का", "गंगाजल"],
          procedureStepsHi: [
            "घर के W8 (पश्चिम-दक्षिण-पश्चिम) पद में फर्श पर 4 इंच गहरा ड्रिल या कट लगाएं।",
            "उसमें एक साबुत सुपारी दबाकर ऊपर से सीमेंट भरकर टाइल लगा दें। (किराएदार होने पर डबल-टेप से चिपकाएं)।",
            "ब्रह्मस्थान से ठीक आगे साउथ-ईस्ट (SE) की ओर सावित्रा देवता के स्थान पर एक तांबे की चकती स्थापित करें।",
            "SSW (वृश्चिक) दिशा से समस्त खराब इलेक्ट्रॉनिक्स एवं खाली बोतलें तुरंत बाहर फेंकें।",
          ],
          precautionHi: "शराब की बोतलों को केवल एक दिशा से दूसरी दिशा में न खिसकाएं, अपितु जड़ से ब्लॉक करें।",
        },
        shastricVerdictHi:
          "सूर्य की महादशा में जब राहु नक्षत्र स्वामी हो, तो W8 पद में 4 इंच नीचे सुपारी दबाने से नशा छूटता है।",
      };
    }

    case "high_bp_anger_calm": {
      const h1 = buildHouseDetail(
        1,
        "मस्तिष्क, सिर, स्वभाव, रक्तचाप एवं क्रोध नियंत्रण (Lagna Calm)",
        ["चांदी का कलश", "सफेद चंदन", "मोरपंख"],
        ["लाल तीखे नुकीले चाकू", "ज्वलनशील पदार्थ"],
        "माथे के मध्य चंदन का लेप।"
      );
      const h3 = buildHouseDetail(
        3,
        "पराक्रम, आक्रामकता एवं भुजाओं की विद्युत ऊर्जा (Anger Dissipation)",
        ["मोरपंख", "चांदी का कड़ा"],
        ["जंग लगे लोहे के औजार"],
        "कलाई पर शुद्ध सूती सफेद धागा।"
      );

      return {
        goalId: "high_bp_anger_calm",
        goalNameHi: "क्रोध, उच्च रक्तचाप व घरेलू कलह शांति",
        goalNameEn: "High BP, Anger & Domestic Harmony",
        descriptionHi: "25 ग्राम चांदी-कॉपर कड़ा, किचन फर्श भोजन ग्राउंडिंग एवं उत्तर-ईशान संतुलन।",
        primaryHouses: [1, 3],
        houseDetails: [h1, h3],
        specificHardwareRemedy: {
          titleHi: "25 ग्राम ढलाई वाला चांदी का कड़ा एवं किचन ग्राउंडिंग",
          materialsHi: [
            "25 ग्राम मशीन-निर्मित चांदी का कड़ा (बिना टांके/जोड़ का)",
            "शुद्ध तांबे (कॉपर) की पतली तार",
            "कच्चा गाय का दूध",
            "नीला बल्ब (यदि नॉर्थ कटा हो)",
            "पूर्ण-देह बुद्ध प्रतिमा (यदि NE में केतु हो)",
          ],
          procedureStepsHi: [
            "25 ग्राम चांदी के कड़े के आर-पार तांबे की तार छिदवाकर डलवाएं।",
            "मंगलवार सुबह 7:00 बजे इसे कच्चे दूध से धोकर बाएं हाथ (Left Hand) में धारण करें।",
            "दैनिक नियम: परिवार सहित रसोईघर (Kitchen) की नंगी फर्श पर बैठकर भोजन करें। यह मंगल के उग्र पित्त को पूर्णतः ग्राउंड कर देता है।",
            "यदि उत्तर दिशा कटी हुई हो, तो कटे हुए कोने में एक नीला LED बल्ब लगाएं।",
            "यदि नॉर्थ-ईस्ट में केतु हो अथवा मानसिक भ्रम हो, तो ध्यान मुद्रा में 'पूर्ण काया (Full Body)' वाली बुद्ध प्रतिमा NE में स्थापित करें।",
          ],
          precautionHi: "बुद्ध प्रतिमा का केवल सिर (Bust) कभी न रखें; सदा पूर्ण देह ध्यान मुद्रा होनी चाहिए।",
        },
        shastricVerdictHi:
          "रसोई की फर्श पर बैठकर भोजन करने और तांबे-तार युक्त चांदी कड़ा धारण करने से उच्च रक्तचाप व क्रोध 72 घंटे में शांत होता है।",
      };
    }

    case "partnership_risk_audit": {
      const audit = evaluatePartnershipRiskAudit(chart);
      const h7 = buildHouseDetail(
        7,
        "साझेदारी (Partnership), व्यापारिक अनुबंध व प्रत्यक्ष साझेदार",
        ["संतुलन तराजू का प्रतीक"],
        ["टूटा हुआ शीशा"],
        "सप्तम भाव अंग पर संयमित मार्जन।"
      );
      const h5 = buildHouseDetail(
        5,
        "सप्तम का 11वां (पार्टनर का लाभ) एवं जातक के छठे का 12वां (जातक की रिकवरी की निगेशन)",
        ["गायत्री मंत्र फ्रेम"],
        ["अवांछित कागजात"],
        "पंचम भाव अंग पर ध्यान।"
      );

      return {
        goalId: "partnership_risk_audit",
        goalNameHi: "पार्टनरशिप जोखिम विश्लेषण (याचिका केस सूत्र)",
        goalNameEn: "Business Partnership Risk Audit",
        descriptionHi: "सप्तमेश के पंचम भाव में बैठने पर पार्टनर द्वारा 100% लाभ हरण का शास्त्रीय ऑडिट।",
        primaryHouses: [7, 5],
        houseDetails: [h7, h5],
        riskAlertHi: audit.verdictHi,
        shastricVerdictHi: audit.verdictHi,
      };
    }

    case "coma_critical_vitality": {
      const h1 = buildHouseDetail(
        1,
        "प्राण-तत्व, जीवन शक्ति एवं चेतना का मूलाधार (Prana Awakening)",
        ["गंगाजल", "पीतल का स्वास्तिक"],
        ["सड़े हुए फूल"],
        "लग्न राशि के अंग पर 0.5 से 1 इंच का सूक्ष्म प्राण-डॉट।"
      );
      const h5 = buildHouseDetail(
        5,
        "रोग-मुक्ति, स्वास्थ्य सुधार एवं पूर्व-पुण्य ऊर्जा (5th House Negation of 6th House Disease)",
        ["संजीवनी पौधा"],
        ["काली दवाइयां"],
        "पंचम राशि के अंग पर 0.5 इंच का प्राण-बिंदु।"
      );

      return {
        goalId: "coma_critical_vitality",
        goalNameHi: "कोमा व गंभीर रोगी प्राण-तत्व एक्टिवेशन",
        goalNameEn: "Coma & Critical Vitality Recovery",
        descriptionHi: "0.5 से 1 इंच के बायोमेट्रिक सूक्ष्म-डॉट द्वारा प्राण-वायु का संचालन।",
        primaryHouses: [1, 5],
        houseDetails: [h1, h5],
        specificHardwareRemedy: {
          titleHi: "0.5 से 1 इंच सूक्ष्म प्राण-डॉट थेरेपी",
          materialsHi: ["शुद्ध चंदन अथवा प्राकृतिक रोली", "गुलाब जल"],
          procedureStepsHi: [
            "मरीज के लग्न अथवा पंचम भाव के राशि-अंग पर ठीक 0.5 इंच से 1 इंच का गोल सूक्ष्म डॉट लगाएं।",
            "पुरुष मरीज के दाहिने अंग पर और महिला मरीज के बाएं अंग पर यह बिंदु स्थापित करें।",
            "दैनिक रूप से रोगी के कमरे की उत्तर-पूर्व (NE) दिशा में कपूर प्रज्वलित करें।",
          ],
          precautionHi: "डॉट का आकार 1 इंच से बड़ा न हो; सूक्ष्मता में ही प्राण-ऊर्जा संचरण का रहस्य है।",
        },
        shastricVerdictHi:
          "गंभीर या कोमा में पड़े रोगी के लग्न/पंचम राशि-अंग पर 0.5'' का सूक्ष्म बिंदु लगाने से अवचेतन प्राण-तत्व जाग्रत होता है।",
      };
    }

    case "devata_floor_hardware": {
      const protocols = getDevataFloorHardwareProtocols();
      return {
        goalId: "devata_floor_hardware",
        goalNameHi: "45 देवता जमीनी विनिर्देश (4''×4'' Floor Hardware)",
        goalNameEn: "45 Devtas Floor Hardware Protocols",
        descriptionHi: "फर्श में 4 इंच गहराई, डबल-टेप विकल्प, एंटी-क्लॉकवाइज स्प्रिंग्स एवं विशिष्ट भोग।",
        primaryHouses: [1, 4, 7, 10],
        houseDetails: [],
        specificHardwareRemedy: {
          titleHi: "45 देवता जमीनी विनिर्देश",
          materialsHi: [
            "दालचीनी (नागा देवता - ENE)",
            "सफेद लोहे की स्प्रिंग (वरुण देवता - West)",
            "एल्युमिनियम स्प्रिंग (सोमा देवता - North)",
            "पीतल की पत्ती (पितृ देवता - SW)",
            "साबुत सुपारी (W8 पद - नशा मुक्ति)",
            "तांबे की गोल चकती (सावित्रा - SE)",
          ],
          procedureStepsHi: [
            protocols.excavationStandard.methodHi,
            `नो-ड्रिलिंग विकल्प: ${protocols.noDrillingAlternative.instructionHi}`,
            protocols.springMechanics.boostEnergy,
          ],
          precautionHi: "ऊर्जा बढ़ाने हेतु एंटी-क्लॉकवाइज और ऊर्जा दबाने हेतु क्लॉकवाइज स्प्रिंग का ही चयन करें।",
        },
        shastricVerdictHi:
          "देवताओं की ऊर्जा को 4 इंच जमीन के नीचे या डबल-टेप से फर्श पर स्थापित करने से त्वरित परिणाम मिलते हैं।",
      };
    }

    case "virtual_door_protocol": {
      const vdp = getVirtualDoorProtocol();
      return {
        goalId: "virtual_door_protocol",
        goalNameHi: "वर्चुअल द्वार व एंट्रेंस विभाजन विनिर्देश",
        goalNameEn: "Virtual Door & Dual-Zone Thresholding",
        descriptionHi: "फर्श से 6 फीट की ऊंचाई एवं दोहरे ज़ोन वाले द्वारों का ब्रास स्ट्रिप विभाजन।",
        primaryHouses: [1, 4, 7, 10],
        houseDetails: [],
        specificHardwareRemedy: {
          titleHi: "वर्चुअल डोर एवं प्रवेश द्वार थ्रेशोल्ड प्रोटोकॉल",
          materialsHi: ["ब्रास विभाजक पट्टी (Brass Strip 3.5mm × 12mm)", "वर्चुअल डोर फ्रेम/चिह्न"],
          procedureStepsHi: [
            `स्थापना ऊंचाई: ${vdp.installationHeight}।`,
            `दीवार पर स्थिति: ${vdp.wallPlacement}।`,
            vdp.dualZoneDivisionHi,
          ],
          precautionHi: "सकारात्मक ज़ोन को कभी भी धातु की पट्टी से न काटें; केवल नकारात्मक हिस्से को ब्लॉक करें।",
        },
        shastricVerdictHi:
          "वर्चुअल डोर को फर्श से 6 फीट ऊपर लगाने और नकारात्मक हिस्से को नीचे ब्रास पट्टी से ब्लॉक करने से द्वार दोष समाप्त होता है।",
      };
    }

    case "lagna_mandatory_shield": {
      const shield = evaluateLagnaMandatoryShield(chart);
      const h1 = buildHouseDetail(
        1,
        "प्रथम भाव (लग्न): संपूर्ण शरीर, जीवन शक्ति व मानसिक तेज की सुरक्षा",
        ["चांदी का कलश", "सफेद चंदन"],
        ["काले कपड़े", "अव्यवस्थित जूते"],
        "माथे के मध्य चंदन का सुरक्षा बिंदु।"
      );

      return {
        goalId: "lagna_mandatory_shield",
        goalNameHi: "लग्न सुरक्षा शील्ड (1H Cusp Mandatory Shield)",
        goalNameEn: "Lagna Cusp Mandatory Hit Shield",
        descriptionHi: "लग्न बिंदु पर 180° अथवा 90° के पापी हिट्स का प्राथमिकता-आधारित निवारण।",
        primaryHouses: [1],
        houseDetails: [h1],
        riskAlertHi: shield.shieldBannerHi,
        shastricVerdictHi: shield.shieldBannerHi,
        specificHardwareRemedy: {
          titleHi: "लग्न सुरक्षा शील्ड निर्देश",
          materialsHi: ["120° त्रिकोण सुरक्षा विस्थापन", "सफेद चंदन"],
          procedureStepsHi:
            shield.remediationDirectivesHi.length > 0
              ? shield.remediationDirectivesHi
              : ["लग्न बिंदु पर कोई पापी हिट नहीं है। लग्न ऊर्जा सुरक्षित है।"],
          precautionHi: "लग्न पर 180° या 90° का हिट होने पर दशा का इंतज़ार किए बिना तुरंत सामान हटाएं।",
        },
      };
    }
  }
}

/**
 * Runs evaluation for all 10 specialized goals across the chart.
 */
export function evaluateAllGoalActivations(
  chart: ChartData | null | undefined
): Record<GoalActivationId, GoalActivationResult> {
  const allGoals: GoalActivationId[] = [
    "foreign_travel",
    "property_purchase",
    "property_sale",
    "addiction_relief",
    "high_bp_anger_calm",
    "partnership_risk_audit",
    "coma_critical_vitality",
    "devata_floor_hardware",
    "virtual_door_protocol",
    "lagna_mandatory_shield",
  ];

  const results = {} as Record<GoalActivationId, GoalActivationResult>;
  for (const g of allGoals) {
    results[g] = evaluateGoalHouseActivation(chart, g);
  }
  return results;
}

// ── Transit + Dasha Concurrency Engine (गोचर + दशा समवर्ती फ़िल्टर) ────────

export interface TransitDashaConcurrencyItem {
  planet: string;
  transitSign: string;
  transitSignNum: number;
  directionCode: string;
  directionHi: string;
  isActiveInDasha: boolean;
  dashaRole: "MAHADASHA" | "ANTARDASHA" | "PRATYANTAR" | "NONE";
  triggerSeverity: "HIGH_PHYSICAL_TRIGGER" | "DORMANT_BACKGROUND";
  physicalObjectPullHi: string;
  directionalGuidanceHi: string;
}

export interface TransitDashaConcurrencyAudit {
  activeMahadasha: string;
  activeAntardasha: string;
  activeTriggersCount: number;
  summaryHi: string;
  items: TransitDashaConcurrencyItem[];
}

// Canonical transits (Epoch 2026-2027)
const CANONICAL_TRANSIT_POSITIONS: { planet: string; signNum: number; sign: string }[] = [
  { planet: "Saturn", signNum: 12, sign: "Pisces" }, // मीन (पैर, SE दिशा)
  { planet: "Jupiter", signNum: 3, sign: "Gemini" },  // मिथुन (NNW दिशा)
  { planet: "Rahu", signNum: 11, sign: "Aquarius" },  // कुंभ (W दिशा)
  { planet: "Ketu", signNum: 5, sign: "Leo" },        // सिंह (ENE दिशा)
  { planet: "Mars", signNum: 4, sign: "Cancer" },     // कर्क (NNE दिशा)
  { planet: "Sun", signNum: 7, sign: "Libra" },       // तुला (WSW दिशा)
  { planet: "Mercury", signNum: 7, sign: "Libra" },   // तुला (WSW दिशा)
  { planet: "Venus", signNum: 8, sign: "Scorpio" },   // वृश्चिक (SSW दिशा)
];

const PLANET_OBJECT_PULL_MAP: Record<string, string> = {
  Saturn: "जूते-चप्पल, चमड़े का सामान, लोहे के भारी औजार, पुराने संदूक अथवा नौकरों का कमरा",
  Jupiter: "धार्मिक पुस्तकें, दादाजी/गुरु की तस्वीर, पूजा सामग्री, सोने के आभूषण अथवा पीले वस्त्र",
  Rahu: "खराब बंद पड़े इलेक्ट्रॉनिक्स, पुराने उलझे तार, कबाड़, जंग लगे औजार अथवा धुएं का स्रोत",
  Ketu: "केले का पौधा, ध्यान मुद्रा की प्रतिमाएं, सिलाई मशीन, धागे अथवा अध्यात्म की वस्तुएं",
  Mars: "रसोई के गैस बर्नर, चाकू, कैंची, तांबे के बर्तन, लाल वस्त्र अथवा अग्नि का स्रोत",
  Sun: "तांबे का कलश, माणिक्य, सरकारी दस्तावेज़, पिता का सामान अथवा खुला प्रकाश",
  Mercury: "हरे पौधे, अध्ययन की पुस्तकें, स्टेशनरी, पेन, बच्चों के खिलौने अथवा संचार उपकरण",
  Venus: "इत्र (Perfume), सौंदर्य प्रसाधन, आभूषण, सजावटी कांच, रेशमी वस्त्र अथवा संगीत वाद्य",
};

/**
 * Implements Transit + Dasha Concurrency Filter:
 * A transiting planet manifests its physical impact or pulls material objects into that directional zone
 * ONLY when that planet is concurrently activated in the native's active Mahadasha (MD) or Antardasha (AD).
 */
export function evaluateTransitDashaConcurrency(
  chart: ChartData | null | undefined,
  evaluationDate: Date = new Date()
): TransitDashaConcurrencyAudit {
  if (!chart) {
    return {
      activeMahadasha: "Unknown",
      activeAntardasha: "Unknown",
      activeTriggersCount: 0,
      summaryHi: "चार्ट डेटा अनुपलब्ध है।",
      items: [],
    };
  }

  const now = evaluationDate.getTime();
  const activeMDEntry = chart.dashas?.find(
    (d) => new Date(d.start).getTime() <= now && now <= new Date(d.end).getTime()
  ) || chart.dashas?.[0];
  const activeMD = activeMDEntry?.planet || "Rahu";

  const activeADEntry = chart.antardasha?.find(
    (d) => new Date(d.start).getTime() <= now && now <= new Date(d.end).getTime()
  ) || chart.antardasha?.[0];
  const activeAD = activeADEntry?.planet || "Jupiter";

  const items: TransitDashaConcurrencyItem[] = [];
  let activeTriggersCount = 0;

  for (const pos of CANONICAL_TRANSIT_POSITIONS) {
    const isMD = pos.planet.toLowerCase() === activeMD.toLowerCase();
    const isAD = pos.planet.toLowerCase() === activeAD.toLowerCase();
    const isActive = isMD || isAD;

    let dashaRole: TransitDashaConcurrencyItem["dashaRole"] = "NONE";
    if (isMD) dashaRole = "MAHADASHA";
    else if (isAD) dashaRole = "ANTARDASHA";

    const dirData = ASTRO_VASTU_SIGN_DIRECTIONS[pos.signNum];
    const objectPull = PLANET_OBJECT_PULL_MAP[pos.planet] || "संबंधित ग्रह की कारक वस्तुएं";

    let triggerSeverity: TransitDashaConcurrencyItem["triggerSeverity"] = "DORMANT_BACKGROUND";
    let directionalGuidanceHi = "";

    if (isActive) {
      activeTriggersCount++;
      triggerSeverity = "HIGH_PHYSICAL_TRIGGER";
      directionalGuidanceHi = `🚨 गोचर-दशा सक्रिय ट्रिगर: ${pos.planet} आपकी ${dashaRole === "MAHADASHA" ? "महादशा" : "अंतर्दशा"} में पूर्णतः सक्रिय है। यह गोचर ${dirData.directionHindi} (${dirData.code}) दिशा में अपनी वस्तुओं (${objectPull}) को तीव्र गति से आकर्षित करेगा। इस ज़ोन को तुरंत संतुलित व व्यवस्थित करें।`;
    } else {
      triggerSeverity = "DORMANT_BACKGROUND";
      directionalGuidanceHi = `ℹ️ सुप्त गोचर: ${pos.planet} वर्तमान दशा में सक्रिय न होने से ${dirData.directionHindi} (${dirData.code}) दिशा में कोई आकस्मिक संकट पैदा नहीं करेगा।`;
    }

    items.push({
      planet: pos.planet,
      transitSign: pos.sign,
      transitSignNum: pos.signNum,
      directionCode: dirData.code,
      directionHi: dirData.directionHindi,
      isActiveInDasha: isActive,
      dashaRole,
      triggerSeverity,
      physicalObjectPullHi: objectPull,
      directionalGuidanceHi,
    });
  }

  const summaryHi =
    activeTriggersCount > 0
      ? `वर्तमान में ${activeTriggersCount} ग्रह (${items.filter((i) => i.isActiveInDasha).map((i) => `${i.planet} in ${i.directionCode}`).join(", ")}) दशा-गोचर समवर्ती नियम के अंतर्गत भौतिक वस्तुएं आकर्षित कर रहे हैं।`
      : "वर्तमान गोचरों में कोई भी ग्रह सक्रिय महादशा/अंतर्दशा से सीधे टकराकर भौतिक दोष उत्पन्न नहीं कर रहा है।";

  return {
    activeMahadasha: activeMD,
    activeAntardasha: activeAD,
    activeTriggersCount,
    summaryHi,
    items,
  };
}

// ── Master Lecture Case Studies Bank (प्रामाणिक व्याख्यान केस स्टडीज) ────────

export interface LectureCaseStudy {
  id: string;
  nativeName: string;
  queryCategoryHi: string;
  problemStatementHi: string;
  astrologicalMechanismHi: string;
  hitGeometry: {
    planetOrCusp1: string;
    planetOrCusp2: string;
    compoundDegDiff: string;
    angleType: string;
    nature: string;
  };
  physicalVastuFaultHi: string;
  shastricRemedyHi: string;
  resultOutcomeHi: string;
}

export const MASTER_LECTURE_CASE_STUDIES: LectureCaseStudy[] = [
  {
    id: "case_chirag",
    nativeName: "चिराग (शेयर बाज़ार नुकसान)",
    queryCategoryHi: "शेयर बाज़ार, ट्रेडिंग व वित्तीय हानि",
    problemStatementHi: "शेयर ट्रेडिंग में लगातार भारी नुकसान हो रहा था और पूंजी तेजी से घट रही थी।",
    astrologicalMechanismHi:
      "NNW (मिथुन राशि) में बैठा बृहस्पति 18° पर बुध को 180° का किलर प्रहार दे रहा था। बुध ट्रेडिंग/व्यापार का कारक है।",
    hitGeometry: {
      planetOrCusp1: "बृहस्पति (NNW 78°)",
      planetOrCusp2: "बुध (कस्प/ग्रह 258°)",
      compoundDegDiff: "180.0°",
      angleType: "180° किलर हिट",
      nature: "CRITICAL_KILLER",
    },
    physicalVastuFaultHi:
      "जातक के घर की NNW दिशा में दादाजी की तस्वीर, मंदिर और धार्मिक पुस्तकें रखी हुई थीं (बृहस्पति का सामान बुध के ज़ोन में)।",
    shastricRemedyHi:
      "धार्मिक पुस्तकों और दादाजी के चित्र को NNW से हटाकर ENE (सिंह राशि ज़ोन) में स्थानांतरित किया गया, जिससे बुध पर 120° का सुरक्षात्मक त्रिकोण बना।",
    resultOutcomeHi:
      "शेयर बाज़ार का भारी नुकसान तुरंत रुक गया और ट्रेडिंग में लाभ व स्थिरता पुनः स्थापित हुई।",
  },
  {
    id: "case_manjula",
    nativeName: "मंजुला (प्रॉपर्टी विवाद व कोर्ट लिटिगेशन)",
    queryCategoryHi: "अचल संपत्ति, ज़मीन विवाद व कोर्ट-कचहरी",
    problemStatementHi: "प्लॉट/ज़मीन को लेकर न्यायालय में वर्षों से मुकदमा चल रहा था और विरोधी पक्ष दबाव बना रहा था।",
    astrologicalMechanismHi:
      "धनु लग्न में 12वें भाव में वृश्चिक 25° (235°) पर बैठा राहु, 6ठे भाव (कोर्ट/विवाद) के कस्प वृषभ 29° (59°) पर ठीक 176° का प्रहार कर रहा था।",
    hitGeometry: {
      planetOrCusp1: "राहु (Scorpio 235°)",
      planetOrCusp2: "6ठा भाव कस्प (Taurus 59°)",
      compoundDegDiff: "176.0° [172°-188° रेंज]",
      angleType: "180° किलर कस्प हिट",
      nature: "CRITICAL_KILLER",
    },
    physicalVastuFaultHi:
      "घर के SSW/SW ज़ोन में पुराने खराब इलेक्ट्रॉनिक सामान, टूटे तार और जंग लगे लोहे का कबाड़ रखा हुआ था।",
    shastricRemedyHi:
      "1) SSW/SW से सारा इलेक्ट्रॉनिक कबाड़ तुरंत हटाया गया; 2) WSW (तुला राशि = 11वां लाभ भाव) में मेटैलिक विंड चाइम लगाई गई।",
    resultOutcomeHi:
      "कोर्ट में फैसला जातक के पक्ष में आया और प्रॉपर्टी विवाद सौहार्दपूर्ण ढंग से सुलझ गया।",
  },
  {
    id: "case_shashi",
    nativeName: "शशी (भाई-बहनों से विवाद व अनुबंध धोखा)",
    queryCategoryHi: "तृतीय भाव, भ्रातृ संबंध व दस्तावेजी धोखाधड़ी",
    problemStatementHi: "छोटे भाई से घोर विवाद और व्यापारिक समझौतों में निरंतर धोखा मिल रहा था।",
    astrologicalMechanismHi:
      "कन्या 22° (172°) में बैठे राहु का मिथुन 18° (78°) में बैठे मंगल पर 94° का प्रहार था, जो [85°-95°] की डेंजर रेंज में था।",
    hitGeometry: {
      planetOrCusp1: "राहु (Virgo 172°)",
      planetOrCusp2: "मंगल (Gemini 78°)",
      compoundDegDiff: "94.0° [85°-95° रेंज]",
      angleType: "90° डेंजर हिट",
      nature: "HIGH_DANGER",
    },
    physicalVastuFaultHi:
      "घर की पूर्व (मेष राशि) दिशा में लाल रंग की धारदार कैंचियां, चाकू और नुकीले औजार रखे हुए थे।",
    shastricRemedyHi:
      "पूर्व दिशा से सभी नुकीली वस्तुएं हटाई गईं और शिवलिंग पर नित्य शुद्ध सफेद चंदन लेप करने का नियम दिया गया।",
    resultOutcomeHi:
      "भाई-बहनों के बीच कटुता शांत हुई और कानूनी अनुबंधों में सुरक्षा प्राप्त हुई।",
  },
  {
    id: "case_atul_wife",
    nativeName: "अतुल की पत्नी (पुरानी बीमारी, पीड़ा व पिता-भाग्य कष्ट)",
    queryCategoryHi: "8वां भाव/रोग व रिवर्स GPS काउंटिंग",
    problemStatementHi: "लंबे समय से अज्ञात शारीरिक पीड़ा, अवसाद और दवाइयों का असर न होना।",
    astrologicalMechanismHi:
      "8वें भाव का स्वामी शनि 6ठे भाव में बैठा था। शनि का GPS कोड 7 होने से 7 कदम पीछे गिनने पर 9वां भाव (पिता/प्रारब्ध) कष्ट का मूल उद्गम निकला।",
    hitGeometry: {
      planetOrCusp1: "शनि (8वें का स्वामी 6ठे भाव में)",
      planetOrCusp2: "रिवर्स GPS काइनेमैटिक्स",
      compoundDegDiff: "7 भाव पश्चात्",
      angleType: "GPS रिवर्स काइनेमैटिक लिंक",
      nature: "ROOT_CAUSE_LINK",
    },
    physicalVastuFaultHi:
      "दक्षिण (मकर राशि = 10वां भाव ज़ोन) में टॉयलेट एवं गंभीर गंदगी मौजूद थी, जिससे शनि दूषित हो रहा था।",
    shastricRemedyHi:
      "1) दक्षिण ज़ोन को स्वच्छ किया गया; 2) गुरुद्वारे में जाकर निष्काम भाव से 'जूता सेवा' तथा 8वें भाव के लिए 8 साबुत फल दान किए गए।",
    resultOutcomeHi:
      "गंभीर स्वास्थ्य पीड़ा से मुक्ति मिली और दवाइयां सकारात्मक परिणाम देने लगीं।",
  },
  {
    id: "case_parul",
    nativeName: "पारुल (अस्त ग्रह — सूर्य-गुरु कंबशन हिट)",
    queryCategoryHi: "अस्त ग्रह (Combust Planets) व संरचनात्मक प्रहार",
    problemStatementHi: "क्या सूर्य के निकट 1°-2° पर अस्त हुआ ग्रह 180° का पापी हिट उत्पन्न करता है?",
    astrologicalMechanismHi:
      "अस्त अथवा वक्री ग्रह का 180° हिट संरचनात्मक रूप से मौजूद रहता है; उसका प्रकटीकरण थोड़ा धीमा होता है किंतु भीतर से ऊर्जा जलाता है।",
    hitGeometry: {
      planetOrCusp1: "सूर्य (Leo/Virgo)",
      planetOrCusp2: "बृहस्पति (1°-2° कंबशन)",
      compoundDegDiff: "1.5° कंबशन",
      angleType: "Combustion + 180° Axis",
      nature: "STRUCTURAL_FRICTION",
    },
    physicalVastuFaultHi:
      "अग्नि तत्व के समीप गुरु की वस्तुओं (धार्मिक पुस्तकें, सोने के आभूषण) का जलना या अत्यधिक गर्म स्थान पर होना।",
    shastricRemedyHi:
      "गुरु की वस्तुओं को अग्नि के प्रभाव से दूर कर 120° के शीतल सुरक्षात्मक त्रिकोण ज़ोन में स्थापित करना।",
    resultOutcomeHi:
      "अस्त ग्रह की ऊर्जा शीतल हुई और जीवन में अवरुद्ध ज्ञान व धन के अवसर खुले।",
  },
  {
    id: "case_deepak",
    nativeName: "दीपक (द्वादश चंद्रमा — स्वैच्छिक दान नियम)",
    queryCategoryHi: "12वां भाव व अनियंत्रित व्यय/हानि निवारण",
    problemStatementHi: "अस्पताल, कोर्ट-कचहरी अथवा सरकारी दंड में अचानक भारी धन की बर्बादी होना।",
    astrologicalMechanismHi:
      "12वें भाव का ग्रह जब भी दशा या गोचर में सक्रिय होता है, वह जातक से अनिवार्य व्यय करवाता है।",
    hitGeometry: {
      planetOrCusp1: "चंद्रमा (12वां भाव)",
      planetOrCusp2: "व्यय भाव संचरण",
      compoundDegDiff: "12H Axis",
      angleType: "12th House Expenditure Trigger",
      nature: "LOSS_TRIGGER",
    },
    physicalVastuFaultHi:
      "उत्तर-पश्चिम (वायव्य/Taurus) दिशा में गंदा जल जमा होना या दवाओं का बिखराव।",
    shastricRemedyHi:
      "12वें भाव के ग्रह से संबंधित वस्तु का 'स्वैच्छिक गुप्त दान (Voluntary Tithe)' करना ताकि ऋणात्मक व्यय शुभ धर्मार्थ व्यय में रूपांतरित हो जाए।",
    resultOutcomeHi:
      "अचानक होने वाले अस्पताल व कोर्ट के भारी खर्चे शून्य हो गए।",
  },
  {
    id: "case_aarti",
    nativeName: "आरती (वर्चुअल द्वार 6 फीट नियम व दोहरे ज़ोन विभाजन)",
    queryCategoryHi: "मुख्य प्रवेश द्वार व वास्तु थ्रेशोल्ड विभाजन",
    problemStatementHi: "यदि मुख्य प्रवेश द्वार एक सकारात्मक और एक नकारात्मक दो ज़ोन्स में आ रहा हो तो क्या करें?",
    astrologicalMechanismHi:
      "प्रवेश द्वार की ऊर्जा नकारात्मक पद से घर में प्रवेश कर शुभ पद की ऊर्जा को भी दूषित कर देती है।",
    hitGeometry: {
      planetOrCusp1: "नकारात्मक पद (Negative Pad)",
      planetOrCusp2: "सकारात्मक पद (Positive Pad)",
      compoundDegDiff: "Dual Grid Junction",
      angleType: "Pad Energy Splitting",
      nature: "THRESHOLD_SPLIT",
    },
    physicalVastuFaultHi:
      "पूरा दरवाजा एक साथ खुला रहने से नकारात्मक पद की ऊर्जा अनियंत्रित होकर घर में घुस रही थी।",
    shastricRemedyHi:
      "1) नकारात्मक पद के नीचे फर्श पर 3.5mm × 12mm ब्रास स्ट्रिप लगाकर उसे ब्लॉक किया गया; 2) वर्चुअल डोर मार्कर फर्श से ठीक 6 फीट ऊपर लगाया गया।",
    resultOutcomeHi:
      "नकारात्मक ऊर्जा का प्रवेश रुक गया और शुभ पद की ऊर्जा घर में प्रवाहित होने लगी।",
  },
  {
    id: "case_jachika",
    nativeName: "याचिका (रिसोर्ट पार्टनरशिप ट्रैप — 7वें का स्वामी 5वें में)",
    queryCategoryHi: "व्यापार, साझीदारी व करोड़ों का निवेश ट्रैप",
    problemStatementHi: "क्या करोड़ों के बड़े रिसोर्ट प्रोजेक्ट में पार्टनरशिप में निवेश करना सुरक्षित रहेगा?",
    astrologicalMechanismHi:
      "सप्तमेश केतु के साथ 5वें भाव में बैठा था। 5वां भाव सप्तम से 11वां (पार्टनर का लाभ) है और जातक के 6ठे भाव का 12वां (जातक के लाभ की निगेशन) है।",
    hitGeometry: {
      planetOrCusp1: "सप्तमेश (7th Lord)",
      planetOrCusp2: "पंचम भाव (केतु युति)",
      compoundDegDiff: "11 भाव आगे (सप्तम से)",
      angleType: "Partner Monopoly Axis",
      nature: "CRITICAL_PARTNERSHIP_TRAP",
    },
    physicalVastuFaultHi:
      "साझेदारी में व्यापारिक स्थल की उत्तर-पूर्व एवं दक्षिण-पश्चिम दिशाओं का असंतुलन।",
    shastricRemedyHi:
      "सख्त निषेध — पार्टनरशिप में निवेश तुरंत रद्द करने का निर्देश दिया गया। पत्नी के नाम से भी ऐसा निवेश न करने का परामर्श दिया गया क्योंकि पत्नी भी सप्तम भाव ही है।",
    resultOutcomeHi:
      "करोड़ों की भारी ठगी और दिवालियापन से जातक की गाढ़ी कमाई सुरक्षित बच गई।",
  },
];
