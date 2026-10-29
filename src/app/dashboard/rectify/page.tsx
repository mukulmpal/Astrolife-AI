"use client";

import { BirthRectificationWorkbench } from "@/components/rectify/BirthRectificationWorkbench";
import { PremiumFeature } from "@/components/premium-feature";
import "@/app/dashboard/shared.css";

export default function RectifyPage() {
  return (
    <PremiumFeature feature="Birth Time Rectification (BTR Engine)" requiredTier="elite">
      <div className="page max-w-6xl mx-auto py-6 px-4">
        <BirthRectificationWorkbench />
      </div>
    </PremiumFeature>
  );
}
