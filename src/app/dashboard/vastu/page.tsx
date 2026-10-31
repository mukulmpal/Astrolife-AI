"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EngineEmptyState } from "@/components/engine/engine-intro";
import { PremiumFeature } from "@/components/premium-feature";
import { downloadVastuPDFReport } from "@/lib/report-generator";
import { calculateVastu, type VastuResult as CompleteVastuResult } from "@/lib/astro-engine/vastu";
import { useUserChart, buildChart, listSavedCharts, selectSavedChart, type SavedChartSummary, type BirthDetails } from "@/lib/user-chart";
import { EngineShell, EngineHeader, EngineSectionTitle } from "@/components/engine/EngineShell";
import { EngineStateCard } from "@/components/engine-state-card";
import { AstroVastuHitRadarView } from "@/components/vastu/AstroVastuHitRadarView";
import {
  calculatePlotDualGridDecomposition,
  type DualGridAuditResult,
} from "@/lib/astro-engine/plot-geometry-dual-grid";
import {
  auditKitchenMicroGrid,
  auditEmergencyMedicalVastuAlerts,
  auditWallClockZone,
  type EmergencyMedicalVastuAlert,
  type KitchenMicroGridAuditResult,
  type WallClockZoneAudit,
} from "@/lib/astro-engine/micro-vastu-auditor";
import "@/app/dashboard/shared.css";

const DEMO_VASTU_BIRTH: BirthDetails = {
  name: "Sample Chart (Demo)",
  dob: "1995-07-04",
  tob: "12:30",
  city: "Delhi",
  tz: 5.5,
};

export const VASTU_LAGNA_PRESETS: Array<{
  signNum: number;
  signEn: string;
  signHi: string;
  icon: string;
  birth: BirthDetails;
}> = [
  { signNum: 1, signEn: "Aries", signHi: "मेष", icon: "♈", birth: { name: "मेष लग्न चक्र (Aries)", dob: "1995-04-15", tob: "06:30", city: "Delhi", tz: 5.5 } },
  { signNum: 2, signEn: "Taurus", signHi: "वृषभ", icon: "♉", birth: { name: "वृषभ लग्न चक्र (Taurus)", dob: "1995-04-15", tob: "08:15", city: "Delhi", tz: 5.5 } },
  { signNum: 3, signEn: "Gemini", signHi: "मिथुन", icon: "♊", birth: { name: "मिथुन लग्न चक्र (Gemini)", dob: "1995-04-15", tob: "10:15", city: "Delhi", tz: 5.5 } },
  { signNum: 4, signEn: "Cancer", signHi: "कर्क", icon: "♋", birth: { name: "कर्क लग्न चक्र (Cancer)", dob: "1995-04-15", tob: "12:30", city: "Delhi", tz: 5.5 } },
  { signNum: 5, signEn: "Leo", signHi: "सिंह", icon: "♌", birth: { name: "सिंह लग्न चक्र (Leo)", dob: "1995-04-15", tob: "14:45", city: "Delhi", tz: 5.5 } },
  { signNum: 6, signEn: "Virgo", signHi: "कन्या", icon: "♍", birth: { name: "कन्या लग्न चक्र (Virgo)", dob: "1995-07-04", tob: "12:30", city: "Delhi", tz: 5.5 } },
  { signNum: 7, signEn: "Libra", signHi: "तुला", icon: "♎", birth: { name: "तुला लग्न चक्र (Libra)", dob: "1995-04-15", tob: "19:15", city: "Delhi", tz: 5.5 } },
  { signNum: 8, signEn: "Scorpio", signHi: "वृश्चिक", icon: "♏", birth: { name: "वृश्चिक लग्न चक्र (Scorpio)", dob: "1995-04-15", tob: "21:30", city: "Delhi", tz: 5.5 } },
  { signNum: 9, signEn: "Sagittarius", signHi: "धनु", icon: "♐", birth: { name: "धनु लग्न चक्र (Sagittarius)", dob: "1995-04-15", tob: "23:45", city: "Delhi", tz: 5.5 } },
  { signNum: 10, signEn: "Capricorn", signHi: "मकर", icon: "♑", birth: { name: "मकर लग्न चक्र (Capricorn)", dob: "1995-04-16", tob: "01:45", city: "Delhi", tz: 5.5 } },
  { signNum: 11, signEn: "Aquarius", signHi: "कुंभ", icon: "♒", birth: { name: "कुंभ लग्न चक्र (Aquarius)", dob: "1995-04-16", tob: "03:30", city: "Delhi", tz: 5.5 } },
  { signNum: 12, signEn: "Pisces", signHi: "मीन", icon: "♓", birth: { name: "मीन लग्न चक्र (Pisces)", dob: "1995-04-16", tob: "05:00", city: "Delhi", tz: 5.5 } },
];

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
  return { bg: "rgba(96,88,144,0.15)", text: "#6B635B" };
}

type RoomPlacementResult = {
  score: number;
  status: "Excellent" | "Good" | "Needs Remedy" | "High Caution";
  color: string;
  verdict: string;
  recommendation: string;
};

const roomDirectionRules: Record<string, {
  ideal: Direction[];
  good: Direction[];
  avoid: Direction[];
  remedy: string;
}> = {
  main_entrance: { ideal: ["N", "NE", "E"], good: ["NW"], avoid: ["SW", "S"], remedy: "Keep entrance clean, bright and obstruction-free; add warm lighting and avoid clutter." },
  kitchen: { ideal: ["SE"], good: ["NW", "E"], avoid: ["NE", "SW", "CENTER"], remedy: "Use red/copper accents near the cooking zone and keep water/fire separation clear." },
  master_bedroom: { ideal: ["SW"], good: ["S", "W"], avoid: ["NE", "CENTER"], remedy: "Use heavier furniture in South-West and keep sleeping head toward South or East." },
  bedroom: { ideal: ["SW", "S", "W"], good: ["NW"], avoid: ["NE", "CENTER"], remedy: "Stabilize the room with calm colors, clean storage and minimal mirror exposure." },
  toilet: { ideal: ["NW", "W"], good: ["S"], avoid: ["NE", "CENTER", "SW"], remedy: "Keep door closed, ventilation strong and use salt cleansing weekly." },
  bathroom: { ideal: ["NW", "W"], good: ["E"], avoid: ["NE", "CENTER", "SW"], remedy: "Keep drainage clean, dry surfaces quickly and avoid water stagnation." },
  pooja_room: { ideal: ["NE"], good: ["E", "N"], avoid: ["S", "SW", "CENTER"], remedy: "Keep the altar light, clean and elevated; avoid storage around sacred space." },
  study_room: { ideal: ["NE", "E"], good: ["N"], avoid: ["SW", "CENTER"], remedy: "Face East/North while studying and keep books organized in the West/South wall." },
  staircase: { ideal: ["S", "SW", "W"], good: ["NW"], avoid: ["NE", "CENTER"], remedy: "Keep staircase area heavy, clean and well-lit; avoid storage under sacred zones." },
  underground_water: { ideal: ["NE", "N"], good: ["E"], avoid: ["SW", "S"], remedy: "If not movable, keep South-West heavier and North-East cleaner/lighter." },
  overhead_tank: { ideal: ["SW", "W"], good: ["S"], avoid: ["NE", "CENTER"], remedy: "Balance with heavier South-West and avoid leakage or dampness." },
  septic_tank: { ideal: ["NW", "W"], good: ["S"], avoid: ["NE", "CENTER", "SW"], remedy: "Maintain hygiene, ventilation and avoid symbolic activation of the affected zone." },
  office_cabin: { ideal: ["SW", "W"], good: ["S"], avoid: ["NE", "CENTER"], remedy: "Sit facing North/East, keep back support solid and avoid clutter behind the chair." },
  locker: { ideal: ["SW", "S"], good: ["W"], avoid: ["NE", "CENTER"], remedy: "Place locker so it opens toward North/East and keep financial papers organized." },
};

function scoreRoomPlacement(room: { type: string; name: string; direction: Direction }): RoomPlacementResult {
  const label = roomTypeOptions.find(o => o.value === room.type)?.label || room.name;
  const direction = directionOptions.find(o => o.value === room.direction)?.label || room.direction;
  const rule = roomDirectionRules[room.type];
  if (!rule) {
    return {
      score: 62,
      status: "Good",
      color: "#fbbf24",
      verdict: `${label} in ${direction} is acceptable, but needs manual review.`,
      recommendation: "Use the zone score and chart-linked recommendations for final correction.",
    };
  }
  if (rule.ideal.includes(room.direction)) {
    return {
      score: 92,
      status: "Excellent",
      color: "#4ade80",
      verdict: `${label} in ${direction} is excellent.`,
      recommendation: "Preserve this placement and keep the zone clean, functional and uncluttered.",
    };
  }
  if (rule.good.includes(room.direction)) {
    return {
      score: 76,
      status: "Good",
      color: "#c8a030",
      verdict: `${label} in ${direction} is workable with supportive balancing.`,
      recommendation: rule.remedy,
    };
  }
  if (rule.avoid.includes(room.direction)) {
    return {
      score: 36,
      status: "High Caution",
      color: "#f87171",
      verdict: `${label} in ${direction} needs remedy.`,
      recommendation: rule.remedy,
    };
  }
  return {
    score: 58,
    status: "Needs Remedy",
    color: "#fb923c",
    verdict: `${label} in ${direction} is mixed and should be balanced.`,
    recommendation: rule.remedy,
  };
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
      <EngineSectionTitle
        eyebrow="MahaVastu · 16 Zones"
        title="Zone Analysis"
        subtitle="Chart planets mapped to Vastu zones — strengths, weak spots, psychology bridge, transit alerts."
      />

      {/* Zone sub-tabs */}
      <div className="tabs" style={{ marginTop: 12, marginBottom: 18 }}>
        {(["all","strong","weak","psych","transit","rooms"] as const).map(tab => (
          <button key={tab} className={`tab ${zoneTab === tab ? "active" : ""}`} onClick={() => setZoneTab(tab)}>
            {tab === "psych" ? "Psych Bridge" : tab === "transit" ? "Transit Alerts" : tab === "rooms" ? "Room Guide" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Zone grid */}
      {(zoneTab === "all" || zoneTab === "strong" || zoneTab === "weak") && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
          {zones.map((zone) => (
            <div
              key={zone.dir}
              className="card"
              style={{
                padding: "20px 22px",
                borderRadius: 16,
                borderColor:
                  zone.status === "Strong" ? "rgba(34,197,94,0.25)" :
                  zone.status === "Weak"   ? "rgba(239,68,68,0.25)" :
                  "rgba(184,134,11,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="card-tag">{zone.dir}</span>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700, color: zoneScoreColor(zone.score) }}>
                  {zone.score}
                </span>
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                {zone.name}
              </div>
              <div style={{ fontSize: 12.5, color: "#6B635B", marginBottom: 6 }}>
                {zone.planet} · {"element" in zone ? (zone as {element?: string}).element : ""}
              </div>
              <div style={{ fontSize: 13, color: "#4A4238", marginBottom: 10, lineHeight: 1.5 }}>{zone.domain}</div>
              {zone.planets.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {zone.planets.map(p => <span key={p} className="planet-pill" style={{ padding: "3px 8px", fontSize: "11px" }}>{p}</span>)}
                </div>
              )}
              <div style={{ fontSize: 12.5, color: "#6B635B" }}>Ideal: <strong>{zone.roomIdeal}</strong></div>
              <div style={{ fontSize: 12.5, color: "#8A6008", marginTop: 6, fontWeight: 500, lineHeight: 1.5 }}>↺ {zone.remedy}</div>
            </div>
          ))}
        </div>
      )}

      {/* Psych bridge */}
      {zoneTab === "psych" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.psychBridge.map((item, i) => (
            <div key={i} className="card" style={{ padding: 16, fontSize: 13, color: "#4A4238", lineHeight: 1.7 }}>
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Transit alerts */}
      {zoneTab === "transit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.transitAlerts.length === 0 && (
            <p style={{ fontSize: 13, color: "#6B635B" }}>No active transit alerts.</p>
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
                <span style={{ color: "#6B635B" }}>→</span>
                <span style={{ color: "#4A4238" }}>{alert.zone}</span>
                <span className="badge-gold" style={{ marginLeft: "auto" }}>{alert.domain}</span>
              </div>
              <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.65, marginBottom: 6 }}>{alert.effect}</p>
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
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>
                {room.room}
              </div>
              <div style={{ fontSize: 13, color: "#c8a030", marginBottom: 6 }}>{room.idealDir}</div>
              <div style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.6 }}>{room.reason}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function VastuDashboardPage() {
  const { chart, loading: chartLoading, hasUserChart } = useUserChart();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab") || undefined;
  const [kundli, setKundli] = useState<NormalizedKundli | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"hitRadar" | "kundli" | "property">("hitRadar");
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

  // Plot Geometry & Dual Grid State
  const [plotLengthFeet, setPlotLengthFeet] = useState<number>(50);
  const [plotWidthFeet, setPlotWidthFeet] = useState<number>(35);
  const [cutLengthFeet, setCutLengthFeet] = useState<number>(20);
  const [cutWidthFeet, setCutWidthFeet] = useState<number>(15);
  const [cutLocation, setCutLocation] = useState<"NE" | "NW" | "SE" | "SW">("NE");
  const [showDualGridControls, setShowDualGridControls] = useState<boolean>(false);

  // Kitchen Micro-Grid State
  const [stoveZoneKitchen, setStoveZoneKitchen] = useState<"SE" | "SOUTH" | "EAST" | "NORTH" | "NE" | "NW" | "SW">("SE");
  const [sinkZoneKitchen, setSinkZoneKitchen] = useState<"NORTH" | "NE" | "NW" | "SE" | "SOUTH" | "EAST" | "SW">("NORTH");
  const [sameCounter, setSameCounter] = useState<boolean>(true);
  const [stoveSinkDist, setStoveSinkDist] = useState<number>(3);

  // Wall Clock Zone State
  const [wallClockZone, setWallClockZone] = useState<string>("N");

  // Dynamic Lagna Switcher & Custom Chart State
  const [selectedPresetLagna, setSelectedPresetLagna] = useState<number | null>(null);
  const [customBirth, setCustomBirth] = useState<BirthDetails | null>(null);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>("");
  const [customDob, setCustomDob] = useState<string>("1995-01-01");
  const [customTob, setCustomTob] = useState<string>("12:00");
  const [customCity, setCustomCity] = useState<string>("Delhi");
  const [savedCharts, setSavedCharts] = useState<SavedChartSummary[]>([]);

  useEffect(() => {
    listSavedCharts().then(setSavedCharts).catch(() => {});
  }, []);

  const isDemo = (!hasUserChart || !chart?.planets || Object.keys(chart.planets).length === 0) && selectedPresetLagna === null && !customBirth;
  
  const effectiveChart = useMemo(() => {
    if (selectedPresetLagna !== null) {
      const preset = VASTU_LAGNA_PRESETS.find(p => p.signNum === selectedPresetLagna);
      if (preset) return buildChart(preset.birth);
    }
    if (customBirth) {
      return buildChart(customBirth);
    }
    if (!isDemo && chart && chart.planets && Object.keys(chart.planets).length > 0) {
      return chart;
    }
    return buildChart(DEMO_VASTU_BIRTH);
  }, [selectedPresetLagna, customBirth, isDemo, chart]);

  const completeAnalysis = useMemo(() => {
    if (!effectiveChart?.planets) return null;
    return calculateVastu(effectiveChart.planets);
  }, [effectiveChart]);

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
  const roomPlacementScorecard = useMemo(() => {
    return activeRooms.map(room => ({
      ...room,
      placement: scoreRoomPlacement(room),
    }));
  }, [activeRooms]);
  const roomPlacementOverall = roomPlacementScorecard.length
    ? Math.round(roomPlacementScorecard.reduce((sum, room) => sum + room.placement.score, 0) / roomPlacementScorecard.length)
    : 0;

  const emergencyMedicalAlerts: EmergencyMedicalVastuAlert[] = useMemo(() => {
    return auditEmergencyMedicalVastuAlerts(rooms.filter(r => r.direction));
  }, [rooms]);

  const dualGridResult: DualGridAuditResult = useMemo(() => {
    return calculatePlotDualGridDecomposition({
      lengthFeet: Number(plotLengthFeet) || 50,
      widthFeet: Number(plotWidthFeet) || 35,
      cutLengthFeet: Number(cutLengthFeet) || 0,
      cutWidthFeet: Number(cutWidthFeet) || 0,
      cutLocation,
      shapeCategory: shape === "cut" ? "l_shape_dual_block" : shape === "irregular" ? "l_shape_dual_block" : shape === "square" ? "regular_square" : "regular_rectangle",
    });
  }, [plotLengthFeet, plotWidthFeet, cutLengthFeet, cutWidthFeet, cutLocation, shape]);

  const kitchenMicroAudit: KitchenMicroGridAuditResult = useMemo(() => {
    return auditKitchenMicroGrid({
      stoveZoneWithinKitchen: stoveZoneKitchen,
      sinkZoneWithinKitchen: sinkZoneKitchen,
      areStoveAndSinkOnSameCounter: sameCounter,
      distanceBetweenStoveAndSinkFeet: Number(stoveSinkDist) || 3,
    });
  }, [stoveZoneKitchen, sinkZoneKitchen, sameCounter, stoveSinkDist]);

  const wallClockAudit: WallClockZoneAudit = useMemo(() => {
    return auditWallClockZone(wallClockZone);
  }, [wallClockZone]);

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
        eyebrow="Astro-Vastu Shastra"
        title="AstroLife Astro-Vastu Intelligence"
        subtitle="Authentic 12-direction spatial radar, Cosmic Friction Radar & locks, 120° protective shifting, and 16-zone MahaVastu."
        icon="🏠"
        metrics={completeAnalysis ? [
          { label: "Overall Score", value: completeAnalysis.overallScore },
          { label: "Strong Zones", value: completeAnalysis.strongZones.length, tone: "green" },
          { label: "Weak Zones",   value: completeAnalysis.weakZones.length,   tone: "red"   },
          { label: "Transits",     value: completeAnalysis.transitAlerts.length },
        ] : [
          { label: "Mode", value: analysisMode === "kundli" ? "Kundli" : analysisMode === "property" ? "Property" : "Hit Radar", tone: "gold" },
          { label: "Rooms", value: rooms.length, tone: "blue" },
          { label: "Chart", value: !isDemo ? "Personal" : "Demo Chart", tone: !isDemo ? "green" : "gold" },
        ]}
      />

      {/* ── INTERACTIVE ASTRO-VASTU KUNDLI SELECTOR & 12-LAGNA SWITCHER ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFDF8, #FAF5EB)",
          border: "1.5px solid rgba(212, 175, 55, 0.45)",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 20,
          boxShadow: "0 4px 16px rgba(184, 134, 11, 0.08)",
        }}
      >
        {/* Top Row: Current Chart Info & Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>🧭</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>
                  {effectiveChart?.name || "जातक जन्म चक्र"}
                </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #B8860B, #8A6008)",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  ♈ लग्न: {effectiveChart?.lagnaRashi || "मेष"}
                </span>
                {effectiveChart?.planets?.Moon && (
                  <span style={{ fontSize: 12, color: "#78350F", background: "#FEF3C7", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                    🌙 चंद्र: {effectiveChart.planets.Moon.sign} ({effectiveChart.planets.Moon.nakshatra || "नक्षत्र"})
                  </span>
                )}
                {effectiveChart?.dashas?.find((d: any) => d.active) && (
                  <span style={{ fontSize: 12, color: "#1E3A8A", background: "#DBEAFE", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                    ⏳ सक्रिय: {effectiveChart.dashas.find((d: any) => d.active)?.planet} महादशा
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: "#6B635B", marginTop: 4 }}>
                100% व्यक्तिगत कुंडली-संचालित: 45 देवता भाव आवंटन, 32 द्वार, कॉस्मिक फ्रिक्शन रडार एवं दैनिक वेशभूषा वास्तु
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {hasUserChart && (selectedPresetLagna !== null || customBirth !== null) && (
              <button
                onClick={() => {
                  setSelectedPresetLagna(null);
                  setCustomBirth(null);
                  setShowCustomForm(false);
                }}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  background: "#16A34A",
                  color: "#FFFFFF",
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                👤 मेरी प्रोफाइल कुंडली
              </button>
            )}

            {savedCharts.length > 0 && (
              <select
                onChange={async (e) => {
                  const chartId = e.target.value;
                  if (!chartId) return;
                  const res = await selectSavedChart(chartId);
                  if (res.chart) {
                    setSelectedPresetLagna(null);
                    setCustomBirth(null);
                    setShowCustomForm(false);
                  }
                }}
                defaultValue=""
                style={{
                  padding: "7px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(184, 134, 11, 0.4)",
                  background: "#FFFFFF",
                  color: "#8A6008",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="" disabled>📁 सेव्ड चार्ट्स ({savedCharts.length})</option>
                {savedCharts.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} ({sc.dob} {sc.city})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setShowCustomForm(prev => !prev)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid rgba(184, 134, 11, 0.4)",
                background: showCustomForm ? "#FEF3C7" : "#FFFFFF",
                color: "#8A6008",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {showCustomForm ? "✕ बंद करें" : "✍️ नई जन्म तिथि जोड़ें"}
            </button>
          </div>
        </div>

        {/* Custom Birth Details Input Form */}
        {showCustomForm && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #FCD34D",
              borderRadius: 10,
              padding: 14,
              marginBottom: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 10,
              alignItems: "end",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#78350F", marginBottom: 3 }}>
                जातक का नाम:
              </label>
              <input
                type="text"
                value={customName}
                placeholder="उदा. राहुल शर्मा"
                onChange={(e) => setCustomName(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#78350F", marginBottom: 3 }}>
                जन्म तिथि (DOB):
              </label>
              <input
                type="date"
                value={customDob}
                onChange={(e) => setCustomDob(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#78350F", marginBottom: 3 }}>
                जन्म समय (TOB):
              </label>
              <input
                type="time"
                value={customTob}
                onChange={(e) => setCustomTob(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#78350F", marginBottom: 3 }}>
                जन्म शहर (City):
              </label>
              <input
                type="text"
                value={customCity}
                placeholder="Delhi"
                onChange={(e) => setCustomCity(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 12 }}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  if (!customDob || !customTob) return;
                  setCustomBirth({
                    name: customName.trim() || "व्यक्तिगत कुंडली",
                    dob: customDob,
                    tob: customTob,
                    city: customCity.trim() || "Delhi",
                    tz: 5.5,
                  });
                  setSelectedPresetLagna(null);
                  setShowCustomForm(false);
                }}
                style={{
                  width: "100%",
                  padding: "7px 12px",
                  borderRadius: 6,
                  background: "#B8860B",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 12.5,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✓ कुंडली लागू करें
              </button>
            </div>
          </div>
        )}

        {/* Bottom Row: 12 Zodiac Lagna Quick Switcher Pills */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#78350F" }}>
              ⚡ 12 लग्न त्वरित परीक्षक (Quick 12-Lagna Switcher — क्लिक करें और देखें कि हर चार्ट पर गणनाएं कैसे 100% बदलती हैं):
            </span>
            <span style={{ fontSize: 11, color: "#8A6008" }}>
              (12 Lagnas Live Demo)
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {VASTU_LAGNA_PRESETS.map((p) => {
              const isActive = (selectedPresetLagna === p.signNum) || 
                (selectedPresetLagna === null && !customBirth && (effectiveChart?.lagnaRashi === p.signEn || effectiveChart?.lagnaRashi === p.signHi));
              return (
                <button
                  key={p.signNum}
                  onClick={() => {
                    setSelectedPresetLagna(p.signNum);
                    setCustomBirth(null);
                    setShowCustomForm(false);
                  }}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: isActive ? 800 : 600,
                    border: isActive ? "1.5px solid #92400E" : "1px solid #E5E7EB",
                    background: isActive
                      ? "linear-gradient(135deg, #B45309, #78350F)"
                      : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#374151",
                    cursor: "pointer",
                    boxShadow: isActive ? "0 2px 8px rgba(180, 83, 9, 0.25)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {p.icon} {p.signHi} ({p.signEn.slice(0, 3)}) {isActive && "✓"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Gate Enforcement */}
      <PremiumFeature feature="Astro-Vastu Shastra (16-Zones)" requiredTier="elite">
        {/* Mode switcher */}
        <div className="tabs">
        <button
          className={`tab ${analysisMode === "hitRadar" ? "active" : ""}`}
          onClick={() => setAnalysisMode("hitRadar")}
          style={
            analysisMode === "hitRadar"
              ? {
                  background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(220, 38, 38, 0.15))",
                  color: "#B8860B",
                  borderColor: "rgba(212, 175, 55, 0.5)",
                  fontWeight: 700,
                }
              : {}
          }
        >
          ⚡ Astro-Vastu Hit Radar (हिट थ्योरी)
        </button>
        <button className={`tab ${analysisMode === "kundli" ? "active" : ""}`} onClick={() => setAnalysisMode("kundli")}>
          ✦ Kundli Vastu
        </button>
        <button className={`tab ${analysisMode === "property" ? "active" : ""}`} onClick={() => setAnalysisMode("property")}>
          🏗 Property Vastu
        </button>
      </div>

      {/* ── ASTRO-VASTU HIT RADAR ── */}
      {analysisMode === "hitRadar" && <AstroVastuHitRadarView chart={effectiveChart} defaultTab={tabParam} />}

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
                <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4, lineHeight: 1.6 }}>{chartLoadMessage}</div>
              </div>
              <button
                onClick={refreshChart}
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.12)", background: "transparent",
                  color: "#4A4238", fontSize: 13, cursor: "pointer", fontFamily: "Outfit,sans-serif",
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
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>{item.value}</div>
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
                  <span style={{ fontSize: 12, color: "#6B635B" }}>{field.label}</span>
                  <select
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    style={{
                      borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.22)",
                      background: "#FAF7F2", color: "#1A1A1A",
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
                  <span style={{ fontSize: 12, color: "#6B635B" }}>{field.label}</span>
                  <input
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    inputMode="decimal"
                    style={{
                      borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.22)",
                      background: "#FAF7F2", color: "#1A1A1A",
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
                    borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.22)",
                    background: "#FAF7F2", padding: "12px 14px",
                    fontSize: 13, color: "#4A4238", cursor: "pointer",
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

          {/* ── EMERGENCY MEDICAL ALERTS FOR NE BURNER / TOILET ── */}
          {emergencyMedicalAlerts.length > 0 && (
            <div
              style={{
                marginBottom: 20,
                background: "linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)",
                border: "2px solid #EF4444",
                borderRadius: 16,
                padding: "20px 22px",
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>🚨</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#991B1B" }}>
                    अत्यंत गंभीर आपातकालीन वास्तु व स्वास्थ्य चेतावनी (CRITICAL EMERGENCY MEDICAL ALERT)
                  </div>
                  <div style={{ fontSize: 12.5, color: "#7F1D1D", marginTop: 2 }}>
                    ईशान कोण (North-East / NNE / ENE) में अग्नि (किचन/गैस स्टोव) अथवा विसर्जन (टॉयलेट) का प्रत्यक्ष प्रभाव।
                  </div>
                </div>
              </div>

              {emergencyMedicalAlerts.map((alert, idx) => (
                <div key={idx} style={{ marginTop: 12, background: "#FFFFFF", borderRadius: 12, border: "1px solid #FECACA", padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "#991B1B" }}>
                      ⚠️ {alert.roomType === "kitchen_stove" ? "ईशान में गैस चूल्हा / रसोई (Fire in Water Zone)" : "ईशान में टॉयलेट / सेप्टिक टैंक (Excreta in Head)"} [{alert.zone} दिशा]
                    </span>
                    <span style={{ padding: "3px 8px", background: "#DC2626", color: "#FFFFFF", fontSize: 11, fontWeight: 800, borderRadius: 6 }}>
                      शून्य-उपाय अस्वीकरण
                    </span>
                  </div>

                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#7F1D1D", marginBottom: 6 }}>
                    स्वास्थ्य एवं जानलेवा जोखिम (Medical Hazards):
                  </div>
                  <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 12, color: "#991B1B", lineHeight: 1.5 }}>
                    {alert.medicalHazardsHi.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>

                  <div style={{ padding: 10, background: "#FEF2F2", borderRadius: 8, border: "1px dashed #EF4444", fontSize: 12, color: "#991B1B", lineHeight: 1.5, marginBottom: 8 }}>
                    {alert.zeroRemedyDisclaimerHi}
                  </div>

                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#15803D" }}>
                    अनिवार्य शास्त्रीय समाधान: {alert.mandatoryActionHi}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PLOT GEOMETRY & L-SHAPE DUAL-GRID CALCULATOR ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <div>
                <div className="card-title serif" style={{ marginBottom: 0 }}>
                  📐 प्लॉट ज्यामिति व एल-शेप ड्यूल-ग्रिड कैलकुलेटर
                </div>
                <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                  कट प्लॉट एवं एल-शेप भूमि के लिए दोहरे ब्रह्मस्थान और खड़ी पीतल की पत्ती (Brass Strip) से ऊर्जा विभाजन।
                </div>
              </div>
              <button
                onClick={() => setShowDualGridControls(!showDualGridControls)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(184, 134, 11, 0.4)",
                  background: showDualGridControls ? "#B8860B" : "transparent",
                  color: showDualGridControls ? "#FFFFFF" : "#8A6008",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {showDualGridControls ? "कैलकुलेटर छुपाएं" : "प्लॉट माप बदलें"}
              </button>
            </div>

            {/* Inputs */}
            {(showDualGridControls || shape === "cut" || shape === "irregular") && (
              <div style={{ background: "#FAF7F2", borderRadius: 12, padding: 16, border: "1px solid rgba(184, 134, 11, 0.2)", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B635B" }}>प्लॉट कुल लंबाई (Feet):</span>
                    <input
                      type="number"
                      value={plotLengthFeet}
                      onChange={(e) => setPlotLengthFeet(Number(e.target.value))}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B635B" }}>प्लॉट कुल चौड़ाई (Feet):</span>
                    <input
                      type="number"
                      value={plotWidthFeet}
                      onChange={(e) => setPlotWidthFeet(Number(e.target.value))}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B635B" }}>कट की लंबाई (Feet):</span>
                    <input
                      type="number"
                      value={cutLengthFeet}
                      onChange={(e) => setCutLengthFeet(Number(e.target.value))}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B635B" }}>कट की चौड़ाई (Feet):</span>
                    <input
                      type="number"
                      value={cutWidthFeet}
                      onChange={(e) => setCutWidthFeet(Number(e.target.value))}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B635B" }}>कट किस दिशा में है:</span>
                    <select
                      value={cutLocation}
                      onChange={(e) => setCutLocation(e.target.value as any)}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                    >
                      <option value="NE">उत्तर-पूर्व (NE)</option>
                      <option value="SE">दक्षिण-पूर्व (SE)</option>
                      <option value="SW">दक्षिण-पश्चिम (SW)</option>
                      <option value="NW">उत्तर-पश्चिम (NW)</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {/* Dual Grid Result Display */}
            <div style={{ background: "#F8FAFC", borderRadius: 14, border: "1.5px solid #E2E8F0", padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                    {dualGridResult.categoryTitleHi}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                    कुल निर्मित भू-क्षेत्र: {dualGridResult.totalAreaSqFt} वर्ग फीट | स्थिति: {dualGridResult.isDualGridRequired ? "ड्यूल ग्रिड (Block A + B) अनिवार्य" : "एकल ग्रिड पर्याप्त"}
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 800,
                    background: dualGridResult.isDualGridRequired ? "#DBEAFE" : "#DCFCE7",
                    color: dualGridResult.isDualGridRequired ? "#1E40AF" : "#15803D",
                  }}
                >
                  {dualGridResult.isDualGridRequired ? "2 स्वतंत्र ब्रह्मस्थान" : "1 मुख्य ब्रह्मस्थान"}
                </span>
              </div>

              {/* Blocks */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 16 }}>
                {dualGridResult.blocks.map((blk) => (
                  <div key={blk.blockId} style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #CBD5E1", padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{blk.titleHi}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0284C7" }}>{blk.areaPercentage}% क्षेत्रफल</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
                      माप: {blk.widthFeet} फीट × {blk.lengthFeet} फीट ({blk.areaSqFt} वर्ग फीट)
                    </div>
                    <div style={{ fontSize: 11.5, color: "#0369A1", marginBottom: 6 }}>
                      📍 <strong>ब्रह्मस्थान:</strong> {blk.brahmasthanCoordinate.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#334155", background: "#F1F5F9", padding: 8, borderRadius: 6 }}>
                      {blk.recommendedUsageHi}
                    </div>
                  </div>
                ))}
              </div>

              {/* Brass Strip Partition Protocol if Dual Grid */}
              {dualGridResult.demarcationStrip && (
                <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>🪙</span>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>
                      भू-ऊर्जा विभाजन: {dualGridResult.demarcationStrip.materialHi}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5, marginBottom: 6 }}>
                    <strong>शास्त्रीय अधिष्ठान:</strong> {dualGridResult.demarcationStrip.shastricRuleHi}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#B45309", background: "#FFFFFF", padding: 8, borderRadius: 6, border: "1px dashed #F59E0B" }}>
                    ⚙️ <strong>स्थापना विधि:</strong> {dualGridResult.demarcationStrip.installationProtocolHi}
                  </div>
                </div>
              )}

              {/* Squaring Guidelines */}
              <div style={{ fontSize: 11.5, color: "#475569" }}>
                <strong>शास्त्रीय ग्रिड नियम:</strong>
                <ul style={{ margin: "4px 0 0 0", paddingLeft: 18, lineHeight: 1.5 }}>
                  {dualGridResult.squaringGuidelinesHi.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── KITCHEN MICRO-GRID AUDITOR ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <div>
                <div className="card-title serif" style={{ marginBottom: 0 }}>
                  🍳 रसोईघर माइक्रो-ग्रिड ऑडिटर (Kitchen Micro-Grid)
                </div>
                <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                  रसोई के भीतर अग्नि (चूल्हा) और जल (सिंक) का पृथक्करण एवं सूक्ष्म वास्तु विश्लेषण।
                </div>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  background: kitchenMicroAudit.hasFireWaterClash ? "#FEE2E2" : "#DCFCE7",
                  color: kitchenMicroAudit.hasFireWaterClash ? "#DC2626" : "#15803D",
                }}
              >
                {kitchenMicroAudit.hasFireWaterClash ? "⚠️ अग्नि-जल द्वंद्व सक्रिय" : "✓ सूक्ष्म वास्तु संतुलित"}
              </span>
            </div>

            <div style={{ background: "#FAF7F2", borderRadius: 12, padding: 16, border: "1px solid rgba(184, 134, 11, 0.2)", marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#6B635B" }}>रसोई में गैस चूल्हा किस दिशा में है:</span>
                  <select
                    value={stoveZoneKitchen}
                    onChange={(e) => setStoveZoneKitchen(e.target.value as any)}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                  >
                    <option value="SE">माइक्रो-आग्नेय (SE - सर्वोत्तम)</option>
                    <option value="SOUTH">माइक्रो-दक्षिण (South - उत्तम)</option>
                    <option value="EAST">माइक्रो-पूर्व (East - शुभ)</option>
                    <option value="NORTH">माइक्रो-उत्तर (North - दोषपूर्ण)</option>
                    <option value="NE">माइक्रो-ईशान (NE - अति घातक)</option>
                    <option value="NW">माइक्रो-वायव्य (NW - स्वीकार्य)</option>
                    <option value="SW">माइक्रो-नैऋत्य (SW - वर्जित)</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#6B635B" }}>रसोई में सिंक/पानी किस दिशा में है:</span>
                  <select
                    value={sinkZoneKitchen}
                    onChange={(e) => setSinkZoneKitchen(e.target.value as any)}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                  >
                    <option value="NORTH">माइक्रो-उत्तर (North - सर्वोत्तम)</option>
                    <option value="NE">माइक्रो-ईशान (NE - उत्तम)</option>
                    <option value="NW">माइक्रो-वायव्य (NW - अनुकूल)</option>
                    <option value="EAST">माइक्रो-पूर्व (East - स्वीकार्य)</option>
                    <option value="SE">माइक्रो-आग्नेय (SE - अग्नि-जल द्वंद्व)</option>
                    <option value="SOUTH">माइक्रो-दक्षिण (South - दोषपूर्ण)</option>
                  </select>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={sameCounter}
                    onChange={(e) => setSameCounter(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#c8a030" }}
                  />
                  <span style={{ fontSize: 12.5, color: "#4A4238" }}>चूल्हा व सिंक एक ही स्लैब/काउंटर पर हैं</span>
                </label>

                {sameCounter && (
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#6B635B" }}>चूल्हे और सिंक के बीच दूरी (Feet):</span>
                    <input
                      type="number"
                      value={stoveSinkDist}
                      onChange={(e) => setStoveSinkDist(Number(e.target.value))}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Verdict Box */}
            <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12.5, color: "#334155" }}>
                  🔥 <strong>चूल्हे का विश्लेषण:</strong> {kitchenMicroAudit.stovePositionVerdictHi}
                </div>
                <div style={{ fontSize: 12.5, color: "#334155" }}>
                  💧 <strong>सिंक का विश्लेषण:</strong> {kitchenMicroAudit.sinkPositionVerdictHi}
                </div>
              </div>

              {kitchenMicroAudit.clashConsequencesHi.length > 0 && (
                <div style={{ marginBottom: 10, padding: 10, background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>
                    ⚠️ अग्नि-जल द्वंद्व के संभावित प्रभाव:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: "#B91C1C", lineHeight: 1.4 }}>
                    {kitchenMicroAudit.clashConsequencesHi.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ padding: 10, background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0", fontSize: 12, color: "#166534" }}>
                <strong>💡 व्यावहारिक लो-कॉस्ट समाधान:</strong> {kitchenMicroAudit.lowCostRemedyHi}
              </div>
            </div>
          </div>

          {/* ── WALL CLOCK (घड़ी / काल चक्र) DIRECTION AUDITOR ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <div>
                <div className="card-title serif" style={{ marginBottom: 0 }}>
                  ⏱️ दीवार घड़ी (घड़ी / काल चक्र) दिशा ऑडिटर
                </div>
                <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                  घड़ी निरंतर समय व ऊर्जा चक्र (Kaal Chakra) को गति देती है। गलत दिशा में घड़ी समय की बर्बादी कराती है।
                </div>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  background:
                    wallClockAudit.status === "AUSPICIOUS" ? "#DCFCE7" :
                    wallClockAudit.status === "HAZARDOUS" ? "#FEE2E2" : "#FEF3C7",
                  color:
                    wallClockAudit.status === "AUSPICIOUS" ? "#15803D" :
                    wallClockAudit.status === "HAZARDOUS" ? "#DC2626" : "#92400E",
                }}
              >
                {wallClockAudit.status === "AUSPICIOUS" ? "✓ अत्यंत शुभ" : wallClockAudit.status === "HAZARDOUS" ? "⚠️ वर्जित / हानिकारक" : "मध्यम"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                { zone: "N", label: "उत्तर (North - कुबेर)" },
                { zone: "E", label: "पूर्व (East - इंद्र)" },
                { zone: "W", label: "पश्चिम (West - लाभ)" },
                { zone: "SSW", label: "दक्षिण-दक्षिण-पश्चिम (SSW - विसर्जन)" },
                { zone: "WNW", label: "पश्चिम-उत्तर-पश्चिम (WNW - डिप्रेशन)" },
                { zone: "ESE", label: "पूर्व-दक्षिण-पूर्व (ESE - चिंता)" },
                { zone: "S", label: "दक्षिण (South)" },
                { zone: "NE", label: "उत्तर-पूर्व (NE)" },
              ].map((z) => {
                const isSel = wallClockZone === z.zone;
                return (
                  <button
                    key={z.zone}
                    onClick={() => setWallClockZone(z.zone)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: isSel ? "2px solid #0284C7" : "1px solid #CBD5E1",
                      background: isSel ? "#0284C7" : "#F8FAFC",
                      color: isSel ? "#FFFFFF" : "#334155",
                      fontWeight: isSel ? 800 : 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {z.label}
                  </button>
                );
              })}
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: wallClockAudit.status === "HAZARDOUS" ? "#DC2626" : "#0F172A", marginBottom: 6 }}>
                प्रभाव: {wallClockAudit.effectHi}
              </div>
              <div style={{ fontSize: 12, color: "#166534", background: "#F0FDF4", padding: 8, borderRadius: 6, border: "1px solid #BBF7D0" }}>
                <strong>शास्त्रीय निर्देश:</strong> {wallClockAudit.recommendationHi}
              </div>
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
                    gap: 10, borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.22)",
                    background: "#FAF7F2", padding: 12,
                  }}
                >
                  <input
                    value={room.name}
                    onChange={e => updateRoom(room.id, { name: e.target.value })}
                    placeholder="Room name"
                    style={{
                      borderRadius: 10, border: "1px solid rgba(184, 134, 11, 0.22)",
                      background: "#FFFFFF", color: "#1A1A1A",
                      padding: "8px 12px", fontSize: 13, outline: "none",
                    }}
                  />
                  <select
                    value={room.type}
                    onChange={e => updateRoom(room.id, { type: e.target.value })}
                    style={{
                      borderRadius: 10, border: "1px solid rgba(184, 134, 11, 0.22)",
                      background: "#FFFFFF", color: "#1A1A1A",
                      padding: "8px 12px", fontSize: 13, outline: "none",
                    }}
                  >
                    {roomTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select
                    value={room.direction}
                    onChange={e => updateRoom(room.id, { direction: e.target.value as Direction })}
                    style={{
                      borderRadius: 10, border: "1px solid rgba(184, 134, 11, 0.22)",
                      background: "#FFFFFF", color: "#1A1A1A",
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

            <div style={{ marginTop: 18, borderRadius: 14, border: "1px solid rgba(20,184,166,0.2)", background: "rgba(20,184,166,0.045)", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div className="card-tag">Room Placement Intelligence</div>
                  <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                    Direction-by-direction placement score before final chart-linked analysis.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 700, color: zoneScoreColor(roomPlacementOverall) }}>
                    {roomPlacementScorecard.length ? roomPlacementOverall : "--"}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B635B", textTransform: "uppercase", letterSpacing: 1 }}>Room Score</div>
                </div>
              </div>
              {roomPlacementScorecard.length === 0 ? (
                <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.7 }}>
                  Select directions for rooms to see placement scoring.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
                  {roomPlacementScorecard.map((room) => (
                    <div key={`${room.type}-${room.direction}-${room.name}`} style={{ borderRadius: 11, border: `1px solid ${room.placement.color}33`, background: "#FAF7F2", padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 700 }}>{room.name}</div>
                        <span className="badge" style={{ background: `${room.placement.color}18`, color: room.placement.color, border: `1px solid ${room.placement.color}44`, flexShrink: 0 }}>
                          {room.placement.score}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: room.placement.color, fontWeight: 700, marginBottom: 5 }}>{room.placement.status}</div>
                      <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>{room.placement.verdict}</div>
                      <div style={{ fontSize: 11, color: "#6B635B", lineHeight: 1.55, marginTop: 6 }}>{room.placement.recommendation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={runAnalysis}
              disabled={loading}
              style={{
                marginTop: 20, padding: "12px 28px", borderRadius: 24,
                background: "linear-gradient(135deg,#c8a030,#a07820)",
                color: "#FAF7F2", border: "none", fontSize: 14, fontWeight: 700,
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
                    <p style={{ fontSize: 14, color: "#4A4238", lineHeight: 1.75, marginTop: 8 }}>
                      {result.summary || "Analysis complete."}
                    </p>
                  </div>
                  <button
                    onClick={downloadVastuReport}
                    disabled={pdfLoading}
                    style={{
                      flexShrink: 0, padding: "10px 22px", borderRadius: 24,
                      background: "linear-gradient(135deg,#c8a030,#a07820)",
                      color: "#FAF7F2", border: "none", fontSize: 13, fontWeight: 700,
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
                  <div className="card" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                    <div className="card-title serif" style={{ color: "#15803d" }}>✅ Strengths ({strengths.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {strengths.length === 0 && <p style={{ fontSize: 13, color: "#6B635B" }}>No major strengths detected.</p>}
                      {strengths.map((item, i) => (
                        <div key={i} style={{ background: "#FAF8F5", border: "1px solid rgba(34,197,94,0.22)", borderLeft: "4px solid #16a34a", borderRadius: 12, padding: "14px 16px" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.6, marginBottom: 6 }}>{item.explanation}</div>
                          <div style={{ fontSize: 12, color: "#15803d", fontWeight: 700 }}>Score: {item.score}/10</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                    <div className="card-title serif" style={{ color: "#b91c1c" }}>⚠️ Defects ({defects.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {defects.length === 0 && <p style={{ fontSize: 13, color: "#6B635B" }}>No major defects detected.</p>}
                      {defects.map((item, i) => {
                        const sc = severityColor(item.severity);
                        return (
                          <div key={i} style={{ background: "#FAF8F5", border: "1px solid rgba(239,68,68,0.22)", borderLeft: "4px solid #dc2626", borderRadius: 12, padding: "14px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{item.title}</div>
                              <span className="badge" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.text}33`, flexShrink: 0 }}>{item.severity}/10</span>
                            </div>
                            <div style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.6, marginBottom: item.remedies.length > 0 ? 8 : 0 }}>{item.explanation}</div>
                            {item.remedies.length > 0 && (
                              <ul style={{ paddingLeft: 18, margin: 0 }}>
                                {item.remedies.map((r, ri) => <li key={ri} style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.7 }}>{r}</li>)}
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
                        <div key={i} style={{ background: "#FAF8F5", border: "1px solid rgba(184,134,11,0.22)", borderLeft: "4px solid #B8860B", borderRadius: 12, padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{item.title}</div>
                            <span className="badge" style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.text}33`, flexShrink: 0, textTransform: "capitalize" }}>{item.priority}</span>
                          </div>
                          <div className="card-tag" style={{ marginBottom: 4 }}>{item.system}</div>
                          {item.requiresKundli && <div style={{ fontSize: 11.5, color: "#8A6008", fontWeight: 600, marginBottom: 6 }}>Kundli validation required</div>}
                          <ul style={{ paddingLeft: 18, margin: 0 }}>
                            {item.steps.map((step, si) => <li key={si} style={{ fontSize: 12.5, color: "#6B635B", lineHeight: 1.7 }}>{step}</li>)}
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
                  <p style={{ fontSize: 13, color: "#6B635B", marginBottom: 16 }}>
                    Phased action plan — start with physical corrections, not symbolic remedies.
                  </p>
                  <div className="grid-3">
                    {[
                      { label: "First 30 Days",  color: "#b91c1c",  borderColor: "rgba(239,68,68,0.3)", borderLeft: "4px solid #dc2626", items: result.correctionPlan.thirtyDay },
                      { label: "Days 31–60",     color: "#b45309",  borderColor: "rgba(234,179,8,0.3)", borderLeft: "4px solid #d97706", items: result.correctionPlan.sixtyDay },
                      { label: "Days 61–90",     color: "#15803d",  borderColor: "rgba(34,197,94,0.3)", borderLeft: "4px solid #16a34a", items: result.correctionPlan.ninetyDay },
                    ].map(col => (
                      <div key={col.label} style={{ background: "#FAF8F5", borderRadius: 12, padding: "14px 16px", border: `1px solid ${col.borderColor}`, borderLeft: col.borderLeft }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: col.color, marginBottom: 10 }}>{col.label}</div>
                        <ol style={{ paddingLeft: 18, margin: 0 }}>
                          {col.items.map((item, i) => (
                            <li key={i} style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.7 }}>{item}</li>
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
                  <p style={{ fontSize: 13, color: "#6B635B", marginBottom: 16 }}>
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
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 10, border: "1px solid #FFFFFF", background: "rgba(0,0,0,0.18)", padding: 12 }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(200,160,48,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#c8a030", flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.7 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vastu Purusha health map */}
              {result.vastuPurushaHealth && result.vastuPurushaHealth.observations.length > 1 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title serif">🙏 Vastu Purusha — Symbolic Health Map</div>
                  <p style={{ fontSize: 13, color: "#6B635B", marginBottom: 12 }}>
                    Symbolic mapping of zones to body areas. Use as guidance, not medical advice.
                  </p>
                  {result.vastuPurushaHealth.affectedZones.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 12, color: "#6B635B" }}>Affected zones:</span>
                      {result.vastuPurushaHealth.affectedZones.map(zone => (
                        <span key={zone} className="badge badge-gold">{zone}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.vastuPurushaHealth.observations.map((obs, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, borderRadius: 10, border: "1px solid #FFFFFF", background: "rgba(0,0,0,0.18)", padding: 12, fontSize: 13, color: "#6B635B" }}>
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
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>{zone.name}</div>
                          <div style={{ fontSize: 11, color: "#6B635B", marginBottom: 6 }}>{zone.planet} · {zone.status}</div>
                          <div style={{ fontSize: 11, color: "#6B635B", marginBottom: 6 }}>{zone.domain}</div>
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
                        <div key={i} className="card" style={{ padding: 14, fontSize: 13, color: "#4A4238", lineHeight: 1.7 }}>{insight}</div>
                      ))}
                    </div>
                  )}

                  {activeZoneTab === "transit" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                      <div className="card-tag" style={{ marginBottom: 4 }}>Transit Alerts — Planet Zone Effects</div>
                      {result.zoneAnalysis.transitAlerts.length === 0 && (
                        <p style={{ fontSize: 13, color: "#6B635B" }}>No significant transit alerts for this chart.</p>
                      )}
                      {result.zoneAnalysis.transitAlerts.map((alert, i) => (
                        <div
                          key={i}
                          className="card"
                          style={{ padding: 14, borderColor: alert.positive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, color: alert.positive ? "#4ade80" : "#f87171" }}>{alert.planet}</span>
                            <span style={{ color: "#6B635B" }}>→</span>
                            <span style={{ color: "#4A4238" }}>{alert.zone}</span>
                            <span className={`badge ${alert.positive ? "badge-green" : "badge-red"}`} style={{ marginLeft: "auto" }}>
                              {alert.positive ? "Benefic" : "Malefic"}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.6, marginBottom: 4 }}>{alert.effect}</p>
                          <p style={{ fontSize: 12, color: "#c8a030" }}>↺ Remedy: {alert.remedy}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="card">
                  <div className="card-title serif">16-Zone MahaVastu Analysis</div>
                  <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.7 }}>
                    This section requires your Kundli with full planet house positions. Generate your Kundli,
                    then return here and click <strong>Refresh Chart</strong>. Planet positions will activate the zone analysis automatically.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
      </PremiumFeature>
    </EngineShell>
  );
}
