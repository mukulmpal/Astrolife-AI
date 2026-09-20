import type { BenchmarkTestCase } from "../schema";
import { nakshatraBoundaryCase } from "./nakshatra-boundary";
import { navamshaBoundaryCase } from "./navamsha-boundary";
import { cuspBoundaryCase } from "./cusp-boundary";
import { historicalTimezoneCase } from "./historical-timezone";
import { midnightCase } from "./midnight";
import { sunriseSunsetCase } from "./sunrise-sunset";
import { retrogradeStationaryCase } from "./retrograde-stationary";
import { highLatitudeCase } from "./high-latitude";
import { trueMeanNodeCase } from "./true-mean-node";
import { combustionBoundaryCase } from "./combustion-boundary";

export const BENCHMARK_TEST_CASES: BenchmarkTestCase[] = [
  nakshatraBoundaryCase,
  navamshaBoundaryCase,
  cuspBoundaryCase,
  historicalTimezoneCase,
  midnightCase,
  sunriseSunsetCase,
  retrogradeStationaryCase,
  highLatitudeCase,
  trueMeanNodeCase,
  combustionBoundaryCase,
];

