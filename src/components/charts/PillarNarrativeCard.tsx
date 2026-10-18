// src/components/charts/PillarNarrativeCard.tsx
// ============================================================================
// LUXURY PILLAR STORYTELLING & GOCHAR ROADMAP CARD
// Editorial, human storytelling prose presentation with chapter tabs,
// future gochar roadmap milestones, and shastric directives.
// ============================================================================

"use client";

import React, { useState } from "react";
import type { PillarNarrativeData } from "@/lib/astro-engine/pillar-narrative-engine";
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
} from "lucide-react";

interface PillarNarrativeCardProps {
  narrative: PillarNarrativeData;
  className?: string;
}

export default function PillarNarrativeCard({
  narrative,
  className = "",
}: PillarNarrativeCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | "all">("all");
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(true);

  const {
    title,
    subtitle,
    icon,
    badge,
    heroHeadline,
    chapters,
    upcomingRoadmap,
    actionableDirective,
  } = narrative;

  const handleCopyStory = () => {
    const fullStory = `✦ ${title}
${subtitle}

${heroHeadline}

${chapters
  .map(
    (ch) => `==============================
${ch.title}
${ch.subtitle}
==============================
${ch.paragraphs.join("\n\n")}
`
  )
  .join("\n\n")}

✦ आगामी गोचर एवं भविष्य का टाइमलाइन रोडमैप:
${upcomingRoadmap
  .map(
    (m) => `• ${m.phaseTitle} (${m.timeWindow})
  आकाशीय ट्रिगर: ${m.planetaryTrigger}
  प्रभाव: ${m.impactTheme}
  विवरण: ${m.detailedInsight}`
  )
  .join("\n\n")}

✦ शास्त्रीय महा-निर्देश:
${actionableDirective.points.map((p) => `• ${p}`).join("\n")}
`;

    navigator.clipboard.writeText(fullStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const displayedChapters =
    selectedChapterIndex === "all"
      ? chapters
      : chapters.filter((_, idx) => idx === selectedChapterIndex);

  return (
    <div
      className={`pillar-storytelling-card ${className}`}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(184, 134, 11, 0.28)",
        borderRadius: 16,
        padding: "24px 28px",
        boxShadow: "0 4px 24px rgba(184, 134, 11, 0.06)",
        position: "relative",
      }}
    >
      {/* ── TOP LUXURY BAR ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(184, 134, 11, 0.18)",
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#B8860B",
              marginBottom: 6,
            }}
          >
            <span>{icon}</span>
            <span>✦ Shastric Storytelling & Gochar Ripple</span>
            <span
              style={{
                fontSize: 10,
                background: "rgba(184, 134, 11, 0.12)",
                padding: "2px 8px",
                borderRadius: 10,
                border: "1px solid rgba(184, 134, 11, 0.3)",
              }}
            >
              {badge}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.25,
              margin: "0 0 6px 0",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              fontSize: 13.5,
              color: "#6B635B",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={handleCopyStory}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 700,
              color: copied ? "#16A34A" : "#B8860B",
              background: copied ? "rgba(22, 163, 74, 0.1)" : "rgba(184, 134, 11, 0.08)",
              border: `1px solid ${copied ? "rgba(22, 163, 74, 0.3)" : "rgba(184, 134, 11, 0.28)"}`,
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "कथा कॉपी हो गई!" : "संपूर्ण आख्यान कॉपी करें"}</span>
          </button>
        </div>
      </div>

      {/* ── HERO HEADLINE BANNER ── */}
      <div
        style={{
          marginTop: 18,
          marginBottom: 22,
          padding: "14px 18px",
          background: "linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(250, 248, 245, 0.9) 100%)",
          borderLeft: "4px solid #B8860B",
          borderRadius: "0 12px 12px 0",
        }}
      >
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 17,
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1.5,
          }}
        >
          &ldquo;{heroHeadline}&rdquo;
        </div>
      </div>

      {/* ── CHAPTER CHIPS SELECTOR ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
          paddingBottom: 14,
          borderBottom: "1px dashed rgba(184, 134, 11, 0.2)",
        }}
      >
        <button
          onClick={() => setSelectedChapterIndex("all")}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 20,
            border: `1px solid ${
              selectedChapterIndex === "all"
                ? "rgba(184, 134, 11, 0.7)"
                : "rgba(184, 134, 11, 0.2)"
            }`,
            background:
              selectedChapterIndex === "all"
                ? "rgba(184, 134, 11, 0.15)"
                : "#FAF8F5",
            color: selectedChapterIndex === "all" ? "#B8860B" : "#6B635B",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          ✦ संपूर्ण आख्यान (सभी विषय)
        </button>

        {chapters.map((ch, idx) => {
          const shortTitle = ch.title.split("—")[0].split(":")[0].trim();
          return (
            <button
              key={idx}
              onClick={() => setSelectedChapterIndex(idx)}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 20,
                border: `1px solid ${
                  selectedChapterIndex === idx
                    ? "rgba(184, 134, 11, 0.7)"
                    : "rgba(184, 134, 11, 0.2)"
                }`,
                background:
                  selectedChapterIndex === idx
                    ? "rgba(184, 134, 11, 0.15)"
                    : "#FAF8F5",
                color: selectedChapterIndex === idx ? "#B8860B" : "#4A4238",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span>{ch.icon}</span> {ch.chapterNum}. {shortTitle}
            </button>
          );
        })}
      </div>

      {/* ── NOVELISTIC CHAPTERS (STORYTELLING PROSE) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {displayedChapters.map((chapter, cIdx) => (
          <article
            key={cIdx}
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* CHAPTER HEADER */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#B8860B",
                  marginBottom: 4,
                }}
              >
                <span>{chapter.icon}</span>
                <span>✦ {chapter.chapterNum}. {chapter.title.split("—")[0].trim()}</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 21,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                {chapter.title}
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                {chapter.subtitle}
              </div>
            </div>

            {/* KEY HIGHLIGHT CALLOUT */}
            {chapter.keyHighlight && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  background: "rgba(184, 134, 11, 0.07)",
                  borderLeft: "3px solid #B8860B",
                  borderRadius: "0 8px 8px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#854D0E",
                  lineHeight: 1.5,
                }}
              >
                ✦ <strong>मुख्य संकेत:</strong> {chapter.keyHighlight}
              </div>
            )}

            {/* PARAGRAPHS */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontSize: 15.5,
                lineHeight: 1.85,
                color: "#2A241F",
                fontFamily: "Cormorant Garamond, Georgia, serif",
              }}
            >
              {chapter.paragraphs.map((pText, pIdx) => (
                <p key={pIdx} style={{ margin: 0, textAlign: "justify" }}>
                  {pText}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* ── UPCOMING GOCHAR & BHAVISHYA ROADMAP TIMELINE ── */}
      {upcomingRoadmap && upcomingRoadmap.length > 0 && (
        <div
          style={{
            marginTop: 28,
            padding: "20px 22px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
            border: "1px solid rgba(184, 134, 11, 0.3)",
            borderRadius: 14,
          }}
        >
          <div
            onClick={() => setIsRoadmapExpanded(!isRoadmapExpanded)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#B8860B",
                  marginBottom: 2,
                }}
              >
                ✦ Future Transit Forecaster
              </div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}
              >
                आगामी गोचर एवं भविष्य का टाइमलाइन रोडमैप
              </div>
            </div>

            <button
              style={{
                background: "rgba(184, 134, 11, 0.1)",
                border: "1px solid rgba(184, 134, 11, 0.25)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#B8860B",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span>{isRoadmapExpanded ? "संक्षिप्त करें" : "विस्तृत देखें"}</span>
              {isRoadmapExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {isRoadmapExpanded && (
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              {upcomingRoadmap.map((milestone, mIdx) => (
                <div
                  key={mIdx}
                  style={{
                    padding: "18px 22px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(184, 134, 11, 0.22)",
                    borderRadius: 12,
                    borderLeft: "4px solid #B8860B",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#1A1A1A",
                      }}
                    >
                      {milestone.phaseTitle}
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#B8860B",
                        background: "rgba(184, 134, 11, 0.12)",
                        border: "1px solid rgba(184, 134, 11, 0.25)",
                        padding: "3px 10px",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Calendar size={12} />
                      {milestone.timeWindow}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#854D0E",
                      marginBottom: 6,
                    }}
                  >
                    🪐 <strong>आकाशीय ट्रिगर:</strong> {milestone.planetaryTrigger}
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#1A1A1A",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    🎯 <strong>प्रभाव का क्षेत्र:</strong> {milestone.impactTheme}
                  </div>

                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#4A4238",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {milestone.detailedInsight}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ACTIONABLE DIRECTIVES & REMEDIES ── */}
      {actionableDirective && (
        <div
          style={{
            marginTop: 22,
            padding: "20px 24px",
            background: "rgba(184, 134, 11, 0.05)",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
              color: "#B8860B",
              marginBottom: 8,
            }}
          >
            <ShieldCheck size={16} />
            <span>{actionableDirective.title}</span>
          </div>

          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
              color: "#3D3834",
              lineHeight: 1.6,
            }}
          >
            {actionableDirective.points.map((pt, pIdx) => (
              <li key={pIdx}>{pt}</li>
            ))}
          </ul>

          {actionableDirective.gemstoneOrRemedyNote && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "rgba(184, 134, 11, 0.1)",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                color: "#854D0E",
              }}
            >
              ✦ {actionableDirective.gemstoneOrRemedyNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

