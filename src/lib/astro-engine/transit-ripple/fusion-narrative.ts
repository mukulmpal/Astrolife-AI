/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 COMPOSABLE FUSION NARRATIVE ENGINE
 * ============================================================================
 * Generates descriptive, human-centered mentorship paragraphs.
 * Completely free of astrological jargon; translates cosmic mechanics into
 * tangible 9-to-5 life situations across 5 human domains.
 *
 * Built on the Triple Clock Architecture:
 * 1. Macro Clock: Mahadasha × Antardasha Life Season
 * 2. Meso Clock: Planetary Transit Epicenter × Aspect Rays
 * 3. Micro Clock: Daily Moon Nakshatra × Navatara Frequency
 * ============================================================================
 */

import { HOUSE_NAMES } from "./aspect-profiles";
import type {
  ChapterNarrative,
  HouseImpactDetail,
  TransitPlanet,
} from "./types";
import type { TransitCalculationOutput } from "./transit-calculator";
import {
  HOUSE_HUMAN_DATA,
  HOUSE_PRIMARY_DOMAINS,
  PLANET_MODIFIERS,
  DOMAIN_META,
  type LifeDomain,
} from "./real-life-matrix";
import { getPlanetHouseRemedy } from "./remedies-matrix";
import { DASHA_MOODS, TARA_TONES } from "./dasha-tara-modifiers";
import { sanitizeAstrologicalText } from "./language-safety";
import {
  toLegacyChapterNarrative,
  type RichChapterNarrative,
  type DomainNarrativeBlock,
  type TodayPulseData,
  type FocalHotspotStory,
  type ShastraProofData,
} from "./adapter";

/**
 * Dynamically picks top 2-3 active life domains based on activated houses
 */
function getTopActiveDomains(
  activatedHouses: number[],
  maxDomains: number = 3
): LifeDomain[] {
  const scoreMap: Record<LifeDomain, number> = {
    work: 0,
    money: 0,
    relationships: 0,
    health: 0,
    inner: 0,
  };

  for (const h of activatedHouses) {
    const domains = HOUSE_PRIMARY_DOMAINS[h] || ["work", "inner"];
    domains.forEach((d, idx) => {
      // First domain receives higher weight
      scoreMap[d] += idx === 0 ? 3 : 2;
    });
  }

  // Sort domains by score descending
  const sorted = (Object.keys(scoreMap) as LifeDomain[]).sort(
    (a, b) => scoreMap[b] - scoreMap[a]
  );

  return sorted.slice(0, maxDomains);
}

export function buildChapterNarrative(
  calc: TransitCalculationOutput,
  language: "hinglish" | "english" = "hinglish"
): ChapterNarrative {
  const {
    scanDate,
    transitPositions,
    houseClusters,
    hotspotHouses,
    focalHouseNumber,
    selectedPlanet,
    selectedPlanetRipples,
    navataraIntelligence,
    activeMahadasha,
    activeAntardasha,
    isDashaLordActiveInTransit,
  } = calc;

  const selPos = transitPositions[selectedPlanet];
  const epicenterHouse = selectedPlanetRipples.epicenterHouse;
  const pModifier = PLANET_MODIFIERS[selectedPlanet] || PLANET_MODIFIERS.Saturn;
  const dashaModifier = DASHA_MOODS[activeMahadasha] || DASHA_MOODS.Jupiter;
  const taraNumber = navataraIntelligence.dailyTransitMoon.taraNumber || 1;
  const taraModifier = TARA_TONES[taraNumber] || TARA_TONES[1];
  const focalHuman = HOUSE_HUMAN_DATA[focalHouseNumber] || HOUSE_HUMAN_DATA[1];
  const epiHuman = HOUSE_HUMAN_DATA[epicenterHouse] || HOUSE_HUMAN_DATA[1];

  // Determine intensity: strong if hotspot or active dasha lord or retrograde direct tension
  const isHighIntensity =
    hotspotHouses.includes(epicenterHouse) ||
    isDashaLordActiveInTransit ||
    (houseClusters[focalHouseNumber]?.totalRays || 0) >= 2;
  const intensityTag: "mild" | "strong" = isHighIntensity ? "strong" : "mild";

  // 1. Triple Clock Today's Pulse
  const todayPulse: TodayPulseData = {
    scanDate,
    taraName: taraModifier.taraName,
    taraNumber,
    moonNakshatra: navataraIntelligence.dailyTransitMoon.transitingMoonNakshatra,
    seasonTag: `${activeMahadasha} MD × ${activeAntardasha} AD`,
    headline:
      language === "hinglish"
        ? taraModifier.headlineHinglish
        : taraModifier.headlineEnglish,
  };

  // 2. Chapter Title
  const chapterTitle =
    language === "hinglish"
      ? `${selectedPlanet} का प्रभाव: ${epiHuman.labelHinglish} · ${activeMahadasha} × ${activeAntardasha} अध्याय`
      : `The Chapter of ${selectedPlanet}: ${epiHuman.labelEnglish} · ${activeMahadasha} × ${activeAntardasha}`;

  // 3. Current Chapter Story (Descriptive 2-3 paragraphs, mentorship voice)
  let dashaGocharFusion = "";
  if (language === "hinglish") {
    const p1 = `Aap is samay ${activeMahadasha} ki Mahadasha aur ${activeAntardasha} ki Antardasha ke dauran chal rahe hain. ${dashaModifier.seasonHinglish} Is daur me ${selectedPlanet} ka prabhav aapse ${pModifier.humanToneHinglish} ki maang karta hai. ${
      selectedPlanet === "Saturn"
        ? dashaModifier.synergyWithSaturnHinglish
        : selectedPlanet === "Jupiter"
        ? dashaModifier.synergyWithJupiterHinglish
        : dashaModifier.synergyDefaultHinglish
    }`;

    const p2 = `Vartamaan sthiti me ${selectedPlanet} aapke ${epiHuman.labelHinglish} par kendrit hain. ${
      intensityTag === "strong"
        ? pModifier.strongIntensityHinglish
        : pModifier.mildIntensityHinglish
    } ${epiHuman.humanSummaryHinglish}`;

    const p3 = `Aaj ke din ka sookshma mausam Navatara ke '${taraModifier.taraName}' prabhav se nirdharit ho raha hai. ${taraModifier.dailyGuidanceHinglish} Aaj bina aavesh me aaye apne kartavya par kendrit rehna sabse labhkari siddh hoga.`;

    dashaGocharFusion = `${p1}\n\n${p2}\n\n${p3}`;
  } else {
    const p1 = `You are currently living within the major season of ${activeMahadasha} Mahadasha and ${activeAntardasha} Antardasha. ${dashaModifier.seasonEnglish} Across this phase, ${selectedPlanet} introduces an essential demand for ${pModifier.humanToneEnglish}. It calls for aligning elevated future goals with grounded daily patience.`;

    const p2 = `Presently, ${selectedPlanet} is actively focusing its gravity on your ${epiHuman.labelEnglish}. ${
      intensityTag === "strong"
        ? pModifier.strongIntensityEnglish
        : pModifier.mildIntensityEnglish
    } ${epiHuman.humanSummaryEnglish}`;

    const p3 = `Today's immediate atmospheric pulse is tuned by the '${taraModifier.taraName}' frequency. ${taraModifier.dailyGuidanceEnglish} Steady, deliberate consistency will yield far greater peace than impulsive, reactionary moves today.`;

    dashaGocharFusion = `${p1}\n\n${p2}\n\n${p3}`;
  }

  // 4. Primary Focal Hotspot Story (1 Deep, Engaging Paragraph)
  let focalHotspotStory: FocalHotspotStory;
  if (language === "hinglish") {
    focalHotspotStory = {
      house: focalHouseNumber,
      title: focalHuman.labelHinglish,
      paragraph: `Aapki kundli me is samay sabse zyada halchal ${focalHuman.labelHinglish} me bani hui hai. Yahan aapas me takra rahi grah sthitiyan yeh sanket deti hain ki aane wale dino me aapka sabse ahem faisla isi kshetr me aane wala hai. ${focalHuman.humanSummaryHinglish} Kisi bhi naye samjhote ya badlav par aage badhne se pehle shaant dimaag se facts ko do baar verify karein.`,
      whyItMatters:
        "Yeh kshetra is samay sabse zyada gravitational testing aur dynamic opportunities dono ko ek sath attract kar raha hai.",
    };
  } else {
    focalHotspotStory = {
      house: focalHouseNumber,
      title: focalHuman.labelEnglish,
      paragraph: `The highest concentration of planetary resonance is converging directly in your ${focalHuman.labelEnglish}. This convergence indicates that pivotal discussions, negotiations, or milestone decisions will demand your conscious attention here. ${focalHuman.humanSummaryEnglish} Review all ground assumptions and maintain patient clarity before taking permanent steps.`,
      whyItMatters:
        "This domain is currently receiving compounding planetary attention, magnifying both structural accountability and breakthrough potential.",
    };
  }

  // 5. 5-Domain Selection for Cautions & Actions (Top 2 to 3 domains)
  const activatedHouseNumbers = [
    epicenterHouse,
    focalHouseNumber,
    ...selectedPlanetRipples.aspectHouses,
  ];
  const topDomains = getTopActiveDomains(activatedHouseNumbers, 3);

  const domainCautions: DomainNarrativeBlock[] = [];
  const domainActions: DomainNarrativeBlock[] = [];

  for (const domain of topDomains) {
    const meta = DOMAIN_META[domain];

    // Find house matching this domain to extract specific scenario
    const matchingHouseNum =
      activatedHouseNumbers.find((h) =>
        HOUSE_PRIMARY_DOMAINS[h]?.includes(domain)
      ) || focalHouseNumber;
    const hData = HOUSE_HUMAN_DATA[matchingHouseNum] || focalHuman;

    if (language === "hinglish") {
      domainCautions.push({
        domain,
        domainName: meta.nameHinglish,
        icon: meta.icon,
        paragraph: `${hData.cautionThemeHinglish} Kisi ke behkawe me aakar ya emotional dawab me koi hasty commitment na karein; 24 ghante ka self-reflection rule zaroor apnayein.`,
      });

      domainActions.push({
        domain,
        domainName: meta.nameHinglish,
        icon: meta.icon,
        paragraph: `${hData.actionThemeHinglish} Jo baat ya proposal pichhle kuch dino se atka tha, aaj uspar polite aur professional follow-up aage badhane ke liye vatavaran sahayak hai.`,
      });
    } else {
      domainCautions.push({
        domain,
        domainName: meta.nameEnglish,
        icon: meta.icon,
        paragraph: `${hData.cautionThemeEnglish} Avoid rushed commitments under temporary emotional pressure; adhere to a steady 24-hour reflection rule before finalizing non-essential decisions.`,
      });

      domainActions.push({
        domain,
        domainName: meta.nameEnglish,
        icon: meta.icon,
        paragraph: `${hData.actionThemeEnglish} Advance stalled dialogues or proposals with disciplined, courteous follow-up; persistent clarity will unlock forward momentum.`,
      });
    }
  }

  // 6. House Impacts Array (Refined with human descriptions)
  const houseImpacts: HouseImpactDetail[] = [];

  // Epicenter
  const epiHitsCount = houseClusters[epicenterHouse]?.totalRays || 1;
  const epiIsHotspot = houseClusters[epicenterHouse]?.isHotspot || false;

  houseImpacts.push({
    house: epicenterHouse,
    planet: selectedPlanet,
    roleTag: "Epicenter",
    title:
      language === "hinglish"
        ? `भाव ${epicenterHouse}: ${selectedPlanet} प्रत्यक्ष केंद्र`
        : `House ${epicenterHouse}: ${selectedPlanet} Direct Epicenter`,
    text:
      language === "hinglish"
        ? `${selectedPlanet} is samay ${epiHuman.labelHinglish} me sthit hain. ${epiHuman.humanSummaryHinglish}`
        : `${selectedPlanet} is currently residing directly in your ${epiHuman.labelEnglish}. ${epiHuman.humanSummaryEnglish}`,
    isHotspot: epiIsHotspot,
    hitsCount: epiHitsCount,
  });

  // Aspects
  for (const hit of selectedPlanetRipples.drishtiHits) {
    const tHouse = hit.targetHouse;
    const tHuman = HOUSE_HUMAN_DATA[tHouse] || HOUSE_HUMAN_DATA[1];
    const tCluster = houseClusters[tHouse];
    const tHitsCount = tCluster?.totalRays || 1;
    const tIsHotspot = tCluster?.isHotspot || false;

    houseImpacts.push({
      house: tHouse,
      planet: selectedPlanet,
      roleTag: hit.aspectRule.name,
      title:
        language === "hinglish"
          ? `भाव ${tHouse}: ${selectedPlanet} की ${hit.aspectRule.name}`
          : `House ${tHouse}: ${selectedPlanet}'s ${hit.aspectRule.name}`,
      text:
        language === "hinglish"
          ? `${selectedPlanet} ka prabhav ${tHuman.labelHinglish} par pad raha hai. ${
              tIsHotspot
                ? `Yahan aapas me ${tHitsCount} planetary prabhav takra rahe hain — yeh ek sakriya focal kshetra hai jahan naye nirnay aayenge.`
                : `${tHuman.humanSummaryHinglish}`
            }`
          : `${selectedPlanet}'s aspect extends into your ${tHuman.labelEnglish}. ${
              tIsHotspot
                ? `This house is receiving ${tHitsCount} intersecting planetary rays, marking it as a prime focal center for strategic decisions.`
                : `${tHuman.humanSummaryEnglish}`
            }`,
      isHotspot: tIsHotspot,
      hitsCount: tHitsCount,
    });
  }

  // 7. Shastra Proof Behind the Scenes Data
  const shastraProof: ShastraProofData = {
    epicenter: {
      planet: selectedPlanet,
      house: epicenterHouse,
      sign: selPos?.rashi || 0,
      signName: selPos?.signName || "Aries",
      degrees: selPos?.degreeInRashi || 0,
    },
    aspectRays: selectedPlanetRipples.drishtiHits.map((h) => ({
      targetHouse: h.targetHouse,
      rule: h.aspectRule.name,
      isHotspot: hotspotHouses.includes(h.targetHouse),
    })),
    activeMahadasha,
    activeAntardasha,
    navataraCalculation: `Natal Moon ${navataraIntelligence.dailyTransitMoon.birthNakshatra} -> Transiting Moon ${navataraIntelligence.dailyTransitMoon.transitingMoonNakshatra} = Tara #${taraNumber} (${taraModifier.taraName})`,
  };

  // 8. Planet × House Specific Sattvic Remedies
  const sattvicUpaya = getPlanetHouseRemedy(
    selectedPlanet,
    epicenterHouse,
    language
  );

  // 9. Legacy formatted string arrays for complete backward-compatibility
  const defensiveCautions = domainCautions.map(
    (c) => `${c.icon} ${c.domainName}: ${c.paragraph}`
  );
  const offensiveOpportunities = domainActions.map(
    (a) => `${a.icon} ${a.domainName}: ${a.paragraph}`
  );

  const rawRichNarrative: RichChapterNarrative = {
    chapterTitle: sanitizeAstrologicalText(chapterTitle),
    dashaGocharFusion: sanitizeAstrologicalText(dashaGocharFusion),
    activeMahadasha,
    activeAntardasha,
    isDashaLordActiveInTransit,
    focalHouseNumber,
    focalHouseName: focalHuman.labelHinglish,
    houseImpacts,
    defensiveCautions,
    offensiveOpportunities,
    navataraIntelligence,
    navataraSync: navataraIntelligence.dailyTransitMoon,
    sattvicUpaya,
    language,
    todayPulse,
    focalHotspotStory,
    domainCautions,
    domainActions,
    shastraProof,
  };

  return toLegacyChapterNarrative(rawRichNarrative);
}
