"use client";

import React, { useState, useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import type { DashaLord } from "@/lib/astro-engine/dasha";
import {
  runNavtaraIntelligence,
  type FullNavtaraIntelligence,
  type DashaAuditPattern,
  type NavtaraMatrixItem,
} from "@/lib/astro-engine/navtara-engine";
import {
  resolvePlanetTattvaRemedy,
  type NavtaraPlanetaryRemedy,
} from "@/lib/astro-engine/navtara-remedies";
import {
  evaluateDashaActivationWindows,
  type DashaTransitWindow,
} from "@/lib/astro-engine/transit-trigger";
import type { SupportedAyanamsha } from "@/lib/astro-engine/ayanamsa-config";
import { NakshatraChakraWheel } from "@/components/dasha/NakshatraChakraWheel";
import {
  evaluateNakshatraRemedyDossier,
  type NakshatraHumanReport,
} from "@/lib/astro-engine/nakshatra-remedy-engine";
import {
  Shield,
  Sparkles,
  AlertTriangle,
  Compass,
  Flame,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Feather,
  Share2,
  Copy,
  Check,
  PieChart,
  Grid,
  BookOpen,
  Activity,
  Droplets,
} from "lucide-react";
import { evaluateNavtaraHitPrecedence } from "@/lib/astro-engine/micro-vastu-auditor";

interface NavtaraIntelligenceViewProps {
  chart: ChartData;
  activeMD?: DashaLord;
  activeAD?: DashaLord;
  tp: (n: string) => string;
}

export function NavtaraIntelligenceView({
  chart,
  activeMD,
  activeAD,
  tp,
}: NavtaraIntelligenceViewProps) {
  const [selectedAyanamsa, setSelectedAyanamsa] =
    useState<SupportedAyanamsha>("Lahiri_Chitrapaksha");
  const [viewMode, setViewMode] = useState<"WHEEL" | "GRID">("WHEEL");
  const [activeParyayaTab, setActiveParyayaTab] = useState<
    "ALL" | "PRATHAMA" | "DVITIYA" | "TRITIYA"
  >("ALL");
  const [showRuleTraces, setShowRuleTraces] = useState<boolean>(false);
  const [selectedChakraItem, setSelectedChakraItem] =
    useState<NavtaraMatrixItem | null>(null);
  const [copiedRemedy, setCopiedRemedy] = useState<boolean>(false);
  const [activeRemedyTab, setActiveRemedyTab] = useState<
    "NARRATIVE" | "CHECKLIST" | "TRIKONA" | "SHIVLING"
  >("NARRATIVE");
  const [copiedNakshatraRemedy, setCopiedNakshatraRemedy] = useState<boolean>(false);
  const [showOtherProblemPlanets, setShowOtherProblemPlanets] = useState<boolean>(false);

  // Compute Human-Tone Nakshatra Remedy Dossier (5-Section Narrative, Checklist, Elemental Vehicle, 27 Shivling Upacharas)
  const nakshatraDossier: NakshatraHumanReport | null = useMemo(() => {
    try {
      return evaluateNakshatraRemedyDossier(chart);
    } catch (err) {
      console.warn("[NavtaraIntelligenceView] Failed to compute nakshatraDossier:", err);
      return null;
    }
  }, [chart]);

  // Compute Full Navtara Intelligence reactively based on chosen Ayanamsa
  const intel: FullNavtaraIntelligence = useMemo(() => {
    return runNavtaraIntelligence(chart, selectedAyanamsa);
  }, [chart, selectedAyanamsa]);

  const navtaraHitOverrides = useMemo(() => {
    return evaluateNavtaraHitPrecedence(chart);
  }, [chart]);
  const activeProhibitions = navtaraHitOverrides.filter(o => o.precedenceVerdict === "PROHIBITED_ACTIVATION");

  // Compute Dasha Activation Windows
  const activationWindows: DashaTransitWindow[] = useMemo(() => {
    if (!activeMD) return [];
    const isConcern =
      intel.dashaAudit?.patternSeverity === "Concern";
    return evaluateDashaActivationWindows(activeMD, isConcern);
  }, [activeMD, intel.dashaAudit]);

  // Compute Planetary Tattva Remedies for current Dasha Lord and any afflicted planets
  const activeRemedy: NavtaraPlanetaryRemedy | null = useMemo(() => {
    const planetKey = activeMD ?? "Saturn";
    const pData = chart.planets[planetKey];
    if (!pData) return null;

    const signName = pData.sign ?? (pData as any).rashi ?? "Aries";
    const rashiIdx = typeof pData.signNum === "number" ? pData.signNum : 0;
    const kpHouse = chart.kpCusps ? (pData.bhavaHouse ?? pData.house) : undefined;
    return resolvePlanetTattvaRemedy(
      planetKey,
      signName,
      rashiIdx,
      pData.house,
      kpHouse
    );
  }, [chart, activeMD]);

  // Filter Chakra items based on tab
  const displayedChakra = useMemo(() => {
    if (activeParyayaTab === "PRATHAMA") return intel.paryayaGroups.prathama;
    if (activeParyayaTab === "DVITIYA") return intel.paryayaGroups.dvitiya;
    if (activeParyayaTab === "TRITIYA") return intel.paryayaGroups.tritiya;
    return intel.chakra27;
  }, [intel, activeParyayaTab]);

  const audit = intel.dashaAudit;

  // Pattern badge styling
  const patternConfig: Record<
    DashaAuditPattern,
    { label: string; bg: string; border: string; text: string }
  > = {
    TRIPLE_CONCERN: {
      label: "TRIPLE CONCERN STRIKE",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.4)",
      text: "#DC2626",
    },
    DOUBLE_CONCERN: {
      label: "DOUBLE CONCERN PATTERN",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.35)",
      text: "#DC2626",
    },
    SAVED_BY_ONE: {
      label: "SHIELDED (SAVED BY ONE)",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.35)",
      text: "#D97706",
    },
    DOUBLE_SUPPORT: {
      label: "DOUBLE SUPPORT PATTERN",
      bg: "rgba(34, 197, 94, 0.12)",
      border: "rgba(34, 197, 94, 0.35)",
      text: "#16A34A",
    },
    TRIPLE_SUPPORT: {
      label: "TRIPLE HARMONIC SUPPORT",
      bg: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129, 0.4)",
      text: "#059669",
    },
    FOUNDATIONAL: {
      label: "FOUNDATIONAL PHASE",
      bg: "rgba(184, 134, 11, 0.12)",
      border: "rgba(184, 134, 11, 0.3)",
      text: "#B8860B",
    },
  };

  const currentPatternStyle =
    patternConfig[audit?.pattern ?? "FOUNDATIONAL"];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Bar: Ayanamsa Switcher & Birth Star Context ── */}
      <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B]">
              Birth Star Anchor
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-[#B8860B] font-semibold">
              Janma Nakshatra #{intel.birthNakshatra.id}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mt-1 flex items-center gap-2">
            <span>{intel.birthNakshatra.name}</span>
            <span className="text-sm font-normal text-[#6B635B]">
              Pada {intel.birthPada} · Lord: {tp(intel.birthNakshatra.lord)}
            </span>
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5">
            Devta: <strong className="text-[#1A1A1A]">{intel.birthNakshatra.devta}</strong> · Animal:{" "}
            {intel.birthNakshatra.animal} · Tree: {intel.birthNakshatra.tree}
          </p>
        </div>

        {/* Ayanamsa Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#FAF7F2] p-1.5 rounded-2xl border border-amber-900/10">
          <Sliders className="w-3.5 h-3.5 text-[#B8860B] ml-1.5" />
          <span className="text-xs font-semibold text-[#6B635B] mr-1">Ayanamsa:</span>
          <button
            onClick={() => setSelectedAyanamsa("Lahiri_Chitrapaksha")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedAyanamsa === "Lahiri_Chitrapaksha"
                ? "bg-[#B8860B] text-white shadow-sm"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            Lahiri (Vedic)
          </button>
          <button
            onClick={() => setSelectedAyanamsa("KP_Krishnamurti")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedAyanamsa === "KP_Krishnamurti"
                ? "bg-[#B8860B] text-white shadow-sm"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            KP (Krishnamurti)
          </button>
        </div>
      </section>

      {/* ── Boundary Proximity Alerts (if any) ── */}
      {intel.boundaryAlerts.length > 0 && (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-50/60 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Nakshatra Boundary Sensitivity Detected</span>
          </div>
          <div className="flex flex-col gap-2">
            {intel.boundaryAlerts.map((b, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#5C3D00] leading-relaxed">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide ${
                    b.severity === "HIGH"
                      ? "bg-red-500/15 text-red-700 border border-red-500/30"
                      : "bg-amber-500/15 text-amber-800 border border-amber-500/30"
                  }`}
                >
                  {b.severity === "HIGH" ? "Ayanamsa Shift (HIGH)" : "Boundary Cusp (LOW)"}
                </span>
                <span>{b.alertText}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Navtara-Hit Precedence Override Guard ── */}
      {activeProhibitions.length > 0 && (
        <section className="rounded-2xl border-2 border-red-500/40 bg-red-50/80 p-5 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm tracking-wide">
            <span className="text-xl">🚨</span>
            <span>नवतारा-हिट वरीयता चेतावनी (Astro-Vastu Hit Overrides Navtara Beneficence)</span>
          </div>
          <div className="flex flex-col gap-2">
            {activeProhibitions.map((p) => (
              <div key={p.planet} className="rounded-xl bg-white p-3.5 border border-red-200 text-xs text-red-900 flex flex-col gap-1.5 leading-relaxed">
                <div className="font-bold text-red-800 text-sm">
                  • {p.planet} ({p.taraNameHi}): {p.hitTargetName || "दशा स्वामी"} पर 180°/90° किलर वेध सक्रिय है!
                </div>
                <div className="text-[#7F1D1D]">{p.warningNoticeHi}</div>
                <div className="text-emerald-800 font-semibold">💡 शास्त्रीय समाधान: {p.actionProtocolHi}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Hero Card: Active Dasha 3-Layer Navtara Audit ── */}
      {audit && (
        <section className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                Active Dasha Qualification Audit
              </p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-0.5 flex items-center gap-2">
                <span>{tp(audit.activeMahadasha)} Mahadasha</span>
                {audit.activeAntardasha && (
                  <span className="text-base font-normal text-[#6B635B]">
                    · {tp(audit.activeAntardasha)} Antardasha
                  </span>
                )}
              </h3>
            </div>
            <div
              className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border flex items-center gap-1.5"
              style={{
                background: currentPatternStyle.bg,
                borderColor: currentPatternStyle.border,
                color: currentPatternStyle.text,
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{currentPatternStyle.label}</span>
            </div>
          </div>

          {/* Pattern description */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderLeft: "4px solid #B8860B",
            }}
          >
            <p className="text-[14px] text-[#1A1A1A] leading-[1.7] font-medium m-0">
              {audit.patternDescription}
            </p>
          </div>

          {/* The 3 Qualifying Layers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {audit.layers.map((layer, idx) => {
              const isDanger = layer.isConcern;
              return (
                <div
                  key={idx}
                  className="flex flex-col gap-2.5 transition-all"
                  style={{
                    padding: "16px 18px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: `1px solid ${
                      isDanger ? "rgba(239, 68, 68, 0.28)" : "rgba(184, 134, 11, 0.22)"
                    }`,
                    borderLeft: `4px solid ${isDanger ? "#dc2626" : "#059669"}`,
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="uppercase tracking-widest font-bold text-[#6B635B]">
                        Layer {idx + 1}
                      </span>
                      {layer.depth === 3 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700">
                          Depth 3 · Experimental
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDanger
                          ? "bg-red-500/15 text-red-700"
                          : "bg-emerald-500/15 text-emerald-700"
                      }`}
                    >
                      {layer.tara.category}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-[#6B635B] font-medium m-0">{layer.label}</p>
                    <p className="text-base font-bold text-[#1A1A1A] mt-1 flex items-center gap-1.5 m-0">
                      <span>{tp(layer.planet)}</span>
                      <span className="text-sm font-semibold text-[#B8860B]">
                        in {layer.nakshatra.name}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span className="text-2xl">{layer.tara.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] m-0">
                        Tara #{layer.tara.taraNum} — {layer.tara.name}
                      </p>
                      <p className="text-[11px] text-[#6B635B] mt-0.5 m-0">
                        Pos #{layer.countedPosition} · {layer.paryaya} ({layer.paryayaIntensity})
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#4A453F] mt-1 border-t border-amber-900/10 pt-2.5 italic leading-relaxed m-0">
                    {layer.tara.practicalAdvice}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Antardasha Active Modifier */}
          {audit.antardashaModifier && (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: 14,
                background: "rgba(59, 130, 246, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                borderLeft: "4px solid #2563EB",
              }}
              className="flex items-start gap-3.5"
            >
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800 m-0">
                  Antardasha Phase Modifier · {audit.antardashaModifier.status}
                </p>
                <p className="text-[13.5px] text-[#1A1A1A] mt-1.5 leading-[1.7] m-0">
                  {audit.antardashaModifier.explanation}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Two-Column Row: 27th Support Star & Birth Star Quality Profile ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2: Your 27th Support Star (Permanent Raksha Kavach) */}
        <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <div className="flex items-center gap-2">
              <Feather className="w-5 h-5 text-[#B8860B]" />
              <div>
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                  Permanent Raksha Kavach
                </p>
                <h4 className="text-lg font-bold text-[#1A1A1A]">
                  Your 27th Support Star: {intel.supportStarShield.nakshatra.name}
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800">
              Tara #9 Parama Mitra
            </span>
          </div>

          <p className="text-xs text-[#6B635B] leading-relaxed">
            Strict Classical Rule: Calculated strictly as the star immediately preceding your Janma Nakshatra (Star 1 - 1 = Star 27). This star serves as your lifelong energetic shield to neutralize adverse 3, 5, or 7 dasha afflictions.
          </p>

          {/* 6 Physical & Spiritual Anchors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="text-[10.5px] uppercase font-bold text-[#6B635B] tracking-wider m-0">Devta</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] m-0">
                {intel.supportStarShield.anchors.devta}
              </p>
            </div>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="text-[10.5px] uppercase font-bold text-[#6B635B] tracking-wider m-0">Sacred Bird</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] m-0">
                {intel.supportStarShield.anchors.bird}
              </p>
            </div>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="text-[10.5px] uppercase font-bold text-[#6B635B] tracking-wider m-0">Sacred Animal</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] m-0">
                {intel.supportStarShield.anchors.animal}
              </p>
            </div>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="text-[10.5px] uppercase font-bold text-[#6B635B] tracking-wider m-0">Sacred Flora / Tree</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] m-0">
                {intel.supportStarShield.anchors.tree}
              </p>
            </div>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="text-[10.5px] uppercase font-bold text-[#6B635B] tracking-wider m-0">Sacred Symbol</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] m-0">
                {intel.supportStarShield.anchors.symbol}
              </p>
            </div>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="text-[10.5px] uppercase font-bold text-[#6B635B] tracking-wider m-0">Star Lord</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] m-0">
                {tp(intel.supportStarShield.nakshatra.lord)}
              </p>
            </div>
          </div>

          {/* Historical Example Callout */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderLeft: "4px solid #B8860B",
            }}
          >
            <p className="text-[13.5px] text-[#5C3D00] leading-[1.7] m-0">
              <strong>Classical Prototype:</strong> {intel.supportStarShield.historicalExample}
            </p>
          </div>
        </div>

        {/* Card 3: Birth Star Quality Profile (Your True Nature) */}
        <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
            <Compass className="w-5 h-5 text-[#B8860B]" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                Innate Behavioral Instinct
              </p>
              <h4 className="text-lg font-bold text-[#1A1A1A]">
                Quality Profile: {intel.qualityProfile.temperamentTitle}
              </h4>
            </div>
          </div>

          <p className="text-xs text-[#6B635B] leading-relaxed">
            Classical Principle: Rather than purely acting like the lord of your Janma Star ({intel.birthNakshatra.lord}), your foundational internal temperament actively channels the qualities of the <strong>preceding star&apos;s lord ({intel.qualityProfile.channellingLord})</strong>.
          </p>

          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderLeft: "4px solid #B8860B",
            }}
          >
            <p className="text-[14px] text-[#1A1A1A] leading-[1.75] m-0">
              {intel.qualityProfile.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wider font-bold text-[#6B635B] m-0">
              Core Temperament Markers
            </p>
            <div className="flex flex-wrap gap-2">
              {intel.qualityProfile.coreTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF8F5] border border-amber-900/15 text-[#1A1A1A] shadow-xs"
                >
                  ✓ {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive 3 Paryaya Chakra Section (Wheel & Grid) ── */}
      <section className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B8860B]" />
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                27-Nakshatra Navtara Chakra
              </p>
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mt-0.5">
              The Three Paryayas (Three Evolutionary Cycles)
            </h3>
          </div>

          {/* View Mode Toggle & Paryaya Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-amber-900/10">
              <button
                onClick={() => setViewMode("WHEEL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "WHEEL"
                    ? "bg-[#B8860B] text-white shadow-sm"
                    : "text-[#6B635B] hover:text-[#1A1A1A]"
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Radial Chakra Wheel</span>
              </button>
              <button
                onClick={() => setViewMode("GRID")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "GRID"
                    ? "bg-[#B8860B] text-white shadow-sm"
                    : "text-[#6B635B] hover:text-[#1A1A1A]"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Matrix Grid</span>
              </button>
            </div>

            {/* Paryaya Filter Tabs (shown when Grid is active) */}
            {viewMode === "GRID" && (
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-2xl border border-amber-900/10">
                <button
                  onClick={() => setActiveParyayaTab("ALL")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeParyayaTab === "ALL"
                      ? "bg-[#B8860B] text-white"
                      : "text-[#6B635B] hover:text-[#1A1A1A]"
                  }`}
                >
                  All 27
                </button>
                <button
                  onClick={() => setActiveParyayaTab("PRATHAMA")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeParyayaTab === "PRATHAMA"
                      ? "bg-[#B8860B] text-white"
                      : "text-[#6B635B] hover:text-[#1A1A1A]"
                  }`}
                >
                  P1 (1-9)
                </button>
                <button
                  onClick={() => setActiveParyayaTab("DVITIYA")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeParyayaTab === "DVITIYA"
                      ? "bg-[#B8860B] text-white"
                      : "text-[#6B635B] hover:text-[#1A1A1A]"
                  }`}
                >
                  P2 (10-18)
                </button>
                <button
                  onClick={() => setActiveParyayaTab("TRITIYA")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeParyayaTab === "TRITIYA"
                      ? "bg-[#B8860B] text-white"
                      : "text-[#6B635B] hover:text-[#1A1A1A]"
                  }`}
                >
                  P3 (19-27)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode 1: Interactive SVG Radial Chakra Wheel */}
        {viewMode === "WHEEL" ? (
          <NakshatraChakraWheel
            intel={intel}
            activeMD={activeMD}
            activeAD={activeAD}
            tp={tp}
            chart={chart}
          />
        ) : (
          /* View Mode 2: Matrix Grid Table */
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayedChakra.map((item) => {
                const isBirth = item.isBirthStar;
                const isSupport = item.isSupportStar;
                const isConcern = [3, 5, 7].includes(item.taraNum);
                const isSelected =
                  selectedChakraItem?.targetNakshatra.id === item.targetNakshatra.id;

                return (
                  <button
                    key={item.targetNakshatra.id}
                    onClick={() =>
                      setSelectedChakraItem((prev) =>
                        prev?.targetNakshatra.id === item.targetNakshatra.id ? null : item
                      )
                    }
                    className="text-left rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 transition-all relative overflow-hidden"
                    style={{
                      background: isSelected
                        ? "rgba(184, 134, 11, 0.12)"
                        : isConcern
                        ? "rgba(239, 68, 68, 0.03)"
                        : "#FFFFFF",
                      border: `1px solid ${
                        isSelected
                          ? "#B8860B"
                          : isConcern
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(184, 134, 11, 0.18)"
                      }`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6B635B]">
                        Pos #{item.countedPosition}
                      </span>
                      <div className="flex items-center gap-1">
                        {isBirth && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700">
                            JANMA
                          </span>
                        )}
                        {isSupport && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
                            27TH SHIELD
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.paryayaIntensity === "Peak"
                              ? "bg-purple-500/15 text-purple-700"
                              : item.paryayaIntensity === "Moderate"
                              ? "bg-amber-500/15 text-amber-700"
                              : "bg-slate-500/15 text-slate-700"
                          }`}
                        >
                          {item.paryayaIntensity}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] flex items-center justify-between">
                        <span>{item.targetNakshatra.name}</span>
                        <span className="text-xs font-semibold text-[#6B635B]">
                          {tp(item.targetNakshatra.lord)}
                        </span>
                      </p>
                      <p className="text-xs font-semibold text-[#B8860B] mt-0.5 flex items-center gap-1">
                        <span>{item.tara.icon}</span>
                        <span>
                          {item.tara.name} (Tara #{item.taraNum})
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B635B] pt-1.5 border-t border-amber-900/10">
                      <span>{item.targetNakshatra.tattva} Tattva</span>
                      <span className="italic">{item.tara.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Drawer for Clicked Star in Grid */}
            {selectedChakraItem && (
              <div className="rounded-2xl bg-[#FAF7F2] p-5 border border-amber-900/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <span>{selectedChakraItem.targetNakshatra.name} Nakshatra</span>
                    <span className="text-xs font-normal text-[#6B635B]">
                      (Counted Pos #{selectedChakraItem.countedPosition} · {selectedChakraItem.paryaya}{" "}
                      Paryaya)
                    </span>
                  </h4>
                  <button
                    onClick={() => setSelectedChakraItem(null)}
                    className="text-xs font-bold text-[#6B635B] hover:text-[#1A1A1A]"
                  >
                    Close ✕
                  </button>
                </div>
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  <strong>Tara Quality:</strong> {selectedChakraItem.tara.signification} —{" "}
                  {selectedChakraItem.tara.practicalAdvice}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#6B635B]">
                  <div>
                    Devta:{" "}
                    <strong className="text-[#1A1A1A]">
                      {selectedChakraItem.targetNakshatra.devta}
                    </strong>
                  </div>
                  <div>
                    Animal:{" "}
                    <strong className="text-[#1A1A1A]">
                      {selectedChakraItem.targetNakshatra.animal}
                    </strong>
                  </div>
                  <div>
                    Bird:{" "}
                    <strong className="text-[#1A1A1A]">
                      {selectedChakraItem.targetNakshatra.bird}
                    </strong>
                  </div>
                  <div>
                    Tree:{" "}
                    <strong className="text-[#1A1A1A]">
                      {selectedChakraItem.targetNakshatra.tree}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Active Dasha Nakshatra Karma & Sacred Upay Protocol ── */}
      {nakshatraDossier && (
        <section className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#B8860B]" />
                <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B]">
                  सक्रिय नक्षत्र आख्यान एवं मानवीय उपचार
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#875C06] font-bold">
                  {tp(nakshatraDossier.activeDashaPlanet)} महादशा ➔ {nakshatraDossier.activeNakshatraName} नक्षत्र
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-1" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                सक्रिय दशा नक्षत्र: मानसिक स्वरूप, कर्म-जाल एवं अचूक सात्विक साधना
              </h3>
              <p className="text-xs text-[#6B635B] mt-0.5">
                शास्त्रीय नियम: वर्तमान दशा स्वामी जिस नक्षत्र में स्थित होते हैं, उस नक्षत्र की आंतरिक तासीर ही इस समय आपके अंतर्मन, निर्णयों और कर्मों को चलाती है।
              </p>
            </div>

            {/* Actions: Copy & WhatsApp */}
            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <button
                onClick={() => {
                  const text = `✦ AstroLife सक्रिय नक्षत्र सात्विक साधना ✦\nजातक: ${chart.name || "Seeker"}\nसक्रिय दशा: ${tp(nakshatraDossier.activeDashaPlanet)} महादशा (${nakshatraDossier.activeNakshatraName} नक्षत्र)\n\n✦ स्वर्णिम नियम (Golden Rule): ${nakshatraDossier.goldenRule}\n✦ प्राथमिक उपाय: ${nakshatraDossier.primaryActionItem}\n✦ सहायक नियम: ${nakshatraDossier.secondaryActionItem}\n✦ पशु-पक्षी व प्रकृति सेवा: ${nakshatraDossier.naturePashuSeva}\n✦ शुभ समय व मुहूर्त: ${nakshatraDossier.timingAndMuhurat}\n✦ आवश्यक सामग्री: ${nakshatraDossier.materialsNeeded.join(", ")}\n\n✦ भाव-त्रिकोण पंचतत्व वाहन: ${nakshatraDossier.elementalVehicleTitle}\nविधि: ${nakshatraDossier.elementalVehicleProcedure}\n${nakshatraDossier.transitRemedy ? `\n✦ गोचर 27-शिवलिंग उपक्रम (#${nakshatraDossier.transitRemedy.transitNakshatraNumber}): ${nakshatraDossier.transitRemedy.shivlingRemedy.hindiTitle} — ${nakshatraDossier.transitRemedy.shivlingRemedy.procedureNarrativeHinglish}\n` : ""}विस्तृत कुंडली: https://astrolife-ai.vercel.app/dashboard/dasha`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                    setCopiedNakshatraRemedy(true);
                    setTimeout(() => setCopiedNakshatraRemedy(false), 2500);
                  }
                  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(waUrl, "_blank");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-amber-900/15 text-[#4A4238] hover:text-[#1A1A1A] hover:bg-white transition-all shadow-sm"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const text = `✦ AstroLife सक्रिय नक्षत्र सात्विक साधना ✦\nजातक: ${chart.name || "Seeker"}\nसक्रिय दशा: ${tp(nakshatraDossier.activeDashaPlanet)} महादशा (${nakshatraDossier.activeNakshatraName} नक्षत्र)\n\n✦ स्वर्णिम नियम (Golden Rule): ${nakshatraDossier.goldenRule}\n✦ प्राथमिक उपाय: ${nakshatraDossier.primaryActionItem}\n✦ सहायक नियम: ${nakshatraDossier.secondaryActionItem}\n✦ पशु-पक्षी व प्रकृति सेवा: ${nakshatraDossier.naturePashuSeva}\n✦ शुभ समय व मुहूर्त: ${nakshatraDossier.timingAndMuhurat}\n✦ आवश्यक सामग्री: ${nakshatraDossier.materialsNeeded.join(", ")}\n\n✦ भाव-त्रिकोण पंचतत्व वाहन: ${nakshatraDossier.elementalVehicleTitle}\nविधि: ${nakshatraDossier.elementalVehicleProcedure}\n${nakshatraDossier.transitRemedy ? `\n✦ गोचर 27-शिवलिंग उपक्रम (#${nakshatraDossier.transitRemedy.transitNakshatraNumber}): ${nakshatraDossier.transitRemedy.shivlingRemedy.hindiTitle} — ${nakshatraDossier.transitRemedy.shivlingRemedy.procedureNarrativeHinglish}\n` : ""}विस्तृत कुंडली: https://astrolife-ai.vercel.app/dashboard/dasha`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                    setCopiedNakshatraRemedy(true);
                    setTimeout(() => setCopiedNakshatraRemedy(false), 2500);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-amber-900/15 text-[#4A4238] hover:text-[#1A1A1A] transition-all shadow-sm"
              >
                {copiedNakshatraRemedy ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6B635B]" />
                    <span>साधना कॉपी करें</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Golden Rule Banner */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(254, 243, 199, 0.45) 100%)",
              border: "1px solid rgba(184, 134, 11, 0.35)",
              borderLeft: "4px solid #B8860B",
            }}
          >
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#875C06] uppercase tracking-wider m-0">
                  नक्षत्र का अखंड स्वर्णिम नियम (Golden Rule)
                </p>
                <p className="text-[14.5px] font-semibold text-[#1A1A1A] mt-1 leading-[1.65] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  &ldquo;{nakshatraDossier.goldenRule}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Sub Tabs Selector */}
          <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2 flex-wrap">
            {[
              { id: "NARRATIVE", label: "१. मानवीय कथा व मनोदशा", icon: BookOpen },
              { id: "CHECKLIST", label: "२. अचूक सात्विक उपाय व सेवा", icon: Shield },
              { id: "TRIKONA", label: "३. भाव-त्रिकोण पंचतत्व वाहन", icon: Activity },
              { id: "SHIVLING", label: "४. गोचर व 27 शिवलिंग उपक्रम", icon: Droplets },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRemedyTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRemedyTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#B8860B] text-white shadow-sm"
                      : "bg-[#FAF7F2] text-[#6B635B] hover:text-[#1A1A1A] hover:bg-white border border-amber-900/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: NARRATIVE (5-Section Human Story) */}
          {activeRemedyTab === "NARRATIVE" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column: Personality & Living Archetype */}
              <div className="flex flex-col gap-4">
                <div
                  style={{
                    padding: "18px 20px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-[#B8860B]" />
                    <p className="text-xs uppercase tracking-widest font-bold text-[#B8860B] m-0">
                      आंतरिक मनोदशा व वर्तमान स्वभाव
                    </p>
                  </div>
                  <p className="text-[14px] text-[#2A241F] leading-[1.8] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {nakshatraDossier.section1_InnerStateAndPersonality}
                  </p>
                </div>

                <div
                  style={{
                    padding: "18px 20px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Feather className="w-4 h-4 text-[#B8860B]" />
                    <p className="text-xs uppercase tracking-widest font-bold text-[#B8860B] m-0">
                      शास्त्रीय जीवंत स्वरूप (Living Archetype Story)
                    </p>
                  </div>
                  <p className="text-[14px] text-[#2A241F] leading-[1.8] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {nakshatraDossier.section2_LivingArchetypeStory}
                  </p>
                </div>
              </div>

              {/* Right Column: Karmic Trap & Conduct Guardrail */}
              <div className="flex flex-col gap-4">
                <div
                  style={{
                    padding: "18px 20px",
                    borderRadius: 14,
                    background: "rgba(239, 68, 68, 0.04)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    borderLeft: "4px solid #dc2626",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-xs uppercase tracking-widest font-bold text-red-700 m-0">
                      सावधानी: कार्मिक भूल व क्रोध-जाल (Karmic Trap)
                    </p>
                  </div>
                  <p className="text-[14px] text-[#2A241F] leading-[1.8] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {nakshatraDossier.section3_KarmicTrapAndAngerWarning}
                  </p>
                </div>

                <div
                  style={{
                    padding: "18px 20px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                    borderLeft: "4px solid #059669",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs uppercase tracking-widest font-bold text-emerald-800 m-0">
                      दैनिक जीवन में आचरण सुरक्षा नियम (Conduct Guardrail)
                    </p>
                  </div>
                  <p className="text-[14px] text-[#2A241F] leading-[1.8] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {nakshatraDossier.section4_BehavioralConductInDailyLife}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHECKLIST (Actionable Upay & Seva) */}
          {activeRemedyTab === "CHECKLIST" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary Upay */}
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  borderTop: "4px solid #B8860B",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#875C06]">
                    प्राथमिक अचूक उपाय
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-[#875C06] font-bold">
                    तीव्र फलदायी
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1A1A1A] leading-[1.7] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {nakshatraDossier.primaryActionItem}
                </p>
                <div className="pt-2 border-t border-amber-900/10 flex flex-col gap-1 text-xs text-[#6B635B]">
                  <div>
                    <strong>शुभ समय/मुहूर्त:</strong> {nakshatraDossier.timingAndMuhurat}
                  </div>
                  {nakshatraDossier.materialsNeeded.length > 0 && (
                    <div>
                      <strong>सामग्री:</strong> {nakshatraDossier.materialsNeeded.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Upay */}
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  borderTop: "4px solid #059669",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    सहायक सात्विक नियम
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-bold">
                    सतत स्थिरता
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1A1A1A] leading-[1.7] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {nakshatraDossier.secondaryActionItem}
                </p>
                <p className="text-xs text-[#6B635B] pt-2 border-t border-amber-900/10 m-0">
                  इस नियम का पालन करने से नक्षत्र की सकारात्मक रश्मियां शरीर के आभामंडल (Aura) को सुरक्षित रखती हैं।
                </p>
              </div>

              {/* Animal & Nature Seva */}
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  borderTop: "4px solid #2563eb",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                    पशु-पक्षी व प्रकृति सेवा
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 font-bold">
                    पुण्य संवर्धन
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1A1A1A] leading-[1.7] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {nakshatraDossier.naturePashuSeva}
                </p>
                <p className="text-xs text-[#6B635B] pt-2 border-t border-amber-900/10 m-0">
                  मूक प्राणियों की सेवा से पूर्वजन्म के ऋणानुबंधन शीघ्रता से कटते हैं।
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TRIKONA (House-Trikona Elemental Vehicle) */}
          {activeRemedyTab === "TRIKONA" && (
            <div
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.22)",
                borderLeft: "5px solid #B8860B",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#B8860B]" />
                  <h4 className="text-lg font-bold text-[#1A1A1A] m-0">
                    {nakshatraDossier.elementalVehicleTitle}
                  </h4>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-[#875C06] font-bold">
                  पंचतत्व भौतिक क्रिया (Physical Grounding Vehicle)
                </span>
              </div>

              <p className="text-[14px] text-[#2A241F] leading-[1.8] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {nakshatraDossier.elementalVehicleExplanation}
              </p>

              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "#FFFFFF",
                  border: "1px solid rgba(184, 134, 11, 0.2)",
                }}
              >
                <p className="text-xs uppercase tracking-wider font-bold text-[#875C06] mb-1.5">
                  ✦ शास्त्रीय व्यावहारिक क्रिया-विधि (Exact Daily Procedure):
                </p>
                <p className="text-[14px] text-[#1A1A1A] leading-[1.8] m-0 font-medium" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {nakshatraDossier.elementalVehicleProcedure}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SHIVLING (Transit Nakshatra & 27 Shivling Upacharas) */}
          {activeRemedyTab === "SHIVLING" && nakshatraDossier.transitRemedy && (
            <div className="flex flex-col gap-5">
              {/* Transit Context Banner */}
              <div
                style={{
                  padding: "18px 22px",
                  borderRadius: 14,
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#B8860B]" />
                    <span className="font-bold text-base text-[#1A1A1A]">
                      वर्तमान गोचर संरेखण (Transit Placement of {nakshatraDossier.transitRemedy.activeDashaLord})
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 font-bold">
                    तारा #{nakshatraDossier.transitRemedy.taraNumber} {nakshatraDossier.transitRemedy.taraName} ({nakshatraDossier.transitRemedy.taraRelationType})
                  </span>
                </div>

                <p className="text-xs text-[#6B635B] m-0">
                  वर्तमान में {nakshatraDossier.transitRemedy.activeDashaLord} ग्रह <strong>{nakshatraDossier.transitRemedy.transitSign}</strong> राशि में {nakshatraDossier.transitRemedy.transitDegree}° पर <strong>{nakshatraDossier.transitRemedy.transitNakshatra} नक्षत्र (#{nakshatraDossier.transitRemedy.transitNakshatraNumber})</strong> में संचरण कर रहे हैं। आपकी जन्म-राशि चंद्रमा से यह {nakshatraDossier.transitRemedy.taraExplanationHinglish}
                </p>

                {nakshatraDossier.transitRemedy.distanceAnalysis && (
                  <div className="text-xs text-[#5C3D00] pt-2 border-t border-amber-900/10">
                    <strong>महादशा व अंतर्दशा संबंध:</strong> {nakshatraDossier.transitRemedy.distanceAnalysis.mutualAxis} अक्ष — {nakshatraDossier.transitRemedy.distanceAnalysis.impactDescriptionHinglish}
                  </div>
                )}
              </div>

              {/* The Shivling Upachara Card */}
              <div
                style={{
                  padding: "20px 24px",
                  borderRadius: 16,
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  borderLeft: "5px solid #059669",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                      27-शिवलिंग उपक्रम विधान (उपक्रम #{nakshatraDossier.transitRemedy.shivlingRemedy.upacharaNumber})
                    </span>
                    <h4 className="text-xl font-bold text-[#1A1A1A] mt-0.5" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                      {nakshatraDossier.transitRemedy.shivlingRemedy.hindiTitle}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 font-bold">
                      अर्पण: {nakshatraDossier.transitRemedy.shivlingRemedy.itemOrOffering}
                    </span>
                  </div>
                </div>

                <p className="text-[14px] text-[#2A241F] leading-[1.8] m-0" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  <strong>शास्त्रीय रहस्य:</strong> {nakshatraDossier.transitRemedy.shivlingRemedy.significanceHinglish}
                </p>

                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    background: "#FFFFFF",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider font-bold text-emerald-800 mb-1">
                    ✦ शिवलिंग पर अर्पण की विधि (Exact Procedure):
                  </p>
                  <p className="text-[14px] text-[#1A1A1A] leading-[1.8] m-0 font-medium" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    {nakshatraDossier.transitRemedy.shivlingRemedy.procedureNarrativeHinglish}
                  </p>
                </div>
              </div>

              {/* 6th, 8th & 12th House Specific Wisdom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                  }}
                >
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">
                    🌱 ६ठे भाव का नियम (पौधे व अंधी निष्ठा / Blind Faith)
                  </p>
                  <p className="text-xs text-[#2A241F] leading-relaxed m-0">
                    {nakshatraDossier.transitRemedy.beliefGuidanceHinglish.house6MessageHinglish}
                  </p>
                  {nakshatraDossier.transitRemedy.house6PlantRemedies.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-900/10 text-xs text-[#6B635B]">
                      <strong>पौधा सेवा:</strong> {nakshatraDossier.transitRemedy.house6PlantRemedies.map((p) => `${p.planet}: ${p.plantName}`).join(", ")}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                  }}
                >
                  <p className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-1">
                    🌊 १२वें भाव का नियम (कठिन परीक्षा व त्याग / Parikshan)
                  </p>
                  <p className="text-xs text-[#2A241F] leading-relaxed m-0">
                    {nakshatraDossier.transitRemedy.beliefGuidanceHinglish.house12MessageHinglish}
                  </p>
                  {nakshatraDossier.transitRemedy.house12DonationRemedies.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-900/10 text-xs text-[#6B635B]">
                      <strong>गुप्त दान:</strong> {nakshatraDossier.transitRemedy.house12DonationRemedies.map((d) => `${d.planet}: ${d.targetCategory}`).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Optional: Afflicted Planets Drawer */}
          {nakshatraDossier.evaluatedPlanets.filter((p) => p.isProblemPlanet).length > 0 && (
            <div className="pt-2 border-t border-amber-900/10">
              <button
                onClick={() => setShowOtherProblemPlanets(!showOtherProblemPlanets)}
                className="w-full flex items-center justify-between text-left py-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-[#875C06]">
                    कुंडली के अन्य संवेदनशील ग्रह ({nakshatraDossier.evaluatedPlanets.filter((p) => p.isProblemPlanet).length} ग्रह ६/८/१२ या नीचस्थ भाव में)
                  </span>
                </div>
                {showOtherProblemPlanets ? (
                  <ChevronUp className="w-4 h-4 text-[#6B635B]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6B635B]" />
                )}
              </button>

              {showOtherProblemPlanets && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {nakshatraDossier.evaluatedPlanets
                    .filter((p) => p.isProblemPlanet)
                    .map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#FAF7F2] border border-amber-900/15 flex flex-col gap-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1A1A1A]">
                            {tp(p.planet)} in {p.nakshatra} (House {p.house}, {p.sign})
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-700 font-bold">
                            कष्ट निवारण
                          </span>
                        </div>
                        <p className="text-[#6B635B] m-0">{p.reasonForFocus}</p>
                        {p.nakshatraGuide && (
                          <p className="text-[#1A1A1A] m-0 pt-1 border-t border-amber-900/10">
                            <strong>उपाय:</strong> {p.nakshatraGuide.primaryRemedyHinglish}
                          </p>
                        )}
                        <p className="text-[#875C06] m-0 font-medium">
                          <strong>पंचतत्व वाहन:</strong> {p.houseTrikonaRule.actionTitleHinglish}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Two-Column Row: Transit Activation Windows & Tattva Remedies ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 5: Dasha Activation & Caution Windows */}
        <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
            <Sparkles className="w-5 h-5 text-[#B8860B]" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                Transit Trigger Engine
              </p>
              <h4 className="text-lg font-bold text-[#1A1A1A]">
                Activation & Caution Windows
              </h4>
            </div>
          </div>

          <p className="text-xs text-[#6B635B] leading-relaxed">
            Classical Transit Rule: When Sun (1 month) or Jupiter (1 year) transit into your active Dasha Lord&apos;s exaltation sign, peak activation manifests. Conversely, transiting the debilitation sign triggers caution phases.
          </p>

          <div className="flex flex-col gap-3.5">
            {activationWindows.map((win, idx) => {
              const isActivation = win.windowType === "ACTIVATION_WINDOW";
              return (
                <div
                  key={idx}
                  className="flex flex-col gap-2 transition-all"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: "#FAF8F5",
                    border: `1px solid ${
                      isActivation ? "rgba(16, 185, 129, 0.28)" : "rgba(239, 68, 68, 0.28)"
                    }`,
                    borderLeft: `4px solid ${isActivation ? "#059669" : "#dc2626"}`,
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isActivation ? "text-emerald-800" : "text-red-800"
                      }`}
                    >
                      {win.triggerPlanet} in {win.targetSign}
                    </span>
                    <span className="text-[11px] text-[#6B635B] font-medium bg-black/[0.04] px-2.5 py-0.5 rounded-full">
                      {win.expectedDuration}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-[#1A1A1A] leading-[1.7] m-0">
                    {win.strategicGuidance}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 6: Classical Rashi-Tattva Remedies */}
        {activeRemedy && (
          <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#B8860B]" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Rashi-Tattva Remedial Protocol
                  </p>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">
                    Tattva Vector: {activeRemedy.tattvaVector.sanskritName}
                  </h4>
                </div>
              </div>

              {/* Share & Copy Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const text = `✦ AstroLife Navtara Remedial Protocol ✦\nNative: ${chart.name || "Seeker"} · Janma: ${intel.birthNakshatra.name} (Pada ${intel.birthPada})\nActive Dasha: ${tp(audit?.activeMahadasha ?? activeRemedy.planet)} Mahadasha\nTattva Vector: ${activeRemedy.tattvaVector.sanskritName} (${activeRemedy.tattva})\nElemental Action: ${activeRemedy.tattvaVector.elementalAction}\nDirective: ${activeRemedy.harmonizationGuidance}\n${activeRemedy.specificPrescription ? `Prescription: ${activeRemedy.specificPrescription.substances.join(", ")} (${activeRemedy.specificPrescription.timingAndVessel})\n` : ""}27th Support Shield: ${intel.supportStarShield.nakshatra.name} (${intel.supportStarShield.anchors.devta})\nExplore: https://astrolife-ai.vercel.app/dashboard/dasha`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text);
                      setCopiedRemedy(true);
                      setTimeout(() => setCopiedRemedy(false), 2500);
                    }
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    window.open(waUrl, "_blank");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-amber-900/15 text-[#4A4238] hover:text-[#1A1A1A] hover:bg-white transition-all shadow-sm"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const text = `✦ AstroLife Navtara Remedial Protocol ✦\nNative: ${chart.name || "Seeker"} · Janma: ${intel.birthNakshatra.name} (Pada ${intel.birthPada})\nActive Dasha: ${tp(audit?.activeMahadasha ?? activeRemedy.planet)} Mahadasha\nTattva Vector: ${activeRemedy.tattvaVector.sanskritName} (${activeRemedy.tattva})\nElemental Action: ${activeRemedy.tattvaVector.elementalAction}\nDirective: ${activeRemedy.harmonizationGuidance}\n${activeRemedy.specificPrescription ? `Prescription: ${activeRemedy.specificPrescription.substances.join(", ")} (${activeRemedy.specificPrescription.timingAndVessel})\n` : ""}27th Support Shield: ${intel.supportStarShield.nakshatra.name} (${intel.supportStarShield.anchors.devta})\nExplore: https://astrolife-ai.vercel.app/dashboard/dasha`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text);
                      setCopiedRemedy(true);
                      setTimeout(() => setCopiedRemedy(false), 2500);
                    }
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-amber-900/15 text-[#4A4238] hover:text-[#1A1A1A] transition-all shadow-sm"
                  title="Copy protocol text"
                >
                  {copiedRemedy ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#6B635B]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#6B635B] leading-relaxed">
              Shastric Directive: Remedy elemental vehicle is determined by the <strong>RASHI</strong> where the planet sits (not the house number). Life domain of pressure is dictated by the House.
            </p>

            {/* Placement context */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.18)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p className="font-semibold text-xs text-[#1A1A1A] m-0">
                Planet Placement: {activeRemedy.planet} in {activeRemedy.rashi} (Sign #{activeRemedy.rashiNum + 1})
              </p>
              <p className="text-xs text-[#6B635B] m-0 leading-relaxed">{activeRemedy.domainSignificance}</p>
            </div>

            {/* Directive */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: 14,
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.22)",
                borderLeft: "4px solid #B8860B",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <p className="text-xs font-bold text-[#8C6D1F] uppercase tracking-wide m-0">
                Elemental Action: {activeRemedy.tattvaVector.elementalAction}
              </p>
              <p className="text-[13.5px] text-[#2A241F] leading-[1.7] m-0 font-medium">
                {activeRemedy.harmonizationGuidance}
              </p>
            </div>

            {/* Specific Traditional Prescription */}
            {activeRemedy.specificPrescription && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 14,
                  background: "#FAF8F5",
                  border: "1px solid rgba(184, 134, 11, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#B8860B] m-0">
                  Specific Traditional Recipe ({activeRemedy.planet})
                </p>
                <ul className="text-[13px] text-[#1A1A1A] flex flex-col gap-1.5 list-disc list-inside leading-relaxed m-0">
                  {activeRemedy.specificPrescription.substances.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
                <p className="text-xs text-[#6B635B] italic pt-2 border-t border-amber-900/10 m-0">
                  Timing: {activeRemedy.specificPrescription.timingAndVessel}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Transparent Rule Trace Inspector ── */}
      <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
        <button
          onClick={() => setShowRuleTraces(!showRuleTraces)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B8860B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">
              Deterministic Rule Trace & Provenance ({intel.ruleTraces.length} Active Rules)
            </span>
          </div>
          {showRuleTraces ? (
            <ChevronUp className="w-4 h-4 text-[#6B635B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6B635B]" />
          )}
        </button>

        {showRuleTraces && (
          <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-amber-900/10">
            {intel.ruleTraces.map((trace, idx) => (
              <div
                key={idx}
                className="rounded-xl p-3 bg-[#FAF7F2] border border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#B8860B]">{trace.ruleId}</span>
                    <span className="font-bold text-[#1A1A1A]">{trace.title}</span>
                  </div>
                  <p className="text-[#6B635B]">{trace.evidence}</p>
                </div>
                <div className="sm:text-right flex-shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      trace.basis === "DETERMINISTIC"
                        ? "bg-blue-500/15 text-blue-700"
                        : "bg-amber-500/15 text-amber-700"
                    }`}
                  >
                    {trace.basis}
                  </span>
                  <p className="text-[10px] text-[#6B635B] mt-0.5">{trace.sourceCitation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
