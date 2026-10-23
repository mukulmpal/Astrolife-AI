"use client";

import { useMemo, useState } from "react";
import {
  calculateEventRadarReport,
  EventRadarSignal,
  EventRadarDay,
  DecisionWindowType,
} from "@/lib/astro-engine/event-radar";
import { runKPEngine } from "@/lib/astro-engine/kp";
import { calculateDivisional } from "@/lib/astro-engine/divisional";
import { buildMarriageEventRadar, buildMarriageKPIntelligence } from "@/lib/astro-engine/marriage-intelligence-v2";
import {
  analyzeUniversalShodashaVarga,
  extractDashaInput,
  formatVargaLabel,
} from "@/lib/astro-intelligence/universal-shodasha-varga-engine";
import { TransitBase } from "@/lib/astro-engine/transits";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { useUserChart } from "@/lib/user-chart";
import { EngineStateCard } from "@/components/engine-state-card";
import "@/app/dashboard/shared.css";

const AREA_ICON: Record<string, string> = {
  career: "💼",
  love: "💞",
  money: "💰",
  health: "🧘",
  family: "🏡",
  spirituality: "🕉️",
};

const SIGNAL_LABEL: Record<EventRadarSignal, string> = {
  excellent: "Exceptional",
  good: "Favorable",
  mixed: "Balanced",
  caution: "Caution",
  sensitive: "Critical",
};

const DECISION_WINDOW_COLORS: Record<DecisionWindowType, { bg: string; text: string; border: string }> = {
  "Peak Launch": { bg: "rgba(34,197,94,0.12)", text: "#15803d", border: "rgba(34,197,94,0.3)" },
  "Steady Progress": { bg: "rgba(200,160,48,0.12)", text: "#b45309", border: "rgba(200,160,48,0.3)" },
  "Audit & Rest": { bg: "rgba(59,130,246,0.12)", text: "#1d4ed8", border: "rgba(59,130,246,0.3)" },
  "High Caution": { bg: "rgba(239,68,68,0.12)", text: "#b91c1c", border: "rgba(239,68,68,0.3)" },
};

export default function EventRadarPage() {
  const [base, setBase] = useState<TransitBase>("moon");
  const [horizon, setHorizon] = useState<7 | 14 | 30>(30);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"waveform" | "calendar" | "navatara" | "varga" | "marriage">("waveform");
  
  const [startDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });

  const { chart: userChart, loading, hasUserChart } = useUserChart();

  const transitChart = useMemo(() => {
    if (!userChart) return null;
    return normalizeChartForTransit(userChart);
  }, [userChart]);

  const report = useMemo(() => {
    if (!transitChart) return null;
    return calculateEventRadarReport({ chart: transitChart, startDate, days: horizon, base });
  }, [transitChart, startDate, horizon, base]);

  const marriageRadar = useMemo(() => {
    if (!report || !userChart) return null;
    const kp = buildMarriageKPIntelligence(runKPEngine(userChart));
    return buildMarriageEventRadar(report, kp);
  }, [report, userChart]);

  const vargaTiming = useMemo(() => {
    if (!userChart?.planets) return null;
    const divs = calculateDivisional(userChart.planets as never, userChart.lagnaNum, userChart.lagnaLon);
    const universal = analyzeUniversalShodashaVarga({
      language: "hinglish",
      birthTimeConfidence: 86,
      charts: divs,
      dasha: extractDashaInput(userChart),
    });
    return universal.sections.filter((section) => (
      section.chart === "D9" || section.chart === "D10" || section.chart === "D4" || section.chart === "D2"
    ));
  }, [userChart]);

  if (loading || !hasUserChart || !report) {
    return (
      <main className="er-wrap">
        <div className="er-shell">
          <EngineStateCard
            title="Event Radar 2.0"
            loading={loading}
            loadingText="Synthesizing Gochar Transits, Navatara Chakra & Chandrashtama..."
            emptyText="Generate your kundli first to unlock predictive Event Radar."
          />
        </div>
      </main>
    );
  }

  const days: EventRadarDay[] = Array.isArray(report.days) ? report.days : [];
  const selectedDay: EventRadarDay = days[selectedDayIdx] ?? days[0];

  // SVG Waveform Geometry
  const chartWidth = 900;
  const chartHeight = 160;
  const paddingX = 30;
  const paddingY = 24;

  const points = days.map((d, i) => {
    const x = paddingX + (i / Math.max(1, days.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d.overallScore - 15) / 85) * (chartHeight - paddingY * 2);
    return { x, y, day: d, index: i };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : "";

  return (
    <main className="er-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        .er-wrap { min-height: 100vh; background: #FAF7F2; color: #1A1A1A; padding: 28px 20px 100px; font-family: 'Outfit', sans-serif; }
        .er-shell { max-width: 1140px; margin: 0 auto; display: grid; gap: 20px; }
        .er-hero {
          background: linear-gradient(135deg, #100C2A 0%, #1A1242 50%, #2A1750 100%);
          border: 1px solid rgba(200, 160, 48, 0.28);
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 16px 36px rgba(16, 12, 42, 0.12);
          position: relative;
          overflow: hidden;
        }
        .er-hero::after {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(200, 160, 48, 0.16) 0%, transparent 70%);
          pointer-events: none;
        }
        .er-kicker { font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: #E8CF8B; margin-bottom: 6px; font-weight: 600; }
        .er-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; line-height: 1.1; color: #FFF; font-weight: 600; }
        .er-sub { font-size: 13.5px; color: #B3A8E0; margin-top: 6px; max-width: 650px; line-height: 1.6; }
        .er-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
        .er-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 14px; }
        .er-btn-group { display: flex; background: rgba(255, 255, 255, 0.08); padding: 4px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.12); }
        .er-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #DDD5EE;
          cursor: pointer;
          transition: all 0.2s;
        }
        .er-btn.active {
          background: #C8A030;
          color: #100C2A;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(200, 160, 48, 0.4);
        }
        
        .er-tabs { display: flex; gap: 8px; border-bottom: 1px solid rgba(184, 134, 11, 0.2); padding-bottom: 8px; overflow-x: auto; }
        .er-tab {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #6B635B;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .er-tab.active {
          color: #1A1A1A;
          background: #FFF;
          border-color: rgba(184, 134, 11, 0.3);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .er-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
        .span-12 { grid-column: span 12; }
        .span-8 { grid-column: span 8; }
        .span-4 { grid-column: span 4; }
        .span-6 { grid-column: span 6; }
        
        .er-card {
          background: #FFFFFF;
          border: 1px solid rgba(184, 134, 11, 0.18);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
        }
        .er-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 6px;
        }
        .er-card-desc { font-size: 13px; color: #6B635B; line-height: 1.6; margin-bottom: 16px; }
        
        /* Waveform styling */
        .er-wave-box {
          background: #110B29;
          border-radius: 16px;
          padding: 16px;
          position: relative;
          border: 1px solid rgba(200, 160, 48, 0.2);
          overflow: hidden;
        }
        .er-wave-svg { width: 100%; height: auto; display: block; }
        .er-wave-scrubber {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 12px 4px 4px;
          margin-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .er-scrub-chip {
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #CCC;
          cursor: pointer;
          font-size: 11px;
          text-align: center;
          min-width: 64px;
          transition: all 0.2s;
        }
        .er-scrub-chip.active {
          border-color: #C8A030;
          background: rgba(200, 160, 48, 0.25);
          color: #FFF;
          box-shadow: 0 0 10px rgba(200, 160, 48, 0.3);
        }
        .er-scrub-chip.caution {
          border-color: rgba(239, 68, 68, 0.6);
          background: rgba(239, 68, 68, 0.15);
        }

        /* Inspector Cards */
        .er-inspector {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        .er-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .er-score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #FAF7F2;
          border: 3px solid #C8A030;
        }
        .er-score-num { font-size: 28px; font-weight: 800; line-height: 1; color: #1A1A1A; font-family: 'Cormorant Garamond', serif; }
        .er-score-lbl { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: #6B635B; font-weight: 600; }
        
        .er-chandra-alert {
          background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(168,85,247,0.1));
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 14px;
          padding: 14px 18px;
          margin-bottom: 14px;
        }
        
        .er-checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12.5px;
          margin-bottom: 6px;
        }
        .er-checklist-item.do { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.18); color: #166534; }
        .er-checklist-item.dont { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.18); color: #991b1b; }

        .er-area-bar-wrap { margin-bottom: 10px; }
        .er-area-bar-head { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
        .er-area-bar-track { height: 6px; background: #EFEBE4; border-radius: 999px; overflow: hidden; }
        .er-area-bar-fill { height: 100%; border-radius: 999px; }

        @media(max-width: 900px) {
          .span-8, .span-4, .span-6 { grid-column: span 12; }
          .er-inspector { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="er-shell">
        {/* HERO SECTION */}
        <section className="er-hero">
          <div className="er-row">
            <div>
              <div className="er-kicker">Predictive Vedic Chronobiology · Planetary Transit Rhythm</div>
              <h1 className="er-title">Event Radar 2.0</h1>
              <p className="er-sub">
                A multi-layered cosmic timing wave fusing planetary Gochar transits, the 9-fold Navatara Chakra, and classical Chandrashtama detection with modern circadian decision windows.
              </p>
            </div>
            <div className="er-controls">
              <div className="er-btn-group">
                <button className={`er-btn ${base === "moon" ? "active" : ""}`} onClick={() => setBase("moon")}>Moon Base (Chandra)</button>
                <button className={`er-btn ${base === "lagna" ? "active" : ""}`} onClick={() => setBase("lagna")}>Lagna Base (Ascendant)</button>
              </div>
              <div className="er-btn-group">
                <button className={`er-btn ${horizon === 7 ? "active" : ""}`} onClick={() => { setHorizon(7); setSelectedDayIdx(0); }}>7 Days</button>
                <button className={`er-btn ${horizon === 14 ? "active" : ""}`} onClick={() => { setHorizon(14); setSelectedDayIdx(0); }}>14 Days</button>
                <button className={`er-btn ${horizon === 30 ? "active" : ""}`} onClick={() => { setHorizon(30); setSelectedDayIdx(0); }}>30 Days</button>
              </div>
            </div>
          </div>
        </section>

        {/* PRIMARY NAVIGATION TABS */}
        <div className="er-tabs">
          <button className={`er-tab ${activeTab === "waveform" ? "active" : ""}`} onClick={() => setActiveTab("waveform")}>
            📈 {horizon}-Day Waveform & Deep Inspector
          </button>
          <button className={`er-tab ${activeTab === "calendar" ? "active" : ""}`} onClick={() => setActiveTab("calendar")}>
            🗓️ High-Leverage Decision Windows
          </button>
          <button className={`er-tab ${activeTab === "navatara" ? "active" : ""}`} onClick={() => setActiveTab("navatara")}>
            ✨ Classical Navatara Matrix
          </button>
          {vargaTiming && (
            <button className={`er-tab ${activeTab === "varga" ? "active" : ""}`} onClick={() => setActiveTab("varga")}>
              🏛️ Shodasha Varga Prompts (D9/D10/D4/D2)
            </button>
          )}
          {marriageRadar && (
            <button className={`er-tab ${activeTab === "marriage" ? "active" : ""}`} onClick={() => setActiveTab("marriage")}>
              💍 Relationship & Marriage Windows
            </button>
          )}
        </div>

        {/* ── TAB 1: WAVEFORM & INSPECTOR ── */}
        {activeTab === "waveform" && (
          <section className="er-grid">
            <article className="er-card span-12">
              <div className="er-row" style={{ marginBottom: 12 }}>
                <div>
                  <h2 className="er-card-title">Cosmic Timing Waveform ({horizon} Days)</h2>
                  <p className="er-card-desc">
                    Click any point or scrubber node below to inspect that day's Navatara, cognitive readiness score, and planetary execution checklist.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
                  <span style={{ color: "#22c55e" }}>● Peak Launch (≥70)</span>
                  <span style={{ color: "#c8a030" }}>● Steady Progress</span>
                  <span style={{ color: "#3b82f6" }}>● Audit & Rest</span>
                  <span style={{ color: "#ef4444" }}>● Chandrashtama / Caution</span>
                </div>
              </div>

              {/* Interactive SVG Chart */}
              <div className="er-wave-box">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="er-wave-svg">
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8A030" stopOpacity="0.45" />
                      <stop offset="85%" stopColor="#8A2BE2" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#100C2A" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline at Score 50 */}
                  <line
                    x1={paddingX}
                    y1={chartHeight - paddingY - ((50 - 15) / 85) * (chartHeight - paddingY * 2)}
                    x2={chartWidth - paddingX}
                    y2={chartHeight - paddingY - ((50 - 15) / 85) * (chartHeight - paddingY * 2)}
                    stroke="rgba(255,255,255,0.12)"
                    strokeDasharray="4 4"
                  />

                  {/* Area fill */}
                  <path d={areaD} fill="url(#waveGradient)" />

                  {/* Stroke path */}
                  <path d={pathD} fill="none" stroke="#E8CF8B" strokeWidth="2.5" />

                  {/* Nodes */}
                  {points.map((pt) => {
                    const isSelected = pt.index === selectedDayIdx;
                    const isDanger = pt.day.isChandrashtama || pt.day.tara?.quality === "Severe";
                    const isPeak = pt.day.decisionWindow === "Peak Launch";
                    const circleFill = isDanger ? "#EF4444" : isPeak ? "#22C55E" : "#C8A030";

                    return (
                      <g key={pt.index} onClick={() => setSelectedDayIdx(pt.index)} style={{ cursor: "pointer" }}>
                        {isSelected && (
                          <circle cx={pt.x} cy={pt.y} r="10" fill="none" stroke="#FFF" strokeWidth="2" strokeDasharray="2 2" />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? "6" : "4"}
                          fill={circleFill}
                          stroke="#FFF"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Day Scrubber */}
                <div className="er-wave-scrubber">
                  {days.map((d, idx) => (
                    <button
                      key={idx}
                      className={`er-scrub-chip ${idx === selectedDayIdx ? "active" : ""} ${d.isChandrashtama ? "caution" : ""}`}
                      onClick={() => setSelectedDayIdx(idx)}
                    >
                      <div style={{ fontWeight: 700 }}>{d.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.8 }}>{d.overallScore} pts</div>
                      {d.isChandrashtama && <div style={{ fontSize: 9, color: "#fca5a5" }}>⚠️ 8th</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* INSPECTION OF SELECTED DAY */}
              <div className="er-inspector">
                {/* Left card: Core metrics & Windows */}
                <div className="er-card span-6" style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.25)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#C8A030", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
                        {selectedDay.weekday} · {selectedDay.date.split("T")[0]}
                      </div>
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, margin: "2px 0 0", color: "#1A1A1A" }}>
                        {selectedDay.label}: {SIGNAL_LABEL[selectedDay.signal]}
                      </h3>
                      <div style={{ fontSize: 12, color: "#6B635B", marginTop: 2 }}>
                        Moon in {selectedDay.moonNakshatra} ({selectedDay.moonRashi})
                      </div>
                    </div>
                    <div className="er-score-circle">
                      <div className="er-score-num">{selectedDay.overallScore}</div>
                      <div className="er-score-lbl">Score / 100</div>
                    </div>
                  </div>

                  {/* Chandrashtama Alert if active */}
                  {selectedDay.isChandrashtama && (
                    <div className="er-chandra-alert">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#B91C1C", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                        <span>⚠️ CHANDRASHTAMA ACTIVE</span>
                        <span style={{ fontSize: 10, background: "rgba(239,68,68,0.2)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>Sensitive Moon Window</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
                        {selectedDay.chandrashtamaDetail}
                      </p>
                    </div>
                  )}

                  {/* Decision Window & Cognitive Readiness */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                    <span
                      className="er-badge"
                      style={{
                        backgroundColor: DECISION_WINDOW_COLORS[selectedDay.decisionWindow].bg,
                        color: DECISION_WINDOW_COLORS[selectedDay.decisionWindow].text,
                        border: `1px solid ${DECISION_WINDOW_COLORS[selectedDay.decisionWindow].border}`,
                      }}
                    >
                      🧭 Window: {selectedDay.decisionWindow}
                    </span>
                    <span className="er-badge" style={{ backgroundColor: "rgba(168,85,247,0.1)", color: "#7E22CE", border: "1px solid rgba(168,85,247,0.3)" }}>
                      🧠 Cognitive Readiness: {selectedDay.cognitiveReadiness}%
                    </span>
                    <span className="er-badge" style={{ backgroundColor: "rgba(100,116,139,0.1)", color: "#475569", border: "1px solid rgba(100,116,139,0.3)" }}>
                      🎯 Confidence: {selectedDay.confidencePct}%
                    </span>
                  </div>

                  {/* Navatara Badge */}
                  {selectedDay.tara && (
                    <div style={{ background: "#FFF", borderRadius: 12, padding: 12, border: "1px solid rgba(184,134,11,0.2)", marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#C8A030", textTransform: "uppercase" }}>
                          Navatara #{selectedDay.tara.number}: {selectedDay.tara.name} Tara
                        </span>
                        <span style={{ fontSize: 11, color: "#6B635B", fontStyle: "italic" }}>
                          Cycle: {selectedDay.tara.cycleName}
                        </span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
                        {selectedDay.tara.description}
                      </p>
                    </div>
                  )}

                  {/* Daily Advice & Remedy */}
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ background: "#FFF", borderRadius: 12, padding: 12, border: "1px solid rgba(184,134,11,0.15)" }}>
                      <strong style={{ fontSize: 12, color: "#1A1A1A" }}>💡 Strategic Advice:</strong>
                      <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: "4px 0 0" }}>{selectedDay.advice}</p>
                    </div>
                    <div style={{ background: "#FFF", borderRadius: 12, padding: 12, border: "1px solid rgba(184,134,11,0.15)" }}>
                      <strong style={{ fontSize: 12, color: "#1A1A1A" }}>🌿 Classical Remedy:</strong>
                      <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: "4px 0 0" }}>{selectedDay.remedy}</p>
                    </div>
                  </div>
                </div>

                {/* Right card: Execution Checklist & Life Area Breakdown */}
                <div className="er-card span-6" style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.25)" }}>
                  <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#1A1A1A", marginBottom: 10 }}>
                    Execution Protocol & Area Radar
                  </h4>
                  <p style={{ fontSize: 12, color: "#6B635B", marginBottom: 12 }}>
                    High-performance recommendations for {selectedDay.label}.
                  </p>

                  {/* DOs and DONTs */}
                  <div style={{ marginBottom: 16 }}>
                    {selectedDay.actionChecklist.map((item, idx) => (
                      <div key={idx} className={`er-checklist-item ${item.category}`}>
                        <span>{item.category === "do" ? "✅" : "🚫"}</span>
                        <span>{item.action}</span>
                      </div>
                    ))}
                  </div>

                  {/* Area Scores */}
                  <h5 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#6B635B", marginBottom: 8, fontWeight: 700 }}>
                    Life Dimension Breakdown
                  </h5>
                  {selectedDay.areaScores.map((area) => (
                    <div key={area.area} className="er-area-bar-wrap">
                      <div className="er-area-bar-head">
                        <span>{AREA_ICON[area.area]} {area.area.toUpperCase()}</span>
                        <span style={{ color: area.score >= 65 ? "#16a34a" : area.score >= 45 ? "#ca8a04" : "#dc2626" }}>
                          {area.score} / 100
                        </span>
                      </div>
                      <div className="er-area-bar-track">
                        <div
                          className="er-area-bar-fill"
                          style={{
                            width: `${area.score}%`,
                            backgroundColor: area.score >= 65 ? "#22c55e" : area.score >= 45 ? "#c8a030" : "#ef4444",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 11, color: "#78716C", marginTop: 2 }}>{area.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── TAB 2: 30-DAY DECISION CALENDAR ── */}
        {activeTab === "calendar" && (
          <section className="er-grid">
            <article className="er-card span-12">
              <h2 className="er-card-title">Chronobiological Decision Windows</h2>
              <p className="er-card-desc">
                High-leverage categorization of upcoming days to schedule product launches, salary talks, medical appointments, and rest periods.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {/* Peak Launch Windows */}
                <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>🚀</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, color: "#15803d", fontWeight: 700 }}>Peak Launch Windows</h4>
                      <span style={{ fontSize: 11, color: "#166534" }}>Contracts, Launches, Pitches</span>
                    </div>
                  </div>
                  {days.filter(d => d.decisionWindow === "Peak Launch").length === 0 ? (
                    <p style={{ fontSize: 12, color: "#4A4238" }}>No peak launch windows in this range; focus on steady progress.</p>
                  ) : (
                    days.filter(d => d.decisionWindow === "Peak Launch").map((d, i) => (
                      <div key={i} style={{ background: "#FFF", borderRadius: 10, padding: "10px 14px", marginBottom: 8, border: "1px solid rgba(34,197,94,0.2)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, color: "#1A1A1A" }}>
                          <span>{d.label} ({d.weekday})</span>
                          <span style={{ color: "#15803d" }}>{d.overallScore} pts</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#6B635B", marginTop: 2 }}>Best: {AREA_ICON[d.bestArea]} {d.bestArea} · {d.tara?.name} Tara</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Steady Progress Windows */}
                <div style={{ background: "rgba(200,160,48,0.06)", border: "1px solid rgba(200,160,48,0.3)", borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>⚖️</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, color: "#b45309", fontWeight: 700 }}>Steady Progress Windows</h4>
                      <span style={{ fontSize: 11, color: "#92400e" }}>Documentation, Cadence, Meetings</span>
                    </div>
                  </div>
                  {days.filter(d => d.decisionWindow === "Steady Progress").map((d, i) => (
                    <div key={i} style={{ background: "#FFF", borderRadius: 10, padding: "10px 14px", marginBottom: 8, border: "1px solid rgba(200,160,48,0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, color: "#1A1A1A" }}>
                        <span>{d.label} ({d.weekday})</span>
                        <span style={{ color: "#b45309" }}>{d.overallScore} pts</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6B635B", marginTop: 2 }}>{d.tara?.name} Tara · {d.advice.slice(0, 50)}...</div>
                    </div>
                  ))}
                </div>

                {/* Caution & Chandrashtama Windows */}
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>🛑</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, color: "#b91c1c", fontWeight: 700 }}>Caution & Rest Windows</h4>
                      <span style={{ fontSize: 11, color: "#991b1b" }}>Audit, Grounding, No High Risks</span>
                    </div>
                  </div>
                  {days.filter(d => d.decisionWindow === "High Caution" || d.decisionWindow === "Audit & Rest").map((d, i) => (
                    <div key={i} style={{ background: "#FFF", borderRadius: 10, padding: "10px 14px", marginBottom: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, color: "#1A1A1A" }}>
                        <span>{d.label} ({d.weekday})</span>
                        <span style={{ color: "#b91c1c" }}>{d.overallScore} pts</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6B635B", marginTop: 2 }}>
                        {d.isChandrashtama ? "⚠️ Chandrashtama (Moon in 8th)" : `${d.tara?.name} Tara (${d.tara?.quality})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── TAB 3: NAVATARA MATRIX ── */}
        {activeTab === "navatara" && (
          <section className="er-grid">
            <article className="er-card span-12">
              <h2 className="er-card-title">Classical Navatara Chakra</h2>
              <p className="er-card-desc">
                The 27 Nakshatras divided into 3 cycles (Paryayas) of 9 Taras measured from your natal Janma Nakshatra. Each Tara governs specific psychological states and external outcomes.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 14 }}>
                {[
                  { num: 1, name: "Janma", qual: "Neutral", desc: "Body, physical vitality and ego. Mixed for heavy exertion; best for self-care and meditation.", good: "Routine tasks, yoga, inner planning." },
                  { num: 2, name: "Sampat", qual: "Auspicious", desc: "Material wealth, income, and resources. Highly supportive of commercial ventures.", good: "Signing contracts, financial investments, purchasing assets." },
                  { num: 3, name: "Vipat", qual: "Caution", desc: "Obstacles, unforeseen delays, and friction. Vulnerability to travel hitches.", good: "Patience, verification of paperwork, avoiding haste." },
                  { num: 4, name: "Kshema", qual: "Auspicious", desc: "Well-being, safety, domestic peace, and restoration.", good: "Family events, medical healing, consolidating gains." },
                  { num: 5, name: "Pratyari", qual: "Caution", desc: "Opposition, adversarial pushback, and disputes.", good: "Calm diplomacy, quiet work, avoiding legal fights." },
                  { num: 6, name: "Sadhaka", qual: "Auspicious", desc: "Peak achievement, execution, and tangible victory over obstacles.", good: "Launches, major pitches, exams, closing ambitious deals." },
                  { num: 7, name: "Vadh", qual: "Severe Caution", desc: "Fatality or severe depletion. Classical point of high vulnerability.", good: "Restoration, chanting mantras, avoiding speculation or surgical risk." },
                  { num: 8, name: "Mitra", qual: "Auspicious", desc: "Friendship, social goodwill, alliances, and enjoyable connections.", good: "Networking, social events, creative collaborations." },
                  { num: 9, name: "Parama Mitra", qual: "Auspicious", desc: "Supreme benefactor and deepest mentor grace. Breakthrough blessings.", good: "Seeking guidance, momentous initiatives, partnerships." },
                ].map((tara) => (
                  <div key={tara.num} style={{ background: "#FAF7F2", borderRadius: 14, padding: 16, border: "1px solid rgba(184,134,11,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                        #{tara.num} {tara.name} Tara
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                          backgroundColor: tara.qual === "Auspicious" ? "rgba(34,197,94,0.15)" : tara.qual === "Caution" ? "rgba(200,160,48,0.2)" : tara.qual === "Severe Caution" ? "rgba(239,68,68,0.2)" : "rgba(100,116,139,0.15)",
                          color: tara.qual === "Auspicious" ? "#166534" : tara.qual === "Caution" ? "#854d0e" : tara.qual === "Severe Caution" ? "#991b1b" : "#334155",
                        }}
                      >
                        {tara.qual}
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: "0 0 8px" }}>{tara.desc}</p>
                    <div style={{ fontSize: 11.5, color: "#6B635B" }}>
                      <strong>Optimal for:</strong> {tara.good}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {/* ── TAB 4: SHODASHA VARGA TIMING PROMPTS ── */}
        {activeTab === "varga" && vargaTiming && (
          <section className="er-grid">
            <article className="er-card span-12">
              <div className="er-row" style={{ marginBottom: 12 }}>
                <div>
                  <h2 className="er-card-title">Varga-Confirmed Harmonic Support</h2>
                  <p className="er-card-desc">
                    Transits represent immediate cosmic weather; divisional charts (Vargas) determine underlying karmic capacity.
                  </p>
                </div>
                <span className="er-badge" style={{ backgroundColor: "rgba(200,160,48,0.15)", color: "#854d0e" }}>
                  D1 + Varga + Dasha Synthesis
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                {vargaTiming.map((section) => (
                  <div key={section.chart} style={{ background: "#FAF7F2", border: "1px solid rgba(200,160,48,0.2)", borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#C8A030", fontWeight: 800 }}>{section.chart} · {section.shortName}</span>
                      <strong style={{ fontSize: 22, color: "#1A1A1A" }}>{section.score}</strong>
                    </div>
                    <p style={{ fontSize: 11, color: "#78716C", marginBottom: 6 }}>{section.confidenceText} · {formatVargaLabel(section.label)}</p>
                    <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
                      {section.activatedByDasha.length ? `${section.activatedByDasha.join(", ")} dasha activation is live.` : "No direct dasha activation; functions as latent karmic capacity."}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {/* ── TAB 5: MARRIAGE & RELATIONSHIP RADAR ── */}
        {activeTab === "marriage" && marriageRadar && (
          <section className="er-grid">
            <article className="er-card span-12">
              <div className="er-row" style={{ marginBottom: 12 }}>
                <div>
                  <h2 className="er-card-title">{marriageRadar.title}</h2>
                  <p className="er-card-desc">{marriageRadar.paragraph}</p>
                </div>
                <span className="er-badge" style={{ backgroundColor: "rgba(236,72,153,0.15)", color: "#be185d" }}>
                  {marriageRadar.score}/100 · {marriageRadar.label.replaceAll("_", " ")}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                {marriageRadar.windows.length ? marriageRadar.windows.map((window) => (
                  <div key={window.date} style={{ background: "#FAF7F2", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 14, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#6B635B" }}>{window.weekday}</div>
                    <strong style={{ fontSize: 15, color: "#1A1A1A" }}>{window.label}</strong>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#db2777", margin: "4px 0" }}>{window.score}</div>
                    <p style={{ fontSize: 11.5, color: "#6B635B", margin: "0 0 6px" }}>{window.reason}</p>
                    <p style={{ fontSize: 12.5, color: "#4A4238", margin: 0, lineHeight: 1.5 }}>{window.action}</p>
                  </div>
                )) : (
                  <div style={{ background: "#FAF7F2", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 14, padding: 18 }}>
                    <strong>No High-Support Relationship Windows</strong>
                    <p style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                      Use this period for internal healing, emotional repair, and clear boundary setting rather than forcing major commitments.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
