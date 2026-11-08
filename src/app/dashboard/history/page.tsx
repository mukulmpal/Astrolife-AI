"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EducationTooltip } from "@/components/education-tooltip";
import {
  listSavedCharts,
  loadSavedChart,
  saveAdditionalChart,
  selectSavedChart,
  type SavedChartSummary,
  useUserChart,
} from "@/lib/user-chart";
import {
  getPurchasedReports,
  triggerDossierDownload,
  type PurchasedReportRecord,
} from "@/lib/user-reports";
import "@/app/dashboard/shared.css";

export default function HistoryPage() {
  const router = useRouter();
  const { chart, hasUserChart } = useUserChart();
  const [charts, setCharts] = useState<SavedChartSummary[]>([]);
  const [purchasedReports, setPurchasedReports] = useState<PurchasedReportRecord[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const refreshPurchasedReports = useCallback(() => {
    setPurchasedReports(getPurchasedReports());
  }, []);

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
    refreshPurchasedReports();

    const handleReportPurchased = () => {
      refreshPurchasedReports();
    };

    window.addEventListener("astrolife:report-purchased", handleReportPurchased);

    return () => {
      active = false;
      window.removeEventListener("astrolife:report-purchased", handleReportPurchased);
    };
  }, [refreshPurchasedReports]);

  const handleDownloadPurchasedPdf = async (record: PurchasedReportRecord) => {
    try {
      setDownloadingId(record.id);
      await triggerDossierDownload(
        { id: record.reportId, title: record.title, orderId: record.orderId, paymentId: record.paymentId },
        chart,
        record.seekerName || chart?.name
      );
    } catch (err) {
      console.error("Failed to download dossier:", err);
      alert("Error downloading dossier. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

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
              color: "#FAF7F2",
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
          <p style={{ fontSize: 12, lineHeight: 1.8, color: "#6B635B", margin: 0 }}>
            Your birth chart is a snapshot of planetary positions at your exact birth moment — 9 planets across 12 houses and 27 nakshatras.
          </p>
          <ul style={{ fontSize: 12, color: "#6B635B", margin: "12px 0 0 20px" }}>
            <li><strong>Kundali:</strong> Core planetary positions</li>
            <li><strong>Yogas:</strong> Auspicious combinations (e.g. <EducationTooltip term="yoga">Gaja Kesari</EducationTooltip>)</li>
            <li><strong>Dasha:</strong> Current life period (<EducationTooltip term="dasha">what is Dasha?</EducationTooltip>)</li>
          </ul>
        </div>
      </div>

      {/* MY PURCHASED SACRED DOSSIERS SECTION */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#B8860B", fontWeight: 700 }}>
              ✦ Sacred Reports Vault
            </div>
            <h3 className="serif" style={{ margin: "2px 0 0", color: "#1A1A1A", fontSize: 20 }}>
              My Purchased Dossiers ({purchasedReports.length})
            </h3>
          </div>
          <Link
            href="/reports"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#c8a030",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(200,160,48,0.1)",
              border: "1px solid rgba(200,160,48,0.25)",
            }}
          >
            + Store Catalog →
          </Link>
        </div>

        {purchasedReports.length === 0 ? (
          <div
            style={{
              padding: "20px 24px",
              background: "#FFFFFF",
              border: "1px dashed rgba(184,134,11,0.3)",
              borderRadius: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              No custom life dossiers purchased yet
            </div>
            <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.6 }}>
              Get comprehensive 24-page mathematical reports on Sacred Union, Career Yogas, Astro-Vastu, and 10-Year Destiny Horary timelines. Pay once, keep your official vector PDF forever.
            </div>
            <div style={{ marginTop: 4 }}>
              <Link
                href="/reports"
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#FAF7F2",
                  background: "linear-gradient(135deg, #c8a030, #a07820)",
                  padding: "8px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                Browse Reports Catalog (From ₹49) →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
            {purchasedReports.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(184,134,11,0.25)",
                  borderRadius: 14,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: "#a07820", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                    Official Dossier • {rec.price}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 6, lineHeight: 1.3 }}>
                    {rec.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B635B", lineHeight: 1.5 }}>
                    <strong>Recipient:</strong> {rec.seekerName || "Seeker"}
                    <br />
                    <strong>Purchased:</strong> {new Date(rec.purchasedAt).toLocaleDateString()}
                    <br />
                    <span style={{ fontFamily: "monospace", fontSize: 10 }}>Order: {rec.orderId}</span>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    disabled={downloadingId === rec.id}
                    onClick={() => handleDownloadPurchasedPdf(rec)}
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #c8a030, #a07820)",
                      border: "none",
                      color: "#FAF7F2",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: downloadingId === rec.id ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {downloadingId === rec.id ? (
                      <>
                        <span style={{ fontSize: 14 }}>⟳</span>
                        <span>Compiling PDF...</span>
                      </>
                    ) : (
                      <>
                        <span>📥</span>
                        <span>Download Dossier (PDF)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="serif" style={{ marginBottom: 16, color: "#1A1A1A" }}>
        Saved charts ({charts.length})
      </h3>

      {loading ? (
        <p style={{ textAlign: "center", color: "#6B635B", padding: 40 }}>Loading charts…</p>
      ) : charts.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6B635B", padding: 40, background: "rgba(200,160,48,0.05)", borderRadius: 8 }}>
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
                background: "#FFFFFF",
                border: `1px solid ${c.isPrimary ? "rgba(200,160,48,0.45)" : "#FFFFFF"}`,
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
              <div style={{ fontSize: 12, color: "#6B635B" }}>
                {c.dob} at {c.tob}
                <br />
                {c.city}
                <br />
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 11, color: "#6B635B", marginTop: 10 }}>
                {switchingId === c.id ? "Loading…" : "Tap to set as primary chart"}
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
