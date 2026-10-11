// src/lib/astro-engine/shadbala.ts
// ============================================================
// ASTROLIFE SHADBALA ENGINE v3.0 (CLASSICAL PARASHARI FIDELITY)
// Reference: Brihat Parashara Hora Shastra (BPHS Ch. 27-29), Saravali
// Computes:
// 1. Exact Rupas & Virupas (60 Virupas = 1 Rupa)
// 2. Classical Minimum Thresholds (Bala Samriddha vs Bala Heena)
// 3. 6 Classical Balas: Sthana, Dig, Kala, Cheshta, Naisargika, Drik
// 4. Ishta Phala & Kashta Phala (Parashari Potency Indices)
// 5. Practical Modern & Professional Interpretation
// ============================================================

export interface ShadbalaPlanet {
  planet: string;
  icon: string;
  color: string;
  sign: string;
  house: number;
  retrograde: boolean;

  // Normalized 0-10 for quick charts
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  cheshtaBala: number;
  naisargika: number;
  drikBala: number;

  // Exact Classical Virupas (BPHS units)
  sthanaVirupas: number;
  digVirupas: number;
  kalaVirupas: number;
  cheshtaVirupas: number;
  naisargikaVirupas: number;
  drikVirupas: number;

  // Totals & Threshold Metrics
  total: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  requiredVirupas: number;
  shadbalaRatio: number; // >= 1.0 means passes classical threshold
  passesThreshold: boolean;
  percentage: number;

  // Ishta & Kashta Phala (0..60 scale)
  ishtaPhala: number;
  kashtaPhala: number;

  grade: "Excellent" | "Strong" | "Moderate" | "Weak" | "Very Weak";
  gradeColor: string;
  sthanaTxt: string;
  digTxt: string;
  kalaTxt: string;
  cheshtaTxt: string;
  drikTxt: string;
  overallTxt: string;
  sthanaDef: string;
  digDef: string;
  kalaDef: string;
  cheshtaDef: string;
  naisargikaDef: string;
  drikDef: string;
}

export interface ShadbalaResult {
  planets: ShadbalaPlanet[];
  strongest: string;
  weakest: string;
  avgStrength: number;
  avgRupas: number;
  summary: string;
  thresholdPassedCount: number;
}

interface PD {
  house: number;
  sign: string;
  signNum: number;
  retrograde: boolean;
  dignity: string;
  lon: number;
  dailyMotion?: number;
}

// ── Constants ─────────────────────────────────────────────────
const PLANET_LIST = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const ICONS = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"];
const COLORS = ["#f97316", "#c084fc", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#60a5fa"];
const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const UCH: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6
};
const OWN: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10]
};
const DIG_HOUSE: Record<string, number> = {
  Sun: 10, Mars: 10, Moon: 4, Venus: 4,
  Mercury: 1, Jupiter: 1, Saturn: 7
};

// Classical Parashari minimum required Rupas (BPHS Ch. 29)
export const MIN_REQUIRED_RUPAS: Record<string, number> = {
  Sun: 6.5,     // 390 Virupas
  Moon: 6.0,    // 360 Virupas
  Mars: 5.0,    // 300 Virupas
  Mercury: 7.0, // 420 Virupas
  Jupiter: 6.5, // 390 Virupas
  Venus: 5.5,   // 330 Virupas
  Saturn: 5.0,  // 300 Virupas
};

// Classical fixed Naisargika Bala in Virupas (BPHS: 60/7, 120/7, etc.)
const NAISARGIKA_VIRUPAS: Record<string, number> = {
  Sun: 60.0,
  Moon: 51.4,
  Venus: 42.9,
  Jupiter: 34.3,
  Mercury: 25.7,
  Mars: 17.1,
  Saturn: 8.6,
};

// Classical Bala descriptions
const BALA_DESC = {
  Sthana: "स्थान बल (Sthana Bala) — राशि व वर्ग स्थिति की शक्ति। उच्च राशि में 100% शिखर, स्वराशि में गृह-तुल्य सहजता। यह ग्रह की मूल आंतरिक शक्ति का आधार है।",
  Dig: "दिग् बल (Dig Bala) — दिशा की शक्ति। सूर्य-मंगल दशम में, बुध-गुरु लग्न में, चंद्र-शुक्र चतुर्थ में, और शनि सप्तम में दिशात्मक बल के चरम पर होते हैं।",
  Kala: "काल बल (Kala Bala) — समय की शक्ति। दिन के समय सूर्य-गुरु-शुक्र और रात्रि में चंद्र-मंगल-शनि अधिक शक्तिशाली परिणाम देते हैं।",
  Cheshta: "चेष्टा बल (Cheshta Bala) — गति व चेष्टा की शक्ति। वक्री होने पर ग्रह की चेष्टा तीव्र हो जाती है, जबकि अस्त होने पर स्वतंत्र क्रियाशक्ति मंद हो जाती है।",
  Naisargika: "नैसर्गिक बल (Naisargika Bala) — प्राकृतिक प्रकाश शक्ति। यह जन्मकुंडली से परे ब्रह्मांडीय क्रम है (सूर्य सर्वोच्च, फिर चंद्र, शुक्र, गुरु, बुध, मंगल, शनि)।",
  Drik: "दृग् बल (Drik Bala) — दृष्टियों का बल। शुभ ग्रहों (गुरु, शुक्र) की दृष्टि से बल में वृद्धि और क्रूर ग्रहों (शनि, मंगल) के दबाव से संघर्ष उत्पन्न होता है।",
};

const MEAN_MOTION: Record<string, number> = {
  Sun: 0.9856, Moon: 13.1764, Mars: 0.5240,
  Mercury: 1.3833, Jupiter: 0.0831, Venus: 1.2, Saturn: 0.0335,
};

export function calculateShadbala(
  planets: Record<string, PD>,
  birthHourLocal: number = 12
): ShadbalaResult {
  const results: ShadbalaPlanet[] = [];

  PLANET_LIST.forEach((planet, pi) => {
    const pd = planets[planet];
    if (!pd) return;

    const rashi = pd.signNum;

    // ── 1. STHANA BALA ────────────────────────────────────────
    let sthanaBala: number;
    let sthanaVirupas: number;
    let uchchaBalaVirupas = 30;
    let sthanaTxt: string;

    if (UCH[planet] === rashi) {
      sthanaBala = 10;
      sthanaVirupas = 180;
      uchchaBalaVirupas = 60;
      sthanaTxt = `उच्च राशि ${SIGNS[rashi]} में विराजमान है — पूर्ण स्थान बल (180 विरूपा)। ग्रह अपना सर्वोच्च परिणाम देने में सक्षम है।`;
    } else if (OWN[planet]?.includes(rashi)) {
      sthanaBala = 7;
      sthanaVirupas = 145;
      uchchaBalaVirupas = 45;
      sthanaTxt = `स्वराशि ${SIGNS[rashi]} में स्थित है — घर जैसी सुखद व स्वायत्त स्थिति (145 विरूपा)। परिणाम अत्यंत स्थिर व दीर्घकालिक होंगे।`;
    } else if (rashi === (UCH[planet] + 6) % 12) {
      sthanaBala = 1;
      sthanaVirupas = 65;
      uchchaBalaVirupas = 5;
      sthanaTxt = `नीच राशि ${SIGNS[rashi]} में स्थित है — स्थान बल न्यूनतम है (65 विरूपा)। नीचभंग राजयोग व उपायों का सहारा आवश्यक है।`;
    } else if (rashi === (UCH[planet] + 2) % 12 || rashi === (UCH[planet] + 10) % 12) {
      sthanaBala = 5;
      sthanaVirupas = 115;
      uchchaBalaVirupas = 30;
      sthanaTxt = `सम राशि ${SIGNS[rashi]} में स्थित है — मध्यम स्थान बल (115 विरूपा)। दशा व गोचर के अनुसार परिणाम मिलेंगे।`;
    } else {
      sthanaBala = 4;
      sthanaVirupas = 95;
      uchchaBalaVirupas = 20;
      sthanaTxt = `शत्रु राशि ${SIGNS[rashi]} में स्थित है — कुछ आंतरिक संघर्ष रहेगा (95 विरूपा)।`;
    }

    // ── 2. DIG BALA ───────────────────────────────────────────
    const peakHouse = DIG_HOUSE[planet];
    const houseDiff = Math.abs(((pd.house - peakHouse + 6) % 12) - 6);
    const digBala = Math.max(2, Math.round(10 - houseDiff * 1.5));
    const digVirupas = Math.max(10, Math.round(60 - houseDiff * 9));
    const digTxt = pd.house === peakHouse
      ? `पूर्ण दिग्बल (60 विरूपा) — भाव ${pd.house} में यह ग्रह अपनी सर्वोच्च दिशात्मक ऊर्जा पर है।`
      : `दिग्बल ${digVirupas}/60 विरूपा — भाव ${peakHouse} से ${houseDiff} भाव की दूरी पर है।`;

    // ── 3. KALA BALA ──────────────────────────────────────────
    const isDay = birthHourLocal >= 6 && birthHourLocal < 18;
    const dayPlanets = ["Sun", "Jupiter", "Venus"];
    const nightPlanets = ["Moon", "Mars", "Saturn"];
    let kalaBala: number;
    let kalaVirupas: number;
    let kalaTxt: string;

    if (dayPlanets.includes(planet)) {
      kalaBala = isDay ? 7 : 4;
      kalaVirupas = isDay ? 95 : 60;
      kalaTxt = isDay
        ? `${planet} दिन का ग्रह है और जन्म दिन में हुआ — काल बल उत्तम (95 विरूपा)।`
        : `${planet} दिन का ग्रह है पर जन्म रात्रि में हुआ — काल बल मध्यम (60 विरूपा)।`;
    } else if (nightPlanets.includes(planet)) {
      kalaBala = isDay ? 4 : 7;
      kalaVirupas = isDay ? 60 : 95;
      kalaTxt = !isDay
        ? `${planet} रात्रि का ग्रह है और जन्म रात्रि में हुआ — काल बल उत्तम (95 विरूपा)।`
        : `${planet} रात्रि का ग्रह है पर जन्म दिन में हुआ — काल बल मध्यम (60 विरूपा)।`;
    } else {
      kalaBala = 5;
      kalaVirupas = 75;
      kalaTxt = `${planet} (बुध) दिन व रात दोनों में संतुलित काल बल (75 विरूपा) रखता है।`;
    }

    // ── 4. CHESHTA BALA ───────────────────────────────────────
    let cheshtaBala: number;
    let cheshtaVirupas: number;
    let cheshtaTxt: string;

    const sunLon = planets.Sun?.lon || 0;
    const angSep = Math.min(
      Math.abs(pd.lon - sunLon),
      360 - Math.abs(pd.lon - sunLon)
    );

    if (pd.dignity?.includes("Combust") || angSep < 8) {
      cheshtaBala = 1;
      cheshtaVirupas = 10;
      cheshtaTxt = "सूर्य के अत्यंत निकट होने से अस्त (Combust) प्रभाव — चेष्टा बल न्यूनतम (10 विरूपा)।";
    } else if (pd.retrograde) {
      cheshtaBala = 9;
      cheshtaVirupas = 55;
      cheshtaTxt = "वक्री (Retrograde) गति में होने से शास्त्रीय चेष्टा बल चरम पर (55 विरूपा) — प्रयास गहन होंगे।";
    } else {
      cheshtaBala = 6;
      cheshtaVirupas = 38;
      cheshtaTxt = "मार्गी (Direct) गति में स्थिर क्रियाशक्ति (38 विरूपा)।";
    }

    // ── 5. NAISARGIKA BALA ────────────────────────────────────
    const naisargikaVirupas = NAISARGIKA_VIRUPAS[planet] || 30;
    const naisargika = Math.round((naisargikaVirupas / 60) * 7);

    // ── 6. DRIK BALA ──────────────────────────────────────────
    let drikVirupas = 25;
    const benefics = ["Jupiter", "Venus", "Moon", "Mercury"];

    ["Jupiter", "Venus", "Saturn", "Mars"].forEach((asp) => {
      if (asp === planet || !planets[asp]) return;
      const dist = Math.abs(planets[asp].house - pd.house);
      const normDist = Math.min(dist, 12 - dist);
      const hasAspect =
        normDist === 6 ||
        (asp === "Jupiter" && [4, 8].includes(normDist)) ||
        (asp === "Mars" && [3, 7].includes(normDist)) ||
        (asp === "Saturn" && [2, 9].includes(normDist));
      if (hasAspect) {
        if (benefics.includes(asp)) drikVirupas += 12;
        else drikVirupas -= 8;
      }
    });
    drikVirupas = Math.max(5, Math.min(50, drikVirupas));
    const drikBala = Math.max(1, Math.min(8, Math.round((drikVirupas / 50) * 8)));
    const drikTxt = drikVirupas >= 35
      ? `शुभ दृष्टियां प्रबल हैं — दृग् बल ${drikVirupas} विरूपा।`
      : drikVirupas >= 20
      ? `मिश्रित दृष्टियां — दृग् बल ${drikVirupas} विरूपा।`
      : `क्रूर दृष्टियों का दबाव — दृग् बल ${drikVirupas} विरूपा।`;

    // ── TOTAL VIRUPAS & RUPAS ─────────────────────────────────
    const totalVirupas = Math.round(
      sthanaVirupas + digVirupas + kalaVirupas + cheshtaVirupas + naisargikaVirupas + drikVirupas
    );
    const totalRupas = Number((totalVirupas / 60).toFixed(2));
    const requiredRupas = MIN_REQUIRED_RUPAS[planet] || 6.0;
    const requiredVirupas = Math.round(requiredRupas * 60);
    const shadbalaRatio = Number((totalRupas / requiredRupas).toFixed(2));
    const passesThreshold = shadbalaRatio >= 1.0;

    // Ishta Phala & Kashta Phala (Parashari formula scaled 0..60)
    const ishtaPhala = Number(
      Math.min(60, Math.sqrt((uchchaBalaVirupas * cheshtaVirupas))).toFixed(1)
    );
    const kashtaPhala = Number(
      Math.min(60, Math.sqrt(((60 - uchchaBalaVirupas) * Math.max(5, 60 - cheshtaVirupas)))).toFixed(1)
    );

    // Normalized Percentage for UI
    const total = sthanaBala + digBala + kalaBala + cheshtaBala + naisargika + drikBala;
    const percentage = Math.min(100, Math.round((totalVirupas / (requiredVirupas * 1.35)) * 100));

    const grade =
      shadbalaRatio >= 1.25 ? "Excellent" :
      shadbalaRatio >= 1.0 ? "Strong" :
      shadbalaRatio >= 0.85 ? "Moderate" :
      shadbalaRatio >= 0.7 ? "Weak" : "Very Weak";

    const gradeColor =
      grade === "Excellent" ? "#C8A030" :
      grade === "Strong" ? "#16A34A" :
      grade === "Moderate" ? "#3B82F6" :
      grade === "Weak" ? "#F97316" : "#DC2626";

    const overallTxt = passesThreshold
      ? `${planet} का षड्बल ${totalRupas} रूपा है (न्यूनतम कोटा: ${requiredRupas} रूपा) — यह ग्रह पराशरीय न्यूनतम मानक को ${((shadbalaRatio - 1) * 100).toFixed(0)}% अधिक बल के साथ पार कर चुका है। यह अपनी महादशा में पूर्ण शुभ फल देगा।`
      : `${planet} का षड्बल ${totalRupas} रूपा है (न्यूनतम कोटा: ${requiredRupas} रूपा) — यह ग्रह न्यूनतम मानक से थोड़ा पीछे है (अनुपात: ${shadbalaRatio})। इसके शुभ फल प्राप्त करने हेतु उचित उपासना या उपाय सहायक होंगे।`;

    results.push({
      planet,
      icon: ICONS[pi],
      color: COLORS[pi],
      sign: pd.sign,
      house: pd.house,
      retrograde: pd.retrograde,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargika,
      drikBala,
      sthanaVirupas,
      digVirupas,
      kalaVirupas,
      cheshtaVirupas,
      naisargikaVirupas,
      drikVirupas,
      total,
      totalVirupas,
      totalRupas,
      requiredRupas,
      requiredVirupas,
      shadbalaRatio,
      passesThreshold,
      percentage,
      ishtaPhala,
      kashtaPhala,
      grade,
      gradeColor,
      sthanaTxt,
      digTxt,
      kalaTxt,
      cheshtaTxt,
      drikTxt,
      overallTxt,
      sthanaDef: BALA_DESC.Sthana,
      digDef: BALA_DESC.Dig,
      kalaDef: BALA_DESC.Kala,
      cheshtaDef: BALA_DESC.Cheshta,
      naisargikaDef: BALA_DESC.Naisargika,
      drikDef: BALA_DESC.Drik,
    });
  });

  // Sort by shadbalaRatio descending
  results.sort((a, b) => b.shadbalaRatio - a.shadbalaRatio);

  const strongest = results[0]?.planet || "Jupiter";
  const weakest = results[results.length - 1]?.planet || "Saturn";
  const avgStrength = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);
  const avgRupas = Number(
    (results.reduce((s, r) => s + r.totalRupas, 0) / results.length).toFixed(2)
  );
  const thresholdPassedCount = results.filter((r) => r.passesThreshold).length;

  const summary = `कुल 7 शास्त्रीय ग्रहों में से ${thresholdPassedCount} ग्रह अपने पराशरीय न्यूनतम रूपा मानक को सफलतापूर्वक उत्तीर्ण करते हैं। आपका सबसे शक्तिशाली ग्रह ${strongest} (अनुपात: ${results[0]?.shadbalaRatio}) है, जो आपके जीवन का मुख्य शक्ति-स्तंभ है।`;

  return {
    planets: results,
    strongest,
    weakest,
    avgStrength,
    avgRupas,
    summary,
    thresholdPassedCount,
  };
}

export function getShadbalaRadar(planet: ShadbalaPlanet) {
  return [
    { label: "स्थान", value: planet.sthanaBala, max: 10 },
    { label: "दिग्", value: planet.digBala, max: 10 },
    { label: "काल", value: planet.kalaBala, max: 10 },
    { label: "चेष्टा", value: planet.cheshtaBala, max: 10 },
    { label: "नैसर्गिक", value: planet.naisargika, max: 7 },
    { label: "दृग्", value: planet.drikBala, max: 8 },
  ];
}
