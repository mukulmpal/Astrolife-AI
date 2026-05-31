"use client";
import { useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import "@/app/dashboard/shared.css";
import { calculateAshtakavarga } from "@/lib/astro-engine/ashtakavarga";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";

export default function AKVPage() {
  const [activeTab, setActiveTab] = useState<"lifemap"|"sarva"|"planets"|"houses"|"sodhya"|"guide">("lifemap");
  const { birth, chart } = useUserChart();
  const { t, tp } = useLanguage();
  const result = calculateAshtakavarga(chart.planets as never, chart.lagnaNum);

  const binduColor = (v:number) =>
    v>=5?"#22c55e":v>=4?"#c8a030":v>=3?"#60a5fa":v>=1?"#f97316":"#ef4444";

  return (
    <div className="page">
      <div className="page-tag">{t("akv.page_tag")}</div>
      <h1 className="page-title serif">{t("akv.page_title")}</h1>
      <p className="page-sub">{t("akv.page_sub")}</p>
      <PremiumFeature feature="Ashtakavarga Analysis">

      {/* HEADER */}
      <div className="header-card">
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1,flex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#c8a030",marginBottom:6}}>📊 AKV Analysis</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:"#f0e8d0"}}>{birth.name}</div>
          <div style={{fontSize:13,color:"#605890",marginTop:4}}>Classical Ashtakavarga · {result.sarvaTotal} total bindus</div>
          <div style={{fontSize:12,color:"#c8c0a8",marginTop:10,lineHeight:1.8,maxWidth:480}}>{result.lifeSummary}</div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative",zIndex:1}}>
          <div className="hstat">
            <div className="hstat-n" style={{color:result.sarvaTotal>=337?"#22c55e":"#ef4444"}}>{result.sarvaTotal}</div>
            <div className="hstat-l">TOTAL BINDUS</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{color:"#22c55e",fontSize:14}}>H{result.strongest.map(i=>i+1).join(",")}</div>
            <div className="hstat-l">STRONGEST</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{color:"#ef4444",fontSize:14}}>H{result.weakest.map(i=>i+1).join(",")}</div>
            <div className="hstat-l">WEAKEST</div>
          </div>
        </div>
      </div>

      <div className="summary-strip">
        📊 {result.summary}
        <span style={{marginLeft:8,color:result.sarvaTotal>=337?"#22c55e":"#ef4444"}}>
          {result.sarvaTotal>=337?"✅ Above standard (337)":"⚠️ Below standard (337)"}
        </span>
      </div>

      {/* TABS */}
      <div className="tabs">
        {([
          ["lifemap",t("akv.tab_life_map")],
          ["sarva",t("akv.tab_sarva")],
          ["planets",t("akv.tab_planets")],
          ["houses",t("akv.tab_houses")],
          ["sodhya",t("akv.tab_pinda")],
          ["guide",t("akv.tab_howto")],
        ] as const).map(([k,l])=>(
          <button key={k} className={`tab ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k as typeof activeTab)}>{l}</button>
        ))}
      </div>

      {/* ── LIFE MAP TAB ── */}
      {activeTab==="lifemap" && (
        <div>
          {/* Life area tiles */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Your Cosmic Life Map</div>
            <div className="card-title serif">Where Fate Works For You</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.8,marginBottom:16}}>
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
                        <div style={{fontSize:13,fontWeight:600,color:"#f0e8d0"}}>H{h.house} — {h.name}</div>
                        <div style={{fontSize:10,color:"#605890",fontStyle:"italic"}}>{h.theme}</div>
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
                        <div style={{fontSize:13,fontWeight:600,color:"#f0e8d0"}}>H{h.house} — {h.name}</div>
                        <div style={{fontSize:10,color:"#605890",fontStyle:"italic"}}>{h.theme}</div>
                      </div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:700,color:"#ef4444"}}>{h.score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Planet insight cards */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ What Each Planet Offers You</div>
            <div className="card-title serif">Planet-Level Insights</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {result.planetInsights.map((ins,idx)=>{
                const p = result.planets[idx];
                return (
                  <div key={ins.planet} style={{
                    background:"rgba(255,255,255,0.02)",
                    border:`1px solid ${p.gradeColor}22`,
                    borderRadius:12,padding:14
                  }}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <span style={{fontSize:22,color:p.color,flexShrink:0}}>{p.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <div style={{fontSize:14,fontWeight:600,color:"#f0e8d0"}}>{tp(p.planet)} <span style={{fontSize:10,color:"#605890",fontWeight:400}}>— {p.desc}</span></div>
                          <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:700,color:p.gradeColor}}>{p.total}/{p.max}</span>
                            <span className={`badge ${p.grade==="Strong"?"badge-green":p.grade==="Average"?"badge-gold":"badge-red"}`}>{p.grade}</span>
                          </div>
                        </div>
                        <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75,marginBottom:6}}>{ins.totalInsight}</div>
                        <div style={{fontSize:11,color:"#60a5fa",lineHeight:1.7,borderTop:"1px solid #1c1840",paddingTop:6}}>{ins.topHouseInsight}</div>
                        {ins.weakHouses.length>0 && (
                          <div style={{fontSize:10,color:"#ef4444",marginTop:4}}>
                            Low contribution: H{ins.weakHouses.join(", H")} — avoid forcing results in those areas during weak periods
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transit summary */}
          <div className="card">
            <div className="card-tag">✦ Transit Delivery Summary</div>
            <div className="card-title serif">Best & Sensitive Houses for Transit Results</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.8,marginBottom:14}}>
              When planets transit through your chart, houses with high Sodhya Pinda scores deliver results more readily.
              Low-score zones are sensitive — major transits there need extra preparation and remedies.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:12,color:"#22c55e",fontWeight:700,marginBottom:8}}>Best Delivery Zones</div>
                {result.bestTransitHouses.map(h=>(
                  <div key={h.house} style={{marginBottom:8,padding:10,background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.12)",borderRadius:10}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#f0e8d0"}}>H{h.house} — {h.name}</div>
                    <div style={{fontSize:10,color:"#22c55e"}}>{h.grade} · Score {h.score}</div>
                    <div style={{fontSize:11,color:"#c8c0a8",marginTop:4,lineHeight:1.6}}>{h.guidance}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontSize:12,color:"#ef4444",fontWeight:700,marginBottom:8}}>Sensitive Transit Zones</div>
                {result.sensitiveTransitHouses.map(h=>(
                  <div key={h.house} style={{marginBottom:8,padding:10,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:10}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#f0e8d0"}}>H{h.house} — {h.name}</div>
                    <div style={{fontSize:10,color:"#ef4444"}}>{h.grade} · Score {h.score}</div>
                    <div style={{fontSize:11,color:"#c8c0a8",marginTop:4,lineHeight:1.6}}>{h.guidance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SARVA TAB ── */}
      {activeTab==="sarva" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Sarvashtakavarga — All 12 Houses</div>
            <div className="card-title serif">Total Bindu Scores</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.8,marginBottom:14}}>
              Sarvashtakavarga is the sum of all 7 planets&apos; contributions to each house. A house scoring 28+ bindus is considered strong
              (fate works naturally there); 25–27 is average; below 25 needs extra effort and remedies to produce results.
              The classical standard total is 337 bindus across all 12 houses.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:16}}>
              {result.sarva.map((v,i)=>(
                <div key={i} style={{background:`${v>=28?"rgba(34,197,94":v>=25?"rgba(200,160,48":"rgba(239,68,68"},0.08)`,
                  border:`1px solid ${v>=28?"rgba(34,197,94":v>=25?"rgba(200,160,48":"rgba(239,68,68"},0.25)`,
                  borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#605890",marginBottom:4}}>H{i+1}</div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:700,
                    color:v>=28?"#22c55e":v>=25?"#c8a030":"#ef4444",lineHeight:1}}>{v}</div>
                  <div style={{fontSize:9,color:v>=28?"#22c55e":v>=25?"#c8a030":"#ef4444",marginTop:4}}>
                    {v>=28?"Strong":v>=25?"Average":"Weak"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr>
                    <th style={{color:"#3a3060",padding:"0 8px 12px",textAlign:"left",fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase"}}>Planet</th>
                    {Array.from({length:12},(_,i)=>(
                      <th key={i} style={{color:"#3a3060",padding:"0 4px 12px",textAlign:"center",fontSize:10}}>H{i+1}</th>
                    ))}
                    <th style={{color:"#3a3060",padding:"0 8px 12px",textAlign:"center",fontSize:10}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.planets.map(p=>(
                    <tr key={p.planet}>
                      <td style={{padding:"8px",borderBottom:"1px solid #1c1840"}}>
                        <span style={{color:p.color,marginRight:6}}>{p.icon}</span>
                        <span style={{color:"#c8c0a8",fontWeight:500}}>{tp(p.planet)}</span>
                      </td>
                      {p.bindus.map((b,i)=>(
                        <td key={i} style={{padding:"8px 4px",borderBottom:"1px solid #1c1840",textAlign:"center",color:binduColor(b),fontWeight:b>=5?600:400}}>{b}</td>
                      ))}
                      <td style={{padding:"8px",borderBottom:"1px solid #1c1840",textAlign:"center",
                        fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:p.gradeColor}}>{p.total}</td>
                    </tr>
                  ))}
                  <tr style={{background:"rgba(200,160,48,0.05)"}}>
                    <td style={{padding:"8px",fontWeight:600,color:"#c8a030"}}>Sarva</td>
                    {result.sarva.map((v,i)=>(
                      <td key={i} style={{padding:"8px 4px",textAlign:"center",fontWeight:700,
                        color:v>=28?"#22c55e":v>=25?"#c8a030":"#ef4444"}}>{v}</td>
                    ))}
                    <td style={{padding:"8px",textAlign:"center",fontFamily:"Cormorant Garamond,serif",
                      fontSize:18,fontWeight:700,color:"#c8a030"}}>{result.sarvaTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PLANETS TAB ── */}
      {activeTab==="planets" && (
        <div className="grid-auto">
          {result.planets.map((p,pi)=>{
            const ins = result.planetInsights[pi];
            return (
              <div key={p.planet} className="card" style={{borderColor:`${p.gradeColor}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:22,color:p.color}}>{p.icon}</span>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"#f0e8d0"}}>{tp(p.planet)}</div>
                      <div style={{fontSize:10,color:"#605890"}}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:700,color:p.gradeColor,lineHeight:1}}>{p.total}</div>
                    <div style={{fontSize:10,color:"#605890"}}>/ {p.max} · {p.pct}%</div>
                  </div>
                </div>
                <div className="bar-track" style={{marginBottom:10}}>
                  <div className="bar-fill" style={{width:`${p.pct}%`,background:p.gradeColor}}/>
                </div>
                <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75,marginBottom:8}}>{ins?.totalInsight}</div>
                {ins && (
                  <div style={{fontSize:11,color:"#60a5fa",lineHeight:1.7,borderTop:"1px solid #1c1840",paddingTop:8,marginBottom:8}}>{ins.topHouseInsight}</div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3}}>
                  {p.bindus.map((b,i)=>(
                    <div key={i} style={{textAlign:"center",padding:"4px 2px",borderRadius:6,
                      background:`rgba(255,255,255,0.03)`,border:"1px solid #1c1840"}}>
                      <div style={{fontSize:8,color:"#3a3060"}}>H{i+1}</div>
                      <div style={{fontSize:13,fontWeight:600,color:binduColor(b)}}>{b}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:8}}>
                  <span className={`badge ${p.grade==="Strong"?"badge-green":p.grade==="Average"?"badge-gold":"badge-red"}`}>
                    {p.grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── HOUSES TAB ── */}
      {activeTab==="houses" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ House-by-House Analysis</div>
            <div className="card-title serif">What Each House Score Means</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.8,marginBottom:4}}>
              Each house score tells you how much cosmic support that life area receives. 28+ bindus = strong (fate cooperates);
              25–27 = average (effort brings results); below 25 = sensitive (requires planning, timing, and remedies).
              These scores are fixed by birth — use them as a lifetime navigation map, not a temporary weather forecast.
            </div>
          </div>
          <div className="grid-auto">
            {result.houses.map(h=>(
              <div key={h.house} className="card" style={{borderColor:`${h.color}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:10,color:"#605890",marginBottom:3}}>House {h.house}</div>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:"#f0e8d0"}}>{h.name}</div>
                    <div style={{fontSize:10,color:"#605890",marginTop:2,fontStyle:"italic"}}>{h.theme}</div>
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
                <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75,marginBottom:8}}>{h.interp}</div>
                {h.topPlanets.length>0&&(
                  <div style={{fontSize:10,color:"#605890"}}>Top contributors: {h.topPlanets.join(", ")}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SODHYA PINDA TAB ── */}
      {activeTab==="sodhya" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Sodhya Pinda</div>
            <div className="card-title serif">Transit Delivery Strength</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.8,marginBottom:14}}>
              Sodhya Pinda refines Sarvashtakavarga by weighting each house&apos;s bindus against rashi-level planetary dignity.
              A planet transiting its own sign, exaltation, or friendly sign in your chart activates that house more powerfully.
              Use this as your transit delivery map: high-score zones can give smoother results when activated by dasha and gochar;
              low-score zones need patience, planning, and remedies before expecting outcomes.
            </div>
            <div className="grid-auto">
              {result.sodhyaPinda.map(h=>(
                <div key={h.house} className="card" style={{borderColor:`${h.color}44`,background:`${h.color}0d`}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:10,color:"#605890",marginBottom:3}}>H{h.house} · {h.sign}</div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,fontWeight:600,color:"#f0e8d0"}}>{h.name}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:31,fontWeight:700,color:h.color,lineHeight:1}}>{h.score}</div>
                      <div style={{fontSize:10,color:h.color}}>{h.grade}</div>
                    </div>
                  </div>
                  <div className="bar-track" style={{margin:"12px 0 10px"}}>
                    <div className="bar-fill" style={{width:`${Math.min(100,(h.score/40)*100)}%`,background:h.color}}/>
                  </div>
                  <div style={{fontSize:11,color:"#605890",marginBottom:6}}>SAV bindus: {h.bindus}</div>
                  <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.7}}>{h.guidance}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HOW TO READ AKV TAB ── */}
      {activeTab==="guide" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Classical Foundation</div>
            <div className="card-title serif">What is Ashtakavarga?</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.9}}>
              Ashtakavarga (Sanskrit: अष्टकवर्ग) means &quot;group of eight.&quot; It is one of the most sophisticated predictive tools
              in Jyotisha, first described in the Brihat Parashara Hora Shastra. Each of the 7 planets casts &quot;bindus&quot; (benefic points)
              into the 12 houses from its own position and the positions of the other 6 planets plus the Lagna (ascendant) —
              8 contributors in total. This gives each planet a 12-house bindu map showing where it is most activated in your chart.
              Sarvashtakavarga is the sum of all 7 planets across all 12 houses, giving you a total life-map score.
            </div>
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Reading Your Scores</div>
            <div className="card-title serif">The Bindu Scale</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {[
                {range:"28–36 bindus",grade:"Strong",color:"#22c55e",meaning:"This house has strong cosmic backing. Planets transiting here are likely to produce positive results. Dashas involving this house tend to deliver."},
                {range:"25–27 bindus",grade:"Average",color:"#c8a030",meaning:"Moderate support. Results come but require effort and good timing. Favourable planet transits and dashas still deliver."},
                {range:"Below 25",grade:"Weak",color:"#ef4444",meaning:"Lighter cosmic support. This life area faces more friction, delays, or challenges. Remedies, timing, and patience are essential before expecting results."},
              ].map(row=>(
                <div key={row.grade} style={{display:"flex",gap:12,padding:12,borderRadius:12,background:`${row.color}0a`,border:`1px solid ${row.color}22`}}>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:700,color:row.color,flexShrink:0,width:90}}>{row.range}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:row.color,marginBottom:3}}>{row.grade}</div>
                    <div style={{fontSize:11,color:"#c8c0a8",lineHeight:1.7}}>{row.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Using AKV Practically</div>
            <div className="card-title serif">How to Apply This in Life</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {q:"Should I start a business?",a:"Look at H7 (partnerships/trade) and H11 (gains). High bindus = natural tailwind. Low bindus = proceed carefully, choose partners well."},
                {q:"When will I get married?",a:"H7 score tells you cosmic support for marriage. Combined with dasha timing and planet transit through H7, high-bindu periods are most likely windows."},
                {q:"Which career suits me?",a:"H10 (career/status) bindus show how strongly fate backs your professional ambitions. H6 shows service/competition strength."},
                {q:"Where are my spiritual strengths?",a:"H9 (dharma/fortune) and H12 (liberation) bindus point to spirituality and fortune. High H9 = blessings come through right action."},
                {q:"How do I use Sodhya Pinda?",a:"When a major planet (Jupiter, Saturn) is transiting a house, check its Sodhya score. Excellent/Good scores = results are more likely to manifest during this transit."},
              ].map((item,i)=>(
                <div key={i} style={{padding:12,borderRadius:12,background:"rgba(255,255,255,0.02)",border:"1px solid #1c1840"}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#c8a030",marginBottom:4}}>{item.q}</div>
                  <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75}}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-tag">✦ Important Context</div>
            <div className="card-title serif">AKV Is One Layer of the Chart</div>
            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.9}}>
              Ashtakavarga shows the cosmic baseline — the level of universal support a house has received at birth.
              It does not override other factors: a strong Dasha lord can activate even a weak house, and a malefic transit
              can disturb a strong house temporarily. The most accurate predictions combine AKV with Dasha/Antardasha periods,
              Gochar (transit) analysis, and the natal chart&apos;s house lord positions.
              Use high-bindu houses as your primary zones for initiating important actions; use low-bindu houses as reminders
              to slow down, prepare more carefully, and use remedies when action is unavoidable there.
            </div>
          </div>
        </div>
      )}

      </PremiumFeature>
    </div>
  );
}
