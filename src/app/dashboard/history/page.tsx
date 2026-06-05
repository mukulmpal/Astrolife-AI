"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EducationTooltip } from "@/components/education-tooltip";
import {
  listSavedCharts,
  loadSavedChart,
  saveAdditionalChart,
  selectSavedChart,
  type SavedChartSummary,
  useUserChart,
} from "@/lib/user-chart";
import "@/app/dashboard/shared.css";

export default function HistoryPage() {
  const router = useRouter();
  const { chart, hasUserChart } = useUserChart();
  const [charts, setCharts] = useState<SavedChartSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const refreshCharts = useCallback(async () => {
    setLoading(true);
    try {
      setCharts(await listSavedCharts());
    } catch (error) {
      console.error("Load charts error:", error);
      setSaveError("Could not load your chart library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialCharts() {
      try {
        const savedCharts = await listSavedCharts();
        if (active) setCharts(savedCharts);
      } catch (error) {
        console.error("Load charts error:", error);
        if (active) setSaveError("Could not load your chart library.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadInitialCharts();

    return () => {
      active = false;
    };
  }, []);

  const handleSaveChart = async () => {
    if (!chart || !hasUserChart) return;
    setSaveMessage("");
    setSaveError("");
    const result = await saveAdditionalChart(chart);
    if (result.ok) {
      setSaveMessage("Chart saved to your library.");
      await refreshCharts();
      return;
    }
    if (result.duplicate) {
      setSaveError("This birth data is already saved. Select it below to load.");
      return;
    }
    setSaveError(result.error);
  };

  const handleSelectChart = async (chartId: string) => {
    setSwitchingId(chartId);
    setSaveMessage("");
    setSaveError("");
    const loaded = await selectSavedChart(chartId);
    if (loaded) {
      setSaveMessage("Primary chart updated. Redirecting to Kundli…");
      router.push("/dashboard/kundli");
    } else {
      const preview = await loadSavedChart(chartId);
      if (preview) {
        setSaveError("Could not set primary chart. Try again from My Kundli.");
      } else {
        setSaveError("Could not load this chart.");
      }
    }
    setSwitchingId(null);
  };

  return (
    <main className="page" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div className="page-tag">Chart Library</div>
      <h1 className="page-title serif">Chart History</h1>
      <p className="page-sub">
        Save and switch between charts. Learn <EducationTooltip term="house_1">about Lagna</EducationTooltip> and your birth chart structure.
      </p>

      {hasUserChart && chart && (
        <div style={{ marginBottom: 20 }}>
          <button
            type="button"
            onClick={handleSaveChart}
            style={{
              background: "#c8a030",
              color: "#060410",
              border: "none",
              borderRadius: 6,
              padding: "10px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save current chart: {chart.name}
          </button>
        </div>
      )}

      {saveMessage && (
        <div className="summary-strip" style={{ marginBottom: 12, color: "#22c55e" }}>
          {saveMessage}
        </div>
      )}
      {saveError && (
        <div className="summary-strip" style={{ marginBottom: 12, color: "#ef4444", borderColor: "rgba(239,68,68,0.35)" }}>
          {saveError}
        </div>
      )}

      <div className="header-card" style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a030", marginBottom: 6 }}>
            Understanding your chart
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.8, color: "#b8b0d8", margin: 0 }}>
            Your birth chart is a snapshot of planetary positions at your exact birth moment — 9 planets across 12 houses and 27 nakshatras.
          </p>
          <ul style={{ fontSize: 12, color: "#b8b0d8", margin: "12px 0 0 20px" }}>
            <li><strong>Kundali:</strong> Core planetary positions</li>
            <li><strong>Yogas:</strong> Auspicious combinations (e.g. <EducationTooltip term="yoga">Gaja Kesari</EducationTooltip>)</li>
            <li><strong>Dasha:</strong> Current life period (<EducationTooltip term="dasha">what is Dasha?</EducationTooltip>)</li>
          </ul>
        </div>
      </div>

      <h3 className="serif" style={{ marginBottom: 16, color: "#f0e8d0" }}>
        Saved charts ({charts.length})
      </h3>

      {loading ? (
        <p style={{ textAlign: "center", color: "#b8b0d8", padding: 40 }}>Loading charts…</p>
      ) : charts.length === 0 ? (
        <div style={{ textAlign: "center", color: "#b8b0d8", padding: 40, background: "rgba(200,160,48,0.05)", borderRadius: 8 }}>
          No saved charts yet. Save your current chart to build a family library.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {charts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectChart(c.id)}
              disabled={switchingId === c.id}
              style={{
                textAlign: "left",
                background: "#0d0a22",
                border: `1px solid ${c.isPrimary ? "rgba(200,160,48,0.45)" : "#1c1840"}`,
                borderRadius: 12,
                padding: 16,
                cursor: switchingId === c.id ? "wait" : "pointer",
                color: "inherit",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16, color: "#c8a030", marginBottom: 8 }}>
                {c.name}
                {c.isPrimary && (
                  <span style={{ marginLeft: 8, fontSize: 10, color: "#22c55e", textTransform: "uppercase" }}>
                    Primary
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#b8b0d8" }}>
                {c.dob} at {c.tob}
                <br />
                {c.city}
                <br />
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 11, color: "#605890", marginTop: 10 }}>
                {switchingId === c.id ? "Loading…" : "Tap to set as primary chart"}
              </div>
            </button>
          ))}
        </div>
      )}

      <MobileBottomNav />
    </main>
  );
}
