"use client";

import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

export type ReportStyle = "dashboard" | "manuscript" | "holographic" | "executive";

interface StyleOption {
  id: ReportStyle;
  label: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  accent: string;
}

const STYLES: StyleOption[] = [
  {
    id: "dashboard",
    label: "AI Intelligence Dashboard",
    subtitle: "Modern • Data-Driven • Interactive",
    description: "Structured dashboard with metrics, palm center, prediction cards. Perfect for quick insights.",
    icon: "📊",
    color: "from-blue-500 to-cyan-500",
    accent: "#53e7ff",
  },
  {
    id: "manuscript",
    label: "Luxury Palm Manuscript",
    subtitle: "Timeless • Elegant • Coffee Table",
    description: "Book-like layout with gold borders, 'The Map of You' header. Designed for printing and sharing.",
    icon: "📖",
    color: "from-amber-600 to-amber-500",
    accent: "#e6c869",
  },
  {
    id: "holographic",
    label: "Futuristic AI Holographic",
    subtitle: "Immersive • 3D • Next Generation",
    description: "Dark neon aesthetics with radial cards, scanning effects. Most dramatic and modern.",
    icon: "✨",
    color: "from-purple-500 to-pink-500",
    accent: "#c45cff",
  },
  {
    id: "executive",
    label: "Executive Insight Report",
    subtitle: "Analytical • Professional • Strategic",
    description: "McKinsey-style with charts, radar analysis, wealth/health/relationship indices. Data-heavy.",
    icon: "📈",
    color: "from-slate-600 to-slate-500",
    accent: "#8fb6ff",
  },
];

function MiniPreview({ style }: { style: StyleOption }) {
  const isManuscript = style.id === "manuscript";
  const isExecutive = style.id === "executive";
  const isHolographic = style.id === "holographic";

  return (
    <div
      className={`relative mb-4 h-40 overflow-hidden rounded-2xl border ${
        isManuscript ? "border-amber-300/30 bg-[#2a1d12]" : isExecutive ? "border-slate-300/20 bg-[#071018]" : "border-white/10 bg-black/60"
      }`}
    >
      <div className="absolute inset-0 opacity-70" style={{
        background: isManuscript
          ? "radial-gradient(circle at 50% 20%, rgba(230,200,105,.18), transparent 45%)"
          : isExecutive
            ? "linear-gradient(135deg, rgba(143,182,255,.12), transparent)"
            : `radial-gradient(circle at 50% 55%, ${style.accent}33, transparent 50%)`,
      }} />
      <div className="absolute left-4 top-4 h-6 w-20 rounded-full border border-white/10 bg-white/[0.06]" />
      <div className="absolute right-4 top-4 h-6 w-12 rounded-full border border-white/10 bg-white/[0.05]" />

      {isExecutive ? (
        <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
          {[62, 82, 71].map((height, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
              <div className="h-2 w-10 rounded bg-white/15" />
              <div className="mt-4 rounded bg-[#8fb6ff]/70" style={{ height }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className={`absolute left-1/2 top-10 h-24 w-16 -translate-x-1/2 rounded-[45%] border ${isManuscript ? "border-amber-200/30 bg-amber-100/20" : "border-cyan-200/35 bg-cyan-200/10 shadow-[0_0_35px_rgba(83,231,255,.22)]"}`} />
          {!isManuscript && (
            <div className="absolute left-1/2 top-16 h-28 w-28 -translate-x-1/2 rounded-full border border-cyan-300/20" />
          )}
          <div className="absolute left-5 top-16 h-11 w-24 rounded-xl border border-white/10 bg-black/35" />
          <div className="absolute right-5 top-20 h-11 w-24 rounded-xl border border-white/10 bg-black/35" />
          <div className="absolute inset-x-5 bottom-4 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-7 rounded-lg border border-white/10 bg-white/[0.05]" />
            ))}
          </div>
        </>
      )}

      {isHolographic && <div className="absolute inset-x-10 top-1/2 h-px bg-cyan-200/80 shadow-[0_0_18px_5px_rgba(83,231,255,.28)]" />}
    </div>
  );
}

interface StylePickerProps {
  onSelect: (style: ReportStyle) => void;
  /** When provided, the picker can be dismissed (used when a style is already chosen). */
  onClose?: () => void;
}

export function StylePicker({ onSelect, onClose }: StylePickerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-4xl w-full"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-2 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#c8a030]/40 bg-black/80 text-white/70 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a030]/30 bg-black/40 px-4 py-2 mb-4">
            <Sparkles size={14} className="text-[#e6c869]" />
            <span className="text-xs font-medium tracking-widest text-[#e6c869] uppercase">
              Choose Your Report Style
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-b from-[#f5e7b8] to-[#c8a030] bg-clip-text text-transparent">
            All Reports Powered by AstroLife AI Palm Intelligence
          </h2>
        </div>

        {/* Grid of styles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {STYLES.map((style, i) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(style.id)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 text-left transition-all hover:border-[#c8a030]/50 hover:bg-white/[0.08]"
            >
              {/* Gradient accent */}
              <div className={`absolute -inset-px bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl -z-10`} />
              <MiniPreview style={style} />

              {/* Content */}
              <div className="flex items-start gap-3">
                <span className="text-3xl">{style.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white/90">{style.label}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{style.subtitle}</p>
                  <p className="text-xs leading-relaxed text-white/50 mt-2">{style.description}</p>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/20 group-hover:bg-[#e6c869] transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            You can change styles anytime after generating your report.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
