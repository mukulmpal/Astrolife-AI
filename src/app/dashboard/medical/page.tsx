"use client";

import { useMemo, useState } from "react";
import "@/app/dashboard/shared.css";
import { useUserChart } from "@/lib/user-chart";
import { calculateMedical, type MedicalResult, type HealthAlert } from "@/lib/astro-engine/medical";
import { EngineStateCard } from "@/components/engine-state-card";
import { PremiumFeature } from "@/components/premium-feature";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// ── Severity badge ────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const cfg = {
    high:   { bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.25)", label: "HIGH" },
    medium: { bg: "rgba(251,146,60,0.12)",  color: "#fb923c", border: "rgba(251,146,60,0.25)",  label: "MED"  },
    low:    { bg: "rgba(45,212,191,0.12)",  color: "#2dd4bf", border: "rgba(45,212,191,0.25)",  label: "LOW"  },
  }[severity];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px",
      borderRadius: 20, fontSize: 9, letterSpacing: "1.2px", fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>{cfg.label}</span>
  );
}

// ── Alert card ────────────────────────────────────────────────
function AlertCard({ alert }: { alert: HealthAlert }) {
  const [open, setOpen] = useState(false);

  const typeIcon: Record<string, string> = {
    natal: "🪐", combination: "⚡", nakshatra: "⭐", lagna: "♈",
  };

  const severityBorder = {
    high: "rgba(248,113,113,0.2)", medium: "rgba(251,146,60,0.18)", low: "rgba(45,212,191,0.15)",
  }[alert.severity];

  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        background: "#0d0a22",
        border: `1px solid ${open ? severityBorder : "#1c1840"}`,
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "border-color 0.2s",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{typeIcon[alert.type] ?? "🔹"}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15, color: "#f0e8d0", fontWeight: 600 }}>
              {alert.planet}
            </span>
            {alert.house > 0 && (
              <span style={{ fontSize: 11, color: "#605890" }}>· House {alert.house}</span>
            )}
            <SeverityBadge severity={alert.severity} />
          </div>
          <div style={{ fontSize: 12, color: "#c8c0a8", marginTop: 3, lineHeight: 1.5 }}>
            {alert.disease}
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#3a3060", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid #1c1840",
          fontSize: 12,
          color: "#8b80bf",
          lineHeight: 1.7,
        }}>
          {alert.note}
        </div>
      )}
    </div>
  );
}

// ── Health score bar ─────────────────────────────────────────
function ScoreBar({ label, value, icon }: { label: string; value: number; icon: string }) {
  const color = value >= 60 ? "#f87171" : value >= 30 ? "#fbbf24" : "#2dd4bf";
  const tier = value >= 60 ? "Elevated" : value >= 30 ? "Moderate" : "Low Risk";

  return (
    <div style={{
      background: "#0d0a22",
      border: "1px solid #1c1840",
      borderRadius: 12,
      padding: "14px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15, color: "#f0e8d0", fontWeight: 600 }}>
            {label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 9, letterSpacing: "1px", padding: "2px 7px",
            borderRadius: 20, background: `${color}18`, color, border: `1px solid ${color}30`,
          }}>{tier}</span>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color }}>{value}</span>
        </div>
      </div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

// ── Accident risk meter ───────────────────────────────────────
function AccidentMeter({ risk }: { risk: number }) {
  const color = risk >= 60 ? "#f87171" : risk >= 30 ? "#fbbf24" : "#2dd4bf";
  const label = risk >= 60 ? "High Risk" : risk >= 30 ? "Moderate" : "Low Risk";

  // Semi-circle gauge
  const angle = (risk / 100) * 180;
  const rad = (angle - 90) * (Math.PI / 180);
  const cx = 90, cy = 90, r = 70;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);

  return (
    <div style={{
      background: "#0d0a22",
      border: `1px solid ${color}25`,
      borderRadius: 16,
      padding: "20px 16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#f87171", marginBottom: 8 }}>
        Accident Risk Meter
      </div>
      <svg viewBox="0 0 180 100" style={{ maxWidth: 200, display: "block", margin: "0 auto" }}>
        {/* Track arc */}
        <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="#1c1840" strokeWidth="10" strokeLinecap="round" />
        {/* Fill arc */}
        {risk > 0 && (
          <path
            d={`M 20 90 A 70 70 0 ${angle > 180 ? 1 : 0} 1 ${nx.toFixed(1)} ${ny.toFixed(1)}`}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx.toFixed(1)} y2={ny.toFixed(1)}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill={color} />
        {/* Labels */}
        <text x="16" y="106" fontSize="7" fill="#3a3060" textAnchor="middle">0</text>
        <text x="164" y="106" fontSize="7" fill="#3a3060" textAnchor="middle">100</text>
        <text x={cx} y={cy - 18} fontSize="18" fill={color} fontWeight="700"
          textAnchor="middle" fontFamily="Cormorant Garamond, serif">{risk}</text>
        <text x={cx} y={cy - 6} fontSize="7" fill={color} textAnchor="middle">{label}</text>
      </svg>
      <div style={{ fontSize: 12, color: "#605890", marginTop: 8, lineHeight: 1.6 }}>
        {risk >= 60
          ? "Classical combinations for trauma/accidents present — take protective measures."
          : risk >= 30
            ? "Moderate indicators — situational caution recommended."
            : "Low natal accident indicators in chart."}
      </div>
    </div>
  );
}

// ── Planet type icon ─────────────────────────────────────────
const PLANET_ICONS: Record<string, string> = {
  Sun: "☀️", Moon: "🌙", Mars: "♂️", Mercury: "☿", Jupiter: "♃",
  Venus: "♀️", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

// ── Main Page ─────────────────────────────────────────────────
type Tab = "natal" | "scores" | "risks";

export default function MedicalPage() {
  const { birth, chart, loading } = useUserChart();
  const [activeTab, setActiveTab] = useState<Tab>("natal");

  const result: MedicalResult = useMemo(() => calculateMedical(chart), [chart]);

  if (loading) {
    return (
      <div className="page">
        <EngineStateCard title="🏥 Medical Astrology" loading loadingText="Analysing your natal chart…" />
        <MobileBottomNav />
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="page">
        <EngineStateCard title="🏥 Medical Astrology" emptyText="Please complete onboarding to unlock Medical Analysis." />
        <MobileBottomNav />
      </div>
    );
  }

  const highAlerts = result.alerts.filter((a) => a.severity === "high");
  const medAlerts  = result.alerts.filter((a) => a.severity === "medium");
  const lowAlerts  = result.alerts.filter((a) => a.severity === "low");

  const SCORE_ICONS: Record<keyof typeof result.scores, string> = {
    Heart: "❤️", Digestive: "🫁", Mental: "🧠", Eye: "👁️",
    Bone: "🦴", Respiratory: "🫧", Reproductive: "🌸", Skin: "🪷",
  };

  const prakritiColor = result.prakriti.startsWith("Pitta") ? "#f87171"
    : result.prakriti.startsWith("Kapha")  ? "#60a5fa"
    : "#2dd4bf";

  return (
    <div className="page" style={{ paddingBottom: 120 }}>
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="page-tag">🏥 Medical Astrology</div>
      <h1 className="page-title serif">
        Medical <em>Analysis</em>
      </h1>
      <p className="page-sub">
        Dr. S. Krishna Kumar Method · Natal + Pattern Detection
      </p>

      {/* ── Disclaimer banner ────────────────────────────────── */}
      <div style={{
        background: "rgba(248,113,113,0.05)",
        border: "1px solid rgba(248,113,113,0.25)",
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 24,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚕️</span>
        <p style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.7, margin: 0 }}>
          <strong>Pattern-detection + awareness layer only.</strong> Ye data aapki natal chart ke planetary patterns pe based hai.
          Diagnosis ke liye registered doctor se milein. Yahan di gayi information medical advice nahi hai.
        </p>
      </div>

      {/* ── Header card ──────────────────────────────────────── */}
      <div className="header-card" style={{ marginBottom: 24 }}>
        <div className="header-orb" style={{ background: "radial-gradient(circle, rgba(248,113,113,0.10) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#f87171", marginBottom: 6 }}>
            🏥 Medical Profile
          </div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 600, color: "#f0e8d0" }}>
            {birth.name}
          </div>
          <div style={{ fontSize: 13, color: "#605890", marginTop: 4 }}>
            {new Date(birth.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}{birth.tob}{" · "}{birth.city}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#2dd4bf", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 20, padding: "3px 10px" }}>
              {result.lagnaSign} Lagna
            </span>
            {result.birthNakshatra && (
              <span style={{ fontSize: 12, color: "#c8a030", background: "rgba(200,160,48,0.08)", border: "1px solid rgba(200,160,48,0.2)", borderRadius: 20, padding: "3px 10px" }}>
                {result.birthNakshatra} Nakshatra
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <div className="hstat">
            <div className="hstat-n" style={{ color: "#f87171" }}>{highAlerts.length}</div>
            <div className="hstat-l">HIGH</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{ color: "#fb923c" }}>{medAlerts.length}</div>
            <div className="hstat-l">MEDIUM</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{ color: "#2dd4bf" }}>{lowAlerts.length}</div>
            <div className="hstat-l">LOW</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{ color: "#f87171", fontSize: 22 }}>{result.accidentRisk}</div>
            <div className="hstat-l">ACCIDENT</div>
          </div>
        </div>
      </div>

      {/* ── Top concerns strip ────────────────────────────────── */}
      {result.topConcerns.length > 0 && (
        <div className="summary-strip" style={{ marginBottom: 24, borderColor: "rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.04)" }}>
          <strong style={{ color: "#f87171" }}>Top Concerns: </strong>
          {result.topConcerns.map((c, i) => (
            <span key={c}>
              {i > 0 && " · "}
              <span style={{ color: "#f0e8d0" }}>{c}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {([ "natal", "scores", "risks"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = {
            natal: "Natal Analysis",
            scores: "Health Scores",
            risks: "Risk Factors",
          };
          return (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ══ TAB 1: Natal Analysis ════════════════════════════════ */}
      {activeTab === "natal" && (
        <div>
          {/* Prakriti card */}
          <div className="card" style={{ marginBottom: 16, borderColor: `${prakritiColor}25` }}>
            <div className="card-tag">Tridosha Prakriti</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${prakritiColor}18`, border: `1px solid ${prakritiColor}30`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                🫀
              </div>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#f0e8d0", fontWeight: 600, marginBottom: 4 }}>
                  {result.lagnaSign} Prakriti
                </div>
                <div style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>
                  {result.prakriti}
                </div>
              </div>
            </div>
          </div>

          {/* Nakshatra disease tendency */}
          {result.nakshatraDisease && (
            <div className="card" style={{ marginBottom: 16, borderColor: "rgba(200,160,48,0.2)" }}>
              <div className="card-tag">Birth Nakshatra Disease Tendency</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "rgba(200,160,48,0.1)", border: "1px solid rgba(200,160,48,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  ⭐
                </div>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#f0e8d0", fontWeight: 600, marginBottom: 4 }}>
                    {result.birthNakshatra}
                  </div>
                  <div style={{ fontSize: 13, color: "#f87171", marginBottom: 4 }}>
                    {result.nakshatraDisease.disease}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#2dd4bf", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", borderRadius: 20, padding: "2px 8px" }}>
                      Body: {result.nakshatraDisease.body}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#8b80bf", lineHeight: 1.6 }}>
                    {result.nakshatraDisease.note}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lagna sign disease */}
          {result.lagnaDiseaseSign && (
            <div className="card" style={{ marginBottom: 24, borderColor: "rgba(45,212,191,0.2)" }}>
              <div className="card-tag">Lagna Sign Constitutional Disease</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>♈</span>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, color: "#f0e8d0", fontWeight: 600 }}>
                    {result.lagnaSign} — Natal tendency
                  </div>
                  <div style={{ fontSize: 13, color: "#c8c0a8", marginTop: 4, lineHeight: 1.6 }}>
                    {result.lagnaDiseaseSign}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Planet alerts — wrapped in PremiumFeature */}
          <PremiumFeature feature="Medical Astrology — Planet Alerts">
            <div>
              <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#f87171", marginBottom: 12 }}>
                Planet · House Disease Alerts
              </div>

              {highAlerts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "#f87171", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                    High Priority
                  </div>
                  {highAlerts.map((a, i) => (
                    <AlertCard key={`h-${i}`} alert={a} />
                  ))}
                </div>
              )}

              {medAlerts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "#fb923c", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                    Medium Priority
                  </div>
                  {medAlerts.map((a, i) => (
                    <AlertCard key={`m-${i}`} alert={a} />
                  ))}
                </div>
              )}

              {lowAlerts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "#2dd4bf", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                    Low / Awareness
                  </div>
                  {lowAlerts.map((a, i) => (
                    <AlertCard key={`l-${i}`} alert={a} />
                  ))}
                </div>
              )}

              {result.alerts.length === 0 && (
                <div className="empty">
                  <div className="empty-icon">✅</div>
                  <div className="empty-text">No significant planetary disease alerts</div>
                  <p style={{ fontSize: 13, color: "#605890" }}>
                    Strong chart — minimal natal medical stress patterns.
                  </p>
                </div>
              )}
            </div>
          </PremiumFeature>
        </div>
      )}

      {/* ══ TAB 2: Health Scores ═════════════════════════════════ */}
      {activeTab === "scores" && (
        <PremiumFeature feature="Medical Astrology — Health Scores">
          <div>
            <p style={{ fontSize: 13, color: "#605890", marginBottom: 20, lineHeight: 1.7 }}>
              Scores reflect natal planetary sensitivity in each health domain. Higher score = greater sensitivity/risk pattern, not certainty of disease.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 28 }}>
              {(Object.entries(result.scores) as [keyof typeof result.scores, number][]).map(([key, val]) => (
                <ScoreBar
                  key={key}
                  label={key}
                  value={val}
                  icon={SCORE_ICONS[key]}
                />
              ))}
            </div>

            {/* Accident risk meter */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 12 }}>
                Accident Risk Index
              </div>
              <AccidentMeter risk={result.accidentRisk} />
            </div>

            {/* Score legend */}
            <div style={{
              background: "rgba(45,212,191,0.04)",
              border: "1px solid rgba(45,212,191,0.12)",
              borderRadius: 12,
              padding: "14px 16px",
            }}>
              <div style={{ fontSize: 10, color: "#2dd4bf", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
                Score Legend
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { range: "0–29", label: "Low Risk", color: "#2dd4bf" },
                  { range: "30–59", label: "Moderate", color: "#fbbf24" },
                  { range: "60–95", label: "Elevated", color: "#f87171" },
                ].map((l) => (
                  <div key={l.range} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#c8c0a8" }}>{l.range} — {l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PremiumFeature>
      )}

      {/* ══ TAB 3: Risk Factors ══════════════════════════════════ */}
      {activeTab === "risks" && (
        <PremiumFeature feature="Medical Astrology — Risk Factors">
          <div>
            {/* Top concerns */}
            {result.topConcerns.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#f87171", marginBottom: 12 }}>
                  Top 3 Health Concerns
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                  {result.topConcerns.map((concern, i) => (
                    <div key={concern} style={{
                      background: "#0d0a22",
                      border: "1px solid rgba(248,113,113,0.2)",
                      borderRadius: 14,
                      padding: "16px 14px",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>
                        {SCORE_ICONS[concern as keyof typeof SCORE_ICONS] ?? "🔹"}
                      </div>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, color: "#f0e8d0", fontWeight: 600 }}>
                        {concern}
                      </div>
                      <div style={{ fontSize: 10, color: "#f87171", marginTop: 4 }}>#{i + 1} Concern</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High severity planet-house notes */}
            {highAlerts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#f87171", marginBottom: 12 }}>
                  High Severity Planet-House Patterns
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {highAlerts.map((a, i) => (
                    <div key={i} style={{
                      background: "rgba(248,113,113,0.04)",
                      border: "1px solid rgba(248,113,113,0.15)",
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 20 }}>{PLANET_ICONS[a.planet] ?? "🔹"}</span>
                        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, color: "#f0e8d0", fontWeight: 600 }}>
                          {a.planet} {a.house > 0 ? `· H${a.house}` : ""}
                        </span>
                        <SeverityBadge severity={a.severity} />
                      </div>
                      <div style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.6, marginBottom: 4 }}>
                        {a.disease}
                      </div>
                      <div style={{ fontSize: 12, color: "#8b80bf", lineHeight: 1.6 }}>
                        {a.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium severity */}
            {medAlerts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#fb923c", marginBottom: 12 }}>
                  Medium Severity Patterns
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {medAlerts.map((a, i) => (
                    <div key={i} style={{
                      background: "rgba(251,146,60,0.04)",
                      border: "1px solid rgba(251,146,60,0.15)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{PLANET_ICONS[a.planet] ?? "🔹"}</span>
                      <div>
                        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 14, color: "#f0e8d0", fontWeight: 600, marginBottom: 2 }}>
                          {a.planet} {a.house > 0 ? `· H${a.house}` : ""}
                        </div>
                        <div style={{ fontSize: 12, color: "#fdba74", lineHeight: 1.6 }}>{a.disease}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Protective awareness */}
            <div style={{
              background: "rgba(45,212,191,0.04)",
              border: "1px solid rgba(45,212,191,0.15)",
              borderRadius: 14,
              padding: "18px 18px",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "#2dd4bf", marginBottom: 10 }}>
                Protective Prakriti Guidance
              </div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, color: "#f0e8d0", marginBottom: 6 }}>
                {result.lagnaSign} — {result.prakriti.split("—")[0].trim()}
              </div>
              <div style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>
                {result.prakriti.split("—")[1]?.trim() ?? result.prakriti}
              </div>
            </div>

            {/* Book attribution */}
            <div style={{
              background: "#0d0a22",
              border: "1px solid rgba(200,160,48,0.15)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>📖</span>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15, color: "#c8a030", fontWeight: 600 }}>
                  Source: Medical Astrology
                </div>
                <div style={{ fontSize: 12, color: "#8b80bf", marginTop: 3, lineHeight: 1.6 }}>
                  Based on Dr. S. Krishna Kumar{"'"}s Medical Astrology · Nakshatra disease patterns,
                  planet-house analysis, Tridosha constitution framework.
                </div>
              </div>
            </div>
          </div>
        </PremiumFeature>
      )}

      <MobileBottomNav />
    </div>
  );
}
