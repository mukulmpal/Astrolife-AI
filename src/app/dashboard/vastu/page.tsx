"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadVastuPDFReport } from "@/lib/report-generator";

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

type VastuResult = {
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
  "astrolife_chart",
  "astrolife_chart_data",
  "astrolife_current_chart",
  "astrolife_user_chart",
  "chartData",
  "kundliData",
  "kundli",
  "userChart",
  "birthChart",
  "currentChart",
  "astroChart",
  "astro_chart",
  "premiumReportData",
  "reportData",
];

function safeJsonParse(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readNested(obj: unknown, paths: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;

  for (const path of paths) {
    const parts = path.split(".");
    let current: unknown = obj;

    for (const part of parts) {
      if (!current || typeof current !== "object") {
        current = undefined;
        break;
      }

      current = (current as Record<string, unknown>)[part];
    }

    if (current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return undefined;
}

function normalizePlanetName(value: unknown): string {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();

  const map: Record<string, string> = {
    sun: "Sun",
    surya: "Sun",
    moon: "Moon",
    chandra: "Moon",
    mars: "Mars",
    mangal: "Mars",
    mercury: "Mercury",
    budh: "Mercury",
    jupiter: "Jupiter",
    guru: "Jupiter",
    venus: "Venus",
    shukra: "Venus",
    saturn: "Saturn",
    shani: "Saturn",
    rahu: "Rahu",
    ketu: "Ketu",
  };

  return map[lower] || raw;
}

function collectPlanetsArray(chart: unknown): Array<Record<string, unknown>> {
  const candidates = [
    readNested(chart, ["planets"]),
    readNested(chart, ["planetaryPositions"]),
    readNested(chart, ["planetPositions"]),
    readNested(chart, ["chart.planets"]),
    readNested(chart, ["rasi.planets"]),
    readNested(chart, ["birthChart.planets"]),
    readNested(chart, ["data.planets"]),
    readNested(chart, ["kundli.planets"]),
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is Record<string, unknown> => {
        return Boolean(item && typeof item === "object");
      });
    }

    if (candidate && typeof candidate === "object") {
      return Object.entries(candidate as Record<string, unknown>).map(([planet, value]) => {
        if (value && typeof value === "object") {
          return { planet, ...(value as Record<string, unknown>) };
        }

        return { planet, house: value };
      });
    }
  }

  return [];
}

function buildLalKitabHousesFromChart(chart: unknown): Record<string, string[]> {
  const direct = readNested(chart, [
    "lalKitabHouses",
    "lalKitab.houses",
    "lalKitab.khana",
    "kundli.lalKitabHouses",
    "data.lalKitabHouses",
  ]);

  if (direct && typeof direct === "object" && !Array.isArray(direct)) {
    const normalized: Record<string, string[]> = {};

    for (const [house, planets] of Object.entries(direct as Record<string, unknown>)) {
      if (Array.isArray(planets)) {
        normalized[String(house)] = planets.map(normalizePlanetName).filter(Boolean);
      } else if (typeof planets === "string") {
        normalized[String(house)] = planets
          .split(/[,\s]+/)
          .map(normalizePlanetName)
          .filter(Boolean);
      }
    }

    if (Object.keys(normalized).length > 0) return normalized;
  }

  const houses: Record<string, string[]> = {};
  const planets = collectPlanetsArray(chart);

  for (const item of planets) {
    const planet = normalizePlanetName(
      item.name || item.planet || item.planetName || item.key || item.graha
    );

    const houseRaw =
      item.house ||
      item.bhava ||
      item.houseNumber ||
      item.lalKitabHouse ||
      item.khana ||
      item.lkHouse;

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
  const direct = readNested(chart, [
    "weakPlanets",
    "analysis.weakPlanets",
    "strength.weakPlanets",
    "planetStrengths.weakPlanets",
    "kundli.weakPlanets",
    "data.weakPlanets",
  ]);

  if (Array.isArray(direct)) {
    return direct.map(normalizePlanetName).filter(Boolean);
  }

  const planets = collectPlanetsArray(chart);
  const weak: string[] = [];

  for (const item of planets) {
    const planet = normalizePlanetName(
      item.name || item.planet || item.planetName || item.key || item.graha
    );

    const strengthRaw = String(
      item.strength || item.status || item.dignity || item.condition || ""
    ).toLowerCase();

    const numericStrength = Number(item.score ?? item.strengthScore ?? item.shadbalaScore);

    if (
      planet &&
      (
        strengthRaw.includes("weak") ||
        strengthRaw.includes("debilitated") ||
        strengthRaw.includes("neecha") ||
        strengthRaw.includes("afflicted") ||
        (Number.isFinite(numericStrength) && numericStrength < 35)
      )
    ) {
      weak.push(planet);
    }
  }

  return Array.from(new Set(weak));
}

function normalizeKundli(chart: unknown, source: string): NormalizedKundli {
  const currentMahadasha = readNested(chart, [
    "currentMahadasha",
    "currentMD",
    "dasha.currentMahadasha",
    "dasha.currentMD",
    "vimshottari.currentMahadasha",
    "vimshottari.currentMD",
    "kundli.currentMahadasha",
    "kundli.dasha.currentMD",
    "data.dasha.currentMD",
  ]);

  const currentAntardasha = readNested(chart, [
    "currentAntardasha",
    "currentAD",
    "dasha.currentAntardasha",
    "dasha.currentAD",
    "vimshottari.currentAntardasha",
    "vimshottari.currentAD",
    "kundli.currentAntardasha",
    "kundli.dasha.currentAD",
    "data.dasha.currentAD",
  ]);

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

  const stores = [
    { name: "localStorage", store: window.localStorage },
    { name: "sessionStorage", store: window.sessionStorage },
  ];

  for (const { name, store } of stores) {
    for (const key of possibleChartStorageKeys) {
      const parsed = safeJsonParse(store.getItem(key));

      if (parsed && typeof parsed === "object") {
        return {
          chart: parsed,
          source: `${name}:${key}`,
        };
      }
    }
  }

  return null;
}

function scoreColor(score: number) {
  if (score >= 80) return "text-green-300";
  if (score >= 60) return "text-amber-300";
  return "text-red-300";
}

export default function VastuDashboardPage() {
  const [kundli, setKundli] = useState<NormalizedKundli | null>(null);
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
  const [result, setResult] = useState<VastuResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [mindMakanTab, setMindMakanTab] = useState<"physical" | "behavioural" | "routine" | "emotional" | "spiritual">("physical");
  const [activeZoneTab, setActiveZoneTab] = useState<"all" | "strong" | "weak" | "psych" | "transit">("all");
  const [pdfLoading, setPdfLoading] = useState(false);

  function refreshChart() {
    const loaded = loadUserChartFromStorage();

    if (!loaded) {
      setKundli(null);
      setChartLoadMessage(
        "No saved chart found in browser storage. Open/generate a Kundli first, then return here and click Refresh Chart."
      );
      return;
    }

    const normalized = normalizeKundli(loaded.chart, loaded.source);
    setKundli(normalized);

    const planetsCount = Object.values(normalized.lalKitabHouses).reduce(
      (sum, planets) => sum + planets.length,
      0
    );

    setChartLoadMessage(
      `Loaded user chart from ${normalized.source}. Weak planets: ${
        normalized.weakPlanets.length ? normalized.weakPlanets.join(", ") : "not detected"
      }. Lal Kitab planets mapped: ${planetsCount}.`
    );
  }

  useEffect(() => {
    refreshChart();
  }, []);

  const activeRooms = useMemo(() => {
    return rooms
      .filter((room) => room.type && room.direction)
      .map((room) => ({
        type: room.type,
        direction: room.direction,
        name: room.name || roomTypeOptions.find((option) => option.value === room.type)?.label || room.type,
      }));
  }, [rooms]);

  function updateRoom(id: string, patch: Partial<RoomInput>) {
    setRooms((prev) =>
      prev.map((room) => (room.id === id ? { ...room, ...patch } : room))
    );
  }

  function addRoom() {
    setRooms((prev) => [
      ...prev,
      {
        id: `room-${Date.now()}`,
        type: "bedroom",
        name: "New Room",
        direction: "",
      },
    ]);
  }

  function removeRoom(id: string) {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  }

  async function runAnalysis() {
    setLoading(true);
    setErrorText("");
    setResult(null);

    try {
      if (!facing) {
        throw new Error("Please select property facing direction.");
      }

      if (activeRooms.length === 0) {
        throw new Error("Please add at least one room with direction.");
      }

      const measurements =
        lengthHasta && widthHasta
          ? {
              shape,
              lengthHasta: Number(lengthHasta),
              widthHasta: Number(widthHasta),
            }
          : {
              shape,
            };

      const payload = {
        propertyType,
        facing,
        rooms: activeRooms,
        kundli: kundli || undefined,
        features: {
          northOpen,
          eastOpen,
          southWestHeavy,
          brahmasthanOpen,
        },
        measurements,
        options: {
          includeLalKitab,
          includeConstruction,
        },
      };

      const response = await fetch("/api/vastu/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `API failed with status ${response.status}`);
      }

      const data = (await response.json()) as VastuResult;
      setResult(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorText(message);
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
        type:   propertyType,
        facing: facing || undefined,
        shape,
        rooms: activeRooms.map((r) => ({ name: r.name, type: r.type, direction: r.direction })),
      });
    } catch (err) {
      console.error("Vastu PDF error:", err);
    } finally {
      setPdfLoading(false);
    }
  }

  const scores = result?.scores || {};
  const strengths = result?.strengths || [];
  const defects = result?.defects || [];
  const recommendations = result?.recommendations || [];

  return (
    <main className="min-h-screen bg-[#070515] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-amber-400/20 bg-white/[0.04] p-6 shadow-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            AstroLife Vastu Intelligence
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            User Chart Based Vastu Analysis
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            This dashboard now uses the logged-in user&apos;s saved Kundli/chart
            from browser storage and combines it with property room directions.
            Vastu still needs property data; the chart personalizes severity,
            Lal Kitab Makan Vastu and kundli-safe remedies.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Chart Status</p>
                <p className="mt-1 text-sm text-white/60">{chartLoadMessage}</p>
              </div>

              <button
                onClick={refreshChart}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Refresh Chart
              </button>
            </div>

            {kundli && (
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <div className="rounded-xl bg-white/[0.04] p-3">
                  <p className="text-white/45">Mahadasha</p>
                  <p className="font-semibold">{kundli.currentMahadasha || "Not detected"}</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] p-3">
                  <p className="text-white/45">Antardasha</p>
                  <p className="font-semibold">{kundli.currentAntardasha || "Not detected"}</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] p-3">
                  <p className="text-white/45">Weak Planets</p>
                  <p className="font-semibold">
                    {kundli.weakPlanets.length ? kundli.weakPlanets.join(", ") : "Not detected"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold">Property Inputs</h2>
          <p className="mt-2 text-sm text-white/60">
            Fill actual property directions. This replaces the old samplePayload.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-white/60">Property Type</span>
              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="home">Home</option>
                <option value="flat">Flat / Apartment</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="factory">Factory</option>
                <option value="plot">Plot</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/60">Facing</span>
              <select
                value={facing}
                onChange={(event) => setFacing(event.target.value as Direction)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                {directionOptions.map((option) => (
                  <option key={option.value || "blank-facing"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/60">Plot Shape</span>
              <select
                value={shape}
                onChange={(event) => setShape(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="rectangle">Rectangle</option>
                <option value="square">Square</option>
                <option value="irregular">Irregular</option>
                <option value="triangular">Triangular</option>
                <option value="cut">Cut Plot</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-white/60">Length in Hasta / Hand Units optional</span>
              <input
                value={lengthHasta}
                onChange={(event) => setLengthHasta(event.target.value)}
                placeholder="Example: 15"
                inputMode="decimal"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/60">Width in Hasta / Hand Units optional</span>
              <input
                value={widthHasta}
                onChange={(event) => setWidthHasta(event.target.value)}
                placeholder="Example: 7"
                inputMode="decimal"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                label: "North open/light",
                value: northOpen,
                onChange: setNorthOpen,
              },
              {
                label: "East open/light",
                value: eastOpen,
                onChange: setEastOpen,
              },
              {
                label: "South-West heavy/stable",
                value: southWestHeavy,
                onChange: setSouthWestHeavy,
              },
              {
                label: "Brahmasthan open",
                value: brahmasthanOpen,
                onChange: setBrahmasthanOpen,
              },
              {
                label: "Include Lal Kitab Makan Vastu",
                value: includeLalKitab,
                onChange: setIncludeLalKitab,
              },
              {
                label: "Include Construction Rules",
                value: includeConstruction,
                onChange: setIncludeConstruction,
              },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75"
              >
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={(event) => item.onChange(event.target.checked)}
                  className="h-4 w-4"
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Room Directions</h2>
              <p className="mt-2 text-sm text-white/60">
                Add real room placements from the user&apos;s property/floor plan.
              </p>
            </div>

            <button
              onClick={addRoom}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Add Room
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1.1fr_1fr_1fr_auto]"
              >
                <input
                  value={room.name}
                  onChange={(event) => updateRoom(room.id, { name: event.target.value })}
                  placeholder="Room name"
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30"
                />

                <select
                  value={room.type}
                  onChange={(event) => updateRoom(room.id, { type: event.target.value })}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                >
                  {roomTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={room.direction}
                  onChange={(event) => updateRoom(room.id, { direction: event.target.value as Direction })}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                >
                  {directionOptions.map((option) => (
                    <option key={`${room.id}-${option.value || "blank"}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeRoom(room.id)}
                  className="rounded-xl border border-red-400/30 px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="mt-6 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? "Analyzing User Chart..." : "Run User Chart Vastu Analysis"}
          </button>

          {errorText && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorText}
            </div>
          )}
        </section>

        {result && (
          <>
            {/* ── SUMMARY + SCORE ── */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <p className="text-xs text-white/40">Engine: {result.engineVersion || "unknown"}</p>
                  <h2 className="mt-2 text-2xl font-bold">Summary</h2>
                  <p className="mt-3 text-white/75">{result.summary || "Analysis complete."}</p>
                </div>
                <button
                  onClick={downloadVastuReport}
                  disabled={pdfLoading}
                  className="shrink-0 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-60"
                >
                  {pdfLoading ? "Generating PDF..." : "Download PDF Report"}
                </button>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-5">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-widest text-white/45">{key}</p>
                  <p className={`mt-2 text-3xl font-bold ${scoreColor(Number(value || 0))}`}>
                    {String(value ?? 0)}
                  </p>
                </div>
              ))}
            </section>

            {/* ── STRENGTHS + DEFECTS ── */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-green-400/20 bg-green-500/5 p-6">
                <h2 className="text-2xl font-bold text-green-200">Strengths ({strengths.length})</h2>
                <div className="mt-4 space-y-3">
                  {strengths.length === 0 && <p className="text-white/60">No major strengths detected.</p>}
                  {strengths.map((item, i) => (
                    <div key={`s-${i}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-white/65">{item.explanation}</p>
                      <p className="mt-2 text-xs text-green-300">Score: {item.score}/10</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-6">
                <h2 className="text-2xl font-bold text-red-200">Defects ({defects.length})</h2>
                <div className="mt-4 space-y-3">
                  {defects.length === 0 && <p className="text-white/60">No major defects detected.</p>}
                  {defects.map((item, i) => (
                    <div key={`d-${i}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{item.title}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                          item.severity >= 9 ? "bg-red-500/30 text-red-200" :
                          item.severity >= 7 ? "bg-orange-500/30 text-orange-200" :
                          "bg-yellow-500/20 text-yellow-200"
                        }`}>
                          {item.severity}/10
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/65">{item.explanation}</p>
                      {item.remedies.length > 0 && (
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/55">
                          {item.remedies.map((r, ri) => <li key={ri}>{r}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── RECOMMENDATIONS ── */}
            <section className="rounded-3xl border border-amber-400/20 bg-amber-500/5 p-6">
              <h2 className="text-2xl font-bold text-amber-200">Recommendations</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {recommendations.map((item, i) => (
                  <div key={`r-${i}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{item.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.priority === "critical" ? "bg-red-500/30 text-red-200" :
                        item.priority === "high"     ? "bg-orange-500/30 text-orange-200" :
                        item.priority === "medium"   ? "bg-amber-500/20 text-amber-200" :
                        "bg-white/10 text-white/60"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-widest text-white/35">{item.system}</p>
                    {item.requiresKundli && (
                      <p className="mt-1 text-xs text-amber-300">Kundli validation required</p>
                    )}
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/60">
                      {item.steps.map((step, si) => <li key={si}>{step}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 30/60/90 DAY CORRECTION PLAN ── */}
            {result.correctionPlan && (
              <section className="rounded-3xl border border-cyan-400/20 bg-cyan-500/5 p-6">
                <h2 className="text-2xl font-bold text-cyan-200">30 / 60 / 90 Day Correction Plan</h2>
                <p className="mt-2 text-sm text-white/55">
                  Phased action plan based on defect severity. Start with physical corrections, not symbolic remedies.
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {[
                    { label: "First 30 Days", color: "border-red-400/30 bg-red-500/5", heading: "text-red-200", items: result.correctionPlan.thirtyDay },
                    { label: "Days 31–60",    color: "border-amber-400/30 bg-amber-500/5", heading: "text-amber-200", items: result.correctionPlan.sixtyDay },
                    { label: "Days 61–90",    color: "border-green-400/30 bg-green-500/5", heading: "text-green-200", items: result.correctionPlan.ninetyDay },
                  ].map((col) => (
                    <div key={col.label} className={`rounded-2xl border p-4 ${col.color}`}>
                      <p className={`font-bold ${col.heading}`}>{col.label}</p>
                      <ul className="mt-3 space-y-2">
                        {col.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className={`mt-0.5 text-xs font-bold ${col.heading}`}>{i + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── MIND + MAKAN ENERGY LOOP ── */}
            {result.mindMakan && (
              <section className="rounded-3xl border border-purple-400/20 bg-purple-500/5 p-6">
                <h2 className="text-2xl font-bold text-purple-200">Mind + Makan Energy Loop</h2>
                <p className="mt-2 text-sm text-white/55">
                  House affects mind. Mind affects house. Physical correction alone is not enough — five layers of correction.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(["physical", "behavioural", "routine", "emotional", "spiritual"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMindMakanTab(tab)}
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition capitalize ${
                        mindMakanTab === tab
                          ? "bg-purple-500 text-white"
                          : "border border-white/15 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <ul className="mt-5 space-y-2">
                  {(result.mindMakan[mindMakanTab] || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-3 text-sm text-white/70">
                      <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-purple-500/30 text-center text-xs font-bold leading-5 text-purple-300">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── VASTU PURUSHA HEALTH MAP ── */}
            {result.vastuPurushaHealth && result.vastuPurushaHealth.observations.length > 1 && (
              <section className="rounded-3xl border border-teal-400/20 bg-teal-500/5 p-6">
                <h2 className="text-2xl font-bold text-teal-200">Vastu Purusha — Symbolic Health Map</h2>
                <p className="mt-2 text-sm text-white/55">
                  Traditional symbolic mapping of Vastu zones to body and life areas. Use as guidance, not medical advice.
                </p>

                {result.vastuPurushaHealth.affectedZones.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-white/40">Affected zones:</span>
                    {result.vastuPurushaHealth.affectedZones.map((zone) => (
                      <span key={zone} className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
                        {zone}
                      </span>
                    ))}
                  </div>
                )}

                <ul className="mt-4 space-y-2">
                  {result.vastuPurushaHealth.observations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-3 text-sm text-white/65">
                      <span className="mt-0.5 shrink-0 text-teal-400">→</span>
                      {obs}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── 16-ZONE KUNDLI-BASED ZONE ANALYSIS ── */}
            {result.zoneAnalysis ? (
              <section className="rounded-3xl border border-indigo-400/20 bg-indigo-500/5 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-200">16-Zone MahaVastu Analysis</h2>
                    <p className="mt-1 text-sm text-white/55">
                      Kundli planet-based zone scoring. Overall zone score: {result.zoneAnalysis.overallScore}/92
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-300">{result.zoneAnalysis.strongZones.length} Strong</span>
                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-red-300">{result.zoneAnalysis.weakZones.length} Weak</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(["all", "strong", "weak", "psych", "transit"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveZoneTab(tab)}
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition capitalize ${
                        activeZoneTab === tab
                          ? "bg-indigo-500 text-white"
                          : "border border-white/15 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {tab === "psych" ? "Psych Bridge" : tab === "transit" ? "Transit Alerts" : tab}
                    </button>
                  ))}
                </div>

                {(activeZoneTab === "all" || activeZoneTab === "strong" || activeZoneTab === "weak") && (
                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {(activeZoneTab === "all"
                      ? result.zoneAnalysis.zones
                      : activeZoneTab === "strong"
                      ? result.zoneAnalysis.strongZones
                      : result.zoneAnalysis.weakZones
                    ).map((zone) => (
                      <div
                        key={zone.dir}
                        className={`rounded-2xl border p-4 ${
                          zone.status === "Strong" ? "border-green-400/25 bg-green-500/5" :
                          zone.status === "Weak"   ? "border-red-400/25 bg-red-500/5" :
                          "border-white/10 bg-black/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white/40">{zone.dir}</span>
                          <span className={`text-sm font-bold ${
                            zone.status === "Strong" ? "text-green-300" :
                            zone.status === "Weak"   ? "text-red-300" : "text-amber-300"
                          }`}>{zone.score}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-white">{zone.name}</p>
                        <p className="mt-0.5 text-xs text-white/45">{zone.planet} · {zone.status}</p>
                        <p className="mt-2 text-xs text-white/40 line-clamp-2">{zone.domain}</p>
                        {zone.planets.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {zone.planets.map((p) => (
                              <span key={p} className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">{p}</span>
                            ))}
                          </div>
                        )}
                        {zone.hasDosha && (
                          <p className="mt-2 text-xs text-red-300">Dosha present</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeZoneTab === "psych" && (
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-semibold text-indigo-300">Psychology Bridge — Planet-Zone Insights</p>
                    {result.zoneAnalysis.psychBridge.map((insight, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                        {insight}
                      </div>
                    ))}
                  </div>
                )}

                {activeZoneTab === "transit" && (
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-semibold text-indigo-300">Transit Alerts — Planet Zone Effects</p>
                    {result.zoneAnalysis.transitAlerts.length === 0 && (
                      <p className="text-sm text-white/50">No significant transit alerts for this chart configuration.</p>
                    )}
                    {result.zoneAnalysis.transitAlerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-4 text-sm ${
                          alert.positive
                            ? "border-green-400/25 bg-green-500/5"
                            : "border-red-400/25 bg-red-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${alert.positive ? "text-green-300" : "text-red-300"}`}>
                            {alert.planet}
                          </span>
                          <span className="text-white/40">→</span>
                          <span className="text-white/70">{alert.zone}</span>
                          <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                            alert.positive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                          }`}>
                            {alert.positive ? "Benefic" : "Malefic"}
                          </span>
                        </div>
                        <p className="mt-2 text-white/55">{alert.effect}</p>
                        <p className="mt-1 text-xs text-white/40">Remedy: {alert.remedy}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="rounded-3xl border border-indigo-400/15 bg-indigo-500/3 p-6">
                <h2 className="text-xl font-bold text-indigo-300">16-Zone MahaVastu Analysis</h2>
                <p className="mt-2 text-sm text-white/50">
                  This section requires your Kundli with full planet house positions. Generate your Kundli on the Kundli page,
                  then return here and click Refresh Chart. If planet positions are saved, the zone analysis will activate automatically.
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
