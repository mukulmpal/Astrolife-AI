"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  buildMonthlyTransitRipplePayloadFromChart,
  type MonthlyTransitRipplePayloadResult,
} from "@/lib/astro-engine/transit-master-v2";

type TransitRippleReport = {
  title: string;
  nativeName: string;
  transitName: string;
  periodLabel: string;
  directHouse: number;
  aspectHits: Array<{
    targetHouse: number;
    label: string;
    strength: number;
    meaning: string;
  }>;
  twelveHouseRippleTable: Array<{
    house: number;
    area: string;
    impactType: string;
    score: number;
    tone: string;
    summary: string;
  }>;
  rippleLayers: Array<{
    house: number;
    houseName: string;
    impactType: string;
    intensityScore: number;
    tone: string;
    detailedNarrative: string;
    remedies: string[];
    cautions: string[];
  }>;
  remedySection?: {
    title: string;
    subtitle?: string;
    body: string;
    bullets?: string[];
  };
  finalBookStyleConclusion: string;
  pdfSections: Array<{
    title: string;
    subtitle?: string;
    body: string;
  }>;
  startDate?: string;
  endDate?: string;
  planetsScanned?: number;
  totalTransitPoints?: number;
  topActivationHouses?: Array<{
    house: number;
    score: number;
    area: string;
  }>;
  planetTimelines?: Array<{
    planet: string;
    score: number;
    dashaActive: boolean;
    role: string;
    action: string;
    current: string;
    ending: string;
    signChanged: boolean;
    nakshatraChanged: boolean;
    narrative: string;
    windows: Array<{
      startDate: string;
      endDate: string;
      days: number;
      sign: string;
      nakshatra: string;
      speed: string;
      houseFromAscendant: number;
      houseFromMoon: number;
    }>;
  }>;
  dailyHighlights?: Array<{
    date: string;
    planet: string;
    title: string;
    house: number;
    meaning: string;
  }>;
  dashaTriggerLevel?: string;
  personalForecast?: string[];
  transitHits?: Array<{
    date: string;
    transitPlanet: string;
    natalName: string;
    natalKind: string;
    natalHouse: number;
    aspect: string;
    orb: number;
    score: number;
    meaning: string;
  }>;
  eventScores?: Array<{
    key: string;
    label: string;
    score: number;
    status: string;
    reason: string;
  }>;
  peakWindows?: Array<{
    category: string;
    startDate: string;
    peakDate: string;
    endDate: string;
    score: number;
    reason: string;
    prediction: string;
  }>;
  calendarDays?: Array<{
    date: string;
    score: number;
    tone: string;
    highlights: string[];
  }>;
};

export function TransitRipplePanel() {
  const { chart, loading: chartLoading, hasUserChart } = useUserChart();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TransitRippleReport | null>(null);
  const [error, setError] = useState("");

  const payloadResult = useMemo<MonthlyTransitRipplePayloadResult | null>(() => {
    if (!hasUserChart || !chart) return null;

    try {
      return buildMonthlyTransitRipplePayloadFromChart(chart, 30);
    } catch {
      return null;
    }
  }, [chart, hasUserChart]);

  const payloadMeta = payloadResult?.meta ?? null;

  async function generateTransit() {
    if (!payloadResult) {
      setError("Save or load your birth chart first. Transit Ripple now runs only on your base chart.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch("/api/astro/transit-ripple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadResult.payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Transit Ripple API failed");
      }

      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={pageShell}>
      <div style={heroCard}>
        <p style={eyebrow}>AstroLife Transit Engine</p>
        <h1 style={title}>Transit Ripple V4</h1>
        <p style={subtitle}>
          Direct house, aspect houses, 12-house ripple map, remedies, and
          premium PDF-ready conclusion. The engine now scans all major transits
          for the next one month from your saved birth chart, Moon sign and active
          dasha.
        </p>

        <div style={contextPanel}>
          <Stat label="Base Chart" value={payloadMeta?.chartName ?? (chartLoading ? "Loading..." : "Not connected")} />
          <Stat label="Birth Place" value={payloadMeta?.chartCity ?? "Save a chart first"} />
          <Stat label="Transit Window" value={payloadResult ? `${payloadResult.payload.startDate} to ${payloadResult.payload.endDate}` : "Waiting"} />
          <Stat label="Planets" value={payloadMeta ? String(payloadMeta.planetsScanned.length) : "Waiting"} />
          <Stat label="Dasha" value={payloadResult ? `${payloadResult.payload.currentMahadasha}-${payloadResult.payload.currentAntardasha}` : "Waiting"} />
        </div>

        <button
          type="button"
          onClick={generateTransit}
          disabled={loading || chartLoading || !payloadResult}
          style={{
            ...button,
            opacity: loading || chartLoading || !payloadResult ? 0.65 : 1,
            cursor: loading || chartLoading || !payloadResult ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating One-Month Transit Map..." : "Generate My One-Month Transit Map"}
        </button>

        {!payloadResult && !chartLoading ? (
          <p style={helperText}>
            Open Kundli or Onboarding, save your birth chart as primary, then return here.
          </p>
        ) : null}

        {error ? <pre style={errorBox}>{error}</pre> : null}
      </div>

      {report ? (
        <div style={contentGrid}>
          <section style={card}>
            <p style={sectionLabel}>Main Transit</p>
            <h2 style={h2}>{report.transitName}</h2>
            <div style={statsGrid}>
              <Stat label="From" value={report.startDate ?? payloadResult?.payload.startDate ?? "Now"} />
              <Stat label="To" value={report.endDate ?? payloadResult?.payload.endDate ?? "30 days"} />
              <Stat label="Planets Scanned" value={String(report.planetsScanned ?? 0)} />
              <Stat label="Transit Points" value={String(report.totalTransitPoints ?? 0)} />
              <Stat label="Dasha Trigger" value={report.dashaTriggerLevel ?? "Checking"} />
              <Stat label="PDF Sections" value={String(report.pdfSections?.length ?? 0)} />
              <Stat label="Native" value={report.nativeName} />
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Prediction</p>
            <h2 style={h2}>This Month Personal Forecast</h2>
            <div style={stack}>
              {report.personalForecast?.map((item, index) => (
                <div key={`${item}-${index}`} style={forecastItem}>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Event Scores</p>
            <h2 style={h2}>Life Areas Activated</h2>
            <div style={rippleGrid}>
              {report.eventScores?.slice(0, 8).map((event) => (
                <div key={event.key} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>{event.label}</strong>
                    <span style={{ ...pill, background: `${scoreLabelColor(event.score)}22`, border: `1px solid ${scoreLabelColor(event.score)}55`, color: scoreLabelColor(event.score) }}>
                      {event.score} · {scoreLabel(event.score)}
                    </span>
                  </div>
                  <p style={{ ...smallCaps, color: scoreLabelColor(event.score) }}>{event.status}</p>
                  <p style={paragraph}>{event.reason}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Peak Dates</p>
            <h2 style={h2}>Strongest Timing Windows</h2>
            <div style={rippleGrid}>
              {report.peakWindows?.map((window) => (
                <div key={`${window.category}-${window.peakDate}`} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>{window.category}</strong>
                    <span style={{ ...pill, background: `${scoreLabelColor(window.score)}22`, border: `1px solid ${scoreLabelColor(window.score)}55`, color: scoreLabelColor(window.score) }}>
                      {window.score} · {scoreLabel(window.score)}
                    </span>
                  </div>
                  <p style={muted}>Peak: {window.peakDate}</p>
                  <p style={paragraph}>{window.reason}</p>
                  <p style={paragraph}>{window.prediction}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Strongest Houses</p>
            <h2 style={h2}>Top One-Month Activation Zones</h2>
            <div style={stack}>
              {report.topActivationHouses?.map((hit) => (
                <div key={`house-${hit.house}`} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>House {hit.house}</strong>
                    <span style={{ ...pill, background: `${scoreLabelColor(hit.score)}22`, border: `1px solid ${scoreLabelColor(hit.score)}55`, color: scoreLabelColor(hit.score) }}>
                      {hit.score} · {scoreLabel(hit.score)}
                    </span>
                  </div>
                  <p style={paragraph}>{hit.area}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Technical Proof</p>
            <h2 style={h2}>Closest Natal Hits</h2>
            <div style={rippleGrid}>
              {report.transitHits?.slice(0, 12).map((hit) => (
                <div key={`${hit.date}-${hit.transitPlanet}-${hit.natalName}-${hit.aspect}`} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>{hit.transitPlanet} → {hit.natalName}</strong>
                    <span style={{ ...pill, background: `${scoreLabelColor(hit.score)}22`, border: `1px solid ${scoreLabelColor(hit.score)}55`, color: scoreLabelColor(hit.score) }}>
                      {hit.score} · {scoreLabel(hit.score)}
                    </span>
                  </div>
                  <p style={smallCaps}>{hit.date} · {hit.aspect} · {hit.orb}° orb · H{hit.natalHouse}</p>
                  <p style={paragraph}>{hit.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Calendar</p>
            <h2 style={h2}>Daily Transit Heat</h2>
            <div style={calendarGrid}>
              {report.calendarDays?.map((day) => (
                <div key={day.date} style={calendarCell(day.score)}>
                  <strong>{day.date.slice(5)}</strong>
                  <span>{day.tone}</span>
                  <small>{day.score}</small>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>All Planets</p>
            <h2 style={h2}>Planet-by-Planet Monthly Timeline</h2>
            <div style={rippleGrid}>
              {report.planetTimelines?.map((item) => (
                <div key={item.planet} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>{item.planet}</strong>
                    <span style={{ ...pill, background: `${scoreLabelColor(item.score)}22`, border: `1px solid ${scoreLabelColor(item.score)}55`, color: scoreLabelColor(item.score) }}>
                      {item.score} · {scoreLabel(item.score)}
                    </span>
                  </div>
                  <p style={muted}>{item.current} → {item.ending}</p>
                  <p style={smallCaps}>
                    {item.dashaActive ? "Dasha active · " : ""}{item.signChanged ? "Sign change · " : ""}{item.nakshatraChanged ? "Nakshatra change" : "Steady field"}
                  </p>
                  <p style={paragraph}>{item.narrative}</p>
                  <div style={stack}>
                    {item.windows.slice(0, 3).map((window) => (
                      <div key={`${item.planet}-${window.startDate}-${window.nakshatra}`} style={windowPill}>
                        {window.startDate} to {window.endDate}: H{window.houseFromAscendant} · {window.sign} / {window.nakshatra}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Daily Changes</p>
            <h2 style={h2}>Upcoming Sign / Nakshatra Highlights</h2>
            <div style={rippleGrid}>
              {report.dailyHighlights?.map((item) => (
                <div key={`${item.date}-${item.planet}-${item.title}`} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>{item.date}</strong>
                    <span style={pill}>{item.planet}</span>
                  </div>
                  <p style={muted}>{item.title}</p>
                  <p style={paragraph}>{item.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          {report.remedySection ? (
            <section style={card}>
              <p style={sectionLabel}>Remedies</p>
              <h2 style={h2}>{report.remedySection.title}</h2>
              <p style={paragraphPre}>{report.remedySection.body}</p>
              <div style={stack}>
                {report.remedySection.bullets?.slice(0, 18).map((item, index) => (
                  <div key={`${item}-${index}`} style={remedyItem}>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section style={card}>
            <p style={sectionLabel}>Premium Prediction</p>
            <h2 style={h2}>Final Book-Style Conclusion</h2>
            <p style={paragraphPre}>{report.finalBookStyleConclusion}</p>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={statBox}>
      <p style={muted}>{label}</p>
      <strong style={{ color: "#fff" }}>{value}</strong>
    </div>
  );
}

const pageShell: CSSProperties = {
  minHeight: "100vh",
  padding: "32px",
  background:
    "radial-gradient(circle at top left, rgba(250,204,21,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(124,58,237,0.18), transparent 36%), #070711",
  color: "white",
};

const heroCard: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: 28,
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
};

const eyebrow: CSSProperties = {
  color: "#facc15",
  textTransform: "uppercase",
  letterSpacing: 1.6,
  fontSize: 12,
  fontWeight: 700,
};

const title: CSSProperties = {
  fontSize: 46,
  lineHeight: 1.05,
  margin: "8px 0 12px",
};

const subtitle: CSSProperties = {
  maxWidth: 760,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.75,
};

const button: CSSProperties = {
  marginTop: 22,
  padding: "13px 18px",
  borderRadius: 14,
  border: "none",
  background: "#facc15",
  color: "#111",
  fontWeight: 800,
};

const contextPanel: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
  marginTop: 20,
};

const helperText: CSSProperties = {
  marginTop: 10,
  color: "rgba(255,255,255,0.58)",
  fontSize: 13,
};

const errorBox: CSSProperties = {
  marginTop: 18,
  padding: 16,
  borderRadius: 14,
  background: "rgba(127,29,29,0.7)",
  color: "#fecaca",
  whiteSpace: "pre-wrap",
};

const contentGrid: CSSProperties = {
  maxWidth: 1120,
  margin: "24px auto 0",
  display: "grid",
  gap: 20,
};

const card: CSSProperties = {
  padding: 24,
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.055)",
};

const miniCard: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const sectionLabel: CSSProperties = {
  color: "#facc15",
  textTransform: "uppercase",
  letterSpacing: 1.4,
  fontSize: 12,
  fontWeight: 700,
};

const h2: CSSProperties = {
  fontSize: 26,
  margin: "6px 0 16px",
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const statBox: CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "rgba(0,0,0,0.25)",
};

const stack: CSSProperties = {
  display: "grid",
  gap: 12,
};

const rippleGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const rowBetween: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const pill: CSSProperties = {
  borderRadius: 999,
  padding: "4px 9px",
  background: "rgba(250,204,21,0.12)",
  color: "#fde68a",
  fontSize: 12,
  fontWeight: 700,
};

const muted: CSSProperties = {
  color: "rgba(255,255,255,0.58)",
  margin: "4px 0",
};

const smallCaps: CSSProperties = {
  color: "rgba(255,255,255,0.44)",
  textTransform: "uppercase",
  letterSpacing: 1,
  fontSize: 11,
};

const paragraph: CSSProperties = {
  color: "rgba(255,255,255,0.74)",
  lineHeight: 1.7,
};

const paragraphPre: CSSProperties = {
  color: "rgba(255,255,255,0.78)",
  lineHeight: 1.85,
  whiteSpace: "pre-wrap",
};

const remedyItem: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(250,204,21,0.08)",
  border: "1px solid rgba(250,204,21,0.12)",
  color: "rgba(255,255,255,0.82)",
};

const forecastItem: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  background: "rgba(34,197,94,0.08)",
  border: "1px solid rgba(34,197,94,0.16)",
  color: "rgba(255,255,255,0.84)",
  lineHeight: 1.8,
};

const windowPill: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.72)",
  fontSize: 12,
  lineHeight: 1.5,
};

const calendarGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(86px, 1fr))",
  gap: 8,
};

function calendarCell(score: number): CSSProperties {
  const color = score >= 80 ? "#f97316" : score >= 60 ? "#facc15" : score >= 35 ? "#a78bfa" : "#64748b";
  return {
    minHeight: 72,
    padding: 10,
    borderRadius: 14,
    background: `${color}18`,
    border: `1px solid ${color}44`,
    display: "grid",
    gap: 3,
    alignContent: "center",
    color: "rgba(255,255,255,0.84)",
    fontSize: 12,
  };
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Peak";
  if (score >= 65) return "Strong";
  if (score >= 45) return "Moderate";
  if (score >= 25) return "Supportive";
  return "Background";
}

function scoreLabelColor(score: number): string {
  if (score >= 80) return "#f97316";
  if (score >= 65) return "#facc15";
  if (score >= 45) return "#a78bfa";
  if (score >= 25) return "#94a3b8";
  return "#64748b";
}
