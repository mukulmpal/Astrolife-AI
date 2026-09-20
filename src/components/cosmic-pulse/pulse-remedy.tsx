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
    <div className="pt-3 border-t" style={{ borderColor: "var(--app-border)" }}>
      <div
        className="text-[10px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5"
        style={{ color: "var(--app-muted)" }}
      >
        <span>⚡</span> Practical Alignment & Upaya
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1-Minute Behavioral Reset */}
        <div
          className="rounded-xl p-3 border"
          style={{
            background: "var(--app-card-alt)",
            borderColor: "color-mix(in srgb, var(--app-gold) 35%, var(--app-border))",
          }}
        >
          <div
            className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
            style={{ color: "var(--app-gold)" }}
          >
            <span className="text-sm">⏱️</span> {durationMinutes}-Minute Behavioral Reset
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--app-soft)" }}>
            {behavioralReset}
          </div>
        </div>

        {/* Traditional Vedic Upaya */}
        <div
          className="rounded-xl p-3 border"
          style={{
            background: "var(--app-card-alt)",
            borderColor: "color-mix(in srgb, var(--al-violet, #a855f7) 35%, var(--app-border))",
          }}
        >
          <div
            className="flex items-center gap-1.5 text-xs font-semibold mb-1.5 text-purple-400"
          >
            <span className="text-sm">🪔</span> Traditional Vedic Upaya
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--app-soft)" }}>
            {traditionalUpaya}
          </div>
        </div>
      </div>
    </div>
  );
};

