import type { PulseTrigger, TaraBalaModifier, ChandraBalaModifier } from "../types";

export interface MicroRemedyResult {
  behavioralReset: string;
  traditionalUpaya: string;
  durationMinutes: number;
}

export function generateMicroRemedy(
  dominantTrigger: PulseTrigger | null,
  taraBala: TaraBalaModifier,
  chandraBala: ChandraBalaModifier
): MicroRemedyResult {
  // 1. If high-tension Saturn/Sun or Saturn/Mars trigger is active
  if (dominantTrigger) {
    if (dominantTrigger.primaryPlanets.includes("Saturn") && dominantTrigger.primaryPlanets.includes("Sun")) {
      return {
        behavioralReset:
          "Agar kisi senior authority ya parivar me opinion clash ho, toh turant reply na karein. 60 seconds ka pause lein aur facts par focus karein, ego par nahi.",
        traditionalUpaya:
          "Taambe ke lote se Surya Dev ko jal arpit karein aur ghar ke helpers/workers ko bina toke samman dein.",
        durationMinutes: 1,
      };
    }

    if (dominantTrigger.primaryPlanets.includes("Saturn") && dominantTrigger.primaryPlanets.includes("Mars")) {
      return {
        behavioralReset:
          "Patience vs Urgency conflict: Jab gussa ya irritation mehsoos ho, 5 gehri saansein lein aur phone screen se 2 minute dur ho jayein.",
        traditionalUpaya:
          "Hanuman Chalisa ka ek doha padhein ya thande paani se chehre par chheente maarein.",
        durationMinutes: 1,
      };
    }

    if (dominantTrigger.primaryPlanets.includes("Saturn") && dominantTrigger.primaryPlanets.includes("Moon")) {
      return {
        behavioralReset:
          "Overthinking break: Jo baat aapko pareshan kar rahi hai use ek kagaz par likhein aur khud ko yaad dilayein ki yeh transit temporary hai.",
        traditionalUpaya:
          "Om Namah Shivaya ka 11 baar jaap karein aur chandi ke glass ya bartan me paani piyein.",
        durationMinutes: 1,
      };
    }

    if (dominantTrigger.severity === "opportunity") {
      return {
        behavioralReset:
          "Creative momentum: Aaj apne kisi bade goal ya vision par kam se kam 15 minute bina phone dekhe deep work karein.",
        traditionalUpaya:
          "Guru Mantra (Om Gurave Namah) ka 11 baar smaran karein aur kisi teacher/mentor ka aabhar vyakt karein.",
        durationMinutes: 1,
      };
    }
  }

  // 2. Sensitive Chandra/Tara Bala
  if (chandraBala.isAshtamaChandra || taraBala.quality === "caution") {
    return {
      behavioralReset:
        "Emotional grounding: Aaj koi impulsive commitment ya financial risk na lein. Routine ko simple aur calm rakhein.",
      traditionalUpaya:
        "Shiv ji ka smaran karein aur panchi/animals ko dana ya paani dein.",
      durationMinutes: 1,
    };
  }

  // 3. General baseline supportive remedy
  return {
    behavioralReset:
      "Daily alignment: Din shuru karne se pehle 30 seconds ke liye apni aakhein band karke aaj ke 3 sabse important task decide karein.",
    traditionalUpaya:
      "Gayatri Mantra ya apne ishta dev ka 3 baar shanti se smaran karein.",
    durationMinutes: 1,
  };
}

