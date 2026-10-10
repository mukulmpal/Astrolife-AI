import type { ChartData } from "./calculations";

// ── Types ──────────────────────────────────────────────────────────────────────

export type KarakaRole = "AK" | "AmK" | "BK" | "MK" | "PK" | "GK" | "DK";

export interface Karaka {
  role: KarakaRole;
  planet: string;
  degreeInSign: number;
  signNum: number;
  sign: string;
  meaning: string;
  signifies: string;
  notes: string;
}

export interface ArudhaPada {
  house: number;
  name: string;
  shortName: string;
  signNum: number;
  sign: string;
  meaning: string;
}

export interface JaiminiAspect {
  fromSign: number;
  toSigns: number[];
}

export interface CharaDashaPeriod {
  sign: string;
  signNum: number;
  years: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  daysRemaining: number;
  progressPercent: number;
  isSavyaSign: boolean;
  isGkSign: boolean;
  isDkSign: boolean;
  isAkSign: boolean;
  isAmkSign: boolean;
}

export interface CharaDashaAD {
  mdSign: string;
  mdSignNum: number;
  adSign: string;
  adSignNum: number;
  years: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  daysRemaining: number;
  progressPercent: number;
}

export interface JaiminiRajaYoga {
  name: string;
  description: string;
  strength: "Strong" | "Moderate";
  involved: string[]; // planets or arudhas involved
}

export interface ArgalaEntry {
  referenceSign: string;
  referenceSignNum: number;
  argalaHouses: { position: string; planets: string[]; type: "Argala" | "VirodhArgala" }[];
  netArgala: "Positive" | "Negative" | "Neutral";
  interpretation: string;
}

// ── Karakamsha Kundali (D9 Navamsha Base) ─────────────────────────────────────
export interface KarakamshaHouse {
  house: number; // 1 to 12 from Karakamsha Lagna
  sign: string;
  signNum: number;
  planets: string[]; // D1 natal planets occupying this sign
  theme: string;
  significance: string;
}

export interface KarakamshaKundali {
  akPlanet: string;
  akSign: string;
  akSignNum: number;
  d9Sign: string;
  d9SignNum: number;
  karakamshaLagna: string;
  karakamshaLagnaNum: number;
  method: string;
  houses: KarakamshaHouse[];
  staticAnalysis: {
    soulPurpose: string;
    wealthSource: string;
    familyNature: string;
    spousePersona: string;
    careerDestiny: string;
    lifeChallenges: string;
  };
}

// ── GK (Gnatikaraka) Analysis ─────────────────────────────────────────────────
export interface GkAfflictedPlanet {
  planet: string;
  sign: string;
  signNum: number;
  houseFromLagna: number;
  isAdjacentProtected: boolean;
  effect: string;
}

export interface GkAfflictedHouse {
  house: number;
  sign: string;
  signNum: number;
  effect: string;
}

export interface GkAnalysis {
  gkPlanet: string;
  gkSign: string;
  gkSignNum: number;
  degreeInSign: number;
  gkHouseFromLagna: number;
  isGkLagnaLord: boolean;
  gkLagnaLordDiagnosis?: string;
  houseProblem: string;
  diseases: string[];
  remedies: string[];
  afflictedPlanets: GkAfflictedPlanet[];
  afflictedHouses: GkAfflictedHouse[];
  timingDashaSigns: string[];
  isCurrentDashaAfflicted: boolean;
  activeDashaWarning?: string;
  crossVerificationNote: string;
}

// ── BK (Bhratrikaraka) Problem Radar ──────────────────────────────────────────
export interface BkAnalysis {
  bkPlanet: string;
  bkSign: string;
  bkSignNum: number;
  bkHouseFromLagna: number;
  isInDusthana: boolean; // 6, 8, 12
  isAfflictedByGk: boolean;
  isBkProblemActive: boolean;
  warning?: string;
}

// ── DK (Darakaraka) Analysis ─────────────────────────────────────────────────
export interface DkAnalysis {
  dkPlanet: string;
  dkSign: string;
  dkSignNum: number;
  degreeInSign: number;
  dkHouseFromLagna: number;
  spousePersona: string;
  spouseTraits: string[];
  hasDkObstacle: boolean;
  dkObstacleWarning?: string;
  marriageTimingSigns: string[];
  isCurrentDashaMarriageWindow: boolean;
  marriageTimingNote: string;
}

// ── AK & AmK Analysis ─────────────────────────────────────────────────────────
export interface AkLifeSphere {
  title: string;
  focus: string;
  transcriptRule: string;
  evolutionArea: string;
}

export interface AmkWealthChannel {
  source: string;
  channel: string;
  practicalField: string;
}

export interface AkAmkAnalysis {
  akPlanet: string;
  akSign: string;
  akSignNum: number;
  akHouseFromLagna: number;
  akStatus: "Favorable (1/10/11)" | "Challenging (8/12)" | "Moderate";
  akQuality: string;
  akPhysicalMentalTraits: string[];
  akLifeSphere: AkLifeSphere;
  akFameTimingSigns: string[];
  isCurrentDashaAk: boolean;
  amkPlanet: string;
  amkSign: string;
  amkSignNum: number;
  amkHouseFromLagna: number;
  amkStatus: "Favorable (1/10/11)" | "Challenging (6/8/12)" | "Moderate";
  amkCareerField: string;
  amkWealthChannel: AmkWealthChannel;
  amkGrowthTimingSigns: string[];
  isCurrentDashaAmk: boolean;
  isRajayoga: boolean;
  isGkAspectingRajayoga: boolean;
  isSupremeTeacherYoga: boolean;
  rajayogaTier: "Supreme Teacher Yoga" | "Pinnacle Unblemished" | "Afflicted" | "None";
  rajayogaDescription: string;
}

// ── Retrograde Planet Activation ──────────────────────────────────────────────
export interface RetrogradePlanetInfo {
  planet: string;
  sign: string;
  signNum: number;
  houseFromLagna: number;
  activationStatus: "Requires Activation";
  guidance: string;
}

export interface JaiminiResult {
  karakas: Karaka[];
  arudhas: ArudhaPada[];
  aspects: JaiminiAspect[];
  charaDasha: CharaDashaPeriod[];
  currentDasha: CharaDashaPeriod | null;
  currentDashaAD: CharaDashaAD[];
  activeAD: CharaDashaAD | null;
  rajaYogas: JaiminiRajaYoga[];
  argala: ArgalaEntry[];
  specialFindings: string[];
  direction: "Savya" | "Apasavya";
  directionReason: string;
  karakamsha: KarakamshaKundali;
  gkAnalysis: GkAnalysis;
  bkAnalysis: BkAnalysis;
  dkAnalysis: DkAnalysis;
  akAmkAnalysis: AkAmkAnalysis;
  retrogradeActivation: RetrogradePlanetInfo[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_ICONS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export const KARAKA_ROLES: KarakaRole[] = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

export const KARAKA_MEANINGS: Record<KarakaRole, string> = {
  AK:  "Atmakaraka — Soul, name, fame, status, character (1st house significator)",
  AmK: "Amatyakaraka — Profession, business, money, career (2nd, 10th, 11th)",
  BK:  "Bhratrikaraka — Siblings, courage, efforts, hobbies, travel, marketing (3rd house)",
  MK:  "Matrikaraka — Mother, parents, home, domestic life, education (4th house)",
  PK:  "Putrakaraka — Intellect, brain, children, past life good karma (5th house)",
  GK:  "Gnatikaraka — Problems, diseases, debts, enemies (6th house — SABSE IMPORTANT)",
  DK:  "Darakaraka — Life partner, marriage, spouse, partnerships (7th house)",
};

export const KARAKA_SIGNIFIES: Record<KarakaRole, string> = {
  AK:  "1st House — Soul essence, self-respect, personal status, health and life path",
  AmK: "2nd, 10th & 11th Houses — Career authority, financial earning, advisors, vocation",
  BK:  "3rd House — Younger siblings, courage, personal drive, hobbies, short travels",
  MK:  "4th House — Mother, parents, domestic peace, vehicles, land, emotional stability",
  PK:  "5th House — Children, sharp intellect, creative foresight, past life merits",
  GK:  "6th House — Obstacles, debts, enemies, litigation, health vulnerabilities",
  DK:  "7th House — Spouse persona, marriage timing, business contracts, long-term partners",
};

export const KARAKA_ICONS: Record<KarakaRole, string> = {
  AK: "👑", AmK: "💼", BK: "🛡️", MK: "🏡", PK: "💡", GK: "⚡", DK: "💍",
};

export const ARUDHA_META: Record<number, { name: string; shortName: string; meaning: string }> = {
  1:  { name: "Lagna Arudha",  shortName: "AL",  meaning: "Public image, how the world perceives you" },
  2:  { name: "Dhana Pada",    shortName: "A2",  meaning: "Wealth perception, face value, resources" },
  3:  { name: "Vikrama Pada",  shortName: "A3",  meaning: "Efforts, courage, initiative" },
  4:  { name: "Matru Pada",    shortName: "A4",  meaning: "Property, vehicles, mother" },
  5:  { name: "Mantra Pada",   shortName: "A5",  meaning: "Children, intelligence, creativity" },
  6:  { name: "Shatru Pada",   shortName: "A6",  meaning: "Enemies, debts, disease perception" },
  7:  { name: "Dara Pada",     shortName: "A7",  meaning: "Spouse, partnerships, social life" },
  8:  { name: "Mrityu Pada",   shortName: "A8",  meaning: "Obstacles, longevity, hidden matters" },
  9:  { name: "Pitru Pada",    shortName: "A9",  meaning: "Father, dharma, fortune, spiritual path" },
  10: { name: "Rajya Pada",    shortName: "A10", meaning: "Career, authority, public power" },
  11: { name: "Labha Pada",    shortName: "A11", meaning: "Gains, income, social network" },
  12: { name: "Upapada Lagna", shortName: "UL",  meaning: "Spouse quality, marriage, liberation" },
};

// Jaimini sign lords — Mars for Scorpio, Saturn for Aquarius (Rahu/Ketu excluded per transcript)
export const JAIMINI_LORD: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun",  5: "Mercury", 6: "Venus",  7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

// Rashi Drishti — movable ↔ fixed (minus adjacent), dual ↔ all duals
export const JAIMINI_ASPECTS: Record<number, number[]> = {
  0:  [4, 7, 10],   // Aries (movable) → Leo, Scorpio, Aquarius (skips adjacent Taurus)
  1:  [3, 6, 9],    // Taurus (fixed) → Cancer, Libra, Capricorn (skips adjacent Aries)
  2:  [5, 8, 11],   // Gemini (dual) → Virgo, Sagittarius, Pisces
  3:  [1, 7, 10],   // Cancer (movable) → Taurus, Scorpio, Aquarius (skips adjacent Leo)
  4:  [0, 6, 9],    // Leo (fixed) → Aries, Libra, Capricorn (skips adjacent Cancer)
  5:  [2, 8, 11],   // Virgo (dual) → Gemini, Sagittarius, Pisces
  6:  [1, 4, 10],   // Libra (movable) → Taurus, Leo, Aquarius (skips adjacent Scorpio)
  7:  [0, 3, 9],    // Scorpio (fixed) → Aries, Cancer, Capricorn (skips adjacent Libra)
  8:  [2, 5, 11],   // Sagittarius (dual) → Gemini, Virgo, Pisces
  9:  [1, 4, 7],    // Capricorn (movable) → Taurus, Leo, Scorpio (skips adjacent Aquarius)
  10: [0, 3, 6],    // Aquarius (fixed) → Aries, Cancer, Libra (skips adjacent Capricorn)
  11: [2, 5, 8],    // Pisces (dual) → Gemini, Virgo, Sagittarius
};

export const SIGN_COLOR: Record<number, string> = {
  0: "#ef4444", 1: "#a78bfa", 2: "#22c55e", 3: "#38bdf8",
  4: "#f97316", 5: "#84cc16", 6: "#ec4899", 7: "#dc2626",
  8: "#f59e0b", 9: "#64748b", 10: "#6366f1", 11: "#06b6d4",
};

// Savya (Direct/Clockwise) and Apasavya (Reverse/Anti-Clockwise) Signs
export const SAVYA_SIGNS = [0, 1, 2, 6, 7, 8]; // Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius
export const APASAVYA_SIGNS = [3, 4, 5, 9, 10, 11]; // Cancer, Leo, Virgo, Capricorn, Aquarius, Pisces

// ── GK Knowledge Base ─────────────────────────────────────────────────────────
export const GK_HOUSE_PROBLEMS: Record<number, string> = {
  1: "Bimariyan, physical stamina drops, health and vitality issues (Tan-bhav affliction)",
  2: "Paisa jo save kiya wo bhi nikal dega — accumulated wealth & family savings drain",
  3: "Chhote bhai-behen se problem, initiative drops, courage & travel stress",
  4: "Ghar/maa se problem, domestic friction, mental peace disruption, property disputes",
  5: "Bachchon se problem, brain fatigue, wrong investment decisions & speculative losses",
  6: "Rog, shatru, karz — disease flares, litigation pressure, workplace rivalry, debt stress",
  7: "Life partner se problem, marital strain, legal or business partnership friction",
  8: "Duniya bhar ki peeda — chronic delays, unexpected obstacles, health trauma, accident risk",
  9: "Bhagya me rukavat, father/guru relations friction, spiritual confusion",
  10: "Profession me allegation, false charges, reputation hit, name/fame ki dhajjiyan",
  11: "Friends circle se dhokha, sudden profit interruptions, social disappointment",
  12: "Kharcha badhega, hospital bills, sleep deprivation, sudden losses, jail/legal anxiety",
};

export const GK_PLANET_DISEASES: Record<string, string[]> = {
  Sun: ["Heart ailments", "Eye problems", "Bone/calcium weakness", "Acidity & bile flare"],
  Moon: ["Depression", "Sleeplessness / insomnia", "Mental stress & anxiety", "Water retention & cough"],
  Mars: ["High BP", "Accidents & surgery", "Muscular & body pain", "Blood infections / cuts"],
  Mercury: ["Memory weakness", "Nervous system distress", "Respiratory & skin allergies", "Speech hesitation"],
  Jupiter: ["Liver complications", "Asthma & bronchial trouble", "Cancerous growth tendencies", "Obesity & wrong judgments"],
  Venus: ["Kidney problems", "Diabetes", "Skin diseases", "Reproductive / urinary friction"],
  Saturn: ["Gas / Vata accumulation", "Severe joint pain", "Knee pain & mobility trouble", "Vascular blockages"],
};

export const GK_PLANET_REMEDIES: Record<string, string[]> = {
  Sun: [
    "Sunday ko needy logon ko gehun (wheat) ka daan karein.",
    "Gareeb mareezon ko dawaiyon (medicines) me madad karein.",
    "Daily morning Surya Gayatri mantra ya Aditya Hridaya Stotra ka paath karein.",
  ],
  Moon: [
    "Gareeb parivaaron ko annadaan (free food) bhent karein.",
    "Mata (mother) ki nitya seva karein aur unka aashirwad lein.",
    "Chandi ke bartan se paani piyein; shivling par kachha doodh arpit karein.",
  ],
  Mars: [
    "North-East (Ishan kon) me Panchmukhi Hanuman ji ki photo/murti sthapit karein aur nitya darshan karein.",
    "Daily exercise ya gym join karein — physical energy ko canalize karein.",
    "Mangalwar ko Hanuman Chalisa ka paath aur laal masoor daal daan karein.",
  ],
  Mercury: [
    "Parindey (birds) ko nitya hari moong daal daalein.",
    "Green parrot (tota) ki seva karein ya pinjre se azaad karein.",
    "Ganesh ji ko durva arpit karein aur gay ko hara chara khilayein.",
  ],
  Jupiter: [
    "Brihaspativar (Thursday) ko chana daal aur haldi mandir me daan karein.",
    "Guruon, shikshakon aur buzurgon ka hridaya se aadar-samman karein.",
    "Bina loan liye honest, transparent decisions lein — shortcut se bachein.",
  ],
  Venus: [
    "Kitchen sink me thoda sa dahi (curd) regular bahayein — Shukra dosh shant hota hai.",
    "Gareebon me aloo (potato) ka langar ya bhojan batein.",
    "Mandir ya suhagin striyon ko itra (perfume) ya safed vastra daan karein.",
  ],
  Saturn: [
    "Kali sabut urad daal + sarson tel ka daan lagatar 16-17 din karein.",
    "Gareeb labour, safai karmachariyon aur physically challenged logon ki seva karein.",
    "Gas aur joint pain ke liye ayurvedic Vata-shamak aahar aur routine apnayein.",
  ],
};

// ── DK Spouse Persona Knowledge Base ──────────────────────────────────────────
export const DK_SPOUSE_PERSONAS: Record<string, { persona: string; traits: string[] }> = {
  Sun: {
    persona: "Authoritative, dignified, status-conscious partner with royal demeanor and strong family background",
    traits: ["High self-respect & integrity", "Connected to administration/governance", "Expects dignity and respect", "Proud and status-conscious"],
  },
  Moon: {
    persona: "Deeply emotional, gentle, caring, and nurturing life partner",
    traits: ["High emotional empathy", "Home-oriented and domestic", "Enjoys travel and water bodies", "Intuitive and compassionate"],
  },
  Mars: {
    persona: "Bold, energetic, property-loving, and fiercely protective partner",
    traits: ["Active & sports/fitness oriented", "Decisive & action-driven", "Interest in land/property", "Strong, direct communication"],
  },
  Mercury: {
    persona: "Youthful, intelligent, witty, excellent management skills, and online work orientation",
    traits: ["Analytical & quick-witted", "Business/management skills", "Great conversationalist", "Online and modern communication work"],
  },
  Jupiter: {
    persona: "Spiritual, wise, knowledgeable advisor, health-conscious, and traditional dharmic partner",
    traits: ["Natural teacher & solution provider", "Respects traditions & dharma", "Mature wisdom & sound counsel", "Fond of sacred studies & health"],
  },
  Venus: {
    persona: "Graceful, luxury-loving, artistic, and aesthetic life partner",
    traits: ["Sophisticated aesthetic sense", "Values financial abundance & luxury", "Charming & romantic nature", "Brings beauty & harmony to home"],
  },
  Saturn: {
    persona: "Disciplined, grounded, hardworking, mature, honest, punctual, and duty-bound spouse",
    traits: ["Strong work ethic", "Patient and realistic mindset", "Punctual & honest", "Supports through life hardships"],
  },
};

// ── AK Soul Attributes Knowledge Base ─────────────────────────────────────────
export const AK_SOUL_ATTRIBUTES: Record<string, { quality: string; description: string; traits: string[] }> = {
  Sun: {
    quality: "Supreme Character, Status & Truth",
    description: "Soul purpose revolves around truth, integrity, authority, father lineage, and social status. Success comes through honour rather than compromise.",
    traits: [
      "Chehra pita (father) par jata hai — distinct facial resemblance",
      "High aukaat & self-respect — compromise or humiliation bilkul bardasht nahi",
      "Natural royal posture, leadership aura, and uncompromising dignity",
      "Karmic goal: Upholding family honor and righteous truth",
    ],
  },
  Moon: {
    quality: "Compassion, Public Connection & Emotional Mastery",
    description: "Soul grows through maternal devotion, public empathy, emotional resilience, mind control, and adaptability.",
    traits: [
      "Travel aur water bodies (nadi, samudra) ka vishesh lagav",
      "Doosron ke liye balidaan (deep personal sacrifice) dene ka swabhava",
      "Mood swings aur emotional sensitivity — man bada komal hota hai",
      "Public mass appeal aur logon ko aakarshit karne ki swabhavik shakti",
    ],
  },
  Mars: {
    quality: "Courage, Physical Energy & Righteous Action",
    description: "Soul evolves through physical courage, defending others, real-estate discipline, and canalizing raw power into dharma.",
    traits: [
      "Boundless physical stamina — kabhi na thakne wali endless energy",
      "Sports, gym, physical fitness aur workout ka junoon",
      "Jaldi gussa aana par utni hi tezi se shaant ho jana (quick-flare, quick-cool)",
      "Protective warrior instinct — annyay ke khilaaf turant khada hona",
    ],
  },
  Mercury: {
    quality: "Intellect, Communication & Commercial Wisdom",
    description: "Soul expresses through intellectual discrimination, truthful speech, literature, business mastery, and friendship.",
    traits: [
      "Razor-sharp calculation aur zabardast memory retention",
      "Meticulous record keeping — purane documents, receipts, papers sambhal kar rakhna",
      "Bada friend circle — har category ke doston ke sath aasaani se ghul-mil jana",
      "Multi-tasking intellect — ek sath multiple vishayon par dhyan dena",
    ],
  },
  Jupiter: {
    quality: "Supreme Wisdom, Teaching & Purity (Solution Provider)",
    description: "Soul is born to advise, mentor, teach, and provide solutions. Never relies on loans or shortcuts; upholds 100% purity and dharmic knowledge.",
    traits: [
      "Granth Kanth — shastra, gyaan aur granth naturally kanthasth (memorized) rehte hain",
      "Ek word pakad kar poori kitaab likhne ki adbhut kshamta",
      "Badi naak = zyada gyaan (distinctive nose linked to deeper wisdom capacity)",
      "100% purity — na shortcut leta hai, na loan lena pasand karta hai",
      "Natural solution provider — log aakar guidance aur salah maangte hain",
    ],
  },
  Venus: {
    quality: "Refinement, Unconditional Love & Pure Prosperity",
    description: "Soul evolves through aesthetic harmony, relationship devotion, overcoming superficial lust, and cultivating spiritual grace.",
    traits: [
      "'Ek hi baat, solid baat' — filtered, sophisticated aur wazandaar speech",
      "Classy aesthetic sense — har cheez me refined taste aur sundarta chahiye",
      "True luxury lover — bina kisi vulgarity ke pure standard aur comfort",
      "Sambandhon me ek-nishtha aur prem ki aatma-dharmik pehchan",
    ],
  },
  Saturn: {
    quality: "Humility, Duty, Truthful Labour & Patience",
    description: "Soul path is grounded in patience, hard work, serving the downtrodden, and mastering worldly detachment through perseverance.",
    traits: [
      "Extreme punctuality — agar 10 baje ka time diya to 9:55 par pahunchega",
      "Relentless discipline — kachhue ki tarah slow but steady, jeet hamesha iski hoti hai",
      "Gareeb mazdooron aur safai karmachariyon ke prati aadar aur seva-bhav",
      "100% imaandari — mehnati aur bina shikayat kiye bojh uthane wala",
    ],
  },
};

// ── AK House Spheres: "Us House Ke Bahar Life Nahi Ja Sakti" ──────────────────
export const AK_HOUSE_SPHERES: Record<number, {
  title: string;
  focus: string;
  transcriptRule: string;
  evolutionArea: string;
}> = {
  1: {
    title: "1st House — Tan Bhav (Physical Body, Identity & Self)",
    focus: "Life revolves entirely around personal vitality, character development, individual identity, and physical self-mastery.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Aapki poori zindagi aapke sharir, aatmavishwas, aur personal identity ke daayre me hi evolve karegi.",
    evolutionArea: "Physical health, self-realization, personal branding, and moral courage.",
  },
  2: {
    title: "2nd House — Dhana Bhav (Wealth, Speech & Family Lineage)",
    focus: "Life revolves around family traditions, accumulated savings, vocal expression, and financial preservation.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Poori life parivaar ke sanskar, vani (speech), aur dhan-sanchay (savings) ke ird-gird ghumegi.",
    evolutionArea: "Vocal integrity, protecting family wealth, nourishing others, and truth in speech.",
  },
  3: {
    title: "3rd House — Sahaja Bhav (Courage, Skills & Self-Effort)",
    focus: "Life revolves around younger siblings, hands-on craft, communications, digital media, writing, and self-made valor.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Mehnat, communication, bhai-behen, aur naye initiatives lene me hi poori life vyatit hogi.",
    evolutionArea: "Artistic/technical execution, digital media outreach, self-reliance, and fearless initiative.",
  },
  4: {
    title: "4th House — Sukha Bhav (Mother, Domestic Peace & Property)",
    focus: "Life revolves around mother, real estate, vehicles, emotional security, and building a peaceful domestic sanctuary.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Ghar, mataji ki seva, zameen-jaydaad, aur man ki shanti hi jeevan ka permanent focal point rahega.",
    evolutionArea: "Inner emotional tranquility, landed assets, maternal reverence, and heart-centered peace.",
  },
  5: {
    title: "5th House — Putra Bhav (Intellect, Progeny & Past Merits)",
    focus: "Life revolves around children, deep advisory counsel, creative masterpieces, sharp intellect, and purva punya merits.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Brain power, bachche, guidance dena, aur gyaan ki rachna me hi poori life involve rahegi.",
    evolutionArea: "Advising disciples, analytical depth, creative legacy, and speculative intelligence.",
  },
  6: {
    title: "6th House — Ari Bhav (Service, Healing & Overcoming Hurdles)",
    focus: "Life revolves around resolving complex disputes, healthcare, service to society, and overcoming debts or workplace rivals.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Seva, problem-solving, rog-shatru se ladna, aur daily discipline hi aatma ka karmic field rahega.",
    evolutionArea: "Relentless work ethic, legal arbitration, medical/healing service, and debt mitigation.",
  },
  7: {
    title: "7th House — Jaya Bhav (Marriage, Partner & Public Arena)",
    focus: "Life revolves around spouse, interpersonal contracts, business partnerships, and diplomacy in public dealings.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Spouse, business partner, aur public dealings ke bahar aapka astitva expand nahi hoga.",
    evolutionArea: "Marital devotion, commercial alliances, diplomatic negotiations, and public standing.",
  },
  8: {
    title: "8th House — Randhra Bhav (Occult, Transformation & Hidden Depth)",
    focus: "Life revolves around deep investigative research, sudden transformations, occult sciences, inheritance, and psychological depth.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Rahasyamayi vidya (occult), research, sudden twists, aur deep spiritual cleansing hi life ka path hai.",
    evolutionArea: "Karmic resilience, esoteric wisdom, crisis turnaround, and ego surrender.",
  },
  9: {
    title: "9th House — Dharma Bhav (Higher Dharma, Guru & Pilgrim Path)",
    focus: "Life revolves around spiritual preceptors, father, philosophical doctrines, publishing, and righteous mentor guidance.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Guru ka aashirwad, dharma, dharmik yatrayen, aur higher learning hi aapka permanent circle hai.",
    evolutionArea: "Philosophical truth, upholding family/social ethics, pilgrimage, and spiritual mentorship.",
  },
  10: {
    title: "10th House — Karma Bhav (Career Zenith, Status & Worldly Duty)",
    focus: "Life revolves around professional authority, executive power, public reputation, and social responsibilities.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Karma, pad-pratishtha (status), sarkari ya corporate authority hi aapki mukhya pehchan banegi.",
    evolutionArea: "Executive leadership, social legacy, ethical career zenith, and worldly service.",
  },
  11: {
    title: "11th House — Labha Bhav (Aspirations, Networks & Mass Gains)",
    focus: "Life revolves around large communities, elder siblings, fulfillment of life ambitions, and expanding multiple revenue streams.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Dost, organizations, society ke networks, aur lakshya-prapti me hi poori urja lagegi.",
    evolutionArea: "Community leadership, scaling wealth ecosystems, social empowerment, and realized aspirations.",
  },
  12: {
    title: "12th House — Moksha Bhav (Detachment, Foreign Lands & Solitude)",
    focus: "Life revolves around foreign connections, institutions, spiritual seclusion, charitable giving, and transcendental liberation.",
    transcriptRule: "Us house ke bahar life nahi ja sakti: Videsh (foreign), akelepan me shanti, hospital/charity, aur moksha ke daayre me hi aatma rahegi.",
    evolutionArea: "Spiritual transcendence, selfless surrender, global foreign horizons, and mental release.",
  },
};

// ── AmK House Wealth Channels: "Wahan Se Paisa Aayega" ────────────────────────
export const AMK_HOUSE_WEALTH_CHANNELS: Record<number, {
  source: string;
  channel: string;
  practicalField: string;
}> = {
  1: {
    source: "Self-Image, Personal Consulting & Direct Brand",
    channel: "Wealth flows directly through your individual name, physical leadership, personal reputation, and solo consulting.",
    practicalField: "Founder/CEO, independent consultant, keynote authority, personal brand builder.",
  },
  2: {
    source: "Family Enterprise, Speech, Banking & Food",
    channel: "Wealth flows through family trade, financial services, vocal expression, food/hospitality, and wealth management.",
    practicalField: "Banking, investment advisory, family legacy business, vocal/speech teaching, food industry.",
  },
  3: {
    source: "Media, IT, Self-Effort, Writing & Communications",
    channel: "Wealth flows through digital platforms, publication, skill-based trade, advertising, short-distance travels, and younger colleagues.",
    practicalField: "Software/IT development, content publishing, digital marketing, journalism, creative craft, sales.",
  },
  4: {
    source: "Real Estate, Land, Vehicles & Educational Infrastructure",
    channel: "Wealth flows through property development, architectural projects, educational institutions, automobiles, and home comforts.",
    practicalField: "Real estate builder/agent, interior design, educational institutions, transport/auto trade.",
  },
  5: {
    source: "Advisory, Mentorship, Speculation & Creative Intellect",
    channel: "Wealth flows through advising clients, stock markets, innovative intellectual property, creative direction, and teaching.",
    practicalField: "Equity analyst/fund manager, university professor, creative director, high-level consultant.",
  },
  6: {
    source: "Healthcare, Legal Defense, Dispute Resolution & Auditing",
    channel: "Wealth flows through providing essential services, litigation, medical care, labor management, and debt resolution.",
    practicalField: "Legal practitioner, doctor/pharmacist, corporate auditor, recovery/arbitration specialist.",
  },
  7: {
    source: "Spouse Network, Commercial Partnerships & Public Contracts",
    channel: "Wealth flows through marriage alliances, co-founded business partnerships, B2B contracts, and international trade.",
    practicalField: "Joint ventures, retail/hospitality, foreign commerce, public relations, diplomacy.",
  },
  8: {
    source: "Deep Analytics, Research, Insurance, Mining & Unearned Assets",
    channel: "Wealth flows through investigative sciences, crisis management, insurance underwriting, inheritances, and occult fields.",
    practicalField: "Data scientist, forensic investigator, insurance head, mineral/petroleum sector, occultist.",
  },
  9: {
    source: "Higher Education, Publishing, Dharmic Mentorship & Law",
    channel: "Wealth flows through higher knowledge institutions, legal judiciary, publishing books, spiritual teaching, and long journeys.",
    practicalField: "High court judge/attorney, book publisher, spiritual author, cross-border university professor.",
  },
  10: {
    source: "Government Contracts, Corporate Executive Zenith & Public Status",
    channel: "Wealth flows through government patronage, public sector management, commanding large organizations, and administrative power.",
    practicalField: "Government officer, corporate VP/Managing Director, public policy maker, enterprise leader.",
  },
  11: {
    source: "Mega Networks, Community Platforms & High-Volume Gains",
    channel: "Wealth flows through large professional networks, community subscriptions, commission royalties, and venture gains.",
    practicalField: "Tech platform founder, network marketing head, venture capitalist, community director.",
  },
  12: {
    source: "Multinational Corporations (MNCs), Foreign Clients & Healing",
    channel: "Wealth flows through overseas clients, export-import, MNC employment, remote offshore projects, and wellness sanctuaries.",
    practicalField: "MNC specialist, export-import trader, offshore contractor, spiritual retreat director.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function md(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// Navamsha (D9) Sign Number: 108 navamshas across 360° (each is 3°20' = 3.333333°)
export function getNavamshaSignNum(lon: number): number {
  return Math.floor(md(lon, 360) / (360 / 108)) % 12;
}

// ── Chara Karakas (Degree-Wise, Strictly Excludes Rahu/Ketu) ───────────────────

export function calculateKarakas(planets: ChartData["planets"]): Karaka[] {
  const GRAHA = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const sorted = GRAHA
    .filter(p => planets[p])
    .map(p => {
      const lon = planets[p].lon;
      const deg = md(lon, 360) % 30;
      return { planet: p, degreeInSign: deg, signNum: Math.floor(md(lon, 360) / 30) };
    })
    .sort((a, b) => b.degreeInSign - a.degreeInSign);

  return sorted.map((e, i) => {
    const role = KARAKA_ROLES[i];
    return {
      role,
      planet: e.planet,
      degreeInSign: Number(e.degreeInSign.toFixed(2)),
      signNum: e.signNum,
      sign: RASHIS[e.signNum],
      meaning: KARAKA_MEANINGS[role],
      signifies: KARAKA_SIGNIFIES[role],
      notes: role === "GK"
        ? "SABSE IMPORTANT: Bimari, dushman, karz, aur life ke roadblocks ka time batata hai"
        : role === "AK"
        ? "Soul essence, character and public status"
        : role === "DK"
        ? "Life partner characteristics and marriage timing"
        : "",
    };
  });
}

// ── Arudha Padas ──────────────────────────────────────────────────────────────

function lordSignNum(signNum: number, planets: ChartData["planets"]): number {
  const lord = JAIMINI_LORD[signNum];
  if (!planets[lord]) return signNum;
  return Math.floor(md(planets[lord].lon, 360) / 30);
}

function calcArudha(houseSign: number, lordSign: number): number {
  const D = md(lordSign - houseSign, 12) || 12;
  let a = md(lordSign + D - 1, 12);
  if (a === houseSign)                  a = md(houseSign + 9, 12);
  else if (a === md(houseSign + 6, 12)) a = md(houseSign + 3, 12);
  return a;
}

export function calculateArudhas(chart: ChartData): ArudhaPada[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  return Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const houseSign = md(lagnaNum + i, 12);
    const arudhaSign = calcArudha(houseSign, lordSignNum(houseSign, chart.planets));
    const meta = ARUDHA_META[h];
    return {
      house: h,
      name: meta.name,
      shortName: meta.shortName,
      signNum: arudhaSign,
      sign: RASHIS[arudhaSign],
      meaning: meta.meaning,
    };
  });
}

// ── Jaimini Aspects ───────────────────────────────────────────────────────────

export function getJaiminiAspects(): JaiminiAspect[] {
  return Object.entries(JAIMINI_ASPECTS).map(([from, to]) => ({
    fromSign: Number(from),
    toSigns: to,
  }));
}

export function doesSignAspect(fromSign: number, toSign: number): boolean {
  if (fromSign === toSign) return false;
  return JAIMINI_ASPECTS[fromSign]?.includes(toSign) ?? false;
}

export function isAdjacentSign(signA: number, signB: number): boolean {
  const diff = Math.abs(signA - signB);
  return diff === 1 || diff === 11;
}

// ── Chara Dasha Direction & Exact Duration ────────────────────────────────────

export function getCharaDashaDirection(lagnaNum: number): {
  direction: "Savya" | "Apasavya";
  isDirect: boolean;
  ninthSignNum: number;
  reason: string;
} {
  // 9th House Confirmation Rule:
  // For signs [0, 1, 2, 4, 5, 9, 10, 11] -> 9th sign counted forward: (lagnaNum + 8) % 12
  // For signs [3, 6, 7, 8] -> 9th sign counted backward: (lagnaNum - 8) % 12
  // Example from transcript: Virgo (5) -> forward 9th is Taurus (1, Savya) -> Clockwise!
  // Example: Libra (6) -> backward 9th is Aquarius (10, Apasavya) -> Anti-clockwise!
  let ninthSignNum: number;
  if ([0, 1, 2, 4, 5, 9, 10, 11].includes(lagnaNum)) {
    ninthSignNum = md(lagnaNum + 8, 12);
  } else {
    ninthSignNum = md(lagnaNum - 8, 12);
  }

  const isNinthSavya = SAVYA_SIGNS.includes(ninthSignNum);
  const direction: "Savya" | "Apasavya" = isNinthSavya ? "Savya" : "Apasavya";
  const isDirect = direction === "Savya";

  const reason = `Lagna is ${RASHIS[lagnaNum]}. 9th house confirmation yields ${RASHIS[ninthSignNum]} (${isNinthSavya ? "Savya" : "Apasavya"}), directing dasha sequence ${direction} (${isDirect ? "Clockwise" : "Anti-clockwise"}).`;

  return { direction, isDirect, ninthSignNum, reason };
}

export function charaDashaYears(signNum: number, planets: ChartData["planets"]): number {
  const lord = JAIMINI_LORD[signNum];
  const lordPlanet = planets[lord];
  if (!lordPlanet) return 10;
  const lordSign = Math.floor(md(lordPlanet.lon, 360) / 30);

  // If lord is in the same sign (own sign) -> gets full 12 years (Max: 12)
  if (lordSign === signNum) return 12;

  const isSavya = SAVYA_SIGNS.includes(signNum);
  const houseCount = isSavya
    ? md(lordSign - signNum, 12) + 1
    : md(signNum - lordSign, 12) + 1;

  // Exact rule from transcript:
  // "Rashi se uske lord ki position tak count karo, 1 minus kar do. Max 12, Min 1."
  // Example: Taurus (2), lord in 6th house (Virgo, count 5) -> 5 - 1 = 4 saal!
  let duration = houseCount - 1;
  if (duration <= 0) duration = 12;
  return Math.max(1, Math.min(12, duration));
}

export function calculateCharaDasha(
  chart: ChartData,
  karakasInput?: Karaka[]
): CharaDashaPeriod[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const { isDirect } = getCharaDashaDirection(lagnaNum);
  const birthDate = new Date(`${chart.dob}T${chart.tob ?? "12:00"}`);
  const now = new Date();

  const karakas = karakasInput ?? calculateKarakas(chart.planets);
  const gk = karakas.find(k => k.role === "GK");
  const dk = karakas.find(k => k.role === "DK");
  const ak = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");

  const periods: CharaDashaPeriod[] = [];
  let cursor = new Date(birthDate);

  for (let i = 0; i < 12; i++) {
    const signNum = isDirect ? md(lagnaNum + i, 12) : md(lagnaNum - i, 12);
    const yrs = charaDashaYears(signNum, chart.planets);
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setFullYear(end.getFullYear() + yrs);

    const isActive = now >= start && now < end;
    const totalMs = end.getTime() - start.getTime();
    const elapsedMs = now.getTime() - start.getTime();
    const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
    const progressPercent = isActive
      ? Number(Math.min(100, (elapsedMs / totalMs) * 100).toFixed(1))
      : now >= end ? 100 : 0;

    periods.push({
      sign: RASHIS[signNum],
      signNum,
      years: yrs,
      startDate: start,
      endDate: end,
      isActive,
      daysRemaining,
      progressPercent,
      isSavyaSign: SAVYA_SIGNS.includes(signNum),
      isGkSign: gk ? gk.signNum === signNum : false,
      isDkSign: dk ? dk.signNum === signNum : false,
      isAkSign: ak ? ak.signNum === signNum : false,
      isAmkSign: amk ? amk.signNum === signNum : false,
    });
    cursor = end;
  }
  return periods;
}

// ── Chara Dasha Antardasha ────────────────────────────────────────────────────

export function calculateCharaDashaAD(
  mdPeriod: CharaDashaPeriod,
  chart: ChartData
): CharaDashaAD[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const { isDirect } = getCharaDashaDirection(lagnaNum);
  const adYears = mdPeriod.years / 12;
  const now = new Date();
  const ads: CharaDashaAD[] = [];
  let cursor = new Date(mdPeriod.startDate);

  for (let i = 0; i < 12; i++) {
    const adSignNum = isDirect
      ? md(mdPeriod.signNum + i, 12)
      : md(mdPeriod.signNum - i, 12);

    const adStart = new Date(cursor);
    const adEnd = new Date(cursor.getTime() + adYears * 365.25 * 24 * 3600 * 1000);
    const isActive = now >= adStart && now < adEnd;
    const totalMs = adEnd.getTime() - adStart.getTime();
    const elapsedMs = now.getTime() - adStart.getTime();
    const daysRemaining = Math.max(0, Math.ceil((adEnd.getTime() - now.getTime()) / 86400000));
    const progressPercent = isActive
      ? Number(Math.min(100, (elapsedMs / totalMs) * 100).toFixed(1))
      : now >= adEnd ? 100 : 0;

    ads.push({
      mdSign: mdPeriod.sign,
      mdSignNum: mdPeriod.signNum,
      adSign: RASHIS[adSignNum],
      adSignNum,
      years: Number(adYears.toFixed(2)),
      startDate: adStart,
      endDate: adEnd,
      isActive,
      daysRemaining,
      progressPercent,
    });
    cursor = new Date(adEnd);
  }
  return ads;
}

// ── Karakamsha Kundali (D9 Navamsha Base — Transcript Correct Method) ─────────

export function calculateKarakamsha(
  chart: ChartData,
  karakas: Karaka[]
): KarakamshaKundali {
  const ak = karakas.find(k => k.role === "AK") ?? karakas[0];
  const akLon = chart.planets[ak.planet]?.lon ?? (ak.signNum * 30 + ak.degreeInSign);

  // STEP 1 & 2: Identify AK planet in D1, then find its D9 (Navamsha) sign
  const d9SignNum = getNavamshaSignNum(akLon);
  const d9Sign = RASHIS[d9SignNum];

  // STEP 3: Make the D9 sign of AK the Karakamsha Lagna
  const karakamshaLagna = d9Sign;
  const karakamshaLagnaNum = d9SignNum;

  // STEP 4 & 5: D1 chart planets remain in their natal signs!
  // Houses 1 to 12 are counted from Karakamsha Lagna (d9SignNum)
  function planetsInD1Sign(sNum: number): string[] {
    const normalized = md(sNum, 12);
    return ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].filter(p => {
      const data = chart.planets[p];
      if (!data) return false;
      return Math.floor(md(data.lon, 360) / 30) === normalized;
    });
  }

  const THEMES: Record<number, { theme: string; significance: string }> = {
    1:  { theme: "Soul Character & Atma Swabhava", significance: "Inherent spiritual identity, physical vitality, self-respect and willpower" },
    2:  { theme: "Source of Wealth & Family Culture", significance: "Speech quality, financial accumulation, inherited mindset and resources" },
    3:  { theme: "Courage, Skills & Initiatives", significance: "Artistic/technical skills, younger siblings, marketing ability, short travels" },
    4:  { theme: "Inner Peace & Domestic Roots", significance: "Mother, real estate, emotional tranquility, mental peace and luxury" },
    5:  { theme: "Intellect, Disciples & Purva Punya", significance: "Sharp intellect, advisory role, children, past life merit and mantra siddhi" },
    6:  { theme: "Karmic Hurdles & Healing Capacity", significance: "Enemies, debts, chronic vulnerabilities, litigation, and service capacity" },
    7:  { theme: "Spouse Persona & Partnerships", significance: "Spouse nature, business alliances, marital bond, and public dealings" },
    8:  { theme: "Occult Depth & Transformations", significance: "Longevity, research ability, sudden events, deep spiritual introspection" },
    9:  { theme: "Dharma, Divine Grace & Guru", significance: "Higher philosophy, teachers, divine blessings, pilgrimage, and fortune" },
    10: { theme: "Worldly Authority & Career Zenith", significance: "Professional authority, highest worldly deeds, status and social impact" },
    11: { theme: "Major Gains & Life Fulfillment", significance: "Elder siblings, financial prosperity, realization of life desires" },
    12: { theme: "Moksha & Spiritual Solitude", significance: "Moksha orientation, charity, foreign connections, and spiritual detachment" },
  };

  const houses: KarakamshaHouse[] = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const signNum = md(karakamshaLagnaNum + i, 12);
    const occupants = planetsInD1Sign(signNum);
    const meta = THEMES[h];
    return {
      house: h,
      sign: RASHIS[signNum],
      signNum,
      planets: occupants,
      theme: meta.theme,
      significance: meta.significance,
    };
  });

  const akAttr = AK_SOUL_ATTRIBUTES[ak.planet] ?? { quality: "Soul Focus", description: "Spiritual development" };
  const h2Planets = houses[1].planets;
  const h7Planets = houses[6].planets;
  const h10Planets = houses[9].planets;

  const wealthSource = h2Planets.length > 0
    ? `Wealth generated through ${h2Planets.join(", ")} significations placed in 2nd from Karakamsha (${houses[1].sign}).`
    : `Wealth governed by ${JAIMINI_LORD[houses[1].signNum]} ruling the 2nd from Karakamsha.`;

  const spousePersona = h7Planets.length > 0
    ? `Spouse characteristics influenced by ${h7Planets.join(", ")} in 7th from Karakamsha (${houses[6].sign}).`
    : `Spouse dynamic shaped by ${houses[6].sign} in 7th from Karakamsha.`;

  const careerDestiny = h10Planets.length > 0
    ? `Career zenith anchored by ${h10Planets.join(", ")} occupying 10th from Karakamsha (${houses[9].sign}).`
    : `Professional authority steered by ${JAIMINI_LORD[houses[9].signNum]} presiding over 10th from Karakamsha.`;

  return {
    akPlanet: ak.planet,
    akSign: ak.sign,
    akSignNum: ak.signNum,
    d9Sign,
    d9SignNum,
    karakamshaLagna,
    karakamshaLagnaNum,
    method: "D9 Navamsha Base (Classical Jaimini Correct)",
    houses,
    staticAnalysis: {
      soulPurpose: `${ak.planet} (D9 in ${d9Sign}) establishes Karakamsha Lagna: ${akAttr.quality}. ${akAttr.description}`,
      wealthSource,
      familyNature: `Family foundations and domestic roots governed by ${houses[3].sign} (4th from Karakamsha) with ${houses[3].planets.length ? houses[3].planets.join(", ") : "peaceful vacancy"}.`,
      spousePersona,
      careerDestiny,
      lifeChallenges: `Karmic friction points reflected in 6th & 8th from Karakamsha (${houses[5].sign} & ${houses[7].sign}).`,
    },
  };
}

// ── GK Deep Analysis & Aspect Mapping ─────────────────────────────────────────

export function evaluateGkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  charaDasha: CharaDashaPeriod[]
): GkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const gk = karakas.find(k => k.role === "GK") ?? karakas[5];
  const gkHouse = md(gk.signNum - lagnaNum, 12) + 1;

  // RULE C: GK = Lagna Lord Rule
  const lagnaLord = JAIMINI_LORD[lagnaNum];
  const isGkLagnaLord = gk.planet === lagnaLord;
  let gkLagnaLordDiagnosis: string | undefined;
  if (isGkLagnaLord) {
    gkLagnaLordDiagnosis = `CRITICAL: GK IS THE LAGNA LORD (${gk.planet})! In Jaimini, when GK rules Lagna, lifelong vulnerability affects physical health, personal identity, and emotional stamina. Lifelong remediation (mantra and daan) for ${gk.planet} is essential.`;
  }

  const houseProblem = GK_HOUSE_PROBLEMS[gkHouse] ?? "General obstacles and testing period";
  const diseases = GK_PLANET_DISEASES[gk.planet] ?? ["Health vulnerability and fatigue"];
  const remedies = GK_PLANET_REMEDIES[gk.planet] ?? ["Regular prayer and charity on suitable day"];

  // RULE B & I: GK Aspect Analysis (Adjacent Sign Rule & Affected Planets)
  const GK_PLANET_EFFECTS: Record<string, string> = {
    Moon: "Mental stress, mood instability, insomnia & emotional vulnerability",
    Sun: "False allegations, character loss, friction with father or authority",
    Mars: "Accident risk, high BP, surgical vulnerability, muscular injury",
    Jupiter: "Liver or metabolic stress, wrong financial decisions, guru friction",
    Venus: "Financial drain, marital friction, sensory indulgence traps",
    Saturn: "Career obstacles, worker deception, severe joint/knee pain",
    Mercury: "Memory lapses, speech confusion, nervous tension",
  };

  const afflictedPlanets: GkAfflictedPlanet[] = [];
  const GRAHA = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  for (const p of GRAHA) {
    if (p === gk.planet || !chart.planets[p]) continue;
    const pSignNum = Math.floor(md(chart.planets[p].lon, 360) / 30);
    const pHouse = md(pSignNum - lagnaNum, 12) + 1;
    const isAdjacent = isAdjacentSign(gk.signNum, pSignNum);

    if (isAdjacent) {
      // Protected by adjacent sign rule
      afflictedPlanets.push({
        planet: p,
        sign: RASHIS[pSignNum],
        signNum: pSignNum,
        houseFromLagna: pHouse,
        isAdjacentProtected: true,
        effect: `Protected by Adjacent Sign Rule — GK in ${gk.sign} does not cast aspect on adjacent sign ${RASHIS[pSignNum]}.`,
      });
    } else if (doesSignAspect(gk.signNum, pSignNum)) {
      // Truly aspected by GK
      afflictedPlanets.push({
        planet: p,
        sign: RASHIS[pSignNum],
        signNum: pSignNum,
        houseFromLagna: pHouse,
        isAdjacentProtected: false,
        effect: GK_PLANET_EFFECTS[p] ?? `Karmic friction and delays regarding ${p} significations`,
      });
    }
  }

  // House Afflictions by GK Rashi Drishti
  const afflictedHouses: GkAfflictedHouse[] = [];
  const KEY_HOUSE_NAMES: Record<number, string> = {
    2: "Wealth & Family Savings (Dhana Bhav) — wealth leakage and speech harshness",
    4: "Domestic Peace & Mother (Sukha Bhav) — home friction and property disputes",
    5: "Intellect & Children (Putra Bhav) — wrong investment decisions and progeny concerns",
    7: "Marriage & Partnerships (Jaya Bhav) — partnership friction and marital strain",
    10: "Career & Authority (Karma Bhav) — professional allegations and reputation challenges",
  };

  for (const [hStr, desc] of Object.entries(KEY_HOUSE_NAMES)) {
    const h = Number(hStr);
    const houseSignNum = md(lagnaNum + h - 1, 12);
    if (doesSignAspect(gk.signNum, houseSignNum) && !isAdjacentSign(gk.signNum, houseSignNum)) {
      afflictedHouses.push({
        house: h,
        sign: RASHIS[houseSignNum],
        signNum: houseSignNum,
        effect: desc,
      });
    }
  }

  // Dasha signs that activate GK: GK's own sign + signs that have Jaimini Rashi Drishti on GK's sign
  const aspectingSigns = JAIMINI_ASPECTS[gk.signNum] ?? [];
  const timingDashaSigns = [gk.sign, ...aspectingSigns.map(s => RASHIS[s])];

  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const isCurrentDashaAfflicted = Boolean(
    currentDasha && (currentDasha.signNum === gk.signNum || doesSignAspect(currentDasha.signNum, gk.signNum))
  );

  let activeDashaWarning: string | undefined;
  if (isCurrentDashaAfflicted && currentDasha) {
    activeDashaWarning = `CRITICAL JAIMINI WARNING: Active Chara Dasha (${currentDasha.sign}) ${
      currentDasha.signNum === gk.signNum ? "IS the Gnatikaraka (GK) sign" : "aspects the Gnatikaraka (GK) sign"
    }. GK represents problem, rog, karz, and obstacles. Watch for: ${houseProblem}. Follow the prescribed remedies immediately.`;
  }

  const crossVerificationNote = `In Jaimini, GK (${gk.planet} in H${gkHouse} / ${gk.sign}) acts as the karmic testing agent. Any Vimshottari Mahadasha/Antardasha involving 6th/8th/12th lords running parallel to this GK Chara Dasha will double the obstacle intensity.`;

  return {
    gkPlanet: gk.planet,
    gkSign: gk.sign,
    gkSignNum: gk.signNum,
    degreeInSign: gk.degreeInSign,
    gkHouseFromLagna: gkHouse,
    isGkLagnaLord,
    gkLagnaLordDiagnosis,
    houseProblem,
    diseases,
    remedies,
    afflictedPlanets,
    afflictedHouses,
    timingDashaSigns,
    isCurrentDashaAfflicted,
    activeDashaWarning,
    crossVerificationNote,
  };
}

// ── BK (Bhratrikaraka) Problem Evaluation ──────────────────────────────────────

export function evaluateBkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  gk: Karaka
): BkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const bk = karakas.find(k => k.role === "BK") ?? karakas[2];
  const bkHouse = md(bk.signNum - lagnaNum, 12) + 1;

  const isInDusthana = [6, 8, 12].includes(bkHouse);
  const isAfflictedByGk = doesSignAspect(gk.signNum, bk.signNum) && !isAdjacentSign(gk.signNum, bk.signNum);
  const isBkProblemActive = isInDusthana && isAfflictedByGk;

  let warning: string | undefined;
  if (isBkProblemActive) {
    warning = `BK AFFLICTION: Bhratrikaraka (${bk.planet}) is placed in House ${bkHouse} from Lagna and receives Jaimini aspect from GK (${gk.planet}). Watch out for sibling disputes, sudden loss of courage/initiative, shoulder/arm strains, and communication failures.`;
  }

  return {
    bkPlanet: bk.planet,
    bkSign: bk.sign,
    bkSignNum: bk.signNum,
    bkHouseFromLagna: bkHouse,
    isInDusthana,
    isAfflictedByGk,
    isBkProblemActive,
    warning,
  };
}

// ── DK Analysis & Marriage Timing ─────────────────────────────────────────────

export function evaluateDkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  charaDasha: CharaDashaPeriod[]
): DkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const dk = karakas.find(k => k.role === "DK") ?? karakas[6];
  const gk = karakas.find(k => k.role === "GK") ?? karakas[5];
  const dkHouse = md(dk.signNum - lagnaNum, 12) + 1;

  const personaMeta = DK_SPOUSE_PERSONAS[dk.planet] ?? {
    persona: "Supportive and committed life partner",
    traits: ["Devotion", "Partnership mindset", "Patience"],
  };

  // RULE K: DK in 6/12 or aspected by GK -> Marriage Obstacle
  const isInDusthana = [6, 12].includes(dkHouse);
  const isAspectedByGk = doesSignAspect(gk.signNum, dk.signNum) && !isAdjacentSign(gk.signNum, dk.signNum);
  const hasDkObstacle = isInDusthana || isAspectedByGk;

  let dkObstacleWarning: string | undefined;
  if (hasDkObstacle) {
    dkObstacleWarning = `DK CAUTION: Darakaraka (${dk.planet}) is in House ${dkHouse} from Lagna ${
      isAspectedByGk ? `and aspected by GK (${gk.planet})` : ""
    }. Indicates marital adjustments, delayed commitments, or partner health sensitivity requiring conscious patience and mutual understanding.`;
  }

  // Marriage timing signs in Jaimini Chara Dasha:
  // 1. DK sign
  // 2. 7th house sign from Lagna
  // 3. Signs aspecting DK
  const seventhHouseSignNum = md(lagnaNum + 6, 12);
  const aspectingDkSigns = JAIMINI_ASPECTS[dk.signNum] ?? [];
  const timingSignsSet = new Set([
    dk.sign,
    RASHIS[seventhHouseSignNum],
    ...aspectingDkSigns.map(s => RASHIS[s]),
  ]);
  const marriageTimingSigns = Array.from(timingSignsSet);

  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const isCurrentDashaMarriageWindow = Boolean(
    currentDasha && (currentDasha.signNum === dk.signNum || currentDasha.signNum === seventhHouseSignNum || doesSignAspect(currentDasha.signNum, dk.signNum))
  );

  const marriageTimingNote = isCurrentDashaMarriageWindow
    ? `Active Chara Dasha (${currentDasha?.sign}) directly activates Darakaraka (DK) or 7th house axis. This marks a high-probability marriage/relationship manifestation window.`
    : `Marriage and key partnership commitments will naturally align during Chara Dashas of: ${marriageTimingSigns.join(", ")}.`;

  return {
    dkPlanet: dk.planet,
    dkSign: dk.sign,
    dkSignNum: dk.signNum,
    degreeInSign: dk.degreeInSign,
    dkHouseFromLagna: dkHouse,
    spousePersona: personaMeta.persona,
    spouseTraits: personaMeta.traits,
    hasDkObstacle,
    dkObstacleWarning,
    marriageTimingSigns,
    isCurrentDashaMarriageWindow,
    marriageTimingNote,
  };
}

// ── AK & AmK Status & Pinnacle Rajayoga Detection ─────────────────────────────

export function evaluateAkAmkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  charaDasha: CharaDashaPeriod[]
): AkAmkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const ak = karakas.find(k => k.role === "AK") ?? karakas[0];
  const amk = karakas.find(k => k.role === "AmK") ?? karakas[1];
  const gk = karakas.find(k => k.role === "GK") ?? karakas[5];

  const akHouse = md(ak.signNum - lagnaNum, 12) + 1;
  const amkHouse = md(amk.signNum - lagnaNum, 12) + 1;

  const akStatus: AkAmkAnalysis["akStatus"] = [1, 10, 11].includes(akHouse)
    ? "Favorable (1/10/11)"
    : [8, 12].includes(akHouse)
    ? "Challenging (8/12)"
    : "Moderate";

  const amkStatus: AkAmkAnalysis["amkStatus"] = [1, 10, 11].includes(amkHouse)
    ? "Favorable (1/10/11)"
    : [6, 8, 12].includes(amkHouse)
    ? "Challenging (6/8/12)"
    : "Moderate";

  const akQuality = AK_SOUL_ATTRIBUTES[ak.planet]?.quality ?? "Soul Evolution";

  const CAREER_MAP: Record<string, string> = {
    Sun: "Governance, leadership, administration, high public standing",
    Moon: "Public dealing, hospitality, travel, psychological care, FMCG",
    Mars: "Engineering, defense/police, real estate, surgery, sports",
    Mercury: "Trading, IT, communications, analytical finance, media",
    Jupiter: "Advisory, legal, teaching, spiritual mentorship, banking",
    Venus: "Luxury trade, creative arts, media, high-end hospitality, design",
    Saturn: "Heavy industry, law enforcement, service sector, infrastructure",
  };

  const amkCareerField = CAREER_MAP[amk.planet] ?? "Professional vocation";

  const akFameTimingSigns = [ak.sign, ...JAIMINI_ASPECTS[ak.signNum].map(s => RASHIS[s])];
  const amkGrowthTimingSigns = [amk.sign, ...JAIMINI_ASPECTS[amk.signNum].map(s => RASHIS[s])];

  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const isCurrentDashaAk = Boolean(currentDasha && currentDasha.signNum === ak.signNum);
  const isCurrentDashaAmk = Boolean(currentDasha && currentDasha.signNum === amk.signNum);

  const akLifeSphere = AK_HOUSE_SPHERES[akHouse] ?? {
    title: `House ${akHouse} Karmic Focus`,
    focus: "Soul evolution centered in this house domain.",
    transcriptRule: "Life focus is anchored within this house.",
    evolutionArea: "Spiritual and worldly lessons.",
  };

  const amkWealthChannel = AMK_HOUSE_WEALTH_CHANNELS[amkHouse] ?? {
    source: `House ${amkHouse} Activities`,
    channel: "Wealth generated through house significations.",
    practicalField: "Vocational enterprise.",
  };

  const akPhysicalMentalTraits = AK_SOUL_ATTRIBUTES[ak.planet]?.traits ?? [];

  // RULE D: AK + AmK Pinnacle Rajayoga & Supreme Teacher Yoga
  const isConjunct = ak.signNum === amk.signNum;
  const isMutualAspect = doesSignAspect(ak.signNum, amk.signNum) || doesSignAspect(amk.signNum, ak.signNum);
  const isAuspiciousHouse = [1, 2, 4, 5, 7, 9, 10, 11].includes(akHouse) && [1, 2, 4, 5, 7, 9, 10, 11].includes(amkHouse);

  const isGkAspectingAk = doesSignAspect(gk.signNum, ak.signNum) && !isAdjacentSign(gk.signNum, ak.signNum);
  const isGkAspectingAmk = doesSignAspect(gk.signNum, amk.signNum) && !isAdjacentSign(gk.signNum, amk.signNum);
  const isGkAspectingRajayoga = isGkAspectingAk || isGkAspectingAmk;

  // Transcript Secret: Supreme Teacher / Saraswati Yoga
  // AK & AmK both in dual signs (Gemini 2, Virgo 5, Sagittarius 8, Pisces 11), both Retrograde, mutual aspect, untouched by GK
  const DUAL_SIGNS = [2, 5, 8, 11];
  const isAkInDual = DUAL_SIGNS.includes(ak.signNum);
  const isAmkInDual = DUAL_SIGNS.includes(amk.signNum);
  const isAkRetro = Boolean(chart.planets[ak.planet]?.isRetrograde);
  const isAmkRetro = Boolean(chart.planets[amk.planet]?.isRetrograde);
  const isSupremeTeacherYoga = isAkInDual && isAmkInDual && isAkRetro && isAmkRetro && !isGkAspectingRajayoga;

  const isRajayoga = (isConjunct || isMutualAspect) && isAuspiciousHouse;
  let rajayogaTier: AkAmkAnalysis["rajayogaTier"] = "None";
  let rajayogaDescription = "No AK-AmK Raja Yoga formation.";

  if (isSupremeTeacherYoga) {
    rajayogaTier = "Supreme Teacher Yoga";
    rajayogaDescription = `SUPREME TEACHER / SARASWATI RAJAYOGA (Transcript Secret): AK (${ak.planet}) and AmK (${amk.planet}) are BOTH in Dual Signs (${ak.sign} & ${amk.sign}), BOTH are Retrograde, mutually aspecting, and completely untouched by GK. Transcript declares: 'Aap jaisa teacher/guru koi nahi hoga'. Unmatched encyclopedic depth of knowledge, effortless ability to explain complex truths simply, and immense prosperity earned purely through wisdom and teaching.`;
  } else if (isRajayoga) {
    if (!isGkAspectingRajayoga) {
      rajayogaTier = "Pinnacle Unblemished";
      rajayogaDescription = `AK (${ak.planet}) and AmK (${amk.planet}) form a Pinnacle Jaimini Raja Yoga completely unblemished by GK. During their Chara Dashas, authority, high public recognition, and extraordinary financial growth are indicated.`;
    } else {
      rajayogaTier = "Afflicted";
      rajayogaDescription = `AK (${ak.planet}) and AmK (${amk.planet}) form a powerful Raja Yoga, but GK (${gk.planet}) casts an aspect. High achievements will be accompanied by tests, jealousy, and administrative hurdles.`;
    }
  }

  return {
    akPlanet: ak.planet,
    akSign: ak.sign,
    akSignNum: ak.signNum,
    akHouseFromLagna: akHouse,
    akStatus,
    akQuality,
    akPhysicalMentalTraits,
    akLifeSphere,
    akFameTimingSigns,
    isCurrentDashaAk,
    amkPlanet: amk.planet,
    amkSign: amk.sign,
    amkSignNum: amk.signNum,
    amkHouseFromLagna: amkHouse,
    amkStatus,
    amkCareerField,
    amkWealthChannel,
    amkGrowthTimingSigns,
    isCurrentDashaAmk,
    isRajayoga: isRajayoga || isSupremeTeacherYoga,
    isGkAspectingRajayoga,
    isSupremeTeacherYoga,
    rajayogaTier,
    rajayogaDescription,
  };
}

// ── Retrograde Activation Evaluation ──────────────────────────────────────────

export function evaluateRetrogrades(chart: ChartData): RetrogradePlanetInfo[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const RETRO_GUIDANCE: Record<string, string> = {
    Mercury: "Super intelligent, exceptional analytical depth, but intellect lies dormant until stimulated. Activate through writing, debates, complex analysis, and commerce.",
    Jupiter: "Vast reservoir of intuitive wisdom and dharmic understanding. Activate by mentoring others, teaching, reading sacred literature, and offering solutions.",
    Mars: "Extraordinary internal physical energy and courage. Activate through rigorous athletic routine, gym, martial arts, and decisive leadership.",
    Saturn: "Immense karmic endurance and structural discipline. Activate through strict daily routines, discipline, and selfless service to workers.",
    Venus: "Refined aesthetic brilliance and artistic potential. Activate through creative arts, music, design, and elevating relationships.",
  };

  const results: RetrogradePlanetInfo[] = [];
  const GRAHA = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  for (const p of GRAHA) {
    const data = chart.planets[p];
    if (data?.isRetrograde) {
      const pSignNum = Math.floor(md(data.lon, 360) / 30);
      const pHouse = md(pSignNum - lagnaNum, 12) + 1;
      results.push({
        planet: p,
        sign: RASHIS[pSignNum],
        signNum: pSignNum,
        houseFromLagna: pHouse,
        activationStatus: "Requires Activation",
        guidance: RETRO_GUIDANCE[p] ?? "Planet possesses intensified latent power requiring conscious expression.",
      });
    }
  }

  return results;
}

// ── Special Findings ──────────────────────────────────────────────────────────

export function getJaiminiFindings(
  karakas: Karaka[],
  arudhas: ArudhaPada[],
  chart: ChartData
): string[] {
  const findings: string[] = [];
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const ak = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");
  const gk = karakas.find(k => k.role === "GK");
  const dk = karakas.find(k => k.role === "DK");
  const al = arudhas.find(a => a.house === 1);
  const a7 = arudhas.find(a => a.house === 7);
  const a10 = arudhas.find(a => a.house === 10);
  const ul = arudhas.find(a => a.house === 12);

  const EXALTATION: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  const OWN_SIGNS: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
  };

  if (ak) {
    if (EXALTATION[ak.planet] === ak.signNum)
      findings.push(`${ak.planet} (Atmakaraka) is exalted in ${ak.sign} — exceptional soul strength and spiritual clarity.`);
    if (OWN_SIGNS[ak.planet]?.includes(ak.signNum))
      findings.push(`${ak.planet} (Atmakaraka) in own sign — the soul path is firmly supported.`);
    if (ak.signNum === md(lagnaNum + 6, 12))
      findings.push("Atmakaraka in 7th from Lagna — Jaimini Rajayoga; soul purpose unfolds through partnerships.");
    if (amk && ak.signNum === amk.signNum)
      findings.push("AK and AmK in the same sign — career aligns directly with soul purpose (Jaimini Raja Yoga).");
  }

  if (gk) {
    const gkHouse = md(gk.signNum - lagnaNum, 12) + 1;
    findings.push(`Gnatikaraka (GK) is ${gk.planet} in House ${gkHouse} (${gk.sign}) — primary karmic obstacle indicator requiring targeted remedies.`);
  }

  if (dk) {
    findings.push(`Darakaraka (DK) is ${dk.planet} in ${dk.sign} — marriage manifestation activates during ${dk.sign} Chara Dasha.`);
  }

  if (al && a10) {
    if (al.signNum === a10.signNum)
      findings.push("AL and A10 conjunct — public identity and career authority merge powerfully.");
    else if (doesSignAspect(al.signNum, a10.signNum) || doesSignAspect(a10.signNum, al.signNum))
      findings.push("AL aspects A10 — public persona strongly supports career visibility.");
  }

  if (a7 && ul && a7.signNum === ul.signNum)
    findings.push("Darapada (A7) and Upapada Lagna (UL) in same sign — destined, lasting partnership.");

  const alOffset = al ? md(al.signNum - lagnaNum, 12) : -1;
  if ([0, 3, 6, 9, 4, 8].includes(alOffset))
    findings.push("Arudha Lagna in kendra or trikona from Lagna — strong public presence and social influence.");

  return findings;
}

// ── Jaimini Raja Yogas ────────────────────────────────────────────────────────

export function detectJaiminiRajaYogas(
  karakas: Karaka[],
  arudhas: ArudhaPada[],
  chart: ChartData
): JaiminiRajaYoga[] {
  const yogas: JaiminiRajaYoga[] = [];
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);

  const EXALTATION: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
  };
  const OWN_SIGNS: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
    Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
  };

  const ak  = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");
  const pk  = karakas.find(k => k.role === "PK");
  const al  = arudhas.find(a => a.house === 1);
  const a10 = arudhas.find(a => a.house === 10);
  const ul  = arudhas.find(a => a.house === 12);
  const a7  = arudhas.find(a => a.house === 7);

  if (ak && amk && ak.signNum === amk.signNum) {
    yogas.push({
      name: "AK-AmK Conjunction",
      description: `${ak.planet} (Atmakaraka) and ${amk.planet} (Amatyakaraka) are in the same sign ${ak.sign}. This is the pinnacle Jaimini Raja Yoga — soul purpose aligns directly with career and worldly success. Exceptional achievement is indicated.`,
      strength: "Strong",
      involved: [ak.planet, amk.planet],
    });
  }

  if (ak && amk && ak.signNum !== amk.signNum &&
    (doesSignAspect(ak.signNum, amk.signNum) || doesSignAspect(amk.signNum, ak.signNum))) {
    yogas.push({
      name: "AK-AmK Mutual Aspect",
      description: `${ak.planet} (AK) and ${amk.planet} (AmK) have mutual Jaimini aspect between ${ak.sign} and ${amk.sign}. Career and soul purpose support each other — authority and recognition come through dharmic work.`,
      strength: "Moderate",
      involved: [ak.planet, amk.planet],
    });
  }

  if (ak && EXALTATION[ak.planet] === ak.signNum) {
    yogas.push({
      name: "Exalted Atmakaraka",
      description: `${ak.planet} (Atmakaraka) is exalted in ${ak.sign}. The soul has extraordinary clarity of purpose. High status and recognition in life.`,
      strength: "Strong",
      involved: [ak.planet],
    });
  }

  if (ak && OWN_SIGNS[ak.planet]?.includes(ak.signNum)) {
    yogas.push({
      name: "AK in Own Sign",
      description: `${ak.planet} (Atmakaraka) is in own sign ${ak.sign}. Soul path is confident and self-directed. Success through authenticity.`,
      strength: "Moderate",
      involved: [ak.planet],
    });
  }

  if (amk) {
    const amkHouseFromLagna = md(amk.signNum - lagnaNum, 12) + 1;
    if ([1, 10].includes(amkHouseFromLagna)) {
      yogas.push({
        name: "AmK in Power Position",
        description: `${amk.planet} (Amatyakaraka) is in H${amkHouseFromLagna} from Lagna — a cardinal house for career. Professional success and public recognition are strongly supported.`,
        strength: "Strong",
        involved: [amk.planet],
      });
    }
  }

  if (al && a10) {
    if (al.signNum === a10.signNum) {
      yogas.push({
        name: "AL-A10 Conjunction",
        description: `Arudha Lagna (AL) and Rajya Pada (A10) are in the same sign ${al.sign}. Public image and career power merge — public authority and recognition.`,
        strength: "Strong",
        involved: ["AL", "A10"],
      });
    } else if (doesSignAspect(al.signNum, a10.signNum) || doesSignAspect(a10.signNum, al.signNum)) {
      yogas.push({
        name: "AL aspects A10",
        description: `Arudha Lagna (${al.sign}) and Rajya Pada A10 (${a10.sign}) are in mutual Jaimini aspect. Public identity and career authority reinforce each other.`,
        strength: "Moderate",
        involved: ["AL", "A10"],
      });
    }
  }

  if (ak) {
    const akFromLagna = md(ak.signNum - lagnaNum, 12) + 1;
    if (akFromLagna === 5) {
      yogas.push({
        name: "AK in 5th (Jaimini RY)",
        description: `${ak.planet} (Atmakaraka) is in the 5th from Lagna. Jaimini specifically marks this as a Raja Yoga — the soul purpose operates through intelligence, creativity, and past life merits.`,
        strength: "Moderate",
        involved: [ak.planet],
      });
    }
  }

  if (ul && a7 && ul.signNum === a7.signNum) {
    yogas.push({
      name: "UL-A7 Conjunction",
      description: `Upapada Lagna (UL) and Darapada (A7) are in the same sign ${ul.sign}. Marriage is both destined and publicly visible — spouse brings status.`,
      strength: "Strong",
      involved: ["UL", "A7"],
    });
  }

  if (pk && (EXALTATION[pk.planet] === pk.signNum || OWN_SIGNS[pk.planet]?.includes(pk.signNum))) {
    yogas.push({
      name: "Strong Putrakaraka",
      description: `${pk.planet} (Putrakaraka) is in ${pk.sign} — ${EXALTATION[pk.planet] === pk.signNum ? "exalted" : "own sign"}. High intelligence, creative foresight, and blessings through progeny.`,
      strength: "Moderate",
      involved: [pk.planet],
    });
  }

  return yogas;
}

// ── Argala (Planetary Interventions) ─────────────────────────────────────────

export function calculateArgala(chart: ChartData): ArgalaEntry[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);

  function planetsInSign(signNum: number): string[] {
    const normalizedSign = md(signNum, 12);
    return ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]
      .filter(p => {
        const pData = chart.planets[p];
        if (!pData) return false;
        return Math.floor(md(pData.lon, 360) / 30) === normalizedSign;
      });
  }

  const ARGALA_OFFSETS: { offset: number; type: "Argala" | "VirodhArgala"; position: string }[] = [
    { offset: 1,  type: "Argala",       position: "2nd" },
    { offset: 3,  type: "Argala",       position: "4th" },
    { offset: 10, type: "Argala",       position: "11th" },
    { offset: 11, type: "VirodhArgala", position: "12th" },
    { offset: 9,  type: "VirodhArgala", position: "10th" },
    { offset: 2,  type: "VirodhArgala", position: "3rd" },
  ];

  const karakas = calculateKarakas(chart.planets);
  const akSignNum = karakas.find(k => k.role === "AK")?.signNum ?? lagnaNum;

  const referencePoints = [
    { sign: RASHIS[lagnaNum], signNum: lagnaNum },
    { sign: RASHIS[akSignNum], signNum: akSignNum },
  ];

  return referencePoints.map(ref => {
    const argalaHouses = ARGALA_OFFSETS.map(ao => ({
      position: ao.position,
      planets: planetsInSign(ref.signNum + ao.offset),
      type: ao.type,
    }));

    const argalaCount   = argalaHouses.filter(h => h.type === "Argala" && h.planets.length > 0).length;
    const virodhCount   = argalaHouses.filter(h => h.type === "VirodhArgala" && h.planets.length > 0).length;
    const argalaPlanets = argalaHouses.filter(h => h.type === "Argala").flatMap(h => h.planets);
    const virodhPlanets = argalaHouses.filter(h => h.type === "VirodhArgala").flatMap(h => h.planets);

    const netArgala: ArgalaEntry["netArgala"] =
      argalaCount > virodhCount ? "Positive" :
      virodhCount > argalaCount ? "Negative" : "Neutral";

    const interpretation = netArgala === "Positive"
      ? `${ref.sign} receives Argala support from ${argalaPlanets.join(", ")} in key positions. Events and people naturally help the significations of this reference point forward.`
      : netArgala === "Negative"
      ? `${ref.sign} faces Virodha Argala — ${virodhPlanets.join(", ")} in counteractive positions resist or delay outcomes. External resistance needs to be worked through.`
      : `${ref.sign} has balanced Argala and Virodha — support and resistance are roughly equal. Outcomes depend on timing, remedies, and personal effort.`;

    return {
      referenceSign: ref.sign,
      referenceSignNum: ref.signNum,
      argalaHouses,
      netArgala,
      interpretation,
    };
  });
}

// ── Master Function (Layer 4 Foundation) ──────────────────────────────────────

export function buildJaiminiChart(chart: ChartData): JaiminiResult {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const karakas = calculateKarakas(chart.planets);
  const arudhas = calculateArudhas(chart);
  const aspects = getJaiminiAspects();

  const { direction, reason: directionReason } = getCharaDashaDirection(lagnaNum);
  const charaDasha = calculateCharaDasha(chart, karakas);
  const currentDasha = charaDasha.find(d => d.isActive) ?? null;

  const mdForAD = currentDasha ?? charaDasha[0];
  const currentDashaAD = mdForAD ? calculateCharaDashaAD(mdForAD, chart) : [];
  const activeAD = currentDashaAD.find(d => d.isActive) ?? null;

  const rajaYogas = detectJaiminiRajaYogas(karakas, arudhas, chart);
  const argala = calculateArgala(chart);
  const specialFindings = getJaiminiFindings(karakas, arudhas, chart);

  const karakamsha = calculateKarakamsha(chart, karakas);
  const gkAnalysis = evaluateGkAnalysis(chart, karakas, charaDasha);
  const gkKaraka = karakas.find(k => k.role === "GK") ?? karakas[5];
  const bkAnalysis = evaluateBkAnalysis(chart, karakas, gkKaraka);
  const dkAnalysis = evaluateDkAnalysis(chart, karakas, charaDasha);
  const akAmkAnalysis = evaluateAkAmkAnalysis(chart, karakas, charaDasha);
  const retrogradeActivation = evaluateRetrogrades(chart);

  return {
    karakas,
    arudhas,
    aspects,
    charaDasha,
    currentDasha,
    currentDashaAD,
    activeAD,
    rajaYogas,
    argala,
    specialFindings,
    direction,
    directionReason,
    karakamsha,
    gkAnalysis,
    bkAnalysis,
    dkAnalysis,
    akAmkAnalysis,
    retrogradeActivation,
  };
}

export function formatCharaDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function formatCharaDaysRemaining(days: number): string {
  if (days <= 0) return "Ended";
  if (days < 365) return `${days}d left`;
  const yrs = Math.floor(days / 365);
  const rem = days % 365;
  return rem > 30 ? `${yrs}y ${Math.floor(rem / 30)}m left` : `${yrs}y left`;
}
