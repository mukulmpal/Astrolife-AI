import { computePlanets, computeLagna, getJD, RASHIS } from "./calculations";

export type PrashnaTopic = "career" | "marriage" | "health" | "finance" | "travel" | "education" | "property" | "legal" | "child" | "general";

const LAGNA_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const CHALDEAN = ['Sun','Venus','Mercury','Moon','Saturn','Jupiter','Mars'];
const DAY_RULER_IDX = [0, 3, 6, 2, 5, 1, 4]; // Sun Mon Tue Wed Thu Fri Sat

const PLANET_EMOJI: Record<string, string> = {
  Sun:"☀️", Moon:"🌙", Mars:"♂️", Mercury:"☿", Jupiter:"♃", Venus:"♀️", Saturn:"♄", Rahu:"☊", Ketu:"☋"
};
const PLANET_COLORS: Record<string, string> = {
  Sun:"#f97316", Moon:"#c084fc", Mars:"#ef4444", Mercury:"#22c55e",
  Jupiter:"#f59e0b", Venus:"#ec4899", Saturn:"#60a5fa", Rahu:"#a78bfa", Ketu:"#fb7185",
};

const TOPIC_HOUSES: Record<PrashnaTopic, { positive: number[]; negative: number[]; karaka: string; secondary?: string; primary: number }> = {
  career:    { positive:[2,6,10,11], negative:[6,8,12], karaka:'Saturn', secondary:'Sun',    primary:10 },
  marriage:  { positive:[2,7,11],    negative:[6,8,12], karaka:'Venus',  secondary:'Jupiter', primary:7  },
  health:    { positive:[1,6,11],    negative:[6,8,12], karaka:'Sun',    secondary:'Moon',   primary:1  },
  finance:   { positive:[2,5,9,11],  negative:[8,12],   karaka:'Jupiter',secondary:'Venus',  primary:2  },
  travel:    { positive:[3,9,12],    negative:[8],      karaka:'Mercury',secondary:'Rahu',   primary:9  },
  education: { positive:[4,5,9],     negative:[6,8],    karaka:'Mercury',secondary:'Jupiter',primary:5  },
  property:  { positive:[4,9,11],    negative:[6,8,12], karaka:'Moon',   secondary:'Mars',   primary:4  },
  legal:     { positive:[1,6,11],    negative:[7,12],   karaka:'Mars',   secondary:'Saturn', primary:6  },
  child:     { positive:[2,5,11],    negative:[6,8,12], karaka:'Jupiter',secondary:'Moon',   primary:5  },
  general:   { positive:[1,5,9,11],  negative:[6,8,12], karaka:'Jupiter',                    primary:1  },
};

const HORA_FAVORABLE: Record<PrashnaTopic, string[]> = {
  career:    ['Sun','Mercury','Jupiter'],
  marriage:  ['Venus','Moon','Jupiter'],
  health:    ['Sun','Moon','Jupiter'],
  finance:   ['Jupiter','Venus','Mercury'],
  travel:    ['Mercury','Moon','Jupiter'],
  education: ['Mercury','Jupiter','Venus'],
  property:  ['Moon','Mercury','Jupiter'],
  legal:     ['Mars','Saturn','Sun'],
  child:     ['Jupiter','Moon','Venus'],
  general:   ['Jupiter','Sun','Venus'],
};

const BENEFICS = new Set(['Jupiter','Venus','Moon','Mercury']);
const MALEFICS = new Set(['Saturn','Mars','Rahu','Ketu','Sun']);

export interface PrashnaResult {
  verdict: "yes_strong" | "yes_possible" | "mixed" | "no_delay" | "no_unlikely";
  icon: string;
  color: string;
  title: string;
  detail: string;
  score: number;
  lagnaRashi: string;
  moonHouse: number;
  moonNakshatra: string;
  moonSign: string;
  lagnaLord: string;
  lagnaLordHouse: number;
  karaka: string;
  karakaHouse: number;
  karakaFavorable: boolean;
  hora: string;
  horaFavorable: boolean;
  horaHour: number;
  primaryHouse: number;
  primaryHouseOccupants: string[];
  topicHouses: { positive: number[]; negative: number[] };
  positiveFactors: string[];
  negativeFactors: string[];
  scoreBreakdown: { label: string; points: number; note: string }[];
  confidence: "low" | "medium" | "high";
  timingWindow: string;
  decisionProtocol: string[];
  practicalAdvice: string;
  question: string;
  topic: PrashnaTopic;
  planetPositions: Record<string, { house: number; sign: string; nakshatra?: string; emoji: string; color: string }>;
  timestamp: string;
}

function getHora(now: Date): { planet: string; horaHour: number } {
  const dayOfWeek = now.getUTCDay();
  const hourOfDay = now.getUTCHours();
  const horaIdx = (DAY_RULER_IDX[dayOfWeek] + hourOfDay) % 7;
  return { planet: CHALDEAN[horaIdx], horaHour: hourOfDay };
}

function getNakshatraName(lon: number): string {
  const NAK27 = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha',
    'Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
    'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
  return NAK27[Math.floor(((lon % 360) + 360) % 360 * 27 / 360) % 27];
}

function formatOffsetDate(now: Date, tz: number) {
  const local = new Date(now.getTime() + tz * 3600 * 1000);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mi = String(local.getUTCMinutes()).padStart(2, "0");
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` };
}

export function calculatePrashna(question: string, topic: PrashnaTopic, lat: number, lon: number, tz = 5.5): PrashnaResult {
  const now = new Date();
  const localMoment = formatOffsetDate(now, tz);
  const jd = getJD(localMoment.date, localMoment.time, tz);

  const lagnaLon = computeLagna(jd, lat, lon);
  const lagnaNum = Math.floor((lagnaLon % 360) / 30) % 12;
  const lagnaRashi = RASHIS[lagnaNum];

  const planets = computePlanets(jd);
  const PLANETS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

  // Build planet positions
  const planetPositions: PrashnaResult["planetPositions"] = {};
  PLANETS.forEach(p => {
    const pLon = planets[p];
    if (pLon === undefined || pLon === null) return;
    const signNum = Math.floor(((pLon % 360) + 360) % 360 / 30) % 12;
    const house = ((signNum - lagnaNum + 12) % 12) + 1;
    planetPositions[p] = {
      house,
      sign: RASHIS[signNum],
      nakshatra: getNakshatraName(pLon),
      emoji: PLANET_EMOJI[p],
      color: PLANET_COLORS[p],
    };
  });

  const moonLon = planets.Moon || 0;
  const moonHouse = planetPositions.Moon?.house || 1;
  const moonNakshatra = getNakshatraName(moonLon);
  const moonSign = planetPositions.Moon?.sign || '';

  const th = TOPIC_HOUSES[topic];
  const lagnaLord = LAGNA_LORDS[lagnaNum];
  const lagnaLordHouse = planetPositions[lagnaLord]?.house || 1;

  const karaka = th.karaka;
  const karakaHouse = planetPositions[karaka]?.house || 0;
  const karakaFavorable = karakaHouse > 0 && th.positive.includes(karakaHouse);

  const horaData = getHora(new Date(now.getTime() + tz * 3600 * 1000));
  const horaFavList = HORA_FAVORABLE[topic];
  const horaFavorable = horaFavList.includes(horaData.planet);

  let score = 0;
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  const scoreBreakdown: PrashnaResult["scoreBreakdown"] = [];

  // Lagna lord
  if (th.positive.includes(lagnaLordHouse)) {
    score += 2;
    positiveFactors.push(`Lagna lord ${lagnaLord} in H${lagnaLordHouse} (positive for ${topic})`);
    scoreBreakdown.push({ label: "Lagna lord", points: 2, note: `${lagnaLord} supports the query from H${lagnaLordHouse}.` });
  } else if (th.negative.includes(lagnaLordHouse)) {
    score -= 2;
    negativeFactors.push(`Lagna lord ${lagnaLord} in H${lagnaLordHouse} (challenging house)`);
    scoreBreakdown.push({ label: "Lagna lord", points: -2, note: `${lagnaLord} is under pressure in H${lagnaLordHouse}.` });
  }

  // Moon
  if (th.positive.includes(moonHouse)) {
    score += 2;
    positiveFactors.push(`Moon in H${moonHouse} — ${moonNakshatra} (favorable)`);
    scoreBreakdown.push({ label: "Moon", points: 2, note: `Mind and flow are supportive through ${moonNakshatra}.` });
  } else if (th.negative.includes(moonHouse)) {
    score -= 1;
    negativeFactors.push(`Moon in H${moonHouse} — ${moonNakshatra} (challenging)`);
    scoreBreakdown.push({ label: "Moon", points: -1, note: `Moon shows emotional or timing friction.` });
  }

  // Karaka
  if (karakaHouse > 0) {
    if (th.positive.includes(karakaHouse)) {
      score += 2;
      positiveFactors.push(`${karaka} (karaka) in H${karakaHouse} — very supportive`);
      scoreBreakdown.push({ label: "Karaka", points: 2, note: `${karaka} is placed in a helpful house for ${topic}.` });
    } else if (th.negative.includes(karakaHouse)) {
      score -= 2;
      negativeFactors.push(`${karaka} (karaka) in H${karakaHouse} — blocked`);
      scoreBreakdown.push({ label: "Karaka", points: -2, note: `${karaka} is blocked for this query.` });
    }
  }

  // Jupiter blessing
  const jupHouse = planetPositions.Jupiter?.house || 0;
  if (jupHouse > 0 && th.positive.includes(jupHouse)) {
    score += 1;
    positiveFactors.push(`Jupiter in H${jupHouse} — divine grace`);
    scoreBreakdown.push({ label: "Jupiter", points: 1, note: `Jupiter adds protection from H${jupHouse}.` });
  }

  // Primary house occupants
  const primaryHouseOccupants = PLANETS.filter(p => planetPositions[p]?.house === th.primary);
  if (primaryHouseOccupants.length > 0) {
    const hasBenefic = primaryHouseOccupants.some(p => BENEFICS.has(p));
    const hasMalefic = primaryHouseOccupants.some(p => MALEFICS.has(p));
    if (hasBenefic && !hasMalefic) {
      score += 2;
      positiveFactors.push(`${primaryHouseOccupants.join('+')} in H${th.primary} (primary house) — very positive`);
      scoreBreakdown.push({ label: "Primary house", points: 2, note: `Benefic support is present in the main house.` });
    } else if (hasMalefic && !hasBenefic) {
      score -= 1;
      negativeFactors.push(`${primaryHouseOccupants.join('+')} in H${th.primary} — delay possible`);
      scoreBreakdown.push({ label: "Primary house", points: -1, note: `Malefic pressure can delay the result.` });
    }
  }

  // Hora
  if (horaFavorable) {
    score += 1;
    positiveFactors.push(`${horaData.planet} Hora — favorable timing for ${topic}`);
    scoreBreakdown.push({ label: "Hora", points: 1, note: `${horaData.planet} hora is good for this topic.` });
  } else {
    negativeFactors.push(`${horaData.planet} Hora — not optimal. Best: ${horaFavList.join('/')} hora`);
    scoreBreakdown.push({ label: "Hora", points: 0, note: `${horaData.planet} hora is neutral; better horas: ${horaFavList.join('/')}.` });
  }

  // Verdict
  type Verdict = PrashnaResult["verdict"];
  const verdict: Verdict = score >= 4 ? 'yes_strong' : score >= 2 ? 'yes_possible' : score >= 0 ? 'mixed' : 'no_delay';
  const verdictMap: Record<Verdict, { icon: string; color: string; title: string; detail: string }> = {
    yes_strong:  { icon:'✅', color:'#22c55e', title:'HAAN — Bahut Shubh!',           detail:'Multiple strong positive indicators. Kaarya safal hoga. Good time to proceed.' },
    yes_possible:{ icon:'🟡', color:'#fbbf24', title:'SAMBHAV — Thodi Deri',          detail:'Mixed signals. Kuch obstacles hain. Thoda sabr rakhein, kaarya hoga.' },
    mixed:       { icon:'⚠️', color:'#f97316', title:'ACHHA NAHI — Ruko',             detail:'Abhi samay anukool nahi. Wait karein. Situation improve hogi.' },
    no_delay:    { icon:'❌', color:'#ef4444', title:'NAHI — Abhi Nahi',              detail:'Strong negative indicators. Upay karein aur muhurta baad mein dekho.' },
    no_unlikely: { icon:'🔴', color:'#dc2626', title:'NAHI — Unlikely',               detail:'Chart suggests significant delay or unfavorable outcome.' },
  };

  // Practical advice
  const favHoraStr = horaFavList.join('/');
  const practicalAdvice = score >= 4
    ? `Aaj hi kaarya shuru karein. ${horaFavList[0]} hora mein final decision lein. Upcoming Dwadashi ya Saptami tithi mein proceed karein. ${karaka} ko strengthen karein — yeh karaka hai.`
    : score >= 2
    ? `Thoda wait karein. ${favHoraStr} hora aane par kaarya shuru karein. Ekadashi ya Saubhagya yoga mein try karein. ${lagnaLord} ki disha mein jaayein.`
    : `Abhi rukein. ${karaka} mantra jaap karein. Jupiter transit positive hone ka wait karein. ${lagnaLord} ki pooja karein. ${favHoraStr} hora mein dobaara prashna karein.`;

  const confidence: PrashnaResult["confidence"] =
    Math.abs(score) >= 4 && scoreBreakdown.length >= 4 ? "high" : scoreBreakdown.length >= 3 ? "medium" : "low";
  const timingWindow = score >= 4
    ? `Proceed in the next favorable ${favHoraStr} hora; keep action within 1-3 days if practical.`
    : score >= 2
    ? `Wait for ${favHoraStr} hora and re-check after 3-7 days before final commitment.`
    : `Avoid final commitment now; repeat prashna in a calmer moment or after 7-14 days.`;
  const decisionProtocol = [
    score >= 2 ? "Move only after one practical confirmation outside astrology." : "Do not force the matter today; reduce urgency first.",
    `Use ${favHoraStr} hora for communication, payment, signing, or first action.`,
    negativeFactors.length ? "Resolve the strongest negative factor before taking the irreversible step." : "Keep the first step small so the chart support can compound.",
  ];

  const vdata = verdictMap[verdict];
  return {
    verdict,
    icon: vdata.icon,
    color: vdata.color,
    title: vdata.title,
    detail: vdata.detail,
    score,
    lagnaRashi,
    moonHouse,
    moonNakshatra,
    moonSign,
    lagnaLord,
    lagnaLordHouse,
    karaka,
    karakaHouse,
    karakaFavorable,
    hora: horaData.planet,
    horaFavorable,
    horaHour: horaData.horaHour,
    primaryHouse: th.primary,
    primaryHouseOccupants,
    topicHouses: { positive: th.positive, negative: th.negative },
    positiveFactors,
    negativeFactors,
    scoreBreakdown,
    confidence,
    timingWindow,
    decisionProtocol,
    practicalAdvice,
    question,
    topic,
    planetPositions,
    timestamp: `${localMoment.date} ${localMoment.time} (UTC${tz >= 0 ? '+' : ''}${tz})`,
  };
}
