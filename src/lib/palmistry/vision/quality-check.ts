import type { PalmImageQuality } from "../types";

export function normalizePalmImageQuality(input?: Partial<PalmImageQuality>): PalmImageQuality {
  const score = Math.max(0, Math.min(1, Number(input?.score ?? 0.75)));
  const issues = Array.isArray(input?.issues) ? input.issues.filter(Boolean) : [];
  return {
    score,
    canAnalyze: input?.canAnalyze ?? score >= 0.35,
    canAnalyzeFingerprints: input?.canAnalyzeFingerprints ?? false,
    issues,
  };
}
