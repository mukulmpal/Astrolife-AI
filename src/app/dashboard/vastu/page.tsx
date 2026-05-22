"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadVastuPDFReport } from "@/lib/report-generator";
import { calculateVastu, type VastuResult as CompleteVastuResult } from "@/lib/astro-engine/vastu";
import { useUserChart } from "@/lib/user-chart";
import { EngineShell, EngineHeader, EngineSectionTitle } from "@/components/engine/EngineShell";
import { EngineStateCard } from "@/components/engine-state-card";
import "@/app/dashboard/shared.css";

type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "CENTER" | "";

type VastuZoneRow = {
  dir: string;
  name: string;
  planet: string;
  domain: string;
  color: string;
  score: number;
  status: string;
  statusColor: string;
  planets: string[];
  remedy: string;
  roomIdeal: string;
  hasDosha: boolean;
};

type VastuCalculatorResult = {
  engineVersion?: string;
  summary?: string;
  scores?: {
    overall?: number;
    wealth?: number;
    health?: number;
    relationship?: number;
    career?: number;
    children?: number;
    spiritual?: number;
    business?: number;
    mentalPeace?: number;
    construction?: number;
  };
  strengths?: Array<{ title: string; explanation: string; score: number }>;
  defects?: Array<{ title: string; explanation: string; severity: number; remedies: string[] }>;
  recommendations?: Array<{
    title: string;
    priority: string;
    system: string;
    steps: string[];
    requiresKundli?: boolean;
  }>;
  correctionPlan?: {
    thirtyDay: string[];
    sixtyDay: string[];
    ninetyDay: string[];
  };
  mindMakan?: {
    physical: string[];
    behavioural: string[];
    routine: string[];
    emotional: string[];
    spiritual: string[];
  };
  vastuPurushaHealth?: {
    affectedZones: string[];
    observations: string[];
  };
  zoneAnalysis?: {
    zones: VastuZoneRow[];
    strongZones: VastuZoneRow[];
    weakZones: VastuZoneRow[];
    overallScore: number;
    psychBridge: string[];
    transitAlerts: Array<{
      planet: string;
      zone: string;
      domain: string;
      effect: string;
      remedy: string;
      positive: boolean;
    }>;
    roomGuide: ReadonlyArray<{ room: string; idealDir: string; reason: string }>;
  };
};

type RoomInput = {
  id: string;
  type: string;
  name: string;
  direction: Direction;
};

type NormalizedKundli = {
  weakPlanets: string[];
  currentMahadasha?: string;
  currentAntardasha?: string;
  lalKitabHouses: Record<string, string[]>;
  source: string;
};

const directionOptions: Array<{ value: Direction; label: string }> = [
  { value: "", label: "Select" },
  { value: "N", label: "North" },
  { value: "NE", label: "North-East" },
  { value: "E", label: "East" },
  { value: "SE", label: "South-East" },
  { value: "S", label: "South" },
  { value: "SW", label: "South-West" },
  { value: "W", label: "West" },
  { value: "NW", label: "North-West" },
  { value: "CENTER", label: "Brahmasthan / Center" },
];

const roomTypeOptions = [
  { value: "main_entrance", label: "Main Entrance" },
  { value: "kitchen", label: "Kitchen" },
  { value: "master_bedroom", label: "Master Bedroom" },
  { value: "bedroom", label: "Bedroom" },
  { value: "toilet", label: "Toilet" },
  { value: "bathroom", label: "Bathroom" },
  { value: "pooja_room", label: "Pooja Room" },
  { value: "study_room", label: "Study Room" },
  { value: "staircase", label: "Staircase" },
  { value: "underground_water", label: "Underground Water" },
  { value: "overhead_tank", label: "Overhead Tank" },
  { value: "septic_tank", label: "Septic Tank" },
  { value: "office_cabin", label: "Office Cabin" },
  { value: "locker", label: "Locker / Safe" },
];

const initialRooms: RoomInput[] = [
  { id: "room-main-entrance", type: "main_entrance", name: "Main Entrance", direction: "" },
  { id: "room-kitchen", type: "kitchen", name: "Kitchen", direction: "" },
  { id: "room-master-bedroom", type: "master_bedroom", name: "Master Bedroom", direction: "" },
  { id: "room-bedroom", type: "bedroom", name: "Bedroom", direction: "" },
  { id: "room-toilet", type: "toilet", name: "Toilet", direction: "" },
  { id: "room-pooja", type: "pooja_room", name: "Pooja Room", direction: "" },
];

const possibleChartStorageKeys = [
  "astrolife_chart","astrolife_chart_data","astrolife_current_chart","astrolife_user_chart",
  "chartData","kundliData","kundli","userChart","birthChart","currentChart","astroChart",
  "astro_chart","premiumReportData","reportData",
];

function safeJsonParse(value: string | null) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

function readNested(obj: unknown, paths: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  for (const path of paths) {
    const parts = path.split(".");
    let current: unknown = obj;
    for (const part of parts) {
      if (!current || typeof current !== "object") { current = undefined; break; }
      current = (current as Record<string, unknown>)[part];
    }
    if (current !== undefined && current !== null && current !== "") return current;
  }
  return undefined;
}

function normalizePlanetName(value: unknown): string {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();
  const map: Record<string, string> = {
    sun:"Sun",surya:"Sun",moon:"Moon",chandra:"Moon",mars:"Mars",mangal:"Mars",
    mercury:"Mercury",budh:"Mercury",jupiter:"Jupiter",guru:"Jupiter",
    venus:"Venus",shukra:"Venus",saturn:"Saturn",shani:"Saturn",rahu:"Rahu",ketu:"Ketu",
  };
  return map[lower] || raw;
}

function collectPlanetsArray(chart: unknown): Array<Record<string, unknown>> {
  const candidates = [
    readNested(chart, ["planets"]),readNested(chart, ["planetaryPositions"]),
    readNested(chart, ["planetPositions"]),readNested(chart, ["chart.planets"]),
    readNested(chart, ["rasi.planets"]),readNested(chart, ["birthChart.planets"]),
    readNested(chart, ["data.planets"]),readNested(chart, ["kundli.planets"]),
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
    }
    if (candidate && typeof candidate === "object") {
      return Object.entries(candidate as Record<string, unknown>).map(([planet, value]) => {
        if (value && typeof value === "object") return { planet, ...(value as Record<string, unknown>) };
        return { planet, house: value };
      });
    }
  }
  return [];
}

function buildLalKitabHousesFromChart(chart: unknown): Record<string, string[]> {
  const direct = readNested(chart, ["lalKitabHouses","lalKitab.houses","lalKitab.khana","kundli.lalKitabHouses","data.lalKitabHouses"]);
  if (direct && typeof direct === "object" && !Array.isArray(direct)) {
    const normalized: Record<string, string[]> = {};
    for (const [house, planets] of Object.entries(direct as Record<string, unknown>)) {
      if (Array.isArray(planets)) normalized[String(house)] = planets.map(normalizePlanetName).filter(Boolean);
      else if (typeof planets === "string") normalized[String(house)] = planets.split(/[,\s]+/).map(normalizePlanetName).filter(Boolean);
    }
    if (Object.keys(normalized).length > 0) return normalized;
  }
  const houses: Record<string, string[]> = {};
  const planets = collectPlanetsArray(chart);
  for (const item of planets) {
    const planet = normalizePlanetName(item.name || item.planet || item.planetName || item.key || item.graha);
    const houseRaw = item.house || item.bhava || item.houseNumber || item.lalKitabHouse || item.khana || item.lkHouse;
    const house = Number(houseRaw);
    if (planet && Number.isFinite(house) && house >= 1 && house <= 12) {
      const key = String(house);
      houses[key] ||= [];
      if (!houses[key].includes(planet)) houses[key].push(planet);
    }
  }
  return houses;
}

function normalizeWeakPlanets(chart: unknown): string[] {
  const direct = readNested(chart, ["weakPlanets","analysis.weakPlanets","strength.weakPlanets","planetStrengths.weakPlanets","kundli.weakPlanets","data.weakPlanets"]);
  if (Array.isArray(direct)) return direct.map(normalizePlanetName).filter(Boolean);
  const planets = collectPlanetsArray(chart);
  const weak: string[] = [];
  for (const item of planets) {
    const planet = normalizePlanetName(item.name || item.planet || item.planetName || item.key || item.graha);
    const strengthRaw = String(item.strength || item.status || item.dignity || item.condition || "").toLowerCase();
    const numericStrength = Number(item.score ?? item.strengthScore ?? item.shadbalaScore);
    if (planet && (strengthRaw.includes("weak") || strengthRaw.includes("debilitated") || strengthRaw.includes("neecha") || strengthRaw.includes("afflicted") || (Number.isFinite(numericStrength) && numericStrength < 35))) {
      weak.push(planet);
    }
  }
  return Array.from(new Set(weak));
}

function extractActiveDasha(chart: unknown, field: string): string | undefined {
  const arr = readNested(chart, [field]);
  if (Array.isArray(arr)) {
    const active = arr.find((d: Record<string, unknown>) => d.active);
    return (active?.planet as string) ?? (arr[0]?.planet as string) ?? undefined;
  }
  return undefined;
}

function normalizeKundli(chart: unknown, source: string): NormalizedKundli {
  const currentMahadasha =
    readNested(chart, ["currentMahadasha","currentMD","dasha.currentMahadasha","dasha.currentMD"]) ??
    extractActiveDasha(chart, "dashas");
  const currentAntardasha =
    readNested(chart, ["currentAntardasha","currentAD","dasha.currentAntardasha","dasha.currentAD"]) ??
    extractActiveDasha(chart, "antardasha");
  return {
    weakPlanets: normalizeWeakPlanets(chart),
    currentMahadasha: currentMahadasha ? normalizePlanetName(currentMahadasha) : undefined,
    currentAntardasha: currentAntardasha ? normalizePlanetName(currentAntardasha) : undefined,
    lalKitabHouses: buildLalKitabHousesFromChart(chart),
    source,
  };
}

function loadUserChartFromStorage(): { chart: unknown; source: string } | null {
  if (typeof window === "undefined") return null;
  const stores = [{ name: "localStorage", store: window.localStorage },{ name: "sessionStorage", store: window.sessionStorage }];
  for (const { name, store } of stores) {
    for (const key of possibleChartStorageKeys) {
      const parsed = safeJsonParse(store.getItem(key));
      if (parsed && typeof parsed === "object") return { chart: parsed, source: `${name}:${key}` };
    }
  }
  return null;
}

function zoneScoreColor(score: number): string {
  if (score >= 80) return "#4ade80";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
}

function severityColor(s: number): { bg: string; text: string } {
  if (s >= 9) return { bg: "rgba(239,68,68,0.1)", text: "#f87171" };
  if (s >= 7) return { bg: "rgba(249,115,22,0.1)", text: "#fb923c" };
  return { bg: "rgba(234,179,8,0.1)", text: "#fbbf24" };
}

function priorityColor(p: string): { bg: string; text: string } {
  if (p === "critical") return { bg: "rgba(239,68,68,0.1)", text: "#f87171" };
  if (p === "high") return { bg: "rgba(249,115,22,0.1)", text: "#fb923c" };
  if (p === "medium") return { bg: "rgba(234,179,8,0.1)", text: "#fbbf24" };
  return { bg: "rgba(96,88,144,0.15)", text: "#8f86ad" };
}

/* ─── Complete Analysis Panel ─────────────────────────────────── */
function CompleteAnalysisPanel({ result }: { result: CompleteVastuResult | null }) {
  const [zoneTab, setZoneTab] = useState<"all" | "strong" | "weak" | "psych" | "transit" | "rooms">("all");

  if (!result) {
    return (
      <EngineStateCard
        title="Vastu Analysis"
        emptyText="Generate your Kundli to unlock 16-zone MahaVastu analysis."
      />
    );
  }

  const zones =
    zoneTab === "strong" ? result.strongZones :
    zoneTab === "weak"   ? result.weakZones   :
    result.zones;

  return (
    <>
      {/* Stats row */}
      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-n">{result.zones.length}</div>
          <div className="stat-l">Total Zones</div>
        </div>
        <div className="stat-card" style={{ borderColor: "rgba(34,197,94,0.25)" }}>
          <div className="stat-icon">✅</div>
          <div className="stat-n" style={{ color: "#4ade80" }}>{result.strongZones.length}</div>
          <div className="stat-l">Strong</div>
        </div>
        <div className="stat-card" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-n" style={{ color: "#f87171" }}>{result.weakZones.length}</div>
          <div className="stat-l">Weak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🪐</div>
          <div className="stat-n">{result.transitAlerts.length}</div>
          <div className="stat-l">Transit Alerts</div>
        </div>
      </div>

      <EngineSectionTitle
        eyebrow="MahaVastu · 16 Zones"
        title="Zone Analysis"
        subtitle="Chart planets mapped to Vastu zones — strengths, weak spots, psychology bridge, transit alerts."
      />

      {/* Zone sub-tabs */}
      <div className="tabs">
        {(["all","strong","weak","psych","transit","rooms"] as const).map(tab => (
          <button key={tab} className={`tab ${zoneTab === tab ? "active" : ""}`} onClick={() => setZoneTab(tab)}>
            {tab === "psych" ? "Psych Bridge" : tab === "transit" ? "Transit Alerts" : tab === "rooms" ? "Room Guide" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Zone grid */}
      {(zoneTab === "all" || zoneTab === "strong" || zoneTab === "weak") && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {zones.map((zone) => (
            <div
              key={zone.dir}
              className="card"
              style={{
                padding: 16,
                borderColor:
                  zone.status === "Strong" ? "rgba(34,197,94,0.25)" :
                  zone.status === "Weak"   ? "rgba(239,68,68,0.25)" :
                  undefined,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span className="card-tag">{zone.dir}</span>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 700, color: zoneScoreColor(zone.score) }}>
                  {zone.score}
                </span>
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>
                {zone.name}
              </div>
              <div style={{ fontSize: 11, color: "#605890", marginBottom: 6 }}>
                {zone.planet} · {"element" in zone ? (zone as {element?: string}).element : ""}
              </div>
              <div style={{ fontSize: 11, color: "#8f86ad", marginBottom: 8 }}>{zone.domain}</div>
              {zone.planets.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {zone.planets.map(p => <span key={p} className="planet-pill">{p}</span>)}
                </div>
              )}
              <div style={{ fontSize: 11, color: "#605890" }}>Ideal: {zone.roomIdeal}</div>
              <div style={{ fontSize: 11, color: "#c8a030", marginTop: 4 }}>↺ {zone.remedy}</div>
            </div>
          ))}
        </div>
      )}

      {/* Psych bridge */}
      {zoneTab === "psych" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.psychBridge.map((item, i) => (
            <div key={i} className="card" style={{ padding: 16, fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Transit alerts */}
      {zoneTab === "transit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.transitAlerts.length === 0 && (
            <p style={{ fontSize: 13, color: "#605890" }}>No active transit alerts.</p>
          )}
          {result.transitAlerts.map((alert, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 16,
                borderColor: alert.positive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: alert.positive ? "#4ade80" : "#f87171" }}>{alert.planet}</span>
                <span style={{ color: "#605890" }}>→</span>
                <span style={{ color: "#c8c0a8" }}>{alert.zone}</span>
                <span className="badge-gold" style={{ marginLeft: "auto" }}>{alert.domain}</span>
              </div>
              <p style={{ fontSize: 13, color: "#8f86ad", lineHeight: 1.65, marginBottom: 6 }}>{alert.effect}</p>
              <p style={{ fontSize: 12, color: "#c8a030" }}>↺ Remedy: {alert.remedy}</p>
            </div>
          ))}
        </div>
      )}

      {/* Room guide */}
      {zoneTab === "rooms" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {result.roomGuide.map((room) => (
            <div key={room.room} className="card" style={{ padding: 16 }}>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>
                {room.room}
              </div>
              <div style={{ fontSize: 13, color: "#c8a030", marginBottom: 6 }}>{room.idealDir}</div>
              <div style={{ fontSize: 13, color: "#8f86ad", lineHeight: 1.6 }}>{room.reason}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function VastuDashboardPage() {
  const { chart, loading: chartLoading } = useUserChart();
  const [kundli, setKundli] = useState<NormalizedKundli | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"kundli" | "property">("kundli");
  const [chartLoadMessage, setChartLoadMessage] = useState("Chart not loaded yet.");
  const [propertyType, setPropertyType] = useState("home");
  const [facing, setFacing] = useState<Direction>("");
  const [rooms, setRooms] = useState<RoomInput[]>(initialRooms);
  const [northOpen, setNorthOpen] = useState(true);
  const [eastOpen, setEastOpen] = useState(true);
  const [southWestHeavy, setSouthWestHeavy] = useState(true);
  const [brahmasthanOpen, setBrahmasthanOpen] = useState(true);
  const [includeLalKitab, setIncludeLalKitab] = useState(true);
  const [includeConstruction, setIncludeConstruction] = useState(false);
  const [shape, setShape] = useState("rectangle");
  const [lengthHasta, setLengthHasta] = useState("");
  const [widthHasta, setWidthHasta] = useState("");
  const [result, setResult] = useState<VastuCalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [mindMakanTab, setMindMakanTab] = useState<"physical" | "behavioural" | "routine" | "emotional" | "spiritual">("physical");
  const [activeZoneTab, setActiveZoneTab] = useState<"all" | "strong" | "weak" | "psych" | "transit">("all");
  const [pdfLoading, setPdfLoading] = useState(false);
  const completeAnalysis = useMemo(() => {
    if (!chart?.planets) return null;
    return calculateVastu(chart.planets);
  }, [chart]);

  function refreshChart() {
    const loaded = loadUserChartFromStorage();
    if (!loaded) {
      setKundli(null);
      setChartLoadMessage("No saved chart found. Open your Kundli page first, then return here and click Refresh Chart.");
      return;
    }
    const normalized = normalizeKundli(loaded.chart, loaded.source);
    setKundli(normalized);
    const planetsCount = Object.values(normalized.lalKitabHouses).reduce((sum, p) => sum + p.length, 0);
    setChartLoadMessage(
      `Chart loaded (${normalized.source}). Weak planets: ${normalized.weakPlanets.length ? normalized.weakPlanets.join(", ") : "none detected"}. Lal Kitab zones mapped: ${planetsCount}.`
    );
  }

  useEffect(() => { void Promise.resolve().then(refreshChart); }, []);

  const activeRooms = useMemo(() => {
    return rooms
      .filter(r => r.type && r.direction)
      .map(r => ({
        type: r.type,
        direction: r.direction,
        name: r.name || roomTypeOptions.find(o => o.value === r.type)?.label || r.type,
      }));
  }, [rooms]);

  function updateRoom(id: string, patch: Partial<RoomInput>) {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }

  function addRoom() {
    setRooms(prev => [...prev, { id: `room-${Date.now()}`, type: "bedroom", name: "New Room", direction: "" }]);
  }

  function removeRoom(id: string) {
    setRooms(prev => prev.filter(r => r.id !== id));
  }

  async function runAnalysis() {
    setLoading(true);
    setErrorText("");
    setResult(null);
    try {
      if (!facing) throw new Error("Please select property facing direction.");
      if (activeRooms.length === 0) throw new Error("Please add at least one room with direction.");
      const measurements = lengthHasta && widthHasta
        ? { shape, lengthHasta: Number(lengthHasta), widthHasta: Number(widthHasta) }
        : { shape };
      const payload = {
        propertyType, facing, rooms: activeRooms,
        kundli: kundli || undefined,
        features: { northOpen, eastOpen, southWestHeavy, brahmasthanOpen },
        measurements,
        options: { includeLalKitab, includeConstruction },
      };
      const response = await fetch("/api/vastu/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `API failed with status ${response.status}`);
      }
      setResult((await response.json()) as VastuCalculatorResult);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function downloadVastuReport() {
    if (!result) return;
    setPdfLoading(true);
    try {
      await downloadVastuPDFReport(result, {
        ownerName: kundli ? `User (${kundli.source.split(":")[1] || "chart"})` : undefined,
        type: propertyType,
        facing: facing || undefined,
        shape,
        rooms: activeRooms.map(r => ({ name: r.name, type: r.type, direction: r.direction })),
      });
    } catch (err) {
      console.error("Vastu PDF error:", err);
    } finally {
      setPdfLoading(false);
    }
  }

  const scores       = result?.scores       || {};
  const strengths    = result?.strengths    || [];
  const defects      = result?.defects      || [];
  const recommendations = result?.recommendations || [];

  /* ── Render ─────────────────────────────────────────────────── */
  if (chartLoading) {
    return (
      <EngineShell>
        <EngineStateCard title="AstroLife Vastu Shastra Intelligence" loading loadingText="Loading your chart data…" />
      </EngineShell>
    );
  }

  return (
    <EngineShell>
      <EngineHeader
        eyebrow="Vastu Engine"
        title="AstroLife Vastu Shastra Intelligence"
        subtitle="Kundli Vastu for chart-based zone intelligence. Property Vastu for practical room, direction and remedy analysis."
        icon="🏠"
        metrics={completeAnalysis ? [
          { label: "Overall Score", value: completeAnalysis.overallScore },
          { label: "Strong Zones", value: completeAnalysis.strongZones.length, tone: "green" },
          { label: "Weak Zones",   value: completeAnalysis.weakZones.length,   tone: "red"   },
          { label: "Transits",     value: completeAnalysis.transitAlerts.length },
        ] : []}
      />

      {/* Mode switcher */}
      <div className="tabs">
        <button className={`tab ${analysisMode === "kundli" ? "active" : ""}`} onClick={() => setAnalysisMode("kundli")}>
          ✦ Kundli Vastu
        </button>
        <button className={`tab ${analysisMode === "property" ? "active" : ""}`} onClick={() => setAnalysisMode("property")}>
          🏗 Property Vastu
        </button>
      </div>

      {/* ── KUNDLI VASTU ── */}
      {analysisMode === "kundli" && <CompleteAnalysisPanel result={completeAnalysis} />}

      {/* ── PROPERTY VASTU ── */}
      {analysisMode === "property" && (
        <>
          {/* Chart link status */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <div className="card-tag">Chart Link</div>
                <div style={{ fontSize: 13, color: "#8f86ad", marginTop: 4, lineHeight: 1.6 }}>{chartLoadMessage}</div>
              </div>
              <button
                onClick={refreshChart}
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.12)", background: "transparent",
                  color: "#c8c0a8", fontSize: 13, cursor: "pointer", fontFamily: "Outfit,sans-serif",
                }}
              >
                Refresh Chart
              </button>
            </div>
            {kundli && (
              <div className="grid-3" style={{ marginTop: 14 }}>
                {[
                  { label: "Mahadasha", value: kundli.currentMahadasha || "Not detected" },
                  { label: "Antardasha", value: kundli.currentAntardasha || "Not detected" },
                  { label: "Weak Planets", value: kundli.weakPlanets.length ? kundli.weakPlanets.join(", ") : "None" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px" }}>
                    <div className="card-tag">{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d0", marginTop: 4 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property inputs */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title serif">Property Details</div>
            <div className="grid-3" style={{ marginTop: 16, marginBottom: 16 }}>
              {[
                {
                  label: "Property Type", value: propertyType,
                  onChange: (v: string) => setPropertyType(v),
                  options: [
                    { value: "home", label: "Home" },{ value: "flat", label: "Flat / Apartment" },
                    { value: "office", label: "Office" },{ value: "shop", label: "Shop" },
                    { value: "factory", label: "Factory" },{ value: "plot", label: "Plot" },
                  ],
                },
                {
                  label: "Facing Direction", value: facing,
                  onChange: (v: string) => setFacing(v as Direction),
                  options: directionOptions.map(o => ({ value: o.value, label: o.label })),
                },
                {
                  label: "Plot Shape", value: shape,
                  onChange: (v: string) => setShape(v),
                  options: [
                    { value: "rectangle", label: "Rectangle" },{ value: "square", label: "Square" },
                    { value: "irregular", label: "Irregular" },{ value: "triangular", label: "Triangular" },
                    { value: "cut", label: "Cut Plot" },
                  ],
                },
              ].map(field => (
                <label key={field.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#605890" }}>{field.label}</span>
                  <select
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    style={{
                      borderRadius: 12, border: "1px solid #1c1840",
                      background: "rgba(0,0,0,0.3)", color: "#f0e8d0",
                      padding: "10px 14px", fontSize: 13, outline: "none", width: "100%",
                    }}
                  >
                    {field.options.map(o => (
                      <option key={o.value || "blank"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 16 }}>
              {[
                { label: "Length (Hasta units, optional)", value: lengthHasta, onChange: setLengthHasta, placeholder: "e.g. 15" },
                { label: "Width (Hasta units, optional)", value: widthHasta, onChange: setWidthHasta, placeholder: "e.g. 7" },
              ].map(field => (
                <label key={field.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#605890" }}>{field.label}</span>
                  <input
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    inputMode="decimal"
                    style={{
                      borderRadius: 12, border: "1px solid #1c1840",
                      background: "rgba(0,0,0,0.3)", color: "#f0e8d0",
                      padding: "10px 14px", fontSize: 13, outline: "none", width: "100%",
                    }}
                  />
                </label>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
              {[
                { label: "North open / light", value: northOpen, onChange: setNorthOpen },
                { label: "East open / light", value: eastOpen, onChange: setEastOpen },
                { label: "South-West heavy / stable", value: southWestHeavy, onChange: setSouthWestHeavy },
                { label: "Brahmasthan open", value: brahmasthanOpen, onChange: setBrahmasthanOpen },
                { label: "Include Lal Kitab Vastu", value: includeLalKitab, onChange: setIncludeLalKitab },
                { label: "Include Construction Rules", value: includeConstruction, onChange: setIncludeConstruction },
              ].map(item => (
                <label
                  key={item.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    borderRadius: 12, border: "1px solid #1c1840",
                    background: "rgba(0,0,0,0.2)", padding: "12px 14px",
                    fontSize: 13, color: "#c8c0a8", cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={e => item.onChange(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#c8a030" }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Room directions */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="card-title serif" style={{ marginBottom: 0 }}>Room Directions</div>
              <button
                onClick={addRoom}
                style={{
                  padding: "8px 16px", borderRadius: 20,
                  border: "1px solid rgba(200,160,48,0.3)",
                  background: "rgba(200,160,48,0.06)", color: "#c8a030",
                  fontSize: 13, cursor: "pointer", fontFamily: "Outfit,sans-serif",
                }}
              >
                + Add Room
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rooms.map(room => (
                <div
                  key={room.id}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 10, borderRadius: 12, border: "1px solid #1c1840",
                    background: "rgba(0,0,0,0.2)", padding: 12,
                  }}
                >
                  <input
                    value={room.name}
                    onChange={e => updateRoom(room.id, { name: e.target.value })}
                    placeholder="Room name"
                    style={{
                      borderRadius: 10, border: "1px solid #1c1840",
                      background: "rgba(0,0,0,0.3)", color: "#f0e8d0",
                      padding: "8px 12px", fontSize: 13, outline: "none",
                    }}
                  />
                  <select
                    value={room.type}
                    onChange={e => updateRoom(room.id, { type: e.target.value })}
                    style={{
                      borderRadius: 10, border: "1px solid #1c1840",
                      background: "rgba(0,0,0,0.3)", color: "#f0e8d0",
                      padding: "8px 12px", fontSize: 13, outline: "none",
                    }}
                  >
                    {roomTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select
                    value={room.direction}
                    onChange={e => updateRoom(room.id, { direction: e.target.value as Direction })}
                    style={{
                      borderRadius: 10, border: "1px solid #1c1840",
                      background: "rgba(0,0,0,0.3)", color: "#f0e8d0",
                      padding: "8px 12px", fontSize: 13, outline: "none",
                    }}
                  >
                    {directionOptions.map(o => <option key={`${room.id}-${o.value || "blank"}`} value={o.value}>{o.label}</option>)}
                  </select>
                  <button
                    onClick={() => removeRoom(room.id)}
                    style={{
                      borderRadius: 10, border: "1px solid rgba(239,68,68,0.25)",
                      background: "transparent", color: "#f87171",
                      padding: "8px 14px", fontSize: 13, cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={runAnalysis}
              disabled={loading}
              style={{
                marginTop: 20, padding: "12px 28px", borderRadius: 24,
                background: "linear-gradient(135deg,#c8a030,#a07820)",
                color: "#060410", border: "none", fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                fontFamily: "Outfit,sans-serif",
              }}
            >
              {loading ? "⟳ Analyzing…" : "Run Vastu Analysis →"}
            </button>

            {errorText && (
              <div style={{
                marginTop: 14, borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.08)", padding: "12px 16px",
                fontSize: 13, color: "#f87171",
              }}>
                {errorText}
              </div>
            )}
          </div>

          {/* Loading state while API runs */}
          {loading && <EngineStateCard title="Vastu Analysis" loading loadingText="Running your Vastu analysis…" />}

          {/* ── Calculator Results ── */}
          {result && !loading && (
            <>
              {/* Summary + download */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <EngineSectionTitle eyebrow={`Engine ${result.engineVersion || ""}`} title="Analysis Summary" />
                    <p style={{ fontSize: 14, color: "#c8c0a8", lineHeight: 1.75, marginTop: 8 }}>
                      {result.summary || "Analysis complete."}
                    </p>
                  </div>
                  <button
                    onClick={downloadVastuReport}
                    disabled={pdfLoading}
                    style={{
                      flexShrink: 0, padding: "10px 22px", borderRadius: 24,
                      background: "linear-gradient(135deg,#c8a030,#a07820)",
                      color: "#060410", border: "none", fontSize: 13, fontWeight: 700,
                      cursor: pdfLoading ? "not-allowed" : "pointer", opacity: pdfLoading ? 0.6 : 1,
                      fontFamily: "Outfit,sans-serif",
                    }}
                  >
                    {pdfLoading ? "Generating…" : "PDF Report ↓"}
                  </button>
                </div>
              </div>

              {/* Score grid */}
              {Object.keys(scores).length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
                  {Object.entries(scores).map(([key, value]) => (
                    <div key={key} className="idx-card" style={{ borderColor: "rgba(200,160,48,0.15)" }}>
                      <div className="idx-n" style={{ color: zoneScoreColor(Number(value || 0)) }}>{String(value ?? 0)}</div>
                      <div className="idx-l">{key}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths + Defects */}
              {(strengths.length > 0 || defects.length > 0) && (
                <div className="grid-2" style={{ marginBottom: 20 }}>
                  <div className="card" style={{ borderColor: "rgba(34,197,94,0.2)" }}>
                    <div className="card-title serif" style={{ color: "#4ade80" }}>✅ Strengths ({strengths.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {strengths.length === 0 && <p style={{ fontSize: 13, color: "#605890" }}>No major strengths detected.</p>}
                      {strengths.map((item, i) => (
                        <div key={i} className="card" style={{ padding: 14 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 13, color: "#8f86ad", lineHeight: 1.6, marginBottom: 6 }}>{item.explanation}</div>
                          <div style={{ fontSize: 11, color: "#4ade80" }}>Score: {item.score}/10</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
                    <div className="card-title serif" style={{ color: "#f87171" }}>⚠️ Defects ({defects.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {defects.length === 0 && <p style={{ fontSize: 13, color: "#605890" }}>No major defects detected.</p>}
                      {defects.map((item, i) => {
                        const sc = severityColor(item.severity);
                        return (
                          <div key={i} className="card" style={{ padding: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d0" }}>{item.title}</div>
                              <span className="badge" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.text}33`, flexShrink: 0 }}>{item.severity}/10</span>
                            </div>
                            <div style={{ fontSize: 13, color: "#8f86ad", lineHeight: 1.6, marginBottom: item.remedies.length > 0 ? 8 : 0 }}>{item.explanation}</div>
                            {item.remedies.length > 0 && (
                              <ul style={{ paddingLeft: 18, margin: 0 }}>
                                {item.remedies.map((r, ri) => <li key={ri} style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.7 }}>{r}</li>)}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title serif">✦ Recommendations</div>
                  <div className="grid-2">
                    {recommendations.map((item, i) => {
                      const pc = priorityColor(item.priority);
                      return (
                        <div key={i} className="card" style={{ padding: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d0" }}>{item.title}</div>
                            <span className="badge" style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.text}33`, flexShrink: 0, textTransform: "capitalize" }}>{item.priority}</span>
                          </div>
                          <div className="card-tag" style={{ marginBottom: 4 }}>{item.system}</div>
                          {item.requiresKundli && <div style={{ fontSize: 11, color: "#c8a030", marginBottom: 6 }}>Kundli validation required</div>}
                          <ul style={{ paddingLeft: 18, margin: 0 }}>
                            {item.steps.map((step, si) => <li key={si} style={{ fontSize: 12, color: "#8f86ad", lineHeight: 1.7 }}>{step}</li>)}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 30/60/90 day correction plan */}
              {result.correctionPlan && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title serif">📅 30 / 60 / 90 Day Correction Plan</div>
                  <p style={{ fontSize: 13, color: "#605890", marginBottom: 16 }}>
                    Phased action plan — start with physical corrections, not symbolic remedies.
                  </p>
                  <div className="grid-3">
                    {[
                      { label: "First 30 Days",  color: "#f87171",  borderColor: "rgba(239,68,68,0.2)",   items: result.correctionPlan.thirtyDay },
                      { label: "Days 31–60",     color: "#fbbf24",  borderColor: "rgba(234,179,8,0.2)",   items: result.correctionPlan.sixtyDay },
                      { label: "Days 61–90",     color: "#4ade80",  borderColor: "rgba(34,197,94,0.2)",   items: result.correctionPlan.ninetyDay },
                    ].map(col => (
                      <div key={col.label} className="card" style={{ padding: 16, borderColor: col.borderColor }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: col.color, marginBottom: 12 }}>{col.label}</div>
                        <ol style={{ paddingLeft: 18, margin: 0 }}>
                          {col.items.map((item, i) => (
                            <li key={i} style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mind + Makan energy loop */}
              {result.mindMakan && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title serif">🧘 Mind + Makan Energy Loop</div>
                  <p style={{ fontSize: 13, color: "#605890", marginBottom: 16 }}>
                    House affects mind. Mind affects house. Five layers of correction.
                  </p>
                  <div className="tabs">
                    {(["physical","behavioural","routine","emotional","spiritual"] as const).map(tab => (
                      <button key={tab} className={`tab ${mindMakanTab === tab ? "active" : ""}`} onClick={() => setMindMakanTab(tab)} style={{ textTransform: "capitalize" }}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                    {(result.mindMakan[mindMakanTab] || []).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 10, border: "1px solid #1c1840", background: "rgba(0,0,0,0.18)", padding: 12 }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(200,160,48,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#c8a030", flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vastu Purusha health map */}
              {result.vastuPurushaHealth && result.vastuPurushaHealth.observations.length > 1 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title serif">🙏 Vastu Purusha — Symbolic Health Map</div>
                  <p style={{ fontSize: 13, color: "#605890", marginBottom: 12 }}>
                    Symbolic mapping of zones to body areas. Use as guidance, not medical advice.
                  </p>
                  {result.vastuPurushaHealth.affectedZones.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 12, color: "#605890" }}>Affected zones:</span>
                      {result.vastuPurushaHealth.affectedZones.map(zone => (
                        <span key={zone} className="badge badge-gold">{zone}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.vastuPurushaHealth.observations.map((obs, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, borderRadius: 10, border: "1px solid #1c1840", background: "rgba(0,0,0,0.18)", padding: 12, fontSize: 13, color: "#8f86ad" }}>
                        <span style={{ color: "#c8a030", flexShrink: 0 }}>→</span>
                        {obs}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kundli-based zone analysis (from calculator API) */}
              {result.zoneAnalysis ? (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    <EngineSectionTitle
                      eyebrow="Kundli-Based"
                      title="16-Zone MahaVastu"
                      subtitle={`Overall zone score: ${result.zoneAnalysis.overallScore}/92`}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="badge badge-green">{result.zoneAnalysis.strongZones.length} Strong</span>
                      <span className="badge badge-red">{result.zoneAnalysis.weakZones.length} Weak</span>
                    </div>
                  </div>

                  <div className="tabs">
                    {(["all","strong","weak","psych","transit"] as const).map(tab => (
                      <button key={tab} className={`tab ${activeZoneTab === tab ? "active" : ""}`} onClick={() => setActiveZoneTab(tab)}>
                        {tab === "psych" ? "Psych Bridge" : tab === "transit" ? "Transit Alerts" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {(activeZoneTab === "all" || activeZoneTab === "strong" || activeZoneTab === "weak") && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginTop: 16 }}>
                      {(activeZoneTab === "all" ? result.zoneAnalysis.zones
                        : activeZoneTab === "strong" ? result.zoneAnalysis.strongZones
                        : result.zoneAnalysis.weakZones
                      ).map(zone => (
                        <div
                          key={zone.dir}
                          className="card"
                          style={{
                            padding: 14,
                            borderColor:
                              zone.status === "Strong" ? "rgba(34,197,94,0.25)" :
                              zone.status === "Weak"   ? "rgba(239,68,68,0.25)" : undefined,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span className="card-tag">{zone.dir}</span>
                            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: zoneScoreColor(zone.score) }}>{zone.score}</span>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d0", marginBottom: 2 }}>{zone.name}</div>
                          <div style={{ fontSize: 11, color: "#605890", marginBottom: 6 }}>{zone.planet} · {zone.status}</div>
                          <div style={{ fontSize: 11, color: "#8f86ad", marginBottom: 6 }}>{zone.domain}</div>
                          {zone.planets.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                              {zone.planets.map(p => <span key={p} className="planet-pill">{p}</span>)}
                            </div>
                          )}
                          {zone.hasDosha && <div style={{ fontSize: 11, color: "#f87171" }}>Dosha present</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeZoneTab === "psych" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                      <div className="card-tag" style={{ marginBottom: 4 }}>Psychology Bridge — Planet-Zone Insights</div>
                      {result.zoneAnalysis.psychBridge.map((insight, i) => (
                        <div key={i} className="card" style={{ padding: 14, fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>{insight}</div>
                      ))}
                    </div>
                  )}

                  {activeZoneTab === "transit" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                      <div className="card-tag" style={{ marginBottom: 4 }}>Transit Alerts — Planet Zone Effects</div>
                      {result.zoneAnalysis.transitAlerts.length === 0 && (
                        <p style={{ fontSize: 13, color: "#605890" }}>No significant transit alerts for this chart.</p>
                      )}
                      {result.zoneAnalysis.transitAlerts.map((alert, i) => (
                        <div
                          key={i}
                          className="card"
                          style={{ padding: 14, borderColor: alert.positive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, color: alert.positive ? "#4ade80" : "#f87171" }}>{alert.planet}</span>
                            <span style={{ color: "#605890" }}>→</span>
                            <span style={{ color: "#c8c0a8" }}>{alert.zone}</span>
                            <span className={`badge ${alert.positive ? "badge-green" : "badge-red"}`} style={{ marginLeft: "auto" }}>
                              {alert.positive ? "Benefic" : "Malefic"}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: "#8f86ad", lineHeight: 1.6, marginBottom: 4 }}>{alert.effect}</p>
                          <p style={{ fontSize: 12, color: "#c8a030" }}>↺ Remedy: {alert.remedy}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="card">
                  <div className="card-title serif">16-Zone MahaVastu Analysis</div>
                  <p style={{ fontSize: 13, color: "#605890", lineHeight: 1.7 }}>
                    This section requires your Kundli with full planet house positions. Generate your Kundli,
                    then return here and click <strong>Refresh Chart</strong>. Planet positions will activate the zone analysis automatically.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </EngineShell>
  );
}
