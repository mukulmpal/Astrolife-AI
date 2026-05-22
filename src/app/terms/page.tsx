import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | AstroLife AI",
  description: "AstroLife AI terms for astrology guidance, accounts, payments and acceptable use.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="May 23, 2026"
      intro="AstroLife AI provides guidance-oriented Vedic astrology tools. By using the service, users agree to use outputs responsibly and not as a replacement for professional advice."
    >
      <LegalSection title="Nature of Service">
        <p>
          Astrology reports, AI chat responses, remedies and predictions are interpretive
          guidance. They are not medical, legal, financial, psychological or emergency advice.
        </p>
      </LegalSection>
      <LegalSection title="User Responsibility">
        <p>
          Users are responsible for entering accurate birth details and making their own life
          decisions. The service should be used for reflection, timing awareness and planning,
          not fear-based dependency.
        </p>
      </LegalSection>
      <LegalSection title="Accounts and Payments">
        <p>
          Paid features may require an account, successful payment and active entitlement.
          AstroLife AI may limit, suspend or revoke access for abuse, fraud, chargeback misuse
          or attempts to bypass gating.
        </p>
      </LegalSection>
      <LegalSection title="Acceptable Use">
        <p>
          Users must not attack the service, scrape private data, reverse engineer protected
          systems, impersonate others or use outputs to harass, threaten or discriminate.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update features, pricing and these terms as the product evolves. Continued use
          after changes means the user accepts the updated terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

