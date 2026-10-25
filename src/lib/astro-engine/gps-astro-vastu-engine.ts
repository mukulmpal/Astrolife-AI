// src/lib/astro-engine/gps-astro-vastu-engine.ts
// ============================================================================
// ASTRO-VASTU GPS ASTROLOGY (जीपीएस एस्ट्रोलॉजी) COMPUTATIONAL ENGINE
// ============================================================================
// Breakthrough directional navigation technology codified directly from
// classical Astro-Vastu teachings:
// 1. 9 Planetary GPS Codes (Sun: 10, Moon: 4, Mars: 10, Mercury: 1, Jupiter: 1,
//    Venus: 4, Saturn: 7, Rahu: 7 [Shanivat Rahu], Ketu: 10 [Kujavat Ketu]).
// 2. 4-Second Reverse-Counting Algorithm:
//    Target House = (((Placed House - GPS Code + 120) % 12) + 1)
// 3. Ketu Cut-Zone (कटा हुआ ज़ोन) Auto-Detection with 24-hr Yellow Bulb & Roof Flag.
// 4. Rahu Extended-Zone (बढ़ा हुआ ज़ोन) Auto-Detection with grounding balance.
// 5. Negative House Utilization Formulas (8th: Astrology, 12th: Meditation/Milk, 6th: Free Seva).
// 6. Direct Karaka Balancing (Roaring Lion for Sun/Courage in South, Branded Perfume for North, etc.)
// 0% Hardcoded · 100% Chart-Driven across all 12 Lagnas.
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import {
  ASTRO_VASTU_SIGN_DIRECTIONS,
  RASHIS_ORDER,
  RASHIS_HINDI,
  PLANETS_HINDI,
  getSignNumber,
  type AstroVastuDirection,
} from "./astro-vastu-types";

// ── Types & Contracts ───────────────────────────────────────────────────────

export type GPSPlanetaryCode = 1 | 4 | 7 | 10;

export interface GPSCodeDefinition {
  planet: string;
  hindiName: string;
  code: GPSPlanetaryCode;
  shastricBasis: string;
  description: string;
}

export interface QueryHouseGPSAnalysis {
  queryHouse: number;
  queryTheme: string;
  queryThemeHindi: string;
  houseSign: string;
  houseSignNum: number;
  houseLord: string;
  houseLordHindi: string;
  placedHouse: number;
  placedSign: string;
  placedSignNum: number;
  gpsCode: GPSPlanetaryCode;
  targetHouse: number;
  targetSign: string;
  targetSignNum: number;
  targetDirection: string;
  targetDirectionHindi: string;
  targetDirectionCode: string;
  clutterToInspect: string[];
  actionRequired: string;
  shastricMechanism: string;
  activatingRemedy: string;
  utilizationProtocol?: string;
}

export interface KetuCutZoneReport {
  ketuHouse: number;
  ketuSignNum: number;
  ketuSignName: string;
  cutDirection: string;
  cutDirectionHindi: string;
  cutDirectionCode: string;
  defectDescription: string;
  correctiveRemedies: {
    yellowBulb24Hr: string;
    roofCornerFlag: string;
    cleanlinessProtocol: string;
  };
}

export interface RahuExtendedZoneReport {
  rahuHouse: number;
  rahuSignNum: number;
  rahuSignName: string;
  extendedDirection: string;
  extendedDirectionHindi: string;
  extendedDirectionCode: string;
  defectDescription: string;
  correctiveRemedies: {
    groundingCure: string;
    electricalNeutralization: string;
  };
}

export interface HouseUtilizationAdvice {
  houseNumber: number;
  houseTheme: string;
  connectedPlanet: string;
  philosophicalConcept: string;
  practicalAction: string;
}

export interface GPSAstroVastuDossier {
  nativeName: string;
  lagnaSign: string;
  lagnaSignHindi: string;
  lagnaSignNum: number;
  masterGPSCodeTable: Record<string, GPSCodeDefinition>;
  queryAnalyses: Record<number, QueryHouseGPSAnalysis>;
  ketuCutZone: KetuCutZoneReport;
  rahuExtendedZone: RahuExtendedZoneReport;
  houseUtilizationAdvices: HouseUtilizationAdvice[];
  shastricPricingPhilosophy: {
    title: string;
    coreRule: string;
    guideline: string;
  };
}

// ── Master Planetary GPS Code Registry ─────────────────────────────────────

export const MASTER_GPS_CODES: Record<string, GPSCodeDefinition> = {
  Sun: {
    planet: "Sun",
    hindiName: "सूर्य (Sun)",
    code: 10,
    shastricBasis: "दशम भाव (दिग्बल, सत्ता, राजा, प्रतिष्ठा)",
    description: "सूर्य का जीपीएस कोड 10 है। यह मान-सम्मान, आत्मबल और शासन की दिशा निर्धारित करता है।"
  },
  Moon: {
    planet: "Moon",
    hindiName: "चंद्र (Moon)",
    code: 4,
    shastricBasis: "चतुर्थ भाव (मन, शांति, जल, माता)",
    description: "चंद्र का जीपीएस कोड 4 है। यह मानसिक शांति, तरलता और घरेलू सुख की दिशा तक पहुंचाता है।"
  },
  Mars: {
    planet: "Mars",
    hindiName: "मंगल (Mars)",
    code: 10,
    shastricBasis: "दशम भाव (पराक्रम, ऊर्जा, उच्च स्थान)",
    description: "मंगल का जीपीएस कोड 10 है। यह पराक्रम, अग्नि, रसोई और निर्माण की दिशा दिखाता है।"
  },
  Mercury: {
    planet: "Mercury",
    hindiName: "बुध (Mercury)",
    code: 1,
    shastricBasis: "प्रथम भाव (बुद्धि, स्व, जहां बैठा वहीं रहेगा)",
    description: "बुध का जीपीएस कोड 1 है। यह बुद्धि, वाणी, व्यवसाय और कागजात का सूचक है; यह अपने ही स्थान पर सक्रिय रहता है।"
  },
  Jupiter: {
    planet: "Jupiter",
    hindiName: "गुरु (Jupiter)",
    code: 1,
    shastricBasis: "प्रथम भाव (ज्ञान, देवकृपा, जहां बैठा वहीं रहेगा)",
    description: "गुरु का जीपीएस कोड 1 है। यह ज्ञान, गुरु-आशीर्वाद और धर्म का कारक है; यह अपने स्थान से ही फलित होता है।"
  },
  Venus: {
    planet: "Venus",
    hindiName: "शुक्र (Venus)",
    code: 4,
    shastricBasis: "चतुर्थ भाव (वाहन, विलास, सुख, आकर्षण)",
    description: "शुक्र का जीपीएस कोड 4 है। यह आकर्षण, सौंदर्य, दांपत्य और विलासिता का मार्ग प्रशस्त करता है।"
  },
  Saturn: {
    planet: "Saturn",
    hindiName: "शनि (Saturn)",
    code: 7,
    shastricBasis: "सप्तम भाव (दिग्बल, पश्चिम दिशा, कर्म फल)",
    description: "शनि का जीपीएस कोड 7 है। यह कर्म, अनुशासन, स्थिरता और जनता से जुड़े मामलों को नियंत्रित करता है।"
  },
  Rahu: {
    planet: "Rahu",
    hindiName: "राहु (Rahu)",
    code: 7,
    shastricBasis: "शनिवत राहु (शनि की तरह कोड 7)",
    description: "राहु शनि की तरह व्यवहार करता है ('शनिवत राहु')। इसका जीपीएस कोड 7 है और यह आकस्मिक विस्तार का द्योतक है।"
  },
  Ketu: {
    planet: "Ketu",
    hindiName: "केतु (Ketu)",
    code: 10,
    shastricBasis: "कुजवत केतु (मंगल की तरह कोड 10)",
    description: "केतु मंगल की तरह व्यवहार करता है ('कुजवत केतु')। इसका जीपीएस कोड 10 है और यह अध्यात्म व मोक्ष का कारक है।"
  }
};

// ── Classical Sign Lords ────────────────────────────────────────────────────

export const SIGN_LORDS: Record<number, string> = {
  1: "Mars",      // Aries
  2: "Venus",     // Taurus
  3: "Mercury",   // Gemini
  4: "Moon",      // Cancer
  5: "Sun",       // Leo
  6: "Mercury",   // Virgo
  7: "Venus",     // Libra
  8: "Mars",      // Scorpio
  9: "Jupiter",   // Sagittarius
  10: "Saturn",   // Capricorn
  11: "Saturn",   // Aquarius
  12: "Jupiter",  // Pisces
};

// ── 12 Signs Master Clutter & Anti-Element Matrix ────────────────────────────

export const SIGN_CLUTTER_MATRIX: Record<number, { element: string; antiElements: string[]; clutterItems: string[] }> = {
  1: {
    element: "अग्नि तत्व (Fire - East)",
    antiElements: ["जल तत्व", "नीला/काला रंग", "सीलन"],
    clutterItems: ["गंदा रुका हुआ पानी", "नीला/काला पुराना कपड़ा", "टूटा हुआ फर्नीचर", "एंटी-वाटर तत्व"]
  },
  2: {
    element: "पृथ्वी/वायु तत्व (North-West)",
    antiElements: ["भारी कबाड़", "अग्नि तत्व", "कटे-फटे कागज"],
    clutterItems: ["गंदे बिना धुले बर्तन", "भारी कबाड़", "पुराने कटे-फटे व्यर्थ कागजात", "खराब प्रसाधन सामग्री"]
  },
  3: {
    element: "वायु/बुद्धि तत्व (North-East)",
    antiElements: ["भारी वजन", "अंधेरा", "कबाड़"],
    clutterItems: ["अव्यवस्थित रद्दी किताबें", "खराब इलेक्ट्रॉनिक्स/पेन", "टूटी घड़ियां", "अव्यवस्था"]
  },
  4: {
    element: "जल तत्व (Water - North)",
    antiElements: ["अग्नि", "चूल्हा", "लाल/पीला रंग"],
    clutterItems: ["गंदा पानी", "बंद नल/सीपेज", "लाल वस्तुएं/हीटर/अग्नि", "सूखा कचरा"]
  },
  5: {
    element: "अग्नि/सूर्य तत्व (East-North-East)",
    antiElements: ["अंधेरा", "नीला/काला रंग", "कचरा"],
    clutterItems: ["अंधेरा व सीलन", "नीले/काले पर्दे या डिब्बे", "कबाड़ व धूल-मिट्टी", "बंद इलेक्ट्रॉनिक गैजेट्स"]
  },
  6: {
    element: "पृथ्वी/जल संधि (North - Kuber Zone)",
    antiElements: ["रसोई की अग्नि", "लाल रंग", "कूड़ा"],
    clutterItems: ["रसोई की अग्नि/चूल्हा (जल में अग्नि)", "लाल रंग की वस्तुएं", "कूड़ेदान (Dustbin)", "अव्यवस्था"]
  },
  7: {
    element: "वायु/आकाश तत्व (West-South-West - Vidya Zone)",
    antiElements: ["लोहे का भारी कबाड़", "जंग", "अग्नि"],
    clutterItems: ["वर्कशॉप का भारी औजार", "लोहे का सामान", "जंग लगा पुराना लोहा", "अव्यवस्थित फाइलें"]
  },
  8: {
    element: "जल/अग्नि संधि (South-South-West - Disposal Zone)",
    antiElements: ["पवित्र ग्रंथ", "तिजोरी", "अध्ययन सामग्री"],
    clutterItems: ["शौचालय में रखी किताबें", "दवाइयों का ढेर", "डस्टबिन में पेन/कागज", "टूटे औजार"]
  },
  9: {
    element: "अग्नि/विचार तत्व (East-South-East)",
    antiElements: ["जूते-चप्पल", "गंदा जल", "कबाड़"],
    clutterItems: ["जूते-चप्पल/डस्टबिन", "धार्मिक वस्तुओं का अनादर", "सीलन", "एंटी-कलर वस्तुएं"]
  },
  10: {
    element: "पृथ्वी/शनि तत्व (South - Yama Zone)",
    antiElements: ["जल", "नीला रंग", "शीशा"],
    clutterItems: ["जंग लगा पुराना लोहा", "कबाड़/टूटा सामान", "काले पुराने जूते/कपड़े", "टूटी मशीनें"]
  },
  11: {
    element: "वायु/आकाश तत्व (West - Labha Zone)",
    antiElements: ["अग्नि", "हरा रंग", "रुका हुआ जल"],
    clutterItems: ["रुका हुआ गंदा पानी", "पुराना अनुपयोगी कबाड़", "टूटे हुए शीशे/फ्रेम", "अवरोधक वस्तुएं"]
  },
  12: {
    element: "जल/आकाश तत्व (North-East - Ishan Zone)",
    antiElements: ["शौचालय", "भारी वजन", "चमड़ा", "अग्नि"],
    clutterItems: ["भारी जूते-चप्पल", "शौचालय/गंदगी", "चमड़े का सामान", "अग्नि/हीटर/लाल रंग"]
  }
};

// ── 9 Planetary Karaka Activation Items ─────────────────────────────────────

export const PLANET_KARAKA_ACTIVATION_ITEMS: Record<string, string> = {
  Sun: "दहाड़ते हुए शेर (Roaring Lion) अथवा तेजस्वी उगते सूर्य का चित्र लगाएं, जो आत्मबल व मान-प्रतिष्ठा में वृद्धि करे।",
  Moon: "शुद्ध जल का बहता झरना (Water Fountain) लगाएं अथवा चांदी का चौकोर सिक्का / शांति कलश स्थापित करें।",
  Mars: "तांबे का पिरामिड या मंगल यंत्र स्थापित करें अथवा लाल रंग का प्रेरक प्रतीक रखें।",
  Mercury: "हरा तुलसी का पौधा लगाएं, श्रीयंत्र स्थापित करें या पारदर्शी कांच की बोतल में जल रखें।",
  Jupiter: "आदरणीय गुरुजी/ईष्टदेव का चित्र, पवित्र धार्मिक ग्रंथ अथवा पीतल की घंटी स्थापित करें।",
  Venus: "एक छोटी कांच की शीशी में प्रीमियम ब्रांडेड परफ्यूम रखें अथवा सफेद चंदन/चांदी की वस्तु स्थापित करें।",
  Saturn: "नीला एंटी-क्लॉकवाइज स्प्रिंग लगाएं अथवा लोहे का शनि छल्ला/लेड पिरामिड स्थापित करें।",
  Rahu: "कच्ची चांदी का चौकोर टुकड़ा अथवा 5 रॉड्स वाली मेटल विंड चाइम लगाएं।",
  Ketu: "24 घंटे जलने वाला पीला बल्ब लगाएं अथवा त्रिकोणीय केसरिया/पीला धर्म ध्वज स्थापित करें।"
};

// ── 12 Query Houses Themes ──────────────────────────────────────────────────

export const QUERY_HOUSE_THEMES: Record<number, { en: string; hi: string }> = {
  1: { en: "Self, Brain, Health, Courage & Freedom from Fear", hi: "स्वास्थ्य, मस्तिष्क, आत्मबल एवं भय/घबराहट से मुक्ति" },
  2: { en: "Wealth, Liquid Cash, Inflow & Family Harmony", hi: "धन संचय, तरल पूंजी, नकद आमदनी एवं पारिवारिक समृद्धि" },
  3: { en: "Online Presence, Communication, Efforts & Media", hi: "ऑनलाइन कार्य, इंटरनेट, संवाद क्षमता व सामाजिक प्रभाव" },
  4: { en: "Peace of Mind, Domestic Bliss & Emotional Balance", hi: "मन की शांति, गृहस्थ सुख एवं मानसिक स्थिरता" },
  5: { en: "Children, Education, Intellect & Breakthroughs", hi: "संतान सुख, उच्च शिक्षा, बुद्धि व अचानक सफलता" },
  6: { en: "Daily Service, Overcoming Disease & Competitive Edge", hi: "दैनिक सेवा (सेवा भाव), रोग/ऋण निवारण व विजय" },
  7: { en: "Profession, Daily Business, Inflow & Partnerships", hi: "व्यापार, प्रोफेशन, दैनिक ग्राहक एवं आजीविका" },
  8: { en: "Overcoming Chronic Pain (Peeda), Research & Occult", hi: "कष्ट/पीड़ा का अंत, शोध एवं ज्योतिष/गुप्त ज्ञान" },
  9: { en: "Higher Fortune, Teaching, Dharma & Guru Blessings", hi: "भाग्य वृद्धि, शिक्षण कार्य, धर्म एवं गुरु कृपा" },
  10: { en: "Name & Fame, Career Status & Royal Authority", hi: "मान-सम्मान, उच्च पद, कीर्ति एवं सामाजिक प्रतिष्ठा" },
  11: { en: "Gains, Expansion, Network Circle & Desires", hi: "प्रचुर लाभ, बड़े संपर्क एवं अभीष्ट इच्छाओं की पूर्ति" },
  12: { en: "Foreign Opportunities, Meditation & Waste Control", hi: "विदेश योग, ध्यान/साधना एवं व्यर्थ खर्चों पर रोक" }
};

// ── Core Mathematical Algorithm ─────────────────────────────────────────────

/**
 * Calculates the target house using the authentic GPS reverse-counting formula:
 * If GPS code is 1: Planet stays in its placed house.
 * If GPS code is 4, 7, 10: Count backwards (reverse) by GPS code steps.
 * Formula: ((PlacedHouse - GPSCode + 120) % 12) + 1
 */
export function calculateGPSTargetHouse(placedHouse: number, gpsCode: GPSPlanetaryCode): number {
  return (((placedHouse - gpsCode + 120) % 12) + 1);
}

// ── Master GPS Engine Function ──────────────────────────────────────────────

export function runGPSAstroVastuEngine(chart: ChartData | null | undefined): GPSAstroVastuDossier | null {
  if (!chart || !chart.planets) return null;

  // 1. Resolve Native Lagna
  const resolveLagnaSignNum = (): number => {
    if (typeof chart.lagnaRashi === "string" && chart.lagnaRashi.trim()) {
      return getSignNumber(chart.lagnaRashi.trim());
    }
    if (typeof (chart as any).ascendant?.sign === "string") {
      return getSignNumber((chart as any).ascendant.sign);
    }
    if (typeof chart.lagnaLon === "number") {
      const idx = Math.floor((((chart.lagnaLon % 360) + 360) % 360) / 30);
      return idx + 1;
    }
    if (typeof chart.lagnaNum === "number") {
      if (chart.lagnaNum >= 0 && chart.lagnaNum <= 11) return chart.lagnaNum + 1;
      if (chart.lagnaNum === 12) return 12;
    }
    return 1;
  };

  const lagnaSignNum = resolveLagnaSignNum();
  const lagnaSign = RASHIS_ORDER[lagnaSignNum - 1] || "Aries";
  const lagnaSignHindi = RASHIS_HINDI[lagnaSignNum] || "मेष";

  // Helper for resilient planet data access
  const getPlanetData = (p: string): PlanetData | undefined => {
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

  // Helper for dynamic house cusp sign resolution
  const getHouseSignNum = (h: number): number => {
    if (chart.houseCusps && chart.houseCusps.length >= 12) {
      const cusp = chart.houseCusps.find(c => c.house === h);
      if (cusp) return getSignNumber(cusp.sign);
    }
    return ((lagnaSignNum - 1 + (h - 1)) % 12) + 1;
  };

  // 2. Build 12-House Query GPS Analyses
  const queryAnalyses: Record<number, QueryHouseGPSAnalysis> = {};

  for (let h = 1; h <= 12; h++) {
    const hSignNum = getHouseSignNum(h);
    const hSign = RASHIS_ORDER[hSignNum - 1];
    const lordPlanet = SIGN_LORDS[hSignNum] || "Mars";
    const lordPlanetHindi = PLANETS_HINDI[lordPlanet] || lordPlanet;

    const lordData = getPlanetData(lordPlanet);
    const placedSignNum = lordData?.sign ? getSignNumber(lordData.sign) : hSignNum;
    const placedSign = RASHIS_ORDER[placedSignNum - 1];
    const placedHouse = lordData?.house || lordData?.rashiHouse || (((placedSignNum - lagnaSignNum + 12) % 12) + 1);

    const gpsDef = MASTER_GPS_CODES[lordPlanet] || MASTER_GPS_CODES.Mercury;
    const targetHouse = calculateGPSTargetHouse(placedHouse, gpsDef.code);
    const targetSignNum = getHouseSignNum(targetHouse);
    const targetSign = RASHIS_ORDER[targetSignNum - 1];
    const dirInfo = ASTRO_VASTU_SIGN_DIRECTIONS[targetSignNum] || ASTRO_VASTU_SIGN_DIRECTIONS[1];

    // Clutter items dynamically resolved from target zone element & sign
    const clutterDef = SIGN_CLUTTER_MATRIX[targetSignNum] || SIGN_CLUTTER_MATRIX[1];
    const clutter = [...clutterDef.clutterItems];

    // Action Required
    const actionRequired = `घर के ${dirInfo.direction} (${dirInfo.directionHindi} - ${dirInfo.code}) ज़ोन को तत्काल नीट एंड क्लीन करें। वहां से ${clutter.slice(0, 2).join(" व ")} तत्काल हटाएं।`;

    // Dynamic Shastric Reverse-Counting Mechanism
    const targetThemeHi = QUERY_HOUSE_THEMES[targetHouse]?.hi || `${targetHouse}वां भाव`;
    const queryThemeHi = QUERY_HOUSE_THEMES[h]?.hi || `${h}वां भाव`;
    const shastricMechanism = `भाव ${h} (${queryThemeHi}) का स्वामी ${lordPlanetHindi} आपके भाव ${placedHouse} (${placedSign}) में स्थित है। ${lordPlanetHindi} का जीपीएस कोड ${gpsDef.code} है। ${
      gpsDef.code === 1
        ? "चूंकि जीपीएस कोड 1 है, अतः यह ग्रह उसी भाव में बैठकर फल देता है।"
        : `अतः भाव ${placedHouse} से वामावर्त (घड़ी की उल्टी दिशा) ${gpsDef.code} भाव पीछे चलने पर ट्रिगर भाव ${targetHouse} (${targetSign}) प्राप्त होता है।`
    } शास्त्रीय नियम के अनुसार, जब तक आपका ट्रिगर भाव ${targetHouse} (${targetThemeHi}) और इसकी दिशा ${dirInfo.directionHindi} (${dirInfo.code}) संतुलित व सक्रिय नहीं होगी, तब तक भाव ${h} का अभीष्ट फल गति नहीं पकड़ेगा।`;

    // Activating Remedy dynamically derived from Lord's Karaka & Target Zone
    const karakaItem = PLANET_KARAKA_ACTIVATION_ITEMS[lordPlanet] || PLANET_KARAKA_ACTIVATION_ITEMS.Mercury;
    let activatingRemedy = "";
    if (h === 7 && lordPlanet === "Venus") {
      activatingRemedy = `${dirInfo.directionHindi} में एक छोटी कांच की शीशी में प्रीमियम ब्रांडेड परफ्यूम रखें। यदि वहां किचन है तो गैस चूल्हे के नीचे पीला संगमरमर स्लैब रखें।`;
    } else if (h === 1 && lordPlanet === "Sun") {
      activatingRemedy = `सूर्य/आत्मबल को प्रखर करने हेतु ${dirInfo.directionHindi} में दहाड़ते हुए शेर (Roaring Lion) अथवा तेजस्वी राजा का चित्र लगाएं।`;
    } else if (h === 4) {
      activatingRemedy = `मन की शांति हेतु अपने ट्रिगर भाव ${targetHouse} (${targetThemeHi}) को सुदृढ़ करें और ${dirInfo.directionHindi} में ${karakaItem}`;
    } else if (h === 6) {
      activatingRemedy = `शिक्षा व विद्या की निःस्वार्थ सेवा (जरूरतमंद बच्चों को पढ़ाना) करें। साथ ही ${dirInfo.directionHindi} में ${karakaItem}`;
    } else if (h === 8) {
      activatingRemedy = `अष्टम भाव को ज्योतिष, गुप्त ज्ञान या गहन रिसर्च में लगाकर यूटिलाइज करें; ${dirInfo.directionHindi} से दवाइयों का ढेर हटाएं और वहां ${karakaItem}`;
    } else if (h === 12) {
      activatingRemedy = `सोमवार को मेंटल हॉस्पिटल या अनाथालय में दूध/फल का दान करें और नित्य ध्यान (Meditation) करें। साथ ही ${dirInfo.directionHindi} में ${karakaItem}`;
    } else {
      activatingRemedy = `${dirInfo.directionHindi} (${dirInfo.code}) ज़ोन में ${karakaItem}`;
    }

    // Utilization Protocol for dusthanas or difficult houses
    let utilizationProtocol: string | undefined = undefined;
    if (h === 8) {
      utilizationProtocol = "अष्टम भाव का नियम: यदि आप ज्योतिष या गूढ़ विद्या सीख रहे हैं तो अष्टम भाव पीड़ा देने के बजाय उच्च ज्ञान और इंट्यूशन का स्रोत बन जाता है।";
    } else if (h === 12) {
      utilizationProtocol = "द्वादश भाव का नियम: 12वां भाव व्यय व हॉस्पिटल का है। इसे मेडिटेशन, योग, विदेश व्यापार अथवा अस्पताल में दूध दान द्वारा यूटिलाइज करें ताकि धन की बर्बादी रुके।";
    } else if (h === 6) {
      utilizationProtocol = "षष्ठ भाव का नियम: शिक्षा व विद्या की निःशुल्क सेवा (गरीब बच्चों को पढ़ाना) करने से 6ठे भाव का बंधन टूटता है और करियर में असाधारण वृद्धि होती है।";
    }

    queryAnalyses[h] = {
      queryHouse: h,
      queryTheme: QUERY_HOUSE_THEMES[h]?.en || `House ${h}`,
      queryThemeHindi: QUERY_HOUSE_THEMES[h]?.hi || `${h}वां भाव`,
      houseSign: hSign,
      houseSignNum: hSignNum,
      houseLord: lordPlanet,
      houseLordHindi: lordPlanetHindi,
      placedHouse,
      placedSign,
      placedSignNum,
      gpsCode: gpsDef.code,
      targetHouse,
      targetSign,
      targetSignNum,
      targetDirection: dirInfo.direction,
      targetDirectionHindi: dirInfo.directionHindi,
      targetDirectionCode: dirInfo.code,
      clutterToInspect: clutter,
      actionRequired,
      shastricMechanism,
      activatingRemedy,
      utilizationProtocol,
    };
  }

  // 3. Ketu Cut-Zone (कटा हुआ ज़ोन) Auto-Detection
  const ketuData = getPlanetData("Ketu");
  const ketuSignNum = ketuData?.sign ? getSignNumber(ketuData.sign) : (((lagnaSignNum - 1 + 11) % 12) + 1);
  const ketuHouse = ketuData?.house || ketuData?.rashiHouse || (((ketuSignNum - lagnaSignNum + 12) % 12) + 1);
  const ketuSignName = RASHIS_ORDER[ketuSignNum - 1];
  const ketuDirInfo = ASTRO_VASTU_SIGN_DIRECTIONS[ketuSignNum] || ASTRO_VASTU_SIGN_DIRECTIONS[1];

  const ketuCutZone: KetuCutZoneReport = {
    ketuHouse,
    ketuSignNum,
    ketuSignName,
    cutDirection: ketuDirInfo.direction,
    cutDirectionHindi: ketuDirInfo.directionHindi,
    cutDirectionCode: ketuDirInfo.code,
    defectDescription: `केतु संकोच व विरक्ति (Detachment) का कारक है। आपकी जन्मकुंडली में केतु ${RASHIS_HINDI[ketuSignNum]} (${ketuSignName}) में विराजमान है। एस्ट्रो-वास्तु के शास्त्रीय नियम के अनुसार, आपके मकान या फ्लैट का ${ketuDirInfo.direction} (${ketuDirInfo.directionHindi} - ${ketuDirInfo.code}) कोना कटा हुआ (Cut / Missing Corner) या ऊर्जा-विहीन मिलेगा, जिससे उस दिशा से संबंधित सुख व प्रोफेशन में विच्छेद होता है।`,
    correctiveRemedies: {
      yellowBulb24Hr: `कटे हुए ज़ोन को ऊर्जा से भरने (Energy Fill-up) हेतु ${ketuDirInfo.directionHindi} में एक पीला बल्ब (Zero-watt या LED Yellow Bulb) लगाएं जो 24 घंटे लगातार जलता रहे।`,
      roofCornerFlag: `घर की छत पर ठीक ${ketuDirInfo.directionHindi} (${ketuDirInfo.code}) कोने में एक त्रिकोणीय धर्म ध्वज (पीला या केसरिया झंडा) स्थापित करें। यह आकाश तत्व को बांधकर कटे हुए कोने का दोष समाप्त करता है।`,
      cleanlinessProtocol: `इस दिशा को सर्वथा कबाड़-मुक्त, स्वच्छ रखें और वहां कोई भी एंटी-एलिमेंट वस्तु न रहने दें।`,
    }
  };

  // 4. Rahu Extended-Zone (बढ़ा हुआ ज़ोन) Auto-Detection
  const rahuData = getPlanetData("Rahu");
  const rahuSignNum = rahuData?.sign ? getSignNumber(rahuData.sign) : (((lagnaSignNum - 1 + 5) % 12) + 1);
  const rahuHouse = rahuData?.house || rahuData?.rashiHouse || (((rahuSignNum - lagnaSignNum + 12) % 12) + 1);
  const rahuSignName = RASHIS_ORDER[rahuSignNum - 1];
  const rahuDirInfo = ASTRO_VASTU_SIGN_DIRECTIONS[rahuSignNum] || ASTRO_VASTU_SIGN_DIRECTIONS[1];

  const rahuExtendedZone: RahuExtendedZoneReport = {
    rahuHouse,
    rahuSignNum,
    rahuSignName,
    extendedDirection: rahuDirInfo.direction,
    extendedDirectionHindi: rahuDirInfo.directionHindi,
    extendedDirectionCode: rahuDirInfo.code,
    defectDescription: `राहु अत्यधिक विस्तार (Expansion) का कारक है। आपकी कुंडली में राहु ${RASHIS_HINDI[rahuSignNum]} (${rahuSignName}) में स्थित है। इसके प्रभाव से आपके आवास का ${rahuDirInfo.direction} (${rahuDirInfo.directionHindi} - ${rahuDirInfo.code}) ज़ोन बढ़ा हुआ (Extended / Projected) मिलेगा, जिससे अनियंत्रित वासना, भ्रम या अवांछित व्यय उत्पन्न होते हैं।`,
    correctiveRemedies: {
      groundingCure: `इस बढ़े हुए ज़ोन में एक ठोस कच्ची चांदी का चौकोर टुकड़ा अथवा पीतल/लेड की पट्टी से ऊर्जा को ग्राउंड (Earth/Grounding) करें।`,
      electricalNeutralization: `खराब इलेक्ट्रॉनिक्स, बंद घड़ियां या तारों का उलझा गुच्छा इस ज़ोन से तत्काल बाहर फेंकें।`,
    }
  };

  // 5. Dynamic House Utilization Advices (100% Chart-Driven)
  const getHouseOccupants = (houseNum: number): string[] => {
    if (!chart.planets) return [];
    return Object.entries(chart.planets)
      .filter(([_, p]: [string, any]) => {
        const ph = p?.house || p?.rashiHouse;
        return ph === houseNum;
      })
      .map(([name, _]) => PLANETS_HINDI[name] || name);
  };

  const h8SignNum = getHouseSignNum(8);
  const h8Lord = SIGN_LORDS[h8SignNum] || "Mercury";
  const h8LordHi = PLANETS_HINDI[h8Lord] || h8Lord;
  const h8Occupants = getHouseOccupants(8);
  const h8Connected = h8Occupants.length > 0 ? `${h8LordHi} (स्वामी), ${h8Occupants.join(", ")} (स्थित)` : `${h8LordHi} (भाव स्वामी)`;

  const h12SignNum = getHouseSignNum(12);
  const h12Lord = SIGN_LORDS[h12SignNum] || "Jupiter";
  const h12LordHi = PLANETS_HINDI[h12Lord] || h12Lord;
  const h12Occupants = getHouseOccupants(12);
  const h12Connected = h12Occupants.length > 0 ? `${h12LordHi} (स्वामी), ${h12Occupants.join(", ")} (स्थित)` : `${h12LordHi} (भाव स्वामी)`;

  const h6SignNum = getHouseSignNum(6);
  const h6Lord = SIGN_LORDS[h6SignNum] || "Mercury";
  const h6LordHi = PLANETS_HINDI[h6Lord] || h6Lord;
  const h6Occupants = getHouseOccupants(6);
  const h6Connected = h6Occupants.length > 0 ? `${h6LordHi} (स्वामी), ${h6Occupants.join(", ")} (स्थित)` : `${h6LordHi} (भाव स्वामी)`;

  const houseUtilizationAdvices: HouseUtilizationAdvice[] = [
    {
      houseNumber: 8,
      houseTheme: "अष्टम भाव (पीड़ा, गुप्त रहस्य व रुकावटें)",
      connectedPlanet: h8Connected,
      philosophicalConcept: "हर ग्रह और भाव आपसे पूछता है: 'आप मुझे यूटिलाइज करोगे या मैं आपको कष्ट दूं?'",
      practicalAction: "ज्योतिष, वास्तु, रिसर्च या गुप्त गूढ़ विद्याओं का अध्ययन करें। अष्टम भाव का सकारात्मक उपयोग होते ही यह मानसिक यातना देने के बजाय दिव्य ज्ञान का उपहार बन जाता है।"
    },
    {
      houseNumber: 12,
      houseTheme: "द्वादश भाव (हॉस्पिटल, अनिद्रा व धन व्यय)",
      connectedPlanet: h12Connected,
      philosophicalConcept: "12वां भाव व्यय का है; यदि इसे सात्विक कार्यों में खर्च नहीं करेंगे तो यह बीमारी व कोर्ट में नष्ट होगा।",
      practicalAction: "सोमवार को मेंटल हॉस्पिटल या अनाथालय में दूध व फल का दान करें। प्रतिदिन 30 मिनट से 1 घंटा योग व ध्यान (Meditation) करें ताकि मोक्ष व आंतरिक शांति प्राप्त हो।"
    },
    {
      houseNumber: 6,
      houseTheme: "षष्ठ भाव (ऋण, रोग, शत्रु व सेवा)",
      connectedPlanet: h6Connected,
      philosophicalConcept: "सेवा (Service) से षष्ठ भाव का रोग व ऋण तुरंत कट जाता है।",
      practicalAction: "गरीब या असहाय बच्चों को पुस्तकें बांटें और उन्हें मुफ्त शिक्षा प्रदान करें। इससे आपका प्रोफेशन व सामाजिक प्रतिष्ठा आकाश छूने लगेगी।"
    }
  ];

  return {
    nativeName: chart.name || "Seeker",
    lagnaSign,
    lagnaSignHindi,
    lagnaSignNum,
    masterGPSCodeTable: MASTER_GPS_CODES,
    queryAnalyses,
    ketuCutZone,
    rahuExtendedZone,
    houseUtilizationAdvices,
    shastricPricingPhilosophy: {
      title: "शास्त्रीय एस्ट्रो-वास्तु का नैतिक एवं वित्तीय दर्शन (Shastric Remedial Philosophy)",
      coreRule: "जो असर ₹2 लाख की रेमेडी करती है, वही असर ₹10 से ₹20 की सटीक शास्त्रीय रेमेडी से प्राप्त होता है।",
      guideline: "एस्ट्रो-वास्तु का रहस्य इस बात में नहीं है कि आपने बाजार से 50,000 का कोई पिरामिड या महंगा यंत्र खरीदकर लगाया; रहस्य इस बात में है कि 'चोट कहाँ लगानी है' (Pinhole Precision Targeting)। अपने घर में उपस्थित वस्तुओं (जैसे परफ्यूम, पीला धागा, दूध का दान, शेर की तस्वीर, किताबों का स्थान परिवर्तन) से ही 100% सटीक परिणाम मिलते हैं।"
    }
  };
}

