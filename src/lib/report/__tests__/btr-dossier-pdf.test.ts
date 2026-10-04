import test from "node:test";
import assert from "node:assert/strict";
import { buildBTRDossierPdf } from "../btr-dossier-pdf";
import type { BTRCandidate } from "@/lib/astro-engine/birth-rectification-engine";

test("BTR Dossier PDF Builder: Generates valid multi-page PDF buffer", async () => {
  const mockCandidate: BTRCandidate = {
    date: "1995-07-04",
    time: "12:34:16",
    isoDateTime: "1995-07-04T12:34:16+05:30",
    confidence: 96.8,
    lagnaRashi: "Virgo",
    lagnaDegree: 19,
    lagnaMinutes: 26,
    lagnaSubLord: "Mercury",
    lagnaStarLord: "Moon",
    moonRashi: "Leo",
    moonNakshatra: "Uttara Phalguni",
    moonNakshatraLord: "Sun",
    kundaMatch: true,
    kundaNakshatra: "Krittika",
    palmCompatibilityScore: 92,
    eventMatchScore: 40,
    eventMatches: [
      {
        eventTitle: "College Admission",
        eventDate: "2015-08-01",
        category: "education_exam",
        mahadasha: "Rahu",
        antardasha: "Mercury",
        matched: true,
        score: 10,
        reason: "Education house active",
      },
      {
        eventTitle: "College Graduation",
        eventDate: "2018-06-01",
        category: "education_exam",
        mahadasha: "Jupiter",
        antardasha: "Jupiter",
        matched: true,
        score: 10,
        reason: "Completion corroborated",
      },
      {
        eventTitle: "First Job",
        eventDate: "2019-07-01",
        category: "career_start",
        mahadasha: "Jupiter",
        antardasha: "Saturn",
        matched: true,
        score: 10,
        reason: "10th/6th house alignment",
      },
      {
        eventTitle: "Good Job Promotion",
        eventDate: "2021-09-01",
        category: "promotion",
        mahadasha: "Jupiter",
        antardasha: "Mercury",
        matched: true,
        score: 10,
        reason: "Sub-lord activation",
      },
    ],
    summary: "Virgo Ascendant confirmed with 96.8% convergence.",
    evidenceMatrix: {
      kpThreeLevel: {
        passed: true,
        ascSubLord: "Mercury",
        moonSubLord: "Venus",
        starLord: "Moon",
        score: 15,
        details: "Lagna Sub-Lord Mercury links to Moon star.",
      },
      ruleOfOrigin: {
        passed: true,
        ascSubLord: "Mercury",
        ninthSubLord: "Mercury",
        ninthSign: "Taurus",
        ruleO1: true,
        ruleO2: true,
        ruleO3: true,
        score: 20,
        details: "1st Sub = 9th Sub = Mercury (Vyapar/Business). 9th sign Taurus matches father's Moon sign Tula (Venus).",
      },
      pranapada: {
        passed: true,
        errorDeg: 0.04,
        pranapadaAmsa: 19.40,
        ascAmsa: 19.44,
        deltaCorrectionSeconds: 0,
        score: 15,
        details: "Exact match within 0.04°.",
      },
      gulika: {
        passed: true,
        matchType: "NAVAMSA_MATCH",
        gulikaSign: "Scorpio",
        gulikaNavamsa: "Gemini",
        score: 10,
        details: "Gulika Navamsa Gemini aligns with Lagna Navamsa Gemini.",
      },
      tattva: {
        tattvaName: "Kshiti (Earth)",
        tattvaElement: "earth",
        matched: true,
        score: 10,
        details: "Kshiti Earth matches Virgo Earth. Sub-segment 1 (Male) matches male native.",
      },
      palaHarmonics: {
        weekdayMatched: true,
        starGroupMatched: true,
        score: 8,
        details: "3P mod 7 = 3 (Tuesday), 4P mod 9 = 3 (Star group 3). Offset = 0 palas.",
      },
      ndGender: {
        ndPointNumber: 70,
        ndGender: "male",
        matched: true,
        score: 5,
        details: "Point 70 odd-in-even matches male.",
      },
      sunStarAscendant: {
        quarter: 2,
        period: "day",
        matched: true,
        score: 3,
        details: "Quarter 2 daytime offsets verified.",
      },
      kunda: {
        passed: true,
        kundaNakshatra: "Krittika",
        score: 10,
        details: "Krittika (Sun) is in 100% trine with Uttara Phalguni (Sun).",
      },
      lifeEvents: {
        matchedCount: 4,
        totalCount: 4,
        score: 40,
        details: "4/4 events corroborated.",
      },
      palmistry: {
        score: 10,
        elementMatch: true,
        details: "Earth hand matches Virgo Ascendant.",
      },
      prenatalEpoch: {
        gestationDays: 259.7,
        isShorterThanStandard: true,
        daysOffset: 13.32,
        distanceToHorizonDeg: 159.8,
        conceptionDateEstimated: "1994-10-17",
        nearestHorizonGestationDays: 271.3,
        nearestHorizonDateEstimated: "1994-10-06",
        expectedAdhanaLagnaSign: "Leo",
        expectedAdhanaMoonSign: "Virgo",
        audit: "Trutine verified across conception cycle.",
      },
    },
    methodTrace: [
      "[TRACE] Delhi sunrise: 05:32 IST",
      "[TRACE] Palas elapsed: 102.7",
      "[TRACE] Sub-Lord: Mercury (Vyapar)",
      "[TRACE] Confidence: 96.8%",
    ],
  };

  const pdfBuffer = await buildBTRDossierPdf(mockCandidate, {
    name: "Mukul Pal",
    city: "Delhi, India",
    gender: "male",
  });

  assert.ok(Buffer.isBuffer(pdfBuffer), "Must return a Buffer");
  assert.ok(pdfBuffer.length > 5000, `Buffer must be substantial (> 5KB), got ${pdfBuffer.length} bytes`);

  // PDF header check
  const header = pdfBuffer.subarray(0, 5).toString("utf-8");
  assert.equal(header, "%PDF-", "PDF header magic bytes must match %PDF-");
});
