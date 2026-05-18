"use client";
import { useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { downloadReportAsPDF, type ReportOptions, type ReportPalette, type ReportCover } from "@/lib/report-html-generator";
import { generateVoiceScript, speakVoiceReport, stopVoiceReport } from "@/lib/voice-report";
import { generateShareMessage, shareToWhatsApp, shareToTwitter, shareToFacebook, copyToClipboard } from "@/lib/social-sharing";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Palette definitions for the toggle UI
const PALETTE_OPTIONS: { value: ReportPalette; label: string; bg: string; gold: string }[] = [
  { value: "midnight", label: "Midnight",  bg: "#0A0E1F", gold: "#C9A961" },
  { value: "saffron",  label: "Saffron",   bg: "#1A0F0A", gold: "#E8923C" },
  { value: "ivory",    label: "Ivory",     bg: "#F2ECDF", gold: "#8C7440" },
  { value: "forest",   label: "Forest",    bg: "#0A1812", gold: "#C9A961" },
  { value: "maroon",   label: "Maroon",    bg: "#1A080C", gold: "#D4A656" },
];

const COVER_OPTIONS: { value: ReportCover; label: string; desc: string }[] = [
  { value: "wheel",      label: "Zodiac Wheel",       desc: "Classic 12-house wheel centred on cover" },
  { value: "lagnalord",  label: "Lagna Lord Mandala", desc: "Chart-ruler deity mandala with Sanskrit labels" },
];

export default function ReportPage() {
  const { chart, loading } = useUserChart();
  const [reportType, setReportType]   = useState<ReportOptions["type"]>("full");
  const [palette, setPalette]         = useState<ReportPalette>("midnight");
  const [cover, setCover]             = useState<ReportCover>("wheel");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [copied, setCopied]           = useState(false);

  if (loading || !chart) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", paddingTop: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>Loading your chart...</div>
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await downloadReportAsPDF(chart, { type: reportType, palette, cover });
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceReport = async () => {
    if (isSpeaking) {
      stopVoiceReport();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const script = generateVoiceScript(chart, { type: reportType });
      await speakVoiceReport(script, { type: reportType });
      setIsSpeaking(false);
    } catch (error) {
      console.error("Voice error:", error);
      alert("Voice synthesis not supported");
      setIsSpeaking(false);
    }
  };

  const handleShare = (platform: "whatsapp" | "twitter" | "facebook" | "email" | "copy") => {
    const message = generateShareMessage(chart, reportType);
    
    switch (platform) {
      case "whatsapp":
        shareToWhatsApp(message);
        break;
      case "twitter":
        shareToTwitter(message);
        break;
      case "facebook":
        shareToFacebook(message);
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(message.title)}&body=${encodeURIComponent(`${message.text}\n\n${message.url}`)}`;
        break;
      case "copy":
        copyToClipboard(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
      <style>{`
        .rep-hero { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; margin-bottom: 8px; }
        .rep-tabs { display: flex; gap: 8px; margin: 24px 0; flex-wrap: wrap; }
        .rep-tab { padding: 10px 16px; border: 1px solid #1c1840; border-radius: 8px; background: #0d0a22; color: #b8b0d8; cursor: pointer; transition: all 0.2s; }
        .rep-tab.active { border-color: #c8a030; background: rgba(200, 160, 48, 0.15); color: #c8a030; }
        .rep-section { background: #0d0a22; border: 1px solid #1c1840; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
        .rep-title { font-size: 16px; font-weight: 700; color: #c8a030; margin-bottom: 16px; }
        .rep-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
        .rep-btn { padding: 12px 16px; border: 1px solid #1c1840; border-radius: 8px; background: #08051a; color: #f0e8d0; cursor: pointer; transition: all 0.2s; font-weight: 600; }
        .rep-btn:hover { border-color: #c8a030; background: rgba(200, 160, 48, 0.05); }
        .rep-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rep-btn.primary { background: #c8a030; color: #060410; border-color: #c8a030; }
        .rep-btn.primary:hover { background: #d4b240; }
        .rep-icon { font-size: 18px; display: block; margin-bottom: 4px; }
        .seg-group { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
        .seg-btn { display: flex; align-items: center; gap: 7px; padding: 8px 14px; border: 1px solid #1c1840; border-radius: 8px; background: #08051a; color: #b8b0d8; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.18s; }
        .seg-btn:hover { border-color: rgba(200,160,48,0.5); }
        .seg-swatch { width: 13px; height: 13px; border-radius: 50%; flex-shrink: 0; }
        .cover-desc { font-size: 11px; color: #605890; margin-top: 2px; }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="rep-hero">📄 Reports & Sharing</div>
        <div style={{ fontSize: "14px", color: "#b8b0d8", marginBottom: "24px" }}>
          Generate PDF reports, listen to voice analysis, and share your insights
        </div>

        {/* Report Type Selection */}
        <div className="rep-section">
          <div className="rep-title">Report Type</div>
          <div className="rep-tabs">
            {["full", "kundli", "remedy", "medical", "destiny"].map((type) => (
              <button
                key={type}
                className={`rep-tab ${reportType === type ? "active" : ""}`}
                onClick={() => setReportType(type as ReportOptions["type"])}
              >
                {type === "full"
                  ? "📊 Full"
                  : type === "kundli"
                  ? "🔯 Kundli"
                  : type === "remedy"
                  ? "💊 Remedy"
                  : type === "destiny"
                  ? "📈 Destiny"
                  : "🏥 Medical"}
              </button>
            ))}
          </div>
        </div>

        {/* Palette Toggle */}
        <div className="rep-section">
          <div className="rep-title">🎨 Colour Palette</div>
          <div style={{ fontSize: "13px", color: "#b8b0d8" }}>
            Choose the visual theme for your PDF report
          </div>
          <div className="seg-group">
            {PALETTE_OPTIONS.map((opt) => {
              const isActive = palette === opt.value;
              const goldRgb = opt.gold;
              return (
                <button
                  key={opt.value}
                  className="seg-btn"
                  onClick={() => setPalette(opt.value)}
                  style={{
                    borderColor: isActive ? opt.gold : undefined,
                    background: isActive ? `color-mix(in srgb, ${opt.gold} 18%, transparent)` : undefined,
                    color: isActive ? opt.gold : undefined,
                  }}
                >
                  <span
                    className="seg-swatch"
                    style={{
                      background: opt.bg,
                      border: `1.5px solid ${isActive ? opt.gold : goldRgb + "80"}`,
                    }}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cover Toggle */}
        <div className="rep-section">
          <div className="rep-title">🖼️ Cover Style</div>
          <div style={{ fontSize: "13px", color: "#b8b0d8" }}>
            Select the artwork on your report&apos;s cover page
          </div>
          <div className="seg-group">
            {COVER_OPTIONS.map((opt) => {
              const isActive = cover === opt.value;
              return (
                <button
                  key={opt.value}
                  className="seg-btn"
                  onClick={() => setCover(opt.value)}
                  style={{
                    borderColor: isActive ? "#c8a030" : undefined,
                    background: isActive ? "rgba(200,160,48,0.15)" : undefined,
                    color: isActive ? "#c8a030" : undefined,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "2px",
                    minWidth: "160px",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span className="cover-desc">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Download PDF */}
        <div className="rep-section">
          <div className="rep-title">📥 Download PDF Report</div>
          <div style={{ fontSize: "13px", color: "#b8b0d8", marginBottom: "16px" }}>
            Server-rendered premium PDF — cover art, North Indian chart, dasha interpretations, remedies &amp; more. Downloads directly on any device.
          </div>
          <button className="rep-btn primary" onClick={handleDownloadPDF} disabled={isGenerating}>
            {isGenerating ? "⏳ Generating PDF…" : "📄 Download PDF"}
          </button>
          {isGenerating && (
            <div style={{ fontSize: "11px", color: "#605890", marginTop: "8px" }}>
              Rendering on server — usually 15–30 seconds. Please wait…
            </div>
          )}
        </div>

        {/* Voice Report */}
        <div className="rep-section">
          <div className="rep-title">🎵 Voice Report</div>
          <div style={{ fontSize: "13px", color: "#b8b0d8", marginBottom: "16px" }}>
            Listen to your analysis read aloud. Browser speech synthesis (works offline)
          </div>
          <button
            className={`rep-btn ${isSpeaking ? "primary" : ""}`}
            onClick={handleVoiceReport}
            style={{ background: isSpeaking ? "#ef4444" : undefined }}
          >
            {isSpeaking ? "⏹️ Stop Speaking" : "🎧 Play Voice Report"}
          </button>
          <div style={{ fontSize: "11px", color: "#605890", marginTop: "8px" }}>
            Note: Uses browser&apos;s built-in voice synthesis. Premium audio MP3 coming soon!
          </div>
        </div>

        {/* Social Sharing */}
        <div className="rep-section">
          <div className="rep-title">📢 Share Your Insights</div>
          <div style={{ fontSize: "13px", color: "#b8b0d8", marginBottom: "16px" }}>
            Share your chart analysis and invite friends to discover their cosmic blueprint
          </div>
          <div className="rep-grid">
            <button className="rep-btn" onClick={() => handleShare("whatsapp")}>
              <span className="rep-icon">💬</span>
              WhatsApp
            </button>
            <button className="rep-btn" onClick={() => handleShare("twitter")}>
              <span className="rep-icon">𝕏</span>
              Twitter
            </button>
            <button className="rep-btn" onClick={() => handleShare("facebook")}>
              <span className="rep-icon">f</span>
              Facebook
            </button>
            <button className="rep-btn" onClick={() => handleShare("email")}>
              <span className="rep-icon">✉️</span>
              Email
            </button>
            <button
              className="rep-btn"
              onClick={() => handleShare("copy")}
              style={{ background: copied ? "#22c55e" : undefined }}
            >
              <span className="rep-icon">📋</span>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Chart Summary */}
        <div className="rep-section">
          <div className="rep-title">Your Chart at a Glance</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
            <div>
              <strong style={{ color: "#c8a030" }}>Ascendant:</strong> {chart.lagnaRashi}
            </div>
            <div>
              <strong style={{ color: "#c8a030" }}>Moon:</strong> {chart.planets.Moon?.sign}
            </div>
            <div>
              <strong style={{ color: "#c8a030" }}>Sun:</strong> {chart.planets.Sun?.sign}
            </div>
            <div>
              <strong style={{ color: "#c8a030" }}>Birth Nakshatra:</strong> {chart.planets.Moon?.nakshatra}
            </div>
            <div style={{ gridColumn: "1/3" }}>
              <strong style={{ color: "#c8a030" }}>Strengths:</strong> {Object.values(chart.planets).filter(p => p.dignity?.includes("Sva")).length}/9 planets in good dignity
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "12px", padding: "16px", marginTop: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#a855f7", marginBottom: "8px" }}>
            🚀 Coming Soon
          </div>
          <ul style={{ fontSize: "12px", color: "#b8b0d8", marginLeft: "20px", lineHeight: "1.8" }}>
            <li>High-quality MP3 voice reports (ElevenLabs integration)</li>
            <li>PDF delivery via email</li>
            <li>Social media story generator</li>
            <li>Shareable chart infographics</li>
          </ul>
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
