"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from "react";
import {
  listSavedCharts,
  loadSavedChart,
  type SavedChartSummary,
  useUserChart,
} from "@/lib/user-chart";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { calculateMilan, type MilanResult } from "@/lib/astro-engine/kundali-milan";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";
import { buildJaiminiChart } from "@/lib/astro-engine/jaimini";
import { scanMarriageWindows, type MarriageWindowScanResult, type MonthlyMarriageWindow } from "@/lib/astro-engine/marriage-window-scanner";

// ── Constants ─────────────────────────────────────────────────
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const SIGN_LORDS: Record<string, string> = {
  Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon",
  Leo:"Sun", Virgo:"Mercury", Libra:"Venus", Scorpio:"Mars",
  Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter",
};

function houseFrom(base: string, target: string): number {
  const b = SIGNS.indexOf(base), t = SIGNS.indexOf(target);
  if (b < 0 || t < 0) return 1;
  return ((t - b + 12) % 12) + 1;
}

function getD9LagnaNum(lon: number): number {
  return Math.floor((lon % 360) / (360 / 108)) % 12;
}

function currentDT(tz: number) {
  const now = new Date();
  const shifted = new Date(now.getTime() + tz * 3600000);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${shifted.getUTCFullYear()}-${p(shifted.getUTCMonth() + 1)}-${p(shifted.getUTCDate())}`,
    time: `${p(shifted.getUTCHours())}:${p(shifted.getUTCMinutes())}`,
  };
}

function scoreColor(s: number) {
  if (s >= 75) return "#22c55e";   // 6+/8
  if (s >= 63) return "#c8a030";   // 5/8
  if (s >= 50) return "#f97316";   // 4/8
  if (s >= 38) return "#60a5fa";   // 3/8
  return "#605890";
}

function verdictColor(v: string) {
  if (v === "very_strong") return "#22c55e";
  if (v === "strong")      return "#c8a030";
  if (v === "moderate")    return "#f97316";
  if (v === "possible")    return "#60a5fa";
  return "#605890";
}

function strengthDisplay(label: string) {
  if (label === "very_strong_activation" || label === "very_strong") return "Very Strong (6+/8)";
  if (label === "strong_window"           || label === "strong")      return "Strong (5/8)";
  if (label === "moderate_window"         || label === "moderate")    return "Moderate (4/8)";
  if (label === "possible_window"         || label === "possible")    return "Possible (3/8)";
  return "Weak (<3/8)";
}

function commitmentUseCase(w: MonthlyMarriageWindow): string {
  if (w.adjustedScore >= 75) return "Best for formal family discussion, engagement planning or final commitment review.";
  if (w.adjustedScore >= 63) return "Best for serious proposal talks, compatibility review and practical family alignment.";
  if (w.adjustedScore >= 50) return "Best for observation, conversations and clearing practical doubts before commitment.";
  return "Use as a low-pressure month; avoid forcing decisions only because timing looks active.";
}

function commitmentCaution(w: MonthlyMarriageWindow): string {
  const cautions: string[] = [];
  if (w.antardashaChanged) cautions.push("Antardasha changes this month, so decisions may need extra emotional patience.");
  if (w.jupiterSignChanged) cautions.push("Jupiter changes sign, so the relationship support pattern is shifting.");
  if (w.activeParameterCount < 4) cautions.push("Core timing parameters are below strong threshold.");
  if (w.bonusActiveCount > 0) cautions.push("Advanced observations support the window, but they are secondary to core promise.");
  return cautions.join(" ") || "No major timing caution detected; still combine with compatibility and real-life readiness.";
}

type PartnerReadiness = {
  score: number;
  adjustment: number;
  status: string;
  signals: string[];
  cautions: string[];
};

function partnerReadinessFromChart(chart: ChartData | null): PartnerReadiness | null {
  if (!chart) return null;

  const seventhSign = SIGNS[(chart.lagnaNum + 6) % 12] ?? "Libra";
  const seventhLord = SIGN_LORDS[seventhSign] ?? "Venus";
  const md = chart.dashas.find((entry) => entry.active)?.planet;
  const ad = chart.antardasha.find((entry) => entry.active)?.planet;
  const d9LagnaNum = getD9LagnaNum(chart.lagnaLon);
  const relationshipPlanets = ["Venus", "Jupiter", "Moon", seventhLord];
  const supportiveHouses = new Set([1, 4, 5, 7, 9, 10, 11]);
  const sensitiveHouses = new Set([6, 8, 12]);

  let score = 50;
  const signals: string[] = [];
  const cautions: string[] = [];

  const seventhLordData = chart.planets[seventhLord];
  if (seventhLordData && supportiveHouses.has(seventhLordData.house)) {
    score += 8;
    signals.push(`Partner D1 7th lord ${seventhLord} is in supportive H${seventhLordData.house}.`);
  } else if (seventhLordData && sensitiveHouses.has(seventhLordData.house)) {
    score -= 6;
    cautions.push(`Partner D1 7th lord ${seventhLord} is in sensitive H${seventhLordData.house}.`);
  }

  for (const planet of ["Venus", "Jupiter", "Moon"]) {
    const data = chart.planets[planet];
    if (!data) continue;
    if (supportiveHouses.has(data.house)) {
      score += planet === "Venus" ? 7 : 5;
      signals.push(`Partner ${planet} supports relationship themes from H${data.house}.`);
    } else if (sensitiveHouses.has(data.house)) {
      score -= planet === "Venus" ? 5 : 3;
      cautions.push(`Partner ${planet} needs care from H${data.house}.`);
    }
  }

  for (const planet of relationshipPlanets) {
    const data = chart.planets[planet];
    if (!data) continue;
    const d9SignNum = Math.floor((data.lon % 360) / (360 / 108)) % 12;
    const d9House = ((d9SignNum - d9LagnaNum + 12) % 12) + 1;
    if ([1, 5, 7, 9, 10, 11].includes(d9House)) {
      score += 3;
      signals.push(`Partner D9 ${planet} supports commitment from H${d9House}.`);
    } else if ([6, 8, 12].includes(d9House)) {
      score -= 2;
      cautions.push(`Partner D9 ${planet} asks patience from H${d9House}.`);
    }
  }

  if (md && relationshipPlanets.includes(md)) {
    score += 6;
    signals.push(`Partner active Mahadasha ${md} is relationship-relevant.`);
  }
  if (ad && relationshipPlanets.includes(ad)) {
    score += 4;
    signals.push(`Partner active Antardasha ${ad} supports relationship review.`);
  }

  const finalScore = Math.max(20, Math.min(95, Math.round(score)));
  const adjustment = finalScore >= 78 ? 8 : finalScore >= 68 ? 5 : finalScore >= 58 ? 2 : finalScore >= 45 ? 0 : -5;
  const status = finalScore >= 78 ? "Very Supportive" : finalScore >= 68 ? "Supportive" : finalScore >= 58 ? "Workable" : finalScore >= 45 ? "Mixed" : "Sensitive";

  return {
    score: finalScore,
    adjustment,
    status,
    signals: signals.slice(0, 5),
    cautions: cautions.slice(0, 4),
  };
}

function partnerFusionAdjustment(milan: MilanResult | null, readiness: PartnerReadiness | null = null) {
  const readinessAdjustment = readiness?.adjustment ?? 0;
  if (!milan) return 0;
  if (milan.percentage >= 80) return 8 + readinessAdjustment;
  if (milan.percentage >= 70) return 5 + readinessAdjustment;
  if (milan.percentage >= 58) return 2 + readinessAdjustment;
  if (milan.percentage >= 45) return -4 + readinessAdjustment;
  return -10 + readinessAdjustment;
}

function partnerFusedScore(w: MonthlyMarriageWindow, milan: MilanResult | null, readiness: PartnerReadiness | null = null) {
  return Math.max(0, Math.min(100, w.adjustedScore + partnerFusionAdjustment(milan, readiness)));
}

function partnerFusionNote(milan: MilanResult | null, readiness: PartnerReadiness | null = null) {
  if (!milan) return "Add partner chart to convert this from individual timing into partner-fusion timing.";
  const readinessText = readiness ? ` Partner readiness: ${readiness.status} (${readiness.score}/100).` : "";
  if (milan.percentage >= 80) return `Partner compatibility strongly supports this timing window.${readinessText}`;
  if (milan.percentage >= 70) return `Partner compatibility adds useful support to this timing window.${readinessText}`;
  if (milan.percentage >= 58) return `Partner compatibility is workable; use practical family alignment before final decisions.${readinessText}`;
  if (milan.percentage >= 45) return `Partner compatibility is mixed; treat high timing months as discussion windows, not automatic commitment months.${readinessText}`;
  return `Partner compatibility is sensitive; use timing only for clarity, counselling and careful review.${readinessText}`;
}

function moonMilanIndices(chart: ChartData) {
  const moon = chart.planets.Moon;
  if (!moon) return { nakIdx: 0, rashiIdx: 0 };
  return {
    nakIdx: Math.floor((moon.lon % 360) / (360 / 27)) % 27,
    rashiIdx: Math.floor((moon.lon % 360) / 30) % 12,
  };
}

function commitmentBreakdown(w: MonthlyMarriageWindow, milan: MilanResult | null) {
  const dashaParams = w.parameters.filter(p => /dasha|mahadasha|antardasha/i.test(p.name));
  const transitParams = w.parameters.filter(p => /transit|jupiter|saturn|venus/i.test(p.name));
  const divisionalParams = w.parameters.filter(p => /d9|navamsha|jaimini|darakaraka|upapada|saham|seventh/i.test(p.name));
  const average = (items: typeof w.parameters) => items.length
    ? Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length)
    : 0;
  return [
    { label: "Dasha", value: average(dashaParams), note: dashaParams.filter(p => p.isActive).length, placeholder: false },
    { label: "Transit", value: average(transitParams), note: transitParams.filter(p => p.isActive).length, placeholder: false },
    { label: "D9 / Promise", value: average(divisionalParams), note: divisionalParams.filter(p => p.isActive).length, placeholder: false },
    {
      label: "Compatibility",
      value: milan?.percentage ?? 0,
      note: milan?.totalScore ?? 0,
      placeholder: !milan,
    },
  ];
}

// ── Score Ring ────────────────────────────────────────────────
function ScoreRing({ score, size = 88 }: { score: number; size?: number }) {
  const r = size * 0.41, circ = 2 * Math.PI * r;
  const color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1c1840" strokeWidth={6} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:size*0.27,
          fontWeight:700, color, lineHeight:1 }}>{score}</div>
        <div style={{ fontSize:size*0.11, color:"#605890" }}>/ 100</div>
      </div>
    </div>
  );
}

// ── Mini Score Bar ────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ flex:1, height:6, background:"#1c1840", borderRadius:3, overflow:"hidden" }}>
      <div style={{ width:`${score}%`, height:"100%", background:color, borderRadius:3,
        transition:"width 0.8s ease" }} />
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────
type TabKey = "overview" | "windows" | "narrative" | "report";

interface AnalysisResult {
  backendJson: any;
  userFacingNarrative: string;
  formats: { dashboardCard: any; pdfSection: any };
  overallIntegration?: any;
}

// ── Main Component ─────────────────────────────────────────────
export function MarriageTimingAnalyzer() {
  const { chart, hasUserChart } = useUserChart();
  const [loading, setLoading]       = useState(false);
  const [scanning, setScanning]     = useState(false);
  const [error, setError]           = useState("");
  const [result, setResult]         = useState<AnalysisResult | null>(null);
  const [scanResult, setScanResult] = useState<MarriageWindowScanResult | null>(null);
  const [activeTab, setActiveTab]   = useState<TabKey>("overview");
  const [partnerChart, setPartnerChart] = useState<ChartData | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    dob: "",
    tob: "",
    city: "",
    lat: null as number | null,
    lon: null as number | null,
    tz: null as number | null,
  });
  const [partnerCity, setPartnerCity] = useState<CitySearchResult | null>(null);
  const [savedCharts, setSavedCharts] = useState<SavedChartSummary[]>([]);
  const [partnerSavedId, setPartnerSavedId] = useState("");

  useEffect(() => {
    listSavedCharts().then(setSavedCharts).catch(() => setSavedCharts([]));
  }, []);

  const partnerMilan = useMemo(() => {
    if (!chart || !hasUserChart || !partnerChart) return null;
    const self = moonMilanIndices(chart);
    const partner = moonMilanIndices(partnerChart);
    return calculateMilan(
      chart.name,
      self.nakIdx,
      self.rashiIdx,
      partnerChart.name,
      partner.nakIdx,
      partner.rashiIdx,
    );
  }, [chart, hasUserChart, partnerChart]);

  const partnerReadiness = useMemo(() => partnerReadinessFromChart(partnerChart), [partnerChart]);

  const fusedWindows = useMemo(() => {
    if (!scanResult) return [];
    return scanResult.windows
      .map((window) => ({
        window,
        fusedScore: partnerFusedScore(window, partnerMilan, partnerReadiness),
        compatibilityDelta: partnerFusionAdjustment(partnerMilan, partnerReadiness),
      }))
      .sort((a, b) => b.fusedScore - a.fusedScore);
  }, [partnerMilan, partnerReadiness, scanResult]);

  const bestFusionWindow = fusedWindows[0];
  const highlightedFusionWindow = bestFusionWindow
    ?? (scanResult?.bestWindow
      ? { window: scanResult.bestWindow, fusedScore: scanResult.bestWindow.score, compatibilityDelta: 0 }
      : null);

  const applyPartnerFromForm = () => {
    if (!partnerForm.name || !partnerForm.dob || !partnerForm.tob || !partnerForm.city) return;
    setPartnerChart(
      calculateChart(
        partnerForm.name,
        partnerForm.dob,
        partnerForm.tob,
        partnerForm.city,
        partnerForm.lat ?? undefined,
        partnerForm.lon ?? undefined,
        partnerForm.tz ?? undefined,
      ),
    );
  };

  const applyPartnerFromSaved = async (chartId: string) => {
    setPartnerSavedId(chartId);
    const loaded = await loadSavedChart(chartId);
    if (loaded) setPartnerChart(loaded);
  };

  // ── Extract ALL params from chart ───────────────────────────
  const params = useMemo(() => {
    if (!chart || !hasUserChart) return null;

    // Dasha
    const mahadasha  = chart.dashas.find(d => d.active)?.planet ?? "Venus";
    const antardasha = chart.antardasha.find(d => d.active)?.planet ?? "Saturn";

    // D1 natal
    const lagnaSign    = chart.lagnaRashi;
    const lagnaLord    = SIGN_LORDS[lagnaSign] ?? "Mars";
    const h7Sign       = chart.houseCusps.find(h => h.house === 7)?.sign ?? "Libra";
    const d1SeventhLord= SIGN_LORDS[h7Sign] ?? "Venus";

    // D9 computed
    const d9LagnaNum   = getD9LagnaNum(chart.lagnaLon);
    const d9LagnaSign  = SIGNS[d9LagnaNum] ?? "Aries";
    const d9SeventhNum = (d9LagnaNum + 6) % 12;
    const d9SeventhSign= SIGNS[d9SeventhNum] ?? "Libra";
    const d9SeventhLord= SIGN_LORDS[d9SeventhSign] ?? "Venus";

    // D9 planet positions via navamsha property
    const venusD9Sign   = chart.planets.Venus?.navamsha   ?? "";
    const jupiterD9Sign = chart.planets.Jupiter?.navamsha ?? "";
    const venusD9House   = venusD9Sign   ? houseFrom(d9LagnaSign, venusD9Sign)   : 0;
    const jupiterD9House = jupiterD9Sign ? houseFrom(d9LagnaSign, jupiterD9Sign) : 0;

    // D9 dignity helper
    const EXALT: Record<string,string> = { Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra",Rahu:"Taurus",Ketu:"Scorpio" };
    const DEBIT: Record<string,string> = { Sun:"Libra",Moon:"Scorpio",Mars:"Cancer",Mercury:"Pisces",Jupiter:"Capricorn",Venus:"Virgo",Saturn:"Aries" };
    const OWN:   Record<string,string[]> = { Sun:["Leo"],Moon:["Cancer"],Mars:["Aries","Scorpio"],Mercury:["Gemini","Virgo"],Jupiter:["Sagittarius","Pisces"],Venus:["Taurus","Libra"],Saturn:["Capricorn","Aquarius"] };
    const dignity = (p: string, sign: string) =>
      EXALT[p]===sign ? "Exalted" : DEBIT[p]===sign ? "Debilitated" : OWN[p]?.includes(sign) ? "Own" : "—";

    const venusD9Dignity   = venusD9Sign   ? dignity("Venus",   venusD9Sign)   : "—";
    const jupiterD9Dignity = jupiterD9Sign ? dignity("Jupiter", jupiterD9Sign) : "—";

    // D9 positions of current MD/AD lords
    const mdLordD9Sign = chart.planets[mahadasha]?.navamsha  ?? "";
    const adLordD9Sign = chart.planets[antardasha]?.navamsha ?? "";
    const mdLordD9House = mdLordD9Sign ? houseFrom(d9LagnaSign, mdLordD9Sign) : 0;
    const adLordD9House = adLordD9Sign ? houseFrom(d9LagnaSign, adLordD9Sign) : 0;
    const mdLordD9Dignity = mdLordD9Sign ? dignity(mahadasha, mdLordD9Sign) : "—";
    const adLordD9Dignity = adLordD9Sign ? dignity(antardasha, adLordD9Sign) : "—";
    const mdVargottama = mdLordD9Sign !== "" && (chart.planets[mahadasha]?.sign === mdLordD9Sign);
    const adVargottama = adLordD9Sign !== "" && (chart.planets[antardasha]?.sign === adLordD9Sign);

    // Natal Venus/Jupiter reference
    const natalVenusSign   = chart.planets.Venus?.sign   ?? "";
    const natalVenusHouse  = chart.planets.Venus?.house  ?? 0;
    const natalJupiterSign = chart.planets.Jupiter?.sign ?? "";
    const natalJupiterHouse= chart.planets.Jupiter?.house ?? 0;

    // Natal Moon (Chandra Lagna rules)
    const natalMoonSign  = chart.planets.Moon?.sign  ?? "";
    const natalMoonHouse = chart.planets.Moon?.house ?? 0;

    // D1 dasha-link helpers (P1)
    const h2Sign  = chart.houseCusps.find(h => h.house === 2)?.sign  ?? "";
    const h11Sign = chart.houseCusps.find(h => h.house === 11)?.sign ?? "";
    const d1SecondLord   = h2Sign  ? (SIGN_LORDS[h2Sign]  ?? "") : "";
    const d1EleventhLord = h11Sign ? (SIGN_LORDS[h11Sign] ?? "") : "";
    const planetsInSeventh = Object.entries(chart.planets)
      .filter(([, p]) => p?.house === 7)
      .map(([name]) => name);

    // Full natal placements (for P1 connection web)
    const natalPlanets: Record<string, { house: number; sign: string; nakshatraLord: string }> = {};
    for (const [name, p] of Object.entries(chart.planets)) {
      if (p) natalPlanets[name] = { house: p.house, sign: p.sign, nakshatraLord: p.nakshatraLord };
    }

    // ── Jaimini inputs — static (natal) ─────────────────────
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
    } catch { /* jaimini inputs stay empty */ }

    const seventhLordNakshatraLord = chart.planets[d1SeventhLord]?.nakshatraLord ?? "";

    // Natal Mars (for P6 female)
    const natalMarsSign  = chart.planets.Mars?.sign  ?? "";
    const natalMarsHouse = chart.planets.Mars?.house ?? 0;

    // Vivah Saham — K.N. Rao correct formula: (LL_lon + 7L_lon) mod 360 → sign
    let vivahSahamSign = "";
    const lagnaLordLon   = chart.planets[lagnaLord]?.lon     ?? 0;
    const d17LordLon     = chart.planets[d1SeventhLord]?.lon ?? 0;
    if (lagnaLordLon > 0 || d17LordLon > 0) {
      const sahamLon   = ((lagnaLordLon + d17LordLon) % 360 + 360) % 360;
      vivahSahamSign   = SIGNS[Math.floor(sahamLon / 30)] ?? "";
    }

    // Today's transits
    let saturnHouse = 1,  jupiterHouse = 1, venusHouse = 1;
    let saturnSign  = "", jupiterSign  = "", venusSign  = "";
    let lagnaLordTransitHouse = 1, seventhLordTransitHouse = 1;
    let lagnaLordTransitSign  = "", seventhLordTransitSign  = "";
    const transitPlanetHouses: Record<string, number> = {};

    try {
      const { date, time } = currentDT(chart.tz ?? 5.5);
      const tc = calculateChart("transit", date, time, chart.city, chart.lat, chart.lon, chart.tz);

      saturnSign   = tc.planets.Saturn?.sign  ?? "";
      jupiterSign  = tc.planets.Jupiter?.sign ?? "";
      venusSign    = tc.planets.Venus?.sign   ?? "";
      saturnHouse  = saturnSign  ? houseFrom(lagnaSign, saturnSign)  : (chart.planets.Saturn?.house  ?? 1);
      jupiterHouse = jupiterSign ? houseFrom(lagnaSign, jupiterSign) : (chart.planets.Jupiter?.house ?? 1);
      venusHouse   = venusSign   ? houseFrom(lagnaSign, venusSign)   : (chart.planets.Venus?.house   ?? 1);

      // Transit lagna lord
      lagnaLordTransitSign  = tc.planets[lagnaLord]?.sign ?? "";
      lagnaLordTransitHouse = lagnaLordTransitSign ? houseFrom(lagnaSign, lagnaLordTransitSign) : 1;

      // Transit 7th lord
      seventhLordTransitSign  = tc.planets[d1SeventhLord]?.sign ?? "";
      seventhLordTransitHouse = seventhLordTransitSign ? houseFrom(lagnaSign, seventhLordTransitSign) : 1;

      // P7 — transit planet houses from natal lagna
      for (const [name, planet] of Object.entries(tc.planets)) {
        if (planet?.sign) transitPlanetHouses[name] = houseFrom(lagnaSign, planet.sign);
      }

    } catch {
      saturnHouse  = chart.planets.Saturn?.house  ?? 1;
      jupiterHouse = chart.planets.Jupiter?.house ?? 1;
      venusHouse   = chart.planets.Venus?.house   ?? 1;
    }

    return {
      // Dasha
      mahadasha, antardasha,
      // D1
      lagnaSign, lagnaLord, h7Sign, d1SeventhLord,
      // D9
      d9LagnaSign, d9SeventhSign, d9SeventhLord,
      d9Venus:   { house: venusD9House,   sign: venusD9Sign,   dignity: venusD9Dignity   },
      d9Jupiter: { house: jupiterD9House, sign: jupiterD9Sign, dignity: jupiterD9Dignity },
      d9MahadashaLordHouse:  mdLordD9House,
      d9AntardashaLordHouse: adLordD9House,
      d9MahadashaLordDignity:  mdLordD9Dignity,
      d9AntardashaLordDignity: adLordD9Dignity,
      mdVargottama, adVargottama,
      // Natal Venus/Jupiter/Mars
      natalVenusSign, natalVenusHouse, natalMarsSign, natalMarsHouse, natalJupiterSign, natalJupiterHouse,
      // Natal Moon + dasha helpers
      natalMoonSign, natalMoonHouse, d1SecondLord, d1EleventhLord, planetsInSeventh, natalPlanets,
      // Jaimini inputs (P2, O2)
      charaAntardashaSign, charaDashaSign, darakarakaSign, darakarakaNavamsha, daraPadaSign,
      upapadaSign, upapadaLord, vivahSahamSign, seventhLordNakshatraLord,
      // Transit
      saturnHouse, saturnSign,
      jupiterHouse, jupiterSign,
      venusHouse, venusSign,
      lagnaLordTransitHouse, lagnaLordTransitSign,
      seventhLordTransitHouse, seventhLordTransitSign,
      transitPlanetHouses,
    };
  }, [chart]);

  // ── Auto-run current analysis ────────────────────────────────
  useEffect(() => {
    if (params) runCurrentAnalysis(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // ── Run 9-month scan (on demand or auto) ────────────────────
  useEffect(() => {
    if (chart && hasUserChart) runWindowScan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, hasUserChart]);

  async function runCurrentAnalysis(p: typeof params) {
    if (!p) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch("/api/astro/marriage-timing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knRaoTiming: {
            language: "hinglish",
            // D1
            d1LagnaSign:    p.lagnaSign,
            d1LagnaLord:    p.lagnaLord,
            d1Seventh:      p.h7Sign,
            d1SeventhLord:  p.d1SeventhLord,
            d1Venus:        { house: p.natalVenusHouse,   sign: p.natalVenusSign,   dignity: "—" },
            d1Jupiter:      { house: p.natalJupiterHouse, sign: p.natalJupiterSign, dignity: "—" },
            // D9
            d9LagnaSign:    p.d9LagnaSign,
            d9Seventh:      p.d9SeventhSign,
            d9SeventhLord:  p.d9SeventhLord,
            d9Venus:        p.d9Venus,
            d9Jupiter:      p.d9Jupiter,
            // D9 dasha lords
            d9MahadashaLordHouse:    p.d9MahadashaLordHouse,
            d9AntardashaLordHouse:   p.d9AntardashaLordHouse,
            d9MahadashaLordDignity:  p.d9MahadashaLordDignity,
            d9AntardashaLordDignity: p.d9AntardashaLordDignity,
            mahadashaVargottama:     p.mdVargottama,
            antardashaVargottama:    p.adVargottama,
            // Dasha
            currentMahadasha:  p.mahadasha,
            currentAntardasha: p.antardasha,
            // Transits
            transitSaturn:        { sign: p.saturnSign,  house: p.saturnHouse },
            transitJupiter:       { sign: p.jupiterSign, house: p.jupiterHouse },
            transitVenus:         { sign: p.venusSign,   house: p.venusHouse },
            transitLagnaLord:     { sign: p.lagnaLordTransitSign,   house: p.lagnaLordTransitHouse },
            transitSeventhLord:   { sign: p.seventhLordTransitSign, house: p.seventhLordTransitHouse },
            // Natal reference
            natalAscendant:    p.lagnaSign,
            natalSeventhSign:  p.h7Sign,
            natalVenusSign:    p.natalVenusSign,
            natalVenusHouse:   p.natalVenusHouse,
            natalJupiterSign:  p.natalJupiterSign,
            natalJupiterHouse: p.natalJupiterHouse,
            natalMarsSign:     p.natalMarsSign,
            natalMarsHouse:    p.natalMarsHouse,
            natalMoonSign:     p.natalMoonSign,
            natalMoonHouse:    p.natalMoonHouse,
            // Dasha-link helpers (P1)
            d1SecondLord:      p.d1SecondLord,
            d1EleventhLord:    p.d1EleventhLord,
            planetsInSeventh:  p.planetsInSeventh,
            natalPlanets:      p.natalPlanets,
            // Jaimini inputs (P2, O2)
            charaAntardashaSign:       p.charaAntardashaSign,
            charaDashaSign:            p.charaDashaSign,
            darakarakaSign:            p.darakarakaSign,
            darakarakaNavamsha:        p.darakarakaNavamsha,
            daraPadaSign:              p.daraPadaSign,
            upapadaSign:               p.upapadaSign,
            upapadaLord:               p.upapadaLord,
            vivahSahamSign:            p.vivahSahamSign,
            seventhLordNakshatraLord:  p.seventhLordNakshatraLord,
            // P7 transit cluster
            transitPlanetHouses:       p.transitPlanetHouses,
          },
          outputFormat: "full",
          partnerGunaMilan: partnerMilan
            ? {
                totalScore: partnerMilan.totalScore,
                maxScore: partnerMilan.maxScore,
                percentage: partnerMilan.percentage,
                verdict: partnerMilan.verdict,
                partnerName: partnerChart?.name,
              }
            : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error ?? "Analysis failed"); return; }
      setResult(data.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  function runWindowScan() {
    if (!chart) return;
    setScanning(true);
    // Run synchronously in next tick to avoid blocking render
    setTimeout(() => {
      try {
        const scanData = scanMarriageWindows(chart);
        setScanResult(scanData);
      } catch (e) {
        console.error("Window scan failed:", e);
      } finally { setScanning(false); }
    }, 100);
  }

  // ── Empty state ──────────────────────────────────────────────
  if (!chart || !hasUserChart) {
    return (
      <div className="empty">
        <div className="empty-icon">💍</div>
        <div className="empty-text">Birth Chart Required</div>
        <p style={{ fontSize:13, color:"#605890" }}>Generate your kundli first to see K.N. Rao marriage timing analysis.</p>
      </div>
    );
  }

  const score    = result?.backendJson?.timingScore ?? 0;
  const active   = result?.backendJson?.activeParameterCount ?? 0;
  const strength = result?.backendJson?.strengthLabel ?? "";
  const adjustedScore = result?.backendJson?.adjustedScore ?? score;
  const bonusScore    = result?.backendJson?.bonusScore ?? 0;
  const bonusActive   = result?.backendJson?.bonusActiveCount ?? 0;
  const bonusTotal    = result?.backendJson?.bonusTotalCount ?? 0;
  const bonusLayers   = (result?.backendJson?.bonusLayers ?? []) as Array<{
    id: string; name: string; rule: string; points: number; maxBonus: number; isActive: boolean; evidence: string[];
  }>;

  // ── TABS CONFIG ──────────────────────────────────────────────
  const TABS: [TabKey, string][] = [
    ["overview",  "💍 Overview"],
    ["windows",   "📅 9 Months"],
    ["narrative", "📝 Analysis"],
    ["report",    "📋 Report"],
  ];

  return (
    <>
      {/* ── HEADER CARD ─────────────────────────────────────── */}
      <div className="header-card" style={{ marginBottom:16 }}>
        <div className="header-orb" />
        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>

          {loading ? (
            <div style={{ width:88, height:88, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:40, color:"#c8a030" }}>✦</div>
            </div>
          ) : result ? (
            <ScoreRing score={score} />
          ) : (
            <div style={{ width:88, height:88, borderRadius:"50%", border:"2px dashed #1c1840",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:32 }}>💍</span>
            </div>
          )}

          <div style={{ flex:1 }}>
            <div className="page-tag" style={{ marginBottom:4 }}>💍 K.N. RAO MARRIAGE TIMING ENGINE</div>
            <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:600,
              color:"#f0e8d0", marginBottom:6 }}>
              {chart.name}&apos;s Commitment Readiness Analysis
            </div>
            {result && !loading && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                background:`${scoreColor(score)}18`, border:`1px solid ${scoreColor(score)}44`,
                borderRadius:8, padding:"4px 12px" }}>
                <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:14, fontWeight:700,
                  color:scoreColor(score) }}>
                  {strengthDisplay(strength)} Readiness
                </span>
              </div>
            )}
            {loading && (
              <div style={{ fontSize:12, color:"#605890" }}>Analyzing K.N. Rao parameters...</div>
            )}
          </div>

          {result && !loading && (
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <div className="hstat">
                <div className="hstat-n" style={{ color:scoreColor(score) }}>{score}</div>
                <div className="hstat-l">SCORE</div>
              </div>
              <div className="hstat">
                <div className="hstat-n" style={{ color:"#22c55e" }}>{active}/8</div>
                <div className="hstat-l">FULFILLED</div>
              </div>
              {scanResult && (
                <div className="hstat">
                  <div className="hstat-n" style={{ color:scoreColor(scanResult.peakScore) }}>
                    {scanResult.peakScore}
                  </div>
                  <div className="hstat-l">PEAK 9M</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── PARAMS CHIP STRIP ───────────────────────────────── */}
      {params && (
        <div className="summary-strip" style={{ marginBottom:16, fontSize:12, lineHeight:2 }}>
          <span style={{ color:"#605890", marginRight:6 }}>Chart auto-linked:</span>
          <span className="planet-pill" style={{ marginRight:6 }}>MD: {params.mahadasha}</span>
          <span className="planet-pill" style={{ marginRight:6 }}>AD: {params.antardasha}</span>
          <span className="planet-pill" style={{ marginRight:6 }}>D1-7L: {params.d1SeventhLord}</span>
          <span className="planet-pill" style={{ marginRight:6 }}>D9-7L: {params.d9SeventhLord}</span>
          <span className="planet-pill" style={{ marginRight:6 }}>♄ H{params.saturnHouse} {params.saturnSign}</span>
          <span className="planet-pill" style={{ marginRight:6 }}>♃ H{params.jupiterHouse} {params.jupiterSign}</span>
          <span className="planet-pill" style={{ marginRight:6 }}>♀ H{params.venusHouse} {params.venusSign}</span>
          {params.mdVargottama && <span className="badge badge-gold" style={{ marginRight:6 }}>MD Vargottama</span>}
          {params.adVargottama && <span className="badge badge-purple">AD Vargottama</span>}
        </div>
      )}

      {/* ── PARTNER COMPATIBILITY ─────────────────────────── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-tag">PARTNER CHART (GUNA MILAN)</div>
        <div className="card-title serif" style={{ marginBottom: 10 }}>
          Optional partner compatibility
        </div>
        <p style={{ fontSize: 12, color: "#605890", marginBottom: 12, lineHeight: 1.6 }}>
          Add a partner birth chart or pick a saved chart to score Ashtakoot (36-point) compatibility in commitment windows.
        </p>
        {savedCharts.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#605890", marginBottom: 6, letterSpacing: 1 }}>SAVED CHART</div>
            <select
              value={partnerSavedId}
              onChange={(e) => {
                const id = e.target.value;
                if (id) applyPartnerFromSaved(id);
                else setPartnerChart(null);
              }}
              style={{
                width: "100%",
                background: "#08051a",
                border: "1px solid #1c1840",
                borderRadius: 8,
                padding: "10px 12px",
                color: "#f0e8d0",
                fontSize: 12,
              }}
            >
              <option value="">— Select saved chart —</option>
              {savedCharts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.dob}
                </option>
              ))}
            </select>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 10 }}>
          <input
            placeholder="Partner name"
            value={partnerForm.name}
            onChange={(e) => setPartnerForm((f) => ({ ...f, name: e.target.value }))}
            className="pr-input"
            style={{ background: "#08051a", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 12px", color: "#f0e8d0", fontSize: 12 }}
          />
          <input
            type="date"
            value={partnerForm.dob}
            onChange={(e) => setPartnerForm((f) => ({ ...f, dob: e.target.value }))}
            style={{ background: "#08051a", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 12px", color: "#f0e8d0", fontSize: 12 }}
          />
          <input
            type="time"
            value={partnerForm.tob}
            onChange={(e) => setPartnerForm((f) => ({ ...f, tob: e.target.value }))}
            style={{ background: "#08051a", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 12px", color: "#f0e8d0", fontSize: 12 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <CityAutocomplete
            label="Partner birth place"
            value={partnerCity}
            onChange={(city) => {
              setPartnerCity(city);
              if (!city) return;
              setPartnerForm((f) => ({
                ...f,
                city: city.displayName,
                lat: city.latitude,
                lon: city.longitude,
              }));
            }}
          />
        </div>
        <button
          type="button"
          onClick={applyPartnerFromForm}
          style={{
            background: "rgba(200,160,48,0.15)",
            border: "1px solid rgba(200,160,48,0.35)",
            borderRadius: 8,
            padding: "10px 16px",
            color: "#e8cf8b",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Calculate partner chart
        </button>
        {partnerMilan && (
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, border: `1px solid ${partnerMilan.verdictColor}44`, background: `${partnerMilan.verdictColor}10` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: partnerMilan.verdictColor }}>
              {partnerMilan.totalScore}/{partnerMilan.maxScore} Guna · {partnerMilan.verdict}
            </div>
            <p style={{ fontSize: 12, color: "#c8c0a8", marginTop: 6, lineHeight: 1.6 }}>{partnerMilan.recommendation}</p>
          </div>
        )}
        {partnerReadiness && (
          <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: 10, border: `1px solid ${scoreColor(partnerReadiness.score)}44`, background: `${scoreColor(partnerReadiness.score)}10` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor(partnerReadiness.score) }}>
                Partner Chart Readiness · {partnerReadiness.status}
              </div>
              <span className="badge" style={{ color: scoreColor(partnerReadiness.score), border: `1px solid ${scoreColor(partnerReadiness.score)}44`, background: `${scoreColor(partnerReadiness.score)}14` }}>
                {partnerReadiness.score}/100
              </span>
            </div>
            <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8 }}>
              <div style={{ fontSize: 11, color: "#86efac", lineHeight: 1.55 }}>
                <strong>Supports:</strong> {partnerReadiness.signals.length ? partnerReadiness.signals.slice(0, 2).join(" ") : "No major partner support signal detected yet."}
              </div>
              <div style={{ fontSize: 11, color: "#fca5a5", lineHeight: 1.55 }}>
                <strong>Cautions:</strong> {partnerReadiness.cautions.length ? partnerReadiness.cautions.slice(0, 2).join(" ") : "No major partner readiness caution detected."}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ERROR ───────────────────────────────────────────── */}
      {error && (
        <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:10,
          background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
          color:"#fca5a5", fontSize:13 }}>
          ⚠️ {error}&nbsp;
          <button onClick={() => runCurrentAnalysis(params)} style={{ padding:"4px 10px",
            borderRadius:6, border:"1px solid rgba(239,68,68,0.4)", background:"transparent",
            color:"#fca5a5", cursor:"pointer", fontSize:11 }}>Retry</button>
        </div>
      )}

      {/* ── TABS ────────────────────────────────────────────── */}
      <div className="tabs" style={{ marginBottom:20 }}>
        {TABS.map(([key, label]) => (
          <button key={key} className={`tab${activeTab === key ? " active" : ""}`}
            onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      {/* ══════════════════════ OVERVIEW TAB ══════════════════ */}
      {activeTab === "overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {loading && <LoadingCard name={chart.name} />}

          {result && !loading && (
            <>
              {/* Score + Strength Card */}
              <div className="card" style={{ borderColor:`${scoreColor(score)}33` }}>
                <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                  <ScoreRing score={score} size={96} />
                  <div style={{ flex:1 }}>
                    <div className="card-tag">TIMING WINDOW — K.N. RAO RESEARCH LAYER</div>
                    <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:22, fontWeight:700,
                      color:scoreColor(score), marginBottom:6 }}>
                      {strengthDisplay(strength)} Readiness
                    </div>
                    <div style={{ fontSize:13, color:"#c8c0a8", lineHeight:1.8 }}>
                      {result.formats?.dashboardCard?.brief}
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                      {[
                        { label:"Fulfilled",          val:`${active}/8 √`,   col:"#22c55e"        },
                        { label:"Core Score",         val:`${score}/100`,    col:scoreColor(score) },
                        { label:"Observations",       val:`${bonusActive}/${bonusTotal} (+${bonusScore})`, col:"#38bdf8" },
                        { label:"Adjusted",           val:`${adjustedScore}/100`, col:scoreColor(adjustedScore) },
                        { label:"Strength",           val:strengthDisplay(strength), col:scoreColor(score) },
                      ].map(stat => (
                        <div key={stat.label} style={{ padding:"6px 14px", borderRadius:8,
                          background:`${stat.col}18`, border:`1px solid ${stat.col}44`,
                          fontSize:12, color:stat.col, fontWeight:600 }}>
                          {stat.label}: {stat.val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 8-Parameter Breakdown */}
              {result.backendJson?.parameters && (
                <div className="card">
                  <div className="card-tag">✦ 8-PARAMETER BREAKDOWN — K.N. RAO BINARY √/×</div>
                  <div className="card-title serif" style={{ marginBottom:4 }}>
                    {active}/8 Fulfilled — {active >= 6 ? "K.N. Rao Threshold Met ✦" : active >= 4 ? "Moderate Support" : "Below Threshold"}
                  </div>
                  <div style={{ fontSize:11, color:"#605890", marginBottom:14 }}>
                    √ = fulfilled (binary) · ~ = partial · × = not met · 6+/8 = strong commitment-support period per K.N. Rao research
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {Object.values(result.backendJson.parameters as Record<string, any>).map((p: any) => {
                      const isFulfilled = p.fulfilled === true;
                      const isPartial   = !isFulfilled && p.score >= 50;
                      const badge = isFulfilled ? "√" : isPartial ? "~" : "×";
                      const badgeCol = isFulfilled ? "#22c55e" : isPartial ? "#f97316" : "#3a3060";
                      const borderCol = isFulfilled ? "rgba(34,197,94,0.3)" : isPartial ? "rgba(249,115,22,0.2)" : "#1c1840";
                      const bg = isFulfilled ? "rgba(34,197,94,0.04)" : isPartial ? "rgba(249,115,22,0.03)" : "transparent";
                      return (
                        <div key={p.id} style={{ padding:"12px 16px", borderRadius:10,
                          border:`1px solid ${borderCol}`, background: bg,
                          display:"flex", alignItems:"center", gap:14 }}>
                          <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
                            background: `${badgeCol}22`, border:`1px solid ${badgeCol}55`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontFamily:"monospace", fontSize:14, fontWeight:700, color:badgeCol }}>
                            {badge}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:"#f0e8d0", marginBottom:2 }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize:11, color:"#605890" }}>{p.description}</div>
                            {p.evidence?.length > 0 && (
                              <div style={{ fontSize:11, color: isFulfilled ? "#86efac" : isPartial ? "#fb923c" : "#605890",
                                marginTop:4, lineHeight:1.5 }}>
                                {p.evidence[0]}
                              </div>
                            )}
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, minWidth:60 }}>
                            <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:700,
                              color: badgeCol }}>{badge}</div>
                            {isFulfilled && (
                              <div style={{ fontSize:9, color:"#22c55e", letterSpacing:1, fontWeight:700 }}>FULFILLED</div>
                            )}
                            {isPartial && (
                              <div style={{ fontSize:9, color:"#f97316", letterSpacing:1, fontWeight:700 }}>PARTIAL</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* K.N. Rao Observations (O2/O3) */}
              {bonusLayers.length > 0 && (
                <div className="card" style={{ borderColor:"rgba(56,189,248,0.25)" }}>
                  <div className="card-tag">✦ K.N. RAO OBSERVATIONS — O2 / O3</div>
                  <div className="card-title serif" style={{ marginBottom:6 }}>
                    Supporting Observations — {bonusActive}/{bonusTotal} active
                  </div>
                  <div style={{ fontSize:11, color:"#605890", marginBottom:14, lineHeight:1.6 }}>
                    O2 and O3 are supporting observations from K.N. Rao&apos;s framework — not core parameters.
                    They add a small confidence nudge (+{bonusScore}) to the core {score}/100.
                    Adjusted: <strong style={{ color:scoreColor(adjustedScore) }}>{adjustedScore}/100</strong>.
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {bonusLayers.map(b => (
                      <div key={b.id} style={{ padding:"12px 16px", borderRadius:10,
                        border:`1px solid ${b.isActive ? "rgba(56,189,248,0.35)" : "#1c1840"}`,
                        background: b.isActive ? "rgba(56,189,248,0.05)" : "transparent" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                            background: b.isActive ? "#38bdf8" : "#1c1840",
                            boxShadow: b.isActive ? "0 0 8px rgba(56,189,248,0.5)" : "none" }} />
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:"#f0e8d0" }}>{b.name}</div>
                            <div style={{ fontSize:11, color:"#605890" }}>{b.rule}</div>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2, minWidth:60 }}>
                            <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontWeight:700,
                              color: b.isActive ? "#38bdf8" : "#3a3060" }}>+{b.points}<span style={{ fontSize:10, color:"#605890" }}>/{b.maxBonus}</span></div>
                            {b.isActive && <div style={{ fontSize:9, color:"#38bdf8", letterSpacing:1, fontWeight:700 }}>✓ ACTIVE</div>}
                          </div>
                        </div>
                        {b.isActive && b.evidence.length > 0 && (
                          <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #1c1840",
                            fontSize:11, color:"#c8c0a8", lineHeight:1.6 }}>
                            {b.evidence[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Note */}
              <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(0,0,0,0.2)",
                border:"1px solid #1c1840", fontSize:11, color:"#3a3060", textAlign:"center" }}>
                ⚠️ No fixed destiny predictions. K.N. Rao framework is for timing confidence, not certainty.
                Combine with D1 promise, D9 quality, Ashtakoot compatibility and practical readiness.
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════ 9-MONTH WINDOW TAB ═══════════ */}
      {activeTab === "windows" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {(scanning || (!scanResult && !error)) && (
            <div className="card" style={{ textAlign:"center", padding:40 }}>
              <div style={{ fontSize:32, color:"#c8a030", marginBottom:12 }}>📅</div>
              <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, color:"#f0e8d0", marginBottom:8 }}>
                Scanning 9 Months...
              </div>
              <div style={{ fontSize:12, color:"#605890" }}>
                Calculating antardasha + transit positions for each month
              </div>
            </div>
          )}

          {scanResult && !scanning && (
            <>
              {/* Outlook Banner */}
              <div className="summary-strip" style={{
                borderColor:`${scoreColor(scanResult.peakScore)}44`,
                color:"#c8c0a8" }}>
                🔭 {scanResult.overallOutlook}
              </div>

              {/* Best Window Highlight */}
              {highlightedFusionWindow && (
                <div className="card" style={{ borderColor:"rgba(200,160,48,0.4)",
                  background:"linear-gradient(135deg,rgba(200,160,48,0.06),rgba(232,121,249,0.04))" }}>
                  <div className="card-tag">⭐ BEST PARTNER-FUSION SUPPORT WINDOW NEXT 9 MONTHS</div>
                  <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                    <ScoreRing score={highlightedFusionWindow.fusedScore} size={80} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:22, fontWeight:700,
                        color:"#c8a030", marginBottom:4 }}>
                        {highlightedFusionWindow.window.month}
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <span className="badge badge-gold">MD: {highlightedFusionWindow.window.mahadasha}</span>
                        <span className="badge badge-purple">AD: {highlightedFusionWindow.window.antardasha}</span>
                        <span className="badge badge-blue">♄ H{highlightedFusionWindow.window.transitSaturnHouse}</span>
                        <span className="badge badge-blue">♃ H{highlightedFusionWindow.window.transitJupiterHouse}</span>
                        <span className="badge badge-green">{highlightedFusionWindow.window.activeParameterCount}/8 Active</span>
                        {partnerMilan && (
                          <span className="badge" style={{ color: partnerMilan.verdictColor, border: `1px solid ${partnerMilan.verdictColor}44`, background: `${partnerMilan.verdictColor}12` }}>
                            Partner {partnerMilan.percentage}/100
                          </span>
                        )}
                      </div>
                      {highlightedFusionWindow.window.activeParams.length > 0 && (
                        <div style={{ marginTop:10, fontSize:12, color:"#605890" }}>
                          Active: {highlightedFusionWindow.window.activeParams.join(" · ")}
                        </div>
                      )}
                      <div style={{ marginTop:10, fontSize:12, color:"#c8c0a8", lineHeight:1.7 }}>
                        {commitmentUseCase(highlightedFusionWindow.window)} {partnerFusionNote(partnerMilan, partnerReadiness)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="card-tag">TOP 5 READINESS WINDOWS</div>
                <div className="card-title serif" style={{ marginBottom:6 }}>
                  Partner-Fusion Commitment Planner
                </div>
                <div style={{ fontSize:12, color:"#605890", marginBottom:14, lineHeight:1.6 }}>
                  These are not fixed wedding dates. When partner chart is added, ranking combines timing strength with Ashtakoot compatibility.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(fusedWindows.length ? fusedWindows : scanResult.windows.map((window) => ({ window, fusedScore: window.adjustedScore, compatibilityDelta: 0 })))
                    .slice(0, 5)
                    .map(({ window: w, fusedScore, compatibilityDelta }, index) => {
                      const col = scoreColor(fusedScore);
                      return (
                        <div key={`top-window-${w.date}`} style={{ padding:"14px 16px", borderRadius:12, border:`1px solid ${col}33`, background:"rgba(0,0,0,0.18)" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", marginBottom:8 }}>
                            <div>
                              <div style={{ fontSize:12, color:"#605890", marginBottom:2 }}>#{index + 1}</div>
                              <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontWeight:700, color:"#f0e8d0" }}>{w.month}</div>
                            </div>
                            <span className="badge" style={{ background:`${col}18`, color:col, border:`1px solid ${col}44` }}>
                              {fusedScore}/100
                            </span>
                          </div>
                          <div style={{ fontSize:12, color:"#c8c0a8", lineHeight:1.65, marginBottom:10 }}>{commitmentUseCase(w)}</div>
                          <div style={{ fontSize:11, color:partnerMilan ? partnerMilan.verdictColor : "#8f86ad", lineHeight:1.6, marginBottom:10 }}>
                            {partnerFusionNote(partnerMilan, partnerReadiness)}
                            {partnerMilan && ` Partner-fusion adjustment: ${compatibilityDelta >= 0 ? "+" : ""}${compatibilityDelta} points.`}
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:8, marginBottom:10 }}>
                            {commitmentBreakdown(w, partnerMilan).map(item => (
                              <div key={item.label} style={{ padding:"8px 10px", borderRadius:8, border:"1px solid #1c1840", background:"rgba(255,255,255,0.02)" }}>
                                <div style={{ fontSize:10, color:"#605890", textTransform:"uppercase", letterSpacing:1 }}>{item.label}</div>
                                <div style={{ fontSize:13, color:item.placeholder ? "#8f86ad" : scoreColor(item.value), fontWeight:700, marginTop:3 }}>
                                  {item.placeholder ? "Add partner chart" : `${item.value}/100`}
                                </div>
                                {!item.placeholder && <div style={{ fontSize:10, color:"#605890" }}>{item.note} active signals</div>}
                              </div>
                            ))}
                          </div>
                          <div style={{ fontSize:11, color:"#8f86ad", lineHeight:1.6 }}>{commitmentCaution(w)}</div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Month-by-Month Timeline */}
              <div className="card">
                <div className="card-tag">📅 MONTH-BY-MONTH TIMING SCAN</div>
                <div className="card-title serif" style={{ marginBottom:16 }}>
                  9-Month Readiness Window Timeline
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {scanResult.windows.map((w) => (
                    <MonthRow key={w.date} w={w} />
                  ))}
                </div>
              </div>

              {/* Key Events Legend */}
              {(scanResult.jupiterSignChangeMonths.length > 0 || scanResult.antardashaChangeMonths.length > 0) && (
                <div className="card">
                  <div className="card-tag">⚡ KEY TRANSITIONS IN THIS PERIOD</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
                    {scanResult.antardashaChangeMonths.map(m => (
                      <div key={m} style={{ display:"flex", alignItems:"center", gap:10,
                        padding:"10px 14px", borderRadius:8,
                        background:"rgba(232,121,249,0.08)", border:"1px solid rgba(232,121,249,0.25)" }}>
                        <span style={{ fontSize:18 }}>✦</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#e879f9" }}>Antardasha Change</div>
                          <div style={{ fontSize:11, color:"#605890" }}>{m} — new sub-period energy activates</div>
                        </div>
                      </div>
                    ))}
                    {scanResult.jupiterSignChangeMonths.map(m => (
                      <div key={m} style={{ display:"flex", alignItems:"center", gap:10,
                        padding:"10px 14px", borderRadius:8,
                        background:"rgba(234,179,8,0.08)", border:"1px solid rgba(234,179,8,0.25)" }}>
                        <span style={{ fontSize:18 }}>♃</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#eab308" }}>Jupiter Sign Change</div>
                          <div style={{ fontSize:11, color:"#605890" }}>{m} — Jupiter enters new sign, marriage house changes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Score summary */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[
                  { label:"Peak Score", val:scanResult.peakScore,   sub:scanResult.strongestMonth },
                  { label:"Avg Score",  val:scanResult.averageScore, sub:"9-month average" },
                  { label:"Low Score",  val:scanResult.lowestScore,  sub:"weakest month" },
                ].map(s => (
                  <div key={s.label} className="idx-card" style={{
                    borderColor:`${scoreColor(s.val)}33` }}>
                    <div className="idx-n" style={{ color:scoreColor(s.val) }}>{s.val}</div>
                    <div className="idx-l">{s.label}</div>
                    <div style={{ fontSize:10, color:"#605890", marginTop:4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <button onClick={runWindowScan} style={{ padding:"8px 16px", borderRadius:8,
                border:"1px solid rgba(200,160,48,0.3)", background:"rgba(200,160,48,0.06)",
                color:"#c8a030", cursor:"pointer", fontSize:12, fontWeight:600, alignSelf:"flex-end" }}>
                ↻ Re-Scan
              </button>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════ NARRATIVE TAB ════════════════ */}
      {activeTab === "narrative" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {loading && <LoadingCard name={chart.name} />}
          {result && !loading && (
            <>
              {/* Headline */}
              <div className="card" style={{ borderColor:`${scoreColor(score)}33` }}>
                <div className="card-tag">✦ MARRIAGE TIMING — FULL NARRATIVE</div>
                <div className="card-title serif">
                  {result.formats?.dashboardCard?.title ?? "K.N. Rao Timing Assessment"}
                </div>
                <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                  <span className="badge badge-gold">Score: {score}/100</span>
                  <span className="badge" style={{
                    background:`${scoreColor(score)}18`, color:scoreColor(score),
                    border:`1px solid ${scoreColor(score)}44` }}>
                    {strengthDisplay(strength)}
                  </span>
                  <span className="badge badge-purple">{active}/8 √ Fulfilled</span>
                </div>
                <p style={{ fontSize:14, lineHeight:2.1, color:"#c8c0a8", whiteSpace:"pre-line" }}>
                  {result.userFacingNarrative}
                </p>
              </div>

              {/* Strongest evidence */}
              {result.backendJson?.strongestEvidence?.length > 0 && (
                <div className="card">
                  <div className="card-tag">✦ STRONGEST EVIDENCE</div>
                  <div className="card-title serif" style={{ marginBottom:12 }}>What&apos;s Supporting This Period</div>
                  {result.backendJson.strongestEvidence.map((ev: string, i: number) => (
                    <div key={i} style={{ padding:"10px 14px", borderRadius:8, marginBottom:8,
                      background:"rgba(200,160,48,0.05)", border:"1px solid rgba(200,160,48,0.2)",
                      fontSize:12, color:"#c8c0a8", lineHeight:1.7 }}>
                      <span style={{ color:"#c8a030", fontWeight:700 }}>✦ </span>{ev}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════ PDF REPORT TAB ═══════════════ */}
      {activeTab === "report" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {loading && <LoadingCard name={chart.name} />}
          {result && !loading && (
            <>
              {/* Report Header */}
              <div className="card" style={{ borderColor:"rgba(200,160,48,0.3)",
                background:"linear-gradient(135deg,rgba(200,160,48,0.05),rgba(124,58,237,0.04))" }}>
                <div className="card-tag">📋 MARRIAGE TIMING VALIDATOR — K.N. RAO RESEARCH LAYER</div>
                <div className="card-title serif" style={{ fontSize:22 }}>
                  {result.formats?.pdfSection?.title ?? "Marriage Timing Report"}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                  <span className="badge badge-gold">Score: {score}/100</span>
                  <span className="badge" style={{ background:`${scoreColor(score)}18`,
                    color:scoreColor(score), border:`1px solid ${scoreColor(score)}44` }}>
                    {strengthDisplay(strength)} Readiness
                  </span>
                  <span className="badge badge-purple">{active}/8 √ Fulfilled</span>
                </div>
                <p style={{ fontSize:13, lineHeight:1.9, color:"#c8c0a8" }}>
                  {result.formats?.pdfSection?.narrative}
                </p>
              </div>

              {/* All Parameters — PDF Style */}
              <div className="card">
                <div className="card-tag">✦ ALL 8 PARAMETERS — DETAILED</div>
                <div className="card-title serif" style={{ marginBottom:16 }}>K.N. Rao Parameter Analysis</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {(result.formats?.pdfSection?.parameters ?? []).map((p: any, i: number) => {
                    const isFulfilled = p.score === 100;
                    const isPartial   = p.score === 55;
                    const badge = isFulfilled ? "√" : isPartial ? "~" : "×";
                    const badgeCol = isFulfilled ? "#22c55e" : isPartial ? "#f97316" : "#3a3060";
                    return (
                    <div key={i} style={{ padding:"16px 18px", borderRadius:12,
                      background: isFulfilled ? "rgba(34,197,94,0.04)" : isPartial ? "rgba(249,115,22,0.03)" : "rgba(0,0,0,0.15)",
                      border:`1px solid ${isFulfilled ? "rgba(34,197,94,0.25)" : isPartial ? "rgba(249,115,22,0.2)" : "#1c1840"}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center", marginBottom:10 }}>
                        <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16,
                          fontWeight:600, color:"#f0e8d0" }}>{p.name}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ background:`${badgeCol}22`, padding:"4px 14px", borderRadius:6,
                            fontSize:22, fontFamily:"monospace", color: badgeCol, fontWeight:700 }}>
                            {badge}
                          </div>
                          {isFulfilled && <span className="badge badge-gold">FULFILLED</span>}
                        </div>
                      </div>
                      <p style={{ fontSize:12, color:"#605890", lineHeight:1.8, margin:0 }}>
                        {p.explanation}
                      </p>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Expert Interpretation */}
              <div className="card">
                <div className="card-tag">✦ EXPERT INTERPRETATION</div>
                <div className="card-title serif" style={{ marginBottom:12 }}>Reading Summary</div>
                <p style={{ fontSize:13, lineHeight:1.9, color:"#c8c0a8" }}>
                  {result.formats?.pdfSection?.interpretation}
                </p>
              </div>

              {/* 9-Month Readiness Summary in Report */}
              {scanResult && (
                <div className="card">
                  <div className="card-tag">📅 9-MONTH OUTLOOK</div>
                  <div className="card-title serif" style={{ marginBottom:12 }}>Future Readiness Preview</div>
                  <p style={{ fontSize:13, color:"#c8c0a8", marginBottom:14, lineHeight:1.8 }}>
                    {scanResult.overallOutlook}
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {scanResult.windows.map(w => (
                      <div key={w.date} style={{ display:"flex", alignItems:"center", gap:12,
                        padding:"8px 12px", borderRadius:8,
                        border:`1px solid ${w.isBest ? "rgba(200,160,48,0.4)" : "#1c1840"}`,
                        background: w.isBest ? "rgba(200,160,48,0.04)" : "transparent" }}>
                        <div style={{ width:48, fontSize:11, fontWeight:600,
                          color: w.isBest ? "#c8a030" : "#605890" }}>
                          {w.isBest ? "⭐ BEST" : w.month.split(" ")[0].slice(0,3)}
                        </div>
                        <div style={{ flex:1 }}>
                          <ScoreBar score={w.score} color={verdictColor(w.verdict)} />
                        </div>
                        <div style={{ width:36, textAlign:"right", fontSize:13, fontWeight:700,
                          color:verdictColor(w.verdict) }}>{w.score}</div>
                        <div style={{ fontSize:11, color:"#605890", minWidth:100 }}>{w.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Boundary */}
              <div style={{ padding:"14px 18px", borderRadius:10, background:"rgba(0,0,0,0.2)",
                border:"1px solid #1c1840", fontSize:12, color:"#3a3060", lineHeight:1.8 }}>
                ⚠️ <strong style={{ color:"#605890" }}>Safety Boundary:</strong>&nbsp;
                {result.overallIntegration?.safetyBoundary ??
                  "No death, widowhood, infertility, divorce certainty or guaranteed negative event prediction. This engine gives timing confidence layers only. Combine with D1 marriage promise, D9 quality, Ashtakoot, KP 2-7-11 and real-life readiness for complete picture."}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Refresh button ───────────────────────────────────── */}
      {result && !loading && (
        <div style={{ marginTop:16, textAlign:"right" }}>
          <button onClick={() => { runCurrentAnalysis(params); runWindowScan(); }}
            style={{ padding:"8px 16px", borderRadius:8,
              border:"1px solid rgba(200,160,48,0.3)", background:"rgba(200,160,48,0.06)",
              color:"#c8a030", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            ↻ Refresh All Analysis
          </button>
        </div>
      )}
    </>
  );
}

// ── Loading Card ──────────────────────────────────────────────
function LoadingCard({ name }: { name: string }) {
  return (
    <div className="card" style={{ textAlign:"center", padding:48 }}>
      <div style={{ fontSize:40, marginBottom:16, color:"#c8a030" }}>✦</div>
      <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, color:"#f0e8d0", marginBottom:8 }}>
        Analyzing K.N. Rao Parameters...
      </div>
      <div style={{ fontSize:12, color:"#605890" }}>
        Evaluating 8 timing parameters for {name}
      </div>
    </div>
  );
}

// ── Month Row Component ───────────────────────────────────────
function MonthRow({ w }: { w: MonthlyMarriageWindow }) {
  const [open, setOpen] = useState(false);
  const col = verdictColor(w.verdict);

  return (
    <div onClick={() => setOpen(o => !o)} style={{
      padding:"12px 16px", borderRadius:10, cursor:"pointer",
      border:`1px solid ${w.isBest ? "rgba(200,160,48,0.5)" : "#1c1840"}`,
      background: w.isBest
        ? "linear-gradient(135deg,rgba(200,160,48,0.08),rgba(232,121,249,0.04))"
        : open ? "rgba(255,255,255,0.02)" : "transparent",
      transition:"all 0.2s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {/* Month + Best badge */}
        <div style={{ minWidth:120 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
            {w.isBest && <span style={{ fontSize:14 }}>⭐</span>}
            <span style={{ fontSize:13, fontWeight:600,
              color: w.isBest ? "#c8a030" : "#f0e8d0" }}>{w.month}</span>
          </div>
          <div style={{ fontSize:10, color:"#605890" }}>MD:{w.mahadasha} · AD:{w.antardasha}</div>
        </div>

        {/* Score bar */}
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
          <ScoreBar score={w.score} color={col} />
          <span style={{ fontSize:14, fontWeight:700, color:col, minWidth:30,
            textAlign:"right" }}>{w.score}</span>
        </div>

        {/* Strength label */}
        <div style={{ minWidth:80, textAlign:"right" }}>
          <span className="badge" style={{ background:`${col}18`, color:col,
            border:`1px solid ${col}44`, fontSize:10 }}>
            {strengthDisplay(w.strengthLabel)}
          </span>
        </div>

        {/* Trend + Changes */}
        <div style={{ display:"flex", gap:4, minWidth:60, justifyContent:"flex-end" }}>
          {w.scoreTrend === "up"   && <span style={{ fontSize:10, color:"#22c55e" }}>↑</span>}
          {w.scoreTrend === "down" && <span style={{ fontSize:10, color:"#ef4444" }}>↓</span>}
          {w.antardashaChanged     && <span className="badge badge-purple" style={{ fontSize:8 }}>AD↑</span>}
          {w.jupiterSignChanged    && <span className="badge badge-gold"   style={{ fontSize:8 }}>♃↑</span>}
        </div>

        <span style={{ fontSize:10, color:"#3a3060" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid #1c1840",
          display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ fontSize:11, color:"#c8c0a8" }}>
            <strong style={{ color:"#605890" }}>Key Factor:</strong> {w.keyFactor}
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:"#605890" }}>♄ {w.transitSaturnSign} H{w.transitSaturnHouse}</span>
            <span style={{ fontSize:11, color:"#605890" }}>♃ {w.transitJupiterSign} H{w.transitJupiterHouse}</span>
            <span style={{ fontSize:11, color:"#605890" }}>{w.activeParameterCount}/8 params active</span>
            {w.bonusActiveCount > 0 && (
              <span style={{ fontSize:11, color:"#38bdf8" }}>
                +{w.bonusActiveCount} bonus → adj {w.adjustedScore}
              </span>
            )}
          </div>
          {w.activeParams.length > 0 && (
            <div style={{ fontSize:11, color:"#c8a030" }}>
              Active: {w.activeParams.join(" · ")}
            </div>
          )}

          {/* Full 8 core parameters for this month */}
          {w.parameters.length > 0 && (
            <div style={{ marginTop:6 }}>
              <div style={{ fontSize:9, color:"#605890", letterSpacing:1.2, marginBottom:6, fontWeight:700 }}>
                8 CORE PARAMETERS — {w.month}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {w.parameters.map(p => (
                  <div key={p.id}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
                        background: p.isActive ? "#c8a030" : "#262050",
                        boxShadow: p.isActive ? "0 0 6px rgba(200,160,48,0.5)" : "none" }} />
                      <span style={{ fontSize:10, color: p.isActive ? "#f0e8d0" : "#8079a8", minWidth:130, flexShrink:0 }}>{p.name}</span>
                      <div style={{ flex:1 }}><ScoreBar score={p.score} color={p.isActive ? "#c8a030" : "#3a3060"} /></div>
                      <span style={{ fontSize:11, fontWeight:700, minWidth:22, textAlign:"right",
                        color: p.isActive ? "#c8a030" : "#3a3060" }}>{p.score}</span>
                    </div>
                    {p.evidence?.length > 0 && (
                      <div style={{ fontSize:9.5, color:"#605890", marginLeft:15, marginTop:2, lineHeight:1.4 }}>
                        {p.evidence.slice(0, 3).map((e, idx) => (
                          <div key={idx}>{e}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bonus layers for this month */}
          {w.bonusLayers.length > 0 && (
            <div style={{ marginTop:8 }}>
              <div style={{ fontSize:9, color:"#38bdf8", letterSpacing:1.2, marginBottom:6, fontWeight:700 }}>
                BONUS / ADVANCED LAYERS — +{w.bonusScore} nudge
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {w.bonusLayers.map(b => (
                  <div key={b.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
                      background: b.isActive ? "#38bdf8" : "#262050" }} />
                    <span style={{ fontSize:10, color: b.isActive ? "#f0e8d0" : "#8079a8", minWidth:130, flexShrink:0 }}>{b.name}</span>
                    <div style={{ flex:1 }}>
                      <ScoreBar score={b.maxBonus ? (b.points / b.maxBonus) * 100 : 0} color={b.isActive ? "#38bdf8" : "#3a3060"} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, minWidth:30, textAlign:"right",
                      color: b.isActive ? "#38bdf8" : "#3a3060" }}>+{b.points}/{b.maxBonus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
