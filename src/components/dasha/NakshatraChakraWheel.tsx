"use client";

import React, { useState, useMemo } from "react";
import type { NavtaraMatrixItem, FullNavtaraIntelligence } from "@/lib/astro-engine/navtara-engine";
import type { DashaLord } from "@/lib/astro-engine/dasha";
import { Shield, Sparkles, Feather, AlertCircle, CheckCircle, Info } from "lucide-react";

interface NakshatraChakraWheelProps {
  intel: FullNavtaraIntelligence;
  activeMD?: DashaLord;
  activeAD?: DashaLord;
  tp: (name: string) => string;
}

export function NakshatraChakraWheel({
  intel,
  activeMD,
  activeAD,
  tp,
}: NakshatraChakraWheelProps) {
  const [selectedPos, setSelectedPos] = useState<number>(1); // Default to Janma Star (pos 1)
  const [hoveredPos, setHoveredPos] = useState<number | null>(null);

  const activePos = hoveredPos ?? selectedPos;

  // Map of counted position -> item
  const itemByPos = useMemo(() => {
    const map = new Map<number, NavtaraMatrixItem>();
    intel.chakra27.forEach((item) => {
      map.set(item.countedPosition, item);
    });
    return map;
  }, [intel.chakra27]);

  // Identify positions of Active MD and AD Nakshatras if available
  const mdNakId = intel.dashaAudit?.layers.find((l) => l.level === "MD_PLANET")?.nakshatra.id;
  const adNakId = intel.dashaAudit?.layers.find((l) => l.level === "AD_PLANET")?.nakshatra.id;

  const mdPos = useMemo(() => {
    if (!mdNakId) return null;
    return intel.chakra27.find((item) => item.targetNakshatra.id === mdNakId)?.countedPosition ?? null;
  }, [intel.chakra27, mdNakId]);

  const adPos = useMemo(() => {
    if (!adNakId) return null;
    return intel.chakra27.find((item) => item.targetNakshatra.id === adNakId)?.countedPosition ?? null;
  }, [intel.chakra27, adNakId]);

  const currentDisplayItem = itemByPos.get(activePos) ?? intel.chakra27[0];

  // SVG Geometry constants
  const size = 640;
  const center = size / 2;
  const hubRadius = 100;
  const rParyaya = 142;
  const rTara = 205;
  const rOuter = 295;

  const totalSlices = 27;
  const sliceAngle = 360 / totalSlices; // 13.333333°

  // Helper to calculate polar coordinates (clockwise from top 12 o'clock)
  const getCoordinates = (radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    };
  };

  // Build SVG path for an annular sector between r1 and r2
  const describeWedge = (r1: number, r2: number, startAngle: number, endAngle: number) => {
    const p1 = getCoordinates(r2, startAngle);
    const p2 = getCoordinates(r2, endAngle);
    const p3 = getCoordinates(r1, endAngle);
    const p4 = getCoordinates(r1, startAngle);

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return `
      M ${p1.x} ${p1.y}
      A ${r2} ${r2} 0 ${largeArc} 1 ${p2.x} ${p2.y}
      L ${p3.x} ${p3.y}
      A ${r1} ${r1} 0 ${largeArc} 0 ${p4.x} ${p4.y}
      Z
    `;
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-8 py-2">
      {/* ── 27-Spoke Radial SVG Wheel ── */}
      <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#FAF7F2" />
              <stop offset="100%" stopColor="#EFE8DD" />
            </radialGradient>
          </defs>

          {/* Background Outer Ring Guide */}
          <circle
            cx={center}
            cy={center}
            r={rOuter + 3}
            fill="none"
            stroke="rgba(184, 134, 11, 0.2)"
            strokeWidth="1.5"
          />

          {/* Render 27 Radial Slices */}
          {Array.from({ length: totalSlices }).map((_, idx) => {
            const pos = idx + 1; // 1 to 27
            const item = itemByPos.get(pos);
            if (!item) return null;

            const startAngle = idx * sliceAngle;
            const endAngle = (idx + 1) * sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;

            const isJanma = pos === 1;
            const is27th = pos === 27;
            const isMD = pos === mdPos;
            const isAD = pos === adPos;
            const isSelected = pos === activePos;
            const isConcern = [3, 5, 7].includes(item.taraNum);

            // Sector Color Palette
            let fillColor = "#FAF7F2";
            let strokeColor = "rgba(184, 134, 11, 0.25)";
            let strokeWidth = "1";

            if (isJanma) {
              fillColor = isSelected ? "#FDE68A" : "rgba(245, 158, 11, 0.22)";
              strokeColor = "#D97706";
              strokeWidth = "2.5";
            } else if (is27th) {
              fillColor = isSelected ? "#A7F3D0" : "rgba(16, 185, 129, 0.22)";
              strokeColor = "#059669";
              strokeWidth = "2.5";
            } else if (isMD) {
              fillColor = isSelected ? "#FED7AA" : "rgba(249, 115, 22, 0.22)";
              strokeColor = "#EA580C";
              strokeWidth = "2.5";
            } else if (isConcern) {
              fillColor = isSelected ? "#FECACA" : "rgba(239, 68, 68, 0.08)";
              strokeColor = isSelected ? "#DC2626" : "rgba(239, 68, 68, 0.35)";
              strokeWidth = isSelected ? "2" : "1";
            } else {
              // Supportive Tara (2, 4, 6, 8, 9)
              fillColor = isSelected ? "#D1FAE5" : "rgba(16, 185, 129, 0.07)";
              strokeColor = isSelected ? "#059669" : "rgba(16, 185, 129, 0.3)";
              strokeWidth = isSelected ? "2" : "1";
            }

            // Radial coordinates for text labels
            const outerLabelCoord = getCoordinates(250, midAngle);
            const taraLabelCoord = getCoordinates(175, midAngle);
            const posBadgeCoord = getCoordinates(120, midAngle);

            // Angle for text rotation (so text stays readable along radius)
            let rotAngle = midAngle - 90;
            if (midAngle > 90 && midAngle < 270) {
              rotAngle += 180;
            }

            return (
              <g
                key={pos}
                className="cursor-pointer transition-all duration-150"
                onClick={() => setSelectedPos(pos)}
                onMouseEnter={() => setHoveredPos(pos)}
                onMouseLeave={() => setHoveredPos(null)}
              >
                {/* Outer Sector Wedge */}
                <path
                  d={describeWedge(hubRadius, rOuter, startAngle, endAngle)}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={isJanma ? "url(#goldGlow)" : is27th ? "url(#shieldGlow)" : undefined}
                />

                {/* Concentric boundary between Tara Ring and Nakshatra Ring */}
                <path
                  d={describeWedge(rTara, rTara + 0.5, startAngle, endAngle)}
                  fill="none"
                  stroke="rgba(184, 134, 11, 0.15)"
                  strokeWidth="1"
                />

                {/* Concentric boundary between Paryaya and Tara Ring */}
                <path
                  d={describeWedge(rParyaya, rParyaya + 0.5, startAngle, endAngle)}
                  fill="none"
                  stroke="rgba(184, 134, 11, 0.12)"
                  strokeWidth="1"
                />

                {/* Inner Pos Label (1-27) */}
                <text
                  x={posBadgeCoord.x}
                  y={posBadgeCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9.5"
                  fontWeight={isSelected || isJanma || is27th ? "bold" : "600"}
                  fill={isJanma ? "#B45309" : is27th ? "#047857" : isConcern ? "#B91C1C" : "#4A453F"}
                >
                  {pos}
                </text>

                {/* Middle Tara Number & Icon */}
                <text
                  x={taraLabelCoord.x}
                  y={taraLabelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isConcern ? "#DC2626" : isJanma ? "#B45309" : "#059669"}
                  transform={`rotate(${rotAngle}, ${taraLabelCoord.x}, ${taraLabelCoord.y})`}
                >
                  {item.tara.icon} T{item.taraNum}
                </text>

                {/* Outer Nakshatra Name (abbreviated or fitted) */}
                <text
                  x={outerLabelCoord.x}
                  y={outerLabelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight={isSelected || isJanma || is27th ? "bold" : "600"}
                  fill={isJanma ? "#92400E" : is27th ? "#065F46" : "#1A1A1A"}
                  transform={`rotate(${rotAngle}, ${outerLabelCoord.x}, ${outerLabelCoord.y})`}
                >
                  {item.targetNakshatra.name.length > 9
                    ? `${item.targetNakshatra.name.slice(0, 8)}.`
                    : item.targetNakshatra.name}
                </text>

                {/* Special Badges: Janma ☉, 27th 🛡️, MD ⚡ */}
                {isJanma && (
                  <circle
                    cx={getCoordinates(rOuter + 8, midAngle).x}
                    cy={getCoordinates(rOuter + 8, midAngle).y}
                    r="4"
                    fill="#D97706"
                  />
                )}
                {is27th && (
                  <circle
                    cx={getCoordinates(rOuter + 8, midAngle).x}
                    cy={getCoordinates(rOuter + 8, midAngle).y}
                    r="4"
                    fill="#059669"
                  />
                )}
                {isMD && !isJanma && !is27th && (
                  <circle
                    cx={getCoordinates(rOuter + 8, midAngle).x}
                    cy={getCoordinates(rOuter + 8, midAngle).y}
                    r="4"
                    fill="#EA580C"
                  />
                )}
              </g>
            );
          })}

          {/* ── Central Hub Medallion ── */}
          <circle
            cx={center}
            cy={center}
            r={hubRadius}
            fill="url(#hubGradient)"
            stroke="#B8860B"
            strokeWidth="2.5"
            className="filter drop-shadow-md"
          />

          {/* Central Hub Content */}
          <g className="pointer-events-none text-center">
            {/* Crown Tag */}
            <text
              x={center}
              y={center - 54}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="1.5"
              fontWeight="bold"
              fill="#B8860B"
            >
              {currentDisplayItem.isBirthStar
                ? "★ JANMA NAKSHATRA ★"
                : currentDisplayItem.isSupportStar
                ? "🛡️ 27TH SHIELD STAR"
                : `POSITION #${currentDisplayItem.countedPosition} · ${currentDisplayItem.paryaya.toUpperCase()}`}
            </text>

            {/* Star Name */}
            <text
              x={center}
              y={center - 24}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#1A1A1A"
            >
              {currentDisplayItem.targetNakshatra.name}
            </text>

            {/* Star Lord & Tara */}
            <text
              x={center}
              y={center - 3}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#6B635B"
            >
              Lord: {tp(currentDisplayItem.targetNakshatra.lord)} · #{currentDisplayItem.targetNakshatra.id}
            </text>

            {/* Tara Badge */}
            <text
              x={center}
              y={center + 20}
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fill={
                [3, 5, 7].includes(currentDisplayItem.taraNum)
                  ? "#DC2626"
                  : currentDisplayItem.isBirthStar
                  ? "#D97706"
                  : "#059669"
              }
            >
              {currentDisplayItem.tara.icon} {currentDisplayItem.tara.name} (#{currentDisplayItem.taraNum})
            </text>

            {/* Devta info */}
            <text
              x={center}
              y={center + 40}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="#6B635B"
            >
              Devta: {currentDisplayItem.targetNakshatra.devta}
            </text>

            <text
              x={center}
              y={center + 58}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#B8860B"
            >
              Intensity: {currentDisplayItem.paryayaIntensity}
            </text>
          </g>
        </svg>

        {/* Pulsing indicator for active Dasha lord if visible */}
        {mdPos && (
          <div
            className="absolute pointer-events-none text-[10px] font-bold text-amber-700 bg-amber-100/90 border border-amber-500 px-2 py-0.5 rounded-full shadow-sm"
            style={{ bottom: 8 }}
          >
            ⚡ Active MD: {tp(activeMD ?? "Planet")} (Pos #{mdPos})
          </div>
        )}
      </div>

      {/* ── Side Details Drawer for Clicked / Hovered Star ── */}
      <div className="w-full xl:max-w-md flex flex-col gap-4">
        {/* Active Star Spotlight Card */}
        <div
          className="rounded-3xl p-5 border flex flex-col gap-3.5 transition-all shadow-sm"
          style={{
            background: [3, 5, 7].includes(currentDisplayItem.taraNum)
              ? "rgba(239, 68, 68, 0.03)"
              : "#FFFFFF",
            borderColor: [3, 5, 7].includes(currentDisplayItem.taraNum)
              ? "rgba(239, 68, 68, 0.3)"
              : "rgba(184, 134, 11, 0.25)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-amber-900/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B]">
                  Counted Position #{currentDisplayItem.countedPosition} of 27
                </span>
                {currentDisplayItem.isBirthStar && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#B8860B]">
                    JANMA STAR
                  </span>
                )}
                {currentDisplayItem.isSupportStar && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800">
                    27TH SHIELD
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mt-0.5 flex items-center gap-2">
                <span>{currentDisplayItem.targetNakshatra.name}</span>
                <span className="text-sm font-normal text-[#6B635B]">
                  ({currentDisplayItem.targetNakshatra.rashiSpan})
                </span>
              </h3>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                [3, 5, 7].includes(currentDisplayItem.taraNum)
                  ? "bg-red-500/15 text-red-700 border border-red-500/30"
                  : currentDisplayItem.isBirthStar
                  ? "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
              }`}
            >
              <span>{currentDisplayItem.tara.icon}</span>
              <span>
                {currentDisplayItem.tara.name} (T{currentDisplayItem.taraNum})
              </span>
            </div>
          </div>

          {/* Tara Practical Advice Banner */}
          <div className="rounded-2xl p-3.5 bg-[#FAF7F2] border border-amber-900/10">
            <p className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <span>✦</span>
              <span>Signification: {currentDisplayItem.tara.signification}</span>
            </p>
            <p className="text-xs text-[#5C3D00] mt-1 leading-relaxed">
              <strong>Practical Guidance:</strong> {currentDisplayItem.tara.practicalAdvice}
            </p>
          </div>

          {/* 6 Astrological Anchors Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <span className="text-[10px] uppercase font-bold text-[#6B635B]">Devta</span>
              <p className="font-bold text-[#1A1A1A] mt-0.5">
                {currentDisplayItem.targetNakshatra.devta}
              </p>
              <p className="text-[10px] text-[#6B635B] mt-0.5 line-clamp-1">
                {currentDisplayItem.targetNakshatra.devtaDescription}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <span className="text-[10px] uppercase font-bold text-[#6B635B]">Star Lord</span>
              <p className="font-bold text-[#1A1A1A] mt-0.5">
                {tp(currentDisplayItem.targetNakshatra.lord)}
              </p>
              <p className="text-[10px] text-[#6B635B] mt-0.5">
                Star #{currentDisplayItem.targetNakshatra.id}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <span className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Flora</span>
              <p className="font-bold text-[#1A1A1A] mt-0.5 line-clamp-1">
                {currentDisplayItem.targetNakshatra.tree}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <span className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Fauna</span>
              <p className="font-bold text-[#1A1A1A] mt-0.5 line-clamp-1">
                {currentDisplayItem.targetNakshatra.animal} / {currentDisplayItem.targetNakshatra.bird}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <span className="text-[10px] uppercase font-bold text-[#6B635B]">Symbol</span>
              <p className="font-bold text-[#1A1A1A] mt-0.5 line-clamp-1">
                {currentDisplayItem.targetNakshatra.symbol}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
              <span className="text-[10px] uppercase font-bold text-[#6B635B]">Tattva &amp; Cycle</span>
              <p className="font-bold text-[#1A1A1A] mt-0.5">
                {currentDisplayItem.targetNakshatra.tattva} · {currentDisplayItem.paryaya}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Legend Guide */}
        <div className="rounded-2xl border border-amber-900/10 bg-[#FAF7F2] p-3.5 flex flex-col gap-2 text-xs">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#6B635B]">
            Interactive Chakra Legend
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4A453F]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span>Janma Star (Pos 1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span>27th Shield (Pos 27)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0" />
              <span>Active Dasha Star</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Supportive (2,4,6,8,9)</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span>Concern Stars (3 Vipat, 5 Pratyari, 7 Vadha)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
