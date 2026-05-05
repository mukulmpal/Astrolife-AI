"use client";
import { useState } from "react";
import { calculateLalKitab } from "@/lib/astro-engine/lalkitab";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";

export default function LalKitabPage() {
  const [activeTab, setActiveTab] = useState<"planets"|"takkar"|"rin"|"ages">("planets");
  const [expanded, setExpanded] = useState<string|null>(null);
  const { birth, chart } = useUserChart();
  const result = calculateLalKitab(chart.planets as never, birth.dob);

  const pakkaCount   = result.planets.filter(p=>p.status==="pakka").length;
  const dushmanCount = result.planets.filter(p=>p.status==="dushman").length;
  const currentAge   = new Date().getFullYear() - new Date(birth.dob).getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}

        .page{max-width:1200px;margin:0 auto;padding:32px}
        .page-tag{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#ef4444;margin-bottom:8px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;color:#f0e8d0;line-height:1.1}
        .page-title em{font-style:italic;color:#ef4444}
        .page-sub{font-size:14px;color:#605890;margin-top:6px;margin-bottom:28px}

        /* HEADER */
        .header-card{background:linear-gradient(135deg,#1a0808,#2a0a0a);border:1px solid rgba(239,68,68,0.25);border-radius:20px;padding:28px 32px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;position:relative;overflow:hidden}
        .header-orb{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,0.08) 0%,transparent 70%);right:-60px;top:-60px;pointer-events:none}
        .header-name{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#f0e8d0}
        .header-stats{display:flex;gap:12px;flex-wrap:wrap}
        .hstat{text-align:center;background:rgba(0,0,0,0.3);border-radius:12px;padding:12px 16px;border:1px solid rgba(239,68,68,0.15);min-width:90px}
        .hstat-n{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;line-height:1}
        .hstat-l{font-size:10px;color:#605890;margin-top:4px;letter-spacing:0.5px}

        /* SUMMARY */
        .summary-strip{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:12px;padding:14px 20px;margin-bottom:24px;font-size:13px;color:#c8c0a8;line-height:1.7}

        /* PITRA RIN ALERT */
        .pitra-alert{background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.3);border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:flex-start;gap:12px}
        .pitra-icon{font-size:24px;flex-shrink:0}
        .pitra-text{font-size:13px;color:#fdba74;line-height:1.7}
        .pitra-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#f97316;margin-bottom:4px}

        /* TABS */
        .tabs{display:flex;gap:4px;background:#0a0720;border:1px solid #1c1840;border-radius:12px;padding:4px;width:fit-content;margin-bottom:24px;flex-wrap:wrap}
        .tab{padding:8px 18px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;color:#605890;border:none;background:none;font-family:'Outfit',sans-serif}
        .tab.active{background:#1c1840;color:#c8c0a8}

        /* PLANET GRID */
        .planet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}

        /* PLANET CARD */
        .planet-card{border-radius:14px;padding:18px;cursor:pointer;transition:all 0.25s;border:1px solid}
        .planet-card.pakka{background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.2)}
        .planet-card.pakka:hover{border-color:rgba(34,197,94,0.4);transform:translateY(-2px)}
        .planet-card.dushman{background:rgba(239,68,68,0.04);border-color:rgba(239,68,68,0.2)}
        .planet-card.dushman:hover{border-color:rgba(239,68,68,0.4);transform:translateY(-2px)}
        .planet-card.sadharan{background:#0d0a22;border-color:rgba(245,158,11,0.2)}
        .planet-card.sadharan:hover{border-color:rgba(245,158,11,0.4);transform:translateY(-2px)}

        /* CARD TOP */
        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .card-left{display:flex;align-items:center;gap:10px}
        .p-icon{font-size:22px}
        .p-name{font-size:15px;font-weight:600;color:#f0e8d0}
        .p-pos{font-size:11px;color:#605890;margin-top:2px}
        .status-badge{font-size:10px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid}

        /* RETRO / CONFLICT BADGES */
        .retro-badge{background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:8px;padding:6px 10px;font-size:11px;color:#fdba74;margin-bottom:8px;line-height:1.6}
        .conflict-badge{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:6px 10px;font-size:11px;color:#fca5a5;margin-bottom:8px;line-height:1.6}
        .friend-badge{background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:8px;padding:6px 10px;font-size:11px;color:#86efac;margin-bottom:8px;line-height:1.6}

        /* NISHANI */
        .nishani-txt{font-size:13px;color:#c8c0a8;line-height:1.8;margin-bottom:10px}

        /* TAGS ROW */
        .tags-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
        .tag{font-size:10px;padding:3px 10px;border-radius:20px;white-space:nowrap}
        .tag-age{background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.2);color:#c8a030}
        .tag-rin{background:rgba(20,184,166,0.08);border:1px solid rgba(20,184,166,0.2);color:#2dd4bf}
        .tag-retro{background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);color:#f97316}

        /* UPAYA BOX */
        .upaya-box{background:rgba(0,0,0,0.3);border:1px solid rgba(249,115,22,0.2);border-radius:8px;padding:10px 12px;font-size:12px;color:#c8c0a8;line-height:1.7}
        .upaya-title{font-size:10px;color:#f97316;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px}

        /* TAKKAR */
        .takkar-card{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);border-radius:14px;padding:18px;margin-bottom:12px;transition:border-color 0.2s}
        .takkar-card:hover{border-color:rgba(239,68,68,0.4)}
        .takkar-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#fca5a5;margin-bottom:8px}
        .takkar-house{font-size:11px;color:#605890;margin-bottom:8px}
        .takkar-effect{font-size:13px;color:#c8c0a8;line-height:1.7;margin-bottom:10px}
        .takkar-upaya{font-size:12px;color:#f97316;padding:8px 10px;background:rgba(249,115,22,0.05);border-radius:8px;border:1px solid rgba(249,115,22,0.15)}

        /* RIN */
        .rin-card{background:rgba(249,115,22,0.04);border:1px solid rgba(249,115,22,0.2);border-radius:14px;padding:18px;margin-bottom:12px}
        .rin-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#fdba74;margin-bottom:6px}
        .rin-desc{font-size:13px;color:#c8c0a8;line-height:1.7;margin-bottom:8px}
        .rin-upaya{font-size:12px;color:#f97316;padding:8px 10px;background:rgba(249,115,22,0.05);border-radius:8px;border:1px solid rgba(249,115,22,0.15)}

        /* AGES */
        .ages-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
        .age-card{border-radius:14px;padding:18px;text-align:center;border:1px solid;transition:all 0.2s}
        .age-card:hover{transform:translateY(-3px)}

        /* EMPTY STATE */
        .empty{text-align:center;padding:48px 20px;color:#605890}
        .empty-icon{font-size:48px;margin-bottom:12px}

        @media(max-width:768px){
          .page{padding:20px}
          .planet-grid{grid-template-columns:1fr}
          .header-card{flex-direction:column}
          .tabs{gap:2px}
          .tab{padding:6px 12px;font-size:12px}
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="page-tag">📕 Lal Kitab System</div>
        <h1 className="page-title serif">Lal Kitab <em>Analysis</em></h1>
        <p className="page-sub">Pakka Ghar · Dushman Ghar · Nishaniyan · Upaya · Takkar · Rin Siddhant</p>
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
          {[
            ["planets",`Planets (${result.planets.length})`],
            ["takkar", `Takkar (${result.takkars.length})`],
            ["rin",    `Rin (${result.rins.length})`],
            ["ages",   "Activation Ages"],
          ].map(([t,l])=>(
            <button key={t} className={`tab ${activeTab===t?"active":""}`}
              onClick={()=>setActiveTab(t as never)}>{l}</button>
          ))}
        </div>

        {/* ── PLANETS TAB ── */}
        {activeTab==="planets" && (
          <div className="planet-grid">
            {result.planets.map(p=>(
              <div key={p.planet}
                className={`planet-card ${p.status}`}
                onClick={()=>setExpanded(expanded===p.planet?null:p.planet)}>

                {/* TOP */}
                <div className="card-top">
                  <div className="card-left">
                    <span className="p-icon" style={{color:p.color}}>{p.icon}</span>
                    <div>
                      <div className="p-name">{p.planet}</div>
                      <div className="p-pos">{p.sign} · House {p.house}{p.retrograde?" · ℞ Soyaa hua":""}</div>
                    </div>
                  </div>
                  <div className="status-badge" style={{
                    color:p.statusColor,
                    background:`${p.statusColor}18`,
                    borderColor:`${p.statusColor}44`
                  }}>{p.statusLabel}</div>
                </div>

                {/* Conflict / friend badges */}
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

                {/* Nishani */}
                <div className="nishani-txt">{p.nishani}</div>

                {/* Tags */}
                <div className="tags-row">
                  <span className="tag tag-age">
                    ⏰ Active ~age {p.actAge} ({p.actYear})
                    {p.isActNow ? " ⚡ NOW!" : p.isPast ? " ✓ Past" : " → Coming"}
                  </span>
                  {p.rin && <span className="tag tag-rin">{p.rin.split("—")[0].trim()}</span>}
                  {p.retrograde && <span className="tag tag-retro">Vakri</span>}
                </div>

                {/* Upaya */}
                {expanded===p.planet && (
                  <div style={{marginTop:12,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:12}}>
                    <div className="upaya-box">
                      <div className="upaya-title">🪬 Lal Kitab Upaya</div>
                      {p.upaya}
                    </div>
                    {p.rin && (
                      <div style={{marginTop:10,padding:"10px 12px",background:"rgba(20,184,166,0.05)",border:"1px solid rgba(20,184,166,0.15)",borderRadius:8,fontSize:12,color:"#2dd4bf",lineHeight:1.7}}>
                        <div style={{fontSize:10,color:"#0d9488",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Rin Siddhant</div>
                        {p.rin}
                      </div>
                    )}
                    <div style={{fontSize:11,color:"#3a3060",marginTop:8,textAlign:"right"}}>Click to collapse ↑</div>
                  </div>
                )}

                {!expanded && (
                  <div style={{fontSize:11,color:"#3a3060",marginTop:8,textAlign:"right"}}>
                    Click for upaya ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TAKKAR TAB ── */}
        {activeTab==="takkar" && (
          <div>
            {result.takkars.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">✅</div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,color:"#c8c0a8"}}>Koi bada Takkar nahi</div>
                <div style={{fontSize:13,marginTop:8}}>Planets ek doosre ke saath theek hain</div>
              </div>
            ) : (
              result.takkars.map((t,i)=>(
                <div key={i} className="takkar-card">
                  <div className="takkar-title serif">
                    {t.icons[0]} {t.p1} ⚔️ {t.icons[1]} {t.p2}
                  </div>
                  <div className="takkar-house">House {t.house} mein dono planets saath hain</div>
                  <div className="takkar-effect">{t.effect}</div>
                  <div className="takkar-upaya">
                    🪬 Upaya: Dono planets ki cheezein alag alag din daan karein. Ek doosre ko neutralize karein.
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── RIN TAB ── */}
        {activeTab==="rin" && (
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
              result.rins.map((r,i)=>(
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
        {activeTab==="ages" && (
          <div>
            <div style={{background:"rgba(200,160,48,0.05)",border:"1px solid rgba(200,160,48,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:13,color:"#c8c0a8",lineHeight:1.8}}>
              ⏰ Lal Kitab mein har planet ek specific age pe activate hota hai — us age ke aas paas us planet ke results strongest hote hain (±3 years).
            </div>
            <div className="ages-grid">
              {result.planets.map(p=>{
                const col = p.isActNow?"#f59e0b":p.isPast?"#22c55e":"#60a5fa";
                return (
                  <div key={p.planet} className="age-card" style={{
                    background:`${col}11`,
                    borderColor:`${col}44`
                  }}>
                    <div style={{fontSize:24,marginBottom:6,color:p.color}}>{p.icon}</div>
                    <div style={{fontSize:14,fontWeight:600,color:p.color}}>{p.planet}</div>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:700,color:col,lineHeight:1,margin:"6px 0"}}>
                      Age {p.actAge}
                    </div>
                    <div style={{fontSize:11,color:"#605890",marginBottom:6}}>~{p.actYear}</div>
                    <div style={{fontSize:11,fontWeight:600,color:col}}>
                      {p.isActNow?"⚡ Active Now!":p.isPast?"✓ Activated":"→ Upcoming"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </PremiumFeature>
      </div>
    </>
  );
}
