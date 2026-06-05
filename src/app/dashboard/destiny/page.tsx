"use client";
import { useState, useRef, useEffect } from "react";
import "@/app/dashboard/shared.css";
import { calculateDestiny } from "@/lib/astro-engine/destiny";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
import { EngineEmptyState } from "@/components/engine/engine-intro";

export default function DestinyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<"curve"|"areas"|"dashas"|"now">("curve");
  const { birth, chart, hasUserChart } = useUserChart();
  const { t } = useLanguage();
  const result = calculateDestiny(chart.planets as never, chart.dashas, birth.dob, chart.lagnaNum ?? 0);

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
      ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,T+chartH); ctx.stroke();
      ctx.fillStyle="#3a3060"; ctx.font="9px Outfit,sans-serif";
      ctx.textAlign="center"; ctx.fillText(String(1995+a),x,H-4);
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
          <div className="card-tag">✦ Mahadasha Timeline</div>
          <div className="card-title serif">Life Periods Scored</div>
          {result.bands.map((b,i)=>{
            const isNow=b.startAge<=result.currentAge&&result.currentAge<b.endAge;
            return (
              <div key={i} className={`dasha-item ${isNow?"active":""}`} style={{borderColor:isNow?`${b.color}55`:"#1c1840"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:isNow?b.color:"#1c1840",flexShrink:0,
                  boxShadow:isNow?`0 0 8px ${b.color}88`:"none"}}/>
                <span style={{fontSize:13,fontWeight:600,color:b.color,width:24}}>{["Su","Mo","Ma","Me","Ju","Ve","Sa","Ra","Ke"][["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].indexOf(b.planet)]}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:isNow?b.color:"#c8c0a8"}}>
                    {b.planet} Mahadasha
                  </div>
                  <div style={{fontSize:11,color:"#605890"}}>
                    Age {Math.round(b.startAge)} – {Math.round(b.endAge)} · {b.start.getFullYear()} – {b.end.getFullYear()}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,
                    color:b.score>=70?"#22c55e":b.score>=50?"#c8a030":"#ef4444"}}>{b.score}%</div>
                  {isNow&&<div style={{fontSize:10,color:"#22c55e",fontWeight:600}}>ACTIVE</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </PremiumFeature>
    </div>
  );
}
