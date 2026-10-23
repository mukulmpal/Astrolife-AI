import type { Language, SafetyLevel } from "./nakshatra-tree-remedy-engine";
import { generateRemedyNarrative } from "./practical-remedy-narrative-engine";
import { generateNakshatraTreeNarrative } from "./nakshatra-tree-remedy-engine";

export type DashaRemedyInput = {
  mahadashaPlanet: string;
  antardashaPlanet?: string;
  moonNakshatra?: string;
  activeLalKitabPlanet?: string;
  language?: Language;
};

export type DashaRemedyTimingResult = {
  activePeriod: string;
  priorityPlanet: string;
  safetyLevel: SafetyLevel;
  timingNarrative: string;
  planetRemedyNarrative: string;
  nakshatraTreeNarrative?: string;
  caution: string;
};

function choosePriorityPlanet(input: DashaRemedyInput) {
  return input.activeLalKitabPlanet || input.antardashaPlanet || input.mahadashaPlanet;
}

export function analyzeDashaRemedyTiming(
  input: DashaRemedyInput
): DashaRemedyTimingResult {
  const language = input.language || "hinglish";
  const priorityPlanet = choosePriorityPlanet(input);

  const activePeriod = input.antardashaPlanet
    ? `${input.mahadashaPlanet} Mahadasha - ${input.antardashaPlanet} Antardasha`
    : `${input.mahadashaPlanet} Mahadasha`;

  const planetRemedyNarrative = generateRemedyNarrative(priorityPlanet, language);

  const nakshatraTreeNarrative = input.moonNakshatra
    ? generateNakshatraTreeNarrative(input.moonNakshatra, language).narrative
    : undefined;

  const timingNarrative =
    language === "hindi"
      ? `वर्तमान अवधि ${activePeriod} है। इस समय ${priorityPlanet} से जुड़े जीवन विषय अधिक सक्रिय महसूस हो सकते हैं। उपायों में सबसे पहले सुरक्षित दैनिक अभ्यास, व्यवहार सुधार, अनुशासन और भावनात्मक संतुलन को प्राथमिकता दें।`
      : language === "english"
        ? `The current period is ${activePeriod}. During this time, themes connected with ${priorityPlanet} may feel more active. Remedy priority should begin with safe daily practices, behavioral correction, discipline and emotional balance.`
        : `Current period ${activePeriod} chal raha hai. Is time ${priorityPlanet} se connected themes zyada active feel ho sakte hain. Remedy priority hamesha safe daily practices, behavior correction, discipline aur emotional balance se start honi chahiye.`;

  const caution =
    language === "hindi"
      ? "दान, धातु, रत्न या 43-दिन वाले उपाय बिना पूरी chart validation के न करें।"
      : language === "english"
        ? "Donation, metals, gemstones or 43-day practices should not be used without full chart validation."
        : "Donation, metals, gemstones ya 43-day remedies bina full chart validation ke nahi karne chahiye.";

  return {
    activePeriod,
    priorityPlanet,
    safetyLevel: "safe",
    timingNarrative,
    planetRemedyNarrative,
    nakshatraTreeNarrative,
    caution,
  };
}
