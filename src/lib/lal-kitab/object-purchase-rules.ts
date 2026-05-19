import type {
  LalKitabPlanet,
  LalKitabPurchaseInput,
  LalKitabPurchaseResult,
  LalKitabPurchaseRule,
} from "./grammar-types";

export const LAL_KITAB_PURCHASE_RULES: LalKitabPurchaseRule[] = [
  {
    id: "saturn-leather-iron-shoes-machinery",
    planet: "Saturn",
    title: "Saturn Objects: Leather, Shoes, Iron & Machinery",
    objects: [
      "used shoes",
      "old footwear",
      "leather belt",
      "leather bag",
      "purse or wallet",
      "iron objects",
      "scrap metal",
      "steel/heavy metal items",
      "heavy machinery",
      "repair-heavy tools",
      "black or dark used clothes",
    ],
    avoidWhen: [
      "Saturn Mahadasha / Antardasha / Pratyantardasha is active and Saturn is difficult",
      "Saturn activates 6th, 8th or 12th from Lagna or Moon",
      "Saturn is linked with Rahu/Ketu pressure",
      "repeated signals appear: shoe loss, machinery repair, debt/labour dispute",
    ],
    giftCaution: [
      "Do not accept used shoes as gifts during difficult Saturn activation.",
      "Do not accept old leather, old iron, scrap metal or broken machinery as gifts.",
      "Be careful with second-hand black/dark clothes.",
    ],
    purchaseCaution: [
      "Avoid second-hand leather items.",
      "Avoid repair-heavy machinery.",
      "Avoid old iron/scrap deals.",
      "Avoid buying only because it is cheap.",
    ],
    favourableWhen: [
      "Buy only necessary new items with bill/warranty.",
      "Use practical inspection before machinery/vehicle decisions.",
      "Saturn items can be used only with clean need, discipline and chart validation.",
    ],
    explanation:
      "In Lal Kitab grammar, Saturn is linked with oldness, burden, labour, iron, leather, delay and karmic pressure. When Saturn is difficult by dasha or transit, these objects can behave as symbolic triggers for delay, repair cost, debt, loss or responsibility. This is not a blind ban; it becomes stronger only when natal promise, dasha and transit agree.",
    sourceBasis: [
      "Lal Kitab Amrit: Saturn remedies include urad, leather/chamda and iron/loha.",
      "U.C. Mahajan Lal Kitab: Saturn-linked business/items include iron, leather and machines in loss-risk context.",
      "U.C. Mahajan Lal Kitab: Saturn in difficult houses needs special judgement.",
    ],
    confidence: "cross_checked",
  },
  {
    id: "venus-luxury-beauty-jewellery",
    planet: "Venus",
    title: "Venus Objects: Luxury, Beauty, Jewellery & Comfort",
    objects: [
      "jewellery",
      "perfume",
      "beauty products",
      "luxury clothes",
      "decor items",
      "comfort items",
      "fashion accessories",
    ],
    avoidWhen: [
      "Venus is afflicted by Rahu/Saturn",
      "Venus period is active but linked to 6th/8th/12th pressure",
      "purchase is debt-based or vanity-driven",
    ],
    giftCaution: [
      "Avoid accepting expensive luxury gifts if Venus is afflicted.",
      "Avoid gifts that create obligation, attachment or relationship debt.",
    ],
    purchaseCaution: [
      "Avoid impulsive luxury purchases.",
      "Avoid uncertified jewellery or gemstone.",
      "Avoid beauty/luxury spending during relationship confusion.",
    ],
    favourableWhen: [
      "Venus is supported by Jupiter.",
      "Venus activates 2nd/4th/7th/11th positively.",
      "Purchase is clean, useful and within budget.",
    ],
    explanation:
      "Venus supports comfort, beauty, relationship pleasure and luxury. When clean, it favours jewellery, decor and beauty purchases. When afflicted, the same items can create debt, vanity, relationship pressure or regret.",
    sourceBasis: [
      "Safe index: Venus planet-house and remedy coverage detected.",
      "Needs deeper cross-check against Lal Kitab house-specific rules before strict use.",
    ],
    confidence: "draft_candidate",
  },
  {
    id: "mercury-electronics-documents-business-tools",
    planet: "Mercury",
    title: "Mercury Objects: Electronics, Documents & Business Tools",
    objects: [
      "phone",
      "laptop",
      "electronics",
      "documents",
      "business tools",
      "software",
      "books",
      "communication devices",
    ],
    avoidWhen: [
      "Mercury is afflicted or confused by Rahu",
      "documents are unclear",
      "purchase has no warranty or invoice",
    ],
    giftCaution: [
      "Avoid used electronics without verification.",
      "Avoid accepting devices with hidden data/liability.",
    ],
    purchaseCaution: [
      "Check warranty, invoice and return policy.",
      "Avoid impulsive gadget upgrades.",
    ],
    favourableWhen: [
      "Mercury dasha/transit supports 3rd/5th/9th/10th/11th.",
      "Purchase supports learning, business or communication.",
    ],
    explanation:
      "Mercury governs trade, documents, calculation, learning and communication. Electronics and business tools are favourable when Mercury is clear and practical.",
    sourceBasis: [
      "Safe index: Mercury has highest coverage in grammar index.",
      "Needs cross-check with uploaded Lal Kitab house-specific rules.",
    ],
    confidence: "draft_candidate",
  },
  {
    id: "mars-vehicle-land-tools",
    planet: "Mars",
    title: "Mars Objects: Vehicle, Land, Tools & Fire Items",
    objects: [
      "vehicle",
      "land",
      "tools",
      "machinery",
      "fire items",
      "sharp tools",
      "construction equipment",
    ],
    avoidWhen: [
      "Mars is afflicted by Rahu/Ketu",
      "Mars activates accident-prone houses",
      "documents/inspection are incomplete",
    ],
    giftCaution: [
      "Avoid accepting weapons, sharp tools or risky machinery casually.",
    ],
    purchaseCaution: [
      "Avoid used vehicle without inspection.",
      "Avoid aggressive or ego-based purchase.",
    ],
    favourableWhen: [
      "Mars is stable and supports 4th/10th/11th.",
      "Vehicle/property purchase has clean documents.",
    ],
    explanation:
      "Mars supports land, tools, vehicles, action and mechanical force. When disturbed, it can show accident, dispute, fire, cuts or impulsive decisions.",
    sourceBasis: [
      "Safe index: Mars planet-house coverage detected.",
      "Needs cross-check with Lal Kitab Mars house rules.",
    ],
    confidence: "draft_candidate",
  },
];

function planetActive(input: LalKitabPurchaseInput, planet: LalKitabPlanet) {
  const triggers: string[] = [];

  if (input.currentMahadasha === planet) triggers.push(`${planet} Mahadasha active`);
  if (input.currentAntardasha === planet) triggers.push(`${planet} Antardasha active`);
  if (input.currentPratyantardasha === planet) {
    triggers.push(`${planet} Pratyantardasha active`);
  }

  if ((input.activePlanets ?? []).includes(planet)) {
    triggers.push(`${planet} marked active`);
  }

  const houses = input.transitHouses?.[planet] ?? [];
  const difficult = houses.filter((house) => [6, 8, 12].includes(house));
  if (difficult.length > 0) {
    triggers.push(`${planet} transit activating difficult house(s): ${difficult.join(", ")}`);
  }

  return triggers;
}

export function getLalKitabPurchaseGuidance(
  input: LalKitabPurchaseInput
): LalKitabPurchaseResult[] {
  return LAL_KITAB_PURCHASE_RULES.map((rule) => {
    const activeTriggers = planetActive(input, rule.planet);
    const hasDifficultTransit = activeTriggers.some((trigger) => trigger.includes("difficult"));
    const activeCount = activeTriggers.length;

    let verdict: LalKitabPurchaseResult["verdict"] = "SAFE";
    let score = 72;

    if (activeCount > 0) {
      verdict = "CAUTION";
      score -= activeCount * 12;
    }

    if (rule.planet === "Saturn" && activeCount > 0) {
      verdict = hasDifficultTransit ? "AVOID" : "GIFT_CAUTION";
      score -= 25;
    }

    if (hasDifficultTransit && activeCount >= 2) {
      verdict = "AVOID";
      score -= 18;
    }

    return {
      ...rule,
      activeTriggers,
      verdict,
      score: Math.max(5, Math.min(95, score)),
    };
  }).sort((a, b) => a.score - b.score);
}
