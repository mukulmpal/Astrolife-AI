"use client";

import { useEffect, useState, useContext } from "react";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
export type { ChartData };
import { createClient } from "@/lib/supabase/client";
import { ChartContext, useChartEngine, type ChartContextValue } from "@/context/ChartContext";
export { useChartEngine };

export interface BirthDetails {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat?: number | null;
  lon?: number | null;
  tz?: number | null;
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

// Internal-only seed used purely to build a structurally-valid chart object so
// engine pages never crash on a missing chart. It is NEVER shown to the user —
// it carries no real person's name and `birth` always defaults to EMPTY_BIRTH,
// so every page's empty-state guard fires until the user's real chart loads.
export const PLACEHOLDER_BIRTH: BirthDetails = {
  name: "",
  dob: "2000-01-01",
  tob: "12:00",
  city: "Delhi",
  tz: 5.5,
};

export const EMPTY_BIRTH: BirthDetails = {
  name: "",
  dob: "",
  tob: "",
  city: "",
};

export function buildChart(birth: BirthDetails): ChartData {
  return calculateChart(
    birth.name,
    birth.dob,
    birth.tob,
    birth.city,
    birth.lat ?? undefined,
    birth.lon ?? undefined,
    birth.tz ?? undefined
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

export function getBirthFromChart(chart: ChartData): BirthDetails {
  return {
    name: chart.name,
    dob: chart.dob,
    tob: chart.tob,
    city: chart.city,
    lat: chart.lat,
    lon: chart.lon,
    tz: chart.tz,
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

export function getProfileBirth(profile: Record<string, unknown> | null): BirthDetails | null {
  if (!profile) return null;
  const name = typeof profile.name === "string" ? profile.name : "";
  const dob = typeof profile.dob === "string" ? profile.dob : "";
  const tob = typeof profile.tob === "string" ? profile.tob : "";
  const city = typeof profile.city === "string" ? profile.city : "";
  if (!name || !dob || !tob || !city) return null;

  const tzValue = (profile as Record<string, unknown>).tz ?? (profile as Record<string, unknown>).timezone;
  const tzNumber = typeof tzValue === "number" ? tzValue : typeof tzValue === "string" ? Number(tzValue) : null;

  return {
    name,
    dob,
    tob,
    city,
    lat: typeof profile.lat === "number" ? profile.lat : null,
    lon: typeof profile.lon === "number" ? profile.lon : null,
    tz: typeof tzNumber === "number" && Number.isFinite(tzNumber) ? tzNumber : null,
  };
}

function getChartRowBirth(row: Record<string, unknown> | null): BirthDetails | null {
  if (!row) return null;
  const name = typeof row.name === "string" ? row.name : "";
  const dob = typeof row.dob === "string" ? row.dob : "";
  const tob = typeof row.tob === "string" ? row.tob : "";
  const city = typeof row.city === "string" ? row.city : "";
  if (!name || !dob || !tob || !city) return null;

  const tzValue = row.tz ?? row.timezone;
  const tzNumber = typeof tzValue === "number" ? tzValue : typeof tzValue === "string" ? Number(tzValue) : null;

  return {
    name,
    dob,
    tob,
    city,
    lat: typeof row.lat === "number" ? row.lat : null,
    lon: typeof row.lon === "number" ? row.lon : null,
    tz: typeof tzNumber === "number" && Number.isFinite(tzNumber) ? tzNumber : null,
  };
}

function getSavedChartRowBirth(row: Record<string, unknown> | null): BirthDetails | null {
  if (!row) return null;
  const name = typeof row.name === "string" ? row.name : "";
  const dob = typeof row.birth_date === "string" ? row.birth_date : "";
  const tob = typeof row.birth_time === "string" ? row.birth_time.slice(0, 5) : "";
  const city = typeof row.birth_place === "string" ? row.birth_place : "";
  if (!name || !dob || !tob || !city) return null;

  const latitude = row.latitude;
  const longitude = row.longitude;
  const latNumber = typeof latitude === "number" ? latitude : typeof latitude === "string" ? Number(latitude) : null;
  const lonNumber = typeof longitude === "number" ? longitude : typeof longitude === "string" ? Number(longitude) : null;

  const tzValue = row.timezone_offset ?? row.tz ?? row.timezone;
  const tzNumber = typeof tzValue === "number" ? tzValue : typeof tzValue === "string" ? Number(tzValue) : null;

  return {
    name,
    dob,
    tob,
    city,
    lat: typeof latNumber === "number" && Number.isFinite(latNumber) ? latNumber : null,
    lon: typeof lonNumber === "number" && Number.isFinite(lonNumber) ? lonNumber : null,
    tz: typeof tzNumber === "number" && Number.isFinite(tzNumber) ? tzNumber : null,
  };
}

function getLegacyChartRowBirth(row: Record<string, unknown> | null): BirthDetails | null {
  if (!row) return null;
  const name = typeof row.name === "string" ? row.name : "";
  const dob = typeof row.dob === "string" ? row.dob : "";
  const tob = typeof row.tob === "string" ? row.tob : "";
  const city = typeof row.city === "string" ? row.city : "";
  if (!name || !dob || !tob || !city) return null;

  const latitude = row.latitude ?? row.lat;
  const longitude = row.longitude ?? row.lon;
  const tzValue = row.tz ?? row.timezone;
  const tzNumber = typeof tzValue === "number" ? tzValue : typeof tzValue === "string" ? Number(tzValue) : null;

  return {
    name,
    dob,
    tob,
    city,
    lat: typeof latitude === "number" ? latitude : null,
    lon: typeof longitude === "number" ? longitude : null,
    tz: typeof tzNumber === "number" && Number.isFinite(tzNumber) ? tzNumber : null,
  };
}

function legacyChartId(chartId: string) {
  return chartId.startsWith("legacy:");
}

function stripLegacyChartId(chartId: string) {
  return chartId.replace(/^legacy:/, "");
}

function savedChartId(chartId: string) {
  return chartId.startsWith("saved:");
}

function stripSavedChartId(chartId: string) {
  return chartId.replace(/^saved:/, "");
}

export const CHART_STORAGE_EVENT = "astrolife:chart-updated";
export const CHART_CLEARED_EVENT = "astrolife:chart-cleared";

export function saveCurrentChart(chart: ChartData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(chart));
    window.dispatchEvent(new CustomEvent(CHART_STORAGE_EVENT, { detail: chart }));
  } catch (err) {
    console.warn("Could not save chart to device storage:", err);
  }
}

export function clearCurrentChart() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CHART_CLEARED_EVENT));
  } catch (err) {
    console.warn("Could not clear chart from device storage:", err);
  }
}

export function loadCurrentChartFromDevice(): ChartData | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(CHART_STORAGE_KEY);
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  return isStoredChart(parsed) ? reviveChartDates(parsed) : null;
}

export type SaveChartResult =
  | { ok: true; id?: string }
  | { ok: false; duplicate?: boolean; error: string };

export type UserProfileInput = Partial<Pick<BirthDetails, "name" | "dob" | "tob" | "city">> & {
  lat?: number | null;
  lon?: number | null;
  tz?: number | null;
  onboarding_completed?: boolean;
};

export async function ensureUserProfile(input: UserProfileInput = {}) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const payload = {
    id: user.id,
    name: input.name ?? user.user_metadata?.name ?? user.email ?? null,
    dob: input.dob ?? null,
    tob: input.tob ?? null,
    city: input.city ?? null,
    lat: input.lat ?? null,
    lon: input.lon ?? null,
    tz: input.tz ?? null,
    onboarding_completed: input.onboarding_completed ?? false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id,name,dob,tob,city,lat,lon,tz,onboarding_completed")
    .maybeSingle();

  if (error) {
    console.warn("User profile ensure failed:", error);
    return null;
  }

  return data;
}

function chartBirthKey(chart: Pick<ChartData, "name" | "dob" | "tob" | "city">) {
  return `${chart.name.trim().toLowerCase()}|${chart.dob}|${chart.tob}|${chart.city.trim().toLowerCase()}`;
}

/** Load a saved chart without changing which chart is primary. */
export async function loadSavedChart(chartId: string): Promise<ChartData | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    if (legacyChartId(chartId)) {
      const { data, error } = await supabase
        .from("user_charts")
        .select("chart_data,name,dob,tob,city,latitude,longitude")
        .eq("id", stripLegacyChartId(chartId))
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) return null;
      if (data.chart_data && isStoredChart(data.chart_data)) return reviveChartDates(data.chart_data);
      const birth = getLegacyChartRowBirth(data);
      return birth ? buildChart(birth) : null;
    }

    if (savedChartId(chartId)) {
      const { data, error } = await supabase
        .from("saved_charts")
        .select("chart_payload,name,birth_date,birth_time,birth_place,latitude,longitude")
        .eq("id", stripSavedChartId(chartId))
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) return null;
      if (data.chart_payload && isStoredChart(data.chart_payload)) return reviveChartDates(data.chart_payload);
      const birth = getSavedChartRowBirth(data);
      return birth ? buildChart(birth) : null;
    }

    const { data, error } = await supabase
      .from("charts")
      .select("chart_json")
      .eq("id", chartId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data?.chart_json || !isStoredChart(data.chart_json)) return null;
    return reviveChartDates(data.chart_json);
  } catch (error) {
    console.warn("Chart load skipped:", error);
    return null;
  }
}

/** Save an extra chart to the library without switching primary. */
export async function saveAdditionalChart(chart: ChartData): Promise<SaveChartResult> {
  saveCurrentChart(chart);

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sign in to save charts to your account." };
    await ensureUserProfile({
      name: chart.name,
      dob: chart.dob,
      tob: chart.tob,
      city: chart.city,
      lat: chart.lat,
      lon: chart.lon,
    });

    const key = chartBirthKey(chart);
    const { data: existing } = await supabase
      .from("charts")
      .select("id,name,dob,tob,city")
      .eq("user_id", user.id);

    const duplicate = (existing ?? []).some(
      (row: any) => chartBirthKey({
        name: String(row.name),
        dob: String(row.dob),
        tob: String(row.tob),
        city: String(row.city),
      }) === key,
    );
    if (duplicate) return { ok: false, duplicate: true, error: "This chart is already in your library." };

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
      is_primary: false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("charts").insert(payload).select("id").single();
    if (error) throw error;
    return { ok: true, id: data?.id ? String(data.id) : undefined };
  } catch (error) {
    console.warn("Additional chart save skipped:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save chart.",
    };
  }
}

export async function saveChartToAccount(chart: ChartData, options: { replacePrimary?: boolean } = {}) {
  saveCurrentChart(chart);
  const replacePrimary = options.replacePrimary ?? false;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await ensureUserProfile({
      name: chart.name,
      dob: chart.dob,
      tob: chart.tob,
      city: chart.city,
      lat: chart.lat,
      lon: chart.lon,
      onboarding_completed: true,
    });

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

    const primaryCharts = data.map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      dob: String(item.dob),
      tob: String(item.tob),
      city: String(item.city),
      chartType: String(item.chart_type ?? "self"),
      isPrimary: Boolean(item.is_primary),
      createdAt: String(item.created_at),
    }));

    const existingKeys = new Set(primaryCharts.map((item: any) => chartBirthKey(item)));
    const { data: legacyData } = await supabase
      .from("user_charts")
      .select("id,name,dob,tob,city,created_at,is_default")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const legacyCharts = (legacyData ?? [])
      .map((item: any) => ({
        id: `legacy:${String(item.id)}`,
        name: String(item.name),
        dob: String(item.dob),
        tob: String(item.tob),
        city: String(item.city),
        chartType: "self",
        isPrimary: Boolean(item.is_default),
        createdAt: String(item.created_at),
      }))
      .filter((item: any) => !existingKeys.has(chartBirthKey(item)));

    const { data: savedData } = await supabase
      .from("saved_charts")
      .select("id,name,birth_date,birth_time,birth_place,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const nextKeys = new Set([...existingKeys, ...legacyCharts.map((item: any) => chartBirthKey(item))]);
    const savedCharts = (savedData ?? [])
      .map((item: any) => ({
        id: `saved:${String(item.id)}`,
        name: String(item.name),
        dob: String(item.birth_date),
        tob: String(item.birth_time).slice(0, 5),
        city: String(item.birth_place),
        chartType: "self",
        isPrimary: false,
        createdAt: String(item.created_at),
      }))
      .filter((item: any) => !nextKeys.has(chartBirthKey(item)));

    return [...primaryCharts, ...legacyCharts, ...savedCharts];
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

    if (legacyChartId(chartId)) {
      const chart = await loadSavedChart(chartId);
      if (!chart) return null;
      await saveChartToAccount(chart, { replacePrimary: true });
      saveCurrentChart(chart);
      return chart;
    }

    if (savedChartId(chartId)) {
      const chart = await loadSavedChart(chartId);
      if (!chart) return null;
      await saveChartToAccount(chart, { replacePrimary: true });
      saveCurrentChart(chart);
      return chart;
    }

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

export function ianaToUtcOffset(timezone: string | null, dob: string, tob: string): number {
  if (!timezone) return 5.5;

  try {
    const date = new Date(`${dob || "2000-01-01"}T${tob || "12:00"}:00Z`);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "";
    const match = tzPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 5.5;
    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const mins = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours + mins / 60);
  } catch {
    return 5.5;
  }
}

export async function deleteSavedChart(chartId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (savedChartId(chartId)) {
      const id = stripSavedChartId(chartId);
      const res = await fetch(`/api/charts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        return { ok: false, error: payload?.error ?? "Failed to delete chart" };
      }
      return { ok: true };
    }

    if (legacyChartId(chartId)) {
      if (!user) return { ok: false, error: "Unauthorized" };
      const id = stripLegacyChartId(chartId);
      const { error } = await supabase
        .from("user_charts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }

    if (!user) return { ok: false, error: "Unauthorized" };
    const { error } = await supabase
      .from("charts")
      .delete()
      .eq("id", chartId)
      .eq("user_id", user.id);
    if (error) return { ok: false, error: error.message };

    await supabase.from("saved_charts").delete().eq("id", chartId).eq("user_id", user.id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete chart" };
  }
}

export type UpdateChartInput = {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat?: number | null;
  lon?: number | null;
  tz?: number | null;
  gender?: string | null;
};

export async function updateSavedChart(
  chartId: string,
  input: UpdateChartInput
): Promise<{ ok: boolean; chart?: ChartData; error?: string }> {
  try {
    const newChart = calculateChart(
      input.name,
      input.dob,
      input.tob,
      input.city,
      input.lat ?? undefined,
      input.lon ?? undefined,
      input.tz ?? undefined
    );

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (savedChartId(chartId)) {
      const id = stripSavedChartId(chartId);
      const res = await fetch(`/api/charts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          gender: input.gender ?? null,
          birth_date: input.dob,
          birth_time: input.tob,
          birth_place: input.city,
          latitude: input.lat ?? null,
          longitude: input.lon ?? null,
          timezone: input.tz !== null && input.tz !== undefined ? String(input.tz) : null,
          chart_payload: newChart,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        return { ok: false, error: payload?.error ?? "Failed to update chart" };
      }
      return { ok: true, chart: newChart };
    }

    if (legacyChartId(chartId)) {
      if (!user) return { ok: false, error: "Unauthorized" };
      const id = stripLegacyChartId(chartId);
      const { error } = await supabase
        .from("user_charts")
        .update({
          name: input.name,
          dob: input.dob,
          tob: input.tob,
          city: input.city,
          latitude: input.lat ?? null,
          longitude: input.lon ?? null,
          tz: input.tz ?? null,
          chart_data: newChart,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) return { ok: false, error: error.message };
      return { ok: true, chart: newChart };
    }

    if (!user) return { ok: false, error: "Unauthorized" };
    const { error } = await supabase
      .from("charts")
      .update({
        name: input.name,
        dob: input.dob,
        tob: input.tob,
        city: input.city,
        lat: input.lat ?? null,
        lon: input.lon ?? null,
        chart_json: serializeChart(newChart),
        updated_at: new Date().toISOString(),
      })
      .eq("id", chartId)
      .eq("user_id", user.id);

    if (error) return { ok: false, error: error.message };

    await supabase
      .from("saved_charts")
      .update({
        name: input.name,
        gender: input.gender ?? null,
        birth_date: input.dob,
        birth_time: input.tob,
        birth_place: input.city,
        latitude: input.lat ?? null,
        longitude: input.lon ?? null,
        timezone: input.tz !== null && input.tz !== undefined ? String(input.tz) : null,
        chart_payload: newChart,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chartId)
      .eq("user_id", user.id);

    return { ok: true, chart: newChart };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update chart" };
  }
}

let activePrimaryChartPromise: Promise<ChartData | null> | null = null;

export async function loadPrimaryChartFromAccount(existingUser?: any): Promise<ChartData | null> {
  if (activePrimaryChartPromise) {
    return activePrimaryChartPromise;
  }

  activePrimaryChartPromise = (async () => {
    try {
      const supabase = createClient();
      let user = existingUser;
      if (!user) {
        try {
          const res = await supabase.auth.getUser();
          user = res.data?.user;
        } catch (err) {
          return null;
        }
      }
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
    } catch {
      return null;
    } finally {
      activePrimaryChartPromise = null;
    }
  })();

  return activePrimaryChartPromise;
}

export function formatChartContext(chart: ChartData): string {
  const planetSummary = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    .map((planet) => {
      const data = chart.planets[planet];
      if (!data) return null;
      const retro = data.retrograde ? " (Retrograde)" : "";
      const dignity = data.dignity ? ` [${data.dignity}]` : "";
      const nak = data.nakshatra ? ` in ${data.nakshatra}` : "";
      return `${planet}: ${data.sign} H${data.house}${nak}${dignity}${retro}`;
    })
    .filter(Boolean)
    .join(", ");

  const activeDasha = chart.dashas.find((entry) => entry.active);
  const dashaLabel = activeDasha
    ? `${activeDasha.planet} Mahadasha ${activeDasha.start.getFullYear()}-${activeDasha.end.getFullYear()}`
    : "Unknown";

  return `Name: ${chart.name}, DOB: ${chart.dob}, TOB: ${chart.tob}, City: ${chart.city}, Ascendant: ${chart.lagnaRashi} (${chart.lagnaLon.toFixed(1)}°), Placements: ${planetSummary}, Active Dasha: ${dashaLabel}`;
}

let defaultFallbackChart: ChartData | null = null;
function getDefaultPlaceholderChart(): ChartData {
  if (!defaultFallbackChart) {
    defaultFallbackChart = buildChart(PLACEHOLDER_BIRTH);
  }
  return defaultFallbackChart;
}

export function useUserChart(): ChartContextValue {
  const context = useContext(ChartContext);
  if (context) {
    return context;
  }

  // Graceful static fallback if invoked outside of ChartProvider (e.g. in tests)
  return {
    birth: EMPTY_BIRTH,
    chart: getDefaultPlaceholderChart(),
    loading: false,
    hasUserChart: false,
    isDemoChart: true,
    userTier: "free",
    isElite: false,
    refreshChart: async () => {},
    setChartData: () => {},
  };
}
