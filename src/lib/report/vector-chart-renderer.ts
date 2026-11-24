/**
 * ============================================================================
 * ASTROLIFE — NATIVE PDFKIT VECTOR KUNDLI & CHART RENDERER
 * ============================================================================
 * Renders pure 2400+ DPI vector Vedic charts directly into PDFKit documents.
 * Zero external images, zero rasterization, sub-millisecond execution.
 * ============================================================================
 */

import type PDFDocument from "pdfkit";
import type { ChartData } from "@/lib/astro-engine/calculations";

type PDFDoc = InstanceType<typeof PDFDocument>;

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_SHORT: Record<string, number> = {
  "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
  "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
  "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12,
  "Mesha": 1, "Vrishabha": 2, "Mithuna": 3, "Karka": 4,
  "Simha": 5, "Kanya": 6, "Tula": 7, "Vrishchika": 8,
  "Dhanu": 9, "Makara": 10, "Kumbha": 11, "Meena": 12
};

const PLANET_ABBR: Record<string, string> = {
  "Sun": "Su",
  "Moon": "Mo",
  "Mars": "Ma",
  "Mercury": "Me",
  "Jupiter": "Ju",
  "Venus": "Ve",
  "Saturn": "Sa",
  "Rahu": "Ra",
  "Ketu": "Ke",
  "Ascendant": "As",
  "Lagna": "As"
};

export interface VectorChartOptions {
  title?: string;
  borderColor?: string;
  innerLineColor?: string;
  fillColor?: string;
  signColor?: string;
  planetColor?: string;
  accentPlanetColor?: string;
}

/**
 * Draws a pixel-perfect North Indian (Diamond) Kundli chart directly on the PDFKit canvas.
 */
export function renderVectorNorthIndianKundli(
  doc: PDFDoc,
  x: number,
  y: number,
  size: number,
  chart: ChartData,
  options: VectorChartOptions = {}
): void {
  const borderColor = options.borderColor || "#B8860B";
  const innerLineColor = options.innerLineColor || "#C9A961";
  const fillColor = options.fillColor || "#FAF8F5";
  const signColor = options.signColor || "#8C6508";
  const planetColor = options.planetColor || "#1A1A1A";
  const title = options.title || "D1 NATAL LAGNA KUNDLI";

  const s = size;
  const s2 = s / 2;
  const s4 = s / 4;
  const s8 = s / 8;

  // 1. Chart Background & Outer Frame
  doc.rect(x, y, s, s).fillAndStroke(fillColor, borderColor);
  doc.rect(x - 2, y - 2, s + 4, s + 4).lineWidth(0.6).strokeColor(borderColor).stroke();

  // 2. Diagonals (Corner to Corner)
  doc.lineWidth(0.8).strokeColor(innerLineColor);
  doc.moveTo(x, y).lineTo(x + s, y + s).stroke();
  doc.moveTo(x + s, y).lineTo(x, y + s).stroke();

  // 3. Central Diamond (Connecting outer edge midpoints)
  doc.lineWidth(1).strokeColor(borderColor);
  doc.moveTo(x + s2, y)
    .lineTo(x + s, y + s2)
    .lineTo(x + s2, y + s)
    .lineTo(x, y + s2)
    .closePath()
    .stroke();

  // Determine Lagna sign index (1-12)
  let lagnaSignNum = 1;
  if (chart.lagnaRashi && SIGN_SHORT[chart.lagnaRashi]) {
    lagnaSignNum = SIGN_SHORT[chart.lagnaRashi];
  } else if (typeof chart.lagnaNum === "number") {
    lagnaSignNum = ((chart.lagnaNum) % 12) + 1;
  }

  // House centers & sign placement coordinates
  // Each house has: [centerX, centerY, signX, signY]
  const houseCoords: Record<number, [number, number, number, number]> = {
    1:  [x + s2,      y + s4 - 4,     x + s2,      y + s8 - 2],
    2:  [x + s4 + 6,  y + s8 + 6,     x + s4 - 10, y + s8 - 2],
    3:  [x + s8 + 6,  y + s4 + 6,     x + s8 - 2,  y + s4 - 8],
    4:  [x + s4,      y + s2,         x + s8,      y + s2 - 8],
    5:  [x + s8 + 6,  y + 3 * s4 - 6, x + s8 - 2,  y + 3 * s4 + 8],
    6:  [x + s4 + 6,  y + 7 * s8 - 6, x + s4 - 10, y + 7 * s8 + 6],
    7:  [x + s2,      y + 3 * s4 + 4, x + s2,      y + 7 * s8 + 6],
    8:  [x + 3 * s4 - 6, y + 7 * s8 - 6, x + 3 * s4 + 10, y + 7 * s8 + 6],
    9:  [x + 7 * s8 - 6, y + 3 * s4 - 6, x + 7 * s8 + 2,  y + 3 * s4 + 8],
    10: [x + 3 * s4,     y + s2,         x + 7 * s8,      y + s2 - 8],
    11: [x + 7 * s8 - 6, y + s4 + 6,     x + 7 * s8 + 2,  y + s4 - 8],
    12: [x + 3 * s4 - 6, y + s8 + 6,     x + 3 * s4 + 10, y + s8 - 2],
  };

  // Map planets to houses
  const housePlanets: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  const rawPlanets = chart.planets || {};
  const planetEntries = Array.isArray(rawPlanets)
    ? (rawPlanets as any[]).map((p) => ({ name: p.name || p.planet, sign: p.sign, house: p.house, retro: p.retrograde || p.isRetrograde }))
    : Object.entries(rawPlanets).map(([name, d]) => ({
        name,
        sign: (d as any)?.sign || (d as any)?.rashi,
        house: (d as any)?.house,
        retro: (d as any)?.retrograde || (d as any)?.isRetrograde
      }));

  for (const p of planetEntries) {
    if (!p.name) continue;
    let targetHouse = 1;
    if (typeof p.house === "number" && p.house >= 1 && p.house <= 12) {
      targetHouse = p.house;
    } else if (p.sign && SIGN_SHORT[p.sign]) {
      const pSignNum = SIGN_SHORT[p.sign];
      targetHouse = ((pSignNum - lagnaSignNum + 12) % 12) + 1;
    }
    const abbr = PLANET_ABBR[p.name] || p.name.slice(0, 2);
    const label = p.retro ? `${abbr}ᴿ` : abbr;
    housePlanets[targetHouse].push(label);
  }

  // Draw house signs & planets
  for (let h = 1; h <= 12; h++) {
    const coords = houseCoords[h];
    if (!coords) continue;
    const [cx, cy, sx, sy] = coords;

    // Sign Number in house
    const houseSignNum = ((lagnaSignNum - 1 + (h - 1)) % 12) + 1;
    doc.fontSize(7).fillColor(signColor);
    doc.text(String(houseSignNum), sx - 6, sy - 4, { width: 12, align: "center" });

    // Planets inside house
    const planetsInH = housePlanets[h];
    if (planetsInH.length > 0) {
      doc.fontSize(8).fillColor(planetColor);
      const text = planetsInH.join(" ");
      doc.text(text, cx - 28, cy - 5, { width: 56, align: "center", lineBreak: false });
    }
  }

  // Chart Title Tag below
  doc.fontSize(8).fillColor(signColor);
  doc.text(title, x, y + s + 6, { width: s, align: "center", characterSpacing: 1 });
}
