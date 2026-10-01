"use client";

import React, { useState } from "react";
import { MuhuratCalculator } from "@/components/muhurat/MuhuratCalculator";
import { PersonalTaraCalendar } from "@/components/muhurat/PersonalTaraCalendar";
import "@/app/dashboard/shared.css";
import { Sparkles, Calendar, Layers } from "lucide-react";

export default function MuhuratPage() {
  const [activeTab, setActiveTab] = useState<"EVENT_MUHURAT" | "TARA_CALENDAR">("TARA_CALENDAR");

  return (
    <div className="page max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="border-b border-[var(--border)] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Classical Shastra &amp; Navtara Timing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--foreground)]">
            Auspicious Timing &amp; Decision Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl leading-relaxed">
            Find favorable dates evaluated with personal Moon Tara-Bala, Parashari planetary criteria, tithi purity, and classical proof verification.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border border-amber-900/10 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("TARA_CALENDAR")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "TARA_CALENDAR"
                ? "bg-[#B8860B] text-white shadow-sm"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Personal 30-Day Heatmap</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("EVENT_MUHURAT")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "EVENT_MUHURAT"
                ? "bg-[#B8860B] text-white shadow-sm"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Category Muhurats</span>
          </button>
        </div>
      </div>

      {/* Main View */}
      {activeTab === "TARA_CALENDAR" ? (
        <PersonalTaraCalendar />
      ) : (
        <MuhuratCalculator />
      )}
    </div>
  );
}
