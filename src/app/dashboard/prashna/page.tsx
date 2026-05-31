"use client";
import { useEffect, useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { calculatePrashna, type PrashnaResult, type PrashnaTopic } from "@/lib/astro-engine/prashna";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

type CityResult = {
  displayName: string;
  latitude: number;
  longitude: number;
  timezone?: string | null;
};

function getTimeZoneHours(timeZone?: string | null) {
  if (!timeZone) return 5.5;
  try {
    const date = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);
    const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
    const asUtc = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));
    return Math.round(((asUtc - date.getTime()) / 3_600_000) * 10) / 10;
  } catch {
    return 5.5;
  }
}

export default function PrashnaPage() {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState<PrashnaTopic>("general");
  const [cityQuery, setCityQuery] = useState("Delhi");
  const [city, setCity] = useState<CityResult>({ displayName: "Delhi, IN", latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata" });
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lat, setLat] = useState("28.6139");
  const [lon, setLon] = useState("77.2090");
  const [tz, setTz] = useState("5.5");
  const [result, setResult] = useState<PrashnaResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = cityQuery.trim();
    if (query.length < 2) {
      return;
    }

    const timer = window.setTimeout(async () => {
      setCityLoading(true);
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setCityResults(Array.isArray(data) ? data : []);
      } catch {
        setCityResults([]);
      } finally {
        setCityLoading(false);
      }
    }, 240);

    return () => window.clearTimeout(timer);
  }, [cityQuery]);

  const selectCity = (nextCity: CityResult) => {
    setCity(nextCity);
    setCityQuery(nextCity.displayName);
    setLat(String(nextCity.latitude));
    setLon(String(nextCity.longitude));
    setTz(String(getTimeZoneHours(nextCity.timezone)));
    setCityResults([]);
  };

  const handleCalculate = () => {
    if (!question.trim()) { setError("Please enter your question"); return; }
    if (!Number.isFinite(parseFloat(lat)) || !Number.isFinite(parseFloat(lon))) {
      setError("Please choose a valid question city.");
      return;
    }
    setError("");
    try {
      const res = calculatePrashna(question, topic, parseFloat(lat), parseFloat(lon), parseFloat(tz));
      setResult(res);
    } catch (e) {
      console.error(e);
      setError("Error calculating prashna. Check coordinates.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "24px 18px 110px", color: "#f0e8d0" }}>
      <style>{`
        .pr-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
        .pr-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #8880a8; margin-bottom: 6px; }
        .pr-input, .pr-select { width: 100%; background: #08051a; border: 1px solid #1c1840; border-radius: 8px; padding: 10px 12px; color: #f0e8d0; font-family: inherit; font-size: 13px; }
        .pr-input:focus, .pr-select:focus { outline: none; border-color: rgba(168,85,247,0.5); }
        .pr-btn { width: 100%; background: linear-gradient(135deg, #7c3aed, #a855f7); border: none; border-radius: 8px; padding: 12px; color: #f0e8d0; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
        .pr-ghost-btn { background: transparent; border: 1px solid rgba(168,85,247,.35); color: #c4b5fd; border-radius: 8px; padding: 8px 10px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .pr-city-list { display: grid; gap: 6px; margin-top: 8px; }
        .pr-city-item { text-align: left; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); color: #d8d0ef; border-radius: 8px; padding: 8px 10px; cursor: pointer; font-size: 12px; }
        .pr-row { font-size: 12px; color: #b8b0d8; margin-bottom: 5px; display: flex; gap: 8px; }
        .pr-row strong { color: #f0e8d0; min-width: 90px; flex-shrink: 0; }
        .factor-item { font-size: 11px; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .planet-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; margin: 2px; border: 1px solid; }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700 }}>❓ Prashna Kundali</div>
          <div style={{ fontSize: "13px", color: "#8880a8", marginTop: "4px" }}>Vedic Horary Astrology · Hora Analysis · Karaka Check · Instant Judgment</div>
        </div>

        {/* Form */}
        <div className="pr-card">
          <div style={{ marginBottom: "14px" }}>
            <div className="pr-label">Your Question</div>
            <input
              type="text"
              className="pr-input"
              placeholder="Kya meri naukri change hogi?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCalculate()}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
            <div>
              <div className="pr-label">Topic</div>
              <select className="pr-select" value={topic} onChange={e => setTopic(e.target.value as PrashnaTopic)}>
                <option value="career">💼 Career</option>
                <option value="marriage">💑 Marriage</option>
                <option value="health">🏥 Health</option>
                <option value="finance">💰 Finance</option>
                <option value="travel">✈️ Travel</option>
                <option value="education">📚 Education</option>
                <option value="property">🏠 Property</option>
                <option value="legal">⚖️ Legal</option>
                <option value="child">👶 Child</option>
                <option value="general">🌟 General</option>
              </select>
            </div>
            <div>
              <div className="pr-label">Timezone</div>
              <select className="pr-select" value={tz} onChange={e => setTz(e.target.value)}>
                <option value="5.5">IST +5:30</option>
                <option value="0">UTC</option>
                <option value="1">CET +1</option>
                <option value="-5">EST -5</option>
                <option value="-8">PST -8</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div className="pr-label">Question City</div>
            <input
              type="text"
              className="pr-input"
              value={cityQuery}
              onChange={(e) => {
                const value = e.target.value;
                setCityQuery(value);
                if (value.trim().length < 2) setCityResults([]);
              }}
              placeholder="Search city, e.g. Delhi, Mumbai, London"
            />
            {cityLoading && <div style={{ fontSize: "11px", color: "#8880a8", marginTop: "6px" }}>Searching cities...</div>}
            {cityResults.length > 0 && (
              <div className="pr-city-list">
                {cityResults.map((item) => (
                  <button key={`${item.displayName}-${item.latitude}-${item.longitude}`} type="button" className="pr-city-item" onClick={() => selectCity(item)}>
                    {item.displayName}
                  </button>
                ))}
              </div>
            )}
            <div style={{ fontSize: "11px", color: "#8880a8", marginTop: "6px" }}>
              Using {city.displayName} for the exact Prashna moment.
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <button type="button" className="pr-ghost-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "Hide advanced coordinates" : "Advanced coordinates"}
            </button>
          </div>

          {showAdvanced && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <div className="pr-label">Latitude</div>
                <input type="number" className="pr-input" value={lat} onChange={e => setLat(e.target.value)} step="0.01" placeholder="28.6139" />
              </div>
              <div>
                <div className="pr-label">Longitude</div>
                <input type="number" className="pr-input" value={lon} onChange={e => setLon(e.target.value)} step="0.01" placeholder="77.2090" />
              </div>
              <div>
                <div className="pr-label">TZ Hours</div>
                <input type="number" className="pr-input" value={tz} onChange={e => setTz(e.target.value)} step="0.5" placeholder="5.5" />
              </div>
            </div>
          )}

          <div style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.18)", borderRadius: "8px", padding: "9px 11px", fontSize: "11px", color: "#b8b0d8", lineHeight: 1.6, marginBottom: "12px" }}>
            Prashna is judged for the place where the question is asked. City search keeps the experience clean; coordinates stay available only for advanced correction.
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{error}</div>}
          <button className="pr-btn" onClick={handleCalculate}>❓ Calculate Prashna — Ab Ka Muhurta</button>
        </div>

        {/* Result */}
        {result && (
          <>
            {/* Verdict */}
            <div style={{ background: `${result.color}11`, border: `2px solid ${result.color}55`, borderRadius: "14px", padding: "20px", marginBottom: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{result.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: result.color, marginBottom: "8px" }}>{result.title}</div>
              <div style={{ fontSize: "13px", color: "#b8b0d8", lineHeight: "1.7", marginBottom: "12px" }}>{result.detail}</div>
              <div style={{ display: "inline-block", background: `${result.color}22`, borderRadius: "20px", padding: "4px 16px", fontSize: "13px", fontWeight: 700, color: result.color }}>
                Score: {result.score > 0 ? "+" : ""}{result.score} · Confidence: {result.confidence}
              </div>
            </div>

            {/* Summary grid */}
            <div className="pr-card">
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#c8a030", marginBottom: "12px" }}>📋 Prashna Chart Summary</div>
              <div className="pr-row"><strong>Question:</strong> {result.question || result.topic}</div>
              <div className="pr-row"><strong>Time:</strong> {result.timestamp}</div>
              <div className="pr-row"><strong>Prashna Lagna:</strong> {result.lagnaRashi}</div>
              <div className="pr-row"><strong>Lagna Lord:</strong> {result.lagnaLord} in H{result.lagnaLordHouse}</div>
              <div className="pr-row"><strong>Moon:</strong> H{result.moonHouse} · {result.moonNakshatra} · {result.moonSign}</div>
              <div className="pr-row"><strong>Karaka:</strong> {result.karaka} in H{result.karakaHouse || "?"} {result.karakaFavorable ? "✅ Favorable" : "⚠️ Not in positive house"}</div>
              <div className="pr-row"><strong>Hora:</strong>
                <span style={{ color: result.horaFavorable ? "#22c55e" : "#f97316" }}>
                  {result.hora} Hora {result.horaFavorable ? "✅ Favorable" : "⚠️ Not optimal"}
                </span>
              </div>
              <div className="pr-row"><strong>Topic Houses:</strong>
                <span style={{ color: "#22c55e" }}>+[{result.topicHouses.positive.join(",")}]</span>
                <span style={{ color: "#ef4444", marginLeft: "8px" }}>−[{result.topicHouses.negative.join(",")}]</span>
              </div>
              {result.primaryHouseOccupants.length > 0 && (
                <div className="pr-row"><strong>H{result.primaryHouse} Planets:</strong> {result.primaryHouseOccupants.join(", ")}</div>
              )}
            </div>

            {/* Score breakdown */}
            <div className="pr-card">
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#c8a030", marginBottom: "10px" }}>🧮 Score Breakdown</div>
              {result.scoreBreakdown.map((item, i) => (
                <div key={`${item.label}-${i}`} className="factor-item" style={{ color: item.points > 0 ? "#86efac" : item.points < 0 ? "#fca5a5" : "#b8b0d8" }}>
                  <strong style={{ color: "#f0e8d0" }}>{item.label}</strong> {item.points > 0 ? "+" : ""}{item.points}: {item.note}
                </div>
              ))}
            </div>

            {/* Factors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {result.positiveFactors.length > 0 && (
                <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: "11px", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>✅ Positive Factors</div>
                  {result.positiveFactors.map((f, i) => <div key={i} className="factor-item" style={{ color: "#86efac" }}>• {f}</div>)}
                </div>
              )}
              {result.negativeFactors.length > 0 && (
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: "11px", color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>⚠️ Challenging Factors</div>
                  {result.negativeFactors.map((f, i) => <div key={i} className="factor-item" style={{ color: "#fca5a5" }}>• {f}</div>)}
                </div>
              )}
            </div>

            {/* Planet positions */}
            <div className="pr-card">
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#c4b5fd", marginBottom: "10px" }}>🪐 Prashna Planet Positions</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {Object.entries(result.planetPositions).map(([p, pd]) => (
                  <span key={p} className="planet-pill" style={{ background: `${pd.color}11`, borderColor: `${pd.color}33`, color: pd.color }}>
                    {pd.emoji} {p} H{pd.house} · {pd.sign}
                  </span>
                ))}
              </div>
            </div>

            {/* Practical advice */}
            <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "10px", padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#a855f7", marginBottom: "8px" }}>💡 Practical Advice</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.75" }}>{result.practicalAdvice}</div>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "#c4b5fd", marginTop: "12px", marginBottom: "6px" }}>Timing Window</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.75" }}>{result.timingWindow}</div>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "#c4b5fd", marginTop: "12px", marginBottom: "6px" }}>Decision Protocol</div>
              {result.decisionProtocol.map((line, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.65", padding: "3px 0" }}>{i + 1}. {line}</div>
              ))}
            </div>
          </>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
