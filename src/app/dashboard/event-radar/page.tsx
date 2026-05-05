"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { calculateEventRadarReport, EventRadarSignal } from "@/lib/astro-engine/event-radar";
import { PlanetName, TransitBase } from "@/lib/astro-engine/transits";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@/app/dashboard/shared.css";

const PLANETS: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const AREA_ICON: Record<string, string> = { career: "💼", love: "💞", money: "💰", health: "🧘", family: "🏡", spirituality: "🕉️" };
const SIGNAL_LABEL: Record<EventRadarSignal, string> = { excellent: "Excellent", good: "Good", mixed: "Mixed", caution: "Caution", sensitive: "Sensitive" };

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function toRashi(value: any): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 0 && value <= 11) return value;
    if (value >= 1 && value <= 12) return value - 1;
    return Math.floor(mod(value, 360) / 30);
  }
  return 0;
}

function getPlanetData(chart: any, planet: PlanetName) {
  const lower = planet.toLowerCase();
  return (
    chart?.planets?.[planet] ??
    chart?.planets?.[lower] ??
    chart?.planetData?.[planet] ??
    chart?.planetData?.[lower] ??
    chart?.grahas?.[planet] ??
    chart?.grahas?.[lower] ??
    {}
  );
}

function normalizeChartForTransit(userChart: any) {
  const raw = userChart?.chart ?? userChart;
  const lagnaRaw =
    raw?.lagR ??
    raw?.lagnaRashi ??
    raw?.ascendantRashi ??
    raw?.ascendant?.rashi ??
    raw?.ascendant?.sign ??
    raw?.lagna?.rashi ??
    raw?.lagna?.sign ??
    raw?.houses?.[0]?.rashi ??
    raw?.houses?.[1]?.rashi ??
    0;
  const lagR = toRashi(lagnaRaw);

  const planets = PLANETS.reduce((acc, planet) => {
    const data = getPlanetData(raw, planet);
    const longitude = data?.longitude ?? data?.lon ?? data?.lng ?? data?.degree ?? data?.absoluteDegree ?? data?.siderealLongitude ?? 0;
    const rashi = toRashi(data?.rashi ?? data?.sign ?? data?.signIndex ?? data?.rashiIndex ?? data?.zodiacSign ?? longitude);
    const house =
      typeof data?.house === "number" && Number.isFinite(data.house)
        ? data.house >= 1 && data.house <= 12
          ? data.house
          : mod(data.house - 1, 12) + 1
        : mod(rashi - lagR, 12) + 1;

    acc[planet] = {
      longitude,
      rashi,
      house,
      rashiName: data?.rashiName ?? data?.signName,
      nakshatra: data?.nakshatra,
      retrograde: Boolean(data?.retrograde ?? data?.isRetrograde),
    };
    return acc;
  }, {} as any);

  return { tz: raw?.tz ?? raw?.timezone ?? 5.5, lagR, planets };
}

export default function EventRadarPage() {
  const [base, setBase] = useState<TransitBase>("moon");
  const [startDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const { chart: userChart, loading } = useUserChart();

  const transitChart = useMemo(() => {
    if (!userChart) return null;
    return normalizeChartForTransit(userChart);
  }, [userChart]);

  const report = useMemo(() => {
    if (!transitChart) return null;
    return calculateEventRadarReport({ chart: transitChart, startDate, days: 7, base });
  }, [transitChart, startDate, base]);

  if (loading || !report) {
    return (
      <main className="er-wrap">
        <div className="er-shell">
          <section className="er-card">
            <h1 className="er-title">Event Radar</h1>
            <p className="er-sub">{loading ? "Scanning your next 7 days..." : "Please complete onboarding first."}</p>
          </section>
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const today = report.days[0];

  return (
    <main className="er-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .er-wrap{min-height:100vh;background:#060410;color:#f0e8d0;padding:30px 22px 110px;font-family:'Outfit',sans-serif}
        .er-shell{max-width:1120px;margin:0 auto;display:grid;gap:16px}
        .er-hero{background:linear-gradient(135deg,#120d30,#1a1140);border:1px solid rgba(200,160,48,.18);border-radius:18px;padding:22px}
        .er-kicker{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:8px}
        .er-title{font-family:'Cormorant Garamond',serif;font-size:34px;line-height:1.1}
        .er-sub{font-size:13px;color:#8b80bf;margin-top:6px}
        .er-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}
        .er-switch{display:flex;gap:8px}
        .er-btn{padding:8px 14px;border-radius:10px;border:1px solid #2b2452;background:#0d0a22;color:#a39acb;cursor:pointer}
        .er-btn.active{border-color:rgba(200,160,48,.3);background:rgba(200,160,48,.12);color:#e8cf8b}
        .er-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
        .er-card{background:#0d0a22;border:1px solid #1f1a42;border-radius:16px;padding:18px}
        .span-8{grid-column:span 8}.span-4{grid-column:span 4}.span-12{grid-column:span 12}
        .er-h{font-family:'Cormorant Garamond',serif;font-size:24px}
        .er-p{font-size:13px;color:#b8b0d8;line-height:1.7}
        .er-pill{font-size:11px;color:#c8a030;border:1px solid rgba(200,160,48,.25);padding:4px 10px;border-radius:999px}
        .er-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px}
        .er-day{background:#0a0720;border:1px solid #221d45;border-radius:12px;padding:12px}
        .er-day-score{font-size:24px;font-weight:700}
        .er-bar{height:6px;border-radius:999px;background:#1a1538;overflow:hidden;margin:8px 0}
        .er-fill{height:100%;background:linear-gradient(90deg,#c8a030,#f5d889)}
        .er-detail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .er-box{background:#0a0720;border:1px solid #221d45;border-radius:12px;padding:12px}
        .er-muted{font-size:12px;color:#8f86b7}
        @media(max-width:1024px){.span-8,.span-4{grid-column:span 12}.er-days{grid-template-columns:repeat(3,minmax(0,1fr))}.er-detail{grid-template-columns:1fr}}
        @media(max-width:640px){.er-wrap{padding:20px 14px 98px}.er-title{font-size:28px}.er-days{grid-template-columns:1fr}}
      `}</style>

      <div className="er-shell">
        <section className="er-hero">
          <div className="er-row">
            <div>
              <div className="er-kicker">7 Day Cosmic Forecast</div>
              <h1 className="er-title">Event Radar</h1>
              <p className="er-sub">Best day {report.bestDay.label} · Caution day {report.cautionDay.label}</p>
            </div>
            <div className="er-switch">
              <button className={`er-btn ${base === "moon" ? "active" : ""}`} onClick={() => setBase("moon")}>Moon Base</button>
              <button className={`er-btn ${base === "lagna" ? "active" : ""}`} onClick={() => setBase("lagna")}>Lagna Base</button>
            </div>
          </div>
        </section>

        <section className="er-grid">
          <article className="er-card span-8">
            <h2 className="er-h">Radar Summary</h2>
            <p className="er-p">{report.summary}</p>
          </article>
          <article className="er-card span-4">
            <h3 className="er-h">Today: {SIGNAL_LABEL[today.signal]}</h3>
            <p className="er-p">Best: {today.bestArea} · Care: {today.cautionArea}</p>
            <p className="er-muted">Score {today.overallScore}/100</p>
          </article>

          <article className="er-card span-12">
            <div className="er-row">
              <h3 className="er-h">7-Day Radar</h3>
              <span className="er-pill">Base: {base === "moon" ? "Moon" : "Lagna"}</span>
            </div>
            <div className="er-days">
              {report.days.map((d) => (
                <div className="er-day" key={d.date}>
                  <div className="er-muted">{d.weekday}</div>
                  <strong>{d.label}</strong>
                  <div className="er-day-score">{d.overallScore}</div>
                  <div className="er-bar"><div className="er-fill" style={{ width: `${d.overallScore}%` }} /></div>
                  <div className="er-muted">{SIGNAL_LABEL[d.signal]}</div>
                  <div className="er-muted">{AREA_ICON[d.bestArea]} {d.bestArea}</div>
                  <div className="er-muted">{AREA_ICON[d.cautionArea]} {d.cautionArea}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="er-card span-12">
            <h3 className="er-h">Today Guidance</h3>
            <div className="er-detail">
              <div className="er-box">
                <strong>Advice</strong>
                <p className="er-p">{today.advice}</p>
              </div>
              <div className="er-box">
                <strong>Remedy</strong>
                <p className="er-p">{today.remedy}</p>
              </div>
            </div>
          </article>
        </section>
      </div>

      <MobileBottomNav />
    </main>
  );
}
