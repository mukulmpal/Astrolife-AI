"use client";

import { motion } from "framer-motion";
import { type PalmistryReport } from "@/lib/astro-engine/palmistry-engine";

function ManuscriptCard({
  children, className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border-2 border-[#c8a030] bg-[#0f0d1a]/40 p-6 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 border-b border-[#c8a030]/40 pb-4 text-center font-serif text-2xl font-bold text-[#e6c869]">
      {children}
    </h2>
  );
}

interface ManuscriptReportProps {
  report: PalmistryReport;
  preview: string;
}

export function ManuscriptReport({ report, preview }: ManuscriptReportProps) {
  return (
    <div className="mx-auto mt-8 max-w-2xl">
      {/* Gold border frame */}
      <div className="rounded-2xl border-8 border-[#c8a030] bg-gradient-to-b from-black/80 via-black/60 to-black/80 p-6 shadow-[0_0_40px_rgba(200,160,48,0.3)] sm:p-8">
        {/* Title section - "The Map of You" */}
        <div className="mb-8 border-b-2 border-[#c8a030]/40 pb-8 text-center">
          <div className="mb-4 font-serif text-sm uppercase tracking-[0.3em] text-[#c8a030]">A Personal Journey</div>
          <h1 className="mb-2 font-serif text-4xl font-bold leading-tight text-[#e6c869] sm:text-5xl">
            The Map of You
          </h1>
          <p className="font-serif text-lg italic text-white/50">A Classical Palmistry Reading</p>
          <p className="mt-4 text-xs text-white/40">Analyzed by AstroLife AI</p>
        </div>

        {/* Palm preview - centered and prominent */}
        <div className="mb-8 flex justify-center">
          <div className="h-64 w-48 overflow-hidden rounded-lg border border-[#c8a030]/50 shadow-[0_0_30px_rgba(200,160,48,0.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Your palm" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Overall impression - manuscript style */}
        <ManuscriptCard className="mb-8 border-[#c8a030]/70 bg-[#1a1625]/50">
          <h2 className="mb-3 font-serif text-2xl font-bold text-[#e6c869]">Your Story</h2>
          <p className="mb-4 font-serif text-lg leading-relaxed text-white/90">{report.overallImpression.headline}</p>
          <p className="italic leading-relaxed text-white/70">{report.overallImpression.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {report.overallImpression.metrics.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{m.label}</span>
                  <span className="font-semibold text-[#e6c869]">{m.value}%</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#c8a030] to-[#e6c869]"
                    initial={{ width: 0 }} whileInView={{ width: `${m.value}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
                </div>
              </div>
            ))}
          </div>
        </ManuscriptCard>

        {/* Life path insights — all six lines */}
        <div className="mb-8 space-y-6">
          <SectionHeading>Life&apos;s Pathways</SectionHeading>
          {report.lines.map((line) => (
            <ManuscriptCard key={line.id} className="border-[#c8a030]/60">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="mt-2 h-3 w-3 rounded-full" style={{ background: line.color, boxShadow: `0 0 12px ${line.color}` }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-[#e6c869]">{line.name}</h3>
                  <p className="mb-2 text-xs text-white/50">{line.sanskrit}</p>
                  <p className="leading-relaxed text-white/75">{line.detail || line.summary}</p>
                  <div className="mt-3 text-xs text-white/50">Clarity: <span className="font-semibold text-[#e6c869]">{line.confidence}%</span></div>
                </div>
              </div>
            </ManuscriptCard>
          ))}
        </div>

        {/* Planetary mounts */}
        <div className="mb-8">
          <SectionHeading>The Planetary Mounts</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.mounts.map((m) => (
              <div key={m.id} className="rounded-lg border border-[#c8a030]/40 bg-[#0f0d1a]/40 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-white">{m.name.replace("Mount of ", "")}</h4>
                  <span className="font-serif text-lg font-bold text-[#e6c869]">{m.score}%</span>
                </div>
                {m.keywords && <p className="mt-1 text-xs italic text-white/50">{m.keywords}</p>}
                {m.summary && <p className="mt-2 text-sm leading-relaxed text-white/70">{m.summary}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Predictions - elegant cards */}
        <div className="mb-8">
          <SectionHeading>What Awaits You</SectionHeading>
          <div className="space-y-4">
            {report.predictions.map((p) => (
              <ManuscriptCard key={p.id} className="border-[#c8a030]/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">{p.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{p.summary}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-serif text-2xl font-bold text-[#e6c869]">{p.strength}%</div>
                    <div className="text-xs text-white/40">Strength</div>
                  </div>
                </div>
              </ManuscriptCard>
            ))}
          </div>
        </div>

        {/* Deeper chapters — intelligence sections */}
        <div className="mb-8">
          <SectionHeading>Deeper Chapters</SectionHeading>
          <div className="space-y-4">
            {report.intelligenceSections.map((s) => (
              <div key={s.id} className="rounded-lg border border-[#c8a030]/40 bg-[#0f0d1a]/40 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-serif text-lg font-bold text-[#e6c869]">{s.title}</h4>
                  <span className="whitespace-nowrap text-xs text-white/45">{s.score} · {s.confidence}% conf</span>
                </div>
                <p className="mt-2 leading-relaxed text-white/75">{s.interpretation}</p>
                <p className="mt-2 text-sm italic leading-relaxed text-white/55">{s.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline - elegant vertical */}
        <div className="mb-8">
          <SectionHeading>Your Life Journey</SectionHeading>
          <div className="space-y-4">
            {report.timeline.map((t, i) => (
              <motion.div
                key={t.range}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="whitespace-nowrap font-serif text-sm font-bold text-[#e6c869]">{t.range}</div>
                <div className="flex-1 border-l border-[#c8a030]/40 py-2 pl-6">
                  {t.title && <div className="mb-1 font-semibold text-white">{t.title}</div>}
                  <p className="text-sm text-white/70">{t.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lucky elements - manuscript footer */}
        <ManuscriptCard className="mb-8 border-[#c8a030]/60 bg-[#1a1625]/50">
          <h2 className="mb-4 text-center font-serif text-xl font-bold text-[#e6c869]">Fortune&apos;s Blessings</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2 font-semibold text-[#e6c869]">Lucky Numbers</p>
              <p className="text-white/70">{report.luck.numbers.join(", ")}</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-[#e6c869]">Lucky Days</p>
              <p className="text-white/70">{report.luck.days.join(", ")}</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-[#e6c869]">Lucky Colors</p>
              <p className="text-white/70">{report.luck.colors.join(", ")}</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-[#e6c869]">Lucky Gemstones</p>
              <p className="text-white/70">{report.luck.gemstones.join(", ")}</p>
            </div>
          </div>
        </ManuscriptCard>

        {/* Closing note */}
        <div className="border-t-2 border-[#c8a030]/40 pt-8 text-center">
          <p className="mb-4 font-serif text-sm italic leading-relaxed text-white/60">
            This reading represents a moment in time. Your palm, like your life, continues to evolve with your choices and growth.
          </p>
          <p className="font-serif text-xs tracking-[0.2em] text-[#e6c869]">ASTROLIFE AI PALM INTELLIGENCE</p>
        </div>
      </div>
    </div>
  );
}
