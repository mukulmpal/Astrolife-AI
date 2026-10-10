"use client";

import { useMemo, useState } from "react";
import { EngineStateCard } from "@/components/engine-state-card";
import { PremiumFeature } from "@/components/premium-feature";
import { calculateTransitReport } from "@/lib/astro-engine/transits";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { generateCombinedTransitPurchaseGuidance } from "@/lib/astro-engine/transit-purchase-combined";
import { generatePlanetPurchaseReport } from "@/lib/astro-engine/transit-planet-purchase";
import {
  searchPurchaseCatalog,
  type PurchaseSearchResult,
} from "@/lib/astro-engine/transit-purchase-search";
import {
  generateTransitPurchaseNarrative,
  type TransitPurchaseNarrative,
} from "@/lib/astro-engine/transit-purchase-story";
import type { PlanetName } from "@/lib/astro-engine/transits";
import type { LalKitabPlanet } from "@/lib/lal-kitab";
import { useUserChart } from "@/lib/user-chart";
import "@/app/dashboard/shared.css";

const LAL_KITAB_PLANETS = new Set<LalKitabPlanet>([
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
]);

function toLalKitabPlanet(value: string | undefined, fallback: LalKitabPlanet): LalKitabPlanet {
  return LAL_KITAB_PLANETS.has(value as LalKitabPlanet) ? (value as LalKitabPlanet) : fallback;
}

function activeDashaPlanet(
  entries: Array<{ planet?: string; active?: boolean }> | undefined,
  fallback: LalKitabPlanet
) {
  return toLalKitabPlanet(
    entries?.find((entry) => entry.active)?.planet ?? entries?.[0]?.planet,
    fallback
  );
}

function buildLalKitabTiming(chart: ReturnType<typeof useUserChart>["chart"] | null) {
  if (!chart) return undefined;

  const currentMahadasha = activeDashaPlanet(chart.dashas, "Moon");
  const currentAntardasha = activeDashaPlanet(chart.antardasha, currentMahadasha);
  const activePlanets = Array.from(new Set([currentMahadasha, currentAntardasha].filter(Boolean)));

  return {
    currentMahadasha,
    currentAntardasha,
    currentPratyantardasha: currentAntardasha,
    activePlanets,
  };
}

function Badge({ verdict }: { verdict: string }) {
  const color =
    verdict === "AVOID"
      ? "#b91c1c"
      : verdict === "WAIT" || verdict === "GIFT_CAUTION"
      ? "#d97706"
      : verdict === "BUY_CAREFULLY" || verdict === "CAUTION"
      ? "#B8860B"
      : "#15803d";
  return (
    <span
      className="tp-badge"
      style={{ color, borderColor: `${color}66`, background: `${color}15` }}
    >
      {verdict}
    </span>
  );
}

const POPULAR_SEARCH_CHIPS = [
  { label: "📱 iPhone / Phone", q: "iphone" },
  { label: "🚗 Car / SUV", q: "car" },
  { label: "🪙 Gold / Sona", q: "gold" },
  { label: "🏠 Flat / Land", q: "plot" },
  { label: "💻 Laptop / PC", q: "laptop" },
  { label: "🚙 Used Car", q: "used car" },
  { label: "👞 Shoes / Leather", q: "shoes" },
  { label: "🪔 Puja Items", q: "puja" },
  { label: "📺 Smart TV", q: "tv" },
  { label: "📈 Stocks / Crypto", q: "stocks" },
];

export default function TransitPurchasePage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const [activePlanet, setActivePlanet] = useState<PlanetName>("Sun");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNarrativeOpen, setIsNarrativeOpen] = useState<boolean>(true);

  const activeChart = useMemo(() => {
    if (!hasUserChart || !chart) return null;
    return normalizeChartForTransit(chart);
  }, [chart, hasUserChart]);

  const transitReport = useMemo(() => {
    if (!activeChart) return null;
    return calculateTransitReport({ chart: activeChart, base: "moon", date: new Date() });
  }, [activeChart]);

  const guidance = useMemo(() => {
    if (!transitReport) return null;
    const lalKitab = buildLalKitabTiming(chart);
    return generateCombinedTransitPurchaseGuidance({ transitReport, lalKitab });
  }, [transitReport, chart]);

  const planetReport = useMemo(() => {
    if (!transitReport) return null;
    return generatePlanetPurchaseReport(transitReport);
  }, [transitReport]);

  const activePlanetGuidance = useMemo(
    () => planetReport?.planets.find((p) => p.planet === activePlanet) ?? planetReport?.planets[0] ?? null,
    [planetReport, activePlanet]
  );

  // Feature 1: Storytelling Mentor Narrative
  const narrative = useMemo<TransitPurchaseNarrative | null>(() => {
    if (!chart || !transitReport || !guidance || !planetReport) return null;
    return generateTransitPurchaseNarrative({ chart, transitReport, guidance, planetReport });
  }, [chart, transitReport, guidance, planetReport]);

  // Feature 2: Instant Object Search
  const searchResults = useMemo<PurchaseSearchResult[]>(() => {
    if (!planetReport) return [];
    if (!searchQuery.trim()) {
      // Default initial preview: iPhone, Car, Gold
      return [
        ...searchPurchaseCatalog("iphone", planetReport, guidance?.lalKitab).slice(0, 1),
        ...searchPurchaseCatalog("car", planetReport, guidance?.lalKitab).slice(0, 1),
        ...searchPurchaseCatalog("gold", planetReport, guidance?.lalKitab).slice(0, 1),
      ];
    }
    return searchPurchaseCatalog(searchQuery, planetReport, guidance?.lalKitab);
  }, [searchQuery, planetReport, guidance]);

  if (loading || !hasUserChart) {
    return (
      <main className="tp-wrap">
        <div className="tp-shell">
          <EngineStateCard
            title="Gochar Purchase Guidance"
            loading={loading}
            loadingText="Loading your chart..."
            emptyText="Generate your kundli first to unlock purchase guidance."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="tp-wrap">
      <style>{`
        .tp-wrap{min-height:100vh;background:#FAF7F2;color:#1A1A1A;padding:30px 22px 110px;font-family:Outfit,system-ui,sans-serif}
        .tp-shell{max-width:1120px;margin:0 auto;display:grid;gap:18px}
        
        .tp-hero{background:#FFFFFF;border:1px solid rgba(184,134,11,0.22);border-radius:20px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.03)}
        .tp-row{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
        .tp-kicker{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B8860B;margin-bottom:8px;font-weight:700}
        .tp-title{font-family:'Cormorant Garamond',serif;font-size:34px;line-height:1.1;color:#1A1A1A}
        .tp-sub{font-size:13px;color:#6B635B;margin-top:6px;line-height:1.6}
        
        .tp-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
        .tp-card{background:#FFFFFF;border:1px solid rgba(184,134,11,0.2);border-radius:18px;padding:20px;box-shadow:0 4px 20px rgba(0,0,0,0.03)}
        .span-12{grid-column:span 12}.span-7{grid-column:span 7}.span-5{grid-column:span 5}.span-6{grid-column:span 6}
        .tp-h{font-family:'Cormorant Garamond',serif;font-size:24px;margin-bottom:8px;color:#1A1A1A}
        .tp-p{font-size:13px;color:#4A4238;line-height:1.7}
        .tp-badge{display:inline-flex;border:1px solid;border-radius:999px;padding:4px 10px;font-size:10px;font-weight:800;letter-spacing:.08em}
        .tp-list{display:grid;gap:10px;margin-top:12px}
        .tp-item{background:#FAF7F2;border:1px solid rgba(184,134,11,0.18);border-radius:14px;padding:14px}
        .tp-item-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:6px}
        .tp-muted{font-size:12px;color:#6B635B;line-height:1.6}
        .tp-chip{font-size:11px;color:#B8860B;background:#FAF7F2;border:1px solid rgba(184,134,11,0.25);padding:4px 10px;border-radius:999px;font-weight:600}
        
        /* Tabs */
        .tp-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
        .tp-tab{display:flex;align-items:center;gap:7px;border:1px solid rgba(184,134,11,0.2);background:#FAF7F2;color:#6B635B;border-radius:12px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s}
        .tp-tab:hover{border-color:#B8860B;color:#1A1A1A}
        .tp-tab.active{background:rgba(184,134,11,0.15);border-color:#B8860B;color:#B8860B}
        .tp-tab .glyph{font-size:16px;line-height:1}
        .tp-tab .dot{width:7px;height:7px;border-radius:999px}
        
        /* Planet Detail */
        .tp-planet-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
        .tp-planet-title{display:flex;align-items:center;gap:12px}
        .tp-glyph-lg{font-size:36px;line-height:1;color:#B8860B}
        .tp-snap{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:14px}
        .tp-snap-item{background:#FFFFFF;border:1px solid rgba(184,134,11,0.18);border-radius:10px;padding:10px 12px}
        .tp-snap-k{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#8C827A;font-weight:600}
        .tp-snap-v{font-size:14px;font-weight:700;color:#1A1A1A;margin-top:3px}
        
        /* Bullets */
        .tp-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
        .tp-bullet{font-size:12.5px;color:#4A4238;line-height:1.65;padding-left:16px;position:relative}
        .tp-bullet::before{content:"";position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:999px}
        .tp-good::before{background:#15803d}.tp-bad::before{background:#b91c1c}.tp-neutral::before{background:#B8860B}
        .tp-objects{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
        .tp-obj{font-size:11.5px;color:#4A4238;background:#FFFFFF;border:1px solid rgba(184,134,11,0.2);border-radius:999px;padding:5px 12px;font-weight:500}
        
        /* Search Box Styles */
        .tp-search-wrap{background:#FFFFFF;border:1px solid rgba(184,134,11,0.3);border-radius:20px;padding:22px;box-shadow:0 4px 20px rgba(184,134,11,0.06)}
        .tp-search-input-wrap{position:relative;display:flex;align-items:center;margin-top:12px}
        .tp-search-input{width:100%;font-family:inherit;font-size:15px;color:#1A1A1A;background:#FAF7F2;border:1.5px solid rgba(184,134,11,0.3);border-radius:14px;padding:12px 42px 12px 42px;outline:none;transition:border-color .2s,box-shadow .2s}
        .tp-search-input:focus{border-color:#B8860B;background:#FFFFFF;box-shadow:0 0 0 3px rgba(184,134,11,0.12)}
        .tp-search-icon{position:absolute;left:14px;font-size:17px;color:#B8860B;pointer-events:none}
        .tp-search-clear{position:absolute;right:14px;background:none;border:none;font-size:16px;color:#8C827A;cursor:pointer;padding:4px}
        .tp-search-clear:hover{color:#1A1A1A}
        .tp-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
        .tp-chip-btn{font-size:12px;font-weight:600;padding:6px 13px;border-radius:999px;border:1px solid rgba(184,134,11,0.25);background:#FAF7F2;color:#4A4238;cursor:pointer;transition:all .15s}
        .tp-chip-btn:hover{background:rgba(184,134,11,0.12);border-color:#B8860B;color:#1A1A1A}
        .tp-chip-btn.active{background:#B8860B;color:#FFFFFF;border-color:#B8860B}
        
        /* Search Results Grid */
        .tp-results-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;margin-top:16px}
        .tp-result-card{background:#FAF7F2;border:1px solid rgba(184,134,11,0.22);border-radius:16px;padding:16px;display:flex;flex-col;justify-content:space-between;transition:transform .15s,box-shadow .15s}
        .tp-result-card:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(184,134,11,0.08)}
        .tp-res-score-bar{height:6px;background:rgba(0,0,0,0.06);border-radius:999px;overflow:hidden;margin-top:6px}
        .tp-res-score-fill{height:100%;border-radius:999px;transition:width .4s ease}
        
        /* Mentor Narrative Section */
        .tp-narrative-box{background:linear-gradient(180deg,#FFFFFF 0%,#FAF5EB 100%);border:1px solid rgba(184,134,11,0.35);border-radius:24px;padding:24px;box-shadow:0 4px 24px rgba(184,134,11,0.08)}
        .tp-story-quote{background:#FFFFFF;border:1px solid rgba(184,134,11,0.25);border-radius:16px;padding:18px 22px;position:relative;margin-top:16px}
        .tp-story-quote::before{content:"“";position:absolute;top:-8px;left:14px;font-size:48px;font-family:'Cormorant Garamond',serif;color:rgba(184,134,11,0.25);line-height:1}
        .tp-chapters-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
        .tp-chapter-card{background:#FFFFFF;border:1px solid rgba(184,134,11,0.2);border-radius:16px;padding:16px}
        .tp-chapter-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(184,134,11,0.14)}
        .tp-chapter-icon{font-size:22px;line-height:1}
        .tp-chapter-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#B8860B}
        .tp-story-p{font-size:13px;color:#4A4238;line-height:1.75;margin-bottom:10px}
        .tp-final-advice{background:#FAF7F2;border:1.5px dashed rgba(184,134,11,0.4);border-radius:14px;padding:14px 18px;margin-top:16px;display:flex;align-items:center;gap:12px}
        
        @media(max-width:900px){
          .span-7,.span-5,.span-6{grid-column:span 12}
          .tp-title{font-size:28px}
          .tp-cols{grid-template-columns:1fr}
          .tp-chapters-grid{grid-template-columns:1fr}
        }
      `}</style>

      <PremiumFeature feature="Gochar Purchase Guidance">
        <div className="tp-shell">
          {/* Header */}
          <section className="tp-hero">
            <div className="tp-row">
              <div>
                <div className="tp-kicker">Gochar + Lal Kitab Object Grammar</div>
                <h1 className="tp-title">Gochar Purchase Guidance</h1>
                <p className="tp-sub">
                  Buy, wait, or avoid guidance using Moon-first Gochar timing plus Lal Kitab object and gift caution.
                  Lal Kitab 35-sala chakra, varshphal and monthly phal are separate methods.
                </p>
              </div>
            </div>
          </section>

          {!guidance ? (
            <EngineStateCard
              title="Chart Required"
              emptyText="Generate your kundli first to unlock purchase guidance."
            />
          ) : (
            <>
              {/* ───────────────────────────────────────────────────────────── */}
              {/* FEATURE 1: MENTOR STORYTELLING DOSSIER CARD */}
              {/* ───────────────────────────────────────────────────────────── */}
              {narrative && (
                <section className="tp-narrative-box">
                  <div className="tp-row">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: "linear-gradient(135deg, #B8860B, #996515)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          color: "#fff",
                          flexShrink: 0,
                          boxShadow: "0 2px 8px rgba(184,134,11,0.2)",
                        }}
                      >
                        🎙️
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: "1.5px",
                              textTransform: "uppercase",
                              color: "#B8860B",
                              background: "#FFFFFF",
                              padding: "2px 8px",
                              borderRadius: 999,
                              border: "1px solid rgba(184,134,11,0.25)",
                            }}
                          >
                            Mentor Storytelling Walkthrough
                          </span>
                          <span style={{ fontSize: 12, color: "#8C827A", fontWeight: 600 }}>
                            मानवीय कहानी शैली
                          </span>
                        </div>
                        <h2 className="tp-h" style={{ marginTop: 4, marginBottom: 2 }}>
                          {narrative.title}
                        </h2>
                        <p className="tp-muted">{narrative.subtitle}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsNarrativeOpen((prev) => !prev)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all .15s",
                        background: isNarrativeOpen
                          ? "#FAF7F2"
                          : "linear-gradient(135deg, #B8860B, #996515)",
                        border: "1px solid rgba(184,134,11,0.4)",
                        color: isNarrativeOpen ? "#B8860B" : "#FFFFFF",
                      }}
                    >
                      {isNarrativeOpen ? "▲ संक्षेप करें" : "▼ पूरी कहानी पढ़ें"}
                    </button>
                  </div>

                  {isNarrativeOpen && (
                    <div style={{ marginTop: 14 }}>
                      {/* Quote Box */}
                      <div className="tp-story-quote">
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 16,
                            fontStyle: "italic",
                            color: "#1A1A1A",
                            lineHeight: 1.6,
                            paddingLeft: 14,
                          }}
                        >
                          {narrative.introQuote}
                        </p>
                      </div>

                      {/* Chapters Grid */}
                      <div className="tp-chapters-grid">
                        {narrative.chapters.map((ch) => (
                          <article className="tp-chapter-card" key={ch.number}>
                            <div className="tp-chapter-head">
                              <span className="tp-chapter-icon">{ch.icon}</span>
                              <h3 className="tp-chapter-title">
                                अध्याय {ch.number}: {ch.title}
                              </h3>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              {ch.story.split("\n\n").map((para, idx) => (
                                <p className="tp-story-p" key={idx}>
                                  {para}
                                </p>
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>

                      {/* Final Mentor Advice */}
                      <div className="tp-final-advice">
                        <span style={{ fontSize: 26, flexShrink: 0 }}>🧭</span>
                        <div>
                          <strong style={{ fontSize: 13, color: "#1A1A1A" }}>
                            आज का व्यावहारिक स्वर्ण-नियम
                          </strong>
                          <p style={{ fontSize: 13, color: "#4A4238", marginTop: 2, lineHeight: 1.6 }}>
                            {narrative.closingAdvice}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* FEATURE 2: INSTANT OBJECT SEARCH & LIVE ANALYZER */}
              {/* ───────────────────────────────────────────────────────────── */}
              <section className="tp-search-wrap">
                <div className="tp-row">
                  <div>
                    <div className="tp-kicker">Instant Object Grammar Search</div>
                    <h2 className="tp-h" style={{ margin: 0 }}>
                      🔍 क्या खरीदना चाहते हैं? (सर्च करें)
                    </h2>
                    <p className="tp-muted" style={{ marginTop: 4 }}>
                      किसी भी वस्तु का नाम टाइप करें — सिस्टम तुरंत अधिपति ग्रह, आज का गोचर स्कोर, लाल किताब सावधानी और क्रय-निर्णय बताएगा।
                    </p>
                  </div>
                  <span className="tp-chip">45+ वस्तुएं शामिल</span>
                </div>

                {/* Input Field */}
                <div className="tp-search-input-wrap">
                  <span className="tp-search-icon">🔍</span>
                  <input
                    type="text"
                    className="tp-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="उदा. iPhone 16, Car, Scorpio, Gold, Plot, Shoes, Laptop, TV, Puja items..."
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="tp-search-clear"
                      onClick={() => setSearchQuery("")}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Popular Quick Chips */}
                <div className="tp-chips">
                  {POPULAR_SEARCH_CHIPS.map((chip) => {
                    const isActive = searchQuery.toLowerCase().includes(chip.q);
                    return (
                      <button
                        key={chip.q}
                        type="button"
                        className={`tp-chip-btn${isActive ? " active" : ""}`}
                        onClick={() => setSearchQuery(chip.q)}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search Results Display */}
                {searchResults.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px 14px",
                      background: "#FAF7F2",
                      borderRadius: 14,
                      marginTop: 16,
                      border: "1px dashed rgba(184,134,11,0.3)",
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                      &apos;{searchQuery}&apos; के लिए कोई वस्तु नहीं मिली
                    </p>
                    <p style={{ fontSize: 12, color: "#6B635B", marginTop: 4 }}>
                      कृपया सामान्य शब्द टाइप करें जैसे: &apos;phone&apos;, &apos;car&apos;, &apos;gold&apos;, &apos;zameen&apos;, &apos;shoes&apos;, &apos;laptop&apos; आदि।
                    </p>
                  </div>
                ) : (
                  <div>
                    {!searchQuery && (
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#8C827A",
                          marginTop: 16,
                          marginBottom: 8,
                        }}
                      >
                        ⚡ लोकप्रिय श्रेणियां (लाइव गोचर स्थिति):
                      </p>
                    )}
                    <div className="tp-results-grid">
                      {searchResults.map((res) => {
                        const scoreColor =
                          res.verdictScore >= 60
                            ? "#15803d"
                            : res.verdictScore >= 45
                            ? "#B8860B"
                            : "#b91c1c";

                        return (
                          <div className="tp-result-card" key={res.item.id}>
                            <div>
                              {/* Header: Icon, Name & Verdict Badge */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  gap: 8,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span style={{ fontSize: 28, lineHeight: 1 }}>{res.item.icon}</span>
                                  <div>
                                    <strong style={{ fontSize: 15, color: "#1A1A1A", display: "block" }}>
                                      {res.item.hindiName}
                                    </strong>
                                    <span style={{ fontSize: 11, color: "#8C827A" }}>
                                      {res.item.name}
                                    </span>
                                  </div>
                                </div>
                                <Badge verdict={res.finalVerdict} />
                              </div>

                              {/* Ruling Graha & Score */}
                              <div
                                style={{
                                  marginTop: 12,
                                  padding: "8px 12px",
                                  background: "#FFFFFF",
                                  borderRadius: 10,
                                  border: "1px solid rgba(184,134,11,0.18)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 11,
                                    fontWeight: 700,
                                  }}
                                >
                                  <span style={{ color: "#B8860B" }}>
                                    अधिपति: {res.rulingPlanetsSummary}
                                  </span>
                                  <span style={{ color: scoreColor }}>
                                    स्ट्रेंथ: {res.verdictScore}/100
                                  </span>
                                </div>
                                <div className="tp-res-score-bar">
                                  <div
                                    className="tp-res-score-fill"
                                    style={{
                                      width: `${Math.min(100, Math.max(10, res.verdictScore))}%`,
                                      background: scoreColor,
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Live Astrological Explanation */}
                              <p
                                style={{
                                  fontSize: 12.5,
                                  color: "#4A4238",
                                  lineHeight: 1.6,
                                  marginTop: 10,
                                }}
                              >
                                {res.liveExplanation}
                              </p>

                              {/* Lal Kitab Specific Rule */}
                              {res.lalKitabNote && (
                                <div
                                  style={{
                                    marginTop: 10,
                                    padding: "8px 10px",
                                    background: "rgba(217,119,6,0.08)",
                                    border: "1px solid rgba(217,119,6,0.25)",
                                    borderRadius: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 800,
                                      color: "#b45309",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                      marginBottom: 2,
                                    }}
                                  >
                                    ⚠️ लाल किताब सूत्र
                                  </div>
                                  <p style={{ fontSize: 11.5, color: "#78350f", lineHeight: 1.5 }}>
                                    {res.lalKitabNote}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Practical Pre-purchase Checks */}
                            {res.practicalChecks && res.practicalChecks.length > 0 && (
                              <div
                                style={{
                                  marginTop: 12,
                                  paddingTop: 10,
                                  borderTop: "1px solid rgba(184,134,11,0.15)",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.8px",
                                    color: "#8C827A",
                                  }}
                                >
                                  भुगतान से पहले जांचें:
                                </span>
                                <ul style={{ margin: "4px 0 0", paddingLeft: 14 }}>
                                  {res.practicalChecks.map((chk, i) => (
                                    <li
                                      key={i}
                                      style={{
                                        fontSize: 11.5,
                                        color: "#4A4238",
                                        lineHeight: 1.5,
                                        marginBottom: 2,
                                      }}
                                    >
                                      {chk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* EXISTING PILLARS: VERDICT & SADE SATI ZONE */}
              {/* ───────────────────────────────────────────────────────────── */}
              <section className="tp-grid">
                <article className="tp-card span-7">
                  <div className="tp-row">
                    <div>
                      <h2 className="tp-h">Overall: {guidance.overall}</h2>
                      <p className="tp-p">{guidance.summary}</p>
                      <p className="tp-muted" style={{ marginTop: 8 }}>
                        {guidance.methodNote}
                      </p>
                    </div>
                    <Badge verdict={guidance.overall} />
                  </div>
                </article>

                <article className="tp-card span-5">
                  <div className="tp-kicker">Strongest Warning</div>
                  <h2 className="tp-h">{guidance.strongestWarning}</h2>
                  <p className="tp-p">
                    This is the first object/timing signal to handle before making a purchase.
                  </p>
                  <p className="tp-muted" style={{ marginTop: 8 }}>
                    {guidance.strongestWarningReason}
                  </p>
                </article>

                <article className="tp-card span-12">
                  <div className="tp-row">
                    <div>
                      <div className="tp-kicker">Moon Transit Zone</div>
                      <h2 className="tp-h">{guidance.sadeSatiZone.title}</h2>
                      <p className="tp-p">{guidance.sadeSatiZone.description}</p>
                    </div>
                    <Badge verdict={guidance.sadeSatiZone.active ? "WAIT" : "BUY_CAREFULLY"} />
                  </div>
                  <div className="tp-snap">
                    <div className="tp-snap-item">
                      <div className="tp-snap-k">Phase</div>
                      <div className="tp-snap-v" style={{ textTransform: "capitalize" }}>
                        {guidance.sadeSatiZone.phase}
                      </div>
                    </div>
                    <div className="tp-snap-item">
                      <div className="tp-snap-k">Severity</div>
                      <div className="tp-snap-v" style={{ textTransform: "capitalize" }}>
                        {guidance.sadeSatiZone.severity}
                      </div>
                    </div>
                    <div className="tp-snap-item">
                      <div className="tp-snap-k">Purchase Impact</div>
                      <div className="tp-snap-v">{guidance.sadeSatiZone.scoreImpact}</div>
                    </div>
                  </div>
                  <div className="tp-cols">
                    <div>
                      <div className="tp-kicker" style={{ color: "#b91c1c" }}>
                        Purchase cautions
                      </div>
                      {guidance.sadeSatiZone.purchaseCautions.map((item) => (
                        <p className="tp-bullet tp-bad" key={item}>
                          {item}
                        </p>
                      ))}
                    </div>
                    <div>
                      <div className="tp-kicker" style={{ color: "#15803d" }}>
                        Remedies
                      </div>
                      {guidance.sadeSatiZone.remedies.map((item) => (
                        <p className="tp-bullet tp-good" key={item}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* 9-PLANET LIVE TABS */}
                {/* ───────────────────────────────────────────────────────────── */}
                {planetReport && activePlanetGuidance && (
                  <article className="tp-card span-12">
                    <div className="tp-row">
                      <div>
                        <div className="tp-kicker">Per-Planet Gochar — Live Transit</div>
                        <h2 className="tp-h">हर ग्रह के हिसाब से क्या खरीदें</h2>
                      </div>
                      <span className="tp-chip">Base: {planetReport.baseLabel}</span>
                    </div>
                    <p className="tp-muted" style={{ marginTop: 4 }}>
                      Each planet&apos;s verdict is computed live from its current Gochar position (rashi, house, retrograde, strength).
                      Tap a graha to see exactly what to buy, wait on, or avoid right now.
                    </p>

                    {/* Planet tabs */}
                    <div className="tp-tabs">
                      {planetReport.planets.map((p) => {
                        const c =
                          p.verdict === "AVOID"
                            ? "#b91c1c"
                            : p.verdict === "WAIT"
                            ? "#d97706"
                            : p.verdict === "BUY_CAREFULLY"
                            ? "#B8860B"
                            : "#15803d";
                        return (
                          <button
                            key={p.planet}
                            type="button"
                            className={`tp-tab${activePlanet === p.planet ? " active" : ""}`}
                            onClick={() => setActivePlanet(p.planet)}
                          >
                            <span className="glyph">{p.glyph}</span>
                            {p.planet}
                            <span className="dot" style={{ background: c }} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Active planet detail */}
                    <div className="tp-item" style={{ marginTop: 14 }}>
                      <div className="tp-planet-head">
                        <div className="tp-planet-title">
                          <span className="tp-glyph-lg">{activePlanetGuidance.glyph}</span>
                          <div>
                            <strong style={{ fontSize: 18, color: "#1A1A1A" }}>
                              {activePlanetGuidance.planet} · {activePlanetGuidance.hindiName}
                            </strong>
                            <p className="tp-muted">{activePlanetGuidance.domain}</p>
                          </div>
                        </div>
                        <Badge verdict={activePlanetGuidance.verdict} />
                      </div>

                      <p className="tp-p" style={{ marginTop: 10 }}>
                        {activePlanetGuidance.guidance}
                      </p>
                      <p className="tp-muted" style={{ marginTop: 6 }}>
                        {activePlanetGuidance.timing}
                      </p>

                      {/* Live transit snapshot */}
                      <div className="tp-snap">
                        <div className="tp-snap-item">
                          <div className="tp-snap-k">Rashi</div>
                          <div className="tp-snap-v">
                            {activePlanetGuidance.transit.rashiName}{" "}
                            {Math.round(activePlanetGuidance.transit.degreeInRashi)}°
                          </div>
                        </div>
                        <div className="tp-snap-item">
                          <div className="tp-snap-k">
                            House (from {activePlanetGuidance.transit.baseLabel})
                          </div>
                          <div className="tp-snap-v">
                            {activePlanetGuidance.transit.houseFromBase}
                            {activePlanetGuidance.transit.difficultHouse ? " ⚠" : ""}
                          </div>
                        </div>
                        <div className="tp-snap-item">
                          <div className="tp-snap-k">Effect</div>
                          <div className="tp-snap-v" style={{ textTransform: "capitalize" }}>
                            {activePlanetGuidance.transit.effect}
                          </div>
                        </div>
                        <div className="tp-snap-item">
                          <div className="tp-snap-k">Strength</div>
                          <div className="tp-snap-v">{activePlanetGuidance.score}/100</div>
                        </div>
                        <div className="tp-snap-item">
                          <div className="tp-snap-k">Motion</div>
                          <div className="tp-snap-v">
                            {activePlanetGuidance.transit.retrograde ? "Retrograde" : "Direct"}
                          </div>
                        </div>
                      </div>

                      {/* Objects governed */}
                      <div className="tp-objects">
                        {activePlanetGuidance.objects.map((o) => (
                          <span className="tp-obj" key={o}>
                            {o}
                          </span>
                        ))}
                      </div>

                      {/* Favourable / Avoid */}
                      <div className="tp-cols">
                        <div>
                          <div className="tp-kicker" style={{ color: "#15803d" }}>
                            Good to buy now
                          </div>
                          {activePlanetGuidance.favourable.map((f) => (
                            <p className="tp-bullet tp-good" key={f}>
                              {f}
                            </p>
                          ))}
                        </div>
                        <div>
                          <div className="tp-kicker" style={{ color: "#b91c1c" }}>
                            Avoid now
                          </div>
                          {activePlanetGuidance.avoid.map((a) => (
                            <p className="tp-bullet tp-bad" key={a}>
                              {a}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Practical checks */}
                      <div style={{ marginTop: 12 }}>
                        <div className="tp-kicker">Practical checks</div>
                        {activePlanetGuidance.checks.map((c) => (
                          <p className="tp-bullet tp-neutral" key={c}>
                            {c}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* 5 BUYING WINDOWS & LAL KITAB RULES */}
                {/* ───────────────────────────────────────────────────────────── */}
                <article className="tp-card span-12">
                  <div className="tp-row">
                    <h2 className="tp-h">Gochar Buying Windows</h2>
                    <span className="tp-chip">{guidance.transit.windows.length} categories</span>
                  </div>
                  <div className="tp-list">
                    {guidance.transit.windows.map((window) => (
                      <div className="tp-item" key={window.id}>
                        <div className="tp-item-top">
                          <div>
                            <strong style={{ color: "#1A1A1A" }}>{window.title}</strong>
                            <p className="tp-muted">{window.timing}</p>
                          </div>
                          <Badge verdict={window.verdict} />
                        </div>
                        <p className="tp-p">{window.guidance}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="tp-card span-12">
                  <div className="tp-row">
                    <h2 className="tp-h">Lal Kitab Object & Gift Caution</h2>
                    <span className="tp-chip">Not 35-sala / varshphal</span>
                  </div>
                  <div className="tp-list">
                    {guidance.lalKitab.map((item) => (
                      <div className="tp-item" key={item.id}>
                        <div className="tp-item-top">
                          <div>
                            <strong style={{ color: "#1A1A1A" }}>{item.title}</strong>
                            <p className="tp-muted">
                              {item.activeTriggers.length
                                ? item.activeTriggers.join(" · ")
                                : "No active trigger"}
                            </p>
                          </div>
                          <Badge verdict={item.verdict} />
                        </div>
                        <p className="tp-p">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="tp-card span-6">
                  <h2 className="tp-h">Avoid / Wait</h2>
                  <div className="tp-list">
                    {guidance.avoid.map((item) => (
                      <div className="tp-item" key={`${item.source}-${item.title}`}>
                        <strong style={{ color: "#1A1A1A" }}>{item.title}</strong>
                        <p className="tp-muted">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="tp-card span-6">
                  <h2 className="tp-h">Buy Carefully / Favourable</h2>
                  <div className="tp-list">
                    {[...guidance.buyCarefully, ...guidance.favourable].map((item) => (
                      <div className="tp-item" key={`${item.source}-${item.title}`}>
                        <strong style={{ color: "#1A1A1A" }}>{item.title}</strong>
                        <p className="tp-muted">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </>
          )}
        </div>
      </PremiumFeature>
    </main>
  );
}
