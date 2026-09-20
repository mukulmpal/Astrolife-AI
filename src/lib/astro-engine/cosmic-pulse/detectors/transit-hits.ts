import type { PlanetName } from "../../transits";
import type { PulseTrigger, AspectEvidence, LifeArea } from "../types";
import { angularDiff, MEAN_DAILY_SPEED } from "./planetary-conflict";

export interface HitPair {
  transitPlanet: PlanetName;
  transitLongitude: number;
  transitHouse: number;
  natalPlanet: PlanetName;
  natalLongitude: number;
  natalHouse: number;
  transitSpeed?: number;
}

export function detectTransitHits(pairs: HitPair[]): PulseTrigger[] {
  const triggers: PulseTrigger[] = [];

  for (const pair of pairs) {
    const orb = angularDiff(pair.transitLongitude, pair.natalLongitude);
    // Major conjunction orb threshold
    const maxOrb = pair.transitPlanet === "Moon" || pair.natalPlanet === "Moon" ? 2.0 : 3.0;

    if (orb <= maxOrb) {
      // Relative motion for transit hit against static natal longitude
      const speed = pair.transitSpeed !== undefined && Number.isFinite(pair.transitSpeed)
        ? pair.transitSpeed
        : (MEAN_DAILY_SPEED[pair.transitPlanet] ?? 1.0);

      const nextLon = (((pair.transitLongitude + speed * 0.01) % 360) + 360) % 360;
      const nextOrb = angularDiff(nextLon, pair.natalLongitude);
      const isApplying = nextOrb < orb - 1e-7;

      let lifecycle: "peak" | "approaching" | "separating";
      if (orb <= 0.75) {
        lifecycle = "peak";
      } else if (isApplying) {
        lifecycle = "approaching";
      } else {
        lifecycle = "separating";
      }

      // 1. Saturn over Natal Moon
      if (pair.transitPlanet === "Saturn" && pair.natalPlanet === "Moon") {
        triggers.push({
          id: "transit-hit-saturn-moon",
          title: "Transit Saturn Conjunction Natal Moon",
          headline: "Chandra-Shani Intensity Window (Sade Sati Core)",
          severity: "critical",
          lifecycle,
          primaryPlanets: ["Saturn", "Moon"],
          lifeAreas: ["mindset", "health", "home"],
          activatedHouses: [pair.transitHouse],
          orbDescription: `${orb.toFixed(2)}° orb (${lifecycle.toUpperCase()})`,
          evidence: {
            aspectType: "Conjunction (Yuti 0°)",
            planetA: "Saturn",
            planetB: "Moon",
            longitudeA: Number(pair.transitLongitude.toFixed(2)),
            longitudeB: Number(pair.natalLongitude.toFixed(2)),
            exactAspectDeg: 0,
            currentOrbDeg: Number(orb.toFixed(2)),
            isApplying,
            shastraReference: "Classical Vedic Gochara Framework (Janma Rashi Shani Gochara)",
          },
          learning: {
            title: "Chandra-Shani Yuti (Moon-Saturn Conjunction)",
            sanskritTerm: "चन्द्र-शनि संजोग (Chandra-Shani Yuti)",
            howItWorks:
              "Moon aapke man, bhavnaon aur comfort zone ko darshata hai. Jab Shani Dev gochar me janma ke Moon ke upar aate hain, toh man par ek serious, heavy aur reflective environment create hota hai.",
            whyItMatters:
              "Is time par overthinking aur akelepan ka feeling common hota hai, lekin yeh phase soul ko mentally invincible aur highly mature banata hai.",
            classicalRule:
              "Classical Gochara Principle: Janma Rashi par Shani ka gochar man ko discipline aur self-reliance sikhata hai.",
          },
          guidance:
            "Emotional decisions lene me jaldbaazi na karein. Sleep schedule aur hydration par dhyan dein. Purane unresolved karmic matters surface ho sakte hain.",
          action: "Rozana Om Namah Shivaya ka 11 baar jaap karein aur meditation karein.",
          precaution: "Negative self-talk aur isolated rehne se bachein; reliable dosto se connect karein.",
        });
      }

      // 2. Jupiter over Natal Sun
      if (pair.transitPlanet === "Jupiter" && pair.natalPlanet === "Sun") {
        triggers.push({
          id: "transit-hit-jupiter-sun",
          title: "Transit Jupiter Conjunction Natal Sun",
          headline: "Guru-Surya Aura Expansion Window",
          severity: "opportunity",
          lifecycle,
          primaryPlanets: ["Jupiter", "Sun"],
          lifeAreas: ["career", "wealth", "spirituality"],
          activatedHouses: [pair.transitHouse],
          orbDescription: `${orb.toFixed(2)}° orb (${lifecycle.toUpperCase()})`,
          evidence: {
            aspectType: "Conjunction (Yuti 0°)",
            planetA: "Jupiter",
            planetB: "Sun",
            longitudeA: Number(pair.transitLongitude.toFixed(2)),
            longitudeB: Number(pair.natalLongitude.toFixed(2)),
            exactAspectDeg: 0,
            currentOrbDeg: Number(orb.toFixed(2)),
            isApplying,
            shastraReference: "Classical Vedic Gochara Framework (Guru Surya Yuti Siddhanta)",
          },
          learning: {
            title: "Guru-Surya Sanjog: Wisdom Meets Authority",
            sanskritTerm: "गुरु-सूर्य युति (Guru-Surya Yuti)",
            howItWorks:
              "Brihaspati gyan, vistar aur devtaon ke guru hain, jabki Surya aatma aur rajkiya samman hai. Jab Jupiter gochar me Natal Sun ke upar se nikalta hai, toh yeh vyakti ke samman aur recognition ko amplify karta hai.",
            whyItMatters:
              "Senior officials se blessing milne aur long-term career growth ke vision clear hone ka yeh golden period hota hai.",
            classicalRule:
              "Classical Gochara Principle: Surya par Guru ka gochar dharam aur kirti (fame) ki vriddhi karta hai.",
          },
          guidance:
            "Apne career vision ko scale karne ka yeh behtareen samay hai. Mentors, teachers aur seniors se guidance lein.",
          action: "Guru Mantra ya Gayatri Mantra ka dhyan karein.",
          precaution: "Ego ya arrogance se bachein; humility se success double hoti hai.",
        });
      }

      // 3. Jupiter over Natal Moon (Gajakesari pulse)
      if (pair.transitPlanet === "Jupiter" && pair.natalPlanet === "Moon") {
        triggers.push({
          id: "transit-hit-jupiter-moon",
          title: "Transit Jupiter Conjunction Natal Moon",
          headline: "Gajakesari Transit Blessing Active",
          severity: "opportunity",
          lifecycle,
          primaryPlanets: ["Jupiter", "Moon"],
          lifeAreas: ["wealth", "relationships", "mindset"],
          activatedHouses: [pair.transitHouse],
          orbDescription: `${orb.toFixed(2)}° orb (${lifecycle.toUpperCase()})`,
          evidence: {
            aspectType: "Conjunction (Yuti 0°)",
            planetA: "Jupiter",
            planetB: "Moon",
            longitudeA: Number(pair.transitLongitude.toFixed(2)),
            longitudeB: Number(pair.natalLongitude.toFixed(2)),
            exactAspectDeg: 0,
            currentOrbDeg: Number(orb.toFixed(2)),
            isApplying,
            shastraReference: "Classical Vedic Gochara Framework (Gajakesari Gochara Siddhanta)",
          },
          learning: {
            title: "Gajakesari Gochar Pulse",
            sanskritTerm: "गजकेसरी गोचर (Gajakesari Gochar)",
            howItWorks:
              "Jab Jupiter gochar me Natal Moon ke sath yuti karta hai ya Kendra me hota hai, toh Gajakesari ka shubh prabhav jagrat hota hai.",
            whyItMatters:
              "Emotional peace, parivarik shanti aur naye investment/savings plans ke liye yeh ek naturally protected window hai.",
            classicalRule:
              "Classical Gochara Principle: Chandra-Guru yuti sadbuddhi aur samriddhi pradan karti hai.",
          },
          guidance: "Man shant aur creative rahega. Wisdom-based decision lene ke liye best day hai.",
          action: "Kisi shubh karyakram ya family decision ki shuruat karein.",
        });
      }
    }
  }

  return triggers;
}
