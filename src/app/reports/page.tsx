"use client";

import React, { useState } from "react";
import Link from "next/link";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

interface ReportItem {
  id: string;
  title: string;
  tagline: string;
  price: string;
  paise: number;
  vargas: string[];
  badge?: string;
  badgeColor?: string;
  popular?: boolean;
  sections: string[];
  description: string;
  deliveryTime: string;
}

export default function ReportsStorePage() {
  const [activeTab, setActiveTab] = useState<"master" | "single" | "sovereign">("master");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Customer contact details for report delivery
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  const [purchasedReport, setPurchasedReport] = useState<{
    id: string;
    title: string;
    price: string;
    order_id: string;
    payment_id: string;
  } | null>(null);

  // 1. Five Master Life Solution Packs (Combining multiple engines into high-value dossiers)
  const masterReports: ReportItem[] = [
    {
      id: "career_wealth",
      title: "💼 Career, Business & Wealth Super-Dossier",
      tagline: "High-precision KP Sub-Lord, D10 Dashamsha & Ashtakavarga financial forecast.",
      price: "₹199",
      paise: 19900,
      vargas: ["D1", "D10", "KP Sub-Lord", "Ashtakavarga"],
      badge: "🔥 Most Popular",
      badgeColor: "bg-[#c8a030] text-[#FAF7F2]",
      popular: true,
      deliveryTime: "60 Seconds Delivery",
      description:
        "Comprehensive 22-page financial and professional blueprint. Identifies exact job change windows, promotion probabilities, business viability, and auspicious investment timings.",
      sections: [
        "10th House Karma & 2nd/11th House Wealth Analysis",
        "D-10 Dashamsha Career Micro-Architecture",
        "KP System Ruling Planets & Precise Sub-Lord Predictions",
        "Sarvashtakavarga Financial Strengths & Favorable Sectors",
        "12-Month Professional Timeline & Favorable Quarters",
      ],
    },
    {
      id: "vivah_destiny",
      title: "💍 Vivah & Relationship Destiny Suite",
      tagline: "D-9 Navamsha, Marriage Timing Scanner, Kundali Milan & Mangal Dosha.",
      price: "₹199",
      paise: 19900,
      vargas: ["D1", "D9 Navamsha", "36-Guna", "Synastry"],
      badge: "⭐ Top Requested",
      badgeColor: "bg-[#e11d48] text-white",
      popular: true,
      deliveryTime: "60 Seconds Delivery",
      description:
        "Deep-dive 20-page marital dossier. Reveals spouse characteristics, exact marriage timing windows, Mangal dosha mitigation, and Ashtakoota compatibility analysis.",
      sections: [
        "7th House Lord, Kalatra Karaka (Venus/Jupiter) Analysis",
        "D-9 Navamsha Chart & Life Partner Personality Blueprint",
        "12-Month Marriage Timing Window Scanner",
        "Mangal Dosha & Bhakoot/Nadi Dosha In-depth Mitigation",
        "Classical Marital Remedies & Shubh Vivah Muhurat Guidelines",
      ],
    },
    {
      id: "lalkitab_vault",
      title: "🛡️ Karmic Debt & Lal Kitab Upay Vault",
      tagline: "Pitra/Matra Rin diagnosis, instant classical totke & gemstone prescription.",
      price: "₹149",
      paise: 14900,
      vargas: ["Lal Kitab 1952", "Pitra Rin", "Beej Mantra", "Gemstone"],
      badge: "⚡ Instant Remedies",
      badgeColor: "bg-[#16a34a] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Actionable 16-page remedial playbook. Decodes hidden ancestral karmic debts (Rin), unblocks stagnant financial energy, and prescribes zero-cost classical Lal Kitab remedies.",
      sections: [
        "Identification of 9 Major Lal Kitab Rins (Pitra, Matra, Stri Rin)",
        "Household Omens & Subconscious Behavioral Corrections",
        "House-Wise Precise Classical Lal Kitab Remedies (Totke)",
        "Personalized Natural Gemstone, Rudraksha & Metal Guide",
        "Daily & Weekly Dos and Don'ts for Planetary Harmony",
      ],
    },
    {
      id: "vastu_space",
      title: "🏡 Astro-Vastu & Space Energy Alignment",
      tagline: "16 Vedic directions, home compass & astrological space alignment.",
      price: "₹199",
      paise: 19900,
      vargas: ["16 Directions", "Vastu Compass", "Sarvatobhadra"],
      badge: "🏡 Home & Business",
      badgeColor: "bg-[#0284c7] text-white",
      deliveryTime: "60 Seconds Delivery",
      description:
        "18-page spatial intelligence report. Maps your Janam Kundli planets directly onto your home's 16 Vastu zones. Identifies directional flaws creating financial drain or health stress.",
      sections: [
        "Birth Chart Planet-to-Home Zone Mapping (16 Directions)",
        "Entrance, Master Bedroom & Pooja Mandir Directional Audit",
        "Remedies for North-East (Ishan) & South-West (Nairutya) Flaws",
        "Elemental Balance: Fire, Water, Air, Earth & Space Energy",
        "Non-Destructive Vastu Cures (Colors, Metals & Pyramids)",
      ],
    },
    {
      id: "mind_health",
      title: "⚕️ Mind, Health & Vitality Shield",
      tagline: "Medical astrology, mental clarity patterns & Shadbala vitality scores.",
      price: "₹149",
      paise: 14900,
      vargas: ["D1", "D3 Drekkana", "6th House", "Shadbala"],
      badge: "🌿 Ayurvedic Balance",
      badgeColor: "bg-[#059669] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "15-page vitality and wellness forecast. Analyzes 6th/8th house vulnerabilities, psychosomatic stress triggers, and prescribes Ayurvedic lifestyle alignment.",
      sections: [
        "Ascendant Strength & 6-Fold Shadbala Planetary Vitality",
        "6th & 8th House Vulnerability Analysis (Roga Vichar)",
        "Ayurvedic Tridosha Mapping: Vata, Pitta, Kapha Balance",
        "Mental Resilience & Moon-Mercury Emotional Axis",
        "Planetary Fasting & Daily Solar/Lunar Energy Habits",
      ],
    },
  ];

  // 2. Specialized Single-Engine Tools (Unbundled micro-tools for specific needs)
  const singleEngineReports: ReportItem[] = [
    {
      id: "btr_mathematical",
      title: "⏱️ Mathematical Birth Time Rectification (BTR)",
      tagline: "Exact minute calculation via Tattwa Shodhana & KP ruling planets.",
      price: "₹149",
      paise: 14900,
      vargas: ["BTR Engine", "KP Ruling", "Tattwa Shodhana"],
      badge: "🔬 High Precision",
      badgeColor: "bg-[#7c3aed] text-white",
      deliveryTime: "Instant Verification",
      description:
        "For seekers whose birth time is uncertain (e.g. 'between 4:15 PM and 4:45 PM'). Uses verified life milestones and planetary sub-lords to lock your exact astrological second.",
      sections: [
        "Pre-natal Epoch & Tattwa Shodhana Gender Verification",
        "KP Ruling Planets Alignment at Query Time",
        "Milestone Cross-Verification (Education, Marriage, Relocation)",
        "Final Corrected Lagna Degree & Navamsha Shift Analysis",
        "Official Corrected Vedic Chart Timestamp",
      ],
    },
    {
      id: "palmistry_scan",
      title: "🖐️ AI Palmistry & Hastrekha Scan",
      tagline: "Computer vision scan of Heart, Head & Life lines mapped to planets.",
      price: "₹99",
      paise: 9900,
      vargas: ["Palm AI", "Hand Mounts", "3 Major Lines"],
      badge: "📸 Vision AI",
      badgeColor: "bg-[#d97706] text-white",
      deliveryTime: "Instant Scan",
      description:
        "Fuses digital palmistry with Vedic planetary mounts. Analyzes palm mounts (Jupiter, Venus, Saturn) and palm lines to provide a lifetime character and destiny reading.",
      sections: [
        "Life Line Arc & Vitality Depth Measurement",
        "Head Line Slope & Analytical vs Creative Intelligence",
        "Heart Line Trajectory & Emotional Relationship Patterns",
        "Fate Line (Bhagya Rekha) Wealth Emergence Points",
        "Mount of Jupiter & Mount of Venus Strength Ratings",
      ],
    },
    {
      id: "prashna_instant",
      title: "❓ Prashna Kundli (Instant Urgent Query)",
      tagline: "Horary chart calculated for the exact second of your pressing question.",
      price: "₹49",
      paise: 4900,
      vargas: ["Prashna Shastra", "Tajika", "Moon Hora"],
      badge: "⚡ Urgent Decision",
      badgeColor: "bg-[#e11d48] text-white",
      deliveryTime: "Instant 30s",
      description:
        "When an immediate decision is needed (Job offer acceptance, property deal, lost item, or recovery). Calculates the celestial sky for right now to deliver a direct Yes/No guidance.",
      sections: [
        "Prashna Lagna & Question Lord Alignment",
        "Ithsala & Mutthasila Planetary Combinations",
        "Direct Binary Probability Assessment (Yes / No / Delay)",
        "Immediate Action Timing Windows (Hours & Days)",
        "Protective Mantra for Favorable Outcome",
      ],
    },
    {
      id: "transit_purchase",
      title: "🚗 Transit Purchase Timing (Car, Home, Gold)",
      tagline: "Optimal Shubh Muhurat for high-value financial investments.",
      price: "₹79",
      paise: 7900,
      vargas: ["Gochar", "Muhurat", "Venus-Mars Axis"],
      badge: "💰 High ROI",
      badgeColor: "bg-[#16a34a] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Prevents costly bad investments. Evaluates planetary transits over your 4th house (Vehicles/Property) and 2nd house (Gold/Wealth) to pinpoint your safest purchase dates.",
      sections: [
        "4th & 2nd House Planetary Transit Health",
        "Venus & Mars Auspicious Muhurat Windows (Next 60 Days)",
        "Rahu Kaal & Gulika Kaal Avoidance Times",
        "Color & Vehicle/Property Type Astrological Resonance",
        "Consecration (Puja) Ritual for Lifetime Asset Protection",
      ],
    },
    {
      id: "yearly_gochar",
      title: "🪐 2026-2027 1-Year Transit & Sade Sati Dossier",
      tagline: "Month-by-month predictions based on Saturn, Jupiter & Rahu movements.",
      price: "₹129",
      paise: 12900,
      vargas: ["D1", "D9", "Shani Sade Sati", "Gochar"],
      badge: "📅 12-Month Roadmap",
      badgeColor: "bg-[#3c2880] text-white",
      deliveryTime: "60 Seconds Delivery",
      description:
        "Your personalized 12-month cosmic weather forecast. Tracks Saturn's Sade Sati phase, Jupiter's expansive blessings, and Rahu-Ketu axis shifts month by month.",
      sections: [
        "Overall Year Score & Dominant Planetary Influences",
        "Month-by-Month Detailed Career, Money & Health Forecast",
        "Shani Sade Sati / Dhaiya Status & Custom Protection",
        "Jupiter Transit (Guru Gochar) House Blessings",
        "High-Alert Dates vs Golden Breakthrough Periods",
      ],
    },
    {
      id: "astro_sound",
      title: "🎵 Astro-Sound & Frequency Therapy",
      tagline: "Planetary binaural frequencies tuned to balance your natal chart.",
      price: "₹79",
      paise: 7900,
      vargas: ["Astro-Sound", "Planetary Hz", "Beej Sound"],
      badge: "🎧 Sound Healing",
      badgeColor: "bg-[#0284c7] text-white",
      deliveryTime: "Instant Audio Link",
      description:
        "Translates your planetary positions into custom Solfeggio sound therapy frequencies. Calms Rahu anxiety, strengthens Jupiter wisdom, and aligns circadian energy.",
      sections: [
        "Weakest Planet Frequency Identification (in Hz)",
        "Custom Binaural Beat Recipe for Meditation & Sleep",
        "Vedic Beej Mantra Chanting Cadence & Time of Day",
        "Audio Therapy Protocol: 21-Day Transformation Routine",
        "Direct Download Link for Customized Planetary Audio",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans selection:bg-[#c8a030]/20 selection:text-[#1A1A1A] flex flex-col justify-between">
      {/* Sacred Header */}
      <header className="border-b border-[#c8a030]/20 bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3c2880] to-[#c8a030] flex items-center justify-center text-[#FAF7F2] text-sm shadow-sm group-hover:scale-105 transition-transform">
              ✦
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
              AstroLife <span className="text-[#c8a030] italic font-normal">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a030]/10 text-[#a07820] border border-[#c8a030]/30">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
              35+ Engines Ready
            </span>
            <Link
              href="/checkout"
              className="text-[#6B635B] hover:text-[#1A1A1A] transition-colors"
            >
              Consultations
            </Link>
            <Link
              href="/dashboard"
              className="text-[#c8a030] hover:text-[#a07820] transition-colors font-semibold"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8a030] mb-3">
            <span>✦</span>
            <span>Unbundled Precision Astrology • 35+ Vedic Engines</span>
            <span>✦</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] leading-tight">
            Specialized Cosmic <em className="italic text-[#c8a030] font-normal">Dossiers</em>
          </h1>
          <p className="mt-3 text-[#6B635B] text-sm sm:text-base leading-relaxed">
            Don&apos;t pay for general astrology. Get hyper-targeted, 15 to 25-page dossiers generated
            from your exact birth coordinates by our specialized mathematical engines.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-sm max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("master")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "master"
                  ? "bg-[#FAF7F2] text-[#1A1A1A] shadow-sm border border-[#c8a030]/50 font-bold"
                  : "text-[#6B635B] hover:text-[#1A1A1A]"
              }`}
            >
              <span>🌟</span>
              <span>Master Life Packs (5 Clusters)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c8a030]/15 text-[#a07820] font-bold">
                From ₹149
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "single"
                  ? "bg-[#FAF7F2] text-[#1A1A1A] shadow-sm border border-[#c8a030]/50 font-bold"
                  : "text-[#6B635B] hover:text-[#1A1A1A]"
              }`}
            >
              <span>⚡</span>
              <span>Single-Engine Tools</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3c2880]/10 text-[#3c2880] font-bold">
                From ₹49
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sovereign")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "sovereign"
                  ? "bg-[#FAF7F2] text-[#1A1A1A] shadow-sm border border-[#c8a030]/50 font-bold"
                  : "text-[#6B635B] hover:text-[#1A1A1A]"
              }`}
            >
              <span>👑</span>
              <span>All-35 Engines Pass</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16a34a]/15 text-[#16a34a] font-bold">
                Save 65%
              </span>
            </button>
          </div>
        </div>

        {/* Seeker Input Details Bar */}
        <div className="bg-[#FFFFFF] border border-[#E7DFD5] rounded-2xl p-5 mb-10 max-w-4xl mx-auto shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c8a030] flex items-center gap-1.5">
              <span>✦</span> Step 1: Provide Delivery Information
            </span>
            <span className="text-[11px] text-[#6B635B]">
              PDF will be generated and saved to this account
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full Name (e.g. Rahul Sharma)"
              className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#9C948A] focus:outline-none focus:border-[#c8a030]"
            />
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email (for PDF receipt)"
              className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#9C948A] focus:outline-none focus:border-[#c8a030]"
            />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Mobile Number (+91)"
              className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#9C948A] focus:outline-none focus:border-[#c8a030]"
            />
          </div>
        </div>

        {/* Success Modal / Banner */}
        {purchasedReport && (
          <div className="mb-10 max-w-3xl mx-auto p-6 rounded-2xl bg-[#16a34a]/10 border-2 border-[#16a34a]/40 text-[#16a34a] space-y-3 animate-fade-in shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-bold">
                <span>✦</span>
                <span>Payment Verified! Generating {purchasedReport.title}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#16a34a] text-white font-semibold">
                HMAC-SHA256 Verified
              </span>
            </div>
            <p className="text-xs text-[#2e5e3b] leading-relaxed">
              Your transaction of <strong>{purchasedReport.price}</strong> has been confirmed. Our
              astrological engines are compiling your custom charts. You can download your
              comprehensive PDF below or access it anytime in your dashboard.
            </p>
            <div className="text-[11px] font-mono bg-white/90 p-2.5 rounded-lg border border-[#16a34a]/20 text-[#4A4238] space-y-0.5">
              <div>Order: <span className="font-semibold text-[#1A1A1A]">{purchasedReport.order_id}</span></div>
              <div>Payment: <span className="font-semibold text-[#1A1A1A]">{purchasedReport.payment_id}</span></div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/report"
                className="flex-1 text-center py-2.5 px-4 rounded-xl bg-[#16a34a] text-white font-semibold text-xs tracking-wider uppercase shadow-sm hover:bg-[#15803d] transition-colors"
              >
                Open in Report Viewer →
              </Link>
              <Link
                href="/dashboard"
                className="py-2.5 px-4 text-center rounded-xl bg-white border border-[#16a34a]/40 text-[#16a34a] font-semibold text-xs transition-colors hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Tab Content 1: Master Life Packs */}
        {activeTab === "master" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {masterReports.map((report) => {
                const isExpanded = expandedReportId === report.id;
                return (
                  <div
                    key={report.id}
                    className={`bg-[#FFFFFF] border rounded-2xl p-6 sm:p-7 relative transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                      report.popular
                        ? "border-[#c8a030] shadow-[0_8px_30px_rgba(200,160,48,0.15)]"
                        : "border-[#E7DFD5]"
                    }`}
                  >
                    {report.badge && (
                      <div
                        className={`absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm ${report.badgeColor}`}
                      >
                        {report.badge}
                      </div>
                    )}

                    <div>
                      {/* Vargas Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3 mt-1">
                        {report.vargas.map((vg, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E7DFD5] text-[#6B635B]"
                          >
                            {vg}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">
                        {report.title}
                      </h3>
                      <p className="text-xs font-medium text-[#c8a030] mb-3">
                        {report.tagline}
                      </p>

                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="font-serif text-3xl font-bold text-[#1A1A1A]">
                          {report.price}
                        </span>
                        <span className="text-xs text-[#6B635B] font-medium">
                          • One-time payment
                        </span>
                      </div>

                      <p className="text-xs text-[#6B635B] leading-relaxed mb-4">
                        {report.description}
                      </p>

                      {/* Accordion: What's Inside */}
                      <div className="mb-5 pt-3 border-t border-[#E7DFD5]">
                        <button
                          type="button"
                          onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                          className="w-full flex items-center justify-between text-xs font-semibold text-[#4A4238] hover:text-[#c8a030] transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>📜</span>
                            <span>See what&apos;s inside ({report.sections.length} core sections)</span>
                          </span>
                          <span className="text-sm">{isExpanded ? "▲" : "▼"}</span>
                        </button>

                        {isExpanded && (
                          <ul className="mt-3 space-y-2 text-[11px] text-[#6B635B] bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5] animate-fade-in">
                            {report.sections.map((sec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#c8a030] text-xs mt-0.5">✦</span>
                                <span>{sec}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Razorpay Buy Button */}
                    <div className="pt-2">
                      <RazorpayCheckoutButton
                        amount={report.paise}
                        currency="INR"
                        name="AstroLife AI"
                        description={`${report.title} • ${report.price}`}
                        buttonText={`Get Instant Report · ${report.price}`}
                        prefill={{
                          name: customerName,
                          email: customerEmail,
                          contact: customerPhone,
                        }}
                        onSuccess={(data) => {
                          setPurchasedReport({
                            id: report.id,
                            title: report.title,
                            price: report.price,
                            order_id: data.order_id,
                            payment_id: data.payment_id,
                          });
                        }}
                      />
                      <div className="text-[11px] text-center text-[#9C948A] mt-2 flex items-center justify-center gap-1">
                        <span>⚡ {report.deliveryTime}</span>
                        <span>•</span>
                        <span>PDF forever</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Single-Engine Tools */}
        {activeTab === "single" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {singleEngineReports.map((report) => {
                const isExpanded = expandedReportId === report.id;
                return (
                  <div
                    key={report.id}
                    className="bg-[#FFFFFF] border border-[#E7DFD5] rounded-2xl p-6 sm:p-7 relative transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:border-[#c8a030]/60"
                  >
                    {report.badge && (
                      <div
                        className={`absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm ${report.badgeColor}`}
                      >
                        {report.badge}
                      </div>
                    )}

                    <div>
                      {/* Vargas Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3 mt-1">
                        {report.vargas.map((vg, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E7DFD5] text-[#6B635B]"
                          >
                            {vg}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-1">
                        {report.title}
                      </h3>
                      <p className="text-xs font-medium text-[#c8a030] mb-3">
                        {report.tagline}
                      </p>

                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="font-serif text-3xl font-bold text-[#1A1A1A]">
                          {report.price}
                        </span>
                        <span className="text-xs text-[#6B635B] font-medium">
                          • One-time unlock
                        </span>
                      </div>

                      <p className="text-xs text-[#6B635B] leading-relaxed mb-4">
                        {report.description}
                      </p>

                      {/* Accordion: What's Inside */}
                      <div className="mb-5 pt-3 border-t border-[#E7DFD5]">
                        <button
                          type="button"
                          onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                          className="w-full flex items-center justify-between text-xs font-semibold text-[#4A4238] hover:text-[#c8a030] transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>🔬</span>
                            <span>See what&apos;s inside ({report.sections.length} metrics)</span>
                          </span>
                          <span className="text-sm">{isExpanded ? "▲" : "▼"}</span>
                        </button>

                        {isExpanded && (
                          <ul className="mt-3 space-y-2 text-[11px] text-[#6B635B] bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5] animate-fade-in">
                            {report.sections.map((sec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#c8a030] text-xs mt-0.5">✦</span>
                                <span>{sec}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Razorpay Buy Button */}
                    <div className="pt-2">
                      <RazorpayCheckoutButton
                        amount={report.paise}
                        currency="INR"
                        name="AstroLife AI"
                        description={`${report.title} • ${report.price}`}
                        buttonText={`Unlock for ${report.price}`}
                        prefill={{
                          name: customerName,
                          email: customerEmail,
                          contact: customerPhone,
                        }}
                        onSuccess={(data) => {
                          setPurchasedReport({
                            id: report.id,
                            title: report.title,
                            price: report.price,
                            order_id: data.order_id,
                            payment_id: data.payment_id,
                          });
                        }}
                      />
                      <div className="text-[11px] text-center text-[#9C948A] mt-2 flex items-center justify-center gap-1">
                        <span>⚡ {report.deliveryTime}</span>
                        <span>•</span>
                        <span>Instant Access</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 3: Sovereign Pass & B2B Studio */}
        {activeTab === "sovereign" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sovereign Annual Pass */}
            <div className="bg-[#FFFFFF] border-2 border-[#c8a030] rounded-3xl p-8 relative shadow-[0_16px_40px_rgba(200,160,48,0.22)] flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c8a030] to-[#a07820] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                🔥 Best Value • Save 65%
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#a07820]">
                  For Seekers & Families
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1 mb-2">
                  AstroLife Sovereign Annual Pass
                </h3>
                <p className="text-xs text-[#6B635B] mb-6 leading-relaxed">
                  Unlock every single report and all 35+ specialized astrological engines for a full
                  365 days. Zero per-report fees.
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-serif text-5xl font-bold text-[#1A1A1A]">₹999</span>
                  <span className="text-xs text-[#6B635B] font-medium">/ full year (₹83/mo)</span>
                </div>

                <div className="h-[1px] bg-[#E7DFD5] mb-6"></div>

                <ul className="space-y-3 mb-8 text-xs text-[#4A4238]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c8a030]">✦</span>
                    <span><strong>All 5 Master Life Dossiers</strong> (Career, Marriage, Lal Kitab, Vastu, Health) included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c8a030]">✦</span>
                    <span><strong>All 35+ Engines</strong> (D-1 to D-60, KP, BTR, Palmistry, Astro-Sound) unlocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c8a030]">✦</span>
                    <span>Unlimited AI Astrologer Chat across all specialized agents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c8a030]">✦</span>
                    <span>Watermark-free High Resolution PDF report exports</span>
                  </li>
                </ul>
              </div>

              <RazorpayCheckoutButton
                amount={99900}
                currency="INR"
                name="AstroLife AI"
                description="AstroLife Sovereign Annual Pass • ₹999/yr"
                buttonText="Get 1-Year Sovereign Pass · ₹999"
                prefill={{
                  name: customerName,
                  email: customerEmail,
                  contact: customerPhone,
                }}
                onSuccess={(data) => {
                  setPurchasedReport({
                    id: "sovereign_pass",
                    title: "AstroLife Sovereign Annual Pass",
                    price: "₹999",
                    order_id: data.order_id,
                    payment_id: data.payment_id,
                  });
                }}
              />
            </div>

            {/* B2B Astrologer Studio */}
            <div className="bg-[#FFFFFF] border border-[#3c2880]/30 rounded-3xl p-8 relative shadow-md flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3c2880] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                ⭐ Professional SaaS
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#3c2880]">
                  For Practicing Astrologers & Consultancies
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1 mb-2">
                  Astrologer Pro Studio SaaS
                </h3>
                <p className="text-xs text-[#6B635B] mb-6 leading-relaxed">
                  Turn AstroLife&apos;s 35+ engines into your commercial consultation suite with
                  white-label client branding.
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-serif text-5xl font-bold text-[#1A1A1A]">₹1,999</span>
                  <span className="text-xs text-[#6B635B] font-medium">/ month (Cancel anytime)</span>
                </div>

                <div className="h-[1px] bg-[#E7DFD5] mb-6"></div>

                <ul className="space-y-3 mb-8 text-xs text-[#4A4238]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#3c2880]">✦</span>
                    <span><strong>White-Label PDF Reports:</strong> Print your own name, logo and phone number on client PDFs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3c2880]">✦</span>
                    <span><strong>Unlimited Client Charts:</strong> Save and manage hundreds of client Kundlis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3c2880]">✦</span>
                    <span>Full D-1 to D-60, BTR, KP Sub-Lord, Sarvatobhadra & Ashtakavarga tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3c2880]">✦</span>
                    <span>Priority commercial support & calculation verification</span>
                  </li>
                </ul>
              </div>

              <RazorpayCheckoutButton
                amount={199900}
                currency="INR"
                name="AstroLife AI"
                description="Astrologer Pro Studio SaaS • ₹1,999/mo"
                buttonText="Subscribe to Astrologer Studio · ₹1,999"
                prefill={{
                  name: customerName,
                  email: customerEmail,
                  contact: customerPhone,
                }}
                onSuccess={(data) => {
                  setPurchasedReport({
                    id: "astrologer_studio",
                    title: "Astrologer Pro Studio SaaS",
                    price: "₹1,999",
                    order_id: data.order_id,
                    payment_id: data.payment_id,
                  });
                }}
              />
            </div>
          </div>
        )}

        {/* Trust Badges Footer Bar */}
        <div className="mt-16 pt-8 border-t border-[#E7DFD5] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-[#6B635B]">
          <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5]">
            <span className="text-2xl block mb-1">⚡</span>
            <span className="font-bold text-[#1A1A1A] block">Instant Generation</span>
            <span>PDF ready in 30-60 secs</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5]">
            <span className="text-2xl block mb-1">🔒</span>
            <span className="font-bold text-[#1A1A1A] block">256-Bit SSL</span>
            <span>Bank-grade security</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5]">
            <span className="text-2xl block mb-1">🛡️</span>
            <span className="font-bold text-[#1A1A1A] block">Zero Recurring Trap</span>
            <span>Pay once, keep PDF forever</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5]">
            <span className="text-2xl block mb-1">👑</span>
            <span className="font-bold text-[#1A1A1A] block">35+ Vedic Engines</span>
            <span>Swiss Ephemeris accuracy</span>
          </div>
        </div>
      </main>

      {/* Sacred Footer */}
      <footer className="border-t border-[#c8a030]/20 bg-[#FAF7F2] py-6 text-center text-xs text-[#6B635B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[#a07820] font-serif">
            <span>✦</span>
            <span>AstroLife AI • Precision Vedic Astrology Reports Store</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-[#1A1A1A] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#1A1A1A] transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-[#1A1A1A] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
