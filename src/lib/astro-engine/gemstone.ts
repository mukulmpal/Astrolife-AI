// src/lib/astro-engine/gemstone.ts
// AstroLife Gemstone Engine — chart-normalized, full recommendation engine
import { evaluateFunctionalDebilityGemstoneGuard } from "./functional-debility-guard";

export type Planet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu"
  | "Ascendant";

export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  house: number;
  isRetrograde?: boolean;
  nakshatra?: string;
  nakshatraPada?: number;
  dignity?: "exalted" | "own" | "friendly" | "neutral" | "enemy" | "debilitated";
}

export interface NatalChart {
  ascendant: ZodiacSign;
  ascendantDegree: number;
  planets: PlanetPosition[];
  lagnaLord?: Planet;
}

export interface GemstoneRecommendation {
  gemstone: string;
  alternateGemstone: string;
  planet: Planet;
  reason: string;
  benefits: string[];
  cautions: string[];
  wearing: {
    metal: string;
    finger: string;
    day: string;
    time: string;
    mantra: string;
    weight: string;
  };
  strength: "Primary" | "Secondary" | "Tertiary";
  score: number;
  color: string;
  hexColor: string;
  chakra: string;
  element: string;
}

export interface AvoidGemstone {
  gemstone: string;
  planet: Planet;
  reason: string;
}

export interface GemstoneReport {
  primaryGemstone: GemstoneRecommendation;
  secondaryGemstones: GemstoneRecommendation[];
  avoidGemstones: AvoidGemstone[];
  lagnaSign: ZodiacSign;
  lagnaLord: Planet;
  currentDasha: string;
  dashaNote: string;
  analysisNotes: string[];
  safetyNote: string;
}

export interface RudrakshaWearing {
  metal: string;
  day: string;
  finger: string;
  position: string;
}

export interface RudrakshaData {
  mukhi: number;
  nameHindi: string;
  nameEnglish: string;
  rulingDeity: string;
  rulingPlanet: string;
  mantra: string;
  element: string;
  spiritualBenefits: string[];
  healthBenefits: string[];
  materialBenefits: string[];
  problemsSolved: string[];
  bestFor: string[];
  wearing: RudrakshaWearing;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Extremely Rare";
}

export interface RudrakshaRecommendation {
  planet: Exclude<Planet, "Ascendant">;
  mukhi: string;
  bead: string;
  mantra: string;
  reason: string;
  rulingDeity: string;
  spiritualBenefits: string[];
  healthBenefits: string[];
  materialBenefits: string[];
  problemsSolved: string[];
  bestFor: string[];
  wearing: RudrakshaWearing;
  rarity: string;
}

export interface DashaGemRecommendation {
  level: "Mahadasha" | "Antardasha";
  planet: Exclude<Planet, "Ascendant">;
  gemstone: string;
  alternateGemstone: string;
  rudraksha: RudrakshaRecommendation;
  wearing: {
    metal: string;
    finger: string;
    day: string;
    time: string;
    mantra: string;
    weight: string;
  };
  reason: string;
}

const SIGNS: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const SIGN_RULERS: Record<ZodiacSign, Planet> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

export const PLANET_GEMSTONES: Record<
  Planet,
  { primary: string; alternate: string; color: string; hex: string; chakra: string; element: string }
> = {
  Sun: {
    primary: "Ruby",
    alternate: "Red Spinel / Garnet",
    color: "Deep Red",
    hex: "#C0392B",
    chakra: "Manipura",
    element: "Fire",
  },
  Moon: {
    primary: "Pearl",
    alternate: "Moonstone / White Coral",
    color: "Milky White",
    hex: "#F0EAD6",
    chakra: "Swadhisthana",
    element: "Water",
  },
  Mars: {
    primary: "Red Coral",
    alternate: "Carnelian / Red Jasper",
    color: "Orange Red",
    hex: "#E74C3C",
    chakra: "Muladhara",
    element: "Fire",
  },
  Mercury: {
    primary: "Emerald",
    alternate: "Green Tourmaline / Peridot",
    color: "Vivid Green",
    hex: "#27AE60",
    chakra: "Anahata",
    element: "Earth",
  },
  Jupiter: {
    primary: "Yellow Sapphire",
    alternate: "Citrine / Yellow Topaz",
    color: "Golden Yellow",
    hex: "#F1C40F",
    chakra: "Sahasrara",
    element: "Ether",
  },
  Venus: {
    primary: "Diamond",
    alternate: "White Sapphire / Zircon",
    color: "Clear White",
    hex: "#ECF0F1",
    chakra: "Anahata",
    element: "Water",
  },
  Saturn: {
    primary: "Blue Sapphire",
    alternate: "Amethyst / Blue Spinel",
    color: "Deep Blue",
    hex: "#2980B9",
    chakra: "Ajna",
    element: "Air",
  },
  Rahu: {
    primary: "Hessonite",
    alternate: "Spessartite Garnet",
    color: "Honey Orange",
    hex: "#E67E22",
    chakra: "Vishuddha",
    element: "Air",
  },
  Ketu: {
    primary: "Cat's Eye",
    alternate: "Chrysoberyl",
    color: "Greenish Yellow",
    hex: "#B7950B",
    chakra: "Muladhara",
    element: "Fire",
  },
  Ascendant: {
    primary: "—",
    alternate: "—",
    color: "—",
    hex: "#888888",
    chakra: "—",
    element: "—",
  },
};

export const PLANET_WEARING: Record<
  Planet,
  { metal: string; finger: string; day: string; time: string; mantra: string; weight: string }
> = {
  Sun: {
    metal: "Gold",
    finger: "Ring finger",
    day: "Sunday",
    time: "Sunrise",
    mantra: "Om Suryaya Namah",
    weight: "3–5 carats",
  },
  Moon: {
    metal: "Silver",
    finger: "Little finger",
    day: "Monday",
    time: "Evening",
    mantra: "Om Chandraya Namah",
    weight: "4–6 carats",
  },
  Mars: {
    metal: "Gold / Copper",
    finger: "Ring finger",
    day: "Tuesday",
    time: "Morning",
    mantra: "Om Mangalaya Namah",
    weight: "6–9 carats",
  },
  Mercury: {
    metal: "Gold",
    finger: "Little finger",
    day: "Wednesday",
    time: "Morning",
    mantra: "Om Budhaya Namah",
    weight: "3–5 carats",
  },
  Jupiter: {
    metal: "Gold",
    finger: "Index finger",
    day: "Thursday",
    time: "Morning",
    mantra: "Om Brihaspataye Namah",
    weight: "4–5 carats",
  },
  Venus: {
    metal: "Silver / Platinum",
    finger: "Middle finger",
    day: "Friday",
    time: "Morning",
    mantra: "Om Shukraya Namah",
    weight: "0.5–1 carat",
  },
  Saturn: {
    metal: "Silver / Iron",
    finger: "Middle finger",
    day: "Saturday",
    time: "Twilight",
    mantra: "Om Shanaischaraya Namah",
    weight: "4–5 carats",
  },
  Rahu: {
    metal: "Silver / Panchdhatu",
    finger: "Middle finger",
    day: "Saturday",
    time: "Evening",
    mantra: "Om Rahave Namah",
    weight: "6–8 carats",
  },
  Ketu: {
    metal: "Silver / Panchdhatu",
    finger: "Little finger",
    day: "Tuesday",
    time: "Morning",
    mantra: "Om Ketave Namah",
    weight: "6–8 carats",
  },
  Ascendant: {
    metal: "—",
    finger: "—",
    day: "—",
    time: "—",
    mantra: "—",
    weight: "—",
  },
};

const LAGNA_BENEFICS: Record<ZodiacSign, Planet[]> = {
  Aries: ["Sun", "Moon", "Mars", "Jupiter"],
  Taurus: ["Venus", "Mercury", "Saturn"],
  Gemini: ["Venus", "Saturn", "Mercury"],
  Cancer: ["Moon", "Mars", "Jupiter"],
  Leo: ["Sun", "Mars", "Jupiter"],
  Virgo: ["Mercury", "Venus", "Saturn"],
  Libra: ["Venus", "Saturn", "Mercury"],
  Scorpio: ["Moon", "Sun", "Jupiter", "Mars"],
  Sagittarius: ["Sun", "Mars", "Jupiter"],
  Capricorn: ["Venus", "Mercury", "Saturn"],
  Aquarius: ["Venus", "Saturn", "Mercury"],
  Pisces: ["Moon", "Mars", "Jupiter"],
};

const LAGNA_MALEFICS: Record<ZodiacSign, Planet[]> = {
  Aries: ["Saturn", "Mercury", "Venus"],
  Taurus: ["Sun", "Moon", "Mars", "Jupiter"],
  Gemini: ["Sun", "Moon", "Mars", "Jupiter"],
  Cancer: ["Saturn", "Venus", "Mercury"],
  Leo: ["Saturn", "Venus", "Mercury"],
  Virgo: ["Sun", "Moon", "Mars", "Jupiter"],
  Libra: ["Sun", "Moon", "Mars", "Jupiter"],
  Scorpio: ["Venus", "Mercury", "Saturn"],
  Sagittarius: ["Saturn", "Venus", "Mercury"],
  Capricorn: ["Sun", "Moon", "Mars", "Jupiter"],
  Aquarius: ["Sun", "Moon", "Mars", "Jupiter"],
  Pisces: ["Saturn", "Venus", "Mercury"],
};

const EXALTATION: Record<Planet, ZodiacSign> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
  Rahu: "Taurus",
  Ketu: "Scorpio",
  Ascendant: "Aries",
};

const DEBILITATION: Record<Planet, ZodiacSign> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
  Rahu: "Scorpio",
  Ketu: "Taurus",
  Ascendant: "Libra",
};

const PLANET_BENEFITS: Record<Planet, string[]> = {
  Sun: ["Leadership", "Authority", "Confidence", "Recognition", "Vitality"],
  Moon: ["Emotional stability", "Peace", "Intuition", "Mother connection", "Creativity"],
  Mars: ["Courage", "Physical strength", "Property drive", "Action power", "Protection"],
  Mercury: ["Intellect", "Communication", "Business", "Education", "Writing"],
  Jupiter: ["Wisdom", "Spirituality", "Prosperity", "Children blessings", "Grace"],
  Venus: ["Love", "Marriage harmony", "Art", "Luxury", "Creativity"],
  Saturn: ["Discipline", "Longevity", "Career endurance", "Karma clearance", "Structure"],
  Rahu: ["Innovation", "Foreign gains", "Research", "Technology", "Unconventional success"],
  Ketu: ["Spiritual insight", "Detachment", "Occult wisdom", "Intuition", "Moksha path"],
  Ascendant: [],
};

const PLANET_CAUTIONS: Record<Planet, string[]> = {
  Sun: ["Can increase ego if unsuitable.", "Avoid casual use if Sun is functionally harsh."],
  Moon: ["Can increase emotional sensitivity.", "Use gently if Moon is afflicted."],
  Mars: ["Can increase aggression.", "Avoid casual use if Mars is harsh for relationship houses."],
  Mercury: ["Can increase overthinking.", "Use carefully if Mercury connects with 8th-house pressure."],
  Jupiter: ["Can increase weight or over-expansion.", "Avoid if Jupiter is functionally difficult."],
  Venus: ["Can increase attachment or indulgence.", "Avoid if Venus is functional malefic."],
  Saturn: ["Test carefully before major use.", "Can intensify Saturn pressure if unsuitable."],
  Rahu: ["Very strong amplifier.", "Avoid without expert confirmation."],
  Ketu: ["Can increase detachment.", "Use only with clear spiritual purpose."],
  Ascendant: [],
};

const PLANET_RUDRAKSHA: Record<Exclude<Planet, "Ascendant">, { mukhi: string; bead: string; mantra: string }> = {
  Sun: { mukhi: "1 Mukhi", bead: "Eka Mukhi", mantra: "Om Hreem Namah" },
  Moon: { mukhi: "2 Mukhi", bead: "Do Mukhi", mantra: "Om Namah" },
  Mars: { mukhi: "3 Mukhi", bead: "Teen Mukhi", mantra: "Om Kleem Namah" },
  Mercury: { mukhi: "4 Mukhi", bead: "Char Mukhi", mantra: "Om Hreem Namah" },
  Jupiter: { mukhi: "5 Mukhi", bead: "Paanch Mukhi", mantra: "Om Hreem Namah" },
  Venus: { mukhi: "6 Mukhi", bead: "Chhah Mukhi", mantra: "Om Hreem Hum Namah" },
  Saturn: { mukhi: "7 Mukhi", bead: "Saat Mukhi", mantra: "Om Hum Namah" },
  Rahu: { mukhi: "8 Mukhi", bead: "Aath Mukhi", mantra: "Om Gneshaya Namaha" },
  Ketu: { mukhi: "9 Mukhi", bead: "Nau Mukhi", mantra: "Om Hreem Hoom Namaha" },
};

// Extended Rudraksha Mukhi data (1‑21) — comprehensive, PDF-verified
export const RUDRAKSHA_MUKHI: Record<number, RudrakshaData> = {
  1: {
    mukhi: 1,
    nameHindi: "एक मुखी",
    nameEnglish: "Eka Mukhi",
    rulingDeity: "Lord Shiva",
    rulingPlanet: "Sun",
    mantra: "Om Hreem Namaha",
    element: "Fire",
    spiritualBenefits: [
      "Spiritual growth & enlightenment",
      "Inner peace & calm",
      "Enhanced meditation & mindfulness",
      "Detachment from worldly affairs",
      "Feeling of contentment & happiness",
    ],
    healthBenefits: [
      "Lowers blood pressure",
      "Mental clarity & focus",
      "Emotional balance",
      "Stress reduction",
    ],
    materialBenefits: [
      "Health, Wealth & Happiness combined",
      "Fearlessness — no negative power or enmity can affect",
      "Power of concentration increases",
      "All sins destroyed",
    ],
    problemsSolved: [
      "Spiritual blockage",
      "Negative energies",
      "Lack of contentment",
      "Sin destruction",
      "Fear and anxiety",
    ],
    bestFor: ["Spiritual seekers", "Meditation practitioners", "Those seeking inner peace"],
    wearing: { metal: "Gold or Silver cap", day: "Monday", finger: "Ring finger", position: "Neck pendant" },
    rarity: "Extremely Rare",
  },
  2: {
    mukhi: 2,
    nameHindi: "दो मुखी",
    nameEnglish: "Do Mukhi",
    rulingDeity: "Lord Shiva & Goddess Parvati (Ardhanarishvara)",
    rulingPlanet: "Moon",
    mantra: "Om Namaha",
    element: "Water",
    spiritualBenefits: [
      "Unity & harmony",
      "Emotional balance",
      "Enhanced intuition & insight",
      "Protection from emotional turmoil",
    ],
    healthBenefits: [
      "Blood pressure regulation",
      "Stress & anxiety relief",
      "Emotional healing",
    ],
    materialBenefits: [
      "Harmonious relationships (Husband-Wife, Father-Son, Friends)",
      "Finding suitable match for marriage",
      "Happy family life",
      "Improved relationships with all people",
    ],
    problemsSolved: [
      "Relationship conflicts",
      "Emotional turmoil",
      "Loneliness",
      "Marital problems",
      "Difficulty finding life partner",
    ],
    bestFor: ["Couples", "Those with relationship issues", "People seeking emotional balance", "Those looking for marriage"],
    wearing: { metal: "Silver", day: "Monday", finger: "Ring finger", position: "Neck or Wrist" },
    rarity: "Uncommon",
  },
  3: {
    mukhi: 3,
    nameHindi: "तीन मुखी",
    nameEnglish: "Teen Mukhi",
    rulingDeity: "Lord Agni (Fire God) / Brahma-Vishnu-Shiva Trinity",
    rulingPlanet: "Mars",
    mantra: "Om Kleem Namaha",
    element: "Fire",
    spiritualBenefits: [
      "Destroys past life sins",
      "Spiritual purification",
      "Spiritual liberation",
      "Enhanced creativity & imagination",
    ],
    healthBenefits: [
      "Increases physical energy",
      "Removes laziness",
      "Boosts vitality",
    ],
    materialBenefits: [
      "Self-confidence boost",
      "Freedom from inferiority complex",
      "Personal transformation",
    ],
    problemsSolved: [
      "Inferiority complex",
      "Fear of unknown",
      "Self-hatred",
      "Mental stress",
      "Laziness and lethargy",
      "Past life karma burden",
    ],
    bestFor: ["Those with low confidence", "People suffering mental stress", "Anyone feeling stuck or lazy"],
    wearing: { metal: "Gold or Silver", day: "Tuesday", finger: "Ring finger", position: "Neck or Wrist" },
    rarity: "Common",
  },
  4: {
    mukhi: 4,
    nameHindi: "चार मुखी",
    nameEnglish: "Char Mukhi",
    rulingDeity: "Lord Brahma (Creator of Universe)",
    rulingPlanet: "Mercury",
    mantra: "Om Hreem Namaha",
    element: "Air",
    spiritualBenefits: [
      "Represents 4 Vedas (Rigveda, Yajurveda, Samaveda, Atharvaveda)",
      "Knowledge & wisdom",
      "Spiritual enlightenment",
    ],
    healthBenefits: [
      "Enhanced memory power",
      "Better concentration",
      "Mental clarity",
    ],
    materialBenefits: [
      "Improved communication skills",
      "Problem-solving abilities",
      "Better speech & oratory",
      "Academic excellence",
    ],
    problemsSolved: [
      "Poor memory",
      "Lack of concentration",
      "Communication difficulties",
      "Educational struggles",
      "Mental confusion",
    ],
    bestFor: ["Students", "Teachers", "Writers", "Speakers", "Anyone in learning or education"],
    wearing: { metal: "Gold", day: "Wednesday", finger: "Little finger", position: "Neck" },
    rarity: "Common",
  },
  5: {
    mukhi: 5,
    nameHindi: "पाँच मुखी",
    nameEnglish: "Panch Mukhi",
    rulingDeity: "Lord Kalagni (form of Lord Shiva)",
    rulingPlanet: "Jupiter",
    mantra: "Om Hreem Namaha",
    element: "Ether",
    spiritualBenefits: [
      "Destroys bad karma of present life",
      "Meditation & Saadhna support",
      "Dev Guru Rudraksha status",
      "Name & Fame",
    ],
    healthBenefits: [
      "Blood pressure regulation",
      "Heart health improvement",
      "Overall wellbeing",
      "Protection from accidental death",
    ],
    materialBenefits: [
      "Name, Fame & Mental Peace",
      "Purification of present life karma",
      "Universally safe for everyone",
    ],
    problemsSolved: [
      "Bad karma of present life",
      "Lack of mental peace",
      "Fear of accidental death",
      "Spiritual practice difficulties",
      "General negativity",
    ],
    bestFor: ["Everyone (universally safe)", "Spiritual practitioners", "Meditation beginners", "First-time Rudraksha wearers"],
    wearing: { metal: "Any metal", day: "Thursday", finger: "Index finger", position: "Neck (mala of 108)" },
    rarity: "Common",
  },
  6: {
    mukhi: 6,
    nameHindi: "छ: मुखी",
    nameEnglish: "Chhah Mukhi",
    rulingDeity: "Lord Kartikeya (Son of Lord Shiva)",
    rulingPlanet: "Venus",
    mantra: "Om Hreem Hoom Namah",
    element: "Water",
    spiritualBenefits: [
      "Blessed by Goddess Parvati, Lakshmi & Saraswati",
      "Courage & wisdom",
      "Spiritual liberation",
    ],
    healthBenefits: [
      "Good health",
      "Enhanced willpower",
      "Self-confidence & motivation",
    ],
    materialBenefits: [
      "Health, Wealth & Happiness",
      "All luxuries, pleasures & comforts of life",
      "Improved power of expression & speech",
    ],
    problemsSolved: [
      "Lack of courage",
      "Weak willpower",
      "Poor expression or speech skills",
      "Lack of luxury & comfort",
      "Venus affliction in horoscope",
    ],
    bestFor: ["Leaders", "Actors", "Public speakers", "Those needing courage", "Venus-afflicted individuals"],
    wearing: { metal: "Silver or Gold", day: "Friday", finger: "Ring finger", position: "Neck or Wrist" },
    rarity: "Common",
  },
  7: {
    mukhi: 7,
    nameHindi: "सात मुखी",
    nameEnglish: "Saat Mukhi",
    rulingDeity: "Goddess Maha Lakshmi + Saptarshi (Seven Sages)",
    rulingPlanet: "Saturn",
    mantra: "Om Hoom Namaha",
    element: "Earth",
    spiritualBenefits: [
      "Blessings of 7 divine snakes (Nag protection)",
      "Spiritual growth & introspection",
      "Protection from karmic debts",
    ],
    healthBenefits: [
      "Protection from poisoning of any kind",
      "Good health via Saptarshi blessings",
    ],
    materialBenefits: [
      "Wealth & prosperity",
      "Business success & increased profits",
      "Block funds recovery",
      "Job promotion & career growth",
      "Good luck, Name & Fame",
    ],
    problemsSolved: [
      "Saturn Sade Sati affliction",
      "Saturn malefic effects (Small Panoti)",
      "Financial blocks & stuck money",
      "Business obstacles",
      "Career stagnation",
      "Lack of wealth",
    ],
    bestFor: ["Businessmen", "Job seekers", "Those under Sade Sati", "People wanting wealth & promotion"],
    wearing: { metal: "Silver", day: "Saturday", finger: "Middle finger", position: "Neck or Ring" },
    rarity: "Uncommon",
  },
  8: {
    mukhi: 8,
    nameHindi: "आठ मुखी",
    nameEnglish: "Aath Mukhi",
    rulingDeity: "Lord Ganesha (Vighna Harta — Remover of Obstacles)",
    rulingPlanet: "Rahu",
    mantra: "Om Gneshaya Namaha",
    element: "Air",
    spiritualBenefits: [
      "Stability of mind",
      "Inner peace & calm",
      "Spiritual growth & self-awareness",
    ],
    healthBenefits: [
      "Mental stability & calm mind",
      "Improved focus",
    ],
    materialBenefits: [
      "Success in every venture",
      "Obstacle removal in all endeavors",
      "Name, Fame & Leadership qualities",
    ],
    problemsSolved: [
      "Constant obstacles in life",
      "Rahu dosha / Rahu affliction",
      "Lack of mental stability",
      "Career obstacles",
      "Repeated failures",
    ],
    bestFor: ["Those facing constant obstacles", "Rahu-affected individuals", "Aspiring leaders", "New business starters"],
    wearing: { metal: "Gold", day: "Wednesday", finger: "Middle finger", position: "Neck or Wrist" },
    rarity: "Uncommon",
  },
  9: {
    mukhi: 9,
    nameHindi: "नौ मुखी",
    nameEnglish: "Nau Mukhi",
    rulingDeity: "Goddess Maha Durga (all 9 forms) + Lord Kaal Bhairav + Yamraj",
    rulingPlanet: "Ketu",
    mantra: "Om Hreem Hoom Namaha",
    element: "Fire",
    spiritualBenefits: [
      "Blessings equal to 9-day Navratri fast",
      "Fearlessness & divine courage",
      "Protection from all 9 planets' malefic effects",
      "Blessed by Lord Kaal Bhairav & Yamraj",
    ],
    healthBenefits: [
      "Energy & dynamism boost",
      "Better self-confidence",
      "Enhanced physical power",
    ],
    materialBenefits: [
      "Success, Name & Fame",
      "Power & dynamism",
      "Fearless personality",
    ],
    problemsSolved: [
      "Fear of death",
      "Lack of courage",
      "Ketu dosha / Ketu affliction",
      "All 9 planet malefic effects",
      "Fearfulness & cowardice",
      "Lack of energy",
    ],
    bestFor: ["Those needing courage", "Ketu-affected individuals", "People fearing death or unknown", "Those lacking energy"],
    wearing: { metal: "Gold or Silver", day: "Tuesday", finger: "Ring finger", position: "Neck" },
    rarity: "Rare",
  },
  10: {
    mukhi: 10,
    nameHindi: "दस मुखी",
    nameEnglish: "Das Mukhi",
    rulingDeity: "Lord Vishnu (Preserver) + Das Maha Vidya (10 incarnations)",
    rulingPlanet: "None (pacifies all 9 planets)",
    mantra: "Om Hreem Namaha",
    element: "Ether",
    spiritualBenefits: [
      "Divine protection & preservation",
      "Universal consciousness",
      "Protection from Gods of all 10 directions",
      "Sins of 10 human organs destroyed",
    ],
    healthBenefits: [
      "Protection from untimely death",
      "Blessed by Yamraj — saved from premature death",
    ],
    materialBenefits: [
      "Family protection",
      "Vastu dosh removal",
      "Protection from black magic & evil eye",
    ],
    problemsSolved: [
      "Black magic (Kala Jadoo)",
      "Evil eye (Nazar)",
      "Vastu faults / Vastu dosh",
      "All 9 planet issues",
      "Fear of untimely death",
      "Evil spirits & negative entities",
    ],
    bestFor: ["Those affected by black magic or evil eye", "Vastu correction needs", "Family protection", "Those fearing untimely death"],
    wearing: { metal: "Gold", day: "Any day", finger: "Index finger", position: "Neck" },
    rarity: "Rare",
  },
  11: {
    mukhi: 11,
    nameHindi: "ग्यारह मुखी",
    nameEnglish: "Gyarah Mukhi",
    rulingDeity: "11th Rudra (Lord Hanuman) + Lord Indra",
    rulingPlanet: "None",
    mantra: "Om Hreem Hoom Namaha",
    element: "Air",
    spiritualBenefits: [
      "Right actions & courageous decisions",
      "Enhanced psychic abilities & intuition",
      "Unfulfilled good deed wishes count as completed",
    ],
    healthBenefits: [
      "Enhanced vitality & stamina",
      "Improved courage-related hormonal balance",
    ],
    materialBenefits: [
      "All fortunes & luxuries of life (Indra's blessings)",
      "Adventure & bravery support",
    ],
    problemsSolved: [
      "Lack of courage & bravery",
      "Cowardice",
      "Inability to do good deeds",
      "Lack of fortune & luxury",
      "Fear of taking action",
    ],
    bestFor: ["Adventurers", "Those needing courage", "People wanting blessings of Indra", "Military/police/security"],
    wearing: { metal: "Gold", day: "Thursday", finger: "Index finger", position: "Neck" },
    rarity: "Rare",
  },
  12: {
    mukhi: 12,
    nameHindi: "बारह मुखी",
    nameEnglish: "Barah Mukhi",
    rulingDeity: "Lord Surya (Sun God) + 12 Adityas",
    rulingPlanet: "Sun",
    mantra: "Om Kraum Sraum Raum Namaha",
    element: "Fire",
    spiritualBenefits: [
      "Powerful aura creation around the wearer",
      "Brilliance, Luster, Radiance & Strength of Lord Sun",
    ],
    healthBenefits: [
      "Protection from diseases",
      "Protection from wild animals & armed people",
    ],
    materialBenefits: [
      "Administrative capacity enhancement",
      "Name, Fame, Wealth & Power",
      "Leadership & authority",
    ],
    problemsSolved: [
      "Weak Sun in horoscope",
      "Lack of authority & leadership",
      "Administrative weakness",
      "Fear of armed people or wild animals",
      "Diseases & worries",
    ],
    bestFor: ["Administrators", "Businessmen", "Politicians", "Leaders", "Leo ascendant individuals"],
    wearing: { metal: "Gold", day: "Sunday", finger: "Ring finger", position: "Neck" },
    rarity: "Rare",
  },
  13: {
    mukhi: 13,
    nameHindi: "तेरह मुखी",
    nameEnglish: "Terah Mukhi",
    rulingDeity: "Lord Kamadeva + Lord Indra (King of Gods)",
    rulingPlanet: "Venus",
    mantra: "Om Hreem Namaha",
    element: "Water",
    spiritualBenefits: [
      "Perfection in alchemy & research",
      "Blessings of all Gods via Lord Indra",
    ],
    healthBenefits: [
      "Enhanced vitality & passion",
      "Improved physical attraction & charisma",
    ],
    materialBenefits: [
      "Immense wealth",
      "Position of authority",
      "All luxuries of life",
      "Charisma — liked by everyone who interacts",
      "Great heights of success",
    ],
    problemsSolved: [
      "Lack of wealth",
      "Lack of authority or respect",
      "Poor oratory & debating skills",
      "Research blocks",
      "Lack of personal charm",
    ],
    bestFor: ["Researchers", "Orators & debaters", "Those seeking wealth & authority", "Scientists & alchemists"],
    wearing: { metal: "Gold", day: "Friday", finger: "Ring finger", position: "Neck" },
    rarity: "Very Rare",
  },
  14: {
    mukhi: 14,
    nameHindi: "चौदह मुखी",
    nameEnglish: "Chaudah Mukhi",
    rulingDeity: "Lord Shiva (Dev Mani — Divine Gem, represents 14 Lokas)",
    rulingPlanet: "Saturn",
    mantra: "Om Namaha",
    element: "Ether",
    spiritualBenefits: [
      "Ajna Chakra (Third Eye) activation",
      "Future visualization ability",
      "Shiva & Shakti blessings combined",
      "Quick results (hence named Dev Mani)",
    ],
    healthBenefits: [
      "Third eye activation enhances intuition",
      "Enhanced spiritual perception",
    ],
    materialBenefits: [
      "Correct decision-making ability",
      "Better present & brighter future",
      "Protection from all enemies",
    ],
    problemsSolved: [
      "Negative energies & enemies",
      "Poor decision-making",
      "Saturn affliction",
      "Inability to foresee consequences",
      "Negativity from all sides",
    ],
    bestFor: ["Decision-makers & CEOs", "Those needing enemy protection", "Advanced spiritual practitioners", "Saturn-afflicted individuals"],
    wearing: { metal: "Gold", day: "Saturday", finger: "Middle finger", position: "Neck" },
    rarity: "Very Rare",
  },
  15: {
    mukhi: 15,
    nameHindi: "पंद्रह मुखी",
    nameEnglish: "Pandrah Mukhi",
    rulingDeity: "Lord Pashupati",
    rulingPlanet: "Rahu",
    mantra: "Om Shreem Manovaanchiatam Hreem Om Namah",
    element: "Air",
    spiritualBenefits: [
      "Path to salvation (moksha)",
      "Freedom from negative soul shades",
      "Abstract & lateral thinking enhancement",
    ],
    healthBenefits: [
      "Mental balance",
      "Emotional disturbance pacification",
      "High energy levels",
    ],
    materialBenefits: [
      "Improved intuitions & foresight",
      "Higher consciousness in daily life",
    ],
    problemsSolved: [
      "Emotional disturbance",
      "Mental imbalance",
      "Low energy & lethargy",
      "Rahu affliction / Rahu dosha",
      "Negative shades on soul",
    ],
    bestFor: ["Spiritual seekers on path of moksha", "Those with Rahu issues", "People needing mental balance"],
    wearing: { metal: "Gold or Silver cap, Red thread", day: "Saturday", finger: "Middle finger", position: "Neck (touch to Shiva Linga before wearing)" },
    rarity: "Very Rare",
  },
  16: {
    mukhi: 16,
    nameHindi: "सोलह मुखी (महामृत्युंजय रुद्राक्ष)",
    nameEnglish: "Solah Mukhi (Mahamrityunjaya Rudraksha)",
    rulingDeity: "Lord Mahakal (fierce form of Shiva) + Lord Ram",
    rulingPlanet: "Ketu",
    mantra: "Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Mamritat",
    element: "Fire",
    spiritualBenefits: [
      "Freedom from fear of Kaal (Death)",
      "Victory over most fearsome diseases",
      "Punya (merit) of 7 births",
      "Life on the path of Satya (Truth)",
    ],
    healthBenefits: [
      "Tuberculosis support",
      "Leprosy support",
      "Lung diseases support",
      "General disease protection",
    ],
    materialBenefits: [
      "Home protection from theft, fire & accidents",
      "Navgrah Dosh removal",
      "Also called Jai Rudraksha — full of great human virtues",
    ],
    problemsSolved: [
      "Fear of death",
      "Fear of losing loved ones",
      "Fear of loss of name & fame",
      "Fear of loss of faith in oneself",
      "Navgrah Dosh",
      "Serious lung/skin diseases",
    ],
    bestFor: ["Those with serious health issues", "People fearing death", "Ketu-affected individuals", "Home protection"],
    wearing: { metal: "Gold", day: "Tuesday", finger: "Ring finger", position: "Neck (also keep at home for protection)" },
    rarity: "Extremely Rare",
  },
  17: {
    mukhi: 17,
    nameHindi: "सत्रह मुखी",
    nameEnglish: "Satrah Mukhi",
    rulingDeity: "Devi Katyayani (6th form of Maa Durga) + Lord Vishwakarma",
    rulingPlanet: "None (nullifies negative Saturn effects)",
    mantra: "Om Hreeng Hoong Hoong Namaha",
    element: "Earth",
    spiritualBenefits: [
      "Soul enlightenment",
      "Connection with Devi energy",
      "All 4 Purusharthas: Dharma, Artha, Kama & Moksha",
    ],
    healthBenefits: [
      "Removes laziness & lethargic attitude",
      "Increases memory & intelligence",
    ],
    materialBenefits: [
      "Sudden wealth (share market rise, property appreciation, inheritance, lottery)",
      "Progeny blessing (children)",
      "Good luck & prosperity",
      "Power of manifestation & achievement",
    ],
    problemsSolved: [
      "Shani Sade Sati obstacles",
      "Laziness & lethargy",
      "Poor memory",
      "Lack of manifestation power",
      "Financial blocks",
      "Childlessness",
    ],
    bestFor: ["Investors & traders", "Those under Sade Sati", "People seeking sudden wealth", "Those wanting children (progeny)"],
    wearing: { metal: "Gold", day: "Saturday", finger: "Middle finger", position: "Neck" },
    rarity: "Extremely Rare",
  },
  18: {
    mukhi: 18,
    nameHindi: "अठारह मुखी",
    nameEnglish: "Atharah Mukhi",
    rulingDeity: "Goddess Earth (Bhumi Devi) + Lord Bhairava",
    rulingPlanet: "Earth",
    mantra: "AUM HREEM HOOM EKATATVA RUPE HOOM HREEM AUM",
    element: "Earth",
    spiritualBenefits: [
      "Great patience & tolerance",
      "Spiritual wisdom & inner strength",
    ],
    healthBenefits: [
      "Prevention of child abortion / miscarriage",
      "Pregnancy complications support",
    ],
    materialBenefits: [
      "Success in major projects",
      "Business expansion success",
      "Real estate business prosperity",
      "Manufacturing business growth",
    ],
    problemsSolved: [
      "Project failures",
      "Business stagnation",
      "Miscarriage / repeated abortion issues",
      "Impatience & intolerance",
      "Real estate problems",
    ],
    bestFor: ["Entrepreneurs", "Real estate professionals", "Manufacturing businesses", "Women with pregnancy complications"],
    wearing: { metal: "Gold", day: "Thursday", finger: "Index finger", position: "Neck" },
    rarity: "Extremely Rare",
  },
  19: {
    mukhi: 19,
    nameHindi: "उन्नीस मुखी",
    nameEnglish: "Unnis Mukhi",
    rulingDeity: "Lord Narayana + Goddess Lakshmi + Trinity Gods (Brahma, Vishnu, Mahesh)",
    rulingPlanet: "Mercury",
    mantra: "Om Vam Vishnave Sheershayane Swaha",
    element: "Water",
    spiritualBenefits: [
      "Blessed by Trinity (Brahma, Vishnu, Mahesh)",
      "No detraction in life",
      "Complete spiritual protection",
    ],
    healthBenefits: [
      "Diabetes control support",
      "Sexual disorders treatment support",
      "Blood pressure management",
      "Spinal problems relief",
      "Blood-related diseases support",
    ],
    materialBenefits: [
      "Economic prosperity",
      "High position in work field",
      "Pride & honor in society",
      "Wife, child & wealth blessings",
    ],
    problemsSolved: [
      "Financial difficulties",
      "Career stagnation & low position",
      "Diabetes",
      "Sexual health issues",
      "Spinal & blood problems",
      "Lack of social respect",
    ],
    bestFor: ["Career-focused individuals", "Those with chronic health issues (diabetes, BP)", "People seeking economic prosperity"],
    wearing: { metal: "Gold", day: "Wednesday", finger: "Little finger", position: "Neck" },
    rarity: "Extremely Rare",
  },
  20: {
    mukhi: 20,
    nameHindi: "बीस मुखी",
    nameEnglish: "Bees Mukhi",
    rulingDeity: "Lord Brahma (Creator of Universe)",
    rulingPlanet: "All Nine Planets",
    mantra: "Om Hreem Hreem Hum Hum Brahmane Namah",
    element: "Ether",
    spiritualBenefits: [
      "Powers of Trinity + 9 Planets + 8 Dikpals converged",
      "Brahma Swarupa (embodiment of Brahma)",
      "Supreme spiritual consciousness",
    ],
    healthBenefits: [
      "Complete all-round health protection",
      "Protection via combined planetary energies",
    ],
    materialBenefits: [
      "Power to achieve almost anything desired",
      "Destiny rewriting ability",
      "Combined blessings of all divine entities",
    ],
    problemsSolved: [
      "All planetary doshas simultaneously",
      "All directional doshas (Dik-dosh)",
      "Overall life obstacles of every kind",
      "Unfulfilled desires",
    ],
    bestFor: ["Those seeking all-round protection", "Advanced spiritual practitioners", "People wanting supreme achievement"],
    wearing: { metal: "Gold", day: "Any auspicious day", finger: "Index finger", position: "Neck" },
    rarity: "Extremely Rare",
  },
  21: {
    mukhi: 21,
    nameHindi: "इक्कीस मुखी (कुबेर रुद्राक्ष)",
    nameEnglish: "Ikkees Mukhi (Kuber Rudraksha)",
    rulingDeity: "Lord Kuber (God of Wealth)",
    rulingPlanet: "All",
    mantra: "Om Yakshaya Kuberya Vaishravanaya Dhana-Dhanyadi",
    element: "Earth",
    spiritualBenefits: [
      "Third eye chakra opening",
      "6th sense & clairvoyance abilities",
      "Spiritual growth & enlightenment",
      "Benefits of ALL 1-21 Mukhi combined",
    ],
    healthBenefits: [
      "Great health protection",
      "All-encompassing healing energy",
    ],
    materialBenefits: [
      "Great wealth (Kuber's blessings)",
      "All benefits of 1-21 Mukhi combined in one",
      "Supreme material prosperity",
    ],
    problemsSolved: [
      "Wealth problems & poverty",
      "Lack of intuition & 6th sense",
      "Spiritual blocks of all kinds",
      "Any life problem (covers all Mukhi benefits)",
    ],
    bestFor: ["Wealth seekers", "Spiritual masters", "Those wanting all-round blessings", "Collectors of rare spiritual items"],
    wearing: { metal: "Gold", day: "Any auspicious day", finger: "Index finger", position: "Neck" },
    rarity: "Extremely Rare",
  },
};



function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

type Dict = Record<string, unknown>;

function safeNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asDict(value: unknown): Dict {
  return value && typeof value === "object" ? (value as Dict) : {};
}

function normalizeSign(value: unknown): ZodiacSign {
  if (typeof value === "string") {
    const clean = value.trim().toLowerCase();
    const aliases: Record<string, ZodiacSign> = {
      aries: "Aries", mesh: "Aries",
      taurus: "Taurus", vrishabh: "Taurus",
      gemini: "Gemini", mithun: "Gemini",
      cancer: "Cancer", kark: "Cancer",
      leo: "Leo", simha: "Leo",
      virgo: "Virgo", kanya: "Virgo",
      libra: "Libra", tula: "Libra",
      scorpio: "Scorpio", vrishchik: "Scorpio",
      sagittarius: "Sagittarius", dhanu: "Sagittarius",
      capricorn: "Capricorn", makar: "Capricorn",
      aquarius: "Aquarius", kumbh: "Aquarius",
      pisces: "Pisces", meen: "Pisces",
    };
    if (aliases[clean]) return aliases[clean];
    const numeric = Number(clean);
    if (Number.isFinite(numeric)) return normalizeSign(numeric);
  }

  const n = safeNumber(value, 0);
  if (n >= 0 && n <= 11) return SIGNS[Math.round(n)] ?? "Aries";
  if (n >= 1 && n <= 12) return SIGNS[Math.round(n - 1)] ?? "Aries";
  return SIGNS[Math.floor(mod(n, 360) / 30)] ?? "Aries";
}

function signIndex(sign: ZodiacSign) {
  return SIGNS.indexOf(sign);
}

function houseFromLagna(lagna: ZodiacSign, sign: ZodiacSign) {
  return mod(signIndex(sign) - signIndex(lagna), 12) + 1;
}

function getDignity(planet: Planet, sign: ZodiacSign): PlanetPosition["dignity"] {
  if (EXALTATION[planet] === sign) return "exalted";
  if (DEBILITATION[planet] === sign) return "debilitated";
  if (SIGN_RULERS[sign] === planet) return "own";
  return "neutral";
}

function readRecordValue(value: unknown, key: string): unknown {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

// ─── Chart parsing ────────────────────────────────────────────────────────────

function getRoot(input: unknown): Dict {
  const root = asDict(input);
  const chart = asDict(root.chart);
  return asDict(chart.chart ?? root.chart ?? root.rawChart ?? root);
}

function getPlanetObject(source: unknown, planetName: string) {
  const root = getRoot(source);
  const sourceObj = asDict(source);
  const sourceChart = asDict(sourceObj.chart);
  const lower = planetName.toLowerCase();

  const containers = [
    root?.planets,
    root?.grahas,
    root?.planetData,
    root?.positions,
    root?.planetaryPositions,
    sourceObj?.planets,
    sourceChart?.planets,
  ];

  for (const container of containers) {
    if (!container) continue;

    if (Array.isArray(container)) {
      const found = container.find((item) => {
        const obj = asDict(item);
        const name = String(obj.planet ?? obj.name ?? obj.graha ?? obj.id ?? "").toLowerCase();
        return name === lower;
      });
      if (found) return found;
    }

    if (typeof container === "object") {
      const map = container as Dict;
      const found = map?.[planetName] ?? map?.[lower] ?? map?.[planetName.toUpperCase()];
      if (found) return found;
    }
  }

  return null;
}

function getAscendantObject(source: unknown) {
  const root = getRoot(source);
  return (
    getPlanetObject(source, "Ascendant") ??
    getPlanetObject(source, "Lagna") ??
    root?.ascendant ??
    root?.lagna ??
    root?.asc ??
    {}
  );
}

function getPlanetSign(source: unknown, planetName: string): ZodiacSign {
  const planet = asDict(
    planetName === "Ascendant" ? getAscendantObject(source) : getPlanetObject(source, planetName)
  );
  return normalizeSign(
    planet?.signName ??
      planet?.rashiName ??
      planet?.zodiacSign ??
      planet?.sign ??
      planet?.rashi ??
      planet?.signIndex ??
      planet?.rashiIndex ??
      planet?.longitude ??
      planet?.lon ??
      planet?.degree
  );
}

function getPlanetDegree(source: unknown, planetName: string) {
  const planet = asDict(
    planetName === "Ascendant" ? getAscendantObject(source) : getPlanetObject(source, planetName)
  );

  const absolute =
    planet?.absoluteDegree ??
    planet?.absoluteDegrees ??
    planet?.fullDegree ??
    planet?.longitude ??
    planet?.lon ??
    planet?.lng;

  if (absolute !== undefined && absolute !== null) {
    return mod(safeNumber(absolute, 0), 30);
  }

  return safeNumber(
    planet?.degreeInSign ??
      planet?.signDegree ??
      planet?.degreesInSign ??
      planet?.rashiDegree ??
      planet?.degree ??
      planet?.degrees,
    0
  );
}

function getPlanetHouse(source: unknown, planetName: string, lagna: ZodiacSign, sign: ZodiacSign) {
  const planet = asDict(
    planetName === "Ascendant" ? getAscendantObject(source) : getPlanetObject(source, planetName)
  );
  const house = safeNumber(planet?.house ?? planet?.bhava ?? planet?.houseNumber, 0);
  if (house >= 1 && house <= 12) return Math.round(house);
  return houseFromLagna(lagna, sign);
}

export function buildNatalChartFromAnyChart(input: unknown): NatalChart {
  const root = getRoot(input);
  const asc = asDict(getAscendantObject(root));

  const ascendant = normalizeSign(
    asc?.signName ??
      asc?.rashiName ??
      asc?.zodiacSign ??
      asc?.sign ??
      asc?.rashi ??
      root?.lagnaSign ??
      root?.lagnaRashi ??
      root?.ascendantSign ??
      root?.ascendantRashi ??
      root?.lagR
  );

  const ascendantDegree = getPlanetDegree(root, "Ascendant");

  const planets: PlanetPosition[] = (
    ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as Planet[]
  ).map((planet) => {
    const obj = asDict(getPlanetObject(root, planet));
    const sign = getPlanetSign(root, planet);

    return {
      planet,
      sign,
      degree: getPlanetDegree(root, planet),
      house: getPlanetHouse(root, planet, ascendant, sign),
      isRetrograde: Boolean(obj?.retrograde ?? obj?.isRetrograde ?? obj?.R),
      nakshatra:
        typeof (obj?.nakshatra ?? obj?.nak) === "string"
          ? String(obj?.nakshatra ?? obj?.nak)
          : undefined,
      nakshatraPada: safeNumber(obj?.pada ?? obj?.nakshatraPada, 0) || undefined,
      dignity: getDignity(planet, sign),
    };
  });

  return {
    ascendant,
    ascendantDegree,
    planets,
    lagnaLord: SIGN_RULERS[ascendant],
  };
}

export function buildNatalChartFromLagR(lagRData: unknown): NatalChart {
  return buildNatalChartFromAnyChart(lagRData);
}

// ─── Strength scoring ─────────────────────────────────────────────────────────

function getPlanetStrengthScore(pos: PlanetPosition, lagna: ZodiacSign): number {
  let score = 45;

  const dignity = pos.dignity ?? getDignity(pos.planet, pos.sign);

  if (dignity === "exalted") score += 20;
  else if (dignity === "own") score += 14;
  else if (dignity === "debilitated") score -= 22;

  if (pos.isRetrograde) score -= 6;
  if ([1, 4, 7, 10].includes(pos.house)) score += 10;
  if ([5, 9].includes(pos.house)) score += 14;
  if ([6, 8, 12].includes(pos.house)) score -= 12;

  if (LAGNA_BENEFICS[lagna]?.includes(pos.planet)) score += 10;
  if (LAGNA_MALEFICS[lagna]?.includes(pos.planet)) score -= 14;

  return Math.max(18, Math.min(84, Math.round(score)));
}

function getMaleficEffect(planet: Planet): string {
  const effects: Partial<Record<Planet, string>> = {
    Saturn: "delay, pressure, heaviness or nervous system stress",
    Mars: "aggression, conflict, accident-prone behaviour or blood pressure",
    Sun: "ego clashes, authority conflict or heat",
    Mercury: "overthinking, anxiety or business confusion",
    Venus: "overindulgence, relationship attachment or expense",
    Jupiter: "overexpansion, false confidence or weight gain",
    Rahu: "confusion, obsession or sudden volatility",
    Ketu: "detachment, isolation or sudden breaks",
  };
  return effects[planet] ?? "unfavourable results";
}

// ─── Dasha reading ────────────────────────────────────────────────────────────

function normalizeGemstoneDashaName(value: unknown): string {
  const raw =
    typeof value === "string"
      ? value
      : String(
          readRecordValue(value, "planet") ??
            readRecordValue(value, "name") ??
            readRecordValue(value, "lord") ??
            readRecordValue(value, "graha") ??
            ""
        );

  const clean = raw.trim().toLowerCase();

  const aliases: Record<string, string> = {
    sun: "Sun", surya: "Sun", ravi: "Sun",
    moon: "Moon", chandra: "Moon", soma: "Moon",
    mars: "Mars", mangal: "Mars", kuja: "Mars",
    mercury: "Mercury", budh: "Mercury",
    jupiter: "Jupiter", guru: "Jupiter", brihaspati: "Jupiter",
    venus: "Venus", shukra: "Venus",
    saturn: "Saturn", shani: "Saturn",
    rahu: "Rahu",
    ketu: "Ketu",
  };

  return aliases[clean] ?? raw.trim();
}

function readGemstoneDasha(input: unknown): string {
  const root = getRoot(input);
  const inputObj = asDict(input);

  // ── Primary: ChartData.dashas / ChartData.antardasha arrays (native format) ──
  // chart.dashas is DashaEntry[] with { planet, active? } — find the active mahadasha
  // chart.antardasha is DashaEntry[] — first entry is the active antardasha
  const dashasArr = inputObj?.dashas ?? root?.dashas;
  const antarArr  = inputObj?.antardasha ?? root?.antardasha;

  if (Array.isArray(dashasArr) && dashasArr.length) {
    const activeMD  = dashasArr.find((d) => asDict(d)?.active) ?? dashasArr[0];
    const mdPlanet  = normalizeGemstoneDashaName(asDict(activeMD)?.planet);

    let adPlanet = "";
    if (Array.isArray(antarArr) && antarArr.length) {
      const activeAD = antarArr.find((d) => asDict(d)?.active) ?? antarArr[0];
      adPlanet = normalizeGemstoneDashaName(asDict(activeAD)?.planet);
    }

    const path = [mdPlanet, adPlanet].filter(Boolean).join(" > ");
    if (path) return path;
  }

  // ── Fallback: various field-name conventions from other chart formats ──
  const candidates = [
    readRecordValue(input, "currentDasha"),
    readRecordValue(input, "dasha"),
    readRecordValue(input, "vimshottari"),
    readRecordValue(input, "vimshottariDasha"),
    readRecordValue(input, "dashaInfo"),
    readRecordValue(input, "activeDasha"),
    root?.currentDasha,
    root?.dasha,
    root?.vimshottari,
    root?.vimshottariDasha,
    root?.dashaInfo,
    root?.activeDasha,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      return candidate.trim();
    }

    const md = normalizeGemstoneDashaName(
      readRecordValue(candidate, "mahadasha") ??
        readRecordValue(candidate, "mahaDasha") ??
        readRecordValue(candidate, "md") ??
        readRecordValue(candidate, "currentMD") ??
        readRecordValue(candidate, "major") ??
        readRecordValue(candidate, "majorLord")
    );

    const ad = normalizeGemstoneDashaName(
      readRecordValue(candidate, "antardasha") ??
        readRecordValue(candidate, "antarDasha") ??
        readRecordValue(candidate, "ad") ??
        readRecordValue(candidate, "currentAD") ??
        readRecordValue(candidate, "sub") ??
        readRecordValue(candidate, "subLord")
    );

    const pd = normalizeGemstoneDashaName(
      readRecordValue(candidate, "pratyantardasha") ??
        readRecordValue(candidate, "pratyantarDasha") ??
        readRecordValue(candidate, "pd") ??
        readRecordValue(candidate, "currentPD")
    );

    const path =
      readRecordValue(candidate, "dashaPath") ??
      readRecordValue(candidate, "path") ??
      readRecordValue(candidate, "label") ??
      [md, ad, pd].filter(Boolean).join(" > ");

    if (path) return String(path);
  }

  const directPathValue =
    root?.dashaPath ??
    root?.currentDashaPath ??
    [root?.currentMD, root?.currentAD, root?.currentPD]
      .map(normalizeGemstoneDashaName)
      .filter(Boolean)
      .join(" > ");

  const directPath =
    typeof directPathValue === "string"
      ? directPathValue
      : normalizeGemstoneDashaName(directPathValue);

  return directPath || "Not connected";
}

// ─── Core report generation ───────────────────────────────────────────────────

export function generateGemstoneReport(chart: NatalChart, rawInput?: unknown): GemstoneReport {
  const lagna = chart.ascendant;
  const lagnaLord = SIGN_RULERS[lagna];
  const benefics = LAGNA_BENEFICS[lagna] ?? [];
  const malefics = LAGNA_MALEFICS[lagna] ?? [];
  const analysisNotes: string[] = [];

  const scoredPlanets = benefics
    .filter((planet) => planet !== "Ascendant")
    .map((planet) => {
      const pos = chart.planets.find((item) => item.planet === planet) ?? null;
      const score = pos ? getPlanetStrengthScore(pos, lagna) : 28;
      return { planet, score, pos };
    })
    .sort((a, b) => b.score - a.score);

  if (!scoredPlanets.length) {
    const fallbackPlanet: Exclude<Planet, "Ascendant"> =
      lagnaLord === "Ascendant" ? "Sun" : lagnaLord;
    scoredPlanets.push({ planet: fallbackPlanet, score: 50, pos: null });
  }

  const buildRecommendation = (
    sp: (typeof scoredPlanets)[number],
    strength: GemstoneRecommendation["strength"]
  ): GemstoneRecommendation => {
    const meta = PLANET_GEMSTONES[sp.planet];
    const wearing = PLANET_WEARING[sp.planet];
    const dignity = sp.pos ? getDignity(sp.planet, sp.pos.sign) : "neutral";

    let reason = `${sp.planet} is functionally supportive for ${lagna} lagna.`;

    if (dignity === "exalted") {
      reason += ` It is exalted in ${sp.pos?.sign}, expressing its highest potential.`;
    } else if (dignity === "own") {
      reason += ` It occupies its own sign ${sp.pos?.sign}, lending natural and stable strength.`;
    } else if (dignity === "debilitated") {
      reason += ` It is debilitated — use only after proper confirmation and a careful testing period.`;
    }

    if (sp.pos && [1, 4, 5, 7, 9, 10].includes(sp.pos.house)) {
      reason += ` It is placed in favourable house ${sp.pos.house}.`;
    } else if (sp.pos && [6, 8, 12].includes(sp.pos.house)) {
      reason += ` Note: placed in sensitive house ${sp.pos.house} — start gently with alternatives before full gemstone.`;
    }

    if (sp.pos?.isRetrograde) {
      reason += ` Planet is retrograde — gemstone effects may be more internalised or slow to manifest.`;
    }

    return {
      gemstone: meta.primary,
      alternateGemstone: meta.alternate,
      planet: sp.planet,
      reason,
      benefits: PLANET_BENEFITS[sp.planet],
      cautions: PLANET_CAUTIONS[sp.planet],
      wearing,
      strength,
      score: Math.max(18, Math.min(84, sp.score)),
      color: meta.color,
      hexColor: meta.hex,
      chakra: meta.chakra,
      element: meta.element,
    };
  };

  const primaryGemstone = buildRecommendation(scoredPlanets[0], "Primary");
  const secondaryGemstones = scoredPlanets
    .slice(1, 3)
    .map((item, index) => buildRecommendation(item, index === 0 ? "Secondary" : "Tertiary"));

  const avoidGemstones: AvoidGemstone[] = malefics
    .filter((planet) => planet !== "Ascendant")
    .map((planet) => ({
      gemstone: PLANET_GEMSTONES[planet].primary,
      planet,
      reason: `${planet} is functionally sensitive for ${lagna} lagna. Wearing its gemstone without expert guidance may amplify ${getMaleficEffect(planet)}.`,
    }));

  // Functional Debility Engine Integration: Check all planets for debility superpowers
  for (const pos of chart.planets) {
    if (pos.dignity === "debilitated" || getDignity(pos.planet, pos.sign) === "debilitated") {
      const debilityAudit = evaluateFunctionalDebilityGemstoneGuard(pos.planet, pos.sign);
      if (debilityAudit.hasFunctionalDebility && debilityAudit.profile) {
        const fatalStone = debilityAudit.profile.fatalGemstone;
        
        // Add to avoidGemstones if not already present
        const alreadyAvoided = avoidGemstones.some((a) => a.planet === pos.planet);
        if (!alreadyAvoided) {
          avoidGemstones.push({
            gemstone: fatalStone,
            planet: pos.planet,
            reason: `Functional Debility Alert: ${pos.planet} is debilitated in ${pos.sign}. ${debilityAudit.profile.whyGemstoneIsFatalHinglish}`,
          });
        }

        // Add to analysis notes
        const safeAlt = debilityAudit.profile?.safeAlternativeRemedies?.stoneOrMetal || "Natural substitute metals";
        analysisNotes.push(
          `✦ Functional Debility Preservation: ${pos.planet} in ${pos.sign} gives an innate superpower: "${debilityAudit.profile.functionalSuperpowerHinglish}" DO NOT wear ${fatalStone}. Safe Alternative: ${safeAlt}.`
        );

        // If it was somehow recommended as primary or secondary, add strong caution
        if (primaryGemstone.planet === pos.planet) {
          primaryGemstone.cautions.unshift(
            `⚠️ STRICT CONTRAINDICATION: ${debilityAudit.profile.whyGemstoneIsFatalHinglish}`
          );
        }
        for (const sec of secondaryGemstones) {
          if (sec.planet === pos.planet) {
            sec.cautions.unshift(
              `⚠️ STRICT CONTRAINDICATION: ${debilityAudit.profile.whyGemstoneIsFatalHinglish}`
            );
          }
        }
      }
    }
  }

  // Lagna lord placement
  const lagnaLordPosition = chart.planets.find((planet) => planet.planet === lagnaLord);
  if (lagnaLordPosition && [1, 4, 5, 9, 10].includes(lagnaLordPosition.house)) {
    analysisNotes.push(
      `Lagna lord ${lagnaLord} is placed in house ${lagnaLordPosition.house}, so lagna-supportive remedies become more relevant and effective for this chart.`
    );
  }

  // Benefics in dusthanas
  const afflictedBenefics = chart.planets.filter(
    (planet) => benefics.includes(planet.planet) && [6, 8, 12].includes(planet.house)
  );
  if (afflictedBenefics.length) {
    analysisNotes.push(
      `${afflictedBenefics.map((planet) => planet.planet).join(", ")} are supportive planets but placed in sensitive houses (6/8/12). Start with lighter alternatives such as mantra and colour before moving to gemstones.`
    );
  }

  // Retrograde benefics
  const retrogradeBenefics = chart.planets.filter(
    (planet) => benefics.includes(planet.planet) && planet.isRetrograde
  );
  if (retrogradeBenefics.length) {
    analysisNotes.push(
      `${retrogradeBenefics.map((p) => p.planet).join(", ")} are retrograde. Their gemstone energy may work more inwardly — allow a longer testing period and observe carefully.`
    );
  }

  // Exalted benefics
  const exaltedBenefics = scoredPlanets.filter(
    (sp) => sp.pos && getDignity(sp.planet, sp.pos.sign) === "exalted"
  );
  if (exaltedBenefics.length) {
    analysisNotes.push(
      `${exaltedBenefics.map((sp) => sp.planet).join(", ")} are exalted — their gemstones carry the highest potency for this lagna and are strongly supported.`
    );
  }

  const currentDasha = readGemstoneDasha(rawInput);
  const dashaNote =
    currentDasha && currentDasha !== "Not connected"
      ? `Current dasha active: ${currentDasha}. Gemstone suitability must be cross-checked against the active dasha lord and period before wearing.`
      : "Current dasha data is not connected. Gemstone guidance is based on lagna, functional benefics and planetary strength — connect dasha data for a complete picture.";

  analysisNotes.push(
    "Always begin with mantra, colour discipline and donation remedies before investing in expensive gemstones."
  );
  analysisNotes.push(
    "Final gemstone wearing must be confirmed through full chart analysis, active dasha context, current life situation and expert review."
  );
  analysisNotes.push(dashaNote);

  return {
    primaryGemstone,
    secondaryGemstones,
    avoidGemstones,
    lagnaSign: lagna,
    lagnaLord,
    currentDasha,
    dashaNote,
    analysisNotes,
    safetyNote:
      "Gemstones amplify planetary energy — they are powerful and specific. This report is a suitability guide, not a final prescription. Prefer mantra, colour discipline and expert confirmation before wearing expensive stones.",
  };
}

// rawInput passed through so dasha reads from the original data, not just the parsed NatalChart
export function generateGemstoneReportFromChart(input: unknown): GemstoneReport {
  return generateGemstoneReport(buildNatalChartFromAnyChart(input), input);
}

// ─── Dasha-specific gem recommendations ──────────────────────────────────────

function isPlanetName(value: unknown): value is Exclude<Planet, "Ascendant"> {
  return ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].includes(
    String(value)
  );
}

function findActiveDashaPlanet(
  input: unknown,
  key: "dashas" | "antardasha"
): Exclude<Planet, "Ascendant"> | null {
  const root = getRoot(input);
  const inputObj = asDict(input);
  const pool = root?.[key] ?? inputObj?.[key] ?? [];
  if (!Array.isArray(pool) || !pool.length) return null;
  const active = pool.find((item) => asDict(item)?.active) ?? pool[0];
  const activeObj = asDict(active);
  return isPlanetName(activeObj?.planet) ? activeObj.planet : null;
}

function getHouseRelevanceLine(planetPos: PlanetPosition | undefined): string {
  if (!planetPos) {
    return "Chart position unavailable — start with mantra and a trial period before gemstone wearing.";
  }
  if ([1, 5, 9].includes(planetPos.house)) {
    return `Strong trikona placement: house ${planetPos.house} — highly suitable for gemstone support.`;
  }
  if ([4, 7, 10].includes(planetPos.house)) {
    return `Kendra placement: house ${planetPos.house} — gemstone support is relevant and appropriate.`;
  }
  if ([6, 8, 12].includes(planetPos.house)) {
    return `Sensitive dusthana placement: house ${planetPos.house} — prefer milder remedies first and test carefully before gemstone.`;
  }
  return `Placed in house ${planetPos.house} — assess based on current life priorities and personal tolerance.`;
}

export function makeRudrakshaRecommendation(
  planet: Exclude<Planet, "Ascendant">,
  planetPos: PlanetPosition | undefined
): RudrakshaRecommendation {
  const data = PLANET_RUDRAKSHA[planet];
  // Extract numeric Mukhi (e.g., "1 Mukhi" -> 1)
  const mukhiNum = parseInt(data.mukhi.split(' ')[0]);
  const extended = RUDRAKSHA_MUKHI[mukhiNum];
  const defaultWearing: RudrakshaWearing = { metal: "Gold or Silver", day: "Any day", finger: "Ring finger", position: "Neck" };
  return {
    planet,
    mukhi: data.mukhi,
    bead: extended?.nameEnglish ?? data.bead,
    mantra: extended?.mantra ?? data.mantra,
    reason: `${planet} balancing and activating support. ${getHouseRelevanceLine(planetPos)}`,
    rulingDeity: extended?.rulingDeity ?? "Unknown",
    spiritualBenefits: extended?.spiritualBenefits ?? [],
    healthBenefits: extended?.healthBenefits ?? [],
    materialBenefits: extended?.materialBenefits ?? [],
    problemsSolved: extended?.problemsSolved ?? [],
    bestFor: extended?.bestFor ?? [],
    wearing: extended?.wearing ?? defaultWearing,
    rarity: extended?.rarity ?? "Unknown",
  };
}

function makeDashaRecommendation(
  level: "Mahadasha" | "Antardasha",
  planet: Exclude<Planet, "Ascendant">,
  chart: NatalChart
): DashaGemRecommendation {
  const gem = PLANET_GEMSTONES[planet];
  const wear = PLANET_WEARING[planet];
  const pos = chart.planets.find((p) => p.planet === planet);

  return {
    level,
    planet,
    gemstone: gem.primary,
    alternateGemstone: gem.alternate,
    rudraksha: makeRudrakshaRecommendation(planet, pos),
    wearing: wear,
    reason: `${planet} is the active ${level} lord. ${getHouseRelevanceLine(pos)} Strengthening this planet through its gemstone or rudraksha may support the themes of this dasha period.`,
  };
}

export function generateDashaGemstoneRecommendationsFromChart(input: unknown): DashaGemRecommendation[] {
  const natal = buildNatalChartFromAnyChart(input);
  const md = findActiveDashaPlanet(input, "dashas");
  const ad = findActiveDashaPlanet(input, "antardasha");
  const result: DashaGemRecommendation[] = [];

  if (md) result.push(makeDashaRecommendation("Mahadasha", md, natal));
  if (ad) result.push(makeDashaRecommendation("Antardasha", ad, natal));
  return result;
}

// ─── Rudraksha Query Helpers ──────────────────────────────────────────────────

export function getRudrakshaData(mukhi: number): RudrakshaData | undefined {
  return RUDRAKSHA_MUKHI[mukhi];
}

export function getAllRudrakshas(): RudrakshaData[] {
  return Object.values(RUDRAKSHA_MUKHI);
}

export function findRudrakshaForProblem(query: string): RudrakshaData[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return Object.values(RUDRAKSHA_MUKHI).filter((r) => {
    return (
      r.problemsSolved.some((p) => p.toLowerCase().includes(q)) ||
      r.healthBenefits.some((h) => h.toLowerCase().includes(q)) ||
      r.materialBenefits.some((m) => m.toLowerCase().includes(q)) ||
      r.spiritualBenefits.some((s) => s.toLowerCase().includes(q)) ||
      r.bestFor.some((b) => b.toLowerCase().includes(q))
    );
  });
}

// ─── Compatibility exports ────────────────────────────────────────────────────

export const calculateGemstoneReport = generateGemstoneReportFromChart;
export const getGemstoneReport = generateGemstoneReportFromChart;
export const analyzeGemstones = generateGemstoneReportFromChart;
