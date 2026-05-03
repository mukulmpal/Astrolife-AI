"use client";
import { useState } from "react";
import { calculateChart, RASHIS, type ChartData } from "@/lib/astro-engine/calculations";

const CITIES = [
  "Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad",
  "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Bhopal",
  "Indore","Nagpur","Surat","Varanasi","Amritsar","Dehradun",
  "Kochi","Patna","Agra","Mysuru","Coimbatore","Visakhapatnam","New Delhi",
];

// Planet symbols & colors — exact from original engine
const PLS   = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const PEMO  = ['☉','☽','♂','☿','♃','♀','♄','☊','☋'];
const PCOL  = ['#f97316','#c084fc','#ef4444','#22c55e','#f59e0b','#ec4899','#60a5fa','#a78bfa','#fb7185'];

// md helper
const md = (x: number, m: number) => ((x % m) + m) % m;
const dR = (d: number) => Math.floor(md(d, 360) / 30);

// ── NORTH INDIAN CHART — exact layout from original engine ────
function NorthIndianChart({ chart }: { chart: ChartData }) {
  const S   = 310;
  const h   = S / 2;
  const lagR = chart.lagnaNum;

  // Exact house centroids from original engine
  const HOUSES = [
    { h:1,  lx:S/2,     ly:S/4     },
    { h:2,  lx:S/4,     ly:S/8     },
    { h:3,  lx:S/8,     ly:S/4     },
    { h:4,  lx:S/4,     ly:S/2     },
    { h:5,  lx:S/8,     ly:3*S/4   },
    { h:6,  lx:S/4,     ly:7*S/8   },
    { h:7,  lx:S/2,     ly:3*S/4   },
    { h:8,  lx:3*S/4,   ly:7*S/8   },
    { h:9,  lx:7*S/8,   ly:3*S/4   },
    { h:10, lx:3*S/4,   ly:S/2     },
    { h:11, lx:7*S/8,   ly:S/4     },
    { h:12, lx:3*S/4,   ly:S/8     },
  ];

  // Group planets by house
  const pByH: Record<number, {name:string; retro:boolean}[]> = {};
  for (let i = 1; i <= 12; i++) pByH[i] = [];
  PLS.forEach(p => {
    const pd = chart.planets[p];
    if (pd && pd.house >= 1 && pd.house <= 12) {
      pByH[pd.house].push({ name:p, retro:pd.retrograde });
    }
  });

  // Key points
  const TC:[number,number] = [S/2, 0];
  const MR:[number,number] = [S, S/2];
  const BC:[number,number] = [S/2, S];
  const ML:[number,number] = [0, S/2];
  const TL:[number,number] = [0, 0];
  const TR:[number,number] = [S, 0];
  const BL:[number,number] = [0, S];
  const BR:[number,number] = [S, S];

  const ls = { stroke:"#2a2250", strokeWidth:"1" };

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth:360, display:"block", margin:"0 auto" }}>
      {/* Background */}
      <rect width={S} height={S} fill="#08051a" rx="8"/>

      {/* Outer square */}
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="#3a3260" strokeWidth="1.5" rx="8"/>

      {/* Big X — corner to corner */}
      <line x1={TL[0]} y1={TL[1]} x2={BR[0]} y2={BR[1]} {...ls}/>
      <line x1={TR[0]} y1={TR[1]} x2={BL[0]} y2={BL[1]} {...ls}/>

      {/* Diamond — mid-points */}
      <line x1={TC[0]} y1={TC[1]} x2={MR[0]} y2={MR[1]} {...ls}/>
      <line x1={MR[0]} y1={MR[1]} x2={BC[0]} y2={BC[1]} {...ls}/>
      <line x1={BC[0]} y1={BC[1]} x2={ML[0]} y2={ML[1]} {...ls}/>
      <line x1={ML[0]} y1={ML[1]} x2={TC[0]} y2={TC[1]} {...ls}/>

      {/* Houses */}
      {HOUSES.map(({ h: houseNum, lx, ly }) => {
        const rashiIdx = md(lagR + houseNum - 1, 12);
        const isLagna  = houseNum === 1;
        const here     = pByH[houseNum] || [];
        const total    = here.length;

        return (
          <g key={houseNum}>
            {/* Rashi number */}
            <text
              x={lx} y={ly - 8}
              textAnchor="middle"
              fontSize="9"
              fill={isLagna ? "#d4af37" : "#4a4070"}
              fontFamily="serif"
              fontWeight={isLagna ? "700" : "400"}
            >
              {rashiIdx + 1}
            </text>

            {/* Lagna label */}
            {isLagna && (
              <text
                x={lx} y={ly + 4}
                textAnchor="middle"
                fontSize="6.5"
                fill="#d4af37"
                fontFamily="sans-serif"
                fontWeight="700"
              >
                Lagna
              </text>
            )}

            {/* Planets */}
            {here.map((p, idx) => {
              const ox    = total > 1 ? (idx - (total - 1) / 2) * 14 : 0;
              const py    = ly + (isLagna ? 16 : 12);
              const piIdx = PLS.indexOf(p.name);
              const sym   = piIdx >= 0 ? PEMO[piIdx] : p.name.substring(0,2);
              const col   = piIdx >= 0 ? PCOL[piIdx] : "#aaaaaa";

              return (
                <g key={p.name}>
                  <text
                    x={lx + ox} y={py}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fill={col}
                  >
                    {sym}
                  </text>
                  {p.retro && (
                    <text
                      x={lx + ox + 8} y={py - 6}
                      textAnchor="middle"
                      fontSize="6"
                      fill="#f97316"
                      fontWeight="700"
                    >
                      ℞
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function KundliPage() {
  const [form, setForm]       = useState({ name:"", dob:"", tob:"", city:"" });
  const [chart, setChart]     = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chart");
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);

  const filtered = CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  const handleGenerate = async () => {
    if (!form.name || !form.dob || !form.tob || !form.city) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      const data = calculateChart(form.name, form.dob, form.tob, form.city);
      setChart(data);
      setActiveTab("chart");
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const dignityColor = (d: string) => {
    if (d.includes("Exalted"))      return "#c8a030";
    if (d.includes("Moolatrikona")) return "#1d9e75";
    if (d.includes("Own"))          return "#1d9e75";
    if (d.includes("Debilitated"))  return "#e24b4a";
    return "#605890";
  };

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", { month:"short", year:"numeric" });

  const planetIcons: Record<string,string> = {
    Sun:"☉", Moon:"☽", Mars:"♂", Mercury:"☿",
    Jupiter:"♃", Venus:"♀", Saturn:"♄", Rahu:"☊", Ketu:"☋"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}

        .page{max-width:1200px;margin:0 auto;padding:32px}
        .page-tag{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#c8a030;margin-bottom:8px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;color:#f0e8d0;line-height:1.1}
        .page-title em{font-style:italic;color:#c8a030}
        .page-sub{font-size:14px;color:#605890;margin-top:6px;margin-bottom:28px}

        .form-card{background:#0d0a22;border:1px solid #1c1840;border-radius:20px;padding:32px;margin-bottom:28px}
        .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .form-group{display:flex;flex-direction:column;gap:8px}
        .label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#605890}
        .input{height:50px;padding:0 16px;background:rgba(255,255,255,0.03);border:1px solid #1c1840;border-radius:12px;outline:none;font-size:14px;color:#f0e8d0;font-family:'Outfit',sans-serif;transition:border-color 0.2s;width:100%}
        .input:focus{border-color:#c8a030}
        .input::placeholder{color:#3a3060}
        .city-wrap{position:relative}
        .city-drop{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#0f0c28;border:1px solid #261f50;border-radius:12px;z-index:20;max-height:180px;overflow-y:auto}
        .city-opt{padding:11px 16px;font-size:13px;color:#c8c0a8;cursor:pointer;transition:background 0.15s}
        .city-opt:hover{background:rgba(200,160,48,0.08);color:#f0e8d0}

        .btn-gen{width:100%;margin-top:20px;padding:16px;background:linear-gradient(135deg,#c8a030,#3c2880cc);border:none;border-radius:12px;font-size:15px;font-weight:600;color:#060410;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-gen:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,160,48,0.3)}
        .btn-gen:disabled{opacity:0.5;cursor:not-allowed}

        .loading-wrap{text-align:center;padding:60px 20px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:60px;height:60px;border:2px solid #1c1840;border-top-color:#c8a030;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px}
        .loading-text{font-family:'Cormorant Garamond',serif;font-size:22px;color:#c8a030;font-style:italic}

        .result-header{background:linear-gradient(135deg,#0f0c28,#1a1040);border:1px solid rgba(200,160,48,0.2);border-radius:20px;padding:28px 32px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
        .result-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#f0e8d0}
        .result-name em{font-style:italic;color:#c8a030}
        .result-meta{display:flex;gap:20px;flex-wrap:wrap;margin-top:8px}
        .meta-item{font-size:13px;color:#605890}
        .meta-item span{color:#c8c0a8;font-weight:500}
        .asc-badge{background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.25);border-radius:10px;padding:12px 20px;text-align:center;min-width:110px}
        .asc-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:4px}
        .asc-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#c8a030}
        .asc-deg{font-size:11px;color:#605890;margin-top:2px}

        .acc-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(29,158,117,0.1);border:1px solid rgba(29,158,117,0.2);border-radius:100px;padding:4px 12px;font-size:11px;color:#1d9e75;margin-bottom:16px}

        .tabs{display:flex;gap:4px;margin-bottom:24px;background:#0a0720;border:1px solid #1c1840;border-radius:12px;padding:4px;width:fit-content}
        .tab{padding:8px 20px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;color:#605890;border:none;background:none;font-family:'Outfit',sans-serif}
        .tab.active{background:#1c1840;color:#c8c0a8}

        .chart-layout{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:24px}
        .card-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:6px}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0;margin-bottom:16px}

        .ptable{width:100%;border-collapse:collapse}
        .ptable th{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#3a3060;padding:0 0 12px;text-align:left;font-weight:400}
        .ptable td{padding:9px 0;border-bottom:1px solid #1c1840;font-size:13px;vertical-align:middle}
        .ptable tr:last-child td{border-bottom:none}
        .retro{font-size:9px;color:#f97316;border:1px solid rgba(249,115,22,0.3);border-radius:4px;padding:1px 5px;margin-left:4px}
        .dpill{font-size:10px;padding:2px 8px;border-radius:6px;background:rgba(255,255,255,0.04)}

        .dasha-item{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:12px;border:1px solid #1c1840;margin-bottom:8px;transition:all 0.2s}
        .dasha-item.active{border-color:rgba(200,160,48,0.35);background:rgba(200,160,48,0.04)}
        .dasha-item:last-child{margin-bottom:0}
        .ddot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .ddot.active{background:#c8a030;box-shadow:0 0 8px rgba(200,160,48,0.5)}
        .ddot.inactive{background:#1c1840}
        .dplanet{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;flex:1}
        .dplanet.active{color:#c8a030}.dplanet.inactive{color:#605890}
        .dperiod{font-size:12px;color:#605890}
        .abadge{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(200,160,48,0.1);color:#c8a030;border:1px solid rgba(200,160,48,0.2)}

        .btn-save{display:flex;align-items:center;gap:8px;padding:10px 20px;background:transparent;border:1px solid rgba(200,160,48,0.3);border-radius:10px;color:#c8a030;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-save:hover{background:rgba(200,160,48,0.08)}

        @media(max-width:768px){
          .form-grid{grid-template-columns:1fr}
          .chart-layout{grid-template-columns:1fr}
          .page{padding:20px}
          .result-header{flex-direction:column}
        }
      `}</style>

      <div className="page">
        <div className="page-tag">✦ Kundli Engine</div>
        <h1 className="page-title serif">Generate Your<br /><em>Vedic Birth Chart</em></h1>
        <p className="page-sub">VSOP87 + ELP2000 · Lahiri ayanamsha · Real calculations</p>

        {/* FORM */}
        <div className="form-card">
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" placeholder="e.g. Mukul Pal"
                value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="label">Date of Birth</label>
              <input className="input" type="date" value={form.dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={e => setForm(f=>({...f,dob:e.target.value}))}
                style={{colorScheme:"dark"}} />
            </div>
            <div className="form-group">
              <label className="label">Time of Birth</label>
              <input className="input" type="time" value={form.tob}
                onChange={e => setForm(f=>({...f,tob:e.target.value}))}
                style={{colorScheme:"dark"}} />
            </div>
            <div className="form-group">
              <label className="label">Birth City</label>
              <div className="city-wrap">
                <input className="input" placeholder="Search city..."
                  value={citySearch}
                  onChange={e => { setCitySearch(e.target.value); setForm(f=>({...f,city:""})); setShowCities(true); }}
                  onFocus={() => setShowCities(true)}
                />
                {showCities && citySearch.length > 0 && filtered.length > 0 && (
                  <div className="city-drop">
                    {filtered.map(c => (
                      <div key={c} className="city-opt"
                        onClick={() => { setForm(f=>({...f,city:c})); setCitySearch(c); setShowCities(false); }}>
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="btn-gen" onClick={handleGenerate}
            disabled={!form.name||!form.dob||!form.tob||!form.city||loading}>
            {loading ? "⟳ Calculating..." : "🔯 Generate Kundli"}
          </button>
        </div>

        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">Aligning the planets...</div>
          </div>
        )}

        {chart && !loading && (
          <>
            {/* Header */}
            <div className="result-header">
              <div>
                <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>✦ Janma Kundli</div>
                <div className="result-name serif">{chart.name}&apos;s <em>Cosmic Blueprint</em></div>
                <div className="result-meta">
                  <div className="meta-item">📅 <span>{new Date(chart.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span></div>
                  <div className="meta-item">⏰ <span>{chart.tob}</span></div>
                  <div className="meta-item">📍 <span>{chart.city}</span></div>
                  <div className="meta-item">🌐 <span>{chart.lat.toFixed(2)}°N {chart.lon.toFixed(2)}°E</span></div>
                </div>
              </div>
              <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <div className="asc-badge">
                  <div className="asc-label">Lagna</div>
                  <div className="asc-val">{chart.lagnaRashi}</div>
                  <div className="asc-deg">{Math.floor(chart.lagnaLon % 30)}° {Math.floor(((chart.lagnaLon % 30) % 1) * 60)}&apos;</div>
                </div>
                <button className="btn-save">💾 Save Chart</button>
              </div>
            </div>

            <div className="acc-badge">✓ VSOP87 + ELP2000 · Lahiri · ±0.001° accuracy</div>

            {/* Tabs */}
            <div className="tabs">
              {["chart","planets","dasha","antardasha"].map(t => (
                <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>

            {/* CHART TAB */}
            {activeTab === "chart" && (
              <div className="chart-layout">
                <div className="card">
                  <div className="card-tag">✦ North Indian Chart</div>
                  <div className="card-title serif">Janma Kundli</div>
                  <NorthIndianChart chart={chart} />
                  <div style={{marginTop:16,padding:"12px 14px",background:"rgba(200,160,48,0.05)",border:"1px solid rgba(200,160,48,0.1)",borderRadius:10}}>
                    <div style={{fontSize:11,color:"#c8a030",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Lagna — {chart.lagnaRashi}</div>
                    <div style={{fontSize:13,color:"#c8c0a8",lineHeight:1.7}}>
                      <strong style={{color:"#f0e8d0"}}>{chart.lagnaRashi} Rising</strong> at {Math.floor(chart.lagnaLon % 30)}° — {chart.name} carries this rashi energy in their outer expression and physical appearance.
                    </div>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div className="card">
                    <div className="card-tag">✦ Key Positions</div>
                    <div className="card-title serif">Graha Sthiti</div>
                    {PLS.map((p,i) => {
                      const pl = chart.planets[p];
                      if (!pl) return null;
                      return (
                        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<8?"1px solid #1c1840":"none"}}>
                          <span style={{fontSize:16,width:24,color:PCOL[i]}}>{PEMO[i]}</span>
                          <span style={{flex:1,fontSize:13,color:"#c8c0a8"}}>{p}</span>
                          <span style={{fontSize:13,color:"#f0e8d0"}}>{pl.sign}</span>
                          <span style={{fontSize:11,color:"#605890",width:24,textAlign:"right"}}>H{pl.house}</span>
                          {pl.retrograde && <span style={{fontSize:9,color:"#f97316",border:"1px solid rgba(249,115,22,0.3)",borderRadius:4,padding:"1px 4px"}}>℞</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="card">
                    <div className="card-tag">✦ Active Dasha</div>
                    <div className="card-title serif">
                      {chart.dashas.find(d=>d.active)?.planet} Mahadasha
                    </div>
                    {(() => {
                      const active   = chart.dashas.find(d=>d.active);
                      const activeAD = chart.antardasha.find(d=>d.active);
                      return (
                        <div style={{fontSize:13,color:"#605890",lineHeight:1.9}}>
                          Active: <span style={{color:"#c8a030"}}>{active?.planet} MD</span>
                          {activeAD && <> / <span style={{color:"#e8c060"}}>{activeAD.planet} AD</span></>}<br/>
                          <span style={{color:"#c8c0a8"}}>{active && formatDate(active.start)} → {active && formatDate(active.end)}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* PLANETS TAB */}
            {activeTab === "planets" && (
              <div className="card">
                <div className="card-tag">✦ Planetary Positions</div>
                <div className="card-title serif">Navagraha Sthiti — Real Calculation</div>
                <table className="ptable">
                  <thead>
                    <tr>
                      <th>Planet</th>
                      <th>Rashi</th>
                      <th>Degree</th>
                      <th>House</th>
                      <th>Nakshatra</th>
                      <th>Pada</th>
                      <th>Dignity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLS.map((p,i) => {
                      const pl = chart.planets[p];
                      if (!pl) return null;
                      return (
                        <tr key={i}>
                          <td>
                            <span style={{color:PCOL[i],marginRight:8,fontSize:16}}>{PEMO[i]}</span>
                            <span style={{color:"#c8c0a8",fontWeight:500}}>{p}</span>
                            {pl.retrograde && <span className="retro">℞</span>}
                          </td>
                          <td style={{color:"#f0e8d0"}}>{pl.sign}</td>
                          <td style={{color:"#605890",fontSize:12}}>{pl.degree}° {pl.minutes}&apos;</td>
                          <td style={{color:"#605890"}}>H{pl.house}</td>
                          <td style={{color:"#c8c0a8",fontSize:12}}>{pl.nakshatra}</td>
                          <td style={{color:"#605890",fontSize:12}}>P{pl.pada}</td>
                          <td>
                            <span className="dpill" style={{color:dignityColor(pl.dignity)}}>
                              {pl.dignity || "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* DASHA TAB */}
            {activeTab === "dasha" && (
              <div className="card">
                <div className="card-tag">✦ Vimshottari Mahadasha</div>
                <div className="card-title serif">Your Life Timeline</div>
                {chart.dashas.map((d,i) => (
                  <div key={i} className={`dasha-item ${d.active?"active":""}`}>
                    <div className={`ddot ${d.active?"active":"inactive"}`} />
                    <div className={`dplanet serif ${d.active?"active":"inactive"}`}>{d.planet} Mahadasha</div>
                    <div className="dperiod">{formatDate(d.start)} – {formatDate(d.end)}</div>
                    <div style={{fontSize:11,color:"#3a3060"}}>{d.yrs.toFixed(1)}y</div>
                    {d.active && <div className="abadge">Active</div>}
                  </div>
                ))}
              </div>
            )}

            {/* ANTARDASHA TAB */}
            {activeTab === "antardasha" && (
              <div className="card">
                <div className="card-tag">✦ Antardasha — Sub Periods</div>
                <div className="card-title serif">
                  {chart.dashas.find(d=>d.active)?.planet} MD · Sub Periods
                </div>
                {chart.antardasha.map((d,i) => (
                  <div key={i} className={`dasha-item ${d.active?"active":""}`}>
                    <div className={`ddot ${d.active?"active":"inactive"}`} />
                    <div className={`dplanet serif ${d.active?"active":"inactive"}`}>{d.planet} Antardasha</div>
                    <div className="dperiod">{formatDate(d.start)} – {formatDate(d.end)}</div>
                    <div style={{fontSize:11,color:"#3a3060"}}>{(d.yrs*12).toFixed(1)}m</div>
                    {d.active && <div className="abadge">Active</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}