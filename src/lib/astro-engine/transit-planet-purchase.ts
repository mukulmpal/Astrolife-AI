// ── Per-Planet Gochar Purchase Guidance ───────────────────────
// For each of the 9 grahas, derive a BUY / BUY_CAREFULLY / WAIT / AVOID
// verdict for the objects that planet governs — driven entirely by the
// LIVE transit snapshot (rashi, house-from-base, effect, retrograde,
// engine score). No hardcoded verdicts: every number comes from the
// current Gochar report, so the guidance changes day to day.

import type { PlanetName, TransitReport, TransitPlanetResult } from "./transits";
import type { PurchaseVerdict } from "./transit-purchase-guidance";

export interface PlanetPurchaseGuidance {
  planet: PlanetName;
  glyph: string;
  hindiName: string;
  domain: string;            // short tagline of what this planet buys
  objects: string[];         // object categories governed by the planet
  verdict: PurchaseVerdict;
  score: number;             // 0-100, the live transit score
  transit: {
    rashiName: string;
    degreeInRashi: number;
    houseFromBase: number;
    baseLabel: "Lagna" | "Moon";
    effect: TransitPlanetResult["effect"];
    retrograde: boolean;
    difficultHouse: boolean;
    note: string;
    hits: PlanetName[];      // natal planets sitting in the transited house
  };
  timing: string;            // verdict-specific timing line
  guidance: string;          // dynamic, transit-aware sentence
  favourable: string[];      // what is good to buy now
  avoid: string[];           // what to avoid now
  checks: string[];          // practical checks regardless of verdict
}

export interface PlanetPurchaseReport {
  date: string;
  baseLabel: "Lagna" | "Moon";
  planets: PlanetPurchaseGuidance[];
  best?: PlanetPurchaseGuidance;
  worst?: PlanetPurchaseGuidance;
}

interface PlanetProfile {
  glyph: string;
  hindiName: string;
  domain: string;
  objects: string[];
  favourable: string[];
  avoid: string[];
  checks: string[];
  /** classical significance text reused inside dynamic guidance */
  essence: string;
}

// Canonical order = tab order in the UI.
const PLANET_ORDER: PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
];

const PROFILES: Record<PlanetName, PlanetProfile> = {
  Sun: {
    glyph: "☉",
    hindiName: "Surya",
    domain: "Gold, copper, authority & premium brands",
    objects: ["Gold", "Copper & brass items", "Premium / branded goods", "Government or official documents", "Licenses & certificates", "Leadership / status items", "Father-related gifts"],
    favourable: ["Buy gold, copper or premium items in the bright half of the month", "Apply for licenses, registrations and official paperwork", "Invest in status purchases that build long-term authority"],
    avoid: ["Ego-driven luxury splurges to impress others", "High-value branded buys when the Sun is pressured", "Pushing official paperwork through under conflict"],
    checks: ["Verify certification/hallmark on gold & copper", "Keep official receipts and warranty cards", "Confirm document authenticity before signing"],
    essence: "Sun governs authority, gold, copper, government work and premium status items",
  },
  Moon: {
    glyph: "☽",
    hindiName: "Chandra",
    domain: "Silver, water, home comfort & dairy",
    objects: ["Silver & pearls", "Water purifiers / tanks", "Home comfort & kitchen items", "Dairy & liquids", "Mother-related gifts", "White / soft furnishing", "Calm decor"],
    favourable: ["Buy silver, home comfort and kitchen items", "Set up water-related and household essentials", "Make gentle home-improvement purchases"],
    avoid: ["Emotion-driven impulse buys", "Big decisions on a low-mood / unstable Moon day", "Liquids or perishables you cannot store well"],
    checks: ["Check purity/hallmark on silver", "Inspect water systems for leaks before payment", "Buy perishables only with proper storage ready"],
    essence: "Moon governs silver, water, home comfort, dairy and emotional well-being",
  },
  Mars: {
    glyph: "♂",
    hindiName: "Mangal",
    domain: "Vehicles, land, tools & machinery",
    objects: ["Vehicles", "Land & property", "Tools & sharp instruments", "Fitness / sports equipment", "Construction material", "Electrical & fire items", "Red items"],
    favourable: ["Finalise vehicle or property deals with clean papers", "Buy quality tools, fitness or construction gear", "Act decisively on inspected, ready purchases"],
    avoid: ["Used vehicles without a full inspection", "Aggressive or ego-based snap purchases", "Sharp tools / risky machinery as casual gifts"],
    checks: ["Physically inspect vehicle/property and test-drive", "Verify ownership papers and liabilities", "Cool off before any heat-of-the-moment buy"],
    essence: "Mars governs vehicles, land, tools, machinery and decisive action",
  },
  Mercury: {
    glyph: "☿",
    hindiName: "Budh",
    domain: "Electronics, documents & business tools",
    objects: ["Phones & laptops", "Electronics & gadgets", "Documents & contracts", "Books & courseware", "Business / trading tools", "Software & subscriptions", "Stationery"],
    favourable: ["Buy gadgets, business tools and software with clear billing", "Sign contracts and agreements after careful reading", "Invest in skill, books and communication upgrades"],
    avoid: ["Second-hand electronics without verification", "Signing unclear or rushed paperwork", "Impulsive gadget upgrades for novelty"],
    checks: ["Confirm warranty, invoice and return policy", "Read every clause before signing", "Avoid devices with unknown history/data"],
    essence: "Mercury governs electronics, documents, trade, learning and communication",
  },
  Jupiter: {
    glyph: "♃",
    hindiName: "Guru",
    domain: "Gold, education, finance & spiritual items",
    objects: ["Gold & yellow sapphire", "Education & courses", "Investments & finance products", "Religious / spiritual items", "Advisory services", "Books of wisdom", "Yellow items"],
    favourable: ["Start investments, education and long-term financial plans", "Buy gold or yellow-sapphire for value, not show", "Fund genuine learning and advisory engagements"],
    avoid: ["Blind gemstone purchases without consultation", "Over-spending on status disguised as 'investment'", "Borrowed-money education / finance commitments"],
    checks: ["Verify purity/certification for gold & gemstones", "Read fine print on financial products", "Spend on real learning, not prestige"],
    essence: "Jupiter governs gold, education, finance, wisdom and spiritual growth",
  },
  Venus: {
    glyph: "♀",
    hindiName: "Shukra",
    domain: "Luxury, jewellery, beauty & comfort cars",
    objects: ["Jewellery & diamonds", "Luxury & comfort cars", "Beauty & cosmetics", "Fashion & clothing", "Decor & art", "Perfumes", "Entertainment & comfort"],
    favourable: ["Buy jewellery, decor and comfort items within budget", "Upgrade comfort-grade vehicles and home aesthetics", "Invest in well-chosen art and fashion"],
    avoid: ["Debt-based or vanity luxury splurges", "Uncertified jewellery or gemstones", "Relationship-pressure purchases"],
    checks: ["Use certified sellers for jewellery", "Stay strictly within budget", "Avoid buying during relationship turbulence"],
    essence: "Venus governs luxury, jewellery, beauty, comfort and relationship pleasure",
  },
  Saturn: {
    glyph: "♄",
    hindiName: "Shani",
    domain: "Iron, machinery, property & durable goods",
    objects: ["Iron & steel items", "Heavy machinery", "Old / resale property", "Leather & footwear", "Oil & fuel", "Durable long-term goods", "Black / dark items"],
    favourable: ["Buy durable, long-term essentials with a clear need", "Invest in serviceable machinery with full history", "Make patient, well-documented property decisions"],
    avoid: ["Repair-heavy or scrap machinery deals", "Second-hand leather, iron or footwear under pressure", "Buying only because it is cheap"],
    checks: ["Check service history and maintenance records", "Inspect for rust, wear and hidden defects", "Insist on proper paperwork for property"],
    essence: "Saturn governs iron, machinery, durability, property and long-term burden",
  },
  Rahu: {
    glyph: "☊",
    hindiName: "Rahu",
    domain: "Foreign goods, new-tech & speculation",
    objects: ["Imported / foreign goods", "Cutting-edge & unconventional tech", "Speculative assets", "Second-hand bargains", "Cameras / media gear", "Chemicals & synthetics", "Crypto / high-risk buys"],
    favourable: ["Research foreign / new-tech buys thoroughly, then act", "Document every speculative or imported purchase", "Use trusted channels for high-novelty items"],
    avoid: ["Get-rich-quick and hype-driven purchases", "Unverified second-hand 'bargains'", "Grey-market or undocumented imports"],
    checks: ["Verify seller credibility and authenticity", "Avoid decisions based on hype or FOMO", "Keep full proof of payment and origin"],
    essence: "Rahu governs foreign goods, new technology, speculation and the unconventional",
  },
  Ketu: {
    glyph: "☋",
    hindiName: "Ketu",
    domain: "Spiritual, occult & research items",
    objects: ["Spiritual & puja items", "Cat's-eye gemstone", "Occult / research tools", "Medical & surgical items", "Second-hand spiritual goods", "Minimalist essentials", "Blankets & woollens"],
    favourable: ["Buy genuine spiritual, research and study tools", "Make minimalist, need-based essential purchases", "Acquire medical items with proper guidance"],
    avoid: ["Vague or mysterious 'energy' product scams", "Detachment-driven careless spending", "Unverified occult or second-hand spiritual goods"],
    checks: ["Buy spiritual/gem items from trusted sources only", "Confirm genuine need before purchase", "Avoid superstition-led overspending"],
    essence: "Ketu governs spirituality, the occult, research, detachment and minimalism",
  },
};

const DIFFICULT_HOUSES = [6, 8, 12];

function verdictFor(p: TransitPlanetResult): PurchaseVerdict {
  const difficult = DIFFICULT_HOUSES.includes(p.houseFromBase);
  if (p.score < 38 || (p.effect === "caution" && difficult)) return "AVOID";
  if (p.score < 50 || difficult || p.effect === "caution") return "WAIT";
  if (p.score < 64 || p.retrograde) return "BUY_CAREFULLY";
  return "BUY";
}

function timingFor(verdict: PurchaseVerdict): string {
  switch (verdict) {
    case "BUY": return "Favourable window — proceed with normal practical checks.";
    case "BUY_CAREFULLY": return "Mixed window — buy only after documents, warranty and budget checks.";
    case "WAIT": return "Wait window — delay non-urgent purchases for this planet's objects.";
    case "AVOID": return "Avoid window — skip risky, used, unclear or high-value purchases now.";
  }
}

function guidanceFor(p: TransitPlanetResult, profile: PlanetProfile, verdict: PurchaseVerdict): string {
  const retro = p.retrograde ? ", retrograde" : "";
  const where = `${profile.hindiName} is transiting ${p.rashiName}, house ${p.houseFromBase} from ${p.baseLabel}${retro} (${p.effect}, strength ${p.score}/100).`;
  const advice =
    verdict === "BUY"
      ? `${profile.essence}, and right now it supports these purchases. A clean, well-judged buy is favoured.`
      : verdict === "BUY_CAREFULLY"
        ? `${profile.essence}. The signal is workable but mixed — buy only after careful checks and within budget.`
        : verdict === "WAIT"
          ? `${profile.essence}. The current transit is not supportive — delay non-essential purchases in this category.`
          : `${profile.essence}, but the transit is under pressure (difficult house / caution). Avoid risky or high-value buys for now.`;
  return `${where} ${advice}`;
}

export function generatePlanetPurchaseReport(report: TransitReport): PlanetPurchaseReport {
  const byPlanet = new Map<PlanetName, TransitPlanetResult>(
    report.planets.map((p) => [p.planet, p])
  );

  const planets: PlanetPurchaseGuidance[] = PLANET_ORDER.flatMap((name) => {
    const p = byPlanet.get(name);
    const profile = PROFILES[name];
    if (!p || !profile) return [];
    const verdict = verdictFor(p);
    const difficultHouse = DIFFICULT_HOUSES.includes(p.houseFromBase);

    return [{
      planet: name,
      glyph: profile.glyph,
      hindiName: profile.hindiName,
      domain: profile.domain,
      objects: profile.objects,
      verdict,
      score: p.score,
      transit: {
        rashiName: p.rashiName,
        degreeInRashi: p.degreeInRashi,
        houseFromBase: p.houseFromBase,
        baseLabel: p.baseLabel,
        effect: p.effect,
        retrograde: p.retrograde,
        difficultHouse,
        note: p.note,
        hits: p.natalHitPlanets,
      },
      timing: timingFor(verdict),
      guidance: guidanceFor(p, profile, verdict),
      favourable: profile.favourable,
      avoid: profile.avoid,
      checks: profile.checks,
    }];
  });

  const ranked = [...planets].sort((a, b) => b.score - a.score);

  return {
    date: report.date,
    baseLabel: report.baseLabel,
    planets,
    best: ranked[0],
    worst: ranked[ranked.length - 1],
  };
}
