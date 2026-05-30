"use client";

import React from "react";
import { motion } from "framer-motion";
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
    <div className="mt-8 space-y-8">
      {/* ── Executive Summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-[2fr_1fr]"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">EXECUTIVE SUMMARY</div>
          <h1 className="mb-4 font-serif text-3xl font-bold text-white">Palm Analysis Report</h1>
          <p className="text-lg font-medium leading-relaxed text-white/80">{report.overallImpression.headline}</p>
          <p className="mt-4 leading-relaxed text-white/60">{report.overallImpression.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-white/45">
            <span className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-[#e6c869]">{report.meta.hand} hand</span>
            <span className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-[#e6c869]">image: {report.meta.imageQuality}</span>
            <span className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-[#e6c869]">{report.palmGeometry.handType}</span>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Palm Image</div>
            <div className="mt-3 aspect-square overflow-hidden rounded-xl border border-[#c8a030]/30 shadow-[0_0_20px_rgba(200,160,48,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Your palm" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Overall Index</div>
            <div className="text-4xl font-bold text-[#e6c869]">{report.finalIntelligenceScore.score}</div>
            <div className="mt-1 text-xs text-white/40">{report.finalIntelligenceScore.confidence}% confidence</div>
            <p className="mt-3 text-xs leading-relaxed text-white/50">{report.finalIntelligenceScore.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* ── KPI bar (overall impression metrics) ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md"
      >
        <h2 className="mb-6 text-lg font-bold text-white">Key Performance Indicators</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.4)" domain={[0, 100]} />
              <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#e6c869" }} cursor={{ fill: "rgba(200,160,48,0.06)" }} />
              <Bar dataKey="value" fill="#c8a030" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Scoreboard radar + Prediction strength ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
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
        </div>

        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
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
        </div>
      </motion.div>

      {/* ── Mount strengths + Intelligence module trend ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
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
        </div>

        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
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
        </div>
      </motion.div>

      {/* ── Palm geometry profile ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md"
      >
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
      </motion.div>

      {/* ── Intelligence modules table ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="overflow-x-auto rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md"
      >
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
      </motion.div>

      {/* ── Palm + Kundli correlation ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="grid gap-6 lg:grid-cols-[1fr_1fr]"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
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
        </div>

        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <h2 className="mb-4 text-lg font-bold text-white">Strategic Recommendations</h2>
          <div className="space-y-3">
            {report.growthPlan.slice(0, 5).map((item, i) => (
              <div key={item} className="flex gap-3 rounded-xl border border-[#c8a030]/15 bg-white/[0.03] p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c8a030]/15 text-[10px] font-bold text-[#e6c869]">{i + 1}</span>
                <p className="text-sm leading-relaxed text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-xs text-white/40">{report.meta.disclaimer}</p>
      </div>
    </div>
  );
}
