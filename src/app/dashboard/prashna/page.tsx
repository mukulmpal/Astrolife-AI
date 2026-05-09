"use client";
import { useState } from "react";
import { calculatePrashna, type PrashnaResult, type PrashnaTopic } from "@/lib/astro-engine/prashna";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export default function PrashnaPage() {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState<PrashnaTopic>("general");
  const [lat, setLat] = useState("28.6139");
  const [lon, setLon] = useState("77.2090");
  const [tz, setTz] = useState("5.5");
  const [result, setResult] = useState<PrashnaResult | null>(null);

  const handleCalculate = () => {
    if (!question.trim()) return alert("Please enter your question");
    try {
      const res = calculatePrashna(question, topic, parseFloat(lat), parseFloat(lon), parseFloat(tz));
      setResult(res);
    } catch (e) {
      console.error(e);
      alert("Error calculating prashna");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
      <style>{`
        .prashna-hero { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; margin-bottom: 8px; color: "#a855f7"; }
        .prashna-form { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 24px; margin-bottom: 24px; max-width: 600px; }
        .prashna-form-group { margin-bottom: 16px; }
        .prashna-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: "#a855f7"; margin-bottom: 6px; letter-spacing: 1px; }
        .prashna-input, .prashna-select { width: 100%; background: #08051a; border: 1px solid #1c1840; border-radius: 8px; padding: 10px 14px; color: "#f0e8d0"; font-family: inherit; }
        .prashna-btn { width: 100%; background: linear-gradient(135deg, #7c3aed, #a855f7); border: none; border-radius: 8px; padding: 12px; color: "#f0e8d0"; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 16px; }
        .prashna-result { background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.05)); border: 2px solid #a855f7; border-radius: 12px; padding: 24px; margin-top: 24px; }
        .prashna-verdict { font-size: 32px; font-family: "Cormorant Garamond", serif; font-weight: 700; margin-bottom: 12px; }
        .prashna-detail { font-size: 14px; color: "#b8b0d8; line-height: 1.7; margin-bottom: 16px; }
        .prashna-factors { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .prashna-factor-box { background: #0d0a22; border: 1px solid #1c1840; border-radius: 8px; padding: 12px; }
        .prashna-factor-title { font-size: 12px; font-weight: 700; color: "#22c55e"; margin-bottom: 8px; text-transform: uppercase; }
        .prashna-factor-title.neg { color: "#ef4444"; }
        .prashna-factor-item { font-size: 11px; color: "#b8b0d8; margin-bottom: 6px; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="prashna-hero">❓ Prashna Kundali</div>
        <div style={{ fontSize: "14px", color: "#b8b0d8", marginBottom: "24px" }}>Vedic Horary Astrology · Ask Your Question · Get Cosmic Judgment</div>

        <div className="prashna-form">
          <div className="prashna-form-group">
            <div className="prashna-label">❓ Your Question</div>
            <input type="text" className="prashna-input" placeholder="Kya meri naukri change hogi?" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>

          <div className="prashna-form-group">
            <div className="prashna-label">📂 Topic</div>
            <select className="prashna-select" value={topic} onChange={(e) => setTopic(e.target.value as PrashnaTopic)}>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            <div className="prashna-form-group">
              <div className="prashna-label">📍 Lat</div>
              <input type="number" className="prashna-input" value={lat} onChange={(e) => setLat(e.target.value)} step="0.01" />
            </div>
            <div className="prashna-form-group">
              <div className="prashna-label">📍 Lon</div>
              <input type="number" className="prashna-input" value={lon} onChange={(e) => setLon(e.target.value)} step="0.01" />
            </div>
            <div className="prashna-form-group">
              <div className="prashna-label">🕐 TZ</div>
              <select className="prashna-select" value={tz} onChange={(e) => setTz(e.target.value)}>
                <option value="5.5">IST +5:30</option>
                <option value="0">UTC</option>
                <option value="1">CET +1</option>
                <option value="-5">EST -5</option>
                <option value="-8">PST -8</option>
              </select>
            </div>
          </div>

          <button className="prashna-btn" onClick={handleCalculate}>❓ Calculate Prashna</button>
        </div>

        {result && (
          <div className="prashna-result">
            <div className="prashna-verdict" style={{ color: result.color }}>{result.icon} {result.title}</div>
            <div className="prashna-detail">{result.detail}</div>
            <div style={{ fontSize: "12px", color: "#a855f7", marginBottom: "16px" }}>Score: {result.score}</div>

            <div className="prashna-factors">
              {result.positiveFactors.length > 0 && (
                <div className="prashna-factor-box">
                  <div className="prashna-factor-title">✅ Positive Factors</div>
                  {result.positiveFactors.map((f: string, i: number) => <div key={i} className="prashna-factor-item">• {f}</div>)}
                </div>
              )}
              {result.negativeFactors.length > 0 && (
                <div className="prashna-factor-box">
                  <div className="prashna-factor-title neg">⚠️ Negative Factors</div>
                  {result.negativeFactors.map((f: string, i: number) => <div key={i} className="prashna-factor-item">• {f}</div>)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
