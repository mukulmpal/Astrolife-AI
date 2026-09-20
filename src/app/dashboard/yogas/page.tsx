"use client";
import { useEffect, useState } from "react";
import { detectYogas, calculateYogaScore, CATEGORY_META, type YogaResult, type YogaCategory, type PlanTier } from "@/lib/astro-engine/yogas";
import { useUserChart } from "@/lib/user-chart";
import { isFullAccessEnabled, isEliteEmail, normalizeTier } from "@/lib/access";
import { createClient } from "@/lib/supabase/client";
import { EngineHeader, EngineShell, EngineTrustPanel } from "@/components/engine/EngineShell";
import { useLanguage } from "@/lib/language-context";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";

// Planet name abbreviations
const PLANET_ABBR: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke'
};

export default function YogasPage() {
  const { birth, chart } = useUserChart();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all"|"present"|"doshas">("present");
  const [activeCategory, setActiveCategory] = useState<YogaCategory|"All">("All");
  const [expandedYoga, setExpandedYoga] = useState<string|null>(null);
  const [userTier, setUserTier] = useState<PlanTier>(() => isFullAccessEnabled() ? "elite" : "free");
  const [tierLoaded, setTierLoaded] = useState(false);

  useEffect(() => {
    if (isFullAccessEnabled()) {
      setUserTier("elite");
      setTierLoaded(true);
      return;
    }

    const loadTier = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user) {
          setTierLoaded(true);
          return;
        }

        const isElite = (user.email && isEliteEmail(user.email)) ||
          (user as any).app_metadata?.subscription_tier === "elite" ||
          (user as any).user_metadata?.subscription_tier === "elite";

        if (isElite) {
          setUserTier("elite");
          setTierLoaded(true);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();

        const effective = normalizeTier(profile?.subscription_tier, user.email);
        setUserTier(effective as PlanTier);
      } catch (err) {
        console.warn("Failed to load user tier in yogas page:", err);
      } finally {
        setTierLoaded(true);
      }
    };

    loadTier();
  }, []);

  // Early return: empty state if no chart
  if (!birth.name || !chart?.planets) {
    const intro = engineIntros['yogas'];
    return <EngineEmptyState engineName={intro.title} whatItAnalyzes={intro.whatItAnalyzes} />;
  }
  let yogas: YogaResult[] = [];
  try {
    yogas = detectYogas(chart.planets as never, chart.lagnaNum, userTier);
  } catch(e) {
    console.error(e);
  }

  const present  = yogas.filter(y=>y.present&&!y.isDosha);
  const doshas   = yogas.filter(y=>y.present&&y.isDosha);
  const all      = yogas.filter(y=>!y.isDosha);
  const score = calculateYogaScore(present);

  const displayList = activeTab==="doshas" ? doshas :
                      activeTab==="present" ? present : all;

  const filtered = activeCategory==="All" ? displayList
    : displayList.filter(y=>y.category===activeCategory);

  const categories = ["All",...new Set(displayList.map(y=>y.category))] as (YogaCategory|"All")[];

  const tierColor = (t: PlanTier) =>
    t==="free"?"#1d9e75":t==="premium"?"#c8a030":"#a855f7";

  const strengthBar = (score: number) => {
    const w = Math.min(score,100);
    const c = score>=80?"#c8a030":score>=60?"#1d9e75":score>=40?"#60a5fa":"#605890";
    return `linear-gradient(90deg,${c} ${w}%,#1c1840 ${w}%)`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:var(--app-bg,#060410);color:var(--app-fg,#f0e8d0);font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--app-bg,#060410)}::-webkit-scrollbar-thumb{background:var(--al-gold,#c8a030);border-radius:2px}

        .page{max-width:1200px;margin:0 auto;padding:32px}

        /* HEADER */
        .page-tag{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--al-gold,#c8a030);margin-bottom:8px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;color:var(--app-fg,#f0e8d0);line-height:1.1}
        .page-title em{font-style:italic;color:var(--al-gold,#c8a030)}
        .page-sub{font-size:14px;color:var(--app-soft,#605890);margin-top:6px;margin-bottom:28px}

        /* SCORE CARD */
        .score-card{background:linear-gradient(135deg,var(--app-card,#0f0c28),var(--app-card-alt,#1a1040));border:1px solid var(--app-border,rgba(200,160,48,0.25));border-radius:20px;padding:28px 32px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;position:relative;overflow:hidden}
        .score-orb{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(200,160,48,0.08) 0%,transparent 70%);right:-60px;top:-60px;pointer-events:none}
        .score-left{position:relative;z-index:1}
        .score-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--app-soft,#605890);margin-bottom:8px}
        .score-name{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--app-fg,#f0e8d0);margin-bottom:4px}
        .score-meta{font-size:13px;color:var(--app-soft,#605890)}
        .score-right{display:flex;gap:20px;align-items:center;flex-wrap:wrap;position:relative;z-index:1}
        .score-stat{text-align:center;background:var(--app-card-alt,rgba(0,0,0,0.2));border-radius:14px;padding:16px 20px;border:1px solid var(--app-border,rgba(200,160,48,0.1))}
        .score-n{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--al-gold,#c8a030);line-height:1}
        .score-l{font-size:11px;color:var(--app-soft,#605890);margin-top:4px;letter-spacing:0.5px}
        .score-rating{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--al-gold,#e8c060);margin-top:4px}

        /* STAT ROW */
        .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .stat-card{background:var(--app-card,#0d0a22);border:1px solid var(--app-border,#1c1840);border-radius:14px;padding:18px;text-align:center;transition:all 0.2s;color:var(--app-fg,#f0e8d0)}
        .stat-card:hover{border-color:var(--app-border-strong,rgba(200,160,48,0.25));transform:translateY(-1px)}
        .stat-icon{font-size:24px;margin-bottom:8px}
        .stat-n{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1;margin-bottom:4px}
        .stat-l{font-size:11px;color:var(--app-soft,#605890)}

        /* TABS */
        .tabs{display:flex;gap:4px;background:var(--app-card-alt,#0a0720);border:1px solid var(--app-border,#1c1840);border-radius:12px;padding:4px;width:fit-content;margin-bottom:20px}
        .tab{padding:8px 20px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;color:var(--app-soft,#605890);border:none;background:none;font-family:'Outfit',sans-serif}
        .tab.active{background:var(--app-card,#1c1840);color:var(--app-fg,#c8c0a8)}

        /* CATEGORY FILTERS */
        .cat-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
        .cat-btn{padding:6px 14px;border-radius:100px;font-size:12px;cursor:pointer;transition:all 0.2s;border:1px solid var(--app-border,#1c1840);background:transparent;color:var(--app-soft,#605890);font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:6px}
        .cat-btn:hover{border-color:rgba(200,160,48,0.3);color:var(--app-fg,#c8c0a8)}
        .cat-btn.active{background:rgba(200,160,48,0.1);border-color:rgba(200,160,48,0.35);color:var(--al-gold,#c8a030)}

        /* YOGA GRID */
        .yoga-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}

        /* YOGA CARD */
        .yoga-card{background:var(--app-card,#0d0a22);border:1px solid var(--app-border,#1c1840);border-radius:16px;padding:20px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;color:var(--app-fg,#f0e8d0)}
        .yoga-card:hover{border-color:var(--app-border-strong,rgba(200,160,48,0.25));transform:translateY(-2px)}
        .yoga-card.present{border-color:rgba(200,160,48,0.25)}
        .yoga-card.dosha{border-color:rgba(239,68,68,0.2)}
        .yoga-card.dosha:hover{border-color:rgba(239,68,68,0.4)}
        .yoga-card.locked{opacity:0.6}
        .yoga-card.expanded{border-color:rgba(200,160,48,0.4)}

        .yoga-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
        .yoga-category{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--app-soft,#605890);margin-bottom:4px}
        .yoga-name{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--app-fg,#f0e8d0);line-height:1.2}
        .yoga-name.dosha-name{color:#fb7185}
        .yoga-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}

        .present-badge{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(200,160,48,0.1);color:var(--al-gold,#c8a030);border:1px solid rgba(200,160,48,0.2);white-space:nowrap}
        .dosha-badge{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(239,68,68,0.1);color:#fb7185;border:1px solid rgba(239,68,68,0.2);white-space:nowrap}
        .locked-badge{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(96,88,144,0.15);color:var(--app-soft,#605890);border:1px solid var(--app-border,#1c1840);white-space:nowrap}
        .rare-badge{font-size:9px;padding:2px 8px;border-radius:20px;background:rgba(168,85,247,0.1);color:#a855f7;border:1px solid rgba(168,85,247,0.2)}

        /* STRENGTH BAR */
        .strength-wrap{margin-bottom:10px}
        .strength-label{display:flex;justify-content:space-between;font-size:10px;color:var(--app-soft,#605890);margin-bottom:4px}
        .strength-bar{height:3px;border-radius:2px}

        .yoga-desc{font-size:13px;color:var(--app-soft,#605890);line-height:1.7;margin-bottom:10px}

        /* EXPANDED */
        .yoga-expanded{border-top:1px solid var(--app-border,#1c1840);margin-top:12px;padding-top:12px}
        .expand-section{margin-bottom:12px}
        .expand-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--al-gold,#c8a030);margin-bottom:6px}
        .expand-text{font-size:13px;color:var(--app-fg,#c8c0a8);line-height:1.8}
        .remedy-box{background:rgba(200,160,48,0.05);border:1px solid rgba(200,160,48,0.15);border-radius:10px;padding:12px;font-size:13px;color:var(--app-fg,#c8c0a8);line-height:1.8}
        .planets-row{display:flex;gap:8px;flex-wrap:wrap}
        .planet-pill{font-size:11px;padding:3px 10px;border-radius:20px;background:var(--app-card-alt,#0a0720);border:1px solid var(--app-border,#1c1840);color:var(--app-fg,#c8c0a8)}

        /* LOCK OVERLAY */
        .lock-overlay{position:absolute;inset:0;background:rgba(6,4,16,0.85);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-radius:16px}
        .lock-icon{font-size:24px}
        .lock-text{font-size:12px;color:var(--app-fg,#c8c0a8)}
        .lock-btn{background:linear-gradient(135deg,var(--al-gold,#c8a030),#a07820);color:#060410;border:none;border-radius:8px;padding:7px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif}

        /* UPGRADE BANNER */
        .upgrade{background:linear-gradient(135deg,rgba(60,40,128,0.3),rgba(200,160,48,0.08));border:1px solid var(--app-border,rgba(200,160,48,0.2));border-radius:16px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
        .upgrade-btn{background:linear-gradient(135deg,var(--al-gold,#c8a030),#a07820);color:#060410;border:none;border-radius:10px;padding:10px 24px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;text-decoration:none;display:inline-block}
        .upgrade-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}

        /* EMPTY */
        .empty{text-align:center;padding:60px 20px;color:var(--app-soft,#605890)}
        .empty-icon{font-size:48px;margin-bottom:16px}
        .empty-text{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--app-fg,#c8c0a8);margin-bottom:8px}

        /* LOADING */
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:48px;height:48px;border:2px solid var(--app-border,#1c1840);border-top-color:var(--al-gold,#c8a030);border-radius:50%;animation:spin 1s linear infinite;margin:60px auto 20px}

        @media(max-width:768px){
          .page{padding:20px}
          .stat-row{grid-template-columns:1fr 1fr}
          .yoga-grid{grid-template-columns:1fr}
          .score-card{flex-direction:column}
        }
      `}</style>

      <EngineShell>
        <EngineHeader
          eyebrow={t("yogas.page_tag")}
          title={t("yogas.page_title")}
          subtitle="120 yogas analyzed - Pancha Mahapurusha, Raja, Dhana, Marriage, Career and Doshas."
          icon="✦"
          confidence={{
            value: "High",
            detail: "Uses saved birth chart placements; delivery depends on strength, dasha and transit activation.",
          }}
          metrics={[
            { label: "Yoga Score", value: score.total },
            { label: "Present", value: present.length, tone: "green" },
            { label: "Doshas", value: doshas.length, tone: "red" },
            { label: "Rare Yogas", value: score.rareCount, tone: "violet" },
          ]}
        />

        <EngineTrustPanel
          confidence="High"
          dataUsed={["Saved birth chart", "Planetary placements", "Lagna", "Yoga rules", "Plan tier visibility"]}
          caveat="A present yoga shows a chart pattern. Its actual delivery should be judged with Shadbala, Dasha, Ashtakavarga and real-life context."
        />

        {(() => {
          const intro = engineIntros['yogas'];
          return <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />;
        })()}

        <>
            <div className="summary-strip">
              ✦ Yoga Analysis for <strong>{birth.name}</strong> - {new Date(birth.dob).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} - {birth.tob} - {birth.city}. Current rating: <span style={{color:"#c8a030"}}>{score.rating}</span>.
            </div>

            {/* STAT ROW */}
            <div className="stat-row">
              {Object.entries(CATEGORY_META).slice(0,4).map(([cat,meta]) => {
                const count = present.filter(y=>y.category===cat).length;
                return (
                  <div key={cat} className="stat-card" onClick={()=>setActiveCategory(cat as YogaCategory)} style={{cursor:"pointer"}}>
                    <div className="stat-icon">{meta.icon}</div>
                    <div className="stat-n" style={{color:meta.color}}>{count}</div>
                    <div className="stat-l">{cat}</div>
                  </div>
                );
              })}
            </div>

            {/* UPGRADE BANNER */}
            {tierLoaded && userTier === "free" && yogas.some(y=>y.locked) && (
              <div className="upgrade">
                <div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,color:"#f0e8d0",marginBottom:4}}>
                    Unlock All {yogas.filter(y=>y.locked).length} Hidden Yogas ✦
                  </div>
                  <div style={{fontSize:13,color:"#605890"}}>
                    You&apos;re seeing {present.length + doshas.length} yogas. Upgrade to reveal all 120 yogas with detailed analysis and remedies.
                  </div>
                </div>
                <a href="/dashboard/upgrade" className="upgrade-btn">Upgrade to Premium →</a>
              </div>
            )}

            {/* TABS */}
            <div className="tabs">
              {([["present","✦ Present Yogas"],["doshas","⚠️ Doshas"],["all","All Yogas"]] as const).map(([t,label])=>(
                <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>{setActiveTab(t);setActiveCategory("All")}}>
                  {label} {t==="present"?`(${present.length})`:t==="doshas"?`(${doshas.length})`:`(${all.length})`}
                </button>
              ))}
            </div>

            {/* CATEGORY FILTERS */}
            <div className="cat-filters">
              {categories.map(cat => {
                const meta = cat==="All" ? {icon:"✦",color:"#c8a030"} : CATEGORY_META[cat as YogaCategory];
                return (
                  <button key={cat} className={`cat-btn ${activeCategory===cat?"active":""}`}
                    onClick={()=>setActiveCategory(cat)}>
                    <span>{meta?.icon}</span>
                    {cat==="All"?"All Categories":cat}
                  </button>
                );
              })}
            </div>

            {/* YOGA GRID */}
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">{activeTab==="doshas"?"🙏":"✦"}</div>
                <div className="empty-text serif">
                  {activeTab==="doshas" ? "No doshas detected in this category" : "No yogas in this category"}
                </div>
                <div style={{fontSize:13,marginTop:8}}>Try selecting a different category</div>
              </div>
            ) : (
              <div className="yoga-grid">
                {filtered.map((y,i) => (
                  <div
                    key={i}
                    className={`yoga-card ${y.present?"present":""} ${y.isDosha?"dosha":""} ${y.locked?"locked":""} ${expandedYoga===y.name?"expanded":""}`}
                    onClick={() => !y.locked && setExpandedYoga(expandedYoga===y.name?null:y.name)}
                  >
                    {/* LOCK OVERLAY */}
                    {y.locked && (
                      <div className="lock-overlay">
                        <div className="lock-icon">🔒</div>
                        <div className="lock-text">{y.tier==="premium"?"Premium":"Elite"} Feature</div>
                        <a href="/dashboard/upgrade"><button className="lock-btn">Unlock →</button></a>
                      </div>
                    )}

                    {/* TOP ROW */}
                    <div className="yoga-top">
                      <div>
                        <div className="yoga-category">{CATEGORY_META[y.category]?.icon} {y.category}</div>
                        <div className={`yoga-name ${y.isDosha?"dosha-name":""} serif`}>{y.name}</div>
                      </div>
                      <div className="yoga-right">
                        {y.present && !y.isDosha && <div className="present-badge">✦ Present</div>}
                        {y.present && y.isDosha && <div className="dosha-badge">⚠️ Active</div>}
                        {y.rare && <div className="rare-badge">Rare</div>}
                        <div style={{fontSize:10,color:tierColor(y.tier),border:`1px solid ${tierColor(y.tier)}33`,borderRadius:20,padding:"2px 8px"}}>
                          {y.tier.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* STRENGTH BAR */}
                    <div className="strength-wrap">
                      <div className="strength-label">
                        <span>Strength</span>
                        <span>{y.score}%</span>
                      </div>
                      <div className="strength-bar" style={{background:strengthBar(y.score)}} />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="yoga-desc">{y.description}</div>

                    {/* PLANETS */}
                    {y.planets.length > 0 && (
                      <div className="planets-row">
                        {y.planets.map(p => <span key={p} className="planet-pill">{PLANET_ABBR[p] || p}</span>)}
                      </div>
                    )}

                    {/* EXPANDED */}
                    {expandedYoga === y.name && !y.locked && (
                      <div className="yoga-expanded">
                        <div className="expand-section">
                          <div className="expand-label">Life Impact</div>
                          <div className="expand-text">{y.impact}</div>
                        </div>
                        {y.remedy && (
                          <div className="expand-section">
                            <div className="expand-label">✦ Remedies</div>
                            <div className="remedy-box">{y.remedy}</div>
                          </div>
                        )}
                        <div style={{fontSize:11,color:"#3a3060",marginTop:8,textAlign:"right"}}>
                          Click to collapse
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </>
      </EngineShell>
    </>
  );
}
