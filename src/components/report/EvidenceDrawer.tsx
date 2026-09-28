"use client";

import React, { useState } from "react";
import type { EvidenceDrawerViewModel } from "@/lib/report/explainability";
import { BoundaryPresentation } from "./BoundaryPresentation";
import { EvidenceChainNavigator } from "./EvidenceChainNavigator";
import { WhyAmISeeingThisModal } from "./WhyAmISeeingThisModal";
import {
  Layers,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Code2,
} from "lucide-react";

interface EvidenceDrawerProps {
  viewModel: EvidenceDrawerViewModel;
  defaultLevel?: "casual" | "curious" | "technical";
}

export function EvidenceDrawer({
  viewModel,
  defaultLevel = "casual",
}: EvidenceDrawerProps) {
  const [activeTab, setActiveTab] = useState<"casual" | "curious" | "technical">(defaultLevel);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);

  const handleCopyAuditHash = async () => {
    try {
      await navigator.clipboard.writeText(viewModel.technical.auditHash);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard fallback
      setIsCopied(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.22)] rounded-2xl p-5 space-y-5 shadow-sm">
      {/* Header with Topic and Level Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(184,134,11,0.15)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1A1A1A] tracking-wide">
              {viewModel.eventName}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[rgba(184,134,11,0.1)] text-[#B8860B] border border-[rgba(184,134,11,0.2)]">
              {viewModel.synthesisState}
            </span>
          </div>
          <p className="text-xs text-[#6B635B] mt-0.5">
            Deterministic evidence inspection and progressive disclosure
          </p>
        </div>

        {/* Tab Selector: Casual (L1), Curious (L2), Technical (L3) */}
        <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[rgba(184,134,11,0.18)] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("casual")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "casual"
                ? "bg-[rgba(184,134,11,0.15)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            Casual (L1)
          </button>
          <button
            onClick={() => setActiveTab("curious")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "curious"
                ? "bg-[rgba(184,134,11,0.15)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            Curious (L2)
          </button>
          <button
            onClick={() => setActiveTab("technical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "technical"
                ? "bg-[rgba(200,160,48,0.15)] text-[#B8860B] border border-[rgba(200,160,48,0.3)]"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            Technical (L3)
          </button>
        </div>
      </div>

      {/* Tab 1: Casual (L1) */}
      {activeTab === "casual" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">
                What AstroLife Found
              </span>
              <button
                onClick={() => setIsWhyModalOpen(true)}
                className="text-xs text-[#6B635B] hover:text-[#B8860B] flex items-center gap-1 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why am I seeing this?</span>
              </button>
            </div>
            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              {viewModel.casual.summary}
            </p>
          </div>

          {/* Practical Interpretation */}
          <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-4 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B]">
              Practical Interpretation
            </span>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {viewModel.casual.practicalInterpretation}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Curious (L2) */}
      {activeTab === "curious" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8860B]">
                Natal Cusp Evidence
              </span>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                {viewModel.curious.cuspEvidence}
              </p>
            </div>

            <div className="bg-[#FAF5EB] border border-[rgba(184,134,11,0.22)] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8860B]">
                Dasha Activation Window
              </span>
              <p className="text-xs text-[#1A1A1A] leading-relaxed">
                {viewModel.curious.dashaEvidence}
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Transit Corroboration
              </span>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                {viewModel.curious.transitEvidence}
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Ruling Planets Corroboration
              </span>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                {viewModel.curious.rpEvidence}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-xl flex items-center justify-between">
            <span className="text-xs text-[#6B635B]">
              Want to inspect the detailed multi-layer causal reasoning?
            </span>
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="px-3 py-1.5 bg-[#B8860B] hover:bg-[#996515] text-[#FFFFFF] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Inspect Causal Reasoning</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Technical (L3) */}
      {activeTab === "technical" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Metadata Bar */}
          <div className="bg-[#FAF5EB] border border-[rgba(184,134,11,0.22)] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(184,134,11,0.18)] pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#B8860B]" />
                <span className="text-xs font-mono text-[#1A1A1A]">
                  Contract v{viewModel.technical.contractVersion}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B635B]">
                  {viewModel.technical.auditHash}
                </span>
                <button
                  onClick={handleCopyAuditHash}
                  className="p-1 bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[rgba(184,134,11,0.22)] text-[#1A1A1A] rounded text-xs transition flex items-center gap-1"
                  title="Copy Audit Hash"
                >
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs space-y-1.5">
              <span className="font-semibold text-[#6B635B] block">Applied Precedence Relations:</span>
              <div className="flex flex-wrap gap-1.5">
                {viewModel.technical.appliedRelations.map((rel) => (
                  <span
                    key={rel}
                    className="px-2 py-0.5 rounded bg-[rgba(200,160,48,0.12)] border border-[rgba(200,160,48,0.25)] text-[#B8860B] font-mono text-[11px]"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Traceable Navigation Chains */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B] block">
              Traceable Provenance Chains
            </span>
            <EvidenceChainNavigator chains={viewModel.technical.navigationChains} />
          </div>
        </div>
      )}

      {/* Collapsible Boundary & Uncertainty Section */}
      <div className="border-t border-[rgba(184,134,11,0.15)] pt-3">
        <button
          onClick={() => setShowBoundaries(!showBoundaries)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#6B635B] hover:text-[#1A1A1A] transition py-1"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#6B635B]" />
            <span>Ethical Boundaries & Uncertainty Disclosures</span>
          </div>
          {showBoundaries ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showBoundaries && <BoundaryPresentation boundaries={viewModel.boundaries} />}
      </div>

      {/* Reusable Why Am I Seeing This Modal */}
      <WhyAmISeeingThisModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        model={{
          sectionId: viewModel.sectionId,
          topicName: viewModel.eventName,
          primaryFinding: viewModel.casual.summary,
          causalChain: {
            primaryCuspSubLordEvidence: viewModel.curious.cuspEvidence,
            dashaContext: viewModel.curious.dashaEvidence,
            transitContext: viewModel.curious.transitEvidence,
            rulingPlanetsContext: viewModel.curious.rpEvidence,
            synthesisVerdict: viewModel.synthesisState,
          },
          plainLanguageExplanation: viewModel.curious.whyAmISeeingThis,
          relationSummary: `Relations: ${viewModel.technical.appliedRelations.join(", ")}`,
          isReferencePending: viewModel.boundaries.isReferencePending,
        }}
      />
    </div>
  );
}

