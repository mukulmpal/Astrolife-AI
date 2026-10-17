"use client";

import React from "react";
import type { VargaNeuroKarmicProfile } from "@/lib/astro-intelligence/varga-neuro-remedies-engine";

interface VargaNeuroKarmicCardsProps {
  profile: VargaNeuroKarmicProfile;
  className?: string;
}

export function VargaNeuroKarmicCards({ profile, className = "" }: VargaNeuroKarmicCardsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* ── CARD 1: NATAL D1 INTEGRATED SHASTRIC NARRATIVE ── */}
      <div className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.28)] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
          <span className="text-[10px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]">
            ✦ Natal D1 Integrated Shastric Narrative
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)] font-semibold">
            {profile.vargaKey} Lagna: {profile.vargaLagna}
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-[#1A1A1A] mb-2 leading-tight">
          {profile.deepExplanation.title}
        </h2>
        
        <div className="text-xs text-[#8C6D1F] font-semibold mb-4 tracking-wide flex items-center gap-1.5">
          <span>🏛️</span>
          <span>{profile.natalLagnaRelation}</span>
        </div>

        <div className="space-y-3.5">
          {profile.deepExplanation.paragraphs.map((p, idx) => (
            <p key={idx} className="text-[13.5px] sm:text-sm text-[#3D3834] leading-[1.85] m-0">
              {p}
            </p>
          ))}
        </div>

        {profile.deepExplanation.keyHighlights.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-5 pt-3.5 border-t border-[rgba(184,134,11,0.15)]">
            <span className="text-[11px] uppercase tracking-wider text-[#B8860B] font-bold">Key Signatures:</span>
            {profile.deepExplanation.keyHighlights.map((kh, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-[#FAF5EB] text-[#1A1A1A] border border-[rgba(184,134,11,0.25)] font-medium"
              >
                {kh}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── CARD 2: VARGA KARMIC WEAKNESS & SUBCONSCIOUS BOTTLENECK ── */}
      <div
        className={`bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-all ${
          profile.karmicWeakness.hasAffliction
            ? "border-[rgba(220,38,38,0.28)]"
            : "border-[rgba(184,134,11,0.28)]"
        }`}
      >
        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
          <span
            className={`text-[10px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full border ${
              profile.karmicWeakness.hasAffliction
                ? "bg-[rgba(220,38,38,0.1)] text-[#DC2626] border-[rgba(220,38,38,0.3)]"
                : "bg-[rgba(184,134,11,0.1)] text-[#B8860B] border-[rgba(184,134,11,0.3)]"
            }`}
          >
            ⚠️ Varga Karmic Weakness &amp; Subconscious Bottleneck
          </span>
          {profile.karmicWeakness.afflictedPlanets.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[rgba(220,38,38,0.08)] text-[#DC2626] font-bold">
              Afflicted: {profile.karmicWeakness.afflictedPlanets.join(", ")}
            </span>
          )}
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2 leading-tight">
          {profile.karmicWeakness.psychologicalBottleneckTitle}
        </h3>

        <div className="p-3.5 rounded-xl bg-[rgba(220,38,38,0.04)] border border-[rgba(220,38,38,0.15)] mb-3.5">
          <div className="text-xs sm:text-[13px] text-[#DC2626] font-medium leading-relaxed">
            {profile.karmicWeakness.frictionSummary}
          </div>
        </div>

        <p className="text-[13.5px] sm:text-sm text-[#3D3834] leading-[1.85] mb-4">
          {profile.karmicWeakness.psychologicalBottleneckDesc}
        </p>

        {/* Ancestral DNA Kula Karma Imprint */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.22)]">
          <div className="text-[11px] uppercase tracking-wider text-[#B8860B] font-bold mb-1.5 flex items-center gap-1.5">
            <span>🧬</span>
            <span>Ancestral DNA &amp; Kula Karma Pattern:</span>
          </div>
          <p className="text-xs sm:text-[13px] text-[#4A4238] leading-relaxed m-0 font-medium">
            {profile.karmicWeakness.ancestralLineagePattern}
          </p>
        </div>
      </div>

      {/* ── CARD 3: SCIENTIFIC & DNA-BASED NEURO-REMEDY PROTOCOL ── */}
      <div className="bg-[#FFFFFF] border border-[rgba(34,197,94,0.3)] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
          <span className="text-[10px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(34,197,94,0.12)] text-[#16A34A] border border-[rgba(34,197,94,0.3)]">
            🧬 Scientific &amp; DNA-Based Neuro-Remedy Protocol
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.2)] font-semibold">
            Daily Behavioral Re-Wiring
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-4 leading-tight">
          Neuro-Somatic &amp; Generational Loop Reset for {profile.vargaKey} ({profile.vargaName})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Ancestral Interruption */}
          <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] border-l-4 border-l-[#B8860B] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#B8860B] mb-1">
                Step 1 · Ancestral Interruption
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] mb-2">
                Generational Loop Break
              </div>
              <div className="text-xs sm:text-[12.5px] text-[#4A4238] leading-relaxed">
                {profile.neuroRemedy.ancestralLoopInterruption}
              </div>
            </div>
          </div>

          {/* Step 2: Cognitive Re-Wiring */}
          <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] border-l-4 border-l-[#2563EB] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#2563EB] mb-1">
                Step 2 · Cognitive Re-Wiring
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] mb-2">
                {profile.neuroRemedy.cognitiveRewiring.techniqueName}
              </div>
              <div className="text-xs sm:text-[12.5px] text-[#4A4238] leading-relaxed">
                {profile.neuroRemedy.cognitiveRewiring.mindsetProtocol}
              </div>
            </div>
            <div className="mt-3 text-[10px] text-[#6B635B] bg-white/70 px-2 py-1 rounded border border-[rgba(184,134,11,0.15)]">
              Target: {profile.neuroRemedy.cognitiveRewiring.distortionLabel}
            </div>
          </div>

          {/* Step 3: Somatic Behavioral Habit */}
          <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] border-l-4 border-l-[#16A34A] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#16A34A] mb-1">
                Step 3 · Somatic Protocol
              </div>
              <div className="text-sm font-bold text-[#1A1A1A] mb-2">
                {profile.neuroRemedy.somaticBehavioralHabit.habitName}
              </div>
              <div className="text-xs sm:text-[12.5px] text-[#1A1A1A] font-medium leading-relaxed mb-2">
                {profile.neuroRemedy.somaticBehavioralHabit.dailyProtocol}
              </div>
            </div>
            <div className="text-[10.5px] text-[#6B635B] leading-tight mt-2 pt-2 border-t border-[rgba(184,134,11,0.15)]">
              Biomarker: {profile.neuroRemedy.somaticBehavioralHabit.neuroMechanism}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

