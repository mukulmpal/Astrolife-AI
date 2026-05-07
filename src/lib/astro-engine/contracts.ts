import type { TransitBase, TransitReport } from "./transits";
import type { EventRadarArea, EventRadarReport, EventRadarSignal } from "./event-radar";
import type { PanchangResult } from "./panchang";
import type { VastuResult } from "./vastu";

export const PLANET_NAMES = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
] as const;

export const TRANSIT_BASES = ["lagna", "moon"] as const satisfies readonly TransitBase[];
export const EVENT_RADAR_SIGNALS = [
  "excellent",
  "good",
  "mixed",
  "caution",
  "sensitive",
] as const satisfies readonly EventRadarSignal[];
export const EVENT_RADAR_AREAS = [
  "career",
  "love",
  "money",
  "health",
  "family",
  "spirituality",
] as const satisfies readonly EventRadarArea[];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function assertTransitReportContract(report: unknown): asserts report is TransitReport {
  if (!isObject(report)) throw new Error("TransitReport must be an object");
  if (!TRANSIT_BASES.includes(report.base as TransitBase)) {
    throw new Error("TransitReport.base must be lagna|moon");
  }
  if (!Array.isArray(report.planets) || report.planets.length !== PLANET_NAMES.length) {
    throw new Error("TransitReport.planets must include 9 planets");
  }
  if (!Array.isArray(report.areaScores) || report.areaScores.length !== EVENT_RADAR_AREAS.length) {
    throw new Error("TransitReport.areaScores must include 6 areas");
  }
  if (!Array.isArray(report.alerts)) throw new Error("TransitReport.alerts must be array");
  if (typeof report.summary !== "string") throw new Error("TransitReport.summary must be string");
  if (typeof report.aiContext !== "string") throw new Error("TransitReport.aiContext must be string");
}

export function assertEventRadarReportContract(report: unknown): asserts report is EventRadarReport {
  if (!isObject(report)) throw new Error("EventRadarReport must be an object");
  if (!TRANSIT_BASES.includes(report.base as TransitBase)) {
    throw new Error("EventRadarReport.base must be lagna|moon");
  }
  if (!Array.isArray(report.days) || report.days.length === 0) {
    throw new Error("EventRadarReport.days must be non-empty array");
  }
  for (const day of report.days) {
    if (!isObject(day)) throw new Error("EventRadarReport.days[] must be object");
    if (!EVENT_RADAR_SIGNALS.includes(day.signal as EventRadarSignal)) {
      throw new Error("EventRadarReport day signal invalid");
    }
    if (!EVENT_RADAR_AREAS.includes(day.bestArea as EventRadarArea)) {
      throw new Error("EventRadarReport day bestArea invalid");
    }
    if (!EVENT_RADAR_AREAS.includes(day.cautionArea as EventRadarArea)) {
      throw new Error("EventRadarReport day cautionArea invalid");
    }
  }
  if (typeof report.summary !== "string") throw new Error("EventRadarReport.summary must be string");
  if (typeof report.aiContext !== "string") throw new Error("EventRadarReport.aiContext must be string");
}

export function assertPanchangResultContract(report: unknown): asserts report is PanchangResult {
  if (!isObject(report)) throw new Error("PanchangResult must be an object");
  if (typeof report.date !== "string") throw new Error("PanchangResult.date must be string");
  if (typeof report.weekday !== "string") throw new Error("PanchangResult.weekday must be string");
  if (typeof report.tithi !== "string") throw new Error("PanchangResult.tithi must be string");
  if (!["Shukla", "Krishna"].includes(String(report.paksha))) {
    throw new Error("PanchangResult.paksha must be Shukla|Krishna");
  }
  if (typeof report.nakshatraLord !== "string") throw new Error("PanchangResult.nakshatraLord must be string");
  if (!isObject(report.rahuKaal)) throw new Error("PanchangResult.rahuKaal must be object");
  if (!isObject(report.abhijitMuhurta)) throw new Error("PanchangResult.abhijitMuhurta must be object");
  if (!Array.isArray(report.shubhKarya)) throw new Error("PanchangResult.shubhKarya must be array");
  if (!Array.isArray(report.avoidKarya)) throw new Error("PanchangResult.avoidKarya must be array");
  if (typeof report.aiContext !== "string") throw new Error("PanchangResult.aiContext must be string");
  if (!Array.isArray(report.notes)) throw new Error("PanchangResult.notes must be array");
}

export function assertVastuResultContract(report: unknown): asserts report is VastuResult {
  if (!isObject(report)) throw new Error("VastuResult must be an object");
  if (!Array.isArray(report.zones) || report.zones.length === 0) throw new Error("VastuResult.zones must be non-empty");
  if (!Array.isArray(report.strongZones)) throw new Error("VastuResult.strongZones must be array");
  if (!Array.isArray(report.weakZones)) throw new Error("VastuResult.weakZones must be array");
  if (typeof report.overallScore !== "number") throw new Error("VastuResult.overallScore must be number");
}
