"use client";

import { useState, useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  auditUserWearables,
  BODY_LOCATION_REGISTRY,
  WEARABLE_ITEMS_REGISTRY,
  PRESET_SAMPLE_ITEMS,
  type BodyLocationId,
  type WearableItemId,
  type WornItemInput,
  type BioWearableDossier,
} from "@/lib/astro-engine/bio-wearable-audit-engine";
import { evaluateNavtaraHitPrecedence } from "@/lib/astro-engine/micro-vastu-auditor";

interface BioWearableAuditViewProps {
  chart: ChartData | any;
}

export function BioWearableAuditView({ chart }: BioWearableAuditViewProps) {
  const [wornItems, setWornItems] = useState<WornItemInput[]>([
    { id: "def-1", location: "wrist_right", item: "red_mouli" },
    { id: "def-2", location: "neck", item: "gold" },
  ]);

  const [selectedLocation, setSelectedLocation] = useState<BodyLocationId>("wrist_right");
  const [selectedItem, setSelectedItem] = useState<WearableItemId>("red_mouli");

  const auditReport: BioWearableDossier = useMemo(() => {
    return auditUserWearables(chart, wornItems, new Date());
  }, [chart, wornItems]);

  const navtaraOverrides = useMemo(() => {
    return evaluateNavtaraHitPrecedence(chart);
  }, [chart]);
  const prohibitedItems = navtaraOverrides.filter(o => o.precedenceVerdict === "PROHIBITED_ACTIVATION");

  const handleAddItem = () => {
    const newItem: WornItemInput = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      location: selectedLocation,
      item: selectedItem,
    };
    setWornItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setWornItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoadSamplePreset = () => {
    setWornItems(PRESET_SAMPLE_ITEMS);
  };

  const handleClearAll = () => {
    setWornItems([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Top Header Hero Banner ── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #24160A 0%, #382410 50%, #1A1006 100%)",
          color: "#FFFFFF",
          border: "2px solid rgba(212, 175, 55, 0.85)",
          borderRadius: 18,
          padding: "20px 24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(36, 22, 10, 0.45)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#78350F",
                background: "#FEF08A",
                padding: "3px 10px",
                borderRadius: 14,
                border: "1.5px solid #F59E0B",
              }}
            >
              Bio-Magnetic Wearable & Thread Audit · 100% Dynamic
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "8px 0 4px 0", color: "#FFFFFF", fontFamily: "Cormorant Garamond, serif", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>
              📿 देह-आभूषण, धातु, रत्न व धागा ऑडिटर
            </h2>
            <p style={{ margin: 0, fontSize: 13.5, color: "#FEF3C7", maxWidth: 740, lineHeight: 1.55 }}>
              आपने शरीर के किस अंग पर कौन सी धातु, रत्न, कड़ा, धागा या करधनी बांध रखी है? आपकी कुंडली के भावों, सक्रिय महादशा ({auditReport.activeMahadasha}) और 180° किलर आघातों के आधार पर लाइव डायग्नोसिस।
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={handleLoadSamplePreset}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "7px 14px",
                borderRadius: 8,
                background: "rgba(239, 68, 68, 0.2)",
                color: "#FCA5A5",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                cursor: "pointer",
              }}
            >
              ⚡ मानक केस स्टडी लोड करें (Sample Demo)
            </button>
            <button
              onClick={handleClearAll}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                cursor: "pointer",
              }}
            >
              🔄 रीसेट (Clear)
            </button>
          </div>
        </div>
      </div>

      {/* ── Navtara-Hit Precedence Override Alert Banner ── */}
      {prohibitedItems.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)",
            border: "2px solid #EF4444",
            borderRadius: 14,
            padding: "16px 20px",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🚨</span>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#991B1B" }}>
              नवतारा-हिट वरीयता चेतावनी (Navtara-Hit Precedence Override Active)
            </div>
          </div>
          {prohibitedItems.map((item) => (
            <div key={item.planet} style={{ marginTop: 8, background: "#FFFFFF", padding: 12, borderRadius: 10, border: "1px solid #FECACA" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#991B1B" }}>
                • {item.planet} ({item.taraNameHi}): 180°/90° किलर वेध सक्रिय होने के कारण इसका रत्न/कड़ा पहनना पूर्णतः वर्जित है!
              </div>
              <div style={{ fontSize: 12, color: "#7F1D1D", marginTop: 4, lineHeight: 1.5 }}>
                {item.warningNoticeHi}
              </div>
              <div style={{ fontSize: 12, color: "#15803D", fontWeight: 700, marginTop: 4 }}>
                💡 शास्त्रीय उपचार: {item.actionProtocolHi}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Body-Part Trap & Tilak Vector Callout ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          border: "1.5px solid #FCD34D",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>
            ⚠️ देह-वास्तु ट्रैप सूत्र (Body-Part Calibration & Tilak Rules):
          </div>
          <div style={{ fontSize: 12, color: "#78350F", marginTop: 4, lineHeight: 1.5 }}>
            • <strong>कलाई (Wrist):</strong> कालपुरुष की तीसरी राशि <em>मिथुन (3rd Sign/Arms)</em> का प्रतिनिधित्व करती है। कलाई पर पीली मौली या सोने का कड़ा बांधने से कुंडली का तीसरा भाव सक्रिय होता है। यदि तीसरा भाव या उसका स्वामी दशा स्वामी पर किलर हिट कर रहा हो तो कलाई पर पीला/सोना वर्जित है।<br />
            • <strong>तिलक स्थान:</strong> मस्तक (Forehead) = मेष (1st sign)। नाभि से 3 इंच ऊपर (Solar Plexus) = सिंह राशि (5th sign / गुरु-सूर्य तेज)।
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", background: "#F59E0B", color: "#FFFFFF", borderRadius: 8 }}>
          देह-वास्तु नियम
        </span>
      </div>

      {/* ── Interactive Item Selector Box ── */}
      <div className="card" style={{ padding: 20, background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px 0" }}>
          ➕ नई वस्तु जोड़ें (Select Body Part & Item):
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4A4238", marginBottom: 6 }}>
              1. शरीर का अंग (Body Location):
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as BodyLocationId)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #D1D5DB",
                background: "#FAF8F5",
                fontSize: 13,
                color: "#1A1A1A",
                fontWeight: 600,
              }}
            >
              {Object.values(BODY_LOCATION_REGISTRY).map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.titleHi} ({loc.titleEn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4A4238", marginBottom: 6 }}>
              2. क्या पहना हुआ है (Metal / Gemstone / Thread / Bracelet):
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value as WearableItemId)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #D1D5DB",
                background: "#FAF8F5",
                fontSize: 13,
                color: "#1A1A1A",
                fontWeight: 600,
              }}
            >
              <optgroup label="── धातु (Metals) ──">
                <option value="gold">सोना (Gold)</option>
                <option value="silver">चांदी (Silver)</option>
                <option value="copper">तांबा (Copper)</option>
                <option value="brass">पीतल / कांसा (Brass)</option>
                <option value="iron">कच्चा लोहा / शनि छल्ला (Iron)</option>
                <option value="steel_heavy">भारी व मोटा स्टील कड़ा (Heavy Steel)</option>
                <option value="steel_normal">साधारण स्टील कड़ा (Normal Steel)</option>
                <option value="panchdhatu">पंचधातु / अष्टधातु</option>
              </optgroup>
              <optgroup label="── रत्न एवं उपरत्न (Gemstones) ──">
                <option value="ruby">माणिक रत्न (Ruby - Sun)</option>
                <option value="pearl">सच्चा मोती (Pearl - Moon)</option>
                <option value="coral">लाल मूंगा (Red Coral - Mars)</option>
                <option value="emerald">पन्ना रत्न (Emerald - Mercury)</option>
                <option value="yellow_sapphire">पुखराज रत्न (Yellow Sapphire - Jupiter)</option>
                <option value="diamond_opal">हीरा / ओपल (Diamond - Venus)</option>
                <option value="blue_sapphire">नीलम / जमुनिया (Blue Sapphire - Saturn)</option>
                <option value="hessonite">गोमेद (Hessonite - Rahu)</option>
                <option value="cats_eye">लहसुनिया (Cat&apos;s Eye - Ketu)</option>
              </optgroup>
              <optgroup label="── धागा एवं कलावा (Threads) ──">
                <option value="red_mouli">लाल मौली / कलावा (Red Mouli)</option>
                <option value="yellow_thread">पीला धागा (Yellow Thread)</option>
                <option value="black_thread">काला धागा (Black Thread)</option>
                <option value="green_thread">हरा धागा (Green Thread)</option>
                <option value="white_thread">सफेद सूती/रेशमी धागा</option>
                <option value="orange_thread">केसरिया / नारंगी धागा</option>
              </optgroup>
              <optgroup label="── ब्रेसलेट, माला व आभूषण (Bracelets & Accessories) ──">
                <option value="rudraksha">रुद्राक्ष ब्रेसलेट / माला</option>
                <option value="sphatik">स्फटिक ब्रेसलेट / माला</option>
                <option value="tulsi">तुलसी माला / ब्रेसलेट</option>
                <option value="tiger_eye">टाइगर आई ब्रेसलेट</option>
                <option value="seven_chakra">7 चक्र ब्रेसलेट</option>
                <option value="black_tourmaline">ब्लैक टर्मेलीन / लावा स्टोन</option>
                <option value="tortoise_ring">कछुआ अंगूठी (Tortoise Ring)</option>
                <option value="silver_ghungroo">चांदी के घुंघरू / छनछन पायल</option>
                <option value="silver_tagdi">चांदी की करधनी / तगड़ी (कमर)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <button
              onClick={handleAddItem}
              style={{
                width: "100%",
                padding: "10px 18px",
                background: "#1A1A1A",
                color: "#FFFFFF",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              ➕ सूची में जोड़ें (Add Item)
            </button>
          </div>
        </div>

        {/* Selected Items Quick Badges */}
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {wornItems.map((w) => {
            const l = BODY_LOCATION_REGISTRY[w.location]?.titleHi || w.location;
            const i = WEARABLE_ITEMS_REGISTRY[w.item]?.titleHi || w.item;
            return (
              <span
                key={w.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 16,
                  background: "#FAF8F5",
                  border: "1px solid #D1D5DB",
                  fontSize: 12,
                  color: "#1F2937",
                }}
              >
                <span>📍 {l}: <strong>{i}</strong></span>
                <button
                  onClick={() => handleRemoveItem(w.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    fontWeight: 700,
                    padding: 0,
                    marginLeft: 4,
                  }}
                  title="Remove item"
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── KPI & General Verdict Summary ── */}
      <div
        className="card"
        style={{
          padding: 18,
          background: auditReport.criticalRemoveCount > 0 ? "rgba(220, 38, 38, 0.05)" : "#F0FDF4",
          border: `1px solid ${auditReport.criticalRemoveCount > 0 ? "#FCA5A5" : "#86EFAC"}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: auditReport.criticalRemoveCount > 0 ? "#991B1B" : "#166534", margin: 0 }}>
              {auditReport.generalVerdictSummary}
            </h4>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                background: "#FEE2E2",
                color: "#DC2626",
                padding: "4px 10px",
                borderRadius: 14,
                border: "1px solid #FCA5A5",
              }}
            >
              🚨 तत्काल उतारें: {auditReport.criticalRemoveCount} वस्तुएं
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                background: "#FEF3C7",
                color: "#B45309",
                padding: "4px 10px",
                borderRadius: 14,
                border: "1px solid #FCD34D",
              }}
            >
              ⚠️ सावधानी / बदलें: {auditReport.cautionCount}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                background: "#DCFCE7",
                color: "#16A34A",
                padding: "4px 10px",
                borderRadius: 14,
                border: "1px solid #86EFAC",
              }}
            >
              ✅ अमृत समान / धारण रखें: {auditReport.safeBeneficialCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Detailed Item-by-Item Diagnostic Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "4px 0 0 0" }}>
          🔍 व्यक्तिगत मद-वार विश्लेषण एवं वैज्ञानिक प्रभाव (Item-by-Item Analysis):
        </h4>

        {auditReport.itemsAudited.length === 0 ? (
          <div style={{ padding: 28, textAlign: "center", background: "#FAF8F5", borderRadius: 14, border: "1.5px dashed #D1D5DB" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📿</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>
              आपकी बायो-मैग्नेटिक ऑडिट सूची अभी खाली है
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "6px 0 16px 0", maxWidth: 520, marginInline: "auto" }}>
              ऊपर दिए गए फॉर्म से चुनें कि आपने शरीर के किस अंग पर कौन सा आभूषण, कड़ा, रत्न या धागा पहना हुआ है और &apos;सूची में जोड़ें&apos; पर क्लिक करें। यह इंजन आपकी जन्मकुंडली की महादशा और 180°/90° हिट्स के विरुद्ध उनका लाइव बायो-मैग्नेटिक ऑडिट करता है।
            </p>
            <button
              onClick={handleLoadSamplePreset}
              style={{
                padding: "9px 18px",
                background: "#B8860B",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              ⚡ उदाहरण देखने हेतु नमूना डेटा लोड करें (Load 5 Preset Items)
            </button>
          </div>
        ) : (
          auditReport.itemsAudited.map((item, idx) => (
          <div
            key={item.id || idx}
            className="card"
            style={{
              padding: 20,
              background: "#FFFFFF",
              borderLeft: `6px solid ${item.badgeColor}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 12,
                    background: item.badgeBg,
                    color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}`,
                    display: "inline-block",
                    marginBottom: 6,
                  }}
                >
                  {item.badgeText}
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 17, color: "#1A1A1A", fontWeight: 700 }}>
                  📍 {item.locationTitleHi} में {item.itemTitleHi}
                </h3>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: item.isDusthana ? "rgba(220, 38, 38, 0.1)" : "#F3F4F6",
                    color: item.isDusthana ? "#DC2626" : "#4B5563",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  भाव: H{item.associatedHouseNum} ({item.associatedHouseNameHi})
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: "#FAF8F5",
                    color: "#B8860B",
                    border: "1px solid rgba(184, 134, 11, 0.3)",
                  }}
                >
                  ग्रह: {item.governingPlanetHi}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>
              <strong>ज्योतिषीय क्रियाविधि (Mechanism):</strong> {item.astrologicalMechanism}
            </div>

            {item.activeSymptoms && item.activeSymptoms.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: item.severity === "CRITICAL_REMOVE" ? "rgba(220, 38, 38, 0.05)" : "#FAF8F5",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, color: item.severity === "CRITICAL_REMOVE" ? "#991B1B" : "#4A4238", marginBottom: 4 }}>
                  ⚡ वर्तमान में क्या शारीरिक व मानसिक लक्षण आ रहे होंगे?
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "#4B5563" }}>
                  {item.activeSymptoms.map((sym, sIdx) => (
                    <li key={sIdx} style={{ marginBottom: 2 }}>{sym}</li>
                  ))}
                </ul>
              </div>
            )}

            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                fontWeight: 600,
                color: item.severity === "CRITICAL_REMOVE" ? "#991B1B" : "#166534",
              }}
            >
              🛠️ <strong>सुधारात्मक निर्देश:</strong> {item.correctiveRecommendation}
            </div>
          </div>
        ))
      )}
      </div>

      {/* ── Daily Body-Vastu Protocols ── */}
      <div className="card" style={{ padding: 20, background: "#FAF8F5", border: "1px solid #E5E7EB" }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 10px 0" }}>
          🌿 3 अचूक दैनिक देह-वास्तु अमृत नियम (Daily Protocols):
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {auditReport.dailyBodyVastuRules.map((rule, rIdx) => (
            <div key={rIdx} style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#B8860B", marginBottom: 4 }}>
                {rule.ruleTitle}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937", marginBottom: 4 }}>
                📍 {rule.targetBodyPart} · {rule.substanceOrAction}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                {rule.instruction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

