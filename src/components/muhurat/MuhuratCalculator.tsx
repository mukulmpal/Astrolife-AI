"use client";

import React, { useState, useMemo } from "react";
import {
  scanAuspiciousMuhurats,
  evaluateDateMuhurat,
  type MuhuratCategory,
  type MuhuratWindow,
  type MuhuratCriterion,
} from "@/lib/astro-engine/muhurat";
import { useUserChart } from "@/lib/user-chart";
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  Heart,
  Briefcase,
  Home,
  Car,
  Plane,
  Filter,
  RefreshCw,
} from "lucide-react";

const CATEGORIES: { id: MuhuratCategory; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "marriage", label: "Vivah (Marriage)", icon: <Heart className="w-4 h-4 text-rose-500" />, desc: "Venus/Jupiter visibility, shubh tithis & stable nakshatras" },
  { id: "business", label: "Vyapar / Startup", icon: <Briefcase className="w-4 h-4 text-blue-500" />, desc: "Mercury/Jupiter support, growth nakshatras, no Rikta" },
  { id: "griha_pravesh", label: "Griha Pravesh", icon: <Home className="w-4 h-4 text-amber-500" />, desc: "Vastu nakshatras, stable lunar days, steady days" },
  { id: "vehicle", label: "Vehicle Purchase", icon: <Car className="w-4 h-4 text-emerald-500" />, desc: "Chara & movable nakshatras, Venus blessing" },
  { id: "travel", label: "Yatra (Travel)", icon: <Plane className="w-4 h-4 text-purple-500" />, desc: "Directional shoola mitigation, swift nakshatras" },
];

export function MuhuratCalculator({ className = "" }: { className?: string }) {
  const { chart } = useUserChart();
  const [selectedCategory, setSelectedCategory] = useState<MuhuratCategory>("marriage");
  const [daysHorizon, setDaysHorizon] = useState<number>(30);
  const [ratingFilter, setRatingFilter] = useState<"all" | "high" | "favorable">("all");
  const [personalize, setPersonalize] = useState<boolean>(true);
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Compute location context from user chart or fallback to Delhi / IST
  const locationContext = useMemo(() => {
    if (chart?.lat && chart?.lon) {
      return {
        location: { lat: chart.lat, lon: chart.lon },
        tz: chart.tz ?? 5.5,
        city: chart.city || "Your Location",
      };
    }
    return {
      location: { lat: 28.6139, lon: 77.2090 },
      tz: 5.5,
      city: "Delhi (Standard)",
    };
  }, [chart]);

  const natalMoonNak = personalize && chart?.planets?.Moon?.nakshatra ? chart.planets.Moon.nakshatra : undefined;

  // Run the deterministic scan
  const scannedMuhurats: MuhuratWindow[] = useMemo(() => {
    try {
      return scanAuspiciousMuhurats({
        category: selectedCategory,
        startDate: new Date(),
        daysToScan: daysHorizon,
        tz: locationContext.tz,
        location: locationContext.location,
        natalMoonNakshatra: natalMoonNak,
      });
    } catch (err) {
      console.error("Error scanning muhurats:", err);
      return [];
    }
  }, [selectedCategory, daysHorizon, locationContext, natalMoonNak]);

  // Filter based on selected filter option
  const filteredMuhurats = useMemo(() => {
    if (ratingFilter === "high") {
      return scannedMuhurats.filter((m) => m.rating === "Highly Auspicious");
    }
    if (ratingFilter === "favorable") {
      return scannedMuhurats.filter((m) => m.rating === "Highly Auspicious" || m.rating === "Favorable");
    }
    return scannedMuhurats;
  }, [scannedMuhurats, ratingFilter]);

  const toggleDrawer = (dateKey: string) => {
    setOpenDrawers((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── Event Category Tabs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
              selectedCategory === cat.id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent shadow-md"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--background)]"
            }`}
          >
            <div className="flex items-center gap-2">
              {cat.icon}
              <span className="font-semibold text-xs truncate">{cat.label}</span>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">{cat.desc}</p>
          </button>
        ))}
      </div>

      {/* ── Control Bar: Horizon, Personalize, Filter ── */}
      <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Horizon selector */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--muted-foreground)] font-medium">Scan Horizon:</span>
          <div className="flex bg-[var(--background)] p-0.5 rounded-lg border border-[var(--border)]">
            {[15, 30, 60].map((days) => (
              <button
                key={days}
                onClick={() => setDaysHorizon(days)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  daysHorizon === days
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Checkbox */}
        {chart?.planets?.Moon?.nakshatra && (
          <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={personalize}
              onChange={(e) => setPersonalize(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-[var(--foreground)]">
              Personalize for <strong>{chart.name}</strong> ({chart.planets.Moon.nakshatra} Moon)
            </span>
          </label>
        )}

        {/* Rating Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          <div className="flex bg-[var(--background)] p-0.5 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setRatingFilter("all")}
              className={`px-2 py-0.5 rounded-md ${
                ratingFilter === "all" ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium" : "text-[var(--muted-foreground)]"
              }`}
            >
              All ({scannedMuhurats.length})
            </button>
            <button
              onClick={() => setRatingFilter("favorable")}
              className={`px-2 py-0.5 rounded-md ${
                ratingFilter === "favorable" ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium" : "text-[var(--muted-foreground)]"
              }`}
            >
              Favorable+
            </button>
            <button
              onClick={() => setRatingFilter("high")}
              className={`px-2 py-0.5 rounded-md ${
                ratingFilter === "high" ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium" : "text-[var(--muted-foreground)]"
              }`}
            >
              ⭐ Top Only
            </button>
          </div>
        </div>
      </div>

      {/* ── Results Header Banner ── */}
      <div className="flex items-center justify-between text-xs px-1 text-[var(--muted-foreground)]">
        <span>
          Showing <strong>{filteredMuhurats.length}</strong> evaluated dates for{" "}
          <strong className="text-[var(--foreground)]">
            {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </strong>{" "}
          ({locationContext.city})
        </span>
        <span className="text-[11px] text-amber-500 font-medium">Ranked by Classical Shastra Alignment</span>
      </div>

      {/* ── Muhurat Cards List ── */}
      <div className="space-y-3">
        {filteredMuhurats.map((window) => {
          const isDrawerOpen = !!openDrawers[window.date];

          return (
            <div
              key={window.date}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] p-4 shadow-xs transition-all hover:border-amber-500/30"
            >
              {/* Top Row: Date, Badge, Score, Quick Timing */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--foreground)]">
                      {new Date(window.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold border uppercase tracking-wider"
                      style={{
                        backgroundColor: `${window.badgeColor}15`,
                        borderColor: `${window.badgeColor}35`,
                        color: window.badgeColor,
                      }}
                    >
                      {window.rating}
                    </span>
                  </div>

                  {/* Panchang Quick Summary */}
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-1 flex-wrap">
                    <span>
                      Tithi: <strong className="text-[var(--foreground)]">{window.panchangSummary.tithi}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Nakshatra: <strong className="text-[var(--foreground)]">{window.panchangSummary.nakshatra}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Yoga: <strong className="text-[var(--foreground)]">{window.panchangSummary.yoga}</strong>
                    </span>
                  </div>
                </div>

                {/* Score & Best Window */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs text-[var(--muted-foreground)]">Auspicious Index:</span>
                    <span className="font-mono text-base font-bold" style={{ color: window.badgeColor }}>
                      {window.score}/100
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-500 font-medium block mt-0.5">
                    ✨ Best: {window.bestTimeOfDay}
                  </span>
                  <span className="text-[10px] text-rose-500 block">
                    ⚠️ Rahu Kaal: {window.panchangSummary.rahuKaal}
                  </span>
                </div>
              </div>

              {/* ── Classical Proof Accordion Button ── */}
              <div className="mt-3 pt-2.5 border-t border-[var(--border)]">
                <button
                  onClick={() => toggleDrawer(window.date)}
                  className="w-full flex items-center justify-between text-left text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {isDrawerOpen ? "Hide Classical Calculation & Shastra Proof" : "✦ View Classical Calculation & Shastra Proof"}
                    </span>
                  </span>
                  {isDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Proof Details Drawer */}
                {isDrawerOpen && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[var(--background)] border border-amber-500/20 space-y-2 text-xs">
                    <div className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider mb-1">
                      Deterministic Evaluation Breakdown
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {window.criteria.map((crit, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-[11px] text-[var(--foreground)]">
                                {crit.factor}: {crit.name}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                  crit.status === "pass"
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : crit.status === "caution"
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-rose-500/10 text-rose-500"
                                }`}
                              >
                                {crit.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">{crit.detail}</p>
                          </div>
                          <div className="mt-2 pt-1 border-t border-[var(--border)] text-[9px] text-[var(--muted-foreground)] italic font-serif">
                            Citation: {crit.citation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredMuhurats.length === 0 && (
          <div className="text-center p-8 border border-dashed border-[var(--border)] rounded-2xl text-[var(--muted-foreground)] text-xs">
            No dates found matching the current filter. Try selecting &quot;All&quot; or expanding the scan horizon to 60 days.
          </div>
        )}
      </div>
    </div>
  );
}
