/**
 * Engine Intros — Premium positioning + safety copy for all 25+ astrology engines.
 * Used by EngineIntro component on each engine page.
 */

export interface EngineIntroData {
  title: string;
  subtitle: string;
  description: string;
  safetyNote?: string;
  whatItAnalyzes?: string[];
}

export const engineIntros: Record<string, EngineIntroData> = {
  yogas: {
    title: 'Yogas',
    subtitle: 'Powerful planetary combinations in your chart.',
    description:
      'Detects Raja Yogas, Dhana Yogas, Pancha Mahapurusha Yogas, doshas, Chandra Yogas, spiritual yogas, and career yogas. Shows which combinations are present, which are weak, and their practical impact on your life.',
    whatItAnalyzes: ['Present yogas', 'Weak yogas', 'Doshas', 'Planetary strength', 'Life-area impact'],
  },
  dasha: {
    title: 'Dasha (Vimshottari)',
    subtitle: 'Your planetary timing system.',
    description:
      'Shows which planetary period is currently shaping your life and what themes may become active during each phase. Vimshottari dasha is one of the most important timing systems in Vedic astrology — it reveals *when*, not just *what*.',
    whatItAnalyzes: [
      'Mahadasha (major period)',
      'Antardasha (sub-period)',
      'Pratyantardasha (sub-sub-period)',
      'Career timing windows',
      'Relationship timing',
      'Financial cycles',
    ],
  },
  shadbala: {
    title: 'Shadbala',
    subtitle: 'Classical planetary strength measurement.',
    description:
      'Measures the practical strength of each planet using six classical strength factors: Sthana Bala, Dig Bala, Kala Bala, Cheshta Bala, Naisargika Bala, and Drik Bala. Shows which planets are strong allies and which need support through remedies.',
    whatItAnalyzes: [
      'Sthana Bala (positional strength)',
      'Dig Bala (directional strength)',
      'Kala Bala (time strength)',
      'Cheshta Bala (motional strength)',
      'Naisargika Bala (natural strength)',
      'Drik Bala (aspect strength)',
    ],
  },
  ashtakavarga: {
    title: 'Ashtakavarga',
    subtitle: 'House and life-area support strength.',
    description:
      'Shows how much support each house and life area receives through bindu (point) strength. Reveals which houses are well-supported and which are weak, helping you understand timing for opportunities and cautions.',
    whatItAnalyzes: [
      'Sarvashtakavarga (overall strength)',
      'Planet-wise bindus',
      'Strong houses',
      'Weak houses',
      'Transit support',
      'Life-area strength',
    ],
  },
  divisional: {
    title: 'Divisional Charts',
    subtitle: 'Hidden layers in your birth chart.',
    description:
      'Reveals deeper life areas by examining divisional charts: D2 wealth, D7 children, D9 marriage, D10 career, D20 spirituality, and more. Each division zooms into a specific life theme that the main chart alone cannot show.',
    whatItAnalyzes: [
      'D1 main life',
      'D2 wealth',
      'D7 children & creativity',
      'D9 marriage & dharma',
      'D10 career & status',
      'D20 spirituality',
      'Custom divisional insights',
    ],
  },
  kp: {
    title: 'KP System',
    subtitle: 'Event-focused prediction using cusps and significators.',
    description:
      'Adds a classical layer through cusps, significators, sub-lords, and timing logic. KP is especially useful for pinpointing event timing and validating whether a promise in your chart will manifest.',
    whatItAnalyzes: ['Cusps', 'Sub-lords', 'House significations', 'Event validation', 'Marriage timing', 'Career timing'],
  },
  psychology: {
    title: 'Psychology',
    subtitle: 'Your emotional and behavioral patterns through astrology.',
    description:
      'Astrology-based psychology reflecting emotional patterns, decision style, attachment tendencies, shadow patterns, and mental habits through planetary symbolism. Use as reflective self-awareness, not as medical diagnosis.',
    safetyNote:
      'This is astrology-based self-reflection only, not medical or psychological diagnosis. If you have clinical concerns, consult a qualified mental health professional.',
    whatItAnalyzes: [
      'Moon emotional style',
      'Mercury thinking pattern',
      'Mars reaction style',
      'Saturn fears & discipline',
      'Rahu/Ketu karmic loops',
      'Shadow work themes',
    ],
  },
  lalkitab: {
    title: 'Lal Kitab',
    subtitle: 'Practical karma and remedy-oriented astrology.',
    description:
      'Gives practical karmic and remedy-oriented insights using house behavior, planetary clashes, rin (debt) patterns, and simple household-scale upayas (remedies). Focuses on what you can do, not what you cannot avoid.',
    whatItAnalyzes: [
      'Pakka Ghar (good house)',
      'Dushman Ghar (enemy house)',
      'Rin (karmic debt)',
      'Takkar (planetary clash)',
      'Age triggers',
      'Safe remedies',
    ],
  },
  numerology: {
    title: 'Numerology',
    subtitle: 'Birth number and name vibration analysis.',
    description:
      'Reads the vibration of your birth date and name to reveal personality, life path, timing cycles, and personal-year themes. Complements astrology with numerical symbolism.',
    whatItAnalyzes: [
      'Life path number',
      'Destiny number',
      'Soul urge',
      'Personality number',
      'Personal year',
      'Pinnacles & challenges',
    ],
  },
  panchang: {
    title: 'Panchang (Daily)',
    subtitle: 'Daily quality and auspicious timing.',
    description:
      'Helps you understand the quality of each day through tithi, nakshatra, yoga, karana, hora, Rahu Kaal, and Gulika. Perfect for choosing auspicious moments and avoiding inauspicious windows.',
    whatItAnalyzes: [
      'Tithi (lunar day)',
      'Nakshatra (star)',
      'Yoga (planetary combination)',
      'Karana (half-tithi)',
      'Rahu Kaal & Gulika',
      'Muhurta guidance',
      'Daily remedy',
    ],
  },
  'astro-sound': {
    title: 'Astro Sound',
    subtitle: 'Planetary mood and raga-inspired guidance.',
    description:
      'Connects planetary energy, emotional state, and classical Indian raga-inspired sound guidance for reflective support. Use as a complementary tool for emotional balance, not as medical treatment.',
    whatItAnalyzes: [
      'Raag/mood mapping',
      'Planetary associations',
      'Emotional support',
      'Meditation guidance',
      'Music resonance',
    ],
  },
  gemstone: {
    title: 'Gemstone',
    subtitle: 'Supportive stone recommendations based on your chart.',
    description:
      'Recommends supportive stones based on chart strength, dasha, benefic/malefic role, and safety checks. Never recommends blindly — cross-checks Shadbala, Lal Kitab, and planetary contradictions.',
    safetyNote:
      'Consult a trusted astrologer before wearing expensive gemstones permanently. Recommendations are supportive, not guaranteed.',
    whatItAnalyzes: [
      'Ascendant lord strength',
      'Functional benefic/malefic',
      'Dasha relevance',
      'Shadbala support',
      'Contradiction safety checks',
    ],
  },
  vastu: {
    title: 'Vastu',
    subtitle: 'Directional energy and space correction.',
    description:
      'Combines directional energy, practical space correction, and astrology-linked remedies for home and business. Focuses on no-demolition, household-scale improvements.',
    whatItAnalyzes: [
      'Home vastu',
      'Business vastu',
      'Direction zones',
      'Elements & colors',
      'Practical remedies',
      'Layout suggestions',
    ],
  },
  'kundali-milan': {
    title: 'Kundali Milan (Marriage Compatibility)',
    subtitle: 'Beyond 36 guna — comprehensive relationship analysis.',
    description:
      'Marriage compatibility goes beyond Ashtakoot matching. AstroLife combines Guna score, Manglik balance, D9 promises, psychology, children awareness, KP validation, and timing support to give a complete picture.',
    whatItAnalyzes: [
      'Ashtakoot (8-fold matching)',
      'Guna score & interpretation',
      'Manglik dosha',
      'Emotional compatibility',
      'Marriage promise timing',
      'Children awareness',
      'Remedies if needed',
    ],
  },
  'marriage-timing': {
    title: 'Marriage Timing',
    subtitle: 'When relationship and marriage windows become active.',
    description:
      'Studies when relationship and marriage windows may become active using Dasha, transit, D9 analysis, Venus/Jupiter factors, and 7th house strength. Shows both support windows and delay factors.',
    whatItAnalyzes: [
      'D1 & D9 promise',
      '7th house strength',
      'Venus & Jupiter role',
      'Current dasha phase',
      'Transit support',
      'Marriage windows',
      'Delay factors',
    ],
  },
  palmistry: {
    title: 'Palmistry (AI Analysis)',
    subtitle: 'AI-assisted palm reading from image upload.',
    description:
      'AI palmistry reads visible palm structure, lines (life, head, heart, fate, sun), mounts, fingers, thumb, and hand shape to generate a reflective palm reading. Upload a clear palm image to begin.',
    safetyNote:
      'AI-assisted palmistry has a confidence score — the deeper your palm details, the more confident the reading. Always combine with astrology for a complete picture.',
    whatItAnalyzes: [
      'Life line',
      'Head line',
      'Heart line',
      'Fate line',
      'Sun line',
      'Mercury line',
      'Mounts & fingers',
      'Hand shape',
      'Confidence score',
    ],
  },
  'family-synastry': {
    title: 'Family Karma',
    subtitle: 'Multiple charts read together for family patterns.',
    description:
      'Maps multiple charts together to understand ancestral patterns, emotional inheritance, relationship dynamics, and family karmic themes. Perfect for understanding parent-child, partner, and sibling patterns.',
    whatItAnalyzes: [
      'Self chart',
      'Family member charts',
      'Parent-child patterns',
      'Partner patterns',
      'Sibling dynamics',
      'Ancestral karma',
      'Shared doshas',
    ],
  },
  jaimini: {
    title: 'Jaimini',
    subtitle: 'Classical layer through karakas and Chara Dasha.',
    description:
      'Adds another classical layer through Atmakaraka, Amatyakaraka, Chara Dasha, Arudha, Argala, and Jaimini Raja Yogas. Reveals destiny patterns beyond Parashari perspective.',
    whatItAnalyzes: [
      "Atmakaraka (soul's intention)",
      'Amatyakaraka (intellect)',
      'Chara Dasha',
      'Arudha Lagna',
      'Argala',
      'Jaimini Raja Yogas',
    ],
  },
  medical: {
    title: 'Medical Astrology',
    subtitle: 'Health tendencies and body-area sensitivities.',
    description:
      'Reflects symbolic health tendencies and body-area sensitivities through planetary and house patterns. Use as traditional reflection only — never replace doctor consultation.',
    safetyNote:
      'This is traditional astrology-based reflection, not diagnosis or treatment. For any health concerns, consult a qualified medical professional immediately.',
    whatItAnalyzes: [
      'Planetary health rulerships',
      'House health implications',
      'Lifestyle awareness',
      'Vulnerability areas',
      'Wellness support',
    ],
  },
  prashna: {
    title: 'Prashna (Horary)',
    subtitle: 'Answers to your specific question.',
    description:
      'Prashna answers a specific yes/no question using the chart of the moment the question is asked. Perfect for timing validation, yes/no questions, and specific decision-making.',
    whatItAnalyzes: [
      'Question chart',
      'Question timing',
      'City & location',
      'Lagna & Moon',
      'Relevant houses',
      'Yes/no tendency',
      'Timing if available',
    ],
  },
  remedy: {
    title: 'Remedy (Unified)',
    subtitle: 'Contradiction-safe, comprehensive remedy plan.',
    description:
      'Unified Remedy Intelligence combines chart weakness, dasha, transit, Lal Kitab, gemstone, vastu, mantra, donation, color, fasting, and lifestyle guidance into one coherent plan. Never suggests contradictory remedies.',
    whatItAnalyzes: [
      'Mantra (vedic chant)',
      'Donation (time & resources)',
      'Fasting (lunar, weekly)',
      'Color therapy',
      'Lifestyle shifts',
      'Vastu corrections',
      'Gemstone support',
      'Astro sound guidance',
      'Panchang-timed actions',
      'Lal Kitab upayas',
    ],
  },
  sarvatobhadra: {
    title: 'Sarvatobhadra Chakra',
    subtitle: 'Nakshatra-based protection and auspicious timing.',
    description:
      'An advanced nakshatra-based protection and timing grid used to understand sensitive periods, vedha (obstruction), and auspiciousness. Classical layer for serious seekers.',
    whatItAnalyzes: [
      'Nakshatra grid',
      'Vedha points',
      'Sensitive periods',
      'Auspicious timing',
      'Muhurta validation',
      'Advanced classical layer',
    ],
  },
  'special-lagnas': {
    title: 'Special Lagnas',
    subtitle: 'Beyond the ascendant — prosperity and image.',
    description:
      'Reveals prosperity, social image, status, fortune, and hidden chart dimensions beyond the regular ascendant. Includes Arudha Lagna, Hora Lagna, Ghati Lagna, and more.',
    whatItAnalyzes: [
      'Arudha Lagna (image)',
      'Hora Lagna (wealth)',
      'Ghati Lagna (time)',
      'Indu Lagna (fortune)',
      'Bhava Lagna (house)',
      'Prosperity indicators',
    ],
  },
  history: {
    title: 'Chart History',
    subtitle: 'Manage and revisit saved charts.',
    description:
      'Your personal chart library. Save birth profiles, revisit past readings, compare charts across time, and manage which chart powers all your engine analyses. Infrastructure for your astrology practice.',
    whatItAnalyzes: [
      'Saved birth profiles',
      'Chart metadata',
      'Past reading history',
      'Multi-chart comparison',
      'Chart selection for engines',
    ],
  },
  report: {
    title: 'Premium Report',
    subtitle: 'Complete life analysis in one structured document.',
    description:
      'Combines all AstroLife engines into one comprehensive life report: birth chart, yogas, dasha, destiny, shadbala, divisional charts, marriage, career, psychology, remedies, vastu, gemstone, transits, and AI summary. Your complete astrological snapshot.',
    whatItAnalyzes: [
      'Executive summary',
      'Birth chart overview',
      'Planetary strength',
      'Yogas & doshas',
      'Dasha timeline',
      'Life purpose & destiny',
      'Career & wealth',
      'Marriage & relationships',
      'Psychology & patterns',
      'Health awareness',
      'Divisional insights',
      'Transit outlook',
      'Remedies & guidance',
    ],
  },
};
