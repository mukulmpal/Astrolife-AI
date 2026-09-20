import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "./calculations";

test("Calculations Engine — customTz propagation and coordinates fallback", () => {
  // Case 1: Explicit customTz provided (e.g. New York UTC-5)
  const chartNY = calculateChart("UserNY", "1990-06-15", "08:00", "", 40.7128, -74.006, -5);

  assert.equal(chartNY.tz, -5, "Should respect explicit customTz: -5");
  assert.equal(chartNY.lat, 40.7128);
  assert.equal(chartNY.lon, -74.006);

  // Case 2: customTz omitted for Indian coordinates (lat ~28.6, lon ~77.2)
  const chartDelhi = calculateChart("UserDelhi", "1995-05-15", "14:30", "", 28.6139, 77.209);

  assert.equal(chartDelhi.tz, 5.5, "Indian coords should default to IST (5.5) when customTz is omitted");

  // Case 3: customTz omitted for international coordinates (e.g. London lat: 51.5, lon: 0)
  const chartLondon = calculateChart("UserLondon", "2000-01-01", "12:00", "", 51.5074, 0.1278);

  assert.equal(chartLondon.tz, 0, "London coords should resolve to UTC (0) when customTz is omitted");

  // Case 4: City name provided with customTz overriding it
  const chartOverride = calculateChart("UserOverride", "1988-11-20", "18:00", "Delhi", undefined, undefined, 6);

  assert.equal(chartOverride.tz, 6, "customTz should take precedence over static city table");
});
