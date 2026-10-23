// src/components/charts/SimpleKundliReportCard.tsx
// ============================================================================
// LUXURY SHASTRIC KUNDLI CONSULTATION DOSSIER CARD
// Editorial, novelistic storytelling layout with clean 3-4 line paragraph blocks:
// - Single cohesive luxury white container with gold border & soft shadow
// - Cormorant Garamond serif headings, elegant Hindi storytelling prose
// - Chapter selector pills with clean topic names (अध्याय 1 to 7 + संपूर्ण आख्यान)
// - Warm parchment article containers (#FAF8F5) with generous padding (24px 28px)
// - Crisp, readable 3-4 lines paragraph style (no nested cluttered boxes)
// - Zero technical jargon (no book names, no raw degrees, no clutter)
// ============================================================================

"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  generateSimpleKundliDossierData,
  generateSimpleKundliDossierMarkdown,
} from "@/lib/astro-engine/simple-kundli-dossier-engine";
import {
  Sparkles,
  Copy,
  Check,
  Printer,
  Compass,
  ArrowRight,
  BookOpen,
  MessageSquare,
} from "lucide-react";

interface SimpleKundliReportCardProps {
  chart: ChartData;
  className?: string;
}

export default function SimpleKundliReportCard({
  chart,
  className = "",
}: SimpleKundliReportCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");

  const data = useMemo(() => {
    return generateSimpleKundliDossierData(chart);
  }, [chart]);

  const markdownContent = useMemo(() => {
    return generateSimpleKundliDossierMarkdown(chart);
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!chart || !data) return null;

  const chaptersMeta = [
    { num: 1, icon: "👑", shortLabel: "१. राजयोग व चुनौतियाँ", title: `कुंडली के ${data.masterRajyogas.length} प्रमुख राजयोग एवं ${data.karmicChallenges.length} मुख्य कार्मिक चुनौतियाँ` },
    { num: 2, icon: "🧠", shortLabel: "२. व्यक्तित्व व भाग्य-कुंजी", title: "व्यक्तित्व, कार्यशैली, सोच एवं भाग्य की गुप्त कुंजी" },
    { num: 3, icon: "💼", shortLabel: "३. करियर, धन व सूक्ष्म-वास्तु", title: "करियर, आजीविका, महालक्ष्मी प्रवाह एवं कार्यक्षेत्र सूक्ष्म-वास्तु" },
    { num: 4, icon: "💍", shortLabel: "४. विवाह व जीवनसाथी", title: "वैवाहिक जीवन, जीवनसाथी का स्वरूप एवं भाग्योदय" },
    { num: 5, icon: "⏳", shortLabel: `५. दशा चक्र व जीवन पड़ाव`, title: `वर्तमान दशा चक्र, समय का आकलन एवं ${data.timelines.milestones.length} प्रमुख जीवन पड़ाव` },
    { num: 6, icon: "🛡️", shortLabel: "६. पिता व गुरु की सीख", title: "पिता व गुरु की संरक्षक सीख (सावधानियाँ एवं जीवन रक्षा)" },
    { num: 7, icon: "💎", shortLabel: "७. अनुकूल रत्न व साधन", title: "अनुकूल रत्न परामर्श एवं दैनिक सात्विक साधन" },
  ];

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
            <span>👑</span>
            <span>✦ SHASTRIC STORYTELLING &amp; LIFE DOSSIER</span>
            <span
              style={{
                fontSize: 10,
                background: "rgba(184, 134, 11, 0.12)",
                padding: "2px 8px",
                borderRadius: 10,
                border: "1px solid rgba(184, 134, 11, 0.3)",
              }}
            >
              संपूर्ण महा-विश्लेषण
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
            {data.nativeName} जी की जन्म कुंडली — प्रामाणिक जीवन आख्यान
          </h3>

          <p
            style={{
              fontSize: 13.5,
              color: "#6B635B",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            वर्तमान समय: {data.timelines.activeAD} · आयु {data.currentAge} वर्ष · {data.masterRajyogas.length} प्रमुख राजयोग · {data.karmicChallenges.length} कार्मिक चुनौतियाँ · विवाह · करियर · रत्न परामर्श
          </p>
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={handleCopy}
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

          <button
            type="button"
            onClick={handlePrint}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 700,
              color: "#6B635B",
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="प्रिंट या पीडीएफ सेव करें"
          >
            <Printer size={14} />
            <span>प्रिंट</span>
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
          &ldquo;{data.displayName} जी के जीवन का आकाशीय विधान: {data.masterRajyogas.length} दैवीय राजयोग, आत्म-शोधन की {data.karmicChallenges.length} कार्मिक चुनौतियाँ और कालचक्र का स्वर्णिम मार्ग&rdquo;
        </div>
      </div>

      {/* ── CHAPTER CHIPS SELECTOR ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
          paddingBottom: 14,
          borderBottom: "1px dashed rgba(184, 134, 11, 0.2)",
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedChapter("all")}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 20,
            border: `1px solid ${
              selectedChapter === "all"
                ? "rgba(184, 134, 11, 0.7)"
                : "rgba(184, 134, 11, 0.2)"
            }`,
            background:
              selectedChapter === "all"
                ? "rgba(184, 134, 11, 0.15)"
                : "#FAF8F5",
            color: selectedChapter === "all" ? "#B8860B" : "#6B635B",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          ✦ संपूर्ण आख्यान (सभी विषय)
        </button>

        {chaptersMeta.map((ch) => (
          <button
            key={ch.num}
            type="button"
            onClick={() => setSelectedChapter(ch.num)}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 20,
              border: `1px solid ${
                selectedChapter === ch.num
                  ? "rgba(184, 134, 11, 0.7)"
                  : "rgba(184, 134, 11, 0.2)"
              }`,
              background:
                selectedChapter === ch.num
                  ? "rgba(184, 134, 11, 0.15)"
                  : "#FAF8F5",
              color: selectedChapter === ch.num ? "#B8860B" : "#4A4238",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <span>{ch.icon}</span> {ch.shortLabel}
          </button>
        ))}
      </div>

      {/* ── NOVELISTIC CHAPTERS CONTAINER (PURE PARAGRAPH STORYTELLING) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* ══════════════════════════════════════════════════════════
            अध्याय १: ३ सर्वोच्च राजयोग एवं २ मुख्य कार्मिक चुनौतियाँ
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 1) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Chapter Header */}
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
                <span>👑</span>
                <span>१. राजयोग व चुनौतियाँ</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                कुंडली के {data.masterRajyogas.length} प्रमुख राजयोग एवं {data.karmicChallenges.length} मुख्य कार्मिक चुनौतियाँ
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                ईश्वरीय वरदान, आंतरिक शक्ति और आत्म-शोधन का स्वर्णिम मार्ग
              </div>
            </div>

            {/* Key Highlight Banner (2-3 lines) */}
            <div
              style={{
                marginBottom: 18,
                padding: "12px 16px",
                background: "rgba(184, 134, 11, 0.08)",
                borderLeft: "3px solid #B8860B",
                borderRadius: "0 8px 8px 0",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#854D0E",
                lineHeight: 1.6,
              }}
            >
              ✦ <strong>मुख्य संकेत:</strong> आपकी कुंडली में {data.masterRajyogas.length} विशिष्ट राजयोग सांसारिक उत्कर्ष तय करते हैं, जबकि {data.karmicChallenges.length} चुनौतियाँ आपको धैर्य और आत्म-अनुशासन का अभ्यास कराती हैं।
            </div>

            {/* Paragraph Prose Flow (Crisp 3-4 lines each) */}
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
              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>{data.displayName} जी</strong>, जब हम आपकी कुंडली को एक समग्र चित्र के रूप में देखते हैं, तो ईश्वर ने आपको {data.masterRajyogas.length} अत्यंत दुर्लभ वरदान दिए हैं, और साथ ही आत्म-विकास के लिए {data.karmicChallenges.length} विशिष्ट परीक्षाएं भी रखी हैं। ये योग केवल किताबी नहीं हैं, बल्कि आपके जीवन में अधिकार, बौद्धिक प्रभुत्व और वित्तीय संप्रभुता के रूप में साकार होंगे।
              </p>

              {data.masterRajyogas.map((yoga, idx) => (
                <p key={yoga.id} style={{ margin: 0, textAlign: "justify" }}>
                  <strong>{yoga.icon} {idx + 1}. {yoga.title}:</strong> {yoga.desc} इसका सीधा सांसारिक परिणाम यह है कि {yoga.outcome}
                </p>
              ))}

              {data.karmicChallenges.map((c, idx) => (
                <p key={c.id} style={{ margin: 0, textAlign: "justify" }}>
                  <strong style={{ color: "#991B1B" }}>⚠️ कार्मिक चुनौती {idx + 1} — {c.title}:</strong> {c.desc}{" "}
                  <span style={{ color: "#991B1B", fontWeight: 600 }}>गुरु समाधान यह है कि {c.advice}</span>
                </p>
              ))}
            </div>
          </article>
        )}

        {/* ══════════════════════════════════════════════════════════
            अध्याय २: व्यक्तित्व, कार्यशैली एवं सोच
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 2) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Header */}
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
                <span>🧠</span>
                <span>२. व्यक्तित्व व भाग्य-कुंजी</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                व्यक्तित्व, कार्यशैली, सोच एवं भाग्य की गुप्त कुंजी
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                आंतरिक स्वभाव, कार्य करने का वास्तविक ढंग और सफलता का गुप्त द्वार
              </div>
            </div>

            {/* Paragraphs in Garamond (Crisp 3-4 lines each) */}
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
              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>मूल स्वभाव व आंतरिक दृष्टिकोण:</strong> {data.personality.lagnaTrait}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>कार्यशैली व एकांत में चिंतन:</strong> {data.personality.houseOutcome}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>आंतरिक द्वंद्व व मनोवैज्ञानिक संतुलन:</strong> {data.personality.hiddenTrait}
              </p>
            </div>

            {/* Destiny Key Banner (3-4 lines) */}
            <div
              style={{
                marginTop: 20,
                padding: "14px 18px",
                background: "linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(254, 243, 199, 0.5) 100%)",
                border: "1px solid rgba(184, 134, 11, 0.35)",
                borderLeft: "4px solid #B8860B",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#854D0E",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ✦ भाग्य का ताला खोलने वाला गुप्त नियम (The Master Destiny Key)
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: "#451A03",
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontWeight: 600,
                }}
              >
                {data.personality.destinyKey}
              </p>
            </div>
          </article>
        )}

        {/* ══════════════════════════════════════════════════════════
            अध्याय ३: करियर, धन संपदा एवं सूक्ष्म-वास्तु
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 3) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Header */}
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
                <span>💼</span>
                <span>३. करियर, धन व सूक्ष्म-वास्तु</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                करियर, आजीविका, महालक्ष्मी प्रवाह एवं कार्यक्षेत्र सूक्ष्म-वास्तु
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                {data.career.roleTitle}
              </div>
            </div>

            {/* Paragraph Prose Flow (Crisp 3-4 lines each) */}
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
              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>व्यावसायिक पहचान व कार्यक्षेत्र:</strong> {data.career.roleSummary}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>सर्वश्रेष्ठ कार्यक्षेत्र:</strong> {data.career.idealFields.map((f, idx) => `${idx + 1}. ${f.title} (${f.desc})। `).join(" ")}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>महालक्ष्मी प्रवाह व वित्तीय नियम:</strong> {data.career.wealthFlow}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>कार्यक्षेत्र एवं शयन सूक्ष्म-वास्तु संरेखण:</strong> कार्य करते समय अपना मुख हमेशा <strong>{data.career.microVastu.deskDirection}</strong> दिशा की ओर रखें तथा रात्रि में शयन करते समय सिरहाना <strong>{data.career.microVastu.sleepDirection}</strong> दिशा में रखें। {data.career.microVastu.explanation}
              </p>
            </div>
          </article>
        )}

        {/* ══════════════════════════════════════════════════════════
            अध्याय ४: वैवाहिक जीवन एवं साझेदारी
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 4) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Header */}
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
                <span>💍</span>
                <span>४. विवाह व जीवनसाथी</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                वैवाहिक जीवन, जीवनसाथी का स्वरूप एवं भाग्योदय
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                {data.marriage.marriageTypeTitle}
              </div>
            </div>

            {/* Paragraph Prose Flow (Crisp 3-4 lines each) */}
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
              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>जीवनसाथी का स्वरूप व मानसिक स्वभाव:</strong> {data.marriage.spouseNature}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>मिलन का माध्यम व स्थान:</strong> {data.marriage.meetingVenue}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>विवाह का स्वरूप (Love vs Arranged):</strong> {data.marriage.marriageTypeExplanation}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>विवाह उपरांत भाग्योदय (कलत्र भाग्य):</strong> {data.marriage.kalatraBhagyaNote}
              </p>
            </div>
          </article>
        )}

        {/* ══════════════════════════════════════════════════════════
            अध्याय ५: वर्तमान दशा चक्र एवं ३ प्रमुख जीवन पड़ाव
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 5) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Header */}
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
                <span>⏳</span>
                <span>५. दशा चक्र व ३ पड़ाव</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                वर्तमान दशा चक्र, समय का आकलन एवं ३ प्रमुख जीवन पड़ाव
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                कालचक्र की चाल: {data.timelines.dashaWindow}
              </div>
            </div>

            {/* Paragraph Prose Flow (Crisp 3-4 lines each) */}
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
              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>वर्तमान कालचक्र एवं वातावरण:</strong> वर्तमान में आप {data.timelines.activeAD} के प्रभाव में हैं। {data.timelines.timeClimate}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>निकट भविष्य का महत्वपूर्ण मोड़ ({data.timelines.turningPoint.dates}):</strong> आगामी समय में आपके कार्यक्षेत्र में {data.timelines.turningPoint.heading} के योग बन रहे हैं। {data.timelines.turningPoint.impact}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>आगामी प्रमुख जीवन पड़ाव:</strong>{" "}
                {data.timelines.milestones.map((m, idx) => (
                  <span key={m.id}>
                    <strong>{m.age} ({m.years}):</strong> {m.title} — {m.desc}
                    {idx < data.timelines.milestones.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </div>
          </article>
        )}

        {/* ══════════════════════════════════════════════════════════
            अध्याय ६: पिता व गुरु की संरक्षक सीख (सावधानियाँ)
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 6) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Header */}
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
                <span>🛡️</span>
                <span>६. पिता व गुरु की सीख</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                पिता व गुरु की संरक्षक सीख (सावधानियाँ एवं जीवन रक्षा)
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                स्नेहपूर्ण मार्गदर्शन, ताकि आप किसी भी भटकाव, विश्वासघात या अनावश्यक हानि से बच सकें
              </div>
            </div>

            {/* Paragraph Prose Flow (Crisp 3-4 lines each) */}
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
              {data.fatherlyAdvice.map((a, idx) => (
                <p key={a.id} style={{ margin: 0, textAlign: "justify" }}>
                  <strong>🛡️ सीख #{idx + 1} ({a.title}):</strong> {a.advice}
                </p>
              ))}
            </div>
          </article>
        )}

        {/* ══════════════════════════════════════════════════════════
            अध्याय ७: अनुकूल रत्न एवं दैनिक साधन
        ══════════════════════════════════════════════════════════ */}
        {(selectedChapter === "all" || selectedChapter === 7) && (
          <article
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 14,
              padding: "24px 28px",
              position: "relative",
            }}
          >
            {/* Header */}
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
                <span>💎</span>
                <span>७. अनुकूल रत्न व साधन</span>
              </div>

              <h4
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  margin: "0 0 4px 0",
                }}
              >
                अनुकूल रत्न परामर्श एवं दैनिक सात्विक साधन
              </h4>

              <div style={{ fontSize: 13, color: "#6B635B", fontWeight: 500 }}>
                शरीर व आभामंडल को ऊर्जावान रखने हेतु प्रामाणिक रत्न विधान व नित्य नियम
              </div>
            </div>

            {/* Paragraph Prose Flow (Crisp 3-4 lines each) */}
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
              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>अनुकूल रत्न परामर्श ({data.gemstone.primaryStone}):</strong> आपकी कुंडली की समग्र ऊर्जा और बौद्धिक तेज को सक्रिय रखने हेतु <strong>{data.gemstone.primaryStone} ({data.gemstone.englishStone})</strong> धारण करना सर्वोत्तम है। इसे {data.gemstone.metal} में बनवाकर {data.gemstone.finger} में {data.gemstone.dayTime} धारण करें। इसका उप-रत्न {data.gemstone.alternative} भी समान फल देता है। {data.gemstone.benefits}
              </p>

              <p style={{ margin: 0, textAlign: "justify" }}>
                <strong>{data.remedies.length} दैनिक सात्विक साधन:</strong>{" "}
                {data.remedies.map((r, idx) => (
                  <span key={r.id}>
                    <strong>{r.icon} {idx + 1}. {r.title}:</strong> {r.practice} ({r.benefit})
                    {idx < data.remedies.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </div>
          </article>
        )}
      </div>

      {/* ── CLOSING INSPIRATION & INTERACTIVE CHAT ── */}
      <div
        style={{
          marginTop: 26,
          padding: "20px 24px",
          background: "linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(250, 248, 245, 0.95) 100%)",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Sparkles size={18} color="#B8860B" />
          <h4
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 19,
              fontWeight: 700,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            आशीर्वचन एवं भावी दिशा
          </h4>
        </div>

        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: 15,
            lineHeight: 1.8,
            color: "#2A241F",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          {data.conclusion}
        </p>

        {/* Interactive Chat Questions */}
        <div style={{ borderTop: "1px dashed rgba(184, 134, 11, 0.25)", paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#875C06", textTransform: "uppercase", marginBottom: 10 }}>
            💬 इस विश्लेषण के आधार पर गुरु/AI से तुरंत पूछें:
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              `मेरे ${data.masterRajyogas[0]?.title || "राजयोग"} का सबसे बड़ा आर्थिक लाभ किस वर्ष में मिलेगा?`,
              `विवाह के बाद जीवनसाथी के आने से मेरे करियर पर क्या प्रभाव पड़ेगा?`,
              `${data.gemstone.primaryStone} धारण करने की शुद्ध वैदिक विधि क्या है?`,
            ].map((q, idx) => (
              <a
                key={idx}
                href={`/dashboard/chat?q=${encodeURIComponent(q)}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: "#FFFFFF",
                  color: "#78350F",
                  border: "1px solid rgba(184, 134, 11, 0.3)",
                  textDecoration: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                  transition: "all 0.15s ease",
                }}
              >
                <MessageSquare size={13} color="#B8860B" />
                <span>{q}</span>
                <ArrowRight size={13} color="#B8860B" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
