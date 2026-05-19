"use client";
import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculateRemedies, type RemedyCard } from "@/lib/astro-engine/remedy";
import { REMEDY_CONTRADICTION_RULES } from "@/lib/astro-engine/lalkitab-knowledge";
import {
  analyzePhase1Remedies,
  isPlanet,
  type Planet,
} from "@/lib/astro-intelligence/phase-1-remedies/complete-remedy-intelligence-engine";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";

const PRIORITY_COLOR: Record<RemedyCard["priority"], string> = {
  "dasha-active": "#8b5cf6",
  "urgent":       "#ef4444",
  "recommended":  "#f59e0b",
  "optional":     "#22c55e",
};
const PRIORITY_LABEL: Record<RemedyCard["priority"], string> = {
  "dasha-active": "⏰ Active Dasha",
  "urgent":       "⚠️ Urgent",
  "recommended":  "✦ Recommended",
  "optional":     "✓ Optional",
};
const PLANET_EMOJI: Record<string, string> = {
  Sun:"☀️", Moon:"🌙", Mars:"♂️", Mercury:"☿", Jupiter:"♃", Venus:"♀️", Saturn:"♄", Rahu:"☊", Ketu:"☋"
};

export default function RemedyPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateRemedies(chart) : null), [chart]);
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
      Object.entries(chart.planets)
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
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <EngineStateCard title="💊 Remedy Engine" loading={loading} loadingText="Calculating remedies..." emptyText="Complete onboarding to view remedies." />
        <MobileBottomNav />
      </main>
    );
  }

  const filtered = result.cards.filter(c => {
    if (activeTab === "urgent") return c.priority === "urgent" || c.priority === "dasha-active";
    if (activeTab === "lk") return c.lkUpay.length > 0;
    if (activeTab === "phase1") return false;
    return true;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "24px 18px 110px", color: "#f0e8d0" }}>
      <style>{`
        .rem-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 14px; margin-bottom: 12px; overflow: hidden; }
        .rem-card-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
        .rem-card-body { padding: 0 16px 16px; border-top: 1px solid #1c1840; }
        .rem-pill { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-right: 6px; margin-bottom: 4px; }
        .rem-section { margin-bottom: 14px; }
        .rem-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; opacity: 0.7; }
        .rem-row { font-size: 12px; color: #b8b0d8; margin-bottom: 6px; line-height: 1.55; display: flex; gap: 8px; }
        .rem-row strong { color: #f0e8d0; min-width: 70px; flex-shrink: 0; }
        .lk-item { font-size: 12px; color: #d4b896; line-height: 1.6; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .kat-box { background: rgba(20,184,166,0.07); border: 1px solid rgba(20,184,166,0.2); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; font-size: 12px; color: #5eead4; line-height: 1.6; }
        .tab-btn { padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #1c1840; cursor: pointer; transition: all 0.15s; }
        .tab-btn.active { background: rgba(200,160,48,0.15); border-color: rgba(200,160,48,0.4); color: #c8a030; }
        .tab-btn:not(.active) { background: transparent; color: #8880a8; }
        .weak-tag { display: inline-block; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 4px; padding: 2px 7px; font-size: 10px; color: #fca5a5; margin-right: 4px; }
        .phase-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
        .phase-title { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 700; color: #f0e8d0; margin-bottom: 8px; }
        .phase-text { font-size: 12px; color: #b8b0d8; line-height: 1.75; white-space: pre-line; }
        .phase-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid rgba(34,197,94,0.3); background: rgba(34,197,94,0.08); color: #86efac; margin-bottom: 8px; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700 }}>💊 Remedy Engine</div>
          <div style={{ fontSize: "13px", color: "#8880a8", marginTop: "4px" }}>Vedic Upay · Lal Kitab Amrit · Karma Alignment · {result.cards.length} planets analyzed</div>
        </div>

        {/* Active Dasha Banner */}
        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", fontSize: "13px" }}>
          <span style={{ color: "#c4b5fd", fontWeight: 600 }}>⏰ Active Dasha:</span>
          <span style={{ color: "#f0e8d0", marginLeft: "8px" }}>{result.dashaActive} Mahadasha</span>
          {result.antardashaActive && result.antardashaActive !== result.dashaActive && (
            <span style={{ color: "#8880a8", marginLeft: "8px" }}>→ {result.antardashaActive} Antardasha</span>
          )}
          {result.pratyantardashaActive && (
            <span style={{ color: "#8880a8", marginLeft: "8px" }}>→ {result.pratyantardashaActive} Pratyantar</span>
          )}
          <div style={{ fontSize: "11px", color: "#8880a8", marginTop: "4px" }}>Dasha-active planets need priority attention — results are amplified now.</div>
        </div>

        {/* Summary bar */}
        <div style={{ background: "rgba(200,160,48,0.08)", border: "1px solid rgba(200,160,48,0.2)", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", fontSize: "12px", color: "#c8a030" }}>
          {result.urgentCount} planet{result.urgentCount !== 1 ? "s" : ""} need immediate upay &nbsp;·&nbsp; {result.cards.filter(c => c.priority === "dasha-active").length} dasha-active
        </div>

        {/* Contradiction Warnings */}
        {activeWarnings.length > 0 && (
          <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"14px 16px",marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:10,letterSpacing:"0.5px"}}>⚠️ Savdhani — Remedy Contradictions Detected</div>
            {activeWarnings.map(w => (
              <div key={w.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid rgba(239,68,68,0.1)"}}>
                <div style={{fontSize:12,color:"#fca5a5",lineHeight:1.7,marginBottom:4}}>{w.rule}</div>
                <div style={{fontSize:11,color:"#f97316",padding:"5px 8px",background:"rgba(249,115,22,0.05)",borderRadius:6}}>
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
            <div className="phase-card" style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.25)" }}>
              <span className="phase-pill">Complete safety filter</span>
              <div className="phase-title">Dasha Remedy Timing</div>
              <div style={{ fontSize: "13px", color: "#c4b5fd", marginBottom: "8px" }}>
                {phase1Timing.activePeriod} · Primary planet: {phase1Timing.primaryPlanet}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {phase1Timing.priorityPlanets.map((planet) => (
                  <span key={planet} className="rem-pill" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.28)", color: "#c4b5fd" }}>
                    {PLANET_EMOJI[planet]} {planet}
                  </span>
                ))}
              </div>
              <div className="phase-text">{phase1Timing.dashaNarrative}</div>
              <div style={{ display: "grid", gap: "7px", marginTop: "12px" }}>
                {phase1Timing.dashaNavtara.map((item) => {
                  const color = item.tone === "favourable" ? "#22c55e" : item.tone === "challenging" ? "#ef4444" : "#f59e0b";
                  const label = item.donationMode === "avoid_donation"
                    ? "Do not donate"
                    : item.donationMode === "cautious_remedy"
                      ? "Validated remedy only"
                      : "Observe";
                  return (
                    <div key={`${item.level}-${item.planet}`} style={{ padding: "8px 10px", borderRadius: "8px", background: `${color}10`, border: `1px solid ${color}30` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color }}>
                          {item.level}: {PLANET_EMOJI[item.planet]} {item.planet} · {item.tara}
                        </span>
                        <span style={{ fontSize: "11px", color }}>{label}</span>
                      </div>
                      <div className="phase-text" style={{ color: "#b8b0d8" }}>{item.reason}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="phase-card" style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.18)" }}>
              <div className="phase-title">Safe Practical Remedy Narrative</div>
              <div className="phase-text">{phase1Timing.safestRemedyPlan}</div>
              <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                {phase1Timing.planetRemedies.map((remedy) => (
                  <div key={`${remedy.planet}-${remedy.title}`} style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#86efac", marginBottom: "5px" }}>
                      {PLANET_EMOJI[remedy.planet]} {remedy.title}
                    </div>
                    <div className="phase-text">{remedy.whyItHelps}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="phase-card" style={{ background: "rgba(20,184,166,0.05)", borderColor: "rgba(20,184,166,0.18)" }}>
              <div className="phase-title">Nakshatra Tree Remedy</div>
              <div style={{ fontSize: "13px", color: "#5eead4", marginBottom: "8px" }}>
                {phase1Timing.nakshatraTree.nakshatra} · {phase1Timing.nakshatraTree.tree} · {phase1Timing.nakshatraTree.deity}
              </div>
              <div className="phase-text">{phase1Timing.nakshatraNarrative}</div>
            </div>

            <div className="phase-card" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
              <div className="phase-title" style={{ color: "#fca5a5" }}>High-Caution Boundary</div>
              <div className="phase-text" style={{ color: "#fca5a5" }}>{phase1Timing.highCautionBoundary}</div>
              <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                <div className="phase-text" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.16)", borderRadius: "7px", padding: "8px 10px" }}>
                  {phase1Timing.navtaraSafety.consolidatedNeverDonateLine}
                </div>
                <div className="phase-text" style={{ color: "#fcd34d", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.16)", borderRadius: "7px", padding: "8px 10px" }}>
                  {phase1Timing.navtaraSafety.donationGuidanceLine}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                {phase1Timing.navtaraSafety.planets.map((planet) => {
                  const color = planet.tone === "favourable" ? "#22c55e" : planet.tone === "challenging" ? "#ef4444" : "#f59e0b";
                  return (
                    <span key={`${planet.planet}-${planet.tara}`} className="rem-pill" style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}>
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
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                      {card.planet} — H{card.house}
                      {card.retrograde && <span style={{ color: "#f97316", marginLeft: "6px", fontSize: "11px" }}>℞</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#8880a8" }}>{card.sign} · {card.nakshatra}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: `${borderColor}22`, border: `1px solid ${borderColor}55`, borderRadius: "12px", padding: "2px 10px", fontSize: "11px", fontWeight: 700, color: borderColor }}>
                    {PRIORITY_LABEL[card.priority]}
                  </span>
                  <span style={{ color: "#8880a8", fontSize: "16px" }}>{isOpen ? "▲" : "▼"}</span>
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
                      <div>Compatible houses for {card.planet}: <strong style={{ color: "#f0e8d0" }}>{card.katCompatHouses.join(", ")}</strong> — currently in H{card.house}</div>
                      <div style={{ marginTop: "5px" }}>Physical remedy: <strong style={{ color: "#f0e8d0" }}>{card.katRemedy}</strong></div>
                    </div>
                  )}

                  {/* Vedic remedies */}
                  <div className="rem-section">
                    <div className="rem-section-title" style={{ color: "#c8a030" }}>Vedic Remedies</div>
                    <div className="rem-row"><strong>💎 Gem:</strong> {card.gem}</div>
                    <div className="rem-row"><strong>🪄 Mantra:</strong> {card.mantra}</div>
                    <div className="rem-row"><strong>💝 Donate:</strong> {card.donate}</div>
                    <div className="rem-row"><strong>📿 Practice:</strong> {card.practice}</div>
                    <div className="rem-row"><strong>🎨 Color:</strong> <span style={{ color: "#c8a030" }}>{card.color}</span></div>
                    <div className="rem-row"><strong>📅 Day:</strong> {card.day}</div>
                  </div>

                  {/* House-specific English remedy */}
                  {card.houseRemedy && (
                    <div className="rem-section">
                      <div className="rem-section-title" style={{ color: "#60a5fa" }}>H{card.house} Specific Guidance</div>
                      <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.65", background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "7px", padding: "9px 11px" }}>
                        {card.houseRemedy}
                      </div>
                    </div>
                  )}

                  {/* Lal Kitab Amrit upays */}
                  {card.lkUpay.length > 0 && (
                    <div className="rem-section">
                      <div className="rem-section-title" style={{ color: "#ef4444" }}>🔴 Lal Kitab Amrit Upay — {card.planet} in H{card.house}</div>
                      <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "10px 12px" }}>
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
        <div style={{ marginTop: "24px", padding: "12px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px", fontSize: "11px", color: "#8880a8", lineHeight: "1.6" }}>
          💡 Remedies are spiritual guidance tools. Results vary per individual karma and sincere practice. Consult an experienced astrologer for personalized guidance before wearing gems.
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
