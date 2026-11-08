/**
 * AstroLife Programmatic SEO Catalog
 * Targets high-intent organic Google queries across India & diaspora.
 */

export interface SeoLandingPageData {
  slug: string;
  reportId: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h2Subtitle: string;
  price: string;
  paise: number;
  originalPrice: string;
  badge: string;
  targetKeywords: string[];
  vargas: string[];
  pageCount: string;
  deliveryTime: string;
  coreHighlights: { title: string; desc: string }[];
  chapters: string[];
  faqs: { q: string; a: string }[];
  rating: { score: string; count: string };
}

export const SEO_LANDING_PAGES: Record<string, SeoLandingPageData> = {
  "kundali-milan-pdf": {
    slug: "kundali-milan-pdf",
    reportId: "pkg_union_family",
    metaTitle: "Kundali Milan Report PDF (36 Guna Matching & Remedies) | AstroLife AI",
    metaDescription:
      "Instant 24-page Kundali Milan PDF report computed by Swiss Ephemeris. Deep 36-guna Ashtakoota, Nadi/Bhakoot cancellation rules, D-9 Navamsha partner synastry, and classical Upayas.",
    h1: "36-Guna Kundali Milan & Sacred Marital Compatibility Dossier",
    h2Subtitle:
      "Astronomical precision matching using exact birth coordinates. Goes far beyond generic computer scores with D-9 Navamsha and classical Nadi cancellation rules.",
    price: "₹249",
    paise: 24900,
    originalPrice: "₹1,499",
    badge: "🔥 Top Marital Match",
    targetKeywords: [
      "Kundali Milan Report PDF",
      "Kundali Milan in Hindi PDF download",
      "36 Guna Milan online",
      "Nadi Dosha cancellation report",
      "Marriage horoscope matching PDF",
      "Ashtakoota Milan chart",
    ],
    vargas: ["Ashtakoota 36 Guna", "D-9 Navamsha", "Nadi Exception", "Mangal Dosha"],
    pageCount: "24 Pages",
    deliveryTime: "Instant 60-Second Download",
    coreHighlights: [
      {
        title: "Ashtakoota 36-Guna Analysis",
        desc: "Examines Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi with classical Parashari weights.",
      },
      {
        title: "Classical Cancellation Exceptions",
        desc: "Verifies authentic Shastra exceptions where Nadi or Bhakoot doshas are neutralized by planetary friendships.",
      },
      {
        title: "D-9 Navamsha Soul Synastry",
        desc: "Compares the actual subtle 9th harmonic divisional charts to reveal emotional bonding and in-law dynamics.",
      },
      {
        title: "100% Free Authentic Remedies",
        desc: "Includes time-tested Vedic mantras, lifestyle alignments, and Dana recommendations with zero fear-mongering.",
      },
    ],
    chapters: [
      "Ashtakoota 36-Guna Comprehensive Mathematical Scoring",
      "Nadi & Bhakoot Dosha Exception Scanning",
      "D-9 Navamsha Life Partner Psychological Profile",
      "Mangal Dosha (Kuja Dosha) Intensity & Placement Severity",
      "Family Lineage Karma & Long-term Marital Harmony",
      "Classical Vedic Marital Remedies & Auspicious Muhurat",
    ],
    faqs: [
      {
        q: "How is AstroLife's Kundali Milan different from standard software?",
        a: "Standard software gives only a crude number out of 36. AstroLife computes exact planetary longitudes via Swiss Ephemeris, scans 14 classical cancellation exceptions, and analyzes the D-9 Navamsha chart for true longevity.",
      },
      {
        q: "What if there is Nadi Dosha?",
        a: "In 70% of cases, classical texts like Brihat Parashara Hora Shastra provide valid cancellations (such as same Rashi but different Nakshatras, or friendly ruling lords). Our dossier clearly highlights whether cancellation applies.",
      },
      {
        q: "Can I download the report immediately?",
        a: "Yes! As soon as payment completes, your official 24-page vector PDF dossier is generated instantly on screen, saved to your History Vault, and dispatched to your email.",
      },
    ],
    rating: { score: "4.9", count: "1,420" },
  },

  "marriage-timing": {
    slug: "marriage-timing",
    reportId: "pkg_union_family",
    metaTitle: "Vivah Yog & Marriage Timing Prediction PDF (12-Month Window) | AstroLife AI",
    metaDescription:
      "Discover your exact marriage timing window. Double transit scanning of Jupiter (Guru) and Saturn (Shani) over 7th house and Venus/Jupiter with KP sub-lord precision.",
    h1: "Vedic Vivah Yog & Marriage Timing Scanner Dossier",
    h2Subtitle:
      "Pinpoint your high-probability marriage activation windows across the next 12 to 36 months using authentic classical double-transit rules.",
    price: "₹149",
    paise: 14900,
    originalPrice: "₹999",
    badge: "💍 High Precision Timing",
    targetKeywords: [
      "Marriage timing astrology PDF",
      "Vivah yog calculator",
      "When will I get married kundli",
      "7th house marriage prediction",
      "Jupiter transit marriage timing",
    ],
    vargas: ["D-1 Rashi", "D-9 Navamsha", "Guru Gochar", "KP Sub-Lord"],
    pageCount: "18 Pages",
    deliveryTime: "Instant 45-Second Download",
    coreHighlights: [
      {
        title: "Double-Transit Confirmation",
        desc: "Tracks the simultaneous aspect of Saturn and Jupiter on the 7th house or 7th lord to identify active marriage gates.",
      },
      {
        title: "D-9 Navamsha Activation",
        desc: "Evaluates when the Navamsha lagna lord or Dara Karaka planet receives activating transits.",
      },
      {
        title: "Vimshottari Dasha Window",
        desc: "Scrutinizes Mahadasha, Antardasha, and Pratyantardasha lord connections with the 2nd, 7th, and 11th houses.",
      },
      {
        title: "Obstacle Clearance Upayas",
        desc: "Prescribes classical Katyayani japa, Brihaspati dana, and timing-specific rituals to remove marriage delays.",
      },
    ],
    chapters: [
      "7th House & 7th Lord Strength (Shadbala & Digbala)",
      "Dara Karaka & Venus/Jupiter Natural Karaka Health",
      "Vimshottari Dasha Activation Windows (2026-2029)",
      "Double Transit (Guru-Shani) Resonance Scanner",
      "High-Probability Month-by-Month Wedding Windows",
      "Authentic Vedic Remedies for Removing Delays",
    ],
    faqs: [
      {
        q: "What causes delays in marriage according to Vedic Astrology?",
        a: "Common factors include Saturn's aspect on the 7th house, Venus combustion, Rahu-Ketu axis across 1-7, or running dashas of 6th/8th house lords. The dossier pinpoints the exact root cause in your chart.",
      },
      {
        q: "How accurate is the 12-month marriage timing window?",
        a: "By combining Vimshottari Dasha with KP ruling planets and dual transit confirmation (Jupiter + Saturn), timing accuracy improves significantly over generic solar sign predictions.",
      },
    ],
    rating: { score: "4.9", count: "980" },
  },

  "career-raja-yoga": {
    slug: "career-raja-yoga",
    reportId: "pkg_wealth_yogas",
    metaTitle: "Career Raja Yoga & Wealth Acceleration Report PDF | AstroLife AI",
    metaDescription:
      "Full 24-page Career & Raja Yoga dossier. Scans 300+ classical Vedic yogas (Gajakesari, Pancha Mahapurusha, Dhana Yogas), D-10 Dasamsa profession breakdown, and KP sub-lord timing.",
    h1: "300+ Classical Raja Yogas & Career Acceleration Dossier",
    h2Subtitle:
      "Unlock the dormant power of your 10th and 11th houses. Decodes promotions, government job yogas, business vs job suitability, and multi-stream wealth triggers.",
    price: "₹249",
    paise: 24900,
    originalPrice: "₹1,999",
    badge: "👑 High Net-Worth",
    targetKeywords: [
      "Raja Yoga in Kundli PDF",
      "Career prediction astrology report",
      "Dhana Yoga in birth chart",
      "D10 Dasamsa chart career analysis",
      "Government job yoga Kundali",
    ],
    vargas: ["D-10 Dasamsa", "300+ Classical Yogas", "KP Sub-Lord", "Indu Lagna"],
    pageCount: "24 Pages",
    deliveryTime: "Instant 60-Second Download",
    coreHighlights: [
      {
        title: "300+ Classical Yoga Scanner",
        desc: "Detects Gajakesari, Malavya, Ruchaka, Hamsa, Bhadra, Sasa, Lakshmi Yoga, and Vipareeta Raja Yogas with cancellation checks.",
      },
      {
        title: "D-10 Dasamsa Career Micro-Varga",
        desc: "Analyzes the 10th divisional chart to reveal your true vocational destiny, leadership authority, and enterprise acumen.",
      },
      {
        title: "Indu Lagna & Dhana Yoga Strength",
        desc: "Calculates wealth potency and reveals the most fruitful sectors for high returns.",
      },
      {
        title: "KP Sub-Lord 2-6-10-11 Alignment",
        desc: "Uses Krishnamurti Paddhati to detect the exact timing of job changes, increments, and business breakthroughs.",
      },
    ],
    chapters: [
      "Active Raja Yogas & VIP Inherent Strengths",
      "D-10 Dasamsa Vocational Vector & Authority Profile",
      "Job vs Business (Sovereign Enterprise) Suitability",
      "Indu Lagna Wealth Influx & Financial Peaks",
      "Upcoming Career Transit Windows (2026-2028)",
      "Actionable Upayas for Wealth & Career Growth",
    ],
    faqs: [
      {
        q: "What is a Raja Yoga in Vedic Astrology?",
        a: "A Raja Yoga forms when Kendra (action/quadrant) lords combine with Trikona (grace/trine) lords, indicating authority, respect, wealth, and societal leadership during its activation dasha.",
      },
      {
        q: "Does this report analyze D-10 Dasamsa?",
        a: "Yes. D-10 is the specialized divisional chart for profession, career achievements, and karmic work in society.",
      },
    ],
    rating: { score: "4.9", count: "1,850" },
  },

  "astro-vastu-dosha": {
    slug: "astro-vastu-dosha",
    reportId: "pkg_astro_vastu",
    metaTitle: "Astro-Vastu & Home Energy Resonance Report PDF | AstroLife AI",
    metaDescription:
      "Map your personal horoscope to your living space. 16-Zone Vastu Purusha Mandala, 4th house Griha Yoga, directional elemental balance, and zero-demolition remedies.",
    h1: "Astro-Vastu Sacred Directions & Space Alignment Dossier",
    h2Subtitle:
      "Align your physical home and workplace with your active natal planetary frequencies. Zero-demolition classical remedies for health, wealth, and peaceful living.",
    price: "₹249",
    paise: 24900,
    originalPrice: "₹1,499",
    badge: "🏛️ Space & Energy Harmonizer",
    targetKeywords: [
      "Astro Vastu Report PDF",
      "Personalized Vastu based on Kundli",
      "16 directions Vastu remedies",
      "Vastu dosha remedies without demolition",
      "Kundali based home directions",
    ],
    vargas: ["16-Zone Vastu", "4th House Griha", "Elemental Balance", "Devata Mandala"],
    pageCount: "22 Pages",
    deliveryTime: "Instant 60-Second Download",
    coreHighlights: [
      {
        title: "16-Direction Planetary Resonance",
        desc: "Maps the 16 cardinal and sub-cardinal zones to the planets in your natal chart to identify blocked energy vortexes.",
      },
      {
        title: "Zero-Demolition Upayas",
        desc: "Corrects directional imbalances using color therapy, metal strips, sacred plant placement, and planetary lamps.",
      },
      {
        title: "4th House Griha Sukha Evaluation",
        desc: "Scans land ownership, property acquisition yogas, and peaceful domestic ambiance.",
      },
      {
        title: "Workstation & Bed Alignment",
        desc: "Identifies your most powerful sleeping and working directions for maximum focus and restorative sleep.",
      },
    ],
    chapters: [
      "Natal Planetary Degrees Mapped to 16 Compass Zones",
      "North-East (Ishanya) & South-West (Nairutya) Stability Check",
      "4th House Griha Yoga & Land Ownership Strength",
      "Color, Metal & Element Directional Prescription",
      "Workstation, Bedroom & Altar (Pooja Room) Optimization",
      "Zero-Demolition Classical Remedial Matrix",
    ],
    faqs: [
      {
        q: "What is Astro-Vastu?",
        a: "Traditional Vastu applies universal rules, but Astro-Vastu personalizes those directions based on the exact planetary placements in your individual horoscope.",
      },
      {
        q: "Do I need to break walls or renovate?",
        a: "No! All AstroLife Astro-Vastu remedies are 100% non-invasive, using elemental balancing, lighting, and sacred geometrical placements.",
      },
    ],
    rating: { score: "4.8", count: "740" },
  },

  "sade-sati-remedies": {
    slug: "sade-sati-remedies",
    reportId: "pkg_union_family",
    metaTitle: "Shani Sade Sati Transit & Classical Remedies PDF | AstroLife AI",
    metaDescription:
      "Comprehensive Saturn transit dossier. Pinpoints your exact Sade Sati or Dhaiya phase, transit degree over natal Moon, silver/gold/copper/iron foot, and classical remedies.",
    h1: "Shani Sade Sati & Dhaiya Complete Mitigation Dossier",
    h2Subtitle:
      "Transform fear into sovereign discipline. Accurate mathematical degree-level tracking of Saturn's 7.5-year cycle with authentic, non-commercial Vedic Upayas.",
    price: "₹129",
    paise: 12900,
    originalPrice: "₹799",
    badge: "🪐 Karmic Transformation",
    targetKeywords: [
      "Shani Sade Sati report PDF",
      "Sade Sati calculator with remedies",
      "Shani Dhaiya remedies",
      "Is Sade Sati good or bad for me",
      "Saturn transit over Moon remedies",
    ],
    vargas: ["Shani Gochar", "Ashtakavarga Bindus", "Chandra Rashi", "Karmic Upay"],
    pageCount: "16 Pages",
    deliveryTime: "Instant 45-Second Download",
    coreHighlights: [
      {
        title: "Degree-Level Orbit Tracking",
        desc: "Calculates the exact degree of Saturn in relation to your natal Moon to identify whether you are in rising, peak, or setting phase.",
      },
      {
        title: "Ashtakavarga Bindu Shield",
        desc: "Evaluates the benefic points (Bindus) in the house of transit. If points exceed 28, Sade Sati often brings huge professional milestones!",
      },
      {
        title: "Foot Allocation (Paya)",
        desc: "Identifies whether Saturn enters through Gold, Silver, Copper, or Iron Paya based on Moon nakshatra.",
      },
      {
        title: "Authentic Satvik Upayas",
        desc: "Features Dasharatha Shani Stotram, sesame oil lamp guidelines, and compassionate service rituals without fear-mongering.",
      },
    ],
    chapters: [
      "Current Sade Sati / Dhaiya Status & Timeline (2026-2032)",
      "Saturn Foot (Swarna, Rajata, Tamra, Loha Paya) Classification",
      "Ashtakavarga Protective Bindu Count",
      "Impact on Career, Health, Family & Mental Peace",
      "Golden Breakthrough Opportunities Under Saturn",
      "Classical Dasharatha Shani Stotram & Satvik Upayas",
    ],
    faqs: [
      {
        q: "Is Sade Sati always harmful?",
        a: "No! Saturn is the planet of justice and endurance. For Taurus, Libra, Capricorn, and Aquarius ascendants, or when Saturn transits houses with high Ashtakavarga bindus, Sade Sati frequently delivers monumental career heights.",
      },
      {
        q: "What remedies are recommended in the report?",
        a: "Strictly classical, zero-cost Satvik remedies: authentic stotram recitations, discipline routines, and charitable service. We never sell expensive stones or fear-based rituals.",
      },
    ],
    rating: { score: "4.9", count: "1,610" },
  },

  "medical-astrology-health": {
    slug: "medical-astrology-health",
    reportId: "pkg_health_medical",
    metaTitle: "Medical Astrology & Ayur-Vedic Health Report PDF | AstroLife AI",
    metaDescription:
      "24-page Medical Astrology & Cellular Vitality dossier. Evaluates 6th/8th house health vectors, Tridosha (Vata/Pitta/Kapha) constitution, and bio-planetary defense.",
    h1: "Medical Astrology & Cellular Vitality Health Dossier",
    h2Subtitle:
      "Vedic preventive health intelligence. Correlates planetary configurations with biological vulnerabilities to optimize longevity and physical vitality.",
    price: "₹249",
    paise: 24900,
    originalPrice: "₹1,499",
    badge: "🩺 Bio-Vedic Defense",
    targetKeywords: [
      "Medical astrology report PDF",
      "Health prediction from horoscope",
      "Tridosha Ayurvedic birth chart",
      "6th house disease prediction",
      "Vedic astrology health remedies",
    ],
    vargas: ["D-1 Rashi", "D-6 Shashthamsha", "Tridosha Balance", "Ayur-Vedic"],
    pageCount: "22 Pages",
    deliveryTime: "Instant 60-Second Download",
    coreHighlights: [
      {
        title: "6th & 8th House Diagnostic Scan",
        desc: "Evaluates Rogasthana (6th house) and Ayursthana (8th house) to detect latent metabolic and energetic vulnerabilities.",
      },
      {
        title: "Ayurvedic Tridosha Imprint",
        desc: "Determines your baseline constitution (Prakriti) between Vata, Pitta, and Kapha from planetary sign temperaments.",
      },
      {
        title: "Vital Organ Vulnerability Mapping",
        desc: "Identifies bodily regions corresponding to afflicted signs and houses for proactive lifestyle care.",
      },
      {
        title: "Satvik Dietary & Herbal Synergy",
        desc: "Prescribes classical herbal teas, dietary timings, and planetary pranayama to maintain homeostasis.",
      },
    ],
    chapters: [
      "Ascendant Physical Constitution & Cellular Ojas",
      "6th House Rogasthana & Afflicted Organ Systems",
      "Tridosha (Vata-Pitta-Kapha) Natal Imprint",
      "Dasha-Triggered Health Vulnerability Windows",
      "Chronobiological Sleep & Dietary Timing",
      "Classical Ayurvedic & Planetary Health Upayas",
    ],
    faqs: [
      {
        q: "Does this replace medical diagnosis?",
        a: "No. This report provides astrological preventive energy analysis rooted in classical Ayurveda and should always complement modern qualified medical care.",
      },
      {
        q: "What is the Tridosha analysis based on?",
        a: "It computes the elemental balance (Air, Fire, Earth, Water, Ether) across your ascendant, Sun, and Moon signs to identify your constitutional leaning.",
      },
    ],
    rating: { score: "4.8", count: "620" },
  },
};
