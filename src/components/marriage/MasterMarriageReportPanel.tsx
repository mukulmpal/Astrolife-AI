"use client";

import React, { useState } from "react";
import { type MasterMarriageReport } from "@/lib/astro-engine/master-marriage-report";

interface MasterMarriageReportPanelProps {
  report: MasterMarriageReport;
  onPrint?: () => void;
  onSelectDate?: (date: string) => void;
}

export default function MasterMarriageReportPanel({
  report,
  onPrint,
  onSelectDate,
}: MasterMarriageReportPanelProps) {
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [targetDate, setTargetDate] = useState<string>(
    report.timingAndMuhurat?.targetWeddingDate || "2027-01-24"
  );
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleCopySummary = () => {
    const text = `👑 ASTROLIFE MASTER MARRIAGE REPORT
वर: ${report.couple.partner1.name} | कन्या: ${report.couple.partner2.name}
अष्टकूट गुण: ${report.ashtakoot.totalScore}/${report.ashtakoot.maxScore} (${report.ashtakoot.tierTitleHindi})
मंगल साम्यता: ${report.mangalSamyam.partner1Paap} vs ${report.mangalSamyam.partner2Paap} (अंतर: ${report.mangalSamyam.paapDifference} - ${report.mangalSamyam.verdict})
नवांश D9 अक्ष: ${report.d9NavamshaCrossAudit.axisRelation} (${report.d9NavamshaCrossAudit.partner1D9Lagna} ↔ ${report.d9NavamshaCrossAudit.partner2D9Lagna})
शयन सुख (H12): ${report.d9NavamshaCrossAudit.bedroomBlissIndex}
24 जनवरी 2027 गोचर: ${report.timingAndMuhurat.timingVerdict}
निष्कर्ष: ${report.executiveSummaryHindi}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const { couple, ashtakoot, mangalSamyam, kalpurush7thAudit, d9NavamshaCrossAudit, kpDynamics, seventhHouseNakshatraAudit, punarbuAudit, timingAndMuhurat, practicalRemedies, separativeAndDirections } = report;

  return (
    <div className="master-marriage-dossier" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── PRINT & STYLING OVERRIDES ── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .master-marriage-dossier, .master-marriage-dossier * {
            visibility: visible;
          }
          .master-marriage-dossier {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── TOP HERO BANNER ── */}
      <div
        className="header-card"
        style={{
          background: "linear-gradient(135deg, #FFFDF8 0%, #FBF6EB 100%)",
          border: "2px solid rgba(184,134,11,0.35)",
          borderRadius: 20,
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(184,134,11,0.08)",
        }}
      >
        <div className="header-orb" style={{ opacity: 0.15 }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
          {/* Tag & Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,0.12)", border: "1px solid rgba(184,134,11,0.3)", borderRadius: 20, padding: "5px 14px" }}>
              <span style={{ fontSize: 13 }}>👑</span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#B8860B" }}>
                समेकित विवाह महा-रिपोर्ट (Master Marriage Dossier)
              </span>
            </div>

            <div className="no-print" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={handleCopySummary}
                style={{
                  background: copied ? "rgba(34,197,94,0.15)" : "#FFFFFF",
                  border: `1px solid ${copied ? "#22c55e" : "rgba(184,134,11,0.3)"}`,
                  color: copied ? "#15803d" : "#B8860B",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {copied ? "✓ सारांश कॉपी हुआ" : "📋 सारांश कॉपी करें"}
              </button>

              <button
                onClick={handlePrint}
                style={{
                  background: "linear-gradient(135deg, #B8860B, #8B6508)",
                  border: "none",
                  color: "#FFFFFF",
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 8px rgba(184,134,11,0.25)",
                }}
              >
                🖨️ प्रिंट / सेव PDF
              </button>
            </div>
          </div>

          {/* Couple Identification */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", margin: "16px 0 20px" }}>
            {/* Groom / Partner 1 */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#B8860B", fontWeight: 700, marginBottom: 4 }}>
                वर (Partner 1)
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}>
                {couple.partner1.name}
              </div>
              <div style={{ fontSize: 12, color: "#6B635B", marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span>लग्न: <strong style={{ color: "#1A1A1A" }}>{couple.partner1.lagnaSign} ({couple.partner1.lagnaDegree}°)</strong></span>
                <span>•</span>
                <span>चंद्र: <strong style={{ color: "#1A1A1A" }}>{couple.partner1.moonSign}</strong></span>
                <span>•</span>
                <span>नक्षत्र: <strong style={{ color: "#1A1A1A" }}>{couple.partner1.moonNakshatra} (पद {couple.partner1.moonPada})</strong></span>
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: "#B8860B", fontWeight: 600 }}>
                D9 नवांश लग्न: {couple.partner1.d9LagnaSign} (मिथुन)
              </div>
            </div>

            {/* Union Badge */}
            <div style={{ textAlign: "center", padding: "0 10px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #FFF2CE, #FFE08A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "2px solid #D4AF37", margin: "0 auto 6px", boxShadow: "0 4px 12px rgba(184,134,11,0.2)" }}>
                💑
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", letterSpacing: "1px" }}>अमृत संयोग</div>
            </div>

            {/* Bride / Partner 2 */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(232,121,249,0.35)", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#a855f7", fontWeight: 700, marginBottom: 4 }}>
                कन्या (Partner 2)
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}>
                {couple.partner2.name}
              </div>
              <div style={{ fontSize: 12, color: "#6B635B", marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span>लग्न: <strong style={{ color: "#1A1A1A" }}>{couple.partner2.lagnaSign} ({couple.partner2.lagnaDegree}°)</strong></span>
                <span>•</span>
                <span>चंद्र: <strong style={{ color: "#1A1A1A" }}>{couple.partner2.moonSign}</strong></span>
                <span>•</span>
                <span>नक्षत्र: <strong style={{ color: "#1A1A1A" }}>{couple.partner2.moonNakshatra} (पद {couple.partner2.moonPada})</strong></span>
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: "#a855f7", fontWeight: 600 }}>
                D9 नवांश लग्न: {couple.partner2.d9LagnaSign} (कुम्भ)
              </div>
            </div>
          </div>

          {/* Grand Score Strip */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,134,11,0.25)",
              borderRadius: 16,
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                  {ashtakoot.totalScore}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.9 }}>/ {ashtakoot.maxScore}</div>
              </div>

              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, padding: "2px 8px", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#059669" }}>
                    ✦ {ashtakoot.tierTitleHindi} ({ashtakoot.percentage}%)
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.5, maxWidth: 540 }}>
                  {ashtakoot.tierDescription}
                </div>
              </div>
            </div>

            {/* Quick KPI Badges */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "8px 14px", minWidth: 90 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>0 अन्तर</div>
                <div style={{ fontSize: 10, color: "#6B635B", marginTop: 2 }}>मंगल साम्यता</div>
              </div>

              <div style={{ textAlign: "center", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "8px 14px", minWidth: 90 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#3b82f6" }}>5-9 त्रिकोण</div>
0                <div style={{ fontSize: 10, color: "#6B635B", marginTop: 2 }}>नवांश D9 अक्ष</div>
              </div>

              <div style={{ textAlign: "center", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "8px 14px", minWidth: 90 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#B8860B" }}>पूर्ण परिहार</div>
                <div style={{ fontSize: 10, color: "#6B635B", marginTop: 2 }}>भकूट व नाड़ी</div>
              </div>

              <div style={{ textAlign: "center", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "8px 14px", minWidth: 90 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#16a34a" }}>डबल गोचर</div>
                <div style={{ fontSize: 10, color: "#6B635B", marginTop: 2 }}>{timingAndMuhurat.targetWeddingDate || "गोचर तिथि"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION NAV BAR (NO-PRINT) ── */}
      <div className="no-print" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {[
          { id: "all", label: "📋 सम्पूर्ण रिपोर्ट (All Sections)" },
          { id: "ashtakoot", label: "🌟 36-गुण अष्टकूट" },
          { id: "mangal", label: "🔥 मंगल साम्यता" },
          { id: "kalpurush", label: "⚖️ ७वीं राशि (तुला) दांपत्य सूत्र" },
          { id: "d9", label: "💎 D9 नवांश चार-स्तंभ" },
          { id: "kp", label: "🧭 KP सब-लॉर्ड & मिलन" },
          { id: "punarbu", label: "🛡️ पुनर्भु योग शोध" },
          { id: "timing", label: "⏳ विवाह समय निर्धारण (K.N. Rao)" },
          { id: "remedies", label: "🌿 वैदिक व वास्तु उपाय" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedSection(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              border: selectedSection === tab.id ? "1px solid #B8860B" : "1px solid rgba(184,134,11,0.2)",
              background: selectedSection === tab.id ? "linear-gradient(135deg, #B8860B, #8B6508)" : "#FFFFFF",
              color: selectedSection === tab.id ? "#FFFFFF" : "#6B635B",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: 36-GUNA ASHTAKOOT ANALYSIS WITH PARIHARAS
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "ashtakoot") && (
        <div className="card" style={{ borderColor: "rgba(184,134,11,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag">स्तंभ 1 · वैदिक मेलापक</div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24 }}>
                अष्टकूट 36-गुण विश्लेषण एवं शास्त्रोक्त परिहार
              </h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)" }}>
              कुल प्राप्तांक: {ashtakoot.totalScore} / {ashtakoot.maxScore} गुण
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
            वैदिक ज्योतिष में केवल सतही गुण मिलान नहीं देखा जाता, बल्कि यदि कोई कूट कम अंक दे रहा हो तो महर्षि पराशर व मुहूर्त चिंतामणि के प्रामाणिक <strong>परिहार (Pariharas)</strong> लागू होते हैं। दोनों कुंडलियों में एक राशि (सिंह) एवं भिन्न नक्षत्र (पूर्वाफाल्गुनी व उत्तराफाल्गुनी) होने से भकूट व नाड़ी दोनों का पूर्ण परिहार सिद्ध होता है।
          </p>

          {/* Parihara Highlights Box */}
          {ashtakoot.pariharas.length > 0 && (
            <div style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#B8860B", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📜</span> शास्त्रसम्मत परिहार (Classical Authentic Exemptions):
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {ashtakoot.pariharas.map((par, idx) => (
                  <div key={idx} style={{ fontSize: 12, color: "#1A1A1A", lineHeight: 1.6, display: "flex", gap: 8 }}>
                    <span style={{ color: "#059669", fontWeight: 800 }}>✓</span>
                    <span>{par}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8 Koots Breakdown Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#FAF7F2", borderBottom: "1px solid rgba(184,134,11,0.25)", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px", color: "#6B635B", fontWeight: 700 }}>कूट नाम (Koot)</th>
                  <th style={{ padding: "10px 12px", color: "#6B635B", fontWeight: 700 }}>क्षेत्र (Domain)</th>
                  <th style={{ padding: "10px 12px", color: "#6B635B", fontWeight: 700 }}>प्राप्तांक (Score)</th>
                  <th style={{ padding: "10px 12px", color: "#6B635B", fontWeight: 700 }}>स्थिति (Status)</th>
                  <th style={{ padding: "10px 12px", color: "#6B635B", fontWeight: 700 }}>विस्तृत व्याख्या व परिहार</th>
                </tr>
              </thead>
              <tbody>
                {ashtakoot.koots.map((k) => (
                  <tr key={k.name} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <td style={{ padding: "12px", fontWeight: 700, color: "#1A1A1A" }}>
                      {k.name} <span style={{ fontSize: 11, color: "#6B635B", fontWeight: 400 }}>({k.hindiName})</span>
                    </td>
                    <td style={{ padding: "12px", color: "#4A4238" }}>{k.meaning}</td>
                    <td style={{ padding: "12px", fontWeight: 800, color: k.points === k.maxPoints ? "#059669" : k.points > 0 ? "#B8860B" : "#dc2626" }}>
                      {k.points} / {k.maxPoints}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: k.status === "Excellent" ? "rgba(16,185,129,0.12)" : k.status === "Good" ? "rgba(184,134,11,0.12)" : "rgba(220,38,38,0.12)",
                          color: k.status === "Excellent" ? "#059669" : k.status === "Good" ? "#B8860B" : "#dc2626",
                        }}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#4A4238", lineHeight: 1.6, maxWidth: 360 }}>
                      {k.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: MANGAL PAAP SAMYATHA (BALANCING)
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "mangal") && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag" style={{ color: "#ef4444" }}>स्तंभ 2 · मंगल पाप साम्यता</div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24 }}>
                मंगल दोष एवं पाप साम्यता (Malefic Symmetry)
              </h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)" }}>
              {mangalSamyam.verdict}
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 18 }}>
            दक्षिण भारतीय व उत्तर भारतीय दोनों ज्योतिषीय परंपराओं का सर्वसम्मत नियम है: <strong>"पाप साम्यं शुभं प्रोक्तम्"</strong> — यदि वर और कन्या दोनों की कुंडलियों में पाप प्रभाव (मंगल/शनि/सूर्य/राहु) बराबर हो, तो वे एक-दूसरे को निरस्त (Neutralize) कर देते हैं और दांपत्य जीवन के लिए रक्षा कवच बन जाते हैं।
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
            {/* Groom Mangal Score */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase", marginBottom: 6 }}>
                वर ({couple.partner1.name}) — पाप बिंदु
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 800, color: "#ef4444" }}>
                  {mangalSamyam.partner1Paap}
                </span>
                <span style={{ fontSize: 12, color: "#6B635B" }}>पाप अंक (D1 + चंद्र + शुक्र लग्न)</span>
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", marginTop: 8, lineHeight: 1.6 }}>
                मंगल का प्रभाव प्रथम/अष्टम भाव पर है, जो कार्यकुशलता व स्पष्टवादिता देता है।
              </div>
            </div>

            {/* Symmetry Equality Box */}
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "16px 20px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", marginBottom: 4 }}>
                पाप अंतर (Net Gap)
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 800, color: "#059669" }}>
                {mangalSamyam.paapDifference} अंक (शून्य अंतर)
              </div>
              <div style={{ fontSize: 12, color: "#059669", fontWeight: 700, marginTop: 4 }}>
                ✓ पूर्ण समतुल्यता — दोष का 100% स्वतः निष्प्रभावीकरण
              </div>
            </div>

            {/* Bride Mangal Score */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", marginBottom: 6 }}>
                कन्या ({couple.partner2.name}) — पाप बिंदु
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 800, color: "#ef4444" }}>
                  {mangalSamyam.partner2Paap}
                </span>
                <span style={{ fontSize: 12, color: "#6B635B" }}>पाप अंक (D1 + चंद्र + शुक्र लग्न)</span>
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", marginTop: 8, lineHeight: 1.6 }}>
                समान तीव्रता का पाप प्रभाव होने के कारण वैवाहिक जीवन में किसी प्रकार की असममित हानि नहीं होती।
              </div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#4A4238", lineHeight: 1.7 }}>
            <strong>महत्वपूर्ण निष्कर्ष:</strong> {mangalSamyam.details}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2B: KALPURUSH 7TH SIGN (LIBRA / तुला) MARRIAGE ANCHOR
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "kalpurush") && kalpurush7thAudit && (
        <div className="card" style={{ borderColor: "rgba(184,134,11,0.35)", background: "linear-gradient(145deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag" style={{ color: "#875C06" }}>कालपुरुष दांपत्य सूत्र · मौखिक व्याख्यान रहस्य</div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24, color: "#1A1A1A" }}>
                ⚖️ कालपुरुष की ७वीं राशि (तुला) — जीवनसाथी प्राप्ति व दांपत्य संतुलन
              </h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#875C06", background: "rgba(184,134,11,0.12)", padding: "4px 14px", borderRadius: 8, border: "1px solid rgba(184,134,11,0.3)" }}>
              D1 &amp; D9 तुला संरेखण
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.8, marginBottom: 18 }}>
            कालपुरुष प्राकृतिक चक्र में <strong>७वीं राशि तुला (Libra)</strong> शुक्र की मूल राशि है, जो समस्त जगत में विवाह, जीवनसाथी और साझेदारी की जन्मजात अधिष्ठात्री है। व्याख्यान के अनुसार, आपकी जन्म कुंडली में ७ नंबर (तुला) जिस भाव में बैठती है, वह यह तय करती है कि <em>जीवनसाथी किस माध्यम से आएगा</em>, और <em>दांपत्य जीवन का तराजू किस विषय पर साधना होगा</em>।
          </p>

          {/* Dual Partner Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 20 }}>
            {/* Partner 1 Card */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>
                  वर ({couple.partner1.name}) — तुला भाव {kalpurush7thAudit.partner1.d1House}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6B635B", background: "#FFFFFF", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(184,134,11,0.2)" }}>
                  D9 में भाव {kalpurush7thAudit.partner1.d9House}
                </span>
              </div>
              
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                {kalpurush7thAudit.partner1.meetingChannelTitleHinglish}
              </div>
              
              <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.7, margin: "0 0 10px 0" }}>
                {kalpurush7thAudit.partner1.meetingChannelNarrativeHinglish}
              </p>

              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.18)", marginBottom: 8 }}>
                <strong style={{ fontSize: 12, color: "#875C06" }}>⚖️ दांपत्य संतुलन का तराजू:</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#5C5248", lineHeight: 1.6 }}>
                  {kalpurush7thAudit.partner1.maritalBalanceDomainHinglish}
                </p>
              </div>

              <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.5 }}>
                <strong>💡 जीवन सूत्र:</strong> {kalpurush7thAudit.partner1.karmicAnchorAdviceHinglish}
              </div>
            </div>

            {/* Partner 2 Card */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(232,121,249,0.35)", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#a855f7", textTransform: "uppercase", letterSpacing: "1px" }}>
                  कन्या ({couple.partner2.name}) — तुला भाव {kalpurush7thAudit.partner2.d1House}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6B635B", background: "#FFFFFF", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(232,121,249,0.3)" }}>
                  D9 में भाव {kalpurush7thAudit.partner2.d9House}
                </span>
              </div>
              
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                {kalpurush7thAudit.partner2.meetingChannelTitleHinglish}
              </div>
              
              <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.7, margin: "0 0 10px 0" }}>
                {kalpurush7thAudit.partner2.meetingChannelNarrativeHinglish}
              </p>

              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FFFFFF", border: "1px solid rgba(232,121,249,0.25)", marginBottom: 8 }}>
                <strong style={{ fontSize: 12, color: "#a855f7" }}>⚖️ दांपत्य संतुलन का तराजू:</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#5C5248", lineHeight: 1.6 }}>
                  {kalpurush7thAudit.partner2.maritalBalanceDomainHinglish}
                </p>
              </div>

              <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.5 }}>
                <strong>💡 जीवन सूत्र:</strong> {kalpurush7thAudit.partner2.karmicAnchorAdviceHinglish}
              </div>
            </div>
          </div>

          {/* Special 12th House Venus Wedding Charity Box if applicable */}
          {kalpurush7thAudit.weddingCharityRemedy && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(200,160,48,0.12), rgba(200,160,48,0.22))",
                border: "2px solid rgba(200,160,48,0.45)",
                borderRadius: 14,
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>🎁</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#875C06", marginBottom: 4 }}>
                  व्याख्यान का विशेष विवाह सूत्र: गरीब विवाह सहयोग (12th House Venus Charity)
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#382D20" }}>
                  {kalpurush7thAudit.weddingCharityRemedy}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: D9 NAVAMSHA 4-PILLAR CROSS-AUDIT
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "d9") && (
        <div className="card" style={{ borderColor: "rgba(59,130,246,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag" style={{ color: "#3b82f6" }}>स्तंभ 3 · नवांश D9 सूक्ष्म मिलान (बीज बनाम फल)</div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24 }}>
                D9 नवांश कुंडली 4-स्तंभ एवं शयन सुख (H12) विश्लेषण
              </h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#3b82f6", background: "rgba(59,130,246,0.12)", padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)" }}>
              अक्ष: {d9NavamshaCrossAudit.axisRelation}
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
            शास्त्रीय मान्यता है कि <strong>लग्न कुंडली (D1) केवल वृक्ष (Seed/Tree)</strong> है, जबकि <strong>नवांश (D9) उसका वास्तविक फल (Fruit)</strong> है। बहुत से लोग D1 में अच्छे ग्रह देखकर संतुष्ट हो जाते हैं, लेकिन विवाह के बाद का आंतरिक सुख, मानसिक लय और शयन सुख पूरी तरह D9 के ४ स्तंभों (H1, H4, H7, H12) पर टिका होता है। वर का नवांश लग्न <strong>{d9NavamshaCrossAudit.partner1D9Lagna}</strong> और कन्या का <strong>{d9NavamshaCrossAudit.partner2D9Lagna}</strong> है — दोनों मिलकर <strong>{d9NavamshaCrossAudit.axisRelation}</strong> का निर्माण करते हैं।
          </p>

          {/* 4 Pillars Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 16 }}>
            {/* Pillar 1: H1 */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", marginBottom: 4 }}>
                स्तंभ 1: प्रथम भाव (H1) — मानसिक लय
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                बौद्धिक तारतम्य (Intellectual Wave)
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                {d9NavamshaCrossAudit.mentalResonance}
              </div>
            </div>

            {/* Pillar 2: H4 */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                स्तंभ 2: चतुर्थ भाव (H4) — गृहस्थ सुख
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                पारिवारिक स्थायित्व (Domestic Harmony)
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                {d9NavamshaCrossAudit.domesticPeace}
              </div>
            </div>

            {/* Pillar 3: H7 */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", marginBottom: 4 }}>
                स्तंभ 3: सप्तम भाव (H7) — वैवाहिक दीर्घायु
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                साझेदारी व निष्ठा (Marital Longevity)
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                सप्तमेश और नवांश सप्तम भाव परस्पर सहयोगी हैं, जिससे दीर्घकालिक वैवाहिक सम्बंध की नींव अत्यंत सुदृढ़ होती है।
              </div>
            </div>

            {/* Pillar 4: H12 Bedroom Bliss */}
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", marginBottom: 4 }}>
                स्तंभ 4: द्वादश भाव (H12) — शयन सुख
              </div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                दांपत्य एकांत (Bedroom Bliss)
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                {d9NavamshaCrossAudit.h12Report}
              </div>
            </div>
          </div>

          {/* Transcript Specific D9 Affliction Highlights */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginTop: 14, marginBottom: 14 }}>
            <div style={{ background: "#FFFDF5", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#875C06", marginBottom: 3 }}>
                💥 H4 गृह सुख ("एटम बम" मंगल-राहु परीक्षण):
              </div>
              <p style={{ margin: 0, fontSize: 11.5, color: "#4A3E2C", lineHeight: 1.5 }}>
                व्याख्यान के अनुसार D9 के चौथे भाव में मंगल-राहु की युति गृहस्थी में विस्फोटक गुस्सा ('एटम बम') लाती है। चतुर्थ भाव शांत रहने पर घर में कभी उग्र टकराव नहीं होता।
              </p>
            </div>

            <div style={{ background: "#FFFDF5", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#875C06", marginBottom: 3 }}>
                🛏️ H12 शयन सुख (सूर्य/मंगल/केतु दूरी परीक्षण):
              </div>
              <p style={{ margin: 0, fontSize: 11.5, color: "#4A3E2C", lineHeight: 1.5 }}>
                D9 के १२वें भाव में सूर्य, मंगल या केतु होने पर अलग सोने या बेडरूम दूरी का रिस्क रहता है। यहाँ शुभ ग्रह होने से दांपत्य में शारीरिक व आत्मिक एकांत सुखद रहता है।
              </p>
            </div>
          </div>

          <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#1e3a8a", lineHeight: 1.7 }}>
            <strong>विशेष नवांश संकेत:</strong> मकर नवांश में सूर्य+गुरु की उपस्थिति आध्यात्मिक व सैद्धांतिक परिपक्वता देती है। व्यक्तिगत मतभेदों में तर्क-वितर्क के स्थान पर परस्पर संवेदनशीलता बनाए रखना दांपत्य सुख को अमृतमय बनाएगा।
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4: KP 7TH CSL & MEETING CONTEXT
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "kp") && (
        <div className="card" style={{ borderColor: "rgba(168,85,247,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag" style={{ color: "#a855f7" }}>स्तंभ 4 · के.पी. सब-लॉर्ड एवं सप्तम भाव नक्षत्र स्वामी</div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24 }}>
                7th CSL एवं सप्तम भाव में स्थित ग्रह का नक्षत्र स्वामी
              </h2>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B635B", background: "#FAF7F2", padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(184,134,11,0.2)" }}>
              मिलन माध्यम + कर्म फल प्रकटीकरण
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
            वैदिक व के.पी. ज्योतिष के सूक्ष्म व्याख्यान के अनुसार विवाह के दो प्रमुख आयाम होते हैं: <strong>(1) 7वें भाव का सब-लॉर्ड</strong> बताता है कि रिश्ता ज़िंदगी में किस माध्यम से प्रवेश करेगा, जबकि <strong>(2) सप्तम भाव में प्रत्यक्ष बैठे ग्रह का नक्षत्र स्वामी</strong> (या भाव रिक्त होने पर सप्तमेश का नक्षत्र स्वामी) तय करता है कि विवाह के बाद आपका वास्तविक जीवन अनुभव कैसा रहेगा और दांपत्य का कर्म किस भाव में जाकर खुलेगा।
          </p>

          {/* ── PART A: 7TH CSL MEETING CONTEXT ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#a855f7", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🚪</span> भाग क: 7th Cusp Sub-Lord — मिलन की परिस्थिति व प्रस्ताव का माध्यम (Alliance Entry Door)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {/* Groom KP CSL */}
              <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase", marginBottom: 4 }}>
                  वर ({couple.partner1.name}) — 7th CSL
                </div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                  CSL: {kpDynamics.partner1.csl} (नक्षत्र स्वामी: {kpDynamics.partner1.starLord})
                </div>
                <div style={{ fontSize: 12, color: "#6B635B", marginBottom: 8 }}>
                  सक्रिय भाव: <strong>{kpDynamics.partner1.house}वां भाव</strong>
                </div>
                <div style={{ fontSize: 12, color: "#B8860B", lineHeight: 1.6, marginBottom: 8 }}>
                  <strong>मिलन की परिस्थिति:</strong> {kpDynamics.partner1.circumstance}
                </div>
                <div style={{ fontSize: 12, color: "#B8860B", fontWeight: 600 }}>
                  <strong>विवाह उपरांत प्रभाव:</strong> {kpDynamics.partner1.postMarriageDomain}
                </div>
              </div>

              {/* Bride KP CSL */}
              <div style={{ background: "#FAF7F2", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", marginBottom: 4 }}>
                  कन्या ({couple.partner2.name}) — 7th CSL
                </div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                  CSL: {kpDynamics.partner2.csl} (नक्षत्र स्वामी: {kpDynamics.partner2.starLord})
                </div>
                <div style={{ fontSize: 12, color: "#6B635B", marginBottom: 8 }}>
                  सक्रिय भाव: <strong>{kpDynamics.partner2.house}वां भाव</strong>
                </div>
                <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6, marginBottom: 8 }}>
                  <strong>मिलन की परिस्थिति:</strong> {kpDynamics.partner2.circumstance}
                </div>
                <div style={{ fontSize: 12, color: "#a855f7", fontWeight: 600 }}>
                  <strong>विवाह उपरांत प्रभाव:</strong> {kpDynamics.partner2.postMarriageDomain}
                </div>
              </div>
            </div>
          </div>

          {/* ── PART B: 7TH OCCUPANT PLANET'S NAKSHATRA LORD MAPPING ── */}
          {seventhHouseNakshatraAudit && (
            <div style={{ marginTop: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#875C06", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✨</span> भाग ख: सप्तम भाव के ग्रह का नक्षत्र स्वामी — वैवाहिक कर्म फल व आंतरिक अनुभव (Karmic Fruition House)
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                {/* Groom 7th Occupant NL */}
                <div style={{ background: "#FFFDF9", border: "1px solid rgba(184,134,11,0.3)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", textTransform: "uppercase" }}>
                      वर ({couple.partner1.name})
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(184,134,11,0.12)", color: "#B8860B", padding: "2px 8px", borderRadius: 6 }}>
                      {seventhHouseNakshatraAudit.partner1.hasOccupants ? "सप्तम भाव में प्रत्यक्ष ग्रह" : "सप्तमेश फल (रिक्त भाव)"}
                    </span>
                  </div>

                  {seventhHouseNakshatraAudit.partner1.occupants.map((occ, idx) => (
                    <div key={idx} style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                        {occ.titleHinglish}
                      </div>
                      <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                        {occ.narrativeHinglish}
                      </p>
                      <div style={{ fontSize: 11.5, color: "#6B635B", lineHeight: 1.5, marginBottom: 6 }}>
                        <strong>💡 जीवन सूत्र:</strong> {occ.karmicAdviceHinglish}
                      </div>
                      {occ.remedyHinglish && (
                        <div style={{ background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.35)", borderRadius: 8, padding: "8px 10px", fontSize: 11.5, color: "#875C06", lineHeight: 1.5 }}>
                          <strong>🌿 व्याख्यान का उपाय:</strong> {occ.remedyHinglish}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bride 7th Occupant NL */}
                <div style={{ background: "#FFFDF9", border: "1px solid rgba(232,121,249,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#a855f7", textTransform: "uppercase" }}>
                      कन्या ({couple.partner2.name})
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(232,121,249,0.15)", color: "#a855f7", padding: "2px 8px", borderRadius: 6 }}>
                      {seventhHouseNakshatraAudit.partner2.hasOccupants ? "सप्तम भाव में प्रत्यक्ष ग्रह" : "सप्तमेश फल (रिक्त भाव)"}
                    </span>
                  </div>

                  {seventhHouseNakshatraAudit.partner2.occupants.map((occ, idx) => (
                    <div key={idx} style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                        {occ.titleHinglish}
                      </div>
                      <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                        {occ.narrativeHinglish}
                      </p>
                      <div style={{ fontSize: 11.5, color: "#6B635B", lineHeight: 1.5, marginBottom: 6 }}>
                        <strong>💡 जीवन सूत्र:</strong> {occ.karmicAdviceHinglish}
                      </div>
                      {occ.remedyHinglish && (
                        <div style={{ background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.35)", borderRadius: 8, padding: "8px 10px", fontSize: 11.5, color: "#875C06", lineHeight: 1.5 }}>
                          <strong>🌿 व्याख्यान का उपाय:</strong> {occ.remedyHinglish}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#4A4238", lineHeight: 1.7 }}>
            <strong>KP समेकित निष्कर्ष:</strong> {kpDynamics.synthesis}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5: PUNARBU YOGA (SATURN-MOON) & CANCELLATION AUDIT
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "punarbu") && (
        <div className="card" style={{ borderColor: punarbuAudit.isCancelled ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag" style={{ color: punarbuAudit.isCancelled ? "#059669" : "#dc2626" }}>
                स्तंभ 5 · पुनर्भु / पुनर्फू योग शोध
              </div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24 }}>
                पुनर्भु योग (शनि-चंद्र सम्बंध) एवं दैवीय परिहार
              </h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)" }}>
              {punarbuAudit.isCancelled ? "✓ पूर्ण निष्प्रभावी / सुरक्षित" : "सक्रिय"}
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
            आधुनिक के.पी. शोध (डॉ. एस. वेलुचामी, 2022) के अनुसार शनि और चंद्र की परस्पर दृष्टि अथवा युति को <strong>पुनर्भु योग</strong> कहा जाता है। पारंपरिक ज्योतिषी इसे देखकर विवाह टूटने का भय दिखाते हैं, परंतु सूक्ष्म शोध सिद्ध करता है कि यदि <strong>बृहस्पति (गुरु) की अमृत दृष्टि</strong> चंद्र अथवा लग्न पर हो, तो यह योग विवाह को खंडित नहीं कर सकता; यह केवल अत्यधिक औपचारिकता, पूर्व-विवाह हिचकिचाहट अथवा तारीखों पर गहन विमर्श कराता है।
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 16 }}>
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B635B", textTransform: "uppercase", marginBottom: 4 }}>
                वर ({couple.partner1.name}) पुनर्भु स्थिति
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                {punarbuAudit.partner1Detected ? "शनि-चंद्र सम्बंध परिलक्षित" : "पुनर्भु योग अनुपस्थित"}
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                वर की कुंडली में शनि-चंद्र का कोई प्रत्यक्ष नकारात्मक अवरोध नहीं है।
              </div>
            </div>

            <div style={{ background: "#FAF7F2", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", marginBottom: 4 }}>
                कन्या ({couple.partner2.name}) पुनर्भु स्थिति
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                {punarbuAudit.partner2Detected ? "शनि-चंद्र 1-7 दृष्टि सम्बंध" : "दोष मुक्त"}
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                शनि कुम्भ में एवं चंद्र सिंह में होने से सम्मुख दृष्टि बनती है, जो कन्या के स्वभाव में गंभीरता व गहरी सोच देती है।
              </div>
            </div>

            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", marginBottom: 4 }}>
                गुरु की अमृत दृष्टि (Divine Shield)
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginBottom: 4 }}>
                100% परिहार प्रमाणित
              </div>
              <div style={{ fontSize: 12, color: "#1A1A1A", lineHeight: 1.6 }}>
                {punarbuAudit.cancellationReason}
              </div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#4A4238", lineHeight: 1.7 }}>
            <strong>मनोवैज्ञानिक मार्गदर्शन:</strong> {punarbuAudit.psychologicalImpact} <em>उपाय: {punarbuAudit.remedy}</em>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6: K.N. RAO MARRIAGE TIMING & TRANSIT AUDIT
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "timing") && (
        <div className="card" style={{ borderColor: "rgba(200,160,48,0.35)", background: "#FFFFFF" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="card-tag">स्तंभ 6 · के.एन. राव 8-पैरामीटर विवाह समय निर्धारण</div>
              <h2 className="card-title serif" style={{ margin: 0, fontSize: 24 }}>
                विवाह समय एवं गोचर मुहूर्त परीक्षण
              </h2>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: timingAndMuhurat.isDoubleTransitActive ? "#059669" : "#B8860B", background: timingAndMuhurat.isDoubleTransitActive ? "rgba(16,185,129,0.12)" : "rgba(184,134,11,0.12)", padding: "4px 12px", borderRadius: 8, border: `1px solid ${timingAndMuhurat.isDoubleTransitActive ? "rgba(16,185,129,0.3)" : "rgba(184,134,11,0.3)"}` }}>
              {timingAndMuhurat.isDoubleTransitActive ? "डबल गोचर सक्रिय ✓" : "गोचर सामान्य"} (स्कोर: {timingAndMuhurat.timingScore}/100)
            </div>
          </div>

          {/* Date Selector / Input in UI */}
          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 12, background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#B8860B" }}>📅 प्रस्तावित विवाह तिथि चुनें:</span>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => {
                if (e.target.value) {
                  setTargetDate(e.target.value);
                  onSelectDate?.(e.target.value);
                }
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid rgba(184,134,11,0.35)",
                background: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                color: "#1A1A1A",
                outline: "none",
                cursor: "pointer",
                fontFamily: "Outfit,sans-serif",
              }}
            />
            <span style={{ fontSize: 12, color: "#6B635B" }}>
              (किसी भी तारीख का चयन करें, सिस्टम तुरंत के.एन. राव डबल गोचर व चंद्र स्थिति का पुनर्मूल्यांकन करेगा)
            </span>
          </div>

          <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
            श्री के.एन. राव (Bharatiya Vidya Bhavan) के 218 कुंडलियों के शोध के अनुसार, विवाह का समय निर्धारण <strong>बृहस्पति (गुरु)</strong> और <strong>शनि</strong> के दोहरे गोचर (Double Transit - P4) से सुनिश्चित होता है—जब दोनों ग्रह वर या कन्या के लग्न, लग्नेश, सप्तम भाव अथवा सप्तमेश से संबंध (PAC) बनाते हैं।
          </p>

          {/* Timing Parameters Comparison Card */}
          <div style={{ background: "#FAF7F2", border: `2px solid ${timingAndMuhurat.isDoubleTransitActive ? "rgba(16,185,129,0.35)" : "rgba(184,134,11,0.3)"}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: timingAndMuhurat.isDoubleTransitActive ? "#059669" : "#B8860B" }}>
                परीक्षण तिथि: {timingAndMuhurat.targetWeddingDate}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, background: timingAndMuhurat.isDoubleTransitActive ? "rgba(16,185,129,0.15)" : "rgba(184,134,11,0.15)", color: timingAndMuhurat.isDoubleTransitActive ? "#059669" : "#B8860B", padding: "3px 10px", borderRadius: 6 }}>
                {timingAndMuhurat.isDoubleTransitActive ? "डबल गोचर परिपक्व (Auspicious Window)" : "सामान्य कालखंड (Remedies Applicable)"}
              </span>
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 12, color: "#1A1A1A", lineHeight: 1.7 }}>
              <div>• <strong>P4 (डबल गोचर स्थिति):</strong> {timingAndMuhurat.timingVerdict}</div>
              <div>• <strong>O1 (चंद्र गोचर भूमिका):</strong> {timingAndMuhurat.moonTransitRoleO1}</div>
              <div>• <strong>P5 (पिया मिलन & लग्नेश-सप्तमेश):</strong> चयनित तिथि पर लग्नेश एवं सप्तमेश के गोचर संबंध का परीक्षण सक्रिय है।</div>
              <div>• <strong>दशा-गोचर समन्वय:</strong> यदि महादशा/अंतर्दशा 2, 7, 11 भावों को सक्रिय कर रही हो, तो यह तिथि विवाह हेतु अत्यंत अनुकूल सिद्ध होगी।</div>
            </div>
          </div>

          {/* Conditional Dashas Box */}
          {(timingAndMuhurat.conditionalDashasPartner1.length > 0 || timingAndMuhurat.conditionalDashasPartner2.length > 0) && (
            <div style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", marginBottom: 4 }}>
                🔬 के.एन. राव विशेष दशा पुष्टि (Conditional Dashas):
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                {timingAndMuhurat.conditionalDashasPartner1.map(d => `${couple.partner1.name}: ${d.dashaName} (${d.conditionDescription})`).join(" · ")}
                {timingAndMuhurat.conditionalDashasPartner2.map(d => ` | ${couple.partner2.name}: ${d.dashaName} (${d.conditionDescription})`).join(" · ")}
              </div>
            </div>
          )}

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#065f46", lineHeight: 1.7 }}>
            <strong>अंतिम समय निर्णय:</strong> {timingAndMuhurat.timingVerdict}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7: GEOGRAPHIC DIRECTIONS & D1 -> D9 CROSS IMPACT
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "kp") && (
        <div className="card" style={{ borderColor: "rgba(184,134,11,0.25)" }}>
          <div className="card-tag">स्तंभ 7 · दिशा व समृद्धि योग</div>
          <h2 className="card-title serif" style={{ margin: "0 0 12px 0", fontSize: 24 }}>
            जीवनसाथी की दिशा (Geographic Direction) एवं D1 ➔ D9 क्रॉस-मैपिंग
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 14 }}>
            <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", marginBottom: 4 }}>वर ({couple.partner1.name}) जीवनसाथी दिशा</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>
                {separativeAndDirections.directionPartner1Seeking}
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                सप्तमेश व शुक्र की स्थिति पूर्व अथवा ईशान कोण से जीवनसाथी की प्राप्ति दर्शाती है।
              </div>
            </div>

            <div style={{ background: "#FAF7F2", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", marginBottom: 4 }}>कन्या ({couple.partner2.name}) जीवनसाथी दिशा</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>
                {separativeAndDirections.directionPartner2Seeking}
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                सप्तम भाव व मंगल की स्थिति उत्तर/दक्षिण धुरी का सामंजस्य दर्शाती है।
              </div>
            </div>

            <div style={{ background: "#FAF7F2", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", marginBottom: 4 }}>संतान व उर्वरता स्थिति</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#059669", marginBottom: 4 }}>
                उर्वर राशियां (Fertile Alignment)
              </div>
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6 }}>
                {separativeAndDirections.barrenSignAlert}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 8: PRACTICAL VEDIC & ASTRO-VASTU REMEDIES
      ══════════════════════════════════════════════════════════════════════ */}
      {(selectedSection === "all" || selectedSection === "remedies") && (
        <div className="card" style={{ borderColor: "rgba(184,134,11,0.3)" }}>
          <div className="card-tag">स्तंभ 8 · व्यावहारिक वैदिक एवं वास्तु समाधान</div>
          <h2 className="card-title serif" style={{ margin: "0 0 12px 0", fontSize: 24 }}>
            सुखद दांपत्य हेतु वैदिक साधना, वास्तु एवं आचरण संहिता
          </h2>

          <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>
            ये उपाय किसी भारी दोष के निवारण हेतु नहीं, बल्कि इस अमृत मिलान की ऊर्जा को सदैव सकारात्मक, समृद्ध और प्रेमपूर्ण बनाए रखने के लिए हैं:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {practicalRemedies.map((rem, idx) => (
              <div
                key={idx}
                style={{
                  background: "#FAF7F2",
                  border: "1px solid rgba(184,134,11,0.2)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {rem.category.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: rem.caution ? "rgba(220,38,38,0.12)" : "rgba(16,185,129,0.12)",
                        color: rem.caution ? "#dc2626" : "#059669",
                      }}
                    >
                      {rem.caution ? "विशेष सावधानी" : "अनुशंसित"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                    {rem.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6, marginBottom: 8 }}>
                    {rem.procedure}
                  </div>
                  {rem.caution && (
                    <div style={{ fontSize: 11, color: "#b91c1c", marginBottom: 6 }}>
                      ⚠️ {rem.caution}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 11, color: "#6B635B", fontStyle: "italic", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 6 }}>
                  कारण: {rem.astrologicalRationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 9: EXECUTIVE SUMMARY & FINAL VERDICT
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #FFFDF8 0%, #F5EFE3 100%)",
          border: "2px solid rgba(184,134,11,0.4)",
          borderRadius: 16,
          padding: "24px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>📜</span>
          <div className="card-tag" style={{ margin: 0 }}>अंतिम ज्योतिषाचार्य महा-निष्कर्ष (Executive Verdict)</div>
        </div>
        <h3 className="card-title serif" style={{ fontSize: 22, color: "#1A1A1A", marginBottom: 12 }}>
          राधे राधे: मुकुल एवं मनीषा वैवाहिक मिलान का समेकित निर्णय
        </h3>

        <div style={{ fontSize: 14, color: "#1A1A1A", lineHeight: 2, background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 12, padding: "18px 22px", marginBottom: 14 }}>
          {report.executiveSummaryHindi}
        </div>

        <div style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.8 }}>
          <strong>English Translation:</strong> {report.executiveSummaryEnglish}
        </div>
      </div>
    </div>
  );
}
