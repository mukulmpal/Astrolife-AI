/**
 * AstroLife – 9-Month Marriage Window Scanner
 * Scans next 9 months, evaluating all K.N. Rao parameters per month
 * Changes tracked: Antardasha change, Jupiter sign change
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { calculateChart, buildAntarDasha, type ChartData } from "./calculations";
import { analyzeMarriageTimingKNRao, type MarriageTimingInput, type TimingParameter, type BonusLayer } from "./marriage-timing-kn-rao";
import { buildJaiminiChart } from "./jaimini";

// ── Constants ─────────────────────────────────────────────────
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const SIGN_LORDS: Record<string, string> = {
  Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon",
  Leo:"Sun",   Virgo:"Mercury", Libra:"Venus",   Scorpio:"Mars",
  Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter",
};

// ── Helpers ────────────────────────────────────────────────────
function houseFrom(baseSign: string, targetSign: string): number {
  const b = SIGNS.indexOf(baseSign), t = SIGNS.indexOf(targetSign);
  if (b < 0 || t < 0) return 1;
  return ((t - b + 12) % 12) + 1;
}

function getD9LagnaNum(lagnaLon: number): number {
  return Math.floor((lagnaLon % 360) / (360 / 108)) % 12;
}

function pad2(n: number): string { return String(n).padStart(2, "0"); }

function midMonthDate(year: number, month0: number): { date: string; time: string } {
  return {
    date: `${year}-${pad2(month0 + 1)}-15`,
    time: "12:00",
  };
}

function getAntardashaForDate(chart: ChartData, targetDate: Date): {
  mahadasha: string;
  antardasha: string;
} {
  // Find mahadasha active on targetDate
  let md = chart.dashas.find(d => {
    const s = new Date(d.start).getTime();
    const e = new Date(d.end).getTime();
    const t = targetDate.getTime();
    return s <= t && t < e;
  });
  if (!md) md = chart.dashas.find(d => d.active) ?? chart.dashas[0];
  if (!md) return { mahadasha: "Venus", antardasha: "Saturn" };

  // Build antardasha sequence for that MD period
  const adSeq = buildAntarDasha(md.planet, new Date(md.start), md.yrs);
  const ad = adSeq.find(d => {
    const s = new Date(d.start).getTime();
    const e = new Date(d.end).getTime();
    const t = targetDate.getTime();
    return s <= t && t < e;
  }) ?? adSeq[0];

  return { mahadasha: md.planet, antardasha: ad?.planet ?? "Saturn" };
}

// ── Output Type ───────────────────────────────────────────────
export interface MonthlyMarriageWindow {
  month: string;            // "June 2026"
  date: string;             // "2026-06-15"
  monthIndex: number;       // 0–8
  mahadasha: string;
  antardasha: string;
  transitSaturnSign: string;
  transitSaturnHouse: number;
  transitJupiterSign: string;
  transitJupiterHouse: number;
  score: number;            // 0–100 (core)
  adjustedScore: number;    // core + bonus nudge (capped 100)
  bonusActiveCount: number;
  strengthLabel: string;    // "strong_window" etc.
  activeParameterCount: number;
  activeParams: string[];
  parameters: TimingParameter[];   // full P1–P8 breakdown for this month
  bonusLayers: BonusLayer[];       // full bonus layers for this month
  bonusScore: number;
  keyFactor: string;
  verdict: "weak" | "possible" | "moderate" | "strong" | "very_strong";
  isBest: boolean;
  scoreTrend: "up" | "down" | "stable";
  antardashaChanged: boolean;
  jupiterSignChanged: boolean;
}

export interface MarriageWindowScanResult {
  windows: MonthlyMarriageWindow[];
  bestWindow: MonthlyMarriageWindow | null;
  peakScore: number;
  lowestScore: number;
  averageScore: number;
  // Summary signals
  jupiterSignChangeMonths: string[];
  antardashaChangeMonths: string[];
  strongestMonth: string;
  overallOutlook: string;
}

// ── Dignity helper ─────────────────────────────────────────────
const EXALT_S: Record<string,string> = { Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra",Rahu:"Taurus",Ketu:"Scorpio" };
const DEBIT_S: Record<string,string> = { Sun:"Libra",Moon:"Scorpio",Mars:"Cancer",Mercury:"Pisces",Jupiter:"Capricorn",Venus:"Virgo",Saturn:"Aries" };
const OWN_S:   Record<string,string[]> = { Sun:["Leo"],Moon:["Cancer"],Mars:["Aries","Scorpio"],Mercury:["Gemini","Virgo"],Jupiter:["Sagittarius","Pisces"],Venus:["Taurus","Libra"],Saturn:["Capricorn","Aquarius"] };
function dignityOf(p: string, sign: string): string {
  if (EXALT_S[p]===sign) return "Exalted";
  if (DEBIT_S[p]===sign) return "Debilitated";
  if (OWN_S[p]?.includes(sign)) return "Own";
  return "—";
}

// ── Main Scanner ───────────────────────────────────────────────
export function scanMarriageWindows(chart: ChartData): MarriageWindowScanResult {
  // ── Static natal data (computed once) ─────────────────────
  const d1LagnaSign   = chart.lagnaRashi;
  const lagnaLord     = SIGN_LORDS[d1LagnaSign] ?? "Mars";
  const h7Sign        = chart.houseCusps.find(h => h.house === 7)?.sign ?? "Libra";
  const d1SeventhLord = SIGN_LORDS[h7Sign] ?? "Venus";

  const d9LagnaNum    = getD9LagnaNum(chart.lagnaLon);
  const d9LagnaSign   = SIGNS[d9LagnaNum] ?? "Aries";
  const d9SeventhNum  = (d9LagnaNum + 6) % 12;
  const d9SeventhSign = SIGNS[d9SeventhNum] ?? "Libra";
  const d9SeventhLord = SIGN_LORDS[d9SeventhSign] ?? "Venus";

  // D9 Venus & Jupiter (static)
  const venusD9Sign   = chart.planets.Venus?.navamsha   ?? "";
  const jupiterD9Sign = chart.planets.Jupiter?.navamsha ?? "";
  const venusD9House   = venusD9Sign   ? houseFrom(d9LagnaSign, venusD9Sign)   : 0;
  const jupiterD9House = jupiterD9Sign ? houseFrom(d9LagnaSign, jupiterD9Sign) : 0;
  const d9Venus   = { house: venusD9House,   sign: venusD9Sign,   dignity: venusD9Sign   ? dignityOf("Venus",   venusD9Sign)   : "—" };
  const d9Jupiter = { house: jupiterD9House, sign: jupiterD9Sign, dignity: jupiterD9Sign ? dignityOf("Jupiter", jupiterD9Sign) : "—" };

  // Natal Venus / Jupiter reference (static)
  const natalVenusSign    = chart.planets.Venus?.sign    ?? "";
  const natalVenusHouse   = chart.planets.Venus?.house   ?? 0;
  const natalJupiterSign  = chart.planets.Jupiter?.sign  ?? "";
  const natalJupiterHouse = chart.planets.Jupiter?.house ?? 0;

  // D1 Venus/Jupiter dignity (natal)
  const d1Venus   = chart.planets.Venus   ? { house: chart.planets.Venus.house,   sign: chart.planets.Venus.sign,   dignity: chart.planets.Venus.dignity }   : undefined;
  const d1Jupiter = chart.planets.Jupiter ? { house: chart.planets.Jupiter.house, sign: chart.planets.Jupiter.sign, dignity: chart.planets.Jupiter.dignity } : undefined;

  // Natal Moon (Chandra Lagna rules)
  const natalMoonSign  = chart.planets.Moon?.sign  ?? "";
  const natalMoonHouse = chart.planets.Moon?.house ?? 0;

  // D1 dasha-link helpers (for P1)
  const h2Sign  = chart.houseCusps.find(h => h.house === 2)?.sign  ?? "";
  const h11Sign = chart.houseCusps.find(h => h.house === 11)?.sign ?? "";
  const d1SecondLord   = h2Sign  ? (SIGN_LORDS[h2Sign]  ?? "") : "";
  const d1EleventhLord = h11Sign ? (SIGN_LORDS[h11Sign] ?? "") : "";
  const planetsInSeventh = Object.entries(chart.planets)
    .filter(([, p]) => p?.house === 7)
    .map(([name]) => name);

  // Full natal placements (for P1 connection web: aspect/conjunction/nakshatra)
  const natalPlanets: Record<string, { house: number; sign: string; nakshatraLord: string }> = {};
  for (const [name, p] of Object.entries(chart.planets)) {
    if (p) natalPlanets[name] = { house: p.house, sign: p.sign, nakshatraLord: p.nakshatraLord };
  }

  // ── Jaimini / bonus layer inputs — all static (natal), computed once ──
  let charaDashaSign = "", charaAntardashaSign = "", darakarakaSign = "", darakarakaNavamsha = "";
  let daraPadaSign = "", upapadaSign = "", upapadaLord = "";
  try {
    const jai = buildJaiminiChart(chart);
    charaDashaSign      = jai.currentDasha?.sign ?? "";
    charaAntardashaSign = (jai as any).activeAD?.adSign ?? "";
    const dk = jai.karakas.find((k: any) => k.role === "DK");
    if (dk) {
      darakarakaSign     = (dk as any).sign;
      darakarakaNavamsha = chart.planets[(dk as any).planet]?.navamsha ?? "";
    }
    daraPadaSign = jai.arudhas.find((a: any) => a.house === 7)?.sign  ?? "";
    upapadaSign  = jai.arudhas.find((a: any) => a.house === 12)?.sign ?? "";
    upapadaLord  = upapadaSign ? (SIGN_LORDS[upapadaSign] ?? "") : "";
  } catch { /* jaimini inputs stay empty → engine marks them unavailable */ }

  // 7th lord nakshatra dispositor
  const seventhLordNakshatraLord = chart.planets[d1SeventhLord]?.nakshatraLord ?? "";

  // Natal Mars (for P6 female)
  const natalMarsSign  = chart.planets.Mars?.sign  ?? "";
  const natalMarsHouse = chart.planets.Mars?.house ?? 0;

  // Vivah Saham — K.N. Rao formula: (LL_longitude + 7L_longitude) mod 360
  // This is the correct formula from K.N. Rao's book page 18.
  // NOT the classical Arabic lot formula (Venus − 7thCusp + Lagna).
  let vivahSahamSign = "";
  const lagnaLordLon      = chart.planets[lagnaLord]?.lon     ?? 0;
  const seventhLordLon    = chart.planets[d1SeventhLord]?.lon ?? 0;
  if (lagnaLordLon > 0 || seventhLordLon > 0) {
    const sahamLon   = ((lagnaLordLon + seventhLordLon) % 360 + 360) % 360;
    vivahSahamSign   = SIGNS[Math.floor(sahamLon / 30)] ?? "";
  }

  // ── Loop 9 months ───────────────────────────────────────────
  const now = new Date();
  const windows: MonthlyMarriageWindow[] = [];
  let prevAntardasha  = "";
  let prevJupiterSign = "";
  let prevScore       = -1;

  for (let i = 0; i < 9; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 15);
    const year   = targetDate.getFullYear();
    const month0 = targetDate.getMonth();
    const { date, time } = midMonthDate(year, month0);

    const monthName = targetDate.toLocaleString("en-IN", { month: "long", year: "numeric" });

    // Dasha for this month
    const { mahadasha, antardasha } = getAntardashaForDate(chart, targetDate);

    // Transit positions for this month — computed fresh from ephemeris.
    // No fake fallbacks: if calculation fails, transit params are omitted so the
    // engine marks them missing rather than scoring on invented positions.
    let transitOk = false;
    let saturnSign = "", jupiterSign = "", venusSign = "";
    let saturnHouse = 0, jupiterHouse = 0, venusHouse = 0;
    let lagnaLordTrSign = "", seventhLordTrSign = "";
    let lagnaLordTrHouse = 0, seventhLordTrHouse = 0;
    const transitPlanetHousesMap: Record<string, number> = {};

    try {
      const tc = calculateChart("window_scan", date, time, chart.city, chart.lat, chart.lon, chart.tz);
      saturnSign  = tc.planets.Saturn?.sign  ?? "";
      jupiterSign = tc.planets.Jupiter?.sign ?? "";
      venusSign   = tc.planets.Venus?.sign   ?? "";
      saturnHouse  = saturnSign  ? houseFrom(d1LagnaSign, saturnSign)  : 0;
      jupiterHouse = jupiterSign ? houseFrom(d1LagnaSign, jupiterSign) : 0;
      venusHouse   = venusSign   ? houseFrom(d1LagnaSign, venusSign)   : 0;
      lagnaLordTrSign   = tc.planets[lagnaLord]?.sign     ?? "";
      seventhLordTrSign = tc.planets[d1SeventhLord]?.sign ?? "";
      lagnaLordTrHouse   = lagnaLordTrSign   ? houseFrom(d1LagnaSign, lagnaLordTrSign)   : 0;
      seventhLordTrHouse = seventhLordTrSign ? houseFrom(d1LagnaSign, seventhLordTrSign) : 0;
      // P7 — transit planet houses
      for (const [name, planet] of Object.entries(tc.planets)) {
        if (planet?.sign) transitPlanetHousesMap[name] = houseFrom(d1LagnaSign, planet.sign);
      }
      transitOk = saturnSign !== "" && jupiterSign !== "";
    } catch { transitOk = false; }

    // D9 positions of current dasha lords (static — navamsha doesn't change)
    const mdLordD9Sign = chart.planets[mahadasha]?.navamsha  ?? "";
    const adLordD9Sign = chart.planets[antardasha]?.navamsha ?? "";
    const mdLordD9House = mdLordD9Sign ? houseFrom(d9LagnaSign, mdLordD9Sign) : 0;
    const adLordD9House = adLordD9Sign ? houseFrom(d9LagnaSign, adLordD9Sign) : 0;
    const mdVargottama = mdLordD9Sign !== "" && (chart.planets[mahadasha]?.sign === mdLordD9Sign);
    const adVargottama = adLordD9Sign !== "" && (chart.planets[antardasha]?.sign === adLordD9Sign);

    // Build full K.N. Rao input
    const input: MarriageTimingInput = {
      language: "hinglish",
      d1LagnaSign,
      d1LagnaLord: lagnaLord,
      d1Seventh: h7Sign,
      d1SeventhLord,
      d1Venus,
      d1Jupiter,
      d9LagnaSign,
      d9Seventh: d9SeventhSign,
      d9SeventhLord,
      d9Venus,
      d9Jupiter,
      d9MahadashaLordHouse:    mdLordD9House,
      d9AntardashaLordHouse:   adLordD9House,
      d9MahadashaLordDignity:  mdLordD9Sign ? dignityOf(mahadasha,  mdLordD9Sign) : "—",
      d9AntardashaLordDignity: adLordD9Sign ? dignityOf(antardasha, adLordD9Sign) : "—",
      mahadashaVargottama:  mdVargottama,
      antardashaVargottama: adVargottama,
      currentMahadasha:  mahadasha,
      currentAntardasha: antardasha,
      ...(transitOk ? {
        transitSaturn:        { sign: saturnSign,        house: saturnHouse },
        transitJupiter:       { sign: jupiterSign,       house: jupiterHouse },
        transitVenus:         { sign: venusSign,         house: venusHouse },
        transitLagnaLord:     { sign: lagnaLordTrSign,   house: lagnaLordTrHouse },
        transitSeventhLord:   { sign: seventhLordTrSign, house: seventhLordTrHouse },
        transitPlanetHouses:  transitPlanetHousesMap,
      } : {}),
      natalAscendant:    d1LagnaSign,
      natalSeventhSign:  h7Sign,
      natalVenusSign,
      natalVenusHouse,
      natalMarsSign,
      natalMarsHouse,
      natalJupiterSign,
      natalJupiterHouse,
      natalMoonSign,
      natalMoonHouse,
      d1SecondLord,
      d1EleventhLord,
      planetsInSeventh,
      natalPlanets,
      // Jaimini inputs (P2, O2)
      charaAntardashaSign,
      charaDashaSign,
      darakarakaSign,
      darakarakaNavamsha,
      daraPadaSign,
      upapadaSign,
      upapadaLord,
      vivahSahamSign,
      seventhLordNakshatraLord,
      // Gender — default male (Venus) unless chart provides explicit gender
      gender: undefined,
    };

    const result      = analyzeMarriageTimingKNRao(input);
    const activeParam = Object.values(result.parameters).filter(p => p.isActive);

    // Thresholds calibrated to binary count/8 × 100 scoring
    // 6/8=75, 5/8=63, 4/8=50, 3/8=38 → align with K.N. Rao research
    let verdict: MonthlyMarriageWindow["verdict"] = "weak";
    if      (result.timingScore >= 75) verdict = "very_strong";
    else if (result.timingScore >= 63) verdict = "strong";
    else if (result.timingScore >= 50) verdict = "moderate";
    else if (result.timingScore >= 38) verdict = "possible";

    // Key factor label
    const antardashaChanged = i > 0 && antardasha !== prevAntardasha;
    const jupiterSignChanged = i > 0 && jupiterSign !== prevJupiterSign;

    const keyFactor = (() => {
      if (antardashaChanged) return `✦ Antardasha changes to ${antardasha}`;
      if (jupiterSignChanged) return `♃ Jupiter enters ${jupiterSign} (H${jupiterHouse})`;
      if (activeParam.length > 0) return activeParam[0].name;
      return `MD:${mahadasha} / AD:${antardasha}`;
    })();

    const scoreTrend: MonthlyMarriageWindow["scoreTrend"] =
      prevScore < 0 ? "stable" :
      result.timingScore > prevScore + 3 ? "up" :
      result.timingScore < prevScore - 3 ? "down" : "stable";

    windows.push({
      month: monthName,
      date,
      monthIndex: i,
      mahadasha,
      antardasha,
      transitSaturnSign:  saturnSign,
      transitSaturnHouse: saturnHouse,
      transitJupiterSign:  jupiterSign,
      transitJupiterHouse: jupiterHouse,
      score: result.timingScore,
      adjustedScore: result.adjustedScore,
      bonusActiveCount: result.bonusActiveCount,
      strengthLabel: result.strengthLabel,
      activeParameterCount: activeParam.length,
      activeParams: activeParam.map(p => p.name),
      parameters: Object.values(result.parameters),
      bonusLayers: result.bonusLayers,
      bonusScore: result.bonusScore,
      keyFactor,
      verdict,
      isBest: false,
      scoreTrend,
      antardashaChanged,
      jupiterSignChanged,
    });

    prevAntardasha  = antardasha;
    prevJupiterSign = jupiterSign;
    prevScore       = result.timingScore;
  }

  // Mark best
  const peakScore = Math.max(...windows.map(w => w.score));
  windows.forEach(w => { w.isBest = w.score === peakScore; });

  const bestWindow    = windows.find(w => w.isBest) ?? null;
  const lowestScore   = Math.min(...windows.map(w => w.score));
  const averageScore  = Math.round(windows.reduce((s, w) => s + w.score, 0) / windows.length);

  const jupiterSignChangeMonths = windows.filter(w => w.jupiterSignChanged).map(w => w.month);
  const antardashaChangeMonths  = windows.filter(w => w.antardashaChanged).map(w => w.month);
  const strongestMonth = bestWindow?.month ?? windows[0]?.month ?? "";

  let overallOutlook = "Stable period — no major timing shifts in next 9 months.";
  if (peakScore >= 75)       overallOutlook = `Strong marriage window in ${strongestMonth} (${peakScore}/100 · K.N. Rao threshold met). Plan ahead.`;
  else if (peakScore >= 63)  overallOutlook = `Good windows present. Best in ${strongestMonth} (${peakScore}/100).`;
  else if (peakScore >= 50)  overallOutlook = `Moderate windows emerge. Best in ${strongestMonth} (${peakScore}/100).`;
  else if (peakScore >= 38)  overallOutlook = `Possible windows. Watch ${strongestMonth} for relationship decisions.`;
  if (antardashaChangeMonths.length) overallOutlook += ` Antardasha shift in ${antardashaChangeMonths[0]} — key transition point.`;
  if (jupiterSignChangeMonths.length) overallOutlook += ` Jupiter changes sign in ${jupiterSignChangeMonths[0]} — new energy activates.`;

  return {
    windows,
    bestWindow,
    peakScore,
    lowestScore,
    averageScore,
    jupiterSignChangeMonths,
    antardashaChangeMonths,
    strongestMonth,
    overallOutlook,
  };
}
