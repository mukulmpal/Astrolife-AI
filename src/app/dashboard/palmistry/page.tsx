"use client";
import Link from "next/link";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { PremiumFeature } from "@/components/premium-feature";
import { PalmistryAnalyzer } from "@/components/palmistry/PalmistryAnalyzer";
import { ManualPalmistryWorkbench } from "@/components/palmistry/manual-palmistry-workbench";
import "@/app/dashboard/shared.css";

export default function PalmistryPage() {
  return (
    <div className="page">
      <PremiumFeature feature="AI Palmistry">
        <div className="mb-5 flex justify-end">
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

        <PalmistryAnalyzer />
        <ManualPalmistryWorkbench />
      </PremiumFeature>
    </div>
  );
}
