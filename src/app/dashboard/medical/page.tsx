"use client";
import { useMemo } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculateMedical } from "@/lib/astro-engine/medical";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";

export default function MedicalPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateMedical(chart) : null), [chart]);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <EngineStateCard title="🏥 Medical Astrology" loading={loading} loadingText="Analyzing health patterns..." emptyText="Complete onboarding to view analysis." />
        <MobileBottomNav />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
      <style>{`
        .med-hero { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; margin-bottom: 8px; color: "#f87171"; }
        .med-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
        .med-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 16px; }
        .med-title { font-weight: 700; font-size: 14px; color: "#2dd4bf"; margin-bottom: 8px; }
        .med-text { font-size: 12px; color: "#b8b0d8; line-height: 1.6; }
        .med-alert { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 10px; margin-bottom: 10px; font-size: 11px; color: "#ef4444"; }
        .med-high { color: "#ef4444; font-weight: 700; }
        .med-banner { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 12px; margin-bottom: 24px; font-size: 12px; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="med-hero">🏥 Medical Astrology</div>
        <div style={{ fontSize: "14px", color: "#b8b0d8", marginBottom: "16px" }}>Dr. S. Krishna Kumar Method · Pattern Detection · Natal Analysis</div>

        <div className="med-banner">
          ⚕️ <strong>Disclaimer:</strong> Pattern-detection awareness layer only. For diagnosis, consult registered doctors.
        </div>

        <div className="med-grid">
          <div className="med-card">
            <div className="med-title">🧬 Lagna Sign</div>
            <div className="med-text">{result.lagnaSign}</div>
          </div>

          <div className="med-card">
            <div className="med-title">⭐ Birth Nakshatra</div>
            <div className="med-text">{result.birthNakshatra}</div>
          </div>

          <div className="med-card">
            <div className="med-title">🔍 Nakshatra Tendency</div>
            <div className="med-text">{result.nakshatraDisease}</div>
          </div>

          <div className="med-card">
            <div className="med-title">⚠️ Accident Risk</div>
            <div className="med-text" style={{ fontSize: "20px", fontWeight: "700", color: result.accidentRisk > 50 ? "#ef4444" : "#fbbf24" }}>
              {result.accidentRisk}%
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#2dd4bf" }}>📋 Health Alerts</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
            {result.alerts.slice(0, 6).map((alert, i) => (
              <div key={i} className={`med-card ${alert.severity === "high" ? "med-high" : ""}`}>
                <div className="med-text">
                  <strong>{alert.planet}</strong> — H{alert.house} <br/>
                  <span style={{ color: alert.severity === "high" ? "#ef4444" : "#f97316" }}>● {alert.severity.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.topConcerns.length > 0 && (
          <div style={{ marginTop: "24px", background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.25)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f97316", marginBottom: "12px" }}>🎯 Top Concerns</h3>
            <ul style={{ fontSize: "12px", color: "#b8b0d8", marginLeft: "20px" }}>
              {result.topConcerns.map((concern, i) => <li key={i}>{concern}</li>)}
            </ul>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
