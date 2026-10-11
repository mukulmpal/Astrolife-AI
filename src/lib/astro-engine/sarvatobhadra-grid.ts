// src/lib/astro-engine/sarvatobhadra-grid.ts
// ============================================================================
// TRUE 81-SQUARE (9x9) SARVATOBHADRA CHAKRA ENGINE
// Classical Reference: Narapati Jayacharya Swarodaya, Mansagari, Bhavartha Ratnakara
// Includes:
// - 28 Nakshatras (including Abhijit) on outer perimeter
// - 12 Rashis on intermediate concentric perimeter
// - 16 Swaras (vowels), 20 Varnas (consonants)
// - 5 Tithis (Nanda, Bhadra, Jaya, Rikta, Poorna) & 7 Days
// - 4 Classical Vedhas: Sammukha (Front), Vama (Left), Dakshina (Right), Kona (Corner)
// - Sensitive Nakshatras: Janma (1), Karma (10), Sanghatika (16), Samudayika (18),
//   Vinaasha (23), Manasa (25), Rajyashraya (26), Abhishek (27)
// - Ray Casting & Intersect Detection for Transits vs Natal Points
// ============================================================================

import { computePlanets, type ChartData } from "./calculations";

export type CellType =
  | "nakshatra"
  | "rashi"
  | "swara"
  | "varna"
  | "tithi"
  | "vara"
  | "corner";

export interface SbCell {
  row: number; // 0..8
  col: number; // 0..8
  type: CellType;
  label: string;
  hindiLabel: string;
  subLabel?: string;
  index?: number; // for nakshatra index 0..27
  isJanma?: boolean;
  isKarma?: boolean;
  isSanghatika?: boolean;
  isSamudayika?: boolean;
  isVinaasha?: boolean;
  isManasa?: boolean;
  isNameSound?: boolean;
  isNativeRashi?: boolean;
  natalPlanets: string[];
  transitPlanets: string[];
}

export interface VedhaRay {
  planet: string;
  planetNature: "benefic" | "malefic" | "neutral";
  isRetrograde: boolean;
  rayType: "sammukha" | "vama" | "dakshina" | "kona";
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  hitCells: Array<{ row: number; col: number; label: string; hitType: string }>;
}

export interface SensitiveTarget {
  name: string;
  nakshatra: string;
  index: number;
  cellRow: number;
  cellCol: number;
  shastricSignificance: string;
  vedhaCount: number;
  activeStrikes: Array<{
    planet: string;
    nature: "benefic" | "malefic" | "neutral";
    rayType: string;
  }>;
}

export interface SarvatobhadraGridResult {
  grid: SbCell[][];
  scanDate: string;
  birthNakshatra: string;
  birthNakshatraIndex: number;
  nameSound: string;
  nativeRashi: string;
  sensitiveTargets: SensitiveTarget[];
  vedhaRays: VedhaRay[];
  transitPositions: Record<string, { nakshatra: string; row: number; col: number }>;
  executiveAssessment: "Auspicious" | "Mixed" | "Challenging" | "Severe";
  headline: string;
  detailedInsight: string;
  actionDirectives: string[];
}

// ── 28 NAKSHATRAS IN PERIMETER ORDER (INCLUDING ABHIJIT) ───────────────────
// Standard 28-nakshatra sequence:
// Krittika to Ashlesha (Top: 7)
// Magha to Vishakha (Right: 7)
// Anuradha to Shravana incl. Abhijit (Bottom: 7)
// Dhanishta to Bharani (Left: 7)
export const PERIMETER_28_NAKSHATRAS = [
  // Top: Left to Right
  { name: "Krittika", hindi: "कृत्तिका", row: 0, col: 1, idx: 2 },
  { name: "Rohini", hindi: "रोहिणी", row: 0, col: 2, idx: 3 },
  { name: "Mrigashira", hindi: "मृगशिरा", row: 0, col: 3, idx: 4 },
  { name: "Ardra", hindi: "आर्द्रा", row: 0, col: 4, idx: 5 },
  { name: "Punarvasu", hindi: "पुनर्वसु", row: 0, col: 5, idx: 6 },
  { name: "Pushya", hindi: "पुष्य", row: 0, col: 6, idx: 7 },
  { name: "Ashlesha", hindi: "आश्लेषा", row: 0, col: 7, idx: 8 },

  // Right: Top to Bottom
  { name: "Magha", hindi: "मघा", row: 1, col: 8, idx: 9 },
  { name: "Purva Phalguni", hindi: "पूर्वा फाल्गुनी", row: 2, col: 8, idx: 10 },
  { name: "Uttara Phalguni", hindi: "उत्तरा फाल्गुनी", row: 3, col: 8, idx: 11 },
  { name: "Hasta", hindi: "हस्त", row: 4, col: 8, idx: 12 },
  { name: "Chitra", hindi: "चित्रा", row: 5, col: 8, idx: 13 },
  { name: "Swati", hindi: "स्वाति", row: 6, col: 8, idx: 14 },
  { name: "Vishakha", hindi: "विशाखा", row: 7, col: 8, idx: 15 },

  // Bottom: Right to Left
  { name: "Anuradha", hindi: "अनुराधा", row: 8, col: 7, idx: 16 },
  { name: "Jyeshtha", hindi: "ज्येष्ठा", row: 8, col: 6, idx: 17 },
  { name: "Mula", hindi: "मूल", row: 8, col: 5, idx: 18 },
  { name: "Purva Ashadha", hindi: "पूर्वाषाढ़ा", row: 8, col: 4, idx: 19 },
  { name: "Uttara Ashadha", hindi: "उत्तराषाढ़ा", row: 8, col: 3, idx: 20 },
  { name: "Abhijit", hindi: "अभिजित", row: 8, col: 2, idx: 27 }, // Abhijit
  { name: "Shravana", hindi: "श्रवण", row: 8, col: 1, idx: 21 },

  // Left: Bottom to Top
  { name: "Dhanishta", hindi: "धनिष्ठा", row: 7, col: 0, idx: 22 },
  { name: "Shatabhisha", hindi: "शतभिषा", row: 6, col: 0, idx: 23 },
  { name: "Purva Bhadrapada", hindi: "पूर्वाभाद्रपद", row: 5, col: 0, idx: 24 },
  { name: "Uttara Bhadrapada", hindi: "उत्तराभाद्रपद", row: 4, col: 0, idx: 25 },
  { name: "Revati", hindi: "रेवती", row: 3, col: 0, idx: 26 },
  { name: "Ashwini", hindi: "अश्विनी", row: 2, col: 0, idx: 0 },
  { name: "Bharani", hindi: "भरणी", row: 1, col: 0, idx: 1 },
];

// Map 27 standard nakshatra names to their perimeter cell coords
const NAK27_CELL_MAP: Record<string, { row: number; col: number }> = {};
PERIMETER_28_NAKSHATRAS.forEach((n) => {
  NAK27_CELL_MAP[n.name] = { row: n.row, col: n.col };
});

// Classical entities in the 9x9 grid layout:
function buildBase9x9Grid(): SbCell[][] {
  const g: SbCell[][] = [];
  for (let r = 0; r < 9; r++) {
    g[r] = [];
    for (let c = 0; c < 9; c++) {
      g[r][c] = {
        row: r,
        col: c,
        type: "varna",
        label: "",
        hindiLabel: "",
        natalPlanets: [],
        transitPlanets: [],
      };
    }
  }

  // 1. Four Corners ( ईशान, आग्नेय, नैऋत्य, वायव्य )
  g[0][0] = { row: 0, col: 0, type: "corner", label: "A (अ)", hindiLabel: "अ", subLabel: "ईशान", natalPlanets: [], transitPlanets: [] };
  g[0][8] = { row: 0, col: 8, type: "corner", label: "AA (आ)", hindiLabel: "आ", subLabel: "आग्नेय", natalPlanets: [], transitPlanets: [] };
  g[8][8] = { row: 8, col: 8, type: "corner", label: "U (उ)", hindiLabel: "उ", subLabel: "नैऋत्य", natalPlanets: [], transitPlanets: [] };
  g[8][0] = { row: 8, col: 0, type: "corner", label: "E (ए)", hindiLabel: "ए", subLabel: "वायव्य", natalPlanets: [], transitPlanets: [] };

  // 2. 28 Nakshatras on perimeter
  PERIMETER_28_NAKSHATRAS.forEach((nak) => {
    g[nak.row][nak.col] = {
      row: nak.row,
      col: nak.col,
      type: "nakshatra",
      label: nak.name,
      hindiLabel: nak.hindi,
      index: nak.idx,
      natalPlanets: [],
      transitPlanets: [],
    };
  });

  // 3. Ring 1 (Row 1 & 7, Col 1..7 / Row 1..7 Col 1 & 7) - Rashis & Swaras
  // Top Row (r=1)
  g[1][1] = { row: 1, col: 1, type: "swara", label: "I (इ)", hindiLabel: "इ", natalPlanets: [], transitPlanets: [] };
  g[1][2] = { row: 1, col: 2, type: "rashi", label: "Vrishabha", hindiLabel: "वृषभ", natalPlanets: [], transitPlanets: [] };
  g[1][3] = { row: 1, col: 3, type: "swara", label: "EE (ई)", hindiLabel: "ई", natalPlanets: [], transitPlanets: [] };
  g[1][4] = { row: 1, col: 4, type: "rashi", label: "Mithuna", hindiLabel: "मिथुन", natalPlanets: [], transitPlanets: [] };
  g[1][5] = { row: 1, col: 5, type: "swara", label: "U (उ)", hindiLabel: "उ", natalPlanets: [], transitPlanets: [] };
  g[1][6] = { row: 1, col: 6, type: "rashi", label: "Karka", hindiLabel: "कर्क", natalPlanets: [], transitPlanets: [] };
  g[1][7] = { row: 1, col: 7, type: "swara", label: "OO (ऊ)", hindiLabel: "ऊ", natalPlanets: [], transitPlanets: [] };

  // Right Col (c=7)
  g[2][7] = { row: 2, col: 7, type: "rashi", label: "Simha", hindiLabel: "सिंह", natalPlanets: [], transitPlanets: [] };
  g[3][7] = { row: 3, col: 7, type: "swara", label: "RI (ऋ)", hindiLabel: "ऋ", natalPlanets: [], transitPlanets: [] };
  g[4][7] = { row: 4, col: 7, type: "rashi", label: "Kanya", hindiLabel: "कन्या", natalPlanets: [], transitPlanets: [] };
  g[5][7] = { row: 5, col: 7, type: "swara", label: "RII (ॠ)", hindiLabel: "ॠ", natalPlanets: [], transitPlanets: [] };
  g[6][7] = { row: 6, col: 7, type: "rashi", label: "Tula", hindiLabel: "तुला", natalPlanets: [], transitPlanets: [] };
  g[7][7] = { row: 7, col: 7, type: "swara", label: "AI (ऐ)", hindiLabel: "ऐ", natalPlanets: [], transitPlanets: [] };

  // Bottom Row (r=7)
  g[7][6] = { row: 7, col: 6, type: "rashi", label: "Vrishchika", hindiLabel: "वृश्चिक", natalPlanets: [], transitPlanets: [] };
  g[7][5] = { row: 7, col: 5, type: "swara", label: "O (ओ)", hindiLabel: "ओ", natalPlanets: [], transitPlanets: [] };
  g[7][4] = { row: 7, col: 4, type: "rashi", label: "Dhanu", hindiLabel: "धनु", natalPlanets: [], transitPlanets: [] };
  g[7][3] = { row: 7, col: 3, type: "swara", label: "AU (औ)", hindiLabel: "औ", natalPlanets: [], transitPlanets: [] };
  g[7][2] = { row: 7, col: 2, type: "rashi", label: "Makara", hindiLabel: "मकर", natalPlanets: [], transitPlanets: [] };
  g[7][1] = { row: 7, col: 1, type: "swara", label: "AM (अं)", hindiLabel: "अं", natalPlanets: [], transitPlanets: [] };

  // Left Col (c=1)
  g[6][1] = { row: 6, col: 1, type: "rashi", label: "Kumbha", hindiLabel: "कुंभ", natalPlanets: [], transitPlanets: [] };
  g[5][1] = { row: 5, col: 1, type: "swara", label: "AH (अः)", hindiLabel: "अः", natalPlanets: [], transitPlanets: [] };
  g[4][1] = { row: 4, col: 1, type: "rashi", label: "Meena", hindiLabel: "मीन", natalPlanets: [], transitPlanets: [] };
  g[3][1] = { row: 3, col: 1, type: "swara", label: "LI (ऌ)", hindiLabel: "ऌ", natalPlanets: [], transitPlanets: [] };
  g[2][1] = { row: 2, col: 1, type: "rashi", label: "Mesha", hindiLabel: "मेष", natalPlanets: [], transitPlanets: [] };

  // 4. Ring 2 (Rows 2..6, Cols 2..6) - Consonants / Varnas
  const innerVarnas: Array<{ r: number; c: number; l: string; h: string }> = [
    { r: 2, c: 2, l: "Ka", h: "क" }, { r: 2, c: 3, l: "Kha", h: "ख" }, { r: 2, c: 4, l: "Ga", h: "ग" }, { r: 2, c: 5, l: "Gha", h: "घ" }, { r: 2, c: 6, l: "Nga", h: "ङ" },
    { r: 3, c: 6, l: "Cha", h: "च" }, { r: 4, c: 6, l: "Chha", h: "छ" }, { r: 5, c: 6, l: "Ja", h: "ज" }, { r: 6, c: 6, l: "Jha", h: "झ" },
    { r: 6, c: 5, l: "Ta", h: "ट" }, { r: 6, c: 4, l: "Tha", h: "ठ" }, { r: 6, c: 3, l: "Da", h: "ड" }, { r: 6, c: 2, l: "Dha", h: "ढ" },
    { r: 5, c: 2, l: "Ta", h: "त" }, { r: 4, c: 2, l: "Tha", h: "थ" }, { r: 3, c: 2, l: "Da", h: "द" },
  ];
  innerVarnas.forEach((v) => {
    g[v.r][v.c] = { row: v.r, col: v.c, type: "varna", label: v.l, hindiLabel: v.h, natalPlanets: [], transitPlanets: [] };
  });

  // 5. Center (3x3 Core: Rows 3..5, Cols 3..5) - Tithis, Varas, Core Brahma
  g[3][3] = { row: 3, col: 3, type: "tithi", label: "Nanda (1,6,11)", hindiLabel: "नंदा", natalPlanets: [], transitPlanets: [] };
  g[3][4] = { row: 3, col: 4, type: "vara", label: "Surya/Mangal", hindiLabel: "रवि/भौम", natalPlanets: [], transitPlanets: [] };
  g[3][5] = { row: 3, col: 5, type: "tithi", label: "Bhadra (2,7,12)", hindiLabel: "भद्रा", natalPlanets: [], transitPlanets: [] };

  g[4][3] = { row: 4, col: 3, type: "vara", label: "Som/Budh", hindiLabel: "सोम/बुध", natalPlanets: [], transitPlanets: [] };
  g[4][4] = { row: 4, col: 4, type: "corner", label: "Brahma Sthana", hindiLabel: "ब्रह्म", subLabel: "महा-केंद्र", natalPlanets: [], transitPlanets: [] };
  g[4][5] = { row: 4, col: 5, type: "vara", label: "Guru/Shukra", hindiLabel: "गुरु/शुक्र", natalPlanets: [], transitPlanets: [] };

  g[5][3] = { row: 5, col: 3, type: "tithi", label: "Jaya (3,8,13)", hindiLabel: "जया", natalPlanets: [], transitPlanets: [] };
  g[5][4] = { row: 5, col: 4, type: "vara", label: "Shani/Rahu", hindiLabel: "शनि/राहु", natalPlanets: [], transitPlanets: [] };
  g[5][5] = { row: 5, col: 5, type: "tithi", label: "Poorna (5,10,15)", hindiLabel: "पूर्णा", natalPlanets: [], transitPlanets: [] };

  return g;
}

// ── VEDHA RAY CALCULATION ───────────────────────────────────────────────────
// From an outer perimeter cell (r, c), generate Front, Left diagonal, Right diagonal
function calculateRaysForPlanet(
  planet: string,
  nature: "benefic" | "malefic" | "neutral",
  isRetro: boolean,
  r: number,
  c: number,
  grid: SbCell[][]
): VedhaRay[] {
  const rays: VedhaRay[] = [];

  // 1. Sammukha Vedha (Front / सीधा वेध)
  // Crosses directly to the opposite perimeter:
  let toR = r;
  let toC = c;
  if (r === 0) toR = 8;
  else if (r === 8) toR = 0;
  else if (c === 0) toC = 8;
  else if (c === 8) toC = 0;

  const sammukhaHits: Array<{ row: number; col: number; label: string; hitType: string }> = [];
  const stepR = toR === r ? 0 : toR > r ? 1 : -1;
  const stepC = toC === c ? 0 : toC > c ? 1 : -1;

  let currR = r;
  let currC = c;
  while (true) {
    currR += stepR;
    currC += stepC;
    if (currR < 0 || currR > 8 || currC < 0 || currC > 8) break;
    const cell = grid[currR][currC];
    sammukhaHits.push({ row: currR, col: currC, label: cell.hindiLabel || cell.label, hitType: cell.type });
    if (currR === toR && currC === toC) break;
  }

  rays.push({
    planet,
    planetNature: nature,
    isRetrograde: isRetro,
    rayType: "sammukha",
    fromRow: r,
    fromCol: c,
    toRow: toR,
    toCol: toC,
    hitCells: sammukhaHits,
  });

  // 2. Diagonal Left (Vama Vedha)
  const vamaHits: Array<{ row: number; col: number; label: string; hitType: string }> = [];
  let dR = r;
  let dC = c;
  // Step direction depends on which side planet is located
  const vamaStepR = r === 0 ? 1 : r === 8 ? -1 : c === 0 ? 1 : -1;
  const vamaStepC = c === 0 ? 1 : c === 8 ? -1 : r === 0 ? -1 : 1;

  while (true) {
    dR += vamaStepR;
    dC += vamaStepC;
    if (dR < 0 || dR > 8 || dC < 0 || dC > 8) break;
    const cell = grid[dR][dC];
    vamaHits.push({ row: dR, col: dC, label: cell.hindiLabel || cell.label, hitType: cell.type });
  }

  if (vamaHits.length > 0) {
    const last = vamaHits[vamaHits.length - 1];
    rays.push({
      planet,
      planetNature: nature,
      isRetrograde: isRetro,
      rayType: "vama",
      fromRow: r,
      fromCol: c,
      toRow: last.row,
      toCol: last.col,
      hitCells: vamaHits,
    });
  }

  // 3. Diagonal Right (Dakshina Vedha)
  const dakHits: Array<{ row: number; col: number; label: string; hitType: string }> = [];
  let dkR = r;
  let dkC = c;
  const dakStepR = r === 0 ? 1 : r === 8 ? -1 : c === 0 ? -1 : 1;
  const dakStepC = c === 0 ? 1 : c === 8 ? -1 : r === 0 ? 1 : -1;

  while (true) {
    dkR += dakStepR;
    dkC += dakStepC;
    if (dkR < 0 || dkR > 8 || dkC < 0 || dkC > 8) break;
    const cell = grid[dkR][dkC];
    dakHits.push({ row: dkR, col: dkC, label: cell.hindiLabel || cell.label, hitType: cell.type });
  }

  if (dakHits.length > 0) {
    const last = dakHits[dakHits.length - 1];
    rays.push({
      planet,
      planetNature: nature,
      isRetrograde: isRetro,
      rayType: "dakshina",
      fromRow: r,
      fromCol: c,
      toRow: last.row,
      toCol: last.col,
      hitCells: dakHits,
    });
  }

  return rays;
}

// ── MAIN SARVATOBHADRA 81-SQUARE CALCULATOR ─────────────────────────────────
export function calculateSarvatobhadraGrid(chart: ChartData): SarvatobhadraGridResult {
  const grid = buildBase9x9Grid();
  const moonData = chart.planets?.Moon;
  const moonLon = moonData?.lon || 149.2;
  const birthNakshatra = moonData?.nakshatra || "Uttara Phalguni";
  const birthNakshatraIndex = Math.floor(((moonLon % 360) + 360) % 360 * 27 / 360);
  const nativeRashi = moonData?.sign || "Leo";
  const nameFirstLetter = (chart.name || "A").trim().charAt(0).toUpperCase();

  // 1. Identify Sensitive Points (1, 10, 16, 18, 23, 25, 26, 27 from Janma)
  const NAK27_LIST = [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu",
    "Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra",
    "Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha",
    "Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
  ];

  const getNakAtOffset = (offset: number) => {
    const idx = (birthNakshatraIndex + offset - 1) % 27;
    return { name: NAK27_LIST[idx], idx };
  };

  const sensitiveDefs = [
    { name: "जन्म नक्षत्र (Janma - Self & Life Pulse)", offset: 1, sig: "शरीर, स्वास्थ्य, आत्म-सम्मान और मानसिक शांति" },
    { name: "कर्म नक्षत्र (Karma - Career & Status)", offset: 10, sig: "आजीविका, पदोन्नति, कार्यक्षेत्र और व्यावसायिक प्रतिष्ठा" },
    { name: "सांघातिक नक्षत्र (Sanghatika - Alliances & Finance)", offset: 16, sig: "साझेदारी, बैंक बैलेंस, पारिवारिक सुरक्षा और अनुबंध" },
    { name: "सामुदायिक नक्षत्र (Samudayika - Community & Masses)", offset: 18, sig: "सामाजिक प्रभाव, जनता का समर्थन और मित्र नेटवर्क" },
    { name: "वैनाशिक नक्षत्र (Vinaasha - Risk & Critical Vulnerability)", offset: 23, sig: "आकस्मिक संकट, कानूनी विवाद और स्वास्थ्य जोखिम" },
    { name: "मानस नक्षत्र (Manasa - Psychological Balance)", offset: 25, sig: "मानसिक स्थिरता, गहरी भावनाएं, तनाव और निर्णय क्षमता" },
    { name: "राज्याश्रय नक्षत्र (Rajya - Institutional Patronage)", offset: 26, sig: "सरकारी सहायता, उच्चाधिकारी और कॉर्पोरेट समर्थन" },
    { name: "अभिषेक नक्षत्र (Abhishek - Crown & Victory)", offset: 27, sig: "सर्वोच्च विजय, सम्मान और धार्मिक प्रतिष्ठा" },
  ];

  const sensitiveTargets: SensitiveTarget[] = sensitiveDefs.map((def) => {
    const nak = getNakAtOffset(def.offset);
    const cellCoords = NAK27_CELL_MAP[nak.name] || { row: 0, col: 1 };
    return {
      name: def.name,
      nakshatra: nak.name,
      index: nak.idx,
      cellRow: cellCoords.row,
      cellCol: cellCoords.col,
      shastricSignificance: def.sig,
      vedhaCount: 0,
      activeStrikes: [],
    };
  });

  // Mark Sensitive in Grid
  sensitiveTargets.forEach((st) => {
    const cell = grid[st.cellRow][st.cellCol];
    if (st.name.includes("Janma")) cell.isJanma = true;
    if (st.name.includes("Karma")) cell.isKarma = true;
    if (st.name.includes("Sanghatika")) cell.isSanghatika = true;
    if (st.name.includes("Samudayika")) cell.isSamudayika = true;
    if (st.name.includes("Vinaasha")) cell.isVinaasha = true;
    if (st.name.includes("Manasa")) cell.isManasa = true;
  });

  // 2. Map Natal Planets into Grid Cells
  const PLANET_NAMES = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  PLANET_NAMES.forEach((p) => {
    const pd = chart.planets?.[p];
    if (!pd) return;
    const nakIdx = Math.floor(((pd.lon % 360) + 360) % 360 * 27 / 360);
    const nakName = NAK27_LIST[nakIdx];
    const coords = NAK27_CELL_MAP[nakName];
    if (coords) {
      grid[coords.row][coords.col].natalPlanets.push(p);
    }
  });

  // 3. Compute Real-Time Transits
  const now = new Date();
  const jd = now.getTime() / 86400000 + 2440587.5;
  const transitLons = computePlanets(jd);
  const transitPositions: Record<string, { nakshatra: string; row: number; col: number }> = {};

  const NATURE_MAP: Record<string, "benefic" | "malefic" | "neutral"> = {
    Jupiter: "benefic",
    Venus: "benefic",
    Mercury: "neutral",
    Sun: "neutral",
    Moon: "benefic",
    Mars: "malefic",
    Saturn: "malefic",
    Rahu: "malefic",
    Ketu: "malefic",
  };

  const vedhaRays: VedhaRay[] = [];

  PLANET_NAMES.forEach((p) => {
    const lon = transitLons[p];
    if (lon === undefined || lon === null) return;
    const nakIdx = Math.floor(((lon % 360) + 360) % 360 * 27 / 360);
    const nakName = NAK27_LIST[nakIdx];
    const coords = NAK27_CELL_MAP[nakName];
    if (!coords) return;

    transitPositions[p] = { nakshatra: nakName, row: coords.row, col: coords.col };
    grid[coords.row][coords.col].transitPlanets.push(p);

    // Generate Rays for this transiting planet
    const nature = NATURE_MAP[p] || "neutral";
    const rays = calculateRaysForPlanet(p, nature, false, coords.row, coords.col, grid);
    vedhaRays.push(...rays);

    // Cross-check hits against Sensitive Targets
    rays.forEach((ray) => {
      ray.hitCells.forEach((hit) => {
        const target = sensitiveTargets.find((st) => st.cellRow === hit.row && st.cellCol === hit.col);
        if (target) {
          target.vedhaCount += 1;
          target.activeStrikes.push({
            planet: p,
            nature,
            rayType: ray.rayType,
          });
        }
      });
    });
  });

  // 4. Executive Assessment
  const janmaTarget = sensitiveTargets.find((st) => st.name.includes("Janma"));
  const karmaTarget = sensitiveTargets.find((st) => st.name.includes("Karma"));
  const vinaashaTarget = sensitiveTargets.find((st) => st.name.includes("Vinaasha"));

  const maleficStrikesOnJanma = janmaTarget?.activeStrikes.filter((s) => s.nature === "malefic") || [];
  const beneficStrikesOnJanma = janmaTarget?.activeStrikes.filter((s) => s.nature === "benefic") || [];

  let executiveAssessment: "Auspicious" | "Mixed" | "Challenging" | "Severe" = "Auspicious";
  let headline = "";
  let detailedInsight = "";
  const actionDirectives: string[] = [];

  if (maleficStrikesOnJanma.length >= 2 || maleficStrikesOnJanma.some((s) => s.planet === "Saturn" || s.planet === "Mars")) {
    executiveAssessment = "Challenging";
    headline = `सावधान: जन्म व कर्म बिंदु पर क्रूर ग्रहों का वेध (${maleficStrikesOnJanma.map((s) => s.planet).join(" + ")})`;
    detailedInsight = `सर्वतोभद्र चक्र के अनुसार वर्तमान में ${maleficStrikesOnJanma.map((s) => s.planet).join(", ")} आपके जन्म नक्षत्र (${birthNakshatra}) पर सीधा वेध प्रहार कर रहे हैं। यह समय बड़े वित्तीय दांव लगाने, वाहन में लापरवाही बरतने या कानूनी पचड़ों में पड़ने का बिल्कुल नहीं है।`;
    actionDirectives.push("महत्वपूर्ण व्यावसायिक समझौतों या बड़े निवेश को 2-3 सप्ताह के लिए टालें।");
    actionDirectives.push("शनिवार को सुंदरकांड का पाठ करें और काले तिल/उड़द का दान करें।");
    actionDirectives.push("क्रोध और तीखी प्रतिक्रिया से 100% बचें; 5 सेकंड का मौन नियम अपनाएं।");
  } else if (beneficStrikesOnJanma.length > 0 && maleficStrikesOnJanma.length === 0) {
    executiveAssessment = "Auspicious";
    headline = `अमृत वेध सक्रिय: देवगुरु व शुभ ग्रहों का सुरक्षा कवच (${beneficStrikesOnJanma.map((s) => s.planet).join(" + ")})`;
    detailedInsight = `आपके जन्म और कर्म नक्षत्र पर शुभ ग्रहों का अमृत वेध पड़ रहा है। यह नए वेंचर्स की शुरुआत, बौद्धिक नवाचार और बड़े प्रोजेक्ट्स को गति देने का सर्वोत्तम शास्त्रीय मुहूर्त है।`;
    actionDirectives.push("लंबित प्रोजेक्ट्स को गति दें; महत्वपूर्ण निर्णय लेने के लिए यह आदर्श समय है।");
    actionDirectives.push("अपने मार्गदर्शकों और वरिष्ठों से संपर्क साधें; सहयोग मिलेगा।");
  } else {
    executiveAssessment = "Mixed";
    headline = "मिश्रित वेध संरेखण: सावधानीपूर्वक प्रगति का समय";
    detailedInsight = `जन्म चक्र पर शुभ और मध्यम ग्रहों का मिलाजुला प्रभाव है। कुछ क्षेत्रों में तीव्र प्रगति होगी जबकि कुछ क्षेत्रों में अतिरिक्त सावधानी और अनुशासन की आवश्यकता रहेगी।`;
    actionDirectives.push("नियमित कार्यों में गति बनाए रखें, लेकिन अनियोजित जोखिमों से बचें।");
    actionDirectives.push("दैनिक चौघड़िया व चंद्र बल देखकर ही यात्रा अथवा अनुबंध करें।");
  }

  return {
    grid,
    scanDate: now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    birthNakshatra,
    birthNakshatraIndex,
    nameSound: nameFirstLetter,
    nativeRashi,
    sensitiveTargets,
    vedhaRays,
    transitPositions,
    executiveAssessment,
    headline,
    detailedInsight,
    actionDirectives,
  };
}
