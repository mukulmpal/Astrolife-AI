import React from "react";
import type { MicroTimingWindow } from "@/lib/astro-engine/cosmic-pulse/types";

interface PulseTimingProps {
  timing: MicroTimingWindow;
}

export const PulseTiming: React.FC<PulseTimingProps> = ({ timing }) => {
  return (
    <div className="pt-3 border-t border-[#1c1840]/60">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8e88b8] mb-2">
        Today&apos;s Windows · Vedic Micro-Timing
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Action Window */}
        <div className="bg-[#0a0720]/80 border border-[#22c55e]/25 hover:border-[#22c55e]/40 transition-colors rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#4ade80] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                Action Window
              </span>
              <span className="text-[11px] font-medium text-[#c8a030]">
                {timing.actionWindow.name}
              </span>
            </div>
            <div className="text-lg font-serif font-bold text-[#f0e8d0] my-1 font-mono tracking-tight">
              {timing.actionWindow.start} — {timing.actionWindow.end}
            </div>
          </div>
          <div className="text-[11px] text-[#a098c0] leading-snug">
            {timing.actionWindow.guidance}
          </div>
        </div>

        {/* Caution Window */}
        <div className="bg-[#0a0720]/80 border border-[#ef4444]/25 hover:border-[#ef4444]/40 transition-colors rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#f87171] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                Caution Window
              </span>
              <span className="text-[11px] font-medium text-[#c084fc]">
                {timing.avoidWindow.name}
              </span>
            </div>
            <div className="text-lg font-serif font-bold text-[#f0e8d0] my-1 font-mono tracking-tight">
              {timing.avoidWindow.start} — {timing.avoidWindow.end}
            </div>
          </div>
          <div className="text-[11px] text-[#a098c0] leading-snug">
            {timing.avoidWindow.guidance}
          </div>
        </div>
      </div>
    </div>
  );
};

