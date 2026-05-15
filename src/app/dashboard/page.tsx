"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { calculateDestiny } from "@/lib/astro-engine/destiny";
import { calculatePsychology } from "@/lib/astro-engine/psychology";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import { calculateEventRadarReport } from "@/lib/astro-engine/event-radar";
import { calculateTransitReport, type PlanetName } from "@/lib/astro-engine/transits";
import { calculateDivisional, type DivChart, type DivPlanet } from "@/lib/astro-engine/divisional";
import { checkSupabaseHealth, isSupabaseReady, type DbHealthItem } from "@/lib/db-health";
import { clearCurrentChart, useUserChart, saveChartToAccount } from "@/lib/user-chart";
import { getAccountAiUsageStatus, getFreeMonthlyAiLimit } from "@/lib/usage";
type User = { email?: string; phone?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
type Profile = { subscription_tier?: string | null; subscription_expires_at?: string | null };
const TRANSIT_PLANETS: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const CHART_PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const CHART_EMOJI = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
const RASHI_NAMES = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const CITIES = [
  "Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad",
  "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Bhopal",
  "Indore","Nagpur","Surat","Varanasi","Amritsar","Dehradun",
  "Kochi","Patna","Agra","Mysuru","Coimbatore","Visakhapatnam","New Delhi",
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function toRashi(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 0 && value <= 11) return value;
    if (value >= 1 && value <= 12) return value - 1;
    return Math.floor(mod(value, 360) / 30);
  }
  return 0;
}

function getPlanetData(rawChart: Record<string, unknown>, planet: PlanetName): Record<string, unknown> {
  const lower = planet.toLowerCase();
  const pools = ["planets", "planetData", "grahas"] as const;
  for (const key of pools) {
    const group = rawChart[key] as Record<string, unknown> | undefined;
    if (!group) continue;
    const value = (group[planet] ?? group[lower]) as Record<string, unknown> | undefined;
    if (value) return value;
  }
  return {};
}

function normalizeChartForTransit(rawChartInput: unknown) {
  const rawChart = (rawChartInput ?? {}) as Record<string, unknown>;
  const lagnaRaw =
    rawChart.lagR ??
    rawChart.lagnaRashi ??
    rawChart.ascendantRashi ??
    ((rawChart.ascendant as Record<string, unknown> | undefined)?.rashi) ??
    ((rawChart.ascendant as Record<string, unknown> | undefined)?.sign) ??
    ((rawChart.lagna as Record<string, unknown> | undefined)?.rashi) ??
    ((rawChart.lagna as Record<string, unknown> | undefined)?.sign) ??
    (((rawChart.houses as Array<Record<string, unknown>> | undefined)?.[0])?.rashi) ??
    (((rawChart.houses as Array<Record<string, unknown>> | undefined)?.[1])?.rashi) ??
    0;
  const lagR = toRashi(lagnaRaw);

  const planets = TRANSIT_PLANETS.reduce((acc, planet) => {
    const data = getPlanetData(rawChart, planet);
    const longitude =
      (data.longitude as number | undefined) ??
      (data.lon as number | undefined) ??
      (data.lng as number | undefined) ??
      (data.degree as number | undefined) ??
      (data.absoluteDegree as number | undefined) ??
      (data.siderealLongitude as number | undefined) ??
      0;
    const rashi = toRashi((data.rashi ?? data.sign ?? data.signIndex ?? data.rashiIndex ?? data.zodiacSign ?? longitude) as unknown);
    const house =
      typeof data.house === "number" && Number.isFinite(data.house)
        ? data.house >= 1 && data.house <= 12
          ? data.house
          : mod(data.house - 1, 12) + 1
        : mod(rashi - lagR, 12) + 1;

    acc[planet] = {
      longitude,
      rashi,
      house,
      rashiName: (data.rashiName as string | undefined) ?? (data.signName as string | undefined),
      nakshatra: data.nakshatra as string | undefined,
      retrograde: Boolean(data.retrograde ?? data.isRetrograde),
    };
    return acc;
  }, {} as Record<PlanetName, { longitude: number; rashi: number; house: number; rashiName?: string; nakshatra?: string; retrograde: boolean }>);

  return {
    tz: (rawChart.tz as number | undefined) ?? (rawChart.timezone as number | undefined) ?? 5.5,
    lagR,
    planets,
  };
}

function CompactNorthChart({ chart }: { chart: DivChart }) {
  const S = 300;
  const lagR = chart.lagnaNum;
  const houses = [
    { h:1,  lx:S/2,     ly:S/4     },
    { h:2,  lx:S/4,     ly:S/8     },
    { h:3,  lx:S/8,     ly:S/4     },
    { h:4,  lx:S/4,     ly:S/2     },
    { h:5,  lx:S/8,     ly:3*S/4   },
    { h:6,  lx:S/4,     ly:7*S/8   },
    { h:7,  lx:S/2,     ly:3*S/4   },
    { h:8,  lx:3*S/4,   ly:7*S/8   },
    { h:9,  lx:7*S/8,   ly:3*S/4   },
    { h:10, lx:3*S/4,   ly:S/2     },
    { h:11, lx:7*S/8,   ly:S/4     },
    { h:12, lx:3*S/4,   ly:S/8     },
  ];
  const pByH: Record<number, DivPlanet[]> = {};
  for (let i = 1; i <= 12; i += 1) pByH[i] = [];
  chart.planets.forEach((p) => {
    if (p.house >= 1 && p.house <= 12) pByH[p.house].push(p);
  });

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 330, display: "block", margin: "0 auto" }}>
      <rect width={S} height={S} fill="var(--chart-bg)" rx="8"/>
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="var(--chart-line)" strokeWidth="1.4" rx="8"/>
      <line x1={0} y1={0} x2={S} y2={S} stroke="var(--chart-line-soft)" strokeWidth="1"/>
      <line x1={S} y1={0} x2={0} y2={S} stroke="var(--chart-line-soft)" strokeWidth="1"/>
      <line x1={S/2} y1={0} x2={S} y2={S/2} stroke="var(--chart-line-soft)" strokeWidth="1"/>
      <line x1={S} y1={S/2} x2={S/2} y2={S} stroke="var(--chart-line-soft)" strokeWidth="1"/>
      <line x1={S/2} y1={S} x2={0} y2={S/2} stroke="var(--chart-line-soft)" strokeWidth="1"/>
      <line x1={0} y1={S/2} x2={S/2} y2={0} stroke="var(--chart-line-soft)" strokeWidth="1"/>
      {houses.map(({ h: houseNo, lx, ly }) => {
        const rIdx = mod(lagR + houseNo - 1, 12);
        const here = pByH[houseNo] ?? [];
        const isLagna = houseNo === 1;
        return (
          <g key={houseNo}>
            <text x={lx} y={ly - 6} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={isLagna ? "var(--app-gold)" : "var(--chart-label)"} fontWeight={isLagna ? "700" : "400"}>
              {rIdx + 1}
            </text>
            {isLagna && <text x={lx} y={ly + 5} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fill="var(--app-gold)" fontWeight="700">Lagna</text>}
            {here.map((p, idx) => {
              const pIdx = CHART_PLANETS.indexOf(p.planet);
              const ox = here.length > 1 ? (idx - (here.length - 1) / 2) * 13 : 0;
              return (
                <g key={`${houseNo}-${p.planet}-${idx}`}>
                  <text x={lx + ox} y={ly + (isLagna ? 18 : 14)} textAnchor="middle" dominantBaseline="middle" fontSize="12.5" fill={pIdx >= 0 ? p.color : "#aaa"}>
                    {pIdx >= 0 ? CHART_EMOJI[pIdx] : p.planet.slice(0, 2)}
                  </text>
                  {p.retrograde && <text x={lx + ox + 8} y={ly + (isLagna ? 13 : 9)} textAnchor="middle" fontSize="6" fill="#f97316" fontWeight="700">℞</text>}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aiQuestionsLeft, setAiQuestionsLeft] = useState("0");
  const [dbHealth, setDbHealth] = useState<DbHealthItem[]>([]);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [chartForm, setChartForm] = useState({name:"",dob:"",tob:"",city:""});
  const [chartLoading, setChartLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);
  const { birth, chart } = useUserChart();
  const fallbackArea = { name: "Stability", score: 50, icon: "⚖️" };
  const fallbackDasha = { planet: "Moon", start: new Date(), end: new Date(), yrs: 10, active: true };

  const filteredCities = CITIES.filter(c=>c.toLowerCase().includes(citySearch.toLowerCase()));

  const handleGenerateChart = async () => {
    if(!chartForm.name||!chartForm.dob||!chartForm.tob||!chartForm.city) return;
    setChartLoading(true);
    await new Promise(r=>setTimeout(r,600));
    try {
      const newChart = calculateChart(chartForm.name,chartForm.dob,chartForm.tob,chartForm.city);
      await saveChartToAccount(newChart);
      setChartForm({name:"",dob:"",tob:"",city:""});
      setActiveTab("overview");
    } catch(e){ console.error(e); }
    setChartLoading(false);
  };

  useEffect(() => {
    const loadDashboardState = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: nextProfile } = await supabase
          .from("profiles")
          .select("subscription_tier,subscription_expires_at")
          .eq("id", data.user.id)
          .maybeSingle();

        setProfile(nextProfile);
        const usage = await getAccountAiUsageStatus(nextProfile?.subscription_tier);
        setAiQuestionsLeft(usage.isUnlimited ? "Unlimited" : String(usage.left));
        return;
      }

      const usage = await getAccountAiUsageStatus(null);
      setAiQuestionsLeft(String(usage.left));
    };

    loadDashboardState();
    checkSupabaseHealth().then(setDbHealth);
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [supabase]);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || birth.name?.split(" ")[0] || "Seeker";
  const greeting = time.getHours() < 12 ? "Shubh Prabhat" : time.getHours() < 17 ? "Namaste" : "Shubh Sandhya";
  const dayName  = time.toLocaleDateString("en-IN", { weekday:"long" });
  const dateStr  = time.toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
  const destiny = calculateDestiny(chart.planets as never, chart.dashas ?? [], birth.dob);
  const psychology = calculatePsychology(chart.planets as never);
  const activeDasha = chart.dashas?.find((entry) => entry.active) || chart.dashas?.[0] || fallbackDasha;
  const activeAntardasha = chart.antardasha?.find((entry) => entry.active) || chart.antardasha?.[0] || null;
  const strongestArea = [...(destiny.areas ?? [])].sort((a, b) => b.score - a.score)[0] || fallbackArea;
  const weakestArea = [...(destiny.areas ?? [])].sort((a, b) => a.score - b.score)[0] || fallbackArea;
  const cosmicScore = (destiny.currentScore / 10).toFixed(1);
  const plan = profile?.subscription_tier && profile.subscription_tier !== "free"
    ? profile.subscription_tier.toUpperCase()
    : "FREE";
  const chartCount = chart.name ? "1" : "0";
  const aiQuestionsChange = plan === "FREE"
    ? `${getFreeMonthlyAiLimit()} free / month`
    : `${plan} plan active`;
  const dbReady = isSupabaseReady(dbHealth);
  const pendingDbTables = dbHealth.filter((item) => item.status !== "ready");
  const planetCards = [
    { name:"Sun", icon:"☉", col:"#f97316" },
    { name:"Moon", icon:"☽", col:"#c084fc" },
    { name:"Mars", icon:"♂", col:"#ef4444" },
    { name:"Mercury", icon:"☿", col:"#22c55e" },
    { name:"Jupiter", icon:"♃", col:"#f59e0b" },
    { name:"Venus", icon:"♀", col:"#ec4899" },
    { name:"Saturn", icon:"♄", col:"#60a5fa" },
    { name:"Rahu", icon:"☊", col:"#a78bfa" },
  ].map((planet) => {
    const details = chart.planets?.[planet.name];
    const dignity = details?.dignity ?? "";
    const houseNum = typeof details?.house === "number" ? details.house : 1;
    const energy = dignity.includes("Exalted") || dignity.includes("Own")
      ? "Strong"
      : [6, 8, 12].includes(houseNum)
      ? "Intense"
      : "Active";

    return {
      ...planet,
      sign: details?.sign ?? "Unknown",
      house: `${houseNum}th`,
      energy,
    };
  });
  const insights = [
    {
      tag: `${activeDasha.planet} Mahadasha`,
      text: `${activeDasha.planet} is your active karmic teacher right now. Current life score is ${destiny.currentScore}%, so this is a phase for focused work in ${weakestArea.name.toLowerCase()} and steady gains in ${strongestArea.name.toLowerCase()}.`,
      icon: "✦",
      urgent: destiny.currentScore < 55,
    },
    {
      tag: `${psychology.pattern.name}`,
      text: `${psychology.summary} Anxiety index is ${psychology.pattern.anxietyIdx}, so today works best when you keep decisions simple and stay close to routines that calm the mind.`,
      icon: "🧠",
      urgent: psychology.pattern.anxietyIdx >= 70,
    },
    {
      tag: `${strongestArea.name} Window`,
      text: `${strongestArea.name} is currently your strongest life area at ${strongestArea.score}%. ${weakestArea.name} sits at ${weakestArea.score}%, so the dashboard should be used as a guide for balance, not just momentum.`,
      icon: strongestArea.icon,
      urgent: false,
    },
  ];
  const dailyFeed = useMemo(() => {
    const transitChart = normalizeChartForTransit(chart as unknown);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const transit = calculateTransitReport({ chart: transitChart, date: today, base: "moon" });
    const radar = calculateEventRadarReport({ chart: transitChart, startDate: today, days: 7, base: "moon" });
    const panchang = calculatePanchang(today, transitChart.tz);
    const topArea = [...(transit.areaScores ?? [])].sort((a, b) => b.score - a.score)[0] ?? { area: "Balance", score: 50 };
    const cautionCount = transit.alerts.filter((a) => a.severity === "high" || a.severity === "medium").length;
    const oppCount = transit.alerts.filter((a) => a.type === "opportunity").length;
    const bestDay = radar.bestDay ?? { label: "N/A" };
    const cautionDay = radar.cautionDay ?? { label: "N/A" };
    return { panchang, transit, radar: { ...radar, bestDay, cautionDay }, topArea, cautionCount, oppCount };
  }, [chart]);
  const chartLayers = useMemo(() => {
    const divisional = calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
    const d1 = divisional.find((c) => c.key === "D1") ?? divisional[0];
    const d9 = divisional.find((c) => c.key === "D9") ?? divisional[0];
    const byHouse = (layer: DivChart) =>
      Array.from({ length: 12 }).map((_, i) => {
        const house = i + 1;
        const rashiIdx = mod(layer.lagnaNum + i, 12);
        const occupants = layer.planets.filter((p) => p.house === house);
        return { house, rashiIdx, rashi: RASHI_NAMES[rashiIdx], occupants };
      });
    return { d1, d9, d1Houses: byHouse(d1), d9Houses: byHouse(d9) };
  }, [chart]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

        /* MAIN */
        .main{padding:32px;min-height:100vh}

        /* TOPBAR */
        .topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;flex-wrap:wrap;gap:16px}
        .greeting-tag{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:6px}
        .greeting-h{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:#f0e8d0;line-height:1.1}
        .greeting-h em{font-style:italic;color:#c8a030}
        .greeting-sub{font-size:13px;color:#605890;margin-top:4px}
        .topbar-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
        .date-chip{background:#0d0a22;border:1px solid #1c1840;border-radius:10px;padding:10px 16px;text-align:right}
        .date-day{font-size:11px;color:#605890;letter-spacing:1px}
        .date-full{font-size:13px;color:#c8c0a8;margin-top:2px}
        .notif-btn{width:40px;height:40px;border-radius:10px;background:#0d0a22;border:1px solid #1c1840;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;font-size:18px}
        .notif-btn:hover{border-color:rgba(200,160,48,0.3)}

        /* TABS */
        .tabs{display:flex;gap:4px;margin-bottom:28px;background:#0a0720;border:1px solid #1c1840;border-radius:12px;padding:4px;width:fit-content}
        .tab{padding:8px 20px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;color:#605890;border:none;background:none;font-family:'Outfit',sans-serif}
        .tab.active{background:#1c1840;color:#c8c0a8}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .stat-card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:20px;transition:border-color 0.3s}
        .stat-card:hover{border-color:rgba(200,160,48,0.2)}
        .stat-icon{font-size:24px;margin-bottom:12px}
        .stat-val{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:#c8a030;line-height:1;margin-bottom:4px}
        .stat-lbl{font-size:12px;color:#605890}
        .stat-change{font-size:11px;color:#1d9e75;margin-top:6px}

        /* GRID */
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}

        /* CARDS */
        .card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:24px;transition:border-color 0.3s}
        .card:hover{border-color:rgba(200,160,48,0.15)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0;margin-bottom:16px}
        .card-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:8px}

        /* QUICK ACTIONS */
        .actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .action-btn{padding:16px;border-radius:12px;border:1px solid #1c1840;background:#0a0720;cursor:pointer;transition:all 0.25s;text-align:left;text-decoration:none;display:block}
        .action-btn:hover{transform:translateY(-3px);border-color:rgba(200,160,48,0.25);background:#0f0c28}
        .action-btn-icon{font-size:24px;margin-bottom:10px}
        .action-btn-label{font-size:13px;font-weight:500;color:#c8c0a8;margin-bottom:3px}
        .action-btn-desc{font-size:11px;color:#605890}

        /* INSIGHTS */
        .insight{padding:16px;border-radius:12px;border:1px solid #1c1840;background:#0a0720;margin-bottom:10px;transition:border-color 0.2s}
        .insight:last-child{margin-bottom:0}
        .insight:hover{border-color:rgba(200,160,48,0.2)}
        .insight.urgent{border-color:rgba(200,160,48,0.25);background:rgba(200,160,48,0.03)}
        .insight-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .insight-icon{font-size:18px}
        .insight-tag{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c8a030;font-weight:500}
        .insight-urgent-dot{width:6px;height:6px;border-radius:50%;background:#c8a030;margin-left:auto;animation:blink 2s infinite}
        .insight-text{font-size:13px;color:#c8c0a8;line-height:1.7}

        /* PLANETS */
        .planet-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1c1840}
        .planet-row:last-child{border-bottom:none}
        .energy-pill{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.15);color:#c8a030}

        /* TODAY CARD */
        .today-card{background:linear-gradient(135deg,#0f0c28,#1a1040);border:1px solid rgba(200,160,48,0.2);border-radius:16px;padding:24px;margin-bottom:24px;position:relative;overflow:hidden}
        .today-orb{position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(200,160,48,0.08) 0%,transparent 70%);right:-40px;top:-40px;pointer-events:none}
        .today-tag{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:10px}
        .today-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#f0e8d0;margin-bottom:8px}
        .today-text{font-size:14px;color:#c8c0a8;line-height:1.8;max-width:600px}
        .today-score{position:absolute;right:24px;bottom:24px;text-align:center}
        .score-n{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:#c8a030;line-height:1}
        .score-l{font-size:11px;color:#605890;letter-spacing:1px}
        .today-summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
        .today-summary-card{display:block;text-decoration:none;background:#0d0a22;border:1px solid #1c1840;border-radius:12px;padding:14px 16px;transition:all 0.2s}
        .today-summary-card:hover{transform:translateY(-2px);border-color:rgba(200,160,48,0.25)}
        .today-summary-k{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#605890;margin-bottom:6px}
        .today-summary-v{font-size:14px;color:#f0e8d0;line-height:1.5}
        .today-summary-hint{font-size:11px;color:#c8a030;margin-top:8px}

        /* UPGRADE */
        .upgrade{background:linear-gradient(135deg,rgba(60,40,128,0.4),rgba(200,160,48,0.1));border:1px solid rgba(200,160,48,0.25);border-radius:16px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
        .upgrade-btn{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410;border:none;border-radius:10px;padding:10px 24px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif;white-space:nowrap;text-decoration:none}
        .upgrade-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(200,160,48,0.3)}
        .db-health{background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:14px;padding:14px 18px;margin-bottom:24px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
        .db-health-title{font-size:13px;color:#fdba74;font-weight:600;margin-bottom:4px}
        .db-health-text{font-size:12px;color:#c8c0a8;line-height:1.7}
        .db-health-tags{display:flex;gap:6px;flex-wrap:wrap}
        .db-health-tag{font-size:10px;color:#fdba74;border:1px solid rgba(249,115,22,0.25);background:rgba(249,115,22,0.08);border-radius:999px;padding:3px 8px}
        .mobile-nav{display:none}

        @media(max-width:1024px){
          .stats-row{grid-template-columns:repeat(2,1fr)}
          .grid-2{grid-template-columns:1fr}
          .actions-grid{grid-template-columns:repeat(2,1fr)}
          .today-summary-grid{grid-template-columns:1fr}
        }
        @media(max-width:640px){
          .main{padding:20px 20px 98px}
          .greeting-h{font-size:30px}
          .greeting-sub{font-size:12px}
          .tabs{width:100%;overflow-x:auto;white-space:nowrap}
          .tab{padding:8px 14px}
          .today-card{padding:18px}
          .today-title{font-size:19px}
          .today-text{font-size:13px;line-height:1.7}
          .today-summary-grid{gap:10px}
          .today-summary-card{padding:12px 13px}
          .upgrade{padding:16px}
          .upgrade-btn{width:100%;text-align:center;padding:12px 16px}
          .stats-row{grid-template-columns:1fr 1fr}
          .today-score{display:none}
          .actions-grid{grid-template-columns:1fr}
          .action-btn{padding:14px}
          .card{padding:18px}
          .planet-row{gap:8px}
          .energy-pill{padding:2px 8px}
          .mobile-nav{display:flex;gap:4px;position:fixed;left:10px;right:10px;bottom:10px;overflow-x:auto;background:rgba(10,7,32,0.96);border:1px solid #1c1840;border-radius:14px;padding:8px 6px calc(8px + env(safe-area-inset-bottom,0px));backdrop-filter:blur(10px);z-index:120;scrollbar-width:none}
          .mobile-nav::-webkit-scrollbar{display:none}
          .mobile-nav-item{text-decoration:none;color:#605890;display:flex;flex:0 0 58px;min-height:44px;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:5px 2px;border-radius:10px}
          .mobile-nav-item.active{color:#c8a030;background:rgba(200,160,48,0.1)}
          .mobile-nav-icon{font-size:16px;line-height:1}
          .mobile-nav-label{font-size:9px;letter-spacing:0.2px}
        }

        body{background:var(--app-bg);color:var(--app-fg)}
        .main{background:var(--app-bg);color:var(--app-fg)}
        .date-chip,.notif-btn,.stat-card,.card,.today-summary-card{background:var(--app-card);border-color:var(--app-border);color:var(--app-fg)}
        .date-full,.today-text,.insight-text,.action-btn-label,.db-health-text{color:var(--app-soft)}
        .greeting-h,.card-title,.today-title,.today-summary-v{color:var(--app-fg)}
        .greeting-sub,.date-day,.tabs .tab,.stat-lbl,.card-tag,.action-btn-desc,.today-summary-k,.score-l{color:var(--app-muted)}
        .greeting-tag,.greeting-h em,.stat-val,.today-tag,.score-n,.today-summary-hint,.energy-pill{color:var(--app-gold)}
        .tabs{background:var(--app-card-alt);border-color:var(--app-border)}
        .tab.active{background:color-mix(in srgb,var(--app-gold) 12%,var(--app-card));color:var(--app-fg)}
        .today-card{background:linear-gradient(135deg,var(--app-card),var(--app-card-alt));border-color:color-mix(in srgb,var(--app-gold) 22%,var(--app-border))}
        .action-btn,.insight{background:var(--app-card-alt);border-color:var(--app-border)}
        .action-btn:hover,.insight:hover,.today-summary-card:hover,.card:hover{border-color:color-mix(in srgb,var(--app-gold) 25%,transparent)}
        .planet-row{border-color:var(--app-border)}
        .energy-pill{background:color-mix(in srgb,var(--app-gold) 10%,transparent);border-color:color-mix(in srgb,var(--app-gold) 18%,transparent)}
        .upgrade{background:linear-gradient(135deg,color-mix(in srgb,var(--app-accent) 16%,var(--app-card)),color-mix(in srgb,var(--app-gold) 10%,var(--app-card)));border-color:color-mix(in srgb,var(--app-gold) 28%,transparent)}
        .chart-panel{background:var(--chart-bg);border:1px solid var(--chart-line);border-radius:12px;padding:14px}
        .chart-table-panel{background:var(--app-card-alt);border:1px solid var(--app-border);border-radius:12px;padding:12px}
        .chart-panel-title{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-muted);margin-bottom:8px}
        .chart-table-title{font-size:11px;color:var(--app-gold);margin-bottom:8px}
        .chart-house-row{font-size:11px;color:var(--app-soft);display:flex;gap:8px;align-items:center}
        .chart-house-no{color:var(--app-muted);width:30px}
        .mobile-nav{background:color-mix(in srgb,var(--app-card-alt) 96%,transparent);border-color:var(--app-border)}
        .mobile-nav-item{color:var(--app-muted)}
        .mobile-nav-item.active{color:var(--app-gold);background:color-mix(in srgb,var(--app-gold) 12%,transparent)}
      `}</style>

      <div>
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="greeting-tag">✦ Your Cosmic Dashboard</div>
              <h1 className="greeting-h serif">
                {greeting},<br /><em>{userName}</em>
              </h1>
              <div className="greeting-sub">{birth.city} · Lagna {chart.lagnaRashi} · {activeDasha.planet} MD{activeAntardasha ? ` / ${activeAntardasha.planet} AD` : ""}</div>
            </div>
            <div className="topbar-right">
              <div className="date-chip">
                <div className="date-day">{dayName.toUpperCase()}</div>
                <div className="date-full">{dateStr}</div>
              </div>
              <div className="notif-btn">🔔</div>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {["overview","charts","insights","remedies"].map(t => (
              <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
          <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ D1 + D9 Home Charts</div>
            <div className="card-title serif">Lagna Chart and Navamsha with House/Rashi/Planet Placement</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
              <div className="chart-panel">
                <div className="chart-panel-title">D1 · Rasi</div>
                <CompactNorthChart chart={chartLayers.d1} />
              </div>
              <div className="chart-panel">
                <div className="chart-panel-title">D9 · Navamsha</div>
                <CompactNorthChart chart={chartLayers.d9} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 14 }}>
              <div className="chart-table-panel">
                <div className="chart-table-title">D1 House · Rashi · Planets</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {chartLayers.d1Houses.map((h) => (
                    <div key={`d1-${h.house}`} className="chart-house-row">
                      <span className="chart-house-no">H{h.house}</span>
                      <span style={{ width: 90 }}>{h.rashi}</span>
                      <span>{h.occupants.length ? h.occupants.map((p) => p.planet).join(", ") : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-table-panel">
                <div className="chart-table-title">D9 House · Rashi · Planets</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {chartLayers.d9Houses.map((h) => (
                    <div key={`d9-${h.house}`} className="chart-house-row">
                      <span className="chart-house-no">H{h.house}</span>
                      <span style={{ width: 90 }}>{h.rashi}</span>
                      <span>{h.occupants.length ? h.occupants.map((p) => p.planet).join(", ") : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TODAY CARD */}
          <div className="today-card">
            <div className="today-orb" />
            <div className="today-tag">✦ Today&apos;s Cosmic Energy</div>
            <div className="today-title serif">{activeDasha.planet} MD {activeAntardasha ? `· ${activeAntardasha.planet} AD` : "active"} timing</div>
            <div className="today-text">
              Current Mahadasha: {activeDasha.planet} ({activeDasha.start.getFullYear()}–{activeDasha.end.getFullYear()}).
              {activeAntardasha ? ` Current Antardasha: ${activeAntardasha.planet} (${activeAntardasha.start.getFullYear()}–${activeAntardasha.end.getFullYear()}).` : ""}
              {" "}Your strongest area is {strongestArea.name.toLowerCase()}, while {weakestArea.name.toLowerCase()} needs gentler handling. Use discipline over speed, especially when emotions feel louder than facts.
            </div>
            <div className="today-score">
              <div className="score-n serif">{cosmicScore}</div>
              <div className="score-l">COSMIC SCORE</div>
            </div>
          </div>

          <div className="today-summary-grid">
            <Link href="/dashboard/transits" className="today-summary-card">
              <div className="today-summary-k">Transit Focus</div>
              <div className="today-summary-v">
                {strongestArea.name} is your best window today.
              </div>
              <div className="today-summary-hint">Open Transit Engine →</div>
            </Link>
            <Link href="/dashboard/event-radar" className="today-summary-card">
              <div className="today-summary-k">Event Radar</div>
              <div className="today-summary-v">
                Watch {weakestArea.name.toLowerCase()} decisions with patience.
              </div>
              <div className="today-summary-hint">See 7-day radar →</div>
            </Link>
            <Link href="/dashboard/report" className="today-summary-card">
              <div className="today-summary-k">Premium Report</div>
              <div className="today-summary-v">
                Deep dive on {activeDasha.planet} dasha + remedies.
              </div>
              <div className="today-summary-hint">Open full report →</div>
            </Link>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ Daily Personal Feed</div>
            <div className="card-title serif">Actionables for today</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              <div className="today-summary-card">
                <div className="today-summary-k">Panchang</div>
                <div className="today-summary-v">{dailyFeed.panchang.tithi} · {dailyFeed.panchang.nakshatra} · {dailyFeed.panchang.yoga}</div>
                <div className="today-summary-hint">Moon {dailyFeed.panchang.moonSign} · {dailyFeed.panchang.paksha} Paksha</div>
              </div>
              <div className="today-summary-card">
                <div className="today-summary-k">Transit Pulse</div>
                <div className="today-summary-v">Best focus: {dailyFeed.topArea.area} ({dailyFeed.topArea.score}/100)</div>
                <div className="today-summary-hint">{dailyFeed.oppCount} opportunities · {dailyFeed.cautionCount} cautions</div>
              </div>
              <div className="today-summary-card">
                <div className="today-summary-k">7-Day Radar</div>
                <div className="today-summary-v">Best day: {dailyFeed.radar.bestDay.label} · Caution: {dailyFeed.radar.cautionDay.label}</div>
                <div className="today-summary-hint">Today score {dailyFeed.radar.days[0]?.overallScore ?? "-"} / 100</div>
              </div>
              <div className="today-summary-card">
                <div className="today-summary-k">Remedy</div>
                <div className="today-summary-v">{dailyFeed.radar.days[0]?.remedy ?? "Keep routine stable and avoid impulsive reactions."}</div>
                <div className="today-summary-hint"><Link href="/dashboard/event-radar" style={{ color: "#c8a030", textDecoration: "none" }}>Open Event Radar →</Link></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ Planetary Positions</div>
            <div className="card-title serif">Your current cosmic blueprint</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
              {planetCards.map((p,i) => (
                <div key={i} className="planet-row">
                  <span style={{fontSize:18,width:28,color:p.col}}>{p.icon}</span>
                  <span style={{flex:1,fontSize:13,color:"#c8c0a8"}}>{p.name}</span>
                  <span style={{fontSize:13,color:"#f0e8d0"}}>{p.sign}</span>
                  <span style={{fontSize:11,color:"#605890",width:32,textAlign:"right"}}>{p.house}</span>
                  <span className="energy-pill">{p.energy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UPGRADE BANNER */}
          <div className="upgrade">
            <div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,color:"#f0e8d0",marginBottom:4}}>
                Unlock Your Full Cosmic Blueprint ✦
              </div>
              <div style={{fontSize:13,color:"#605890"}}>
                Upgrade to access all 15+ engines, unlimited AI chat, and destiny timeline.
              </div>
            </div>
            <Link href="/dashboard/upgrade" className="upgrade-btn">Upgrade to Premium →</Link>
          </div>

          {dbHealth.length > 0 && !dbReady && (
            <div className="db-health">
              <div>
                <div className="db-health-title">Database setup pending</div>
                <div className="db-health-text">
                  Account persistence is in fallback mode. Apply `supabase/schema.sql` and follow `docs/SUPABASE_SETUP.md`.
                </div>
              </div>
              <div className="db-health-tags">
                {pendingDbTables.slice(0, 4).map((item) => (
                  <span key={item.table} className="db-health-tag">{item.label}</span>
                ))}
              </div>
            </div>
          )}

          {/* STATS */}
          <div className="stats-row">
            {[
              { icon:"🔯", val:chartCount, lbl:"Charts Created", change:birth.city ? birth.city : "Create your first chart" },
              { icon:"🤖", val:aiQuestionsLeft, lbl:"AI Questions Left", change:aiQuestionsChange },
              { icon:"⚡", val:cosmicScore,  lbl:"Today&apos;s Score", change:`${strongestArea.name} is strongest` },
              { icon:"🌙", val:activeDasha.planet, lbl:"Active Dasha", change:`Until ${activeDasha.end.getFullYear()}` },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val serif">{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className="stat-change">{s.change}</div>
              </div>
            ))}
          </div>

          </>
          )}

          {activeTab === "charts" && (
          <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ Chart Generator</div>
            <div className="card-title serif">Generate or Update Your Chart</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#605890", display: "block", marginBottom: 8 }}>Full Name</label>
                <input style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.03)", border: "1px solid #1c1840", borderRadius: 10, outline: "none", fontSize: 13, color: "#f0e8d0", fontFamily: "Outfit,sans-serif", width: "100%", transition: "border-color 0.2s" }}
                  placeholder="Enter your name"
                  value={chartForm.name}
                  onChange={e=>setChartForm(f=>({...f,name:e.target.value}))}
                  onFocus={e => e.currentTarget.style.borderColor = "#c8a030"}
                  onBlur={e => e.currentTarget.style.borderColor = "#1c1840"}/>
              </div>
              <div>
                <label style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#605890", display: "block", marginBottom: 8 }}>Date of Birth</label>
                <input style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.03)", border: "1px solid #1c1840", borderRadius: 10, outline: "none", fontSize: 13, color: "#f0e8d0", fontFamily: "Outfit,sans-serif", width: "100%", colorScheme: "dark" }}
                  type="date"
                  value={chartForm.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={e=>setChartForm(f=>({...f,dob:e.target.value}))}/>
              </div>
              <div>
                <label style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#605890", display: "block", marginBottom: 8 }}>Time of Birth</label>
                <input style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.03)", border: "1px solid #1c1840", borderRadius: 10, outline: "none", fontSize: 13, color: "#f0e8d0", fontFamily: "Outfit,sans-serif", width: "100%", colorScheme: "dark" }}
                  type="time"
                  value={chartForm.tob}
                  onChange={e=>setChartForm(f=>({...f,tob:e.target.value}))}/>
              </div>
              <div style={{ position: "relative" }}>
                <label style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#605890", display: "block", marginBottom: 8 }}>Birth City</label>
                <input style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.03)", border: "1px solid #1c1840", borderRadius: 10, outline: "none", fontSize: 13, color: "#f0e8d0", fontFamily: "Outfit,sans-serif", width: "100%" }}
                  placeholder="Search city..."
                  value={citySearch}
                  onChange={e=>{setCitySearch(e.target.value);setChartForm(f=>({...f,city:""}));setShowCities(true);}}
                  onFocus={()=>setShowCities(true)}/>
                {showCities && citySearch.length>0 && filteredCities.length>0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#0f0c28", border: "1px solid #261f50", borderRadius: 10, zIndex: 20, maxHeight: 160, overflowY: "auto" }}>
                    {filteredCities.map(c=>(
                      <div key={c} style={{ padding: "11px 14px", fontSize: 13, color: "#c8c0a8", cursor: "pointer", transition: "background 0.15s" }}
                        onClick={()=>{setChartForm(f=>({...f,city:c}));setCitySearch(c);setShowCities(false);}}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(200,160,48,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button style={{ width: "100%", marginTop: 20, padding: 16, background: "linear-gradient(135deg,#c8a030,#3c2880cc)", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, color: "#060410", cursor: "pointer", transition: "all 0.25s", fontFamily: "Outfit,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onClick={handleGenerateChart}
              disabled={!chartForm.name||!chartForm.dob||!chartForm.tob||!chartForm.city||chartLoading}
              onMouseEnter={e => !chartLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              {chartLoading?"⟳ Calculating...":"🔯 Generate Chart"}
            </button>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ D1 + D9 Home Charts</div>
            <div className="card-title serif">Lagna Chart and Navamsha with House/Rashi/Planet Placement</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
              <div className="chart-panel">
                <div className="chart-panel-title">D1 · Rasi</div>
                <CompactNorthChart chart={chartLayers.d1} />
              </div>
              <div className="chart-panel">
                <div className="chart-panel-title">D9 · Navamsha</div>
                <CompactNorthChart chart={chartLayers.d9} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 14 }}>
              <div className="chart-table-panel">
                <div className="chart-table-title">D1 House · Rashi · Planets</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {chartLayers.d1Houses.map((h) => (
                    <div key={`d1-${h.house}`} className="chart-house-row">
                      <span className="chart-house-no">H{h.house}</span>
                      <span style={{ width: 90 }}>{h.rashi}</span>
                      <span>{h.occupants.length ? h.occupants.map((p) => p.planet).join(", ") : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-table-panel">
                <div className="chart-table-title">D9 House · Rashi · Planets</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {chartLayers.d9Houses.map((h) => (
                    <div key={`d9-${h.house}`} className="chart-house-row">
                      <span className="chart-house-no">H{h.house}</span>
                      <span style={{ width: 90 }}>{h.rashi}</span>
                      <span>{h.occupants.length ? h.occupants.map((p) => p.planet).join(", ") : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {activeTab === "insights" && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ AI Insights</div>
            <div className="card-title serif">Your cosmic intelligence briefing</div>
            {insights.map((ins,i) => (
              <div key={i} className={`insight ${ins.urgent?"urgent":""}`}>
                <div className="insight-top">
                  <span className="insight-icon">{ins.icon}</span>
                  <span className="insight-tag">{ins.tag}</span>
                  {ins.urgent && <div className="insight-urgent-dot" />}
                </div>
                <div className="insight-text">{ins.text}</div>
              </div>
            ))}
          </div>
          )}

          {activeTab === "remedies" && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-tag">✦ Daily Personal Feed</div>
            <div className="card-title serif">Actionables for today</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              <div className="today-summary-card">
                <div className="today-summary-k">Panchang</div>
                <div className="today-summary-v">{dailyFeed.panchang.tithi} · {dailyFeed.panchang.nakshatra} · {dailyFeed.panchang.yoga}</div>
                <div className="today-summary-hint">Moon {dailyFeed.panchang.moonSign} · {dailyFeed.panchang.paksha} Paksha</div>
              </div>
              <div className="today-summary-card">
                <div className="today-summary-k">Transit Pulse</div>
                <div className="today-summary-v">Best focus: {dailyFeed.topArea.area} ({dailyFeed.topArea.score}/100)</div>
                <div className="today-summary-hint">{dailyFeed.oppCount} opportunities · {dailyFeed.cautionCount} cautions</div>
              </div>
              <div className="today-summary-card">
                <div className="today-summary-k">7-Day Radar</div>
                <div className="today-summary-v">Best day: {dailyFeed.radar.bestDay.label} · Caution: {dailyFeed.radar.cautionDay.label}</div>
                <div className="today-summary-hint">Today score {dailyFeed.radar.days[0]?.overallScore ?? "-"} / 100</div>
              </div>
              <div className="today-summary-card">
                <div className="today-summary-k">Remedy</div>
                <div className="today-summary-v">{dailyFeed.radar.days[0]?.remedy ?? "Keep routine stable and avoid impulsive reactions."}</div>
                <div className="today-summary-hint"><Link href="/dashboard/event-radar" style={{ color: "#c8a030", textDecoration: "none" }}>Open Event Radar →</Link></div>
              </div>
            </div>
          </div>
          )}

          {/* QUICK ACTIONS */}
          <div>
            <div className="card">
              <div className="card-tag">✦ Quick Actions</div>
              <div className="card-title serif">What would you like to explore?</div>
              <div className="actions-grid">
                {[
                  { icon:"🔯", label:"My Kundli",         desc:"Birth chart & core profile", href:"/dashboard/kundli" },
                  { icon:"📡", label:"Event Radar",       desc:"7-day event timing",         href:"/dashboard/event-radar" },
                  { icon:"🪐", label:"Transits",          desc:"Live gochar analysis",        href:"/dashboard/transits" },
                  { icon:"📅", label:"Panchang",          desc:"Daily tithi & nakshatra",     href:"/dashboard/panchang" },
                  { icon:"🎵", label:"Astro Sound",       desc:"Raga-based sound remedy",     href:"/dashboard/astro-sound" },
                  { icon:"📈", label:"Destiny Timeline",  desc:"Life arc and dasha flow",     href:"/dashboard/destiny" },
                  { icon:"⏳", label:"Dasha Timeline",   desc:"Maha + Antar + Pratyantar",   href:"/dashboard/dasha" },
                  { icon:"🧠", label:"Psychology",        desc:"Mind and behavior mapping",   href:"/dashboard/psychology" },
                  { icon:"💑", label:"Kundali Milan",     desc:"36-point compatibility",      href:"/dashboard/kundali-milan" },
                  { icon:"📘", label:"Lal Kitab",         desc:"Karmic remedies",             href:"/dashboard/lalkitab" },
                  { icon:"🧿", label:"Yogas",             desc:"Rajyoga and dosha scan",      href:"/dashboard/yogas" },
                  { icon:"⚖️", label:"Shadbala",          desc:"Planet strength index",       href:"/dashboard/shadbala" },
                  { icon:"🧮", label:"Ashtakavarga",      desc:"House bindu scoring",         href:"/dashboard/ashtakavarga" },
                  { icon:"🧩", label:"Divisional Charts", desc:"D9 and varga depth",          href:"/dashboard/divisional" },
                  { icon:"🔢", label:"Numerology",        desc:"Name and date numbers",       href:"/dashboard/numerology" },
                  { icon:"🏠", label:"Vastu",             desc:"16-zone vastu engine",        href:"/dashboard/vastu" },
                  { icon:"🧭", label:"KP Engine",         desc:"Krishnamurti precision",      href:"/dashboard/kp" },
                  { icon:"💎", label:"Gemstone",         desc:"Safe gemstone guidance",       href:"/dashboard/gemstone" },
                  { icon:"📄", label:"Premium Report",    desc:"Full integrated report",      href:"/dashboard/report" },
                  { icon:"🔱", label:"Jaimini",           desc:"Chara Karakas, Arudha, Dasha", href:"/dashboard/jaimini" },
                  { icon:"🤖", label:"AI Chat",           desc:"Talk to AI astrologer",       href:"/dashboard/chat" },
              ].map((a,i) => (
                  <Link key={i} href={a.href} className="action-btn">
                    <div className="action-btn-icon">{a.icon}</div>
                    <div className="action-btn-label">{a.label}</div>
                    <div className="action-btn-desc">{a.desc}</div>
                  </Link>
                ))}
              </div>
          </div>
          </div>

        </main>
      </div>
    </>
  );
}
