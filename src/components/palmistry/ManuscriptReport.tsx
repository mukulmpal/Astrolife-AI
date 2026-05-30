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

interface ManuscriptReportProps {
  report: PalmistryReport;
  preview: string;
}

export function ManuscriptReport({ report, preview }: ManuscriptReportProps) {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      {/* Gold border frame */}
      <div className="border-8 border-[#c8a030] rounded-2xl p-8 bg-gradient-to-b from-black/80 via-black/60 to-black/80 shadow-[0_0_40px_rgba(200,160,48,0.3)]">
        {/* Title section - "The Map of You" */}
        <div className="text-center border-b-2 border-[#c8a030]/40 pb-8 mb-8">
          <div className="text-[#c8a030] text-sm tracking-[0.3em] uppercase font-serif mb-4">A Personal Journey</div>
          <h1 className="font-serif text-5xl font-bold text-[#e6c869] mb-2 leading-tight">
            The Map of You
          </h1>
          <p className="text-white/50 font-serif text-lg italic">A Classical Palmistry Reading</p>
          <p className="text-white/40 text-xs mt-4">Analyzed by AstroLife AI</p>
        </div>

        {/* Palm preview - centered and prominent */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-64 rounded-lg border border-[#c8a030]/50 overflow-hidden shadow-[0_0_30px_rgba(200,160,48,0.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Your palm" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Overall impression - manuscript style */}
        <ManuscriptCard className="mb-8 border-[#c8a030]/70 bg-[#1a1625]/50">
          <h2 className="font-serif text-2xl font-bold text-[#e6c869] mb-3">Your Story</h2>
          <p className="text-white/90 leading-relaxed mb-4 font-serif text-lg">{report.overallImpression.headline}</p>
          <p className="text-white/70 leading-relaxed italic">{report.overallImpression.summary}</p>
        </ManuscriptCard>

        {/* Life path insights */}
        <div className="space-y-6 mb-8">
          <h2 className="font-serif text-2xl font-bold text-[#e6c869] text-center border-b border-[#c8a030]/40 pb-4">Life&apos;s Pathways</h2>

          {/* Major lines - elegant layout */}
          {report.lines.slice(0, 3).map((line) => (
            <ManuscriptCard key={line.id} className="border-[#c8a030]/60">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 rounded-full mt-2" style={{ background: line.color, boxShadow: `0 0 12px ${line.color}` }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-[#e6c869]">{line.name}</h3>
                  <p className="text-xs text-white/50 mb-2">{line.sanskrit}</p>
                  <p className="text-white/75 leading-relaxed">{line.detail || line.summary}</p>
                  <div className="mt-3 text-xs text-white/50">Clarity: <span className="text-[#e6c869] font-semibold">{line.confidence}%</span></div>
                </div>
              </div>
            </ManuscriptCard>
          ))}
        </div>

        {/* Predictions - elegant cards */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-[#e6c869] text-center border-b border-[#c8a030]/40 pb-4 mb-6">What Awaits You</h2>
          <div className="space-y-4">
            {report.predictions.slice(0, 4).map((p) => (
              <ManuscriptCard key={p.id} className="border-[#c8a030]/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">{p.title}</h4>
                    <p className="text-white/70 leading-relaxed text-sm mt-2">{p.summary}</p>
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

        {/* Timeline - elegant vertical */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-[#e6c869] text-center border-b border-[#c8a030]/40 pb-4 mb-6">Your Life Journey</h2>
          <div className="space-y-4">
            {report.timeline.map((t, i) => (
              <motion.div
                key={t.range}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="text-[#e6c869] font-serif text-sm font-bold whitespace-nowrap">{t.range}</div>
                <div className="flex-1 border-l border-[#c8a030]/40 pl-6 py-2">
                  {t.title && <div className="font-semibold text-white mb-1">{t.title}</div>}
                  <p className="text-sm text-white/70">{t.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lucky elements - manuscript footer */}
        <ManuscriptCard className="border-[#c8a030]/60 bg-[#1a1625]/50 mb-8">
          <h2 className="font-serif text-xl font-bold text-[#e6c869] mb-4 text-center">Fortune&apos;s Blessings</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#e6c869] font-semibold mb-2">Lucky Numbers</p>
              <p className="text-white/70">{report.luck.numbers.join(", ")}</p>
            </div>
            <div>
              <p className="text-[#e6c869] font-semibold mb-2">Lucky Days</p>
              <p className="text-white/70">{report.luck.days.join(", ")}</p>
            </div>
            <div>
              <p className="text-[#e6c869] font-semibold mb-2">Lucky Colors</p>
              <p className="text-white/70">{report.luck.colors.join(", ")}</p>
            </div>
            <div>
              <p className="text-[#e6c869] font-semibold mb-2">Lucky Gemstones</p>
              <p className="text-white/70">{report.luck.gemstones.join(", ")}</p>
            </div>
          </div>
        </ManuscriptCard>

        {/* Closing note */}
        <div className="text-center border-t-2 border-[#c8a030]/40 pt-8">
          <p className="font-serif text-white/60 italic text-sm leading-relaxed mb-4">
            This reading represents a moment in time. Your palm, like your life, continues to evolve with your choices and growth.
          </p>
          <p className="text-[#e6c869] font-serif text-xs tracking-[0.2em]">ASTROLIFE AI PALM INTELLIGENCE</p>
        </div>
      </div>
    </div>
  );
}
