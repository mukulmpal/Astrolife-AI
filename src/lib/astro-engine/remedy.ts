// ============================================================
// ASTROLIFE REMEDY ENGINE v1.0
// Vedic planetary remedies — gems, mantras, donations, practices
// Data sourced from classical Jyotish tradition
// ============================================================

import type { ChartData } from "./calculations";

// ── Planetary remedy data ─────────────────────────────────────
const RDATA: Record<string, { gem: string; mantra: string; donate: string; practice: string; color: string }> = {
  Sun: {
    gem: "Ruby / Red Garnet",
    mantra: "Om Hram Hreem Hraum Sah Suryaya Namah (108x Sunday)",
    donate: "Wheat, jaggery, copper to fathers/Sunday",
    practice: "Offer water to rising Sun daily",
    color: "Red, Copper, Gold",
  },
  Moon: {
    gem: "Pearl / Moonstone",
    mantra: "Om Shram Shreem Shraum Sah Chandraya Namah (Monday)",
    donate: "Milk, rice, silver to women Monday",
    practice: "Wear silver. Keep water pot in bedroom.",
    color: "White, Silver",
  },
  Mars: {
    gem: "Red Coral",
    mantra: "Om Kram Kreem Kraum Sah Bhaumaya Namah (Tuesday)",
    donate: "Red masoor dal, blood donation Tuesday",
    practice: "Plant neem/peepal. Good relations with brothers.",
    color: "Red, Orange",
  },
  Mercury: {
    gem: "Emerald / Green Tourmaline",
    mantra: "Om Bram Breem Braum Sah Budhaya Namah (Wednesday)",
    donate: "Green cloth, moong dal Wednesday",
    practice: "Feed green fodder to cows. Care for maternal aunt.",
    color: "Green",
  },
  Jupiter: {
    gem: "Yellow Sapphire / Citrine",
    mantra: "Om Gram Greem Graum Sah Gurave Namah (Thursday)",
    donate: "Yellow cloth, turmeric, banana Thursday",
    practice: "Apply saffron tilak. Touch feet of elders.",
    color: "Yellow, Gold",
  },
  Venus: {
    gem: "Diamond / White Sapphire",
    mantra: "Om Dram Dreem Draum Sah Shukraya Namah (Friday)",
    donate: "White rice, sugar, silver to women Friday",
    practice: "Keep/feed white cow. Respect all women.",
    color: "White, Pink",
  },
  Saturn: {
    gem: "Blue Sapphire / Amethyst",
    mantra: "Om Pram Preem Praum Sah Shanaischaraya Namah (Saturday)",
    donate: "Mustard oil, iron, black sesame Saturday",
    practice: "Feed crows and dogs. Donate to poor.",
    color: "Black, Blue, Purple",
  },
  Rahu: {
    gem: "Hessonite (Gomed)",
    mantra: "Om Bhram Bhreem Bhraum Sah Rahave Namah",
    donate: "Lead, coal, dark items Saturday",
    practice: "Keep lead piece at home. Avoid false promises.",
    color: "Smoky, Dark Blue",
  },
  Ketu: {
    gem: "Cat's Eye (Chrysoberyl)",
    mantra: "Om Shram Shreem Shraum Sah Ketave Namah",
    donate: "Black+white blanket Saturday",
    practice: "Feed dogs daily. Respect spiritual teachers.",
    color: "Multicolour",
  },
};

// ── House-specific remedies ───────────────────────────────────
const HOUSE_REMEDY: Record<string, Record<number, string>> = {
  Sun: {
    1: "Offer water to rising Sun daily at sunrise. Copper vessel use karein. Wheat aur gur ka daan karein Ravivar ko.",
    2: "Gur (jaggery) aur gehu ka daan Ravivar. Father ke saath achha vyavhar. Gold jwellery wear karein.",
    3: "Red cloth aur coral donate Mangalvar ko. Siblings ke saath good relations. Short pilgrimage karein.",
    4: "Govt property ke liye Sun mantra karein. Mother ko respect dein. Heart health dhyan rakhein.",
    5: "Santan ke liye Sun mantra 108 times Sunday. Gold ka tilak Ravivar ko. Aaditya Hridayam padhein.",
    6: "Surya namaskar 12 times daily. Enemies naturally defeated. Govt service mein rise. Continue seva.",
    7: "Husband/wife ko respect dein. Partnership mein ego control. Sun mantra for business partnership.",
    8: "Navagraha pooja specifically for Sun. Avoid ego in occult. Father health dhyan rakhein.",
    9: "Sarvottam placement. Surya pooja maintain karein. Pilgrimage to Sun temples. Father ko guru maanein.",
    10: "Ravivar vrat rakhein. Govt job ke liye Sun kavach. Daily surya arghya. Career success guaranteed.",
    11: "Income ke liye copper coin dariya mein pravahit karein. Social connections maintain karein.",
    12: "Aditya Hridayam for foreign success. Left eye dhyan. Spiritual retreat Ravivar ko karein.",
  },
  Moon: {
    1: "Silver ring wear karein. Water pot bedroom mein rakhein. Mother se blessings lein. Monday vrat.",
    2: "Silver utensils se khana khayein mother ke paise se kharide. Family mein milk/kheer offer karein.",
    3: "Siblings ke liye white cloth donate. Moonday evening meditation. Silver bracelet wear karein.",
    4: "4th Moon excellent! Maintain ghar ki saaf-safai. Shiv-Parvati pooja. Jasmine flowers at home.",
    5: "Children ke liye pearl wear karein. Purnima vrat rakhein. Moonlight meditation karein.",
    6: "Health ke liye Monday fast. Milk aur chawal donate. Shiva temple Monday ko visit karein.",
    7: "Spouse ke liye pearl gifting. Business mein women partners helpful. White flowers wear karein.",
    8: "Occult ke liye Chandra kavach. Mother health mantra. Inherited property ke liye Moon pooja.",
    9: "Dharma Moon excellent! Pilgrimage near rivers. Mother ko regular daan dein. Purnima pooja.",
    10: "Public career ke liye Chandra mantra. Silver pada daan. Hospital/public sector mein seva karein.",
    11: "Income ke liye silver coin river mein pravahit karein Purnima ko. Social popularity maintain.",
    12: "Foreign success ke liye Chandra stotra. Spiritual retreat near water. Silver donate to blind.",
  },
  Mars: {
    1: "Mangal dosh ke liye Hanuman Chalisa Mangalvar ko 108 times. Red coral wear karein. Blood donate.",
    2: "Family disputes ke liye Hanuman mantra. Masoor ki dal donate Mangalvar. Brothers ka sahyog lein.",
    3: "3rd Mars excellent! Courage maintain karein. Red flag at entrance. Sports activities continue.",
    4: "Property disputes ke liye Bhoomi pooja karein. Mother health red coral se. Agriculture productive.",
    5: "Children ke liye Mars mantra Mangalvar. Sports coaching. Red coral for speculation protection.",
    6: "BEST! Continue everything. Win streak maintain. Red masoor daal daily donate. All enemies defeated.",
    7: "Spouse ke saath patience. Mangal dosh pooja. Joint business mein legal clarity rakhein.",
    8: "Accidents se bachne ke liye Hanuman Chalisa daily. Surgery ke liye Mars mantra. Safety first.",
    9: "Dharma warrior — Hanuman ji ki seva. Pilgrimage on foot. Fortune through courage.",
    10: "Career Mars excellent. Red uniform/attire in career. Mangalvar ko workplace pooja karein.",
    11: "Gains ke liye red cloth donate Mangalvar. Elder siblings se sambandh. Competitive spirit.",
    12: "Foreign Mangalvar mantra jaap. Hidden enemies ke liye Mars kavach. Energy channelize karein.",
  },
  Mercury: {
    1: "Green cloth wear Budhvar. Emerald or green tourmaline. Moong ki dal donate. Intelligence peak.",
    2: "Business income ke liye Budh mantra. Family education mein invest. Multiple income streams.",
    3: "3rd Mercury best! Writing/media career. Behen-bhai ke saath good relations. Trade skill.",
    4: "Education ke liye Saraswati pooja. Home mein books rakho. Green plants at study table.",
    5: "Children ke liye Budh mantra. Writing career. Stock analysis skills develop karein.",
    6: "Service mein IT career. Respiratory health dhyan. Moong dal donate Budhvar to students.",
    7: "Business partner ke liye Budh mantra. Travel with spouse beneficial. Communication clarity.",
    8: "Research mein Mercury mantra. Occult writing. Communication in crisis stays clear.",
    9: "Higher education ke liye Saraswati vandana. International writing. Teaching dharma.",
    10: "IT/media career — Budh yantra. Mercury mantra 17000 times. Communication authority.",
    11: "Multiple income ke liye Budh stotra. Network in business. Gains through writing.",
    12: "Foreign work — Budh mantra before travel. Spiritual writing. Hidden business clarity.",
  },
  Jupiter: {
    1: "Yellow sapphire wear Guruvar. Banana + turmeric donate. Guru ke charan sparsh karein.",
    2: "Dhana Yoga maintain. Banana tree lagao. Jupiter mantra 16000 times for wealth. Guru daan.",
    3: "Writing on dharma. Publish books. Saffron tilak Guruvar. Guru ashirvad lein siblings ke liye.",
    4: "Home temple banana. Guru picture ghar mein rakho. Education environment maintain karein.",
    5: "Children ke liye Jupiter mantra. Yellow sweets distribute Guruvar. Speculation blessed.",
    6: "Jupiter 6th — thoda careful in health over-optimism. Guru mantra for realistic health view.",
    7: "Marriage ke liye Jupiter mantra. Wise partner mil sakta hai. Dharmic business partnerships.",
    8: "Protection ke liye Jupiter kavach. Occult mein guru ki raksha. Crisis mein guru smaran.",
    9: "BEST! Guru Brahaspati stotra daily. Pilgrimage to Pushkar, Varanasi. Guru seva karein.",
    10: "Career leadership ke liye Jupiter mantra. Yellow cloth Thursday. Authority through dharma.",
    11: "Maximum gains — Guru prasad distribute karein Guruvar. Social blessings. Desires fulfill.",
    12: "Spiritual abroad ke liye Jupiter mantra. Charitable giving. Guru dhyan in meditation.",
  },
  Venus: {
    1: "Diamond ya white sapphire. White/pink clothes Friday. Respect all women. Creative expression.",
    2: "Family wealth ke liye Venus mantra. Luxury at home invest. Silver utensils ke liye daan.",
    3: "Creative arts flourish. White flowers Friday. Siblings ke liye Venus mantra. Poetry likhein.",
    4: "Home beautiful banao. White lotus at home. Mother ke liye Venus mantra. Property gains.",
    5: "Romance ke liye Venus mantra. Diamond wear. Creative speculation. Love life blessed.",
    6: "Beauty treatments ke liye Friday fast. Kidney health dhyan. Service in beauty industry.",
    7: "BEST! Venus 7th marriage blessing. Diamond gifting to spouse. Friday pooja. Harmony maintain.",
    8: "Hidden pleasures ke liye Venus kavach. Occult arts mein Venus mantra. Inheritance through spouse.",
    9: "International arts ke liye Lakshmi puja. Beauty dharma. Arts abroad. Fortune through creativity.",
    10: "Arts career ke liye Venus mantra. White clothes professional. Entertainment industry success.",
    11: "Income ke liye Lakshmi mantra Friday. Social charm maintain. Arts income grows.",
    12: "Foreign arts ke liye Venus stotra. Luxury expenses control. Spiritual arts flourish.",
  },
  Saturn: {
    1: "Shani mantra Shanivar. Oil massage Saturday. Iron ring wear. Patience is key to success.",
    2: "Mustard oil lamp Saturday. Family ke liye Saturn mantra. Conservative saving habits maintain.",
    3: "Shani mantra for sibling karma. Long disciplined travels. Saturn Shani chalisa.",
    4: "Property delays ke liye Shani puja. Old property matters. Agriculture. Disciplined home.",
    5: "Children ke liye Shani mantra. Long-term investment only. Careful speculation. Education.",
    6: "BEST Saturn! Continue everything. Shanivar seva at temple. Win streak through discipline.",
    7: "Marriage karma ke liye Shani mantra. Patience with spouse. Saturn yantra for business.",
    8: "Longevity ke liye Shani stotra. Saturn 8th protects. Discipline in occult. Slow healing.",
    9: "Spiritual austerity ke liye Saturn mantra. Slow pilgrimage. Guru discipline maintain.",
    10: "Career ke liye Shani chalisa 19000 times. Government service. Authority through patience.",
    11: "Gradual gains ke liye Shani mantra. Mustard oil donate Saturday. Social through service.",
    12: "Liberation ke liye Saturn sadhana. Karma closure. Long periods of meditation. Seva.",
  },
  Rahu: {
    1: "Hessonite (gomed) wear. Coal/lead at home. Foreign connections maintain. Tech career.",
    2: "Foreign income ke liye Rahu mantra. Unusual family — accept it. Watch speech carefully.",
    3: "Rahu 3rd bold energy — channelize. Technology writing. Foreign media connections.",
    4: "Foreign property ke liye Rahu upay. Lead naag murti ghar mein rakho. Tech at home.",
    5: "Unusual children ke liye Rahu mantra. Risky speculation — control. Tech-based creativity.",
    6: "Foreign enemies strategy ke liye Rahu mantra. Confusion as weapon. Coal donate Saturday.",
    7: "Foreign spouse ke liye Rahu upay. International business. Lead piece in SW corner.",
    8: "Sudden events ke liye Rahu kavach. Occult — Rahu beej mantra. Hidden income manage.",
    9: "Foreign dharma ke liye Rahu mantra. International fortune. Technology in spiritual life.",
    10: "Sudden career rise — Rahu mantra. Technology career. Foreign career opportunities.",
    11: "Sudden gains ke liye Rahu stotra. Foreign income. Lead pipe in north direction.",
    12: "Foreign liberation ke liye Rahu beej mantra. Hidden activities abroad. Ashram life.",
  },
  Ketu: {
    1: "Cats eye wear. Feed dogs daily. Spiritual teachers ko respect. Detachment from ego.",
    2: "Family detachment ke liye Ketu mantra. Past wealth karma — do not hoard. Speak truth.",
    3: "Spiritual writing ke liye Ketu mantra. Past life courage emerges. Silent communication.",
    4: "Home spiritualization — meditation corner banao. Ketu yantra at home. Past property.",
    5: "Spiritual children ke liye Ketu mantra. Cats eye wear. Detach from speculation excess.",
    6: "Past service karma ke liye Ketu stotra. Alternative medicine. Dogs ko khana dein.",
    7: "Past life partner ke liye Ketu mantra. Spiritual business. Cats eye in silver.",
    8: "BEST Ketu! Moksha ke liye Ketu sadhana. Past occult skills. Spiritual transformation.",
    9: "Highest dharma — Ketu mantra. Past life guru emerges. Direct divine connection.",
    10: "Spiritual career ke liye Ketu upay. Past fame karma. Healer/astrologer path.",
    11: "Spiritual income ke liye Ketu mantra. Detach from gains. Dogs ko daily khana.",
    12: "MOKSHA! Ketu sadhana. Liberation closest. Spiritual retreat. Past karma dissolves.",
  },
};

// ── Exported types ────────────────────────────────────────────
export interface RemedyCard {
  planet: string;
  house: number;
  sign: string;
  nakshatra: string;
  status: string; // dignity from PlanetData
  isWeak: boolean;
  gem: string;
  mantra: string;
  donate: string;
  practice: string;
  color: string;
  houseRemedy: string;
  priority: "urgent" | "recommended" | "optional";
  summary: string;
}

export interface RemedyResult {
  cards: RemedyCard[];
  urgentCount: number;
  topPriority: RemedyCard | null;
}

// ── Benefic planets ───────────────────────────────────────────
const BENEFICS = new Set(["Moon", "Mercury", "Jupiter", "Venus"]);

// ── Helper: detect weakness ───────────────────────────────────
function detectWeak(house: number, dignity: string): boolean {
  if (house === 6 || house === 8 || house === 12) return true;
  const d = dignity.toLowerCase();
  if (d.includes("neecha") || d.includes("shatru") || d.includes("debilitated") || d.includes("enemy")) return true;
  return false;
}

// ── Helper: build one-line summary ───────────────────────────
function buildSummary(planet: string, house: number, sign: string, status: string): string {
  return `${planet} is placed in ${sign} in the ${house}${ordinal(house)} house — dignity: ${status}.`;
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

// ── Priority sort order ───────────────────────────────────────
const PRIORITY_ORDER: Record<RemedyCard["priority"], number> = {
  urgent: 0,
  recommended: 1,
  optional: 2,
};

// ── Main export ───────────────────────────────────────────────
export function calculateRemedies(chart: ChartData): RemedyResult {
  const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const cards: RemedyCard[] = [];

  for (const planet of PLANETS) {
    const pData = chart.planets[planet];
    if (!pData) continue;

    const house = pData.house ?? pData.bhavaHouse ?? 1;
    const sign = pData.sign ?? "Unknown";
    const nakshatra = pData.nakshatra ?? "Unknown";
    const dignity = pData.dignity ?? "Neutral";

    const isWeak = detectWeak(house, dignity);

    let priority: RemedyCard["priority"];
    if (isWeak) {
      priority = "urgent";
    } else if (BENEFICS.has(planet)) {
      priority = "recommended";
    } else {
      priority = "optional";
    }

    const rd = RDATA[planet];
    const houseRemedyMap = HOUSE_REMEDY[planet] ?? {};
    const houseRemedy =
      houseRemedyMap[house] ??
      `${planet} ke liye ${rd.mantra} jaap karein aur ${rd.donate}.`;

    const card: RemedyCard = {
      planet,
      house,
      sign,
      nakshatra,
      status: dignity,
      isWeak,
      gem: rd.gem,
      mantra: rd.mantra,
      donate: rd.donate,
      practice: rd.practice,
      color: rd.color,
      houseRemedy,
      priority,
      summary: buildSummary(planet, house, sign, dignity),
    };

    cards.push(card);
  }

  // Sort: urgent → recommended → optional
  cards.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const urgentCount = cards.filter((c) => c.priority === "urgent").length;
  const topPriority = cards.find((c) => c.priority === "urgent") ?? cards[0] ?? null;

  return { cards, urgentCount, topPriority };
}
