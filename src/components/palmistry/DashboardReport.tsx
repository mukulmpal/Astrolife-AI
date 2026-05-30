"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Briefcase,
  ChevronDown,
  CircleDollarSign,
  Compass,
  Crown,
  Heart,
  HeartPulse,
  Layers3,
  MessageCircle,
  Moon,
  Music2,
  RefreshCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
} from "lucide-react";
import {
  type PalmistryReport,
  PALM_LINES,
  FALLBACK_LINE_POINTS,
  buildLinePath,
  mirrorX,
} from "@/lib/astro-engine/palmistry-engine";

const GOLD = "#c8a030";

const MODE_DEFS = [
  {
    id: "full",
    title: "Full Intelligence",
    icon: Sparkles,
    desc: "Complete palm, personality, wealth, love, karma and remedies.",
  },
  {
    id: "executive",
    title: "Executive",
    icon: Briefcase,
    desc: "Career, wealth, leadership, founder potential and public influence.",
  },
  {
    id: "life",
    title: "Life Intelligence",
    icon: Heart,
    desc: "Personality, relationship patterns, vitality and life purpose.",
  },
  {
    id: "spiritual",
    title: "Spiritual",
    icon: Moon,
    desc: "Karma, intuition, inner growth and awakening indicators.",
  },
] as const;

const SCORE_ICONS = [Crown, Briefcase, Star, Heart, HeartPulse, CircleDollarSign, Moon];

function GlassCard({
  children, className = "", delay = 0, hover = true,
}: { children: React.ReactNode; className?: string; delay?: number; hover?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -3 } : undefined}
      className={`relative rounded-2xl border border-[#c8a030]/20 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] transition-shadow hover:border-[#c8a030]/45 hover:shadow-[0_0_30px_-6px_rgba(200,160,48,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function RadialScore({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const size = 96, r = 40, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff14" strokeWidth={7} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GOLD} strokeWidth={7}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ * (1 - value / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl font-bold text-[#e6c869]">
          {value}
        </div>
      </div>
      <span className="text-center text-xs font-medium text-white/60">{label}</span>
    </div>
  );
}

function MetricBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-white/70">{label}</span>
        <span className="font-semibold text-[#e6c869]">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#c8a030] to-[#e6c869]"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function IntelligenceCard({ section, delay = 0 }: { section: PalmistryReport["intelligenceSections"][number]; delay?: number }) {
  return (
    <GlassCard className="p-4" delay={delay}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Intelligence Module</div>
          <h4 className="mt-1 text-base font-bold text-white/90">{section.title}</h4>
        </div>
        <div className="rounded-2xl border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-2 text-center">
          <div className="font-serif text-2xl font-bold leading-none text-[#e6c869]">{section.score}</div>
          <div className="mt-1 text-[9px] uppercase tracking-wider text-white/40">{section.confidence}% conf</div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/60"><b className="text-white/80">Reasoning:</b> {section.reasoning}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/60"><b className="text-white/80">Interpretation:</b> {section.interpretation}</p>
      <p className="mt-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-xs leading-relaxed text-emerald-100/80">
        {section.recommendation}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {section.signals.slice(0, 5).map((signal) => (
          <span key={signal} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/50">{signal}</span>
        ))}
      </div>
    </GlassCard>
  );
}

function LineAccordion({ report }: { report: PalmistryReport }) {
  const [open, setOpen] = React.useState<string | null>(report.lines[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {report.lines.map((l) => {
        const isOpen = open === l.id;
        return (
          <div key={l.id} className="overflow-hidden rounded-xl border border-[#c8a030]/15 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : l.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                <span className="text-sm font-semibold text-white/90">{l.name}</span>
                <span className="text-xs text-white/40">{l.sanskrit}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#e6c869]">{l.confidence}%</span>
                <ChevronDown size={16} className={`text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </span>
            </button>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                <p className="px-4 pb-4 text-sm leading-relaxed text-white/65">{l.detail || l.summary}</p>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function normalizeScoreLabel(label: string) {
  return label.toLowerCase().replace(/[^a-z]/g, "");
}

function findScore(report: PalmistryReport, wanted: string, fallback = 75) {
  const target = normalizeScoreLabel(wanted);
  const match = [...report.scoreboard, ...report.overallImpression.metrics].find((item) =>
    normalizeScoreLabel(item.label).includes(target) || target.includes(normalizeScoreLabel(item.label)),
  );
  return match?.value ?? fallback;
}

function PalmReportHeader({ report }: { report: PalmistryReport }) {
  const reportId = useMemo(() => `PIR-${Math.abs(report.overallImpression.headline.split("").reduce((a, c) => a + c.charCodeAt(0), 0)).toString(16).toUpperCase()}-AL`, [report.overallImpression.headline]);
  const date = useMemo(
    () => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
    [],
  );

  return (
    <GlassCard className="overflow-hidden p-0" delay={0}>
      <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(200,160,48,0.18),transparent_38%),radial-gradient(circle_at_90%_30%,rgba(45,212,191,0.10),transparent_32%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a030]/30 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e6c869]">
            <Sparkles size={12} /> Powered by AstroLife Advanced AI Engine
          </div>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-[0.08em] text-white sm:text-5xl lg:text-6xl">
            AI Palm Reading Report
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#e6c869]/80">Your Hand. Your Story.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Verified AI Scan</span>
            <span className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-xs font-semibold text-[#e6c869]">{report.meta.hand} hand</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">Image quality: {report.meta.imageQuality}</span>
          </div>
        </div>

        <div className="relative grid gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
          {[
            ["Report ID", reportId],
            ["Generated", date],
            ["Scan Confidence", `${report.finalIntelligenceScore.confidence}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">{label}</div>
              <div className="mt-1 text-sm font-semibold text-white/80">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function IntelligenceModeBar({
  mode,
  setMode,
}: {
  mode: (typeof MODE_DEFS)[number]["id"];
  setMode: (mode: (typeof MODE_DEFS)[number]["id"]) => void;
}) {
  return (
    <GlassCard className="p-3" delay={0.04} hover={false}>
      <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">Choose Intelligence Mode</div>
      <div className="grid gap-3 md:grid-cols-4">
        {MODE_DEFS.map(({ id, title, icon: Icon, desc }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[#c8a030]/55 bg-[#c8a030]/15 shadow-[0_0_36px_rgba(200,160,48,0.16)]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              <Icon size={18} className={active ? "text-[#e6c869]" : "text-white/45"} />
              <div className="mt-3 font-serif text-lg text-white/90">{title}</div>
              <p className="mt-1 text-xs leading-relaxed text-white/45">{desc}</p>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}

function CommandPalmScanner({ report, preview }: { report: PalmistryReport; preview: string }) {
  const lineById = useMemo(
    () => new Map<string, PalmistryReport["lines"][number]>(report.lines.map((l) => [l.id as string, l])),
    [report.lines],
  );
  const mirror = report.meta.hand === "left";
  const calloutSlots = [
    "left-[1%] top-[13%]",
    "right-[1%] top-[13%]",
    "right-[0%] top-[30%]",
    "right-[1%] top-[48%]",
    "left-[0%] top-[42%]",
    "right-[2%] top-[66%]",
    "left-[0%] top-[28%]",
    "left-[3%] top-[61%]",
  ];

  return (
    <div className="relative min-h-[680px] overflow-hidden rounded-[2rem] border border-[#c8a030]/20 bg-[radial-gradient(circle_at_50%_40%,rgba(23,143,190,0.18),transparent_46%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 shadow-[0_0_100px_rgba(33,150,243,0.10)]">
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-black/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100 backdrop-blur">
        <ScanLine size={13} className="mr-2 inline" /> Palm Scan Complete
      </div>

      <div className="relative mx-auto mt-10 aspect-[4/5] max-h-[560px] max-w-[470px] overflow-hidden rounded-[42%]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }} className="absolute left-[15%] top-[15%] h-[70%] w-[70%] rounded-full border border-dashed border-[#c8a030]/18" />
        <motion.div animate={{ y: [0, 450, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[24%] right-[24%] z-30 h-px bg-cyan-200/80 shadow-[0_0_30px_8px_rgba(90,220,255,0.25)]" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Your palm" className="absolute inset-0 h-full w-full object-cover opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

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
                style={{ filter: `drop-shadow(0 0 5px ${def.color})` }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.96 }}
                transition={{ duration: 1.3, delay: 0.2 + i * 0.18, ease: "easeInOut" }}
              />
            );
          })}
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto h-24 max-w-[520px] rounded-[100%] border border-cyan-300/20 bg-cyan-300/10 blur-[1px]" />

      {report.mounts.slice(0, 8).map((mount, i) => (
        <motion.div
          key={mount.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.06 }}
          className={`absolute z-30 hidden w-40 rounded-2xl border border-white/12 bg-black/55 p-3 text-left backdrop-blur-xl xl:block ${calloutSlots[i]}`}
        >
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/45">{mount.name}</div>
          <div className="mt-1 text-2xl font-bold text-cyan-200">{mount.score}%</div>
          <p className="mt-1 text-[10px] leading-relaxed text-white/55">{mount.keywords}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ScoreStrip({ report }: { report: PalmistryReport }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
      {report.scoreboard.slice(0, 7).map((score, i) => {
        const Icon = SCORE_ICONS[i] ?? Star;
        const tone = i % 3 === 0 ? "#f6c15a" : i % 3 === 1 ? "#53e7ff" : "#c45cff";
        return (
          <GlassCard key={score.label} className="p-4" delay={i * 0.04}>
            <div className="flex items-center justify-between">
              <Icon size={17} style={{ color: tone }} />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">/100</span>
            </div>
            <div className="mt-3 font-serif text-4xl font-light" style={{ color: tone }}>{score.value}</div>
            <div className="mt-1 text-sm text-white/75">{score.label}</div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: tone }}
                initial={{ width: 0 }}
                whileInView={{ width: `${score.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

function AskPalmPanel({ report }: { report: PalmistryReport }) {
  const questions = [
    "Why do I overthink?",
    "Which career suits me?",
    "Am I good for business?",
    "What is my relationship pattern?",
    "What should I improve first?",
  ];
  const [question, setQuestion] = useState(questions[0]);
  const career = report.predictions.find((p) => /career|finance/i.test(p.title));
  const relationship = report.predictions.find((p) => /love|relationship/i.test(p.title));
  const personality = report.predictions.find((p) => /personality|trait/i.test(p.title));

  const answer = useMemo(() => {
    const q = question.toLowerCase();
    if (q.includes("business") || q.includes("career")) return career?.aiInsight || career?.summary || report.overallImpression.summary;
    if (q.includes("relationship")) return relationship?.aiInsight || relationship?.summary || report.overallImpression.summary;
    if (q.includes("improve")) return report.growthPlan[0] || report.finalIntelligenceScore.summary;
    return personality?.aiInsight || personality?.summary || report.overallImpression.headline;
  }, [career, personality, question, relationship, report]);

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center gap-3">
        <MessageCircle className="text-cyan-200" size={18} />
        <h3 className="font-serif text-2xl font-bold text-white">Ask Your Palm</h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {questions.map((q) => (
          <button key={q} type="button" onClick={() => setQuestion(q)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60 hover:text-white">
            {q}
          </button>
        ))}
      </div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
      />
      <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-relaxed text-cyan-50/80">{answer}</div>
    </GlassCard>
  );
}

function PalmEvolutionPanel({ report }: { report: PalmistryReport }) {
  const improvements = [
    ["Communication", findScore(report, "Business", 82) - 72],
    ["Confidence", findScore(report, "Leadership", 82) - 74],
    ["Stress Balance", findScore(report, "Health", 78) - 70],
    ["Career Clarity", findScore(report, "Wealth", 80) - 68],
  ];

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center gap-3">
        <RefreshCcw className="text-emerald-300" size={18} />
        <h3 className="font-serif text-2xl font-bold text-white">Palm Evolution</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/55">
        Snapshot comparison is ready in the product grammar: future scans can track confidence, stress, communication and career markers over time.
      </p>
      {improvements.map(([label, raw]) => {
        const delta = Math.max(-20, Math.min(24, Number(raw)));
        return (
          <div key={label} className="mt-4 flex justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm">
            <span className="text-white/70">{label}</span>
            <b className={delta >= 0 ? "text-emerald-300" : "text-amber-300"}>{delta >= 0 ? "+" : ""}{delta}%</b>
          </div>
        );
      })}
    </GlassCard>
  );
}

interface DashboardReportProps {
  report: PalmistryReport;
  preview: string;
}

export function DashboardReport({ report, preview }: DashboardReportProps) {
  const [mode, setMode] = useState<(typeof MODE_DEFS)[number]["id"]>("full");
  const visiblePredictions = useMemo(() => {
    if (mode === "executive") return report.predictions.filter((p) => /career|finance|wealth|purpose|personality/i.test(p.title));
    if (mode === "life") return report.predictions.filter((p) => /love|relationship|health|vitality|personality|purpose/i.test(p.title));
    if (mode === "spiritual") return report.predictions.filter((p) => /purpose|personality|health|vitality/i.test(p.title));
    return report.predictions;
  }, [mode, report.predictions]);

  return (
    <div className="mt-8 space-y-8">
      <PalmReportHeader report={report} />
      <IntelligenceModeBar mode={mode} setMode={setMode} />
      <ScoreStrip report={report} />

      {/* Flagship intelligence dashboard */}
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <GlassCard className="p-5">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e6c869]">
              <Layers3 size={13} /> Palm Overview
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Overall Impression</h3>
            <p className="mt-1 text-sm font-medium text-white/80">{report.overallImpression.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{report.overallImpression.summary}</p>
            <div className="mt-4 space-y-3">
              {report.overallImpression.metrics.map((m, i) => (
                <MetricBar key={m.label} label={m.label} value={m.value} delay={i * 0.1} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.1}>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e6c869]">
              <Brain size={13} /> Finger Intelligence
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Willpower & Skill Map</h3>
            <div className="mt-3 space-y-3">
              {report.fingers.map((f) => (
                <div key={f.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="text-sm font-semibold text-white/85">{f.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {f.keywords.map((k) => (
                      <span key={k} className="rounded-full bg-[#c8a030]/10 px-2 py-0.5 text-[10px] text-[#e6c869]">{k}</span>
                    ))}
                  </div>
                  {f.summary && <p className="mt-1.5 text-xs leading-relaxed text-white/55">{f.summary}</p>}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.12}>
            <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e6c869]">
              <Activity size={13} /> Line Confidence
            </div>
            <div className="space-y-3">
              {report.lines.map((line) => (
                <div key={line.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-white/70">
                      <span className="h-2 w-2 rounded-full" style={{ background: line.color, boxShadow: `0 0 8px ${line.color}` }} />
                      {line.name}
                    </span>
                    <span className="font-semibold text-white/80">{line.confidence}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: line.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${line.confidence}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <CommandPalmScanner preview={preview} report={report} />
          <p className="text-center text-[11px] text-white/40">
            Spatial palm map uses detected geometry first, AI coordinates second, and calibrated fallback only when needed.
          </p>
        </div>

        <div className="space-y-4">
          {visiblePredictions.map((p, i) => (
            <GlassCard key={p.id} className="p-4" delay={i * 0.08}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white/90">{p.title}</h4>
                <span className="text-xs font-semibold text-[#e6c869]">{p.strength}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#c8a030] to-[#e6c869]"
                  initial={{ width: 0 }} whileInView={{ width: `${p.strength}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{p.summary}</p>
              {p.opportunities.length > 0 && (
                <p className="mt-2 text-[11px] text-emerald-300/80"><b>Opportunities:</b> {p.opportunities.join(", ")}</p>
              )}
              {p.warnings.length > 0 && (
                <p className="mt-1 text-[11px] text-amber-300/80"><b>Watch:</b> {p.warnings.join(", ")}</p>
              )}
              {p.aiInsight && (
                <p className="mt-2 rounded-lg bg-[#c8a030]/[0.07] px-2.5 py-1.5 text-[11px] italic text-[#e6c869]/90">✦ {p.aiInsight}</p>
              )}
            </GlassCard>
          ))}

          <GlassCard className="p-4" delay={0.2}>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <ShieldCheck size={13} /> AI Insight
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{report.finalIntelligenceScore.summary}</p>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-3">
            <TimerReset className="text-[#e6c869]" size={18} />
            <h3 className="font-serif text-2xl font-bold text-white">Interactive Timeline</h3>
          </div>
          <div className="mt-5 space-y-3">
            {report.timeline.map((phase) => (
              <div key={phase.range} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <div className="flex items-center justify-between gap-3">
                  <b className="text-sm text-[#e6c869]">{phase.range}</b>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">{phase.title}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/55">{phase.summary}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <AskPalmPanel report={report} />
        <PalmEvolutionPanel report={report} />

        <GlassCard className="p-5 lg:col-span-2" hover={false}>
          <div className="flex items-center gap-3">
            <Compass className="text-cyan-200" size={18} />
            <h3 className="font-serif text-2xl font-bold text-white">Palm vs Kundli Intelligence</h3>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {report.palmKundliCorrelation.matches.slice(0, 3).map((match, i) => (
              <div key={match} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
                <h4 className="text-sm font-semibold text-cyan-100">Alignment {i + 1}</h4>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{match}</p>
              </div>
            ))}
            {report.palmKundliCorrelation.matches.length === 0 && (
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 md:col-span-3">
                <h4 className="text-sm font-semibold text-cyan-100">{report.palmKundliCorrelation.alignmentScore}% Alignment</h4>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{report.palmKundliCorrelation.summary}</p>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-3">
            <Music2 className="text-[#e6c869]" size={18} />
            <h3 className="font-serif text-2xl font-bold text-white">AstroSound</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {report.astroSoundRecommendations[0]?.reason || "Personalized sound recommendations are generated from palm stress, creativity and emotional indicators."}
          </p>
          <div className="mt-5 h-16 rounded-2xl border border-[#c8a030]/20 bg-[repeating-linear-gradient(90deg,rgba(245,190,80,.2)_0_2px,transparent_2px_12px)]" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(report.astroSoundRecommendations[0]?.ragas ?? []).slice(0, 4).map((raga) => (
              <span key={raga} className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-2.5 py-1 text-xs text-[#e6c869]">{raga}</span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Executive intelligence layer */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] border border-[#c8a030]/30 bg-[#c8a030]/10">
              <div className="text-center">
                <div className="font-serif text-5xl font-bold leading-none text-[#e6c869]">{report.finalIntelligenceScore.score}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">{report.finalIntelligenceScore.confidence}% confidence</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Final AI Intelligence Score</div>
              <h3 className="mt-2 font-serif text-2xl font-bold text-white">Human Intelligence Engine</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{report.finalIntelligenceScore.summary}</p>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Pattern-recognition score based on visible geometry, line clarity, mount strength, finger indicators and behavioral intelligence mapping.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Palm Geometry Profile</div>
              <h3 className="mt-2 font-serif text-2xl font-bold text-white">{report.palmGeometry.handType}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{report.palmGeometry.reasoning}</p>
            </div>
            <span className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-xs font-semibold text-[#e6c869]">
              {report.palmGeometry.confidence}% confidence
            </span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["Palm Shape", report.palmGeometry.palmShape],
              ["Finger Ratio", report.palmGeometry.fingerProportion],
              ["Thumb Angle", report.palmGeometry.thumbAngle],
              ["Palm Width", report.palmGeometry.palmWidth],
              ["Palm Length", report.palmGeometry.palmLength],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <div className="text-[10px] uppercase tracking-wider text-white/35">{label}</div>
                <div className="mt-1 text-sm font-medium text-white/80">{value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div>
        <h3 className="mb-4 text-center font-serif text-2xl font-bold text-[#e6c869]">Premium Palm Intelligence Modules</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {report.intelligenceSections.map((section, i) => (
            <IntelligenceCard key={section.id} section={section} delay={i * 0.04} />
          ))}
        </div>
      </div>

      {/* Major lines detailed */}
      <GlassCard className="p-5">
        <h3 className="mb-4 font-serif text-xl font-bold text-[#e6c869]">Major Lines — Detailed Analysis</h3>
        <LineAccordion report={report} />
      </GlassCard>

      {/* Timeline */}
      <GlassCard className="p-5 sm:p-6">
        <h3 className="mb-5 font-serif text-xl font-bold text-[#e6c869]">Life Timeline</h3>
        <div className="relative space-y-5 border-l border-[#c8a030]/25 pl-6">
          {report.timeline.map((t, i) => (
            <motion.div key={t.range} className="relative"
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-[#c8a030] bg-black shadow-[0_0_10px_rgba(200,160,48,0.6)]" />
              <div className="text-sm font-bold text-[#e6c869]">{t.range}</div>
              {t.title && <div className="text-sm font-medium text-white/85">{t.title}</div>}
              <p className="mt-0.5 text-sm leading-relaxed text-white/55">{t.summary}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Luck */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Lucky Numbers", items: report.luck.numbers.map(String) },
          { label: "Lucky Days", items: report.luck.days },
          { label: "Lucky Colors", items: report.luck.colors },
          { label: "Lucky Gemstones", items: report.luck.gemstones },
          { label: "Lucky Directions", items: report.luck.directions },
          { label: "Lucky Career Fields", items: report.luck.careerFields },
        ].map((l, i) => (
          <GlassCard key={l.label} className="p-4" delay={i * 0.06}>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/45">{l.label}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {l.items.map((it) => (
                <span key={it} className="rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-2.5 py-1 text-xs font-medium text-[#e6c869]">{it}</span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Scoreboard */}
      <GlassCard className="p-6">
        <h3 className="mb-6 text-center font-serif text-xl font-bold text-[#e6c869]">AI Scoreboard</h3>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
          {report.scoreboard.map((s, i) => (
            <RadialScore key={s.label} label={s.label} value={s.value} delay={i * 0.08} />
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">Palm + Kundli</div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <h3 className="font-serif text-xl font-bold text-white">Correlation Engine</h3>
            <span className="rounded-2xl border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-2 font-serif text-2xl font-bold text-[#e6c869]">
              {report.palmKundliCorrelation.alignmentScore}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{report.palmKundliCorrelation.summary}</p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">AstroSound</div>
          <h3 className="mt-3 font-serif text-xl font-bold text-white">Personal Sound Profile</h3>
          <div className="mt-4 space-y-2">
            {report.astroSoundRecommendations.slice(0, 2).map((item) => (
              <div key={item.title} className="rounded-xl border border-white/8 bg-white/[0.03] p-2">
                <div className="text-xs font-semibold text-white/85">{item.title}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.ragas.slice(0, 3).map((raga) => <span key={raga} className="rounded-full bg-[#c8a030]/10 px-2 py-0.5 text-[9px] text-[#e6c869]">{raga}</span>)}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6c869]">AI Growth Plan</div>
          <h3 className="mt-3 font-serif text-xl font-bold text-white">Next 30 Days</h3>
          <div className="mt-3 space-y-2">
            {report.growthPlan.slice(0, 3).map((item, i) => (
              <div key={item} className="flex gap-2 text-xs text-white/65">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c8a030]/15 text-[9px] font-bold text-[#e6c869]">{i + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Advanced insights */}
      {report.advancedInsights.length > 0 && (
        <div>
          <h3 className="mb-4 text-center font-serif text-2xl font-bold text-[#e6c869]">AstroLife Advanced Intelligence</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {report.advancedInsights.map((a, i) => (
              <GlassCard key={a.title} className="p-4" delay={i * 0.05}>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#e6c869]" />
                  <h4 className="text-sm font-bold text-white/90">{a.title}</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{a.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* disclaimer */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
        <p className="text-[11px] leading-relaxed text-white/40">{report.meta.disclaimer}</p>
      </div>
    </div>
  );
}
