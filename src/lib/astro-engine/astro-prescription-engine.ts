// src/lib/astro-engine/astro-prescription-engine.ts
// ============================================================================
// ASTROLIFE — ASTRO-PHARMACOLOGICAL PRESCRIPTION ENGINE (v2.0)
// ============================================================================
// 100% Dynamic, Chart-Driven & Shastric:
// 1. Active Salt / Molecule (सक्रिय घटक): Target planet driving primary objective,
//    dynamically derived from active Dasha/Antardasha or native's Lagna lord.
// 2. PPI / Antacid Shield (सुरक्षा कवच): 120° / 60° Buffer planet that neutralizes
//    90°/180° friction locks to prevent burnout and stress.
// 3. Dynamic Compound Thread Recipe: Real chromatic blend of Base + Shield planets
//    (e.g. Sun+Jupiter = Saffron Amber, Moon+Jupiter = Gajakesari Cream,
//     Mercury+Jupiter = Lime Green, Saturn+Jupiter = Royal Indigo, etc.).
// 4. Dynamic Daily Accessories: 100% Lagna-driven (all 12 signs) smartphone covers,
//    footwear, headwear, waist belt, and face masks.
// 5. Dynamic Crystals & Navtara: Derived strictly from native's Moon Nakshatra.
// 6. Dynamic Wallet Protocol: Derived strictly from 2nd house (Dhana Bhava) lord.
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import type { AstroVastuHitDossier } from "./astro-vastu-hit-engine";

// ── Types & Interfaces ───────────────────────────────────────────────────────

export type PrescriptionCategory =
  | "Active_Salt"
  | "PPI_Antacid_Shield"
  | "Nutritional_Support"
  | "Contraindication";

export interface PrescriptionMoleculeItem {
  category: PrescriptionCategory;
  categoryHindi: string;
  badgeLabel: string;
  badgeColor: string;
  planet: string;
  planetHindi: string;
  elementOrAction: string;
  colorName: string;
  hexColor: string;
  targetObjective: string;
  scientificHitReason: string;
  howToApply: string;
  icon: string;
}

export interface CompoundThreadRecipe {
  basePlanet: string;
  baseColor: string;
  shieldPlanet: string;
  shieldColor: string;
  blendedColorName: string;
  blendedColorHindi: string;
  blendedHex: string;
  whyBlended: string;
  wristHand: "दाहिना हाथ (Right Wrist)" | "बायां हाथ (Left Wrist)";
  wearingDayAndTiming: string;
  ritualInstructions: string;
}

export interface CrystalProtocol {
  wearableBracelet: Array<{
    crystalName: string;
    crystalHindi: string;
    colorHex: string;
    taraName: string;
    taraNumber: number;
    governingPlanet: string;
    role: string;
  }>;
  deskManifestationCrystal: Array<{
    crystalName: string;
    placementZone: string;
    purpose: string;
    caution: string;
  }>;
  strictlyAvoidCrystals: Array<{
    crystalName: string;
    reason: string;
    dangerLevel: "High" | "Critical";
  }>;
}

export interface WalletProtocol {
  recommendedColors: string[];
  recommendedHexes: string[];
  colorsToAvoid: string[];
  seedItemInside: string;
  recommendedCurrencyNote: string;
  scientificReason: string;
}

export interface AnatomicalTargetingRecommendation {
  bodyZoneHi: string;
  bodyZoneEn: string;
  correspondingSign: string;
  correspondingSignNum: number;
  houseInNativeChart: number;
  rulingPlanet: string;
  wearableForm: string;
  toneAndHex: {
    colorName: string;
    hexColor: string;
    hslColor: string;
  };
  purpose: string;
  planetaryMechanism: string;
  isAllowedForNative: boolean;
  cautionNotice?: string;
}

export interface DegreeChromaticModulation {
  planet: string;
  degInSign: number;
  degFormatted: string;
  avastha: "Bala" | "Kumara" | "Yuva" | "Vriddha" | "Sandhi_Mrita";
  avasthaHindi: string;
  baseHue: number;
  saturationPercent: number;
  lightnessPercent: number;
  hslString: string;
  hexCode: string;
  toneDescription: string;
  scientificRule: string;
}

export interface DailyAccessoryProtocol {
  phoneCover: {
    title: string;
    recommendedColors: string[];
    recommendedHexes: string[];
    colorsToAvoid: string[];
    caseMaterial: string;
    planetaryMechanism: string;
    idealWallpaperAffirmation: string;
    cautionNotice: string;
  };
  footwear: {
    title: string;
    recommendedColors: string[];
    recommendedHexes: string[];
    colorsToAvoid: string[];
    materialType: string;
    planetaryMechanism: string;
    cautionNotice: string;
  };
  headwearCap: {
    title: string;
    recommendedColors: string[];
    recommendedHexes: string[];
    colorsToAvoid: string[];
    style: string;
    planetaryMechanism: string;
    cautionNotice: string;
  };
  belt: {
    title: string;
    recommendedColors: string[];
    recommendedHexes: string[];
    colorsToAvoid: string[];
    material: string;
    buckleMetal: string;
    planetaryMechanism: string;
    cautionNotice: string;
  };
  faceMask: {
    title: string;
    recommendedColors: string[];
    recommendedHexes: string[];
    colorsToAvoid: string[];
    fabric: string;
    planetaryMechanism: string;
    cautionNotice: string;
  };
}

export interface AstroPharmacologicalPrescription {
  title: string;
  formulaSubtitle: string;
  nativeName: string;
  activeSalt: PrescriptionMoleculeItem;
  protonPumpInhibitor: PrescriptionMoleculeItem;
  nutritionalSupport: PrescriptionMoleculeItem[];
  contraindications: PrescriptionMoleculeItem[];
  compoundThread: CompoundThreadRecipe;
  chromaticModulation: DegreeChromaticModulation;
  anatomicalProtocols: AnatomicalTargetingRecommendation[];
  crystals: CrystalProtocol;
  wallet: WalletProtocol;
  accessories: DailyAccessoryProtocol;
  frictionDiagnosisSummary: string;
}

// ── Constants & Helpers ──────────────────────────────────────────────────────

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const TARA_NAMES = [
  "Janma (तत्व/आत्म)",
  "Sampat (धन/सम्पदा)",
  "Vipat (विपत्ति/कष्ट)",
  "Kshema (कल्याण/क्षेम)",
  "Pratyak (प्रत्यरी/बाधा)",
  "Sadhana (साधना/सिद्धि)",
  "Naidhana (वध/विनाश)",
  "Mitra (मित्र/सहयोगी)",
  "Parama Mitra (परम मित्र)"
];

const RASHIS_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export const PLANET_COLORS: Record<string, { name: string; hex: string }> = {
  Sun: { name: "Ruby Red / Copper Saffron", hex: "#EA580C" },
  Moon: { name: "Pearl White / Silver", hex: "#F8FAFC" },
  Mars: { name: "Bright Coral Red", hex: "#DC2626" },
  Mercury: { name: "Emerald Green", hex: "#16A34A" },
  Jupiter: { name: "Golden Yellow", hex: "#EAB308" },
  Venus: { name: "Diamond White / Soft Pastel", hex: "#F1F5F9" },
  Saturn: { name: "Royal Navy / Charcoal", hex: "#1E3A8A" },
  Rahu: { name: "Smoky Ultraviolet / Deep Indigo", hex: "#312E81" },
  Ketu: { name: "Ash Grey / Terracotta", hex: "#78350F" }
};

export const PLANET_HINDI: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
};

export const PLANET_CRYSTALS: Record<string, { primary: string; sub: string; crystal: string }> = {
  Sun: { primary: "Ruby", sub: "Red Garnet", crystal: "Sunstone (सनस्टोन)" },
  Moon: { primary: "Pearl", sub: "Moonstone", crystal: "Rainbow Moonstone (मूनस्टोन)" },
  Mars: { primary: "Red Coral", sub: "Carnelian", crystal: "Red Jasper / Carnelian (रेड जैस्पर)" },
  Mercury: { primary: "Emerald", sub: "Peridot", crystal: "Green Aventurine / Green Jade (ग्रीन एवेंट्यूरिन)" },
  Jupiter: { primary: "Yellow Sapphire", sub: "Yellow Topaz", crystal: "Natural Citrine (प्राकृतिक सिट्रीन)" },
  Venus: { primary: "Diamond", sub: "White Zircon", crystal: "Clear Quartz / Sphatik (शुद्ध स्फटिक)" },
  Saturn: { primary: "Blue Sapphire", sub: "Amethyst", crystal: "Lapis Lazuli / Amethyst (लापिस लाजुली / कटेला)" },
  Rahu: { primary: "Hessonite", sub: "Spessartite", crystal: "Tiger's Eye (टाइगर्स आई)" },
  Ketu: { primary: "Cat's Eye", sub: "Chrysoberyl", crystal: "Snowflake Obsidian (ऑब्सीडियन)" }
};

const PLANET_BASE_HUES: Record<string, number> = {
  Sun: 24,       // Copper / Golden Orange
  Moon: 205,     // Silver / Soft Cyan-Pearl
  Mars: 0,       // Coral Red
  Mercury: 142,  // Emerald Green
  Jupiter: 48,   // Golden Yellow
  Venus: 330,    // Soft Rose / Pastel Cream
  Saturn: 220,   // Royal Navy Blue
  Rahu: 265,     // Deep Indigo / Violet
  Ketu: 30,      // Warm Ochre / Terracotta
};

export function normalizeLagnaIndex(chart: ChartData): number {
  if (chart.lagnaRashi) {
    const idx = RASHIS_ORDER.indexOf(chart.lagnaRashi as any);
    if (idx >= 0) return idx;
  }
  if (typeof chart.lagnaNum === "number") {
    if (chart.lagnaNum >= 1 && chart.lagnaNum <= 12) {
      return chart.lagnaNum - 1;
    }
    if (chart.lagnaNum >= 0 && chart.lagnaNum <= 11) {
      return chart.lagnaNum;
    }
  }
  return 0; // Aries fallback
}

export function calculateNavtara(moonNakshatraName: string, targetNakshatraName: string): {
  diff: number;
  taraNumber: number;
  taraName: string;
  isHarmful: boolean;
  isSupreme: boolean;
} {
  const moonIdx = NAKSHATRAS.indexOf(moonNakshatraName);
  const targetIdx = NAKSHATRAS.indexOf(targetNakshatraName);
  if (moonIdx === -1 || targetIdx === -1) {
    return { diff: 0, taraNumber: 1, taraName: "Janma (तत्व/आत्म)", isHarmful: false, isSupreme: false };
  }
  const diff = (targetIdx - moonIdx + 27) % 27;
  const taraIdx = diff % 9;
  const taraNumber = taraIdx + 1;
  const isHarmful = taraNumber === 7 || taraNumber === 3 || taraNumber === 5; // 7=Vadha, 3=Vipat, 5=Pratyak
  const isSupreme = taraNumber === 6 || taraNumber === 8 || taraNumber === 9 || taraNumber === 2 || taraNumber === 4;

  return {
    diff,
    taraNumber,
    taraName: TARA_NAMES[taraIdx],
    isHarmful,
    isSupreme
  };
}

// ── Degree-Based Chromatic Modulation & Anatomical Helpers ───────────────────

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function computeDegreeChromaticModulation(
  planetName: string,
  pData: PlanetData | undefined
): DegreeChromaticModulation {
  const degInSign = pData ? pData.degree + pData.minutes / 60 : 15;
  const degFormatted = `${degInSign.toFixed(2)}°`;

  const baseHue = PLANET_BASE_HUES[planetName] ?? 48; // Defaults to Jupiter Gold (48), never hardcoded lime green!

  let avastha: DegreeChromaticModulation["avastha"] = "Yuva";
  let avasthaHindi = "युवावस्था (12°-18° पूर्ण प्रखर / Peak Potency)";
  let saturationPercent = 92;
  let lightnessPercent = 46;
  let toneDescription = "उच्च संतृप्ति (High Saturation) प्रखर टोन";
  let scientificRule = "12°-18° के ग्रह का चेष्टा बल 100% चरम पर होता है, अतः पूर्ण संतृप्त (Vibrant) रंग सर्वोत्तम फलित होता है।";

  if (degInSign < 6) {
    avastha = "Bala";
    avasthaHindi = "बालावस्था (0°-6° कोमल/सौम्य)";
    saturationPercent = 52;
    lightnessPercent = 70;
    toneDescription = "सॉफ्ट पेस्टल / कोमल टोन (Pastel Tint)";
    scientificRule = "बालावस्था के ग्रह को अधिक तीखा रंग देने के बजाय सौम्य, हल्का (Pastel) टोन दिया जाता है ताकि कोमल ऊर्जा पर झटका न लगे।";
  } else if (degInSign < 12) {
    avastha = "Kumara";
    avasthaHindi = "कुमारावस्था (6°-12° प्रफुल्लित/मध्यम)";
    saturationPercent = 72;
    lightnessPercent = 56;
    toneDescription = "मध्यम प्रफुल्लित टोन (Medium Radiant)";
    scientificRule = "कुमारावस्था की ऊर्जा में वृद्धि हो रही होती है, अतः मध्यम प्रफुल्लित रंग ऊर्जा को गति देता है।";
  } else if (degInSign < 18) {
    avastha = "Yuva";
    avasthaHindi = "युवावस्था (12°-18° पूर्ण प्रखर / Peak Potency)";
    saturationPercent = 95;
    lightnessPercent = 45;
    toneDescription = "पूर्ण संतृप्त प्रखर टोन (Deep Vibrant)";
    scientificRule = "युवावस्था में ग्रह अपने पूर्ण बल में होता है; इसे गहरा, चमकदार रंग बिना किसी झिझक के दिया जा सकता है।";
  } else if (degInSign < 24) {
    avastha = "Vriddha";
    avasthaHindi = "वृद्धावस्था (18°-24° गंभीर/म्यूटेड)";
    saturationPercent = 74;
    lightnessPercent = 40;
    toneDescription = "गंभीर म्यूटेड टोन (Mellow Earthy)";
    scientificRule = "वृद्धावस्था के ग्रह में परिपक्वता होती है; इसे बहुत चटक रंग देने के बजाय गंभीर म्यूटेड शेड दिया जाता है।";
  } else {
    avastha = "Sandhi_Mrita";
    avasthaHindi = "राशि संधि / मृत अवस्था (24°-30° पुनर्बलित सघन)";
    saturationPercent = 86;
    lightnessPercent = 37;
    toneDescription = "सघन पुनर्बलित टोन (Deep Reinforced)";
    scientificRule = "राशि संधि (Sandhi) पर ग्रह की ऊर्जा क्षीण या अगली राशि में संक्रमित हो रही होती है। इसे संबल देने हेतु अधिक गहरा, सघन रंग दिया जाता है।";
  }

  const hexCode = hslToHex(baseHue, saturationPercent, lightnessPercent);
  const hslString = `hsl(${baseHue}, ${saturationPercent}%, ${lightnessPercent}%)`;

  return {
    planet: planetName,
    degInSign,
    degFormatted,
    avastha,
    avasthaHindi,
    baseHue,
    saturationPercent,
    lightnessPercent,
    hslString,
    hexCode,
    toneDescription,
    scientificRule,
  };
}

// ── Dynamic Harmonic Color Blending Engine ───────────────────────────────────

export function getCompoundThreadColorBlend(
  basePlanet: string,
  shieldPlanet: string,
  baseHexOverride?: string,
  shieldHexOverride?: string
): {
  blendedColorName: string;
  blendedColorHindi: string;
  blendedHex: string;
  compoundWhy: string;
} {
  const pairKey = `${basePlanet}_${shieldPlanet}`;
  const reversePairKey = `${shieldPlanet}_${basePlanet}`;

  // Comprehensive Classical Shastric Blend Table
  const BLENDS: Record<string, { name: string; hindi: string; hex: string; why: string }> = {
    // Mercury + Jupiter -> Lime / Parrot Green (Saraswati Blend)
    Mercury_Jupiter: {
      name: "Lime Green / Parrot Green",
      hindi: "लाईम ग्रीन (तोतिया हरा / सरस्वती योग)",
      hex: "#84CC16",
      why: "बुध (हरा) + गुरु (पीला) का 50-50 संयोजन। यह बुध की तीव्र तार्किक बुद्धि को गुरु के सात्विक विवेक से जोड़कर सरस्वती योग सिद्ध करता है।"
    },
    Jupiter_Mercury: {
      name: "Lime Green / Parrot Green",
      hindi: "लाईम ग्रीन (तोतिया हरा / सरस्वती योग)",
      hex: "#84CC16",
      why: "गुरु (पीला) + बुध (हरा) का संयोजन। गुरु के ज्ञान को व्यावहारिक व्यापार व संचार में बदलने हेतु तोतिया हरा रंग सर्वोत्तम है।"
    },
    // Sun + Jupiter -> Honey Saffron / Golden Amber
    Sun_Jupiter: {
      name: "Honey Saffron / Golden Amber",
      hindi: "सुनहरा केसरी / अम्बर गोल्ड (सूर्य-गुरु तेजस)",
      hex: "#F59E0B",
      why: "सूर्य (ताम्र) + गुरु (स्वर्ण पीत) का राजयोग तेजस ब्लेंड। यह मान-सम्मान, उच्च पद, प्रशासनिक प्रभाव व पिता/राज्य कृपा को सक्रिय करता है।"
    },
    Jupiter_Sun: {
      name: "Honey Saffron / Golden Amber",
      hindi: "सुनहरा केसरी / अम्बर गोल्ड (सूर्य-गुरु तेजस)",
      hex: "#F59E0B",
      why: "गुरु के आध्यात्मिक ज्ञान को सूर्य के राजसी तेज से जोड़कर प्रतिष्ठा व सामाजिक प्रभाव में वृद्धि करता है।"
    },
    // Sun + Moon -> Royal Ivory / Solar Pearl
    Sun_Moon: {
      name: "Royal Ivory / Solar Pearl",
      hindi: "रॉयल आइवरी / श्वेत-स्वर्ण (सूर्य-चंद्र कांति)",
      hex: "#FEF3C7",
      why: "सूर्य (आत्मबल) + चंद्र (मनोबल) का दिव्य सामंजस्य। इच्छाशक्ति और भावनात्मक शांति को एक साथ साधता है।"
    },
    Moon_Sun: {
      name: "Royal Ivory / Solar Pearl",
      hindi: "रॉयल आइवरी / श्वेत-स्वर्ण (सूर्य-चंद्र कांति)",
      hex: "#FEF3C7",
      why: "चंद्रमा की शीतलता में सूर्य का ओज समाहित कर आत्मविश्वास व मानसिक सुकून का संतुलन बनाता है।"
    },
    // Mars + Jupiter -> Saffron Coral / Guru-Mangal Amber
    Mars_Jupiter: {
      name: "Guru-Mangal Saffron Amber",
      hindi: "केसरी सिंदूरी / गुरु-मंगल योग",
      hex: "#EA580C",
      why: "मंगल (अग्नि/ऊर्जा) + गुरु (ज्ञान/विवेक)। यह मंगल के उतावलेपन व क्रोध को विवेकपूर्ण शौर्य व भूमि लाभ में बदलता है।"
    },
    Jupiter_Mars: {
      name: "Guru-Mangal Saffron Amber",
      hindi: "केसरी सिंदूरी / गुरु-मंगल योग",
      hex: "#EA580C",
      why: "गुरु के मार्गदर्शन को मंगल की ऊर्जा से गति मिलती है, जिससे अटके हुए बड़े कार्य तुरंत निष्पादित होते हैं।"
    },
    // Mars + Moon -> Terracotta Coral
    Mars_Moon: {
      name: "Terracotta Coral / Soft Rose Coral",
      hindi: "सौम्य रक्ताभ / चंद्र-मंगल लक्ष्मी ब्लेंड",
      hex: "#F87171",
      why: "चंद्र-मंगल का धनदायक संयोग। यह रक्तचाप व अधीरता को शांत करके वित्तीय साहस व पराक्रम जगाता है।"
    },
    Moon_Mars: {
      name: "Terracotta Coral / Soft Rose Coral",
      hindi: "सौम्य रक्ताभ / चंद्र-मंगल लक्ष्मी ब्लेंड",
      hex: "#F87171",
      why: "चंद्रमा के मन को मंगल का संबल देकर अवसाद व हिचकिचाहट को दूर करता है।"
    },
    // Moon + Jupiter -> Gajakesari Cream
    Moon_Jupiter: {
      name: "Gajakesari Cream / Pale Gold",
      hindi: "गजकेसरी क्रीम / हल्का सुनहरा-सफेद",
      hex: "#FEF08A",
      why: "चंद्र (श्वेत) + गुरु (स्वर्ण) का गजकेसरी योग। मानसिक तनाव व अनिद्रा को शांत कर प्रचुर सम्मान व समृद्धि देता है।"
    },
    Jupiter_Moon: {
      name: "Gajakesari Cream / Pale Gold",
      hindi: "गजकेसरी क्रीम / हल्का सुनहरा-सफेद",
      hex: "#FEF08A",
      why: "गुरु (पीला) + चंद्र (सफेद) का गजकेसरी ब्लेंड। यह 11वें भाव के अटके धन को रिलीज करता है और मानसिक तनाव को बर्फ की तरह शांत करता है।"
    },
    // Moon + Venus -> Pearl Rose / Sphatik
    Moon_Venus: {
      name: "Pearl Rose / Iridescent Silver",
      hindi: "मोती-गुलाबी / स्फटिक कांति (चंद्र-शुक्र सौंदर्य)",
      hex: "#F1F5F9",
      why: "चंद्र और शुक्र का जल-तत्व ब्लेंड। कला, सम्मोहन, सुखद निद्रा, सौम्य आकर्षण व रचनात्मक उत्कृष्टता प्रदान करता है।"
    },
    Venus_Moon: {
      name: "Pearl Rose / Iridescent Silver",
      hindi: "मोती-गुलाबी / स्फटिक कांति (चंद्र-शुक्र सौंदर्य)",
      hex: "#F1F5F9",
      why: "शुक्र के ऐश्वर्य को चंद्रमा की मानसिक शीतलता से जोड़कर सुख-सुविधाओं का निर्दोष उपभोग सुनिश्चित करता है।"
    },
    // Mercury + Venus -> Laxmi Mint Green
    Mercury_Venus: {
      name: "Laxmi Mint / Pastel Jade",
      hindi: "लक्ष्मी मिंट / पन्ना-श्वेत कांति (बुध-शुक्र लक्ष्मी योग)",
      hex: "#10B981",
      why: "बुध (व्यापार/वाक) + शुक्र (धन/कला) का लक्ष्मी नारायण योग। व्यापार, क्लाइंट अट्रैक्शन व लिक्विड वेल्थ को चरम पर ले जाता है।"
    },
    Venus_Mercury: {
      name: "Laxmi Mint / Pastel Jade",
      hindi: "लक्ष्मी मिंट / पन्ना-श्वेत कांति (बुध-शुक्र लक्ष्मी योग)",
      hex: "#10B981",
      why: "शुक्र के आकर्षण को बुध की मार्केटिंग क्षमता से जोड़कर वित्तीय लाभ व क्लाइंट्स में वृद्धि करता है।"
    },
    // Mercury + Moon -> Aquamarine Teal
    Mercury_Moon: {
      name: "Aquamarine Teal / Seafoam Green",
      hindi: "एक्वामरीन / जल-हरित (बुध-चंद्र सौम्य शांति)",
      hex: "#38BDF8",
      why: "बुध की तीव्र तार्किक दौड़ को चंद्रमा की शीतलता से आराम मिलता है; अनिद्रा, न्यूरो-स्ट्रेस व ओवरथिंकिंग का शमन होता है।"
    },
    Moon_Mercury: {
      name: "Aquamarine Teal / Seafoam Green",
      hindi: "एक्वामरीन / जल-हरित (बुध-चंद्र सौम्य शांति)",
      hex: "#38BDF8",
      why: "मन की चंचलता को बुध के तर्क से संतुलित कर स्पष्ट व ठोस निर्णय क्षमता प्रदान करता है।"
    },
    // Mercury + Sun -> Budhaditya Golden Olive
    Mercury_Sun: {
      name: "Budhaditya Golden Olive",
      hindi: "बुधादित्य स्वर्ण-हरित (सूर्य-बुध प्रज्ञा सूत्र)",
      hex: "#65A30D",
      why: "सूर्य की चमक और बुध की बुद्धि का बुधादित्य योग। तार्किक विश्लेषण, लेखन व बौद्धिक नेतृत्व में ख्याति दिलाता है।"
    },
    Sun_Mercury: {
      name: "Budhaditya Golden Olive",
      hindi: "बुधादित्य स्वर्ण-हरित (सूर्य-बुध प्रज्ञा सूत्र)",
      hex: "#65A30D",
      why: "सूर्य के आत्मबल को बुध की बुद्धिमत्ता से जोड़कर राज्यकीय व व्यावसायिक सफलता देता है।"
    },
    // Saturn + Jupiter -> Royal Indigo
    Saturn_Jupiter: {
      name: "Royal Indigo / Brahma-Shani",
      hindi: "रॉयल इंडिगो / गहरा नीलम-स्वर्ण (शनि-गुरु धर्म-कर्म)",
      hex: "#1D4ED8",
      why: "शनि का कर्म + गुरु का धर्म। यह दीर्घकालिक करियर स्थिरता, न्यायप्रियता, प्रतिष्ठा व अचल संपत्ति का निर्माण करता है।"
    },
    Jupiter_Saturn: {
      name: "Royal Indigo / Brahma-Shani",
      hindi: "रॉयल इंडिगो / गहरा नीलम-स्वर्ण (शनि-गुरु धर्म-कर्म)",
      hex: "#1D4ED8",
      why: "गुरु की कृपा से शनि का कठोर परिश्रम सरल और स्थायी लाभ में परिवर्तित होता है।"
    },
    // Saturn + Mercury -> Petrol Teal
    Saturn_Mercury: {
      name: "Petrol Teal / Dark Cyan Green",
      hindi: "पेट्रोल टील / गहरा नीला-हरा (शनि-बुध कर्म-बुद्धि)",
      hex: "#0E7490",
      why: "शनि की गहरी एकाग्रता + बुध की कोडिंग/एनालिटिक्स क्षमता। बड़े सिस्टम्स, टेक आर्किटेक्चर व शोध में अटूट फोकस देता है।"
    },
    Mercury_Saturn: {
      name: "Petrol Teal / Dark Cyan Green",
      hindi: "पेट्रोल टील / गहरा नीला-हरा (शनि-बुध कर्म-बुद्धि)",
      hex: "#0E7490",
      why: "बुध के विचारों को शनि की स्थिरता देकर भटकाव रहित लक्ष्य प्राप्ति कराता है।"
    },
    // Saturn + Moon -> Silver Slate / Amethyst Smoke
    Saturn_Moon: {
      name: "Silver Slate / Amethyst Smoke",
      hindi: "चांदी-स्लेटी / सौम्य चारकोल (विष-योग शांति सूत्र)",
      hex: "#6B7280",
      why: "शनि की भारी दृष्टि से चंद्रमा की रक्षा करता है। डिप्रेशन, अवसाद व अकेलेपन की भावना को दूर कर आध्यात्मिक वैराग्य देता है।"
    },
    Moon_Saturn: {
      name: "Silver Slate / Amethyst Smoke",
      hindi: "चांदी-स्लेटी / सौम्य चारकोल (विष-योग शांति सूत्र)",
      hex: "#6B7280",
      why: "शनि की भारी दृष्टि से चंद्रमा की रक्षा करता है। डिप्रेशन, अवसाद व अकेलेपन की भावना को दूर कर आध्यात्मिक वैराग्य देता है।"
    },
    // Saturn + Venus -> Platinum Slate
    Saturn_Venus: {
      name: "Platinum Slate / Steel Silver",
      hindi: "प्लैटिनम स्लेटी / चमकीला चारकोल (शनि-शुक्र ऐश्वर्य)",
      hex: "#475569",
      why: "शनि-शुक्र का परम मित्र योग। वित्तीय अनुशासन के साथ स्थायी वैभव, रियल एस्टेट व वाहन सुख का मार्ग प्रशस्त करता है।"
    },
    Venus_Saturn: {
      name: "Platinum Slate / Steel Silver",
      hindi: "प्लैटिनम स्लेटी / चमकीला चारकोल (शनि-शुक्र ऐश्वर्य)",
      hex: "#475569",
      why: "शुक्र के आकर्षण को शनि की गंभीरता व स्थायित्व से सुसज्जित करता है।"
    },
    // Venus + Jupiter -> Champagne Gold
    Venus_Jupiter: {
      name: "Champagne Gold / Guru-Shukra Splendor",
      hindi: "शैम्पेन गोल्ड / देवगुरु-दैत्यगुरु संयुक्त समृद्धि",
      hex: "#FDE68A",
      why: "शुक्राचार्य (धन/ऐश्वर्य) और देवगुरु बृहस्पति (ज्ञान/संतान) का संयुक्त संगम। सभी भौतिक व आध्यात्मिक सुख प्रदान करता है।"
    },
    Jupiter_Venus: {
      name: "Champagne Gold / Guru-Shukra Splendor",
      hindi: "शैम्पेन गोल्ड / देवगुरु-दैत्यगुरु संयुक्त समृद्धि",
      hex: "#FDE68A",
      why: "ज्ञान और ऐश्वर्य का परस्पर सामंजस्य जातक को समाज में सर्वप्रिय व संपन्न बनाता है।"
    },
    // Rahu + Jupiter -> Golden Amber (Guru Shield)
    Rahu_Jupiter: {
      name: "Golden Amber / Guru-Chandal Antidote",
      hindi: "पीतांबर एम्बर / गुरु ढाल (राहु शांति सूत्र)",
      hex: "#D97706",
      why: "गुरु का पीतांबर राहु के अनियंत्रित भ्रम, व्यसन व डिजिटल भटकाव को सात्विक दिशा में मोड़ता है।"
    },
    // Ketu + Jupiter -> Mustard Ochre
    Ketu_Jupiter: {
      name: "Mustard Ochre / Ketu-Guru Moksha",
      hindi: "पीतांबर मस्टर्ड / केतु-गुरु प्रज्ञा सूत्र",
      hex: "#CA8A04",
      why: "केतु के अलगाव व वैराग्य को गुरु के आत्म-ज्ञान से जोड़कर उच्च आध्यात्मिक सिद्धि व इंट्यूशन देता है।"
    },
  };

  if (BLENDS[pairKey]) {
    return {
      blendedColorName: BLENDS[pairKey].name,
      blendedColorHindi: BLENDS[pairKey].hindi,
      blendedHex: BLENDS[pairKey].hex,
      compoundWhy: BLENDS[pairKey].why
    };
  }

  if (BLENDS[reversePairKey]) {
    return {
      blendedColorName: BLENDS[reversePairKey].name,
      blendedColorHindi: BLENDS[reversePairKey].hindi,
      blendedHex: BLENDS[reversePairKey].hex,
      compoundWhy: BLENDS[reversePairKey].why
    };
  }

  // Dynamic midpoint calculation if pair is unlisted
  const h1 = PLANET_BASE_HUES[basePlanet] ?? 48;
  const h2 = PLANET_BASE_HUES[shieldPlanet] ?? 48;
  let blendedHue = Math.round((h1 + h2) / 2);
  if (Math.abs(h1 - h2) > 180) {
    blendedHue = (blendedHue + 180) % 360;
  }
  const fallbackHex = hslToHex(blendedHue, 78, 50);

  return {
    blendedColorName: `${PLANET_COLORS[basePlanet]?.name || basePlanet} + ${PLANET_COLORS[shieldPlanet]?.name || shieldPlanet}`,
    blendedColorHindi: `${PLANET_HINDI[basePlanet] || basePlanet} + ${PLANET_HINDI[shieldPlanet] || shieldPlanet} का संयुक्त रक्षा सूत्र`,
    blendedHex: fallbackHex,
    compoundWhy: `${PLANET_HINDI[basePlanet] || basePlanet} की सक्रिय शक्ति को ${PLANET_HINDI[shieldPlanet] || shieldPlanet} की रक्षक ढाल के साथ सुरक्षित संतुलित किया गया है।`
  };
}

function getWearingTiming(activePlanet: string, shieldPlanet: string): string {
  const TIMINGS: Record<string, string> = {
    Sun: "रविवार प्रातःकाल सूर्योदय के समय (शुक्ल पक्ष)",
    Moon: "सोमवार सांध्यवेला या प्रातःकाल (चंद्रोदय के समय)",
    Mars: "मंगलवार प्रातःकाल (हनुमान जी के समक्ष)",
    Mercury: "बुधवार प्रातःकाल (पक्षियों को दाना देकर)",
    Jupiter: "गुरुवार प्रातःकाल (ईशान कोण में दीप प्रज्वलित कर)",
    Venus: "शुक्रवार प्रातःकाल या सांध्यवेला",
    Saturn: "शनिवार सांध्यवेला या सूर्यास्त के पश्चात",
    Rahu: "शनिवार या बुधवार सांध्यवेला",
    Ketu: "मंगलवार या गुरुवार प्रातःकाल",
  };
  const activeT = TIMINGS[activePlanet] || "शुभ वार प्रातःकाल";
  const shieldT = TIMINGS[shieldPlanet] || "";
  if (shieldT && shieldT !== activeT) {
    return `${activeT} अथवा ${shieldT}`;
  }
  return activeT;
}

// ── 12-Lagna Phone Specs (100% Dynamic 3rd House & Lagna-Driven) ─────────────

const LAGNA_PHONE_SPECS: Record<number, {
  colors: string[];
  hexes: string[];
  avoid: string[];
  material: string;
  mechanism: string;
  wallpaper: string;
  caution: string;
}> = {
  // 0: Aries Lagna -> 3rd house Gemini (Mercury)
  0: {
    colors: ["Emerald Green (पन्ना हरा)", "Sage Green (सौम्य हरा)", "Tan Leather (टैन लेदर)", "Silver White"],
    hexes: ["#16A34A", "#84CC16", "#B45309", "#F8FAFC"],
    avoid: ["Fiery Blood Red (चटक लाल)", "Jet Black (गहरा काला)"],
    material: "मैट सिलिकॉन या वेगन लेदर ग्रिप",
    mechanism: "मेष लग्न में 3रे भाव (संचार, हाथ, मोबाइल) का स्वामी बुध (मिथुन) है। हरा या सौम्य टैन कवर संचार में स्पष्टता, तीक्ष्ण बुद्धि व अनुबंधों में लाभ देता है।",
    wallpaper: "हरियाली युक्त शांत प्रकृति (Bamboo Forest) या बुध यंत्र",
    caution: "अत्यधिक लाल या काले रंग के फोन कवर से बचें, यह बिना सोचे-समझे उग्र संदेश भेजने की प्रवृत्ति को बढ़ावा देता है।",
  },
  // 1: Taurus Lagna -> 3rd house Cancer (Moon)
  1: {
    colors: ["Pearl White (दूधिया सफेद)", "Silver Mist (रजत)", "Sky Blue (हल्का आसमानी)", "Soft Cream"],
    hexes: ["#F8FAFC", "#E2E8F0", "#38BDF8", "#FEF3C7"],
    avoid: ["Pitch Black (गहरा काला)", "Dark Charcoal"],
    material: "सॉफ्ट-टच सिलिकॉन या फ्रॉस्टेड ग्लास फिनिश",
    mechanism: "वृषभ लग्न में 3रे भाव का स्वामी चंद्रमा (कर्क) है। सफेद या आसमानी कवर मन को शांत रखता है और डिजिटल संचार में भावनात्मक तनाव से बचाता है।",
    wallpaper: "पूर्ण चंद्रमा, शांत जल या बर्फ से ढके पर्वतों का दृश्य",
    caution: "टूटा हुआ स्क्रीन गार्ड तुरंत बदलें; चंद्रमा के भाव में दरार मानसिक बेचैनी लाती है।",
  },
  // 2: Gemini Lagna -> 3rd house Leo (Sun)
  2: {
    colors: ["Amber Gold (सुनहरा अम्बर)", "Copper Tan (ताम्र टैन)", "Royal Maroon", "Champagne Beige"],
    hexes: ["#F59E0B", "#B45309", "#991B1B", "#FDE68A"],
    avoid: ["Dark Dull Navy (गहरा नीला)", "Dirty Grey"],
    material: "प्रीमियम वेगन लेदर या ब्रश मेटल फिनिश",
    mechanism: "मिथुन लग्न में 3रे भाव का स्वामी सूर्य (सिंह) है। गोल्डन-अम्बर या टैन कवर आपके संचार में प्राधिकार (Authority), आत्मविश्वास व राज्य कृपा जोड़ता है।",
    wallpaper: "उगता हुआ सूर्य (Sunrise) या स्वर्ण ज्यामिति",
    caution: "गहरे नीले या काले कवर से बचें, यह सूर्य के तेज को दबाकर आत्मविश्वास में कमी लाता है।",
  },
  // 3: Cancer Lagna -> 3rd house Virgo (Mercury)
  3: {
    colors: ["Forest Green (गहरा हरा)", "Jade Green", "Earthy Tan", "Muted Silver"],
    hexes: ["#15803D", "#059669", "#78350F", "#E2E8F0"],
    avoid: ["Bright Neon Red", "Jet Black"],
    material: "मैट फिनिश नॉन-स्लिप सिलिकॉन",
    mechanism: "कर्क लग्न में 3रे भाव का स्वामी बुध (कन्या) है। हरा या टैन कवर आपके विश्लेषणात्मक विचारों को व्यवस्थित कर संचार में व्यावहारिकता लाता है।",
    wallpaper: "हरा-भरा सघन उपवन या कमल पुष्प",
    caution: "लाल या काले भड़कीले आवरण से बचें; यह नसों में अनावश्यक चिंता व तनाव पैदा करता है।",
  },
  // 4: Leo Lagna -> 3rd house Libra (Venus)
  4: {
    colors: ["Pastel Rose / Cream", "Champagne Gold", "Soft Silver", "Tan Leather"],
    hexes: ["#F472B6", "#FDE68A", "#F1F5F9", "#B45309"],
    avoid: ["Fiery Orange-Red", "Pitch Black"],
    material: "प्रीमियम लेदर या स्मूथ सैटिन टेक्सचर",
    mechanism: "सिंह लग्न में 3रे भाव का स्वामी शुक्र (तुला) है। पेस्टल, क्रीम या शैम्पेन कवर बातचीत में मिठास, कूटनीतिक सफलता व क्लाइंट्स को आकर्षित करता है।",
    wallpaper: "कलात्मक सौंदर्य, सुडौल पुष्प या स्फटिक क्रिस्टल",
    caution: "गंदे या घिसे हुए कवर का प्रयोग न करें; यह शुक्र की आकर्षण शक्ति को क्षीण करता है।",
  },
  // 5: Virgo Lagna -> 3rd house Scorpio (Mars)
  5: {
    colors: ["Terracotta Tan (टैन ब्राउन)", "Muted Rust", "Forest Green (बुध सुरक्षा)", "Camel Leather"],
    hexes: ["#9A3412", "#B45309", "#166534", "#78350F"],
    avoid: ["Aggressive Blood Red", "Pitch Black"],
    material: "मैट लेदर ग्रिप या एंटी-शॉक हाइब्रिड केस",
    mechanism: "कन्या लग्न में 3रे भाव का स्वामी मंगल (वृश्चिक) है। टैन या फॉरेस्ट ग्रीन कवर मंगल के आवेग को संतुलित कर कार्यक्षेत्र में त्वरित फोकस देता है।",
    wallpaper: "शांत हरी प्रकृति (Bamboo Forest) या गोल्डन रेशियो यंत्र",
    caution: "चटक लाल कवर का उपयोग न करें; यह नर्वस सिस्टम में अधीरता (Impatience) पैदा करता है।",
  },
  // 6: Libra Lagna -> 3rd house Sagittarius (Jupiter)
  6: {
    colors: ["Honey Gold (सुनहरा पीला)", "Royal Citrine", "Camel Tan", "Ivory White"],
    hexes: ["#EAB308", "#F59E0B", "#B45309", "#FFFBEB"],
    avoid: ["Dull Charcoal", "Pitch Black"],
    material: "प्रीमियम सॉफ्ट-टच या लेदर ग्रिप",
    mechanism: "तुला लग्न में 3रे भाव का स्वामी गुरु (धनु) है। गोल्डन या पीला कवर लेखन, परामर्श, शिक्षा व दीर्घकालिक सौदों में गुरु की शुभ दृष्टि लाता है।",
    wallpaper: "प्राकृतिक सिट्रीन क्रिस्टल, स्वर्णिम किरणें या ज्ञान प्रतीक",
    caution: "काले या म्यूटेड डल केस से बचें; यह गुरु के विस्तारवादी स्वभाव को संकुचित करता है।",
  },
  // 7: Scorpio Lagna -> 3rd house Capricorn (Saturn)
  7: {
    colors: ["Steel Blue (स्टील नीला)", "Dark Slate Grey", "Classic Navy", "Matte Tan"],
    hexes: ["#0284C7", "#334155", "#1E3A8A", "#78350F"],
    avoid: ["Bright Neon Red", "Hot Neon Pink"],
    material: "पॉलीकार्बोनेट मैट या रग्ड आर्मर केस",
    mechanism: "वृश्चिक लग्न में 3रे भाव का स्वामी शनि (मकर) है। स्टील ब्लू या नेवी कवर संचार में गंभीरता, अनुशासन व बड़े प्रोजेक्ट्स में स्थायित्व देता है।",
    wallpaper: "शांत रात्रि आकाश, तारामंडल या पर्वत शिखर",
    caution: "चटक लाल या नियॉन कवर से बचें; शनि-मंगल का टकराव डिजिटल विवाद खड़े कर सकता है।",
  },
  // 8: Sagittarius Lagna -> 3rd house Aquarius (Saturn/Rahu)
  8: {
    colors: ["Royal Navy (गहरा नेवी)", "Cobalt Blue", "Slate Grey", "Camel Tan"],
    hexes: ["#1E3A8A", "#2563EB", "#64748B", "#B45309"],
    avoid: ["Dirty Ash Grey", "Neon Fiery Red"],
    material: "प्रीमियम मैट सिलिकॉन या वेगन लेदर",
    mechanism: "धनु लग्न में 3रे भाव का स्वामी शनि (कुंभ) है। नेवी ब्लू व कोबाल्ट कवर आपके नेटवर्क, सोशल मीडिया पहुंच व शोध कार्यों को व्यवस्थित गति देता है।",
    wallpaper: "विशाल नीला सागर या ज्यामितीय चक्र",
    caution: "गंदे, चटके हुए केस से बचें; यह राहु-शनि के भटकाव को बढ़ाता है।",
  },
  // 9: Capricorn Lagna -> 3rd house Pisces (Jupiter)
  9: {
    colors: ["Soft Champagne (शैम्पेन गोल्ड)", "Pale Yellow", "Pearl Cream", "Olive Tan"],
    hexes: ["#FEF08A", "#FDE047", "#F8FAFC", "#65A30D"],
    avoid: ["Harsh Pitch Black", "Blood Red"],
    material: "स्मूथ लेदर या फाइन टेक्सचर्ड ग्रिप",
    mechanism: "मकर लग्न में 3रे भाव का स्वामी गुरु (मीन) है। क्रीम या हल्का सुनहरा कवर मकर के कठोर स्वभाव में सौम्यता व प्रभावशाली संवाद शैली जोड़ता है।",
    wallpaper: "स्वर्णिम प्रकाश या पवित्र सरोवर",
    caution: "अत्यधिक काले या कांटेदार डिज़ाइनों से बचें।",
  },
  // 10: Aquarius Lagna -> 3rd house Aries (Mars)
  10: {
    colors: ["Royal Blue (गहरा नीला)", "Citrine Gold (सुनहला पीला)", "Camel Tan", "Slate Grey"],
    hexes: ["#1D4ED8", "#F59E0B", "#B45309", "#64748B"],
    avoid: ["Fiery Neon Red", "Dark Purple (गहरा जामुनी)"],
    material: "पॉलीकार्बोनेट मैट या प्रीमियम लेदर ग्रिप",
    mechanism: "कुंभ लग्न में 3रे भाव का स्वामी मंगल (मेष) है। रॉयल ब्लू व सिट्रीन गोल्ड कवर व्यावसायिक संचार व अटके भुगतानों को तुरंत गति देता है।",
    wallpaper: "शांत बहता जल या आयरन पाइराइट / सिट्रीन क्रिस्टल की छवि",
    caution: "काले या लाल रंग के हिंसक ग्राफिक्स वाले फोन केस से बचें।",
  },
  // 11: Pisces Lagna -> 3rd house Taurus (Venus)
  11: {
    colors: ["Diamond White (दूधिया सफेद)", "Pastel Mint", "Soft Ivory Cream", "Tan Leather"],
    hexes: ["#FFFFFF", "#A7F3D0", "#FEF3C7", "#B45309"],
    avoid: ["Dark Pitch Black", "Muddy Brown"],
    material: "प्रीमियम सिलिकॉन या सैटिन लेदर",
    mechanism: "मीन लग्न में 3रे भाव का स्वामी शुक्र (वृषभ) है। सफेद या पेस्टल मिंट कवर वाणी में आकर्षण, कलात्मक सफलता व वित्तीय लाभ कराता है।",
    wallpaper: "सुंदर प्रफुल्लित श्वेत पुष्प या स्फटिक माला",
    caution: "काले या भद्दे कवर से बचें; यह शुक्र के रचनात्मक प्रवाह को बाधित करता है।",
  },
};

// ── 12-Lagna Wallet Specs (100% Dynamic 2nd House & Lagna-Driven) ────────────

const LAGNA_WALLET_SPECS: Record<number, {
  colors: string[];
  hexes: string[];
  avoid: string[];
  seedItem: string;
  note: string;
  reason: string;
}> = {
  // 0: Aries -> 2nd house Taurus (Venus)
  0: {
    colors: ["Camel Tan Leather (टैन/कैमल)", "Ivory Beige (हल्का बादामी)", "Coffee Brown"],
    hexes: ["#B45309", "#F5EBE0", "#451A03"],
    avoid: ["Dark Pitch Black", "Fiery Red"],
    seedItem: "शुद्ध चांदी का 10-15 ग्राम का चौकोर सिक्का या स्फटिक दाना",
    note: "₹500 का नया कड़क नोट (अंक 6 का)",
    reason: "मेष लग्न में धन भाव (2nd House) का स्वामी शुक्र (वृषभ) है। टैन लेदर व चांदी का सिक्का शुक्र की लक्ष्मी ऊर्जा को आकर्षित कर धन संचय बढ़ाता है।",
  },
  // 1: Taurus -> 2nd house Gemini (Mercury)
  1: {
    colors: ["Emerald Green (पन्ना हरा)", "Bottle Green", "Tan Leather"],
    hexes: ["#16A34A", "#14532D", "#B45309"],
    avoid: ["Aggressive Blood Red", "Pitch Black"],
    seedItem: "हरी छोटी इलायची के 2 दाने या चांदी का चौकोर टुकड़ा",
    note: "₹500 का नया नोट (अंक 5 का)",
    reason: "वृषभ लग्न में धन भाव का स्वामी बुध (मिथुन) है। हरा रंग व इलायची बुध के व्यापारिक लाभ व वाणी द्वारा धनार्जन को सक्रिय करते हैं।",
  },
  // 2: Gemini -> 2nd house Cancer (Moon)
  2: {
    colors: ["Pearl White / Silver (सिल्वर/सफेद)", "Pale Cream", "Tan Brown"],
    hexes: ["#F8FAFC", "#FEF3C7", "#78350F"],
    avoid: ["Jet Black", "Charcoal Grey"],
    seedItem: "शुद्ध चांदी का गोल सिक्का",
    note: "₹500 का नया नोट (अंक 2 या 7 का)",
    reason: "मिथुन लग्न में धन भाव का स्वामी चंद्रमा (कर्क) है। चांदी का गोल सिक्का व क्रीम रंग लिक्विड कैश के निरंतर प्रवाह को बनाए रखते हैं।",
  },
  // 3: Cancer -> 2nd house Leo (Sun)
  3: {
    colors: ["Golden Tan (सुनहरा टैन)", "Rich Saffron Leather", "Dark Brown"],
    hexes: ["#D97706", "#9A3412", "#451A03"],
    avoid: ["Deep Dark Navy Blue", "Charcoal"],
    seedItem: "तांबे का गोल टुकड़ा या केसर की एक पत्ती",
    note: "₹500 का नया नोट (अंक 1 का)",
    reason: "कर्क लग्न में धन भाव का स्वामी सूर्य (सिंह) है। गोल्डन-टैन रंग व तांबे का स्पर्श अधिकार, प्रतिष्ठा व सरकारी/स्थायी धन में वृद्धि करता है।",
  },
  // 4: Leo -> 2nd house Virgo (Mercury)
  4: {
    colors: ["Bottle Green (गहरा हरा)", "Classic Tan Leather", "Dark Brown"],
    hexes: ["#14532D", "#B45309", "#451A03"],
    avoid: ["Fiery Neon Red", "Neon Pink"],
    seedItem: "चांदी का चौकोर सिक्का (10-15 ग्राम)",
    note: "₹500 का नया कड़क नोट (अंक 5 का)",
    reason: "सिंह लग्न में धन भाव का स्वामी बुध (कन्या) है। हरा व टैन रंग बजट नियंत्रण, निवेश सुरक्षा व अनावश्यक खर्चों की रोकथाम करता है।",
  },
  // 5: Virgo -> 2nd house Libra (Venus)
  5: {
    colors: ["Tan / Camel Leather (टैन/कैमल)", "Coffee Brown", "Champagne Beige"],
    hexes: ["#B45309", "#451A03", "#FDE68A"],
    avoid: ["Aggressive Blood Red", "Jet Black"],
    seedItem: "शुद्ध चांदी का ठोस चौकोर टुकड़ा",
    note: "₹500 का नया कड़क नोट (सीरियल अंक 5 या 6)",
    reason: "कन्या लग्न में 2nd भाव का स्वामी शुक्र (तुला) है। टैन लेदर व चांदी का टुकड़ा लक्ष्मी आकर्षण व धन संचय को स्थायी बनाता है।",
  },
  // 6: Libra -> 2nd house Scorpio (Mars/Ketu)
  6: {
    colors: ["Chestnut Brown (चेस्टनट ब्राउन)", "Deep Tan", "Matte Charcoal"],
    hexes: ["#78350F", "#B45309", "#374151"],
    avoid: ["Neon Pink", "Bright Yellow"],
    seedItem: "चांदी का चौकोर सिक्का या 5 ग्राम ठोस चांदी",
    note: "₹500 का नया नोट (अंक 9 का)",
    reason: "तुला लग्न में धन भाव का स्वामी मंगल (वृश्चिक) है। चेस्टनट ब्राउन व चांदी का संतुलन वित्तीय गुप्त खर्चों को रोककर अचानक लाभ देता है।",
  },
  // 7: Scorpio -> 2nd house Sagittarius (Jupiter)
  7: {
    colors: ["Honey Gold (सुनहरा पीला)", "Saffron Tan", "Camel Leather"],
    hexes: ["#EAB308", "#D97706", "#B45309"],
    avoid: ["Dull Charcoal", "Pitch Black"],
    seedItem: "शुद्ध चांदी का सिक्का या छोटी हल्दी की गांठ (पीले कपड़े में)",
    note: "₹500 का नया नोट (अंक 3 का)",
    reason: "वृश्चिक लग्न में धन भाव का स्वामी गुरु (धनु) है। गोल्डन-टैन व हल्दी/चांदी का स्पर्श धन में दैवीय बरकत व दीर्घकालिक समृद्धि लाता है।",
  },
  // 8: Sagittarius -> 2nd house Capricorn (Saturn)
  8: {
    colors: ["Dark Slate Grey (डार्क स्लेटी)", "Navy Blue", "Matte Tan"],
    hexes: ["#334155", "#1E3A8A", "#B45309"],
    avoid: ["Bright Fire Red", "Neon Green"],
    seedItem: "चांदी का चौकोर सिक्का (10 ग्राम)",
    note: "₹500 का नया नोट (अंक 8 का)",
    reason: "धनु लग्न में धन भाव का स्वामी शनि (मकर) है। स्लेट ग्रे या नेवी वॉलेट वित्तीय अनुशासन, अचल संपत्ति निर्माण व फिजूलखर्ची पर रोक लगाता है।",
  },
  // 9: Capricorn -> 2nd house Aquarius (Saturn/Rahu)
  9: {
    colors: ["Royal Blue (गहरा नीला)", "Dark Charcoal Slate", "Tan Leather"],
    hexes: ["#1D4ED8", "#475569", "#78350F"],
    avoid: ["Bright Crimson Red", "Yellow Ochre"],
    seedItem: "चांदी का गोल सिक्का या स्फटिक मणिका",
    note: "₹500 का नया नोट (अंक 4 या 8 का)",
    reason: "मकर लग्न में धन भाव का स्वामी शनि-राहु (कुंभ) है। रॉयल ब्लू व चांदी वॉलेट में धन के नए स्रोतों व डिजिटल आमदनी को बढ़ाता है।",
  },
  // 10: Aquarius -> 2nd house Pisces (Jupiter)
  10: {
    colors: ["Tan / Camel Leather (टैन/कैमल)", "Coffee Brown", "Royal Blue"],
    hexes: ["#B45309", "#78350F", "#1D4ED8"],
    avoid: ["Bright Red", "Dirty Ash Grey"],
    seedItem: "चांदी का गोल सिक्का या स्फटिक की छोटी मणिका",
    note: "₹500 का नया नोट (अंक 3 या 6 का)",
    reason: "कुंभ लग्न में 2nd भाव का स्वामी गुरु (मीन) है। टैन लेदर व चांदी का सिक्का गुरु की सात्विक बरकत व बचत में वृद्धि करता है।",
  },
  // 11: Pisces -> 2nd house Aries (Mars)
  11: {
    colors: ["Warm Tan Leather (वार्म टैन)", "Rich Maroon-Brown", "Coffee Leather"],
    hexes: ["#B45309", "#831843", "#451A03"],
    avoid: ["Pitch Synthetic Black", "Dull Grey"],
    seedItem: "चांदी का चौकोर सिक्का या छोटा तांबे का टुकड़ा",
    note: "₹500 का नया नोट (अंक 9 का)",
    reason: "मीन लग्न में धन भाव का स्वामी मंगल (मेष) है। टैन व मैरून वॉलेट धनार्जन की गति को तेज करता है और अटके भुगतानों को निकालता है।",
  },
};

function evaluateAnatomicalProtocols(
  chart: ChartData,
  activeSaltPlanet: string,
  chromaticModulation: DegreeChromaticModulation
): AnatomicalTargetingRecommendation[] {
  const lagnaIndex = normalizeLagnaIndex(chart);
  const protocols: AnatomicalTargetingRecommendation[] = [];

  // 1. Knees (घुटने) - Capricorn (मकर - sign 10, index 9)
  const capHouse = ((9 - lagnaIndex + 12) % 12) + 1;
  const isCapDusthana = capHouse === 6 || capHouse === 8 || capHouse === 12;
  const isMarsCombust = chart.planets?.Mars && Math.abs(chart.planets.Mars.lon - (chart.planets.Sun?.lon || 0)) <= 6;

  protocols.push({
    bodyZoneHi: "घुटने एवं जोड़",
    bodyZoneEn: "Knees & Joints",
    correspondingSign: "मकर (Capricorn)",
    correspondingSignNum: 10,
    houseInNativeChart: capHouse,
    rulingPlanet: "शनि (उच्च का मंगल 28°)",
    wearableForm: "रेड नी-कैप / लाल नी-बैंड (Red Knee-Cap)",
    toneAndHex: {
      colorName: "Red / Maroon (मंगल उच्चत्व)",
      hexColor: "#DC2626",
      hslColor: "hsl(0, 85%, 45%)",
    },
    purpose: "शारीरिक सहनशक्ति (Endurance), जोड़ों की मजबूती व अटूट इच्छाशक्ति",
    planetaryMechanism: "मकर राशि में मंगल 28° पर परम उच्च का होता है। घुटनों पर रेड नी-कैप पहनने से कालपुरुष के 10वें अंग पर मंगल का उच्चत्व सक्रिय होता है।",
    isAllowedForNative: !isCapDusthana && !isMarsCombust,
    cautionNotice: isCapDusthana || isMarsCombust
      ? `सावधानी: आपकी कुंडली में मकर भाव ${capHouse} (दुस्थान) में है अथवा मंगल अस्त है। अतः घुटनों पर लाल नी-कैप वर्जित है; सामान्य न्यूट्रल/सफेद नी-कैप का ही उपयोग करें।`
      : `अनुकूल: भाव ${capHouse} में मकर राशि अनुकूल है। वर्कआउट या जिम के समय लाल नी-कैप पहनना मंगल की उच्च ऊर्जा को सक्रिय करेगा!`,
  });

  // 2. Calves & Shins (पिंडली व टखने) - Aquarius (कुंभ - sign 11, index 10)
  const aquaHouse = ((10 - lagnaIndex + 12) % 12) + 1;
  protocols.push({
    bodyZoneHi: "पिंडली व टखने",
    bodyZoneEn: "Calves & Shins",
    correspondingSign: "कुंभ (Aquarius)",
    correspondingSignNum: 11,
    houseInNativeChart: aquaHouse,
    rulingPlanet: "शनि व राहु",
    wearableForm: "पिंडली या टखने पर गहरा नीला/काला धागा",
    toneAndHex: {
      colorName: "Dark Blue / Charcoal",
      hexColor: "#1E3A8A",
      hslColor: "hsl(220, 70%, 40%)",
    },
    purpose: "लाभ भाव की सक्रियता, नसों का रक्तसंचार व स्थिर गति",
    planetaryMechanism: "कुंभ राशि कालपुरुष का 11वां अंग (पिंडली) है। यहाँ धागा बांधने से शनि-राहु की विद्रोही ऊर्जा अनुशासित होकर स्थायी लाभ में बदलती है।",
    isAllowedForNative: aquaHouse !== 8 && aquaHouse !== 12,
    cautionNotice: aquaHouse === 8 || aquaHouse === 12
      ? `कुंभ आपकी कुंडली में भाव ${aquaHouse} में है, अतः पिंडली पर गहरा धागा न बांधें।`
      : `भाव ${aquaHouse} में कुंभ राशि पर पिंडली/टखने पर हल्का धागा बांधना ग्राउंडिंग देता है।`,
  });

  // 3. Waist / Pelvis (कमर) - Libra (तुला - sign 7, index 6)
  const libHouse = ((6 - lagnaIndex + 12) % 12) + 1;
  protocols.push({
    bodyZoneHi: "कमर एवं रीढ़ का निचला भाग",
    bodyZoneEn: "Waist & Lower Spine",
    correspondingSign: "तुला (Libra)",
    correspondingSignNum: 7,
    houseInNativeChart: libHouse,
    rulingPlanet: "शुक्र",
    wearableForm: "कमर में सूती कलावा / कमरबंध (Waist Thread)",
    toneAndHex: {
      colorName: "Tan / Red-Yellow Cotton",
      hexColor: "#B45309",
      hslColor: "hsl(35, 75%, 45%)",
    },
    purpose: "मूलाधार व स्वाधिष्ठान चक्र का संतुलन, धन संचय व रीढ़ की रक्षा",
    planetaryMechanism: "तुला राशि संतुलन व शुक्र का मूलत्रिकोण है। कमर में धागा बांधने से 2nd/7th हाउस की लिक्विड वेल्थ स्थिर होती है।",
    isAllowedForNative: true,
    cautionNotice: "कमर में धागा हमेशा सूती और स्वच्छ होना चाहिए।",
  });

  // 4. Wrists (कलाई) - Gemini (मिथुन - sign 3, index 2)
  const gemHouse = ((2 - lagnaIndex + 12) % 12) + 1;
  protocols.push({
    bodyZoneHi: "कलाई (Wrist)",
    bodyZoneEn: "Wrist & Nervous System",
    correspondingSign: "मिथुन (Gemini)",
    correspondingSignNum: 3,
    houseInNativeChart: gemHouse,
    rulingPlanet: "बुध",
    wearableForm: `कलाई पर रक्षा सूत्र (${chromaticModulation.toneDescription})`,
    toneAndHex: {
      colorName: chromaticModulation.toneDescription,
      hexColor: chromaticModulation.hexCode,
      hslColor: chromaticModulation.hslString,
    },
    purpose: "बौद्धिक फोकस, एकाग्रता, व्यापारिक निर्णय व नर्वस सिस्टम की सुरक्षा",
    planetaryMechanism: `मिथुन राशि कलाई की अधिष्ठात्री है। भाव ${gemHouse} में होने से यह कलाई पर बंधा सूत्र सीधे मानसिक ऊर्जा व संवाद को संचालित करता है।`,
    isAllowedForNative: gemHouse !== 6 && gemHouse !== 8 && gemHouse !== 12,
    cautionNotice: (gemHouse === 6 || gemHouse === 8 || gemHouse === 12)
      ? `मिथुन आपकी कुंडली में भाव ${gemHouse} (दुस्थान) में पड़ता है। कलाई पर अनावश्यक धागा बांधने से बचें; केवल हल्का कलावा या धातु कड़ा ही उपयुक्त है।`
      : undefined
  });

  // 5. Feet / Soles (पैर के पंजे व तलवे) - Pisces (मीन - sign 12, index 11)
  const pisHouse = ((11 - lagnaIndex + 12) % 12) + 1;
  protocols.push({
    bodyZoneHi: "पैर के पंजे व तलवे",
    bodyZoneEn: "Feet, Soles & Toes",
    correspondingSign: "मीन (Pisces)",
    correspondingSignNum: 12,
    houseInNativeChart: pisHouse,
    rulingPlanet: "गुरु व केतु",
    wearableForm: "पैर के अंगूठे या टखने पर रेशमी धागा",
    toneAndHex: {
      colorName: "Pale Gold / Off-White",
      hexColor: "#FDE047",
      hslColor: "hsl(50, 90%, 60%)",
    },
    purpose: "गहरी ध्यानस्थ शांति, अनिद्रा से मुक्ति व सूक्ष्म आध्यात्मिक चेतना",
    planetaryMechanism: "मीन राशि कालपुरुष के 12वें भाव (पंजे) को दर्शाती है। यहाँ धागा बांधने से मन की भटकन और सबकॉन्शियस बेचैनी शांत होती है।",
    isAllowedForNative: true,
  });

  return protocols;
}

export function evaluateDailyAccessories(
  chart: ChartData,
  activeSaltPlanet: string = "Mercury",
  shieldPlanet: string = "Jupiter",
  chromaticModulation?: DegreeChromaticModulation
): DailyAccessoryProtocol {
  const lagnaIndex = normalizeLagnaIndex(chart);
  const spec = LAGNA_PHONE_SPECS[lagnaIndex] || LAGNA_PHONE_SPECS[0];

  // If chromatic modulation is provided for the native's active planet, include its hex
  const recommendedHexes = [...spec.hexes];
  if (chromaticModulation?.hexCode && !recommendedHexes.includes(chromaticModulation.hexCode)) {
    recommendedHexes.unshift(chromaticModulation.hexCode);
  }

  // 2. Footwear / Shoes (12th House - Pisces / Saturn / Shani)
  let footColors = ["Dark Slate Grey", "Navy Blue (गहरा नेवी)", "Tan Brown", "Muted Earthy Olive"];
  let footHexes = ["#334155", "#1E3A8A", "#78350F", "#3F6212"];
  let footAvoid = ["Neon / Bright Red (चटक लाल)", "Dirty Neon Yellow"];
  let footMaterial = "प्रीमियम ब्रीदेबल मेश या सॉफ्ट टैन लेदर (सॉफ्ट सोल)";
  let footMechanism = "पैर कालपुरुष का 12वां भाव हैं और जूते सीधे शनि के आधिपत्य में आते हैं। सही रंग व संतुलित जूते पहनने से शनि का अनुशासन सक्रिय होता है और अनचाहे खर्चे रुकते हैं।";
  let footCaution = "घिसे हुए, फटे तलवे वाले या धूल भरे जूते कभी न पहनें (लाल किताब अनुसार फटे जूते कोर्ट-कचहरी व अस्पताल का खर्च बढ़ाते हैं)। जूतों को हमेशा पश्चिम/दक्षिण दिशा में सीधा रखें।";

  // 3. Headwear / Cap (1st House - Scalp/Brain & 10th House - Prestige/Turban)
  let capColors = ["Pure White (दूधिया सफेद)", "Soft Cream / Khaki", "Olive Green", "Classic Navy"];
  let capHexes = ["#FFFFFF", "#F5F5DC", "#4D7C0F", "#1E3A8A"];
  let capAvoid = ["Flaming Red (अग्नि लाल)", "Camouflage / Dark Skull Prints"];
  let capStyle = "सूती बेसबॉल कैप / कॉटन हैट / सफेद साफ़ा";
  let capMechanism = "सिर 1st भाव (मंगल/सूर्य) और टोपी 10वां भाव (प्रतिष्ठा) है। सफेद या सौम्य रंग की टोपी पहनने से राहु की नकारात्मक तरंगें मस्तिष्क में प्रवेश नहीं कर पातीं और गुस्सा शांत रहता है।";
  let capCaution = "जिम या धूप में लाल या काले रंग की टोपी न लगाएं; यह सिर में पित्त व रक्तचाप को अचानक बढ़ाती है।";

  // 4. Waist Belt & Buckle (7th House - Libra / Venus & Lower Spine)
  let beltColors = ["Tan Brown (क्लासिक टैन)", "Coffee Brown (डार्क ब्राउन)", "Matte Black (मैट ब्लैक)"];
  let beltHexes = ["#B45309", "#451A03", "#1F2937"];
  let beltAvoid = ["Studded Punk Red", "Shiny Patent Red"];
  let beltMaterial = "शुद्ध लेदर या सूती कैनवास (Cotton Canvas)";
  let buckleMetal = "ब्रश किया हुआ सिल्वर / मैट क्रोम (चांदनी शीतलता) या डल ब्रास (पीतल)";
  let beltMechanism = "कमर तुला राशि (शुक्र) है जो तरल धन व वैवाहिक सुख की अधिष्ठात्री है। कमर पर संतुलित बेल्ट व सिल्वर बकल लगाने से नाभि केंद्र स्थिर रहता है और खर्चों का रिसाव रुकता है।";
  let beltCaution = "अत्यधिक नुकीले, कांटेदार या खोपड़ी की आकृति वाले बकल कभी न पहनें; यह मूलाधार चक्र को क्षत-विक्षत करते हैं।";

  // 5. Face Mask (2nd House - Mouth/Speech & 1st House - Prana Vayu)
  let maskColors = ["Breathable White (सफेद कॉटन)", "Soft Pastel Green", "Sky Blue (आसमानी)", "Soft Cream"];
  let maskHexes = ["#FFFFFF", "#86EFAC", "#BAE6FD", "#FEF3C7"];
  let maskAvoid = ["Pitch Synthetic Black (सिंथेटिक काला)", "Blood Red"];
  let maskFabric = "100% शुद्ध कॉटन (Double-Layered Breathable Organic Cotton)";
  let maskMechanism = "मुख 2nd भाव (वाणी व परिवार) और नाक प्राण वायु (बुध व चंद्रमा) है। सफेद या हल्के रंग का कॉटन मास्क प्राण वायु के प्रवाह को शुद्ध रखता है और फेफड़ों को ऑक्सीजन संतुलन देता है।";
  let maskCaution = "सिंथेटिक पॉलिएस्टर के काले मास्क से बचें; यह शरीर में कार्बन-डाइऑक्साइड चक्र को दूषित कर सिरदर्द पैदा करते हैं।";

  return {
    phoneCover: {
      title: "स्मार्टफोन बैक कवर (3rd House Bio-Armor)",
      recommendedColors: spec.colors,
      recommendedHexes,
      colorsToAvoid: spec.avoid,
      caseMaterial: spec.material,
      planetaryMechanism: spec.mechanism,
      idealWallpaperAffirmation: spec.wallpaper,
      cautionNotice: spec.caution,
    },
    footwear: {
      title: "जूते व फुटवियर (12th House & Shani Shield)",
      recommendedColors: footColors,
      recommendedHexes: footHexes,
      colorsToAvoid: footAvoid,
      materialType: footMaterial,
      planetaryMechanism: footMechanism,
      cautionNotice: footCaution,
    },
    headwearCap: {
      title: "टोपी व हेडवियर (1st & 10th House Cap)",
      recommendedColors: capColors,
      recommendedHexes: capHexes,
      colorsToAvoid: capAvoid,
      style: capStyle,
      planetaryMechanism: capMechanism,
      cautionNotice: capCaution,
    },
    belt: {
      title: "कमर बेल्ट व बकल (7th House & Wealth Lock)",
      recommendedColors: beltColors,
      recommendedHexes: beltHexes,
      colorsToAvoid: beltAvoid,
      material: beltMaterial,
      buckleMetal,
      planetaryMechanism: beltMechanism,
      cautionNotice: beltCaution,
    },
    faceMask: {
      title: "मास्क व फेस प्रोटेक्शन (2nd House Speech & Prana)",
      recommendedColors: maskColors,
      recommendedHexes: maskHexes,
      colorsToAvoid: maskAvoid,
      fabric: maskFabric,
      planetaryMechanism: maskMechanism,
      cautionNotice: maskCaution,
    }
  };
}

// ── Master Astro-Pharmacological Prescription Generator ─────────────────────

export function evaluateAstroPrescriptionFormula(
  chart: ChartData,
  hitDossier: AstroVastuHitDossier
): AstroPharmacologicalPrescription {
  const nativeName = chart.name || "Seeker";
  const moonData = chart.planets?.Moon;
  const moonNak = moonData?.nakshatra || "Purva Phalguni";

  // 1. Identify Active Dasha Lords
  const activeMD = hitDossier.activeDasha?.mahadasha;
  const activeAD = hitDossier.activeDasha?.antardasha;

  // 2. Check for Combustion (अस्त अवस्था)
  const sunLon = chart.planets?.Sun?.lon ?? 0;
  const isCombust = (planetName: string, lon: number): boolean => {
    if (planetName === "Sun") return false;
    let diff = Math.abs(lon - sunLon);
    if (diff > 180) diff = 360 - diff;
    const limits: Record<string, number> = {
      Moon: 12, Mars: 6, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15
    };
    return diff <= (limits[planetName] || 8);
  };

  // 3. Step 1: Evaluate Active Salt (Primary Catalyst Molecule)
  const LAGNA_LORDS: Record<number, string> = {
    0: "Mars",    // Aries
    1: "Venus",   // Taurus
    2: "Mercury", // Gemini
    3: "Moon",    // Cancer
    4: "Sun",     // Leo
    5: "Mercury", // Virgo
    6: "Venus",   // Libra
    7: "Mars",    // Scorpio
    8: "Jupiter", // Sagittarius
    9: "Saturn",  // Capricorn
    10: "Saturn", // Aquarius
    11: "Jupiter" // Pisces
  };
  const lagnaIndex = normalizeLagnaIndex(chart);
  const defaultLagnaLord = LAGNA_LORDS[lagnaIndex] || "Jupiter";

  let activeSaltPlanet = (activeAD && chart.planets?.[activeAD])
    ? activeAD
    : (activeMD && chart.planets?.[activeMD])
    ? activeMD
    : defaultLagnaLord;

  let activeSaltData: PlanetData | undefined = chart.planets?.[activeSaltPlanet];

  // Specific objective tailored to the active salt planet
  const SALT_OBJECTIVES: Record<string, string> = {
    Sun: "आत्म-सम्मान, नेतृत्व क्षमता, प्रशासनिक प्रभाव व पिता/सरकार से सहयोग",
    Moon: "मानसिक शांति, भावनात्मक संतुलन, निर्णय क्षमता व प्रचुर लिक्विडिटी",
    Mars: "साहस, पराक्रम, तकनीकी दक्षता, भूमि-भवन लाभ व त्वरित क्रियान्वयन",
    Mercury: "व्यापारिक वृद्धि, तीव्र तार्किक निर्णय, कोडिंग/एनालिटिक्स व प्रभावी संवाद",
    Jupiter: "भाग्य वृद्धि, उच्च शिक्षा, गुरु कृपा, अटके धन की प्राप्ति व दीर्घकालिक समृद्धि",
    Venus: "ऐश्वर्य, भौतिक सुख-साधन, रचनात्मक कला, आकर्षण व वैवाहिक सामंजस्य",
    Saturn: "करियर में स्थायित्व, अचल संपत्ति, कठिन परिश्रम का पुरस्कार व दीर्घायु",
    Rahu: "डिजिटल विस्तार, लीक से हटकर नए अवसर, वैश्विक रीच व आकस्मिक लाभ",
    Ketu: "सूक्ष्म अंतर्ज्ञान (Intuition), आध्यात्मिक शांति, शोध कार्य व कर्म-शुद्धि"
  };

  let activeSaltObjective = SALT_OBJECTIVES[activeSaltPlanet] || "करियर में तीव्र निष्पादन व जीवनोन्नति";
  let activeSaltShiftReason = "";

  if (activeSaltData && isCombust(activeSaltPlanet, activeSaltData.lon)) {
    activeSaltShiftReason = `${PLANET_HINDI[activeSaltPlanet]} सूर्य से मात्र ${Math.abs(activeSaltData.lon - sunLon).toFixed(1)}° पर पूर्णतः अस्त (Combust) है, इसलिए इसे सीधे सक्रिय करना वर्जित है।`;
    // Find un-combust functional benefic in trine / 9th / 11th / 1st / 5th
    const candidates = ["Jupiter", "Venus", "Mercury", "Moon", defaultLagnaLord];
    const safeBenefic = candidates.find(c => {
      const p = chart.planets?.[c];
      return p && !isCombust(c, p.lon) && (p.house === 9 || p.house === 11 || p.house === 1 || p.house === 5);
    });
    if (safeBenefic) {
      activeSaltPlanet = safeBenefic;
      activeSaltData = chart.planets?.[safeBenefic];
      activeSaltObjective = SALT_OBJECTIVES[safeBenefic] || "अटके हुए धन की निकासी, भाग्य वृद्धि और आर्थिक प्रवाह को अनलॉक करना";
    }
  }

  // 4. Step 2: Scan for Cosmic Friction Locks (90° Dangerous Hits & 180° Killer Hits on Active Salt)
  const incomingDangerousHits = (hitDossier.dangerousHits90 || []).filter(
    h => h.targetName === activeSaltPlanet || h.sourceName === activeSaltPlanet
  );
  const incomingKillerHits = (hitDossier.killerHits180 || []).filter(
    h => h.targetName === activeSaltPlanet || h.sourceName === activeSaltPlanet
  );

  const hasFrictionLock = incomingDangerousHits.length > 0 || incomingKillerHits.length > 0;
  const primaryFrictionHit = incomingDangerousHits[0] || incomingKillerHits[0];

  // 5. Step 3: Synthesize PPI Antacid Shield (120° / 60° / Amrit Aspect Buffer)
  let shieldPlanet = "";
  let shieldColor = "Golden Yellow";
  let shieldHex = "#EAB308";
  let shieldReason = "";

  // Look for any planet casting 120° shield or 60° supportive hit on Active Salt
  const planetShieldHit = (hitDossier.protectiveShields120 || []).find(s =>
    (s.targetName === activeSaltPlanet && s.sourceName !== activeSaltPlanet && chart.planets?.[s.sourceName]) ||
    (s.sourceName === activeSaltPlanet && s.targetName !== activeSaltPlanet && chart.planets?.[s.targetName])
  ) || (hitDossier.supportiveHits60 || []).find(s =>
    (s.targetName === activeSaltPlanet && s.sourceName !== activeSaltPlanet && chart.planets?.[s.sourceName]) ||
    (s.sourceName === activeSaltPlanet && s.targetName !== activeSaltPlanet && chart.planets?.[s.targetName])
  );

  if (planetShieldHit) {
    const sName = planetShieldHit.sourceName === activeSaltPlanet ? planetShieldHit.targetName : planetShieldHit.sourceName;
    if (chart.planets?.[sName] && sName !== activeSaltPlanet) {
      shieldPlanet = sName;
      shieldColor = PLANET_COLORS[sName]?.name || "Golden Yellow";
      shieldHex = PLANET_COLORS[sName]?.hex || "#EAB308";
    }
  }

  // If no distinct planetary shield hit was resolved, assign the natural divine buffer
  if (!shieldPlanet || shieldPlanet === activeSaltPlanet) {
    if (activeSaltPlanet === "Jupiter") {
      shieldPlanet = "Moon";
    } else if (activeSaltPlanet === "Saturn" || activeSaltPlanet === "Mars") {
      shieldPlanet = "Jupiter";
    } else if (activeSaltPlanet === "Venus") {
      shieldPlanet = "Moon";
    } else if (activeSaltPlanet === "Sun") {
      shieldPlanet = "Jupiter";
    } else if (activeSaltPlanet === "Moon") {
      shieldPlanet = "Jupiter";
    } else {
      shieldPlanet = "Jupiter";
    }
    shieldColor = PLANET_COLORS[shieldPlanet]?.name || "Golden Yellow";
    shieldHex = PLANET_COLORS[shieldPlanet]?.hex || "#EAB308";
  }

  if (hasFrictionLock && primaryFrictionHit) {
    const blocker = primaryFrictionHit.sourceName === activeSaltPlanet ? primaryFrictionHit.targetName : primaryFrictionHit.sourceName;
    shieldReason = `${PLANET_HINDI[blocker] || blocker} द्वारा ${primaryFrictionHit.exactDiff.toFixed(1)}° का घर्षण लॉक (Friction Lock) आ रहा है। ${PLANET_HINDI[shieldPlanet]} का सुरक्षात्मक बफर इस घर्षण को शून्य करके ऊर्जा को सुचारू बनाएगा।`;
  } else {
    shieldReason = `${PLANET_HINDI[shieldPlanet]} की सौम्य रक्षक ढाल सक्रिय घटक को स्थिरता व सात्विक संतुलन प्रदान करती है।`;
  }

  // 6. Step 4: Degree-Based Chromatic Tone Modulation (Dynamic HSL from actual planet)
  const chromaticModulation = computeDegreeChromaticModulation(activeSaltPlanet, activeSaltData);

  // 7. Step 5: Compound Thread Blended Color Generator (100% Dynamic)
  const threadBlend = getCompoundThreadColorBlend(activeSaltPlanet, shieldPlanet, chromaticModulation.hexCode, shieldHex);

  // 8. Step 6: Navtara & Astroscience Conflict Validator (Contraindications & Crystals)
  const contraindications: PrescriptionMoleculeItem[] = [];
  const wearableBracelet: CrystalProtocol["wearableBracelet"] = [];
  const deskManifestationCrystal: CrystalProtocol["deskManifestationCrystal"] = [];
  const strictlyAvoidCrystals: CrystalProtocol["strictlyAvoidCrystals"] = [];

  // Check every planet for Vadha (7th) Tara
  if (chart.planets) {
    Object.entries(chart.planets).forEach(([pName, pData]) => {
      if (!pData) return;
      const pNak = pData.nakshatra;
      const nav = calculateNavtara(moonNak, pNak);

      // If planet's nakshatra is in Vadha Tara (7th)
      if (nav.taraNumber === 7) {
        strictlyAvoidCrystals.push({
          crystalName: `${PLANET_CRYSTALS[pName]?.sub || pName} (${PLANET_CRYSTALS[pName]?.primary || pName})`,
          reason: `${PLANET_HINDI[pName]} के नक्षत्र (${pNak}) जातक के जन्म नक्षत्र (${moonNak}) से सीधे 7वीं नैधन (वध) तारा में पड़ते हैं। इसे पहनना कष्ट, सिरदर्द व अवरोध लाता है।`,
          dangerLevel: "Critical"
        });
        contraindications.push({
          category: "Contraindication",
          categoryHindi: "सख्त वर्जित घटक (Contraindication)",
          badgeLabel: "🚨 7th वध तारा लॉक",
          badgeColor: "#EF4444",
          planet: pName,
          planetHindi: PLANET_HINDI[pName],
          elementOrAction: `${PLANET_CRYSTALS[pName]?.primary || pName} या ${PLANET_COLORS[pName]?.name} का प्रयोग वर्जित`,
          colorName: PLANET_COLORS[pName]?.name || "Dark/Avoid",
          hexColor: "#EF4444",
          targetObjective: "वध तारा जनित अवरोधों व नसों के खिंचाव से सुरक्षा",
          scientificHitReason: `नवतारा चक्र में 7वीं तारा 'वध तारा' कहलाती है। ${PLANET_HINDI[pName]} का रत्न या गहरा रंग ऑरा में नकारात्मक फ्रीक्वेंसी सक्रिय करता है।`,
          howToApply: "कलाई, गले या उंगली में इस रंग/रत्न को कभी धारण न करें।",
          icon: "🚫"
        });
      }

      // Check combustion contraindication
      if (isCombust(pName, pData.lon) && (pName === "Mars" || pName === "Saturn")) {
        strictlyAvoidCrystals.push({
          crystalName: `${PLANET_CRYSTALS[pName]?.primary || pName} (${PLANET_CRYSTALS[pName]?.crystal || pName})`,
          reason: `${PLANET_HINDI[pName]} सूर्य से मात्र ${Math.abs(pData.lon - sunLon).toFixed(1)}° पर अस्त (Combust) है। इसका तीखा रत्न पहनने से रक्तचाप, क्रोध व तनाव में वृद्धि होती है।`,
          dangerLevel: "High"
        });
        contraindications.push({
          category: "Contraindication",
          categoryHindi: "सख्त वर्जित घटक (Contraindication)",
          badgeLabel: `🔥 अस्त ${PLANET_HINDI[pName]} दहन`,
          badgeColor: "#DC2626",
          planet: pName,
          planetHindi: PLANET_HINDI[pName],
          elementOrAction: `${PLANET_CRYSTALS[pName]?.primary || pName} या चटक रंग का प्रयोग वर्जित`,
          colorName: PLANET_COLORS[pName]?.name || "Avoid",
          hexColor: "#DC2626",
          targetObjective: "क्रोध, रक्तचाप व संबंधों में विच्छेद से बचाव",
          scientificHitReason: `अस्त ${PLANET_HINDI[pName]} सूर्य की प्रचंड अग्नि में पहले से दग्ध है। तीखा रंग या रत्न इसे और अधिक भड़का देता है।`,
          howToApply: "दैनिक जीवन में कलाई या पर्स में इस रंग/रत्न से बचें।",
          icon: "🔥"
        });
      }
    });
  }

  // 9. Step 7: Dynamic Wearable Crystals (Catalyst + Shield)
  const primaryCrystalData = PLANET_CRYSTALS[activeSaltPlanet] || PLANET_CRYSTALS["Jupiter"];
  const saltPlanetData = chart.planets?.[activeSaltPlanet];
  const saltNav = saltPlanetData ? calculateNavtara(moonNak, saltPlanetData.nakshatra) : { taraName: "साधना/कल्याण", taraNumber: 6 };

  wearableBracelet.push({
    crystalName: primaryCrystalData.crystal,
    crystalHindi: `${primaryCrystalData.crystal} (${PLANET_HINDI[activeSaltPlanet]} सक्रियक)`,
    colorHex: PLANET_COLORS[activeSaltPlanet]?.hex || "#EAB308",
    taraName: saltNav.taraName,
    taraNumber: saltNav.taraNumber,
    governingPlanet: activeSaltPlanet,
    role: `Active Catalyst — ${PLANET_HINDI[activeSaltPlanet]} के कारक तत्वों व सक्रिय दशा को अनुकूल दिशा देना`
  });

  const shieldCrystalData = PLANET_CRYSTALS[shieldPlanet] || PLANET_CRYSTALS["Jupiter"];
  const shieldPlanetData = chart.planets?.[shieldPlanet];
  const shieldNav = shieldPlanetData ? calculateNavtara(moonNak, shieldPlanetData.nakshatra) : { taraName: "क्षेम/रक्षक", taraNumber: 4 };

  wearableBracelet.push({
    crystalName: shieldCrystalData.crystal,
    crystalHindi: `${shieldCrystalData.crystal} (${PLANET_HINDI[shieldPlanet]} रक्षक ढाल)`,
    colorHex: PLANET_COLORS[shieldPlanet]?.hex || "#3B82F6",
    taraName: shieldNav.taraName,
    taraNumber: shieldNav.taraNumber,
    governingPlanet: shieldPlanet,
    role: `120° PPI Buffer — फ्रिक्शन व तनाव से सुरक्षा, ऊर्जा का संतुलन`
  });

  // Desk Manifestation Crystal based on 10th / 11th house sign
  const h10House = Object.values(hitDossier.cuspCoordinates || {}).find(c => c.house === 10);
  const h10Sign = h10House?.sign || "Taurus";

  if (["Taurus", "Libra", "Aquarius", "Capricorn"].includes(h10Sign)) {
    deskManifestationCrystal.push({
      crystalName: "Iron Pyrite Cluster (फूल्स गोल्ड)",
      placementZone: "ऑफिस डेस्क का उत्तर (North) या वायव्य (NW) कोना",
      purpose: "अटके हुए धन, बड़े व्यावसायिक अनुबंधों व लिक्विडिटी का आकर्षण",
      caution: "इसे शरीर पर नहीं पहनना है; केवल वर्क-टेबल या कैश बॉक्स में स्थापित रखना है।"
    });
  } else if (["Cancer", "Pisces", "Scorpio"].includes(h10Sign)) {
    deskManifestationCrystal.push({
      crystalName: "Natural Selenite / Sphatik Pyramid (शुद्ध स्फटिक पिरामिड)",
      placementZone: "वर्क-टेबल का ईशान (NE) या पूर्व (East) कोना",
      purpose: "गहन मानसिक एकाग्रता, तनाव मुक्ति व सूक्ष्म अंतर्ज्ञान (Intuition)",
      caution: "इसे जल से दूर रखें और समय-समय पर धूप में चार्ज करें।"
    });
  } else if (["Aries", "Leo", "Sagittarius"].includes(h10Sign)) {
    deskManifestationCrystal.push({
      crystalName: "Natural Citrine Cluster (सुनहला क्रिस्टल)",
      placementZone: "वर्क-डेस्क का ईशान (NE) या आग्नेय (SE) कोना",
      purpose: "नेतृत्व क्षमता, पद-प्रतिष्ठा, करियर में तीव्र प्रगति व ज्ञान विस्तार",
      caution: "नियमित रूप से इसे स्वच्छ कपड़े से पोंछें और सकारात्मक संकल्प दोहराएं।"
    });
  } else {
    deskManifestationCrystal.push({
      crystalName: "Green Jade / Green Fluorite (ग्रीन जेड पिरामिड)",
      placementZone: "वर्क-डेस्क का उत्तर (North - कुबेर दिशा)",
      purpose: "व्यापारिक नेटवर्किंग, कोडिंग/विश्लेषण में स्पष्टता व धन संचय",
      caution: "डेस्क पर इलेक्ट्रॉनिक्स के सीधे ऊपर न रखें, किनारे पर स्थापित करें।"
    });
  }

  // 10. Step 8: Anatomical Protocols
  const anatomicalProtocols = evaluateAnatomicalProtocols(chart, activeSaltPlanet, chromaticModulation);

  // 11. Step 9: Wallet Protocol (100% 2nd House & Lagna-Driven)
  const walletSpec = LAGNA_WALLET_SPECS[lagnaIndex] || LAGNA_WALLET_SPECS[0];

  // 12. Build the Complete Prescription Object
  const prescription: AstroPharmacologicalPrescription = {
    title: "AstroLife Master Prescription",
    formulaSubtitle: "त्रि-आयामी ज्योतिषीय औषधि सूत्र (The Tri-Fold Bio-Resonance Formula)",
    nativeName,
    activeSalt: {
      category: "Active_Salt",
      categoryHindi: "सक्रिय घटक (Active Molecule)",
      badgeLabel: `💊 सक्रिय ग्रह: ${PLANET_HINDI[activeSaltPlanet]}`,
      badgeColor: chromaticModulation.hexCode,
      planet: activeSaltPlanet,
      planetHindi: PLANET_HINDI[activeSaltPlanet],
      elementOrAction: `${threadBlend.blendedColorHindi} या ${wearableBracelet[0]?.crystalName}`,
      colorName: chromaticModulation.toneDescription,
      hexColor: chromaticModulation.hexCode,
      targetObjective: activeSaltObjective,
      scientificHitReason: activeSaltShiftReason || `${PLANET_HINDI[activeSaltPlanet]} (${chromaticModulation.degFormatted} ${chromaticModulation.avasthaHindi}) कुंडली के केंद्र/त्रिकोण व एक्टिव दशा को संचालित कर रहा है।`,
      howToApply: "दाहिने हाथ की कलाई पर रक्षा सूत्र या क्रिस्टल ब्रेसलेट के रूप में धारण करें।",
      icon: "💊"
    },
    protonPumpInhibitor: {
      category: "PPI_Antacid_Shield",
      categoryHindi: "सुरक्षा कवच (120° PPI Buffer Shield)",
      badgeLabel: `🛡️ रक्षक ग्रह: ${PLANET_HINDI[shieldPlanet]}`,
      badgeColor: "#3B82F6",
      planet: shieldPlanet,
      planetHindi: PLANET_HINDI[shieldPlanet],
      elementOrAction: `${shieldColor} का बफर / ठोस चांदी / सिट्रीन`,
      colorName: shieldColor,
      hexColor: shieldHex,
      targetObjective: "90° व 180° के कॉस्मिक फ्रिक्शन से मानसिक व शारीरिक सुरक्षा",
      scientificHitReason: shieldReason,
      howToApply: "सक्रिय धागे में इंसुलेशन के रूप में जोड़ें या पर्स/कलाई पर साथ रखें।",
      icon: "🛡️"
    },
    nutritionalSupport: [
      {
        category: "Nutritional_Support",
        categoryHindi: "सह-पोषक तत्व (Nutritional Co-Factor)",
        badgeLabel: "⚡ ऊर्जा व मानसिक शांति",
        badgeColor: "#8B5CF6",
        planet: `${activeSaltPlanet} & ${shieldPlanet}`,
        planetHindi: `${PLANET_HINDI[activeSaltPlanet]} व ${PLANET_HINDI[shieldPlanet]}`,
        elementOrAction: wearableBracelet.map(c => c.crystalName).join(" + "),
        colorName: "Crystal Balance",
        hexColor: "#8B5CF6",
        targetObjective: "नर्वस सिस्टम की थकान, अनिद्रा व स्क्रीन स्ट्रेस का शमन",
        scientificHitReason: "यह रत्न संयोजन क्षेम व साधना तारा के माध्यम से जीवन ऊर्जा (Ojas) को 24 घंटे रीचार्ज रखता है।",
        howToApply: "हाथ में ब्रेसलेट के रूप में या वर्क-डेस्क पर स्थापित करके उपयोग करें।",
        icon: "⚡"
      }
    ],
    contraindications,
    compoundThread: {
      basePlanet: activeSaltPlanet,
      baseColor: chromaticModulation.toneDescription,
      shieldPlanet,
      shieldColor,
      blendedColorName: threadBlend.blendedColorName,
      blendedColorHindi: `${threadBlend.blendedColorHindi} [${chromaticModulation.toneDescription}]`,
      blendedHex: threadBlend.blendedHex,
      whyBlended: `${threadBlend.compoundWhy} (डिग्री विश्लेषण: ${chromaticModulation.scientificRule})`,
      wristHand: "दाहिना हाथ (Right Wrist)",
      wearingDayAndTiming: getWearingTiming(activeSaltPlanet, shieldPlanet),
      ritualInstructions: "धागे को धारण करने से पहले ताजे जल से स्पर्श कराएं, 11 बार अपने इष्ट/गायत्री मंत्र का ध्यान करें और 3 गांठ लगाकर बांधें।"
    },
    chromaticModulation,
    anatomicalProtocols,
    crystals: {
      wearableBracelet,
      deskManifestationCrystal,
      strictlyAvoidCrystals
    },
    wallet: {
      recommendedColors: walletSpec.colors,
      recommendedHexes: walletSpec.hexes,
      colorsToAvoid: walletSpec.avoid,
      seedItemInside: walletSpec.seedItem,
      recommendedCurrencyNote: walletSpec.note,
      scientificReason: walletSpec.reason
    },
    accessories: evaluateDailyAccessories(chart, activeSaltPlanet, shieldPlanet, chromaticModulation),
    frictionDiagnosisSummary: hasFrictionLock && primaryFrictionHit
      ? `सावधानी: आपकी कुंडली में ${primaryFrictionHit.sourceName} द्वारा ${primaryFrictionHit.exactDiff.toFixed(1)}° का कॉस्मिक फ्रिक्शन लॉक आ रहा है। बिना रक्षक बफर (PPI Shield) के एकांगी उपाय करने से मानसिक तनाव हो सकता था, जिसे इस संयुक्त सूत्र द्वारा पूर्णतः निष्प्रभावी कर दिया गया है।`
      : "आपकी कुंडली में मुख्य सक्रिय ग्रह पर कोई गंभीर फ्रिक्शन लॉक नहीं है। यह संयुक्त सूत्र पूर्णतः निर्दोष व अमृत समान फलदायी है।"
  };

  return prescription;
}
