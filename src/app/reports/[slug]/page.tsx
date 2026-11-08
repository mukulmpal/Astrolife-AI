import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SEO_LANDING_PAGES, type SeoLandingPageData } from "@/lib/report-seo-catalog";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SEO_LANDING_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = SEO_LANDING_PAGES[slug];

  if (!pageData) {
    return {
      title: "Vedic Astrology Dossier | AstroLife AI",
    };
  }

  const canonicalUrl = `https://astrolife-ai.vercel.app/reports/${slug}`;

  return {
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    keywords: pageData.targetKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageData.metaTitle,
      description: pageData.metaDescription,
      url: canonicalUrl,
      siteName: "AstroLife AI",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.metaTitle,
      description: pageData.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function ReportSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const data = SEO_LANDING_PAGES[slug];

  if (!data) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.h1,
    description: data.metaDescription,
    image: "https://astrolife-ai.vercel.app/icons/icon-512.png",
    brand: {
      "@type": "Brand",
      name: "AstroLife AI",
    },
    offers: {
      "@type": "Offer",
      url: `https://astrolife-ai.vercel.app/reports/${slug}`,
      priceCurrency: "INR",
      price: data.price.replace(/[^0-9]/g, ""),
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "AstroLife AI",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data.rating.score,
      reviewCount: data.rating.count.replace(/[^0-9]/g, ""),
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://astrolife-ai.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Reports Store",
        item: "https://astrolife-ai.vercel.app/reports",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.h1,
        item: `https://astrolife-ai.vercel.app/reports/${slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans antialiased selection:bg-[#c8a030]/20 pb-20">
      {/* Structured Data Scripts for Google Search Engine */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Top Breadcrumb Navigation */}
      <header className="border-b border-[#E7DFD5] bg-[#FFFFFF]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#6B635B] overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#c8a030] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/reports" className="hover:text-[#c8a030] transition-colors">
              Reports Store
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold truncate max-w-[200px] sm:max-w-none">
              {data.h1}
            </span>
          </nav>

          <Link
            href="/reports"
            className="text-[#c8a030] hover:text-[#a07820] font-semibold text-xs flex items-center gap-1 shrink-0 ml-4"
          >
            <span>← All Reports</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-10 pb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a030]/15 border border-[#c8a030]/30 text-[#a07820] text-xs font-bold tracking-wide w-fit mx-auto sm:mx-0">
            <span>{data.badge}</span>
            <span>•</span>
            <span>{data.pageCount} Vector PDF</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-[#6B635B]">
            <span className="text-[#c8a030] font-bold">★ {data.rating.score}</span>
            <span>({data.rating.count} verified ratings)</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">
          {data.h1}
        </h1>

        <p className="text-base sm:text-lg text-[#6B635B] max-w-3xl leading-relaxed mb-6">
          {data.h2Subtitle}
        </p>

        {/* Vargas Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-8">
          {data.vargas.map((vg, i) => (
            <span
              key={i}
              className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-white border border-[#E7DFD5] text-[#4A4238] shadow-2xs"
            >
              ✦ {vg}
            </span>
          ))}
        </div>

        {/* Pricing & Instant Buy Card */}
        <div className="bg-white border-2 border-[#c8a030] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(200,160,48,0.14)] mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-1">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A]">
                  {data.price}
                </span>
                <span className="text-sm text-[#9C948A] line-through font-medium">
                  {data.originalPrice}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#16a34a]/15 text-[#16a34a] font-bold">
                  80% Off Launch Special
                </span>
              </div>
              <p className="text-xs text-[#6B635B]">
                One-time payment • Lifetime re-download from History Vault • Email delivery included
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Link
                href="/reports"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#c8a030] to-[#a07820] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-transform active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>Get Instant Dossier · {data.price}</span>
              </Link>

              <Link
                href="/reports"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#c8a030]/50 text-[#8C6508] font-semibold text-xs hover:bg-[#F2EDE2] transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <span>👁️</span>
                <span>View Sample Preview</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7DFD5] flex flex-wrap items-center justify-around gap-4 text-xs text-[#6B635B]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#16a34a]">✓</span>
              <span>{data.deliveryTime}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#16a34a]">✓</span>
              <span>100% Free Satvik Remedies</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#16a34a]">✓</span>
              <span>Calculated via Swiss Ephemeris</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#16a34a]">✓</span>
              <span>Zero Fear-Mongering Guarantee</span>
            </span>
          </div>
        </div>
      </section>

      {/* Core Highlights Grid */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-8 text-center sm:text-left">
          Scientific Mathematical Precision • 4 Architectural Pillars
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.coreHighlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-xs hover:border-[#c8a030]/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#c8a030]/15 text-[#a07820] font-bold text-sm flex items-center justify-center mb-3">
                {idx + 1}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Included Chapters Breakdown */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-[#FFFFFF] border border-[#E7DFD5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Inside Your {data.pageCount} Dossier
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#16a34a]/10 text-[#16a34a] text-xs font-bold">
              Print-Ready Vector PDF
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]"
              >
                <span className="text-[#c8a030] font-bold text-sm shrink-0 mt-0.5">
                  Ch {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-[#1A1A1A] font-medium leading-relaxed">
                  {ch}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: AstroLife vs Generic Computer Kundli */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6 text-center">
          Why Discerning Seekers Choose AstroLife AI
        </h2>

        <div className="bg-white border border-[#E7DFD5] rounded-3xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-3 bg-[#FAF7F2] border-b border-[#E7DFD5] p-4 text-xs font-bold text-[#6B635B]">
            <div>Feature / Precision</div>
            <div className="text-center text-[#9C948A]">Generic Computer Horoscopes</div>
            <div className="text-center text-[#c8a030]">AstroLife AI Shastra Dossier</div>
          </div>

          <div className="divide-y divide-[#E7DFD5] text-xs">
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-[#1A1A1A]">Ephemeris Precision</span>
              <span className="text-center text-[#6B635B]">Coarse approximate degrees</span>
              <span className="text-center text-[#16a34a] font-bold">Swiss Ephemeris 0.001 arcsec</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center bg-[#FAF7F2]/40">
              <span className="font-semibold text-[#1A1A1A]">Divisional Varga Charts</span>
              <span className="text-center text-[#6B635B]">Only D-1 Rashi</span>
              <span className="text-center text-[#16a34a] font-bold">D-1 to D-60 Harmonic Shodashavarga</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-[#1A1A1A]">Dosha Exception Scanning</span>
              <span className="text-center text-[#6B635B]">Fear-mongering auto-dosha</span>
              <span className="text-center text-[#16a34a] font-bold">14+ Classical Shastra Exceptions</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center bg-[#FAF7F2]/40">
              <span className="font-semibold text-[#1A1A1A]">Remedial Approach</span>
              <span className="text-center text-[#6B635B]">Selling ₹50,000 gemstones</span>
              <span className="text-center text-[#16a34a] font-bold">100% Free Satvik classical Upayas</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-[#1A1A1A]">Access Lifetime</span>
              <span className="text-center text-[#6B635B]">Link expires in 24 hours</span>
              <span className="text-center text-[#16a34a] font-bold">Permanent Lifetime Vault + Email PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (SEO Structured) */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {data.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E7DFD5] rounded-2xl p-5 shadow-2xs text-left"
            >
              <h3 className="font-serif font-bold text-base text-[#1A1A1A] mb-2">
                Q: {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E7DFD5] py-3.5 px-4 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#6B635B] hidden sm:block">
              {data.h1}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-[#1A1A1A]">{data.price}</span>
              <span className="text-xs text-[#9C948A] line-through">{data.originalPrice}</span>
              <span className="text-[10px] text-[#16a34a] font-bold">Instant Vector PDF</span>
            </div>
          </div>

          <Link
            href="/reports"
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#c8a030] to-[#a07820] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>⚡ Unlock Dossier · {data.price}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
