"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import {
  buildDashaTreeFromChart,
  getNavtara,
  getAntardashas,
  LORD_COLOR,
  LORD_ICON,
  LORD_YEARS_DESC,
  formatDashaDate,
  formatDaysRemaining,
  type DashaPeriod,
  type DashaLord,
} from "@/lib/astro-engine/dasha";
import { runKPEngine } from "@/lib/astro-engine/kp";
import { buildCurrentDashaHierarchyEvidence } from "@/lib/astro-engine/kp-dasha-evidence";
import { KPDashaEvidenceTree } from "@/components/dasha/KPDashaEvidenceTree";
import { useLanguage } from "@/lib/language-context";
import { EngineEmptyState } from "@/components/engine/engine-intro";
import { EngineGuidanceGrid, EngineHeader, EngineShell, EngineTrustPanel } from "@/components/engine/EngineShell";
import { NavtaraIntelligenceView } from "@/components/dasha/NavtaraIntelligenceView";
import {
  runNavtaraIntelligence,
  calculateTaraNumber,
  getPlanetLon,
  CLASSICAL_TARAS,
} from "@/lib/astro-engine/navtara-engine";
import { resolveNakshatraCoordinate } from "@/lib/astro-engine/ayanamsa-config";
import "@/app/dashboard/shared.css";

export interface TaraRowInfo {
  taraNum: number;
  taraName: string;
  isAfflicted: boolean;
  isJanma: boolean;
  isSupportive: boolean;
  starName: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function pct(period: DashaPeriod) {
  return period.progressPercent.toFixed(1);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ActiveCard({
  label,
  period,
  sub,
  tp,
}: {
  label: string;
  period: DashaPeriod;
  sub?: string;
  tp: (n: string) => string;
}) {
  const color = LORD_COLOR[period.lord];
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: "#FFFFFF", border: `1px solid ${color}55`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
    >
      <p className="text-xs uppercase tracking-widest font-bold" style={{ color: color }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{LORD_ICON[period.lord]}</span>
        <div>
          <p className="text-xl font-bold text-[#1A1A1A]">{tp(period.lord)}</p>
          {sub && <p className="text-xs text-[#6B635B]">{sub}</p>}
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#FAF7F2] overflow-hidden border border-amber-900/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${period.progressPercent}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#6B635B]">
        <span>{formatDashaDate(period.startDate)}</span>
        <span className="font-bold" style={{ color }}>{formatDaysRemaining(period.daysRemaining)}</span>
        <span>{formatDashaDate(period.endDate)}</span>
      </div>
    </div>
  );
}

function TimelineRow({
  period,
  onClick,
  selected,
  tp,
  taraInfo,
}: {
  period: DashaPeriod;
  onClick: () => void;
  selected: boolean;
  tp: (n: string) => string;
  taraInfo?: TaraRowInfo;
}) {
  const color = LORD_COLOR[period.lord];
  const now = new Date();
  const isPast = period.endDate < now;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all"
      style={{
        background: selected ? "rgba(184,134,11,0.12)" : "#FFFFFF",
        border: `1px solid ${selected ? color : "rgba(184,134,11,0.2)"}`,
        opacity: isPast ? 0.6 : 1,
      }}
    >
      <span className="text-xl w-7 text-center">{LORD_ICON[period.lord]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#1A1A1A] text-sm">{tp(period.lord)} Mahadasha</span>
          {period.isActive && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: color + "22", color }}
            >
              ACTIVE
            </span>
          )}
          {taraInfo && (
            <span
              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                taraInfo.isAfflicted
                  ? "bg-red-500/15 text-red-700 border border-red-500/30"
                  : taraInfo.isJanma
                  ? "bg-orange-500/15 text-orange-700 border border-orange-500/30"
                  : "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
              }`}
              title={`Lord in ${taraInfo.starName} · Tara #${taraInfo.taraNum} ${taraInfo.taraName}`}
            >
              <span>{taraInfo.isAfflicted ? "🔴" : taraInfo.isJanma ? "🟠" : "🟢"}</span>
              <span>T{taraInfo.taraNum} {taraInfo.taraName}</span>
            </span>
          )}
        </div>
        <p className="text-xs text-[#6B635B] mt-0.5">
          {formatDashaDate(period.startDate)} — {formatDashaDate(period.endDate)} · {LORD_YEARS_DESC[period.lord]}
        </p>
      </div>
      {period.isActive && (
        <div className="text-right">
          <p className="text-xs font-bold" style={{ color }}>{pct(period)}%</p>
          <p className="text-[10px] text-[#6B635B]">{formatDaysRemaining(period.daysRemaining)}</p>
        </div>
      )}
    </button>
  );
}

function AntarRow({
  period,
  tp,
  taraInfo,
}: {
  period: DashaPeriod;
  tp: (n: string) => string;
  taraInfo?: TaraRowInfo;
}) {
  const color = LORD_COLOR[period.lord];
  const now = new Date();
  const isPast = period.endDate < now;
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2"
      style={{
        background: period.isActive ? "rgba(184,134,11,0.1)" : "#FFFFFF",
        border: `1px solid ${period.isActive ? color : "rgba(184,134,11,0.15)"}`,
        opacity: isPast ? 0.55 : 1,
      }}
    >
      <span className="text-base w-5 text-center">{LORD_ICON[period.lord]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[#1A1A1A]">{tp(period.lord)}</span>
          {taraInfo && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                taraInfo.isAfflicted
                  ? "bg-red-500/15 text-red-700 border border-red-500/30"
                  : taraInfo.isJanma
                  ? "bg-orange-500/15 text-orange-700 border border-orange-500/30"
                  : "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
              }`}
              title={`Lord in ${taraInfo.starName} · Tara #${taraInfo.taraNum} ${taraInfo.taraName}`}
            >
              <span>{taraInfo.isAfflicted ? "🔴" : taraInfo.isJanma ? "🟠" : "🟢"}</span>
              <span>T{taraInfo.taraNum} {taraInfo.taraName}</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#6B635B]">
          {formatDashaDate(period.startDate)} — {formatDashaDate(period.endDate)}
        </p>
      </div>
      {period.isActive && (
        <span className="text-[10px] font-bold" style={{ color }}>
          {formatDaysRemaining(period.daysRemaining)}
        </span>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashaPage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const { t, tp } = useLanguage();
  const [selectedMD, setSelectedMD] = useState<DashaLord | null>(null);
  const [mainTab, setMainTab] = useState<"TIMELINE" | "NAVTARA">("TIMELINE");

  const dashaTree = useMemo(() => {
    if (!chart || !hasUserChart) return null;
    return buildDashaTreeFromChart(chart);
  }, [chart, hasUserChart]);

  const panchang = useMemo(
    () =>
      calculatePanchang(new Date(), typeof chart?.tz === "number" ? chart.tz : 5.5, {
        lat: chart?.lat,
        lon: chart?.lon,
      }),
    [chart]
  );

  const planetTaraMap = useMemo(() => {
    const map = new Map<string, TaraRowInfo>();
    if (!chart?.planets) return map;
    try {
      const intel = runNavtaraIntelligence(chart);
      const birthId = intel.birthNakshatra.id;
      for (const [pName, pData] of Object.entries(chart.planets)) {
        const lon = getPlanetLon(pData);
        const coord = resolveNakshatraCoordinate(lon, chart.jd, intel.selectedAyanamsa);
        const taraNum = calculateTaraNumber(birthId, coord.nakshatra.id);
        const tara = CLASSICAL_TARAS[taraNum];
        map.set(pName, {
          taraNum,
          taraName: tara.name,
          isAfflicted: [3, 5, 7].includes(taraNum),
          isJanma: taraNum === 1,
          isSupportive: [2, 4, 6, 8, 9].includes(taraNum),
          starName: coord.nakshatra.name,
        });
      }
    } catch (err) {
      console.warn("[DashaPage] Failed to build planetTaraMap:", err);
    }
    return map;
  }, [chart]);

  const navtara = useMemo(() => {
    if (!dashaTree) return null;
    return getNavtara(dashaTree.birthNakshatra.name, panchang.nakshatra);
  }, [dashaTree, panchang]);

  const selectedMDPeriod = selectedMD
    ? dashaTree?.timeline.find((period, index, timeline) =>
        period.lord === selectedMD && !timeline.slice(0, index).some((item) => item.lord === selectedMD)
      )
    : dashaTree?.current.mahadasha;
  const selectedPeriod = selectedMDPeriod ? { md: selectedMDPeriod, antardashas: getAntardashas(selectedMDPeriod) } : null;

  const dashaEvidence = useMemo(() => {
    if (!chart || !chart.dob || !chart.tob) return null;
    try {
      const kpResult = runKPEngine(chart);
      if (!kpResult?.predictiveEvidence) return null;
      return buildCurrentDashaHierarchyEvidence(chart, kpResult.predictiveEvidence);
    } catch (err) {
      console.error("[DashaPage] Failed to build Dasha hierarchy evidence:", err);
      return null;
    }
  }, [chart]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <p className="text-[#6B635B] animate-pulse">Loading Dasha...</p>
      </main>
    );
  }

  if (!chart || !dashaTree) {
    return (
      <EngineEmptyState
        engineName="Dasha Timeline"
        engineIcon="⏳"
        whatItAnalyzes={["Mahadasha", "Antardasha", "Pratyantardasha", "Birth nakshatra", "Timing context"]}
      />
    );
  }

  const { current } = dashaTree;

  return (
    <EngineShell>
      <div className="flex flex-col gap-6">
        <EngineHeader
          eyebrow="Vimshottari Timing Engine"
          title="Dasha Timeline"
          subtitle={`Birth Nakshatra: ${dashaTree.birthNakshatra.name} Pada ${dashaTree.birthNakshatra.pada} · Lord: ${dashaTree.birthNakshatra.lord}. See the active planetary periods shaping timing, decisions and life themes.`}
          confidence={{
            value: "High",
            detail: "Uses the saved birth chart and Moon nakshatra; timing is interpretive, not deterministic.",
          }}
          metrics={[
            { label: "Mahadasha", value: tp(current.mahadasha.lord), tone: "gold" },
            { label: "Antardasha", value: tp(current.antardasha.lord), tone: "blue" },
            { label: "Progress", value: `${pct(current.mahadasha)}%`, tone: "green" },
          ]}
        />

        <EngineTrustPanel
          confidence="High"
          dataUsed={["Saved birth chart", "Moon nakshatra", "Vimshottari sequence", "Current date", "Daily Panchang"]}
          caveat="Dasha shows which planetary period is active. It should be fused with chart promise, transits, KP validation and real-life readiness before making major decisions."
        />

        <EngineGuidanceGrid
          items={[
            {
              label: "Use This For",
              title: "Timing Themes",
              body: "Understand which life themes are active now and which planet is carrying the current chapter.",
              tone: "green",
            },
            {
              label: "Do Not Use For",
              title: "Fixed Fate Claims",
              body: "A dasha period is not a guaranteed event. It is a timing layer that needs validation from other engines.",
              tone: "red",
            },
            {
              label: "Best Pairing",
              title: "Transit + KP",
              body: "Use Transits for current activation and KP for event validation when a specific question matters.",
              tone: "blue",
            },
          ]}
        />

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-amber-900/15 pb-1">
          <button
            onClick={() => setMainTab("TIMELINE")}
            className={`pb-2.5 px-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              mainTab === "TIMELINE"
                ? "text-[#B8860B] border-b-2 border-[#B8860B]"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            <span>⏳ Vimshottari & KP Timeline</span>
          </button>
          <button
            onClick={() => setMainTab("NAVTARA")}
            className={`pb-2.5 px-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              mainTab === "NAVTARA"
                ? "text-[#B8860B] border-b-2 border-[#B8860B]"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            <span>✦ Navtara Intelligence</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-[#B8860B] font-extrabold uppercase">
              Master Engine
            </span>
          </button>
        </div>

        {mainTab === "TIMELINE" && (
          <>
            {/* Current Active Periods */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ActiveCard
                label={t("dasha.mahadasha")}
                period={current.mahadasha}
                sub={LORD_YEARS_DESC[current.mahadasha.lord]}
                tp={tp}
              />
              <ActiveCard
                label={`${t("dasha.antardasha")} · ${tp(current.mahadasha.lord)} MD`}
                period={current.antardasha}
                tp={tp}
              />
              <ActiveCard
                label={`Pratyantar · ${tp(current.antardasha.lord)} AD`}
                period={current.pratyantardasha}
                tp={tp}
              />
            </section>

            {/* Navtara */}
            {navtara && (
              <section
                className="rounded-2xl p-4"
                style={{
                  background: navtara.nature === "malefic" ? "rgba(239,68,68,0.08)" :
                              navtara.nature === "highly_benefic" ? "rgba(234,179,8,0.12)" :
                              "rgba(34,197,94,0.08)",
                  border: `1px solid ${navtara.nature === "malefic" ? "rgba(239,68,68,0.3)" :
                                        navtara.nature === "highly_benefic" ? "rgba(234,179,8,0.4)" :
                                        "rgba(34,197,94,0.25)"}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{navtara.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#6B635B] font-bold">Today&apos;s Navtara</p>
                    <p className="text-lg font-bold text-[#1A1A1A] mt-0.5">
                      {navtara.taraName} Tara #{navtara.taraNum}
                      <span className="ml-2 text-sm font-normal text-[#6B635B]">— {navtara.meaning}</span>
                    </p>
                    <p className="text-sm text-[#1A1A1A] mt-1">{navtara.advice}</p>
                    <p className="text-xs text-[#6B635B] mt-1">
                      {navtara.janmaNakshatra} → {navtara.todayNakshatra} · Cycle {navtara.cycleNumber}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* KP Dasha House Signification & Event Unlocking Tree */}
            {dashaEvidence && (
              <section>
                <KPDashaEvidenceTree evidence={dashaEvidence} tp={tp} />
              </section>
            )}

            {/* Mahadasha Timeline */}
            <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">120-Year Mahadasha Timeline</p>
                <div className="flex items-center gap-2 text-[10px] text-[#6B635B] font-medium flex-wrap">
                  <span className="flex items-center gap-1">🟢 Supportive (2,4,6,8,9)</span>
                  <span className="flex items-center gap-1">🟠 Janma (1)</span>
                  <span className="flex items-center gap-1">🔴 Caution (3,5,7)</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {dashaTree.timeline.map((period, i) => (
                  <TimelineRow
                    key={i}
                    period={period}
                    selected={selectedMD === period.lord && dashaTree.timeline.indexOf(period) === dashaTree.timeline.findIndex(p => p.lord === period.lord)}
                    onClick={() => setSelectedMD(prev => prev === period.lord ? null : period.lord)}
                    tp={tp}
                    taraInfo={planetTaraMap.get(period.lord)}
                  />
                ))}
              </div>
            </section>

            {/* Antardasha for selected / current MD */}
            {selectedPeriod && (
              <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Antardashas in {tp(selectedPeriod.md.lord)} Mahadasha
                  </p>
                  {planetTaraMap.get(selectedPeriod.md.lord) && (
                    <span className="text-[10px] font-bold text-[#6B635B]">
                      MD Lord in {planetTaraMap.get(selectedPeriod.md.lord)?.starName} (T{planetTaraMap.get(selectedPeriod.md.lord)?.taraNum} {planetTaraMap.get(selectedPeriod.md.lord)?.taraName})
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B635B] mb-3">
                  {formatDashaDate(selectedPeriod.md.startDate)} — {formatDashaDate(selectedPeriod.md.endDate)}
                </p>
                <div className="flex flex-col gap-1.5">
                  {selectedPeriod.antardashas.map((ad, i) => (
                    <AntarRow
                      key={i}
                      period={ad}
                      tp={tp}
                      taraInfo={planetTaraMap.get(ad.lord)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Pratyantardasha for current AD */}
            <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">
                Pratyantardashas · {tp(current.antardasha.lord)} {t("dasha.antardasha")}
              </p>
              <p className="text-xs text-[#6B635B] mb-3">
                {formatDashaDate(current.antardasha.startDate)} — {formatDashaDate(current.antardasha.endDate)}
              </p>
              <div className="flex flex-col gap-1.5">
                {dashaTree.pratyantardashas.map((pd, i) => (
                  <AntarRow key={i} period={pd} tp={tp} />
                ))}
              </div>
            </section>
          </>
        )}

        {mainTab === "NAVTARA" && (
          <NavtaraIntelligenceView
            chart={chart}
            activeMD={current.mahadasha.lord}
            activeAD={current.antardasha.lord}
            tp={tp}
          />
        )}

      </div>
    </EngineShell>
  );
}
