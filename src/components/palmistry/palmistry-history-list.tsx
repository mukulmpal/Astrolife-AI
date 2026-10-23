"use client";

import { useEffect, useState } from "react";

type PalmistryHistoryItem = {
  id: string;
  hand_side: string;
  dominant_hand?: string | null;
  report_style: string;
  user_tier: string;
  summary?: string | null;
  top_categories?: string[] | null;
  total_hits?: number | null;
  engine_version?: string | null;
  created_at: string;
};

export function PalmistryHistoryList({ userId }: { userId?: string | null }) {
  const [items, setItems] = useState<PalmistryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
        const response = await fetch(`/api/palmistry/history${query}`);
        const json = await response.json();

        if (!response.ok || !json.ok) throw new Error(json.error ?? "Could not load palmistry history.");

        setItems(json.sessions ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "History failed.");
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, [userId]);

  if (loading) return <p className="text-sm text-[#6B635B]">Loading palm reports...</p>;
  if (error) return <p className="text-sm text-red-300">{error}</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-5">
        <p className="text-sm text-[#6B635B]">No palmistry reports saved yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={`/dashboard/palmistry/${item.id}`}
          className="rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-5 transition hover:border-amber-400/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70">
                {item.report_style} · {item.user_tier}
              </p>
              <h3 className="mt-2 text-lg font-semibold capitalize text-[#1A1A1A]">{item.hand_side} palm report</h3>
            </div>
            <p className="text-xs text-[#8C827A]">{new Date(item.created_at).toLocaleDateString()}</p>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#6B635B]">
            {item.summary ?? "Saved AstroLife palmistry report"}
          </p>

          {item.top_categories?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.top_categories.slice(0, 6).map((category) => (
                <span key={category} className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-[#1A1A1A]">
                  {category}
                </span>
              ))}
            </div>
          ) : null}
        </a>
      ))}
    </div>
  );
}
