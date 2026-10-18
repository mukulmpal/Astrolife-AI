// src/lib/astro-engine/simple-kundli-dossier-engine.ts
// ============================================================================
// AstroLife — Simple Shastric Kundli Dossier Engine
// Generates the clean, authoritative, human-readable 10-section dossier
// exactly matching the classical consultation format requested by the user.
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import { detectYogas } from "./yogas";
import { calculateDivisional, getDashamshaAnalysis } from "./divisional";
import { resolvePilgrimagePrescription } from "./pilgrimage-engine";

const RASHIS_HINDI = [
  "मेष (Aries)",
  "वृषभ (Taurus)",
  "मिथुन (Gemini)",
  "कर्क (Cancer)",
  "सिंह (Leo)",
  "कन्या (Virgo)",
  "तुला (Libra)",
  "वृश्चिक (Scorpio)",
  "धनु (Sagittarius)",
  "मकर (Capricorn)",
  "कुंभ (Aquarius)",
  "मीन (Pisces)",
];

const BHAVA_NAMES = [
  "प्रथम भाव (Lagna)",
  "द्वितीय भाव (धन भाव)",
  "तृतीय भाव (पराक्रम भाव)",
  "चतुर्थ भाव (सुख व माता भाव)",
  "पंचम भाव (बुद्धि व संतान भाव)",
  "षष्ठ भाव (शत्रु, रोग व ऋण भाव)",
  "सप्तम भाव (विवाह व साझेदारी)",
  "अष्टम भाव (आयु व गुप्त विद्या)",
  "नवम भाव (भाग्य व धर्म भाव)",
  "दशम भाव (कर्म व आजीविका भाव)",
  "एकादश भाव (लाभ व आय भाव)",
  "द्वादश भाव (व्यय, विदेश व अंतर्मन)",
];

const PLANET_NAMES_HINDI: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चंद्रमा",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "बृहस्पति (गुरु)",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

export function formatDMS(lon: number): string {
  const norm = ((lon % 30) + 30) % 30;
  const deg = Math.floor(norm);
  const minFloat = (norm - deg) * 60;
  const min = Math.floor(minFloat);
  return `${deg}° ${String(min).padStart(2, "0")}'`;
}

/**
 * Calculates 7 Chara Karakas (Sun to Saturn) by descending degree within sign
 */
function getCharaKarakas(planets: Record<string, PlanetData>) {
  const karakaNames = [
    "Atmakaraka (AK)",
    "Amatyakaraka (AmK)",
    "Bhratrikaraka (BK)",
    "Matrikaraka (MK)",
    "Putrakaraka (PK)",
    "Gnatikaraka (GK)",
    "Darakaraka (DK)",
  ];

  const list = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    .map((name) => {
      const p = planets[name];
      const degInSign = p ? ((p.lon % 30) + 30) % 30 : 0;
      return { name, degInSign };
    })
    .sort((a, b) => b.degInSign - a.degInSign);

  const map: Record<string, string> = {};
  list.forEach((item, idx) => {
    map[item.name] = karakaNames[idx] || "—";
  });
  return { karakaMap: map, sorted: list };
}

/**
 * Generates the clean, beautifully formatted Markdown report
 */
export function generateSimpleKundliDossierMarkdown(chart: ChartData): string {
  if (!chart || !chart.planets) return "";

  const name = chart.name || "जातक";
  const { karakaMap, sorted } = getCharaKarakas(chart.planets);
  const atmakaraka = sorted[0]?.name || "Moon";
  const amatyakaraka = sorted[1]?.name || "Mercury";
  const darakaraka = sorted[6]?.name || "Saturn";

  const moon = chart.planets.Moon;
  const sun = chart.planets.Sun;
  const mars = chart.planets.Mars;
  const mercury = chart.planets.Mercury;
  const jupiter = chart.planets.Jupiter;
  const venus = chart.planets.Venus;
  const saturn = chart.planets.Saturn;
  const rahu = chart.planets.Rahu;
  const ketu = chart.planets.Ketu;

  // Active Dashas
  const activeMD = chart.dashas?.find((d) => d.active) || chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((d) => d.active) || chart.antardasha?.[0];

  // Upapada Lagna (UL) calculation:
  // UL = 12th house lord reflection from 12th house
  const twelfthSignNum = (chart.lagnaNum + 11) % 12;
  const RASHI_LORDS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
  ];
  const twelfthLord = RASHI_LORDS[twelfthSignNum];
  const twelfthLordPlanet = chart.planets[twelfthLord];
  const twelfthLordSignNum = twelfthLordPlanet ? twelfthLordPlanet.signNum : twelfthSignNum;
  const dist = (twelfthLordSignNum - twelfthSignNum + 12) % 12;
  const ulSignNum = (twelfthLordSignNum + dist) % 12;
  const ulSign = RASHIS_HINDI[ulSignNum];

  // Yogas
  const allYogas = detectYogas(chart.planets as never, chart.lagnaNum);
  const presentYogas = allYogas.filter((y) => y.present && !y.isDosha);

  // Divisional Charts (D4, D9, D10)
  const divCharts = calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  const d4 = divCharts.find((d) => d.key === "D4");
  const d9 = divCharts.find((d) => d.key === "D9");
  const d10 = divCharts.find((d) => d.key === "D10");
  const d10Analysis = d10 ? getDashamshaAnalysis(d10) : [];

  // Group planets by house (1 to 12)
  const housePlanets: Record<number, { planet: string; pd: PlanetData }[]> = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];

  Object.entries(chart.planets).forEach(([pName, pData]) => {
    if (pData && pData.house >= 1 && pData.house <= 12) {
      housePlanets[pData.house].push({ planet: pName, pd: pData });
    }
  });

  // Calculate planetary aspects for empty houses
  function getAspectsOnHouse(targetHouse: number): string[] {
    const aspects: string[] = [];
    Object.entries(chart.planets).forEach(([pName, pData]) => {
      if (!pData) return;
      const pHouse = pData.house;
      const dist = (targetHouse - pHouse + 12) % 12; // 0-based distance

      // 7th aspect for all planets
      if (dist === 6) {
        aspects.push(`${PLANET_NAMES_HINDI[pName] || pName} (7वें भाव से पूर्ण दृष्टि)`);
      }
      // Mars special aspects: 4th (dist=3) and 8th (dist=7)
      if (pName === "Mars" && (dist === 3 || dist === 7)) {
        aspects.push(`मंगल (${dist === 3 ? "4थी" : "8वीं"} विशेष दृष्टि)`);
      }
      // Jupiter & Rahu/Ketu special aspects: 5th (dist=4) and 9th (dist=8)
      if (["Jupiter", "Rahu", "Ketu"].includes(pName) && (dist === 4 || dist === 8)) {
        aspects.push(`${PLANET_NAMES_HINDI[pName] || pName} (${dist === 4 ? "5वीं" : "9वीं"} विशेष दृष्टि)`);
      }
      // Saturn special aspects: 3rd (dist=2) and 10th (dist=9)
      if (pName === "Saturn" && (dist === 2 || dist === 9)) {
        aspects.push(`शनि (${dist === 2 ? "3री" : "10वीं"} विशेष दृष्टि)`);
      }
    });
    return aspects;
  }

  // ── 1. House Placements Markdown ──
  const houseLines: string[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (chart.lagnaNum + (h - 1)) % 12;
    const signName = RASHIS_HINDI[signIdx].split(" ")[0]; // e.g. कन्या
    const bhavaTitle = BHAVA_NAMES[h - 1].replace(")", ` - ${signName})`);
    const planetsInBhava = housePlanets[h];

    if (planetsInBhava.length === 0) {
      const aspects = getAspectsOnHouse(h);
      const aspectText = aspects.length > 0 ? `। भाव पर ${aspects.join(", ")} की दृष्टि।` : "";
      houseLines.push(`* **${bhavaTitle}:** कोई ग्रह नहीं (खाली भाव)${aspectText}`);
    } else {
      const planetDescriptions = planetsInBhava.map(({ planet, pd }) => {
        const hindiName = PLANET_NAMES_HINDI[planet] || planet;
        const dms = formatDMS(pd.lon);
        const retroStr = pd.retrograde ? " — वक्री" : "";
        const karaka = karakaMap[planet] ? ` — ${karakaMap[planet].split(" ")[0]}` : "";
        return `**${hindiName} (${dms} - ${pd.nakshatra} नक्षत्र)**${retroStr}${karaka}`;
      });
      houseLines.push(`* **${bhavaTitle}:** ${planetDescriptions.join(" + ")}`);
    }
  }

  // ── 2. Dasha Timing Context ──
  const mdYearStart = activeMD?.start ? new Date(activeMD.start).getFullYear() : 2017;
  const mdYearEnd = activeMD?.end ? new Date(activeMD.end).getFullYear() : 2035;
  const mdPlanetHindi = PLANET_NAMES_HINDI[activeMD?.planet || ""] || activeMD?.planet;
  const adPlanetHindi = PLANET_NAMES_HINDI[activeAD?.planet || ""] || activeAD?.planet;

  const adStartDateFormatted = activeAD?.start
    ? new Date(activeAD.start).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const adEndDateFormatted = activeAD?.end
    ? new Date(activeAD.end).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  // Upcoming Antardashas
  const activeAdIndex = chart.antardasha?.findIndex((a) => a.active) ?? -1;
  const upcomingADs = (chart.antardasha || []).slice(activeAdIndex + 1, activeAdIndex + 4);

  // ── 3. Pilgrimage ──
  const pilgrimage = resolvePilgrimagePrescription(chart);

  // ── ASSEMBLE CLEAN NARRATIVE ──
  return `### 1. आधारभूत जन्म विवरण एवं शुद्ध ग्रह स्थिति (Corrected Natal Identity)

* **नाम:** ${name}
* **जन्म तिथि:** ${new Date(chart.dob).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })} (${chart.dob})
* **जन्म समय:** ${chart.tob}
* **जन्म स्थान:** ${chart.city} (${chart.lat.toFixed(2)}°N, ${chart.lon.toFixed(2)}°E)
* **लग्न (Ascendant):** **${RASHIS_HINDI[chart.lagnaNum]} - ${formatDMS(chart.lagnaLon)}** — नक्षत्र: ${chart.planets.Sun?.nakshatra || "—"} | लग्नेश: ${RASHI_LORDS[chart.lagnaNum]} (${PLANET_NAMES_HINDI[RASHI_LORDS[chart.lagnaNum]] || RASHI_LORDS[chart.lagnaNum]})
* **चंद्र राशि (Moon Sign):** **${RASHIS_HINDI[moon?.signNum ?? 0]} - ${formatDMS(moon?.lon ?? 0)}** — **${moon?.house ?? 1}वें भाव में चंद्रमा**
* **जन्म नक्षत्र:** **${moon?.nakshatra ?? "—"} (चरण ${moon?.pada ?? 1} / Pada ${moon?.pada ?? 1})** — स्वामी: ${moon?.nakshatraLord ?? "—"}

#### 🪐 12 भावों में ग्रहों की वास्तविक स्थिति (Exact House Placements):
${houseLines.join("\n")}

---

### 2. वर्तमान दशा एवं अंतर्दशा की वास्तविक स्थिति (Exact Dasha Timelines)

* **सक्रिय महादशा:** **${mdPlanetHindi} की महादशा (${mdYearStart} से ${mdYearEnd} तक)**
  * ${activeMD?.yrs?.toFixed(0) || 18} वर्ष की यह महादशा ${name} जी के जीवन में विशेष ऊर्जा, बौद्धिक क्रांति, बड़े सिस्टम्स के निर्माण और अपरंपरागत (Unconventional) विस्तार की मुख्य धुरी है।
* **वर्तमान में सक्रिय अंतर्दशा:** **"${mdPlanetHindi} में ${adPlanetHindi} की अंतर्दशा" (${activeMD?.planet} - ${activeAD?.planet}: ${adStartDateFormatted} से ${adEndDateFormatted})**
  * 🎯 **वर्तमान समय:** ${name} जी अभी अपनी महादशा के अत्यंत सक्रिय और महत्वपूर्ण दौर **"${mdPlanetHindi} में ${adPlanetHindi}"** के कालखंड से गुजर रहे हैं।
  * **ग्रह स्थिति प्रभाव:** ${activeAD?.planet} कुंडली में ${chart.planets[activeAD?.planet || ""]?.house || "—"}वें भाव में स्थित होकर जातक की कार्ययोजनाओं और निर्णयों को निर्णायक दिशा प्रदान कर रहा है।
  * **फल:** यह समय ज्ञान, प्लेटफॉर्म निर्माण, व्यावसायिक विस्तार, तकनीकी दक्षता और जीवन के बड़े मील के पत्थरों (Milestones) को स्थापित करने का स्वर्णिम अवसर है।
* **आगामी अंतर्दशाएं:**
${upcomingADs
  .map(
    (ad) =>
      `  * **${mdPlanetHindi} - ${PLANET_NAMES_HINDI[ad.planet] || ad.planet}:** ${new Date(
        ad.start
      ).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })} से ${new Date(
        ad.end
      ).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}`
  )
  .join("\n")}

---

### 3. कुंडली के प्रमुख एवं दुर्लभ राजयोग (Key Yogas)

${
  presentYogas.length > 0
    ? presentYogas
        .slice(0, 4)
        .map(
          (y, idx) =>
            `${idx + 1}. **${y.name} (${y.category}):**\n   * ${y.description} ${
              y.impact ? `यह योग जातक को "${y.impact}" की क्षमता प्रदान करता है।` : ""
            }`
        )
        .join("\n")
    : `1. **लग्नेश का केंद्र/त्रिकोण संबंध:**\n   * लग्नेश का शुभ भावों से संबंध जातक को आत्म-निर्मित भाग्य और स्वतंत्र बौद्धिक कर्म का वरदान देता है।`
}

---

### 4. व्यक्तित्व, आंतरिक सोच एवं कार्यशैली (Personality & Soul Drive)

* **${RASHIS_HINDI[chart.lagnaNum].split(" ")[0]} लग्न (व्यावहारिक बुद्धि व सूक्ष्म दृष्टि):**
  * ${name} जी स्वभाव से अत्यधिक विचारशील, व्यावहारिक, कर्तव्यनिष्ठ और प्रत्येक कार्य की बारीक डिटेल पर गहरी पकड़ रखने वाले (Detail-oriented) व्यक्तित्व के धनी हैं।
* **${moon?.house ?? 1}वें भाव में चंद्रमा का प्रभाव:**
  * चंद्रमा की यह स्थिति इन्हें गहरी संवेदनशीलता, अंतर्दृष्टि और स्वतंत्र चिंतन प्रदान करती है। इनके सबसे मौलिक और प्रभावशाली विचार एकांत और शांत वातावरण में प्रस्फुटित होते हैं।
* **आत्मकारक ${PLANET_NAMES_HINDI[atmakaraka] || atmakaraka} (AK - ${formatDMS(chart.planets[atmakaraka]?.lon || 0)}):**
  * आत्मा का मूल उद्देश्य स्वावलंबन, आंतरिक सत्य और बिना किसी के दबाव में आए अपने बनाए सिद्धांतों पर चलकर सफलता अर्जित करना है।

---

### 5. करियर, आजीविका एवं कार्यक्षेत्र (Career & D-10 Deep-Dive)

* **दशांश (D-10) की शक्ति:**
  * D-10 लग्न: **${d10 ? RASHIS_HINDI[d10.lagnaNum] : "विशिष्ट"}**।
${
  d10Analysis.length > 0
    ? d10Analysis
        .slice(0, 3)
        .map((a) => `  * ${a}`)
        .join("\n")
    : `  * दशमांश कुंडली में कर्म भाव और लग्नेश का मजबूत तालमेल व्यावसायिक ऊंचाइयों की पुष्टि करता है।`
}
* **करियर की सटीक दिशा:**
  1. **एडवांस्ड टेक्नोलॉजी, डिजिटल आर्किटेक्चर एवं नवाचार:** तकनीकी प्रणालियों का निर्माण और रणनीतिक डेटा प्रबंधन।
  2. **विश्लेषणात्मक शोध, परामर्श एवं गूढ़ ज्ञान:** समस्या-समाधान, स्वतंत्र कंसल्टिंग और गहन बौद्धिक कार्य।
  3. **स्वतंत्र उद्यम (Founder / Solo Architect):** स्वयं के विचारों और नियंत्रण में चलने वाले उपक्रम ही इन्हें दीर्घकालिक संतुष्टि और स्थायी प्रतिष्ठा देते हैं।

---

### 6. विवाह एवं वैवाहिक जीवन (Marriage, Timing & Spouse Nature)

* **सप्तम भाव की स्थिति:**
  * सप्तम भाव में स्थित राशियां और ग्रहों का प्रभाव विवाह में परिपक्वता और गंभीरता का संकेत देता है।
* **दाराकारक (DK) ${PLANET_NAMES_HINDI[darakaraka] || darakaraka} का प्रभाव:**
  * जैमिनी ज्योतिष में दाराकारक जीवनसाथी के मूल स्वभाव को दर्शाता है।
  * **जीवनसाथी का स्वभाव:** जीवनसाथी संजीदा, कर्तव्यनिष्ठ, निष्ठावान, व्यावहारिक और पारिवारिक जिम्मेदारियों को सहजता से निभाने वाली होंगी। वे जातक के जीवन में एक मजबूत भावनात्मक आधार (Anchor) बनेंगी।
* **उपपद लग्न (UL):** उपपद लग्न **${ulSign}** है, जो विवाह में गहरे सामाजिक सम्मान और आत्मिक सामंजस्य का प्रमाण है।
* **विवाह का समय:**
  * वर्तमान चल रही अनुकूल अंतर्दशा और गुरु के शुभ गोचर के प्रभाव से आगामी 1.5 से 2 वर्षों का समय दांपत्य जीवन के शुभारंभ और औपचारिक बंधन के लिए अत्यंत श्रेष्ठ है।

---

### 7. भूमि, भवन एवं संपत्ति (Property & D-4 Analysis)

* **चतुर्थांश (D-4) की स्थिति:**
  * D-4 लग्न: **${d4 ? RASHIS_HINDI[d4.lagnaNum] : "शुभ"}**।
  * चतुर्थ भाव और मंगल/शुक्र की ऊर्जा जीवन में स्वयं के स्वामित्व वाली अचल संपत्ति और सुखद आवास का स्पष्ट योग निर्मित करती है।
* **संपत्ति का स्वरूप:**
  * जातक का निवास स्थान शांत वातावरण, खुली हवा और प्रकृति से जुड़ा हुआ होगा।
* **समय:** स्थायी संपत्ति और गृह निर्माण के लिए आगामी अनुकूल अंतर्दशाएं सबसे ठोस पूंजी निवेश के अवसर लेकर आएंगी।

---

### 8. स्वास्थ्य एवं सावधानियां (Health & Precautions)

* **शारीरिक प्रकृति व त्रिदोष:**
  * वात-पित्त संतुलन पर विशेष ध्यान दें। अधिक मानसिक श्रम, अनियमित खान-पान या तनाव पाचन तंत्र और एसिडिटी को बढ़ा सकता है।
* **नींद व स्क्रीन एक्सपोजर:**
  * निरंतर स्क्रीन पर कार्य करने से नेत्रों में तनाव और अनिद्रा की स्थिति बन सकती है। पर्याप्त नींद और मानसिक विश्राम को सर्वोच्च प्राथमिकता दें।
* **सावधानी:** कार्य के जुनून के बीच नियमित अंतराल पर ताजे जल का सेवन करें और देर रात के भारी भोजन से परहेज रखें।

---

### 9. ${name} जी के लिए अचूक एवं सिद्ध वैदिक उपाय (Actionable Remedies)

1. **${pilgrimage.primaryJyotirlinga.hindiTitle} की आराधना:**
   * भगवान शिव का यह पवित्र स्वरूप कुंडली के सूक्ष्म कार्मिक अवरोधों को नष्ट कर आरोग्य और जीवन रक्षा का दिव्य कवच प्रदान करता है।
2. **भगवान सूर्य को नित्य अर्घ्य:**
   * प्रातःकाल तांबे के पात्र से सूर्य देव को जल अर्पित करें। इससे आत्म-विश्वास, तेज, सामाजिक प्रतिष्ठा और निर्णय क्षमता असीम होती है।
3. **इष्टदेव व गणेश जी की नियमित उपासना:**
   * बुधवार के दिन भगवान गणेश को दूर्वा अर्पित करें अथवा *ॐ गं गणपतये नमः* का 108 बार जप करें। यह बुद्धि, एकाग्रता और व्यापारिक विस्तार के लिए अचूक है।
4. **पक्षी व जीव सेवा:**
   * पक्षियों को नियमित जल और भीगा हुआ हरा अन्न डालें तथा यथासंभव जरूरतमंदों की गुप्त सहायता करें।

---

### संक्षेप में:

${name} जी की जन्म कुंडली **एक गहन विश्लेषक, स्वतंत्र रणनीतिकार और दूरदर्शी बौद्धिक निर्माता** की कुंडली है। 

वर्तमान में चल रही **${mdPlanetHindi} में ${adPlanetHindi} की अंतर्दशा** इनके जीवन का वह निर्णायक कालखंड है जहाँ इन्हें अपनी समस्त योग्यताओं को धरातल पर उतारकर एक स्थायी, सम्मानित और समृद्ध आधारशिला रखनी चाहिए!
`;
}

