"use client";
import { useState } from "react";

interface Planet {
  name: string;
  icon: string;
  sign: string;
  signNum: number;
  degree: string;
  house: number;
  retrograde: boolean;
  dignity: string;
}

interface ChartData {
  ascendant: number;
  planets: Planet[];
  yogas: { name: string; description: string; strength: "high" | "medium" | "low" }[];
  dashas: { planet: string; start: string; end: string; active: boolean }[];
  name: string;
  dob: string;
  tob: string;
  city: string;
}

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_ICONS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

// Simple mock calculation — real engine will replace this
function calculateChart(name: string, dob: string, tob: string, city: string): ChartData {
  const d = new Date(dob);
  const seed = d.getDate() + d.getMonth() * 7 + d.getFullYear() % 100;
  const asc = seed % 12;

  const planets: Planet[] = [
    { name:"Sun",     icon:"☀️", sign:SIGNS[(asc+0)%12], signNum:(asc+0)%12, degree:`${(seed*7)%30}°${(seed*3)%60}'`, house:1,  retrograde:false, dignity:"Own" },
    { name:"Moon",    icon:"🌙", sign:SIGNS[(asc+3)%12], signNum:(asc+3)%12, degree:`${(seed*11)%30}°${(seed*5)%60}'`, house:4,  retrograde:false, dignity:"Exalted" },
    { name:"Mars",    icon:"♂",  sign:SIGNS[(asc+2)%12], signNum:(asc+2)%12, degree:`${(seed*13)%30}°${(seed*7)%60}'`, house:3,  retrograde:false, dignity:"Friend" },
    { name:"Mercury", icon:"☿",  sign:SIGNS[(asc+1)%12], signNum:(asc+1)%12, degree:`${(seed*17)%30}°${(seed*9)%60}'`, house:2,  retrograde:true,  dignity:"Own" },
    { name:"Jupiter", icon:"♃",  sign:SIGNS[(asc+4)%12], signNum:(asc+4)%12, degree:`${(seed*19)%30}°${(seed*11)%60}'`, house:5, retrograde:false, dignity:"Exalted" },
    { name:"Venus",   icon:"♀",  sign:SIGNS[(asc+11)%12],signNum:(asc+11)%12,degree:`${(seed*23)%30}°${(seed*13)%60}'`, house:12,retrograde:false, dignity:"Friend" },
    { name:"Saturn",  icon:"♄",  sign:SIGNS[(asc+10)%12],signNum:(asc+10)%12,degree:`${(seed*29)%30}°${(seed*17)%60}'`, house:11,retrograde:true,  dignity:"Own" },
    { name:"Rahu",    icon:"☊",  sign:SIGNS[(asc+7)%12], signNum:(asc+7)%12, degree:`${(seed*31)%30}°${(seed*19)%60}'`, house:8, retrograde:true,  dignity:"—" },
    { name:"Ketu",    icon:"☋",  sign:SIGNS[(asc+1)%12], signNum:(asc+1)%12, degree:`${(seed*31)%30}°${(seed*19)%60}'`, house:2, retrograde:true,  dignity:"—" },
  ];

  const yogas = [
    { name:"Gajakesari Yoga",  description:"Jupiter and Moon in mutual kendras — grants wisdom, fame, and prosperity.", strength:"high" as const },
    { name:"Budhaditya Yoga",  description:"Sun and Mercury conjunct — exceptional intellect, communication mastery.", strength:"high" as const },
    { name:"Chandra Mangal",   description:"Moon and Mars combination — entrepreneurial drive, financial acumen.", strength:"medium" as const },
    { name:"Viparita Raja",    description:"Lords of 6th, 8th, 12th in those houses — hidden power, spiritual transformation.", strength:"medium" as const },
    { name:"Saraswati Yoga",   description:"Venus, Mercury, Jupiter in kendras/trikonas — creative genius, artistic excellence.", strength:"low" as const },
  ];

  const dashas = [
    { planet:"Saturn", start:"2018", end:"2037", active:true },
    { planet:"Mercury",start:"2037", end:"2054", active:false },
    { planet:"Ketu",   start:"2054", end:"2061", active:false },
    { planet:"Venus",  start:"2061", end:"2081", active:false },
  ];

  return { ascendant: asc, planets, yogas, dashas, name, dob, tob, city };
}

// North Indian Chart SVG
function NorthIndianChart({ data }: { data: ChartData }) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const asc = data.ascendant;

  // House positions in North Indian chart (fixed diamond layout)
  const housePositions: Record<number, { x: number; y: number; label: string }> = {
    1:  { x: cx,      y: cy-80,   label: "Asc" },
    2:  { x: cx+80,   y: cy-80,   label: "2" },
    3:  { x: cx+130,  y: cy,      label: "3" },
    4:  { x: cx+80,   y: cy+80,   label: "4" },
    5:  { x: cx,      y: cy+80,   label: "5" },
    6:  { x: cx-80,   y: cy+80,   label: "6" },
    7:  { x: cx-130,  y: cy,      label: "7" },
    8:  { x: cx-80,   y: cy-80,   label: "8" },
    9:  { x: cx-80,   y: cy-140,  label: "9" },
    10: { x: cx,      y: cy-140,  label: "10" },
    11: { x: cx+80,   y: cy-140,  label: "11" },
    12: { x: cx+80,   y: cy-10,   label: "12" },
  };

  // Which planets are in each house
  const housePlanets: Record<number, Planet[]> = {};
  data.planets.forEach(p => {
    if (!housePlanets[p.house]) housePlanets[p.house] = [];
    housePlanets[p.house].push(p);
  });

  const s = size;
  const h = s / 2;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" style={{ maxWidth: 380, display:"block", margin:"0 auto" }}>
      {/* Background */}
      <rect width={s} height={s} fill="#0a0720" rx="12" />

      {/* Outer square */}
      <rect x="20" y="20" width={s-40} height={s-40} fill="none" stroke="#261f50" strokeWidth="1" />

      {/* Inner diamond lines */}
      <line x1={h} y1="20"   x2="20"  y2={h}   stroke="#261f50" strokeWidth="1" />
      <line x1={h} y1="20"   x2={s-20} y2={h}   stroke="#261f50" strokeWidth="1" />
      <line x1={h} y1={s-20} x2="20"  y2={h}   stroke="#261f50" strokeWidth="1" />
      <line x1={h} y1={s-20} x2={s-20} y2={h}   stroke="#261f50" strokeWidth="1" />

      {/* Corner cross lines */}
      <line x1="20"  y1="20"   x2={h}   y2={h}   stroke="#1c1840" strokeWidth="0.5" />
      <line x1={s-20} y1="20"  x2={h}   y2={h}   stroke="#1c1840" strokeWidth="0.5" />
      <line x1="20"  y1={s-20} x2={h}   y2={h}   stroke="#1c1840" strokeWidth="0.5" />
      <line x1={s-20} y1={s-20} x2={h}  y2={h}   stroke="#1c1840" strokeWidth="0.5" />

      {/* House numbers */}
      {Array.from({length:12},(_,i)=>i+1).map(house => {
        const signIndex = (asc + house - 1) % 12;
        const pos = housePositions[house];
        if (!pos) return null;
        const planets = housePlanets[house] || [];
        return (
          <g key={house}>
            {/* House number */}
            <text x={pos.x} y={pos.y-8} textAnchor="middle" fontSize="9" fill="#3a3060" fontFamily="Outfit, sans-serif">
              {house}
            </text>
            {/* Sign */}
            <text x={pos.x} y={pos.y+6} textAnchor="middle" fontSize="11" fill="#605890" fontFamily="Outfit, sans-serif">
              {SIGN_ICONS[signIndex]}
            </text>
            {/* Planets */}
            {planets.slice(0,3).map((pl, pi) => (
              <text key={pi} x={pos.x} y={pos.y+20+(pi*13)} textAnchor="middle" fontSize="10"
                fill={house === 1 ? "#c8a030" : "#c8c0a8"} fontFamily="Outfit, sans-serif" fontWeight={house===1?"600":"400"}>
                {pl.icon}{pl.retrograde ? "ℛ" : ""}
              </text>
            ))}
          </g>
        );
      })}

      {/* Center label */}
      <text x={h} y={h-6} textAnchor="middle" fontSize="10" fill="#3a3060" fontFamily="Cormorant Garamond, serif">
        {SIGNS[asc]}
      </text>
      <text x={h} y={h+8} textAnchor="middle" fontSize="9" fill="#261f50" fontFamily="Outfit, sans-serif">
        Lagna
      </text>

      {/* Gold ascendant highlight */}
      <rect x={h-30} y="22" width="60" height="22" fill="rgba(200,160,48,0.06)" rx="4" />
    </svg>
  );
}

export default function KundliPage() {
  const [form, setForm] = useState({ name:"", dob:"", tob:"", city:"" });
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chart");

  const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad","Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Varanasi","Amritsar","Dehradun","Surat"];
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);
  const filtered = CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  const handleGenerate = async () => {
    if (!form.name || !form.dob || !form.tob || !form.city) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    const data = calculateChart(form.name, form.dob, form.tob, form.city);
    setChart(data);
    setLoading(false);
  };

  const dignityColor = (d: string) => {
    if (d === "Exalted") return "#c8a030";
    if (d === "Own") return "#1d9e75";
    if (d === "Debilitated") return "#e24b4a";
    return "#605890";
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
        .page-header{margin-bottom:32px}
        .page-tag{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#c8a030;margin-bottom:8px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;color:#f0e8d0;line-height:1.1}
        .page-title em{font-style:italic;color:#c8a030}
        .page-sub{font-size:14px;color:#605890;margin-top:6px}

        /* FORM */
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

        .btn-generate{width:100%;margin-top:20px;padding:16px;background:linear-gradient(135deg,#c8a030,#3c2880cc);border:none;border-radius:12px;font-size:15px;font-weight:600;color:#060410;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-generate:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,160,48,0.3)}
        .btn-generate:disabled{opacity:0.5;cursor:not-allowed}

        /* LOADING */
        .loading-wrap{text-align:center;padding:60px 20px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:60px;height:60px;border:2px solid #1c1840;border-top-color:#c8a030;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px}
        .loading-text{font-family:'Cormorant Garamond',serif;font-size:22px;color:#c8a030;font-style:italic}
        .loading-sub{font-size:13px;color:#605890;margin-top:6px}

        /* RESULT */
        .result-header{background:linear-gradient(135deg,#0f0c28,#1a1040);border:1px solid rgba(200,160,48,0.2);border-radius:20px;padding:28px 32px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
        .result-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#f0e8d0}
        .result-name em{font-style:italic;color:#c8a030}
        .result-meta{display:flex;gap:20px;flex-wrap:wrap}
        .meta-item{font-size:13px;color:#605890}
        .meta-item span{color:#c8c0a8;font-weight:500}
        .asc-badge{background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.25);border-radius:10px;padding:10px 20px;text-align:center}
        .asc-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:4px}
        .asc-val{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#c8a030}

        /* TABS */
        .tabs{display:flex;gap:4px;margin-bottom:24px;background:#0a0720;border:1px solid #1c1840;border-radius:12px;padding:4px;width:fit-content}
        .tab{padding:8px 20px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;color:#605890;border:none;background:none;font-family:'Outfit',sans-serif}
        .tab.active{background:#1c1840;color:#c8c0a8}

        /* CHART LAYOUT */
        .chart-layout{display:grid;grid-template-columns:1fr 1fr;gap:24px}

        /* CARDS */
        .card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:24px}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0;margin-bottom:16px}
        .card-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:6px}

        /* PLANET TABLE */
        .planet-table{width:100%;border-collapse:collapse}
        .planet-table th{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#3a3060;padding:0 0 12px;text-align:left;font-weight:400}
        .planet-table td{padding:10px 0;border-bottom:1px solid #1c1840;font-size:13px;vertical-align:middle}
        .planet-table tr:last-child td{border-bottom:none}
        .planet-icon-cell{font-size:18px;width:28px}
        .planet-name{color:#c8c0a8;font-weight:500}
        .planet-sign{color:#f0e8d0}
        .planet-deg{color:#605890;font-size:11px}
        .retro-badge{font-size:9px;color:#c8a030;border:1px solid rgba(200,160,48,0.3);border-radius:4px;padding:1px 5px;margin-left:4px}
        .dignity-badge{font-size:10px;padding:2px 8px;border-radius:6px;background:rgba(255,255,255,0.04)}

        /* YOGAS */
        .yoga-item{padding:14px 16px;border-radius:12px;border:1px solid #1c1840;background:#0a0720;margin-bottom:10px;transition:border-color 0.2s}
        .yoga-item:last-child{margin-bottom:0}
        .yoga-item:hover{border-color:rgba(200,160,48,0.2)}
        .yoga-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
        .yoga-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#f0e8d0}
        .yoga-strength{font-size:10px;padding:3px 10px;border-radius:20px}
        .strength-high{background:rgba(200,160,48,0.12);color:#c8a030;border:1px solid rgba(200,160,48,0.2)}
        .strength-medium{background:rgba(29,158,117,0.1);color:#1d9e75;border:1px solid rgba(29,158,117,0.2)}
        .strength-low{background:rgba(96,88,144,0.15);color:#8888cc;border:1px solid rgba(96,88,144,0.2)}
        .yoga-desc{font-size:13px;color:#605890;line-height:1.7}

        /* DASHA */
        .dasha-item{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:12px;border:1px solid #1c1840;margin-bottom:10px;transition:all 0.2s}
        .dasha-item.active{border-color:rgba(200,160,48,0.3);background:rgba(200,160,48,0.04)}
        .dasha-item:last-child{margin-bottom:0}
        .dasha-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .dasha-dot.active{background:#c8a030;box-shadow:0 0 8px rgba(200,160,48,0.5)}
        .dasha-dot.inactive{background:#1c1840}
        .dasha-planet{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;flex:1}
        .dasha-planet.active{color:#c8a030}
        .dasha-planet.inactive{color:#605890}
        .dasha-period{font-size:12px;color:#605890}
        .dasha-active-badge{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(200,160,48,0.1);color:#c8a030;border:1px solid rgba(200,160,48,0.2)}

        /* SAVE BTN */
        .btn-save{display:flex;align-items:center;gap:8px;padding:10px 20px;background:transparent;border:1px solid rgba(200,160,48,0.3);border-radius:10px;color:#c8a030;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-save:hover{background:rgba(200,160,48,0.08)}

        /* UPGRADE LOCK */
        .lock-overlay{position:relative}
        .lock-blur{filter:blur(4px);pointer-events:none;user-select:none;opacity:0.4}
        .lock-badge{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
        .lock-icon{font-size:32px}
        .lock-text{font-family:'Cormorant Garamond',serif;font-size:16px;color:#f0e8d0}
        .lock-btn{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif}

        @media(max-width:768px){
          .form-grid{grid-template-columns:1fr}
          .chart-layout{grid-template-columns:1fr}
          .page{padding:20px}
          .result-header{flex-direction:column}
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="page-header">
          <div className="page-tag">✦ Kundli Engine</div>
          <h1 className="page-title serif">
            Generate Your<br /><em>Vedic Birth Chart</em>
          </h1>
          <p className="page-sub">Swiss ephemeris precision · 15+ astrology systems · AI-powered interpretation</p>
        </div>

        {/* FORM */}
        <div className="form-card">
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" placeholder="e.g. Arjun Sharma" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="label">Date of Birth</label>
              <input className="input" type="date" value={form.dob} max={new Date().toISOString().split("T")[0]} onChange={e => setForm(f=>({...f,dob:e.target.value}))} style={{colorScheme:"dark"}} />
            </div>
            <div className="form-group">
              <label className="label">Time of Birth</label>
              <input className="input" type="time" value={form.tob} onChange={e => setForm(f=>({...f,tob:e.target.value}))} style={{colorScheme:"dark"}} />
            </div>
            <div className="form-group">
              <label className="label">Birth City</label>
              <div className="city-wrap">
                <input className="input" placeholder="Search city..." value={citySearch}
                  onChange={e=>{setCitySearch(e.target.value);setForm(f=>({...f,city:""}));setShowCities(true)}}
                  onFocus={()=>setShowCities(true)}
                />
                {showCities && citySearch.length > 0 && (
                  <div className="city-drop">
                    {filtered.map(c=>(
                      <div key={c} className="city-opt" onClick={()=>{setForm(f=>({...f,city:c}));setCitySearch(c);setShowCities(false)}}>
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="btn-generate" onClick={handleGenerate} disabled={!form.name||!form.dob||!form.tob||!form.city||loading}>
            {loading ? "⟳ Calculating..." : "🔯 Generate Kundli"}
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">Aligning the planets...</div>
            <div className="loading-sub">Calculating your cosmic blueprint with Swiss ephemeris precision</div>
          </div>
        )}

        {/* RESULT */}
        {chart && !loading && (
          <>
            {/* Result Header */}
            <div className="result-header">
              <div>
                <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>✦ Birth Chart</div>
                <div className="result-name serif">{chart.name}&apos;s <em>Cosmic Blueprint</em></div>
                <div className="result-meta" style={{marginTop:10}}>
                  <div className="meta-item">📅 <span>{new Date(chart.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span></div>
                  <div className="meta-item">⏰ <span>{chart.tob}</span></div>
                  <div className="meta-item">📍 <span>{chart.city}</span></div>
                </div>
              </div>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div className="asc-badge">
                  <div className="asc-label">Ascendant</div>
                  <div className="asc-val">{SIGNS[chart.ascendant]}</div>
                </div>
                <button className="btn-save">💾 Save Chart</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {["chart","planets","yogas","dasha"].map(t=>(
                <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>

            {/* CHART TAB */}
            {activeTab === "chart" && (
              <div className="chart-layout">
                {/* North Indian Chart */}
                <div className="card">
                  <div className="card-tag">✦ North Indian Chart</div>
                  <div className="card-title serif">Janma Kundli</div>
                  <NorthIndianChart data={chart} />
                  <div style={{marginTop:16,padding:"12px 14px",background:"rgba(200,160,48,0.05)",border:"1px solid rgba(200,160,48,0.1)",borderRadius:10}}>
                    <div style={{fontSize:11,color:"#c8a030",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Ascendant</div>
                    <div style={{fontSize:14,color:"#c8c0a8"}}>{SIGNS[chart.ascendant]} Rising — {chart.name} carries the energy of {SIGNS[chart.ascendant]} in their outer expression and physical body.</div>
                  </div>
                </div>

                {/* Quick Summary */}
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div className="card">
                    <div className="card-tag">✦ Chart Summary</div>
                    <div className="card-title serif">Key Positions</div>
                    {chart.planets.slice(0,5).map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<4?"1px solid #1c1840":"none"}}>
                        <span style={{fontSize:18,width:24}}>{p.icon}</span>
                        <span style={{flex:1,fontSize:13,color:"#c8c0a8"}}>{p.name}</span>
                        <span style={{fontSize:13,color:"#f0e8d0"}}>{p.sign}</span>
                        <span style={{fontSize:11,color:"#605890",width:32,textAlign:"right"}}>H{p.house}</span>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <div className="card-tag">✦ Active Dasha</div>
                    <div className="card-title serif">Saturn Mahadasha</div>
                    <div style={{fontSize:13,color:"#605890",lineHeight:1.8}}>
                      You are currently in <span style={{color:"#c8a030"}}>Saturn Mahadasha</span> (2018–2037). This 19-year period brings discipline, karmic lessons, hard work rewards, and spiritual depth. Saturn is your teacher.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLANETS TAB */}
            {activeTab === "planets" && (
              <div className="card">
                <div className="card-tag">✦ Planetary Positions</div>
                <div className="card-title serif">Graha Sthiti — All 9 Planets</div>
                <table className="planet-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Planet</th>
                      <th>Sign</th>
                      <th>Degree</th>
                      <th>House</th>
                      <th>Dignity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.planets.map((p,i)=>(
                      <tr key={i}>
                        <td className="planet-icon-cell">{p.icon}</td>
                        <td>
                          <span className="planet-name">{p.name}</span>
                          {p.retrograde && <span className="retro-badge">ℛ</span>}
                        </td>
                        <td className="planet-sign">{p.sign}</td>
                        <td className="planet-deg">{p.degree}</td>
                        <td style={{color:"#605890",fontSize:13}}>House {p.house}</td>
                        <td>
                          <span className="dignity-badge" style={{color:dignityColor(p.dignity)}}>{p.dignity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* YOGAS TAB */}
            {activeTab === "yogas" && (
              <div className="card">
                <div className="card-tag">✦ Yoga Detection</div>
                <div className="card-title serif">Detected Yogas in Your Chart</div>
                {chart.yogas.map((y,i)=>(
                  <div key={i} className={`yoga-item ${i >= 3 ? "lock-overlay" : ""}`}>
                    {i >= 3 ? (
                      <>
                        <div className="lock-blur">
                          <div className="yoga-top">
                            <div className="yoga-name">{y.name}</div>
                          </div>
                          <div className="yoga-desc">{y.description}</div>
                        </div>
                        <div className="lock-badge">
                          <div className="lock-icon">🔒</div>
                          <div className="lock-text">Premium Feature</div>
                          <button className="lock-btn">Upgrade to Unlock</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="yoga-top">
                          <div className="yoga-name serif">{y.name}</div>
                          <span className={`yoga-strength strength-${y.strength}`}>{y.strength.toUpperCase()}</span>
                        </div>
                        <div className="yoga-desc">{y.description}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* DASHA TAB */}
            {activeTab === "dasha" && (
              <div className="card">
                <div className="card-tag">✦ Vimshottari Dasha</div>
                <div className="card-title serif">Your Life Timeline</div>
                <div style={{marginBottom:20,padding:"14px 16px",background:"rgba(200,160,48,0.05)",border:"1px solid rgba(200,160,48,0.1)",borderRadius:12,fontSize:13,color:"#605890",lineHeight:1.8}}>
                  Vimshottari Dasha is a 120-year planetary cycle that governs the timing of life events. Each planet rules a period of specific years, shaping the themes, opportunities, and challenges of that phase.
                </div>
                {chart.dashas.map((d,i)=>(
                  <div key={i} className={`dasha-item ${d.active?"active":""}`}>
                    <div className={`dasha-dot ${d.active?"active":"inactive"}`} />
                    <div className={`dasha-planet serif ${d.active?"active":"inactive"}`}>{d.planet} Mahadasha</div>
                    <div className="dasha-period">{d.start} – {d.end}</div>
                    {d.active && <div className="dasha-active-badge">Active Now</div>}
                  </div>
                ))}
                <div style={{marginTop:16,padding:"14px 16px",background:"rgba(96,88,144,0.08)",border:"1px solid #1c1840",borderRadius:10,fontSize:13,color:"#605890",textAlign:"center"}}>
                  🔒 Antardasha & Pratyantardasha available in <span style={{color:"#c8a030",cursor:"pointer"}}>Premium Plan →</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
