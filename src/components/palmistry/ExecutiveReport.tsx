"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { type PalmistryReport } from "@/lib/astro-engine/palmistry-engine";

interface ExecutiveReportProps {
  report: PalmistryReport;
  preview: string;
}

const COLORS = ["#c8a030", "#e6c869", "#8338ec", "#ff006e", "#00f5ff"];

export function ExecutiveReport({ report, preview }: ExecutiveReportProps) {
  // Prepare data for charts
  const lineStrengthData = report.lines.map((l) => ({
    name: l.name.substring(0, 6),
    strength: Math.max(50, Math.min(100, Math.round(l.confidence * 0.82 + 12))),
    confidence: l.confidence,
  }));

  const predictionData = report.predictions.map((p) => ({
    name: p.title.split(" ")[0],
    strength: p.strength,
  }));

  const luckData = [
    { name: "Numbers", value: report.luck.numbers.length },
    { name: "Days", value: report.luck.days.length },
    { name: "Colors", value: report.luck.colors.length },
    { name: "Gemstones", value: report.luck.gemstones.length },
  ];

  const timelineData = report.timeline.map((t) => ({
    period: t.range,
    significance: Math.max(50, Math.min(100, 64 + t.summary.length % 29)),
  }));

  const metricsData = report.overallImpression.metrics.map((m) => ({
    name: m.label.substring(0, 8),
    value: m.value,
  }));

  return (
    <div className="mt-8 space-y-8">
      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-[2fr_1fr]"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869] mb-3">EXECUTIVE SUMMARY</div>
          <h1 className="font-serif text-3xl font-bold text-white mb-4">Palm Analysis Report</h1>
          <p className="text-white/80 leading-relaxed text-lg font-medium">{report.overallImpression.headline}</p>
          <p className="mt-4 text-white/60 leading-relaxed">{report.overallImpression.summary}</p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Palm Image</div>
            <div className="mt-3 aspect-square rounded-xl border border-[#c8a030]/30 overflow-hidden shadow-[0_0_20px_rgba(200,160,48,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Your palm" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869] mb-3">Overall Index</div>
            <div className="text-4xl font-bold text-[#e6c869]">{report.finalIntelligenceScore.score}</div>
            <div className="text-xs text-white/40 mt-1">{report.finalIntelligenceScore.confidence}% confidence</div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md"
      >
        <h2 className="mb-6 text-lg font-bold text-white">Key Performance Indicators</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
              <YAxis stroke="rgba(255,255,255,0.4)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(6,4,16,0.9)",
                  border: "1px solid #c8a030",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e6c869" }}
              />
              <Bar dataKey="value" fill="#c8a030" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Prediction Strength Analysis */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <h2 className="mb-6 text-lg font-bold text-white">Prediction Strength Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.4)" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(6,4,16,0.9)",
                    border: "1px solid #c8a030",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e6c869" }}
                />
                <Bar dataKey="strength" fill="#e6c869" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <h2 className="mb-6 text-lg font-bold text-white">Life Timeline Significance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,48,0.2)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(6,4,16,0.9)",
                    border: "1px solid #c8a030",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e6c869" }}
                />
                <Line type="monotone" dataKey="significance" stroke="#c8a030" strokeWidth={2} dot={{ fill: "#e6c869", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Lines Analysis & Luck Distribution */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <h2 className="mb-6 text-lg font-bold text-white">Palm Lines Analysis</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={lineStrengthData}>
                <CartesianGrid stroke="rgba(200,160,48,0.2)" />
                <PolarAngleAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" />
                <Radar name="Strength" dataKey="strength" stroke="#c8a030" fill="#c8a030" fillOpacity={0.3} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(6,4,16,0.9)",
                    border: "1px solid #c8a030",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e6c869" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md">
          <h2 className="mb-6 text-lg font-bold text-white">Fortune Elements Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={luckData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#c8a030"
                  dataKey="value"
                >
                  {luckData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(6,4,16,0.9)",
                    border: "1px solid #c8a030",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e6c869" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Detailed metrics table */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md overflow-x-auto"
      >
        <h2 className="mb-6 text-lg font-bold text-white">Detailed Analysis</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c8a030]/20">
              <th className="text-left text-[#e6c869] font-semibold pb-3">Element</th>
              <th className="text-left text-[#e6c869] font-semibold pb-3">Type</th>
              <th className="text-right text-[#e6c869] font-semibold pb-3">Index</th>
            </tr>
          </thead>
          <tbody>
            {report.lines.slice(0, 4).map((line) => (
              <tr key={line.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                <td className="py-3 text-white/80">{line.name}</td>
                <td className="py-3 text-white/60 text-xs">{line.sanskrit}</td>
                <td className="py-3 text-right">
                  <span className="inline-block rounded-full border border-[#c8a030]/30 bg-[#c8a030]/10 px-3 py-1 text-xs font-semibold text-[#e6c869]">
                    {line.confidence}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-[#c8a030]/20 bg-white/[0.02] p-8 backdrop-blur-md"
      >
        <h2 className="mb-6 text-lg font-bold text-white">Strategic Recommendations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {report.growthPlan.slice(0, 4).map((item, i) => (
            <div key={item} className="rounded-xl border border-[#c8a030]/15 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#e6c869] mb-2">Step {i + 1}</div>
              <p className="text-sm text-white/70 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center border-t border-white/10 pt-6">
        <p className="text-xs text-white/40">This analysis is based on pattern recognition and should be used for insights only, not definitive predictions.</p>
      </div>
    </div>
  );
}
