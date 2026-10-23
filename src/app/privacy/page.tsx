import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | AstroLife AI",
  description:
    "AstroLife AI Privacy Policy: Full compliance with India DPDP Act 2023, GDPR, zero-retention ephemeral palm image scanning, and end-to-end encrypted astrological consultations.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy & Data Protection"
      updated="October 2026 (Compliant with India DPDP Act 2023 & Global GDPR)"
      intro="At AstroLife AI, we believe your cosmic and personal data is deeply sacred and private. This policy details how we protect your birth details, handle ephemeral palm scanner images with zero biometric retention, encrypt AI astrological consultations, and uphold your legal rights under India's Digital Personal Data Protection (DPDP) Act 2023 and the General Data Protection Regulation (GDPR)."
    >
      <LegalSection title="1. Regulatory Framework & Lawful Consent">
        <p>
          AstroLife AI operates under strict data minimization and privacy-by-design principles.
          In accordance with the <strong>Digital Personal Data Protection Act, 2023 (India)</strong>, the{" "}
          <strong>General Data Protection Regulation (EU/UK GDPR)</strong>, and applicable global data
          protection standards, we process your personal data solely on the lawful basis of your{" "}
          <strong>explicit, informed, and revocable consent</strong>. You have the right to withdraw
          your consent at any time.
        </p>
      </LegalSection>

      <LegalSection title="2. Categories of Information We Collect">
        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <strong style={{ color: "#facc15" }}>A. Astronomical Birth Coordinates:</strong>
            <p style={{ margin: "4px 0 0" }}>
              To compute your natal Vedic Kundli, planetary dashas, and transit ripples, we process your
              name (or pseudonym), date of birth, time of birth, and place of birth (converted to geographic
              latitude and longitude). This data is strictly used for mathematical ephemeris calculations.
            </p>
          </div>

          <div>
            <strong style={{ color: "#facc15" }}>
              B. AI Palm Scanner & Vision Imagery (Ephemeral Zero-Retention Policy):
            </strong>
            <p style={{ margin: "4px 0 0" }}>
              When you use our experimental AI Palmistry Vision Scanner, hand photos are processed
              ephemerally in volatile memory (or client-side on-device) solely to detect contour line vectors
              (Heart, Head, Life, and Fate lines).
            </p>
            <p style={{ margin: "6px 0 0", color: "#93c5fd" }}>
              🛡️ <strong>Zero Biometric Harvesting:</strong> We do NOT create or store biometric templates,
              fingerprints, or facial scans. Hand images are never permanently written to disk, are never
              linked to government identities, and are automatically discarded immediately after the line
              coordinates are extracted.
            </p>
          </div>

          <div>
            <strong style={{ color: "#facc15" }}>
              C. AI Astrological Consultations & Chat Records:
            </strong>
            <p style={{ margin: "4px 0 0" }}>
              Questions asked to the AstroLife AI assistant are encrypted in transit via TLS 1.3 and at rest
              using AES-256. Chat histories are private to your authenticated session. We do{" "}
              <strong>NOT</strong> sell, share, or use your private conversations to train public or
              open-source foundational LLM models.
            </p>
          </div>

          <div>
            <strong style={{ color: "#facc15" }}>D. Payment & Account Credentials:</strong>
            <p style={{ margin: "4px 0 0" }}>
              Account authentication is managed securely via encrypted sessions. Billing transactions are
              processed directly by certified PCI-DSS Level 1 compliant gateways (such as Stripe or Razorpay).
              AstroLife AI never touches, stores, or logs raw credit card numbers or banking passwords.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="3. How We Use Your Data">
        <p>Your data is used exclusively to deliver personalized astrological insights:</p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li>Generating high-precision Vedic Kundli, Navamsha, and Shodashvarga divisional charts.</li>
          <li>Computing 90-year Destiny Curves, Dasha hierarchies, and planetary transit ripples.</li>
          <li>Recommending classical Raagas and circadian audio protocols for mental and spiritual wellness.</li>
          <li>Synthesizing personalized AI consultation responses rooted in classical Jyotish shastras.</li>
          <li>Preventing fraud, safeguarding platform integrity, and customer support.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Absolute Prohibition on Data Selling">
        <p>
          <strong>We do not sell, rent, trade, or broker your personal information</strong> to data brokers,
          advertisers, insurance providers, or third-party marketing networks. Any data transfer to backend
          computational infrastructure (e.g., Swiss Ephemeris microservices) is performed over private,
          encrypted channels with strict zero-knowledge parameters.
        </p>
      </LegalSection>

      <LegalSection title="5. Your Legal Rights (DPDP Act 2023 & GDPR)">
        <p>Regardless of your geographic location, you enjoy full sovereignty over your personal data:</p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li>
            <strong>Right to Access & Summary:</strong> Request a complete copy of all birth records, saved
            profiles, and interaction history associated with your account.
          </li>
          <li>
            <strong>Right to Correction:</strong> Update or rectify erroneous birth times, coordinates, or
            profile names at any moment.
          </li>
          <li>
            <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request immediate and
            irreversible deletion of your profile, birth charts, and consultation transcripts.
          </li>
          <li>
            <strong>Right to Data Portability:</strong> Export your astronomical chart calculations in
            standardized machine-readable formats.
          </li>
          <li>
            <strong>Right to Revoke Consent:</strong> Withdraw your processing consent at any time without
            affecting prior lawful processing.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Data Retention & One-Click Deletion">
        <p>
          We retain your astrological profiles only as long as you maintain an active AstroLife account. If
          you choose to delete a profile or your entire account, all associated birth coordinates and chat
          transcripts are permanently expunged from our active database within 72 hours. To exercise this
          right, use the self-service Delete button in your Profile Settings or email us at{" "}
          <a href="mailto:privacy@astrolife.ai" style={{ color: "#facc15" }}>
            privacy@astrolife.ai
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Data Security Architecture">
        <p>
          We implement rigorous technical safeguards including end-to-end TLS 1.3 encryption for all data in
          transit, AES-256 encryption at rest, isolated database multi-tenancy, and regular vulnerability
          audits. Access to production databases is restricted to authorized personnel governed by strict
          least-privilege policies.
        </p>
      </LegalSection>

      <LegalSection title="8. Grievance Redressal & Data Protection Officer">
        <p>
          In compliance with Section 11 of the <strong>Digital Personal Data Protection Act, 2023</strong>{" "}
          and GDPR Article 37, we have appointed a dedicated Data Protection & Grievance Redressal Officer:
        </p>
        <div
          style={{
            marginTop: "12px",
            padding: "16px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "8px",
            border: "1px solid rgba(250, 204, 21, 0.2)",
          }}
        >
          <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#facc15" }}>
            Data Protection & Grievance Redressal Officer
          </p>
          <p style={{ margin: "0 0 4px" }}>AstroLife AI Legal & Privacy Team</p>
          <p style={{ margin: "0 0 4px" }}>
            Email:{" "}
            <a href="mailto:grievance@astrolife.ai" style={{ color: "#93c5fd" }}>
              grievance@astrolife.ai
            </a>{" "}
            (Inquiries resolved within 7 business days)
          </p>
          <p style={{ margin: 0 }}>General Privacy Inquiries: privacy@astrolife.ai</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
