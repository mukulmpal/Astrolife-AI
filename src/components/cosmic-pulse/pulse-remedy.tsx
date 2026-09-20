import React from "react";

interface PulseRemedyProps {
  behavioralReset: string;
  traditionalUpaya: string;
  durationMinutes?: number;
}

export const PulseRemedy: React.FC<PulseRemedyProps> = ({
  behavioralReset,
  traditionalUpaya,
  durationMinutes = 1,
}) => {
  return (
    <div className="pt-3 border-t border-[#1c1840]/60">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8e88b8] mb-2 flex items-center gap-1.5">
        <span>⚡</span> Practical Alignment & Upaya
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1-Minute Behavioral Reset */}
        <div className="bg-gradient-to-br from-[#0a0720] to-[#120e30] border border-[#c8a030]/25 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c8a030] mb-1.5">
            <span className="text-sm">⏱️</span> {durationMinutes}-Minute Behavioral Reset
          </div>
          <div className="text-xs text-[#f0e8d0] leading-relaxed">
            {behavioralReset}
          </div>
        </div>

        {/* Traditional Vedic Upaya */}
        <div className="bg-gradient-to-br from-[#0a0720] to-[#1a1238] border border-[#a855f7]/25 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c084fc] mb-1.5">
            <span className="text-sm">🪔</span> Traditional Vedic Upaya
          </div>
          <div className="text-xs text-[#e2d8c0] leading-relaxed">
            {traditionalUpaya}
          </div>
        </div>
      </div>
    </div>
  );
};

