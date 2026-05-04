// ============================================================
// ASTROLIFE SHADBALA ENGINE v2.0
// 6-Factor Planetary Strength System
// Extracted from AstroLife_v20_SwissEphem_Accurac
// ============================================================

export interface ShadbalaPlanet {
    planet:     string;
    icon:       string;
    color:      string;
    sign:       string;
    house:      number;
    retrograde: boolean;
    sthana:     number; // Positional strength
    dig:        number; // Directional strength
    kala:       number; // Temporal strength
    cheshta:    number; // Motional strength
    naisargika: number; // Natural strength
    drik:       number; // Aspectual strength
    total:      number; // Sum of all
    percent:    number; // 0-100
    grade:      "Excellent" | "Strong" | "Moderate" | "Weak" | "Very Weak";
    sthanaTxt:  string;
    digTxt:     string;
    kalaTxt:    string;
    cheshtaTxt: string;
    drikTxt:    string;
    summary:    string;
  }
  
  export interface ShadbalaResult {
    planets:    ShadbalaPlanet[];
    strongest:  string;
    weakest:    string;
    overall:    number;
    insights:   string[];
  }
  
  // ── Constants from original engine ───────────────────────────
  const NAISARGIKA: Record<string, number> = {
    Sun:5, Moon:5, Mars:5, Mercury:5, Jupiter:7, Venus:6, Saturn:5
  };
  
  const EXALTATION_RASHI: Record<string, number> = {
    Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6
  };
  
  const OWN_RASHIS: Record<string, number[]> = {
    Sun:[4], Moon:[3], Mars:[0,7], Mercury:[2,5],
    Jupiter:[8,11], Venus:[1,6], Saturn:[9,10]
  };
  
  // Dig bala — house where planet gets max directional strength
  const DIG_HOUSE: Record<string, number> = {
    Sun:10, Mars:10, Moon:4, Venus:4,
    Mercury:1, Jupiter:1, Saturn:7
  };
  
  const PLANET_ICONS: Record<string, string> = {
    Sun:"☉", Moon:"☽", Mars:"♂", Mercury:"☿",
    Jupiter:"♃", Venus:"♀", Saturn:"♄"
  };
  
  const PLANET_COLORS: Record<string, string> = {
    Sun:"#f97316", Moon:"#c084fc", Mars:"#ef4444",
    Mercury:"#22c55e", Jupiter:"#f59e0b", Venus:"#ec4899", Saturn:"#60a5fa"
  };
  
  const PLANETS_7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  
  const md = (x: number, m: number) => ((x % m) + m) % m;
  
  // ── Shadbala descriptions ─────────────────────────────────────
  const BALA_DESC: Record<string, string> = {
    Sthana: "Sthana Bala — Is planet ko apni jagah kitni takat milti hai. Uchcha (exalted) mein ho to maximum strength. Own sign mein ho to ghar jaisa aaram. Neecha (debilitated) mein bahut kamzor. Yeh planet ki mool takat hai.",
    Dig:    "Dig Bala — Disha ki takat. Har planet ek specific ghar mein sabse zyada powerful hota hai — jaise Sun/Mars 10th mein, Moon/Venus 4th mein, Mercury/Jupiter 1st mein, Saturn 7th mein.",
    Kala:   "Kala Bala — Samay ki takat. Din mein Sun, Jupiter, Venus strong hote hain. Raat mein Moon, Mars, Saturn. Agar planet apne samay mein ho to results jaldi aate hain.",
    Cheshta:"Cheshta Bala — Kriya-shakti. Planet retro (vakri) ho to extra effort dikhata hai — results intense hote hain par delay ke saath. Direct motion mein smooth delivery.",
    Naisargika:"Naisargika Bala — Prakriti ki takat. Jupiter sab se zyada naturally powerful, phir Venus, Sun, Moon, Saturn, Mars, Mercury. Yeh kisi bhi situation mein nahi badlti.",
    Drik:   "Drik Bala — Drishti ki takat. Benefic (Jupiter, Venus) ka aspect mile to strength badhti hai. Malefic (Saturn, Mars) ka aspect ho to kamzori aati hai."
  };
  
  // ── Main Shadbala Calculator ──────────────────────────────────
  export function calculateShadbala(
    planets: Record<string, {
      house: number;
      signNum: number;
      sign: string;
      retrograde: boolean;
      lon: number;
      dignity: string;
    }>
  ): ShadbalaResult {
    const results: ShadbalaPlanet[] = [];
    const now = new Date();
    const isDay = now.getHours() >= 6 && now.getHours() < 18;
  
    PLANETS_7.forEach((p) => {
      const pd = planets[p];
      if (!pd) return;
  
      const rashi = pd.signNum;
      const house = pd.house;
  
      // ── 1. STHANA BALA (Positional) ───────────────────────────
      let sthana = 4; // neutral
      let sthanaTxt = "";
      if (EXALTATION_RASHI[p] === rashi) {
        sthana = 10;
        sthanaTxt = `Exalted in ${pd.sign} — peak positional strength. Planet gives its absolute best results here.`;
      } else if (OWN_RASHIS[p]?.includes(rashi)) {
        sthana = 7;
        sthanaTxt = `Own sign (${pd.sign}) — comfortable, natural expression. Like being at home.`;
      } else if (rashi === (EXALTATION_RASHI[p] + 6) % 12) {
        sthana = 1;
        sthanaTxt = `Debilitated in ${pd.sign} — positional strength very low. Remedies strongly recommended.`;
      } else {
        // Friend/enemy sign check
        const isFriendSign = checkFriendSign(p, rashi);
        sthana = isFriendSign ? 6 : 3;
        sthanaTxt = isFriendSign
          ? `Friendly sign (${pd.sign}) — moderately comfortable, gives decent results.`
          : `Enemy/neutral sign (${pd.sign}) — some friction, results may be inconsistent.`;
      }
  
      // ── 2. DIG BALA (Directional) ─────────────────────────────
      const digHouse = DIG_HOUSE[p];
      let dig = 4;
      const houseDiff = Math.abs(((house - digHouse + 6) % 12) - 6);
      dig = Math.max(2, Math.round(10 - houseDiff * 1.5));
      const digPct = Math.round(dig / 10 * 100);
      const digTxt = house === digHouse
        ? `Full Dig Bala in House ${house} — this is the ideal house for ${p}. Maximum directional strength.`
        : `Dig Bala ${digPct}% — peak is H${digHouse}, currently in H${house}. ${digPct >= 70 ? "Good directional strength." : digPct >= 40 ? "Moderate directional strength." : "Low directional strength."}`;
  
      // ── 3. KALA BALA (Temporal) ───────────────────────────────
      const dayPlanets   = ["Sun","Jupiter","Venus"];
      const nightPlanets = ["Moon","Mars","Saturn"];
      let kala = 5;
      let kalaTxt = "";
      if (dayPlanets.includes(p)) {
        kala = isDay ? 7 : 4;
        kalaTxt = isDay
          ? `${p} is a day planet — born during daytime gives stronger Kala Bala.`
          : `${p} is a day planet — born at night slightly reduces temporal strength.`;
      } else if (nightPlanets.includes(p)) {
        kala = isDay ? 4 : 7;
        kalaTxt = !isDay
          ? `${p} is a night planet — born at night gives stronger Kala Bala.`
          : `${p} is a night planet — born during day slightly reduces temporal strength.`;
      } else {
        kala = 5;
        kalaTxt = `Mercury adapts to both day and night — moderate temporal strength.`;
      }
  
      // ── 4. CHESHTA BALA (Motional) ────────────────────────────
      let cheshta = 6;
      let cheshtaTxt = "";
      if (pd.dignity?.includes("Combust") || pd.dignity?.includes("combust")) {
        cheshta = 1;
        cheshtaTxt = `Combust (Ast) — Cheshta Bala minimum (1/10). Planet's independent strength is absorbed by the Sun.`;
      } else if (pd.retrograde) {
        cheshta = 8;
        cheshtaTxt = `Retrograde (Vakri) — Cheshta Bala maximum (8/10). Classical rule: retrograde planets give intense, lasting results — delayed but powerful.`;
      } else {
        // Speed factor based on angular separation from Sun
        const sunLon = planets["Sun"]?.lon || 0;
        const angSep = Math.min(Math.abs(pd.lon - sunLon), 360 - Math.abs(pd.lon - sunLon));
        if (angSep < 15)  { cheshta = 2; cheshtaTxt = `Very close to Sun (${Math.round(angSep)}°) — near combustion, strength significantly reduced.`; }
        else if (angSep < 30) { cheshta = 4; cheshtaTxt = `Close to Sun (${Math.round(angSep)}°) — moderate Cheshta Bala. Direct motion but slightly hemmed.`; }
        else { cheshta = 6; cheshtaTxt = `Direct motion with good separation from Sun — Cheshta Bala ${cheshta}/10. Normal strength.`; }
      }
  
      // ── 5. NAISARGIKA BALA (Natural) ─────────────────────────
      const naisargika = NAISARGIKA[p] || 5;
  
      // ── 6. DRIK BALA (Aspectual) ─────────────────────────────
      let drik = 4;
      const benefics = ["Jupiter","Venus","Moon","Mercury"];
      const malefics = ["Saturn","Mars","Sun"];
      let drikTxt = "";
      const aspects: string[] = [];
  
      ["Jupiter","Venus","Saturn","Mars"].forEach(asp => {
        if (asp === p || !planets[asp]) return;
        const dist = Math.abs(planets[asp].house - house);
        const normDist = Math.min(dist, 12 - dist);
        const hasAspect =
          normDist === 6 ||
          (asp === "Jupiter"  && (normDist === 4 || normDist === 8)) ||
          (asp === "Mars"     && (normDist === 3 || normDist === 7)) ||
          (asp === "Saturn"   && (normDist === 2 || normDist === 9));
  
        if (hasAspect) {
          if (benefics.includes(asp)) { drik += 2; aspects.push(`${asp} ✦ (+)`); }
          else                        { drik -= 1; aspects.push(`${asp} ✦ (-)`); }
        }
      });
  
      drik = Math.max(1, Math.min(10, drik));
      drikTxt = aspects.length > 0
        ? `Aspects received: ${aspects.join(", ")} → Drik Bala ${drik}/10`
        : `No major aspects received → Neutral Drik Bala (${drik}/10)`;
  
      // ── TOTAL & GRADE ─────────────────────────────────────────
      const total   = sthana + dig + kala + cheshta + naisargika + drik;
      const maxPoss = 10 + 10 + 7 + 8 + 7 + 10; // max possible
      const percent = Math.min(100, Math.round(total / maxPoss * 100));
      const grade: ShadbalaPlanet["grade"] =
        percent >= 80 ? "Excellent" :
        percent >= 65 ? "Strong"    :
        percent >= 50 ? "Moderate"  :
        percent >= 35 ? "Weak"      : "Very Weak";
  
      const summary =
        percent >= 80
          ? `${p} is exceptionally strong — gives excellent results in all its significations. Its dasha period will be highly favorable.`
          : percent >= 65
          ? `${p} is strong — generally gives good results. Minor challenges may arise in some areas.`
          : percent >= 50
          ? `${p} is moderate — gives mixed results. Some effort needed to extract its benefits.`
          : percent >= 35
          ? `${p} is weak — results come with difficulty. Strengthening remedies recommended.`
          : `${p} is very weak — significant challenges in its significations. Immediate remedies advised.`;
  
      results.push({
        planet: p,
        icon: PLANET_ICONS[p],
        color: PLANET_COLORS[p],
        sign: pd.sign,
        house,
        retrograde: pd.retrograde,
        sthana, dig, kala, cheshta, naisargika, drik,
        total, percent, grade,
        sthanaTxt, digTxt, kalaTxt, cheshtaTxt, drikTxt, summary,
      });
    });
  
    // Sort by percent descending
    results.sort((a, b) => b.percent - a.percent);
  
    // Overall chart strength
    const overall = Math.round(results.reduce((s, p) => s + p.percent, 0) / results.length);
  
    // Key insights
    const insights = generateInsights(results, planets);
  
    return {
      planets:   results,
      strongest: results[0]?.planet || "",
      weakest:   results[results.length - 1]?.planet || "",
      overall,
      insights,
    };
  }
  
  // ── Friend sign check ─────────────────────────────────────────
  function checkFriendSign(planet: string, rashi: number): boolean {
    const FRIENDS: Record<string, number[]> = {
      Sun:     [0,3,4,8],         // Aries, Cancer, Leo, Sagittarius
      Moon:    [1,2,3,4,5],       // Taurus-Virgo
      Mars:    [0,3,4,8,11],      // Aries, Cancer, Leo, Sagit, Pisces
      Mercury: [1,2,4,5,6],       // Taurus-Virgo, Leo, Libra
      Jupiter: [0,3,4,8,9,11],    // Fire + Cancer + Capricorn + Pisces
      Venus:   [1,2,5,6,9,10],    // Earth + Air signs
      Saturn:  [1,2,5,6,10,11],   // Earth + Air signs
    };
    return (FRIENDS[planet] || []).includes(rashi);
  }
  
  // ── Generate insights ─────────────────────────────────────────
  function generateInsights(
    planets: ShadbalaPlanet[],
    raw: Record<string, { house: number; signNum: number; sign: string; retrograde: boolean; lon: number; dignity: string }>
  ): string[] {
    const insights: string[] = [];
    const strongest = planets[0];
    const weakest   = planets[planets.length - 1];
  
    if (strongest) {
      insights.push(`✦ ${strongest.planet} is your strongest planet (${strongest.percent}%) — its dasha periods and significations will give excellent results.`);
    }
    if (weakest && weakest.percent < 45) {
      insights.push(`⚠ ${weakest.planet} is your weakest planet (${weakest.percent}%) — remedies for ${weakest.planet} will significantly improve your life.`);
    }
  
    // Retrograde planets
    const retros = planets.filter(p => p.retrograde);
    if (retros.length > 0) {
      insights.push(`♾ Retrograde planets: ${retros.map(p => p.planet).join(", ")} — these give intense, delayed but powerful results. Don't give up during their dashas.`);
    }
  
    // Multiple strong planets
    const strongPlanets = planets.filter(p => p.percent >= 65);
    if (strongPlanets.length >= 3) {
      insights.push(`✦ ${strongPlanets.length} strong planets (${strongPlanets.map(p=>p.planet).join(", ")}) — your chart has exceptional overall strength.`);
    }
  
    // Weak planets needing attention
    const weakPlanets = planets.filter(p => p.percent < 40);
    if (weakPlanets.length > 0) {
      insights.push(`🙏 Priority remedies needed for: ${weakPlanets.map(p=>p.planet).join(", ")} — these areas of life need conscious attention.`);
    }
  
    // Dig bala special
    const digBalaPlanet = planets.find(p => p.dig >= 9);
    if (digBalaPlanet) {
      insights.push(`⭐ ${digBalaPlanet.planet} has exceptional Dig Bala (directional strength) in House ${digBalaPlanet.house} — career and direction-related matters will flourish.`);
    }
  
    return insights.slice(0, 5);
  }
  
  // ── Bala descriptions export ──────────────────────────────────
  export { BALA_DESC };
  
  // ── Grade color ───────────────────────────────────────────────
  export function gradeColor(grade: ShadbalaPlanet["grade"]): string {
    switch(grade) {
      case "Excellent": return "#c8a030";
      case "Strong":    return "#22c55e";
      case "Moderate":  return "#60a5fa";
      case "Weak":      return "#f97316";
      case "Very Weak": return "#ef4444";
      default:          return "#605890";
    }
  }