"use client";
import { useEffect, useMemo, useState } from "react";
import { EngineIntro } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { isAdminUser } from "@/lib/access";
import { createClient } from "@/lib/supabase/client";
import {
  calculateMedical,
  NAKSHATRA_DISEASE_BOOK,
  SIGN_DISEASE,
  FAMILY_RELATIONSHIPS,
  scanFamilyMemberHealth,
  scanFutureHealthWindows,
  type FamilyMemberKey,
} from "@/lib/astro-engine/medical";
import { EngineStateCard } from "@/components/engine-state-card";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FEATURE GATE FLAG (Rollout Controller):
 * - When `false`: Advanced Bhavat Bhavam Family Health, Gochar Backtesting Date
 *   Controller, and Critical Crisis Predictor are strictly restricted to
 *   ADMIN_EMAILS (mukulpal9@gmail.com, 9palmukul@gmail.com) and localhost.
 *   Regular public users see only the stable, standard wellness dashboard.
 * - When `true`: All features instantly become accessible to 100% of all users.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const ENABLE_ADVANCED_FEATURES_FOR_ALL = false;

const DOSHA_COLOR: Record<string, string> = { Pitta: "#DC2626", Kapha: "#15803D", Vata: "#1D4ED8" };
const FUNC_COLOR = { benefic: "#15803D", malefic: "#DC2626", neutral: "#6B635B" };
const PLANET_EMOJI: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke"
};

type Tab = "overview" | "family" | "ayurveda" | "timeline" | "combos" | "planets" | "nakshatra" | "signs";

export default function MedicalPage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedMember, setSelectedMember] = useState<FamilyMemberKey>("Self");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const email = session?.user?.email ?? null;
        setUserEmail(email);
        if (email && isAdminUser(email)) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.warn("Admin check skipped:", err);
      }
    };
    checkAdmin();
  }, []);

  const isLocalhost = typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("192.168.")
  );

  // Determines whether experimental backtesting & family Bhavat Bhavam tools are visible
  const hasAdvancedAccess = ENABLE_ADVANCED_FEATURES_FOR_ALL || isAdmin || isLocalhost;

  // Backtest / Transit Target Date
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const parsedTargetDate = useMemo(() => {
    try {
      const d = new Date(`${targetDateStr}T12:00:00+05:30`);
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  }, [targetDateStr]);

  // Ensure non-admin users always evaluate the current moment and self
  const effectiveTargetDate = hasAdvancedAccess ? parsedTargetDate : new Date();
  const effectiveMember: FamilyMemberKey = hasAdvancedAccess ? selectedMember : "Self";

  const result = useMemo(
    () => (chart && hasUserChart ? calculateMedical(chart, effectiveTargetDate) : null),
    [chart, hasUserChart, effectiveTargetDate]
  );

  // Compute family scan for currently selected member & target date
  const familyScan = useMemo(() => {
    if (!chart || !hasUserChart || !hasAdvancedAccess) return null;
    return scanFamilyMemberHealth(chart, effectiveMember, effectiveTargetDate);
  }, [chart, hasUserChart, hasAdvancedAccess, effectiveMember, effectiveTargetDate]);

  // Compute future health windows for selected member from target date
  const futureWindows = useMemo(() => {
    if (!chart || !hasUserChart || !hasAdvancedAccess) return [];
    return scanFutureHealthWindows(chart, effectiveMember, 180, effectiveTargetDate);
  }, [chart, hasUserChart, hasAdvancedAccess, effectiveMember, effectiveTargetDate]);

  // Ensure active tab is valid for the user's tier
  useEffect(() => {
    if (!hasAdvancedAccess && (activeTab === "family" || activeTab === "timeline")) {
      setActiveTab("overview");
    }
  }, [hasAdvancedAccess, activeTab]);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "30px 22px 110px", color: "#1A1A1A" }}>
        <EngineStateCard title="Health & Vitality" loading={loading} loadingText="Analyzing vitality patterns..." emptyText="Complete onboarding to view analysis." />
      </main>
    );
  }

  const scoreEntries = Object.entries(result.healthScores).sort((a, b) => b[1] - a[1]);
  const familyKeys: FamilyMemberKey[] = ["Self", "Father", "Mother", "Spouse", "Children", "Younger sibling", "Elder sibling"];

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "24px 18px 110px", color: "#1A1A1A" }}>
      <style>{`
        .med-card { background: #FFFFFF; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 14px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .med-card-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
        .med-card-body { padding: 0 16px 16px; border-top: 1px solid rgba(184, 134, 11, 0.12); padding-top: 14px; }
        .med-section { margin-bottom: 14px; }
        .med-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; opacity: 0.85; }
        .med-row { font-size: 12px; color: #4A4238; margin-bottom: 6px; line-height: 1.55; display: flex; gap: 8px; }
        .med-row strong { color: #1A1A1A; min-width: 80px; flex-shrink: 0; font-weight: 700; }
        .tab-btn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(184, 134, 11, 0.22); cursor: pointer; transition: all 0.15s; }
        .tab-btn.active { background: rgba(184, 134, 11, 0.14); border-color: rgba(184, 134, 11, 0.35); color: #B8860B; font-weight: 700; }
        .tab-btn:not(.active) { background: #FFFFFF; color: #6B635B; }
        .tab-btn:not(.active):hover { color: #1A1A1A; background: rgba(184, 134, 11, 0.08); }
        .member-pill { padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid rgba(184, 134, 11, 0.22); cursor: pointer; transition: all 0.15s; }
        .member-pill.active { background: #B8860B; color: #FFFFFF; border-color: #B8860B; }
        .member-pill:not(.active) { background: #FFFFFF; color: #4A4238; }
        .score-bar-bg { background: rgba(184, 134, 11, 0.15); border-radius: 4px; height: 8px; overflow: hidden; margin-top: 3px; }
        .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
        .combo-box { background: #FFFFFF; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; margin-right: 4px; }
        .nak-row { display: grid; grid-template-columns: 120px 1fr 80px; gap: 8px; font-size: 11px; padding: 6px 0; border-bottom: 1px solid rgba(184, 134, 11, 0.12); align-items: start; }
        .nak-row:last-child { border-bottom: none; }
        .dosha-gauge-bar { display: flex; height: 12px; border-radius: 6px; overflow: hidden; margin: 8px 0; background: rgba(0,0,0,0.05); }
      `}</style>

      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700, color: "#1A1A1A" }}>Health & Vitality</div>
          <div style={{ fontSize: "13px", color: "#6B635B", marginTop: "4px" }}>
            Ayurvedic & Classical Medical Astrology · Ojas Resilience: <strong style={{ color: "#B8860B" }}>{result.ojasScore}/100</strong> ({result.ojasRating})
          </div>
        </div>

        {(() => {
          const intro = engineIntros["medical"];
          return intro ? <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} /> : null;
        })()}

        {/* ── ADMIN TESTING LAB & BACKTEST TOOLBAR (Gated to Admin Mukul Pal) ── */}
        {hasAdvancedAccess && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.35)", borderRadius: "14px", padding: "14px 16px", marginBottom: "18px", boxShadow: "0 4px 16px rgba(184,134,11,0.06)" }}>
            {/* Admin Lab Header Badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid rgba(184,134,11,0.15)", flexWrap: "wrap", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }}>🔬</span>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#8A6008", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  Admin Testing Lab Mode
                </span>
                {userEmail && (
                  <span style={{ fontSize: "11px", background: "rgba(184,134,11,0.14)", color: "#8A6008", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                    {userEmail}
                  </span>
                )}
              </div>
              <span style={{ fontSize: "10px", color: "#6B635B", fontStyle: "italic" }}>
                (Testing features restricted to Admin · Hidden from public users)
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#8A6008", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                👥 Focus Profile (Bhavat Bhavam Derived Health):
              </span>
              <span style={{ fontSize: "11px", color: "#6B635B" }}>
                Active: <strong>{FAMILY_RELATIONSHIPS[selectedMember]?.hindiTitle}</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {familyKeys.map(k => (
                <button
                  key={k}
                  className={`member-pill${selectedMember === k ? " active" : ""}`}
                  onClick={() => {
                    setSelectedMember(k);
                    if (k !== "Self" && activeTab === "overview") {
                      setActiveTab("family");
                    }
                  }}
                >
                  {k === "Self" ? "👤 Self" : k === "Father" ? "👨‍👧‍👦 Father" : k === "Mother" ? "👩‍👧‍👦 Mother" : k === "Spouse" ? "💍 Spouse" : k === "Children" ? "👶 Children" : k === "Younger sibling" ? "👦 Younger Sibling" : "👧 Elder Sibling"}
                </button>
              ))}
            </div>

            {/* ── DATE & TRANSIT BACKTEST CONTROLLER ── */}
            <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed rgba(184,134,11,0.22)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#8A6008", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  📅 Gochar (Transit) & Backtest Date:
                </span>
                {familyScan?.activeDasha && (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: "#1A1A1A", background: "rgba(184,134,11,0.12)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                      Active Dasha: <strong>{familyScan.activeDasha.mahadasha}</strong> MD / <strong>{familyScan.activeDasha.antardasha}</strong> AD {familyScan.activeDasha.pratyantar ? `/ ${familyScan.activeDasha.pratyantar} PD` : ""}
                    </span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: familyScan.score >= 70 ? "rgba(220,38,38,0.2)" : familyScan.score >= 40 ? "rgba(220,38,38,0.12)" : familyScan.score >= 20 ? "rgba(180,83,9,0.12)" : "rgba(21,128,61,0.12)",
                      color: familyScan.score >= 40 ? "#DC2626" : familyScan.score >= 20 ? "#B45309" : "#15803D"
                    }}>
                      Score: {familyScan.score}/100 ({familyScan.windowLabel})
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="date"
                  value={targetDateStr}
                  onChange={(e) => setTargetDateStr(e.target.value)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(184,134,11,0.35)",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    background: "#FAF7F2",
                    color: "#1A1A1A",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer"
                  }}
                />
                <button
                  className="tab-btn"
                  onClick={() => setTargetDateStr(new Date().toISOString().split("T")[0])}
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                >
                  Today
                </button>
                <button
                  className="tab-btn"
                  onClick={() => {
                    setSelectedMember("Father");
                    setTargetDateStr("2026-09-14");
                  }}
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                >
                  14 Sep 2026 (Father Accident)
                </button>
                <button
                  className="tab-btn"
                  onClick={() => {
                    setSelectedMember("Father");
                    setTargetDateStr("2026-09-15");
                  }}
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                >
                  15 Sep 2026 (Father Hemorrhage / ICU)
                </button>
                <button
                  className="tab-btn"
                  onClick={() => {
                    setSelectedMember("Mother");
                    setTargetDateStr("2026-10-25");
                  }}
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                >
                  25 Oct 2026 (Mother UTI / Roga)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer banner */}
        <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.22)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", fontSize: "12px", lineHeight: "1.6" }}>
          <span style={{ color: "#DC2626", fontWeight: 700 }}>Wellness Disclaimer:</span>
          <span style={{ color: "#4A4238", marginLeft: "8px" }}>
            This analysis is an awareness tool based on classical Parashari principles and Ayurvedic shastras. It does <strong style={{ color: "#1A1A1A" }}>NOT</strong> constitute medical diagnosis, treatment, or clinical advice. Always consult a qualified registered medical doctor for any health concerns.
          </span>
        </div>

        {/* Main Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap" }}>
          {([
            ["overview", "Overview"],
            ...(hasAdvancedAccess ? [["family", `Family Health (${selectedMember})`]] : []),
            ["ayurveda", "Ayurveda & Tridosha"],
            ...(hasAdvancedAccess ? [["timeline", "Future Windows"]] : []),
            ["combos", "Classical Combos"],
            ["planets", "Planet Cards"],
            ["nakshatra", "Nakshatra Table"],
            ["signs", "Sign Disease"],
          ] as [Tab, string][]).map(([t, label]) => (
            <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── FAMILY HEALTH TAB (Add-on 1 Detailed View) ── */}
        {hasAdvancedAccess && activeTab === "family" && familyScan && (
          <>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: "14px", padding: "18px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>
                    {familyScan.hindiTitle} — Astrological Health Trace
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B635B", marginTop: "3px" }}>
                    Primary House: <strong>H{familyScan.primaryHouse}</strong> · Natural Karaka: <strong>{familyScan.karaka}</strong> · Evaluated Transit Date: <strong style={{ color: "#B8860B" }}>{targetDateStr}</strong>
                  </div>
                </div>
                <span className="tag" style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  background: familyScan.score >= 70 ? "rgba(220,38,38,0.2)" : familyScan.score >= 40 ? "rgba(220,38,38,0.1)" : familyScan.score >= 20 ? "rgba(180,83,9,0.1)" : "rgba(21,128,61,0.1)",
                  color: familyScan.score >= 40 ? "#DC2626" : familyScan.score >= 20 ? "#B45309" : "#15803D",
                  border: `1px solid ${familyScan.score >= 40 ? "rgba(220,38,38,0.3)" : familyScan.score >= 20 ? "rgba(180,83,9,0.3)" : "rgba(21,128,61,0.3)"}`
                }}>
                  {familyScan.windowLabel.toUpperCase()} ({familyScan.score}/100)
                </span>
              </div>

              {/* Derived 6 Pillars (Including 2H & 7H Maraka Sthanas) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px", margin: "14px 0" }}>
                <div style={{ background: "rgba(184,134,11,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(184,134,11,0.2)" }}>
                  <div style={{ fontSize: "10px", color: "#8A6008", fontWeight: 700 }}>1H VITALITY</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "2px" }}>House {familyScan.derivedHouses["1"]}</div>
                  <div style={{ fontSize: "10px", color: "#6B635B" }}>Lagna / Constitution</div>
                </div>
                <div style={{ background: "rgba(220,38,38,0.08)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.25)" }}>
                  <div style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>2H MARAKA</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "2px" }}>House {familyScan.derivedHouses["2"]}</div>
                  <div style={{ fontSize: "10px", color: "#6B635B" }}>Primary Maraka</div>
                </div>
                <div style={{ background: "rgba(220,38,38,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <div style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>6H ROGA</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "2px" }}>House {familyScan.derivedHouses["6"]}</div>
                  <div style={{ fontSize: "10px", color: "#6B635B" }}>Acute / Sickness</div>
                </div>
                <div style={{ background: "rgba(220,38,38,0.08)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.25)" }}>
                  <div style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>7H MARAKA</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "2px" }}>House {familyScan.derivedHouses["7"]}</div>
                  <div style={{ fontSize: "10px", color: "#6B635B" }}>Secondary Maraka</div>
                </div>
                <div style={{ background: "rgba(180,83,9,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(180,83,9,0.2)" }}>
                  <div style={{ fontSize: "10px", color: "#B45309", fontWeight: 700 }}>8H CRISIS</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "2px" }}>House {familyScan.derivedHouses["8"]}</div>
                  <div style={{ fontSize: "10px", color: "#6B635B" }}>Randhra / Ayu</div>
                </div>
                <div style={{ background: "rgba(29,78,216,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(29,78,216,0.2)" }}>
                  <div style={{ fontSize: "10px", color: "#1D4ED8", fontWeight: 700 }}>12H HOSPITAL</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "2px" }}>House {familyScan.derivedHouses["12"]}</div>
                  <div style={{ fontSize: "10px", color: "#6B635B" }}>Vyaya / Exit</div>
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.6", background: "#FAF7F2", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(184,134,11,0.15)" }}>
                {familyScan.summaryMessage}
              </div>

              {/* Active Convergence Hits */}
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#1A1A1A", marginBottom: "8px" }}>
                  🎯 Active Astrological Signatures ({familyScan.hits.length} factors identified):
                </div>
                {familyScan.hits.map((hit, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: "1px solid rgba(184,134,11,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="tag" style={{ background: "rgba(184,134,11,0.1)", color: "#8A6008" }}>{hit.layer}</span>
                      <strong style={{ fontSize: "12px", color: "#1A1A1A", marginRight: "6px" }}>{hit.planet}:</strong>
                      <span style={{ fontSize: "12px", color: "#4A4238" }}>{hit.reason}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#B8860B" }}>+{hit.score}</span>
                  </div>
                ))}
              </div>

              {/* Precautionary Care Advice */}
              <div style={{ marginTop: "16px", background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.2)", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#15803D", marginBottom: "6px" }}>
                  🛡️ Preventive Care Protocol for {familyScan.memberTitle}:
                </div>
                {familyScan.keyPrecautions.map((p, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.6" }}>
                    • {p}
                  </div>
                ))}
              </div>

              {/* Traditional Shastriya Upay */}
              <div style={{ marginTop: "12px", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#8A6008", marginBottom: "6px" }}>
                  🙏 Traditional Propitiation (Bhavat Bhavam):
                </div>
                {familyScan.traditionalUpays.map((u, i) => (
                  <div key={i} style={{ fontSize: "11px", color: "#4A4238", lineHeight: "1.6" }}>
                    ✓ {u}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Focus Profile Notice (Admin only) */}
            {hasAdvancedAccess && selectedMember !== "Self" && (
              <div style={{ background: "rgba(184,134,11,0.08)", border: "1px solid rgba(184,134,11,0.28)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ fontSize: "12px", color: "#4A4238" }}>
                  👥 <strong>Active Focus:</strong> {FAMILY_RELATIONSHIPS[selectedMember]?.hindiTitle}
                  <span style={{ marginLeft: "6px", color: "#6B635B" }}>
                    (Evaluated Transit Date: {targetDateStr} · Risk Score: {familyScan?.score}/100)
                  </span>
                </div>
                <button
                  className="tab-btn active"
                  style={{ padding: "4px 10px", fontSize: "11px" }}
                  onClick={() => setActiveTab("family")}
                >
                  View Detailed {selectedMember} Trace →
                </button>
              </div>
            )}

            {/* Overall sensitivity & Ojas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: result.riskLevel === "high" ? "rgba(220,38,38,0.06)" : result.riskLevel === "moderate" ? "rgba(180,83,9,0.06)" : "rgba(21,128,61,0.06)", border: `1px solid ${result.riskLevel === "high" ? "rgba(220,38,38,0.25)" : result.riskLevel === "moderate" ? "rgba(180,83,9,0.25)" : "rgba(21,128,61,0.25)"}`, borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontWeight: 700, fontSize: "12px", color: result.riskLevel === "high" ? "#DC2626" : result.riskLevel === "moderate" ? "#B45309" : "#15803D", marginBottom: "4px" }}>🩺 OVERALL SENSITIVITY</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>{result.riskLevel.toUpperCase()}</div>
                <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "4px", lineHeight: "1.5" }}>
                  Synthesized across dusthanas, dasha timing, and classical affliction nodes.
                </div>
              </div>

              <div style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.25)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontWeight: 700, fontSize: "12px", color: "#B8860B", marginBottom: "4px" }}>🛡️ OJAS (VITALITY RESILIENCE)</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>{result.ojasScore} / 100</div>
                <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "4px", lineHeight: "1.5" }}>
                  Rating: <strong style={{ color: "#B8860B" }}>{result.ojasRating}</strong> based on Lagna lord & Kendra support.
                </div>
              </div>
            </div>

            {/* Major Event / Crisis Indicator Card (Admin Testing Only) */}
            {hasAdvancedAccess && result.majorEventIndicator && (
              <div style={{
                background: result.majorEventIndicator.isMajorCandidate ? "rgba(220,38,38,0.05)" : "#FFFFFF",
                border: `1px solid ${result.majorEventIndicator.isMajorCandidate ? "rgba(220,38,38,0.3)" : "rgba(184,134,11,0.22)"}`,
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px" }}>{result.majorEventIndicator.isMajorCandidate ? "🚨" : "🛡️"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: result.majorEventIndicator.isMajorCandidate ? "#DC2626" : "#1A1A1A" }}>
                        Classical Major Event / Crisis Detection Engine
                      </div>
                      <div style={{ fontSize: "11px", color: "#6B635B" }}>
                        Multi-Vector Synchronicity: Dasha Marakas + Transit Ingress + Navtara + Dusthana Drishti
                      </div>
                    </div>
                  </div>
                  <span className="tag" style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: result.majorEventIndicator.isMajorCandidate ? "rgba(220,38,38,0.15)" : "rgba(21,128,61,0.15)",
                    color: result.majorEventIndicator.isMajorCandidate ? "#DC2626" : "#15803D",
                    border: `1px solid ${result.majorEventIndicator.isMajorCandidate ? "rgba(220,38,38,0.3)" : "rgba(21,128,61,0.3)"}`
                  }}>
                    {result.majorEventIndicator.level.toUpperCase()} ({result.majorEventIndicator.score}/100)
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.6", marginTop: "8px", background: "#FAF7F2", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(184,134,11,0.15)" }}>
                  {result.majorEventIndicator.whyMajorExplanation}
                </div>

                {result.majorEventIndicator.activeLayers.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#8A6008", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                      ⚡ Active Converging Triggers on Evaluated Date ({result.majorEventIndicator.convergingLayersCount} layers):
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                      {result.majorEventIndicator.activeLayers.map((layer, idx) => (
                        <span key={idx} className="tag" style={{ background: "rgba(220,38,38,0.1)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.25)" }}>
                          {layer}
                        </span>
                      ))}
                    </div>
                    {result.majorEventIndicator.reasons.map((r, idx) => (
                      <div key={idx} style={{ fontSize: "11px", color: "#6B635B", lineHeight: "1.5", marginBottom: "3px" }}>
                        • {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Active Dasha Health Timing Card */}
            {result.timingAlerts && result.timingAlerts.length > 0 && (
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#B8860B" }}>
                    ⏳ Active Dasha Health Timing (3-Tier Resolution)
                  </div>
                  <span style={{ fontSize: "11px", color: "#6B635B" }}>Evaluated Date: {targetDateStr}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  {result.timingAlerts.map((alert, i) => (
                    <div key={i} style={{
                      background: alert.severity === "high" ? "rgba(220,38,38,0.05)" : alert.severity === "medium" ? "rgba(180,83,9,0.05)" : "rgba(21,128,61,0.05)",
                      border: `1px solid ${alert.severity === "high" ? "rgba(220,38,38,0.25)" : alert.severity === "medium" ? "rgba(180,83,9,0.25)" : "rgba(21,128,61,0.25)"}`,
                      borderRadius: "10px",
                      padding: "12px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#8A6008", textTransform: "uppercase" }}>
                          {alert.level}
                        </span>
                        <span className="tag" style={{
                          background: alert.severity === "high" ? "rgba(220,38,38,0.15)" : alert.severity === "medium" ? "rgba(180,83,9,0.15)" : "rgba(21,128,61,0.15)",
                          color: alert.severity === "high" ? "#DC2626" : alert.severity === "medium" ? "#B45309" : "#15803D"
                        }}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>
                        {alert.planet}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: alert.severity === "high" ? "#DC2626" : "#6B635B", marginBottom: "6px" }}>
                        Focal Organs: {alert.concern}
                      </div>
                      <div style={{ fontSize: "11px", color: "#4A4238", lineHeight: "1.5" }}>
                        {alert.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tri-Dosha Bar */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>🧬 Prakriti: {result.tridoshaBreakdown.dominant}</div>
                <div style={{ fontSize: "11px", color: "#B8860B", fontWeight: 600 }}>{result.tridoshaBreakdown.constitutionType}</div>
              </div>
              <div className="dosha-gauge-bar">
                <div style={{ width: `${result.tridoshaBreakdown.vata}%`, background: "#1D4ED8" }} title={`Vata ${result.tridoshaBreakdown.vata}%`} />
                <div style={{ width: `${result.tridoshaBreakdown.pitta}%`, background: "#DC2626" }} title={`Pitta ${result.tridoshaBreakdown.pitta}%`} />
                <div style={{ width: `${result.tridoshaBreakdown.kapha}%`, background: "#15803D" }} title={`Kapha ${result.tridoshaBreakdown.kapha}%`} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B635B", marginTop: "4px" }}>
                <span style={{ color: "#1D4ED8", fontWeight: 600 }}>Vata: {result.tridoshaBreakdown.vata}%</span>
                <span style={{ color: "#DC2626", fontWeight: 600 }}>Pitta: {result.tridoshaBreakdown.pitta}%</span>
                <span style={{ color: "#15803D", fontWeight: 600 }}>Kapha: {result.tridoshaBreakdown.kapha}%</span>
              </div>
              <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.6", marginTop: "10px" }}>
                {result.prakriti}
              </div>
            </div>

            {/* Agni Digestive Fire Card */}
            <div style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#0F766E" }}>🔥 Jatharagni (Digestive Fire) — {result.agniProfile.title}</div>
                <div style={{ fontSize: "11px", color: "#0F766E", fontWeight: 600 }}>{result.agniProfile.sanskrit}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.6" }}>{result.agniProfile.tendency}</div>
              <div style={{ fontSize: "11px", color: "#0F766E", marginTop: "8px", fontWeight: 600 }}>
                Protocol: {result.agniProfile.balancingProtocol}
              </div>
            </div>

            {/* Health Sensitivity Scores */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#B8860B", marginBottom: "14px" }}>📊 Body System Sensitivity Scores</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                {scoreEntries.map(([cat, score]) => {
                  const barColor = score >= 40 ? "#DC2626" : score >= 20 ? "#B45309" : "#15803D";
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "2px" }}>
                        <span style={{ color: "#1A1A1A" }}>{cat}</span>
                        <span style={{ color: barColor, fontWeight: 700 }}>{score > 0 ? score : "—"}</span>
                      </div>
                      <div className="score-bar-bg">
                        <div className="score-bar-fill" style={{ width: `${score}%`, background: barColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accident / Surgery Score */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>⚡ Accident & Surgery Sensitivity (Native)</div>
                <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "3px" }}>
                  Mars-Rahu, Mars-Saturn aspects + Ketu surgical indicators + Gochar Mars/Saturn 8H triggers. (Benefics in H8 provide longevity shielding)
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "28px", fontWeight: 700, color: result.accidentScore >= 40 ? "#DC2626" : result.accidentScore >= 20 ? "#B45309" : "#15803D" }}>
                  {result.accidentScore}
                </div>
                <div style={{ fontSize: "10px", color: "#6B635B", fontWeight: 600 }}>
                  {result.accidentScore >= 40 ? "High Alert" : result.accidentScore >= 20 ? "Moderate" : "Low Baseline"}
                </div>
              </div>
            </div>

            {/* Preventive Routine */}
            <div style={{ background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.22)", borderRadius: "10px", padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#15803D", marginBottom: "8px" }}>✅ Personalized Preventive Routine</div>
              {result.preventiveRoutine.map((line, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", padding: "5px 0", borderBottom: i === result.preventiveRoutine.length - 1 ? "none" : "1px solid rgba(21,128,61,0.12)" }}>
                  • {line}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── TIMELINE TAB (Add-on 2: Future Windows) ── */}
        {hasAdvancedAccess && activeTab === "timeline" && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "6px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}>
                  📅 Future Astrological Health Windows — {FAMILY_RELATIONSHIPS[selectedMember]?.hindiTitle}
                </div>
                <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "2px" }}>
                  Upcoming multi-layer convergence periods (Dasha + Gochar into derived 6H/8H/12H).
                </div>
              </div>
            </div>

            {futureWindows.length === 0 ? (
              <div style={{ background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.2)", borderRadius: "10px", padding: "20px", textAlign: "center", color: "#15803D", fontSize: "13px", fontWeight: 600 }}>
                ✓ No high-convergence acute health alerts identified in the next 6-month horizon for {selectedMember}.
              </div>
            ) : (
              futureWindows.map((win, idx) => (
                <div key={idx} style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "4px" }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>
                      🗓️ {win.startDate} — {win.endDate}
                    </div>
                    <span className="tag" style={{
                      background: win.score >= 40 ? "rgba(220,38,38,0.1)" : "rgba(180,83,9,0.1)",
                      color: win.score >= 40 ? "#DC2626" : "#B45309"
                    }}>
                      Convergence Score: {win.score}/100
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#8A6008", marginBottom: "4px" }}>
                    <strong>Trigger Astrological Vectors:</strong> {win.triggerSummary}
                  </div>
                  <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.55" }}>
                    <strong>Precautionary Focus:</strong> {win.actionablePrecaution}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── AYURVEDA TAB (AYU-34-26.pdf Protocols - Add-on 3) ── */}
        {activeTab === "ayurveda" && (
          <>
            {/* Tri-Dosha Deep Dive */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "18px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#1A1A1A", marginBottom: "6px" }}>
                🌿 Tri-Dosha Constitution ({result.tridoshaBreakdown.dominant})
              </div>
              <div style={{ fontSize: "12px", color: "#6B635B", lineHeight: "1.6", marginBottom: "14px" }}>
                Derived from mathematical synthesis of your Lagna ({result.lagnaSign}), Lagna lord, Moon, and planetary elemental distribution.
              </div>

              <div className="dosha-gauge-bar" style={{ height: "16px" }}>
                <div style={{ width: `${result.tridoshaBreakdown.vata}%`, background: "#1D4ED8" }} />
                <div style={{ width: `${result.tridoshaBreakdown.pitta}%`, background: "#DC2626" }} />
                <div style={{ width: `${result.tridoshaBreakdown.kapha}%`, background: "#15803D" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "12px", textAlign: "center" }}>
                <div style={{ background: "rgba(29,78,216,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(29,78,216,0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#1D4ED8" }}>VATA</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#1D4ED8" }}>{result.tridoshaBreakdown.vata}%</div>
                  <div style={{ fontSize: "10px", color: "#6B635B", marginTop: "2px" }}>Air & Ether · Nervous system</div>
                </div>
                <div style={{ background: "rgba(220,38,38,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#DC2626" }}>PITTA</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#DC2626" }}>{result.tridoshaBreakdown.pitta}%</div>
                  <div style={{ fontSize: "10px", color: "#6B635B", marginTop: "2px" }}>Fire & Water · Metabolism</div>
                </div>
                <div style={{ background: "rgba(21,128,61,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(21,128,61,0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#15803D" }}>KAPHA</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#15803D" }}>{result.tridoshaBreakdown.kapha}%</div>
                  <div style={{ fontSize: "10px", color: "#6B635B", marginTop: "2px" }}>Water & Earth · Structure</div>
                </div>
              </div>
            </div>

            {/* Ayurvedic Daiva Vyapashraya Chikitsa (AYU Paper) */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: "14px", padding: "18px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#1A1A1A", marginBottom: "4px" }}>
                📜 Daiva Vyapashraya Chikitsa (Traditional Shastriya Protocols)
              </div>
              <div style={{ fontSize: "11px", color: "#6B635B", marginBottom: "14px" }}>
                Academic Reference: Prof. Jaiprakash Narayan Dwivedi, <em>AYU Journal</em> (Dwarka Sanskrit Academy).
              </div>

              {/* Snan Aushadhi Card */}
              {result.snanAushadhi && (
                <div style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#8A6008", marginBottom: "4px" }}>
                    🌿 Planetary Herbal Bath (स्नानो-औषधि) — {result.snanAushadhi.planet}
                  </div>
                  <div className="med-row"><strong>Primary Herb:</strong> {result.snanAushadhi.primaryHerb} ({result.snanAushadhi.hindiName})</div>
                  <div className="med-row"><strong>Preparation:</strong> {result.snanAushadhi.preparationMethod}</div>
                  <div className="med-row"><strong>Therapeutic Role:</strong> {result.snanAushadhi.therapeuticBenefit}</div>
                </div>
              )}

              {/* Auspicious Daan Kaal */}
              {result.daanKaal && (
                <div style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0F766E", marginBottom: "4px" }}>
                    ☀️ Auspicious Planetary Charity Timing (दान काल निर्धारण) — {result.daanKaal.planet}
                  </div>
                  <div className="med-row"><strong>Auspicious Window:</strong> {result.daanKaal.auspiciousTiming} ({result.daanKaal.ghatiDescription})</div>
                  <div className="med-row"><strong>Traditional Items:</strong> {result.daanKaal.daanItems.join(", ")}</div>
                  <div className="med-row"><strong>Dakshina:</strong> {result.daanKaal.dakshina}</div>
                  <div className="med-row"><strong>Japa Count:</strong> {result.daanKaal.japaCount.toLocaleString()} recitations</div>
                </div>
              )}

              {/* Charaka Prognosis */}
              {result.ayurvedicPrognosis && (
                <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>
                      ⚖️ Ayurvedic Prognostic Status: {result.ayurvedicPrognosis.hindiTitle}
                    </div>
                    <span className="tag" style={{ background: "rgba(184,134,11,0.15)", color: "#8A6008" }}>
                      {result.ayurvedicPrognosis.classification}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#8A6008", fontStyle: "italic", marginBottom: "6px" }}>
                    {result.ayurvedicPrognosis.charakaReference}
                  </div>
                  <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.6" }}>
                    {result.ayurvedicPrognosis.clinicalManagementAdvice}
                  </div>
                </div>
              )}
            </div>

            {/* 7 Dhatus Table */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A1A", marginBottom: "4px" }}>
                🧱 Sapta Dhatu Analysis (7 Vital Body Tissues)
              </div>
              <div style={{ fontSize: "11px", color: "#6B635B", marginBottom: "14px" }}>
                Classical Ayurvedic tissue systems evaluated through their planetary rulers.
              </div>

              {result.dhatuAfflictions.map(d => (
                <div key={d.dhatu} style={{ padding: "10px 0", borderBottom: "1px solid rgba(184,134,11,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>
                      {d.sanskritName} <span style={{ fontSize: "11px", fontWeight: 500, color: "#6B635B" }}>({d.governingPlanet})</span>
                    </div>
                    <span className="tag" style={{
                      background: d.status === "High Vulnerability" ? "rgba(220,38,38,0.1)" : d.status === "Moderate Vulnerability" ? "rgba(180,83,9,0.1)" : "rgba(21,128,61,0.1)",
                      color: d.status === "High Vulnerability" ? "#DC2626" : d.status === "Moderate Vulnerability" ? "#B45309" : "#15803D",
                      border: `1px solid ${d.status === "High Vulnerability" ? "rgba(220,38,38,0.3)" : d.status === "Moderate Vulnerability" ? "rgba(180,83,9,0.3)" : "rgba(21,128,61,0.3)"}`
                    }}>
                      {d.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#6B635B" }}>{d.tissueSystem}</div>
                  <div style={{ fontSize: "12px", color: "#4A4238", marginTop: "3px", lineHeight: "1.5" }}>{d.indicators}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── COMBOS TAB (Traditional Citations + Safe Tone Guidance) ── */}
        {activeTab === "combos" && (
          <>
            <div style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "12px", color: "#4A4238", lineHeight: "1.6" }}>
              🏛️ <strong>Classical Medical Texts & Medical Safe Tone Engine:</strong> This section cross-examines classical yoga citations (including traditional references like Rajyakshma / Tuberculosis from Dr. S. Krishna Kumar & BPHS) alongside modern non-fatalistic, empathetic clinical guidance.
            </div>

            {result.triggeredCombos.length === 0 ? (
              <div style={{ background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.22)", borderRadius: "10px", padding: "20px", fontSize: "13px", color: "#15803D", textAlign: "center", fontWeight: 600 }}>
                ✓ No acute classical disease combinations triggered in your natal chart.
              </div>
            ) : (
              result.triggeredCombos.map((combo, i) => (
                <div key={i} className="combo-box" style={{ borderLeft: `4px solid ${combo.severity === "high" ? "#DC2626" : combo.severity === "medium" ? "#B45309" : "#15803D"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}>⚠️ {combo.disease}</div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <span className="tag" style={{ background: combo.severity === "high" ? "rgba(220,38,38,0.1)" : "rgba(180,83,9,0.1)", color: combo.severity === "high" ? "#DC2626" : "#B45309" }}>
                        {combo.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Classical Citation */}
                  <div style={{ fontSize: "11px", color: "#8A6008", background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.15)", borderRadius: "6px", padding: "8px 10px", marginBottom: "8px", lineHeight: "1.55" }}>
                    <strong>Classical Citation:</strong> {combo.classicalCitation}
                  </div>

                  {/* Safe Tone Guidance */}
                  <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", background: "rgba(21,128,61,0.04)", border: "1px solid rgba(21,128,61,0.15)", borderRadius: "6px", padding: "8px 10px" }}>
                    <strong style={{ color: "#15803D" }}>🛡️ Preventive Guidance:</strong> {combo.safeToneGuidance}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── PLANETS TAB ── */}
        {activeTab === "planets" && result.planetCards.map(card => {
          const isOpen = expanded === card.planet;
          const doshaColor = DOSHA_COLOR[card.tridosha] || "#6B635B";
          return (
            <div key={card.planet} className="med-card" style={{ borderLeft: `4px solid ${card.inDusthana ? "#DC2626" : "rgba(184,134,11,0.3)"}` }}>
              <div className="med-card-header" onClick={() => setExpanded(isOpen ? null : card.planet)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{PLANET_EMOJI[card.planet]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}>
                      {card.planet} — House {card.house}
                      {card.retrograde && <span style={{ color: "#C2410C", marginLeft: "6px", fontSize: "11px", fontWeight: 600 }}>(R)</span>}
                      {card.isCombust && <span style={{ color: "#DC2626", marginLeft: "6px", fontSize: "11px", fontWeight: 600 }}>(Combust)</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B635B" }}>
                      {card.sign} · {card.nakshatra} P{card.pada} · Dignity: {card.dignity}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  {card.isHouseLordOf.length > 0 && (
                    <span className="tag" style={{ background: "rgba(184,134,11,0.08)", color: "#B8860B" }}>
                      Lord: {card.isHouseLordOf.map(h => `H${h}`).join(", ")}
                    </span>
                  )}
                  {card.inDusthana && <span className="tag" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.28)", color: "#DC2626" }}>Dusthana</span>}
                  <span className="tag" style={{ background: `${doshaColor}15`, border: `1px solid ${doshaColor}44`, color: doshaColor }}>{card.tridosha}</span>
                  <span className="tag" style={{ background: `${FUNC_COLOR[card.funcNature]}15`, border: `1px solid ${FUNC_COLOR[card.funcNature]}44`, color: FUNC_COLOR[card.funcNature] }}>{card.funcNature}</span>
                  <span style={{ color: "#6B635B", fontSize: "14px" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div className="med-card-body">
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#DC2626" }}>H{card.house} Health Profile</div>
                    <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: "7px", padding: "9px 11px" }}>
                      {card.houseNote}
                    </div>
                  </div>
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#8A6008" }}>Planetary Aspects & Varga Alignment</div>
                    <div className="med-row">
                      <strong>Aspects (Drishti):</strong> Casts aspect on houses {card.aspectingHouses.map(h => `H${h}`).join(", ")}
                    </div>
                    {card.d6Sign && (
                      <div className="med-row">
                        <strong>D6 Shasthamsa:</strong> Placed in {card.d6Sign}
                      </div>
                    )}
                  </div>
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#8A6008" }}>Nakshatra Pattern</div>
                    <div className="med-row"><strong>Tendency:</strong> {card.nakshatraDisease}</div>
                    <div className="med-row"><strong>Body zone:</strong> {card.nakshatraBody}</div>
                    <div className="med-row"><strong>Boil zone:</strong> {card.boilZone}</div>
                  </div>
                  {card.nakUpay && (
                    <div style={{ fontSize: "11px", color: "#6B635B", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.18)", borderRadius: "6px", padding: "8px 10px", lineHeight: "1.6" }}>
                      🙏 <strong>Propitiation Upay:</strong> {card.nakUpay}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ── NAKSHATRA TABLE TAB ── */}
        {activeTab === "nakshatra" && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#8A6008", marginBottom: "14px" }}>📚 All 27 Nakshatras — Classical Disease Reference (Dr. S. Krishna Kumar)</div>
            <div className="nak-row" style={{ fontWeight: 700, color: "#6B635B", borderBottom: "1px solid rgba(184,134,11,0.18)", paddingBottom: "8px", marginBottom: "4px" }}>
              <div>Nakshatra</div><div>Disease Tendency</div><div>Body Zone</div>
            </div>
            {Object.entries(NAKSHATRA_DISEASE_BOOK).map(([nak, data]) => (
              <div key={nak} className="nak-row" style={{ color: nak === result.birthNakshatra ? "#1A1A1A" : "#4A4238", background: nak === result.birthNakshatra ? "rgba(124,58,237,0.07)" : "transparent", borderRadius: "4px" }}>
                <div style={{ fontWeight: nak === result.birthNakshatra ? 700 : 500, color: nak === result.birthNakshatra ? "#7C3AED" : "#1A1A1A" }}>
                  {nak === result.birthNakshatra ? "⭐ " : ""}{nak}
                </div>
                <div>{data.disease}</div>
                <div style={{ color: "#6B635B" }}>{data.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── SIGNS TAB ── */}
        {activeTab === "signs" && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#8A6008", marginBottom: "14px" }}>♈ Sign Disease Reference (Kaal Purusha Anatomy)</div>
            {Object.entries(SIGN_DISEASE).map(([sign, disease]) => (
              <div key={sign} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(184,134,11,0.12)", background: sign === result.lagnaSign || sign === result.moonSign ? "rgba(184,134,11,0.06)" : "transparent", borderRadius: "4px" }}>
                <div style={{ minWidth: "90px", fontWeight: 700, fontSize: "12px", color: sign === result.lagnaSign ? "#8A6008" : sign === result.moonSign ? "#1D4ED8" : "#1A1A1A" }}>
                  {sign === result.lagnaSign ? "⬆ " : sign === result.moonSign ? "🌙 " : ""}{sign}
                </div>
                <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.55" }}>{disease}</div>
              </div>
            ))}
            <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "12px" }}>⬆ = Your lagna sign &nbsp;·&nbsp; 🌙 = Your moon sign</div>
          </div>
        )}

        {/* Footer disclaimer */}
        <div style={{ marginTop: "28px", padding: "12px 14px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: "8px", fontSize: "11px", color: "#6B635B", lineHeight: "1.6" }}>
          ⚕️ This analysis is based on classical Ayurvedic and Parashari medical astrology texts. All scores and patterns are awareness indicators only. No content here replaces professional medical evaluation, diagnosis, or treatment. The authors disclaim all medical liability.
        </div>
      </div>
    </main>
  );
}
