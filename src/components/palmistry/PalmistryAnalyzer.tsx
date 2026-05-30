"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Sparkles, ScanLine, Download, Share2, FileDown,
  AlertCircle, Hand, X, Loader2, Settings,
} from "lucide-react";
import { useUserChart } from "@/lib/user-chart";
import {
  PALM_LINES,
  FALLBACK_LINE_POINTS,
  FALLBACK_MOUNT_POS,
  buildLinePath,
  mirrorX,
  type PalmistryReport,
} from "@/lib/astro-engine/palmistry-engine";
import { detectHandGeometry, applyHandGeometry } from "@/lib/palmistry/hand-geometry";
import { PalmLoadingScreen } from "./PalmLoadingScreen";
import { StylePicker, type ReportStyle } from "./StylePicker";
import { DashboardReport } from "./DashboardReport";
import { ManuscriptReport } from "./ManuscriptReport";
import { HolographicReport } from "./HolographicReport";
import { ExecutiveReport } from "./ExecutiveReport";

const GOLD = "#c8a030";
const MAX_MB = 5;

// ── Reusable primitives ───────────────────────────────────────
function GlassCard({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className={`relative rounded-2xl border border-[#c8a030]/20 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] transition-shadow hover:border-[#c8a030]/45 hover:shadow-[0_0_30px_-6px_rgba(200,160,48,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function PremiumButton({
  children, onClick, variant = "gold", disabled,
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "gold" | "ghost"; disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "gold"
      ? "bg-gradient-to-r from-[#c8a030] to-[#e6c869] text-black shadow-[0_6px_24px_-6px_rgba(200,160,48,0.6)] hover:brightness-110"
      : "border border-[#c8a030]/35 text-[#e6c869] hover:bg-[#c8a030]/10";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

// ── Palm scanner hero ─────────────────────────────────────────
function PalmScanner({
  src, report, scanning,
}: { src: string; report: PalmistryReport | null; scanning: boolean }) {
  const [hover, setHover] = useState<string | null>(null);
  const [aspect, setAspect] = useState(3 / 3.6);
  const lineById = useMemo(
    () => new Map<string, PalmistryReport["lines"][number]>(report?.lines.map((l) => [l.id as string, l]) ?? []),
    [report]
  );
  // Mirror the fallback (right-hand) geometry for a left hand. Model-supplied
  // coordinates are already from the real image, so they are never mirrored.
  const mirror = report?.meta.hand === "left";

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-[#c8a030]/30 bg-black shadow-[0_0_60px_-15px_rgba(200,160,48,0.5)]"
      style={{ aspectRatio: String(aspect) }}
    >
      {/* radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,160,48,0.18),transparent_60%)]" />
      {/* palm image — user-supplied data URL, next/image not applicable.
          Container aspect matches the image so object-cover neither crops nor
          letterboxes, keeping the overlay aligned to the real palm. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Your palm"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight);
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* gold grid */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke={GOLD} strokeWidth="0.15" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke={GOLD} strokeWidth="0.15" />
        ))}
      </svg>

      {/* scanning beam */}
      {scanning && (
        <motion.div
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#c8a030]/40 to-transparent"
          initial={{ top: "-20%" }}
          animate={{ top: ["-20%", "100%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* line overlays — drawn in normalized 0-100 image space */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {PALM_LINES.map((def, i) => {
          const reading = lineById.get(def.id);
          const raw = reading?.points ?? FALLBACK_LINE_POINTS[def.id];
          const usingModel = Boolean(reading?.points);
          const pts = usingModel ? raw : raw.map((p) => mirrorX(p, mirror));
          const active = hover === def.id;
          return (
            <motion.path
              key={def.id}
              d={buildLinePath(pts)}
              fill="none"
              stroke={def.color}
              strokeWidth={active ? 1.4 : 0.9}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: `drop-shadow(0 0 ${active ? 8 : 4}px ${def.color})`, cursor: "pointer" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: scanning ? 0.35 : 0.95 }}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.25, ease: "easeInOut" }}
              onMouseEnter={() => reading && setHover(def.id)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </svg>

      {/* line tooltip */}
      <AnimatePresence>
        {hover && lineById.get(hover) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 left-3 right-3 rounded-xl border border-[#c8a030]/30 bg-black/85 p-3 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: lineById.get(hover)!.color }}>
                {lineById.get(hover)!.name}
              </span>
              <span className="text-xs text-[#e6c869]">{lineById.get(hover)!.confidence}% confidence</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-white/70">{lineById.get(hover)!.summary}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* floating mount labels — at real (or mirrored fallback) positions */}
      {report &&
        report.mounts.map((m, i) => {
          const fallback = FALLBACK_MOUNT_POS[m.id];
          const pos = m.pos ?? (fallback ? mirrorX(fallback, mirror) : undefined);
          if (!pos) return null;
          return (
            <motion.div
              key={m.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: scanning ? 0 : 1, scale: 1, y: [0, -4, 0] }}
              transition={{
                opacity: { delay: 1.6 + i * 0.1 },
                scale: { delay: 1.6 + i * 0.1 },
                y: { duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="whitespace-nowrap rounded-full border border-[#c8a030]/40 bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-[#e6c869] backdrop-blur">
                {m.name.replace("Mount of ", "").replace(" / Apollo", "")} · {m.score}%
              </div>
            </motion.div>
          );
        })}

      {/* scanning label */}
      {scanning && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <ScanLine className="animate-pulse text-[#e6c869]" size={28} />
          <span className="text-xs font-medium tracking-widest text-[#e6c869]">SCANNING PALM…</span>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function PalmistryAnalyzer() {
  const { birth } = useUserChart();
  const [preview, setPreview] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [reportState, setReport] = useState<PalmistryReport | null>(null);
  const report = reportState as PalmistryReport;
  const [selectedStyle, setSelectedStyle] = useState<ReportStyle | null>(null);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load style preference from localStorage on mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("palmistry-style") as ReportStyle | null;
      if (saved) {
        setSelectedStyle(saved);
      } else {
        setShowStylePicker(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleStyleSelect = (style: ReportStyle) => {
    setSelectedStyle(style);
    localStorage.setItem("palmistry-style", style);
    setShowStylePicker(false);
  };

  const handleFile = useCallback((file: File) => {
    setError("");
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Sirf JPG ya PNG image upload karein.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image ${MAX_MB}MB se choti honi chahiye.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const original = reader.result as string;
      setPreview(original);
      setReport(null);
      // Downscale for the model: full-res phone photos make vision slow.
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1100;
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { setDataUrl(original); return; }
        ctx.drawImage(img, 0, 0, w, h);
        setDataUrl(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => setDataUrl(original);
      img.src = original;
    };
    reader.readAsDataURL(file);
  }, []);

  const analyze = useCallback(async () => {
    if (!dataUrl) return;
    setScanning(true);
    setError("");
    setReport(null);
    try {
      // Detect exact hand landmarks (client-side) in parallel with the AI call.
      // Run on the full-resolution preview for best landmark accuracy.
      const geoPromise = detectHandGeometry(preview ?? dataUrl).catch(() => null);
      const res = await fetch("/api/astro/palmistry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          birth: { name: birth.name, dob: birth.dob, tob: birth.tob, city: birth.city },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Analysis failed");
      const geo = await geoPromise;
      // small delay so the scan animation reads as intentional
      await new Promise((r) => setTimeout(r, 600));
      // Merge landmark geometry so overlays sit exactly on the real palm.
      setReport(applyHandGeometry(json.report as PalmistryReport, geo));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kuch galat ho gaya. Dobara try karein.");
    } finally {
      setScanning(false);
    }
  }, [dataUrl, preview, birth]);

  const exportPdf = useCallback(async () => {
    if (!reportRef.current) return;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#060410", scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("astrolife-palm-report.pdf");
  }, []);

  const share = useCallback(async () => {
    const text = report
      ? `My AstroLife AI Palm Reading: ${report.overallImpression.headline}`
      : "AstroLife AI Palm Reading";
    try {
      if (navigator.share) await navigator.share({ title: "AstroLife Palm Reading", text });
      else { await navigator.clipboard.writeText(text); alert("Report summary copied!"); }
    } catch { /* user cancelled */ }
  }, [report]);

  return (
    <div className="text-white">
      {/* ── Full-screen loading overlay (replaces blank screen during analysis) ── */}
      <PalmLoadingScreen visible={scanning} preview={preview} />

      {/* Style Picker Modal */}
      <AnimatePresence>
        {showStylePicker && (
          <StylePicker
            onSelect={handleStyleSelect}
            onClose={selectedStyle ? () => setShowStylePicker(false) : undefined}
          />
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#c8a030]/20 bg-[radial-gradient(circle_at_70%_-10%,rgba(200,160,48,0.16),transparent_45%)] px-6 py-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8a030]/30 bg-black/40 px-3 py-1 text-[11px] font-medium tracking-widest text-[#e6c869]">
          <Sparkles size={12} /> ASTROLIFE AI PALM INTELLIGENCE
        </span>
        <h1 className="mt-4 bg-gradient-to-b from-[#f5e7b8] to-[#c8a030] bg-clip-text font-serif text-4xl font-bold text-transparent drop-shadow-[0_2px_20px_rgba(200,160,48,0.3)] sm:text-5xl">
          AI Palm Reading Report
        </h1>
        <p className="mt-2 text-sm tracking-wide text-white/50">Your Hand. Your Story.</p>

        {report && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PremiumButton onClick={exportPdf}><FileDown size={15} /> Export PDF</PremiumButton>
            <PremiumButton variant="ghost" onClick={exportPdf}><Download size={15} /> Download Report</PremiumButton>
            <PremiumButton variant="ghost" onClick={share}><Share2 size={15} /> Share Report</PremiumButton>
            <PremiumButton variant="ghost" onClick={() => setShowStylePicker(true)}><Settings size={15} /> Change Style</PremiumButton>
          </div>
        )}
      </div>

      {/* ── Upload state ── */}
      {!report && (
        <div className="mt-8">
          <GlassCard className="p-6 sm:p-8">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {!preview ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#c8a030]/30 py-14 transition-colors hover:border-[#c8a030]/60 hover:bg-[#c8a030]/[0.04]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a030]/10">
                  <Hand className="text-[#e6c869]" size={30} />
                </div>
                <span className="text-base font-semibold text-white/90">Apni hatheli ki photo upload karein</span>
                <span className="flex items-center gap-1.5 text-xs text-white/45">
                  <Upload size={12} /> JPG / PNG · Max {MAX_MB}MB · achhi roshni mein khinchi hui photo
                </span>
              </button>
            ) : (
              <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-center">
                <div className="relative mx-auto w-full max-w-xs">
                  <PalmScanner src={preview} report={null} scanning={scanning} />
                  {!scanning && (
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setDataUrl(null); }}
                      className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#c8a030]/40 bg-black/80 text-white/70 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-serif text-2xl font-bold text-[#e6c869]">Ready to scan</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    AstroLife AI aapki hatheli ki lines, mounts aur fingers ko classical palmistry
                    (Samudrika Shastra + K.N. Rao) ke hisaab se analyze karega.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                    <PremiumButton onClick={analyze} disabled={scanning}>
                      {scanning ? <><Loader2 size={15} className="animate-spin" /> Analyzing…</> : <><ScanLine size={15} /> Analyze My Palm</>}
                    </PremiumButton>
                    <PremiumButton variant="ghost" onClick={() => fileRef.current?.click()} disabled={scanning}>
                      Change Photo
                    </PremiumButton>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* ── Report ── */}
      {report && preview && selectedStyle && (
        <div ref={reportRef} className="mt-8">
          {selectedStyle === "dashboard" && (
            <DashboardReport report={report} preview={preview} />
          )}
          {selectedStyle === "manuscript" && (
            <ManuscriptReport report={report} preview={preview} />
          )}
          {selectedStyle === "holographic" && (
            <HolographicReport report={report} preview={preview} />
          )}
          {selectedStyle === "executive" && (
            <ExecutiveReport report={report} preview={preview} />
          )}
        </div>
      )}

    </div>
  );
}
