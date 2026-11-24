/**
 * ============================================================================
 * ASTROLIFE — DYNAMIC 3-TIER HUMAN TRANSLATION ENGINE (v2.0)
 * ============================================================================
 * Converts raw astrological metrics (Shadbala, SAV-337, D-9 Navamsha, Dasha,
 * Jaimini Karakas, Tara Bala, Transit Gochar) into deterministic 3-Beat
 * Human Impact Micro-Cards for laymen with zero astrology background.
 *
 * ANTI-FLATTERY & ANTI-FEAR RULES:
 * - Zero Barnum/Forer flattery ("top 5% in the world", "poverty impossible")
 * - Zero fear-mongering ("curse", "ruin", "doom" -> "Structural Audit Phase")
 * - Zero AI mentions ("AI", "Zero AI hallucinations", ".vercel.app" -> "Deterministic Classical Shastra · astrolife.io")
 * - Dynamic Gender Lateralization: Right/Dakshina for Male, Left/Vama for Female
 * ============================================================================
 */

export type TranslationTier = "TIER_HIGH" | "TIER_MID" | "TIER_LOW";

export interface HumanImpactCard {
  tier: TranslationTier;
  badge: "Your Natural Edge" | "Steady Engine (Needs Structure)" | "Your Blind Spot & Fix";
  title: string;
  plainWords: string;   // 2 crisp sentences translating to daily life
  watchOutFor: string;  // 1 honest, non-fear-based blind spot or trigger
  nextMove: string;     // 1 concrete action the user can execute tomorrow morning
  shastricProof?: string; // Compact ledger string for bottom 30% strip
}

export interface GenderLateralization {
  wrist: string;
  side: string;
  hand: string;
  sanskritTerm: string;
  channel: string;
}

export function getGenderLateralization(gender?: string): GenderLateralization {
  const isFemale = (gender || "").toLowerCase().trim() === "female";
  if (isFemale) {
    return {
      wrist: "Left wrist",
      side: "Left side",
      hand: "Left hand",
      sanskritTerm: "Vama Anga (वामाङ्ग)",
      channel: "Lunar / Ida Nadi (receptive polarity)",
    };
  }
  return {
    wrist: "Right wrist",
    side: "Right side",
    hand: "Right hand",
    sanskritTerm: "Dakshina Anga (दक्षिणाङ्ग)",
    channel: "Solar / Pingala Nadi (projective polarity)",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL NAKSHATRAS & SIGNS
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const TARA_NAMES = [
  { num: 1, name: "Janma", status: "Neutral / High Sensitivity", supportive: false },
  { num: 2, name: "Sampat", status: "Highly Auspicious (Wealth & Resource Flow)", supportive: true },
  { num: 3, name: "Vipat", status: "Challenging (Friction & Resistance)", supportive: false },
  { num: 4, name: "Kshema", status: "Auspicious (Protection & Sustained Security)", supportive: true },
  { num: 5, name: "Pratyak", status: "Challenging (Obstacles & Counter-Pressures)", supportive: false },
  { num: 6, name: "Sadhana", status: "Highly Auspicious (Achievement & Realization)", supportive: true },
  { num: 7, name: "Naidhana", status: "Critical Pause (High Vulnerability / Audit)", supportive: false },
  { num: 8, name: "Mitra", status: "Auspicious (Helpful Alliances & Ease)", supportive: true },
  { num: 9, name: "Parama Mitra", status: "Supreme Auspicious (Maximum Benefic Alignment)", supportive: true },
];

export const ALL_RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const RASHI_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC TARA BALA & ASHTAMA CHANDRA
// ─────────────────────────────────────────────────────────────────────────────
export function calculateTaraBala(natalNakshatra: string, transitNakshatra: string): {
  taraNum: number;
  taraName: string;
  status: string;
  isSupportive: boolean;
} {
  const nIdx = ALL_NAKSHATRAS.findIndex(n => n.toLowerCase() === (natalNakshatra || "").toLowerCase());
  const tIdx = ALL_NAKSHATRAS.findIndex(n => n.toLowerCase() === (transitNakshatra || "").toLowerCase());
  if (nIdx === -1 || tIdx === -1) {
    return { taraNum: 2, taraName: "Sampat", status: "Auspicious Flow", isSupportive: true };
  }
  const distance = (tIdx - nIdx + 27) % 27;
  const taraNum = (distance % 9) + 1;
  const meta = TARA_NAMES.find(t => t.num === taraNum) || TARA_NAMES[1];
  return {
    taraNum,
    taraName: meta.name,
    status: meta.status,
    isSupportive: meta.supportive,
  };
}

export function calculateAshtamaChandra(natalMoonSign: string, transitMoonSign: string): {
  isAshtama: boolean;
  houseFromMoon: number;
  warningText: string;
} {
  const nIdx = ALL_RASHIS.findIndex(r => r.toLowerCase() === (natalMoonSign || "").toLowerCase());
  const tIdx = ALL_RASHIS.findIndex(r => r.toLowerCase() === (transitMoonSign || "").toLowerCase());
  if (nIdx === -1 || tIdx === -1) {
    return { isAshtama: false, houseFromMoon: 1, warningText: "" };
  }
  const house = ((tIdx - nIdx + 12) % 12) + 1;
  const isAshtama = house === 8;
  const ashtamaSign = ALL_RASHIS[(nIdx + 7) % 12];
  return {
    isAshtama,
    houseFromMoon: house,
    warningText: isAshtama
      ? `Transit Moon is in ${ashtamaSign} (8th house from natal Moon) — biological and emotional energy is in a restorative audit phase.`
      : `Transit Moon in ${ALL_RASHIS[tIdx]} (${house}th from natal Moon) is clear of 8th house lunar fatigue.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC GEMSTONE & REMEDIAL LATERALIZATION
// ─────────────────────────────────────────────────────────────────────────────
export interface GemstonePrescription {
  primaryGem: string;
  uparatna: string;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
  prohibitedGems: string[];
  rationale: string;
}

export function getDynamicGemstonePrescription(lagnaRashi: string, gender?: string): GemstonePrescription {
  const lat = getGenderLateralization(gender);
  const rashi = (lagnaRashi || "Aries").trim();

  switch (rashi) {
    case "Aries":
      return {
        primaryGem: "Natural Red Coral (Moonga)",
        uparatna: "Carnelian or Red Agate",
        metal: "Copper or Yellow Gold",
        finger: `Ring Finger (${lat.wrist})`,
        day: "Tuesday morning during Shukla Paksha",
        mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (108 times)",
        prohibitedGems: ["Emerald (Budha / 3rd & 6th lord)", "Blue Sapphire (Shani / 10th & 11th badhaka)"],
        rationale: "Mars is the Lagna lord. Strengthening Mars energizes core somatic stamina, leadership, and metabolic immunity.",
      };
    case "Taurus":
      return {
        primaryGem: "Natural Diamond or White Zircon",
        uparatna: "White Sapphire or Clear Quartz",
        metal: "Platinum or Silver",
        finger: `Middle or Little Finger (${lat.wrist})`,
        day: "Friday morning during Shukla Paksha",
        mantra: "Om Dram Dreem Droum Sah Shukraya Namah (108 times)",
        prohibitedGems: ["Yellow Sapphire (Guru / 8th & 11th lord)", "Ruby (Surya / 4th lord - keep balanced)"],
        rationale: "Venus is the Lagnesh. Fortifying Venus protects endocrine balance, negotiation grace, and liquid asset stability.",
      };
    case "Gemini":
      return {
        primaryGem: "Natural Emerald (Panna)",
        uparatna: "Green Tourmaline (Verdelite) or Peridot",
        metal: "Panchdhatu or Yellow Gold",
        finger: `Little Finger (${lat.wrist})`,
        day: "Wednesday morning during sunrise",
        mantra: "Om Bram Breem Broum Sah Budhaya Namah (108 times)",
        prohibitedGems: ["Red Coral (Mangal / 6th & 11th lord)", "Yellow Sapphire (Guru / Badhaka & Maraka lord)"],
        rationale: "Mercury rules Lagna and 4th house. Direct catalyst for intellectual processing, commerce, and neural coherence.",
      };
    case "Cancer":
      return {
        primaryGem: "Natural South Sea Pearl (Moti)",
        uparatna: "Natural Moonstone",
        metal: "Pure Silver",
        finger: `Little Finger (${lat.wrist})`,
        day: "Monday morning during Shukla Paksha",
        mantra: "Om Shram Shreem Shroum Sah Chandraya Namah (108 times)",
        prohibitedGems: ["Blue Sapphire (Shani / 7th & 8th lord)", "Emerald (Budha / 3rd & 12th lord)"],
        rationale: "Moon is the Lagna lord. Balances somatic fluids, sensory calm, and intuitive decision velocity.",
      };
    case "Leo":
      return {
        primaryGem: "Natural Burmese Ruby (Manikya)",
        uparatna: "Red Garnet or Spinel",
        metal: "Yellow Gold or Copper",
        finger: `Ring Finger (${lat.wrist})`,
        day: "Sunday sunrise during Shukla Paksha",
        mantra: "Om Hram Hreem Hroum Sah Suryaya Namah (108 times)",
        prohibitedGems: ["Diamond (Shukra / 3rd & 10th enemy)", "Blue Sapphire (Shani / 6th & 7th adversary)"],
        rationale: "Sun rules Lagna. Ignites solar digestive fire (Agni), cellular vitality, and sovereign organizational stature.",
      };
    case "Virgo":
      return {
        primaryGem: "Natural Emerald (Panna)",
        uparatna: "Green Tourmaline or Peridot (6.5–7.5 Ratti)",
        metal: "Panchdhatu or Yellow Gold",
        finger: `Little Finger (${lat.wrist})`,
        day: "Wednesday sunrise during Shukla Paksha",
        mantra: "Om Bram Breem Broum Sah Budhaya Namah (108 times)",
        prohibitedGems: ["Red Coral (Mangal / 3rd & 8th lord)", "Yellow Sapphire (Guru / Badhaka lord)"],
        rationale: "Mercury is Lagna and 10th lord. Provides analytical precision, nervous system resilience, and commercial mastery.",
      };
    case "Libra":
      return {
        primaryGem: "Natural White Sapphire or Diamond",
        uparatna: "Clear Quartz or White Zircon",
        metal: "Silver or Platinum",
        finger: `Middle or Little Finger (${lat.wrist})`,
        day: "Friday morning during sunrise",
        mantra: "Om Dram Dreem Droum Sah Shukraya Namah (108 times)",
        prohibitedGems: ["Ruby (Surya / 11th badhaka)", "Yellow Sapphire (Guru / 3rd & 6th functional malefic)"],
        rationale: "Venus governs Lagna and 8th house. Enhances relational harmony, creative architecture, and micro-vascular stability.",
      };
    case "Scorpio":
      return {
        primaryGem: "Natural Red Coral (Moonga)",
        uparatna: "Carnelian",
        metal: "Copper or Yellow Gold",
        finger: `Ring Finger (${lat.wrist})`,
        day: "Tuesday morning during sunrise",
        mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (108 times)",
        prohibitedGems: ["Emerald (Budha / 8th & 11th lord)", "Diamond (Shukra / 7th & 12th lord)"],
        rationale: "Mars is Lagna ruler. Anchors immune regenerative stamina, surgical precision, and unshakeable psychological grit.",
      };
    case "Sagittarius":
      return {
        primaryGem: "Natural Yellow Sapphire (Pukhraj)",
        uparatna: "Yellow Topaz or Heliodor",
        metal: "Yellow Gold or Brass",
        finger: `Index Finger (${lat.wrist})`,
        day: "Thursday morning during sunrise",
        mantra: "Om Gram Greem Groum Sah Gurave Namah (108 times)",
        prohibitedGems: ["Diamond (Shukra / 6th & 11th adversary)", "Emerald (Budha / 7th & 10th kendradhipati)"],
        rationale: "Jupiter is Lagnesh and 4th lord. Expands institutional wisdom, hepatic health, and strategic foresight.",
      };
    case "Capricorn":
      return {
        primaryGem: "Natural Blue Sapphire (Neelam) or Amethyst",
        uparatna: "Iolite (Neeli) or Blue Topaz",
        metal: "Panchdhatu or Silver",
        finger: `Middle Finger (${lat.wrist})`,
        day: "Saturday twilight",
        mantra: "Om Pram Preem Proum Sah Shanaishcharaya Namah (108 times)",
        prohibitedGems: ["Ruby (Surya / 8th lord)", "Yellow Sapphire (Guru / 3rd & 12th lord)"],
        rationale: "Saturn is Lagna and 2nd lord. Institutional patience, structural longevity, and financial discipline.",
      };
    case "Aquarius":
      return {
        primaryGem: "Natural Blue Sapphire or Blue Topaz",
        uparatna: "Iolite or Amethyst",
        metal: "Silver or White Gold",
        finger: `Middle Finger (${lat.wrist})`,
        day: "Saturday twilight",
        mantra: "Om Sham Shanaishcharaya Namah (108 times)",
        prohibitedGems: ["Ruby (Surya / 7th maraka)", "Red Coral (Mangal / 3rd & 10th adversary)"],
        rationale: "Saturn is Lagnesh. Enhances macro-system building, nervous durability, and disciplined long-term compounding.",
      };
    case "Pisces":
    default:
      return {
        primaryGem: "Natural Yellow Sapphire (Pukhraj)",
        uparatna: "Yellow Citrine or Golden Topaz",
        metal: "Yellow Gold",
        finger: `Index Finger (${lat.wrist})`,
        day: "Thursday morning during sunrise",
        mantra: "Om Gram Greem Groum Sah Gurave Namah (108 times)",
        prohibitedGems: ["Diamond (Shukra / 3rd & 8th lord)", "Emerald (Budha / 4th & 7th kendradhipati)"],
        rationale: "Jupiter is Lagna and 10th lord. Awakens spiritual clarity, lymphatic resilience, and ethical leadership authority.",
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3-TIER DETERMINISTIC CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────
export function classifyMetricTier(params: {
  shadbalaRatio?: number;
  savBindus?: number;
  dignity?: string;
  isDusthana?: boolean;
  isDebilitated?: boolean;
}): { tier: TranslationTier; badge: "Your Natural Edge" | "Steady Engine (Needs Structure)" | "Your Blind Spot & Fix" } {
  const { shadbalaRatio = 1.0, savBindus = 28, dignity = "Neutral", isDusthana = false, isDebilitated = false } = params;

  if (isDebilitated || isDusthana || shadbalaRatio < 0.80 || savBindus <= 25) {
    return { tier: "TIER_LOW", badge: "Your Blind Spot & Fix" };
  }
  if (shadbalaRatio >= 1.00 && savBindus >= 30 && (dignity === "Exalted" || dignity === "Moolatrikona" || dignity === "Own" || dignity === "Friendly" || dignity === "Neutral")) {
    return { tier: "TIER_HIGH", badge: "Your Natural Edge" };
  }
  return { tier: "TIER_MID", badge: "Steady Engine (Needs Structure)" };
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN-SPECIFIC TRANSLATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. Shadbala Planetary Translation
 */
export function translatePlanetShadbala(
  planet: string,
  ratio: number,
  rupas: number,
  dignity = "Neutral",
  house = 1,
  sign = "Aries"
): HumanImpactCard {
  const { tier, badge } = classifyMetricTier({ shadbalaRatio: ratio, dignity });

  const planetDomains: Record<string, { high: string; mid: string; low: string; watch: string; action: string }> = {
    Sun: {
      high: "Your sense of internal authority and administrative clarity operates naturally without needing external validation. People instinctively look to your direction during ambiguity.",
      mid: "Your executive confidence is stable when supported by clear roles and organized teams. Structured delegation prevents personal fatigue.",
      low: "You may occasionally second-guess your sovereign leadership or over-compensate through perfectionism. Direct communication builds the respect you seek.",
      watch: "Avoid taking on unilateral responsibility for organizational bottlenecks that belong to others.",
      action: "Take 10 minutes at sunrise for direct light exposure, and claim full ownership of your primary project roadmap.",
    },
    Moon: {
      high: "Your emotional recovery engine processes stress rapidly, giving you strong intuitive pattern recognition and empathetic clarity under pressure.",
      mid: "Your mental rhythm functions best with consistent sleep and protected solitary downtime. Emotional stability sustains your productive drive.",
      low: "Subconscious sensory overload or nighttime overthinking can temporarily drain your energy. Establish clear boundaries around evening work.",
      watch: "Watch out for reactive decision-making during days of high fatigue or disturbed sleep cycles.",
      action: "Cut blue light 45 minutes before sleep and hydrate with pure water before answering early communications.",
    },
    Mars: {
      high: "Your physical drive, initiative, and competitive courage execute tasks with decisive momentum. You cut through logistical delays swiftly.",
      mid: "Your endurance is steady when channeled into defined single-target sprints. Regular physical movement prevents restlessness.",
      low: "Physical stamina or assertive pushback can fluctuate under sustained bureaucratic friction. Pacing your energy avoids sudden burnouts.",
      watch: "Resist the urge to force immediate outcomes when counterparties require methodical consensus.",
      action: "Engage in 20 minutes of deliberate morning physical movement to ground your tactical drive.",
    },
    Mercury: {
      high: "Your cognitive processing speed decodes complex contracts, quantitative models, and communications with sharp analytical discernment.",
      mid: "Your commercial logic and negotiation abilities are reliable when you document terms and avoid multi-tasking overload.",
      low: "Nervous flutter or mental over-analysis can create temporary decision paralysis on major strategic choices.",
      watch: "Do not let small procedural details distract you from the larger strategic objective.",
      action: "Organize tomorrow's 3 non-negotiable milestones on physical paper before opening your digital inbox.",
    },
    Jupiter: {
      high: "Your long-term strategic foresight, ethical judgment, and institutional wisdom attract trusted mentors and compounding capital.",
      mid: "Your philosophical guidance is grounded when balanced by pragmatic operational checks. Advisory alliances yield solid progress.",
      low: "Over-optimism in initial projections or taking on too many advisory commitments can stretch your bandwidth thin.",
      watch: "Ensure every high-level expansion plan is backed by audited cashflow milestones.",
      action: "Review your core quarterly goals and eliminate one peripheral commitment that dilutes your primary focus.",
    },
    Venus: {
      high: "Your relational diplomacy, aesthetic refinement, and value-creation instincts build high-trust partnerships and brand equity effortlessly.",
      mid: "Your collaborative harmony thrives when interpersonal expectations and financial agreements are mutually transparent.",
      low: "Reluctance to confront relational friction or a tendency to compromise personal standards can cause silent dissatisfaction.",
      watch: "Avoid accommodating non-performing agreements merely to maintain surface pleasantness.",
      action: "Have one direct, candid conversation regarding project deliverables with complete diplomatic composure.",
    },
    Saturn: {
      high: "Your capacity for sustained patience, structural discipline, and compounding execution outlasts short-term market hype and competitors.",
      mid: "Your operational resilience compounds steadily when you adhere to established routines and reject shortcuts.",
      low: "Perceptions of slow progress or heavy responsibility can feel burdensome without clear milestone celebrations.",
      watch: "Do not confuse necessary tactical patience with passive toleration of preventable inefficiencies.",
      action: "Audit your recurring weekly commitments and automate or delegate one repetitive operational burden.",
    },
    Rahu: {
      high: "Your unconventional thinking spots unconventional market asymmetries and frontier opportunities before traditional institutions catch on.",
      mid: "Your experimental drive delivers strong breakthroughs when tethered to rigorous ethical boundaries and experienced advisors.",
      low: "Rapid speculative impulses or chasing sudden trends can scatter your foundational focus. Anchor yourself to verified fundamentals.",
      watch: "Guard against sudden shiny-object distractions that divert resources from your core engine.",
      action: "Institute a mandatory 48-hour pause before committing capital or signature to any sudden speculative venture.",
    },
    Ketu: {
      high: "Your deep detachment and technical research instincts allow you to dissect underlying core mechanics and master abstract concepts.",
      mid: "Your independent problem-solving works well when you maintain open communication channels with your operating team.",
      low: "Feelings of sudden disinterest in completed projects can lead to abrupt handoffs. Maintain structural closure.",
      watch: "Ensure key institutional knowledge is thoroughly documented before you transition to new frontiers.",
      action: "Write a clear standard operating protocol for your primary workflow so others can execute without your active intervention.",
    },
  };

  const domain = planetDomains[planet] || planetDomains["Mercury"];
  const plainWords = tier === "TIER_HIGH" ? domain.high : tier === "TIER_MID" ? domain.mid : domain.low;

  return {
    tier,
    badge,
    title: `${planet} Operational Impact (${dignity} in ${sign} · House ${house})`,
    plainWords,
    watchOutFor: domain.watch,
    nextMove: domain.action,
    shastricProof: `${planet} Shadbala: ${rupas.toFixed(2)} Rupas (${ratio.toFixed(2)}x Requirement) · Classical Dignity: ${dignity} · House: ${house}`,
  };
}

/**
 * 2. Ashtakavarga SAV-337 Translation
 */
export function translateAshtakavargaHouse(
  house: number,
  bindus: number,
  lagnaRashi = "Virgo",
  signName = "Gemini"
): HumanImpactCard {
  const { tier, badge } = classifyMetricTier({ savBindus: bindus });

  const houseMeanings: Record<number, { domain: string; high: string; mid: string; low: string; watch: string; action: string }> = {
    1: {
      domain: "Personal Vitality & Core Identity",
      high: "Your physical constitution and personal presence project natural resilience, recovering quickly from operational setbacks.",
      mid: "Your personal stamina is balanced and responds reliably when sustained by clean nutrition and regular rest intervals.",
      low: "Your vitality is sensitive to environmental stress and requires structured restorative periods to avoid energy depletion.",
      watch: "Do not neglect somatic recovery signals when high-intensity schedules demand prolonged engagement.",
      action: "Establish a non-negotiable 7-hour sleep window and maintain consistent morning hydration.",
    },
    2: {
      domain: "Liquid Capital & Asset Accumulation",
      high: "Your capacity to retain earnings and accumulate reserves forms a resilient financial cushion across market cycles.",
      mid: "Your cashflow retention remains healthy as long as systematic automated allocations to savings are enforced.",
      low: "Liquidity tends to exit as rapidly as it enters unless strict automated accounting and withdrawal friction are established.",
      watch: "Watch for impulsive discretionary expenditures during phases of emotional celebration or fatigue.",
      action: "Automate a fixed percentage transfer into liquid reserve vaults the moment revenue hits your operating account.",
    },
    9: {
      domain: "Strategic Fortune & Higher Mentorship",
      high: "Your endeavors receive consistent structural tailwinds, philosophical clarity, and timely access to respected guides.",
      mid: "Your strategic alignment compounds well through continuous study, ethical contracts, and respected counsel.",
      low: "Relying on raw fortune without meticulous preparation creates friction; your success depends on deliberate, verified systems.",
      watch: "Avoid relying on unverified assumptions; confirm contractual terms with trusted legal or financial advisors.",
      action: "Dedicate 30 minutes weekly to studying foundational industry precedents or consulting an experienced mentor.",
    },
    10: {
      domain: "Professional Stature & Executive Output",
      high: "Your executive authority and market output command natural credibility, creating enduring institutional respect in your chosen craft.",
      mid: "Your professional impact grows reliably through steady milestone delivery and disciplined project management.",
      low: "Career milestones require conscious patience and structured collaboration; resist pushing through unsupportive environments.",
      watch: "Do not over-commit your bandwidth to decorative titles that do not advance core commercial objectives.",
      action: "Identify your single highest-leverage work deliverable for the week and complete it before midday tomorrow.",
    },
    11: {
      domain: "Revenue Multiplier & Institutional Network",
      high: "Your network and revenue pathways compound into significant collective gains, converting strategic contacts into enduring capital.",
      mid: "Your earnings and professional associations progress steadily when nurtured through transparent, reciprocal value exchange.",
      low: "Monetization cycles require structured sales pipelines and clear pricing discipline rather than informal agreements.",
      watch: "Ensure that alliances are based on documented commercial alignment rather than vague mutual enthusiasm.",
      action: "Reach out to one high-value client or collaborator with a concrete, mutually advantageous proposal.",
    },
    12: {
      domain: "Resource Outflow & Restorative Solitude",
      high: "Your subconscious intuition and capacity for strategic solitude provide exceptional perspective, with minimal unforced leakage.",
      mid: "Your operational overhead is manageable when reviewed quarterly, keeping expenditure proportional to incoming gains.",
      low: "Unconscious expenditure or subtle resource leakage can drain surplus; proactive budgeting is essential to preserve margins.",
      watch: "Audit recurring software, subscription, and lifestyle overhead for silent, cumulative capital drains.",
      action: "Cancel at least two redundant subscriptions or discretionary expenses to immediately optimize your monthly cash retention.",
    },
  };

  const info = houseMeanings[house] || {
    domain: `House ${house} Life Domain`,
    high: `This life sphere operates with natural strength and supportive momentum, yielding compounding dividends.`,
    mid: `This domain maintains steady functionality when supported by organized habits and regular attention.`,
    low: `This area represents a development opportunity requiring deliberate structures and mindful attention to avoid friction.`,
    watch: `Maintain consistent awareness here rather than assuming momentum will sustain itself automatically.`,
    action: `Audit your daily routines connected to this house and introduce one simple tracking mechanism.`,
  };

  const plainWords = tier === "TIER_HIGH" ? info.high : tier === "TIER_MID" ? info.mid : info.low;

  return {
    tier,
    badge,
    title: `${info.domain} (House ${house} · ${signName})`,
    plainWords,
    watchOutFor: info.watch,
    nextMove: info.action,
    shastricProof: `SAV-337 Parashari Score: ${bindus} Bindus in ${signName} (Baseline Average: 28 Bindus) · Lagna: ${lagnaRashi}`,
  };
}

/**
 * 3. Dasha Life-Weather Translation
 */
export function translateDashaPeriod(
  mahadasha: string,
  antardasha: string,
  mdDignity = "Friendly",
  adDignity = "Neutral"
): HumanImpactCard {
  const isChallenging = mahadasha === "Rahu" && antardasha === "Saturn" || mahadasha === "Saturn" && antardasha === "Rahu";
  const isHighGrowth = (mahadasha === "Jupiter" || mahadasha === "Mercury" || mahadasha === "Venus") && adDignity !== "Debilitated";

  const tier: TranslationTier = isChallenging ? "TIER_LOW" : isHighGrowth ? "TIER_HIGH" : "TIER_MID";
  const badge = isChallenging ? "Your Blind Spot & Fix" : isHighGrowth ? "Your Natural Edge" : "Steady Engine (Needs Structure)";

  let plainWords = "";
  let watchOut = "";
  let action = "";

  if (mahadasha === "Rahu") {
    plainWords = `During the ${mahadasha} Mahadasha with ${antardasha} Antardasha, life pulls you toward rapid modernization, non-linear breakthroughs, and frontier expansion. Your ambition is heightened, urging you to break out of outdated conventional moulds.`;
    watchOut = "Guard against sudden speculative impulses or rushing into contracts without full due diligence.";
    action = "Anchor all major new projects to documented milestones and consult a trusted, grounded advisor before signing.";
  } else if (mahadasha === "Jupiter") {
    plainWords = `The ${mahadasha}–${antardasha} chapter represents a season of intellectual consolidation, institutional respect, and principled compounding. Opportunities expand naturally when aligned with ethical craftsmanship and deep domain expertise.`;
    watchOut = "Avoid expanding into too many parallel ventures that divide your leadership bandwidth.";
    action = "Focus your resources on your single most credible asset and systematize its delivery.";
  } else if (mahadasha === "Saturn") {
    plainWords = `The ${mahadasha}–${antardasha} period acts as an institutional stress-test, stripping away fragile shortcuts to build unbreakable foundations. What you construct with patience during this cycle remains permanently resilient.`;
    watchOut = "Do not mistake deliberate architectural compounding for a lack of forward progress.";
    action = "Embrace rigorous daily systems, honor commitments to the letter, and eliminate inefficient operational clutter.";
  } else if (mahadasha === "Mercury") {
    plainWords = `Under the ${mahadasha}–${antardasha} cycle, commercial agility, communication networks, and analytical clarity reach their annual peak. It is an ideal window for product launches, negotiations, and quantitative optimization.`;
    watchOut = "Do not allow high intellectual velocity to cause scattered attention or mental restlessness.";
    action = "Publish your work, formalize partnership agreements, and optimize your commercial pricing structure.";
  } else {
    plainWords = `The ${mahadasha}–${antardasha} period provides a stable operating runway where disciplined consistency yields predictable, reliable progress across all major life pillars.`;
    watchOut = "Avoid complacency; maintain steady momentum even when external pressures temporarily soften.";
    action = "Set three measurable 90-day targets and review your progress weekly with rigorous accountability.";
  }

  return {
    tier,
    badge,
    title: `Active Cosmic Season: ${mahadasha}–${antardasha} Period`,
    plainWords,
    watchOutFor: watchOut,
    nextMove: action,
    shastricProof: `Vimshottari Dasha Architecture · Mahadasha: ${mahadasha} (${mdDignity}) · Antardasha: ${antardasha} (${adDignity}) · Deterministic Lahiri Ayanamsha`,
  };
}

/**
 * 4. D-9 Navamsha Translation (Post-30 Evolution)
 */
export function translateD9Placement(
  planet: string,
  d9Sign: string,
  isVargottama: boolean,
  isExalted: boolean,
  isDebilitated: boolean
): HumanImpactCard {
  let tier: TranslationTier = "TIER_MID";
  let badge: "Your Natural Edge" | "Steady Engine (Needs Structure)" | "Your Blind Spot & Fix" = "Steady Engine (Needs Structure)";

  if (isVargottama || isExalted) {
    tier = "TIER_HIGH";
    badge = "Your Natural Edge";
  } else if (isDebilitated) {
    tier = "TIER_LOW";
    badge = "Your Blind Spot & Fix";
  }

  const statusLabel = isVargottama ? "Vargottama (Harmonized Across D-1 & D-9)" : isExalted ? "Exalted (Supreme Inner Power)" : isDebilitated ? "Conscious Cultivation Required" : `Placed in ${d9Sign}`;

  const plainWords = (isVargottama || isExalted)
    ? `As you mature past age 30, ${planet}'s core qualities become an unshakeable inner anchor. What felt like an uphill learning curve in youth transforms into your most dependable instinct.`
    : isDebilitated
    ? `In your mature years, ${planet}'s domain requires conscious systems rather than passive reliance. Deliberate discipline in this area builds profound, authentic mastery.`
    : `Your post-30 personal evolution stabilizes ${planet}'s expression, providing reliable character maturity and consistent decision clarity.`;

  const watchOut = isDebilitated
    ? `Do not neglect this domain under the assumption that past habits will suffice; build explicit checklists.`
    : `Do not take your natural post-30 strength for granted; continue refining your core craft.`;

  const action = `Review how you handle ${planet}'s themes today compared to five years ago, and formalize your best operating practices.`;

  return {
    tier,
    badge,
    title: `${planet} Maturity Blueprint: D-9 Navamsha in ${d9Sign}`,
    plainWords,
    watchOutFor: watchOut,
    nextMove: action,
    shastricProof: `D-9 Navamsha Coordinate: ${planet} in ${d9Sign} · Dignity Status: ${statusLabel} · Parashari Canonical Varga`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML RENDERING HELPER (70/30 SPLIT & DEVANAGARI HYGIENE)
// ─────────────────────────────────────────────────────────────────────────────

export interface RenderCardOptions {
  showShastricLedger?: boolean;
  accentColor?: string;
  customStyle?: string;
}

export function renderHumanImpactCardHtml(card: HumanImpactCard, options: RenderCardOptions = {}): string {
  const { showShastricLedger = true, accentColor, customStyle = "" } = options;

  let borderColor = "var(--border-gold-strong)";
  let badgeBg = "rgba(201,169,97,0.15)";
  let badgeColor = "var(--gold-bright)";

  if (card.tier === "TIER_HIGH") {
    borderColor = accentColor || "var(--emerald)";
    badgeBg = "rgba(16,185,129,0.14)";
    badgeColor = "var(--emerald-bright)";
  } else if (card.tier === "TIER_LOW") {
    borderColor = accentColor || "var(--amber)";
    badgeBg = "rgba(245,158,11,0.14)";
    badgeColor = "var(--amber)";
  }

  return `
<div class="luxury-card human-translation-card" style="border-left:4px solid ${borderColor};margin-bottom:12px;padding:12px 14px;background:var(--surface-elevated);border-radius:4px;${customStyle}">
  <!-- Card Header & Badge -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <div style="font-family:'Cinzel',serif;font-weight:700;font-size:11.5px;color:var(--ivory);letter-spacing:0.04em;">
      ${escapeHtml(card.title)}
    </div>
    <span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:8.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:${badgeBg};color:${badgeColor};border:1px solid ${borderColor};">
      ✦ ${escapeHtml(card.badge)}
    </span>
  </div>

  <!-- 3-Beat Human Impact Core -->
  <div style="display:flex;flex-direction:column;gap:6px;font-size:10.2px;line-height:1.45;">
    <!-- Beat 1: In Plain Words -->
    <div>
      <span style="font-weight:700;color:var(--gold-bright);text-transform:uppercase;font-size:8.5px;letter-spacing:0.06em;display:block;margin-bottom:2px;">
        💡 In Plain Words: Real-Life Translation
      </span>
      <p style="color:var(--ivory);margin:0;">${escapeHtml(card.plainWords)}</p>
    </div>

    <!-- Beat 2: Watch Out For -->
    <div style="background:rgba(255,255,255,0.02);padding:6px 8px;border-radius:3px;border-left:2px solid var(--amber);">
      <span style="font-weight:700;color:var(--amber);text-transform:uppercase;font-size:8px;letter-spacing:0.06em;display:block;margin-bottom:1px;">
        ⚠️ Watch Out For: Honest Blind Spot
      </span>
      <p style="color:var(--ivory-dim);margin:0;font-size:9.5px;">${escapeHtml(card.watchOutFor)}</p>
    </div>

    <!-- Beat 3: Your Next Move -->
    <div style="background:rgba(16,185,129,0.03);padding:6px 8px;border-radius:3px;border-left:2px solid var(--emerald-bright);">
      <span style="font-weight:700;color:var(--emerald-bright);text-transform:uppercase;font-size:8px;letter-spacing:0.06em;display:block;margin-bottom:1px;">
        🎯 Your Next Move: Tomorrow's Action
      </span>
      <p style="color:var(--ivory-dim);margin:0;font-size:9.5px;">${escapeHtml(card.nextMove)}</p>
    </div>
  </div>

  ${showShastricLedger && card.shastricProof ? `
  <!-- Shastric Proof Strip (Bottom Ledger) -->
  <div style="margin-top:8px;padding-top:6px;border-top:1px dashed var(--border-gold);display:flex;justify-content:space-between;align-items:center;font-size:8px;color:var(--ivory-mute);font-family:'JetBrains Mono',monospace;">
    <span><strong style="color:var(--gold-dim);">PROOF LEDGER:</strong> ${escapeHtml(card.shastricProof)}</span>
    <span style="color:var(--gold-dim);">Deterministic Classical Shastra &middot; astrolife.io</span>
  </div>
  ` : ""}
</div>`;
}

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
