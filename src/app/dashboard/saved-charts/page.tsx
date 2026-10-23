"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveCurrentChart,
  selectSavedChart,
  deleteSavedChart,
  useUserChart,
} from "@/lib/user-chart";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import EditChartModal from "@/components/charts/EditChartModal";
import DeleteChartModal from "@/components/charts/DeleteChartModal";
import { Edit2, Trash2, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
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
  const { setChartData, chart: activeChart } = useUserChart();

  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingChart, setEditingChart] = useState<SavedChart | null>(null);
  const [deletingChart, setDeletingChart] = useState<SavedChart | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      let chart = payload.chart?.chart_payload as ChartData | null;
      if (!chart?.planets) {
        const item = payload.chart;
        if (item?.name && item?.birth_date && item?.birth_time && item?.birth_place) {
          chart = calculateChart(
            item.name,
            item.birth_date,
            item.birth_time,
            item.birth_place,
            item.latitude ?? undefined,
            item.longitude ?? undefined,
            item.timezone ? Number(item.timezone) : undefined,
          );
        } else {
          throw new Error("This saved chart does not contain valid birth details.");
        }
      }

      const selectedChart = await selectSavedChart(`saved:${id}`);
      const finalChart = selectedChart ?? chart;

      // ── Instant reactive propagation to all components & storage ──
      setChartData(finalChart);
      saveCurrentChart(finalChart);

      setMessage(`${finalChart.name}'s chart is now active.`);
      router.push("/dashboard/kundli");
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : "Could not open chart.");
    } finally {
      setWorkingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingChart) return;
    setIsDeleting(true);
    setMessage("");
    setError("");

    try {
      const result = await deleteSavedChart(`saved:${deletingChart.id}`);
      if (!result.ok) {
        throw new Error(result.error || "Could not delete chart.");
      }

      setCharts((items) => items.filter((item) => item.id !== deletingChart.id));
      setMessage(`"${deletingChart.name}"'s chart has been deleted.`);
      setDeletingChart(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete chart.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChartSaved = (updatedChart: ChartData, chartId: string) => {
    setCharts((prev) =>
      prev.map((c) =>
        c.id === chartId
          ? {
              ...c,
              name: updatedChart.name,
              birth_date: updatedChart.dob,
              birth_time: updatedChart.tob,
              birth_place: updatedChart.city,
              latitude: updatedChart.lat,
              longitude: updatedChart.lon,
              timezone: String(updatedChart.tz),
              chart_payload: updatedChart,
              updated_at: new Date().toISOString(),
            }
          : c
      )
    );
    setMessage(`Chart for "${updatedChart.name}" has been updated.`);
  };

  return (
    <main className="page" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div className="page-tag">Account Storage</div>
      <h1 className="page-title serif">Saved Charts</h1>
      <p className="page-sub">
        Secure, authenticated chart storage. Select any chart to open it immediately across all astrological modules, or edit and delete saved profiles anytime.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/kundli")}
          style={{
            background: "#c8a030",
            color: "#FAF7F2",
            border: 0,
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Sparkles size={15} />
          Generate New Chart
        </button>
        <button
          type="button"
          onClick={loadCharts}
          disabled={loading}
          style={{
            background: "#B8860B",
            color: "#FFFFFF",
            border: "1px solid #B8860B",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {message && (
        <div
          className="summary-strip"
          style={{
            marginBottom: 16,
            color: "#15803D",
            borderColor: "rgba(21,128,61,0.25)",
            background: "rgba(21,128,61,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div
          className="summary-strip"
          style={{
            marginBottom: 16,
            color: "#DC2626",
            borderColor: "rgba(220,38,38,0.25)",
            background: "rgba(220,38,38,0.06)",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="header-card">
          <p style={{ color: "#6B635B" }}>Loading saved charts...</p>
        </div>
      ) : charts.length === 0 ? (
        <div className="header-card">
          <h2 className="serif" style={{ marginBottom: 8 }}>
            No saved charts yet
          </h2>
          <p style={{ color: "#6B635B", lineHeight: 1.7 }}>
            Generate a Kundli and click &quot;Save Chart&quot; to store family and client profiles here for 1-click access.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {charts.map((chart) => {
            const isActive =
              activeChart &&
              activeChart.name.toLowerCase() === chart.name.toLowerCase() &&
              activeChart.dob === chart.birth_date;

            return (
              <article
                key={chart.id}
                style={{
                  background: isActive ? "linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 100%)" : "#FFFFFF",
                  border: isActive
                    ? "2px solid rgba(184, 134, 11, 0.65)"
                    : "1px solid rgba(184, 134, 11, 0.22)",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: isActive
                    ? "0 8px 24px rgba(184, 134, 11, 0.12)"
                    : "0 2px 8px rgba(0, 0, 0, 0.02)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#6B635B",
                        fontWeight: 600,
                      }}
                    >
                      {chart.gender || "Birth Chart"}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#B8860B",
                          background: "rgba(184, 134, 11, 0.12)",
                          padding: "3px 8px",
                          borderRadius: 20,
                          border: "1px solid rgba(184, 134, 11, 0.3)",
                        }}
                      >
                        ✦ Active Chart
                      </span>
                    )}
                  </div>

                  <h2
                    className="serif"
                    style={{
                      fontSize: 22,
                      color: "#1A1A1A",
                      marginBottom: 10,
                      fontWeight: 700,
                    }}
                  >
                    {chart.name}
                  </h2>

                  <div
                    style={{
                      color: "#4A4238",
                      fontSize: 13,
                      lineHeight: 1.8,
                      marginBottom: 18,
                      padding: "8px 12px",
                      background: "#FAF8F5",
                      borderRadius: 10,
                      border: "1px solid rgba(184, 134, 11, 0.08)",
                    }}
                  >
                    <div><strong>DOB:</strong> {chart.birth_date}</div>
                    <div><strong>TOB:</strong> {chart.birth_time.slice(0, 5)}</div>
                    <div><strong>Place:</strong> {chart.birth_place}</div>
                    {chart.latitude !== null && chart.longitude !== null && (
                      <div style={{ fontSize: 12, color: "#6B635B" }}>
                        GPS: {Number(chart.latitude).toFixed(2)}°, {Number(chart.longitude).toFixed(2)}°
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                    borderTop: "1px solid rgba(184, 134, 11, 0.1)",
                    paddingTop: 14,
                  }}
                >
                  <button
                    type="button"
                    disabled={workingId === chart.id}
                    onClick={() => handleUseChart(chart.id)}
                    style={{
                      flex: "1 1 auto",
                      background: isActive ? "#B8860B" : "#c8a030",
                      color: "#FFFFFF",
                      border: 0,
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <ExternalLink size={14} />
                    {workingId === chart.id ? "Opening..." : isActive ? "Open (Active)" : "Open Chart"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingChart(chart)}
                    title="Edit birth details"
                    style={{
                      background: "#FFFFFF",
                      color: "#4A4238",
                      border: "1px solid rgba(184, 134, 11, 0.3)",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Edit2 size={13} color="#B8860B" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingChart(chart)}
                    title="Delete saved chart"
                    style={{
                      background: "rgba(220, 38, 38, 0.05)",
                      color: "#DC2626",
                      border: "1px solid rgba(220, 38, 38, 0.22)",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <EditChartModal
        isOpen={Boolean(editingChart)}
        chart={editingChart}
        onClose={() => setEditingChart(null)}
        onSaved={handleChartSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteChartModal
        isOpen={Boolean(deletingChart)}
        chartName={deletingChart?.name || ""}
        onClose={() => setDeletingChart(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </main>
  );
}
