"use client";

import { useMemo, useState } from "react";
import type { PalmCategory, PalmRuleReport } from "@/lib/palmistry/types";

const SECTION_LABELS: Partial<Record<PalmCategory, string>> = {
  hand_shape: "Hand Shape",
  thumb: "Thumb",
  fingers: "Fingers",
  mounts: "Mounts",
  major_lines: "Major Lines",
  personality: "Personality",
  career: "Career",
  wealth: "Wealth",
  relationship: "Relationship",
  vitality: "Vitality",
  health_vitality: "Health & Vitality",
  travel: "Travel",
  spirituality: "Spirituality",
  education: "Education",
  family: "Family",
  fame: "Fame",
  remedy: "Remedies",
  remedies: "Remedies",
  general: "General",
};

type PalmistryFeedbackProps = {
  sessionId: string | null;
  userId?: string | null;
  result: PalmRuleReport;
};

export function PalmistryFeedback({
  sessionId,
  userId,
  result,
}: PalmistryFeedbackProps) {
  const [rating, setRating] = useState(5);
  const [accurateSections, setAccurateSections] = useState<string[]>([]);
  const [inaccurateSections, setInaccurateSections] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections = useMemo(() => {
    return (result.sections ?? [])
      .filter((section) => section.hits.length > 0)
      .map((section) => section.id);
  }, [result.sections]);

  function toggleValue(value: string, list: string[], setList: (next: string[]) => void) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function submitFeedback() {
    if (!sessionId) {
      setError("Please save the report before giving feedback.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/palmistry/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId: userId ?? null,
          rating,
          accurateSections,
          inaccurateSections,
          feedback,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error ?? "Could not submit feedback.");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Feedback failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] bg-[#FAF7F2] p-5">
      <h3 className="text-lg font-semibold text-amber-200">Improve This Palmistry Engine</h3>
      <p className="mt-1 text-sm text-[#6B635B]">
        Your feedback helps AstroLife reduce weak rules and improve accuracy.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium text-[#1A1A1A]">Accuracy Rating</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`h-10 w-10 rounded-full border text-sm font-semibold ${
                rating === value
                  ? "border-amber-300 bg-amber-300 text-black"
                  : "border-[rgba(184,134,11,0.2)] bg-[#FAF7F2] text-[#3D3834]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <SectionPicker
        title="Which sections felt accurate?"
        sections={sections}
        selected={accurateSections}
        selectedClassName="border-emerald-300 bg-emerald-300/20 text-emerald-100"
        onToggle={(section) => toggleValue(section, accurateSections, setAccurateSections)}
      />

      <SectionPicker
        title="Which sections felt inaccurate?"
        sections={sections}
        selected={inaccurateSections}
        selectedClassName="border-red-300 bg-red-300/20 text-red-100"
        onToggle={(section) => toggleValue(section, inaccurateSections, setInaccurateSections)}
      />

      <textarea
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        placeholder="Tell us what felt true or wrong..."
        className="mt-5 min-h-24 w-full rounded-xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#8C827A] focus:border-amber-400/60"
      />

      <button
        type="button"
        onClick={submitFeedback}
        disabled={submitting || done}
        className="mt-4 w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {done ? "Feedback Submitted" : submitting ? "Submitting..." : "Submit Feedback"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function SectionPicker({
  title,
  sections,
  selected,
  selectedClassName,
  onToggle,
}: {
  title: string;
  sections: PalmCategory[];
  selected: string[];
  selectedClassName: string;
  onToggle: (section: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-[#1A1A1A]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={`${title}-${section}`}
            type="button"
            onClick={() => onToggle(section)}
            className={`rounded-full border px-3 py-1 text-xs ${
              selected.includes(section) ? selectedClassName : "border-[rgba(184,134,11,0.2)] text-[#3D3834]"
            }`}
          >
            {SECTION_LABELS[section] ?? section}
          </button>
        ))}
      </div>
    </div>
  );
}
