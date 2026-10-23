import type {
  AISynthesis,
  FusedPattern,
  ReportNarrativeSection,
  ReportScoreBlock,
  UniversalInsight,
} from "./insight-schema";

function titleFromScoreKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

export function buildAISynthesis(
  insights: UniversalInsight[],
  patterns: FusedPattern[],
  sections: ReportNarrativeSection[],
  scores: ReportScoreBlock
): AISynthesis {
  const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] ?? ["career", 60];
  const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0] ?? ["vitality", 60];
  const leadPattern = patterns[0];
  const strongestInsight = [...insights].sort((a, b) => b.score - a.score)[0];
  const actionPool = [
    ...(leadPattern?.actions ?? []),
    ...(strongestInsight?.actions ?? []),
    ...sections.flatMap((section) => section.actions.slice(0, 1)),
  ];
  const topThreeActions = [...new Set(actionPool)].slice(0, 3);

  return {
    lifeStory:
      "When all major signals are viewed together, this report tells the story of gradual mastery. It does not describe a life dependent only on luck or instant success. The stronger pattern is that knowledge, responsibility, communication, timing and disciplined effort become the foundation of long-term influence.",
    biggestStrength:
      leadPattern?.narrativeSeed.observation ??
      `The biggest strength is ${titleFromScoreKey(strongest[0]).toLowerCase()}, where the report score is ${strongest[1]}/100.`,
    biggestRisk:
      leadPattern?.narrativeSeed.warning ??
      `The biggest risk is ${titleFromScoreKey(weakest[0]).toLowerCase()}, where the score is ${weakest[1]}/100 and better rhythm, boundaries or timing discipline may be needed.`,
    biggestOpportunity:
      leadPattern?.narrativeSeed.opportunity ??
      `The strongest opportunity appears in ${titleFromScoreKey(strongest[0]).toLowerCase()}, where the score is ${strongest[1]}/100. This area should be treated as a long-term growth pillar.`,
    topThreeActions:
      topThreeActions.length >= 3
        ? topThreeActions
        : [
            "Focus on one scalable direction before expanding into multiple products or commitments.",
            "Review timing through dasha, Moon-first transit and practical readiness together.",
            "Protect energy with better boundaries, routine and decision discipline.",
          ],
    finalGuidance:
      "Astrology may show tendencies, timing and recurring patterns, but karma is shaped through choices. Use this report as a mirror and planning system: understand the pattern, act ethically, repeat what works and correct what drains energy.",
  };
}
