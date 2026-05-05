"use client";
import { useState } from "react";
import "@/app/dashboard/shared.css";
import { calculateChart } from "@/lib/astro-engine/calculations";
import { calculatePsychology } from "@/lib/astro-engine/psychology";

const DEMO = { name:"Mukul Pal", dob:"1995-07-04", tob:"12:30", city:"Delhi" };

// Radar SVG
function PsychRadar({ vals, colors }: { vals: number[]; colors: string[] }) {
  const S=200,cx=100,cy=100,R=75,n=vals.length;
  const labels=["Anxiety","Karma","Bias","Logic","Wisdom","Love"];
  const pts = vals.map((v,i)=>({
    x: cx + (v/100)*R * Math.cos(i/n*2*Math.PI - Math.PI/2),
    y: cy + (v/100)*R * Math.sin(i/n*2*Math.PI - Math.PI/2),
  }));
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{maxWidth:200,display:"block",margin:"0 auto"}}>
      <rect width={S} height={S} fill="#08051a" rx="8"/>
      {[.25,.5,.75,1].map(f=>(
        <polygon key={f} fill="none" stroke="#1c1840" strokeWidth="0.5"
          points={Array.from({length:n},(_,i)=>`${cx+R*f*Math.cos(i/n*2*Math.PI-Math.PI/2)},${cy+R*f*Math.sin(i/n*2*Math.PI-Math.PI/2)}`).join(" ")}/>
      ))}
      {Array.from({length:n},(_,i)=>(
        <line key={i} x1={cx} y1={cy}
          x2={cx+R*Math.cos(i/n*2*Math.PI-Math.PI/2)}
          y2={cy+R*Math.sin(i/n*2*Math.PI-Math.PI/2)}
          stroke="#1c1840" strokeWidth="0.5"/>
      ))}
      <polygon fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="1.5"
        points={pts.map(p=>`${p.x},${p.y}`).join(" ")}/>
      {Array.from({length:n},(_,i)=>{
        const a=i/n*2*Math.PI-Math.PI/2;
        return <text key={i} x={cx+(R+16)*Math.cos(a)} y={cy+(R+16)*Math.sin(a)}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="7" fill={colors[i]} fontFamily="Outfit">{labels[i]}</text>;
      })}
    </svg>
  );
}

export default function PsychPage() {
  const [activeTab, setActiveTab] = useState<"planets"|"pattern"|"guide">("pattern");
  const [expanded, setExpanded] = useState<string|null>(null);

  const chart  = calculateChart(DEMO.name, DEMO.dob, DEMO.tob, DEMO.city);
  const result = calculatePsychology(chart.planets as never);
  const P = result.pattern;

  const radarColors = ["#ef4444","#a78bfa","#f59e0b","#22c55e","#f59e0b","#ec4899"];

  const idxCards = [
    {n:P.anxietyIdx, l:"Anxiety Index",   c:"#ef4444", bg:"rgba(239,68,68,0.07)"},
    {n:P.karmaLoop,  l:"Karma Loop",      c:"#a78bfa", bg:"rgba(167,139,250,0.07)"},
    {n:P.behavBias,  l:"Behavioral Bias", c:"#f59e0b", bg:"rgba(245,158,11,0.07)"},
  ];

  const strongCount = result.planets.filter(p=>p.status==="Strong").length;
  const weakCount   = result.planets.filter(p=>p.status==="Weak/Blocked").length;

  return (
    <div className="page">
      <div className="page-tag">🧠 Psychology Engine</div>
      <h1 className="page-title serif">Psychological <em>Blueprint</em></h1>
      <p className="page-sub">9 psychological functions · Pattern analysis · Anxiety Index · Karma Loop · Shadow work</p>

      {/* HEADER */}
      <div className="header-card">
        <div className="header-orb"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#ec4899",marginBottom:6}}>🧠 Psychology Analysis</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:"#f0e8d0"}}>{DEMO.name}</div>
          <div style={{fontSize:13,color:"#605890",marginTop:4}}>
            {new Date(DEMO.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} · {DEMO.tob} · {DEMO.city}
          </div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative",zIndex:1}}>
          <div className="hstat"><div className="hstat-n" style={{color:"#22c55e"}}>{strongCount}</div><div className="hstat-l">STRONG</div></div>
          <div className="hstat"><div className="hstat-n" style={{color:"#ef4444"}}>{weakCount}</div><div className="hstat-l">BLOCKED</div></div>
          <div className="hstat"><div className="hstat-n" style={{color:"#ec4899",fontSize:18}}>{P.name.split(" ")[0]}</div><div className="hstat-l">PATTERN</div></div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary-strip">🧠 {result.summary}</div>

      {/* TABS */}
      <div className="tabs">
        {[["pattern","Pattern Analysis"],["planets","9 Functions"],["guide","Shadow Work"]].map(([t,l])=>(
          <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t as never)}>{l}</button>
        ))}
      </div>

      {/* ── PATTERN TAB ── */}
      {activeTab==="pattern" && (
        <div>
          {/* Pattern Card */}
          <div className="card" style={{marginBottom:16,borderColor:"rgba(236,72,153,0.25)"}}>
            <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
              <PsychRadar vals={P.radarVals} colors={radarColors}/>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#ec4899",marginBottom:8}}>Dominant Pattern</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:600,color:"#f0e8d0",marginBottom:10}}>{P.name}</div>
                <div style={{fontSize:13,color:"#c8c0a8",lineHeight:1.85,marginBottom:14}}>{P.desc}</div>
                <div style={{padding:"10px 14px",background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:10}}>
                  <div style={{fontSize:10,color:"#a78bfa",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Shadow Work</div>
                  <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.7}}>{P.shadow}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Index Cards */}
          <div className="grid-3" style={{marginBottom:16}}>
            {idxCards.map(c=>(
              <div key={c.l} className="idx-card" style={{background:c.bg,borderColor:`${c.c}33`}}>
                <div className="idx-n" style={{color:c.c}}>{c.n}</div>
                <div className="idx-l">{c.l}</div>
                <div className="bar-track" style={{marginTop:8}}>
                  <div className="bar-fill" style={{width:`${c.n}%`,background:c.c}}/>
                </div>
              </div>
            ))}
          </div>

          {/* Planet strength overview */}
          <div className="card">
            <div className="card-tag">✦ Psychological Strength Overview</div>
            <div className="card-title serif">All 9 Functions</div>
            {result.planets.map(p=>(
              <div key={p.planet} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1c1840"}}>
                <span style={{fontSize:18,width:24,color:p.color}}>{p.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500,color:"#c8c0a8"}}>{p.planet} — {p.func}</div>
                  <div style={{fontSize:10,color:"#605890"}}>{p.trait}</div>
                </div>
                <div style={{width:80}}>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width:`${p.strength}%`,background:p.statusColor}}/>
                  </div>
                </div>
                <span className={`badge ${p.status==="Strong"?"badge-green":p.status==="Weak/Blocked"?"badge-red":"badge-gold"}`} style={{fontSize:9,whiteSpace:"nowrap"}}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PLANETS TAB ── */}
      {activeTab==="planets" && (
        <div className="grid-auto">
          {result.planets.map(p=>(
            <div key={p.planet} className="card"
              style={{cursor:"pointer",borderColor:expanded===p.planet?"rgba(236,72,153,0.35)":"#1c1840"}}
              onClick={()=>setExpanded(expanded===p.planet?null:p.planet)}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22,color:p.color}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#f0e8d0"}}>{p.planet}</div>
                    <div style={{fontSize:10,color:"#ec4899",marginTop:2}}>{p.func}</div>
                  </div>
                </div>
                <span className={`badge ${p.status==="Strong"?"badge-green":p.status==="Weak/Blocked"?"badge-red":"badge-gold"}`}>
                  {p.strength}% · {p.status}
                </span>
              </div>
              <div className="bar-track" style={{marginBottom:10}}>
                <div className="bar-fill" style={{width:`${p.strength}%`,background:p.statusColor}}/>
              </div>
              <div style={{fontSize:11,color:"#605890",marginBottom:8}}>{p.trait} · H{p.house} {p.sign}{p.retrograde?" · ℞":""}</div>
              <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.7}}>
                {p.status==="Strong"?p.strong:p.status==="Weak/Blocked"?p.weak:p.cog}
              </div>
              {expanded===p.planet && (
                <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #1c1840"}}>
                  <div style={{fontSize:11,color:"#22c55e",marginBottom:6}}>✦ Strength: {p.strong}</div>
                  <div style={{fontSize:11,color:"#ef4444",marginBottom:6}}>⚠️ Shadow: {p.weak}</div>
                  <div style={{fontSize:11,color:"#605890"}}>🧠 Function: {p.cog}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── GUIDE TAB ── */}
      {activeTab==="guide" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {icon:"☉",planet:"Sun",title:"Ego & Identity Shadow",desc:"Weak Sun = authority issues, approval seeking, unresolved father karma. Work: Daily affirmations, boundary setting, leadership practice.",c:"#f97316"},
            {icon:"☽",planet:"Moon",title:"Emotional Memory Healing",desc:"Weak Moon = anxiety, mother wound, emotional reactivity. Work: Therapy, journaling, Moon mantra, mother relationship repair.",c:"#c084fc"},
            {icon:"♂",planet:"Mars",title:"Anger & Impulse Work",desc:"Weak Mars = aggression or passivity. Work: Physical exercise, martial arts, breathwork for anger, assertiveness training.",c:"#ef4444"},
            {icon:"☿",planet:"Mercury",title:"Cognitive Pattern Work",desc:"Weak Mercury = overthinking, communication blocks. Work: Meditation for mental stillness, writing practice, breathwork.",c:"#22c55e"},
            {icon:"♃",planet:"Jupiter",title:"Belief System Expansion",desc:"Weak Jupiter = pessimism, lack of faith. Work: Study wisdom texts, find a mentor, practice gratitude, expand worldview.",c:"#f59e0b"},
            {icon:"♀",planet:"Venus",title:"Pleasure & Bonding Work",desc:"Weak Venus = relationship patterns, self-worth issues. Work: Self-love practice, creative expression, healthy pleasure.",c:"#ec4899"},
            {icon:"♄",planet:"Saturn",title:"Fear & Limitation Release",desc:"Weak Saturn = depression, fear loops, self-sabotage. Work: Discipline practice, therapy, Saturn mantra, structured routines.",c:"#60a5fa"},
            {icon:"☊",planet:"Rahu",title:"Obsession & Craving Work",desc:"Strong Rahu = addiction risk, obsessive patterns. Work: Mindfulness, detachment practices, Rahu mantra, simplify desires.",c:"#a78bfa"},
            {icon:"☋",planet:"Ketu",title:"Detachment & Grounding",desc:"Strong Ketu = dissociation, apathy. Work: Grounding practices, physical activity, Ketu mantra, find earthly purpose.",c:"#fb7185"},
          ].map(g=>{
            const planet = result.planets.find(p=>p.planet===g.planet);
            return (
              <div key={g.planet} className="card" style={{borderColor:`${g.c}22`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:20,color:g.c}}>{g.icon}</span>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:"#f0e8d0"}}>{g.title}</div>
                  {planet && (
                    <span className={`badge ${planet.status==="Strong"?"badge-green":planet.status==="Weak/Blocked"?"badge-red":"badge-gold"}`} style={{marginLeft:"auto"}}>
                      {planet.strength}%
                    </span>
                  )}
                </div>
                <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.75}}>{g.desc}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}