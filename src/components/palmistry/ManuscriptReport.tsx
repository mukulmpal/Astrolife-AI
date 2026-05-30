"use client";

import { motion } from "framer-motion";
import { BookOpen, Feather, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { type PalmistryReport } from "@/lib/astro-engine/palmistry-engine";

function Page({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-[#8b6134]/30 bg-[#d8c09d] p-6 text-[#2b2118] shadow-inner sm:p-8 ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(90deg, rgba(70,45,25,.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative">{children}</div>
    </div>
  );
}

function DarkPage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-[#c8a030]/25 bg-[linear-gradient(135deg,#120d08,#2c2117)] p-6 text-amber-50 shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-8 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(230,200,105,.18),transparent_42%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function ChapterTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.32em] opacity-55">{kicker}</div>
      <h2 className="mt-2 font-serif text-3xl leading-tight">{title}</h2>
      <div className="mx-auto mt-4 h-px w-32 bg-current opacity-25" />
    </div>
  );
}

function InkScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#5b3b20]/20 bg-[#efdcb9]/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] opacity-60">{label}</span>
        <b className="font-serif text-2xl">{value}</b>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#5b3b20]/15">
        <motion.div
          className="h-full rounded-full bg-[#5b3b20]"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        />
      </div>
    </div>
  );
}

interface ManuscriptReportProps {
  report: PalmistryReport;
  preview: string;
}

export function ManuscriptReport({ report, preview }: ManuscriptReportProps) {
  return (
    <div className="mx-auto mt-8 max-w-7xl">
      <div className="rounded-[2.5rem] border border-[#c8a030]/25 bg-[#160f0a] p-3 shadow-[0_40px_140px_rgba(0,0,0,.55)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <DarkPage className="min-h-[720px]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#c8a030]/40 bg-[#c8a030]/10">
              <Sparkles className="text-[#e6c869]" size={24} />
            </div>
            <p className="mt-8 text-center text-[10px] uppercase tracking-[0.45em] text-[#e6c869]/70">AstroLife Manuscript</p>
            <h1 className="mt-5 text-center font-serif text-5xl leading-none text-[#f5e7b8] sm:text-6xl">The Map of You</h1>
            <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-amber-100/55">
              A luxury palm intelligence manuscript translating visible hand patterns into personality, love, wealth, timing and inner-growth themes.
            </p>

            <div className="mx-auto mt-10 max-w-sm overflow-hidden rounded-[40%] border border-[#c8a030]/35 bg-black/30 shadow-[0_0_45px_rgba(200,160,48,.2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Your palm" className="aspect-[4/5] h-full w-full object-cover sepia-[.35] saturate-[.85]" />
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Final Score", report.finalIntelligenceScore.score],
                ["Confidence", report.finalIntelligenceScore.confidence],
                ["Kundli Align", report.palmKundliCorrelation.alignmentScore],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#c8a030]/20 bg-black/25 p-4 text-center">
                  <div className="font-serif text-3xl text-[#e6c869]">{value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-amber-100/45">{label}</div>
                </div>
              ))}
            </div>
          </DarkPage>

          <Page className="min-h-[720px]">
            <ChapterTitle kicker="Chapter One" title="Your Human Blueprint" />
            <p className="mx-auto max-w-xl text-center text-base leading-8 opacity-80">{report.overallImpression.summary}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {report.overallImpression.metrics.map((metric) => (
                <InkScore key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {report.lines.map((line) => (
                <div key={line.id} className="rounded-2xl border border-[#5b3b20]/20 bg-[#efddc1]/55 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl">{line.name}</h3>
                      <p className="text-xs opacity-55">{line.sanskrit}</p>
                    </div>
                    <b className="font-serif text-xl">{line.confidence}%</b>
                  </div>
                  <p className="mt-3 text-sm leading-6 opacity-75">{line.detail || line.summary}</p>
                </div>
              ))}
            </div>
          </Page>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Page>
            <ChapterTitle kicker="Chapter Two" title="Planetary Mounts & Life Timing" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {report.mounts.map((mount) => (
                <div key={mount.id} className="rounded-2xl border border-[#5b3b20]/20 bg-[#efddc1]/55 p-4">
                  <div className="font-serif text-lg">{mount.name.replace("Mount of ", "")}</div>
                  <div className="mt-1 font-serif text-3xl">{mount.score}</div>
                  <p className="mt-2 text-xs leading-5 opacity-65">{mount.keywords}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {report.timeline.map((phase, i) => (
                <motion.div
                  key={phase.range}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-[#5b3b20]/20 bg-[#efddc1]/45 p-4"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.16em] opacity-55">{phase.range}</div>
                  <h4 className="mt-2 font-serif text-lg">{phase.title}</h4>
                  <p className="mt-2 text-xs leading-5 opacity-70">{phase.summary}</p>
                </motion.div>
              ))}
            </div>
          </Page>

          <DarkPage>
            <ChapterTitle kicker="Chapter Three" title="Royal Guidance" />
            <div className="space-y-4">
              {report.predictions.map((prediction) => (
                <div key={prediction.id} className="rounded-2xl border border-[#c8a030]/20 bg-black/25 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-xl text-[#f5e7b8]">{prediction.title}</h3>
                    <b className="font-serif text-2xl text-[#e6c869]">{prediction.strength}</b>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-amber-100/60">{prediction.summary}</p>
                </div>
              ))}
            </div>
          </DarkPage>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <DarkPage>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-300" />
              <h3 className="font-serif text-2xl text-[#f5e7b8]">Palm + Kundli</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-amber-100/60">{report.palmKundliCorrelation.summary}</p>
            <div className="mt-5 font-serif text-5xl text-[#e6c869]">{report.palmKundliCorrelation.alignmentScore}</div>
          </DarkPage>

          <Page>
            <div className="flex items-center gap-3">
              <Gem />
              <h3 className="font-serif text-2xl">Fortune Notes</h3>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div><b>Numbers</b><p>{report.luck.numbers.join(", ")}</p></div>
              <div><b>Days</b><p>{report.luck.days.join(", ")}</p></div>
              <div><b>Colors</b><p>{report.luck.colors.join(", ")}</p></div>
              <div><b>Gemstones</b><p>{report.luck.gemstones.join(", ")}</p></div>
            </div>
          </Page>

          <DarkPage>
            <div className="flex items-center gap-3">
              <Feather className="text-[#e6c869]" />
              <h3 className="font-serif text-2xl text-[#f5e7b8]">Growth Plan</h3>
            </div>
            <div className="mt-4 space-y-3">
              {report.growthPlan.slice(0, 4).map((item, i) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-amber-100/65">
                  <span className="font-serif text-[#e6c869]">{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </DarkPage>
        </div>

        <div className="mt-5 rounded-[2rem] border border-[#c8a030]/20 bg-black/25 p-5 text-center">
          <BookOpen className="mx-auto text-[#e6c869]" size={18} />
          <p className="mt-3 text-xs leading-relaxed text-amber-100/45">{report.meta.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
