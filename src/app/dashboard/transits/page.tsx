"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { calculateTransitReport, PlanetName, TransitBase } from "@/lib/astro-engine/transits";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@/app/dashboard/shared.css";

const PLANETS: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const AREA_ICON: Record<string, string> = { career: "💼", love: "💞", money: "💰", health: "🧘", family: "🏡", spirituality: "🕉️" };

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
    const longitude =
      data?.longitude ??
      data?.lon ??
      data?.lng ??
      data?.degree ??
      data?.absoluteDegree ??
      data?.siderealLongitude ??
      0;
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

export default function TransitPage() {
  const [base, setBase] = useState<TransitBase>("lagna");
  const [today] = useState<Date>(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  });
  const { chart: userChart, loading } = useUserChart();

  const transitChart = useMemo(() => {
    if (!userChart) return null;
    return normalizeChartForTransit(userChart);
  }, [userChart]);

  const report = useMemo(() => {
    if (!transitChart) return null;
    return calculateTransitReport({ chart: transitChart, base, date: today });
  }, [transitChart, base, today]);

  if (loading || !report) {
    return (
      <main className="tr-wrap">
        <div className="tr-shell">
          <section className="tr-card">
            <h1 className="tr-title">Transit Engine</h1>
            <p className="tr-sub">{loading ? "Loading your current Gochar..." : "Please complete onboarding first."}</p>
          </section>
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const topArea = [...report.areaScores].sort((a, b) => b.score - a.score)[0];
  const caution = report.alerts.filter((a) => a.severity === "high" || a.severity === "medium");
  const opportunities = report.alerts.filter((a) => a.type === "opportunity");

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
        .tr-switch{display:flex;gap:8px}
        .tr-btn{padding:8px 14px;border-radius:10px;border:1px solid #2b2452;background:#0d0a22;color:#a39acb;cursor:pointer}
        .tr-btn.active{border-color:rgba(200,160,48,.3);background:rgba(200,160,48,.12);color:#e8cf8b}
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
        @media(max-width:1024px){.span-8,.span-4{grid-column:span 12}.tr-planets,.tr-areas{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:640px){.tr-wrap{padding:20px 14px 98px}.tr-title{font-size:28px}.tr-areas,.tr-planets,.tr-alerts{grid-template-columns:1fr}}
      `}</style>

      <div className="tr-shell">
        <section className="tr-hero">
          <div className="tr-row">
            <div>
              <div className="tr-kicker">Live Gochar</div>
              <h1 className="tr-title">Transit Engine</h1>
              <p className="tr-sub">{today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="tr-switch">
              <button className={`tr-btn ${base === "lagna" ? "active" : ""}`} onClick={() => setBase("lagna")}>Lagna Base</button>
              <button className={`tr-btn ${base === "moon" ? "active" : ""}`} onClick={() => setBase("moon")}>Moon Base</button>
            </div>
          </div>
        </section>

        <section className="tr-grid">
          <article className="tr-card span-8">
            <h2 className="tr-h">Best Window: {topArea.area}</h2>
            <p className="tr-p">{report.summary}</p>
          </article>
          <article className="tr-card span-4">
            <h3 className="tr-h">{report.baseLabel}</h3>
            <p className="tr-p">{base === "lagna" ? "Practical outcomes and event manifestation focus." : "Emotional timing and Moon-based pressure/support focus."}</p>
          </article>

          {caution.length > 0 && (
            <article className="tr-card span-12">
              <div className="tr-row">
                <h3 className="tr-h">Transit Alerts</h3>
                <span className="tr-pill">{caution.length} Active</span>
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
            <h3 className="tr-h">Life Area Strength</h3>
            <div className="tr-areas">
              {report.areaScores.map((a) => (
                <div className="tr-area" key={a.area}>
                  <div className="tr-area-top">
                    <strong>{AREA_ICON[a.area]} {a.area}</strong>
                    <strong>{a.score}</strong>
                  </div>
                  <div className="tr-bar"><div className="tr-fill" style={{ width: `${a.score}%` }} /></div>
                  <p className="tr-muted" style={{ marginTop: 8 }}>{a.summary}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="tr-card span-12">
            <h3 className="tr-h">Planetary Positions</h3>
            <div className="tr-planets">
              {report.planets.map((p) => (
                <div className="tr-planet" key={p.planet}>
                  <div className="tr-row">
                    <strong>{p.planet}</strong>
                    <span className="tr-muted">{p.effect}</span>
                  </div>
                  <p className="tr-muted">{p.rashiName} {p.degreeInRashi}°{p.retrograde ? " ℞" : ""}</p>
                  <p className="tr-muted">H{p.houseFromBase} from {p.baseLabel}</p>
                  {p.natalHitPlanets.length > 0 && <p className="tr-muted">Activates: {p.natalHitPlanets.join(", ")}</p>}
                  <p className="tr-p" style={{ marginTop: 6 }}>{p.note}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>

      <MobileBottomNav />
    </main>
  );
}
