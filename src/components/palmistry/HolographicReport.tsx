"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type PalmistryReport } from "@/lib/astro-engine/palmistry-engine";

interface HolographicReportProps {
  report: PalmistryReport;
  preview: string;
}

export function HolographicReport({ report, preview }: HolographicReportProps) {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

  return (
    <div className="mt-8 space-y-8">
      {/* Hero section with neon glow */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/50 bg-black p-8 text-center shadow-[0_0_60px_rgba(0,245,255,0.3)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,245,255,0.15),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="text-cyan-400 text-sm tracking-[0.3em] uppercase font-bold mb-4">━━ NEURAL SCAN INITIATED ━━</div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 mb-2">
            HOLOGRAPHIC PALM ANALYSIS
          </h1>
          <p className="text-white/60 text-sm">AI.CONSCIOUSNESS.PATTERN.RECOGNITION</p>
        </motion.div>
      </div>

      {/* Central palm scanner with radial data points */}
      <div className="relative mx-auto w-full max-w-3xl">
        <div className="relative aspect-square rounded-2xl border border-purple-500/40 bg-black/80 p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          {/* Grid background */}
          <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#00f5ff" strokeWidth="0.2" />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#00f5ff" strokeWidth="0.2" />
            ))}
          </svg>

          {/* Central palm image */}
          <div className="relative mx-auto h-64 w-48 overflow-hidden rounded-xl border border-cyan-400/50 shadow-[0_0_30px_rgba(0,245,255,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Your palm" className="h-full w-full object-cover" />
            {/* Scanning overlay */}
            <motion.div
              className="absolute inset-0 border-2 border-cyan-400"
              animate={{ boxShadow: ["inset 0 0 20px rgba(0,245,255,0.4)", "inset 0 0 5px rgba(0,245,255,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Radial data points around palm */}
          {report.predictions.slice(0, 4).map((pred, i) => {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
            const radius = 160;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={pred.id}
                className="absolute flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/60 bg-black/60 cursor-pointer"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -40,
                  marginTop: -40,
                }}
                animate={{
                  x,
                  y,
                  boxShadow: selectedPrediction === pred.id
                    ? "0 0 30px rgba(0,245,255,0.6)"
                    : "0 0 10px rgba(0,245,255,0.2)"
                }}
                onClick={() => setSelectedPrediction(selectedPrediction === pred.id ? null : pred.id)}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-xs font-bold text-cyan-400">{pred.strength}%</div>
                  <div className="text-[9px] text-white/60 mt-0.5">{pred.title.split(" ")[0]}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected prediction details */}
        <AnimatePresence>
          {selectedPrediction && report.predictions.find((p) => p.id === selectedPrediction) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 rounded-xl border border-cyan-400/50 bg-black/80 p-6 shadow-[0_0_30px_rgba(0,245,255,0.2)]"
            >
              <h3 className="text-lg font-bold text-cyan-400">
                {report.predictions.find((p) => p.id === selectedPrediction)?.title}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                {report.predictions.find((p) => p.id === selectedPrediction)?.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overall impression - neon card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-pink-500/50 bg-black/60 p-8 shadow-[0_0_40px_rgba(255,0,110,0.2)]"
      >
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
          CONSCIOUSNESS SIGNATURE
        </h2>
        <p className="text-white/80 leading-relaxed mb-2">{report.overallImpression.headline}</p>
        <p className="text-white/60 text-sm leading-relaxed italic">{report.overallImpression.summary}</p>
      </motion.div>

      {/* Major lines - interactive grid */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          NEURAL PATHWAYS DECODED
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report.lines.map((line, i) => (
            <motion.button
              key={line.id}
              onClick={() => setSelectedLine(selectedLine === line.id ? null : line.id)}
              className="relative overflow-hidden rounded-xl border border-cyan-400/30 bg-black/80 p-4 text-left transition-all hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 -z-10" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-cyan-400">{line.name}</h3>
                <span className="text-xs text-white/40">{line.confidence}%</span>
              </div>
              <p className="text-[11px] text-white/50 mb-2">{line.sanskrit}</p>
              <AnimatePresence>
                {selectedLine === line.id && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-xs text-white/60 leading-relaxed mt-2 overflow-hidden"
                  >
                    {line.detail || line.summary}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Life timeline - neon vertical */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-purple-500/40 bg-black/60 p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <h2 className="mb-6 text-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          TEMPORAL PATHWAYS
        </h2>
        <div className="space-y-4 border-l-2 border-purple-500/40 pl-6">
          {report.timeline.map((t, i) => (
            <motion.div
              key={t.range}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <span className="absolute -left-[13px] top-2 h-2 w-2 rounded-full border border-purple-400 bg-black shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <div className="text-sm font-bold text-purple-400">{t.range}</div>
              {t.title && <div className="text-sm font-semibold text-white/85">{t.title}</div>}
              <p className="mt-1 text-xs text-white/55 leading-relaxed">{t.summary}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lucky elements - holographic grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Lucky Numbers", items: report.luck.numbers.map(String) },
          { label: "Lucky Days", items: report.luck.days },
          { label: "Lucky Colors", items: report.luck.colors },
          { label: "Lucky Gemstones", items: report.luck.gemstones },
          { label: "Lucky Directions", items: report.luck.directions },
          { label: "Lucky Career Fields", items: report.luck.careerFields },
        ].map((group, i) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-cyan-400/30 bg-black/80 p-4 shadow-[0_0_20px_rgba(0,245,255,0.1)]"
          >
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">{group.label}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full border border-cyan-400/40 bg-cyan-400/5 px-3 py-1 text-[11px] text-cyan-300">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center border-t border-white/10 pt-8">
        <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase">Neural Analysis Complete</p>
      </div>
    </div>
  );
}
