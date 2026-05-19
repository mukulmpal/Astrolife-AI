// AstroLife Family Karma Grid v2 — Classical Parashari Jyotish + Kaal Sarp Dosha
import type { ChartData } from "./calculations";

export type Language = "hinglish" | "hindi" | "english";
export type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";
export type FamilyRole = "self" | "father" | "mother" | "spouse" | "child" | "sibling" | "grandparent" | "other";
export type RiskLevel = "low" | "moderate" | "high" | "sensitive";

export type KaalSarpType =
  | "Anant" | "Kulik" | "Vasuki" | "Shankhpal"
  | "Padma" | "Mahapadma" | "Takshak" | "Karkotak"
  | "Shankhnaad" | "Patak" | "Vishakta" | "Sheshanaag";

export type KaalSarpSeverity = "full" | "partial" | "none";

export type KaalSarpResult = {
  present: boolean;
  severity: KaalSarpSeverity;
  type?: KaalSarpType;
  rahuHouse?: number;
  ketuHouse?: number;
  planetsOutside?: Planet[];
  planetsInside?: Planet[];
  description: string;
  familyImpact: string;
  remedies: string[];
};

export type PlanetPlacement = {
  planet: Planet;
  house: number;
  sign?: string;
  nakshatra?: string;
  isAfflicted?: boolean;
  isCombust?: boolean;
  isRetrograde?: boolean;
  isExalted?: boolean;
  isDebilitated?: boolean;
};

export type FamilyMemberChart = {
  id: string;
  name?: string;
  role: FamilyRole;
  d1: PlanetPlacement[];
  divisionalCharts?: Array<{ name: "D9"; planets: PlanetPlacement[] }>;
  dasha?: { mahadasha: Planet };
};

export type FamilySynastryInput = {
  language?: Language;
  members: FamilyMemberChart[];
};

export type FamilyPatternResult = {
  id: string;
  title: string;
  area:
    | "marriage_delay" | "children_awareness" | "ancestral_pattern"
    | "court_litigation" | "property_dispute" | "sudden_home_sale"
    | "parent_karma" | "sibling_dynamic" | "family_health_awareness"
    | "wealth_inheritance" | "kaal_sarp_family";
  score: number;
  riskLevel: RiskLevel;
  paragraph: string;
  indicators: string[];
  safeRemedies: string[];
};

// ─── CONVERTER: ChartData → FamilyMemberChart ────────────────────────────────

export function chartToFamilyMember(
  chart: ChartData,
  role: FamilyRole,
  id: string,
  name?: string,
): FamilyMemberChart {
  const COMBUST_ORB: Record<string, number> = {
    Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
  };

  const d1: PlanetPlacement[] = Object.entries(chart.planets).map(([pName, pd]) => {
    const isCombust =
      pName !== "Sun" && pName !== "Rahu" && pName !== "Ketu"
        ? Math.abs(pd.lon - (chart.planets["Sun"]?.lon ?? 0)) % 360 <= (COMBUST_ORB[pName] ?? 15)
        : false;
    return {
      planet: pName as Planet,
      house: pd.house,
      sign: pd.sign,
      nakshatra: pd.nakshatra,
      isAfflicted: pd.dignity === "Debilitated",
      isCombust,
      isRetrograde: pd.retrograde,
      isExalted: pd.dignity?.startsWith("Exalted"),
      isDebilitated: pd.dignity === "Debilitated",
    };
  });

  const activeMD = chart.dashas[0];

  return {
    id,
    name: name || chart.name,
    role,
    d1,
    dasha: activeMD ? { mahadasha: activeMD.planet as Planet } : undefined,
  };
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function planetsInHouses(planets: PlanetPlacement[], houses: number[]) {
  return planets.filter((p) => houses.includes(p.house));
}

function hasPlanet(planets: PlanetPlacement[], planet: Planet, houses?: number[]) {
  return planets.some((p) => p.planet === planet && (!houses || houses.includes(p.house)));
}

function getPlanet(planets: PlanetPlacement[], planet: Planet) {
  return planets.find((p) => p.planet === planet);
}

function memberLabel(m: FamilyMemberChart) {
  return m.name || m.role;
}

function riskFromScore(score: number): RiskLevel {
  if (score >= 75) return "high";
  if (score >= 55) return "moderate";
  return "low";
}

function isAfflicted(p: PlanetPlacement | undefined): boolean {
  return !!(p?.isAfflicted || p?.isDebilitated || p?.isCombust);
}

function areConjunct(planets: PlanetPlacement[], p1: Planet, p2: Planet): boolean {
  const a = getPlanet(planets, p1);
  const b = getPlanet(planets, p2);
  return !!(a && b && a.house === b.house);
}

function hasMangalDosha(d1: PlanetPlacement[]): boolean {
  return hasPlanet(d1, "Mars", [1, 2, 4, 7, 8, 12]);
}

function planetAspectsHouse(planets: PlanetPlacement[], planet: Planet, targetHouse: number): boolean {
  const p = getPlanet(planets, planet);
  if (!p) return false;
  const h = p.house;
  const w = (n: number) => ((n - 1 + 12) % 12) + 1;
  const aspects = new Set([w(h + 6)]);
  if (planet === "Mars") { aspects.add(w(h + 3)); aspects.add(w(h + 7)); }
  if (planet === "Jupiter") { aspects.add(w(h + 4)); aspects.add(w(h + 8)); }
  if (planet === "Saturn") { aspects.add(w(h + 2)); aspects.add(w(h + 9)); }
  return aspects.has(targetHouse);
}

// ─── KAAL SARP DOSHA ─────────────────────────────────────────────────────────

const KSD_NAMES: Record<number, KaalSarpType> = {
  1: "Anant", 2: "Kulik", 3: "Vasuki", 4: "Shankhpal",
  5: "Padma", 6: "Mahapadma", 7: "Takshak", 8: "Karkotak",
  9: "Shankhnaad", 10: "Patak", 11: "Vishakta", 12: "Sheshanaag",
};

const KSD_INFO: Record<KaalSarpType, { axis: string; lesson: string; remedy: string }> = {
  Anant:      { axis: "Rahu 1st / Ketu 7th", lesson: "Identity, health aur partnership me karmic journey.", remedy: "Shesh Nag stotra; self-awareness practice daily." },
  Kulik:      { axis: "Rahu 2nd / Ketu 8th", lesson: "Family wealth, speech aur sudden-change me karmic cycles.", remedy: "Lakshmi puja Shukravar; family meal sharing ritual." },
  Vasuki:     { axis: "Rahu 3rd / Ketu 9th", lesson: "Sibling tension, communication aur dharma path confusion.", remedy: "Vasuki stotra; sibling reconciliation rituals." },
  Shankhpal:  { axis: "Rahu 4th / Ketu 10th", lesson: "Ghar ki shanti, mother, property aur career stability.", remedy: "Shankh puja ghar me; mata seva." },
  Padma:      { axis: "Rahu 5th / Ketu 11th", lesson: "Santaan, creativity aur desire fulfillment me delays.", remedy: "Santaan Gopal mantra; Skanda Sashti puja." },
  Mahapadma:  { axis: "Rahu 6th / Ketu 12th", lesson: "Chronic health cycles, debts aur moksha themes.", remedy: "Dhanvantari stotra; seva at hospitals." },
  Takshak:    { axis: "Rahu 7th / Ketu 1st", lesson: "Partnership karma aur marriage delays.", remedy: "Katyayani puja; Vivah Panchami vrat." },
  Karkotak:   { axis: "Rahu 8th / Ketu 2nd", lesson: "Hidden matters, inheritance disputes, sudden upheavals.", remedy: "Mahamrityunjaya japa 1008 times; pitra tarpan." },
  Shankhnaad: { axis: "Rahu 9th / Ketu 3rd", lesson: "Father karma, fortune aur higher dharma confusion.", remedy: "Guru Gayatri; Pitra Paksha tarpan." },
  Patak:      { axis: "Rahu 10th / Ketu 4th", lesson: "Career recognition delays; home vs ambition conflict.", remedy: "Kali Sahasranama; Surya Namaskar with karma dedication." },
  Vishakta:   { axis: "Rahu 11th / Ketu 5th", lesson: "Desire fulfillment delays, elder sibling karma.", remedy: "Hanuman Chalisa daily; share gains with underprivileged." },
  Sheshanaag: { axis: "Rahu 12th / Ketu 6th", lesson: "Subconscious patterns, hidden losses, foreign connections.", remedy: "Sheshnag stotra; Vishnu Sahasranama; meditation." },
};

export function detectKaalSarpDosha(member: FamilyMemberChart): KaalSarpResult {
  const d1 = member.d1;
  const rahu = getPlanet(d1, "Rahu");
  const ketu = getPlanet(d1, "Ketu");

  if (!rahu || !ketu) {
    return { present: false, severity: "none", description: "Rahu/Ketu not available.", familyImpact: "", remedies: [] };
  }

  const rahuH = rahu.house;
  const arc = new Set<number>();
  for (let i = 0; i < 6; i++) arc.add(((rahuH - 1 + i) % 12) + 1);

  const seven: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const inside: Planet[] = [];
  const outside: Planet[] = [];
  for (const pl of seven) {
    const p = getPlanet(d1, pl);
    if (!p) continue;
    (arc.has(p.house) ? inside : outside).push(pl);
  }

  const total = inside.length + outside.length;
  let severity: KaalSarpSeverity = "none";
  if (total > 0) {
    if (outside.length === 0) severity = "full";
    else if (outside.length <= 2) severity = "partial";
  }

  const present = severity !== "none";
  const ksType = KSD_NAMES[rahuH];
  const info = ksType ? KSD_INFO[ksType] : undefined;
  const severityLabel = severity === "full" ? "Purna" : "Ardh";

  const description = present
    ? `${memberLabel(member)}: ${ksType} Kaal Sarp Yoga (${severityLabel}) — ${info?.axis || ""}. ${info?.lesson || ""}`
    : `${memberLabel(member)}: Kaal Sarp Yoga nahi hai.`;

  const familyImpact = present ? `Family impact: ${info?.lesson || ""}` : "";

  const remedies = present && info
    ? [info.remedy, "Om Rahave Namah / Om Ketave Namah — rozana 108 baar jap.", "Trimbakeshwar ya Ujjain me KSD shanti puja karwayein.", "Fear se nahi, awareness se dekhein — KSD wale log extraordinary journeys lete hain."]
    : [];

  return {
    present, severity,
    type: present ? ksType : undefined,
    rahuHouse: rahuH, ketuHouse: ketu.house,
    planetsOutside: outside.length ? outside : undefined,
    planetsInside: inside,
    description, familyImpact, remedies,
  };
}

// ─── SAFE REMEDIES ────────────────────────────────────────────────────────────

const REMEDIES: Record<FamilyPatternResult["area"], string[]> = {
  marriage_delay: [
    "Family communication transparent rakhein; unnecessary pressure aur blame avoid karein.",
    "Venus upaay: Shukravar ko safed mithaayi daan, Lakshmi puja.",
    "7th lord dasha me important relationship decisions carefully timing karein.",
    "Mangal Dosha hone par partner ka chart bhi check karein.",
  ],
  children_awareness: [
    "Medical ya fertility concern ho to qualified doctor ki advice zaroor lein.",
    "Jupiter upaay: Guruvar ko peela food, chana dal, Guru Gayatri mantra.",
    "Family pressure kam karein; couple ko emotional safety dein.",
    "Santaan Gopal mantra ya Skanda Sashti puja beneficial hai.",
  ],
  ancestral_pattern: [
    "Pitra Paksha me ancestors ko tarpan, food daan aur jal arghya dein.",
    "Sun upaay: Ravivar ko tambe ke bartan se suryarghya, Aditya Hridayam path.",
    "Repeated family patterns jaise harsh speech, ego ko consciously break karein.",
    "Simple seva aur family healing conversations priority mein rakhein.",
  ],
  court_litigation: [
    "Documents, agreements aur ownership papers clean rakhein.",
    "Legal matter me qualified lawyer ki advice lein — astrology substitute nahi hai.",
    "Mars-Saturn upaay: Hanuman Chalisa, Shani stotra.",
    "Anger-based decisions aur impulsive signing avoid karein.",
  ],
  property_dispute: [
    "Property papers, registry, loan, inheritance documents verify karein.",
    "4th lord activation par ghar ki deep cleaning aur Vastu correction helpful.",
    "Family meeting me neutral mediator include karein if needed.",
  ],
  sudden_home_sale: [
    "Panic selling avoid karein; property decision financial advice ke baad hi lein.",
    "Rahu dasha me property decisions extra caution se, neutral advisor ke saath.",
    "Home maintenance, leakage, boundary par timely attention dein.",
  ],
  parent_karma: [
    "Pitru dosha upaay: Shraddha, tarpan, Pitra Gayatri mantra.",
    "Parents ke saath boundaries aur respect dono maintain karein.",
    "Sun-Saturn upaay: Surya puja aur Shani Shanti havan.",
  ],
  sibling_dynamic: [
    "Siblings ke saath property, money discussions written clarity se karein.",
    "3rd lord antardasha me sibling communication zyada careful honi chahiye.",
    "Mars/Mercury active hon to speech aur impulse control extra zaroori.",
  ],
  family_health_awareness: [
    "Moon upaay: Somvar vrat, chandraghya, white food, emotional journaling.",
    "Repeated health concerns ko doctor consultation se handle karein.",
    "6th/8th lord dasha me health insurance aur preventive checkup critical.",
  ],
  wealth_inheritance: [
    "Inheritance aur shared assets me transparency rakhein.",
    "Rahu in 2/8 active ho to speculative investments se bachein.",
    "Jupiter-Venus upaay: Shri Suktam, Lakshmi puja.",
  ],
  kaal_sarp_family: [
    "Nagpanchami par Nag devata ko doodh chadhayen.",
    "Om Rahave Namah / Om Ketave Namah — rozana 108 baar jap.",
    "Trimbakeshwar ya Ujjain me Kaal Sarp shanti puja karwayein.",
    "Fear se nahi, awareness se dekhein.",
  ],
};

// ─── PATTERN ANALYZERS ────────────────────────────────────────────────────────

export function analyzeMarriageDelayPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);
    const venus = getPlanet(d1, "Venus");
    const jupiter = getPlanet(d1, "Jupiter");

    const seventhStress = planetsInHouses(d1, [7]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet) || p.isAfflicted);
    if (seventhStress.length) { score += 10; indicators.push(`${lbl}: 7th house has patience/karma indicators.`); }
    if (hasMangalDosha(d1)) { score += 8; indicators.push(`${lbl}: Mangal Dosha (Mars in 1/2/4/7/8/12) — partner matching important.`); }
    if (planetAspectsHouse(d1, "Saturn", 7)) { score += 8; indicators.push(`${lbl}: Saturn aspects 7th — commitment and timing lessons.`); }
    if (hasPlanet(d1, "Ketu", [7])) { score += 8; indicators.push(`${lbl}: Ketu in 7th — past-life partnership karma.`); }
    if (hasPlanet(d1, "Rahu", [7])) { score += 6; indicators.push(`${lbl}: Rahu in 7th — unconventional relationship path.`); }
    if (isAfflicted(venus)) { score += 8; indicators.push(`${lbl}: Venus needs careful alignment.`); }
    if (venus?.isCombust) { score += 6; indicators.push(`${lbl}: Venus combust — relationship desire suppressed.`); }
    if (isAfflicted(jupiter)) { score += 6; indicators.push(`${lbl}: Jupiter blessing factor needs support.`); }
    if (areConjunct(d1, "Venus", "Saturn") || areConjunct(d1, "Venus", "Rahu")) {
      score += 8; indicators.push(`${lbl}: Venus conjunct Saturn/Rahu — classical vivaah badha indicator.`);
    }
  }

  const crossCount = input.members.filter((m) =>
    planetsInHouses(m.d1, [7]).some((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet))
  ).length;
  if (crossCount >= 2) { score += 12; indicators.push(`Cross-family: ${crossCount} members me 7th house stress repeat.`); }

  score = clamp(score);
  return {
    id: "marriage_delay", title: "Family Marriage Delay Pattern", area: "marriage_delay",
    score, riskLevel: riskFromScore(score),
    paragraph: "Family me shaadi late hone ka pattern tab strong hota hai jab multiple members ke charts me 7th house, Venus, Jupiter ya D9 par Saturn/Rahu/Ketu/Mars ka influence repeat hota hai. Mangal Dosha, Venus combust, Venus-Saturn/Rahu conjunction aur Saturn ki 7th par drishti bhi classical vivaah badha indicators hain. Iska meaning marriage denial nahi — balki relationship readiness, partner compatibility aur timing ki lesson family system me repeat ho rahi hai.",
    indicators, safeRemedies: REMEDIES.marriage_delay,
  };
}

export function analyzeChildrenAwarenessPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);
    const jupiter = getPlanet(d1, "Jupiter");

    const fifthStress = planetsInHouses(d1, [5]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet) || p.isAfflicted);
    if (fifthStress.length) { score += 12; indicators.push(`${lbl}: 5th house (Putra Bhava) has child/lineage patience indicators.`); }
    if (hasPlanet(d1, "Ketu", [5])) { score += 10; indicators.push(`${lbl}: Ketu in 5th — past-life karmic tie with children.`); }
    if (hasPlanet(d1, "Rahu", [5])) { score += 8; indicators.push(`${lbl}: Rahu in 5th — unconventional children path.`); }
    if (isAfflicted(jupiter)) { score += 10; indicators.push(`${lbl}: Jupiter (Putrakaraka) needs support.`); }
    if (planetAspectsHouse(d1, "Saturn", 5)) { score += 8; indicators.push(`${lbl}: Saturn aspects 5th — delayed but eventual putra sukha.`); }
    if (areConjunct(d1, "Jupiter", "Saturn") || areConjunct(d1, "Jupiter", "Rahu")) {
      score += 10; indicators.push(`${lbl}: Jupiter-Saturn/Rahu conjunction — Putrakaraka under pressure.`);
    }
  }

  score = clamp(score);
  return {
    id: "children_awareness", title: "Children & Lineage Awareness Pattern", area: "children_awareness",
    score, riskLevel: riskFromScore(score),
    paragraph: "Ghar me bachchon se related delay ya pressure ko 5th house (Putra Bhava), Jupiter (Putrakaraka) se read karna chahiye. Ketu in 5th past-life santaan karma hai. Saturn ki 5th par drishti delays deta hai lekin deny nahi karta. Ye engine infertility prediction ya medical conclusion nahi deta. Real concern me doctor consultation zaroori hai.",
    indicators, safeRemedies: REMEDIES.children_awareness,
  };
}

export function analyzeAncestralPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);
    const sun = getPlanet(d1, "Sun");
    const moon = getPlanet(d1, "Moon");

    const heavyHouses = planetsInHouses(d1, [4, 8, 9, 12]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet));
    if (heavyHouses.length >= 2) { score += 12; indicators.push(`${lbl}: Multiple ancestral house activations (4/9/12).`); }
    if (isAfflicted(sun)) { score += 8; indicators.push(`${lbl}: Afflicted Sun — father-line may carry unresolved lessons.`); }
    if (isAfflicted(moon)) { score += 8; indicators.push(`${lbl}: Afflicted Moon — mother/emotional line conditioning.`); }
    if (areConjunct(d1, "Sun", "Rahu") || areConjunct(d1, "Sun", "Ketu")) {
      score += 12; indicators.push(`${lbl}: Sun-Rahu/Ketu (Surya Grahan Yoga) — strong Pitru Dosha indicator.`);
    }
    if (hasPlanet(d1, "Saturn", [9])) { score += 8; indicators.push(`${lbl}: Saturn in 9th — father relationship and dharma path carry karmic weight.`); }
    if (areConjunct(d1, "Sun", "Saturn")) { score += 8; indicators.push(`${lbl}: Sun-Saturn conjunction — father-authority karmic tension.`); }
  }

  score = clamp(score);
  return {
    id: "ancestral_pattern", title: "Ancestral & Pitru Karma Pattern", area: "ancestral_pattern",
    score, riskLevel: riskFromScore(score),
    paragraph: "Ancestral karma pattern ko 4th, 9th house, Sun, Moon, Saturn aur Rahu-Ketu ke through read karna chahiye. Sun-Rahu ya Sun-Ketu conjunction (Surya Grahan Yoga) classical Pitru Dosha indicator hai — iska arth 'cursed' nahi, balki 'father-line se kuch unresolved hai' hai. Awareness, pitra tarpan, seva aur family dialogue se ise soften kiya ja sakta hai.",
    indicators, safeRemedies: REMEDIES.ancestral_pattern,
  };
}

export function analyzeCourtLitigationPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);

    const conflictPlanets = planetsInHouses(d1, [6, 8, 12]).filter((p) => ["Mars", "Saturn", "Rahu", "Ketu", "Mercury"].includes(p.planet));
    if (conflictPlanets.length) { score += 10; indicators.push(`${lbl}: 6/8/12 houses show dispute/document caution indicators.`); }
    if (areConjunct(d1, "Mars", "Saturn")) { score += 10; indicators.push(`${lbl}: Mars-Saturn conjunction — conflict-authority tension.`); }
    if (hasPlanet(d1, "Rahu", [6])) { score += 8; indicators.push(`${lbl}: Rahu in 6th — disputes may involve unusual elements.`); }
    if (hasPlanet(d1, "Mercury", [6, 8, 12])) { score += 8; indicators.push(`${lbl}: Mercury in conflict houses — paperwork clarity critical.`); }
  }

  score = clamp(score);
  return {
    id: "court_litigation", title: "Court Case, Litigation & Document Caution", area: "court_litigation",
    score, riskLevel: score >= 70 ? "sensitive" : riskFromScore(score),
    paragraph: "Court case ya document dispute ka pattern tab strong hota hai jab 6th, 8th, 12th houses, Mars, Saturn, Rahu, Ketu aur Mercury repeatedly activate hote hain. Mars-Saturn conjunction classical 'kaanoon se takraav' indicator hai. Ye legal verdict nahi — sirf caution indicator hai. Real legal issue me lawyer mandatory hai.",
    indicators, safeRemedies: REMEDIES.court_litigation,
  };
}

export function analyzePropertyDisputePattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);

    const homeStress = planetsInHouses(d1, [4, 8, 12]).filter((p) => ["Mars", "Saturn", "Rahu", "Ketu"].includes(p.planet));
    if (homeStress.length) { score += 12; indicators.push(`${lbl}: D1 home/property houses show caution indicators.`); }
    if (hasPlanet(d1, "Rahu", [4])) { score += 8; indicators.push(`${lbl}: Rahu in 4th — unusual home situations or relocation patterns.`); }
    if (hasPlanet(d1, "Saturn", [4])) { score += 6; indicators.push(`${lbl}: Saturn in 4th — home comfort delayed but eventually stable.`); }
    if (hasPlanet(d1, "Mars", [4])) { score += 8; indicators.push(`${lbl}: Mars in 4th — property conflicts or home tensions possible.`); }
  }

  score = clamp(score);
  return {
    id: "property_dispute", title: "Property Dispute & Home Stability Pattern", area: "property_dispute",
    score, riskLevel: riskFromScore(score),
    paragraph: "Property dispute ka pattern 4th house, Mars, Saturn, Rahu aur Ketu se judge karna chahiye. Rahu in 4th unusual ya foreign property situations la sakta hai. Saturn in 4th delays deta hai lekin eventually stable ghar milta hai. Same family me multiple charts me 4th/8th/12th activation repeat ho to ownership, inheritance ya family asset sharing me tension aa sakti hai.",
    indicators, safeRemedies: REMEDIES.property_dispute,
  };
}

export function analyzeSuddenHomeSalePattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);

    const saleD1 = planetsInHouses(d1, [4, 8, 12]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet));
    if (saleD1.length) { score += 12; indicators.push(`${lbl}: D1 indicates property/home pressure.`); }
    const activePlanet = m.dasha?.mahadasha;
    if (activePlanet && ["Saturn", "Rahu", "Ketu", "Mars"].includes(activePlanet)) {
      score += 8; indicators.push(`${lbl}: ${activePlanet} Mahadasha — property restructuring themes may activate.`);
    }
  }

  score = clamp(score);
  return {
    id: "sudden_home_sale", title: "Sudden Home Sale / Asset Restructuring", area: "sudden_home_sale",
    score, riskLevel: score >= 70 ? "sensitive" : riskFromScore(score),
    paragraph: "Ghar achanak bik jana, forced relocation ya asset restructuring ka pattern tab examine kiya jata hai jab 4th house, 8th sudden-change house, 12th loss/relocation house aur Saturn/Rahu/Ketu/Mars activate hote hain. Ye definite prediction nahi — practical alert hai: papers check karo, property maintain karo, panic sale avoid karo.",
    indicators, safeRemedies: REMEDIES.sudden_home_sale,
  };
}

export function analyzeParentKarmaPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);
    const sun = getPlanet(d1, "Sun");
    const moon = getPlanet(d1, "Moon");

    const motherStress = planetsInHouses(d1, [4]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet) || p.isAfflicted);
    const fatherStress = planetsInHouses(d1, [9]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet) || p.isAfflicted);

    if (motherStress.length) { score += 10; indicators.push(`${lbl}: 4th house (mata axis) has tension indicators.`); }
    if (fatherStress.length) { score += 10; indicators.push(`${lbl}: 9th house (pita/dharma axis) has karmic themes.`); }
    if (isAfflicted(sun)) { score += 8; indicators.push(`${lbl}: Afflicted Sun (pita karaka) — father relationship needs healing.`); }
    if (isAfflicted(moon)) { score += 8; indicators.push(`${lbl}: Afflicted Moon (mata karaka) — mother/emotional patterns need attention.`); }
    if (areConjunct(d1, "Sun", "Saturn")) { score += 8; indicators.push(`${lbl}: Sun-Saturn conjunction — father-authority karmic tension.`); }
  }

  score = clamp(score);
  return {
    id: "parent_karma", title: "Parent Karma & D12 Pattern", area: "parent_karma",
    score, riskLevel: riskFromScore(score),
    paragraph: "Parent karma 4th house (mata), 9th house (pita), Sun (pita karaka) aur Moon (mata karaka) ke through read kiya jata hai. Sun-Saturn conjunction classical Shrapa Yoga indicator hai. Jab multiple members me same parent-axis stress repeat ho, to family me unexpressed expectations, authority conflicts ya emotional neglect ke patterns ho sakte hain. D12 parents ke debts aur blessings dono show karta hai.",
    indicators, safeRemedies: REMEDIES.parent_karma,
  };
}

export function analyzeSiblingDynamicPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);
    const mars = getPlanet(d1, "Mars");
    const mercury = getPlanet(d1, "Mercury");

    const sibStress = planetsInHouses(d1, [3]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet) || p.isAfflicted);
    if (sibStress.length) { score += 12; indicators.push(`${lbl}: 3rd house (Sahaja Bhava/sibling axis) has tension indicators.`); }
    if (isAfflicted(mars)) { score += 8; indicators.push(`${lbl}: Afflicted Mars — sibling competition or anger management needs awareness.`); }
    if (isAfflicted(mercury)) { score += 6; indicators.push(`${lbl}: Afflicted Mercury — communication clarity with siblings important.`); }
    if (hasPlanet(d1, "Mars", [3])) { score += 8; indicators.push(`${lbl}: Mars in 3rd — strong-willed; sibling boundaries help.`); }
    if (hasPlanet(d1, "Ketu", [3])) { score += 6; indicators.push(`${lbl}: Ketu in 3rd — past-life sibling karma.`); }
  }

  score = clamp(score);
  return {
    id: "sibling_dynamic", title: "Sibling Dynamic & 3rd House Pattern", area: "sibling_dynamic",
    score, riskLevel: riskFromScore(score),
    paragraph: "Sibling dynamic 3rd house (Sahaja Bhava), Mars (courage/conflict), aur Mercury (communication) se analyze kiya jata hai. Mars in 3rd siblings ke beech strong-willed competition deta hai. Ketu in 3rd past-life sibling karma darshata hai. Property ya responsibility sharing me tension ho to 3rd/8th house axis critical ho jata hai. Written agreements sibling relationships ko stabilize karte hain.",
    indicators, safeRemedies: REMEDIES.sibling_dynamic,
  };
}

export function analyzeFamilyHealthPattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);

    const healthStress = planetsInHouses(d1, [1, 6, 8, 12]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars", "Moon"].includes(p.planet) || p.isAfflicted);
    if (healthStress.length) { score += 10; indicators.push(`${lbl}: Health-awareness houses show stress monitoring need.`); }
    if (hasPlanet(d1, "Moon", [6, 8, 12])) { score += 8; indicators.push(`${lbl}: Moon in 6/8/12 — emotional health needs regular nurturing.`); }
    if (hasPlanet(d1, "Rahu", [1, 8])) { score += 6; indicators.push(`${lbl}: Rahu in 1/8 — unconventional health patterns; holistic + allopathic combined approach.`); }
    if (areConjunct(d1, "Moon", "Saturn")) { score += 8; indicators.push(`${lbl}: Moon-Saturn (Visha Yoga) — emotional suppression and chronic stress risk.`); }
  }

  score = clamp(score);
  return {
    id: "family_health_awareness", title: "Family Health Awareness Pattern", area: "family_health_awareness",
    score, riskLevel: score >= 70 ? "sensitive" : riskFromScore(score),
    paragraph: "Family me repeated health concerns ko fear ke saath nahi, awareness ke saath read karna chahiye. 1st, 6th, 8th, 12th houses, Moon/Saturn/Rahu/Ketu/Mars repeat ho to family system me stress, burnout ya preventive care ki need dikhti hai. Moon-Saturn conjunction (Visha Yoga) emotional suppression ka classical indicator hai. Ye medical diagnosis nahi — real symptoms me doctor zaroori hai.",
    indicators, safeRemedies: REMEDIES.family_health_awareness,
  };
}

export function analyzeWealthInheritancePattern(input: FamilySynastryInput): FamilyPatternResult {
  let score = 0;
  const indicators: string[] = [];

  for (const m of input.members) {
    const d1 = m.d1;
    const lbl = memberLabel(m);
    const jupiter = getPlanet(d1, "Jupiter");
    const venus = getPlanet(d1, "Venus");

    const wealthStress = planetsInHouses(d1, [2, 8, 11]).filter((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet) || p.isAfflicted);
    if (wealthStress.length) { score += 10; indicators.push(`${lbl}: Wealth/inheritance axis (2/8/11) has caution indicators.`); }
    if (isAfflicted(jupiter)) { score += 8; indicators.push(`${lbl}: Jupiter (Dhana Karaka) needs careful financial decisions.`); }
    if (isAfflicted(venus)) { score += 6; indicators.push(`${lbl}: Afflicted Venus — financial decisions need grounding.`); }
    if (hasPlanet(d1, "Rahu", [2, 8])) { score += 10; indicators.push(`${lbl}: Rahu in 2/8 — sudden wealth fluctuations; avoid speculation.`); }
    if (hasPlanet(d1, "Ketu", [2])) { score += 8; indicators.push(`${lbl}: Ketu in 2nd — past-life non-attachment to wealth.`); }
  }

  score = clamp(score);
  return {
    id: "wealth_inheritance", title: "Wealth & Inheritance Pattern", area: "wealth_inheritance",
    score, riskLevel: riskFromScore(score),
    paragraph: "Family me wealth aur inheritance patterns ko 2nd house (kutumb dhana), 8th house (virasat), 11th house (labha), Jupiter, Venus ke through analyze kiya jata hai. Rahu in 2nd ya 8th sudden wealth fluctuations la sakta hai. Inheritance disputes se bachne ke liye legal documentation aur transparent communication zaroori hai.",
    indicators, safeRemedies: REMEDIES.wealth_inheritance,
  };
}

// ─── KSD FAMILY PATTERN ──────────────────────────────────────────────────────

export function analyzeKaalSarpFamilyPattern(input: FamilySynastryInput): {
  memberResults: Array<{ member: FamilyMemberChart; result: KaalSarpResult }>;
  familyPattern: FamilyPatternResult;
} {
  const memberResults = input.members.map((m) => ({ member: m, result: detectKaalSarpDosha(m) }));
  const affected = memberResults.filter((r) => r.result.present);
  const childrenAffected = affected.filter((r) => r.member.role === "child");
  const fullKSD = affected.filter((r) => r.result.severity === "full");

  let score = 0;
  const indicators: string[] = [];

  for (const { member, result } of memberResults) {
    if (!result.present) continue;
    score += (result.severity === "full" ? 20 : 12) + (member.role === "child" ? 5 : 0);
    indicators.push(result.description);
    if (result.familyImpact) indicators.push(result.familyImpact);
  }

  const parentHasKSD = affected.some((r) => ["self", "father", "mother"].includes(r.member.role));
  if (parentHasKSD && childrenAffected.length > 0) {
    score += 15;
    indicators.push("Cross-generational KSD: Parent aur child dono me Kaal Sarp Yoga — ancestral karmic axis bahut strong hai.");
  }

  score = clamp(score);
  return {
    memberResults,
    familyPattern: {
      id: "kaal_sarp_family", title: "Kaal Sarp Dosha — Family Karmic Axis", area: "kaal_sarp_family",
      score, riskLevel: score >= 70 ? "sensitive" : riskFromScore(score),
      paragraph: `Family me ${affected.length} members me Kaal Sarp Yoga present hai (${childrenAffected.length} bachche, ${fullKSD.length} Purna KSD). Kaal Sarp Yoga ka arth failure nahi — bahut mahaan log iske saath paida hue hain. Iska arth hai Rahu-Ketu axis par karmic lesson extra intense hai. Family me multiple KSD hone par ancestral healing puja, nag puja aur fear-free awareness approach sabse effective hoti hai.`,
      indicators, safeRemedies: REMEDIES.kaal_sarp_family,
    },
  };
}

// ─── MAIN ENGINE ──────────────────────────────────────────────────────────────

export function analyzeFamilySynastry(input: FamilySynastryInput) {
  const { memberResults: ksdResults, familyPattern: ksdPattern } = analyzeKaalSarpFamilyPattern(input);

  const patterns: FamilyPatternResult[] = [
    analyzeMarriageDelayPattern(input),
    analyzeChildrenAwarenessPattern(input),
    analyzeAncestralPattern(input),
    analyzeCourtLitigationPattern(input),
    analyzePropertyDisputePattern(input),
    analyzeSuddenHomeSalePattern(input),
    analyzeParentKarmaPattern(input),
    analyzeSiblingDynamicPattern(input),
    analyzeFamilyHealthPattern(input),
    analyzeWealthInheritancePattern(input),
    ksdPattern,
  ];

  const harmonyScore = clamp(
    100 - Math.round(patterns.reduce((sum, p) => sum + p.score, 0) / patterns.length)
  );

  const topPatterns = [...patterns].sort((a, b) => b.score - a.score).slice(0, 4);

  const childKsdSummary = ksdResults
    .filter((r) => r.member.role === "child" && r.result.present)
    .map((r) => `${memberLabel(r.member)}: ${r.result.type} (${r.result.severity})`)
    .join("; ");

  const narrative =
    `Family Karma Grid harmony score: ${harmonyScore}/100. ` +
    (childKsdSummary ? `Bachcho me Kaal Sarp Dosha: ${childKsdSummary}. ` : "") +
    `Sabse important patterns: ${topPatterns.map((p) => p.title).join(", ")}. ` +
    `Ye analysis symbolic aur awareness-based hai — fixed destiny nahi.`;

  return { harmonyScore, topPatterns, allPatterns: patterns, kaalSarpAnalysis: ksdResults, narrative };
}
