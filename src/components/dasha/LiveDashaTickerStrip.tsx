"use client";

import { useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  getMahadashas,
  getAntardashas,
  getNakshatraFromLongitude,
  LORD_COLOR,
  LORD_ICON,
  formatDashaDate,
  formatDaysRemaining,
  type DashaPeriod,
  type DashaLord,
} from "@/lib/astro-engine/dasha";

const LORD_HINDI: Record<DashaLord, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

interface LiveDashaTickerStripProps {
  chart: ChartData;
  onSelectPeriod?: (period: DashaPeriod) => void;
  onOpenExplorer?: () => void;
  className?: string;
}

export function LiveDashaTickerStrip({
  chart,
  onSelectPeriod,
  onOpenExplorer,
  className = "",
}: LiveDashaTickerStripProps) {
  const dashaData = useMemo(() => {
    if (!chart?.planets?.Moon) return null;
    const moonLon = (chart.planets.Moon as { lon?: number; longitude?: number }).lon ?? 
                    (chart.planets.Moon as { lon?: number; longitude?: number }).longitude ?? 0;
    const nak = getNakshatraFromLongitude(moonLon);
    const birthDate = new Date(`${chart.dob}T${chart.tob}`);
    const mahadashas = getMahadashas(birthDate, nak);
    const activeMD = mahadashas.find((p) => p.isActive) ?? mahadashas[0];
    const antardashas = activeMD ? getAntardashas(activeMD) : [];
    const activeAD = antardashas.find((p) => p.isActive) ?? antardashas[0];

    // Combine MD list and current AD list for a rich continuous live stream
    const items: Array<{
      id: string;
      period: DashaPeriod;
      tag: string;
      label: string;
      hindiLabel: string;
      isActive: boolean;
      color: string;
      icon: string;
    }> = [];

    // Add active MD prominently
    if (activeMD) {
      items.push({
        id: `md-${activeMD.lord}`,
        period: activeMD,
        tag: "सक्रिय महादशा",
        label: `${activeMD.lord} MD`,
        hindiLabel: `${LORD_HINDI[activeMD.lord]} महादशा`,
        isActive: true,
        color: LORD_COLOR[activeMD.lord],
        icon: LORD_ICON[activeMD.lord],
      });
    }

    // Add active AD prominently
    if (activeAD) {
      items.push({
        id: `ad-${activeAD.lord}`,
        period: activeAD,
        tag: "सक्रिय अंतर्दशा",
        label: `${activeAD.lord} AD`,
        hindiLabel: `${LORD_HINDI[activeAD.lord]} अंतर्दशा`,
        isActive: true,
        color: LORD_COLOR[activeAD.lord],
        icon: LORD_ICON[activeAD.lord],
      });
    }

    // Add remaining Antardashas of current MD
    antardashas.forEach((ad) => {
      if (ad.lord === activeAD?.lord) return;
      items.push({
        id: `ad-${ad.lord}`,
        period: ad,
        tag: ad.progressPercent >= 100 ? "व्यतीत" : "आगामी AD",
        label: `${ad.lord} AD`,
        hindiLabel: `${LORD_HINDI[ad.lord]} अंतर्दशा`,
        isActive: false,
        color: LORD_COLOR[ad.lord],
        icon: LORD_ICON[ad.lord],
      });
    });

    // Add upcoming Mahadashas
    mahadashas.forEach((md) => {
      if (md.lord === activeMD?.lord) return;
      items.push({
        id: `md-${md.lord}`,
        period: md,
        tag: md.progressPercent >= 100 ? "व्यतीत MD" : "आगामी MD",
        label: `${md.lord} MD`,
        hindiLabel: `${LORD_HINDI[md.lord]} महादशा`,
        isActive: false,
        color: LORD_COLOR[md.lord],
        icon: LORD_ICON[md.lord],
      });
    });

    return { activeMD, activeAD, items };
  }, [chart]);

  if (!dashaData || dashaData.items.length === 0) return null;

  const { activeMD, activeAD, items } = dashaData;

  // Duplicate items for seamless continuous looping ticker
  const tickerItems = [...items, ...items];

  return (
    <div
      className={`rounded-2xl p-4 bg-white border border-[rgba(184,134,11,0.22)] shadow-sm overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
      }}
    >
      {/* ── Top Header Row ── */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⏳</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B8860B] bg-[rgba(184,134,11,0.12)] px-2 py-0.5 rounded-full border border-[rgba(184,134,11,0.25)]">
                Live Dasha Stream · लाइव दशा संचरण
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Active Cycle</span>
              </span>
            </div>
            <p className="text-xs text-[#4A4238] mt-0.5 font-medium">
              वर्तमान: <strong style={{ color: LORD_COLOR[activeMD.lord] }}>{LORD_HINDI[activeMD.lord]} महादशा</strong>
              {activeAD && (
                <> · <strong style={{ color: LORD_COLOR[activeAD.lord] }}>{LORD_HINDI[activeAD.lord]} अंतर्दशा</strong> ({formatDaysRemaining(activeAD.daysRemaining)})</>
              )}
            </p>
          </div>
        </div>

        {onOpenExplorer && (
          <button
            type="button"
            onClick={onOpenExplorer}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[rgba(184,134,11,0.35)] bg-white text-[#B8860B] hover:bg-[#FAF5EB] transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>संपूर्ण 5-स्तरीय दशा</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* ── Slow-Scrolling Ticker Window ── */}
      <div
        className="relative overflow-hidden w-full py-1"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div className="dasha-ticker-track flex items-center gap-2.5">
          {tickerItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => onSelectPeriod?.(item.period)}
              className={`shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${
                item.isActive
                  ? "bg-white border-2 shadow-sm"
                  : "bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)] hover:border-[rgba(184,134,11,0.4)] hover:bg-white"
              }`}
              style={{
                borderColor: item.isActive ? item.color : undefined,
                boxShadow: item.isActive ? `0 2px 10px ${item.color}25` : undefined,
              }}
              title="Click to view details in 5-level dasha hierarchy"
            >
              <span className="text-lg leading-none" style={{ color: item.color }}>
                {item.icon}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {item.hindiLabel}
                  </span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.2 rounded"
                    style={{
                      background: item.isActive ? `${item.color}20` : "rgba(0,0,0,0.05)",
                      color: item.isActive ? item.color : "#6B635B",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10.5px] text-[#6B635B] mt-0.5">
                  <span>{formatDashaDate(item.period.startDate)} → {formatDashaDate(item.period.endDate)}</span>
                  {item.isActive && (
                    <span className="font-extrabold" style={{ color: item.color }}>
                      {item.period.progressPercent.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-[#8C827A] text-right mt-1.5 italic">
        ✦ कर्सर ले जाने पर पट्टी रुकेगी · किसी भी दशा पर क्लिक करके उसके उप-काल देखें
      </p>
    </div>
  );
}

