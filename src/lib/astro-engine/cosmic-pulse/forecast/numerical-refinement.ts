/**
 * Numerical Refinement algorithms for Cosmic Event Forecasting.
 * Replaces coarse 1-day step approximations with high-precision
 * root-finding (Bisection / Secant) and minimization (Golden Section Search)
 * down to seconds of precision (< 1e-4 day ≈ 8.64 seconds).
 */

/**
 * Normalizes signed angular difference into [-180, 180) degrees.
 */
export function normalizeSignedAngle(deg: number): number {
  let val = deg % 360;
  while (val > 180) val -= 360;
  while (val < -180) val += 360;
  return val;
}

/**
 * Finds exact root where getSignedAngleError(jd) === 0 using Secant / Bisection.
 * Returns null if no zero-crossing occurred within [jdStart, jdEnd].
 */
export function findExactAspectTime(
  jdStart: number,
  jdEnd: number,
  getSignedAngleError: (jd: number) => number,
  toleranceDays = 1e-4,
  maxIterations = 30
): number | null {
  let a = jdStart;
  let b = jdEnd;
  let fa = getSignedAngleError(a);
  let fb = getSignedAngleError(b);

  // If endpoints do not bracket a zero crossing
  if (fa * fb > 0) {
    // Check if either is extremely close to zero
    if (Math.abs(fa) < 1e-3) return a;
    if (Math.abs(fb) < 1e-3) return b;
    return null;
  }

  for (let i = 0; i < maxIterations; i++) {
    // Secant step with bisection safeguard
    let mid = a - fa * ((b - a) / (fb - fa));
    if (!Number.isFinite(mid) || mid <= a || mid >= b) {
      mid = 0.5 * (a + b);
    }

    const fmid = getSignedAngleError(mid);

    if (Math.abs(fmid) < 1e-5 || Math.abs(b - a) < toleranceDays) {
      return mid;
    }

    if (fa * fmid < 0) {
      b = mid;
      fb = fmid;
    } else {
      a = mid;
      fa = fmid;
    }
  }

  return 0.5 * (a + b);
}

/**
 * Finds local minimum of getOrb(jd) within bracket [jdA, jdB]
 * using Golden Section Search.
 */
export function findPeakOrbTime(
  jdA: number,
  jdB: number,
  getOrb: (jd: number) => number,
  toleranceDays = 1e-4,
  maxIterations = 35
): { jd: number; minOrb: number } {
  const phi = (1 + Math.sqrt(5)) / 2;
  const resphi = 2 - phi;

  let a = Math.min(jdA, jdB);
  let b = Math.max(jdA, jdB);

  let c = a + resphi * (b - a);
  let d = b - resphi * (b - a);
  let fc = getOrb(c);
  let fd = getOrb(d);

  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(b - a) < toleranceDays) break;

    if (fc < fd) {
      b = d;
      d = c;
      fd = fc;
      c = a + resphi * (b - a);
      fc = getOrb(c);
    } else {
      a = c;
      c = d;
      fc = fd;
      d = b - resphi * (b - a);
      fd = getOrb(d);
    }
  }

  const bestJd = (a + b) / 2;
  return { jd: bestJd, minOrb: getOrb(bestJd) };
}

/**
 * Finds the exact timestamp when getOrb(jd) crosses the specified threshold
 * between an inside point and an outside point.
 */
export function findThresholdCrossing(
  jdInside: number,
  jdOutside: number,
  getOrb: (jd: number) => number,
  threshold: number,
  toleranceDays = 1e-4,
  maxIterations = 25
): number {
  let inside = jdInside;
  let outside = jdOutside;

  for (let i = 0; i < maxIterations; i++) {
    const mid = 0.5 * (inside + outside);
    const orbMid = getOrb(mid);

    if (Math.abs(orbMid - threshold) < 1e-4 || Math.abs(outside - inside) < toleranceDays) {
      return mid;
    }

    if (orbMid <= threshold) {
      inside = mid;
    } else {
      outside = mid;
    }
  }

  return 0.5 * (inside + outside);
}

