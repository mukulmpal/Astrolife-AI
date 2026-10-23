import { PalmistryPdfButton } from "@/components/palmistry/palmistry-pdf-button";
import { getPalmistrySessionByShareToken } from "@/lib/palmistry/storage";
import type { PalmRuleReport } from "@/lib/palmistry/types";

function confidencePercent(value: number) {
  return Math.round(value > 1 ? value : value * 100);
}

export default async function SharedPalmistryReportPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const session = await getPalmistrySessionByShareToken(shareToken);
  const result = session.result as PalmRuleReport;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8 print:bg-white print:text-black">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex justify-end print:hidden">
          <PalmistryPdfButton />
        </div>

        <div className="rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-black via-zinc-950 to-stone-950 p-6 print:border-0 print:bg-white">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70 print:text-black">Shared AstroLife Palmistry Report</p>
          <h1 className="mt-3 text-3xl font-bold text-amber-100 print:text-black md:text-5xl">AI Palm Reading Report</h1>
          <p className="mt-3 text-sm text-zinc-400 print:text-black">{new Date(session.created_at).toLocaleString()}</p>

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
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
