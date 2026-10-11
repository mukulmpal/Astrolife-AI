// src/lib/astro-engine/event-radar.ts

import {
    calculateTransitReport,
    NatalChartForTransit,
    TransitAreaScore,
    TransitAlert,
    TransitBase,
  } from "./transits";
import { assertEventRadarReportContract } from "./contracts";
  
  export type EventRadarArea =
    | "career"
    | "love"
    | "money"
    | "health"
    | "family"
    | "spirituality";
  
  export type EventRadarSignal =
    | "excellent"
    | "good"
    | "mixed"
    | "caution"
    | "sensitive";
  
  export interface NavataraInfo {
    number: number; // 1-9
    name: string; // Janma, Sampat, Vipat, etc.
    quality: "Auspicious" | "Caution" | "Neutral" | "Severe";
    cycle: number; // 1, 2, 3
    cycleName: string; // Pratyak, Karma, Adhana
    description: string;
    guidance: string;
  }

  export type DecisionWindowType = "Peak Launch" | "Steady Progress" | "Audit & Rest" | "High Caution";

  export interface ActionChecklistItem {
    action: string;
    category: "do" | "dont";
  }

  export interface EventRadarDay {
    date: string;
    weekday: string;
    label: string;
    overallScore: number;
    signal: EventRadarSignal;
    bestArea: EventRadarArea;
    cautionArea: EventRadarArea;
    areaScores: TransitAreaScore[];
    topAlerts: TransitAlert[];
    opportunities: TransitAlert[];
    scoreRationale: string[];
    advice: string;
    remedy: string;
    aiContext: string;
    // Classical Vedic & Cognitive additions
    tara?: NavataraInfo;
    isChandrashtama: boolean;
    chandrashtamaDetail?: string;
    moonNakshatra: string;
    moonRashi: string;
    decisionWindow: DecisionWindowType;
    actionChecklist: ActionChecklistItem[];
    cognitiveReadiness: number;
    confidencePct: number;
  }
  
  export interface EventRadarReport {
    generatedAt: string;
    base: TransitBase;
    days: EventRadarDay[];
    bestDay: EventRadarDay;
    cautionDay: EventRadarDay;
    summary: string;
    aiContext: string;
  }
  
  function formatDateLabel(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }
  
  function formatWeekday(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
    });
  }
  
  function clamp(value: number, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }
  
  function getSignal(score: number): EventRadarSignal {
    if (score >= 76) return "excellent";
    if (score >= 62) return "good";
    if (score >= 45) return "mixed";
    if (score >= 30) return "caution";
    return "sensitive";
  }
  
  function getSignalAdvice(signal: EventRadarSignal, bestArea: EventRadarArea) {
    if (signal === "excellent") {
      return `Strong day. Take bold action in ${bestArea}, pitch ideas, start important work, or make a clear decision.`;
    }
  
    if (signal === "good") {
      return `Supportive day. Move steadily in ${bestArea}, but avoid overconfidence.`;
    }
  
    if (signal === "mixed") {
      return `Balanced day. Good for planning, review and moderate action. Avoid extreme decisions.`;
    }
  
    if (signal === "caution") {
      return `Caution day. Slow down, double-check commitments, and avoid emotional or impulsive decisions.`;
    }
  
    return `Sensitive day. Keep schedule light, rest more, avoid conflict, and focus on remedies or inner clarity.`;
  }
  
  function getRemedy(signal: EventRadarSignal, alerts: TransitAlert[]) {
    const hasSaturn = alerts.some((a) => a.planets.includes("Saturn"));
    const hasMars = alerts.some((a) => a.planets.includes("Mars"));
    const hasRahu = alerts.some((a) => a.planets.includes("Rahu"));
    const hasMoon = alerts.some((a) => a.planets.includes("Moon"));
  
    if (hasSaturn) {
      return "Offer sesame oil diya or donate black sesame/food to needy. Practice patience and discipline.";
    }
  
    if (hasMars) {
      return "Avoid anger, drive carefully, chant Hanuman Chalisa or do physical exercise calmly.";
    }
  
    if (hasRahu) {
      return "Avoid confusion, addiction, overthinking and risky shortcuts. Feed stray dogs or meditate for grounding.";
    }
  
    if (hasMoon) {
      return "Keep emotional calm, hydrate well, call family, and chant Om Som Somaya Namah.";
    }
  
    if (signal === "excellent" || signal === "good") {
      return "Use the day actively. Offer gratitude, start with prayer, and take practical action.";
    }
  
    return "Keep actions simple. Light a diya, avoid arguments, and sleep on time.";
  }
  
  function averageAreaScore(areaScores: TransitAreaScore[]) {
    if (!areaScores.length) return 50;
  
    const total = areaScores.reduce((sum, area) => sum + area.score, 0);
    return Math.round(total / areaScores.length);
  }
  
  function getBestArea(areaScores: TransitAreaScore[]): EventRadarArea {
    const sorted = [...areaScores].sort((a, b) => b.score - a.score);
    return sorted[0]?.area ?? "career";
  }
  
  function getCautionArea(areaScores: TransitAreaScore[]): EventRadarArea {
    const sorted = [...areaScores].sort((a, b) => a.score - b.score);
    return sorted[0]?.area ?? "health";
  }
  
  function moonDailyBoost(dayIndex: number) {
    // Artificial smoothing based on Moon-like daily rhythm.
    // This makes 7-day radar more usable because slow planets do not change much daily.
    const cycle = [2, 5, 8, 12, 9, 6, 3];
    return cycle[dayIndex % cycle.length];
  }
  
  function normalizeOverallScore(params: {
    rawAverage: number;
    highAlerts: number;
    mediumAlerts: number;
    opportunities: number;
    dayIndex: number;
  }) {
    const { rawAverage, highAlerts, mediumAlerts, opportunities, dayIndex } = params;
  
    // Pull very low averages closer to practical user-facing range.
    // Example: raw 35 becomes around 47, not instantly "Sensitive".
    let score = 50 + (rawAverage - 50) * 0.65;
  
    // Softer penalties. Earlier penalties were too harsh.
    score -= highAlerts * 4;
    score -= mediumAlerts * 2;
  
    // Opportunities should visibly improve the day.
    score += opportunities * 5;
  
    // Moon-style daily rhythm for better 7-day variation.
    score += moonDailyBoost(dayIndex);
  
    return Math.round(clamp(score));
  }

  function buildScoreRationale(params: {
    rawAverage: number;
    highAlerts: number;
    mediumAlerts: number;
    opportunities: number;
    dayIndex: number;
    bestArea: EventRadarArea;
    cautionArea: EventRadarArea;
  }) {
    const rationale = [
      `Area average starts at ${params.rawAverage}/100; strongest area is ${params.bestArea}.`,
      `${params.highAlerts} high and ${params.mediumAlerts} medium caution alerts adjusted the score.`,
      `${params.opportunities} opportunity signals plus daily Moon rhythm added usable variation.`,
    ];

    if (params.bestArea !== params.cautionArea) {
      rationale.push(`Use ${params.bestArea} for action and keep ${params.cautionArea} lighter.`);
    }

    if (params.dayIndex === 0) {
      rationale.push("Today is weighted as the practical anchor for immediate planning.");
    }

    return rationale;
  }
  
  function buildDayAiContext(day: EventRadarDay) {
    const areaLines = day.areaScores
      .map((area) => `${area.area}: ${area.score}/100 — ${area.summary}`)
      .join("\n");
  
    const alertLines = day.topAlerts.length
      ? day.topAlerts
          .map(
            (alert) =>
              `${alert.severity.toUpperCase()}: ${alert.title} — ${alert.description}`
          )
          .join("\n")
      : "No major caution alert.";
  
    const opportunityLines = day.opportunities.length
      ? day.opportunities
          .map((alert) => `${alert.title} — ${alert.description}`)
          .join("\n")
      : "No major opportunity alert.";
  
    return `
  Event Radar Day: ${day.label} (${day.weekday})
  Overall Score: ${day.overallScore}/100
  Signal: ${day.signal}
  Best Area: ${day.bestArea}
  Caution Area: ${day.cautionArea}
  
  Area Scores:
  ${areaLines}
  
  Caution Alerts:
  ${alertLines}
  
  Opportunities:
  ${opportunityLines}
  
  Advice:
  ${day.advice}
  
  Remedy:
  ${day.remedy}

  Score Rationale:
  ${day.scoreRationale.join("\n")}
  `.trim();
  }
  
  function buildSummary(days: EventRadarDay[]) {
    const bestDay = [...days].sort((a, b) => b.overallScore - a.overallScore)[0];
    const cautionDay = [...days].sort((a, b) => a.overallScore - b.overallScore)[0];
  
    return `Best upcoming day is ${bestDay.label} for ${bestDay.bestArea}. Most sensitive day is ${cautionDay.label}, especially for ${cautionDay.cautionArea}. Use strong days for action and sensitive days for review, patience and remedies.`;
  }
  
  const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ];

  const TARA_NAMES = [
    "Janma", "Sampat", "Vipat", "Kshema", "Pratyari", "Sadhaka", "Vadh", "Mitra", "Parama Mitra"
  ];

  const TARA_META: Record<string, { quality: "Auspicious" | "Caution" | "Neutral" | "Severe"; description: string; guidance: string }> = {
    Janma: {
      quality: "Neutral",
      description: "Birth Tara · Mind and body vitality. Emotionally sensitive; ideal for personal reflection, meditation and steady routine.",
      guidance: "Avoid unnecessary friction. Maintain physical equilibrium and hydration.",
    },
    Sampat: {
      quality: "Auspicious",
      description: "Wealth & Prosperity Tara · Resource accumulation and financial flow. Excellent for contract talks, transactions, and career pitches.",
      guidance: "Proactively advance commercial commitments and financial planning.",
    },
    Vipat: {
      quality: "Caution",
      description: "Hazard / Obstacle Tara · Unforeseen delays, communication misfires, or logistical friction. Caution with new contracts.",
      guidance: "Buffer schedules, verify fine print, and defer irreversible commitments.",
    },
    Kshema: {
      quality: "Auspicious",
      description: "Well-being & Security Tara · Comfort, recovery, peaceful collaboration, and protective shielding.",
      guidance: "Consolidate existing gains, nurture key relationships, and execute safely.",
    },
    Pratyari: {
      quality: "Caution",
      description: "Opposition & Friction Tara · High vulnerability to conflict, adversarial debates, or stubborn pushback.",
      guidance: "Stay diplomatic, do not escalate disputes, and rely on documented facts.",
    },
    Sadhaka: {
      quality: "Auspicious",
      description: "Accomplishment & Success Tara · Peak executive execution. Turning strategies into tangible victories.",
      guidance: "Push ambitious milestones, launch important projects, and take confident action.",
    },
    Vadh: {
      quality: "Severe",
      description: "Destruction / Vulnerability Tara · Classical danger point. Heavy nervous strain or unexpected derailment risk.",
      guidance: "Keep profile low, avoid high-stakes risks, and prioritize restoration and remedies.",
    },
    Mitra: {
      quality: "Auspicious",
      description: "Friendship & Alliance Tara · Warmth, social goodwill, productive negotiations, and mutual support.",
      guidance: "Network actively, resolve past misunderstandings, and build strategic alliances.",
    },
    "Parama Mitra": {
      quality: "Auspicious",
      description: "Supreme Benefactor Tara · Deepest cosmic grace, mentorship breakthroughs, and life-changing milestones.",
      guidance: "Take bold collaborative steps and seek guidance from mentors and seniors.",
    },
  };

  function getNatalMoonNakshatraIndex(chart: NatalChartForTransit): number {
    const moon = chart.planets?.Moon;
    if (!moon) return 0;
    if (moon.nakshatra) {
      const idx = NAKSHATRAS.findIndex(n => n.toLowerCase() === moon.nakshatra?.toLowerCase());
      if (idx >= 0) return idx;
    }
    if (typeof moon.longitude === "number") {
      return Math.floor(moon.longitude / (360 / 27)) % 27;
    }
    return Math.floor((moon.rashi * 30 + 15) / (360 / 27)) % 27;
  }

  export function calculateEventRadarReport(params: {
    chart: NatalChartForTransit;
    startDate?: Date;
    days?: number;
    base?: TransitBase;
  }): EventRadarReport {
    const startDate = params.startDate ?? new Date();
    const totalDays = params.days ?? 7;
    const base = params.base ?? "moon";
    const natalMoonNakIdx = getNatalMoonNakshatraIndex(params.chart);
    const natalMoonRashiIdx = params.chart.planets?.Moon?.rashi ?? 0;
  
    const radarDays: EventRadarDay[] = [];
  
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(12, 0, 0, 0);
  
      const transit = calculateTransitReport({
        chart: params.chart,
        date,
        base,
      });
  
      const cautionAlerts = transit.alerts
        .filter((alert) => alert.severity === "high" || alert.severity === "medium")
        .slice(0, 3);
  
      const opportunities = transit.alerts
        .filter((alert) => alert.type === "opportunity")
        .slice(0, 3);
  
      const highAlerts = cautionAlerts.filter((a) => a.severity === "high").length;
      const mediumAlerts = cautionAlerts.filter((a) => a.severity === "medium").length;
  
      const rawAverage = averageAreaScore(transit.areaScores);
  
      const transitMoon = transit.planets.find((p) => p.planet === "Moon");
      const transitMoonLon = transitMoon?.longitude ?? 0;
      const transitMoonNakIdx = Math.floor(transitMoonLon / (360 / 27)) % 27;
      const transitMoonNakName = NAKSHATRAS[transitMoonNakIdx] ?? "Ashwini";
      const transitMoonRashiName = transitMoon?.rashiName ?? "Aries";
      const transitMoonRashiIdx = transitMoon?.rashi ?? 0;

      // Navatara computation
      const taraDiff = ((transitMoonNakIdx - natalMoonNakIdx + 27) % 27) + 1; // 1 to 27
      const taraCycle = Math.ceil(taraDiff / 9); // 1, 2, or 3
      const taraPos = ((taraDiff - 1) % 9) + 1; // 1 to 9
      const taraName = TARA_NAMES[taraPos - 1];
      const taraMeta = TARA_META[taraName] ?? TARA_META.Janma;
      const cycleNames = ["", "Pratyak (Immediate)", "Karma (Work/Action)", "Adhana (Spiritual/Essence)"];

      const tara: NavataraInfo = {
        number: taraPos,
        name: taraName,
        quality: taraMeta.quality,
        cycle: taraCycle,
        cycleName: cycleNames[taraCycle] ?? "Pratyak",
        description: taraMeta.description,
        guidance: taraMeta.guidance,
      };

      // Chandrashtama detection (8th rashi from natal Moon)
      const isChandrashtama = transitMoonRashiIdx === ((natalMoonRashiIdx + 7) % 12);
      const chandrashtamaDetail = isChandrashtama
        ? "Moon transits your 8th house (Chandrashtama). Classical Phaladeepika Ch. 26 warns of mental restlessness and volatile moods; postpone irreversible contracts, risky investments, or surgical procedures."
        : undefined;

      let overallScore = normalizeOverallScore({
        rawAverage,
        highAlerts,
        mediumAlerts,
        opportunities: opportunities.length,
        dayIndex: i,
      });

      // Calibrate score with Tara & Chandrashtama
      if (isChandrashtama) {
        overallScore = Math.max(22, overallScore - 14);
      }
      if (tara.quality === "Auspicious") {
        overallScore = Math.min(98, overallScore + 6);
      } else if (tara.quality === "Severe") {
        overallScore = Math.max(18, overallScore - 12);
      } else if (tara.quality === "Caution") {
        overallScore = Math.max(28, overallScore - 6);
      }

      // Decision Window & Checklist
      let decisionWindow: DecisionWindowType;
      if (isChandrashtama || tara.quality === "Severe") {
        decisionWindow = "High Caution";
      } else if (tara.quality === "Caution" || overallScore < 46) {
        decisionWindow = "Audit & Rest";
      } else if (overallScore >= 70 && tara.quality === "Auspicious") {
        decisionWindow = "Peak Launch";
      } else {
        decisionWindow = "Steady Progress";
      }

      const actionChecklist: ActionChecklistItem[] = [];
      if (decisionWindow === "Peak Launch") {
        actionChecklist.push({ action: `Launch high-leverage milestones in ${transit.areaScores[0]?.area ?? "career"}.`, category: "do" });
        actionChecklist.push({ action: "Pitch ideas to decision-makers and close binding agreements.", category: "do" });
        actionChecklist.push({ action: "Do not let indecision delay bold, decisive execution.", category: "dont" });
      } else if (decisionWindow === "Steady Progress") {
        actionChecklist.push({ action: "Maintain disciplined cadence on existing projects.", category: "do" });
        actionChecklist.push({ action: "Hold structured alignment meetings and document decisions.", category: "do" });
        actionChecklist.push({ action: "Avoid uncalculated speculative gambles.", category: "dont" });
      } else if (decisionWindow === "Audit & Rest") {
        actionChecklist.push({ action: "Audit code, review budgets, and clean up technical or mental debt.", category: "do" });
        actionChecklist.push({ action: "Prioritize nervous system recovery, hydration, and early rest.", category: "do" });
        actionChecklist.push({ action: "Avoid entering tense negotiations or public arguments.", category: "dont" });
      } else {
        actionChecklist.push({ action: "Stick to calm back-office routines and meditative grounding.", category: "do" });
        actionChecklist.push({ action: "Double-check travel bookings, communications, and numbers.", category: "do" });
        actionChecklist.push({ action: "Strictly avoid high-stakes contracts, surgeries, or major emotional debates.", category: "dont" });
      }

      const cognitiveReadiness = Math.round(clamp(
        overallScore * 0.75 + (tara.quality === "Auspicious" ? 18 : tara.quality === "Severe" ? -22 : isChandrashtama ? -18 : 4),
        15,
        99
      ));

      const confidencePct = Math.round(clamp(94 - i * 0.45, 78, 96));

      const bestArea = getBestArea(transit.areaScores);
      const cautionArea = getCautionArea(transit.areaScores);
      const signal = getSignal(overallScore);
      const advice = isChandrashtama
        ? `Chandrashtama period: Maintain emotional detachment, avoid confrontations, and focus on steady analytical work.`
        : getSignalAdvice(signal, bestArea);
      const remedy = getRemedy(signal, cautionAlerts);
      const scoreRationale = buildScoreRationale({
        rawAverage,
        highAlerts,
        mediumAlerts,
        opportunities: opportunities.length,
        dayIndex: i,
        bestArea,
        cautionArea,
      });

      if (isChandrashtama) {
        scoreRationale.unshift("Chandrashtama active: Moon transiting 8th from Janma Rashi, reducing raw cognitive margin.");
      }
      scoreRationale.unshift(`Navatara is ${tara.name} (${tara.quality}) in ${tara.cycleName} cycle.`);
  
      const day: EventRadarDay = {
        date: date.toISOString(),
        weekday: formatWeekday(date),
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : formatDateLabel(date),
        overallScore,
        signal,
        bestArea,
        cautionArea,
        areaScores: transit.areaScores,
        topAlerts: cautionAlerts,
        opportunities,
        scoreRationale,
        advice,
        remedy,
        aiContext: "",
        tara,
        isChandrashtama,
        chandrashtamaDetail,
        moonNakshatra: transitMoonNakName,
        moonRashi: transitMoonRashiName,
        decisionWindow,
        actionChecklist,
        cognitiveReadiness,
        confidencePct,
      };
  
      day.aiContext = buildDayAiContext(day);
      radarDays.push(day);
    }
  
    const bestDay = [...radarDays].sort((a, b) => b.overallScore - a.overallScore)[0];
    const cautionDay = [...radarDays].sort((a, b) => a.overallScore - b.overallScore)[0];
    const summary = buildSummary(radarDays);
  
    const report = {
      generatedAt: new Date().toISOString(),
      base,
      days: radarDays,
      bestDay,
      cautionDay,
      summary,
      aiContext: `
  Event Radar Report
  Base: ${base}
  Summary: ${summary}
  
  Days:
  ${radarDays.map((day) => day.aiContext).join("\n\n---\n\n")}
  `.trim(),
    };
    assertEventRadarReportContract(report);
    return report;
  }
