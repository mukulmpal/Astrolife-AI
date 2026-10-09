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

import { calculateChart, type ChartData } from "./calculations";
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
  type Kalpurush7thRashiAnchor,
  type SeventhHouseOccupantNLAnalysis,
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
  kalpurush7thAudit: {
    partner1: Kalpurush7thRashiAnchor;
    partner2: Kalpurush7thRashiAnchor;
    meetingChannelPartner1: string;
    meetingChannelPartner2: string;
    maritalBalancePartner1: string;
    maritalBalancePartner2: string;
    karmicSynthesisHinglish: string;
    weddingCharityRemedy?: string;
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
  seventhHouseNakshatraAudit: {
    partner1: SeventhHouseOccupantNLAnalysis;
    partner2: SeventhHouseOccupantNLAnalysis;
    synthesisHinglish: string;
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

// ── Dynamic Transit & Aspect Helpers ─────────────────────────────────────────

function getSaturnAspectSigns(sign: string): string[] {
  const idx = SIGNS_LIST.indexOf(sign);
  if (idx < 0) return [];
  return [sign, SIGNS_LIST[(idx + 2) % 12], SIGNS_LIST[(idx + 6) % 12], SIGNS_LIST[(idx + 9) % 12]];
}

function getJupiterAspectSigns(sign: string): string[] {
  const idx = SIGNS_LIST.indexOf(sign);
  if (idx < 0) return [];
  return [sign, SIGNS_LIST[(idx + 4) % 12], SIGNS_LIST[(idx + 6) % 12], SIGNS_LIST[(idx + 8) % 12]];
}

function get7thSign(sign: string): string {
  const idx = SIGNS_LIST.indexOf(sign);
  if (idx < 0) return "";
  return SIGNS_LIST[(idx + 6) % 12];
}

function evaluateDynamicWeddingTiming(
  chart1: ChartData,
  chart2: ChartData,
  targetDate: string
) {
  let transitSaturnSign = "Pisces";
  let transitJupiterSign = "Leo";
  let transitJupiterRetro = false;
  let transitMoonSign = "Leo";
  let transitMoonNak = "Magha";

  try {
    const tChart = calculateChart(
      "Transit",
      targetDate,
      "12:00",
      chart1.city || "New Delhi",
      chart1.lat ?? 28.6139,
      chart1.lon ?? 77.2090,
      chart1.tz ?? 5.5
    );
    if (tChart?.planets) {
      transitSaturnSign = tChart.planets.Saturn?.sign || transitSaturnSign;
      transitJupiterSign = tChart.planets.Jupiter?.sign || transitJupiterSign;
      transitJupiterRetro = Boolean(tChart.planets.Jupiter?.retrograde);
      transitMoonSign = tChart.planets.Moon?.sign || transitMoonSign;
      transitMoonNak = tChart.planets.Moon?.nakshatra || transitMoonNak;
    }
  } catch (err) {
    console.warn("Could not calculate transit chart for date:", targetDate, err);
  }

  const saturnInfluencedSigns = getSaturnAspectSigns(transitSaturnSign);
  const jupiterInfluencedSigns = getJupiterAspectSigns(transitJupiterSign);

  const targets1 = [chart1.lagnaRashi, get7thSign(chart1.lagnaRashi)];
  const targets2 = [chart2.lagnaRashi, get7thSign(chart2.lagnaRashi)];

  const saturnHits1 = targets1.some((s) => saturnInfluencedSigns.includes(s));
  const jupiterHits1 = targets1.some((s) => jupiterInfluencedSigns.includes(s));
  const saturnHits2 = targets2.some((s) => saturnInfluencedSigns.includes(s));
  const jupiterHits2 = targets2.some((s) => jupiterInfluencedSigns.includes(s));

  const doubleTransitP4 = (saturnHits1 && jupiterHits1) || (saturnHits2 && jupiterHits2);

  let score = 55;
  if (doubleTransitP4) score += 30;
  else if (saturnHits1 || jupiterHits1 || saturnHits2 || jupiterHits2) score += 15;

  const isMoonAuspicious =
    transitMoonSign === chart1.planets.Moon?.sign ||
    transitMoonSign === chart2.planets.Moon?.sign ||
    transitMoonSign === get7thSign(chart1.lagnaRashi) ||
    transitMoonSign === get7thSign(chart2.lagnaRashi);

  if (isMoonAuspicious) score += 10;

  const moonTransitRoleO1 = `${targetDate} को गोचर चंद्रमा ${transitMoonSign} राशि (${transitMoonNak} नक्षत्र) में संचरण करेगा, जो जन्म कुंडलियों के लग्न/सप्तम अक्ष पर प्रभाव डालता है।`;

  const timingVerdict = doubleTransitP4
    ? `${targetDate} को के.एन. राव डबल ट्रांजिट (शनि ${transitSaturnSign} एवं गुरु ${transitJupiterSign}${transitJupiterRetro ? " वक्री" : ""}) परिपक्व है। यह विवाह हेतु शास्त्रसम्मत अनुकूल कालखंड है।`
    : `${targetDate} को गोचर प्रभाव मध्यम है। गुरु (${transitJupiterSign}) व शनि (${transitSaturnSign}) का प्रभाव सक्रिय है; इस तिथि पर परिहार एवं शुभ मुहूर्त का चयन कर विवाह संपन्न किया जा सकता है।`;

  return {
    targetWeddingDate: targetDate,
    isDoubleTransitActive: doubleTransitP4,
    timingScore: Math.min(100, score),
    moonTransitRoleO1,
    timingVerdict,
  };
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
  const p1Name = options?.partner1Name || chart1.name || "Partner 1";
  const p2Name = options?.partner2Name || chart2.name || "Partner 2";
  const p1Gender = options?.partner1Gender || "male";
  const p2Gender = options?.partner2Gender || "female";
  
  const defaultFutureDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split("T")[0];
  };
  const weddingDate = options?.targetWeddingDate || defaultFutureDate();

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

  const p1MoonSign = chart1.planets.Moon?.sign || RASHI_NAMES[p1RashiIdx];
  const p2MoonSign = chart2.planets.Moon?.sign || RASHI_NAMES[p2RashiIdx];
  const p1MoonNak = chart1.planets.Moon?.nakshatra || NAKSHATRA_NAMES[p1NakIdx];
  const p2MoonNak = chart2.planets.Moon?.nakshatra || NAKSHATRA_NAMES[p2NakIdx];

  // Check Bhakoot Parihara for Eka Rashi (Same Rashi, Different Nakshatras)
  if (p1RashiIdx === p2RashiIdx) {
    if (p1NakIdx !== p2NakIdx) {
      pariharas.push(`भकूट दोष परिहार (Bhakoot Parihara): दोनों की एक ही चंद्र राशि (${p1MoonSign}) है किंतु जन्म नक्षत्र भिन्न हैं (${p1MoonNak} एवं ${p2MoonNak}), जिससे भकूट दोष निरस्त होकर शुभ फल प्राप्त होता है।`);
    }
  }

  // Check Nadi Dosha status
  const nadiKoot = milanRaw.koots.find(k => k.name === "Nadi");
  if (nadiKoot && !nadiKoot.hasDosha) {
    pariharas.push(`नाड़ी दोष रहित (Nadi Dosha Free): दोनों की नाड़ियां परस्पर अनुकूल हैं, जिससे स्वास्थ्य, दीर्घायु व कुल वृद्धि हेतु पूर्ण ${nadiKoot.points}/${nadiKoot.maxPoints} अंक प्राप्त हैं।`);
  } else if (nadiKoot && nadiKoot.hasDosha) {
    pariharas.push(`नाड़ी दोष विचार: नाड़ी दोष दृष्टिगत है, जिसके निवारण हेतु शास्त्रीय महामृत्युंजय जप एवं सुवर्ण/गौ दान की अनुशंसा की जाती है।`);
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

  const p1Paap = mangalComparison?.traditionalPaapBalance?.personA ?? 0;
  const p2Paap = mangalComparison?.traditionalPaapBalance?.personB ?? 0;
  const paapDiff = Math.abs(p1Paap - p2Paap);
  const isMangalBalanced = paapDiff <= 2;

  const p1MarsSign = chart1.planets.Mars?.sign || "";
  const p1MarsHouse = chart1.planets.Mars?.house ?? 1;
  const p2MarsSign = chart2.planets.Mars?.sign || "";
  const p2MarsHouse = chart2.planets.Mars?.house ?? 1;

  const mangalSamyam: MasterMarriageReport["mangalSamyam"] = {
    isBalanced: isMangalBalanced,
    paapDifference: paapDiff,
    partner1Paap: p1Paap,
    partner2Paap: p2Paap,
    balanceLevel: isMangalBalanced ? "पूर्ण साम्यता (Harmonious Balance)" : "साम्यता संतुलन विचारणीय",
    verdict: isMangalBalanced
      ? `दोनों कुंडलियों में मांगलिक पाप साम्यता (${p1Paap} vs ${p2Paap} अंक) संतुलित है। मंगल का परस्पर प्रभाव सामंजस्यपूर्ण और दोष-मुक्त है।`
      : `मंगल दोष में ${paapDiff} अंकों का अंतर है (${p1Paap} vs ${p2Paap}), जिसे विशिष्ट शांति उपायों और समझदारी से संतुलित किया जा सकता है।`,
    details: `${p1Name} (भाव ${p1MarsHouse} ${p1MarsSign} मंगल) एवं ${p2Name} (भाव ${p2MarsHouse} ${p2MarsSign} मंगल) की ऊर्जा स्थिति परस्पर सामंजस्य स्थापित करती है।`,
  };

  // ── 3. Marriage Intelligence Engines for Both Partners ───────────────────────
  const mi1: MarriageIntelligenceReport = evaluateMarriageIntelligence(chart1);
  const mi2: MarriageIntelligenceReport = evaluateMarriageIntelligence(chart2);

  // ── 3B. Kalpurush 7th Rashi (Libra / तुला) Cosmic Marriage Anchor ──────────
  const k7p1 = mi1.kalpurush7thAnchor;
  const k7p2 = mi2.kalpurush7thAnchor;

  const charityRemedy =
    k7p1.venus12thRemedyHinglish || k7p2.venus12thRemedyHinglish || undefined;

  const kalpurush7thAudit: MasterMarriageReport["kalpurush7thAudit"] = {
    partner1: k7p1,
    partner2: k7p2,
    meetingChannelPartner1: `${k7p1.meetingChannelTitleHinglish} (House ${k7p1.d1House})`,
    meetingChannelPartner2: `${k7p2.meetingChannelTitleHinglish} (House ${k7p2.d1House})`,
    maritalBalancePartner1: k7p1.maritalBalanceDomainHinglish,
    maritalBalancePartner2: k7p2.maritalBalanceDomainHinglish,
    karmicSynthesisHinglish: `${p1Name} की कुंडली में कालपुरुष की ७वीं राशि (तुला) भाव ${k7p1.d1House} में है तथा ${p2Name} में भाव ${k7p2.d1House} में है। यह दोनों के जीवनसाथी प्राप्ति के कर्म और दांपत्य संतुलन के तराजू को सटीक रूप से इंगित करता है।`,
    weddingCharityRemedy: charityRemedy,
  };

  // ── 4. D9 Navamsha Cross-Audit ───────────────────────────────────────────────
  const d9Idx1 = SIGNS_LIST.indexOf(p1D9Lagna);
  const d9Idx2 = SIGNS_LIST.indexOf(p2D9Lagna);
  const d9Diff = ((d9Idx2 - d9Idx1 + 12) % 12);

  let axisRel = "समानधर्मी संबंध";
  let axisExpl = `${p1D9Lagna} और ${p2D9Lagna} नवांश परस्पर सकारात्मक ऊर्जा का आदान-प्रदान करते हैं।`;

  if (d9Diff === 0) {
    axisRel = "1-1 सम-नवांश लग्न (Unity Alignment)";
    axisExpl = `दोनों का नवांश लग्न ${p1D9Lagna} होने से आंतरिक जीवन मूल्य, लक्ष्य और आध्यात्मिक सोच में एकात्मता रहेगी।`;
  } else if (d9Diff === 4 || d9Diff === 8) {
    axisRel = "5-9 नवपंचम त्रिकोण संबंध (Trine Resonance)";
    axisExpl = `${p1D9Lagna} और ${p2D9Lagna} परस्पर 5-9 नवपंचम त्रिकोण बनाते हैं। यह बौद्धिक सामंजस्य, सहज समझ और वैवाहिक सौहार्द का सर्वोत्तम शास्त्रीय योग है।`;
  } else if (d9Diff === 6) {
    axisRel = "1-7 परस्पर पूरक अक्ष (Complementary Axis)";
    axisExpl = `${p1D9Lagna} और ${p2D9Lagna} परस्पर 1-7 अक्ष पर हैं, जो एक-दूसरे के व्यक्तित्व को पूर्णता और संतुलन प्रदान करते हैं।`;
  } else if (d9Diff === 2 || d9Diff === 10) {
    axisRel = "3-11 उपचय लाभ संबंध (Mutual Growth Axis)";
    axisExpl = `${p1D9Lagna} और ${p2D9Lagna} परस्पर 3-11 अक्ष पर हैं, जो विवाह के उपरांत आर्थिक समृद्धि, उद्यम और सामाजिक प्रतिष्ठा में वृद्धि करते हैं।`;
  } else if (d9Diff === 3 || d9Diff === 9) {
    axisRel = "4-10 केंद्र संबंध (Kendra Stability)";
    axisExpl = `${p1D9Lagna} और ${p2D9Lagna} परस्पर केंद्र संबंध में हैं, जो दांपत्य जीवन में कर्तव्यनिष्ठा और गृहस्थ सुख की नींव को सुदृढ़ बनाते हैं।`;
  } else {
    axisRel = "समन्वयात्मक संबंध (Adaptive Dynamics)";
    axisExpl = `${p1D9Lagna} और ${p2D9Lagna} का नवांश समन्वय दोनों के स्वभाव में परिपक्वता और आपसी समायोजन की प्रेरणा देता है।`;
  }

  const h12Status1 = mi1.d9Audit.bedroomBlissStatus;
  const h12Status2 = mi2.d9Audit.bedroomBlissStatus;
  const overallH12: MasterMarriageReport["d9NavamshaCrossAudit"]["bedroomBlissIndex"] =
    (h12Status1 === "harmonious" || h12Status1 === "excellent") &&
    (h12Status2 === "harmonious" || h12Status2 === "excellent")
      ? "harmonious"
      : "strained";

  const p1H12D9Sign = SIGNS_LIST[(d9Idx1 + 11) % 12];
  const p2H12D9Sign = SIGNS_LIST[(d9Idx2 + 11) % 12];

  const d9NavamshaCrossAudit: MasterMarriageReport["d9NavamshaCrossAudit"] = {
    partner1D9Lagna: p1D9Lagna,
    partner2D9Lagna: p2D9Lagna,
    axisRelation: axisRel,
    axisExplanation: axisExpl,
    bedroomBlissIndex: overallH12,
    h12Report: overallH12 === "harmonious"
      ? `दोनों कुंडलियों के D9 नवांश के 12वें भाव (${p1H12D9Sign} एवं ${p2H12D9Sign}) शुभ प्रभाव में हैं। दांपत्य व शयन सुख में सकारात्मकता रहेगी।`
      : `D9 नवांश के 12वें भाव (${p1H12D9Sign} व ${p2H12D9Sign}) में संतुलन बनाए रखने हेतु आपसी संवेदनशीलता और सामंजस्य आवश्यक है।`,
    mentalResonance: `D1 एवं D9 लग्न समन्वय से ${p1Name} (${chart1.lagnaRashi} / ${p1D9Lagna}) तथा ${p2Name} (${chart2.lagnaRashi} / ${p2D9Lagna}) में भावनात्मक व व्यावहारिक संतुलन रहेगा।`,
    domesticPeace: "चतुर्थ भाव (H4) पर कोई मारक अंगारक योग नहीं है; पारिवारिक वातावरण सुसंस्कृत और शांतिपूर्ण रहेगा।",
    verdict: "D9 नवांश के चारों स्तंभ (1, 4, 7, 12) विवाह की दीर्घकालिक स्थिरता और आंतरिक सुख की पुष्टि करते हैं।",
  };

  // ── 5. KP 7th Cuspal Sub-Lord Dynamics ───────────────────────────────────────
  const p1StarLord = mi1.meetingContext.sourceStarLord || chart1.planets.Venus?.nakshatraLord || "शुक्र";
  const p1House = mi1.meetingContext.starLordHouse || 7;
  const p2StarLord = mi2.meetingContext.sourceStarLord || chart2.planets.Jupiter?.nakshatraLord || "बृहस्पति";
  const p2House = mi2.meetingContext.starLordHouse || 7;

  const kpDynamics: MasterMarriageReport["kpDynamics"] = {
    partner1: {
      csl: `${chart1.houseCusps?.find(h => h.house === 7)?.sign || chart1.lagnaRashi} 7th CSL`,
      starLord: p1StarLord,
      house: p1House,
      circumstance: mi1.meetingContext.circumstance || "पारिवारिक व सामाजिक सहयोग द्वारा परिचय",
      postMarriageDomain: `${mi1.rashiImpact.signName} (House 7) — ${mi1.rashiImpact.lifeDomainActivated}`,
      caution: mi1.meetingContext.caution,
    },
    partner2: {
      csl: `${chart2.houseCusps?.find(h => h.house === 7)?.sign || chart2.lagnaRashi} 7th CSL`,
      starLord: p2StarLord,
      house: p2House,
      circumstance: mi2.meetingContext.circumstance || "पारिवारिक व सामाजिक सहयोग द्वारा परिचय",
      postMarriageDomain: `${mi2.rashiImpact.signName} (House 7) — ${mi2.rashiImpact.lifeDomainActivated}`,
      caution: mi2.meetingContext.caution,
    },
    synthesis: `${p1Name} के 7th CSL के नक्षत्र स्वामी (${p1StarLord} - भाव ${p1House}) तथा ${p2Name} के 7th CSL (${p2StarLord} - भाव ${p2House}) वैवाहिक बंधन व सामाजिक सम्मान को सुदृढ़ आधार प्रदान करते हैं।`,
  };

  // ── 5B. 7th House Occupant Planet's Nakshatra Lord Mapping ─────────────────
  const sn1 = mi1.seventhHouseOccupantsNL;
  const sn2 = mi2.seventhHouseOccupantsNL;
  const seventhHouseNakshatraAudit: MasterMarriageReport["seventhHouseNakshatraAudit"] = {
    partner1: sn1,
    partner2: sn2,
    synthesisHinglish: `${p1Name}: ${sn1.synthesisHinglish} | ${p2Name}: ${sn2.synthesisHinglish}`,
  };

  // ── 6. Punarbu / Punarphoo Yoga Audit ───────────────────────────────────────
  const punarbuDetected = mi1.punarbuYoga.detected || mi2.punarbuYoga.detected;
  const punarbuWho = mi1.punarbuYoga.detected && mi2.punarbuYoga.detected
    ? "दोनों"
    : mi1.punarbuYoga.detected ? p1Name : p2Name;
  const punarbuCancelled = mi1.punarbuYoga.isCancelled || mi2.punarbuYoga.isCancelled || !punarbuDetected;
  const cancellationReason = mi1.punarbuYoga.cancellationFactors.concat(mi2.punarbuYoga.cancellationFactors).filter(Boolean).join(", ") ||
    (punarbuDetected ? "शुभ ग्रहों (बृहस्पति/शुक्र) के प्रभाव से यह योग नियंत्रित है।" : "कोई पुनर्भू दोष विद्यमान नहीं है।");

  const punarbuAudit: MasterMarriageReport["punarbuAudit"] = {
    partner1Detected: mi1.punarbuYoga.detected,
    partner2Detected: mi2.punarbuYoga.detected,
    isCancelled: punarbuCancelled,
    cancellationReason,
    psychologicalImpact: punarbuDetected
      ? `${punarbuWho} की कुंडली में शनि-चंद्र के प्रभाव से विवाह से पूर्व क्षणिक संशय या तारीख व निर्णय में गहन विचार-विमर्श हो सकता है, किंतु शुभ ग्रहों की दृष्टि से संबंध पूर्णतः सुरक्षित है।`
      : "कुंडलियों में कोई गंभीर पुनर्भू दोष सक्रिय नहीं है; निर्णय प्रक्रिया स्वाभाविक और स्पष्ट रहेगी।",
    remedy: punarbuDetected
      ? "सोमवार और शनिवार को भगवान शिव का दुग्धाभिषेक करें तथा शुद्ध चांदी के पात्र से जल ग्रहण करें।"
      : "नियमित कुलदेवता व इष्टदेव की आराधना से दांपत्य में सुख-शांति बनी रहेगी।",
  };

  // ── 7. Separative Influences & Geographic Directions ────────────────────────
  const hasBarren = mi1.barrenAudit.barrenPlacements.length > 0 || mi2.barrenAudit.barrenPlacements.length > 0;
  const barrenAlert = hasBarren
    ? `${p1Name} एवं ${p2Name} की कुंडलियों में कुछ ग्रह विश्लेषणात्मक व तार्किक राशियों में हैं, जो व्यावहारिकता प्रदान करते हैं; कुल वृद्धि के सामान्य शुभ योग हैं।`
    : "कोई प्रतिकूल बांझ राशि दोष नहीं है; संतान व कुल वृद्धि के अनुकूल योग हैं।";

  const separativeAndDirections: MasterMarriageReport["separativeAndDirections"] = {
    partner1SeparativeScore: mi1.separativeAudit.totalSeparativeScore,
    partner2SeparativeScore: mi2.separativeAudit.totalSeparativeScore,
    barrenSignAlert: barrenAlert,
    directionPartner1Seeking: `${mi1.marriageDirection.primaryDirectionHindi} (${mi1.marriageDirection.primaryDirection})`,
    directionPartner2Seeking: `${mi2.marriageDirection.primaryDirectionHindi} (${mi2.marriageDirection.primaryDirection})`,
    geographicAlignment: `दोनों के जन्म एवं निवास स्थल की दिशाएं (${mi1.marriageDirection.primaryDirectionHindi} एवं ${mi2.marriageDirection.primaryDirectionHindi}) शास्त्रीय दिशा-सिद्धांत से अनुकूल सामंजस्य दर्शाती हैं।`,
  };

  // ── 8. D1 to D9 Cross-Mapping ───────────────────────────────────────────────
  const d1ToD9Mapping: MasterMarriageReport["d1ToD9Mapping"] = {
    partner1Friction: mi1.d1ToD9Mapping.trikInD9.map(t => t.frictionDomain),
    partner1Prosperity: mi1.d1ToD9Mapping.wealthInD9.map(w => w.growthDomain),
    partner2Friction: mi2.d1ToD9Mapping.trikInD9.map(t => t.frictionDomain),
    partner2Prosperity: mi2.d1ToD9Mapping.wealthInD9.map(w => w.growthDomain),
    summary: "D1 के धन, कुटुम्ब एवं लाभ भावों की राशियां D9 के शुभ कोणों में संरेखित होकर विवाह उपरांत आर्थिक स्थिरता, संयुक्त उन्नति और सामाजिक प्रतिष्ठा को संबल देती हैं।",
  };

  // ── 9. Timing & Muhurat (Dynamic Transit Evaluation) ─────────────────────────
  const cond1 = detectConditionalDashas(chart1);
  const cond2 = detectConditionalDashas(chart2);

  const dynamicTiming = evaluateDynamicWeddingTiming(chart1, chart2, weddingDate);

  const timingAndMuhurat: MasterMarriageReport["timingAndMuhurat"] = {
    targetWeddingDate: weddingDate,
    isDoubleTransitActive: dynamicTiming.isDoubleTransitActive,
    timingScore: dynamicTiming.timingScore,
    moonTransitRoleO1: dynamicTiming.moonTransitRoleO1,
    conditionalDashasPartner1: cond1.filter(d => d.isApplicable),
    conditionalDashasPartner2: cond2.filter(d => d.isApplicable),
    timingVerdict: dynamicTiming.timingVerdict,
  };

  // ── 10. Practical Remedies ──────────────────────────────────────────────────
  const practicalRemedies: MarriageRemedyItem[] = [
    {
      category: "Universal",
      title: "शिवालय दुग्धाभिषेक (Lord Shiva Jalabhisheka)",
      procedure: "दोनों पक्ष सोमवार के दिन किसी प्रतिष्ठित शिवालय में जाकर शिवलिंग पर कच्चा दूध व शुद्ध जल अर्पित करें और 'ॐ नमः शिवाय' का 108 बार जाप करें।",
      caution: "घर के मंदिर में कभी भी प्राण-प्रतिष्ठित शिवलिंग न रखें।",
      astrologicalRationale: "भगवान शिव और माता पार्वती का आशीर्वाद 7वें भाव के सभी सूक्ष्म दोषों का शमन कर अखंड सौभाग्य प्रदान करता है।",
    },
    {
      category: "Moon",
      title: "शुद्ध चांदी का पात्र (Lunar Fortitude & Mental Peace)",
      procedure: `प्रतिदिन शुद्ध चांदी के गिलास अथवा पात्र से जल या दूध का सेवन करें।`,
      astrologicalRationale: "चंद्रमा और शनि के प्रभाव को संतुलित कर मानसिक शांति, सौहार्द और भावनात्मक स्थिरता को सुदृढ़ करता है।",
    },
    {
      category: "Venus",
      title: "पश्चिम-दक्षिण-पश्चिम (WSW) पुष्प वास्तु उपाय",
      procedure: "शयनकक्ष या घर के WSW कोने में हल्के सुगंधित ताजे पुष्प अथवा उनका सुंदर चित्र रखें और हल्की सुगंध का प्रयोग करें।",
      astrologicalRationale: "शुक्र के आकर्षण, प्रेम और वैवाहिक सौहार्द को चिरस्थायी बनाता है।",
    },
    {
      category: "Separative",
      title: "ईशान कोण (North-East) जल पात्र स्थापन",
      procedure: "घर के ईशान कोण को पूर्णतः स्वच्छ व हल्का रखें तथा वहां तांबे या पीतल के पात्र में ताजा जल स्थापित करें।",
      astrologicalRationale: "सूर्य व राहु-केतु के उग्र प्रभावों को शांत कर गृहस्थी में शीतलता एवं ईश्वरीय कृपा का संचार करता है।",
    },
  ];

  if (charityRemedy) {
    practicalRemedies.push({
      category: "Venus",
      title: "गरीब विवाह सहयोग दान (12th House Venus Shastra Upay)",
      procedure: charityRemedy,
      caution: "अहंकार रहित होकर गुप्त रूप से सहयोग करें।",
      astrologicalRationale: "गुरुजी के व्याख्यान का सूत्र: 12वें भाव से जुड़े शुक्र/तुला का दान करने से शयन सुख की रक्षा होती है और अनावश्यक खर्च व अस्पताल का भय कटता है।",
    });
  }

  // ── Executive Summaries ─────────────────────────────────────────────────────
  const weddingDateStr = weddingDate || "प्रस्तावित विवाह तिथि";
  const nadiStatus = nadiKoot && !nadiKoot.hasDosha ? "शून्य" : "न्यूनतम / परिहार समर्थित";

  const executiveSummaryHindi = `${p1Name} और ${p2Name} का अष्टकूट मिलान 36 में से ${ashtakootScore} गुण (${tierTitleHindi}) है, जिसमें नाड़ी दोष ${nadiStatus} है। मांगलिक स्तर पर ${p1Paap} vs ${p2Paap} अंक की ${mangalSamyam.balanceLevel} है। कालपुरुष की ७वीं राशि (तुला) दोनों के दांपत्य संतुलन को भाव ${k7p1.d1House} व ${k7p2.d1House} से जोड़ती है। नवांश (D9) में दोनों के लग्न ${axisRel} में स्थित हैं तथा 12वां भाव शयन-सुख स्तर ${overallH12 === "harmonious" ? "अनुकूल" : "सामान्य"} है। ${weddingDateStr} पर गोचर व दशा का प्रभाव संबंध को सकारात्मक संबल प्रदान करता है।`;

  const executiveSummaryEnglish = `${p1Name} and ${p2Name} possess an Ashtakoot compatibility of ${ashtakootScore} / 36 Gunas (${tierTitleHindi}) with ${nadiKoot && !nadiKoot.hasDosha ? "zero" : "remedied"} Nadi dosha. The Manglik paap balance is ${p1Paap} vs ${p2Paap} (${mangalSamyam.balanceLevel}). Kalpurush 7th sign (Libra) aligns with House ${k7p1.d1House} and ${k7p2.d1House}. In the D9 Navamsha, their ascendants form an auspicious ${axisRel} alignment with ${overallH12} 12th house dynamics. The transit alignment around ${weddingDateStr} supports long-term harmony and mutual prosperity.`;

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
    kalpurush7thAudit,
    d9NavamshaCrossAudit,
    kpDynamics,
    seventhHouseNakshatraAudit,
    punarbuAudit,
    separativeAndDirections,
    d1ToD9Mapping,
    timingAndMuhurat,
    practicalRemedies,
    executiveSummaryHindi,
    executiveSummaryEnglish,
  };
}
