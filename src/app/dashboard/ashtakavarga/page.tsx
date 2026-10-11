"use client";
import { useState, useMemo } from "react";
import { EngineEmptyState } from "@/components/engine/engine-intro";
import "@/app/dashboard/shared.css";
import { calculateAshtakavarga } from "@/lib/astro-engine/ashtakavarga";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
import { EngineHeader, EngineShell, EngineTrustPanel } from "@/components/engine/EngineShell";
import { AshtakavargaChakraInteractive } from "@/components/charts/AshtakavargaChakraInteractive";
import { calculateTransitReport } from "@/lib/astro-engine/transits";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";

const RASHIS_SHORT = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

export default function AKVPage() {
  const [activeTab, setActiveTab] = useState<"wheel"|"shodhana"|"transits"|"lifemap"|"sarva"|"planets"|"houses"|"guide">("wheel");
  const [selectedShodhanaPlanet, setSelectedShodhanaPlanet] = useState<string>("Jupiter");
  const { birth, chart, hasUserChart } = useUserChart();
  const { t } = useLanguage();

  const result = useMemo(() => {
    if (!chart?.planets) return null;
    return calculateAshtakavarga(chart.planets as never, chart.lagnaNum);
  }, [chart?.planets, chart?.lagnaNum]);

  const liveTransits = useMemo(() => {
    if (!chart) return [];
    try {
      const tc = normalizeChartForTransit(chart);
      const rep = calculateTransitReport({ chart: tc, date: new Date(), base: "lagna" });
      return rep.planets;
    } catch {
      return [];
    }
  }, [chart]);

  const binduColor = (v: number) =>
    v >= 5 ? "#22c55e" : v >= 4 ? "#c8a030" : v >= 3 ? "#60a5fa" : v >= 1 ? "#f97316" : "#ef4444";

  if (!hasUserChart || !birth.name || !chart || !result) {
    return (
      <EngineEmptyState
        engineName="Ashtakavarga"
        engineIcon="🔢"
        whatItAnalyzes={["Sarvashtakavarga totals", "Bhinnashtakavarga per planet", "House bindu strength", "Trikona & Ekadhipatya Shodhana", "Shodhya Pinda"]}
      />
    );
  }

  const currentShodhana = result.shodhanaResults.find(s => s.planet === selectedShodhanaPlanet) ?? result.shodhanaResults[0];

  return (
    <EngineShell>
      <EngineHeader
        eyebrow="Classical Parashari Ashtakavarga 2.0"
        title={t("akv.page_title")}
        subtitle="The definitive mathematical matrix of Vedic fate delivery. Features 360° Circular Zodiac Heatmap, classical BPHS Shodhana reductions, and live Gochar transit overlay."
        confidence={{
          value: "High (Parashari)",
          detail: "Calculated strictly per Brihat Parashara Hora Shastra Ch. 66–73 with exact Rashi & Graha multipliers.",
        }}
        metrics={[
          { label: "Total SAV Bindus", value: result.sarvaTotal, tone: result.sarvaTotal >= 337 ? "green" : "red" },
          { label: "Total Shodhya Pinda", value: result.totalShodhyaPinda, tone: "green" },
          { label: "Strongest House", value: `H${result.strongest[0] + 1} (${result.houses[result.strongest[0]]?.score} pts)`, tone: "green" },
          { label: "Weakest House", value: `H${result.weakest[0] + 1} (${result.houses[result.weakest[0]]?.score} pts)`, tone: "red" },
        ]}
      />
      <EngineTrustPanel
        confidence="High"
        dataUsed={["Natal Planetary Longitudes", "Lagna Ascendant", "337-Bindu BPHS Tables", "Trikona Shodhana", "Ekadhipatya Shodhana", "Live Ephemeris Transits"]}
        caveat="Ashtakavarga determines structural delivery capacity. Fused with active Mahadasha and Gochar transits for exact event timing."
      />
      <PremiumFeature feature="Ashtakavarga Analysis">

      {/* HEADER CARD */}
      <div className="header-card">
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1,flex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#c8a030",marginBottom:6}}>✦ Classical Ashtakavarga Engine</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:"#1A1A1A"}}>{birth.name}</div>
          <div style={{fontSize:13,color:"#6B635B",marginTop:4}}>Sarvashtakavarga: {result.sarvaTotal} Bindus · Total Shodhya Pinda: {result.totalShodhyaPinda}</div>
          <div style={{fontSize:12,color:"#4A4238",marginTop:10,lineHeight:1.8,maxWidth:520}}>{result.lifeSummary}</div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative",zIndex:1}}>
          <div className="hstat">
            <div className="hstat-n" style={{color:result.sarvaTotal>=337?"#22c55e":"#ef4444"}}>{result.sarvaTotal}</div>
            <div className="hstat-l">SAV BINDUS (STD 337)</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{color:"#22c55e",fontSize:18}}>H{result.strongest.map(i=>i+1).join(",")}</div>
            <div className="hstat-l">STRONGEST HOUSES</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{color:"#ef4444",fontSize:18}}>H{result.weakest.map(i=>i+1).join(",")}</div>
            <div className="hstat-l">CHALLENGED HOUSES</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {[
          ["wheel", "🎡 360° Circular Heatmap"],
          ["shodhana", "🔬 Classical Shodhana (BPHS)"],
          ["transits", "🪐 Live Gochar on SAV"],
          ["lifemap", "🗺️ Cosmic Life Map"],
          ["sarva", "📊 Sarvashtakavarga Grid"],
          ["planets", "✨ Bhinnashtakavarga"],
          ["houses", "🏛️ 12 Houses Guide"],
          ["guide", "📖 Classical Rules"],
        ].map(([k, l]) => (
          <button key={k} className={`tab ${activeTab === k ? "active" : ""}`} onClick={() => setActiveTab(k as typeof activeTab)}>
            {l}
          </button>
        ))}
      </div>

      {/* ── TAB 1: 360° CIRCULAR CHAKRA HEATMAP ── */}
      {activeTab === "wheel" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-tag">✦ Interactive Zodiac Chakra</div>
          <div className="card-title serif">360° Sarvashtakavarga Heatmap & House Inspector</div>
          <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.7, marginBottom: 20 }}>
            Click any house slice on the circular mandala below to inspect its exact bindu tally, contributing grahas, and live transit planets currently passing through it.
          </p>
          <AshtakavargaChakraInteractive
            akvResult={result}
            lagnaNum={chart.lagnaNum}
            transitPlanets={liveTransits}
          />
        </div>
      )}

      {/* ── TAB 2: CLASSICAL SHODHANA VISUALIZER (BPHS Ch. 66–73) ── */}
      {activeTab === "shodhana" && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-tag">✦ Brihat Parashara Hora Shastra Ch. 70–73</div>
            <div className="card-title serif">Trikona & Ekadhipatya Shodhana Visualizer</div>
            <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
              Raw Ashtakavarga bindus must undergo two classical purifications: <strong>Trikona Shodhana</strong> (subtraction of the minimum bindu across elemental trines) and <strong>Ekadhipatya Shodhana</strong> (reduction for dual signs ruled by the same planet based on planetary occupancy). The resulting refined bindus are multiplied by classical Rashi and Graha constants to compute <strong>Shodhya Pinda</strong> — the ultimate indicator of transit manifestation.
            </p>

            {/* Planet selector */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {result.shodhanaResults.map((sp) => (
                <button
                  key={sp.planet}
                  onClick={() => setSelectedShodhanaPlanet(sp.planet)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: selectedShodhanaPlanet === sp.planet ? "2px solid #C8A030" : "1px solid rgba(184, 134, 11, 0.2)",
                    background: selectedShodhanaPlanet === sp.planet ? "rgba(200, 160, 48, 0.15)" : "#FFF",
                    color: "#1A1A1A",
                    fontWeight: selectedShodhanaPlanet === sp.planet ? 700 : 500,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {sp.icon} {sp.planet} (Pinda: {sp.shodhyaPinda})
                </button>
              ))}
            </div>

            {/* Shodhana Breakdown Table */}
            {currentShodhana && (
              <div>
                <div style={{ background: "#FAF7F2", borderRadius: 14, padding: 16, border: "1px solid rgba(184,134,11,0.2)", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, margin: 0, color: "#1A1A1A" }}>
                      {currentShodhana.icon} {currentShodhana.planet} Shodhana Matrix
                    </h3>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#C8A030" }}>
                      Total Shodhya Pinda: {currentShodhana.shodhyaPinda}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#6B635B", lineHeight: 1.6, margin: 0 }}>
                    {currentShodhana.classicalSignificance}
                  </p>
                </div>

                <div style={{ overflowX: "auto", marginBottom: 18 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "center" }}>
                    <thead>
                      <tr style={{ background: "rgba(200, 160, 48, 0.12)", color: "#1A1A1A" }}>
                        <th style={{ padding: "10px 12px", textAlign: "left" }}>Reduction Stage</th>
                        {RASHIS_SHORT.map((r, i) => (
                          <th key={r} style={{ padding: "10px 6px" }}>{r}</th>
                        ))}
                        <th style={{ padding: "10px 12px" }}>Sum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>1. Raw BAV Bindus</td>
                        {currentShodhana.rawBindus.map((b, i) => (
                          <td key={i} style={{ padding: "10px 6px", fontWeight: 700, color: binduColor(b) }}>{b}</td>
                        ))}
                        <td style={{ padding: "10px 12px", fontWeight: 800 }}>{currentShodhana.rawBindus.reduce((a,b)=>a+b,0)}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #E5E7EB", background: "rgba(245, 158, 11, 0.04)" }}>
                        <td style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>2. Trikona Shodhita (Trine Reduced)</td>
                        {currentShodhana.trikonaBindus.map((b, i) => (
                          <td key={i} style={{ padding: "10px 6px", fontWeight: 700, color: b > 0 ? "#15803d" : "#9ca3af" }}>{b}</td>
                        ))}
                        <td style={{ padding: "10px 12px", fontWeight: 800 }}>{currentShodhana.trikonaBindus.reduce((a,b)=>a+b,0)}</td>
                      </tr>
                      <tr style={{ background: "rgba(34, 197, 94, 0.06)" }}>
                        <td style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>3. Ekadhipatya Shodhita (Final Refined)</td>
                        {currentShodhana.ekadhipatyaBindus.map((b, i) => (
                          <td key={i} style={{ padding: "10px 6px", fontWeight: 800, color: b > 0 ? "#15803d" : "#9ca3af" }}>{b}</td>
                        ))}
                        <td style={{ padding: "10px 12px", fontWeight: 800, color: "#15803d" }}>{currentShodhana.ekadhipatyaBindus.reduce((a,b)=>a+b,0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pinda Multipliers Breakdown Card */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                  <div style={{ background: "#FFF", borderRadius: 12, padding: 16, border: "1px solid rgba(184,134,11,0.2)" }}>
                    <div style={{ fontSize: 11, color: "#6B635B", textTransform: "uppercase", letterSpacing: 1 }}>Rashi Pinda</div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 800, color: "#1A1A1A", margin: "4px 0" }}>
                      {currentShodhana.rashiPinda}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#78716C" }}>
                      Computed with classical Rashi multipliers (7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12).
                    </div>
                  </div>
                  <div style={{ background: "#FFF", borderRadius: 12, padding: 16, border: "1px solid rgba(184,134,11,0.2)" }}>
                    <div style={{ fontSize: 11, color: "#6B635B", textTransform: "uppercase", letterSpacing: 1 }}>Graha Pinda</div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 800, color: "#1A1A1A", margin: "4px 0" }}>
                      {currentShodhana.grahaPinda}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#78716C" }}>
                      Computed with Graha multipliers in occupied signs (Sun=5, Moon=5, Mars=8, Mer=5, Jup=10, Ven=7, Sat=5).
                    </div>
                  </div>
                  <div style={{ background: "rgba(200, 160, 48, 0.1)", borderRadius: 12, padding: 16, border: "1px solid rgba(200,160,48,0.4)" }}>
                    <div style={{ fontSize: 11, color: "#854d0e", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Shodhya Pinda (Total)</div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 800, color: "#1A1A1A", margin: "4px 0" }}>
                      {currentShodhana.shodhyaPinda}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#854d0e" }}>
                      Rashi Pinda ({currentShodhana.rashiPinda}) + Graha Pinda ({currentShodhana.grahaPinda}).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE GOCHAR TRANSIT ON SAV ── */}
      {activeTab === "transits" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-tag">✦ Real-Time Astrodynamics</div>
          <div className="card-title serif">Live Planetary Transits Over Your Sarvashtakavarga</div>
          <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.7, marginBottom: 18 }}>
            A planet transiting a sign with <strong>28+ SAV bindus</strong> finds fertile ground and produces auspicious results effortlessly. A planet transiting a sign with <strong>under 25 bindus</strong> experiences friction, delay, and depleted karmic support, requiring conscious countermeasures.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 14 }}>
            {liveTransits.map((tp) => {
              const hNum = tp.houseFromBase;
              const hData = result.houses[hNum - 1];
              const bindus = hData?.score ?? 28;
              const isFertile = bindus >= 28;
              const isDepleted = bindus < 25;

              return (
                <div
                  key={tp.planet}
                  style={{
                    background: isFertile ? "rgba(34,197,94,0.06)" : isDepleted ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)",
                    border: `1px solid ${isFertile ? "rgba(34,197,94,0.3)" : isDepleted ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <strong style={{ fontSize: 16, color: "#1A1A1A" }}>{tp.planet}</strong>
                      <div style={{ fontSize: 11, color: "#6B635B" }}>
                        In {tp.rashiName} ({tp.degreeInRashi.toFixed(1)}°) · House {hNum}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 800, color: isFertile ? "#15803d" : isDepleted ? "#b91c1c" : "#b45309" }}>
                        {bindus}
                      </span>
                      <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B635B" }}>SAV Bindus</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 600, color: isFertile ? "#15803d" : isDepleted ? "#b91c1c" : "#b45309", marginBottom: 6 }}>
                    {isFertile ? "✦ Fertile Delivery Zone" : isDepleted ? "⚠️ Depleted Zone (Friction)" : "⚖️ Moderate Balanced Zone"}
                  </div>

                  <p style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
                    {isFertile
                      ? `${tp.planet} transits your House of ${hData?.name ?? ""}, receiving high cosmic backing. Its positive significations materialize with minimal obstruction.`
                      : isDepleted
                      ? `${tp.planet} transits an energy-depleted sign. Avoid forcing hasty outcomes in ${hData?.theme ?? "this area"}; buffer timelines and use grounding remedies.`
                      : `${tp.planet} is in a moderate-capacity house. Steady discipline and thoughtful strategy will yield consistent results.`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: LIFE MAP TAB ── */}
      {activeTab === "lifemap" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Your Cosmic Life Map</div>
            <div className="card-title serif">Where Fate Works For You</div>
            <div style={{fontSize:12,color:"#4A4238",lineHeight:1.8,marginBottom:16}}>
              Ashtakavarga maps which life areas have the strongest cosmic backing — not just right now, but across your entire lifetime.
              Houses with high bindus attract results naturally; low-bindu houses need extra effort, timing, and remedies.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:14,padding:16}}>
                <div style={{fontSize:11,color:"#22c55e",fontWeight:700,letterSpacing:"1px",marginBottom:8}}>STRONGEST LIFE AREAS</div>
                {result.strongest.map(i=>{
                  const h = result.houses[i];
                  return (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"#1A1A1A"}}>H{h.house} — {h.name}</div>
                        <div style={{fontSize:10,color:"#6B635B",fontStyle:"italic"}}>{h.theme}</div>
                      </div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:700,color:"#22c55e"}}>{h.score}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14,padding:16}}>
                <div style={{fontSize:11,color:"#ef4444",fontWeight:700,letterSpacing:"1px",marginBottom:8}}>AREAS NEEDING EFFORT</div>
                {result.weakest.map(i=>{
                  const h = result.houses[i];
                  return (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"#1A1A1A"}}>H{h.house} — {h.name}</div>
                        <div style={{fontSize:10,color:"#6B635B",fontStyle:"italic"}}>{h.theme}</div>
                      </div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:700,color:"#ef4444"}}>{h.score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: SARVASHTAKAVARGA GRID ── */}
      {activeTab === "sarva" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Sarvashtakavarga Grid</div>
            <div className="card-title serif">Complete Planetary Contribution Matrix</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5,textAlign:"center"}}>
                <thead>
                  <tr style={{background:"rgba(200, 160, 48, 0.12)",color:"#1A1A1A"}}>
                    <th style={{padding:"10px 12px",textAlign:"left"}}>House</th>
                    <th style={{padding:"10px 8px"}}>Sign</th>
                    {result.planets.map(p=>(
                      <th key={p.planet} style={{padding:"10px 6px"}}>{p.icon} {p.planet}</th>
                    ))}
                    <th style={{padding:"10px 12px",fontWeight:800}}>SAV Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.matrix.map((row)=>(
                    <tr key={row.house} style={{borderBottom:"1px solid #E5E7EB"}}>
                      <td style={{padding:"8px 12px",textAlign:"left",fontWeight:700}}>H{row.house}</td>
                      <td style={{padding:"8px 8px",color:"#6B635B"}}>{row.sign}</td>
                      {result.planets.map(p=>(
                        <td key={p.planet} style={{padding:"8px 6px",color:binduColor(row.planetBindus[p.planet]??0),fontWeight:600}}>
                          {row.planetBindus[p.planet]??0}
                        </td>
                      ))}
                      <td style={{padding:"8px 12px",fontWeight:800,color:row.total>=28?"#15803d":row.total>=25?"#b45309":"#b91c1c"}}>
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: BHINNASHTAKAVARGA (7 PLANETS) ── */}
      {activeTab === "planets" && (
        <div style={{display:"grid",gap:14}}>
          {result.planets.map((p)=>(
            <div key={p.planet} className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:24}}>{p.icon}</span>
                  <div>
                    <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,margin:0,color:"#1A1A1A"}}>{p.planet}</h3>
                    <div style={{fontSize:11,color:"#6B635B"}}>{p.desc}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:800,color:p.gradeColor}}>
                    {p.total} / {p.max}
                  </span>
                  <div style={{fontSize:10,color:p.gradeColor,fontWeight:700}}>{p.grade} ({p.pct}%)</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                {p.bindus.map((b, i)=>(
                  <div key={i} style={{flex:1,minWidth:42,background:"#FAF7F2",borderRadius:8,padding:6,textAlign:"center",border:"1px solid rgba(184,134,11,0.15)"}}>
                    <div style={{fontSize:10,color:"#6B635B"}}>{RASHIS_SHORT[i]}</div>
                    <div style={{fontSize:14,fontWeight:800,color:binduColor(b),marginTop:2}}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 7: 12 HOUSES GUIDE ── */}
      {activeTab === "houses" && (
        <div className="grid-auto">
          {result.houses.map(h=>(
            <div key={h.house} className="card" style={{borderColor:`${h.color}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:10,color:"#6B635B",marginBottom:3}}>House {h.house}</div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:"#1A1A1A"}}>{h.name}</div>
                  <div style={{fontSize:10,color:"#6B635B",marginTop:2,fontStyle:"italic"}}>{h.theme}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,fontWeight:700,color:h.color,lineHeight:1}}>{h.score}</div>
                  <span className={`badge ${h.grade==="Strong"?"badge-green":h.grade==="Average"?"badge-gold":"badge-red"}`}>
                    {h.grade==="Strong"?"💪":h.grade==="Average"?"⚖️":"⚠️"} {h.grade}
                  </span>
                </div>
              </div>
              <div className="bar-track" style={{marginBottom:10}}>
                <div className="bar-fill" style={{width:`${(h.score/36)*100}%`,background:h.color}}/>
              </div>
              <div style={{fontSize:12,color:"#4A4238",lineHeight:1.75,marginBottom:8}}>{h.interp}</div>
              {h.topPlanets.length>0&&(
                <div style={{fontSize:10,color:"#6B635B"}}>Top contributors: {h.topPlanets.join(", ")}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 8: CLASSICAL RULES & HOW TO USE ── */}
      {activeTab === "guide" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Classical Foundation</div>
            <div className="card-title serif">What is Ashtakavarga?</div>
            <div style={{fontSize:12,color:"#4A4238",lineHeight:1.9}}>
              Ashtakavarga (Sanskrit: अष्टकवर्ग) means &quot;group of eight.&quot; It is one of the most sophisticated predictive tools
              in Jyotisha, first described in Brihat Parashara Hora Shastra. Each of the 7 planets casts &quot;bindus&quot; (benefic points)
              into the 12 houses from its own position and the positions of the other 6 planets plus the Lagna (ascendant) —
              8 contributors in total. This gives each planet a 12-house bindu map showing where it is most activated in your chart.
              Sarvashtakavarga is the sum of all 7 planets across all 12 houses, giving you a total life-map score of standard 337 bindus.
            </div>
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Reading Your Scores</div>
            <div className="card-title serif">The Bindu Scale</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {[
                {range:"28–36 bindus",grade:"Strong",color:"#22c55e",meaning:"This house has strong cosmic backing. Planets transiting here produce positive results effortlessly. Dashas involving this house deliver with high yield."},
                {range:"25–27 bindus",grade:"Average",color:"#c8a030",meaning:"Moderate support. Results come through consistent effort and clear planning. Favourable planet transits still deliver smoothly."},
                {range:"Below 25",grade:"Weak",color:"#ef4444",meaning:"Lighter cosmic support. This life area faces more friction, delays, or challenges. Remedies, timing, and patience are essential before expecting results."},
              ].map(row=>(
                <div key={row.grade} style={{display:"flex",gap:12,padding:12,borderRadius:12,background:`${row.color}0a`,border:`1px solid ${row.color}22`}}>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:700,color:row.color,flexShrink:0,width:90}}>{row.range}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:row.color,marginBottom:3}}>{row.grade}</div>
                    <div style={{fontSize:11,color:"#4A4238",lineHeight:1.7}}>{row.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      </PremiumFeature>
    </EngineShell>
  );
}
