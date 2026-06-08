"use client";

import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { EngineShell, EngineHeader } from "@/components/engine/EngineShell";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { ragaMusicReferences, type MusicReferenceType } from "@/data/astrosound/ragaMusicReferences";
import {
  ALL_RASAS,
  GOAL_META,
  buildReportText,
  getAstroSoundCatalogStats,
  getMemorySummary,
  runAstroSound,
  useAstroSoundStore,
  type ChartData,
  type EmotionKey,
  type GoalKey,
  type IntensityKey,
  type ModeKey,
  type VoiceKey,
} from "@/lib/astro-engine/astro-sound";

const SIGN_NAME_TO_INDEX: Record<string, number> = {
  aries: 0,
  taurus: 1,
  gemini: 2,
  cancer: 3,
  leo: 4,
  virgo: 5,
  libra: 6,
  scorpio: 7,
  sagittarius: 8,
  capricorn: 9,
  aquarius: 10,
  pisces: 11,
  mesh: 0,
  vrishabh: 1,
  mithun: 2,
  kark: 3,
  simha: 4,
  kanya: 5,
  tula: 6,
  vrishchik: 7,
  dhanu: 8,
  makar: 9,
  kumbh: 10,
  meen: 11,
};

const ASTRO_SOUND_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

function activePeriodPlanet(entries: unknown): string | undefined {
  if (!Array.isArray(entries)) return undefined;
  const active = entries.find((entry) => {
    const item = entry as GenericObj;
    return Boolean(item?.active);
  }) as GenericObj | undefined;
  const first = entries[0] as GenericObj | undefined;
  const planet = active?.planet ?? active?.name ?? first?.planet ?? first?.name;
  return typeof planet === "string" && planet.trim() ? planet.trim() : undefined;
}

const VOICE_OPTIONS: { key: VoiceKey; label: string; emoji: string }[] = [
  { key: "any", label: "Any", emoji: "✨" },
  { key: "vocal", label: "Vocal", emoji: "🎙️" },
  { key: "flute", label: "Flute", emoji: "🪈" },
  { key: "sitar", label: "Sitar", emoji: "🎸" },
  { key: "veena", label: "Veena", emoji: "🪕" },
  { key: "sarod", label: "Sarod", emoji: "🎻" },
  { key: "tanpura", label: "Tanpura", emoji: "🕉️" },
];

const INTENSITY_OPTIONS: { key: IntensityKey; label: string }[] = [
  { key: "soft", label: "Soft" },
  { key: "medium", label: "Medium" },
  { key: "strong", label: "Strong" },
];

const MODE_OPTIONS: { key: ModeKey; label: string; desc: string }[] = [
  { key: "hybrid", label: "Hybrid", desc: "Chart + classical mood" },
  { key: "astro", label: "Astro", desc: "Planet-heavy scoring" },
  { key: "classical", label: "Classical", desc: "Raga mood only" },
];

const ASTROSOUND_CATALOG_STATS = getAstroSoundCatalogStats();

function modNum(n: number, m: number) {

  return ((n % m) + m) % m;
}

type GenericObj = Record<string, unknown>;

function normalizeNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toRashiIndex(value: unknown): number {
  if (typeof value === "string") {
    const key = value.trim().toLowerCase();
    if (key in SIGN_NAME_TO_INDEX) return SIGN_NAME_TO_INDEX[key];
  }

  const n = Number(value);

  if (Number.isFinite(n)) {
    if (n >= 0 && n <= 11) return Math.round(n);
    if (n >= 1 && n <= 12) return Math.round(n - 1);
    return Math.floor(modNum(n, 360) / 30);
  }

  return 0;
}

function getPlanetSource(root: GenericObj | null | undefined, planet: string): GenericObj {
  const lower = planet.toLowerCase();
  const base = root as GenericObj | undefined;
  const planets = (base?.planets as GenericObj | undefined) ?? undefined;
  const planetData = (base?.planetData as GenericObj | undefined) ?? undefined;
  const grahas = (base?.grahas as GenericObj | undefined) ?? undefined;
  const chart = (base?.chart as GenericObj | undefined) ?? undefined;
  const chartPlanets = (chart?.planets as GenericObj | undefined) ?? undefined;

  return (
    (planets?.[planet] as GenericObj | undefined) ??
    (planets?.[lower] as GenericObj | undefined) ??
    (planetData?.[planet] as GenericObj | undefined) ??
    (planetData?.[lower] as GenericObj | undefined) ??
    (grahas?.[planet] as GenericObj | undefined) ??
    (grahas?.[lower] as GenericObj | undefined) ??
    (chartPlanets?.[planet] as GenericObj | undefined) ??
    (chartPlanets?.[lower] as GenericObj | undefined) ??
    {}
  );
}

function hasPlanetSignal(raw: GenericObj) {
  return [
    raw?.lon,
    raw?.longitude,
    raw?.lng,
    raw?.degree,
    raw?.absoluteDegree,
    raw?.siderealLongitude,
    raw?.rashi,
    raw?.sign,
    raw?.rashiIndex,
    raw?.signIndex,
    raw?.rashiName,
    raw?.signName,
    raw?.house,
  ].some((value) => value !== undefined && value !== null && value !== "");
}

function getChartLongitude(root: GenericObj, ascendant: GenericObj | undefined, lagR: number) {
  return normalizeNumber(
    root?.lagLon ??
      root?.lagnaLon ??
      root?.ascendantLongitude ??
      ascendant?.lon ??
      ascendant?.longitude,
    lagR * 30
  );
}

function normalizeAstroSoundChart(source: unknown): ChartData | null {
  const src = (source as GenericObj | null | undefined) ?? undefined;
  const root = ((src?.chart as GenericObj | undefined) ?? src) as GenericObj | undefined;

  if (!root) return null;
  const ascendant = (root.ascendant as GenericObj | undefined) ?? undefined;
  const lagna = (root.lagna as GenericObj | undefined) ?? undefined;
  const birth = (root.birth as GenericObj | undefined) ?? undefined;
  const houses = (root.houses as Array<GenericObj> | undefined) ?? [];

  const lagnaRaw =
    root?.lagR ??
    root?.lagnaRashi ??
    root?.ascendantRashi ??
    ascendant?.rashi ??
    ascendant?.sign ??
    lagna?.rashi ??
    lagna?.sign ??
    houses?.[0]?.rashi ??
    houses?.[1]?.rashi ??
    0;

  const lagR = toRashiIndex(lagnaRaw);

  let validPlanetCount = 0;

  const planets = ASTRO_SOUND_PLANETS.reduce((acc: Record<string, { rashi: number; house: number; lon: number; status: string; retrograde: boolean }>, planet) => {
    const raw = getPlanetSource(root, planet);

    if (hasPlanetSignal(raw)) validPlanetCount += 1;

    const lon = normalizeNumber(
      raw?.lon ??
        raw?.longitude ??
        raw?.lng ??
        raw?.degree ??
        raw?.absoluteDegree ??
        raw?.siderealLongitude,
      toRashiIndex(raw?.rashi ?? raw?.sign ?? raw?.rashiName ?? raw?.signName) * 30
    );

    const rashi = toRashiIndex(
      raw?.rashi ??
        raw?.sign ??
        raw?.rashiIndex ??
        raw?.signIndex ??
        raw?.rashiName ??
        raw?.signName ??
        lon
    );

    const house =
      typeof raw?.house === "number" && Number.isFinite(raw.house)
        ? raw.house >= 1 && raw.house <= 12
          ? raw.house
          : modNum(raw.house - 1, 12) + 1
        : modNum(rashi - lagR, 12) + 1;

    acc[planet] = {
      rashi,
      house,
      lon,
      status: String(raw?.status ?? raw?.nature ?? ""),
      retrograde: Boolean(raw?.retrograde ?? raw?.isRetrograde),
    };

    return acc;
  }, {});

  if (validPlanetCount < 5) return null;

  return {
    lagR,
    lagLon: getChartLongitude(root, ascendant, lagR),
    dob: String(root?.dob ?? birth?.date ?? ""),
    planets,
  };
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="as-progress">
      <span style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
    </div>
  );
}


function buildSearchUrl(platform: "youtube" | "spotify", query: string) {
  const encoded = encodeURIComponent(query);

  if (platform === "youtube") {
    return `https://www.youtube.com/results?search_query=${encoded}`;
  }

  return `https://open.spotify.com/search/${encoded}`;
}

function buildListenLinks(ragaName: string) {
  return {
    youtube: buildSearchUrl("youtube", `${ragaName} raga alap instrumental`),
    spotify: buildSearchUrl("spotify", `${ragaName} raga`),
    tanpura: buildSearchUrl("youtube", `tanpura drone ${ragaName} raga`),
  };
}


const MUSIC_REFERENCE_TABS: { type: MusicReferenceType; label: string; emoji: string }[] = [
  { type: "film_bollywood", label: "Film / Bollywood", emoji: "🎬" },
  { type: "sufi_qawwali", label: "Sufi / Qawwali", emoji: "🕋" },
  { type: "bhajan_devotional", label: "Bhajan / Devotional", emoji: "🙏" },
  { type: "classical_bandish", label: "Classical / Bandish", emoji: "🎼" },
  { type: "modern_fusion", label: "Modern / Fusion", emoji: "🎧" },
  { type: "regional_devotional", label: "Regional Devotional", emoji: "🌺" },
];

function normalizeRagaKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function findMusicReferencesForRaga(ragaId: string, ragaName: string) {
  const idKey = normalizeRagaKey(ragaId);
  const nameKey = normalizeRagaKey(ragaName);

  return ragaMusicReferences.find((group) => {
    const keys = [
      group.ragaId,
      group.ragaName,
      ...(group.aliases ?? []),
    ].map(normalizeRagaKey);

    return keys.includes(idKey) || keys.includes(nameKey);
  });
}

function buildSevenDayProtocol(ragaName: string, goalLabel: string) {
  return [
    {
      day: "Day 1",
      title: "Introduction",
      text: `Listen to ${ragaName} for 7 minutes. Do not multitask. Just observe how your mind responds.`,
    },
    {
      day: "Day 2",
      title: "Breath Alignment",
      text: `Listen for 9 minutes with slow breathing. Keep the goal of ${goalLabel} in mind.`,
    },
    {
      day: "Day 3",
      title: "Focused Session",
      text: `Listen for 12 minutes before work, study, prayer or reflection. Keep volume soft.`,
    },
    {
      day: "Day 4",
      title: "Silent Integration",
      text: `Listen for 12 minutes, then sit silently for 2 minutes. Notice emotional changes.`,
    },
    {
      day: "Day 5",
      title: "Action Pairing",
      text: `Listen before taking one practical action related to ${goalLabel}.`,
    },
    {
      day: "Day 6",
      title: "Review",
      text: `Listen again and write one line about how the raga affected your mood or focus.`,
    },
    {
      day: "Day 7",
      title: "Completion",
      text: `Listen for 15 minutes. Mark whether it felt good, too heavy or should be skipped next time.`,
    },
  ];
}


export default function AstroSoundPage() {
  const [mounted, setMounted] = useState(false);
  const runIdRef = useRef(0);
  const aliveRef = useRef(true);
  const [uiNotice, setUiNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      aliveRef.current = false;
      runIdRef.current += 1;
    };
  }, []);


  const [musicReferenceType, setMusicReferenceType] = useState<MusicReferenceType>("film_bollywood");
  const { chart, loading: chartLoading, hasUserChart } = useUserChart();
  const chartData = useMemo(() => hasUserChart ? normalizeAstroSoundChart(chart) : null, [chart, hasUserChart]);
  const dashaPlanets = useMemo(() => {
    const rawChart = chart as unknown as GenericObj | null | undefined;
    const root = ((rawChart?.chart as GenericObj | undefined) ?? rawChart) as GenericObj | undefined;
    return {
      currentMahadasha: activePeriodPlanet(root?.dashas),
      currentAntardasha: activePeriodPlanet(root?.antardasha),
    };
  }, [chart]);

  const {
    settings,
    setSettings,
    result,
    setResult,
    loading,
    setLoading,
    memory,
    recordFeedback,
    resetMemory,
    lastReportText,
    setLastReportText,
  } = useAstroSoundStore();

  const [activeTab, setActiveTab] = useState<"protocol" | "timing" | "rasa" | "why" | "memory">("protocol");

  const memorySummary = useMemo(() => getMemorySummary(memory), [memory]);

  const listenLinks = useMemo(() => {
    if (!result) return null;
    return buildListenLinks(result.primary.raga.name);
  }, [result]);


  const musicReferenceGroup = useMemo(() => {
    if (!result) return undefined;
    return findMusicReferencesForRaga(result.primary.raga.id, result.primary.raga.name);
  }, [result]);

  const visibleMusicReferences = useMemo(() => {
    return musicReferenceGroup?.references.filter((item) => item.type === musicReferenceType) ?? [];
  }, [musicReferenceGroup, musicReferenceType]);

  const sevenDayProtocol = useMemo(() => {
    if (!result) return [];
    return buildSevenDayProtocol(result.primary.raga.name, GOAL_META[settings.goal].label);
  }, [result, settings.goal]);

  const generate = useCallback(() => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    setLoading(true);
    setUiNotice(null);

    window.setTimeout(() => {
      if (!aliveRef.current || runId !== runIdRef.current) return;

      try {
        const next = runAstroSound({
          chart: chartData,
          goal: settings.goal,
          emotion: settings.emotion,
          voice: settings.voice,
          intensity: settings.intensity,
          mode: settings.mode,
          currentMahadasha: dashaPlanets.currentMahadasha,
          currentAntardasha: dashaPlanets.currentAntardasha,
          memory,
        });

        if (!aliveRef.current || runId !== runIdRef.current) return;
        setResult(next);
        setLastReportText(buildReportText(next));
      } catch {
        if (aliveRef.current && runId === runIdRef.current) {
          setUiNotice("Astro Sound could not generate right now. Please try again.");
        }
      } finally {
        if (aliveRef.current && runId === runIdRef.current) {
          setLoading(false);
        }
      }
    }, 250);
  }, [chartData, dashaPlanets, memory, setLastReportText, setLoading, setResult, settings]);

  const copyReport = async () => {
    if (!lastReportText) return;

    try {
      await navigator.clipboard.writeText(lastReportText);
      setUiNotice("Astro Sound report copied.");
    } catch {
      setUiNotice("Could not copy report.");
    }
  };

  const downloadReport = () => {
    if (!lastReportText) return;

    const blob = new Blob([lastReportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "AstroLife_Astro_Sound_Report.txt";
    a.click();

    URL.revokeObjectURL(url);
    setUiNotice("Report downloaded.");
  };

  const feedback = (kind: "good" | "heavy" | "skip") => {
    if (!result) return;
    recordFeedback(kind, result.primary.raga.name, settings.goal);
  };

  if (!mounted) {
    return (
      <main className="astro-sound-page" suppressHydrationWarning>
        <section className="as-hero">
          <p>AstroSound</p>
          <h1>Preparing your sound map...</h1>
        </section>
      </main>
    );
  }

  return (
    <EngineShell className="as-shell">
      <EngineHeader
        eyebrow="Astro Sound Engine"
        title="AstroLife Sound Intelligence"
        subtitle="Personalized raga guidance from your chart, intention, emotional state and listening preference. Music guidance only, not medical treatment."
        icon="♫"
        metrics={[
          { label: "Score", value: result ? result.score : "—", tone: "gold" },
          { label: "Status", value: result ? result.status : "Ready", tone: "violet" },
          { label: "Catalog", value: `${ASTROSOUND_CATALOG_STATS.totalRagas} ragas`, tone: "green" },
          { label: "Goal", value: GOAL_META[settings.goal].label, tone: "blue" },
          { label: "Chart", value: chartData ? "Linked" : "Optional", tone: chartData ? "green" : "red" },
        ]}
      />

      <section className="as-grid">
        <aside className="as-panel">
          <div className="as-panel-head">
            <h2>Choose your intention</h2>
            <p>
              {chartLoading
                ? "Loading chart data…"
                : chartData
                  ? "Chart connected. Recommendation will use natal signals."
                  : "Chart not loaded — results will use default raga scoring."}
            </p>
          </div>

          <div className="as-control">
            <label>Goal</label>
            <div className="as-chip-grid">
              {(Object.keys(GOAL_META) as GoalKey[]).map((goal) => (
                <button
                  type="button"
                  key={goal}
                  className={mounted && settings.goal === goal ? "active" : ""}
                  onClick={() => setSettings({ goal })}
                >
                  <span>{GOAL_META[goal].emoji}</span>
                  {GOAL_META[goal].label}
                </button>
              ))}
            </div>
          </div>

          <div className="as-control">
            <label>Emotion</label>
            <select
              value={settings.emotion}
              onChange={(event) => setSettings({ emotion: event.target.value as EmotionKey })}
            >
              <option value="auto">Auto from goal</option>
              {ALL_RASAS.map((rasa) => (
                <option key={rasa.key} value={rasa.key}>
                  {rasa.emoji} {rasa.label}
                </option>
              ))}
            </select>
          </div>

          <div className="as-control">
            <label>Preferred sound</label>
            <div className="as-chip-grid small">
              {VOICE_OPTIONS.map((voice) => (
                <button type="button"
                  key={voice.key}
                  className={settings.voice === voice.key ? "active" : ""}
                  onClick={() => setSettings({ voice: voice.key })}
                >
                  <span>{voice.emoji}</span>
                  {voice.label}
                </button>
              ))}
            </div>
          </div>

          <div className="as-control">
            <label>Intensity</label>
            <div className="as-segment">
              {INTENSITY_OPTIONS.map((item) => (
                <button type="button"
                  key={item.key}
                  className={settings.intensity === item.key ? "active" : ""}
                  onClick={() => setSettings({ intensity: item.key })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="as-control">
            <label>Mode</label>
            <div className="as-mode-list">
              {MODE_OPTIONS.map((item) => (
                <button type="button"
                  key={item.key}
                  className={settings.mode === item.key ? "active" : ""}
                  onClick={() => setSettings({ mode: item.key })}
                >
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="as-generate" disabled={loading} onClick={generate}>
            {loading ? "Tuning recommendation…" : "Generate Astro Sound"}
          </button>

          <div className="as-how-card">
            <h3>How Astro Sound Works</h3>
            <p>
              Phase 1 combines your selected goal, emotional state, preferred sound,
              intensity and available chart signals to recommend a raga protocol.
            </p>

            <div className="as-how-list">
              <div>
                <strong>1</strong>
                <span>Goal match</span>
                <em>Mind, sleep, study, career, love, money or spiritual focus.</em>
              </div>
              <div>
                <strong>2</strong>
                <span>Rasa match</span>
                <em>Calm, focus, joy, devotion, confidence, release or romance.</em>
              </div>
              <div>
                <strong>3</strong>
                <span>Chart support</span>
                <em>Planet and house signals adjust the recommendation when chart data is available.</em>
              </div>
              <div>
                <strong>4</strong>
                <span>Memory</span>
                <em>Your feedback helps avoid ragas that felt too heavy.</em>
              </div>
            </div>
          </div>
        </aside>

        <section className="as-result">
          {!result ? (
            <div className="as-empty">
              <div>🪐</div>
              <h2>Your sound protocol is waiting</h2>
              <p>
                Select your intention and generate a personalized raga recommendation.
                Phase 2 is active with chart-aware scoring, raga protocol, feedback memory and Listen Now links.
              </p>

              <div className="as-empty-badges">
                <span>Goal scoring</span>
                <span>Rasa scoring</span>
                <span>Chart-aware</span>
                <span>Local memory</span>
                <span>Listen Now</span>
              </div>
            </div>
          ) : (
            <>
              <div className="as-primary">
                <div>
                  <div className="as-kicker">Primary Raga</div>
                  <h2>{result.primary.raga.name}</h2>
                  <p>{result.primary.raga.why}</p>
                </div>

                <div className="as-score-card">
                  <strong>{result.score}</strong>
                  <span>{result.status}</span>
                </div>
              </div>

              <div className="as-meta-grid">
                <div>
                  <span>System</span>
                  <strong>{result.primary.raga.system}</strong>
                </div>
                <div>
                  <span>Best Time</span>
                  <strong>{result.primary.raga.time}</strong>
                </div>
                <div>
                  <span>Laya</span>
                  <strong>{result.primary.raga.laya}</strong>
                </div>
                <div>
                  <span>Energy</span>
                  <strong>{result.primary.raga.energy}</strong>
                </div>
                <div>
                  <span>Evidence</span>
                  <strong>{result.primary.raga.evidence?.replace(/_/g, " ") ?? "classical"}</strong>
                </div>
                <div>
                  <span>Protocol</span>
                  <strong>{result.primary.raga.protocolDays ?? 3} days</strong>
                </div>
              </div>

              <div className="as-calc-card">
                <div>
                  <strong>Calculation Snapshot</strong>
                  <p>
                    Score is built from raga confidence, goal match, rasa match,
                    preferred instrument, intensity, chart support, feedback memory and timing sensitivity.
                  </p>
                </div>
                <div className="as-calc-pills">
                  <span>{GOAL_META[settings.goal].label}</span>
                  <span>{settings.emotion === "auto" ? "Auto mood" : settings.emotion}</span>
                  <span>{settings.voice}</span>
                  <span>{settings.mode}</span>
                  <span>{chartData ? "Chart connected" : "Fallback scoring"}</span>
                  {result && <span>{result.timing.activePlanet}</span>}
                </div>
              </div>

              <div className="as-calc-card">
                <div>
                  <strong>AstroSound 108 Intelligence</strong>
                  <p>
                    This recommendation is selected from an active {ASTROSOUND_CATALOG_STATS.totalRagas}-raga catalog,
                    including the 108-raaga wellness layer, chart scoring, listening-time discipline, avoid-memory,
                    evidence tiers, Yaman gating and medical safety guardrails.
                  </p>
                </div>
                <div className="as-calc-pills">
                  {(result.primary.raga.wellnessSupport ?? []).slice(0, 6).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                  {result.primary.raga.medicalGuardrail && result.primary.raga.medicalGuardrail !== "general" && (
                    <span>{result.primary.raga.medicalGuardrail.replace(/_/g, " ")}</span>
                  )}
                </div>
              </div>

              <div className="as-music-references">
                  <div className="as-section-heading">
                    <span>Raag Music References</span>
                    <h3>Listen through familiar songs</h3>
                    <p>
                      Film, bhajan and qawwali music may use raag-ang or cinematic liberties,
                      so each reference includes a confidence label.
                    </p>
                  </div>

                  <div className="as-music-tabs">
                    {MUSIC_REFERENCE_TABS.map((tab) => (
                      <button
                        type="button"
                        key={tab.type}
                        className={musicReferenceType === tab.type ? "active" : ""}
                        onClick={() => setMusicReferenceType(tab.type)}
                      >
                        <span>{tab.emoji}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {visibleMusicReferences.length > 0 ? (
                    <div className="as-music-list">
                      {visibleMusicReferences.map((item) => (
                        <article className="as-music-card" key={`${item.type}-${item.title}`}>
                          <div>
                            <strong>{item.title}</strong>
                            <p>
                              {[item.artist, item.filmOrAlbum, item.composer]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                            <small>{item.note}</small>

                            <div className="as-music-actions">
                              <a
                                href={buildSearchUrl("youtube", item.sourceQuery ?? `${item.title} ${item.artist ?? ""}`)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                ▶ YouTube
                              </a>
                              <a
                                href={buildSearchUrl("spotify", item.sourceQuery ?? `${item.title} ${item.artist ?? ""}`)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                🎧 Spotify
                              </a>
                            </div>
                          </div>

                          <div className={`as-confidence as-confidence-${item.confidence}`}>
                            {item.confidence}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="as-empty-music">
                      No references mapped yet for this category. Try another music tab.
                    </div>
                  )}
                </div>

              {listenLinks && (
                <div className="as-listen-card">
                  <div>
                    <div className="as-section-title compact">Phase 2 · Listen Now</div>
                    <h3>Start listening to {result.primary.raga.name}</h3>
                    <p>
                      Open a search link and choose a slow, clean version. Prefer alap,
                      instrumental, vocal or tanpura-backed versions. Keep volume soft.
                    </p>
                  </div>

                  <div className="as-listen-actions">
                    <a href={listenLinks.youtube} target="_blank" rel="noreferrer">
                      ▶ YouTube
                    </a>
                    <a href={listenLinks.spotify} target="_blank" rel="noreferrer">
                      🎧 Spotify
                    </a>
                    <a href={listenLinks.tanpura} target="_blank" rel="noreferrer">
                      🕉️ Tanpura Drone
                    </a>
                  </div>
                </div>
              )}

              <div className="as-tabs">
                {([
                  ["protocol", "Protocol"],
                  ["timing", "Timing"],
                  ["rasa", "Navarasa"],
                  ["why", "Why this"],
                  ["memory", "Memory"],
                ] as const).map(([key, label]) => (
                  <button type="button"
                    key={key}
                    className={activeTab === key ? "active" : ""}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "protocol" && (
                <div className="as-card">
                  <h3>Listening Protocol</h3>
                  <ul>
                    {result.protocol.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3>Safe Remedies</h3>
                  <ul>
                    {result.remedies.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3>7-Day Listening Calendar</h3>
                  <div className="as-seven-day">
                    {sevenDayProtocol.map((item) => (
                      <div key={item.day}>
                        <strong>{item.day}</strong>
                        <span>{item.title}</span>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "timing" && (
                <div className="as-card">
                  <h3>Dasha + Transit Timing Protocol</h3>

                  <div className="as-timing-grid">
                    <div>
                      <span>Active Planet</span>
                      <strong>{result.timing.activePlanet}</strong>
                      <p>{result.timing.activePlanetReason}</p>
                    </div>

                    <div>
                      <span>Current Day Planet</span>
                      <strong>{result.timing.currentDayPlanet}</strong>
                      <p>{result.timing.currentDayGuidance}</p>
                    </div>

                    <div>
                      <span>Sensitivity</span>
                      <strong>{result.timing.sensitivity}</strong>
                      <p>{result.timing.transitLikeFocus}</p>
                    </div>

                    <div>
                      <span>Best Window</span>
                      <strong>{result.timing.bestWindow}</strong>
                      <p>Use this as a timing guide, not a rigid rule.</p>
                    </div>
                  </div>

                  <h3>Mahadasha + Antardasha Mantra Pairing</h3>
                  <div className="as-timing-grid">
                    <div>
                      <span>Mahadasha Mantra</span>
                      <strong>{result.mantraPlan.mahadasha?.planet ?? "Not detected"}</strong>
                      <p>
                        {result.mantraPlan.mahadasha
                          ? `${result.mantraPlan.mahadasha.mantra} · ${result.mantraPlan.mahadasha.count}. ${result.mantraPlan.mahadasha.purpose}`
                          : "Saved chart timing did not expose active Mahadasha, so use the raga support mantra only."}
                      </p>
                    </div>

                    <div>
                      <span>Antardasha Mantra</span>
                      <strong>{result.mantraPlan.antardasha?.planet ?? "Not detected"}</strong>
                      <p>
                        {result.mantraPlan.antardasha
                          ? `${result.mantraPlan.antardasha.mantra} · ${result.mantraPlan.antardasha.count}. ${result.mantraPlan.antardasha.purpose}`
                          : "Saved chart timing did not expose active Antardasha; do not force a second mantra."}
                      </p>
                    </div>

                    <div>
                      <span>Raga Support Mantra</span>
                      <strong>{result.mantraPlan.ragaSupport.planet}</strong>
                      <p>
                        {result.mantraPlan.ragaSupport.mantra} · {result.mantraPlan.ragaSupport.count}. Use before {result.primary.raga.name}.
                      </p>
                    </div>

                    <div>
                      <span>Practice Rule</span>
                      <strong>MD → AD → Raga</strong>
                      <p>{result.mantraPlan.note}</p>
                    </div>
                  </div>

                  <h3>Mantra Instructions</h3>
                  <ul>
                    {result.mantraPlan.practice.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3>Timing Instructions</h3>
                  <ul>
                    {result.timing.protocol.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3>21-Day Raga Sadhana</h3>
                  <ul>
                    {result.timing.twentyOneDaySadhana.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "rasa" && (
                <div className="as-card">
                  <h3>Navarasa Profile</h3>
                  <div className="as-rasa-list">
                    {Object.entries(result.navarasa).map(([key, value]) => (
                      <div key={key}>
                        <div className="as-rasa-row">
                          <span>{key}</span>
                          <strong>{value}</strong>
                        </div>
                        <ProgressBar value={value} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "why" && (
                <div className="as-card">
                  <h3>Why this raga?</h3>
                  <ul>
                    {result.reasons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {!!result.cautions.length && (
                    <>
                      <h3>Cautions</h3>
                      <ul>
                        {result.cautions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === "memory" && (
                <div className="as-card">
                  <h3>Feedback Memory</h3>
                  <p>Last raga: {memorySummary.last}</p>
                  <p>Last feedback: {memorySummary.feedback}</p>
                  <p>
                    Avoid memory:{" "}
                    {memorySummary.avoid.length ? memorySummary.avoid.join(", ") : "No heavy/skip ragas yet"}
                  </p>
                  <button type="button" className="as-mini-btn" onClick={resetMemory}>
                    Reset memory
                  </button>
                </div>
              )}

              <div className="as-section-title">Alternatives</div>
              <div className="as-alt-grid">
                {result.alternatives.map((item) => (
                  <div className="as-alt-card" key={item.raga.id}>
                    <strong>{item.raga.name}</strong>
                    <span>{item.score}/100</span>
                    <p>{item.raga.energy} · {item.raga.time}</p>
                  </div>
                ))}
              </div>

              <div className="as-actions">
                <button type="button" onClick={() => feedback("good")}>Felt good</button>
                <button type="button" onClick={() => feedback("heavy")}>Too heavy</button>
                <button type="button" onClick={() => feedback("skip")}>Skip next time</button>
                <button type="button" onClick={copyReport}>Copy report</button>
                <button type="button" onClick={downloadReport}>Download text</button>
              </div>
              {uiNotice && <div className="as-inline-notice">{uiNotice}</div>}
            </>
          )}
        </section>
      </section>

      <section className="as-roadmap">
        <h2>Astro Sound Roadmap</h2>
        <div className="as-road-grid">
          <div>
            <strong>Phase 1 · Active</strong>
            <p>Raga recommendation, chart-aware scoring, goal/emotion input, protocol and memory.</p>
          </div>
          <div>
            <strong>Phase 2 · Active</strong>
            <p>Listen Now links, YouTube/Spotify search, tanpura drone and 7-day protocol.</p>
          </div>
          <div>
            <strong>Phase 3 · Active</strong>
            <p>Dasha/transit style timing protocol, active planet focus and 21-day raga sadhana.</p>
          </div>
          <div>
            <strong>Phase 4 · Active</strong>
            <p>Dashboard card, AI chat context, Premium PDF section and roadmap integration.</p>
          </div>
          <div>
            <strong>Phase 5 · Active</strong>
            <p>108-raaga wellness catalog, evidence tiers, Yaman need-gating, avoid-memory and medical safety guardrails.</p>
          </div>
          <div>
            <strong>Phase 6 · Later</strong>
            <p>Mantra pairing, curated playlists and separate Astro Sound PDF export.</p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        body {
          background: #05020f;
        }

        .as-shell {
          min-height: 100vh;
          padding: 28px;
          color: #f8f2ff;
          background:
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.28), transparent 30%),
            radial-gradient(circle at top right, rgba(245, 197, 66, 0.14), transparent 28%),
            #05020f;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .as-hero {
          max-width: 1200px;
          margin: 0 auto 22px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.06);
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 24px;
          align-items: center;
          backdrop-filter: blur(18px);
        }

        .as-kicker {
          color: #f5c542;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          font-weight: 900;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .as-hero h1 {
          margin: 0 0 12px;
          font-size: clamp(38px, 6vw, 74px);
          line-height: 0.92;
          letter-spacing: 0;
        }

        .as-hero p {
          max-width: 760px;
          color: rgba(248, 242, 255, 0.7);
          font-size: 17px;
          line-height: 1.65;
          margin: 0;
        }

        .as-safe-note {
          margin-top: 10px;
          color: rgba(245, 197, 66, 0.76);
          font-size: 12px;
          line-height: 1.5;
        }

        .as-orb {
          width: 190px;
          height: 190px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          justify-self: end;
          background:
            radial-gradient(circle at 35% 30%, rgba(245, 197, 66, 0.9), transparent 22%),
            radial-gradient(circle at 70% 75%, rgba(124, 58, 237, 0.9), transparent 34%),
            rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 24px 70px rgba(124, 58, 237, 0.26);
          text-align: center;
        }

        .as-orb span {
          font-size: 34px;
        }

        .as-orb strong {
          font-size: 42px;
          color: #f5c542;
        }

        .as-orb em {
          font-style: normal;
          color: rgba(255, 255, 255, 0.68);
          font-size: 12px;
        }

        .as-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 390px 1fr;
          gap: 20px;
          align-items: start;
        }

        .as-panel,
        .as-result,
        .as-roadmap {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 22px;
          backdrop-filter: blur(18px);
        }

        .as-panel-head h2,
        .as-roadmap h2 {
          margin: 0 0 6px;
          font-size: 22px;
        }

        .as-panel-head p {
          margin: 0 0 18px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 13px;
          line-height: 1.5;
        }

        .as-control {
          margin-top: 18px;
        }

        .as-control label {
          display: block;
          color: rgba(255, 255, 255, 0.72);
          font-weight: 800;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .as-chip-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }

        .as-chip-grid.small {
          grid-template-columns: repeat(2, 1fr);
        }

        .as-chip-grid button,
        .as-segment button,
        .as-mode-list button,
        .as-actions button,
        .as-mini-btn {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: #f8f2ff;
          border-radius: 15px;
          padding: 11px 12px;
          cursor: pointer;
          font-weight: 800;
          text-align: left;
        }

        .as-chip-grid button span {
          margin-right: 7px;
        }

        .as-chip-grid button.active,
        .as-segment button.active,
        .as-mode-list button.active,
        .as-tabs button.active {
          background: linear-gradient(135deg, rgba(245, 197, 66, 0.22), rgba(124, 58, 237, 0.15));
          border-color: rgba(245, 197, 66, 0.42);
          color: #f5c542;
        }

        .as-control select {
          width: 100%;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          color: white;
          padding: 13px;
          outline: none;
        }

        .as-control option {
          background: #100625;
        }

        .as-segment {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .as-segment button {
          text-align: center;
        }

        .as-mode-list {
          display: grid;
          gap: 8px;
        }

        .as-mode-list button {
          display: grid;
          gap: 4px;
        }

        .as-mode-list span {
          color: rgba(255, 255, 255, 0.54);
          font-size: 12px;
          font-weight: 500;
        }


        .as-how-card {
          margin-top: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.045);
          border-radius: 22px;
          padding: 16px;
        }

        .as-how-card h3 {
          margin: 0 0 8px;
          color: #f5c542;
          font-size: 16px;
        }

        .as-how-card p {
          margin: 0 0 13px;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.55;
          font-size: 12.5px;
        }

        .as-how-list {
          display: grid;
          gap: 9px;
        }

        .as-how-list div {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 8px 10px;
          align-items: start;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 10px;
        }

        .as-how-list strong {
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(245, 197, 66, 0.18);
          color: #f5c542;
          font-size: 12px;
        }

        .as-how-list span {
          color: white;
          font-weight: 900;
          font-size: 12.5px;
        }

        .as-how-list em {
          grid-column: 2;
          color: rgba(255, 255, 255, 0.55);
          font-style: normal;
          line-height: 1.45;
          font-size: 11.5px;
        }

        .as-calc-card {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          margin: 18px 0;
          border: 1px solid rgba(245, 197, 66, 0.16);
          background: rgba(245, 197, 66, 0.07);
          border-radius: 22px;
          padding: 16px;
        }

        .as-calc-card strong {
          color: #f5c542;
          font-size: 14px;
        }

        .as-calc-card p {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.55;
          font-size: 12.5px;
        }

        .as-calc-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          justify-content: flex-end;
          max-width: 330px;
        }

        .as-calc-pills span,
        .as-empty-badges span {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.76);
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 800;
        }

        .as-empty-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .as-generate {
          width: 100%;
          margin-top: 20px;
          border: 0;
          border-radius: 999px;
          padding: 15px 18px;
          background: linear-gradient(135deg, #f5c542, #ff9f1c);
          color: #140b00;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 14px 36px rgba(245, 197, 66, 0.22);
        }

        .as-empty {
          min-height: 520px;
          display: grid;
          place-items: center;
          text-align: center;
          color: rgba(255, 255, 255, 0.68);
        }

        .as-empty div {
          font-size: 60px;
          margin-bottom: 12px;
        }

        .as-empty h2 {
          color: white;
          margin: 0 0 8px;
          font-size: 28px;
        }

        .as-empty p {
          max-width: 520px;
          margin: 0;
          line-height: 1.6;
        }

        .as-primary {
          display: grid;
          grid-template-columns: 1fr 120px;
          gap: 18px;
          align-items: start;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .as-primary h2 {
          margin: 0 0 10px;
          font-size: 42px;
          letter-spacing: -0.04em;
        }

        .as-primary p {
          margin: 0;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.65;
        }

        .as-score-card {
          border-radius: 24px;
          background: rgba(245, 197, 66, 0.13);
          border: 1px solid rgba(245, 197, 66, 0.26);
          padding: 18px;
          text-align: center;
        }

        .as-score-card strong {
          display: block;
          font-size: 44px;
          color: #f5c542;
        }

        .as-score-card span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-weight: 800;
        }

        .as-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin: 18px 0;
        }

        .as-meta-grid div,
        .as-alt-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 14px;
        }

        .as-meta-grid span,
        .as-alt-card span {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          margin-bottom: 5px;
        }

        .as-meta-grid strong,
        .as-alt-card strong {
          color: white;
        }


        .as-listen-card {
          margin: 18px 0;
          border: 1px solid rgba(245, 197, 66, 0.22);
          background:
            radial-gradient(circle at top left, rgba(245, 197, 66, 0.15), transparent 34%),
            rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 18px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
        }

        .as-listen-card h3 {
          margin: 0 0 8px;
          font-size: 22px;
          color: #ffffff;
        }

        .as-listen-card p {
          margin: 0;
          color: rgba(255, 255, 255, 0.64);
          line-height: 1.6;
          font-size: 13px;
        }

        .as-section-title.compact {
          margin: 0 0 8px;
        }

        .as-listen-actions {
          display: grid;
          gap: 9px;
          min-width: 160px;
        }

        .as-listen-actions a {
          display: block;
          text-decoration: none;
          text-align: center;
          border-radius: 999px;
          padding: 10px 13px;
          font-weight: 900;
          color: #140b00;
          background: linear-gradient(135deg, #f5c542, #ff9f1c);
          box-shadow: 0 10px 24px rgba(245, 197, 66, 0.16);
        }

        .as-seven-day {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 12px;
        }

        .as-seven-day div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 12px;
        }

        .as-seven-day strong {
          display: inline-flex;
          color: #f5c542;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .as-seven-day span {
          display: block;
          color: #ffffff;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .as-seven-day p {
          margin: 0;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.5;
          font-size: 12px;
        }

        .as-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0;
        }

        .as-tabs button {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: white;
          border-radius: 999px;
          padding: 9px 13px;
          cursor: pointer;
          font-weight: 800;
        }

        .as-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 22px;
          padding: 18px;
        }

        .as-card h3 {
          margin: 0 0 10px;
          color: #f5c542;
        }

        .as-card ul {
          margin: 0 0 14px;
          padding-left: 20px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
        }

        .as-card p {
          color: rgba(255, 255, 255, 0.72);
        }


        .as-timing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .as-timing-grid div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 14px;
        }

        .as-timing-grid span {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .as-timing-grid strong {
          display: block;
          color: #f5c542;
          font-size: 18px;
          margin-bottom: 7px;
        }

        .as-timing-grid p {
          margin: 0;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.5;
          font-size: 12px;
        }

        .as-rasa-list {
          display: grid;
          gap: 12px;
        }

        .as-rasa-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          text-transform: capitalize;
        }

        .as-progress {
          height: 9px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
        }

        .as-progress span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #f5c542, #8b5cf6);
          border-radius: inherit;
        }

        .as-section-title {
          margin: 18px 0 10px;
          color: #f5c542;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
        }

        .as-alt-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .as-alt-card p {
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.56);
          font-size: 12px;
        }

        .as-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .as-actions button,
        .as-mini-btn {
          text-align: center;
        }

        .as-inline-notice {
          margin-top: 10px;
          border: 1px solid rgba(245, 197, 66, 0.3);
          background: rgba(245, 197, 66, 0.12);
          color: #f7dd95;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 12px;
        }

        .as-roadmap {
          max-width: 1200px;
          margin: 20px auto 0;
        }

        .as-road-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .as-road-grid div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
        }

        .as-road-grid strong {
          color: #f5c542;
        }

        .as-road-grid p {
          color: rgba(255, 255, 255, 0.64);
          line-height: 1.55;
          margin: 7px 0 0;
          font-size: 13px;
        }


        .as-music-references {
          margin-top: 18px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.055);
        }

        .as-music-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 14px 0 16px;
        }

        .as-music-tabs button {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: inherit;
          padding: 9px 12px;
          cursor: pointer;
          font-size: 0.82rem;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .as-music-tabs button.active {
          border-color: rgba(245, 197, 107, 0.75);
          background: rgba(245, 197, 107, 0.16);
        }

        .as-music-list {
          display: grid;
          gap: 12px;
        }

        .as-music-card {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.16);
        }

        .as-music-card strong {
          display: block;
          margin-bottom: 5px;
        }

        .as-music-card p {
          margin: 0 0 6px;
          opacity: 0.78;
          font-size: 0.86rem;
        }

        .as-music-card small {
          display: block;
          opacity: 0.68;
          line-height: 1.45;
        }

        .as-music-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        .as-music-actions a {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          padding: 7px 10px;
          color: inherit;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.07);
          font-size: 0.78rem;
        }

        .as-music-actions a:hover {
          border-color: rgba(245, 197, 107, 0.7);
          background: rgba(245, 197, 107, 0.13);
        }

        .as-confidence {
          align-self: flex-start;
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 0.72rem;
          text-transform: capitalize;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.08);
        }

        .as-confidence-high {
          border-color: rgba(83, 224, 160, 0.55);
        }

        .as-confidence-medium {
          border-color: rgba(245, 197, 107, 0.65);
        }

        .as-confidence-low {
          border-color: rgba(255, 255, 255, 0.18);
        }

        .as-empty-music {
          padding: 14px;
          border-radius: 18px;
          border: 1px dashed rgba(255, 255, 255, 0.16);
          opacity: 0.72;
        }

        @media (max-width: 980px) {
          .as-shell {
            padding: 16px;
          }

          .as-hero {
            padding: 22px;
          }

          .as-hero h1 {
            font-size: 42px;
            line-height: 1;
          }

          .as-hero,
          .as-grid {
            grid-template-columns: 1fr;
          }

          .as-orb {
            justify-self: start;
            width: 150px;
            height: 150px;
          }

          .as-meta-grid,
          .as-alt-grid,
          .as-road-grid,
          .as-calc-card,
          .as-listen-card,
          .as-seven-day,
          .as-timing-grid {
            grid-template-columns: 1fr !important;
          }

          .as-calc-pills {
            justify-content: flex-start;
            max-width: none;
          }

          .as-primary {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .as-shell {
            padding: 12px;
          }

          .as-hero,
          .as-panel,
          .as-result,
          .as-roadmap,
          .as-card,
          .as-music-references {
            padding: 16px;
          }

          .as-chip-grid,
          .as-chip-grid.small,
          .as-segment,
          .as-music-card {
            grid-template-columns: 1fr;
          }

          .as-music-card {
            display: grid;
          }

          .as-primary h2 {
            font-size: 34px;
            letter-spacing: 0;
          }
        }
      `}</style>
    </EngineShell>
  );
}
