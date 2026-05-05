"use client";
import { useState } from "react";
import "@/app/dashboard/shared.css";
import { calculateDivisional, getNavamshaAnalysis, getDashamshaAnalysis, type DivChart } from "@/lib/astro-engine/divisional";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";

const SIGN_ICONS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const md = (x:number,m:number)=>((x%m)+m)%m;

// Mini North Indian Chart SVG
function MiniChart({ chart }: { chart: DivChart }) {
  const S=220, h=S/2;
  const CELLS = [
    {hn:1,cx:h,    cy:h-66},{hn:2,cx:h+66, cy:h-66},{hn:3,cx:h+99, cy:h},
    {hn:4,cx:h+66, cy:h+66},{hn:5,cx:h,    cy:h+66},{hn:6,cx:h-66, cy:h+66},
    {hn:7,cx:h-99, cy:h},   {hn:8,cx:h-66, cy:h-66},{hn:9,cx:h-66, cy:h-110},
    {hn:10,cx:h,   cy:h-110},{hn:11,cx:h+66,cy:h-110},{hn:12,cx:h+66,cy:h-15},
  ];
  const byHouse: Record<number,{icon:string;color:string;retro:boolean}[]> = {};
  for(let i=1;i<=12;i++) byHouse[i]=[];
  chart.planets.forEach(p => byHouse[p.house]?.push({icon:p.icon,color:p.color,retro:p.retrograde}));

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{maxWidth:220,display:"block",margin:"0 auto"}}>
      <rect width={S} height={S} fill="#08051a" rx="8"/>
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="#3a3260" strokeWidth="1" rx="8"/>
      <line x1={h} y1={0}   x2={S}   y2={h}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={S} y1={h}   x2={h}   y2={S}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={h} y1={S}   x2={0}   y2={h}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={0} y1={h}   x2={h}   y2={0}   stroke="#2a2250" strokeWidth="0.8"/>
      <line x1={0} y1={0}   x2={S}   y2={S}   stroke="#1c1840" strokeWidth="0.5"/>
      <line x1={S} y1={0}   x2={0}   y2={S}   stroke="#1c1840" strokeWidth="0.5"/>
      {CELLS.map(({hn,cx,cy})=>{
        const rIdx = md(chart.lagnaNum + hn - 1, 12);
        const isL  = hn===1;
        const here = byHouse[hn]||[];
        return (
          <g key={hn}>
            <text x={cx} y={cy-8} textAnchor="middle" fontSize="7" fill={isL?"#d4af37":"#3a3060"}>{rIdx+1}</text>
            <text x={cx} y={cy+2} textAnchor="middle" fontSize="9" fill={isL?"#d4af37":"#444060"}>{SIGN_ICONS[rIdx]}</text>
            {here.map((p,pi)=>(
              <text key={pi} x={cx+(here.length>1?(pi-(here.length-1)/2)*11:0)} y={cy+14+pi*10}
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
  const divs    = calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  const current = divs.find(d=>d.key===activeChart) || divs[0];

  const d9Insights = getNavamshaAnalysis(divs.find(d=>d.key==="D9")!);
  const d10Insights= getDashamshaAnalysis(divs.find(d=>d.key==="D10")!);

  const CHART_COLORS: Record<string,string> = {
    D1:"#c8a030",D3:"#22c55e",D7:"#ec4899",D9:"#a855f7",D10:"#f97316",D12:"#60a5fa",D27:"#2dd4bf"
  };

  return (
    <div className="page">
      <div className="page-tag">📐 Divisional Charts</div>
      <h1 className="page-title serif">Divisional <em>Chart Analysis</em></h1>
      <p className="page-sub">D-1 · D-3 · D-7 · D-9 Navamsha · D-10 Dashamsha · D-12 · D-27</p>
      <PremiumFeature feature="Divisional Charts">

      {/* HEADER */}
      <div className="header-card">
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#a855f7",marginBottom:6}}>📐 Divisional Charts</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:"#f0e8d0"}}>{birth.name}</div>
          <div style={{fontSize:13,color:"#605890",marginTop:4}}>
            D-1 Lagna: {chart.lagnaRashi} · D-9 Lagna: {divs.find(d=>d.key==="D9")?.lagna} · D-10 Lagna: {divs.find(d=>d.key==="D10")?.lagna}
          </div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative",zIndex:1}}>
          <div className="hstat"><div className="hstat-n" style={{fontSize:14}}>{divs.find(d=>d.key==="D9")?.lagna}</div><div className="hstat-l">D-9 LAGNA</div></div>
          <div className="hstat"><div className="hstat-n" style={{fontSize:14}}>{divs.find(d=>d.key==="D10")?.lagna}</div><div className="hstat-l">D-10 LAGNA</div></div>
          <div className="hstat"><div className="hstat-n">{divs.length}</div><div className="hstat-l">CHARTS</div></div>
        </div>
      </div>

      {/* CHART SELECTOR */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
        {divs.map(d=>(
          <button key={d.key}
            onClick={()=>setActiveChart(d.key)}
            style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${activeChart===d.key?CHART_COLORS[d.key]:"#1c1840"}`,
              background:activeChart===d.key?`${CHART_COLORS[d.key]}15`:"transparent",
              color:activeChart===d.key?CHART_COLORS[d.key]:"#605890",
              cursor:"pointer",fontFamily:"Outfit,sans-serif",fontSize:13,fontWeight:500,transition:"all 0.2s"}}>
            {d.key}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid-2" style={{marginBottom:24}}>
        {/* Chart */}
        <div className="card">
          <div className="card-tag">✦ {current.key} — {current.name}</div>
          <div className="card-title serif">{current.name}</div>
          <MiniChart chart={current}/>
          <div style={{marginTop:12,padding:"10px 14px",background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:10}}>
            <div style={{fontSize:10,color:"#a855f7",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Purpose</div>
            <div style={{fontSize:13,color:"#c8c0a8",lineHeight:1.7}}>{current.purpose}</div>
          </div>
        </div>

        {/* Planet positions */}
        <div className="card">
          <div className="card-tag">✦ Planet Positions in {current.key}</div>
          <div className="card-title serif">Lagna: {current.lagna}</div>
          {current.planets.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #1c1840"}}>
              <span style={{fontSize:16,color:p.color,width:22}}>{p.icon}</span>
              <span style={{flex:1,fontSize:12,color:"#c8c0a8"}}>{p.planet}</span>
              <span style={{fontSize:12,color:"#f0e8d0"}}>{p.sign}</span>
              <span style={{fontSize:11,color:"#605890",width:24,textAlign:"right"}}>H{p.house}</span>
              {p.dignity!=="—"&&(
                <span style={{fontSize:9,padding:"1px 6px",borderRadius:6,
                  color:p.dignity==="Exalted"?"#c8a030":p.dignity==="Own"?"#22c55e":"#ef4444",
                  background:p.dignity==="Exalted"?"rgba(200,160,48,0.08)":p.dignity==="Own"?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",
                  border:`1px solid ${p.dignity==="Exalted"?"rgba(200,160,48,0.2)":p.dignity==="Own"?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`}}>
                  {p.dignity}
                </span>
              )}
              {p.retrograde&&<span style={{fontSize:9,color:"#f97316"}}>℞</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="card" style={{marginBottom:24,borderColor:`${CHART_COLORS[current.key]}33`}}>
        <div className="card-tag">✦ {current.key} Key Insight</div>
        <div style={{fontSize:14,color:"#c8c0a8",lineHeight:1.85}}>{current.keyInsight}</div>
      </div>

      {/* D9 + D10 Special Insights */}
      <div className="grid-2">
        <div className="card" style={{borderColor:"rgba(168,85,247,0.2)"}}>
          <div className="card-tag">✦ D-9 Navamsha Insights</div>
          <div className="card-title serif">Marriage & Soul Path</div>
          {d9Insights.map((ins,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #1c1840",fontSize:13,color:"#c8c0a8",lineHeight:1.7}}>
              ✦ {ins}
            </div>
          ))}
        </div>
        <div className="card" style={{borderColor:"rgba(249,115,22,0.2)"}}>
          <div className="card-tag">✦ D-10 Dashamsha Insights</div>
          <div className="card-title serif">Career & Profession</div>
          {d10Insights.map((ins,i)=>(
            <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #1c1840",fontSize:13,color:"#c8c0a8",lineHeight:1.7}}>
              ✦ {ins}
            </div>
          ))}
        </div>
      </div>
      </PremiumFeature>
    </div>
  );
}
