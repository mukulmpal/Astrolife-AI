// src/lib/astro-engine/vastu-purusha-mandala-engine.ts
// AstroLife — 45 Devata Vastu Purusha Mandala & 32 Pad Entrance Computational Engine
// Authentic Classical Vedic Shilpa Shastra & Brihat Samhita Formulations

import type { ChartData } from "./calculations";

export type DevataClassification = "Devata" | "Asura";

export type DevataLayer = 
  | "Brahmasthan"      // Layer 1: Central Navel (1 Deity)
  | "CardinalFaces"    // Layer 2: 4 Cardinal Faces at 4ft boundary (4 Deities)
  | "DiagonalCorners"  // Layer 3: 8 Diagonal Deities at 8ft boundary (8 Deities)
  | "OuterPerimeter";  // Layer 4: 32 Perimeter Entrances (32 Deities)

export type EntranceAuspiciousness = 
  | "Supreme"      // अमृत पद / परम कल्याणकारी (e.g. E3 Jayanta, E4 Mahendra, S3 Vidhata, W3 Sugriva, W4 Pushpadanta, N3 Mukhya, N4 Bhallata, N5 Soma, N8 Diti)
  | "Good"         // शुभ / विशिष्ट प्रयोजन (e.g. S4 Grihakshata, S2 Pusha for Jobs, W7 Shosha, N6 Bhujanga)
  | "Caution"      // मध्यम / मिश्रित फल (e.g. E5 Surya, W5 Varuna, S6 Gandharva)
  | "Inauspicious"  // अशुभ / निषेध (e.g. E2 Parjanya, E6 Satya, E7 Bhrisha, S5 Yama, W2 Dwarika, N1 Roga, N7 Aditi)
  | "Destructive"; // महा-विनाशकारी (e.g. E1 Shikhi, E8 Aakash, S1 Anila, S7 Bhringaraja, S8 Mriga, W1 Pitra, W6 Asura, W8 Papyakshma)

export interface DevataEntity {
  id: string; // e.g. "BRAHMA", "BHUDHAR", "E1", "W4", etc.
  padCode?: string; // e.g. "E1", "E2", "S3", "W4", "N4"
  nameEn: string;
  nameHi: string;
  classification: DevataClassification;
  layer: DevataLayer;
  directionZone: string; // e.g. "Center", "North", "NE", "E", "SSE", etc.
  directionHindi: string;
  cardinalCompassDirection: "East" | "South" | "West" | "North" | "Center" | "Diagonal";
  signNum: number; // Kalpurusha Sign (1 to 12)
  element: "Space" | "Air" | "Fire" | "Earth" | "Water";
  elementColor: string;
  zoneMetal: string;
  auspiciousness: EntranceAuspiciousness;
  classicalSignificance: string;
  realLifeSymptom: string;
  secretShastricAxiom?: string;
  sacredFoodOffering?: string;
  foodDurationGuide?: string;
  activationMethod: string;
  blockingMethod: string;
}

export interface NativeDevataMapping {
  devata: DevataEntity;
  nativeHouseNum: number;
  houseNature: "Benefic" | "Dusthana" | "Neutral";
  isDusthanaBlocked: boolean;
  shastricVerdictBadge: string;
  verdictExplanation: string;
}

export interface OccultKundliDiagnostic {
  isAfflicted: boolean;
  severity: "CRITICAL" | "HIGH" | "NONE";
  eighthSubLord?: string;
  eighthNakshatraLord?: string;
  afflictionType: "Dwelling_Premises" | "Native_Body_Mind" | "Both" | "None";
  locationHouse?: number;
  locationSign?: string;
  locationDirection?: string;
  diagnosticTitle: string;
  diagnosticExplanation: string;
  shastricRemedyGuidance: string;
}

export interface ElementalBarChartBalancing {
  zoneCode: string;
  zoneNameHi: string;
  element: "Water" | "AirWood" | "Fire" | "Earth" | "Space";
  condition: "Exhausted_Depleted" | "Extended_Bloated" | "Balanced";
  actionFormula: string;
  actionExplanation: string;
  prohibitedItems: string[];
  recommendedTreatments: string[];
}

export interface BrahmasthanSanctificationProtocol {
  navelSignificance: string;
  consecrationMixture: string[];
  constructionTimingGuide: string;
  dailyMaintenanceSpray: string;
  overnightVesselDisposalRule: string;
  tulsiVedicSignificance: string;
  liverHealthConnection: string;
  criticalProhibitions: string[];
}

export interface SubtleShastricDirectives {
  foodPlacementSubtleRules: {
    utensilBoxRule: string;
    antiColorWarning: string;
    activationDuration: string;
    pinchQuantityRule: string;
    floorDrillingPermanentRule: string;
  };
  colorElementalNuances: {
    whiteNotNeutralRule: string;
    southIronGateDefect: string;
    extendedSouthPeachGoldenMix: string;
    neRedMattressCorrection: string;
  };
  sleepingPositionAxiom: {
    headVsBedRule: string;
    recommendedPillowDirection: string;
  };
  multiStoryFlatParadox: {
    explanation: string;
    familyHeadChartRule: string;
    virtualBalconyEntryRule: string;
  };
  neToiletFamilyTargeting: {
    vulnerableMemberRule: string;
    planetsFollowNativeRule: string;
    dailyRahuJupiterHarmonization: string;
  };
  shoeRackNorthAxiom: string;
  ancestorPhotoAxiom: string;
  bnnDharmaKarmaAxiom: string;
  shareMarketVenusKetuRahuParadox?: string;
  shaktiChakraDeityVsZoneColorNuance?: string;
  piscesLagnaExaltedVenusRahuIpoYoga?: string;
  classicalCaseStudies: Array<{
    title: string;
    kundliContext: string;
    vastuDefectOrAction: string;
    outcomeAndRemedy: string;
  }>;
}

export interface VastuPurushaMandalaDossier {
  totalCount: 45;
  devatasCount: 33;
  asurasCount: 12;
  brahmasthanProtocol: BrahmasthanSanctificationProtocol;
  deities: DevataEntity[];
  nativeMappings: NativeDevataMapping[];
  occultDiagnostic: OccultKundliDiagnostic;
  elementalBalancingGuides: ElementalBarChartBalancing[];
  toiletNeEmergencyProtocol: {
    status: string;
    strictWarning: string;
    remedySteps: string[];
  };
  mirrorElementalAxiom: {
    rule: string;
    permittedZones: string[];
    strictlyProhibitedZones: string[];
    consequencesOfSouthMirror: string;
    correctionMethod: string;
  };
  subtleShastricDirectives: SubtleShastricDirectives;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MASTER 45 DEVATAS CATALOG (33 DEVATAS + 12 ASURAS)
// ─────────────────────────────────────────────────────────────────────────────

export const MASTER_45_DEVATAS: DevataEntity[] = [
  // ── LAYER 1: BRAHMASTHAN (Center / Navel) ──────────────────────────────────
  {
    id: "BRAHMA",
    nameEn: "Brahma (ब्रह्मा)",
    nameHi: "ब्रह्मा (सृष्टिकर्ता)",
    classification: "Devata",
    layer: "Brahmasthan",
    directionZone: "Center",
    directionHindi: "ब्रह्मस्थान (केंद्र / नाभि)",
    cardinalCompassDirection: "Center",
    signNum: 1, // Universal center
    element: "Space",
    elementColor: "#F59E0B",
    zoneMetal: "गोल्ड / अष्टधातु (Gold)",
    auspiciousness: "Supreme",
    classicalSignificance: "समस्त वास्तु पुरुष मंडल का केंद्र, प्राण ऊर्जा का मूल उद्गम स्थल एवं सृष्टि के जनरेटर (G.O.D. - Generator)। जिस प्रकार शिशु को सारा पोषण नाभि से मिलता है, उसी प्रकार भवन के समस्त 45 देवताओं को ऊर्जा ब्रह्मस्थान से ही प्राप्त होती है।",
    realLifeSymptom: "यदि ब्रह्मस्थान पर पिलर, गड्ढा, सीढ़ियां, बीम या भारी दीवार आ जाए, तो पूरे घर की ऊर्जा रुक जाती है। जातक का लीवर खराब होना, पाचन तंत्र बैठना और सभी कार्य ऐन वक्त पर ठप होना इसका प्रत्यक्ष लक्षण है।",
    secretShastricAxiom: "भवन निर्माण से पूर्व सर्वप्रथम ब्रह्मस्थान को कच्चा दूध, गंगाजल, हल्दी और केसर से अभिमंत्रित किया जाता है। यदि निर्माण बीच में रुक जाए, तो केंद्र की सफाई करके यह अर्घ्य देने से रुका हुआ कार्य पुनः गति पकड़ लेता है।",
    sacredFoodOffering: "शुद्ध गंगाजल, कच्चा गाय का दूध, हल्दी व केसर का पवित्र मिश्रण",
    foodDurationGuide: "प्रतिदिन प्रातः घर की स्वच्छता के उपरांत ब्रह्मस्थान पर इसका हल्का छिड़काव करें।",
    activationMethod: "ब्रह्मस्थान को सर्वथा खुला, भारहीन, स्वच्छ और प्रकाशवान रखें। पीतल अथवा तांबे के पात्र में जल, हल्दी व केसर स्थापित करें।",
    blockingMethod: "ब्रह्मस्थान को कभी ब्लॉक नहीं किया जाता। यदि पिलर या बीम हो तो 4 दिशाओं में कॉपर/ब्रास पिरामिड लगाकर ऊर्जा बाईपास की जाती है।",
  },

  // ── LAYER 2: 4 CARDINAL FACES OF BRAHMA (Activates at 4 ft Boundary) ──────
  {
    id: "BHUDHAR",
    nameEn: "Bhudhar (भूधर)",
    nameHi: "भूधर (उत्तरी मुख)",
    classification: "Devata",
    layer: "CardinalFaces",
    directionZone: "North-Central",
    directionHindi: "उत्तर (ब्रह्मा का उत्तरी मुख)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम / चांदी (Aluminium / Silver)",
    auspiciousness: "Supreme",
    classicalSignificance: "किसी भी नए कार्य, प्रोजेक्ट अथवा उद्यम को आरंभ (Start / Manifest) करने की मुख्य ऊर्जा। किसी भी संकल्प को यथार्थ में प्रकट करने का कार्य भूधर देवता करते हैं।",
    realLifeSymptom: "यदि नया व्यापार शुरू करने में अकारण रुकावटें आ रही हों, योजनाएं केवल कागजों पर रह जाएं और काम शुरू ही न हो पाए, तो भूधर ऊर्जा अवरुद्ध होती है।",
    secretShastricAxiom: "भूधर पद पर गेहूं के आटे की एक साफ थैली स्थापित करने से रुके हुए संकल्प तुरंत गति पकड़ लेते हैं।",
    sacredFoodOffering: "गेहूं के आटे की थैली (Wheat Flour Bag)",
    foodDurationGuide: "10 से 15 दिनों तक भूधर पद पर रखें, तत्पश्चात पक्षियों या चींटियों को अर्पित करें।",
    activationMethod: "भूधर पद पर गेहूं के आटे की थैली रखें अथवा नीला/एंटी-क्लॉकवाइज स्प्रिंग स्थापित करें।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग अथवा ब्लू/अल्युमिनियम स्ट्रिप (यदि दूषित हो)।",
  },
  {
    id: "ARYAMA",
    nameEn: "Aryama (आर्यमा)",
    nameHi: "आर्यमा (पूर्वी मुख)",
    classification: "Devata",
    layer: "CardinalFaces",
    directionZone: "East-Central",
    directionHindi: "पूर्व (ब्रह्मा का पूर्वी मुख)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Air",
    elementColor: "#16A34A",
    zoneMetal: "स्टेनलेस स्टील / काष्ठ (Stainless Steel / Wood)",
    auspiciousness: "Supreme",
    classicalSignificance: "समाज से गहरा गठबंधन, जनसमर्थन, नेटवर्किंग और सार्वजनिक स्वीकार्यता दिलाने वाले देवता। विवाह संबंध जोड़ने और सामाजिक प्रतिष्ठा स्थापित करने का कार्य आर्यमा का है।",
    realLifeSymptom: "लोग आपके साथ जुड़ते नहीं, समाज से कटने की नौबत आ जाती है, विवाह संबंध तय होने में अड़चन आती है या सार्वजनिक समर्थन शून्य हो जाता है।",
    secretShastricAxiom: "आर्यमा पद पर फर्श पर शुद्ध देशी गुड़ की एक डली (Piece of Jaggery) रखने से सामाजिक संपर्क और जनसहयोग तुरंत जागृत होता है।",
    sacredFoodOffering: "शुद्ध देशी गुड़ की डली (Jaggery Block)",
    foodDurationGuide: "10 से 15 दिन रखें, फिर बहते जल में प्रवाहित करें या गाय को खिलाएं।",
    activationMethod: "फर्श पर गुड़ की डली रखें या हरा एंटी-क्लॉकवाइज स्प्रिंग लगाएं।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग या स्टेनलेस स्टील स्ट्रिप।",
  },
  {
    id: "VIVASVAN",
    nameEn: "Vivasvan (विवस्वान)",
    nameHi: "विवस्वान (दक्षिणी मुख)",
    classification: "Devata",
    layer: "CardinalFaces",
    directionZone: "South-Central",
    directionHindi: "दक्षिण (ब्रह्मा का दक्षिणी मुख)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा (Copper)",
    auspiciousness: "Supreme",
    classicalSignificance: "जीवन में सकारात्मक बदलाव (Transformation & Life Shift) लाने वाले और कार्य को निरंतर आगे धकेलने (Propelling Momentum) वाले देवता।",
    realLifeSymptom: "जीवन एक ही ढर्रे पर फंस जाता है, बदलाव नहीं आता, भूधर और आर्यमा से आरंभ हुआ कार्य दक्षिण में आकर अचानक अटक जाता है।",
    secretShastricAxiom: "आटे का चार मुखी दिया बनाकर उसमें शुद्ध देशी गाय का घी डालकर विवस्वान की ओर प्रज्वलित करें (जैसे छोटी दीपावली पर यम/विवस्वान निमित्त दिया जलाया जाता है)।",
    sacredFoodOffering: "आटे का दीपक + शुद्ध गाय का देशी घी (Wheat Flour Diya + Cow Ghee)",
    foodDurationGuide: "सायंकाल प्रज्वलित करें, निरंतर 11 से 21 दिन दीप दान करें।",
    activationMethod: "आटे का घी का दीपक जलाएं या लाल एंटी-क्लॉकवाइज स्प्रिंग स्थापित करें।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग या कॉपर स्ट्रिप।",
  },
  {
    id: "MITRA",
    nameEn: "Mitra (मित्र)",
    nameHi: "मित्र (पश्चिमी मुख)",
    classification: "Devata",
    layer: "CardinalFaces",
    directionZone: "West-Central",
    directionHindi: "पश्चिम (ब्रह्मा का पश्चिमी मुख)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा (Iron / Steel)",
    auspiciousness: "Supreme",
    classicalSignificance: "समस्त दिशाओं और शक्तियों को आपस में बांधकर रखने (Binding Power & Holding Coalitions) वाले देवता। अनुबंधों और सौदों को स्थाई रूप से पक्का करना मित्र देवता का अधिकार है।",
    realLifeSymptom: "किए-कराए काम बिखर जाते हैं, सौदे ऐन वक्त पर निरस्त हो जाते हैं, संस्था में एकता नहीं रहती, लोग काम छोड़कर भागते हैं।",
    secretShastricAxiom: "मित्र पद पर चीनी वाली मीठी गेहूं की रोटी (Sweet Sugar Roti) रखने से बिखरते हुए काम आपस में मजबूती से जुड़ जाते हैं।",
    sacredFoodOffering: "चीनी वाली मीठी रोटी (Sweet Sugar Wheat Roti)",
    foodDurationGuide: "10-15 दिन रखें, फिर गौमाता या पक्षियों को दें।",
    activationMethod: "सफेद/क्रीम एंटी-क्लॉकवाइज स्प्रिंग अथवा मीठी रोटी का नैवेद्य।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग अथवा आयरन स्ट्रिप।",
  },

  // ── LAYER 3: 8 DIAGONAL INTERMEDIATE DEITIES (Activates at 8 ft Boundary) ─
  // North-East Intermediate Deities (Between Bhudhar & Aryama)
  {
    id: "APA",
    nameEn: "Apa (अपा)",
    nameHi: "अपा (दिव्य औषधि देवता)",
    classification: "Devata",
    layer: "DiagonalCorners",
    directionZone: "NNE/NE",
    directionHindi: "उत्तर-उत्तर-पूर्व / ईशान विकर्ण",
    cardinalCompassDirection: "Diagonal",
    signNum: 9,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम / चांदी",
    auspiciousness: "Supreme",
    classicalSignificance: "समस्त औषधियों, जड़ी-बूटियों, प्राकृतिक हीलिंग और शारीरिक शुद्धि के मुख्य अधिपति। यह NNE के रोग प्रतिरोधक तंत्र का केंद्र हैं।",
    realLifeSymptom: "अपा के दूषित होने पर शरीर में तरह-तरह के असाध्य विकार, चर्म रोग, एलर्जी और विषाक्तता (Toxicity) उत्पन्न होने लगती है।",
    secretShastricAxiom: "अपा पद पर शुद्ध जड़ी-बूटियां या गंगाजल का कलश रखने से शारीरिक विकार तत्काल शांत होते हैं।",
    sacredFoodOffering: "त्रिफला चूर्ण अथवा शुद्ध गंगाजल व तुलसी पत्र",
    foodDurationGuide: "15 दिन रखें, फिर पौधों में विसर्जित करें।",
    activationMethod: "कांच के पात्र में गंगाजल व तुलसी या जल तत्व का एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग।",
  },
  {
    id: "AAPAVATSA",
    nameEn: "Aapavatsa (अपावत्स)",
    nameHi: "अपावत्स (औषधि संचरण व प्रेरणा देवता)",
    classification: "Devata",
    layer: "DiagonalCorners",
    directionZone: "NE",
    directionHindi: "उत्तर-पूर्व (ईशान विकर्ण)",
    cardinalCompassDirection: "Diagonal",
    signNum: 4,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "चांदी / कांस्य",
    auspiciousness: "Supreme",
    classicalSignificance: "खाई गई दवाइयों का शरीर में संपूर्ण अवशोषण व संचरण (Flow of Medicine) करवाना, तथा मस्तिष्क में 'You Can Do It' (अडिग आत्मविश्वास व योजना-शक्ति) का संचार करना।",
    realLifeSymptom: "दवाइयां खाते रहने पर भी शरीर को नहीं लगतीं, मानसिक हताशा रहती है और व्यक्ति कोई भी नई योजना बनाने से डरता है।",
    secretShastricAxiom: "दवाइयां अपावत्स क्षेत्र में रखने से वे अमृत समान कार्य करती हैं और जातक की बौद्धिक प्लानिंग अचूक सिद्ध होती है।",
    sacredFoodOffering: "मिश्री व गाय का कच्चा दूध",
    foodDurationGuide: "10-15 दिन, फिर पौधों में डालें।",
    activationMethod: "सफेद चंदन या चांदी का सिक्का अथवा नीला स्प्रिंग।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग।",
  },

  // South-East Intermediate Deities (Between Aryama & Vivasvan)
  {
    id: "SAVITA",
    nameEn: "Savita (सविता)",
    nameHi: "सविता (सूर्य तेज - आकस्मिक गति)",
    classification: "Devata",
    layer: "DiagonalCorners",
    directionZone: "ESE/SE",
    directionHindi: "पूर्व-दक्षिण-पूर्व विकर्ण",
    cardinalCompassDirection: "Diagonal",
    signNum: 1,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा (Copper)",
    auspiciousness: "Good",
    classicalSignificance: "भगवान सूर्य का उदीयमान स्वरूप। वर्षों से अटके हुए और फंसे हुए मामलों को एक झटके में निकाल फेंकने (Sudden Breakthrough) की प्रचंड शक्ति।",
    realLifeSymptom: "फाइलें सरकारी दफ्तरों में महीनों से धूल फांक रही हों, पेमेंट्स ब्लॉक हों, कोई भी काम बिना झटके के आगे न बढ़ता हो।",
    secretShastricAxiom: "सविता पद पर तांबे का सूर्य या लाल ध्वज स्थापित करने से फंसे हुए काम झटके से बाहर निकलते हैं।",
    sacredFoodOffering: "लाल मसूर की दाल अथवा गेहूं और गुड़",
    foodDurationGuide: "11 दिन रखें, फिर बहते जल में या मंदिर में दें।",
    activationMethod: "तांबे का सूर्य यंत्र अथवा लाल एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग या कॉपर स्ट्रिप।",
  },
  {
    id: "SAVITRA",
    nameEn: "Savitra (सवित्र)",
    nameHi: "सवित्र (द्रव्य प्रवाह / कैश फ्लो असुर)",
    classification: "Asura", // Classical texts categorise Savitra in Asura clan handling tangible wealth
    layer: "DiagonalCorners",
    directionZone: "SE",
    directionHindi: "दक्षिण-पूर्व विकर्ण (अग्नि कोण)",
    cardinalCompassDirection: "Diagonal",
    signNum: 12,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा",
    auspiciousness: "Supreme",
    classicalSignificance: "यद्यपि असुर गण में परिगणित हैं, परंतु संपूर्ण नकद द्रव्य प्रवाह (Liquidity & Cash Flow) का समस्त नियंत्रण सवित्र के हाथों में है।",
    realLifeSymptom: "व्यापार में टर्नओवर तो बहुत दिखता है परंतु हाथ में रोकड़ा (Liquid Cash) नहीं बचता, बैंक खाते खाली पड़े रहते हैं।",
    secretShastricAxiom: "सवित्र पद पर नोटों की गड्डी (भारतीय करेंसी/करेंसी सिंबल) का चित्र लगाने से नकद धन का आगमन तीव्र हो जाता है। (चेतावनी: मेष लग्न में यह 12वां भाव होने पर वर्जित है)।",
    sacredFoodOffering: "शुद्ध तिल का तेल अथवा लाल कनेर का पुष्प",
    foodDurationGuide: "15 दिन रखें।",
    activationMethod: "करेंसी की तस्वीर या लाल एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग या कॉपर स्ट्रिप।",
  },

  // South-West Intermediate Deities (Between Vivasvan & Mitra)
  {
    id: "INDRA_INNER",
    nameEn: "Indra (इंद्र - आंतरिक)",
    nameHi: "इंद्र (धन संचय व गर्भधारण)",
    classification: "Devata",
    layer: "DiagonalCorners",
    directionZone: "SSW/SW",
    directionHindi: "दक्षिण-दक्षिण-पश्चिम विकर्ण",
    cardinalCompassDirection: "Diagonal",
    signNum: 8,
    element: "Earth",
    elementColor: "#EAB308",
    zoneMetal: "पीतल (Brass)",
    auspiciousness: "Supreme",
    classicalSignificance: "धन को स्थाई रूप से संचित करना (Money Savings) तथा महिलाओं में संतान गर्भाधान की प्राकृतिक शक्ति (Conception Power) प्रदान करना।",
    realLifeSymptom: "पैसा पानी की तरह बह जाना, संचय न होना, तथा स्त्रियों को गर्भधारण में अकारण चिकित्सकीय रुकावटें आना।",
    secretShastricAxiom: "गर्भधारण की इच्छुक महिला के लिए अथवा भारी धन संचय हेतु इस पद पर पीतल के पात्र में शुद्ध पीली सरसों रखें।",
    sacredFoodOffering: "पीली सरसों अथवा चने की दाल",
    foodDurationGuide: "21 दिन रखें, फिर पक्षियों को दें।",
    activationMethod: "पीतल के पात्र में पीली सरसों या पीला एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "क्लॉकवाइज ब्रास स्प्रिंग।",
  },
  {
    id: "JAYA",
    nameEn: "Jaya (जय / जयंत - आंतरिक)",
    nameHi: "जय (हुनर, कौशल व सर्व-सफलता)",
    classification: "Devata",
    layer: "DiagonalCorners",
    directionZone: "SW",
    directionHindi: "दक्षिण-पश्चिम विकर्ण (नैऋत्य कोण)",
    cardinalCompassDirection: "Diagonal",
    signNum: 8,
    element: "Earth",
    elementColor: "#EAB308",
    zoneMetal: "पीतल / कांस्य",
    auspiciousness: "Supreme",
    classicalSignificance: "हस्तशिल्प, तकनीकी महारत, कला-कौशल (Skill Improvement) को निखारना तथा दुनिया से कौशल की सराहना व विजय प्राप्त करवाना।",
    realLifeSymptom: "व्यक्ति में अद्भुत हुनर होने के बाद भी ग्राहक या समाज उसकी कद्र नहीं करते, तकनीकी कार्यों में असफलता हाथ लगती है।",
    secretShastricAxiom: "जय पद पर अपने कार्य के औजार, टूल्स या अपने कौशल के प्रमाण-पत्र रखने से सर्वत्र विजय और सम्मान प्राप्त होता है।",
    sacredFoodOffering: "भुने हुए चने व गुड़",
    foodDurationGuide: "15 दिन रखें।",
    activationMethod: "पीला एंटी-क्लॉकवाइज स्प्रिंग अथवा टूल्स का व्यवस्थित डिस्प्ले।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग।",
  },

  // North-West Intermediate Deities (Between Mitra & Bhudhar)
  {
    id: "RUDRA",
    nameEn: "Rudra (रुद्र)",
    nameHi: "रुद्र (भगवान शिव का संहारक व दिव्य-दृष्टि स्वरूप)",
    classification: "Devata",
    layer: "DiagonalCorners",
    directionZone: "WNW/NW",
    directionHindi: "पश्चिम-उत्तर-पश्चिम विकर्ण",
    cardinalCompassDirection: "Diagonal",
    signNum: 2,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा / अष्टधातु",
    auspiciousness: "Good",
    classicalSignificance: "महाभारत के संजय की भांति दिव्य अंतर्दृष्टि (Telepathic Intuition) प्रदान करने वाले। यहां बैठे-बैठे दूरस्थ घटनाओं का पूर्वाभास हो जाता है।",
    realLifeSymptom: "सही-गलत का निर्णय लेने में भ्रम, इंट्यूशन का अभाव, या शत्रु के षड्यंत्रों का समय से पहले पता न लगना।",
    secretShastricAxiom: "रुद्र पद पर एकांत में ध्यान लगाने से जातक की छठी इंद्री (Sixth Sense) जाग्रत होती है।",
    sacredFoodOffering: "धतूरा, बेलपत्र अथवा भस्म",
    foodDurationGuide: "सोमवार को अर्पित करें।",
    activationMethod: "सफेद/क्रीम स्प्रिंग अथवा शिवलिंग का पवित्र प्रतीक।",
    blockingMethod: "क्लॉकवाइज स्प्रिंग।",
  },
  {
    id: "RAJYAKSHMA",
    nameEn: "Rajyakshma (राजयक्ष्मा)",
    nameHi: "राजयक्ष्मा (कार्य अवरोधक असुर)",
    classification: "Asura",
    layer: "DiagonalCorners",
    directionZone: "NW",
    directionHindi: "उत्तर-पश्चिम विकर्ण (वायव्य कोण)",
    cardinalCompassDirection: "Diagonal",
    signNum: 2,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा",
    auspiciousness: "Destructive",
    classicalSignificance: "अच्छे-भले चलते हुए व्यापार और धन आगमन को अचानक ब्रेक लगाकर पूरी तरह ठप (Sudden Stoppage & Ruin) कर देने वाली नकारात्मक शक्ति।",
    realLifeSymptom: "सब कुछ बहुत शानदार चल रहा होता है और अचानक एक ही महीने में सब कुछ बंद हो जाता है, फैक्ट्रियों पर ताला लग जाता है।",
    secretShastricAxiom: "राजयक्ष्मा को कभी सक्रिय नहीं किया जाता! यदि यह जागृत हो जाए, तो इसे तत्काल क्लॉकवाइज (Clockwise) स्प्रिंग लगाकर निष्प्रभावी किया जाता है।",
    sacredFoodOffering: "उड़द की दाल की पिंडी (काले उड़द)",
    foodDurationGuide: "दोष निवारण हेतु एक बार रखकर जल में विसर्जित करें।",
    activationMethod: "सख्त निषेध! इसे कभी सक्रिय न करें।",
    blockingMethod: "सफेद/लोहे का क्लॉकवाइज (Clockwise) स्प्रिंग लगाकर इसे तुरंत कीलित (Deactivate) करें।",
  },

  // ── LAYER 4: 32 PERIMETER ENTRANCES (8 EACH IN E, S, W, N) ───────────────

  // EAST ENTRANCES (E1 to E8)
  {
    id: "E1",
    padCode: "E1",
    nameEn: "Shikhi (शिखी)",
    nameHi: "शिखी (मस्तिष्क शिखा / अग्नि)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "ENE/NE",
    directionHindi: "ईशान-पूर्व (E1)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Fire",
    elementColor: "#16A34A", // East boundary base
    zoneMetal: "स्टेनलेस स्टील / काष्ठ",
    auspiciousness: "Destructive",
    classicalSignificance: "मानव मस्तिष्क की शिखा (चोटी) का स्थान जहाँ शरीर की समस्त आंतरिक अग्नि केंद्रित होती है। इसे बांधकर रखना शास्त्रसम्मत है; खुला रखने पर महाप्रलय और क्रोध का विस्फोट होता है (जैसे चाणक्य या द्रौपदी की खुली शिखा)।",
    realLifeSymptom: "यदि E1 में मुख्य द्वार हो तो घर में बार-बार शॉर्ट सर्किट, आग लगने की घटनाएं, भीषण क्लेश और स्त्रियों में अनियंत्रित गुस्सा रहता है।",
    secretShastricAxiom: "E1 मुख्य द्वार को तुरंत बंद (Block) करें। 3 इंच की हरी टेप या स्टेनलेस स्टील की पत्ती से इसे पूरी तरह सील करें।",
    activationMethod: "प्रवेश द्वार के रूप में खोलना सर्वथा वर्जित है।",
    blockingMethod: "हरी टेप (Green Tape) अथवा स्टेनलेस स्टील स्ट्रिप (Stainless Steel Strip) द्वारा दहलीज को ब्लॉक करें।",
  },
  {
    id: "E2",
    padCode: "E2",
    nameEn: "Parjanya (पर्जन्य)",
    nameHi: "पर्जन्य (अनावश्यक व्यय)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "ENE",
    directionHindi: "पूर्व-उत्तर-पूर्व (E2)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Air",
    elementColor: "#16A34A",
    zoneMetal: "स्टेनलेस स्टील",
    auspiciousness: "Inauspicious",
    classicalSignificance: "मेघ व वृष्टि के देवता। यहां मुख्य द्वार होने से कमाई गई समस्त धन-संपदा व्यर्थ के खर्चों में पानी की तरह बह जाती है।",
    realLifeSymptom: "जितना भी धन कमाकर लाएं, घर में प्रवेश करते ही फिजूलखर्ची और अप्रत्याशित नुकसान शुरू हो जाते हैं। बचत शून्य हो जाती है।",
    secretShastricAxiom: "किताबी वास्तु वाले नॉर्थ-ईस्ट को शुभ मानकर E1/E2 का गेट खोल देते हैं जो भारी आर्थिक बर्बादी लाता है।",
    activationMethod: "प्रवेश द्वार निषेध।",
    blockingMethod: "हरी टेप या स्टेनलेस स्टील स्ट्रिप से ब्लॉक करें।",
  },
  {
    id: "E3",
    padCode: "E3",
    nameEn: "Jayanta (जयंत)",
    nameHi: "जयंत (अमृत पद - महा-लाभ व सफलता)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "East",
    directionHindi: "पूर्व (E3)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Air",
    elementColor: "#16A34A",
    zoneMetal: "स्टेनलेस स्टील / काष्ठ",
    auspiciousness: "Supreme",
    classicalSignificance: "इंद्र पुत्र जयंत का पद। पूर्व दिशा के सर्वश्रेष्ठ प्रवेश द्वारों में से एक। यह द्वार धन, असीम लाभ और हर उपक्रम में विजय दिलाता है।",
    realLifeSymptom: "इस द्वार से प्रवेश करने पर व्यापार में निरंतर लाभ, सामाजिक सम्मान और आर्थिक संपन्नता में अप्रत्याशित वृद्धि होती है।",
    secretShastricAxiom: "पूर्व दिशा में केवल E3 और E4 ही खोलने योग्य सर्व-श्रेष्ठ द्वार हैं।",
    activationMethod: "हरा एंटी-क्लॉकवाइज स्प्रिंग अथवा वर्चुअल डोर फ्रेम।",
    blockingMethod: "सदा खुला व चैतन्य रखें।",
  },
  {
    id: "E4",
    padCode: "E4",
    nameEn: "Mahendra (महेंद्र)",
    nameHi: "महेंद्र (राजकृपा व सरकारी संरक्षण)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "East",
    directionHindi: "पूर्व (E4)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Air",
    elementColor: "#16A34A",
    zoneMetal: "स्टेनलेस स्टील / पीतल",
    auspiciousness: "Supreme",
    classicalSignificance: "देवराज इंद्र का महा-पद। सरकारी नौकरी, राजकीय अनुबंध (Govt Contracts), उच्चाधिकारियों का अडिग समर्थन दिलाने वाला द्वार।",
    realLifeSymptom: "प्रशासनिक सेवाओं (IAS, IPS), मंत्रालयों और सरकारी विभागों से अप्रत्याशित लाभ व बड़ी उपलब्धियां प्राप्त होती हैं।",
    secretShastricAxiom: "जिन जातकों को सरकारी टेंडर या राजनीति में सर्वोच्च शिखर छूना हो, उनका E4 द्वार सक्रिय होना वरदान है।",
    activationMethod: "हरा एंटी-क्लॉकवाइज स्प्रिंग अथवा काष्ठ का अशोक स्तंभ।",
    blockingMethod: "सदा खुला रखें।",
  },
  {
    id: "E5",
    padCode: "E5",
    nameEn: "Surya (सूर्य)",
    nameHi: "सूर्य (तेजस्वी मान-सम्मान किंतु प्रचंड क्रोध)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "East",
    directionHindi: "पूर्व (E5)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Fire",
    elementColor: "#16A34A",
    zoneMetal: "तांबा",
    auspiciousness: "Caution",
    classicalSignificance: "भगवान भास्कर का पद। यह द्वार मान-प्रतिष्ठा, ख्याति और भाग्य को तो चमकाता है, किंतु जातक के स्वभाव में उग्रता व प्रचंड क्रोध भर देता है।",
    realLifeSymptom: "घर में कदम रखते ही परिजनों का पारा चढ़ जाना, अकारण तीखी बहस, यद्यपि समाज में नाम और रुतबा बहुत अच्छा रहता है।",
    secretShastricAxiom: "यदि क्रोध अधिक सताए तो दहलीज पर तांबे की बारीक पत्ती या सौंफ-मिश्री का प्रयोग करें।",
    activationMethod: "तांबे का सूर्य यंत्र।",
    blockingMethod: "यदि अत्यधिक क्लेश हो तो हल्के हरे रंग से संतुलित करें।",
  },
  {
    id: "E6",
    padCode: "E6",
    nameEn: "Satya (सत्य)",
    nameHi: "सत्य (वचन-भंग व गलत निर्णय)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "ESE",
    directionHindi: "पूर्व-दक्षिण-पूर्व (E6)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Air",
    elementColor: "#16A34A",
    zoneMetal: "स्टेनलेस स्टील",
    auspiciousness: "Inauspicious",
    classicalSignificance: "किताबी वास्तु में इसे शुभ कहा जाता है, परंतु वास्तविक वैदिक अनुभव में E6 प्रवेश द्वार व्यक्ति को अपने वादों पर खरा न उतरने वाला बना देता है।",
    realLifeSymptom: "जातक लोगों से झूठे वादे करता है ('कल काम हो जाएगा, परसों हो जाएगा') और अपनी बात पर कभी नहीं टिकता। गलत निर्णय लेकर नुकसान उठाता है।",
    secretShastricAxiom: "E6 में मुख्य द्वार या बेड होने पर व्यक्ति की विश्वसनीयता समाज में शून्य हो जाती है। इसे तुरंत ब्लॉक करें।",
    activationMethod: "प्रवेश द्वार निषेध।",
    blockingMethod: "हरी टेप अथवा स्टेनलेस स्टील स्ट्रिप द्वारा ब्लॉक करें।",
  },
  {
    id: "E7",
    padCode: "E7",
    nameEn: "Bhrisha (भृश)",
    nameHi: "भृश (मूड का उतार-चढ़ाव व कार्य में अरुचि)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "ESE",
    directionHindi: "पूर्व-दक्षिण-पूर्व (E7)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Air",
    elementColor: "#16A34A",
    zoneMetal: "स्टेनलेस स्टील",
    auspiciousness: "Inauspicious",
    classicalSignificance: "अस्थिर मनोदशा के देवता। व्यक्ति मूड पर आश्रित हो जाता है — मूड हुआ तो काम किया, नहीं हुआ तो करोड़ों का नुकसान होने पर भी हाथ नहीं लगाएगा।",
    realLifeSymptom: "अचानक भयंकर गुस्सा आना, आलस्य, काम करने में मन न लगना और मूड स्विंग्स के कारण जीवन बर्बाद होना।",
    secretShastricAxiom: "E7 द्वार को खुला न रखें, अन्यथा जातक कितना भी प्रतिभाशाली हो, निरंतर कर्जों में डूबता चला जाएगा।",
    activationMethod: "प्रवेश द्वार निषेध।",
    blockingMethod: "हरी टेप द्वारा दहलीज ब्लॉक करें।",
  },
  {
    id: "E8",
    padCode: "E8",
    nameEn: "Aakash (आकाश)",
    nameHi: "आकाश (दुर्घटना, चोरी व अग्निकांड)",
    classification: "Asura", // Outer boundary Asuric energy field
    layer: "OuterPerimeter",
    directionZone: "ESE/SE",
    directionHindi: "पूर्व-दक्षिण-पूर्व / अग्नि कोण संधि (E8)",
    cardinalCompassDirection: "East",
    signNum: 1,
    element: "Fire",
    elementColor: "#16A34A",
    zoneMetal: "तांबा",
    auspiciousness: "Destructive",
    classicalSignificance: "विनाशकारी आकाशीय विक्षोभ का पद। यहां मुख्य द्वार होने पर घर में गंभीर सड़क दुर्घटनाएं, टांगें टूटना, डकैती/चोरी और भीषण आगजनी होती है।",
    realLifeSymptom: "घर में बार-बार ताले टूटना, चोरी होना, परिजनों का गंभीर एक्सीडेंट होना और हड्डियों में फ्रैक्चर आना।",
    secretShastricAxiom: "कैश फ्लो के चक्कर में साउथ-ईस्ट के E8 पद को कभी न छेड़ें! इसे तत्काल हरी टेप से ब्लॉक करें।",
    activationMethod: "कदापि न खोलें।",
    blockingMethod: "3 इंच हरी टेप अथवा स्टेनलेस स्टील स्ट्रिप द्वारा पूर्ण ब्लॉक।",
  },

  // SOUTH ENTRANCES (S1 to S8)
  {
    id: "S1",
    padCode: "S1",
    nameEn: "Anila (अनिल)",
    nameHi: "अनिल (पुत्रों का कुसंगत व विद्रोह)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "SSE/SE",
    directionHindi: "दक्षिण-पूर्व (S1)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा",
    auspiciousness: "Destructive",
    classicalSignificance: "अग्नि व वायु की संधि। घर के पुरुष बच्चे (लड़के) बुरी आदतों, नशे और कुसंगति में पड़ जाते हैं और माता-पिता के प्रति विद्रोही हो जाते हैं।",
    realLifeSymptom: "बेटों का माता-पिता की बात न मानना, आगे से जवाब देना, संस्कारहीन होना और गलत संगत में धन बर्बाद करना।",
    secretShastricAxiom: "S1 द्वार को तत्काल लाल टेप या तांबे की पत्ती से सील करवाएं ताकि संतानों का भविष्य सुरक्षित रहे।",
    activationMethod: "प्रवेश द्वार वर्जित।",
    blockingMethod: "लाल टेप (Red Tape) अथवा तांबे की स्ट्रिप (Copper Strip) से दहलीज ब्लॉक करें।",
  },
  {
    id: "S2",
    padCode: "S2",
    nameEn: "Pusha (पूषा)",
    nameHi: "पूषा (नौकरी में उच्च पद किंतु व्यापार में बाधक)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "SSE",
    directionHindi: "दक्षिण-दक्षिण-पूर्व (S2)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा",
    auspiciousness: "Good",
    classicalSignificance: "पोषण के देवता। स्वतंत्र व्यापार (Business) के लिए यह द्वार प्रतिकूल है, परंतु वेतनभोगी उच्च अधिकारियों (CEO, GM, Director, उच्च सरकारी पद) के लिए यह अत्यंत भाग्यशाली है।",
    realLifeSymptom: "नौकरीपेशा लोगों को बड़ी-बड़ी कंपनियों में शीर्ष पद और मान-सम्मान दिलाता है, जबकि व्यापारी जातकों के सौदे अटकते हैं।",
    secretShastricAxiom: "नौकरी करने वालों के लिए S2 उत्तम है; व्यापारियों को इसे बंद करके S3 या S4 अपनाना चाहिए।",
    activationMethod: "नौकरीपेशा के लिए तांबे का लाल स्प्रिंग।",
    blockingMethod: "व्यापारियों के लिए लाल टेप से ब्लॉक।",
  },
  {
    id: "S3",
    padCode: "S3",
    nameEn: "Vidhata (विधाता)",
    nameHi: "विधाता (दक्षिण का अमृत द्वार - परमानंद व महा-सफलता)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "South",
    directionHindi: "दक्षिण (S3)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा",
    auspiciousness: "Supreme",
    classicalSignificance: "दक्षिण दिशा का सर्वश्रेष्ठ वरदान! जो लोग दक्षिण मुखी प्लॉट से डरते हैं, वे यदि S3 विधाता पद पर मुख्य द्वार या बेडरूम बना लें तो जीवन में अपार आनंद और सफलता मिलती है।",
    realLifeSymptom: "जीवन में हर प्रकार का सुख, पारिवारिक आनंद, उत्सव और निर्बाध आर्थिक प्रगति।",
    secretShastricAxiom: "सस्ता दक्षिण मुखी प्लॉट लेकर S3 विधाता पर प्रवेश द्वार निकाल लें, जीवन में कभी कोई कष्ट नहीं आएगा।",
    activationMethod: "लाल एंटी-क्लॉकवाइज स्प्रिंग अथवा सुंदर पीच/चेरी रंग का द्वार।",
    blockingMethod: "सदा खुला व चैतन्य रखें।",
  },
  {
    id: "S4",
    padCode: "S4",
    nameEn: "Grihakshata (गृहक्षत)",
    nameHi: "गृहक्षत (फैक्ट्री, मैन्युफैक्चरिंग व उद्योगों का महा-द्वार)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "South",
    directionHindi: "दक्षिण (S4)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा",
    auspiciousness: "Supreme",
    classicalSignificance: "औद्योगिक उत्पादन, कारखानों और विशाल मैन्युफैक्चरिंग इकाइयों के लिए साक्षात कुबेर द्वार। यहां से माल का उत्पादन और बिक्री रिकॉर्ड स्तर पर पहुंचती है।",
    realLifeSymptom: "फैक्ट्री मालिकों और उद्योगपतियों को भारी मुनाफा, मशीनों का निर्बाध चलना और बड़े-बड़े कॉर्पोरेट आर्डर मिलना।",
    secretShastricAxiom: "दक्षिण दिशा में S2, S3 और S4 तीनों का संयुक्त क्षेत्र एक अत्यंत शक्तिशाली समृद्धि पट्टी बनाता है।",
    activationMethod: "लाल एंटी-क्लॉकवाइज स्प्रिंग अथवा कॉपर रॉड।",
    blockingMethod: "सदा खुला रखें।",
  },
  {
    id: "S5",
    padCode: "S5",
    nameEn: "Yama (यम)",
    nameHi: "यम (ऋण, कर्ज व धन का भारी अपव्यय)",
    classification: "Devata", // In Vastu Purusha Mandala, Yama is south guardian, but entrance is heavily afflicted
    layer: "OuterPerimeter",
    directionZone: "South",
    directionHindi: "दक्षिण (S5)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Fire",
    elementColor: "#DC2626",
    zoneMetal: "तांबा / सीसा (Lead)",
    auspiciousness: "Inauspicious",
    classicalSignificance: "धर्मराज यम का पद। आम लोग कहते हैं 'दक्षिण में यम बैठा है' — वह वास्तव में S5 पद है। यहां मुख्य द्वार या बेडरूम होने पर व्यक्ति असाध्य कर्जों में डूब जाता है।",
    realLifeSymptom: "ब्याज पर ब्याज चढ़ना, बैंक से लोन डिफ़ॉल्ट होना, अत्यधिक धन की बर्बादी और शारीरिक ऊर्जा का क्षरण।",
    secretShastricAxiom: "S5 पर मुख्य द्वार या ज्यादा समय बिताना सर्वथा वर्जित है। इसे तत्काल लाल टेप से ब्लॉक करें।",
    activationMethod: "प्रवेश द्वार निषेध।",
    blockingMethod: "लाल टेप (Red Tape) अथवा तांबे की पत्ती से दहलीज को सील करें।",
  },
  {
    id: "S6",
    padCode: "S6",
    nameEn: "Gandharva (गंधर्व)",
    nameHi: "गंधर्व (सामान्य जन हेतु दरिद्रता, कलाकारों हेतु महा-ख्याति)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "SSW",
    directionHindi: "दक्षिण-दक्षिण-पश्चिम (S6)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Earth",
    elementColor: "#EAB308",
    zoneMetal: "पीतल",
    auspiciousness: "Caution",
    classicalSignificance: "देवराज इंद्र के संगीतज्ञ। सामान्य गृहस्थ के लिए यह द्वार अत्यंत दरिद्रता और कंगाली लाता है; परंतु संगीतकारों, गायकों और वाद्यों के कलाकारों के लिए यह विश्वव्यापी ख्याति का द्वार है।",
    realLifeSymptom: "संगीतकार अपने वाद्य यंत्र (Instruments) यहां रखें तो वे अत्यधिक प्रसिद्ध हो जाते हैं; जबकि सामान्य व्यक्ति का पैसा नष्ट होता है।",
    secretShastricAxiom: "यदि आप संगीतकार हैं तो अपने वाद्य S6 पर रखें; अन्यथा इस द्वार को पीली टेप से बंद रखें।",
    activationMethod: "केवल संगीतकारों के लिए वाद्य यंत्र रखना अनुशंसित।",
    blockingMethod: "पीली टेप (Yellow Tape) अथवा ब्रास स्ट्रिप द्वारा ब्लॉक करें।",
  },
  {
    id: "S7",
    padCode: "S7",
    nameEn: "Bhringaraja (भृंगराज)",
    nameHi: "भृंगराज (प्रत्येक क्षेत्र में असफलता / विसर्जन)",
    classification: "Asura",
    layer: "OuterPerimeter",
    directionZone: "SSW",
    directionHindi: "दक्षिण-दक्षिण-पश्चिम (S7)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Earth",
    elementColor: "#EAB308",
    zoneMetal: "पीतल",
    auspiciousness: "Destructive",
    classicalSignificance: "SSW विसर्जन (Disposal) ऊर्जा का केंद्र। व्यक्ति 50 क्षेत्रों में हाथ डाले, हर जगह केवल असफलता, तिरस्कार और विफलता ही हाथ लगती है।",
    realLifeSymptom: "जिस भी काम में हाथ डालें वही डूब जाए, पार्टनर धोखा दे जाएं, पूंजी डूब जाए।",
    secretShastricAxiom: "S7 द्वार महा-विनाशकारी है, इसे बिना एक दिन की देरी किए पीली टेप या ब्रास स्ट्रिप से ब्लॉक करें।",
    activationMethod: "कदापि न खोलें।",
    blockingMethod: "पीली टेप (Yellow Tape) अथवा ब्रास स्ट्रिप (Brass Strip) से ब्लॉक करें।",
  },
  {
    id: "S8",
    padCode: "S8",
    nameEn: "Mriga (मृग)",
    nameHi: "मृग (संबंध विच्छेद व भारी धन हानि)",
    classification: "Asura",
    layer: "OuterPerimeter",
    directionZone: "SSW/SW",
    directionHindi: "नैऋत्य संधि (S8)",
    cardinalCompassDirection: "South",
    signNum: 10,
    element: "Earth",
    elementColor: "#EAB308",
    zoneMetal: "पीतल",
    auspiciousness: "Destructive",
    classicalSignificance: "दक्षिण की अंतिम सीमा। यह द्वार पारिवारिक रिश्तों को चकनाचूर कर देता है और संचित धन की भारी बर्बादी कराता है।",
    realLifeSymptom: "माता-पिता, भाई-बहनों और जीवनसाथी से भयंकर अलगाव, कोर्ट-कचहरी और बैंक बैलेंस का स्वाहा होना।",
    secretShastricAxiom: "S8 को तत्काल पीली टेप या पीतल की पत्ती से पूर्णतः सील करवाएं।",
    activationMethod: "प्रवेश द्वार वर्जित।",
    blockingMethod: "पीली टेप या ब्रास स्ट्रिप से पूर्ण ब्लॉक।",
  },

  // WEST ENTRANCES (W1 to W8)
  {
    id: "W1",
    padCode: "W1",
    nameEn: "Pitra (पितृ)",
    nameHi: "पितृ (अल्पायु व कुल में बार-बार मृत्यु)",
    classification: "Asura", // Outer perimeter heavy ancestral karmic gate
    layer: "OuterPerimeter",
    directionZone: "SW/WSW",
    directionHindi: "नैऋत्य-पश्चिम (W1)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Earth",
    elementColor: "#EAB308",
    zoneMetal: "पीतल / लोहा",
    auspiciousness: "Destructive",
    classicalSignificance: "पितृ पद। यहां मुख्य द्वार होने से पितृ ऊर्जा नष्ट होती है, जिसके परिणामस्वरुप कुल में बार-बार अकाल मृत्यु, अल्पायु और वंश वृद्धि में रुकावट आती है।",
    realLifeSymptom: "परिवार में असमय मृत्यु, युवाओं का असाध्य रोगों से घिरना और कुल का क्षय होना।",
    secretShastricAxiom: "W1 को तुरंत पीली टेप या पीतल से ब्लॉक करें। पितरों की तस्वीर केवल साउथ-वेस्ट में आदरपूर्वक स्थापित करें, द्वार न बनाएं।",
    activationMethod: "कदापि न खोलें।",
    blockingMethod: "पीली टेप (Yellow Tape) या ब्रास स्ट्रिप द्वारा तत्काल ब्लॉक करें।",
  },
  {
    id: "W2",
    padCode: "W2",
    nameEn: "Dauvarika (दौवारिक / द्वारिक)",
    nameHi: "दौवारिक (करियर व व्यवसाय में अस्थिरता)",
    classification: "Asura",
    layer: "OuterPerimeter",
    directionZone: "WSW",
    directionHindi: "पश्चिम-दक्षिण-पश्चिम (W2)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा",
    auspiciousness: "Inauspicious",
    classicalSignificance: "द्वारपाल का पद। अत्यधिक बुरा नहीं है, परंतु आजीविका और व्यापार में घोर अस्थिरता (Unstable Career) लाता है।",
    realLifeSymptom: "बार-बार नौकरियां बदलना, व्यवसाय का कभी ऊपर कभी नीचे होना, स्थिरता न मिलना।",
    secretShastricAxiom: "पश्चिम में W2 को छोड़कर W3 या W4 का चयन करें। W2 को सफेद टेप से ब्लॉक करें।",
    activationMethod: "प्रवेश द्वार निषेध।",
    blockingMethod: "सफेद टेप (White Tape) अथवा लोहे की पत्ती (Iron Strip)।",
  },
  {
    id: "W3",
    padCode: "W3",
    nameEn: "Sugriva (सुग्रीव)",
    nameHi: "सुग्रीव (सर्व-सपोर्ट, विश्व-मैत्री व संपूर्ण सफलता)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "West",
    directionHindi: "पश्चिम (W3)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा / सफेद धातु",
    auspiciousness: "Supreme",
    classicalSignificance: "प्रभु श्रीराम के परम सखा सुग्रीव का पद। यहां मुख्य द्वार होने पर सारी दुनिया आपकी मित्र बन जाती है; आप बाद में पहुंचेंगे, लोग आपकी मदद के लिए पहले खड़े मिलेंगे।",
    realLifeSymptom: "अभूतपूर्व सामाजिक व संस्थागत समर्थन, हर क्षेत्र में सफलता और संकट में अजनबियों का भी सहायक बन जाना।",
    secretShastricAxiom: "पश्चिम में 3 और 4 (W3, W4) अमृत पद हैं। इन्हें आंख बंद करके अपनाया जा सकता है।",
    activationMethod: "सफेद एंटी-क्लॉकवाइज स्प्रिंग अथवा वर्चुअल डोर फ्रेम।",
    blockingMethod: "सदा खुला रखें।",
  },
  {
    id: "W4",
    padCode: "W4",
    nameEn: "Pushpadanta (पुष्पदंत)",
    nameHi: "पुष्पदंत (मनोकामना पूर्ति व संतोषप्रद समृद्धि)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "West",
    directionHindi: "पश्चिम (W4)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "सफेद धातु / चांदी / लोहा",
    auspiciousness: "Supreme",
    classicalSignificance: "समस्त इच्छाओं को पूर्ण करने वाले कामधेनु स्वरूप देवता। यह द्वार जातक को जीवन भर संतुष्टि (Satisfaction), प्रचुर लाभ और अभूतपूर्व संपन्नता प्रदान करता है।",
    realLifeSymptom: "मनोकामनाएं शीघ्र फलित होना, व्यापार में स्थिर बचत और जीवन में गहरा मानसिक संतोष।",
    secretShastricAxiom: "पीली पर्ची (Yellow Paper) पर सफेद मार्कर से अपनी मनोकामना लिखकर पुष्पदंत W4 पद पर रखने से वह तीव्र गति से पूर्ण होती है।",
    sacredFoodOffering: "दूध का बना पेड़ा अथवा सफेद मिष्ठान्न",
    foodDurationGuide: "11 दिन रखें।",
    activationMethod: "सफेद मार्कर + पीली पर्ची मनोकामना प्रयोग अथवा सफेद एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "सदा खुला व चैतन्य रखें।",
  },
  {
    id: "W5",
    padCode: "W5",
    nameEn: "Varuna (वरुण)",
    nameHi: "वरुण (असीमित लालसा व असंतोष)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "West",
    directionHindi: "पश्चिम (W5)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा / चांदी",
    auspiciousness: "Caution",
    classicalSignificance: "जल व आकाश के नियंत्रक देवता। यह द्वार व्यक्ति को कभी संतुष्ट नहीं होने देता (Most Acceptance People — 'कैलाश मिला तो बगल का पर्वत भी मांगेंगे')।",
    realLifeSymptom: "अथाह धन होने के बाद भी और अधिक पाने की अंतहीन तृष्णा, रात-दिन की बेचैनी। यद्यपि प्रगति कराता है, पर मानसिक शांति छीन लेता है।",
    secretShastricAxiom: "महत्वाकांक्षा के लिए अच्छा है, परंतु शांति के लिए W3/W4 अधिक श्रेयस्कर हैं।",
    activationMethod: "सफेद स्प्रिंग।",
    blockingMethod: "यदि अत्यधिक लालच और असंतोष सताए तो सफेद टेप से हल्का संतुलित करें।",
  },
  {
    id: "W6",
    padCode: "W6",
    nameEn: "Asura (असुर)",
    nameHi: "असुर (गंभीर डिप्रेशन व मानसिक अवसाद)",
    classification: "Asura",
    layer: "OuterPerimeter",
    directionZone: "WNW",
    directionHindi: "पश्चिम-उत्तर-पश्चिम (W6)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा",
    auspiciousness: "Destructive",
    classicalSignificance: "WNW डिप्रेशन ज़ोन का केंद्र। यहां मुख्य द्वार या बेडरूम होने पर व्यक्ति गंभीर क्रोनिक डिप्रेशन, घोर निराशा और नकारात्मक विचारों में डूब जाता है।",
    realLifeSymptom: "बिना बात के रोना, जीने की इच्छा समाप्त होना, अकेले कमरे में बंद रहना और मानसिक रूप से अपंग महसूस करना।",
    secretShastricAxiom: "W6 द्वार या बेडरूम को तुरंत हटाएं। इसे सफेद टेप या लोहे की पत्ती से पूर्णतः सील करें।",
    activationMethod: "कदापि न खोलें।",
    blockingMethod: "सफेद टेप (White Tape) अथवा लोहे की स्ट्रिप द्वारा ब्लॉक करें।",
  },
  {
    id: "W7",
    padCode: "W7",
    nameEn: "Shosha (शोष)",
    nameHi: "शोष (शांति, गहन शोध व डिप्रेशन मुक्ति)",
    classification: "Asura", // Purified Shoshana aspect
    layer: "OuterPerimeter",
    directionZone: "WNW",
    directionHindi: "पश्चिम-उत्तर-पश्चिम (W7)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा",
    auspiciousness: "Good",
    classicalSignificance: "अवसादों का शोषण कर मन को शांत करने वाला पद। W6 के ठीक बगल में होने पर भी यह डिप्रेशन से बाहर निकालकर जीवन में उच्चस्तरीय रिसर्च व अनुसंधान की शक्ति देता है।",
    realLifeSymptom: "गहन वैज्ञानिक खोज, किताबों का अध्ययन, और एकांत में अद्भुत शांति का अनुभव।",
    secretShastricAxiom: "यदि WNW में मजबूरी में बेडरूम रखना पड़े, तो W6 से हटाकर W7 पर शिफ्ट कर दें — जीवन शांत व शोधपूर्ण हो जाएगा।",
    activationMethod: "सफेद/क्रीम एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "सदा संतुलित रखें।",
  },
  {
    id: "W8",
    padCode: "W8",
    nameEn: "Papyakshma (पापयक्ष्मा)",
    nameHi: "पापयक्ष्मा (नशे की लत व व्यसन का जाल - Golden Alert)",
    classification: "Asura",
    layer: "OuterPerimeter",
    directionZone: "NW",
    directionHindi: "उत्तर-पश्चिम (W8)",
    cardinalCompassDirection: "West",
    signNum: 11,
    element: "Space",
    elementColor: "#E2E8F0",
    zoneMetal: "लोहा",
    auspiciousness: "Destructive",
    classicalSignificance: "व्यसन और पाप प्रवृत्तियों का अधिपति। यदि बच्चों या परिजनों का बेड यहां हो अथवा मुख्य द्वार खुला हो, तो घर के सदस्य गंभीर शराब, ड्रग्स और जुए के एडिक्ट हो जाते हैं।",
    realLifeSymptom: "घर का कोई न कोई सदस्य नशे का शिकार होना, रिहैब सेंटर जाने की नौबत आना, गुप्त अनैतिक आदतों में धन बर्बाद होना।",
    secretShastricAxiom: "W8 पर बच्चे का बेड कभी न लगाएं! इसे तुरंत सफेद टेप या लोहे की पत्ती से ब्लॉक करें।",
    activationMethod: "कदापि न खोलें।",
    blockingMethod: "सफेद टेप (White Tape) अथवा लोहे की पत्ती द्वारा दहलीज को पूर्ण ब्लॉक करें।",
  },

  // NORTH ENTRANCES (N1 to N8)
  {
    id: "N1",
    padCode: "N1",
    nameEn: "Roga (रोग)",
    nameHi: "रोग (शत्रु पीड़ा व निरंतर टांग खिंचाई)",
    classification: "Asura",
    layer: "OuterPerimeter",
    directionZone: "NNW",
    directionHindi: "उत्तर-उत्तर-पश्चिम (N1)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम",
    auspiciousness: "Inauspicious",
    classicalSignificance: "व्याधियों व विरोधियों का पद। एक शत्रु से निपटकर हटेंगे, दूसरा और तीसरा तैयार मिलेगा। समाज और दफ्तर में लोग निरंतर टांग खिंचाई (Leg-pulling) करते हैं।",
    realLifeSymptom: "अकारण ईर्ष्या, गुप्त शत्रुओं के षड्यंत्र, अदालती नोटिस और जीवन में चैन न मिलना।",
    secretShastricAxiom: "नॉर्थ में केवल N1 खराब है, बाकी अधिकांश द्वार अत्यंत शुभ हैं। N1 को नीली टेप से तुरंत ब्लॉक करें।",
    activationMethod: "प्रवेश द्वार निषेध।",
    blockingMethod: "नीली टेप (Blue Tape) अथवा अल्युमिनियम स्ट्रिप द्वारा ब्लॉक करें।",
  },
  {
    id: "N2",
    padCode: "N2",
    nameEn: "Naga (नागा)",
    nameHi: "नागा (ब्रांड खिंचाव व सम्मोहन, किंतु तीव्र नजर दोष)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "NNW",
    directionHindi: "उत्तर-उत्तर-पश्चिम (N2)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम / कांच",
    auspiciousness: "Good",
    classicalSignificance: "नाग देवता का पद। यह अद्भुत आकर्षण (Attraction) और ब्रांड की ओर ग्राहकों का खिंचाव पैदा करता है; परंतु यहां रहने वालों को नजर दोष (Evil Eye) बहुत जल्दी लगता है।",
    realLifeSymptom: "लोग आपके काम और ब्रांड की ओर सम्मोहित होते हैं, परंतु बार-बार नजर लगने से बीमारियां व अचानक रुकावटें आती हैं।",
    secretShastricAxiom: "नागा देवता का प्रिय नैवेद्य दालचीनी (Cinnamon) है। महत्वपूर्ण बैठक से पूर्व मुंह में दालचीनी रखें तो सम्मोहन शक्ति जागती है और नजर दोष दूर होता है।",
    sacredFoodOffering: "दालचीनी की डंडी (Cinnamon Stick)",
    foodDurationGuide: "कांच के पात्र में N2 पर रखें; बैठक से पूर्व मुख में रखें।",
    activationMethod: "कांच के पात्र में दालचीनी अथवा नीला एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "यदि नजर दोष अत्यधिक हो तो नीली टेप से हल्का संतुलित करें।",
  },
  {
    id: "N3",
    padCode: "N3",
    nameEn: "Mukhya (मुख्य)",
    nameHi: "मुख्य (सर्व-क्षेत्रीय सफलता व पुत्र संतान का गुप्त सूत्र)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "North",
    directionHindi: "उत्तर (N3)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम",
    auspiciousness: "Supreme",
    classicalSignificance: "उत्तर दिशा का मुख्य अमृत द्वार। प्रत्येक क्षेत्र और उद्योग में भारी सफलता, असीमित धन और नई संपत्तियों का सृजन कराता है।",
    realLifeSymptom: "नए-नए व्यावसायिक अनुबंध, बैंक खातों में तेजी से वृद्धि और परिवार में प्रतिष्ठा।",
    secretShastricAxiom: "गुप्त शास्त्रीय सूत्र: यदि कुल में पुत्र संतान (Male Progeny) की प्रबल इच्छा हो, तो N3 मुख्य देवता पद पर नवजात शिशु (Newborn Male Infant) की सुंदर तस्वीर लगाएं।",
    sacredFoodOffering: "माखन-मिश्री",
    foodDurationGuide: "11 दिन रखें।",
    activationMethod: "नीला एंटी-क्लॉकवाइज स्प्रिंग अथवा नवजात बालक का चित्र।",
    blockingMethod: "सदा खुला रखें।",
  },
  {
    id: "N4",
    padCode: "N4",
    nameEn: "Bhallata (भल्लाट)",
    nameHi: "भल्लाट (360° ट्रू नॉर्थ - कुबेर का अखंड खजाना)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "North",
    directionHindi: "उत्तर (N4 - 0° / 360° True North)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम / चांदी",
    auspiciousness: "Supreme",
    classicalSignificance: "समस्त वास्तु का 0°/360° केंद्र बिंदु। जीवन के संपूर्ण अवसरों, प्रचुर ग्राहकों और अखंड धन का प्रवेश द्वार। अत्यंत भाग्यशाली लोगों का मुख्य द्वार N4 पर खुलता है।",
    realLifeSymptom: "ग्राहकों की अनवरत कतारें, नए-नए अवसर, बैंक बैलेंस का निरंतर बढ़ना और जीवन में कभी दरिद्रता न आना।",
    secretShastricAxiom: "N4 द्वार को 100% खुला, स्वच्छ और चैतन्य रखें। यह कुबेर का साक्षात सिंहासन है।",
    activationMethod: "नीला एंटी-क्लॉकवाइज स्प्रिंग अथवा बहते जल के झरने का चित्र।",
    blockingMethod: "सदा खुला रखें।",
  },
  {
    id: "N5",
    padCode: "N5",
    nameEn: "Soma (सोम)",
    nameHi: "सोम (अमृतमयी शांति, भजन-कीर्तन व धर्मपरायणता)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "North",
    directionHindi: "उत्तर (N5)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "चांदी / अल्युमिनियम",
    auspiciousness: "Supreme",
    classicalSignificance: "चंद्रमा और सोम रस के अधिपति। इस द्वार वाले घरों में निरंतर भजन-कीर्तन, धार्मिक सत्संग और ईश्वरीय शांति का वातावरण बना रहता है।",
    realLifeSymptom: "परिवार में आध्यात्मिक उन्नति, मानसिक शांति, अनिद्रा से मुक्ति और सात्विक समृद्धि।",
    secretShastricAxiom: "सुबह फोन पर भजन-कीर्तन लगाना राहु (फोन) और गुरु (भजन) को जोड़कर सोम पद को जागृत करता है।",
    activationMethod: "चांदी का सिक्का या नीला एंटी-क्लॉकवाइज स्प्रिंग।",
    blockingMethod: "सदा खुला रखें।",
  },
  {
    id: "N6",
    padCode: "N6",
    nameEn: "Bhujanga (भुजंग)",
    nameHi: "भुजंग (प्रचुर संपदा किंतु वहम व अंधविश्वास)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "NNE",
    directionHindi: "उत्तर-उत्तर-पूर्व (N6)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम",
    auspiciousness: "Good",
    classicalSignificance: "सर्प शक्ति के देवता। धन-संपत्ति तो बहुत प्रचुर देते हैं, परंतु जातक के मन में वहम, अंधविश्वास और नजर का अत्यधिक भय (Superstitious Nature) भर देते हैं।",
    realLifeSymptom: "'मुझ पर किसी ने कुछ कर दिया है, किसी ने मेरे पांव की मिट्टी उठा ली है' — ऐसा भ्रम निरंतर सताता है, यद्यपि धन अच्छा आता है।",
    secretShastricAxiom: "आर्थिक रूप से बहुत शुभ द्वार है; केवल मन के वहम को दूर रखने हेतु दालचीनी और कपूर का प्रयोग करें।",
    activationMethod: "नीला स्प्रिंग।",
    blockingMethod: "यदि वहम अत्यधिक सताए तो नीली टेप से हल्का संतुलित करें।",
  },
  {
    id: "N7",
    padCode: "N7",
    nameEn: "Aditi (अदिति)",
    nameHi: "अदिति (कन्याओं का विद्रोही स्वभाव)",
    classification: "Devata",
    layer: "OuterPerimeter",
    directionZone: "NNE",
    directionHindi: "उत्तर-उत्तर-पूर्व (N7)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "अल्युमिनियम",
    auspiciousness: "Inauspicious",
    classicalSignificance: "देवमाता अदिति का पद। जिस प्रकार S1 में पुत्र विद्रोही होते हैं, उसी प्रकार N7 में मुख्य द्वार होने पर घर की कन्याएं (बेटियां) माता-पिता के विरुद्ध विद्रोही हो जाती हैं।",
    realLifeSymptom: "बेटियों का कहना न मानना, माता-पिता की मर्जी के खिलाफ चलना और घर की मर्यादा का उल्लंघन करना।",
    secretShastricAxiom: "यदि घर में बेटियां न हों, तो यह द्वार खोला जा सकता है; यदि बेटियां हों तो इसे नीली टेप से ब्लॉक करें।",
    activationMethod: "केवल तब खोलें जब घर में बेटियां न हों।",
    blockingMethod: "नीली टेप (Blue Tape) अथवा अल्युमिनियम स्ट्रिप द्वारा ब्लॉक करें।",
  },
  {
    id: "N8",
    padCode: "N8",
    nameEn: "Diti (दिति)",
    nameHi: "दिति (अखंड बैंक बैलेंस, भरे हुए पर्स व एटीएम)",
    classification: "Asura", // Mother of Asuras, but commands deep tangible liquid cash
    layer: "OuterPerimeter",
    directionZone: "NNE/NE",
    directionHindi: "ईशान संधि (N8)",
    cardinalCompassDirection: "North",
    signNum: 6,
    element: "Water",
    elementColor: "#0284C7",
    zoneMetal: "चांदी / अल्युमिनियम",
    auspiciousness: "Supreme",
    classicalSignificance: "असुर माता दिति का पद। यह द्वार जातक के समस्त बैंक खातों, तिजोरियों, बटुओं (Wallets) और एटीएम को नकदी से सदैव परिपूर्ण रखता है।",
    realLifeSymptom: "कभी भी हाथ में पैसे की तंगी न होना, सभी खातों में प्रचुर बैलेंस रहना और निरंतर रोकड़ा आना।",
    secretShastricAxiom: "N8 पद पर कोई दोष न हो, और यहां धन व नकदी के प्रतीक लगाने से बैंक बैलेंस कभी खाली नहीं होता।",
    sacredFoodOffering: "शुद्ध जल में केसर व चांदी का सिक्का",
    foodDurationGuide: "15 दिन रखें।",
    activationMethod: "नीला एंटी-क्लॉकवाइज स्प्रिंग अथवा बैंक पासबुक/नकदी का चित्र।",
    blockingMethod: "सदा खुला रखें।",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. ELEMENTAL BAR-CHART BALANCING ENGINE (आगे वाला पीछे vs पीछे वाला आगे)
// ─────────────────────────────────────────────────────────────────────────────

export function getElementalBalancingGuide(
  zoneCode: string,
  element: "Water" | "AirWood" | "Fire" | "Earth" | "Space",
  condition: "Exhausted_Depleted" | "Extended_Bloated" | "Balanced"
): ElementalBarChartBalancing {
  const zoneNames: Record<string, string> = {
    N: "उत्तर (जल तत्व)",
    E: "पूर्व (वायु/काष्ठ तत्व)",
    S: "दक्षिण (अग्नि तत्व)",
    SW: "दक्षिण-पश्चिम (पृथ्वी तत्व)",
    W: "पश्चिम (आकाश तत्व)",
  };

  const nameHi = zoneNames[zoneCode] || zoneCode;

  if (condition === "Exhausted_Depleted") {
    // पीछे वाला आगे लेकर आना (Bring preceding element forward to replenish)
    if (element === "Water") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "पीछे वाला आगे लाएं (Bring Space into Water)",
        actionExplanation: "उत्तर (जल) की ऊर्जा बार चार्ट में कम (Depleted) है। इसके पीछे पश्चिम (आकाश तत्व = सफेद/क्रीम/सिल्वर) है। उत्तर में सफेद रंग, क्रीम पर्दे या गोलाकार वस्तुएं बढ़ाने से जल तत्व तुरंत प्रफुल्लित होकर संतुलित हो जाता है।",
        prohibitedItems: ["पीला रंग / मिट्टी के गमले (मिट्टी का बांध पानी को सुखा देगा)", "लाल हीटर"],
        recommendedTreatments: ["सफेद/क्रीम रंग के पर्दे", "गोलाकार धातु की वस्तुएं", "पवित्र झरने का चित्र"],
      };
    } else if (element === "AirWood") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "पीछे वाला आगे लाएं (Bring Water into Wood)",
        actionExplanation: "पूर्व (काष्ठ/वायु) की ऊर्जा कम है। इसके पीछे उत्तर (जल तत्व = नीला/काला/पानी) है। पूर्व दिशा में पानी का फव्वारा, नीले पर्दे या मनी प्लांट में स्वच्छ जल बढ़ाने से वृक्ष खिल उठता है और सामाजिक संपर्क बढ़ते हैं।",
        prohibitedItems: ["सफेद लोहा / कुल्हाड़ी (पेड़ कट जाएगा)", "भारी पीला रंग"],
        recommendedTreatments: ["नीला रंग / स्वच्छ जल का पात्र", "हरे भरे घने पौधे", "काष्ठ का अशोक स्तंभ"],
      };
    } else if (element === "Fire") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "पीछे वाला आगे लाएं (Bring Wood into Fire)",
        actionExplanation: "दक्षिण/अग्नि की ऊर्जा कम है। इसके पीछे पूर्व (काष्ठ/पौधे = हरा रंग) है। अग्नि में जितना काष्ठ (लकड़ी/हरा रंग) डालेंगे, अग्नि उतनी प्रज्वलित होगी। दक्षिण में हरे पौधे या हल्का हरा स्पर्श लाने से कैश फ्लो व आत्मविश्वास बढ़ता है।",
        prohibitedItems: ["नीला रंग / जल / आईना (अग्नि बुझ जाएगी)", "काला रंग"],
        recommendedTreatments: ["हरे छोटे इनडोर पौधे", "हल्का लाल/पीच बल्ब", "तांबे का त्रिकोण"],
      };
    } else if (element === "Earth") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "पीछे वाला आगे लाएं (Bring Fire into Earth)",
        actionExplanation: "दक्षिण-पश्चिम (पृथ्वी) की ऊर्जा कमजोर है। इसके पीछे दक्षिण (अग्नि = पीच/लाल/प्रकाश) है। अग्नि मिट्टी को पकाकर मजबूत ईंट बना देती है। SW में हल्का पीच या गर्म पीली रोशनी लगाने से स्थिरता लौटती है।",
        prohibitedItems: ["हरे पौधे / काष्ठ (जड़ें पृथ्वी का सीना चीर देंगी)", "स्टेनलेस स्टील"],
        recommendedTreatments: ["भारी पीला रंग", "पीतल का ठोस पात्र", "मिट्टी की कलाकृतियां"],
      };
    } else {
      // Space
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "पीछे वाला आगे लाएं (Bring Earth into Space)",
        actionExplanation: "पश्चिम (आकाश) की ऊर्जा कम है। इसके पीछे SW (पृथ्वी = पीला/ब्रास) है। पृथ्वी के गर्भ से ही धातु/आकाश निकलता है। पश्चिम में हल्का पीला ब्रास लाने से सेविंग्स व प्राप्तियां बढ़ती हैं।",
        prohibitedItems: ["लाल रंग / अग्नि (लोहा पिघल जाएगा)", "अत्यधिक हरा"],
        recommendedTreatments: ["सफेद रंग", "चांदी/लोहे के ठोस प्रतीक", "हल्का पीतल का कुबेर"],
      };
    }
  } else if (condition === "Extended_Bloated") {
    // आगे वाला पीछे लेकर आना (Bring succeeding element back to exhaust/consume excess)
    if (element === "Water") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "आगे वाला पीछे लाएं (Bring Wood to exhaust Water)",
        actionExplanation: "उत्तर (जल) की ऊर्जा बार चार्ट में अत्यधिक बढ़ी हुई (Extended) है, जिससे अवसर बह जाते हैं। इसके आगे पूर्व (काष्ठ/पौधे = हरा रंग) है। उत्तर में हरे पौधे रखने से वे अतिरिक्त जल को सोखकर (Suck) उसे शांत व संतुलित कर देते हैं।",
        prohibitedItems: ["अत्यधिक नीला रंग", "बड़ा आईना (जल और बढ़ जाएगा)"],
        recommendedTreatments: ["हरे पौधे (मनी प्लांट कांच की बोतल में)", "हल्का हरा बॉर्डर"],
      };
    } else if (element === "AirWood") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "आगे वाला पीछे लाएं (Bring Fire to exhaust Wood)",
        actionExplanation: "पूर्व (काष्ठ) अत्यधिक बढ़ा हुआ है। इसके आगे दक्षिण (अग्नि = लाल/पीच) है। पूर्व में हल्का लाल या पीच रंग का बल्ब लगाने से वह अतिरिक्त काष्ठ को जलाकर शांत कर देता है।",
        prohibitedItems: ["अत्यधिक पानी / बड़ा झरना"],
        recommendedTreatments: ["हल्का पीच या चेरी लैंप", "लाल स्वस्तिक"],
      };
    } else if (element === "Fire") {
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "आगे वाला पीछे लाएं (Bring Earth to exhaust Fire)",
        actionExplanation: "दक्षिण (अग्नि) अत्यधिक बढ़ी हुई है, जिससे घर में बेचैनी व कलह है। इसके आगे SW (पृथ्वी = पीला रंग) है। अग्नि में पीला रंग या मिट्टी का संपर्क लाने से अग्नि शांत होकर पृथ्वी में समा जाती है।",
        prohibitedItems: ["अत्यधिक गहरा लाल रंग"],
        recommendedTreatments: ["हल्का पीला रंग", "पीतल का दीपक"],
      };
    } else {
      // Space
      return {
        zoneCode,
        zoneNameHi: nameHi,
        element,
        condition,
        actionFormula: "आगे वाला पीछे लाएं (Bring Water to exhaust Space)",
        actionExplanation: "पश्चिम (आकाश) अत्यधिक बढ़ा हुआ है। इसके आगे उत्तर (जल = नीला रंग) है। पश्चिम में हल्का नीला स्पर्श लाने से आकाश तत्व का अति-विस्तार शांत होता है।",
        prohibitedItems: ["अत्यधिक सफेद धातु"],
        recommendedTreatments: ["हल्का नीला कुशन", "आसमानी नीली कलाकृति"],
      };
    }
  }

  return {
    zoneCode,
    zoneNameHi: nameHi,
    element,
    condition: "Balanced",
    actionFormula: "पूर्णतः संतुलित (Balanced)",
    actionExplanation: "यह ज़ोन बार चार्ट में समरस है। इसे स्वच्छ और स्वाभाविक रखें।",
    prohibitedItems: [],
    recommendedTreatments: ["नियमित स्वच्छता"],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. OCCULT & NEGATIVE ENERGY KUNDLI DIAGNOSTIC (शनि + राहु 8वें, 4थे, 1ले भाव)
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateOccultKundliDiagnostic(chart: ChartData): OccultKundliDiagnostic {
  const p = chart.planets || {};
  const saturn = p["Saturn"];
  const rahu = p["Rahu"];

  if (!saturn || !rahu) {
    return {
      isAfflicted: false,
      severity: "NONE",
      afflictionType: "None",
      diagnosticTitle: "नकारात्मक ऊर्जा व तंत्र बाधा दोष अनुपस्थित",
      diagnosticExplanation: "कुंडली में शनि और राहु का अष्टम, चतुर्थ अथवा लग्न भाव से ऐसा कोई नकारात्मक योग नहीं है जो ऊपरी बाधा या प्रेत-दोष को आकर्षित करे।",
      shastricRemedyGuidance: "घर को स्वच्छ रखें और सामान्य धूप-दीप का प्रयोग करें।",
    };
  }

  // Check 8th house lordship / connection
  const cusp8 = chart.houseCusps?.find(c => c.house === 8);
  const cusp4 = chart.houseCusps?.find(c => c.house === 4);
  const cusp1 = chart.houseCusps?.find(c => c.house === 1);

  const saturnHouse = saturn.house || 1;
  const rahuHouse = rahu.house || 1;

  // Authentic Rule: 8th House Sub-lord and Nakshatra Lord involved with Saturn & Rahu,
  // AND either Saturn or Rahu placed in 4th House (Dwelling) or 1st House (Native Body/Mind)
  const isSaturnOrRahuIn4 = saturnHouse === 4 || rahuHouse === 4;
  const isSaturnOrRahuIn1 = saturnHouse === 1 || rahuHouse === 1;
  const isSaturnRahuConjunction = saturn.signNum === rahu.signNum;
  const is8thInvolved = saturnHouse === 8 || rahuHouse === 8 || (cusp8 && (cusp8.signNum === 10 || cusp8.signNum === 11));

  if ((is8thInvolved || isSaturnRahuConjunction) && (isSaturnOrRahuIn4 || isSaturnOrRahuIn1)) {
    const isBoth = isSaturnOrRahuIn4 && isSaturnOrRahuIn1;
    const affType: "Dwelling_Premises" | "Native_Body_Mind" | "Both" = isBoth
      ? "Both"
      : isSaturnOrRahuIn4
      ? "Dwelling_Premises"
      : "Native_Body_Mind";

    const locHouse = isSaturnOrRahuIn4 ? 4 : 1;
    const locPlanet = isSaturnOrRahuIn4 ? (saturnHouse === 4 ? saturn : rahu) : (saturnHouse === 1 ? saturn : rahu);

    return {
      isAfflicted: true,
      severity: "CRITICAL",
      eighthSubLord: saturnHouse === 8 ? "Saturn" : "Rahu",
      eighthNakshatraLord: rahuHouse === 8 ? "Rahu" : "Saturn",
      afflictionType: affType,
      locationHouse: locHouse,
      locationSign: locPlanet?.sign,
      locationDirection: locHouse === 4 ? "चतुर्थ भाव (गृह परिसर)" : "प्रथम भाव (लग्न / जातक का शरीर)",
      diagnosticTitle: `🚨 शास्त्रीय निदान: ${affType === "Dwelling_Premises" ? "भवन परिसर में नकारात्मक ऊर्जा / ऊपरी बाधा दोष" : "जातक पर नजर दोष व तंत्र बाधा का साक्षात प्रभाव"}`,
      diagnosticExplanation: `वैदिक संहिता के अनुसार जब अष्टम भाव (गुह्य, तंत्र, आकस्मिक कष्ट) का संबंध शनि और राहु से बने तथा इनमें से कोई ग्रह ${locHouse}थे भाव (${locHouse === 4 ? "घरेलू सुख, भवन व भूमि" : "लग्न, सिर व शारीरिक काया"}) में विराजमान हो, तो जातक के ${locHouse === 4 ? "घर के उस विशिष्ट कोने में नकारात्मक ऊर्जा, भय और भारीपन" : "शरीर व मस्तिष्क पर सीधा नजर दोष व प्रेत बाधा"} उत्पन्न होती है।`,
      shastricRemedyGuidance: `1) घर के ${locHouse === 4 ? "चतुर्थ भाव की दिशा में कोई भी कबाड़, बंद घड़ियां या पुराना लोहा तुरंत हटाएं" : "लग्न की दिशा को गंगाजल व कपूर से शुद्ध करें"}। 2) प्रतिदिन प्रातः फोन पर भजन-कीर्तन चलाएं (राहु = फोन, गुरु = भजन)। 3) शाम को गूगल और लोबान की धूप दें। 4) N2 नागा देवता का नैवेद्य (दालचीनी) मुंह में रखें।`,
    };
  }

  return {
    isAfflicted: false,
    severity: "NONE",
    afflictionType: "None",
    diagnosticTitle: "वास्तु ऊर्जा सामान्य व सात्विक",
    diagnosticExplanation: "कुंडली में शनि-राहु का अष्टम भाव से चतुर्थ या लग्न पर कोई दूषित तंत्र-दोष योग नहीं बन रहा है। घर का वातावरण सुरक्षित है।",
    shastricRemedyGuidance: "घर के प्रवेश द्वार पर नियमित हल्दी-गंगाजल का स्वस्तिक बनाएं।",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN DISPATCHER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function runVastuPurushaMandalaEngine(
  chart: ChartData,
  zoneConditions?: Record<string, "Exhausted_Depleted" | "Extended_Bloated" | "Balanced">
): VastuPurushaMandalaDossier {
  const lagnaNum = chart.lagnaNum || 1;

  // Map each of the 45 Deities to Native's Lagna Kundli!
  const nativeMappings: NativeDevataMapping[] = MASTER_45_DEVATAS.map((devata) => {
    const sNum = devata.signNum;
    const houseNum = ((sNum - lagnaNum + 12) % 12) + 1;
    const isDusthana = [6, 8, 12].includes(houseNum);
    const isBenefic = [1, 2, 5, 9, 10, 11].includes(houseNum);
    const houseNature: "Benefic" | "Dusthana" | "Neutral" = isDusthana
      ? "Dusthana"
      : isBenefic
      ? "Benefic"
      : "Neutral";

    let badge = "";
    let explanation = "";

    if (isDusthana) {
      badge = `🚨 भाव ${houseNum} (त्रिक भाव) — एक्टिवेशन वर्जित`;
      explanation = `यद्यपि यह पद सामान्यतः ${devata.auspiciousness} माना जाता है, किंतु आपकी जन्मकुंडली में यह दिशा आपके भाव ${houseNum} (${houseNum === 8 ? "कष्ट, सरकारी छापेमारी व संकट" : houseNum === 12 ? "अस्पताल, व्यय व भारी हानि" : "रोग, ऋण व शत्रु"}) को संचालित करती है! अतः यहाँ मुख्य द्वार खोलना अथवा आक्रामक एक्टिवेशन करना भाव ${houseNum} के अनिष्ट को सक्रिय कर देगा। यहाँ केवल स्वच्छता व शांति बनाए रखें।`;
    } else if (isBenefic) {
      badge = `✅ भाव ${houseNum} (शुभ भाव) — सुरक्षित व फलदायी`;
      explanation = `आपकी जन्मकुंडली में यह पद भाव ${houseNum} (${houseNum === 11 ? "लाभ व महा-सफलता" : houseNum === 5 ? "हुनर व बुद्धि" : houseNum === 9 ? "भाग्य व गुरु कृपा" : houseNum === 10 ? "करियर व मान-सम्मान" : houseNum === 2 ? "धन संचय" : "आरोग्य व आत्मबल"}) के अधीन है। यहाँ यह द्वार अथवा एक्टिवेशन उपाय 100% चमत्कारिक परिणाम देगा।`;
    } else {
      badge = `⚖️ भाव ${houseNum} (मध्यम / तटस्थ)`;
      explanation = `आपकी कुंडली में यह दिशा भाव ${houseNum} में पड़ती है। सामान्य स्वच्छता और संतुलन बनाए रखें।`;
    }

    return {
      devata,
      nativeHouseNum: houseNum,
      houseNature,
      isDusthanaBlocked: isDusthana,
      shastricVerdictBadge: badge,
      verdictExplanation: explanation,
    };
  });

  // Occult Kundli Diagnostic
  const occultDiagnostic = evaluateOccultKundliDiagnostic(chart);

  // Elemental Balancing Guides
  const defaultConditions: Record<string, "Exhausted_Depleted" | "Extended_Bloated" | "Balanced"> = {
    N: "Balanced",
    E: "Balanced",
    S: "Balanced",
    SW: "Balanced",
    W: "Balanced",
    ...zoneConditions,
  };

  const elementalBalancingGuides: ElementalBarChartBalancing[] = [
    getElementalBalancingGuide("N", "Water", defaultConditions.N || "Balanced"),
    getElementalBalancingGuide("E", "AirWood", defaultConditions.E || "Balanced"),
    getElementalBalancingGuide("S", "Fire", defaultConditions.S || "Balanced"),
    getElementalBalancingGuide("SW", "Earth", defaultConditions.SW || "Balanced"),
    getElementalBalancingGuide("W", "Space", defaultConditions.W || "Balanced"),
  ];

  return {
    totalCount: 45,
    devatasCount: 33,
    asurasCount: 12,
    brahmasthanProtocol: {
      navelSignificance: "समस्त 45 ऊर्जा क्षेत्रों का प्राण केंद्र (G.O.D. - Generator ब्रह्मा)। नाभि के माध्यम से ही भवन के प्रत्येक देवता को ऊर्जा संचारित होती है।",
      consecrationMixture: [
        "शुद्ध गंगाजल (Ganga Jal)",
        "कच्चा गाय का दूध (Raw Cow Milk)",
        "शुद्ध हल्दी (Turmeric)",
        "कश्मीरी केसर (Saffron)",
      ],
      constructionTimingGuide: "भवन निर्माण आरंभ करते ही सर्वप्रथम ब्रह्मस्थान की खुदाई करके यह अभिमंत्रित मिश्रण अर्पित किया जाता है। यदि बना बनाया घर हो, तो प्रातः सफाई के बाद इसका छिड़काव करें।",
      dailyMaintenanceSpray: "प्रतिदिन प्रातः घर की झाड़ू-पोंछा होने के उपरांत ब्रह्मस्थान पर गंगाजल, दूध, हल्दी व केसर के पवित्र जल का हल्का छिड़काव करें।",
      overnightVesselDisposalRule: "यदि संभव हो तो रात्रि में ब्रह्मस्थान पर एक पात्र में यह जल-मिश्रण रख दें। प्रातः इसे गमलों/पौधों में अथवा बहते जल में विसर्जित करें (किचन सिंक में डाल सकते हैं, परंतु टॉयलेट में कभी विसर्जित न करें)।",
      tulsiVedicSignificance: "प्राचीन काल में घर के मध्य आंगन में तुलसी जी का पौधा लगाने और उसकी नित्य सेवा के पीछे यही वैज्ञानिक रहस्य था कि ब्रह्मस्थान की कॉस्मिक ऊर्जा सदैव सक्रिय और उर्ध्वगामी रहे।",
      liverHealthConnection: "मानव शरीर में ब्रह्मस्थान सीधे यकृत (Liver) और पाचन अग्नि से संबद्ध है। ब्रह्मस्थान में पिलर, भारी वजन या अवरोध आने पर परिवार के सदस्यों का लिवर रोगग्रस्त होने लगता है और समस्त कार्य रुक जाते हैं।",
      criticalProhibitions: [
        "ब्रह्मस्थान पर भारी कंक्रीट का पिलर (Pillar) लगाना सख्त वर्जित है।",
        "ब्रह्मस्थान में सीढ़ियां, सेप्टिक टैंक या गहरा गड्ढा नहीं होना चाहिए।",
        "यहां गंदगी, कबाड़ या भारी तिजोरी न रखें।",
      ],
    },
    deities: MASTER_45_DEVATAS,
    nativeMappings,
    occultDiagnostic,
    elementalBalancingGuides,
    toiletNeEmergencyProtocol: {
      status: "CRITICAL_DEFECT",
      strictWarning: "ईशान कोण (North-East) में टॉयलेट होना सबसे बड़ा वास्तु दोष है। इसे कटर (Cutter) से कभी न काटें! कटर से काटने पर जिनकी गुरु की दशा चल रही हो अथवा गुरु पीड़ित हो, उनकी तत्काल ब्रेन सर्जरी (Brain Surgery) का योग बन जाता है।",
      remedySteps: [
        "यदि संभव हो तो टॉयलेट सीट को पूरी तरह डिमॉलिश (हटा) कर दें।",
        "यदि डिमॉलिश करना असंभव हो, तो कटर का प्रयोग कदापि न करें।",
        "3 इंच चौड़े ब्रश से टॉयलेट सीट के चारों ओर शुद्ध हरे रंग (Green Paint) की 3 इंच चौड़ी पट्टी बनाएं (अथवा 3 इंच की ग्रीन टेप लगाएं)।",
        "टॉयलेट के भीतर 0-वाट का हरा बल्ब (Green Zero-Watt Bulb) 24 घंटे जलाकर रखें ताकि ऊर्जा की रिक्तता की भरपाई होती रहे।",
      ],
    },
    mirrorElementalAxiom: {
      rule: "वास्तु शास्त्र में दर्पण (Looking Mirror) सीधे जल तत्व (चंद्रमा व बुध) का प्रतिनिधित्व करता है, राहु का नहीं।",
      permittedZones: [
        "उत्तर (North) — जल तत्व का विस्तार करता है।",
        "उत्तर-पूर्व (North-East) — चेतना और स्पष्टता बढ़ाता है।",
        "पूर्व (East) — यदि पूर्व कटा हुआ हो तो दर्पण से विस्तार संभव है।",
        "पश्चिम (West) — स्पेस तत्व का विस्तार करने में सहायक।",
      ],
      strictlyProhibitedZones: [
        "दक्षिण (South) — अग्नि को बुझा देता है।",
        "दक्षिण-पूर्व (South-East) — कैश फ्लो को नष्ट करता है।",
        "दक्षिण-पश्चिम (South-West) — स्थिरता, हुनर और रिश्तों को समाप्त करता है।",
      ],
      consequencesOfSouthMirror: "साउथ-वेस्ट में दर्पण लगाने से बच्चे मोटे (Obese) होने लगते हैं, उनका हुनर नष्ट हो जाता है और जीवन में भारी अस्थिरता आती है। साधारण खिड़की का शीशा (Window Glass) दर्पण नहीं है, केवल लुकिंग मिरर ही प्रभावी होता है।",
      correctionMethod: "यदि वैनिटी बाथरूम साउथ-वेस्ट में हो और दर्पण हटाना संभव न हो, तो दर्पण के चारों ओर 1 इंच चौड़ी पीली टेप (Yellow Tape) या पीले पेंट की बॉर्डर बनाकर उसे निष्प्रभावी करें।",
    },
    subtleShastricDirectives: {
      foodPlacementSubtleRules: {
        utensilBoxRule: "यदि देवता का क्षेत्र वॉशरूम, पानी या गीले स्थान में आ रहा हो, तो खाद्य सामग्री को उस दिशा के अनुकूल धातु (जैसे उत्तर हेतु एल्युमिनियम, पूर्व हेतु तांबा/कांस्य, पश्चिम हेतु पीतल) के डिब्बे में सुरक्षित बंद करके रखा जा सकता है।",
        antiColorWarning: "खाद्य सामग्री अथवा डिब्बे को ढकने हेतु प्रयुक्त कपड़ा या आवरण कदापि उस दिशा का विरोधी रंग (Anti-Color) नहीं होना चाहिए।",
        activationDuration: "खाद्य नैवेद्य को प्रत्येक 3 दिन में बदलना चाहिए। लगातार 10 से 15 दिन स्थापित रखने पर संबंधित देवता का ऊर्जा क्षेत्र स्थायी रूप से जाग्रत हो जाता है।",
        pinchQuantityRule: "विशाल भवनों में नियमित मात्रा रखें, परंतु छोटे फ्लैट्स में खाद्य सामग्री की मात्र 'एक चुटकी' (A single pinch) स्थापित कर देना भी पूर्ण परिणाम देता है।",
        floorDrillingPermanentRule: "यदि फर्श पर खाद्य सामग्री बार-बार हटाए जाने का भय हो, तो फर्श में ड्रिल मशीन से 3-इंच का छिद्र करके सामग्री/स्प्रिंग स्थापित कर उसे ग्राउटिंग पाउडर अथवा व्हाइट सीमेंट से बंद कर दें—यह स्थायी व अचूक समाधान है।",
      },
      colorElementalNuances: {
        whiteNotNeutralRule: "सफेद रंग (White) न्यूट्रल नहीं होता! सफेद रंग पश्चिम दिशा / स्पेस (आकाश/धातु) का तत्व है। न्यूट्रल रंग केवल 'क्रीम' (Off-White / Cream) होता है जो पृथ्वी तत्व का प्रतिनिधित्व करता है।",
        southIronGateDefect: "दक्षिण दिशा (S2/S3) में सफेद रंग का लोहे का गेट लगाना भारी वास्तु दोष है (लोहा = शनि, सफेद = स्पेस/धातु, जो दक्षिण की अग्नि के शत्रु हैं)। इसे बदलकर 'पीच' (Peach) अथवा 'चेरी' रंग करना चाहिए।",
        extendedSouthPeachGoldenMix: "यदि दक्षिण दिशा पहले से ही बढ़ी हुई (Extended Zone) हो, तो वहां केवल लाल या पीच करने से ऊर्जा और असंतुलित हो जाएगी। ऐसी स्थिति में 'पीच और गोल्डन' (Peach + Golden) का मिश्रण करें, जिससे अग्नि शांत भी रहे और अतिरिक्त ऊर्जा एग्जॉस्ट हो जाए।",
        neRedMattressCorrection: "यदि उत्तर-पूर्व (NE) में लाल रंग का गद्दा आ गया हो, तो गद्दे को बदलने के स्थान पर उसे 'आसमानी नीले' (Sky Blue) कवर से ढक देने से दोष समाप्त हो जाता है।",
      },
      sleepingPositionAxiom: {
        headVsBedRule: "बेड का ढांचा (Headboard) चाहे उत्तर की दीवार से सटा हो, उससे दोष नहीं होता। मुख्य नियम यह है कि सोते समय सिर (Head) और तकिया (Pillow) दक्षिण (South) अथवा पूर्व की ओर होना चाहिए, उत्तर की ओर कभी सिर न करें।",
        recommendedPillowDirection: "तकिया सदैव दक्षिण अथवा पूर्व दिशा में रखें।",
      },
      multiStoryFlatParadox: {
        explanation: "एक ही बहुमंजिला इमारत (Multi-Story Flats) में एक ही दिशा की मुख्य एंट्री होने पर भी विभिन्न परिवारों को अलग-अलग परिणाम मिलते हैं, क्योंकि भवन का परिणाम परिवार के मुखिया की जन्मकुंडली, सक्रिय दशा, गोचर और 6/8/12 भावों से तय होता है।",
        familyHeadChartRule: "वास्तु उपाय सर्वप्रथम परिवार के मुखिया (Earning Head) की कुंडली के आधार पर, और तत्पश्चात बच्चों के करियर हेतु किए जाने चाहिए।",
        virtualBalconyEntryRule: "2-साइड अथवा 3-साइड ओपन फ्लैट्स में अपनी बालकनी की दीवार पर उस देवता का आभासी द्वार (Virtual Entry Poster) लगाकर फर्श पर स्प्रिंग स्थापित कर शुभ ऊर्जा को घर के भीतर आकर्षित किया जा सकता है।",
      },
      neToiletFamilyTargeting: {
        vulnerableMemberRule: "घर में यदि 7 सदस्य हों और उत्तर-पूर्व (NE) में टॉयलेट हो, तो रोग सबको नहीं होगा; केवल उसी जातक को होगा जिसकी कुंडली में देवगुरु बृहस्पति और राहु का संबंध (युति या दृष्टि) हो और उनकी दशा/अंतर्दशा चल रही हो।",
        planetsFollowNativeRule: "जातक जितने भी घर बदले, ग्रह उसका पीछा नहीं छोड़ते! यदि कुंडली में राहु-गुरु पीड़ित हैं तो नए घर के NE में या तो टॉयलेट मिलेगी या वहां खराब इलेक्ट्रॉनिक उपकरण व कबाड़ जमा मिलेगा।",
        dailyRahuJupiterHarmonization: "राहु-गुरु का अचूक दैनिक उपाय: प्रातः उठते ही मोबाइल फोन (राहु) पर भक्तिमय भजन-कीर्तन (गुरु) बजाएं और ऑनलाइन आध्यात्मिक ज्ञान प्राप्त करें। इससे यह युति शुभ फल देने लगती है।",
      },
      shoeRackNorthAxiom: "उत्तर दिशा के मुख्य द्वार पर शू-रैक रखा जा सकता है, परंतु जूते-चप्पल खुले नहीं होने चाहिए। शू-रैक लकड़ी का और पूर्णतः बंद अलमारी (Closed Cabinet) रूप में होना अनिवार्य है।",
      ancestorPhotoAxiom: "पितरों एवं दिवंगत पूर्वजों का चित्र सदैव दक्षिण-पश्चिम (SW) दिशा में 'पितृ देवता' (W1) के स्थान पर ही स्थापित करना चाहिए।",
      bnnDharmaKarmaAxiom: "भृगु नंदी नाड़ी (BNN) में 1-5-9 त्रिकोण कर्म नहीं है, वह 'धर्म' (कर्तव्य एवं पूर्वजन्मों का ऋण चुकाना) है। कर्म, आजीविका और धन पूर्णतः '2-6-10' (अर्थ त्रिकोण) में समाहित है।",
      shareMarketVenusKetuRahuParadox: "जिम साइमंस (Jim Simons) व चार्ली मंगर (Charlie Munger) नाड़ी सूत्र: भृगु नंदी नाड़ी (BNN) में शुक्र + केतु (Venus-Ketu) योग शेयर बाजार में आध्यात्मिक डिटैचमेंट देता है, लेकिन संसार का महा-धन कमाने हेतु केतु सांसारिक मोह त्याग देता है। शेयर बाजार से अकूत गणितीय व सट्टे का धन कमाने के लिए 'राहु' (Rahu = अल्गोरिदम, हेज फंड, अचानक लाभ, असीमित महत्वाकांक्षा) अथवा शुक्र-राहु युति अनिवार्य होती है।",
      shaktiChakraDeityVsZoneColorNuance: "शक्ति चक्र (45 Devata Chakra) में कुछ देवताओं पर दर्शाए गए आंतरिक रंग (जैसे E8 आकाश या वरुण या असुर पर लाल/विशिष्ट रंग) केवल उस विशिष्ट 'देवता की व्यक्तिगत दैवीय ऊर्जा' का प्रतीक हैं, उस 'दिशा या वास्तु ज़ोन' के तत्व का रंग नहीं! अतः ज़ोनल बार-चार्ट उपचार सदैव ज़ोन के मूल पंचतत्व (16 Zones Element) के आधार पर ही करना चाहिए, देवता के आंतरिक प्रतीक रंग से भ्रमित होकर गलत रंग न लगाएं।",
      piscesLagnaExaltedVenusRahuIpoYoga: "मीन लग्न का आईपीओ व वित्तीय योग: मीन लग्न के प्रथम भाव में उच्च का शुक्र (Exalted Venus in 1st house / Pisces) और राहु की युति जातक को शेयर बाजार, आईपीओ (IPO) और वित्तीय निवेश में असाधारण अंतर्दृष्टि और प्रचुर लाभ प्रदान करती है।",
      classicalCaseStudies: [
        {
          title: "प्रसिद्ध स्वर्ण व्यवसायी की उत्तर दीवार (Scorpio Lagna Jeweler)",
          kundliContext: "वृश्चिक लग्न के एकादश भाव (कन्या राशि = North Zone) में देवगुरु बृहस्पति (स्वर्ण व समृद्धि) स्थित थे। शोरूम के उत्तर में गोल्डन टेक्सचर पेंट था जिससे अरबों का लाभ हो रहा था।",
          vastuDefectOrAction: "एक सामान्य वास्तु सलाहकार ने उत्तर में गोल्डन को एंटी-एलिमेंट बताकर नीला (Blue Water) पेंट करवा दिया, जिससे स्वर्ण कारोबार अचानक बैठ गया और भारी नुकसान होने लगा।",
          outcomeAndRemedy: "एस्ट्रो-वास्तु विश्लेषण द्वारा 11वें भाव के गुरु को पहचानकर पुनः गोल्डन तत्व स्थापित किया गया, जिससे कुबेर की कृपा और करोड़ों का प्रवाह तुरंत बहाल हुआ।",
        },
        {
          title: "कन्या लग्न में नीच के मंगल की 90° घातक दृष्टि (Virgo Lagna Mars Hit)",
          kundliContext: "कन्या लग्न के 11वें भाव (कर्क = NNE) में अष्टमेश नीच का मंगल 5वें तारे (प्रत्यक) में बैठकर 2nd भाव (तुला = WSW) के 20° पर युत बुध-शुक्र (लक्ष्मी नारायण योग) को 90° की घातक हिट दे रहा था।",
          vastuDefectOrAction: "मंगल की दशा आते ही परिवार के सारे संचित धन और संपत्ति में भारी गिरावट आ गई।",
          outcomeAndRemedy: "NNE (4 नंबर साइन) से मंगल का दोष निवारण किया गया और WSW (7 नंबर साइन) में भगवान विष्णु का स्वरूप स्थापित कर पूजन कराया गया; अवरुद्ध धन तुरंत रिलीज हुआ।",
        },
      ],
    },
  };
}

