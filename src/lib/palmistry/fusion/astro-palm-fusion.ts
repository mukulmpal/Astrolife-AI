import type { PalmRuleTier } from "../types";
import {
  calculateFusionAgreement,
  calculateThemeConfidence,
  getThemeSignals,
  sortFusionInsights,
} from "./fusion-confidence";
import type {
  AstroPalmFusionInput,
  AstroPalmFusionOutput,
  FusionInsight,
  FusionSignal,
  FusionTheme,
} from "./fusion-types";
import { extractDashaFusionSignals } from "./palm-dasha-fusion";
import { extractKundliFusionSignals } from "./palm-kundli-fusion";
import { extractNumerologyFusionSignals } from "./palm-numerology-fusion";
import { extractPalmFusionSignals } from "./palm-signal-extractor";

const FUSION_VERSION = "astrolife-palm-fusion-v1-phase4a";

const FUSION_THEMES: FusionTheme[] = [
  "personality",
  "career",
  "wealth",
  "relationship",
  "health_vitality",
  "travel",
  "spirituality",
  "education",
  "family",
  "fame",
];

const THEME_LABELS: Record<FusionTheme, string> = {
  personality: "Personality",
  career: "Career",
  wealth: "Wealth",
  relationship: "Relationship",
  health_vitality: "Vitality",
  travel: "Travel / Foreign Connection",
  spirituality: "Spirituality",
  education: "Education / Skill",
  family: "Family",
  fame: "Recognition / Fame",
};

const THEME_GUARDRAILS: Partial<Record<FusionTheme, string>> = {
  health_vitality: "This is not a medical diagnosis. Use only as vitality/lifestyle reflection.",
  relationship: "This does not guarantee marriage, divorce, loyalty, childbirth or relationship outcome.",
  travel: "This does not guarantee travel, visa, foreign settlement or relocation.",
  wealth: "This does not guarantee money, wealth, income or financial outcome.",
  career: "This does not guarantee job, business success, promotion or status.",
  fame: "This does not guarantee fame, public success or recognition.",
};

function getTierLimit(tier: PalmRuleTier) {
  if (tier === "elite") return 10;
  if (tier === "premium") return 7;
  return 3;
}

function buildGuidance(theme: FusionTheme, agreement: string): string[] {
  const base: Record<FusionTheme, string[]> = {
    personality: [
      "Use this as self-awareness, not a fixed identity.",
      "Observe which habits strengthen or weaken this tendency.",
    ],
    career: [
      "Convert the tendency into a practical skill and action plan.",
      "Use dasha timing as a planning window, not a guarantee.",
    ],
    wealth: [
      "Treat this as money-behaviour awareness, not financial certainty.",
      "Use budgeting, risk control and skill-building as remedies.",
    ],
    relationship: [
      "Use this for emotional awareness and communication clarity.",
      "Avoid making irreversible decisions from one sign or one period.",
    ],
    health_vitality: [
      "Use this as a lifestyle-awareness signal only.",
      "Consult a qualified professional for symptoms or health concerns.",
    ],
    travel: [
      "Use this as a movement/relocation tendency only.",
      "Support it with planning, documents and realistic timing.",
    ],
    spirituality: [
      "Use silence, journaling and meditation to refine this tendency.",
      "Keep intuition grounded in practical awareness.",
    ],
    education: [
      "Turn mental potential into structured learning and repetition.",
      "Use skill-building to stabilize this signature.",
    ],
    family: [
      "Use this for responsibility awareness and emotional maturity.",
      "Do not treat family or children signs as guarantees.",
    ],
    fame: [
      "Convert visibility potential into consistent creative output.",
      "Do not depend on recognition; build skill first.",
    ],
  };

  const extra =
    agreement === "strong_alignment"
      ? ["Multiple systems support this theme, so confidence is stronger."]
      : agreement === "contradictory"
        ? ["Signals are mixed, so keep this interpretation conservative."]
        : ["Confidence depends on confirmation from more signs and timing."];

  return [...base[theme], ...extra];
}

function makeInsight(params: {
  theme: FusionTheme;
  palmSignals: FusionSignal[];
  astroSignals: FusionSignal[];
  timingSignals: FusionSignal[];
  numerologySignals: FusionSignal[];
  userTier: PalmRuleTier;
}): FusionInsight | null {
  const allSignals = [
    ...params.palmSignals,
    ...params.astroSignals,
    ...params.timingSignals,
    ...params.numerologySignals,
  ];
  const challengeCount = allSignals.filter((signal) => signal.polarity === "challenge").length;

  const agreement = calculateFusionAgreement({
    palmCount: params.palmSignals.length,
    astroCount: params.astroSignals.length,
    timingCount: params.timingSignals.length,
    numerologyCount: params.numerologySignals.length,
    challengeCount,
  });

  const confidence = calculateThemeConfidence({
    palmSignals: params.palmSignals,
    astroSignals: params.astroSignals,
    timingSignals: params.timingSignals,
    numerologySignals: params.numerologySignals,
    agreement,
  });

  if (confidence < 0.35) return null;

  const label = THEME_LABELS[params.theme];
  const sourceCount = new Set(allSignals.map((signal) => signal.source)).size;

  return {
    id: `fusion_${params.theme}`,
    theme: params.theme,
    title: `${label} Fusion`,
    summary:
      agreement === "strong_alignment"
        ? `Palmistry, astrology timing and supporting systems align around ${label.toLowerCase()} themes.`
        : agreement === "partial_alignment"
          ? `Palmistry and at least one AstroLife system support ${label.toLowerCase()} themes.`
          : agreement === "palm_only"
            ? `Palmistry shows ${label.toLowerCase()} themes, but birth-chart or timing context is missing.`
            : agreement === "astro_only"
              ? `AstroLife chart/timing shows ${label.toLowerCase()} themes, but palm confirmation is limited.`
              : agreement === "contradictory"
                ? `Signals around ${label.toLowerCase()} are mixed, so the reading should stay conservative.`
                : `${label} themes are visible, but confidence depends on more supporting evidence.`,
    confidence,
    agreement,
    palmSignals: params.palmSignals.slice(0, 5),
    astroSignals: params.astroSignals.slice(0, 5),
    timingSignals: params.timingSignals.slice(0, 5),
    numerologySignals: params.numerologySignals.slice(0, 5),
    guidance: buildGuidance(params.theme, agreement),
    guardrails: [
      THEME_GUARDRAILS[params.theme],
      ...allSignals.map((signal) => signal.guardrail).filter(Boolean),
    ].filter(Boolean) as string[],
    tier: sourceCount >= 3 ? "elite" : sourceCount >= 2 ? "premium" : params.userTier,
  };
}

export function createAstroPalmFusion(input: AstroPalmFusionInput): AstroPalmFusionOutput {
  const userTier = input.userTier ?? "premium";

  const palmSignals = extractPalmFusionSignals(input.palmResult);
  const kundliSignals = extractKundliFusionSignals(input.astroContext?.chart);
  const dashaSignals = extractDashaFusionSignals(input.astroContext?.dasha);
  const numerologySignals = extractNumerologyFusionSignals(input.astroContext?.numerology);

  const allSignals = [
    ...palmSignals,
    ...kundliSignals,
    ...dashaSignals,
    ...numerologySignals,
  ];

  const insights = sortFusionInsights(
    FUSION_THEMES.map((theme) =>
      makeInsight({
        theme,
        palmSignals: getThemeSignals(palmSignals, theme),
        astroSignals: getThemeSignals(kundliSignals, theme),
        timingSignals: getThemeSignals(dashaSignals, theme),
        numerologySignals: getThemeSignals(numerologySignals, theme),
        userTier,
      }),
    ).filter(Boolean) as FusionInsight[],
  ).slice(0, getTierLimit(userTier));

  const strongestThemes = insights.slice(0, 5).map((insight) => insight.theme);

  const missingContext: string[] = [];
  if (!input.astroContext?.chart) missingContext.push("kundli/chart context");
  if (!input.astroContext?.dasha) missingContext.push("dasha context");
  if (!input.astroContext?.numerology) missingContext.push("numerology context");

  return {
    fusionVersion: FUSION_VERSION,
    overallSummary: insights.length > 0
      ? `AstroLife Fusion found strongest alignment in: ${strongestThemes.map((theme) => THEME_LABELS[theme]).join(", ")}.`
      : "Fusion confidence is low because supporting palm/chart/timing signals are limited.",
    insights,
    signals: allSignals,
    strongestThemes,
    missingContext,
    disclaimers: [
      "Fusion insights are interpretive and confidence-scored, not certainty.",
      "Palmistry shows visible tendencies; Kundli shows birth blueprint; Dasha shows timing; Numerology shows rhythm.",
      "No medical, legal, financial, marriage, childbirth, travel or career outcome is guaranteed.",
      "Health/vitality output is lifestyle reflection only and not medical diagnosis.",
    ],
  };
}
