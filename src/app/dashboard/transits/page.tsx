"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { calculateTransitReport, TransitBase } from "@/lib/astro-engine/transits";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { useUserChart } from "@/lib/user-chart";
import NorthIndianChart from "@/components/north-indian-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";
import { useLanguage } from "@/lib/language-context";
import "@/app/dashboard/shared.css";

const TransitRipplePanelV2 = dynamic(
  () => import("@/components/transit/TransitRipplePanelV2").then((mod) => mod.TransitRipplePanelV2),
  { ssr: false },
);

const AREA_ICON: Record<string, string> = {
  career: "💼",
  love: "💞",
  money: "💰",
  health: "🧘",
  family: "🏡",
  spirituality: "🕉️",
};

const BASE_COPY: Record<TransitBase, { label: string; short: string; detail: string; bestFor: string }> = {
  moon: {
    label: "Moon Base",
    short: "Default daily reading",
    detail: "Reads transits from your Moon sign. Best for emotional pressure, felt timing, mental state, and day-to-day decision rhythm.",
    bestFor: "Use first for daily guidance, caution windows, and how the transit will feel.",
  },
  lagna: {
    label: "Lagna Base",
    short: "External event layer",
    detail: "Reads transits from your ascendant. Best for visible events, practical outcomes, body, work, family, and real-world movement.",
    bestFor: "Use second to confirm whether the Moon signal can manifest as an external event.",
  },
};

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

function shiftDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TransitPage() {
  const { tp, ts } = useLanguage();
  const [base, setBase] = useState<TransitBase>("moon");
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
  const [pageTab, setPageTab] = useState<"overview" | "chart" | "ripple">("overview");
  const { chart: userChart, loading, hasUserChart } = useUserChart();

  const transitChart = useMemo(() => {
    if (!userChart) return null;
    return normalizeChartForTransit(userChart);
  }, [userChart]);

  const report = useMemo(() => {
    if (!transitChart) return null;
    return calculateTransitReport({ chart: transitChart, base, date: selectedDate });
  }, [transitChart, base, selectedDate]);

  const chartView = useMemo(() => {
    if (!userChart || !report) return null;
    const lagnaNum =
      base === "lagna"
        ? userChart.lagnaNum
        : Math.floor(((userChart.planets.Moon?.lon ?? 0) % 360) / 30) % 12;

    const planets: Record<string, { house: number; retrograde: boolean }> = {};
    for (const p of report.planets) {
      planets[p.planet] = { house: p.houseFromBase, retrograde: p.retrograde };
    }
    return { lagnaNum, planets };
  }, [userChart, report, base]);

  if (loading || !hasUserChart || !report) {
    return (
      <main className="tr-wrap">
        <div className="tr-shell">
          <EngineStateCard
            title="Transit Engine"
            loading={loading}
            loadingText="Loading your current Gochar..."
            emptyText="Please complete onboarding to unlock transit analysis."
          />
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const areaScores = Array.isArray(report.areaScores) ? report.areaScores : [];
  const topArea = [...areaScores].sort((a, b) => b.score - a.score)[0] ?? {
    area: "balance",
    score: 50,
    summary: "Keep actions steady today.",
  };
  const alerts = Array.isArray(report.alerts) ? report.alerts : [];
  const caution = alerts.filter((a) => a.severity === "high" || a.severity === "medium");
  const opportunities = alerts.filter((a) => a.type === "opportunity");
  const planets = Array.isArray(report.planets) ? report.planets : [];

  return (
    <main className="tr-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .tr-wrap{min-height:100vh;background:#060410;color:#f0e8d0;padding:30px 22px 110px;font-family:'Outfit',sans-serif}
        .tr-shell{max-width:1120px;margin:0 auto;display:grid;gap:16px}
        .tr-hero{background:linear-gradient(135deg,#120d30,#1a1140);border:1px solid rgba(200,160,48,.18);border-radius:18px;padding:22px}
        .tr-kicker{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:8px}
        .tr-title{font-family:'Cormorant Garamond',serif;font-size:34px;line-height:1.1}
        .tr-sub{font-size:13px;color:#8b80bf;margin-top:6px}
        .tr-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}
        .tr-switch{display:flex;gap:8px;flex-wrap:wrap}
        .tr-btn{padding:8px 14px;border-radius:10px;border:1px solid #2b2452;background:#0d0a22;color:#a39acb;cursor:pointer}
        .tr-btn.active{border-color:rgba(200,160,48,.3);background:rgba(200,160,48,.12);color:#e8cf8b}
        .tr-base-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .tr-base-card{text-align:left;padding:13px 14px;border-radius:14px;border:1px solid #2b2452;background:#0d0a22;color:#b8b0d8;cursor:pointer}
        .tr-base-card.active{border-color:rgba(200,160,48,.42);background:rgba(200,160,48,.11);color:#f0e8d0}
        .tr-base-title{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:14px;font-weight:800;color:inherit}
        .tr-base-tag{font-size:10px;text-transform:uppercase;letter-spacing:.9px;color:#c8a030}
        .tr-base-copy{margin:7px 0 0;font-size:12px;line-height:1.55;color:#938ab8}
        .tr-base-card.active .tr-base-copy{color:#c8c0a8}
        .tr-date{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .tr-date input{background:#0d0a22;border:1px solid #2b2452;border-radius:8px;color:#f0e8d0;padding:8px 10px;font-size:13px}
        .tr-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
        .tr-card{background:#0d0a22;border:1px solid #1f1a42;border-radius:16px;padding:18px}
        .span-8{grid-column:span 8}.span-4{grid-column:span 4}.span-12{grid-column:span 12}
        .tr-h{font-family:'Cormorant Garamond',serif;font-size:24px}
        .tr-p{font-size:13px;color:#b8b0d8;line-height:1.7}
        .tr-pill{font-size:11px;color:#c8a030;border:1px solid rgba(200,160,48,.25);padding:4px 10px;border-radius:999px}
        .tr-alerts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}
        .tr-alert{background:#0a0720;border:1px solid #2f274f;border-radius:12px;padding:12px}
        .tr-alert h4{font-size:13px;margin-bottom:6px}
        .tr-alert p{font-size:12px;color:#b8b0d8;line-height:1.6}
        .tr-areas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .tr-area{background:#0a0720;border:1px solid #221d45;border-radius:12px;padding:12px}
        .tr-area-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
        .tr-bar{height:6px;border-radius:999px;background:#1a1538;overflow:hidden}
        .tr-fill{height:100%;background:linear-gradient(90deg,#c8a030,#f5d889)}
        .tr-planets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .tr-planet{background:#0a0720;border:1px solid #221d45;border-radius:12px;padding:12px}
        .tr-muted{color:#8f86b7;font-size:12px}
        .tr-chart-wrap{display:flex;justify-content:center;padding:12px 0}
        @media(max-width:1024px){.span-8,.span-4{grid-column:span 12}.tr-planets,.tr-areas{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:640px){.tr-wrap{padding:20px 14px 98px}.tr-title{font-size:28px}.tr-areas,.tr-planets,.tr-alerts,.tr-base-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="tr-shell">
        <section className="tr-hero">
          <div className="tr-row">
            <div>
              <div className="tr-kicker">Live Gochar</div>
              <h1 className="tr-title">Moon-First Transit Engine</h1>
              <p className="tr-sub">
                {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {BASE_COPY[base].label}
              </p>
            </div>
            <div className="tr-date">
              <button type="button" className="tr-btn" onClick={() => setSelectedDate((d) => shiftDays(d, -1))}>
                ← Prev
              </button>
              <input
                type="date"
                value={toDateInputValue(selectedDate)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setSelectedDate(startOfDay(new Date(`${e.target.value}T12:00:00`)));
                }}
              />
              <button type="button" className="tr-btn" onClick={() => setSelectedDate((d) => shiftDays(d, 1))}>
                Next →
              </button>
              <button type="button" className="tr-btn" onClick={() => setSelectedDate(startOfDay(new Date()))}>
                Now
              </button>
            </div>
          </div>

          <div className="tabs" style={{ marginTop: 16 }}>
            {(["overview", "chart", "ripple"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab ${pageTab === tab ? "active" : ""}`}
                onClick={() => setPageTab(tab)}
              >
                {tab === "overview" ? "Daily Overview" : tab === "chart" ? "Moon/Lagna Chart" : "Monthly Ripple"}
              </button>
            ))}
          </div>
        </section>

        {pageTab === "ripple" ? (
          <TransitRipplePanelV2 />
        ) : pageTab === "chart" ? (
          <section className="tr-card span-12">
            <div className="tr-row" style={{ marginBottom: 12 }}>
              <h2 className="tr-h">Transit Chart</h2>
              <div className="tr-switch">
                <button type="button" className={`tr-btn ${base === "moon" ? "active" : ""}`} onClick={() => setBase("moon")}>
                  Moon base · default
                </button>
                <button type="button" className={`tr-btn ${base === "lagna" ? "active" : ""}`} onClick={() => setBase("lagna")}>
                  Lagna base
                </button>
              </div>
            </div>
            <p className="tr-p" style={{ marginBottom: 16 }}>
              {BASE_COPY[base].detail} Planets below are shown in houses from your {base === "lagna" ? "ascendant" : "Moon sign"}.
            </p>
            {chartView && (
              <div className="tr-chart-wrap">
                <NorthIndianChart lagnaNum={chartView.lagnaNum} planets={chartView.planets} size={340} />
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="tr-hero" style={{ padding: 16 }}>
              <div className="tr-base-grid">
                {(["moon", "lagna"] as const).map((nextBase) => (
                  <button
                    key={nextBase}
                    type="button"
                    className={`tr-base-card ${base === nextBase ? "active" : ""}`}
                    onClick={() => setBase(nextBase)}
                  >
                    <div className="tr-base-title">
                      <span>{BASE_COPY[nextBase].label}</span>
                      <span className="tr-base-tag">{BASE_COPY[nextBase].short}</span>
                    </div>
                    <p className="tr-base-copy">{BASE_COPY[nextBase].detail}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="tr-grid">
              <article className="tr-card span-8">
                <h2 className="tr-h">Best window: {topArea.area}</h2>
                <p className="tr-p">{report.summary}</p>
                <p className="tr-muted" style={{ marginTop: 10 }}>{BASE_COPY[base].bestFor}</p>
              </article>
              <article className="tr-card span-4">
                <h3 className="tr-h">{report.baseLabel}</h3>
                <p className="tr-p">{BASE_COPY[base].detail}</p>
              </article>

              {caution.length > 0 && (
                <article className="tr-card span-12">
                  <div className="tr-row">
                    <h3 className="tr-h">Transit alerts</h3>
                    <span className="tr-pill">{caution.length} active</span>
                  </div>
                  <div className="tr-alerts">
                    {caution.slice(0, 4).map((a, i) => (
                      <div className="tr-alert" key={`${a.title}-${i}`}>
                        <h4>{a.title}</h4>
                        <p>{a.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {opportunities.length > 0 && (
                <article className="tr-card span-12">
                  <h3 className="tr-h">Opportunities</h3>
                  <div className="tr-alerts">
                    {opportunities.slice(0, 4).map((a, i) => (
                      <div className="tr-alert" key={`${a.title}-${i}`}>
                        <h4>{a.title}</h4>
                        <p>{a.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              <article className="tr-card span-12">
                <h3 className="tr-h">Life area strength</h3>
                <div className="tr-areas">
                  {areaScores.map((a) => (
                    <div className="tr-area" key={a.area}>
                      <div className="tr-area-top">
                        <strong>
                          {AREA_ICON[a.area]} {a.area}
                        </strong>
                        <strong>{a.score}</strong>
                      </div>
                      <div className="tr-bar">
                        <div className="tr-fill" style={{ width: `${a.score}%` }} />
                      </div>
                      <p className="tr-muted" style={{ marginTop: 8 }}>
                        {a.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="tr-card span-12">
                <h3 className="tr-h">Planetary positions</h3>
                <div className="tr-planets">
                  {planets.map((p) => (
                    <div className="tr-planet" key={p.planet}>
                      <div className="tr-row">
                        <strong>{tp(p.planet)}</strong>
                        <span className="tr-muted">{p.effect}</span>
                      </div>
                      <p className="tr-muted">
                        {ts(p.rashiName)} {p.degreeInRashi}°{p.retrograde ? " (R)" : ""}
                      </p>
                      <p className="tr-muted">
                        H{p.houseFromBase} from {p.baseLabel}
                      </p>
                      {p.natalHitPlanets.length > 0 && (
                        <p className="tr-muted">Activates: {p.natalHitPlanets.join(", ")}</p>
                      )}
                      <p className="tr-p" style={{ marginTop: 6 }}>
                        {p.note}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
