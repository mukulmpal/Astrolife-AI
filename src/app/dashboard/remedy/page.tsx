"use client";
import { useMemo } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculateRemedies } from "@/lib/astro-engine/remedy";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";

export default function RemedyPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateRemedies(chart) : null), [chart]);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <EngineStateCard title="💊 Remedy Engine" loading={loading} loadingText="Calculating remedies..." emptyText="Complete onboarding to view remedies." />
        <MobileBottomNav />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
      <style>{`
        .rem-hero { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; margin-bottom: 8px; }
        .rem-sub { font-size: 14px; color: "#b8b0d8"; margin-bottom: 24px; }
        .rem-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
        .rem-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 18px; border-left: 4px solid #c8a030; }
        .rem-card.urgent { border-left-color: #ef4444; }
        .rem-head { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
        .rem-item { font-size: 12px; color: #b8b0d8; margin-bottom: 8px; line-height: 1.6; }
      `}</style>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="rem-hero">💊 Remedy Engine</div>
        <div className="rem-sub">Vedic Planetary Remedies — Gems · Mantras · Donations · Daily Practices</div>
        
        <div style={{ marginBottom: "20px", padding: "14px", background: "rgba(200, 160, 48, 0.1)", borderRadius: "8px", border: "1px solid rgba(200, 160, 48, 0.2)" }}>
          <div style={{ fontSize: "14px" }}>
            <strong>{result.urgentCount} planet{result.urgentCount !== 1 ? 's' : ''} need immediate upay</strong> | {result.cards.length} total planets analyzed
          </div>
        </div>
        
        <div className="rem-grid">
          {result.cards.map((card) => (
            <div key={card.planet} className={`rem-card ${card.isWeak ? "urgent" : ""}`}>
              <div className="rem-head" style={{ color: card.isWeak ? "#ef4444" : "#c8a030" }}>
                {card.isWeak ? "⚠️ " : "✓ "}{card.planet} — H{card.house}
              </div>
              <div className="rem-item"><strong>Sign:</strong> {card.sign} | <strong>Nak:</strong> {card.nakshatra}</div>
              <div className="rem-item"><strong>Status:</strong> {card.status}</div>
              <div className="rem-item" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1c1840" }}>
                <div><strong style={{ color: "#22c55e" }}>💎 Gem:</strong> {card.gem}</div>
                <div><strong style={{ color: "#60a5fa" }}>🪄 Mantra:</strong> {card.mantra}</div>
                <div><strong style={{ color: "#f97316" }}>💝 Donate:</strong> {card.donate}</div>
                <div><strong style={{ color: "#a855f7" }}>📿 Practice:</strong> {card.practice}</div>
                <div><strong style={{ color: card.color }}>🎨 Color:</strong> {card.color}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: "30px", padding: "16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", fontSize: "12px", color: "#b8b0d8" }}>
          💡 Remedies are spiritual guidance tools. Results vary per individual karma and sincere practice. Consult experienced astrologers for personalized guidance.
        </div>
      </div>
      
      <MobileBottomNav />
    </main>
  );
}
