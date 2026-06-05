"use client";
import { useEffect, useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { downloadReportAsPDF, type ReportOptions, type ReportPalette, type ReportCover } from "@/lib/report-html-generator";
import { generateShareMessage, shareToWhatsApp, shareToTwitter, shareToFacebook, copyToClipboard } from "@/lib/social-sharing";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { AstroLoadingScreen } from "@/components/AstroLoadingScreen";
import { createClient } from "@/lib/supabase/client";
import { isBillingEnforced, isFullAccessEnabled, normalizeTier, type SubscriptionTier } from "@/lib/access";

const PALETTE_OPTIONS: { value: ReportPalette; label: string; bg: string; gold: string }[] = [
  { value: "midnight", label: "Midnight",  bg: "#0A0E1F", gold: "#C9A961" },
  { value: "saffron",  label: "Saffron",   bg: "#1A0F0A", gold: "#E8923C" },
  { value: "ivory",    label: "Ivory",     bg: "#F2ECDF", gold: "#8C7440" },
  { value: "forest",   label: "Forest",    bg: "#0A1812", gold: "#C9A961" },
  { value: "maroon",   label: "Maroon",    bg: "#1A080C", gold: "#D4A656" },
];

const COVER_OPTIONS: { value: ReportCover; label: string; desc: string }[] = [
  { value: "wheel",     label: "Zodiac Wheel",       desc: "Classic 12-house wheel on cover" },
  { value: "lagnalord", label: "Lagna Lord Mandala", desc: "Chart-ruler mandala with Sanskrit labels" },
];

// Engines per report type
const ENGINE_MAP: Record<ReportOptions["type"], { group: string; color: string; engines: string[] }[]> = {
  basic: [
    { group: "Free Foundation", color: "#C9A961", engines: ["Birth Snapshot", "Star Map", "Planetary Dashboard", "Nakshatra"] },
    { group: "Starter Intelligence", color: "#34d399", engines: ["Basic Yogas", "Chart Summary", "Engine Ledger"] },
  ],
  premium: [
    { group: "Foundation", color: "#C9A961", engines: ["Birth Snapshot", "Star Map", "Planetary Dashboard", "Nakshatra"] },
    { group: "Per-Planet (9)", color: "#a78bfa", engines: ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"] },
    { group: "Per-House (12)", color: "#60a5fa", engines: ["Bhava 1–4","Bhava 5–8","Bhava 9–12"] },
    { group: "Strength & Charts", color: "#34d399", engines: ["Shadbala","Ashtakavarga","Divisional Charts","Yogas","Doshas"] },
    { group: "Timing", color: "#f97316", engines: ["Current Dasha","Upcoming Dashas","Antardasha","Destiny Timeline","Transit Ripple","Transit Radar"] },
    { group: "Systems", color: "#f472b6", engines: ["Jaimini","KP System","Lal Kitab","Special Lagnas"] },
    { group: "Life Areas", color: "#facc15", engines: ["Career","Wealth","Relationship","Family","Travel","Spirituality","Education"] },
    { group: "Synthesis", color: "#fb923c", engines: ["Vastu","Astro Sound","Gemstone","Remedies","Closing Reading"] },
  ],
  elite: [
    { group: "Everything in Premium", color: "#C9A961", engines: ["Full Kundli Intelligence", "All Timing Engines", "All Remedy Engines"] },
    { group: "Elite Intelligence", color: "#c084fc", engines: ["Palmistry Fusion", "Family Karma", "Relationship Intel", "Marriage Intelligence"] },
    { group: "Luxury Export", color: "#60a5fa", engines: ["Advanced PDF Layout", "Unlimited History", "Personal Synthesis", "Priority Report Quality"] },
  ],
  full: [
    { group: "Foundation", color: "#C9A961", engines: ["Birth Snapshot", "Star Map", "Planetary Dashboard", "Nakshatra"] },
    { group: "Per-Planet (9)", color: "#a78bfa", engines: ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"] },
    { group: "Per-House (12)", color: "#60a5fa", engines: ["Bhava 1–4","Bhava 5–8","Bhava 9–12"] },
    { group: "Strength & Charts", color: "#34d399", engines: ["Shadbala","Ashtakavarga","Divisional Charts","Yogas","Doshas"] },
    { group: "Timing", color: "#f97316", engines: ["Current Dasha","Upcoming Dashas","Antardasha","Destiny Timeline","Transit Ripple","Transit Radar"] },
    { group: "Systems", color: "#f472b6", engines: ["Jaimini","KP System","Lal Kitab","Special Lagnas"] },
    { group: "Life Areas (8)", color: "#facc15", engines: ["Career","Wealth","Health","Relationship","Family","Travel","Spirituality","Education"] },
    { group: "Intelligence", color: "#c084fc", engines: ["Marriage Intelligence","Relationship Intel","Psychology","Astro Sound","Gemstone"] },
    { group: "Environment", color: "#4ade80", engines: ["Vastu Zones","Sarvatobhadra","Numerology"] },
    { group: "Synthesis", color: "#fb923c", engines: ["Remedies","Closing Reading","Engine Ledger"] },
  ],
  kundli: [
    { group: "Foundation", color: "#C9A961", engines: ["Birth Snapshot","Star Map","Planetary Dashboard","Nakshatra"] },
    { group: "Per-Planet (9)", color: "#a78bfa", engines: ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"] },
    { group: "Per-House (12)", color: "#60a5fa", engines: ["All 12 Bhavas"] },
    { group: "Charts", color: "#34d399", engines: ["Shadbala","Ashtakavarga","Divisional Charts","Yogas","Doshas"] },
    { group: "Systems", color: "#f472b6", engines: ["Jaimini","KP System","Lal Kitab","Special Lagnas"] },
    { group: "Timing", color: "#f97316", engines: ["Current Dasha","Upcoming Dashas","Antardasha"] },
    { group: "Synthesis", color: "#fb923c", engines: ["Remedies","Closing Reading","Engine Ledger"] },
  ],
  remedy: [
    { group: "Foundation", color: "#C9A961", engines: ["Birth Snapshot","Nakshatra","Planetary Dashboard"] },
    { group: "Timing", color: "#f97316", engines: ["Current Dasha","Upcoming Dashas","Antardasha","Destiny Timeline"] },
    { group: "Remedies", color: "#4ade80", engines: ["Remedy Engine","Lal Kitab","Gemstone","Astro Sound"] },
    { group: "Synthesis", color: "#fb923c", engines: ["Closing Reading","Engine Ledger"] },
  ],
  medical: [
    { group: "Foundation", color: "#C9A961", engines: ["Birth Snapshot","Nakshatra","Planetary Dashboard"] },
    { group: "Health", color: "#f472b6", engines: ["Medical Astrology","Psychology","Vastu Zones"] },
    { group: "Timing", color: "#f97316", engines: ["Current Dasha","Upcoming Dashas"] },
    { group: "Remedies", color: "#4ade80", engines: ["Remedy Engine","Gemstone","Astro Sound"] },
    { group: "Synthesis", color: "#fb923c", engines: ["Closing Reading","Engine Ledger"] },
  ],
  destiny: [
    { group: "Foundation", color: "#C9A961", engines: ["Birth Snapshot","Star Map","Nakshatra","Planetary Dashboard"] },
    { group: "Timing", color: "#f97316", engines: ["Current Dasha","Upcoming Dashas","Antardasha","Destiny Timeline","Transit Ripple","Transit Radar"] },
    { group: "Charts", color: "#34d399", engines: ["Divisional Charts","Yogas","Shadbala"] },
    { group: "Life Areas (8)", color: "#facc15", engines: ["Career","Wealth","Relationship","Health","Family","Travel","Spirituality","Education"] },
    { group: "Synthesis", color: "#fb923c", engines: ["Remedies","Closing Reading","Engine Ledger"] },
  ],
};

const PAGE_COUNT: Record<ReportOptions["type"], string> = {
  basic:   "12+ pages",
  premium: "65+ pages",
  elite:   "90+ pages",
  full:    "65+ pages",
  kundli:  "45+ pages",
  remedy:  "28+ pages",
  medical: "22+ pages",
  destiny: "38+ pages",
};

const ENGINE_COUNT: Record<ReportOptions["type"], number> = {
  basic:   5,
  premium: 28,
  elite:   35,
  full:    28,
  kundli:  18,
  remedy:  10,
  medical: 9,
  destiny: 15,
};

// Astrology loading messages — cycles while PDF generates
const LOADING_STEPS = [
  "Casting your natal chart...",
  "Running Shadbala strength analysis...",
  "Calculating Vimshottari Dasha timeline...",
  "Analysing 16 divisional charts...",
  "Reading Jaimini karakas & Chara Dasha...",
  "Running KP sub-lord timing...",
  "Checking Yogas & Doshas...",
  "Calculating Ashtakavarga bindus...",
  "Reading Lal Kitab conditions...",
  "Mapping 16 Astro-Vastu zones...",
  "Analysing Sarvatobhadra chakra...",
  "Computing Special Lagnas...",
  "Building Marriage Intelligence layer...",
  "Running Relationship Intelligence...",
  "Calculating Destiny Timeline curve...",
  "Scanning Transit Ripple activations...",
  "Running 7-day Event Radar...",
  "Generating Astro Sound protocol...",
  "Checking Gemstone suitability...",
  "Composing per-planet deep dives...",
  "Writing per-house Bhava readings...",
  "Rendering Life Area pages...",
  "Running Psychology & Shadow Pattern...",
  "Assembling Remedy Engine output...",
  "Typesetting cover & chart wheel...",
  "Generating PDF via Puppeteer...",
  "Almost ready — packaging download...",
];

const REPORT_PLANS: Array<{
  type: "basic" | "premium" | "elite";
  tier: SubscriptionTier;
  label: string;
  desc: string;
}> = [
  { type: "basic", tier: "free", label: "Free Basic PDF", desc: "Starter Kundli snapshot with basic chart intelligence." },
  { type: "premium", tier: "premium", label: "Premium Full PDF", desc: "Complete astrology intelligence report for serious users." },
  { type: "elite", tier: "elite", label: "Elite Intelligence PDF", desc: "Luxury dossier with fusion, family and advanced synthesis positioning." },
];

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, premium: 1, elite: 2 };


export default function ReportPage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const fullAccess = isFullAccessEnabled();
  const enforced = isBillingEnforced();
  const [supabase] = useState(() => createClient());
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => fullAccess ? "elite" : "free");
  const [reportType, setReportType]   = useState<ReportOptions["type"]>("basic");
  const [palette, setPalette]         = useState<ReportPalette>("midnight");
  const [cover, setCover]             = useState<ReportCover>("wheel");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied]           = useState(false);
  const [latestPalmSessionId, setLatestPalmSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (fullAccess) return;

    const loadTier = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", data.user.id)
        .maybeSingle();

      setSubscriptionTier(normalizeTier(profile?.subscription_tier));
    };

    loadTier();
  }, [fullAccess, supabase]);

  useEffect(() => {
    const loadLatestPalmSession = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        setLatestPalmSessionId(null);
        return;
      }

      const response = await fetch(`/api/palmistry/history?userId=${encodeURIComponent(userId)}&limit=1`);
      const json = await response.json().catch(() => null) as { ok?: boolean; sessions?: Array<{ id?: string }> } | null;
      setLatestPalmSessionId(json?.ok && json.sessions?.[0]?.id ? json.sessions[0].id : null);
    };

    loadLatestPalmSession().catch(() => setLatestPalmSessionId(null));
  }, [supabase]);

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

  if (!hasUserChart) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", paddingTop: "60px" }}>
          <div style={{ fontSize: 56, opacity: 0.3, marginBottom: 16 }}>📄</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Cormorant Garamond,serif", marginBottom: 10 }}>Your chart is needed</div>
          <p style={{ color: "#a79fbd", fontSize: 14, marginBottom: 24 }}>Generate your kundli first to build a full integrated report.</p>
          <a href="/dashboard" style={{ background: "#c8a030", color: "#060410", padding: "12px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none" }}>Generate My Kundli</a>
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const handleDownloadPDF = async () => {
    const plan = REPORT_PLANS.find((item) => item.type === reportType);
    const locked = Boolean(plan && enforced && TIER_RANK[subscriptionTier] < TIER_RANK[plan.tier]);
    if (locked) {
      alert(`${plan?.label ?? "This report"} requires ${plan?.tier.toUpperCase()} access.`);
      return;
    }

    setIsGenerating(true);
    try {
      await downloadReportAsPDF(chart, {
        type: reportType,
        palette,
        cover,
        palmistrySessionId: reportType === "elite" ? latestPalmSessionId ?? undefined : undefined,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = (platform: "whatsapp" | "twitter" | "facebook" | "email" | "copy") => {
    const message = generateShareMessage(chart, reportType);
    if (platform === "whatsapp") shareToWhatsApp(message);
    else if (platform === "twitter") shareToTwitter(message);
    else if (platform === "facebook") shareToFacebook(message);
    else if (platform === "email") window.location.assign(`mailto:?subject=${encodeURIComponent(message.title)}&body=${encodeURIComponent(`${message.text}\n\n${message.url}`)}`);
    else { copyToClipboard(message); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const engines = ENGINE_MAP[reportType];
  const totalEngines = ENGINE_COUNT[reportType];
  const pageCount = PAGE_COUNT[reportType];
  const selectedPlan = REPORT_PLANS.find((item) => item.type === reportType) ?? REPORT_PLANS[0];
  const selectedLocked = enforced && TIER_RANK[subscriptionTier] < TIER_RANK[selectedPlan.tier];

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0", position: "relative" }}>
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
        @keyframes slide-up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ripple { 0% { transform:scale(1);opacity:0.6; } 100% { transform:scale(2.2);opacity:0; } }
        .rep-hero { font-family:"Cormorant Garamond",serif; font-size:38px; font-weight:700; margin-bottom:6px; }
        .rep-section { background:#0d0a22; border:1px solid #1c1840; border-radius:14px; padding:22px; margin-bottom:18px; }
        .rep-title { font-size:13px; font-weight:800; color:#c8a030; margin-bottom:14px; text-transform:uppercase; letter-spacing:0.12em; }
        .rep-tabs { display:flex; gap:8px; flex-wrap:wrap; }
        .rep-tab { padding:10px 18px; border:1px solid #1c1840; border-radius:8px; background:#0a0720; color:#b8b0d8; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.18s; }
        .rep-tab.active { border-color:#c8a030; background:rgba(200,160,48,0.14); color:#c8a030; }
        .rep-tab:hover:not(.active) { border-color:rgba(200,160,48,0.4); }
        .rep-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:700; }
        .rep-btn { padding:13px 20px; border:1px solid #1c1840; border-radius:10px; background:#08051a; color:#f0e8d0; cursor:pointer; transition:all 0.2s; font-weight:600; font-size:14px; }
        .rep-btn:hover { border-color:#c8a030; background:rgba(200,160,48,0.05); }
        .rep-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .rep-btn.primary { background:linear-gradient(135deg,#c8a030,#a07828); color:#060410; border-color:#c8a030; font-size:15px; font-weight:800; padding:16px 32px; }
        .rep-btn.primary:hover:not(:disabled) { background:linear-gradient(135deg,#d4b040,#b08838); transform:translateY(-1px); box-shadow:0 6px 24px rgba(200,160,48,0.3); }
        .rep-engine-group { margin-bottom:14px; }
        .rep-engine-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:6px; }
        .rep-engine-pills { display:flex; flex-wrap:wrap; gap:5px; }
        .rep-engine-pill { font-size:10px; padding:3px 8px; border-radius:999px; font-weight:600; }
        .seg-btn { display:flex; align-items:center; gap:7px; padding:8px 14px; border:1px solid #1c1840; border-radius:8px; background:#08051a; color:#b8b0d8; cursor:pointer; font-size:13px; font-weight:500; transition:all 0.18s; }
        .seg-btn:hover { border-color:rgba(200,160,48,0.5); }
        .seg-group { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
        .seg-swatch { width:13px; height:13px; border-radius:50%; flex-shrink:0; }
        .cover-desc { font-size:11px; color:#605890; margin-top:2px; }
        .rep-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; }
        .rep-share-btn { padding:12px 10px; border:1px solid #1c1840; border-radius:8px; background:#08051a; color:#f0e8d0; cursor:pointer; font-weight:600; font-size:12px; transition:all 0.2s; text-align:center; }
        .rep-share-btn:hover { border-color:#c8a030; }
        /* gen-overlay replaced by AstroLoadingScreen component */
        @media(max-width:600px) { .rep-hero { font-size:28px; } .rep-btn.primary { width:100%; } }
      `}</style>

      {/* ── V1 Orbiting Grahas loading overlay (design handoff implementation) ── */}
      <AstroLoadingScreen
        visible={isGenerating}
        title={"Generating your\nCosmic Blueprint"}
        subtitle={`${ENGINE_COUNT[reportType]} engines · ${PAGE_COUNT[reportType]} · premium edition`}
        statusMessages={LOADING_STEPS}
        statusIntervalMs={2200}
      />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ marginBottom: "28px" }}>
          <div className="rep-hero">📄 Cosmic Blueprint Report</div>
          <div style={{ fontSize: "14px", color: "#b8b0d8", marginBottom: "14px" }}>
            {chart.name && <span style={{ color: "#c8a030", fontWeight: 700 }}>{chart.name} · </span>}
            {chart.lagnaRashi} Lagna · {chart.planets.Moon?.sign} Moon · {chart.planets.Moon?.nakshatra} Nakshatra
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span className="rep-badge" style={{ background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.3)", color: "#c8a030" }}>
              ✦ {ENGINE_COUNT[reportType]} engines
            </span>
            <span className="rep-badge" style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa" }}>
              📄 {PAGE_COUNT[reportType]}
            </span>
            <span className="rep-badge" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }}>
              ⚡ Server rendered
            </span>
          </div>
        </div>

        {/* Report Type */}
        <div className="rep-section">
          <div className="rep-title">Report Tier</div>
          <div className="rep-tabs">
            {REPORT_PLANS.map((plan) => {
              const locked = enforced && TIER_RANK[subscriptionTier] < TIER_RANK[plan.tier];
              return (
              <button key={plan.type} className={`rep-tab ${reportType === plan.type ? "active" : ""}`} onClick={() => setReportType(plan.type)}>
                {locked ? "🔒 " : ""}{plan.label}
                <span style={{ marginLeft: "6px", fontSize: "10px", opacity: 0.7 }}>({PAGE_COUNT[plan.type]})</span>
                <div style={{ marginTop: 5, fontSize: 11, color: reportType === plan.type ? "#d8c47a" : "#605890", maxWidth: 190, lineHeight: 1.4 }}>
                  {plan.desc}
                </div>
              </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: selectedLocked ? "#fca5a5" : "#86efac" }}>
            Current access: {subscriptionTier.toUpperCase()} · {selectedLocked ? `${selectedPlan.label} is locked` : `${selectedPlan.label} is available`}
          </div>
        </div>

        {/* Engine List */}
        <div className="rep-section">
          <div className="rep-title">
            Engines Included
            <span style={{ marginLeft: "8px", fontSize: "11px", color: "#605890", textTransform: "none", letterSpacing: 0 }}>
              {totalEngines} active engines · {pageCount}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {engines.map((group) => (
              <div key={group.group} className="rep-engine-group">
                <div className="rep-engine-label" style={{ color: group.color }}>{group.group}</div>
                <div className="rep-engine-pills">
                  {group.engines.map((e) => (
                    <span key={e} className="rep-engine-pill" style={{ background: `${group.color}14`, border: `1px solid ${group.color}33`, color: group.color }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Palette & Cover — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
          <div className="rep-section" style={{ marginBottom: 0 }}>
            <div className="rep-title">🎨 Palette</div>
            <div className="seg-group" style={{ marginTop: 0 }}>
              {PALETTE_OPTIONS.map((opt) => {
                const isActive = palette === opt.value;
                return (
                  <button key={opt.value} className="seg-btn" onClick={() => setPalette(opt.value)}
                    style={{ borderColor: isActive ? opt.gold : undefined, background: isActive ? `color-mix(in srgb,${opt.gold} 18%,transparent)` : undefined, color: isActive ? opt.gold : undefined }}>
                    <span className="seg-swatch" style={{ background: opt.bg, border: `1.5px solid ${isActive ? opt.gold : opt.gold + "80"}` }} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rep-section" style={{ marginBottom: 0 }}>
            <div className="rep-title">🖼️ Cover</div>
            <div className="seg-group" style={{ marginTop: 0, flexDirection: "column" }}>
              {COVER_OPTIONS.map((opt) => {
                const isActive = cover === opt.value;
                return (
                  <button key={opt.value} className="seg-btn" onClick={() => setCover(opt.value)}
                    style={{ borderColor: isActive ? "#c8a030" : undefined, background: isActive ? "rgba(200,160,48,0.15)" : undefined, color: isActive ? "#c8a030" : undefined, flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                    <span style={{ fontWeight: 600 }}>{opt.label}</span>
                    <span className="cover-desc">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="rep-section" style={{ textAlign: "center", padding: "32px 24px" }}>
          <div style={{ fontSize: "13px", color: "#605890", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
            Ready to generate
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", color: "#f0e8d0", marginBottom: "6px" }}>
            {chart.name || "Your"} · {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </div>
          <div style={{ fontSize: "12px", color: "#605890", marginBottom: "24px" }}>
            {totalEngines} engines · {pageCount} · {palette} palette · {COVER_OPTIONS.find(c => c.value === cover)?.label}
          </div>
          {reportType === "elite" && (
            <div style={{ fontSize: "12px", color: latestPalmSessionId ? "#86efac" : "#facc15", marginBottom: "16px" }}>
              {latestPalmSessionId
                ? "Latest saved palm scan will be fused inside the Elite PDF."
                : "No saved palm scan found. Elite PDF will show a palm-fusion missing-context page."}
            </div>
          )}
          <button className="rep-btn primary" onClick={handleDownloadPDF} disabled={isGenerating}>
            {isGenerating ? "⏳ Generating…" : selectedLocked ? `🔒 Upgrade for ${selectedPlan.label}` : `📥 Download ${selectedPlan.label}`}
          </button>
          <div style={{ fontSize: "11px", color: "#453f70", marginTop: "10px" }}>
            Server-rendered via Puppeteer · downloads automatically · all {totalEngines} engines run fresh for your chart
          </div>
        </div>

        {/* Share */}
        <div className="rep-section">
          <div className="rep-title">📢 Share</div>
          <div className="rep-grid">
            {[
              { id: "whatsapp", icon: "💬", label: "WhatsApp" },
              { id: "twitter",  icon: "𝕏",  label: "Twitter" },
              { id: "facebook", icon: "f",  label: "Facebook" },
              { id: "email",    icon: "✉️", label: "Email" },
              { id: "copy",     icon: "📋", label: copied ? "Copied!" : "Copy" },
            ].map((s) => (
              <button key={s.id} className="rep-share-btn"
                onClick={() => handleShare(s.id as Parameters<typeof handleShare>[0])}
                style={{ background: s.id === "copy" && copied ? "#22c55e22" : undefined, borderColor: s.id === "copy" && copied ? "#22c55e" : undefined }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
                {s.label}
              </button>
            ))}
          </div>
        </div>

      </div>
      <MobileBottomNav />
    </main>
  );
}
