"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateChart, type ChartData, NAK } from "@/lib/astro-engine/calculations";
import { detectYogas, calculateYogaScore, CATEGORY_META, type YogaResult, type PlanTier } from "@/lib/astro-engine/yogas";
import { listSavedCharts, saveChartToAccount, selectSavedChart, deleteSavedChart, type SavedChartSummary, useUserChart, buildChart, type BirthDetails, saveCurrentChart, useChartEngine } from "@/lib/user-chart";
import NorthIndianChart from "@/components/north-indian-chart";
import { useLanguage } from "@/lib/language-context";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";
import { EngineStateCard } from "@/components/engine-state-card";
import { createClient } from "@/lib/supabase/client";
import { calculateDivisional, getDashamshaAnalysis, getNavamshaAnalysis, type DivChart } from "@/lib/astro-engine/divisional";
import { isFullAccessEnabled, isEliteEmail, normalizeTier } from "@/lib/access";
import { DailyPanchangWidget } from "@/components/panchang/DailyPanchangWidget";
import { ChartProofChatDrawer } from "@/components/chat/ChartProofChatDrawer";
import { calculateShadbala, type ShadbalaResult } from "@/lib/astro-engine/shadbala";
import { buildMangalDoshaInsight, type MangalDoshaInsight } from "@/lib/astro-engine/mangal-dosha-adapter";
import EditChartModal from "@/components/charts/EditChartModal";
import DeleteChartModal from "@/components/charts/DeleteChartModal";
import MasterKundliDossierPanel from "@/components/charts/MasterKundliDossierPanel";
import SimpleKundliReportCard from "@/components/charts/SimpleKundliReportCard";
import PillarNarrativeCard from "@/components/charts/PillarNarrativeCard";
import { ClinicalPredictiveDossier } from "@/components/clinical/ClinicalPredictiveDossier";
import {
  generateCareerPillarNarrative,
  generateMarriagePillarNarrative,
  generateTimingPillarNarrative,
  generateSpecsPillarNarrative,
} from "@/lib/astro-engine/pillar-narrative-engine";
import { Edit2, Trash2, X, Sparkles } from "lucide-react";
import { evaluateVargaNeuroKarmicProfile } from "@/lib/astro-intelligence/varga-neuro-remedies-engine";
import { VargaNeuroKarmicCards } from "@/components/charts/VargaNeuroKarmicCards";
import { LiveDashaTickerStrip } from "@/components/dasha/LiveDashaTickerStrip";
import { VimshottariFiveLevelExplorer } from "@/components/dasha/VimshottariFiveLevelExplorer";
import { DashaProgressCapsule } from "@/components/dasha/DashaProgressCapsule";
import { LiveMuhurtaAlert } from "@/components/panchang/LiveMuhurtaAlert";
import { runKPEngine } from "@/lib/astro-engine/kp";

const PLS  = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PEMO = ["Su","Mo","Ma","Me","Ju","Ve","Sa","Ra","Ke"];
const PCOL = ["#d97706","#b8860b","#dc2626","#15803d","#d97706","#db2777","#2563eb","#854d0e","#e11d48"];

const VARGA_CHART_META: Record<string, { icon: string; domain: string }> = {
  D1:  { icon: "🔯", domain: "Physical Life" },
  D2:  { icon: "💰", domain: "Wealth & Finance" },
  D3:  { icon: "⚡", domain: "Courage & Siblings" },
  D4:  { icon: "🏠", domain: "Property & Home" },
  D5:  { icon: "🙏", domain: "Past Life Merit" },
  D6:  { icon: "🛡️", domain: "Health & Immunity" },
  D7:  { icon: "👶", domain: "Children & Legacy" },
  D8:  { icon: "🔮", domain: "Transformation" },
  D9:  { icon: "💍", domain: "Marriage & Soul" },
  D10: { icon: "💼", domain: "Career & Status" },
  D11: { icon: "🎯", domain: "Gains & Income" },
  D12: { icon: "👨‍👩‍👧", domain: "Ancestry & Parents" },
  D16: { icon: "🚗", domain: "Vehicles & Comfort" },
  D20: { icon: "🕉️", domain: "Spiritual Path" },
  D24: { icon: "📚", domain: "Higher Learning" },
  D27: { icon: "🌟", domain: "Soul Strength" },
  D30: { icon: "⚠️", domain: "Obstacles & Karma" },
  D40: { icon: "☯️", domain: "Maternal Grace" },
  D45: { icon: "🎭", domain: "Character & Values" },
  D60: { icon: "🌀", domain: "Root Past Karma" },
};

export function formatDMS(lon: number): string {
  const norm = ((lon % 30) + 30) % 30;
  const deg = Math.floor(norm);
  const minFloat = (norm - deg) * 60;
  let min = Math.floor(minFloat);
  let sec = Math.round((minFloat - min) * 60);
  if (sec >= 60) {
    sec = 0;
    min += 1;
  }
  return `${deg}° ${String(min).padStart(2, "0")}' ${String(sec).padStart(2, "0")}"`;
}

export function checkCombustion(planet: string, pLon: number, sunLon: number, isRetro: boolean): boolean {
  if (planet === "Sun" || planet === "Rahu" || planet === "Ketu") return false;
  const diff = Math.abs(pLon - sunLon) % 360;
  const dist = diff > 180 ? 360 - diff : diff;
  const limits: Record<string, number> = {
    Moon: 12,
    Mars: 17,
    Mercury: isRetro ? 12 : 14,
    Jupiter: 11,
    Venus: isRetro ? 8 : 10,
    Saturn: 15,
  };
  return dist <= (limits[planet] || 10);
}

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
  const { userTier: contextTier, setChartData } = useChartEngine();
  const userTier = (contextTier ?? "free") as PlanTier;
  const { chart: primaryChart, loading: chartLoading, hasUserChart } = useUserChart();
  const [chart, setChart] = useState<ChartData | null>(() => (hasUserChart && primaryChart) ? primaryChart : null);
  const [loading, setLoading] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<SavedChartSummary[]>([]);
  const [saveStatus, setSaveStatus] = useState("New generated charts become your primary chart.");
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(() => !(hasUserChart && primaryChart));
  const [showLibrary, setShowLibrary] = useState(false);
  const [isNewChartModalOpen, setIsNewChartModalOpen] = useState(false);
  const [editingSavedChart, setEditingSavedChart] = useState<SavedChartSummary | null>(null);
  const [deletingSavedChart, setDeletingSavedChart] = useState<SavedChartSummary | null>(null);
  const [isDeletingSavedChart, setIsDeletingSavedChart] = useState(false);
  const [yogaSearch, setYogaSearch] = useState("");
  const [yogaFilter, setYogaFilter] = useState<"all" | "benefic" | "dosha" | "rare">("all");

  // Check URL query parameters for ?action=new or ?action=saved
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new" || params.get("new") === "1") {
        setIsNewChartModalOpen(true);
      } else if (params.get("action") === "saved") {
        setShowLibrary(true);
      }
    }
  }, []);

  const handleOpenNewModal = () => {
    setForm({
      name: "",
      dob: "",
      tob: "",
      city: "",
      lat: null,
      lon: null,
      tz: null,
    });
    setSelectedCity(null);
    setIsNewChartModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (chart) {
      setForm({
        name: chart.name,
        dob: chart.dob,
        tob: chart.tob,
        city: chart.city,
        lat: chart.lat,
        lon: chart.lon,
        tz: chart.tz,
      });
      setSelectedCity({
        display_name: chart.city,
        latitude: chart.lat,
        longitude: chart.lon,
        timezone: String(chart.tz),
        name: chart.city,
        state: "",
        country: "",
      });
    }
    setIsNewChartModalOpen(true);
  };

  const yogas = useMemo(() => {
    if (!chart?.planets) return [];
    return detectYogas(chart.planets as never, chart.lagnaNum, userTier);
  }, [chart, userTier]);

  const yogaScore = useMemo(() => {
    const present = yogas.filter((y) => y.present && !y.isDosha);
    return calculateYogaScore(present);
  }, [yogas]);

  const divCharts = useMemo(() => {
    if (!chart?.planets) return [];
    return calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  }, [chart]);

  const shadbala = useMemo(() => {
    if (!chart?.planets) return null;
    try {
      const birthHour = parseInt(chart.tob.split(":")[0], 10) || 12;
      return calculateShadbala(chart.planets as never, birthHour);
    } catch (err) {
      console.warn("Shadbala calculation error:", err);
      return null;
    }
  }, [chart]);

  const mangalDosha = useMemo(() => {
    if (!chart?.planets) return null;
    try {
      return buildMangalDoshaInsight(chart);
    } catch (err) {
      console.warn("Mangal dosha calculation error:", err);
      return null;
    }
  }, [chart]);

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

  const applyChart = (data: ChartData) => {
    setChart(data);
    setActiveTab("overview");
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
    if (!chart || primaryChart.name !== chart.name || primaryChart.dob !== chart.dob || primaryChart.tob !== chart.tob) {
      applyChart(primaryChart);
      setSaveStatus(`${primaryChart.name}'s chart loaded.`);
      setShowForm(false);
    }
  }, [primaryChart, chartLoading, hasUserChart]);

  const handleSelectSavedChart = async (chartId: string) => {
    setLibraryLoading(true);
    try {
      const nextChart = await selectSavedChart(chartId);
      if (nextChart) {
        setChartData(nextChart);
        saveCurrentChart(nextChart);
        applyChart(nextChart);
        setSaveStatus(`${nextChart.name}'s chart loaded.`);
        setSavedCharts(await listSavedCharts());
        setShowLibrary(false);
      } else {
        setSaveStatus("Could not open selected chart.");
      }
    } catch (err) {
      setSaveStatus("Chart selection failed.");
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleConfirmDeleteSaved = async () => {
    if (!deletingSavedChart) return;
    setIsDeletingSavedChart(true);
    try {
      const res = await deleteSavedChart(deletingSavedChart.id);
      if (!res.ok) throw new Error(res.error || "Failed to delete chart");
      setSaveStatus(`"${deletingSavedChart.name}"'s chart has been deleted.`);
      await refreshSavedCharts();
      setDeletingSavedChart(null);
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Failed to delete chart.");
    } finally {
      setIsDeletingSavedChart(false);
    }
  };

  const handleSavedChartEdited = async (updatedChart: ChartData) => {
    setSaveStatus(`Chart for "${updatedChart.name}" has been updated.`);
    await refreshSavedCharts();
    if (
      chart &&
      (chart.name.toLowerCase() === updatedChart.name.toLowerCase() ||
        chart.name.toLowerCase() === editingSavedChart?.name.toLowerCase())
    ) {
      applyChart(updatedChart);
      setChartData(updatedChart);
      saveCurrentChart(updatedChart);
    }
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
      setChartData(data);
      saveCurrentChart(data);
      applyChart(data);
      setSaveStatus("Chart generated. Use Save Chart to store it in your account library.");
      setShowForm(false);
      setIsNewChartModalOpen(false);
      setShowLibrary(false);
      void saveChartToAccount(data, { replacePrimary: true });
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

  const d9Analysis = useMemo(() => {
    if (!d9) return [];
    return getNavamshaAnalysis(d9);
  }, [d9]);

  // 4-Chart Quad View State & Engines (Lagna D1, Navamsha D9, Nirayana Bhava Chalit, KP Cuspal)
  const [isQuadView, setIsQuadView] = useState(false);

  const kpResult = useMemo(() => {
    if (!chart?.planets) return null;
    try {
      return runKPEngine(chart as never);
    } catch (err) {
      console.warn("KP calculation error:", err);
      return null;
    }
  }, [chart]);

  const chalitPlanets = useMemo(() => {
    if (!chart?.planets) return {};
    if (!kpResult?.rows) return chart.planets;
    const copy: Record<string, any> = { ...chart.planets };
    kpResult.rows.forEach((row) => {
      if (copy[row.name]) {
        copy[row.name] = {
          ...copy[row.name],
          house: row.bhavaHouse,
          retrograde: row.retrograde,
        };
      }
    });
    return copy;
  }, [chart, kpResult]);

  const kpPlanets = useMemo(() => {
    if (!chart?.planets) return {};
    if (!kpResult?.rows) return chart.planets;
    const copy: Record<string, any> = { ...chart.planets };
    kpResult.rows.forEach((row) => {
      if (copy[row.name]) {
        copy[row.name] = {
          ...copy[row.name],
          house: row.bhavaHouse,
          retrograde: row.retrograde,
          subLord: row.subLord,
        };
      }
    });
    return copy;
  }, [chart, kpResult]);

  const chalitShifts = useMemo(() => {
    if (!kpResult?.rows) return [];
    return kpResult.rows.filter((r) => r.bhavaShift !== 0);
  }, [kpResult]);

  const d9Meta = useMemo(() => {
    if (!d9) return null;
    const SIGNS_LIST = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const RASHI_LORDS_LIST = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
    const lagnaLord = RASHI_LORDS_LIST[d9.lagnaNum] || "Venus";
    const seventhSignNum = ((d9.lagnaNum + 6) % 12 + 12) % 12;
    const seventhSign = SIGNS_LIST[seventhSignNum];
    const seventhLord = RASHI_LORDS_LIST[seventhSignNum] || "Mars";
    const seventhPlanets = d9.planets.filter((p) => p.house === 7);
    const lagnaPlanets = d9.planets.filter((p) => p.house === 1);
    const venus = d9.planets.find((p) => p.planet === "Venus");
    const jupiter = d9.planets.find((p) => p.planet === "Jupiter");
    const exaltedPlanets = d9.planets.filter((p) => p.dignity === "Exalted");
    const ownPlanets = d9.planets.filter((p) => p.dignity === "Own");
    const seventhLordPlanet = d9.planets.find((p) => p.planet === seventhLord);

    return {
      lagnaLord,
      seventhSign,
      seventhLord,
      seventhLordHouse: seventhLordPlanet?.house,
      seventhLordSign: seventhLordPlanet?.sign,
      seventhPlanets,
      lagnaPlanets,
      venus,
      jupiter,
      exaltedPlanets,
      ownPlanets,
    };
  }, [d9]);

  const d10Planets = useMemo(() => {
    if (!d10) return {};
    const res: Record<string, { house: number; retrograde: boolean; signNum: number }> = {};
    d10.planets.forEach((p) => {
      res[p.planet] = { house: p.house, retrograde: p.retrograde, signNum: p.signNum };
    });
    return res;
  }, [d10]);

  const d10Analysis = useMemo(() => {
    if (!d10) return [];
    return getDashamshaAnalysis(d10);
  }, [d10]);

  const d10Meta = useMemo(() => {
    if (!d10) return null;
    const SIGNS_LIST = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const RASHI_LORDS_LIST = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
    const lagnaLord = RASHI_LORDS_LIST[d10.lagnaNum] || "Mercury";
    const tenthSignNum = ((d10.lagnaNum + 9) % 12 + 12) % 12;
    const tenthSign = SIGNS_LIST[tenthSignNum];
    const tenthLord = RASHI_LORDS_LIST[tenthSignNum] || "Saturn";
    const tenthPlanets = d10.planets.filter((p) => p.house === 10);
    const lagnaPlanets = d10.planets.filter((p) => p.house === 1);
    const secondPlanets = d10.planets.filter((p) => p.house === 2);
    const eleventhPlanets = d10.planets.filter((p) => p.house === 11);
    const exaltedPlanets = d10.planets.filter((p) => p.dignity === "Exalted");
    const ownPlanets = d10.planets.filter((p) => p.dignity === "Own");
    const tenthLordPlanet = d10.planets.find((p) => p.planet === tenthLord);

    return {
      lagnaLord,
      tenthSign,
      tenthLord,
      tenthLordHouse: tenthLordPlanet?.house,
      tenthLordSign: tenthLordPlanet?.sign,
      tenthPlanets,
      lagnaPlanets,
      secondPlanets,
      eleventhPlanets,
      exaltedPlanets,
      ownPlanets,
    };
  }, [d10]);

  const [selectedVarga, setSelectedVarga] = useState<string>("D9");

  const currentDiv = useMemo(() => {
    if (!divCharts.length) return null;
    return divCharts.find((d) => d.key === selectedVarga) || divCharts[0];
  }, [divCharts, selectedVarga]);

  const currentDivPlanets = useMemo(() => {
    if (!currentDiv) return {};
    const res: Record<string, { house: number; retrograde: boolean; signNum: number }> = {};
    currentDiv.planets.forEach((p) => {
      res[p.planet] = { house: p.house, retrograde: p.retrograde, signNum: p.signNum };
    });
    return res;
  }, [currentDiv]);

  const activeVargaNeuro = useMemo(() => {
    if (!chart || !currentDiv || !divCharts.length) return null;
    return evaluateVargaNeuroKarmicProfile(chart, currentDiv, divCharts);
  }, [chart, currentDiv, divCharts]);

  const d10Neuro = useMemo(() => {
    if (!chart || !d10 || !divCharts.length) return null;
    return evaluateVargaNeuroKarmicProfile(chart, d10, divCharts);
  }, [chart, d10, divCharts]);

  const d9Neuro = useMemo(() => {
    if (!chart || !d9 || !divCharts.length) return null;
    return evaluateVargaNeuroKarmicProfile(chart, d9, divCharts);
  }, [chart, d9, divCharts]);

  const activeMD = chart?.dashas.find((d) => d.active);
  const activeAD = chart?.antardasha.find((d) => d.active);

  const charaKarakas = useMemo(() => {
    if (!chart?.planets) return {} as Record<string, string>;
    const karakaNames = [
      "Atmakaraka (AK)",
      "Amatyakaraka (AmK)",
      "Bhratrikaraka (BK)",
      "Matrikaraka (MK)",
      "Pitrikaraka (PiK)",
      "Jnatikaraka (GK)",
      "Darakaraka (DK)",
    ];
    // 7 classical planets (Sun to Saturn)
    const seven = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
      .map((name) => {
        const pd = chart.planets[name];
        const lonWithinSign = pd ? ((pd.lon % 30) + 30) % 30 : 0;
        return { name, lonWithinSign };
      })
      .sort((a, b) => b.lonWithinSign - a.lonWithinSign);

    const map: Record<string, string> = {};
    seven.forEach((p, idx) => {
      map[p.name] = karakaNames[idx] || "—";
    });
    map["Rahu"] = "Chaya Graha (North Node)";
    map["Ketu"] = "Moksha Karaka (South Node)";
    return map;
  }, [chart]);

  const lagnaInfo = useMemo(() => {
    if (!chart) return null;
    const norm = ((chart.lagnaLon % 360) + 360) % 360;
    const nakIdx = Math.floor(norm / (360 / 27));
    const pada = Math.floor((norm % (360 / 27)) / (360 / 108)) + 1;
    return {
      nakshatra: NAK[nakIdx] || "—",
      pada,
      dms: formatDMS(chart.lagnaLon),
    };
  }, [chart]);

  const careerNarrative = useMemo(() => {
    if (!chart) return null;
    return generateCareerPillarNarrative(chart, d10, shadbala, charaKarakas);
  }, [chart, d10, shadbala, charaKarakas]);

  const marriageNarrative = useMemo(() => {
    if (!chart) return null;
    return generateMarriagePillarNarrative(chart, d9, mangalDosha, charaKarakas);
  }, [chart, d9, mangalDosha, charaKarakas]);

  const timingNarrative = useMemo(() => {
    if (!chart) return null;
    return generateTimingPillarNarrative(chart, charaKarakas);
  }, [chart, charaKarakas]);

  const specsNarrative = useMemo(() => {
    if (!chart) return null;
    return generateSpecsPillarNarrative(chart, yogas, shadbala);
  }, [chart, yogas, shadbala]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:var(--app-bg, #FAF8F5);color:var(--app-fg, #1A1A1A);font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        body{background:var(--app-bg, #FAF8F5);color:var(--app-fg, #1A1A1A);font-family:var(--font-outfit),'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:var(--font-cormorant),'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--app-bg, #FAF8F5)}::-webkit-scrollbar-thumb{background:var(--app-gold, #B8860B);border-radius:2px}
        .page{max-width:1200px;margin:0 auto;padding:20px 24px 60px}
        .page-tag{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--app-gold, #B8860B);margin-bottom:6px;font-weight:700}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:var(--app-fg, #1A1A1A);line-height:1.15;margin-bottom:4px}
        .page-title em{font-style:italic;color:var(--app-gold, #B8860B)}
        .page-sub{font-size:14px;color:var(--app-muted, #6B635B);margin-top:2px;margin-bottom:16px;line-height:1.5}
        .form-card{background:var(--app-card, #FFFFFF);border:1px solid var(--app-border, rgba(184, 134, 11, 0.2));border-radius:18px;padding:20px 24px;margin-bottom:16px;box-shadow:0 8px 30px rgba(184, 134, 11, 0.06)}
        .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        .form-group{display:flex;flex-direction:column;gap:6px}
        .label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-muted, #6B635B);font-weight:700}
        .input{height:44px;padding:0 14px;background:#FAF8F5;border:1px solid var(--app-border, rgba(184, 134, 11, 0.25));border-radius:12px;outline:none;font-size:14px;color:var(--app-fg, #1A1A1A);font-family:'Outfit',sans-serif;transition:border-color 0.2s, box-shadow 0.2s;width:100%}
        .input:focus{border-color:var(--app-gold, #B8860B);box-shadow:0 0 0 3px rgba(184, 134, 11, 0.12)}
        .input::placeholder{color:#8C8278}
        .city-note{margin-top:6px;font-size:12.5px;color:var(--app-muted, #6B635B);line-height:1.5}
        .btn-gen{width:100%;margin-top:16px;padding:14px;background:linear-gradient(135deg,#B8860B,#D4AF37);border:none;border-radius:12px;font-size:15px;font-weight:700;color:#FFFFFF;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(184, 134, 11, 0.25)}
        .btn-gen:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(184, 134, 11, 0.35)}
        .btn-gen:disabled{opacity:0.5;cursor:not-allowed}
        .result-header{background:linear-gradient(135deg,var(--app-card, #FFFFFF),var(--app-card-alt, #F7F4EC));border:1px solid var(--app-border, rgba(184, 134, 11, 0.25));border-radius:18px;padding:16px 20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;box-shadow:0 8px 30px rgba(184, 134, 11, 0.06)}
        .result-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--app-fg, #1A1A1A)}
        .result-name em{font-style:italic;color:var(--app-gold, #B8860B)}
        .result-meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:6px}
        .meta-item{font-size:13px;color:var(--app-muted, #6B635B)}
        .meta-item span{color:var(--app-fg, #1A1A1A);font-weight:600}
        .asc-badge{background:#FAF8F5;border:1px solid rgba(184, 134, 11, 0.25);border-radius:12px;padding:10px 16px;text-align:center;min-width:96px}
        .asc-label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-muted, #6B635B);margin-bottom:2px;font-weight:700}
        .asc-val{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--app-gold, #B8860B)}
        .asc-deg{font-size:12px;color:var(--app-muted, #6B635B);margin-top:2px}
        .acc-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(34,139,34,0.08);border:1px solid rgba(34,139,34,0.25);border-radius:100px;padding:4px 12px;font-size:12.5px;color:#1E7E34;margin-bottom:12px;font-weight:600}
        .tabs{display:flex;gap:6px;margin-bottom:16px;background:#F4F0E8;border:1px solid rgba(184, 134, 11, 0.2);border-radius:14px;padding:5px;width:100%;overflow-x:auto;flex-wrap:nowrap;-webkit-overflow-scrolling:touch}
        .tab{padding:8px 16px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.2s;color:var(--app-muted, #6B635B);border:none;background:none;font-family:'Outfit',sans-serif;white-space:nowrap;display:flex;align-items:center;gap:6px;flex-shrink:0}
        .tab:hover{color:var(--app-fg, #1A1A1A);background:rgba(184, 134, 11, 0.08)}
        .tab.active{background:#FFFFFF;color:var(--app-gold, #B8860B);border:1px solid rgba(184, 134, 11, 0.35);box-shadow:0 4px 14px rgba(184, 134, 11, 0.12);font-weight:700}
        .tab-badge{font-size:11px;padding:2px 8px;border-radius:999px;background:rgba(184, 134, 11, 0.12);color:var(--app-gold, #B8860B);font-weight:700}
        .chart-layout{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:960px){.chart-layout{grid-template-columns:1fr}}
        .card{background:var(--app-card, #FFFFFF);border:1px solid var(--app-border, rgba(184, 134, 11, 0.18));border-radius:16px;padding:18px 20px;box-shadow:0 6px 24px rgba(184, 134, 11, 0.05)}
        .card-tag{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--app-gold, #B8860B);margin-bottom:4px;font-weight:700}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--app-fg, #1A1A1A);margin-bottom:12px}
        .ptable{width:100%;border-collapse:collapse}
        .ptable th{font-size:11.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-gold, #B8860B);padding:8px 10px;text-align:left;font-weight:700;border-bottom:1.5px solid rgba(184, 134, 11, 0.25)}
        .ptable td{padding:8px 10px;border-bottom:1px solid rgba(184, 134, 11, 0.12);font-size:13px;vertical-align:middle;color:var(--app-fg, #1A1A1A)}
        .ptable tr:last-child td{border-bottom:none}
        .retro{font-size:11px;color:#D97706;border:1px solid rgba(217,119,6,0.3);border-radius:4px;padding:1px 5px;margin-left:4px;font-weight:700}
        .dpill{font-size:12px;padding:3px 10px;border-radius:6px;background:#FAF8F5;font-weight:700;border:1px solid rgba(184, 134, 11, 0.18)}
        .dasha-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:12px;border:1px solid rgba(184, 134, 11, 0.15);background:#FAF8F5;margin-bottom:8px;transition:all 0.2s}
        .dasha-item.active{border-color:rgba(184, 134, 11, 0.45);background:rgba(184, 134, 11, 0.08);box-shadow:0 4px 12px rgba(184, 134, 11, 0.08)}
        .dasha-item:last-child{margin-bottom:0}
        .ddot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .ddot.active{background:var(--app-gold, #B8860B);box-shadow:0 0 8px rgba(184, 134, 11, 0.5)}
        .ddot.inactive{background:#D1C7BD}
        .dplanet{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;flex:1}
        .dplanet.active{color:var(--app-gold, #B8860B)}.dplanet.inactive{color:var(--app-fg, #1A1A1A)}
        .dperiod{font-size:13px;color:var(--app-soft, #3D3834);font-weight:500}
        .abadge{font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(184, 134, 11, 0.15);color:var(--app-gold, #B8860B);border:1px solid rgba(184, 134, 11, 0.35);font-weight:700}
        .btn-save{display:flex;align-items:center;gap:8px;padding:8px 14px;background:#FAF8F5;border:1px solid rgba(184, 134, 11, 0.3);border-radius:10px;color:var(--app-gold, #B8860B);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-save:hover{background:#FFFFFF;border-color:rgba(184, 134, 11, 0.5);transform:translateY(-1px)}
        .library{background:var(--app-card, #FFFFFF);border:1px solid var(--app-border, rgba(184, 134, 11, 0.2));border-radius:16px;padding:16px 18px;margin-bottom:16px}
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

        {/* TOP ACTION BAR: POPUP MODAL TRIGGER & SAVED CHARTS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "16px",
            padding: "10px 14px",
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.2)",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(184, 134, 11, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-gen"
              onClick={handleOpenNewModal}
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "8px",
              }}
            >
              <Sparkles size={14} /> ✦ Create / New Kundli
            </button>

            {chart && (
              <button
                type="button"
                className="btn-save"
                onClick={handleOpenEditModal}
                style={{
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Edit2 size={13} /> Edit Birth Details
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-save"
              onClick={() => setShowLibrary((prev) => !prev)}
              style={{
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 600,
                background: showLibrary ? "rgba(184, 134, 11, 0.12)" : "transparent",
                borderColor: showLibrary ? "rgba(184, 134, 11, 0.45)" : "rgba(184, 134, 11, 0.25)",
              }}
            >
              📁 {showLibrary ? "▲ Hide Saved Charts" : `▼ Saved Charts (${savedCharts.length})`}
            </button>
            <button
              type="button"
              className="btn-save"
              onClick={refreshSavedCharts}
              disabled={libraryLoading}
              title="Refresh charts from database"
              style={{ padding: "8px 10px", fontSize: "12px" }}
            >
              {libraryLoading ? "⟳" : "↻"}
            </button>
            {chart && (
              <button
                type="button"
                className="btn-save"
                onClick={handleSaveCurrentChart}
                disabled={libraryLoading}
                style={{ padding: "8px 12px", fontSize: "12px", fontWeight: 600 }}
              >
                💾 Save Chart
              </button>
            )}
          </div>
        </div>

        {/* COLLAPSIBLE SAVED CHARTS DRAWER */}
        {showLibrary && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div className="card-tag">✦ Saved Charts & Database</div>
                <div className="card-title serif" style={{ marginBottom: 0 }}>Chart Library ({savedCharts.length})</div>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B635B",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>
            {saveStatus && <div className="library-sub" style={{ marginBottom: 10 }}>{saveStatus}</div>}
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>
                📁 My Saved Charts ({savedCharts.length})
              </div>
              {savedCharts.length > 0 ? (
                <div className="library-list">
                  {savedCharts.map((saved) => {
                    const isActive =
                      chart &&
                      chart.name.toLowerCase() === saved.name.toLowerCase() &&
                      chart.dob === saved.dob;

                    return (
                      <div
                        key={saved.id}
                        className={`library-card ${saved.isPrimary ? "primary" : ""}`}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          border: isActive ? "2px solid rgba(184, 134, 11, 0.6)" : undefined,
                          background: isActive ? "rgba(184, 134, 11, 0.06)" : undefined,
                        }}
                      >
                        <div
                          onClick={() => handleSelectSavedChart(saved.id)}
                          style={{ cursor: "pointer", marginBottom: 12 }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}
                          >
                            <div className="library-name" style={{ margin: 0 }}>
                              {saved.name}
                            </div>
                            {isActive && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#B8860B",
                                  background: "rgba(184, 134, 11, 0.15)",
                                  padding: "2px 7px",
                                  borderRadius: 12,
                                  border: "1px solid rgba(184, 134, 11, 0.3)",
                                }}
                              >
                                ✦ Active
                              </span>
                            )}
                          </div>
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
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            borderTop: "1px solid rgba(184, 134, 11, 0.15)",
                            paddingTop: 10,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectSavedChart(saved.id)}
                            disabled={libraryLoading}
                            style={{
                              flex: 1,
                              background: isActive ? "#B8860B" : "#c8a030",
                              color: "#FFFFFF",
                              border: 0,
                              borderRadius: 6,
                              padding: "6px 10px",
                              fontWeight: 700,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            {isActive ? "Viewing" : "Open"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSavedChart(saved);
                            }}
                            title="Edit Chart"
                            style={{
                              background: "#FFFFFF",
                              border: "1px solid rgba(184, 134, 11, 0.25)",
                              borderRadius: 6,
                              padding: "6px 10px",
                              fontSize: "12px",
                              color: "#4A4238",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Edit2 size={13} color="#B8860B" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingSavedChart(saved);
                            }}
                            title="Delete Chart"
                            style={{
                              background: "rgba(220, 38, 38, 0.05)",
                              border: "1px solid rgba(220, 38, 38, 0.2)",
                              borderRadius: 6,
                              padding: "6px 10px",
                              fontSize: "12px",
                              color: "#DC2626",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="library-sub">
                  No saved charts found yet. Generate a chart to save it to your account!
                </div>
              )}
          </div>
        )}

        {/* WELCOME / EMPTY STATE WHEN NO CHART IS SELECTED */}
        {!chart && !loading && (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              borderRadius: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔯</div>
            <h2
              className="serif"
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1A1A1A",
                marginBottom: "8px",
              }}
            >
              No Kundli Currently Loaded
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6B635B",
                maxWidth: "500px",
                margin: "0 auto 24px auto",
                lineHeight: 1.6,
              }}
            >
              Enter birth details to generate full Vedic birth chart with 120 Yogas, 16 Divisional charts, and 5-tier Vimshottari Dasha timeline.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-gen"
                onClick={handleOpenNewModal}
                style={{
                  padding: "12px 28px",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={16} /> ✦ Create My Kundli (Popup)
              </button>
              {savedCharts.length > 0 && (
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => setShowLibrary(true)}
                  style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 600 }}
                >
                  📁 Open Saved Chart ({savedCharts.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* CREATE / EDIT KUNDLI MODAL (POPUP IN FRONT OF WINDOW) */}
        {isNewChartModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(10, 8, 5, 0.7)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              overflowY: "auto",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsNewChartModalOpen(false);
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                border: "1px solid rgba(184, 134, 11, 0.35)",
                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
                width: "100%",
                maxWidth: "640px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  borderBottom: "1px solid rgba(184, 134, 11, 0.15)",
                  paddingBottom: "14px",
                }}
              >
                <div>
                  <div className="card-tag">✦ Astronomical Vedic Engine</div>
                  <h2
                    className="serif"
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {form.name ? `Kundli for ${form.name}` : "Create My Kundli"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewChartModalOpen(false)}
                  style={{
                    background: "rgba(184, 134, 11, 0.08)",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                    borderRadius: "50%",
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#6B635B",
                  }}
                  title="Close popup"
                >
                  <X size={18} />
                </button>
              </div>

              {/* MODAL FORM INPUTS */}
              <div className="space-y-4">
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                </div>

                <div className="form-group">
                  <CityAutocomplete
                    label="Birth City"
                    value={selectedCity}
                    placeholder="Search 68k+ cities worldwide, e.g. New Delhi, Mumbai, New York"
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
                    Automatic GPS coordinates & solar timezone offset applied via NASA ephemeris.
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER ACTION */}
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  borderTop: "1px solid rgba(184, 134, 11, 0.15)",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => setIsNewChartModalOpen(false)}
                  style={{ padding: "10px 18px", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-gen"
                  onClick={handleGenerate}
                  disabled={!form.name || !form.dob || !form.tob || !form.city || !selectedCity || loading}
                  style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 700 }}
                >
                  {loading ? "⟳ Calculating..." : "🔯 Calculate Kundli & Yogas"}
                </button>
              </div>
            </div>
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

            {/* REAL-TIME LIVE MUHURTA / RAHU KAAL ALERT */}
            <LiveMuhurtaAlert className="mb-4" />

            {/* LIVE DAILY PANCHANG EMBEDDED WIDGET */}
            <DailyPanchangWidget compact className="mb-4" />

            {/* LIVE SLOW-SCROLLING DASHA & ANTARDASHA TICKER STRIP */}
            <LiveDashaTickerStrip
              chart={chart}
              onOpenExplorer={() => setActiveTab("timing")}
              className="mb-4"
            />

            {/* ── 4 INTENT-DRIVEN PILLARS + ASK AI TABS ── */}
            <div
              className="tabs"
              style={{
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {[
                { id: "overview", label: "🧭 Overview & Life Pulse", badge: null },
                { id: "master_dossier", label: "📜 संपूर्ण महा-विश्लेषण", badge: "विस्तृत फलित" },
                { id: "divisional", label: "🧩 16 Varga Charts (षोडशवर्ग)", badge: "D1-D60" },
                { id: "clinical", label: "🧬 Clinical Intelligence (नाड़ी सूत्र)", badge: "5 Engines" },
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
                <div className={`chart-layout ${isQuadView ? "quad-active" : ""}`} style={isQuadView ? { gridTemplateColumns: "1fr" } : undefined}>
                  {/* Kundli Diagram Card */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <div className="card-tag">
                          {isQuadView ? "✦ 4-Chart Comparative Quad Engine" : "✦ Primary Birth Chart (D-1)"}
                        </div>
                        <div className="card-title serif mb-0">
                          {isQuadView ? "4-Chart Quad View (2 ऊपर / 2 नीचे)" : "Janma Lagna Kundli"}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => setIsQuadView((v) => !v)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 700,
                            background: isQuadView ? "rgba(184, 134, 11, 0.16)" : "#FAF8F5",
                            border: isQuadView ? "1.5px solid #B8860B" : "1px solid rgba(184, 134, 11, 0.3)",
                            color: isQuadView ? "#B8860B" : "#1A1A1A",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>⊞</span>
                          <span>{isQuadView ? "✓ 4-Chart Quad Active" : "⊞ Compare 4 Charts (Lagna, D9, Chalit, KP)"}</span>
                        </button>

                        <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                          {chart.lagnaRashi} Rising
                        </span>
                      </div>
                    </div>

                    {!isQuadView ? (
                      /* SINGLE LAGNA CHART (Default) */
                      <div
                        role="region"
                        aria-label={`Natal chart for ${chart?.name || 'chart'}`}
                        tabIndex={-1}
                      >
                        <NorthIndianChart lagnaNum={chart.lagnaNum} planets={chart.planets} />
                      </div>
                    ) : (
                      /* 4-CHART QUAD VIEW: 2 UP (Lagna + D9), 2 DOWN (Bhava Chalit + KP) */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {/* 1. Top-Left: Lagna (D1 Rashi) */}
                        <div style={{ padding: "12px", background: "#FAF8F5", borderRadius: "14px", border: "1px solid rgba(184,134,11,0.25)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: 700, color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>चार्ट 1 · राशि कुंडली</div>
                              <div className="serif" style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>D-1 Janma Lagna Kundli</div>
                            </div>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "rgba(184,134,11,0.12)", color: "#B8860B" }}>
                              {chart.lagnaRashi}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <NorthIndianChart lagnaNum={chart.lagnaNum} planets={chart.planets} size={250} />
                          </div>
                        </div>

                        {/* 2. Top-Right: Navamsha (D9 Dharma & Soul) */}
                        <div style={{ padding: "12px", background: "#FAF8F5", borderRadius: "14px", border: "1px solid rgba(184,134,11,0.25)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: 700, color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>चार्ट 2 · भाग्य व आत्मा</div>
                              <div className="serif" style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>D-9 Navamsha Kundli</div>
                            </div>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "rgba(184,134,11,0.12)", color: "#B8860B" }}>
                              {d9?.rashi || "D-9"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            {d9 ? (
                              <NorthIndianChart lagnaNum={d9.lagnaNum} planets={d9Planets} size={250} />
                            ) : (
                              <div style={{ padding: "40px", fontSize: "12px", color: "#6B635B" }}>Calculating D9...</div>
                            )}
                          </div>
                        </div>

                        {/* 3. Bottom-Left: Nirayana Bhava Chalit */}
                        <div style={{ padding: "12px", background: "#FAF8F5", borderRadius: "14px", border: "1px solid rgba(184,134,11,0.25)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: 700, color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>चार्ट 3 · भाव चलित</div>
                              <div className="serif" style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>Nirayana Bhava Chalit</div>
                            </div>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: chalitShifts.length > 0 ? "rgba(220,38,38,0.1)" : "rgba(34,197,94,0.1)", color: chalitShifts.length > 0 ? "#DC2626" : "#15803D" }}>
                              {chalitShifts.length > 0 ? `${chalitShifts.length} Shifted` : "No Shifts"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <NorthIndianChart lagnaNum={chart.lagnaNum} planets={chalitPlanets} size={250} />
                          </div>
                          {chalitShifts.length > 0 && (
                            <div style={{ marginTop: "8px", padding: "6px 10px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", fontSize: "11px", color: "#991B1B" }}>
                              <strong>✦ भाव परिवर्तन: </strong>
                              {chalitShifts.map((s, idx) => (
                                <span key={s.name}>
                                  {idx > 0 && ", "}
                                  <strong>{s.name}</strong> (H{s.rashiHouse}→H{s.bhavaHouse})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 4. Bottom-Right: KP Cuspal Chart */}
                        <div style={{ padding: "12px", background: "#FAF8F5", borderRadius: "14px", border: "1px solid rgba(184,134,11,0.25)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: 700, color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>चार्ट 4 · कस्पल पद्धति</div>
                              <div className="serif" style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>KP Cuspal Chart</div>
                            </div>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "rgba(184,134,11,0.12)", color: "#B8860B" }}>
                              Placidus Cusps
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <NorthIndianChart lagnaNum={chart.lagnaNum} planets={kpPlanets} size={250} />
                          </div>
                          {kpResult?.rows && (
                            <div style={{ marginTop: "8px", padding: "6px 10px", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.18)", borderRadius: "8px", fontSize: "11px", color: "#1A1A1A" }}>
                              <div style={{ fontWeight: 700, color: "#B8860B", marginBottom: "3px" }}>✦ KP Planet Sub-Lords (उप-स्वामी):</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {kpResult.rows.map((r) => (
                                  <span key={r.name} style={{ background: "#FFFFFF", padding: "1px 6px", borderRadius: "4px", border: "1px solid rgba(184,134,11,0.2)", fontSize: "10.5px" }}>
                                    <strong>{r.name}</strong> [{r.subLord}]
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div style={{ marginTop: "8px", textAlign: "center" }}>
                            <Link href="/dashboard/kp" style={{ fontSize: "11px", color: "#B8860B", fontWeight: 700, textDecoration: "none" }}>
                              🔗 View Full KP Sub-Lord Significators Table →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

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
                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] flex items-center justify-between flex-wrap gap-2">
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

                        {/* Interactive Dasha Progress Capsule */}
                        {activeMD && (
                          <div className="pt-1">
                            <DashaProgressCapsule
                              start={activeAD?.start || activeMD.start}
                              end={activeAD?.end || activeMD.end}
                              label={activeAD ? `${tp(activeAD.planet)} Antardasha` : `${tp(activeMD.planet)} Mahadasha`}
                              className="w-full"
                            />
                          </div>
                        )}

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

                {/* ── SHASTRIC KUNDLI DOSSIER REPORT (EXACT CONSULTATION FORMAT) ── */}
                <div id="shastric-kundli-dossier" className="w-full my-6 scroll-mt-20">
                  <SimpleKundliReportCard chart={chart} />
                </div>

                {/* ── CLASSICAL NAVAGRAHA STHITI TABLE (VEDIC DEGREES & NAKSHATRAS) ── */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <div className="card-tag">✦ Classical Planetary Longitudes (ग्रह स्थिति चक्र)</div>
                      <div className="card-title serif mb-0">Vedic Navagraha Sthiti &amp; Degrees</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                        Chitra Paksha Lahiri (DMS)
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#4A4238] border border-[rgba(184,134,11,0.2)] font-semibold">
                        Whole Sign Houses
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B635B] mb-4 leading-relaxed">
                    Exact Parashari longitudes, degrees (° &apos; &quot;), nakshatras, padas, Jaimini Chara Karakas, and classical dignities calculated as per Chitra Paksha Lahiri Ayanamsha (matches AstroSage &amp; Jagannatha Hora).
                  </p>

                  <div className="overflow-x-auto">
                    <table className="ptable">
                      <thead>
                        <tr>
                          <th>Planet / Point</th>
                          <th>Motion / State</th>
                          <th>Rashi (Sign)</th>
                          <th>Longitude (DMS)</th>
                          <th>House (Bhava)</th>
                          <th>Nakshatra &amp; Pada</th>
                          <th>Dignity (Avastha)</th>
                          <th>Chara Karaka</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 1. Lagna (Ascendant) */}
                        {lagnaInfo && (
                          <tr style={{ background: "rgba(184, 134, 11, 0.05)" }}>
                            <td>
                              <span style={{ marginRight: 8, fontSize: 13, fontWeight: 700 }}>🌅</span>
                              <strong style={{ color: "#B8860B" }}>Lagna (Ascendant)</strong>
                            </td>
                            <td>
                              <span className="dpill" style={{ color: "#B8860B", background: "rgba(184,134,11,0.12)" }}>
                                Direct (D)
                              </span>
                            </td>
                            <td style={{ color: "#1A1A1A", fontWeight: 700 }}>{ts(chart.lagnaRashi)}</td>
                            <td style={{ color: "#B8860B", fontWeight: 700, fontFamily: "monospace" }}>
                              {lagnaInfo.dms}
                            </td>
                            <td style={{ color: "#1A1A1A", fontWeight: 700 }}>H1 (Tanu)</td>
                            <td style={{ color: "#1A1A1A", fontWeight: 600 }}>{tn(lagnaInfo.nakshatra)}</td>
                            <td style={{ color: "#3D3834" }}>Pada {lagnaInfo.pada}</td>
                            <td>
                              <span className="dpill" style={{ color: "#B8860B" }}>
                                Ascendant Horizon
                              </span>
                            </td>
                            <td>
                              <span className="text-xs font-semibold text-[#6B635B]">Tanu (Self)</span>
                            </td>
                          </tr>
                        )}

                        {/* 2. Navagrahas */}
                        {PLS.map((p, i) => {
                          const pl = chart.planets[p];
                          if (!pl) return null;
                          const sunLon = chart.planets["Sun"]?.lon ?? 0;
                          const isCombust = checkCombustion(p, pl.lon, sunLon, pl.retrograde);
                          const dms = formatDMS(pl.lon);
                          const karaka = charaKarakas[p] || "—";

                          return (
                            <tr key={i}>
                              <td>
                                <span style={{ color: PCOL[i], marginRight: 8, fontSize: 13, fontWeight: 700 }}>
                                  {PEMO[i]}
                                </span>
                                <span style={{ color: "#1A1A1A", fontWeight: 700 }}>{tp(p)}</span>
                              </td>
                              <td>
                                {pl.retrograde ? (
                                  <span className="retro" style={{ color: "#D97706", fontWeight: 700 }}>
                                    Retrograde (R)
                                  </span>
                                ) : isCombust ? (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      color: "#DC2626",
                                      background: "rgba(220,38,38,0.08)",
                                      border: "1px solid rgba(220,38,38,0.25)",
                                      borderRadius: 4,
                                      padding: "1px 5px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Combust (C)
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 12, color: "#6B635B" }}>Direct (D)</span>
                                )}
                              </td>
                              <td style={{ color: "#1A1A1A", fontWeight: 600 }}>{ts(pl.sign)}</td>
                              <td style={{ color: "#1A1A1A", fontWeight: 600, fontFamily: "monospace" }}>
                                {dms}
                              </td>
                              <td style={{ color: "#3D3834", fontWeight: 600 }}>House {pl.house}</td>
                              <td style={{ color: "#1A1A1A", fontSize: 13, fontWeight: 600 }}>
                                {tn(pl.nakshatra)} · P{pl.pada}
                              </td>
                              <td>
                                <span className="dpill" style={{ color: dignityColor(pl.dignity) }}>
                                  {pl.dignity || "—"}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontSize: 11.5,
                                    fontWeight: karaka.startsWith("Atmakaraka") ? 700 : 500,
                                    color: karaka.startsWith("Atmakaraka") ? "#B8860B" : "#4A4238",
                                  }}
                                >
                                  {karaka}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* SHASTRIC KUNDLI DOSSIER REPORT (FULL VIEW)             */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "master_dossier" && (
              <div className="space-y-6">
                <SimpleKundliReportCard chart={chart} />
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* 16 VARGA CHARTS (षोडशवर्ग) & NEURO-KARMIC REMEDIES      */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "divisional" && (
              <div className="space-y-6">
                {/* Varga Selector Header */}
                <div className="card p-6 sm:p-7 shadow-[0_4px_24px_rgba(184,134,11,0.06)]">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <div className="card-tag">✦ Classical Shodashavarga Architecture (BPHS)</div>
                      <div className="card-title serif text-2xl font-bold text-[#1A1A1A]">16 Varga Kundali Analysis (षोडशवर्ग चक्र)</div>
                    </div>
                    <span className="text-xs px-3.5 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                      16 Vargas Calculated
                    </span>
                  </div>
                  <p className="text-sm sm:text-[14.5px] text-[#4A4238] leading-[1.75] mb-5">
                    Shastric rule: Natal D1 kundali seed promise (बीज) hai; 16 divisional charts har life domain ke micro-karma ko decode karte hain.
                    Neeche kisi bhi varga chart par click karein uski dynamic D1 alignment, subconscious karmic bottlenecks aur scientific DNA-based remedies dekhne ke liye:
                  </p>

                  {/* Varga Selector Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
                    {divCharts.map((d) => {
                      const m = VARGA_CHART_META[d.key] || { icon: "✦", domain: d.purpose };
                      const isActive = (currentDiv?.key ?? "D9") === d.key;
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => setSelectedVarga(d.key)}
                          title={`${d.key} (${d.name}): ${m.domain}`}
                          className={`p-2.5 rounded-xl text-center border transition-all text-xs font-medium flex flex-col items-center justify-center min-h-[62px] ${
                            isActive
                              ? "bg-[rgba(184,134,11,0.15)] border-[#B8860B] text-[#B8860B] font-bold shadow-sm"
                              : "bg-[#FAF7F2] border-[rgba(184,134,11,0.18)] text-[#6B635B] hover:border-[#B8860B]"
                          }`}
                        >
                          <span className="text-base leading-none mb-1">{m.icon}</span>
                          <span className="font-bold leading-none text-xs">{d.key}</span>
                          <span className="text-[9.5px] opacity-80 leading-tight mt-1 truncate w-full text-center">{m.domain}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Varga Chart & Positions */}
                {currentDiv && (
                  <div className="chart-layout">
                    {/* North Indian Chart for Active Varga */}
                    <div className="card p-6 sm:p-7 shadow-[0_4px_24px_rgba(184,134,11,0.06)]">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="card-tag">✦ {currentDiv.key} · {currentDiv.name}</div>
                          <div className="card-title serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">{currentDiv.key} Kundali</div>
                        </div>
                        <span className="text-xs px-3.5 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                          {currentDiv.lagna} Lagna
                        </span>
                      </div>

                      <NorthIndianChart lagnaNum={currentDiv.lagnaNum} planets={currentDivPlanets} />

                      <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.22)] border-l-4 border-l-[#B8860B]">
                        <div className="text-[11px] uppercase font-bold text-[#B8860B] tracking-wider mb-1.5 flex items-center gap-1.5">
                          <span>✦</span>
                          <span>चक्र का शास्त्रीय प्रयोजन · Shastric Domain Purpose</span>
                        </div>
                        <div className="font-serif text-[14.5px] sm:text-[15px] text-[#2A241F] leading-[1.8] text-justify">
                          {currentDiv.purpose}
                        </div>
                      </div>
                    </div>

                    {/* Planet Positions in Active Varga */}
                    <div className="card p-6 sm:p-7 shadow-[0_4px_24px_rgba(184,134,11,0.06)]">
                      <div className="card-tag">✦ Planetary Placements</div>
                      <div className="card-title serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3">Planets in {currentDiv.key}</div>
                      <div className="space-y-2 max-h-[390px] overflow-y-auto pr-1">
                        {currentDiv.planets.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.16)] text-xs sm:text-[13px] hover:border-[#B8860B] transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span style={{ color: p.color }} className="font-bold text-sm">{p.icon}</span>
                              <span className="font-semibold text-[#1A1A1A]">{p.planet}</span>
                              {p.retrograde && (
                                <span className="text-[10px] text-[#F97316] font-bold px-1 rounded bg-orange-50 border border-orange-200">
                                  (R)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[#6B635B] font-medium">{p.sign}</span>
                              <span className="font-bold text-[#B8860B] px-2 py-0.5 rounded bg-white border border-[rgba(184,134,11,0.2)]">
                                H{p.house}
                              </span>
                              {p.dignity !== "—" ? (
                                <span
                                  className={`text-[10.5px] px-2 py-0.5 rounded font-bold ${
                                    p.dignity === "Exalted"
                                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                                      : p.dignity === "Own"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-rose-100 text-rose-800 border border-rose-200"
                                  }`}
                                >
                                  {p.dignity}
                                </span>
                              ) : (
                                <span className="text-[11px] text-gray-400 w-12 text-center">—</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 3-TIER NEURO-KARMIC SHODASHAVARGA ENGINE ── */}
                {activeVargaNeuro && (
                  <VargaNeuroKarmicCards profile={activeVargaNeuro} />
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 2: CAREER & WEALTH (D-10 DASAMSHA)              */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "career" && (
              <div className="space-y-6">
                {careerNarrative && <PillarNarrativeCard narrative={careerNarrative} />}

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

                    {/* Dynamic D-10 Career Insights */}
                    <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12 }}>
                      <div className="flex items-center justify-between mb-2">
                        <div style={{ fontSize: 11, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700 }}>
                          D-10 Micro-Karma Insights (दशांश विश्लेषण)
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[rgba(184,134,11,0.15)] text-[#B8860B]">
                          Operational Status
                        </span>
                      </div>
                      <div className="space-y-2">
                        {d10Analysis.length > 0 ? (
                          d10Analysis.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#3D3834] leading-relaxed">
                              <span className="text-[#B8860B] font-bold mt-0.5">✦</span>
                              <span>{insight}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 13, color: "#3D3834", lineHeight: 1.7 }}>
                            {d10?.keyInsight || "Dasamsha chart profession, authority, promotion aur public life me aapke karma sthiti ko darshata hai."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Career & Wealth Reading Breakdown: D-10 + D-1 Dual Framework */}
                  <div className="space-y-4">
                    <div className="card">
                      <div className="card-tag">✦ True D-10 vs D-1 Alignment</div>
                      <div className="card-title serif">Professional Matrix (कर्म विधान)</div>
                      <div className="space-y-3 text-xs text-[#3D3834] leading-relaxed">
                        {/* D-10 Operational Reality Card */}
                        {d10 && d10Meta && (
                          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.3)] shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                                <span className="text-[#B8860B]">⚡</span> D-10 Dasamsha (कार्यक्षेत्र महाफल)
                              </span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF2DC] text-[#9A6B00]">
                                Operational Reality
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[#7D6B58] font-medium">10th House (Karma Kshetra): </span>
                                <strong className="text-[#1A1A1A]">{d10Meta.tenthSign}</strong>
                                <span className="text-[#6B635B]"> (Swami: {d10Meta.tenthLord}{d10Meta.tenthLordHouse ? ` in House ${d10Meta.tenthLordHouse}` : ""})</span>
                                {d10Meta.tenthPlanets.length > 0 && (
                                  <div className="mt-0.5 text-[#B8860B] font-semibold">
                                    Occupants: {d10Meta.tenthPlanets.map((p) => `${p.planet}${p.dignity !== "—" ? ` (${p.dignity})` : ""}`).join(", ")}
                                  </div>
                                )}
                              </div>

                              <div>
                                <span className="text-[#7D6B58] font-medium">D-10 Lagna & Persona: </span>
                                <strong className="text-[#1A1A1A]">{d10.lagna}</strong>
                                <span className="text-[#6B635B]"> (Lagna Lord: {d10Meta.lagnaLord})</span>
                                {d10Meta.lagnaPlanets.length > 0 && (
                                  <div className="mt-0.5 text-[#8B6508] font-medium">
                                    In Lagna: {d10Meta.lagnaPlanets.map((p) => `${p.planet}${p.dignity !== "—" ? ` (${p.dignity})` : ""}`).join(", ")}
                                  </div>
                                )}
                              </div>

                              {(d10Meta.exaltedPlanets.length > 0 || d10Meta.ownPlanets.length > 0) && (
                                <div className="pt-1">
                                  <span className="text-[#7D6B58] font-medium">Prominent Dignities: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {d10Meta.exaltedPlanets.map((p) => (
                                      <span
                                        key={p.planet}
                                        className="px-2 py-0.5 rounded text-[11px] bg-[rgba(34,197,94,0.12)] text-[#15803d] font-bold border border-[rgba(34,197,94,0.3)]"
                                      >
                                        ★ {p.planet} Exalted in {p.sign} (H{p.house})
                                      </span>
                                    ))}
                                    {d10Meta.ownPlanets.map((p) => (
                                      <span
                                        key={p.planet}
                                        className="px-2 py-0.5 rounded text-[11px] bg-[rgba(184,134,11,0.12)] text-[#9A6B00] font-bold border border-[rgba(184,134,11,0.3)]"
                                      >
                                        ● {p.planet} Own Sign ({p.sign})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div>
                                <span className="text-[#7D6B58] font-medium">Wealth & Cashflow (H2 & H11): </span>
                                <span className="text-[#3D3834]">
                                  {d10Meta.eleventhPlanets.length > 0
                                    ? `11th House: ${d10Meta.eleventhPlanets.map((p) => p.planet).join(", ")} | `
                                    : ""}
                                  {d10Meta.secondPlanets.length > 0
                                    ? `2nd House: ${d10Meta.secondPlanets.map((p) => p.planet).join(", ")}`
                                    : "Retention governed by 2nd lord"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* D-1 Natal Foundation Card */}
                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                              <span className="text-[#B8860B]">🌱</span> D-1 Natal Seed (जन्म कर्म बीज)
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[rgba(184,134,11,0.1)] text-[#B8860B]">
                              Innate Potential
                            </span>
                          </div>
                          <div className="text-[#3D3834] space-y-1">
                            <div>
                              <span className="text-[#7D6B58]">10th Cusp from Lagna: </span>
                              <strong>{chart.houseCusps?.[9]?.sign ?? "10th Bhava"}</strong>
                            </div>
                            {charaKarakas["Amatyakaraka (AmK)"] && (
                              <div>
                                <span className="text-[#7D6B58]">Amatyakaraka (AmK): </span>
                                <strong>{charaKarakas["Amatyakaraka (AmK)"]}</strong>
                              </div>
                            )}
                            <div className="text-[11.5px] text-[#6B635B] pt-0.5">
                              D-1 जातक की आंतरिक अभिरुचि, ज्ञान और जीवन दिशा (बीज) तय करता है।
                            </div>
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

                {/* ── 3-TIER NEURO-KARMIC REMEDIES FOR D-10 ── */}
                {d10Neuro && (
                  <VargaNeuroKarmicCards profile={d10Neuro} />
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 3: LOVE & MARRIAGE (D-9 NAVAMSHA & MANGLIK)     */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "marriage" && (
              <div className="space-y-6">
                {marriageNarrative && <PillarNarrativeCard narrative={marriageNarrative} />}

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
                      <div className="flex items-center justify-between mb-2">
                        <div style={{ fontSize: 11, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700 }}>
                          D-9 Navamsha Marriage Insights (नवमांश विश्लेषण)
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[rgba(184,134,11,0.15)] text-[#B8860B]">
                          Soul & Partnership
                        </span>
                      </div>
                      <div className="space-y-2">
                        {d9Analysis.length > 0 ? (
                          d9Analysis.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#3D3834] leading-relaxed">
                              <span className="text-[#B8860B] font-bold mt-0.5">✦</span>
                              <span>{insight}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 13, color: "#3D3834", lineHeight: 1.7 }}>
                            {d9?.keyInsight || "Navamsha D-9 kundli life partner ke qualities, soul connection aur post-marriage harmony ka mool aadhar hai."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Relationship Karma & Mangal Dosha Card */}
                  <div className="space-y-4">
                    {/* D-9 Navamsha Partner & Marriage Matrix Card */}
                    {d9 && d9Meta && (
                      <div className="card">
                        <div className="card-tag">✦ True D-9 Navamsha Reality</div>
                        <div className="card-title serif">Navamsha Matrix (दांपत्य एवं भाग्य फल)</div>
                        <div className="space-y-3 text-xs text-[#3D3834] leading-relaxed">
                          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.3)] shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                                <span className="text-[#B8860B]">⚡</span> D-9 Navamsha (विवाह एवं साथी स्वरूप)
                              </span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF2DC] text-[#9A6B00]">
                                Manifested Harmony
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[#7D6B58] font-medium">7th House (Partner & Union): </span>
                                <strong className="text-[#1A1A1A]">{d9Meta.seventhSign}</strong>
                                <span className="text-[#6B635B]"> (Swami: {d9Meta.seventhLord}{d9Meta.seventhLordHouse ? ` in House ${d9Meta.seventhLordHouse}` : ""})</span>
                                {d9Meta.seventhPlanets.length > 0 && (
                                  <div className="mt-0.5 text-[#B8860B] font-semibold">
                                    Occupants: {d9Meta.seventhPlanets.map((p) => `${p.planet}${p.dignity !== "—" ? ` (${p.dignity})` : ""}`).join(", ")}
                                  </div>
                                )}
                              </div>

                              <div>
                                <span className="text-[#7D6B58] font-medium">D-9 Lagna & Inner Temperament: </span>
                                <strong className="text-[#1A1A1A]">{d9.lagna}</strong>
                                <span className="text-[#6B635B]"> (Lagna Lord: {d9Meta.lagnaLord})</span>
                                {d9Meta.lagnaPlanets.length > 0 && (
                                  <div className="mt-0.5 text-[#8B6508] font-medium">
                                    In Lagna: {d9Meta.lagnaPlanets.map((p) => `${p.planet}${p.dignity !== "—" ? ` (${p.dignity})` : ""}`).join(", ")}
                                  </div>
                                )}
                              </div>

                              {d9Meta.venus && (
                                <div>
                                  <span className="text-[#7D6B58] font-medium">Venus in D-9 (Marriage Karaka): </span>
                                  <strong className="text-[#1A1A1A]">{d9Meta.venus.sign}</strong>
                                  <span className="text-[#6B635B]"> (House {d9Meta.venus.house}{d9Meta.venus.dignity !== "—" ? `, ${d9Meta.venus.dignity}` : ""})</span>
                                </div>
                              )}

                              {d9Meta.jupiter && (
                                <div>
                                  <span className="text-[#7D6B58] font-medium">Jupiter in D-9 (Wisdom & Grace): </span>
                                  <strong className="text-[#1A1A1A]">{d9Meta.jupiter.sign}</strong>
                                  <span className="text-[#6B635B]"> (House {d9Meta.jupiter.house}{d9Meta.jupiter.dignity !== "—" ? `, ${d9Meta.jupiter.dignity}` : ""})</span>
                                </div>
                              )}

                              {(d9Meta.exaltedPlanets.length > 0 || d9Meta.ownPlanets.length > 0) && (
                                <div className="pt-1">
                                  <span className="text-[#7D6B58] font-medium">Soul Strengths in D-9: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {d9Meta.exaltedPlanets.map((p) => (
                                      <span
                                        key={p.planet}
                                        className="px-2 py-0.5 rounded text-[11px] bg-[rgba(34,197,94,0.12)] text-[#15803d] font-bold border border-[rgba(34,197,94,0.3)]"
                                      >
                                        ★ {p.planet} Exalted in {p.sign} (H{p.house})
                                      </span>
                                    ))}
                                    {d9Meta.ownPlanets.map((p) => (
                                      <span
                                        key={p.planet}
                                        className="px-2 py-0.5 rounded text-[11px] bg-[rgba(184,134,11,0.12)] text-[#9A6B00] font-bold border border-[rgba(184,134,11,0.3)]"
                                      >
                                        ● {p.planet} Own Sign ({p.sign})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* D-1 Natal Seed for Marriage */}
                          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)]">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                                <span className="text-[#B8860B]">🌱</span> D-1 Natal Seed (विवाह संबंध बीज)
                              </span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[rgba(184,134,11,0.1)] text-[#B8860B]">
                                Attraction & Promise
                              </span>
                            </div>
                            <div className="text-[#3D3834] space-y-1">
                              <div>
                                <span className="text-[#7D6B58]">7th Cusp from Lagna: </span>
                                <strong>{chart.houseCusps?.[6]?.sign ?? "7th Bhava"}</strong>
                              </div>
                              {charaKarakas["Darakaraka (DK)"] && (
                                <div>
                                  <span className="text-[#7D6B58]">Darakaraka (DK): </span>
                                  <strong>{charaKarakas["Darakaraka (DK)"]}</strong>
                                </div>
                              )}
                              <div className="text-[11.5px] text-[#6B635B] pt-0.5">
                                D-1 से विवाह की इच्छा, आकर्षण और सांसारिक अनुबंध तय होता है; D-9 से वास्तविक दांपत्य सुख और दीर्घकालिक सामंजस्य फलीभूत होता है।
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

                {/* ── 3-TIER NEURO-KARMIC REMEDIES FOR D-9 ── */}
                {d9Neuro && (
                  <VargaNeuroKarmicCards profile={d9Neuro} />
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════ */}
            {/* PILLAR 4: TIMING & DASHA TIMELINE                      */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "timing" && (
              <div className="space-y-6">
                {timingNarrative && <PillarNarrativeCard narrative={timingNarrative} />}

                {/* LIVE DASHA TICKER */}
                <LiveDashaTickerStrip chart={chart} />

                {/* FULL 5-LEVEL VIMSHOTTARI EXPLORER */}
                <VimshottariFiveLevelExplorer chart={chart} />

                <div className="card">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <div className="card-tag">✦ Vimshottari Timeline (120-Year Cycle)</div>
                      <div className="card-title serif mb-0">Your Karmic Progression Overview</div>
                    </div>
                    {activeMD && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                          Active: {activeMD.planet} Mahadasha ({formatDate(activeMD.start)} - {formatDate(activeMD.end)})
                        </span>
                        <DashaProgressCapsule
                          planet={activeMD.planet}
                          startYear={new Date(activeMD.start).getFullYear()}
                          endYear={new Date(activeMD.end).getFullYear()}
                          exactStartDate={activeMD.start}
                          exactEndDate={activeMD.end}
                        />
                      </div>
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
                {specsNarrative && <PillarNarrativeCard narrative={specsNarrative} />}

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
            {/* PILLAR: CLINICAL INTELLIGENCE (5 DEEP ENGINES)         */}
            {/* ══════════════════════════════════════════════════════ */}
            {activeTab === "clinical" && (
              <div className="space-y-4">
                <ClinicalPredictiveDossier chart={chart} defaultSection="all" />
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

      {/* Edit Saved Chart Modal */}
      <EditChartModal
        isOpen={Boolean(editingSavedChart)}
        chart={editingSavedChart}
        onClose={() => setEditingSavedChart(null)}
        onSaved={handleSavedChartEdited}
      />

      {/* Delete Saved Chart Modal */}
      <DeleteChartModal
        isOpen={Boolean(deletingSavedChart)}
        chartName={deletingSavedChart?.name || ""}
        onClose={() => setDeletingSavedChart(null)}
        onConfirm={handleConfirmDeleteSaved}
        isDeleting={isDeletingSavedChart}
      />
    </>
  );
}
