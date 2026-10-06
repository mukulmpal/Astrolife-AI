"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculateLineageKarma } from "@/lib/astro-engine/lineage-karma";
import { Dna, ChevronDown, ChevronUp, Flame, Droplets, TreePine, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

// ── Section collapse helper ──────────────────────────────────────────────────
function Section({
  title,
  emoji,
  color = "#7C3AED",
  children,
  defaultOpen = false,
}: {
  title: string;
  emoji: string;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        border: `1px solid ${color}33`,
        borderRadius: "12px",
        marginBottom: "14px",
        overflow: "hidden",
        background: `${color}07`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "14px", color: color, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{emoji}</span> {title}
        </span>
        {open ? (
          <ChevronUp size={16} style={{ color }} />
        ) : (
          <ChevronDown size={16} style={{ color }} />
        )}
      </button>
      {open && (
        <div style={{ padding: "0 18px 16px 18px", fontSize: "13px", color: "#3D3530", lineHeight: "1.75" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Pill badge ───────────────────────────────────────────────────────────────
function Pill({ text, color = "#7C3AED" }: { text: string; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: `${color}14`,
        border: `1px solid ${color}44`,
        borderRadius: "20px",
        padding: "3px 12px",
        fontSize: "11px",
        fontWeight: 600,
        color,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {text}
    </span>
  );
}

// ── Remedy card ──────────────────────────────────────────────────────────────
function RemedyCard({
  title,
  purpose,
  instructions,
  frequency,
  duration,
  priority,
}: {
  title: string;
  purpose: string;
  instructions: string;
  frequency: string;
  duration: string;
  priority: 1 | 2 | 3;
}) {
  const [open, setOpen] = useState(false);
  const priorityColor = priority === 1 ? "#DC2626" : priority === 2 ? "#D97706" : "#059669";
  const priorityLabel = priority === 1 ? "Immediate" : priority === 2 ? "Regular" : "Optional";

  return (
    <div
      style={{
        borderLeft: `3px solid ${priorityColor}`,
        background: `${priorityColor}07`,
        borderRadius: "10px",
        marginBottom: "10px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>{title}</div>
          <div style={{ fontSize: "11px", color: "#6B635B", marginTop: 2 }}>{purpose}</div>
        </div>
        <span
          style={{
            flexShrink: 0,
            background: `${priorityColor}18`,
            border: `1px solid ${priorityColor}44`,
            borderRadius: "12px",
            padding: "2px 10px",
            fontSize: "10px",
            fontWeight: 700,
            color: priorityColor,
          }}
        >
          {priorityLabel}
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px", fontSize: "12px", color: "#4A4238", lineHeight: 1.7 }}>
          <div style={{ marginBottom: 6 }}>
            <strong>Practice:</strong> {instructions}
          </div>
          <div>
            <strong>Frequency:</strong> {frequency} &nbsp;|&nbsp;
            <strong>Duration:</strong> {duration.replace("_", " ")}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function LineageKarmaPage() {
  const { chart } = useUserChart();
  const [activeTab, setActiveTab] = useState<"report" | "remedies" | "antahkarana">("report");

  const lineage = useMemo(() => {
    if (!chart) return null;
    return calculateLineageKarma(chart, {
      nativeName: chart.name || "Seeker",
      btrConfidence: "High",
    });
  }, [chart]);

  if (!chart) {
    return (
      <main style={{ padding: "32px 20px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Dna size={48} style={{ color: "#7C3AED", marginBottom: 16 }} />
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>Lineage Karma & Pitru Intelligence</div>
        <div style={{ color: "#6B635B", marginTop: 8 }}>
          Please add your birth details first to generate your ancestral report.
        </div>
      </main>
    );
  }

  const tabs = [
    { id: "report" as const, label: "🕉️ Report" },
    { id: "remedies" as const, label: "🌿 Remedies" },
    { id: "antahkarana" as const, label: "🧠 Antahkarana" },
  ];

  return (
    <main style={{ padding: "24px 20px", maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #7C3AED22, #DB277722)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Dna size={22} style={{ color: "#7C3AED" }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "18px", color: "#1A1A1A" }}>
            Lineage Karma & Pitru Intelligence
          </div>
          <div style={{ fontSize: "12px", color: "#6B635B" }}>
            {chart.name} &middot; 7-Layer Ancestral Analysis (BPHS · Arroyo · KN Rao · PVR)
          </div>
        </div>
      </div>

      {/* Ancestral gate pill */}
      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Pill
          text={lineage?.ancestralGatePassed ? "✅ Ancestral Gate: OPEN" : "🔵 General Interpretation"}
          color={lineage?.ancestralGatePassed ? "#059669" : "#6B7280"}
        />
        <Pill text={`BTR: ${lineage?.btrConfidence || "High"}`} color="#7C3AED" />
        {lineage?.gateReasons?.slice(0, 2).map((r) => (
          <Pill key={r} text={r} color="#D97706" />
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 20,
          background: "rgba(124,58,237,0.06)",
          border: "1px solid rgba(124,58,237,0.15)",
          borderRadius: "12px",
          padding: "5px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: "12px",
              background: activeTab === t.id ? "#7C3AED" : "transparent",
              color: activeTab === t.id ? "#fff" : "#6B635B",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: REPORT ─────────────────────────────────────────────────── */}
      {activeTab === "report" && lineage && (
        <div>
          {/* One sentence summary */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(219,39,119,0.08))",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "12px",
              padding: "16px 18px",
              marginBottom: 16,
              fontStyle: "italic",
              fontSize: "14px",
              color: "#3D3530",
              lineHeight: 1.7,
            }}
          >
            🕉️ &ldquo;{lineage.executiveSummary.oneSentenceSummary}&rdquo;
          </div>

          {/* Narrative markdown */}
          <Section title="आपकी पूरी कहानी" emoji="📖" color="#7C3AED" defaultOpen>
            <div
              className="prose prose-sm max-w-none"
              style={{ fontSize: "13px", lineHeight: "1.85", color: "#3D3530" }}
            >
              <ReactMarkdown>{lineage.narrativeMarkdown}</ReactMarkdown>
            </div>
          </Section>

          {/* Kula Devata */}
          <Section title="कुल देवता (Family Guardian)" emoji="🏛️" color="#B45309">
            <div style={{ display: "grid", gap: "8px" }}>
              <div>
                <strong>Guardian:</strong> {lineage.kulaDevata.suggestedDeity.traditionalMaleName} /&nbsp;
                {lineage.kulaDevata.suggestedDeity.traditionalFemaleName}
              </div>
              <div>
                <strong>Connection Status:</strong>{" "}
                <Pill
                  text={lineage.kulaDevata.connectionStatus}
                  color={
                    lineage.kulaDevata.connectionStatus === "VIBRANT" ? "#059669" :
                    lineage.kulaDevata.connectionStatus === "WEAKENED" ? "#D97706" : "#DC2626"
                  }
                />
              </div>
              <div><strong>Guidance:</strong> {lineage.kulaDevata.rootsGuidance}</div>
              <div style={{ background: "rgba(180,83,9,0.07)", border: "1px solid rgba(180,83,9,0.2)", borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
                🙏 <strong>Offering:</strong> {lineage.kulaDevata.simplePranamOffering}
              </div>
            </div>
          </Section>

          {/* Ishta Devata */}
          <Section title="इष्ट देवता (Soul Guide)" emoji="✨" color="#0F766E">
            <div style={{ display: "grid", gap: "8px" }}>
              <div>
                <strong>Soul Deity:</strong> {lineage.ishtaDevata.suggestedDeity.deityName}
              </div>
              <div><strong>Atmakaraka:</strong> {lineage.ishtaDevata.atmakarakaPlanet} in D9 {lineage.ishtaDevata.karakamsaSign}</div>
              <div style={{ background: "rgba(15,118,110,0.07)", border: "1px solid rgba(15,118,110,0.2)", borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
                🕉️ <strong>Dhyana Mantra:</strong> {lineage.ishtaDevata.soulDhyanaMantra}
              </div>
              <div style={{ marginTop: 4 }}>{lineage.ishtaDevata.wingsGuidance}</div>
            </div>
          </Section>

          {/* Obstacles */}
          {lineage.obstacles.filter(o => o.active).length > 0 && (
            <Section title="जीवन में आने वाली रुकावटें" emoji="⚠️" color="#DC2626">
              {lineage.obstacles.filter(o => o.active).map(ob => (
                <div
                  key={ob.domain}
                  style={{
                    border: "1px solid rgba(220,38,38,0.2)",
                    background: "rgba(220,38,38,0.04)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#DC2626", marginBottom: 4 }}>
                    {ob.domain.replace("_", " ")} — <span style={{ fontWeight: 500, color: "#6B635B" }}>{ob.severity}</span>
                  </div>
                  <div style={{ marginBottom: 4 }}>{ob.humanExperienceText}</div>
                  <div style={{ color: "#059669", fontWeight: 600 }}>🌿 {ob.unblockingRemedy}</div>
                </div>
              ))}
            </Section>
          )}

          {/* Positive gifts */}
          {lineage.anugraha.hasStrongAnugraha && (
            <Section title="पूर्वजों के वरदान (Inherited Gifts)" emoji="🎁" color="#059669">
              {lineage.anugraha.inheritedGifts.map(g => (
                <div key={g} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#059669", flexShrink: 0 }}>✦</span>
                  <span>{g}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                🌟 {lineage.anugraha.counterweightBlessing}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* ── TAB: REMEDIES ───────────────────────────────────────────────── */}
      {activeTab === "remedies" && lineage && (
        <div>
          {/* Gemstone disclaimer */}
          <div
            style={{
              background: "rgba(220,38,38,0.05)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: 16,
              fontSize: "12px",
              color: "#6B635B",
              lineHeight: 1.65,
            }}
          >
            💎 <strong style={{ color: "#DC2626" }}>Gemstone Rule:</strong>{" "}
            {lineage.remedyIntelligence?.gemstoneEligibility?.reason || "Gemstones are gated until full planetary audit is complete."}
          </div>

          {/* Essential practices */}
          <div style={{ marginBottom: 8, fontWeight: 700, fontSize: "13px", color: "#7C3AED" }}>
            🔴 Essential Practices (Priority 1)
          </div>
          {lineage.remedyIntelligence?.topEssentialPractices?.map((rem: any) => (
            <RemedyCard
              key={rem.id}
              title={rem.title}
              purpose={rem.oneLinePurpose}
              instructions={rem.practiceInstructions}
              frequency={rem.frequency}
              duration={rem.duration}
              priority={rem.priority}
            />
          ))}

          {/* Optional practices */}
          {lineage.remedyIntelligence?.optionalPractices?.length > 0 && (
            <>
              <div style={{ marginBottom: 8, marginTop: 16, fontWeight: 700, fontSize: "13px", color: "#D97706" }}>
                🟡 Supporting Practices
              </div>
              {lineage.remedyIntelligence?.optionalPractices?.map((rem: any) => (
                <RemedyCard
                  key={rem.id}
                  title={rem.title}
                  purpose={rem.oneLinePurpose}
                  instructions={rem.practiceInstructions}
                  frequency={rem.frequency}
                  duration={rem.duration}
                  priority={rem.priority}
                />
              ))}
            </>
          )}

          {/* 30-day guide */}
          <div
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.18)",
              borderRadius: "10px",
              padding: "14px",
              marginTop: 20,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#7C3AED", marginBottom: 10 }}>
              📋 {lineage.remedyIntelligence?.thirtyDayAuditGuide?.title}
            </div>
            {lineage.remedyIntelligence?.thirtyDayAuditGuide?.questions?.map((q: string, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  fontSize: "12px",
                  color: "#4A4238",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: "#7C3AED", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ANTAHKARANA ────────────────────────────────────────────── */}
      {activeTab === "antahkarana" && lineage?.antahkarana && (
        <div>
          {/* Header card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(15,118,110,0.08))",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "12px",
              padding: "16px 18px",
              marginBottom: 16,
              fontSize: "13px",
              color: "#3D3530",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#7C3AED" }}>Vedic Computational Consciousness</strong>
            <br />
            Sri P.V.R. Narasimha Rao के अनुसार आपका अंतःकरण एक कंप्यूटर की तरह काम करता है। यहाँ आपके chart के आधार पर इसकी mapping है:
          </div>

          {/* 5 layers */}
          {lineage.antahkarana.components.map((comp) => {
            const layerColor: Record<string, string> = {
              Ahamkara_CPU: "#DC2626",
              Chitta_Memory: "#7C3AED",
              Buddhi_ALU: "#D97706",
              Manas_IO: "#0F766E",
              Prana_Power: "#059669",
            };
            const color = layerColor[comp.layer] || "#7C3AED";

            return (
              <div
                key={comp.layer}
                style={{
                  border: `1px solid ${color}33`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "10px",
                  background: `${color}07`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13px", color }}>
                      {comp.vedicConcept}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B635B" }}>
                      💻 {comp.computerAnalogy} &middot; {comp.vargaLevel}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: 1.65, marginBottom: 6 }}>
                  {comp.functionalRole}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                  {comp.planetaryCarriers.map((p, i) => (
                    <Pill key={`${comp.layer}-${i}`} text={p} color={color} />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color,
                    background: `${color}10`,
                    border: `1px solid ${color}25`,
                    borderRadius: "7px",
                    padding: "6px 10px",
                    fontStyle: "italic",
                  }}
                >
                  🕉️ {comp.sadhanaPurificationNote}
                </div>
              </div>
            );
          })}

          {/* PVR Tarpana section */}
          {lineage.pvrTarpana && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#7C3AED", marginBottom: 12 }}>
                🪔 PVR Tarpana & Ancestral Karma Release
              </div>

              <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)", borderRadius: 10, padding: "14px 16px", marginBottom: 12, fontSize: 13, lineHeight: 1.75, color: "#3D3530" }}>
                <strong style={{ color: "#7C3AED" }}>Homam vs Tarpana:</strong>
                <br />
                🔥 <strong>Homam:</strong> {lineage.pvrTarpana.tarpanaVsHomamDistinction.homamRole}
                <br />
                💧 <strong>Tarpana:</strong> {lineage.pvrTarpana.tarpanaVsHomamDistinction.tarpanaRole}
              </div>

              <div style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.18)", borderRadius: 10, padding: "14px 16px", marginBottom: 12, fontSize: 13, lineHeight: 1.75, color: "#3D3530" }}>
                🧬 <strong>Vedic Genetics Principle:</strong>
                <br />
                {lineage.pvrTarpana.internalGeneticsPrinciple}
              </div>

              <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.18)", borderRadius: 10, padding: "14px 16px", marginBottom: 12, fontSize: 13, lineHeight: 1.75, color: "#3D3530" }}>
                ✅ <strong>जीवत्पितृक (Living Father) Rule:</strong>
                <br />
                {lineage.pvrTarpana.jivatPitrukPermissibility.rationale}
              </div>

              <div style={{ background: "rgba(180,83,9,0.06)", border: "1px solid rgba(180,83,9,0.18)", borderRadius: 10, padding: "14px 16px", fontSize: 13, lineHeight: 1.75, color: "#3D3530" }}>
                📿 <strong>Mantra Potency:</strong>
                <br />
                {lineage.pvrTarpana.mantraPotencyPrinciple.swahaVsSwadha}
                <br />
                <span style={{ color: "#059669" }}>{lineage.pvrTarpana.mantraPotencyPrinciple.focusOverCount}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom disclaimer */}
      <div
        style={{
          marginTop: 28,
          padding: "12px 14px",
          background: "rgba(124,58,237,0.04)",
          border: "1px solid rgba(124,58,237,0.15)",
          borderRadius: "10px",
          fontSize: "11px",
          color: "#6B635B",
          lineHeight: 1.6,
        }}
      >
        🕉️ <strong>AstroLife Lineage Karma Engine:</strong> BPHS (L1) · Dr. Prem Kumar Sharma (L2) · Stephen Arroyo (L3) · Sri P.V.R. Narasimha Rao Antahkarana Model (L4). This report is a spiritual guidance tool, not a definitive verdict. Family history validation strengthens conclusions.
      </div>
    </main>
  );
}
