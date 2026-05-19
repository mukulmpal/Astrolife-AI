"use client";
import { useState } from "react";
import { getEducation } from "@/lib/astro-education";

export function EducationTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const education = getEducation(term);

  if (!education) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "1px dotted rgba(200, 160, 48, 0.5)",
          borderRadius: "4px",
          padding: "0 4px",
          cursor: "help",
          color: "inherit",
          fontFamily: "inherit",
          fontSize: "inherit",
        }}
      >
        {children} <span style={{ color: "#c8a030" }}>?</span>
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#0d0a22",
              border: "2px solid #c8a030",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              color: "#f0e8d0",
              fontSize: "14px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px 0", color: "#c8a030" }}>
                  {education.name}
                </h2>
                <div style={{ fontSize: "11px", color: "#b8b0d8", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {education.category} • {education.difficulty}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#b8b0d8",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "rgba(200, 160, 48, 0.1)", border: "1px solid rgba(200, 160, 48, 0.2)", borderRadius: "8px", padding: "12px", marginBottom: "16px", fontSize: "13px" }}>
              <strong style={{ color: "#c8a030" }}>Quick Explanation:</strong> {education.shortExplanation}
            </div>

            <div style={{ marginBottom: "16px", lineHeight: "1.7" }}>
              <h3 style={{ color: "#a855f7", marginBottom: "8px" }}>Deep Dive</h3>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{education.detailedExplanation}</p>
            </div>

            {education.example && (
              <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                <strong style={{ color: "#22c55e" }}>Example:</strong> {education.example}
              </div>
            )}

            {education.relatedTerms && education.relatedTerms.length > 0 && (
              <div>
                <strong style={{ color: "#2dd4bf" }}>Related Terms:</strong> {education.relatedTerms.join(", ")}
              </div>
            )}

            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "10px",
                background: "#c8a030",
                border: "none",
                borderRadius: "6px",
                color: "#060410",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
