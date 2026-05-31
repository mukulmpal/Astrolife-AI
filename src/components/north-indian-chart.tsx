"use client";

const PLS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
// Short text labels — render in any font, no missing-glyph boxes in PDFs
// or on devices without astrological symbol fonts.
const PABBR = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
const PCOL = ["#f97316", "#c084fc", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#60a5fa", "#a78bfa", "#fb7185"];

const md = (x: number, m: number) => ((x % m) + m) % m;

interface PlanetData {
  house: number;
  signNum?: number;
  rashi?: number;
  rashiIndex?: number;
  signIndex?: number;
  retrograde: boolean;
}

interface Props {
  lagnaNum: number;
  planets: Record<string, PlanetData>;
  size?: number;
}

export default function NorthIndianChart({ lagnaNum, planets, size = 310 }: Props) {
  const S = size;

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

  const pByH: Record<number, { name: string; retro: boolean }[]> = {};
  for (let h = 1; h <= 12; h++) pByH[h] = [];

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
      pByH[house].push({ name: p, retro: pd.retrograde });
    }
  });

  const h = S / 2;
  const ls = { stroke: "#2a2250", strokeWidth: "1" };

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      width="100%"
      style={{ maxWidth: S, display: "block", margin: "0 auto" }}
      role="img"
      aria-label="North Indian birth chart"
    >
      <rect width={S} height={S} fill="#08051a" rx="8" />
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="#3a3260" strokeWidth="1.5" rx="8" />

      <line x1={0} y1={0} x2={S} y2={S} {...ls} />
      <line x1={S} y1={0} x2={0} y2={S} {...ls} />

      <line x1={h} y1={0} x2={S} y2={h} {...ls} />
      <line x1={S} y1={h} x2={h} y2={S} {...ls} />
      <line x1={h} y1={S} x2={0} y2={h} {...ls} />
      <line x1={0} y1={h} x2={h} y2={0} {...ls} />

      {HOUSES.map(({ h: hNum, lx, ly }) => {
        const rashiIdx = md(lagnaNum + (hNum - 1), 12);
        const isLagna = hNum === 1;
        const here = pByH[hNum] || [];
        const total = here.length;

        return (
          <g key={hNum}>
            <text
              x={lx}
              y={ly - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={isLagna ? "#d4af37" : "#4a4070"}
              fontFamily="serif"
              fontWeight={isLagna ? "700" : "400"}
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

              // Smart positioning for overlapping planets
              let ox = 0;
              let oy = 0;
              let fontSize = 11;

              if (total > 1) {
                // Horizontal offset increases with more planets
                const horizontalSpacing = total > 4 ? 16 : total > 2 ? 14 : 13;
                ox = (idx - (total - 1) / 2) * horizontalSpacing;

                // Vertical offset for houses with many planets (5+)
                if (total > 4) {
                  const rowIdx = Math.floor(idx / 3); // 3 planets per row
                  oy = rowIdx * 13;
                  fontSize = 10; // Reduce font size slightly
                }
              }

              const py = ly + (isLagna ? 18 : 14) + oy;

              return (
                <g key={p.name}>
                  <text
                    x={lx + ox}
                    y={py}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fontWeight="600"
                    fontFamily="sans-serif"
                    fill={PCOL[piIdx]}
                  >
                    {PABBR[piIdx]}
                  </text>
                  {p.retro && (
                    <text
                      x={lx + ox + 9}
                      y={py - 5}
                      textAnchor="middle"
                      fontSize="6.5"
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
  );
}
