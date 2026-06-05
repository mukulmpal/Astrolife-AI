"use client";
import { useState } from "react";
import Link from "next/link";
import { EngineIntro } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { PremiumFeature } from "@/components/premium-feature";
import { PalmistryAnalyzer } from "@/components/palmistry/PalmistryAnalyzer";
import { ManualPalmistryWorkbench } from "@/components/palmistry/manual-palmistry-workbench";
import "@/app/dashboard/shared.css";

export default function PalmistryPage() {
  const [mode, setMode] = useState<"scan" | "workbench">("scan");

  return (
    <div className="page">
      <PremiumFeature feature="AI Palmistry">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-2xl border border-amber-400/20 bg-black/30 p-1">
            {[
              { id: "scan", label: "AI Palm Scan" },
              { id: "workbench", label: "Intelligence Workbench" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id as typeof mode)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === item.id
                    ? "bg-amber-400 text-black"
                    : "text-amber-100 hover:bg-amber-400/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/palmistry/history"
            className="rounded-xl border border-amber-400/30 px-4 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/10"
          >
            View Palm History
          </Link>
        </div>

        {(() => {
          const intro = engineIntros['palmistry'];
          return <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />;
        })()}

        {mode === "scan" ? <PalmistryAnalyzer /> : <ManualPalmistryWorkbench />}
      </PremiumFeature>
    </div>
  );
}
