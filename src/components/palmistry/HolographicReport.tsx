"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type PalmistryReport } from "@/lib/astro-engine/palmistry-engine";

interface HolographicReportProps {
  report: PalmistryReport;
  preview: string;
}

export function HolographicReport({ report, preview }: HolographicReportProps) {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

  // Responsive radial layout: radius scales with the scanner container so the
  // orbiting prediction nodes never overflow on small / mobile screens.
  const scannerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(160);
  useEffect(() => {
    const el = scannerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      // keep nodes (40px half-size) inside the box; scale with width, clamp.
      setRadius(Math.max(96, Math.min(180, w * 0.36)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">━━ NEURAL SCAN INITIATED ━━</div>
          <h1 className="mb-2 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
            HOLOGRAPHIC PALM ANALYSIS
          </h1>
          <p className="text-sm text-white/60">AI.CONSCIOUSNESS.PATTERN.RECOGNITION</p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-black/60 px-5 py-2">
            <span className="text-[11px] uppercase tracking-widest text-white/50">Intelligence Index</span>
            <span className="text-xl font-black text-cyan-400">{report.finalIntelligenceScore.score}</span>
            <span className="text-[11px] text-white/40">{report.finalIntelligenceScore.confidence}% conf</span>
          </div>
        </motion.div>
      </div>

      {/* Central palm scanner with radial data points */}
      <div className="relative mx-auto w-full max-w-3xl">
        <div ref={scannerRef} className="relative aspect-square rounded-2xl border border-purple-500/40 bg-black/80 p-4 shadow-[0_0_40px_rgba(168,85,247,0.2)] sm:p-8">
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
          <div className="relative mx-auto h-48 w-36 overflow-hidden rounded-xl border border-cyan-400/50 shadow-[0_0_30px_rgba(0,245,255,0.4)] sm:h-64 sm:w-48">
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
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={pred.id}
                className="absolute flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/60 bg-black/60 cursor-pointer sm:h-20 sm:w-20"
                style={{ left: "50%", top: "50%", marginLeft: -32, marginTop: -32 }}
                animate={{
                  x, y,
                  boxShadow: selectedPrediction === pred.id
                    ? "0 0 30px rgba(0,245,255,0.6)"
                    : "0 0 10px rgba(0,245,255,0.2)",
                }}
                onClick={() => setSelectedPrediction(selectedPrediction === pred.id ? null : pred.id)}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-xs font-bold text-cyan-400">{pred.strength}%</div>
                  <div className="mt-0.5 text-[9px] text-white/60">{pred.title.split(" ")[0]}</div>
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
        <h2 className="mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
          CONSCIOUSNESS SIGNATURE
        </h2>
        <p className="mb-2 leading-relaxed text-white/80">{report.overallImpression.headline}</p>
        <p className="text-sm italic leading-relaxed text-white/60">{report.overallImpression.summary}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {report.overallImpression.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-pink-400/25 bg-black/50 p-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/50">{m.label}</span>
                <span className="font-bold text-pink-300">{m.value}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                  initial={{ width: 0 }} whileInView={{ width: `${m.value}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          ))}
        </div>
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
              transition={{ delay: i * 0.08 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold text-cyan-400">{line.name}</h3>
                <span className="text-xs text-white/40">{line.confidence}%</span>
              </div>
              <p className="mb-2 text-[11px] text-white/50">{line.sanskrit}</p>
              <AnimatePresence>
                {selectedLine === line.id && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden text-xs leading-relaxed text-white/60"
                  >
                    {line.detail || line.summary}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Planetary mounts - neon energy grid */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          PLANETARY ENERGY MOUNTS
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {report.mounts.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-purple-400/30 bg-black/80 p-4 shadow-[0_0_18px_rgba(168,85,247,0.12)]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-purple-300">{m.name.replace("Mount of ", "")}</h3>
                <span className="text-xs font-bold text-cyan-400">{m.score}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
                  initial={{ width: 0 }} whileInView={{ width: `${m.score}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
              </div>
              {m.keywords && <p className="mt-2 text-[10px] uppercase tracking-wide text-white/40">{m.keywords}</p>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Intelligence modules - data matrix */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
          INTELLIGENCE MATRIX
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {report.intelligenceSections.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-cyan-400/25 bg-black/80 p-4 shadow-[0_0_16px_rgba(0,245,255,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-cyan-300">{s.title}</h3>
                <div className="text-right">
                  <div className="text-lg font-black leading-none text-cyan-400">{s.score}</div>
                  <div className="text-[9px] text-white/40">{s.confidence}% conf</div>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/55">{s.interpretation}</p>
              <p className="mt-2 rounded-lg border border-pink-400/15 bg-pink-400/[0.06] px-2.5 py-1.5 text-[11px] leading-relaxed text-pink-100/75">{s.recommendation}</p>
            </motion.div>
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
              <p className="mt-1 text-xs leading-relaxed text-white/55">{t.summary}</p>
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
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-400">{group.label}</h3>
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
      <div className="border-t border-white/10 pt-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Neural Analysis Complete</p>
      </div>
    </div>
  );
}
