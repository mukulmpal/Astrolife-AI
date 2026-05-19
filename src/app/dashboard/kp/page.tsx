"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  KP_PLANET_COLORS,
  runKPEngine,
  type KPEngineResult,
  type KPRow,
  type SignificatorSet,
} from "@/lib/astro-engine/kp";
import { EngineStateCard } from "@/components/engine-state-card";
import { useLanguage } from "@/lib/language-context";

function VerdictBadge({ value }: { value: SignificatorSet["verdict"] }) {
  const map = {
    strong: "✅ Strong Possible",
    moderate: "⚡ Moderate Possible",
    weak: "○ Weak / Preparing",
    blocked: "⛔ Delayed / Blocked",
  };

  return <span className={`kp-verdict ${value}`}>{map[value]}</span>;
}

function KPTableRow({ row, tp, tn }: { row: KPRow; tp?: (n: string) => string; tn?: (n: string) => string }) {
  const color = KP_PLANET_COLORS[row.name] ?? "#e8e3f0";
  const starColor = KP_PLANET_COLORS[row.starLord] ?? "#e8e3f0";
  const subColor = KP_PLANET_COLORS[row.subLord] ?? "#e8e3f0";
  const _tp = tp || ((n: string) => n);
  const _tn = tn || ((n: string) => n);

  return (
    <tr className={row.isSignificantForTopic ? "hit" : ""}>
      <td>
        <strong style={{ color }}>{_tp(row.name)}</strong>
        {row.retrograde ? <span className="retro">℞</span> : null}
      </td>
      <td>{row.position}</td>
      <td>
        H{row.rashiHouse} → H{row.bhavaHouse}
        {row.bhavaShift !== 0 ? <span className="bhava-shift">shift</span> : null}
      </td>
      <td>{row.degreeText}</td>
      <td>{_tp(row.signLord)}</td>
      <td>{_tn(row.nakshatra)}</td>
      <td style={{ color: starColor }}>{_tp(row.starLord)}</td>
      <td>{row.pada}</td>
      <td>
        <span className="sub-pill" style={{ color: subColor }}>
          {_tp(row.subLord)}
        </span>
      </td>
      <td>{_tp(row.subSubLord)}</td>
      <td>{row.significance}</td>
    </tr>
  );
}


function HouseLordGrid({ lords }: { lords: Record<number, string> }) {
  return (
    <div className="kp-house-grid">
      {Array.from({ length: 12 }, (_, index) => {
        const house = index + 1;
        const lord = lords[house] ?? "—";
        const color = KP_PLANET_COLORS[lord] ?? "#e8e3f0";

        return (
          <div key={house} className="kp-house-cell">
            <span>H{house}</span>
            <strong style={{ color }}>{lord}</strong>
          </div>
        );
      })}
    </div>
  );
}

export default function KPPage() {
  const { chart, loading } = useUserChart();
  const { tp, ts, tn } = useLanguage();
  const [activeTab, setActiveTab] = useState<"table" | "cusps" | "events" | "forecast" | "lords" | "guide">("events");
  const [activeEventId, setActiveEventId] = useState<string>("career");

  const result: KPEngineResult = useMemo(() => {
    return runKPEngine(chart);
  }, [chart]);

  if (loading) {
    return (
      <main className="kp-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="KP Destiny Timing"
            loading
            loadingText="Chart loading... KP output will auto-sync in a moment."
          />
        </section>
      </main>
    );
  }

  const selectedEvent =
    result.significators.find((item) => item.topic === activeEventId) ??
    result.significators[0];

  const tabs = [
    { id: "table", label: "📋 Star · Sub Table" },
    { id: "cusps", label: "🏛 KP Cusps" },
    { id: "events", label: "🎯 KP Events" },
    { id: "forecast", label: "📆 6-Month Forecast" },
    { id: "lords", label: "🏠 House Lords" },
    { id: "guide", label: "📘 KP Guide" },
  ] as const;

  return (
    <main className="kp-page">
      <section className="kp-header">
        <div className="kp-title-block">
          <span>KP · Krishnamurti Paddhati</span>
          <h1>KP Destiny Timing</h1>
          <p>
            AstroLife KP layer for event promise, house cusp sub lord, dasha trigger
            and six-month timing forecast.
          </p>
        </div>

        <div className="kp-hero-card">
          <span>Strongest Event</span>
          <strong>{result.strongestEvent?.label ?? "Calculating"}</strong>
          <em>{result.strongestEvent?.score ?? 0}%</em>
        </div>
      </section>

      <section className="kp-logic-note">
        <div>
          <strong>KP Foundation Check</strong>
          <p>
            Lagna: {result.input.lagR === 5 ? "Virgo" : ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][result.input.lagR]} ·
            Lagna Degree: {result.input.lagLon.toFixed(2)}°. KP uses Bhava Chalit houses for event judgement.
          </p>
          <em>
            Cusp source: {result.input.cuspSource.replaceAll("-", " ")} · House mode:{" "}
            {result.input.bhavaMode.replaceAll("-", " ")}
          </em>
        </div>
        <div>
          <strong>Current Dasha</strong>
          <p>
            MD: {result.input.currentMD || "Not connected"} · AD:{" "}
            {result.input.currentAD || "Not connected"}
          </p>
        </div>
      </section>

      <section className="kp-top-hints">
        {result.topEventHints.map((hint) => (
          <div key={hint.topic}>
            <span style={{ color: hint.color }}>{hint.topic}</span>
            <p>{hint.note}</p>
          </div>
        ))}
      </section>

      <section className="kp-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? "active" : ""}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {activeTab === "table" && (
        <section className="kp-card">
          <div className="kp-section-head">
            <span>KP Planetary Details</span>
            <h2>Star Lord · Sub Lord · Significators</h2>
          </div>

          <div className="kp-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Position</th>
                  <th>Rashi → Bhava</th>
                  <th>Degree</th>
                  <th>Sign Lord</th>
                  <th>Nakshatra</th>
                  <th>Star Lord</th>
                  <th>Pada</th>
                  <th>Sub Lord</th>
                  <th>S-S Lord</th>
                  <th>Signifies</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <KPTableRow key={row.name} row={row} tp={tp} tn={tn} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "cusps" && (
        <section className="kp-card">
          <div className="kp-section-head">
            <span>KP House Cusps</span>
            <h2>Cusp Sub Lord Promise</h2>
          </div>

          <div className="kp-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>House</th>
                  <th>Sign</th>
                  <th>Degree</th>
                  <th>Sign Lord</th>
                  <th>Nakshatra</th>
                  <th>Star Lord</th>
                  <th>Pada</th>
                  <th>Sub Lord</th>
                  <th>S-S Lord</th>
                  <th>Source</th>
                  <th>Promise</th>
                </tr>
              </thead>
              <tbody>
                {result.cusps.map((cusp) => (
                  <tr key={cusp.house}>
                    <td>H{cusp.house}</td>
                    <td>{ts(cusp.sign)}</td>
                    <td>{cusp.degreeText}</td>
                    <td>{tp(cusp.signLord)}</td>
                    <td>{tn(cusp.nakshatra)}</td>
                    <td>{tp(cusp.starLord)}</td>
                    <td>{cusp.pada}</td>
                    <td>{tp(cusp.subLord)}</td>
                    <td>{cusp.subSubLord}</td>
                    <td>{cusp.source.replaceAll("-", " ")}</td>
                    <td>{cusp.promise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "events" && (
        <section className="kp-events-wrap">
          <div className="kp-section-head standalone">
            <span>KP Event Cards</span>
            <h2>Choose Event · Read Possible Outcome</h2>
            <p>
              Select one event first. Then read the promise, obstruction, cusp sub lord,
              dasha link and action plan in separated premium cards.
            </p>
          </div>

          <div className="kp-event-picker">
            {result.significators.map((item) => (
              <button
                type="button"
                key={item.topic}
                onClick={() => setActiveEventId(item.topic)}
                className={activeEventId === item.topic ? `active ${item.verdict}` : item.verdict}
              >
                <span>{item.label}</span>
                <strong>{item.score}%</strong>
                <em>{item.verdict}</em>
              </button>
            ))}
          </div>

          {selectedEvent && (
            <div className="kp-selected-event">
              <div className={`kp-selected-hero ${selectedEvent.verdict}`}>
                <div>
                  <span>Selected KP Event</span>
                  <h2>{selectedEvent.label}</h2>
                  <p>{selectedEvent.verdictNote}</p>
                </div>
                <VerdictBadge value={selectedEvent.verdict} />
              </div>

              <div className="kp-event-detail-grid">
                <div className="kp-event-mini-card gold">
                  <span>Event Houses</span>
                  <strong>H{selectedEvent.positiveHouses.join(" · H")}</strong>
                  <p>Required houses for this event promise.</p>
                </div>

                <div className="kp-event-mini-card red">
                  <span>Caution Houses</span>
                  <strong>H{selectedEvent.negativeHouses.join(" · H")}</strong>
                  <p>These houses can delay, block or complicate the event.</p>
                </div>

                <div className="kp-event-mini-card">
                  <span>Cusp Sub Lord</span>
                  <strong>{selectedEvent.cuspSubLord}</strong>
                  <p>{selectedEvent.cuspPromise}</p>
                </div>

                <div className="kp-event-mini-card">
                  <span>Possibility Index</span>
                  <strong>{selectedEvent.score}%</strong>
                  <p>Possibility based on occupants, star lord, sub lord, cusp and dasha support.</p>
                </div>
              </div>

              <div className="kp-event-detail-grid two">
                <div className="kp-event-panel">
                  <h3>Occupants</h3>
                  <p>
                    {selectedEvent.occupants.length
                      ? selectedEvent.occupants.join(", ")
                      : "No direct occupants found in required houses."}
                  </p>
                </div>

                <div className="kp-event-panel">
                  <h3>House Lords</h3>
                  <p>
                    {selectedEvent.lords
                      .map((lord) => `H${lord.house} → ${lord.lord}`)
                      .join(", ")}
                  </p>
                </div>

                <div className="kp-event-panel">
                  <h3>Star Lord Links</h3>
                  <p>
                    {selectedEvent.starLordLinks.length
                      ? selectedEvent.starLordLinks.join(", ")
                      : "No strong star-lord link found."}
                  </p>
                </div>

                <div className="kp-event-panel">
                  <h3>Sub Lord Links</h3>
                  <p>
                    {selectedEvent.subLordLinks.length
                      ? selectedEvent.subLordLinks.join(", ")
                      : "No strong sub-lord link found."}
                  </p>
                </div>
              </div>

              <div className="kp-event-detail-grid two">
                <div className="kp-event-panel highlight">
                  <h3>Dasha Link</h3>
                  <p>{selectedEvent.dashaLink}</p>
                </div>

                <div className="kp-event-panel highlight">
                  <h3>Action Plan</h3>
                  <ul>
                    {selectedEvent.actionPlan.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "forecast" && (
        <section className="kp-forecast-wrap html-style">
          <div className="kp-section-head standalone">
            <span>KP 6-Month Possible Outcomes</span>
            <h2>Monthly Forecast Format</h2>
            <p>
              This follows the older report style: current timing level, period,
              relationship, career/money and health/caution. Scores are capped because
              KP shows possibility, not guaranteed certainty.
            </p>
          </div>

          <div className="kp-html-forecast-list">
            {result.forecast.map((month, index) => (
              <article key={month.month} className={`kp-html-month ${month.verdict}`}>
                <div className="kp-html-month-head">
                  <div>
                    <span>Monthly Prediction - {index + 1}</span>
                    <h3>{month.month}</h3>
                    <p>{month.period}</p>
                  </div>

                  <div className="kp-probability-box">
                    <span>Possibility</span>
                    <strong>{month.probability}</strong>
                    <em>{month.score}%</em>
                  </div>
                </div>

                <div className="kp-dasha-strip">
                  <strong>Current KP Timing Level</strong>
                  <p>{month.dashaLevel}</p>
                </div>

                <div className="kp-html-sections">
                  <div>
                    <div className="kp-html-section-title">
                      <span>Relationship</span>
                      <em>{month.outcome}</em>
                    </div>
                    <p>{month.relationship}</p>
                  </div>

                  <div>
                    <div className="kp-html-section-title">
                      <span>Career / Money</span>
                      <em>{month.probability}</em>
                    </div>
                    <p>{month.careerMoney}</p>
                  </div>

                  <div>
                    <div className="kp-html-section-title">
                      <span>Health / Caution</span>
                      <em>Safe Guidance</em>
                    </div>
                    <p>{month.healthCaution}</p>
                  </div>
                </div>

                <div className="kp-month-advice">
                  <strong>Practical Advice</strong>
                  <p>{month.advice}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "lords" && (
        <section className="kp-card">
          <div className="kp-section-head">
            <span>House Lordship</span>
            <h2>KP House Lords</h2>
          </div>
          <HouseLordGrid lords={result.houseLords} />
        </section>
      )}

      {activeTab === "guide" && (
        <section className="kp-card guide">
          <div className="kp-section-head">
            <span>How KP Works</span>
            <h2>Reading Logic</h2>
          </div>

          <p>
            KP astrology gives special importance to nakshatra lord and sub lord.
            The planet shows the event area, the star lord connects the planet to
            significator houses, and the sub lord decides whether the event is
            promised or denied.
          </p>

          <div className="kp-guide-grid">
            <div>
              <strong>1. Cusp Indication</strong>
              <p>For an event, first check the relevant cusp sub lord.</p>
            </div>
            <div>
              <strong>2. Significator Houses</strong>
              <p>Event houses must be stronger than obstruction houses.</p>
            </div>
            <div>
              <strong>3. Dasha Trigger</strong>
              <p>Mahadasha and Antardasha activate the promised event.</p>
            </div>
            <div>
              <strong>4. Transit Trigger</strong>
              <p>Transit gives final timing confirmation in advanced phases.</p>
            </div>
          </div>

          <div className="kp-warning">
            KP is guidance-oriented. Do not use it for fear-based predictions. For
            health, legal, financial or psychological matters, take professional advice.
          </div>
        </section>
      )}

      {loading && <div className="kp-loading">Chart loading… KP will update automatically.</div>}

      <style jsx>{`
        .kp-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(245, 197, 66, 0.16), transparent 30%),
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 30%),
            #12061f;
          color: #e8e3f0;
          padding: 28px;
          padding-bottom: 90px;
        }

        .kp-header {
          max-width: 1180px;
          margin: 0 auto 20px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 18px;
          align-items: stretch;
        }

        .kp-title-block,
        .kp-hero-card,
        .kp-card,
        .kp-sig-card,
        .kp-top-hints div {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.055);
          backdrop-filter: blur(18px);
          border-radius: 28px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
        }

        .kp-title-block {
          padding: 30px;
        }

        .kp-title-block span,
        .kp-section-head span {
          color: #f5c542;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 900;
        }

        .kp-title-block h1 {
          margin: 12px 0;
          font-size: clamp(38px, 7vw, 72px);
          letter-spacing: -0.06em;
          line-height: 0.95;
        }

        .kp-title-block p,
        .kp-card p,
        .kp-note-text {
          color: rgba(232, 227, 240, 0.68);
          line-height: 1.75;
        }

        .kp-hero-card {
          padding: 24px;
          display: grid;
          align-content: center;
        }

        .kp-hero-card span {
          color: rgba(232, 227, 240, 0.55);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 11px;
          font-weight: 900;
        }

        .kp-hero-card strong {
          margin: 10px 0;
          font-size: 22px;
        }

        .kp-hero-card em {
          color: #f5c542;
          font-size: 42px;
          font-style: normal;
          font-weight: 950;
        }

        .kp-logic-note {
          max-width: 1180px;
          margin: 0 auto 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .kp-logic-note div {
          border: 1px solid rgba(245, 197, 66, 0.16);
          background:
            radial-gradient(circle at top left, rgba(245, 197, 66, 0.1), transparent 32%),
            rgba(255, 255, 255, 0.055);
          border-radius: 22px;
          padding: 16px;
        }

        .kp-logic-note strong {
          color: #f5c542;
          display: block;
          margin-bottom: 6px;
        }

        .kp-logic-note p {
          margin: 0;
          color: rgba(232, 227, 240, 0.66);
          line-height: 1.55;
          font-size: 13px;
        }

        .kp-logic-note em {
          display: block;
          margin-top: 8px;
          color: rgba(245, 197, 66, 0.72);
          font-size: 11px;
          font-style: normal;
          text-transform: capitalize;
        }

        .kp-events-wrap,
        .kp-forecast-wrap,
        .kp-forecast-grid {
          max-width: 1180px;
          margin: 0 auto 20px;
        }

        .kp-event-picker {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .kp-event-picker button {
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.055);
          color: #fff;
          border-radius: 20px;
          padding: 14px;
          cursor: pointer;
          text-align: left;
          display: grid;
          gap: 8px;
        }

        .kp-event-picker button.active {
          border-color: rgba(245,197,66,0.48);
          background:
            radial-gradient(circle at top left, rgba(245,197,66,0.18), transparent 36%),
            rgba(245,197,66,0.08);
        }

        .kp-event-picker span {
          font-weight: 950;
          font-size: 13px;
        }

        .kp-event-picker strong {
          color: #f5c542;
          font-size: 22px;
        }

        .kp-event-picker em {
          color: rgba(232,227,240,0.55);
          font-style: normal;
          text-transform: capitalize;
          font-size: 11px;
          font-weight: 900;
        }

        .kp-selected-event {
          display: grid;
          gap: 16px;
        }

        .kp-selected-hero {
          border: 1px solid rgba(255,255,255,0.09);
          background:
            radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 34%),
            rgba(255,255,255,0.055);
          border-radius: 28px;
          padding: 22px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
        }

        .kp-selected-hero.strong {
          border-color: rgba(34,197,94,0.28);
        }

        .kp-selected-hero.moderate {
          border-color: rgba(245,197,66,0.28);
        }

        .kp-selected-hero.blocked {
          border-color: rgba(248,113,113,0.28);
        }

        .kp-selected-hero span {
          color: #f5c542;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 11px;
          font-weight: 950;
        }

        .kp-selected-hero h2 {
          margin: 8px 0;
          font-size: 32px;
          letter-spacing: -0.04em;
        }

        .kp-selected-hero p {
          margin: 0;
          color: rgba(232,227,240,0.66);
          line-height: 1.6;
        }

        .kp-event-detail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .kp-event-detail-grid.two {
          grid-template-columns: repeat(2, 1fr);
        }

        .kp-event-mini-card,
        .kp-event-panel {
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 16px;
        }

        .kp-event-mini-card.gold {
          border-color: rgba(245,197,66,0.22);
        }

        .kp-event-mini-card.red {
          border-color: rgba(248,113,113,0.22);
        }

        .kp-event-mini-card span {
          display: block;
          color: rgba(232,227,240,0.48);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .kp-event-mini-card strong {
          display: block;
          color: #f5c542;
          font-size: 20px;
          margin-bottom: 8px;
        }

        .kp-event-mini-card p,
        .kp-event-panel p,
        .kp-event-panel li {
          color: rgba(232,227,240,0.64);
          line-height: 1.6;
          font-size: 13px;
        }

        .kp-event-panel h3 {
          margin: 0 0 8px;
          color: #f5c542;
          font-size: 16px;
        }

        .kp-event-panel.highlight {
          background:
            radial-gradient(circle at top left, rgba(245,197,66,0.1), transparent 32%),
            rgba(255,255,255,0.05);
        }

        .kp-event-panel ul {
          margin: 0;
          padding-left: 18px;
        }

        .kp-month-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .kp-month-meta div {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          border-radius: 14px;
          padding: 10px;
        }

        .kp-month-meta span {
          display: block;
          color: rgba(232,227,240,0.48);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .kp-month-meta strong {
          color: #f5c542;
          font-size: 12px;
        }

        .kp-section-head.standalone {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.055);
          border-radius: 26px;
          padding: 22px;
          margin-bottom: 16px;
        }

        .kp-section-head.standalone p {
          margin: 10px 0 0;
          color: rgba(232, 227, 240, 0.64);
          line-height: 1.65;
        }

        .kp-forecast-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .kp-forecast-card {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035));
          border-radius: 26px;
          padding: 20px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
        }

        .kp-forecast-card.strong {
          border-color: rgba(34, 197, 94, 0.24);
        }

        .kp-forecast-card.moderate {
          border-color: rgba(245, 197, 66, 0.28);
        }

        .kp-forecast-card.blocked {
          border-color: rgba(248, 113, 113, 0.26);
        }

        .kp-month-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .kp-month-top span {
          color: #f5c542;
          font-weight: 950;
        }

        .kp-month-top strong {
          color: #fff;
          font-size: 20px;
        }

        .kp-forecast-card h3 {
          margin: 0 0 12px;
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        .kp-forecast-houses {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 12px;
        }

        .kp-forecast-houses em {
          font-style: normal;
          color: #140b00;
          background: linear-gradient(135deg, #f5c542, #ff9f1c);
          border-radius: 999px;
          padding: 5px 8px;
          font-size: 11px;
          font-weight: 950;
        }

        .kp-forecast-card p {
          color: rgba(232, 227, 240, 0.68);
          line-height: 1.65;
          font-size: 13px;
        }

        .kp-caution {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 12px;
          margin-top: 12px;
          color: rgba(232, 227, 240, 0.56);
          font-size: 12px;
          line-height: 1.5;
        }

        .kp-month-section {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 12px;
          margin-top: 10px;
        }

        .kp-month-section strong {
          display: block;
          color: #f5c542;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .kp-month-section p {
          margin: 0;
          color: rgba(232, 227, 240, 0.66);
          line-height: 1.58;
          font-size: 12px;
        }

        .kp-top-hints {
          max-width: 1180px;
          margin: 0 auto 18px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .kp-top-hints div {
          padding: 16px;
        }

        .kp-top-hints span {
          display: block;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .kp-top-hints p {
          margin: 0;
          color: rgba(232, 227, 240, 0.62);
          line-height: 1.5;
          font-size: 12px;
        }

        .kp-tabs {
          max-width: 1180px;
          margin: 0 auto 18px;
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }

        .kp-tabs button {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.055);
          color: rgba(232, 227, 240, 0.68);
          border-radius: 999px;
          padding: 11px 15px;
          cursor: pointer;
          font-weight: 900;
          white-space: nowrap;
        }

        .kp-tabs button.active {
          color: #140b00;
          background: linear-gradient(135deg, #f5c542, #ff9f1c);
        }

        .kp-card,
        .kp-events-grid {
          max-width: 1180px;
          margin: 0 auto 20px;
        }

        .kp-card {
          padding: 24px;
        }

        .kp-section-head {
          margin-bottom: 18px;
        }

        .kp-section-head h2 {
          margin: 8px 0 0;
          font-size: 30px;
          letter-spacing: -0.04em;
        }

        .kp-table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 12px 10px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
        }

        th {
          color: #f5c542;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11px;
        }

        td {
          color: rgba(232, 227, 240, 0.78);
        }

        tr.hit {
          background: rgba(245, 197, 66, 0.06);
        }

        .retro {
          margin-left: 5px;
          color: #fb7185;
        }

        .bhava-shift {
          display: inline-flex;
          margin-left: 6px;
          padding: 2px 6px;
          border-radius: 999px;
          background: rgba(245, 197, 66, 0.12);
          color: #f5c542;
          font-size: 10px;
          text-transform: uppercase;
        }

        .sub-pill {
          display: inline-flex;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px 8px;
          font-weight: 900;
        }

        .kp-events-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .kp-sig-card {
          padding: 20px;
        }

        .kp-sig-card.strong {
          border-color: rgba(34, 197, 94, 0.25);
        }

        .kp-sig-card.moderate {
          border-color: rgba(245, 197, 66, 0.25);
        }

        .kp-sig-card.blocked {
          border-color: rgba(248, 113, 113, 0.25);
        }

        .kp-sig-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: start;
        }

        .kp-sig-head h3 {
          margin: 0 0 6px;
          font-size: 22px;
        }

        .kp-sig-head p {
          margin: 0;
          color: rgba(232, 227, 240, 0.54);
          font-size: 12px;
        }

        .kp-verdict {
          display: inline-flex;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 950;
          white-space: nowrap;
        }

        .kp-verdict.strong {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.12);
        }

        .kp-verdict.moderate {
          color: #fbbf24;
          background: rgba(245, 197, 66, 0.12);
        }

        .kp-verdict.weak {
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.1);
        }

        .kp-verdict.blocked {
          color: #f87171;
          background: rgba(248, 113, 113, 0.12);
        }

        .kp-score-line {
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          margin: 16px 0;
          overflow: hidden;
        }

        .kp-score-line div {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #f5c542);
          border-radius: 999px;
        }

        .kp-mini-grid,
        .kp-detail-grid,
        .kp-guide-grid,
        .kp-house-grid {
          display: grid;
          gap: 12px;
        }

        .kp-mini-grid {
          grid-template-columns: repeat(4, 1fr);
          margin: 16px 0;
        }

        .kp-detail-grid,
        .kp-guide-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .kp-mini-grid div,
        .kp-detail-grid div,
        .kp-guide-grid div,
        .kp-house-cell,
        .kp-cusp-box,
        .kp-warning {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.045);
          border-radius: 18px;
          padding: 14px;
        }

        .kp-mini-grid span {
          display: block;
          color: rgba(232, 227, 240, 0.48);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 900;
          margin-bottom: 7px;
        }

        .kp-mini-grid strong {
          color: #f5c542;
        }

        .kp-detail-grid h4 {
          margin: 0 0 6px;
          color: #f5c542;
        }

        .kp-detail-grid p,
        .kp-cusp-box p,
        .kp-guide-grid p {
          margin: 0;
          color: rgba(232, 227, 240, 0.62);
          line-height: 1.55;
          font-size: 13px;
        }

        .kp-cusp-box {
          margin-top: 12px;
        }

        .kp-cusp-box strong {
          color: #f5c542;
        }

        .kp-actions {
          color: rgba(232, 227, 240, 0.7);
          line-height: 1.7;
          padding-left: 18px;
        }

        .kp-house-grid {
          grid-template-columns: repeat(6, 1fr);
        }

        .kp-house-cell span {
          display: block;
          color: rgba(232, 227, 240, 0.48);
          font-size: 12px;
          margin-bottom: 6px;
        }

        .kp-house-cell strong {
          font-size: 18px;
        }

        .guide p {
          max-width: 850px;
        }

        .kp-guide-grid {
          margin-top: 18px;
        }

        .kp-guide-grid strong {
          color: #f5c542;
        }

        .kp-warning {
          margin-top: 18px;
          color: rgba(232, 227, 240, 0.72);
          border-color: rgba(245, 197, 66, 0.18);
        }

        .kp-loading {
          position: fixed;
          right: 18px;
          bottom: 18px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(245, 197, 66, 0.14);
          color: #f5c542;
          border: 1px solid rgba(245, 197, 66, 0.24);
          font-weight: 800;
        }


        .kp-html-forecast-list {
          display: grid;
          gap: 18px;
        }

        .kp-html-month {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            radial-gradient(circle at top left, rgba(245, 197, 66, 0.09), transparent 28%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.035));
          border-radius: 30px;
          padding: 22px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
        }

        .kp-html-month.strong {
          border-color: rgba(34, 197, 94, 0.22);
        }

        .kp-html-month.moderate {
          border-color: rgba(245, 197, 66, 0.24);
        }

        .kp-html-month.blocked {
          border-color: rgba(248, 113, 113, 0.22);
        }

        .kp-html-month-head {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
          margin-bottom: 16px;
        }

        .kp-html-month-head span {
          color: #f5c542;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 11px;
          font-weight: 950;
        }

        .kp-html-month-head h3 {
          margin: 8px 0 4px;
          font-size: 30px;
          letter-spacing: -0.04em;
        }

        .kp-html-month-head p {
          margin: 0;
          color: rgba(232, 227, 240, 0.58);
        }

        .kp-probability-box {
          min-width: 150px;
          border: 1px solid rgba(245, 197, 66, 0.18);
          background: rgba(245, 197, 66, 0.08);
          border-radius: 22px;
          padding: 14px;
          text-align: center;
        }

        .kp-probability-box span {
          display: block;
          color: rgba(232, 227, 240, 0.52);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 900;
        }

        .kp-probability-box strong {
          display: block;
          color: #f5c542;
          font-size: 18px;
          margin: 5px 0;
        }

        .kp-probability-box em {
          font-style: normal;
          color: #ffffff;
          font-size: 24px;
          font-weight: 950;
        }

        .kp-dasha-strip {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.18);
          border-radius: 20px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .kp-dasha-strip strong {
          display: block;
          color: #f5c542;
          margin-bottom: 6px;
        }

        .kp-dasha-strip p {
          margin: 0;
          color: rgba(232, 227, 240, 0.66);
          line-height: 1.55;
        }

        .kp-html-sections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .kp-html-sections > div,
        .kp-month-advice {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.045);
          border-radius: 20px;
          padding: 14px;
        }

        .kp-html-section-title {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }

        .kp-html-section-title span,
        .kp-month-advice strong {
          color: #f5c542;
          font-weight: 950;
        }

        .kp-html-section-title em {
          color: rgba(232, 227, 240, 0.54);
          font-style: normal;
          font-size: 12px;
          font-weight: 900;
        }

        .kp-html-sections p,
        .kp-month-advice p {
          margin: 0;
          color: rgba(232, 227, 240, 0.64);
          line-height: 1.62;
          font-size: 13px;
        }

        .kp-month-advice {
          margin-top: 12px;
        }


        @media (max-width: 920px) {
          .kp-page {
            padding: 18px;
            padding-bottom: 90px;
          }

          .kp-header,
          .kp-top-hints,
          .kp-logic-note,
          .kp-events-grid,
          .kp-forecast-grid,
          .kp-event-picker,
          .kp-event-detail-grid,
          .kp-event-detail-grid.two,
          .kp-month-meta,
          .kp-html-sections,
          .kp-mini-grid,
          .kp-detail-grid,
          .kp-guide-grid,
          .kp-house-grid {
            grid-template-columns: 1fr;
          }

          .kp-html-month-head {
            display: grid;
          }

          .kp-probability-box {
            text-align: left;
          }

          .kp-selected-hero {
            display: grid;
          }
        }
      `}</style>
    </main>
  );
}
