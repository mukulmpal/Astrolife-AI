"use client";

import { useState } from "react";

const PLS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
// Short text labels — render in any font, no missing-glyph boxes in PDFs
// or on devices without astrological symbol fonts.
const PABBR = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
const PCOL = ["#f97316", "#c084fc", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#60a5fa", "#a78bfa", "#fb7185"];

const md = (x: number, m: number) => ((x % m) + m) % m;

export interface PlanetData {
  house: number;
  signNum?: number;
  rashi?: number;
  rashiIndex?: number;
  signIndex?: number;
  retrograde: boolean;
  degree?: number;
  minutes?: number;
  nakshatra?: string;
  pada?: number;
  dignity?: string;
  sign?: string;
  lon?: number;
}

interface Props {
  lagnaNum: number;
  planets: Record<string, PlanetData>;
  size?: number;
  interactive?: boolean;
}

const HOUSE_NAMES: Record<number, { name: string; sa: string; karaka: string }> = {
  1: { name: "1st House", sa: "तनु भाव (Lagna / Self)", karaka: "Vitality, Personality & Core Self" },
  2: { name: "2nd House", sa: "धन भाव (Dhana / Wealth)", karaka: "Wealth, Family, Speech & Assets" },
  3: { name: "3rd House", sa: "सहज भाव (Sahaja / Courage)", karaka: "Courage, Siblings, Skills & Initiatives" },
  4: { name: "4th House", sa: "सुख भाव (Sukha / Home)", karaka: "Mother, Vehicles, Mind & Inner Peace" },
  5: { name: "5th House", sa: "पुत्र भाव (Putra / Intellect)", karaka: "Intelligence, Purva Punya & Creativity" },
  6: { name: "6th House", sa: "शत्रु भाव (Ari / Health)", karaka: "Health, Debts, Service & Obstacles" },
  7: { name: "7th House", sa: "कलत्र भाव (Kalatra / Union)", karaka: "Spouse, Marriage & Partnerships" },
  8: { name: "8th House", sa: "आयु भाव (Ayu / Randhra)", karaka: "Longevity, Transformation & Secrets" },
  9: { name: "9th House", sa: "भाग्य भाव (Bhagya / Dharma)", karaka: "Fortune, Higher Wisdom & Guru" },
  10: { name: "10th House", sa: "कर्म भाव (Karma / Status)", karaka: "Career, Authority, Action & Fame" },
  11: { name: "11th House", sa: "लाभ भाव (Labha / Gains)", karaka: "Gains, Aspirations, Income & Network" },
  12: { name: "12th House", sa: "व्यय भाव (Vyaya / Moksha)", karaka: "Expenditure, Foreign, Sleep & Liberation" },
};

const RASHI_DATA = [
  { en: "Aries", sa: "मेष", lord: "Mars" },
  { en: "Taurus", sa: "वृषभ", lord: "Venus" },
  { en: "Gemini", sa: "मिथुन", lord: "Mercury" },
  { en: "Cancer", sa: "कर्क", lord: "Moon" },
  { en: "Leo", sa: "सिंह", lord: "Sun" },
  { en: "Virgo", sa: "कन्या", lord: "Mercury" },
  { en: "Libra", sa: "तुला", lord: "Venus" },
  { en: "Scorpio", sa: "वृश्चिक", lord: "Mars" },
  { en: "Sagittarius", sa: "धनु", lord: "Jupiter" },
  { en: "Capricorn", sa: "मकर", lord: "Saturn" },
  { en: "Aquarius", sa: "कुम्भ", lord: "Saturn" },
  { en: "Pisces", sa: "मीन", lord: "Jupiter" },
];

function planetSlots(total: number) {
  if (total <= 1) return [{ x: 0, y: 0, font: 11 }];
  if (total === 2) return [{ x: -14, y: 0, font: 10.5 }, { x: 14, y: 0, font: 10.5 }];
  if (total === 3) return [{ x: -20, y: 0, font: 10 }, { x: 0, y: 0, font: 10 }, { x: 20, y: 0, font: 10 }];
  if (total === 4) {
    return [
      { x: -14, y: -7, font: 9.5 },
      { x: 14, y: -7, font: 9.5 },
      { x: -14, y: 8, font: 9.5 },
      { x: 14, y: 8, font: 9.5 },
    ];
  }
  if (total === 5) {
    return [
      { x: -13, y: -8, font: 9 },
      { x: 13, y: -8, font: 9 },
      { x: -21, y: 8, font: 9 },
      { x: 0, y: 8, font: 9 },
      { x: 21, y: 8, font: 9 },
    ];
  }

  return Array.from({ length: total }, (_, idx) => {
    const cols = 3;
    const rows = Math.ceil(total / cols);
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const rowCount = row === rows - 1 ? total - row * cols : cols;
    const x = (col - (rowCount - 1) / 2) * 19;
    const y = (row - (rows - 1) / 2) * 13;
    return { x, y, font: total > 7 ? 8 : 8.5 };
  });
}

export default function NorthIndianChart({ lagnaNum, planets, size = 310, interactive = true }: Props) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const S = size;
  const h = S / 2;

  const HOUSES = [
    { h: 1, lx: S / 2, ly: S / 4 },
    { h: 2, lx: S / 4, ly: S / 8 },
    { h: 3, lx: S / 8, ly: S / 4 },
    { h: 4, lx: S / 4, ly: S / 2 },
    { h: 5, lx: S / 8, ly: 3 * S / 4 },
    { h: 6, lx: S / 4, ly: 7 * S / 8 },
    { h: 7, lx: S / 2, ly: 3 * S / 4 },
    { h: 8, lx: 3 * S / 4, ly: 7 * S / 8 },
    { h: 9, lx: 7 * S / 8, ly: 3 * S / 4 },
    { h: 10, lx: 3 * S / 4, ly: S / 2 },
    { h: 11, lx: 7 * S / 8, ly: S / 4 },
    { h: 12, lx: 3 * S / 4, ly: S / 8 },
  ];

  // Precise geometric boundary polygons for all 12 houses in North Indian diamond chart
  const HOUSE_POLYGONS: Record<number, string> = {
    1: `${h},0 ${S / 4},${S / 4} ${h},${h} ${(3 * S) / 4},${S / 4}`,
    2: `0,0 ${h},0 ${S / 4},${S / 4}`,
    3: `0,0 ${S / 4},${S / 4} 0,${h}`,
    4: `0,${h} ${S / 4},${S / 4} ${h},${h} ${S / 4},${(3 * S) / 4}`,
    5: `0,${h} ${S / 4},${(3 * S) / 4} 0,${S}`,
    6: `0,${S} ${S / 4},${(3 * S) / 4} ${h},${S}`,
    7: `${h},${S} ${S / 4},${(3 * S) / 4} ${h},${h} ${(3 * S) / 4},${(3 * S) / 4}`,
    8: `${h},${S} ${(3 * S) / 4},${(3 * S) / 4} ${S},${S}`,
    9: `${S},${S} ${(3 * S) / 4},${(3 * S) / 4} ${S},${h}`,
    10: `${S},${h} ${(3 * S) / 4},${(3 * S) / 4} ${h},${h} ${(3 * S) / 4},${S / 4}`,
    11: `${S},${h} ${(3 * S) / 4},${S / 4} ${S},0`,
    12: `${S},0 ${(3 * S) / 4},${S / 4} ${h},0`,
  };

  interface HousePlanetItem {
    name: string;
    retro: boolean;
    degree?: number;
    minutes?: number;
    nakshatra?: string;
    pada?: number;
    dignity?: string;
    sign?: string;
  }

  const pByH: Record<number, HousePlanetItem[]> = {};
  for (let i = 1; i <= 12; i++) pByH[i] = [];

  PLS.forEach((p) => {
    const pd = planets[p];
    if (!pd) return;
    const rashi =
      typeof pd.signNum === "number"
        ? pd.signNum
        : typeof pd.rashi === "number"
          ? pd.rashi
          : typeof pd.rashiIndex === "number"
            ? pd.rashiIndex
            : typeof pd.signIndex === "number"
              ? pd.signIndex
              : null;
    const house = rashi !== null ? md(rashi - lagnaNum, 12) + 1 : pd.house;
    if (house >= 1 && house <= 12) {
      pByH[house].push({
        name: p,
        retro: pd.retrograde,
        degree: pd.degree,
        minutes: pd.minutes,
        nakshatra: pd.nakshatra,
        pada: pd.pada,
        dignity: pd.dignity,
        sign: pd.sign,
      });
    }
  });

  const ls = { stroke: "#2a2250", strokeWidth: "1" };

  const handleHouseClick = (hNum: number) => {
    if (!interactive) return;
    setSelectedHouse((prev) => (prev === hNum ? null : hNum));
  };

  const selectedRashiIdx = selectedHouse ? md(lagnaNum + (selectedHouse - 1), 12) : null;
  const selectedRashi = selectedRashiIdx !== null ? RASHI_DATA[selectedRashiIdx] : null;
  const selectedHouseMeta = selectedHouse ? HOUSE_NAMES[selectedHouse] : null;
  const selectedOccupants = selectedHouse ? pByH[selectedHouse] || [] : [];

  return (
    <div style={{ width: "100%", maxWidth: S, margin: "0 auto" }}>
      <svg
        viewBox={`0 0 ${S} ${S}`}
        width="100%"
        style={{ maxWidth: S, display: "block", margin: "0 auto" }}
        role="img"
        aria-label="North Indian birth chart"
      >
        <rect width={S} height={S} fill="#FAF7F2" rx="8" />

        {/* Interactive clickable polygons for each house */}
        {HOUSES.map(({ h: hNum }) => {
          const isSelected = selectedHouse === hNum;
          const polyPoints = HOUSE_POLYGONS[hNum];
          const rashiIdx = md(lagnaNum + (hNum - 1), 12);
          const rashi = RASHI_DATA[rashiIdx];
          const occupants = pByH[hNum] || [];
          const occText = occupants.length
            ? occupants.map((o) => `${o.name} (${o.degree ?? 0}°${o.minutes ?? 0}' ${o.nakshatra ?? ""})`).join(", ")
            : "Empty house";

          return (
            <polygon
              key={`poly-${hNum}`}
              points={polyPoints}
              fill={isSelected ? "rgba(184, 134, 11, 0.22)" : "transparent"}
              stroke={isSelected ? "#B8860B" : "transparent"}
              strokeWidth={isSelected ? "1.5" : "0"}
              style={{ cursor: interactive ? "pointer" : "default", transition: "fill 0.2s" }}
              onClick={() => handleHouseClick(hNum)}
            >
              <title>{`House ${hNum}: ${rashi.en} (${rashi.sa}) · ${occText}`}</title>
            </polygon>
          );
        })}

        <rect x={0} y={0} width={S} height={S} fill="none" stroke="#3a3260" strokeWidth="1.5" rx="8" pointerEvents="none" />

        <line x1={0} y1={0} x2={S} y2={S} {...ls} pointerEvents="none" />
        <line x1={S} y1={0} x2={0} y2={S} {...ls} pointerEvents="none" />

        <line x1={h} y1={0} x2={S} y2={h} {...ls} pointerEvents="none" />
        <line x1={S} y1={h} x2={h} y2={S} {...ls} pointerEvents="none" />
        <line x1={h} y1={S} x2={0} y2={h} {...ls} pointerEvents="none" />
        <line x1={0} y1={h} x2={h} y2={0} {...ls} pointerEvents="none" />

        {HOUSES.map(({ h: hNum, lx, ly }) => {
          const rashiIdx = md(lagnaNum + (hNum - 1), 12);
          const isLagna = hNum === 1;
          const isSelected = selectedHouse === hNum;
          const here = pByH[hNum] || [];
          const total = here.length;

          return (
            <g
              key={hNum}
              style={{ cursor: interactive ? "pointer" : "default" }}
              onClick={() => handleHouseClick(hNum)}
            >
              <text
                x={lx}
                y={ly - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill={isSelected ? "#B8860B" : isLagna ? "#d4af37" : "#4a4070"}
                fontFamily="serif"
                fontWeight={isSelected || isLagna ? "700" : "400"}
              >
                {rashiIdx + 1}
              </text>

              {isLagna && (
                <text
                  x={lx}
                  y={ly + 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="6.5"
                  fill="#d4af37"
                  fontFamily="sans-serif"
                  fontWeight="700"
                >
                  Lagna
                </text>
              )}

              {here.map((p, idx) => {
                const piIdx = PLS.indexOf(p.name);
                if (piIdx < 0) return null;
                const slot = planetSlots(total)[idx] ?? { x: 0, y: 0, font: 9 };
                const py = ly + (isLagna ? 20 : 15) + slot.y;

                return (
                  <g key={p.name}>
                    <text
                      x={lx + slot.x}
                      y={py}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={slot.font}
                      fontWeight="600"
                      fontFamily="sans-serif"
                      fill={PCOL[piIdx]}
                    >
                      {PABBR[piIdx]}
                    </text>
                    {p.retro && (
                      <text
                        x={lx + slot.x + 8}
                        y={py - 5}
                        textAnchor="middle"
                        fontSize="5.8"
                        fill="#f97316"
                        fontWeight="700"
                        fontFamily="sans-serif"
                      >
                        (R)
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Interactive House Inspector Drawer */}
      {interactive && (
        <div style={{ marginTop: 10 }}>
          {selectedHouse && selectedHouseMeta && selectedRashi ? (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(184, 134, 11, 0.08)",
                border: "1px solid rgba(184, 134, 11, 0.35)",
                borderRadius: 10,
                fontSize: 12,
                color: "#1A1A1A",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <strong style={{ color: "#B8860B" }}>
                    ✦ {selectedHouseMeta.name}: {selectedHouseMeta.sa}
                  </strong>
                  <span style={{ color: "#6B635B", marginLeft: 8 }}>
                    ({selectedRashi.en} / {selectedRashi.sa} · Lord: {selectedRashi.lord})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHouse(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#6B635B",
                    padding: "0 4px",
                  }}
                  title="Close inspector"
                >
                  ✕
                </button>
              </div>

              {selectedOccupants.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {selectedOccupants.map((occ) => {
                    const piIdx = PLS.indexOf(occ.name);
                    const color = piIdx >= 0 ? PCOL[piIdx] : "#B8860B";
                    const degText =
                      occ.degree !== undefined && occ.minutes !== undefined
                        ? `${occ.degree}° ${occ.minutes}'`
                        : "";
                    return (
                      <span
                        key={occ.name}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "#FFFFFF",
                          border: "1px solid rgba(184, 134, 11, 0.2)",
                          fontSize: 11.5,
                        }}
                      >
                        <span style={{ color, fontWeight: 700 }}>{occ.name}</span>
                        {occ.retro && <span style={{ color: "#D97706", fontWeight: 700 }}>(R)</span>}
                        {degText && <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{degText}</span>}
                        {occ.nakshatra && (
                          <span style={{ color: "#6B635B" }}>
                            ({occ.nakshatra} P{occ.pada ?? 1})
                          </span>
                        )}
                        {occ.dignity && (
                          <span style={{ color: "#B8860B", fontSize: 10, fontWeight: 600 }}>[{occ.dignity}]</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: "#6B635B", fontSize: 11.5 }}>
                  Empty house (no planets placed). Governed by sign lord {selectedRashi.lord}.
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "#8C8278",
                padding: "4px 8px",
              }}
            >
              💡 Click any house on the chart to inspect its planets, exact degrees &amp; nakshatras
            </div>
          )}
        </div>
      )}
    </div>
  );
}

