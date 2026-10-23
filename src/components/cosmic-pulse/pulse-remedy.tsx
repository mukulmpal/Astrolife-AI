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
    <div className="pt-1">
      <div
        className="text-[10px] uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5 font-mono"
        style={{ color: "var(--app-muted, #94a3b8)" }}
      >
        <span>⚡</span> Practical Alignment & Upaya
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1-Minute Behavioral Reset */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "var(--app-card-alt, #09071a)",
            borderColor: "rgba(245,200,66,0.3)",
          }}
        >
          <div
            className="flex items-center gap-2 text-xs font-semibold mb-2 font-mono uppercase tracking-wider"
            style={{ color: "var(--app-gold, #f5c842)" }}
          >
            <span>⏱️</span> {durationMinutes}-Minute Practical Action
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.7" }}>
            {behavioralReset}
          </div>
        </div>

        {/* Traditional Vedic Upaya */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "var(--app-card-alt, #09071a)",
            borderColor: "rgba(168,85,247,0.35)",
          }}
        >
          <div
            className="flex items-center gap-2 text-xs font-semibold mb-2 font-mono uppercase tracking-wider text-purple-300"
          >
            <span>🪔</span> Classical Shastric Upaya
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.7" }}>
            {traditionalUpaya}
          </div>
        </div>
      </div>
    </div>
  );
};

