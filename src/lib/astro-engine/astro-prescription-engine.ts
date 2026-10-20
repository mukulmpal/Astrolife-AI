// src/lib/astro-engine/astro-prescription-engine.ts
// ============================================================================
// ASTROLIFE — ASTRO-PHARMACOLOGICAL PRESCRIPTION ENGINE (v1.0)
// ============================================================================
// Codifies the Revolutionary "Tri-Fold Cosmic Prescription Formula":
// 1. Active Salt / Molecule (सक्रिय घटक): Target planet that drives the primary objective.
// 2. PPI / Antacid Shield (सुरक्षा कवच): 120° / 60° Buffer planet that neutralizes 90°/180° hits
//    and friction locks so that no mental/physical "ulcers" (burnout/agitation) occur.
// 3. Nutritional Support (सह-पोषक तत्व): Lagna & Moon strengtheners, crystals & grounding.
// 4. Strict Contraindications (निषेध): Filters out 7th Naidhana (Vadha) Tara & combust planets.
// 5. Compound Thread Recipe: Blends Base + Buffer colors into a seamless shielded thread (e.g. Lime Green).
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import type { AstroVastuHitDossier, PlanetCoordinateRow } from "./astro-vastu-hit-engine";

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

const PLANET_COLORS: Record<string, { name: string; hex: string }> = {
  Sun: { name: "Ruby Red / Copper Saffron", hex: "#E11D48" },
  Moon: { name: "Pearl White / Silver", hex: "#F8FAFC" },
  Mars: { name: "Bright Coral Red", hex: "#DC2626" },
  Mercury: { name: "Emerald Green", hex: "#16A34A" },
  Jupiter: { name: "Golden Yellow", hex: "#EAB308" },
  Venus: { name: "Diamond White / Cream / Pastel", hex: "#F1F5F9" },
  Saturn: { name: "Deep Blue / Charcoal", hex: "#1E3A8A" },
  Rahu: { name: "Smoky Ultraviolet / Black", hex: "#0F172A" },
  Ketu: { name: "Spotted / Ash Grey", hex: "#64748B" }
};

const PLANET_HINDI: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
};

const PLANET_CRYSTALS: Record<string, { primary: string; sub: string; crystal: string }> = {
  Sun: { primary: "Ruby", sub: "Red Garnet", crystal: "Sunstone" },
  Moon: { primary: "Pearl", sub: "Moonstone", crystal: "Rainbow Moonstone" },
  Mars: { primary: "Red Coral", sub: "Carnelian", crystal: "Red Jasper" },
  Mercury: { primary: "Emerald", sub: "Peridot", crystal: "Green Aventurine / Green Jade" },
  Jupiter: { primary: "Yellow Sapphire", sub: "Yellow Topaz", crystal: "Natural Citrine" },
  Venus: { primary: "Diamond", sub: "White Zircon", crystal: "Clear Quartz (Sphatik)" },
  Saturn: { primary: "Blue Sapphire", sub: "Amethyst (कटेला)", crystal: "Lapis Lazuli / Hematite" },
  Rahu: { primary: "Hessonite (गोमेद)", sub: "Spessartite", crystal: "Tiger's Eye" },
  Ketu: { primary: "Cat's Eye (लहसुनिया)", sub: "Chrysoberyl", crystal: "Snowflake Obsidian" }
};

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
    return { diff: 0, taraNumber: 1, taraName: "Janma", isHarmful: false, isSupreme: false };
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

function computeDegreeChromaticModulation(
  planetName: string,
  pData: PlanetData | undefined
): DegreeChromaticModulation {
  const degInSign = pData ? pData.degree + pData.minutes / 60 : 15;
  const degFormatted = `${degInSign.toFixed(2)}°`;

  let baseHue = 84; // Lime Green default
  if (planetName === "Mercury") baseHue = 84;
  else if (planetName === "Jupiter") baseHue = 45;
  else if (planetName === "Sun") baseHue = 15;
  else if (planetName === "Mars") baseHue = 0;
  else if (planetName === "Venus") baseHue = 160;
  else if (planetName === "Moon") baseHue = 200;
  else if (planetName === "Saturn") baseHue = 220;

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

function evaluateAnatomicalProtocols(
  chart: ChartData,
  activeSaltPlanet: string,
  chromaticModulation: DegreeChromaticModulation
): AnatomicalTargetingRecommendation[] {
  const lagnaNum = chart.lagnaNum; // 0-11
  const protocols: AnatomicalTargetingRecommendation[] = [];

  // 1. Knees (घुटने) - Capricorn (मकर - sign 10, index 9)
  const capHouse = ((9 - lagnaNum + 12) % 12) + 1;
  const isCapDusthana = capHouse === 6 || capHouse === 8 || capHouse === 12;
  const isMarsCombust = chart.planets.Mars && Math.abs(chart.planets.Mars.lon - (chart.planets.Sun?.lon || 0)) <= 6;

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
  const aquaHouse = ((10 - lagnaNum + 12) % 12) + 1;
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
  const libHouse = ((6 - lagnaNum + 12) % 12) + 1;
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
  const gemHouse = ((2 - lagnaNum + 12) % 12) + 1;
  protocols.push({
    bodyZoneHi: "कलाई (Wrist)",
    bodyZoneEn: "Wrist & Nervous System",
    correspondingSign: "मिथुन (Gemini)",
    correspondingSignNum: 3,
    houseInNativeChart: gemHouse,
    rulingPlanet: "बुध",
    wearableForm: `कलाई पर संयुक्त रक्षा सूत्र (${chromaticModulation.toneDescription})`,
    toneAndHex: {
      colorName: chromaticModulation.toneDescription,
      hexColor: chromaticModulation.hexCode,
      hslColor: chromaticModulation.hslString,
    },
    purpose: "बौद्धिक फोकस, कोडिंग, व्यापारिक निर्णय व नर्वस सिस्टम की सुरक्षा",
    planetaryMechanism: `मिथुन राशि कलाई की अधिष्ठात्री है। भाव ${gemHouse} में होने से यह कलाई पर बंधा सूत्र सीधे बुद्धिमत्ता को संचालित करता है।`,
    isAllowedForNative: gemHouse !== 6 && gemHouse !== 8 && gemHouse !== 12,
  });

  // 5. Feet / Soles (पैर के पंजे व तलवे) - Pisces (मीन - sign 12, index 11)
  const pisHouse = ((11 - lagnaNum + 12) % 12) + 1;
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
  const lagnaNum = chart.lagnaNum; // 0-11
  const isVirgo = chart.lagnaRashi === "Virgo" || lagnaNum === 5;
  const isAquarius = chart.lagnaRashi === "Aquarius" || lagnaNum === 10;

  // 1. Smartphone Cover (3rd House - Gemini / Mercury / Digital Communication)
  // The phone is handheld in the 3rd house bio-field 10-14 hours daily!
  const modulationHex = chromaticModulation?.hexCode || "#166534";
  let phoneColors = ["Lime Green (लाइम ग्रीन)", "Forest Green (गहरा हरा)", "Tan Brown (टैन)", "Silver / Muted White"];
  let phoneHexes = [modulationHex, "#166534", "#B45309", "#F8FAFC"];
  let phoneAvoid = ["Aggressive Blood Red (चटक लाल)", "Jet Black (गहरा काला)"];
  let phoneMaterial = "मैट सिलिकॉन या वेगन लेदर (चिकना व नॉन-ग्लेयर ग्रिप)";
  let phoneMechanism = "फोन कालपुरुष के 3रे भाव (हाथ, संपर्क, डिजिटल संचार) का मुख्य यंत्र है। आपके बुध पर मंगल की 90° हिट को शांत करने के लिए लाइम/फॉरेस्ट ग्रीन बैक-कवर एक विद्युत-चुंबकीय शील्ड (EMF Shield) की तरह काम करता है।";
  let phoneWallpaper = "शांत हरी प्रकृति (Bamboo/Forest) या सुनहरी ज्यामिति (Golden Ratio Yantra)";
  let phoneCaution = "टूटा हुआ स्क्रीन गार्ड, चटका हुआ कवर या भड़कीले लाल कवर का उपयोग न करें; यह सीधे नर्वस सिस्टम में अधीरता (Impatience) पैदा करता है।";

  if (isAquarius) {
    phoneColors = ["Royal Blue (गहरा नीला)", "Citrine Gold (सुनहला पीला)", "Camel Tan", "Slate Grey"];
    phoneHexes = ["#1D4ED8", "#F59E0B", "#B45309", "#64748B"];
    phoneAvoid = ["Fiery Neon Red", "Dark Purple (गहरा जामुनी)"];
    phoneMaterial = "पॉलीकार्बोनेट मैट या प्रीमियम लेदर ग्रिप";
    phoneMechanism = "कुंभ लग्न में 3रे भाव का स्वामी मंगल 10वें भाव में अस्त है। रॉयल ब्लू व सिट्रीन गोल्ड कवर व्यावसायिक संचार व अटके भुगतानों को तुरंत गति देता है।";
    phoneWallpaper = "शांत बहता जल या आयरन पाइराइट / सिट्रीन क्रिस्टल की छवि";
    phoneCaution = "काले या लाल रंग के हिंसक ग्राफिक्स वाले फोन केस से बचें।";
  }

  // 2. Footwear / Shoes (12th House - Pisces / Saturn / Shani)
  // Lal Kitab Axiom: "Shoes are the physical domain of Saturn. Torn or ill-suited shoes destroy the 12th & 10th houses."
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
  let maskMechanism = "मुख 2nd भाव (वाणी व परिवार) और नाक प्राण वायु (बुध व चंद्रमा) है। सफेद या हल्के हरे रंग का कॉटन मास्क प्राण वायु के प्रवाह को शुद्ध रखता है और फेफड़ों को ऑक्सीजन संतुलन देता है।";
  let maskCaution = "सिंथेटिक पॉलिएस्टर के काले मास्क से बचें; यह शरीर में कार्बन-डाइऑक्साइड चक्र को दूषित कर सिरदर्द पैदा करते हैं।";

  return {
    phoneCover: {
      title: "स्मार्टफोन बैक कवर (3rd House Bio-Armor)",
      recommendedColors: phoneColors,
      recommendedHexes: phoneHexes,
      colorsToAvoid: phoneAvoid,
      caseMaterial: phoneMaterial,
      planetaryMechanism: phoneMechanism,
      idealWallpaperAffirmation: phoneWallpaper,
      cautionNotice: phoneCaution,
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
      title: "फेस मास्क व श्वास रक्षा (2nd House & Prana Vayu)",
      recommendedColors: maskColors,
      recommendedHexes: maskHexes,
      colorsToAvoid: maskAvoid,
      fabric: maskFabric,
      planetaryMechanism: maskMechanism,
      cautionNotice: maskCaution,
    },
  };
}

// ── Master Prescription Evaluator ───────────────────────────────────────────

export function evaluateAstroPrescriptionFormula(
  chart: ChartData,
  hitDossier: AstroVastuHitDossier
): AstroPharmacologicalPrescription {
  const nativeName = chart.name || "Seeker";
  const moonData = chart.planets.Moon;
  const moonNak = moonData?.nakshatra || "Purva Phalguni";

  // 1. Identify Active Dasha Lords
  const activeMD = hitDossier.activeDasha.mahadasha;
  const activeAD = hitDossier.activeDasha.antardasha;

  // 2. Check for Combustion (अस्त अवस्था)
  const sunLon = chart.planets.Sun?.lon ?? 0;
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
  let activeSaltPlanet = activeAD || activeMD || "Mercury";
  let activeSaltData: PlanetData | undefined = chart.planets[activeSaltPlanet];

  // If the active Dasha Lord is combust or a strong natural malefic causing friction, shift target to 9th lord / functional benefic
  let activeSaltObjective = "करियर में तीव्र निष्पादन, व्यापार वृद्धि व बौद्धिक विस्तार";
  let activeSaltShiftReason = "";

  if (activeSaltData && isCombust(activeSaltPlanet, activeSaltData.lon)) {
    // e.g. Combust Mars in Manisha's chart
    activeSaltShiftReason = `${PLANET_HINDI[activeSaltPlanet]} सूर्य से मात्र ${Math.abs(activeSaltData.lon - sunLon).toFixed(1)}° पर पूर्णतः अस्त (Combust) है, इसलिए इसे सीधे सक्रिय करना वर्जित है।`;
    // Find un-combust benefic in trine / 9th / 11th
    const candidates = ["Jupiter", "Venus", "Mercury", "Moon"];
    const safeBenefic = candidates.find(c => {
      const p = chart.planets[c];
      return p && !isCombust(c, p.lon) && (p.house === 9 || p.house === 11 || p.house === 1 || p.house === 5);
    });
    if (safeBenefic) {
      activeSaltPlanet = safeBenefic;
      activeSaltData = chart.planets[safeBenefic];
      activeSaltObjective = "अटके हुए धन (Stuck Money) की निकासी, भाग्य वृद्धि और आर्थिक प्रवाह को अनलॉक करना";
    }
  }

  // 4. Step 2: Scan for Cosmic Friction Locks (90° Dangerous Hits & 180° Killer Hits on Active Salt)
  const activeSaltCoord = hitDossier.planetCoordinates.find(p => p.name === activeSaltPlanet);
  const activeSaltLon = activeSaltCoord?.compoundDeg ?? (activeSaltData?.lon ?? 0);

  const incomingDangerousHits = hitDossier.dangerousHits90.filter(
    h => h.targetName === activeSaltPlanet || h.sourceName === activeSaltPlanet
  );
  const incomingKillerHits = hitDossier.killerHits180.filter(
    h => h.targetName === activeSaltPlanet || h.sourceName === activeSaltPlanet
  );

  const hasFrictionLock = incomingDangerousHits.length > 0 || incomingKillerHits.length > 0;
  const primaryFrictionHit = incomingDangerousHits[0] || incomingKillerHits[0];

  // 5. Step 3: Synthesize PPI Antacid Shield (120° / 60° / Amrit Aspect Buffer)
  let shieldPlanet = "Jupiter";
  let shieldColor = "Golden Yellow";
  let shieldHex = "#EAB308";
  let shieldReason = "";

  // Look for any planet casting 120° shield or 60° supportive hit on Active Salt or Lagna
  const shieldHit = hitDossier.protectiveShields120.find(s => s.targetName === activeSaltPlanet || s.sourceName === activeSaltPlanet)
    || hitDossier.supportiveHits60.find(s => s.targetName === activeSaltPlanet || s.sourceName === activeSaltPlanet);

  if (shieldHit) {
    const sName = shieldHit.sourceName === activeSaltPlanet ? shieldHit.targetName : shieldHit.sourceName;
    if (chart.planets[sName]) {
      shieldPlanet = sName;
      shieldColor = PLANET_COLORS[sName]?.name || "Golden Yellow";
      shieldHex = PLANET_COLORS[sName]?.hex || "#EAB308";
    }
  } else {
    // Default divine buffer: Jupiter (Guru) or Moon/Silver (Chandra)
    shieldPlanet = activeSaltPlanet === "Jupiter" ? "Moon" : "Jupiter";
    shieldColor = PLANET_COLORS[shieldPlanet]?.name || "Golden Yellow";
    shieldHex = PLANET_COLORS[shieldPlanet]?.hex || "#EAB308";
  }

  if (hasFrictionLock && primaryFrictionHit) {
    const blocker = primaryFrictionHit.sourceName === activeSaltPlanet ? primaryFrictionHit.targetName : primaryFrictionHit.sourceName;
    shieldReason = `${PLANET_HINDI[blocker]} द्वारा ${primaryFrictionHit.exactDiff.toFixed(1)}° का घर्षण लॉक (Friction Lock) आ रहा है। ${PLANET_HINDI[shieldPlanet]} का सुरक्षात्मक बफर इस घर्षण को शून्य करके ऊर्जा को सुचारू बनाएगा।`;
  } else {
    shieldReason = `${PLANET_HINDI[shieldPlanet]} की सौम्य रक्षक ढाल सक्रिय घटक को स्थिरता व सात्विक संतुलन प्रदान करती है।`;
  }

  // 6. Step 4: Compound Thread Blended Color Generator
  let blendedColorName = "Lime Green (तूतिया हरा)";
  let blendedColorHindi = "लाईम ग्रीन (तोतिया हरा)";
  let blendedHex = "#84CC16"; // Lime-500
  let compoundWhy = "";

  if (activeSaltPlanet === "Mercury" && shieldPlanet === "Jupiter") {
    blendedColorName = "Lime Green / Parrot Green";
    blendedColorHindi = "लाईम ग्रीन (तोतिया हरा / लेमन-ग्रीन)";
    blendedHex = "#84CC16";
    compoundWhy = "बुध (हरा) + गुरु (पीला) का 50-50 संयोजन। यह एकांगी हरे रंग की मंगल से होने वाली 90° की जलन को शांत करके विशुद्ध सरस्वती योग व कर्म सिद्धि देता है।";
  } else if (activeSaltPlanet === "Jupiter" && shieldPlanet === "Moon") {
    blendedColorName = "Golden White / Pale Cream";
    blendedColorHindi = "क्रीम / हल्का सुनहरा-सफेद";
    blendedHex = "#FEF08A";
    compoundWhy = "गुरु (पीला) + चंद्र (सफेद) का गजकेसरी ब्लेंड। यह 11वें भाव के अटके धन को रिलीज करता है और मानसिक तनाव को बर्फ की तरह शांत करता है।";
  } else {
    blendedColorName = `${PLANET_COLORS[activeSaltPlanet]?.name} + ${shieldColor}`;
    blendedColorHindi = `${PLANET_HINDI[activeSaltPlanet]} + ${PLANET_HINDI[shieldPlanet]} का संयुक्त रक्षा सूत्र`;
    blendedHex = PLANET_COLORS[activeSaltPlanet]?.hex || "#10B981";
    compoundWhy = `${PLANET_HINDI[activeSaltPlanet]} की सक्रिय शक्ति को ${PLANET_HINDI[shieldPlanet]} की रक्षक ढाल के साथ इंसुलेट किया गया है।`;
  }

  // 7. Step 5: Navtara & Astroscience Conflict Validator (Contraindications & Nutrition)
  const contraindications: PrescriptionMoleculeItem[] = [];
  const wearableBracelet: CrystalProtocol["wearableBracelet"] = [];
  const deskManifestationCrystal: CrystalProtocol["deskManifestationCrystal"] = [];
  const strictlyAvoidCrystals: CrystalProtocol["strictlyAvoidCrystals"] = [];

  // Check every planet for Vadha (7th) Tara
  Object.entries(chart.planets).forEach(([pName, pData]) => {
    const pNak = pData.nakshatra;
    const nav = calculateNavtara(moonNak, pNak);

    // If planet's nakshatra is in Vadha Tara (7th)
    if (nav.taraNumber === 7) {
      strictlyAvoidCrystals.push({
        crystalName: `${PLANET_CRYSTALS[pName]?.sub || pName} (${PLANET_CRYSTALS[pName]?.primary || pName})`,
        reason: `${PLANET_HINDI[pName]} के नक्षत्र (${pNak}) मनीषा के जन्म नक्षत्र (${moonNak}) से सीधे 7वीं नैधन (वध) तारा में पड़ते हैं। इसे पहनना कष्ट, माइग्रेन व अवरोध लाता है।`,
        dangerLevel: "Critical"
      });
      contraindications.push({
        category: "Contraindication",
        categoryHindi: "सख्त वर्जित घटक (Contraindication)",
        badgeLabel: "🚨 7th वध तारा लॉक",
        badgeColor: "#EF4444",
        planet: pName,
        planetHindi: PLANET_HINDI[pName],
        elementOrAction: `नीलम, कटेला (Amethyst) या ${PLANET_COLORS[pName]?.name} का प्रयोग वर्जित`,
        colorName: PLANET_COLORS[pName]?.name || "Blue/Black",
        hexColor: "#EF4444",
        targetObjective: "वध तारा जनित अवरोधों व नसों के खिंचाव से सुरक्षा",
        scientificHitReason: `नवतारा चक्र में 7वीं तारा 'वध तारा' कहलाती है। ${PLANET_HINDI[pName]} का रत्न धारण करने से यह विनाशकारी फ्रीक्वेंसी सीधे ऑरा में एक्टिव हो जाती।`,
        howToApply: "कलाई, गले या उंगली में इस रंग/रत्न को कभी धारण न करें।",
        icon: "🚫"
      });
    }

    // Check combustion contraindication
    if (isCombust(pName, pData.lon) && pName === "Mars") {
      strictlyAvoidCrystals.push({
        crystalName: "Red Coral (मूंगा) / Red Jasper",
        reason: `मंगल सूर्य से मात्र ${Math.abs(pData.lon - sunLon).toFixed(1)}° पर अस्त (Combust) है। मूंगा पहनने से पित्त, गुस्सा, हाई बीपी व कार्यक्षेत्र में विस्फोट होता है।`,
        dangerLevel: "High"
      });
      contraindications.push({
        category: "Contraindication",
        categoryHindi: "सख्त वर्जित घटक (Contraindication)",
        badgeLabel: "🔥 अस्त मंगल दहन",
        badgeColor: "#DC2626",
        planet: "Mars",
        planetHindi: "मंगल",
        elementOrAction: "मूंगा, लाल धागा या चटक लाल रंग का प्रयोग वर्जित",
        colorName: "Bright Red",
        hexColor: "#DC2626",
        targetObjective: "क्रोध, रक्तचाप व संबंधों में विच्छेद से बचाव",
        scientificHitReason: "अस्त मंगल सूर्य की प्रचंड अग्नि में पहले से दग्ध है। लाल रंग की ऊर्जा इसे और अधिक भड़का देती है।",
        howToApply: "दैनिक जीवन में कलाई या पर्स में लाल रंग से बचें।",
        icon: "🔥"
      });
    }
  });

  // Assign crystals according to Sadhana (6) & Kshema (4) & Mitra (8) Taras
  if (activeSaltPlanet === "Mercury") {
    // Mukul style
    wearableBracelet.push({
      crystalName: "Green Aventurine",
      crystalHindi: "ग्रीन एवेंट्यूरिन (सौम्य बुध)",
      colorHex: "#10B981",
      taraName: "मित्र/कार्य सिद्धि",
      taraNumber: 8,
      governingPlanet: "Mercury",
      role: "Active Catalyst — व्यापार, कोडिंग, तार्किक मेधा व अवसरों का आकर्षण"
    });
    wearableBracelet.push({
      crystalName: "Natural Citrine",
      crystalHindi: "प्राकृतिक सिट्रीन / सुनहला (गुरु)",
      colorHex: "#F59E0B",
      taraName: "साधना/रक्षक ढाल",
      taraNumber: 6,
      governingPlanet: "Jupiter",
      role: "PPI Buffer — 120° रक्षक ढाल, मंगल की 90° हिट से सुरक्षा व वित्तीय स्थायित्व"
    });
  } else {
    // Manisha style (Aquarius Lagna)
    wearableBracelet.push({
      crystalName: "Natural Citrine",
      crystalHindi: "प्राकृतिक सिट्रीन / सुनहला (गुरु)",
      colorHex: "#F59E0B",
      taraName: "साधना तारा (6th Tara)",
      taraNumber: 6,
      governingPlanet: "Jupiter",
      role: "Active Catalyst — 9th भाव भाग्येश व 11वें भाव के अटके धन की त्वरित रिकवरी"
    });
    wearableBracelet.push({
      crystalName: "Clear Quartz (Sphatik) / Rainbow Moonstone",
      crystalHindi: "शुद्ध स्फटिक / रेनबो मूनस्टोन",
      colorHex: "#E2E8F0",
      taraName: "क्षेम तारा (4th Tara)",
      taraNumber: 4,
      governingPlanet: "Moon/Venus",
      role: "Master Healer — 10वें भाव की अग्नि को शांत करना, गहरी नींद व मानसिक सुकून"
    });
    deskManifestationCrystal.push({
      crystalName: "Iron Pyrite Cluster (फूल्स गोल्ड)",
      placementZone: "ऑफिस डेस्क का उत्तर (North) या ईशान (NE) कोना",
      purpose: "अटके हुए धन, बड़े कॉर्पोरेट क्लाइंट्स और व्यावसायिक विस्तार का चुंबक",
      caution: "इसे शरीर पर नहीं पहनना है; केवल वर्क-टेबल या कैश बॉक्स में स्थापित रखना है।"
    });
  }

  // 8. Step 6: Degree-Based Chromatic Tone Modulation (डिग्री-आधारित कलर सैचुरेशन व टिंट)
  const chromaticModulation = computeDegreeChromaticModulation(activeSaltPlanet, activeSaltData);

  // 9. Step 7: Anatomical Body-Zone Astro-Targeting Protocol (अंग-आधारित अनुप्रयोग)
  const anatomicalProtocols = evaluateAnatomicalProtocols(chart, activeSaltPlanet, chromaticModulation);

  // 10. Wallet Protocol
  let walletColors = ["Dark Brown (डार्क चॉकलेट लेदर)", "Bottle Green (गहरा हरा)"];
  let walletHexes = ["#451A03", "#14532D"];
  let walletAvoid = ["Bright Red (चटक लाल)", "Jet Black (गहरा काला)"];
  let seedItem = "शुद्ध चांदी का 10-15 ग्राम का ठोस चौकोर टुकड़ा";
  let currencyNote = "₹500 का नया कड़क नोट (सीरियल अंक 5 या 6)";

  if (chart.lagnaRashi === "Aquarius") {
    walletColors = ["Tan / Camel Leather (टैन/कैमल)", "Coffee Brown", "Royal Blue"];
    walletHexes = ["#B45309", "#78350F", "#1D4ED8"];
    walletAvoid = ["Bright Red", "Dirty Ash Grey"];
    seedItem = "चांदी का गोल सिक्का या स्फटिक की छोटी मणिका";
    currencyNote = "₹500 का नया नोट (अंक 3 या 6 का)";
  }

  // Build the complete prescription
  const prescription: AstroPharmacologicalPrescription = {
    title: "AstroLife Master Prescription",
    formulaSubtitle: "त्रि-आयामी ज्योतिषीय औषधि सूत्र (The Tri-Fold Bio-Resonance Formula)",
    nativeName,
    activeSalt: {
      category: "Active_Salt",
      categoryHindi: "सक्रिय घटक (Active Molecule)",
      badgeLabel: `💊 सक्रिय ग्रह: ${PLANET_HINDI[activeSaltPlanet]}`,
      badgeColor: "#10B981",
      planet: activeSaltPlanet,
      planetHindi: PLANET_HINDI[activeSaltPlanet],
      elementOrAction: `${blendedColorHindi} या ${wearableBracelet[0]?.crystalName}`,
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
        planet: "Moon & Venus",
        planetHindi: "चंद्रमा व शुक्र",
        elementOrAction: wearableBracelet.map(c => c.crystalName).join(" + "),
        colorName: "Crystal Balance",
        hexColor: "#8B5CF6",
        targetObjective: "नर्वस सिस्टम की थकान, अनिद्रा व स्क्रीन स्ट्रेस का शमन",
        scientificHitReason: "यह रत्न संयोजन क्षेम व साधना तारा के माध्यम से जीवन ऊर्जा (Ojas) को 24 घंटे रिचार्ज रखता है।",
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
      blendedColorName,
      blendedColorHindi: `${blendedColorHindi} [${chromaticModulation.toneDescription}]`,
      blendedHex: chromaticModulation.hexCode,
      whyBlended: `${compoundWhy} (डिग्री विश्लेषण: ${chromaticModulation.scientificRule})`,
      wristHand: "दाहिना हाथ (Right Wrist)",
      wearingDayAndTiming: "बुधवार/गुरुवार प्रातःकाल (शुक्ल पक्ष), पक्षियों को दाना देकर ऑफिस पहुंचकर धारण करें।",
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
      recommendedColors: walletColors,
      recommendedHexes: walletHexes,
      colorsToAvoid: walletAvoid,
      seedItemInside: seedItem,
      recommendedCurrencyNote: currencyNote,
      scientificReason: "वॉलेट धन भाव (2nd House) का भौतिक प्रतीक है। सही रंग व शुद्ध धातु धन के अनावश्यक रिसाव को रोकते हैं।"
    },
    accessories: evaluateDailyAccessories(chart, activeSaltPlanet, shieldPlanet, chromaticModulation),
    frictionDiagnosisSummary: hasFrictionLock && primaryFrictionHit
      ? `सावधानी: आपकी कुंडली में ${primaryFrictionHit.sourceName} द्वारा ${primaryFrictionHit.exactDiff.toFixed(1)}° का कॉस्मिक फ्रिक्शन लॉक आ रहा है। बिना रक्षक बफर (PPI Shield) के एकांगी उपाय करने से मानसिक तनाव हो सकता था, जिसे इस संयुक्त सूत्र द्वारा पूर्णतः निष्प्रभावी कर दिया गया है।`
      : "आपकी कुंडली में मुख्य सक्रिय ग्रह पर कोई गंभीर फ्रिक्शन लॉक नहीं है। यह संयुक्त सूत्र पूर्णतः निर्दोष व अमृत समान फलदायी है।"
  };

  return prescription;
}
