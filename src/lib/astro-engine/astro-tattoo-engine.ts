/**
 * ✦ ASTROLIFE ASTRO-TATTOO & BIOMETRIC DOT ACTIVATION ENGINE ✦
 * 
 * Standalone computational engine for anatomical planetary tattoo and dot activation,
 * based on authentic KP Astrological house negation/multiplication dynamics,
 * gender-lateralized somatotopic mapping, and untenanted planet precedence.
 * 
 * Core Shastric Principles:
 * 1. Gender Lateralization:
 *    - Female (स्त्री): Left anatomical quadrant (वाम अंग).
 *    - Male (पुरुष): Right anatomical quadrant (दक्षिण अंग).
 * 2. Untenanted Planet Priority:
 *    - If Dasha lord or target planet has no occupants in its nakshatras, it delivers
 *      its OWN house results with 100% velocity before any star lord.
 * 3. 12 Zodiac Signs to Anatomical Coordinates:
 *    - Aries (Head) -> Pisces (Feet).
 * 4. Goal-Specific House Activation Formulas:
 *    - Marriage: 2, 7, 11 (Prime = 7th house sign body part).
 *    - Health / Disease Negation: 5th house (strictly negates 6th house disease).
 *    - Wealth & Liquid Cash: 2, 6, 11 (Bank balance & accumulated gains).
 *    - Career Status: 10, 11, 6 (10th house perfection & authority).
 *    - Property Buy: 4, 11 (Fixed asset acquisition).
 *    - Property Sell: 3, 10 (Negates 4th and brings the buyer).
 *    - Education: 4, 11 (Overcomes 3, 8 intellectual scatter).
 *    - Foreign Settlement: 3, 9, 12 (Strictly forbids 11th house activation to prevent 12th negation).
 * 5. Planetary Ink Colors & Perfume Infusion:
 *    - Venus requires Turquoise/Sky Blue + application of natural perfume/attar.
 * 6. Zero Collateral Domestic Impact:
 *    - Biometric tattoo activates solely on the native, leaving household members unaffected.
 */

import { type ChartData } from "./calculations";

export type BiologicalGender = "male" | "female";

export type LifeGoal =
  | "marriage"
  | "health"
  | "wealth"
  | "career"
  | "property_buy"
  | "property_sell"
  | "education"
  | "foreign_travel"
  | "client_attraction";

export type TattooDuration = "temporary_dot" | "permanent_ink";

export interface PlanetTattooColor {
  planet: string;
  nameHindi: string;
  hexColor: string;
  colorName: string;
  colorNameHindi: string;
  symbol: string;
  sigilShape: string;
  medium: string;
  specialApplicationRitual?: string;
}

export interface AnatomicalCoordinate {
  signNumber: number; // 1 to 12
  signName: string;
  signNameHindi: string;
  primaryBodyPart: string;
  primaryBodyPartHindi: string;
  maleLateralization: "right";
  femaleLateralization: "left";
  bodyZoneDescription: string;
  exactPlacementHint: string;
}

export interface TattooPrescription {
  goal: LifeGoal;
  goalTitle: string;
  goalTitleHindi: string;
  targetHouses: number[];
  primarySignNumber: number;
  primarySignName: string;
  targetHouseResolved: number;
  anatomicalLocation: {
    side: "left" | "right";
    sideHindi: string;
    bodyPart: string;
    bodyPartHindi: string;
    detailedPlacement: string;
  };
  activatingPlanet: {
    name: string;
    hindiName: string;
    isUntenanted: boolean;
    reasoning: string;
    color: PlanetTattooColor;
  };
  tattooSpecs: {
    recommendedType: "micro_dot" | "planetary_symbol" | "sacred_sigil";
    size: string;
    durationRecommendation: TattooDuration;
    inkOrMarkerMedium: string;
    specialRitual: string;
  };
  houseSignificatorsExplanation: string;
  noCollateralImpactAssurance: string;
}

export interface AstroTattooAuditResult {
  nativeName: string;
  gender: BiologicalGender;
  chartLagna: {
    signNumber: number;
    signName: string;
  };
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    activePlanet: string;
    nakshatraLord: string;
    isUntenanted: boolean;
    reasoning: string;
  };
  activeGoal: LifeGoal;
  prescription: TattooPrescription;
  allPrescriptions: Record<LifeGoal, TattooPrescription>;
  allSignsAnatomy: AnatomicalCoordinate[];
  planetPalette: Record<string, PlanetTattooColor>;
}

// ── Classical Planet Palette ───────────────────────────────────────────────────

export const MASTER_PLANET_TATTOO_PALETTE: Record<string, PlanetTattooColor> = {
  Sun: {
    planet: "Sun",
    nameHindi: "सूर्य",
    hexColor: "#F97316", // Orange / Deep Amber
    colorName: "Saffron / Deep Orange",
    colorNameHindi: "नारंगी / केसरिया",
    symbol: "☉",
    sigilShape: "Circle with central bindu dot (सूर्य बिंदु)",
    medium: "Skin-safe orange marker or saffron paste",
    specialApplicationRitual: "रविवार प्रातः सूर्योदय समय, ॐ सूर्याय नमः का 7 बार स्मरण कर लगाएं।",
  },
  Moon: {
    planet: "Moon",
    nameHindi: "चंद्र",
    hexColor: "#E2E8F0", // Silver / Pure White
    colorName: "Pearl White / Pure Silver",
    colorNameHindi: "श्वेत / दूधिया सफेद",
    symbol: "☽",
    sigilShape: "Ascending crescent (अर्धचंद्र)",
    medium: "Skin-safe white body ink or pure sandalwood paste",
    specialApplicationRitual: "सोमवार संध्या या रात्रि के समय कच्चे दूध से धोकर बिंदु अंकित करें।",
  },
  Mars: {
    planet: "Mars",
    nameHindi: "मंगल",
    hexColor: "#DC2626", // Crimson Red
    colorName: "Deep Crimson Red",
    colorNameHindi: "गहरा लाल / सिंदूरी",
    symbol: "♂",
    sigilShape: "Upward pointing warrior arrow or solid red dot (मंगल त्रिकोण/बिंदु)",
    medium: "Skin-safe deep red marker or vermilion (सिंदूर)",
    specialApplicationRitual: "मंगलवार प्रातः 7 बजे, कच्चा दूध या गंगाजल से शुद्ध कर दाएं/बाएं अंग पर लगाएं।",
  },
  Mercury: {
    planet: "Mercury",
    nameHindi: "बुध",
    hexColor: "#16A34A", // Emerald Green
    colorName: "Emerald Green",
    colorNameHindi: "पन्ना हरा",
    symbol: "☿",
    sigilShape: "Winged caduceus or solid green circle (बुध हरित वृत्त)",
    medium: "Skin-safe emerald green marker pen",
    specialApplicationRitual: "बुधवार प्रातः तुलसी दल के रस अथवा शुद्ध जल से स्थान को साफ करके लगाएं।",
  },
  Jupiter: {
    planet: "Jupiter",
    nameHindi: "गुरु / बृहस्पति",
    hexColor: "#EAB308", // Golden Yellow
    colorName: "Golden Yellow",
    colorNameHindi: "पीला / स्वर्ण हल्दी",
    symbol: "♃",
    sigilShape: "Sacred cross of wisdom or golden crescent-cross (बृहस्पति चक्र)",
    medium: "Skin-safe golden yellow marker or pure turmeric paste",
    specialApplicationRitual: "गुरुवार प्रातः ॐ बृहस्पतये नमः जपते हुए लगाएं।",
  },
  Venus: {
    planet: "Venus",
    nameHindi: "शुक्र",
    hexColor: "#06B6D4", // Turquoise / Sky Blue (Firozi)
    colorName: "Turquoise / Firozi / Sky Blue",
    colorNameHindi: "फिरोज़ी / आसमानी नीला",
    symbol: "♀",
    sigilShape: "Radiant diamond or Venusian star (शुक्र हीरा / फिरोज़ी बिंदु)",
    medium: "Skin-safe turquoise marker pen + natural alcohol-free perfume/attar",
    specialApplicationRitual: "शुक्रवार को फिरोज़ी रंग से बिंदु बनाएं और उसके ऊपर प्राकृतिक इत्र (Perfume) अवश्य लगाएं।",
  },
  Saturn: {
    planet: "Saturn",
    nameHindi: "शनि",
    hexColor: "#1E293B", // Jet Black / Charcoal
    colorName: "Jet Black / Dark Charcoal",
    colorNameHindi: "काला / गहरा नीला-काला",
    symbol: "♄",
    sigilShape: "Solid black anchor dot or balanced sickle (शनि स्थिर बिंदु)",
    medium: "Skin-safe black marker or kajal",
    specialApplicationRitual: "शनिवार सूर्यास्त समय, सरसों के तेल की एक बूंद से उस स्थान को शुद्ध कर बिंदु लगाएं।",
  },
  Rahu: {
    planet: "Rahu",
    nameHindi: "राहु",
    hexColor: "#475569", // Smoky Charcoal / Slate
    colorName: "Smoky Charcoal / Dark Slate",
    colorNameHindi: "धूम्र वर्ण / गहरा स्मोकी",
    symbol: "☊",
    sigilShape: "Upward dragon node or smoky aura dot",
    medium: "Skin-safe dark charcoal or dark slate marker",
    specialApplicationRitual: "शनिवार या बुधवार रात्रि, शुद्ध जल से धोकर सावधानीपूर्वक अंकित करें।",
  },
  Ketu: {
    planet: "Ketu",
    nameHindi: "केतु",
    hexColor: "#78350F", // Earthy Brown / Ochre
    colorName: "Earthy Brown / Ochre",
    colorNameHindi: "भूरा / मटमैला",
    symbol: "☋",
    sigilShape: "Downward flag node or multi-dot cluster (ध्वज / बहु-बिंदु)",
    medium: "Skin-safe brown marker",
    specialApplicationRitual: "मंगलवार प्रातः ध्यान मुद्रा में बैठकर एकाग्र चित्त होकर लगाएं।",
  },
};

// ── 12 Signs Somatotopic Coordinates ──────────────────────────────────────────

export const ANATOMICAL_SIGNS: AnatomicalCoordinate[] = [
  {
    signNumber: 1,
    signName: "Aries",
    signNameHindi: "मेष",
    primaryBodyPart: "Head, Crown & Forehead",
    primaryBodyPartHindi: "सिर, मस्तक व ललाट",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Crown of the head, forehead, temples",
    exactPlacementHint: "ललाट के पार्श्व भाग (कनपटी) या सिर के शीर्ष पर",
  },
  {
    signNumber: 2,
    signName: "Taurus",
    signNameHindi: "वृषभ",
    primaryBodyPart: "Face, Neck & Throat",
    primaryBodyPartHindi: "चेहरा, गर्दन व कंठ",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Throat, vocal cords, neck curvature, right/left jawline",
    exactPlacementHint: "गर्दन के पार्श्व भाग (कंठ के पास) पर सूक्ष्म बिंदु",
  },
  {
    signNumber: 3,
    signName: "Gemini",
    signNameHindi: "मिथुन",
    primaryBodyPart: "Shoulders, Arms & Collarbone",
    primaryBodyPartHindi: "कंधे, बाहें व कॉलरबोन",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Clavicle, shoulder deltoid, upper arm",
    exactPlacementHint: "कंधे के शीर्ष अथवा ऊपरी बांह (डेल्टॉइड) पर",
  },
  {
    signNumber: 4,
    signName: "Cancer",
    signNameHindi: "कर्क",
    primaryBodyPart: "Chest & Heart Region",
    primaryBodyPartHindi: "छाती व हृदय प्रदेश",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Sternum side, pectoral / breast upper area",
    exactPlacementHint: "छाती के ऊपरी पार्श्व भाग (हृदय चक्र के पास) पर",
  },
  {
    signNumber: 5,
    signName: "Leo",
    signNameHindi: "सिंह",
    primaryBodyPart: "Upper Abdomen, Solar Plexus & Spine",
    primaryBodyPartHindi: "ऊपरी पेट, सूर्य चक्र व रीढ़",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Solar plexus, upper epigastric region, rib cage",
    exactPlacementHint: "नाभि से 2-3 इंच ऊपर पसलियों के पार्श्व भाग पर",
  },
  {
    signNumber: 6,
    signName: "Virgo",
    signNameHindi: "कन्या",
    primaryBodyPart: "Lower Abdomen, Waist & Navel",
    primaryBodyPartHindi: "निचला पेट, कमर व नाभि क्षेत्र",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Umbilical flanks, waist lateral crest",
    exactPlacementHint: "नाभि के पार्श्व अथवा कमर की साइड पर",
  },
  {
    signNumber: 7,
    signName: "Libra",
    signNameHindi: "तुला",
    primaryBodyPart: "Pelvis, Lower Back & Buttocks",
    primaryBodyPartHindi: "पेल्विस, निचली पीठ व कूल्हे",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Lumbar flanks, pelvic crest, iliac wing",
    exactPlacementHint: "कमर के निचले हिस्से अथवा पेल्विक क्रस्ट पर",
  },
  {
    signNumber: 8,
    signName: "Scorpio",
    signNameHindi: "वृश्चिक",
    primaryBodyPart: "Sacrum, Groin & Hip Joint",
    primaryBodyPartHindi: "गुप्तांग, पेल्विक जोड़ व जांघ संधि",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Hip socket joint, inguinal ligament region",
    exactPlacementHint: "जांघ और कूल्हे की संधि (Hip Joint) के पार्श्व भाग पर",
  },
  {
    signNumber: 9,
    signName: "Sagittarius",
    signNameHindi: "धनु",
    primaryBodyPart: "Thighs & Femur",
    primaryBodyPartHindi: "जांघें व फीमर हड्डी",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Upper thigh, quadriceps, outer thigh muscle",
    exactPlacementHint: "जांघ के ऊपरी बाहरी भाग (Outer Thigh) पर 0.5 से 1 इंच का बिंदु/प्रतीक",
  },
  {
    signNumber: 10,
    signName: "Capricorn",
    signNameHindi: "मकर",
    primaryBodyPart: "Knees & Kneecaps",
    primaryBodyPartHindi: "घुटने व घुटने की जोड़",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Patella edge, knee joint lateral side",
    exactPlacementHint: "घुटने के पार्श्व भाग (Outer Knee) पर",
  },
  {
    signNumber: 11,
    signName: "Aquarius",
    signNameHindi: "कुंभ",
    primaryBodyPart: "Calves, Shins & Ankles",
    primaryBodyPartHindi: "पिंडली (कफ मसल), नली व टखने",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Gastrocnemius calf muscle, shin lateral curve",
    exactPlacementHint: "पिंडली (Calf Muscle) के बाहरी मांसल भाग पर",
  },
  {
    signNumber: 12,
    signName: "Pisces",
    signNameHindi: "मीन",
    primaryBodyPart: "Feet, Soles & Toes",
    primaryBodyPartHindi: "पैर, तलवे व अंगूठे",
    maleLateralization: "right",
    femaleLateralization: "left",
    bodyZoneDescription: "Dorsal foot, heel side, ankle junction",
    exactPlacementHint: "पैर के ऊपरी पंजे अथवा टखने के ठीक नीचे",
  },
];

// ── Goal Configurations ────────────────────────────────────────────────────────

interface GoalMeta {
  title: string;
  titleHindi: string;
  primeHouse: number;
  supportingHouses: number[];
  forbiddenHouses?: number[];
  rationale: string;
  rationaleHindi: string;
}

export const GOAL_DEFINITIONS: Record<LifeGoal, GoalMeta> = {
  marriage: {
    title: "Marriage & Relationship Manifestation",
    titleHindi: "शीघ्र विवाह एवं दांपत्य सुख",
    primeHouse: 7,
    supportingHouses: [2, 7, 11],
    rationale: "House 7 is the primary house of marriage and spouse. House 2 binds the family, and House 11 fulfills the wish.",
    rationaleHindi: "सप्तम भाव विवाह और जीवनसाथी का मुख्य भाव है। दूसरा भाव कुटुंब और ग्यारहवां भाव मनोकामना पूर्ति का है।",
  },
  health: {
    title: "Vitality, Recovery & Disease Negation",
    titleHindi: "आरोग्य लाभ, रोग मुक्ति व जीवन ऊर्जा",
    primeHouse: 5,
    supportingHouses: [1, 5, 11],
    rationale: "House 5 strictly negates House 6 (disease/illness) by 12th-from-house rule, restoring cellular vitality and natural healing.",
    rationaleHindi: "पंचम भाव छठे भाव (रोग/शत्रु) का व्यय भाव (12वां) होकर बीमारी को पूरी तरह निगेट करता है और प्राण शक्ति लौटाता है।",
  },
  wealth: {
    title: "Liquid Wealth, Income & Profit Gains",
    titleHindi: "धन लाभ, बैंक बैलेंस व व्यवसायिक प्रचुरता",
    primeHouse: 2,
    supportingHouses: [2, 6, 11],
    rationale: "House 2 governs bank balance and liquid assets. House 6 governs daily revenue, and House 11 governs accumulated profits.",
    rationaleHindi: "द्वितीय भाव बैंक बैलेंस, छठा भाव दैनिक आवक और ग्यारहवां भाव महालाभ का है।",
  },
  career: {
    title: "Career Perfection, Authority & Promotion",
    titleHindi: "करियर परफेक्शन, पदोन्नति व मान-सम्मान",
    primeHouse: 10,
    supportingHouses: [6, 10, 11],
    rationale: "House 10 is the pinnacle of karmic status, authority, and professional excellence. Houses 6 and 11 sustain victory.",
    rationaleHindi: "दशम भाव कर्म, मान-प्रतिष्ठा और सत्ता का सर्वोच्च केंद्र है। छठा व ग्यारहवां भाव विजय प्रदान करते हैं।",
  },
  property_buy: {
    title: "Property, Land & Real Estate Acquisition",
    titleHindi: "भूमि, मकान व अचल संपत्ति प्राप्ति",
    primeHouse: 4,
    supportingHouses: [4, 11],
    rationale: "House 4 is fixed assets, land, and vehicle. House 11 completes the acquisition contract.",
    rationaleHindi: "चतुर्थ भाव भूमि, वाहन व अचल संपत्ति का है, और ग्यारहवां भाव रजिस्ट्री व प्राप्ति कराता है।",
  },
  property_sell: {
    title: "Property Sale, Liquidation & Buyer Arrival",
    titleHindi: "प्रॉपर्टी विक्रय, नकद रूपांतरण व ग्राहक आगमन",
    primeHouse: 3,
    supportingHouses: [3, 10, 7],
    rationale: "House 3 negates House 4 (letting go of asset), and House 10 represents the buyer's liquid wealth transferring to native.",
    rationaleHindi: "तृतीय भाव चौथे भाव को निगेट करके संपत्ति का स्वामित्व छोड़ता है और दशम भाव खरीदार के धन को आपके पास लाता है।",
  },
  education: {
    title: "Child Education, Memory & Academic Focus",
    titleHindi: "संतान विद्या, एकाग्रता व परीक्षा में सफलता",
    primeHouse: 4,
    supportingHouses: [4, 11, 9],
    rationale: "House 4 anchors core learning and grasping power. House 11 guarantees distinction, overcoming 3/8 mental scatter.",
    rationaleHindi: "चतुर्थ भाव बुनियादी शिक्षा और स्मरण शक्ति का है, ग्यारहवां भाव परीक्षा में डिस्टिंक्शन दिलाता है।",
  },
  foreign_travel: {
    title: "Foreign Relocation, Visa & International Settlement",
    titleHindi: "विदेश यात्रा, पीआर/वीजा व विदेशी सेटलमेंट",
    primeHouse: 12,
    supportingHouses: [3, 9, 12],
    forbiddenHouses: [11], // 11 strictly negates 12
    rationale: "Houses 3 (visas/documents), 9 (long voyages), and 12 (foreign soil). CAUTION: House 11 is strictly avoided because 11 negates 12!",
    rationaleHindi: "तृतीय (वीजा/दस्तावेज), नवम (लंबी यात्रा) और द्वादश (विदेशी भूमि)। ध्यान रहे: 11वें भाव को सक्रिय न करें क्योंकि 11वां 12वें को काटता है!",
  },
  client_attraction: {
    title: "Client Magnetism, Brand Aura & Public Pull",
    titleHindi: "क्लाइंट आकर्षण, ब्रांड प्रभाव व जन संपर्क",
    primeHouse: 7,
    supportingHouses: [3, 7, 10, 11],
    rationale: "House 7 is the open public and client sphere; House 3 is marketing, House 10 is prestige, and House 11 is ongoing contracts.",
    rationaleHindi: "सप्तम भाव जनता व ग्राहकों का है। तृतीय भाव मार्केटिंग और ग्यारहवां भाव निरंतर अनुबंध लाता है।",
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function getLagnaSignNumber(chart: ChartData): number {
  if (chart.houses && chart.houses.length > 0) {
    const h1 = chart.houses[0];
    if (typeof h1.signNumber === "number") return h1.signNumber;
    if (typeof h1.sign === "string") {
      const match = ANATOMICAL_SIGNS.find(s => s.signName.toLowerCase() === h1.sign.toLowerCase());
      if (match) return match.signNumber;
    }
  }
  if (chart.ascendant && typeof chart.ascendant.signNumber === "number") {
    return chart.ascendant.signNumber;
  }
  return 1; // Fallback Aries
}

function resolveSignAtHouse(lagnaSignNum: number, targetHouse: number): number {
  // Houses are 1-indexed. House 1 = Lagna, House 2 = (Lagna + 1 - 1) % 12 + 1, etc.
  return ((lagnaSignNum - 1 + (targetHouse - 1)) % 12) + 1;
}

/**
 * Check if a planet is Untenanted (no other planet occupies its nakshatras)
 */
export function checkIsUntenanted(chart: ChartData, planetName: string): boolean {
  if (!chart.planets || chart.planets.length === 0) return false;
  
  const occupiedStarLords = new Set<string>();
  chart.planets.forEach(p => {
    if (p.nakshatraLord) {
      occupiedStarLords.add(p.nakshatraLord.toLowerCase());
    }
  });

  return !occupiedStarLords.has(planetName.toLowerCase());
}

/**
 * Determine active planetary driver for tattoo activation.
 * Under KP shastra:
 * 1. If dasha lord is Untenanted, it delivers its own house results with highest velocity.
 * 2. If tenanted, it delivers results through its Nakshatra Lord.
 */
export function resolveActivatingPlanet(
  chart: ChartData,
  preferredPlanet?: string
): {
  planet: string;
  isUntenanted: boolean;
  starLord: string;
  reasoning: string;
} {
  const defaultPlanet = preferredPlanet || chart.dasha?.currentDasha?.mahadasha || "Mercury";
  const pData = chart.planets?.find(p => p.name.toLowerCase() === defaultPlanet.toLowerCase());

  const starLord = pData?.nakshatraLord || defaultPlanet;
  const isUntenanted = checkIsUntenanted(chart, defaultPlanet);

  if (isUntenanted) {
    return {
      planet: defaultPlanet,
      isUntenanted: true,
      starLord,
      reasoning: `${defaultPlanet} अनटेनेंटेड (Untenanted) है—इसके नक्षत्र में कोई अन्य ग्रह नहीं बैठा है। इसलिए यह अपने नक्षत्र स्वामी से पहले स्वयं के भावों का परिणाम 100% वेग से देगा।`,
    };
  }

  return {
    planet: starLord,
    isUntenanted: false,
    starLord,
    reasoning: `${defaultPlanet} तेनेंटेड ग्रह है, अतः केपी के मूल सिद्धांत के अनुसार यह अपना परिणाम अपने नक्षत्र स्वामी (${starLord}) के माध्यम से देगा।`,
  };
}

// ── Main Computation Function ──────────────────────────────────────────────────

export function generateAstroTattooAudit(
  chart: ChartData,
  options?: {
    gender?: BiologicalGender;
    activeGoal?: LifeGoal;
    selectedPlanet?: string;
  }
): AstroTattooAuditResult {
  const gender: BiologicalGender = options?.gender || (chart.gender?.toLowerCase() === "female" ? "female" : "male");
  const activeGoal: LifeGoal = options?.activeGoal || "marriage";

  const lagnaSignNum = getLagnaSignNumber(chart);
  const lagnaSign = ANATOMICAL_SIGNS[lagnaSignNum - 1];

  const currentMahadasha = chart.dasha?.currentDasha?.mahadasha || "Venus";
  const currentAntardasha = chart.dasha?.currentDasha?.antardasha || "Moon";

  const targetPlanetChoice = options?.selectedPlanet;
  const activatingResolution = targetPlanetChoice
    ? {
        planet: targetPlanetChoice,
        isUntenanted: checkIsUntenanted(chart, targetPlanetChoice),
        starLord: chart.planets?.find(p => p.name.toLowerCase() === targetPlanetChoice.toLowerCase())?.nakshatraLord || targetPlanetChoice,
        reasoning: `प्रत्यक्ष ग्रह चयन: ${targetPlanetChoice}।`,
      }
    : resolveActivatingPlanet(chart, currentMahadasha);

  const activatingPlanetName = activatingResolution.planet;
  const planetPalette = MASTER_PLANET_TATTOO_PALETTE[activatingPlanetName] || MASTER_PLANET_TATTOO_PALETTE.Mercury;

  const lateralSide: "left" | "right" = gender === "female" ? "left" : "right";
  const sideHindi = gender === "female" ? "बायां भाग (Left Side)" : "दायां भाग (Right Side)";

  // Compute prescriptions for all goals
  const allPrescriptions = {} as Record<LifeGoal, TattooPrescription>;

  (Object.keys(GOAL_DEFINITIONS) as LifeGoal[]).forEach(goalKey => {
    const meta = GOAL_DEFINITIONS[goalKey];
    const targetHouse = meta.primeHouse;
    const signNum = resolveSignAtHouse(lagnaSignNum, targetHouse);
    const signAnatomy = ANATOMICAL_SIGNS[signNum - 1];

    const isVenus = activatingPlanetName.toLowerCase() === "venus";
    const specialRitual = isVenus
      ? "शुक्र के लिए विशेष: फिरोज़ी/आसमानी बिंदु अंकित करने के बाद उसके ऊपर प्राकृतिक इत्र (Perfume) अवश्य लगाएं।"
      : planetPalette.specialApplicationRitual || "प्रातः स्नान उपरांत शांत मन से बिंदु अंकित करें।";

    allPrescriptions[goalKey] = {
      goal: goalKey,
      goalTitle: meta.title,
      goalTitleHindi: meta.titleHindi,
      targetHouses: meta.supportingHouses,
      primarySignNumber: signNum,
      primarySignName: signAnatomy.signName,
      targetHouseResolved: targetHouse,
      anatomicalLocation: {
        side: lateralSide,
        sideHindi,
        bodyPart: signAnatomy.primaryBodyPart,
        bodyPartHindi: signAnatomy.primaryBodyPartHindi,
        detailedPlacement: `${sideHindi} में ${signAnatomy.primaryBodyPartHindi} (${signAnatomy.exactPlacementHint})`,
      },
      activatingPlanet: {
        name: activatingPlanetName,
        hindiName: planetPalette.nameHindi,
        isUntenanted: activatingResolution.isUntenanted,
        reasoning: activatingResolution.reasoning,
        color: planetPalette,
      },
      tattooSpecs: {
        recommendedType: "micro_dot",
        size: "0.5 से 1.0 इंच (अथवा 3mm सूक्ष्म बिंदु)",
        durationRecommendation: "temporary_dot",
        inkOrMarkerMedium: planetPalette.medium,
        specialRitual,
      },
      houseSignificatorsExplanation: `${meta.rationaleHindi} आपकी कुंडली के अनुसार ${targetHouse}वें भाव में ${signAnatomy.signNameHindi} राशि (${signAnatomy.signName}) आ रही है, जो शरीर के ${signAnatomy.primaryBodyPartHindi} का प्रतिनिधित्व करती है।`,
      noCollateralImpactAssurance: "यह एक्टिवेशन सीधे जातक की बायोमेट्रिक ऊर्जा पर कार्य करता है। घर के वास्तु में वस्तु रखने की तरह परिवार के अन्य सदस्यों पर इसका कोई विपरीत प्रभाव नहीं पड़ता।",
    };
  });

  return {
    nativeName: chart.name || "Seeker",
    gender,
    chartLagna: {
      signNumber: lagnaSignNum,
      signName: lagnaSign.signName,
    },
    currentDasha: {
      mahadasha: currentMahadasha,
      antardasha: currentAntardasha,
      activePlanet: activatingPlanetName,
      nakshatraLord: activatingResolution.starLord,
      isUntenanted: activatingResolution.isUntenanted,
      reasoning: activatingResolution.reasoning,
    },
    activeGoal,
    prescription: allPrescriptions[activeGoal],
    allPrescriptions,
    allSignsAnatomy: ANATOMICAL_SIGNS,
    planetPalette: MASTER_PLANET_TATTOO_PALETTE,
  };
}
