"use client";

import { ConfidenceBadge } from "./confidence-badge";
import type { PalmReportStyle, PalmRuleReport } from "@/lib/palmistry/types";

export function PalmistryReportView({ report, style }: { report: PalmRuleReport; style: PalmReportStyle }) {
  return (
    <div className="space-y-5 rounded-2xl border border-[#c8a030]/20 bg-black/30 p-5">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#e6c869]">{report.engineVersion} · {style}</div>
        <h3 className="mt-2 font-serif text-2xl text-white">Book-backed Palmistry Rule Report</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/62">{report.summary}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {report.sections.filter((section) => section.hits.length > 0).map((section) => (
          <div key={section.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-serif text-lg text-white">{section.title}</h4>
              <ConfidenceBadge value={section.confidence} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/55">{section.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {section.hits.slice(0, 4).flatMap((hit) => hit.sourceIds).map((sourceId) => (
                <span key={`${section.id}-${sourceId}`} className="rounded-full border border-[#c8a030]/20 bg-[#c8a030]/10 px-2 py-0.5 text-[10px] text-[#e6c869]">{sourceId}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <h4 className="text-sm font-semibold text-amber-100">Safety Guardrails</h4>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-amber-100/70">
          {report.disclaimers.map((disclaimer) => <li key={disclaimer}>• {disclaimer}</li>)}
        </ul>
      </div>
    </div>
  );
}
