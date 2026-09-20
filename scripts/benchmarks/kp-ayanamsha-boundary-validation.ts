/**
 * ============================================================================
 * ASTROLIFE — PHASE 2F: KP AYANAMSHA CONSISTENCY & BOUNDARY VALIDATION HARNESS
 * ============================================================================
 * Executes:
 * - Phase 4: Boundary Stress Test (±10', ±5', ±1', ±1", exact on sub boundaries)
 * - Phase 5: Cross-System Difference Test (Lahiri vs KP across benchmark charts)
 * - Phase 6: Critical Sub-Lord Boundary Test (cases where offset crosses boundary)
 * ============================================================================
 */

import { calculateChart, getJD, lahiri } from "../../src/lib/astro-engine/calculations";
import {
  computePlacidusCusps,
  computeKPAyanamsha,
  getPlacidusBhavaHouse,
  getStarLord,
  getSubLord,
  getSubSubLord,
  getPada,
} from "../../src/lib/astro-engine/placidus";
import {
  runKPEngine,
  normalizeToKPInput,
  getNakshatra,
  KPPlanet,
} from "../../src/lib/astro-engine/kp";

// ── Helpers ──────────────────────────────────────────────────────────────────
const _n = (x: number) => ((x % 360) + 360) % 360;

export interface BoundaryStressTestResult {
  boundaryName: string;
  nominalBoundaryDeg: number;
  offsets: Array<{
    label: string;
    offsetArcsec: number;
    testLon: number;
    nakshatra: string;
    pada: number;
    starLord: KPPlanet;
    subLord: KPPlanet;
    subSubLord: KPPlanet;
  }>;
}

export interface CrossSystemDifferenceResult {
  chartId: string;
  name: string;
  jd: number;
  lahiriAyanamsha: number;
  kpAyanamsha: number;
  ayanamshaDeltaArcsec: number;
  bodies: Array<{
    body: string;
    lahiriLon: number;
    kpLon: number;
    deltaArcsec: number;
    lahiriSub: KPPlanet;
    kpSub: KPPlanet;
    subFlips: boolean;
  }>;
  cusp1: {
    lahiriAsc: number;
    kpCusp1: number;
    deltaArcsec: number;
    lahiriSub: KPPlanet;
    kpSub: KPPlanet;
    subFlips: boolean;
  };
}

export interface CriticalSubBoundaryResult {
  testId: string;
  description: string;
  tropicalLon: number;
  lahiriLon: number;
  kpLon: number;
  deltaArcsec: number;
  lahiriResult: {
    nakshatra: string;
    starLord: KPPlanet;
    subLord: KPPlanet;
  };
  kpResult: {
    nakshatra: string;
    starLord: KPPlanet;
    subLord: KPPlanet;
  };
  productionKPResult: {
    nakshatra: string;
    starLord: KPPlanet;
    subLord: KPPlanet;
    sourceUsed: "Lahiri" | "KP";
  };
  subFlipped: boolean;
}

export function runKPAyanamshaAudit(): {
  boundaryTests: BoundaryStressTestResult[];
  crossSystemComparisons: CrossSystemDifferenceResult[];
  criticalSubCases: CriticalSubBoundaryResult[];
} {
  console.log("\n================================================================================");
  console.log("   ASTROLIFE — PHASE 2F: KP AYANAMSHA CONSISTENCY & BOUNDARY AUDIT");
  console.log("================================================================================\n");

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 4: BOUNDARY STRESS TEST
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- PHASE 4: SUB-LORD BOUNDARY STRESS TESTS ---");

  // Select 3 prominent sub boundaries:
  // 1. 0.0000° (0° Aries / 360° Pisces: Revati / Ashwini Nakshatra & Sub Boundary)
  // 2. 0.777778° (Ashwini Ketu sub -> Ashwini Venus sub boundary at 0° 46' 40")
  // 3. 3.000000° (Ashwini Venus sub -> Ashwini Sun sub boundary at 3° 00' 00")
  const boundariesToTest = [
    { name: "Ashwini 0° Aries Sandhi (Revati -> Ashwini)", boundaryDeg: 0.0 },
    { name: "Ashwini Ketu/Venus Sub Boundary (0° 46' 40\")", boundaryDeg: 46 / 60 + 40 / 3600 },
    { name: "Ashwini Venus/Sun Sub Boundary (3° 00' 00\")", boundaryDeg: 3.0 },
  ];

  const offsetDeltas = [
    { label: "-10 arcmin", arcsec: -600 },
    { label: "-5 arcmin",  arcsec: -300 },
    { label: "-1 arcmin",  arcsec: -60 },
    { label: "-1 arcsec",  arcsec: -1 },
    { label: "exact on boundary", arcsec: 0 },
    { label: "+1 arcsec",  arcsec: 1 },
    { label: "+1 arcmin",  arcsec: 60 },
    { label: "+5 arcmin",  arcsec: 300 },
    { label: "+10 arcmin", arcsec: 600 },
  ];

  const boundaryTests: BoundaryStressTestResult[] = [];

  for (const b of boundariesToTest) {
    console.log(`\nTesting boundary: ${b.name} (${b.boundaryDeg.toFixed(6)}°)`);
    const offsetsResult = [];

    for (const off of offsetDeltas) {
      const testLon = _n(b.boundaryDeg + off.arcsec / 3600);
      const nak = getNakshatra(testLon);
      const pada = getPada(testLon);
      const star = getStarLord(testLon);
      const sub = getSubLord(testLon);
      const subsub = getSubSubLord(testLon);

      offsetsResult.push({
        label: off.label,
        offsetArcsec: off.arcsec,
        testLon,
        nakshatra: nak,
        pada,
        starLord: star,
        subLord: sub,
        subSubLord: subsub,
      });

      console.log(
        `  ${off.label.padEnd(18)} | Lon: ${testLon.toFixed(6)}° | Nak: ${nak.padEnd(10)} | Star: ${star.padEnd(7)} | Sub: ${sub.padEnd(7)} | SubSub: ${subsub}`
      );
    }

    boundaryTests.push({
      boundaryName: b.name,
      nominalBoundaryDeg: b.boundaryDeg,
      offsets: offsetsResult,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 5: CROSS-SYSTEM DIFFERENCE TEST (Lahiri vs KP)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n\n--- PHASE 5: CROSS-SYSTEM DIFFERENCE TEST (LAHIRI vs KP) ---");

  const benchmarkCases = [
    { id: "TC-01", name: "Case 1: Nakshatra Sandhi", dob: "2024-04-09", tob: "07:32", tz: 5.5, lat: 28.6139, lon: 77.209 },
    { id: "TC-02", name: "Case 2: Navamsha Sandhi",  dob: "2023-05-15", tob: "14:15", tz: 5.5, lat: 19.076,  lon: 72.8777 },
    { id: "TC-05", name: "Case 5: Midnight Rollover",dob: "2020-01-01", tob: "00:00", tz: 5.5, lat: 28.6139, lon: 77.209 },
    { id: "TC-10", name: "Case 10: High Latitude",   dob: "2024-06-21", tob: "12:00", tz: 2.0, lat: 69.6492, lon: 18.9553 },
  ];

  const crossSystemComparisons: CrossSystemDifferenceResult[] = [];

  for (const bc of benchmarkCases) {
    const jd = getJD(bc.dob, bc.tob, bc.tz);
    const ayanLahiri = lahiri(jd);
    const ayanKP = computeKPAyanamsha(jd);
    const deltaAyanArcsec = (ayanLahiri - ayanKP) * 3600;

    const chart = calculateChart(bc.name, bc.dob, bc.tob, "City", bc.lat, bc.lon, bc.tz);

    const bodies = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const bodiesResult = [];

    console.log(`\nCase ${bc.id}: ${bc.name}`);
    console.log(`  Lahiri Ayanamsha: ${ayanLahiri.toFixed(6)}° | KP Ayanamsha: ${ayanKP.toFixed(6)}° | Delta: ${deltaAyanArcsec.toFixed(2)}"`);

    for (const b of bodies) {
      const pData = chart.planets[b];
      const lahiriLon = pData.lon;
      // Tropical longitude: lon + lahiri
      const tropLon = _n(lahiriLon + ayanLahiri);
      // KP longitude: tropLon - ayanKP
      const kpLon = _n(tropLon - ayanKP);
      const deltaLonArcsec = ((kpLon - lahiriLon + 540) % 360 - 180) * 3600;

      const lahiriSub = getSubLord(lahiriLon);
      const kpSub = getSubLord(kpLon);
      const subFlips = lahiriSub !== kpSub;

      bodiesResult.push({
        body: b,
        lahiriLon,
        kpLon,
        deltaArcsec: deltaLonArcsec,
        lahiriSub,
        kpSub,
        subFlips,
      });

      console.log(
        `  ${b.padEnd(8)} | Lahiri: ${lahiriLon.toFixed(4)}° (${lahiriSub.padEnd(7)}) | KP: ${kpLon.toFixed(4)}° (${kpSub.padEnd(7)}) | Delta: ${deltaLonArcsec.toFixed(1)}" ${subFlips ? "⚠️ FLIP" : "✓ MATCH"}`
      );
    }

    // Ascendant / Cusp 1
    const lahiriAsc = chart.lagnaLon;
    const kpCusp1 = chart.kpCusps![0].lon;
    const deltaAscArcsec = ((kpCusp1 - lahiriAsc + 540) % 360 - 180) * 3600;
    const lahiriAscSub = getSubLord(lahiriAsc);
    const kpCusp1Sub = getSubLord(kpCusp1);
    const ascSubFlips = lahiriAscSub !== kpCusp1Sub;

    console.log(
      `  Asc/Cusp1 | Lahiri: ${lahiriAsc.toFixed(4)}° (${lahiriAscSub.padEnd(7)}) | KP: ${kpCusp1.toFixed(4)}° (${kpCusp1Sub.padEnd(7)}) | Delta: ${deltaAscArcsec.toFixed(1)}" ${ascSubFlips ? "⚠️ FLIP" : "✓ MATCH"}`
    );

    crossSystemComparisons.push({
      chartId: bc.id,
      name: bc.name,
      jd,
      lahiriAyanamsha: ayanLahiri,
      kpAyanamsha: ayanKP,
      ayanamshaDeltaArcsec: deltaAyanArcsec,
      bodies: bodiesResult,
      cusp1: {
        lahiriAsc,
        kpCusp1,
        deltaArcsec: deltaAscArcsec,
        lahiriSub: lahiriAscSub,
        kpSub: kpCusp1Sub,
        subFlips: ascSubFlips,
      },
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 6: CRITICAL SUB-LORD BOUNDARY CASES
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n\n--- PHASE 6: CRITICAL SUB-LORD BOUNDARY CASES ---");
  console.log("Constructing longitudes where the ~5'53\" ayanamsha offset straddles a sub boundary:\n");

  // At epoch 2024, Delta A = A_Lahiri - A_KP ≈ +0.098056° = +353.0" = +5' 53.0"
  // If tropical longitude lambda_trop is chosen such that:
  // lambda_KP = lambda_trop - A_KP is just AFTER a sub boundary
  // lambda_Lahiri = lambda_trop - A_Lahiri = lambda_KP - 0.098056° is just BEFORE that boundary!
  const criticalSubCases: CriticalSubBoundaryResult[] = [];

  const boundaryCheckpoints = [
    {
      id: "CRIT-01",
      desc: "Ashwini Ketu/Venus Sub Boundary (0° 46' 40\" = 0.777778°)",
      subBoundaryDeg: 46 / 60 + 40 / 3600, // 0.777778°
      // Place lambda_KP 2 arcminutes past boundary (0.777778° + 0.033333° = 0.811111°)
      // Then lambda_Lahiri = 0.811111° - 0.098056° = 0.713055° (which is BEFORE 0.777778°!)
      kpTargetDeg: 46 / 60 + 40 / 3600 + 120 / 3600,
    },
    {
      id: "CRIT-02",
      desc: "Ashwini Venus/Sun Sub Boundary (3° 00' 00\" = 3.000000°)",
      subBoundaryDeg: 3.0,
      // Place lambda_KP 2 arcminutes past 3° (3.033333°)
      // Then lambda_Lahiri = 3.033333° - 0.098056° = 2.935277° (which is BEFORE 3.000000°!)
      kpTargetDeg: 3.0 + 120 / 3600,
    },
    {
      id: "CRIT-03",
      desc: "Ashwini Sun/Moon Sub Boundary (3° 40' 00\" = 3.666667°)",
      subBoundaryDeg: 3 + 40 / 60, // 3.666667°
      // Place lambda_KP 2 arcminutes past 3°40' (3.700000°)
      // Then lambda_Lahiri = 3.700000° - 0.098056° = 3.601944° (which is BEFORE 3.666667°!)
      kpTargetDeg: 3 + 40 / 60 + 120 / 3600,
    },
    {
      id: "CRIT-04",
      desc: "Zodiac 0° Aries Revati/Ashwini Sandhi (0° 00' 00\")",
      subBoundaryDeg: 0.0,
      // Place lambda_KP 2 arcminutes past 0° (0.033333°) -> Ashwini, Ketu sub
      // Then lambda_Lahiri = 0.033333° - 0.098056° = 359.935277° -> Revati, Mercury sub!
      kpTargetDeg: 120 / 3600,
    },
  ];

  const sampleJD = getJD("2024-04-09", "07:32", 5.5);
  const ayanLahiriSample = lahiri(sampleJD);
  const ayanKPSample = computeKPAyanamsha(sampleJD);

  for (const cp of boundaryCheckpoints) {
    const kpLon = cp.kpTargetDeg;
    const tropLon = _n(kpLon + ayanKPSample);
    const lahiriLon = _n(tropLon - ayanLahiriSample);
    const deltaArcsec = ((kpLon - lahiriLon + 540) % 360 - 180) * 3600;

    const lahiriResult = {
      nakshatra: getNakshatra(lahiriLon),
      starLord: getStarLord(lahiriLon),
      subLord: getSubLord(lahiriLon),
    };

    const kpResult = {
      nakshatra: getNakshatra(kpLon),
      starLord: getStarLord(kpLon),
      subLord: getSubLord(kpLon),
    };

    // Feed this into runKPEngine via a synthetic chart object to observe what production KP does!
    const syntheticChart: any = {
      name: "BoundarySynth",
      dob: "2024-04-09",
      tob: "07:32",
      tz: 5.5,
      jd: sampleJD,
      lat: 28.6139,
      lon: 77.209,
      lagnaLon: lahiriLon,
      planets: {
        Sun: {
          lon: lahiriLon,
          degree: Math.floor(lahiriLon % 30),
          minutes: Math.floor((lahiriLon % 1) * 60),
          house: 1,
          rashiHouse: 1,
          bhavaHouse: 1,
          bhavaShift: 0,
          nakshatra: lahiriResult.nakshatra,
          starLord: lahiriResult.starLord,
          pada: getPada(lahiriLon),
          retrograde: false,
        },
      },
      kpCusps: [
        {
          house: 1,
          lon: kpLon,
          starLord: kpResult.starLord,
          subLord: kpResult.subLord,
          subSubLord: getSubSubLord(kpLon),
          source: "placidus",
        },
      ],
    };

    const kpOutput = runKPEngine(syntheticChart);
    const sunRow = kpOutput.rows.find((r) => r.name === "Sun");
    const prodSub = sunRow?.subLord ?? "Unknown";

    const sourceUsed = prodSub === kpResult.subLord ? "KP" : "Lahiri";
    const subFlipped = lahiriResult.subLord !== kpResult.subLord;

    criticalSubCases.push({
      testId: cp.id,
      description: cp.desc,
      tropicalLon: tropLon,
      lahiriLon,
      kpLon,
      deltaArcsec,
      lahiriResult,
      kpResult,
      productionKPResult: {
        nakshatra: sunRow?.nakshatra ?? "Unknown",
        starLord: sunRow?.starLord as KPPlanet,
        subLord: prodSub as KPPlanet,
        sourceUsed: sourceUsed as "Lahiri" | "KP",
      },
      subFlipped,
    });

    console.log(`Test ${cp.id}: ${cp.desc}`);
    console.log(`  Tropical Lon: ${tropLon.toFixed(6)}°`);
    console.log(`  Lahiri Lon:   ${lahiriLon.toFixed(6)}° -> Sub: ${lahiriResult.subLord} (${lahiriResult.nakshatra})`);
    console.log(`  KP Lon:       ${kpLon.toFixed(6)}° -> Sub: ${kpResult.subLord} (${kpResult.nakshatra})`);
    console.log(`  Sub Flipped?  ${subFlipped ? "YES (Sub differs between Lahiri & KP)" : "NO"}`);
    console.log(`  Production KP Row Sub: ${prodSub} [Evaluated from ${sourceUsed} longitude]\n`);
  }

  return {
    boundaryTests,
    crossSystemComparisons,
    criticalSubCases,
  };
}

if (process.argv[1]?.includes("kp-ayanamsha-boundary-validation")) {
  runKPAyanamshaAudit();
}
