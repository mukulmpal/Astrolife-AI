"use client";
import { useState, useRef, useEffect } from "react";
import "@/app/dashboard/shared.css";
import { calculateADDestiny, calculateDestiny } from "@/lib/astro-engine/destiny";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
import { EngineEmptyState } from "@/components/engine/engine-intro";

const PLANET_SHORT: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

function formatPeriodDate(date: Date) {
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export default function DestinyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<"curve"|"areas"|"dashas"|"now">("curve");
  const [dashaView, setDashaView] = useState<"md"|"ad">("md");
  const [selectedMdIndex, setSelectedMdIndex] = useState(0);
  const { birth, chart, hasUserChart } = useUserChart();
  const { t } = useLanguage();
  const result = calculateDestiny(chart.planets as never, chart.dashas, birth.dob, chart.lagnaNum ?? 0);
  const selectedMd = result.bands[selectedMdIndex] ?? result.bands.find((band) => band.startAge <= result.currentAge && result.currentAge < band.endAge) ?? result.bands[0];
  const adResult = selectedMd
    ? calculateADDestiny(
        selectedMd.planet,
        selectedMd.start,
        selectedMd.end,
        (selectedMd.end.getTime() - selectedMd.start.getTime()) / (365.25 * 24 * 3600 * 1000),
        chart.planets as never,
        chart.lagnaNum ?? 0,
      )
    : null;

  // Draw canvas curve
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d"); if(!ctx) return;
    const W=canvas.width, H=canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#08051a"; ctx.fillRect(0,0,W,H);

    const maxAge=90, L=48, R=16, T=16, B=32;
    const chartW=W-L-R, chartH=H-T-B;

    // Grid
    ctx.strokeStyle="#1e1a3a"; ctx.lineWidth=0.5;
    [20,30,40,50,60,70,80,90].forEach(v=>{
      const y=T+chartH-(v/100*chartH);
      ctx.beginPath(); ctx.moveTo(L,y); ctx.lineTo(W-R,y); ctx.stroke();
      ctx.fillStyle="#3a3060"; ctx.font="9px Outfit,sans-serif";
      ctx.textAlign="right"; ctx.fillText(v+"%",L-4,y+3);
    });
    [0,10,20,30,40,50,60,70,80,90].forEach(a=>{
      const x=L+(a/maxAge*chartW);
      const baseYear = result.points[0]?.year;
      const axisYear = result.points.find((point) => point.age === a)?.year ?? (typeof baseYear === "number" ? baseYear + a : a);
      ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,T+chartH); ctx.stroke();
      ctx.fillStyle="#3a3060"; ctx.font="9px Outfit,sans-serif";
      ctx.textAlign="center";
      ctx.fillText(String(axisYear),x,H-4);
    });

    // Dasha bands
    result.bands.forEach(b=>{
      const sx=L+(b.startAge/maxAge*chartW);
      const ex=L+(Math.min(b.endAge,maxAge)/maxAge*chartW);
      ctx.fillStyle=b.color+"18"; ctx.fillRect(sx,T,ex-sx,chartH);
      ctx.fillStyle=b.color+"99"; ctx.font="bold 8px Outfit,sans-serif";
      ctx.textAlign="center"; ctx.fillText(b.planet,(sx+ex)/2,T+12);
    });

    // Gradient fill
    const grad=ctx.createLinearGradient(0,T,0,T+chartH);
    grad.addColorStop(0,"rgba(200,160,48,0.25)"); grad.addColorStop(1,"rgba(200,160,48,0)");
    ctx.beginPath();
    result.points.forEach((p,i)=>{
      const x=L+(p.age/maxAge*chartW), y=T+chartH-(p.score/100*chartH);
      if(i===0){ctx.moveTo(x,T+chartH); ctx.lineTo(x,y);}
      else ctx.lineTo(x,y);
    });
    const last=result.points[result.points.length-1];
    ctx.lineTo(L+(last.age/maxAge*chartW),T+chartH);
    ctx.closePath(); ctx.fillStyle=grad; ctx.fill();

    // Curve line
    ctx.beginPath();
    result.points.forEach((p,i)=>{
      const x=L+(p.age/maxAge*chartW), y=T+chartH-(p.score/100*chartH);
      if (i === 0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    });
    ctx.strokeStyle="rgba(200,160,48,0.9)"; ctx.lineWidth=2; ctx.stroke();

    // NOW line
    const nowX=L+(result.currentAge/maxAge*chartW);
    ctx.beginPath(); ctx.moveTo(nowX,T); ctx.lineTo(nowX,T+chartH);
    ctx.strokeStyle="#22c55e"; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle="#22c55e"; ctx.font="bold 8px Outfit,sans-serif";
    ctx.textAlign="center"; ctx.fillText("NOW",nowX,T+chartH+14);

    // Peak dot
    const pkBand=result.peak;
    if(pkBand){
      const pkAge=Math.round((pkBand.startAge+pkBand.endAge)/2);
      const pkScore=result.points.find(p=>p.age===pkAge)?.score||pkBand.score;
      const pkX=L+(pkAge/maxAge*chartW), pkY=T+chartH-(pkScore/100*chartH);
      ctx.beginPath(); ctx.arc(pkX,pkY,5,0,Math.PI*2);
      ctx.fillStyle="#c8a030"; ctx.fill();
      ctx.fillStyle="#c8a030"; ctx.font="bold 8px Outfit,sans-serif";
      ctx.textAlign="center"; ctx.fillText("PEAK",pkX,pkY-10);
    }
  }, [result]);

  if (!hasUserChart || !birth.name) {
    return (
      <EngineEmptyState
        engineName="Destiny Timeline"
        engineIcon="📈"
        whatItAnalyzes={["Life-score curve", "Peak & challenge periods", "6 life-area scores", "Dasha-based timing"]}
      />
    );
  }

  return (
    <div className="page">
      <div className="page-tag">{t("destiny.page_tag")}</div>
      <h1 className="page-title serif">{t("destiny.page_title")}</h1>
      <p className="page-sub">Dasha-based life scoring · Peak & challenge periods · 6 life area scores</p>
      <PremiumFeature feature="Destiny Timeline">

      {/* HEADER */}
      <div className="header-card">
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#c8a030",marginBottom:6}}>📈 Destiny Analysis</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:"#f0e8d0"}}>{birth.name}</div>
          <div style={{fontSize:13,color:"#605890",marginTop:4}}>Age {result.currentAge} · {result.currentDasha} Mahadasha · Score {result.currentScore}%</div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative",zIndex:1}}>
          <div className="hstat">
            <div className="hstat-n">{result.currentScore}%</div>
            <div className="hstat-l">NOW</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{color:"#22c55e",fontSize:16}}>{result.peak?.planet}</div>
            <div className="hstat-l">PEAK DASHA</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{color:"#ef4444",fontSize:16}}>{result.challenge?.planet}</div>
            <div className="hstat-l">CHALLENGE</div>
          </div>
        </div>
      </div>

      <div className="summary-strip">📈 {result.summary}</div>

      {/* TABS */}
      <div className="tabs">
        {([["curve","Life Curve"],["now","Now & Next"],["areas","6 Life Areas"],["dashas","Dasha Timeline"]] as const).map(([t,l])=>(
          <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>{l}</button>
        ))}
      </div>

      {/* ── CURVE TAB ── */}
      {activeTab==="curve" && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-tag">✦ Destiny Curve — Age 0 to 90</div>
            <div className="card-title serif">Your Life Score Timeline</div>
            <canvas ref={canvasRef} width={760} height={300}
              style={{width:"100%",height:"auto",borderRadius:8}}/>
            <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap",fontSize:11,color:"#605890"}}>
              <span style={{color:"#c8a030"}}>━ Life Score</span>
              <span style={{color:"#22c55e"}}>━ Current Age</span>
              <span>Colored bands = Mahadasha periods</span>
            </div>
          </div>

          {/* Peak & Challenge */}
          <div className="grid-2">
            <div className="card" style={{borderColor:"rgba(200,160,48,0.3)"}}>
              <div className="card-tag">🌟 Peak Period</div>
              <div className="card-title serif">{result.peak?.planet} Mahadasha</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:36,fontWeight:700,color:"#c8a030",lineHeight:1,marginBottom:4}}>
                {result.peak?.score}%
              </div>
              <div style={{fontSize:13,color:"#605890"}}>
                {result.peak?.start.getFullYear()} – {result.peak?.end.getFullYear()}
              </div>
              <div style={{fontSize:12,color:"#c8c0a8",marginTop:8,lineHeight:1.7}}>
                This is your highest scoring Mahadasha period. Maximum energy, opportunities, and life force are available. Plan important milestones in this window.
              </div>
            </div>
            <div className="card" style={{borderColor:"rgba(239,68,68,0.3)"}}>
              <div className="card-tag">⚠️ Challenge Period</div>
              <div className="card-title serif">{result.challenge?.planet} Mahadasha</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:36,fontWeight:700,color:"#ef4444",lineHeight:1,marginBottom:4}}>
                {result.challenge?.score}%
              </div>
              <div style={{fontSize:13,color:"#605890"}}>
                {result.challenge?.start.getFullYear()} – {result.challenge?.end.getFullYear()}
              </div>
              <div style={{fontSize:12,color:"#c8c0a8",marginTop:8,lineHeight:1.7}}>
                This period requires extra patience and preparation. Focus on inner work, remedies, and building foundations rather than expecting quick results.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOW TAB ── */}
      {activeTab==="now" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="grid-2">
            {result.currentDrivers.map(d=>(
              <div key={`${d.role}-${d.planet}`} className="card" style={{borderColor:d.tone==="support"?"rgba(34,197,94,0.3)":d.tone==="caution"?"rgba(239,68,68,0.3)":"rgba(200,160,48,0.3)"}}>
                <div className="card-tag">✦ {d.role} Driver</div>
                <div className="card-title serif">{d.planet}</div>
                <span className={`badge ${d.tone==="support"?"badge-green":d.tone==="caution"?"badge-red":"badge-gold"}`}>{d.tone}</span>
                <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75,marginTop:10}}>{d.message}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-tag">✦ Next 5 Years</div>
            <div className="card-title serif">Milestone Watch</div>
            {result.nextMilestones.map(m=>(
              <div key={`${m.year}-${m.age}`} style={{display:"flex",gap:12,alignItems:"center",padding:"9px 0",borderBottom:"1px solid #1c1840"}}>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,color:m.trend==="rise"?"#22c55e":m.trend==="dip"?"#ef4444":"#c8a030",width:48}}>{m.score}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#f0e8d0"}}>Age {m.age} · {m.year} · {m.trend}</div>
                  <div style={{fontSize:11,color:"#605890",lineHeight:1.6}}>{m.message}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-tag">✦ Action Plan</div>
            <div className="card-title serif">Current Dasha Guidance</div>
            {result.actionPlan.map((line,i)=>(
              <div key={i} style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75,padding:"7px 0",borderBottom:i===result.actionPlan.length-1?"none":"1px solid #1c1840"}}>
                {i+1}. {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AREAS TAB ── */}
      {activeTab==="areas" && (
        <div>
          <div className="grid-3" style={{gap:14}}>
            {result.areas.map(a=>(
              <div key={a.name} className="card" style={{borderColor:`${a.color}33`,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>{a.icon}</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:"#f0e8d0",marginBottom:8}}>{a.name}</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:44,fontWeight:700,color:a.color,lineHeight:1,marginBottom:4}}>
                  {a.score}
                </div>
                <div className="bar-track" style={{marginBottom:8}}>
                  <div className="bar-fill" style={{width:`${a.score}%`,background:a.color}}/>
                </div>
                <span className={`badge ${a.status==="Strong"?"badge-green":a.status==="Average"?"badge-gold":"badge-red"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>

          {/* Life areas advice */}
          <div className="card" style={{marginTop:16}}>
            <div className="card-tag">✦ Life Areas Interpretation</div>
            <div className="card-title serif">What Each Score Means</div>
            {result.areas.map(a=>(
              <div key={a.name} style={{padding:"10px 0",borderBottom:"1px solid #1c1840",display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:20,width:28}}>{a.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#f0e8d0",marginBottom:2}}>{a.name}</div>
                  <div style={{fontSize:11,color:"#605890"}}>
                    {a.status==="Strong"
                      ? `${a.name} is strongly supported. Current dasha activates this area positively.`
                      : a.status==="Average"
                      ? `${a.name} shows mixed results. Effort brings rewards but don't expect automatic gains.`
                      : `${a.name} needs attention. Focused remedies and effort will improve outcomes.`}
                  </div>
                </div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:700,color:a.color}}>{a.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DASHAS TAB ── */}
      {activeTab==="dashas" && (
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start",flexWrap:"wrap",marginBottom:14}}>
            <div>
              <div className="card-tag">✦ Mahadasha - Antardasha Destiny Chart</div>
              <div className="card-title serif">Life Periods Scored</div>
              <div style={{fontSize:12,color:"#605890",lineHeight:1.6}}>
                View the full Mahadasha map, then open any MD to see its Antardasha sequence with start year, end year and confidence score.
              </div>
            </div>
            <div style={{display:"flex",gap:8,background:"#08051a",border:"1px solid #1c1840",borderRadius:8,padding:4}}>
              <button className={`tab ${dashaView==="md"?"active":""}`} style={{padding:"8px 12px"}} onClick={()=>setDashaView("md")}>MD Chart</button>
              <button className={`tab ${dashaView==="ad"?"active":""}`} style={{padding:"8px 12px"}} onClick={()=>setDashaView("ad")}>MD - AD Chart</button>
            </div>
          </div>

          {dashaView==="md" && (
            <div>
              {result.bands.map((b,i)=>{
                const isNow=b.startAge<=result.currentAge&&result.currentAge<b.endAge;
                const isSelected=i===selectedMdIndex;
                return (
                  <button
                    key={`${b.planet}-${b.start.toISOString()}`}
                    className={`dasha-item ${isNow?"active":""}`}
                    style={{
                      width:"100%",
                      textAlign:"left",
                      cursor:"pointer",
                      borderColor:isSelected?`${b.color}88`:isNow?`${b.color}55`:"#1c1840",
                      background:isSelected?`${b.color}12`:undefined,
                    }}
                    onClick={()=>{ setSelectedMdIndex(i); setDashaView("ad"); }}
                  >
                    <div style={{width:8,height:8,borderRadius:"50%",background:isNow?b.color:"#1c1840",flexShrink:0,
                      boxShadow:isNow?`0 0 8px ${b.color}88`:"none"}}/>
                    <span style={{fontSize:13,fontWeight:600,color:b.color,width:24}}>{PLANET_SHORT[b.planet] ?? b.planet.slice(0,2)}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:isNow?b.color:"#c8c0a8"}}>
                        {b.planet} Mahadasha
                      </div>
                      <div style={{fontSize:11,color:"#605890"}}>
                        Age {Math.round(b.startAge)} - {Math.round(b.endAge)} · {formatPeriodDate(b.start)} - {formatPeriodDate(b.end)}
                      </div>
                      <div style={{fontSize:10,color:"#8f82c8",marginTop:3}}>
                        Click to open {b.planet} MD antardasha chart
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,
                        color:b.score>=70?"#22c55e":b.score>=50?"#c8a030":"#ef4444"}}>{b.score}%</div>
                      {isNow&&<div style={{fontSize:10,color:"#22c55e",fontWeight:600}}>ACTIVE</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {dashaView==="ad" && selectedMd && adResult && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
                {result.bands.map((b,i)=>(
                  <button
                    key={`${b.planet}-${b.start.toISOString()}-selector`}
                    className={`tab ${i===selectedMdIndex?"active":""}`}
                    style={{whiteSpace:"nowrap",padding:"8px 12px",borderColor:i===selectedMdIndex?`${b.color}77`:undefined}}
                    onClick={()=>setSelectedMdIndex(i)}
                  >
                    {b.planet} MD · {b.start.getFullYear()}-{b.end.getFullYear()}
                  </button>
                ))}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
                <div style={{background:"#08051a",border:"1px solid #1c1840",borderRadius:8,padding:14,overflow:"hidden"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:12}}>
                    <div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:selectedMd.color}}>
                        {selectedMd.planet} Mahadasha Antardasha Flow
                      </div>
                      <div style={{fontSize:11,color:"#605890"}}>
                        {formatPeriodDate(selectedMd.start)} - {formatPeriodDate(selectedMd.end)} · {adResult.bands.length} sub-periods
                      </div>
                    </div>
                    <span className={`badge ${adResult.currentAD?.tone==="support"?"badge-green":adResult.currentAD?.tone==="caution"?"badge-red":"badge-gold"}`}>
                      Current AD: {adResult.currentAD?.adPlanet ?? "Not active"}
                    </span>
                  </div>

                  {(() => {
                    const mdStart = selectedMd.start.getTime();
                    const mdEnd = selectedMd.end.getTime();
                    const mdDuration = Math.max(1, mdEnd - mdStart);
                    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
                    const toX = (date: Date) => clamp(((date.getTime() - mdStart) / mdDuration) * 100, 0, 100);
                    const scores = adResult.points.map((point) => point.score);
                    const minScore = Math.min(...scores);
                    const maxScore = Math.max(...scores);
                    const scoreRange = Math.max(10, maxScore - minScore);
                    const toY = (score: number) => clamp(84 - ((score - minScore) / scoreRange) * 64, 12, 84);
                    const graphPoints = adResult.points.map((point) => ({
                      ...point,
                      x: toX(point.date),
                      y: toY(point.score),
                    }));
                    const pathLine = graphPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
                    const areaPath = graphPoints.length
                      ? `${pathLine} L ${graphPoints[graphPoints.length - 1].x.toFixed(2)} 96 L ${graphPoints[0].x.toFixed(2)} 96 Z`
                      : "";
                    const peakPoint = graphPoints.reduce((best, point) => point.score > best.score ? point : best, graphPoints[0]);
                    const lowPoint = graphPoints.reduce((best, point) => point.score < best.score ? point : best, graphPoints[0]);
                    const startYear = selectedMd.start.getFullYear();
                    const endYear = selectedMd.end.getFullYear();
                    const yearStep = endYear - startYear > 16 ? 5 : endYear - startYear > 8 ? 3 : 1;
                    const yearTicks = Array.from(
                      new Set([
                        startYear,
                        ...Array.from({ length: Math.max(0, Math.floor((endYear - startYear) / yearStep) + 1) }, (_, idx) => startYear + idx * yearStep),
                        endYear,
                      ]),
                    ).filter((year) => year >= startYear && year <= endYear);

                    return (
                      <div style={{position:"relative",height:340,width:"100%",borderRadius:8,background:"linear-gradient(180deg,#0b0822,#08051a)",border:"1px solid #1c1840",padding:"18px 14px 44px",overflow:"hidden"}}>
                        {[maxScore, Math.round((maxScore + minScore) / 2), minScore].map((score)=>(
                          <div key={score} style={{position:"absolute",left:58,right:18,top:`${toY(score)}%`,borderTop:"1px solid rgba(96,88,144,0.22)"}}>
                            <span style={{position:"absolute",left:-42,top:-9,fontSize:9,color:"#8f82c8"}}>{score}%</span>
                          </div>
                        ))}

                        <div style={{position:"absolute",left:58,right:18,top:18,bottom:44}}>
                          {adResult.bands.map((band)=>{
                            const startPct=toX(band.start);
                            const endPct=toX(band.end);
                            const width=Math.max(3,endPct-startPct);
                            return (
                              <div
                                key={`${band.adPlanet}-${band.start.toISOString()}-band`}
                                title={`${selectedMd.planet}/${band.adPlanet}: ${formatPeriodDate(band.start)} - ${formatPeriodDate(band.end)} · ${band.score}%`}
                                style={{position:"absolute",left:`${startPct}%`,width:`${width}%`,top:0,bottom:0,background:`${band.color}14`,borderLeft:`1px solid ${band.color}55`}}
                              >
                                <div style={{fontSize:10,fontWeight:700,color:band.color,textAlign:"center",paddingTop:8,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                  {PLANET_SHORT[selectedMd.planet] ?? selectedMd.planet}/{PLANET_SHORT[band.adPlanet] ?? band.adPlanet}
                                </div>
                              </div>
                            );
                          })}

                          {yearTicks.map((year)=> {
                            const x = toX(new Date(year, 0, 1));
                            return (
                              <div key={`${selectedMd.planet}-${year}-tick`} style={{position:"absolute",left:`${x}%`,top:0,bottom:-22,borderLeft:"1px solid rgba(255,255,255,0.08)"}}>
                                <span style={{position:"absolute",bottom:-20,left:0,transform:"translateX(-50%)",fontSize:9,color:"#605890"}}>{year}</span>
                              </div>
                            );
                          })}

                          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:"absolute",inset:0,overflow:"visible"}}>
                            <defs>
                              <linearGradient id={`ad-score-fill-${selectedMd.planet}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(250, 204, 21, 0.34)" />
                                <stop offset="100%" stopColor="rgba(250, 204, 21, 0.02)" />
                              </linearGradient>
                              <filter id={`ad-score-glow-${selectedMd.planet}`} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="1.6" result="coloredBlur" />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            {areaPath && <path d={areaPath} fill={`url(#ad-score-fill-${selectedMd.planet})`} />}
                            <path
                              d={pathLine}
                              fill="none"
                              stroke="rgba(250,204,21,0.98)"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                              filter={`url(#ad-score-glow-${selectedMd.planet})`}
                            />
                            <path
                              d={pathLine}
                              fill="none"
                              stroke="rgba(255,255,255,0.45)"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>

                          {[peakPoint, lowPoint].filter(Boolean).map((point, index) => {
                            const isPeak = index === 0;
                            return (
                              <div
                                key={`${point.date.toISOString()}-${isPeak ? "peak" : "low"}`}
                                style={{position:"absolute",left:`${point.x}%`,top:`${point.y}%`,transform:"translate(-50%,-50%)",zIndex:3}}
                              >
                                <div style={{width:12,height:12,borderRadius:"50%",background:isPeak?"#22c55e":"#ef4444",border:"2px solid #f0e8d0",boxShadow:isPeak?"0 0 18px rgba(34,197,94,0.8)":"0 0 18px rgba(239,68,68,0.75)"}}/>
                                <div style={{position:"absolute",left:"50%",top:isPeak?-32:16,transform:"translateX(-50%)",whiteSpace:"nowrap",fontSize:10,fontWeight:800,color:isPeak?"#22c55e":"#ef4444",background:"rgba(8,5,26,0.82)",border:`1px solid ${isPeak?"rgba(34,197,94,0.45)":"rgba(239,68,68,0.45)"}`,borderRadius:999,padding:"3px 7px"}}>
                                  {isPeak ? "Peak" : "Low"} {point.score}%
                                </div>
                              </div>
                            );
                          })}

                          {adResult.bands.map((band)=> {
                            const mid = (toX(band.start) + toX(band.end)) / 2;
                            const bandPoint = graphPoints.find((point) => point.adPlanet === band.adPlanet) ?? graphPoints[0];
                            return (
                              <div key={`${band.adPlanet}-${band.start.toISOString()}-label`} style={{position:"absolute",left:`${mid}%`,top:`${bandPoint ? bandPoint.y : 50}%`,transform:"translate(-50%,-50%)",zIndex:2}}>
                                <div style={{width:7,height:7,borderRadius:"50%",background:band.color,border:"1px solid rgba(255,255,255,0.7)",boxShadow:`0 0 10px ${band.color}aa`}}/>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{position:"absolute",left:72,right:22,bottom:10,display:"flex",justifyContent:"space-between",fontSize:10,color:"#8f82c8"}}>
                          <span>Score trend line · normalized for this MD</span>
                          <span>Green = peak · Red = low · Bands = Antardasha</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="card" style={{padding:14}}>
                  <div className="card-tag">✦ AD Intelligence</div>
                  <div className="card-title serif" style={{fontSize:20}}>{adResult.mdPlanet} MD</div>
                  <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.7,marginBottom:12}}>{adResult.summary}</div>
                  {adResult.actionPlan.slice(0,3).map((line,i)=>(
                    <div key={i} style={{fontSize:11,color:"#8f82c8",lineHeight:1.65,padding:"7px 0",borderTop:"1px solid #1c1840"}}>
                      {i+1}. {line}
                    </div>
                  ))}
                </div>
              </div>

              {(() => {
                const groups: Record<string, typeof adResult.bands> = {};
                adResult.bands.forEach((band) => {
                  const key = band.navtara?.taraName ?? "Unknown";
                  groups[key] = [...(groups[key] ?? []), band];
                });
                const orderedTara = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyari", "Sadhaka", "Vadha", "Mitra", "Parama Mitra"];
                const taraNames = [
                  ...orderedTara.filter((name) => groups[name]?.length),
                  ...Object.keys(groups).filter((name) => !orderedTara.includes(name)),
                ];

                return (
                  <div className="card" style={{padding:14}}>
                    <div className="card-tag">✦ Navtara Map</div>
                    <div className="card-title serif" style={{fontSize:20}}>Which Planet Is Which Tara?</div>
                    <div style={{fontSize:12,color:"#605890",lineHeight:1.6,marginBottom:12}}>
                      This shows how the Antardasha planets behave from your birth Moon nakshatra. Kshema and Sampat support stability and resources; Janma is personal and intense; Vipat, Pratyari and Vadha need more caution.
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
                      {taraNames.map((taraName) => {
                        const items = groups[taraName] ?? [];
                        const sample = items[0];
                        const isSupport = ["Sampat", "Kshema", "Sadhaka", "Mitra", "Parama Mitra"].includes(taraName);
                        const isCaution = ["Vipat", "Pratyari", "Vadha"].includes(taraName);
                        return (
                          <div
                            key={`${selectedMd.planet}-${taraName}-navtara`}
                            style={{
                              border:"1px solid",
                              borderColor:isSupport?"rgba(34,197,94,0.26)":isCaution?"rgba(239,68,68,0.26)":"rgba(200,160,48,0.24)",
                              background:isSupport?"rgba(34,197,94,0.06)":isCaution?"rgba(239,68,68,0.06)":"rgba(200,160,48,0.06)",
                              borderRadius:8,
                              padding:10,
                            }}
                          >
                            <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",marginBottom:6}}>
                              <div style={{fontSize:12,fontWeight:800,color:sample?.navtara?.color ?? "#c8a030"}}>
                                {sample?.navtara?.icon ?? "✦"} {taraName}
                              </div>
                              <span style={{fontSize:10,color:isSupport?"#22c55e":isCaution?"#ef4444":"#c8a030",fontWeight:800}}>
                                {isSupport ? "Support" : isCaution ? "Caution" : "Intense"}
                              </span>
                            </div>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              {items.map((item) => (
                                <span
                                  key={`${item.adPlanet}-${item.start.toISOString()}-${taraName}`}
                                  style={{fontSize:11,fontWeight:700,color:item.color,background:"rgba(8,5,26,0.72)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:999,padding:"4px 7px"}}
                                  title={`${selectedMd.planet}/${item.adPlanet}: ${formatPeriodDate(item.start)} - ${formatPeriodDate(item.end)}`}
                                >
                                  {item.adPlanet}
                                </span>
                              ))}
                            </div>
                            <div style={{fontSize:10,color:"#8f82c8",lineHeight:1.5,marginTop:8}}>
                              {sample?.navtara?.quality ?? "Tara quality unavailable"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10}}>
                {adResult.bands.map((band)=> {
                  const isCurrent=band.start<=new Date() && new Date()<band.end;
                  return (
                    <div key={`${band.adPlanet}-${band.start.toISOString()}-card`} className="card" style={{padding:12,borderColor:isCurrent?`${band.color}88`:"#1c1840"}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",marginBottom:8}}>
                        <div>
                          <div style={{fontSize:10,color:"#605890",textTransform:"uppercase",letterSpacing:1}}>
                            {selectedMd.planet} / {band.adPlanet}
                          </div>
                          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:700,color:band.color}}>
                            {band.adPlanet} Antardasha
                          </div>
                        </div>
                        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:700,color:band.score>=70?"#22c55e":band.score>=50?"#c8a030":"#ef4444"}}>
                          {band.score}
                        </div>
                      </div>
                      <div style={{fontSize:11,color:"#605890",marginBottom:8}}>
                        {formatPeriodDate(band.start)} - {formatPeriodDate(band.end)} · {band.yrs} yrs
                      </div>
                      <div className="bar-track" style={{marginBottom:8}}>
                        <div className="bar-fill" style={{width:`${band.score}%`,background:band.color}}/>
                      </div>
                      <div style={{fontSize:11,color:"#c8c0a8",lineHeight:1.6}}>
                        {band.navtara?.icon} {band.navtara?.taraName} · {band.functionalRole}
                      </div>
                      {isCurrent && <div style={{fontSize:10,color:"#22c55e",fontWeight:700,marginTop:8}}>ACTIVE NOW</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      </PremiumFeature>
    </div>
  );
}
