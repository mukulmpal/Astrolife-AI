"use client";

import { useMemo, useState } from "react";
import { EngineStateCard } from "@/components/engine-state-card";
import { PremiumFeature } from "@/components/premium-feature";
import { calculateTransitReport } from "@/lib/astro-engine/transits";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { generateCombinedTransitPurchaseGuidance } from "@/lib/astro-engine/transit-purchase-combined";
import { generatePlanetPurchaseReport } from "@/lib/astro-engine/transit-planet-purchase";
import type { PlanetName } from "@/lib/astro-engine/transits";
import type { LalKitabPlanet } from "@/lib/lal-kitab";
import { useUserChart } from "@/lib/user-chart";
import "@/app/dashboard/shared.css";

const LAL_KITAB_PLANETS = new Set<LalKitabPlanet>(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]);

function toLalKitabPlanet(value: string | undefined, fallback: LalKitabPlanet): LalKitabPlanet {
  return LAL_KITAB_PLANETS.has(value as LalKitabPlanet) ? value as LalKitabPlanet : fallback;
}

function activeDashaPlanet(entries: Array<{ planet?: string; active?: boolean }> | undefined, fallback: LalKitabPlanet) {
  return toLalKitabPlanet(entries?.find((entry) => entry.active)?.planet ?? entries?.[0]?.planet, fallback);
}

function buildLalKitabTiming(chart: ReturnType<typeof useUserChart>["chart"] | null) {
  if (!chart) return undefined;

  const currentMahadasha = activeDashaPlanet(chart.dashas, "Moon");
  const currentAntardasha = activeDashaPlanet(chart.antardasha, currentMahadasha);
  const activePlanets = Array.from(new Set([currentMahadasha, currentAntardasha].filter(Boolean)));

  return {
    currentMahadasha,
    currentAntardasha,
    currentPratyantardasha: currentAntardasha,
    activePlanets,
  };
}

function Badge({ verdict }: { verdict: string }) {
  const color =
    verdict === "AVOID" ? "#b91c1c" :
    verdict === "WAIT" || verdict === "GIFT_CAUTION" ? "#d97706" :
    verdict === "BUY_CAREFULLY" || verdict === "CAUTION" ? "#B8860B" :
    "#15803d";
  return <span className="tp-badge" style={{ color, borderColor: `${color}66`, background: `${color}15` }}>{verdict}</span>;
}

export default function TransitPurchasePage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const [activePlanet, setActivePlanet] = useState<PlanetName>("Sun");

  const activeChart = useMemo(() => {
    if (!hasUserChart || !chart) return null;
    return normalizeChartForTransit(chart);
  }, [chart, hasUserChart]);

  const transitReport = useMemo(() => {
    if (!activeChart) return null;
    return calculateTransitReport({ chart: activeChart, base: "moon", date: new Date() });
  }, [activeChart]);

  const guidance = useMemo(() => {
    if (!transitReport) return null;
    const lalKitab = buildLalKitabTiming(chart);
    return generateCombinedTransitPurchaseGuidance({ transitReport, lalKitab });
  }, [transitReport, chart]);

  const planetReport = useMemo(() => {
    if (!transitReport) return null;
    return generatePlanetPurchaseReport(transitReport);
  }, [transitReport]);

  const activePlanetGuidance = useMemo(
    () => planetReport?.planets.find((p) => p.planet === activePlanet) ?? planetReport?.planets[0] ?? null,
    [planetReport, activePlanet]
  );

  if (loading || !hasUserChart) {
    return (
      <main className="tp-wrap">
        <div className="tp-shell">
          <EngineStateCard
            title="Gochar Purchase Guidance"
            loading={loading}
            loadingText="Loading your chart..."
            emptyText="Generate your kundli first to unlock purchase guidance."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="tp-wrap">
      <style>{`
        .tp-wrap{min-height:100vh;background:#FAF7F2;color:#1A1A1A;padding:30px 22px 110px;font-family:Outfit,system-ui,sans-serif}
        .tp-shell{max-width:1120px;margin:0 auto;display:grid;gap:16px}
        .tp-hero{background:#FFFFFF;border:1px solid rgba(184,134,11,0.22);border-radius:18px;padding:22px;box-shadow:0 4px 20px rgba(0,0,0,0.03)}
        .tp-row{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
        .tp-kicker{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8860B;margin-bottom:8px;font-weight:700}
        .tp-title{font-family:'Cormorant Garamond',serif;font-size:34px;line-height:1.1;color:#1A1A1A}
        .tp-sub{font-size:13px;color:#6B635B;margin-top:6px;line-height:1.6}
        .tp-btn{border:1px solid rgba(184,134,11,0.35);background:rgba(184,134,11,0.12);color:#B8860B;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
        .tp-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
        .tp-card{background:#FFFFFF;border:1px solid rgba(184,134,11,0.2);border-radius:16px;padding:18px;box-shadow:0 4px 20px rgba(0,0,0,0.03)}
        .span-12{grid-column:span 12}.span-7{grid-column:span 7}.span-5{grid-column:span 5}.span-6{grid-column:span 6}
        .tp-h{font-family:'Cormorant Garamond',serif;font-size:24px;margin-bottom:8px;color:#1A1A1A}
        .tp-p{font-size:13px;color:#4A4238;line-height:1.7}
        .tp-badge{display:inline-flex;border:1px solid;border-radius:999px;padding:4px 10px;font-size:10px;font-weight:800;letter-spacing:.08em}
        .tp-list{display:grid;gap:10px;margin-top:12px}
        .tp-item{background:#FAF7F2;border:1px solid rgba(184,134,11,0.18);border-radius:12px;padding:12px}
        .tp-item-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:6px}
        .tp-muted{font-size:12px;color:#6B635B;line-height:1.6}
        .tp-chip{font-size:11px;color:#B8860B;background:#FAF7F2;border:1px solid rgba(184,134,11,0.25);padding:4px 8px;border-radius:999px}
        .tp-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
        .tp-tab{display:flex;align-items:center;gap:7px;border:1px solid rgba(184,134,11,0.2);background:#FAF7F2;color:#6B635B;border-radius:12px;padding:8px 13px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s}
        .tp-tab:hover{border-color:#B8860B;color:#1A1A1A}
        .tp-tab.active{background:rgba(184,134,11,0.15);border-color:#B8860B;color:#B8860B}
        .tp-tab .glyph{font-size:16px;line-height:1}
        .tp-tab .dot{width:7px;height:7px;border-radius:999px}
        .tp-planet-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
        .tp-planet-title{display:flex;align-items:center;gap:12px}
        .tp-glyph-lg{font-size:34px;line-height:1;color:#B8860B}
        .tp-snap{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:14px}
        .tp-snap-item{background:#FFFFFF;border:1px solid rgba(184,134,11,0.18);border-radius:10px;padding:10px 12px}
        .tp-snap-k{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#8C827A}
        .tp-snap-v{font-size:14px;font-weight:700;color:#1A1A1A;margin-top:3px}
        .tp-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
        .tp-bullet{font-size:12.5px;color:#4A4238;line-height:1.65;padding-left:16px;position:relative}
        .tp-bullet::before{content:"";position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:999px}
        .tp-good::before{background:#15803d}.tp-bad::before{background:#b91c1c}.tp-neutral::before{background:#B8860B}
        .tp-objects{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
        .tp-obj{font-size:11.5px;color:#4A4238;background:#FFFFFF;border:1px solid rgba(184,134,11,0.2);border-radius:999px;padding:5px 11px}
        @media(max-width:900px){.span-7,.span-5,.span-6{grid-column:span 12}.tp-title{font-size:28px}.tp-cols{grid-template-columns:1fr}}
      `}</style>

      <PremiumFeature feature="Gochar Purchase Guidance">
      <div className="tp-shell">
        <section className="tp-hero">
          <div className="tp-row">
            <div>
              <div className="tp-kicker">Gochar + Lal Kitab Object Grammar</div>
              <h1 className="tp-title">Gochar Purchase Guidance</h1>
              <p className="tp-sub">
                Buy, wait, or avoid guidance using Moon-first Gochar timing plus Lal Kitab object and gift caution.
                Lal Kitab 35-sala chakra, varshphal and monthly phal are separate methods.
              </p>
            </div>
          </div>
        </section>

        {!guidance ? (
          <EngineStateCard
            title="Chart Required"
            emptyText="Generate your kundli first to unlock purchase guidance."
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
              <p className="tp-muted" style={{ marginTop: 8 }}>{guidance.strongestWarningReason}</p>
            </article>

            <article className="tp-card span-12">
              <div className="tp-row">
                <div>
                  <div className="tp-kicker">Moon Transit Zone</div>
                  <h2 className="tp-h">{guidance.sadeSatiZone.title}</h2>
                  <p className="tp-p">{guidance.sadeSatiZone.description}</p>
                </div>
                <Badge verdict={guidance.sadeSatiZone.active ? "WAIT" : "BUY_CAREFULLY"} />
              </div>
              <div className="tp-snap">
                <div className="tp-snap-item">
                  <div className="tp-snap-k">Phase</div>
                  <div className="tp-snap-v" style={{ textTransform: "capitalize" }}>{guidance.sadeSatiZone.phase}</div>
                </div>
                <div className="tp-snap-item">
                  <div className="tp-snap-k">Severity</div>
                  <div className="tp-snap-v" style={{ textTransform: "capitalize" }}>{guidance.sadeSatiZone.severity}</div>
                </div>
                <div className="tp-snap-item">
                  <div className="tp-snap-k">Purchase Impact</div>
                  <div className="tp-snap-v">{guidance.sadeSatiZone.scoreImpact}</div>
                </div>
              </div>
              <div className="tp-cols">
                <div>
                  <div className="tp-kicker" style={{ color: "#ffb1bb" }}>Purchase cautions</div>
                  {guidance.sadeSatiZone.purchaseCautions.map((item) => (
                    <p className="tp-bullet tp-bad" key={item}>{item}</p>
                  ))}
                </div>
                <div>
                  <div className="tp-kicker" style={{ color: "#71d99a" }}>Remedies</div>
                  {guidance.sadeSatiZone.remedies.map((item) => (
                    <p className="tp-bullet tp-good" key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </article>

            {planetReport && activePlanetGuidance && (
              <article className="tp-card span-12">
                <div className="tp-row">
                  <div>
                    <div className="tp-kicker">Per-Planet Gochar — Live Transit</div>
                    <h2 className="tp-h">Har Graha ke hisaab se kya kharidein</h2>
                  </div>
                  <span className="tp-chip">Base: {planetReport.baseLabel}</span>
                </div>
                <p className="tp-muted" style={{ marginTop: 4 }}>
                  Each planet&apos;s verdict is computed live from its current Gochar position (rashi, house, retrograde, strength).
                  Tap a graha to see exactly what to buy, wait on, or avoid right now.
                </p>

                {/* Planet tabs */}
                <div className="tp-tabs">
                  {planetReport.planets.map((p) => {
                    const c =
                      p.verdict === "AVOID" ? "#ff6b7a" :
                      p.verdict === "WAIT" ? "#e8a33a" :
                      p.verdict === "BUY_CAREFULLY" ? "#d8bf67" : "#71d99a";
                    return (
                      <button
                        key={p.planet}
                        type="button"
                        className={`tp-tab${activePlanet === p.planet ? " active" : ""}`}
                        onClick={() => setActivePlanet(p.planet)}
                      >
                        <span className="glyph">{p.glyph}</span>
                        {p.planet}
                        <span className="dot" style={{ background: c }} />
                      </button>
                    );
                  })}
                </div>

                {/* Active planet detail */}
                <div className="tp-item" style={{ marginTop: 14 }}>
                  <div className="tp-planet-head">
                    <div className="tp-planet-title">
                      <span className="tp-glyph-lg">{activePlanetGuidance.glyph}</span>
                      <div>
                        <strong style={{ fontSize: 18 }}>{activePlanetGuidance.planet} · {activePlanetGuidance.hindiName}</strong>
                        <p className="tp-muted">{activePlanetGuidance.domain}</p>
                      </div>
                    </div>
                    <Badge verdict={activePlanetGuidance.verdict} />
                  </div>

                  <p className="tp-p" style={{ marginTop: 10 }}>{activePlanetGuidance.guidance}</p>
                  <p className="tp-muted" style={{ marginTop: 6 }}>{activePlanetGuidance.timing}</p>

                  {/* Live transit snapshot */}
                  <div className="tp-snap">
                    <div className="tp-snap-item"><div className="tp-snap-k">Rashi</div><div className="tp-snap-v">{activePlanetGuidance.transit.rashiName} {Math.round(activePlanetGuidance.transit.degreeInRashi)}°</div></div>
                    <div className="tp-snap-item"><div className="tp-snap-k">House (from {activePlanetGuidance.transit.baseLabel})</div><div className="tp-snap-v">{activePlanetGuidance.transit.houseFromBase}{activePlanetGuidance.transit.difficultHouse ? " ⚠" : ""}</div></div>
                    <div className="tp-snap-item"><div className="tp-snap-k">Effect</div><div className="tp-snap-v" style={{ textTransform: "capitalize" }}>{activePlanetGuidance.transit.effect}</div></div>
                    <div className="tp-snap-item"><div className="tp-snap-k">Strength</div><div className="tp-snap-v">{activePlanetGuidance.score}/100</div></div>
                    <div className="tp-snap-item"><div className="tp-snap-k">Motion</div><div className="tp-snap-v">{activePlanetGuidance.transit.retrograde ? "Retrograde" : "Direct"}</div></div>
                  </div>

                  {/* Objects governed */}
                  <div className="tp-objects">
                    {activePlanetGuidance.objects.map((o) => <span className="tp-obj" key={o}>{o}</span>)}
                  </div>

                  {/* Favourable / Avoid */}
                  <div className="tp-cols">
                    <div>
                      <div className="tp-kicker" style={{ color: "#71d99a" }}>Good to buy now</div>
                      {activePlanetGuidance.favourable.map((f) => <p className="tp-bullet tp-good" key={f}>{f}</p>)}
                    </div>
                    <div>
                      <div className="tp-kicker" style={{ color: "#ff6b7a" }}>Avoid now</div>
                      {activePlanetGuidance.avoid.map((a) => <p className="tp-bullet tp-bad" key={a}>{a}</p>)}
                    </div>
                  </div>

                  {/* Practical checks */}
                  <div style={{ marginTop: 12 }}>
                    <div className="tp-kicker">Practical checks</div>
                    {activePlanetGuidance.checks.map((c) => <p className="tp-bullet tp-neutral" key={c}>{c}</p>)}
                  </div>
                </div>
              </article>
            )}

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
      </PremiumFeature>
    </main>
  );
}
