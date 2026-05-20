"use client";

import { useMemo, useState } from "react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";
import { calculateTransitReport, type NatalChartForTransit } from "@/lib/astro-engine/transits";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { generateCombinedTransitPurchaseGuidance } from "@/lib/astro-engine/transit-purchase-combined";
import { useUserChart } from "@/lib/user-chart";
import "@/app/dashboard/shared.css";

const SAMPLE_CHART: NatalChartForTransit = {
  tz: 5.5,
  lagR: 0,
  planets: {
    Sun: { rashi: 4, house: 5, longitude: 132 },
    Moon: { rashi: 11, house: 12, longitude: 345 },
    Mars: { rashi: 2, house: 3, longitude: 74 },
    Mercury: { rashi: 5, house: 6, longitude: 164 },
    Jupiter: { rashi: 1, house: 2, longitude: 51 },
    Venus: { rashi: 6, house: 7, longitude: 184 },
    Saturn: { rashi: 9, house: 10, longitude: 294 },
    Rahu: { rashi: 7, house: 8, longitude: 218 },
    Ketu: { rashi: 1, house: 2, longitude: 38 },
  },
};

function Badge({ verdict }: { verdict: string }) {
  const color =
    verdict === "AVOID" ? "#ff6b7a" :
    verdict === "WAIT" || verdict === "GIFT_CAUTION" ? "#e8a33a" :
    verdict === "BUY_CAREFULLY" || verdict === "CAUTION" ? "#d8bf67" :
    "#71d99a";
  return <span className="tp-badge" style={{ color, borderColor: `${color}66`, background: `${color}12` }}>{verdict}</span>;
}

export default function TransitPurchasePage() {
  const { chart, loading } = useUserChart();
  const [useSample, setUseSample] = useState(false);

  const activeChart = useMemo(() => {
    if (useSample) return SAMPLE_CHART;
    if (!chart) return null;
    return normalizeChartForTransit(chart);
  }, [chart, useSample]);

  const guidance = useMemo(() => {
    if (!activeChart) return null;
    const transitReport = calculateTransitReport({ chart: activeChart, base: "lagna", date: new Date() });
    return generateCombinedTransitPurchaseGuidance({
      transitReport,
      lalKitab: {
        currentMahadasha: "Saturn",
        currentAntardasha: "Mercury",
        currentPratyantardasha: "Saturn",
        activePlanets: ["Saturn"],
      },
    });
  }, [activeChart]);

  if (loading && !useSample) {
    return (
      <main className="tp-wrap">
        <div className="tp-shell">
          <EngineStateCard
            title="Gochar Purchase Guidance"
            loading={loading}
            loadingText="Loading your chart..."
            emptyText="Complete onboarding or run sample guidance."
          />
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  return (
    <main className="tp-wrap">
      <style>{`
        .tp-wrap{min-height:100vh;background:#060410;color:#f0e8d0;padding:30px 22px 110px;font-family:Outfit,system-ui,sans-serif}
        .tp-shell{max-width:1120px;margin:0 auto;display:grid;gap:16px}
        .tp-hero{background:linear-gradient(135deg,#100c2a,#1a123f);border:1px solid rgba(200,160,48,.18);border-radius:18px;padding:22px}
        .tp-row{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
        .tp-kicker{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:8px}
        .tp-title{font-family:'Cormorant Garamond',serif;font-size:34px;line-height:1.1}
        .tp-sub{font-size:13px;color:#9b92c8;margin-top:6px;line-height:1.6}
        .tp-btn{border:1px solid rgba(200,160,48,.35);background:rgba(200,160,48,.12);color:#e8cf8b;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
        .tp-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
        .tp-card{background:#0d0a22;border:1px solid #221d45;border-radius:16px;padding:18px}
        .span-12{grid-column:span 12}.span-7{grid-column:span 7}.span-5{grid-column:span 5}.span-6{grid-column:span 6}
        .tp-h{font-family:'Cormorant Garamond',serif;font-size:24px;margin-bottom:8px}
        .tp-p{font-size:13px;color:#b8b0d8;line-height:1.7}
        .tp-badge{display:inline-flex;border:1px solid;border-radius:999px;padding:4px 10px;font-size:10px;font-weight:800;letter-spacing:.08em}
        .tp-list{display:grid;gap:10px;margin-top:12px}
        .tp-item{background:#09061d;border:1px solid #261f4c;border-radius:12px;padding:12px}
        .tp-item-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:6px}
        .tp-muted{font-size:12px;color:#8e84b8;line-height:1.6}
        .tp-chip{font-size:11px;color:#c8a030;border:1px solid rgba(200,160,48,.25);padding:4px 8px;border-radius:999px}
        @media(max-width:900px){.span-7,.span-5,.span-6{grid-column:span 12}.tp-title{font-size:28px}}
      `}</style>

      <div className="tp-shell">
        <section className="tp-hero">
          <div className="tp-row">
            <div>
              <div className="tp-kicker">Gochar + Lal Kitab Object Grammar</div>
              <h1 className="tp-title">Gochar Purchase Guidance</h1>
              <p className="tp-sub">
                Buy, wait, or avoid guidance using standard Gochar timing plus Lal Kitab object and gift caution.
                Lal Kitab 35-sala chakra, varshphal and monthly phal are separate methods.
              </p>
            </div>
            <button className="tp-btn" type="button" onClick={() => setUseSample(true)}>Run Sample Guidance</button>
          </div>
        </section>

        {!guidance ? (
          <EngineStateCard
            title="Chart Required"
            emptyText="Complete onboarding or click Run Sample Guidance."
          />
        ) : (
          <section className="tp-grid">
            <article className="tp-card span-7">
              <div className="tp-row">
                <div>
                  <h2 className="tp-h">Overall: {guidance.overall}</h2>
                  <p className="tp-p">{guidance.summary}</p>
                  <p className="tp-muted" style={{ marginTop: 8 }}>{guidance.methodNote}</p>
                </div>
                <Badge verdict={guidance.overall} />
              </div>
            </article>
            <article className="tp-card span-5">
              <div className="tp-kicker">Strongest Warning</div>
              <h2 className="tp-h">{guidance.strongestWarning}</h2>
              <p className="tp-p">This is the first object/timing signal to handle before making a purchase.</p>
            </article>

            <article className="tp-card span-12">
              <div className="tp-row">
                <h2 className="tp-h">Gochar Buying Windows</h2>
                <span className="tp-chip">{guidance.transit.windows.length} categories</span>
              </div>
              <div className="tp-list">
                {guidance.transit.windows.map((window) => (
                  <div className="tp-item" key={window.id}>
                    <div className="tp-item-top">
                      <div>
                        <strong>{window.title}</strong>
                        <p className="tp-muted">{window.timing}</p>
                      </div>
                      <Badge verdict={window.verdict} />
                    </div>
                    <p className="tp-p">{window.guidance}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="tp-card span-12">
              <div className="tp-row">
                <h2 className="tp-h">Lal Kitab Object & Gift Caution</h2>
                <span className="tp-chip">Not 35-sala / varshphal</span>
              </div>
              <div className="tp-list">
                {guidance.lalKitab.map((item) => (
                  <div className="tp-item" key={item.id}>
                    <div className="tp-item-top">
                      <div>
                        <strong>{item.title}</strong>
                        <p className="tp-muted">{item.activeTriggers.length ? item.activeTriggers.join(" · ") : "No active trigger"}</p>
                      </div>
                      <Badge verdict={item.verdict} />
                    </div>
                    <p className="tp-p">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="tp-card span-6">
              <h2 className="tp-h">Avoid / Wait</h2>
              <div className="tp-list">
                {guidance.avoid.map((item) => <div className="tp-item" key={`${item.source}-${item.title}`}><strong>{item.title}</strong><p className="tp-muted">{item.reason}</p></div>)}
              </div>
            </article>
            <article className="tp-card span-6">
              <h2 className="tp-h">Buy Carefully / Favourable</h2>
              <div className="tp-list">
                {[...guidance.buyCarefully, ...guidance.favourable].map((item) => <div className="tp-item" key={`${item.source}-${item.title}`}><strong>{item.title}</strong><p className="tp-muted">{item.reason}</p></div>)}
              </div>
            </article>
          </section>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
