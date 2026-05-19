"use client";
import { useMemo, useState } from "react";
import "@/app/dashboard/shared.css";
import { calculateLalKitab } from "@/lib/astro-engine/lalkitab";
import {
  analyzeAdvancedLalKitab,
  type Planet,
  type PlanetPlacement,
} from "@/lib/astro-intelligence/lal-kitab/advanced-lal-kitab-engine";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";

type Tab = "planets" | "takkar" | "rin" | "ages" | "combos" | "varshphal" | "ghar" | "safety";
type DomainTab = "nishani" | "career" | "money" | "marriage" | "health" | "psychology";

const ADVANCED_PLANETS: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

function buildAdvancedPlacements(planets: Record<string, { house?: number }>): PlanetPlacement[] {
  return ADVANCED_PLANETS.flatMap((planet) => {
    const house = planets[planet]?.house;
    return typeof house === "number" && Number.isFinite(house)
      ? [{ planet, house }]
      : [];
  });
}

export default function LalKitabPage() {
  const [activeTab, setActiveTab]     = useState<Tab>("planets");
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [domainTab, setDomainTab]     = useState<DomainTab>("nishani");
  const { birth, chart }              = useUserChart();
  const { t, tp, ts, lang } = useLanguage();
  const result = calculateLalKitab(chart.planets as never, birth.dob, (chart as never as { lagnaNum?: number }).lagnaNum ?? 0);

  const pakkaCount   = result.planets.filter(p => p.status === "pakka").length;
  const dushmanCount = result.planets.filter(p => p.status === "dushman").length;
  const currentAge   = new Date().getFullYear() - new Date(birth.dob).getFullYear();
  const advancedResult = useMemo(() => {
    const natalPlanets = buildAdvancedPlacements(chart.planets);
    return analyzeAdvancedLalKitab({
      natalPlanets,
      currentAge,
      language: lang,
    });
  }, [chart.planets, currentAge, lang]);

  const scoreColor = (s: number) => s >= 70 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#ef4444";
  const stateGlow  = (st: string) =>
    st === "nek" ? "0 0 0 2px rgba(34,197,94,0.25)" :
    st === "mandi" ? "0 0 0 2px rgba(239,68,68,0.25)" : "none";
  const stateLabel = (st: string) =>
    st === "nek" ? "Nek Halat" : st === "mandi" ? "Mandi Halat" : "Madhyam";
  const stateColor = (st: string) =>
    st === "nek" ? "#22c55e" : st === "mandi" ? "#ef4444" : "#f59e0b";

  return (
    <>
      <style>{`
        .header-name{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#f0e8d0}
        .header-stats{display:flex;gap:12px;flex-wrap:wrap}
        .pitra-alert{background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.3);border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:flex-start;gap:12px}
        .pitra-icon{font-size:24px;flex-shrink:0}
        .pitra-text{font-size:13px;color:#fdba74;line-height:1.7}
        .pitra-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#f97316;margin-bottom:4px}
        .kismat-bar{background:linear-gradient(135deg,rgba(200,160,48,0.12),rgba(245,158,11,0.06));border:1px solid rgba(200,160,48,0.3);border-radius:14px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:16px}
        .kismat-icon{font-size:32px}
        .kismat-content{flex:1}
        .kismat-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:4px}
        .kismat-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#f0e8d0;margin-bottom:4px}
        .kismat-interp{font-size:13px;color:#c8c0a8;line-height:1.6}
        .kismat-score{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:#f59e0b;line-height:1}
        .planet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
        .planet-card{border-radius:14px;padding:18px;cursor:pointer;transition:all 0.25s;border:1px solid}
        .planet-card.pakka{background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.2)}
        .planet-card.pakka:hover{border-color:rgba(34,197,94,0.4);transform:translateY(-2px)}
        .planet-card.dushman{background:rgba(239,68,68,0.04);border-color:rgba(239,68,68,0.2)}
        .planet-card.dushman:hover{border-color:rgba(239,68,68,0.4);transform:translateY(-2px)}
        .planet-card.sadharan{background:#0d0a22;border-color:rgba(245,158,11,0.2)}
        .planet-card.sadharan:hover{border-color:rgba(245,158,11,0.4);transform:translateY(-2px)}
        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .card-left{display:flex;align-items:center;gap:10px}
        .p-icon{font-size:22px}
        .p-name{font-size:15px;font-weight:600;color:#f0e8d0}
        .p-pos{font-size:11px;color:#605890;margin-top:2px}
        .card-badges{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
        .status-badge{font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid}
        .score-badge{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700}
        .score-bar-wrap{width:60px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden}
        .score-bar{height:100%;border-radius:2px;transition:width 0.4s}
        .state-dot{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:4px}
        .retro-badge{background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:8px;padding:6px 10px;font-size:11px;color:#fdba74;margin-bottom:8px;line-height:1.6}
        .conflict-badge{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:6px 10px;font-size:11px;color:#fca5a5;margin-bottom:8px;line-height:1.6}
        .friend-badge{background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:8px;padding:6px 10px;font-size:11px;color:#86efac;margin-bottom:8px;line-height:1.6}
        .nishani-txt{font-size:13px;color:#c8c0a8;line-height:1.8;margin-bottom:10px}
        .tags-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
        .tag{font-size:10px;padding:3px 10px;border-radius:20px;white-space:nowrap}
        .tag-age{background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.2);color:#c8a030}
        .tag-rin{background:rgba(20,184,166,0.08);border:1px solid rgba(20,184,166,0.2);color:#2dd4bf}
        .tag-retro{background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);color:#f97316}
        .domain-tabs{display:flex;gap:4px;flex-wrap:wrap;margin:12px 0 8px;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px}
        .dtab{font-size:10px;padding:4px 10px;border-radius:20px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#605890;cursor:pointer;transition:all 0.2s}
        .dtab.active{background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.3);color:#f59e0b}
        .domain-txt{font-size:13px;color:#c8c0a8;line-height:1.8;margin-bottom:8px}
        .home-env-list{display:flex;flex-direction:column;gap:4px;margin:6px 0}
        .home-env-item{font-size:12px;color:#c8c0a8;padding:4px 8px;background:rgba(255,255,255,0.03);border-radius:6px;border-left:2px solid rgba(245,158,11,0.3)}
        .remedies-list{display:flex;flex-direction:column;gap:4px;margin-top:6px}
        .remedy-item{font-size:12px;color:#f97316;padding:4px 8px;background:rgba(249,115,22,0.05);border-radius:6px;border-left:2px solid rgba(249,115,22,0.3)}
        .takkar-card{border-radius:14px;padding:18px;margin-bottom:12px;transition:border-color 0.2s;border:1px solid}
        .takkar-card.enemy{background:rgba(239,68,68,0.05);border-color:rgba(239,68,68,0.2)}
        .takkar-card.enemy:hover{border-color:rgba(239,68,68,0.4)}
        .takkar-card.support{background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.2)}
        .takkar-card.support:hover{border-color:rgba(34,197,94,0.35)}
        .takkar-card.complex{background:rgba(245,158,11,0.04);border-color:rgba(245,158,11,0.2)}
        .takkar-card.complex:hover{border-color:rgba(245,158,11,0.35)}
        .takkar-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;margin-bottom:6px}
        .takkar-house{font-size:11px;color:#605890;margin-bottom:8px}
        .takkar-effect{font-size:13px;color:#c8c0a8;line-height:1.7;margin-bottom:10px}
        .takkar-upaya{font-size:12px;color:#f97316;padding:8px 10px;background:rgba(249,115,22,0.05);border-radius:8px;border:1px solid rgba(249,115,22,0.15)}
        .rin-card{background:rgba(249,115,22,0.04);border:1px solid rgba(249,115,22,0.2);border-radius:14px;padding:18px;margin-bottom:12px}
        .rin-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#fdba74;margin-bottom:6px}
        .rin-desc{font-size:13px;color:#c8c0a8;line-height:1.7;margin-bottom:8px}
        .rin-upaya{font-size:12px;color:#f97316;padding:8px 10px;background:rgba(249,115,22,0.05);border-radius:8px;border:1px solid rgba(249,115,22,0.15)}
        .ages-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
        .age-card{border-radius:14px;padding:18px;text-align:center;border:1px solid;transition:all 0.2s}
        .age-card:hover{transform:translateY(-3px)}
        .combo-card{background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.2);border-radius:14px;padding:20px;margin-bottom:14px}
        .combo-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#c4b5fd;margin-bottom:6px}
        .combo-pred{font-size:13px;color:#c8c0a8;line-height:1.8;margin-bottom:10px}
        .combo-psych{font-size:12px;color:#a78bfa;padding:8px 10px;background:rgba(167,139,250,0.05);border-radius:8px;border:1px solid rgba(167,139,250,0.15);margin-bottom:10px}
        .combo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .combo-col-title{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#605890;margin-bottom:6px}
        .combo-list-item{font-size:12px;color:#c8c0a8;padding:3px 0;padding-left:10px;border-left:2px solid;line-height:1.5}
        .combo-remedies{margin-top:8px}
        .varsh-card{background:linear-gradient(135deg,rgba(96,165,250,0.06),rgba(167,139,250,0.04));border:1px solid rgba(96,165,250,0.25);border-radius:16px;padding:24px}
        .varsh-year{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:700;color:#60a5fa;line-height:1}
        .varsh-lagna{font-size:13px;color:#93c5fd;margin:6px 0 16px}
        .varsh-summary{font-size:14px;color:#c8c0a8;line-height:1.9;margin-bottom:16px}
        .varsh-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .varsh-col{border-radius:10px;padding:14px}
        .varsh-col.shubh{background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2)}
        .varsh-col.caution{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2)}
        .varsh-col-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
        .varsh-planet{font-size:13px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
        .varsh-planet:last-child{border-bottom:none}
        .safety-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px;margin-bottom:14px}
        .safety-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:#f0e8d0;margin-bottom:8px}
        .safety-text{font-size:13px;color:#c8c0a8;line-height:1.8}
        .support-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:14px}
        .support-card{border-radius:12px;padding:14px;border:1px solid;background:rgba(13,10,34,0.7)}
        .support-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
        .support-name{font-size:14px;font-weight:700;color:#f0e8d0}
        .support-score{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;line-height:1}
        .safety-pill{font-size:10px;font-weight:700;border-radius:20px;padding:3px 9px;border:1px solid;text-transform:uppercase;letter-spacing:.4px}
        .indicator-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-top:12px}
        .indicator-card{background:rgba(249,115,22,0.04);border:1px solid rgba(249,115,22,0.18);border-radius:12px;padding:14px}
        .protocol-list{display:grid;gap:7px;margin-top:10px}
        .protocol-item{font-size:12px;color:#d8cfb8;line-height:1.6;padding:8px 10px;border-radius:8px;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.12)}
        @media(max-width:768px){.planet-grid{grid-template-columns:1fr}.combo-grid{grid-template-columns:1fr}.varsh-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="page">
        <div className="page-tag">{t("lalkitab.page_tag")}</div>
        <h1 className="page-title serif">{t("lalkitab.page_title")}</h1>
        <p className="page-sub">Pakka Ghar · Dushman Ghar · Nishaniyan · Upaya · Takkar · Rin Siddhant · Kismat Ka Grah</p>
        <PremiumFeature feature="Lal Kitab Engine">

        {/* HEADER CARD */}
        <div className="header-card">
          <div className="header-orb"/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#ef4444",marginBottom:6}}>📕 Lal Kitab</div>
            <div className="header-name serif">{birth.name}</div>
            <div style={{fontSize:13,color:"#605890",marginTop:4}}>
              {new Date(birth.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} · {birth.tob} · {birth.city} · Age {currentAge}
            </div>
          </div>
          <div className="header-stats" style={{position:"relative",zIndex:1}}>
            <div className="hstat">
              <div className="hstat-n" style={{color:"#22c55e"}}>{pakkaCount}</div>
              <div className="hstat-l">PAKKA GHAR</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{color:"#ef4444"}}>{dushmanCount}</div>
              <div className="hstat-l">DUSHMAN GHAR</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{color:"#f97316"}}>{result.takkars.length}</div>
              <div className="hstat-l">TAKKAR</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{color:"#2dd4bf"}}>{result.rins.length}</div>
              <div className="hstat-l">RIN ZONES</div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="summary-strip">📕 {result.summary}</div>

        {/* KISMAT KA GRAH BANNER */}
        <div className="kismat-bar">
          <div className="kismat-icon">{result.kismat.icon}</div>
          <div className="kismat-content">
            <div className="kismat-label">Kismat Ka Grah · House {result.kismat.house}</div>
            <div className="kismat-title serif">{result.kismat.planet} — Aapka Bhagya Grah</div>
            <div className="kismat-interp">{result.kismat.interpretation}</div>
          </div>
          <div>
            <div className="kismat-score serif" style={{color: scoreColor(result.kismat.score)}}>
              {result.kismat.score}
            </div>
            <div style={{fontSize:10,color:"#605890",textAlign:"center",marginTop:2}}>/ 95</div>
          </div>
        </div>

        {/* PITRA RIN ALERT */}
        {result.hasPitraRin && (
          <div className="pitra-alert">
            <div className="pitra-icon">⚠️</div>
            <div>
              <div className="pitra-title">Pitra Rin Detected</div>
              <div className="pitra-text">
                Aapke chart mein Pitra Rin ke indicators hain — paternal ancestral karma unresolved hai.
                Amavasya pe Pitra Tarpan karein. Kaago (kauon) ko khaana khilaen. Pita ke parivar ke sath rishta sudhaarein.
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="tabs">
          {([
            ["planets",  `Planets (${result.planets.length})`],
            ["takkar",   `Takkar (${result.takkars.length})`],
            ["rin",      `Rin (${result.rins.length})`],
            ["ages",     "Ages"],
            ["combos",   `Combos (${result.combinations.length})`],
            ["varshphal","Varshphal"],
            ["ghar",     "Ghar"],
            ["safety",   "Safety"],
          ] as [Tab,string][]).map(([t,l]) => (
            <button key={t} className={`tab ${activeTab===t?"active":""}`}
              onClick={() => setActiveTab(t)}>{l}</button>
          ))}
        </div>

        {/* ── PLANETS TAB ── */}
        {activeTab === "planets" && (
          <div className="planet-grid">
            {result.planets.map(p => (
              <div key={p.planet}
                className={`planet-card ${p.status}`}
                style={{boxShadow: expanded===p.planet ? stateGlow(p.state) : "none"}}
                onClick={() => {
                  if (expanded !== p.planet) setDomainTab("nishani");
                  setExpanded(expanded === p.planet ? null : p.planet);
                }}>

                {/* TOP ROW */}
                <div className="card-top">
                  <div className="card-left">
                    <span className="p-icon" style={{color:p.color}}>{p.icon}</span>
                    <div>
                      <div className="p-name">
                        <span className="state-dot" style={{background:stateColor(p.state)}}/>
                        {tp(p.planet)}
                      </div>
                      <div className="p-pos">{ts(p.sign)} · House {p.house}{p.retrograde?" · ℞":""}</div>
                    </div>
                  </div>
                  <div className="card-badges">
                    <div className="status-badge" style={{
                      color:p.statusColor,background:`${p.statusColor}18`,borderColor:`${p.statusColor}44`
                    }}>{p.statusLabel}</div>
                    <div className="score-badge">
                      <span style={{color:scoreColor(p.score),fontSize:12,fontWeight:700}}>{p.score}</span>
                      <div className="score-bar-wrap">
                        <div className="score-bar" style={{
                          width:`${(p.score/95)*100}%`,
                          background:scoreColor(p.score)
                        }}/>
                      </div>
                    </div>
                    <div style={{fontSize:10,color:stateColor(p.state)}}>{stateLabel(p.state)}</div>
                  </div>
                </div>

                {/* SUB-BADGES */}
                {p.retrograde && (
                  <div className="retro-badge">
                    ℞ Soyaa hua Graha — Dheeray dheeray results deta hai. Pehle obstacles, phir success.
                  </div>
                )}
                {p.enemies.length > 0 && (
                  <div className="conflict-badge">
                    ⚔️ Takkar: Isi ghar mein {p.enemies.join(", ")} bhi hai — conflict possible.
                  </div>
                )}
                {p.friends.length > 0 && (
                  <div className="friend-badge">
                    🤝 Mitra: {p.friends.join(", ")} bhi yahan hai — double positive results.
                  </div>
                )}

                {/* NISHANI (collapsed view) */}
                {expanded !== p.planet && (
                  <div className="nishani-txt">{p.nishani}</div>
                )}

                {/* TAGS */}
                <div className="tags-row">
                  <span className="tag tag-age">
                    ⏰ Age {p.actAge} ({p.actYear})
                    {p.isActNow ? " ⚡ NOW!" : p.isPast ? " ✓ Past" : " → Coming"}
                  </span>
                  {p.rin && <span className="tag tag-rin">{p.rin.split("—")[0].trim()}</span>}
                  {p.retrograde && <span className="tag tag-retro">Vakri</span>}
                </div>

                {/* EXPANDED CONTENT */}
                {expanded === p.planet && (
                  <div style={{marginTop:4}}>
                    {/* Domain sub-tabs */}
                    <div className="domain-tabs">
                      {(["nishani","career","money","marriage","health","psychology"] as DomainTab[]).map(dt => (
                        <button key={dt} className={`dtab ${domainTab===dt?"active":""}`}
                          onClick={e => { e.stopPropagation(); setDomainTab(dt); }}>
                          {dt === "nishani" ? "Nishani" :
                           dt === "career"  ? "Karya" :
                           dt === "money"   ? "Dhan" :
                           dt === "marriage"? "Vivah" :
                           dt === "health"  ? "Swasthya" : "Mansik"}
                        </button>
                      ))}
                    </div>

                    {domainTab === "nishani" && (
                      <div>
                        <div className="domain-txt">{p.nishani}</div>
                        {p.homeEnv.length > 0 && (
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,letterSpacing:"1px",textTransform:"uppercase",color:"#605890",marginBottom:4}}>Ghar ke Sanket</div>
                            <div className="home-env-list">
                              {p.homeEnv.map((s,i) => <div key={i} className="home-env-item">{s}</div>)}
                            </div>
                          </div>
                        )}
                        <div className="upaya-box" style={{marginTop:8}}>
                          <div className="upaya-title">🪬 Lal Kitab Upaya</div>
                          {p.upaya}
                        </div>
                        {p.rin && (
                          <div style={{marginTop:10,padding:"10px 12px",background:"rgba(20,184,166,0.05)",border:"1px solid rgba(20,184,166,0.15)",borderRadius:8,fontSize:12,color:"#2dd4bf",lineHeight:1.7}}>
                            <div style={{fontSize:10,color:"#0d9488",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Rin Siddhant</div>
                            {p.rin}
                          </div>
                        )}
                        {p.neverDonate.length > 0 && (
                          <div style={{marginTop:10,padding:"12px 14px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8}}>
                            <div style={{fontSize:10,color:"#ef4444",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>⚠️ Yeh Daan Na Karein — Savdhani</div>
                            <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.7,marginBottom:8}}>
                              Jab tak {p.planet} aapke liye anukool chal raha hai, yeh cheezein daan karne se is grah ki shakti kamzor pad sakti hai:
                            </div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                              {p.neverDonate.map((item,i) => (
                                <span key={i} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",color:"#fca5a5"}}>
                                  🚫 {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {domainTab === "career" && (
                      <div style={{paddingTop:4}}>
                        <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>Karya Kshetra · Career</div>
                        <div className="domain-txt">{p.career}</div>
                      </div>
                    )}

                    {domainTab === "money" && (
                      <div style={{paddingTop:4}}>
                        <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>Dhan · Money</div>
                        <div className="domain-txt" style={{color:"#fcd34d"}}>{p.money}</div>
                      </div>
                    )}

                    {domainTab === "marriage" && (
                      <div style={{paddingTop:4}}>
                        <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>Vivah · Marriage</div>
                        <div className="domain-txt" style={{color:"#f9a8d4"}}>{p.marriage}</div>
                      </div>
                    )}

                    {domainTab === "health" && (
                      <div style={{paddingTop:4}}>
                        <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>Swasthya · Health</div>
                        <div className="domain-txt" style={{color:"#86efac"}}>{p.health}</div>
                      </div>
                    )}

                    {domainTab === "psychology" && (
                      <div style={{paddingTop:4}}>
                        <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#605890",marginBottom:8}}>Mansik Swaroop · Psychology</div>
                        <div className="domain-txt" style={{color:"#c4b5fd"}}>{p.psychology}</div>
                      </div>
                    )}

                    <div style={{fontSize:11,color:"#3a3060",marginTop:10,textAlign:"right"}}>Click to collapse ↑</div>
                  </div>
                )}

                {expanded !== p.planet && (
                  <div style={{fontSize:11,color:"#3a3060",marginTop:4,textAlign:"right"}}>
                    Click for details ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TAKKAR TAB ── */}
        {activeTab === "takkar" && (
          <div>
            {result.takkars.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">✅</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,color:"#c8c0a8"}}>Koi bada Takkar nahi</div>
                <div style={{fontSize:13,marginTop:8}}>Planets ek doosre ke saath theek hain</div>
              </div>
            ) : (
              result.takkars.map((t, i) => (
                <div key={i} className={`takkar-card ${t.kind}`}>
                  <div className="takkar-title serif" style={{
                    color: t.kind === "enemy" ? "#fca5a5" : t.kind === "support" ? "#86efac" : "#fcd34d"
                  }}>
                    {t.icons[0]} {t.p1} {t.kind === "support" ? "🤝" : "⚔️"} {t.icons[1]} {t.p2}
                  </div>
                  <div className="takkar-house">
                    House {t.house} · {
                      t.kind === "enemy" ? "Shatruta — conflict active" :
                      t.kind === "support" ? "Mitra Yog — positive energy" :
                      "Jatil Yog — mixed results"
                    }
                  </div>
                  <div className="takkar-effect">{t.effect}</div>
                  {t.kind !== "support" && (
                    <div className="takkar-upaya">
                      🪬 Upaya: Dono planets ki cheezein alag alag din daan karein. Ek doosre ko neutralize karein.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── RIN TAB ── */}
        {activeTab === "rin" && (
          <div>
            <div style={{background:"rgba(249,115,22,0.05)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#c8c0a8",lineHeight:1.8}}>
              📕 <strong style={{color:"#f97316"}}>Rin Siddhant</strong> — Lal Kitab mein kuch planets ka specific houses mein hona pichle janam ka karz darshata hai. Yeh karmic debt tab tak hata nahi jab tak upaya na ho.
            </div>
            {result.rins.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🙏</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,color:"#c8c0a8"}}>Koi bada Rin Dosha nahi</div>
              </div>
            ) : (
              result.rins.map((r, i) => (
                <div key={i} className="rin-card">
                  <div className="rin-title serif">{r.icon} {r.planet} — House {r.house}</div>
                  <div className="rin-desc">{r.rin}</div>
                  <div className="rin-upaya">🪬 Nivaaran: {r.upaya}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── AGES TAB ── */}
        {activeTab === "ages" && (
          <div>
            <div style={{background:"rgba(200,160,48,0.05)",border:"1px solid rgba(200,160,48,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#c8c0a8",lineHeight:1.8}}>
              ⏰ Lal Kitab mein har planet ek specific age pe activate hota hai — us age ke aas paas us planet ke results strongest hote hain (±3 years).
            </div>
            <div className="ages-grid">
              {result.planets.map(p => {
                const col = p.isActNow ? "#f59e0b" : p.isPast ? "#22c55e" : "#60a5fa";
                return (
                  <div key={p.planet} className="age-card" style={{
                    background:`${col}11`, borderColor:`${col}44`
                  }}>
                    <div style={{fontSize:24,marginBottom:6,color:p.color}}>{p.icon}</div>
                    <div style={{fontSize:14,fontWeight:600,color:p.color}}>{p.planet}</div>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:700,color:col,lineHeight:1,margin:"6px 0"}}>
                      Age {p.actAge}
                    </div>
                    <div style={{fontSize:11,color:"#605890",marginBottom:6}}>~{p.actYear}</div>
                    <div style={{fontSize:11,fontWeight:600,color:col}}>
                      {p.isActNow ? "⚡ Active Now!" : p.isPast ? "✓ Activated" : "→ Upcoming"}
                    </div>
                    <div style={{marginTop:8,fontSize:11,color:scoreColor(p.score),fontWeight:600}}>
                      Score: {p.score}/95
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── COMBOS TAB ── */}
        {activeTab === "combos" && (
          <div>
            {result.combinations.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🔮</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,color:"#c8c0a8"}}>Koi vishesh Yoga nahi mila</div>
                <div style={{fontSize:13,marginTop:8}}>Aapke chart mein koi notable planetary combination nahi hai</div>
              </div>
            ) : (
              <>
                <div style={{background:"rgba(167,139,250,0.05)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#c8c0a8",lineHeight:1.8}}>
                  🔮 <strong style={{color:"#a78bfa"}}>Graha Yoga</strong> — Jab do ya zyada planets ek ghar mein hote hain, ek special combination banta hai jo life ko ek khaas disha deta hai.
                </div>
                {result.combinations.map((c, i) => (
                  <div key={i} className="combo-card">
                    <div className="combo-title serif">{c.title}</div>
                    <div className="combo-pred">{c.prediction}</div>
                    <div className="combo-psych">🧠 {c.psychology}</div>
                    <div className="combo-grid">
                      <div>
                        <div className="combo-col-title" style={{color:"#22c55e"}}>Shakti (Strengths)</div>
                        {c.strengths.map((s,j) => (
                          <div key={j} className="combo-list-item" style={{borderColor:"rgba(34,197,94,0.3)",color:"#86efac"}}>{s}</div>
                        ))}
                      </div>
                      <div>
                        <div className="combo-col-title" style={{color:"#ef4444"}}>Jokhim (Risks)</div>
                        {c.risks.map((r,j) => (
                          <div key={j} className="combo-list-item" style={{borderColor:"rgba(239,68,68,0.3)",color:"#fca5a5"}}>{r}</div>
                        ))}
                      </div>
                    </div>
                    <div className="combo-remedies">
                      <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#605890",marginBottom:6}}>Upaya</div>
                      <div className="remedies-list">
                        {c.remedies.map((r,j) => (
                          <div key={j} className="remedy-item">{r}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── VARSHPHAL TAB ── */}
        {activeTab === "varshphal" && (
          <div>
            <div style={{background:"rgba(96,165,250,0.05)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#c8c0a8",lineHeight:1.8}}>
              📅 <strong style={{color:"#60a5fa"}}>Varshphal</strong> — Lal Kitab mein har saal lagna ek ghar aage khisak jaata hai. Is saal ka lagna aur grahon ki position se varshik phal nikala jaata hai.
            </div>
            <div className="varsh-card">
              <div style={{display:"flex",alignItems:"flex-start",gap:20,marginBottom:20}}>
                <div>
                  <div className="varsh-year serif">{result.varshphal.year}</div>
                  <div className="varsh-lagna">
                    Varsh Lagna: {result.varshphal.lagnaSign}
                    <span style={{marginLeft:8,fontSize:11,color:"#605890"}}>
                      (Shift: +{result.varshphal.yearShift} ghar)
                    </span>
                  </div>
                </div>
              </div>
              <div className="varsh-summary">{result.varshphal.summary}</div>
              <div className="varsh-grid">
                <div className="varsh-col shubh">
                  <div className="varsh-col-title" style={{color:"#22c55e"}}>✨ Shubh Graha (Is Saal)</div>
                  {result.varshphal.shubhPlanets.length === 0
                    ? <div style={{fontSize:13,color:"#605890"}}>Koi vishesh shubh grah nahi</div>
                    : result.varshphal.shubhPlanets.map((pl,i) => (
                        <div key={i} className="varsh-planet" style={{color:"#86efac"}}>{pl}</div>
                      ))
                  }
                </div>
                <div className="varsh-col caution">
                  <div className="varsh-col-title" style={{color:"#ef4444"}}>⚠️ Savdhani (Is Saal)</div>
                  {result.varshphal.cautionPlanets.length === 0
                    ? <div style={{fontSize:13,color:"#605890"}}>Koi vishesh savdhani nahi</div>
                    : result.varshphal.cautionPlanets.map((pl,i) => (
                        <div key={i} className="varsh-planet" style={{color:"#fca5a5"}}>{pl}</div>
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── GHAR TAB ── */}
        {activeTab === "ghar" && (
          <div>
            <div style={{background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#c8c0a8",lineHeight:1.8}}>
              🏠 <strong style={{color:"#22c55e"}}>Ghar Ke Sanket</strong> — Lal Kitab mein ghar ke har hisse ka ek khaas grah se sambandh hota hai. Jis ghar mein grah hain, us zone ki cheezein aur halat seedhe us grah ke results ko prabhavit karti hain.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
              {result.houseOmens.map(h => {
                const occupied = h.planets.length > 0;
                return (
                  <div key={h.house} style={{
                    borderRadius:14,padding:"16px 18px",
                    background: occupied ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${occupied ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`,
                    transition:"border-color 0.2s"
                  }}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:8,background:"rgba(200,160,48,0.1)",border:"1px solid rgba(200,160,48,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#c8a030"}}>
                          {h.house}
                        </div>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:"#f0e8d0"}}>House {h.house}</div>
                          <div style={{fontSize:10,color:"#605890",marginTop:1}}>{h.zone}</div>
                        </div>
                      </div>
                      {occupied && (
                        <div style={{display:"flex",gap:4}}>
                          {h.planets.map((pl,i) => (
                            <span key={pl} style={{fontSize:16,color:h.planetColors[i]}}>{h.planetIcons[i]}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{fontSize:12,color:"#a78bfa",marginBottom:8,fontStyle:"italic"}}>{h.meaning}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {h.signs.map((s,i) => (
                        <span key={i} style={{fontSize:11,padding:"3px 9px",borderRadius:20,background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.18)",color:"#c8c0a8"}}>
                          {s}
                        </span>
                      ))}
                    </div>
                    {occupied && (
                      <div style={{marginTop:10,fontSize:11,color:"#22c55e",padding:"6px 8px",background:"rgba(34,197,94,0.05)",borderRadius:6}}>
                        ⚡ {h.planets.join(" + ")} yahan hai — is zone ki cheezein seedha prabhavit hoti hain
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SAFETY TAB ── */}
        {activeTab === "safety" && (
          <div>
            <div className="safety-card" style={{background:"rgba(96,165,250,0.05)",borderColor:"rgba(96,165,250,0.18)"}}>
              <div className="safety-title">Advanced Lal Kitab Safety Layer</div>
              <div className="safety-text">{advancedResult.narrative}</div>
              <div style={{fontSize:11,color:"#60a5fa",marginTop:10}}>{advancedResult.system}</div>
            </div>

            {advancedResult.kismatKaGrah && (
              <div className="safety-card" style={{background:"rgba(200,160,48,0.06)",borderColor:"rgba(200,160,48,0.24)"}}>
                <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#c8a030",marginBottom:5}}>Safe Kismat Ka Grah</div>
                <div className="safety-title">
                  {advancedResult.kismatKaGrah.planet} · House {advancedResult.kismatKaGrah.house} · Score {advancedResult.kismatKaGrah.finalScore}
                </div>
                <div className="safety-text">{advancedResult.kismatKaGrah.explanation}</div>
              </div>
            )}

            <div className="safety-card">
              <div className="safety-title">Planet Support Status</div>
              <div className="safety-text">
                Remedies should preserve supportive planets and use soft behavioral correction before donation, metals, gemstones, or intense ritual practices.
              </div>
              <div className="support-grid">
                {advancedResult.planetSupport.map((p) => {
                  const color = p.status === "supportive" ? "#22c55e" : p.status === "mixed_supportive" ? "#f59e0b" : "#ef4444";
                  const label = p.status === "supportive" ? "Supportive" : p.status === "mixed_supportive" ? "Mixed" : "Careful";
                  return (
                    <div key={p.planet} className="support-card" style={{borderColor:`${color}44`}}>
                      <div className="support-top">
                        <div>
                          <div className="support-name">{p.planet} · H{p.house}</div>
                          <div style={{fontSize:10,color:"#605890",marginTop:2}}>
                            {p.isPakkaHouse ? "Pakka house" : p.isSupportiveHouse ? "Supportive house" : p.isChallengeHouse ? "Challenge house" : "Neutral house"}
                          </div>
                        </div>
                        <div className="support-score" style={{color}}>{p.score}</div>
                      </div>
                      <span className="safety-pill" style={{color,background:`${color}12`,borderColor:`${color}44`}}>{label}</span>
                      <div style={{fontSize:12,color:"#c8c0a8",lineHeight:1.65,marginTop:9}}>{p.explanation}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="safety-card">
              <div className="safety-title">Sensitive Indicators</div>
              {advancedResult.lifeAreaIndicators.length === 0 ? (
                <div className="safety-text">No major sensitive life-area indicator was triggered in this safety pass.</div>
              ) : (
                <div className="indicator-grid">
                  {advancedResult.lifeAreaIndicators.map((indicator) => (
                    <div key={indicator.id} className="indicator-card">
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:8}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#fdba74",textTransform:"capitalize"}}>
                          {indicator.category.replaceAll("_", " ")}
                        </div>
                        <span className="safety-pill" style={{
                          color: indicator.sensitivity === "sensitive" ? "#ef4444" : "#f59e0b",
                          background:"rgba(249,115,22,0.08)",
                          borderColor:"rgba(249,115,22,0.25)"
                        }}>
                          {indicator.sourceStatus}
                        </span>
                      </div>
                      <div className="safety-text">{indicator.interpretation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="safety-card" style={{background:"rgba(34,197,94,0.04)",borderColor:"rgba(34,197,94,0.18)"}}>
              <div className="safety-title">{advancedResult.remedySafety.title}</div>
              <div className="safety-text">{advancedResult.remedySafety.priority}</div>
              <div className="safety-text" style={{marginTop:8}}>{advancedResult.remedySafety.safestPractices}</div>
              <div className="safety-text" style={{marginTop:8,color:"#fcd34d"}}>{advancedResult.remedySafety.donationGuidance}</div>
              <div className="safety-text" style={{marginTop:8,color:"#fca5a5"}}>{advancedResult.remedySafety.highCaution}</div>

              {advancedResult.remedySafety.neverDonateGuidance.map((guidance) => (
                <div key={guidance.planet} style={{marginTop:14,padding:"12px 14px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#fca5a5",marginBottom:7}}>
                    Never donate casually: {guidance.planet} items
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    {guidance.items.map((item) => (
                      <span key={item} className="safety-pill" style={{color:"#fca5a5",background:"rgba(239,68,68,0.08)",borderColor:"rgba(239,68,68,0.25)"}}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="safety-text">{guidance.explanation}</div>
                </div>
              ))}
            </div>

            <div className="safety-card">
              <div className="safety-title">{advancedResult.remedySafety.fortyThreeDayProtocol.title}</div>
              <div className="safety-text">{advancedResult.remedySafety.fortyThreeDayProtocol.description}</div>
              <div className="safety-text" style={{marginTop:8,color:"#93c5fd"}}>{advancedResult.remedySafety.fortyThreeDayProtocol.userGuidance}</div>
              <div className="protocol-list">
                {advancedResult.remedySafety.fortyThreeDayProtocol.rules.map((rule) => (
                  <div key={rule} className="protocol-item">{rule}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        </PremiumFeature>
      </div>
    </>
  );
}
