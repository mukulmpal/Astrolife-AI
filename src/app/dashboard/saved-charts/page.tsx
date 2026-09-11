"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCurrentChart, selectSavedChart } from "@/lib/user-chart";
import type { ChartData } from "@/lib/astro-engine/calculations";
import "@/app/dashboard/shared.css";

type SavedChart = {
  id: string;
  name: string;
  gender: string | null;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  chart_payload: ChartData | null;
  created_at: string;
  updated_at: string;
};

export default function SavedChartsPage() {
  const router = useRouter();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCharts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/charts", { cache: "no-store" });
      if (response.status === 401) {
        router.push("/login?next=/dashboard/saved-charts");
        return;
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Could not load charts.");
      setCharts(payload.charts ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load charts.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCharts();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCharts]);

  const handleUseChart = async (id: string) => {
    setWorkingId(id);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/charts/${id}`, { cache: "no-store" });
      if (response.status === 401) {
        router.push("/login?next=/dashboard/saved-charts");
        return;
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Could not open chart.");
      const chart = payload.chart?.chart_payload as ChartData | null;
      if (!chart?.planets) {
        throw new Error("This saved chart does not contain a full chart payload. Re-save it from Kundli.");
      }
      const selectedChart = await selectSavedChart(`saved:${id}`);
      saveCurrentChart(selectedChart ?? chart);
      setMessage(`${(selectedChart ?? chart).name} is now active on this device.`);
      router.push("/dashboard/kundli");
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : "Could not open chart.");
    } finally {
      setWorkingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setWorkingId(id);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/charts/${id}`, { method: "DELETE" });
      if (response.status === 401) {
        router.push("/login?next=/dashboard/saved-charts");
        return;
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error ?? "Could not delete chart.");
      setCharts((items) => items.filter((item) => item.id !== id));
      setMessage("Chart deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete chart.");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <main className="page" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div className="page-tag">Account Storage</div>
      <h1 className="page-title serif">Saved Charts</h1>
      <p className="page-sub">
        Authenticated chart storage powered by Supabase RLS. Each user can read, update and delete only their own charts.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/kundli")}
          style={{ background: "#c8a030", color: "#060410", border: 0, borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
        >
          Generate New Chart
        </button>
        <button
          type="button"
          onClick={loadCharts}
          disabled={loading}
          style={{ background: "#0d0a22", color: "#f0e8d0", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {message && <div className="summary-strip" style={{ marginBottom: 12, color: "#86efac" }}>{message}</div>}
      {error && <div className="summary-strip" style={{ marginBottom: 12, color: "#fca5a5", borderColor: "rgba(239,68,68,.35)" }}>{error}</div>}

      {loading ? (
        <div className="header-card">
          <p style={{ color: "#b8b0d8" }}>Loading saved charts...</p>
        </div>
      ) : charts.length === 0 ? (
        <div className="header-card">
          <h2 className="serif" style={{ marginBottom: 8 }}>No saved charts yet</h2>
          <p style={{ color: "#b8b0d8", lineHeight: 1.7 }}>
            Generate a Kundli, then press Save Chart. Your saved charts will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {charts.map((chart) => (
            <article
              key={chart.id}
              style={{
                background: "#0d0a22",
                border: "1px solid #1c1840",
                borderRadius: 14,
                padding: 18,
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 6 }}>
                {chart.gender || "Birth Chart"}
              </div>
              <h2 className="serif" style={{ fontSize: 24, color: "#f0e8d0", marginBottom: 8 }}>{chart.name}</h2>
              <div style={{ color: "#b8b0d8", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
                DOB: {chart.birth_date}<br />
                TOB: {chart.birth_time.slice(0, 5)}<br />
                Place: {chart.birth_place}<br />
                {chart.latitude !== null && chart.longitude !== null && (
                  <>Coordinates: {Number(chart.latitude).toFixed(2)}, {Number(chart.longitude).toFixed(2)}<br /></>
                )}
                {chart.timezone && <>Timezone: {chart.timezone}</>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  disabled={workingId === chart.id}
                  onClick={() => handleUseChart(chart.id)}
                  style={{ background: "#c8a030", color: "#060410", border: 0, borderRadius: 8, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}
                >
                  {workingId === chart.id ? "Opening..." : "Open / Use Chart"}
                </button>
                <button
                  type="button"
                  disabled={workingId === chart.id}
                  onClick={() => handleDelete(chart.id)}
                  style={{ background: "rgba(239,68,68,.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
