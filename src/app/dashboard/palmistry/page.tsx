"use client";
import { PremiumFeature } from "@/components/premium-feature";
import { PalmistryAnalyzer } from "@/components/palmistry/PalmistryAnalyzer";
import { ManualPalmistryWorkbench } from "@/components/palmistry/manual-palmistry-workbench";
import "@/app/dashboard/shared.css";

export default function PalmistryPage() {
  return (
    <div className="page">
      <PremiumFeature feature="AI Palmistry">
        <PalmistryAnalyzer />
        <ManualPalmistryWorkbench />
      </PremiumFeature>
    </div>
  );
}
