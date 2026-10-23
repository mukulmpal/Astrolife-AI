"use client";

import React from "react";
import NorthIndianChart from "@/components/north-indian-chart";
import SouthIndianChart from "@/components/south-indian-chart";

export type ChartStyle = "north_indian" | "south_indian";

interface DualChartViewerProps {
  lagnaNum: number;
  planets: Parameters<typeof NorthIndianChart>[0]["planets"];
  size?: number;
  centerTitle?: string;
  centerSubtitle?: string;
  initialStyle?: ChartStyle;
  showToggle?: boolean;
}

export function DualChartViewer({
  lagnaNum,
  planets,
  size = 310,
  centerTitle,
  centerSubtitle,
  initialStyle = "north_indian",
  showToggle = true,
}: DualChartViewerProps) {
  const [style, setStyle] = React.useState<ChartStyle>(initialStyle);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      {showToggle && (
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "3px",
            gap: "4px",
          }}
        >
          <button
            onClick={() => setStyle("north_indian")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: style === "north_indian" ? "#d4af37" : "transparent",
              color: style === "north_indian" ? "#080614" : "#9890b0",
              transition: "all 0.15s ease",
            }}
          >
            Diamond (North)
          </button>
          <button
            onClick={() => setStyle("south_indian")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: style === "south_indian" ? "#d4af37" : "transparent",
              color: style === "south_indian" ? "#080614" : "#9890b0",
              transition: "all 0.15s ease",
            }}
          >
            Box (South)
          </button>
        </div>
      )}

      {style === "north_indian" ? (
        <NorthIndianChart lagnaNum={lagnaNum} planets={planets} size={size} />
      ) : (
        <SouthIndianChart
          lagnaNum={lagnaNum}
          planets={planets}
          size={size}
          centerTitle={centerTitle}
          centerSubtitle={centerSubtitle}
        />
      )}
    </div>
  );
}

