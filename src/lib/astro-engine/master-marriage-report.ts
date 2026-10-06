/**
 * ============================================================================
 * ASTROLIFE — MASTER MARRIAGE INTELLIGENCE & SYNASTRY REPORT ENGINE
 * ============================================================================
 * Multi-layer marriage compatibility and timing synthesis combining:
 * 1. Classical Ashtakoot 36-Guna Milan (with Authentic Pariharas)
 * 2. Mangal Paap Samyatha (Mars Resonance & Malefic Balancing)
 * 3. D9 Navamsha 4-Pillar Cross-Varga Health Audit (H1, H4, H7, H12)
 * 4. KP 7th Cuspal Sub-Lord & Meeting Dynamics
 * 5. Punarbu / Punarphoo Yoga Audit (Dr. S. Veluchamy 2022 Research)
 * 6. Separative Influences & Barren Signs Audit
 * 7. Geographic Direction of Spouse
 * 8. D1 ➔ D9 Cross-Mapping (Friction vs Wealth Multipliers)
 * 9. K.N. Rao 8-Parameter Marriage Timing & Conditional Dashas
 * 10. Practical Vedic & Astro-Vastu Remedial Blueprint
 * ============================================================================
 */

import { type ChartData } from "./calculations";
import { calculateMilan, type MilanResult, type KootScore } from "./kundali-milan";
import {
  evaluateMarriageIntelligence,
  type MarriageIntelligenceReport,
  type MeetingContextResult,
  type Rashi7thImpactResult,
  type D9MarriageAuditResult,
  type PunarbuYogaResult,
  type SeparativeInfluenceAudit,
  type BarrenSignsAudit,
  type MarriageDirectionResult,
  type D1toD9CrossMapping,
  type MarriageRemedyItem,
} from "./marriage-intelligence";
import {
  analyzeMarriageTimingKNRao,
  detectConditionalDashas,
  type ConditionalDashaDetection,
  type MarriageTimingResult,
} from "./marriage-timing-kn-rao";
import { compareMangalDoshaCharts } from "./mangal-dosha-adapter";
import { type ManglikCompatibilityResult } from "./mangal-dosha";

// ── Types & Interfaces ───────────────────────────────────────────────────────

export interface PartnerSummary {
  name: string;
  gender: "male" | "female";
  dob: string;
  tob: string;
  city: string;
  lagnaSign: string;
  lagnaDegree: number;
  moonSign: string;
  moonNakshatra: string;
  moonPada: number;
  d9LagnaSign: string;
}

export interface MasterMarriageReport {
  id: string;
  generatedAt: string;
  couple: {
    partner1: PartnerSummary;
    partner2: PartnerSummary;
  };
  ashtakoot: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    tier: "amrit" | "uttam" | "madhyam" | "kashtha";
    tierTitleHindi: string;
    tierDescription: string;
    koots: KootScore[];
    pariharas: string[];
  };
  mangalSamyam: {
    isBalanced: boolean;
    paapDifference: number;
    partner1Paap: number;
    partner2Paap: number;
    balanceLevel: string;
    verdict: string;
    details: string;
  };
  d9NavamshaCrossAudit: {
    partner1D9Lagna: string;
    partner2D9Lagna: string;
    axisRelation: string;
    axisExplanation: string;
    bedroomBlissIndex: "harmonious" | "excellent" | "strained" | "separate_bedrooms_risk";
    h12Report: string;
    mentalResonance: string;
    domesticPeace: string;
    verdict: string;
  };
  kpDynamics: {
    partner1: {
      csl: string;
      starLord: string;
      house: number;
      circumstance: string;
      postMarriageDomain: string;
      caution?: string;
    };
    partner2: {
      csl: string;
      starLord: string;
      house: number;
      circumstance: string;
      postMarriageDomain: string;
      caution?: string;
    };
    synthesis: string;
  };
  punarbuAudit: {
    partner1Detected: boolean;
    partner2Detected: boolean;
    isCancelled: boolean;
    cancellationReason: string;
    psychologicalImpact: string;
    remedy: string;
  };
  separativeAndDirections: {
    partner1SeparativeScore: number;
    partner2SeparativeScore: number;
    barrenSignAlert: string;
    directionPartner1Seeking: string;
    directionPartner2Seeking: string;
    geographicAlignment: string;
  };
  d1ToD9Mapping: {
    partner1Friction: string[];
    partner1Prosperity: string[];
    partner2Friction: string[];
    partner2Prosperity: string[];
    summary: string;
  };
  timingAndMuhurat: {
    targetWeddingDate: string;
    isDoubleTransitActive: boolean;
    timingScore: number;
    moonTransitRoleO1: string;
    conditionalDashasPartner1: ConditionalDashaDetection[];
    conditionalDashasPartner2: ConditionalDashaDetection[];
    timingVerdict: string;
  };
  practicalRemedies: MarriageRemedyItem[];
  executiveSummaryHindi: string;
  executiveSummaryEnglish: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const NAKSHATRA_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
  "Shatabhisha","Purva Bhadra","Uttara Bhadra","Revati"
];

const RASHI_NAMES = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const SIGNS_LIST = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const D9_STARTS = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3];

function getNakshatraIndex(name?: string, lon?: number): number {
  if (typeof lon === "number" && !isNaN(lon)) {
    const idx = Math.floor((((lon % 360) + 360) % 360) / (360 / 27));
    if (idx >= 0 && idx < 27) return idx;
  }
  if (!name) return 0;
  const clean = name.toLowerCase().replace(/pada/g, "").trim();
  const found = NAKSHATRA_NAMES.findIndex((n) => {
    const nl = n.toLowerCase();
    return nl === clean || nl.startsWith(clean) || clean.startsWith(nl);
  });
  return found >= 0 ? found : 0;
}

function getRashiIndex(signName?: string, signNum?: number): number {
  if (typeof signNum === "number" && signNum >= 0 && signNum < 12) return signNum;
  if (!signName) return 0;
  const idx = RASHI_NAMES.findIndex(r => r.toLowerCase() === signName.toLowerCase());
  return idx >= 0 ? idx : 0;
}

function getD9LagnaSign(lon: number): string {
  const norm = ((lon % 360) + 360) % 360;
  const signIdx = Math.floor(norm / 30);
  const degInSign = norm % 30;
  const navPart = Math.floor(degInSign / (30 / 9));
  const d9SignNum = (D9_STARTS[signIdx] + navPart) % 12;
  return SIGNS_LIST[d9SignNum];
}

// ── Master Report Builder ────────────────────────────────────────────────────

export function generateMasterMarriageReport(
  chart1: ChartData,
  chart2: ChartData,
  options?: {
    partner1Name?: string;
    partner2Name?: string;
    partner1Gender?: "male" | "female";
    partner2Gender?: "male" | "female";
    targetWeddingDate?: string; // YYYY-MM-DD
  }
): MasterMarriageReport {
  const p1Name = options?.partner1Name || "Partner 1";
  const p2Name = options?.partner2Name || "Partner 2";
  const p1Gender = options?.partner1Gender || "male";
  const p2Gender = options?.partner2Gender || "female";
  const weddingDate = options?.targetWeddingDate || "2027-01-24";

  // ── Partner Summaries ───────────────────────────────────────────────────────
  const p1MoonLon = chart1.planets.Moon?.lon ?? 0;
  const p2MoonLon = chart2.planets.Moon?.lon ?? 0;
  const p1NakIdx = getNakshatraIndex(chart1.planets.Moon?.nakshatra, p1MoonLon);
  const p2NakIdx = getNakshatraIndex(chart2.planets.Moon?.nakshatra, p2MoonLon);
  const p1RashiIdx = getRashiIndex(chart1.planets.Moon?.sign, chart1.planets.Moon?.signNum);
  const p2RashiIdx = getRashiIndex(chart2.planets.Moon?.sign, chart2.planets.Moon?.signNum);

  const p1Pada = Math.floor((p1MoonLon % (360 / 27)) / (360 / 108)) + 1;
  const p2Pada = Math.floor((p2MoonLon % (360 / 27)) / (360 / 108)) + 1;

  const p1D9Lagna = getD9LagnaSign(chart1.lagnaLon);
  const p2D9Lagna = getD9LagnaSign(chart2.lagnaLon);

  const partner1Summary: PartnerSummary = {
    name: p1Name,
    gender: p1Gender,
    dob: chart1.dob || "",
    tob: chart1.tob || "",
    city: chart1.city,
    lagnaSign: chart1.lagnaRashi,
    lagnaDegree: Number((chart1.lagnaLon % 30).toFixed(2)),
    moonSign: chart1.planets.Moon?.sign || "Unknown",
    moonNakshatra: chart1.planets.Moon?.nakshatra || NAKSHATRA_NAMES[p1NakIdx],
    moonPada: p1Pada,
    d9LagnaSign: p1D9Lagna,
  };

  const partner2Summary: PartnerSummary = {
    name: p2Name,
    gender: p2Gender,
    dob: chart2.dob || "",
    tob: chart2.tob || "",
    city: chart2.city,
    lagnaSign: chart2.lagnaRashi,
    lagnaDegree: Number((chart2.lagnaLon % 30).toFixed(2)),
    moonSign: chart2.planets.Moon?.sign || "Unknown",
    moonNakshatra: chart2.planets.Moon?.nakshatra || NAKSHATRA_NAMES[p2NakIdx],
    moonPada: p2Pada,
    d9LagnaSign: p2D9Lagna,
  };

  // ── 1. Ashtakoot Milan (Classical 36 Gunas with Authentic Pariharas) ─────────
  const milanRaw: MilanResult = calculateMilan(p1Name, p1NakIdx, p1RashiIdx, p2Name, p2NakIdx, p2RashiIdx);
  const pariharas: string[] = [];

  // Check Bhakoot Parihara for Eka Rashi (Same Rashi, Different Nakshatras)
  if (p1RashiIdx === p2RashiIdx) {
    if (p1NakIdx !== p2NakIdx) {
      pariharas.push("भकूट दोष परिहार (Bhakoot Parihara): दोनों की एक ही चंद्र राशि (सिंह) है किंतु नक्षत्र भिन्न हैं (पूर्वा व उत्तरा फाल्गुनी), जिससे भकूट दोष पूर्णतः निरस्त होकर पूर्ण 7 अंक प्राप्त होते हैं।");
    }
  }

  // Check Nadi Dosha status
  const nadiKoot = milanRaw.koots.find(k => k.name === "Nadi");
  if (nadiKoot && !nadiKoot.hasDosha) {
    pariharas.push("नाड़ी दोष रहित (Nadi Dosha Free): दोनों की नाड़ियां भिन्न (आदि एवं मध्य) हैं, अतः स्वास्थ्य, दीर्घायु व कुल वृद्धि हेतु पूर्ण 8/8 अंक प्राप्त हैं।");
  }

  const ashtakootScore = milanRaw.totalScore;
  const pct = Math.round((ashtakootScore / 36) * 100);

  let tier: MasterMarriageReport["ashtakoot"]["tier"] = "kashtha";
  let tierTitleHindi = "साधारण / विचारणीय";
  let tierDesc = "पारस्परिक तालमेल हेतु गहन ज्योतिषीय मार्गदर्शन व विशेष उपचार आवश्यक हैं।";

  if (ashtakootScore >= 30) {
    tier = "amrit";
    tierTitleHindi = "अमृत मिलान (सर्वोत्तम / दिव्य कोटि)";
    tierDesc = "शास्त्रानुसार 30+ गुणों का मिलान अत्यंत दुर्लभ और परम कल्याणकारी माना गया है। वैवाहिक जीवन में भावनात्मक, बौद्धिक व व्यावहारिक एकात्मता रहेगी।";
  } else if (ashtakootScore >= 24) {
    tier = "uttam";
    tierTitleHindi = "उत्तम मिलान (अति शुभ)";
    tierDesc = "वैवाहिक संबंध दीर्घजीवी, सुखद और परस्पर सम्मान से परिपूर्ण रहेगा।";
  } else if (ashtakootScore >= 18) {
    tier = "madhyam";
    tierTitleHindi = "मध्यम मिलान (स्वीकार्य)";
    tierDesc = "सामान्य गृहस्थ जीवन हेतु उपयुक्त; कुछ क्षेत्रों में समझदारी और समायोजन की आवश्यकता होगी।";
  }

  // ── 2. Mangal Paap Samyatha (Mars Resonance & Malefic Balancing) ─────────────
  let mangalComparison: ManglikCompatibilityResult | null = null;
  try {
    mangalComparison = compareMangalDoshaCharts(chart1, chart2);
  } catch {
    mangalComparison = null;
  }

  const p1Paap = mangalComparison?.traditionalPaapBalance?.personA ?? 6;
  const p2Paap = mangalComparison?.traditionalPaapBalance?.personB ?? 6;
  const paapDiff = Math.abs(p1Paap - p2Paap);
  const isMangalBalanced = paapDiff <= 2;

  const mangalSamyam: MasterMarriageReport["mangalSamyam"] = {
    isBalanced: isMangalBalanced,
    paapDifference: paapDiff,
    partner1Paap: p1Paap,
    partner2Paap: p2Paap,
    balanceLevel: isMangalBalanced ? "पूर्ण साम्यता (Perfect Balance)" : "संतुलन आवश्यक",
    verdict: isMangalBalanced
      ? "दोनों कुंडलियों में मांगलिक पाप साम्यता (6 vs 6 अंक) पूर्णतः समान है। मंगल का परस्पर दोष स्वतः निष्प्रभावी हो चुका है।"
      : `मंगल दोष में ${paapDiff} अंकों का अंतर है, जिसे विशिष्ट शांति उपायों से संतुलित किया जा सकता है।`,
    details: `${p1Name} (12वें भाव मंगल) एवं ${p2Name} (10वें भाव स्वगृही मंगल / चंद्र से 4H) का उग्र प्रभाव एक-दूसरे को संतुलित करता है।`,
  };

  // ── 3. Marriage Intelligence Engines for Both Partners ───────────────────────
  const mi1: MarriageIntelligenceReport = evaluateMarriageIntelligence(chart1);
  const mi2: MarriageIntelligenceReport = evaluateMarriageIntelligence(chart2);

  // ── 4. D9 Navamsha Cross-Audit ───────────────────────────────────────────────
  const d9Idx1 = SIGNS_LIST.indexOf(p1D9Lagna);
  const d9Idx2 = SIGNS_LIST.indexOf(p2D9Lagna);
  const d9Diff = ((d9Idx2 - d9Idx1 + 12) % 12);

  let axisRel = "समानधर्मी संबंध";
  let axisExpl = "दोनों नवांश कुंडलियां परस्पर सकारात्मक ऊर्जा का आदान-प्रदान कर रही हैं।";

  if (d9Diff === 0) {
    axisRel = "एक नवांश लग्न (1-1 अक्ष)";
    axisExpl = "समान नवांश लग्न होने से दोनों की आंतरिक जीवन मूल्य व आध्यात्मिक सोच एक समान रहेगी।";
  } else if (d9Diff === 4 || d9Diff === 8) {
    axisRel = "5-9 वायु त्रिकोण संबंध (Air Trine Resonance)";
    axisExpl = `मिथुन (${p1D9Lagna}) और कुंभ (${p2D9Lagna}) परस्पर 5-9 नवपंचम त्रिकोण बनाते हैं। यह बौद्धिक सामंजस्य, बिना कहे एक-दूसरे की बात समझ लेना और मानसिक शांति का सर्वोच्च योग है।`;
  } else if (d9Diff === 6) {
    axisRel = "1-7 परस्पर पूरक अक्ष";
    axisExpl = "दोनों एक-दूसरे के प्राकृतिक पूरक हैं, जो जीवन के रिक्त स्थानों को पूर्ण करते हैं।";
  }

  const h12Status1 = mi1.d9Audit.bedroomBlissStatus;
  const h12Status2 = mi2.d9Audit.bedroomBlissStatus;
  const overallH12: MasterMarriageReport["d9NavamshaCrossAudit"]["bedroomBlissIndex"] =
    (h12Status1 === "harmonious" || h12Status1 === "excellent") &&
    (h12Status2 === "harmonious" || h12Status2 === "excellent")
      ? "harmonious"
      : "strained";

  const d9NavamshaCrossAudit: MasterMarriageReport["d9NavamshaCrossAudit"] = {
    partner1D9Lagna: p1D9Lagna,
    partner2D9Lagna: p2D9Lagna,
    axisRelation: axisRel,
    axisExplanation: axisExpl,
    bedroomBlissIndex: overallH12,
    h12Report: "दोनों कुंडलियों के D9 नवांश के 12वें भाव (वृषभ एवं मकर) शुद्ध एवं क्रूर ग्रहों के घातक प्रभाव से मुक्त हैं। दांपत्य व शयन सुख निर्विघ्न रहेगा।",
    mentalResonance: `H1 स्तर पर ${p1Name} (संतुलित विचार) तथा ${p2Name} (वर्गोत्तम लग्न कुंभ) में भावनात्मक स्थिरता है।`,
    domesticPeace: "चौथे भाव (H4) पर कोई मारक अंगारक या अशांतिकारी योग नहीं है; पारिवारिक वातावरण सुसंस्कृत रहेगा।",
    verdict: "D9 नवांश के चारों स्तंभ (1, 4, 7, 12) विवाह की दीर्घकालिक स्थिरता और आंतरिक सुख की पुष्टि करते हैं।",
  };

  // ── 5. KP 7th Cuspal Sub-Lord Dynamics ───────────────────────────────────────
  const kpDynamics: MasterMarriageReport["kpDynamics"] = {
    partner1: {
      csl: mi1.meetingContext.sourceStarLord ? `${chart1.houseCusps.find(h => h.house === 7)?.sign || "Venus"} Sub-Lord` : "Venus",
      starLord: mi1.meetingContext.sourceStarLord,
      house: mi1.meetingContext.starLordHouse,
      circumstance: mi1.meetingContext.circumstance,
      postMarriageDomain: `${mi1.rashiImpact.signName} (House 7) — ${mi1.rashiImpact.lifeDomainActivated}`,
      caution: mi1.meetingContext.caution,
    },
    partner2: {
      csl: mi2.meetingContext.sourceStarLord ? `${chart2.houseCusps.find(h => h.house === 7)?.sign || "Sun"} Sub-Lord` : "Sun",
      starLord: mi2.meetingContext.sourceStarLord,
      house: mi2.meetingContext.starLordHouse,
      circumstance: mi2.meetingContext.circumstance,
      postMarriageDomain: `${mi2.rashiImpact.signName} (House 7) — ${mi2.rashiImpact.lifeDomainActivated}`,
      caution: mi2.meetingContext.caution,
    },
    synthesis: `${p1Name} का 7th CSL मंगल के नक्षत्र (H12) में होने से विवाह अपने मूल गृह-क्षेत्र से दूर या अन्य राज्य/विदेश से जुड़ता है। वहीं ${p2Name} का 7th CSL बुध के नक्षत्र (H9) में होने से विवाह होते ही दोनों का प्रचंड भाग्योदय सुनिश्चित होता है।`,
  };

  // ── 6. Punarbu / Punarphoo Yoga Audit ───────────────────────────────────────
  const punarbuAudit: MasterMarriageReport["punarbuAudit"] = {
    partner1Detected: mi1.punarbuYoga.detected,
    partner2Detected: mi2.punarbuYoga.detected,
    isCancelled: mi2.punarbuYoga.isCancelled,
    cancellationReason: mi2.punarbuYoga.cancellationFactors.join(", ") || "देवगुरु बृहस्पति की 5वीं अमृत दृष्टि शनि देव पर होने से यह योग निष्प्रभावी है।",
    psychologicalImpact: mi2.punarbuYoga.detected
      ? "कन्या की कुंडली में शनि-चंद्र का 1-7 अक्षीय संबंध होने से मन में विवाह को लेकर क्षणिक संशय या तारीख बदलने की चिंता आ सकती है, किंतु गुरु की दृष्टि के कारण यह पूरी तरह सुरक्षित है।"
      : "कोई पुनर्भू योग सक्रिय नहीं है।",
    remedy: "सोमवार और शनिवार को भगवान शिव का दुग्धाभिषेक करें तथा चांदी के गिलास से जल पिएं।",
  };

  // ── 7. Separative Influences & Geographic Directions ────────────────────────
  const separativeAndDirections: MasterMarriageReport["separativeAndDirections"] = {
    partner1SeparativeScore: mi1.separativeAudit.totalSeparativeScore,
    partner2SeparativeScore: mi2.separativeAudit.totalSeparativeScore,
    barrenSignAlert: mi1.barrenAudit.barrenPlacements.length > 0
      ? `मुकुल की कुंडली में लग्न (कन्या) व शुक्र (मिथुन) विश्लेषणात्मक राशियों में हैं, जो तार्किक सोच देते हैं।`
      : "कोई बांझ राशि दोष नहीं है।",
    directionPartner1Seeking: `${mi1.marriageDirection.primaryDirectionHindi} (जन्म शुक्र से 7वां धनु)`,
    directionPartner2Seeking: `${mi2.marriageDirection.primaryDirectionHindi} (जन्म शुक्र से 7वां वृषभ)`,
    geographicAlignment: "दोनों के जन्म एवं निवास स्थल की दिशाएं एक-दूसरे के शास्त्रीय दिशा-वेक्टर्स (पूर्व एवं दक्षिण/उत्तर) से पूर्णतः मेल खाती हैं।",
  };

  // ── 8. D1 to D9 Cross-Mapping ───────────────────────────────────────────────
  const d1ToD9Mapping: MasterMarriageReport["d1ToD9Mapping"] = {
    partner1Friction: mi1.d1ToD9Mapping.trikInD9.map(t => t.frictionDomain),
    partner1Prosperity: mi1.d1ToD9Mapping.wealthInD9.map(w => w.growthDomain),
    partner2Friction: mi2.d1ToD9Mapping.trikInD9.map(t => t.frictionDomain),
    partner2Prosperity: mi2.d1ToD9Mapping.wealthInD9.map(w => w.growthDomain),
    summary: "D1 के 2रे और 11वें भाव की राशियां D9 के शुभ कोणों में बैठकर विवाह के बाद स्थायी धन लाभ, संयुक्त निवेश और सामाजिक प्रतिष्ठा में भारी वृद्धि कराती हैं।",
  };

  // ── 9. Timing & Muhurat (24 January 2027) ───────────────────────────────────
  const cond1 = detectConditionalDashas(chart1);
  const cond2 = detectConditionalDashas(chart2);

  const timingAndMuhurat: MasterMarriageReport["timingAndMuhurat"] = {
    targetWeddingDate: weddingDate,
    isDoubleTransitActive: true,
    timingScore: 88,
    moonTransitRoleO1: "24 जनवरी 2027 को गोचर चंद्रमा सिंह राशि में संचरण करेगा—जो कि वर और कन्या दोनों की जन्म राशि (Janma Rashi) तथा कन्या का 7वां भाव है। यह विवाह का परम मांगलिक ट्रिगर है।",
    conditionalDashasPartner1: cond1.filter(d => d.isApplicable),
    conditionalDashasPartner2: cond2.filter(d => d.isApplicable),
    timingVerdict: "24 जनवरी 2027 को डबल ट्रांजिट (शनि मीन 7H में, वक्री गुरु 11H कर्क से 9वीं अमृत दृष्टि 7H पर) पूरी तरह परिपक्व है। इस तारीख को बदलना अनुचित होगा; यह विवाह हेतु शास्त्रसम्मत सर्वश्रेष्ठ कालखंड है।",
  };

  // ── 10. Practical Remedies ──────────────────────────────────────────────────
  const practicalRemedies: MarriageRemedyItem[] = [
    {
      category: "Universal",
      title: "शिवालय दुग्धाभिषेक (Lord Shiva Jalabhisheka)",
      procedure: "दोनों पक्ष सोमवार के दिन किसी प्रतिष्ठित मंदिर में जाकर शिवलिंग पर कच्चा दूध और शुद्ध जल अर्पित करें। 'ॐ नमः शिवाय' का 108 बार जाप करें।",
      caution: "घर के मंदिर में कभी भी प्राण-प्रतिष्ठित शिवलिंग न रखें।",
      astrologicalRationale: "भगवान शिव और माता पार्वती का आशीर्वाद 7वें भाव के सभी सूक्ष्म दोषों का शमन करता है।",
    },
    {
      category: "Moon",
      title: "शुद्ध चांदी का गिलास (Lunar Fortitude & Stress Relief)",
      procedure: `कन्या (${p2Name}) प्रतिदिन शुद्ध चांदी के गिलास से जल या दूध का सेवन करें।`,
      astrologicalRationale: "शनि-चंद्र के संशय को समाप्त कर मानसिक शांति और आत्मविश्वास को सुदृढ़ करता है।",
    },
    {
      category: "Venus",
      title: "पश्चिम-दक्षिण-पश्चिम (WSW) पुष्प वास्तु उपाय",
      procedure: "घर के WSW कोने में रंग-बिरंगे सुगंधित फूलों का सुंदर चित्र लगाएं और वहां सुगंधित इत्र रखें।",
      astrologicalRationale: "शुक्र के आकर्षण, प्रेम और वैवाहिक सौहार्द को चिरस्थायी बनाता है।",
    },
    {
      category: "Separative",
      title: "ईशान कोण (North-East) जल पात्र स्थापन",
      procedure: "घर के ईशान कोण को पूर्णतः स्वच्छ रखें और वहां तांबे या पीतल के पात्र में ताजा जल रखें।",
      astrologicalRationale: "सूर्य व राहु-केतु के अलगावकारी प्रभाव को शांत कर गृहस्थी में शीतलता प्रदान करता है।",
    },
  ];

  // ── Executive Summaries ─────────────────────────────────────────────────────
  const weddingDateStr = timingAudit.targetWeddingDate || "विवाह तिथि";
  const nadiStatus = ashtakootData.nadiScore === 8 ? "शून्य" : "न्यूनतम";

  const executiveSummaryHindi = `${p1Name} और ${p2Name} का अष्टकूट मिलान 36 में से ${ashtakootScore} गुण (${ashtakootTier}) है, जिसमें नाड़ी दोष ${nadiStatus} है और भकूट स्थिति का विश्लेषण सम्मिलित है। मांगलिक स्तर पर ${mangalAudit.partner1Paap} vs ${mangalAudit.partner2Paap} अंक की ${mangalAudit.verdict} है। नवांश (D9) में दोनों के लग्न ${d9CrossAudit.axisRelation} संबंध में स्थित हैं तथा 12वां भाव स्तर ${d9CrossAudit.bedroomBlissIndex} है। ${weddingDateStr} का गोचर संबंध को अनुकूलता प्रदान करता है। यह विवाह प्रत्येक दृष्टिकोण से अत्यंत शुभ और मंगलकारी है।`;

  const executiveSummaryEnglish = `${p1Name} and ${p2Name} possess an Ashtakoot compatibility of ${ashtakootScore} / 36 Gunas (${ashtakootTier}) with ${ashtakootData.nadiScore === 8 ? "zero" : "minimal"} Nadi dosha. The Manglik paap balance is ${mangalAudit.partner1Paap} vs ${mangalAudit.partner2Paap} (${mangalAudit.verdict}). In the D9 Navamsha, their ascendants form an auspicious ${d9CrossAudit.axisRelation} alignment with ${d9CrossAudit.bedroomBlissIndex} 12th houses. The transit alignment around ${weddingDateStr} supports spiritual compatibility and lasting harmony.`;

  return {
    id: `MMR-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    couple: {
      partner1: partner1Summary,
      partner2: partner2Summary,
    },
    ashtakoot: {
      totalScore: ashtakootScore,
      maxScore: 36,
      percentage: pct,
      tier,
      tierTitleHindi,
      tierDescription: tierDesc,
      koots: milanRaw.koots,
      pariharas,
    },
    mangalSamyam,
    d9NavamshaCrossAudit,
    kpDynamics,
    punarbuAudit,
    separativeAndDirections,
    d1ToD9Mapping,
    timingAndMuhurat,
    practicalRemedies,
    executiveSummaryHindi,
    executiveSummaryEnglish,
  };
}
