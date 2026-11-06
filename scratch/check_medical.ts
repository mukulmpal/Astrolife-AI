import { calculateChart } from "../src/lib/astro-engine/calculations";
import { runMedicalEngine } from "../src/lib/astro-engine/health";

const chart = calculateChart("Rachna", "1994-04-11", "11:00", "Delhi");
const assessment = runMedicalEngine(chart, { evaluationDate: new Date("2024-11-05") });

console.log("Cure Modality:", JSON.stringify(assessment.personalCureModality, null, 2));
console.log("Modality Symbolism:", JSON.stringify(assessment.explainability?.modalitySymbolism, null, 2));
console.log("Scorecard:", JSON.stringify(assessment.scorecard, null, 2));

