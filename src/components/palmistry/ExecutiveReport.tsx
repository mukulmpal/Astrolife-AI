"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, CircleDollarSign, FileText, Heart, ShieldCheck, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from "recharts";
import { type PalmistryReport } from "@/lib/astro-engine/palmistry-engine";

interface ExecutiveReportProps {
  report: PalmistryReport;
  preview: string;
}

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(6,4,16,0.92)",
  border: "1px solid #c8a030",
  borderRadius: "8px",
} as const;

function shortLabel(text: string, max = 12): string {
  const clean = text.replace(/\s*(Blueprint|Indicators|Intelligence|Recommendations|Potential|Profile)\b/gi, "").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl border border-slate-300/12 bg-[#071018]/78 p-6 shadow-[0_22px_70px_rgba(0,0,0,.28)] backdrop-blur-md ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-300/12 bg-white/[0.035] p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 font-serif text-4xl font-light text-white">{value}</div>
      {sub && <p className="mt-2 text-xs leading-relaxed text-slate-400">{sub}</p>}
    </div>
  );
}

export function ExecutiveReport({ report, preview }: ExecutiveReportProps) {
  // ── Real, report-derived chart datasets (no synthetic numbers) ──
  const metricsData = report.overallImpression.metrics.map((m) => ({
    name: shortLabel(m.label, 10),
    value: m.value,
  }));

  const scoreboardData = report.scoreboard.map((s) => ({
    name: shortLabel(s.label, 11),
    value: s.value,
  }));

  const predictionData = report.predictions.map((p) => ({
    name: p.title.split(/[ &]/)[0],
    strength: p.strength,
  }));

  const mountData = report.mounts.map((m) => ({
    name: m.name.replace("Mount of ", "").replace(" / Apollo", ""),
    score: m.score,
  }));

  const moduleData = report.intelligenceSections.map((s) => ({
    name: shortLabel(s.title, 10),
    score: s.score,
    confidence: s.confidence,
  }));

  return (
    <div className="mt-8 space-y-6 text-slate-100">
      <Panel className="overflow-hidden p-0">
        <div className="relative grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(96,165,250,.14),transparent_36%),radial-gradient(circle_at_85%_40%,rgba(200,160,48,.10),transparent_32%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/15 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-300">
              <FileText size={13} /> Executive Insight Report
            </div>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-[0.03em] text-white">Palm Intelligence Memo</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">{report.overallImpression.headline}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{report.overallImpression.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-slate-300/15 bg-white/[0.04] px-3 py-1 text-slate-300">{report.meta.hand} hand</span>
              <span className="rounded-full border border-slate-300/15 bg-white/[0.04] px-3 py-1 text-slate-300">image: {report.meta.imageQuality}</span>
              <span className="rounded-full border border-slate-300/15 bg-white/[0.04] px-3 py-1 text-slate-300">{report.palmGeometry.handType}</span>
            </div>
          </div>
          <div className="relative grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Kpi label="AI Index" value={report.finalIntelligenceScore.score} sub={`${report.finalIntelligenceScore.confidence}% confidence`} />
            <Kpi label="Kundli Alignment" value={report.palmKundliCorrelation.alignmentScore} sub={`${report.palmKundliCorrelation.confidence}% confidence`} />
            <Kpi label="Core Hand Type" value={shortLabel(report.palmGeometry.handType, 18)} sub={report.palmGeometry.palmShape} />
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          [Briefcase, "Career", report.predictions.find((p) => /career/i.test(p.title))?.strength ?? report.scoreboard[0]?.value ?? 75],
          [CircleDollarSign, "Wealth", report.scoreboard.find((s) => /wealth/i.test(s.label))?.value ?? 75],
          [Heart, "Relationship", report.scoreboard.find((s) => /relationship/i.test(s.label))?.value ?? 75],
          [ShieldCheck, "Risk Balance", report.scoreboard.find((s) => /health/i.test(s.label))?.value ?? 75],
        ].map(([Icon, label, value]) => {
          const MetricIcon = Icon as typeof Briefcase;
          return (
            <Panel key={String(label)} className="p-5">
              <MetricIcon className="text-[#e6c869]" size={20} />
              <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{String(label)} Index</div>
              <div className="mt-2 font-serif text-5xl font-light text-white">{String(value)}</div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-[#e6c869]" initial={{ width: 0 }} whileInView={{ width: `${Number(value)}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Palm Evidence</div>
          <div className="mt-4 aspect-[4/5] overflow-hidden rounded-2xl border border-slate-300/12 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Your palm" className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {[
              ["Palm Shape", report.palmGeometry.palmShape],
              ["Finger Ratio", report.palmGeometry.fingerProportion],
              ["Thumb Angle", report.palmGeometry.thumbAngle],
              ["Geometry Conf.", `${report.palmGeometry.confidence}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-300/12 bg-white/[0.035] p-3">
                <div className="text-slate-500">{label}</div>
                <div className="mt-1 font-semibold text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          {/* ── KPI bar (overall impression metrics) ── */}
          <Panel>
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white"><TrendingUp size={18} className="text-[#e6c869]" /> Key Performance Indicators</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.16)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.4)" domain={[0, 100]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#e6c869" }} cursor={{ fill: "rgba(200,160,48,0.06)" }} />
                  <Bar dataKey="value" fill="#c8a030" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── KPI bar (overall impression metrics) ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-6 text-lg font-bold text-white">Capability Scoreboard</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={scoreboardData} outerRadius="72%">
                <PolarGrid stroke="rgba(200,160,48,0.2)" />
                <PolarAngleAxis dataKey="name" stroke="rgba(255,255,255,0.55)" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                <Radar name="Score" dataKey="value" stroke="#c8a030" fill="#c8a030" fillOpacity={0.35} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#e6c869" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-6 text-lg font-bold text-white">Prediction Strength Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
                <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.4)" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.55)" width={90} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#e6c869" }} cursor={{ fill: "rgba(200,160,48,0.06)" }} />
                <Bar dataKey="strength" fill="#e6c869" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* ── Mount strengths + Intelligence module trend ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-6 text-lg font-bold text-white">Planetary Mount Strengths</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={56} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#e6c869" }} cursor={{ fill: "rgba(200,160,48,0.06)" }} />
                <Bar dataKey="score" fill="#8338ec" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-6 text-lg font-bold text-white">Intelligence Modules — Score vs Confidence</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moduleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 9 }} interval={0} angle={-40} textAnchor="end" height={64} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#e6c869" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="score" name="Score" stroke="#c8a030" strokeWidth={2} dot={{ fill: "#e6c869", r: 3 }} />
                <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#00f5ff" strokeWidth={2} strokeDasharray="4 3" dot={{ fill: "#00f5ff", r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* ── Palm geometry profile ── */}
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Palm Geometry Profile</h2>
          <span className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-xs font-semibold text-[#e6c869]">
            {report.palmGeometry.confidence}% confidence
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Hand Type", report.palmGeometry.handType],
            ["Palm Shape", report.palmGeometry.palmShape],
            ["Finger Ratio", report.palmGeometry.fingerProportion],
            ["Thumb Angle", report.palmGeometry.thumbAngle],
            ["Palm Width", report.palmGeometry.palmWidth],
            ["Palm Length", report.palmGeometry.palmLength],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-wider text-white/35">{label}</div>
              <div className="mt-1 text-sm font-medium text-white/85">{value}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ── Intelligence modules table ── */}
      <Panel className="overflow-x-auto">
        <h2 className="mb-6 text-lg font-bold text-white">Intelligence Modules — Detailed Analysis</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c8a030]/20">
              <th className="pb-3 text-left font-semibold text-[#e6c869]">Module</th>
              <th className="hidden pb-3 text-left font-semibold text-[#e6c869] md:table-cell">Interpretation</th>
              <th className="pb-3 text-right font-semibold text-[#e6c869]">Score</th>
              <th className="pb-3 text-right font-semibold text-[#e6c869]">Conf.</th>
            </tr>
          </thead>
          <tbody>
            {report.intelligenceSections.map((s) => (
              <tr key={s.id} className="border-b border-white/5 align-top transition hover:bg-white/[0.02]">
                <td className="py-3 pr-3 font-medium text-white/85">{s.title}</td>
                <td className="hidden max-w-md py-3 pr-3 text-xs leading-relaxed text-white/55 md:table-cell">{s.interpretation}</td>
                <td className="py-3 text-right">
                  <span className="inline-block rounded-full border border-[#c8a030]/30 bg-[#c8a030]/10 px-3 py-1 text-xs font-semibold text-[#e6c869]">{s.score}</span>
                </td>
                <td className="py-3 text-right text-xs text-white/40">{s.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* ── Palm + Kundli correlation ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Palm + Kundli Correlation</h2>
            <span className="rounded-2xl border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-2 font-serif text-2xl font-bold text-[#e6c869]">
              {report.palmKundliCorrelation.alignmentScore}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{report.palmKundliCorrelation.summary}</p>
          {report.palmKundliCorrelation.matches.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {report.palmKundliCorrelation.matches.map((m) => (
                <li key={m} className="flex gap-2 text-xs text-emerald-200/70"><span>✓</span><span>{m}</span></li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-bold text-white">Strategic Recommendations</h2>
          <div className="space-y-3">
            {report.growthPlan.slice(0, 5).map((item, i) => (
              <div key={item} className="flex gap-3 rounded-xl border border-[#c8a030]/15 bg-white/[0.03] p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c8a030]/15 text-[10px] font-bold text-[#e6c869]">{i + 1}</span>
                <p className="text-sm leading-relaxed text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-xs text-white/40">{report.meta.disclaimer}</p>
      </div>
    </div>
  );
}
