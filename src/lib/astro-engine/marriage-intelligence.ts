/**
 * ============================================================================
 * ASTROLIFE — MARRIAGE INTELLIGENCE & D9 NAVAMSHA ENGINE
 * ============================================================================
 * Deep synthesis of KP Stellar Astrology, K.N. Rao Research, and Classical
 * Navamsha (D9) Marriage Varga Analysis.
 *
 * Capabilities:
 * 1. 7th Cusp Sub-Lord's Star Lord in 12 Bhavas (Where & How Marriage Occurs)
 * 2. 7th House Rashi Impact (Post-Marriage Psychological & Life Manifestation)
 * 3. D9 Navamsha 4-Pillar Health Audit (Houses 1, 4, 7, 12 & Bedroom Bliss)
 * 4. Dual / Second Marriage Analysis (Dual Signs 3, 6, 9, 12 & Mercury Rule)
 * 5. Renunciation / Sanyas & Denial Indicators (Saturn-Ketu, Ketu in 1/12)
 * 6. Intimacy / Orientation Dynamics (Saturn + Mercury + Venus in 5/7/12, NNW)
 * 7. Classical & Practical Remedial Guidance (Temple Shivalinga, WSW Venus, etc.)
 * ============================================================================
 */

import type { ChartData, PlanetData } from "./calculations";
import { runKPEngine, type KPRow, type KPCuspRow } from "./kp";

// ── Types & Interfaces ───────────────────────────────────────────────────────

export interface MeetingContextResult {
  house: number;
  circumstance: string;
  partnerNature: string;
  caution?: string;
  sourceStarLord: string;
  starLordHouse: number;
}

export interface Rashi7thImpactResult {
  signNumber: number;
  signName: string;
  lifeDomainActivated: string;
  behavioralDynamics: string;
  warningOrRemedy?: string;
}

export interface Kalpurush7thRashiAnchor {
  signNumber: number; // 7 (Libra / तुला)
  signName: string;   // "Libra"
  d1House: number;    // 1 to 12
  d9House: number;    // 1 to 12
  d1Occupants: string[];
  d9Occupants: string[];
  meetingChannelTitleHinglish: string;
  meetingChannelNarrativeHinglish: string;
  maritalBalanceDomainHinglish: string;
  karmicAnchorAdviceHinglish: string;
  venus12thRemedyApplicable: boolean;
  venus12thRemedyHinglish?: string;
}

export interface SeventhHouseOccupantNLItem {
  planet: string;
  isOccupant: boolean; // true if sitting in H7, false if 7th lord fallback
  planetSign: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatraLordHouse: number;
  nakshatraLordSign: string;
  titleHinglish: string;
  narrativeHinglish: string;
  karmicAdviceHinglish: string;
  remedyHinglish?: string;
}

export interface SeventhHouseOccupantNLAnalysis {
  occupants: SeventhHouseOccupantNLItem[];
  hasOccupants: boolean;
  synthesisHinglish: string;
}

export interface D9HouseAffliction {
  house: number;
  sign: string;
  planets: string[];
  severity: "clean" | "mild" | "moderate" | "severe";
  interpretation: string;
}

export interface D9MarriageAuditResult {
  d9LagnaSign: string;
  pillars: {
    h1NativeMindset: D9HouseAffliction;
    h4MaritalPeace: D9HouseAffliction;
    h7SpouseNature: D9HouseAffliction;
    h12BedroomBliss: D9HouseAffliction;
  };
  bedroomBlissStatus: "excellent" | "harmonious" | "strained" | "separate_bedrooms_risk";
  explosiveTemperamentRisk: boolean;
  overallD9Verdict: string;
}

export interface DualMarriageResult {
  hasDualSignPromise: boolean;
  subLordInDualSign: boolean;
  starLordInDualSignOrMercury: boolean;
  seventhSubLord: string;
  subLordSign: string;
  starLord: string;
  mercuryInvolvement: boolean;
  notes: string;
}

export interface SanyasDenialResult {
  denialIndicated: boolean;
  saturnKetu7thOr1st: boolean;
  ketu1stOr12th: boolean;
  activeSanyasDasha: boolean;
  interpretation: string;
}

export interface IntimacyOrientationResult {
  afflictionDetected: boolean;
  involvedPlanets: string[];
  involvedHouses: number[];
  vastuZone: string;
  interpretation: string;
}

export interface PunarbuYogaResult {
  detected: boolean;
  conditions: string[];
  severity: "none" | "mild" | "moderate" | "strong";
  effects: string;
  cancellationFactors: string[];
  isCancelled: boolean;
  remedy: string;
}

export interface SeparativeInfluenceAudit {
  afflictedHouses: Array<{
    house: number;
    houseName: string;
    separativePlanets: string[];
    severity: "clean" | "mild" | "moderate" | "severe";
  }>;
  seventhLordAfflicted: boolean;
  seventhLordSeparators: string[];
  totalSeparativeScore: number;
  interpretation: string;
}

export interface BarrenSignsAudit {
  lagnaInBarrenSign: boolean;
  seventhCuspInBarrenSign: boolean;
  venusInBarrenSign: boolean;
  barrenPlacements: string[];
  interpretation: string;
}

export interface MarriageDirectionResult {
  primaryDirection: string;
  primaryDirectionHindi: string;
  secondaryDirection: string;
  rationale: string;
}

export interface D1toD9CrossMapping {
  trikInD9: Array<{
    d1House: number;
    d1Rashi: string;
    d9House: number;
    frictionDomain: string;
  }>;
  wealthInD9: Array<{
    d1House: number;
    d1Rashi: string;
    d9House: number;
    growthDomain: string;
  }>;
  synthesis: string;
}

export interface MarriageRemedyItem {
  category: "Universal" | "Mars" | "Moon" | "Venus" | "Mercury" | "Sun" | "Desire_Fulfillment" | "Punarbu" | "Separative";
  title: string;
  procedure: string;
  caution?: string;
  astrologicalRationale: string;
}

export interface MarriageIntelligenceReport {
  meetingContext: MeetingContextResult;
  rashiImpact: Rashi7thImpactResult;
  kalpurush7thAnchor: Kalpurush7thRashiAnchor;
  d9Audit: D9MarriageAuditResult;
  dualMarriage: DualMarriageResult;
  sanyasDenial: SanyasDenialResult;
  intimacyAudit: IntimacyOrientationResult;
  punarbuYoga: PunarbuYogaResult;
  separativeAudit: SeparativeInfluenceAudit;
  barrenAudit: BarrenSignsAudit;
  marriageDirection: MarriageDirectionResult;
  seventhHouseOccupantsNL: SeventhHouseOccupantNLAnalysis;
  d1ToD9Mapping: D1toD9CrossMapping;
  remedies: MarriageRemedyItem[];
  executiveSummary: string;
}

// ── Constants & Knowledge Base ───────────────────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const SIGN_LORDS: Record<string, string> = {
  Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon",
  Leo:"Sun",   Virgo:"Mercury", Libra:"Venus",   Scorpio:"Mars",
  Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter",
};

const DUAL_SIGNS = [3, 6, 9, 12]; // Gemini, Virgo, Sagittarius, Pisces
const DUAL_SIGN_NAMES = ["Gemini", "Virgo", "Sagittarius", "Pisces"];

const MEETING_CONTEXT_MAP: Record<number, { circumstance: string; partnerNature: string; caution?: string }> = {
  1: {
    circumstance: "Meeting occurs at a social gathering, hospital, wedding ceremony, or through direct family network. Initiated by mutual attraction to education and graceful conduct, formalized via parents.",
    partnerNature: "Cultured, presentable, and well-educated. Relationship begins with strong mutual physical and intellectual rapport.",
  },
  2: {
    circumstance: "Marriage takes place within the extended family, close-knit community, or established financial circle.",
    partnerNature: "Financially solid, affluent, and supportive of household wealth. Brings financial prosperity to the marital union.",
  },
  3: {
    circumstance: "Alliance initiated via communication channels: matrimonial websites (Shaadi/BharatMatrimony), social media, classified ads, or through siblings/neighbors.",
    partnerNature: "Extremely hardworking, practical, and stands shoulder-to-shoulder with the native in business or career.",
  },
  4: {
    circumstance: "Spouse resides very close to the native's home (same street, colony, or immediate neighborhood). Strong maternal family backing.",
    partnerNature: "Domestic, nurturing, and family-oriented. Often preceded by an earlier pre-marital heartbreak or breakup.",
    caution: "High likelihood of a prior emotional breakup before the final solemnization.",
  },
  5: {
    circumstance: "Romantic love marriage (*Prem Vivah*). Intense attraction and emotional bonding (classic Laila-Majnu bond).",
    partnerNature: "Deeply loving, romantic, and devoted. High emotional affinity.",
    caution: "Purva Punya transfer: 5th house is 11th from 7th. Native's past-life fortune may transfer to the spouse; career requires grounded discipline.",
  },
  6: {
    circumstance: "Met at the workplace, service environment, corporate daily routine, or facilitated by maternal uncle and aunt (Mama-Mami).",
    partnerNature: "Calculative, analytical, and detail-oriented.",
    caution: "6th negates 7th (12th from 7th). High risk of constant auditing, micro-criticism, fault-finding, and legal/domestic disputes if unmanaged.",
  },
  7: {
    circumstance: "Traditional, lifelong magnetic union. Stone-fortress boundaries; enduring commitment from the start.",
    partnerNature: "Ideal life companion; mutual attraction remains steadfast throughout life.",
  },
  8: {
    circumstance: "Challenging inception; obstacles and crises begin right from the engagement / ring ceremony. If Rahu is present, points to inter-caste or unconventional marriage.",
    partnerNature: "Intense, transformative, secretive, or psychologically demanding.",
    caution: "High obstacle zone. Requires careful pre-marital verification and astrological remedies.",
  },
  9: {
    circumstance: "Rise of fortune (*Bhagyodaya*) after marriage. Spouse enters like Goddess Lakshmi. Facilitated by father, Guru, or during pilgrimages.",
    partnerNature: "Pious, highly religious, disciplined, and spiritually inclined. Initiates sacred journeys together.",
  },
  10: {
    circumstance: "Alliance forged inside the native's profession, trade, corporate industry, or commercial connections.",
    partnerNature: "Ambitious, career-oriented, and prestigious. Marriage brings major surge in reputation, fame, and business growth.",
  },
  11: {
    circumstance: "Love marriage within the native's friend circle or extended professional network. Fulfillment of heart's cherished desires.",
    partnerNature: "Affectionate, socially well-networked, and brings multifold financial gains.",
  },
  12: {
    circumstance: "Highly auspicious if marriage occurs in a foreign country, outside native state/region, or through distant travels.",
    partnerNature: "Spiritual or overseas connection; requires geographic relocation.",
    caution: "If native remains in the same hometown, 12th house can cause bedroom distance, disappointment, or separate sleeping quarters.",
  },
};

const RASHI_7TH_IMPACT_MAP: Record<number, { domain: string; dynamics: string; caution?: string }> = {
  1: {
    domain: "New Venture & Rebirth (Aries)",
    dynamics: "Marriage triggers a fresh personal startup, renewed independence, and a completely new lifestyle chapter.",
  },
  2: {
    domain: "Accumulation of Wealth (Taurus)",
    dynamics: "Continuous growth of family wealth, jewelry, liquid cash, and financial solidity post-marriage.",
  },
  3: {
    domain: "Travel, Communication & Effort (Gemini)",
    dynamics: "Spike in daily communication, multifold efforts, short journeys, and exploration of creative hobbies.",
  },
  4: {
    domain: "Real Estate & Domestic Serenity (Cancer)",
    dynamics: "Acquisition of real estate, luxury vehicles, domestic comforts, and pursuit of higher education.",
  },
  5: {
    domain: "Intellect, Entertainment & Children (Leo)",
    dynamics: "Flourishing creative intelligence, entertainment, proactive problem-solving, and joy through progeny.",
  },
  6: {
    domain: "Karmic Debt, Daily Discipline & Routine (Virgo)",
    dynamics: " heightened daily workload, awareness of life's purpose and duties, health focus.",
    caution: "Risk of health vulnerabilities or constant criticism in marital routine.",
  },
  7: {
    domain: "Public Partnerships & Social Appeal (Libra)",
    dynamics: "Expansion into business partnerships, balanced lifestyle, and ongoing opposite-sex attraction.",
  },
  8: {
    domain: "Metamorphosis & Hidden Pressures (Scorpio)",
    dynamics: "Sudden transformative challenges, administrative/tax/financial hurdles, or mysterious family trials.",
    caution: "Scorpio in 7th requires conscious emotional honesty; avoid secretive power struggles.",
  },
  9: {
    domain: "Spiritual Fortune & Divine Grace (Sagittarius)",
    dynamics: "Doors of destiny unlock; Guru's guidance, philosophical expansion, and ethical righteousness prevail.",
  },
  10: {
    domain: "Prestige, Fame & High Authority (Capricorn)",
    dynamics: "Rise in public rank, corporate elevation, government connections, and professional stability.",
  },
  11: {
    domain: "Worldwide Network & Desires (Aquarius)",
    dynamics: "Massive international social circle, constant profit and gain from ventures.",
    caution: "Unending desires and sky-high expectations can create underlying lack of personal contentment.",
  },
  12: {
    domain: "Foreign Lands, Investments & Solitude (Pisces)",
    dynamics: "Overseas relocation, foreign investments, or spiritual retreat.",
    caution: "Can induce physical lethargy, fatigue, or need for private space/bed rest.",
  },
};

// ── Kalpurush 7th Rashi (Libra / तुला) Cosmic Marriage Anchor ───────────────
// Based on oral discourse transcripts:
// Where the 7th natural zodiac sign (Libra/तुला) sits indicates:
// 1. Spouse Karmic Meeting Channel (जीवनसाथी किस माध्यम से आएगा)
// 2. The Scales of Balance (दांपत्य का तराजू किस विषय पर संभलेगा)
// 3. 12th House Venus/Libra Wedding Charity Remedy (गरीब की शादी का खर्च उठाना)

interface Kalpurush7thMeta {
  title: string;
  narrative: string;
  balanceDomain: string;
  advice: string;
}

const KALPURUSH_7TH_HOUSE_MAP: Record<number, Kalpurush7thMeta> = {
  1: {
    title: "व्यक्तित्व व प्रत्यक्ष आकर्षण (Direct Self-Chosen Mirror)",
    narrative: "आपकी लग्न कुंडली में ७वीं राशि (तुला) प्रथम भाव (H1) में है। इसका अर्थ है कि जीवनसाथी आपके व्यक्तित्व के पूरक दर्पण के रूप में सीधे सामने से आएगा। आपसी आकर्षण बहुत स्वाभाविक, स्पष्ट और सम्मोहक होगा।",
    balanceDomain: "स्वयं की स्वतंत्रता बनाम रिश्ते का समर्पण। तुला तराजू है; अपने अहंकार को परे रखकर पार्टनर को बराबरी का अधिकार देना ही सबसे बड़ा संतुलन है।",
    advice: "रिश्ते में अपनी पहचान न खोएं, लेकिन हर बड़े फैसले में पार्टनर की राय को खुद के बराबर सम्मान दें।",
  },
  2: {
    title: "पारिवारिक सूत्र, वाणी व भोजन संस्कृति (Family Lineage & Shared Assets)",
    narrative: "तुला राशि द्वितीय भाव (H2) में होने से जीवनसाथी पारिवारिक आयोजनों, खानदान के संपर्कों, बैंकिंग/फाइनेंस या खान-पान और व्यापारिक महफिलों से जुड़ता है।",
    balanceDomain: "संयुक्त धन, वाणी की मिठास और परिवार के सदस्यों के बीच संतुलन। यहाँ कड़वी बोली पूरे दांपत्य की नींव हिला सकती है, जबकि मधुर वाणी इसे स्वर्ग बना देती है।",
    advice: "ससुराल और अपने मायके/परिवार के बीच वित्तीय पारदर्शिता रखें। दोनों मिलकर संयुक्त बचत और सात्विक भोजन की आदत बनाएं।",
  },
  3: {
    title: "सोशल मीडिया, ऑनलाइन मैट्रीमोनी व यात्रा (Digital & Communication Channel)",
    narrative: "तुला राशि तृतीय भाव (H3) में है। जीवनसाथी डिजिटल प्लेटफॉर्म्स (Shaadi, Matrimony, Social Media), दैनिक कम्यूनिकेशन, छोटी यात्राओं, पड़ोस या भाई-बहनों/दोस्तों के माध्यम से ज़िंदगी में प्रवेश करेगा।",
    balanceDomain: "रोज़मर्रा की बातचीत और साझा प्रयासों का संतुलन। यदि बातचीत में संवादहीनता (Silence) आ जाए, तो रिश्ते में अनावश्यक ठंडक आ सकती है।",
    advice: "दिन में चाहे कितनी भी व्यस्तता हो, दिन के अंत में 15 मिनट खुलकर बात करें। संवाद कभी न टूटने दें।",
  },
  4: {
    title: "गृहस्थ शांति, पैतृक स्थान व मातृक आशीर्वाद (Domestic Sanctuary & Roots)",
    narrative: "तुला राशि चतुर्थ भाव (H4) में है। जीवनसाथी आपके गृहक्षेत्र, पैतृक स्थान, मातृक संपर्कों या घरेलू सुख-शांति के वातावरण से मिलेगा। घर का माहौल उनके आने से पूरी तरह बदल जाता है।",
    balanceDomain: "माताजी/सास के साथ संबंध और घर के भीतर का शांति-संतुलन। बाहर के काम और घर के भीतर के निजी समय का संतुलन बनाना अनिवार्य होगा।",
    advice: "घर के उत्तर-पूर्व या दक्षिण-पश्चिम कोने को स्वच्छ रखें। काम का तनाव कभी घर के शयनकक्ष में न लाएं।",
  },
  5: {
    title: "प्रेम संबंध, शिक्षा, कला व पूर्व पुण्य (Romantic Affinity & Creative Sparks)",
    narrative: "तुला राशि पंचम भाव (H5) में होने से यह प्रबल 'प्रेम विवाह' (Love Marriage) का योग बनाता है। जीवनसाथी कॉलेज, क्रिएटिव प्रोजेक्ट्स, कला/मनोरंजन या बौद्धिक परिचर्चाओं के दौरान दिल से जुड़ता है।",
    balanceDomain: "रोमांस और व्यावहारिक ज़िम्मेदारियों के बीच संतुलन। शादी के 10 साल बाद भी रिश्ते में वही डेटिंग वाली ताजगी बनाए रखना आवश्यक है।",
    advice: "एक-दूसरे के शौक़ और रचनात्मक सपनों का सम्मान करें। बच्चों के आने के बाद भी आपसी रोमांस को प्राथमिकता दें।",
  },
  6: {
    title: "कार्यक्षेत्र, सेवा, साझा संघर्ष व अंधा विश्वास (Workplace, Daily Duty & Blind Faith)",
    narrative: "तुला राशि छठे भाव (H6) में है। जीवनसाथी रोज़गार के स्थल (Daily workplace), किसी सर्विस या साझा संघर्ष के दौरान मिलता है। यहाँ व्याख्यान का 'Blind Faith' (अंधा विश्वास) का नियम लागू होता है।",
    balanceDomain: "रोज़मर्रा की दिनचर्या, काम का बंटवारा और सेहत का संतुलन। यहाँ छोटी-छोटी गलतियों पर मीन-मेख निकालना या नुक़्ताचीनी करना सबसे बड़ा ज़हर है।",
    advice: "पार्टनर पर अंधा भरोसा रखें, संशय न करें। रोज़मर्रा के कामों में सहयोग करें और घर में शमी या तुलसी का पौधा लगाएं।",
  },
  7: {
    title: "कालपुरुष का परम प्राकृतिक संरेखण (The Natural Sacred Union)",
    narrative: "तुला राशि प्राकृतिक रूप से सप्तम भाव (H7) में ही है (मेष लग्न)। यह दांपत्य का सबसे शुद्ध, क्लासिकल और पारंपरिक स्वरूप है। विवाह समाज और परिवार की सहमति से सम्मानजनक ढंग से होता है।",
    balanceDomain: "परस्पर समानता और 50-50 की साझेदारी। न कोई बड़ा, न कोई छोटा—दोनों रथ के दो बराबर पहिए हैं।",
    advice: "साझेदारी में किसी तीसरे व्यक्ति को दखल न देने दें। महादेव-पार्वती की युगल उपासना दांपत्य को अमर बनाती है।",
  },
  8: {
    title: "आकस्मिक परिवर्तन, ससुराल का रहस्य व गूढ़ बंधन (Transformative & Deep Karmic Bond)",
    narrative: "तुला राशि अष्टम भाव (H8) में है। विवाह जीवन में एक अप्रत्याशित मोड़ लेकर आता है। जीवनसाथी किसी बड़े जीवन-परिवर्तन के समय, ससुराल पक्ष के संपर्कों या किसी गोपनीय माध्यम से आता है।",
    balanceDomain: "भावनात्मक गहराई, ससुराल की अपेक्षाएं और वित्तीय विरासत का संतुलन। मन में कोई गुप्त बात छिपाकर रखना शक की दीवार खड़ी कर सकता है।",
    advice: "पार्टनर से कभी कोई वित्तीय या भावनात्मक बात न छिपाएं। मंगलवार/शनिवार को मौसमी फलों का दान अष्टम के भय को काटता है।",
  },
  9: {
    title: "तीर्थ, धर्म, उच्च शिक्षा व भाग्योदय (Spiritual Grace & Fortune Awakening)",
    narrative: "तुला राशि नवम भाव (H9) में है। विवाह होते ही साक्षात 'भाग्योदय' होता है—जैसे घर में लक्ष्मी का आगमन हो। जीवनसाथी किसी तीर्थ यात्रा, धार्मिक आयोजन, उच्च शिक्षा या गुरु के आशीर्वाद से मिलता है।",
    balanceDomain: "धार्मिक मान्यताओं, जीवन मूल्यों और सांस्कृतिक पृष्ठभूमि का संतुलन। दोनों की सोच में उदारता होनी चाहिए।",
    advice: "विवाह के बाद जीवनसाथी के साथ पवित्र धामों की यात्रा करें। बुजुर्गों और गुरुजनों का नित्य आशीर्वाद लें।",
  },
  10: {
    title: "प्रोफेशनल प्रतिष्ठा, कॉर्पोरेट नेटवर्क व पॉवर कपल (Power Couple & Public Honor)",
    narrative: "तुला राशि दशम भाव (H10) में है। जीवनसाथी आपके करियर, कॉर्पोरेट जगत, व्यावसायिक सम्मेलनों या कार्यक्षेत्र की शीर्ष ऊँचाइयों में मिलता है। आप दोनों मिलकर समाज में 'पॉवर कपल' बनते हैं।",
    balanceDomain: "करियर की महत्वाकांक्षा और दांपत्य जीवन के समय का संतुलन। एक-दूसरे से प्रतिस्पर्धा करने के बजाय एक-दूसरे की सीढ़ी बनें।",
    advice: "ऑफिस की सफलता का जश्न घर पर मनाएं, लेकिन घर के भीतर पद और ओहदे का रौब कभी न दिखाएं।",
  },
  11: {
    title: "मित्र मंडली, कम्युनिटी व इच्छा पूर्ति (Fulfillment of Desires & Friends Circle)",
    narrative: "तुला राशि एकादश भाव (H11) में है। जीवनसाथी आपके दोस्तों के ग्रुप, कम्युनिटी इवेंट्स, बड़े भाई-बहनों के संपर्कों या क्लब नेटवर्क से आता है। यह विवाह आपकी सबसे बड़ी दबी इच्छा को पूरा करता है।",
    balanceDomain: "सामाजिक जीवन और निजी दांपत्य का संतुलन। बहुत ज़्यादा दोस्तों के बीच पार्टनर की उपेक्षा न हो।",
    advice: "पार्टनर को हमेशा अपना सबसे करीबी दोस्त (Best Friend) बनाकर रखें। जब दोस्ती पक्की होगी, तो विवाह कभी नहीं डगमगाएगा।",
  },
  12: {
    title: "दूरस्थ स्थान, विदेश, त्याग व विवाह दान (Foreign Lands, Spiritual Surrender & Sacred Charity)",
    narrative: "तुला राशि द्वादश भाव (H12) में है। जीवनसाथी जन्मस्थान से बहुत दूर, विदेश, अन्य प्रांत, या किसी आध्यात्मिक/रिसर्च पृष्ठभूमि से आता है। यहाँ त्याग और निस्वार्थ प्रेम ही सफलता की कुंजी है।",
    balanceDomain: "शयन सुख, खर्चों और निजी एकांत का संतुलन। यदि यहाँ लालच किया जाए या बातें छिपाई जाएं तो दूरियों का खतरा रहता है।",
    advice: "गुरुजी का व्याख्यान सूत्र: किसी गरीब बच्ची या बच्चे के विवाह में खुशी से आर्थिक मदद या कन्यादान करें। ऐसा करने से दांपत्य में असीम सुख और समृद्धि स्थिर हो जाती है।",
  },
};

export function evaluateKalpurush7thRashiAnchor(chart: ChartData): Kalpurush7thRashiAnchor {
  const lagnaNum = typeof chart.lagnaNum === "number" ? chart.lagnaNum : 0;
  const d1House = ((6 - lagnaNum + 12) % 12) + 1;

  const d9LagnaSignNum = getNavamshaSignNum(chart.lagnaLon);
  const d9House = ((6 - d9LagnaSignNum + 12) % 12) + 1;

  const d1Occupants: string[] = [];
  if (chart.planets) {
    Object.entries(chart.planets).forEach(([pName, pData]) => {
      if (pData && (pData.sign === "Libra" || pData.house === d1House)) {
        d1Occupants.push(pName);
      }
    });
  }

  const d9Occupants: string[] = [];
  if (chart.planets) {
    Object.entries(chart.planets).forEach(([pName, pData]) => {
      if (pData) {
        const pD9Sign = getNavamshaSignNum(pData.lon);
        if (pD9Sign === 6) {
          d9Occupants.push(pName);
        }
      }
    });
  }

  const meta = KALPURUSH_7TH_HOUSE_MAP[d1House] || KALPURUSH_7TH_HOUSE_MAP[7];

  const venusData = chart.planets?.Venus;
  const isVenusIn12 = venusData?.house === 12;
  const isLibraIn12 = d1House === 12;
  const venus12thRemedyApplicable = isVenusIn12 || isLibraIn12;

  let venus12thRemedyHinglish: string | undefined = undefined;
  if (venus12thRemedyApplicable) {
    venus12thRemedyHinglish =
      "व्याख्यान का विशेष विवाह सूत्र: आपकी कुंडली में शुक्र/तुला का संबंध १२वें भाव से जुड़ रहा है। नियम यह है कि किसी निर्धन या अनाथ कन्या/बालक के विवाह में यथाशक्ति वस्त्र, राशन या आर्थिक सहयोग करें। ऐसा करने से आपके अपने दांपत्य जीवन के अनावश्यक खर्च, शयन सुख की रुकावटें और अनपेक्षित हानियां पूरी तरह शांत हो जाती हैं।";
  }

  return {
    signNumber: 7,
    signName: "Libra",
    d1House,
    d9House,
    d1Occupants,
    d9Occupants,
    meetingChannelTitleHinglish: meta.title,
    meetingChannelNarrativeHinglish: meta.narrative,
    maritalBalanceDomainHinglish: meta.balanceDomain,
    karmicAnchorAdviceHinglish: meta.advice,
    venus12thRemedyApplicable,
    venus12thRemedyHinglish,
  };
}

// ── 7th House Occupant Planet's Nakshatra Lord Mapping ──────────────────────
// Based on KP Stellar Astrology & Oral Discourse Transcripts:
// The planet sitting in the 7th House is the physical vessel/gateway,
// but its Nakshatra Lord (Star Lord) dictates the actual experiential reality,
// partner's behavioral trajectory, and which house reaps the karmic fruits of marriage.
// Includes 6th (Blind faith / Plants), 8th (Fruit donation), 12th (Underprivileged wedding charity).

const SEVENTH_OCCUPANT_NL_HOUSE_MAP: Record<number, {
  title: string;
  narrative: string;
  karmicAdvice: string;
  remedy?: string;
}> = {
  1: {
    title: "प्रथम भाव (Lagna) — जीवनसाथी व्यक्तित्व का पूरक दर्पण",
    narrative: "सप्तम भाव में बैठे ग्रह का नक्षत्र स्वामी आपकी कुंडली के प्रथम भाव (लग्न) में बैठा है। इसका अर्थ यह है कि विवाह का पूरा फल आपके अपने व्यक्तित्व, शारीरिक स्वास्थ्य और आत्म-छवि पर आकर पड़ता है। शादी के बाद आपकी पूरी पहचान, दिनचर्या और विचार जीवनसाथी के प्रभाव में ढल जाते हैं। जीवनसाथी आपको अपनी प्राथमिक प्रेरणा मानता है और दोनों का अस्तित्व एक-दूसरे में समाहित हो जाता है।",
    karmicAdvice: "रिश्ते में अपने व्यक्तिगत स्वाभिमान को बनाए रखें, लेकिन साथी के सकारात्मक सुझावों को सहर्ष स्वीकार करें।",
  },
  2: {
    title: "द्वितीय भाव (Dhana / Kutumb) — धन, कुल वृद्धि व साझा संपत्ति",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी द्वितीय भाव (कुटुंब व धन) में विराजमान है। यह सीधा संकेत है कि विवाह होते ही आपके परिवार का बैंक बैलेंस, अचल संपत्ति और खानदानी प्रतिष्ठा में भारी उछाल आएगा। जीवनसाथी घर की लक्ष्मी/सारथी बनकर आर्थिक निर्णय में मुख्य भागीदार बनता है और वाणी में मधुरता होने पर कुटुंब सदैव एकजुट रहता है।",
    karmicAdvice: "पारिवारिक मामलों में ससुराल और मायके के बीच वित्तीय पारदर्शिता रखें। दोनों मिलकर संयुक्त बचत करें।",
  },
  3: {
    title: "तृतीय भाव (Sahaja) — पराक्रम, डिजिटल प्लेटफॉर्म व साझा उद्यम",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी तृतीय भाव (पराक्रम व संचार) में स्थित है। विवाह के पश्चात आपकी रोजमर्रा की मेहनत, छोटी यात्राएं, सोशल मीडिया, ऑनलाइन काम और नए उद्यमों की गति कई गुना बढ़ जाती है। जीवनसाथी बेहद व्यावहारिक और कर्मठ होता है, जो हर कठिनाई में आपके कंधे से कंधा मिलाकर मेहनत करता है।",
    karmicAdvice: "आपसी बातचीत (Communication) को कभी टूटने न दें। दिनभर की बातें शाम को साझा करने से रिश्ता मजबूत बना रहता है।",
  },
  4: {
    title: "चतुर्थ भाव (Sukha) — गृहस्थ शांति, नया मकान व पारिवारिक संबल",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी चतुर्थ भाव (सुख व गृहस्थ) में बैठा है। विवाह का मुख्य फल आपके घर के भीतर की शांति, नए मकान, वाहन और माता के सुख के रूप में प्रकट होता है। जीवनसाथी घर की चारदीवारी को मंदिर जैसा पवित्र और आरामदायक बनाने में अपनी पूरी आत्मा झोंक देता है।",
    karmicAdvice: "घर के वातावरण को सदा सौम्य रखें। कार्यक्षेत्र का तनाव घर के बेडरूम या ड्रॉइंग रूम में न लाएं।",
  },
  5: {
    title: "पंचम भाव (Purva Punya) — अनन्य प्रेम, बौद्धिक तालमेल व संतान सुख",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी पंचम भाव (संतान, प्रेम व पूर्व पुण्य) में बैठा है। यह दांपत्य में गहरा आत्मिक व रोमांटिक जुड़ाव (Laila-Majnu bond) पैदा करता है। चूंकि पंचम भाव सप्तम से ११वां (पार्टनर का लाभ) होता है, इसलिए शादी के बाद आपके पूर्व जन्म के पुण्य जागते हैं और आपकी उपस्थिति से साथी के जीवन की सबसे बड़ी आकांक्षाएं पूरी होती हैं।",
    karmicAdvice: "वैवाहिक जीवन के १० वर्ष बीतने के बाद भी वही आरंभिक आदर और रोमांस की ताजगी बनाए रखें। बच्चों के आने पर भी साथी को प्राथमिकता दें।",
  },
  6: {
    title: "छठा भाव (Ripu / Rina / Seva) — कार्यक्षेत्र जुड़ाव, अंधा विश्वास व सेवा",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी छठे भाव में है। ज्योतिष शास्त्र में छठा भाव सप्तम से १२वां (व्यय भाव) होता है। इसका अर्थ है कि साथी से परिचय या जुड़ाव ऑफिस, रोज़गार या किसी सेवा क्षेत्र के माध्यम से होता है। यहाँ सबसे बड़ा खतरा यह होता है कि दोनों में से कोई एक रोज़मर्रा की आदतों में मीन-मेख निकालने लगता है।\\n\\nव्याख्यान का विशेष सूत्र: '६ठे भाव में अंधा विश्वास (Blind Faith) ही दांपत्य को अमर बनाता है।' यदि आप साथी पर पूर्ण विश्वास रखेंगे और शक नहीं करेंगे, तो यह योग अद्भुत सफलता देगा।",
    karmicAdvice: "रोजमर्रा के घरेलू या वित्तीय मामलों में बाल की खाल न निकालें। साथी की छोटी गलतियों को अनदेखा करें।",
    remedy: "व्याख्यान का अचूक उपाय: घर या बगीचे में जीवित पेड़-पौधे (विशेषकर शमी, तुलसी या नीम) लगाएं और नित्य उनकी सेवा व सींचन करें। यह छठे भाव के कलह को शांत करता है।",
  },
  7: {
    title: "सप्तम भाव (Kalatra) — साक्षात अटूट समर्पण व पारम्परिक मर्यादा",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी स्वयं सप्तम भाव में ही स्थित है। यह दांपत्य की सबसे शुद्ध, पारंपरिक और मजबूत स्थिति है। विवाह समाज और कुल के सम्मान के साथ होता है। दोनों एक-दूसरे के प्रति पूरी तरह निष्ठावान रहते हैं और रिश्ते में किसी तीसरे व्यक्ति के लिए कोई जगह नहीं होती।",
    karmicAdvice: "रिश्ते में समानता (50-50 पार्टनरशिप) का भाव रखें। न कोई बड़ा, न कोई छोटा।",
  },
  8: {
    title: "अष्टम भाव (Randhra) — आकस्मिक परिवर्तन, ससुराल का प्रभाव व फल दान",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी अष्टम भाव में चला गया है। यह संकेत देता है कि विवाह जीवन में एक बड़ा अप्रत्याशित मोड़ लेकर आता है। ससुराल पक्ष के साथ गहरे गोपनीय या वित्तीय सम्बंध बनते हैं। कई बार रिश्ते में शुरूआती दौर में अप्रत्याशित रुकावटें या परिवार की ओर से गोपनीय तनाव झेलना पड़ता है।",
    karmicAdvice: "साथी से कभी कोई वित्तीय या भावनात्मक रहस्य न छिपाएं। पारदर्शिता ही इस सम्बंध की सबसे बड़ी रक्षा ढाल है।",
    remedy: "व्याख्यान का अचूक उपाय: अष्टम भाव के आकस्मिक झटकों को शांत करने के लिए मंगलवार या शनिवार को मौसमी ताजे मीठे फलों (जैसे सेब, केला, अनार) का जरूरतमंदों या मंदिर में दान करें।",
  },
  9: {
    title: "नवम भाव (Bhagya) — साक्षात भाग्योदय, तीर्थ यात्राएं व लक्ष्मी कृपा",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी नवम भाव (भाग्य व धर्म) में बैठा है। यह विवाह का साक्षात वरदान है—जैसे ही विवाह संपन्न होता है, आपके भाग्य के बंद दरवाजे स्वतः खुल जाते हैं। जीवनसाथी साक्षात लक्ष्मी/नारायण के रूप में कदम रखता है। दोनों मिलकर पवित्र तीर्थों की यात्रा करते हैं और समाज में धर्म-कर्म से यश पाते हैं।",
    karmicAdvice: "विवाह के बाद जीवनसाथी के साथ धार्मिक यात्राएं करें और माता-पिता व गुरुजनों का नियमित आशीर्वाद लें।",
  },
  10: {
    title: "दशम भाव (Karma) — पॉवर कपल, सामाजिक प्रतिष्ठा व करियर उत्थान",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी दशम भाव (कर्म व पद-प्रतिष्ठा) में स्थित है। विवाह सीधे आपके करियर और सामाजिक रुतबे को नई ऊँचाइयों पर ले जाता है। आप दोनों समाज में एक 'पॉवर कपल' के रूप में जाने जाते हैं। साथी का सहयोग या उसकी पृष्ठभूमि आपके व्यापार या नौकरी में प्रतिष्ठा का बड़ा साधन बनती है।",
    karmicAdvice: "करियर की सफलता का आनंद घर में लें, लेकिन कार्यक्षेत्र का अहंकार या पद का रौब कभी दांपत्य जीवन के भीतर न लाएं।",
  },
  11: {
    title: "एकादश भाव (Labha) — अनन्य मित्रता, इच्छा पूर्ति व विशाल नेटवर्क",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी एकादश भाव (लाभ व इच्छा पूर्ति) में स्थित है। जीवनसाथी सबसे पहले आपका 'सर्वोत्तम मित्र' (Best Friend) बनकर आता है। विवाह के बाद आपके जीवन की सबसे बड़ी दबी इच्छाएं पूरी होती हैं और बड़े सामाजिक व व्यावसायिक संपर्कों से लाभ मिलता है।",
    karmicAdvice: "साथी के साथ दोस्ती का भाव सदा जीवित रखें। जब तक आपस में दोस्ताना रहेगा, दांपत्य कभी कमजोर नहीं पड़ सकता।",
  },
  12: {
    title: "द्वादश भाव (Vyaya / Moksha) — दूरस्थ वास, शयन सुख व गरीब विवाह दान",
    narrative: "सप्तम भाव के ग्रह का नक्षत्र स्वामी द्वादश भाव (विदेश, त्याग व शयन सुख) में बैठा है। इसका शास्त्रीय फल यह है कि यदि विवाह जन्मस्थान से दूर, किसी अन्य प्रांत या विदेश में हो, तो यह अत्यधिक शुभ और सफल रहता है। यदि जन्मस्थान में ही रहें, तो कई बार बेडरूम में दूरियां या काम के सिलसिले में एक-दूसरे से अलग रहने की परिस्थितियां बनती हैं।\\n\\nव्याख्यान का विशेष सूत्र: '१२वें भाव पर कभी अंधा भरोसा मत करो; १२वां भाव दान मांगता है। यदि आप स्वेच्छा से दान नहीं करेंगे, तो वह अस्पताल या अनपेक्षित खर्चों से धन निकाल लेगा।' ",
    karmicAdvice: "निजी शयनकक्ष को सदा शांत, सुवासित और इलेक्ट्रॉनिक गैजेट्स से मुक्त रखें। साथी के साथ नियमित रूप से परोपकार के कार्य करें।",
    remedy: "व्याख्यान का अचूक उपाय: किसी गरीब, अनाथ या जरूरतमंद कन्या/बालक के विवाह में आर्थिक सहयोग, वस्त्र या राशन का दान करें। ऐसा करने से १२वें भाव का व्यय शांत होकर दांपत्य में असीम शयन सुख और प्रेम की स्थिरता आ जाती है।",
  },
};

export function evaluateSeventhHouseOccupantsNL(
  chart: ChartData,
  kpResult?: ReturnType<typeof runKPEngine>
): SeventhHouseOccupantNLAnalysis {
  const occupantsList = Object.entries(chart.planets || {})
    .filter(([_, p]) => p && (p.house === 7 || (kpResult?.rows.find(r => r.name === _ && r.bhavaHouse === 7))))
    .map(([pName, pData]) => ({ name: pName, data: pData }));

  const hasOccupants = occupantsList.length > 0;
  const items: SeventhHouseOccupantNLItem[] = [];

  if (hasOccupants) {
    for (const occ of occupantsList) {
      const pName = occ.name;
      const pData = occ.data;
      const nakshatra = pData.nakshatra || "Ashwini";
      const nakshatraLord = pData.nakshatraLord || "Ketu";

      const nlKpRow = kpResult?.rows.find(r => r.name === nakshatraLord);
      const nlPlanetData = chart.planets[nakshatraLord];
      const nlHouse = nlKpRow?.bhavaHouse || nlPlanetData?.house || 7;
      const nlSign = nlPlanetData?.sign || "Aries";

      const meta = SEVENTH_OCCUPANT_NL_HOUSE_MAP[nlHouse] || SEVENTH_OCCUPANT_NL_HOUSE_MAP[7];

      items.push({
        planet: pName,
        isOccupant: true,
        planetSign: pData.sign || "Libra",
        nakshatra,
        nakshatraLord,
        nakshatraLordHouse: nlHouse,
        nakshatraLordSign: nlSign,
        titleHinglish: `${pName} (${nakshatra} - स्वामी: ${nakshatraLord}) ➔ भाव ${nlHouse}`,
        narrativeHinglish: meta.narrative,
        karmicAdviceHinglish: meta.karmicAdvice,
        remedyHinglish: meta.remedy,
      });
    }
  } else {
    // Fallback to 7th House Lord (सप्तमेश)
    const h7CuspSign = chart.houseCusps.find(h => h.house === 7)?.sign || RASHIS[((chart.lagnaNum || 0) + 6) % 12];
    const lord7Name = SIGN_LORDS[h7CuspSign] || "Venus";
    const lord7Data = chart.planets[lord7Name];

    const nakshatra = lord7Data?.nakshatra || "Bharani";
    const nakshatraLord = lord7Data?.nakshatraLord || "Venus";

    const nlKpRow = kpResult?.rows.find(r => r.name === nakshatraLord);
    const nlPlanetData = chart.planets[nakshatraLord];
    const nlHouse = nlKpRow?.bhavaHouse || nlPlanetData?.house || 7;
    const nlSign = nlPlanetData?.sign || "Taurus";

    const meta = SEVENTH_OCCUPANT_NL_HOUSE_MAP[nlHouse] || SEVENTH_OCCUPANT_NL_HOUSE_MAP[7];

    items.push({
      planet: lord7Name,
      isOccupant: false,
      planetSign: lord7Data?.sign || h7CuspSign,
      nakshatra,
      nakshatraLord,
      nakshatraLordHouse: nlHouse,
      nakshatraLordSign: nlSign,
      titleHinglish: `सप्तम भाव रिक्त (सप्तमेश ${lord7Name} — ${nakshatra} स्वामी: ${nakshatraLord}) ➔ भाव ${nlHouse}`,
      narrativeHinglish: `आपकी कुंडली में सप्तम भाव में कोई प्रत्यक्ष ग्रह नहीं बैठा है, अतः वैदिक व के.पी. नियम के अनुसार सप्तमेश (${lord7Name}) के नक्षत्र स्वामी (${nakshatraLord}) की स्थिति देखी जाती है।\\n\\n${meta.narrative}`,
      karmicAdviceHinglish: meta.karmicAdvice,
      remedyHinglish: meta.remedy,
    });
  }

  const primary = items[0];
  const synthesisHinglish = hasOccupants
    ? `सप्तम भाव में स्थित ${items.map(i => i.planet).join(", ")} का नक्षत्र स्वामी (${primary.nakshatraLord}) भाव ${primary.nakshatraLordHouse} में होने से दांपत्य का फल ${primary.titleHinglish} के अनुसार फलीभूत होगा।`
    : `सप्तम भाव रिक्त होने के कारण सप्तमेश ${primary.planet} के नक्षत्र स्वामी (${primary.nakshatraLord}) की भाव ${primary.nakshatraLordHouse} में स्थिति वैवाहिक जीवन की दिशा तय करेगी।`;

  return {
    occupants: items,
    hasOccupants,
    synthesisHinglish,
  };
}

// ── Navamsha (D9) Evaluation Helpers ─────────────────────────────────────────

const D9_STARTS = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3];
const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getNavamshaSignNum(lon: number): number {
  const norm = ((lon % 360) + 360) % 360;
  const signIdx = Math.floor(norm / 30);
  const degInSign = norm % 30;
  const navPart = Math.floor(degInSign / (30 / 9));
  return (D9_STARTS[signIdx] + navPart) % 12;
}

// ── Research Helpers: Veluchamy (2022) & K.N. Rao Synthesis ─────────────────

/**
 * Detects Punarbu / Punarphoo Yoga (Moon-Saturn Connection)
 * Researched by Dr. S. Veluchamy & N. Karuna Moorthy (2022, VISTAS).
 * Causes delays, sudden renegotiations, hesitation, and pre-marital anxiety.
 */
export function detectPunarbuYoga(chart: ChartData, kpResult?: ReturnType<typeof runKPEngine>): PunarbuYogaResult {
  const moon = chart.planets["Moon"];
  const saturn = chart.planets["Saturn"];
  const jupiter = chart.planets["Jupiter"];
  const venus = chart.planets["Venus"];

  const conditions: string[] = [];
  const cancellationFactors: string[] = [];

  if (!moon || !saturn) {
    return {
      detected: false,
      conditions: [],
      severity: "none",
      effects: "Lunar and Saturnian coordinates insufficient for Punarbu analysis.",
      cancellationFactors: [],
      isCancelled: false,
      remedy: "",
    };
  }

  // 1. Moon in Saturn's Star
  const SATURN_STARS = ["Pushya", "Anuradha", "Uttara Bhadrapada", "Uttarabhadra"];
  if (SATURN_STARS.includes(moon.nakshatra) || moon.nakshatraLord === "Saturn") {
    conditions.push(`Moon in Saturn's Star (${moon.nakshatra})`);
  }

  // 2. Saturn in Moon's Star
  const MOON_STARS = ["Rohini", "Hasta", "Shravana"];
  if (MOON_STARS.includes(saturn.nakshatra) || saturn.nakshatraLord === "Moon") {
    conditions.push(`Saturn in Moon's Star (${saturn.nakshatra})`);
  }

  // 3. Moon & Saturn Conjunction
  if (moon.house === saturn.house && moon.house > 0) {
    conditions.push(`Moon and Saturn conjunct in House ${moon.house} (${moon.sign})`);
  }

  // 4. Mutual Aspects
  const diffH = ((saturn.house - moon.house + 12) % 12);
  if (diffH === 6) {
    conditions.push(`Moon and Saturn in 1-7 mutual opposition/aspect (Houses ${moon.house} & ${saturn.house})`);
  }
  const satToMoon = ((moon.house - saturn.house + 12) % 12);
  if ([2, 6, 9].includes(satToMoon)) {
    const aspName = satToMoon === 2 ? "3rd" : satToMoon === 6 ? "7th" : "10th";
    conditions.push(`Saturn casts special ${aspName} aspect on Moon`);
  }

  // 5. Moon in Saturn's sign, or Saturn in Cancer
  if (["Capricorn", "Aquarius"].includes(moon.sign)) {
    conditions.push(`Moon placed in Saturn's sign (${moon.sign})`);
  }
  if (saturn.sign === "Cancer") {
    conditions.push(`Saturn placed in Moon's sign (Cancer)`);
  }

  // 6. KP Sub-Lord connection
  if (kpResult && kpResult.rows) {
    const moonKP = kpResult.rows.find(r => r.name === "Moon");
    const satKP = kpResult.rows.find(r => r.name === "Saturn");
    if (moonKP?.subLord === "Saturn") conditions.push("Moon's KP Planet Sub-Lord is Saturn");
    if (satKP?.subLord === "Moon") conditions.push("Saturn's KP Planet Sub-Lord is Moon");
  }

  // Cancellations
  if (jupiter) {
    const jupToMoon = ((moon.house - jupiter.house + 12) % 12);
    if (jupiter.house === moon.house) cancellationFactors.push("Benefic Jupiter conjunct Moon");
    if ([4, 6, 8].includes(jupToMoon)) cancellationFactors.push("Benefic Jupiter aspects Moon via 5th/7th/9th drishti");
    const jupToSat = ((saturn.house - jupiter.house + 12) % 12);
    if (jupiter.house === saturn.house) cancellationFactors.push("Benefic Jupiter conjunct Saturn");
    if ([4, 6, 8].includes(jupToSat)) cancellationFactors.push("Benefic Jupiter aspects Saturn via 5th/7th/9th drishti");
  }
  if (venus && venus.house === moon.house) {
    cancellationFactors.push("Benefic Venus conjunct Moon");
  }

  const detected = conditions.length > 0;
  const isCancelled = cancellationFactors.length > 0;
  const severity: PunarbuYogaResult["severity"] =
    !detected ? "none" :
    conditions.length >= 3 ? "strong" :
    conditions.length === 2 ? "moderate" : "mild";

  const effects = detected
    ? (isCancelled
        ? "Punarbu / Punarphoo Yoga is present but significantly neutralized by Jupiterian/Venusian benefic aspects. Pre-marital delays or initial hesitation will dissolve smoothly prior to solemnization."
        : "Active Punarbu / Punarphoo Yoga: Indicates psychological hesitation, fear of broken engagements, renegotiations, or wedding date adjustments. Requires emotional patience.")
    : "No Punarbu Yoga detected; lunar-saturnian channels remain free of delay afflictions.";

  const remedy = detected
    ? "Perform raw milk & water Jalabhisheka on Shivalinga on Mondays and Saturdays. Drink water from a solid silver tumbler to strengthen lunar confidence and eliminate wedding anxiety."
    : "";

  return {
    detected,
    conditions,
    severity,
    effects,
    cancellationFactors,
    isCancelled,
    remedy,
  };
}

/**
 * Evaluates Separative Influences (Sun, Saturn, Rahu, Ketu, 12th Lord)
 * Across houses 1 (Self), 4 (Domestic bliss), 7 (Marriage), 10 (Honor), 12 (Bedroom).
 */
export function evaluateSeparativeInfluences(chart: ChartData): SeparativeInfluenceAudit {
  const HOUSE_NAMES: Record<number, string> = {
    1: "Lagna (Self & Vitality)",
    4: "4th House (Domestic Happiness & Peace)",
    7: "7th House (Kalatra / Marriage Axis)",
    10: "10th House (Status & Karma)",
    12: "12th House (Bedroom & Separation)",
  };

  const h12Sign = chart.houseCusps.find(h => h.house === 12)?.sign ?? "Pisces";
  const lord12 = SIGN_LORDS[h12Sign] ?? "Jupiter";

  const separativePlanetsList = Array.from(new Set(["Sun", "Saturn", "Rahu", "Ketu", lord12]));
  const targetHouses = [1, 4, 7, 10, 12];
  const afflictedHouses: SeparativeInfluenceAudit["afflictedHouses"] = [];

  let totalSeparativeScore = 0;

  for (const h of targetHouses) {
    const activeSeps: string[] = [];
    for (const pName of separativePlanetsList) {
      const p = chart.planets[pName];
      if (!p) continue;

      if (p.house === h) {
        activeSeps.push(`${pName} (occupying H${h})`);
        continue;
      }

      if (pName === "Sun" && ((h - p.house + 12) % 12) === 6) {
        activeSeps.push(`Sun (7th aspect from H${p.house})`);
      } else if (pName === "Saturn" && [2, 6, 9].includes((h - p.house + 12) % 12)) {
        const asp = ((h - p.house + 12) % 12) === 2 ? "3rd" : ((h - p.house + 12) % 12) === 6 ? "7th" : "10th";
        activeSeps.push(`Saturn (${asp} aspect from H${p.house})`);
      } else if (pName === lord12 && pName !== "Saturn" && pName !== "Sun") {
        if (((h - p.house + 12) % 12) === 6) {
          activeSeps.push(`12th Lord ${lord12} (7th aspect from H${p.house})`);
        }
      }
    }

    const count = activeSeps.length;
    const severity: "clean" | "mild" | "moderate" | "severe" =
      count === 0 ? "clean" :
      count === 1 ? "mild" :
      count === 2 ? "moderate" : "severe";

    if (count > 0) totalSeparativeScore += count;

    afflictedHouses.push({
      house: h,
      houseName: HOUSE_NAMES[h],
      separativePlanets: activeSeps,
      severity,
    });
  }

  // 7th Lord Affliction
  const h7Sign = chart.houseCusps.find(h => h.house === 7)?.sign ?? "Libra";
  const lord7 = SIGN_LORDS[h7Sign] ?? "Venus";
  const lord7Planet = chart.planets[lord7];
  const seventhLordSeparators: string[] = [];

  if (lord7Planet) {
    for (const pName of ["Sun", "Saturn", "Rahu", "Ketu", lord12]) {
      if (pName === lord7) continue;
      const p = chart.planets[pName];
      if (!p) continue;
      if (p.house === lord7Planet.house) {
        seventhLordSeparators.push(`${pName} (conjunction in H${p.house})`);
      } else if (pName === "Saturn" && [2, 6, 9].includes((lord7Planet.house - p.house + 12) % 12)) {
        seventhLordSeparators.push(`Saturn (aspects 7th lord ${lord7})`);
      } else if (pName === "Sun" && ((lord7Planet.house - p.house + 12) % 12) === 6) {
        seventhLordSeparators.push(`Sun (7th aspect onto 7th lord ${lord7})`);
      }
    }
  }

  const seventhLordAfflicted = seventhLordSeparators.length > 0;
  if (seventhLordAfflicted) totalSeparativeScore += seventhLordSeparators.length;

  const interpretation =
    totalSeparativeScore >= 4
      ? "Strong separative cluster detected across domestic/marital pillars. Pre-marital Astrological matching, clear mutual expectations, and regular grounding remedies are vital."
      : totalSeparativeScore >= 2
      ? "Moderate separative influences present. Minor temporary distance due to career or relocations likely, but core bond remains resilient."
      : "Separative influences are minimal. Domestic peace and marital stability are strongly protected.";

  return {
    afflictedHouses,
    seventhLordAfflicted,
    seventhLordSeparators,
    totalSeparativeScore,
    interpretation,
  };
}

/**
 * Evaluates Barren Signs (Gemini, Leo, Virgo) on Lagna, 7th Cusp, or Venus.
 */
export function evaluateBarrenSigns(chart: ChartData): BarrenSignsAudit {
  const BARREN_SIGNS = ["Gemini", "Leo", "Virgo"];
  const lagnaSign = chart.lagnaRashi;
  const h7Sign = chart.houseCusps.find(h => h.house === 7)?.sign ?? "";
  const venusSign = chart.planets.Venus?.sign ?? "";

  const lagnaInBarrenSign = BARREN_SIGNS.includes(lagnaSign);
  const seventhCuspInBarrenSign = BARREN_SIGNS.includes(h7Sign);
  const venusInBarrenSign = BARREN_SIGNS.includes(venusSign);

  const barrenPlacements: string[] = [];
  if (lagnaInBarrenSign) barrenPlacements.push(`Lagna in ${lagnaSign}`);
  if (seventhCuspInBarrenSign) barrenPlacements.push(`7th Cusp in ${h7Sign}`);
  if (venusInBarrenSign) barrenPlacements.push(`Venus in ${venusSign}`);

  const interpretation = barrenPlacements.length > 0
    ? `Barren sign signatures identified in ${barrenPlacements.join(", ")}. Can lead to initial emotional reserve, analytical hesitation, or delays in child conception unless balanced by fertile Jupiterian/lunar aspects.`
    : "No barren signs on core marital axes; natural emotional warmth and fertility flow unhindered.";

  return {
    lagnaInBarrenSign,
    seventhCuspInBarrenSign,
    venusInBarrenSign,
    barrenPlacements,
    interpretation,
  };
}

/**
 * Calculates Marriage Direction of Spouse
 * Male: 7th from natal Venus. Female: 7th from natal Mars.
 */
export function calculateMarriageDirection(
  chart: ChartData,
  gender: "male" | "female" = "male"
): MarriageDirectionResult {
  const DIRECTION_MAP: Record<string, { en: string; hi: string }> = {
    Aries:       { en: "East", hi: "पूर्व (East)" },
    Leo:         { en: "East", hi: "पूर्व (East)" },
    Sagittarius: { en: "East", hi: "पूर्व (East)" },
    Taurus:      { en: "South", hi: "दक्षिण (South)" },
    Virgo:       { en: "South", hi: "दक्षिण (South)" },
    Capricorn:   { en: "South", hi: "दक्षिण (South)" },
    Gemini:      { en: "West", hi: "पश्चिम (West)" },
    Libra:       { en: "West", hi: "पश्चिम (West)" },
    Aquarius:    { en: "West", hi: "पश्चिम (West)" },
    Cancer:      { en: "North", hi: "उत्तर (North)" },
    Scorpio:     { en: "North", hi: "उत्तर (North)" },
    Pisces:      { en: "North", hi: "उत्तर (North)" },
  };

  const karakaSign = gender === "male"
    ? (chart.planets.Venus?.sign ?? "Leo")
    : (chart.planets.Mars?.sign ?? "Aries");

  const karakaIdx = SIGNS.indexOf(karakaSign);
  const seventhFromKarakaSign = SIGNS[(karakaIdx + 6) % 12] ?? "Aries";

  const h7Sign = chart.houseCusps.find(h => h.house === 7)?.sign ?? "Libra";
  const lord7 = SIGN_LORDS[h7Sign] ?? "Venus";
  const lord7Sign = chart.planets[lord7]?.sign ?? h7Sign;

  const primDir = DIRECTION_MAP[seventhFromKarakaSign] ?? { en: "East", hi: "पूर्व" };
  const secDir  = DIRECTION_MAP[lord7Sign] ?? DIRECTION_MAP[h7Sign] ?? { en: "North", hi: "उत्तर" };

  return {
    primaryDirection: primDir.en,
    primaryDirectionHindi: primDir.hi,
    secondaryDirection: secDir.en,
    rationale: gender === "male"
      ? `7th from natal Venus (${karakaSign}) falls in ${seventhFromKarakaSign} (${primDir.en}). Secondary directional vector from 7th Lord (${lord7} in ${lord7Sign}) points ${secDir.en}.`
      : `7th from natal Mars (${karakaSign}) falls in ${seventhFromKarakaSign} (${primDir.en}). Secondary directional vector from 7th Lord (${lord7} in ${lord7Sign}) points ${secDir.en}.`,
  };
}

/**
 * Cross-maps D1 Trik houses (6, 8, 12) and Wealth houses (2, 11) into D9 Navamsha houses.
 */
export function mapD1toD9CrossImpact(chart: ChartData): D1toD9CrossMapping {
  const d1LagnaSign = chart.lagnaRashi;
  const d1Idx = SIGNS.indexOf(d1LagnaSign);

  const d9Num = Math.floor((chart.lagnaLon % 360) / (360 / 108)) % 12;
  const d9LagnaSign = SIGNS[d9Num] ?? "Aries";
  const d9Idx = SIGNS.indexOf(d9LagnaSign);

  function getD9HouseOfRashi(rashi: string): number {
    const rIdx = SIGNS.indexOf(rashi);
    if (rIdx < 0 || d9Idx < 0) return 1;
    return ((rIdx - d9Idx + 12) % 12) + 1;
  }

  // D1 Trik Houses: 6, 8, 12
  const d1H6Rashi = SIGNS[(d1Idx + 5) % 12];
  const d1H8Rashi = SIGNS[(d1Idx + 7) % 12];
  const d1H12Rashi = SIGNS[(d1Idx + 11) % 12];

  // D1 Wealth Houses: 2, 11
  const d1H2Rashi = SIGNS[(d1Idx + 1) % 12];
  const d1H11Rashi = SIGNS[(d1Idx + 10) % 12];

  const d9H_6 = getD9HouseOfRashi(d1H6Rashi);
  const d9H_8 = getD9HouseOfRashi(d1H8Rashi);
  const d9H_12 = getD9HouseOfRashi(d1H12Rashi);

  const d9H_2 = getD9HouseOfRashi(d1H2Rashi);
  const d9H_11 = getD9HouseOfRashi(d1H11Rashi);

  const DOMAINS: Record<number, string> = {
    1: "Identity & Physical Vitality",
    2: "Wealth Accumulation & Family Speech",
    3: "Effort, Sibling Dynamics & Courage",
    4: "Domestic Bliss, Vehicle & Home Sanctity",
    5: "Romance, Intelligence & Children",
    6: "Daily Routine, Debts & Micro-Critique",
    7: "Spousal Harmony & Business Partnership",
    8: "Sudden Transformations & In-law Relations",
    9: "Spiritual Fortune & Long Journeys",
    10: "Career Reputation & Social Authority",
    11: "Desire Fulfillment, Social Circles & Gains",
    12: "Bedroom Pleasure, Foreign Travel & Expenses",
  };

  const trikInD9 = [
    {
      d1House: 6,
      d1Rashi: d1H6Rashi,
      d9House: d9H_6,
      frictionDomain: `D1 6th House (${d1H6Rashi}) sits in D9 H${d9H_6}: Potential friction or micro-disputes around ${DOMAINS[d9H_6]}.`,
    },
    {
      d1House: 8,
      d1Rashi: d1H8Rashi,
      d9House: d9H_8,
      frictionDomain: `D1 8th House (${d1H8Rashi}) sits in D9 H${d9H_8}: Karmic deep transformation and hidden sensitivity in ${DOMAINS[d9H_8]}.`,
    },
    {
      d1House: 12,
      d1Rashi: d1H12Rashi,
      d9House: d9H_12,
      frictionDomain: `D1 12th House (${d1H12Rashi}) sits in D9 H${d9H_12}: Financial expenditure or detachment risks centered in ${DOMAINS[d9H_12]}.`,
    },
  ];

  const wealthInD9 = [
    {
      d1House: 2,
      d1Rashi: d1H2Rashi,
      d9House: d9H_2,
      growthDomain: `D1 2nd House (${d1H2Rashi}) falls in D9 H${d9H_2}: Marriage directly enriches ${DOMAINS[d9H_2]}.`,
    },
    {
      d1House: 11,
      d1Rashi: d1H11Rashi,
      d9House: d9H_11,
      growthDomain: `D1 11th House (${d1H11Rashi}) falls in D9 H${d9H_11}: Key source of marital desire fulfillment and expansion through ${DOMAINS[d9H_11]}.`,
    },
  ];

  const synthesis = `D1 Trik rashis manifest in D9 houses ${d9H_6}, ${d9H_8}, ${d9H_12}. Meanwhile, D1 Dhana/Labha rashis empower D9 houses ${d9H_2} & ${d9H_11}, creating post-marital financial and social elevation.`;

  return {
    trikInD9,
    wealthInD9,
    synthesis,
  };
}

// ── Master Evaluator Function ────────────────────────────────────────────────

export function evaluateMarriageIntelligence(chart: ChartData): MarriageIntelligenceReport {
  // 1. Run KP Engine to obtain KP Cusps and Planets with Placidus geometry
  const kpResult = runKPEngine(chart);
  const cusp7 = kpResult.cusps.find((c) => c.house === 7) || kpResult.cusps[6];

  // Identify 7th Cusp Sub-Lord
  const cusp7SubLord = cusp7?.subLord || "Venus";
  const subLordRow = kpResult.rows.find((r) => r.name === cusp7SubLord);

  // Identify Nakshatra Lord of 7th Sub-Lord
  const starLordOfSubLord = subLordRow?.starLord || "Ketu";
  const starLordRow = kpResult.rows.find((r) => r.name === starLordOfSubLord);
  const starLordHouse = starLordRow?.bhavaHouse || starLordRow?.house || 7;

  // Evaluate Meeting Context (Section 6 of Lecture)
  const meetingMeta = MEETING_CONTEXT_MAP[starLordHouse] || MEETING_CONTEXT_MAP[7];
  const meetingContext: MeetingContextResult = {
    house: starLordHouse,
    circumstance: meetingMeta.circumstance,
    partnerNature: meetingMeta.partnerNature,
    caution: meetingMeta.caution,
    sourceStarLord: starLordOfSubLord,
    starLordHouse,
  };

  // Evaluate 7th Rashi Impact (Section 7 of Lecture)
  const d1LagnaNum = chart.lagnaNum ?? 0;
  const d1SeventhRashiNum = ((d1LagnaNum + 6) % 12) + 1; // 1-indexed Rashi
  const rashiImpactMeta = RASHI_7TH_IMPACT_MAP[d1SeventhRashiNum] || RASHI_7TH_IMPACT_MAP[1];
  const rashiImpact: Rashi7thImpactResult = {
    signNumber: d1SeventhRashiNum,
    signName: RASHIS[d1SeventhRashiNum - 1],
    lifeDomainActivated: rashiImpactMeta.domain,
    behavioralDynamics: rashiImpactMeta.dynamics,
    warningOrRemedy: rashiImpactMeta.caution,
  };

  // Evaluate D9 Navamsha 4 Pillars (1, 4, 7, 12)
  const d9LagnaSignNum = getNavamshaSignNum(chart.lagnaLon);
  const d9LagnaSign = RASHIS[d9LagnaSignNum];

  // Map each planet into its D9 house relative to D9 Lagna
  const d9HousePlanets: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  Object.entries(chart.planets).forEach(([pName, pData]) => {
    const pD9SignNum = getNavamshaSignNum(pData.lon);
    const d9House = ((pD9SignNum - d9LagnaSignNum + 12) % 12) + 1;
    if (d9HousePlanets[d9House]) {
      d9HousePlanets[d9House].push(pName);
    }
  });

  function auditD9Pillar(houseNum: number, label: string): D9HouseAffliction {
    const signNum = (d9LagnaSignNum + houseNum - 1) % 12;
    const signName = RASHIS[signNum];
    const occupants = d9HousePlanets[houseNum] || [];

    const hasSun = occupants.includes("Sun");
    const hasMars = occupants.includes("Mars");
    const hasKetu = occupants.includes("Ketu");
    const hasRahu = occupants.includes("Rahu");
    const hasSaturn = occupants.includes("Saturn");
    const hasMoon = occupants.includes("Moon");
    const hasVenus = occupants.includes("Venus");
    const hasJupiter = occupants.includes("Jupiter");

    let severity: "clean" | "mild" | "moderate" | "severe" = "clean";
    const notes: string[] = [];

    if (houseNum === 12) {
      if ((hasSun && hasMars) || (hasMars && hasKetu) || (hasSun && hasKetu)) {
        severity = "severe";
        notes.push("Strong physical/emotional bedroom distance or distinct sleeping spaces (Sun/Mars/Ketu in D9 H12).");
      } else if (hasSun || hasMars || hasKetu) {
        severity = "moderate";
        notes.push("Ego clash or fiery tension causing periodic bedroom detachment (Sun/Mars/Ketu in D9 H12).");
      } else if (hasSaturn) {
        severity = "mild";
        notes.push("Reserved or delayed intimacy; disciplined bedroom habits.");
      } else {
        notes.push("Harmonious, undisturbed private quarters.");
      }
    } else if (houseNum === 4) {
      if (hasMars && hasRahu) {
        severity = "severe";
        notes.push("Volatile, explosive temperaments ('atom-bomb' clashes) disturbing domestic serenity.");
      } else if (hasMars) {
        severity = "moderate";
        notes.push("Commanding, domineering atmosphere within the home.");
      } else if (hasRahu) {
        severity = "mild";
        notes.push("Illusions, high expectations, or restless domestic environment.");
      } else {
        notes.push("Stable, peaceful domestic sanctuary.");
      }
    } else if (houseNum === 7) {
      if (hasMars && hasRahu) {
        severity = "severe";
        notes.push("Sudden friction and intense partnership power struggles.");
      } else if (hasSaturn && hasKetu) {
        severity = "moderate";
        notes.push("Renunciation tendencies or emotional detachment from partner.");
      } else if (hasSaturn) {
        severity = "mild";
        notes.push("Partner is mature, dutiful, and establishes rock-solid fortress-like boundaries.");
      } else {
        notes.push("Balanced partner disposition.");
      }
    } else {
      // House 1 (Lagna in D9)
      if (hasSun || hasMars) {
        severity = "moderate";
        notes.push("Native becomes more assertive, authoritative, or ego-conscious post-marriage.");
      } else if (hasMoon || hasVenus || hasJupiter) {
        severity = "clean";
        notes.push("Pleasant, adaptable, and graceful marital demeanor.");
      } else {
        notes.push("Balanced self-expression.");
      }
    }

    return {
      house: houseNum,
      sign: signName,
      planets: occupants,
      severity,
      interpretation: notes.join(" "),
    };
  }

  const h1Audit = auditD9Pillar(1, "Native Mindset");
  const h4Audit = auditD9Pillar(4, "Marital Peace");
  const h7Audit = auditD9Pillar(7, "Spouse Nature");
  const h12Audit = auditD9Pillar(12, "Bedroom Bliss");

  let bedroomStatus: D9MarriageAuditResult["bedroomBlissStatus"] = "harmonious";
  if (h12Audit.severity === "severe") bedroomStatus = "separate_bedrooms_risk";
  else if (h12Audit.severity === "moderate") bedroomStatus = "strained";
  else if (h12Audit.severity === "clean" && (h12Audit.planets.includes("Venus") || h12Audit.planets.includes("Jupiter"))) {
    bedroomStatus = "excellent";
  }

  const explosiveTemperament =
    (h4Audit.planets.includes("Mars") && h4Audit.planets.includes("Rahu")) ||
    (h7Audit.planets.includes("Mars") && h7Audit.planets.includes("Rahu"));

  const d9Audit: D9MarriageAuditResult = {
    d9LagnaSign,
    pillars: {
      h1NativeMindset: h1Audit,
      h4MaritalPeace: h4Audit,
      h7SpouseNature: h7Audit,
      h12BedroomBliss: h12Audit,
    },
    bedroomBlissStatus: bedroomStatus,
    explosiveTemperamentRisk: explosiveTemperament,
    overallD9Verdict:
      bedroomStatus === "separate_bedrooms_risk"
        ? "Caution: Malefic afflictions in D9 12th house require active mutual adjustments to maintain bedroom intimacy."
        : explosiveTemperament
        ? "Caution: Mars-Rahu in domestic angle warrants anger management and grounding remedies."
        : "Favorable D9 Navamsha structural alignment for marital longevity.",
  };

  // Evaluate Dual / Second Marriage (Section 10 of Lecture)
  const subLordPlanetData = chart.planets[cusp7SubLord];
  const subLordSignNum = subLordPlanetData?.signNum ?? 0;
  const subLordInDual = DUAL_SIGNS.includes(subLordSignNum + 1);

  const starLordPlanetData = chart.planets[starLordOfSubLord];
  const starLordSignNum = starLordPlanetData?.signNum ?? 0;
  const starLordInDual = DUAL_SIGNS.includes(starLordSignNum + 1);
  const mercuryInvolved =
    (cusp7SubLord as string) === "Mercury" ||
    (starLordOfSubLord as string) === "Mercury" ||
    ((subLordRow as unknown as { subLordHouse?: number })?.subLordHouse === 9 && (cusp7SubLord as string) === "Mercury");

  const hasDualPromise = subLordInDual && (starLordInDual || mercuryInvolved);
  const dualMarriage: DualMarriageResult = {
    hasDualSignPromise: hasDualPromise,
    subLordInDualSign: subLordInDual,
    starLordInDualSignOrMercury: starLordInDual || mercuryInvolved,
    seventhSubLord: cusp7SubLord,
    subLordSign: subLordPlanetData?.sign || "Unknown",
    starLord: starLordOfSubLord,
    mercuryInvolvement: mercuryInvolved,
    notes: hasDualPromise
      ? "7th Cusp Sub-Lord is located in a Dual Sign (3/6/9/12) with dual Star Lord or Mercury connection, opening the gateway for secondary marriage evaluation via the 9th house."
      : "Single enduring marriage structure promised at the 7th cuspal sub-lord tier.",
  };

  // Evaluate Sanyas / Denial (Saturn + Ketu in 1st/7th, Ketu in 1st/12th)
  const planetsIn1st = Object.entries(chart.planets).filter(([_, p]) => p.house === 1).map(([n]) => n);
  const planetsIn7th = Object.entries(chart.planets).filter(([_, p]) => p.house === 7).map(([n]) => n);
  const planetsIn12th = Object.entries(chart.planets).filter(([_, p]) => p.house === 12).map(([n]) => n);

  const satKetu7th = planetsIn7th.includes("Saturn") && planetsIn7th.includes("Ketu");
  const satKetu1st = planetsIn1st.includes("Saturn") && planetsIn1st.includes("Ketu");
  const ketu1or12 = planetsIn1st.includes("Ketu") || planetsIn12th.includes("Ketu");

  const activeMD = chart.dashas?.find((d) => d.active)?.planet;
  const activeSanyasDasha = activeMD === "Saturn" || activeMD === "Ketu";

  const denialIndicated = (satKetu7th || satKetu1st) && activeSanyasDasha;
  const sanyasDenial: SanyasDenialResult = {
    denialIndicated,
    saturnKetu7thOr1st: satKetu7th || satKetu1st,
    ketu1stOr12th: ketu1or12,
    activeSanyasDasha,
    interpretation: satKetu7th
      ? "Saturn + Ketu in the 7th house: Partner chosen will be detached from superficial appearances and deeply spiritual/genuine. Guard against emotional disengagement."
      : satKetu1st
      ? "Saturn + Ketu in the 1st house: Native possesses philosophical ascetic inclinations (*Vairagya*), requiring conscious desire cultivation for matrimony."
      : "No renunciation or strict marital denial signatures detected.",
  };

  // Evaluate Sexual Dissatisfaction / Orientation (Saturn + Mercury + Venus in 5/7/12)
  const satH = chart.planets["Saturn"]?.house;
  const merH = chart.planets["Mercury"]?.house;
  const venH = chart.planets["Venus"]?.house;

  const satVenMerConj = satH && merH && venH && satH === merH && merH === venH;
  const inSensitiveHouse = satH === 5 || satH === 7 || satH === 12;

  // Check trinal relationship between Saturn, Mercury, Venus
  const trineRel =
    satH && merH && venH &&
    ((satH - merH + 12) % 4 === 0) &&
    ((merH - venH + 12) % 4 === 0);

  const intimacyAfflicted = Boolean((satVenMerConj || trineRel) && inSensitiveHouse);
  const intimacyAudit: IntimacyOrientationResult = {
    afflictionDetected: intimacyAfflicted,
    involvedPlanets: ["Saturn", "Mercury", "Venus"],
    involvedHouses: [satH || 0, merH || 0, venH || 0].filter(Boolean),
    vastuZone: "NNW (North-North-West: Zone of Attraction & Intimacy)",
    interpretation: intimacyAfflicted
      ? "Saturn + Mercury + Venus combined influence across houses 5/7/12 indicates physical dissatisfaction, atypical attraction dynamics, or libido fluctuations. Clear the NNW Astro-Vastu zone of electronic clutter."
      : "Standard intimacy and attraction vectors active.",
  };

  // Evaluate Punarbu / Punarphoo Yoga (Dr. Veluchamy & Karuna Moorthy 2022)
  const punarbuYoga = detectPunarbuYoga(chart, kpResult);

  // Evaluate Separative Influences (Sun, Saturn, Rahu, Ketu, 12L)
  const separativeAudit = evaluateSeparativeInfluences(chart);

  // Evaluate Barren Signs (Gemini, Leo, Virgo on Lagna/7th/Venus)
  const barrenAudit = evaluateBarrenSigns(chart);

  // Calculate Spouse Direction
  const marriageDirection = calculateMarriageDirection(chart, "male");

  // D1 to D9 Cross-Mapping (Trik & Wealth rashis in D9 houses)
  const d1ToD9Mapping = mapD1toD9CrossImpact(chart);

  // Compile Practical Remedies (Section 11 of Lecture & Research Paper)
  const remedies: MarriageRemedyItem[] = [];

  // Universal Shivalinga worship (always applicable for marriage harmony)
  remedies.push({
    category: "Universal",
    title: "Shivalinga Temple Abhishekam",
    procedure: "Visit a consecrated Shiva temple on Mondays. Offer raw milk and clean water to the Shivalinga while chanting 'Om Namah Shivaya'.",
    caution: "STRICT WARNING: Never keep a Shivalinga or consecrated idol inside the household temple, as residential homes cannot uphold temple-grade ritual consecration.",
    astrologicalRationale: "The 7th house and marital union are energized and purified by Lord Shiva's unconditioned divine balance.",
  });

  // Punarbu Yoga Remedy
  if (punarbuYoga.detected) {
    remedies.push({
      category: "Punarbu",
      title: "Shivalinga Jalabhisheka & Solid Silver Glass (Punarbu Remedy)",
      procedure: punarbuYoga.remedy,
      caution: "Maintain calm resolve; avoid premature panic or abrupt cancellation of matrimonial talks during minor communication lags.",
      astrologicalRationale: "Saturn-Moon connection induces emotional hesitation; worship of Lord Shiva directly harmonizes Chandra (Moon) and Shani (Saturn).",
    });
  }

  // Separative Influences Remedy
  if (separativeAudit.totalSeparativeScore >= 3) {
    remedies.push({
      category: "Separative",
      title: "Grounding & Astro-Vastu Harmonization",
      procedure: "Place a brass or copper vessel with fresh water and flowers in the Northeast (Ishanya) corner. Both partners should consciously establish weekly communication check-ins.",
      astrologicalRationale: "Neutralizes separative tendencies of Sun/Saturn/Rahu across marital pillars (houses 4, 7, 10, 12).",
    });
  }

  // Mars Affliction / Manglik / D9 H4 or H12
  if (h4Audit.planets.includes("Mars") || h12Audit.planets.includes("Mars") || chart.planets["Mars"]?.house === 7) {
    remedies.push({
      category: "Mars",
      title: "Earth Element Burial & Cast Metal Kada",
      procedure: "Take an earthen pot, fill it with whole red lentils (Masoor Dal), dried red chilies, and pure honey. Tie with a clean red cloth and bury in virgin earth on a Tuesday. Additionally, wear a solid cast metal bracelet (Kada) with an inserted pure copper wire on the working hand.",
      astrologicalRationale: "Mars rules fiery aggression; burying it in the earth (Houses 2, 6, 10 earth triplicity) channels and grounds volatile excess energy.",
    });
  }

  // Moon Afflicted
  const moonData = chart.planets["Moon"];
  if (moonData?.dignity === "Debilitated" || planetsIn1st.includes("Moon") || moonData?.house === 6 || moonData?.house === 8) {
    remedies.push({
      category: "Moon",
      title: "Solid Silver Glass & Sandalwood Application",
      procedure: "Drink water and milk exclusively from a solid silver tumbler. Apply natural white sandalwood paste (Chandan) to the forehead daily upon waking.",
      astrologicalRationale: "Empowers the Lagna Lord and lunar emotional fortitude, stabilizing mood swings and emotional reactivity in marriage.",
    });
  }

  // Combust or Afflicted Venus
  const sunLon = chart.planets["Sun"]?.lon ?? 0;
  const venLon = chart.planets["Venus"]?.lon ?? 0;
  const venDiff = Math.abs(sunLon - venLon);
  const isVenCombust = venDiff <= 10 || venDiff >= 350;

  if (isVenCombust || h12Audit.severity !== "clean") {
    remedies.push({
      category: "Venus",
      title: "Curd Bath & WSW Floral Astro-Vastu Cure",
      procedure: "Bathe with fresh curd (yogurt) every Friday morning. In the West-South-West (WSW) zone of the home, hang a framed artwork depicting vibrant multi-colored flowers. Place high-grade branded perfumes beneath this artwork and apply daily.",
      astrologicalRationale: "Restores Venusian glow, aesthetic charm, and romantic vitality when depleted by combustion or 12th house distress.",
    });
  }

  // Combust or Afflicted Mercury
  const merLon = chart.planets["Mercury"]?.lon ?? 0;
  const merDiff = Math.abs(sunLon - merLon);
  const isMerCombust = merDiff <= 14 || merDiff >= 346;

  if (isMerCombust || starLordOfSubLord === "Mercury") {
    remedies.push({
      category: "Mercury",
      title: "Green Cardamom & Living Greenery",
      procedure: "Chew whole green cardamom regularly throughout the day. Introduce vibrant green foliage and potted plants in the living quarters. Dedicate time to reading books and eating fresh green salads.",
      astrologicalRationale: "Sharpens communicative empathy, dissolves fault-finding tendencies, and restores intellectual clarity.",
    });
  }

  // Sun in 12th House (D1 or D9)
  if (planetsIn12th.includes("Sun") || h12Audit.planets.includes("Sun")) {
    remedies.push({
      category: "Sun",
      title: "Surya Arghya & Worship of Lord Rama",
      procedure: "Offer fresh water to the rising morning Sun using a pure copper vessel (Arghya). Recite the Aditya Hridaya Stotram or offer daily prayers to Lord Rama.",
      astrologicalRationale: "Neutralizes ego friction and authority clashes, transforming solar heat into humble devotion and mutual respect.",
    });
  }

  // Unfulfilled Desires (Saturn-Ketu or weak 11th)
  if (chart.planets["Saturn"]?.house === 11 || planetsIn7th.includes("Saturn") || sanyasDenial.saturnKetu7thOr1st) {
    remedies.push({
      category: "Desire_Fulfillment",
      title: "Morning Empty-Stomach Banana Remedy",
      procedure: "Consume one ripe fresh banana every morning on a completely empty stomach.",
      astrologicalRationale: "Activates Jupiterian benefic nutrition to unblock stagnant desires and stimulate the fruition of 11th house fruits.",
    });
  }

  // Kalpurush 7th Rashi (Libra) Cosmic Marriage Anchor
  const kalpurush7thAnchor = evaluateKalpurush7thRashiAnchor(chart);

  // Venus in 12th House / Libra in 12th Wedding Charity Remedy
  if (kalpurush7thAnchor.venus12thRemedyApplicable) {
    remedies.push({
      category: "Venus",
      title: "Charity for Poor/Underprivileged Wedding (12th House Venus Shastra Upay)",
      procedure: "Support or sponsor the wedding expenses, clothes, or rations for a needy/underprivileged boy or girl. Alternatively, contribute to a charitable wedding trust or arrange meals at a marriage ceremony.",
      caution: "Never hoard wealth or maintain hidden resentments. Freely facilitating another's wedding activates 12th house grace and protects your own marital bond from estrangement.",
      astrologicalRationale: "In oral discourse transcript, Venus/Libra in 12th demands voluntary marital charity. Giving to another's wedding permanently stabilizes personal bedroom bliss and neutralizes hospital/litigation drains.",
    });
  }

  // 7th House Occupant Planet's Nakshatra Lord Evaluation
  const seventhHouseOccupantsNL = evaluateSeventhHouseOccupantsNL(chart, kpResult);

  const executiveSummary = [
    `7th Cusp Sub-Lord is **${cusp7SubLord}**, situated in the Star of **${starLordOfSubLord}** (Bhava ${starLordHouse}).`,
    `**Meeting Circumstances**: ${meetingContext.circumstance}`,
    `**7th Rashi Manifestation**: ${rashiImpact.signName} (House 7) activates **${rashiImpact.lifeDomainActivated}**.`,
    `**Kalpurush 7th Sign (Libra)**: Anchored in House ${kalpurush7thAnchor.d1House} (${kalpurush7thAnchor.meetingChannelTitleHinglish}).`,
    `**Navamsha D9 Audit**: D9 Lagna is **${d9LagnaSign}**. Bedroom bliss index: **${bedroomStatus}**.`,
    punarbuYoga.detected
      ? `**Punarbu Alert**: ${punarbuYoga.effects}`
      : `**Punarbu Status**: Clear (no Saturn-Moon delay yoga).`,
    `**Spouse Direction Vector**: ${marriageDirection.primaryDirectionHindi}.`,
    d9Audit.overallD9Verdict,
  ].join(" ");

  return {
    meetingContext,
    rashiImpact,
    kalpurush7thAnchor,
    d9Audit,
    dualMarriage,
    sanyasDenial,
    intimacyAudit,
    punarbuYoga,
    separativeAudit,
    barrenAudit,
    marriageDirection,
    seventhHouseOccupantsNL,
    d1ToD9Mapping,
    remedies,
    executiveSummary,
  };
}
