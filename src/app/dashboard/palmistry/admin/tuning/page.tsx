import { PalmistryTuningDashboard } from "@/components/palmistry/admin/palmistry-tuning-dashboard";
import { generatePalmistryRuleTuningSuggestions } from "@/lib/palmistry/rule-tuning";

export const dynamic = "force-dynamic";

export default async function PalmistryTuningPage() {
  const suggestions = await generatePalmistryRuleTuningSuggestions({
    days: 90,
    minFeedback: 2,
  });

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <PalmistryTuningDashboard suggestions={suggestions} />
    </main>
  );
}
