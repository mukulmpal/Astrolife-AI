"use client";
import { PremiumFeature } from "@/components/premium-feature";
import { MarriageTimingAnalyzer } from "@/components/marriage/MarriageTimingAnalyzer";
import "@/app/dashboard/shared.css";

export default function MarriageTimingPage() {
  return (
    <div className="page">
      <div className="page-tag">💍 MARRIAGE TIMING</div>
      <h1 className="page-title serif">K.N. Rao Marriage Timing Engine</h1>
      <p className="page-sub">Analyze marriage timing windows using the 8-parameter K.N. Rao framework with divisional chart validation.</p>

      <PremiumFeature feature="Marriage Timing">
        <MarriageTimingAnalyzer />
      </PremiumFeature>
    </div>
  );
}
