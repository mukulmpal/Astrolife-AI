"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  buildNatalChartFromAnyChart,
  generateGemstoneReport,
  generateDashaGemstoneRecommendationsFromChart,
  type AvoidGemstone,
  type DashaGemRecommendation,
  type GemstoneRecommendation,
} from "@/lib/astro-engine/gemstone";
import { EngineStateCard } from "@/components/engine-state-card";

type TabKey = "wearing" | "dasha" | "secondary" | "avoid" | "notes";

const STAR_POINTS = [
  { x: 8, y: 12, r: 1.2, o: 0.42 },
  { x: 18, y: 28, r: 0.8, o: 0.32 },
  { x: 28, y: 8, r: 1.1, o: 0.38 },
  { x: 41, y: 18, r: 0.7, o: 0.28 },
  { x: 52, y: 34, r: 1.4, o: 0.45 },
  { x: 66, y: 12, r: 0.9, o: 0.34 },
  { x: 78, y: 26, r: 1.2, o: 0.4 },
  { x: 88, y: 9, r: 0.8, o: 0.3 },
  { x: 11, y: 62, r: 1.1, o: 0.35 },
  { x: 23, y: 76, r: 0.9, o: 0.3 },
  { x: 36, y: 58, r: 1.3, o: 0.42 },
  { x: 49, y: 82, r: 0.8, o: 0.28 },
  { x: 61, y: 66, r: 1.2, o: 0.38 },
  { x: 74, y: 88, r: 0.7, o: 0.3 },
  { x: 92, y: 70, r: 1.1, o: 0.36 },
];

function GemIcon({ color, size = 96 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`gem-grad-${color.replace("#", "")}`} cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.72" />
          <stop offset="42%" stopColor={color} stopOpacity="0.92" />
          <stop offset="100%" stopColor={color} stopOpacity="0.38" />
        </radialGradient>
      </defs>
      <polygon points="50,8 82,35 70,76 30,76 18,35" fill={`url(#gem-grad-${color.replace("#", "")})`} />
      <polygon points="50,8 82,35 50,26" fill="white" fillOpacity="0.16" />
      <polygon points="50,8 18,35 50,26" fill="white" fillOpacity="0.1" />
      <polygon points="30,76 70,76 50,92" fill={color} fillOpacity="0.62" />
      <polygon points="50,26 82,35 70,76 30,76 18,35" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="gem-score">
      <div>
        <span style={{ width: `${score}%`, background: color }} />
      </div>
      <strong>{score}%</strong>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="gem-meta-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PrimaryGemHero({ gem }: { gem: GemstoneRecommendation }) {
  return (
    <section className="gem-hero-card" style={{ borderColor: `${gem.hexColor}45` }}>
      <div className="gem-glow" style={{ background: gem.hexColor }} />
      <GemIcon color={gem.hexColor} size={120} />

      <div className="gem-hero-info">
        <div className="gem-label-row">
          <span style={{ color: gem.hexColor, background: `${gem.hexColor}22` }}>
            Primary Guidance
          </span>
          <ScoreBar score={gem.score} color={gem.hexColor} />
        </div>

        <h2>{gem.gemstone}</h2>
        <p className="gem-alt">Alternate: {gem.alternateGemstone}</p>

        <div className="gem-meta-grid">
          <MetaPill label="Planet" value={gem.planet} />
          <MetaPill label="Chakra" value={gem.chakra} />
          <MetaPill label="Element" value={gem.element} />
          <MetaPill label="Colour" value={gem.color} />
        </div>

        <p className="gem-reason">{gem.reason}</p>
      </div>
    </section>
  );
}

function WearingGuide({ gem }: { gem: GemstoneRecommendation }) {
  const rows = [
    ["Metal", gem.wearing.metal],
    ["Finger", gem.wearing.finger],
    ["Day", gem.wearing.day],
    ["Time", gem.wearing.time],
    ["Weight", gem.wearing.weight],
    ["Mantra", gem.wearing.mantra],
  ];

  return (
    <div className="gem-grid-two">
      <div className="gem-panel">
        <h3>Wearing Guide</h3>
        <div className="gem-table">
          {rows.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="gem-panel">
        <h3>Benefits</h3>
        <ul>
          {gem.benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="gem-panel caution">
        <h3>Cautions</h3>
        <ul>
          {gem.cautions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="gem-panel">
        <h3>Safer First Step</h3>
        <p>
          Start with mantra, colour discipline and donation connected to {gem.planet}.
          Wear the gemstone only after suitability confirmation.
        </p>
      </div>
    </div>
  );
}

function SecondaryGemGrid({ gems }: { gems: GemstoneRecommendation[] }) {
  if (!gems.length) {
    return <div className="gem-empty">No secondary gemstones found for this chart.</div>;
  }

  return (
    <div className="gem-secondary-grid">
      {gems.map((gem) => (
        <div key={gem.planet} className="gem-secondary-card" style={{ borderColor: `${gem.hexColor}35` }}>
          <GemIcon color={gem.hexColor} size={70} />
          <div>
            <span>{gem.strength}</span>
            <h3>{gem.gemstone}</h3>
            <p>{gem.planet} · {gem.color}</p>
            <ScoreBar score={gem.score} color={gem.hexColor} />
            <p className="gem-card-reason">{gem.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AvoidGemList({ gems }: { gems: AvoidGemstone[] }) {
  if (!gems.length) {
    return <div className="gem-empty">No specific avoid list found for this chart.</div>;
  }

  return (
    <div className="gem-avoid-list">
      {gems.map((gem) => (
        <div key={gem.planet}>
          <div className="gem-avoid-icon">⊗</div>
          <div>
            <h3>{gem.gemstone}</h3>
            <span>{gem.planet}</span>
            <p>{gem.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesPanel({ notes, safetyNote }: { notes: string[]; safetyNote: string }) {
  return (
    <div className="gem-grid-two">
      <div className="gem-panel">
        <h3>Jyotish Analysis Notes</h3>
        <ul>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="gem-panel caution">
        <h3>Safety Note</h3>
        <p>{safetyNote}</p>
      </div>
    </div>
  );
}

function DashaPanel({ items }: { items: DashaGemRecommendation[] }) {
  if (!items.length) {
    return <div className="gem-empty">Dasha data not found. Mahadasha/Antardasha ratna sync will appear after chart dasha is available.</div>;
  }

  return (
    <div className="gem-grid-two">
      {items.map((item) => (
        <div key={`${item.level}-${item.planet}`} className="gem-panel">
          <h3>{item.level}: {item.planet}</h3>
          <p><strong>Ratna:</strong> {item.gemstone} <span style={{ color: "rgba(255,255,255,0.55)" }}>(Alt: {item.alternateGemstone})</span></p>
          <p><strong>Rudraksha:</strong> {item.rudraksha.mukhi} ({item.rudraksha.bead})</p>
          <p>{item.reason}</p>
          <div className="gem-table" style={{ marginTop: 10 }}>
            <div><span>Day</span><strong>{item.wearing.day}</strong></div>
            <div><span>Time</span><strong>{item.wearing.time}</strong></div>
            <div><span>Metal</span><strong>{item.wearing.metal}</strong></div>
            <div><span>Finger</span><strong>{item.wearing.finger}</strong></div>
            <div><span>Weight</span><strong>{item.wearing.weight}</strong></div>
            <div><span>Planet Mantra</span><strong>{item.wearing.mantra}</strong></div>
            <div><span>Rudraksha Mantra</span><strong>{item.rudraksha.mantra}</strong></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GemstonePage() {
  const { chart, loading } = useUserChart();
  const [activeTab, setActiveTab] = useState<TabKey>("wearing");

  const report = useMemo(() => {
    const natal = buildNatalChartFromAnyChart(chart);
    return generateGemstoneReport(natal);
  }, [chart]);
  const dashaRecs = useMemo(() => generateDashaGemstoneRecommendationsFromChart(chart), [chart]);

  const tabs: Array<{ id: TabKey; label: string }> = [
    { id: "wearing", label: "◈ Wearing Guide" },
    { id: "dasha", label: "🪐 Dasha Ratna + Rudraksha" },
    { id: "secondary", label: "◇ Secondary Gems" },
    { id: "avoid", label: "⊗ Avoid These" },
    { id: "notes", label: "✦ Notes" },
  ];

  if (loading) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Your Gemstone Report"
            loading
            loadingText="Chart loading... gemstone and rudraksha guidance will update automatically."
          />
        </section>
      </main>
    );
  }

  return (
    <main className="gem-page">
      <div className="gem-bg">
        <div className="gem-orb one" />
        <div className="gem-orb two" />
        <svg className="gem-stars" viewBox="0 0 100 100" preserveAspectRatio="none">
          {STAR_POINTS.map((star) => (
            <circle
              key={`${star.x}-${star.y}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="white"
              opacity={star.o}
            />
          ))}
        </svg>
      </div>

      <header className="gem-nav">
        <div className="gem-logo-wrap">
          <div className="gem-logo-glyph">✦</div>
          <span className="gem-logo-name">AstroLife</span>
        </div>
        <a className="gem-nav-btn" href="/onboarding">Get Free Kundli</a>
      </header>

      <section className="gem-header">
        <span>Gemstone Intelligence</span>
        <h1>Your Gemstone Report</h1>
        <p>
          {report.lagnaSign} Lagna · Lagna Lord {report.lagnaLord}. Guidance only — gemstones
          amplify planets, so confirm before wearing expensive stones.
        </p>
        <p>
          Chart sync: recommendations are computed from your current saved chart planets, houses and active dasha.
          Trikona houses (1,5,9) are treated as stronger support zones.
        </p>
      </section>

      <PrimaryGemHero gem={report.primaryGemstone} />

      <section className="gem-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="gem-content">
        {activeTab === "wearing" && <WearingGuide gem={report.primaryGemstone} />}
        {activeTab === "dasha" && <DashaPanel items={dashaRecs} />}
        {activeTab === "secondary" && <SecondaryGemGrid gems={report.secondaryGemstones} />}
        {activeTab === "avoid" && <AvoidGemList gems={report.avoidGemstones} />}
        {activeTab === "notes" && <NotesPanel notes={report.analysisNotes} safetyNote={report.safetyNote} />}
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        .gem-page {
          --bg: #060410;
          --bg-2: #0a0720;
          --card: #0d0a22;
          --border: #1c1840;
          --border-2: #261f50;
          --gold: #c8a030;
          --gold-soft: #e8c060;
          --cream: #f0e8d0;
          --cream-soft: #c8c0a8;
          --muted: #605890;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 26px 22px 96px;
          color: var(--cream);
          background: radial-gradient(circle at 20% -10%, rgba(60, 40, 128, 0.16), transparent 40%), var(--bg);
          font-family: "Outfit", sans-serif;
        }

        .gem-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gem-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(52px);
          opacity: 0.23;
        }

        .gem-orb.one {
          width: 520px;
          height: 520px;
          left: -180px;
          top: -160px;
          background: rgba(60, 40, 128, 0.22);
        }

        .gem-orb.two {
          width: 460px;
          height: 460px;
          right: -150px;
          bottom: -150px;
          background: rgba(200, 160, 48, 0.14);
        }

        .gem-stars {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.32;
        }

        .gem-header,
        .gem-hero-card,
        .gem-tabs,
        .gem-content {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin-left: auto;
          margin-right: auto;
        }

        .gem-nav {
          position: relative;
          z-index: 2;
          max-width: 1120px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0 4px;
        }

        .gem-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gem-logo-glyph {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #3c2880, var(--gold));
          color: var(--cream);
          font-size: 14px;
          box-shadow: 0 0 20px rgba(200, 160, 48, 0.22);
        }

        .gem-logo-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
          font-weight: 600;
          background: linear-gradient(135deg, var(--gold), #f0d898);
          -webkit-background-clip: text;
          color: transparent;
        }

        .gem-nav-btn {
          text-decoration: none;
          border: 1px solid rgba(200, 160, 48, 0.45);
          color: var(--gold-soft);
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13px;
          transition: all 0.2s;
        }

        .gem-nav-btn:hover {
          background: rgba(200, 160, 48, 0.12);
          border-color: var(--gold);
          color: var(--cream);
        }

        .gem-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .gem-header span {
          display: inline-flex;
          margin-bottom: 10px;
          border: 1px solid rgba(200, 160, 48, 0.28);
          background: rgba(200, 160, 48, 0.1);
          color: var(--gold-soft);
          border-radius: 999px;
          padding: 8px 15px;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          font-size: 10px;
          font-weight: 600;
        }

        .gem-header h1 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(38px, 6.4vw, 66px);
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, var(--cream), var(--gold), #f0d898);
          -webkit-background-clip: text;
          color: transparent;
        }

        .gem-header p {
          max-width: 820px;
          margin: 14px auto 0;
          color: var(--cream-soft);
          line-height: 1.78;
          font-size: 13px;
        }

        .gem-hero-card {
          position: relative;
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 26px;
          align-items: center;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, #0f0c28, #1a1040);
          backdrop-filter: blur(18px);
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.24);
        }

        .gem-glow {
          position: absolute;
          right: -70px;
          top: -80px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          filter: blur(58px);
          opacity: 0.14;
        }

        .gem-hero-info {
          position: relative;
          z-index: 1;
        }

        .gem-label-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 12px;
        }

        .gem-label-row > span {
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .gem-score {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .gem-score div {
          width: 110px;
          height: 7px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
        }

        .gem-score div span {
          display: block;
          height: 100%;
          border-radius: 999px;
        }

        .gem-score strong {
          color: var(--cream-soft);
          font-size: 12px;
        }

        .gem-hero-card h2 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: 34px;
          letter-spacing: -0.04em;
        }

        .gem-alt {
          color: var(--muted);
          margin: 8px 0 14px;
        }

        .gem-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }

        .gem-meta-pill {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 10px;
        }

        .gem-meta-pill span {
          display: block;
          color: var(--muted);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .gem-meta-pill strong {
          color: var(--gold-soft);
          font-size: 13px;
        }

        .gem-reason,
        .gem-panel p,
        .gem-panel li,
        .gem-card-reason,
        .gem-avoid-list p {
          color: var(--cream-soft);
          line-height: 1.65;
        }

        .gem-tabs {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          margin-bottom: 16px;
          padding: 4px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--bg-2);
          overflow-x: auto;
        }

        .gem-tabs button {
          border: 1px solid transparent;
          background: transparent;
          color: var(--muted);
          border-radius: 9px;
          padding: 9px 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          font-size: 13px;
          font-family: "Outfit", sans-serif;
        }

        .gem-tabs button.active {
          color: var(--cream-soft);
          background: #1c1840;
          border-color: rgba(200, 160, 48, 0.18);
        }

        .gem-grid-two {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-panel,
        .gem-secondary-card,
        .gem-avoid-list > div {
          border: 1px solid var(--border);
          background: var(--card);
          border-radius: 16px;
          padding: 18px;
          backdrop-filter: blur(16px);
        }

        .gem-panel.caution,
        .gem-avoid-list > div {
          border-color: rgba(200, 160, 48, 0.2);
          background: rgba(200, 160, 48, 0.06);
        }

        .gem-panel h3,
        .gem-secondary-card h3,
        .gem-avoid-list h3 {
          margin: 0 0 12px;
          color: var(--gold-soft);
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
        }

        .gem-panel ul {
          margin: 0;
          padding-left: 18px;
        }

        .gem-table {
          display: grid;
          gap: 9px;
        }

        .gem-table div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 9px;
        }

        .gem-table span {
          color: var(--muted);
        }

        .gem-table strong {
          text-align: right;
        }

        .gem-secondary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-secondary-card {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 18px;
          align-items: start;
        }

        .gem-secondary-card span {
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 10px;
          font-weight: 600;
        }

        .gem-secondary-card p {
          margin: 6px 0;
        }

        .gem-avoid-list {
          display: grid;
          gap: 14px;
        }

        .gem-avoid-list > div {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .gem-avoid-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(200, 160, 48, 0.12);
          color: var(--gold-soft);
          font-size: 22px;
        }

        .gem-avoid-list span {
          display: inline-flex;
          color: var(--gold-soft);
          margin-bottom: 6px;
          font-size: 12px;
        }

        .gem-empty,
        .gem-loading {
          border: 1px solid var(--border);
          background: var(--card);
          border-radius: 14px;
          padding: 18px;
          color: var(--cream-soft);
        }

        .gem-loading {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 10;
          color: var(--gold-soft);
        }

        @media (max-width: 860px) {
          .gem-page {
            padding: 22px 16px 90px;
          }

          .gem-hero-card,
          .gem-grid-two,
          .gem-secondary-grid,
          .gem-secondary-card,
          .gem-meta-grid {
            grid-template-columns: 1fr;
          }

          .gem-tabs button {
            font-size: 12px;
            padding: 8px 12px;
          }

          .gem-logo-name {
            font-size: 20px;
          }

          .gem-nav-btn {
            padding: 8px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}
