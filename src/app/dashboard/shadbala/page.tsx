"use client";
import { useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import "@/app/dashboard/shared.css";
import { calculateShadbala, getShadbalaRadar, type ShadbalaPlanet } from "@/lib/astro-engine/shadbala";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";

function RadarChart({ planet }: { planet: ShadbalaPlanet }) {
  const data = getShadbalaRadar(planet);
  const S = 180, cx = S/2, cy = S/2, R = 70;
  const N = data.length;
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (d.value / d.max) * R;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const gridPoints = (r: number) =>
    data.map((_, i) => {
      const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  const dataPath = points.map((p, i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{maxWidth:180,display:"block",margin:"0 auto"}}>
      {[0.25,0.5,0.75,1].map(r=>(
        <polygon key={r} points={gridPoints(R*r)} fill="none" stroke="#1c1840" strokeWidth="0.5"/>
      ))}
      {data.map((_,i)=>{
        const angle=(Math.PI*2*i)/N-Math.PI/2;
        return <line key={i} x1={cx} y1={cy} x2={cx+R*Math.cos(angle)} y2={cy+R*Math.sin(angle)} stroke="#1c1840" strokeWidth="0.5"/>;
      })}
      <polygon points={points.map(p=>`${p.x},${p.y}`).join(" ")} fill={`${planet.color}25`} stroke={planet.color} strokeWidth="1.5"/>
      <path d={dataPath} fill="none"/>
      {data.map((d,i)=>{
        const angle=(Math.PI*2*i)/N-Math.PI/2;
        const lx=cx+(R+14)*Math.cos(angle);
        const ly=cy+(R+14)*Math.sin(angle);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="7" fill="#605890" fontFamily="Outfit">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function ShadbalaPage() {
  const [expanded, setExpanded] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<"grid"|"table"|"summary">("grid");
  const { birth, chart } = useUserChart();
  const { t, tp, ts } = useLanguage();
  const result = calculateShadbala(chart.planets as never);

  const BALA_LABELS = [
    { key:"sthanaBala",  label:"Sthana", max:10 },
    { key:"digBala",     label:"Dig",    max:10 },
    { key:"kalaBala",    label:"Kala",   max:10 },
    { key:"cheshtaBala", label:"Cheshta",max:10 },
    { key:"naisargika",  label:"Naisarg",max:7  },
    { key:"drikBala",    label:"Drik",   max:8  },
  ];

  return (
    <>
      <style>{`
        .header-name{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#f0e8d0}
        .header-meta{font-size:13px;color:#605890;margin-top:4px}
        .header-stats{display:flex;gap:12px;flex-wrap:wrap}
        .planet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
        .planet-card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:20px;cursor:pointer;transition:all 0.25s}
        .planet-card:hover{transform:translateY(-2px);border-color:rgba(200,160,48,0.2)}
        .planet-card.expanded{border-color:rgba(200,160,48,0.35)}
        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .card-left{display:flex;align-items:center;gap:10px}
        .planet-icon{font-size:24px}
        .planet-name{font-size:15px;font-weight:600;color:#f0e8d0}
        .planet-pos{font-size:11px;color:#605890;margin-top:2px}
        .planet-pct{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;line-height:1}
        .planet-grade{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-top:2px;text-align:right}
        .bar-wrap{margin-bottom:14px}
        .bala-mini{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px}
        .bala-item{background:#0a0720;border:1px solid #1c1840;border-radius:8px;padding:8px;text-align:center}
        .bala-val{font-size:16px;font-weight:600;font-family:'Cormorant Garamond',serif;line-height:1;margin-bottom:2px}
        .bala-lbl{font-size:9px;color:#605890;letter-spacing:0.5px}
        .bala-max{font-size:8px;color:#3a3060}
        .radar-wrap{margin-bottom:14px}
        .expanded-content{border-top:1px solid #1c1840;margin-top:14px;padding-top:14px}
        .bala-detail{margin-bottom:12px;padding:12px;background:#0a0720;border:1px solid #1c1840;border-radius:10px}
        .bala-detail-title{font-size:11px;font-weight:600;color:#c8a030;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
        .bala-detail-txt{font-size:12px;color:#c8c0a8;line-height:1.7}
        .bala-def{font-size:11px;color:#3a3060;line-height:1.6;margin-top:6px;padding-top:6px;border-top:1px solid #1c1840}
        .sb-table{width:100%;border-collapse:collapse}
        .sb-table th{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#3a3060;padding:0 12px 14px;text-align:center;font-weight:400}
        .sb-table th:first-child{text-align:left}
        .sb-table td{padding:12px;border-bottom:1px solid #1c1840;font-size:13px;text-align:center;vertical-align:middle}
        .sb-table tr:last-child td{border-bottom:none}
        .sb-table td:first-child{text-align:left}
        .bala-explain{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:24px;margin-bottom:16px}
        .bala-explain-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0;margin-bottom:12px}
        .bala-explain-text{font-size:13px;color:#c8c0a8;line-height:1.85}
        @media(max-width:768px){.planet-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="page-tag">{t("shadbala.page_tag")}</div>
        <h1 className="page-title serif">{t("shadbala.page_title")}</h1>
        <p className="page-sub">6-factor Shadbala system · Sthana · Dig · Kala · Cheshta · Naisargika · Drik</p>
        <PremiumFeature feature="Shadbala Analysis">

        {/* HEADER CARD */}
        <div className="header-card">
          <div className="header-orb"/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#605890",marginBottom:6}}>✦ Shadbala Analysis</div>
            <div className="header-name serif">{birth.name}</div>
            <div className="header-meta">
              {new Date(birth.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} · {birth.tob} · {birth.city}
            </div>
          </div>
          <div className="header-stats" style={{position:"relative",zIndex:1}}>
            <div className="hstat">
              <div className="hstat-n">{result.avgStrength}%</div>
              <div className="hstat-l">AVG STRENGTH</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{color:"#1d9e75",fontSize:20}}>{result.strongest}</div>
              <div className="hstat-l">STRONGEST</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{color:"#ef4444",fontSize:20}}>{result.weakest}</div>
              <div className="hstat-l">WEAKEST</div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="summary-strip">✦ {result.summary}</div>

        {/* TABS */}
        <div className="tabs">
          {([["grid","Planet Cards"],["table","Comparison Table"],["summary","Bala Guide"]] as const).map(([t,l])=>(
            <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>{l}</button>
          ))}
        </div>

        {/* ── GRID TAB ── */}
        {activeTab==="grid" && (
          <div className="planet-grid">
            {result.planets.map(p=>(
              <div key={p.planet}
                className={`planet-card ${expanded===p.planet?"expanded":""}`}
                onClick={()=>setExpanded(expanded===p.planet?null:p.planet)}>

                {/* TOP */}
                <div className="card-top">
                  <div className="card-left">
                    <span className="planet-icon" style={{color:p.color}}>{p.icon}</span>
                    <div>
                      <div className="planet-name">{tp(p.planet)}</div>
                      <div className="planet-pos">{ts(p.sign)} · House {p.house}{p.retrograde?" · (R) Vakri":""}</div>
                    </div>
                  </div>
                  <div>
                    <div className="planet-pct" style={{color:p.gradeColor}}>{p.percentage}%</div>
                    <div className="planet-grade" style={{color:p.gradeColor}}>{p.grade}</div>
                  </div>
                </div>

                {/* STRENGTH BAR */}
                <div className="bar-wrap">
                  <div className="bar-track">
                    <div className="bar-fill" style={{width:`${p.percentage}%`,background:p.gradeColor}}/>
                  </div>
                </div>

                {/* BALA MINI GRID */}
                <div className="bala-mini">
                  {[
                    {lbl:"Sthana", val:p.sthanaBala,  max:10},
                    {lbl:"Dig",    val:p.digBala,      max:10},
                    {lbl:"Kala",   val:p.kalaBala,     max:10},
                    {lbl:"Cheshta",val:p.cheshtaBala,  max:10},
                    {lbl:"Naisarg",val:p.naisargika,   max:7 },
                    {lbl:"Drik",   val:p.drikBala,     max:8 },
                  ].map(b=>{
                    const pct = b.val/b.max;
                    const c = pct>=0.7?"#c8a030":pct>=0.5?"#1d9e75":pct>=0.35?"#60a5fa":"#ef4444";
                    return (
                      <div key={b.lbl} className="bala-item">
                        <div className="bala-val" style={{color:c}}>{b.val}</div>
                        <div className="bala-lbl">{b.lbl}</div>
                        <div className="bala-max">/{b.max}</div>
                      </div>
                    );
                  })}
                </div>

                {/* OVERALL TEXT */}
                <div style={{fontSize:12,color:"#605890",lineHeight:1.7}}>{p.overallTxt}</div>

                {/* EXPANDED */}
                {expanded===p.planet && (
                  <div className="expanded-content">
                    {/* Radar */}
                    <div className="radar-wrap">
                      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#605890",marginBottom:8,textAlign:"center"}}>Strength Radar</div>
                      <RadarChart planet={p}/>
                    </div>

                    {/* Detailed explanations */}
                    {[
                      {title:"Sthana Bala",  val:`${p.sthanaBala}/10`, txt:p.sthanaTxt,  def:p.sthanaDef},
                      {title:"Dig Bala",     val:`${p.digBala}/10`,    txt:p.digTxt,     def:p.digDef},
                      {title:"Kala Bala",    val:`${p.kalaBala}/10`,   txt:p.kalaTxt,    def:p.kalaDef},
                      {title:"Cheshta Bala", val:`${p.cheshtaBala}/10`,txt:p.cheshtaTxt, def:p.cheshtaDef},
                      {title:"Naisargika",   val:`${p.naisargika}/7`,  txt:`${p.planet} ki prakriti se milne wali fixed strength ${p.naisargika}/7 hai.`, def:p.naisargikaDef},
                      {title:"Drik Bala",    val:`${p.drikBala}/8`,    txt:p.drikTxt,    def:p.drikDef},
                    ].map(b=>(
                      <div key={b.title} className="bala-detail">
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div className="bala-detail-title">{b.title}</div>
                          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:"#c8a030"}}>{b.val}</div>
                        </div>
                        <div className="bala-detail-txt">{b.txt}</div>
                        <div className="bala-def">{b.def}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TABLE TAB ── */}
        {activeTab==="table" && (
          <div style={{background:"#0d0a22",border:"1px solid #1c1840",borderRadius:16,padding:24,overflowX:"auto"}}>
            <div style={{fontSize:9,letterSpacing:"2px",textTransform:"uppercase",color:"#605890",marginBottom:16}}>✦ Shadbala Comparison — All 7 Planets</div>
            <table className="sb-table">
              <thead>
                <tr>
                  <th style={{textAlign:"left"}}>Planet</th>
                  {BALA_LABELS.map(b=><th key={b.key}>{b.label}<br/><span style={{fontSize:8}}>/{b.max}</span></th>)}
                  <th>Total</th>
                  <th>Strength</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.planets.map(p=>(
                  <tr key={p.planet}>
                    <td>
                      <span style={{color:p.color,fontSize:18,marginRight:8}}>{p.icon}</span>
                      <span style={{fontWeight:500,color:"#c8c0a8"}}>{p.planet}</span>
                      {p.retrograde&&<span style={{fontSize:9,color:"#f97316",marginLeft:4,fontWeight:600}}>(R)</span>}
                    </td>
                    {[p.sthanaBala,p.digBala,p.kalaBala,p.cheshtaBala,p.naisargika,p.drikBala].map((v,i)=>{
                      const max=BALA_LABELS[i].max;
                      const pct=v/max;
                      const c=pct>=0.7?"#c8a030":pct>=0.5?"#1d9e75":pct>=0.35?"#60a5fa":"#ef4444";
                      return <td key={i} style={{color:c,fontWeight:600}}>{v}</td>;
                    })}
                    <td style={{color:"#f0e8d0",fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600}}>{p.total}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:60,height:4,background:"#1c1840",borderRadius:2,overflow:"hidden"}}>
                          <div style={{width:`${p.percentage}%`,height:"100%",background:p.gradeColor,borderRadius:2}}/>
                        </div>
                        <span style={{fontSize:12,color:p.gradeColor}}>{p.percentage}%</span>
                      </div>
                    </td>
                    <td><span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:`${p.gradeColor}18`,color:p.gradeColor,border:`1px solid ${p.gradeColor}33`}}>{p.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── SUMMARY TAB ── */}
        {activeTab==="summary" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[
              {title:"Sthana Bala — Positional Strength",icon:"🏠",desc:"Sthana Bala planet ki rashi position se milti hai. Uchcha (exaltation) mein ho to 10/10, sva rashi mein 7/10, neecha mein 1/10. Yeh sabse fundamental bala hai — baaki sab iske upar build hoti hain. Agar kisi planet ki Sthana Bala weak hai to uski dasha mein bhi results average hi rahenge."},
              {title:"Dig Bala — Directional Strength",icon:"🧭",desc:"Har planet ek specific direction (house) mein peak strength pe hota hai. Sun aur Mars 10th house mein, Moon aur Venus 4th house mein, Mercury aur Jupiter 1st house mein, Saturn 7th house mein sabse zyada powerful hote hain. Jitna us ghar ke paas planet ho, utni zyada Dig Bala milti hai."},
              {title:"Kala Bala — Temporal Strength",icon:"⏰",desc:"Samay ki takat. Din mein Sun, Jupiter, Venus strong hote hain — inka best time din hai. Raat mein Moon, Mars, Saturn apna maximum dete hain. Mercury dono mein moderate hai. Birth time ke hisaab se yeh bala calculate hoti hai aur batati hai ki planet kab zyada active hoga."},
              {title:"Cheshta Bala — Motional Strength",icon:"🌀",desc:"Planet ki motion se milti takat. Retrograde (vakri) planet ko classical texts mein maximum Cheshta Bala dete hain — 8/10 — kyunki yeh extra effort dikhata hai. Results intense aur lasting hote hain par delay ke saath aate hain. Combust planet (Sun ke bahut paas) ko minimum Cheshta Bala milti hai — 1/10."},
              {title:"Naisargika Bala — Natural Strength",icon:"✦",desc:"Yeh permanent hai aur kabhi nahi badlti. Jupiter sabse zyada naturally powerful (7), phir Venus (6), Sun (7), Moon (6), Saturn (4), Mars (5), Mercury (5). Yeh prakriti ki takat hai — koi bhi grah apni prakritik shakti se zyada nahi ja sakta. Weak planetary placements mein bhi yeh base strength hamesha rehti hai."},
              {title:"Drik Bala — Aspectual Strength",icon:"👁️",desc:"Doosre planets ke aspects se milne wali ya kho jaane wali takat. Jupiter aur Venus ka aspect milne se strength badhti hai — ye benefic planets apna positive energy share karte hain. Saturn, Mars, Rahu ka aspect strength ko kam karta hai. Ek achha aspected planet apni weakness ko kuch had tak overcome kar sakta hai."},
            ].map(b=>(
              <div key={b.title} className="bala-explain">
                <div className="bala-explain-title serif">{b.icon} {b.title}</div>
                <div className="bala-explain-text">{b.desc}</div>
              </div>
            ))}
          </div>
        )}
        </PremiumFeature>
      </div>
    </>
  );
}
