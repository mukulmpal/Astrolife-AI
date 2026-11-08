import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vedic Astrology Reports & Dossiers (From ₹49) | AstroLife AI",
  description:
    "Instant 24-page mathematical Vedic astrology dossiers on Sacred Union, Career Yogas, Astro-Vastu, Medical Health, and 10-Year Destiny Horary timelines. Instant vector PDF.",
  keywords: [
    "Kundali Milan PDF",
    "Marriage Timing Report",
    "Vedic Astrology Dossier",
    "Astro Vastu Report",
    "Career Raja Yoga Kundli",
    "Birth Time Rectification PDF",
    "Lal Kitab Remedies Report",
    "AstroLife Reports Store",
  ],
  alternates: {
    canonical: "https://astrolife-ai.vercel.app/reports",
  },
  openGraph: {
    title: "Vedic Astrology Reports & Dossiers (From ₹49) | AstroLife AI",
    description:
      "Get hyper-targeted 24-page mathematical dossiers computed from your exact birth coordinates by 35+ specialized Vedic engines. Instant vector PDF download.",
    url: "https://astrolife-ai.vercel.app/reports",
    siteName: "AstroLife AI",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Specialized Vedic Astrology Dossiers | AstroLife AI",
    description:
      "Instant 24-page precision astrological dossiers on Marriage, Career Yogas, Astro-Vastu, and Destiny Horary timelines.",
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "AstroLife Sacred Vedic Astrology Dossiers & Reports",
  description:
    "Hyper-targeted 24-page mathematical Vedic astrology dossiers on Sacred Union, Career Raja Yogas, Astro-Vastu, Medical Health, and 10-Year Destiny Horary timelines. Instant print-ready vector PDF.",
  brand: {
    "@type": "Brand",
    name: "AstroLife AI",
  },
  offers: {
    "@type": "AggregateOffer",
    url: "https://astrolife-ai.vercel.app/reports",
    priceCurrency: "INR",
    lowPrice: "49",
    highPrice: "999",
    offerCount: "30",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "1428",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How are AstroLife dossiers generated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every dossier is calculated deterministically using exact planetary coordinates, Swiss Ephemeris sidereal ephemerides, and canonical Parashari and Krishnamurti Paddhati rules. Zero generic AI halluncinations.",
      },
    },
    {
      "@type": "Question",
      name: "How soon do I receive my PDF report?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dossiers are compiled instantly in 30 to 60 seconds upon verified checkout. You get immediate PDF download access plus permanent storage in your Dashboard History Vault for lifetime re-download.",
      },
    },
    {
      "@type": "Question",
      name: "Do you recommend expensive gemstones or commercial poojas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. AstroLife adheres strictly to ethical Vedic Shastra: zero fear-mongering and 100% free, authentic classical remedies (Mantra japa, charity, directional harmony, and dietary balance).",
      },
    },
  ],
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
