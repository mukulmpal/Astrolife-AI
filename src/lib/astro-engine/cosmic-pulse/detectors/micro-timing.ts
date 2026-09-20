import type { PanchangResult } from "../../panchang";
import type { MicroTimingWindow } from "../types";

export function extractMicroTiming(panchang: PanchangResult): MicroTimingWindow {
  const abhijit = panchang.abhijitMuhurta;
  const rahuKaal = panchang.rahuKaal;

  const actionWindow = {
    name: abhijit?.name || "Abhijit Muhurta",
    start: abhijit?.start || "11:45 AM",
    end: abhijit?.end || "12:35 PM",
    guidance: "Auspicious window for initiation, important calls, trading, or signing strategic moves.",
  };

  const avoidWindow = {
    name: rahuKaal?.name || "Rahu Kaal",
    start: rahuKaal?.start || "04:30 PM",
    end: rahuKaal?.end || "06:00 PM",
    guidance: "Traditionally avoided for starting new major ventures, signing contracts, or starting long journeys.",
  };

  return {
    actionWindow,
    avoidWindow,
    learning: {
      title: "Micro-Timing: Abhijit Muhurta vs Rahu Kaal",
      sanskritTerm: "अभिजित मुहूर्त एवं राहु काल",
      howItWorks:
        "Din ke suryodaya (sunrise) se suryast (sunset) ke samay ko 15 muhurtas me baanta jata hai. 8th muhurta Abhijit Muhurta kehlata hai. Isi tarah daylight ko 8 barabar hisso me baantkar har din ek hissa Rahu Kaal hota hai.",
      whyItMatters:
        "Abhijit Muhurta bhagwan Vishnu se blessed hota hai aur bohot saare kundli dosho ko neutralize karta hai. Rahu Kaal me shuru kiya gaya karya often confusion ya obstruction face karta hai.",
      classicalRule:
        "Narada Samhita: Abhijit muhurta sarva-dosha-nashakah (sabhi dosho ka nash karta hai). Rahu Kaal shubh arambh ke liye nishiddha hai.",
    },
  };
}

