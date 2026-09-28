import { PalmistryTuningDashboard } from "@/components/palmistry/admin/palmistry-tuning-dashboard";
import { generatePalmistryRuleTuningSuggestions } from "@/lib/palmistry/rule-tuning";

export const dynamic = "force-dynamic";

export default async function PalmistryTuningPage() {
  const suggestions = await generatePalmistryRuleTuningSuggestions({
    days: 90,
    minFeedback: 2,
  });

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 text-[#1A1A1A] md:px-8">
      <PalmistryTuningDashboard suggestions={suggestions} />
    </main>
  );
}
