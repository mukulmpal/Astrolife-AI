"use client";

import { useState } from "react";

export interface DashaProgressCapsuleProps {
  start: Date | string;
  end: Date | string;
  label?: string;
  className?: string;
  compact?: boolean;
}

export function formatRemainingTime(days: number): string {
  if (days <= 0) return "समाप्त (Completed)";
  if (days < 30) return `${days} दिन शेष (${days}d left)`;
  if (days < 365) {
    const months = Math.floor(days / 30.44);
    const remDays = Math.floor(days % 30.44);
    return remDays > 0 ? `${months} माह ${remDays} दिन शेष` : `${months} माह शेष`;
  }
  const years = Math.floor(days / 365.25);
  const remMonths = Math.floor((days % 365.25) / 30.44);
  return remMonths > 0 ? `${years} वर्ष ${remMonths} माह शेष` : `${years} वर्ष शेष`;
}

export function DashaProgressCapsule({
  start,
  end,
  label,
  className = "",
  compact = false,
}: DashaProgressCapsuleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();

  const totalMs = endDate.getTime() - startDate.getTime();
  const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
  const percent = totalMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 0;

  const remainingMs = Math.max(0, endDate.getTime() - now.getTime());
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));

  const remainingStr = formatRemainingTime(remainingDays);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: "4px",
          padding: compact ? "4px 8px" : "6px 12px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 247, 242, 0.95))",
          border: "1px solid rgba(184, 134, 11, 0.35)",
          boxShadow: "0 2px 8px rgba(184, 134, 11, 0.08)",
          transition: "transform 0.15s ease, border-color 0.15s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <span style={{ fontSize: compact ? "10px" : "11px", fontWeight: 700, color: "#B8860B", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>⏳</span>
            <span>{Math.round(percent)}% {compact ? "" : "पूर्ण"}</span>
          </span>
          <span style={{ fontSize: compact ? "10px" : "11px", fontWeight: 600, color: "#1A1A1A" }}>
            {remainingStr}
          </span>
        </div>

        {/* 2px Golden progress track */}
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "rgba(184, 134, 11, 0.15)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              background: "linear-gradient(90deg, #B8860B 0%, #FFD700 100%)",
              borderRadius: "999px",
              boxShadow: "0 0 6px rgba(255, 215, 0, 0.6)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Interactive Tooltip Popover */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1C1814",
            border: "1px solid rgba(184, 134, 11, 0.4)",
            borderRadius: "10px",
            padding: "8px 12px",
            color: "#FAF7F2",
            fontSize: "11px",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            zIndex: 100,
            pointerEvents: "none",
            animation: "fadeIn 0.12s ease-out forwards",
          }}
        >
          {label && <div style={{ color: "#D4AF37", fontWeight: 700, marginBottom: "4px" }}>✦ {label}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "4px 12px", fontSize: "10px" }}>
            <span style={{ color: "#A89F91" }}>प्रारम्भ (Start):</span>
            <span style={{ fontWeight: 600 }}>{startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span style={{ color: "#A89F91" }}>समाप्ति (End):</span>
            <span style={{ fontWeight: 600 }}>{endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span style={{ color: "#A89F91" }}>व्यतीत काल:</span>
            <span style={{ color: "#D4AF37", fontWeight: 700 }}>{elapsedDays} दिन ({Math.round(percent)}%)</span>
            <span style={{ color: "#A89F91" }}>अवशेष समय:</span>
            <span style={{ color: "#22c55e", fontWeight: 700 }}>{remainingDays} दिन बाकी</span>
          </div>
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid #1C1814",
            }}
          />
        </div>
      )}
    </div>
  );
}

