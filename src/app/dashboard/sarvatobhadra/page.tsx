"use client";
import { useMemo } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculateSarvatobhadra } from "@/lib/astro-engine/sarvatobhadra";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";

export default function SarvatobhadraPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateSarvatobhadra(chart) : null), [chart]);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <EngineStateCard title="🔯 Sarvatobhadra Chakra" loading={loading} loadingText="Mapping nakshatra grid..." emptyText="Complete onboarding to view chakra." />
        <MobileBottomNav />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
      <style>{`
        .svb-hero { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; margin-bottom: 8px; color: "#06b6d4"; }
        .svb-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .svb-table th, .svb-table td { padding: 10px 12px; text-align: left; border: 1px solid #1c1840; font-size: 12px; }
        .svb-table th { background: #0d0a22; font-weight: 700; color: "#06b6d4"; }
        .svb-table tr.janma { background: rgba(200, 160, 48, 0.1); }
        .svb-table tr.vedha { background: rgba(239, 68, 68, 0.1); }
        .svb-summary { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .svb-summary-item { }
        .svb-label { font-size: 10px; text-transform: uppercase; color: "#06b6d4"; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
        .svb-value { font-size: 16px; font-weight: 700; color: "#f0e8d0"; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="svb-hero">🔯 Sarvatobhadra Chakra</div>
        <div style={{ fontSize: "14px", color: "#b8b0d8", marginBottom: "24px" }}>27 Nakshatra Grid · Vedha Detection · Transit Influence</div>

        <div className="svb-summary">
          <div className="svb-summary-item">
            <div className="svb-label">Birth Nakshatra</div>
            <div className="svb-value">{result.birthNakshatra}</div>
          </div>
          <div className="svb-summary-item">
            <div className="svb-label">Vedha Alerts</div>
            <div className="svb-value" style={{ color: result.vedhaAlerts.length > 0 ? "#ef4444" : "#22c55e" }}>
              {result.vedhaAlerts.length}
            </div>
          </div>
          <div className="svb-summary-item">
            <div className="svb-label">Sensitive Zones</div>
            <div className="svb-value">{result.sensitiveIndices.size}</div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="svb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nakshatra</th>
                <th>Type</th>
                <th>Natal Planets</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.index} className={row.type === "janma" ? "janma" : row.type === "vedha" ? "vedha" : ""}>
                  <td>{row.index + 1}</td>
                  <td>{row.name}</td>
                  <td>
                    {row.type === "janma" ? "⭐ Janma" : row.type === "vedha" ? "⚠️ Vedha" : "—"}
                  </td>
                  <td>{row.natalPlanets.join(", ") || "—"}</td>
                  <td>{row.isActive ? "🔴 Active" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.vedhaAlerts.length > 0 && (
          <div style={{ marginTop: "24px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ef4444", marginBottom: "12px" }}>⚠️ Vedha Alerts</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "10px" }}>
              {result.vedhaAlerts.map((alert, i) => (
                <div key={i} style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "6px", padding: "10px", fontSize: "11px" }}>
                  <strong style={{ color: "#ef4444" }}>{alert.planet}</strong> in <strong>{alert.nakshatra}</strong>
                  <div style={{ color: "#b8b0d8", marginTop: "4px", fontSize: "10px" }}>
                    {alert.type === "janma_vedha" ? "Janma Nakshatra Vedha" : "Sensitive Zone Vedha"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "24px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.25)", borderRadius: "8px", padding: "16px", fontSize: "12px", color: "#b8b0d8", lineHeight: "1.7" }}>
          <strong style={{ color: "#06b6d4" }}>ℹ️ How to Read:</strong> Janma nakshatra (⭐) is your birth position. Vedha zones (⚠️) are 1, 3, 5, 7 positions away—impact areas. Planets in these zones can activate vedha effects. Check back regularly to track transit influences.
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
