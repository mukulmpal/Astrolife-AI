"use client";

import React from "react";
import type { VargaNeuroKarmicProfile } from "@/lib/astro-intelligence/varga-neuro-remedies-engine";

interface VargaNeuroKarmicCardsProps {
  profile: VargaNeuroKarmicProfile;
  className?: string;
}

export function VargaNeuroKarmicCards({ profile, className = "" }: VargaNeuroKarmicCardsProps) {
  const isD3 = profile.vargaKey === "D3";
  const isD9 = profile.vargaKey === "D9";
  const kharesh = profile.latentPoints?.kharesh22ndDrekkana;
  const sixtyFourth = profile.latentPoints?.sixtyFourthNavamsha;
  const pushkars = profile.latentPoints?.pushkarNavamshas;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ── CARD 1: NATAL D1 INTEGRATED SHASTRIC NARRATIVE ── */}
      <div className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.28)] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]">
              ✦ Natal D1 Integrated Shastric Narrative
            </span>
            {profile.deityArchetype && (
              <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.25)] font-semibold flex items-center gap-1">
                <span>⚡ Adhidevata:</span>
                <strong>{profile.deityArchetype.name}</strong>
              </span>
            )}
          </div>
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

        {/* Pushkar Navamshas Banner (if any) */}
        {pushkars && pushkars.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
            <span className="text-emerald-600 text-base leading-none mt-0.5">✨</span>
            <div>
              <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                Pushkar Navamsha Regenerative Grace Active
              </div>
              <div className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                {pushkars.map((pk) => `${pk.planet} in ${pk.navamshaSign}`).join(" · ")} — Endowed with self-regenerating neuroplasticity; converts severe challenges into breakthrough resilience.
              </div>
            </div>
          </div>
        )}

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

        {/* Specialized Critical Karmic Points (Kharesh in D3, 64th Navamsha in D9) */}
        {isD3 && kharesh && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="text-[11px] uppercase tracking-wider text-amber-900 font-bold mb-1 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>22nd Drekkana (Kharesh) — Hereditary Epigenetic Organ Vulnerability:</span>
            </div>
            <div className="text-xs sm:text-[12.5px] text-[#4A4238] leading-relaxed mb-1.5 font-medium">
              Lord: <strong>{kharesh.planet}</strong> in <strong>{kharesh.sign}</strong> (House 8).
              Affects: {kharesh.organSystem}.
            </div>
            <div className="text-[11.5px] text-amber-800 bg-white/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
              <strong>Somatic Preventive Protocol:</strong> {kharesh.somaticProtocol}
            </div>
          </div>
        )}

        {isD9 && sixtyFourth && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="text-[11px] uppercase tracking-wider text-rose-900 font-bold mb-1 flex items-center gap-1.5">
              <span>⚡</span>
              <span>64th Navamsha Transit Shock Shield:</span>
            </div>
            <div className="text-xs sm:text-[12.5px] text-[#4A4238] leading-relaxed mb-1.5 font-medium">
              4th from Moon in D9: <strong>{sixtyFourth.sign}</strong>, ruled by <strong>{sixtyFourth.planet}</strong>.
            </div>
            <div className="text-[11.5px] text-rose-800 bg-white/80 p-2.5 rounded-lg border border-rose-200/60 leading-relaxed">
              <strong>Prefrontal Cognitive Shield:</strong> {sixtyFourth.cognitiveShield}
            </div>
          </div>
        )}

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

        {/* Step 4: Adhidevata Archetype Priming */}
        {profile.neuroRemedy.archetypeAlignment && (
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.25)] border-l-4 border-l-[#a855f7]">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#a855f7] flex items-center gap-1.5">
                <span>⚡ Step 4 · Adhidevata Archetypal Priming</span>
                <span>({profile.neuroRemedy.archetypeAlignment.name})</span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded bg-white text-[#a855f7] font-bold border border-[rgba(168,85,247,0.25)]">
                Daily Executive Mode
              </span>
            </div>
            <div className="text-xs sm:text-[12.5px] text-[#1A1A1A] font-medium leading-relaxed mb-1">
              <strong>Execution Stance:</strong> {profile.neuroRemedy.archetypeAlignment.executiveProtocol}
            </div>
            <div className="text-xs sm:text-[12px] text-[#4A4238] leading-relaxed">
              <strong>Behavioral Alignment:</strong> {profile.neuroRemedy.archetypeAlignment.cognitiveRefocus}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
