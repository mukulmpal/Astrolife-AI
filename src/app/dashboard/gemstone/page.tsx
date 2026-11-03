"use client";


import { useMemo, useState, useSyncExternalStore } from "react";
import { EngineIntro } from "@/components/engine/engine-intro";
import { PremiumFeature } from "@/components/premium-feature";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import {

  runGemstoneMedicalMasterEngineV2,
  type GemstoneMedicalInput,
  type GemstoneMedicalMasterReport,
  type GemstoneReportItem,
  type GemStatus,
  type Planet,
  type Sign,
  type Dignity,
} from "@/lib/astro-engine/gemstone-medical-master-v2";
import {
  RUDRAKSHA_MUKHI,
  getAllRudrakshas,
  findRudrakshaForProblem,
  getRudrakshaData,
  type RudrakshaData,
} from "@/lib/astro-engine/gemstone";
import { EngineStateCard } from "@/components/engine-state-card";

// ─── Adapter ──────────────────────────────────────────────────────────────────

const VALID_PLANETS = new Set<string>(["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]);

function mapDignity(d: string): Dignity {
  if (!d || d === "—") return "neutral";
  const l = d.toLowerCase();
  if (l.startsWith("exalted")) return "exalted";
  if (l === "debilitated") return "debilitated";
  if (l === "moolatrikona") return "moolatrikona";
  if (l === "own") return "own";
  return "neutral";
}

function chartToMedicalInput(chart: unknown): GemstoneMedicalInput | null {
  if (!chart || typeof chart !== "object") return null;
  const c = chart as Record<string, unknown>;
  const ascendant = c.lagnaRashi as Sign | undefined;
  if (!ascendant) return null;

  const planetsObj = c.planets as Record<string, Record<string, unknown>> | undefined;
  if (!planetsObj) return null;

  const planets: GemstoneMedicalInput["planets"] = [];
  for (const [name, pd] of Object.entries(planetsObj)) {
    if (!VALID_PLANETS.has(name)) continue;
    planets.push({
      planet: name as Planet,
      sign: (pd.sign as Sign) ?? "Aries",
      house: (pd.house as number) ?? 1,
      degree: pd.degree as number | undefined,
      nakshatra: pd.nakshatra as string | undefined,
      dignity: mapDignity((pd.dignity as string) ?? ""),
      isRetrograde: (pd.retrograde as boolean) ?? false,
    });
  }

  const dashasArr = c.dashas as Array<Record<string, unknown>> | undefined;
  const antarArr = c.antardasha as Array<Record<string, unknown>> | undefined;

  let mahadasha: Planet | undefined;
  let antardasha: Planet | undefined;

  if (Array.isArray(dashasArr) && dashasArr.length) {
    const active = dashasArr.find((d) => d.active) ?? dashasArr[0];
    if (active?.planet) mahadasha = active.planet as Planet;
  }
  if (Array.isArray(antarArr) && antarArr.length) {
    const active = antarArr.find((d) => d.active) ?? antarArr[0];
    if (active?.planet) antardasha = active.planet as Planet;
  }

  const moonSign = planetsObj["Moon"]?.sign as Sign | undefined;

  return {
    nativeName: c.name as string | undefined,
    ascendant,
    moonSign,
    planets,
    dasha: mahadasha ? { mahadasha, antardasha } : undefined,
  };
}

// ─── Visual helpers ───────────────────────────────────────────────────────────

const PLANET_HEX: Record<string, string> = {
  Sun: "#E85D04", Moon: "#A8B9D0", Mars: "#CC2200", Mercury: "#50C878",
  Jupiter: "#F5C542", Venus: "#E8D4F0", Saturn: "#6B5CA5",
  Rahu: "#4B0082", Ketu: "#8B6914",
};

const STATUS_HEX: Record<GemStatus, string> = {
  highly_recommended: "#15803D",
  recommended: "#1D4ED8",
  supportive: "#B45309",
  use_carefully: "#C2410C",
  avoid: "#DC2626",
};

const STATUS_LABEL: Record<GemStatus, string> = {
  highly_recommended: "Highly Recommended",
  recommended: "Recommended",
  supportive: "Supportive",
  use_carefully: "Use Carefully",
  avoid: "Avoid",
};

function hexFor(item: GemstoneReportItem): string {
  return PLANET_HEX[item.planet] ?? "#C8A030";
}


// ─── Star background ──────────────────────────────────────────────────────────

const STAR_POINTS = [
  { x: 8, y: 12, r: 1.2, o: 0.42 }, { x: 18, y: 28, r: 0.8, o: 0.32 },
  { x: 28, y: 8, r: 1.1, o: 0.38 }, { x: 41, y: 18, r: 0.7, o: 0.28 },
  { x: 52, y: 34, r: 1.4, o: 0.45 }, { x: 66, y: 12, r: 0.9, o: 0.34 },
  { x: 78, y: 26, r: 1.2, o: 0.4 }, { x: 88, y: 9, r: 0.8, o: 0.3 },
  { x: 11, y: 62, r: 1.1, o: 0.35 }, { x: 23, y: 76, r: 0.9, o: 0.3 },
  { x: 36, y: 58, r: 1.3, o: 0.42 }, { x: 49, y: 82, r: 0.8, o: 0.28 },
  { x: 61, y: 66, r: 1.2, o: 0.38 }, { x: 74, y: 88, r: 0.7, o: 0.3 },
  { x: 92, y: 70, r: 1.1, o: 0.36 },
];

// ─── UI components ────────────────────────────────────────────────────────────

function GemIcon({ color, size = 96 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`gem-grad-${color.replace("#", "")}`} cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.72" />
          <stop offset="42%" stopColor={color} stopOpacity="0.92" />
          <stop offset="100%" stopColor={color} stopOpacity="0.38" />
        </radialGradient>
      </defs>
      <polygon points="50,8 82,35 70,76 30,76 18,35" fill={`url(#gem-grad-${color.replace("#", "")})`} />
      <polygon points="50,8 82,35 50,26" fill="white" fillOpacity="0.16" />
      <polygon points="50,8 18,35 50,26" fill="white" fillOpacity="0.1" />
      <polygon points="30,76 70,76 50,92" fill={color} fillOpacity="0.62" />
      <polygon points="50,26 82,35 70,76 30,76 18,35" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="gem-score">
      <div><span style={{ width: `${score}%`, background: color }} /></div>
      <strong>{score}%</strong>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="gem-meta-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: GemStatus }) {
  const hex = STATUS_HEX[status];
  return (
    <span className="gem-status-badge" style={{ color: hex, background: `${hex}22`, borderColor: `${hex}55` }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function PrimaryGemHero({ gem }: { gem: GemstoneReportItem }) {
  const hex = hexFor(gem);
  return (
    <section className="gem-hero-card" style={{ borderColor: `${hex}45` }}>
      <div className="gem-glow" style={{ background: hex }} />
      <GemIcon color={hex} size={120} />
      <div className="gem-hero-info">
        <div className="gem-label-row">
          <StatusBadge status={gem.status} />
          <ScoreBar score={gem.score} color={STATUS_HEX[gem.status]} />
        </div>
        <h2>{gem.gemstone}</h2>
        <p className="gem-alt">{gem.sanskritName} · Alt: {gem.substitute}</p>
        <div className="gem-meta-grid">
          <MetaPill label="Planet" value={gem.planet} />
          <MetaPill label="Colour" value={gem.colour} />
          <MetaPill label="Confidence" value={`${gem.confidence}%`} />
          <MetaPill label="Status" value={STATUS_LABEL[gem.status]} />
        </div>
        <p className="gem-reason">{gem.shortVerdict}</p>
      </div>
    </section>
  );
}

function TextSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="gem-panel">
      <h3>{title}</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
    </div>
  );
}

function AnalysisTab({ gem }: { gem: GemstoneReportItem }) {
  return (
    <div className="gem-analysis-grid">
      <TextSection title="Why AstroLife Recommends It" body={gem.whyAstroLifeRecommendsIt} />
      <TextSection title="Scoring Explanation" body={gem.scoringExplanation} />
      <TextSection title="Book-Style Interpretation" body={gem.bookStyleInterpretation} />
      <TextSection title="Expected Benefits" body={gem.expectedBenefits} />
      <div className="gem-panel">
        <h3>Score Breakdown</h3>
        <div className="gem-table">
          {gem.scoreComponents.map((sc) => (
            <div key={sc.label}>
              <span>{sc.label}</span>
              <strong style={{ color: sc.points >= 0 ? "#15803D" : "#DC2626" }}>
                {sc.points >= 0 ? "+" : ""}{sc.points}
              </strong>
            </div>
          ))}
        </div>
      </div>
      <TextSection title="Health & Psychology" body={gem.healthAndPsychologyConnection} />
    </div>
  );
}

function WearingTab({ gem }: { gem: GemstoneReportItem }) {
  return (
    <div className="gem-grid-two">
      <TextSection title="Wearing Guidance" body={gem.wearingGuidance} />
      <TextSection title="Caution & Avoidance" body={gem.cautionOrAvoidance} />
      <div className="gem-panel" style={{ gridColumn: "1 / -1" }}>
        <h3>Alternative Remedies</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{gem.alternativeRemedies}</p>
      </div>
    </div>
  );
}

function DashaTab({ gem }: { gem: GemstoneReportItem }) {
  return (
    <div className="gem-grid-two">
      <TextSection title="Dasha Timing Interpretation" body={gem.dashaTimingInterpretation} />
      <div className="gem-panel">
        <h3>PDF Summary</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{gem.pdfReadyParagraph}</p>
      </div>
    </div>
  );
}

function SecondaryGemCard({ gem }: { gem: GemstoneReportItem }) {
  const hex = hexFor(gem);
  return (
    <div className="gem-secondary-card" style={{ borderColor: `${hex}35` }}>
      <GemIcon color={hex} size={70} />
      <div>
        <StatusBadge status={gem.status} />
        <h3>{gem.gemstone}</h3>
        <p>{gem.planet} · {gem.colour}</p>
        <ScoreBar score={gem.score} color={STATUS_HEX[gem.status]} />
        <p className="gem-card-reason">{gem.shortVerdict}</p>
      </div>
    </div>
  );
}

function SecondaryTab({ report }: { report: GemstoneMedicalMasterReport }) {
  const all = [...report.secondaryRecommendations, ...report.supportiveRecommendations];
  if (!all.length) {
    return <div className="gem-empty">No secondary gemstones found for this chart.</div>;
  }
  return (
    <div className="gem-secondary-grid">
      {all.map((gem) => <SecondaryGemCard key={gem.planet} gem={gem} />)}
    </div>
  );
}

function AvoidTab({ report }: { report: GemstoneMedicalMasterReport }) {
  const avoid = report.avoidList;
  const careful = report.useCarefullyList;

  return (
    <div className="gem-analysis-grid">
      {careful.length > 0 && (
        <div className="gem-panel">
          <h3>Use Carefully</h3>
          <div className="gem-avoid-list">
            {careful.map((gem) => (
              <div key={gem.planet} className="gem-avoid-row">
                <div className="gem-avoid-icon" style={{ color: STATUS_HEX.use_carefully, background: `${STATUS_HEX.use_carefully}22` }}>⚠</div>
                <div>
                  <strong>{gem.gemstone}</strong>
                  <span> · {gem.planet}</span>
                  <p>{gem.cautionOrAvoidance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {avoid.length > 0 && (
        <div className="gem-panel caution">
          <h3>Avoid These</h3>
          <div className="gem-avoid-list">
            {avoid.map((gem) => (
              <div key={gem.planet} className="gem-avoid-row">
                <div className="gem-avoid-icon">⊗</div>
                <div>
                  <strong>{gem.gemstone}</strong>
                  <span> · {gem.planet}</span>
                  <p>{gem.cautionOrAvoidance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!avoid.length && !careful.length && (
        <div className="gem-empty">No specific avoid list for this chart.</div>
      )}
    </div>
  );
}

function MedicalTab({ report }: { report: GemstoneMedicalMasterReport }) {
  const m = report.medicalAwareness;
  return (
    <div className="gem-analysis-grid">
      <TextSection title="Constitutional Profile" body={m.constitutionalProfile} />
      <TextSection title="Wellness Interpretation" body={m.wellnessInterpretation} />
      {m.findings.length > 0 && (
        <div className="gem-panel" style={{ gridColumn: "1 / -1" }}>
          <h3>Planetary Health Indicators</h3>
          <div className="gem-medical-findings">
            {m.findings.map((f) => (
              <div key={`${f.planet}-${f.house}`} className={`gem-finding gem-finding-${f.severity}`}>
                <div className="gem-finding-header">
                  <strong>{f.title}</strong>
                  <span>{f.symbolicBodyArea}</span>
                </div>
                <p>{f.paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <TextSection title="Preventive Guidance" body={m.preventiveGuidance} />
      <div className="gem-panel caution">
        <h3>Medical Disclaimer</h3>
        <p>{m.medicalDisclaimer}</p>
      </div>
    </div>
  );
}

// ─── Rudraksha Intelligence Tab ───────────────────────────────────────────────

const RUDRAKSHA_CATALOG: Record<string, {
  mukhi: string;
  sanskritName: string;
  deity: string;
  mantra: string;
  benefits: string;
  relevance: string;
  metal: string;
}> = {
  Sun: {
    mukhi: "1 Mukhi (एक मुखी)",
    sanskritName: "Eka Mukhi",
    deity: "Lord Shiva (साक्षात शिव स्वरूप)",
    mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
    benefits: "आत्मबल, नेतृत्व क्षमता, सूर्य जैसा तेज, पिता का सुख एवं हृदय व नेत्र स्वास्थ्य।",
    relevance: "सूर्य के आत्मिक प्रभाव को जागृत करता है और अंतरात्मा को असीम स्थिरता देता है।",
    metal: "स्वर्ण (Gold) अथवा लाल रेशमी धागा",
  },
  Moon: {
    mukhi: "2 Mukhi (दो मुखी)",
    sanskritName: "Dvi Mukhi",
    deity: "Ardhanarishvara (अर्धनारीश्वर - शिव-पार्वती स्वरूप)",
    mantra: "ॐ नमः (Om Namah) / ॐ सों सोमाय नमः",
    benefits: "मानसिक शांति, भावनात्मक संतुलन, दांपत्य सामंजस्य एवं अनिद्रा, भय व अवसाद (Depression) की शांति।",
    relevance: "चंद्रमा के अशांत व संवेदनशील मन को अमृतमयी शीतलता और आत्म-संयम प्रदान करता है।",
    metal: "शुद्ध चांदी (Silver) अथवा श्वेत रेशमी धागा",
  },
  Mars: {
    mukhi: "3 Mukhi (तीन मुखी)",
    sanskritName: "Tri Mukhi",
    deity: "Lord Agni (अग्नि देव)",
    mantra: "ॐ क्लीं नमः (Om Kleem Namah)",
    benefits: "आलस्य का नाश, पराक्रम, आत्मविश्वास, रक्त शुद्धि एवं हीनभावना (Inferiority Complex) से मुक्ति।",
    relevance: "मंगल के उग्र तेज को सात्विक साहस और क्रियाशीलता में रूपांतरित करता है।",
    metal: "तांबा (Copper) अथवा पीला/लाल धागा",
  },
  Mercury: {
    mukhi: "4 Mukhi (चार मुखी)",
    sanskritName: "Chatur Mukhi",
    deity: "Lord Brahma (चतुरानन ब्रह्मा जी)",
    mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
    benefits: "तार्किक बुद्धि, स्मरण शक्ति, वाक-सिद्धि, शिक्षा, अनुसंधान एवं नसों/तंत्रिका तंत्र का संतुलन।",
    relevance: "लग्नेश बुध की बौद्धिक मेधा, निर्णय क्षमता और व्यापारिक सफलता को कई गुना बढ़ाता है।",
    metal: "चांदी अथवा हरा/लाल रेशमी धागा",
  },
  Jupiter: {
    mukhi: "5 Mukhi (पंच मुखी)",
    sanskritName: "Pancha Mukhi",
    deity: "Kalagni Rudra (कालाग्नि रुद्र)",
    mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
    benefits: "सर्व-कल्याणकारी, ज्ञान, गुरु कृपा, उच्च विचार, रक्तचाप नियंत्रण एवं आध्यात्मिक उन्नति।",
    relevance: "देवगुरु बृहस्पति के सात्विक आशीर्वाद से समाज में मान-सम्मान और नैतिक नेतृत्व दिलाता है।",
    metal: "पंचधातु, स्वर्ण अथवा पीला धागा",
  },
  Venus: {
    mukhi: "6 Mukhi (छह मुखी)",
    sanskritName: "Shan Mukhi",
    deity: "Lord Kartikeya (भगवान कार्तिकेय)",
    mantra: "ॐ ह्रीं हुं नमः (Om Hreem Hum Namah)",
    benefits: "आकर्षण, वैवाहिक सौहार्द, कलात्मक प्रतिभा, पौरुष बल एवं विलासिता में स्थिरता।",
    relevance: "शुक्र के भौतिक व दांपत्य सुखों को संतुलित और पवित्र बनाता है।",
    metal: "चांदी अथवा सफेद/चमकीला धागा",
  },
  Saturn: {
    mukhi: "7 Mukhi (सात मुखी)",
    sanskritName: "Sapta Mukhi",
    deity: "Goddess Mahalakshmi (महालक्ष्मी एवं सप्तर्षि)",
    mantra: "ॐ हुं नमः (Om Hum Namah)",
    benefits: "दरिद्रता का नाश, स्थिर लक्ष्मी, शनि साढ़ेसाती/ढैया में सुरक्षा, हड्डियों व जोड़ों को बल।",
    relevance: "शनि के कठोर अनुशासन को कर्म-सिद्धि और आर्थिक स्थिरता में परिवर्तित करता है।",
    metal: "चांदी अथवा काला/नीला रेशमी धागा",
  },
  Rahu: {
    mukhi: "8 Mukhi (आठ मुखी)",
    sanskritName: "Ashta Mukhi",
    deity: "Lord Ganesha & Bhairava (विघ्नहर्ता गणेश)",
    mantra: "ॐ हुं नमः (Om Hum Namah) / ॐ रां राहवे नमः",
    benefits: "अचानक विपत्तियों से रक्षा, राहु के भ्रम व पैनिक अटैक की शांति, कोर्ट-कचहरी व शत्रुओं पर विजय।",
    relevance: "राहु के भय, फोबिया, अनिद्रा और विषैले मानसिक लूप को जड़ से शांत करता है।",
    metal: "चांदी अथवा स्लेटी/धूमिल रेशमी धागा",
  },
  Ketu: {
    mukhi: "9 Mukhi (नौ मुखी)",
    sanskritName: "Nava Mukhi",
    deity: "Goddess Durga (नवदुर्गा - शक्ति स्वरूपा)",
    mantra: "ॐ ह्रीं हुं नमः (Om Hreem Hum Namah)",
    benefits: "अकाल मृत्यु का भय दूर, अदम्य साहस, तंत्र-बाधा से रक्षा, केतु की आध्यात्मिक सिद्धि।",
    relevance: "केतु के रहस्यमयी प्रभावों को दिव्य शक्ति और आत्मबल में रूपांतरित करता है।",
    metal: "पंचधातु अथवा नारंगी/भूरा धागा",
  },
};

function RudrakshaTab({
  primary,
  input,
}: {
  primary: GemstoneReportItem;
  input: GemstoneMedicalInput | null;
}) {
  const primaryRudraksha = RUDRAKSHA_CATALOG[primary.planet] ?? RUDRAKSHA_CATALOG.Mercury;
  const mdPlanet = input?.dasha?.mahadasha;
  const adPlanet = input?.dasha?.antardasha;
  const mdRudraksha = mdPlanet ? RUDRAKSHA_CATALOG[mdPlanet] : null;
  const adRudraksha = adPlanet ? RUDRAKSHA_CATALOG[adPlanet] : null;

  // State for Problem Solver search & Category filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "health" | "wealth" | "protection" | "relationship" | "intellect">("all");
  const [selectedMukhiTab, setSelectedMukhiTab] = useState<number | "rare">(1);

  const allMukhis = useMemo(() => getAllRudrakshas(), []);

  // Filtered Rudrakshas based on category and search
  const filteredProblems = useMemo(() => {
    let list = allMukhis;
    if (selectedCategory === "health") {
      list = list.filter((r) => [1, 2, 3, 5, 6, 7, 16, 18, 19].includes(r.mukhi));
    } else if (selectedCategory === "wealth") {
      list = list.filter((r) => [7, 8, 12, 13, 17, 18, 19, 21].includes(r.mukhi));
    } else if (selectedCategory === "protection") {
      list = list.filter((r) => [8, 9, 10, 11, 14, 16, 20].includes(r.mukhi));
    } else if (selectedCategory === "relationship") {
      list = list.filter((r) => [2, 6, 13].includes(r.mukhi));
    } else if (selectedCategory === "intellect") {
      list = list.filter((r) => [4, 6, 8, 14, 17].includes(r.mukhi));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter((r) =>
        r.nameHindi.toLowerCase().includes(q) ||
        r.nameEnglish.toLowerCase().includes(q) ||
        r.problemsSolved.some((p) => p.toLowerCase().includes(q)) ||
        r.healthBenefits.some((h) => h.toLowerCase().includes(q)) ||
        r.materialBenefits.some((m) => m.toLowerCase().includes(q)) ||
        r.bestFor.some((b) => b.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allMukhis, selectedCategory, searchQuery]);

  // Rare Sacred Rudraksha types
  const rareTypes = [
    {
      name: "गौरी-शंकर रुद्राक्ष (Gauri Shankar)",
      deity: "भगवान शिव एवं माँ पार्वती (Ardhanarishvara)",
      planet: "चंद्रमा (Moon)",
      mantra: "ॐ गौरीशंकराय नमः (Om Gauri Shankaraye Namah)",
      purpose: "पति-पत्नी में अटूट प्रेम, शीघ्र विवाह, दांपत्य कलह से मुक्ति एवं निःसंतान दंपतियों को संतान सुख।",
      rarity: "Very Rare",
    },
    {
      name: "गणेश रुद्राक्ष (Ganesha Rudraksha)",
      deity: "विघ्नहर्ता भगवान श्री गणेश",
      planet: "राहु एवं केतु",
      mantra: "ॐ गं गणपतये नमः (Om Gam Ganapataye Namaha)",
      purpose: "कार्यों में आने वाली अप्रत्याशित बाधाओं का समूल नाश, बौद्धिक मेधा, रिद्धि-सिद्धि व व्यापारिक सफलता।",
      rarity: "Uncommon",
    },
    {
      name: "त्रिजुटी / त्रिभागी रुद्राक्ष (Trijuti)",
      deity: "परमब्रह्म त्रिदेव (ब्रह्मा, विष्णु, महेश)",
      planet: "सर्व ग्रह (All 9 Planets)",
      mantra: "ॐ त्रिमूर्ति देवाय नमः (Om Trimurti Devaya Namah)",
      purpose: "सर्वोच्च आध्यात्मिक व सांसारिक सत्ता, विषम परिस्थितियों पर पूर्ण नियंत्रण व समाज में अलौकिक सम्मान।",
      rarity: "Extremely Rare",
    },
    {
      name: "सवार रुद्राक्ष (Sawar Rudraksha)",
      deity: "साक्षात शिव स्वरूप (1 मुखी सवार)",
      planet: "सूर्य (Sun)",
      mantra: "ॐ नमः शिवाय (Om Namah Shivaya)",
      purpose: "आत्म-साक्षात्कार, दिव्य आभामंडल, सर्वोच्च नेतृत्व और जन्म-मरण के बंधनों से मुक्ति।",
      rarity: "Extremely Rare",
    },
  ];

  const currentDetailMukhi = typeof selectedMukhiTab === "number" ? getRudrakshaData(selectedMukhiTab) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* 1. Sacred Intro Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(200, 160, 48, 0.06) 100%)",
          border: "1px solid rgba(184, 134, 11, 0.35)",
          borderRadius: "16px",
          padding: "20px 24px",
          boxShadow: "0 4px 16px rgba(184, 134, 11, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{ fontSize: "24px" }}>🔱</span>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Cormorant Garamond', serif" }}>
            वैदिक रुद्राक्ष विज्ञान, १-२१ मुखी ज्ञानकोष एवं व्यक्तिगत कवच
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: "#4A4238", lineHeight: 1.7 }}>
          शास्त्रों (शिव महापुराण, स्कन्द पुराण, देवी भागवत) के अनुसार रुद्राक्ष भगवान शिव के अश्रुओं से उत्पन्न साक्षात पराशक्ति है। <strong>रत्नों के विपरीत, रुद्राक्ष का कोई भी नकारात्मक या प्रतिकूल प्रभाव (Side Effect) कभी नहीं होता।</strong> यह किसी भी अवस्था में केवल सकारात्मक सात्विक ऊर्जा, मानसिक शांति और प्राण-शक्ति प्रदान करता है।
        </p>
      </div>

      {/* 2. Dual-Chakra Synergy Card: Front (Rudraksha) + Back (Ratna) */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(184, 134, 11, 0.3)",
          borderRadius: "16px",
          padding: "20px 24px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <h3 style={{ margin: 0, fontSize: "18px", color: "#1A1A1A", fontWeight: 700 }}>
            रत्न + रुद्राक्ष दिव्य चक्र युति (Front & Back Chakra Harmony)
          </h3>
        </div>
        <p style={{ fontSize: "13.5px", color: "#4A4238", lineHeight: 1.6, margin: "0 0 14px" }}>
          इण्डो-नॉर्डिक शोध संस्थान के अनुसार प्रत्येक चक्र के दो पहलू होते हैं — <strong>अग्र भाग (Front Chakra)</strong> जो देने और अभिव्यक्ति की क्षमता है, तथा <strong>पृष्ठ भाग (Back Chakra)</strong> जो ग्रहण करने और अवसरों का केंद्र है। <strong>रुद्राक्ष फ्रंट चक्र को हील करता है और रत्न बैक चक्र को।</strong> दोनों का संयोग चक्र को 100% जाग्रत करता है।
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          <div style={{ background: "rgba(184, 134, 11, 0.06)", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: "12px", padding: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#8A6008", textTransform: "uppercase" }}>
              💎 Back Chakra (ऊर्जा ग्रहण व समाज में स्थिति)
            </span>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "4px" }}>
              अनुशंसित रत्न: {primary.gemstone}
            </div>
            <div style={{ fontSize: "13px", color: "#5A5248", marginTop: "4px" }}>
              लग्नेश {primary.planet} को बल देकर जीवन में भाग्य, मान-सम्मान व सुरक्षा को आकर्षित करता है। (त्वचा स्पर्श अनिवार्य)
            </div>
          </div>
          <div style={{ background: "rgba(37, 99, 235, 0.06)", border: "1px solid rgba(37, 99, 235, 0.2)", borderRadius: "12px", padding: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase" }}>
              🔱 Front Chakra (ऊर्जा अभिव्यक्ति व आंतरिक शुद्धि)
            </span>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginTop: "4px" }}>
              अनुशंसित रुद्राक्ष: {primaryRudraksha.mukhi}
            </div>
            <div style={{ fontSize: "13px", color: "#5A5248", marginTop: "4px" }}>
              आभामंडल (Aura) को शुद्ध कर मानसिक स्थिरता, आत्मबल व आंतरिक शांति प्रदान करता है। (बिना त्वचा छुए भी प्रभावी)
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Life & Dasha Rudraksha Shields */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        {/* Life / Lagna Rudraksha */}
        <div className="gem-panel" style={{ borderLeft: "4px solid #B8860B" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#B8860B", fontWeight: 700 }}>
                लग्न अधिपति रुद्राक्ष · Life Shield
              </span>
              <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#1A1A1A" }}>
                {primaryRudraksha.mukhi}
              </h3>
            </div>
            <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "rgba(184, 134, 11, 0.15)", color: "#8A6008" }}>
              लग्नेश {primary.planet}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", color: "#3A3228", lineHeight: 1.6 }}>
            <div><strong>अधिष्ठाता देवता:</strong> {primaryRudraksha.deity}</div>
            <div><strong>सिद्ध बीज मंत्र:</strong> <code style={{ background: "#FAF7F2", padding: "2px 6px", borderRadius: "6px", color: "#8A6008", fontWeight: 700 }}>{primaryRudraksha.mantra}</code></div>
            <div><strong>धारण धातु / धागा:</strong> {primaryRudraksha.metal}</div>
            <div style={{ marginTop: "4px", borderTop: "1px solid rgba(184, 134, 11, 0.15)", paddingTop: "8px" }}>
              <strong>विशेष लाभ:</strong> {primaryRudraksha.benefits}
            </div>
          </div>
        </div>

        {/* Active Mahadasha Rudraksha */}
        {mdRudraksha && (
          <div className="gem-panel" style={{ borderLeft: "4px solid #2563EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#2563EB", fontWeight: 700 }}>
                  सक्रिय महादशा कवच · Dasha Shield
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#1A1A1A" }}>
                  {mdRudraksha.mukhi}
                </h3>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "rgba(37, 99, 235, 0.12)", color: "#1D4ED8" }}>
                महादशा: {mdPlanet}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", color: "#3A3228", lineHeight: 1.6 }}>
              <div><strong>अधिष्ठाता देवता:</strong> {mdRudraksha.deity}</div>
              <div><strong>सिद्ध बीज मंत्र:</strong> <code style={{ background: "#FAF7F2", padding: "2px 6px", borderRadius: "6px", color: "#1D4ED8", fontWeight: 700 }}>{mdRudraksha.mantra}</code></div>
              <div><strong>धारण धातु / धागा:</strong> {mdRudraksha.metal}</div>
              <div style={{ marginTop: "4px", borderTop: "1px solid rgba(37, 99, 235, 0.15)", paddingTop: "8px" }}>
                <strong>दशा प्रभाव:</strong> {mdRudraksha.relevance}
              </div>
            </div>
          </div>
        )}

        {/* Active Antardasha Rudraksha */}
        {adRudraksha && adPlanet !== mdPlanet && adPlanet !== primary.planet && (
          <div className="gem-panel" style={{ borderLeft: "4px solid #059669" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#059669", fontWeight: 700 }}>
                  अंतर्दशा संतुलन रुद्राक्ष · Antardasha Harmony
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#1A1A1A" }}>
                  {adRudraksha.mukhi}
                </h3>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "rgba(5, 150, 105, 0.12)", color: "#059669" }}>
                अंतर्दशा: {adPlanet}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", color: "#3A3228", lineHeight: 1.6 }}>
              <div><strong>अधिष्ठाता देवता:</strong> {adRudraksha.deity}</div>
              <div><strong>सिद्ध बीज मंत्र:</strong> <code style={{ background: "#FAF7F2", padding: "2px 6px", borderRadius: "6px", color: "#059669", fontWeight: 700 }}>{adRudraksha.mantra}</code></div>
              <div><strong>धारण धातु / धागा:</strong> {adRudraksha.metal}</div>
              <div style={{ marginTop: "4px", borderTop: "1px solid rgba(5, 150, 105, 0.15)", paddingTop: "8px" }}>
                <strong>शांतिकारी प्रभाव:</strong> {adRudraksha.benefits}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Interactive Problem Solver Search & Filter Widget */}
      <div className="gem-panel" style={{ background: "#FFFFFF", border: "1.5px solid rgba(184, 134, 11, 0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#1A1A1A", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🔍</span> समस्या अनुसार रुद्राक्ष चयन (Instant Remedy Finder)
            </h3>
            <span style={{ fontSize: "12.5px", color: "#6B635B" }}>
              अपनी समस्या या लक्ष्य चुनें — शास्त्रोक्त सटीक मुखी रुद्राक्ष स्वतः खोजें
            </span>
          </div>
          <div style={{ width: "100%", maxWidth: "340px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="सर्च करें (उदा. diabetes, BP, साढ़ेसाती, धन, नजर)..."
              style={{
                width: "100%",
                padding: "8px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(184, 134, 11, 0.3)",
                fontSize: "13px",
                outline: "none",
                background: "#FAF8F5",
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { id: "all", label: "सभी (All)" },
            { id: "health", label: "🌿 स्वास्थ्य व रोग निवारण" },
            { id: "wealth", label: "💰 धन, व्यापार व साढ़ेसाती" },
            { id: "protection", label: "🛡️ नजर, तंत्र व सुरक्षा" },
            { id: "relationship", label: "❤️ विवाह व दांपत्य सुख" },
            { id: "intellect", label: "📚 विद्यार्थी, बुद्धि व एकाग्रता" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                borderColor: selectedCategory === cat.id ? "#B8860B" : "rgba(184, 134, 11, 0.2)",
                background: selectedCategory === cat.id ? "#B8860B" : "#FAF8F5",
                color: selectedCategory === cat.id ? "#FFFFFF" : "#4A4238",
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {filteredProblems.slice(0, 6).map((r) => (
            <div
              key={r.mukhi}
              style={{
                background: "#FAF8F5",
                border: "1px solid rgba(184, 134, 11, 0.18)",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "15px", color: "#1A1A1A" }}>
                  {r.nameHindi} ({r.nameEnglish})
                </strong>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "12px", background: "rgba(184, 134, 11, 0.15)", color: "#8A6008" }}>
                  {r.rulingPlanet}
                </span>
              </div>
              <div style={{ fontSize: "12.5px", color: "#6B635B" }}>
                <strong>देवता:</strong> {r.rulingDeity}
              </div>
              <div style={{ fontSize: "12px" }}>
                <code style={{ background: "#FFFFFF", padding: "2px 6px", borderRadius: "4px", color: "#8A6008", fontWeight: 700, border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                  {r.mantra}
                </code>
              </div>
              <div style={{ fontSize: "12.5px", color: "#3A3228", marginTop: "4px" }}>
                <strong>मुख्य निवारण:</strong> {r.problemsSolved.slice(0, 3).join(", ")}
              </div>
              <div style={{ fontSize: "12px", color: "#8A6008", marginTop: "2px" }}>
                <strong>सर्वश्रेष्ठ:</strong> {r.bestFor.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Complete 1 to 21 Mukhi + Rare Types Explorer */}
      <div className="gem-panel">
        <h3 style={{ fontSize: "18px", color: "#1A1A1A", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📜</span> संपूर्ण १ से २१ मुखी एवं दुर्लभ रुद्राक्ष ज्ञानकोष (Visual Encyclopedia)
        </h3>

        {/* Mukhi Selector Chips */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          {allMukhis.map((r) => (
            <button
              key={r.mukhi}
              onClick={() => setSelectedMukhiTab(r.mukhi)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid",
                borderColor: selectedMukhiTab === r.mukhi ? "#B8860B" : "rgba(184, 134, 11, 0.25)",
                background: selectedMukhiTab === r.mukhi ? "#B8860B" : "#FAF8F5",
                color: selectedMukhiTab === r.mukhi ? "#FFFFFF" : "#4A4238",
              }}
            >
              {r.mukhi}
            </button>
          ))}
          <button
            onClick={() => setSelectedMukhiTab("rare")}
            style={{
              padding: "0 14px",
              height: "36px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid",
              borderColor: selectedMukhiTab === "rare" ? "#B8860B" : "rgba(184, 134, 11, 0.25)",
              background: selectedMukhiTab === "rare" ? "#B8860B" : "#FAF8F5",
              color: selectedMukhiTab === "rare" ? "#FFFFFF" : "#4A4238",
            }}
          >
            दुर्लभ प्रकार (Rare)
          </button>
        </div>

        {/* Detailed Mukhi View */}
        {currentDetailMukhi && (
          <div
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              borderRadius: "14px",
              padding: "18px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>⚜️</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", color: "#1A1A1A" }}>
                    {currentDetailMukhi.nameHindi} ({currentDetailMukhi.nameEnglish})
                  </h4>
                  <span style={{ fontSize: "12px", color: "#8A6008", fontWeight: 700 }}>
                    दुर्लभता: {currentDetailMukhi.rarity} · तत्व: {currentDetailMukhi.element}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13.5px" }}>
                <div><strong>अधिष्ठाता देवता:</strong> {currentDetailMukhi.rulingDeity}</div>
                <div><strong>शासक ग्रह:</strong> {currentDetailMukhi.rulingPlanet}</div>
                <div>
                  <strong>सिद्ध बीज मंत्र:</strong>{" "}
                  <code style={{ background: "#FFFFFF", padding: "2px 8px", borderRadius: "6px", color: "#8A6008", fontWeight: 700, border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                    {currentDetailMukhi.mantra}
                  </code>
                </div>
                <div><strong>धारण विधान:</strong> {currentDetailMukhi.wearing.metal} · {currentDetailMukhi.wearing.day} · {currentDetailMukhi.wearing.position} ({currentDetailMukhi.wearing.finger})</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: "#B8860B" }}>आरोग्य व स्वास्थ्य लाभ:</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: "18px", color: "#4A4238" }}>
                  {currentDetailMukhi.healthBenefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ color: "#B8860B" }}>सांसारिक व आर्थिक लाभ:</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: "18px", color: "#4A4238" }}>
                  {currentDetailMukhi.materialBenefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ color: "#B8860B" }}>किन समस्याओं का समाधान करता है:</strong>
                <div style={{ marginTop: "2px", color: "#3A3228" }}>
                  {currentDetailMukhi.problemsSolved.join(" • ")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rare Types View */}
        {selectedMukhiTab === "rare" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {rareTypes.map((rt, i) => (
              <div key={i} style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "15px", color: "#1A1A1A" }}>{rt.name}</strong>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(184, 134, 11, 0.15)", color: "#8A6008" }}>
                    {rt.rarity}
                  </span>
                </div>
                <div style={{ fontSize: "12.5px", color: "#6B635B", marginBottom: "4px" }}>
                  <strong>देवता:</strong> {rt.deity} · <strong>ग्रह:</strong> {rt.planet}
                </div>
                <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                  <code style={{ background: "#FFFFFF", padding: "2px 6px", borderRadius: "4px", color: "#8A6008", fontWeight: 700, border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                    {rt.mantra}
                  </code>
                </div>
                <div style={{ fontSize: "12.5px", color: "#3A3228", lineHeight: 1.5 }}>
                  <strong>उद्देश्य व फल:</strong> {rt.purpose}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Vedic Mala Calculator & Sacred Rules */}
      <div className="gem-panel" style={{ background: "#FAF8F5" }}>
        <h3 style={{ fontSize: "17px", color: "#1A1A1A", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📿</span> वैदिक माला निर्धारण, गुंथन नियम एवं जप विज्ञान
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", fontSize: "13px", color: "#4A4238", lineHeight: 1.6 }}>
          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid rgba(184, 134, 11, 0.18)" }}>
            <strong style={{ color: "#B8860B", display: "block", marginBottom: "4px" }}>१. दानों की संख्या का शास्त्रीय फल</strong>
            • <strong>१०८ दाने:</strong> पूर्ण सर्वकामना सिद्धि व मोक्ष<br />
            • <strong>३० दाने:</strong> केवल धन-संपत्ति वृद्धि हेतु विशेष जप<br />
            • <strong>२७ दाने:</strong> उत्तम स्वास्थ्य, पुष्टि व दीर्घायु<br />
            • <strong>३२ दाने:</strong> गले में धारण कर नीलकंठ स्वरूप सुरक्षा
          </div>
          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid rgba(184, 134, 11, 0.18)" }}>
            <strong style={{ color: "#B8860B", display: "block", marginBottom: "4px" }}>२. गुंथन का दिव्य नियम (Stringing)</strong>
            <em>"मुखं मुखेन संयोज्य पुच्छं पुच्छेन योजयेत्"</em> — रुद्राक्ष को पिरोते समय मुख से मुख और पूंछ से पूंछ मिलनी चाहिए। सुमेरु का मुख ऊपर हो और दाईं ओर चांदी तथा बाईं ओर तांबे की कैप शुभ है।
          </div>
          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid rgba(184, 134, 11, 0.18)" }}>
            <strong style={{ color: "#B8860B", display: "block", marginBottom: "4px" }}>३. जप में अंगुलियों का गुप्त रहस्य</strong>
            अंगूठा मोक्ष देता है और <strong>मध्यमा अंगुली धन व ऐश्वर्य देती है</strong>। अनामिका शांति देती है। <strong>तर्जनी (इंडेक्स फिंगर) का स्पर्श वर्जित है</strong> — इससे जप का पुण्य समाप्त हो जाता है।
          </div>
          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid rgba(184, 134, 11, 0.18)" }}>
            <strong style={{ color: "#B8860B", display: "block", marginBottom: "4px" }}>४. आयुर्वेदिक घरेलू कल्प (Chikitsa)</strong>
            • <strong>हाई बीपी/हृदय:</strong> ५ मुखी रुद्राक्ष मिट्टी के पात्र में रातभर भिगोकर सुबह बासी मुंह ४० दिन पिएं।<br />
            • <strong>कफ/दमा:</strong> रुद्राक्ष को पत्थर पर घिसकर शहद के साथ चटाएं।
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type TabKey = "analysis" | "wearing" | "dasha" | "secondary" | "avoid" | "medical" | "rudraksha";

export default function GemstonePage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Gemstone Suitability"
            loading
            loadingText="Preparing gemstone intelligence..."
          />
        </section>
      </main>
    );
  }

  return <GemstonePageContent />;
}

function GemstonePageContent() {
  const { chart, loading, hasUserChart } = useUserChart();
  const [activeTab, setActiveTab] = useState<TabKey>("analysis");

  const input = useMemo(() => (hasUserChart ? chartToMedicalInput(chart) : null), [chart, hasUserChart]);
  const report = useMemo(
    () => (input ? runGemstoneMedicalMasterEngineV2(input) : null),
    [input],
  );

  const tabs: Array<{ id: TabKey; label: string }> = [
    { id: "analysis",  label: "◈ Analysis" },
    { id: "wearing",   label: "◎ Wearing Guide" },
    { id: "dasha",     label: "🪐 Dasha Timing" },
    { id: "secondary", label: "◇ Secondary Gems" },
    { id: "avoid",     label: "⊗ Avoid / Careful" },
    { id: "medical",   label: "✦ Medical Awareness" },
    { id: "rudraksha", label: "🔱 Rudraksha" },
  ];

  if (loading) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Gemstone Suitability"
            loading
            loadingText="Chart loading... gemstone and rudraksha guidance will update automatically."
          />
        </section>
      </main>
    );
  }

  if (!report || !report.primaryRecommendation) {
    return (
      <main className="gem-page">
        <section style={{ maxWidth: 1120, margin: "0 auto" }}>
          <EngineStateCard
            title="Gemstone Suitability"
            emptyText="Chart data incomplete. Please complete your birth details in onboarding."
          />
        </section>
      </main>
    );
  }

  const primary = report.primaryRecommendation;
  const dashaStr = input?.dasha
    ? [input.dasha.mahadasha, input.dasha.antardasha].filter(Boolean).join(" › ")
    : "Not connected";

  return (
    <PremiumFeature feature="Gemstone & Ratna Intelligence" requiredTier="premium">
      <main className="gem-page">
      <div className="gem-bg">
        <div className="gem-orb one" />
        <div className="gem-orb two" />
        <svg className="gem-stars" viewBox="0 0 100 100" preserveAspectRatio="none">
          {STAR_POINTS.map((star) => (
            <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="white" opacity={star.o} />
          ))}
        </svg>
      </div>

      <section className="gem-header">
        <span className="gem-pill">Ratna Intelligence · वैदिक रत्न परामर्श</span>
        <h1>Primary Gemstone Recommendation</h1>
        <p className="gem-subtitle">
          {input?.ascendant} Lagna · Moon in {input?.moonSign ?? "—"} · Dasha: {dashaStr}
        </p>
        {report.executiveSummary && (
          <div className="gem-summary-callout">
            <span className="gem-callout-icon">✨</span>
            <p>{report.executiveSummary}</p>
          </div>
        )}
      </section>

      <PrimaryGemHero gem={primary} />

      <section className="gem-foundation-grid">
        <div>
          <span>Lagna</span>
          <strong>{input?.ascendant}</strong>
          <p>All gemstone scoring is anchored to the ascendant lord and functional benefics.</p>
        </div>
        <div>
          <span>Moon Sign</span>
          <strong>{input?.moonSign ?? "—"}</strong>
          <p>Moon sign influences emotional resonance and healing colour choices.</p>
        </div>
        <div>
          <span>Current Dasha</span>
          <strong>{dashaStr}</strong>
          <p>Dasha activation adds up to +12 pts to the ruling planet&apos;s gemstone score.</p>
        </div>
      </section>

      <section className="gem-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="gem-content">
        {activeTab === "analysis"  && <AnalysisTab gem={primary} />}
        {activeTab === "wearing"   && <WearingTab gem={primary} />}
        {activeTab === "dasha"     && <DashaTab gem={primary} />}
        {activeTab === "secondary" && <SecondaryTab report={report} />}
        {activeTab === "avoid"     && <AvoidTab report={report} />}
        {activeTab === "medical"   && <MedicalTab report={report} />}
        {activeTab === "rudraksha" && <RudrakshaTab primary={primary} input={input} />}
      </section>

      {(() => {
        const intro = engineIntros['gemstone'];
        return (
          <div style={{ maxWidth: 1120, margin: "24px auto 0" }}>
            <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />
          </div>
        );
      })()}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        .gem-page {
          --bg: #FAF7F2;
          --bg-2: #F3EFE6;
          --card: #FFFFFF;
          --border: rgba(184, 134, 11, 0.22);
          --border-2: rgba(184, 134, 11, 0.35);
          --gold: #B8860B;
          --gold-soft: #8A6008;
          --cream: #1A1A1A;
          --cream-soft: #4A4238;
          --muted: #6B635B;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 26px 22px 96px;
          color: var(--cream);
          background: #FAF7F2;
          font-family: "Outfit", sans-serif;
        }

        .gem-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gem-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(52px);
          opacity: 0.12;
        }

        .gem-orb.one {
          width: 520px;
          height: 520px;
          left: -180px;
          top: -160px;
          background: rgba(184, 134, 11, 0.15);
        }

        .gem-orb.two {
          width: 460px;
          height: 460px;
          right: -150px;
          bottom: -150px;
          background: rgba(200, 160, 48, 0.12);
        }

        .gem-stars {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.2;
        }

        .gem-header,
        .gem-hero-card,
        .gem-tabs,
        .gem-content {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin-left: auto;
          margin-right: auto;
        }

        .gem-nav {
          position: relative;
          z-index: 2;
          max-width: 1120px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0 4px;
        }

        .gem-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gem-logo-glyph {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #B8860B, #8A6008);
          color: #FFFFFF;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(184, 134, 11, 0.2);
        }

        .gem-logo-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
          font-weight: 700;
          color: #1A1A1A;
        }

        .gem-nav-btn {
          text-decoration: none;
          border: 1px solid rgba(184, 134, 11, 0.35);
          color: #8A6008;
          background: #FFFFFF;
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .gem-nav-btn:hover {
          background: rgba(184, 134, 11, 0.1);
          border-color: #B8860B;
          color: #1A1A1A;
        }

        .gem-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .gem-header span {
          display: inline-flex;
          margin-bottom: 10px;
          border: 1px solid rgba(184, 134, 11, 0.3);
          background: rgba(184, 134, 11, 0.08);
          color: #8A6008;
          border-radius: 999px;
          padding: 8px 15px;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          font-size: 10px;
          font-weight: 700;
        }

        .gem-header h1 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(38px, 6.4vw, 66px);
          letter-spacing: -0.03em;
          line-height: 1;
          color: #1A1A1A;
        }

        .gem-header p {
          max-width: 820px;
          margin: 14px auto 0;
          color: #4A4238;
          line-height: 1.78;
          font-size: 14px;
        }

        .gem-summary-callout {
          max-width: 840px;
          margin: 18px auto 0;
          padding: 14px 20px;
          background: #FFFFFF;
          border: 1px solid rgba(184, 134, 11, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          box-shadow: 0 4px 18px rgba(184, 134, 11, 0.08);
        }

        .gem-summary-callout p {
          margin: 0;
          color: #2D241E;
          font-size: 14.5px;
          line-height: 1.6;
          font-weight: 500;
        }

        .gem-callout-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .gem-hero-card {
          position: relative;
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 24px;
          align-items: center;
          border: 1px solid rgba(184, 134, 11, 0.25);
          background: #FFFFFF;
          border-radius: 16px;
          padding: 20px 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .gem-glow {
          position: absolute;
          right: -70px;
          top: -80px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          filter: blur(58px);
          opacity: 0.12;
        }

        .gem-hero-card > svg {
          position: relative;
          z-index: 1;
          justify-self: center;
        }

        .gem-hero-info {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .gem-label-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 12px;
        }

        .gem-status-badge {
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          border: 1px solid transparent;
        }

        .gem-score {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .gem-score div {
          width: 110px;
          height: 7px;
          background: rgba(184, 134, 11, 0.15);
          border-radius: 999px;
        }

        .gem-score div span {
          display: block;
          height: 100%;
          border-radius: 999px;
        }

        .gem-score strong {
          color: #1A1A1A;
          font-size: 12px;
          font-weight: 700;
        }

        .gem-hero-card h2 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: 34px;
          letter-spacing: -0.04em;
          color: #1A1A1A;
          font-weight: 700;
        }

        .gem-alt {
          color: #6B635B;
          margin: 8px 0 14px;
          font-size: 13.5px;
          font-weight: 500;
        }

        .gem-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }

        .gem-meta-pill {
          border: 1px solid rgba(184, 134, 11, 0.22);
          background: #FAF7F2;
          border-radius: 12px;
          padding: 10px;
        }

        .gem-meta-pill span {
          display: block;
          color: #6B635B;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .gem-meta-pill strong {
          color: #1A1A1A;
          font-size: 13px;
          font-weight: 700;
        }

        .gem-reason,
        .gem-panel p,
        .gem-panel li,
        .gem-card-reason,
        .gem-avoid-list p {
          color: #4A4238;
          line-height: 1.65;
          font-size: 13.5px;
        }

        .gem-foundation-grid {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .gem-foundation-grid div {
          border: 1px solid rgba(184, 134, 11, 0.22);
          background: #FFFFFF;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .gem-foundation-grid span {
          display: block;
          color: #6B635B;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .gem-foundation-grid strong {
          display: block;
          color: #B8860B;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .gem-foundation-grid p {
          margin: 0;
          color: #4A4238;
          line-height: 1.55;
          font-size: 13px;
        }

        .gem-tabs {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          margin-bottom: 16px;
          padding: 6px;
          border: 1px solid rgba(184, 134, 11, 0.22);
          border-radius: 12px;
          background: #FFFFFF;
          overflow-x: auto;
        }

        .gem-tabs button {
          border: 1px solid transparent;
          background: transparent;
          color: #6B635B;
          border-radius: 9px;
          padding: 9px 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          font-size: 13px;
          font-family: "Outfit", sans-serif;
          transition: all 0.2s;
        }

        .gem-tabs button:hover {
          color: #1A1A1A;
          background: rgba(184, 134, 11, 0.08);
        }

        .gem-tabs button.active {
          color: #B8860B;
          background: rgba(184, 134, 11, 0.14);
          border-color: rgba(184, 134, 11, 0.35);
          font-weight: 700;
        }

        .gem-grid-two {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-panel,
        .gem-secondary-card {
          border: 1px solid rgba(184, 134, 11, 0.22);
          background: #FFFFFF;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .gem-panel.caution {
          border-color: rgba(220, 38, 38, 0.25);
          background: rgba(220, 38, 38, 0.03);
        }

        .gem-panel h3,
        .gem-secondary-card h3 {
          margin: 0 0 12px;
          color: #1A1A1A;
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
          font-weight: 700;
        }

        .gem-table {
          display: grid;
          gap: 9px;
        }

        .gem-table div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(184, 134, 11, 0.12);
          padding-bottom: 9px;
        }

        .gem-table span {
          color: #4A4238;
          font-size: 13px;
        }

        .gem-table strong {
          text-align: right;
          font-size: 13px;
        }

        .gem-secondary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gem-secondary-card {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 18px;
          align-items: start;
        }

        .gem-secondary-card span {
          color: #6B635B;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 10px;
          font-weight: 700;
        }

        .gem-secondary-card p {
          margin: 6px 0;
          color: #4A4238;
        }

        .gem-avoid-list {
          display: grid;
          gap: 14px;
          margin-top: 8px;
        }

        .gem-avoid-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .gem-avoid-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(184, 134, 11, 0.12);
          color: #8A6008;
          font-size: 22px;
        }

        .gem-avoid-row span {
          color: #6B635B;
          font-size: 12px;
          font-weight: 600;
        }

        .gem-avoid-row strong {
          color: #1A1A1A;
          font-size: 14px;
          font-weight: 700;
        }

        .gem-avoid-row p {
          margin: 6px 0 0;
          color: #4A4238;
          font-size: 13px;
          line-height: 1.55;
        }

        .gem-medical-findings {
          display: grid;
          gap: 12px;
          margin-top: 8px;
        }

        .gem-finding {
          border-radius: 12px;
          padding: 14px;
          border-left: 3px solid;
        }

        .gem-finding-mild {
          border-color: #B45309;
          background: #FEF3C7;
        }

        .gem-finding-moderate {
          border-color: #C2410C;
          background: #FFEDD5;
        }

        .gem-finding-strong {
          border-color: #DC2626;
          background: #FEE2E2;
        }

        .gem-finding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .gem-finding-header strong {
          color: #1A1A1A;
          font-size: 14px;
          font-weight: 700;
        }

        .gem-finding-header span {
          color: #6B635B;
          font-size: 12px;
          font-weight: 600;
        }

        .gem-finding p {
          margin: 0;
          color: #4A4238;
          font-size: 13px;
          line-height: 1.6;
        }

        .gem-empty {
          border: 1px solid rgba(184, 134, 11, 0.22);
          background: #FFFFFF;
          border-radius: 14px;
          padding: 18px;
          color: #4A4238;
        }

        @media (max-width: 860px) {
          .gem-page {
            padding: 22px 16px 90px;
          }

          .gem-hero-card,
          .gem-foundation-grid,
          .gem-grid-two,
          .gem-analysis-grid,
          .gem-secondary-grid,
          .gem-secondary-card,
          .gem-meta-grid {
            grid-template-columns: 1fr;
          }

          .gem-hero-card {
            text-align: left;
            padding: 22px;
          }

          .gem-hero-card > svg {
            justify-self: start;
          }

          .gem-tabs button {
            font-size: 12px;
            padding: 8px 12px;
          }

          .gem-logo-name {
            font-size: 20px;
          }

          .gem-nav-btn {
            padding: 8px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </main>
    </PremiumFeature>
  );
}
