import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Astrology Disclaimer | AstroLife AI",
  description: "Important guidance disclaimer for AstroLife AI astrology and AI-generated outputs.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Astrology Disclaimer"
      updated="May 23, 2026"
      intro="AstroLife AI is designed for guidance, self-reflection and planning. It should not create fear, dependency or replace qualified professional help."
    >
      <LegalSection title="No Professional Substitute">
        <p>
          Outputs are not a substitute for doctors, lawyers, financial advisors, therapists,
          emergency services or other qualified professionals. For urgent or high-stakes issues,
          consult the right professional directly.
        </p>
      </LegalSection>
      <LegalSection title="Interpretive Nature">
        <p>
          Astrology systems use symbolic interpretation and timing logic. Different astrologers
          may interpret the same chart differently. Results should be read as guidance, not fixed
          destiny.
        </p>
      </LegalSection>
      <LegalSection title="User Decisions">
        <p>
          Users remain responsible for personal, relationship, business, medical and financial
          decisions. AstroLife AI does not guarantee outcomes from remedies, reports or predictions.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

