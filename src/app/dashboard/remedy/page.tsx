"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { calculateRemedies, type RemedyCard } from "@/lib/astro-engine/remedy";
import { EngineStateCard } from "@/components/engine-state-card";
import { PremiumFeature } from "@/components/premium-feature";

// ── Planet metadata ───────────────────────────────────────────
const PLANET_META: Record<string, { emoji: string; accentColor: string; dayColor: string }> = {
  Sun:     { emoji: "☉",  accentColor: "#f59e0b", dayColor: "rgba(245,158,11,0.18)" },
  Moon:    { emoji: "☽",  accentColor: "#93c5fd", dayColor: "rgba(147,197,253,0.18)" },
  Mars:    { emoji: "♂",  accentColor: "#ef4444", dayColor: "rgba(239,68,68,0.18)" },
  Mercury: { emoji: "☿",  accentColor: "#22c55e", dayColor: "rgba(34,197,94,0.18)" },
  Jupiter: { emoji: "♃",  accentColor: "#eab308", dayColor: "rgba(234,179,8,0.18)" },
  Venus:   { emoji: "♀",  accentColor: "#f472b6", dayColor: "rgba(244,114,182,0.18)" },
  Saturn:  { emoji: "♄",  accentColor: "#818cf8", dayColor: "rgba(129,140,248,0.18)" },
  Rahu:    { emoji: "☊",  accentColor: "#6b7280", dayColor: "rgba(107,114,128,0.18)" },
  Ketu:    { emoji: "☋",  accentColor: "#a78bfa", dayColor: "rgba(167,139,250,0.18)" },
};

// ── Priority border colors ────────────────────────────────────
const PRIORITY_BORDER: Record<RemedyCard["priority"], string> = {
  urgent:      "rgba(239,68,68,0.55)",
  recommended: "rgba(200,160,48,0.45)",
  optional:    "rgba(96,88,144,0.35)",
};

const PRIORITY_BADGE_BG: Record<RemedyCard["priority"], string> = {
  urgent:      "rgba(239,68,68,0.12)",
  recommended: "rgba(200,160,48,0.10)",
  optional:    "rgba(96,88,144,0.08)",
};

const PRIORITY_BADGE_COLOR: Record<RemedyCard["priority"], string> = {
  urgent:      "#fca5a5",
  recommended: "#f0d898",
  optional:    "#8b80bf",
};

// ── Individual remedy card component ─────────────────────────
function RemedyCardUI({ card, index }: { card: RemedyCard; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = PLANET_META[card.planet] ?? { emoji: "✦", accentColor: "#c8a030", dayColor: "rgba(200,160,48,0.18)" };

  const rows: Array<{ icon: string; label: string; value: string }> = [
    { icon: "💎", label: "Gem",      value: card.gem },
    { icon: "🔔", label: "Mantra",   value: card.mantra },
    { icon: "🙏", label: "Donate",   value: card.donate },
    { icon: "🌿", label: "Practice", value: card.practice },
    { icon: "🎨", label: "Colors",   value: card.color },
  ];

  return (
    <article
      onClick={() => setExpanded((v) => !v)}
      style={{
        background: "#0d0a22",
        border: `1px solid ${PRIORITY_BORDER[card.priority]}`,
        borderRadius: 18,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        position: "relative",
        overflow: "hidden",
        animationDelay: `${index * 0.04}s`,
      }}
    >
      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${meta.accentColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Card header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, position: "relative" }}>
        {/* Left: planet icon + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: meta.dayColor,
              border: `1px solid ${meta.accentColor}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {meta.emoji}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#f0e8d0" }}>
                {card.planet}
              </span>
              {/* Weak / supported badge */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 9px",
                  borderRadius: 20,
                  background: card.isWeak ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.10)",
                  color: card.isWeak ? "#fca5a5" : "#86efac",
                  border: `1px solid ${card.isWeak ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.2)"}`,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                {card.isWeak ? "⚠️ Upay Zaroori" : "✓ Supported"}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#8b80bf" }}>
              House {card.house} · {card.sign} · {card.nakshatra}
            </div>
          </div>
        </div>

        {/* Right: priority badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: 20,
              background: PRIORITY_BADGE_BG[card.priority],
              color: PRIORITY_BADGE_COLOR[card.priority],
              border: `1px solid ${PRIORITY_BORDER[card.priority]}`,
            }}
          >
            {card.priority}
          </span>
          <span style={{ fontSize: 11, color: "#605890" }}>{card.status}</span>
        </div>
      </div>

      {/* Summary line */}
      <p style={{ fontSize: 12, color: "#8b80bf", lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" }}>
        {card.summary}
      </p>

      {/* House-specific remedy — always visible */}
      <div
        style={{
          background: "rgba(200,160,48,0.06)",
          border: "1px solid rgba(200,160,48,0.25)",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: expanded ? 16 : 0,
        }}
      >
        <div style={{ fontSize: 9, color: "#c8a030", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>
          House {card.house} Remedy
        </div>
        <p style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.75, margin: 0 }}>{card.houseRemedy}</p>
      </div>

      {/* Expanded detail rows */}
      {expanded && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "8px 12px",
                background: "rgba(0,0,0,0.25)",
                borderRadius: 8,
                border: "1px solid #1c1840",
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 9, color: "#605890", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 2 }}>
                  {row.label}
                </div>
                <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.65 }}>{row.value}</div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#605890" }}>Tap to collapse ↑</span>
          </div>
        </div>
      )}

      {/* Expand hint when collapsed */}
      {!expanded && (
        <div style={{ marginTop: 10, textAlign: "right" }}>
          <span style={{ fontSize: 11, color: "#605890" }}>Tap for gem + mantra details ↓</span>
        </div>
      )}
    </article>
  );
}

// ── Summary banner ────────────────────────────────────────────
function SummaryBanner({ urgentCount, topPriority, totalCount }: {
  urgentCount: number;
  topPriority: RemedyCard | null;
  totalCount: number;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #110e2a, #1a1040)",
        border: "1px solid rgba(200,160,48,0.28)",
        borderRadius: 18,
        padding: "24px 28px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orb */}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,160,48,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a030", marginBottom: 6 }}>
          Chart Analysis
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>
          {topPriority
            ? `${topPriority.planet} needs most attention`
            : "All planets analysed"}
        </div>
        {topPriority && (
          <div style={{ fontSize: 12, color: "#8b80bf" }}>
            {topPriority.sign} · House {topPriority.house} · {topPriority.status}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", position: "relative" }}>
        {[
          { n: totalCount,  l: "Planets",          c: "#c8a030" },
          { n: urgentCount, l: "Need Upay",         c: "#ef4444" },
          { n: totalCount - urgentCount, l: "Supported", c: "#22c55e" },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              textAlign: "center",
              background: "rgba(0,0,0,0.25)",
              borderRadius: 12,
              padding: "14px 18px",
              border: "1px solid rgba(200,160,48,0.1)",
              minWidth: 72,
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: s.c, lineHeight: 1 }}>
              {s.n}
            </div>
            <div style={{ fontSize: 10, color: "#605890", marginTop: 4, letterSpacing: "0.5px" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────
type TabKey = "all" | "urgent" | "byhouse";

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: Array<{ id: TabKey; label: string }> = [
    { id: "all",     label: "All Planets" },
    { id: "urgent",  label: "⚠️ Urgent First" },
    { id: "byhouse", label: "By House" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        background: "#0a0720",
        border: "1px solid #1c1840",
        borderRadius: 12,
        padding: 4,
        width: "fit-content",
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "8px 20px",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            color: active === t.id ? "#c8c0a8" : "#605890",
            border: "none",
            background: active === t.id ? "#1c1840" : "none",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── House group header ────────────────────────────────────────
function HouseGroupHeader({ house }: { house: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 28,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(200,160,48,0.10)",
          border: "1px solid rgba(200,160,48,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16,
          fontWeight: 700,
          color: "#c8a030",
        }}
      >
        {house}
      </div>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#f0e8d0" }}>
        {houseLabel(house)}
      </span>
      <div style={{ flex: 1, height: 1, background: "#1c1840" }} />
    </div>
  );
}

function houseLabel(h: number): string {
  const labels: Record<number, string> = {
    1: "1st House — Self & Body",
    2: "2nd House — Wealth & Speech",
    3: "3rd House — Courage & Siblings",
    4: "4th House — Home & Mother",
    5: "5th House — Intellect & Children",
    6: "6th House — Enemies & Health",
    7: "7th House — Marriage & Partnership",
    8: "8th House — Longevity & Transformation",
    9: "9th House — Dharma & Fortune",
    10: "10th House — Career & Authority",
    11: "11th House — Gains & Network",
    12: "12th House — Liberation & Foreign",
  };
  return labels[h] ?? `${h}th House`;
}

// ── Premium Rahu/Ketu wrapper ─────────────────────────────────
function MaybePremium({ planet, children }: { planet: string; children: React.ReactNode }) {
  if (planet === "Rahu" || planet === "Ketu") {
    return (
      <PremiumFeature feature={`${planet} Remedy Engine`}>
        {children}
      </PremiumFeature>
    );
  }
  return <>{children}</>;
}

// ── Main page ─────────────────────────────────────────────────
export default function RemedyPage() {
  const { chart, loading } = useUserChart();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const result = useMemo(() => calculateRemedies(chart), [chart]);

  // Filter logic
  const displayCards = useMemo(() => {
    if (activeTab === "urgent") {
      return result.cards.filter((c) => c.priority === "urgent");
    }
    return result.cards;
  }, [activeTab, result.cards]);

  // By-house grouping
  const byHouseGroups = useMemo(() => {
    const groups: Map<number, RemedyCard[]> = new Map();
    result.cards.forEach((c) => {
      if (!groups.has(c.house)) groups.set(c.house, []);
      groups.get(c.house)!.push(c);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [result.cards]);

  if (loading) {
    return (
      <main style={{ background: "#060410", minHeight: "100vh", padding: "32px 24px 120px" }}>
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Remedy Engine"
            loading
            loadingText="Loading chart data... remedies will appear automatically."
          />
        </section>
        <MobileBottomNav />
      </main>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060410; color: #f0e8d0; font-family: 'Outfit', sans-serif; min-height: 100vh; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #060410; }
        ::-webkit-scrollbar-thumb { background: #c8a030; border-radius: 2px; }
        article[aria-expanded]:hover { border-color: rgba(200,160,48,0.45) !important; transform: translateY(-2px); }
      `}</style>

      <main
        style={{
          background: "#060410",
          minHeight: "100vh",
          padding: "32px 24px 120px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* ── Hero header ── */}
          <header style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#c8a030",
                marginBottom: 8,
              }}
            >
              AstroLife · Vedic Jyotish
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 42,
                fontWeight: 700,
                color: "#f0e8d0",
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              💊 Remedy Engine
            </h1>
            <p style={{ fontSize: 15, color: "#605890", lineHeight: 1.6 }}>
              Vedic Planetary Remedies &mdash;{" "}
              <span style={{ color: "#8b80bf" }}>Gems · Mantras · Donations · Daily Practices</span>
            </p>
          </header>

          {/* ── Summary banner ── */}
          <SummaryBanner
            urgentCount={result.urgentCount}
            topPriority={result.topPriority}
            totalCount={result.cards.length}
          />

          {/* ── Tabs ── */}
          <TabBar active={activeTab} onChange={setActiveTab} />

          {/* ── Cards: All or Urgent ── */}
          {activeTab !== "byhouse" && (
            <>
              {displayCards.length === 0 && (
                <div
                  style={{
                    background: "#0d0a22",
                    border: "1px solid #1c1840",
                    borderRadius: 14,
                    padding: "32px 24px",
                    textAlign: "center",
                    color: "#605890",
                    fontSize: 14,
                  }}
                >
                  {activeTab === "urgent"
                    ? "No urgent remedies found — all planets are in strong positions."
                    : "No remedy data available. Please complete onboarding."}
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 16,
                }}
              >
                {displayCards.map((card, i) => (
                  <MaybePremium key={card.planet} planet={card.planet}>
                    <RemedyCardUI card={card} index={i} />
                  </MaybePremium>
                ))}
              </div>
            </>
          )}

          {/* ── By House view ── */}
          {activeTab === "byhouse" && (
            <div>
              {byHouseGroups.map(([house, cards]) => (
                <div key={house}>
                  <HouseGroupHeader house={house} />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {cards.map((card, i) => (
                      <MaybePremium key={card.planet} planet={card.planet}>
                        <RemedyCardUI card={card} index={i} />
                      </MaybePremium>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Disclaimer ── */}
          <div
            style={{
              marginTop: 40,
              padding: "16px 20px",
              background: "rgba(200,160,48,0.04)",
              border: "1px solid rgba(200,160,48,0.15)",
              borderRadius: 12,
              fontSize: 12,
              color: "#605890",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            <span style={{ color: "#8b80bf" }}>Note: </span>
            Remedies are spiritual guidance tools. Results vary per individual karma and sincere practice.
            Always consult a qualified Jyotishi before wearing gemstones.
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </>
  );
}
