import { runGemstoneMedicalMasterEngineV2 } from "../src/lib/astro-engine/gemstone-medical-master-v2";

const report = runGemstoneMedicalMasterEngineV2({
  nativeName: "Test Native",
  ascendant: "Taurus",
  moonSign: "Sagittarius",
  dasha: {
    mahadasha: "Saturn",
    antardasha: "Mercury",
  },
  userFocus: ["career", "wealth", "health"],
  includeFamousCaseStudies: true,
  planets: [
    { planet: "Sun", sign: "Leo", house: 4, dignity: "own", shadbala: 1.1 },
    { planet: "Moon", sign: "Sagittarius", house: 8, dignity: "neutral", afflictedBy: ["Saturn"] },
    { planet: "Mars", sign: "Libra", house: 6, dignity: "enemy" },
    { planet: "Mercury", sign: "Virgo", house: 5, dignity: "exalted", shadbala: 1.4 },
    { planet: "Jupiter", sign: "Capricorn", house: 9, dignity: "debilitated" },
    { planet: "Venus", sign: "Cancer", house: 3, dignity: "neutral" },
    { planet: "Saturn", sign: "Aquarius", house: 10, dignity: "own", shadbala: 1.5 },
    { planet: "Rahu", sign: "Pisces", house: 11 },
    { planet: "Ketu", sign: "Virgo", house: 5 },
  ],
});

console.log(report.primaryRecommendation?.gemstone);
console.log(report.finalBookStyleConclusion.slice(0, 300));
