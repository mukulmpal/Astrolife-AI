import type { DashaMilestone } from "../types";

export interface DashaEntry {
  planet: string;
  start: Date | string;
  end: Date | string;
  active?: boolean;
}

export function detectDashaMilestones(
  dashas: DashaEntry[],
  antardashas: DashaEntry[],
  currentDate = new Date()
): DashaMilestone | null {
  const now = currentDate.getTime();

  // 1. Check active Mahadasha and next Mahadasha
  let activeMdIndex = dashas.findIndex((d) => {
    const s = new Date(d.start).getTime();
    const e = new Date(d.end).getTime();
    return now >= s && now <= e;
  });

  if (activeMdIndex === -1) {
    activeMdIndex = dashas.findIndex((d) => Boolean(d.active));
  }

  if (activeMdIndex !== -1) {
    const activeMd = dashas[activeMdIndex];
    const mdEndTime = new Date(activeMd.end).getTime();
    const daysUntilMdEnd = Math.max(0, Math.ceil((mdEndTime - now) / (1000 * 60 * 60 * 24)));

    if (daysUntilMdEnd >= 0 && daysUntilMdEnd <= 90) {
      const nextMd = dashas[activeMdIndex + 1];
      const nextLord = nextMd?.planet ?? "Next Cycle";
      const endDate = new Date(activeMd.end);
      const transitionDate = `${endDate.getUTCDate()} ${endDate.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} ${endDate.getUTCFullYear()}`;

      return {
        type: "mahadasha_sandhi",
        currentLord: activeMd.planet,
        nextLord,
        daysRemaining: daysUntilMdEnd,
        transitionDate,
        headline: daysUntilMdEnd === 0
          ? `Mahadasha Transitioning Today (${activeMd.planet} ➔ ${nextLord})`
          : `Mahadasha Sandhi Window (${activeMd.planet} ➔ ${nextLord})`,
        guidance: daysUntilMdEnd === 0
          ? `Aapka ${activeMd.planet} Mahadasha cycle aaj poora hokar ${nextLord} Mahadasha me pravesh kar raha hai. Naye dasha yog ko dhairya ke sath swikar karein.`
          : `Aapka ${activeMd.planet} Mahadasha cycle agle ${daysUntilMdEnd} dino me samapt hokar ${nextLord} Mahadasha shuru hone wali hai. Yeh life ka major pivot phase hai.`,
        learning: {
          title: "Dasha Sandhi & Chidra Dasha Transition",
          sanskritTerm: "दशा संधि / छिद्र दशा (Dasha Sandhi)",
          howItWorks:
            "Jab ek 6 se 20 saal ki lambi Mahadasha samapt hone wali hoti hai, toh aakhiri kuch mahine 'Dasha Sandhi' kehlate hain. Isme purana karmic chapter close hota hai aur naye graha ka prabhav shuru hota hai.",
          whyItMatters:
            "Is transition period me purane patterns, relationships ya career directions me sudden endings ya closures dekhne ko milte hain. Is dauran stability aur inner patience sabse important hoti hai.",
          classicalRule:
            "Classical Parashari Principle: Dasha ke ant bhag (Chidra) me graha apne bache hue karma release karta hai, isliye is samay naye risky ventures se bachein.",
        },
      };
    }
  }

  // 2. Check active Antardasha shift (within 30 days)
  let activeAdIndex = antardashas.findIndex((ad) => {
    const s = new Date(ad.start).getTime();
    const e = new Date(ad.end).getTime();
    return now >= s && now <= e;
  });

  if (activeAdIndex === -1) {
    activeAdIndex = antardashas.findIndex((ad) => Boolean(ad.active));
  }

  if (activeAdIndex !== -1) {
    const activeAd = antardashas[activeAdIndex];
    const adEndTime = new Date(activeAd.end).getTime();
    const daysUntilAdEnd = Math.max(0, Math.ceil((adEndTime - now) / (1000 * 60 * 60 * 24)));

    if (daysUntilAdEnd >= 0 && daysUntilAdEnd <= 30) {
      const nextAd = antardashas[activeAdIndex + 1];
      const nextLord = nextAd?.planet ?? "Next Cycle";
      const endDate = new Date(activeAd.end);
      const transitionDate = `${endDate.getUTCDate()} ${endDate.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} ${endDate.getUTCFullYear()}`;

      return {
        type: "antardasha_shift",
        currentLord: activeAd.planet,
        nextLord,
        daysRemaining: daysUntilAdEnd,
        transitionDate,
        headline: daysUntilAdEnd === 0
          ? `Antardasha Transitioning Today: ${activeAd.planet} ➔ ${nextLord}`
          : `Antardasha Shift Ahead: ${activeAd.planet} ➔ ${nextLord}`,
        guidance: daysUntilAdEnd === 0
          ? `${activeAd.planet} Antardasha aaj poori hokar ${nextLord} shuru ho rahi hai.`
          : `${activeAd.planet} Antardasha agle ${daysUntilAdEnd} dino me complete hokar ${nextLord} me enter karegi. Timing aur focus shift hone wala hai.`,
        learning: {
          title: "Antardasha Transition (Sub-Period Shift)",
          sanskritTerm: "अन्तर्दशा परिवर्तन (Antardasha Parivartan)",
          howItWorks:
            "Mahadasha life ka macro climate tay karti hai, jabki Antardasha us climate ke andar exact season (weather) control karti hai.",
          whyItMatters:
            "Antardasha badalne par daily routine, priorities aur focus area naturally shift hote hain.",
          classicalRule:
            "Classical Parashari Principle: Antardasha nath Mahadasha nath ke sath milkar hi shubh ya ashubh fal pradan karta hai.",
        },
      };
    }
  }

  return null;
}
