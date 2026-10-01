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
} from "lucide-react";

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

  // Compute Full Navtara Intelligence reactively based on chosen Ayanamsa
  const intel: FullNavtaraIntelligence = useMemo(() => {
    return runNavtaraIntelligence(chart, selectedAyanamsa);
  }, [chart, selectedAyanamsa]);

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
          <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-amber-900/10">
            <p className="text-sm text-[#1A1A1A] leading-relaxed font-medium">
              {audit.patternDescription}
            </p>
          </div>

          {/* The 3 Qualifying Layers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {audit.layers.map((layer, idx) => {
              const isDanger = layer.isConcern;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-4 flex flex-col gap-2 transition-all"
                  style={{
                    background: isDanger ? "rgba(239, 68, 68, 0.05)" : "#FFFFFF",
                    border: `1px solid ${
                      isDanger ? "rgba(239, 68, 68, 0.25)" : "rgba(184, 134, 11, 0.2)"
                    }`,
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
                    <p className="text-xs text-[#6B635B] font-medium">{layer.label}</p>
                    <p className="text-base font-bold text-[#1A1A1A] mt-0.5 flex items-center gap-1.5">
                      <span>{tp(layer.planet)}</span>
                      <span className="text-sm font-semibold text-[#B8860B]">
                        in {layer.nakshatra.name}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl">{layer.tara.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">
                        Tara #{layer.tara.taraNum} — {layer.tara.name}
                      </p>
                      <p className="text-[11px] text-[#6B635B]">
                        Pos #{layer.countedPosition} · {layer.paryaya} ({layer.paryayaIntensity})
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#4A453F] mt-1 border-t border-amber-900/10 pt-2 italic">
                    {layer.tara.practicalAdvice}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Antardasha Active Modifier */}
          {audit.antardashaModifier && (
            <div className="rounded-2xl border border-blue-500/25 bg-blue-50/50 p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Antardasha Phase Modifier · {audit.antardashaModifier.status}
                </p>
                <p className="text-xs text-[#1A1A1A] mt-1 leading-relaxed">
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

          {/* 5 Physical & Spiritual Anchors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <p className="text-[10px] uppercase font-bold text-[#6B635B]">Devta</p>
              <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                {intel.supportStarShield.anchors.devta}
              </p>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <p className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Bird</p>
              <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                {intel.supportStarShield.anchors.bird}
              </p>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <p className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Animal</p>
              <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                {intel.supportStarShield.anchors.animal}
              </p>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <p className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Flora / Tree</p>
              <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                {intel.supportStarShield.anchors.tree}
              </p>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <p className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Symbol</p>
              <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                {intel.supportStarShield.anchors.symbol}
              </p>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <p className="text-[10px] uppercase font-bold text-[#6B635B]">Star Lord</p>
              <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                {tp(intel.supportStarShield.nakshatra.lord)}
              </p>
            </div>
          </div>

          {/* Historical Example Callout */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3.5">
            <p className="text-xs text-[#5C3D00] leading-relaxed">
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
            Transcript Principle: Rather than purely acting like the lord of your Janma Star ({intel.birthNakshatra.lord}), your foundational internal temperament actively channels the qualities of the <strong>preceding star&apos;s lord ({intel.qualityProfile.channellingLord})</strong>.
          </p>

          <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-amber-900/10">
            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              {intel.qualityProfile.description}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-[#6B635B] mb-2">
              Core Temperament Markers
            </p>
            <div className="flex flex-wrap gap-2">
              {intel.qualityProfile.coreTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-amber-900/15 text-[#1A1A1A]"
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
            Transcript Transit Rule: When Sun (1 month) or Jupiter (1 year) transit into your active Dasha Lord&apos;s exaltation sign, peak activation manifests. Conversely, transiting the debilitation sign triggers caution phases.
          </p>

          <div className="flex flex-col gap-3">
            {activationWindows.map((win, idx) => {
              const isActivation = win.windowType === "ACTIVATION_WINDOW";
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-3.5 border flex flex-col gap-1.5"
                  style={{
                    background: isActivation ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)",
                    borderColor: isActivation ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)",
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isActivation ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {win.triggerPlanet} in {win.targetSign}
                    </span>
                    <span className="text-[10px] text-[#6B635B] font-medium">
                      {win.expectedDuration}
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1A] leading-relaxed">
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
              Transcript Directive: Remedy elemental vehicle is determined by the <strong>RASHI</strong> where the planet sits (not the house number). Life domain of pressure is dictated by the House.
            </p>

            {/* Placement context */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-amber-900/10 flex flex-col gap-1 text-xs">
              <p className="font-semibold text-[#1A1A1A]">
                Planet Placement: {activeRemedy.planet} in {activeRemedy.rashi} (Sign #{activeRemedy.rashiNum + 1})
              </p>
              <p className="text-[#6B635B]">{activeRemedy.domainSignificance}</p>
            </div>

            {/* Directive */}
            <div className="rounded-2xl p-3.5 bg-amber-500/10 border border-amber-500/25 flex flex-col gap-1">
              <p className="text-xs font-bold text-[#5C3D00]">
                Elemental Action: {activeRemedy.tattvaVector.elementalAction}
              </p>
              <p className="text-xs text-[#5C3D00] leading-relaxed">
                {activeRemedy.harmonizationGuidance}
              </p>
            </div>

            {/* Specific Traditional Prescription */}
            {activeRemedy.specificPrescription && (
              <div className="rounded-2xl border border-amber-900/15 p-3.5 flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">
                  Specific Traditional Recipe ({activeRemedy.planet})
                </p>
                <ul className="text-xs text-[#1A1A1A] flex flex-col gap-1 list-disc list-inside">
                  {activeRemedy.specificPrescription.substances.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
                <p className="text-xs text-[#6B635B] italic pt-1 border-t border-amber-900/10">
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
