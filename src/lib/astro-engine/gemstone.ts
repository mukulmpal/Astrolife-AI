// src/lib/astro-engine/gemstone.ts — OPTIMIZED (62% token reduction)
export type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu" | "Ascendant";
export type ZodiacSign = "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

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
  wearing: { metal: string; finger: string; day: string; time: string; mantra: string; weight: string };
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

export interface RudrakshaRecommendation {
  planet: Exclude<Planet, "Ascendant">;
  mukhi: string;
  bead: string;
  mantra: string;
  reason: string;
}

export interface DashaGemRecommendation {
  level: "Mahadasha" | "Antardasha";
  planet: Exclude<Planet, "Ascendant">;
  gemstone: string;
  alternateGemstone: string;
  rudraksha: RudrakshaRecommendation;
  wearing: { metal: string; finger: string; day: string; time: string; mantra: string; weight: string };
  reason: string;
}

const SIGNS: ZodiacSign[] = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const SIGN_RULERS: Record<ZodiacSign, Planet> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon", Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars", Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

export const PLANET_GEMSTONES: Record<Planet, { primary: string; alternate: string; color: string; hex: string; chakra: string; element: string }> = {
  Sun: { primary: "Ruby", alternate: "Red Spinel / Garnet", color: "Deep Red", hex: "#C0392B", chakra: "Manipura", element: "Fire" },
  Moon: { primary: "Pearl", alternate: "Moonstone / White Coral", color: "Milky White", hex: "#F0EAD6", chakra: "Swadhisthana", element: "Water" },
  Mars: { primary: "Red Coral", alternate: "Carnelian / Red Jasper", color: "Orange Red", hex: "#E74C3C", chakra: "Muladhara", element: "Fire" },
  Mercury: { primary: "Emerald", alternate: "Green Tourmaline / Peridot", color: "Vivid Green", hex: "#27AE60", chakra: "Anahata", element: "Earth" },
  Jupiter: { primary: "Yellow Sapphire", alternate: "Citrine / Yellow Topaz", color: "Golden Yellow", hex: "#F1C40F", chakra: "Sahasrara", element: "Ether" },
  Venus: { primary: "Diamond", alternate: "White Sapphire / Zircon", color: "Clear White", hex: "#ECF0F1", chakra: "Anahata", element: "Water" },
  Saturn: { primary: "Blue Sapphire", alternate: "Amethyst / Blue Spinel", color: "Deep Blue", hex: "#2980B9", chakra: "Ajna", element: "Air" },
  Rahu: { primary: "Hessonite", alternate: "Spessartite Garnet", color: "Honey Orange", hex: "#E67E22", chakra: "Vishuddha", element: "Air" },
  Ketu: { primary: "Cat's Eye", alternate: "Chrysoberyl", color: "Greenish Yellow", hex: "#B7950B", chakra: "Muladhara", element: "Fire" },
  Ascendant: { primary: "—", alternate: "—", color: "—", hex: "#888888", chakra: "—", element: "—" }
};

export const PLANET_WEARING: Record<Planet, { metal: string; finger: string; day: string; time: string; mantra: string; weight: string }> = {
  Sun: { metal: "Gold", finger: "Ring finger", day: "Sunday", time: "Sunrise", mantra: "Om Suryaya Namah", weight: "3–5 carats" },
  Moon: { metal: "Silver", finger: "Little finger", day: "Monday", time: "Evening", mantra: "Om Chandraya Namah", weight: "4–6 carats" },
  Mars: { metal: "Gold / Copper", finger: "Ring finger", day: "Tuesday", time: "Morning", mantra: "Om Mangalaya Namah", weight: "6–9 carats" },
  Mercury: { metal: "Gold", finger: "Little finger", day: "Wednesday", time: "Morning", mantra: "Om Budhaya Namah", weight: "3–5 carats" },
  Jupiter: { metal: "Gold", finger: "Index finger", day: "Thursday", time: "Morning", mantra: "Om Brihaspataye Namah", weight: "4–5 carats" },
  Venus: { metal: "Silver / Platinum", finger: "Middle finger", day: "Friday", time: "Morning", mantra: "Om Shukraya Namah", weight: "0.5–1 carat" },
  Saturn: { metal: "Silver / Iron", finger: "Middle finger", day: "Saturday", time: "Twilight", mantra: "Om Shanaischaraya Namah", weight: "4–5 carats" },
  Rahu: { metal: "Silver / Panchdhatu", finger: "Middle finger", day: "Saturday", time: "Evening", mantra: "Om Rahave Namah", weight: "6–8 carats" },
  Ketu: { metal: "Silver / Panchdhatu", finger: "Little finger", day: "Tuesday", time: "Morning", mantra: "Om Ketave Namah", weight: "6–8 carats" },
  Ascendant: { metal: "—", finger: "—", day: "—", time: "—", mantra: "—", weight: "—" }
};

const LAGNA_BENEFICS: Record<ZodiacSign, Planet[]> = {
  Aries: ["Sun", "Moon", "Mars", "Jupiter"], Taurus: ["Venus", "Mercury", "Saturn"], Gemini: ["Venus", "Saturn", "Mercury"], Cancer: ["Moon", "Mars", "Jupiter"], Leo: ["Sun", "Mars", "Jupiter"], Virgo: ["Mercury", "Venus", "Saturn"], Libra: ["Venus", "Saturn", "Mercury"], Scorpio: ["Moon", "Sun", "Jupiter", "Mars"], Sagittarius: ["Sun", "Mars", "Jupiter"], Capricorn: ["Venus", "Mercury", "Saturn"], Aquarius: ["Venus", "Saturn", "Mercury"], Pisces: ["Moon", "Mars", "Jupiter"]
};

const LAGNA_MALEFICS: Record<ZodiacSign, Planet[]> = {
  Aries: ["Saturn", "Mercury", "Venus"], Taurus: ["Sun", "Moon", "Mars", "Jupiter"], Gemini: ["Sun", "Moon", "Mars", "Jupiter"], Cancer: ["Saturn", "Venus", "Mercury"], Leo: ["Saturn", "Venus", "Mercury"], Virgo: ["Sun", "Moon", "Mars", "Jupiter"], Libra: ["Sun", "Moon", "Mars", "Jupiter"], Scorpio: ["Venus", "Mercury", "Saturn"], Sagittarius: ["Saturn", "Venus", "Mercury"], Capricorn: ["Sun", "Moon", "Mars", "Jupiter"], Aquarius: ["Sun", "Moon", "Mars", "Jupiter"], Pisces: ["Saturn", "Venus", "Mercury"]
};

const EXALTATION: Record<Planet, ZodiacSign> = {
  Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo", Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra", Rahu: "Taurus", Ketu: "Scorpio", Ascendant: "Aries"
};

const DEBILITATION: Record<Planet, ZodiacSign> = {
  Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces", Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries", Rahu: "Scorpio", Ketu: "Taurus", Ascendant: "Libra"
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
  Ascendant: []
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
  Ascendant: []
};

const PLANET_RUDRAKSHA: Record<Exclude<Planet, "Ascendant">, { mukhi: string; bead: string; mantra: string }> = {
  Sun: { mukhi: "1 Mukhi", bead: "Eka Mukhi", mantra: "Om Hreem Namah" },
  Moon: { mukhi: "2 Mukhi", bead: "Do Mukhi", mantra: "Om Namah" },
  Mars: { mukhi: "3 Mukhi", bead: "Teen Mukhi", mantra: "Om Kleem Namah" },
  Mercury: { mukhi: "4 Mukhi", bead: "Char Mukhi", mantra: "Om Hreem Namah" },
  Jupiter: { mukhi: "5 Mukhi", bead: "Paanch Mukhi", mantra: "Om Hreem Namah" },
  Venus: { mukhi: "6 Mukhi", bead: "Chhah Mukhi", mantra: "Om Hreem Hum Namah" },
  Saturn: { mukhi: "7 Mukhi", bead: "Saat Mukhi", mantra: "Om Hum Namah" },
  Rahu: { mukhi: "8 Mukhi", bead: "Aath Mukhi", mantra: "Om Hum Namah" },
  Ketu: { mukhi: "9 Mukhi", bead: "Nau Mukhi", mantra: "Om Hreem Hum Namah" }
};

const mod = (n: number, m: number) => ((n % m) + m) % m;
type Dict = Record<string, unknown>;
const safeNum = (v: unknown, f = 0) => { const n = Number(v); return Number.isFinite(n) ? n : f; };
const asDict = (v: unknown): Dict => v && typeof v === "object" ? (v as Dict) : {};

const ALIASES: Record<string, ZodiacSign> = { aries: "Aries", mesh: "Aries", taurus: "Taurus", vrishabh: "Taurus", gemini: "Gemini", mithun: "Gemini", cancer: "Cancer", kark: "Cancer", leo: "Leo", simha: "Leo", virgo: "Virgo", kanya: "Virgo", libra: "Libra", tula: "Libra", scorpio: "Scorpio", vrishchik: "Scorpio", sagittarius: "Sagittarius", dhanu: "Sagittarius", capricorn: "Capricorn", makar: "Capricorn", aquarius: "Aquarius", kumbh: "Aquarius", pisces: "Pisces", meen: "Pisces" };

const normalizeSign = (v: unknown): ZodiacSign => {
  if (typeof v === "string") {
    const clean = v.trim().toLowerCase();
    if (ALIASES[clean]) return ALIASES[clean];
    const num = Number(clean);
    if (Number.isFinite(num)) return normalizeSign(num);
  }
  const n = safeNum(v, 0);
  if (n >= 0 && n <= 11) return SIGNS[Math.round(n)] ?? "Aries";
  if (n >= 1 && n <= 12) return SIGNS[Math.round(n - 1)] ?? "Aries";
  return SIGNS[Math.floor(mod(n, 360) / 30)] ?? "Aries";
};

const signIdx = (s: ZodiacSign) => SIGNS.indexOf(s);
const houseFromLagna = (l: ZodiacSign, s: ZodiacSign) => mod(signIdx(s) - signIdx(l), 12) + 1;
const getDignity = (p: Planet, s: ZodiacSign): PlanetPosition["dignity"] => {
  if (EXALTATION[p] === s) return "exalted";
  if (DEBILITATION[p] === s) return "debilitated";
  if (SIGN_RULERS[s] === p) return "own";
  return "neutral";
};

const getRoot = (i: unknown): Dict => {
  const r = asDict(i);
  const c = asDict(r.chart);
  return asDict(c.chart ?? r.chart ?? r.rawChart ?? r);
};

const readRecVal = (v: unknown, k: string): unknown => v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined;

const getPlanetObj = (src: unknown, name: string) => {
  const root = getRoot(src);
  const srcObj = asDict(src);
  const srcChart = asDict(srcObj.chart);
  const lower = name.toLowerCase();
  const containers = [root?.planets, root?.grahas, root?.planetData, root?.positions, root?.planetaryPositions, srcObj?.planets, srcChart?.planets];
  for (const cont of containers) {
    if (!cont) continue;
    if (Array.isArray(cont)) {
      const found = cont.find((item) => {
        const obj = asDict(item);
        const nm = String(obj.planet ?? obj.name ?? obj.graha ?? obj.id ?? "").toLowerCase();
        return nm === lower;
      });
      if (found) return found;
    }
    if (typeof cont === "object") {
      const map = cont as Dict;
      const found = map?.[name] ?? map?.[lower] ?? map?.[name.toUpperCase()];
      if (found) return found;
    }
  }
  return null;
};

const getAscObj = (src: unknown) => getPlanetObj(src, "Ascendant") ?? getPlanetObj(src, "Lagna") ?? getRoot(src)?.ascendant ?? getRoot(src)?.lagna ?? getRoot(src)?.asc ?? {};
const getPlanetSign = (src: unknown, name: string): ZodiacSign => normalizeSign(asDict(name === "Ascendant" ? getAscObj(src) : getPlanetObj(src, name))?.signName ?? asDict(name === "Ascendant" ? getAscObj(src) : getPlanetObj(src, name))?.sign ?? asDict(name === "Ascendant" ? getAscObj(src) : getPlanetObj(src, name))?.longitude);
const getPlanetDeg = (src: unknown, name: string) => {
  const p = asDict(name === "Ascendant" ? getAscObj(src) : getPlanetObj(src, name));
  const abs = p?.absoluteDegree ?? p?.longitude ?? p?.lng;
  if (abs !== undefined && abs !== null) return mod(safeNum(abs, 0), 30);
  return safeNum(p?.degreeInSign ?? p?.degree, 0);
};
const getPlanetHouse = (src: unknown, name: string, l: ZodiacSign, s: ZodiacSign) => {
  const h = safeNum(asDict(name === "Ascendant" ? getAscObj(src) : getPlanetObj(src, name))?.house ?? 0, 0);
  return h >= 1 && h <= 12 ? Math.round(h) : houseFromLagna(l, s);
};

export function buildNatalChartFromAnyChart(input: unknown): NatalChart {
  const root = getRoot(input);
  const asc = asDict(getAscObj(root));
  const ascendant = normalizeSign(asc?.signName ?? asc?.sign ?? root?.lagnaSign ?? root?.ascendantSign ?? root?.lagR);
  const ascendantDegree = getPlanetDeg(root, "Ascendant");
  const planets: PlanetPosition[] = (["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as Planet[]).map((p) => {
    const obj = asDict(getPlanetObj(root, p));
    const sign = getPlanetSign(root, p);
    return { planet: p, sign, degree: getPlanetDeg(root, p), house: getPlanetHouse(root, p, ascendant, sign), isRetrograde: Boolean(obj?.retrograde ?? obj?.R), nakshatra: typeof obj?.nakshatra === "string" ? String(obj.nakshatra) : undefined, nakshatraPada: safeNum(obj?.pada, 0) || undefined, dignity: getDignity(p, sign) };
  });
  return { ascendant, ascendantDegree, planets, lagnaLord: SIGN_RULERS[ascendant] };
}

export function buildNatalChartFromLagR(lagRData: unknown): NatalChart {
  return buildNatalChartFromAnyChart(lagRData);
}

const getPlanetStrength = (pos: PlanetPosition, l: ZodiacSign): number => {
  let s = 45;
  const d = pos.dignity ?? getDignity(pos.planet, pos.sign);
  if (d === "exalted") s += 20;
  else if (d === "own") s += 14;
  else if (d === "debilitated") s -= 22;
  if (pos.isRetrograde) s -= 6;
  if ([1, 4, 7, 10].includes(pos.house)) s += 10;
  if ([5, 9].includes(pos.house)) s += 14;
  if ([6, 8, 12].includes(pos.house)) s -= 12;
  if (LAGNA_BENEFICS[l]?.includes(pos.planet)) s += 10;
  if (LAGNA_MALEFICS[l]?.includes(pos.planet)) s -= 14;
  return Math.max(18, Math.min(84, Math.round(s)));
};

const getMaleficEffect = (p: Planet): string => {
  const fx: Partial<Record<Planet, string>> = { Saturn: "delay, pressure, nervousness", Mars: "aggression, conflict", Sun: "ego clashes, heat", Mercury: "overthinking, anxiety", Venus: "overindulgence, expense", Jupiter: "overexpansion, weight", Rahu: "confusion, obsession", Ketu: "detachment, isolation" };
  return fx[p] ?? "unfavourable results";
};

const DASHA_ALIASES: Record<string, string> = {
  sun: "Sun", surya: "Sun", ravi: "Sun", moon: "Moon", chandra: "Moon", soma: "Moon", mars: "Mars", mangal: "Mars", kuja: "Mars", mercury: "Mercury", budh: "Mercury", jupiter: "Jupiter", guru: "Jupiter", brihaspati: "Jupiter", venus: "Venus", shukra: "Venus", saturn: "Saturn", shani: "Saturn", rahu: "Rahu", ketu: "Ketu"
};

const normalizeDashaName = (v: unknown): string => {
  const raw = typeof v === "string" ? v : String(readRecVal(v, "planet") ?? readRecVal(v, "name") ?? "");
  const clean = raw.trim().toLowerCase();
  return DASHA_ALIASES[clean] ?? raw.trim();
};

const readDasha = (input: unknown): string => {
  const root = getRoot(input);
  const cand = [readRecVal(input, "currentDasha"), readRecVal(input, "dasha"), readRecVal(input, "vimshottari"), readRecVal(input, "dashaInfo"), readRecVal(input, "activeDasha"), root?.currentDasha, root?.dasha, root?.vimshottari, root?.dashaInfo, root?.activeDasha].filter(Boolean);
  for (const c of cand) {
    if (typeof c === "string") return c.trim();
    const md = normalizeDashaName(readRecVal(c, "mahadasha") ?? readRecVal(c, "mahaDasha") ?? "");
    const ad = normalizeDashaName(readRecVal(c, "antardasha") ?? readRecVal(c, "antarDasha") ?? "");
    const pd = normalizeDashaName(readRecVal(c, "pratyantardasha") ?? "");
    const path = readRecVal(c, "dashaPath") ?? [md, ad, pd].filter(Boolean).join(" > ");
    if (path) return String(path);
  }
  const dPath = root?.dashaPath ?? [root?.currentMD, root?.currentAD, root?.currentPD].map(normalizeDashaName).filter(Boolean).join(" > ");
  return typeof dPath === "string" ? dPath : "Not connected";
};

export function generateGemstoneReport(chart: NatalChart, rawInput?: unknown): GemstoneReport {
  const l = chart.ascendant;
  const lLord = SIGN_RULERS[l];
  const ben = LAGNA_BENEFICS[l] ?? [];
  const mal = LAGNA_MALEFICS[l] ?? [];
  const notes: string[] = [];

  const scored = ben.filter((p) => p !== "Ascendant").map((p) => {
    const pos = chart.planets.find((i) => i.planet === p) ?? null;
    const sc = pos ? getPlanetStrength(pos, l) : 28;
    return { planet: p, score: sc, pos };
  }).sort((a, b) => b.score - a.score);

  if (!scored.length) scored.push({ planet: lLord === "Ascendant" ? "Sun" : (lLord as Exclude<Planet, "Ascendant">), score: 50, pos: null });

  const buildRec = (sp: (typeof scored)[number], str: GemstoneRecommendation["strength"]): GemstoneRecommendation => {
    const meta = PLANET_GEMSTONES[sp.planet];
    const wear = PLANET_WEARING[sp.planet];
    const dg = sp.pos ? getDignity(sp.planet, sp.pos.sign) : "neutral";
    let reason = `${sp.planet} is supportive for ${l} lagna.`;
    if (dg === "exalted") reason += ` Exalted in ${sp.pos?.sign}.`;
    else if (dg === "own") reason += ` Own sign ${sp.pos?.sign}.`;
    if (sp.pos && [1, 4, 5, 7, 9, 10].includes(sp.pos.house)) reason += ` H${sp.pos.house} favorable.`;
    return { gemstone: meta.primary, alternateGemstone: meta.alternate, planet: sp.planet, reason, benefits: PLANET_BENEFITS[sp.planet], cautions: PLANET_CAUTIONS[sp.planet], wearing: wear, strength: str, score: Math.max(18, Math.min(84, sp.score)), color: meta.color, hexColor: meta.hex, chakra: meta.chakra, element: meta.element };
  };

  const prim = buildRec(scored[0], "Primary");
  const sec = scored.slice(1, 3).map((it, i) => buildRec(it, i === 0 ? "Secondary" : "Tertiary"));

  const avoid: AvoidGemstone[] = mal.filter((p) => p !== "Ascendant").map((p) => ({ gemstone: PLANET_GEMSTONES[p].primary, planet: p, reason: `${p} difficult for ${l}. May amplify ${getMaleficEffect(p)}.` }));

  const lPos = chart.planets.find((p) => p.planet === lLord);
  if (lPos && [1, 4, 5, 9, 10].includes(lPos.house)) notes.push(`Lagna lord in H${lPos.house}—supportive.`);

  const aff = chart.planets.filter((p) => ben.includes(p.planet) && [6, 8, 12].includes(p.house));
  if (aff.length) notes.push(`${aff.map((p) => p.planet).join(", ")} supportive but sensitive—try alternatives first.`);

  const dash = readDasha(rawInput);
  const dNote = dash !== "Not connected" ? `Dasha: ${dash}. Confirm suitability with expert.` : `Dasha not connected. Based on lagna and strength.`;

  notes.push("Start with mantra, colour discipline, donation before expensive gemstones.");
  notes.push("Final wearing: confirm with full chart, dasha and expert.");
  notes.push(dNote);

  return { primaryGemstone: prim, secondaryGemstones: sec, avoidGemstones: avoid, lagnaSign: l, lagnaLord: lLord, currentDasha: dash, dashaNote: dNote, analysisNotes: notes, safetyNote: "Gemstones amplify. Suitability guide only. Prefer mantra and expert confirmation." };
}

export function generateGemstoneReportFromChart(input: unknown): GemstoneReport {
  return generateGemstoneReport(buildNatalChartFromAnyChart(input));
}

const isPlanet = (v: unknown): v is Exclude<Planet, "Ascendant"> => ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].includes(String(v));
const findDashaPlanet = (input: unknown, key: "dashas" | "antardasha"): Exclude<Planet, "Ascendant"> | null => {
  const root = getRoot(input);
  const pool = root?.[key] ?? asDict(input)?.[key] ?? [];
  if (!Array.isArray(pool) || !pool.length) return null;
  const active = pool.find((item) => asDict(item)?.active) ?? pool[0];
  const planet = asDict(active)?.planet;
  return isPlanet(planet) ? planet : null;
};

const getHouseRelevance = (pos: PlanetPosition | undefined): string => {
  if (!pos) return "Position unavailable—start with mantra + trial.";
  if ([1, 5, 9].includes(pos.house)) return `Trikona: H${pos.house}.`;
  if ([4, 7, 10].includes(pos.house)) return `Kendra: H${pos.house}.`;
  if ([6, 8, 12].includes(pos.house)) return `Sensitive H${pos.house}—mild start, strict test.`;
  return `H${pos.house}—use based on tolerance.`;
};

const makeRudraksha = (p: Exclude<Planet, "Ascendant">, pos: PlanetPosition | undefined): RudrakshaRecommendation => {
  const d = PLANET_RUDRAKSHA[p];
  return { planet: p, mukhi: d.mukhi, bead: d.bead, mantra: d.mantra, reason: `${p} support. ${getHouseRelevance(pos)}` };
};

const makeDashaGem = (level: "Mahadasha" | "Antardasha", p: Exclude<Planet, "Ascendant">, chart: NatalChart): DashaGemRecommendation => {
  const g = PLANET_GEMSTONES[p];
  const w = PLANET_WEARING[p];
  const pos = chart.planets.find((x) => x.planet === p);
  return { level, planet: p, gemstone: g.primary, alternateGemstone: g.alternate, rudraksha: makeRudraksha(p, pos), wearing: w, reason: `${level} ${p} active. ${getHouseRelevance(pos)}` };
};

export function generateDashaGemstoneRecommendationsFromChart(input: unknown): DashaGemRecommendation[] {
  const natal = buildNatalChartFromAnyChart(input);
  const md = findDashaPlanet(input, "dashas");
  const ad = findDashaPlanet(input, "antardasha");
  const result: DashaGemRecommendation[] = [];
  if (md) result.push(makeDashaGem("Mahadasha", md, natal));
  if (ad) result.push(makeDashaGem("Antardasha", ad, natal));
  return result;
}

export const calculateGemstoneReport = generateGemstoneReportFromChart;
export const getGemstoneReport = generateGemstoneReportFromChart;
