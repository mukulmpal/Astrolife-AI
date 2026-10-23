import type { PlanetName } from "../../transits";
import type { PulseTrigger, AspectEvidence, EducationalConcept, LifeArea } from "../types";

export interface PlanetCoord {
  name: PlanetName;
  longitude: number;
  house: number;
  speed?: number;
}

export const MEAN_DAILY_SPEED: Record<PlanetName, number> = {
  Moon: 13.176,
  Mercury: 1.383,
  Venus: 1.200,
  Sun: 0.9856,
  Mars: 0.524,
  Jupiter: 0.083,
  Saturn: 0.033,
  Rahu: -0.053,
  Ketu: -0.053,
};

export function angularDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function calculateAspectKinematics(
  p1: PlanetCoord,
  p2: PlanetCoord,
  targetAngle: number
): {
  rawAngle: number;
  currentOrb: number;
  isApplying: boolean;
  lifecycle: "peak" | "approaching" | "separating";
} {
  const v1 = p1.speed !== undefined && Number.isFinite(p1.speed) ? p1.speed : (MEAN_DAILY_SPEED[p1.name] ?? 1.0);
  const v2 = p2.speed !== undefined && Number.isFinite(p2.speed) ? p2.speed : (MEAN_DAILY_SPEED[p2.name] ?? 0.0);

  const getOrbAtOffset = (dtDays: number): number => {
    const l1 = (((p1.longitude + v1 * dtDays) % 360) + 360) % 360;
    const l2 = (((p2.longitude + v2 * dtDays) % 360) + 360) % 360;
    const diff = (l2 - l1 + 360) % 360;
    const distFromTarget = Math.abs(diff - targetAngle);
    return distFromTarget > 180 ? 360 - distFromTarget : distFromTarget;
  };

  const currentOrb = getOrbAtOffset(0);
  const nextOrb = getOrbAtOffset(0.01);
  const isApplying = nextOrb < currentOrb - 1e-7;

  let lifecycle: "peak" | "approaching" | "separating";
  if (currentOrb <= 0.75) {
    lifecycle = "peak";
  } else if (isApplying) {
    lifecycle = "approaching";
  } else {
    lifecycle = "separating";
  }

  const rawAngle = (p2.longitude - p1.longitude + 360) % 360;

  return { rawAngle, currentOrb, isApplying, lifecycle };
}

interface AspectRule {
  targetAngle: number;
  label: string;
  orbMax: number;
  isSymmetric: boolean;
  appliesTo: (source: PlanetName, target: PlanetName) => boolean;
  educationalConcept: (source: PlanetName, target: PlanetName) => EducationalConcept;
  interpretConflict: (source: PlanetCoord, target: PlanetCoord) => {
    title: string;
    headline: string;
    severity: "critical" | "caution" | "opportunity";
    lifeAreas: LifeArea[];
    guidance: string;
    precaution: string;
    action: string;
  };
}

const ASPECT_RULES: AspectRule[] = [
  // 1. Samasaptaka (180° Mutual Opposition)
  {
    targetAngle: 180,
    label: "7th Mutual Aspect (Samasaptaka)",
    orbMax: 3.5,
    isSymmetric: true,
    appliesTo: (p1, p2) => {
      return (
        (p1 === "Sun" && p2 === "Saturn") ||
        (p1 === "Saturn" && p2 === "Sun") ||
        (p1 === "Mars" && p2 === "Saturn") ||
        (p1 === "Saturn" && p2 === "Mars") ||
        (p1 === "Sun" && p2 === "Rahu") ||
        (p1 === "Mars" && p2 === "Rahu")
      );
    },
    educationalConcept: (p1, p2) => ({
      title: "Samasaptaka: 180° Direct Planetary Opposition",
      sanskritTerm: "समसप्तक दृष्टि (Samasaptaka Drishti)",
      howItWorks:
        "Jab do graha kundli me ek doosre se 7th house (theek aamne-saamne, 180° par) aate hain, toh dono graha ek doosre par purna (100%) drishti daalte hain.",
      whyItMatters:
        "Jab do shatru graha (jaise Surya aur Shani) aamne-saamne aate hain, toh dono ki cosmic energies aapas me takrati hain. Surya aatma aur authority hai, Shani karma aur patience hai — is collision se ego aur delay ka friction banta hai.",
      classicalRule:
        "Classical Parashari Principle: Sabhi graha apne 7th sthan ko purna drishti se dekhte hain. Shatru grahon ki 7th drishti sthirta me chunauti deti hai.",
    }),
    interpretConflict: (p1, p2) => {
      const pair = [p1.name, p2.name].sort().join("-");
      if (pair === "Saturn-Sun") {
        return {
          title: `Sun (${p1.name === "Sun" ? p1.house : p2.house}H) ☍ Saturn (${p1.name === "Saturn" ? p1.house : p2.house}H) Direct Opposition`,
          headline: "Ego vs Responsibility Tension Active",
          severity: "critical",
          lifeAreas: ["career", "relationships", "health"],
          guidance:
            "Surya (Authority/Ego) aur Shani (Patience/Labor) aamne-saamne hain. Senior authorities, pita ya business partner ke sath opinion difference ho sakta hai.",
          precaution:
            "Agli kuch dino tak kisi bhi legal, contract ya ego-driven argument me impulsive stand na lein. Delay ko rejection na samjhein.",
          action: "Subah Surya ko arghya dein aur workers/helpers ke sath vinamra rahein.",
        };
      }
      if (pair === "Mars-Saturn") {
        return {
          title: `Mars (${p1.name === "Mars" ? p1.house : p2.house}H) ☍ Saturn (${p1.name === "Saturn" ? p1.house : p2.house}H) Friction Axis`,
          headline: "Impulsive Action vs Heavy Resistance",
          severity: "critical",
          lifeAreas: ["career", "health", "mindset"],
          guidance:
            "Mangal aag (speed/anger) hai aur Shani baraf (resistance/brake). Yeh combination ek hi waqt accelerator aur brake dabane jaisa pressure banata hai.",
          precaution: "Driving me jaldbazi na karein, heavy physical fatigue se bachein aur anger ko physical workout me channelize karein.",
          action: "Crucial emails aur verbal responses ko 1 ghanta hold par rakhkar reply karein.",
        };
      }
      return {
        title: `${p1.name} ☍ ${p2.name} Opposition`,
        headline: "Planetary Axis Tension",
        severity: "caution",
        lifeAreas: ["mindset"],
        guidance: `${p1.name} aur ${p2.name} 180° aamne-saamne hain, jisse psychological duality banti hai.`,
        precaution: "Impulsive decisions avoid karein.",
        action: "Patience aur structured routine follow karein.",
      };
    },
  },

  // 2. Mars Special Aspect: 4th (90°) & 8th (210°)
  {
    targetAngle: 90,
    label: "Mars 4th Special Aspect",
    orbMax: 3.0,
    isSymmetric: false,
    appliesTo: (p1, p2) => p1 === "Mars" && (p2 === "Saturn" || p2 === "Sun"),
    educationalConcept: () => ({
      title: "Mangal ki Vishesh Chaturtha Drishti (4th Aspect)",
      sanskritTerm: "मंगल की विशेष दृष्टि",
      howItWorks:
        "Vedic astrology me Mangal, Brihaspati aur Shani ke paas 7th ke alawa special drishti hoti hai. Mangal apne sthan se 4th aur 8th house ko bhi purna drishti se dekhta hai.",
      whyItMatters:
        "Mangal ki 4th drishti domestic peace, property aur mental calm par direct force dalti hai.",
      classicalRule:
        "Classical Parashari Principle: Mangal 4th aur 8th house ko vishesh purna drishti se prabhavit karta hai.",
    }),
    interpretConflict: (p1, p2) => ({
      title: `Mars 4th Aspect on ${p2.name}`,
      headline: "Aggressive Force on Structural Stability",
      severity: "caution",
      lifeAreas: ["home", "career"],
      guidance: "Mars ki 4th drishti inner restlessness aur sudden pressure banati hai.",
      precaution: "Ghar ya property decisions me gusse me aakar faisla na lein.",
      action: "Pranayama aur cooling hydration karein.",
    }),
  },

  // 3. Saturn Special Aspect: 3rd (60°) & 10th (270°)
  {
    targetAngle: 60,
    label: "Saturn 3rd Special Aspect",
    orbMax: 3.0,
    isSymmetric: false,
    appliesTo: (p1, p2) => p1 === "Saturn" && (p2 === "Sun" || p2 === "Mars" || p2 === "Moon"),
    educationalConcept: () => ({
      title: "Shani ki Vishesh Tritiya Drishti (3rd Aspect)",
      sanskritTerm: "शनि की तृतीय दृष्टि",
      howItWorks:
        "Shani Dev apne sthan se 3rd aur 10th house ko vishesh purna drishti se dekhte hain.",
      whyItMatters:
        "Shani ki 3rd drishti effort, communication aur self-initiative ko disciplined aur pariksha me daal sakti hai.",
      classicalRule:
        "Classical Parashari Principle: Shani 3rd aur 10th sthan par vishesh purna prabhav rakhta hai.",
    }),
    interpretConflict: (p1, p2) => ({
      title: `Saturn 3rd Aspect on ${p2.name}`,
      headline: "Slow & Steady Work Required",
      severity: "caution",
      lifeAreas: ["career", "education"],
      guidance: `Shani ki 3rd drishti ${p2.name} par hai, jisse hard work ka demand badh jata hai.`,
      precaution: "Shortcuts na apnayein; har step ko verify karein.",
      action: "Pending documents aur files complete karein.",
    }),
  },
];

export function detectPlanetaryConflicts(
  planets: PlanetCoord[]
): PulseTrigger[] {
  const triggers: PulseTrigger[] = [];
  const n = planets.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const p1 = planets[i];
      const p2 = planets[j];

      for (const rule of ASPECT_RULES) {
        // Prevent duplicate symmetric triggers (e.g. Sun-Saturn vs Saturn-Sun for 180° opposition)
        if (rule.isSymmetric && p1.name > p2.name) continue;

        if (!rule.appliesTo(p1.name, p2.name)) continue;

        const { currentOrb, isApplying, lifecycle } = calculateAspectKinematics(
          p1,
          p2,
          rule.targetAngle
        );

        if (currentOrb <= rule.orbMax) {
          const interpretation = rule.interpretConflict(p1, p2);
          const evidence: AspectEvidence = {
            aspectType: rule.label,
            planetA: p1.name,
            planetB: p2.name,
            longitudeA: Number(p1.longitude.toFixed(2)),
            longitudeB: Number(p2.longitude.toFixed(2)),
            exactAspectDeg: rule.targetAngle,
            currentOrbDeg: Number(currentOrb.toFixed(2)),
            isApplying,
            shastraReference: "Classical Parashari Framework (Graha Drishti Siddhanta)",
          };

          triggers.push({
            id: `conflict-${p1.name}-${p2.name}-${rule.targetAngle}`,
            title: interpretation.title,
            headline: interpretation.headline,
            severity: interpretation.severity,
            lifecycle,
            primaryPlanets: [p1.name, p2.name],
            lifeAreas: interpretation.lifeAreas,
            activatedHouses: [p1.house, p2.house],
            orbDescription: `${currentOrb.toFixed(2)}° from exact ${rule.targetAngle}° (${lifecycle.toUpperCase()})`,
            evidence,
            learning: rule.educationalConcept(p1.name, p2.name),
            guidance: interpretation.guidance,
            action: interpretation.action,
            precaution: interpretation.precaution,
          });
        }
      }
    }
  }

  return triggers;
}
