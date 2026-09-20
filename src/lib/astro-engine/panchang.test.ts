import test from "node:test";
import assert from "node:assert/strict";
import { calculatePanchang } from "./panchang";

test("Panchang Engine — Astronomical sunrise with location coordinates", () => {
  // Summer Solstice: June 21, 2024 at New Delhi (28.6139° N, 77.2090° E)
  const summerDate = new Date("2024-06-21T12:00:00Z");
  const summerPanchang = calculatePanchang(summerDate, 5.5, { lat: 28.6139, lon: 77.2090 });

  assert.equal(summerPanchang.sunriseAssumed, summerPanchang.sunrise, "Exact sunrise when coordinates provided");
  assert.notEqual(summerPanchang.sunrise, "06:00", "Summer sunrise in Delhi should not be naive 06:00");
  assert.notEqual(summerPanchang.sunset, "18:00", "Summer sunset in Delhi should not be naive 18:00");

  // In June in Delhi, sunrise is around 05:24 IST and sunset is around 19:22 IST
  const [srHour, srMin] = summerPanchang.sunrise.split(":").map(Number);
  assert.equal(srHour, 5, `Summer sunrise hour should be 5, got ${summerPanchang.sunrise}`);
  assert.ok(srMin >= 15 && srMin <= 35, `Summer sunrise minute should be ~24, got ${srMin}`);

  // Winter Solstice: December 21, 2024 at New Delhi
  const winterDate = new Date("2024-12-21T12:00:00Z");
  const winterPanchang = calculatePanchang(winterDate, 5.5, { lat: 28.6139, lon: 77.2090 });

  // In December in Delhi, sunrise is around 07:10 IST and sunset is around 17:30 IST
  const [wSrHour, wSrMin] = winterPanchang.sunrise.split(":").map(Number);
  assert.equal(wSrHour, 7, `Winter sunrise hour should be 7, got ${winterPanchang.sunrise}`);
  assert.ok(wSrMin >= 0 && wSrMin <= 20, `Winter sunrise minute should be ~10, got ${wSrMin}`);
});

test("Panchang Engine — Regional fallback when location is omitted", () => {
  // When location is omitted for IST (tz: 5.5), defaults to New Delhi national standard coords
  const summerDate = new Date("2024-06-21T12:00:00Z");
  const panchang = calculatePanchang(summerDate, 5.5);

  assert.ok(panchang.sunriseAssumed.includes("approx"), "Should flag regional approximation");
  assert.notEqual(panchang.sunrise, "06:00", "Should compute Delhi astronomical sunrise rather than flat 06:00");
  assert.notEqual(panchang.sunset, "18:00", "Should compute Delhi astronomical sunset rather than flat 18:00");

  const [srHour] = panchang.sunrise.split(":").map(Number);
  assert.equal(srHour, 5, "Delhi regional fallback summer sunrise should be ~05:xx");
});

test("Panchang Engine — Chaughadia and Rahu Kaal daylight proportions", () => {
  const date = new Date("2024-06-21T12:00:00Z");
  const p = calculatePanchang(date, 5.5, { lat: 28.6139, lon: 77.2090 });

  assert.equal(p.chaughadiaDay.length, 8, "Day chaughadia must have exactly 8 slots");
  assert.equal(p.chaughadiaNight.length, 8, "Night chaughadia must have exactly 8 slots");
  assert.equal(p.chaughadiaDay[0].start, p.sunrise, "First day chaughadia starts at sunrise");
  assert.equal(p.chaughadiaDay[7].end, p.sunset, "Last day chaughadia ends at sunset");

  assert.ok(p.rahuKaal.start >= p.sunrise, "Rahu Kaal must start after or at sunrise");
  assert.ok(p.rahuKaal.end <= p.sunset, "Rahu Kaal must end before or at sunset");
});
