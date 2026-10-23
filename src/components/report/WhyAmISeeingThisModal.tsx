"use client";

import React from "react";
import type { WhyAmISeeingThisModel } from "@/lib/report/explainability";
import { HelpCircle, X, CheckCircle2, AlertTriangle, Layers, Clock, Compass } from "lucide-react";

interface WhyAmISeeingThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: WhyAmISeeingThisModel;
}

export function WhyAmISeeingThisModal({
  isOpen,
  onClose,
  model,
}: WhyAmISeeingThisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.22)] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[rgba(184,134,11,0.15)] pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#B8860B]" />
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Why am I seeing this?</h3>
              <p className="text-xs text-[#6B635B]">{model.topicName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B635B] hover:text-[#1A1A1A] p-1 rounded-lg hover:bg-[#FAF7F2] transition"
            aria-label="Close explanation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reference Pending Alert if applicable */}
        {model.isReferencePending && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold">Uncertainty Note:</span> Classical KP literature lacks attested conflict precedence for modern speculative trading. Precedence resolution is deliberately withheld.
            </div>
          </div>
        )}

        {/* Primary Observation */}
        <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-4 space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[#6B635B] font-bold">
            Primary Deterministic Finding
          </span>
          <p className="text-sm text-[#1A1A1A] leading-relaxed font-medium">
            {model.primaryFinding}
          </p>
        </div>

        {/* Multi-Layer Causal Evidence Chain */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B635B]">
            Underlying Causal Evidence Layers
          </h4>

          <div className="space-y-2 text-xs">
            {/* Layer 1: Cuspal Sub-Lord */}
            <div className="p-3 bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-lg flex items-start gap-3">
              <Layers className="w-4 h-4 text-[#B8860B] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#6B635B] block mb-0.5">Natal Cusp Sub-Lord</span>
                <p className="text-[#6B635B]">{model.causalChain.primaryCuspSubLordEvidence}</p>
              </div>
            </div>

            {/* Layer 2: Dasha Timing */}
            <div className="p-3 bg-[#FAF5EB] border border-[rgba(184,134,11,0.22)] rounded-lg flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#B8860B] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1A1A1A] block mb-0.5">Dasha Period Window</span>
                <p className="text-[#6B635B]">{model.causalChain.dashaContext}</p>
              </div>
            </div>

            {/* Layer 3: Transit Trigger */}
            <div className="p-3 bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-lg flex items-start gap-3">
              <Compass className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#6B635B] block mb-0.5">Transit Corroboration</span>
                <p className="text-[#6B635B]">{model.causalChain.transitContext}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Synthesis Rationale */}
        <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B635B]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Precedence & Synthesis Resolution</span>
          </div>
          <p className="text-xs text-[#6B635B] leading-relaxed">
            {model.plainLanguageExplanation}
          </p>
          <p className="text-[11px] text-[#6B635B] pt-1 border-t border-[rgba(184,134,11,0.15)]">
            {model.relationSummary}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#B8860B] hover:bg-[#996515] text-xs font-semibold text-white rounded-lg transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

