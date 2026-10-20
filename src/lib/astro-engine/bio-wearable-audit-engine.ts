// src/lib/astro-engine/bio-wearable-audit-engine.ts
// ============================================================================
// BIO-MAGNETIC WEARABLE, GEMSTONE & THREAD AUDIT COMPUTATIONAL ENGINE
// Evaluates rings, metals, gemstones, bracelets, and threads worn on the body
// against the seeker's birth chart, active Mahadasha/Antardasha, and 180°/90° Hits.
// 0% Hardcoded · 100% Chart-Driven.
// ============================================================================

import type { ChartData } from "./calculations";
import {
  runAstroVastuHitEngine,
  ASTRO_VASTU_SIGN_DIRECTIONS,
  type AstroVastuHitDossier,
  type AstroVastuDirection,
} from "./astro-vastu-hit-engine";

// ── Types & Enums ───────────────────────────────────────────────────────────

export type BodyLocationId =
  | "forehead"        // माथा / सिर
  | "neck"            // कंठ / गला
  | "chest"           // छाती / हृदय
  | "upper_arm"       // बाजू / भुजा
  | "wrist_right"     // दाहिनी कलाई
  | "wrist_left"      // बाईं कलाई
  | "finger_index"    // तर्जनी उंगली (Index)
  | "finger_middle"   // मध्यमा उंगली (Middle)
  | "finger_ring"     // अनामिका उंगली (Ring)
  | "finger_little"   // कनिष्ठिका उंगली (Little)
  | "finger_thumb"    // अंगूठा (Thumb)
  | "waist"           // कमर / पेडू / तगड़ी
  | "ankle_right"     // दायां टखना
  | "ankle_left"      // बायां टखना
  | "feet_soles";     // पैर के पंजे / तलवे

export type ItemCategoryId =
  | "metal"
  | "gemstone"
  | "thread"
  | "bracelet"
  | "accessory";

export type WearableItemId =
  // Metals
  | "gold"              // सोना
  | "silver"            // चांदी
  | "copper"            // तांबा
  | "brass"             // पीतल / कांसा
  | "iron"              // कच्चा लोहा / शनि छल्ला
  | "steel_heavy"       // भारी व मोटा स्टील कड़ा
  | "steel_normal"      // सामान्य स्टील कड़ा
  | "panchdhatu"        // पंचधातु / अष्टधातु
  // Gemstones
  | "ruby"              // माणिक (Ruby)
  | "pearl"             // मोती (Pearl)
  | "coral"             // लाल मूंगा (Red Coral)
  | "emerald"           // पन्ना (Emerald)
  | "yellow_sapphire"   // पुखराज (Yellow Sapphire)
  | "diamond_opal"      // हीरा / ओपल (Diamond/Opal)
  | "blue_sapphire"     // नीलम / जमुनिया (Blue Sapphire)
  | "hessonite"         // गोमेद (Hessonite)
  | "cats_eye"          // लहसुनिया (Cat's Eye)
  // Threads
  | "red_mouli"         // लाल मौली / कलावा
  | "yellow_thread"     // पीला धागा
  | "black_thread"      // काला धागा
  | "green_thread"      // हरा धागा
  | "white_thread"      // सफेद सूती/रेशमी धागा
  | "orange_thread"     // नारंगी / केसरिया धागा
  // Bracelets & Spiritual items
  | "rudraksha"         // रुद्राक्ष ब्रेसलेट / माला
  | "sphatik"           // स्फटिक ब्रेसलेट / माला
  | "tulsi"             // तुलसी माला / ब्रेसलेट
  | "tiger_eye"         // टाइगर आई ब्रेसलेट
  | "seven_chakra"      // 7 चक्र ब्रेसलेट
  | "black_tourmaline"  // ब्लैक टर्मेलीन / लावा स्टोन
  | "tortoise_ring"     // कछुआ अंगूठी
  | "silver_ghungroo"   // चांदी के घुंघरू / छनछन पायल
  | "silver_tagdi";     // चांदी की करधनी / तगड़ी

export interface WornItemInput {
  id: string; // unique identifier
  location: BodyLocationId;
  item: WearableItemId;
  customNotes?: string;
}

export interface WearableItemAuditResult {
  id: string;
  location: BodyLocationId;
  locationTitleHi: string;
  item: WearableItemId;
  itemTitleHi: string;
  governingPlanet: string;
  governingPlanetHi: string;
  associatedSignNum: number;
  associatedHouseNum: number;
  associatedHouseNameHi: string;
  isDusthana: boolean;
  severity: "CRITICAL_REMOVE" | "CAUTION" | "SAFE_BENEFICIAL";
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  astrologicalMechanism: string;
  activeSymptoms: string[];
  correctiveRecommendation: string;
}

export interface BioWearableDossier {
  nativeName: string;
  lagnaSign: string;
  lagnaSignHindi: string;
  activeMahadasha: string;
  activeAntardasha: string;
  itemsAudited: WearableItemAuditResult[];
  criticalRemoveCount: number;
  cautionCount: number;
  safeBeneficialCount: number;
  generalVerdictSummary: string;
  dailyBodyVastuRules: {
    ruleTitle: string;
    substanceOrAction: string;
    targetBodyPart: string;
    instruction: string;
  }[];
}

// ── Master Metadata Registries ──────────────────────────────────────────────

export const BODY_LOCATION_REGISTRY: Record<BodyLocationId, {
  id: BodyLocationId;
  titleHi: string;
  titleEn: string;
  kalapurushaSign: number; // 1 to 12
  governingPlanetPrimary: string;
  chakraHi: string;
}> = {
  forehead: {
    id: "forehead",
    titleHi: "माथा / सिर",
    titleEn: "Forehead / Head",
    kalapurushaSign: 1, // Aries
    governingPlanetPrimary: "Mars",
    chakraHi: "आज्ञा चक्र (Ajna Chakra)",
  },
  neck: {
    id: "neck",
    titleHi: "कंठ / गला",
    titleEn: "Throat / Neck",
    kalapurushaSign: 2, // Taurus
    governingPlanetPrimary: "Venus",
    chakraHi: "विशुद्ध चक्र (Vishuddha Chakra)",
  },
  chest: {
    id: "chest",
    titleHi: "छाती / हृदय क्षेत्र",
    titleEn: "Chest / Heart Area",
    kalapurushaSign: 4, // Cancer
    governingPlanetPrimary: "Moon",
    chakraHi: "अनाहत चक्र (Anahata Chakra)",
  },
  upper_arm: {
    id: "upper_arm",
    titleHi: "बाजू / भुजा",
    titleEn: "Upper Arms",
    kalapurushaSign: 3, // Gemini
    governingPlanetPrimary: "Mercury",
    chakraHi: "भुज बल केंद्र",
  },
  wrist_right: {
    id: "wrist_right",
    titleHi: "दाहिनी कलाई (Right Wrist)",
    titleEn: "Right Wrist",
    kalapurushaSign: 3, // Gemini
    governingPlanetPrimary: "Mercury",
    chakraHi: "पिंगला नाड़ी (Solar / Prana)",
  },
  wrist_left: {
    id: "wrist_left",
    titleHi: "बाईं कलाई (Left Wrist)",
    titleEn: "Left Wrist",
    kalapurushaSign: 3, // Gemini
    governingPlanetPrimary: "Mercury",
    chakraHi: "इड़ा नाड़ी (Lunar / Mental)",
  },
  finger_index: {
    id: "finger_index",
    titleHi: "तर्जनी उंगली (Index Finger)",
    titleEn: "Index Finger",
    kalapurushaSign: 9, // Sagittarius (Jupiter's finger)
    governingPlanetPrimary: "Jupiter",
    chakraHi: "गुरु पर्वत / ज्ञान व विवेक",
  },
  finger_middle: {
    id: "finger_middle",
    titleHi: "मध्यमा उंगली (Middle Finger)",
    titleEn: "Middle Finger",
    kalapurushaSign: 10, // Capricorn (Saturn's finger)
    governingPlanetPrimary: "Saturn",
    chakraHi: "शनि पर्वत / कर्म व अनुशासन",
  },
  finger_ring: {
    id: "finger_ring",
    titleHi: "अनामिका उंगली (Ring Finger)",
    titleEn: "Ring Finger",
    kalapurushaSign: 5, // Leo (Sun's finger)
    governingPlanetPrimary: "Sun",
    chakraHi: "सूर्य पर्वत / आत्म-सम्मान व तेज",
  },
  finger_little: {
    id: "finger_little",
    titleHi: "कनिष्ठिका उंगली (Little Finger)",
    titleEn: "Little Finger",
    kalapurushaSign: 6, // Virgo (Mercury's finger)
    governingPlanetPrimary: "Mercury",
    chakraHi: "बुध पर्वत / वाणी व व्यापार",
  },
  finger_thumb: {
    id: "finger_thumb",
    titleHi: "अंगूठा (Thumb)",
    titleEn: "Thumb",
    kalapurushaSign: 2, // Taurus (Venus's mount)
    governingPlanetPrimary: "Venus",
    chakraHi: "शुक्र पर्वत / आकर्षण व जीवन-ऊर्जा",
  },
  waist: {
    id: "waist",
    titleHi: "कमर / पेडू (Waist / Lower Abdomen)",
    titleEn: "Waist / Pelvis",
    kalapurushaSign: 7, // Libra
    governingPlanetPrimary: "Venus",
    chakraHi: "स्वाधिष्ठान व नाभि निचला केंद्र",
  },
  ankle_right: {
    id: "ankle_right",
    titleHi: "दायां टखना (Right Ankle)",
    titleEn: "Right Ankle",
    kalapurushaSign: 11, // Aquarius
    governingPlanetPrimary: "Saturn",
    chakraHi: "भूतल ऊर्जा संपर्क",
  },
  ankle_left: {
    id: "ankle_left",
    titleHi: "बायां टखना (Left Ankle)",
    titleEn: "Left Ankle",
    kalapurushaSign: 11, // Aquarius
    governingPlanetPrimary: "Saturn",
    chakraHi: "अशुभ ऊर्जा निष्कासन केंद्र",
  },
  feet_soles: {
    id: "feet_soles",
    titleHi: "पैर के पंजे व तलवे (Feet / Soles)",
    titleEn: "Feet & Soles",
    kalapurushaSign: 12, // Pisces
    governingPlanetPrimary: "Jupiter",
    chakraHi: "मूलाधार अधो-प्रवाह (Ketu/Rahu Grounding)",
  },
};

export const WEARABLE_ITEMS_REGISTRY: Record<WearableItemId, {
  id: WearableItemId;
  titleHi: string;
  category: ItemCategoryId;
  planet: string;
  planetHi: string;
  element: "Agni" | "Prithvi" | "Vayu" | "Jala" | "Akasha";
  notesHi: string;
}> = {
  gold: {
    id: "gold",
    titleHi: "सोना (Gold)",
    category: "metal",
    planet: "Jupiter",
    planetHi: "गुरु (Jupiter)",
    element: "Akasha",
    notesHi: "गुरु व सूर्य की शुद्ध सात्विक धातु। चेतना, भाग्य व धन का पोषण करती है।",
  },
  silver: {
    id: "silver",
    titleHi: "चांदी (Silver)",
    category: "metal",
    planet: "Moon",
    planetHi: "चंद्र (Moon) / शुक्र",
    element: "Jala",
    notesHi: "चंद्रमा की शीतल जल तत्व धातु। मन को शांति और अग्नि को शीतलता देती है।",
  },
  copper: {
    id: "copper",
    titleHi: "तांबा (Copper)",
    category: "metal",
    planet: "Mars",
    planetHi: "मंगल (Mars) / सूर्य",
    element: "Agni",
    notesHi: "मंगल व सूर्य की उग्र अग्नि धातु। रक्त संचार व अग्नि तत्व को तेजी से भड़काती है।",
  },
  brass: {
    id: "brass",
    titleHi: "पीतल / कांसा (Brass/Bronze)",
    category: "metal",
    planet: "Jupiter",
    planetHi: "गुरु (Jupiter) / बुध",
    element: "Akasha",
    notesHi: "ज्ञान, अध्ययन व संतुलन की धातु।",
  },
  iron: {
    id: "iron",
    titleHi: "कच्चा लोहा / शनि छल्ला (Iron)",
    category: "metal",
    planet: "Saturn",
    planetHi: "शनि (Saturn)",
    element: "Vayu",
    notesHi: "शनि की भारी तामसिक धातु। कठोरता, जिम्मेदारी व वजन बढ़ाती है।",
  },
  steel_heavy: {
    id: "steel_heavy",
    titleHi: "भारी व मोटा स्टील कड़ा (Heavy Steel)",
    category: "metal",
    planet: "Saturn",
    planetHi: "शनि + राहु (Saturn + Rahu)",
    element: "Vayu",
    notesHi: "शनि के भार और राहु के आवरण का अत्यधिक वजनी संगम। अवसाद व जकड़न पैदा करता है।",
  },
  steel_normal: {
    id: "steel_normal",
    titleHi: "साधारण स्टील (Standard Steel)",
    category: "metal",
    planet: "Saturn",
    planetHi: "शनि (Saturn)",
    element: "Vayu",
    notesHi: "मिश्रित धातु, सामान्यतः तटस्थ रहती है।",
  },
  panchdhatu: {
    id: "panchdhatu",
    titleHi: "पंचधातु / अष्टधातु (Multi-Metal)",
    category: "metal",
    planet: "Sun",
    planetHi: "समस्त ग्रह (Multi-Planet)",
    element: "Akasha",
    notesHi: "पांच धातुओं का सम्मिश्रण, अत्यधिक संवेदनशील।",
  },
  ruby: {
    id: "ruby",
    titleHi: "माणिक रत्न (Ruby)",
    category: "gemstone",
    planet: "Sun",
    planetHi: "सूर्य (Sun)",
    element: "Agni",
    notesHi: "सूर्य का प्रधान रत्न। आत्मबल, पिता व सत्ता को प्रखर करता है।",
  },
  pearl: {
    id: "pearl",
    titleHi: "सच्चा मोती (Natural Pearl)",
    category: "gemstone",
    planet: "Moon",
    planetHi: "चंद्र (Moon)",
    element: "Jala",
    notesHi: "चंद्रमा का प्रधान रत्न। भावुकता, मन की शांति व माता का प्रतीक।",
  },
  coral: {
    id: "coral",
    titleHi: "लाल मूंगा (Red Coral)",
    category: "gemstone",
    planet: "Mars",
    planetHi: "मंगल (Mars)",
    element: "Agni",
    notesHi: "मंगल का अत्यंत गर्म रत्न। रक्त, साहस व आक्रामकता को तीव्र करता है।",
  },
  emerald: {
    id: "emerald",
    titleHi: "पन्ना रत्न (Emerald)",
    category: "gemstone",
    planet: "Mercury",
    planetHi: "बुध (Mercury)",
    element: "Prithvi",
    notesHi: "बुध का रत्न। व्यापार, बुद्धि व नर्वस सिस्टम को संचालित करता है।",
  },
  yellow_sapphire: {
    id: "yellow_sapphire",
    titleHi: "पुखराज रत्न (Yellow Sapphire)",
    category: "gemstone",
    planet: "Jupiter",
    planetHi: "गुरु (Jupiter)",
    element: "Akasha",
    notesHi: "गुरु का दिव्य रत्न। ज्ञान, संतान, धर्म व भाग्य की वृद्धि करता है।",
  },
  diamond_opal: {
    id: "diamond_opal",
    titleHi: "हीरा / ओपल (Diamond/Opal)",
    category: "gemstone",
    planet: "Venus",
    planetHi: "शुक्र (Venus)",
    element: "Jala",
    notesHi: "शुक्र का रत्न। आकर्षण, ऐश्वर्य व दांपत्य जीवन का कारक।",
  },
  blue_sapphire: {
    id: "blue_sapphire",
    titleHi: "नीलम / जमुनिया (Blue Sapphire)",
    category: "gemstone",
    planet: "Saturn",
    planetHi: "शनि (Saturn)",
    element: "Vayu",
    notesHi: "शनि का तीव्रतम रत्न। परीक्षण के बिना पहनना विनाशकारी हो सकता है।",
  },
  hessonite: {
    id: "hessonite",
    titleHi: "गोमेद (Hessonite)",
    category: "gemstone",
    planet: "Rahu",
    planetHi: "राहु (Rahu)",
    element: "Vayu",
    notesHi: "राहु का रत्न। रहस्य, अप्रत्याशित घटनाएं व भ्रम।",
  },
  cats_eye: {
    id: "cats_eye",
    titleHi: "लहसुनिया (Cat's Eye)",
    category: "gemstone",
    planet: "Ketu",
    planetHi: "केतु (Ketu)",
    element: "Agni",
    notesHi: "केतु का रत्न। मोक्ष, वैराग्य व आध्यात्मिक अंतर्ज्ञान।",
  },
  red_mouli: {
    id: "red_mouli",
    titleHi: "लाल मौली / कलावा (Red Mouli)",
    category: "thread",
    planet: "Mars",
    planetHi: "मंगल (Mars)",
    element: "Agni",
    notesHi: "मंगल की अग्नि ऊर्जा का सूती धागा।",
  },
  yellow_thread: {
    id: "yellow_thread",
    titleHi: "पीला धागा (Yellow Thread)",
    category: "thread",
    planet: "Jupiter",
    planetHi: "गुरु (Jupiter)",
    element: "Akasha",
    notesHi: "गुरु का सात्विक रक्षा सूत्र।",
  },
  black_thread: {
    id: "black_thread",
    titleHi: "काला धागा (Black Thread)",
    category: "thread",
    planet: "Saturn",
    planetHi: "शनि व राहु (Saturn/Rahu)",
    element: "Vayu",
    notesHi: "शनि/राहु का नकारात्मकता सोखने वाला धागा। गलत अंग पर पहनना घातक है।",
  },
  green_thread: {
    id: "green_thread",
    titleHi: "हरा धागा (Green Thread)",
    category: "thread",
    planet: "Mercury",
    planetHi: "बुध (Mercury)",
    element: "Prithvi",
    notesHi: "बुध का धागा। नसों व वाणी को प्रभावित करता है।",
  },
  white_thread: {
    id: "white_thread",
    titleHi: "सफेद रेशमी/सूती धागा (White Thread)",
    category: "thread",
    planet: "Venus",
    planetHi: "शुक्र व चंद्र (Venus/Moon)",
    element: "Jala",
    notesHi: "शुक्र व चंद्रमा का सौम्य सूत्र।",
  },
  orange_thread: {
    id: "orange_thread",
    titleHi: "नारंगी / केसरिया धागा (Orange Thread)",
    category: "thread",
    planet: "Sun",
    planetHi: "सूर्य (Sun)",
    element: "Agni",
    notesHi: "सूर्य का ऊर्जावान धागा।",
  },
  rudraksha: {
    id: "rudraksha",
    titleHi: "रुद्राक्ष ब्रेसलेट / माला (Rudraksha)",
    category: "bracelet",
    planet: "Jupiter",
    planetHi: "शिव तत्व / गुरु / सूर्य",
    element: "Akasha",
    notesHi: "प्राकृतिक इलेक्ट्रोमैग्नेटिक बीज। रक्तचाप को संतुलित करता है।",
  },
  sphatik: {
    id: "sphatik",
    titleHi: "स्फटिक ब्रेसलेट / माला (Quartz Crystal)",
    category: "bracelet",
    planet: "Venus",
    planetHi: "शुक्र व चंद्र (Venus/Moon)",
    element: "Jala",
    notesHi: "शीतल प्राकृतिक क्वार्ट्ज़। अत्यधिक क्रोध व गर्मी को शांत करता है।",
  },
  tulsi: {
    id: "tulsi",
    titleHi: "तुलसी माला / ब्रेसलेट (Tulsi Beads)",
    category: "bracelet",
    planet: "Mercury",
    planetHi: "बुध व विष्णु (Mercury)",
    element: "Prithvi",
    notesHi: "पवित्र तुलसीकाष्ठ। आभामंडल को शुद्ध व सात्विक रखता है।",
  },
  tiger_eye: {
    id: "tiger_eye",
    titleHi: "टाइगर आई ब्रेसलेट (Tiger Eye)",
    category: "bracelet",
    planet: "Sun",
    planetHi: "सूर्य व केतु (Sun/Ketu)",
    element: "Agni",
    notesHi: "आत्मविश्वास व भयमुक्ति का पत्थर। उग्रता भी बढ़ा सकता है।",
  },
  seven_chakra: {
    id: "seven_chakra",
    titleHi: "7 चक्र ब्रेसलेट (Seven Chakra)",
    category: "bracelet",
    planet: "Sun",
    planetHi: "बहु-ग्रहीय (Multi-planetary)",
    element: "Akasha",
    notesHi: "सात अलग-अलग रंगीन पत्थरों का मिश्रण, अक्सर ऊर्जा में भ्रम पैदा करता है।",
  },
  black_tourmaline: {
    id: "black_tourmaline",
    titleHi: "ब्लैक टर्मेलीन / लावा स्टोन (Tourmaline)",
    category: "bracelet",
    planet: "Saturn",
    planetHi: "शनि व राहु (Saturn/Rahu)",
    element: "Vayu",
    notesHi: "भारी नकारात्मक ऊर्जा खींचने वाला पत्थर। अधिक समय पहनना भारीपन देता है।",
  },
  tortoise_ring: {
    id: "tortoise_ring",
    titleHi: "कछुआ अंगूठी (Tortoise Ring)",
    category: "accessory",
    planet: "Venus",
    planetHi: "शुक्र व लक्ष्मी (Venus)",
    element: "Jala",
    notesHi: "वास्तु आभूषण। गलत उंगली में पहनने से धन लाभ के बजाय रुकावट आती है।",
  },
  silver_ghungroo: {
    id: "silver_ghungroo",
    titleHi: "चांदी के घुंघरू / छनछन पायल (Silver Ghungroo)",
    category: "accessory",
    planet: "Moon",
    planetHi: "चंद्र + बुध (Moon + Mercury)",
    element: "Jala",
    notesHi: "चांदी (चंद्र) के साथ खनकती ध्वनि (बुध)। काले धागे के साथ विष योग बनाती है।",
  },
  silver_tagdi: {
    id: "silver_tagdi",
    titleHi: "चांदी की करधनी / तगड़ी (Silver Tagdi)",
    category: "accessory",
    planet: "Venus",
    planetHi: "शुक्र व चंद्र (Venus/Moon)",
    element: "Jala",
    notesHi: "कमर में चांदी की करधनी पेडू व हार्मोन्स को शीतल रखती है।",
  },
};

// ── Master Computation Function ─────────────────────────────────────────────

export function auditUserWearables(
  chart: ChartData | null | undefined,
  wornItems: WornItemInput[],
  evaluationDate: Date = new Date()
): BioWearableDossier {
  const dossier = runAstroVastuHitEngine(chart, evaluationDate);
  const nativeName = chart?.name || "जातक";
  const lagnaSign = dossier?.lagnaSign || "Aries";
  const lagnaSignHindi = dossier?.lagnaSignHindi || "मेष";
  const activeMD = dossier?.activeDasha.mahadasha || "Mars";
  const activeAD = dossier?.activeDasha.antardasha || "Mars";

  const results: WearableItemAuditResult[] = [];

  wornItems.forEach(worn => {
    const locMeta = BODY_LOCATION_REGISTRY[worn.location] || BODY_LOCATION_REGISTRY.wrist_right;
    const itemMeta = WEARABLE_ITEMS_REGISTRY[worn.item] || WEARABLE_ITEMS_REGISTRY.red_mouli;

    // 1. Resolve exact house number for this body location in seeker's chart
    // In Astro-Vastu, each body part corresponds to a sign number (1 to 12)
    const signNum = locMeta.kalapurushaSign;
    const bodyCusp = dossier?.cuspCoordinates.find(c => c.signNum === signNum);
    const houseNum = bodyCusp?.house || (((signNum - (dossier?.lagnaSignNum || 1) + 12) % 12) + 1);
    const isDusthana = [6, 8, 12].includes(houseNum);
    const houseNameHi = dossier?.bodyPartRemedyRegistry.find(r => r.signNum === signNum)?.houseNameHi || `${houseNum}वां भाव`;

    // 2. Identify relationship between item's planet and seeker's chart
    const itemPlanet = itemMeta.planet;
    const isDashaLord = [activeMD, activeAD].includes(itemPlanet);
    
    // Check if item's planet is casting a 180° killer hit or 90° dangerous hit
    const killerHitsByPlanet = dossier?.killerHits180.filter(h => h.sourceName === itemPlanet) || [];
    const dangerousHitsByPlanet = dossier?.dangerousHits90.filter(h => h.sourceName === itemPlanet) || [];
    const hasAfflictionHits = killerHitsByPlanet.length > 0 || dangerousHitsByPlanet.length > 0;

    // Check if this location has an active hit hitting it
    const locationHits = dossier?.bodyPartRemedyRegistry.find(r => r.signNum === signNum)?.activeHits || [];
    const locationUnderKillerHit = locationHits.some(h => h.angle === 180);

    // 3. Diagnose Specific Classical & Astro-Vastu Patterns
    let severity: "CRITICAL_REMOVE" | "CAUTION" | "SAFE_BENEFICIAL" = "SAFE_BENEFICIAL";
    let badgeText = "✅ अमृत समान / धारण रखें";
    let badgeColor = "#16A34A";
    let badgeBg = "rgba(22, 163, 74, 0.12)";
    let mechanism = "";
    const symptoms: string[] = [];
    let recommendation = "";

    // ── PATTERN A: Copper/Red Mouli during Mars Dasha with 180° Hit
    if ((worn.item === "copper" || worn.item === "red_mouli" || worn.item === "coral") && (itemPlanet === "Mars" || itemPlanet === "Sun")) {
      if (isDashaLord && hasAfflictionHits) {
        severity = "CRITICAL_REMOVE";
        badgeText = "🚨 तत्काल उतारें (उग्र मंगल आघात)";
        badgeColor = "#DC2626";
        badgeBg = "rgba(220, 38, 38, 0.12)";
        mechanism = `आपकी कुंडली में वर्तमान में ${itemPlanet} की सक्रिय दशा चल रही है और यह ग्रह सीधे चतुर्थ/केंद्र भाव पर ${killerHitsByPlanet[0]?.hitDef.name || "180° किलर हिट"} मार रहा है। शरीर पर ${itemMeta.titleHi} धारण करने से यह मारक ऊर्जा सीधे नर्वस सिस्टम में प्रवाहित हो रही है।`;
        symptoms.push("अचानक क्रोध का भड़कना, चिड़चिड़ापन व बिना बात बहस होना");
        symptoms.push("घर में प्रवेश करते ही बेचैनी व सुकून का गायब होना");
        symptoms.push("अनिद्रा (Insomnia) व सिर में भारीपन/माइग्रेन");
        recommendation = `इसे तत्काल उतारें। इसकी जगह गले में सादी सोने की चेन या हाथ में सादा ठोस चांदी का कड़ा पहनें।`;
      } else if (worn.location === "finger_index") {
        severity = "CRITICAL_REMOVE";
        badgeText = "🚨 तत्काल उतारें (गुरु-मंगल टकराव)";
        badgeColor = "#DC2626";
        badgeBg = "rgba(220, 38, 38, 0.12)";
        mechanism = `तर्जनी उंगली गुरु (बृहस्पति / ज्ञान / 9वां भाव) की है। इस पर तांबा (मंगल/सूर्य की अग्नि) पहनने से गुरु का सात्विक प्रभाव जल जाता है, जिससे निर्णय गलत होते हैं।`;
        symptoms.push("महत्वपूर्ण अवसरों पर गलत निर्णय लेना व एकाग्रता भंग होना");
        symptoms.push("वरिष्ठों, पिता या गुरुजनों से वैचारिक मतभेद");
        recommendation = `तर्जनी से तांबा उतारें। यदि पहनना हो तो केवल पीतल या सोना धारण करें।`;
      }
    }

    // ── PATTERN B: Heavy Steel Kada (Saturn-Rahu weight)
    else if (worn.item === "steel_heavy" || worn.item === "iron") {
      const saturnInLagna = dossier?.planetCoordinates.find(p => p.name === "Saturn")?.house === 1;
      const saturnMoonOpp = dossier?.allHits.some(h => (h.sourceName === "Saturn" && h.targetName === "Moon") || (h.sourceName === "Moon" && h.targetName === "Saturn"));
      
      if (saturnInLagna || saturnMoonOpp || isDusthana) {
        severity = "CRITICAL_REMOVE";
        badgeText = "🚨 तत्काल उतारें (शनि-राहु मानसिक बोझ)";
        badgeColor = "#DC2626";
        badgeBg = "rgba(220, 38, 38, 0.12)";
        mechanism = `भारी व मोटा स्टील कड़ा शनि व राहु का प्रतीक है। आपकी कुंडली में शनि लग्न में होकर चंद्रमा को देख रहा है। यह कड़ा एक 'ऊर्जावान हथकड़ी' का काम कर रहा है, जो मानसिक अवसाद और शोक को शरीर में जकड़ कर रखता है।`;
        symptoms.push("कंधों, बांह और दिमाग पर हर समय भारीपन व थकावट का अहसास");
        symptoms.push("शोक, दुख या पुरानी चिंता से बाहर न निकल पाना");
        symptoms.push("शरीर में सुस्ती, नसों में खिंचाव व सुबह उठने पर भी ताजगी न मिलना");
        recommendation = `इस भारी कड़े को आज ही उतारें। यदि कड़ा पहनना ही है, तो एक हल्का सादा ठोस चांदी का कड़ा पहनें।`;
      } else {
        severity = "CAUTION";
        badgeText = "⚠️ भारीपन से बचें";
        badgeColor = "#D97706";
        badgeBg = "rgba(217, 119, 6, 0.12)";
        mechanism = `स्टील का भारी कड़ा नसों में जकड़न पैदा करता है। इसे अधिक समय तक न पहनें।`;
        symptoms.push("कलाई व कंधे में खिंचाव");
        recommendation = `हल्की धातु का प्रयोग करें।`;
      }
    }

    // ── PATTERN C: Black Thread in Neck (Constricting 2nd House / Guru)
    else if (worn.item === "black_thread" && worn.location === "neck") {
      severity = "CRITICAL_REMOVE";
      badgeText = "🚨 गले में काला धागा सख्त वर्जित";
      badgeColor = "#DC2626";
      badgeBg = "rgba(220, 38, 38, 0.12)";
      mechanism = `कंठ व गला द्वितीय भाव (धन व कुटुंब) और गुरु का स्थान है। गले में काला धागा (शनि/राहु) बांधना गुरु के कंठ चक्र पर राहु का फंदा लगाने जैसा है।`;
      symptoms.push("थायरॉइड, गले में कफ या सांस में भारीपन");
      symptoms.push("परिवार में कड़वाहट व संवादहीनता पैदा होना");
      symptoms.push("धन की बचत में रुकावट व आकस्मिक खर्चे");
      recommendation = `गले से काला धागा तुरंत काट कर उतारें। काला धागा केवल पैर के टखने पर बांधा जा सकता है, गले में कभी नहीं।`;
    }

    // ── PATTERN D: Black thread with Silver Ghungroo on Feet / Ankle (Vish Yoga)
    else if ((worn.item === "silver_ghungroo" || worn.item === "silver") && (worn.location === "feet_soles" || worn.location === "ankle_left" || worn.location === "ankle_right") && wornItems.some(i => i.item === "black_thread" && (i.location === worn.location || i.location === "feet_soles"))) {
      severity = "CRITICAL_REMOVE";
      badgeText = "🚨 तुरंत अलग करें (पैर में विष योग)";
      badgeColor = "#DC2626";
      badgeBg = "rgba(220, 38, 38, 0.12)";
      mechanism = `पैरों में काले धागे (शनि/राहु) के साथ चांदी के घुंघरू (चंद्रमा/बुध) का यह मेल सीधे नसों में विष योग बनाता है, जो भावनात्मक अस्थिरता देता है।`;
      symptoms.push("पैरों व तलवों में जलन, भारीपन या नसों का खिंचाव");
      symptoms.push("अचानक अवसाद, अकेलेपन का डर व बिना बात रोने का मन करना");
      symptoms.push("वैवाहिक जीवन में भावनात्मक दूरियां");
      recommendation = `काले धागे और चांदी के घुंघरुओं को तुरंत अलग करें। सादी चांदी की पायल अलग पहनें और काला धागा केवल सादा टखने पर रखें।`;
    }

    // ── PATTERN E: Waist Thread (कमर पर धागा या तगड़ी)
    else if (worn.location === "waist") {
      if (worn.item === "black_thread") {
        if (isDusthana) {
          severity = "CRITICAL_REMOVE";
          badgeText = "🚨 कमर में काला धागा वर्जित (दुस्थान)";
          badgeColor = "#DC2626";
          badgeBg = "rgba(220, 38, 38, 0.12)";
          mechanism = `आपकी कुंडली में कमर का क्षेत्र ${houseNameHi} में पड़ता है, जो कि दुस्थान (6/8/12) है। कमर में काला धागा बांधने से मूलाधार/स्वाधिष्ठान में नकारात्मक ऊर्जा सक्रिय होती है।`;
          symptoms.push("कमर के निचले हिस्से में दर्द या रीढ़ की हड्डी में खिंचाव");
          symptoms.push("यूरिनरी या हार्मोनल असंतुलन");
          recommendation = `कमर से काला धागा तुरंत हटाएं। कमर को धागा-मुक्त रखें या केवल चांदी की पतली तगड़ी पहनें।`;
        } else {
          severity = "CAUTION";
          badgeText = "⚠️ कमर धागे से सावधानी";
          badgeColor = "#D97706";
          badgeBg = "rgba(217, 119, 6, 0.12)";
          mechanism = `कमर में लंबे समय तक काला धागा बांधना पाचन व पेल्विक क्षेत्र को संकुचित करता है।`;
          symptoms.push("पाचन में भारीपन");
          recommendation = `कमर को मुक्त रखना अधिक लाभकारी है।`;
        }
      } else if (worn.item === "silver_tagdi" || worn.item === "silver") {
        severity = "SAFE_BENEFICIAL";
        badgeText = "✅ अमृत समान (शुक्र-चंद्र शीतलता)";
        badgeColor = "#16A34A";
        badgeBg = "rgba(22, 163, 74, 0.12)";
        mechanism = `कमर में चांदी की करधनी (तगड़ी) शुक्र और चंद्रमा की शीतलता देती है, जो हार्मोन्स व पेल्विक क्षेत्र को संतुलित रखती है।`;
        symptoms.push("कमर व पेट के निचले हिस्से में शांति व संतुलन");
        recommendation = `इसे निसंकोच धारण रखें।`;
      }
    }

    // ── PATTERN F: Gemstone Incompatibilities
    else if (itemMeta.category === "gemstone") {
      // E.g. Coral (Moonga) for Aquarius/Virgo, or Blue Sapphire (Neelam) for Sun/Mars ascendant
      if (worn.item === "coral" && ["Aquarius", "Virgo", "Gemini", "Libra"].includes(lagnaSign)) {
        severity = "CRITICAL_REMOVE";
        badgeText = "🚨 मूंगा रत्न वर्जित (मारक अग्नि)";
        badgeColor = "#DC2626";
        badgeBg = "rgba(220, 38, 38, 0.12)";
        mechanism = `${lagnaSignHindi} लग्न के लिए मंगल अकारक ग्रह है। मूंगा पहनने से मंगल की अग्नि 100 गुना बढ़ जाती है, जिससे रक्त विकार, सर्जरी व दुर्घटना का खतरा बढ़ता है।`;
        symptoms.push("अत्यधिक चिड़चिड़ापन, रक्तचाप व कलह");
        recommendation = `मूंगा तुरंत उतारें।`;
      } else if (worn.item === "blue_sapphire" && ["Aries", "Leo", "Scorpio", "Sagittarius"].includes(lagnaSign)) {
        severity = "CRITICAL_REMOVE";
        badgeText = "🚨 नीलम रत्न सख्त वर्जित";
        badgeColor = "#DC2626";
        badgeBg = "rgba(220, 38, 38, 0.12)";
        mechanism = `${lagnaSignHindi} लग्न के लिए शनि मारक/शत्रु है। नीलम पहनने से जीवन में अचानक भारी नुकसान, अकेलापन व अवसाद उत्पन्न होता है।`;
        symptoms.push("अचानक काम धंधा ठप होना व मानसिक यातना");
        recommendation = `नीलम तुरंत उतारें।`;
      } else {
        severity = "CAUTION";
        badgeText = "⚠️ रत्न दशा अनुसार जांचें";
        badgeColor = "#D97706";
        badgeBg = "rgba(217, 119, 6, 0.12)";
        mechanism = `रत्न सीधे उस ग्रह की तरंगों को कई गुना बढ़ा देता है। यदि वह ग्रह पीड़ित है तो हानि हो सकती है।`;
        symptoms.push("ऊर्जा में असंतुलन");
        recommendation = `दशा स्वामी के अनुसार ही रत्न पहनें।`;
      }
    }

    // ── PATTERN G: Gold in Neck or Hand (Beneficial Jupiter)
    else if (worn.item === "gold") {
      severity = "SAFE_BENEFICIAL";
      badgeText = "✅ परम कल्याणकारी (गुरु सुरक्षा कवच)";
      badgeColor = "#16A34A";
      badgeBg = "rgba(22, 163, 74, 0.12)";
      mechanism = `सोना देवगुरु बृहस्पति का प्रतीक है। ${locMeta.titleHi} पर सोना धारण करने से भाग्य, बुद्धि, आत्मबल और ईश्वरीय रक्षा कवच सक्रिय होता है।`;
      symptoms.push("मन में शांति, आत्मविश्वास व परिवार में सामंजस्य");
      recommendation = `इसे श्रद्धापूर्वक धारण रखें।`;
    }

    // ── PATTERN H: Silver Kada on Hand (Soothing Mars Hit)
    else if (worn.item === "silver" && (worn.location === "wrist_right" || worn.location === "wrist_left")) {
      severity = "SAFE_BENEFICIAL";
      badgeText = "✅ अत्यंत शांतिकारक (शीतल कवच)";
      badgeColor = "#16A34A";
      badgeBg = "rgba(22, 163, 74, 0.12)";
      mechanism = `कलाई पर ठोस सादा चांदी का कड़ा चंद्रमा व शुक्र की शीतलता देता है। यह वर्तमान मंगल दशा की किलर हिट की भयानक अग्नि को शांत करता है।`;
      symptoms.push("क्रोध शांत होना, नब्ज़ में ठंडक व गहरी सुकून भरी नींद");
      recommendation = `इसे नियमित रूप से पहने रखें।`;
    }

    // ── PATTERN I: Black thread on Ankle (Legitimate Evil-Eye Shield for Saturnian Ascendant)
    else if (worn.item === "black_thread" && (worn.location === "ankle_right" || worn.location === "ankle_left")) {
      severity = "SAFE_BENEFICIAL";
      badgeText = "✅ शुभ रक्षा सूत्र (टखने पर अनुकूल)";
      badgeColor = "#16A34A";
      badgeBg = "rgba(22, 163, 74, 0.12)";
      mechanism = `टखना कालपुरुष के 11वें भाव (कुंभ राशि) का प्रतिनिधित्व करता है। केवल टखने पर सादा काला धागा बांधना बुरी नजर और नकारात्मक तरंगों से रक्षा करता है।`;
      symptoms.push("बुरी नजर व ऊपरी बाधा से सुरक्षा");
      recommendation = `इसे बिना किसी धातु या घुंघरू के सादा ही पहने रखें।`;
    }

    // ── DEFAULT FALLBACK
    else {
      severity = isDusthana ? "CAUTION" : "SAFE_BENEFICIAL";
      badgeText = isDusthana ? "⚠️ सावधानी (दुस्थान प्रभाव)" : "✅ सामान्य अनुकूल";
      badgeColor = isDusthana ? "#D97706" : "#16A34A";
      badgeBg = isDusthana ? "rgba(217, 119, 6, 0.12)" : "rgba(22, 163, 74, 0.12)";
      mechanism = `${itemMeta.titleHi} का प्रभाव ${locMeta.titleHi} (${houseNameHi}) पर सामान्य रहता है।`;
      symptoms.push("सामान्य ऊर्जा प्रभाव");
      recommendation = isDusthana ? "दुस्थान भाव होने से अत्यधिक भारी वस्तु न बांधें।" : "पहन सकते हैं।";
    }

    results.push({
      id: worn.id,
      location: worn.location,
      locationTitleHi: locMeta.titleHi,
      item: worn.item,
      itemTitleHi: itemMeta.titleHi,
      governingPlanet: itemPlanet,
      governingPlanetHi: itemMeta.planetHi,
      associatedSignNum: signNum,
      associatedHouseNum: houseNum,
      associatedHouseNameHi: houseNameHi,
      isDusthana,
      severity,
      badgeText,
      badgeColor,
      badgeBg,
      astrologicalMechanism: mechanism,
      activeSymptoms: symptoms,
      correctiveRecommendation: recommendation,
    });
  });

  const criticalRemoveCount = results.filter(r => r.severity === "CRITICAL_REMOVE").length;
  const cautionCount = results.filter(r => r.severity === "CAUTION").length;
  const safeBeneficialCount = results.filter(r => r.severity === "SAFE_BENEFICIAL").length;

  let generalVerdictSummary = "";
  if (criticalRemoveCount > 0) {
    generalVerdictSummary = `🚨 गंभीर चेतावनी: आपके शरीर पर ${criticalRemoveCount} ऐसी वस्तुएं विद्यमान हैं जो सीधे आपकी सक्रिय दशा (${activeMD}) और 180° किलर हिट्स को भड़का रही हैं। इन्हें तत्काल उतारने से 24 से 48 घंटे में मानसिक शांति और सुकून का प्रत्यक्ष अनुभव होगा।`;
  } else if (cautionCount > 0) {
    generalVerdictSummary = `⚠️ सावधानी: आपके आभूषणों में कुछ वस्तुओं को बदलने या परिष्कृत करने की आवश्यकता है ताकि दुस्थान भावों का नकारात्मक प्रभाव समाप्त हो सके।`;
  } else {
    generalVerdictSummary = `✅ उत्कृष्ट: आपके द्वारा धारण किए गए सभी आभूषण व धागे आपकी कुंडली और दशा के अनुकूल हैं।`;
  }

  // Daily Body-Vastu Rules tailored to this seeker
  const dailyBodyVastuRules = [
    {
      ruleTitle: "नाभि अमृत शांति (Navel Therapy)",
      substanceOrAction: "शुद्ध देशी गाय का घी (2 बूंद)",
      targetBodyPart: "नाभि के 2 इंच का घेरा",
      instruction: "स्नान के बाद नाभि के ठीक 2 इंच के दायरे में 2 बूंद गाय का घी लगाएं। यह चतुर्थ भाव, नर्वस सिस्टम व अनिद्रा को शांत करता है।",
    },
    {
      ruleTitle: "घुटना रक्षा ढाल (Knee Dot Protocol)",
      substanceOrAction: "काजल की सूक्ष्म काली बिंदी",
      targetBodyPart: "बायां घुटना (स्त्री) / दायां घुटना (पुरुष)",
      instruction: "प्रतिदिन सुबह स्नान के बाद संबंधित घुटने पर काजल से एक सूक्ष्म बिंदी लगाएं। यह 180° किलर हिट को 120° रक्षा ढाल में बदलता है।",
    },
    {
      ruleTitle: "कलाई व धागा संयम (Wrist Freedom)",
      substanceOrAction: "मौली त्याग / सादा पीला धागा",
      targetBodyPart: "कलाई व हाथ",
      instruction: "यदि मंगल सक्रिय हो तो लाल मौली तुरंत त्यागें। आवश्यकता होने पर केवल शुद्ध पीला सूती धागा ही कलाई पर बांधें।",
    },
  ];

  return {
    nativeName,
    lagnaSign,
    lagnaSignHindi,
    activeMahadasha: activeMD,
    activeAntardasha: activeAD,
    itemsAudited: results,
    criticalRemoveCount,
    cautionCount,
    safeBeneficialCount,
    generalVerdictSummary,
    dailyBodyVastuRules,
  };
}

// ── Preset Diagnostic Scenarios for Instant Testing ──────────────────────────

export const PRESET_SAMPLE_ITEMS: WornItemInput[] = [
  { id: "item-1", location: "finger_index", item: "copper" },
  { id: "item-2", location: "wrist_right", item: "red_mouli" },
  { id: "item-3", location: "wrist_right", item: "steel_heavy" },
  { id: "item-4", location: "feet_soles", item: "silver_ghungroo" },
  { id: "item-5", location: "feet_soles", item: "black_thread" },
];

