// src/components/charts/SimpleKundliReportCard.tsx
// ============================================================================
// AstroLife — Simple Shastric Kundli Report Card
// Renders the clean, elegant, human-readable 10-section consultation document
// exactly matching the pure reading standard requested by the user.
// ============================================================================

"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import { generateSimpleKundliDossierMarkdown } from "@/lib/astro-engine/simple-kundli-dossier-engine";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Printer, Sparkles, BookOpen } from "lucide-react";

interface SimpleKundliReportCardProps {
  chart: ChartData;
  className?: string;
}

export default function SimpleKundliReportCard({
  chart,
  className = "",
}: SimpleKundliReportCardProps) {
  const [copied, setCopied] = useState(false);

  const markdownContent = useMemo(() => {
    return generateSimpleKundliDossierMarkdown(chart);
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto my-6 rounded-2xl bg-[#FFFFFF] border-2 border-[rgba(184,134,11,0.3)] shadow-xl overflow-hidden font-sans ${className}`}
    >
      {/* ── Top Header Action Bar ── */}
      <div className="px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-[#FAF8F5] via-[#FBF9F4] to-[#FAF8F5] border-b border-[rgba(184,134,11,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[rgba(184,134,11,0.12)] text-[#875C06] border border-[rgba(184,134,11,0.25)] mb-1.5">
            <Sparkles size={13} className="text-[#B8860B]" />
            <span>वैदिक व जैमिनी संपूर्ण जन्म कुंडली महा-विश्लेषण</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {chart.name} जी की जन्म कुंडली — प्रामाणिक जीवन फलित
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            ग्रह स्थिति · वर्तमान दशा-अंतर्दशा · दुर्लभ राजयोग · व्यक्तित्व · करियर D-10 · विवाह · संपत्ति · स्वास्थ्य व अचूक उपाय
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 bg-[#875C06] hover:bg-[#6D4A05] text-[#FFFFFF] shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            title="पूरी कुंडली रीडिंग कॉपी करें"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "कॉपी हो गया!" : "📋 Copy Reading"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 bg-[#FAF8F5] hover:bg-[#FFFFFF] text-[#4A4238] border border-[rgba(184,134,11,0.3)] shadow-sm active:scale-95 cursor-pointer"
            title="प्रिंट या पीडीएफ सेव करें"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* ── Document Body (Clean, Visible, Large Fonts) ── */}
      <div className="p-6 sm:p-10 text-[#1A1A1A] space-y-6 leading-relaxed selection:bg-[rgba(184,134,11,0.2)]">
        <article className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#1A1A1A] prose-h3:text-2xl prose-h3:border-b prose-h3:border-[rgba(184,134,11,0.25)] prose-h3:pb-2 prose-h3:mt-8 prose-h3:mb-4 prose-h4:text-lg prose-h4:text-[#875C06] prose-h4:mt-6 prose-h4:mb-3 prose-p:text-[15.5px] prose-p:leading-[1.8] prose-p:text-[#2D2824] prose-li:text-[15px] prose-li:leading-[1.8] prose-li:text-[#2D2824] prose-strong:text-[#111111] prose-strong:font-bold prose-hr:border-[rgba(184,134,11,0.2)] prose-hr:my-8">
          <ReactMarkdown
            components={{
              h3: ({ node, ...props }) => (
                <h3
                  className="font-serif text-xl sm:text-2xl font-extrabold text-[#1A1A1A] border-b-2 border-[rgba(184,134,11,0.25)] pb-2.5 mt-8 mb-4 flex items-center gap-2 tracking-tight"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="font-serif text-base sm:text-lg font-bold text-[#875C06] bg-[rgba(184,134,11,0.06)] px-3 py-1.5 rounded-lg border-l-4 border-[#B8860B] mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-[15.5px] sm:text-[16px] leading-[1.85] text-[#2D2824] my-3" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="space-y-2.5 my-3 pl-5 list-disc marker:text-[#B8860B]" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-[15px] sm:text-[15.5px] leading-[1.8] text-[#2D2824]" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-[#111111]" {...props} />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-t border-[rgba(184,134,11,0.25)] my-8" {...props} />
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>
      </div>

      {/* ── Footer Bar ── */}
      <div className="px-6 py-4 sm:px-8 bg-[#FAF8F5] border-t border-[rgba(184,134,11,0.2)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B635B]">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-[#875C06]" />
          <span>प्रामाणिक महर्षि पराशर व जैमिनी सूत्र गणना · शुद्ध दृश्य पंचांग · चित्रा पक्षीय लाहिड़ी अयनांश</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[#875C06] font-bold hover:underline cursor-pointer"
        >
          {copied ? "✓ Copied to clipboard" : "📋 Copy complete text"}
        </button>
      </div>
    </div>
  );
}

