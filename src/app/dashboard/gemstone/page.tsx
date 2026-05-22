"use client";


import { useMemo, useState, useSyncExternalStore } from "react";
import { useUserChart } from "@/lib/user-chart";
import {

  runGemstoneMedicalMasterEngineV2,
  type GemstoneMedicalInput,
  type GemstoneMedicalMasterReport,
  type GemstoneReportItem,
  type GemStatus,
  type Planet,
  type Sign,
  type Dignity,
} from "@/lib/astro-engine/gemstone-medical-master-v2";
import { EngineStateCard } from "@/components/engine-state-card";

// ─── Adapter ──────────────────────────────────────────────────────────────────

const VALID_PLANETS = new Set<string>(["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]);
const SIGNS: Sign[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
const SIGN_ALIASES: Record<string, Sign> = {
  ar: "Aries",
  mesha: "Aries",
  ta: "Taurus",
  vrishabha: "Taurus",
  ge: "Gemini",
  mithuna: "Gemini",
  ca: "Cancer",
  karka: "Cancer",
  le: "Leo",
  simha: "Leo",
  vi: "Virgo",
  kanya: "Virgo",
  li: "Libra",
  tula: "Libra",
  sc: "Scorpio",
  vrishchika: "Scorpio",
  sa: "Sagittarius",
  dhanu: "Sagittarius",
  cp: "Capricorn",
  cap: "Capricorn",
  makara: "Capricorn",
  aq: "Aquarius",
  kumbha: "Aquarius",
  pi: "Pisces",
  meena: "Pisces",
};

function mapDignity(d: string): Dignity {
  if (!d || d === "—") return "neutral";
  const l = d.toLowerCase();
  if (l.startsWith("exalted") || l === "exalted" || l === "uchcha") return "exalted";
  if (l === "debilitated" || l === "neecha") return "debilitated";
  if (l === "moolatrikona") return "moolatrikona";
  if (l === "own" || l.includes("sva") || l.includes("own sign")) return "own";
  if (l.includes("friend")) return "friendly";
  if (l.includes("enemy")) return "enemy";
  return "neutral";
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function signIndexFromNumber(value: unknown): number | undefined {
  const n = toFiniteNumber(value);
  if (n === undefined) return undefined;
  if (n >= 0 && n <= 11) return Math.trunc(n);
  if (n >= 1 && n <= 12) return Math.trunc(n - 1);
  return Math.floor(mod(n, 360) / 30);
}

function normalizeSign(value: unknown): Sign | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    const exact = SIGNS.find((sign) => sign.toLowerCase() === trimmed.toLowerCase());
    if (exact) return exact;
    return SIGN_ALIASES[trimmed.toLowerCase()];
  }

  const idx = signIndexFromNumber(value);
  return idx === undefined ? undefined : SIGNS[idx];
}

function normalizeHouse(value: unknown, fallback: number): number {
  const n = toFiniteNumber(value);
  if (n === undefined) return fallback;
  return mod(Math.trunc(n) - 1, 12) + 1;
}

function readPlanetData(container: Record<string, unknown>, planet: string): Record<string, unknown> | null {
  const raw = container[planet] ?? container[planet.toLowerCase()];
  return raw && typeof raw === "object" ? raw as Record<string, unknown> : null;
}

function chartToMedicalInput(chart: unknown): GemstoneMedicalInput | null {
  if (!chart || typeof chart !== "object") return null;
  const c = chart as Record<string, unknown>;

  const ascendant =
    normalizeSign(c.lagnaRashi) ??
    normalizeSign(c.ascendantRashi) ??
    normalizeSign(c.lagnaSign) ??
    normalizeSign(c.ascendantSign) ??
    normalizeSign(c.lagnaNum) ??
    normalizeSign(c.lagnaLon);
  if (!ascendant) return null;
  const ascendantIndex = SIGNS.indexOf(ascendant);

  const planetsObj = c.planets as Record<string, unknown> | undefined;
  if (!planetsObj) return null;

  const planets: GemstoneMedicalInput["planets"] = [];
  for (const name of VALID_PLANETS) {
    const pd = readPlanetData(planetsObj, name);
    if (!pd) continue;
    if (!VALID_PLANETS.has(name)) continue;
    const sign =
      normalizeSign(pd.sign) ??
      normalizeSign(pd.rashiName) ??
      normalizeSign(pd.signName) ??
      normalizeSign(pd.rashi) ??
      normalizeSign(pd.signNum) ??
      normalizeSign(pd.rashiIndex) ??
      normalizeSign(pd.lon) ??
      normalizeSign(pd.longitude);
    if (!sign) continue;

    const signIndex = SIGNS.indexOf(sign);
    const fallbackHouse = mod(signIndex - ascendantIndex, 12) + 1;
    planets.push({
      planet: name as Planet,
      sign,
      house: normalizeHouse(pd.house ?? pd.rashiHouse ?? pd.bhavaHouse, fallbackHouse),
      degree: toFiniteNumber(pd.degree ?? pd.deg ?? pd.lon ?? pd.longitude),
      nakshatra: typeof pd.nakshatra === "string" ? pd.nakshatra : undefined,
      dignity: mapDignity(String(pd.dignity ?? pd.status ?? "")),
      isRetrograde: Boolean(pd.retrograde ?? pd.isRetrograde),
    });
  }

  if (planets.length < 7) return null;

  const dashasArr = c.dashas as Array<Record<string, unknown>> | undefined;
  const antarArr = c.antardasha as Array<Record<string, unknown>> | undefined;

  let mahadasha: Planet | undefined;
  let antardasha: Planet | undefined;

  if (Array.isArray(dashasArr) && dashasArr.length) {
    const active = dashasArr.find((d) => d.active) ?? dashasArr[0];
    if (active?.planet) mahadasha = active.planet as Planet;
  }
  if (Array.isArray(antarArr) && antarArr.length) {
    const active = antarArr.find((d) => d.active) ?? antarArr[0];
    if (active?.planet) antardasha = active.planet as Planet;
  }

  const moonData = readPlanetData(planetsObj, "Moon");
  const moonSign = normalizeSign(moonData?.sign ?? moonData?.rashiName ?? moonData?.signNum ?? moonData?.lon);

  return {
    nativeName: c.name as string | undefined,
    ascendant,
    moonSign,
    planets,
    dasha: mahadasha ? { mahadasha, antardasha } : undefined,
  };
}

// ─── Visual helpers ───────────────────────────────────────────────────────────

const PLANET_HEX: Record<string, string> = {
  Sun: "#E85D04", Moon: "#A8B9D0", Mars: "#CC2200", Mercury: "#50C878",
  Jupiter: "#F5C542", Venus: "#E8D4F0", Saturn: "#6B5CA5",
  Rahu: "#4B0082", Ketu: "#8B6914",
};

const STATUS_HEX: Record<GemStatus, string> = {
  highly_recommended: "#22c55e",
  recommended: "#3b82f6",
  supportive: "#f59e0b",
  use_carefully: "#f97316",
  avoid: "#ef4444",
};

const STATUS_LABEL: Record<GemStatus, string> = {
  highly_recommended: "Highly Recommended",
  recommended: "Recommended",
  supportive: "Supportive",
  use_carefully: "Use Carefully",
  avoid: "Avoid",
};

function hexFor(item: GemstoneReportItem): string {
  return PLANET_HEX[item.planet] ?? "#C8A030";
}

const p = (parts: Array<string | null | undefined | false>): string =>
  parts.filter(Boolean).join("\n\n");


// ─── Star background ──────────────────────────────────────────────────────────

const STAR_POINTS = [
  { x: 8, y: 12, r: 1.2, o: 0.42 }, { x: 18, y: 28, r: 0.8, o: 0.32 },
  { x: 28, y: 8, r: 1.1, o: 0.38 }, { x: 41, y: 18, r: 0.7, o: 0.28 },
  { x: 52, y: 34, r: 1.4, o: 0.45 }, { x: 66, y: 12, r: 0.9, o: 0.34 },
  { x: 78, y: 26, r: 1.2, o: 0.4 }, { x: 88, y: 9, r: 0.8, o: 0.3 },
  { x: 11, y: 62, r: 1.1, o: 0.35 }, { x: 23, y: 76, r: 0.9, o: 0.3 },
  { x: 36, y: 58, r: 1.3, o: 0.42 }, { x: 49, y: 82, r: 0.8, o: 0.28 },
  { x: 61, y: 66, r: 1.2, o: 0.38 }, { x: 74, y: 88, r: 0.7, o: 0.3 },
  { x: 92, y: 70, r: 1.1, o: 0.36 },
];

// ─── UI components ────────────────────────────────────────────────────────────

function GemIcon({ color, size = 96 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`gem-grad-${color.replace("#", "")}`} cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.72" />
          <stop offset="42%" stopColor={color} stopOpacity="0.92" />
          <stop offset="100%" stopColor={color} stopOpacity="0.38" />
        </radialGradient>
      </defs>
      <polygon points="50,8 82,35 70,76 30,76 18,35" fill={`url(#gem-grad-${color.replace("#", "")})`} />
      <polygon points="50,8 82,35 50,26" fill="white" fillOpacity="0.16" />
      <polygon points="50,8 18,35 50,26" fill="white" fillOpacity="0.1" />
      <polygon points="30,76 70,76 50,92" fill={color} fillOpacity="0.62" />
      <polygon points="50,26 82,35 70,76 30,76 18,35" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="gem-score">
      <div><span style={{ width: `${score}%`, background: color }} /></div>
      <strong>{score}%</strong>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="gem-meta-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: GemStatus }) {
  const hex = STATUS_HEX[status];
  return (
    <span className="gem-status-badge" style={{ color: hex, background: `${hex}22`, borderColor: `${hex}55` }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function PrimaryGemHero({ gem }: { gem: GemstoneReportItem }) {
  const hex = hexFor(gem);
  return (
    <section className="gem-hero-card" style={{ borderColor: `${hex}45` }}>
      <div className="gem-glow" style={{ background: hex }} />
      <GemIcon color={hex} size={120} />
      <div className="gem-hero-info">
        <div className="gem-label-row">
          <StatusBadge status={gem.status} />
          <ScoreBar score={gem.score} color={STATUS_HEX[gem.status]} />
        </div>
        <h2>{gem.gemstone}</h2>
        <p className="gem-alt">{gem.sanskritName} · Alt: {gem.substitute}</p>
        <div className="gem-meta-grid">
          <MetaPill label="Planet" value={gem.planet} />
          <MetaPill label="Colour" value={gem.colour} />
          <MetaPill label="Confidence" value={`${gem.confidence}%`} />
          <MetaPill label="Status" value={STATUS_LABEL[gem.status]} />
        </div>
        <p className="gem-reason">{gem.shortVerdict}</p>
      </div>
    </section>
  );
}

function TextSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="gem-panel">
      <h3>{title}</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
    </div>
  );
}

function AnalysisTab({ gem }: { gem: GemstoneReportItem }) {
  return (
    <div className="gem-analysis-grid">
      <TextSection title="Why AstroLife Recommends It" body={gem.whyAstroLifeRecommendsIt} />
      <TextSection title="Scoring Explanation" body={gem.scoringExplanation} />
      <TextSection title="Book-Style Interpretation" body={gem.bookStyleInterpretation} />
      <TextSection title="Expected Benefits" body={gem.expectedBenefits} />
      <div className="gem-panel">
        <h3>Score Breakdown</h3>
        <div className="gem-table">
          {gem.scoreComponents.map((sc) => (
            <div key={sc.label}>
              <span>{sc.label}</span>
              <strong style={{ color: sc.points >= 0 ? "#22c55e" : "#ef4444" }}>
                {sc.points >= 0 ? "+" : ""}{sc.points}
              </strong>
            </div>
          ))}
        </div>
      </div>
      <TextSection title="Health & Psychology" body={gem.healthAndPsychologyConnection} />
    </div>
  );
}

function WearingTab({ gem }: { gem: GemstoneReportItem }) {
  return (
    <div className="gem-grid-two">
      <TextSection title="Wearing Guidance" body={gem.wearingGuidance} />
      <TextSection title="Caution & Avoidance" body={gem.cautionOrAvoidance} />
      <div className="gem-panel" style={{ gridColumn: "1 / -1" }}>
        <h3>Alternative Remedies</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{gem.alternativeRemedies}</p>
      </div>
    </div>
  );
}

function DashaTab({ gem }: { gem: GemstoneReportItem }) {
  return (
    <div className="gem-grid-two">
      <TextSection title="Dasha Timing Interpretation" body={gem.dashaTimingInterpretation} />
      <div className="gem-panel">
        <h3>PDF Summary</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{gem.pdfReadyParagraph}</p>
      </div>
    </div>
  );
}

function SecondaryGemCard({ gem }: { gem: GemstoneReportItem }) {
  const hex = hexFor(gem);
  return (
    <div className="gem-secondary-card" style={{ borderColor: `${hex}35` }}>
      <GemIcon color={hex} size={70} />
      <div>
        <StatusBadge status={gem.status} />
        <h3>{gem.gemstone}</h3>
        <p>{gem.planet} · {gem.colour}</p>
        <ScoreBar score={gem.score} color={STATUS_HEX[gem.status]} />
        <p className="gem-card-reason">{gem.shortVerdict}</p>
      </div>
    </div>
  );
}

function SecondaryTab({ report }: { report: GemstoneMedicalMasterReport }) {
  const all = [...report.secondaryRecommendations, ...report.supportiveRecommendations];
  if (!all.length) {
    return <div className="gem-empty">No secondary gemstones found for this chart.</div>;
  }
  return (
    <div className="gem-secondary-grid">
      {all.map((gem) => <SecondaryGemCard key={gem.planet} gem={gem} />)}
    </div>
  );
}

function AvoidTab({ report }: { report: GemstoneMedicalMasterReport }) {
  const avoid = report.avoidList;
  const careful = report.useCarefullyList;

  return (
    <div className="gem-analysis-grid">
      {careful.length > 0 && (
        <div className="gem-panel">
          <h3>Use Carefully</h3>
          <div className="gem-avoid-list">
            {careful.map((gem) => (
              <div key={gem.planet} className="gem-avoid-row">
                <div className="gem-avoid-icon" style={{ color: STATUS_HEX.use_carefully, background: `${STATUS_HEX.use_carefully}22` }}>⚠</div>
                <div>
                  <strong>{gem.gemstone}</strong>
                  <span> · {gem.planet}</span>
                  <p>{gem.cautionOrAvoidance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {avoid.length > 0 && (
        <div className="gem-panel caution">
          <h3>Avoid These</h3>
          <div className="gem-avoid-list">
            {avoid.map((gem) => (
              <div key={gem.planet} className="gem-avoid-row">
                <div className="gem-avoid-icon">⊗</div>
                <div>
                  <strong>{gem.gemstone}</strong>
                  <span> · {gem.planet}</span>
                  <p>{gem.cautionOrAvoidance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!avoid.length && !careful.length && (
        <div className="gem-empty">No specific avoid list for this chart.</div>
      )}
    </div>
  );
}

function MedicalTab({ report }: { report: GemstoneMedicalMasterReport }) {
  const m = report.medicalAwareness;
  return (
    <div className="gem-analysis-grid">
      <TextSection title="Constitutional Profile" body={m.constitutionalProfile} />
      <TextSection title="Wellness Interpretation" body={m.wellnessInterpretation} />
      {m.findings.length > 0 && (
        <div className="gem-panel" style={{ gridColumn: "1 / -1" }}>
          <h3>Planetary Health Indicators</h3>
          <div className="gem-medical-findings">
            {m.findings.map((f) => (
              <div key={`${f.planet}-${f.house}`} className={`gem-finding gem-finding-${f.severity}`}>
                <div className="gem-finding-header">
                  <strong>{f.title}</strong>
                  <span>{f.symbolicBodyArea}</span>
                </div>
                <p>{f.paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <TextSection title="Preventive Guidance" body={m.preventiveGuidance} />
      <div className="gem-panel caution">
        <h3>Medical Disclaimer</h3>
        <p>{m.medicalDisclaimer}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type TabKey = "analysis" | "wearing" | "dasha" | "secondary" | "avoid" | "medical";

export default function GemstonePage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Gemstone Suitability"
            loading
            loadingText="Preparing gemstone intelligence..."
          />
        </section>
      </main>
    );
  }

  return <GemstonePageContent />;
}

function GemstonePageContent() {
  const { chart, loading } = useUserChart();
  const [activeTab, setActiveTab] = useState<TabKey>("analysis");
  const { input, report, error: engineError } = useMemo((): {
    input: GemstoneMedicalInput | null;
    report: GemstoneMedicalMasterReport | null;
    error: string | null;
  } => {
    if (loading) return { input: null, report: null, error: null };
    try {
      const inp = chartToMedicalInput(chart);
      if (!inp) return { input: null, report: null, error: "chartToMedicalInput returned null — chart may be incomplete" };
      const rep = runGemstoneMedicalMasterEngineV2(inp);
      return { input: inp, report: rep, error: null };
    } catch (err) {
      console.error("Gemstone engine error:", err);
      return { input: null, report: null, error: String(err) };
    }
  }, [chart, loading]);

  const tabs: Array<{ id: TabKey; label: string }> = [
    { id: "analysis",  label: "◈ Analysis" },
    { id: "wearing",   label: "◎ Wearing Guide" },
    { id: "dasha",     label: "🪐 Dasha Timing" },
    { id: "secondary", label: "◇ Secondary Gems" },
    { id: "avoid",     label: "⊗ Avoid / Careful" },
    { id: "medical",   label: "✦ Medical Awareness" },
  ];

  if (loading) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Gemstone Suitability"
            loading
            loadingText="Chart loading... gemstone and rudraksha guidance will update automatically."
          />
        </section>
      </main>
    );
  }

  if (!report || !report.primaryRecommendation) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Gemstone Suitability"
            emptyText={engineError
              ? p([`Engine error: ${engineError}`])
              : "Chart data incomplete. Please complete your birth details in onboarding."}
          />
          {engineError && (
            <div style={{ marginTop: 16, padding: 16, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, fontSize: 13, color: "#ef4444", fontFamily: "monospace", wordBreak: "break-all" }}>
              {engineError}
            </div>
          )}
        </section>
      </main>
    );
  }

  const primary = report.primaryRecommendation;
  const dashaStr = input?.dasha
    ? [input.dasha.mahadasha, input.dasha.antardasha].filter(Boolean).join(" › ")
    : "Not connected";

  return (
    <main className="gem-page">
      <div className="gem-bg">
        <div className="gem-orb one" />
        <div className="gem-orb two" />
        <svg className="gem-stars" viewBox="0 0 100 100" preserveAspectRatio="none">
          {STAR_POINTS.map((star) => (
            <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="white" opacity={star.o} />
          ))}
        </svg>
      </div>

      <header className="gem-nav">
        <div className="gem-logo-wrap">
          <div className="gem-logo-glyph">✦</div>
          <span className="gem-logo-name">AstroLife</span>
        </div>
        <a className="gem-nav-btn" href="/onboarding">Get Free Kundli</a>
      </header>

      <section className="gem-header">
        <span>Gemstone Intelligence · Medical Master Engine V2</span>
        <h1>Gemstone Suitability</h1>
        <p>
          {input?.ascendant} Lagna · Moon in {input?.moonSign ?? "—"}. Comprehensive scoring across
          house ownership, dignity, Shadbala, dasha activation and yogakaraka status.
        </p>
        <p>{report.executiveSummary}</p>
      </section>

      <PrimaryGemHero gem={primary} />

      <section className="gem-foundation-grid">
        <div>
          <span>Lagna</span>
          <strong>{input?.ascendant}</strong>
          <p>All gemstone scoring is anchored to the ascendant lord and functional benefics.</p>
        </div>
        <div>
          <span>Moon Sign</span>
          <strong>{input?.moonSign ?? "—"}</strong>
          <p>Moon sign influences emotional resonance and healing colour choices.</p>
        </div>
        <div>
          <span>Current Dasha</span>
          <strong>{dashaStr}</strong>
          <p>Dasha activation adds up to +12 pts to the ruling planet&apos;s gemstone score.</p>
        </div>
      </section>

      <section className="gem-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="gem-content">
        {activeTab === "analysis"  && <AnalysisTab gem={primary} />}
        {activeTab === "wearing"   && <WearingTab gem={primary} />}
        {activeTab === "dasha"     && <DashaTab gem={primary} />}
        {activeTab === "secondary" && <SecondaryTab report={report} />}
        {activeTab === "avoid"     && <AvoidTab report={report} />}
        {activeTab === "medical"   && <MedicalTab report={report} />}
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        .gem-page {
          --bg: #060410;
          --bg-2: #0a0720;
          --card: #0d0a22;
          --border: #1c1840;
          --border-2: #261f50;
          --gold: #c8a030;
          --gold-soft: #e8c060;
          --cream: #f0e8d0;
          --cream-soft: #c8c0a8;
          --muted: #605890;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 26px 22px 96px;
          color: var(--cream);
          background: radial-gradient(circle at 20% -10%, rgba(60, 40, 128, 0.16), transparent 40%), var(--bg);
          font-family: "Outfit", sans-serif;
        }

        .gem-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gem-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(52px);
          opacity: 0.23;
        }

        .gem-orb.one {
          width: 520px;
          height: 520px;
          left: -180px;
          top: -160px;
          background: rgba(60, 40, 128, 0.22);
        }

        .gem-orb.two {
          width: 460px;
          height: 460px;
          right: -150px;
          bottom: -150px;
          background: rgba(200, 160, 48, 0.14);
        }

        .gem-stars {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.32;
        }

        .gem-header,
        .gem-hero-card,
        .gem-tabs,
        .gem-content {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin-left: auto;
          margin-right: auto;
        }

        .gem-nav {
          position: relative;
          z-index: 2;
          max-width: 1120px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0 4px;
        }

        .gem-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gem-logo-glyph {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #3c2880, var(--gold));
          color: var(--cream);
          font-size: 14px;
          box-shadow: 0 0 20px rgba(200, 160, 48, 0.22);
        }

        .gem-logo-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
          font-weight: 600;
          background: linear-gradient(135deg, var(--gold), #f0d898);
          -webkit-background-clip: text;
          color: transparent;
        }

        .gem-nav-btn {
          text-decoration: none;
          border: 1px solid rgba(200, 160, 48, 0.45);
          color: var(--gold-soft);
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13px;
          transition: all 0.2s;
        }

        .gem-nav-btn:hover {
          background: rgba(200, 160, 48, 0.12);
          border-color: var(--gold);
          color: var(--cream);
        }

        .gem-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .gem-header span {
          display: inline-flex;
          margin-bottom: 10px;
          border: 1px solid rgba(200, 160, 48, 0.28);
          background: rgba(200, 160, 48, 0.1);
          color: var(--gold-soft);
          border-radius: 999px;
          padding: 8px 15px;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          font-size: 10px;
          font-weight: 600;
        }

        .gem-header h1 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(38px, 6.4vw, 66px);
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, var(--cream), var(--gold), #f0d898);
          -webkit-background-clip: text;
          color: transparent;
        }

        .gem-header p {
          max-width: 820px;
          margin: 14px auto 0;
          color: var(--cream-soft);
          line-height: 1.78;
          font-size: 13px;
        }

        .gem-hero-card {
          position: relative;
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 26px;
          align-items: center;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, #0f0c28, #1a1040);
          backdrop-filter: blur(18px);
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.24);
        }

        .gem-glow {
          position: absolute;
          right: -70px;
          top: -80px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          filter: blur(58px);
          opacity: 0.14;
        }

        .gem-hero-card > svg {
          position: relative;
          z-index: 1;
          justify-self: center;
        }

        .gem-hero-info {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .gem-label-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 12px;
        }

        .gem-status-badge {
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          border: 1px solid transparent;
        }

        .gem-score {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .gem-score div {
          width: 110px;
          height: 7px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
        }

        .gem-score div span {
          display: block;
          height: 100%;
          border-radius: 999px;
        }

        .gem-score strong {
          color: var(--cream-soft);
          font-size: 12px;
        }

        .gem-hero-card h2 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: 34px;
          letter-spacing: -0.04em;
        }

        .gem-alt {
          color: var(--muted);
          margin: 8px 0 14px;
        }

        .gem-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }

        .gem-meta-pill {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 10px;
        }

        .gem-meta-pill span {
          display: block;
          color: var(--muted);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .gem-meta-pill strong {
          color: var(--gold-soft);
          font-size: 13px;
        }

        .gem-reason,
        .gem-panel p,
        .gem-panel li,
        .gem-card-reason,
        .gem-avoid-list p {
          color: var(--cream-soft);
          line-height: 1.65;
        }

        .gem-foundation-grid {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .gem-foundation-grid div {
          border: 1px solid rgba(255,255,255,0.09);
          background:
            radial-gradient(circle at top left, rgba(245,197,66,0.10), transparent 34%),
            rgba(255,255,255,0.055);
          border-radius: 22px;
          padding: 16px;
          backdrop-filter: blur(16px);
        }

        .gem-foundation-grid span {
          display: block;
          color: rgba(255,255,255,0.48);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 950;
          margin-bottom: 7px;
        }

        .gem-foundation-grid strong {
          display: block;
          color: #f5c542;
          font-size: 20px;
          margin-bottom: 7px;
        }

        .gem-foundation-grid p {
          margin: 0;
          color: rgba(255,255,255,0.62);
          line-height: 1.55;
          font-size: 13px;
        }

        .gem-tabs {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          margin-bottom: 16px;
          padding: 4px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--bg-2);
          overflow-x: auto;
        }

        .gem-tabs button {
          border: 1px solid transparent;
          background: transparent;
          color: var(--muted);
          border-radius: 9px;
          padding: 9px 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          font-size: 13px;
          font-family: "Outfit", sans-serif;
        }

        .gem-tabs button.active {
          color: var(--cream-soft);
          background: #1c1840;
          border-color: rgba(200, 160, 48, 0.18);
        }

        .gem-grid-two {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-panel,
        .gem-secondary-card {
          border: 1px solid var(--border);
          background: var(--card);
          border-radius: 16px;
          padding: 18px;
          backdrop-filter: blur(16px);
        }

        .gem-panel.caution {
          border-color: rgba(200, 160, 48, 0.2);
          background: rgba(200, 160, 48, 0.06);
        }

        .gem-panel h3,
        .gem-secondary-card h3 {
          margin: 0 0 12px;
          color: var(--gold-soft);
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
        }

        .gem-table {
          display: grid;
          gap: 9px;
        }

        .gem-table div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 9px;
        }

        .gem-table span {
          color: var(--muted);
        }

        .gem-table strong {
          text-align: right;
        }

        .gem-secondary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-secondary-card {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 18px;
          align-items: start;
        }

        .gem-secondary-card span {
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 10px;
          font-weight: 600;
        }

        .gem-secondary-card p {
          margin: 6px 0;
        }

        .gem-avoid-list {
          display: grid;
          gap: 14px;
          margin-top: 8px;
        }

        .gem-avoid-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .gem-avoid-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(200, 160, 48, 0.12);
          color: var(--gold-soft);
          font-size: 22px;
        }

        .gem-avoid-row span {
          color: var(--gold-soft);
          font-size: 12px;
        }

        .gem-avoid-row strong {
          color: var(--cream);
          font-size: 14px;
        }

        .gem-avoid-row p {
          margin: 6px 0 0;
          color: var(--cream-soft);
          font-size: 13px;
          line-height: 1.55;
        }

        .gem-medical-findings {
          display: grid;
          gap: 12px;
          margin-top: 8px;
        }

        .gem-finding {
          border-radius: 12px;
          padding: 14px;
          border-left: 3px solid;
        }

        .gem-finding-mild {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.06);
        }

        .gem-finding-moderate {
          border-color: #f97316;
          background: rgba(249, 115, 22, 0.06);
        }

        .gem-finding-strong {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.06);
        }

        .gem-finding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .gem-finding-header strong {
          color: var(--cream);
          font-size: 14px;
        }

        .gem-finding-header span {
          color: var(--muted);
          font-size: 12px;
        }

        .gem-finding p {
          margin: 0;
          color: var(--cream-soft);
          font-size: 13px;
          line-height: 1.6;
        }

        .gem-empty {
          border: 1px solid var(--border);
          background: var(--card);
          border-radius: 14px;
          padding: 18px;
          color: var(--cream-soft);
        }

        @media (max-width: 860px) {
          .gem-page {
            padding: 22px 16px 90px;
          }

          .gem-hero-card,
          .gem-foundation-grid,
          .gem-grid-two,
          .gem-analysis-grid,
          .gem-secondary-grid,
          .gem-secondary-card,
          .gem-meta-grid {
            grid-template-columns: 1fr;
          }

          .gem-hero-card {
            text-align: left;
            padding: 22px;
          }

          .gem-hero-card > svg {
            justify-self: start;
          }

          .gem-tabs button {
            font-size: 12px;
            padding: 8px 12px;
          }

          .gem-logo-name {
            font-size: 20px;
          }

          .gem-nav-btn {
            padding: 8px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}
