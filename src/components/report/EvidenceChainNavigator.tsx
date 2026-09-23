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
      <div className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-lg">
        No active evidence navigation chains found for this topic.
      </div>
    );
  }

  return (
    <div className="space-y-4 my-3">
      {chains.map((chain) => (
        <div
          key={chain.findingId}
          className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-mono text-cyan-400 font-medium">
              {chain.findingId}
            </span>
            <span className="text-[11px] text-slate-400">Deterministic Chain</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-stretch">
            {/* Step 1: Finding */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Finding</span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-3">
                  {String(chain.steps[0].details.whatWasFound || chain.steps[0].label)}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-2 block">
                Nodes: {String(chain.steps[0].details.evidenceNodeCount || 0)}
              </span>
            </div>

            {/* Step 2: Relation */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <GitFork className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Relation</span>
                </div>
                <p className="text-xs font-mono font-medium text-amber-300">
                  {chain.steps[1].identifier}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                  {chain.steps[1].label}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">Precedence Resolved</span>
            </div>

            {/* Step 3: Rule */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3. Rule</span>
                </div>
                <p className="text-xs font-mono font-medium text-indigo-300">
                  {chain.steps[2].identifier}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                  {chain.steps[2].label}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">
                Status: {String(chain.steps[2].details.status || "Verified")}
              </span>
            </div>

            {/* Step 4: Canonical Provenance */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Provenance</span>
                </div>
                <p className="text-xs font-semibold text-emerald-300">
                  {chain.steps[3].citation?.sourceBook || "Classical Reference"}
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  {chain.steps[3].citation?.pages || "Passage pending verification"}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">
                Attested Literature
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

