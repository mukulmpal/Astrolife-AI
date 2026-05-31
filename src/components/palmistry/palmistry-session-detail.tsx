"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AskMyPalmCard } from "./ask-my-palm-card";
import { PalmistryPdfButton } from "./palmistry-pdf-button";
import { PalmistryShareButton } from "./palmistry-share-button";
import type { PalmRuleReport, PalmRuleTier } from "@/lib/palmistry/types";

type PalmistrySession = {
  id: string;
  hand_side: string;
  report_style: string;
  user_tier: PalmRuleTier;
  summary?: string;
  result: PalmRuleReport;
  created_at: string;
};

function confidencePercent(value: number) {
  return Math.round(value > 1 ? value : value * 100);
}

export function PalmistrySessionDetail({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId?: string | null;
}) {
  const [session, setSession] = useState<PalmistrySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
        const response = await fetch(`/api/palmistry/session/${sessionId}${query}`);
        const json = await response.json();

        if (!response.ok || !json.ok) throw new Error(json.error ?? "Could not load palmistry session.");

        setSession(json.session);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Session failed.");
      } finally {
        setLoading(false);
      }
    }

    void loadSession();
  }, [sessionId, userId]);

  if (loading) return <p className="text-sm text-zinc-400">Loading report...</p>;
  if (error) return <p className="text-sm text-red-300">{error}</p>;
  if (!session) return <p className="text-sm text-zinc-400">Report not found.</p>;

  const result = session.result;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/dashboard/palmistry/history" className="text-sm text-zinc-400">Back to history</Link>
        <div className="flex flex-wrap gap-3">
          <PalmistryPdfButton />
          <PalmistryShareButton sessionId={session.id} userId={userId} />
        </div>
      </div>

      <section className="mt-8 rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-black via-zinc-950 to-stone-950 p-6 shadow-2xl print:border-0 print:bg-white print:text-black">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70 print:text-black">AstroLife Palmistry Report</p>
        <h1 className="mt-3 text-3xl font-bold text-amber-100 print:text-black md:text-5xl">AI Palm Reading Report</h1>
        <p className="mt-3 text-sm text-zinc-400 print:text-black">Generated on {new Date(session.created_at).toLocaleString()}</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 print:border print:bg-white">
          <h2 className="text-xl font-semibold text-amber-100 print:text-black">Summary</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300 print:text-black">{result.summary}</p>
        </div>

        <div className="mt-6 grid gap-4">
          {result.hits?.map((hit) => (
            <article key={hit.ruleId ?? hit.rule.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 print:border print:bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-zinc-100 print:text-black">{hit.title ?? hit.rule.title}</h3>
                <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-black">{confidencePercent(hit.confidence)}%</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400 print:text-black">
                {hit.interpretation ?? hit.rule.interpretation.luxury}
              </p>
              {hit.guardrail ?? hit.rule.guardrail ? (
                <p className="mt-2 text-xs text-zinc-500 print:text-black">Safe note: {hit.guardrail ?? hit.rule.guardrail}</p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 print:border print:bg-white">
          <h3 className="text-sm font-semibold text-zinc-100 print:text-black">Disclaimers</h3>
          {result.disclaimers?.map((item) => (
            <p key={item} className="mt-2 text-xs text-zinc-500 print:text-black">{item}</p>
          ))}
        </div>
      </section>

      <div className="mt-8 print:hidden">
        <AskMyPalmCard userTier={session.user_tier ?? "free"} sessionId={session.id} />
      </div>
    </div>
  );
}
