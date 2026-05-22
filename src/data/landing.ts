export const ctaHref = "/onboarding";
export const chatHref = "/dashboard/chat";

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Agents", href: "#ai-agents" },
  { label: "Engines", href: "#engines" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#trust" },
];

export const trustBadges = [
  "Free Kundli in 60 seconds",
  "15+ Astrology Engines",
  "10 AI Specialist Agents",
  "Personalized Remedies",
  "Premium PDF Reports",
];

export const metrics = [
  { value: "15+", label: "Astrology Engines" },
  { value: "10", label: "AI Agents" },
  { value: "60-sec", label: "Free Kundli" },
  { value: "12-month", label: "Forecasts" },
  { value: "PDF", label: "Premium Reports" },
];

export const painPoints = [
  {
    title: "Sun-sign apps miss the real chart",
    description: "Daily zodiac predictions ignore lagna, dasha, yogas, transits and your exact birth time.",
  },
  {
    title: "Traditional reports are too complex",
    description: "Classic kundli reports can be accurate, but they often hide the useful guidance under jargon.",
  },
  {
    title: "Generic AI does not know your karma",
    description: "A normal chatbot cannot read KP sub-lords, Vimshottari dasha, Lal Kitab or remedies together.",
  },
];

export const features = [
  { icon: "Sparkles", title: "Free AI Kundli", description: "Generate your birth chart with clear houses, rashi, planets and core life signals." },
  { icon: "FileText", title: "Premium Kundli Dossier", description: "A structured life report with tables, interpretations, action steps and remedies." },
  { icon: "Bot", title: "AI Astrologer Chat", description: "Ask follow-up questions with full natal, dasha, transit and engine context." },
  { icon: "Clock3", title: "Vimshottari Dasha Timeline", description: "Understand your active mahadasha, antardasha and life timing windows." },
  { icon: "Radar", title: "Transit Radar", description: "Track near-term opportunities, caution days and live planetary weather." },
  { icon: "BriefcaseBusiness", title: "Career & Wealth Timing", description: "See career growth, income periods and practical windows for action." },
  { icon: "Heart", title: "Love & Marriage Analysis", description: "Decode relationship patterns, marriage timing and compatibility themes." },
  { icon: "Compass", title: "KP Sub-Lord Predictions", description: "Use cusp, star-lord and sub-lord logic for sharper event analysis." },
  { icon: "HandHeart", title: "Lal Kitab Remedies", description: "Simple behavioral, charity and household remedies connected to your chart." },
  { icon: "GitBranch", title: "Nadi Karmic Patterns", description: "Read repeating karmic loops and storylines through planetary sequences." },
  { icon: "Grid3X3", title: "Ashtakavarga Strength", description: "Measure house strength through bindus for better planning." },
  { icon: "Gauge", title: "Shadbala Planet Power", description: "Identify strong and sensitive planets across six strength layers." },
  { icon: "Music2", title: "AstroSound Therapy", description: "Planetary sound guidance for mood, focus and spiritual alignment." },
  { icon: "UsersRound", title: "Family Karma Mapping", description: "Study multiple charts together to reveal family patterns and inherited themes." },
];

export const agents = [
  { icon: "BriefcaseBusiness", name: "Career Agent", description: "Jobs, growth windows, authority, dasha timing and public karma." },
  { icon: "HeartHandshake", name: "Marriage Agent", description: "Marriage timing, partner patterns, compatibility and emotional cycles." },
  { icon: "IndianRupee", name: "Wealth Agent", description: "Income houses, gains, investments, money periods and practical planning." },
  { icon: "HandHeart", name: "Lal Kitab Agent", description: "Upaya, rin, takkar, ancestral correction and grounded remedies." },
  { icon: "Compass", name: "KP Agent", description: "Cusp promise, sub-lords, significators and event-style judgment." },
  { icon: "GitBranch", name: "Nadi Agent", description: "Karmic narratives, repeating loops and deeper planetary storylines." },
  { icon: "Radar", name: "Transit Agent", description: "Current gochar, weekly action windows and caution signals." },
  { icon: "Brain", name: "Psychology Agent", description: "Moon, Mercury, shadow patterns, anxiety loops and inner behavior." },
  { icon: "Flame", name: "Remedy Agent", description: "Mantras, charity, habits, colors and safe gemstone caution." },
  { icon: "Music2", name: "AstroSound Agent", description: "Personal sound guidance for focus, calm and energetic balance." },
];

export const steps = [
  {
    number: "01",
    title: "Enter birth details",
    description: "Name, date, time and birthplace. AstroLife builds the foundation of your chart.",
  },
  {
    number: "02",
    title: "AstroLife computes your chart",
    description: "Runs Vedic, KP, Lal Kitab, Nadi, Dasha, Transit, Ashtakavarga and psychology engines.",
  },
  {
    number: "03",
    title: "Get personal guidance",
    description: "AI chat, life-area reports, remedies, PDF exports, alerts and AstroSound guidance.",
  },
];

export const engines = [
  "Vedic Kundli",
  "Parashari",
  "KP Astrology",
  "Lal Kitab",
  "Bhrigu Nandi Nadi",
  "Jaimini",
  "Vimshottari Dasha",
  "Transit Engine",
  "Ashtakavarga",
  "Shadbala",
  "Divisional Charts",
  "Panchang",
  "Numerology",
  "Vastu",
  "AstroSound",
  "Family Karma",
];

export const useCases = [
  "When will my career grow?",
  "When is the right time for marriage?",
  "Which dasha am I going through?",
  "Why do relationship patterns repeat?",
  "What are my strongest yogas?",
  "Which remedies suit my chart?",
  "Which period is best for money?",
  "What is my life purpose?",
  "What does my family karma show?",
];

export const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    description: "Start with your core kundli and basic AI guidance.",
    cta: "Generate Free Kundli",
    popular: false,
    features: [
      "Basic Kundli",
      "Daily Astrology Card",
      "Limited AI Questions",
      "Top Yogas",
      "Basic Dosha Detection",
      "Watermarked PDF",
    ],
  },
  {
    name: "Premium",
    price: "₹499",
    cadence: "/month",
    description: "Full personal astrology OS for serious self-understanding.",
    cta: "Start Premium",
    popular: true,
    features: [
      "Unlimited AI Astrology Chat",
      "Full Kundli Analysis",
      "Dashas + Transits",
      "KP + Lal Kitab + Nadi",
      "Psychology Reports",
      "AstroSound",
      "PDF Reports",
      "Family Charts",
      "Transit Alerts",
    ],
  },
  {
    name: "Elite",
    price: "₹1,999",
    cadence: "/month",
    description: "High-touch intelligence for families, founders and power users.",
    cta: "Go Elite",
    popular: false,
    features: [
      "Everything in Premium",
      "Personal AI Astrologer",
      "WhatsApp AI Assistant",
      "Business Muhurat AI",
      "Yearly Forecasts",
      "Family Karma Mapping",
      "Unlimited Reports",
      "Priority Support",
      "White-label Astrologer Dashboard",
    ],
  },
];

export const testimonials = [
  {
    quote: "This felt more personal than a normal astrology report.",
    name: "Ananya Sharma",
    detail: "Product designer, Mumbai",
  },
  {
    quote: "Dasha timing helped me understand my career window.",
    name: "Rohit Mehta",
    detail: "Founder, Delhi NCR",
  },
  {
    quote: "The AI astrologer explained my chart in simple language.",
    name: "Nisha Iyer",
    detail: "Consultant, Bengaluru",
  },
  {
    quote: "AstroSound and remedies made the experience feel different.",
    name: "Karan Malhotra",
    detail: "Marketing lead, Pune",
  },
];

export const trustPoints = [
  "Privacy-first birth data handling",
  "Vedic calculation foundation",
  "Multi-engine interpretation",
  "AI explanations in simple language",
  "No generic copy-paste predictions",
  "Guidance-oriented, not fear-based",
];

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Free Kundli", href: "/dashboard/kundli" },
      { label: "AI Chat", href: "/dashboard/chat" },
      { label: "Reports", href: "/dashboard/report" },
      { label: "Pricing", href: "/dashboard/upgrade" },
    ],
  },
  {
    title: "Engines",
    links: [
      { label: "KP", href: "/dashboard/kp" },
      { label: "Lal Kitab", href: "/dashboard/lalkitab" },
      { label: "Dasha", href: "/dashboard/dasha" },
      { label: "Transit", href: "/dashboard/transits" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refunds", href: "/refund" },
    ],
  },
];
