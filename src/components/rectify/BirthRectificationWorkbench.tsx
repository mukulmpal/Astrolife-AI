"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  ShieldCheck,
  Hand,
  TrendingUp,
  Award,
  Loader2,
  ChevronDown,
  ChevronUp,
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

const EVENT_PRESETS: { category: BTREventCategory; label: string; icon: string }[] = [
  { category: "career_start", label: "First Job / Career Start", icon: "💼" },
  { category: "promotion", label: "Job Promotion / Raise", icon: "📈" },
  { category: "job_change", label: "Job Switch / Transition", icon: "🔄" },
  { category: "job_loss", label: "Job Loss / Layoff", icon: "⚠️" },
  { category: "marriage", label: "Marriage / Union", icon: "💍" },
  { category: "relationship_break", label: "Breakup / Betrayal", icon: "💔" },
  { category: "far_travel", label: "Far Travel / Relocation", icon: "✈️" },
  { category: "sibling_milestone", label: "Sibling Milestone / Marriage", icon: "👥" },
  { category: "home_loss", label: "Loss of Home / Crisis", icon: "🏚️" },
  { category: "asset_purchase", label: "Home / Vehicle Purchase", icon: "🏠" },
  { category: "health_crisis", label: "Health Issue / Surgery", icon: "🏥" },
];

export function BirthRectificationWorkbench() {
  const router = useRouter();
  const { setBirthData } = useUserChart();

  // Basic search inputs
  const [name, setName] = useState("Friend");
  const [city, setCity] = useState("New Delhi");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [startDate, setStartDate] = useState("2001-06-25");
  const [endDate, setEndDate] = useState("2001-06-30");
  const [startTime, setStartTime] = useState("01:00");
  const [endTime, setEndTime] = useState("04:00");
  const [stepMinutes, setStepMinutes] = useState(5);

  // Life milestones list
  const [events, setEvents] = useState<BTREvent[]>([
    { title: "First Job Started", date: "2020-08-05", category: "career_start" },
    { title: "Lost Job / Layoff", date: "2023-05-02", category: "job_loss" },
    { title: "Far Travel & WFH Tension", date: "2024-05-24", category: "far_travel" },
    { title: "Brother's Marriage", date: "2025-01-15", category: "sibling_milestone" },
    { title: "New Stable WFH Job", date: "2025-03-28", category: "career_start" },
  ]);

  // Palmistry features
  const [showPalmSection, setShowPalmSection] = useState(true);
  const [handElement, setHandElement] = useState<BTRPalmInput["handElement"]>("air");
  const [fateLineOrigin, setFateLineOrigin] = useState<BTRPalmInput["fateLineOrigin"]>("moon");
  const [prominentMounts, setProminentMounts] = useState<string[]>(["venus", "moon"]);

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

  const toggleMount = (mount: string) => {
    setProminentMounts((prev) =>
      prev.includes(mount) ? prev.filter((m) => m !== mount) : [...prev, mount]
    );
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
        palmFeatures: {
          handElement,
          fateLineOrigin,
          prominentMounts,
        },
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
    <div className="space-y-8 text-white">
      {/* ── Intro Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#c8a030]/25 bg-[radial-gradient(ellipse_at_top,rgba(200,160,48,0.15),transparent_60%)] p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a030]/30 bg-[#c8a030]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#e6c869]">
          <Sparkles size={13} /> CLASSICAL NASHTA JATAKA & KP BTR ENGINE
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
          Precision Birth Time & Date Rectification
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A8A199]">
          Don&apos;t know your exact birth time or date? Our 4-tier astronomical engine cross-matches your verified life events, Kunda algorithm, and palm hand geometry to identify your exact birth moment.
        </p>
      </div>

      {/* ── Configuration Form Grid ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Window & Person Details */}
        <div className="rounded-2xl border border-white/10 bg-[#161616]/80 p-5 backdrop-blur-md space-y-5">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#e6c869]">
            <Clock size={18} /> 1. Search Window
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#A8A199]">Name / Alias</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A8A199]">Birth City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#A8A199]">Window Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A8A199]">Window End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#A8A199]">Approx From</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A8A199]">Approx To</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A8A199]">Step Size</label>
              <select
                value={stepMinutes}
                onChange={(e) => setStepMinutes(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm focus:border-[#c8a030] focus:outline-none"
              >
                <option value={2}>2 Minutes (Fine)</option>
                <option value={5}>5 Minutes (Balanced)</option>
                <option value={10}>10 Minutes (Fast)</option>
              </select>
            </div>
          </div>

          {/* Palm Clues Toggle Section */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setShowPalmSection(!showPalmSection)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#e6c869]"
            >
              <span className="flex items-center gap-2">
                <Hand size={16} /> Optional: Palmistry Clues
              </span>
              {showPalmSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showPalmSection && (
              <div className="mt-4 space-y-4 rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs text-[#A8A199]">
                <div>
                  <label className="block mb-1.5 font-medium">Hand Element Archetype</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "fire", label: "Fire (Dynamic)" },
                      { id: "earth", label: "Earth (Practical)" },
                      { id: "air", label: "Air (Intellectual)" },
                      { id: "water", label: "Water (Artistic)" },
                    ].map((el) => (
                      <button
                        key={el.id}
                        type="button"
                        onClick={() => setHandElement(el.id as BTRPalmInput["handElement"])}
                        className={`rounded-lg py-1.5 px-2 text-[11px] font-semibold border transition ${
                          handElement === el.id
                            ? "border-[#c8a030] bg-[#c8a030]/20 text-[#e6c869]"
                            : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        {el.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-medium">Fate Line Origin</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "moon", label: "Mount of Moon (Remote/Creative)" },
                      { id: "wrist", label: "Wrist / Base (Self-Made)" },
                      { id: "venus", label: "Venus (Family Support)" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFateLineOrigin(f.id as BTRPalmInput["fateLineOrigin"])}
                        className={`rounded-lg py-1.5 px-2 text-[11px] font-semibold border transition ${
                          fateLineOrigin === f.id
                            ? "border-[#c8a030] bg-[#c8a030]/20 text-[#e6c869]"
                            : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-medium">Prominent Mounts</label>
                  <div className="flex flex-wrap gap-2">
                    {["venus", "moon", "jupiter", "saturn", "sun", "mercury", "mars"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMount(m)}
                        className={`rounded-lg py-1 px-2.5 text-[11px] font-semibold border transition capitalize ${
                          prominentMounts.includes(m)
                            ? "border-[#c8a030] bg-[#c8a030]/20 text-[#e6c869]"
                            : "border-white/10 text-white/70 hover:bg-white/5"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verified Life Milestones */}
        <div className="rounded-2xl border border-white/10 bg-[#161616]/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#e6c869]">
              <Calendar size={18} /> 2. Verified Life Milestones ({events.length})
            </h2>
            <span className="text-[11px] text-[#A8A199]">Min. 2-5 recommended</span>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1">
            {events.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2.5"
              >
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateEvent(idx, "title", e.target.value)}
                  className="flex-1 bg-transparent text-xs font-medium text-white focus:outline-none"
                  placeholder="Event title"
                />
                <input
                  type="date"
                  value={event.date}
                  onChange={(e) => updateEvent(idx, "date", e.target.value)}
                  className="w-32 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] text-[#e6c869] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeEvent(idx)}
                  className="p-1 text-white/40 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] text-[#A8A199]">Quick Add Milestone:</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {EVENT_PRESETS.map((preset) => (
                <button
                  key={preset.category}
                  type="button"
                  onClick={() => addEvent(preset.category, preset.label)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:border-[#c8a030]/50 hover:bg-[#c8a030]/10"
                >
                  <span>{preset.icon}</span> {preset.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunRectification}
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c8a030] to-[#e6c869] py-3 text-sm font-bold text-black shadow-lg transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Evaluating Candidate Charts…
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run Precision Rectification
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── Results Display ── */}
      {result && result.bestCandidate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Banner / Verdict */}
          <div className="rounded-3xl border border-[#c8a030]/40 bg-gradient-to-b from-[#c8a030]/15 to-black/60 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c8a030]/20 px-3 py-1 text-xs font-semibold text-[#e6c869]">
                  <Award size={13} /> BEST RECTIFIED MATCH · {result.bestCandidate.confidence}% CONFIDENCE
                </span>
                <h3 className="mt-3 font-serif text-3xl font-bold text-white">
                  {result.bestCandidate.date} at {result.bestCandidate.time}
                </h3>
                <p className="mt-1 text-sm text-[#A8A199]">
                  Evaluated {result.totalCandidatesEvaluated} candidate charts in {result.executionTimeMs}ms
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveBestCandidate(result.bestCandidate!)}
                  disabled={savedSuccess}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c8a030] px-5 py-2.5 text-sm font-bold text-black shadow-md hover:brightness-110 disabled:bg-emerald-500 disabled:text-white"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 size={16} /> Chart Saved! Redirecting…
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save This as My Verified Chart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Micro Pillars Breakdown */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[11px] text-[#A8A199]">Ascendant (Lagna)</span>
                <p className="mt-1 font-serif text-base font-bold text-white">
                  {result.bestCandidate.lagnaRashi} ({result.bestCandidate.lagnaDegree}°{result.bestCandidate.lagnaMinutes}&apos;)
                </p>
                <span className="text-[10px] text-[#e6c869]">SubLord: {result.bestCandidate.lagnaSubLord}</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[11px] text-[#A8A199]">Moon Nakshatra</span>
                <p className="mt-1 font-serif text-base font-bold text-white">
                  {result.bestCandidate.moonNakshatra}
                </p>
                <span className="text-[10px] text-[#e6c869]">{result.bestCandidate.moonRashi} Rashi</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[11px] text-[#A8A199]">Kunda Method</span>
                <p className="mt-1 font-serif text-base font-bold text-white">
                  {result.bestCandidate.kundaMatch ? "✓ Aligned" : "Partial"}
                </p>
                <span className="text-[10px] text-[#e6c869]">{result.bestCandidate.kundaNakshatra} Nak</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[11px] text-[#A8A199]">Palm Compatibility</span>
                <p className="mt-1 font-serif text-base font-bold text-white">
                  {result.bestCandidate.palmCompatibilityScore}%
                </p>
                <span className="text-[10px] text-[#e6c869]">Physical match</span>
              </div>
            </div>

            {/* Event Breakdown */}
            <div className="mt-6 border-t border-white/10 pt-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e6c869]">
                Verified Milestone Alignment
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {result.bestCandidate.eventMatches.map((ev, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-xl border border-white/5 bg-black/30 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{ev.eventTitle}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-[#e6c869]">
                        {ev.mahadasha} - {ev.antardasha}
                      </span>
                    </div>
                    <span className="mt-1 text-[11px] text-white/50">{ev.eventDate}</span>
                    <p className="mt-2 text-[11px] text-[#A8A199] leading-relaxed">
                      {ev.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Candidates Ranking Table */}
          {result.topCandidates.length > 1 && (
            <div className="rounded-2xl border border-white/10 bg-[#161616]/80 p-5 backdrop-blur-md">
              <h4 className="font-serif text-base font-semibold text-[#e6c869]">
                Other Top Candidate Timestamps
              </h4>
              <div className="mt-3 divide-y divide-white/5 overflow-x-auto text-xs">
                {result.topCandidates.map((cand, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 px-2 hover:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white/40">#{idx + 1}</span>
                      <span className="font-semibold text-white">{cand.date} at {cand.time}</span>
                      <span className="text-[#A8A199]">{cand.lagnaRashi} ({cand.lagnaDegree}°)</span>
                      <span className="text-[#A8A199]">Moon: {cand.moonNakshatra}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#e6c869]">{cand.confidence}%</span>
                      <button
                        type="button"
                        onClick={() => handleSaveBestCandidate(cand)}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] hover:bg-[#c8a030]/20 hover:text-[#e6c869]"
                      >
                        Select
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
