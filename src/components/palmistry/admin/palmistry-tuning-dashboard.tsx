import type { PalmistryRuleTuningSuggestion } from "@/lib/palmistry/rule-tuning";

function ActionBadge({ action }: { action: string }) {
  const label = action.replaceAll("_", " ");

  return (
    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs capitalize text-amber-100">
      {label}
    </span>
  );
}

export function PalmistryTuningDashboard({
  suggestions,
}: {
  suggestions: PalmistryRuleTuningSuggestion[];
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70">
          AstroLife Palmistry Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold text-amber-100 md:text-5xl">
          Confidence Tuning Suggestions
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          These are feedback-based suggestions. Review before applying them to
          tuning-overrides.ts.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-black/40 p-5">
        <h2 className="text-xl font-bold text-amber-100">
          How to apply safely
        </h2>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>Review weak and strong rules.</li>
          <li>Copy approved override snippets.</li>
          <li>
            Paste them into{" "}
            <code className="rounded bg-zinc-900 px-2 py-1 text-amber-100">
              src/lib/palmistry/rules/tuning-overrides.ts
            </code>
          </li>
          <li>Run npm run build.</li>
          <li>Mark saved suggestion status as applied.</li>
        </ol>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-amber-100">
            Suggested Rule Changes
          </h2>

          <p className="text-sm text-zinc-500">
            {suggestions.length} suggestions
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              <tr>
                <th className="py-3">Rule</th>
                <th className="py-3">Action</th>
                <th className="py-3">Accuracy</th>
                <th className="py-3">Rating</th>
                <th className="py-3">Confidence</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Sample</th>
              </tr>
            </thead>

            <tbody>
              {suggestions.map((item) => (
                <tr
                  key={item.ruleId}
                  className="border-t border-zinc-800 align-top text-zinc-300"
                >
                  <td className="max-w-[360px] py-4">
                    <p className="font-semibold text-zinc-100">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-600">{item.ruleId}</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                      {item.reason}
                    </p>

                    <pre className="mt-3 overflow-x-auto rounded-xl border border-zinc-800 bg-black p-3 text-xs text-amber-100">
                      {item.overrideSnippet}
                    </pre>
                  </td>

                  <td className="py-4">
                    <ActionBadge action={item.action} />
                  </td>

                  <td className="py-4">
                    {Math.round(item.accuracyScore * 100)}%
                  </td>

                  <td className="py-4">{item.avgRating}</td>

                  <td className="py-4">
                    <span className="text-zinc-500">
                      {item.currentConfidenceBase}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-amber-100">
                      {item.suggestedConfidenceBase}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="text-zinc-500">
                      {item.currentReportPriority}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-amber-100">
                      {item.suggestedReportPriority}
                    </span>
                  </td>

                  <td className="py-4">{item.sampleSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {suggestions.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-sm text-zinc-400">
              No tuning suggestions yet. Collect more feedback first.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
