"use client";

import React, { useState, useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  generateMasterKundliDossier,
  type MasterDossierResult,
  type StorytellingChapter,
} from "@/lib/astro-engine/master-kundli-dossier";
import {
  BookOpen,
  Sparkles,
  Printer,
  Copy,
  Check,
  TableProperties,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface MasterKundliDossierPanelProps {
  chart: ChartData;
  onPrint?: () => void;
}

export default function MasterKundliDossierPanel({
  chart,
  onPrint,
}: MasterKundliDossierPanelProps) {
  const [viewMode, setViewMode] = useState<"story" | "table">("story");
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");
  const [copied, setCopied] = useState(false);

  const dossier: MasterDossierResult = useMemo(() => {
    return generateMasterKundliDossier(chart);
  }, [chart]);

  const {
    birthProfile,
    planetaryMatrix,
    keyYogas,
    karmicVulnerabilities,
    dashaTimeline,
    remedies,
    gocharAnalysis,
    storytellingChapters,
  } = dossier;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleCopyStory = () => {
    const fullStory = `✦ ${birthProfile.name} जी की संपूर्ण जन्म कुंडली जीवन-गाथा (7 अध्यायों में)
जन्म: ${birthProfile.dobFormatted} | ${birthProfile.tob} | ${birthProfile.city}
लग्न: ${birthProfile.lagnaRashi} · राशि: ${birthProfile.moonRashi} (${birthProfile.nakshatraName} P${birthProfile.nakshatraPada})

${storytellingChapters
  .map(
    (ch) => `==============================
${ch.pillarTitle}
${ch.chapterSubtitle}
==============================
${ch.paragraphs.join("\n\n")}
`
  )
  .join("\n\n")}`;

    navigator.clipboard.writeText(fullStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeChapters = useMemo(() => {
    if (selectedChapter === "all") return storytellingChapters;
    return storytellingChapters.filter((c) => c.pillarNum === selectedChapter);
  }, [selectedChapter, storytellingChapters]);

  return (
    <div className="master-kundli-dossier" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── PRINT & STYLING ── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .master-kundli-dossier, .master-kundli-dossier * {
            visibility: visible;
          }
          .master-kundli-dossier {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── LUXURY EDITORIAL HERO BANNER ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAF7F0 0%, #F5EFE0 50%, #FAF8F5 100%)",
          border: "2px solid #C8A030",
          borderRadius: 22,
          padding: "28px 32px",
          boxShadow: "0 10px 34px rgba(200, 160, 48, 0.12)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 840 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 14px",
                borderRadius: 999,
                background: "rgba(184, 134, 11, 0.14)",
                border: "1px solid rgba(184, 134, 11, 0.35)",
                color: "#875C06",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              <Sparkles size={13} />
              <span>वैदिक व जैमिनी जीवन-दर्शन (The Complete Astrological Biography)</span>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#1A1A1A",
                margin: "4px 0 10px 0",
                lineHeight: 1.25,
              }}
            >
              {birthProfile.name} जी की संपूर्ण जन्म कुंडली — कहानी की तरह
            </h1>

            <p style={{ margin: 0, fontSize: 14.5, color: "#4A4238", lineHeight: 1.7 }}>
              जैसे कोई अनुभवी मार्गदर्शक ज्योतिषी आपके सम्मुख बैठकर आपकी आत्मा के सफर, अंतर्मन के द्वंद्व, जन्मजात शक्तियों, महादशा के मोड़ों और आने वाले स्वर्णिम समय की प्रामाणिक कहानी सुना रहा हो...
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginTop: 14,
                fontSize: 13,
                color: "#875C06",
                fontWeight: 600,
              }}
            >
              <span>🌅 लग्न: {birthProfile.lagnaRashi}</span>
              <span>•</span>
              <span>🌙 चंद्र: {birthProfile.moonRashi}</span>
              <span>•</span>
              <span>⭐ नक्षत्र: {birthProfile.nakshatraName} P{birthProfile.nakshatraPada}</span>
              <span>•</span>
              <span>⏳ सक्रिय महादशा: {dashaTimeline.activeMahadasha} / {dashaTimeline.activeAntardasha}</span>
            </div>
          </div>

          {/* Action Buttons & View Mode Toggle */}
          <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setViewMode("story")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: viewMode === "story" ? "1px solid #875C06" : "1px solid rgba(184, 134, 11, 0.25)",
                  background: viewMode === "story" ? "#875C06" : "#FFFFFF",
                  color: viewMode === "story" ? "#FFFFFF" : "#6B635B",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <BookOpen size={14} />
                <span>कहानी विधा (Story)</span>
              </button>

              <button
                onClick={() => setViewMode("table")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: viewMode === "table" ? "1px solid #875C06" : "1px solid rgba(184, 134, 11, 0.25)",
                  background: viewMode === "table" ? "#875C06" : "#FFFFFF",
                  color: viewMode === "table" ? "#FFFFFF" : "#6B635B",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <TableProperties size={14} />
                <span>तकनीकी तालिका (Table)</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleCopyStory}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(184, 134, 11, 0.3)",
                  background: "#FFFFFF",
                  color: "#875C06",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy Story"}</span>
              </button>

              <button
                onClick={handlePrint}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid #875C06",
                  background: "#875C06",
                  color: "#FFFFFF",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Printer size={14} />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── CHAPTER SELECTOR CHIPS ── */}
        {viewMode === "story" && (
          <div
            className="no-print"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              marginTop: 22,
              paddingTop: 16,
              borderTop: "1px solid rgba(184, 134, 11, 0.2)",
            }}
          >
            <button
              onClick={() => setSelectedChapter("all")}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: selectedChapter === "all" ? "1px solid #875C06" : "1px solid rgba(184, 134, 11, 0.25)",
                background: selectedChapter === "all" ? "#875C06" : "#FFFFFF",
                color: selectedChapter === "all" ? "#FFFFFF" : "#6B635B",
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              📖 संपूर्ण जीवन-गाथा (सभी 7 अध्याय)
            </button>

            {storytellingChapters.map((ch) => (
              <button
                key={ch.pillarNum}
                onClick={() => setSelectedChapter(ch.pillarNum)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 20,
                  border: selectedChapter === ch.pillarNum ? "1px solid #875C06" : "1px solid rgba(184, 134, 11, 0.25)",
                  background: selectedChapter === ch.pillarNum ? "#875C06" : "#FFFFFF",
                  color: selectedChapter === ch.pillarNum ? "#FFFFFF" : "#6B635B",
                  fontSize: 12.5,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {ch.icon} अध्याय {ch.pillarNum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 📖 STORYTELLING PARAGRAPH MODE (DEFAULT NOVELISTIC PROSE)                  */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "story" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {activeChapters.map((ch) => (
            <article
              key={ch.pillarNum}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(184, 134, 11, 0.25)",
                borderRadius: 20,
                padding: "32px 36px",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.02)",
              }}
            >
              {/* Chapter Header */}
              <div style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)", paddingBottom: 16, marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{ch.icon}</span>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 25,
                        fontWeight: 800,
                        color: "#1A1A1A",
                        lineHeight: 1.25,
                      }}
                    >
                      {ch.pillarTitle}
                    </h2>
                    <p style={{ margin: "4px 0 0 0", fontSize: 13.5, color: "#875C06", fontWeight: 600 }}>
                      {ch.chapterSubtitle}
                    </p>
                  </div>
                </div>

                {/* Golden Takeaway Pill */}
                {ch.keyHighlight && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "8px 14px",
                      background: "rgba(184, 134, 11, 0.08)",
                      borderLeft: "3px solid #875C06",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "#6D4C04",
                      fontWeight: 600,
                      lineHeight: 1.5,
                    }}
                  >
                    ✦ <strong>मर्म (Key Insight):</strong> {ch.keyHighlight}
                  </div>
                )}
              </div>

              {/* Storytelling Paragraphs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {ch.paragraphs.map((pText, pIdx) => (
                  <p
                    key={pIdx}
                    style={{
                      margin: 0,
                      fontSize: 15.5,
                      lineHeight: 1.85,
                      color: "#2C2623",
                      textAlign: "justify",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {pText}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 📊 TECHNICAL COMPACT MATRIX MODE (OPTIONAL REFERENCE)                     */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "table" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Planetary Matrix */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              borderRadius: 18,
              padding: "24px 26px",
            }}
          >
            <h3 style={{ margin: "0 0 14px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
              ग्रह स्थिति एवं अंशात्मक विवरण (Planetary Matrix)
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(184, 134, 11, 0.3)", background: "#FAF8F5" }}>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>ग्रह</th>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>राशि</th>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>भाव</th>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>अंश (DMS)</th>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>गरिमा</th>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>नक्षत्र</th>
                    <th style={{ padding: "10px 12px", color: "#875C06" }}>चर कारक</th>
                  </tr>
                </thead>
                <tbody>
                  {planetaryMatrix.map((item, idx) => (
                    <tr key={item.planet} style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.12)", background: idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>{item.hindiName}</td>
                      <td style={{ padding: "10px 12px" }}>{item.sign}</td>
                      <td style={{ padding: "10px 12px" }}>{item.houseName}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#875C06" }}>{item.degreeFormatted}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 12, fontWeight: 700, color: item.dignityColor, background: `${item.dignityColor}15` }}>
                          {item.dignity}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>{item.nakshatra} P{item.pada}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#875C06" }}>{item.charaKaraka}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER CALLOUT ── */}
      <div
        className="no-print"
        style={{
          textAlign: "center",
          padding: "16px",
          background: "rgba(184, 134, 11, 0.05)",
          borderRadius: 14,
          border: "1px dashed rgba(184, 134, 11, 0.3)",
          fontSize: 13,
          color: "#6B635B",
        }}
      >
        ✦ यह संपूर्ण जीवन-गाथा नासा/Moshier अयनांश, महर्षि पराशर होराशास्त्र, जैमिनी सूत्र, लाल किताब और वास्तविक गोचर गणना पर आधारित है।
      </div>
    </div>
  );
}
