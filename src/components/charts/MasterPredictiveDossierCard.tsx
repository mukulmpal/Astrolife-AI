"use client";

import React, { useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  generateMasterPredictiveDossier,
  renderDossierMarkdown,
  type MasterPredictiveDossier,
  type DossierSection,
} from "@/lib/astro-engine/master-predictive-dossier-engine";

interface MasterPredictiveDossierCardProps {
  chart: ChartData;
  className?: string;
  defaultCollapsed?: boolean;
}

export const MasterPredictiveDossierCard: React.FC<MasterPredictiveDossierCardProps> = ({
  chart,
  className = "",
  defaultCollapsed = false,
}) => {
  const [dossier] = useState<MasterPredictiveDossier>(() =>
    generateMasterPredictiveDossier(chart)
  );
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyMarkdown = () => {
    const md = renderDossierMarkdown(dossier);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredSections = dossier.sections.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.titleHindi.toLowerCase().includes(q) ||
      sec.titleEnglish.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-8 font-sans ${className}`}>
      {/* ── Top Header Bar ── */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-amber-950/40 via-stone-900 to-black border border-amber-500/30 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <span>✦</span> 20-Pillar Master Predictive Dossier
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {dossier.nativeName} — संपूर्ण 20-स्तरीय महा-भविष्यवाणी
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-stone-300">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">📅</span> {dossier.dob} {dossier.tob}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">📍</span> {dossier.city}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">♈</span> लग्न: {dossier.lagnaRashi}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">🌙</span> चंद्र: {dossier.moonRashi} ({dossier.nakshatra})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">🪐</span> दशा: {dossier.activeMahadasha} - {dossier.activeAntardasha}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 active:scale-95"
            >
              <span>{isCollapsed ? "▼ विस्तृत 20-स्तंभ खोलें (Expand)" : "▲ संक्षेप में करें (Collapse)"}</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy Full Dossier"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 active:scale-95"
            >
              <span>🖨️ Print</span>
            </button>
          </div>
        </div>

        {/* ── Search and Filter Bar (When Expanded) ── */}
        {!isCollapsed && (
          <div className="mt-6 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search pillars (e.g. विवाह, करियर, दशा)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl text-sm bg-stone-900/90 text-white placeholder-stone-500 border border-stone-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 text-xs">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-amber-500 text-stone-950"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                All 20 Pillars ({dossier.sections.length})
              </button>
              {dossier.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    activeTab === sec.id
                      ? "bg-amber-500 text-stone-950"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  {sec.id}. {sec.titleHindi.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Sections Stream (When Expanded) ── */}
      {!isCollapsed ? (
        <div className="space-y-6">
          {filteredSections
            .filter((sec) => activeTab === "all" || activeTab === sec.id)
            .map((sec) => (
              <SectionCard key={sec.id} section={sec} />
            ))}
        </div>
      ) : (
        <div
          onClick={() => setIsCollapsed(false)}
          className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/20 to-stone-900 border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-all flex items-center justify-between gap-4 text-left shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
            <div>
              <div className="text-sm font-bold text-white">
                ✦ संपूर्ण 20-सूत्रीय महा-भविष्यवाणी (20 Pillars Available)
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                विंशोत्तरी, नवतारा, जैमिनी, KP, राजयोग, अष्टकवर्ग, षोडशवर्ग, विवाह, करियर, रिस्क, आयुर्वेद व सिद्ध उपाय
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors whitespace-nowrap">
            विस्तार से पढ़ें (Expand) →
          </span>
        </div>
      )}
    </div>
  );
};

const SectionCard: React.FC<{ section: DossierSection }> = ({ section }) => {
  return (
    <article
      id={`section-${section.id}`}
      className="rounded-2xl p-6 sm:p-8 bg-stone-900/90 border border-stone-800 shadow-xl hover:border-amber-500/30 transition-all duration-300 space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1.5">
            {section.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {section.id}. {section.titleHindi}
          </h2>
          <div className="text-sm font-medium text-amber-300/80">
            {section.titleEnglish}
          </div>
        </div>
        <div className="text-2xl font-black text-amber-500/20 select-none">
          #{String(section.id).padStart(2, "0")}
        </div>
      </div>

      {/* ── Summary Callout ── */}
      <div className="p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 text-stone-200 text-base leading-relaxed">
        {section.summary}
      </div>

      {/* ── Key Highlights Grid ── */}
      {section.highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {section.highlights.map((h, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:bg-stone-800 transition-colors"
            >
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                {h.label}
              </div>
              <div className="text-base font-bold text-amber-300 mt-1">
                {h.value}
              </div>
              {h.note && (
                <div className="text-xs text-stone-400 mt-1 leading-snug">
                  {h.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Structured Table (if present) ── */}
      {section.tableHeaders && section.tableRows && section.tableRows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-sm text-stone-300">
            <thead className="bg-stone-800/80 text-xs font-semibold uppercase text-amber-400 border-b border-stone-700">
              <tr>
                {section.tableHeaders.map((th, i) => (
                  <th key={i} className="px-4 py-3 whitespace-nowrap">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 bg-stone-900/50">
              {section.tableRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-amber-500/5 transition-colors"
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 whitespace-nowrap text-sm">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Narrative Insights ── */}
      {section.narrativeParagraphs.length > 0 && (
        <div className="space-y-3 text-stone-300 text-base leading-relaxed">
          {section.narrativeParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {/* ── Actionable Rules Box ── */}
      {section.actionableRules.length > 0 && (
        <div className="rounded-xl p-4 bg-stone-800/50 border border-amber-500/30 space-y-2">
          <div className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <span>💡</span> अचूक नियम व निर्देश (Actionable Directives)
          </div>
          <ul className="space-y-1.5 text-sm text-stone-200">
            {section.actionableRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

