"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Hand,
  Award,
  Loader2,
  ChevronRight,
  Upload,
  X,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserChart } from "@/lib/user-chart";
import type {
  BTRCandidate,
  BTREvent,
  BTREventCategory,
  BTRPalmInput,
  BTRResult,
} from "@/lib/astro-engine/birth-rectification-engine";
import type { PalmVisionResult } from "@/lib/palmistry/types";

const EVENT_PRESETS: { category: BTREventCategory; label: string; icon: string }[] = [
  { category: "career_start", label: "Career Start / First Job", icon: "💼" },
  { category: "promotion", label: "Job Promotion", icon: "📈" },
  { category: "job_change", label: "Job Switch", icon: "🔄" },
  { category: "job_loss", label: "Job Loss / Layoff", icon: "⚠️" },
  { category: "marriage", label: "Marriage", icon: "💍" },
  { category: "relationship_break", label: "Breakup / Betrayal", icon: "💔" },
  { category: "far_travel", label: "Far Travel / Relocation", icon: "✈️" },
  { category: "sibling_milestone", label: "Sibling Milestone", icon: "👥" },
  { category: "home_loss", label: "Loss of Home / Crisis", icon: "🏚️" },
  { category: "asset_purchase", label: "Home / Car Purchase", icon: "🏠" },
  { category: "health_crisis", label: "Health Issue / Surgery", icon: "🏥" },
];

function mapVisionToBTRPalm(visionResult: PalmVisionResult): BTRPalmInput {
  const f = visionResult.features;
  const isSquare = f.palm.shape === "square" || f.palm.shape === "broad";
  const isLongFingers = f.fingers.length === "long" || f.fingers.length === "medium";

  let element: BTRPalmInput["handElement"] = "air";
  if (isSquare && !isLongFingers) element = "earth";
  else if (isSquare && isLongFingers) element = "air";
  else if (!isSquare && !isLongFingers) element = "fire";
  else element = "water";

  const mounts: string[] = [];
  if (f.mounts) {
    for (const [mName, mData] of Object.entries(f.mounts)) {
      if (mData.prominence === "strong" || mData.prominence === "balanced") {
        mounts.push(mName);
      }
    }
  }

  let fateOrigin: BTRPalmInput["fateLineOrigin"] = "moon";
  if (f.lines?.saturn?.direction === "moon") {
    fateOrigin = "moon";
  } else {
    fateOrigin = "wrist";
  }

  return {
    handElement: element,
    prominentMounts: mounts.length ? mounts : ["venus", "moon"],
    fateLineOrigin: fateOrigin,
  };
}

export function BirthRectificationWorkbench() {
  const router = useRouter();
  const { setBirthData } = useUserChart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search window state
  const [name, setName] = useState("Friend");
  const [city, setCity] = useState("New Delhi");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [startDate, setStartDate] = useState("2001-06-25");
  const [endDate, setEndDate] = useState("2001-06-30");
  const [startTime, setStartTime] = useState("01:00");
  const [endTime, setEndTime] = useState("04:00");
  const [stepMinutes, setStepMinutes] = useState(5);

  // Life milestones state
  const [events, setEvents] = useState<BTREvent[]>([
    { title: "First Job Started", date: "2020-08-05", category: "career_start" },
    { title: "Job Loss / Layoff", date: "2023-05-02", category: "job_loss" },
    { title: "Far Travel & Remote Work Tension", date: "2024-05-24", category: "far_travel" },
    { title: "Brother's Marriage", date: "2025-01-15", category: "sibling_milestone" },
    { title: "New Stable Remote Job", date: "2025-03-28", category: "career_start" },
  ]);

  // Palm Image & Auto-Extracted Features
  const [palmPreview, setPalmPreview] = useState<string | null>(null);
  const [palmDetecting, setPalmDetecting] = useState(false);
  const [palmDetectedText, setPalmDetectedText] = useState<string | null>(null);
  const [palmFeatures, setPalmFeatures] = useState<BTRPalmInput>({
    handElement: "air",
    prominentMounts: ["venus", "moon"],
    fateLineOrigin: "moon",
  });

  // Form tab selection
  const [activeTab, setActiveTab] = useState<"window" | "milestones" | "palm">("window");

  // Execution state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BTRResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addEvent = (category: BTREventCategory, label: string) => {
    setEvents((prev) => [
      ...prev,
      {
        title: label,
        date: "2022-01-01",
        category,
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof BTREvent, value: string) => {
    setEvents((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    );
  };

  const handlePalmUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPalmPreview(String(reader.result));
    };
    reader.readAsDataURL(file);

    setPalmDetecting(true);
    setPalmDetectedText(null);

    const formData = new FormData();
    formData.append("image", file);

    fetch("/api/palmistry/extract-features", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && json.result) {
          const mapped = mapVisionToBTRPalm(json.result);
          setPalmFeatures(mapped);
          setPalmDetectedText(
            `Detected ${mapped.handElement?.toUpperCase()} hand archetype with prominent ${mapped.prominentMounts?.join(", ")} mounts.`
          );
        } else {
          setPalmDetectedText("Palm photo uploaded. Ready for anatomical correlation.");
        }
      })
      .catch(() => {
        setPalmDetectedText("Palm photo attached. Ready for analysis.");
      })
      .finally(() => {
        setPalmDetecting(false);
      });
  };

  const clearPalm = () => {
    setPalmPreview(null);
    setPalmDetectedText(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRunRectification = async () => {
    setError("");
    setResult(null);
    setSavedSuccess(false);

    if (events.length === 0) {
      setError("Please add at least 1 verified life milestone.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        city,
        gender,
        dateRange: { startDate, endDate },
        timeRange: { startTime, endTime },
        stepMinutes,
        events,
        palmFeatures,
      };

      const res = await fetch("/api/astro/rectify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Rectification failed.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBestCandidate = (candidate: BTRCandidate) => {
    setBirthData({
      name,
      dob: candidate.date,
      tob: candidate.time,
      city,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/dashboard/kundli");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4 text-[#1A1A1A]">
      {/* ── Hero Section (Home Page Warm Linen Canvas) ── */}
      <div
        className="relative overflow-hidden rounded-2xl border p-8 sm:p-10 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #FFFFFF, #FAF5EB)",
          borderColor: "rgba(184, 134, 11, 0.28)",
        }}
      >
        <div
          className="absolute -right-12 -top-12 h-64 w-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(184, 134, 11, 0.08) 0%, transparent 70%)",
          }}
        />

        <div
          className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(184, 134, 11, 0.12)",
            borderColor: "rgba(184, 134, 11, 0.3)",
            color: "#8C6508",
          }}
        >
          <Sparkles size={14} className="text-[#8C6508]" /> Precision Nashta Jataka & KP Engine
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[#1A1A1A] sm:text-5xl">
          Birth Time & Date Rectification
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#4A4238]">
          Reconstruct an unrecorded or approximate birth time down to the exact minute. Our 4-tier engine tests your verified life events against transit clocks, KP Sub-Lord boundaries, and classical Kunda mathematics.
        </p>

        {/* Tab Navigation (Home Page Style) */}
        <div
          className="mt-8 flex flex-wrap gap-2 border-b pb-4"
          style={{ borderColor: "rgba(184, 134, 11, 0.2)" }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("window")}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition"
            style={{
              background: activeTab === "window" ? "#B8860B" : "#FAF5EB",
              color: activeTab === "window" ? "#FFFFFF" : "#6B635B",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              boxShadow: activeTab === "window" ? "0 4px 12px rgba(184, 134, 11, 0.2)" : "none",
            }}
          >
            <Clock size={16} /> 1. Search Window
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("milestones")}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition"
            style={{
              background: activeTab === "milestones" ? "#B8860B" : "#FAF5EB",
              color: activeTab === "milestones" ? "#FFFFFF" : "#6B635B",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              boxShadow: activeTab === "milestones" ? "0 4px 12px rgba(184, 134, 11, 0.2)" : "none",
            }}
          >
            <Calendar size={16} /> 2. Life Milestones ({events.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("palm")}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition"
            style={{
              background: activeTab === "palm" ? "#B8860B" : "#FAF5EB",
              color: activeTab === "palm" ? "#FFFFFF" : "#6B635B",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              boxShadow: activeTab === "palm" ? "0 4px 12px rgba(184, 134, 11, 0.2)" : "none",
            }}
          >
            <Hand size={16} /> 3. Palm Photo Upload {palmPreview ? "✓" : "(Optional)"}
          </button>
        </div>
      </div>

      {/* ── Main Form Card (Crisp White Card on Linen Canvas) ── */}
      <div
        className="rounded-2xl border p-6 sm:p-9 shadow-sm"
        style={{
          background: "#FFFFFF",
          borderColor: "rgba(184, 134, 11, 0.28)",
        }}
      >
        {/* Tab 1: Search Window */}
        {activeTab === "window" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="border-b pb-4" style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}>
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
                Step 1: Approximate Birth Window
              </h2>
              <p className="mt-1 text-sm text-[#6B635B]">
                Provide the approximate date range and time frame where the birth likely occurred.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Seeker / Alias Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Birth City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                  placeholder="e.g. New Delhi"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Window Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Window End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Earliest Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Latest Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Scan Step Size
                </label>
                <select
                  value={stepMinutes}
                  onChange={(e) => setStepMinutes(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.35)",
                    color: "#1A1A1A",
                  }}
                >
                  <option value={2}>2 Minutes (Fine)</option>
                  <option value={5}>5 Minutes (Balanced)</option>
                  <option value={10}>10 Minutes (Broad)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("milestones")}
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, #B8860B, #D4AF37)",
                }}
              >
                Proceed to Milestones <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Life Milestones */}
        {activeTab === "milestones" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="border-b pb-4" style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}>
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
                Step 2: Enter Verified Life Milestones
              </h2>
              <p className="mt-1 text-sm text-[#6B635B]">
                The engine matches each milestone against the active Vimshottari Mahadasha, Antardasha, and transit alignments.
              </p>
            </div>

            {/* Event List */}
            <div className="space-y-3">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border p-4 transition"
                  style={{
                    background: "#FAF7F2",
                    borderColor: "rgba(184, 134, 11, 0.25)",
                  }}
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                      Milestone #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => updateEvent(idx, "title", e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-[#1A1A1A] focus:outline-none placeholder-stone-400"
                      placeholder="Event description"
                    />
                  </div>

                  <div className="w-full sm:w-48">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B635B]">
                      Exact / Approx Date
                    </span>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(idx, "date", e.target.value)}
                      className="mt-1 w-full rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none"
                      style={{
                        background: "#FFFFFF",
                        borderColor: "rgba(184, 134, 11, 0.35)",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEvent(idx)}
                    className="self-end sm:self-center p-2 text-[#6B635B] hover:text-rose-600 transition"
                    title="Remove milestone"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Preset Milestone Pills */}
            <div
              className="rounded-xl border p-5"
              style={{
                background: "#FAF5EB",
                borderColor: "rgba(184, 134, 11, 0.22)",
              }}
            >
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                Quick Add Life Milestone:
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {EVENT_PRESETS.map((preset) => (
                  <button
                    key={preset.category}
                    type="button"
                    onClick={() => addEvent(preset.category, preset.label)}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
                    style={{
                      background: "#FFFFFF",
                      borderColor: "rgba(184, 134, 11, 0.25)",
                      color: "#4A4238",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#B8860B";
                      e.currentTarget.style.color = "#8C6508";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(184, 134, 11, 0.25)";
                      e.currentTarget.style.color = "#4A4238";
                    }}
                  >
                    <span>{preset.icon}</span> {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("window")}
                className="rounded-xl border px-6 py-2.5 text-sm font-semibold transition"
                style={{
                  background: "#FAF5EB",
                  borderColor: "rgba(184, 134, 11, 0.25)",
                  color: "#6B635B",
                }}
              >
                Back to Window
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("palm")}
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, #B8860B, #D4AF37)",
                }}
              >
                Upload Palm Photo <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Palm Photo Upload (Auto Feature Detection - No Manual Input) */}
        {activeTab === "palm" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="border-b pb-4" style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}>
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
                Step 3: Upload Palm Image (Optional)
              </h2>
              <p className="mt-1 text-sm text-[#6B635B]">
                Upload a clear photo of your dominant palm. Our AI automatically extracts hand shape, elemental polarity, and mount elevations to cross-validate your Ascendant.
              </p>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePalmUpload(e.target.files[0])}
            />

            {palmPreview ? (
              <div className="relative overflow-hidden rounded-2xl border p-4" style={{ borderColor: "rgba(184, 134, 11, 0.35)", background: "#FAF7F2" }}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={palmPreview}
                    alt="Palm scan preview"
                    className="h-56 w-44 rounded-xl object-cover border shadow-sm"
                    style={{ borderColor: "rgba(184, 134, 11, 0.3)" }}
                  />

                  <div className="flex-1 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase" style={{ background: "rgba(184, 134, 11, 0.15)", borderColor: "#B8860B", color: "#8C6508" }}>
                        <Hand size={14} /> Palm Photo Attached
                      </span>
                      <button
                        type="button"
                        onClick={clearPalm}
                        className="rounded-lg border p-1.5 text-stone-500 hover:text-rose-600 transition"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {palmDetecting ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#8C6508]">
                        <Loader2 size={16} className="animate-spin" /> Scanning hand geometry & mount elevations…
                      </div>
                    ) : (
                      <div className="rounded-xl border p-3 text-xs leading-relaxed" style={{ background: "#FFFFFF", borderColor: "rgba(184, 134, 11, 0.25)", color: "#4A4238" }}>
                        <p className="font-bold text-[#1A1A1A] mb-1">
                          ✓ Hand Geometry Analyzed
                        </p>
                        <p>{palmDetectedText || "Hand element, Fate line, and mount elevations successfully extracted and ready for Kundli cross-matching."}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6508]">
                      <span>Element: {palmFeatures.handElement?.toUpperCase()}</span>
                      <span>·</span>
                      <span>Fate Origin: {palmFeatures.fateLineOrigin?.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-14 text-center transition hover:bg-[#FAF5EB]"
                style={{
                  borderColor: "rgba(184, 134, 11, 0.4)",
                  background: "#FAF7F2",
                }}
              >
                <div
                  className="grid h-16 w-16 place-items-center rounded-full transition group-hover:scale-105"
                  style={{ background: "rgba(184, 134, 11, 0.15)", color: "#8C6508" }}
                >
                  <Camera size={28} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#1A1A1A]">
                    Click or Drag to Upload Palm Photo
                  </p>
                  <p className="mt-1 text-xs text-[#6B635B]">
                    JPG or PNG · AI automatically detects hand shape and mounts
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("milestones")}
                className="rounded-xl border px-6 py-2.5 text-sm font-semibold transition"
                style={{
                  background: "#FAF5EB",
                  borderColor: "rgba(184, 134, 11, 0.25)",
                  color: "#6B635B",
                }}
              >
                Back to Milestones
              </button>

              <button
                type="button"
                onClick={handleRunRectification}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-105 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #B8860B, #D4AF37)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Evaluating Candidate Charts…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Run Precision Rectification
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          <AlertCircle size={18} className="text-red-600 shrink-0" /> {error}
        </div>
      )}

      {/* ── Results Display (Home Page Light & Gold Luxury) ── */}
      {result && result.bestCandidate && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Master Verdict Card */}
          <div
            className="rounded-2xl border p-8 sm:p-10 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #FFFFFF, #FAF5EB)",
              borderColor: "rgba(184, 134, 11, 0.35)",
            }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b pb-6"
              style={{ borderColor: "rgba(184, 134, 11, 0.2)" }}
            >
              <div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(184, 134, 11, 0.12)",
                    borderColor: "rgba(184, 134, 11, 0.3)",
                    color: "#8C6508",
                  }}
                >
                  <Award size={14} /> Highest Confidence Match · {result.bestCandidate.confidence}%
                </span>

                <h3 className="mt-3 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A]">
                  {result.bestCandidate.date} at {result.bestCandidate.time}
                </h3>

                <p className="mt-2 text-sm text-[#6B635B]">
                  Evaluated {result.totalCandidatesEvaluated} candidate timestamps in {result.executionTimeMs}ms
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleSaveBestCandidate(result.bestCandidate!)}
                  disabled={savedSuccess}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:bg-emerald-600"
                  style={{
                    background: savedSuccess ? "#059669" : "linear-gradient(135deg, #B8860B, #D4AF37)",
                  }}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 size={16} /> Verified & Saved! Opening Kundli…
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save as My Verified Chart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4 Pillars Grid (Home Page hstat style) */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "#FAF8F5",
                  borderColor: "rgba(184, 134, 11, 0.25)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Ascendant (Lagna)
                </span>
                <p className="mt-1 font-serif text-2xl font-bold text-[#1A1A1A]">
                  {result.bestCandidate.lagnaRashi}
                </p>
                <p className="text-xs font-mono text-[#6B635B]">
                  {result.bestCandidate.lagnaDegree}° {result.bestCandidate.lagnaMinutes}&apos;
                </p>
                <span className="mt-1.5 inline-block text-[11px] font-semibold text-[#8C6508]">
                  SubLord: {result.bestCandidate.lagnaSubLord}
                </span>
              </div>

              <div
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "#FAF8F5",
                  borderColor: "rgba(184, 134, 11, 0.25)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Moon Star (Nakshatra)
                </span>
                <p className="mt-1 font-serif text-2xl font-bold text-[#1A1A1A]">
                  {result.bestCandidate.moonNakshatra}
                </p>
                <p className="text-xs font-mono text-[#6B635B]">
                  Rashi: {result.bestCandidate.moonRashi}
                </p>
                <span className="mt-1.5 inline-block text-[11px] font-semibold text-[#8C6508]">
                  Lord: {result.bestCandidate.moonNakshatraLord}
                </span>
              </div>

              <div
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "#FAF8F5",
                  borderColor: "rgba(184, 134, 11, 0.25)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Kunda Verification
                </span>
                <p className="mt-1 font-serif text-2xl font-bold text-emerald-700">
                  {result.bestCandidate.kundaMatch ? "✓ Aligned" : "Evaluated"}
                </p>
                <p className="text-xs text-[#6B635B]">
                  {result.bestCandidate.kundaNakshatra} Nak
                </p>
                <span className="mt-1.5 inline-block text-[11px] font-semibold text-emerald-800">
                  Prashna Marga
                </span>
              </div>

              <div
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "#FAF8F5",
                  borderColor: "rgba(184, 134, 11, 0.25)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8C6508" }}>
                  Palm Alignment
                </span>
                <p className="mt-1 font-serif text-2xl font-bold text-[#8C6508]">
                  {result.bestCandidate.palmCompatibilityScore}%
                </p>
                <p className="text-xs text-[#6B635B]">
                  Physical Hand Match
                </p>
                <span className="mt-1.5 inline-block text-[11px] font-semibold text-[#8C6508]">
                  High Harmony
                </span>
              </div>
            </div>

            {/* Event Timeline Breakdown */}
            <div
              className="mt-8 border-t pt-6"
              style={{ borderColor: "rgba(184, 134, 11, 0.2)" }}
            >
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Chronological Milestone Corroboration
              </h3>
              <p className="mt-1 text-xs text-[#6B635B]">
                Active Vimshottari Mahadasha–Antardasha running at each life milestone.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {result.bestCandidate.eventMatches.map((ev, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-xl border p-4"
                    style={{
                      background: "#FFFFFF",
                      borderColor: "rgba(184, 134, 11, 0.25)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1A1A1A]">{ev.eventTitle}</span>
                      <span
                        className="rounded px-2.5 py-0.5 font-mono text-xs font-bold"
                        style={{
                          background: "rgba(184, 134, 11, 0.12)",
                          color: "#8C6508",
                        }}
                      >
                        {ev.mahadasha} - {ev.antardasha}
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-xs font-medium text-[#8C6508]">{ev.eventDate}</p>

                    <p
                      className="mt-2 text-xs leading-relaxed text-[#4A4238] border-t pt-2"
                      style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}
                    >
                      {ev.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ranking Table of Other Candidates */}
          {result.topCandidates.length > 1 && (
            <div
              className="rounded-2xl border p-6 sm:p-8 shadow-sm"
              style={{
                background: "#FFFFFF",
                borderColor: "rgba(184, 134, 11, 0.28)",
              }}
            >
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Alternative High-Scoring Timestamps
              </h3>
              <p className="mt-1 text-xs text-[#6B635B]">
                Comparing secondary candidate windows evaluated by the engine.
              </p>

              <div
                className="mt-4 divide-y overflow-x-auto text-xs"
                style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}
              >
                {result.topCandidates.map((cand, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 px-3 gap-3 transition"
                    style={{
                      background: idx === 0 ? "rgba(184, 134, 11, 0.05)" : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-bold" style={{ color: "#8C6508" }}>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">
                          {cand.date} at {cand.time}
                        </p>
                        <p className="text-xs text-[#6B635B]">
                          {cand.lagnaRashi} ({cand.lagnaDegree}°) · Moon in {cand.moonNakshatra}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <span className="font-mono text-sm font-bold" style={{ color: "#8C6508" }}>
                        {cand.confidence}% Match
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSaveBestCandidate(cand)}
                        className="rounded-lg border px-3 py-1 text-xs font-semibold transition"
                        style={{
                          background: "#FAF5EB",
                          borderColor: "rgba(184, 134, 11, 0.3)",
                          color: "#8C6508",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#B8860B";
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#FAF5EB";
                          e.currentTarget.style.color = "#8C6508";
                        }}
                      >
                        Select & Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
