"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected engine or rendering errors to telemetry
    console.error("[AstroLife Dashboard Error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          width: "100%",
          background: "#FFFFFF",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "16px",
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "24px",
            color: "#1A1A1A",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Calculation or Interface Interruption
        </h2>

        <p
          style={{
            color: "#6B635B",
            fontSize: "13px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          An unexpected condition occurred while calculating astrological coordinates or rendering this view.
          Your chart data is safe.
        </p>

        {error.message && (
          <div
            style={{
              background: "#FAF7F2",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "12px",
              color: "#B8860B",
              fontFamily: "monospace",
              textAlign: "left",
              marginBottom: "24px",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "10px",
              background: "#B8860B",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              transition: "transform 0.15s ease",
            }}
          >
            <RotateCcw size={16} />
            Retry Calculation
          </button>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "10px",
              background: "#FAF7F2",
              color: "#1A1A1A",
              fontWeight: 500,
              fontSize: "13px",
              textDecoration: "none",
              border: "1px solid rgba(184, 134, 11, 0.2)",
            }}
          >
            <Home size={16} />
            Dashboard Home
          </Link>
        </div>
      </div>
    </div>
  );
}

