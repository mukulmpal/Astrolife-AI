import type { ChartData } from "./calculations";

const RDATA: Record<string, { gem: string; mantra: string; donate: string; practice: string; color: string }> = {
  Sun: { gem: "Ruby / Red Garnet", mantra: "Om Hram Hreem Hraum Sah Suryaya Namah", donate: "Wheat, jaggery, copper", practice: "Offer water to rising Sun daily", color: "Red, Copper, Gold" },
  Moon: { gem: "Pearl / Moonstone", mantra: "Om Shram Shreem Shraum Sah Chandraya Namah", donate: "Milk, rice, silver", practice: "Wear silver. Keep water pot in bedroom.", color: "White, Silver" },
  Mars: { gem: "Red Coral", mantra: "Om Kram Kreem Kraum Sah Bhaumaya Namah", donate: "Red masoor dal, blood donation", practice: "Plant neem/peepal. Good relations with brothers.", color: "Red, Orange" },
  Mercury: { gem: "Emerald / Green Tourmaline", mantra: "Om Bram Breem Braum Sah Budhaya Namah", donate: "Green cloth, moong dal", practice: "Feed green fodder to cows.", color: "Green" },
  Jupiter: { gem: "Yellow Sapphire / Citrine", mantra: "Om Gram Greem Graum Sah Gurave Namah", donate: "Yellow cloth, turmeric, banana", practice: "Apply saffron tilak. Touch feet of elders.", color: "Yellow, Gold" },
  Venus: { gem: "Diamond / White Sapphire", mantra: "Om Dram Dreem Draum Sah Shukraya Namah", donate: "White rice, sugar, silver", practice: "Keep/feed white cow. Respect all women.", color: "White, Pink" },
  Saturn: { gem: "Blue Sapphire / Amethyst", mantra: "Om Pram Preem Praum Sah Shanaischaraya Namah", donate: "Mustard oil, iron, black sesame", practice: "Feed crows and dogs. Donate to poor.", color: "Black, Blue, Purple" },
  Rahu: { gem: "Hessonite (Gomed)", mantra: "Om Bhram Bhreem Bhraum Sah Rahave Namah", donate: "Lead, coal, dark items", practice: "Keep lead piece at home.", color: "Smoky, Dark Blue" },
  Ketu: { gem: "Cat's Eye (Chrysoberyl)", mantra: "Om Shram Shreem Shraum Sah Ketave Namah", donate: "Black+white blanket", practice: "Feed dogs daily. Respect spiritual teachers.", color: "Multicolour" },
};

export interface RemedyCard {
  planet: string;
  house: number;
  sign: string;
  nakshatra: string;
  status: string;
  isWeak: boolean;
  gem: string;
  mantra: string;
  donate: string;
  practice: string;
  color: string;
  priority: "urgent" | "recommended" | "optional";
}

export interface RemedyResult {
  cards: RemedyCard[];
  urgentCount: number;
  topPriority: RemedyCard | null;
}

export function calculateRemedies(chart: ChartData): RemedyResult {
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const cards: RemedyCard[] = [];

  planets.forEach((planet) => {
    const pd = chart.planets[planet];
    if (!pd) return;
    const r = RDATA[planet];
    if (!r) return;

    const isWeak = [6, 8, 12].includes(pd.house) || pd.dignity?.includes("Neecha") || pd.dignity?.includes("Debilitated");
    const priority = isWeak ? "urgent" : "recommended";

    cards.push({
      planet,
      house: pd.house,
      sign: pd.sign,
      nakshatra: pd.nakshatra,
      status: pd.dignity || "Normal",
      isWeak,
      gem: r.gem,
      mantra: r.mantra,
      donate: r.donate,
      practice: r.practice,
      color: r.color,
      priority,
    });
  });

  cards.sort((a, b) => (a.priority === "urgent" ? -1 : 1));
  const urgentCount = cards.filter((c) => c.priority === "urgent").length;
  const topPriority = cards[0] || null;

  return { cards, urgentCount, topPriority };
}
