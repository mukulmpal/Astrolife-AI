"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Brain, CircleDollarSign, Heart, Orbit, ScanLine, Sparkles, Zap } from "lucide-react";
import {
  type PalmistryReport,
  PALM_LINES,
  FALLBACK_LINE_POINTS,
  buildLinePath,
  mirrorX,
} from "@/lib/astro-engine/palmistry-engine";

interface HolographicReportProps {
  report: PalmistryReport;
  preview: string;
}

function HoloCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      className={`rounded-[1.5rem] border border-cyan-300/18 bg-[#020811]/70 p-5 shadow-[0_0_42px_rgba(41,230,209,.10)] backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function HoloScanner({ report, preview }: HolographicReportProps) {
  const lineById = useMemo(
    () => new Map<string, PalmistryReport["lines"][number]>(report.lines.map((line) => [line.id, line])),
    [report.lines],
  );
  const mirror = report.meta.hand === "left";

  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-[#010711] p-5 shadow-[0_0_120px_rgba(41,230,209,.18)]">
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(83,231,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(83,231,255,.08) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
        <ScanLine size={13} className="mr-2 inline" /> Spatial Palm Scan {report.finalIntelligenceScore.confidence}%
      </div>

      <div className="relative mx-auto mt-12 aspect-[4/5] max-h-[500px] max-w-[420px] overflow-hidden rounded-[42%]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 38, repeat: Infinity, ease: "linear" }} className="absolute left-[13%] top-[13%] h-[74%] w-[74%] rounded-full border border-dashed border-violet-300/25" />
        <motion.div animate={{ y: [0, 430, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[20%] right-[20%] z-30 h-px bg-cyan-100 shadow-[0_0_28px_8px_rgba(83,231,255,.34)]" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Your palm" className="absolute inset-0 h-full w-full object-cover opacity-95 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010711]/70 via-transparent to-[#010711]/20" />
        <svg className="absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {PALM_LINES.map((def, i) => {
            const reading = lineById.get(def.id);
            const raw = reading?.points ?? FALLBACK_LINE_POINTS[def.id];
            const pts = reading?.points ? raw : raw.map((p) => mirrorX(p, mirror));
            return (
              <motion.path
                key={def.id}
                d={buildLinePath(pts)}
                fill="none"
                stroke={def.color}
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ filter: `drop-shadow(0 0 6px ${def.color})` }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.96 }}
                transition={{ duration: 1.2, delay: 0.15 + i * 0.18 }}
              />
            );
          })}
        </svg>
      </div>

      {report.predictions.slice(0, 5).map((prediction, i) => {
        const slots = [
          "left-5 top-24",
          "right-5 top-24",
          "left-5 bottom-28",
          "right-5 bottom-28",
          "left-1/2 bottom-8 -translate-x-1/2",
        ];
        return (
          <motion.button
            key={prediction.id}
            type="button"
            className={`absolute z-30 hidden w-44 rounded-2xl border border-cyan-300/20 bg-black/45 p-3 text-left backdrop-blur-xl lg:block ${slots[i]}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.08 }}
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/55">{prediction.title}</div>
            <div className="mt-1 text-3xl font-light text-cyan-100">{prediction.strength}%</div>
            <p className="mt-1 text-xs leading-relaxed text-white/50">{prediction.summary}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

export function HolographicReport({ report, preview }: HolographicReportProps) {
  const [selectedLine, setSelectedLine] = useState<string | null>(report.lines[0]?.id ?? null);
  const selected = report.lines.find((line) => line.id === selectedLine);
  const icons = [Brain, Heart, Activity, CircleDollarSign, Orbit, Zap];

  return (
    <div className="mt-8 space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-[#020811] p-6 shadow-[0_0_120px_rgba(41,230,209,.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(41,230,209,.18),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(196,92,255,.14),transparent_34%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-cyan-100">
              <Sparkles size={13} /> AstroLife Holographic AI
            </div>
            <h1 className="mt-5 bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text font-serif text-5xl font-light tracking-[0.06em] text-transparent sm:text-6xl">
              Spatial Palm Intelligence
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{report.finalIntelligenceScore.summary}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:w-[420px]">
            {[
              ["Index", report.finalIntelligenceScore.score],
              ["Confidence", report.finalIntelligenceScore.confidence],
              ["Alignment", report.palmKundliCorrelation.alignmentScore],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-cyan-300/18 bg-black/35 p-4 text-center">
                <div className="text-3xl font-light text-cyan-100">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <HoloScanner report={report} preview={preview} />
        <div className="space-y-4">
          {report.intelligenceSections.slice(0, 6).map((section, i) => {
            const Icon = icons[i] ?? Brain;
            return (
              <HoloCard key={section.id}>
                <div className="flex items-center justify-between gap-3">
                  <Icon className="text-cyan-200" size={18} />
                  <span className="text-2xl font-light text-cyan-100">{section.score}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-white">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/52">{section.interpretation}</p>
              </HoloCard>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <HoloCard>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-cyan-200/60">Neural Pathway Selector</div>
          <div className="flex flex-wrap gap-2">
            {report.lines.map((line) => (
              <button
                key={line.id}
                type="button"
                onClick={() => setSelectedLine(line.id)}
                className={`rounded-full border px-3 py-2 text-xs transition ${selectedLine === line.id ? "border-cyan-300/60 bg-cyan-300/15" : "border-white/10 bg-white/[0.03]"}`}
                style={{ color: line.color }}
              >
                {line.name} · {line.confidence}%
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <h3 className="font-serif text-2xl" style={{ color: selected.color }}>{selected.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/58">{selected.detail || selected.summary}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </HoloCard>

        <HoloCard>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-violet-200/60">Advanced Intelligence Layer</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.advancedInsights.slice(0, 8).map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.06] p-3">
                <h4 className="text-sm font-semibold text-violet-100">{insight.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-white/45">{insight.body}</p>
              </div>
            ))}
          </div>
        </HoloCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {report.mounts.map((mount) => (
          <HoloCard key={mount.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-cyan-100">{mount.name.replace("Mount of ", "")}</h3>
              <b className="text-2xl font-light text-cyan-200">{mount.score}</b>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/48">{mount.summary || mount.keywords}</p>
          </HoloCard>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-5 text-center">
        <p className="text-xs leading-relaxed text-white/38">{report.meta.disclaimer}</p>
      </div>
    </div>
  );
}
