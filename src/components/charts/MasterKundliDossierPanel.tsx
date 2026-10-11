"use client";

import React, { useState, useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  generateMasterKundliDossier,
  type MasterDossierResult,
} from "@/lib/astro-engine/master-kundli-dossier";
import {
  Sparkles,
  Printer,
  Copy,
  Check,
  ShieldAlert,
  Gem,
  Compass,
  Calendar,
  Activity,
  HeartHandshake,
  Flame,
  ArrowRight,
  TrendingUp,
  Moon,
  Sun,
  Clock,
  MapPin,
} from "lucide-react";

interface MasterKundliDossierPanelProps {
  chart: ChartData;
  onPrint?: () => void;
}

export default function MasterKundliDossierPanel({
  chart,
  onPrint,
}: MasterKundliDossierPanelProps) {
  const [selectedSection, setSelectedSection] = useState<string>("all");
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
  } = dossier;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleCopy = () => {
    const text = `✦ ${birthProfile.name} जी की संपूर्ण जन्म कुंडली महा-विश्लेषण (7 Pillars)
1. आधारभूत विवरण: जन्म ${birthProfile.dobFormatted} | ${birthProfile.tob} | ${birthProfile.city}
- लग्न: ${birthProfile.lagnaRashi} (${birthProfile.lagnaDegreeFormatted})
- चंद्र राशि: ${birthProfile.moonRashi} (${birthProfile.nakshatraName} P${birthProfile.nakshatraPada}) | आराध्य: ${birthProfile.aradhyaDeity}
- सूर्य: ${birthProfile.sunRashi} (${birthProfile.sunDignity})

2. मुख्य राजयोग:
${keyYogas.map((y) => `• ${y.name}: ${y.description}`).join("\n")}

3. चुनौतियाँ एवं सतर्कता:
${karmicVulnerabilities.map((v) => `• ${v.title}: ${v.description}`).join("\n")}

4. सक्रिय महादशा: ${dashaTimeline.activeMahadasha} · ${dashaTimeline.activeAntardasha} (${dashaTimeline.activeAntardashaSpan})
- ${dashaTimeline.upcomingGoldenPhaseTitle} (${dashaTimeline.upcomingGoldenPhaseWindow})

5. अचूक उपाय:
• रत्न नियम: ${remedies.gemstoneVerdict.strictProhibition} — ${remedies.gemstoneVerdict.prohibitionReason}
• अनुशंसित रत्न: ${remedies.gemstoneVerdict.recommendedGems.join(", ")}
• धातु उपाय: ${remedies.metalRemedies.map((m) => `${m.item} (${m.purpose})`).join(", ")}

6. वर्तमान गोचर: ${gocharAnalysis.transitSummary} | साढ़े साती: ${gocharAnalysis.sadeSatiStatus.phase}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="master-kundli-dossier" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

      {/* ── HEADER CARD ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAF8F5 0%, #F5EFE0 50%, #FAF8F5 100%)",
          border: "2px solid #C8A030",
          borderRadius: 20,
          padding: "24px 28px",
          boxShadow: "0 8px 30px rgba(200, 160, 48, 0.12)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 999,
                background: "rgba(184, 134, 11, 0.12)",
                border: "1px solid rgba(184, 134, 11, 0.3)",
                color: "#875C06",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              <Sparkles size={13} />
              <span>वैदिक व जैमिनी संपूर्ण महा-विश्लेषण (7 Master Pillars)</span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#1A1A1A",
                margin: "4px 0 6px 0",
                lineHeight: 1.2,
              }}
            >
              {birthProfile.name} जी की संपूर्ण जन्म कुंडली (Cosmic Blueprint)
            </h2>

            <p style={{ margin: 0, fontSize: 13.5, color: "#6B635B", lineHeight: 1.6 }}>
              लग्न: <strong style={{ color: "#1A1A1A" }}>{birthProfile.lagnaRashi}</strong> · 
              चंद्र: <strong style={{ color: "#1A1A1A" }}>{birthProfile.moonRashi}</strong> · 
              नक्षत्र: <strong style={{ color: "#875C06" }}>{birthProfile.nakshatraName} (चरण {birthProfile.nakshatraPada})</strong> · 
              सक्रिय दशा: <strong style={{ color: "#875C06" }}>{dashaTimeline.activeMahadasha} / {dashaTimeline.activeAntardasha}</strong>
            </p>
          </div>

          <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 10,
                border: "1px solid rgba(184, 134, 11, 0.3)",
                background: "#FFFFFF",
                color: "#875C06",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy Report"}</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 10,
                border: "1px solid #875C06",
                background: "#875C06",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(135, 92, 6, 0.2)",
              }}
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* ── PILLAR TABS ── */}
        <div
          className="no-print"
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(184, 134, 11, 0.2)",
          }}
        >
          {[
            { id: "all", label: "✨ सभी 7 स्तंभ (All 7 Pillars)" },
            { id: "profile", label: "1. जन्म विवरण" },
            { id: "planets", label: "2. ग्रह स्थिति" },
            { id: "yogas", label: "3. मुख्य राजयोग" },
            { id: "vulnerabilities", label: "4. चुनौतियाँ" },
            { id: "dasha", label: "5. महादशा चक्र" },
            { id: "remedies", label: "6. अचूक उपाय" },
            { id: "gochar", label: "7. वर्तमान गोचर" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSection(tab.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: selectedSection === tab.id ? "1px solid #875C06" : "1px solid rgba(184, 134, 11, 0.2)",
                background: selectedSection === tab.id ? "#875C06" : "#FFFFFF",
                color: selectedSection === tab.id ? "#FFFFFF" : "#6B635B",
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 1. आधारभूत जन्म विवरण (BIRTH PROFILE)                                     */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "profile") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>📜</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                1. आधारभूत जन्म विवरण (Birth Profile)
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                वैदिक अयनांश व नासा-मानक पंचांगीय आधारशिला
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            <div style={{ background: "#FAF8F5", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.15)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#875C06", fontWeight: 700 }}>नाम व जन्म तिथि</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                {birthProfile.name}
              </div>
              <div style={{ fontSize: 13, color: "#6B635B", marginTop: 2 }}>
                {birthProfile.dobFormatted} | {birthProfile.tob}
              </div>
            </div>

            <div style={{ background: "#FAF8F5", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.15)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#875C06", fontWeight: 700 }}>जन्म स्थान व अक्षांश</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                {birthProfile.city}
              </div>
              <div style={{ fontSize: 13, color: "#6B635B", marginTop: 2 }}>
                🌐 {birthProfile.coordinates}
              </div>
            </div>

            <div style={{ background: "#FAF8F5", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.15)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#875C06", fontWeight: 700 }}>लग्न (Ascendant)</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                {birthProfile.lagnaRashi} ({birthProfile.lagnaDegreeFormatted})
              </div>
              <div style={{ fontSize: 13, color: "#6B635B", marginTop: 2 }}>
                लग्नेश {birthProfile.lagnaLord} → {birthProfile.lagnaLordPlacement}
              </div>
            </div>

            <div style={{ background: "#FAF8F5", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(184, 134, 11, 0.15)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#875C06", fontWeight: 700 }}>चंद्र राशि व जन्म नक्षत्र</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                {birthProfile.moonRashi} ({birthProfile.nakshatraName} P{birthProfile.nakshatraPada})
              </div>
              <div style={{ fontSize: 13, color: "#6B635B", marginTop: 2 }}>
                नक्षत्र स्वामी: {birthProfile.nakshatraLord} | आराध्य: {birthProfile.aradhyaDeity}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 2. ग्रहों की स्थिति (PLANETARY MATRIX)                                     */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "planets") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🪐</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                2. ग्रहों की स्थिति (Planetary Placements)
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                अंश, गरिमा, नक्षत्र, चरण व जैमिनी चर कारक (AK, AmK, DK)
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(184, 134, 11, 0.3)", background: "#FAF8F5" }}>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>ग्रह (Planet)</th>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>राशि (Sign)</th>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>भाव (House)</th>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>अंश (Degree)</th>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>स्थिति / गरिमा (Dignity)</th>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>नक्षत्र व चरण</th>
                  <th style={{ padding: "12px 14px", color: "#875C06", fontWeight: 700 }}>चर कारक</th>
                </tr>
              </thead>
              <tbody>
                {planetaryMatrix.map((item, idx) => (
                  <tr
                    key={item.planet}
                    style={{
                      borderBottom: "1px solid rgba(184, 134, 11, 0.12)",
                      background: idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5",
                    }}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#1A1A1A" }}>
                      {item.hindiName}
                      {item.retrograde && <span style={{ color: "#dc2626", fontSize: 11, marginLeft: 4 }}>(R)</span>}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#3D3834" }}>{item.sign}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#1A1A1A" }}>
                      {item.houseName}
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "monospace", color: "#875C06", fontWeight: 600 }}>
                      {item.degreeFormatted}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          color: item.dignityColor,
                          background: `${item.dignityColor}18`,
                          border: `1px solid ${item.dignityColor}35`,
                        }}
                      >
                        {item.dignity}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#3D3834" }}>
                      {item.nakshatra} (P{item.pada})
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {item.charaKaraka !== "—" ? (
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: 6,
                            background: "rgba(184, 134, 11, 0.12)",
                            color: "#875C06",
                            fontWeight: 700,
                            fontSize: 11.5,
                          }}
                        >
                          {item.charaKaraka}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 3. कुंडली के दुर्लभ एवं शुभ योग (KEY YOGAS)                                 */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "yogas") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>👑</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                3. कुंडली के दुर्लभ एवं अत्यंत शुभ योग (Key Strengths &amp; Yogas)
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                राजयोग, धन योग व प्राकृतिक सामर्थ्य का प्रामाणिक प्रमाण
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {keyYogas.map((yoga, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  boxShadow: "0 4px 16px rgba(184, 134, 11, 0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 800, color: "#1A1A1A" }}>{yoga.name}</div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(184, 134, 11, 0.12)",
                      color: "#875C06",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {yoga.type}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#875C06", fontWeight: 600, marginBottom: 8 }}>
                  {yoga.description}
                </div>
                <div style={{ fontSize: 12.8, color: "#4A4238", lineHeight: 1.6 }}>
                  {yoga.shastricSignificance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 4. चुनौतियाँ एवं सतर्कता (KARMIC VULNERABILITIES)                         */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "vulnerabilities") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                4. चुनौतियाँ एवं ध्यान देने योग्य पहलू (Karmic Vulnerabilities)
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                संवेदनशील भाव, वाणी/वित्तीय जोखिम और मनोवैज्ञानिक संतुलन सूत्र
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {karmicVulnerabilities.map((vuln, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFBFB",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                  borderRadius: 14,
                  padding: "18px 20px",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: "#991b1b", marginBottom: 6 }}>
                  {vuln.title}
                </div>
                <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, marginBottom: 10 }}>
                  {vuln.description}
                </div>
                <div
                  style={{
                    background: "rgba(220, 38, 38, 0.05)",
                    borderLeft: "3px solid #dc2626",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 12.5,
                    color: "#7f1d1d",
                    fontWeight: 600,
                  }}
                >
                  💡 <strong>समाधान / आचरण नियम:</strong> {vuln.mitigationGuidance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 5. वर्तमान महादशा एवं समय चक्र (DASHA TIMELINE)                           */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "dasha") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                5. वर्तमान महादशा एवं समय चक्र (Dasha &amp; Life Phase)
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                सक्रिय विंशोत्तरी कालखंड व आगामी स्वर्णिम मोड़ (Golden Windows)
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 18 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #FAF8F5 0%, #F5EFE0 100%)",
                border: "2px solid #C8A030",
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#875C06", fontWeight: 700 }}>
                वर्तमान सक्रिय दशा (Active Now)
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginTop: 4 }}>
                {dashaTimeline.activeMahadasha} · {dashaTimeline.activeAntardasha}
              </div>
              <div style={{ fontSize: 12.5, color: "#875C06", fontWeight: 600, marginTop: 2 }}>
                अवधि: {dashaTimeline.activeAntardashaSpan}
              </div>
              <p style={{ fontSize: 13, color: "#3D3834", lineHeight: 1.6, marginTop: 10, marginBottom: 0 }}>
                {dashaTimeline.currentPhaseInsight}
              </p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                border: "2px solid #16a34a",
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#15803d", fontWeight: 700 }}>
                आगामी स्वर्णिम काल (Next Golden Window)
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#14532d", marginTop: 4 }}>
                {dashaTimeline.upcomingGoldenPhaseTitle}
              </div>
              <div style={{ fontSize: 12.5, color: "#15803d", fontWeight: 600, marginTop: 2 }}>
                अवधि: {dashaTimeline.upcomingGoldenPhaseWindow}
              </div>
              <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6, marginTop: 10, marginBottom: 0 }}>
                {dashaTimeline.upcomingGoldenPhaseInsight}
              </p>
            </div>
          </div>

          {/* Antardasha Sequence Pill Tracker */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#875C06", textTransform: "uppercase", marginBottom: 8 }}>
              महादशा अंतर्गत अंतर्दशा क्रम:
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
              {dashaTimeline.allAntardashas.map((ad, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: ad.isActive ? "2px solid #875C06" : "1px solid rgba(184, 134, 11, 0.2)",
                    background: ad.isActive ? "rgba(184, 134, 11, 0.15)" : "#FAF8F5",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: ad.isActive ? "#875C06" : "#1A1A1A" }}>
                    {ad.planet} {ad.isActive && "✦"}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B635B", marginTop: 2 }}>
                    {ad.startDate.split(" ").slice(-1)[0]} – {ad.endDate.split(" ").slice(-1)[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 6. अचूक एवं प्रभावी शास्त्रीय उपाय (KEY REMEDIES)                         */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "remedies") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🕉️</span>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                6. अचूक एवं प्रभावी उपाय (Key Vedic Remedies)
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                रत्न निर्णय, धातु उपाय, देव आराधना व व्यावहारिक आचरण नियम
              </p>
            </div>
          </div>

          {/* Strict Gemstone Decision Banner */}
          <div
            style={{
              background: "#FFFBF7",
              border: "1px solid #C8A030",
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>💎</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A" }}>
                रत्न विज्ञान निर्णय (Gemstone Prescription &amp; Prohibition)
              </span>
            </div>

            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#991B1B",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              ⚠️ {remedies.gemstoneVerdict.strictProhibition}
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "#7F1D1D", marginTop: 4 }}>
                {remedies.gemstoneVerdict.prohibitionReason}
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#1A1A1A", lineHeight: 1.6 }}>
              <strong>सर्वोत्तम व सुरक्षित रत्न:</strong>
              <ul style={{ margin: "6px 0", paddingLeft: 20 }}>
                {remedies.gemstoneVerdict.recommendedGems.map((g, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {g}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: 12, color: "#875C06", marginTop: 4 }}>
                {remedies.gemstoneVerdict.wearingInstructions}
              </div>
            </div>
          </div>

          {/* Metal & Spiritual Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, marginBottom: 14 }}>
            {/* Metal Remedies */}
            <div style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#875C06", marginBottom: 8 }}>
                🪙 लाल किताब धातु उपाय (Metal Remedies)
              </div>
              {remedies.metalRemedies.map((m, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>• {m.item} ({m.metal})</div>
                  <div style={{ fontSize: 12, color: "#6B635B" }}>उद्देश्य: {m.purpose}</div>
                  <div style={{ fontSize: 12, color: "#3D3834", fontWeight: 500, marginTop: 2 }}>विधि: {m.method}</div>
                </div>
              ))}
            </div>

            {/* Spiritual Practices */}
            <div style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#875C06", marginBottom: 8 }}>
                🪔 देव आराधना व शिव-साधना (Spiritual Practices)
              </div>
              {remedies.spiritualPractices.map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>• {s.deity}</div>
                  <div style={{ fontSize: 12, color: "#3D3834" }}>{s.practice} ({s.timing})</div>
                  <div style={{ fontSize: 12, color: "#15803d", fontWeight: 600, marginTop: 2 }}>फल: {s.benefit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Conduct Rules */}
          <div style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#875C06", marginBottom: 6 }}>
              🛡️ व्यावहारिक आचरण नियम (Conduct Discipline)
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#3D3834", lineHeight: 1.6 }}>
              {remedies.conductDiscipline.map((c, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* 7. वर्तमान गोचर एवं तात्कालिक प्रभाव (CURRENT TRANSITS & GOCHAR)         */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "gochar") && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 18,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🌌</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
                  7. वर्तमान गोचर एवं तात्कालिक प्रभाव (Current Planetary Transits)
                </h3>
                <p style={{ margin: 0, fontSize: 12.5, color: "#6B635B" }}>
                  शनि, गुरु, राहु-केतु का रियल-टाइम गोचर व तात्कालिक दिशा-निर्देश
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: gocharAnalysis.sadeSatiStatus.isActive ? "rgba(220, 38, 38, 0.1)" : "rgba(22, 163, 74, 0.1)",
                border: gocharAnalysis.sadeSatiStatus.isActive ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(22, 163, 74, 0.3)",
                color: gocharAnalysis.sadeSatiStatus.isActive ? "#991b1b" : "#15803d",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              {gocharAnalysis.sadeSatiStatus.phase}
            </div>
          </div>

          <div
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 16,
              fontSize: 13,
              color: "#3D3834",
              lineHeight: 1.6,
            }}
          >
            <strong>गोचर सारांश:</strong> {gocharAnalysis.transitSummary}
            <div style={{ fontSize: 12, color: "#6B635B", marginTop: 4 }}>
              {gocharAnalysis.sadeSatiStatus.description}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 14 }}>
            {gocharAnalysis.majorPlanets.map((tp, idx) => (
              <div
                key={idx}
                style={{
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.2)",
                  borderRadius: 14,
                  padding: "18px 20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A" }}>{tp.planet}</div>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: "rgba(184, 134, 11, 0.12)",
                      color: "#875C06",
                    }}
                  >
                    {tp.transitSign}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: "#875C06", fontWeight: 600, marginBottom: 6 }}>
                  {tp.impactTheme} (नक्षत्र: {tp.nakshatra})
                </div>

                <div style={{ fontSize: 12.8, color: "#3D3834", lineHeight: 1.6 }}>
                  {tp.actionableGuidance}
                </div>
              </div>
            ))}
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
        ✦ यह संपूर्ण विश्लेषण नासा/Moshier अयनांश, पराशरी बृहत्पाराशर होराशास्त्र, जैमिनी सूत्र एवं लाल किताब सिद्धांतों पर आधारित है।
      </div>
    </div>
  );
}

