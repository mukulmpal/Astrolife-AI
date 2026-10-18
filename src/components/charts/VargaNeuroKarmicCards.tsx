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
      <div
        className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.28)] rounded-2xl shadow-[0_4px_24px_rgba(184,134,11,0.06)] transition-all"
        style={{ padding: "26px 30px" }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]">
              ✦ Natal D1 Integrated Shastric Narrative
            </span>
            {profile.deityArchetype && (
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.25)] font-semibold flex items-center gap-1.5">
                <span>⚡ Adhidevata:</span>
                <strong>{profile.deityArchetype.name}</strong>
              </span>
            )}
          </div>
          <span className="text-xs px-3.5 py-1 rounded-full bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)] font-semibold">
            {profile.vargaKey} Lagna: {profile.vargaLagna}
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-[#1A1A1A] mb-2 leading-tight">
          {profile.deepExplanation.title}
        </h2>
        
        <div className="text-xs sm:text-[13px] text-[#8C6D1F] font-semibold mb-5 tracking-wide flex items-center gap-1.5">
          <span>🏛️</span>
          <span>{profile.natalLagnaRelation}</span>
        </div>

        <div className="space-y-4 font-serif text-[15px] sm:text-[15.5px] text-[#2A241F] leading-[1.85]">
          {profile.deepExplanation.paragraphs.map((p, idx) => (
            <p key={idx} className="m-0 text-justify">
              {p}
            </p>
          ))}
        </div>

        {/* Pushkar Navamshas Banner (if any) */}
        {pushkars && pushkars.length > 0 && (
          <div className="mt-5 p-4 sm:p-5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 border-l-4 border-l-emerald-600 flex items-start gap-3">
            <span className="text-emerald-600 text-lg leading-none mt-0.5">✨</span>
            <div>
              <div className="text-[11.5px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Pushkar Navamsha Regenerative Grace Active
              </div>
              <div className="text-xs sm:text-[13.5px] text-emerald-800 leading-relaxed">
                {pushkars.map((pk) => `${pk.planet} in ${pk.navamshaSign}`).join(" · ")} — Endowed with self-regenerating neuroplasticity; converts severe challenges into breakthrough resilience.
              </div>
            </div>
          </div>
        )}

        {profile.deepExplanation.keyHighlights.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-6 pt-4 border-t border-[rgba(184,134,11,0.18)]">
            <span className="text-[11px] uppercase tracking-wider text-[#B8860B] font-bold mr-1">Key Signatures:</span>
            {profile.deepExplanation.keyHighlights.map((kh, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-md bg-[#FAF5EB] text-[#1A1A1A] border border-[rgba(184,134,11,0.25)] font-medium"
              >
                {kh}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── CARD 2: VARGA KARMIC WEAKNESS & SUBCONSCIOUS BOTTLENECK ── */}
      <div
        className={`bg-[#FFFFFF] rounded-2xl shadow-[0_4px_24px_rgba(184,134,11,0.06)] border transition-all ${
          profile.karmicWeakness.hasAffliction
            ? "border-[rgba(220,38,38,0.28)]"
            : "border-[rgba(184,134,11,0.28)]"
        }`}
        style={{ padding: "26px 30px" }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span
            className={`text-[11px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full border ${
              profile.karmicWeakness.hasAffliction
                ? "bg-[rgba(220,38,38,0.1)] text-[#DC2626] border-[rgba(220,38,38,0.3)]"
                : "bg-[rgba(184,134,11,0.1)] text-[#B8860B] border-[rgba(184,134,11,0.3)]"
            }`}
          >
            ⚠️ Varga Karmic Weakness &amp; Subconscious Bottleneck
          </span>
          {profile.karmicWeakness.afflictedPlanets.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-[rgba(220,38,38,0.08)] text-[#DC2626] font-bold border border-[rgba(220,38,38,0.2)]">
              Afflicted: {profile.karmicWeakness.afflictedPlanets.join(", ")}
            </span>
          )}
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-3 leading-tight">
          {profile.karmicWeakness.psychologicalBottleneckTitle}
        </h3>

        <div className="p-4 sm:p-5 rounded-xl bg-[rgba(220,38,38,0.04)] border border-[rgba(220,38,38,0.18)] border-l-4 border-l-[#DC2626] mb-5">
          <div className="text-xs uppercase font-bold text-[#DC2626] tracking-wider mb-1">
            Friction Dynamics
          </div>
          <div className="text-sm text-[#991B1B] font-medium leading-relaxed">
            {profile.karmicWeakness.frictionSummary}
          </div>
        </div>

        <div className="font-serif text-[15px] sm:text-[15.5px] text-[#2A241F] leading-[1.85] mb-5">
          <p className="m-0 text-justify">
            {profile.karmicWeakness.psychologicalBottleneckDesc}
          </p>
        </div>

        {/* Specialized Critical Karmic Points (Kharesh in D3, 64th Navamsha in D9) */}
        {isD3 && kharesh && (
          <div className="mb-5 p-5 sm:p-6 rounded-xl bg-amber-50/80 border border-amber-200 border-l-4 border-l-amber-600">
            <div className="text-xs uppercase tracking-wider text-amber-900 font-bold mb-1.5 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>22nd Drekkana (Kharesh) — Hereditary Epigenetic Organ Vulnerability</span>
            </div>
            <div className="text-sm text-[#4A4238] leading-relaxed mb-3 font-medium">
              Lord: <strong>{kharesh.planet}</strong> in <strong>{kharesh.sign}</strong> (House 8).
              Affects: {kharesh.organSystem}.
            </div>
            <div className="text-xs sm:text-[13px] text-amber-900 bg-white/90 p-4 rounded-xl border border-amber-200/70 leading-relaxed">
              <strong>Somatic Preventive Protocol:</strong> {kharesh.somaticProtocol}
            </div>
          </div>
        )}

        {isD9 && sixtyFourth && (
          <div className="mb-5 p-5 sm:p-6 rounded-xl bg-rose-50/80 border border-rose-200 border-l-4 border-l-rose-600">
            <div className="text-xs uppercase tracking-wider text-rose-900 font-bold mb-1.5 flex items-center gap-1.5">
              <span>⚡</span>
              <span>64th Navamsha Transit Shock Shield</span>
            </div>
            <div className="text-sm text-[#4A4238] leading-relaxed mb-3 font-medium">
              4th from Moon in D9: <strong>{sixtyFourth.sign}</strong>, ruled by <strong>{sixtyFourth.planet}</strong>.
            </div>
            <div className="text-xs sm:text-[13px] text-rose-900 bg-white/90 p-4 rounded-xl border border-rose-200/70 leading-relaxed">
              <strong>Prefrontal Cognitive Shield:</strong> {sixtyFourth.cognitiveShield}
            </div>
          </div>
        )}

        {/* Ancestral DNA Kula Karma Imprint */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.22)] border-l-4 border-l-[#B8860B]">
          <div className="text-xs uppercase tracking-wider text-[#B8860B] font-bold mb-2 flex items-center gap-1.5">
            <span>🧬</span>
            <span>Ancestral DNA &amp; Kula Karma Pattern</span>
          </div>
          <p className="text-sm sm:text-[14.5px] text-[#3D3834] leading-[1.8] m-0 font-medium">
            {profile.karmicWeakness.ancestralLineagePattern}
          </p>
        </div>
      </div>

      {/* ── CARD 3: SCIENTIFIC & DNA-BASED NEURO-REMEDY PROTOCOL ── */}
      <div
        className="bg-[#FFFFFF] border border-[rgba(34,197,94,0.3)] rounded-2xl shadow-[0_4px_24px_rgba(184,134,11,0.06)] transition-all"
        style={{ padding: "26px 30px" }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span className="text-[11px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(34,197,94,0.12)] text-[#16A34A] border border-[rgba(34,197,94,0.3)]">
            🧬 Scientific &amp; DNA-Based Neuro-Remedy Protocol
          </span>
          <span className="text-xs px-3.5 py-1 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.2)] font-semibold">
            Daily Behavioral Re-Wiring
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-5 leading-tight">
          Neuro-Somatic &amp; Generational Loop Reset for {profile.vargaKey} ({profile.vargaName})
        </h3>

        <div className="space-y-4 mb-5">
          {/* Step 1: Ancestral Interruption */}
          <div className="bg-[#FAF8F5] border border-[rgba(184,134,11,0.22)] border-l-4 border-l-[#B8860B] rounded-xl p-5 sm:p-6 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B]">
                १. पूर्वज लूप खंडन · Step 1: Ancestral Loop Interruption
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white text-[#8C6D1F] border border-[rgba(184,134,11,0.25)] font-bold">
                Generational Reset
              </span>
            </div>
            <div className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
              Generational Loop Break & Epigenetic Cleansing
            </div>
            <p className="text-sm sm:text-[14.5px] text-[#3D3834] leading-[1.8] m-0 font-medium">
              {profile.neuroRemedy.ancestralLoopInterruption}
            </p>
          </div>

          {/* Step 2: Cognitive Re-Wiring */}
          <div className="bg-[#FAF8F5] border border-[rgba(37,99,235,0.2)] border-l-4 border-l-[#2563EB] rounded-xl p-5 sm:p-6 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#2563EB]">
                २. मानसिक पुनर्गठन · Step 2: Cognitive Re-Wiring
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-bold">
                Target: {profile.neuroRemedy.cognitiveRewiring.distortionLabel}
              </span>
            </div>
            <div className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
              {profile.neuroRemedy.cognitiveRewiring.techniqueName}
            </div>
            <p className="text-sm sm:text-[14.5px] text-[#3D3834] leading-[1.8] m-0 font-medium">
              {profile.neuroRemedy.cognitiveRewiring.mindsetProtocol}
            </p>
          </div>

          {/* Step 3: Somatic Behavioral Habit */}
          <div className="bg-[#FAF8F5] border border-[rgba(22,163,74,0.2)] border-l-4 border-l-[#16A34A] rounded-xl p-5 sm:p-6 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#16A34A]">
                ३. देह-व्यवहार क्रिया · Step 3: Somatic Behavioral Protocol
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 font-bold">
                Biomarker: {profile.neuroRemedy.somaticBehavioralHabit.neuroMechanism}
              </span>
            </div>
            <div className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
              {profile.neuroRemedy.somaticBehavioralHabit.habitName}
            </div>
            <p className="text-sm sm:text-[14.5px] text-[#1A1A1A] leading-[1.8] m-0 font-medium">
              {profile.neuroRemedy.somaticBehavioralHabit.dailyProtocol}
            </p>
          </div>

          {/* Step 4: Adhidevata Archetype Priming */}
          {profile.neuroRemedy.archetypeAlignment && (
            <div className="bg-[#FAF8F5] border border-[rgba(168,85,247,0.25)] border-l-4 border-l-[#a855f7] rounded-xl p-5 sm:p-6 transition-all">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="text-xs uppercase tracking-wider font-extrabold text-[#a855f7] flex items-center gap-1.5">
                  <span>⚡ ४. अधिदेवता संरेखण · Step 4: Adhidevata Archetypal Priming</span>
                  <span>({profile.neuroRemedy.archetypeAlignment.name})</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 text-[#a855f7] font-bold border border-purple-200">
                  Daily Executive Mode
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="text-sm sm:text-[14.5px] text-[#1A1A1A] font-medium leading-[1.8]">
                  <strong className="text-[#a855f7]">Execution Stance:</strong> {profile.neuroRemedy.archetypeAlignment.executiveProtocol}
                </div>
                <div className="text-sm sm:text-[14.5px] text-[#4A4238] leading-[1.8]">
                  <strong className="text-[#8C6D1F]">Behavioral Alignment:</strong> {profile.neuroRemedy.archetypeAlignment.cognitiveRefocus}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
