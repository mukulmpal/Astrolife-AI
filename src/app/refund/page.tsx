import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy | AstroLife AI",
  description: "Refund rules for AstroLife AI reports, subscriptions and digital astrology products.",
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="May 23, 2026"
      intro="AstroLife AI sells digital astrology reports and premium features. This policy keeps refund handling clear before paid launch."
    >
      <LegalSection title="Digital Products">
        <p>
          Once a personalized report, paid reading or premium output has been generated, it is
          generally non-refundable because the digital service has already been delivered.
        </p>
      </LegalSection>
      <LegalSection title="Eligible Refund Cases">
        <p>
          Refunds may be considered for duplicate charges, confirmed payment errors, major
          technical failure where no premium output was delivered, or accidental purchase
          reported quickly before usage.
        </p>
      </LegalSection>
      <LegalSection title="Subscriptions">
        <p>
          Users may cancel future renewals when subscriptions are enabled. Partial refunds for
          used billing periods are not guaranteed unless required by law or approved by support.
        </p>
      </LegalSection>
      <LegalSection title="How to Request">
        <p>
          Contact support with payment ID, account email, purchase date and a short explanation.
          Approved refunds are processed through the original payment provider.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

