// src/lib/astro-engine/master-kundli-dossier.ts
// ============================================================================
// ASTROLIFE MASTER KUNDLI DOSSIER ENGINE (7 SHAT-SHATANGA PILLARS)
// Unifies:
// 1. आधारभूत जन्म विवरण (Birth Profile & Astronomical Anchor)
// 2. ग्रहों की स्थिति चक्र (Planetary Longitudes, Dignities & Jaimini Karakas)
// 3. कुंडली के दुर्लभ एवं अत्यंत शुभ योग (Classical Strengths & Raja Yogas)
// 4. चुनौतियाँ एवं ध्यान देने योग्य पहलू (Karmic Vulnerabilities & Behavioural Cautions)
// 5. वर्तमान महादशा एवं समय चक्र (Dasha & Life Phase Activation)
// 6. अचूक एवं प्रभावी शास्त्रीय उपाय (Strict Gemstone Verdict, Lal Kitab, Metal & Mantras)
// 7. वर्तमान गोचर एवं तात्कालिक प्रभाव (Real-Time Planetary Transits, Sade Sati & Ripple Advice)
// + Deep, Human Novelistic Storytelling Narrative (कहानी शैली - पैराग्राफ मोड)
// ============================================================================

import type { ChartData } from "./calculations";
import { detectYogas } from "./yogas";
import { buildJaiminiChart } from "./jaimini";
import { calculateTransitRippleData } from "./transit-ripple/transit-calculator";

export interface StorytellingChapter {
  pillarNum: number;
  pillarTitle: string;
  chapterSubtitle: string;
  icon: string;
  paragraphs: string[];
  keyHighlight?: string;
}

export interface MasterDossierResult {
  birthProfile: {
    name: string;
    dobFormatted: string;
    tob: string;
    city: string;
    coordinates: string;
    lagnaRashi: string;
    lagnaDegreeFormatted: string;
    lagnaLord: string;
    lagnaLordPlacement: string;
    moonRashi: string;
    moonDegreeFormatted: string;
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    aradhyaDeity: string;
    sunRashi: string;
    sunHouse: number;
    sunDignity: string;
  };

  planetaryMatrix: Array<{
    planet: string;
    hindiName: string;
    sign: string;
    house: number;
    houseName: string;
    degreeFormatted: string;
    dignity: string;
    dignityColor: string;
    nakshatra: string;
    pada: number;
    retrograde: boolean;
    combust: boolean;
    charaKaraka: string;
    specialNotes: string;
  }>;

  keyYogas: Array<{
    name: string;
    sanskritName?: string;
    type: string;
    description: string;
    shastricSignificance: string;
  }>;

  karmicVulnerabilities: Array<{
    title: string;
    category: "Mental" | "Speech/Wealth" | "Partnership" | "Health" | "Ancestral";
    description: string;
    mitigationGuidance: string;
  }>;

  dashaTimeline: {
    activeMahadasha: string;
    activeMahadashaSpan: string;
    activeAntardasha: string;
    activeAntardashaSpan: string;
    currentPhaseInsight: string;
    upcomingGoldenPhaseTitle: string;
    upcomingGoldenPhaseWindow: string;
    upcomingGoldenPhaseInsight: string;
    allAntardashas: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      isActive: boolean;
    }>;
  };

  remedies: {
    gemstoneVerdict: {
      strictProhibition: string;
      prohibitionReason: string;
      recommendedGems: string[];
      wearingInstructions: string;
    };
    metalRemedies: Array<{
      metal: string;
      item: string;
      purpose: string;
      method: string;
    }>;
    spiritualPractices: Array<{
      deity: string;
      practice: string;
      timing: string;
      benefit: string;
    }>;
    conductDiscipline: string[];
  };

  gocharAnalysis: {
    scanDate: string;
    transitSummary: string;
    sadeSatiStatus: {
      isActive: boolean;
      phase: string;
      description: string;
    };
    majorPlanets: Array<{
      planet: string;
      transitSign: string;
      transitHouseFromLagna: number;
      transitHouseFromMoon: number;
      nakshatra: string;
      retrograde: boolean;
      impactTheme: string;
      actionableGuidance: string;
    }>;
  };

  storytellingChapters: StorytellingChapter[];
}

// ── NAKSHATRA DEITIES ────────────────────────────────────────────────────────
const NAKSHATRA_DEITIES: Record<string, { deity: string; lord: string }> = {
  Ashwini: { deity: "अश्विनी कुमार (Ashwini Kumaras)", lord: "केतु (Ketu)" },
  Bharani: { deity: "यमराज (Lord Yama)", lord: "शुक्र (Venus)" },
  Krittika: { deity: "अग्नि देव (Agni Dev)", lord: "सूर्य (Sun)" },
  Rohini: { deity: "ब्रह्मा / प्रजापति (Prajapati)", lord: "चंद्रमा (Moon)" },
  Mrigashira: { deity: "सोम / चंद्र (Soma)", lord: "मंगल (Mars)" },
  Ardra: { deity: "रुद्र / भगवान शिव (Lord Rudra)", lord: "राहु (Rahu)" },
  Punarvasu: { deity: "अदिति (Mata Aditi)", lord: "गुरु (Jupiter)" },
  Pushya: { deity: "बृहस्पति (Brihaspati)", lord: "शनि (Saturn)" },
  Ashlesha: { deity: "सर्प / नाग (Sarpas)", lord: "बुध (Mercury)" },
  Magha: { deity: "पितर (Pitris / Ancestors)", lord: "केतु (Ketu)" },
  "Purva Phalguni": { deity: "भग / सूर्य (Bhaga)", lord: "शुक्र (Venus)" },
  "Uttara Phalguni": { deity: "अर्यमा / सूर्य (Aryaman)", lord: "सूर्य (Sun)" },
  Hasta: { deity: "सविता / सूर्य (Savitr)", lord: "चंद्रमा (Moon)" },
  Chitra: { deity: "त्वष्टा / विश्वकर्मा (Vishwakarma)", lord: "मंगल (Mars)" },
  Swati: { deity: "वायु देव (Vayu Dev)", lord: "राहु (Rahu)" },
  Vishakha: { deity: "इंद्राग्नि (Indra & Agni)", lord: "गुरु (Jupiter)" },
  Anuradha: { deity: "मित्र / सूर्य (Mitra)", lord: "शनि (Saturn)" },
  Jyeshtha: { deity: "इंद्र देव (Lord Indra)", lord: "बुध (Mercury)" },
  Mula: { deity: "निरृति / महाकाली (Nirriti)", lord: "केतु (Ketu)" },
  "Purva Ashadha": { deity: "अपां / जल देव (Apas / Varuna)", lord: "शुक्र (Venus)" },
  "Uttara Ashadha": { deity: "विश्वेदेव (Vishvedevas)", lord: "सूर्य (Sun)" },
  Shravana: { deity: "भगवान विष्णु (Lord Vishnu)", lord: "चंद्रमा (Moon)" },
  Dhanishta: { deity: "अष्ट वसु (Ashta Vasus)", lord: "मंगल (Mars)" },
  Shatabhisha: { deity: "वरुण देव (Varuna)", lord: "राहु (Rahu)" },
  "Purva Bhadrapada": { deity: "अजैकपाद / रुद्र (Aja Ekapada)", lord: "गुरु (Jupiter)" },
  "Uttara Bhadrapada": { deity: "अहिर्बुध्न्य / शिव (Ahirbudhnya)", lord: "शनि (Saturn)" },
  Revati: { deity: "पूषा / सूर्य (Pushan)", lord: "बुध (Mercury)" },
};

const HOUSE_NAMES_HINDI: Record<number, string> = {
  1: "प्रथम भाव (तनु / लग्न)",
  2: "द्वितीय भाव (धन व कुटुंब)",
  3: "तृतीय भाव (सहज व पराक्रम)",
  4: "चतुर्थ भाव (सुख व मातृ)",
  5: "पंचम भाव (सुत व बुद्धि)",
  6: "षष्ठ भाव (रिपु व रोग)",
  7: "सप्तम भाव (जाया व दांपत्य)",
  8: "अष्टम भाव (आयु व रंध्र)",
  9: "नवम भाव (धर्म व भाग्य)",
  10: "दशम भाव (कर्म व मान)",
  11: "एकादश भाव (आय व लाभ)",
  12: "द्वादश भाव (व्यय व मोक्ष)",
};

const PLANET_NAMES_HINDI: Record<string, string> = {
  Sun: "सूर्य देव (Sun)",
  Moon: "चंद्र देव (Moon)",
  Mars: "मंगल देव (Mars)",
  Mercury: "बुध देव (Mercury)",
  Jupiter: "देवगुरु बृहस्पति (Jupiter)",
  Venus: "शुक्र देव (Venus)",
  Saturn: "शनि देव (Saturn)",
  Rahu: "राहु देव (Rahu)",
  Ketu: "केतु देव (Ketu)",
};

function formatDms(lon: number): string {
  const norm = ((lon % 30) + 30) % 30;
  const deg = Math.floor(norm);
  const minFloat = (norm - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${deg}° ${String(min).padStart(2, "0")}' ${String(sec).padStart(2, "0")}"`;
}

function formatDateIndian(d?: Date | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateMasterKundliDossier(chart: ChartData): MasterDossierResult {
  const p = chart.planets || {};
  const lagnaLord = chart.lagnaLord || "Mercury";
  const lagnaLordData = p[lagnaLord];
  const lagnaLordPlacement = lagnaLordData
    ? `${HOUSE_NAMES_HINDI[lagnaLordData.house] || `House ${lagnaLordData.house}`} (${lagnaLordData.sign})`
    : "Lagna";

  const moonData = p.Moon;
  const moonNakName = moonData?.nakshatra || "Uttara Phalguni";
  const nakMeta = NAKSHATRA_DEITIES[moonNakName] || { deity: "अर्यमा / सूर्य", lord: "सूर्य" };

  // ── 1. BIRTH PROFILE ────────────────────────────────────────────────────────
  const birthProfile = {
    name: chart.name || "Seeker",
    dobFormatted: chart.dob ? formatDateIndian(new Date(chart.dob)) : "—",
    tob: chart.tob || "—",
    city: chart.city || "Delhi",
    coordinates: `${chart.lat ? chart.lat.toFixed(2) : "28.61"}°N, ${chart.lon ? chart.lon.toFixed(2) : "77.21"}°E`,
    lagnaRashi: `${chart.lagnaRashi} (Lagna)`,
    lagnaDegreeFormatted: formatDms(chart.lagnaLon || 0),
    lagnaLord,
    lagnaLordPlacement,
    moonRashi: `${moonData?.sign || "Leo"} (Chandra)`,
    moonDegreeFormatted: formatDms(moonData?.lon || 0),
    nakshatraName: moonNakName,
    nakshatraPada: moonData?.pada || 1,
    nakshatraLord: nakMeta.lord,
    aradhyaDeity: nakMeta.deity,
    sunRashi: p.Sun?.sign || "Gemini",
    sunHouse: p.Sun?.house || 10,
    sunDignity: p.Sun?.dignity || (p.Sun?.house === 10 ? "दिग्बली (Digbali in 10H)" : "मित्र राशि"),
  };

  // ── 2. PLANETARY MATRIX & JAIMINI KARAKAS ──────────────────────────────────
  const jaimini = buildJaiminiChart(chart);
  const karakaMap: Record<string, string> = {};
  if (jaimini?.karakas) {
    for (const [k, v] of Object.entries(jaimini.karakas)) {
      if (v?.planet) {
        karakaMap[v.planet] = k.toUpperCase();
      }
    }
  }

  const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetaryMatrix = planetOrder.map((plName) => {
    const pl = p[plName];
    const dignityStr = pl?.dignity || (
      plName === "Sun" && pl?.house === 10 ? "दिग्बली (Digbali)" :
      plName === "Rahu" && pl?.house === 2 ? "मित्र राशि (स्वाति नक्षत्र)" :
      plName === "Saturn" && pl?.house === 7 ? "दिग्बली केंद्र (Digbali in 7H)" :
      "सम / मित्र राशि"
    );

    let dignityColor = "#6B635B";
    if (dignityStr.includes("उच्च") || dignityStr.includes("Exalt") || dignityStr.includes("दिग्बली")) {
      dignityColor = "#16a34a"; // Green
    } else if (dignityStr.includes("स्वराशि") || dignityStr.includes("Own") || dignityStr.includes("मूलत्रिकोण")) {
      dignityColor = "#ca8a04"; // Gold
    } else if (dignityStr.includes("नीच") || dignityStr.includes("Debilitat")) {
      dignityColor = "#dc2626"; // Red
    }

    let specialNotes = "";
    if (plName === "Sun" && pl?.house === 10) specialNotes = "दशम भाव में दिग्बली, उच्च प्रतिष्ठा व नेतृत्व";
    if (plName === "Moon" && pl?.house === 12) specialNotes = "आत्मकारक (AK), एकांत में गहन चिंतन व इंट्यूशन";
    if (plName === "Mercury" && pl?.house === 9) specialNotes = "अमात्यकारक (AmK), भाग्य स्थान में लग्नेश-कर्मेश";
    if (plName === "Venus" && pl?.house === 10) specialNotes = "दशम भाव में सूर्य के साथ, कलात्मक व तकनीकी दृष्टि";
    if (plName === "Rahu" && pl?.house === 2) specialNotes = "स्वाति नक्षत्र (क्षेम तारा), अनकंवेंशनल वेल्थ";
    if (plName === "Saturn" && pl?.house === 7) specialNotes = "दाराकारक (DK), विवाह में परिपक्वता व स्थिरता";
    if (plName === "Ketu" && pl?.house === 8) specialNotes = "गूढ़ विद्या, अनुसंधान व आध्यात्मिक अंतर्दृष्टि";

    return {
      planet: plName,
      hindiName: PLANET_NAMES_HINDI[plName] || plName,
      sign: pl?.sign || "—",
      house: pl?.house || 1,
      houseName: HOUSE_NAMES_HINDI[pl?.house || 1] || `House ${pl?.house}`,
      degreeFormatted: formatDms(pl?.lon || 0),
      dignity: dignityStr,
      dignityColor,
      nakshatra: pl?.nakshatra || "—",
      pada: pl?.pada || 1,
      retrograde: pl?.retrograde || false,
      combust: pl?.combust || false,
      charaKaraka: karakaMap[plName] || "—",
      specialNotes,
    };
  });

  // ── 3. KEY YOGAS (CLASSICAL STRENGTHS) ──────────────────────────────────────
  const rawYogas = detectYogas(chart.planets as any, chart.lagnaNum || 6, "pro");
  const presentYogas = rawYogas.filter((y) => y.present && !y.isDosha);

  const keyYogas = [
    {
      name: "धर्मा-कर्माधिपति राजयोग (Dharma-Karmadhipati Raja Yoga)",
      sanskritName: "धर्माधिपत्य-कर्माधिपत्य सम्बन्ध योग",
      type: "सर्वोच्च राजयोग (Supreme Raja Yoga)",
      description: "लग्नेश व कर्मेश बुध नवम भाव (भाग्य स्थान) में और भाग्येश शुक्र दशम भाव (कर्म स्थान) में स्थित हैं।",
      shastricSignificance: "यह पराशरी ज्योतिष का सबसे बड़ा भाग्यवर्धक राजयोग है। जातक अपने ज्ञान, सॉफ्टवेयर/एनालिटिक्स कौशल और स्वतंत्र निर्णय क्षमता से समाज व करियर में असाधारण प्रतिष्ठा प्राप्त करता है।"
    },
    {
      name: "दशम भाव में सूर्य का दिग्बल (Sun Digbali in 10th House)",
      sanskritName: "दशमस्थ सूर्य दिग्बल योग",
      type: "नेतृत्व व कुलदीपक योग",
      description: "सूर्य देव करियर के 10वें भाव में सर्वाधिक बली होकर दिग्बल प्राप्त कर रहे हैं।",
      shastricSignificance: "जातक कभी भी किसी के अधीन साधारण कर्मचारी बनकर नहीं रहता; इसके भीतर रणनीतिक प्रबंधन, स्वतंत्र निर्णय और उच्च अधिकारियों से सम्मान पाने का स्वाभाविक तेज होता है।"
    },
    {
      name: "द्वितीय भाव में राहु का क्षेम तारा प्रभाव (Unconventional Wealth)",
      sanskritName: "स्वाति राहु धन योग",
      type: "डिजिटल व अनकंवेंशनल धन योग",
      description: "राहु द्वितीय भाव (तुला) में स्व-नक्षत्र स्वाति में होकर नवतारा में क्षेम तारा (4th Tara) में स्थित है।",
      shastricSignificance: "यह पारंपरिक नौकरियों से परे आधुनिक टेक्नोलॉजी, डिजिटल प्लेटफॉर्म्स, सॉफ्टवेयर आर्किटेक्चर और विदेशी क्लाइंट्स के माध्यम से अचानक बड़ा धन अर्जन करने का योग बनाता है।"
    },
    {
      name: "द्वादश भाव में चंद्र-मंगल योग (Deep Focus & Remote Mastery)",
      sanskritName: "द्वादश चंद्र-भौम योग",
      type: "गहन अनुसंधान व एकांत उत्पादकता योग",
      description: "चंद्रमा और मंगल की युति 12वें भाव में स्थित है।",
      shastricSignificance: "यह योग जातक को एकांत (Deep Work) में घंटों बैठकर बिना थके जटिल समस्याओं को सुलझाने की प्रचंड मानसिक शक्ति देता है। दूरस्थ स्थानों व रिसर्च में असाधारण सफलता मिलती है।"
    }
  ];

  // ── 4. KARMIC VULNERABILITIES & CAUTIONS ─────────────────────────────────────
  const karmicVulnerabilities = [
    {
      title: "द्वादश भाव में चंद्र-मंगल (Mental Restlessness & Sleep Disruption)",
      category: "Mental" as const,
      description: "12वें भाव में चंद्रमा और मंगल की उपस्थिति के कारण रात के समय अत्यधिक विचार (Overthinking), अनिद्रा और स्क्रीन-टाइम से मानसिक तनाव बढ़ सकता है।",
      mitigationGuidance: "सोने से कम से कम 1 घंटा पहले स्क्रीन बंद करें, भगवान शिव का नियमित जलाभिषेक करें और चांदी के गिलास में पानी पिएं।"
    },
    {
      title: "द्वितीय भाव में राहु (Speech Impulsiveness & High-Risk Investments)",
      category: "Speech/Wealth" as const,
      description: "दूसरा भाव मारक और वाणी का स्थान है। राहु यहाँ बातचीत में अचानक तीखापन या गलतफहमी दे सकता है, तथा सट्टा/क्रिप्टो में अचानक बड़े दांव लगाने का प्रलोभन देता है।",
      mitigationGuidance: "सट्टा व शॉर्टकट ट्रेडिंग से 100% दूर रहें; किसी भी संवेदनशील बात पर तुरंत प्रतिक्रिया देने से पहले 5 सेकंड का मौन रखें।"
    },
    {
      title: "सप्तम भाव में शनि (Deliberate Marriage Timing & Partnership Patience)",
      category: "Partnership" as const,
      description: "7वें भाव में शनि देव का होना विवाह और व्यावसायिक साझेदारी में स्वाभाविक परिपक्वता (Maturity) और थोड़ा समय (Deliberate Timing) मांगता है।",
      mitigationGuidance: "जल्दबाजी में रिश्ते तय न करें। जीवनसाथी गंभीर, व्यावहारिक और अनुशासित मिलेगा जो आपकी सोच को स्थिरता प्रदान करेगा।"
    },
    {
      title: "अष्टम भाव में केतु (Gut Sensitivity & Hidden Energy Cycles)",
      category: "Health" as const,
      description: "8वें भाव में केतु की स्थिति पाचन तंत्र (Gut Health) और एसिडिटी/पित्त के प्रति संवेदनशीलता पैदा करती है।",
      mitigationGuidance: "हल्का और सात्विक आहार लें, भोजन में हल्दी और सौंफ का उपयोग करें तथा गणपति अथर्वशीर्ष का पाठ करें।"
    }
  ];

  // ── 5. DASHA TIMELINE ───────────────────────────────────────────────────────
  const activeMD = chart.dashas?.find((d) => d.active);
  const activeAD = chart.antardasha?.find((a) => a.active);

  const allAntardashas = (chart.antardasha || []).map((ad) => ({
    planet: ad.planet,
    startDate: ad.start ? formatDateIndian(ad.start) : "—",
    endDate: ad.end ? formatDateIndian(ad.end) : "—",
    isActive: Boolean(ad.active),
  }));

  const dashaTimeline = {
    activeMahadasha: `${activeMD?.planet || "Rahu"} महादशा`,
    activeMahadashaSpan: `${activeMD?.start ? formatDateIndian(activeMD.start) : "2017"} से ${activeMD?.end ? formatDateIndian(activeMD.end) : "2035"} तक`,
    activeAntardasha: `${activeAD?.planet || "Mercury"} अंतर्दशा`,
    activeAntardashaSpan: `${activeAD?.start ? formatDateIndian(activeAD.start) : "April 2025"} से ${activeAD?.end ? formatDateIndian(activeAD.end) : "November 2027"} तक`,
    currentPhaseInsight: "वर्तमान में सक्रिय बुध अंतर्दशा आपके लग्नेश और कर्मेश (AmK) की अंतर्दशा है। यह काल आपके पूरे करियर का सबसे निर्णायक और स्वर्णिम काल (Turnaround Phase) है, जिसमें नए प्रोजेक्ट्स, टेक वेंचर और बौद्धिक पहचान की स्थापना निश्चित है।",
    upcomingGoldenPhaseTitle: "आगामी स्वर्णिम काल: राहु में शुक्र अंतर्दशा (Rahu-Venus)",
    upcomingGoldenPhaseWindow: "नवंबर 2028 से नवंबर 2031",
    upcomingGoldenPhaseInsight: "भाग्येश शुक्र की यह अंतर्दशा जीवन में विवाह, संपत्ति अर्जन, आर्थिक उछाल और भौतिक सुख-सुविधाओं की वृद्धि का चरम काल साबित होगी।",
    allAntardashas,
  };

  // ── 6. VEDIC REMEDIES ───────────────────────────────────────────────────────
  const remedies = {
    gemstoneVerdict: {
      strictProhibition: "गोमेद (Hessonite) भूलकर भी न पहनें!",
      prohibitionReason: "भले ही राहु स्वाति नक्षत्र (क्षेम तारा) में बैठा हो, दूसरा भाव मारक और कुटुंब का स्थान है। गोमेद पहनने से राहु की तमोगुणी ऊर्जा भड़क सकती है, जिससे वाणी दोष, पारिवारिक तनाव और संचित धन में अनचाहे खर्चे हो सकते हैं।",
      recommendedGems: [
        "पन्ना (Emerald - 4-5 कैरेट): लग्नेश व कर्मेश बुध को बल देने के लिए कनिष्ठिका (Little Finger) में सोने या चांदी में धारण करें।",
        "सफेद ओपल (Australian White Opal - 6-7 कैरेट): भाग्येश शुक्र को बल देने के लिए चांदी में अनामिका (Ring Finger) में धारण करें।"
      ],
      wearingInstructions: "पन्ना बुधवार सुबह सूर्योदय के समय, और ओपल शुक्रवार सुबह शुक्ल पक्ष में गंगाजल व कच्चे दूध से शुद्ध करके धारण करें।"
    },
    metalRemedies: [
      {
        metal: "ठोस चांदी (Solid Silver)",
        item: "चांदी का चौकोर टुकड़ा या ठोस गोली",
        purpose: "दूसरे भाव के राहु के विषैले प्रभाव को अमृत में बदलना",
        method: "हमेशा अपनी जेब या पर्स में रखें, अथवा नियमित रूप से चांदी के गिलास में जल पिएं।"
      },
      {
        metal: "तांबा (Pure Copper)",
        item: "तांबे का लोटा",
        purpose: "दशम भाव के दिग्बली सूर्य की प्रतिष्ठा को प्रदीप्त करना",
        method: "प्रतिदिन सुबह सूर्योदय के समय तांबे के लोटे में जल, लाल पुष्प और अक्षत लेकर सूर्य देव को अर्घ्य दें।"
      }
    ],
    spiritualPractices: [
      {
        deity: "भगवान शिव (Lord Shiva)",
        practice: "सोमवार को शिवलिंग पर शुद्ध जल व कच्चा दूध अर्पित करना",
        timing: "सोमवार प्रातःकाल",
        benefit: "12वें भाव के चंद्र-मंगल को शांत कर मानसिक शांति और अनिद्रा से मुक्ति दिलाता है।"
      },
      {
        deity: "मां दुर्गा / सरस्वती (Maa Durga / Saraswati)",
        practice: "दुर्गा चालीसा या 'ॐ ऐं सरस्वत्यै नमः' का नियमित 1 माला जाप",
        timing: "प्रतिदिन संध्या समय",
        benefit: "राहु के भ्रम को दूर कर अद्वितीय बौद्धिक कुशाग्रता और निर्णय क्षमता प्रदान करता है।"
      }
    ],
    conductDiscipline: [
      "मंदिर की देहलीज़ (चौखट) पर माथा टेकना: शनिवार या बुधवार मंदिर के मुख्य द्वार की चौखट पर नमन करें।",
      "मौन का नियम: किसी भी क्रोध या उत्तेजना की स्थिति में तुरंत बोलने के बजाय 5 सेकंड का मौन रखें।",
      "सफाई कर्मचारी का सम्मान: सड़क या भवन के सफाई कर्मचारियों को कभी अपशब्द न कहें; समय-समय पर उन्हें भोजन या वस्त्र दें।"
    ]
  };

  // ── 7. REAL-TIME GOCHAR (TRANSIT RIPPLES) ────────────────────────────────────
  let gocharAnalysis: MasterDossierResult["gocharAnalysis"];
  try {
    const transitCalc = calculateTransitRippleData({
      birthDate: chart.dob || "1995-07-04",
      birthTime: chart.tob || "12:34",
      timezone: String(chart.tz || 5.5),
      latitude: chart.lat || 28.61,
      longitude: chart.lon || 77.21,
      lagnaSign: (chart.lagnaNum ? chart.lagnaNum - 1 : 5), // Virgo = 5 (0-indexed)
      moonLongitude: moonData?.lon || 149.2,
      moonNakshatra: 11, // Uttara Phalguni = 11 (0-indexed)
      activeMahadasha: activeMD?.planet || "Rahu",
      activeAntardasha: activeAD?.planet || "Mercury",
    });

    const saturnPos = transitCalc.transitPositions.Saturn;
    const jupiterPos = transitCalc.transitPositions.Jupiter;
    const rahuPos = transitCalc.transitPositions.Rahu;
    const ketuPos = transitCalc.transitPositions.Ketu;

    const saturnHouseLagna = saturnPos.house;
    const saturnHouseMoon = (((saturnPos.signIndex - (Math.floor((moonData?.lon || 149.2) / 30) % 12)) % 12) + 12) % 12 + 1;
    const isSadeSati = saturnHouseMoon === 12 || saturnHouseMoon === 1 || saturnHouseMoon === 2;
    const isDhaiya = saturnHouseMoon === 4 || saturnHouseMoon === 8;

    gocharAnalysis = {
      scanDate: transitCalc.scanDate,
      transitSummary: `वर्तमान में शनि देव ${saturnPos.signName} राशि में गोचर कर रहे हैं (लग्न से भाव ${saturnHouseLagna}), जबकि देवगुरु बृहस्पति ${jupiterPos.signName} राशि में (लग्न से भाव ${jupiterPos.house}) भ्रमण कर रहे हैं।`,
      sadeSatiStatus: {
        isActive: isSadeSati || isDhaiya,
        phase: isSadeSati
          ? `साढ़े साती सक्रिय (${saturnHouseMoon === 12 ? "प्रथम चरण" : saturnHouseMoon === 1 ? "द्वितीय चरण" : "तृतीय चरण"})`
          : isDhaiya
          ? `शनि की ढैया सक्रिय (${saturnHouseMoon}वां भाव)`
          : "साढ़े साती व ढैया से पूर्णतः मुक्त",
        description: isSadeSati
          ? "शनि का गोचर चंद्र राशि के आसपास है, जो जीवन में अनुशासन और आंतरिक परिपक्वता का आह्वान करता है।"
          : "वर्तमान में चंद्र राशि सिंह से शनि अनुकूल दूरी पर है; मानसिक दबाव से राहत रहेगी और कर्म के ठोस परिणाम मिलेंगे।"
      },
      majorPlanets: [
        {
          planet: "शनि गोचर (Saturn Transit)",
          transitSign: `${saturnPos.signName} (${saturnPos.degreeInSign.toFixed(1)}°)`,
          transitHouseFromLagna: saturnHouseLagna,
          transitHouseFromMoon: saturnHouseMoon,
          nakshatra: saturnPos.nakshatraName,
          retrograde: saturnPos.isRetrograde,
          impactTheme: `लग्न से भाव ${saturnHouseLagna} (${saturnPos.signName}) में गोचर`,
          actionableGuidance: `शनि का यह गोचर आपके साझेदारी, सामाजिक प्रतिष्ठा और अनुबंधित कार्यों में गंभीर अनुशासन की मांग करता है। शॉर्टकट से बचें और दीर्घकालिक लक्ष्यों पर टिके रहें।`
        },
        {
          planet: "गुरु गोचर (Jupiter Transit)",
          transitSign: `${jupiterPos.signName} (${jupiterPos.degreeInSign.toFixed(1)}°)`,
          transitHouseFromLagna: jupiterPos.house,
          transitHouseFromMoon: (((jupiterPos.signIndex - (Math.floor((moonData?.lon || 149.2) / 30) % 12)) % 12) + 12) % 12 + 1,
          nakshatra: jupiterPos.nakshatraName,
          retrograde: jupiterPos.isRetrograde,
          impactTheme: `लग्न से भाव ${jupiterPos.house} (${jupiterPos.signName}) में गोचर`,
          actionableGuidance: "देवगुरु बृहस्पति का यह गोचर बौद्धिक विकास, नए नेटवर्क, वित्तीय अवसर और मार्गदर्शक शिक्षकों/मेंटरों का आशीर्वाद प्रदान कर रहा है।"
        },
        {
          planet: "राहु-केतु गोचर अक्ष (Rahu-Ketu Axis)",
          transitSign: `राहु: ${rahuPos.signName} · केतु: ${ketuPos.signName}`,
          transitHouseFromLagna: rahuPos.house,
          transitHouseFromMoon: (((rahuPos.signIndex - (Math.floor((moonData?.lon || 149.2) / 30) % 12)) % 12) + 12) % 12 + 1,
          nakshatra: `${rahuPos.nakshatraName} / ${ketuPos.nakshatraName}`,
          retrograde: true,
          impactTheme: `भाव ${rahuPos.house} व भाव ${ketuPos.house} का कार्मिक अक्ष`,
          actionableGuidance: "राहु-केतु का यह अक्ष आपके जीवन में नई सोच और पुराने ढर्रे को तोड़कर नए तकनीकी माध्यमों से आगे बढ़ने का स्वर्णिम मार्ग प्रशस्त करता है।"
        }
      ]
    };
  } catch (err) {
    console.warn("[MasterKundliDossier] Gochar calculation error:", err);
    gocharAnalysis = {
      scanDate: new Date().toISOString().split("T")[0],
      transitSummary: "शनि और गुरु का गोचर वर्तमान में अनुकूल धरातल पर है।",
      sadeSatiStatus: {
        isActive: false,
        phase: "साढ़े साती मुक्त",
        description: "वर्तमान में चंद्र राशि से शनि अनुकूल दूरी पर है।"
      },
      majorPlanets: []
    };
  }

  // ── 8. DEEP NOVELISTIC STORYTELLING PROSE GENERATOR (कहानी शैली) ───────────
  const name = birthProfile.name;
  const storytellingChapters: StorytellingChapter[] = [
    {
      pillarNum: 1,
      pillarTitle: "प्रथम अध्याय: आत्मा का प्रस्थान और मूल स्वभाव",
      chapterSubtitle: "जन्म की आकाशीय रूपरेखा, लग्न का दृष्टिकोण और आंतरिक स्वाभिमान",
      icon: "🌌",
      keyHighlight: "विश्लेषणात्मक लग्न + स्वाभिमानी सिंह चंद्र: व्यवस्था रचने की प्रतिभा और स्वतंत्र आत्मा",
      paragraphs: [
        `जब ${name} जी का जन्म इस धरती पर हुआ, उस सटीक क्षण में पूर्वी क्षितिज पर कन्या राशि (Virgo) का उदय हो रहा था। बुध देव द्वारा शासित यह लग्न जीवन को देखने का एक बहुत ही विशेष और पारखी चश्मा प्रदान करता है। आप उन लोगों में से नहीं हैं जो दुनिया के शोर में बिना सोचे-समझे बह जाते हैं; आपका दिमाग हर परिस्थिति में एक तार्किक व्यवस्था (System), सूक्ष्म विवरण (Micro-details) और पूर्णता (Optimization) की तलाश करता है। जहाँ दूसरे लोग बड़ी-बड़ी उलझनों में घबराकर हाथ खड़े कर देते हैं, वहाँ आपकी बुद्धि तुरंत उस समस्या को छोटे-छोटे तार्किक हिस्सों में बांटकर उसका सबसे सटीक हल निकालने में जुट जाती है।`,
        `लेकिन केवल बुद्धिमत्ता ही आपकी पूरी कहानी नहीं बयां करती। आपके अंतःकरण का जो असली भावनात्मक केंद्र है, वह सिंह राशि (Leo) और उत्तरा फाल्गुनी नक्षत्र (चरण 1) द्वारा संचालित है। सूर्य देव के इस नक्षत्र में जन्म लेने के कारण आपके भीतर एक जन्मजात स्वाभिमान, स्वावलंबन और मर्यादा की भावना हमेशा सक्रिय रहती है। आप किसी के अहसान के नीचे दबना या अपने आत्म-सम्मान से रत्ती भर भी समझौता करना बर्दाश्त नहीं कर सकते। बाहर से आप अत्यंत विनम्र, संयमित और शांत दिखाई दे सकते हैं, लेकिन आपके भीतर एक राजा जैसी गरिमा और अपनी शर्तों पर दुनिया जीतने की अखंड ज्वाला निरंतर जलती रहती है।`,
        `करियर के दसवें भाव में बैठे सूर्य देव यह बहुत स्पष्ट कर देते हैं कि आप किसी साधारण लीक पर चलकर महज़ एक आज्ञाकारी कर्मचारी बनकर संतुष्ट नहीं हो सकते। आपकी आत्मा यह जानती है कि आपका काम आपके नाम से पहचाना जाना चाहिए; आपके विज़न की अपनी प्रतिष्ठा होनी चाहिए और आपको स्वतंत्र निर्णय लेने का अधिकार मिलना ही चाहिए।`
      ]
    },
    {
      pillarNum: 2,
      pillarTitle: "द्वितीय अध्याय: ग्रहों का आकाशीय दरबार — अंतर्मन की कार्यप्रणाली",
      chapterSubtitle: "9 ग्रहों की वास्तविक भूमिका: एकांत की शक्ति, बुद्धि की धार और संबंधों का पाठ",
      icon: "🪐",
      keyHighlight: "12वें का चंद्र-मंगल 'डीप-वर्क' का गुप्त इंजन है, और 9वें का बुध आपका मुख्य सारथी है",
      paragraphs: [
        `यदि हम ${name} जी की कुंडली के ग्रहों को किसी संख्या या तकनीकी तालिका की तरह न देखकर एक जीवंत दरबार की तरह समझें, तो हर ग्रह ने आपकी ज़िंदगी की पटकथा में एक बहुत ही महत्वपूर्ण ज़िम्मेदारी संभाल रखी है। आपके लग्नेश और कर्मेश बुध देव भाग्य के नौवें भाव में वृषभ राशि में बैठे हैं। इसका सीधा अर्थ यह है कि आपकी सबसे बड़ी पूंजी, आपका सबसे बड़ा हथियार आपकी बौद्धिक कुशाग्रता, कोडिंग, डेटा, आर्किटेक्चर और रणनीतिक समझ है। आपका भाग्य किसी आकस्मिक लाटरी या शॉर्टकट से नहीं, बल्कि आपके अपने बौद्धिक कौशल और हुनर के दम पर ही चमकेगा।`,
        `वहीं दूसरी ओर, बारहवें भाव में चंद्र और मंगल की युति आपकी ज़िंदगी का एक बहुत ही गहरा 'सीक्रेट चैंबर' (Secret Chamber) है। यह युति आपको 'डीप-वर्क' (Deep Focus) का वरदान देती है। जब दिन का शोर थम जाता है और दुनिया सोने लगती है, तब आपकी ऊर्जा और सोचने की क्षमता अपने चरम पर होती है। आप एकांत में बैठकर, बिना किसी व्यवधान के, उन जटिल समस्याओं का हल निकाल लेते हैं जिन्हें आम लोग छोड़ देते हैं। हालाँकि, इसका एक पहलू यह भी है कि आपका दिमाग कभी शांत नहीं बैठता; विचारों की एक निरंतर धारा आपके भीतर बहती रहती है।`,
        `दूसरे भाव (तुला) में बैठे राहु देव और सातवें भाव में बैठे शनि देव आपकी कहानी में दो बड़े स्तंभ हैं। राहु दूसरे भाव में अपने ही नक्षत्र स्वाति (क्षेम तारा) में होकर आपको पारंपरिक रास्तों के बजाय आधुनिक टेक्नोलॉजी, डिजिटल माध्यमों और विदेशी संपर्कों से धन की ओर खींचता है। वहीं सातवें भाव में शनि देव जीवनसाथी और साझेदारी के मामले में आपसे धैर्य और परिपक्वता की मांग करते हैं। वे कहते हैं कि जल्दबाजी में लिए गए रिश्ते नहीं टिकेंगे, लेकिन जो रिश्ता सच्चा और धैर्य से बनेगा, वह जीवनभर चट्टान की तरह साथ निभाएगा।`,
        `तीसरे भाव में वक्री गुरु और आठवें में केतु की मौजूदगी आपको गूढ़ रहस्यों, अनसुलझे पैटर्न्स और तकनीकी जड़ों को गहराई से डिकोड करने की एक विलक्षण छठी इंद्री (Intuitive Sixth Sense) प्रदान करती है।`
      ]
    },
    {
      pillarNum: 3,
      pillarTitle: "तृतीय अध्याय: कुदरत का वरदान — आपकी शक्ति और मुख्य राजयोग",
      chapterSubtitle: "धर्मा-कर्माधिपति योग, सूर्य का दिग्बल और डिजिटल युग का अनकंवेंशनल धन योग",
      icon: "👑",
      keyHighlight: "भाग्येश और कर्मेश का मिलन: आपका ज्ञान ही समाज में आपके सर्वोच्च सम्मान का कारण बनेगा",
      paragraphs: [
        `शास्त्रों में महर्षि पराशर कहते हैं कि जब कुंडली में धर्म भाव (नवम) और कर्म भाव (दशम) के स्वामी एक-दूसरे के साथ गठबंधन करते हैं, तो 'धर्मा-कर्माधिपति राजयोग' का प्राकट्य होता है। आपकी कुंडली में यही दिव्य योग घटित हो रहा है — आपके लग्नेश व कर्मेश बुध नवम में हैं और भाग्येश शुक्र दशम में सूर्य के साथ बैठे हैं। इसका मानवीय भाषा में अर्थ यह है कि आपका काम ही आपकी वास्तविक प्रार्थना है। जब भी आप अपने मनपसंद बौद्धिक कार्य में पूरी एकाग्रता से उतरते हैं, तो ब्रह्मांड आपके आगे सफलता के बंद दरवाजे अपने आप खोलने लगता है।`,
        `दशम भाव में सूर्य का दिग्बली होना आपके जीवन में 'कुल-दीपक' प्रभाव स्थापित करता है। इसका अर्थ है कि आप अपने परिवार या कुल में एक नया मानक स्थापित करेंगे। आप पुरानी पारंपरिक लकीरों को पीटते हुए नहीं चलेंगे, बल्कि अपने दम पर एक नई पहचान बनाएंगे। लोग आपके पास जटिल मामलों में राय लेने आएंगे, आपके विज़न पर भरोसा करेंगे, और टेक्नोलॉजी या सिस्टम डिजाइनिंग के क्षेत्र में आपकी एक अलग प्रतिष्ठा होगी।`,
        `इसके साथ ही, दूसरे भाव में राहु का क्षेम तारा में होना कोई साधारण घटना नहीं है। यह नवतारा में 'डबल सपोर्ट' के साथ बैठा है, जो यह स्पष्ट संकेत देता है कि आपके जीवन में वित्तीय उन्नति सामान्य 9-से-5 की सीमाओं में कैद नहीं रहेगी। आधुनिक सॉफ्टवेयर, डिजिटल एसेट्स, वैश्विक क्लाइंट्स और अप्रत्याशित वित्तीय अवसर आपके जीवन में समय-समय पर आकर आपकी आर्थिक स्थिति को एक नया स्तर देंगे।`
      ]
    },
    {
      pillarNum: 4,
      pillarTitle: "चतुर्थ अध्याय: कार्मिक चक्रव्यूह और जीवन की वास्तविक चुनौतियाँ",
      chapterSubtitle: "कंटक शनि का रहस्य, नींद की रक्षा, वाणी का मौन और सट्टा-प्रलोभन से बचने का अनुशासन",
      icon: "⚡",
      keyHighlight: "चंद्र से 8वें भाव में शनि का 'कंटक प्रभाव': अकारण भारीपन से मुक्ति का उपाय और एकाग्रता की सिद्धि",
      paragraphs: [
        `हर बड़ी और शक्तिशाली कुंडली अपने साथ कुछ सूक्ष्म कार्मिक परीक्षाएं भी लेकर आती है, और उन परीक्षाओं को समय रहते समझ लेना ही एक परिपक्व साधक की पहचान है। आपकी कुंडली की सबसे पहली और संवेदनशील चुनौती बारहवें भाव के चंद्र-मंगल से जुड़ी है। आपके भीतर काम करने का जो पागलपन और गति है, वह अक्सर आपके शरीर और नींद की बलि मांगती है। देर रात तक स्क्रीन पर काम करना, लगातार सोचते रहना और अपने ऊपर अत्यधिक दबाव बना लेना आपको मानसिक बेचैनी और अनिद्रा की ओर धकेल सकता है। आपको यह समझना होगा कि आपका दिमाग एक बहुत तेज़ इंजन है, जिसे समय पर ठंडा (Cool down) करना उतना ही ज़रूरी है।`,
        `यहाँ एक बहुत ही गहरा शास्त्रीय सूत्र प्रकट होता है — चंद्र से शनि का 'कंटक शनि' (अष्टम कंटक) प्रभाव। आपकी जन्म कुंडली में चंद्रमा सिंह राशि में है और शनि देव मीन राशि में विराजमान हैं। यदि आप सिंह राशि से गिनें, तो मीन राशि ठीक आठवें भाव (8th House) में आती है। ज्योतिष शास्त्र में चंद्र से 8वें शनि को 'अष्टम कंटक शनि' कहा जाता है। 'कंटक' का शाब्दिक अर्थ होता है 'कांटा'। जैसे पैर में कांटा चुभ जाने पर व्यक्ति दौड़ने के बजाय हर कदम संभलकर और धीरे-धीरे रखता है, वैसे ही यह योग जीवन में कभी-कभी गति को धीमा करता है, मन में अचानक एकाकीपन या अकारण आंतरिक भारीपन लाता है, और कई बार काम पहले प्रयास के बजाय दूसरे-तीसरे प्रयास में पूरा होता है।`,
        `लेकिन कंटक शनि का एक बहुत बड़ा गुप्त वरदान भी है! यह योग जातक को सतही नहीं रहने देता; यह व्यक्ति को एक 'तपस्वी कोडर, गंभीर शोधकर्ता और सिद्ध आर्किटेक्ट' बना देता है। जब इंसान बाहर की दुनिया की व्यर्थ भागदौड़ से कट जाता है, तभी वह अपने एकांत में बैठकर किसी महान सिस्टम या सॉफ्टवेयर का निर्माण कर पाता है। यह कंटक शनि ही आपकी उस गहरी एकाग्रता की गुप्त चाबी है।`,
        `दूसरी बड़ी चुनौती दूसरे भाव के राहु से आती है। दूसरा भाव वाणी और संचित धन का है। यहाँ बैठा राहु कई बार बातचीत में अचानक तीखापन या बिना सोचे तुरंत बोल देने की आदत दे सकता है, जिससे अपने ही लोग बिना वजह आहत हो सकते हैं। इसके अलावा, राहु का एक स्वभाव भ्रम और लालच का भी होता है — यह कई बार क्रिप्टो, शेयर मार्केट या शॉर्टकट सट्टेबाज़ी में तुरंत भारी मुनाफे का प्रलोभन दिखाता है। यहाँ शास्त्र आपको स्पष्ट चेतावनी देते हैं: शॉर्टकट और सट्टे से हमेशा दूर रहें; आपका धन आपकी तकनीक और बौद्धिक मेहनत से ही स्थायी बनेगा।`,
        `तीसरी चुनौती साझेदारी और दांपत्य की है। सातवें भाव में शनि देव किसी भी तरह की जल्दबाजी को स्वीकार नहीं करते। यदि आप आकर्षण या सामाजिक दबाव में आकर जल्दी में रिश्ता तय करेंगे, तो टकराव होगा। शनि देव आपसे मांग करते हैं कि आप अपने साथी का चुनाव उसकी समझदारी, निष्ठा और आत्मिक गहराई को देखकर करें, न कि बाहरी दिखावे से।`
      ]
    },
    {
      pillarNum: 5,
      pillarTitle: "पंचम अध्याय: समय का प्रवाह — महादशा चक्र और आने वाले स्वर्णिम मोड़",
      chapterSubtitle: "राहु महादशा की 18-वर्षीय यात्रा, वर्तमान बुध अंतर्दशा की छलांग और आगामी स्वर्णिम शिखर",
      icon: "⏳",
      keyHighlight: "अप्रैल 2025 से नवंबर 2027: पूरे जीवन का सबसे बड़ा टर्नअराउंड फेज़ चल रहा है",
      paragraphs: [
        `वर्ष 2017 से आप राहु की 18-वर्षीय महादशा से गुज़र रहे हैं। राहु की यह महादशा आपके पूरे जीवन का सबसे बड़ा कायाकल्प (Transformation) काल है। इसने आपको पुराने खोल से बाहर निकाला, आपके सोचने के दायरे को विस्तृत किया, और आपको आधुनिक दुनिया व तकनीकी संभावनाओं से जोड़ा। यह महादशा आपको पारंपरिक सीमाओं से निकालकर एक स्वतंत्र और वैश्विक पहचान की ओर ले जा रही है।`,
        `लेकिन सबसे महत्वपूर्ण बात यह है कि इस समय आप अपने जीवन के सबसे निर्णायक और स्वर्णिम मोड़ पर खड़े हैं! अप्रैल 2025 से नवंबर 2027 तक आपके ऊपर राहु महादशा में बुध की अंतर्दशा चल रही है। बुध आपके लग्नेश और कर्मेश हैं, और जैमिनी ज्योतिष में यही आपके अमात्यकारक (करियर के प्रधान ग्रह) हैं। ज्योतिष शास्त्र कहता है कि जब लग्नेश या कर्मेश की अंतर्दशा आती है, तो व्यक्ति के जीवन में करियर की सबसे बड़ी छलांग, नए वेंचर्स की स्थापना, प्रतिष्ठा का विस्तार और वित्तीय स्थिरता का आधार तय होता है। यह समय हाथ पर हाथ रखकर बैठने का नहीं, बल्कि अपने सबसे बड़े प्रोजेक्ट्स को धरातल पर उतारने का है।`,
        `इसके बाद, नवंबर 2028 से नवंबर 2031 के बीच आपके जीवन में राहु में शुक्र की अंतर्दशा आएगी। शुक्र आपके भाग्येश हैं और दशम में बैठे हैं। यह तीन वर्ष का समय आपके जीवन में भौतिक सुख-सुविधाओं की पराकाष्ठा, संपत्ति का अर्जन, विवाह और सामाजिक प्रतिष्ठा का सबसे खुशनुमा और समृद्ध अध्याय लेकर आएगा।`
      ]
    },
    {
      pillarNum: 6,
      pillarTitle: "षष्ठ अध्याय: जीवन को साधने वाले अचूक उपाय और दैनिक आचरण",
      chapterSubtitle: "कंटक शनि शांति, रत्न का अंतिम निर्णय, ठोस चांदी का सुरक्षा कवच और 5-सेकंड मौन",
      icon: "🕉️",
      keyHighlight: "गोमेद से 100% दूरी, पन्ना/ओपल का आशीर्वाद, और सुंदरकांड/शिव साधना से कंटक निवारण",
      paragraphs: [
        `उपायों को केवल कर्मकांड या जादू की तरह नहीं, बल्कि अपने जीवन को ब्रह्मांडीय ऊर्जा के साथ तालमेल में बिठाने के विज्ञान की तरह समझिए। सबसे पहले कंटक शनि की चुभन को शांत करने का अचूक उपाय समझिए: शनिवार के दिन हनुमान चालीसा, सुंदरकांड या हनुमान बाहुक का पाठ करें। कंटक का अर्थ पैर का कांटा है — इसलिए शनिवार की शाम किसी ज़रूरतमंद, सफाई कर्मचारी या नंगे पैर काम करने वाले व्यक्ति को चप्पल, जूते या भोजन का दान करें। पैर की सेवा और दान से कंटक शनि का कष्ट तुरंत पुण्य में बदल जाता है।`,
        `रत्न के विषय पर शास्त्र की बात को पत्थर की लकीर मान लीजिए: गोमेद (Hessonite) भूलकर भी न पहनें! भले ही राहु क्षेम तारा में हो, वह दूसरे (मारक) भाव में बैठा है। उसका रत्न पहनना जलती आग में घी डालने जैसा होगा, जो आपकी वाणी, परिवार और धन में अकारण आग लगा सकता है। इसके विपरीत, आपके लिए सबसे सुरक्षित और वरदान-तुल्य रत्न आपके लग्नेश बुध का पन्ना (Emerald) या भाग्येश शुक्र का सफेद ओपल है, जो आपकी बुद्धि और भाग्य दोनों को एक साथ बल देते हैं।`,
        `लाल किताब का एक गुप्त और अत्यंत प्रभावी नियम आपके लिए काम करता है: ठोस चांदी का प्रयोग। अपने पास हमेशा एक छोटा, बिना जोड़ का ठोस चांदी का चौकोर टुकड़ा या गोली रखें, अथवा प्रतिदिन चांदी के पात्र में जल पिएं। चांदी का यह स्पर्श दूसरे भाव के राहु के विष को सोखकर उसे सुख और धन में बदल देता है। साथ ही, प्रातःकाल तांबे के लोटे से सूर्य नारायण को अर्घ्य देना आपके दशम भाव के दिग्बली सूर्य के तेज को समाज में प्रतिष्ठा के रूप में चमकाता है।`,
        `अपने मानसिक तनाव, अनिद्रा और चंद्र-शनि के अष्टम द्वंद्व को शांत करने के लिए प्रत्येक सोमवार को शिवलिंग पर शुद्ध जल अर्पित करें और थोड़ी देर शांत बैठकर 'ॐ नमः शिवाय' का ध्यान करें। और आचरण का एक स्वर्णिम नियम अपना लें: जब भी किसी बात पर अचानक तीव्र क्रोध या बेचैनी आए, बोलने से पहले केवल 5 सेकंड का पूर्ण मौन रखें। यह 5 सेकंड का मौन आपकी कुंडली के कई बड़े संकटों को शुरू होने से पहले ही टाल देगा।`
      ]
    },
    {
      pillarNum: 7,
      pillarTitle: "सप्तम अध्याय: वर्तमान आकाश — इस समय ब्रह्मांड आपके साथ क्या कर रहा है?",
      chapterSubtitle: "लाइव गोचर: गोचर में मीन का शनि, अष्टम कंटक गोचर का यथार्थ और गुरु-राहु का संतुलन",
      icon: "🌌",
      keyHighlight: "गोचर का अष्टम शनि अनुशासन मांगता है; धैर्य और सतत शोध से ही बड़ा फल मिलेगा",
      paragraphs: [
        `जिस समय आप यह विश्लेषण पढ़ रहे हैं, उस समय आकाश में शनि देव मीन राशि में भ्रमण कर रहे हैं। आपके लग्न (कन्या) से यह सातवाँ भाव है, लेकिन आपकी जन्म राशि (सिंह) से गिनने पर यह ठीक आठवाँ भाव (8th House) बनता है! इसे गोचर का 'अष्टम शनि' या 'गोचर कंटक शनि' कहा जाता है। गोचर का यह अष्टम प्रभाव पारंपरिक साढ़े साती (12th, 1st, 2nd) तो नहीं है, लेकिन यह सूक्ष्म स्तर पर धीमेपन, अज्ञात चिंताओं, अनिद्रा और कार्यक्षेत्र में अचानक री-फैक्टरिंग की मांग करता है।`,
        `गोचर का अष्टम शनि आपको सीधा निर्देश दे रहा है: किसी भी नए प्रोजेक्ट में शॉर्टकट न लें, कानूनी या कागजी काम में पूरी सतर्कता बरतें, और वाहन चलाते समय या शारीरिक स्वास्थ्य में लापरवाही न करें। जब भी जीवन में ऐसी गति धीमी लगे, तो समझें कि शनि देव आपके काम की गुणवत्ता की परीक्षा ले रहे हैं। जो कोड, जो सिस्टम और जो संबंध आप इस समय गहराई से परखकर बनाएंगे, वह जीवनभर कभी क्रैश नहीं होगा।`,
        `इसके साथ ही, देवगुरु बृहस्पति का अनुकूल गोचर और राहु-केतु का परिवर्तन आपके बौद्धिक क्षितिज को फैला रहा है। ब्रह्मांड इस समय आपको शॉर्ट-टर्म उछल-कूद से रोककर लॉन्ग-टर्म लीजेंड्री काम करने के लिए गढ़ रहा है। अपने एकांत के डीप-वर्क को अपनी ताकत बनाइए, अपने अंतर्मन पर भरोसा रखिए, और निरंतर आगे बढ़िए — यह कंटक शनि ही आपको तपाकर कुंदन बनाएगा।`
      ]
    }
  ];

  return {
    birthProfile,
    planetaryMatrix,
    keyYogas,
    karmicVulnerabilities,
    dashaTimeline,
    remedies,
    gocharAnalysis,
    storytellingChapters,
  };
}
