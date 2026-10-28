"use client";

import { useEffect, useState } from "react";
import { calculatePrashna, type PrashnaResult, type PrashnaTopic } from "@/lib/astro-engine/prashna";
import NorthIndianChart from "@/components/north-indian-chart";

const PRASHNA_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function prashnaChartView(result: PrashnaResult, base: "lagna" | "moon" = "lagna") {
  const baseSign = base === "moon" ? result.moonSign : result.lagnaRashi;
  const lagnaNum = Math.max(0, PRASHNA_SIGNS.indexOf(baseSign));
  const planets: Record<string, { house: number; retrograde: boolean }> = {};
  for (const [name, pd] of Object.entries(result.planetPositions)) {
    if (base === "lagna") {
      planets[name] = { house: pd.house, retrograde: pd.isRetrograde || false };
      continue;
    }

    const signNum = Math.max(0, PRASHNA_SIGNS.indexOf(pd.sign));
    planets[name] = { house: ((signNum - lagnaNum + 12) % 12) + 1, retrograde: pd.isRetrograde || false };
  }
  return { lagnaNum, planets };
}

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
  const [mode, setMode] = useState<"clock_time" | "kp_number">("clock_time");
  const [kpSeed, setKpSeed] = useState<string>("108");
  const [cityQuery, setCityQuery] = useState("Delhi");
  const [city, setCity] = useState<CityResult>({ displayName: "Delhi, IN", latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata" });
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lat, setLat] = useState("28.6139");
  const [lon, setLon] = useState("77.2090");
  const [tz, setTz] = useState("5.5");
  const [result, setResult] = useState<PrashnaResult | null>(null);
  const [resultTab, setResultTab] = useState<"judgment" | "lagnaChart" | "moonChart" | "tenLayers">("judgment");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    if (!result) return;
    const text = `❓ PRASHNA KUNDALI SHASTRA REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question: ${result.question}
Topic: ${result.topic.toUpperCase()}
Timestamp: ${result.timestamp}

⚖️ 3-TIER VERDICT: ${result.shastricVerdict}
Status: ${result.title}
Detail: ${result.detail}

⏱️ PHALA PRAPTI KAALA (Timing):
${result.layer9PhalaPraptiKaala.timingText} (${result.layer9PhalaPraptiKaala.speedCategory})

🕉️ SHASTRA UPAYAS & REMEDIES:
• Action: ${result.layer10PrashnaUpaya.primaryRemedy}
• Deity: ${result.layer10PrashnaUpaya.deityToPropitiate} (Face ${result.layer10PrashnaUpaya.beneficDirection})
• Muhurta / Hora: ${result.layer10PrashnaUpaya.favorableHoraWindow}
• Offering / Daana: ${result.layer10PrashnaUpaya.donationSuggestion}

Generated via AstroLife Classical 10-Layer Prashna Engine`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  useEffect(() => {
    const query = cityQuery.trim();
    if (query.length < 2) return;

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
    if (!question.trim()) {
      setError("Please enter your question.");
      return;
    }
    if (!Number.isFinite(parseFloat(lat)) || !Number.isFinite(parseFloat(lon))) {
      setError("Please choose a valid question city.");
      return;
    }
    setError("");

    try {
      const seedNum = mode === "kp_number" ? parseInt(kpSeed, 10) : undefined;
      const res = calculatePrashna(
        question,
        topic,
        parseFloat(lat),
        parseFloat(lon),
        parseFloat(tz),
        seedNum
      );
      setResult(res);
    } catch (e) {
      console.error(e);
      setError("Error calculating Prashna. Please check inputs.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "24px 18px 120px", color: "#1A1A1A" }}>
      <style>{`
        .pr-card { background: #FFFFFF; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 16px; padding: 20px 22px; margin-bottom: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); }
        .pr-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #8A6008; margin-bottom: 6px; }
        .pr-input, .pr-select { width: 100%; background: #FAF8F5; border: 1px solid rgba(184, 134, 11, 0.25); border-radius: 10px; padding: 11px 14px; color: #1A1A1A; font-family: inherit; font-size: 13.5px; box-sizing: border-box; }
        .pr-input:focus, .pr-select:focus { outline: none; border-color: #B8860B; }
        .pr-btn { width: 100%; background: linear-gradient(135deg, #B8860B, #8A6008); border: none; border-radius: 10px; padding: 14px 18px; color: #FFFFFF; font-weight: 700; font-size: 14.5px; cursor: pointer; margin-top: 8px; box-shadow: 0 4px 14px rgba(184, 134, 11, 0.28); transition: transform 0.15s; }
        .pr-btn:active { transform: scale(0.99); }
        .pr-ghost-btn { background: #FAF8F5; border: 1px solid rgba(184,134,11,0.3); color: #8A6008; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .pr-city-list { display: grid; gap: 6px; margin-top: 8px; }
        .pr-city-item { text-align: left; background: #FAF8F5; border: 1px solid rgba(184, 134, 11, 0.22); color: #1A1A1A; border-radius: 8px; padding: 9px 12px; cursor: pointer; font-size: 12.5px; }
        .pr-city-item:hover { background: rgba(184, 134, 11, 0.1); }
        .pr-row { font-size: 13px; color: #4A4238; margin-bottom: 7px; display: flex; gap: 10px; line-height: 1.6; }
        .pr-row strong { color: #1A1A1A; min-width: 115px; flex-shrink: 0; font-weight: 700; }
        .factor-item { font-size: 12.5px; padding: 7px 0; border-bottom: 1px solid rgba(184, 134, 11, 0.12); line-height: 1.55; }
        .planet-pill { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; font-size: 11.5px; margin: 3px; border: 1px solid; }
        .tajaka-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
        .layer-box { background: #FAF8F5; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
        .layer-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; }
        .pr-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
        .pr-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        @media (max-width: 640px) {
          .pr-grid-2, .pr-grid-3 { grid-template-columns: 1fr !important; }
          .pr-card { padding: 16px 14px !important; }
          .pr-row { flex-direction: column !important; gap: 2px !important; }
          .pr-row strong { min-width: unset !important; }
        }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#B8860B" }}>
              Shastric Horary Astrology
            </span>
            <span style={{ fontSize: "9px", background: "rgba(34,197,94,0.12)", color: "#16a34a", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, border: "1px solid rgba(34,197,94,0.3)" }}>
              🌱 BASIC
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
            ❓ Prashna Kundali
          </h1>
          <p style={{ fontSize: "13.5px", color: "#6B635B", marginTop: "6px", lineHeight: 1.6 }}>
            10-Layer Classical Shastra Engine · 16 Tajaka Yogas · Panchanga Shuddhi · Badhakasthana · KP 1–249 Divine Seed · Day/Night Sahams
          </p>
        </div>

        {/* Input Card */}
        <div className="pr-card">
          {/* Mode Selector */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", background: "#FAF8F5", padding: "4px", borderRadius: "10px", border: "1px solid rgba(184, 134, 11, 0.2)" }}>
            <button
              type="button"
              onClick={() => setMode("clock_time")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: mode === "clock_time" ? "#FFFFFF" : "transparent",
                color: mode === "clock_time" ? "#8A6008" : "#6B635B",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
                boxShadow: mode === "clock_time" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              }}
            >
              🕒 Clock Time Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("kp_number")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: mode === "kp_number" ? "#FFFFFF" : "transparent",
                color: mode === "kp_number" ? "#8A6008" : "#6B635B",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
                boxShadow: mode === "kp_number" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              }}
            >
              🔢 KP Seed Number (1–249)
            </button>
          </div>

          {/* Question Input */}
          <div style={{ marginBottom: "14px" }}>
            <div className="pr-label">Your Specific Question (आपका प्रश्न)</div>
            <input
              type="text"
              className="pr-input"
              placeholder="e.g. Will I get the promotion this quarter? / Kya deal sign hogi?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            />
          </div>

          {/* Topic & KP Number Grid */}
          <div className="pr-grid-2">
            <div>
              <div className="pr-label">Topic Category</div>
              <select className="pr-select" value={topic} onChange={(e) => setTopic(e.target.value as PrashnaTopic)}>
                <option value="career">💼 Career & Status (H10)</option>
                <option value="marriage">💑 Marriage & Partnership (H7)</option>
                <option value="health">🏥 Health & Recovery (H1)</option>
                <option value="finance">💰 Wealth & Finance (H2)</option>
                <option value="travel">✈️ Travel & Visa (H9)</option>
                <option value="education">📚 Education & Exam (H5)</option>
                <option value="property">🏠 Property & Vehicle (H4)</option>
                <option value="legal">⚖️ Litigation & Win (H6)</option>
                <option value="child">👶 Child & Progeny (H5)</option>
                <option value="general">🌟 General Endeavor (H1)</option>
              </select>
            </div>

            {mode === "kp_number" ? (
              <div>
                <div className="pr-label">KP Divine Seed (1 to 249)</div>
                <input
                  type="number"
                  className="pr-input"
                  min="1"
                  max="249"
                  value={kpSeed}
                  onChange={(e) => setKpSeed(e.target.value)}
                  placeholder="Choose 1-249"
                />
              </div>
            ) : (
              <div>
                <div className="pr-label">Timezone</div>
                <select className="pr-select" value={tz} onChange={(e) => setTz(e.target.value)}>
                  <option value="5.5">IST (+5:30) · India</option>
                  <option value="0">UTC (+0:00) · London</option>
                  <option value="1">CET (+1:00) · Europe</option>
                  <option value="-5">EST (-5:00) · New York</option>
                  <option value="-8">PST (-8:00) · California</option>
                  <option value="4">GST (+4:00) · Dubai</option>
                  <option value="8">SGT (+8:00) · Singapore</option>
                </select>
              </div>
            )}
          </div>

          {/* City / Location */}
          <div style={{ marginBottom: "14px" }}>
            <div className="pr-label">Question City (Place of Query)</div>
            <input
              type="text"
              className="pr-input"
              value={cityQuery}
              onChange={(e) => {
                const value = e.target.value;
                setCityQuery(value);
                if (value.trim().length < 2) setCityResults([]);
              }}
              placeholder="Search city, e.g. Delhi, Mumbai, London, Dubai"
            />
            {cityLoading && <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "4px" }}>Searching locations...</div>}
            {cityResults.length > 0 && (
              <div className="pr-city-list">
                {cityResults.map((item) => (
                  <button
                    key={`${item.displayName}-${item.latitude}-${item.longitude}`}
                    type="button"
                    className="pr-city-item"
                    onClick={() => selectCity(item)}
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            )}
            <div style={{ fontSize: "11.5px", color: "#6B635B", marginTop: "6px" }}>
              Active Location: <strong>{city.displayName}</strong>
            </div>
          </div>

          {/* Advanced toggle */}
          <div style={{ marginBottom: "12px" }}>
            <button type="button" className="pr-ghost-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "Hide coordinates" : "⚙️ Advanced coordinates"}
            </button>
          </div>

          {showAdvanced && (
            <div className="pr-grid-3">
              <div>
                <div className="pr-label">Latitude</div>
                <input type="number" className="pr-input" value={lat} onChange={(e) => setLat(e.target.value)} step="0.01" />
              </div>
              <div>
                <div className="pr-label">Longitude</div>
                <input type="number" className="pr-input" value={lon} onChange={(e) => setLon(e.target.value)} step="0.01" />
              </div>
              <div>
                <div className="pr-label">TZ Offset</div>
                <input type="number" className="pr-input" value={tz} onChange={(e) => setTz(e.target.value)} step="0.5" />
              </div>
            </div>
          )}

          {error && <div style={{ color: "#DC2626", fontSize: "12.5px", marginBottom: "10px", fontWeight: 600 }}>{error}</div>}

          <button className="pr-btn" onClick={handleCalculate}>
            ❓ Cast Prashna Kundali (10-Layer Shastra)
          </button>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Tab Navigation */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              {[
                { id: "judgment", label: "⚖️ Shastric Judgment" },
                { id: "tenLayers", label: "📜 10 Shastra Layers" },
                { id: "lagnaChart", label: "🔯 Prashna Lagna" },
                { id: "moonChart", label: "🌙 Chandra Lagna" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setResultTab(tab.id as typeof resultTab)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: resultTab === tab.id ? "1px solid rgba(184,134,11,0.4)" : "1px solid rgba(184,134,11,0.2)",
                    background: resultTab === tab.id ? "rgba(184,134,11,0.14)" : "#FFFFFF",
                    color: resultTab === tab.id ? "#8A6008" : "#6B635B",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: JUDGMENT OVERVIEW */}
            {resultTab === "judgment" && (
              <>
                {/* Master 3-Tier Shastric Verdict Banner */}
                <div
                  style={{
                    background: "#FAF8F5",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                    borderLeft: `5px solid ${result.color}`,
                    borderRadius: "16px",
                    padding: "22px 24px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "42px", marginBottom: "8px" }}>{result.icon}</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: result.color, marginBottom: "4px" }}>
                    3-Tier Classical Verdict
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 700, color: result.color, marginBottom: "8px", lineHeight: 1.2 }}>
                    {result.title}
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#4A4238", lineHeight: "1.75", marginBottom: "14px", maxWidth: "600px", margin: "0 auto 14px" }}>
                    {result.detail}
                  </div>
                  <div style={{ display: "inline-flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "14px" }}>
                    <span style={{ background: `${result.color}22`, borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700, color: result.color, border: `1px solid ${result.color}40` }}>
                      Shastra: {result.shastricVerdict}
                    </span>
                    <span style={{ background: "rgba(184,134,11,0.12)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700, color: "#8A6008" }}>
                      Score: {result.score > 0 ? "+" : ""}{result.score} · {result.confidence.toUpperCase()} Confidence
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="pr-ghost-btn"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      {copied ? "✅ Copied Shastra Report!" : "📋 Copy Shastric Verdict & Remedies"}
                    </button>
                  </div>
                </div>

                {/* Tajaka Yogas Quick Strip */}
                {result.layer5TajakaYogas.length > 0 && (
                  <div className="pr-card" style={{ background: "linear-gradient(135deg, rgba(200,160,48,0.06), rgba(255,255,255,0.9))" }}>
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#8A6008", marginBottom: "10px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>✨ Active Tajaka Yogas (P.V.R. Narasimha Rao Ch. 29)</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {result.layer5TajakaYogas.map((y, i) => (
                        <div key={i} style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.2)", borderRadius: "10px", padding: "10px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontWeight: 700, fontSize: "13px", color: y.category === "Positive" ? "#16a34a" : "#dc2626" }}>
                              {y.name}
                            </span>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "5px", background: y.category === "Positive" ? "rgba(34,197,94,0.12)" : "rgba(220,38,38,0.12)", color: y.category === "Positive" ? "#16a34a" : "#dc2626" }}>
                              {y.power}
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: 1.55 }}>
                            {y.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Prashna Facts */}
                <div className="pr-card">
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#8A6008", marginBottom: "12px" }}>📋 Chart & Alignment Metrics</div>
                  <div className="pr-row"><strong>Question:</strong> {result.question}</div>
                  <div className="pr-row"><strong>Timestamp:</strong> {result.timestamp}</div>
                  <div className="pr-row"><strong>Prashna Lagna:</strong> {result.lagnaRashi} (Lord: {result.lagnaLord} in H{result.lagnaLordHouse})</div>
                  <div className="pr-row"><strong>Chandra:</strong> H{result.moonHouse} · {result.moonNakshatra} · {result.moonSign} ({result.moonVelocity === "fast" ? "Fast Moon ⚡" : result.moonVelocity === "slow" ? "Slow Moon ⏳" : "Normal Velocity"})</div>
                  <div className="pr-row"><strong>Karyesha:</strong> {result.karaka} in H{result.karakaHouse} {result.karakaFavorable ? "✅ Favorable house" : "⚠️ Needs strengthening"}</div>
                  <div className="pr-row"><strong>Active Hora:</strong> {result.hora} Hora {result.horaFavorable ? "✅ Favorable for query" : "⚠️ Neutral/Wait"}</div>
                  <div className="pr-row"><strong>Saham:</strong> {result.saham.name} in H{result.saham.house} ({result.saham.favorable ? "✅ Fortunate" : "⚠️ Challenging house"})</div>
                  <div className="pr-row"><strong>Ruling Planets:</strong> {result.layer8RulingPlanets.status === "RP_CONFIRMED" ? "✅ Confirmed (Lagnesha & Karyesha match)" : "⚠️ Partial / Discordant"}</div>
                </div>

                {/* Phala Prapti Kaala & Upayas */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px", marginBottom: "16px" }}>
                  <div style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.25)", borderLeft: "4px solid #B8860B", borderRadius: "14px", padding: "16px 18px" }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#8A6008", marginBottom: "6px" }}>
                      ⏱️ Phala Prapti Kaala (Event Manifestation Window)
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>
                      {result.layer9PhalaPraptiKaala.timingText}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B635B", lineHeight: 1.5 }}>
                      Mobility: {result.layer9PhalaPraptiKaala.lagnaMobility} · {result.layer9PhalaPraptiKaala.moonVelocityFactor}
                    </div>
                  </div>

                  <div style={{ background: "#FAF8F5", border: "1px solid rgba(22, 163, 74, 0.25)", borderLeft: "4px solid #16a34a", borderRadius: "14px", padding: "16px 18px" }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#16a34a", marginBottom: "6px" }}>
                      🕉️ Prashna Upaya & Remedial Resolution
                    </div>
                    <div style={{ fontSize: "13px", color: "#1A1A1A", lineHeight: 1.6, marginBottom: "8px" }}>
                      <strong>Primary Action:</strong> {result.layer10PrashnaUpaya.primaryRemedy}
                    </div>
                    <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: 1.55 }}>
                      • <strong>Propitiate:</strong> {result.layer10PrashnaUpaya.deityToPropitiate}<br />
                      • <strong>Benefic Direction:</strong> Facing {result.layer10PrashnaUpaya.beneficDirection}<br />
                      • <strong>Auspicious Window:</strong> {result.layer10PrashnaUpaya.favorableHoraWindow}<br />
                      • <strong>Donation:</strong> {result.layer10PrashnaUpaya.donationSuggestion}
                    </div>
                  </div>
                </div>

                {/* Score breakdown & factors */}
                <div className="pr-grid-2">
                  {result.positiveFactors.length > 0 && (
                    <div style={{ background: "#FAF8F5", border: "1px solid rgba(21,128,61,0.25)", borderLeft: "4px solid #15803D", borderRadius: "12px", padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: "11px", color: "#15803D", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        ✅ Positive Pillars
                      </div>
                      {result.positiveFactors.map((f, i) => (
                        <div key={i} className="factor-item" style={{ color: "#15803D" }}>• {f}</div>
                      ))}
                    </div>
                  )}
                  {result.negativeFactors.length > 0 && (
                    <div style={{ background: "#FAF8F5", border: "1px solid rgba(220,38,38,0.25)", borderLeft: "4px solid #DC2626", borderRadius: "12px", padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: "11px", color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        ⚠️ Obstacle Pillars
                      </div>
                      {result.negativeFactors.map((f, i) => (
                        <div key={i} className="factor-item" style={{ color: "#DC2626" }}>• {f}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Planet positions */}
                <div className="pr-card">
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#8A6008", marginBottom: "10px" }}>🪐 Planetary Sky at Prashna Moment</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {Object.entries(result.planetPositions).map(([p, pd]) => (
                      <span key={p} className="planet-pill" style={{ background: `${pd.color}15`, borderColor: `${pd.color}40`, color: pd.color, fontWeight: 600 }}>
                        {pd.emoji} {p} H{pd.house} · {pd.sign} ({pd.degrees}°) {pd.isRetrograde ? "℞" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: COMPLETE 10 SHASTRA LAYERS DEEP DIVE */}
            {resultTab === "tenLayers" && (
              <div className="pr-card">
                <div style={{ fontWeight: 700, fontSize: "16px", color: "#8A6008", marginBottom: "16px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  📜 10-Layer Shastra Architecture Inspection
                </div>

                {/* Layer 1 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: result.layer1PanchangShuddhi.isBhadraActive ? "#dc2626" : "#8A6008" }}>
                    <span>Layer 1 · Panchanga Shuddhi & Bhadra (Vishti) Check</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: result.layer1PanchangShuddhi.isBhadraActive ? "rgba(220,38,38,0.12)" : "rgba(34,197,94,0.12)", color: result.layer1PanchangShuddhi.isBhadraActive ? "#dc2626" : "#16a34a" }}>
                      {result.layer1PanchangShuddhi.shuddhiVerdict}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    • Tithi: <strong>{result.layer1PanchangShuddhi.tithi}</strong> {result.layer1PanchangShuddhi.isRiktaTithi ? "⚠️ (Rikta Tithi)" : "✅"}<br />
                    • Karana: <strong>{result.layer1PanchangShuddhi.karana}</strong> {result.layer1PanchangShuddhi.isBhadraActive ? "🚨 VISHTI BHADRA ACTIVE (Prohibits contracts/travel)" : "✅ (Pure Karana)"}<br />
                    • Yoga: <strong>{result.layer1PanchangShuddhi.yoga}</strong> {result.layer1PanchangShuddhi.isAshubhaYoga ? "⚠️ (Ashubha Yoga)" : "✅"}<br />
                    • Vara Lord: <strong>{result.layer1PanchangShuddhi.varaLord}</strong> ({result.layer1PanchangShuddhi.weekday})<br />
                    • Sun Window: Sunrise {result.layer1PanchangShuddhi.sunrise} · Sunset {result.layer1PanchangShuddhi.sunset}
                  </div>
                </div>

                {/* Layer 2 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 2 · Chitta Vritti (Querent&apos;s Mind via Moon)</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: result.layer2ChittaVritti.isAlignedWithQuery ? "rgba(34,197,94,0.12)" : "rgba(234,88,12,0.12)", color: result.layer2ChittaVritti.isAlignedWithQuery ? "#16a34a" : "#ea580c" }}>
                      {result.layer2ChittaVritti.isAlignedWithQuery ? "Shuddha (Aligned)" : "Antar-Chinta (Divergence)"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    Moon occupies <strong>House {result.layer2ChittaVritti.moonHouse}</strong>. {result.layer2ChittaVritti.interpretation}
                  </div>
                </div>

                {/* Layer 3 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 3 · Directional Nature of Query</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(184,134,11,0.12)", color: "#8A6008" }}>
                      {result.layer3DirectionalNature.signNature}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    {result.layer3DirectionalNature.meaning}
                  </div>
                </div>

                {/* Layer 4 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: result.layer4Badhaka.isAfflicted ? "#dc2626" : "#8A6008" }}>
                    <span>Layer 4 · Badhakasthana & Marakasthana Analysis</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: result.layer4Badhaka.isAfflicted ? "rgba(220,38,38,0.12)" : "rgba(34,197,94,0.12)", color: result.layer4Badhaka.isAfflicted ? "#dc2626" : "#16a34a" }}>
                      {result.layer4Badhaka.isAfflicted ? "Obstacle Active" : "Unobstructed"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    Lagna Mobility: <strong>{result.layer4Badhaka.lagnaType}</strong> · Badhaka House: <strong>H{result.layer4Badhaka.badhakaHouse}</strong> (Lord: {result.layer4Badhaka.badhakesh} in H{result.layer4Badhaka.badhakeshHouse}).<br />
                    {result.layer4Badhaka.explanation}
                  </div>
                </div>

                {/* Layer 5 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 5 · 16 Tajaka Yogas Engine (PVR Rao Ch. 29)</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(184,134,11,0.12)", color: "#8A6008" }}>
                      {result.layer5TajakaYogas.length} Active
                    </span>
                  </div>
                  {result.layer5TajakaYogas.length === 0 ? (
                    <div style={{ fontSize: "12.5px", color: "#6B635B" }}>No direct applying Ithasala or Eesarpha between Lagnesha and Karyesha. Outcome rests on secondary house lords.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {result.layer5TajakaYogas.map((y, idx) => (
                        <div key={idx} style={{ fontSize: "12.5px", color: "#4A4238" }}>
                          • <strong>{y.name}</strong> ({y.power}): {y.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Layer 6 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 6 · Saham (Arabic Part) with Day/Night Inversion</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: result.layer6Saham.favorable ? "rgba(34,197,94,0.12)" : "rgba(220,38,38,0.12)", color: result.layer6Saham.favorable ? "#16a34a" : "#dc2626" }}>
                      {result.layer6Saham.favorable ? "Favorable" : "Challenging"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    • Saham: <strong>{result.layer6Saham.name}</strong> in H{result.layer6Saham.sahamHouse} ({result.layer6Saham.sahamSign}), Lord: {result.layer6Saham.sahamLord}<br />
                    • Formula: {result.layer6Saham.formulaDescription}<br />
                    • Assessment: {result.layer6Saham.explanation}
                  </div>
                </div>

                {/* Layer 7 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 7 · KP Horary & Cuspal Sub-Lords (Prof. Krishnamurti)</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(184,134,11,0.12)", color: "#8A6008" }}>
                      {result.layer7KPHorary.mode.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    {result.layer7KPHorary.horaryNumber ? `• KP Seed: #${result.layer7KPHorary.horaryNumber}\n` : ""}
                    • Lagna Sign Lord: {result.layer7KPHorary.lagnaSignLord} · Star Lord: {result.layer7KPHorary.lagnaStarLord} · Sub Lord: {result.layer7KPHorary.lagnaSubLord}<br />
                    • Cusp H{result.layer7KPHorary.queryCuspNumber} Sub-Lord: {result.layer7KPHorary.queryCuspSubLord}<br />
                    • {result.layer7KPHorary.analysis}
                  </div>
                </div>

                {/* Layer 8 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 8 · 5-Fold Ruling Planets (RP) Synchronization</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: result.layer8RulingPlanets.status === "RP_CONFIRMED" ? "rgba(34,197,94,0.12)" : "rgba(184,134,11,0.12)", color: result.layer8RulingPlanets.status === "RP_CONFIRMED" ? "#16a34a" : "#8A6008" }}>
                      {result.layer8RulingPlanets.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    • Day Lord: {result.layer8RulingPlanets.dayLord} · Moon Sign: {result.layer8RulingPlanets.moonSignLord} · Moon Star: {result.layer8RulingPlanets.moonStarLord}<br />
                    • Lagna Sign: {result.layer8RulingPlanets.lagnaSignLord} · Lagna Star: {result.layer8RulingPlanets.lagnaStarLord}<br />
                    • {result.layer8RulingPlanets.explanation}
                  </div>
                </div>

                {/* Layer 9 */}
                <div className="layer-box">
                  <div className="layer-title" style={{ color: "#8A6008" }}>
                    <span>Layer 9 · Phala Prapti Kaala (Manifestation Timing)</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(184,134,11,0.12)", color: "#8A6008" }}>
                      {result.layer9PhalaPraptiKaala.speedCategory}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    Calculated Window: <strong>{result.layer9PhalaPraptiKaala.timingText}</strong> (based on {result.layer9PhalaPraptiKaala.degreeDifference}° separation and {result.layer9PhalaPraptiKaala.lagnaMobility}).
                  </div>
                </div>

                {/* Layer 10 */}
                <div className="layer-box" style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.3)" }}>
                  <div className="layer-title" style={{ color: "#16a34a" }}>
                    <span>Layer 10 · Prashna Upayas & Remedial Prescription</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(34,197,94,0.14)", color: "#16a34a" }}>
                      Shanti Remedy
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4A4238", lineHeight: 1.6 }}>
                    • Primary Upaya: <strong>{result.layer10PrashnaUpaya.primaryRemedy}</strong><br />
                    • Deity: <strong>{result.layer10PrashnaUpaya.deityToPropitiate}</strong> · Facing: {result.layer10PrashnaUpaya.beneficDirection}<br />
                    • Muhurta Window: {result.layer10PrashnaUpaya.favorableHoraWindow}<br />
                    • Offering: {result.layer10PrashnaUpaya.donationSuggestion}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3 & 4: CHARTS */}
            {(resultTab === "lagnaChart" || resultTab === "moonChart") && (
              <div className="pr-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "#B8860B" }}>
                  {resultTab === "lagnaChart"
                    ? `Prashna Lagna Kundali · ${result.lagnaRashi}`
                    : `Chandra Lagna Kundali · ${result.moonSign}`}
                </div>
                <p style={{ margin: 0, maxWidth: 520, textAlign: "center", fontSize: 12.5, color: "#6B635B", lineHeight: 1.7 }}>
                  {resultTab === "lagnaChart"
                    ? "Reveals event outcome, external circumstances, physical obstacles, and whether the intention materializes."
                    : "Reveals the questioner's subconscious anxiety, emotional clarity, and internal psychological alignment."}
                </p>
                <NorthIndianChart {...prashnaChartView(result, resultTab === "lagnaChart" ? "lagna" : "moon")} size={320} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
