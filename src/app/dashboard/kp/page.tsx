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
import { calculateDivisional } from "@/lib/astro-engine/divisional";
import { buildMarriageKPIntelligence } from "@/lib/astro-engine/marriage-intelligence-v2";
import {
  analyzeUniversalShodashaVarga,
  extractDashaInput,
  formatVargaLabel,
} from "@/lib/astro-intelligence/universal-shodasha-varga-engine";
import { EngineStateCard } from "@/components/engine-state-card";
import { useLanguage } from "@/lib/language-context";
import "@/app/dashboard/kp/kp.css";

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
        {row.retrograde ? <span className="retro" style={{marginLeft:6,fontWeight:600}}>(R)</span> : null}
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
  const marriageKP = useMemo(() => buildMarriageKPIntelligence(result), [result]);
  const kpVargaValidation = useMemo(() => {
    if (!chart?.planets) return [];
    const divs = calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
    const universal = analyzeUniversalShodashaVarga({
      language: "hinglish",
      birthTimeConfidence: 86,
      charts: divs,
      dasha: extractDashaInput(chart),
    });
    return universal.sections.filter((section) => ["D9", "D10", "D4", "D7"].includes(section.chart));
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

      <section className="kp-marriage-v2">
        <div>
          <span>Marriage Trigger Engine · KP Layer</span>
          <h2>{marriageKP.title}</h2>
          <p>{marriageKP.paragraph}</p>
        </div>
        <aside>
          <strong>{marriageKP.score}</strong>
          <em>{marriageKP.label.replaceAll("_", " ")}</em>
        </aside>
      </section>

      <section className="kp-varga-validation">
        <div className="kp-varga-validation-head">
          <span>KP + Varga Validation</span>
          <p>
            KP decides event promise through cusp, star lord and sub lord. Varga confirms whether the birth chart has
            enough domain support before timing is trusted.
          </p>
        </div>
        <div className="kp-varga-validation-grid">
          {kpVargaValidation.map((section) => (
            <div key={section.chart}>
              <strong>{section.chart}</strong>
              <span>{section.shortName}</span>
              <em>{section.score}/100</em>
              <p>{formatVargaLabel(section.label)} · KP houses H{section.kpPositiveHouses.join(" H")}</p>
            </div>
          ))}
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

      {loading && (
        <EngineStateCard
          title="KP Astrology"
          loading
          loadingText="Chart loading... KP significators will update automatically."
        />
      )}

    </main>
  );
}
