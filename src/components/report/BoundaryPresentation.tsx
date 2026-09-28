"use client";

import React from "react";
import type { BoundaryPresentationModel } from "@/lib/report/explainability";
import { ShieldCheck, AlertCircle, AlertTriangle } from "lucide-react";

interface BoundaryPresentationProps {
  boundaries: BoundaryPresentationModel;
}

export function BoundaryPresentation({ boundaries }: BoundaryPresentationProps) {
  return (
    <div className="space-y-4 my-4">
      {boundaries.isReferencePending && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3 text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Epistemic Status: Reference Pending</p>
            <p>
              Classical KP literature contains no verified multi-layer precedence rule for this matter. Precedence resolution is deliberately withheld.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. What This Evidence Supports */}
        <div className="bg-[#FAF7F2] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">What This Evidence Supports</h4>
            </div>
            <ul className="text-xs text-[#1A1A1A] space-y-2 list-disc list-inside">
              {boundaries.whatThisEvidenceSupports.map((item, idx) => (
                <li key={`sup-${idx}`} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. What Remains Uncertain */}
        <div className="bg-[#FAF7F2] border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">What Remains Uncertain</h4>
            </div>
            <ul className="text-xs text-[#1A1A1A] space-y-2 list-disc list-inside">
              {boundaries.whatRemainsUncertain.map((item, idx) => (
                <li key={`unc-${idx}`} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[#FAF5EB] border border-[rgba(184,134,11,0.22)] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#B8860B]">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">What We Do NOT Claim</h4>
            </div>
            <ul className="text-xs text-[#6B635B] space-y-2 list-disc list-inside">
              {boundaries.whatAstroLifeIsNotClaiming.map((item, idx) => (
                <li key={`not-${idx}`} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

