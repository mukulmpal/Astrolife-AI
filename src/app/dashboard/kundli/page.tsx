"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { detectYogas, calculateYogaScore, CATEGORY_META, type YogaResult, type PlanTier } from "@/lib/astro-engine/yogas";
import { listSavedCharts, saveChartToAccount, selectSavedChart, type SavedChartSummary, useUserChart, buildChart, type BirthDetails, saveCurrentChart, useChartEngine } from "@/lib/user-chart";
import astroBank from "@/data/astroBank.json";
import NorthIndianChart from "@/components/north-indian-chart";
import { useLanguage } from "@/lib/language-context";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";
import { EngineStateCard } from "@/components/engine-state-card";
import { createClient } from "@/lib/supabase/client";
import { calculateDivisional, type DivChart } from "@/lib/astro-engine/divisional";
import { isFullAccessEnabled, isEliteEmail, normalizeTier } from "@/lib/access";
import { DailyPanchangWidget } from "@/components/panchang/DailyPanchangWidget";
import { ChartProofChatDrawer } from "@/components/chat/ChartProofChatDrawer";
import { calculateShadbala, type ShadbalaResult } from "@/lib/astro-engine/shadbala";
import { buildMangalDoshaInsight, type MangalDoshaInsight } from "@/lib/astro-engine/mangal-dosha-adapter";

const PLS  = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PEMO = ["Su","Mo","Ma","Me","Ju","Ve","Sa","Ra","Ke"];
const PCOL = ["#d97706","#b8860b","#dc2626","#15803d","#d97706","#db2777","#2563eb","#854d0e","#e11d48"];

function ianaToUtcOffset(timezone: string | null, dob: string, tob: string): number {
  if (!timezone) return 5.5;

  try {
    const date = new Date(`${dob || "2000-01-01"}T${tob || "12:00"}:00Z`);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const tzStr = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+5:30";
    const match = tzStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 5.5;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours + minutes / 60);
  } catch {
    return 5.5;
  }
}

export default function KundliPage() {
  const router = useRouter();
  const { tp, ts, tn } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    tob: "",
    city: "",
    lat: null as number | null,
    lon: null as number | null,
    tz: null as number | null,
  });
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [divCharts, setDivCharts] = useState<DivChart[]>([]);
  const [yogas, setYogas] = useState<YogaResult[]>([]);
  const [yogaScore, setYogaScore] = useState<{ total: number; rating: string; rareCount: number }>({
    total: 0,
    rating: "",
    rareCount: 0,
  });
  const [shadbala, setShadbala] = useState<ShadbalaResult | null>(null);
  const [mangalDosha, setMangalDosha] = useState<MangalDoshaInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<SavedChartSummary[]>([]);
  const [saveStatus, setSaveStatus] = useState("New generated charts become your primary chart.");
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"saved" | "astrobank">("saved");
  const [yogaSearch, setYogaSearch] = useState("");
  const [yogaFilter, setYogaFilter] = useState<"all" | "benefic" | "dosha" | "rare">("all");
  const [userTier, setUserTier] = useState<PlanTier>(() => isFullAccessEnabled() ? "elite" : "free");
  const { setChartData } = useChartEngine();
  const { chart: primaryChart, loading: chartLoading, hasUserChart } = useUserChart();

  useEffect(() => {
    if (isFullAccessEnabled()) {
      setUserTier("elite");
      return;
    }
    const loadTier = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user) return;
        const isElite = (user.email && isEliteEmail(user.email)) ||
          (user as Record<string, unknown>).app_metadata && ((user as Record<string, unknown>).app_metadata as Record<string, unknown>).subscription_tier === "elite" ||
          (user as Record<string, unknown>).user_metadata && ((user as Record<string, unknown>).user_metadata as Record<string, unknown>).subscription_tier === "elite";
        if (isElite) {
          setUserTier("elite");
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();
        const effective = normalizeTier(profile?.subscription_tier, user.email);
        setUserTier(effective as PlanTier);
      } catch (err) {
        console.warn("Failed to load user tier in kundli page:", err);
      }
    };
    loadTier();
  }, []);

  const saveChartToLibrary = async (data: ChartData) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=/dashboard/kundli");
      return false;
    }

    const response = await fetch("/api/charts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        birth_date: data.dob,
        birth_time: data.tob,
        birth_place: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: String(data.tz),
        chart_payload: data,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      setSaveStatus(payload?.error ?? "Could not save chart. Check Supabase saved_charts migration.");
      return false;
    }

    await refreshSavedCharts();
    setSaveStatus("Chart saved to your account.");
    return true;
  };

  const applyChart = (data: ChartData, tier: PlanTier = userTier) => {
    setChart(data);
    setActiveTab("overview");
    const allYogas = detectYogas(data.planets as never, data.lagnaNum, tier);
    setYogas(allYogas);
    const present = allYogas.filter((y) => y.present && !y.isDosha);
    setYogaScore(calculateYogaScore(present));
    setDivCharts(calculateDivisional(data.planets as never, data.lagnaNum, data.lagnaLon));

    // Calculate Shadbala
    try {
      const birthHour = parseInt(data.tob.split(":")[0], 10) || 12;
      const sb = calculateShadbala(data.planets as never, birthHour);
      setShadbala(sb);
    } catch (err) {
      console.warn("Shadbala calculation error:", err);
    }

    // Calculate Mangal Dosha
    try {
      const mdInsight = buildMangalDoshaInsight(data);
      setMangalDosha(mdInsight);
    } catch (err) {
      console.warn("Mangal dosha calculation error:", err);
    }
  };

  useEffect(() => {
    if (chart?.planets) {
      const allYogas = detectYogas(chart.planets as never, chart.lagnaNum, userTier);
      setYogas(allYogas);
      const present = allYogas.filter((y) => y.present && !y.isDosha);
      setYogaScore(calculateYogaScore(present));
    }
  }, [userTier, chart]);

  const downloadPDF = async () => {
    const element = document.querySelector(".page") as HTMLElement;
    if (!element) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#FAF7F2" });
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${chart?.name || "Astrolife"}_Kundli.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  const refreshSavedCharts = async () => {
    setLibraryLoading(true);
    setSavedCharts(await listSavedCharts());
    setLibraryLoading(false);
  };

  useEffect(() => {
    const loadCharts = async () => {
      setLibraryLoading(true);
      setSavedCharts(await listSavedCharts());
      setLibraryLoading(false);
    };

    loadCharts();
  }, []);

  useEffect(() => {
    if (chartLoading || !hasUserChart || !primaryChart) return;
    if (!chart || chart.name !== primaryChart.name) {
      applyChart(primaryChart);
      setSaveStatus(`${primaryChart.name}'s chart loaded.`);
      setShowForm(false);
    }
  }, [primaryChart, chartLoading, hasUserChart, chart]);

  const handleSelectCelebrity = (person: (typeof astroBank)[0]) => {
    const birth: BirthDetails = {
      name: person.name,
      dob: person.birthDate,
      // Ensure HH:mm format (strip seconds) for calculateChart validation
      tob: person.birthTime ? person.birthTime.slice(0,5) : "12:00",
      city: person.birthPlace ?? "Delhi",
      // Fallback coordinates if not provided – use 0,0 (near Gulf of Guinea) which works with calculateChart
      lat: person.latitude ?? 0,
      lon: person.longitude ?? 0,
      tz: person.tz ?? undefined,
    };
    try {
      const newChart = buildChart(birth);
      setChartData(newChart);
      saveCurrentChart(newChart);
      applyChart(newChart);
      setSaveStatus(`${person.name}'s Kundli loaded.`);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to load celebrity chart:", err);
    }
  };

  const handleSelectSavedChart = async (chartId: string) => {
    setLibraryLoading(true);
    const nextChart = await selectSavedChart(chartId);
    if (nextChart) {
      applyChart(nextChart);
      setSaveStatus("Primary chart switched.");
      setSavedCharts(await listSavedCharts());
    } else {
      setSaveStatus("Chart library is not available yet. Apply Supabase schema to enable switching.");
    }
    setLibraryLoading(false);
  };

  const handleGenerate = async () => {
    if (!form.name || !form.dob || !form.tob || !form.city || !selectedCity) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const data = calculateChart(
        form.name,
        form.dob,
        form.tob,
        form.city,
        form.lat ?? undefined,
        form.lon ?? undefined,
        form.tz ?? undefined,
      );
      await saveChartToAccount(data);
      applyChart(data);
      setSaveStatus("Chart generated. Use Save Chart to store it in your account library.");
      setShowForm(false);
      await fetch("/api/charts/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, dob: form.dob, tob: form.tob, city: form.city, lat: form.lat, lon: form.lon }),
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSaveCurrentChart = async () => {
    if (!chart) return;
    setLibraryLoading(true);
    try {
      await saveChartToAccount(chart, { replacePrimary: true });
      await saveChartToLibrary(chart);
    } finally {
      setLibraryLoading(false);
    }
  };

  const dignityColor = (d: string) => {
    if (d === "Exalted") return "#22c55e";
    if (d === "Own") return "#c8a030";
    if (d === "Debilitated") return "#ef4444";
    if (d === "Combust") return "#f97316";
    return "#6B635B";
  };

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  const presentYogas = yogas.filter((y) => y.present);

  const filteredYogas = useMemo(() => {
    return presentYogas.filter((y) => {
      const matchesSearch =
        yogaSearch === "" ||
        y.name.toLowerCase().includes(yogaSearch.toLowerCase()) ||
        y.description.toLowerCase().includes(yogaSearch.toLowerCase()) ||
        y.category.toLowerCase().includes(yogaSearch.toLowerCase());

      if (!matchesSearch) return false;
      if (yogaFilter === "benefic") return !y.isDosha;
      if (yogaFilter === "dosha") return y.isDosha;
      if (yogaFilter === "rare") return y.rare;
      return true;
    });
  }, [presentYogas, yogaSearch, yogaFilter]);

  // Divisional chart lookup
  const d9 = divCharts.find((c) => c.key === "D9");
  const d10 = divCharts.find((c) => c.key === "D10");

  const d9Planets = useMemo(() => {
    if (!d9) return {};
    const res: Record<string, { house: number; retrograde: boolean; signNum: number }> = {};
    d9.planets.forEach((p) => {
      res[p.planet] = { house: p.house, retrograde: p.retrograde, signNum: p.signNum };
    });
    return res;
  }, [d9]);

  const d10Planets = useMemo(() => {
    if (!d10) return {};
    const res: Record<string, { house: number; retrograde: boolean; signNum: number }> = {};
    d10.planets.forEach((p) => {
      res[p.planet] = { house: p.house, retrograde: p.retrograde, signNum: p.signNum };
    });
    return res;
  }, [d10]);

  const activeMD = chart?.dashas.find((d) => d.active);
  const activeAD = chart?.antardasha.find((d) => d.active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:var(--app-bg, #FAF8F5);color:var(--app-fg, #1A1A1A);font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--app-bg, #FAF8F5)}::-webkit-scrollbar-thumb{background:var(--app-gold, #B8860B);border-radius:2px}
        .page{max-width:1200px;margin:0 auto;padding:32px}
        .page-tag{font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:var(--app-gold, #B8860B);margin-bottom:8px;font-weight:700}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--app-fg, #1A1A1A);line-height:1.1}
        .page-title em{font-style:italic;color:var(--app-gold, #B8860B)}
        .page-sub{font-size:14px;color:var(--app-muted, #6B635B);margin-top:6px;margin-bottom:28px}
        .form-card{background:var(--app-card, #FFFFFF);border:1px solid var(--app-border, rgba(184, 134, 11, 0.2));border-radius:20px;padding:32px;margin-bottom:28px;box-shadow:0 8px 30px rgba(184, 134, 11, 0.06)}
        .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .form-group{display:flex;flex-direction:column;gap:8px}
        .label{font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-muted, #6B635B);font-weight:700}
        .input{height:48px;padding:0 16px;background:#FAF8F5;border:1px solid var(--app-border, rgba(184, 134, 11, 0.25));border-radius:12px;outline:none;font-size:14px;color:var(--app-fg, #1A1A1A);font-family:'Outfit',sans-serif;transition:border-color 0.2s, box-shadow 0.2s;width:100%}
        .input:focus{border-color:var(--app-gold, #B8860B);box-shadow:0 0 0 3px rgba(184, 134, 11, 0.12)}
        .input::placeholder{color:#8C8278}
        .city-note{margin-top:8px;font-size:13px;color:var(--app-muted, #6B635B);line-height:1.6}
        .btn-gen{width:100%;margin-top:20px;padding:16px;background:linear-gradient(135deg,#B8860B,#D4AF37);border:none;border-radius:12px;font-size:15px;font-weight:700;color:#FFFFFF;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(184, 134, 11, 0.25)}
        .btn-gen:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(184, 134, 11, 0.35)}
        .btn-gen:disabled{opacity:0.5;cursor:not-allowed}
        .result-header{background:linear-gradient(135deg,var(--app-card, #FFFFFF),var(--app-card-alt, #F7F4EC));border:1px solid var(--app-border, rgba(184, 134, 11, 0.25));border-radius:20px;padding:28px 32px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;box-shadow:0 8px 30px rgba(184, 134, 11, 0.06)}
        .result-name{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:var(--app-fg, #1A1A1A)}
        .result-name em{font-style:italic;color:var(--app-gold, #B8860B)}
        .result-meta{display:flex;gap:20px;flex-wrap:wrap;margin-top:8px}
        .meta-item{font-size:13px;color:var(--app-muted, #6B635B)}
        .meta-item span{color:var(--app-fg, #1A1A1A);font-weight:600}
        .asc-badge{background:#FAF8F5;border:1px solid rgba(184, 134, 11, 0.25);border-radius:12px;padding:12px 20px;text-align:center;min-width:110px}
        .asc-label{font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-muted, #6B635B);margin-bottom:4px;font-weight:700}
        .asc-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--app-gold, #B8860B)}
        .asc-deg{font-size:13px;color:var(--app-muted, #6B635B);margin-top:2px}
        .acc-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(34,139,34,0.08);border:1px solid rgba(34,139,34,0.25);border-radius:100px;padding:6px 14px;font-size:13px;color:#1E7E34;margin-bottom:16px;font-weight:600}
        .tabs{display:flex;gap:6px;margin-bottom:24px;background:#F4F0E8;border:1px solid rgba(184, 134, 11, 0.2);border-radius:14px;padding:6px;width:100%;overflow-x:auto}
        .tab{padding:10px 18px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.2s;color:var(--app-muted, #6B635B);border:none;background:none;font-family:'Outfit',sans-serif;white-space:nowrap;display:flex;align-items:center;gap:6px}
        .tab:hover{color:var(--app-fg, #1A1A1A);background:rgba(184, 134, 11, 0.08)}
        .tab.active{background:#FFFFFF;color:var(--app-gold, #B8860B);border:1px solid rgba(184, 134, 11, 0.35);box-shadow:0 4px 14px rgba(184, 134, 11, 0.12);font-weight:700}
        .tab-badge{font-size:11px;padding:2px 8px;border-radius:999px;background:rgba(184, 134, 11, 0.12);color:var(--app-gold, #B8860B);font-weight:700}
        .chart-layout{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        @media(max-width:960px){.chart-layout{grid-template-columns:1fr}}
        .card{background:var(--app-card, #FFFFFF);border:1px solid var(--app-border, rgba(184, 134, 11, 0.18));border-radius:16px;padding:24px;box-shadow:0 6px 24px rgba(184, 134, 11, 0.05)}
        .card-tag{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--app-gold, #B8860B);margin-bottom:6px;font-weight:700}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--app-fg, #1A1A1A);margin-bottom:16px}
        .ptable{width:100%;border-collapse:collapse}
        .ptable th{font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-gold, #B8860B);padding:10px 12px;text-align:left;font-weight:700;border-bottom:1.5px solid rgba(184, 134, 11, 0.25)}
        .ptable td{padding:12px 12px;border-bottom:1px solid rgba(184, 134, 11, 0.12);font-size:13.5px;vertical-align:middle;color:var(--app-fg, #1A1A1A)}
        .ptable tr:last-child td{border-bottom:none}
        .retro{font-size:11px;color:#D97706;border:1px solid rgba(217,119,6,0.3);border-radius:4px;padding:1px 5px;margin-left:4px;font-weight:700}
        .dpill{font-size:12px;padding:3px 10px;border-radius:6px;background:#FAF8F5;font-weight:700;border:1px solid rgba(184, 134, 11, 0.18)}
        .dasha-item{display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:12px;border:1px solid rgba(184, 134, 11, 0.15);background:#FAF8F5;margin-bottom:8px;transition:all 0.2s}
        .dasha-item.active{border-color:rgba(184, 134, 11, 0.45);background:rgba(184, 134, 11, 0.08);box-shadow:0 4px 12px rgba(184, 134, 11, 0.08)}
        .dasha-item:last-child{margin-bottom:0}
        .ddot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .ddot.active{background:var(--app-gold, #B8860B);box-shadow:0 0 8px rgba(184, 134, 11, 0.5)}
        .ddot.inactive{background:#D1C7BD}
        .dplanet{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;flex:1}
        .dplanet.active{color:var(--app-gold, #B8860B)}.dplanet.inactive{color:var(--app-fg, #1A1A1A)}
        .dperiod{font-size:13.5px;color:var(--app-soft, #3D3834);font-weight:500}
        .abadge{font-size:12px;padding:4px 12px;border-radius:20px;background:rgba(184, 134, 11, 0.15);color:var(--app-gold, #B8860B);border:1px solid rgba(184, 134, 11, 0.35);font-weight:700}
        .btn-save{display:flex;align-items:center;gap:8px;padding:10px 18px;background:#FAF8F5;border:1px solid rgba(184, 134, 11, 0.3);border-radius:10px;color:var(--app-gold, #B8860B);font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-save:hover{background:#FFFFFF;border-color:rgba(184, 134, 11, 0.5);transform:translateY(-1px)}
        .library{background:var(--app-card, #FFFFFF);border:1px solid var(--app-border, rgba(184, 134, 11, 0.2));border-radius:16px;padding:24px;margin-bottom:24px}
        .library-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:14px}
        .library-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--app-fg, #1A1A1A)}
        .library-sub{font-size:13px;color:var(--app-muted, #6B635B);margin-top:3px;line-height:1.6}
        .library-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
        .library-card{background:#FAF8F5;border:1px solid rgba(184, 134, 11, 0.18);border-radius:16px;padding:18px 20px;text-align:left;cursor:pointer;transition:all 0.25s;color:inherit;font-family:'Outfit',sans-serif}
        .library-card:hover{border-color:rgba(184, 134, 11, 0.4);transform:translateY(-2px);background:#FFFFFF;box-shadow:0 6px 20px rgba(184, 134, 11, 0.08)}
        .library-card.primary{border-color:rgba(184, 134, 11, 0.5);background:rgba(184, 134, 11, 0.08)}
        .library-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:var(--app-fg, #1A1A1A);margin-bottom:6px}
        .library-meta{font-size:13px;color:var(--app-muted, #6B635B);line-height:1.6}
        .library-pill{display:inline-flex;margin-top:10px;padding:3px 10px;border-radius:999px;border:1px solid rgba(184, 134, 11, 0.3);color:var(--app-gold, #B8860B);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700}
        /* YOGA STYLES */
        .yoga-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
        .yoga-card{background:#FAF8F5;border:1px solid rgba(184, 134, 11, 0.18);border-radius:14px;padding:20px;transition:all 0.2s}
        .yoga-card.dosha{border-color:rgba(220,38,38,0.3);background:rgba(254,242,242,0.5)}
        .yoga-card:hover{transform:translateY(-2px);border-color:rgba(184, 134, 11, 0.4);background:#FFFFFF;box-shadow:0 6px 20px rgba(184, 134, 11, 0.08)}
        @media(max-width:768px){
          .form-grid{grid-template-columns:1fr}
          .chart-layout{grid-template-columns:1fr}
          .page{padding:20px}
          .result-header{flex-direction:column}
          .tabs{gap:4px}
          .tab{padding:8px 12px;font-size:12px}
        }
      `}</style>

      <div className="page">
        <div className="page-tag">✦ Kundli Intelligence Engine</div>
        <h1 className="page-title serif">
          Vedic Life Blueprint & <em>Actionable Guidance</em>
        </h1>
        <p className="page-sub">
          Moshier / NASA Ephemeris · Lahiri Chitrapaksha · 120 Yogas · Classical Shastric Proofs
        </p>

        {/* SAVED CHARTS LIBRARY DRAWER */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="library-top" style={{ marginBottom: showLibrary ? 14 : 0 }}>
            <div>
              <div className="card-tag">✦ Saved Charts & Database</div>
              <div className="card-title serif" style={{ marginBottom: 0 }}>Chart Library</div>
              <div className="library-sub">{saveStatus}</div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                className="btn-save"
                onClick={() => setShowLibrary(!showLibrary)}
                style={{
                  borderColor: showLibrary ? "rgba(200,160,48,0.4)" : "rgba(200,160,48,0.2)",
                  background: showLibrary ? "rgba(200,160,48,0.1)" : "transparent",
                }}
              >
                {showLibrary ? "▲ Hide Library" : "▼ Open Library"}
              </button>
              <button
                className="btn-save"
                onClick={() => setShowForm(!showForm)}
                style={{
                  borderColor: showForm ? "rgba(239,68,68,0.3)" : "rgba(200,160,48,0.3)",
                  color: showForm ? "#ef4444" : "#c8a030",
                }}
              >
                {showForm ? "✕ Close Form" : "✦ New Chart"}
              </button>
              <button
                className="btn-save"
                onClick={downloadPDF}
                style={{ color: "#22c55e", borderColor: "rgba(34,197,94,0.3)" }}
              >
                ↓ Download PDF
              </button>
              <button className="btn-save" onClick={refreshSavedCharts} disabled={libraryLoading}>
                {libraryLoading ? "⟳ Loading..." : "↻ Refresh"}
              </button>
            </div>
          </div>
          {showLibrary && (
            <>
          {/* Library Tab Switcher */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", borderBottom: "1px solid rgba(184, 134, 11, 0.2)", paddingBottom: "10px" }}>
            <button
              onClick={() => setLibraryTab("saved")}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: libraryTab === "saved" ? "1px solid rgba(184, 134, 11, 0.45)" : "1px solid rgba(184, 134, 11, 0.2)",
                background: libraryTab === "saved" ? "rgba(184, 134, 11, 0.15)" : "#FAF8F5",
                color: libraryTab === "saved" ? "#B8860B" : "#6B635B",
                fontFamily: "Outfit, sans-serif",
                transition: "all 0.2s",
              }}
            >
              📁 My Saved Charts ({savedCharts.length})
            </button>
            <button
              onClick={() => setLibraryTab("astrobank")}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: libraryTab === "astrobank" ? "1px solid rgba(184, 134, 11, 0.45)" : "1px solid rgba(184, 134, 11, 0.2)",
                background: libraryTab === "astrobank" ? "rgba(184, 134, 11, 0.15)" : "#FAF8F5",
                color: libraryTab === "astrobank" ? "#B8860B" : "#6B635B",
                fontFamily: "Outfit, sans-serif",
                transition: "all 0.2s",
              }}
            >
              🌟 Famous Personalities / AstroBank ({astroBank.length})
            </button>
          </div>

          {libraryTab === "saved" ? (
            savedCharts.length > 0 ? (
              <div className="library-list">
                {savedCharts.map((saved) => (
                  <button
                    key={saved.id}
                    className={`library-card ${saved.isPrimary ? "primary" : ""}`}
                    onClick={() => handleSelectSavedChart(saved.id)}
                    disabled={libraryLoading}
                  >
                    <div className="library-name">{saved.name}</div>
                    <div className="library-meta">
                      {new Date(saved.dob).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {saved.tob}
                      <br />
                      {saved.city}
                    </div>
                    {saved.isPrimary && <span className="library-pill">Primary</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="library-sub">
                No account charts loaded yet. Generate a chart to save it permanently, or click any famous personality in AstroBank!
              </div>
            )
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", padding: "12px 16px", borderRadius: "12px", background: "rgba(184, 134, 11, 0.06)", border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>
                    🌟 Explore AstroBank by Country & Category
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B635B" }}>
                    Navigate all 1,155+ celebrities organized step-by-step (Country → Category → Personalities).
                  </div>
                </div>
                <a
                  href="/dashboard/astro-bank"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #B8860B, #D4AF37)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "12px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(184, 134, 11, 0.2)",
                  }}
                >
                  Open Full AstroBank Portal →
                </a>
              </div>

              <div className="library-list" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                {astroBank.slice(0, 18).map((person, idx) => {
                  const isCurrent = chart?.name === person.name;
                  return (
                    <button
                      key={`${person.name}-${idx}`}
                      className={`library-card ${isCurrent ? "primary" : ""}`}
                      onClick={() => handleSelectCelebrity(person)}
                      style={{ padding: "16px", borderRadius: "14px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div className="library-name" style={{ fontSize: "15px", fontWeight: 700 }}>{person.name}</div>
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: "rgba(184, 134, 11, 0.12)", color: "#B8860B", textTransform: "capitalize", fontWeight: 600 }}>
                          {person.category?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="library-meta" style={{ fontSize: "12px", lineHeight: "1.5", color: "#6B635B" }}>
                        📅 {person.birthDate} · ⏰ {person.birthTime?.slice(0, 5)}
                        <br />
                        📍 {person.birthPlace}
                      </div>
                      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {isCurrent ? (
                          <span className="library-pill" style={{ background: "rgba(34,139,34,0.12)", color: "#1E7E34", borderColor: "rgba(34,139,34,0.3)" }}>
                            Active Kundli
                          </span>
                        ) : (
                          <span className="library-pill">Click to Open Kundli →</span>
                        )}
                        <span style={{ fontSize: "11px", color: "#6B635B", textTransform: "capitalize" }}>
                          {person.country}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          </>
        )}
        </div>

        {/* INPUT FORM */}
        {(showForm || !chart) && (
          <div className="form-card">
            <div className="form-grid">
              <div className="form-group">
                <label className="label">Full Name</label>
                <input
                  className="input"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="label">Date of Birth</label>
                <input
                  className="input"
                  type="date"
                  value={form.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      dob: e.target.value,
                      tz: selectedCity ? ianaToUtcOffset(selectedCity.timezone, e.target.value, f.tob) : f.tz,
                    }))
                  }
                  style={{ colorScheme: "light" }}
                />
              </div>
              <div className="form-group">
                <label className="label">Time of Birth</label>
                <input
                  className="input"
                  type="time"
                  value={form.tob}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tob: e.target.value,
                      tz: selectedCity ? ianaToUtcOffset(selectedCity.timezone, f.dob, e.target.value) : f.tz,
                    }))
                  }
                  style={{ colorScheme: "light" }}
                />
              </div>
              <div className="form-group">
                <CityAutocomplete
                  label="Birth City"
                  value={selectedCity}
                  placeholder="Search from 68k+ cities, e.g. Mumbai, Delhi, New York"
                  onChange={(city) => {
                    setSelectedCity(city);
                    setForm((prev) => ({
                      ...prev,
                      city: city?.displayName ?? "",
                      lat: city?.latitude ?? null,
                      lon: city?.longitude ?? null,
                      tz: city ? ianaToUtcOffset(city.timezone, prev.dob, prev.tob) : null,
                    }));
                  }}
                />
                <div className="city-note">
                  Automatic GPS coordinates & exact solar timezone offset applied.
                </div>
              </div>
            </div>
            <button
              className="btn-gen"
              onClick={handleGenerate}
              disabled={!form.name || !form.dob || !form.tob || !form.city || !selectedCity || loading}
            >
              {loading ? "⟳ Calculating Astronomical Ephemeris..." : "🔯 Calculate Kundli & Yogas"}
            </button>
          </div>
        )}

        {chart && !showForm && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <button className="btn-save" onClick={() => setShowForm(true)}>
              ✎ Edit Birth Details
            </button>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading && (
          <EngineStateCard
            title="Janma Kundli"
            loading
            loadingText="Aligning the planetary spheres… calculating Lagna and Shodashavarga charts."
          />
        )}

        {/* CHART DETAILS & PILLARS */}
        {chart && !loading && (
          <>
            {/* HERO RESULT HEADER */}
            <div className="result-header">
              <div>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#B8860B", marginBottom: 6, fontWeight: 700 }}>
                  ✦ Natal Shastric Blueprint
                </div>
                <div className="result-name serif">
                  {chart.name}&apos;s <em>Cosmic Horizon</em>
                </div>
                <div className="result-meta">
                  <div className="meta-item">
                    📅 <span>{new Date(chart.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="meta-item">⏰ <span>{chart.tob}</span></div>
                  <div className="meta-item">📍 <span>{chart.city}</span></div>
                  <div className="meta-item">🌐 <span>{chart.lat.toFixed(2)}°N, {chart.lon.toFixed(2)}°E</span></div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div className="asc-badge">
                  <div className="asc-label">Lagna</div>
                  <div className="asc-val">{chart.lagnaRashi}</div>
                  <div className="asc-deg">{Math.floor(chart.lagnaLon % 30)}° {Math.floor(((chart.lagnaLon % 30) % 1) * 60)}&apos;</div>
                </div>
                <div className="asc-badge" style={{ borderColor: "rgba(184, 134, 11, 0.25)", background: "#FAF8F5" }}>
                  <div className="asc-label" style={{ color: "#B8860B" }}>Moon (Rashi)</div>
                  <div className="asc-val" style={{ color: "#1A1A1A" }}>{chart.planets?.Moon?.sign ?? "—"}</div>
                  <div className="asc-deg" style={{ color: "#6B635B" }}>{chart.planets?.Moon?.nakshatra ?? "—"} P{chart.planets?.Moon?.pada ?? "1"}</div>
                </div>
                <div style={{ textAlign: "center", background: "rgba(184, 134, 11, 0.08)", border: "1px solid rgba(184, 134, 11, 0.25)", borderRadius: 12, padding: "12px 18px" }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 700, color: "#B8860B", lineHeight: 1 }}>
                    {yogaScore.total}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B635B", marginTop: 3, fontWeight: 700 }}>YOGA SCORE</div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 13, color: "#B8860B", marginTop: 2, fontWeight: 700 }}>
                    {yogaScore.rating}
                  </div>
                </div>
                <button className="btn-save" onClick={handleSaveCurrentChart} disabled={libraryLoading}>
                  {libraryLoading ? "⟳ Saving..." : "💾 Save Chart"}
                </button>
              </div>
            </div>

            <div className="acc-badge">
              ✓ NASA Ephemeris · Lahiri Ayanamsha · {presentYogas.length} Yogas Detected · Classical Math Verified
            </div>

            {/* LIVE DAILY PANCHANG EMBEDDED WIDGET */}
            <DailyPanchangWidget compact className="mb-4" />

            {/* ── 4 INTENT-DRIVEN PILLARS + ASK AI TABS ── */}
            <div className="tabs">
              {[
                { id: "overview", label: "🧭 Overview & Life Pulse", badge: null },
                { id: "career", label: "💼 Career & Wealth (D-10)", badge: "Karma" },
                { id: "marriage", label: "💍 Love & Marriage (D-9)", badge: "Navamsha" },
                { id: "timing", label: "⏳ Timing & Dashas", badge: "Vimshottari" },
                { id: "specs", label: "🔬 Astrologer Tech Specs", badge: `${presentYogas.length} Yogas` },
                { id: "ask_ai", label: "💬 Ask AI (Proof-Backed)", badge: "Live" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.label}</span>
                  {tab.badge && <span className="tab-badge">{tab.badge}</span>}
                </button>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 1: OVERVIEW & LIFE PULSE                        */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Visual Chart + Active Dasha Side by Side */}
                <div className="chart-layout">
                  {/* Lagna Chart */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="card-tag">✦ Primary Birth Chart (D-1)</div>
                        <div className="card-title serif">Janma Lagna Kundli</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                        {chart.lagnaRashi} Rising
                      </span>
                    </div>

                    <div
                      role="region"
                      aria-label={`Natal chart for ${chart?.name || 'chart'}`}
                      tabIndex={-1}
                    >
                      <NorthIndianChart lagnaNum={chart.lagnaNum} planets={chart.planets} />
                    </div>

                    <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12 }}>
                      <div style={{ fontSize: 11, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                        Lagna Summary — {chart.lagnaRashi}
                      </div>
                      <div style={{ fontSize: 13.5, color: "#3D3834", lineHeight: 1.7 }}>
                        Aapka Lagna <strong style={{ color: "#1A1A1A" }}>{chart.lagnaRashi}</strong> hai jo aapki core personality, vitality aur life approach ko govern karta hai. Chandra rashi <strong style={{ color: "#B8860B" }}>{chart.planets?.Moon?.sign}</strong> ({chart.planets?.Moon?.nakshatra}) aapke emotional patterns aur mind ko direction deti hai.
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Life Chapters & Quick Action Hub */}
                  <div className="space-y-4">
                    {/* Active Dasha Chapter Card */}
                    <div className="card">
                      <div className="card-tag">✦ Current Life Chapter</div>
                      <div className="card-title serif">
                        {tp(activeMD?.planet || "")} Mahadasha
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] flex items-center justify-between">
                          <div>
                            <div className="text-xs text-[#6B635B] font-semibold">Active Vimshottari Period</div>
                            <div className="text-base font-bold text-[#1A1A1A] mt-0.5">
                              <span className="text-[#B8860B]">{tp(activeMD?.planet || "")} MD</span>
                              {activeAD && <span className="text-[#3D3834]"> / {tp(activeAD.planet)} AD</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-[#6B635B] font-semibold">Window</div>
                            <div className="text-xs font-mono text-[#3D3834] mt-0.5 font-bold">
                              {activeMD && formatDate(activeMD.start)} → {activeMD && formatDate(activeMD.end)}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[#3D3834] leading-relaxed">
                          Classical Jyotish ke niyam anusar, Mahadasha Lord chart ke un bhavo ka phal activate karta hai jinka yeh swami ya sthit hai. Antardasha Lord samayik ghatnao ko trigger karta hai.
                        </p>
                      </div>
                    </div>

                    {/* Instant Intent Launchpad (4 Action Pillars) */}
                    <div className="card">
                      <div className="card-tag">✦ Instant Domain Launchpad</div>
                      <div className="card-title serif">Where would you like to dive?</div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => setActiveTab("career")}
                          className="p-3 text-left rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] hover:bg-[#FFFFFF] transition-all group"
                        >
                          <div className="text-lg mb-1 group-hover:scale-110 transition-transform">💼</div>
                          <div className="text-xs font-bold text-[#1A1A1A]">Career & Wealth</div>
                          <div className="text-[11px] text-[#6B635B] mt-0.5">D-10 Dasamsha & Karma</div>
                        </button>

                        <button
                          onClick={() => setActiveTab("marriage")}
                          className="p-3 text-left rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] hover:bg-[#FFFFFF] transition-all group"
                        >
                          <div className="text-lg mb-1 group-hover:scale-110 transition-transform">💍</div>
                          <div className="text-xs font-bold text-[#1A1A1A]">Love & Marriage</div>
                          <div className="text-[11px] text-[#6B635B] mt-0.5">D-9 Navamsha & Milan</div>
                        </button>

                        <button
                          onClick={() => setActiveTab("timing")}
                          className="p-3 text-left rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] hover:bg-[#FFFFFF] transition-all group"
                        >
                          <div className="text-lg mb-1 group-hover:scale-110 transition-transform">⏳</div>
                          <div className="text-xs font-bold text-[#1A1A1A]">Dasha Timeline</div>
                          <div className="text-[11px] text-[#6B635B] mt-0.5">Vimshottari sub-periods</div>
                        </button>

                        <Link
                          href="/dashboard/muhurat"
                          className="p-3 text-left rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] hover:bg-[#FFFFFF] transition-all group block"
                        >
                          <div className="text-lg mb-1 group-hover:scale-110 transition-transform">⏰</div>
                          <div className="text-xs font-bold text-[#1A1A1A]">Muhurat Scanner</div>
                          <div className="text-[11px] text-[#6B635B] mt-0.5">Auspicious timing dates</div>
                        </Link>
                      </div>
                    </div>

                    {/* AI Chat Prompt Spark */}
                    <div
                      onClick={() => setActiveTab("ask_ai")}
                      className="p-4 rounded-xl bg-gradient-to-r from-[#FAF8F5] to-[#F7F4EC] border border-[rgba(184,134,11,0.25)] flex items-center justify-between cursor-pointer hover:border-[rgba(184,134,11,0.5)] transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl animate-pulse">💬</div>
                        <div>
                          <div className="text-xs font-bold text-[#1A1A1A]">Ask AI with Classical Proofs</div>
                          <div className="text-[12px] text-[#6B635B]">Verify career, marriage or timing with shastras</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#B8860B]">Open Chat →</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 2: CAREER & WEALTH (D-10 DASAMSHA)              */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "career" && (
              <div className="space-y-6">
                <div className="chart-layout">
                  {/* Dasamsha Chart */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="card-tag">✦ Career & Social Status (D-10)</div>
                        <div className="card-title serif">Dasamsha Chakra</div>
                      </div>
                      {d10 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                          {d10.lagna} Lagna
                        </span>
                      )}
                    </div>

                    {d10 ? (
                      <NorthIndianChart lagnaNum={d10.lagnaNum} planets={d10Planets} />
                    ) : (
                      <div className="py-20 text-center text-[#6B635B]">D-10 Not Calculated</div>
                    )}

                    <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12 }}>
                      <div style={{ fontSize: 11, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                        D-10 Career Insight
                      </div>
                      <div style={{ fontSize: 13.5, color: "#3D3834", lineHeight: 1.7 }}>
                        {d10?.keyInsight || "Dasamsha chart profession, authority, promotion aur public life me aapke karma sthiti ko darshata hai."}
                      </div>
                    </div>
                  </div>

                  {/* Career & Wealth Reading Breakdown */}
                  <div className="space-y-4">
                    <div className="card">
                      <div className="card-tag">✦ 10th House Karma Analysis</div>
                      <div className="card-title serif">Professional Alignment</div>
                      <div className="space-y-3 text-xs text-[#3D3834] leading-relaxed">
                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)]">
                          <div className="font-bold text-[#1A1A1A] mb-1">
                            10th House from Lagna: {chart.houseCusps?.[9]?.sign ?? "10th Bhava"}
                          </div>
                          <div className="text-[#3D3834]">
                            Yeh bhav aapke professional reputation, karma kshetra aur leadership potential ko govern karta hai.
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)]">
                          <div className="font-bold text-[#1A1A1A] mb-1">
                            2nd & 11th Houses (Dhana & Labha)
                          </div>
                          <div className="text-[#3D3834]">
                            2nd house (Accumulated Wealth) aur 11th house (Regular Cashflow & Gains) aapke financial retention ko shape karte hain.
                          </div>
                        </div>

                        {shadbala && (
                          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)]">
                            <div className="font-bold text-[#1A1A1A] mb-1">
                              Primary Career Drivers (By Planetary Strength)
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                              {shadbala.planets.slice(0, 3).map((p) => (
                                <span
                                  key={p.planet}
                                  className="text-xs px-2.5 py-1 rounded-lg bg-[rgba(184,134,11,0.12)] border border-[rgba(184,134,11,0.25)] text-[#B8860B] font-bold"
                                >
                                  ★ {p.planet} ({p.percentage}%)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveTab("ask_ai")}
                        className="btn-gen mt-4 text-xs font-bold py-3"
                      >
                        💼 Ask AI: &quot;What career & business timing suits my chart?&quot;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 3: LOVE & MARRIAGE (D-9 NAVAMSHA & MANGLIK)     */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "marriage" && (
              <div className="space-y-6">
                <div className="chart-layout">
                  {/* Navamsha Chart */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="card-tag">✦ Marriage & Soul Destiny (D-9)</div>
                        <div className="card-title serif">Navamsha Chakra</div>
                      </div>
                      {d9 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                          {d9.lagna} Lagna
                        </span>
                      )}
                    </div>

                    {d9 ? (
                      <NorthIndianChart lagnaNum={d9.lagnaNum} planets={d9Planets} />
                    ) : (
                      <div className="py-20 text-center text-[#6B635B]">D-9 Not Calculated</div>
                    )}

                    <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12 }}>
                      <div style={{ fontSize: 11, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                        Navamsha Dynamic
                      </div>
                      <div style={{ fontSize: 13.5, color: "#3D3834", lineHeight: 1.7 }}>
                        {d9?.keyInsight || "Navamsha D-9 kundli life partner ke qualities, soul connection aur post-marriage harmony ka mool aadhar hai."}
                      </div>
                    </div>
                  </div>

                  {/* Relationship Karma & Mangal Dosha Card */}
                  <div className="space-y-4">
                    {/* Mangal Dosha Card */}
                    <div className="card">
                      <div className="card-tag">✦ Relationship Intelligence</div>
                      <div className="card-title serif">Mangal Dosha & Partnership</div>

                      {mangalDosha ? (
                        <div className="space-y-3 text-xs text-[#3D3834]">
                          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] flex items-center justify-between">
                            <div>
                              <div className="text-[11px] text-[#6B635B] font-semibold">Mars Relationship Verdict</div>
                              <div className="text-sm font-bold text-[#1A1A1A] capitalize mt-0.5">
                                {mangalDosha.result.severityLabel} Mangal Pattern
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                mangalDosha.result.scores.natalSeverity >= 50
                                  ? "bg-[rgba(220,38,38,0.12)] text-[#DC2626] border border-[rgba(220,38,38,0.25)]"
                                  : "bg-[rgba(34,139,34,0.12)] text-[#1E7E34] border border-[rgba(34,139,34,0.25)]"
                              }`}
                            >
                              Severity: {mangalDosha.result.scores.natalSeverity}/100
                            </span>
                          </div>

                          <p className="leading-relaxed text-[#3D3834]">{mangalDosha.summary}</p>

                          <div className="space-y-1.5 pt-1">
                            <div className="text-[11px] uppercase tracking-wider text-[#B8860B] font-bold">
                              ✦ Shastric Reassurance:
                            </div>
                            {mangalDosha.productGuidance.slice(0, 2).map((g, i) => (
                              <div key={i} className="text-[12px] text-[#3D3834] flex items-start gap-1.5">
                                <span className="text-[#B8860B]">•</span>
                                <span>{g}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-[#6B635B]">Calculating Mars balance...</div>
                      )}

                      {/* Matrimonial & Timing Links */}
                      <div className="grid grid-cols-2 gap-2.5 mt-4">
                        <Link
                          href="/dashboard/kundali-milan"
                          className="p-3 text-center rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] text-xs text-[#1A1A1A] font-bold transition-colors block"
                        >
                          🔗 36 Guna Milan
                        </Link>
                        <Link
                          href="/dashboard/marriage-timing"
                          className="p-3 text-center rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] text-xs text-[#1A1A1A] font-bold transition-colors block"
                        >
                          🔗 K.N. Rao Timing Window
                        </Link>
                      </div>

                      <button
                        onClick={() => setActiveTab("ask_ai")}
                        className="btn-gen mt-4 text-xs font-bold py-3"
                      >
                        💍 Ask AI: &quot;When will marriage trigger happen according to my chart?&quot;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 4: TIMING & DASHA TIMELINE                      */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "timing" && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <div className="card-tag">✦ Vimshottari Timeline (120-Year Cycle)</div>
                      <div className="card-title serif mb-0">Your Karmic Progression</div>
                    </div>
                    {activeMD && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                        Active: {activeMD.planet} Mahadasha ({formatDate(activeMD.start)} - {formatDate(activeMD.end)})
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {chart.dashas.map((d, i) => (
                      <div key={i} className={`dasha-item ${d.active ? "active" : ""}`}>
                        <div className={`ddot ${d.active ? "active" : "inactive"}`} />
                        <div className={`dplanet serif ${d.active ? "active" : "inactive"}`}>
                          {d.planet} Mahadasha
                        </div>
                        <div className="dperiod">
                          {formatDate(d.start)} – {formatDate(d.end)}
                        </div>
                        <div style={{ fontSize: 12, color: "#6B635B", width: 50, textAlign: "right", fontWeight: 700 }}>
                          {d.yrs.toFixed(1)}y
                        </div>
                        {d.active && <div className="abadge">Active Now</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-Periods (Antardasha) */}
                <div className="card">
                  <div className="card-tag">✦ Sub-Periods (Antardasha)</div>
                  <div className="card-title serif">
                    {activeMD?.planet} MD Current Sub-Periods
                  </div>
                  <div className="space-y-2">
                    {chart.antardasha.map((d, i) => (
                      <div key={i} className={`dasha-item ${d.active ? "active" : ""}`}>
                        <div className={`ddot ${d.active ? "active" : "inactive"}`} />
                        <div className={`dplanet serif ${d.active ? "active" : "inactive"}`}>
                          {d.planet} Antardasha
                        </div>
                        <div className="dperiod">
                          {formatDate(d.start)} – {formatDate(d.end)}
                        </div>
                        <div style={{ fontSize: 12, color: "#6B635B", width: 50, textAlign: "right", fontWeight: 700 }}>
                          {(d.yrs * 12).toFixed(1)}m
                        </div>
                        {d.active && <div className="abadge">Active Now</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 5: ASTROLOGER TECH SPECS                        */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "specs" && (
              <div className="space-y-6">
                {/* 1. Complete Graha Sthiti Table */}
                <div className="card">
                  <div className="card-tag">✦ Planetary Degrees & Dignities</div>
                  <div className="card-title serif">Navagraha Sthiti Table</div>
                  <div className="overflow-x-auto">
                    <table className="ptable">
                      <thead>
                        <tr>
                          <th>Planet</th>
                          <th>Rashi</th>
                          <th>Degree</th>
                          <th>House</th>
                          <th>Nakshatra</th>
                          <th>Pada</th>
                          <th>Dignity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLS.map((p, i) => {
                          const pl = chart.planets[p];
                          if (!pl) return null;
                          return (
                            <tr key={i}>
                              <td>
                                <span style={{ color: PCOL[i], marginRight: 8, fontSize: 13, fontWeight: 700 }}>
                                  {PEMO[i]}
                                </span>
                                <span style={{ color: "#1A1A1A", fontWeight: 700 }}>{tp(p)}</span>
                                {pl.retrograde && <span className="retro">(R)</span>}
                              </td>
                              <td style={{ color: "#1A1A1A", fontWeight: 600 }}>{ts(pl.sign)}</td>
                              <td style={{ color: "#3D3834", fontSize: 13, fontWeight: 500 }}>
                                {pl.degree}° {pl.minutes}&apos;
                              </td>
                              <td style={{ color: "#3D3834", fontWeight: 600 }}>H{pl.house}</td>
                              <td style={{ color: "#1A1A1A", fontSize: 13, fontWeight: 600 }}>{tn(pl.nakshatra)}</td>
                              <td style={{ color: "#3D3834", fontSize: 13 }}>P{pl.pada}</td>
                              <td>
                                <span className="dpill" style={{ color: dignityColor(pl.dignity) }}>
                                  {pl.dignity || "—"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Shadbala 6-Factor Planetary Strength Matrix */}
                {shadbala && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <div className="card-tag">✦ 6-Factor Planetary Strength</div>
                        <div className="card-title serif mb-0">Shadbala Analysis Matrix</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                        Average Strength: {shadbala.avgStrength}%
                      </span>
                    </div>

                    <p className="text-xs text-[#3D3834] mb-4 leading-relaxed">{shadbala.summary}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {shadbala.planets.map((sp) => (
                        <div
                          key={sp.planet}
                          className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-[#1A1A1A]">{sp.planet}</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded font-mono font-bold"
                              style={{ color: sp.gradeColor, background: "rgba(184,134,11,0.1)" }}
                            >
                              {sp.grade}
                            </span>
                          </div>
                          <div className="text-2xl font-serif text-[#B8860B] font-bold">
                            {sp.percentage}%
                          </div>
                          <div className="text-[12px] text-[#6B635B] mt-1 space-y-0.5 font-medium">
                            <div>Sthana: {sp.sthanaBala}/10 · Dig: {sp.digBala}/10</div>
                            <div>Kala: {sp.kalaBala}/10 · Cheshta: {sp.cheshtaBala}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. 120+ Detected Yogas with Filter */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="card-tag">✦ Classical Shastric Combinations</div>
                      <div className="card-title serif mb-0">Detected Yogas & Doshas ({presentYogas.length})</div>
                    </div>
                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        placeholder="Search yogas..."
                        value={yogaSearch}
                        onChange={(e) => setYogaSearch(e.target.value)}
                        className="h-9 px-3 text-xs bg-[#FAF8F5] border border-[rgba(184,134,11,0.25)] rounded-lg text-[#1A1A1A] outline-none focus:border-[#B8860B]"
                      />
                      {(["all", "benefic", "dosha", "rare"] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setYogaFilter(filter)}
                          className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors font-bold ${
                            yogaFilter === filter
                              ? "bg-[rgba(184,134,11,0.15)] text-[#B8860B] border border-[rgba(184,134,11,0.35)]"
                              : "bg-[#FAF8F5] text-[#6B635B] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredYogas.length === 0 ? (
                    <div className="text-center py-12 text-[#6B635B]">No matching yogas found</div>
                  ) : (
                    <div className="yoga-grid">
                      {filteredYogas.map((y, i) => (
                        <div key={i} className={`yoga-card ${y.isDosha ? "dosha" : ""}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-[12px] uppercase tracking-wider text-[#6B635B] mb-1 font-bold">
                                {CATEGORY_META[y.category]?.icon} {y.category}
                              </div>
                              <div className="font-serif text-base font-bold" style={{ color: y.isDosha ? "#DC2626" : "#1A1A1A" }}>
                                {y.name}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {y.rare && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                                  Rare
                                </span>
                              )}
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                                  y.isDosha
                                    ? "bg-[rgba(220,38,38,0.12)] text-[#DC2626] border border-[rgba(220,38,38,0.25)]"
                                    : "bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)]"
                                }`}
                              >
                                {y.isDosha ? "⚠️ Active" : "✦ Present"}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-[#3D3834] leading-relaxed mb-2">{y.description}</div>
                          {y.impact && (
                            <div className="text-xs text-[#1A1A1A] font-serif italic mb-2">
                              &ldquo;{y.impact}&rdquo;
                            </div>
                          )}
                          {y.remedy && (
                            <div className="p-2.5 rounded-lg bg-[rgba(184,134,11,0.06)] border border-[rgba(184,134,11,0.2)] text-[12px] text-[#1A1A1A] leading-relaxed">
                              ✦ {y.remedy}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. KP Cusps Table */}
                {chart.houseCusps && chart.houseCusps.length > 0 && (
                  <div className="card">
                    <div className="card-tag">✦ Placidus House Cusps (KP Precision)</div>
                    <div className="card-title serif">12 Bhava Mid-Points & Lords</div>
                    <div className="overflow-x-auto">
                      <table className="ptable">
                        <thead>
                          <tr>
                            <th>House</th>
                            <th>Cusp Sign</th>
                            <th>Degree</th>
                            <th>Star Lord</th>
                            <th>Sub Lord</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chart.houseCusps.map((hc) => (
                            <tr key={hc.house}>
                              <td style={{ color: "#B8860B", fontWeight: 700 }}>House {hc.house}</td>
                              <td style={{ color: "#1A1A1A", fontWeight: 600 }}>{hc.sign}</td>
                              <td style={{ color: "#3D3834", fontSize: 13, fontWeight: 500 }}>
                                {hc.degree}° {hc.minutes}&apos;
                              </td>
                              <td style={{ color: "#1A1A1A" }}>{hc.starLord || hc.nakshatraLord || "—"}</td>
                              <td style={{ color: "#B8860B", fontWeight: 700 }}>{hc.subLord || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 6: ASK AI (PROOF-BACKED)                        */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "ask_ai" && (
              <div className="space-y-4">
                <ChartProofChatDrawer chart={chart} mode="inline" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
