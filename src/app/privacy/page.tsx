import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | AstroLife AI",
  description: "How AstroLife AI handles birth details, account data, payments and support information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 23, 2026"
      intro="AstroLife AI uses birth details and chart inputs only to calculate and personalize astrology guidance. This page explains what we collect, why we collect it, and how users can request support."
    >
      <LegalSection title="Information We Collect">
        <p>
          We may collect name, birth date, birth time, birth place, calculated chart data,
          account identifiers, chat messages, payment status and support messages. Payment
          card or banking data is handled by the payment provider and is not stored by AstroLife AI.
        </p>
      </LegalSection>
      <LegalSection title="How We Use Data">
        <p>
          We use data to generate Kundli, dasha, transit, remedies, reports, AI chat responses,
          saved chart history, customer support, fraud prevention and product improvement.
        </p>
      </LegalSection>
      <LegalSection title="Data Sharing">
        <p>
          We do not sell personal birth data. We may share limited data with infrastructure,
          analytics, payment and support providers only when required to operate the service.
        </p>
      </LegalSection>
      <LegalSection title="User Choices">
        <p>
          Users can request correction, deletion or export of their saved account data by
          contacting support. Some transaction records may be retained where law or payment
          dispute handling requires it.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For privacy requests, contact AstroLife AI support through the contact page or the
          support email configured for the production launch.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

