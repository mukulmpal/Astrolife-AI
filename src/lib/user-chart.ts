"use client";

import { useEffect, useState } from "react";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { createClient } from "@/lib/supabase/client";

export interface BirthDetails {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat?: number | null;
  lon?: number | null;
}

export interface SavedChartSummary {
  id: string;
  name: string;
  dob: string;
  tob: string;
  city: string;
  chartType: string;
  isPrimary: boolean;
  createdAt: string;
}

const CHART_STORAGE_KEY = "currentChart";

const DEMO_BIRTH: BirthDetails = {
  name: "Mukul Pal",
  dob: "1995-07-04",
  tob: "12:30",
  city: "Delhi",
};

function buildChart(birth: BirthDetails): ChartData {
  return calculateChart(
    birth.name,
    birth.dob,
    birth.tob,
    birth.city,
    birth.lat ?? undefined,
    birth.lon ?? undefined,
  );
}

function isStoredChart(value: unknown): value is ChartData {
  if (!value || typeof value !== "object") return false;
  const chart = value as Partial<ChartData>;
  return typeof chart.name === "string"
    && typeof chart.dob === "string"
    && typeof chart.tob === "string"
    && typeof chart.city === "string"
    && !!chart.planets
    && Array.isArray(chart.dashas);
}

function getBirthFromChart(chart: ChartData): BirthDetails {
  return {
    name: chart.name,
    dob: chart.dob,
    tob: chart.tob,
    city: chart.city,
    lat: chart.lat,
    lon: chart.lon,
  };
}

function reviveChartDates(chart: ChartData): ChartData {
  return {
    ...chart,
    dashas: chart.dashas.map((entry) => ({
      ...entry,
      start: new Date(entry.start),
      end: new Date(entry.end),
    })),
    antardasha: chart.antardasha.map((entry) => ({
      ...entry,
      start: new Date(entry.start),
      end: new Date(entry.end),
    })),
  };
}

function serializeChart(chart: ChartData) {
  return JSON.parse(JSON.stringify(chart)) as Record<string, unknown>;
}

function getProfileBirth(profile: Record<string, unknown> | null): BirthDetails | null {
  if (!profile) return null;
  const name = typeof profile.name === "string" ? profile.name : "";
  const dob = typeof profile.dob === "string" ? profile.dob : "";
  const tob = typeof profile.tob === "string" ? profile.tob : "";
  const city = typeof profile.city === "string" ? profile.city : "";
  if (!name || !dob || !tob || !city) return null;

  return {
    name,
    dob,
    tob,
    city,
    lat: typeof profile.lat === "number" ? profile.lat : null,
    lon: typeof profile.lon === "number" ? profile.lon : null,
  };
}

function getChartRowBirth(row: Record<string, unknown> | null): BirthDetails | null {
  if (!row) return null;
  const name = typeof row.name === "string" ? row.name : "";
  const dob = typeof row.dob === "string" ? row.dob : "";
  const tob = typeof row.tob === "string" ? row.tob : "";
  const city = typeof row.city === "string" ? row.city : "";
  if (!name || !dob || !tob || !city) return null;

  return {
    name,
    dob,
    tob,
    city,
    lat: typeof row.lat === "number" ? row.lat : null,
    lon: typeof row.lon === "number" ? row.lon : null,
  };
}

export function saveCurrentChart(chart: ChartData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(chart));
}

export function clearCurrentChart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHART_STORAGE_KEY);
}

function loadCurrentChartFromDevice(): ChartData | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(CHART_STORAGE_KEY);
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  return isStoredChart(parsed) ? reviveChartDates(parsed) : null;
}

export async function saveChartToAccount(chart: ChartData, options: { replacePrimary?: boolean } = {}) {
  saveCurrentChart(chart);
  const replacePrimary = options.replacePrimary ?? false;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      chart_type: "self",
      name: chart.name,
      dob: chart.dob,
      tob: chart.tob,
      city: chart.city,
      lat: chart.lat,
      lon: chart.lon,
      chart_json: serializeChart(chart),
      is_primary: true,
      updated_at: new Date().toISOString(),
    };

    if (replacePrimary) {
      const { data: existing } = await supabase
        .from("charts")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_primary", true)
        .maybeSingle();

      if (existing?.id) {
        await supabase.from("charts").update(payload).eq("id", existing.id);
        return;
      }
    } else {
      await supabase
        .from("charts")
        .update({ is_primary: false, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("is_primary", true);
    }

    await supabase.from("charts").insert(payload);
  } catch (error) {
    console.warn("Chart account persistence skipped:", error);
  }
}

export async function listSavedCharts(): Promise<SavedChartSummary[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("charts")
      .select("id,name,dob,tob,city,chart_type,is_primary,created_at")
      .eq("user_id", user.id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      dob: String(item.dob),
      tob: String(item.tob),
      city: String(item.city),
      chartType: String(item.chart_type ?? "self"),
      isPrimary: Boolean(item.is_primary),
      createdAt: String(item.created_at),
    }));
  } catch (error) {
    console.warn("Chart list load skipped:", error);
    return [];
  }
}

export async function selectSavedChart(chartId: string): Promise<ChartData | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("charts")
      .select("chart_json")
      .eq("id", chartId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data?.chart_json || !isStoredChart(data.chart_json)) return null;

    await supabase
      .from("charts")
      .update({ is_primary: false, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("is_primary", true);

    await supabase
      .from("charts")
      .update({ is_primary: true, updated_at: new Date().toISOString() })
      .eq("id", chartId)
      .eq("user_id", user.id);

    const chart = reviveChartDates(data.chart_json);
    saveCurrentChart(chart);
    return chart;
  } catch (error) {
    console.warn("Chart switch skipped:", error);
    return null;
  }
}

async function loadPrimaryChartFromAccount(): Promise<ChartData | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("charts")
    .select("chart_json,name,dob,tob,city,lat,lon")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  if (error || !data) return null;
  if (data.chart_json && isStoredChart(data.chart_json)) {
    return reviveChartDates(data.chart_json);
  }

  const birth = getChartRowBirth(data);
  return birth ? buildChart(birth) : null;
}

export function formatChartContext(chart: ChartData): string {
  const planetSummary = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    .map((planet) => {
      const data = chart.planets[planet];
      if (!data) return null;
      const retro = data.retrograde ? " (Retrograde)" : "";
      return `${planet}: ${data.sign} H${data.house}${retro}`;
    })
    .filter(Boolean)
    .join(", ");

  const activeDasha = chart.dashas.find((entry) => entry.active);
  const dashaLabel = activeDasha
    ? `${activeDasha.planet} Mahadasha ${activeDasha.start.getFullYear()}-${activeDasha.end.getFullYear()}`
    : "Unknown";

  return `Name: ${chart.name}, DOB: ${chart.dob}, TOB: ${chart.tob}, City: ${chart.city}, Ascendant: ${chart.lagnaRashi}, ${planetSummary}, Active Dasha: ${dashaLabel}`;
}

export function useUserChart() {
  const [birth, setBirth] = useState<BirthDetails>(DEMO_BIRTH);
  const [chart, setChart] = useState<ChartData>(() => buildChart(DEMO_BIRTH));
  const [hasUserChart, setHasUserChart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadChart = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const accountChart = await loadPrimaryChartFromAccount();
        if (accountChart) {
          saveCurrentChart(accountChart);
          if (!cancelled) {
            setBirth(getBirthFromChart(accountChart));
            setChart(accountChart);
            setHasUserChart(true);
            setLoading(false);
          }
          return;
        }

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name,dob,tob,city,lat,lon")
            .eq("id", user.id)
            .maybeSingle();

          const profileBirth = getProfileBirth(profile);
          if (profileBirth) {
            const nextChart = buildChart(profileBirth);
            await saveChartToAccount(nextChart, { replacePrimary: true });
            if (!cancelled) {
              setBirth(profileBirth);
              setChart(nextChart);
              setHasUserChart(true);
              setLoading(false);
            }
            return;
          }

          const deviceChart = loadCurrentChartFromDevice();
          if (deviceChart) {
            await saveChartToAccount(deviceChart, { replacePrimary: true });
            if (!cancelled) {
              setBirth(getBirthFromChart(deviceChart));
              setChart(deviceChart);
              setHasUserChart(true);
              setLoading(false);
            }
            return;
          }

          clearCurrentChart();
          if (!cancelled) {
            setHasUserChart(false);
            setLoading(false);
          }
          return;
        }

        const storedChart = loadCurrentChartFromDevice();
        if (storedChart) {
          if (!cancelled) {
            setBirth(getBirthFromChart(storedChart));
            setChart(storedChart);
            setHasUserChart(true);
            setLoading(false);
          }
          return;
        }
      } catch (error) {
        console.error("User chart load error:", error);
      }

      if (!cancelled) {
        setHasUserChart(false);
        setLoading(false);
      }
    };

    loadChart();
    return () => {
      cancelled = true;
    };
  }, []);

  return { birth, chart, loading, hasUserChart, isDemoChart: !hasUserChart };
}
