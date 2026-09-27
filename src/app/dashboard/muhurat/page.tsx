"use client";

import React from "react";
import { MuhuratCalculator } from "@/components/muhurat/MuhuratCalculator";
import "@/app/dashboard/shared.css";
import { Sparkles } from "lucide-react";

export default function MuhuratPage() {
  return (
    <div className="page max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Classical Shastra Muhurat Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--foreground)]">
          Auspicious Timing & Muhurat Calculator
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl leading-relaxed">
          Find favorable dates for Marriage, Business Launches, Griha Pravesh, Vehicle Purchases, and Travel — evaluated with authentic Parashari planetary criteria, tithi purity, and classical proof verification.
        </p>
      </div>

      {/* Main Calculator */}
      <MuhuratCalculator />
    </div>
  );
}
