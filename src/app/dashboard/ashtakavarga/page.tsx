"use client";
import { useState } from "react";
import "@/app/dashboard/shared.css";
import { calculateChart } from "@/lib/astro-engine/calculations";
import { calculateAshtakavarga } from "@/lib/astro-engine/ashtakavarga";

const DEMO = { name:"Mukul Pal", dob:"1995-07-04", tob:"12:30", city:"Delhi" };

export default function AKVPage() {
  const [activeTab, setActiveTab] = useState<"sarva"|"planets"|"houses">("sarva");

  const chart  = calculateChart(DEMO.name, DEMO.dob, DEMO.tob, DEMO.city);
  const result = calculateAshtakavarga(chart.planets as never, chart.lagnaNum);

  const binduColor = (v:number) =>
    v>=5?"#22c55e":v>=4?"#c8a030":v>=3?"#60a5fa":v>=1?"#f97316":"#ef4444";

  return (
    <div className="page">
      <div className="page-tag">📊 Ashtakavarga</div>
      <h1 className="page-title serif">Ashtakavarga <em>Analysis</em></h1>
      <p className="page-sub">Classical bindu tables · Sarvashtakavarga · House strength guide</p>

      {/* HEADER */}
      <div className="header-card">
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#c8a030",marginBottom:6}}>📊 AKV Analysis</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:"#f0e8d0"}}>{DEMO.name}</div>
          <div style={{fontSize:13,color:"#605890",marginTop:4}}>Classical Ashtakavarga · {result.sarvaTotal} total bindus</div>
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
        {[["sarva","Sarvashtakavarga"],["planets","Planet Bindus"],["houses","House Guide"]].map(([t,l])=>(
          <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t as never)}>{l}</button>
        ))}
      </div>

      {/* ── SARVA TAB ── */}
      {activeTab==="sarva" && (
        <div>
          {/* Visual grid */}
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Sarvashtakavarga — All 12 Houses</div>
            <div className="card-title serif">Total Bindu Scores</div>
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

            {/* Full table */}
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
                        <span style={{color:"#c8c0a8",fontWeight:500}}>{p.planet}</span>
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
          {result.planets.map(p=>(
            <div key={p.planet} className="card" style={{borderColor:`${p.gradeColor}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:22,color:p.color}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#f0e8d0"}}>{p.planet}</div>
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
              {/* Bindu cells */}
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
          ))}
        </div>
      )}

      {/* ── HOUSES TAB ── */}
      {activeTab==="houses" && (
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
                <div style={{fontSize:10,color:"#605890"}}>Top: {h.topPlanets.join(", ")}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}