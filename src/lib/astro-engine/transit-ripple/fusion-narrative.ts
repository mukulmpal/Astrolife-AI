/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 FUSION NARRATIVE ENGINE
 * ============================================================================
 * Pure deterministic narrative synthesis with ZERO numeric scores.
 * Fuses:
 * - Dasha Climate (Mahadasha x Antardasha Navatara)
 * - Gochara Trigger (Active planetary epicenter + Parashari aspects)
 * - Multi-Ray Hotspot Intersections
 * - Strategic Guidance: 🛡️ Kahan Sambhalna Hai & 🚀 Kahan Action Lena Hai
 * - Sattvic Daily Lifestyle Upaya
 * ============================================================================
 */

import { HOUSE_NAMES } from "./aspect-profiles";
import type {
  ChapterNarrative,
  HouseImpactDetail,
  TransitPlanet,
} from "./types";
import type { TransitCalculationOutput } from "./transit-calculator";

interface PlanetThemeData {
  energyHinglish: string;
  energyEnglish: string;
  sattvicUpayaHinglish: string[];
  sattvicUpayaEnglish: string[];
}

const PLANET_THEMES: Record<TransitPlanet, PlanetThemeData> = {
  Saturn: {
    energyHinglish:
      "Shani dev ki urja anushasan, samay ki pabandi aur thos dharatal par kaam karne ki mang karti hai. Yahan koi shortcut ya jaldbazi kaam nahi karegi.",
    energyEnglish:
      "Saturn demands structural discipline, punctuality, and unwavering patience. Quick fixes and speculative shortcuts yield friction; systematic perseverance is rewarded.",
    sattvicUpayaHinglish: [
      "Physical karma: Subah uthkar sharirik shram ya yoga karein.",
      "Vani ka sanyam: Kisise bhi kathor ya aalochanaatmak shabdon me baat na karein.",
      "Seva: Kisi zarooratmand shramik ya vridh vyakti ki silent madad karein.",
    ],
    sattvicUpayaEnglish: [
      "Physical karma: Commit to grounded physical exertion or mindful yoga at dawn.",
      "Speech restraint: Consciously avoid harsh critiques or defensive rebuttals.",
      "Quiet service: Support elderly or blue-collar workers anonymously with respect.",
    ],
  },
  Jupiter: {
    energyHinglish:
      "Guru dev ki drishti amrit ke saman vistar, gyan aur satvikta laati hai. Parantu bina kriya ke sirf umeed lagana aalsya ban sakta hai.",
    energyEnglish:
      "Jupiter radiates expansive wisdom, ethical alignment, and optimistic grace. Ensure philosophical vision is paired with practical follow-through.",
    sattvicUpayaHinglish: [
      "Swadhyaya: Roz 15 minute kisi prernadayak ya adhyatmik pustak ka adhyayan karein.",
      "Guru samman: Apne shikshakon aur bado ke prati aadar vyakt karein.",
      "Daan: Kisi vidyarthi ya gyan-daan sanstha ko sahyog karein.",
    ],
    sattvicUpayaEnglish: [
      "Sacred study: Dedicate 15 minutes to philosophical or classic wisdom literature.",
      "Mentor reverence: Acknowledge and respect seniors, mentors, and parents.",
      "Education seva: Donate stationery, books, or learning support to deserving students.",
    ],
  },
  Mars: {
    energyHinglish:
      "Mangal dev ka prabhav tezi, sahas aur nirnayak karyashaili ko jagata hai. Gusse ya aavesh par niyantran rakhna zaroori hai.",
    energyEnglish:
      "Mars brings assertive courage, physical drive, and decisive execution. Direct the fire into structural work rather than emotional friction.",
    sattvicUpayaHinglish: [
      "Pranayama: Sheetali ya Anulom-Vilom se shareer ka pitta shant karein.",
      "Vyayam: Uccha urja ko daudne ya workout me channelize karein.",
      "Shaanti: Vivadon aur bahasbazi se pehle 3 lambi saans lekar rukiye.",
    ],
    sattvicUpayaEnglish: [
      "Cooling breath: Practice sheetali or alternate-nostril breathing to temper internal heat.",
      "Dynamic exercise: Channel intense adrenaline into focused athletic training.",
      "Conflict pause: Take three deliberate deep breaths before entering controversial debate.",
    ],
  },
  Rahu: {
    energyHinglish:
      "Rahu ki drishti nayi disha, digital reach aur unconventional vistar deti hai, parantu bhram aur atyadhik utsukta se savdhaan rehna chahiye.",
    energyEnglish:
      "Rahu unlocks unconventional lateral thinking and technological velocity. Ground speculative projections in real balance sheets.",
    sattvicUpayaHinglish: [
      "Digital detox: Sone se 1 ghanta pehle screens aur social media band karein.",
      "Saaf-safai: Apne electronic gadgets aur workspace ko vyavasthit karein.",
      "Bhumi sparsh: Nange pair ghaas par chalkar ground rahein.",
    ],
    sattvicUpayaEnglish: [
      "Screen discipline: Disconnect from digital monitors 60 minutes before retiring to bed.",
      "Workspace clarity: Declutter cords, computing workstations, and desk drawers.",
      "Earth grounding: Walk barefoot on morning dew or grass to ground airy volatility.",
    ],
  },
  Ketu: {
    energyHinglish:
      "Ketu dev ki urja nirlipta, gambhir shodh aur anivaryata se mukti ka sandesh deti hai. Purani aadat chhodne ka samay hai.",
    energyEnglish:
      "Ketu fosters detachment, intuitive research, and spiritual unburdening. It strips superficial attachments to illuminate fundamental truths.",
    sattvicUpayaHinglish: [
      "Dhyana: Roz 10 minute shant baithkar shoonya dhyan karein.",
      "Visarjan: Ghar se anupyogi samaan hatayein ya daan karein.",
      "Shwan seva: Gali ke kutton ko doodh ya roti khilayein.",
    ],
    sattvicUpayaEnglish: [
      "Silent contemplation: Sit in still silence for 10-15 minutes contemplating pure breath.",
      "Material release: Donate possessions that no longer serve an active, meaningful purpose.",
      "Canine feeding: Feed stray animals or community dogs with compassionate care.",
    ],
  },
  Sun: {
    energyHinglish:
      "Surya dev ki upasthiti aatmasamman, netritva aur swasthya ko shakti deti hai. Aham aur adhikaar ke anuchit prayog se bachein.",
    energyEnglish:
      "The Sun radiates vitality, executive authority, and clarity of purpose. Lead with generous grace rather than rigid egotism.",
    sattvicUpayaHinglish: [
      "Surya Arghya: Subah taambe ke lote se Surya ko jal arpit karein.",
      "Aditya Hridayam: Surya mantron ya stotra ka shant man se path karein.",
      "Pita samman: Apne pita ya shikshakon ke charan sparsh karein.",
    ],
    sattvicUpayaEnglish: [
      "Morning sun: Offer copper-vessel water to the rising sun with reverent posture.",
      "Solar reflection: Recite the Gayatri or Aditya Stotra with steady clarity.",
      "Paternal respect: Express genuine appreciation to your father, mentors, or elder statesmen.",
    ],
  },
  Venus: {
    energyHinglish:
      "Shukra dev prem, saundarya, suvidha aur kalatmakta ko badhate hain. Ati-bhog aur aalaskari aakarsan se bachein.",
    energyEnglish:
      "Venus enhances aesthetics, relational harmony, diplomacy, and graceful luxury. Balance sensual indulgence with disciplined discernment.",
    sattvicUpayaHinglish: [
      "Swachhata: Shubh safed ya sugandhit vastra dharan karein.",
      "Kala srijan: Sangeet, lekhan ya kisi kalaatmak shauk ko 20 minute dein.",
      "Stree samman: Ghar aur samaj ki mahilaon ke prati sammanpurna vyavhar rakhein.",
    ],
    sattvicUpayaEnglish: [
      "Purity & scent: Wear fresh, refined natural attire and gentle sattvic fragrance.",
      "Artistic flow: Dedicate 20 minutes to music, design, literature, or interior beautification.",
      "Feminine honor: Treat women colleagues, partners, and family members with chivalrous respect.",
    ],
  },
  Mercury: {
    energyHinglish:
      "Budh dev vaani, lekh-jokha, chaturata aur marketing me shreshta dete hain. Ek sath bhot se kaam shuru karke aadha chhodne se bachein.",
    energyEnglish:
      "Mercury sharpens commercial intellect, nuanced communication, and analytical speed. Avoid scattering focus across too many simultaneous tasks.",
    sattvicUpayaHinglish: [
      "Journaling: Roz shaam ko din bhar ki learnings aur kharche note karein.",
      "Hari sabziyan: Bhojan me taazi hari pattedar sabziyon ka sevan karein.",
      "Gau seva: Gaay ko hara chara ya palak khilayein.",
    ],
    sattvicUpayaEnglish: [
      "Daily ledger: Maintain an objective journal recording expenditures and strategic learnings.",
      "Green nourishment: Consume fresh, wholesome greens and plant-forward meals.",
      "Bovine care: Offer fresh green fodder or leafy greens to cows or animal shelters.",
    ],
  },
  Moon: {
    energyHinglish:
      "Chandra dev manobal, bhavnaon aur rojana ki manasik shanti ke karak hain. Man ke utar-chadav ko sakshibhav se dekhein.",
    energyEnglish:
      "The Moon governs mental serenity, emotional tides, and intuitive instinct. Witness psychological fluctuations with meditative poise.",
    sattvicUpayaHinglish: [
      "Jal sanyam: Chaandi ke gilaas me jal grahan karein.",
      "Mata aashirwad: Apni mataji ke charan sparsh karke din shuru karein.",
      "Shant nindra: Rat ko sone se pehle manobal ko sthir karne ke liye dhyan karein.",
    ],
    sattvicUpayaEnglish: [
      "Pure hydration: Drink clean, cool water from a silver or earthenware vessel.",
      "Maternal blessing: Seek the graceful blessing and counsel of your mother.",
      "Nighttime stillness: Practice gentle breath regulation before sleep to quiet the mind.",
    ],
  },
};

export function buildChapterNarrative(
  calc: TransitCalculationOutput,
  language: "hinglish" | "english" = "hinglish"
): ChapterNarrative {
  const {
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
  const pTheme = PLANET_THEMES[selectedPlanet] || PLANET_THEMES.Saturn;
  const focalInfo = HOUSE_NAMES[focalHouseNumber] || HOUSE_NAMES[1];
  const focalHouseName =
    language === "hinglish"
      ? `${focalInfo.sanskrit} (${focalInfo.english})`
      : focalInfo.english;

  // 1. Chapter Title
  let chapterTitle = "";
  if (language === "hinglish") {
    chapterTitle = `${selectedPlanet} भाव ${epicenterHouse} (${selPos?.signName}) · ${activeMahadasha} महादशा × ${activeAntardasha} अंतर्दशा अध्याय`;
  } else {
    chapterTitle = `The Chapter of ${selectedPlanet} in House ${epicenterHouse} (${selPos?.signName}) · ${activeMahadasha} MD × ${activeAntardasha} AD`;
  }

  // 2. Dasha x Gochar Fusion Story
  let dashaGocharFusion = "";
  if (language === "hinglish") {
    dashaGocharFusion =
      `Aap is samay ${activeMahadasha} Mahadasha aur ${activeAntardasha} Antardasha ke dauran chal rahe hain. ` +
      `Vedic jyotish ka sutra hai: "Dasha jeevan ka mausam taye karti hai, jabki Gochara (Transit) ghadi ki tarah exact event trigger karta hai." ` +
      `${
        isDashaLordActiveInTransit
          ? `Kyunki ${selectedPlanet} aapki active dasha se seedha juda hua hai, iska asar 3x zyada tezi aur pratyaksha roop se dikhai dega — ye background noise nahi hai, ye active karma execution ka samay hai.`
          : `${selectedPlanet} is samay aapke chart me background support aur testing create kar rahe hain, jo ${activeMahadasha}-${activeAntardasha} ke results ko shape karega.`
      } ` +
      `${pTheme.energyHinglish}`;
  } else {
    dashaGocharFusion =
      `You are currently living within the major season of ${activeMahadasha} Mahadasha and ${activeAntardasha} Antardasha. ` +
      `The classical Vedic principle states: "The Dasha creates the internal climate and life promise, while the Transit acts as the trigger clock delivering physical manifestation." ` +
      `${
        isDashaLordActiveInTransit
          ? `Because ${selectedPlanet} is directly ruling your active Dasha period, its transit influence is magnified threefold and operates with high acoustic volume — this is not subtle background influence, but active karmic manifestation.`
          : `${selectedPlanet} serves as a pivotal planetary architect modulating how your ${activeMahadasha}-${activeAntardasha} dasha unfolds in external circumstances.`
      } ` +
      `${pTheme.energyEnglish}`;
  }

  // 3. House Impacts Array
  const houseImpacts: HouseImpactDetail[] = [];

  // Epicenter House
  const epiHouseInfo = HOUSE_NAMES[epicenterHouse] || HOUSE_NAMES[1];
  const epiHitsCount = houseClusters[epicenterHouse]?.totalRays || 1;
  const epiIsHotspot = houseClusters[epicenterHouse]?.isHotspot || false;

  houseImpacts.push({
    house: epicenterHouse,
    planet: selectedPlanet,
    roleTag: "Epicenter",
    title:
      language === "hinglish"
        ? `भाव ${epicenterHouse} (${epiHouseInfo.sanskrit}): ${selectedPlanet} प्रत्यक्ष केंद्र`
        : `House ${epicenterHouse} (${epiHouseInfo.english}): ${selectedPlanet} Direct Epicenter`,
    text:
      language === "hinglish"
        ? `${selectedPlanet} aapke ${epicenterHouse}th house (${epiHouseInfo.english}) me sthit hain. Yahan ye aapke ${epiHouseInfo.themes
            .slice(0, 2)
            .join(" aur ")} par direct asar daal rahe hain. Yahan kisi bhi tarah ke shortcuts ya reckless execution se bachein.`
        : `${selectedPlanet} resides directly in your ${epicenterHouse}th house of ${epiHouseInfo.english}. It demands foundational grounding across ${epiHouseInfo.themes
            .slice(0, 3)
            .join(", ")}.`,
    isHotspot: epiIsHotspot,
    hitsCount: epiHitsCount,
  });

  // Aspect Target Houses
  for (const hit of selectedPlanetRipples.drishtiHits) {
    const tHouse = hit.targetHouse;
    const tHouseInfo = HOUSE_NAMES[tHouse] || HOUSE_NAMES[1];
    const tCluster = houseClusters[tHouse];
    const tHitsCount = tCluster?.totalRays || 1;
    const tIsHotspot = tCluster?.isHotspot || false;

    houseImpacts.push({
      house: tHouse,
      planet: selectedPlanet,
      roleTag: hit.aspectRule.name,
      title:
        language === "hinglish"
          ? `भाव ${tHouse} (${tHouseInfo.sanskrit}): ${selectedPlanet} की ${hit.aspectRule.name}`
          : `House ${tHouse} (${tHouseInfo.english}): ${selectedPlanet}'s ${hit.aspectRule.name}`,
      text:
        language === "hinglish"
          ? `${selectedPlanet} ki ${hit.aspectRule.name} ${tHouse}th house par pad rahi hai. ${
              tIsHotspot
                ? `Dhayan rahe: Ye ghar ek '⚡ Hotspot' hai kyunki yahan kul ${tHitsCount} planetary rays takra rahi hain. Yahan ${tHouseInfo.themes[0]} me decisive moments aayenge.`
                : `Yahan ${tHouseInfo.themes[0]} aur ${tHouseInfo.themes[1]} me focused discipline banaye rakhein.`
            }`
          : `${selectedPlanet} casts its ${hit.aspectRule.name} into your ${tHouse}th house. ${
              tIsHotspot
                ? `Note: This house is an active Multi-Ray Hotspot receiving ${tHitsCount} planetary rays. Major developments in ${tHouseInfo.themes[0]} are imminent.`
                : `Maintain disciplined diligence across ${tHouseInfo.themes[0]} and ${tHouseInfo.themes[1]}.`
            }`,
      isHotspot: tIsHotspot,
      hitsCount: tHitsCount,
    });
  }

  // 4. Defensive Cautions (🛡️ Kahan Sambhalna Hai)
  const defensiveCautions: string[] = [];
  if (language === "hinglish") {
    if (hotspotHouses.includes(2) || epicenterHouse === 2) {
      defensiveCautions.push(
        "House 2 (Dhan va Vani) par dabav hai: Kathor vani, parivarik bahas, aur bina soche-samjhe bade kharche ya risky investments se bachein."
      );
    }
    if (hotspotHouses.includes(7) || epicenterHouse === 7) {
      defensiveCautions.push(
        "House 7 (Sajhedari) par aspect hai: Business partner ya spouse ke saath un-documented agreements na karein; shanti se sunne par focus karein."
      );
    }
    if (hotspotHouses.includes(5) || epicenterHouse === 5) {
      defensiveCautions.push(
        "House 5 (Buddhi va Share Market) active hai: Satta, intraday trading ya gambling se door rahein; logic aur analysis par vishwas karein."
      );
    }
    if (hotspotHouses.includes(6) || epicenterHouse === 6) {
      defensiveCautions.push(
        "House 6 (Rog va Rin) active hai: Routine health checkup aur neend me laparwahi na bartein; bina soche karz na lein."
      );
    }
    if (defensiveCautions.length < 2) {
      defensiveCautions.push(
        `House ${focalHouseNumber} par gochara ka mukhya dabav hai — yahan lalach ya aavesh me aakar koi aakhri faisla na karein.`
      );
      defensiveCautions.push(
        "Mahadasha-Antardasha transition samay par unverified commitments se bachein."
      );
    }
  } else {
    if (hotspotHouses.includes(2) || epicenterHouse === 2) {
      defensiveCautions.push(
        "House 2 under compression: Avoid abrasive speech, family arguments, and impulsive or speculative capital deployments."
      );
    }
    if (hotspotHouses.includes(7) || epicenterHouse === 7) {
      defensiveCautions.push(
        "House 7 aspected: Ensure contractual clarity in partnerships and avoid unilateral emotional declarations."
      );
    }
    if (hotspotHouses.includes(5) || epicenterHouse === 5) {
      defensiveCautions.push(
        "House 5 activated: Avoid speculative financial gambles or get-rich-quick schemes; rely on deep technical diligence."
      );
    }
    if (hotspotHouses.includes(6) || epicenterHouse === 6) {
      defensiveCautions.push(
        "House 6 active: Protect sleep schedules and digestive rhythms; do not take on avoidable debt."
      );
    }
    if (defensiveCautions.length < 2) {
      defensiveCautions.push(
        `House ${focalHouseNumber} is receiving primary transit friction — defer non-essential irreversible decisions until next week.`
      );
      defensiveCautions.push(
        "Ensure all commitments aligned with active Dasha timing are documented in writing."
      );
    }
  }

  // 5. Offensive Opportunities (🚀 Kahan Action Lena Hai)
  const offensiveOpportunities: string[] = [];
  if (language === "hinglish") {
    if (epicenterHouse === 10 || hotspotHouses.includes(10)) {
      offensiveOpportunities.push(
        "House 10 karma ko reward karega — ruki hui professional projects ko execute karein, leadership responsibility lene ka golden window hai."
      );
    }
    if (epicenterHouse === 8 || hotspotHouses.includes(8)) {
      offensiveOpportunities.push(
        "House 8 long-term research, inheritance, aur deep strategic transformation ko support kar raha hai — focused padhai aur structural reform karein."
      );
    }
    if (hotspotHouses.includes(11) || epicenterHouse === 11) {
      offensiveOpportunities.push(
        "House 11 network expansion aur long-term financial compounding ke liye open hai — influential logon se connect karein."
      );
    }
    if (hotspotHouses.includes(3) || epicenterHouse === 3) {
      offensiveOpportunities.push(
        "House 3 bold initiatives aur nayi skills sikhne ke liye best hai — proactive outreach aur marketing campaigns initiate karein."
      );
    }
    if (offensiveOpportunities.length < 2) {
      offensiveOpportunities.push(
        `House ${epicenterHouse} me disciplined, continuous efforts lagayein — is samay daali gayi neev aane wale saalon tak lasting results degi.`
      );
    }
  } else {
    if (epicenterHouse === 10 || hotspotHouses.includes(10)) {
      offensiveOpportunities.push(
        "House 10 rewards methodical perseverance — execute stalled professional initiatives; this is a prime window for stepping into executive authority."
      );
    }
    if (epicenterHouse === 8 || hotspotHouses.includes(8)) {
      offensiveOpportunities.push(
        "House 8 favors profound research, legacy asset structuring, and fundamental life pivots — allocate focused hours to deep work."
      );
    }
    if (hotspotHouses.includes(11) || epicenterHouse === 11) {
      offensiveOpportunities.push(
        "House 11 favors high-trust network expansion and liquid wealth compounding — reach out to aligned allies and institutional partners."
      );
    }
    if (hotspotHouses.includes(3) || epicenterHouse === 3) {
      offensiveOpportunities.push(
        "House 3 empowers bold initiatives and skill acquisition — launch strategic outreach and clear, courageous communication."
      );
    }
    if (offensiveOpportunities.length < 2) {
      offensiveOpportunities.push(
        `Ground yourself in disciplined, consistent effort in House ${epicenterHouse} — foundations laid now will compound for years.`
      );
    }
  }

  // 6. Sattvic Upaya
  const sattvicUpaya =
    language === "hinglish"
      ? pTheme.sattvicUpayaHinglish
      : pTheme.sattvicUpayaEnglish;

  return {
    chapterTitle,
    dashaGocharFusion,
    activeMahadasha,
    activeAntardasha,
    isDashaLordActiveInTransit,
    focalHouseNumber,
    focalHouseName,
    houseImpacts,
    defensiveCautions,
    offensiveOpportunities,
    navataraIntelligence,
    navataraSync: navataraIntelligence.dailyTransitMoon,
    sattvicUpaya,
    language,
  };
}

