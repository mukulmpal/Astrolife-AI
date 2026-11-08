"use client";

import React, { useState } from "react";
import Link from "next/link";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import { useUserChart } from "@/lib/user-chart";

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
  const { chart, birth } = useUserChart();
  const [activeTab, setActiveTab] = useState<"master" | "single" | "sovereign">("master");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

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

  const handleDownloadDossier = async (report: { id: string; title: string; order_id: string; payment_id: string }) => {
    try {
      setDownloading(true);
      const res = await fetch("/api/reports/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.id,
          reportTitle: report.title,
          chart,
          birth,
          customer: {
            name: customerName || chart?.name || "Sacred Seeker",
            email: customerEmail,
            phone: customerPhone,
          },
          orderId: report.order_id,
          paymentId: report.payment_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = report.title.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      a.download = `AstroLife-${safeTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Error downloading dossier. Please try again or contact support.");
    } finally {
      setDownloading(false);
    }
  };

  // 1. Eight High-Converting Modular Packages (3-4 related engines each)
  // Designed so that no single package solves everything; seekers naturally acquire 2-3 packages.
  const packageReports: ReportItem[] = [
    {
      id: "pkg_union_family",
      title: "💍 Sacred Union & Family Destiny Pack",
      tagline: "4-in-1 Suite: Kundali Milan, Vivah Timing, Family Karma & Mangal Dosha.",
      price: "₹249",
      paise: 24900,
      vargas: ["Kundali Milan", "D-9 Navamsha", "Family Karma", "Mangal Dosha"],
      badge: "🔥 Top Marital Pack",
      badgeColor: "bg-[#e11d48] text-white",
      popular: true,
      deliveryTime: "60 Seconds Delivery",
      description:
        "Complete 24-page relationship and lineage suite. Evaluates 36-guna Ashtakoota matching, partner characteristics, ancestral karmic baggage, and exact 12-month marriage timing windows.",
      sections: [
        "Ashtakoota 36-Guna Milan & Nadi/Bhakoot Exception Scanner",
        "D-9 Navamsha Life Partner Personality & In-law Dynamics",
        "Family Karma Synastry: Multi-Generational Planetary Imprints",
        "Mangal Dosha In-depth Mitigation & Vivah Timing Scanner",
        "Classical Marital Remedies, Shubh Muhurat & Relationship Harmonizers",
      ],
    },
    {
      id: "pkg_bio_remedies",
      title: "🛡️ Bio-Vedic Protection & Sacred Remedy Vault",
      tagline: "4-in-1 Vault: Advance Gemstone, Astro Dot Therapy, Astro-Tattoo & Lal Kitab.",
      price: "₹249",
      paise: 24900,
      vargas: ["Gemstones & Rudraksha", "Dot Therapy & Thread", "Astro-Tattoo", "Lal Kitab"],
      badge: "⚡ Energy Shield",
      badgeColor: "bg-[#16a34a] text-white",
      popular: true,
      deliveryTime: "45 Seconds Delivery",
      description:
        "The ultimate physical and esoteric bio-energy defense. Combines planetary acupressure dot points, sacred protective thread timings, talismanic tattoo geometry, and zero-cost Lal Kitab upay.",
      sections: [
        "Advance Natural Gemstone & Ek-Mukhi to 14-Mukhi Rudraksha Prescription",
        "Astro Dot Therapy: Planetary Acupressure Points on Palm & Body",
        "Sacred Protective Thread (Mauli) Tying Timings & Consecration Mantras",
        "Astro-Tattoo Sacred Geometry: Planetary Symbols & Skin Placement Rules",
        "Classical Lal Kitab Rin (Pitra/Matra/Rahu) Instant Neutralization Upay",
      ],
    },
    {
      id: "pkg_wealth_yogas",
      title: "👑 Raja Yoga & Wealth Acceleration Suite",
      tagline: "4-in-1 Suite: 300+ Classical Yogas, KP Sub-Lord, Numerology & Transit Purchase.",
      price: "₹249",
      paise: 24900,
      vargas: ["300+ Yogas", "KP Sub-Lord", "Vedic Numerology", "Transit Purchase"],
      badge: "💰 High Net-Worth",
      badgeColor: "bg-[#c8a030] text-[#FAF7F2]",
      popular: true,
      deliveryTime: "60 Seconds Delivery",
      description:
        "Comprehensive 25-page commercial and career accelerator. Scans 300+ classical yogas for dormant wealth, locks KP job promotion sub-lords, tunes name spelling vibrations, and pinpoints asset purchase dates.",
      sections: [
        "300+ Classical Planetary Yogas (Raja, Dhana, Gajakesari & Vipreet Yogas)",
        "KP Sub-Lord Precision Career Timing & 10th House Sub-Ruler",
        "Vedic & Chaldean Numerology Name Correction & Phone Resonance",
        "Transit Purchase Timing: Shubh Muhurat for Cars, Property & Gold",
        "Quarter-by-Quarter Financial Growth & Auspicious Expansion Windows",
      ],
    },
    {
      id: "pkg_space_destiny",
      title: "🏡 Space Energy, Palmistry & Destiny Calibration",
      tagline: "4-in-1 Suite: Astro-Vastu Radar, AI Palmistry, BTR & 1-Year Transit Forecast.",
      price: "₹249",
      paise: 24900,
      vargas: ["16-Zone Vastu", "AI Palmistry", "BTR Engine", "1-Year Gochar"],
      badge: "🔬 High Diagnostic",
      badgeColor: "bg-[#0284c7] text-white",
      deliveryTime: "60 Seconds Delivery",
      description:
        "Deep diagnostic master suite. Maps your chart to home's 16 Vastu zones, scans physical hand lines via computer vision, rectifies uncertain birth minutes, and provides a 12-month Gochar roadmap.",
      sections: [
        "Astro-Vastu Directional Radar: 16-Zone Birth Planet Home Mapping",
        "AI Palmistry Vision Scan: Heart, Head & Fate Lines vs Chart Alignment",
        "Mathematical Birth Time Rectification (BTR) Exact Minute Calculation",
        "2026-2027 1-Year Transit & Shani Sade Sati Month-by-Month Forecast",
        "Non-Destructive Space Harmonization & Spatial Energy Balancing",
      ],
    },
    {
      id: "pkg_stock_trading",
      title: "📈 Stock Market, Trading & Speculation Pack",
      tagline: "4-in-1 Suite: Sarvatobhadra Hit Radar, Ashtakavarga 337-Bindus, 5th/11th House Speculation & Transit Timing.",
      price: "₹299",
      paise: 29900,
      vargas: ["Sarvatobhadra", "Ashtakavarga", "5th/11th Speculation", "Intraday Muhurat"],
      badge: "📊 Trader Speculation",
      badgeColor: "bg-[#059669] text-white",
      deliveryTime: "60 Seconds Delivery",
      description:
        "Specialized financial astrology suite for equity, crypto, F&O and commodity traders. Combines 28-nakshatra Sarvatobhadra vedha hit lines, Ashtakavarga bindu strength, and volatile planetary aspects.",
      sections: [
        "Sarvatobhadra Chakra 28-Nakshatra Vedha (Cross-Ray) Hit Detection",
        "5th House (Speculative Gain) & 11th House (Profit Inflow) Planetary Strength",
        "Ashtakavarga 337-Bindus House Heatmap for Bullish vs Bearish Market Cycles",
        "Rahu & Mercury Aspect Windows: Avoiding Greed Traps & Market Crashes",
        "Personal Lucky Trading Hours, Days & Wealth Consecration Mantras",
      ],
    },
    {
      id: "pkg_jaimini_soul",
      title: "🧘 Jaimini Soul Blueprint & Karmic Mission",
      tagline: "4-in-1 Suite: Atmakaraka Soul Purpose, Karakamsa Lagna, Chara Dasha & Arudha Lagna.",
      price: "₹249",
      paise: 24900,
      vargas: ["Atmakaraka", "Karakamsa", "Chara Dasha", "Arudha Lagna"],
      badge: "👁️ Soul Awakening",
      badgeColor: "bg-[#7c3aed] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Unlocks Jaimini Sutras to reveal your soul's deepest mission (Atmakaraka), spiritual liberation path (Karakamsa), external societal illusion/reputation (Arudha Lagna), and sign-based Chara dasha timing.",
      sections: [
        "Atmakaraka (King of Soul) & Amatyakaraka (Career Guide) Secret Matrix",
        "Karakamsa Lagna in Navamsha: Ishta Devata & Spiritual Liberation Blueprint",
        "Arudha Lagna (AL) & Rajya Arudha (A10): Social Image vs True Wealth",
        "Jaimini Chara Dasha: Rashi-Based Karmic Phase Timelines",
        "Remedies for Releasing Karmic Blockages & Soul Evolution Upay",
      ],
    },
    {
      id: "pkg_ayurvedic_medical",
      title: "⚕️ Ayurvedic Medical & Psychological Vitality Shield",
      tagline: "4-in-1 Suite: Medical Astrology, Tridosha Balance, Cognitive Stress & Astro-Sound Hz.",
      price: "₹199",
      paise: 19900,
      vargas: ["Medical Kundli", "Tridosha Balance", "Cognitive Health", "Planetary Hz"],
      badge: "🌿 Vitality & Longevity",
      badgeColor: "bg-[#0284c7] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Preventive bio-astrological health audit. Maps planetary afflictions to bodily organ vulnerabilities, Vata-Pitta-Kapha tridosha imbalances, Moon-Mercury cognitive stress, and restorative planetary frequencies.",
      sections: [
        "6th, 8th & 12th House Medical Vulnerability & Organ Weakness Audit",
        "Ayurvedic Tridosha (Vata / Pitta / Kapha) Natal Constitution Analysis",
        "Moon-Mercury-Rahu Cognitive Stress & Sleep Disorder Indicators",
        "Planetary Gemstone & Herbal Decoctions for Bio-Field Balancing",
        "Custom Solfeggio Planetary Hz Audio Therapy for Cellular Healing",
      ],
    },
    {
      id: "pkg_muhurat_panchang",
      title: "⚡ Golden Muhurat & Auspicious Decision Suite",
      tagline: "4-in-1 Suite: Instant Prashna, Choghadiya & Hora Radar, Transit Purchase & Tithi Audit.",
      price: "₹149",
      paise: 14900,
      vargas: ["Prashna Shastra", "Choghadiya", "Hora Radar", "Muhurat Engine"],
      badge: "⏱️ Perfect Timing",
      badgeColor: "bg-[#d97706] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Never take a major leap during Rahu Kaal or Bhadra. Equips you with instant horary answers, 24/7 planetary Hora and Choghadiya windows, and personalized high-yield decision dates.",
      sections: [
        "Instant Prashna Kundli: Binary Yes/No Analysis for Immediate Dilemmas",
        "24-Hour Planetary Hora & Choghadiya Real-Time Energy Windows",
        "Shubh Muhurat for Contracts, Legal Filing & Business Inaugurations",
        "Abhijit Muhurat & Rahu Kaal / Gulika Kaal Danger Timetable",
        "Custom Tithi & Nakshatra Synchronization for Unstoppable Success",
      ],
    },
  ];

  // 2. Specialized Single-Engine Tools (Unbundled à la carte tools)
  const singleEngineReports: ReportItem[] = [
    {
      id: "destiny_curve_flagship",
      title: "📈 Destiny Curve: 90-Year Life Master Dossier",
      tagline: "Vimshottari Dasha life score curve (Age 0-90), Navtara 9-Chakra, Peak windows & 6 life areas.",
      price: "₹499",
      paise: 49900,
      vargas: ["Vimshottari Dasha", "Navtara Chakra", "0-90 Life Arc", "Antardasha Radar", "6 Life Pillars"],
      badge: "👑 Flagship Report",
      badgeColor: "bg-gradient-to-r from-[#c8a030] to-[#b45309] text-white shadow-sm",
      popular: true,
      deliveryTime: "60 Seconds Delivery",
      description:
        "Our crowning predictive masterwork. Maps your lifetime energetic trajectory across 90 years with year-by-year 0-100% scores. Combines full Vimshottari Mahadasha & Antardasha cycles with ancient Navtara (9 Tara) intelligence to identify exactly which planets act as Sampat (Wealth) vs Vipat/Vadha (Danger), pinpointing your golden peak windows, current drivers, and a 5-year milestone forecast across Career, Wealth, Health, Love, Mind & Dharma.",
      sections: [
        "Age 0 to 90 Complete Visual Life Curve & Percentage Trajectory",
        "Vimshottari Mahadasha & Antardasha Complete Lifecycle Audit",
        "Navtara 9-Chakra Classification: Sampat, Kshema, Sadhaka vs Vipat, Pratyari & Vadha",
        "Golden Peak Mahadasha & Antardasha Periods Identification",
        "Karmic Challenge Windows & Strategic Mitigation Protocol",
        "Current Planetary Driver Breakdown (Support, Caution, Transformation)",
        "Next 5-Year Yearly Milestone Roadmap (Score Trends & Action Plan)",
        "6 Fundamental Life Areas Scoring: Career, Wealth, Health, Marriage, Mind & Dharma",
      ],
    },
    {
      id: "navtara_dasha_single",
      title: "🌟 Navtara Chakra & Dasha Transit Audit",
      tagline: "9 Taras (Janma to Parama Mitra), 27th Support Star Shield & active dasha friction.",
      price: "₹89",
      paise: 8900,
      vargas: ["Navtara 9-Taras", "Vimshottari Dasha", "Nakshatra Lords", "Support Star"],
      badge: "🛡️ Star Shield",
      badgeColor: "bg-[#0f766e] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Pinpoints the exact energetic nature of every transit and dasha planet counted from your Moon Nakshatra. Reveals your Sampat (wealth), Kshema (wellbeing), and Sadhaka (success) stars versus hazardous Vipat, Pratyari, and Vadha stars.",
      sections: [
        "Janma Nakshatra Base Coordinate & 27 Nakshatras 3-Cycle Mapping",
        "Navtara 9-Tara Breakdown: Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Parama Mitra",
        "Active Mahadasha & Antardasha Planet Tara Status & Friction Score",
        "27th Support Star Shield (Preceding Nakshatra Sacred Anchor)",
        "Safe vs Dangerous Donation (Daan) Protocols Based on Tara Placement",
      ],
    },
    {
      id: "kundali_milan_single",
      title: "💍 Kundali Milan & 36-Guna Compatibility",
      tagline: "Ashtakoota 36-guna calculation, Manglik dosha & Navamsha synastry.",
      price: "₹99",
      paise: 9900,
      vargas: ["36-Guna", "D-9 Navamsha", "Manglik Check"],
      badge: "💑 Partner Sync",
      badgeColor: "bg-[#e11d48] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Precise matrimonial compatibility analysis between two birth charts. Analyzes Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi.",
      sections: [
        "Ashtakoota 36-Points Breakdown with Critical Nadi Analysis",
        "Manglik Dosha Severity Check & Mutual Cancellation Factors",
        "D-9 Navamsha Dual-Chart Emotional Compatibility Score",
        "Dasha Period Overlap: Longevity & Financial Prosperity Together",
        "Classical Marital Harmony Remedies for Dosha Mitigation",
      ],
    },
    {
      id: "family_karma_single",
      title: "🌳 Family Karma & Lineage Synastry",
      tagline: "Ancestral karmic imprints, Pitra dosha & multi-generational chart sync.",
      price: "₹99",
      paise: 9900,
      vargas: ["Lineage Karma", "Pitra Dosha", "Family Synastry"],
      badge: "🧬 Ancestral",
      badgeColor: "bg-[#7c3aed] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Decodes unresolved ancestral karma passed through DNA and planetary placements. Pinpoints Pitra dosha and generational patterns of financial or emotional blockage.",
      sections: [
        "9th House & Sun/Saturn Ancestral Lineage Audit",
        "Pitra Dosha Identification & Degree of Karmic Entanglement",
        "Parent-Child Astrological Synastry & Conflict Resolvers",
        "Karmic Debts Carried from Paternal & Maternal Ancestors",
        "Classical Vedic Tarpana & Daily Lineage Healing Rituals",
      ],
    },
    {
      id: "classical_yogas_single",
      title: "✨ 300+ Classical Yogas & Awakening Timing",
      tagline: "Scans your chart for Raja, Dhana, Gajakesari & Vipreet Yogas.",
      price: "₹89",
      paise: 8900,
      vargas: ["300+ Yogas", "Raja Yoga", "Dhana Yoga"],
      badge: "👑 Royal Yogas",
      badgeColor: "bg-[#c8a030] text-[#FAF7F2]",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Comprehensive inventory of over 300 classical Parashari and Jaimini yogas present in your horoscope, with exact Dasha periods when each yoga will activate.",
      sections: [
        "Major Raja Yogas & Power/Authority Activation Dates",
        "Dhana Yogas & Sudden Wealth Accumulation Windows",
        "Vipreet Raja Yogas: Victory Emerging from Adversity",
        "Dormant vs Active Yogas: Factors Hindering Fruition",
        "Actionable Gemstones & Mantras to Awaken Benefic Yogas",
      ],
    },
    {
      id: "gemstone_rudraksha_single",
      title: "💎 Advance Gemstone & Rudraksha Prescription",
      tagline: "Custom carat weight, ideal metal, finger & lab energization rituals.",
      price: "₹79",
      paise: 7900,
      vargas: ["Gemstones", "Rudraksha 1-14 Mukhi", "Prana Pratishtha"],
      badge: "🔮 Precision Talisman",
      badgeColor: "bg-[#059669] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Never wear the wrong stone. Calculates your Anukul, Ishta, and Bhagya stones based on sub-lords. Prescribes exact Mukhi Rudraksha and sacred consecration timings.",
      sections: [
        "Primary Life Stone (Lagnesh) & Wealth Stone (Bhagyesh) Analysis",
        "Maraka & Badhaka Stones to Strictly Avoid (Danger Precautions)",
        "Exact Carat, Metal (Gold/Silver/Panchdhatu) & Auspicious Finger",
        "Specific Mukhi Rudraksha (1 to 14 Mukhi) Natal Chart Resonance",
        "Step-by-Step Prana Pratishtha & Shubh Muhurat Wearing Ritual",
      ],
    },
    {
      id: "vastu_radar_single",
      title: "🧭 Astro-Vastu Directional Radar",
      tagline: "16 directional zones energy radar mapped to your personal Kundli.",
      price: "₹119",
      paise: 11900,
      vargas: ["16 Directions", "Vastu Compass", "Directional Radar"],
      badge: "🏡 Space Alignment",
      badgeColor: "bg-[#0284c7] text-white",
      deliveryTime: "45 Seconds Delivery",
      description:
        "Bridges physical architecture with personal astrology. Identifies which of the 16 compass zones in your home or workplace is suppressing your planetary fortunes.",
      sections: [
        "16 Vastu Zones Coordinate Mapping with Natal Planets",
        "North-East (Wisdom), South-West (Stability) & South-East (Cash) Audit",
        "Entrance & Master Bed Placement According to Moon Sign",
        "Anti-Element Detection (e.g. Fire in Water Zone) & Remedies",
        "Non-Invasive Remedial Cures: Copper Strips, Plants & Sacred Mirrors",
      ],
    },
    {
      id: "dot_therapy_thread_single",
      title: "🔴 Astro Dot Therapy & Sacred Thread Protocol",
      tagline: "Planetary acupressure micro-dots & protective thread (Mauli) timings.",
      price: "₹79",
      paise: 7900,
      vargas: ["Dot Therapy", "Astro-Acupressure", "Sacred Thread"],
      badge: "🌿 Bio-Energy",
      badgeColor: "bg-[#d97706] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Ancient esoteric bio-field therapy. Identifies precise color dot placement points on hands/feet to harmonize afflicted planets, plus consecrated protective thread rules.",
      sections: [
        "Afflicted Planet Micro-Dot Mapping on Palms (Red, Green, Yellow, Blue)",
        "Daily Astro-Acupressure Activation Points for Nervous Health",
        "Sacred Protective Thread (Mauli/Raksha Sutra) Consecration Protocol",
        "Ideal Day, Tithi & Nakshatra for Thread Tying & Replacement",
        "21-Day Bio-Field Reset & Aura Fortification Guidelines",
      ],
    },
    {
      id: "astro_tattoo_single",
      title: "🎨 Astro-Tattoo & Sacred Yantra Geometry",
      tagline: "Custom geometric yantras, planetary symbols & skin placement rules.",
      price: "₹79",
      paise: 7900,
      vargas: ["Sacred Geometry", "Yantra Tattoo", "Planetary Skin Zones"],
      badge: "✍️ Permanent Talisman",
      badgeColor: "bg-[#3c2880] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Tattoos permanently alter your bio-magnetic field. This guide determines your most benefic planetary yantras, symbols (Trishul, Lotus, Om, Chakra) and safe skin zones.",
      sections: [
        "Most Benefic Planetary Symbols & Yantra Geometric Blueprints",
        "Strictly Prohibited Body Locations & Dark Planetary Glyphs",
        "Recommended Body Zones: Forearm, Shoulder, Spine & Wrist Alignment",
        "Color Resonance: Black, Ochre, Gold vs Planetary Elements",
        "Consecration Meditation to Spiritually Activate the Tattoo",
      ],
    },
    {
      id: "numerology_single",
      title: "🔢 Vedic Numerology & Name Resonance",
      tagline: "Chaldean vibrations, mobile number compatibility & name spelling tuning.",
      price: "₹69",
      paise: 6900,
      vargas: ["Chaldean Numerology", "Name Vibration", "Mobile Resonance"],
      badge: "📱 Digital Luck",
      badgeColor: "bg-[#0891b2] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Harness the vibrational frequency of numbers. Calculates your Destiny, Psychic, and Soul Urge numbers, tunes your name spelling for success, and checks phone number luck.",
      sections: [
        "Psychic (Mulank) & Destiny (Bhagyank) Harmony Index",
        "Name Spelling Calculation: Optimizing Compound Numbers (e.g. 23, 37)",
        "Mobile Number & Bank Account Astrological Compatibility",
        "Lucky Vehicle Numbers, Colors & House Number Alignment",
        "Annual Numerological Personal Year Forecast (1 to 9 Cycle)",
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
    {
      id: "sarvatobhadra_single",
      title: "📊 Sarvatobhadra Transit & Trading Hit Radar",
      tagline: "28-nakshatra cosmic grid scanning cross-ray vedhas on your natal planets.",
      price: "₹149",
      paise: 14900,
      vargas: ["Sarvatobhadra", "28 Nakshatras", "Vedha Ray"],
      badge: "📈 Speculation Tech",
      badgeColor: "bg-[#059669] text-white",
      deliveryTime: "Instant 45s",
      description:
        "The ancient secret of kings and modern financial astrologers. Uses the 28-nakshatra Sarvatobhadra Chakra to detect front, right, and left vedha hits on your natal points.",
      sections: [
        "28-Nakshatra (including Abhijit) Sarvatobhadra Grid Mapping",
        "Panchaka (Janma, Karma, Sanghatika, Samudayika, Vainashika) Nakshatra Vedha",
        "Malefic Cross-Rays (Saturn, Mars, Rahu) on Natal Sun & Moon",
        "High-Risk Market Exposure Dates vs Bullish Expansion Windows",
        "Protective Planetary Yantra for Financial Defense",
      ],
    },
    {
      id: "special_lagnas_single",
      title: "👑 Special Lagnas: Hora & Sree Lagna Wealth Dossier",
      tagline: "Independent wealth degree calculations: Hora Lagna (HL) & Sree Lagna (SL).",
      price: "₹89",
      paise: 8900,
      vargas: ["Hora Lagna", "Sree Lagna", "Ghati Lagna"],
      badge: "💰 Secret Wealth Degrees",
      badgeColor: "bg-[#c8a030] text-[#FAF7F2]",
      deliveryTime: "Instant 30s",
      description:
        "Parashara's hidden wealth ascendants. While normal Lagna shows physical self, Hora Lagna governs monetary influx and Sree Lagna governs Lakshmi's permanent blessings.",
      sections: [
        "Exact Degrees of Hora Lagna (HL) & Sree Lagna (SL)",
        "Benefic Planetary Aspects on Wealth Ascendants",
        "Ghati Lagna (GL) Power, Authority & Political Elevation Capacity",
        "Timing of Multi-Fold Financial Liquidity Events",
        "Special Lakshmi & Kuber Yantras Aligned to Your Sree Lagna",
      ],
    },
    {
      id: "atmakaraka_soul_single",
      title: "👁️ Atmakaraka & Jaimini Soul Purpose Dossier",
      tagline: "The king planet of your chart: soul desires, karmic lessons & Ishta Devata.",
      price: "₹89",
      paise: 8900,
      vargas: ["Atmakaraka", "Karakamsa", "Ishta Devata"],
      badge: "🧘 Soul Mission",
      badgeColor: "bg-[#7c3aed] text-white",
      deliveryTime: "Instant 30s",
      description:
        "In Jaimini astrology, the planet with the highest longitude is the Atmakaraka — the king of the chart representing the soul's incarnation journey, past debts, and ultimate mission.",
      sections: [
        "Atmakaraka Planet Identification & Inherent Soul Desires",
        "Karakamsa Lagna in D-9 Navamsha: Higher Spiritual Identity",
        "Identification of Your Specific Ishta Devata for Liberation (Moksha)",
        "Amatyakaraka Alignment: Selecting a Career in Sync with Soul Purpose",
        "Daily Sadhana & Contemplation Protocol for Inner Peace",
      ],
    },
    {
      id: "ashtakavarga_bindus_single",
      title: "🔢 Ashtakavarga 337-Bindus Strength Matrix",
      tagline: "Mathematical point distribution across all 12 houses and 7 planets.",
      price: "₹79",
      paise: 7900,
      vargas: ["Sarvashtakavarga", "Bhinnashtakavarga", "Kakshya"],
      badge: "📊 Pure Math",
      badgeColor: "bg-[#0284c7] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Eliminates astrologer subjectivity. The 337-bindu Ashtakavarga matrix calculates objective scores (0 to 8 points) for every house, revealing where luck flows and where friction exists.",
      sections: [
        "Sarvashtakavarga (SAV) Complete 12-House Numerical Heatmap",
        "11th House (Gains) vs 12th House (Losses) Bindu Balance Ratio",
        "Transit Activation via Kakshya System for Crucial Life Steps",
        "Low-Bindu House Strengthening & Energy Conservation Strategies",
        "Samudaya Ashtakavarga Lifetime Financial Accumulation Potential",
      ],
    },
    {
      id: "medical_roga_single",
      title: "🏥 Medical Astrology & Organ Vulnerability Audit",
      tagline: "6th, 8th & 12th house disease patterns, Tridosha balance & vital organs.",
      price: "₹79",
      paise: 7900,
      vargas: ["Medical Kundli", "Tridosha", "Roga Bhava"],
      badge: "⚕️ Health Shield",
      badgeColor: "bg-[#e11d48] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Deep Ayurvedic-astrological preventive health analysis. Analyzes planetary rulers of the 6th house (diseases), 8th house (chronic ailments), and Lagnesh vitality.",
      sections: [
        "Constitutional Prakriti: Vata, Pitta, and Kapha Astrological Breakdown",
        "Vulnerable Organ Mapping Based on Zodiac Sign Significations",
        "Dasha-Antardasha Health Hazard Timing & Caution Windows",
        "Sun-Saturn & Mars-Moon Afflictions: Cardiovascular & Nervous Health",
        "Dietary, Lifestyle & Ayurvedic Herbal Recommendations",
      ],
    },
    {
      id: "cognitive_mind_single",
      title: "🧠 Cognitive Mind & Emotional Stress Decoder",
      tagline: "Moon-Mercury-Rahu axis, emotional triggers, anxiety & mental clarity.",
      price: "₹69",
      paise: 6900,
      vargas: ["Manas Bhava", "Moon-Mercury", "Chitta Shudhi"],
      badge: "🧘 Mental Peace",
      badgeColor: "bg-[#d97706] text-white",
      deliveryTime: "Instant 30s",
      description:
        "Decodes psychological wiring. Analyzes Moon (emotions/subconscious), Mercury (analytical intellect/nervous system), and Rahu (obsessions/overthinking) for clarity and calm.",
      sections: [
        "Moon Sign & Nakshatra Emotional Vulnerability & Stress Triggers",
        "Mercury Retrogression & Combustion: Processing Style & Overthinking",
        "Kemadruma & Rahu-Chandra Grahan Yoga: Releasing Deep-Seated Anxiety",
        "Circadian Rhythm & Bedtime Astrological Grounding Techniques",
        "Breathwork (Pranayama) & Beej Mantras Tailored to Your Mind Chart",
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
              <span>8 Power Bundles</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c8a030]/15 text-[#a07820] font-bold">
                ₹149 - ₹299
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
              <span>Single & Flagship Tools (22)</span>
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

        {/* Tab Content 1: 4-in-1 Power Bundles */}
        {activeTab === "master" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {packageReports.map((report) => {
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
                    className={`rounded-2xl p-6 sm:p-7 relative transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                      report.popular
                        ? "border-2 border-[#c8a030] shadow-[0_12px_40px_rgba(200,160,48,0.18)] md:col-span-2 lg:col-span-3 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#FAF7F2]"
                        : "bg-[#FFFFFF] border border-[#E7DFD5] hover:border-[#c8a030]/60"
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

        {/* Purchase Success & Instant PDF Download Modal */}
        {purchasedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FAF7F2] border-2 border-[#c8a030] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative">
              <button
                type="button"
                onClick={() => setPurchasedReport(null)}
                className="absolute top-4 right-4 text-[#6B635B] hover:text-[#1A1A1A] text-lg font-bold p-1 rounded-full w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-full bg-[#16a34a]/15 text-[#16a34a] text-3xl flex items-center justify-center mx-auto mb-4 border border-[#16a34a]/30">
                ✓
              </div>

              <span className="text-[11px] font-bold uppercase tracking-widest text-[#a07820] block mb-1">
                Payment Verified • Sacred Dossier Generated
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
                {purchasedReport.title}
              </h3>

              <p className="text-xs text-[#6B635B] mb-5 leading-relaxed">
                Your print-ready mathematical Shastra dossier is fully calculated and compiled. Click below to download your official vector PDF report.
              </p>

              {/* Transaction details card */}
              <div className="bg-white border border-[#E7DFD5] rounded-2xl p-4 mb-6 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6B635B]">Order ID:</span>
                  <span className="font-mono text-[#1A1A1A] font-semibold">{purchasedReport.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B635B]">Payment ID:</span>
                  <span className="font-mono text-[#1A1A1A] font-semibold">{purchasedReport.payment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B635B]">Seeker Name:</span>
                  <span className="text-[#1A1A1A] font-semibold">{customerName || chart?.name || "Sacred Seeker"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B635B]">Delivery Mode:</span>
                  <span className="text-[#16a34a] font-semibold">Instant Vector PDF (Lifetime Access)</span>
                </div>
              </div>

              {/* Instant Download Action */}
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleDownloadDossier(purchasedReport)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#c8a030] to-[#a07820] text-[#FAF7F2] font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {downloading ? (
                  <>
                    <span className="animate-spin text-base">⟳</span>
                    <span>Compiling Your Sacred PDF...</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>Download Sacred Dossier (PDF)</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#6B635B]">
                <button
                  type="button"
                  onClick={() => setPurchasedReport(null)}
                  className="hover:text-[#1A1A1A] underline text-[11px]"
                >
                  Close Window
                </button>
                <span>•</span>
                <Link
                  href="/dashboard"
                  className="text-[#c8a030] hover:text-[#a07820] font-semibold text-[11px]"
                >
                  Return to Dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}
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
