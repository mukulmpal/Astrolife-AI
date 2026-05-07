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
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@/app/dashboard/shared.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function pct(period: DashaPeriod) {
  return period.progressPercent.toFixed(1);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ActiveCard({
  label,
  period,
  sub,
}: {
  label: string;
  period: DashaPeriod;
  sub?: string;
}) {
  const color = LORD_COLOR[period.lord];
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: color + "18", border: `1px solid ${color}55` }}
    >
      <p className="text-xs uppercase tracking-widest" style={{ color: color + "cc" }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{LORD_ICON[period.lord]}</span>
        <div>
          <p className="text-xl font-bold text-white">{period.lord}</p>
          {sub && <p className="text-xs text-white/50">{sub}</p>}
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${period.progressPercent}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/50">
        <span>{formatDashaDate(period.startDate)}</span>
        <span style={{ color }}>{formatDaysRemaining(period.daysRemaining)}</span>
        <span>{formatDashaDate(period.endDate)}</span>
      </div>
    </div>
  );
}

function TimelineRow({ period, onClick, selected }: { period: DashaPeriod; onClick: () => void; selected: boolean }) {
  const color = LORD_COLOR[period.lord];
  const now = new Date();
  const isPast = period.endDate < now;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all"
      style={{
        background: selected ? color + "22" : isPast ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${selected ? color + "66" : "rgba(255,255,255,0.08)"}`,
        opacity: isPast ? 0.5 : 1,
      }}
    >
      <span className="text-xl w-7 text-center">{LORD_ICON[period.lord]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">{period.lord} Mahadasha</span>
          {period.isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: color + "33", color }}>ACTIVE</span>
          )}
        </div>
        <p className="text-xs text-white/40 mt-0.5">
          {formatDashaDate(period.startDate)} — {formatDashaDate(period.endDate)} · {LORD_YEARS_DESC[period.lord]}
        </p>
      </div>
      {period.isActive && (
        <div className="text-right">
          <p className="text-xs font-bold" style={{ color }}>{pct(period)}%</p>
          <p className="text-[10px] text-white/40">{formatDaysRemaining(period.daysRemaining)}</p>
        </div>
      )}
    </button>
  );
}

function AntarRow({ period }: { period: DashaPeriod }) {
  const color = LORD_COLOR[period.lord];
  const now = new Date();
  const isPast = period.endDate < now;
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2"
      style={{
        background: period.isActive ? color + "18" : "transparent",
        border: `1px solid ${period.isActive ? color + "44" : "rgba(255,255,255,0.06)"}`,
        opacity: isPast ? 0.45 : 1,
      }}
    >
      <span className="text-base w-5 text-center">{LORD_ICON[period.lord]}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white/90">{period.lord}</span>
        <p className="text-[11px] text-white/40">
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
  const { chart, loading } = useUserChart();
  const [selectedMD, setSelectedMD] = useState<DashaLord | null>(null);

  const dashaTree = useMemo(() => {
    if (!chart) return null;
    return buildDashaTreeFromChart(chart);
  }, [chart]);

  const panchang = useMemo(() => calculatePanchang(new Date(), typeof chart?.tz === "number" ? chart.tz : 5.5), [chart]);

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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#05020f" }}>
        <p className="text-white/40 animate-pulse">Loading Dasha...</p>
      </main>
    );
  }

  if (!chart || !dashaTree) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#05020f" }}>
        <p className="text-white/40">Birth chart required to calculate Dasha.</p>
      </main>
    );
  }

  const { current } = dashaTree;

  return (
    <main
      className="min-h-screen text-white"
      style={{
        padding: "32px 24px 110px",
        background:
          "radial-gradient(circle at top left, rgba(14,165,233,0.12), transparent 32%), radial-gradient(circle at top right, rgba(250,204,21,0.08), transparent 30%), #05020f",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto", width: "100%" }} className="flex flex-col gap-6">

        {/* Header */}
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Vimshottari Dasha</p>
          <h1 className="text-3xl font-bold mt-1">Dasha Timeline</h1>
          <p className="text-white/50 text-sm mt-1">
            Birth Nakshatra: <span className="text-white/80 font-medium">{dashaTree.birthNakshatra.name}</span>
            {" "}Pada {dashaTree.birthNakshatra.pada} · Lord: <span className="text-white/80 font-medium">{dashaTree.birthNakshatra.lord}</span>
          </p>
        </section>

        {/* Current Active Periods */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ActiveCard
            label="Mahadasha"
            period={current.mahadasha}
            sub={LORD_YEARS_DESC[current.mahadasha.lord]}
          />
          <ActiveCard
            label={`Antardasha · ${current.mahadasha.lord} MD`}
            period={current.antardasha}
          />
          <ActiveCard
            label={`Pratyantar · ${current.antardasha.lord} AD`}
            period={current.pratyantardasha}
          />
        </section>

        {/* Navtara */}
        {navtara && (
          <section
            className="rounded-2xl p-4"
            style={{
              background: navtara.nature === "malefic" ? "rgba(239,68,68,0.08)" :
                          navtara.nature === "highly_benefic" ? "rgba(234,179,8,0.10)" :
                          "rgba(34,197,94,0.08)",
              border: `1px solid ${navtara.nature === "malefic" ? "rgba(239,68,68,0.3)" :
                                    navtara.nature === "highly_benefic" ? "rgba(234,179,8,0.4)" :
                                    "rgba(34,197,94,0.25)"}`,
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{navtara.icon}</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Today&apos;s Navtara</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {navtara.taraName} Tara #{navtara.taraNum}
                  <span className="ml-2 text-sm font-normal text-white/50">— {navtara.meaning}</span>
                </p>
                <p className="text-sm text-white/70 mt-1">{navtara.advice}</p>
                <p className="text-xs text-white/35 mt-1">
                  {navtara.janmaNakshatra} → {navtara.todayNakshatra} · Cycle {navtara.cycleNumber}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Mahadasha Timeline */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">120-Year Mahadasha Timeline</p>
          <div className="flex flex-col gap-2">
            {dashaTree.timeline.map((period, i) => (
              <TimelineRow
                key={i}
                period={period}
                selected={selectedMD === period.lord && dashaTree.timeline.indexOf(period) === dashaTree.timeline.findIndex(p => p.lord === period.lord)}
                onClick={() => setSelectedMD(prev => prev === period.lord ? null : period.lord)}
              />
            ))}
          </div>
        </section>

        {/* Antardasha for selected / current MD */}
        {selectedPeriod && (
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
              Antardashas in {selectedPeriod.md.lord} Mahadasha
            </p>
            <p className="text-xs text-white/30 mb-3">
              {formatDashaDate(selectedPeriod.md.startDate)} — {formatDashaDate(selectedPeriod.md.endDate)}
            </p>
            <div className="flex flex-col gap-1.5">
              {selectedPeriod.antardashas.map((ad, i) => (
                <AntarRow key={i} period={ad} />
              ))}
            </div>
          </section>
        )}

        {/* Pratyantardasha for current AD */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
            Pratyantardashas · {current.antardasha.lord} Antardasha
          </p>
          <p className="text-xs text-white/30 mb-3">
            {formatDashaDate(current.antardasha.startDate)} — {formatDashaDate(current.antardasha.endDate)}
          </p>
          <div className="flex flex-col gap-1.5">
            {dashaTree.pratyantardashas.map((pd, i) => (
              <AntarRow key={i} period={pd} />
            ))}
          </div>
        </section>

      </div>
      <MobileBottomNav />
    </main>
  );
}
