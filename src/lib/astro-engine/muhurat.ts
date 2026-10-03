/**
 * ============================================================================
 * ASTROLIFE — CLASSICAL MUHURAT CALCULATION ENGINE
 * ============================================================================
 * Pure, deterministic evaluation of auspicious windows for key life milestones:
 * 1. Vivah (Marriage)
 * 2. Vyapar (Business Launch / Startup / Shop Opening)
 * 3. Griha Pravesh (House Warming / Property Ingress)
 * 4. Vahan Kharid (Vehicle Purchase)
 * 5. Yatra (Long-Distance Travel)
 *
 * Grounded in classical authorities:
 * - Muhurta Chintamani (Daivajna Rama)
 * - Brihat Samhita (Varahamihira)
 * - Kalaprakasika
 * ============================================================================
 */

import { calculatePanchang, type PanchangResult } from "./panchang";
import { getJD, computePlanets, computeRetro } from "./calculations";
import { getNavtara } from "./dasha";

export type MuhuratCategory = "marriage" | "business" | "griha_pravesh" | "vehicle" | "travel";

export interface MuhuratCriterion {
  factor: "Tithi" | "Nakshatra" | "Vara" | "Yoga" | "Planetary" | "Navtara";
  name: string;
  status: "pass" | "caution" | "fail";
  detail: string;
  citation: string;
}

export interface MuhuratWindow {
  date: string; // YYYY-MM-DD
  weekday: string;
  panchangSummary: {
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    abhijitMuhurta: string;
    rahuKaal: string;
  };
  score: number; // 0 to 100
  rating: "Highly Auspicious" | "Favorable" | "Neutral" | "Avoid";
  badgeColor: string;
  bestTimeOfDay: string;
  criteria: MuhuratCriterion[];
  shastraSummary: string;
  isPersonalized: boolean;
}

export interface MuhuratScanOptions {
  category: MuhuratCategory;
  startDate?: Date;
  daysToScan?: number; // 30, 60, or 90
  tz?: number;
  location?: { lat: number; lon: number };
  natalMoonNakshatra?: string; // Optional for personal Tara Bala check
}

// ── Classical Shastra Rules Registry ──────────────────────────────────────────

const INAUSPICIOUS_YOGAS = new Set([
  "Vishkambha", "Atiganda", "Shula", "Ganda", "Vyaghata", "Vajra", "Vyatipata", "Parigha", "Vaidhriti"
]);

const RIKTA_TITHIS = new Set([4, 9, 14, 19, 24, 29]); // Chaturthi, Navami, Chaturdashi of both pakshas + Amavasya

const CATEGORY_RULES: Record<
  MuhuratCategory,
  {
    title: string;
    idealNakshatras: string[];
    idealVaras: string[];
    avoidVaras: string[];
    classicCitation: string;
  }
> = {
  marriage: {
    title: "Vivah Muhurat",
    idealNakshatras: [
      "Rohini", "Mrigashira", "Magha", "Uttara Phalguni", "Hasta", "Swati",
      "Anuradha", "Mula", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"
    ],
    idealVaras: ["Monday", "Wednesday", "Thursday", "Friday"],
    avoidVaras: ["Tuesday", "Saturday"],
    classicCitation: "Muhurta Chintamani Ch. 6, Sloka 8–15 (Vivaha Prakarana)",
  },
  business: {
    title: "Vyapar & Startup Launch",
    idealNakshatras: [
      "Ashwini", "Rohini", "Mrigashira", "Pushya", "Uttara Phalguni", "Hasta",
      "Chitra", "Anuradha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Revati"
    ],
    idealVaras: ["Wednesday", "Thursday", "Friday", "Sunday"],
    avoidVaras: ["Tuesday"],
    classicCitation: "Brihat Samhita Ch. 99 (Vyapararambha)",
  },
  griha_pravesh: {
    title: "Griha Pravesh (House Warming)",
    idealNakshatras: [
      "Rohini", "Mrigashira", "Uttara Phalguni", "Chitra", "Anuradha",
      "Uttara Ashadha", "Uttara Bhadrapada", "Revati"
    ],
    idealVaras: ["Monday", "Wednesday", "Thursday", "Friday"],
    avoidVaras: ["Tuesday", "Sunday"],
    classicCitation: "Muhurta Chintamani Ch. 12 (Vastu & Griha Pravesha)",
  },
  vehicle: {
    title: "Vahan Kharid (Vehicle Purchase)",
    idealNakshatras: [
      "Ashwini", "Rohini", "Mrigashira", "Punarvasu", "Pushya", "Hasta",
      "Chitra", "Swati", "Shravana", "Dhanishtha", "Shatabhisha", "Revati"
    ],
    idealVaras: ["Wednesday", "Thursday", "Friday", "Sunday"],
    avoidVaras: ["Tuesday", "Saturday"],
    classicCitation: "Kalaprakasika (Yana & Vahana Labha)",
  },
  travel: {
    title: "Yatra & Long Journey",
    idealNakshatras: [
      "Ashwini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Anuradha",
      "Shravana", "Dhanishtha", "Revati"
    ],
    idealVaras: ["Monday", "Wednesday", "Thursday", "Friday"],
    avoidVaras: ["Sunday", "Tuesday"],
    classicCitation: "Muhurta Chintamani Ch. 8 (Yatra Prakarana)",
  },
};

// ── Check Planetary Combustion (Astangata) ──────────────────────────────────
function checkCombustion(jd: number): { isJupiterCombust: boolean; isVenusCombust: boolean } {
  const planets = computePlanets(jd);
  const sunLon = planets.Sun;
  const jupDiff = Math.abs((planets.Jupiter - sunLon + 360) % 360);
  const venDiff = Math.abs((planets.Venus - sunLon + 360) % 360);

  const normalizedJup = jupDiff > 180 ? 360 - jupDiff : jupDiff;
  const normalizedVen = venDiff > 180 ? 360 - venDiff : venDiff;

  return {
    isJupiterCombust: normalizedJup < 11.0,
    isVenusCombust: normalizedVen < 10.0,
  };
}

// ── Evaluate Single Date for Given Category ───────────────────────────────────
export function evaluateDateMuhurat(
  date: Date,
  category: MuhuratCategory,
  tz = 5.5,
  location = { lat: 28.6139, lon: 77.2090 },
  natalMoonNakshatra?: string
): MuhuratWindow {
  const panchang = calculatePanchang(date, tz, location, { includeEndTimes: false });
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const jd = getJD(dateStr, "12:00", tz);
  const { isJupiterCombust, isVenusCombust } = checkCombustion(jd);
  const retro = computeRetro(jd);

  const rules = CATEGORY_RULES[category];
  const criteria: MuhuratCriterion[] = [];
  let score = 50;

  // 1. TITHI EVALUATION
  const tithiNum = panchang.tithiNumber;
  const isRikta = RIKTA_TITHIS.has(tithiNum);
  const isAmavasya = tithiNum === 30 || panchang.tithi.toLowerCase().includes("amavasya");

  if (isAmavasya) {
    score -= 35;
    criteria.push({
      factor: "Tithi",
      name: panchang.tithi,
      status: "fail",
      detail: "Amavasya (New Moon) lacks lunar solar illumination; forbidden for major life beginnings.",
      citation: "Brihat Samhita Ch. 98, Sloka 4",
    });
  } else if (isRikta) {
    score -= 25;
    criteria.push({
      factor: "Tithi",
      name: panchang.tithi,
      status: "fail",
      detail: "Rikta Tithi (empty day) produces friction, delay, and depletion.",
      citation: "Muhurta Chintamani Ch. 1, Sloka 19",
    });
  } else {
    score += 15;
    criteria.push({
      factor: "Tithi",
      name: panchang.tithi,
      status: "pass",
      detail: `${panchang.paksha} Paksha ${panchang.tithi} is favorable and constructive for initiation.`,
      citation: "Kalaprakasika Ch. 2",
    });
  }

  // 2. NAKSHATRA EVALUATION
  const nakName = panchang.nakshatra;
  const isIdealNak = rules.idealNakshatras.some((n) => nakName.toLowerCase().includes(n.toLowerCase()));

  if (isIdealNak) {
    score += 20;
    criteria.push({
      factor: "Nakshatra",
      name: `${nakName} (Pada ${panchang.nakshatraPada})`,
      status: "pass",
      detail: `${nakName} is classically lauded for ${rules.title}, granting stability, endurance, and auspicious growth.`,
      citation: rules.classicCitation,
    });
  } else {
    score += 5;
    criteria.push({
      factor: "Nakshatra",
      name: nakName,
      status: "caution",
      detail: `${nakName} is permissible for routine matters, though not classified as supreme for ${rules.title}.`,
      citation: "Muhurta Chintamani",
    });
  }

  // 3. VARA (WEEKDAY) EVALUATION
  const weekday = panchang.weekday;
  if (rules.idealVaras.includes(weekday)) {
    score += 10;
    criteria.push({
      factor: "Vara",
      name: weekday,
      status: "pass",
      detail: `${weekday} (ruled by ${panchang.varaLord}) provides natural harmonic acceleration for ${rules.title}.`,
      citation: "Brihat Samhita",
    });
  } else if (rules.avoidVaras.includes(weekday)) {
    score -= 15;
    criteria.push({
      factor: "Vara",
      name: weekday,
      status: "caution",
      detail: `${weekday} is generally harsh or combative for ${rules.title}; requires Abhijit Muhurta mitigation.`,
      citation: "Muhurta Chintamani Ch. 2",
    });
  } else {
    criteria.push({
      factor: "Vara",
      name: weekday,
      status: "pass",
      detail: `${weekday} carries neutral, steady energy.`,
      citation: "General Shastra",
    });
  }

  // 4. YOGA EVALUATION
  if (INAUSPICIOUS_YOGAS.has(panchang.yoga)) {
    score -= 15;
    criteria.push({
      factor: "Yoga",
      name: panchang.yoga,
      status: "fail",
      detail: `${panchang.yoga} is an inauspicious planetary angle (Ashubha Yoga); avoid commencing new ventures.`,
      citation: "Muhurta Chintamani Ch. 1, Sloka 28",
    });
  } else {
    score += 10;
    criteria.push({
      factor: "Yoga",
      name: panchang.yoga,
      status: "pass",
      detail: `${panchang.yoga} Yoga carries auspicious solar-lunar harmony.`,
      citation: "Kalaprakasika",
    });
  }

  // 5. PLANETARY COMBUSTION & RETROGRADE (GURU & SHUKRA)
  if (category === "marriage") {
    if (isJupiterCombust || isVenusCombust) {
      score -= 30;
      criteria.push({
        factor: "Planetary",
        name: isJupiterCombust && isVenusCombust ? "Guru & Shukra Astangata" : isJupiterCombust ? "Guru Astangata (Combust)" : "Shukra Astangata (Combust)",
        status: "fail",
        detail: "Marriage is strictly prohibited when Jupiter or Venus is combust (Tara Doobna / Astangata).",
        citation: "Muhurta Chintamani Vivaha Prakarana Sloka 11",
      });
    } else {
      criteria.push({
        factor: "Planetary",
        name: "Guru & Shukra Udit",
        status: "pass",
        detail: "Both benefic planets (Jupiter and Venus) are brilliantly visible, radiating marital blessings.",
        citation: "Classical Invariant",
      });
    }
  }

  // 6. PERSONAL TARA BALA (If User's Birth Moon Nakshatra Provided)
  let isPersonalized = false;
  if (natalMoonNakshatra) {
    try {
      const tara = getNavtara(natalMoonNakshatra as any, nakName as any);
      isPersonalized = true;

      if (tara.nature === "benefic" || (tara as any).type === "good") {
        score += 15;
        criteria.push({
          factor: "Navtara",
          name: `${tara.taraName} Tara`,
          status: "pass",
          detail: `Personal lunar transit aligns as ${tara.taraName} (${tara.meaning}). Peak personal harmony.`,
          citation: "Personalized Jaimini Tara Bala Framework",
        });
      } else if (tara.nature === "malefic" || (tara as any).type === "bad") {
        score -= 20;
        criteria.push({
          factor: "Navtara",
          name: `${tara.taraName} Tara`,
          status: "fail",
          detail: `Personal transit falls in ${tara.taraName} (${tara.meaning}). Increased probability of obstacles.`,
          citation: "Personalized Tara Bala Guard",
        });
      } else {
        criteria.push({
          factor: "Navtara",
          name: `${tara.taraName} Tara`,
          status: "caution",
          detail: `Personal transit is ${tara.taraName}: balanced and routine energy.`,
          citation: "Personalized Navtara",
        });
      }
    } catch {
      // Graceful fallback if nakshatra name variance
    }
  }

  // Final score clamping
  const finalScore = Math.max(0, Math.min(100, score));

  let rating: MuhuratWindow["rating"] = "Neutral";
  let badgeColor = "#eab308"; // Amber
  if (finalScore >= 75) {
    rating = "Highly Auspicious";
    badgeColor = "#22c55e"; // Emerald
  } else if (finalScore >= 55) {
    rating = "Favorable";
    badgeColor = "#38bdf8"; // Sky blue
  } else if (finalScore <= 40) {
    rating = "Avoid";
    badgeColor = "#ef4444"; // Red
  }

  const bestTimeOfDay = `Abhijit Muhurta (${panchang.abhijitMuhurta.start} – ${panchang.abhijitMuhurta.end})`;

  return {
    date: dateStr,
    weekday,
    panchangSummary: {
      tithi: panchang.tithi,
      nakshatra: panchang.nakshatra,
      yoga: panchang.yoga,
      karana: panchang.karana,
      abhijitMuhurta: `${panchang.abhijitMuhurta.start} – ${panchang.abhijitMuhurta.end}`,
      rahuKaal: `${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}`,
    },
    score: finalScore,
    rating,
    badgeColor,
    bestTimeOfDay,
    criteria,
    shastraSummary: `${rules.title} on ${weekday}, ${dateStr} scored ${finalScore}/100 based on ${panchang.tithi}, ${panchang.nakshatra}, and ${panchang.yoga}.`,
    isPersonalized,
  };
}

// ── Scanner for Upcoming Dates ───────────────────────────────────────────────
export function scanAuspiciousMuhurats(options: MuhuratScanOptions): MuhuratWindow[] {
  const {
    category,
    startDate = new Date(),
    daysToScan = 30,
    tz = 5.5,
    location = { lat: 28.6139, lon: 77.2090 },
    natalMoonNakshatra,
  } = options;

  const results: MuhuratWindow[] = [];
  const cur = new Date(startDate);

  for (let i = 0; i < daysToScan; i++) {
    const evalDate = new Date(cur);
    evalDate.setDate(cur.getDate() + i);

    const window = evaluateDateMuhurat(evalDate, category, tz, location, natalMoonNakshatra);
    results.push(window);
  }

  // Sort: Highly Auspicious first, then Favorable, chronologically
  return results.sort((a, b) => b.score - a.score);
}
