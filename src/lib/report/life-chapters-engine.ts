import type { ChartData, DashaEntry } from "../astro-engine/calculations";
import type { FusedPattern, LifeChapter, UniversalInsight } from "./insight-schema";

function year(date: Date | string | undefined) {
  if (!date) return "";
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isFinite(parsed.getTime()) ? String(parsed.getFullYear()) : "";
}

function period(entry: DashaEntry | undefined) {
  const start = year(entry?.start);
  const end = year(entry?.end);
  if (!start || !end) return "Timing period";
  return `${start}-${end}`;
}

function chapterForPlanet(planet: string | undefined) {
  switch (planet) {
    case "Sun":
      return {
        title: "Identity & Authority",
        lessons: ["Build self-respect", "Use visibility responsibly", "Lead without ego pressure"],
        avoid: ["Validation hunger", "Power conflicts", "Pride-driven decisions"],
        successLooksLike: "Success looks like calm authority, public credibility and clearer self-direction.",
      };
    case "Moon":
      return {
        title: "Emotional Maturity & Belonging",
        lessons: ["Protect emotional rhythm", "Choose nurturing environments", "Respond instead of reacting"],
        avoid: ["Mood-led decisions", "Over-attachment", "Carrying family anxiety"],
        successLooksLike: "Success looks like emotional steadiness and a safer inner foundation.",
      };
    case "Mars":
      return {
        title: "Action & Courage",
        lessons: ["Channel energy into disciplined action", "Build strength without aggression", "Act decisively"],
        avoid: ["Impulsiveness", "Conflict escalation", "Burnout through force"],
        successLooksLike: "Success looks like focused courage and controlled execution.",
      };
    case "Mercury":
      return {
        title: "Communication & Intelligence",
        lessons: ["Convert ideas into systems", "Use writing, analysis and technology", "Simplify decisions"],
        avoid: ["Overthinking", "Too many parallel ideas", "Information overload"],
        successLooksLike: "Success looks like a useful knowledge system, product, platform or advisory skill.",
      };
    case "Jupiter":
      return {
        title: "Wisdom & Expansion",
        lessons: ["Teach what has been learned", "Expand ethically", "Build faith with discipline"],
        avoid: ["Over-promising", "Comfort-zone growth", "Blind optimism"],
        successLooksLike: "Success looks like wisdom, trust, mentorship and long-range prosperity.",
      };
    case "Venus":
      return {
        title: "Value, Love & Aesthetics",
        lessons: ["Understand true value", "Build refined relationships", "Create beauty with discipline"],
        avoid: ["Pleasure without structure", "Approval-seeking", "Financial indulgence"],
        successLooksLike: "Success looks like balanced love, refined taste and value-based wealth.",
      };
    case "Saturn":
      return {
        title: "Discipline & Maturity",
        lessons: ["Build slowly", "Respect responsibility", "Create durable systems"],
        avoid: ["Fear-based delay", "Excess burden", "Pessimism"],
        successLooksLike: "Success looks like earned authority, stability and long-term respect.",
      };
    case "Rahu":
      return {
        title: "Expansion & Experimentation",
        lessons: ["Think bigger", "Use technology wisely", "Build reach beyond familiar limits"],
        avoid: ["Shortcuts", "Scattered ambition", "Over-promising"],
        successLooksLike: "Success looks like ambition converted into a structured product, platform or public identity.",
      };
    case "Ketu":
      return {
        title: "Detachment & Inner Mastery",
        lessons: ["Simplify life", "Study deeply", "Detach from compulsive outcomes"],
        avoid: ["Withdrawal", "Confusion", "Ignoring practical duties"],
        successLooksLike: "Success looks like quiet mastery, inner clarity and meaningful service.",
      };
    default:
      return {
        title: "Timing Chapter",
        lessons: ["Observe the period theme", "Act with awareness", "Use timing as planning support"],
        avoid: ["Passive waiting", "Fear-based prediction", "Unclear priorities"],
        successLooksLike: "Success looks like better timing, clearer decisions and practical progress.",
      };
  }
}

export function buildLifeChapters(chart: ChartData, insights: UniversalInsight[], patterns: FusedPattern[]): LifeChapter[] {
  const activeMd = chart.dashas.find((entry) => entry.active) ?? chart.dashas[0];
  const activeAd = chart.antardasha.find((entry) => entry.active) ?? chart.antardasha[0];
  const mdTemplate = chapterForPlanet(activeMd?.planet);
  const adTemplate = chapterForPlanet(activeAd?.planet);
  const leadPattern = patterns[0];
  const topInsight = insights[0];

  return [
    {
      title: mdTemplate.title,
      period: period(activeMd),
      theme: `${activeMd?.planet ?? "Current"} Mahadasha`,
      narrative: `This chapter is shaped by ${activeMd?.planet ?? "the active"} Mahadasha. The deeper purpose is to mature the life area represented by this planet and convert its pressure into useful structure. Treat this period as a long-arc operating theme, not a small daily mood.`,
      lessons: mdTemplate.lessons,
      avoid: mdTemplate.avoid,
      successLooksLike: mdTemplate.successLooksLike,
    },
    {
      title: adTemplate.title,
      period: period(activeAd),
      theme: `${activeMd?.planet ?? "Current"}-${activeAd?.planet ?? "Active"} Antardasha`,
      narrative: `This sub-chapter shows the currently active operating theme inside the larger Mahadasha. It is best used for planning, prioritization and knowing which life area deserves more attention now.`,
      lessons: adTemplate.lessons,
      avoid: adTemplate.avoid,
      successLooksLike: adTemplate.successLooksLike,
    },
    {
      title: leadPattern?.title ?? topInsight?.observation ?? "Integrated Life Direction",
      period: "Current strategy",
      theme: "Pattern Fusion",
      narrative: leadPattern?.narrativeSeed.realLife ?? "The combined signals show where effort, timing and self-awareness can work together most productively.",
      lessons: leadPattern?.actions ?? ["Choose one direction", "Build consistency", "Review timing before major choices"],
      avoid: leadPattern?.risks ?? ["Scattered action", "Fear-based decisions", "Ignoring practical readiness"],
      successLooksLike: leadPattern?.narrativeSeed.opportunity ?? "Success looks like converting chart potential into visible, measurable and ethical action.",
    },
  ];
}
