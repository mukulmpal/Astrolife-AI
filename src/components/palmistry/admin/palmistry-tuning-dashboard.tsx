import type { PalmistryRuleTuningSuggestion } from "@/lib/palmistry/rule-tuning";

function ActionBadge({ action }: { action: string }) {
  const label = action.replaceAll("_", " ");

  return (
    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs capitalize text-[#1A1A1A]">
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

        <h1 className="mt-3 text-3xl font-bold text-[#1A1A1A] md:text-5xl">
          Confidence Tuning Suggestions
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6B635B]">
          These are feedback-based suggestions. Review before applying them to
          tuning-overrides.ts.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-black/40 p-5">
        <h2 className="text-xl font-bold text-[#1A1A1A]">
          How to apply safely
        </h2>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[#6B635B]">
          <li>Review weak and strong rules.</li>
          <li>Copy approved override snippets.</li>
          <li>
            Paste them into{" "}
            <code className="rounded bg-[#FAF7F2] px-2 py-1 text-[#1A1A1A]">
              src/lib/palmistry/rules/tuning-overrides.ts
            </code>
          </li>
          <li>Run npm run build.</li>
          <li>Mark saved suggestion status as applied.</li>
        </ol>
      </div>

      <section className="mt-8 rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            Suggested Rule Changes
          </h2>

          <p className="text-sm text-[#8C827A]">
            {suggestions.length} suggestions
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-[#8C827A]">
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
                  className="border-t border-[rgba(184,134,11,0.18)] align-top text-[#3D3834]"
                >
                  <td className="max-w-[360px] py-4">
                    <p className="font-semibold text-[#1A1A1A]">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-600">{item.ruleId}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[#8C827A]">
                      {item.reason}
                    </p>

                    <pre className="mt-3 overflow-x-auto rounded-xl border border-[rgba(184,134,11,0.18)] bg-black p-3 text-xs text-[#1A1A1A]">
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
                    <span className="text-[#8C827A]">
                      {item.currentConfidenceBase}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-[#1A1A1A]">
                      {item.suggestedConfidenceBase}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="text-[#8C827A]">
                      {item.currentReportPriority}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-[#1A1A1A]">
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
          <div className="mt-8 rounded-2xl border border-[rgba(184,134,11,0.18)] bg-black/40 p-5">
            <p className="text-sm text-[#6B635B]">
              No tuning suggestions yet. Collect more feedback first.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
