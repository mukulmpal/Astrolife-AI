export interface AstroTerm {
  name: string;
  shortForm?: string;
  category: "house" | "planet" | "sign" | "nakshatra" | "dasha" | "yoga" | "dosha" | "system";
  difficulty: "beginner" | "intermediate" | "advanced";
  shortExplanation: string;
  detailedExplanation: string;
  example?: string;
  relatedTerms?: string[];
}

export const ASTRO_EDUCATION: Record<string, AstroTerm> = {
  // HOUSES
  house_1: {
    name: "1st House (Lagna)",
    category: "house",
    difficulty: "beginner",
    shortExplanation: "Your self, personality, physical body, early life experiences.",
    detailedExplanation: `The 1st House, also called the Lagna or Ascendant, is the most important house in Vedic astrology. It represents:
• Your core personality and how you appear to the world
• Physical body, health, and vitality
• Early childhood and formative years
• Overall life direction and approach to life
• Self-image and self-confidence

The sign on your 1st house (called the Ascendant or Lagna sign) colors your entire personality. For example, an Aries Lagna person is typically more bold and direct, while a Pisces Lagna is more intuitive and spiritual. The planet ruling your Lagna becomes your chart's strongest influence.`,
    example: "If you have Saturn in your 1st house, you tend to appear serious, responsible, and mature. People often come to you for stability.",
    relatedTerms: ["Ascendant", "Lagna", "Hora Lagna"],
  },

  house_4: {
    name: "4th House (Home & Mother)",
    category: "house",
    difficulty: "beginner",
    shortExplanation: "Home, family, mother, real estate, private life, emotional security.",
    detailedExplanation: `The 4th House governs your inner emotional world and domestic life:
• Your mother and maternal relationships
• Home, real estate, property, vehicles
• Private life away from public scrutiny
• Emotional security and sense of belonging
• Your roots, heritage, and ancestral karma
• Mental peace and inner contentment

A strong 4th house indicates peace at home and good family relationships. A weak 4th house (planets in dusthana or debilitated) may bring property disputes or family tensions. The Moon here is excellent for emotional well-being.`,
    example: "Someone with Jupiter in the 4th house often receives inheritance or property gains, and creates a warm, expansive home environment.",
  },

  house_7: {
    name: "7th House (Marriage & Partnerships)",
    category: "house",
    difficulty: "beginner",
    shortExplanation: "Spouse, marriage, business partnerships, public contracts, one-to-one relationships.",
    detailedExplanation: `The 7th House is crucial for understanding your relationships:
• Spouse and marriage quality
• Business partnerships and contracts
• Romantic relationships and attraction
• The 'other' in any one-to-one relationship
• Public image in formal agreements
• Enemies (in classical interpretation)

Venus here usually brings marriage. Mars here can bring passion but also conflict. Saturn here can delay marriage or bring an older spouse. Rahu can bring unconventional partners. The 7th lord's placement matters more than planet placements in the 7th itself.`,
    example: "Someone with Venus in Libra in the 7th house typically has refined taste in partners and often attracts harmonious, beautiful relationships.",
  },

  house_10: {
    name: "10th House (Career & Public Image)",
    category: "house",
    difficulty: "beginner",
    shortExplanation: "Career, profession, public reputation, authority, government, achievement.",
    detailedExplanation: `The 10th House is your career and public face:
• Career, profession, and life work
• Public reputation and authority
• Government, business leadership roles
• Recognition and achievements
• Father figure and mentors
• Success in worldly affairs

A strong 10th house brings career growth and public respect. Sun, Mars, and Saturn do well here (though Saturn brings slow, steady progress). The 10th lord's dignity is key—if weak, career faces obstacles. This house also shows your father's influence and your relationship with authority.`,
    example: "Someone with Mars in the 10th house often becomes a military officer, sports coach, or takes action-oriented leadership roles.",
  },

  // PLANETS
  sun: {
    name: "Sun (Surya)",
    shortForm: "☉",
    category: "planet",
    difficulty: "beginner",
    shortExplanation: "Willpower, ego, father, authority, heart, vitality, leadership.",
    detailedExplanation: `The Sun is your core identity and life force:
• Your true self beyond personality
• Willpower, determination, and courage
• The father figure in your life
• Heart health and vital energy
• Position in society and authority
• Tendency toward leadership

A strong Sun makes you confident, generous, and authoritative. A weak Sun (Neecha/debilitated in Libra, or in 6/8/12 houses) can bring health issues, low confidence, or troubles with the father. Sun in the 10th house is excellent for career. Sun in the 1st makes you naturally commanding.`,
    example: "A person with Sun in Leo tends to be very visible, confident, and naturally draws attention. They often become performers or leaders.",
  },

  moon: {
    name: "Moon (Chandra)",
    shortForm: "☽",
    category: "planet",
    difficulty: "beginner",
    shortExplanation: "Mind, emotions, mother, public image, comfort, nurturing, intuition.",
    detailedExplanation: `The Moon governs your emotional and mental world:
• Your mind (manas) and emotional responses
• The mother and maternal relationships
• Public image (what people see)
• Comfort, nurturing, and security needs
• Intuition and psychic sensitivity
• Nutrition, food, and digestion

The Moon's phase at birth matters—Waxing moons are expansive, waning moons are introspective. Moon's sign (called your "Rashi" or "Moon sign") is equally important to your Sun sign. A strong Moon brings emotional stability and good relationships. Moon in 4th or 12th is excellent for spirituality.`,
    example: "A Cancer Moon person is naturally nurturing and emotional. They need emotional security and often become caregivers or counselors.",
  },

  mars: {
    name: "Mars (Mangal)",
    shortForm: "♂",
    category: "planet",
    difficulty: "beginner",
    shortExplanation: "Energy, courage, passion, aggression, desire, masculinity, conflict.",
    detailedExplanation: `Mars is your warrior energy:
• Courage, confidence, and initiative
• Sexual passion and desire
• Aggressive action and assertiveness
• Conflict, competition, and enemies
• Physical strength and athleticism
• Accidents and surgery risk (if weak)

Mars in the 6th house is excellent—you defeat enemies. Mars in the 1st makes you bold but possibly aggressive. Mars in the 7th can create marital discord (called "Mangal dosh" if severe). Mars in the 8th brings transformational power. Mars retrograde makes you question your desire.`,
    example: "An Aries Mars person is direct, competitive, and doesn't back down from challenges. They excel in sports, military, or entrepreneurship.",
  },

  venus: {
    name: "Venus (Shukra)",
    shortForm: "♀",
    category: "planet",
    difficulty: "beginner",
    shortExplanation: "Love, beauty, pleasure, luxury, creativity, charm, marriage.",
    detailedExplanation: `Venus is your capacity for love and pleasure:
• Romantic love and sexuality
• Beauty, aesthetics, and creativity
• Luxury, comfort, and material pleasure
• Art, music, and creative expression
• Charm and social magnetism
• Finance and wealth accumulation

Venus in the 7th is perfect for marriage. Venus in the 5th brings romance and creative talent. Venus in the 2nd brings wealth through business. A strong Venus makes you attractive and popular. Venus combust (too close to Sun) or debilitated can reduce your pleasure-seeking capacity.`,
    example: "A Libra Venus person naturally seeks beauty and balance in relationships. They make good artists, designers, and diplomats.",
  },

  // DASHAS
  dasha: {
    name: "Dasha (Planetary Period)",
    category: "dasha",
    difficulty: "intermediate",
    shortExplanation: "9 planetary periods (mahadasha) that run your life in sequence, each lasting years.",
    detailedExplanation: `Your life unfolds in 9 major planetary periods called Mahadashas:
• Each planet rules a period (Sun 6 yrs, Moon 10 yrs, Mars 7 yrs, Mercury 17 yrs, Jupiter 16 yrs, Venus 20 yrs, Saturn 19 yrs, Rahu 18 yrs, Ketu 7 yrs)
• These periods repeat cyclically over 120 years
• Within each Mahadasha are 9 sub-periods (Antardashas)
• Your current period determines which planets are "active"

A benefic planet's dasha brings expansion and growth. A malefic planet's dasha brings challenges. Saturn dasha is often difficult but builds maturity. Jupiter dasha brings luck and expansion. Understanding which period you're in helps predict life timing.

Example: If you're in Saturn Mahadasha, expect slower progress, karmic lessons, and reality checks. Perfect for spiritual practice but difficult for quick gains.`,
    example: "Many people experience major life shifts when entering a new Mahadasha. Career changes, relocations, or relationship shifts often align with dasha changes.",
  },

  // NAKSHATRAS
  nakshatra: {
    name: "Nakshatra (Lunar Mansion)",
    category: "nakshatra",
    difficulty: "intermediate",
    shortExplanation: "27 lunar constellations that refine personality and give precise timing for events.",
    detailedExplanation: `The 27 nakshatras are lunar mansions that fine-tune astrology:
• Each nakshatra spans 13°20' of the zodiac
• Your birth nakshatra (from Moon position) is your primary nakshatra
• Each nakshatra has a ruling deity and unique personality traits
• Nakshatras are grouped by guna (quality): Sattvic, Rajasic, Tamasic
• Used for timing ceremonies, marriages, and important events (Muhurta)

For example:
- Ashwini: Swift, courageous, healing
- Rohini: Fertile, stable, creative
- Krittika: Sharp, critical, purifying
- Mrigashira: Curious, adaptable, thoughtful

Your nakshatra placement is more specific than your sign. Two people born on the same date but different times could be in different nakshatras, giving very different personality traits.`,
    example: "Someone born under Pushya nakshatra is traditionally considered very fortunate and protected. Pushya is ruled by Jupiter (Brihaspati).",
  },

  // YOGAS
  yoga: {
    name: "Yoga (Planetary Combination)",
    category: "yoga",
    difficulty: "advanced",
    shortExplanation: "Special planetary combinations that create specific effects—some auspicious, some challenging.",
    detailedExplanation: `Yogas are combinations of planets that create special effects:

AUSPICIOUS YOGAS:
• Gaja Kesari Yoga: Jupiter-Moon combination → leadership, wisdom, protection
• Raj Yoga: Kendra-Trikona planets yogakaraka → power, success, authority
• Dhana Yoga: 2nd/11th lord in kendra/trikona → wealth accumulation
• Pancha Maha Purusha Yoga: Benefic in own sign in kendra → incredible success

CHALLENGING YOGAS:
• Angarak Yoga: Mars-Rahu conjunction → accidents, impulsive decisions
• Visha Yoga: Debilitated Moon with malefics → mental instability
• Parivartan Yoga: Planets exchange signs → complex fated events

About 120 major yogas exist. Your chart is a combination of these. Some yogas can be negated by other factors. Classical astrology identifies yogas to predict specific life outcomes.`,
    example: "Gaja Kesari Yoga (Jupiter aspecting or conjunct Moon) is considered one of the most auspicious yogas. People with this often become leaders.",
  },

  // DOSHAS
  dosha: {
    name: "Dosha (Flaw/Challenge)",
    category: "dosha",
    difficulty: "intermediate",
    shortExplanation: "Challenging planetary combinations that need remedy or awareness—not catastrophic, manageable with work.",
    detailedExplanation: `Doshas are imbalances that create challenges:

MAJOR DOSHAS:
• Mangal Dosh: Mars in 1/4/7/8/12 from Lagna or Moon → marital delays/conflict (remedies exist)
• Kaal Sarp Dosh: Rahu-Ketu on axis blocking other planets → fated challenges with spiritual purpose
• Pitru Dosh: Unresolved ancestral karma → family obstacles until remedied
• Kal Dosh: Debilitated planets without aspects → weak areas of life

IMPORTANT: Doshas are NOT curses. They're learning opportunities. A dosha indicates where life demands your attention and spiritual growth. Remedies (mantras, gems, rituals, charity) work not by magic but by shifting your focus and behavior.

Example: Someone with Mangal Dosh isn't doomed to divorce. It just means they should marry mindfully, work on communication, and perform remedies.`,
    example: "A Kaal Sarp Dosh person often experiences repeating patterns until they understand the karmic lesson. Once they learn and evolve, the pattern breaks.",
  },

  // SYSTEMS
  kp_system: {
    name: "KP System (Krishnamurti Paddhati)",
    category: "system",
    difficulty: "advanced",
    shortExplanation: "Modern predictive system using sub-lords for precise timing and yes/no answers.",
    detailedExplanation: `The KP System is a 20th-century innovation by K.S. Krishnamurti that modernizes Vedic astrology:

KEY DIFFERENCES:
• Divides each of 27 nakshatras into 9 sub-periods (instead of just 4 padas)
• Uses "sub-lords" for precise predictions
• Excellent for Prashna (horary/question astrology)
• Gives clear YES/NO answers by analyzing lords of relevant houses
• Avoids ambiguous interpretations

FOR YES/NO QUESTIONS (Prashna):
• Identify the main house for the question (7th for marriage, 10th for career, etc.)
• Check if 7th lord, Moon, and Question Karaka are in favorable positions
• Analyze the Hora Lagna (hourly ascendant)
• Sub-lord of relevant house gives the final judgment

KP System is especially useful for:
- Marriage timing
- Business decisions
- Property purchases
- Job offers
- Health prognosis

The system is mathematical and removes guesswork, making it popular with modern astrologers.`,
    example: "In KP Prashna, if you ask 'Will I get the job?', we check the 10th house lord, Moon, and Jupiter (career karaka). If these are in 2/5/7/9/11 houses, answer is YES.",
  },

  guna_milan: {
    name: "Guna Milan (Compatibility Matching)",
    category: "system",
    difficulty: "intermediate",
    shortExplanation: "Point system (36 points) for marriage compatibility checking—8 different dimensions.",
    detailedExplanation: `Guna Milan (also Ashta-Kuta) is the traditional system for checking marriage compatibility:

8 DIMENSIONS (8 Kutas):
1. Varna (caste/quality): 1 point
2. Vashya (mutual attraction): 2 points
3. Tara (favorable timing): 3 points
4. Yoni (sexual compatibility): 4 points
5. Graha Maitri (planetary friendship): 5 points
6. Gana (temperament): 6 points
7. Bhakoot (health/prosperity): 7 points
8. Nadi (genetic compatibility): 8 points

TOTAL: 36 POINTS

SCORING:
• 32-36: Excellent match
• 26-31: Good match
• 16-25: Average (remedies can help)
• Below 16: Challenging (needs extensive work)

IMPORTANT: Low Guna Milan can work if both partners are committed. Love and respect matter more than points. The system is a guide, not a verdict.

Modern astrologers also consider:
- Synastry (planet-to-planet aspects)
- Navamsha (D9 chart) compatibility
- Dasha timing (ensure both in compatible periods)`,
    example: "A couple scoring 28 points has good compatibility but might face initial adjustment. Knowing this helps them work through challenges.",
  },
};

export function getEducation(term: string): AstroTerm | null {
  return ASTRO_EDUCATION[term.toLowerCase().replace(/\s+/g, "_")] || null;
}

export function getTermsByCategory(category: AstroTerm["category"]): AstroTerm[] {
  return Object.values(ASTRO_EDUCATION).filter((term) => term.category === category);
}

export function getTermsByDifficulty(difficulty: AstroTerm["difficulty"]): AstroTerm[] {
  return Object.values(ASTRO_EDUCATION).filter((term) => term.difficulty === difficulty);
}
