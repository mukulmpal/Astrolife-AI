"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  calculateSpecialLagnas,
  RASHI_ICONS,
  type SpecialLagnaItem,
  type InduLagnaAnalysis,
  type AlUlSynastry,
  type SpecialLagnaRajayoga,
  type ActiveDashaActivation,
} from "@/lib/astro-engine/special-lagnas";
import "@/app/dashboard/shared.css";

// ── Generic Special Lagna Card ────────────────────────────────────────────────
function LagnaCard({ item, highlight }: { item: SpecialLagnaItem; highlight?: boolean }) {
  const icon = RASHI_ICONS[item.signNum] ?? "✨";

  return (
    <article
      className="rounded-2xl p-5 flex flex-col justify-between transition-all"
      style={{
        background: highlight ? "rgba(184, 134, 11, 0.06)" : "#FFFFFF",
        border: `1px solid ${highlight ? "rgba(184, 134, 11, 0.45)" : "rgba(184, 134, 11, 0.2)"}`,
        boxShadow: "0 2px 14px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                {item.shortName}
              </span>
              {item.sourceHouse && (
                <span className="text-[10px] text-[#8C827A] font-semibold">
                  Source: House {item.sourceHouse}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mt-1 font-serif">
              {item.name}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl block">{icon}</span>
            <span className="text-xs font-bold text-[#B8860B]">{item.sign}</span>
          </div>
        </div>

        {/* Metadata pills */}
        <div className="flex flex-wrap gap-1.5 my-2.5">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)]">
            House {item.house}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)]">
            {item.degreeText}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)]">
            Lord: {item.lord}
          </span>
          {item.lordHouse && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Lord in H{item.lordHouse}
            </span>
          )}
        </div>

        {/* Meaning & Core Law */}
        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] mb-3">
          <p className="text-xs font-bold text-[#1A1A1A] leading-snug">
            {item.meaning}
          </p>
        </div>

        <p className="text-xs text-[#6B635B] leading-relaxed">
          {item.interpretation}
        </p>

        {/* Occupants & Aspects */}
        {(item.occupants?.length || item.aspectingPlanets?.length) ? (
          <div className="mt-3 pt-2.5 border-t border-[rgba(184,134,11,0.12)] flex flex-wrap gap-2 text-[11px]">
            {item.occupants && item.occupants.length > 0 && (
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                Occupied by: <strong>{item.occupants.join(", ")}</strong>
              </span>
            )}
            {item.aspectingPlanets && item.aspectingPlanets.length > 0 && (
              <span className="text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded font-medium border border-indigo-200">
                Aspected by: {item.aspectingPlanets.join(", ")}
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Action Plan */}
      <div className="mt-4 pt-3 border-t border-[rgba(184,134,11,0.15)]">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A] mb-1.5">
          Activation Strategy
        </p>
        <ul className="space-y-1">
          {item.actionPlan.map((action, idx) => (
            <li key={idx} className="text-xs text-[#4A4238] flex items-start gap-1.5 leading-relaxed">
              <span className="text-[#B8860B] shrink-0 font-bold">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// ── Master Component ──────────────────────────────────────────────────────────
export default function SpecialLagnasPage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const [activeTab, setActiveTab] = useState<"wealth" | "power" | "arudha" | "rajayoga">("wealth");

  const result = useMemo(() => (chart && hasUserChart ? calculateSpecialLagnas(chart) : null), [chart, hasUserChart]);

  if (loading || !result) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] p-6 lg:p-10 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B]">
            Classical Jaimini &amp; Parashara Engine
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">
            Computing Special Lagnas...
          </h1>
          <p className="text-sm text-[#6B635B] leading-relaxed">
            Synchronizing Indu Lagna wealth rays, 12 Arudha Padas, Hora-Ghati axis, and Dasha activations.
          </p>
          <div className="w-16 h-1 bg-[#B8860B] mx-auto rounded-full animate-pulse" />
        </div>
      </main>
    );
  }

  const { induLagna, alUlSynastry, rajayogas, activeDashaActivation } = result;

  const tabs = [
    { key: "wealth", label: "💰 Dhana & Lakshmi Lagnas", count: "Indu · HL · SL · PL" },
    { key: "power", label: "👑 Power & Authority Lagnas", count: "GL · BL · BPHS Dhana Raja" },
    { key: "arudha", label: "🏛️ 12 Arudha Padas Matrix", count: "A1 to A12 · AL-UL Synastry" },
    { key: "rajayoga", label: "⚡ Rajayogas & Dasha Radar", count: "Active Activations · Upay" },
  ] as const;

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] pb-24">
      {/* ── Top Hero Banner ─────────────────────────────────────────────────── */}
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] px-4 py-8 lg:px-10 lg:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B8860B] px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#B8860B]/30">
                Classical Special Lagnas · विशेष लग्न
              </span>
              <span className="text-xs text-[#8C827A] font-medium hidden sm:inline">
                Varahamihira Brihat Jataka &amp; BPHS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1A1A1A] tracking-tight">
              Special Lagnas &amp; Wealth Rays
            </h1>
            <p className="text-sm text-[#6B635B] max-w-2xl mt-2 leading-relaxed">
              Auxiliary reference frames revealing hidden wealth reservoirs (<strong>Indu Lagna</strong>), public career fame (<strong>Arudha Lagna</strong>), governmental power (<strong>Ghati Lagna</strong>), and marital reality (<strong>Upapada Lagna</strong>).
            </p>
          </div>

          {/* Quick Sunrise Reference */}
          <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-4 flex items-center gap-4 shrink-0 shadow-sm">
            <span className="text-3xl">🌅</span>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A]">
                Sunrise Astronomical Base
              </p>
              <p className="text-base font-bold text-[#1A1A1A]">
                {result.sunriseLocal} <span className="text-xs font-normal text-[#6B635B]">Local Time</span>
              </p>
              <p className="text-[11px] text-[#B8860B]">
                Sun at Sunrise: {result.sunAtSunrise.toFixed(1)}° · +{Math.round(result.minutesSinceSunrise)}m after sunrise
              </p>
            </div>
          </div>
        </div>

        {/* ── Executive 4 Pillars Overview Grid ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Pillar 1: Indu Lagna Kuber Score */}
          <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-4.5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#B8860B]">
                  🪙 Indu Lagna (इंदु लग्न)
                </span>
                <span className="text-xl">{RASHI_ICONS[induLagna.signNum]}</span>
              </div>
              <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">
                {induLagna.sign} <span className="text-xs font-medium text-[#6B635B]">(H{induLagna.house})</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[#6B635B]">Kuber Wealth Score:</span>
                <span className="font-extrabold text-[#B8860B]">{induLagna.kuberYogaScore}/100</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E8E2D8] mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#996515]"
                  style={{ width: `${induLagna.kuberYogaScore}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#4A4238] font-medium mt-3 line-clamp-2">
              {induLagna.kuberYogaTier}
            </p>
          </div>

          {/* Pillar 2: Hora & Ghati Power Axis */}
          <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-4.5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#B8860B]">
                  👑 Power Axis (HL &amp; GL)
                </span>
                <span className="text-xl">⚖️</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] text-center">
                  <span className="text-[10px] text-[#8C827A] font-bold block">HL (Wealth)</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.horaLagna.sign}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] text-center">
                  <span className="text-[10px] text-[#8C827A] font-bold block">GL (Power)</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.ghatiLagna.sign}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#4A4238] font-medium mt-3">
              {rajayogas.some((y) => y.name.includes("Hora-Ghati") && y.isFormed) ? (
                <span className="text-emerald-700 font-bold">✨ BPHS Hora-Ghati Dhana-Raja Yoga Active</span>
              ) : (
                <span className="text-[#6B635B]">Independent Wealth &amp; Authority Spheres</span>
              )}
            </p>
          </div>

          {/* Pillar 3: AL-UL Marital Synastry */}
          <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-4.5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#B8860B]">
                  🎭 Persona vs Reality (AL-UL)
                </span>
                <span className="text-xl">💍</span>
              </div>
              <p className="text-base font-serif font-bold text-[#1A1A1A] mt-1">
                AL: {alUlSynastry.alSign} ↔ UL: {alUlSynastry.ulSign}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[#6B635B]">Harmony Axis:</span>
                <span className="font-bold text-[#1A1A1A]">Distance: {alUlSynastry.distance}</span>
              </div>
            </div>
            <div className="mt-3">
              {alUlSynastry.distance === 6 || alUlSynastry.distance === 8 ? (
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300 block text-center">
                  ⚠️ 6/8 Shadashtaka Friction
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 block text-center">
                  ✨ {alUlSynastry.relationship.split("(")[0]}
                </span>
              )}
            </div>
          </div>

          {/* Pillar 4: Sree & Paka Lagnas */}
          <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-4.5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#B8860B]">
                  🌸 Sree &amp; Paka Lagnas
                </span>
                <span className="text-xl">🌺</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] text-center">
                  <span className="text-[10px] text-[#8C827A] font-bold block">Sree (Lakshmi)</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.sreeLagna.sign}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] text-center">
                  <span className="text-[10px] text-[#8C827A] font-bold block">Paka (Will)</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.pakaLagna.sign}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#6B635B] font-medium mt-3">
              Seat of Divine Grace &amp; Conscious Intellect
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-10 mt-8 space-y-8">
        {/* Tab Controls */}
        <div className="flex gap-2.5 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, #B8860B, #996515)"
                    : "#FFFFFF",
                border: `1px solid ${
                  activeTab === tab.key ? "#B8860B" : "rgba(184, 134, 11, 0.22)"
                }`,
                color: activeTab === tab.key ? "#FFFFFF" : "#6B635B",
                boxShadow:
                  activeTab === tab.key ? "0 2px 10px rgba(184, 134, 11, 0.25)" : "none",
              }}
            >
              <div>{tab.label}</div>
              <div
                className="text-[10px] font-normal opacity-85 mt-0.5"
                style={{ color: activeTab === tab.key ? "#FFFDF9" : "#8C827A" }}
              >
                {tab.count}
              </div>
            </button>
          ))}
        </div>

        {/* ── TAB 1: Dhana & Lakshmi Lagnas ─────────────────────────────────── */}
        {activeTab === "wealth" && (
          <div className="space-y-8">
            {/* Indu Lagna Deep Dive Spotlight */}
            <section
              className="rounded-3xl p-6 lg:p-8"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)",
                border: "1px solid rgba(184, 134, 11, 0.35)",
                boxShadow: "0 4px 24px rgba(184, 134, 11, 0.08)",
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[rgba(184,134,11,0.18)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B8860B] px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#B8860B]/30">
                      Varahamihira Brihat Jataka Secret
                    </span>
                    <span className="text-xs text-[#8C827A] font-semibold">
                      Chapter on Dhana Yogas
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1.5">
                    Indu Lagna (इंदु लग्न) · The Moon-Wealth Vortex
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B635B] mt-1 max-w-2xl leading-relaxed">
                    While the 2nd house shows family savings and the 11th shows profits, Indu Lagna computes the cosmic rays (Kalas) allocated to your soul to manifest multi-generational wealth and liquid treasure.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#8C827A] block">
                    Kuber Yoga Status
                  </span>
                  <span className="inline-block mt-1 text-sm font-extrabold px-3 py-1 rounded-full bg-[#B8860B] text-white">
                    {induLagna.kuberYogaTier}
                  </span>
                </div>
              </div>

              {/* Mathematical Equation Ribbon */}
              <div className="my-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)]">
                <p className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B] mb-2">
                  Classical Ray Calculation Breakdown
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[rgba(184,134,11,0.15)]">
                    <span className="text-[#8C827A] block">Lagna 9th Lord:</span>
                    <strong className="text-sm text-[#1A1A1A]">{induLagna.lagna9thLord}</strong>
                    <span className="text-xs text-[#B8860B] font-bold block mt-0.5">
                      {induLagna.lagna9thRays} Rays
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[rgba(184,134,11,0.15)]">
                    <span className="text-[#8C827A] block">Moon 9th Lord:</span>
                    <strong className="text-sm text-[#1A1A1A]">{induLagna.moon9thLord}</strong>
                    <span className="text-xs text-[#B8860B] font-bold block mt-0.5">
                      {induLagna.moon9thRays} Rays
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[rgba(184,134,11,0.15)]">
                    <span className="text-[#8C827A] block">Total Rays &amp; Remainder:</span>
                    <strong className="text-sm text-[#1A1A1A]">
                      {induLagna.totalRays} mod 12 = {induLagna.remainder}
                    </strong>
                    <span className="text-xs text-[#6B635B] block mt-0.5">
                      Count {induLagna.remainder} from Moon
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[rgba(184,134,11,0.15)]">
                    <span className="text-[#8C827A] block">Indu Lagna Sign:</span>
                    <strong className="text-sm text-[#B8860B]">
                      {induLagna.sign} (House {induLagna.house})
                    </strong>
                    <span className="text-xs text-[#4A4238] block mt-0.5">
                      Lord: {induLagna.lord}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verdict & Influences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B] mb-2">
                    Cosmic Wealth Verdict
                  </h4>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed">
                    {induLagna.verdict}
                  </p>
                  <p className="text-xs text-[#8C827A] mt-3 italic">
                    {induLagna.classicalReference}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)] flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B] mb-2">
                      Planetary Aspects &amp; Occupants
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-[#6B635B]">Occupants in {induLagna.sign}:</span>
                        <strong className="text-[#1A1A1A]">
                          {induLagna.occupants.length > 0 ? induLagna.occupants.join(", ") : "None (Vacant)"}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-[#6B635B]">Planets Aspecting:</span>
                        <strong className="text-[#1A1A1A]">
                          {induLagna.aspectingPlanets.length > 0 ? induLagna.aspectingPlanets.join(", ") : "None"}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#6B635B]">Sign Lord Status:</span>
                        <strong className="text-[#1A1A1A]">
                          {induLagna.lord}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950">
                    <strong>Sage Principle:</strong> Benefics (Jupiter, Venus, Mercury, Moon) in or aspecting Indu Lagna yield boundless multi-generational wealth. Malefics yield self-earned wealth with disciplined expenditure.
                  </div>
                </div>
              </div>

              {/* Classical Upay */}
              <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#B8860B]/25">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B] mb-2">
                  Indu Lagna Remedial Directives
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {induLagna.upay.map((u, i) => (
                    <div key={i} className="text-xs text-[#4A4238] bg-white p-3 rounded-xl border border-[rgba(184,134,11,0.15)] leading-relaxed">
                      <span className="text-[#B8860B] font-bold block mb-1">Upay #{i + 1}</span>
                      {u}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Other Wealth Lagnas Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                  Pillars of Affluence &amp; Intelligence
                </h3>
                <span className="text-xs text-[#8C827A]">Hora · Sree · Paka Lagnas</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LagnaCard item={result.horaLagna} highlight />
                <LagnaCard item={result.sreeLagna} highlight />
                <LagnaCard item={result.pakaLagna} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Power & Authority Lagnas ───────────────────────────────── */}
        {activeTab === "power" && (
          <div className="space-y-8">
            {/* Hora-Ghati Dhana Raja Yoga Feature */}
            <section
              className="rounded-3xl p-6 lg:p-8"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
                border: "1px solid rgba(184, 134, 11, 0.3)",
                boxShadow: "0 2px 16px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B8860B] px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#B8860B]/30">
                  Brihat Parashara Hora Shastra (BPHS Ch. 5)
                </span>
                <span className="text-xs text-[#8C827A] font-semibold">Special Lagna Raja Yoga</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                Hora Lagna &amp; Ghati Lagna Axis (होरा-घटी धन-राजयोग)
              </h2>
              <p className="text-sm text-[#6B635B] mt-1 max-w-3xl leading-relaxed">
                Sage Parashara states that when <strong>Hora Lagna (treasury)</strong> and <strong>Ghati Lagna (authority)</strong> conjoin, aspect each other, or are simultaneously aspected by the birth Lagna, the native commands both limitless liquid wealth and royal or governmental power.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold text-[#B8860B]">
                      Hora Lagna (HL)
                    </span>
                    <span className="text-xl">{RASHI_ICONS[result.horaLagna.signNum]}</span>
                  </div>
                  <p className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                    {result.horaLagna.sign} <span className="text-xs font-normal text-[#6B635B]">(House {result.horaLagna.house})</span>
                  </p>
                  <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                    Calculated at 0.5° per minute (1 rashi per 2.5 hours) from sunrise Sun. Governs money instinct, business transactions, and cash inflow speed.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold text-[#B8860B]">
                      Ghati Lagna (GL)
                    </span>
                    <span className="text-xl">{RASHI_ICONS[result.ghatiLagna.signNum]}</span>
                  </div>
                  <p className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                    {result.ghatiLagna.sign} <span className="text-xs font-normal text-[#6B635B]">(House {result.ghatiLagna.house})</span>
                  </p>
                  <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                    Calculated at 1.25° per minute (1 rashi per 1 ghati / 24 minutes). Governs political stature, promotions, royal recognition, and societal authority.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              {(() => {
                const hlGlYoga = rajayogas.find((y) => y.name.includes("Hora-Ghati"));
                const isFormed = hlGlYoga?.isFormed;
                return (
                  <div
                    className="p-4 rounded-2xl text-xs leading-relaxed"
                    style={{
                      background: isFormed ? "rgba(16, 185, 129, 0.08)" : "rgba(184, 134, 11, 0.06)",
                      border: `1px solid ${isFormed ? "rgba(16, 185, 129, 0.4)" : "rgba(184, 134, 11, 0.25)"}`,
                      color: isFormed ? "#065F46" : "#4A4238",
                    }}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <span>{isFormed ? "👑 SUPREME DHANA-RAJA YOGA FORMED" : "⚖️ DUAL FOCUSED DEVELOPMENT"}</span>
                    </div>
                    {hlGlYoga?.description}
                  </div>
                );
              })()}
            </section>

            {/* Sunrise Lagnas Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                  Sunrise Temporal Reference Lagnas
                </h3>
                <span className="text-xs text-[#8C827A]">GL · BL · A10</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LagnaCard item={result.ghatiLagna} highlight />
                <LagnaCard item={result.bhavaLagna} />
                <LagnaCard item={result.arudhaItems.find((a) => a.key === "A10") ?? result.arudhaItems[9]} highlight />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: 12 Arudha Padas Matrix ─────────────────────────────────── */}
        {activeTab === "arudha" && (
          <div className="space-y-8">
            {/* AL-UL Marital Synastry Deep Dive */}
            <section
              className="rounded-3xl p-6 lg:p-8"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)",
                border: "1px solid rgba(184, 134, 11, 0.3)",
                boxShadow: "0 2px 14px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B8860B] px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#B8860B]/30">
                  Jaimini Upadesha Sutras
                </span>
                <span className="text-xs text-[#8C827A] font-semibold">
                  Synastry &amp; Image Verification
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                AL-UL Synastry · Public Image vs. Marital Reality
              </h2>
              <p className="text-sm text-[#6B635B] mt-1 max-w-3xl leading-relaxed">
                <strong>Arudha Lagna (AL)</strong> reveals how society perceives your persona, reputation, and status. <strong>Upapada Lagna (UL / A12)</strong> reveals the inner sanctum of marriage, emotional commitment, and spouse relationship.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <span className="text-xs uppercase font-extrabold text-[#B8860B] block">
                    Arudha Lagna (AL)
                  </span>
                  <p className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                    {alUlSynastry.alSign} <span className="text-xs font-normal text-[#6B635B]">{RASHI_ICONS[alUlSynastry.alSignNum]}</span>
                  </p>
                  <p className="text-xs text-[#6B635B] mt-2">
                    Worldly facade, public reputation, and social standing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <span className="text-xs uppercase font-extrabold text-[#B8860B] block">
                    Upapada Lagna (UL)
                  </span>
                  <p className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                    {alUlSynastry.ulSign} <span className="text-xs font-normal text-[#6B635B]">{RASHI_ICONS[alUlSynastry.ulSignNum]}</span>
                  </p>
                  <p className="text-xs text-[#6B635B] mt-2">
                    Marital harmony, domestic reality, and spouse family bond.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)] flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-[#B8860B] block">
                      Synastry Distance
                    </span>
                    <p className="text-lg font-bold text-[#1A1A1A] mt-1">
                      {alUlSynastry.relationship}
                    </p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-[#B8860B]">
                    Harmony Index: {alUlSynastry.score}/10
                  </div>
                </div>
              </div>

              {/* Shadashtaka Alert & Remedies */}
              <div
                className="p-4 rounded-2xl text-xs space-y-2 leading-relaxed"
                style={{
                  background: alUlSynastry.distance === 6 || alUlSynastry.distance === 8 ? "#FEF2F2" : "#F0FDF4",
                  border: `1px solid ${alUlSynastry.distance === 6 || alUlSynastry.distance === 8 ? "#FECACA" : "#BBF7D0"}`,
                  color: alUlSynastry.distance === 6 || alUlSynastry.distance === 8 ? "#991B1B" : "#166534",
                }}
              >
                <div className="font-bold text-sm">
                  {alUlSynastry.verdict}
                </div>
                <div>
                  <strong>Jaimini Secret:</strong> {alUlSynastry.transcriptAdvice}
                </div>
                <div className="pt-2 border-t border-current/20 font-semibold">
                  <strong>Classical Upay:</strong> {alUlSynastry.remedy}
                </div>
              </div>
            </section>

            {/* 12 Arudha Padas Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                    Complete 12 Arudha Padas Matrix (A1 to A12)
                  </h3>
                  <p className="text-xs text-[#6B635B] mt-0.5">
                    Calculated strictly using Sage Jaimini exception rules (+9 signs for 1st/7th jumps).
                  </p>
                </div>
                <span className="text-xs text-[#B8860B] font-bold">12 Visible Reflections</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {result.arudhaItems.map((item) => (
                  <LagnaCard
                    key={item.key}
                    item={item}
                    highlight={item.key === "AL" || item.key === "UL" || item.key === "A10"}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: Rajayogas, Dasha & Remedies ────────────────────────────── */}
        {activeTab === "rajayoga" && (
          <div className="space-y-8">
            {/* Active Dasha Radar */}
            {activeDashaActivation && (
              <section
                className="rounded-3xl p-6 lg:p-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(184, 134, 11, 0.35)",
                  boxShadow: "0 2px 16px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B8860B] px-2.5 py-0.5 rounded-full bg-[#FAF5EB] border border-[#B8860B]/30">
                    Vimshottari Dasha Synchronization
                  </span>
                  <span className="text-xs text-[#8C827A] font-semibold">Live Transit &amp; Dasha Radar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                  Active Dasha Activation Radar
                </h2>
                <p className="text-sm text-[#6B635B] mt-1 max-w-2xl leading-relaxed">
                  Your current Mahadasha lord (<strong>{activeDashaActivation.mahadashaLord}</strong>)
                  {activeDashaActivation.antardashaLord ? ` and Antardasha lord (${activeDashaActivation.antardashaLord})` : ""} directly ignite specific Special Lagnas through sign occupancy, drishti aspects, and lordship.
                </p>

                <div className="my-5 p-4 rounded-2xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] text-xs text-[#1A1A1A] leading-relaxed">
                  <strong>Timing Forecast:</strong> {activeDashaActivation.overallForecast}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {activeDashaActivation.activatedLagnas.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8860B]">
                            {act.lagnaKey} · {act.lagnaName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                            {act.connection}
                          </span>
                        </div>
                        <p className="text-xs text-[#1A1A1A] leading-relaxed mt-2 font-medium">
                          {act.lifeImpact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Special Lagna Rajayogas Matrix */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                  Special Lagna Rajayogas &amp; Dhana Combinations
                </h3>
                <span className="text-xs text-[#8C827A]">BPHS &amp; Brihat Jataka</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rajayogas.map((yoga, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl flex flex-col justify-between transition-all"
                    style={{
                      background: yoga.isFormed ? "rgba(184, 134, 11, 0.06)" : "#FFFFFF",
                      border: `1px solid ${yoga.isFormed ? "rgba(184, 134, 11, 0.45)" : "rgba(184, 134, 11, 0.18)"}`,
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B]">
                          {yoga.type}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{
                            background: yoga.isFormed ? "#DCFCE7" : "#F3F4F6",
                            color: yoga.isFormed ? "#15803D" : "#6B7280",
                          }}
                        >
                          {yoga.isFormed ? `ACTIVE (${yoga.strength})` : "INDEPENDENT"}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-[#1A1A1A]">
                        {yoga.name}
                      </h4>
                      <p className="text-xs text-[#8C827A] font-medium">
                        {yoga.sanskritName}
                      </p>
                      <p className="text-xs text-[#4A4238] mt-3 leading-relaxed">
                        {yoga.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[rgba(184,134,11,0.15)] flex justify-between items-center text-[11px] text-[#8C827A]">
                      <span>Involved Lagnas: {yoga.involvedLagnas.join(", ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Classical Upay & Mantras */}
            <section
              className="rounded-3xl p-6 lg:p-8"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
                border: "1px solid rgba(184, 134, 11, 0.25)",
              }}
            >
              <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2">
                Classical Special Lagna Remedies &amp; Stotras
              </h3>
              <p className="text-xs text-[#6B635B] mb-5 leading-relaxed">
                Authentic remedies derived directly from Brihat Jataka and Sage Parashara to awaken wealth rays and dissolve marital friction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <span className="text-xl block mb-1">🪙</span>
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">Indu Lagna Kubera Mantra</h4>
                  <p className="text-[#4A4238] leading-relaxed mb-3">
                    To stimulate the cosmic ray matrix of Indu Lagna and attract auspicious business capital:
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#FAF5EB] font-serif font-bold text-[#B8860B] text-center border border-[#B8860B]/25">
                    ॐ श्रीं ह्रीं क्लीं श्रीं क्लीं वित्तेश्वराय नमः॥
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <span className="text-xl block mb-1">🌸</span>
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">Sree Lagna Mahalakshmi Stotram</h4>
                  <p className="text-[#4A4238] leading-relaxed mb-3">
                    Sree Lagna is nourished through pure Friday devotion and pristine domestic aesthetics:
                  </p>
                  <p className="text-[#6B635B] leading-relaxed">
                    Recite <strong>Shri Suktam</strong> or <strong>Kanakadhara Stotram</strong> on Friday mornings. Keep ghee lamps lit at home entrance to invite the subtle frequency of Mahalakshmi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[rgba(184,134,11,0.2)]">
                  <span className="text-xl block mb-1">💍</span>
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">Upapada Lagna Fasting Upay</h4>
                  <p className="text-[#4A4238] leading-relaxed mb-3">
                    Parashara&apos;s master remedy for marital peace and mutual understanding:
                  </p>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                    {alUlSynastry.remedy}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
