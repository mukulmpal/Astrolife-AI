"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  buildTransitRipplePayloadFromChart,
  type TransitRipplePayloadMeta,
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
};

export function TransitRipplePanel() {
  const { chart, loading: chartLoading, hasUserChart } = useUserChart();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TransitRippleReport | null>(null);
  const [error, setError] = useState("");

  const payloadResult = useMemo(() => {
    if (!hasUserChart || !chart) return null;

    try {
      return buildTransitRipplePayloadFromChart(chart, "Saturn");
    } catch {
      return null;
    }
  }, [chart, hasUserChart]);

  const payloadMeta: TransitRipplePayloadMeta | null = payloadResult?.meta ?? null;

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
          premium PDF-ready conclusion. The engine now reads your saved birth
          chart, Moon sign, active dasha and current Saturn transit instead of
          sample data.
        </p>

        <div style={contextPanel}>
          <Stat label="Base Chart" value={payloadMeta?.chartName ?? (chartLoading ? "Loading..." : "Not connected")} />
          <Stat label="Birth Place" value={payloadMeta?.chartCity ?? "Save a chart first"} />
          <Stat label="Transit Anchor" value={payloadResult ? `${payloadResult.payload.transitPlanet} in ${payloadResult.payload.transitSign}` : "Waiting"} />
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
          {loading ? "Generating Transit Reading..." : "Generate From My Birth Chart"}
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
              <Stat label="Direct House" value={String(report.directHouse)} />
              <Stat label="Ripple Layers" value={String(report.rippleLayers?.length ?? 0)} />
              <Stat label="PDF Sections" value={String(report.pdfSections?.length ?? 0)} />
              <Stat label="Native" value={report.nativeName} />
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>Aspect Houses</p>
            <h2 style={h2}>Planetary Drishti Impact</h2>
            <div style={stack}>
              {report.aspectHits?.map((hit) => (
                <div key={`${hit.label}-${hit.targetHouse}`} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>House {hit.targetHouse}</strong>
                    <span style={pill}>{hit.strength}/100</span>
                  </div>
                  <p style={muted}>{hit.label}</p>
                  <p style={paragraph}>{hit.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={card}>
            <p style={sectionLabel}>12-House Ripple Map</p>
            <h2 style={h2}>Complete Horoscope Ripple</h2>
            <div style={rippleGrid}>
              {report.twelveHouseRippleTable?.map((row) => (
                <div key={row.house} style={miniCard}>
                  <div style={rowBetween}>
                    <strong>House {row.house}</strong>
                    <span style={pill}>{row.score}/100</span>
                  </div>
                  <p style={muted}>{row.area}</p>
                  <p style={smallCaps}>
                    {row.impactType} · {row.tone}
                  </p>
                  <p style={paragraph}>{row.summary}</p>
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
