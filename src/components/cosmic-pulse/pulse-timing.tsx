import React from "react";
import type { MicroTimingWindow } from "@/lib/astro-engine/cosmic-pulse/types";

interface PulseTimingProps {
  timing: MicroTimingWindow;
}

export const PulseTiming: React.FC<PulseTimingProps> = ({ timing }) => {
  return (
    <div className="pt-1">
      <div
        className="text-[10px] uppercase tracking-wider font-semibold mb-3 font-mono"
        style={{ color: "var(--app-muted, #94a3b8)" }}
      >
        Today&apos;s Windows · Vedic Micro-Timing
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Action Window */}
        <div
          className="border transition-colors rounded-xl p-4 flex flex-col justify-between"
          style={{
            background: "var(--app-card-alt, #09071a)",
            borderColor: "rgba(34, 197, 94, 0.35)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-400 font-mono uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Action Window
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded border" style={{ background: "rgba(245,200,66,0.12)", borderColor: "rgba(245,200,66,0.3)", color: "var(--app-gold, #f5c842)" }}>
                {timing.actionWindow.name}
              </span>
            </div>
            <div
              className="text-xl font-serif font-bold my-2 font-mono tracking-tight"
              style={{ color: "var(--app-fg, #ffffff)" }}
            >
              {timing.actionWindow.start} — {timing.actionWindow.end}
            </div>
          </div>
          <div className="text-xs leading-relaxed mt-1" style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.6" }}>
            {timing.actionWindow.guidance}
          </div>
        </div>

        {/* Caution Window */}
        <div
          className="border transition-colors rounded-xl p-4 flex flex-col justify-between"
          style={{
            background: "var(--app-card-alt, #09071a)",
            borderColor: "rgba(239, 68, 68, 0.35)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-rose-400 font-mono uppercase">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Caution Window
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded border text-purple-200" style={{ background: "rgba(168,85,247,0.15)", borderColor: "rgba(168,85,247,0.35)" }}>
                {timing.avoidWindow.name}
              </span>
            </div>
            <div
              className="text-xl font-serif font-bold my-2 font-mono tracking-tight"
              style={{ color: "var(--app-fg, #ffffff)" }}
            >
              {timing.avoidWindow.start} — {timing.avoidWindow.end}
            </div>
          </div>
          <div className="text-xs leading-relaxed mt-1" style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.6" }}>
            {timing.avoidWindow.guidance}
          </div>
        </div>
      </div>
    </div>
  );
};

