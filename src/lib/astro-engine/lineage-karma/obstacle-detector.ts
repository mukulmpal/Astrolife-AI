// src/lib/astro-engine/lineage-karma/obstacle-detector.ts
// ============================================================================
// SPECIFIC REAL-LIFE OBSTACLE DETECTOR (The "Pandit Ji Pitru Claim" Deconstructed)
// Diagnoses:
// 1. Marriage Delay / Friction (The Kula Expansion Barrier)
// 2. Progeny Blockage / Miscarriage (The Lineage Prana Choke)
// 3. 99% Career Stagnation (The Bhagya-Karma Fuel Gap)
// 4. Health & Wealth Leaks (The 2H/8H Ancestral Debt)
// ============================================================================

import type { ChartData } from "../calculations";
import type { ObstacleDiagnosis } from "./types";

export function detectLineageObstacles(chart: ChartData): ObstacleDiagnosis[] {
  const obstacles: ObstacleDiagnosis[] = [];

  const planets = chart.planets || {};
  const sun = planets.Sun;
  const moon = planets.Moon;
  const mars = planets.Mars;
  const mercury = planets.Mercury;
  const jupiter = planets.Jupiter;
  const venus = planets.Venus;
  const saturn = planets.Saturn;
  const rahu = planets.Rahu;
  const ketu = planets.Ketu;

  // Helper functions
  const isAfflicted = (houseNum: number) => {
    return (
      rahu?.house === houseNum ||
      ketu?.house === houseNum ||
      saturn?.house === houseNum ||
      mars?.house === houseNum
    );
  };

  // ── 1. MARRIAGE DELAY / FRICTION (Kula Expansion) ─────────────────────────
  const marriageSignatures: string[] = [];
  let marriageSeverity: "None" | "Mild" | "Noticeable" | "Critical" = "None";

  if (saturn?.house === 7) {
    marriageSignatures.push("Saturn in 7th House: Saturnian gravity and testing in close partnerships");
  }
  if (rahu?.house === 7 || ketu?.house === 7) {
    marriageSignatures.push("Nodal axis on 1/7 or in 7th: Karmic relationship lessons and sudden attraction/distance swings");
  }
  if (venus?.house && [6, 8, 12].includes(venus.house)) {
    marriageSignatures.push(`Venus in House ${venus.house}: Emotional vulnerability and delayed relational ease`);
  }
  // BNN check: Venus conjunct Ketu or Venus conjunct Rahu
  if (venus?.sign && (venus.sign === ketu?.sign || venus.sign === rahu?.sign)) {
    marriageSignatures.push("Venus-Nodes alignment (BNN): Female lineage unfulfilled expectations or Stree Rina signature");
  }
  if (rahu?.house === 2) {
    marriageSignatures.push("Rahu in 2nd House: Re-defining family values before marriage can take permanent root");
  }

  if (marriageSignatures.length >= 3) marriageSeverity = "Critical";
  else if (marriageSignatures.length === 2) marriageSeverity = "Noticeable";
  else if (marriageSignatures.length === 1) marriageSeverity = "Mild";

  obstacles.push({
    domain: "Marriage",
    active: marriageSeverity !== "None",
    severity: marriageSeverity,
    classicalSignatures: marriageSignatures,
    humanExperienceText:
      marriageSeverity === "None"
        ? "Relational partnerships enjoy natural ease and mutual understanding."
        : "You may feel that relationships require extra patience, clear emotional boundaries, and maturity. Meeting the right partner takes deliberate discernment rather than impulsive romance.",
    ancestralRootText:
      "A past pattern in the extended family where relationships were heavy with duty or unspoken sacrifices. The native is tasked to build a conscious, equal partnership rather than repeating silent compromises.",
    unblockingRemedy:
      "Avoid rushed marital decisions. Practice honest emotional expression without suppressing your needs. Honor elder women in the family with spontaneous gifts or respectful service.",
  });

  // ── 2. PROGENY & LINEAGE PRANA CHOKE ─────────────────────────────────────
  const progenySignatures: string[] = [];
  let progenySeverity: "None" | "Mild" | "Noticeable" | "Critical" = "None";

  if (rahu?.house === 5 && saturn?.house === 5) {
    progenySignatures.push("Combined malefic presence in 5th House: Severe ancestral progeny trial");
  } else if (ketu?.house === 5) {
    progenySignatures.push("Ketu in 5th House: Detachment or initial delay regarding children");
  } else if (rahu?.house === 5) {
    progenySignatures.push("Rahu in 5th House: Unconventional progeny paths or initial timing adjustments");
  }
  if (jupiter?.house && [6, 8, 12].includes(jupiter.house)) {
    progenySignatures.push(`Jupiter (Putrakaraka) in House ${jupiter.house}: Delayed manifestation of parental joy`);
  }
  if (jupiter?.dignity === "Debilitated") {
    progenySignatures.push("Jupiter in Debilitation: Spiritual remedies required to fortify lineage seed");
  }

  if (progenySignatures.length >= 2) progenySeverity = "Noticeable";
  else if (progenySignatures.length === 1) progenySeverity = "Mild";

  obstacles.push({
    domain: "Progeny",
    active: progenySeverity !== "None",
    severity: progenySeverity,
    classicalSignatures: progenySignatures,
    humanExperienceText:
      progenySeverity === "None"
        ? "Lineage continuity and relationship with youth/children flows with natural vitality."
        : "Conception, child planning, or emotional connection with the next generation may require emotional calm, reduced stress, and purposeful alignment.",
    ancestralRootText:
      "The 5th house is the physical fruit of the 9th house (ancestral roots). When blocked, it signals that the lineage prana needs to be nourished through conscious intention, prayer, and family healing.",
    unblockingRemedy:
      "Support orphanages or children's education. Feed birds and stray animals regularly on Thursdays. Light a lamp to the ancestral deity seeking blessings for the next generation.",
  });

  // ── 3. 99% CAREER STAGNATION (The Bhagya-Karma Fuel Gap) ─────────────────
  const careerSignatures: string[] = [];
  let careerSeverity: "None" | "Mild" | "Noticeable" | "Critical" = "None";

  // Check Sun with Rahu or Saturn
  if (sun?.sign && (sun.sign === rahu?.sign || sun.sign === saturn?.sign)) {
    careerSignatures.push("Sun afflicted by Rahu/Saturn: Shadow on father's legacy and authority friction at critical thresholds");
  }
  // Check 9th house / 9th lord
  if (isAfflicted(9)) {
    careerSignatures.push("9th House (Bhagya / Ancestral Grace) under planetary pressure");
  }
  // Check Sun in 10th with strong demands
  if (sun?.house === 10 && (saturn?.house === 7 || saturn?.house === 10)) {
    careerSignatures.push("Sun in 10th with Saturnian opposition: Massive effort required before institutional acknowledgment");
  }
  if (moon?.house === 12 && mars?.house === 12) {
    careerSignatures.push("Moon-Mars in 12th: Psychological self-sabotage or feeling invisible at the finish line");
  }

  if (careerSignatures.length >= 3) careerSeverity = "Critical";
  else if (careerSignatures.length === 2) careerSeverity = "Noticeable";
  else if (careerSignatures.length === 1) careerSeverity = "Mild";

  obstacles.push({
    domain: "Career_99_Stagnation",
    active: careerSeverity !== "None",
    severity: careerSeverity,
    classicalSignatures: careerSignatures,
    humanExperienceText:
      careerSeverity === "None"
        ? "Career efforts transition smoothly into public recognition and reward."
        : "You give 100% effort and easily reach 90% of your goal, but the final 10% (final approvals, payment, contract signing) frequently stalls or faces sudden bureaucratic friction.",
    ancestralRootText:
      "Inheriting the paternal struggle script: 'Hard work will not be acknowledged easily.' The subconscious expects struggle before success, unconsciously creating high tension right at the finish line.",
    unblockingRemedy:
      "Offer water to the rising Sun (Arghya) with the Gayatri Mantra. Genuinely seek father's or elder mentor's blessing before final deals. When a deal reaches 90%, consciously practice detachment and inner surrender.",
  });

  // ── 4. HEALTH & WEALTH LEAKS (The 2H/8H Ancestral Debt) ────────────────────
  const wealthSignatures: string[] = [];
  let wealthSeverity: "None" | "Mild" | "Noticeable" | "Critical" = "None";

  if (rahu?.house === 2 && ketu?.house === 8) {
    wealthSignatures.push("Rahu in 2nd / Ketu in 8th axis: Reorganization of family wealth and sudden expenditure cycles");
  }
  if (isAfflicted(2) && isAfflicted(8)) {
    wealthSignatures.push("2nd/8th axis severely burdened: Ancestral debt (Pitru Rina) regarding money or property");
  }

  if (wealthSignatures.length >= 2) wealthSeverity = "Noticeable";
  else if (wealthSignatures.length === 1) wealthSeverity = "Mild";

  obstacles.push({
    domain: "Health_Wealth_Leak",
    active: wealthSeverity !== "None",
    severity: wealthSeverity,
    classicalSignatures: wealthSignatures,
    humanExperienceText:
      wealthSeverity === "None"
        ? "Accumulated savings and physical vitality remain stable and protected."
        : "Money comes in well, but sudden family obligations, unexpected home expenses, or sudden investments deplete cash reserves before savings can build up.",
    ancestralRootText:
      "Inherited financial insecurity: The lineage holds an unspoken belief that accumulated wealth brings dispute, loss, or heavy obligation, triggering an unconscious impulse to dissipate funds.",
    unblockingRemedy:
      "Maintain a strictly separated personal emergency fund. Never enter speculative joint ventures with distant relatives without written clarity. Donate grain (barley/wheat) to community kitchens on Saturdays.",
  });

  return obstacles;
}
