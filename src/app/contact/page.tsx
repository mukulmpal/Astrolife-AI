import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Contact | AstroLife AI",
  description: "Contact AstroLife AI for support, privacy, payments and launch inquiries.",
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact AstroLife AI"
      updated="May 23, 2026"
      intro="Use this page for support, privacy, payment and business inquiries while the product moves from beta to paid launch."
    >
      <LegalSection title="Support">
        <p>
          For product support, send the account email, affected feature, screenshot if possible
          and the approximate time of the issue. Include the request ID shown by any failed API
          response when available.
        </p>
      </LegalSection>
      <LegalSection title="Payments and Refunds">
        <p>
          For payment issues, include payment ID, amount, date and account email. Review the{" "}
          <Link href="/refund" style={{ color: "#facc15" }}>
            refund policy
          </Link>{" "}
          before sending a request.
        </p>
      </LegalSection>
      <LegalSection title="Privacy">
        <p>
          For privacy requests, include the account email and the action requested: correction,
          deletion or export.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

