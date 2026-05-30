"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import {
  type PalmistryReport,
  PALM_LINES,
  FALLBACK_LINE_POINTS,
  FALLBACK_MOUNT_POS,
  buildLinePath,
  mirrorX,
} from "@/lib/astro-engine/palmistry-engine";

const GOLD = "#c8a030";

function GlassCard({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
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

function PalmScanner({
  src, report,
}: { src: string; report: PalmistryReport | null }) {
  const [aspect, setAspect] = useState(3 / 3.6);
  const lineById = useMemo(
    () => new Map<string, PalmistryReport["lines"][number]>(report?.lines.map((l) => [l.id as string, l]) ?? []),
    [report]
  );
  const mirror = report?.meta.hand === "left";

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-[#c8a030]/30 bg-black shadow-[0_0_60px_-15px_rgba(200,160,48,0.5)]"
      style={{ aspectRatio: String(aspect) }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,160,48,0.18),transparent_60%)]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Your palm"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight);
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke={GOLD} strokeWidth="0.15" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke={GOLD} strokeWidth="0.15" />
        ))}
      </svg>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
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
              strokeWidth={0.9}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: `drop-shadow(0 0 4px ${def.color})` }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.95 }}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.25, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {report && report.mounts.map((m, i) => {
        const fallback = FALLBACK_MOUNT_POS[m.id];
        const pos = m.pos ?? (fallback ? mirrorX(fallback, mirror) : undefined);
        if (!pos) return null;
        return (
          <motion.div
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={{
              opacity: { delay: 1.6 + i * 0.1 },
              scale: { delay: 1.6 + i * 0.1 },
              y: { duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div className="whitespace-nowrap rounded-full border border-[#c8a030]/40 bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-[#e6c869] backdrop-blur">
              {m.name.replace("Mount of ", "").replace(" / Apollo", "")} · {m.score}%
            </div>
          </motion.div>
        );
      })}
    </div>
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

interface DashboardReportProps {
  report: PalmistryReport;
  preview: string;
}

export function DashboardReport({ report, preview }: DashboardReportProps) {
  return (
    <div className="mt-8 space-y-8">
      {/* Top 3-column */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1fr]">
        {/* Left: overall + fingers */}
        <div className="space-y-6">
          <GlassCard className="p-5">
            <h3 className="font-serif text-lg font-bold text-[#e6c869]">Overall Impression</h3>
            <p className="mt-1 text-sm font-medium text-white/80">{report.overallImpression.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{report.overallImpression.summary}</p>
            <div className="mt-4 space-y-3">
              {report.overallImpression.metrics.map((m, i) => (
                <MetricBar key={m.label} label={m.label} value={m.value} delay={i * 0.1} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.1}>
            <h3 className="font-serif text-lg font-bold text-[#e6c869]">Finger Analysis</h3>
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
        </div>

        {/* Center: scanner */}
        <div className="space-y-4">
          <PalmScanner src={preview} report={report} />
          <p className="text-center text-[11px] text-white/40">
            {report.meta.hand} hand · image quality: {report.meta.imageQuality}
          </p>
        </div>

        {/* Right: prediction cards */}
        <div className="space-y-4">
          {report.predictions.map((p, i) => (
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
        </div>
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
