"use client";
import { useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import "@/app/dashboard/shared.css";
import {
  calculateDivisional,
  getChartAnalysis,
  getSpecialFindings,
  type DivChart,
} from "@/lib/astro-engine/divisional";
import {
  buildMarriageDivisionalIntelligence,
  buildShodashvargaMarriageWisdom,
} from "@/lib/astro-engine/marriage-intelligence-v2";
import {
  analyzeUniversalShodashaVarga,
  extractDashaInput,
  formatVargaLabel,
} from "@/lib/astro-intelligence/universal-shodasha-varga-engine";
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

const VARGA_DECISION_GUIDE: Record<string, { judge: string; avoid: string; next: string }> = {
  D7: {
    judge: "Use D7 with D1 5th house, Jupiter, relevant dasha and family context for children or lineage matters.",
    avoid: "Do not convert D7 into medical or fertility certainty.",
    next: "Check Jupiter, 5th lord, dasha activation and supportive timing before final advice.",
  },
  D9: {
    judge: "Use D9 after D1 promise to judge marriage delivery, dharma maturity, spouse support and planet reliability.",
    avoid: "Do not overrule the birth chart from one Navamsha placement.",
    next: "Compare D1 7th house, Venus, Jupiter, D9 lagna, D9 7th and active dasha planets.",
  },
  D10: {
    judge: "Use D10 for career authority, public karma, work status and professional responsibility.",
    avoid: "Do not judge career only from D10 when D1 10th, Saturn, Sun and dasha disagree.",
    next: "Compare D1 10th house, 10th lord, Saturn/Sun, D10 lagna and current dasha.",
  },
  D12: {
    judge: "Use D12 for parents, ancestry, inherited family patterns and elder support.",
    avoid: "Do not make harsh family conclusions from a single malefic placement.",
    next: "Read D12 with D1 4th/9th houses, Sun, Moon and active family-period dashas.",
  },
  D30: {
    judge: "Use D30 for obstacle patterns, stress points and karmic correction areas.",
    avoid: "Do not use D30 to create fear; it is a prevention and discipline chart.",
    next: "Match D30 pressure with D1 dusthana houses, Saturn/Mars/Rahu/Ketu and remedy discipline.",
  },
  D60: {
    judge: "Use D60 only when birth time is highly reliable; it refines deep karmic tone.",
    avoid: "Do not give strong D60 claims if birth time confidence is weak.",
    next: "Treat D60 as a subtle confirmation layer after D1, D9 and dasha.",
  },
};

function getVargaGuide(key: string) {
  return VARGA_DECISION_GUIDE[key] ?? {
    judge: "Use this varga as a focused confirmation layer after the birth chart promise is established.",
    avoid: "Do not make a final prediction from this chart alone.",
    next: "Compare D1 promise, relevant karaka, house lord, varga lagna and current dasha.",
  };
}

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
  const { birth, chart, hasUserChart } = useUserChart();
  const { t } = useLanguage();

  const divs     = calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  const current  = divs.find(d=>d.key===activeChart) || divs[0];
  const analysis = getChartAnalysis(current);
  const findings = getSpecialFindings(divs);
  const color    = CHART_COLORS[current.key] ?? "#a855f7";
  const meta     = CHART_META[current.key];
  const universal = analyzeUniversalShodashaVarga({
    language: "hinglish",
    birthTimeConfidence: 86,
    charts: divs,
    dasha: extractDashaInput(chart),
  });
  const currentUniversal = universal.sections.find((section) => section.chart === current.key);

  if (!hasUserChart || !birth.name) {
    return (
      <EngineEmptyState
        engineName="Divisional Charts"
        engineIcon="🧩"
        whatItAnalyzes={["D9 Navamsha", "D10 Dashamsha", "16 Shodasha vargas", "Varga-based strength"]}
      />
    );
  }

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
        .dv-marriage-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:16px}
        .dv-marriage-card{background:rgba(13,10,34,0.82);border:1px solid rgba(236,72,153,0.2);border-radius:14px;padding:15px}
        .dv-marriage-score{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:700;line-height:1;color:#ec4899}
        .dv-marriage-title{font-size:14px;font-weight:800;color:#f0e8d0;margin:6px 0}
        .dv-marriage-text{font-size:12px;color:#c8c0a8;line-height:1.7}
        .dv-marriage-chip{display:inline-flex;margin-top:8px;border:1px solid rgba(200,160,48,.25);border-radius:999px;padding:4px 9px;font-size:10px;color:#d8c47a}
        .dv-shodash{background:#0d0a22;border:1px solid rgba(200,160,48,0.16);border-radius:16px;padding:16px;margin-bottom:16px}
        .dv-shodash-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}
        .dv-shodash-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#f0e8d0}
        .dv-shodash-sub{font-size:12px;color:#8f86b7;line-height:1.65;margin-top:4px}
        .dv-shodash-grid{display:grid;grid-template-columns:repeat(4,minmax(220px,1fr));gap:10px;overflow-x:auto;padding-bottom:4px}
        .dv-shodash-card{background:rgba(8,5,26,0.82);border:1px solid rgba(255,255,255,0.08);border-radius:13px;padding:13px;min-height:178px}
        .dv-shodash-top{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px}
        .dv-shodash-key{font-size:12px;font-weight:900;color:#c8a030}
        .dv-shodash-score{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:800;color:#ec4899;line-height:1}
        .dv-shodash-card h3{font-size:14px;color:#f0e8d0;margin:0 0 5px}
        .dv-shodash-card p{font-size:12px;color:#c8c0a8;line-height:1.65;margin:0}
        .dv-shodash-domain{font-size:10px;color:#8f86b7;line-height:1.4;margin-bottom:8px}
        .dv-universal{background:linear-gradient(135deg,rgba(16,12,42,.96),rgba(10,7,28,.96));border:1px solid rgba(200,160,48,.22);border-radius:18px;padding:18px;margin-bottom:16px}
        .dv-universal-head{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start;margin-bottom:14px}
        .dv-universal-kicker{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:6px;font-weight:800}
        .dv-universal-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:800;color:#f0e8d0}
        .dv-universal-text{font-size:13px;color:#c8c0a8;line-height:1.8;margin-top:7px}
        .dv-universal-score{text-align:center;border:1px solid rgba(236,72,153,.25);border-radius:16px;padding:12px 16px;background:rgba(236,72,153,.08);min-width:130px}
        .dv-universal-score strong{display:block;font-family:'Cormorant Garamond',serif;font-size:38px;line-height:1;color:#f0abfc}
        .dv-universal-score span{font-size:10px;color:#d8c47a;text-transform:uppercase;letter-spacing:.12em}
        .dv-universal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}
        .dv-universal-card{background:rgba(8,5,26,.82);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:13px;cursor:pointer;text-align:left}
        .dv-universal-card.active{border-color:rgba(200,160,48,.55);background:rgba(200,160,48,.08)}
        .dv-universal-card-top{display:flex;justify-content:space-between;gap:8px;margin-bottom:8px;align-items:center}
        .dv-universal-card b{font-size:12px;color:#c8a030}
        .dv-universal-card strong{font-size:22px;color:#f0e8d0}
        .dv-universal-card h3{font-size:13px;color:#f0e8d0;margin:0 0 5px}
        .dv-universal-card p{font-size:11px;color:#9e95c8;line-height:1.55;margin:0}
        .dv-current-reading{background:rgba(8,5,26,.78);border:1px solid rgba(200,160,48,.18);border-radius:16px;padding:16px;margin-bottom:16px}
        .dv-current-reading h2{font-family:'Cormorant Garamond',serif;font-size:24px;color:#f0e8d0;margin:0 0 8px}
        .dv-current-reading p{font-size:13px;color:#c8c0a8;line-height:1.85;margin:0 0 12px}
        .dv-current-reading ul{display:grid;gap:7px;margin:0;padding-left:18px;color:#a99fd0;font-size:12px;line-height:1.7}
        .dv-decision-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:16px}
        .dv-decision-card{background:#0d0a22;border:1px solid rgba(168,85,247,.16);border-radius:14px;padding:14px}
        .dv-decision-card b{display:block;font-size:11px;color:#c8a030;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px}
        .dv-decision-card p{font-size:12px;color:#c8c0a8;line-height:1.7;margin:0}
        .dv-growth-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
        .dv-growth-box{background:#0d0a22;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px}
        .dv-growth-box h3{font-size:14px;color:#f0e8d0;margin:0 0 8px}
        .dv-growth-box p{font-size:12px;color:#b8b0d8;line-height:1.75;margin:0}
        @media(max-width:920px){.dv-universal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dv-universal-head,.dv-growth-grid,.dv-decision-grid{grid-template-columns:1fr}}
        @media(max-width:640px){.dv-universal-grid{grid-template-columns:1fr}}
        @media(max-width:920px){.dv-marriage-grid{grid-template-columns:1fr}}
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

      {/* Universal Shodasha Varga Intelligence */}
      <section className="dv-universal">
        <div className="dv-universal-head">
          <div>
            <div className="dv-universal-kicker">Universal Shodasha Varga Intelligence</div>
            <div className="dv-universal-title">D1 Promise + 16 Varga Confirmation</div>
            <p className="dv-universal-text">{universal.overallNarrative}</p>
          </div>
          <div className="dv-universal-score">
            <strong>{universal.overallScore}</strong>
            <span>{formatVargaLabel(universal.overallLabel)}</span>
          </div>
        </div>
        <div className="dv-universal-grid">
          {universal.sections.map((section) => (
            <button
              type="button"
              key={section.chart}
              className={`dv-universal-card${activeChart === section.chart ? " active" : ""}`}
              onClick={() => setActiveChart(section.chart)}
            >
              <div className="dv-universal-card-top">
                <b>{section.chart}</b>
                <strong>{section.score}</strong>
              </div>
              <h3>{section.shortName}</h3>
              <p>{section.confidenceText} · {formatVargaLabel(section.label)}</p>
            </button>
          ))}
        </div>
      </section>

      {currentUniversal && (
        <section className="dv-current-reading">
          <h2>{currentUniversal.title}</h2>
          <p>{currentUniversal.paragraph}</p>
          <ul>
            {currentUniversal.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {(() => {
        const guide = getVargaGuide(current.key);
        return (
          <section className="dv-decision-grid">
            <div className="dv-decision-card">
              <b>How to judge {current.key}</b>
              <p>{guide.judge}</p>
            </div>
            <div className="dv-decision-card">
              <b>What to avoid</b>
              <p>{guide.avoid}</p>
            </div>
            <div className="dv-decision-card">
              <b>Next validation</b>
              <p>{guide.next}</p>
            </div>
          </section>
        );
      })()}

      <section className="dv-growth-grid">
        <div className="dv-growth-box">
          <h3>Strongest Varga Support</h3>
          <p>{universal.strongestAreas.map((section) => `${section.chart} ${section.shortName} (${section.score})`).join(" · ")}</p>
        </div>
        <div className="dv-growth-box">
          <h3>Growth & Care Areas</h3>
          <p>{universal.growthAreas.map((section) => `${section.chart} ${section.shortName} (${section.score})`).join(" · ")}</p>
        </div>
      </section>

      {/* Marriage Trigger Engine: Divisional layer */}
      {(() => {
        const marriage = buildMarriageDivisionalIntelligence(divs);
        const cards = [
          marriage.d9MarriageDelivery,
          marriage.d9ContinuityCare,
          marriage.d7ChildrenAwareness,
        ];
        return (
          <div className="dv-marriage-grid">
            {cards.map((item) => (
              <div key={item.title} className="dv-marriage-card">
                <div className="dv-marriage-score">{item.score}</div>
                <div className="dv-marriage-title">{item.title}</div>
                <div className="dv-marriage-text">{item.paragraph}</div>
                <span className="dv-marriage-chip">{item.label.replaceAll("_", " ")}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Shodashvarga relationship wisdom */}
      {(() => {
        const wisdom = buildShodashvargaMarriageWisdom(divs);
        return (
          <div className="dv-shodash">
            <div className="dv-shodash-head">
              <div>
                <div className="dv-shodash-title">Shodashvarga Marriage Wisdom</div>
                <div className="dv-shodash-sub">
                  D1 se D60 tak har varga marriage ko alag lens se refine karta hai: promise, finance, home, romance, conflict repair, children, dharma, career, ancestors, comfort, values aur deep karma.
                </div>
              </div>
              <span className="dv-marriage-chip">20 varga lenses</span>
            </div>
            <div className="dv-shodash-grid">
              {wisdom.map((item) => (
                <div key={item.key} className="dv-shodash-card">
                  <div className="dv-shodash-top">
                    <span className="dv-shodash-key">{item.key}</span>
                    <span className="dv-shodash-score">{item.score}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="dv-shodash-domain">{item.domain}</div>
                  <p>{item.paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

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
