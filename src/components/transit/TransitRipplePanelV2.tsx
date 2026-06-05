"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  buildMonthlyTransitRipplePayloadFromChart,
  type MonthlyTransitRipplePayloadResult,
} from "@/lib/astro-engine/transit-ripple-v4";
import { NAKSHATRA_KNOWLEDGE } from "@/lib/astro-engine/transit-knowledge-base";

type TabType = "planets" | "lifeAreas";

type TransitRippleReport = {
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
  topActivationHouses?: Array<{
    house: number;
    score: number;
    area: string;
  }>;
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
    peakDate: string;
    score: number;
    reason: string;
    prediction: string;
  }>;
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316",
  Moon: "#94a3b8",
  Mars: "#ef4444",
  Mercury: "#06b6d4",
  Jupiter: "#eab308",
  Venus: "#ec4899",
  Saturn: "#8b5cf6",
  Rahu: "#a855f7",
  Ketu: "#64748b",
};

const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

type PlanetTimelineList = NonNullable<TransitRippleReport["planetTimelines"]>;

function TransitRippleChart({ planetList }: { planetList: PlanetTimelineList }) {
  const allWindows = planetList.flatMap((planet) =>
    planet.windows.map((window) => ({
      planet: planet.planet,
      planetScore: planet.score,
      ...window,
    }))
  );

  if (allWindows.length === 0) {
    return (
      <section style={card}>
        <p style={sectionLabel}>Monthly Ripple Map</p>
        <h2 style={h2}>Transit Flow</h2>
        <p style={paragraph}>No transit windows available yet.</p>
      </section>
    );
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const minTime = Math.min(...allWindows.map((window) => new Date(window.startDate).getTime()));
  const maxTime = Math.max(...allWindows.map((window) => new Date(window.endDate).getTime()));
  const spanDays = Math.max(1, Math.ceil((maxTime - minTime) / dayMs));
  const chartWidth = Math.max(760, spanDays * 26);
  const rowHeight = 56;
  const topPad = 42;
  const leftPad = 92;
  const rightPad = 34;
  const bottomPad = 38;
  const chartHeight = topPad + planetList.length * rowHeight + bottomPad;
  const plotWidth = chartWidth - leftPad - rightPad;
  const xForTime = (time: number) => leftPad + ((time - minTime) / Math.max(dayMs, maxTime - minTime)) * plotWidth;
  const weekTicks = Array.from({ length: Math.ceil(spanDays / 7) + 1 }, (_, index) => {
    const time = minTime + index * 7 * dayMs;
    return { time: Math.min(time, maxTime), label: new Date(Math.min(time, maxTime)).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) };
  });

  return (
    <section style={card}>
      <p style={sectionLabel}>Monthly Ripple Map</p>
      <h2 style={h2}>All Planet Transits in One Month</h2>
      <p style={{ ...paragraph, marginBottom: 14 }}>
        Each row is one planet. Larger pulses mean stronger monthly influence. Hover any pulse to see sign, nakshatra, houses and date window.
      </p>
      <div style={{ overflowX: "auto", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.26)" }}>
        <svg width={chartWidth} height={chartHeight} role="img" aria-label="Monthly transit ripple chart">
          <defs>
            <filter id="rippleGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {weekTicks.map((tick, index) => {
            const x = xForTime(tick.time);
            return (
              <g key={`${tick.label}-${index}`}>
                <line x1={x} y1={topPad - 16} x2={x} y2={chartHeight - bottomPad + 4} stroke="rgba(255,255,255,0.08)" />
                <text x={x} y={24} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">{tick.label}</text>
              </g>
            );
          })}
          {planetList.map((planet, rowIndex) => {
            const y = topPad + rowIndex * rowHeight + rowHeight / 2;
            const color = PLANET_COLORS[planet.planet] || "#94a3b8";
            return (
              <g key={planet.planet}>
                <text x={20} y={y + 4} fill={color} fontSize="13" fontWeight="700">{planet.planet}</text>
                <line x1={leftPad} y1={y} x2={chartWidth - rightPad} y2={y} stroke="rgba(255,255,255,0.1)" />
                {planet.windows.map((window, index) => {
                  const start = new Date(window.startDate).getTime();
                  const end = new Date(window.endDate).getTime();
                  const cx = xForTime(start + (end - start) / 2);
                  const segmentWidth = Math.max(18, Math.abs(xForTime(end) - xForTime(start)));
                  const radius = Math.max(7, Math.min(17, 6 + planet.score / 8));
                  return (
                    <g key={`${planet.planet}-${window.startDate}-${index}`}>
                      <line
                        x1={Math.max(leftPad, cx - segmentWidth / 2)}
                        x2={Math.min(chartWidth - rightPad, cx + segmentWidth / 2)}
                        y1={y}
                        y2={y}
                        stroke={color}
                        strokeWidth="5"
                        strokeLinecap="round"
                        opacity="0.28"
                      />
                      <circle cx={cx} cy={y} r={radius + 8} fill="none" stroke={color} opacity="0.14" />
                      <circle cx={cx} cy={y} r={radius} fill={color} opacity="0.82" filter="url(#rippleGlow)">
                        <title>{`${planet.planet}: ${window.startDate} to ${window.endDate} · ${window.sign}/${window.nakshatra} · Asc H${window.houseFromAscendant}, Moon H${window.houseFromMoon} · ${planet.score}/100`}</title>
                      </circle>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ ...legendGrid, marginTop: 14 }}>
        <div style={legendItem}><span style={{ ...legendDot, background: "#f97316" }} />Large pulse: strongest planet influence</div>
        <div style={legendItem}><span style={{ ...legendDot, background: "#94a3b8" }} />Line length: transit stay in sign/nakshatra window</div>
        <div style={legendItem}><span style={{ ...legendDot, background: "#facc15" }} />Use planet tab for detailed proof</div>
      </div>
    </section>
  );
}

export function TransitRipplePanelV2() {
  const { chart, loading: chartLoading, hasUserChart } = useUserChart();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TransitRippleReport | null>(null);
  const [error, setError] = useState("");
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("planets");

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
      setError("Save or load your birth chart first.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);
    setSelectedPlanet(null);

    try {
      const res = await fetch("/api/astro/transit-ripple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadResult.payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "API failed");
      setReport(data.report);
      const firstPlanet = data.report.planetTimelines?.[0]?.planet;
      setSelectedPlanet(firstPlanet || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const activePlanet = report?.planetTimelines?.find(p => p.planet === selectedPlanet);
  const planetList = report?.planetTimelines?.sort((a, b) => PLANET_ORDER.indexOf(a.planet) - PLANET_ORDER.indexOf(b.planet)) || [];

  const upcomingPatterns = activePlanet?.windows.slice(0, 3) || [];
  const activatedHouses = activePlanet?.windows.map(w => w.houseFromAscendant) || [];
  const uniqueHouses = Array.from(new Set(activatedHouses)).sort((a, b) => a - b);

  const relevantHits = report?.transitHits?.filter(h => h.transitPlanet === selectedPlanet).slice(0, 8) || [];
  const relevantEvents = report?.eventScores?.filter(() =>
    report.transitHits?.some(h => h.transitPlanet === selectedPlanet)
  ).slice(0, 5) || [];

  // === EXTRACT NAKSHATRAS ===
  const nakshatraData = useMemo(() => {
    const naksMap: Record<string, { lord: string; essence: string; gift: string; shadow: string; remedyTone: string; planets: string[]; score: number }> = {};

    report?.planetTimelines?.forEach(timeline => {
      timeline.windows.forEach(window => {
        if (!naksMap[window.nakshatra]) {
          const kb = NAKSHATRA_KNOWLEDGE[window.nakshatra];
          naksMap[window.nakshatra] = {
            lord: kb?.lord || "Unknown",
            essence: kb?.essence || "",
            gift: kb?.gift || "",
            shadow: kb?.shadow || "",
            remedyTone: kb?.remedyTone || "",
            planets: [],
            score: 0,
          };
        }
        if (!naksMap[window.nakshatra].planets.includes(timeline.planet)) {
          naksMap[window.nakshatra].planets.push(timeline.planet);
        }
      });
    });

    // Calculate scores for each nakshatra
    report?.transitHits?.forEach(hit => {
      const nakshatraKey = Object.keys(naksMap).find(nak => naksMap[nak].planets.includes(hit.transitPlanet));
      if (nakshatraKey) {
        naksMap[nakshatraKey].score += hit.score * 0.15;
      }
    });

    return Object.entries(naksMap).map(([name, data]) => ({
      name,
      ...data,
      score: Math.min(100, Math.round(data.score + (data.planets.length * 8))),
    })).sort((a, b) => b.score - a.score);
  }, [report]);

  return (
    <section style={pageShell}>
      <div style={heroCard}>
        <p style={eyebrow}>AstroLife Transit Engine</p>
        <h1 style={title}>Transit Ripple — World Class</h1>
        <p style={subtitle}>
          Monthly scan of 9 planets. De-duplicated closest natal hits. Differentiated life areas. Per-planet formal view with upcoming patterns shown first.
        </p>

        <div style={contextPanel}>
          <Stat label="Chart" value={payloadMeta?.chartName ?? (chartLoading ? "Loading..." : "Not connected")} />
          <Stat label="Window" value={payloadResult ? `${payloadResult.payload.startDate} to ${payloadResult.payload.endDate}` : "Waiting"} />
          <Stat label="Planets" value={payloadMeta ? String(payloadMeta.planetsScanned.length) : "—"} />
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
          {loading ? "Generating..." : "Generate Transit Report"}
        </button>

        {error && <pre style={errorBox}>{error}</pre>}
      </div>

      {report && planetList.length > 0 ? (
        <div style={contentGrid}>
          {/* === TOP-LEVEL TABS === */}
          <section style={card}>
            <div style={tabsContainer}>
              {(["planets", "lifeAreas"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={tabButton(activeTab === tab)}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, textTransform: "capitalize" }}>
                    {tab === "planets" ? "Planet Transits" : "Life Areas"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* === PLANETS TAB === */}
          {activeTab === "planets" && (
            <>
              <TransitRippleChart planetList={planetList} />

              <section style={card}>
                <p style={sectionLabel}>Planet Timelines</p>
                <h2 style={h2}>Select a Planet to Explore</h2>
                <div style={planetTabs}>
                  {planetList.map((planet) => (
                    <button
                      key={planet.planet}
                      onClick={() => setSelectedPlanet(planet.planet)}
                      style={{
                        ...planetTabButton(planet.planet === selectedPlanet, PLANET_COLORS[planet.planet]),
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{planet.planet}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        {planet.score} · {scoreLabel(planet.score)}
                      </div>
                    </button>
                  ))}
                </div>
                <div style={legendBox}>
                  <p style={legendLabel}>Score Scale</p>
                  <div style={legendGrid}>
                    <div style={legendItem}><span style={{ ...legendDot, background: "#f97316" }} />Peak (80–100)</div>
                    <div style={legendItem}><span style={{ ...legendDot, background: "#facc15" }} />Strong (65–79)</div>
                    <div style={legendItem}><span style={{ ...legendDot, background: "#a78bfa" }} />Moderate (45–64)</div>
                    <div style={legendItem}><span style={{ ...legendDot, background: "#94a3b8" }} />Supportive (25–44)</div>
                    <div style={legendItem}><span style={{ ...legendDot, background: "#64748b" }} />Background (&lt;25)</div>
                  </div>
                </div>
              </section>

              {/* === PER-PLANET FORMAL VIEW === */}
              {activePlanet && (
                <>
                  {/* Header */}
                  <section style={card}>
                    <p style={sectionLabel}>Current Transit</p>
                    <h2 style={h2}>{activePlanet.planet}</h2>
                    <div style={statGrid}>
                      <Stat label="Score" value={`${activePlanet.score}/100 · ${scoreLabel(activePlanet.score)}`} />
                      <Stat label="Status" value={activePlanet.dashaActive ? "🔥 Dasha Active" : "Neutral Period"} />
                      <Stat label="Position" value={`${activePlanet.current}`} />
                      <Stat label="Ending" value={`${activePlanet.ending}`} />
                      <Stat label="Sign Change" value={activePlanet.signChanged ? "Yes" : "No"} />
                      <Stat label="Nakshatra Change" value={activePlanet.nakshatraChanged ? "Yes" : "No"} />
                    </div>
                  </section>

              {/* Role & Action */}
              <section style={card}>
                <p style={sectionLabel}>Planet Nature</p>
                <h2 style={h2}>Role & Action</h2>
                <div style={stack}>
                  <div style={infoBox}>
                    <strong style={{ color: PLANET_COLORS[activePlanet.planet] }}>Role</strong>
                    <p style={paragraph}>{activePlanet.role}</p>
                  </div>
                  <div style={infoBox}>
                    <strong style={{ color: PLANET_COLORS[activePlanet.planet] }}>Best Response</strong>
                    <p style={paragraph}>{activePlanet.action}</p>
                  </div>
                </div>
              </section>

              {/* Dasha Status */}
              {activePlanet.dashaActive && (
                <section style={card}>
                  <p style={sectionLabel}>Active Period</p>
                  <h2 style={h2}>Dasha-Active Status</h2>
                  <div style={infoBox}>
                    <p style={paragraph}>
                      <strong style={{ color: "#facc15" }}>⚠️ This planet is tied to the current Mahadasha or Antardasha.</strong> Its transit becomes LOUDER and more visible. Watch for concrete results and real-world manifestations. This is not background noise—this is active karma working.
                    </p>
                  </div>
                </section>
              )}

              {/* Upcoming 3 Patterns (Latest First) */}
              <section style={card}>
                <p style={sectionLabel}>Upcoming Patterns</p>
                <h2 style={h2}>Next 3 Windows</h2>
                <div style={stack}>
                  {upcomingPatterns.map((window, idx) => (
                    <div key={`${window.startDate}-${idx}`} style={windowCard}>
                      <div style={rowBetween}>
                        <strong>{window.startDate} to {window.endDate}</strong>
                        <span style={pill}>{window.days} days</span>
                      </div>
                      <p style={muted}>{window.sign} / {window.nakshatra} — {window.speed}</p>
                      <p style={smallCaps}>House {window.houseFromAscendant} (Asc) · House {window.houseFromMoon} (Moon)</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Houses Activated */}
              {uniqueHouses.length > 0 && (
                <section style={card}>
                  <p style={sectionLabel}>Houses Activated</p>
                  <h2 style={h2}>Field of Effect</h2>
                  <div style={houseGrid}>
                    {uniqueHouses.map((house) => {
                      const houseNames: Record<number, string> = {
                        1: "Self", 2: "Wealth", 3: "Courage", 4: "Home", 5: "Creativity", 6: "Health",
                        7: "Partnerships", 8: "Secrets", 9: "Dharma", 10: "Career", 11: "Gains", 12: "Release",
                      };
                      return (
                        <div key={house} style={houseCard(PLANET_COLORS[activePlanet.planet])}>
                          <strong style={{ fontSize: 18 }}>H{house}</strong>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{houseNames[house]}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Closest Natal Hits (Deduplicated) */}
              {relevantHits.length > 0 && (
                <section style={card}>
                  <p style={sectionLabel}>Technical Proof</p>
                  <h2 style={h2}>Closest Natal Hits</h2>
                  <div style={hitGrid}>
                    {relevantHits.map((hit, idx) => (
                      <div key={`${hit.date}-${hit.aspect}-${idx}`} style={hitCard}>
                        <div style={rowBetween}>
                          <strong>{hit.transitPlanet} → {hit.natalName}</strong>
                          <span style={{ ...pill, background: `${scoreLabelColor(hit.score)}22`, border: `1px solid ${scoreLabelColor(hit.score)}55`, color: scoreLabelColor(hit.score) }}>
                            {hit.score} · {scoreLabel(hit.score)}
                          </span>
                        </div>
                        <p style={smallCaps}>{hit.date} · {hit.aspect} · {hit.orb}° · H{hit.natalHouse}</p>
                        <p style={paragraph}>{hit.meaning}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Life Areas with This Planet */}
              {relevantEvents.length > 0 && (
                <section style={card}>
                  <p style={sectionLabel}>Life Areas</p>
                  <h2 style={h2}>{activePlanet.planet} in Your Life</h2>
                  <div style={eventGrid}>
                    {relevantEvents.map((event) => (
                      <div key={event.key} style={eventCard}>
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
              )}

                  {/* Narrative */}
                  <section style={card}>
                    <p style={sectionLabel}>Deep Narrative</p>
                    <h2 style={h2}>Monthly Story</h2>
                    <p style={paragraphPre}>{activePlanet.narrative}</p>
                  </section>
                </>
              )}
            </>
          )}

          {/* === LIFE AREAS TAB === */}
          {activeTab === "lifeAreas" && (
            <>
              <section style={card}>
                <p style={sectionLabel}>House Activations</p>
                <h2 style={h2}>Life Areas Affected This Month</h2>
                <p style={{ ...paragraph, marginBottom: 16 }}>
                  Below are the houses receiving transit activations, ranked by total impact score. Higher scores indicate stronger planetary influence in that life area.
                </p>
                <div style={houseActivationGrid}>
                  {report?.topActivationHouses?.map((house) => {
                    const houseNames: Record<number, string> = {
                      1: "Self", 2: "Wealth", 3: "Courage", 4: "Home", 5: "Creativity", 6: "Health",
                      7: "Partnerships", 8: "Secrets", 9: "Dharma", 10: "Career", 11: "Gains", 12: "Release",
                    };
                    const houseDescriptions: Record<number, string> = {
                      1: "Identity, appearance, self-perception",
                      2: "Finance, family, speech",
                      3: "Siblings, courage, communication",
                      4: "Home, mother, emotions, foundation",
                      5: "Children, creativity, intellect",
                      6: "Health, enemies, debts, service",
                      7: "Partnerships, contracts, clients",
                      8: "Inheritance, secrets, transformation",
                      9: "Higher learning, luck, dharma",
                      10: "Career, status, public image",
                      11: "Gains, friendships, networks",
                      12: "Spirituality, release, losses",
                    };
                    return (
                      <div key={house.house} style={houseActivationCard}>
                        <div style={rowBetween}>
                          <div>
                            <strong style={{ fontSize: 18 }}>House {house.house}</strong>
                            <p style={{ ...smallCaps, marginTop: 4 }}>{houseNames[house.house]}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ ...pill, fontSize: 13, fontWeight: 800, background: `${scoreLabelColor(house.score / 5)}22`, border: `1px solid ${scoreLabelColor(house.score / 5)}55`, color: scoreLabelColor(house.score / 5) }}>
                              {house.score}
                            </span>
                          </div>
                        </div>
                        <p style={{ ...paragraph, marginTop: 8 }}>{houseDescriptions[house.house]}</p>
                      </div>
                    );
                  })}
                </div>
                <div style={infoBox}>
                  <p style={muted}>💡 Impact Scores reflect the cumulative weight of all transit hits to each house across the month, combining primary and secondary influences.</p>
                </div>
              </section>

              {/* Life Areas Overview */}
              {report?.eventScores && report.eventScores.length > 0 && (
                <section style={card}>
                  <p style={sectionLabel}>Life Area Scores</p>
                  <h2 style={h2}>Overall Influence by Category</h2>
                  <div style={eventGrid}>
                    {report.eventScores.map((event) => (
                      <div key={event.key} style={eventCard}>
                        <div style={rowBetween}>
                          <strong>{event.label}</strong>
                          <span style={{ ...pill, background: `${scoreLabelColor(event.score)}22`, border: `1px solid ${scoreLabelColor(event.score)}55`, color: scoreLabelColor(event.score) }}>
                            {event.score}
                          </span>
                        </div>
                        <p style={{ ...smallCaps, color: scoreLabelColor(event.score), marginTop: 6 }}>{event.status}</p>
                        <p style={paragraph}>{event.reason}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* === NAKSHATRA SECTION INSIDE LIFE AREAS === */}
          {activeTab === "lifeAreas" && (
            <>
              <section style={card}>
                <p style={sectionLabel}>Lunar Mansions</p>
                <h2 style={h2}>Nakshatras Being Transited</h2>
                <p style={{ ...paragraph, marginBottom: 20 }}>
                  Below are the lunar mansions (nakshatras) that are receiving transit activations this month. Each nakshatra has a ruling planet lord and carries distinct qualities.
                </p>

                {nakshatraData.length > 0 ? (
                  <div style={nakshatraGrid}>
                    {nakshatraData.map((nak) => (
                      <div key={nak.name} style={nakshatraCard}>
                        <div style={rowBetween}>
                          <div>
                            <strong style={{ fontSize: 18 }}>{nak.name}</strong>
                            <p style={{ ...smallCaps, marginTop: 4, color: PLANET_COLORS[nak.lord] || "rgba(255,255,255,0.6)" }}>
                              Lord: {nak.lord}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ ...pill, fontSize: 13, fontWeight: 800, background: `${scoreLabelColor(nak.score)}22`, border: `1px solid ${scoreLabelColor(nak.score)}55`, color: scoreLabelColor(nak.score) }}>
                              {nak.score}
                            </span>
                          </div>
                        </div>

                        <div style={nakshatraContent}>
                          <p style={muted}>
                            <strong style={{ color: "rgba(255,255,255,0.8)" }}>Essence:</strong> {nak.essence}
                          </p>
                          <p style={muted}>
                            <strong style={{ color: "#a3e635" }}>Gift:</strong> {nak.gift}
                          </p>
                          <p style={muted}>
                            <strong style={{ color: "#f87171" }}>Shadow:</strong> {nak.shadow}
                          </p>
                          <p style={{ ...muted, marginTop: 8, padding: "8px 12px", background: "rgba(250,204,21,0.1)", borderRadius: 8 }}>
                            <strong style={{ color: "#facc15" }}>💡 Remedy:</strong> {nak.remedyTone}
                          </p>
                        </div>

                        {nak.planets.length > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            <p style={smallCaps}>Planets here:</p>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                              {nak.planets.map(planet => (
                                <span key={planet} style={{ ...pill, background: `${PLANET_COLORS[planet]}22`, border: `1px solid ${PLANET_COLORS[planet]}55`, color: PLANET_COLORS[planet] }}>
                                  {planet}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={infoBox}>
                    <p style={paragraph}>No nakshatras activated this month yet. Generate a transit report to see lunar mansion activations.</p>
                  </div>
                )}
              </section>
            </>
          )}
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

// ===== STYLES =====

const pageShell: CSSProperties = {
  minHeight: "100vh",
  padding: "32px",
  background: "radial-gradient(circle at top left, rgba(250,204,21,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(124,58,237,0.18), transparent 36%), #070711",
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

const title: CSSProperties = { fontSize: 46, lineHeight: 1.05, margin: "8px 0 12px" };
const subtitle: CSSProperties = { maxWidth: 760, color: "rgba(255,255,255,0.72)", lineHeight: 1.75 };

const contextPanel: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 20,
};

const button: CSSProperties = {
  marginTop: 22,
  padding: "13px 18px",
  borderRadius: 14,
  border: "none",
  background: "#facc15",
  color: "#111",
  fontWeight: 800,
  cursor: "pointer",
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

const sectionLabel: CSSProperties = {
  color: "#facc15",
  textTransform: "uppercase",
  letterSpacing: 1.4,
  fontSize: 12,
  fontWeight: 700,
};

const h2: CSSProperties = { fontSize: 26, margin: "6px 0 16px" };

const statGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const statBox: CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "rgba(0,0,0,0.25)",
};

const planetTabs: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: 12,
};

const planetTabButton = (isActive: boolean, color: string): CSSProperties => ({
  padding: "14px 12px",
  borderRadius: 14,
  border: isActive ? `2px solid ${color}` : "1px solid rgba(255,255,255,0.2)",
  background: isActive ? `${color}18` : "rgba(0,0,0,0.25)",
  color: isActive ? color : "rgba(255,255,255,0.7)",
  cursor: "pointer",
  textAlign: "center",
  transition: "all 0.2s",
});

const stack: CSSProperties = { display: "grid", gap: 12 };
const rowBetween: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" };

const pill: CSSProperties = {
  borderRadius: 999,
  padding: "4px 9px",
  background: "rgba(250,204,21,0.12)",
  color: "#fde68a",
  fontSize: 12,
  fontWeight: 700,
};

const muted: CSSProperties = { color: "rgba(255,255,255,0.58)", margin: "4px 0" };
const smallCaps: CSSProperties = { color: "rgba(255,255,255,0.44)", textTransform: "uppercase", letterSpacing: 1, fontSize: 11 };
const paragraph: CSSProperties = { color: "rgba(255,255,255,0.74)", lineHeight: 1.7 };
const paragraphPre: CSSProperties = { color: "rgba(255,255,255,0.78)", lineHeight: 1.85, whiteSpace: "pre-wrap" };

const windowCard: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const hitCard: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const infoBox: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const houseGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
  gap: 12,
};

const houseCard = (color: string): CSSProperties => ({
  padding: 16,
  borderRadius: 14,
  border: `1px solid ${color}44`,
  background: `${color}18`,
  textAlign: "center",
  display: "grid",
  gap: 6,
  alignContent: "center",
});

const hitGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 12,
};

const eventGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const eventCard: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const tabsContainer: CSSProperties = {
  display: "flex",
  gap: 8,
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  paddingBottom: 0,
};

const tabButton = (isActive: boolean): CSSProperties => ({
  padding: "14px 20px",
  background: isActive ? "#facc15" : "transparent",
  border: "none",
  color: isActive ? "#111" : "rgba(255,255,255,0.6)",
  cursor: "pointer",
  borderBottom: isActive ? "3px solid #facc15" : "none",
  transition: "all 0.2s",
  marginBottom: "-1px",
});

const legendBox: CSSProperties = {
  marginTop: 20,
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const legendLabel: CSSProperties = {
  ...smallCaps,
  marginBottom: 12,
  color: "#facc15",
};

const legendGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 12,
};

const legendItem: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "rgba(255,255,255,0.7)",
};

const legendDot: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  flexShrink: 0,
};

const houseActivationGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 12,
};

const houseActivationCard: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.28)",
};

const nakshatraGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 16,
};

const nakshatraCard: CSSProperties = {
  padding: 18,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.35)",
};

const nakshatraContent: CSSProperties = {
  marginTop: 12,
  display: "grid",
  gap: 8,
};
