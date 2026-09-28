"use client";

import React from "react";
import type { EvidenceNavigationChain } from "@/lib/report/explainability";
import { ChevronRight, FileText, GitFork, BookOpen, Bookmark } from "lucide-react";

interface EvidenceChainNavigatorProps {
  chains: EvidenceNavigationChain[];
}

export function EvidenceChainNavigator({ chains }: EvidenceChainNavigatorProps) {
  if (!chains || chains.length === 0) {
    return (
      <div className="text-xs text-[#8C827A] italic p-3 bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-lg">
        No active evidence navigation chains found for this topic.
      </div>
    );
  }

  return (
    <div className="space-y-4 my-3">
      {chains.map((chain) => (
        <div
          key={chain.findingId}
          className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)] rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[rgba(184,134,11,0.15)] pb-2">
            <span className="text-[11px] font-mono text-[#B8860B] font-medium">
              {chain.findingId}
            </span>
            <span className="text-[11px] text-[#6B635B]">Deterministic Chain</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-stretch">
            {/* Step 1: Finding */}
            <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B635B] font-semibold mb-1">
                  <FileText className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>1. Finding</span>
                </div>
                <p className="text-xs text-[#1A1A1A] line-clamp-3">
                  {String(chain.steps[0].details.whatWasFound || chain.steps[0].label)}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#8C827A] mt-2 block">
                Nodes: {String(chain.steps[0].details.evidenceNodeCount || 0)}
              </span>
            </div>

            {/* Step 2: Relation */}
            <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B635B] font-semibold mb-1">
                  <GitFork className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Relation</span>
                </div>
                <p className="text-xs font-mono font-medium text-[#B8860B]">
                  {chain.steps[1].identifier}
                </p>
                <p className="text-[11px] text-[#6B635B] line-clamp-2 mt-1">
                  {chain.steps[1].label}
                </p>
              </div>
              <span className="text-[10px] text-[#8C827A] mt-2 block">Precedence Resolved</span>
            </div>

            {/* Step 3: Rule */}
            <div className="bg-[#FAF5EB] border border-[rgba(184,134,11,0.22)] rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B635B] font-semibold mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>3. Rule</span>
                </div>
                <p className="text-xs font-mono font-medium text-[#B8860B]">
                  {chain.steps[2].identifier}
                </p>
                <p className="text-[11px] text-[#1A1A1A] line-clamp-2 mt-1">
                  {chain.steps[2].label}
                </p>
              </div>
              <span className="text-[10px] text-[#8C827A] mt-2 block">
                Status: {String(chain.steps[2].details.status || "Verified")}
              </span>
            </div>

            {/* Step 4: Canonical Provenance */}
            <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B635B] font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Provenance</span>
                </div>
                <p className="text-xs font-semibold text-emerald-700">
                  {chain.steps[3].citation?.sourceBook || "Classical Reference"}
                </p>
                <p className="text-[11px] text-[#6B635B] mt-1">
                  {chain.steps[3].citation?.pages || "Passage pending verification"}
                </p>
              </div>
              <span className="text-[10px] text-[#8C827A] mt-2 block">
                Attested Literature
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

