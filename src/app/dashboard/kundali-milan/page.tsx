"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import "@/app/dashboard/shared.css";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart, listSavedCharts, loadSavedChart, type SavedChartSummary } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import {
  calculateMilan, NAKSHATRAS_27, RASHIS_12,
  type MilanResult, type KootScore,
} from "@/lib/astro-engine/kundali-milan";
import {
  analyzeRelationshipIntelligence,
  type RelationshipInput, type RelationshipResult,
  type PlanetPlacement, type HouseInfo, type Planet,
} from "@/lib/astro-engine/relationship-intelligence";
import {
  buildMangalDoshaInsight,
  compareMangalDoshaCharts,
  type MangalDoshaInsight,
} from "@/lib/astro-engine/mangal-dosha-adapter";
import type { MangalDoshaResult, ManglikCompatibilityResult } from "@/lib/astro-engine/mangal-dosha";
import {
  generateMasterMarriageReport,
  type MasterMarriageReport,
} from "@/lib/astro-engine/master-marriage-report";
import MasterMarriageReportPanel from "@/components/marriage/MasterMarriageReportPanel";

// ── HOUSE LORDS (Aries=Mars ... Pisces=Jupiter) ──────────────
const SIGN_LORDS: Record<string, Planet> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

function ianaToUtcOffset(timezone: string | null, dob: string, tob: string): number {
  if (!timezone) return 5.5;

  try {
    const date = new Date(`${dob || "2000-01-01"}T${tob || "12:00"}:00Z`);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const tzStr = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+5:30";
    const match = tzStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 5.5;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2] ?? 0);
    const minutes = Number(match[3] ?? 0);
    return sign * (hours + minutes / 60);
  } catch {
    return 5.5;
  }
}

function getMoonNakshatraIndex(nakName?: string, lon?: number): number {
  if (typeof lon === "number" && !isNaN(lon)) {
    const idx = Math.floor((((lon % 360) + 360) % 360) / (360 / 27));
    if (idx >= 0 && idx < 27) return idx;
  }
  if (!nakName) return 0;
  const clean = nakName.toLowerCase().replace(/pada/g, "").trim();
  const found = NAKSHATRAS_27.findIndex((n) => {
    const nl = n.toLowerCase();
    return nl === clean || nl.startsWith(clean) || clean.startsWith(nl);
  });
  return found >= 0 ? found : 0;
}

function getMoonRashiIndex(signNum?: number, signName?: string): number {
  if (typeof signNum === "number" && signNum >= 0 && signNum < 12) {
    return signNum;
  }
  if (!signName) return 0;
  const sLower = signName.toLowerCase();
  const english = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
  const engIdx = english.indexOf(sLower);
  if (engIdx >= 0) return engIdx;
  const rashiIdx = RASHIS_12.findIndex((r) => r.toLowerCase() === sLower);
  return rashiIdx >= 0 ? rashiIdx : 0;
}

// ── Helpers ───────────────────────────────────────────────────
function ScoreRing({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = score / max;
  const r = 36, circ = 2 * Math.PI * r;
  return (
    <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={44} cy={44} r={r} fill="none" stroke="rgba(184,134,11,0.2)" strokeWidth={7} />
      <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

function MiniRing({ score, max, color, size = 52 }: { score: number; max: number; color: string; size?: number }) {
  const r = size * 0.38, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(184,134,11,0.2)" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / max)}
          strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontFamily: "Cormorant Garamond,serif",
        fontSize: size * 0.26, fontWeight: 700, color,
      }}>{score}</div>
    </div>
  );
}

function KootCard({ k }: { k: KootScore }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      background: "#FFFFFF", border: `1px solid ${open ? k.color + "55" : "#FFFFFF"}`,
      borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MiniRing score={k.points} max={k.maxPoints} color={k.color} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>{k.name}</span>
            <span style={{ fontSize: 11, color: "#6B635B" }}>{k.hindiName}</span>
            {k.hasDosha && (
              <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, padding: "1px 6px" }}>DOSHA</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#6B635B" }}>{k.meaning}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#6B635B", fontWeight: 600 }}>{k.points}/{k.maxPoints}</div>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
            background: k.status === "Excellent" ? "rgba(34,197,94,0.12)" : k.status === "Good" ? "rgba(200,160,48,0.12)" : k.status === "Average" ? "rgba(249,115,22,0.12)" : "rgba(239,68,68,0.12)",
            color: k.color, border: `1px solid ${k.color}33`,
          }}>{k.status}</span>
        </div>
        <span style={{ fontSize: 10, color: "#6B635B", marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #FFFFFF" }}>
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8, marginBottom: k.hasDosha ? 10 : 0 }}>{k.detail}</div>
          {k.hasDosha && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#ef4444" }}>
              ⚠️ {k.doshaText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Input Form ────────────────────────────────────────────────
interface PersonInput { name: string; nakIdx: number; rashiIdx: number; }
type PartnerBirthForm = {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
  tz: number | null;
};

function PersonForm({
  label, color, value, onChange,
}: { label: string; color: string; value: PersonInput; onChange: (v: PersonInput) => void }) {
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${color}33`, borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color, marginBottom: 12 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="Full name"
          value={value.name}
          onChange={e => onChange({ ...value, name: e.target.value })}
          style={{
            background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 8, padding: "10px 14px",
            color: "#1A1A1A", fontSize: 13, outline: "none", width: "100%", fontFamily: "Outfit,sans-serif",
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: "#6B635B", marginBottom: 4, letterSpacing: "1px" }}>JANMA NAKSHATRA</div>
            <select
              value={value.nakIdx}
              onChange={e => onChange({ ...value, nakIdx: Number(e.target.value) })}
              style={{
                background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 8, padding: "10px 12px",
                color: "#1A1A1A", fontSize: 12, width: "100%", outline: "none", fontFamily: "Outfit,sans-serif",
              }}
            >
              {NAKSHATRAS_27.map((n, i) => <option key={i} value={i}>{n}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#6B635B", marginBottom: 4, letterSpacing: "1px" }}>JANMA RASHI</div>
            <select
              value={value.rashiIdx}
              onChange={e => onChange({ ...value, rashiIdx: Number(e.target.value) })}
              style={{
                background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 8, padding: "10px 12px",
                color: "#1A1A1A", fontSize: 12, width: "100%", outline: "none", fontFamily: "Outfit,sans-serif",
              }}
            >
              {RASHIS_12.map((r, i) => <option key={i} value={i}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerFullChartForm({
  form,
  selectedCity,
  partnerChart,
  error,
  onFormChange,
  onCityChange,
  onGenerate,
  onSave,
  isSaving,
  saveSuccess,
}: {
  form: PartnerBirthForm;
  selectedCity: CitySearchResult | null;
  partnerChart: ChartData | null;
  error: string;
  onFormChange: (next: PartnerBirthForm) => void;
  onCityChange: (city: CitySearchResult | null) => void;
  onGenerate: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}) {
  return (
    <div className="card" style={{ marginBottom: 16, borderColor: partnerChart ? "rgba(34,197,94,.28)" : "rgba(200,160,48,.18)" }}>
      <div className="card-tag">Partner Full Chart</div>
      <div className="card-title serif">Activate True Couple Mars Balance</div>
      <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.8, marginBottom: 14 }}>
        Ashtakoot needs only Nakshatra and Rashi. Mangal Dosha comparison needs the partner&apos;s full DOB, time and city.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
        <div>
          <label className="label">Partner Full Name</label>
          <input
            className="input"
            placeholder="Partner name"
            value={form.name}
            onChange={(event) => onFormChange({ ...form, name: event.target.value })}
          />
        </div>
        <div>
          <label className="label">Date of Birth</label>
          <input
            className="input"
            type="date"
            value={form.dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) => onFormChange({
              ...form,
              dob: event.target.value,
              tz: selectedCity ? ianaToUtcOffset(selectedCity.timezone, event.target.value, form.tob) : form.tz,
            })}
          />
        </div>
        <div>
          <label className="label">Time of Birth</label>
          <input
            className="input"
            type="time"
            value={form.tob}
            onChange={(event) => onFormChange({
              ...form,
              tob: event.target.value,
              tz: selectedCity ? ianaToUtcOffset(selectedCity.timezone, form.dob, event.target.value) : form.tz,
            })}
          />
        </div>
        <div>
          <CityAutocomplete
            label="Partner Birth City"
            value={selectedCity}
            placeholder="Search from 68k+ cities"
            onChange={(city) => {
              onCityChange(city);
              onFormChange({
                ...form,
                city: city?.displayName ?? "",
                lat: city?.latitude ?? null,
                lon: city?.longitude ?? null,
                tz: city ? ianaToUtcOffset(city.timezone, form.dob, form.tob) : null,
              });
            }}
          />
        </div>
      </div>
      {error && (
        <div style={{ marginTop: 12, color: "#DC2626", fontSize: 12, lineHeight: 1.7, fontWeight: 500 }}>
          {error}
        </div>
      )}
      {partnerChart && (
        <div style={{ marginTop: 12, color: "#15803D", fontSize: 12, lineHeight: 1.7, fontWeight: 500 }}>
          Partner chart generated: {partnerChart.lagnaRashi} Lagna, {partnerChart.planets.Moon?.sign} Moon.
        </div>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <button
          type="button"
          onClick={onGenerate}
          style={{
            border: 0,
            borderRadius: 10,
            padding: "11px 18px",
            background: "linear-gradient(135deg,#c8a030,#a06820)",
            color: "#FAF7F2",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Generate Partner Chart
        </button>
        {partnerChart && onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              border: `1px solid ${saveSuccess ? "#22c55e" : "rgba(184,134,11,0.3)"}`,
              borderRadius: 10,
              padding: "11px 18px",
              background: saveSuccess ? "rgba(34,197,94,0.15)" : "#FFFFFF",
              color: saveSuccess ? "#15803d" : "#B8860B",
              fontWeight: 800,
              cursor: isSaving ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {saveSuccess ? "✓ कुंडली सेव हो गई!" : isSaving ? "सेव हो रहा है..." : "💾 इस साथी की कुंडली को सेव करें"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Layer Score Card ─────────────────────────────────────────
function LayerCard({ title, icon, score, paragraph, color }: {
  title: string; icon: string; score: number; paragraph: string; color: string;
}) {
  return (
    <div className="card" style={{ borderColor: `${color}33` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <MiniRing score={score} max={100} color={color} size={56} />
        <div>
          <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#6B635B", marginBottom: 2 }}>{icon} {title}</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color }}>
            {score >= 76 ? "Supportive" : score >= 58 ? "Mixed Supportive" : score >= 40 ? "Needs Patience" : "Needs Careful Handling"}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9 }}>{paragraph}</div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  const score = value ?? 0;
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11, color: "#6B635B" }}>
        <span>{label}</span>
        <strong style={{ color }}>{value === null ? "N/A" : `${score}/100`}</strong>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: "rgba(184,134,11,0.12)", overflow: "hidden", border: "1px solid rgba(184,134,11,0.2)" }}>
        <div style={{ width: `${Math.max(0, Math.min(100, score))}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function severityColor(result: MangalDoshaResult) {
  const score = result.scores.natalSeverity;
  if (score >= 60) return "#ef4444";
  if (score >= 45) return "#f97316";
  if (score >= 30) return "#c8a030";
  return "#22c55e";
}

function CoupleMarsBalanceCard({ compatibility }: { compatibility: ManglikCompatibilityResult | null }) {
  if (!compatibility) {
    return (
      <div className="card" style={{ borderColor: "rgba(200,160,48,.22)" }}>
        <div className="card-tag">Couple Mars Balance</div>
        <div className="card-title serif">Partner full chart needed</div>
        <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9 }}>
          Fill partner DOB, birth time and city above, then generate partner chart. After that AstroLife compares both Mars patterns:
          severity, structural overlap, Paap balance and conflict expression.
        </div>
      </div>
    );
  }

  const labelText = compatibility.label.replaceAll("_", " ");
  const color = compatibility.balanceScore >= 75 ? "#22c55e" : compatibility.balanceScore >= 58 ? "#c8a030" : compatibility.balanceScore >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="card" style={{ borderColor: `${color}44` }}>
      <div className="card-tag">Couple Mars Balance</div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center", marginTop: 10 }}>
        <div style={{ position: "relative", width: 76, height: 76 }}>
          <ScoreRing score={compatibility.balanceScore} max={100} color={color} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color, fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700 }}>
            {compatibility.balanceScore}
          </div>
        </div>
        <div>
          <div className="card-title serif" style={{ marginBottom: 6, textTransform: "capitalize" }}>{labelText}</div>
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8 }}>
            Severity delta: {compatibility.severityDelta}/100. Structural overlap: {compatibility.structuralOverlapScore}/100.
            Traditional Paap difference: {compatibility.traditionalPaapBalance.difference}.
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {compatibility.interpretation.map((line) => (
          <div key={line} style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8 }}>• {line}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10, marginTop: 16 }}>
        <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,.025)" }}>
          <div style={{ fontSize: 10, letterSpacing: "1.6px", textTransform: "uppercase", color: "#6B635B", marginBottom: 6 }}>Expression Fit</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, color: "#1A1A1A", textTransform: "capitalize" }}>
            {compatibility.expressionCompatibility.label.replaceAll("_", " ")}
          </div>
          <div style={{ fontSize: 12, color: "#a79fbd", lineHeight: 1.7, marginTop: 6 }}>{compatibility.expressionCompatibility.interpretation}</div>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,.025)" }}>
          <div style={{ fontSize: 10, letterSpacing: "1.6px", textTransform: "uppercase", color: "#6B635B", marginBottom: 6 }}>Timing Overlap</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, color: compatibility.timingOverlap.score >= 70 ? "#22c55e" : compatibility.timingOverlap.score >= 55 ? "#c8a030" : "#ef4444", textTransform: "capitalize" }}>
            {compatibility.timingOverlap.label.replaceAll("_", " ")}
          </div>
          <div style={{ fontSize: 12, color: "#a79fbd", lineHeight: 1.7, marginTop: 6 }}>{compatibility.timingOverlap.interpretation}</div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: "1.6px", textTransform: "uppercase", color: "#6B635B", marginBottom: 8 }}>Partner Domain Compatibility</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          {compatibility.domainCompatibility.slice(0, 4).map((domain) => (
            <div key={domain.domain} style={{ border: "1px solid rgba(200,160,48,.18)", borderRadius: 12, padding: 11, background: "rgba(200,160,48,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <strong style={{ color: "#1A1A1A", fontSize: 12 }}>{domain.domain}</strong>
                <span style={{ color: domain.score >= 75 ? "#22c55e" : domain.score >= 58 ? "#c8a030" : "#ef4444", fontSize: 12, fontWeight: 700 }}>{domain.score}</span>
              </div>
              <div style={{ fontSize: 11, color: "#a79fbd", lineHeight: 1.6 }}>{domain.interpretation}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: "1.6px", textTransform: "uppercase", color: "#6B635B", marginBottom: 8 }}>Couple Remedy Strategy</div>
        <div style={{ display: "grid", gap: 8 }}>
          {compatibility.remedyStrategy.slice(0, 4).map((line) => (
            <div key={line} style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.7 }}>• {line}</div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: "#6B635B", lineHeight: 1.7 }}>
        {compatibility.disclaimer}
      </div>
    </div>
  );
}

function MangalDoshaPanel({ insight, compatibility }: { insight: MangalDoshaInsight | null; compatibility: ManglikCompatibilityResult | null }) {
  if (!insight) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>Ma</div>
        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>
          Birth Chart Required
        </div>
        <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.7 }}>
          Mangal Dosha Intelligence needs your generated Kundli. Generate or load a saved chart first.
        </div>
      </div>
    );
  }

  const result = insight.result;
  const color = severityColor(result);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="header-card">
        <div className="header-orb" />
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>
          <div style={{ position: "relative", width: 92, height: 92 }}>
            <ScoreRing score={result.scores.natalSeverity} max={100} color={color} />
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 25, lineHeight: 1, fontWeight: 700, color }}>
                  {result.scores.natalSeverity}
                </div>
                <div style={{ fontSize: 9, color: "#6B635B" }}>/100</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#6B635B", marginBottom: 6 }}>
              Mars Relationship Intelligence
            </div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>
              {result.severityLabel}
            </div>
            <div style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8 }}>{insight.summary}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <div className="card">
          <div className="card-tag">Score Anatomy</div>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <ScoreBar label="Structural Manglik Pattern" value={result.scores.structural} color="#e879f9" />
            <ScoreBar label="Mars Power" value={result.scores.marsPower} color="#ef4444" />
            <ScoreBar label="Mars Affliction" value={result.scores.marsAffliction} color="#f97316" />
            <ScoreBar label="Marriage Vulnerability" value={result.scores.marriageVulnerability} color="#c8a030" />
            <ScoreBar label="Protection / Mitigation" value={result.scores.protection} color="#22c55e" />
            <ScoreBar label="Current Activation" value={result.scores.activation} color="#60a5fa" />
          </div>
        </div>

        <div className="card">
          <div className="card-tag">Interpretation</div>
          <div className="card-title serif">{result.marsExpression.replaceAll("_", " ")}</div>
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9, marginBottom: 12 }}>
            Functional nature: <strong style={{ color: "#1A1A1A" }}>{result.functionalNature.label.replaceAll("_", " ")}</strong>.{" "}
            {result.functionalNature.explanation}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {result.constructiveThemes.slice(0, 6).map((theme) => (
              <span key={theme} style={{ border: "1px solid rgba(200,160,48,.25)", color: "#c8a030", borderRadius: 999, padding: "5px 9px", fontSize: 11 }}>
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <div className="card">
          <div className="card-tag">Engine Health</div>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <ScoreBar label="Data Quality" value={result.dataQualityScore} color="#60a5fa" />
            <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.7 }}>
              Status: <strong style={{ color: "#1A1A1A" }}>{result.calculationStatus}</strong> · Confidence:{" "}
              <strong style={{ color: "#1A1A1A" }}>{result.scoreConfidence}</strong>
            </div>
            <div style={{ fontSize: 11, color: "#6B635B", lineHeight: 1.6 }}>
              {result.engineVersion} · {result.rulePackVersion} · {result.scoreModelVersion}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-tag">Traditional Depth</div>
          <div className="card-title serif">{result.traditionalConcentration.label}</div>
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8 }}>{result.traditionalConcentration.modernInterpretation}</div>
          {result.cancellationFactors.length > 0 && (
            <div style={{ display: "grid", gap: 7, marginTop: 10 }}>
              {result.cancellationFactors.slice(0, 3).map((factor) => (
                <div key={factor.ruleId} style={{ fontSize: 11, color: "#22c55e", lineHeight: 1.55 }}>• {factor.title} ({factor.confidence})</div>
              ))}
            </div>
          )}
        </div>
        <div className="card" style={{ borderColor: result.gemstoneSafety.status === "not_recommended" ? "rgba(239,68,68,.32)" : "rgba(200,160,48,.28)" }}>
          <div className="card-tag">Gemstone Safety</div>
          <div className="card-title serif">{result.gemstoneSafety.title}</div>
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8 }}>{result.gemstoneSafety.reasoning[0]}</div>
          <div style={{ fontSize: 11, color: "#efb0b0", lineHeight: 1.6, marginTop: 8 }}>{result.gemstoneSafety.caution}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-tag">Evidence</div>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {insight.keyEvidence.length === 0 ? (
            <div style={{ fontSize: 12, color: "#6B635B" }}>No major affliction/protection evidence was triggered beyond structural scoring.</div>
          ) : insight.keyEvidence.map((item) => (
            <div key={item.ruleId} style={{ borderBottom: "1px solid #FFFFFF", paddingBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                <strong style={{ color: "#1A1A1A", fontSize: 13 }}>{item.title}</strong>
                <span style={{ color: item.effect === "decrease" ? "#22c55e" : "#f97316", fontSize: 12 }}>
                  {item.effect === "decrease" ? "-" : "+"}{Math.abs(item.points)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.7 }}>{item.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-tag">Marriage Use</div>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {insight.productGuidance.map((item) => (
            <div key={item} style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8 }}>• {item}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-tag">Remedy Matrix</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 10, marginTop: 12 }}>
          {result.remedies.map((remedy) => (
            <div key={`${remedy.category}-${remedy.title}`} style={{ border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: 12, background: "#FAF7F2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                <strong style={{ color: "#1A1A1A", fontSize: 12 }}>{remedy.title}</strong>
                <span style={{ color: remedy.priority === "primary" ? "#22c55e" : "#c8a030", fontSize: 10, textTransform: "uppercase" }}>{remedy.priority}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6B635B", lineHeight: 1.65 }}>{remedy.instruction}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {[remedy.category, remedy.costBand, remedy.effortLevel, remedy.requiresExpert ? "expert" : "self"].filter(Boolean).map((tag) => (
                  <span key={String(tag)} style={{ fontSize: 10, color: "#c8a030", border: "1px solid rgba(200,160,48,.2)", borderRadius: 999, padding: "3px 7px" }}>{String(tag).replaceAll("_", " ")}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CoupleMarsBalanceCard compatibility={compatibility} />

      <div style={{ fontSize: 11, color: "#6B635B", lineHeight: 1.7, textAlign: "center" }}>
        {result.safetyNotes[0]} {result.safetyNotes[1]}
      </div>
    </div>
  );
}

// ── Map ChartData → RelationshipInput ────────────────────────
function chartToRelInput(chart: { planets: Record<string, { house: number; sign: string; nakshatra: string; retrograde: boolean; dignity: string; navamsha: string }>; houseCusps: { house: number; sign: string }[]; dashas: { planet: string; active?: boolean }[]; antardasha: { planet: string; active?: boolean }[] }): RelationshipInput {
  const PLANETS_LIST: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const planets: PlanetPlacement[] = PLANETS_LIST.map(p => {
    const d = chart.planets[p];
    if (!d) return { planet: p, house: 1 };
    const isAfflicted = d.dignity === "Debilitated" || d.dignity === "Enemy";
    return {
      planet: p,
      house: d.house,
      sign: d.sign,
      nakshatra: d.nakshatra,
      isRetrograde: d.retrograde,
      isAfflicted,
      strength: d.dignity === "Exalted" ? 90 : d.dignity === "Own" ? 75 : d.dignity === "Friend" ? 65 : d.dignity === "Neutral" ? 50 : d.dignity === "Enemy" ? 35 : d.dignity === "Debilitated" ? 20 : 50,
    };
  });

  const houses: HouseInfo[] = (chart.houseCusps || []).map(hc => ({
    house: hc.house,
    sign: hc.sign,
    lord: SIGN_LORDS[hc.sign] || "Mars",
  }));

  // Ensure 12 houses
  for (let i = houses.length; i < 12; i++) {
    houses.push({ house: i + 1 });
  }

  // Dasha
  const activeMD = chart.dashas?.find(d => d.active);
  const activeAD = chart.antardasha?.find(d => d.active);
  const dasha = activeMD ? {
    mahadasha: activeMD.planet as Planet,
    antardasha: activeAD?.planet as Planet | undefined,
  } : undefined;

  return { planets, houses, dasha, language: "hinglish" };
}

// ── Main Page ─────────────────────────────────────────────────
type TabKey = "master" | "marriage" | "mars" | "koots" | "psychology" | "children" | "kp" | "timing" | "doshas";
type PageMode = "profile" | "match";

function MissingDataCard({
  icon,
  title,
  text,
  action,
}: {
  icon: string;
  title: string;
  text: string;
  action?: string;
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: 32,
        borderStyle: "dashed",
        background: "color-mix(in srgb, var(--engine-card) 72%, transparent)",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, color: "var(--engine-fg)", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: "var(--engine-muted)", lineHeight: 1.8, maxWidth: 620, margin: "0 auto" }}>
        {text}
      </div>
      {action && (
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--engine-gold-strong)", fontWeight: 700 }}>
          {action}
        </div>
      )}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  note,
  status = "ready",
}: {
  label: string;
  value: string;
  note: string;
  status?: "ready" | "missing" | "limited";
}) {
  const color = status === "ready" ? "var(--engine-green)" : status === "limited" ? "#c2410c" : "var(--engine-muted)";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(140px, 1fr) auto",
        gap: 14,
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid var(--engine-border)",
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--engine-fg)" }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--engine-muted)", lineHeight: 1.55, marginTop: 3 }}>{note}</div>
      </div>
      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 800, color, textAlign: "right" }}>
        {value}
      </div>
    </div>
  );
}

type RadarItem = {
  label: string;
  value: number;
  detail: string;
  reasons: string[];
  advice: string;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function labelForScore(score: number) {
  if (score >= 78) return "Strong";
  if (score >= 62) return "Workable";
  if (score >= 45) return "Sensitive";
  return "Needs care";
}

function kootPercent(result: MilanResult | null, names: string[], fallback: number) {
  if (!result) return fallback;
  const koot = result.koots.find((item) => names.includes(item.name));
  if (!koot || !koot.maxPoints) return fallback;
  return clampScore((koot.points / koot.maxPoints) * 100);
}

function domainScore(compatibility: ManglikCompatibilityResult | null, terms: string[], fallback: number) {
  const match = compatibility?.domainCompatibility.find((domain) =>
    terms.some((term) => domain.domain.toLowerCase().includes(term.toLowerCase())),
  );
  return match ? clampScore(match.score) : fallback;
}

function buildRelationshipRadar(
  milanResult: MilanResult | null,
  compatibility: ManglikCompatibilityResult | null,
  relResult: RelationshipResult | null,
): RadarItem[] {
  const profilePsych = relResult?.layers.relationshipPsychology.score ?? 62;
  const profileMarriage = relResult?.layers.marriagePromise.score ?? 62;
  const profileTiming = relResult?.layers.marriageTimingSupport.score ?? 58;
  const marsBalance = compatibility?.balanceScore ?? relResult?.layers.manglikBalance.score ?? 55;

  return [
    {
      label: "Communication",
      value: domainScore(compatibility, ["communication", "expression"], kootPercent(milanResult, ["Graha Maitri"], profilePsych)),
      detail: "How easily both people understand tone, intent and emotional subtext.",
      reasons: [
        milanResult ? "Graha Maitri is used as the mental friendship signal." : "Quick Ashtakoot is still missing, so personal psychology is carrying this estimate.",
        relResult ? `Relationship psychology contributes ${profilePsych}/100 from Moon, Venus, Mars and Saturn patterns.` : "A saved personal chart will improve this signal.",
        compatibility ? "Mars expression fit adds conflict-language context." : "Partner full chart is needed for full expression matching.",
      ],
      advice: "Use plain promises, fast clarifications and no silent treatment. This relationship improves when both people name the real emotion early.",
    },
    {
      label: "Trust",
      value: clampScore((kootPercent(milanResult, ["Tara"], profileMarriage) + profileMarriage) / 2),
      detail: "Whether the relationship feels reliable during pressure, delay and family involvement.",
      reasons: [
        milanResult ? "Tara contributes the wellbeing and reliability rhythm." : "Tara is unavailable until Quick Ashtakoot is calculated.",
        relResult ? `Marriage promise contributes ${profileMarriage}/100 as the personal commitment foundation.` : "Personal marriage promise is missing.",
        "Trust here is treated as consistency under pressure, not only emotional attraction.",
      ],
      advice: "Promises matter more than big words. Keep money, family expectations and timelines transparent from the beginning.",
    },
    {
      label: "Romance",
      value: kootPercent(milanResult, ["Yoni"], domainScore(compatibility, ["passion", "intimacy"], profilePsych)),
      detail: "Attraction, warmth and the ability to keep tenderness alive after routine begins.",
      reasons: [
        milanResult ? "Yoni is used as the classical attraction and instinctive comfort layer." : "Yoni is not calculated until Quick Ashtakoot runs.",
        compatibility ? "Partner domain compatibility adds Mars-level passion and expression clues." : "Full partner chart will sharpen the intimacy reading.",
        "Romance is weighted as warmth after routine, not only early chemistry.",
      ],
      advice: "Keep affection practical and repeated. Small rituals, honest appreciation and planned time together matter more than dramatic intensity.",
    },
    {
      label: "Family",
      value: kootPercent(milanResult, ["Bhakut", "Bhakoot"], domainScore(compatibility, ["family"], profileMarriage)),
      detail: "How well family expectations, emotional direction and home culture can adjust.",
      reasons: [
        milanResult ? "Bhakoot is used for emotional direction and family pattern sensitivity." : "Bhakoot is unavailable until Quick Ashtakoot runs.",
        relResult ? "Marriage promise supports the home-building layer." : "Personal chart context will improve family-readiness judgement.",
        "This is not family approval prediction; it is adjustment capacity.",
      ],
      advice: "Discuss living style, parents, boundaries and money before commitment. Family resistance improves only when both partners act as one team.",
    },
    {
      label: "Conflict Handling",
      value: clampScore(marsBalance),
      detail: "Mars-level heat: who reacts, who repairs and how quickly conflict settles.",
      reasons: [
        compatibility ? `Manglik balance contributes ${compatibility.balanceScore}/100 from both charts.` : "Without the partner full chart, this uses only personal Mars pattern context.",
        compatibility ? `Structural Mars overlap is ${compatibility.structuralOverlapScore}/100.` : "Full partner chart is required for structural overlap.",
        "Mars is interpreted as repair style, not as fear-based doom.",
      ],
      advice: "Decide repair rules before fights happen: pause, return, apologize clearly and never use dominance as a shortcut.",
    },
    {
      label: "Timing",
      value: compatibility?.timingOverlap.score ?? profileTiming,
      detail: "Whether commitment windows and life pressures support the relationship now.",
      reasons: [
        compatibility ? `Timing overlap contributes ${compatibility.timingOverlap.score}/100.` : `Personal timing support contributes ${profileTiming}/100 until partner chart is added.`,
        relResult ? "Dasha and KP marriage validation are part of the personal readiness layer." : "Birth chart and dasha data improve timing confidence.",
        "Timing is a pressure map, not a final yes/no verdict.",
      ],
      advice: "Do not force commitment during heavy career or family pressure. Use supportive windows for introductions, engagement and repair.",
    },
  ];
}

function buildRelationshipDNA(radar: RadarItem[]) {
  const score = (label: string) => radar.find((item) => item.label === label)?.value ?? 60;
  const communication = score("Communication");
  const romance = score("Romance");
  const family = score("Family");
  const conflict = score("Conflict Handling");
  const timing = score("Timing");

  const base = {
    loveLanguage: family >= 70 ? "Acts of service" : romance >= 72 ? "Warmth and reassurance" : "Consistency over drama",
    conflictStyle: conflict >= 72 ? "Direct but recoverable" : conflict >= 55 ? "Needs pause-and-return rules" : "Sensitive; avoid escalation",
    decisionStyle: communication >= 70 ? "Talks through decisions" : "Needs written clarity",
    attachmentPattern: trustLabel(score("Trust")),
    emotionalPace: romance >= communication ? "Fast warmth, slower explanation" : "Conversation first, warmth follows",
    relationshipEnergy: timing >= 70 ? "Ready to build" : "Promising, but timing-sensitive",
  };

  if (communication >= 72 && romance >= 70) return { type: "Friends to Lovers", tone: "Mental friendship carries the attraction, so repair happens best through honest conversation.", ...base };
  if (family >= 72 && timing >= 65) return { type: "Builder + Builder", tone: "The bond becomes stronger when both families, routines and long-term plans are handled maturely.", ...base };
  if (romance >= 78 && conflict < 58) return { type: "Fire + Water", tone: "Attraction is strong, but emotional regulation decides whether passion becomes warmth or friction.", ...base };
  if (conflict >= 72) return { type: "Protector + Anchor", tone: "These two can become a team during pressure. One side moves quickly, the other stabilizes; the relationship works when protection does not become control.", ...base };
  return { type: "Seeker + Companion", tone: "The relationship grows through patience, practical commitment and learning each other's emotional language.", ...base };
}

function trustLabel(score: number) {
  if (score >= 75) return "Secure with steady effort";
  if (score >= 58) return "Secure after consistency";
  return "Slow trust; actions must match words";
}

function buildStrengths(
  radar: RadarItem[],
  milanResult: MilanResult | null,
  compatibility: ManglikCompatibilityResult | null,
) {
  const strengths = radar
    .filter((item) => item.value >= 65)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((item) => `${item.label}: ${humanStrength(item)}`);

  if (milanResult && milanResult.doshas.length === 0) {
    strengths.unshift("Ashtakoot does not show major Nadi, Bhakoot, Gana or Tara dosha flags.");
  }
  if (compatibility && compatibility.balanceScore >= 65) {
    strengths.unshift("Mars patterns look workable when conflict is handled with discipline.");
  }

  return strengths.slice(0, 5);
}

function buildRisks(
  radar: RadarItem[],
  milanResult: MilanResult | null,
  compatibility: ManglikCompatibilityResult | null,
) {
  const risks = radar
    .filter((item) => item.value < 62)
    .sort((a, b) => a.value - b.value)
    .map((item) => `${item.label}: ${humanRisk(item)}`);

  if (milanResult?.doshas.length) {
    risks.unshift(`${milanResult.doshas.length} Ashtakoot dosha flag${milanResult.doshas.length > 1 ? "s" : ""} need cancellation and D1/D9 validation.`);
  }
  if (compatibility && compatibility.balanceScore < 58) {
    risks.unshift("Mars balance can create sharp reactions unless both people agree on repair rules.");
  }

  return (risks.length ? risks : ["No severe single-point warning is visible yet; still validate with full charts and real-world family context."]).slice(0, 5);
}

function humanStrength(item: RadarItem) {
  if (item.label === "Conflict Handling") return "You can recover after disagreement if repair happens quickly and ego is kept out.";
  if (item.label === "Communication") return "There is enough mental bridge to explain hurt instead of only reacting to it.";
  if (item.label === "Trust") return "Reliability can become a real emotional asset when promises are kept consistently.";
  if (item.label === "Romance") return "Warmth and attraction can survive routine when affection is expressed in small repeated ways.";
  if (item.label === "Family") return "Family adjustment has workable ground when both partners present a united front.";
  return "The relationship has supportive timing when commitment is not rushed under pressure.";
}

function humanRisk(item: RadarItem) {
  if (item.label === "Conflict Handling") return "Arguments can become sharp if apology, pause and repair rules are not agreed early.";
  if (item.label === "Communication") return "Delayed replies, unclear promises or indirect speech can create unnecessary doubt.";
  if (item.label === "Trust") return "Trust builds slowly here; transparency about money, family and timelines is essential.";
  if (item.label === "Romance") return "Attraction needs emotional safety; routine without tenderness can cool the bond.";
  if (item.label === "Family") return "Family expectations may become a pressure point unless boundaries are discussed clearly.";
  return "Commitment timing should be chosen carefully rather than forced during stress.";
}

function storyParagraph(dna: ReturnType<typeof buildRelationshipDNA>, radar: RadarItem[]) {
  const strongest = radar.slice().sort((a, b) => b.value - a.value)[0];
  const weakest = radar.slice().sort((a, b) => a.value - b.value)[0];
  return [
    dna.tone,
    `The strongest visible thread is ${strongest.label.toLowerCase()}: ${humanStrength(strongest)}`,
    `The first area to protect is ${weakest.label.toLowerCase()}: ${humanRisk(weakest)}`,
    "If both people turn conflict into repair instead of proof, this match becomes more stable with time.",
  ].join(" ");
}

function buildYearTimeline(radar: RadarItem[], compatibility: ManglikCompatibilityResult | null, relResult: RelationshipResult | null) {
  const year = new Date().getFullYear();
  const romance = radar.find((item) => item.label === "Romance")?.value ?? 60;
  const family = radar.find((item) => item.label === "Family")?.value ?? 60;
  const timing = radar.find((item) => item.label === "Timing")?.value ?? 58;
  const conflict = radar.find((item) => item.label === "Conflict Handling")?.value ?? 58;
  const promise = relResult?.layers.marriagePromise.score ?? 60;

  return [
    { stage: `${year}`, title: "Dating clarity", value: clampScore((romance + radar[0].value) / 2), note: "Best used for honest conversations, attraction testing and family reality checks." },
    { stage: `${year + 1}`, title: timing >= 65 ? "Commitment window" : "Patience window", value: clampScore((timing + promise) / 2), note: timing >= 65 ? "Engagement or formal talks are easier when families are aligned." : "Avoid forcing decisions; build trust through consistency." },
    { stage: `${year + 2}`, title: "Marriage support", value: clampScore((promise + family + conflict) / 3), note: "Marriage works best when repair rules and home boundaries are already agreed." },
    { stage: `${year + 3}`, title: "Family adjustment", value: clampScore((family + timing) / 2), note: "Home culture, finances and parent expectations need practical planning." },
    { stage: `${year + 5}+`, title: "Long-term stability", value: clampScore((conflict + family + promise + (compatibility?.balanceScore ?? conflict)) / 4), note: "Stability grows when the couple keeps choosing repair over ego." },
  ];
}

function RadarChart({ items }: { items: RadarItem[] }) {
  const size = 220;
  const center = size / 2;
  const maxRadius = 82;
  const points = items.map((item, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / items.length;
    const radius = maxRadius * (item.value / 100);
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      axisX: center + Math.cos(angle) * maxRadius,
      axisY: center + Math.sin(angle) * maxRadius,
      labelX: center + Math.cos(angle) * (maxRadius + 20),
      labelY: center + Math.sin(angle) * (maxRadius + 20),
      item,
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Compatibility radar chart" style={{ width: "100%", maxWidth: 260, display: "block", margin: "0 auto 14px" }}>
      {[0.33, 0.66, 1].map((scale) => (
        <circle key={scale} cx={center} cy={center} r={maxRadius * scale} fill="none" stroke="rgba(200,160,48,.16)" strokeWidth="1" />
      ))}
      {points.map((point) => (
        <line key={point.item.label} x1={center} y1={center} x2={point.axisX} y2={point.axisY} stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      ))}
      <polygon points={polygon} fill="rgba(200,160,48,.22)" stroke="var(--engine-gold-strong)" strokeWidth="2" />
      {points.map((point) => (
        <g key={point.item.label}>
          <circle cx={point.x} cy={point.y} r="3.5" fill={point.item.value >= 75 ? "var(--engine-green)" : point.item.value >= 58 ? "var(--engine-gold-strong)" : "#c2410c"} />
          <text x={point.labelX} y={point.labelY} textAnchor={point.labelX < center - 8 ? "end" : point.labelX > center + 8 ? "start" : "middle"} dominantBaseline="middle" fill="var(--engine-muted)" fontSize="9">
            {point.item.label.split(" ")[0]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function RelationshipStoryPanel({
  milanResult,
  compatibility,
  relResult,
  dataConfidence,
}: {
  milanResult: MilanResult | null;
  compatibility: ManglikCompatibilityResult | null;
  relResult: RelationshipResult | null;
  dataConfidence: string;
}) {
  const radar = buildRelationshipRadar(milanResult, compatibility, relResult);
  const overall = clampScore(
    radar.reduce((sum, item) => sum + item.value, 0) / radar.length,
  );
  const dna = buildRelationshipDNA(radar);
  const strengths = buildStrengths(radar, milanResult, compatibility);
  const risks = buildRisks(radar, milanResult, compatibility);
  const fullStory = storyParagraph(dna, radar);
  const growthNow = overall;
  const growthEffort = clampScore(overall + (overall >= 75 ? 8 : 14));
  const growthPeak = clampScore(growthEffort + (overall >= 75 ? 5 : 8));
  const timeline = buildYearTimeline(radar, compatibility, relResult);
  const why = [
    milanResult ? `Ashtakoot contributes ${milanResult.totalScore}/36 with ${milanResult.doshas.length} major dosha flag${milanResult.doshas.length === 1 ? "" : "s"}.` : "Quick Ashtakoot is not available yet.",
    compatibility ? `Manglik balance is ${compatibility.balanceScore}/100 and timing overlap is ${compatibility.timingOverlap.score}/100.` : "Partner full chart is needed for Mars balance and timing overlap.",
    relResult ? `Personal marriage promise is ${relResult.layers.marriagePromise.score}/100 with ${relResult.layers.kpMarriageValidation.score}/100 KP validation.` : "Personal chart context will improve confidence.",
  ];

  return (
    <div className="card" style={{ marginBottom: 16, borderColor: "rgba(200,160,48,.24)" }}>
      <div className="card-tag">Relationship Intelligence Story</div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(260px,.8fr)", gap: 18, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, lineHeight: 1.15, color: "var(--engine-fg)", fontWeight: 800, marginBottom: 8 }}>
            {labelForScore(overall)} match with {dna.type} relationship DNA
          </div>
          <div style={{ fontSize: 13, color: "var(--engine-soft)", lineHeight: 1.85, marginBottom: 14 }}>
            {fullStory}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            {[
              { label: "Can this work?", value: labelForScore(overall), note: `${overall}/100 story strength` },
              { label: "Main strength", value: radar.slice().sort((a, b) => b.value - a.value)[0]?.label ?? "Trust", note: "Most naturally supportive" },
              { label: "Growth area", value: radar.slice().sort((a, b) => a.value - b.value)[0]?.label ?? "Timing", note: "Needs conscious work" },
              { label: "Confidence", value: dataConfidence, note: compatibility ? "Fuller chart layer available" : "Limited by available data" },
            ].map((item) => (
              <div key={item.label} style={{ border: "1px solid var(--engine-border)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,.025)" }}>
                <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--engine-muted)", marginBottom: 5 }}>{item.label}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, color: "var(--engine-fg)", fontWeight: 800 }}>{item.value}</div>
                <div style={{ fontSize: 11, color: "var(--engine-muted)", lineHeight: 1.55, marginTop: 4 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid rgba(200,160,48,.18)", borderRadius: 14, padding: 14, background: "rgba(200,160,48,.04)" }}>
          <div style={{ fontSize: 10, letterSpacing: "1.6px", textTransform: "uppercase", color: "var(--engine-gold)", marginBottom: 10 }}>Relationship Growth</div>
          {[
            { label: "Current", value: growthNow },
            { label: "With effort", value: growthEffort },
            { label: "Potential", value: growthPeak },
          ].map((item) => (
            <ScoreBar key={item.label} label={item.label} value={item.value} color={item.value >= 75 ? "var(--engine-green)" : item.value >= 58 ? "var(--engine-gold-strong)" : "#c2410c"} />
          ))}
          <div style={{ fontSize: 11, color: "var(--engine-muted)", lineHeight: 1.7, marginTop: 12 }}>
            Growth assumes mature communication, family boundaries and conflict repair. It is not a fixed destiny score.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 10, marginTop: 16 }}>
        {[
          ["Love Language", dna.loveLanguage],
          ["Conflict Style", dna.conflictStyle],
          ["Decision Style", dna.decisionStyle],
          ["Attachment Pattern", dna.attachmentPattern],
          ["Emotional Pace", dna.emotionalPace],
          ["Relationship Energy", dna.relationshipEnergy],
        ].map(([label, value]) => (
          <div key={label} style={{ border: "1px solid var(--engine-border)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,.02)" }}>
            <div style={{ fontSize: 10, letterSpacing: "1.4px", textTransform: "uppercase", color: "var(--engine-muted)", marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 13, color: "var(--engine-fg)", fontWeight: 800, lineHeight: 1.45 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14, marginTop: 16 }}>
        <div>
          <div className="card-tag">Compatibility Radar</div>
          <RadarChart items={radar} />
          <div style={{ display: "grid", gap: 10 }}>
            {radar.map((item) => (
              <div key={item.label}>
                <ScoreBar label={item.label} value={item.value} color={item.value >= 75 ? "var(--engine-green)" : item.value >= 58 ? "var(--engine-gold-strong)" : "#c2410c"} />
                <div style={{ fontSize: 10, color: "var(--engine-muted)", lineHeight: 1.5, marginTop: 3 }}>{item.detail}</div>
                <details style={{ marginTop: 5 }}>
                  <summary style={{ cursor: "pointer", color: "var(--engine-gold-strong)", fontSize: 10, fontWeight: 800 }}>Show why</summary>
                  <div style={{ display: "grid", gap: 5, marginTop: 6 }}>
                    {item.reasons.map((reason) => (
                      <div key={reason} style={{ fontSize: 10, color: "var(--engine-soft)", lineHeight: 1.55 }}>{reason}</div>
                    ))}
                    <div style={{ fontSize: 10, color: "var(--engine-muted)", lineHeight: 1.55 }}>Action: {item.advice}</div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card-tag">Top Strengths</div>
          <div style={{ display: "grid", gap: 8 }}>
            {strengths.map((item) => (
              <div key={item} style={{ fontSize: 12, color: "var(--engine-soft)", lineHeight: 1.7, borderBottom: "1px solid var(--engine-border)", paddingBottom: 8 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card-tag">Top Risks</div>
          <div style={{ display: "grid", gap: 8 }}>
            {risks.map((item) => (
              <div key={item} style={{ fontSize: 12, color: "var(--engine-soft)", lineHeight: 1.7, borderBottom: "1px solid var(--engine-border)", paddingBottom: 8 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="card-tag">Year-Based Relationship Timeline</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
          {timeline.map((item) => (
            <div key={`${item.stage}-${item.title}`} style={{ border: "1px solid var(--engine-border)", borderRadius: 12, padding: 12, background: "#FAF7F2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <div>
                  <strong style={{ color: "var(--engine-fg)", fontSize: 13 }}>{item.stage}</strong>
                  <div style={{ color: "var(--engine-soft)", fontSize: 12, fontWeight: 800, marginTop: 2 }}>{item.title}</div>
                </div>
                <span style={{ color: item.value >= 75 ? "var(--engine-green)" : item.value >= 58 ? "var(--engine-gold-strong)" : "#c2410c", fontSize: 12, fontWeight: 800 }}>{labelForScore(item.value)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "rgba(184,134,11,0.12)", overflow: "hidden", border: "1px solid rgba(184,134,11,0.2)", marginBottom: 8 }}>
                <div style={{ width: `${item.value}%`, height: "100%", background: item.value >= 75 ? "var(--engine-green)" : item.value >= 58 ? "var(--engine-gold-strong)" : "#c2410c" }} />
              </div>
              <div style={{ fontSize: 11, color: "var(--engine-muted)", lineHeight: 1.55 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, border: "1px solid rgba(96,165,250,.22)", borderRadius: 14, padding: 14, background: "rgba(96,165,250,.055)", display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div className="card-tag" style={{ color: "var(--engine-blue)" }}>AI Relationship Chat</div>
          <div style={{ color: "var(--engine-fg)", fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
            Ask what the scores cannot fully say.
          </div>
          <div style={{ fontSize: 12, color: "var(--engine-soft)", lineHeight: 1.7 }}>
            Use AI Astrologer for questions like long distance, family convincing, fight patterns, 2027 marriage timing and emotional repair.
          </div>
        </div>
        <Link
          href="/dashboard/chat?context=relationship"
          style={{
            border: "1px solid rgba(96,165,250,.35)",
            borderRadius: 10,
            padding: "10px 13px",
            color: "var(--engine-fg)",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 900,
            background: "rgba(96,165,250,.12)",
          }}
        >
          Open AI Chat
        </Link>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: "pointer", color: "var(--engine-gold-strong)", fontSize: 12, fontWeight: 800 }}>
          Why this story?
        </summary>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          {why.map((item) => (
            <div key={item} style={{ fontSize: 12, color: "var(--engine-soft)", lineHeight: 1.7 }}>
              {item}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default function KundaliMilanPage() {
  const { chart } = useUserChart();
  const { t, lang } = useLanguage();

  // Ashtakoot inputs
  const [p1, setP1] = useState<PersonInput>(() => {
    if (chart?.planets?.Moon) {
      const m = chart.planets.Moon;
      return {
        name: chart.name || "Self",
        nakIdx: getMoonNakshatraIndex(m.nakshatra, m.lon),
        rashiIdx: getMoonRashiIndex(m.signNum, m.sign),
      };
    }
    return { name: "", nakIdx: 0, rashiIdx: 0 };
  });
  const [p2, setP2] = useState<PersonInput>({ name: "", nakIdx: 0, rashiIdx: 0 });
  const [partnerBirth, setPartnerBirth] = useState<PartnerBirthForm>({ name: "", dob: "", tob: "", city: "", lat: null, lon: null, tz: null });
  const [partnerCity, setPartnerCity] = useState<CitySearchResult | null>(null);
  const [partnerChart, setPartnerChart] = useState<ChartData | null>(null);
  const [partnerError, setPartnerError] = useState("");
  const [milanResult, setMilanResult] = useState<MilanResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("master");
  const [mode, setMode] = useState<PageMode>("match");
  const [targetWeddingDate, setTargetWeddingDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split("T")[0];
  });
  const [selectedChart1, setSelectedChart1] = useState<ChartData | null>(null);

  // Saved Charts & Auto-Selection states
  const [savedCharts, setSavedCharts] = useState<SavedChartSummary[]>([]);
  const [person1SavedId, setPerson1SavedId] = useState<string>("");
  const [person2SavedId, setPerson2SavedId] = useState<string>("");
  const [savingPartner, setSavingPartner] = useState(false);
  const [savedPartnerSuccess, setSavedPartnerSuccess] = useState(false);

  // If user selected a specific saved chart for Person 1, use that; otherwise fall back to active profile (chart)
  const effectiveChart1 = selectedChart1 || (person1SavedId === "self" || !person1SavedId ? chart : null);
  const lastChartRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadSaved() {
      try {
        const list = await listSavedCharts();
        const localStr = typeof window !== "undefined" ? localStorage.getItem("astrolife_milan_saved_charts") : null;
        const localList: SavedChartSummary[] = localStr ? JSON.parse(localStr) : [];
        const combined = [...list];
        for (const loc of localList) {
          if (!combined.some(c => c.name === loc.name && c.dob === loc.dob)) {
            combined.push(loc);
          }
        }
        if (mounted) setSavedCharts(combined);
      } catch (e) {
        console.warn("Could not load saved charts in kundali-milan:", e);
      }
    }
    loadSaved();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (effectiveChart1?.planets?.Moon) {
      const chartKey = `${effectiveChart1.name || ""}-${effectiveChart1.dob || ""}-${effectiveChart1.tob || ""}`;
      if (lastChartRef.current !== chartKey) {
        lastChartRef.current = chartKey;
        const m = effectiveChart1.planets.Moon;
        const nakIdx = getMoonNakshatraIndex(m.nakshatra, m.lon);
        const rashiIdx = getMoonRashiIndex(m.signNum, m.sign);
        setP1(prev => ({
          name: prev.name && prev.name !== "Self" && prev.name !== "You" ? prev.name : (effectiveChart1.name || "Self"),
          nakIdx,
          rashiIdx,
        }));
      }
    }
  }, [effectiveChart1]);

  // Relationship Intelligence from native chart
  const relResult: RelationshipResult | null = useMemo(() => {
    if (!effectiveChart1) return null;
    try {
      const input = chartToRelInput(effectiveChart1 as Parameters<typeof chartToRelInput>[0]);
      input.language = lang;
      // If ashtakoot calculated, feed it in
      if (milanResult) {
        input.ashtakoot = {
          totalScore: milanResult.totalScore,
          hasNadiDosha: milanResult.koots.some(k => k.name === "Nadi" && k.hasDosha),
          hasBhakootDosha: milanResult.koots.some(k => k.name === "Bhakut" && k.hasDosha),
          hasGanaIssue: milanResult.koots.some(k => k.name === "Gana" && k.hasDosha),
        };
      }
      return analyzeRelationshipIntelligence(input);
    } catch { return null; }
  }, [effectiveChart1, milanResult, lang]);

  const mangalInsight = useMemo(() => {
    if (!effectiveChart1) return null;
    try {
      return buildMangalDoshaInsight(effectiveChart1);
    } catch {
      return null;
    }
  }, [effectiveChart1]);

  const mangalCompatibility = useMemo(() => {
    if (!effectiveChart1 || !partnerChart) return null;
    try {
      return compareMangalDoshaCharts(effectiveChart1, partnerChart);
    } catch {
      return null;
    }
  }, [effectiveChart1, partnerChart]);

  const masterReport: MasterMarriageReport | null = useMemo(() => {
    if (!effectiveChart1 || !partnerChart) return null;
    try {
      return generateMasterMarriageReport(effectiveChart1, partnerChart, {
        partner1Name: effectiveChart1.name || "Partner 1",
        partner2Name: partnerChart.name || "Partner 2",
        targetWeddingDate,
      });
    } catch (err) {
      console.error("Master report generation error:", err);
      return null;
    }
  }, [effectiveChart1, partnerChart, targetWeddingDate]);

  async function handleSelectPerson1(chartId: string) {
    setPerson1SavedId(chartId);
    if (!chartId) {
      setSelectedChart1(null);
      return;
    }

    if (chartId === "self" && chart) {
      setSelectedChart1(null);
      const m = chart.planets.Moon;
      const nakIdx = getMoonNakshatraIndex(m?.nakshatra, m?.lon);
      const rashiIdx = getMoonRashiIndex(m?.signNum, m?.sign);
      setP1({
        name: chart.name || "Self",
        nakIdx,
        rashiIdx,
      });
      if (partnerChart) {
        const pm = partnerChart.planets.Moon;
        const pnakIdx = getMoonNakshatraIndex(pm?.nakshatra, pm?.lon);
        const prashiIdx = getMoonRashiIndex(pm?.signNum, pm?.sign);
        setMilanResult(calculateMilan(chart.name || "Self", nakIdx, rashiIdx, partnerChart.name, pnakIdx, prashiIdx));
        setActiveTab("master");
      }
      return;
    }

    let loaded: ChartData | null = null;
    if (chartId.startsWith("local:")) {
      const localStr = typeof window !== "undefined" ? localStorage.getItem("astrolife_milan_saved_charts") : null;
      const localList: (SavedChartSummary & { fullChart?: ChartData })[] = localStr ? JSON.parse(localStr) : [];
      const item = localList.find(x => x.id === chartId);
      if (item?.fullChart) loaded = item.fullChart;
      else if (item) loaded = calculateChart(item.name, item.dob, item.tob, item.city);
    } else {
      loaded = await loadSavedChart(chartId);
    }

    if (!loaded) {
      const meta = savedCharts.find(c => c.id === chartId);
      if (meta) loaded = calculateChart(meta.name, meta.dob, meta.tob, meta.city);
    }

    if (loaded) {
      setSelectedChart1(loaded);
      const m = loaded.planets.Moon;
      const nakIdx = getMoonNakshatraIndex(m?.nakshatra, m?.lon);
      const rashiIdx = getMoonRashiIndex(m?.signNum, m?.sign);
      setP1({
        name: loaded.name,
        nakIdx,
        rashiIdx,
      });

      if (partnerChart) {
        const pm = partnerChart.planets.Moon;
        const pnakIdx = getMoonNakshatraIndex(pm?.nakshatra, pm?.lon);
        const prashiIdx = getMoonRashiIndex(pm?.signNum, pm?.sign);
        setMilanResult(calculateMilan(loaded.name, nakIdx, rashiIdx, partnerChart.name, pnakIdx, prashiIdx));
        setActiveTab("master");
      }
    }
  }

  async function handleSelectPerson2(chartId: string) {
    setPerson2SavedId(chartId);
    if (!chartId) {
      setPartnerChart(null);
      return;
    }

    let loaded: ChartData | null = null;
    if (chartId.startsWith("local:")) {
      const localStr = typeof window !== "undefined" ? localStorage.getItem("astrolife_milan_saved_charts") : null;
      const localList: (SavedChartSummary & { fullChart?: ChartData })[] = localStr ? JSON.parse(localStr) : [];
      const item = localList.find(x => x.id === chartId);
      if (item?.fullChart) loaded = item.fullChart;
      else if (item) loaded = calculateChart(item.name, item.dob, item.tob, item.city);
    } else {
      loaded = await loadSavedChart(chartId);
    }

    if (!loaded) {
      const meta = savedCharts.find(c => c.id === chartId);
      if (meta) loaded = calculateChart(meta.name, meta.dob, meta.tob, meta.city);
    }

    if (loaded) {
      setPartnerChart(loaded);
      setPartnerBirth({
        name: loaded.name,
        dob: loaded.dob,
        tob: loaded.tob,
        city: loaded.city,
        lat: loaded.lat,
        lon: loaded.lon,
        tz: loaded.tz,
      });
      const m = loaded.planets.Moon;
      const nakIdx = getMoonNakshatraIndex(m?.nakshatra, m?.lon);
      const rashiIdx = getMoonRashiIndex(m?.signNum, m?.sign);
      setP2({
        name: loaded.name,
        nakIdx,
        rashiIdx,
      });

      const p1Source = effectiveChart1;
      if (p1Source) {
        const p1m = p1Source.planets.Moon;
        const p1nakIdx = getMoonNakshatraIndex(p1m?.nakshatra, p1m?.lon);
        const p1rashiIdx = getMoonRashiIndex(p1m?.signNum, p1m?.sign);
        setMilanResult(calculateMilan(p1Source.name || "Person 1", p1nakIdx, p1rashiIdx, loaded.name, nakIdx, rashiIdx));
        setActiveTab("master");
      }
    }
  }

  async function handleSavePartnerChart() {
    if (!partnerChart) return;
    setSavingPartner(true);
    try {
      try {
        await fetch("/api/charts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: partnerChart.name,
            birth_date: partnerChart.dob,
            birth_time: partnerChart.tob,
            birth_place: partnerChart.city,
            latitude: partnerChart.lat,
            longitude: partnerChart.lon,
            timezone: String(partnerChart.tz),
            chart_payload: partnerChart,
          }),
        });
      } catch {
        // ignore network error
      }

      const localStr = typeof window !== "undefined" ? localStorage.getItem("astrolife_milan_saved_charts") : null;
      const localList: (SavedChartSummary & { fullChart?: ChartData })[] = localStr ? JSON.parse(localStr) : [];
      const newEntry: SavedChartSummary & { fullChart?: ChartData } = {
        id: `local:${Date.now()}`,
        name: partnerChart.name,
        dob: partnerChart.dob,
        tob: partnerChart.tob,
        city: partnerChart.city,
        chartType: "partner",
        isPrimary: false,
        createdAt: new Date().toISOString(),
        fullChart: partnerChart,
      };
      const filtered = localList.filter(x => !(x.name === newEntry.name && x.dob === newEntry.dob));
      filtered.unshift(newEntry);
      if (typeof window !== "undefined") {
        localStorage.setItem("astrolife_milan_saved_charts", JSON.stringify(filtered));
      }

      const updatedList = await listSavedCharts();
      const combined = [...updatedList];
      for (const loc of filtered) {
        if (!combined.some(c => c.name === loc.name && c.dob === loc.dob)) {
          combined.push(loc);
        }
      }
      setSavedCharts(combined);
      setPerson2SavedId(newEntry.id);
      setSavedPartnerSuccess(true);
      setTimeout(() => setSavedPartnerSuccess(false), 3000);
    } catch (err) {
      console.error("Save partner chart error:", err);
    } finally {
      setSavingPartner(false);
    }
  }

  function calculate() {
    const r = calculateMilan(
      p1.name || "Person 1", p1.nakIdx, p1.rashiIdx,
      p2.name || "Person 2", p2.nakIdx, p2.rashiIdx,
    );
    setMilanResult(r);
    setActiveTab("koots");
  }

  function generatePartnerChart() {
    setPartnerError("");
    if (!partnerBirth.name || !partnerBirth.dob || !partnerBirth.tob || !partnerBirth.city || !partnerCity) {
      setPartnerError("Fill partner name, DOB, time and select a city from the list.");
      return;
    }

    try {
      const nextChart = calculateChart(
        partnerBirth.name,
        partnerBirth.dob,
        partnerBirth.tob,
        partnerBirth.city,
        partnerBirth.lat ?? undefined,
        partnerBirth.lon ?? undefined,
        partnerBirth.tz ?? undefined,
      );
      setPartnerChart(nextChart);
      setActiveTab("master");
    } catch (error) {
      setPartnerError(error instanceof Error ? error.message : "Could not generate partner chart.");
    }
  }

  const colorForLabel = (label: string) =>
    label === "supportive"
      ? "var(--engine-green)"
      : label === "mixed_supportive"
        ? "var(--engine-gold-strong)"
        : label === "needs_patience"
          ? "#c2410c"
          : "var(--engine-red)";

  const profileTabs: [TabKey, string][] = [
    ["marriage", t("milan.tab_marriage")],
    ["psychology", t("milan.tab_kp")],
    ["timing", t("milan.tab_timing")],
  ];
  const matchTabs: [TabKey, string][] = [
    ["master", t("milan.tab_master", "👑 Master Report")],
    ["koots", t("milan.tab_koots")],
    ["psychology", t("milan.tab_psychology")],
    ["timing", t("milan.tab_timing")],
    ["doshas", t("milan.tab_doshas")],
  ];
  const visibleTabs = mode === "profile" ? profileTabs : matchTabs;
  const hasQuickMatch = Boolean(milanResult);
  const hasPartnerFullChart = Boolean(partnerChart);
  const hasCoupleResult = hasQuickMatch || hasPartnerFullChart || Boolean(masterReport);
  const ashtakootPct = masterReport?.ashtakoot.percentage ?? milanResult?.percentage;
  const coupleScoreParts = [
    ashtakootPct,
    mangalCompatibility?.balanceScore,
  ].filter((score): score is number => typeof score === "number");
  const coupleScore = coupleScoreParts.length > 0
    ? Math.round(coupleScoreParts.reduce((sum, score) => sum + score, 0) / coupleScoreParts.length)
    : null;
  const dataConfidence = hasPartnerFullChart ? "High (Full Master Dossier Ready)" : hasQuickMatch ? "Quick Match Only" : "Not Ready";

  function switchMode(nextMode: PageMode) {
    setMode(nextMode);
    setActiveTab(nextMode === "profile" ? "marriage" : "master");
  }

  return (
    <div className="page">
      <div className="page-tag">{t("milan.page_tag")}</div>
      <h1 className="page-title serif">{t("milan.page_title")}</h1>
      <p className="page-sub">{t("milan.page_sub")}</p>
      <PremiumFeature feature="Kundali Milan">

      <div className="tabs" style={{ marginBottom: 18 }}>
        <button className={`tab ${mode === "match" ? "active" : ""}`} onClick={() => switchMode("match")}>
          Match Two Kundlis
        </button>
        <button className={`tab ${mode === "profile" ? "active" : ""}`} onClick={() => switchMode("profile")}>
          My Marriage Profile
        </button>
      </div>

      {/* ── MARRIAGE INTELLIGENCE HEADER ── */}
      {mode === "profile" && relResult && (
        <div className="header-card" style={{ marginBottom: 16 }}>
          <div className="header-orb" />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
              <ScoreRing score={relResult.marriageScore} max={100} color={colorForLabel(relResult.marriageLabel)} />
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 700, color: colorForLabel(relResult.marriageLabel), lineHeight: 1 }}>{relResult.marriageScore}</div>
                <div style={{ fontSize: 9, color: "#6B635B" }}>/ 100</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "var(--engine-muted)", marginBottom: 4 }}>Personal Marriage Profile</div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "var(--engine-fg)", marginBottom: 6 }}>
                {chart?.name || "Your"} Marriage Potential
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: `${colorForLabel(relResult.marriageLabel)}18`,
                border: `1px solid ${colorForLabel(relResult.marriageLabel)}44`,
                borderRadius: 8, padding: "4px 12px",
              }}>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 700, color: colorForLabel(relResult.marriageLabel) }}>
                  {relResult.marriageLabel === "supportive" ? "✦ Supportive" : relResult.marriageLabel === "mixed_supportive" ? "◐ Mixed Supportive" : relResult.marriageLabel === "needs_patience" ? "◑ Needs Patience" : "◌ Needs Careful Handling"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="hstat">
                <div className="hstat-n" style={{ color: colorForLabel(relResult.layers.marriagePromise.label) }}>{relResult.layers.marriagePromise.score}</div>
                <div className="hstat-l">PROMISE</div>
              </div>
              <div className="hstat">
                <div className="hstat-n" style={{ color: colorForLabel(relResult.layers.kpMarriageValidation.label) }}>{relResult.layers.kpMarriageValidation.score}</div>
                <div className="hstat-l">KP</div>
              </div>
              <div className="hstat">
                <div className="hstat-n" style={{ color: colorForLabel(relResult.layers.marriageTimingSupport.label) }}>{relResult.layers.marriageTimingSupport.score}</div>
                <div className="hstat-l">TIMING</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "profile" && !relResult && (
        <MissingDataCard
          icon="💍"
          title="Your birth chart is required"
          text="My Marriage Profile uses your own D1/D9, dasha and KP context. Generate or load your Kundli first."
          action="Go to My Kundli to create your chart"
        />
      )}

      {mode === "match" && hasCoupleResult && (
        <div className="header-card" style={{ marginBottom: 16 }}>
          <div className="header-orb" />
          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "center" }}>
            <div style={{ position: "relative", width: 96, height: 96 }}>
              <ScoreRing score={coupleScore ?? 0} max={100} color={coupleScore && coupleScore >= 72 ? "var(--engine-green)" : coupleScore && coupleScore >= 55 ? "var(--engine-gold-strong)" : "#c2410c"} />
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 800, color: "var(--engine-fg)", lineHeight: 1 }}>
                    {coupleScore ?? "—"}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--engine-muted)" }}>/100</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "var(--engine-muted)", marginBottom: 5 }}>
                Couple Compatibility
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 800, color: "var(--engine-fg)", marginBottom: 8 }}>
                {coupleScore && coupleScore >= 72 ? "Strong Potential" : coupleScore && coupleScore >= 55 ? "Workable Match" : "Needs Careful Review"}
              </div>
              <div style={{ fontSize: 13, color: "var(--engine-soft)", lineHeight: 1.8 }}>
                Data confidence: <strong style={{ color: "var(--engine-fg)" }}>{dataConfidence}</strong>.{" "}
                {hasQuickMatch ? "Ashtakoot is calculated. " : "Ashtakoot is not calculated. "}
                {hasPartnerFullChart ? "Partner full chart is available." : "Partner full chart is still needed for Manglik, timing and deeper synthesis."}
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "match" && hasCoupleResult && (
        <RelationshipStoryPanel
          milanResult={milanResult}
          compatibility={mangalCompatibility}
          relResult={relResult}
          dataConfidence={dataConfidence}
        />
      )}

      {mode === "match" && !hasCoupleResult && (
        <MissingDataCard
          icon="♡"
          title="Add both charts to generate compatibility"
          text="No couple score is shown until the required matching data is entered. Quick Ashtakoot uses Moon sign and Nakshatra only; full relationship intelligence needs DOB, exact time and birth place."
          action="Use the forms below, then analyse compatibility"
        />
      )}

      {/* ── NARRATIVE STRIP ── */}
      {mode === "profile" && relResult && (
        <div className="summary-strip" style={{ marginBottom: 16, color: "#4A4238" }}>
          {relResult.marriageNarrative}
        </div>
      )}

      {/* ── ASHTAKOOT INPUT CARDS ── */}
      {mode === "match" && (
        <>
          <div className="summary-strip" style={{ marginBottom: 14 }}>
            <span>त्वरित मिलान हेतु चंद्र राशि व नक्षत्र; समेकित मास्टर विवाह रिपोर्ट हेतु दोनों जन्म कुंडलियां आवश्यक हैं।</span>
          </div>
          {/* ── SAVED KUNDLIS FAST PICKER ── */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #FFFDF8 0%, #FAF5EB 100%)",
              border: "1.5px solid rgba(184,134,11,0.35)",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 16,
              boxShadow: "0 4px 15px rgba(184,134,11,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>📂</span>
                <div>
                  <div className="card-tag" style={{ margin: 0 }}>सेव की गई कुंडलियां (Saved Profiles)</div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>
                    सेव की गई कुंडली से 1-क्लिक मिलान करें
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {person1SavedId && person2SavedId && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, padding: "4px 10px" }}>
                    ✓ दोनों कुंडलियां सक्रिय
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {/* Person 1 Selector */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 12, padding: "14px 16px" }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#B8860B", display: "block", marginBottom: 6 }}>
                  👨 वर (Person 1 / स्वयं)
                </label>
                <select
                  value={person1SavedId}
                  onChange={(e) => handleSelectPerson1(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#FAF7F2",
                    border: "1px solid rgba(184,134,11,0.3)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: "#1A1A1A",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "Outfit,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <option value="">— कुंडली चुनें (या नीचे फॉर्म भरें) —</option>
                  {chart && (
                    <option value="self">
                      ★ आपकी मुख्य प्रोफाइल ({chart.name || "Self"} · {chart.dob})
                    </option>
                  )}
                  {savedCharts.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name} ({sc.dob} · {sc.city})
                    </option>
                  ))}
                </select>
                {effectiveChart1 && (
                  <div style={{ fontSize: 11, color: "#6B635B", marginTop: 6 }}>
                    सक्रिय: <strong>{effectiveChart1.name}</strong> ({effectiveChart1.lagnaRashi} लग्न, {effectiveChart1.planets.Moon?.sign} चंद्र)
                  </div>
                )}
              </div>

              {/* Person 2 Selector */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(232,121,249,0.35)", borderRadius: 12, padding: "14px 16px" }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#a855f7", display: "block", marginBottom: 6 }}>
                  👩 कन्या (Person 2 / जीवनसाथी)
                </label>
                <select
                  value={person2SavedId}
                  onChange={(e) => handleSelectPerson2(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#FAF7F2",
                    border: "1px solid rgba(232,121,249,0.4)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: "#1A1A1A",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "Outfit,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <option value="">— सेव की गई कुंडली चुनें (या नीचे फॉर्म भरें) —</option>
                  {savedCharts.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name} ({sc.dob} · {sc.city})
                    </option>
                  ))}
                </select>
                {partnerChart && (
                  <div style={{ fontSize: 11, color: "#6B635B", marginTop: 6 }}>
                    सक्रिय: <strong>{partnerChart.name}</strong> ({partnerChart.lagnaRashi} लग्न, {partnerChart.planets.Moon?.sign} चंद्र)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginBottom: 16 }}>
            <PersonForm
              label={chart?.planets?.Moon ? `Person 1 (${chart.name || "Your Chart"} · Auto-filled)` : "Person 1 (Self / You)"}
              color="#c8a030"
              value={p1}
              onChange={setP1}
            />
            <PersonForm
              label="Person 2 (Partner)"
              color="#e879f9"
              value={p2}
              onChange={setP2}
            />
          </div>

          <button
            onClick={calculate}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#c8a030,#a06820)", color: "#FAF7F2",
              fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 700,
              letterSpacing: "1px", marginBottom: 18,
            }}
          >
            {t("milan.calculate_btn")}
          </button>

          <PartnerFullChartForm
            form={partnerBirth}
            selectedCity={partnerCity}
            partnerChart={partnerChart}
            error={partnerError}
            onFormChange={setPartnerBirth}
            onCityChange={setPartnerCity}
            onGenerate={generatePartnerChart}
            onSave={handleSavePartnerChart}
            isSaving={savingPartner}
            saveSuccess={savedPartnerSuccess}
          />

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-tag">Explainable Breakdown</div>
            <BreakdownRow
              label="Ashtakoot"
              value={milanResult ? `${milanResult.totalScore}/36` : "Not calculated"}
              note={milanResult ? "Moon sign and Nakshatra compatibility is available." : "Run Quick Ashtakoot first."}
              status={milanResult ? "ready" : "missing"}
            />
            <BreakdownRow
              label="Manglik Balance"
              value={mangalCompatibility ? `${mangalCompatibility.balanceScore}/100` : "Not calculated"}
              note={mangalCompatibility ? "Both full charts are available for Mars balance." : "Requires both full DOB, time and place charts."}
              status={mangalCompatibility ? "ready" : "missing"}
            />
            <BreakdownRow
              label="Timing Synchronisation"
              value={mangalCompatibility ? `${mangalCompatibility.timingOverlap.score}/100` : "Not calculated"}
              note="Needs partner full chart before dasha/timing overlap can be trusted."
              status={mangalCompatibility ? "ready" : "missing"}
            />
            <BreakdownRow
              label="Family & Children Indicators"
              value={hasPartnerFullChart ? "Available" : "Not calculated"}
              note="Shown as family and parenting temperament indicators, not medical fertility prediction."
              status={hasPartnerFullChart ? "limited" : "missing"}
            />
          </div>
        </>
      )}

      {/* ── TABS ── */}
      <div className="tabs" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {visibleTabs.map(([t, l]) => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{l}</button>
        ))}
      </div>

      {/* ══════════════════════ MASTER MARRIAGE REPORT TAB ══════════════════════ */}
      {mode === "match" && activeTab === "master" && (
        masterReport ? (
          <MasterMarriageReportPanel
            report={masterReport}
            onSelectDate={(date) => {
              setTargetWeddingDate(date);
            }}
          />
        ) : (
          <div className="card" style={{ textAlign: "center", padding: 36, border: "2px dashed rgba(184,134,11,0.3)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👑</div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>
              मास्टर विवाह रिपोर्ट हेतु दोनों जन्म कुंडलियां आवश्यक हैं
            </div>
            <div style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 20px" }}>
              समेकित महा-रिपोर्ट में अष्टकूट (36-गुण परिहार सहित), मंगल पाप साम्यता (Paap Samyatha), D9 नवांश 4-स्तंभ विश्लेषण, KP 7th CSL, पुनर्भू योग शोध एवं के.एन. राव डबल गोचर का सटीक मिलान किया जाता है।
            </div>

            <div style={{ fontSize: 13, color: "#B8860B", fontWeight: 700, background: "rgba(184,134,11,0.08)", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 10, padding: "12px 20px", display: "inline-block" }}>
              👉 ऊपर दिए गए <strong>"📂 सेव की गई कुंडलियां"</strong> से वर और कन्या दोनों की प्रोफाइल चुनें, या नीचे पार्टनर का जन्म विवरण दर्ज करें।
            </div>
          </div>
        )
      )}

      {/* ══════════════════════ MANGAL DOSHA TAB ══════════════════════ */}
      {activeTab === "mars" && (
        <MangalDoshaPanel insight={mangalInsight} compatibility={mode === "match" ? mangalCompatibility : null} />
      )}

      {/* ══════════════════════ MARRIAGE TAB ══════════════════════ */}
      {mode === "profile" && activeTab === "marriage" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="Marriage Promise"
            icon="💍"
            score={relResult.layers.marriagePromise.score}
            paragraph={relResult.layers.marriagePromise.paragraph}
            color={colorForLabel(relResult.layers.marriagePromise.label)}
          />
          <LayerCard
            title="Personal Manglik Pattern"
            icon="Ma"
            score={relResult.layers.manglikBalance.score}
            paragraph={relResult.layers.manglikBalance.paragraph}
            color={colorForLabel(relResult.layers.manglikBalance.label)}
          />
          {milanResult && (
            <LayerCard
              title="Ashtakoot Integration"
              icon="🔗"
              score={relResult.layers.ashtakootCompatibility.score}
              paragraph={relResult.layers.ashtakootCompatibility.paragraph}
              color={colorForLabel(relResult.layers.ashtakootCompatibility.label)}
            />
          )}
          <div className="card" style={{ borderColor: "rgba(200,160,48,0.2)" }}>
            <div className="card-tag">💊 Remedies & Guidance</div>
            <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9 }}>{relResult.safeRelationshipRemedies}</div>
          </div>
          <div style={{ fontSize: 11, color: "#6B635B", textAlign: "center", padding: "8px 16px", background: "rgba(200,160,48,0.04)", borderRadius: 8, border: "1px solid rgba(184,134,11,0.2)" }}>
            {relResult.safetyBoundary}
          </div>
        </div>
      )}
      {mode === "profile" && activeTab === "marriage" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💍</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Generate Your Chart First</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>Marriage Intelligence requires your birth chart. Complete onboarding to see your relationship profile.</div>
        </div>
      )}

      {/* ══════════════════════ 8 KOOTS TAB ══════════════════════ */}
      {mode === "match" && activeTab === "koots" && milanResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Big score */}
          <div className="header-card" style={{ marginBottom: 8 }}>
            <div className="header-orb" />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
                <ScoreRing score={milanResult.totalScore} max={36} color={milanResult.verdictColor} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 700, color: milanResult.verdictColor, lineHeight: 1 }}>{milanResult.totalScore}</div>
                  <div style={{ fontSize: 9, color: "#6B635B" }}>out of 36</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#6B635B", marginBottom: 4 }}>Ashtakoot Result</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>
                  {milanResult.person1Name} <span style={{ color: "#e879f9" }}>💑</span> {milanResult.person2Name}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${milanResult.verdictColor}18`, border: `1px solid ${milanResult.verdictColor}44`, borderRadius: 8, padding: "4px 12px" }}>
                  <span style={{ fontSize: 14 }}>{milanResult.verdictIcon}</span>
                  <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 700, color: milanResult.verdictColor }}>{milanResult.verdict}</span>
                  <span style={{ fontSize: 11, color: "#6B635B" }}>· {milanResult.percentage}%</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="hstat"><div className="hstat-n" style={{ color: milanResult.verdictColor }}>{milanResult.totalScore}/36</div><div className="hstat-l">GUN</div></div>
                <div className="hstat"><div className="hstat-n" style={{ color: milanResult.doshas.length === 0 ? "#22c55e" : "#ef4444" }}>{milanResult.doshas.length}</div><div className="hstat-l">DOSHAS</div></div>
              </div>
            </div>
          </div>
          <div className="summary-strip" style={{ marginBottom: 8, borderColor: `${milanResult.verdictColor}44`, color: "#4A4238" }}>
            {milanResult.verdictIcon} {milanResult.recommendation}
          </div>
          {/* Score bar */}
          <div className="card" style={{ marginBottom: 4 }}>
            <div className="card-tag">✦ 8 Koot Analysis</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {milanResult.koots.map(k => (
                <div key={k.name} style={{ flex: k.maxPoints, height: 6, background: k.color, borderRadius: 3, opacity: k.points === 0 ? 0.2 : 0.85 }} title={`${k.name}: ${k.points}/${k.maxPoints}`} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#6B635B", marginTop: 4 }}>
              <span>Varna</span><span>Vashya</span><span>Tara</span><span>Yoni</span><span>Maitri</span><span>Gana</span><span>Bhakut</span><span>Nadi</span>
            </div>
          </div>
          {milanResult.koots.map(k => <KootCard key={k.name} k={k} />)}
        </div>
      )}
      {mode === "match" && activeTab === "koots" && !milanResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💑</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Enter Partner Details Above</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>Fill both Nakshatra and Rashi forms, then run Quick Ashtakoot to calculate 36-point compatibility.</div>
        </div>
      )}

      {/* ══════════════════════ PSYCHOLOGY TAB ══════════════════════ */}
      {mode === "profile" && activeTab === "psychology" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="Relationship Psychology"
            icon="🧠"
            score={relResult.layers.relationshipPsychology.score}
            paragraph={relResult.layers.relationshipPsychology.paragraph}
            color={colorForLabel(relResult.layers.relationshipPsychology.label)}
          />
          <LayerCard
            title="KP Marriage Validation (2-7-11)"
            icon="KP"
            score={relResult.layers.kpMarriageValidation.score}
            paragraph={relResult.layers.kpMarriageValidation.paragraph}
            color={colorForLabel(relResult.layers.kpMarriageValidation.label)}
          />
          <LayerCard
            title="Family & Children Indicators"
            icon="5H"
            score={relResult.layers.childrenAwareness.score}
            paragraph={relResult.layers.childrenAwareness.paragraph}
            color={colorForLabel(relResult.layers.childrenAwareness.label)}
          />
          <LayerCard
            title="KP Family Validation (2-5-11)"
            icon="KP"
            score={relResult.layers.kpChildrenValidation.score}
            paragraph={relResult.layers.kpChildrenValidation.paragraph}
            color={colorForLabel(relResult.layers.kpChildrenValidation.label)}
          />
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9, padding: "12px 16px", background: "#FFFFFF", borderRadius: 10, border: "1px solid rgba(184,134,11,0.2)" }}>
            Family indicators are traditional timing and temperament signals, not a medical fertility assessment.
          </div>
          {milanResult && (
            <div className="card">
              <div className="card-tag">✦ Psychological Compatibility</div>
              <div className="card-title serif">Scientific Meaning of Ashtakoot</div>
              <div style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.9, marginBottom: 16 }}>
                {milanResult.psychologicalInsight}
              </div>
              <div style={{ borderTop: "1px solid #FFFFFF", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { koot:"Varna", psych:"Value System & Spiritual Hierarchy", desc:"Compatibility of life values, ambitions, and spiritual orientation." },
                  { koot:"Vashya", psych:"Control Dynamics", desc:"Natural attraction and dominance balance in daily life." },
                  { koot:"Tara", psych:"Luck Harmony", desc:"Whether partners bring out good luck or create karmic friction." },
                  { koot:"Yoni", psych:"Instinct & Physical Bond", desc:"Animal archetype — deep instinctual and physical attraction." },
                  { koot:"Graha Maitri", psych:"Mental Friendship", desc:"Intellectual alignment and mutual thought-pattern support." },
                  { koot:"Gana", psych:"Temperament Type", desc:"Deva, Manushya, Rakshasa — day-to-day friction or harmony." },
                  { koot:"Bhakut", psych:"Emotional Direction", desc:"Emotional energy flow toward or away from each other." },
                  { koot:"Nadi", psych:"Biological Compatibility", desc:"DNA-level compatibility, health factors in offspring." },
                ].map(item => (
                  <div key={item.koot} style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: "1px solid #FFFFFF" }}>
                    <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 13, fontWeight: 600, color: "#c8a030", minWidth: 90 }}>{item.koot}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>{item.psych}</div>
                      <div style={{ fontSize: 11, color: "#6B635B", lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {mode === "match" && activeTab === "psychology" && hasCoupleResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {milanResult && (
            <div className="card">
              <div className="card-tag">Couple Psychology</div>
              <div className="card-title serif">Ashtakoot psychological layer</div>
              <div style={{ fontSize: 13, color: "var(--engine-soft)", lineHeight: 1.9 }}>
                {milanResult.psychologicalInsight}
              </div>
            </div>
          )}
          {mangalCompatibility && (
            <div className="card">
              <div className="card-tag">Partner Domains</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10, marginTop: 12 }}>
                {mangalCompatibility.domainCompatibility.map((domain) => (
                  <div key={domain.domain} style={{ border: "1px solid var(--engine-border)", borderRadius: 12, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                      <strong style={{ color: "var(--engine-fg)", fontSize: 12 }}>{domain.domain}</strong>
                      <span style={{ color: domain.score >= 75 ? "var(--engine-green)" : domain.score >= 58 ? "var(--engine-gold-strong)" : "#c2410c", fontSize: 12, fontWeight: 800 }}>
                        {domain.score}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--engine-muted)", lineHeight: 1.6 }}>{domain.interpretation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {mode === "match" && activeTab === "psychology" && !hasCoupleResult && (
        <MissingDataCard
          icon="🧠"
          title="Compatibility psychology is not calculated yet"
          text="Run Quick Ashtakoot or add the partner full chart before showing emotional, communication and family adjustment interpretation."
        />
      )}
      {mode === "profile" && activeTab === "psychology" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>Complete onboarding to see your relationship psychology analysis based on Moon, Venus, Mars, and Saturn placements.</div>
        </div>
      )}

      {/* ══════════════════════ CHILDREN TAB ══════════════════════ */}
      {mode === "profile" && activeTab === "children" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="header-card" style={{ marginBottom: 8 }}>
            <div className="header-orb" />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 20 }}>
              <MiniRing score={relResult.childrenScore} max={100} color={colorForLabel(relResult.layers.childrenAwareness.label)} size={64} />
              <div>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#6B635B", marginBottom: 4 }}>Family & Children Indicators</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: colorForLabel(relResult.layers.childrenAwareness.label) }}>
                  {relResult.childrenScore >= 76 ? "Supportive Indications" : relResult.childrenScore >= 58 ? "Mixed Support" : "Needs Patience & Faith"}
                </div>
              </div>
            </div>
          </div>
          <LayerCard
            title="Family & Children Indicators (5H + Jupiter)"
            icon="👶"
            score={relResult.layers.childrenAwareness.score}
            paragraph={relResult.layers.childrenAwareness.paragraph}
            color={colorForLabel(relResult.layers.childrenAwareness.label)}
          />
          <LayerCard
            title="KP Children Validation (2-5-11)"
            icon="🔬"
            score={relResult.layers.kpChildrenValidation.score}
            paragraph={relResult.layers.kpChildrenValidation.paragraph}
            color={colorForLabel(relResult.layers.kpChildrenValidation.label)}
          />
          <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9, padding: "12px 16px", background: "#FFFFFF", borderRadius: 10, border: "1px solid rgba(184,134,11,0.2)" }}>
            {relResult.childrenNarrative}
          </div>
        </div>
      )}
      {mode === "profile" && activeTab === "children" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👶</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>Complete onboarding to see children awareness based on 5th house, Jupiter, and KP significators.</div>
        </div>
      )}

      {/* ══════════════════════ KP TAB ══════════════════════ */}
      {mode === "profile" && activeTab === "kp" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="KP Marriage Validation (2-7-11)"
            icon="🔬"
            score={relResult.layers.kpMarriageValidation.score}
            paragraph={relResult.layers.kpMarriageValidation.paragraph}
            color={colorForLabel(relResult.layers.kpMarriageValidation.label)}
          />
          <LayerCard
            title="KP Children Validation (2-5-11)"
            icon="🧬"
            score={relResult.layers.kpChildrenValidation.score}
            paragraph={relResult.layers.kpChildrenValidation.paragraph}
            color={colorForLabel(relResult.layers.kpChildrenValidation.label)}
          />
          <div className="card">
            <div className="card-tag">ℹ️ About KP System</div>
            <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9 }}>
              Krishnamurti Paddhati (KP) validates events by checking if relevant house significators (planets ruling, occupying, or sub-lord of cusps) support the event. For marriage, houses 2-7-11 must be connected. For children, houses 2-5-11 are checked. This provides a scientific cross-validation layer beyond traditional Parashari analysis.
            </div>
          </div>
        </div>
      )}
      {mode === "profile" && activeTab === "kp" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>KP Validation requires your birth chart data.</div>
        </div>
      )}

      {/* ══════════════════════ TIMING TAB ══════════════════════ */}
      {mode === "profile" && activeTab === "timing" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="Marriage Timing Support"
            icon="⏱️"
            score={relResult.layers.marriageTimingSupport.score}
            paragraph={relResult.layers.marriageTimingSupport.paragraph}
            color={colorForLabel(relResult.layers.marriageTimingSupport.label)}
          />
          <div className="card">
            <div className="card-tag">📅 Dasha Context</div>
            <div className="card-title serif">Current Mahadasha & Marriage Windows</div>
            <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.9 }}>
              Marriage events typically manifest during the dashas of planets connected to houses 2, 7, and 11 — especially Venus, Jupiter, Rahu (for unconventional), and the 7th lord. The current dasha period influences your relationship readiness, timing of proposals, and marriage manifestation windows.
            </div>
            {chart && (
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {chart.dashas?.filter((d: { active?: boolean }) => d.active).map((d: { planet: string }, i: number) => (
                  <div key={i} style={{ background: "rgba(200,160,48,0.08)", border: "1px solid rgba(200,160,48,0.25)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#c8a030" }}>
                    MD: {d.planet}
                  </div>
                ))}
                {chart.antardasha?.filter((d: { active?: boolean }) => d.active).map((d: { planet: string }, i: number) => (
                  <div key={i} style={{ background: "rgba(232,121,249,0.08)", border: "1px solid rgba(232,121,249,0.25)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#e879f9" }}>
                    AD: {d.planet}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {mode === "match" && activeTab === "timing" && mangalCompatibility && (
        <div className="card">
          <div className="card-tag">Timing Synchronisation</div>
          <div className="card-title serif">{mangalCompatibility.timingOverlap.label.replaceAll("_", " ")}</div>
          <div style={{ fontSize: 13, color: "var(--engine-soft)", lineHeight: 1.9 }}>
            {mangalCompatibility.timingOverlap.interpretation}
          </div>
          <div style={{ marginTop: 14 }}>
            <ScoreBar label="Timing overlap" value={mangalCompatibility.timingOverlap.score} color={mangalCompatibility.timingOverlap.score >= 70 ? "var(--engine-green)" : mangalCompatibility.timingOverlap.score >= 55 ? "var(--engine-gold-strong)" : "#c2410c"} />
          </div>
        </div>
      )}
      {mode === "match" && activeTab === "timing" && !mangalCompatibility && (
        <MissingDataCard
          icon="⏱️"
          title="Partner timing overlap not calculated"
          text="Timing synchronisation needs both full birth charts. Quick Ashtakoot alone cannot validate dasha and timing overlap."
          action="Add partner DOB, exact time and birth place"
        />
      )}
      {mode === "profile" && activeTab === "timing" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏱️</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>Timing analysis requires your birth chart and active dasha data.</div>
        </div>
      )}

      {/* ══════════════════════ DOSHAS TAB ══════════════════════ */}
      {mode === "match" && activeTab === "doshas" && (mangalInsight || milanResult) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mangalInsight && (
            <MangalDoshaPanel insight={mangalInsight} compatibility={mangalCompatibility} />
          )}
          {milanResult && (
            milanResult.doshas.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 32, borderColor: "rgba(34,197,94,0.3)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>No Ashtakoot Doshas Detected</div>
                <div style={{ fontSize: 13, color: "#6B635B" }}>The quick 8-koot check is free of major Nadi, Bhakoot, Gana or Tara dosha flags.</div>
              </div>
            ) : (
              <>
                <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                  <div className="card-tag" style={{ color: "#ef4444" }}>Ashtakoot Doshas</div>
                  <div className="card-title serif">{milanResult.doshas.length} Dosha{milanResult.doshas.length > 1 ? "s" : ""} Found</div>
                  <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.8, marginBottom: 14 }}>
                    Doshas are compatibility stresses, not curses. Final judgement needs cancellation checks and D1/D9 validation.
                  </div>
                  {milanResult.koots.filter(k => k.hasDosha).map(k => (
                    <div key={k.name} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 600, color: "#ef4444", marginBottom: 4 }}>{k.name} Dosha</div>
                      <div style={{ fontSize: 12, color: "#4A4238", marginBottom: 8 }}>{k.doshaText}</div>
                      <div style={{ fontSize: 11, color: "#6B635B" }}>{k.detail}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-tag">Dosha Remedies</div>
                  <div className="card-title serif">Traditional Remedies</div>
                  {milanResult.koots.filter(k => k.hasDosha).map(k => (
                    <div key={k.name} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #FFFFFF" }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 14, fontWeight: 600, color: "#c8a030", marginBottom: 6 }}>{k.name} Dosha Remedy</div>
                      <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.8 }}>
                        {k.name === "Nadi" && "Use Nadi Dosha cancellation checks first. If still active, prefer Shiva worship, Mahamrityunjaya japa and family-level guidance from a qualified jyotishi."}
                        {k.name === "Bhakut" && "Bhakoot Dosha may reduce when rashi lords are friendly or other chart factors support the match. Validate with D1, D9 and family adjustment indicators."}
                        {k.name === "Gana" && "Gana Dosha is mainly temperament friction. Calm communication, family respect and shared routines matter more than fear-based remedies."}
                        {k.name === "Tara" && "Tara sensitivity is handled through nakshatra shanti, practical health rhythm awareness and careful timing."}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      )}
      {mode === "match" && activeTab === "doshas" && !mangalInsight && !milanResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>!</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Dosha analysis is not calculated</div>
          <div style={{ fontSize: 12, color: "#6B635B" }}>Run Quick Ashtakoot or add full charts to see Ashtakoot and Mangal Dosha evidence.</div>
        </div>
      )}

      </PremiumFeature>
    </div>
  );
}
