"use client";
import { useMemo, useState } from "react";
import { EngineIntro } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { calculateRemedies, type RemedyCard } from "@/lib/astro-engine/remedy";
import { REMEDY_CONTRADICTION_RULES } from "@/lib/astro-engine/lalkitab-knowledge";
import {
  analyzePhase1Remedies,
  isPlanet,
  type Planet,
} from "@/lib/astro-intelligence/phase-1-remedies/complete-remedy-intelligence-engine";
import { EngineStateCard } from "@/components/engine-state-card";
import { CorePlanetRemediesDossier } from "@/components/remedies/CorePlanetRemediesDossier";

const PRIORITY_COLOR: Record<RemedyCard["priority"], string> = {
  "dasha-active": "#7C3AED",
  "urgent":       "#DC2626",
  "recommended":  "#B45309",
  "optional":     "#15803D",
};
const PRIORITY_LABEL: Record<RemedyCard["priority"], string> = {
  "dasha-active": "⏰ Active Dasha",
  "urgent":       "⚠️ Urgent",
  "recommended":  "✦ Recommended",
  "optional":     "✓ Optional",
};
const PLANET_EMOJI: Record<string, string> = {
  Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa", Rahu:"Ra", Ketu:"Ke"
};

export default function RemedyPage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const result = useMemo(() => (chart && hasUserChart ? calculateRemedies(chart) : null), [chart, hasUserChart]);
  const [activeTab, setActiveTab] = useState<"all" | "urgent" | "lk" | "phase1">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Check which contradiction rules are triggered by same-house planet pairs
  const activeWarnings = useMemo(() => {
    if (!chart?.planets) return [];
    const pls = chart.planets as Record<string, { house: number }>;
    const cohabiting = new Set<string>();
    const names = Object.keys(pls);
    names.forEach((a, i) => names.forEach((b, j) => {
      if (j <= i) return;
      if (pls[a]?.house === pls[b]?.house) {
        cohabiting.add([a,b].sort().join("-"));
      }
    }));
    return REMEDY_CONTRADICTION_RULES.filter(rule =>
      rule.examples.some(ex => {
        const parts = ex.split(/[-+]/);
        if (parts.length === 2) return cohabiting.has(parts.map(s=>s.trim()).sort().join("-"));
        return false;
      })
    );
  }, [chart]);

  const phase1Timing = useMemo(() => {
    if (!chart || !result) return null;
    const activeLalKitabPlanetRaw =
      result.cards.find((card) => card.priority === "dasha-active")?.planet ||
      result.cards.find((card) => card.priority === "urgent")?.planet;
    const activeLalKitabPlanets: Planet[] = isPlanet(activeLalKitabPlanetRaw)
      ? [activeLalKitabPlanetRaw]
      : [];
    const stressedPlanets = result.cards
      .filter((card) => card.priority === "urgent")
      .map((card) => card.planet)
      .filter(isPlanet)
      .slice(0, 3);
    const planetNakshatras = Object.fromEntries(
      (Object.entries(chart.planets) as [string, any][])
        .filter(([planet, data]) => isPlanet(planet) && typeof data?.nakshatra === "string")
        .map(([planet, data]) => [planet, data.nakshatra])
    );

    if (!isPlanet(result.dashaActive)) return null;

    return analyzePhase1Remedies({
      mahadashaPlanet: result.dashaActive,
      antardashaPlanet: isPlanet(result.antardashaActive) ? result.antardashaActive : undefined,
      pratyantardashaPlanet: isPlanet(result.pratyantardashaActive) ? result.pratyantardashaActive : undefined,
      moonNakshatra: chart.planets.Moon?.nakshatra || "Ashwini",
      planetNakshatras,
      activeLalKitabPlanets,
      stressedPlanets,
      language: "hinglish",
    });
  }, [chart, result]);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "30px 22px 110px", color: "#1A1A1A" }}>
        <EngineStateCard title="💊 Remedy Engine" loading={loading} loadingText="Calculating remedies..." emptyText="Complete onboarding to view remedies." />
      </main>
    );
  }

  const filtered = result.cards.filter(c => {
    if (activeTab === "urgent") return c.priority === "urgent" || c.priority === "dasha-active";
    if (activeTab === "lk") return c.lkUpay.length > 0;
    if (activeTab === "phase1") return false;
    return true;
  });
  const personalizedPlan = [...result.cards]
    .sort((a, b) => b.personalizationScore - a.personalizationScore)
    .slice(0, 3);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "24px 18px 110px", color: "#1A1A1A" }}>
      <style>{`
        .rem-card { background: #FFFFFF; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 14px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .rem-card-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
        .rem-card-body { padding: 0 16px 16px; border-top: 1px solid rgba(184, 134, 11, 0.12); }
        .rem-pill { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-right: 6px; margin-bottom: 4px; }
        .rem-section { margin-bottom: 14px; }
        .rem-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; opacity: 0.85; }
        .rem-row { font-size: 12px; color: #4A4238; margin-bottom: 6px; line-height: 1.55; display: flex; gap: 8px; }
        .rem-row strong { color: #1A1A1A; min-width: 70px; flex-shrink: 0; font-weight: 700; }
        .lk-item { font-size: 12px; color: #4A4238; line-height: 1.6; padding: 5px 0; border-bottom: 1px solid rgba(184, 134, 11, 0.12); }
        .kat-box { background: rgba(15, 118, 110, 0.08); border: 1px solid rgba(15, 118, 110, 0.25); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; font-size: 12px; color: #0F766E; line-height: 1.6; }
        .tab-btn { padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(184, 134, 11, 0.22); cursor: pointer; transition: all 0.15s; }
        .tab-btn.active { background: rgba(184, 134, 11, 0.14); border-color: rgba(184, 134, 11, 0.35); color: #B8860B; font-weight: 700; }
        .tab-btn:not(.active) { background: #FFFFFF; color: #6B635B; }
        .tab-btn:not(.active):hover { color: #1A1A1A; background: rgba(184, 134, 11, 0.08); }
        .weak-tag { display: inline-block; background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.28); border-radius: 4px; padding: 2px 7px; font-size: 10px; font-weight: 600; color: #DC2626; margin-right: 4px; }
        .phase-card { background: #FFFFFF; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 14px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .phase-title { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px; }
        .phase-text { font-size: 12px; color: #4A4238; line-height: 1.75; white-space: pre-line; }
        .phase-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid rgba(21, 128, 61, 0.3); background: rgba(21, 128, 61, 0.08); color: #15803D; margin-bottom: 8px; }
        .safe-plan { background: #FFFFFF; border: 1px solid rgba(21, 128, 61, 0.25); border-radius: 12px; padding: 14px 16px; margin-bottom: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .safe-plan-title { font-size: 12px; font-weight: 800; color: #15803D; letter-spacing: .5px; margin-bottom: 8px; text-transform: uppercase; }
        .safe-plan-line { font-size: 12px; color: #4A4238; line-height: 1.65; padding: 4px 0; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700, color: "#1A1A1A" }}>💊 Remedy Engine</div>
          <div style={{ fontSize: "13px", color: "#6B635B", marginTop: "4px" }}>Vedic Upay · Lal Kitab Amrit · Karma Alignment · {result.cards.length} planets analyzed</div>
        </div>

        {(() => {
          const intro = engineIntros['remedy'];
          return <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />;
        })()}

        {/* Active Dasha Banner */}
        <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", fontSize: "13px" }}>
          <span style={{ color: "#7C3AED", fontWeight: 700 }}>⏰ Active Dasha:</span>
          <span style={{ color: "#1A1A1A", marginLeft: "8px", fontWeight: 600 }}>{result.dashaActive} Mahadasha</span>
          {result.antardashaActive && result.antardashaActive !== result.dashaActive && (
            <span style={{ color: "#6B635B", marginLeft: "8px" }}>→ {result.antardashaActive} Antardasha</span>
          )}
          {result.pratyantardashaActive && (
            <span style={{ color: "#6B635B", marginLeft: "8px" }}>→ {result.pratyantardashaActive} Pratyantar</span>
          )}
          <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "4px" }}>Dasha-active planets need priority attention — results are amplified now.</div>
        </div>

        {/* AUTHENTIC CORE PLANET REMEDIES, SATURN GROWTH RADAR & PROPERTY DOSSIER */}
        <div style={{ marginBottom: 24 }}>
          <CorePlanetRemediesDossier chart={chart} />
        </div>

        {/* Summary bar */}
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", fontSize: "12px", color: "#8A6008", fontWeight: 600 }}>
          {result.urgentCount} planet{result.urgentCount !== 1 ? "s" : ""} need immediate upay &nbsp;·&nbsp; {result.cards.filter(c => c.priority === "dasha-active").length} dasha-active
        </div>

        <div className="safe-plan">
          <div className="safe-plan-title">Unified Safe Remedy Protocol</div>
          {result.unifiedSafetyPlan.map((line) => (
            <div key={line} className="safe-plan-line">• {line}</div>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: 12, padding: "14px 16px", marginBottom: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#0F766E", letterSpacing: ".5px", marginBottom: 10, textTransform: "uppercase" }}>
            Personalized Remedy Plan
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {personalizedPlan.map((card) => (
              <div key={`personalized-${card.planet}`} style={{ padding: "10px 12px", borderRadius: 9, background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.18)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 5 }}>
                  <strong style={{ fontSize: 13, color: "#1A1A1A" }}>{PLANET_EMOJI[card.planet]} {card.planet}</strong>
                  <span style={{ fontSize: 11, color: "#0F766E", fontWeight: 800 }}>{card.personalizationScore}/100</span>
                </div>
                <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.55 }}>{card.whyPersonalized}</div>
                <div style={{ fontSize: 11, color: "#8A6008", marginTop: 6, fontWeight: 600 }}>Timing: {card.timing}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contradiction Warnings */}
        {activeWarnings.length > 0 && (
          <div style={{background:"rgba(220,38,38,0.05)",border:"1px solid rgba(220,38,38,0.25)",borderRadius:10,padding:"14px 16px",marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:700,color:"#DC2626",marginBottom:10,letterSpacing:"0.5px"}}>⚠️ Savdhani — Remedy Contradictions Detected</div>
            {activeWarnings.map(w => (
              <div key={w.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid rgba(220,38,38,0.1)"}}>
                <div style={{fontSize:12,color:"#DC2626",lineHeight:1.7,marginBottom:4,fontWeight:500}}>{w.rule}</div>
                <div style={{fontSize:11,color:"#C2410C",padding:"5px 8px",background:"rgba(194,65,12,0.08)",borderRadius:6,fontWeight:600}}>
                  ✓ Sahi Raah: {w.action}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
          {(["all", "urgent", "lk", "phase1"] as const).map(t => (
            <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "all" ? "All Planets" : t === "urgent" ? "Urgent / Dasha" : t === "lk" ? "Lal Kitab Upay" : "Phase 1 Timing"}
            </button>
          ))}
        </div>

        {/* Phase 1 timing engine */}
        {activeTab === "phase1" && phase1Timing && (
          <div>
            <div className="phase-card" style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.25)" }}>
              <span className="phase-pill">Complete safety filter</span>
              <div className="phase-title">Dasha Remedy Timing</div>
              <div style={{ fontSize: "13px", color: "#7C3AED", marginBottom: "8px", fontWeight: 600 }}>
                {phase1Timing.activePeriod} · Primary planet: {phase1Timing.primaryPlanet}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {phase1Timing.priorityPlanets.map((planet) => (
                  <span key={planet} className="rem-pill" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", color: "#7C3AED" }}>
                    {PLANET_EMOJI[planet]} {planet}
                  </span>
                ))}
              </div>
              <div className="phase-text">{phase1Timing.dashaNarrative}</div>
              <div style={{ display: "grid", gap: "7px", marginTop: "12px" }}>
                {phase1Timing.dashaNavtara.map((item) => {
                  const color = item.tone === "favourable" ? "#15803D" : item.tone === "challenging" ? "#DC2626" : "#B45309";
                  const label = item.donationMode === "avoid_donation"
                    ? "Do not donate"
                    : item.donationMode === "cautious_remedy"
                      ? "Validated remedy only"
                      : "Observe";
                  return (
                    <div key={`${item.level}-${item.planet}`} style={{ padding: "8px 10px", borderRadius: "8px", background: `${color}0D`, border: `1px solid ${color}35` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color }}>
                          {item.level}: {PLANET_EMOJI[item.planet]} {item.planet} · {item.tara}
                        </span>
                        <span style={{ fontSize: "11px", color, fontWeight: 600 }}>{label}</span>
                      </div>
                      <div className="phase-text" style={{ color: "#4A4238" }}>{item.reason}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="phase-card" style={{ background: "#FFFFFF", borderColor: "rgba(21,128,61,0.25)" }}>
              <div className="phase-title">Safe Practical Remedy Narrative</div>
              <div className="phase-text">{phase1Timing.safestRemedyPlan}</div>
              <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                {phase1Timing.planetRemedies.map((remedy) => (
                  <div key={`${remedy.planet}-${remedy.title}`} style={{ padding: "10px 12px", borderRadius: "8px", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.18)" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#15803D", marginBottom: "5px" }}>
                      {PLANET_EMOJI[remedy.planet]} {remedy.title}
                    </div>
                    <div className="phase-text">{remedy.whyItHelps}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="phase-card" style={{ background: "#FFFFFF", borderColor: "rgba(15,118,110,0.25)" }}>
              <div className="phase-title">Nakshatra Tree Remedy</div>
              <div style={{ fontSize: "13px", color: "#0F766E", marginBottom: "8px", fontWeight: 600 }}>
                {phase1Timing.nakshatraTree.nakshatra} · {phase1Timing.nakshatraTree.tree} · {phase1Timing.nakshatraTree.deity}
              </div>
              <div className="phase-text">{phase1Timing.nakshatraNarrative}</div>
            </div>

            <div className="phase-card" style={{ background: "rgba(220,38,38,0.04)", borderColor: "rgba(220,38,38,0.25)" }}>
              <div className="phase-title" style={{ color: "#DC2626" }}>High-Caution Boundary</div>
              <div className="phase-text" style={{ color: "#4A4238" }}>{phase1Timing.highCautionBoundary}</div>
              <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                <div className="phase-text" style={{ color: "#DC2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "7px", padding: "8px 10px", fontWeight: 500 }}>
                  {phase1Timing.navtaraSafety.consolidatedNeverDonateLine}
                </div>
                <div className="phase-text" style={{ color: "#B45309", background: "rgba(180,83,9,0.06)", border: "1px solid rgba(180,83,9,0.2)", borderRadius: "7px", padding: "8px 10px", fontWeight: 500 }}>
                  {phase1Timing.navtaraSafety.donationGuidanceLine}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                {phase1Timing.navtaraSafety.planets.map((planet) => {
                  const color = planet.tone === "favourable" ? "#15803D" : planet.tone === "challenging" ? "#DC2626" : "#B45309";
                  return (
                    <span key={`${planet.planet}-${planet.tara}`} className="rem-pill" style={{ background: `${color}14`, border: `1px solid ${color}44`, color, fontWeight: 600 }}>
                      {planet.planet}: {planet.tara}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {activeTab !== "phase1" && filtered.map(card => {
          const borderColor = PRIORITY_COLOR[card.priority];
          const isOpen = expanded === card.planet;
          return (
            <div key={card.planet} className="rem-card" style={{ borderLeft: `4px solid ${borderColor}` }}>
              {/* Collapsed header */}
              <div className="rem-card-header" onClick={() => setExpanded(isOpen ? null : card.planet)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{PLANET_EMOJI[card.planet]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}>
                      {card.planet} — H{card.house}
                      {card.retrograde && <span style={{ color: "#C2410C", marginLeft: "6px", fontSize: "11px", fontWeight: 600 }}>(R)</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B635B" }}>{card.sign} · {card.nakshatra}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: `${borderColor}18`, border: `1px solid ${borderColor}55`, borderRadius: "12px", padding: "2px 10px", fontSize: "11px", fontWeight: 700, color: borderColor }}>
                    {PRIORITY_LABEL[card.priority]}
                  </span>
                  <span style={{ color: "#6B635B", fontSize: "16px" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div className="rem-card-body" style={{ paddingTop: "14px" }}>

                  {/* Weakness tags */}
                  {card.weakReasons.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      {card.weakReasons.map(r => <span key={r} className="weak-tag">{r}</span>)}
                    </div>
                  )}

                  {/* KAT section */}
                  {card.isKATWeak && (
                    <div className="kat-box">
                      <div style={{ fontWeight: 700, marginBottom: "4px" }}>🔄 Karma Alignment Technique</div>
                      <div>Compatible houses for {card.planet}: <strong style={{ color: "#1A1A1A" }}>{card.katCompatHouses.join(", ")}</strong> — currently in H{card.house}</div>
                      <div style={{ marginTop: "5px" }}>Physical remedy: <strong style={{ color: "#1A1A1A" }}>{card.katRemedy}</strong></div>
                    </div>
                  )}

                  {/* Vedic remedies */}
                  <div className="rem-section">
                    <div className="rem-section-title" style={{ color: "#0F766E" }}>Personalized Prescription</div>
                    <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.2)", borderRadius: "7px", padding: "9px 11px", marginBottom: 8 }}>
                      <strong style={{ color: "#0F766E" }}>{card.personalizationScore}/100 relevance</strong> · {card.whyPersonalized}
                    </div>
                    <div className="rem-row"><strong>Timing:</strong> {card.timing}</div>
                    {card.recommendedActions.length > 0 && (
                      <div className="rem-row"><strong>Do:</strong> {card.recommendedActions.join(" · ")}</div>
                    )}
                    {card.avoidActions.length > 0 && (
                      <div className="rem-row"><strong>Avoid:</strong> {card.avoidActions.join(" · ")}</div>
                    )}
                  </div>

                  {/* Vedic remedies */}
                  <div className="rem-section">
                    <div className="rem-section-title" style={{ color: "#8A6008" }}>Vedic Remedies</div>
                    <div className="rem-row"><strong>🛡️ Safety:</strong> {card.safetyNote}</div>
                    <div className="rem-row"><strong>💎 Gem:</strong> {card.gem}</div>
                    <div className="rem-row"><strong>🪄 Mantra:</strong> {card.mantra}</div>
                    <div className="rem-row"><strong>💝 Donate:</strong> {card.donate}</div>
                    <div className="rem-row"><strong>📿 Practice:</strong> {card.practice}</div>
                    <div className="rem-row"><strong>🎨 Color:</strong> <span style={{ color: "#8A6008", fontWeight: 600 }}>{card.color}</span></div>
                    <div className="rem-row"><strong>📅 Day:</strong> {card.day}</div>
                  </div>

                  {/* House-specific English remedy */}
                  {card.houseRemedy && (
                    <div className="rem-section">
                      <div className="rem-section-title" style={{ color: "#1D4ED8" }}>H{card.house} Specific Guidance</div>
                      <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "7px", padding: "9px 11px" }}>
                        {card.houseRemedy}
                      </div>
                    </div>
                  )}

                  {/* Lal Kitab Amrit upays */}
                  {card.lkUpay.length > 0 && (
                    <div className="rem-section">
                      <div className="rem-section-title" style={{ color: "#DC2626" }}>🔴 Lal Kitab Amrit Upay — {card.planet} in H{card.house}</div>
                      <div style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "10px 12px" }}>
                        {card.lkUpay.map((u, i) => (
                          <div key={i} className="lk-item">{i + 1}. {u}</div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "12px 14px", background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", fontSize: "11px", color: "#6B635B", lineHeight: "1.6" }}>
          💡 Remedies are spiritual guidance tools. Results vary per individual karma and sincere practice. Consult an experienced astrologer for personalized guidance before wearing gems.
        </div>
      </div>
    </main>
  );
}
