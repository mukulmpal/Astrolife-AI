"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";
import { PremiumFeature } from "@/components/premium-feature";
import {
  calculateSarvatobhadra,
  type SarvatobhadraResult,
} from "@/lib/astro-engine/sarvatobhadra";
import "@/app/dashboard/shared.css";

// ── Planet symbols ─────────────────────────────────────────────
const PLANET_SYMBOL: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mars: "♂",
  Mercury: "☿",
  Jupiter: "♃",
  Venus: "♀",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
};

// ── Planet accent colours ──────────────────────────────────────
const PLANET_COLOR: Record<string, string> = {
  Sun: "#f59e0b",
  Moon: "#e2e8f0",
  Mars: "#ef4444",
  Mercury: "#22c55e",
  Jupiter: "#c8a030",
  Venus: "#f472b6",
  Saturn: "#94a3b8",
  Rahu: "#a855f7",
  Ketu: "#fb923c",
};

function PlanetChip({ planet }: { planet: string }) {
  const sym = PLANET_SYMBOL[planet] ?? planet[0];
  const col = PLANET_COLOR[planet] ?? "#c8c0a8";
  return (
    <span
      title={planet}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: `${col}18`,
        border: `1px solid ${col}40`,
        color: col,
        marginRight: 3,
        marginBottom: 2,
        whiteSpace: "nowrap",
      }}
    >
      {sym} {planet}
    </span>
  );
}

type Tab = "table" | "vedhas" | "about";

export default function SarvatobhadraPage() {
  const { chart, loading } = useUserChart();
  const [activeTab, setActiveTab] = useState<Tab>("table");

  const result: SarvatobhadraResult | null = useMemo(() => {
    if (!chart) return null;
    return calculateSarvatobhadra(chart);
  }, [chart]);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <EngineStateCard
            title="🔯 Sarvatobhadra Chakra"
            loading={loading}
            loadingText="Calculating your nakshatra grid..."
            emptyText="Please complete onboarding to unlock Sarvatobhadra."
          />
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const { rows, vedhaAlerts, birthNakshatra } = result;
  const highAlerts = vedhaAlerts.filter((a) => a.severity === "high");
  const janmaVedhas = vedhaAlerts.filter((a) => a.type === "janma_vedha");

  return (
    <main style={{ minHeight: "100vh", background: "#060410", color: "#f0e8d0", fontFamily: "'Outfit', sans-serif", padding: "30px 22px 110px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        .svb-shell { max-width: 960px; margin: 0 auto; display: grid; gap: 18px; }

        /* Hero */
        .svb-hero {
          background: linear-gradient(135deg, #0e0a28 0%, #130c38 50%, #0a1030 100%);
          border: 1px solid rgba(6,182,212,0.22);
          border-radius: 20px;
          padding: 28px 26px 24px;
          position: relative;
          overflow: hidden;
        }
        .svb-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .svb-hero::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,160,48,0.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .svb-kicker {
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #06b6d4;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .svb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 5vw, 46px);
          line-height: 1.05;
          color: #f0e8d0;
          position: relative;
          z-index: 1;
        }
        .svb-sub {
          font-size: 13px;
          color: #7dd3fc;
          margin-top: 7px;
          position: relative;
          z-index: 1;
          letter-spacing: 0.3px;
        }

        /* Summary bar */
        .svb-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          background: #0d0a22;
          border: 1px solid #1c1840;
          border-radius: 16px;
          padding: 18px 20px;
          align-items: center;
        }
        .svb-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 120px;
        }
        .svb-stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #06b6d4;
          line-height: 1;
        }
        .svb-stat-lbl {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          color: #605890;
        }
        .svb-stat-divider {
          width: 1px;
          height: 36px;
          background: #2a2350;
          flex-shrink: 0;
        }

        /* Explanation card */
        .svb-explain {
          background: #0d0a22;
          border: 1px solid rgba(6,182,212,0.14);
          border-radius: 16px;
          padding: 20px;
        }
        .svb-explain-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #c8a030;
          margin-bottom: 10px;
        }
        .svb-explain-text {
          font-size: 13px;
          color: #b8b0d8;
          line-height: 1.8;
        }
        .svb-explain-text strong { color: #f0e8d0; }

        /* Tabs */
        .svb-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .svb-tab {
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid #2b2452;
          background: #0d0a22;
          color: #a39acb;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s;
        }
        .svb-tab:hover { border-color: rgba(6,182,212,0.3); color: #7dd3fc; }
        .svb-tab.active {
          border-color: rgba(6,182,212,0.4);
          background: rgba(6,182,212,0.1);
          color: #06b6d4;
        }

        /* Table card */
        .svb-table-card {
          background: #0d0a22;
          border: 1px solid #1c1840;
          border-radius: 16px;
          overflow: hidden;
        }
        .svb-table-header {
          padding: 16px 20px;
          border-bottom: 1px solid #1c1840;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .svb-table-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #f0e8d0;
        }
        .svb-legend {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .svb-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #8b80bf;
        }
        .svb-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .svb-table-scroll { overflow-x: auto; }
        table.svb-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        table.svb-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 10px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #605890;
          border-bottom: 1px solid #1c1840;
          white-space: nowrap;
        }
        table.svb-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #130f2a;
          vertical-align: middle;
        }
        table.svb-table tr:last-child td { border-bottom: none; }
        .row-janma td { background: rgba(200,160,48,0.09); }
        .row-janma td:first-child { border-left: 3px solid #c8a030; }
        .row-vedha td { background: rgba(239,68,68,0.07); }
        .row-vedha td:first-child { border-left: 3px solid #ef4444; }
        .row-active td { background: rgba(6,182,212,0.05); }
        .row-normal td:first-child { border-left: 3px solid transparent; }
        .nak-index {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          background: #130f2a;
          color: #605890;
          flex-shrink: 0;
        }
        .nak-index.janma {
          background: rgba(200,160,48,0.18);
          color: #c8a030;
        }
        .nak-index.vedha {
          background: rgba(239,68,68,0.14);
          color: #f87171;
        }
        .nak-name {
          font-weight: 500;
          color: #e0d8f0;
        }
        .type-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .type-janma { background: rgba(200,160,48,0.16); color: #c8a030; border: 1px solid rgba(200,160,48,0.28); }
        .type-vedha { background: rgba(239,68,68,0.14); color: #f87171; border: 1px solid rgba(239,68,68,0.28); }
        .type-normal { background: rgba(96,88,144,0.14); color: #8b80bf; border: 1px solid rgba(96,88,144,0.18); }
        .status-active {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #22c55e;
        }
        .status-active::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34,197,94,0.5);
          flex-shrink: 0;
        }
        .status-inactive { font-size: 11px; color: #3d3666; }

        /* Vedha alerts */
        .svb-vedha-grid {
          display: grid;
          gap: 12px;
        }
        .svb-alert {
          background: #0d0a22;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .svb-alert.high { border: 1px solid rgba(239,68,68,0.35); }
        .svb-alert.medium { border: 1px solid rgba(249,115,22,0.3); }
        .svb-alert-planet {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          font-weight: 700;
        }
        .svb-alert-body { flex: 1; min-width: 0; }
        .svb-alert-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 5px;
        }
        .svb-alert-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: #f0e8d0;
        }
        .svb-alert-nak { font-size: 12px; color: #8b80bf; }
        .svb-sev-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .sev-high { background: rgba(239,68,68,0.16); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
        .sev-medium { background: rgba(249,115,22,0.14); color: #fb923c; border: 1px solid rgba(249,115,22,0.28); }
        .svb-type-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 10px;
          letter-spacing: 0.8px;
        }
        .tag-janma { background: rgba(200,160,48,0.12); color: #c8a030; border: 1px solid rgba(200,160,48,0.24); }
        .tag-sensitive { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.22); }
        .svb-alert-desc { font-size: 12.5px; color: #b8b0d8; line-height: 1.6; }
        .svb-empty {
          background: #0d0a22;
          border: 1px dashed #2b2452;
          border-radius: 16px;
          padding: 40px 28px;
          text-align: center;
        }
        .svb-empty-icon { font-size: 36px; margin-bottom: 12px; }
        .svb-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #22c55e;
          margin-bottom: 6px;
        }
        .svb-empty-sub { font-size: 13px; color: #605890; }

        /* About tab */
        .svb-about {
          display: grid;
          gap: 14px;
        }
        .svb-about-card {
          background: #0d0a22;
          border: 1px solid #1c1840;
          border-radius: 16px;
          padding: 20px;
        }
        .svb-about-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #06b6d4;
          margin-bottom: 10px;
        }
        .svb-about-p {
          font-size: 13px;
          color: #b8b0d8;
          line-height: 1.85;
        }
        .svb-about-p strong { color: #f0e8d0; }
        .svb-planet-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
          font-size: 12.5px;
        }
        .svb-planet-table th {
          text-align: left;
          padding: 8px 12px;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #605890;
          border-bottom: 1px solid #1c1840;
        }
        .svb-planet-table td {
          padding: 9px 12px;
          border-bottom: 1px solid #130f2a;
          color: #c8c0a8;
          vertical-align: middle;
        }
        .svb-planet-table tr:last-child td { border-bottom: none; }
        .svb-planet-sym {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
        }
        .svb-dist-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .svb-dist-chip {
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(6,182,212,0.1);
          border: 1px solid rgba(6,182,212,0.22);
          color: #06b6d4;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .svb-tabs { gap: 6px; }
          .svb-tab { padding: 8px 12px; font-size: 12px; }
          table.svb-table th, table.svb-table td { padding: 8px 10px; }
          .svb-alert { flex-direction: column; }
          .svb-alert-planet { width: 38px; height: 38px; font-size: 18px; }
        }
      `}</style>

      <div className="svb-shell">

        {/* ── Hero ── */}
        <section className="svb-hero">
          <div className="svb-kicker">✦ Vedic Transit Analysis</div>
          <h1 className="svb-title">🔯 Sarvatobhadra Chakra</h1>
          <p className="svb-sub">9×9 Nakshatra Grid · Vedha Detection · Transit Influence Analysis</p>
        </section>

        {/* ── Explanation ── */}
        <div className="svb-explain">
          <div className="svb-explain-title">Sarvatobhadra kya hai?</div>
          <p className="svb-explain-text">
            <strong>Sarvatobhadra Chakra</strong> ek praacheen Vedic transit analysis pranali hai jisme 27
            nakshatras ko ek vishesh grid mein arrange kiya jaata hai. Is system mein <strong>Vedha</strong> (obstruction)
            ke points detect kiye jaate hain — yani jo nakshatras aapke <strong>Janma Nakshatra</strong> se
            kuch vishesh dooriyon par hain, wahan planets ka transit karein to unka prabhav zyaada sensitive hota hai.<br /><br />
            <strong>Janma Nakshatra</strong> (birth star) se 1, 3, 5, 7 nakshatras aage ya peeche the zones
            are called <strong>vedha points</strong>. Jab koi planet in zones mein transit kare, toh unka
            shakti aur prabhav zyaada feel hota hai — achha bhi, bura bhi.
          </p>
        </div>

        {/* ── Summary ── */}
        <div className="svb-summary">
          <div className="svb-stat">
            <div className="svb-stat-val">{birthNakshatra}</div>
            <div className="svb-stat-lbl">Janma Nakshatra</div>
          </div>
          <div className="svb-stat-divider" />
          <div className="svb-stat">
            <div className="svb-stat-val" style={{ color: vedhaAlerts.length > 0 ? "#ef4444" : "#22c55e" }}>
              {vedhaAlerts.length}
            </div>
            <div className="svb-stat-lbl">Active Vedhas Today</div>
          </div>
          <div className="svb-stat-divider" />
          <div className="svb-stat">
            <div className="svb-stat-val" style={{ color: highAlerts.length > 0 ? "#ef4444" : "#22c55e" }}>
              {highAlerts.length}
            </div>
            <div className="svb-stat-lbl">High Severity</div>
          </div>
          <div className="svb-stat-divider" />
          <div className="svb-stat">
            <div className="svb-stat-val" style={{ color: janmaVedhas.length > 0 ? "#c8a030" : "#22c55e" }}>
              {janmaVedhas.length > 0 ? "⚠️ Active" : "✓ Clear"}
            </div>
            <div className="svb-stat-lbl">Janma Vedha</div>
          </div>
        </div>

        <PremiumFeature feature="Sarvatobhadra Chakra">
          {/* ── Tabs ── */}
          <div className="svb-tabs">
            {(
              [
                ["table", "27 Nakshatra Table"],
                ["vedhas", `Active Vedhas (${vedhaAlerts.length})`],
                ["about", "About"],
              ] as [Tab, string][]
            ).map(([t, label]) => (
              <button
                key={t}
                className={`svb-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab: Nakshatra Table ── */}
          {activeTab === "table" && (
            <div className="svb-table-card">
              <div className="svb-table-header">
                <div className="svb-table-title">27 Nakshatra Grid</div>
                <div className="svb-legend">
                  <div className="svb-legend-item">
                    <span className="svb-legend-dot" style={{ background: "rgba(200,160,48,0.6)" }} />
                    <span>Janma (Birth Nak)</span>
                  </div>
                  <div className="svb-legend-item">
                    <span className="svb-legend-dot" style={{ background: "rgba(239,68,68,0.5)" }} />
                    <span>Vedha Sensitive</span>
                  </div>
                  <div className="svb-legend-item">
                    <span className="svb-legend-dot" style={{ background: "rgba(6,182,212,0.4)" }} />
                    <span>Has Planets</span>
                  </div>
                </div>
              </div>
              <div className="svb-table-scroll">
                <table className="svb-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nakshatra</th>
                      <th>Type</th>
                      <th>Natal Planets</th>
                      <th>Transit Today</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const rowClass =
                        row.type === "janma"
                          ? "row-janma"
                          : row.type === "vedha"
                            ? "row-vedha"
                            : row.isActive
                              ? "row-active"
                              : "row-normal";
                      return (
                        <tr key={row.index} className={rowClass}>
                          <td>
                            <span
                              className={`nak-index ${row.type === "janma" ? "janma" : row.type === "vedha" ? "vedha" : ""}`}
                            >
                              {row.index + 1}
                            </span>
                          </td>
                          <td>
                            <span className="nak-name">{row.name}</span>
                          </td>
                          <td>
                            <span
                              className={`type-badge ${
                                row.type === "janma"
                                  ? "type-janma"
                                  : row.type === "vedha"
                                    ? "type-vedha"
                                    : "type-normal"
                              }`}
                            >
                              {row.type === "janma"
                                ? "Janma"
                                : row.type === "vedha"
                                  ? "Vedha"
                                  : "Normal"}
                            </span>
                          </td>
                          <td>
                            {row.natalPlanets.length > 0 ? (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                {row.natalPlanets.map((p) => (
                                  <PlanetChip key={p} planet={p} />
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: "#3d3666", fontSize: 11 }}>—</span>
                            )}
                          </td>
                          <td>
                            {row.transitPlanets.length > 0 ? (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                {row.transitPlanets.map((p) => (
                                  <PlanetChip key={p} planet={p} />
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: "#3d3666", fontSize: 11 }}>—</span>
                            )}
                          </td>
                          <td>
                            {row.isActive ? (
                              <span className="status-active">Active</span>
                            ) : (
                              <span className="status-inactive">Quiet</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Active Vedhas ── */}
          {activeTab === "vedhas" && (
            <>
              {vedhaAlerts.length === 0 ? (
                <div className="svb-empty">
                  <div className="svb-empty-icon">🌿</div>
                  <div className="svb-empty-title">Koi active vedha nahi hai aaj</div>
                  <div className="svb-empty-sub">Period shubh hai — no planetary obstruction detected in sensitive zones</div>
                </div>
              ) : (
                <div className="svb-vedha-grid">
                  {vedhaAlerts.map((alert, i) => {
                    const sym = PLANET_SYMBOL[alert.planet] ?? alert.planet[0];
                    const col = PLANET_COLOR[alert.planet] ?? "#c8c0a8";
                    return (
                      <div key={i} className={`svb-alert ${alert.severity}`}>
                        <div
                          className="svb-alert-planet"
                          style={{
                            background: `${col}18`,
                            border: `1px solid ${col}40`,
                            color: col,
                          }}
                        >
                          {sym}
                        </div>
                        <div className="svb-alert-body">
                          <div className="svb-alert-header">
                            <span className="svb-alert-name">{alert.planet}</span>
                            <span className="svb-alert-nak">in {alert.nakshatra}</span>
                            <span
                              className={`svb-sev-badge ${alert.severity === "high" ? "sev-high" : "sev-medium"}`}
                            >
                              {alert.severity}
                            </span>
                            <span
                              className={`svb-type-tag ${alert.type === "janma_vedha" ? "tag-janma" : "tag-sensitive"}`}
                            >
                              {alert.type === "janma_vedha" ? "Janma Vedha" : "Sensitive Zone"}
                            </span>
                          </div>
                          <p className="svb-alert-desc">{alert.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── Tab: About ── */}
          {activeTab === "about" && (
            <div className="svb-about">
              <div className="svb-about-card">
                <div className="svb-about-h">Sarvatobhadra Chakra kya hai?</div>
                <p className="svb-about-p">
                  <strong>Sarvatobhadra Chakra</strong> ek praachinatam Vedic phalita jyotish ka yantra hai
                  jisme 27 nakshatras ko ek 9×9 grid mein systematically place kiya jaata hai. Is chakra ka
                  upyog transit predictions ke liye hota hai — kab koi grah (planet) kisi sensitive nakshatra
                  zone mein aaye to uska prabhav zyaada intense hota hai.<br /><br />
                  Is system ki visheshta yah hai ki yah sirf planet ka nakshatra nahi dekhta, balki{" "}
                  <strong>relative distance</strong> bhi consider karta hai — aapke birth star se kitni doori
                  par transit hai.
                </p>
              </div>

              <div className="svb-about-card">
                <div className="svb-about-h">Vedha Zones kaise calculate hote hain?</div>
                <p className="svb-about-p">
                  Aapka <strong>Janma Nakshatra</strong> — voh nakshatra jisme aapki janam ke samay Chandra
                  (Moon) tha — yeh base point hai. Is nakshatra se niche diye distance par jo nakshatras hain,
                  woh <strong>Vedha Sensitive Zones</strong> hain:
                </p>
                <div className="svb-dist-row">
                  {[1, 3, 5, 7].map((d) => (
                    <div key={d} className="svb-dist-chip">
                      ±{d} nakshatra
                    </div>
                  ))}
                </div>
                <p className="svb-about-p" style={{ marginTop: 12 }}>
                  Dono taraf (aage aur peeche) in dooriyon par jo nakshatras hain, wahan transit planets ka
                  prabhav direct aur intense hota hai. Janma nakshatra par transit sabse sensitive hota hai —
                  ise <strong>Janma Vedha</strong> kehte hain.
                </p>
              </div>

              <div className="svb-about-card">
                <div className="svb-about-h">Planets ka Vedha Prabhav</div>
                <p className="svb-about-p" style={{ marginBottom: 12 }}>
                  Har planet ka vedha alag alag prabhav deta hai:
                </p>
                <table className="svb-planet-table">
                  <thead>
                    <tr>
                      <th>Planet</th>
                      <th>Symbol</th>
                      <th>Vedha Prabhav</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { planet: "Sun", desc: "Authority / health vitality activation", sev: "medium" },
                      { planet: "Moon", desc: "Emotional sensitivity heightened", sev: "medium" },
                      { planet: "Mars", desc: "Conflict / accident risk", sev: "high" },
                      { planet: "Mercury", desc: "Communication / travel sensitized", sev: "medium" },
                      { planet: "Jupiter", desc: "Opportunity / expansion", sev: "medium" },
                      { planet: "Venus", desc: "Relationship / pleasure activation", sev: "medium" },
                      { planet: "Saturn", desc: "Delay / pressure / karmic weight", sev: "high" },
                      { planet: "Rahu", desc: "Confusion / unexpected events", sev: "high" },
                      { planet: "Ketu", desc: "Past karma activation / spiritual crisis", sev: "high" },
                    ].map(({ planet, desc, sev }) => {
                      const sym = PLANET_SYMBOL[planet];
                      const col = PLANET_COLOR[planet] ?? "#c8c0a8";
                      return (
                        <tr key={planet}>
                          <td style={{ fontWeight: 500, color: "#e0d8f0" }}>{planet}</td>
                          <td>
                            <span
                              className="svb-planet-sym"
                              style={{
                                background: `${col}18`,
                                color: col,
                                border: `1px solid ${col}30`,
                              }}
                            >
                              {sym}
                            </span>
                          </td>
                          <td style={{ color: "#b8b0d8" }}>{desc}</td>
                          <td>
                            <span
                              className={`svb-sev-badge ${sev === "high" ? "sev-high" : "sev-medium"}`}
                            >
                              {sev}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </PremiumFeature>
      </div>

      <MobileBottomNav />
    </main>
  );
}
