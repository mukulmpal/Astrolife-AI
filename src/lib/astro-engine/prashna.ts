// ============================================================
// PRASHNA KUNDALI ENGINE — Vedic Horary Astrology
// Calculates a chart for the current moment and judges the
// querent's question using KP-inspired significator logic.
// ============================================================

import { computePlanets, computeLagna, RASHIS } from "./calculations";

// ── Public types ─────────────────────────────────────────────

export type PrashnaTopic =
  | "career"
  | "marriage"
  | "health"
  | "finance"
  | "travel"
  | "education"
  | "property"
  | "legal"
  | "child"
  | "general";

export interface PrashnaInput {
  question: string;
  topic: PrashnaTopic;
  lat: number;
  lon: number;
  tz: number;
}

export interface PrashnaChart {
  lagnaRashi: string;
  lagnaNum: number;
  planets: Record<
    string,
    {
      rashi: string;
      rashiNum: number;
      house: number;
      nakshatra: string;
      lon: number;
    }
  >;
  hora: { planet: string; lord: string; description: string };
  timestamp: Date;
}

export interface PrashnaJudgment {
  verdict:
    | "yes_strong"
    | "yes_possible"
    | "mixed"
    | "no_delay"
    | "no_unlikely";
  icon: string;
  color: string;
  title: string;
  detail: string;
  score: number;
  positiveFactors: string[];
  negativeFactors: string[];
}

export interface PrashnaKPData {
  lagnaLord: string;
  lagnaLordHouse: number;
  moonHouse: number;
  moonNakshatra: string;
  karakaName: string;
  karakaHouse: number;
  topicHouses: { positive: number[]; negative: number[] };
}

export interface PrashnaResult {
  chart: PrashnaChart;
  judgment: PrashnaJudgment;
  kp: PrashnaKPData;
  question: string;
  topic: PrashnaTopic;
}

// ── Internal constants ────────────────────────────────────────

const NAK_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

// Lagna lord by rashi number (0=Aries … 11=Pisces)
const LAGNA_LORD: Record<number, string> = {
  0: "Mars",
  1: "Venus",
  2: "Mercury",
  3: "Moon",
  4: "Sun",
  5: "Mercury",
  6: "Venus",
  7: "Mars",
  8: "Jupiter",
  9: "Saturn",
  10: "Saturn",
  11: "Jupiter",
};

// Day-of-week rulers  0=Sun … 6=Sat
const WEEKDAY_LORD = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

// Planetary hora sequence starting from the weekday ruler
const HORA_SEQUENCE = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];

// Topic configuration table
const TOPIC_CONFIG: Record<
  PrashnaTopic,
  {
    positive: number[];
    negative: number[];
    karaka: string;
    primary: number;
    label: string;
  }
> = {
  career:    { positive: [2, 6, 10, 11], negative: [6, 8, 12], karaka: "Saturn",  primary: 10, label: "Career & Job"      },
  marriage:  { positive: [2, 7, 11],     negative: [6, 8, 12], karaka: "Venus",   primary: 7,  label: "Marriage & Love"   },
  health:    { positive: [1, 6, 11],     negative: [6, 8, 12], karaka: "Sun",     primary: 1,  label: "Health & Vitality" },
  finance:   { positive: [2, 5, 9, 11],  negative: [8, 12],    karaka: "Jupiter", primary: 2,  label: "Finance & Wealth"  },
  travel:    { positive: [3, 9, 12],     negative: [8],        karaka: "Mercury", primary: 9,  label: "Travel & Journey"  },
  education: { positive: [4, 5, 9],      negative: [6, 8],     karaka: "Mercury", primary: 5,  label: "Education & Study" },
  property:  { positive: [4, 9, 11],     negative: [6, 8, 12], karaka: "Moon",    primary: 4,  label: "Property & Home"   },
  legal:     { positive: [1, 6, 11],     negative: [7, 12],    karaka: "Mars",    primary: 6,  label: "Legal & Disputes"  },
  child:     { positive: [2, 5, 11],     negative: [6, 8, 12], karaka: "Jupiter", primary: 5,  label: "Children & Birth"  },
  general:   { positive: [1, 5, 9, 11],  negative: [6, 8, 12], karaka: "Sun",     primary: 1,  label: "General Question"  },
};

// Hora descriptions for each planet
const HORA_DESC: Record<string, string> = {
  Sun:     "Sarkar, authority aur naam ke liye shubh. Power matters mein sakaratmak.",
  Moon:    "Bhawna, travel aur public dealing ke liye accha. Emotional matters sahi.",
  Mars:    "Energy aur competition ke liye tez. Vivad mein sahi, lekin dhyan se.",
  Mercury: "Business, communication aur studies ke liye uttam. Smart decisions.",
  Jupiter: "Dharm, gyan aur barkat ke liye sabse shubh hora. Har kaam shubh.",
  Venus:   "Prem, kala aur sukh ke liye. Relationships aur creative work mein shubh.",
  Saturn:  "Mehnat aur discipline ke liye. Time lagega lekin result pakka.",
};

// ── Helper: get nakshatra from longitude ──────────────────────

function getNakshatra(lon: number): string {
  const idx = Math.floor(((lon % 360) * 27) / 360);
  return NAK_NAMES[Math.max(0, Math.min(26, idx))];
}

// ── Hora calculation ──────────────────────────────────────────

function computeHora(now: Date): { planet: string; lord: string; description: string } {
  const weekday = now.getDay(); // 0=Sun … 6=Sat
  const dayLord = WEEKDAY_LORD[weekday];
  const dayLordHoraStart = HORA_SEQUENCE.indexOf(dayLord);

  // Each hora = 1 hour. Hora 0 starts at 6 AM.
  const horaIndex = Math.floor(((now.getHours() - 6 + 24) % 24));
  const seqIdx = (dayLordHoraStart + horaIndex) % 7;
  const horaPlanet = HORA_SEQUENCE[seqIdx];

  return {
    planet: horaPlanet,
    lord: dayLord,
    description: HORA_DESC[horaPlanet] ?? "Saamaanya hora — dhyan se karya karein.",
  };
}

// ── Favorable hora logic for topic ───────────────────────────

function isHoraFavorable(horaPlanet: string, topic: PrashnaTopic): boolean {
  const favorable: Record<PrashnaTopic, string[]> = {
    career:    ["Sun", "Saturn", "Jupiter"],
    marriage:  ["Venus", "Moon", "Jupiter"],
    health:    ["Sun", "Jupiter", "Moon"],
    finance:   ["Jupiter", "Venus", "Mercury"],
    travel:    ["Mercury", "Moon", "Jupiter"],
    education: ["Mercury", "Jupiter", "Sun"],
    property:  ["Moon", "Venus", "Jupiter"],
    legal:     ["Mars", "Sun", "Jupiter"],
    child:     ["Jupiter", "Moon", "Venus"],
    general:   ["Sun", "Jupiter", "Venus"],
  };
  return (favorable[topic] ?? []).includes(horaPlanet);
}

// ── Main engine function ──────────────────────────────────────

export function calculatePrashna(input: PrashnaInput): PrashnaResult {
  const { question, topic, lat, lon: lonInput, tz } = input;

  // Current moment
  const now = new Date();
  const jd = now.getTime() / 86400000 + 2440587.5;

  // Compute raw planet longitudes (sidereal)
  const rawLons = computePlanets(jd);

  // Compute lagna
  const lagnaLon = computeLagna(jd, lat, lonInput);
  const lagnaNum = Math.floor(lagnaLon / 30) % 12;
  const lagnaRashi = RASHIS[lagnaNum];

  // Build planet data
  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planets: PrashnaChart["planets"] = {};

  for (const name of planetNames) {
    const pLon = rawLons[name] ?? 0;
    const rashiNum = Math.floor(pLon / 30) % 12;
    const house = ((rashiNum - lagnaNum + 12) % 12) + 1;
    const nakshatra = getNakshatra(pLon);

    planets[name] = {
      rashi: RASHIS[rashiNum],
      rashiNum,
      house,
      nakshatra,
      lon: pLon,
    };
  }

  // Hora
  const hora = computeHora(now);

  // Build chart
  const chart: PrashnaChart = {
    lagnaRashi,
    lagnaNum,
    planets,
    hora,
    timestamp: now,
  };

  // KP data
  const cfg = TOPIC_CONFIG[topic];
  const lagnaLord = LAGNA_LORD[lagnaNum] ?? "Jupiter";
  const lagnaLordHouse = planets[lagnaLord]?.house ?? 1;
  const moonHouse = planets["Moon"]?.house ?? 1;
  const moonNakshatra = planets["Moon"]?.nakshatra ?? "Ashwini";
  const karakaHouse = planets[cfg.karaka]?.house ?? 1;

  const kp: PrashnaKPData = {
    lagnaLord,
    lagnaLordHouse,
    moonHouse,
    moonNakshatra,
    karakaName: cfg.karaka,
    karakaHouse,
    topicHouses: { positive: cfg.positive, negative: cfg.negative },
  };

  // Scoring
  let score = 0;
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];

  // Lagna lord
  if (cfg.positive.includes(lagnaLordHouse)) {
    score += 2;
    positiveFactors.push(
      `Lagna lord ${lagnaLord} ${lagnaLordHouse}ve ghar mein — topic ke liye shubh sthiti.`
    );
  }
  if (cfg.negative.includes(lagnaLordHouse) && !cfg.positive.includes(lagnaLordHouse)) {
    score -= 2;
    negativeFactors.push(
      `Lagna lord ${lagnaLord} ${lagnaLordHouse}ve ghar mein — obstacle ya vilamba.`
    );
  }

  // Moon
  if (cfg.positive.includes(moonHouse)) {
    score += 2;
    positiveFactors.push(`Chandra ${moonHouse}ve bhav mein — bhavna aur circumstances anukool.`);
  } else if (cfg.negative.includes(moonHouse)) {
    score -= 1;
    negativeFactors.push(`Chandra ${moonHouse}ve bhav mein — mann mein bechain aur rukawat.`);
  }

  // Karaka
  if (cfg.positive.includes(karakaHouse)) {
    score += 2;
    positiveFactors.push(
      `Karaka ${cfg.karaka} ${karakaHouse}ve ghar mein — vishay ka swami mazbut.`
    );
  } else if (cfg.negative.includes(karakaHouse)) {
    score -= 2;
    negativeFactors.push(
      `Karaka ${cfg.karaka} ${karakaHouse}ve ghar mein — karaka kamzor, rukawat hai.`
    );
  }

  // Jupiter as general benefic
  const jupHouse = planets["Jupiter"]?.house ?? 1;
  if (cfg.positive.includes(jupHouse)) {
    score += 1;
    positiveFactors.push(`Guru (Jupiter) ${jupHouse}ve bhav mein — ashirwad aur anukoolata.`);
  }

  // Primary house: Jupiter or Venus present = bonus; Saturn/Rahu = penalty
  const primaryHousePlanets = planetNames.filter(
    (p) => planets[p]?.house === cfg.primary
  );
  for (const p of primaryHousePlanets) {
    if (p === "Jupiter" || p === "Venus") {
      score += 2;
      positiveFactors.push(
        `${p} ${cfg.primary}ve ghar (primary house) mein — bahut shubh yoga.`
      );
    } else if (p === "Saturn" || p === "Rahu") {
      score -= 1;
      negativeFactors.push(
        `${p} ${cfg.primary}ve ghar mein — deri ya badha sambhav.`
      );
    }
  }

  // Hora bonus
  if (isHoraFavorable(hora.planet, topic)) {
    score += 1;
    positiveFactors.push(
      `Abhi ${hora.planet} ki hora chal rahi hai — is vishay ke liye shubh samay.`
    );
  } else {
    negativeFactors.push(
      `${hora.planet} ki hora is vishay ke liye bahut anukool nahi hai.`
    );
  }

  // Build verdict
  let verdict: PrashnaJudgment["verdict"];
  let icon: string;
  let color: string;
  let title: string;
  let detail: string;

  if (score >= 4) {
    verdict = "yes_strong";
    icon = "✅";
    color = "#22c55e";
    title = "HAAN — Bahut Shubh Sanket!";
    detail =
      `Prashna chart mein ${score} shubh yog mil rahe hain. Grahon ki sthiti clearly favourable hai. ` +
      "Yeh kaam hoga — samay aur paristhitiyan saath hain. Vishwas rakhein aur aage badhein.";
  } else if (score >= 2) {
    verdict = "yes_possible";
    icon = "🟡";
    color = "#eab308";
    title = "SAMBHAV — Thodi Deri Ho Sakti Hai";
    detail =
      `Score ${score} hai — karya sambhav hai lekin ek-do rukawaten hain. ` +
      "Thoda sabr rakhein, sahi samay aane par kaam hoga. Mehnat jaari rakhein.";
  } else if (score >= 0) {
    verdict = "mixed";
    icon = "⚠️";
    color = "#f97316";
    title = "ACHHA NAHI — Thoda Wait Karein";
    detail =
      `Score ${score} hai — kuch shubh aur kuch ashubh yog dono hain. ` +
      "Abhi kadam uthana theek nahi. Kuch samay baad phir prashna karein ya upay karein.";
  } else {
    verdict = "no_delay";
    icon = "❌";
    color = "#ef4444";
    title = "NAHI — Abhi Nahi Hoga";
    detail =
      `Score ${score} hai — grahon ki sthiti is vishay mein pratikool hai. ` +
      "Is waqt yeh kaam hona mushkil lag raha hai. Upay karein, deri ke baad punah vichar karein.";
  }

  const judgment: PrashnaJudgment = {
    verdict,
    icon,
    color,
    title,
    detail,
    score,
    positiveFactors,
    negativeFactors,
  };

  return { chart, judgment, kp, question, topic };
}
