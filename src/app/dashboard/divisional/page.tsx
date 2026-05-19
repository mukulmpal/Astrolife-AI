"use client";
import { useState } from "react";
import "@/app/dashboard/shared.css";
import {
  calculateDivisional,
  getChartAnalysis,
  getSpecialFindings,
  type DivChart,
} from "@/lib/astro-engine/divisional";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
const SIGN_ICONS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const md = (x:number,m:number)=>((x%m)+m)%m;

const CHART_COLORS: Record<string,string> = {
  D1:"#c8a030",D3:"#22c55e",D7:"#ec4899",D9:"#a855f7",D10:"#f97316",D12:"#60a5fa",D27:"#2dd4bf"
};
const CHART_META: Record<string,{icon:string;domain:string}> = {
  D1: {icon:"🔯", domain:"Overall Life"},
  D2: {icon:"💰", domain:"Wealth & Income"},
  D3: {icon:"⚡", domain:"Siblings & Courage"},
  D4: {icon:"🏠", domain:"Property & Home"},
  D5: {icon:"🙏", domain:"Past Merit"},
  D6: {icon:"🛡️", domain:"Health & Enemies"},
  D7: {icon:"👶", domain:"Children"},
  D8: {icon:"⚡", domain:"Sudden Events"},
  D9: {icon:"💍", domain:"Marriage & Soul"},
  D10:{icon:"💼", domain:"Career & Status"},
  D11:{icon:"🎯", domain:"Gains & Income"},
  D12:{icon:"👨‍👩‍👧", domain:"Parents & Ancestors"},
  D16:{icon:"🚗", domain:"Vehicles & Comfort"},
  D20:{icon:"🕉️", domain:"Spiritual Path"},
  D24:{icon:"📚", domain:"Education"},
  D27:{icon:"🌟", domain:"Soul Strengths"},
  D30:{icon:"⚠️", domain:"Obstacles & Karma"},
  D40:{icon:"☯️", domain:"General Karma"},
  D45:{icon:"🎭", domain:"Character & Values"},
  D60:{icon:"🌀", domain:"Past Life Karma"},
};

function MiniChart({ chart }: { chart: DivChart }) {
  const S=220;
  const CELLS = [
    {hn:1, cx:S/2,   cy:S/4},
    {hn:2, cx:S/4,   cy:S/8},
    {hn:3, cx:S/8,   cy:S/4},
    {hn:4, cx:S/4,   cy:S/2},
    {hn:5, cx:S/8,   cy:3*S/4},
    {hn:6, cx:S/4,   cy:7*S/8},
    {hn:7, cx:S/2,   cy:3*S/4},
    {hn:8, cx:3*S/4, cy:7*S/8},
    {hn:9, cx:7*S/8, cy:3*S/4},
    {hn:10,cx:3*S/4, cy:S/2},
    {hn:11,cx:7*S/8, cy:S/4},
    {hn:12,cx:3*S/4, cy:S/8},
  ];
  const byHouse: Record<number,{icon:string;color:string;retro:boolean}[]> = {};
  for(let i=1;i<=12;i++) byHouse[i]=[];
  chart.planets.forEach(p => byHouse[p.house]?.push({icon:p.icon,color:p.color,retro:p.retrograde}));

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{maxWidth:220,display:"block",margin:"0 auto"}}>
      <rect width={S} height={S} fill="#08051a" rx="8"/>
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="#3a3260" strokeWidth="1" rx="8"/>
      <line x1={S/2} y1={0}   x2={S}   y2={S/2}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={S} y1={S/2}   x2={S/2}   y2={S}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={S/2} y1={S}   x2={0}   y2={S/2}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={0} y1={S/2}   x2={S/2}   y2={0}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={0} y1={0}   x2={S}   y2={S}   stroke="#1c1840" strokeWidth="0.5"/>
      <line x1={S} y1={0}   x2={0}   y2={S}   stroke="#1c1840" strokeWidth="0.5"/>
      {CELLS.map(({hn,cx,cy})=>{
        const rIdx = md(chart.lagnaNum + hn - 1, 12);
        const isL  = hn===1;
        const here = byHouse[hn]||[];
        return (
          <g key={hn}>
            <text x={cx} y={cy-8}  textAnchor="middle" fontSize="7" fill={isL?"#d4af37":"#3a3060"}>{rIdx+1}</text>
            <text x={cx} y={cy+2}  textAnchor="middle" fontSize="9" fill={isL?"#d4af37":"#444060"}>{SIGN_ICONS[rIdx]}</text>
            {here.map((p,pi)=>(
              <text key={pi} x={cx+(here.length>1?(pi-(here.length-1)/2)*11:0)} y={cy+(isL?17:14)}
                textAnchor="middle" fontSize="10" fill={p.color}>{p.icon}{p.retro?"ℛ":""}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function DivisionalPage() {
  const [activeChart, setActiveChart] = useState("D9");
  const { birth, chart } = useUserChart();
  const { t } = useLanguage();

  const divs     = calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  const current  = divs.find(d=>d.key===activeChart) || divs[0];
  const analysis = getChartAnalysis(current);
  const findings = getSpecialFindings(divs);
  const color    = CHART_COLORS[current.key] ?? "#a855f7";
  const meta     = CHART_META[current.key];

  return (
    <div className="page">
      <style>{`
        .dv-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
        .dv-tab{padding:8px 16px;border-radius:10px;border:1px solid #1c1840;background:transparent;color:#605890;cursor:pointer;font-size:14px;font-weight:500;transition:all 0.2s;text-align:center}
        .dv-tab.active{border-color:var(--tc);background:color-mix(in srgb,var(--tc) 15%,transparent);color:var(--tc)}
        .dv-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
        @media(max-width:640px){.dv-grid{grid-template-columns:1fr}}
        .dv-card{background:#0d0a22;border:1px solid #1f1a42;border-radius:16px;padding:18px}
        .dv-card-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:10px}
        .dv-planet-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #1a1740}
        .dv-badge{font-size:9px;padding:2px 7px;border-radius:6px;border:1px solid}
        .dv-insight{padding:8px 0;border-bottom:1px solid #1a1740;font-size:14px;color:#c8c0a8;line-height:1.75;display:flex;gap:8px}
        .dv-finding{border-radius:12px;padding:14px;margin-bottom:10px;border:1px solid}
        .dv-stat-row{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1}
        .dv-stat{text-align:center;background:rgba(0,0,0,0.2);border-radius:12px;padding:12px 16px;border:1px solid rgba(168,85,247,0.15);min-width:90px}
        .dv-stat-n{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#a855f7;line-height:1}
        .dv-stat-l{font-size:10px;color:#605890;margin-top:4px;letter-spacing:0.5px}
      `}</style>

      {/* Header */}
      <div className="page-tag">{t("divisional.page_tag")}</div>
      <h1 className="page-title serif">{t("divisional.page_title")}</h1>
      <p className="page-sub">{birth?.name} · D-1 to D-27 · Varga Analysis</p>
      <div className="header-card" style={{marginBottom:24}}>
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#a855f7",marginBottom:6}}>📐 Chart Analysis</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:600,color:"#f0e8d0"}}>{birth?.name}</div>
        </div>
        <div className="dv-stat-row">
          <div className="dv-stat">
            <div className="dv-stat-n" style={{fontSize:16}}>{divs.find(d=>d.key==="D9")?.lagna}</div>
            <div className="dv-stat-l">D-9 LAGNA</div>
          </div>
          <div className="dv-stat">
            <div className="dv-stat-n" style={{fontSize:16}}>{divs.find(d=>d.key==="D10")?.lagna}</div>
            <div className="dv-stat-l">D-10 LAGNA</div>
          </div>
          <div className="dv-stat">
            <div className="dv-stat-n" style={{color:"#22c55e"}}>{findings.filter(f=>f.type==="positive").length}</div>
            <div className="dv-stat-l">POSITIVE</div>
          </div>
          <div className="dv-stat">
            <div className="dv-stat-n" style={{color:"#ef4444"}}>{findings.filter(f=>f.type==="caution").length}</div>
            <div className="dv-stat-l">CAUTIONS</div>
          </div>
        </div>
      </div>

      <PremiumFeature feature="Divisional Charts">

      {/* Chart Selector */}
      <div className="dv-tabs">
        {divs.map(d=>{
          const c = CHART_COLORS[d.key]??"#a855f7";
          const m = CHART_META[d.key];
          return (
            <button key={d.key}
              className={`dv-tab${activeChart===d.key?" active":""}`}
              style={{"--tc":c} as React.CSSProperties}
              onClick={()=>setActiveChart(d.key)}>
              <span>{m?.icon} {d.key}</span>
              <div style={{fontSize:10,opacity:0.7,marginTop:2}}>{m?.domain}</div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Chart + Planets */}
      <div className="dv-grid" style={{marginBottom:16}}>

        {/* Mini Chart */}
        <div className="dv-card" style={{borderColor:color+"33"}}>
          <div className="dv-card-title">{meta?.icon} {current.key} — {current.name}</div>
          <MiniChart chart={current}/>
          <div style={{marginTop:12,padding:"8px 12px",background:color+"0d",border:`1px solid ${color}22`,borderRadius:8}}>
            <div style={{fontSize:10,color:color,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:3}}>Purpose</div>
            <div style={{fontSize:12,color:"#b0a8c8",lineHeight:1.7}}>{current.purpose}</div>
          </div>
          <div style={{marginTop:8,padding:"8px 12px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid #1f1a42"}}>
            <div style={{fontSize:10,color:"#605890",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:3}}>{current.key} Lagna</div>
            <div style={{fontSize:15,color:"#f0e8d0",fontWeight:600}}>{current.lagna}</div>
          </div>
        </div>

        {/* Planet Positions */}
        <div className="dv-card">
          <div className="dv-card-title">Planet Positions in {current.key}</div>
          {current.planets.map((p,i)=>(
            <div key={i} className="dv-planet-row">
              <span style={{fontSize:15,color:p.color,width:20}}>{p.icon}</span>
              <span style={{flex:1,fontSize:12,color:"#c8c0a8"}}>{p.planet}</span>
              <span style={{fontSize:12,color:"#f0e8d0"}}>{p.sign}</span>
              <span style={{fontSize:11,color:"#605890",width:26,textAlign:"right"}}>H{p.house}</span>
              {p.dignity!=="—"&&(
                <span className="dv-badge" style={{
                  color:p.dignity==="Exalted"?"#c8a030":p.dignity==="Own"?"#22c55e":"#ef4444",
                  background:p.dignity==="Exalted"?"rgba(200,160,48,0.08)":p.dignity==="Own"?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",
                  borderColor:p.dignity==="Exalted"?"rgba(200,160,48,0.25)":p.dignity==="Own"?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)"}}>
                  {p.dignity}
                </span>
              )}
              {p.retrograde&&<span style={{fontSize:9,color:"#f97316",fontWeight:600}}>(R)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Interpretation for selected chart */}
      <div className="dv-card" style={{marginBottom:16,borderColor:color+"44"}}>
        <div className="dv-card-title" style={{color}}>{meta?.icon} {current.key} — {meta?.domain} Interpretation</div>
        {analysis.map((ins,i)=>(
          <div key={i} className="dv-insight">
            <span style={{color,marginTop:3,flexShrink:0}}>✦</span>
            <span>{ins}</span>
          </div>
        ))}
      </div>

      {/* Special Findings — cross-chart patterns */}
      <div className="dv-card" style={{marginBottom:16}}>
        <div className="dv-card-title">⚡ Special Findings — Cross-Chart Patterns</div>
        {findings.map((f,i)=>(
          <div key={i} className="dv-finding" style={{
            background:f.type==="positive"?"rgba(34,197,94,0.06)":f.type==="caution"?"rgba(239,68,68,0.06)":"rgba(148,163,184,0.05)",
            borderColor:f.type==="positive"?"rgba(34,197,94,0.25)":f.type==="caution"?"rgba(239,68,68,0.25)":"rgba(148,163,184,0.15)",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:16}}>{f.type==="positive"?"✅":f.type==="caution"?"⚠️":"◆"}</span>
              <span style={{fontWeight:600,fontSize:14,color:"#f0e8d0"}}>{f.title}</span>
              <span style={{marginLeft:"auto",display:"flex",gap:4}}>
                {f.charts.map(c=>(
                  <span key={c} style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:CHART_COLORS[c]+"22",color:CHART_COLORS[c],border:`1px solid ${CHART_COLORS[c]}44`}}>{c}</span>
                ))}
              </span>
            </div>
            <div style={{fontSize:13,color:"#c8c0a8",lineHeight:1.75}}>{f.detail}</div>
          </div>
        ))}
      </div>

      {/* All Charts Quick Summary */}
      <div className="dv-card">
        <div className="dv-card-title">📊 All Charts — Key Insights at a Glance</div>
        {divs.map(d=>{
          const c = CHART_COLORS[d.key]??"#a855f7";
          const m = CHART_META[d.key];
          const strong = d.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
          const deb    = d.planets.filter(p=>p.dignity==="Debilitated");
          return (
            <div key={d.key} style={{padding:"10px 0",borderBottom:"1px solid #1a1740",display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}
              onClick={()=>setActiveChart(d.key)}>
              <span style={{fontSize:18,width:26,flexShrink:0}}>{m?.icon}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{fontWeight:600,fontSize:13,color:c}}>{d.key}</span>
                  <span style={{fontSize:11,color:"#605890"}}>{d.name}</span>
                  <span style={{fontSize:11,color:"#605890",marginLeft:"auto"}}>Lagna: {d.lagna}</span>
                </div>
                <div style={{fontSize:11,color:"#8b80bf"}}>
                  {strong.length>0&&<span style={{color:"#22c55e",marginRight:8}}>✓ {strong.map(p=>p.planet).join(", ")} strong</span>}
                  {deb.length>0&&<span style={{color:"#ef4444"}}>⚠ {deb.map(p=>p.planet).join(", ")} weak</span>}
                  {strong.length===0&&deb.length===0&&<span>Balanced positions</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      </PremiumFeature>
    </div>
  );
}
