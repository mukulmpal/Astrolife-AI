"use client";

import { useMemo } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useUserChart } from "@/lib/user-chart";
import { calculateSpecialLagnas, type SpecialLagnaItem } from "@/lib/astro-engine/special-lagnas";

function LagnaCard({ item }: { item: SpecialLagnaItem }) {
  return (
    <article className="sl-card">
      <div className="sl-card-top">
        <div>
          <span>{item.shortName}</span>
          <h2>{item.name}</h2>
        </div>
        <strong>{item.sign}</strong>
      </div>
      <div className="sl-meta">
        <em>H{item.house}</em>
        <em>{item.degreeText}</em>
        <em>Lord {item.lord}</em>
        {item.lordHouse ? <em>Lord H{item.lordHouse}</em> : null}
      </div>
      <p className="sl-meaning">{item.meaning}</p>
      <p>{item.interpretation}</p>
      <ul>
        {item.actionPlan.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </article>
  );
}

export default function SpecialLagnasPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateSpecialLagnas(chart) : null), [chart]);

  if (loading || !result) {
    return (
      <main className="sl-page">
        <section className="sl-hero">
          <span>Special Lagnas</span>
          <h1>Preparing Arudha & Prosperity Lagnas...</h1>
          <p>Your primary chart is loading. Special Lagna engine will sync automatically.</p>
        </section>
        <MobileBottomNav />
      </main>
    );
  }

  return (
    <main className="sl-page">
      <section className="sl-hero">
        <div>
          <span>Jaimini · PVR Special Lagnas</span>
          <h1>Special Lagnas</h1>
          <p>
            Arudha, Upapada, Hora, Ghati, Bhava and Sree Lagna reveal public image,
            relationship karma, prosperity flow and authority pattern.
          </p>
        </div>
        <div className="sl-hero-stat">
          <span>Public Career Signal</span>
          <strong>{result.strongestPublicSignal.sign}</strong>
          <em>{result.strongestPublicSignal.name}</em>
        </div>
      </section>

      <section className="sl-summary">
        <div>
          <span>Sunrise Base</span>
          <strong>{result.sunriseLocal}</strong>
          <p>Sun at sunrise: {result.sunAtSunrise}° · Birth after sunrise: {result.minutesSinceSunrise} min</p>
        </div>
        <div>
          <span>Sree Lagna</span>
          <strong>{result.sreeLagna.sign}</strong>
          <p>{result.sreeLagna.meaning}</p>
        </div>
      </section>

      <section className="sl-section">
        <div className="sl-head">
          <span>Arudha Padas</span>
          <h2>Public Image, Wealth, Partnership & Career Fame</h2>
        </div>
        <div className="sl-grid">
          {result.arudhaItems.map((item) => (
            <LagnaCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      <section className="sl-section">
        <div className="sl-head">
          <span>Sunrise Lagnas</span>
          <h2>Wealth, Authority & Embodied Life Direction</h2>
        </div>
        <div className="sl-grid">
          {result.sunriseItems.map((item) => (
            <LagnaCard key={item.key} item={item} />
          ))}
          <LagnaCard item={result.sreeLagna} />
        </div>
      </section>

      <section className="sl-note">
        <strong>How to read this</strong>
        <p>
          These lagnas do not replace the birth Lagna. They are auxiliary lenses:
          AL shows image, UL shows marriage image, A10 shows career visibility,
          HL shows wealth instinct, GL shows authority, and SL shows prosperity grace.
        </p>
      </section>

      <MobileBottomNav />

      <style jsx>{`
        .sl-page {
          min-height: 100vh;
          color: #f4eedf;
          background:
            radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 32%),
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 30%),
            #080413;
          padding: 32px 24px 110px;
        }

        .sl-hero,
        .sl-summary,
        .sl-section,
        .sl-note {
          max-width: 1160px;
          margin: 0 auto 18px;
        }

        .sl-hero {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
          align-items: stretch;
        }

        .sl-hero > div,
        .sl-hero-stat,
        .sl-summary > div,
        .sl-card,
        .sl-note {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.055);
          border-radius: 22px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
        }

        .sl-hero > div {
          padding: 24px;
        }

        .sl-hero span,
        .sl-head span,
        .sl-summary span,
        .sl-card-top span,
        .sl-hero-stat span {
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 11px;
        }

        .sl-hero h1 {
          margin: 8px 0;
          font-size: clamp(34px, 6vw, 64px);
          line-height: 0.95;
        }

        .sl-hero p,
        .sl-note p,
        .sl-card p {
          color: rgba(244, 238, 223, 0.68);
          line-height: 1.7;
          font-size: 14px;
        }

        .sl-hero-stat {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 22px;
        }

        .sl-hero-stat strong,
        .sl-summary strong {
          font-size: 34px;
          color: #fff7d8;
        }

        .sl-hero-stat em {
          color: rgba(244, 238, 223, 0.55);
          font-style: normal;
        }

        .sl-summary {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .sl-summary > div {
          padding: 18px;
        }

        .sl-summary p {
          margin: 4px 0 0;
          color: rgba(244, 238, 223, 0.55);
          font-size: 13px;
        }

        .sl-head {
          margin: 28px 0 12px;
        }

        .sl-head h2 {
          margin: 6px 0 0;
          font-size: 24px;
        }

        .sl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .sl-card {
          padding: 18px;
        }

        .sl-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: start;
        }

        .sl-card-top h2 {
          margin: 4px 0 0;
          font-size: 20px;
        }

        .sl-card-top strong {
          color: #d4af37;
          font-size: 18px;
        }

        .sl-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 12px 0;
        }

        .sl-meta em {
          border: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(212, 175, 55, 0.08);
          border-radius: 999px;
          padding: 4px 8px;
          color: #efd487;
          font-style: normal;
          font-size: 11px;
        }

        .sl-meaning {
          color: #fff7d8 !important;
          font-weight: 700;
        }

        ul {
          margin: 12px 0 0;
          padding-left: 18px;
          color: rgba(244, 238, 223, 0.72);
          line-height: 1.65;
          font-size: 13px;
        }

        .sl-note {
          padding: 18px;
          margin-top: 24px;
        }

        .sl-note strong {
          color: #d4af37;
        }

        @media (max-width: 760px) {
          .sl-page {
            padding: 22px 14px 100px;
          }

          .sl-hero,
          .sl-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
