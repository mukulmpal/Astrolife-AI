"use client";

import { useState, useMemo } from "react";
import { EngineEmptyState } from "@/components/engine/engine-intro";
import "@/app/dashboard/shared.css";
import {
  calculateDivisional,
  getSpecialFindings,
  type DivChart,
} from "@/lib/astro-engine/divisional";
import { evaluateVargaNeuroKarmicProfile } from "@/lib/astro-intelligence/varga-neuro-remedies-engine";
import { VargaNeuroKarmicCards } from "@/components/charts/VargaNeuroKarmicCards";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";

const SIGN_ICONS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const md = (x: number, m: number) => ((x % m) + m) % m;

const CHART_COLORS: Record<string, string> = {
  D1: "#c8a030",
  D2: "#eab308",
  D3: "#22c55e",
  D4: "#10b981",
  D7: "#ec4899",
  D9: "#a855f7",
  D10: "#f97316",
  D12: "#60a5fa",
  D16: "#06b6d4",
  D20: "#8b5cf6",
  D24: "#3b82f6",
  D27: "#2dd4bf",
  D30: "#ef4444",
  D40: "#f59e0b",
  D45: "#6366f1",
  D60: "#d946ef",
};

const CHART_META: Record<string, { icon: string; domain: string; category: string }> = {
  D1:  { icon: "🔯", domain: "Physical Life & Identity", category: "Shadvarga" },
  D2:  { icon: "💰", domain: "Wealth & Finance", category: "Shadvarga" },
  D3:  { icon: "⚡", domain: "Courage & Siblings", category: "Shadvarga" },
  D4:  { icon: "🏠", domain: "Property & Home", category: "Saptavarga" },
  D7:  { icon: "👶", domain: "Children & Creative Legacy", category: "Saptavarga" },
  D9:  { icon: "💍", domain: "Marriage & Soul Dharma", category: "Shadvarga" },
  D10: { icon: "💼", domain: "Career & Public Status", category: "Dashavarga" },
  D12: { icon: "👨‍👩‍👧", domain: "Ancestry & Parents", category: "Shadvarga" },
  D16: { icon: "🚗", domain: "Vehicles & Peace of Mind", category: "Shodashavarga" },
  D20: { icon: "🕉️", domain: "Spiritual Path & Sadhana", category: "Shodashavarga" },
  D24: { icon: "📚", domain: "Higher Learning & Skills", category: "Shodashavarga" },
  D27: { icon: "🌟", domain: "Soul Strength & Resilience", category: "Shodashavarga" },
  D30: { icon: "⚠️", domain: "Obstacles & Karma Traps", category: "Shadvarga" },
  D40: { icon: "☯️", domain: "Maternal Grace & Luck", category: "Shodashavarga" },
  D45: { icon: "🎭", domain: "Character & Ethical Spine", category: "Shodashavarga" },
  D60: { icon: "🌀", domain: "Root Past-Life Karma", category: "Shodashavarga" },
};

const VARGA_DECISION_GUIDE: Record<string, { judge: string; avoid: string; next: string }> = {
  D1: {
    judge: "Use D1 for core vitality, physical stamina, self-identity and foundational life promise.",
    avoid: "Do not neglect micro-vargas; D1 is the seed, vargas show how each branch manifests.",
    next: "Compare D1 Lagna lord strength, Shadbala index, and active Mahadasha lord.",
  },
  D2: {
    judge: "Use D2 (Hora) for liquid wealth capacity, money mindset and asset compounding stamina.",
    avoid: "Do not judge career designation from D2; it governs wealth retention, not profession.",
    next: "Synthesize with D1 2nd/11th houses, Jupiter, and Mercury.",
  },
  D3: {
    judge: "Use D3 (Drekkana) for willpower, execution drive, athletic courage and sibling synergy.",
    avoid: "Do not mistake physical assertiveness for long-term career strategy.",
    next: "Check Mars, D1 3rd lord, and active antardasha activation.",
  },
  D4: {
    judge: "Use D4 (Chaturthamsha) for fixed assets, real estate sanctuary and maternal blessings.",
    avoid: "Do not predict sudden property deals without dasha and 4th lord transit support.",
    next: "Cross-verify with D1 4th house, Moon, and Venus dignities.",
  },
  D7: {
    judge: "Use D7 (Saptamsha) with D1 5th house, Jupiter, and family context for children or creative legacy.",
    avoid: "Do not convert D7 into medical or fertility certainty.",
    next: "Check Jupiter, 5th lord, dasha activation and supportive family timing.",
  },
  D9: {
    judge: "Use D9 (Navamsha) to verify marriage delivery, soul dharma, spouse partnership and post-30 maturity.",
    avoid: "Do not overrule the birth chart from one isolated Navamsha placement.",
    next: "Compare D1 7th house, Venus, Jupiter, D9 lagna, and active dasha planets.",
  },
  D10: {
    judge: "Use D10 (Dasamsha) for executive authority, commercial impact, career apex and public prestige.",
    avoid: "Do not judge career only from D10 when D1 10th lord and active dasha suggest a transition.",
    next: "Compare D1 10th house, Sun, Saturn, D10 lagna, and current dasha period.",
  },
  D12: {
    judge: "Use D12 (Dwadashamsha) for parental karma, ancestral blessings and inherited lineage patterns.",
    avoid: "Do not make harsh conclusions about parents from a single malefic placement.",
    next: "Read D12 with D1 4th/9th houses, Sun, Moon, and active lineage dashas.",
  },
  D16: {
    judge: "Use D16 (Shodashamsha) for luxury conveyances, vehicles, comfort and autonomic peace of mind.",
    avoid: "Do not analyze conveyances without checking D1 4th house and Venus.",
    next: "Inspect 4th lord, Venus, and active Mars/Rahu transit conjunctions.",
  },
  D20: {
    judge: "Use D20 (Vimshamsha) for meditation depth, upasana, mantra siddhi and higher consciousness.",
    avoid: "Do not use D20 for mundane commercial or materialistic forecasts.",
    next: "Synthesize with D1 9th/12th houses, Jupiter, Ketu, and Atmakaraka.",
  },
  D24: {
    judge: "Use D24 (Chaturvimshamsha) for higher intellect, research aptitude, technical skills and memory.",
    avoid: "Do not confuse academic aptitude with practical business monetization.",
    next: "Evaluate D1 4th/5th houses, Mercury, and Jupiter.",
  },
  D27: {
    judge: "Use D27 (Saptavimshamsha) for subconscious endurance, inner vitality and emotional resilience in crisis.",
    avoid: "Do not treat D27 as an external event chart; it is an internal stamina gauge.",
    next: "Check Moon, Mars, and D3 stamina synergy.",
  },
  D30: {
    judge: "Use D30 (Trimshamsha) to identify subconscious shadow traps, health vulnerabilities and karmic blindspots.",
    avoid: "Do not use D30 to create fear; it is a diagnostic tool for spiritual discipline and behavioral prevention.",
    next: "Correlate D30 pressure with D1 dusthanas (6/8/12) and active remedy discipline.",
  },
  D40: {
    judge: "Use D40 (Khavedamsha) for maternal ancestral auspiciousness, inherited goodwill and subtle grace.",
    avoid: "Do not make firm claims if birth time confidence is below 85% (requires precise timing).",
    next: "Compare with D1 4th house, Moon, and D12.",
  },
  D45: {
    judge: "Use D45 (Akshavedamsha) for ethical spine, conscience alignment, integrity and moral conduct.",
    avoid: "Do not judge character without strict birth-time verification.",
    next: "Check Jupiter, Sun, and D1 9th house.",
  },
  D60: {
    judge: "Use D60 (Shashtiamsha) for deep past-life Sanchita karma, soul debts and final karmic dispensation.",
    avoid: "Do not give dogmatic D60 claims if birth time is not rectified to sub-minute accuracy.",
    next: "Treat D60 as a subtle supreme confirmation layer after D1, D9, and active Mahadasha.",
  },
};

function getVargaGuide(key: string) {
  return (
    VARGA_DECISION_GUIDE[key] ?? {
      judge: "Use this varga as a focused confirmation layer after the birth chart promise is established.",
      avoid: "Do not make a final prediction from this chart alone without natal verification.",
      next: "Compare D1 promise, relevant karaka, house lord, varga lagna, and current dasha.",
    }
  );
}

function MiniChart({ chart }: { chart: DivChart }) {
  const S = 220;
  const CELLS = [
    { hn: 1, cx: S / 2,     cy: S / 4 },
    { hn: 2, cx: S / 4,     cy: S / 8 },
    { hn: 3, cx: S / 8,     cy: S / 4 },
    { hn: 4, cx: S / 4,     cy: S / 2 },
    { hn: 5, cx: S / 8,     cy: 3 * S / 4 },
    { hn: 6, cx: S / 4,     cy: 7 * S / 8 },
    { hn: 7, cx: S / 2,     cy: 3 * S / 4 },
    { hn: 8, cx: 3 * S / 4, cy: 7 * S / 8 },
    { hn: 9, cx: 7 * S / 8, cy: 3 * S / 4 },
    { hn: 10,cx: 3 * S / 4, cy: S / 2 },
    { hn: 11,cx: 7 * S / 8, cy: S / 4 },
    { hn: 12,cx: 3 * S / 4, cy: S / 8 },
  ];
  const byHouse: Record<number, { icon: string; color: string; retro: boolean }[]> = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];
  chart.planets.forEach((p) =>
    byHouse[p.house]?.push({ icon: p.icon, color: p.color, retro: p.retrograde })
  );

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 220, display: "block", margin: "0 auto" }}>
      <rect width={S} height={S} fill="#FAF7F2" rx="10" />
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="rgba(184,134,11,0.3)" strokeWidth="1" rx="10" />
      <line x1={S / 2} y1={0}     x2={S}     y2={S / 2} stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={S}     y1={S / 2} x2={S / 2} y2={S}     stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={S / 2} y1={S}     x2={0}     y2={S / 2} stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={0}     y1={S / 2} x2={S / 2} y2={0}     stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={0}     y1={0}     x2={S}     y2={S}     stroke="rgba(184,134,11,0.15)" strokeWidth="0.5" />
      <line x1={S}     y1={0}     x2={0}     y2={S}     stroke="rgba(184,134,11,0.15)" strokeWidth="0.5" />
      {CELLS.map(({ hn, cx, cy }) => {
        const rIdx = md(chart.lagnaNum + hn - 1, 12);
        const isL = hn === 1;
        const here = byHouse[hn] || [];
        return (
          <g key={hn}>
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="7" fill={isL ? "#B8860B" : "#6B635B"}>
              {rIdx + 1}
            </text>
            <text x={cx} y={cy + 2} textAnchor="middle" fontSize="9" fill={isL ? "#B8860B" : "#444060"}>
              {SIGN_ICONS[rIdx]}
            </text>
            {here.map((p, pi) => (
              <text
                key={pi}
                x={cx + (here.length > 1 ? (pi - (here.length - 1) / 2) * 11 : 0)}
                y={cy + (isL ? 17 : 14)}
                textAnchor="middle"
                fontSize="10"
                fill={p.color}
              >
                {p.icon}
                {p.retro ? "ℛ" : ""}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function DivisionalPage() {
  const [activeChart, setActiveChart] = useState("D10");
  const { birth, chart, hasUserChart } = useUserChart();
  const { t } = useLanguage();

  const divs = useMemo(() => {
    if (!chart?.planets) return [];
    return calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  }, [chart?.planets, chart?.lagnaNum, chart?.lagnaLon]);

  const findings = useMemo(() => (divs.length ? getSpecialFindings(divs) : []), [divs]);

  const current = useMemo(
    () => divs.find((d) => d.key === activeChart) || divs[0],
    [divs, activeChart]
  );
  const color = current ? CHART_COLORS[current.key] ?? "#a855f7" : "#a855f7";
  const meta = current ? CHART_META[current.key] : null;

  const neuroProfile = useMemo(() => {
    if (!chart || !current || !divs.length) return null;
    return evaluateVargaNeuroKarmicProfile(chart, current, divs);
  }, [chart, current, divs]);

  const chartName = birth.name || chart?.name;
  if ((!hasUserChart && !chartName) || !current) {
    return (
      <EngineEmptyState
        engineName="Divisional Charts"
        engineIcon="🧩"
        whatItAnalyzes={["D9 Navamsha", "D10 Dashamsha", "16 Shodasha Vargas", "Neuro-Karmic Epigenetic Protocols"]}
      />
    );
  }

  const activeMD = chart?.dashas?.find((d) => d.active);

  return (
    <div className="page">
      <style>{`
        .dv-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .dv-tab {
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid rgba(184,134,11,0.2);
          background: #FAF7F2;
          color: #6B635B;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          text-align: left;
        }
        .dv-tab:hover {
          border-color: #B8860B;
        }
        .dv-tab.active {
          border-color: #B8860B;
          background: rgba(184,134,11,0.15);
          color: #B8860B;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(184,134,11,0.12);
        }
        .dv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 22px;
        }
        @media(max-width: 768px) {
          .dv-grid { grid-template-columns: 1fr; }
        }
        .dv-card {
          background: #FFFFFF;
          border: 1px solid rgba(184,134,11,0.22);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .dv-card-title {
          font-size: 11px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: #B8860B;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .dv-planet-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
          border-bottom: 1px solid rgba(184,134,11,0.1);
        }
        .dv-planet-row:last-child {
          border-bottom: none;
        }
        .dv-badge {
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 6px;
          font-weight: 600;
        }
        .dv-stat-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .dv-stat {
          text-align: center;
          background: #FAF7F2;
          border-radius: 12px;
          padding: 10px 16px;
          border: 1px solid rgba(184,134,11,0.2);
          min-width: 90px;
        }
        .dv-stat-n {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: #B8860B;
          line-height: 1;
        }
        .dv-stat-l {
          font-size: 10px;
          color: #6B635B;
          margin-top: 4px;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .dv-decision-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 22px;
          margin-bottom: 22px;
        }
        @media(max-width: 768px) {
          .dv-decision-grid { grid-template-columns: 1fr; }
        }
        .dv-decision-card {
          background: #FFFFFF;
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .dv-decision-card b {
          display: block;
          font-size: 11px;
          color: #B8860B;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 7px;
        }
        .dv-decision-card p {
          font-size: 12.5px;
          color: #4A4238;
          line-height: 1.7;
          margin: 0;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="page-tag">{t("divisional.page_tag") || "Shodashavarga Intelligence"}</div>
      <h1 className="page-title serif">16 Varga Kundali Analysis (षोडशवर्ग चक्र)</h1>
      <p className="page-sub">
        {chartName} · Natal D-1 Seed Promise Verified Across 16 Micro-Karma Lenses
      </p>

      {/* ── SCOPE & QUICK STATS BAR ── */}
      <div className="header-card" style={{ marginBottom: 24 }}>
        <div className="header-orb" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#a855f7", marginBottom: 6 }}>
            ✦ Shodashavarga Scope
          </div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>
            Active Varga: {current.key} ({current.name})
          </div>
          <div style={{ fontSize: 12, color: "#6B635B", marginTop: 4 }}>
            Natal Lagna: <strong>{chart.lagnaRashi}</strong> · {current.key} Lagna: <strong>{current.lagna}</strong>
            {activeMD && <span> · Active Dasha: <strong>{activeMD.planet} Mahadasha</strong></span>}
          </div>
        </div>
        <div className="dv-stat-row">
          <div className="dv-stat">
            <div className="dv-stat-n">{current.lagna}</div>
            <div className="dv-stat-l">{current.key} LAGNA</div>
          </div>
          <div className="dv-stat">
            <div className="dv-stat-n">{divs.length}</div>
            <div className="dv-stat-l">TOTAL VARGAS</div>
          </div>
          <div className="dv-stat">
            <div className="dv-stat-n" style={{ color: "#22c55e" }}>
              {findings.filter((f) => f.type === "positive").length}
            </div>
            <div className="dv-stat-l">STRENGTHS</div>
          </div>
          <div className="dv-stat">
            <div className="dv-stat-n" style={{ color: "#ef4444" }}>
              {findings.filter((f) => f.type === "caution").length}
            </div>
            <div className="dv-stat-l">CAUTIONS</div>
          </div>
        </div>
      </div>

      <PremiumFeature feature="Divisional Charts">
        {/* ── 1. 16 VARGA INTERACTIVE PILL SELECTOR ── */}
        <div className="dv-tabs">
          {divs.map((d) => {
            const m = CHART_META[d.key] || { icon: "✦", domain: d.purpose, category: "" };
            const isActive = activeChart === d.key;
            return (
              <button
                key={d.key}
                type="button"
                className={`dv-tab${isActive ? " active" : ""}`}
                onClick={() => setActiveChart(d.key)}
              >
                <div className="flex items-center gap-1.5">
                  <span>{m.icon}</span>
                  <span className="font-bold">{d.key}</span>
                </div>
                <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{m.domain.split("&")[0]}</div>
              </button>
            );
          })}
        </div>

        {/* ── 2. ACTIVE VARGA CORE WORKSPACE: CHART + PLANET POSITIONS ── */}
        <div className="dv-grid">
          {/* Left: North Indian Mini Chart */}
          <div className="dv-card" style={{ borderColor: color + "40" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="dv-card-title" style={{ color, marginBottom: 0 }}>
                {meta?.icon} {current.key} — {current.name} Chakra
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                {current.lagna} Lagna
              </span>
            </div>

            <MiniChart chart={current} />

            <div style={{ marginTop: 14, padding: "10px 14px", background: color + "0d", border: `1px solid ${color}22`, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3, fontWeight: 700 }}>
                Domain Focus
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.65 }}>
                {current.purpose}
              </div>
            </div>
          </div>

          {/* Right: Planet Positions Table in Active Varga */}
          <div className="dv-card">
            <div className="flex items-center justify-between mb-3">
              <div className="dv-card-title" style={{ marginBottom: 0 }}>
                Planetary Coordinates in {current.key}
              </div>
              <span className="text-[11px] text-[#6B635B]">
                {current.planets.filter((p) => p.dignity === "Exalted").length} Exalted · {current.planets.filter((p) => p.dignity === "Own").length} Own
              </span>
            </div>

            <div className="space-y-1">
              {current.planets.map((p, i) => (
                <div key={i} className="dv-planet-row">
                  <span style={{ fontSize: 15, color: p.color, width: 22 }}>{p.icon}</span>
                  <span style={{ flex: 1, fontSize: 12.5, color: "#1A1A1A", fontWeight: 600 }}>{p.planet}</span>
                  <span style={{ fontSize: 12, color: "#4A4238" }}>{p.sign}</span>
                  <span style={{ fontSize: 12, color: "#6B635B", width: 30, textAlign: "right", fontWeight: 700 }}>
                    H{p.house}
                  </span>
                  {p.dignity !== "—" ? (
                    <span
                      className="dv-badge"
                      style={{
                        color: p.dignity === "Exalted" ? "#b45309" : p.dignity === "Own" ? "#15803d" : "#b91c1c",
                        background: p.dignity === "Exalted" ? "rgba(245,158,11,0.12)" : p.dignity === "Own" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        border: `1px solid ${p.dignity === "Exalted" ? "rgba(245,158,11,0.3)" : p.dignity === "Own" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                      }}
                    >
                      {p.dignity}
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: "#9ca3af", width: 45, textAlign: "center" }}>—</span>
                  )}
                  {p.retrograde && <span style={{ fontSize: 9.5, color: "#f97316", fontWeight: 700 }}>[R]</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. 3-TIER NEURO-KARMIC SHODASHAVARGA ENGINE CARDS ── */}
        {neuroProfile && (
          <div style={{ marginBottom: 24 }}>
            <VargaNeuroKarmicCards profile={neuroProfile} />
          </div>
        )}

        {/* ── 4. CONCISE VARGA DECISION FRAMEWORK ── */}
        {(() => {
          const guide = getVargaGuide(current.key);
          return (
            <section className="dv-decision-grid">
              <div className="dv-decision-card border-l-4 border-l-[#B8860B]">
                <b>How to Judge {current.key}</b>
                <p>{guide.judge}</p>
              </div>
              <div className="dv-decision-card border-l-4 border-l-[#DC2626]">
                <b>What to Avoid</b>
                <p>{guide.avoid}</p>
              </div>
              <div className="dv-decision-card border-l-4 border-l-[#2563EB]">
                <b>Next Validation with D-1</b>
                <p>{guide.next}</p>
              </div>
            </section>
          );
        })()}

        {/* ── 5. ALL 16 VARGAS AT-A-GLANCE MASTER MATRIX ── */}
        <div className="dv-card mt-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="dv-card-title" style={{ marginBottom: 2 }}>
                📊 16 Varga Master Synthesis Matrix
              </div>
              <div className="text-xs text-[#6B635B]">
                Click on any varga row to instantly load its Kundali, Lagna dynamics, and DNA-based Neuro-Remedy protocol.
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#FAF7F2] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
              16 Vargas Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {divs.map((d) => {
              const m = CHART_META[d.key] || { icon: "✦", domain: d.purpose, category: "" };
              const strong = d.planets.filter((p) => p.dignity === "Exalted" || p.dignity === "Own");
              const deb = d.planets.filter((p) => p.dignity === "Debilitated");
              const isActive = activeChart === d.key;

              return (
                <div
                  key={d.key}
                  onClick={() => {
                    setActiveChart(d.key);
                    window.scrollTo({ top: 180, behavior: "smooth" });
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? "bg-[rgba(184,134,11,0.12)] border-[#B8860B] shadow-sm"
                      : "bg-[#FAF7F2] border-[rgba(184,134,11,0.18)] hover:border-[#B8860B]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-[#1A1A1A]">
                      <span>{m.icon}</span>
                      <span style={{ color: CHART_COLORS[d.key] ?? "#B8860B" }}>{d.key}</span>
                      <span className="text-[11px] text-[#6B635B]">({d.name})</span>
                    </span>
                    <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-white text-[#B8860B] font-bold border border-[rgba(184,134,11,0.2)]">
                      {d.lagna}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#4A4238] font-medium leading-tight mb-2">
                    {m.domain}
                  </div>

                  <div className="text-[10px] text-[#6B635B] flex items-center gap-2 flex-wrap">
                    {strong.length > 0 && (
                      <span className="text-emerald-700 font-bold">
                        ✓ {strong.map((p) => p.planet).join(", ")}
                      </span>
                    )}
                    {deb.length > 0 && (
                      <span className="text-rose-700 font-bold">
                        ⚠ {deb.map((p) => p.planet).join(", ")}
                      </span>
                    )}
                    {strong.length === 0 && deb.length === 0 && (
                      <span className="opacity-75">Balanced Placements</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 6. CROSS-CHART SPECIAL FINDINGS ── */}
        {findings.length > 0 && (
          <div className="dv-card mt-6">
            <div className="dv-card-title">⚡ Cross-Chart Special Findings</div>
            <div className="space-y-3 mt-3">
              {findings.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border text-xs"
                  style={{
                    background: f.type === "positive" ? "rgba(34,197,94,0.06)" : f.type === "caution" ? "rgba(239,68,68,0.06)" : "rgba(148,163,184,0.05)",
                    borderColor: f.type === "positive" ? "rgba(34,197,94,0.25)" : f.type === "caution" ? "rgba(239,68,68,0.25)" : "rgba(148,163,184,0.15)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ fontSize: 15 }}>{f.type === "positive" ? "✅" : f.type === "caution" ? "⚠️" : "◆"}</span>
                    <span className="font-bold text-[#1A1A1A]">{f.title}</span>
                    <span className="ml-auto flex gap-1">
                      {f.charts.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: 9,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: (CHART_COLORS[c] ?? "#B8860B") + "22",
                            color: CHART_COLORS[c] ?? "#B8860B",
                            border: `1px solid ${(CHART_COLORS[c] ?? "#B8860B")}44`,
                            fontWeight: 700,
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="text-[#4A4238] leading-relaxed">{f.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PremiumFeature>
    </div>
  );
}
