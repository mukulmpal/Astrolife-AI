# 🧪 Gemstone Engine Testing Guide

## Quick Test (5 minutes)

### 1️⃣ **TypeScript Compilation Test**
```bash
cd /Users/mukulpal/Desktop/astrolife/web
npx tsc --noEmit src/lib/astro-engine/gemstone.ts
# ✅ If no errors, TypeScript compatibility is verified
```

### 2️⃣ **Import Test**
Create a quick test file:

```bash
cat > test-gemstone-quick.ts << 'EOF'
import { 
  generateGemstoneReportFromChart,
  buildNatalChartFromAnyChart,
  PLANET_GEMSTONES,
  PLANET_WEARING
} from "./src/lib/astro-engine/gemstone";

// Test 1: Check if functions exist
console.log("✅ Functions imported successfully");

// Test 2: Check constants
console.log(`✅ PLANET_GEMSTONES has ${Object.keys(PLANET_GEMSTONES).length} planets`);
console.log(`✅ PLANET_WEARING has ${Object.keys(PLANET_WEARING).length} planets`);

// Test 3: Sample data
const sampleChart = {
  ascendant: "Taurus",
  ascendantDegree: 15,
  planets: [
    { planet: "Sun", sign: "Leo", degree: 20, house: 4, dignity: "own" },
    { planet: "Moon", sign: "Sagittarius", degree: 10, house: 8 },
    { planet: "Mars", sign: "Libra", degree: 25, house: 6, dignity: "enemy" },
  ]
};

// Test 4: Generate report
try {
  const report = generateGemstoneReportFromChart(sampleChart);
  console.log("✅ Report generated successfully");
  console.log(`   Primary: ${report.primaryGemstone.gemstone}`);
  console.log(`   Score: ${report.primaryGemstone.score}/100`);
  console.log(`   Avoid gems: ${report.avoidGemstones.length}`);
} catch (e) {
  console.error("❌ Error:", e);
}
EOF

npx ts-node test-gemstone-quick.ts
```

---

## Comprehensive Testing (30 minutes)

### 3️⃣ **Full Integration Test**

```ts
// test-gemstone-full.ts
import {
  generateGemstoneReportFromChart,
  buildNatalChartFromAnyChart,
  generateDashaGemstoneRecommendationsFromChart,
  SIGN_RULERS,
} from "./src/lib/astro-engine/gemstone";

console.log("🧪 Running Comprehensive Gemstone Tests...\n");

// Test Data
const testCharts = [
  {
    name: "Taurus Ascendant",
    data: {
      ascendant: "Taurus",
      ascendantDegree: 15,
      planets: [
        { planet: "Sun", sign: "Leo", degree: 20, house: 4, dignity: "own" },
        { planet: "Moon", sign: "Sagittarius", degree: 10, house: 8, dignity: "neutral" },
        { planet: "Mars", sign: "Libra", degree: 25, house: 6, dignity: "enemy" },
        { planet: "Mercury", sign: "Virgo", degree: 5, house: 5, dignity: "exalted" },
        { planet: "Jupiter", sign: "Capricorn", degree: 18, house: 9, dignity: "debilitated" },
        { planet: "Venus", sign: "Cancer", degree: 12, house: 3 },
        { planet: "Saturn", sign: "Aquarius", degree: 8, house: 10, dignity: "own" },
        { planet: "Rahu", sign: "Pisces", degree: 22, house: 11 },
        { planet: "Ketu", sign: "Virgo", degree: 22, house: 5 },
      ],
    },
  },
  {
    name: "Leo Ascendant",
    data: {
      ascendant: "Leo",
      ascendantDegree: 10,
      planets: [
        { planet: "Sun", sign: "Leo", degree: 15, house: 1, dignity: "own" },
        { planet: "Moon", sign: "Aries", degree: 20, house: 7 },
        { planet: "Mars", sign: "Scorpio", degree: 5, house: 4 },
      ],
    },
  },
];

// Test 1: Report Generation
console.log("Test 1: Report Generation");
testCharts.forEach(({ name, data }) => {
  try {
    const report = generateGemstoneReportFromChart(data);
    console.log(`  ✅ ${name}`);
    console.log(`     Primary: ${report.primaryGemstone.gemstone} (${report.primaryGemstone.score}/100)`);
    console.log(`     Secondary: ${report.secondaryGemstones.map(s => s.gemstone).join(", ")}`);
    console.log(`     Avoid: ${report.avoidGemstones.map(a => a.gemstone).join(", ")}`);
  } catch (e) {
    console.error(`  ❌ ${name}: ${e}`);
  }
});

// Test 2: Chart Building
console.log("\nTest 2: Chart Building from Raw Data");
try {
  const chart = buildNatalChartFromAnyChart(testCharts[0].data);
  console.log(`  ✅ Chart built successfully`);
  console.log(`     Ascendant: ${chart.ascendant}`);
  console.log(`     Lagna Lord: ${chart.lagnaLord}`);
  console.log(`     Planets: ${chart.planets.length}`);
} catch (e) {
  console.error(`  ❌ Error: ${e}`);
}

// Test 3: Dasha Recommendations
console.log("\nTest 3: Dasha Recommendations");
try {
  const withDasha = {
    ...testCharts[0].data,
    dasha: {
      mahadasha: "Saturn",
      antardasha: "Mercury",
    },
  };
  const dashaRecs = generateDashaGemstoneRecommendationsFromChart(withDasha);
  console.log(`  ✅ Dasha recommendations: ${dashaRecs.length} found`);
  dashaRecs.forEach(rec => {
    console.log(`     ${rec.level}: ${rec.planet} → ${rec.gemstone}`);
  });
} catch (e) {
  console.error(`  ❌ Error: ${e}`);
}

// Test 4: Sign Rulers Validation
console.log("\nTest 4: Sign Rulers");
console.log(`  ✅ All ${Object.keys(SIGN_RULERS).length} signs have rulers`);
const allPlanetsPresent = Object.values(SIGN_RULERS).every(p => p);
console.log(`  ${allPlanetsPresent ? "✅" : "❌"} All rulers assigned`);

console.log("\n✅ All tests complete!");
```

**Run it:**
```bash
npx ts-node test-gemstone-full.ts
```

---

## Real-World Testing (In Your App)

### 4️⃣ **Test in Your API Route**

If you have an API endpoint that uses gemstone logic:

```ts
// src/app/api/gemstone/test/route.ts
import { generateGemstoneReportFromChart } from "@/lib/astro-engine/gemstone";

export async function GET() {
  try {
    // Sample natal chart
    const chart = {
      ascendant: "Taurus",
      ascendantDegree: 15,
      planets: [
        { planet: "Sun", sign: "Leo", degree: 20, house: 4, dignity: "own" },
        { planet: "Moon", sign: "Sagittarius", degree: 10, house: 8 },
        { planet: "Mars", sign: "Libra", degree: 25, house: 6, dignity: "enemy" },
        { planet: "Mercury", sign: "Virgo", degree: 5, house: 5, dignity: "exalted" },
        { planet: "Jupiter", sign: "Capricorn", degree: 18, house: 9, dignity: "debilitated" },
        { planet: "Venus", sign: "Cancer", degree: 12, house: 3 },
        { planet: "Saturn", sign: "Aquarius", degree: 8, house: 10, dignity: "own" },
        { planet: "Rahu", sign: "Pisces", degree: 22, house: 11 },
        { planet: "Ketu", sign: "Virgo", degree: 22, house: 5 },
      ],
    };

    const report = generateGemstoneReportFromChart(chart);

    return Response.json({
      status: "✅ Success",
      report: {
        primary: report.primaryGemstone.gemstone,
        score: report.primaryGemstone.score,
        secondary: report.secondaryGemstones.map(s => s.gemstone),
        avoid: report.avoidGemstones.map(a => a.gemstone),
      },
    });
  } catch (error) {
    return Response.json(
      { status: "❌ Error", error: String(error) },
      { status: 500 }
    );
  }
}
```

**Test it:**
```bash
curl http://localhost:3000/api/gemstone/test
```

---

## Jest Unit Tests (Recommended)

### 5️⃣ **Create Jest Test Suite**

```bash
npm install --save-dev jest @types/jest ts-jest
```

Create `jest.config.js`:
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
};
```

Create `src/lib/astro-engine/__tests__/gemstone.test.ts`:

```ts
import {
  generateGemstoneReportFromChart,
  buildNatalChartFromAnyChart,
  PLANET_GEMSTONES,
  SIGN_RULERS,
} from "../gemstone";

describe("Gemstone Engine", () => {
  const sampleChart = {
    ascendant: "Taurus",
    ascendantDegree: 15,
    planets: [
      { planet: "Sun", sign: "Leo", degree: 20, house: 4, dignity: "own" },
      { planet: "Moon", sign: "Sagittarius", degree: 10, house: 8 },
      { planet: "Mars", sign: "Libra", degree: 25, house: 6 },
      { planet: "Mercury", sign: "Virgo", degree: 5, house: 5, dignity: "exalted" },
      { planet: "Jupiter", sign: "Capricorn", degree: 18, house: 9 },
      { planet: "Venus", sign: "Cancer", degree: 12, house: 3 },
      { planet: "Saturn", sign: "Aquarius", degree: 8, house: 10, dignity: "own" },
      { planet: "Rahu", sign: "Pisces", degree: 22, house: 11 },
      { planet: "Ketu", sign: "Virgo", degree: 22, house: 5 },
    ],
  };

  test("should generate valid gemstone report", () => {
    const report = generateGemstoneReportFromChart(sampleChart);
    expect(report).toBeDefined();
    expect(report.primaryGemstone).toBeDefined();
    expect(report.primaryGemstone.score).toBeGreaterThanOrEqual(0);
    expect(report.primaryGemstone.score).toBeLessThanOrEqual(100);
  });

  test("should have valid gemstone name", () => {
    const report = generateGemstoneReportFromChart(sampleChart);
    const validGems = Object.values(PLANET_GEMSTONES)
      .map(g => g.primary)
      .filter(g => g !== "—");
    expect(validGems).toContain(report.primaryGemstone.gemstone);
  });

  test("should have secondary recommendations", () => {
    const report = generateGemstoneReportFromChart(sampleChart);
    expect(report.secondaryGemstones).toBeDefined();
    expect(Array.isArray(report.secondaryGemstones)).toBe(true);
  });

  test("should have avoid list", () => {
    const report = generateGemstoneReportFromChart(sampleChart);
    expect(report.avoidGemstones).toBeDefined();
    expect(Array.isArray(report.avoidGemstones)).toBe(true);
  });

  test("should have all sign rulers", () => {
    expect(Object.keys(SIGN_RULERS).length).toBe(12);
  });

  test("should build natal chart from raw data", () => {
    const chart = buildNatalChartFromAnyChart(sampleChart);
    expect(chart.ascendant).toBe("Taurus");
    expect(chart.planets.length).toBe(9);
  });
});
```

**Run tests:**
```bash
npm test -- gemstone.test.ts
```

---

## Performance Testing

### 6️⃣ **Benchmark Old vs New**

```ts
// test-gemstone-performance.ts
import { generateGemstoneReportFromChart } from "./src/lib/astro-engine/gemstone";

const sampleChart = {
  ascendant: "Taurus",
  ascendantDegree: 15,
  planets: [
    { planet: "Sun", sign: "Leo", degree: 20, house: 4, dignity: "own" },
    { planet: "Moon", sign: "Sagittarius", degree: 10, house: 8 },
    { planet: "Mars", sign: "Libra", degree: 25, house: 6 },
    { planet: "Mercury", sign: "Virgo", degree: 5, house: 5, dignity: "exalted" },
    { planet: "Jupiter", sign: "Capricorn", degree: 18, house: 9 },
    { planet: "Venus", sign: "Cancer", degree: 12, house: 3 },
    { planet: "Saturn", sign: "Aquarius", degree: 8, house: 10, dignity: "own" },
    { planet: "Rahu", sign: "Pisces", degree: 22, house: 11 },
    { planet: "Ketu", sign: "Virgo", degree: 22, house: 5 },
  ],
};

console.log("🚀 Performance Benchmark\n");

const iterations = 10000;
const start = performance.now();

for (let i = 0; i < iterations; i++) {
  generateGemstoneReportFromChart(sampleChart);
}

const end = performance.now();
const duration = end - start;
const avgTime = duration / iterations;

console.log(`✅ Completed ${iterations} iterations`);
console.log(`   Total time: ${duration.toFixed(2)}ms`);
console.log(`   Average per call: ${avgTime.toFixed(4)}ms`);
console.log(`   Calls per second: ${(1000 / avgTime).toFixed(0)}`);
```

**Run benchmark:**
```bash
npx ts-node test-gemstone-performance.ts
```

---

## Summary

| Test Type | Time | Command |
|-----------|------|---------|
| **Quick** | 2min | `npx tsc --noEmit src/lib/astro-engine/gemstone.ts` |
| **Import** | 3min | `npx ts-node test-gemstone-quick.ts` |
| **Integration** | 10min | `npx ts-node test-gemstone-full.ts` |
| **Jest Suite** | 5min | `npm test -- gemstone.test.ts` |
| **Performance** | 5min | `npx ts-node test-gemstone-performance.ts` |
| **API Route** | 2min | `curl http://localhost:3000/api/gemstone/test` |

---

**Status:** ✅ Ready to test
