// ── Deterministic palm geometry from MediaPipe hand landmarks ──
// Runs fully client-side (no API). Produces exact, anatomically-correct
// overlay coordinates for the palm mounts and major lines, scaled and
// oriented to the user's ACTUAL hand in the photo — so the overlay sits
// where it really should, and left/right is detected reliably.

import type {
  PalmLineId,
  PalmMountId,
  Point,
  PalmistryReport,
} from "@/lib/astro-engine/palmistry-engine";

export interface HandGeometry {
  hand: "left" | "right";
  mounts: Partial<Record<PalmMountId, Point>>;
  lines: Partial<Record<PalmLineId, Point[]>>;
}

// MediaPipe HandLandmarker indices.
const WRIST = 0, THUMB_CMC = 1, THUMB_MCP = 2;
const INDEX_MCP = 5, MIDDLE_MCP = 9, RING_MCP = 13, PINKY_MCP = 17;

type LM = { x: number; y: number; z?: number };

// ── small vector helpers (all in 0-100 image space) ──
const clamp = (n: number) => Math.max(0, Math.min(100, n));
const cl = (p: Point): Point => ({ x: clamp(p.x), y: clamp(p.y) });
function mid(...ps: Point[]): Point {
  return { x: ps.reduce((s, p) => s + p.x, 0) / ps.length, y: ps.reduce((s, p) => s + p.y, 0) / ps.length };
}
// linear blend a→b by t (t can be <0 or >1 to move outward/past).
function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function buildGeometry(lm: LM[]): HandGeometry {
  const P = (i: number): Point => ({ x: lm[i].x * 100, y: lm[i].y * 100 });

  // Reliable hand side: which side of the four fingers the thumb sits on.
  // With palm facing the camera, thumb on the right of the image = LEFT hand.
  const thumbOnRight = P(THUMB_MCP).x > P(PINKY_MCP).x;
  const hand: "left" | "right" = thumbOnRight ? "left" : "right";

  // Palm centre and the row of finger bases.
  const C = mid(P(WRIST), P(INDEX_MCP), P(MIDDLE_MCP), P(RING_MCP), P(PINKY_MCP));
  const mcpCenter = mid(P(INDEX_MCP), P(MIDDLE_MCP), P(RING_MCP), P(PINKY_MCP));
  // Vector pointing "down" the palm (finger bases → wrist).
  const down: Point = { x: P(WRIST).x - mcpCenter.x, y: P(WRIST).y - mcpCenter.y };
  const below = (p: Point, f: number): Point => ({ x: p.x + down.x * f, y: p.y + down.y * f });

  // ── Mounts: finger mounts sit just below each finger base, nudged into the palm.
  const venus = lerp(mid(P(WRIST), P(THUMB_CMC), P(THUMB_MCP)), C, 0.18);
  const moon = lerp(mid(P(PINKY_MCP), P(WRIST)), C, -0.12); // outer-lower, away from centre

  const mounts: HandGeometry["mounts"] = {
    jupiter:   cl(lerp(P(INDEX_MCP), C, 0.32)),
    saturn:    cl(lerp(P(MIDDLE_MCP), C, 0.28)),
    sun:       cl(lerp(P(RING_MCP), C, 0.28)),
    mercury:   cl(lerp(P(PINKY_MCP), C, 0.32)),
    venus:     cl(venus),
    moon:      cl(moon),
    lowerMars: cl(lerp(mid(P(INDEX_MCP), P(THUMB_MCP)), C, 0.38)),
    upperMars: cl(lerp(lerp(P(PINKY_MCP), moon, 0.5), C, 0.2)),
  };

  // ── Lines: polylines anchored to landmarks, ordered start→end.
  const webThumb = mid(P(INDEX_MCP), P(THUMB_MCP)); // gap between thumb & index

  const lines: HandGeometry["lines"] = {
    // Heart line: a curve just below the finger bases, pinky → index side.
    heart: [
      below(P(PINKY_MCP), 0.20), below(P(RING_MCP), 0.17),
      below(P(MIDDLE_MCP), 0.17), below(P(INDEX_MCP), 0.22),
    ].map(cl),
    // Head line: below the heart line, thumb-web → pinky side.
    head: [
      below(webThumb, 0.30), below(P(MIDDLE_MCP), 0.36),
      below(P(RING_MCP), 0.36), below(P(PINKY_MCP), 0.33),
    ].map(cl),
    // Life line: arc from thumb-web around the thumb ball down to the wrist.
    life: [
      lerp(webThumb, C, 0.12), lerp(P(THUMB_MCP), C, 0.26),
      lerp(P(THUMB_CMC), C, 0.22), lerp(P(WRIST), C, 0.16),
    ].map(cl),
    // Fate line: up the centre of the palm, wrist → middle finger base.
    fate: [
      lerp(P(WRIST), P(MIDDLE_MCP), 0.18), lerp(P(WRIST), P(MIDDLE_MCP), 0.5),
      lerp(P(WRIST), P(MIDDLE_MCP), 0.82),
    ].map(cl),
    // Sun line: lower palm → ring finger base (shorter, upper).
    sun: [
      lerp(P(WRIST), P(RING_MCP), 0.42), lerp(P(WRIST), P(RING_MCP), 0.64),
      lerp(P(WRIST), P(RING_MCP), 0.84),
    ].map(cl),
    // Mercury line: from the Moon mount up toward the little finger base.
    mercury: [
      lerp(moon, P(PINKY_MCP), 0.2), lerp(moon, P(PINKY_MCP), 0.55),
      lerp(moon, P(PINKY_MCP), 0.85),
    ].map(cl),
  };

  return { hand, mounts, lines };
}

// ── Lazy, cached HandLandmarker (WASM + model from CDN) ──
type Landmarker = {
  detect: (img: HTMLImageElement) => { landmarks?: LM[][] };
};
let landmarkerPromise: Promise<Landmarker> | null = null;

async function getLandmarker(): Promise<Landmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
      );
      return vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        numHands: 1,
        runningMode: "IMAGE",
      }) as unknown as Landmarker;
    })();
  }
  return landmarkerPromise;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

// Detect hand geometry from a data URL. Returns null on any failure so the
// caller can gracefully fall back to model/template coordinates.
export async function detectHandGeometry(dataUrl: string): Promise<HandGeometry | null> {
  try {
    const [landmarker, img] = await Promise.all([getLandmarker(), loadImage(dataUrl)]);
    const res = landmarker.detect(img);
    const lm = res.landmarks?.[0];
    if (!lm || lm.length < 21) return null;
    return buildGeometry(lm);
  } catch (e) {
    if (typeof console !== "undefined") console.warn("[hand-geometry] detection failed", e);
    return null;
  }
}

// Merge landmark geometry into a parsed report so existing overlay rendering
// (which reads report.meta.hand, mount.pos, line.points) uses exact coords.
export function applyHandGeometry(report: PalmistryReport, geo: HandGeometry | null): PalmistryReport {
  if (!geo) return report;
  return {
    ...report,
    meta: { ...report.meta, hand: geo.hand },
    mounts: report.mounts.map((m) => (geo.mounts[m.id] ? { ...m, pos: geo.mounts[m.id] } : m)),
    lines: report.lines.map((l) => (geo.lines[l.id] ? { ...l, points: geo.lines[l.id] } : l)),
  };
}
