"use client";

import { useState, useMemo, useCallback } from "react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import {
  calculatePrashna,
  type PrashnaTopic,
  type PrashnaResult,
} from "@/lib/astro-engine/prashna";

// ── Topic options ─────────────────────────────────────────────

const TOPIC_OPTIONS: { value: PrashnaTopic; label: string; emoji: string }[] = [
  { value: "career",    label: "Career & Naukri",    emoji: "💼" },
  { value: "marriage",  label: "Vivah & Prem",        emoji: "💑" },
  { value: "health",    label: "Swasthya",            emoji: "🏥" },
  { value: "finance",   label: "Dhan & Finance",      emoji: "💰" },
  { value: "travel",    label: "Yatra & Travel",      emoji: "✈️" },
  { value: "education", label: "Shiksha & Study",     emoji: "📚" },
  { value: "property",  label: "Makaan & Property",   emoji: "🏠" },
  { value: "legal",     label: "Kanooni & Legal",     emoji: "⚖️" },
  { value: "child",     label: "Santan & Children",   emoji: "👶" },
  { value: "general",   label: "Samaanya Prashna",    emoji: "🔮" },
];

const TZ_OPTIONS = [
  { label: "IST +5:30 (India)",       value: 5.5   },
  { label: "UTC +0:00",               value: 0     },
  { label: "CET +1:00 (Europe)",      value: 1     },
  { label: "Nepal +5:45",             value: 5.75  },
  { label: "EST -5:00 (New York)",    value: -5    },
  { label: "PST -8:00 (Los Angeles)", value: -8    },
];

const PLANET_ICONS: Record<string, string> = {
  Sun: "☀️", Moon: "🌙", Mars: "♂️", Mercury: "☿", Jupiter: "♃",
  Venus: "♀️", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

const RASHI_ICONS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

// ── Shared design tokens ──────────────────────────────────────

const BG      = "#060410";
const CARD_BG = "#0d0a22";
const BORDER  = "#1c1840";
const PURPLE  = "#a855f7";
const GOLD    = "#c8a030";

// ── Sub-components ────────────────────────────────────────────

function GlowDivider() {
  return (
    <div style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${PURPLE}55, transparent)`,
      margin: "0 auto",
      width: "80%",
    }} />
  );
}

interface InputProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, hint, children }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: `${PURPLE}cc`, textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>{hint}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0a0820",
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  color: "#fff",
  fontSize: 14,
  padding: "10px 14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a855f7' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 36,
};

// ── Verdict Card ──────────────────────────────────────────────

function VerdictCard({ judgment }: { judgment: PrashnaResult["judgment"] }) {
  const bg = judgment.color + "18";
  const border = judgment.color + "55";
  return (
    <div style={{
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: 20,
      padding: "28px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
        width: 200, height: 200, borderRadius: "50%",
        background: judgment.color + "22", filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>{judgment.icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: judgment.color, letterSpacing: "0.02em", marginBottom: 10, fontFamily: "'Cormorant Garamond', serif" }}>
        {judgment.title}
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 18px" }}>
        {judgment.detail}
      </div>

      {/* Score bar */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10,
        background: "rgba(0,0,0,0.35)", borderRadius: 100, padding: "6px 18px",
        border: `1px solid ${judgment.color}33` }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Prashna Score</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: judgment.color, fontFamily: "'Cormorant Garamond', serif" }}>{judgment.score >= 0 ? "+" : ""}{judgment.score}</span>
      </div>
    </div>
  );
}

// ── Factors List ──────────────────────────────────────────────

function FactorsList({ positive, negative }: { positive: string[]; negative: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Positive */}
      <div style={{ background: "#052010", border: "1px solid #16532a66", borderRadius: 16, padding: "18px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          ✅ Shubh Yog
        </p>
        {positive.length === 0 ? (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Koi shubh yog nahi mila.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {positive.map((f, i) => (
              <li key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }}>✦</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Negative */}
      <div style={{ background: "#200505", border: "1px solid #7f1d1d66", borderRadius: 16, padding: "18px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          ⚠️ Ashubh / Badha
        </p>
        {negative.length === 0 ? (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Koi ashubh yog nahi.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {negative.map((f, i) => (
              <li key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}>▸</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Planet Table ──────────────────────────────────────────────

function PlanetTable({ planets }: { planets: PrashnaResult["chart"]["planets"] }) {
  const rows = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          🪐 Graha Sthiti — Current Planet Positions
        </p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0a0820" }}>
              {["Graha", "Rashi", "Ghar (House)", "Nakshatra"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((name, idx) => {
              const p = planets[name];
              if (!p) return null;
              return (
                <tr key={name} style={{ background: idx % 2 === 0 ? "transparent" : "#ffffff05", transition: "background 0.15s" }}>
                  <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600 }}>
                    <span style={{ marginRight: 6 }}>{PLANET_ICONS[name] ?? "●"}</span>{name}
                  </td>
                  <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.85)" }}>
                    <span style={{ marginRight: 5 }}>{RASHI_ICONS[p.rashi] ?? ""}</span>{p.rashi}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      display: "inline-block", background: PURPLE + "25", color: PURPLE,
                      borderRadius: 6, padding: "2px 10px", fontWeight: 700, fontSize: 13,
                    }}>{p.house}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: GOLD, fontSize: 12 }}>{p.nakshatra}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── KP Significators Card ─────────────────────────────────────

function KPCard({ kp }: { kp: PrashnaResult["kp"] }) {
  const rows = [
    { label: "Lagna Lord", value: kp.lagnaLord, sub: `${kp.lagnaLordHouse}ve Ghar mein` },
    { label: "Chandra Ghar", value: `${kp.moonHouse}`, sub: kp.moonNakshatra + " Nakshatra" },
    { label: "Topic Karaka", value: kp.karakaName, sub: `${kp.karakaHouse}ve Ghar mein` },
    { label: "Shubh Ghar", value: kp.topicHouses.positive.join(", "), sub: "Positive houses" },
    { label: "Ashubh Ghar", value: kp.topicHouses.negative.join(", "), sub: "Negative houses" },
  ];

  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 18px" }}>
      <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        🧭 KP Significators
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(({ label, value, sub }) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            borderBottom: `1px solid ${BORDER}55`, paddingBottom: 10,
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{value}</span>
              {sub && <p style={{ margin: "1px 0 0", fontSize: 11, color: GOLD }}>{sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hora Card ─────────────────────────────────────────────────

function HoraCard({ hora }: { hora: PrashnaResult["chart"]["hora"] }) {
  const colorMap: Record<string, string> = {
    Sun: "#f97316", Moon: "#e2e8f0", Mars: "#ef4444",
    Mercury: "#22c55e", Jupiter: "#eab308", Venus: "#ec4899", Saturn: "#6366f1",
  };
  const c = colorMap[hora.planet] ?? PURPLE;

  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 18px" }}>
      <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        ⏰ Abhi Ki Hora
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: c + "22", border: `2px solid ${c}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          {PLANET_ICONS[hora.planet] ?? "●"}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Cormorant Garamond', serif" }}>
            {hora.planet} Hora
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            Aaj ka din: <span style={{ color: "rgba(255,255,255,0.75)" }}>{hora.lord} ka din</span>
          </p>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
        {hora.description}
      </p>
    </div>
  );
}

// ── Lagna Card ────────────────────────────────────────────────

function LagnaCard({ chart }: { chart: PrashnaResult["chart"] }) {
  const timeStr = chart.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = chart.timestamp.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{
      background: `linear-gradient(135deg, #160e30 0%, #0d0a22 100%)`,
      border: `1px solid ${PURPLE}44`,
      borderRadius: 16,
      padding: "20px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Prashna Lagna
        </p>
        <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: PURPLE, fontFamily: "'Cormorant Garamond', serif" }}>
          {RASHI_ICONS[chart.lagnaRashi] ?? ""} {chart.lagnaRashi}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: GOLD }}>Lagna #{chart.lagnaNum + 1}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Prashna Samay
        </p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{timeStr}</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{dateStr}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function PrashnaPage() {
  const [question, setQuestion] = useState("");
  const [topic, setTopic]       = useState<PrashnaTopic>("general");
  const [lat, setLat]           = useState(28.6139);
  const [lon, setLon]           = useState(77.209);
  const [tz, setTz]             = useState(5.5);
  const [result, setResult]     = useState<PrashnaResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const topicEmoji = useMemo(
    () => TOPIC_OPTIONS.find((t) => t.value === topic)?.emoji ?? "🔮",
    [topic]
  );

  const handleCalculate = useCallback(() => {
    if (!question.trim()) {
      setError("Kripya apna prashna likhein.");
      return;
    }
    setError(null);
    setLoading(true);

    // Small tick so UI updates before computation
    setTimeout(() => {
      try {
        const res = calculatePrashna({ question: question.trim(), topic, lat, lon, tz });
        setResult(res);
      } catch (e) {
        console.error(e);
        setError("Chart calculation mein kuch gadbad hui. Please dobara try karein.");
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [question, topic, lat, lon, tz]);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#fff", fontFamily: "'Outfit', sans-serif", paddingBottom: 100 }}>

      {/* Background starfield gradient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, #2d1b6922 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "0 16px" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: PURPLE + "18", border: `1px solid ${PURPLE}44`,
            borderRadius: 100, padding: "6px 18px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              Vedic Horary Astrology
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 700,
            fontFamily: "'Cormorant Garamond', serif",
            background: `linear-gradient(135deg, #fff 0%, ${PURPLE} 60%, ${GOLD} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "0 0 12px", lineHeight: 1.15,
          }}>
            ❓ Prashna Kundali
          </h1>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: 0, letterSpacing: "0.03em" }}>
            Vedic Horary Astrology · Ask Your Question · Get Cosmic Judgment
          </p>
        </div>

        <GlowDivider />

        {/* ── Intro card ── */}
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`,
          borderRadius: 20, padding: "24px 22px", margin: "28px 0",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: GOLD + "22", border: `1px solid ${GOLD}44`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>🕉️</div>
            <div>
              <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>
                Prashna Jyotish Kya Hai?
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                Prashna Kundali mein aapko apni <strong style={{ color: "#fff" }}>janam patrika ki zaroorat nahi</strong>. Aap jis pal apna prashn poochho — usi pal ka chart banta hai. Grahon ki sthiti se yeh judge kiya jaata hai ki aapka kaam hoga ya nahi.
              </p>
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                Vedic tradition mein Prashna ko sabse <strong style={{ color: "#fff" }}>tatkal aur seedha</strong> fal dene wali vidya maana jaata hai. <em style={{ color: GOLD }}>Jis pal prashn uthta hai, brahmand ka jawab tayar hota hai.</em>
              </p>
            </div>
          </div>
        </div>

        {/* ── Input Form ── */}
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`,
          borderRadius: 20, padding: "28px 22px", marginBottom: 28,
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', serif" }}>
            📝 Apna Prashna Darj Karein
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Question */}
            <FormField label="Aapka Prashn (Question)" hint="Seedha aur spasht prashn likhein. Jaise: 'Kya mujhe is saal naukri milegi?'">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Apna prashn yahan likhein..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </FormField>

            {/* Topic */}
            <FormField label={`Vishay (Topic) ${topicEmoji}`} hint="Sabse nazar anukool topic chunein">
              <select value={topic} onChange={(e) => setTopic(e.target.value as PrashnaTopic)} style={selectStyle}>
                {TOPIC_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: "#0d0a22" }}>
                    {opt.emoji} {opt.label}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Location */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: `${PURPLE}cc`, textTransform: "uppercase", marginBottom: 6, display: "block" }}>
                📍 Aapka Sthan (Location)
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField label="Latitude">
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 28.6139)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Longitude">
                  <input
                    type="number"
                    step="0.0001"
                    value={lon}
                    onChange={(e) => setLon(parseFloat(e.target.value) || 77.209)}
                    style={inputStyle}
                  />
                </FormField>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
                Default: New Delhi (28.6139°N, 77.2090°E). Apna sheher ka lat/lon Google se dekh sakte hain.
              </p>
            </div>

            {/* Timezone */}
            <FormField label="Samay Mandal (Timezone)">
              <select value={tz} onChange={(e) => setTz(parseFloat(e.target.value))} style={selectStyle}>
                {TZ_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: "#0d0a22" }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Error */}
            {error && (
              <div style={{
                background: "#ef444418", border: "1px solid #ef444455",
                borderRadius: 10, padding: "10px 14px",
                color: "#ef4444", fontSize: 13,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleCalculate}
              disabled={loading}
              style={{
                background: loading
                  ? "rgba(168,85,247,0.3)"
                  : `linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c026d3 100%)`,
                border: "none",
                borderRadius: 12,
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.04em",
                padding: "14px 28px",
                width: "100%",
                transition: "opacity 0.2s, transform 0.1s",
                boxShadow: loading ? "none" : "0 0 30px #a855f744",
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseOver={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              {loading ? "⏳ Chart ban raha hai..." : "❓ Abhi Prashna Chart Banao"}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeInUp 0.5s ease" }}>

            {/* Lagna + time */}
            <LagnaCard chart={result.chart} />

            {/* Verdict */}
            <VerdictCard judgment={result.judgment} />

            {/* Factors */}
            <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "20px 18px" }}>
              <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                📊 Yog Vishleshan — Analysis
              </p>
              <FactorsList
                positive={result.judgment.positiveFactors}
                negative={result.judgment.negativeFactors}
              />
            </div>

            {/* Planet table */}
            <PlanetTable planets={result.chart.planets} />

            {/* Hora + KP side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <HoraCard hora={result.chart.hora} />
              <KPCard kp={result.kp} />
            </div>

            {/* Question echo */}
            <div style={{
              background: CARD_BG, border: `1px solid ${BORDER}`,
              borderRadius: 16, padding: "18px 20px",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>
                {TOPIC_OPTIONS.find((t) => t.value === result.topic)?.emoji ?? "🔮"}
              </span>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Aapka Prashn
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 16, fontStyle: "italic", color: "#fff", lineHeight: 1.6, fontFamily: "'Cormorant Garamond', serif" }}>
                  &ldquo;{result.question}&rdquo;
                </p>
                <p style={{ margin: 0, fontSize: 12, color: GOLD }}>
                  Vishay: {TOPIC_OPTIONS.find((t) => t.value === result.topic)?.label}
                </p>
              </div>
            </div>

            {/* Divider before nav */}
            <GlowDivider />
          </div>
        )}

        {/* ── Empty state ── */}
        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "20px 0 40px", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
            <p>Upar apna prashn darj karein aur chart banayein.</p>
          </div>
        )}

      </div>

      <MobileBottomNav />

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        textarea:focus, input:focus, select:focus {
          border-color: ${PURPLE}88 !important;
          box-shadow: 0 0 0 3px ${PURPLE}22;
        }
      `}</style>
    </div>
  );
}
