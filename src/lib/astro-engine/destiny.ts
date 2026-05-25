// ============================================================
// ASTROLIFE DESTINY CURVE ENGINE v4.0 — World-Class Build
//
// Layer 1  — House + Dignity + Retrograde
// Layer 2  — Functional Role (Yogakaraka / Trikona / Dusthana)
//            computed per LAGNA — the most critical missing piece
// Layer 3  — Combustion penalty (deep vs partial)
// Layer 4  — Inbound aspects (benefics boost, malefics suppress)
// Layer 5  — Naisargika Bala weight
// Layer 6  — Shadbala blend (when passed)
// Layer 7  — Outbound special aspects (Jupiter/Mars/Saturn)
// Layer 8  — Ashtakavarga bindus in natal sign
// Layer 9  — Vargottama / D9 exaltation bonus
// Layer 10 — Navtara Chakra (MD 60% + AD 40%)
// ============================================================

// ── Interfaces ────────────────────────────────────────────────

export interface NavtaraInfo {
  taraNum:        number;
  taraName:       string;
  quality:        string;
  modifier:       number;
  color:          string;
  icon:           string;
  interpretation: string;
}

export interface PlanetScore {
  total:           number;
  functionalRole:  string;   // "Yogakaraka" | "Trikona Lord" | "Dusthana Lord" | …
  ruledHouses:     number[];
  combusted:       boolean;
  combustPenalty:  number;
  inboundScore:    number;   // net from planets aspecting this planet's house
  vargottama:      boolean;
  d9Exalted:       boolean;
  bindus:          number | null;
}

export interface DestinyPoint {
  age:       number;
  year:      number;
  score:     number;
  dasha:     string;
  navtara?:  NavtaraInfo;
}

export interface DestinyArea {
  name:   string;
  icon:   string;
  score:  number;
  status: "Strong" | "Average" | "Needs Work";
  color:  string;
}

export interface DashaBand {
  planet:         string;
  start:          Date;
  end:            Date;
  startAge:       number;
  endAge:         number;
  score:          number;
  color:          string;
  navtara?:       NavtaraInfo;
  functionalRole: string;
  scoreBreakdown: PlanetScore;
}

export interface DestinyDriver {
  planet:         string;
  role:           "Mahadasha" | "Antardasha";
  tone:           "support" | "mixed" | "caution";
  message:        string;
  navtara?:       NavtaraInfo;
  functionalRole: string;
}

export interface DestinyMilestone {
  age:     number;
  year:    number;
  score:   number;
  trend:   "rise" | "dip" | "stable";
  message: string;
}

export interface DestinyResult {
  points:          DestinyPoint[];
  areas:           DestinyArea[];
  bands:           DashaBand[];
  peak:            DashaBand;
  challenge:       DashaBand;
  currentAge:      number;
  currentScore:    number;
  currentDasha:    string;
  currentDrivers:  DestinyDriver[];
  nextMilestones:  DestinyMilestone[];
  actionPlan:      string[];
  summary:         string;
  navtaraMap:      Record<string, NavtaraInfo>;
  janmaNakshatra:  number;
  scoreBreakdowns: Record<string, PlanetScore>;
}

export interface ADDestinyPoint {
  monthOffset: number;
  date:        Date;
  score:       number;
  adPlanet:    string;
  mdPlanet:    string;
  mdNavtara:   NavtaraInfo;
  adNavtara:   NavtaraInfo;
  label:       string;
}

export interface ADDestinyBand {
  adPlanet:       string;
  start:          Date;
  end:            Date;
  yrs:            number;
  score:          number;
  color:          string;
  navtara:        NavtaraInfo;
  tone:           "support" | "mixed" | "caution";
  functionalRole: string;
  summary:        string;
  peakMonth:      number;
  lowestMonth:    number;
  scoreBreakdown: PlanetScore;
}

export interface AntardashaDestinyResult {
  mdPlanet:      string;
  mdStart:       Date;
  mdEnd:         Date;
  mdNavtara:     NavtaraInfo;
  mdScore:       number;
  mdFunctional:  string;
  points:        ADDestinyPoint[];
  bands:         ADDestinyBand[];
  peakAD:        ADDestinyBand;
  challengeAD:   ADDestinyBand;
  currentAD:     ADDestinyBand | null;
  summary:       string;
  actionPlan:    string[];
}

// ── Internal types ────────────────────────────────────────────

interface PD {
  house:      number;
  sign:       string;
  signNum:    number;
  retrograde: boolean;
  dignity:    string;
  lon:        number;
}
interface DashaEntry { planet: string; start: Date; end: Date; yrs: number; active?: boolean; }

// ── Constants ─────────────────────────────────────────────────

const PLS  = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PCOL = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];
const DO   = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const DY: Record<string,number> = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17,
};

const mdf = (x: number, m: number) => ((x % m) + m) % m;

// Classical sign lordships (0=Aries … 11=Pisces)
const SIGN_LORD: Record<number, string> = {
  0:"Mars", 1:"Venus", 2:"Mercury", 3:"Moon",   4:"Sun",
  5:"Mercury", 6:"Venus", 7:"Mars",  8:"Jupiter", 9:"Saturn",
  10:"Saturn", 11:"Jupiter",
};

// Natural benefics (for Kendradhipati dosha)
const NAT_BEN = new Set(["Jupiter","Venus","Mercury","Moon"]);
// Natural malefics
const NAT_MAL = new Set(["Saturn","Mars","Rahu","Ketu","Sun"]);

// Combustion orbs (degrees from Sun)
const COMBUST_ORB: Record<string, number> = {
  Moon:12, Mars:17, Mercury:14, Jupiter:11, Venus:10, Saturn:15,
};

// Naisargika Bala weights
const NAISARGIKA: Record<string, number> = {
  Jupiter:1.3, Venus:1.2, Sun:1.1, Moon:1.0,
  Mercury:0.9, Mars:0.85, Saturn:0.8, Rahu:0.75, Ketu:0.7,
};

// Special outbound aspects (offsets beyond universal 7th)
const SPECIAL_ASPECTS: Record<string, number[]> = {
  Jupiter:[4,8], Mars:[3,7], Saturn:[2,9],
};

// Exaltation signs for Vargottama / D9 check
const EXALT_SIGN: Record<string, number> = {
  Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6,
};

const POWER_HOUSES = new Set([1,5,9,10]);

// ── Navtara Chakra ────────────────────────────────────────────

const TARA_DEFS: Omit<NavtaraInfo,"taraNum"|"interpretation">[] = [
  { taraName:"Janma",        quality:"self/rebirth",    modifier:-3,  color:"#c8a030", icon:"🌟" }, // FIX: was 0, classical = slightly challenging
  { taraName:"Sampat",       quality:"wealth",          modifier:+8,  color:"#22c55e", icon:"💰" },
  { taraName:"Vipat",        quality:"danger",          modifier:-10, color:"#ef4444", icon:"⚠️" },
  { taraName:"Kshema",       quality:"stability",       modifier:+6,  color:"#4ade80", icon:"🛡️" },
  { taraName:"Pratyari",     quality:"enmity",          modifier:-8,  color:"#f97316", icon:"⚔️" },
  { taraName:"Sadhaka",      quality:"achievement",     modifier:+7,  color:"#38bdf8", icon:"✅" },
  { taraName:"Vadha",        quality:"severe obstacle", modifier:-12, color:"#dc2626", icon:"🔴" },
  { taraName:"Mitra",        quality:"friendly",        modifier:+5,  color:"#a3e635", icon:"🤝" },
  { taraName:"Parama Mitra", quality:"best friend",     modifier:+9,  color:"#6366f1", icon:"⭐" },
];

const TARA_INTERP: string[] = [
  "Janma Tara — Same nakshatra as your birth star. Dasha is intensely personal — karmic confrontations, identity pressure, inner growth through outer turbulence. Not easy, but deeply transformative.",
  "Sampat Tara — Wealth Tara. Financial opportunities, resource accumulation, and abundance themes are naturally highlighted in this dasha.",
  "Vipat Tara — Danger Tara. Unexpected obstacles, health awareness, and vigilance are essential. Remedies strongly advised during this period.",
  "Kshema Tara — Comfort & Stability Tara. Protection, domestic stability, and safe progress. Best period for consolidation rather than bold risk-taking.",
  "Pratyari Tara — Enmity Tara. Opposition, rivalry, and conflict are attracted. Competitors and hidden enemies may be active. Patience and documentation essential.",
  "Sadhaka Tara — Achievement Tara. Highly productive — goals accomplished, recognition comes, sustained effort yields clear results.",
  "Vadha Tara — Severe Obstacle Tara. Classically the most challenging. Losses, separations, or major setbacks possible. Intensive remedies and low risk-taking is the strategy.",
  "Mitra Tara — Friendly Tara. Supportive people, helpful alliances, and cooperative energy define this period.",
  "Parama Mitra Tara — Best Friend Tara. The most auspicious. Everything comes together, support flows naturally, dharmic efforts yield excellent returns.",
];

function lonToNak(lon: number): number {
  return Math.floor(((lon % 360) + 360) % 360 * 27 / 360) % 27;
}

export function getNavtara(planetNak: number, janmaNak: number): NavtaraInfo {
  const diff    = ((planetNak - janmaNak) % 27 + 27) % 27;
  const taraIdx = diff % 9;
  const def     = TARA_DEFS[taraIdx];
  return {
    taraNum:        taraIdx + 1,
    taraName:       def.taraName,
    quality:        def.quality,
    modifier:       def.modifier,
    color:          def.color,
    icon:           def.icon,
    interpretation: TARA_INTERP[taraIdx],
  };
}

// ── LAYER 2 — House Lordship + Functional Role ────────────────
// The most important classical factor: which houses does this planet rule for THIS lagna?

function getRuledHouses(planet: string, lagnaNum: number): number[] {
  const houses: number[] = [];
  for (let sign = 0; sign < 12; sign++) {
    if (SIGN_LORD[sign] === planet) {
      houses.push(mdf(sign - lagnaNum, 12) + 1); // 1-indexed house
    }
  }
  return houses;
}

function getFunctionalRole(
  planet: string, lagnaNum: number
): { delta: number; role: string; ruledHouses: number[] } {
  const ruledHouses = getRuledHouses(planet, lagnaNum);
  if (ruledHouses.length === 0) return { delta:0, role:"Shadow Planet", ruledHouses:[] };

  const KENDRAS  = new Set([1,4,7,10]);
  const TRIKONAS = new Set([1,5,9]);
  const DUSTH    = new Set([6,8,12]);
  const MARAKAS  = new Set([2,7]);

  const rKendra   = ruledHouses.some(h => KENDRAS.has(h));
  const rTrikona  = ruledHouses.some(h => TRIKONAS.has(h));
  const rDusth    = ruledHouses.some(h => DUSTH.has(h));
  const rMaraka   = ruledHouses.some(h => MARAKAS.has(h));
  const rLagna    = ruledHouses.includes(1);

  // True Yogakaraka: owns a kendra AND a trikona where neither is the shared 1st house
  const nonL_Kendra  = ruledHouses.some(h => h !== 1 && KENDRAS.has(h));
  const nonL_Trikona = ruledHouses.some(h => h !== 1 && TRIKONAS.has(h));
  const isYogakaraka = nonL_Kendra && nonL_Trikona;

  if (isYogakaraka)                               return { delta:15, role:"Yogakaraka",                ruledHouses };
  if (rTrikona && rKendra && !rDusth)             return { delta:12, role:"Trikona+Kendra Lord",       ruledHouses };
  if (rTrikona && !rDusth && !rMaraka && !rLagna) return { delta:10, role:"Trikona Lord",              ruledHouses };
  if (rTrikona && rDusth  && !rLagna)             return { delta: 3, role:"Trikona+Dusthana Lord",     ruledHouses };
  if (rLagna   && !rDusth)                        return { delta: 8, role:"Lagna Lord",                ruledHouses };
  if (rLagna   && rDusth)                         return { delta: 2, role:"Lagna+Dusthana Lord",       ruledHouses };

  if (rKendra && !rDusth) {
    // Kendradhipati dosha: natural benefics owning Kendras lose strength
    if (NAT_BEN.has(planet)) return { delta:-3, role:"Kendra Lord (Kendradhipati)",  ruledHouses };
    return                           { delta: 5, role:"Kendra Lord",                  ruledHouses };
  }

  if (rDusth && !rKendra && !rTrikona && !rLagna) {
    if (rMaraka) return { delta:-10, role:"Dusthana+Maraka Lord", ruledHouses };
    return        { delta:-10, role:"Dusthana Lord",              ruledHouses };
  }

  if (rMaraka && !rKendra && !rTrikona && !rLagna)
    return { delta:-3, role:"Maraka Lord", ruledHouses };

  return { delta:0, role:"Neutral", ruledHouses };
}

// ── LAYER 3 — Combustion ──────────────────────────────────────

function getCombustionPenalty(
  planet: string, pd: PD, sunLon: number
): { penalty: number; combusted: boolean } {
  if (planet === "Sun" || !COMBUST_ORB[planet]) return { penalty:0, combusted:false };
  const diff   = Math.abs(((pd.lon - sunLon + 360) % 360));
  const angSep = Math.min(diff, 360 - diff);
  const orb    = COMBUST_ORB[planet];
  if (angSep < orb / 2) return { penalty:-15, combusted:true };  // deep combust
  if (angSep < orb)     return { penalty: -7, combusted:true };  // partial combust
  return { penalty:0, combusted:false };
}

// ── LAYER 4 — Inbound Aspects ─────────────────────────────────
// Check which planets cast an aspect ON the dasha planet's house

function getInboundAspectScore(
  dashaHouse: number,
  allPlanets: Record<string, PD>,
  excludePlanet: string
): number {
  let score = 0;
  Object.entries(allPlanets).forEach(([p, pd]) => {
    if (p === excludePlanet || !pd) return;
    // All planets aspect the 7th house from their position
    const baseAsp = [6, ...(SPECIAL_ASPECTS[p] ?? [])];
    const aspectedHouses = baseAsp.map(o => ((pd.house - 1 + o) % 12) + 1);
    if (aspectedHouses.includes(dashaHouse)) {
      // Benefic aspect = boost; malefic aspect = suppress
      if (NAT_BEN.has(p)) score += 6;
      else if (NAT_MAL.has(p)) score -= 5;
    }
  });
  return Math.max(-15, Math.min(12, score));
}

// ── LAYER 8 — Ashtakavarga bindus ────────────────────────────
// bindu count for planet in its natal sign (0-8; avg ~4)

function getBinduScore(bindus: number | undefined): number {
  if (bindus === undefined || bindus === null) return 0;
  if (bindus >= 6) return +8;
  if (bindus === 5) return +4;
  if (bindus === 4) return  0; // average
  if (bindus === 3) return -4;
  return -8; // 0-2: very weak
}

// ── LAYER 9 — Vargottama / D9 exaltation ─────────────────────

function getD9Score(
  planet: string, pd: PD, d9Signs: Record<string,number> | undefined
): { bonus: number; vargottama: boolean; d9Exalted: boolean } {
  if (!d9Signs?.[planet]) return { bonus:0, vargottama:false, d9Exalted:false };
  const d9Sign = d9Signs[planet];
  if (d9Sign === pd.signNum) return { bonus:+10, vargottama:true, d9Exalted:false }; // Vargottama
  if (EXALT_SIGN[planet] === d9Sign) return { bonus:+6, vargottama:false, d9Exalted:true }; // Exalted in D9
  // Debilitated in D9: suppress
  const debSign = (EXALT_SIGN[planet] + 6) % 12;
  if (debSign === d9Sign) return { bonus:-5, vargottama:false, d9Exalted:false };
  return { bonus:0, vargottama:false, d9Exalted:false };
}

// ── Master scoring function — ALL 10 layers ───────────────────

function scorePlanet(
  planet:      string,
  pd:          PD | undefined,
  allPlanets:  Record<string, PD>,
  lagnaNum:    number,
  shadbalaPct?: Record<string, number>,
  bindus?:      Record<string, number>,
  d9Signs?:     Record<string, number>
): PlanetScore {
  if (!pd) {
    return { total:50, functionalRole:"Unknown", ruledHouses:[], combusted:false,
             combustPenalty:0, inboundScore:0, vargottama:false, d9Exalted:false, bindus:null };
  }

  let s = 50;

  // LAYER 1 — House position
  if ([1,4,7,10].includes(pd.house))           s += 12;
  else if ([5,9].includes(pd.house))            s +=  8;
  else if ([2,11].includes(pd.house))           s +=  5;
  else if ([6,8,12].includes(pd.house))         s -= 10;

  // LAYER 1 — Dignity
  if      (pd.dignity?.includes("Exalted"))     s +=  8;
  else if (pd.dignity?.includes("Moolatrikona"))s +=  5;
  else if (pd.dignity?.includes("Own"))         s +=  4;
  else if (pd.dignity?.includes("Debilitated")) s -= 10;
  else if (pd.dignity?.includes("Enemy"))       s -=  4;

  // LAYER 1 — Retrograde
  if (pd.retrograde) s -= 3;

  // Natural benefic/malefic positional bonus
  if (["Jupiter","Venus"].includes(planet) && [1,4,5,7,9,10,11].includes(pd.house)) s += 6;
  if (["Saturn","Mars","Rahu"].includes(planet) && [6,8,12].includes(pd.house))     s -= 6;

  // LAYER 2 — Functional Role (lagna-dependent)
  const { delta: roleDelta, role, ruledHouses } = getFunctionalRole(planet, lagnaNum);
  s += roleDelta;

  // LAYER 3 — Combustion
  const sunLon = allPlanets.Sun?.lon ?? 0;
  const { penalty: combustPenalty, combusted } = getCombustionPenalty(planet, pd, sunLon);
  s += combustPenalty;

  // LAYER 4 — Inbound aspects (other planets aspecting this planet's house)
  const inboundScore = getInboundAspectScore(pd.house, allPlanets, planet);
  s += Math.round(inboundScore * 0.6); // 60% weight — inbound modifies but doesn't dominate

  // LAYER 5 — Naisargika Bala weight (scales deviation from 50)
  const nw = NAISARGIKA[planet] ?? 1.0;
  s = 50 + Math.round((s - 50) * nw);

  // LAYER 6 — Shadbala blend (25% pull toward Shadbala score)
  if (shadbalaPct?.[planet] !== undefined) {
    s = Math.round(s * 0.75 + shadbalaPct[planet] * 0.25);
  }

  // LAYER 7 — Outbound special aspects (does this planet aspect a power house?)
  const extras   = SPECIAL_ASPECTS[planet] ?? [];
  const allAsp   = [6, ...extras].map(o => ((pd.house - 1 + o) % 12) + 1);
  if (allAsp.some(h => POWER_HOUSES.has(h))) s += 5;

  // LAYER 8 — Ashtakavarga bindus
  const binduVal   = bindus?.[planet] ?? undefined;
  const binduScore = getBinduScore(binduVal);
  s += binduScore;

  // LAYER 9 — Vargottama / D9 exaltation
  const { bonus: d9Bonus, vargottama, d9Exalted } = getD9Score(planet, pd, d9Signs);
  s += d9Bonus;

  return {
    total:          Math.min(95, Math.max(15, Math.round(s))),
    functionalRole: role,
    ruledHouses,
    combusted,
    combustPenalty,
    inboundScore,
    vargottama,
    d9Exalted,
    bindus:         binduVal ?? null,
  };
}

// ── Shared helpers ────────────────────────────────────────────

function planetTone(planet: string, pd?: PD): DestinyDriver["tone"] {
  if (!pd) return "mixed";
  if (pd.dignity?.includes("Exalted") || pd.dignity?.includes("Own") ||
      [1,4,5,7,9,10,11].includes(pd.house)) return "support";
  if (pd.dignity?.includes("Debilitated") || [6,8,12].includes(pd.house) ||
      pd.retrograde) return "caution";
  return "mixed";
}

function driverMessage(planet: string, role: DestinyDriver["role"], pd?: PD,
                        functionalRole?: string): string {
  if (!pd) return `${role} ${planet} is active, but natal placement data is limited.`;
  const dignity = pd.dignity ? `, ${pd.dignity}` : "";
  const retro   = pd.retrograde ? ", retrograde" : "";
  const frNote  = functionalRole ? ` [${functionalRole}]` : "";
  const base    = `${role} ${planet} from H${pd.house} ${pd.sign}${dignity}${retro}${frNote}.`;
  if (planetTone(planet, pd) === "support") return `${base} Use this period for visible progress and clear commitments.`;
  if (planetTone(planet, pd) === "caution") return `${base} Move with patience, documentation, and remedies before major risks.`;
  return `${base} Results improve through steady effort rather than shortcuts.`;
}

function buildAD(mdPlanet: string, mdStart: Date, mdYrs: number): DashaEntry[] {
  const mi  = DO.indexOf(mdPlanet);
  const seq: DashaEntry[] = [];
  let cur   = new Date(mdStart);
  const now = new Date();
  for (let i = 0; i < 9; i++) {
    const pi  = mdf(mi + i, 9);
    const p   = DO[pi];
    const yrs = mdYrs * DY[p] / 120;
    const end = new Date(cur.getTime() + yrs * 365.25 * 24 * 3600 * 1000);
    seq.push({ planet:p, start:new Date(cur), end, yrs, active:cur<=now&&now<end });
    cur = new Date(end);
  }
  return seq;
}

// ── calculateDestiny — Tab 1: MD-level lifetime curve ─────────

export function calculateDestiny(
  planets:      Record<string, PD>,
  dashas:       DashaEntry[],
  dob:          string,
  lagnaNum:     number,                  // REQUIRED — lagna sign 0-11
  shadbalaPct?: Record<string, number>,  // optional: planet→0-100
  bindus?:      Record<string, number>,  // optional: planet→bindu count in natal sign
  d9Signs?:     Record<string, number>   // optional: planet→D9 sign 0-11
): DestinyResult {

  const dobDate   = new Date(dob);
  const birthYear = dobDate.getFullYear();
  const now       = new Date();
  const maxAge    = 90;

  // Janma Nakshatra from Moon's longitude
  const moonLon  = planets.Moon?.lon ?? 0;
  const janmaNak = lonToNak(moonLon);

  // Pre-compute Navtara for all 9 planets
  const navtaraMap: Record<string, NavtaraInfo> = {};
  PLS.forEach(p => {
    const pd = planets[p];
    if (pd) navtaraMap[p] = getNavtara(lonToNak(pd.lon), janmaNak);
  });

  // Pre-compute full score for each planet (cached — doesn't change over time)
  const scoreBreakdowns: Record<string, PlanetScore> = {};
  PLS.forEach(p => {
    const pd = planets[p];
    if (pd) scoreBreakdowns[p] = scorePlanet(p, pd, planets, lagnaNum, shadbalaPct, bindus, d9Signs);
  });

  // Score a year — uses cached planet scores + Navtara
  function scoreYear(year: number): number {
    const d        = new Date(year, 6, 1);
    const activeMD = dashas.find(s => s.start <= d && s.end > d);
    if (!activeMD) return 50;

    const adSeq    = buildAD(activeMD.planet, activeMD.start, activeMD.yrs);
    const activeAD = adSeq.find(s => s.start <= d && s.end > d);
    const mdP      = activeMD.planet;

    // MD score (all 9 layers computed)
    let score = scoreBreakdowns[mdP]?.total ?? 50;

    // LAYER 10 — Navtara (MD: 60% weight)
    const mdTara = navtaraMap[mdP];
    if (mdTara) score += Math.round(mdTara.modifier * 0.6);

    // AD contribution
    if (activeAD) {
      const adP  = activeAD.planet;
      const adSc = scoreBreakdowns[adP];
      if (adSc) {
        // AD planet's deviation from 50 contributes at 35% weight
        const adDelta = Math.round((adSc.total - 50) * 0.35);
        // LAYER 10 — Navtara (AD: 40% weight)
        const adTara  = navtaraMap[adP];
        const taraMod = adTara ? Math.round(adTara.modifier * 0.4) : 0;
        score += adDelta + taraMod;
      }
    }

    return Math.min(95, Math.max(15, Math.round(score)));
  }

  // Curve points (age 0 → 90)
  const points: DestinyPoint[] = [];
  for (let a = 0; a <= maxAge; a++) {
    const year = birthYear + a;
    const d    = new Date(year, 6, 1);
    const md2  = dashas.find(s => s.start <= d && s.end > d);
    points.push({
      age: a, year,
      score:   scoreYear(year),
      dasha:   md2?.planet ?? "",
      navtara: md2 ? navtaraMap[md2.planet] : undefined,
    });
  }

  // Dasha bands
  const pColor: Record<string,string> = {};
  PLS.forEach((p,i) => { pColor[p] = PCOL[i]; });

  const bands: DashaBand[] = dashas.map(d => {
    const sAge  = (d.start.getTime() - dobDate.getTime()) / (365.25 * 24 * 3600 * 1000);
    const eAge  = Math.min((d.end.getTime() - dobDate.getTime()) / (365.25 * 24 * 3600 * 1000), maxAge);
    const score = scoreYear(d.start.getFullYear() + 1);
    const sb    = scoreBreakdowns[d.planet];
    return {
      planet:         d.planet,
      start:          d.start,
      end:            d.end,
      startAge:       Math.max(0, sAge),
      endAge:         eAge,
      score,
      color:          pColor[d.planet] ?? "#c8a030",
      navtara:        navtaraMap[d.planet],
      functionalRole: sb?.functionalRole ?? "Unknown",
      scoreBreakdown: sb ?? scoreBreakdowns[d.planet],
    };
  }).filter(b => b.endAge > 0 && b.startAge < maxAge);

  const peak      = [...bands].sort((a,b) => b.score - a.score)[0];
  const challenge = [...bands].sort((a,b) => a.score - b.score)[0];

  // Area scores (also Navtara-aware)
  const activeMD = dashas.find(s => s.start <= now && s.end > now) || dashas[0];

  function areaScore(houses: number[]): number {
    let s = 50;
    houses.forEach(h => {
      PLS.forEach(p => {
        const pd = planets[p];
        if (!pd || pd.house !== h) return;
        if (NAT_BEN.has(p))  s += 7;
        if (NAT_MAL.has(p))  s -= 4;
        if (pd.dignity?.includes("Exalted"))      s += 6;
        if (pd.dignity?.includes("Debilitated"))  s -= 8;
        // Functional role bonus for planets in key houses
        const fr = scoreBreakdowns[p];
        if (fr) s += Math.round((fr.total - 50) * 0.15);
      });
    });
    if (planets[activeMD.planet] && houses.includes(planets[activeMD.planet].house)) s += 10;
    return Math.min(95, Math.max(15, Math.round(s)));
  }

  const areaData = [
    { name:"Career",       icon:"💼", houses:[10,6,1] },
    { name:"Finance",      icon:"💰", houses:[2,11,8] },
    { name:"Health",       icon:"🏥", houses:[1,6,8]  },
    { name:"Relationship", icon:"💑", houses:[7,5,1]  },
    { name:"Stability",    icon:"⚓", houses:[4,10,2] },
    { name:"Psychology",   icon:"🧠", houses:[1,4,12] },
  ];

  const areas: DestinyArea[] = areaData.map(a => {
    const score = areaScore(a.houses);
    return {
      name:   a.name,
      icon:   a.icon,
      score,
      status: score >= 70 ? "Strong" : score >= 50 ? "Average" : "Needs Work",
      color:  score >= 70 ? "#22c55e" : score >= 50 ? "#c8a030" : "#ef4444",
    };
  });

  const currentAge   = Math.floor((now.getTime() - dobDate.getTime()) / (365.25 * 24 * 3600 * 1000));
  const currentScore = scoreYear(now.getFullYear());
  const adSeqNow     = activeMD ? buildAD(activeMD.planet, activeMD.start, activeMD.yrs) : [];
  const activeAD     = adSeqNow.find(s => s.start <= now && s.end > now);

  const mdSB = scoreBreakdowns[activeMD.planet];
  const adSB = activeAD ? scoreBreakdowns[activeAD.planet] : undefined;

  const currentDrivers: DestinyDriver[] = [
    {
      planet:         activeMD.planet,
      role:           "Mahadasha",
      tone:           planetTone(activeMD.planet, planets[activeMD.planet]),
      message:        driverMessage(activeMD.planet,"Mahadasha",planets[activeMD.planet],mdSB?.functionalRole),
      navtara:        navtaraMap[activeMD.planet],
      functionalRole: mdSB?.functionalRole ?? "Unknown",
    },
    ...(activeAD ? [{
      planet:         activeAD.planet,
      role:           "Antardasha" as const,
      tone:           planetTone(activeAD.planet, planets[activeAD.planet]),
      message:        driverMessage(activeAD.planet,"Antardasha",planets[activeAD.planet],adSB?.functionalRole),
      navtara:        navtaraMap[activeAD.planet],
      functionalRole: adSB?.functionalRole ?? "Unknown",
    }] : []),
  ];

  const nextMilestones: DestinyMilestone[] = points
    .filter(p => p.age >= currentAge && p.age <= currentAge + 5)
    .slice(0, 6)
    .map((pnt, i, arr) => {
      const previous = i === 0 ? currentScore : arr[i-1].score;
      const diff     = pnt.score - previous;
      const trend: DestinyMilestone["trend"] = diff >= 5 ? "rise" : diff <= -5 ? "dip" : "stable";
      const taraNote = pnt.navtara ? ` [${pnt.navtara.icon} ${pnt.navtara.taraName}]` : "";
      const msg      = trend === "rise"
        ? `${pnt.dasha || "Current"} dasha rising${taraNote} — plan important steps.`
        : trend === "dip"
        ? `${pnt.dasha || "Current"} dasha dipping${taraNote} — extra caution and preparation.`
        : `${pnt.dasha || "Current"} dasha steady${taraNote} — consistency over speed.`;
      return { age:pnt.age, year:pnt.year, score:pnt.score, trend, message:msg };
    });

  const weakest      = [...areas].sort((a,b) => a.score - b.score).slice(0,2);
  const strongest    = [...areas].sort((a,b) => b.score - a.score)[0];
  const mdTara       = navtaraMap[activeMD.planet];
  const adTara       = activeAD ? navtaraMap[activeAD.planet] : undefined;

  // Combustion warning for current drivers
  const combustWarnings: string[] = [];
  if (mdSB?.combusted) combustWarnings.push(`⚠️ ${activeMD.planet} (MD) is combust — results may come through Sun-flavored themes; independent planet significations are suppressed.`);
  if (adSB?.combusted && activeAD) combustWarnings.push(`⚠️ ${activeAD.planet} (AD) is combust — sub-period results need extra effort.`);

  // Inbound aspect summary
  const aspectNotes: string[] = [];
  if ((mdSB?.inboundScore ?? 0) >= 6) aspectNotes.push(`${activeMD.planet} MD receives strong benefic aspects — external support and grace flow easily.`);
  if ((mdSB?.inboundScore ?? 0) <= -5) aspectNotes.push(`${activeMD.planet} MD receives malefic aspects — resistance, delays, obstacles from external forces.`);

  const actionPlan = [
    strongest ? `Use ${strongest.name} as the main growth lever in ${activeMD.planet} MD.` : "Focus on your strongest life area.",
    weakest.length ? `Weekly attention needed: ${weakest.map(a => a.name).join(" and ")}.` : "",
    currentScore >= 70 ? "Action phase — launch, negotiate, decide, compound gains."
      : currentScore >= 50 ? "Build phase — improve systems before irreversible decisions."
      : "Protection phase — reduce risk, complete pending karma, strengthen remedies.",
    mdTara ? `MD Navtara: ${mdTara.icon} ${mdTara.taraName} Tara — ${mdTara.interpretation}` : "",
    adTara && activeAD ? `AD Navtara: ${adTara.icon} ${adTara.taraName} — ${adTara.quality}.` : "",
    mdSB?.functionalRole ? `${activeMD.planet} MD is functionally a ${mdSB.functionalRole} for your lagna.` : "",
    mdSB?.vargottama ? `${activeMD.planet} is Vargottama (same sign D1+D9) — exceptional strength.` : "",
    ...combustWarnings,
    ...aspectNotes,
  ].filter(Boolean);

  const summary =
    `Peak: ${peak?.planet} MD (${peak?.start.getFullYear()}–${peak?.end.getFullYear()}) ` +
    `score ${peak?.score}% [${peak?.functionalRole}] ` +
    `[${navtaraMap[peak?.planet]?.icon ?? ""} ${navtaraMap[peak?.planet]?.taraName ?? ""}]. ` +
    `Toughest: ${challenge?.planet} MD [${challenge?.functionalRole}]. ` +
    `Current: ${currentScore}% — ${activeMD.planet} MD [${mdSB?.functionalRole ?? ""}].`;

  return {
    points, areas, bands, peak, challenge,
    currentAge, currentScore,
    currentDasha:   activeMD.planet,
    currentDrivers, nextMilestones, actionPlan, summary,
    navtaraMap,
    janmaNakshatra: janmaNak,
    scoreBreakdowns,
  };
}

// ── calculateADDestiny — Tab 2: AD-level curve inside one MD ──

export function calculateADDestiny(
  mdPlanet:     string,
  mdStart:      Date,
  mdEnd:        Date,
  mdYrs:        number,
  planets:      Record<string, PD>,
  lagnaNum:     number,
  shadbalaPct?: Record<string, number>,
  bindus?:      Record<string, number>,
  d9Signs?:     Record<string, number>
): AntardashaDestinyResult {

  const now      = new Date();
  const janmaNak = lonToNak(planets.Moon?.lon ?? 0);

  const navtaraMap: Record<string, NavtaraInfo> = {};
  PLS.forEach(p => {
    const pd = planets[p];
    if (pd) navtaraMap[p] = getNavtara(lonToNak(pd.lon), janmaNak);
  });

  // Full score for every planet
  const scoreBreakdowns: Record<string, PlanetScore> = {};
  PLS.forEach(p => {
    const pd = planets[p];
    if (pd) scoreBreakdowns[p] = scorePlanet(p, pd, planets, lagnaNum, shadbalaPct, bindus, d9Signs);
  });

  const mdSB       = scoreBreakdowns[mdPlanet];
  const mdTara     = navtaraMap[mdPlanet];
  const mdBaseScore = mdSB ? mdSB.total + Math.round((mdTara?.modifier ?? 0) * 0.6) : 50;

  const adSeq = buildAD(mdPlanet, mdStart, mdYrs);
  const pColor: Record<string,string> = {};
  PLS.forEach((p,i) => { pColor[p] = PCOL[i]; });

  // Score an individual AD
  function scoreAD(adPlanet: string): number {
    const adSB   = scoreBreakdowns[adPlanet];
    const adTara = navtaraMap[adPlanet];
    if (!adSB) return mdBaseScore;

    // MD sets the ceiling/floor; AD moves within it
    // Formula: MD 55% + AD 45% of their respective deviations from 50
    const mdDev  = (mdSB?.total ?? 50) - 50;
    const adDev  = adSB.total - 50;
    let score    = 50 + Math.round(mdDev * 0.55 + adDev * 0.45);

    // Navtara: MD 60%, AD 40%
    score += Math.round((mdTara?.modifier ?? 0) * 0.6);
    score += Math.round((adTara?.modifier ?? 0) * 0.4);

    return Math.min(95, Math.max(15, Math.round(score)));
  }

  // Monthly resolution curve
  const points: ADDestinyPoint[] = [];
  const mdDurMs   = mdEnd.getTime() - mdStart.getTime();
  const totalMos  = Math.ceil(mdDurMs / (30.4375 * 24 * 3600 * 1000));

  for (let m = 0; m <= totalMos; m++) {
    const date     = new Date(mdStart.getTime() + m * 30.4375 * 24 * 3600 * 1000);
    if (date > mdEnd) break;
    const activeAD = adSeq.find(s => s.start <= date && s.end > date);
    const adP      = activeAD?.planet ?? adSeq[adSeq.length - 1]?.planet ?? mdPlanet;
    const base     = scoreAD(adP);

    // Phase variation within AD: rise in first half, plateau, slight dip at end
    // Represents "warming up → peak → winding down" classical phase
    const adDurMs  = activeAD ? activeAD.end.getTime() - activeAD.start.getTime() : 1;
    const elapsed  = activeAD ? (date.getTime() - activeAD.start.getTime()) / adDurMs : 0.5;
    // Triangle wave: rises from 0→1 in first 60%, holds, then drops last 20%
    const phase    = elapsed < 0.6
      ? elapsed / 0.6          // 0→1 in first 60%
      : elapsed < 0.8
      ? 1.0                    // plateau
      : (1 - elapsed) / 0.2;  // 1→0 in last 20%
    const waveMod  = Math.round(5 * phase - 1); // -1 to +4

    points.push({
      monthOffset: m,
      date,
      score:       Math.min(95, Math.max(15, base + waveMod)),
      adPlanet:    adP,
      mdPlanet,
      mdNavtara:   mdTara,
      adNavtara:   navtaraMap[adP],
      label:       `${mdPlanet} MD · ${adP} AD`,
    });
  }

  // AD bands
  const bands: ADDestinyBand[] = adSeq.map(ad => {
    const bandScore = scoreAD(ad.planet);
    const adSB      = scoreBreakdowns[ad.planet];
    const adTara    = navtaraMap[ad.planet];
    const tone      = planetTone(ad.planet, planets[ad.planet]);
    const adPd      = planets[ad.planet];

    const adPoints  = points.filter(pt => pt.adPlanet === ad.planet);
    const peakPt    = adPoints.reduce((a,b) => b.score > a.score ? b : a, adPoints[0] ?? { monthOffset:0, score:bandScore });
    const lowPt     = adPoints.reduce((a,b) => b.score < a.score ? b : a, adPoints[0] ?? { monthOffset:0, score:bandScore });

    const lines: string[] = [];
    if (adPd) lines.push(`${ad.planet} in H${adPd.house} ${adPd.sign}${adPd.dignity ? ` (${adPd.dignity})` : ""}${adPd.retrograde ? ", retrograde" : ""}`);
    if (adSB?.functionalRole) lines.push(`Functional role: ${adSB.functionalRole}`);
    if (adTara) lines.push(`${adTara.icon} ${adTara.taraName} Tara — ${adTara.quality}`);
    if (adSB?.combusted) lines.push("⚠️ Combust — results muted, Sun-flavored");
    if (adSB?.vargottama) lines.push("⭐ Vargottama — exceptional strength");
    if (adSB?.inboundScore >= 6) lines.push("✅ Strong benefic aspects received");
    if ((adSB?.inboundScore ?? 0) <= -5) lines.push("⚠️ Malefic aspects received — resistance");
    lines.push(adTara?.interpretation ?? "");

    return {
      adPlanet:       ad.planet,
      start:          ad.start,
      end:            ad.end,
      yrs:            Number(ad.yrs.toFixed(2)),
      score:          bandScore,
      color:          pColor[ad.planet] ?? "#c8a030",
      navtara:        adTara,
      tone,
      functionalRole: adSB?.functionalRole ?? "Unknown",
      summary:        lines.filter(Boolean).join(" | "),
      peakMonth:      peakPt?.monthOffset ?? 0,
      lowestMonth:    lowPt?.monthOffset ?? 0,
      scoreBreakdown: adSB ?? scoreBreakdowns[ad.planet],
    };
  });

  const peakAD      = [...bands].sort((a,b) => b.score - a.score)[0];
  const challengeAD = [...bands].sort((a,b) => a.score - b.score)[0];
  const currentAD   = bands.find(b => b.start <= now && b.end > now) ?? null;

  const summary =
    `${mdPlanet} MD [${mdSB?.functionalRole ?? ""}] [${mdTara?.icon ?? ""} ${mdTara?.taraName ?? ""} Tara]. ` +
    `Best AD: ${peakAD?.adPlanet} (${peakAD?.score}%) [${peakAD?.functionalRole}] ` +
    `[${peakAD?.navtara?.icon ?? ""} ${peakAD?.navtara?.taraName ?? ""}]. ` +
    `Toughest AD: ${challengeAD?.adPlanet} (${challengeAD?.score}%) [${challengeAD?.functionalRole}]. ` +
    (currentAD ? `Active: ${currentAD.adPlanet} AD (${currentAD.score}%).` : "");

  const actionPlan = [
    peakAD
      ? `Peak window: ${peakAD.adPlanet} AD (${peakAD.score}%) [${peakAD.functionalRole}] ${peakAD.navtara?.icon ?? ""} ${peakAD.navtara?.taraName ?? ""} — launch, negotiate, decide here.`
      : "",
    challengeAD
      ? `Caution window: ${challengeAD.adPlanet} AD [${challengeAD.functionalRole}] ${challengeAD.navtara?.icon ?? ""} ${challengeAD.navtara?.taraName ?? ""} — reduce risk, strengthen remedies.`
      : "",
    currentAD
      ? `Right now — ${currentAD.adPlanet} AD (${currentAD.score}%): ${currentAD.summary}`
      : "",
    mdTara
      ? `MD Navtara: ${mdTara.icon} ${mdTara.taraName} — ${mdTara.interpretation}`
      : "",
    mdSB?.functionalRole
      ? `${mdPlanet} is ${mdSB.functionalRole} for your lagna — this colours the entire MD period.`
      : "",
    mdSB?.combusted
      ? `⚠️ ${mdPlanet} MD lord is combust — remedies for Sun strongly advised throughout.`
      : "",
  ].filter(Boolean);

  return {
    mdPlanet, mdStart, mdEnd,
    mdNavtara:    mdTara,
    mdScore:      mdBaseScore,
    mdFunctional: mdSB?.functionalRole ?? "Unknown",
    points, bands, peakAD, challengeAD, currentAD,
    summary, actionPlan,
  };
}
