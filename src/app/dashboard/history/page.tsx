"use client";
import { useEffect, useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EducationTooltip } from "@/components/education-tooltip";

interface SavedChart {
  id: string;
  name: string;
  dob: string;
  tob: string;
  city: string;
  created_at: string;
}

export default function HistoryPage() {
  const { chart } = useUserChart();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharts() {
      try {
        const res = await fetch("/api/charts/list");
        const data = await res.json();
        setCharts(data.charts || []);
      } catch (error) {
        console.error("Load charts error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCharts();
  }, []);

  const handleSaveChart = async () => {
    if (!chart) return;
    try {
      const res = await fetch("/api/charts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: chart.name,
          dob: chart.dob,
          tob: chart.tob,
          city: chart.city,
          lat: chart.lat,
          lon: chart.lon,
          tz: chart.tz,
          chartData: chart,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCharts([data.chart, ...charts]);
        alert("Chart saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving chart");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
      <style>{`
        .hist-hero { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; margin-bottom: 8px; }
        .hist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-top: 24px; }
        .hist-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; }
        .hist-card:hover { border-color: #c8a030; background: rgba(200, 160, 48, 0.05); }
        .hist-name { font-weight: 700; font-size: 16px; color: #c8a030; margin-bottom: 8px; }
        .hist-meta { font-size: 12px; color: #b8b0d8; }
        .hist-btn { background: #c8a030; color: #060410; border: none; border-radius: 6px; padding: 10px 16px; font-weight: 700; cursor: pointer; }
        .hist-info { background: rgba(10, 7, 32, 0.8); border: 1px solid #1c1840; border-radius: 12px; padding: 20px; margin-top: 24px; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="hist-hero">📊 Chart History</div>
        <div style={{ fontSize: "14px", color: "#b8b0d8", marginBottom: "16px" }}>
          Save and manage your astrology charts. Learn <EducationTooltip term="house_1">about Lagna</EducationTooltip> and your birth chart structure.
        </div>

        {chart && (
          <div style={{ marginBottom: "24px" }}>
            <button className="hist-btn" onClick={handleSaveChart}>
              💾 Save Current Chart: {chart.name}
            </button>
          </div>
        )}

        <div className="hist-info">
          <h3 style={{ color: "#a855f7", marginTop: 0 }}>📚 Understanding Your Chart</h3>
          <p style={{ fontSize: "12px", lineHeight: "1.8", color: "#b8b0d8", margin: 0 }}>
            Your birth chart is a snapshot of planetary positions at your exact birth moment. It contains 9 planets across 12 houses and 27 nakshatras. Each engine analyzes different aspects:
          </p>
          <ul style={{ fontSize: "12px", color: "#b8b0d8", margin: "12px 0 0 20px" }}>
            <li><strong>Kundali:</strong> Core planetary positions and house placements</li>
            <li><strong>Yogas:</strong> Auspicious planetary combinations (e.g., <EducationTooltip term="yoga">Gaja Kesari</EducationTooltip>)</li>
            <li><strong>Dasha:</strong> Your current life period and timing (<EducationTooltip term="dasha">what&apos;s a Dasha?</EducationTooltip>)</li>
            <li><strong>Medical:</strong> Health patterns from your <EducationTooltip term="nakshatra">birth nakshatra</EducationTooltip></li>
            <li><strong>Remedy:</strong> Personalized planetary remedies based on weaknesses</li>
          </ul>
        </div>

        <h3 style={{ marginTop: "32px", marginBottom: "16px", color: "#f0e8d0" }}>Saved Charts ({charts.length})</h3>

        {loading ? (
          <div style={{ textAlign: "center", color: "#b8b0d8", padding: "40px" }}>Loading charts...</div>
        ) : charts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#b8b0d8", padding: "40px", background: "rgba(200, 160, 48, 0.05)", borderRadius: "8px" }}>
            No saved charts yet. Click &ldquo;Save Current Chart&rdquo; to get started.
          </div>
        ) : (
          <div className="hist-grid">
            {charts.map((c) => (
              <div key={c.id} className="hist-card">
                <div className="hist-name">{c.name}</div>
                <div className="hist-meta">
                  📅 {c.dob} at {c.tob}
                  <br />
                  📍 {c.city}
                  <br />
                  🕐 {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="hist-info" style={{ marginTop: "32px" }}>
          <h3 style={{ color: "#2dd4bf", marginTop: 0 }}>💡 Pro Tips</h3>
          <ul style={{ fontSize: "12px", color: "#b8b0d8", margin: 0 }}>
            <li>Save multiple family members&apos; charts to compare <EducationTooltip term="guna_milan">Guna Milan (compatibility)</EducationTooltip></li>
            <li>Compare your chart across different <EducationTooltip term="dasha">Dasha periods</EducationTooltip> to predict life events</li>
            <li>Use <EducationTooltip term="kp_system">KP Prashna System</EducationTooltip> for yes/no questions about timing</li>
            <li>Your <EducationTooltip term="nakshatra">Nakshatra</EducationTooltip> (birth moon position) reveals hidden personality traits</li>
          </ul>
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
