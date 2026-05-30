/**
 * AstroLife — K.N. Rao Marriage Timing Engine (Faithful Realignment)
 *
 * Based on "Astrology and Timing of Marriage — a Scientific Approach"
 * by K.N. Rao (218-chart research study).
 *
 * 8 Core Parameters (binary √ / ×):
 * P1: Vimshottari MD/AD ↔ Lagna/LL or 7H/7L by PAC in D1 + D9  — 100% hit rate
 * P2: Chara Antardasha ↔ DK / DKN / Dara Pada / Upapada         — 96%
 * P3: Transit Jupiter on Vivah Saham (LL_lon + 7L_lon mod 360)   — 77%
 * P4: Double Transit Jupiter + Saturn on Lagna/LL or 7H/7L       — 85%
 * P5: Piya Milan — transit LL and transit 7L connect             — 98%
 * P6: Transit Jupiter ↔ natal Venus (male) / natal Mars (female) — 68%
 * P7: Sun + planet cluster near Lagna zone or 7H zone            — 70%
 * P8: Transit LL near 7H  OR  transit 7L near Lagna              — 59%
 *
 * Scoring: timingScore = round(fulfilledCount / 8 × 100)
 * K.N. Rao threshold: 6+/8 fulfilled = strong marriage window
 *
 * Supporting Observations (not core — confidence only):
 * O2: Transit Saturn ↔ Darakaraka by Jaimini rashi drishti
 * O3: Active MD / AD lord in 5th or 11th house of D9
 */

export type Language = "hinglish" | "hindi" | "english";

// ─────────────────────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────────────────────
export interface MarriageTimingInput {
  language?: Language;

  // ── D1 natal ──────────────────────────────────────────────────────────────
  d1LagnaSign?: string;
  d1LagnaLord?: string;
  d1Seventh?: string;
  d1SeventhLord?: string;
  d1Venus?: { house: number; sign: string; dignity: string };
  d1Jupiter?: { house: number; sign: string; dignity: string };

  // ── D9 navamsha ───────────────────────────────────────────────────────────
  d9LagnaSign?: string;
  d9Seventh?: string;
  d9SeventhLord?: string;
  d9Venus?: { house: number; sign: string; dignity: string };
  d9Jupiter?: { house: number; sign: string; dignity: string };

  // ── Vimshottari Dasha ─────────────────────────────────────────────────────
  currentMahadasha?: string;
  currentAntardasha?: string;

  // ── D9 dasha lord data (P1 D9 check, O3) ─────────────────────────────────
  d9MahadashaLordHouse?: number;
  d9AntardashaLordHouse?: number;
  d9MahadashaLordDignity?: string;
  d9AntardashaLordDignity?: string;
  mahadashaVargottama?: boolean;
  antardashaVargottama?: boolean;

  // ── Transits ──────────────────────────────────────────────────────────────
  transitSaturn?: { sign: string; house: number };
  transitJupiter?: { sign: string; house: number };
  transitVenus?: { sign: string; house: number };         // kept for compatibility
  transitLagnaLord?: { sign: string; house: number };
  transitSeventhLord?: { sign: string; house: number };
  transitPlanetHouses?: Record<string, number>;           // P7: planet→house from natal lagna

  // ── Natal references ──────────────────────────────────────────────────────
  natalAscendant?: string;
  natalSeventhSign?: string;
  natalVenusSign?: string;
  natalVenusHouse?: number;
  natalMarsSign?: string;          // P6 female
  natalMarsHouse?: number;         // P6 female
  natalJupiterSign?: string;
  natalJupiterHouse?: number;
  natalMoonSign?: string;          // compatibility
  natalMoonHouse?: number;         // compatibility

  // ── D1 dasha helpers (P1) ─────────────────────────────────────────────────
  d1SecondLord?: string;
  d1EleventhLord?: string;
  planetsInSeventh?: string[];
  natalPlanets?: Record<string, { house: number; sign: string; nakshatraLord: string }>;

  // ── Jaimini (P2, O2) ─────────────────────────────────────────────────────
  charaAntardashaSign?: string;    // Chara Antardasha sign — core P2 (96%)
  charaDashaSign?: string;         // Chara MD sign — fallback only
  darakarakaSign?: string;         // DK sign in D1
  darakarakaNavamsha?: string;     // DK sign in D9 (DKN)
  daraPadaSign?: string;           // Dara Pada A7
  upapadaSign?: string;            // Upapada A12 / UL
  upapadaLord?: string;            // kept for compatibility
  seventhLordNakshatraLord?: string; // kept for compatibility

  // ── Vivah Saham (P3) — MUST be (LL_lon + 7L_lon) % 360 → sign ───────────
  vivahSahamSign?: string;

  // ── Gender (P6) ───────────────────────────────────────────────────────────
  gender?: "male" | "female";      // default "male" → checks natal Venus
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT
// ─────────────────────────────────────────────────────────────────────────────
export interface TimingParameter {
  id: string;
  name: string;
  description: string;
  fulfilled: boolean;    // K.N. Rao binary √ = true, × = false
  score: number;         // 100 = fulfilled √ | 55 = partial ~ | 0 = not met ×
  isActive: boolean;     // score >= 50 (used for UI highlighting)
  evidence: string[];
}

export interface BonusLayer {
  id: string;
  name: string;
  rule: string;
  points: number;
  maxBonus: number;
  isActive: boolean;
  evidence: string[];
}

export interface MarriageTimingResult {
  system: string;
  language: Language;
  timingScore: number;
  activeParameterCount: number;     // count of fulfilled (√) params only
  totalParameterCount: number;
  strengthLabel: string;
  parameters: Record<string, TimingParameter>;
  strongestEvidence: string[];
  missingInputs: string[];
  bonusLayers: BonusLayer[];
  bonusScore: number;
  bonusActiveCount: number;
  bonusTotalCount: number;
  adjustedScore: number;
  backendJson: {
    timingScore: number;
    activeParameterCount: number;
    totalParameterCount: number;
    strengthLabel: string;
    headline: string;
    narrative: string;
    strongestEvidence: string[];
    parameters: Record<string, TimingParameter>;
    bonusLayers: BonusLayer[];
    bonusScore: number;
    bonusActiveCount: number;
    bonusTotalCount: number;
    adjustedScore: number;
  };
  userFacingNarrative: string;
  dashboardCard: {
    emoji: string;
    title: string;
    score: number;
    strength: string;
    activeParameters: string;
    brief: string;
    link: string;
  };
  pdfSection: {
    title: string;
    score: number;
    strength: string;
    activeParameters: string;
    narrative: string;
    parameters: Array<{ name: string; score: number; explanation: string; evidence: string[] }>;
    interpretation: string;
  };
  chatContext: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const SIGN_IDX: Record<string, number> = Object.fromEntries(SIGNS.map((s, i) => [s, i]));

// Jaimini Rashi Drishti — movable signs aspect fixed (not adjacent); fixed aspect movable; etc.
const RASHI_DRISHTI: Record<number, number[]> = {
  0:[4,7,10], 1:[0,6,9], 2:[5,8,11], 3:[1,7,10],
  4:[0,3,9],  5:[2,8,11], 6:[1,4,10], 7:[0,3,6],
  8:[2,5,11], 9:[1,4,7],  10:[3,6,9], 11:[2,5,8],
};

/** Two signs "connect" if same sign, 1-7 axis, or Jaimini rashi drishti. */
function signsConnect(a: string, b: string): { ok: boolean; how: string } {
  const x = SIGN_IDX[a], y = SIGN_IDX[b];
  if (x === undefined || y === undefined) return { ok: false, how: "" };
  if (x === y) return { ok: true, how: "same sign" };
  if (((y - x + 12) % 12) === 6) return { ok: true, how: "1-7 axis" };
  if (RASHI_DRISHTI[x]?.includes(y) || RASHI_DRISHTI[y]?.includes(x))
    return { ok: true, how: "Jaimini rashi drishti" };
  return { ok: false, how: "" };
}

/** Map planet name to its special-aspect type. */
function aspType(p?: string): "Jupiter" | "Saturn" | "Mars" | "any" {
  return p === "Jupiter" ? "Jupiter" : p === "Saturn" ? "Saturn" : p === "Mars" ? "Mars" : "any";
}

/** Returns true if `planet` at `fromHouse` casts a special or 7th aspect to `targetHouse`. */
function aspects(
  planet: "Jupiter" | "Saturn" | "Mars" | "any",
  fromHouse: number,
  targetHouse: number
): boolean {
  if (fromHouse === targetHouse) return true; // conjunction
  const special: number[] =
    planet === "Jupiter" ? [5, 9] :
    planet === "Saturn"  ? [3, 10] :
    planet === "Mars"    ? [4, 8] : [];
  return [7, ...special].some(a => ((fromHouse + a - 2) % 12) + 1 === targetHouse);
}

function clamp(n: number): number { return Math.max(0, Math.min(100, n)); }

function langText(lang: Language | undefined, hi: string, hn: string, en: string): string {
  if (lang === "hindi")   return hn;
  if (lang === "english") return en;
  return hi;
}

// ─────────────────────────────────────────────────────────────────────────────
// STRENGTH LABEL — calibrated to binary 8-parameter count
// 6/8 = 75 → "very_strong_activation"  (K.N. Rao: 86% of real marriages had this)
// 5/8 = 63 → "strong_window"
// 4/8 = 50 → "moderate_window"
// 3/8 = 38 → "possible_window"
// <3  = 0-25 → "weak_timing"
// ─────────────────────────────────────────────────────────────────────────────
function mkStrengthLabel(score: number): string {
  if (score >= 75) return "very_strong_activation";
  if (score >= 63) return "strong_window";
  if (score >= 50) return "moderate_window";
  if (score >= 38) return "possible_window";
  return "weak_timing";
}

function strengthText(lang: Language | undefined, score: number): string {
  const lbl = mkStrengthLabel(score);
  const map: Record<string, [string, string, string]> = {
    very_strong_activation: ["Very Strong Activation", "बहुत मजबूत सक्रियण", "Very Strong Activation"],
    strong_window:          ["Strong Window",          "मजबूत विंडो",          "Strong Window"],
    moderate_window:        ["Moderate Window",        "मध्यम विंडो",           "Moderate Window"],
    possible_window:        ["Possible Window",        "संभव विंडो",             "Possible Window"],
    weak_timing:            ["Weak Timing",            "कमजोर टाइमिंग",          "Weak Timing"],
  };
  const [hi, hn, en] = map[lbl] ?? ["—","—","—"];
  return langText(lang, hi, hn, en);
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — VIMSHOTTARI DASHA PAC WITH MARRIAGE AXIS (D1 + D9)
// K.N. Rao: MD or AD must have PAC with 7H/7L, Venus, Jupiter, or LL/Lagna
// in BOTH D1 and D9.  Hit rate: 100%
// ─────────────────────────────────────────────────────────────────────────────
function evalP1(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const md  = input.currentMahadasha  ?? "";
  const ad  = input.currentAntardasha ?? "";
  const d17L = input.d1SeventhLord    ?? "";
  const LL   = input.d1LagnaLord      ?? "";
  const d12L = input.d1SecondLord     ?? "";
  const d11L = input.d1EleventhLord   ?? "";
  const np   = input.natalPlanets     ?? {};
  const in7  = input.planetsInSeventh ?? [];

  // ── D1 marriage-axis connection ──────────────────────────────────────────
  // Primary: MD/AD IS a marriage lord (Venus, Jupiter, 7L, LL)
  const primary = new Set(["Venus", "Jupiter", d17L, LL].filter(Boolean));
  const mdPrimary = primary.has(md);
  const adPrimary = primary.has(ad);

  // Secondary: placed in 7th house, or aspects 7th house
  const mdIn7   = in7.includes(md) || np[md]?.house === 7;
  const adIn7   = in7.includes(ad) || np[ad]?.house === 7;
  const mdAsp7  = np[md]?.house ? aspects(aspType(md), np[md].house, 7) : false;
  const adAsp7  = np[ad]?.house ? aspects(aspType(ad), np[ad].house, 7) : false;

  // Supportive: 2nd or 11th lord
  const mdSupport = md === d12L || md === d11L;
  const adSupport = ad === d12L || ad === d11L;

  const d1Strong    = mdPrimary || adPrimary || mdIn7 || adIn7;
  const d1Moderate  = mdAsp7  || adAsp7 || mdSupport || adSupport;
  const d1Hit = d1Strong || d1Moderate;

  if (mdPrimary) ev.push(`Mahadasha: ${md} is a primary marriage lord (Venus/Jupiter/7L/LL)`);
  if (adPrimary) ev.push(`Antardasha: ${ad} is a primary marriage lord`);
  if (mdIn7 && !mdPrimary)   ev.push(`MD lord ${md} placed in natal 7th house (D1)`);
  if (adIn7 && !adPrimary)   ev.push(`AD lord ${ad} placed in natal 7th house (D1)`);
  if (mdAsp7 && !mdIn7 && !mdPrimary) ev.push(`MD lord ${md} aspects natal 7th house from H${np[md]?.house}`);
  if (adAsp7 && !adIn7 && !adPrimary) ev.push(`AD lord ${ad} aspects natal 7th house from H${np[ad]?.house}`);
  if ((mdSupport || adSupport) && !d1Strong) ev.push(`${mdSupport ? md : ad} is 2nd/11th lord — secondary marriage support`);

  // ── D9 confirmation ──────────────────────────────────────────────────────
  const mdD9H = input.d9MahadashaLordHouse  ?? 0;
  const adD9H = input.d9AntardashaLordHouse ?? 0;
  const mdDig = input.d9MahadashaLordDignity  ?? "—";
  const adDig = input.d9AntardashaLordDignity ?? "—";
  const mdVg  = input.mahadashaVargottama  ?? false;
  const adVg  = input.antardashaVargottama ?? false;

  const hasD9Data = mdD9H > 0 || adD9H > 0 || mdVg || adVg;

  // "Connected" in D9 = 7th/1st/5th/9th/11th house, OR vargottama, OR exalted/own
  const D9_GOOD = [1, 5, 7, 9, 11];
  const mdD9Ok = D9_GOOD.includes(mdD9H) || mdVg || ["Exalted","Own"].includes(mdDig);
  const adD9Ok = D9_GOOD.includes(adD9H) || adVg || ["Exalted","Own"].includes(adDig);
  const d9Hit  = mdD9Ok || adD9Ok;

  if (mdD9Ok) ev.push(`MD lord ${md} in D9 H${mdD9H}${mdVg ? " (vargottama)" : mdDig !== "—" ? ` (${mdDig})` : ""} — D9 supports`);
  if (adD9Ok) ev.push(`AD lord ${ad} in D9 H${adD9H}${adVg ? " (vargottama)" : adDig !== "—" ? ` (${adDig})` : ""} — D9 confirms`);

  if (!d1Hit) ev.push(`${md}/${ad} not connected to marriage axis in D1 — weak dasha period for marriage`);
  if (d1Hit && !hasD9Data) ev.push("D9 data unavailable — D1 connection found but D9 confirmation pending");
  if (d1Hit && hasD9Data && !d9Hit) ev.push(`${md}/${ad} in unfavourable D9 position — D9 doesn't confirm D1 connection`);

  const fulfilled = d1Strong && d9Hit;                           // strict: primary D1 + D9 both
  const score = fulfilled ? 100 : (d1Hit && !hasD9Data) ? 55    // D1 ok, D9 unknown
              : (d1Hit && !d9Hit) ? 55                           // D1 ok, D9 weak
              : d1Moderate ? 55 : 0;                             // only secondary D1

  return { fulfilled, score, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P2 — CHARA ANTARDASHA ↔ DK / DKN / DARA PADA / UPAPADA
// K.N. Rao: current Chara Antardasha sign must connect (signsConnect) to at
// least one of: DK (Darakaraka), DKN (DK-navamsha), A7 (Dara Pada), A12 (Upapada)
// Hit rate: 96%
// ─────────────────────────────────────────────────────────────────────────────
function evalP2(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  // Use charaAntardashaSign first; fall back to charaDashaSign (MD sign)
  const charaAD = input.charaAntardashaSign ?? input.charaDashaSign ?? "";

  if (!charaAD) {
    ev.push("Chara Antardasha sign not available — Jaimini data required for P2");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  const dk  = input.darakarakaSign      ?? "";
  const dkN = input.darakarakaNavamsha  ?? "";
  const a7  = input.daraPadaSign        ?? "";
  const ul  = input.upapadaSign         ?? "";

  if (!dk && !a7 && !ul) {
    ev.push("Jaimini marriage axis data not available (DK/A7/UL needed)");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  let hits = 0;
  if (dk)  { const c = signsConnect(charaAD, dk);  if (c.ok) { hits++; ev.push(`Chara AD ${charaAD} ↔ Darakaraka ${dk} (${c.how})`); } }
  if (dkN) { const c = signsConnect(charaAD, dkN); if (c.ok) { hits++; ev.push(`Chara AD ${charaAD} ↔ DK-Navamsha ${dkN} (${c.how})`); } }
  if (a7)  { const c = signsConnect(charaAD, a7);  if (c.ok) { hits++; ev.push(`Chara AD ${charaAD} ↔ Dara Pada A7 ${a7} (${c.how})`); } }
  if (ul)  { const c = signsConnect(charaAD, ul);  if (c.ok) { hits++; ev.push(`Chara AD ${charaAD} ↔ Upapada UL ${ul} (${c.how})`); } }

  if (hits === 0) ev.push(`Chara AD ${charaAD} not connecting to DK(${dk||"?"}), A7(${a7||"?"}), or UL(${ul||"?"})`);

  const fulfilled = hits >= 1;
  return { fulfilled, score: fulfilled ? 100 : 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P3 — TRANSIT JUPITER ON VIVAH SAHAM
// Vivah Saham = (Lagna Lord longitude + 7th Lord longitude) mod 360 → sign
// (NOT the classical Arabic lot formula — K.N. Rao book page 18 specific formula)
// Hit rate: 77%
// ─────────────────────────────────────────────────────────────────────────────
function evalP3(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const vs  = input.vivahSahamSign ?? "";
  const jS  = input.transitJupiter?.sign ?? "";
  const jH  = input.transitJupiter?.house ?? 0;

  if (!vs) {
    ev.push("Vivah Saham not computed — ensure scanner uses (LL_lon + 7L_lon) % 360 formula");
    return { fulfilled: false, score: 0, evidence: ev };
  }
  if (!jS) {
    ev.push(`Vivah Saham in ${vs}; Jupiter transit data unavailable`);
    return { fulfilled: false, score: 0, evidence: ev };
  }

  // Direct conjunction: Jupiter in same sign as Vivah Saham
  if (jS === vs) {
    ev.push(`Transit Jupiter conjunct Vivah Saham in ${vs} — direct marriage Saham activation`);
    return { fulfilled: true, score: 100, evidence: ev };
  }

  // Jupiter's special aspects (5th/7th/9th) hitting Vivah Saham sign
  if (jH > 0) {
    const vsIdx = SIGN_IDX[vs] ?? -1;
    const jIdx  = SIGN_IDX[jS] ?? -1;
    if (vsIdx >= 0 && jIdx >= 0) {
      // Check if Jupiter (at jIdx) aspects sign vsIdx via 5th/7th/9th
      const asp5 = SIGNS[(jIdx + 4) % 12];
      const asp7 = SIGNS[(jIdx + 6) % 12];
      const asp9 = SIGNS[(jIdx + 8) % 12];
      if (vs === asp5 || vs === asp7 || vs === asp9) {
        ev.push(`Transit Jupiter (${jS}) aspects Vivah Saham ${vs} — Saham partially activated`);
        return { fulfilled: false, score: 55, evidence: ev };
      }
      // Also check Jaimini rashi drishti connection
      const c = signsConnect(jS, vs);
      if (c.ok) {
        ev.push(`Transit Jupiter (${jS}) connects to Vivah Saham ${vs} via ${c.how}`);
        return { fulfilled: false, score: 55, evidence: ev };
      }
    }
  }

  ev.push(`Transit Jupiter in ${jS} — Vivah Saham ${vs} not activated this period`);
  return { fulfilled: false, score: 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P4 — DOUBLE TRANSIT: JUPITER + SATURN ON LAGNA/LL  OR  7H/7L
// K.N. Rao: Both outer planets must simultaneously activate the marriage axis
// (houses 1 or 7, or where the lagna lord / 7th lord sit natally).
// Hit rate: 85%
// ─────────────────────────────────────────────────────────────────────────────
function evalP4(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const jH  = input.transitJupiter?.house ?? 0;
  const sH  = input.transitSaturn?.house  ?? 0;
  const np  = input.natalPlanets ?? {};
  const LL  = input.d1LagnaLord    ?? "";
  const d17L = input.d1SeventhLord ?? "";

  if (!jH || !sH) {
    ev.push("Jupiter or Saturn transit data missing — P4 cannot be evaluated");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  // Natal house of Lagna Lord and 7th Lord (for expanded axis)
  const llNatalH = np[LL]?.house  ?? 0;
  const slNatalH = np[d17L]?.house ?? 0;

  function activatesAxis(planet: "Jupiter"|"Saturn", trHouse: number): { ok: boolean; what: string } {
    if (aspects(planet, trHouse, 1)) return { ok: true, what: `H1 (Lagna)` };
    if (aspects(planet, trHouse, 7)) return { ok: true, what: `H7 (7th house)` };
    if (llNatalH > 0 && aspects(planet, trHouse, llNatalH)) return { ok: true, what: `H${llNatalH} (${LL}'s house)` };
    if (slNatalH > 0 && aspects(planet, trHouse, slNatalH)) return { ok: true, what: `H${slNatalH} (${d17L}'s house)` };
    return { ok: false, what: "" };
  }

  const jAct = activatesAxis("Jupiter", jH);
  const sAct = activatesAxis("Saturn",  sH);

  if (jAct.ok) ev.push(`Jupiter (H${jH}) activates ${jAct.what}`);
  else ev.push(`Jupiter (H${jH}) — not activating marriage axis`);

  if (sAct.ok) ev.push(`Saturn (H${sH}) activates ${sAct.what}`);
  else ev.push(`Saturn (H${sH}) — not activating marriage axis`);

  if (jAct.ok && sAct.ok) {
    ev.push("DOUBLE TRANSIT COMPLETE — Jupiter + Saturn both activate marriage axis simultaneously");
    return { fulfilled: true, score: 100, evidence: ev };
  }
  if (jAct.ok || sAct.ok) {
    return { fulfilled: false, score: 55, evidence: ev };
  }
  return { fulfilled: false, score: 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P5 — PIYA MILAN: TRANSIT LAGNA LORD + TRANSIT 7TH LORD CONNECT
// K.N. Rao: The two lord-rulers of self (LL) and partner (7L) must come
// together in transit — by conjunction, 1-7 axis, or Jaimini signs connection.
// Hit rate: 98%
// ─────────────────────────────────────────────────────────────────────────────
function evalP5(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const tLL = input.transitLagnaLord;
  const t7L = input.transitSeventhLord;

  if (!tLL || !t7L) {
    ev.push("Transit lagna lord / 7th lord positions not available — P5 cannot be evaluated");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  const llH = tLL.house, l7H = t7L.house;
  const llS = tLL.sign,  l7S = t7L.sign;

  // Strong: conjunction or 1-7 axis or one in the other's natal house
  const conjunct   = llH > 0 && l7H > 0 && llH === l7H;
  const axis17     = (llH === 1 && l7H === 7) || (llH === 7 && l7H === 1);
  const llIn7H     = llH === 7;
  const l7InLagna  = l7H === 1;

  if (conjunct)  { ev.push(`Piya Milan: transit LL + 7L conjunct in H${llH} — peak marriage trigger`); }
  if (axis17)    { ev.push(`Piya Milan: LL in H${llH} ↔ 7L in H${l7H} — 1-7 axis complete`); }
  if (llIn7H && !axis17)   ev.push(`Transit Lagna lord in natal 7th house`);
  if (l7InLagna && !axis17) ev.push(`Transit 7th lord in natal Lagna`);

  const strong = conjunct || axis17 || llIn7H || l7InLagna;

  // Mild: signs connect by Jaimini, or mutual special aspect
  const c = signsConnect(llS, l7S);
  const llAsp = aspType(input.d1LagnaLord);
  const l7Asp = aspType(input.d1SeventhLord);
  const mutualAsp = llH > 0 && l7H > 0 &&
    (aspects(llAsp, llH, l7H) || aspects(l7Asp, l7H, llH));

  if (!strong && c.ok)       ev.push(`Transit LL (${llS}) ↔ 7L (${l7S}) — ${c.how} (Piya Milan soft connection)`);
  if (!strong && mutualAsp)  ev.push(`Transit LL (H${llH}) and 7L (H${l7H}) in mutual planetary aspect`);

  const mild = c.ok || mutualAsp;

  if (!strong && !mild)
    ev.push(`Transit LL H${llH} (${llS}) and 7L H${l7H} (${l7S}) — not connecting this period`);

  // Any connection counts as fulfilled (98% hit rate means the bar is broad)
  const fulfilled = strong || mild;
  const score = strong ? 100 : mild ? 55 : 0;
  return { fulfilled, score, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P6 — TRANSIT JUPITER ↔ NATAL VENUS (MALE) / NATAL MARS (FEMALE)
// K.N. Rao: Jupiter must transit over the gender-specific romance karaka.
// Male: natal Venus.  Female: natal Mars.  Hit rate: 68%
// ─────────────────────────────────────────────────────────────────────────────
function evalP6(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const jS = input.transitJupiter?.sign  ?? "";
  const jH = input.transitJupiter?.house ?? 0;

  if (!jS) {
    ev.push("Jupiter transit data unavailable — P6 cannot be evaluated");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  const isFemale = input.gender === "female";
  const targetSign = isFemale ? (input.natalMarsSign ?? "") : (input.natalVenusSign ?? "");
  const targetHouse = isFemale ? (input.natalMarsHouse ?? 0) : (input.natalVenusHouse ?? 0);
  const karaka = isFemale ? "natal Mars" : "natal Venus";

  if (!targetSign && !targetHouse) {
    ev.push(`${isFemale ? "Natal Mars" : "Natal Venus"} data not available — P6 cannot be evaluated`);
    return { fulfilled: false, score: 0, evidence: ev };
  }

  // Direct conjunction: Jupiter in same sign as natal Venus/Mars
  if (targetSign && jS === targetSign) {
    ev.push(`Transit Jupiter conjunct ${karaka} in ${targetSign} — romance karaka directly activated`);
    return { fulfilled: true, score: 100, evidence: ev };
  }

  // Jupiter's special aspects (5th/7th/9th) on natal Venus/Mars house
  if (jH > 0 && targetHouse > 0 && aspects("Jupiter", jH, targetHouse)) {
    ev.push(`Transit Jupiter (H${jH}) aspects ${karaka} (H${targetHouse}) — karaka aspected`);
    return { fulfilled: false, score: 55, evidence: ev };
  }

  ev.push(`Transit Jupiter (${jS} H${jH}) not activating ${karaka}${targetSign ? ` in ${targetSign}` : ""}`);
  return { fulfilled: false, score: 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P7 — SUN + PLANET CLUSTER NEAR LAGNA ZONE OR 7H ZONE
// K.N. Rao: Sun and most transiting planets should cluster in or around the
// Lagna (houses 12-1-2) or 7th house (houses 6-7-8) at marriage time.
// Hit rate: 70%
// ─────────────────────────────────────────────────────────────────────────────
function evalP7(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const tph = input.transitPlanetHouses ?? {};

  const PLANET_LIST = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  const sunH = tph["Sun"] ?? 0;

  if (!sunH && Object.keys(tph).length === 0) {
    ev.push("Transit planet houses not provided — P7 cannot be evaluated");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  const LAGNA_ZONE   = [12, 1, 2];
  const SEVENTH_ZONE = [6, 7, 8];

  const inLagna  = PLANET_LIST.filter(p => LAGNA_ZONE.includes(tph[p]   ?? 0));
  const inSeventh= PLANET_LIST.filter(p => SEVENTH_ZONE.includes(tph[p] ?? 0));
  const maxZone  = Math.max(inLagna.length, inSeventh.length);
  const bestZone = inLagna.length >= inSeventh.length ? "lagna zone" : "7th zone";
  const bestPlanets = inLagna.length >= inSeventh.length ? inLagna : inSeventh;

  const sunInLagna  = LAGNA_ZONE.includes(sunH);
  const sunIn7th    = SEVENTH_ZONE.includes(sunH);
  const sunInZone   = sunInLagna || sunIn7th;
  const sunZone     = sunInLagna ? "lagna zone" : "7th zone";

  if (sunInZone) ev.push(`Sun in ${sunZone} (H${sunH}) — leading indicator met`);
  else ev.push(`Sun in H${sunH} — not in lagna zone or 7th zone (P7 weak)`);

  if (maxZone > 0) ev.push(`${maxZone} planets in ${bestZone}: ${bestPlanets.join(", ")}`);

  // fulfilled: Sun in zone AND 4+ planets (Sun + 3 others = "most")
  if (sunInZone && maxZone >= 4) {
    ev.push(`Cluster confirmed — ${maxZone}/7 planets in ${bestZone} with Sun`);
    return { fulfilled: true, score: 100, evidence: ev };
  }
  if (sunInZone && maxZone >= 3) {
    ev.push(`Partial cluster — ${maxZone}/7 planets in ${bestZone} (need 4+)`);
    return { fulfilled: false, score: 55, evidence: ev };
  }

  return { fulfilled: false, score: 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// P8 — TRANSIT LL NEAR 7H  OR  TRANSIT 7L NEAR LAGNA
// K.N. Rao: Lagna lord transiting near the 7th house, or 7th lord transiting
// near the Lagna — the two axis lords cross-visit each other's domain.
// Hit rate: 59%
// ─────────────────────────────────────────────────────────────────────────────
function evalP8(input: MarriageTimingInput): { fulfilled: boolean; score: number; evidence: string[] } {
  const ev: string[] = [];
  const tLL = input.transitLagnaLord;
  const t7L = input.transitSeventhLord;

  if (!tLL && !t7L) {
    ev.push("Transit lagna lord / 7th lord positions not available — P8 cannot be evaluated");
    return { fulfilled: false, score: 0, evidence: ev };
  }

  const llH = tLL?.house ?? 0;
  const l7H = t7L?.house ?? 0;

  // Exact: LL in 7th house OR 7L in 1st house
  const llIn7H     = llH === 7;
  const l7InLagna  = l7H === 1;

  // Near: LL in H6 or H8 (adjacent to 7H) OR 7L in H12 or H2 (adjacent to lagna)
  const llNear7H    = [6, 8].includes(llH);
  const l7NearLagna = [12, 2].includes(l7H);

  if (llIn7H)     ev.push(`Transit Lagna lord in natal 7th house — LL crosses into partner's domain`);
  if (l7InLagna)  ev.push(`Transit 7th lord in natal Lagna — 7L crosses into self's domain`);
  if (llNear7H && !llIn7H)    ev.push(`Transit Lagna lord in H${llH} — adjacent to 7th house`);
  if (l7NearLagna && !l7InLagna) ev.push(`Transit 7th lord in H${l7H} — adjacent to Lagna`);

  if (!llH && !l7H) ev.push("Transit data unavailable");
  else if (!llIn7H && !l7InLagna && !llNear7H && !l7NearLagna)
    ev.push(`Transit LL H${llH||"?"}  7L H${l7H||"?"} — not in each other's axis zone this period`);

  const fulfilled = llIn7H || l7InLagna;
  const score = fulfilled ? 100 : (llNear7H || l7NearLagna) ? 55 : 0;
  return { fulfilled, score, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// O2 — SATURN ↔ DARAKARAKA (Jaimini rashi drishti)
// ─────────────────────────────────────────────────────────────────────────────
function evalO2(input: MarriageTimingInput): { points: number; evidence: string[] } {
  const ev: string[] = [];
  const satS = input.transitSaturn?.sign ?? "";
  const dk   = input.darakarakaSign      ?? "";

  if (!satS) { ev.push("Saturn transit sign unavailable"); return { points: 0, evidence: ev }; }
  if (!dk)   { ev.push("Darakaraka sign unavailable");    return { points: 0, evidence: ev }; }

  const c = signsConnect(satS, dk);
  if (c.ok) {
    ev.push(`Transit Saturn (${satS}) ↔ Darakaraka (${dk}) — ${c.how} — Saturn pressures spouse karaka`);
    return { points: 1, evidence: ev };
  }
  ev.push(`Transit Saturn (${satS}) not connecting to Darakaraka (${dk})`);
  return { points: 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// O3 — MD / AD LORD IN 5TH OR 11TH HOUSE OF D9
// ─────────────────────────────────────────────────────────────────────────────
function evalO3(input: MarriageTimingInput): { points: number; evidence: string[] } {
  const ev: string[] = [];
  const md    = input.currentMahadasha  ?? "";
  const ad    = input.currentAntardasha ?? "";
  const mdD9H = input.d9MahadashaLordHouse  ?? 0;
  const adD9H = input.d9AntardashaLordHouse ?? 0;

  if (!mdD9H && !adD9H) {
    ev.push("D9 dasha lord positions not available");
    return { points: 0, evidence: ev };
  }

  const md5_11 = mdD9H === 5 || mdD9H === 11;
  const ad5_11 = adD9H === 5 || adD9H === 11;

  if (md5_11) ev.push(`MD lord ${md} in D9 H${mdD9H} — 5/11 fulfillment axis in navamsha`);
  if (ad5_11) ev.push(`AD lord ${ad} in D9 H${adD9H} — 5/11 fulfillment axis in navamsha`);

  if (!md5_11 && !ad5_11)
    ev.push(`MD ${md} in D9 H${mdD9H||"?"}, AD ${ad} in D9 H${adD9H||"?"} — not in 5-11 axis`);

  return { points: (md5_11 || ad5_11) ? 1 : 0, evidence: ev };
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMETER & OBSERVATION METADATA
// ─────────────────────────────────────────────────────────────────────────────
const PARAM_META: Record<string, { name: string; description: string }> = {
  P1_vimshottari: {
    name: "P1 — Vimshottari Dasha PAC (D1+D9)",
    description: "MD/AD lord connected to 7H/7L, Venus, Jupiter, or LL by PAC in BOTH D1 and D9. K.N. Rao's most fundamental timing filter (100% hit rate in his research).",
  },
  P2_chara_antardasha: {
    name: "P2 — Chara Antardasha (Jaimini)",
    description: "Current Chara Antardasha sign connects with Darakaraka (DK), DK-navamsha, Dara Pada (A7), or Upapada (UL). Jaimini layer with 96% hit rate.",
  },
  P3_vivah_saham: {
    name: "P3 — Jupiter on Vivah Saham",
    description: "Transit Jupiter in the Vivah Saham sign [= (LL_longitude + 7L_longitude) mod 360]. 77% hit rate — often the final 'yes' trigger before marriage.",
  },
  P4_double_transit: {
    name: "P4 — Double Transit (Jupiter + Saturn)",
    description: "Jupiter AND Saturn simultaneously activate Lagna/LL or 7H/7L by transit or special aspect. K.N. Rao's classic outer-planet double transit rule (85%).",
  },
  P5_piya_milan: {
    name: "P5 — Piya Milan (Transit LL ↔ 7L)",
    description: "Transit Lagna lord and transit 7th lord meet — by conjunction, 1-7 axis, or Jaimini connection. The event-trigger parameter with 98% hit rate.",
  },
  P6_jupiter_karaka: {
    name: "P6 — Jupiter on Venus/Mars (Karaka)",
    description: "Transit Jupiter over natal Venus (male) or natal Mars (female) — the gender-specific romance karaka. 68% hit rate; confirms emotional readiness.",
  },
  P7_sun_cluster: {
    name: "P7 — Sun + Planet Cluster (Lagna/7H Zone)",
    description: "Sun and majority of transiting planets clustered in lagna zone (H12-1-2) or 7th zone (H6-7-8). 70% hit rate — astrological 'gathering energy'.",
  },
  P8_ll_near_7h: {
    name: "P8 — LL near 7H or 7L near Lagna",
    description: "Transit Lagna lord in or adjacent to 7th house, OR transit 7th lord in or adjacent to Lagna. Axis lords cross-visiting each other's domain (59%).",
  },
};

const OBS_META: Record<string, { name: string; rule: string; maxBonus: number }> = {
  O2_saturn_dk: {
    name: "O2 — Saturn ↔ Darakaraka",
    rule: "Transit Saturn connects to Darakaraka sign by Jaimini rashi drishti — Saturn formalises spouse karaka.",
    maxBonus: 1,
  },
  O3_d9_511: {
    name: "O3 — MD/AD in D9 5th or 11th",
    rule: "Active Mahadasha or Antardasha lord in 5th or 11th house of D9 — fulfillment axis active in navamsha.",
    maxBonus: 1,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
export function analyzeMarriageTimingKNRao(input: MarriageTimingInput): MarriageTimingResult {
  const language = input.language ?? "hinglish";

  // ── Evaluate all 8 parameters ────────────────────────────────────────────
  const evaluators: Record<string, (i: MarriageTimingInput) => { fulfilled: boolean; score: number; evidence: string[] }> = {
    P1_vimshottari:     evalP1,
    P2_chara_antardasha: evalP2,
    P3_vivah_saham:     evalP3,
    P4_double_transit:  evalP4,
    P5_piya_milan:      evalP5,
    P6_jupiter_karaka:  evalP6,
    P7_sun_cluster:     evalP7,
    P8_ll_near_7h:      evalP8,
  };

  const parameters: Record<string, TimingParameter> = {};
  for (const [id, fn] of Object.entries(evaluators)) {
    const { fulfilled, score, evidence } = fn(input);
    const meta = PARAM_META[id]!;
    parameters[id] = {
      id,
      name: meta.name,
      description: meta.description,
      fulfilled,
      score,
      isActive: score >= 50,   // visual: both 100 and 55 show as "active"
      evidence,
    };
  }

  // ── Binary scoring ───────────────────────────────────────────────────────
  const paramArray     = Object.values(parameters);
  const fulfilledParams = paramArray.filter(p => p.fulfilled);
  const fulfilledCount  = fulfilledParams.length;
  const timingScore     = Math.round(fulfilledCount / 8 * 100);
  const sLabel          = mkStrengthLabel(timingScore);
  const sText           = strengthText(language, timingScore);

  // ── Observations ─────────────────────────────────────────────────────────
  const o2 = evalO2(input);
  const o3 = evalO3(input);
  const bonusLayers: BonusLayer[] = [
    {
      id: "O2_saturn_dk",
      name: OBS_META.O2_saturn_dk.name,
      rule: OBS_META.O2_saturn_dk.rule,
      points: o2.points,
      maxBonus: OBS_META.O2_saturn_dk.maxBonus,
      isActive: o2.points > 0,
      evidence: o2.evidence,
    },
    {
      id: "O3_d9_511",
      name: OBS_META.O3_d9_511.name,
      rule: OBS_META.O3_d9_511.rule,
      points: o3.points,
      maxBonus: OBS_META.O3_d9_511.maxBonus,
      isActive: o3.points > 0,
      evidence: o3.evidence,
    },
  ];
  const bonusRaw         = o2.points + o3.points;
  const bonusScore       = Math.min(4, bonusRaw);   // max +4 nudge
  const bonusActiveCount = bonusLayers.filter(b => b.isActive).length;
  const bonusTotalCount  = bonusLayers.length;
  const adjustedScore    = clamp(Math.round(timingScore + bonusScore));

  // ── Evidence summary ─────────────────────────────────────────────────────
  const strongestEvidence = fulfilledParams
    .flatMap(p => p.evidence.slice(0, 2));

  const missingInputs: string[] = [];
  if (!input.charaAntardashaSign && !input.charaDashaSign) missingInputs.push("Chara Antardasha sign (P2)");
  if (!input.vivahSahamSign)   missingInputs.push("Vivah Saham sign (P3)");
  if (!input.transitJupiter)   missingInputs.push("Jupiter transit");
  if (!input.transitSaturn)    missingInputs.push("Saturn transit");
  if (!input.transitLagnaLord) missingInputs.push("Transit Lagna lord (P5/P8)");

  // ── Headline ─────────────────────────────────────────────────────────────
  const headline = langText(language,
    `Marriage Timing: ${fulfilledCount}/8 √ fulfilled · ${sText} · K.N. Rao Research Engine`,
    `विवाह टाइमिंग: ${fulfilledCount}/8 √ पूर्ण · ${sText}`,
    `Marriage Timing: ${fulfilledCount}/8 parameters fulfilled · ${sText}`,
  );

  // ── Backend narrative ─────────────────────────────────────────────────────
  const topActive = fulfilledParams.slice(0, 3).map(p => p.name).join(", ") || "none currently";
  const backendNarrative = langText(language,
    `${sText} window. ${fulfilledCount}/8 K.N. Rao parameters fulfilled. Strongest: ${topActive}.${missingInputs.length ? " Data gap: " + missingInputs[0] + "." : ""}`,
    `${sText} विंडो। ${fulfilledCount}/8 पैरामीटर सक्रिय।`,
    `${sText} window. ${fulfilledCount}/8 K.N. Rao parameters fulfilled. Strongest: ${topActive}.`,
  );

  // ── User narrative ────────────────────────────────────────────────────────
  const p1 = parameters.P1_vimshottari;
  const p4 = parameters.P4_double_transit;
  const p5 = parameters.P5_piya_milan;
  const userNarrative = langText(language,
    `${sText} window — ${fulfilledCount}/8 K.N. Rao parameters √ fulfilled.

${p1.fulfilled ? `✦ P1 Dasha (√): ${p1.evidence[0] ?? "Active"}` : `○ P1 Dasha (×): ${p1.evidence[0] ?? "Not connected"}`}
${p4.fulfilled ? `✦ P4 Double Transit (√): ${p4.evidence[0] ?? "Active"}` : `○ P4 Double Transit (×): ${p4.evidence[0] ?? "Not met"}`}
${p5.fulfilled ? `✦ P5 Piya Milan (√): ${p5.evidence[0] ?? "Active"}` : `○ P5 Piya Milan (×): ${p5.evidence[0] ?? "Not triggered"}`}

${fulfilledCount >= 6 ? "6+ parameters fulfilled — K.N. Rao threshold met. Strong marriage window confirmed." : fulfilledCount >= 5 ? "5 parameters fulfilled — strong support. Watch for P4/P5 activation to cross threshold." : fulfilledCount >= 4 ? "4 parameters active — moderate support. Use 9-month scan to find a stronger window." : "Fewer than 4 parameters — patience needed. Next strong window visible in 9-month scan."}

Note: K.N. Rao's engine gives timing confidence, not fixed destiny. Combine with D1 promise, D9 quality, and practical readiness.`,
    `${sText} विंडो — ${fulfilledCount}/8 पैरामीटर पूर्ण।`,
    `${sText} window — ${fulfilledCount}/8 K.N. Rao parameters fulfilled. ${fulfilledCount >= 6 ? "K.N. Rao threshold met (6+/8)." : "Use 9-month scan for stronger window."}`,
  );

  // ── Dashboard card ────────────────────────────────────────────────────────
  const dashboardCard = {
    emoji: "💍",
    title: langText(language, "Marriage Window — K.N. Rao Engine", "विवाह विंडो", "Marriage Window — K.N. Rao Engine"),
    score: timingScore,
    strength: sText,
    activeParameters: `${fulfilledCount}/8`,
    brief: langText(language,
      `${fulfilledCount}/8 parameters √. ${fulfilledParams[0]?.name ?? "Check full analysis"}. ${sText}.`,
      `${fulfilledCount}/8 √ · ${sText}`,
      `${fulfilledCount}/8 fulfilled. ${sText}.`,
    ),
    link: "View Full Marriage Timing Analysis →",
  };

  // ── PDF section ───────────────────────────────────────────────────────────
  const pdfSection = {
    title: "💍 Marriage Timing Validator — K.N. Rao Research Engine",
    score: timingScore,
    strength: sText,
    activeParameters: `${fulfilledCount}/8`,
    narrative: backendNarrative,
    parameters: paramArray.map(p => ({
      name: p.name,
      score: p.score,
      explanation: p.description,
      evidence: p.evidence,
    })),
    interpretation: langText(language,
      `${fulfilledCount}/8 parameters fulfilled — ${sText} (${timingScore}/100). ${fulfilledCount >= 6 ? "K.N. Rao threshold (6+/8) met — high confidence window." : fulfilledCount >= 4 ? "Moderate support — confirm with D1 promise and compatibility." : "Weak timing — use 9-month scanner."}`,
      `${fulfilledCount}/8 पूर्ण — ${sText} (${timingScore}/100)।`,
      `${fulfilledCount}/8 fulfilled — ${sText} (${timingScore}/100). ${fulfilledCount >= 6 ? "K.N. Rao threshold met." : "Use 9-month scanner for stronger period."}`,
    ),
  };

  // ── Chat context ──────────────────────────────────────────────────────────
  const chatContext = `AstroLife — K.N. Rao Marriage Timing Engine (Faithful Realignment)
Score: ${timingScore}/100 (${fulfilledCount}/8 fulfilled) | Strength: ${sText}
Fulfilled: ${fulfilledParams.map(p => p.id).join(", ") || "none"}
Partial: ${paramArray.filter(p => p.score === 55).map(p => p.id).join(", ") || "none"}
Missing inputs: ${missingInputs.join(", ") || "none"}
Language: ${language}
Rules: No fixed destiny. Combine with D1 promise, D9 quality, Ashtakoot, KP 2-7-11, life readiness.`;

  return {
    system: "AstroLife Marriage Timing Validator — K.N. Rao Faithful Engine v3",
    language,
    timingScore,
    activeParameterCount: fulfilledCount,
    totalParameterCount: 8,
    strengthLabel: sLabel,
    parameters,
    strongestEvidence,
    missingInputs,
    bonusLayers,
    bonusScore,
    bonusActiveCount,
    bonusTotalCount,
    adjustedScore,
    backendJson: {
      timingScore,
      activeParameterCount: fulfilledCount,
      totalParameterCount: 8,
      strengthLabel: sLabel,
      headline,
      narrative: backendNarrative,
      strongestEvidence,
      parameters,
      bonusLayers,
      bonusScore,
      bonusActiveCount,
      bonusTotalCount,
      adjustedScore,
    },
    userFacingNarrative: userNarrative,
    dashboardCard,
    pdfSection,
    chatContext,
  };
}
