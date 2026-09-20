import React from "react";
import type { MicroTimingWindow } from "@/lib/astro-engine/cosmic-pulse/types";

interface PulseTimingProps {
  timing: MicroTimingWindow;
}

export const PulseTiming: React.FC<PulseTimingProps> = ({ timing }) => {
  return (
    <div className="pt-3 border-t" style={{ borderColor: "var(--app-border)" }}>
      <div
        className="text-[10px] uppercase tracking-wider font-semibold mb-2"
        style={{ color: "var(--app-muted)" }}
      >
        Today&apos;s Windows · Vedic Micro-Timing
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Action Window */}
        <div
          className="border transition-colors rounded-xl p-3 flex flex-col justify-between"
          style={{
            background: "var(--app-card-alt)",
            borderColor: "color-mix(in srgb, #22c55e 35%, var(--app-border))",
          }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-500 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Action Window
              </span>
              <span className="text-[11px] font-medium" style={{ color: "var(--app-gold)" }}>
                {timing.actionWindow.name}
              </span>
            </div>
            <div
              className="text-lg font-serif font-bold my-1 font-mono tracking-tight"
              style={{ color: "var(--app-fg)" }}
            >
              {timing.actionWindow.start} — {timing.actionWindow.end}
            </div>
          </div>
          <div className="text-[11px] leading-snug" style={{ color: "var(--app-soft)" }}>
            {timing.actionWindow.guidance}
          </div>
        </div>

        {/* Caution Window */}
        <div
          className="border transition-colors rounded-xl p-3 flex flex-col justify-between"
          style={{
            background: "var(--app-card-alt)",
            borderColor: "color-mix(in srgb, #ef4444 35%, var(--app-border))",
          }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-rose-500 uppercase">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Caution Window
              </span>
              <span className="text-[11px] font-medium text-purple-400">
                {timing.avoidWindow.name}
              </span>
            </div>
            <div
              className="text-lg font-serif font-bold my-1 font-mono tracking-tight"
              style={{ color: "var(--app-fg)" }}
            >
              {timing.avoidWindow.start} — {timing.avoidWindow.end}
            </div>
          </div>
          <div className="text-[11px] leading-snug" style={{ color: "var(--app-soft)" }}>
            {timing.avoidWindow.guidance}
          </div>
        </div>
      </div>
    </div>
  );
};

