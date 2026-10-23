/**
 * ============================================================================
 * ASTROLIFE — DASHA & NAVATARA COMPOSABLE MODIFIERS
 * ============================================================================
 * Generates:
 * 1. Macro Dasha Atmosphere (Life Season tone).
 * 2. Micro Navatara Daily Trigger (Dynamic 24h freshness clock).
 * ============================================================================
 */

export interface DashaMoodModifier {
  lord: string;
  seasonHinglish: string;
  seasonEnglish: string;
  synergyWithSaturnHinglish: string;
  synergyWithJupiterHinglish: string;
  synergyDefaultHinglish: string;
}

export const DASHA_MOODS: Record<string, DashaMoodModifier> = {
  Jupiter: {
    lord: "Jupiter",
    seasonHinglish: "Guru ka daur zindagi me bade sapne, vistar aur gyan ki disha tay karta hai.",
    seasonEnglish: "Jupiter Mahadasha establishes a macro life season of philosophical expansion and ethical ambition.",
    synergyWithSaturnHinglish: "Guru ke vistar ke sath Shani aapki ground reality aur anushasan ko test kar rahe hain — matlab sapne bade hain par kadam thos hone chahiye.",
    synergyWithJupiterHinglish: "Guru ke double prabhav se naye seekhne aur aage badhne ke raste tezi se khul rahe hain.",
    synergyDefaultHinglish: "Guru ka aashirwad aapko lambe samay ke lakshya dekhne me madad kar raha hai.",
  },
  Saturn: {
    lord: "Saturn",
    seasonHinglish: "Shani ka daur jeevan me sthirta, kadi mehnat aur purane karma ke nistaran ka samay hota hai.",
    seasonEnglish: "Saturn Mahadasha demands structural maturity, steady duty, and uncompromised perseverance.",
    synergyWithSaturnHinglish: "Shani ke apne hi daur me Gochar ka asar double karma banata hai — yahan koi shortcut nahi chalega, purani galtiyan theek karni hongi.",
    synergyWithJupiterHinglish: "Shani ke anushasan ke beech Guru ki kripa aapko sahi margdarshan aur aasha pradan karti hai.",
    synergyDefaultHinglish: "Shani aapse sabr aur continuous hard work demand karte hain.",
  },
  Mercury: {
    lord: "Mercury",
    seasonHinglish: "Budh ka daur commercial soch, analytical tezi aur communication ko prathmikta deta hai.",
    seasonEnglish: "Mercury Mahadasha accelerates commercial transactions, analytical acuity, and communicative adaptability.",
    synergyWithSaturnHinglish: "Budh ki tezi ko Shani practical boundary dete hain taaki decision jaldbazi me galat na ho.",
    synergyWithJupiterHinglish: "Budh ki chaturata aur Guru ka gyan milkar strategic decision-making ko behad majboot banate hain.",
    synergyDefaultHinglish: "Budh aapke dimaag ko naye ideas aur business opportunities me active rakhta hai.",
  },
  Venus: {
    lord: "Venus",
    seasonHinglish: "Shukra ka daur rishton, suvidha, kalatmakta aur samajik samman ka vatavaran banata hai.",
    seasonEnglish: "Venus Mahadasha cultivates relational diplomacy, aesthetic elegance, and social collaboration.",
    synergyWithSaturnHinglish: "Shukra ke aakarshan ke beech Shani practical zimmedari aur boundaries sikhate hain.",
    synergyWithJupiterHinglish: "Shukra aur Guru ka milan rishton me shuchita aur sneh ka aadan-pradaan karta hai.",
    synergyDefaultHinglish: "Shukra aapke manobal ko santusht aur kalatmak banata hai.",
  },
  Sun: {
    lord: "Sun",
    seasonHinglish: "Surya ka daur aatmasamman, leadership aur public authority ko jagata hai.",
    seasonEnglish: "The Sun Mahadasha radiates executive stewardship, personal sovereignty, and clear purpose.",
    synergyWithSaturnHinglish: "Surya ke aatmasamman aur Shani ke kartavya ke beech balance banakar hi safalta milegi.",
    synergyWithJupiterHinglish: "Surya aur Guru ka sanyog shrestha netritva aur naitikta pradan karta hai.",
    synergyDefaultHinglish: "Surya aapko front-foot par aakar lead karne ka aawahan karta hai.",
  },
  Moon: {
    lord: "Moon",
    seasonHinglish: "Chandra ka daur mansik sthiti, bhavnaon aur antarik shanti par kendrit hota hai.",
    seasonEnglish: "The Moon Mahadasha attunes your consciousness to emotional balance, domestic peace, and intuitive sensing.",
    synergyWithSaturnHinglish: "Chandra ke bhavuk man ko Shani sthirta aur reality-check se sambhalte hain.",
    synergyWithJupiterHinglish: "Chandra aur Guru ka talmel man ko shant aur santusht banaye rakhta hai.",
    synergyDefaultHinglish: "Chandra aapki sensitive intuition ko guide karta hai.",
  },
  Mars: {
    lord: "Mars",
    seasonHinglish: "Mangal ka daur sahas, action aur naye raste banane ki dynamic urja deta hai.",
    seasonEnglish: "Mars Mahadasha injects courageous momentum, competitive resolve, and decisive execution.",
    synergyWithSaturnHinglish: "Mangal ki tezi aur Shani ke thehrav ka talmel aapko anushasit sahas sikhata hai.",
    synergyWithJupiterHinglish: "Mangal ka sahas aur Guru ka gyan sahi disha me vijayi banate hain.",
    synergyDefaultHinglish: "Mangal aapko active step lene ke liye taiyar karta hai.",
  },
  Rahu: {
    lord: "Rahu",
    seasonHinglish: "Rahu ka daur naye prayog, badi aakanksha aur unconventional growth ka samay hota hai.",
    seasonEnglish: "Rahu Mahadasha unlocks unorthodox ambition, digital velocity, and lateral expansion.",
    synergyWithSaturnHinglish: "Rahu ki un-checked ambition ko Shani ka thos anushasan zameen se jode rakhta hai.",
    synergyWithJupiterHinglish: "Rahu ke vistar ko Guru ka gyan bhram se bacha kar shuddh marg par rakhta hai.",
    synergyDefaultHinglish: "Rahu aapse traditional boundaries se aage sochne ki mang karta hai.",
  },
  Ketu: {
    lord: "Ketu",
    seasonHinglish: "Ketu ka daur gehre aatm-chintan, research aur anavashyak bojh ko chhodne ka samay hai.",
    seasonEnglish: "Ketu Mahadasha fosters intuitive discernment, profound research, and shedding transient clutter.",
    synergyWithSaturnHinglish: "Ketu ka tyag aur Shani ka tapasya-bhav aapko anivaryata par focus karne me madad karte hain.",
    synergyWithJupiterHinglish: "Ketu aur Guru ka yog adhyatmik shanti aur timeless wisdom laata hai.",
    synergyDefaultHinglish: "Ketu aapko dikhata hai ki sachha sukoon kahan hai.",
  },
};

export interface TaraToneModifier {
  taraNumber: number;
  taraName: string;
  category: "favourable" | "caution" | "moderate";
  headlineHinglish: string;
  headlineEnglish: string;
  dailyGuidanceHinglish: string;
  dailyGuidanceEnglish: string;
}

export const TARA_TONES: Record<number, TaraToneModifier> = {
  1: {
    taraNumber: 1,
    taraName: "Janma",
    category: "moderate",
    headlineHinglish: "आत्म-संतुलन और संयमित गति का दिन",
    headlineEnglish: "Self-Recalibration & Steady Pacing",
    dailyGuidanceHinglish:
      "Aaj ka din apne sharir aur manobal ko steady rakhne ka hai; achanak bade risky faisle lene ke bajay regular karyon ko dhyan se karein.",
    dailyGuidanceEnglish:
      "Today calls for stabilizing personal vitality and mental poise; focus on routine consistency rather than speculative leaps.",
  },
  2: {
    taraNumber: 2,
    taraName: "Sampat",
    category: "favourable",
    headlineHinglish: "आर्थिक स्पष्टता और संसाधन विस्तार का दिन",
    headlineEnglish: "Resource Mobilization & Financial Momentum",
    dailyGuidanceHinglish:
      "Aaj Sampat prabhav ke karan financial discussions, pending payments aur commercial follow-ups aage badhane ke liye vatavaran anukool hai.",
    dailyGuidanceEnglish:
      "The Sampat frequency provides favorable momentum for advancing financial negotiations, billing follow-ups, and commercial agreements.",
  },
  3: {
    taraNumber: 3,
    taraName: "Vipat",
    category: "caution",
    headlineHinglish: "सावधानी, धैर्य और समीक्षा का दिन",
    headlineEnglish: "Tactical Pause & Deliberate Review",
    dailyGuidanceHinglish:
      "Aaj Vipat prabhav ke dauran hasty commitments aur gusse me aakar faisla lene se bachein; papers aur shabdon ko do baar verify karein.",
    dailyGuidanceEnglish:
      "Exercise tactical patience under the Vipat frequency; avoid impulsive commitments and verify contractual terms meticulously.",
  },
  4: {
    taraNumber: 4,
    taraName: "Kshema",
    category: "favourable",
    headlineHinglish: "सुरक्षा, पारिवारिक सुख और सुगम कार्यसिद्धि",
    headlineEnglish: "Grounded Security & Smooth Execution",
    dailyGuidanceHinglish:
      "Kshema prabhav se ghar aur karyakshetra me anukulata rahegi; atke hue kaam shanti aur aasan planning ke sath poore ho sakte hain.",
    dailyGuidanceEnglish:
      "The Kshema atmosphere brings serene execution and domestic harmony; complete pending tasks with relaxed, organized focus.",
  },
  5: {
    taraNumber: 5,
    taraName: "Pratyari",
    category: "caution",
    headlineHinglish: "राजनयिक धैर्य और वाणी का संयम",
    headlineEnglish: "Diplomatic Patience & Non-Confrontation",
    dailyGuidanceHinglish:
      "Pratyari urja ke dauran choti si baat par matbhed ho sakta hai; office ya parivar me bematlab bahas se bachein aur sunne par dhyan dein.",
    dailyGuidanceEnglish:
      "Navigate slight counter-currents diplomatically under the Pratyari tone; avoid unnecessary debate and focus on factual clarity.",
  },
  6: {
    taraNumber: 6,
    taraName: "Sadhaka",
    category: "favourable",
    headlineHinglish: "कार्य-सिद्धि, लक्ष्य प्राप्ति और निर्णायक फॉलो-अप",
    headlineEnglish: "Goal Attainment & Prime Execution Day",
    dailyGuidanceHinglish:
      "Sadhaka urja target execution aur achievement ko tezi deti hai; ahem logon se milne, pitch karne aur follow-up lene ka sabse proactive din hai.",
    dailyGuidanceEnglish:
      "The Sadhaka frequency provides peak alignment for decisive action; pitch high-stakes proposals and conduct key stakeholder follow-ups.",
  },
  7: {
    taraNumber: 7,
    taraName: "Vadha",
    category: "caution",
    headlineHinglish: "गंभीर सतर्कता, विश्राम और आंतरिक मौन",
    headlineEnglish: "Vigilant Guard & Emotional Stillness",
    dailyGuidanceHinglish:
      "Aaj ke din kisi bade naye project ya financial risk me hath na daalein; akele me shanti se routine kaam karein aur man ko sthir rakhein.",
    dailyGuidanceEnglish:
      "Avoid launching new ventures or high-stakes financial commitments today; conserve vital prana through quiet routine diligence.",
  },
  8: {
    taraNumber: 8,
    taraName: "Mitra",
    category: "favourable",
    headlineHinglish: "मैत्रीपूर्ण सहयोग और सौहार्दपूर्ण संवाद",
    headlineEnglish: "Friendly Collaboration & Trust Building",
    dailyGuidanceHinglish:
      "Mitra prabhav se colleagues aur dosto se sahyog milega; meetings, strategic brainstorming aur nayi partnerships ke liye din sundar hai.",
    dailyGuidanceEnglish:
      "Warm collegial support marks the Mitra atmosphere; schedule collaborative discussions, networking lunches, and creative strategy sessions.",
  },
  9: {
    taraNumber: 9,
    taraName: "Parama Mitra",
    category: "favourable",
    headlineHinglish: "परम मैत्री, उच्च विश्वास और गुरुजनों की कृपा",
    headlineEnglish: "High-Trust Alliances & Auspicious Counsel",
    dailyGuidanceHinglish:
      "Parama Mitra urja deep high-trust alliances ko aashirwad deti hai; mentors se salaah lene aur long-term agreements finalize karne ka golden window hai.",
    dailyGuidanceEnglish:
      "Deep high-trust grace illuminates the Parama Mitra frequency; seek executive mentor counsel and finalize long-term collaborative roadmaps.",
  },
};
