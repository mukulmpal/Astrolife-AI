/**
 * ============================================================================
 * ASTROLIFE — EVIDENCE-FIRST REPORT VIEW MODEL & ADAPTERS (PHASE 2K: SPRINT A)
 * ============================================================================
 * Canonical presentation view model transforming frozen KPPredictiveEvidenceContracts
 * into auditable, explainable report sections across PDF, Dashboard, and Chat.
 *
 * Constitutional Principles:
 * 1. Phase 2K may transform, organize, summarize, and explain evidence.
 *    It MUST NEVER create new predictive evidence or recalculate astrology.
 * 2. Single Source of Truth:
 *    KPPredictiveEvidenceContract -> Evidence-First View Model -> Presentation Surfaces.
 * 3. Five-Part UX Contract:
 *    Every section provides What was found, Why it matters, Which rule produced it,
 *    What is uncertain, and What we do NOT claim.
 * 4. Progressive Disclosure:
 *    Casual (L1) -> Curious (L2) -> Technical (L3), all anchored to the same evidence.
 * 5. Zero Prohibited Scoring:
 *    Absolute absence of percentages, confidence scores, probability tiers, or arbitrary ratings.
 * ============================================================================
 */

import type { ChartData } from "../astro-engine/calculations";
import type { KPEngineResult, KPPlanet } from "../astro-engine/kp";
import { KP_EVENT_RULE_REGISTRY } from "../astro-engine/kp-rule-registry";
import type { KPConflictState } from "../astro-engine/kp-conflict-resolver";
import {
  buildKPPredictiveEvidenceContract,
  type KPPredictiveEvidenceContract,
} from "../astro-engine/kp-production-contract";

// ── 1. Types & Presentation Contracts ───────────────────────────────────────

export interface EvidenceFinding {
  findingId: string;
  relationId: string;
  whatWasFound: string;
  whyItMatters: string;
  rule: {
    ruleId: string;
    ruleName: string;
    canonicalSource?: string;
  };
  evidence: {
    nodeIds: string[];
    facts: string[];
  };
  provenance: {
    sourceBook?: string;
    pages?: string;
    epistemologicalStatus: string;
  };
}

export interface FivePartNarrative {
  whatWasFound: string;
  whyItMatters: string;
  whichRuleProducedIt: string;
  whatIsUncertain: string;
  whatWeDoNotClaim: string;
  practicalInterpretation?: string;
}

export interface ProgressiveDisclosure {
  casual: {
    title: string;
    summary: string;
    practicalInterpretation: string;
    /** @deprecated Use practicalInterpretation instead */
    guidance: string;
  };
  curious: {
    cuspEvidence: string;
    dashaEvidence: string;
    transitEvidence: string;
    rpEvidence: string;
    whyAmISeeingThis: string;
  };
  technical: {
    contractVersion: string;
    nodeIds: string[];
    appliedRelations: string[];
    sourceCitations: string[];
    auditHash: string;
  };
}

export interface EvidenceFirstSection {
  sectionId: string;
  topicId: string;
  eventName: string;
  ruleCategory: string;
  synthesis: {
    state: KPConflictState;
    summary: string;
    timingState: string;
    manifestationType: string;
    delayVsDenial: string;
  };
  fivePartNarrative: FivePartNarrative;
  findings: EvidenceFinding[];
  uncertainty: {
    epistemicStatus: string;
    referencePending: boolean;
    limitations: string[];
  };
  boundaries: {
    notClaimed: string[];
  };
  progressiveDisclosure: ProgressiveDisclosure;
}

export interface EvidenceFirstReportPayload {
  reportId: string;
  generatedAt: string;
  sections: EvidenceFirstSection[];
  globalBoundaries: string[];
}

// ── 2. Standard Ethical & Non-Fatalist Boundaries ───────────────────────────

export const STANDARD_ETHICAL_BOUNDARIES = [
  "This interpretation does not guarantee an absolute, unalterable event; human agency, consciousness, and free will remain sovereign.",
  "No diagnostic medical claim is made; this analysis describes astrological timing indicators and does not replace qualified healthcare advice.",
  "No financial guarantee or investment warranty is provided; speculative activities carry independent real-world risks.",
  "Astrological indicators denote set-theoretic timing alignments rather than fatalistic predetermination.",
];

// ── 3. Presentation View Model Adapter ──────────────────────────────────────

/**
 * Builds human-centric, personalized domain narrative based on actual KP astronomical facts.
 * Eliminates repetitive boilerplates and speaks directly to the seeker with dignity, clarity, and precision.
 */
function buildPersonalizedDomainNarrative(contract: KPPredictiveEvidenceContract): {
  whatWasFound: string;
  whyItMatters: string;
  practicalInterpretation: string;
  guidance: string;
} {
  const cusp = contract.primaryCusp;
  const subLord = contract.primaryCuspSubLord;
  const sigHouses = contract.subLordSignifiedHouses.length > 0 ? contract.subLordSignifiedHouses.join(", ") : "केंद्र/त्रिकोण";
  const md = contract.activeDashaLords.mahadasha;
  const ad = contract.activeDashaLords.antardasha;
  const isPositive = contract.synthesisDecision.state.includes("CONFIRMED") ||
    contract.synthesisDecision.state.includes("CORROBORATED") ||
    contract.cuspPromiseVerdict === "PROMISE_SUPPORTED";

  let whatWasFound = "";
  let practicalInterpretation = "";

  const ruleLower = (contract.ruleId + " " + contract.ruleName).toLowerCase();

  if (ruleLower.includes("career") || ruleLower.includes("profession") || cusp === 10) {
    whatWasFound = `आपके दशम भाव (कर्म, नेतृत्व एवं पद-प्रतिष्ठा) के कस्पल उप-स्वामी (Sub-Lord) ${subLord} हैं, जो आपकी जन्म कुंडली में भाव [${sigHouses}] को सक्रिय कर रहे हैं। कृष्णमूर्ति पद्धति (KP) के अनुसार जब दशम उप-स्वामी का संबंध भाव 2 (धन आगमन), 6 (कार्य सिद्धि) या 11 (प्रमोशन व लाभ) से बनता है, तो यह कार्यक्षेत्र में प्रतिष्ठा और स्थायित्व का स्पष्ट संकेत देता है। वर्तमान में ${md} की महादशा और ${ad} की अंतर्दशा के अंतर्गत आपके पेशेवर जीवन में नए अवसर और ज़िम्मेदारियाँ आने के प्रबल योग हैं।`;
    practicalInterpretation = isPositive
      ? "करियर मार्गदर्शन: यह समय अपने पेशेवर कौशल को प्रदर्शित करने और नए दायित्व स्वीकार करने के लिए अत्यंत अनुकूल है। वरिष्ठ अधिकारियों के साथ संवाद में स्पष्टता रखें और आगामी लक्ष्यों पर केंद्रित रहें।"
      : "करियर मार्गदर्शन: कार्यक्षेत्र में संयम और कूटनीति से काम लें। अनावश्यक वाद-विवाद से बचें और कोई भी बड़ा नौकरी परिवर्तन जल्दबाज़ी में करने के बजाय योजनाबद्ध तरीके से करें।";
  } else if (ruleLower.includes("marriage") || ruleLower.includes("nuptial") || ruleLower.includes("union") || cusp === 7) {
    whatWasFound = `आपके सप्तम भाव (विवाह, जीवनसाथी एवं साझेदारी) के कस्पल उप-स्वामी (Sub-Lord) ${subLord} हैं, जो भाव [${sigHouses}] से जुड़े हैं। KP ज्योतिष (Reader III) के अनुसार उप-स्वामी का संबंध भाव 2 (कुटुंब), 7 (दाम्पत्य) और 11 (इच्छा पूर्ति) से होना सुखद साझेदारी का आधार बनता है। वर्तमान ${md}–${ad} दशा चक्र आपके संबंधों में सामंजस्य और पारस्परिक समझ को सुदृढ़ करने के अवसर निर्मित कर रहा है।`;
    practicalInterpretation = isPositive
      ? "वैवाहिक मार्गदर्शन: रिश्तों में परस्पर पारदर्शिता और सम्मान को सर्वोपरि रखें। यदि नए रिश्ते की बात चल रही है, तो पारिवारिक सहमति और साझा मूल्यों के साथ आगे बढ़ना अत्यंत फलदायी रहेगा।"
      : "वैवाहिक मार्गदर्शन: संबंधों में संवेदनशीलता और धैर्य बनाए रखें। किसी भी मतभेद को शांत संवाद से सुलझाएं और भावनात्मक निर्णय लेने में जल्दबाज़ी न करें।";
  } else if (ruleLower.includes("property") || ruleLower.includes("real estate") || cusp === 4) {
    whatWasFound = `आपके चतुर्थ भाव (भूमि, भवन, वाहन एवं सुख-साधन) के कस्पल उप-स्वामी (Sub-Lord) ${subLord} हैं, जिनका संबंध भाव [${sigHouses}] से है। KP सिद्धांतों के अनुसार भाव 4 और 11 का संयोग अचल संपत्ति के अर्जन और पारिवारिक स्थिरता के लिए मंगलकारी माना जाता है। वर्तमान ${md}–${ad} दशा अवधि स्थिर संपत्तियों में बुद्धिमत्तापूर्ण निवेश का संकेत देती है।`;
    practicalInterpretation = isPositive
      ? "संपत्ति मार्गदर्शन: संपत्ति या वाहन क्रय के लिए यह सकारात्मक समय है। क्रय करते समय कानूनी दस्तावेजों और टाइटल डीड की समुचित पुष्टि करें।"
      : "संपत्ति मार्गदर्शन: किसी भी बड़े वित्तीय अनुबंध या ऋण (Loan) से पूर्व बजट का गहन आकलन करें और जल्दबाज़ी में कोई अनुबंध हस्ताक्षर न करें।";
  } else if (ruleLower.includes("foreign") || ruleLower.includes("travel") || cusp === 12 || cusp === 9) {
    whatWasFound = `आपके द्वादश भाव (विदेश यात्रा, दूरस्थ संबंध एवं नए क्षितिज) के कस्पल उप-स्वामी (Sub-Lord) ${subLord} हैं, जो भाव [${sigHouses}] को दर्शा रहे हैं। KP सिद्धांतों के अनुसार भाव 3 (प्रस्थान), 9 (दीर्घ यात्रा) और 12 (अंतरराष्ट्रीय भूमि) का सक्रिय होना अंतरराष्ट्रीय अवसरों और नए अनुभवों का मार्ग प्रशस्त करता है।`;
    practicalInterpretation = isPositive
      ? "यात्रा मार्गदर्शन: अंतरराष्ट्रीय संपर्कों, वीज़ा आवेदन और वैश्विक अवसरों के लिए सक्रिय प्रयास करें। अपने दस्तावेज़ पूर्व-व्यवस्थित रखें।"
      : "यात्रा मार्गदर्शन: दूरगामी योजनाओं में सभी औपचारिकताएं समय पूर्व पूर्ण करें और नए वातावरण में समायोजन के लिए व्यावहारिक दृष्टिकोण अपनाएं।";
  } else {
    whatWasFound = `आपके ${cusp}वें भाव के कस्पल उप-स्वामी (Sub-Lord) ${subLord} हैं, जो कुंडली में भाव [${sigHouses}] को सक्रिय कर रहे हैं। वर्तमान समय में ${md} महादशा और ${ad} अंतर्दशा के प्रभाव से यह जीवन क्षेत्र महत्वपूर्ण परिवर्तन और विकास के दौर में है।`;
    practicalInterpretation = isPositive
      ? "व्यावहारिक मार्गदर्शन: वर्तमान ग्रह योग आपके संकल्पों का समर्थन कर रहे हैं। योजनाबद्ध तरीके से अपने प्रयासों को गति दें।"
      : "व्यावहारिक मार्गदर्शन: वर्तमान समय धैर्य और आंतरिक संतुलन का है। किसी भी निर्णय से पूर्व अनुभवी व्यक्तियों का परामर्श अवश्य लें।";
  }

  const whyItMatters = `इस विषय का मुख्य भाव कस्प ${cusp} है, जिसके निर्णायक उप-स्वामी ${subLord} (भाव: ${sigHouses}) हैं। वर्तमान समय का नियंत्रण महादशा स्वामी ${md} एवं अंतर्दशा स्वामी ${ad} के अधीन है।`;
  const guidance = practicalInterpretation;

  return { whatWasFound, whyItMatters, practicalInterpretation, guidance };
}

/**
 * Transforms an immutable KPPredictiveEvidenceContract into a structured EvidenceFirstSection.
 * Pure presentation adapter: zero recalculation of astrology.
 */
export function buildEvidenceFirstSection(
  contract: KPPredictiveEvidenceContract
): EvidenceFirstSection {
  const isReferencePending = contract.ruleStatus === "Reference_Pending";

  // Build Individual Findings
  const findings: EvidenceFinding[] = contract.conflictFindings.map((cf, idx) => ({
    findingId: `FINDING-${contract.ruleId}-${idx + 1}`,
    relationId: cf.relationId,
    whatWasFound: `Precedence relation ${cf.relationId} was applied between ${cf.primaryLayer} and ${cf.subordinateLayer ?? "Downstream Timing"}.`,
    whyItMatters: cf.rationale || "Defines how conflicting layer signals resolve under classical Krishnamurti Paddhati principles.",
    rule: {
      ruleId: contract.ruleId,
      ruleName: contract.ruleName,
      canonicalSource: contract.canonicalSource,
    },
    evidence: {
      nodeIds: contract.authorizedEvidenceNodeIds,
      facts: [
        `Primary Cusp Sub-Lord: ${contract.primaryCuspSubLord}`,
        `Cusp Promise Verdict: ${contract.cuspPromiseVerdict}`,
        `Dasha Timing State: ${contract.dashaTimingState}`,
        `Transit State: ${contract.transitState}`,
        `Ruling Planets State: ${contract.rulingPlanetsState}`,
      ],
    },
    provenance: {
      sourceBook: cf.provenance.sourceBook || "Classical KP Reference",
      pages: cf.provenance.pages || "Passage pending verification",
      epistemologicalStatus: cf.provenance.verificationStatus || contract.ruleStatus,
    },
  }));

  // Build Personalized, Human Domain Narrative
  const domainNarrative = buildPersonalizedDomainNarrative(contract);
  const whatWasFound = domainNarrative.whatWasFound;
  const whyItMatters = domainNarrative.whyItMatters;
  const practicalInterpretation = domainNarrative.practicalInterpretation;

  // Part 3: Which Rule Produced It
  const whichRuleProducedIt = isReferencePending
    ? `Classified under ${contract.ruleId} (${contract.ruleName}). Synthesis halted under classical epistemic safeguard REL-10 (Missing Classical Precedence Rule).`
    : `Evaluated under ${contract.ruleId} (${contract.ruleName}). Canonical source: ${contract.canonicalSource}. Applied precedence: ${contract.conflictFindings.map((f) => `${f.relationId} (${f.provenance.sourceBook}, ${f.provenance.pages})`).join("; ") || "Direct alignment"}.`;

  // Part 4: What Is Uncertain
  const limitations: string[] = [
    `Classification status: ${contract.ruleStatus}.`,
    `Evaluation window: Reflects active Dasha lords (${contract.activeDashaLords.mahadasha} / ${contract.activeDashaLords.antardasha}) and current transit snapshot.`,
  ];
  if (isReferencePending) {
    limitations.push("Classical KP literature lacks attested classical literature and verified multi-layer precedence for modern intraday/speculative financial markets. Precedence resolution is deliberately withheld.");
  }
  const whatIsUncertain = isReferencePending
    ? "Predictive outcome is strictly uncertain because classical literature does not provide an attested conflict rule for modern speculative trading."
    : `This evaluation represents the active timing window under period lords ${contract.activeDashaLords.mahadasha}-${contract.activeDashaLords.antardasha}. Future sub-period shifts will alter the activation profile.`;

  // Part 5: What We Do NOT Claim
  const notClaimed: string[] = [
    ...STANDARD_ETHICAL_BOUNDARIES,
    `No certainty is claimed beyond the deterministic significators of Cusp ${contract.primaryCusp}.`,
  ];
  const whatWeDoNotClaim = "AstroLife does not guarantee events or fate. Astrological factors represent conditional tendencies, timing windows, and psychological rhythms. Personal discernment and ethical effort remain paramount.";

  const fivePartNarrative: FivePartNarrative = {
    whatWasFound,
    whyItMatters,
    whichRuleProducedIt,
    whatIsUncertain,
    whatWeDoNotClaim,
    practicalInterpretation,
  };

  // Progressive Disclosure: 3 User Levels
  const progressiveDisclosure: ProgressiveDisclosure = {
    casual: {
      title: contract.ruleName,
      summary: whatWasFound,
      practicalInterpretation,
      guidance: domainNarrative.guidance,
    },
    curious: {
      cuspEvidence: `Cusp ${contract.primaryCusp} Sub-Lord ${contract.primaryCuspSubLord} signifies houses [${contract.subLordSignifiedHouses.join(", ")}], yielding verdict ${contract.cuspPromiseVerdict}.`,
      dashaEvidence: `Active running lords: MD ${contract.activeDashaLords.mahadasha}, AD ${contract.activeDashaLords.antardasha} (${contract.dashaTimingState}).`,
      transitEvidence: `Transit state: ${contract.transitState}. ${contract.transitSummary}`,
      rpEvidence: `Ruling Planets state: ${contract.rulingPlanetsState}. Matched lords: ${contract.rulingPlanetsMatchedLords.join(", ") || "None"}.`,
      whyAmISeeingThis: whyItMatters,
    },
    technical: {
      contractVersion: contract.contractVersion,
      nodeIds: contract.authorizedEvidenceNodeIds,
      appliedRelations: contract.conflictFindings.map((f) => f.relationId),
      sourceCitations: contract.conflictFindings.map((f) => `${f.relationId}: ${f.provenance.sourceBook}, ${f.provenance.pages}`),
      auditHash: `AUDIT-${contract.ruleId}-${contract.synthesisDecision.state}-${contract.conflictFindings.map((f) => f.relationId).join("-")}`,
    },
  };

  return {
    sectionId: `SECTION-${contract.ruleId}`,
    topicId: contract.ruleId,
    eventName: contract.ruleName,
    ruleCategory: contract.ruleCategory,
    synthesis: {
      state: contract.synthesisDecision.state,
      summary: contract.synthesisDecision.summaryVerdict,
      timingState: contract.dashaTimingState,
      manifestationType: contract.synthesisDecision.expectedManifestationType,
      delayVsDenial: contract.synthesisDecision.delayVsDenial,
    },
    fivePartNarrative,
    findings,
    uncertainty: {
      epistemicStatus: contract.ruleStatus,
      referencePending: isReferencePending,
      limitations,
    },
    boundaries: {
      notClaimed,
    },
    progressiveDisclosure,
  };
}

// ── 4. Comprehensive Report Payload Builder ─────────────────────────────────

const KEY_REPORT_RULE_IDS = [
  "KP-RULE-MARRIAGE-01",
  "KP-RULE-PROPERTY-ACQUISITION-01",
  "KP-RULE-CAREER-JOB-01",
  "KP-RULE-FOREIGN-TRAVEL-01",
  "KP-RULE-SPECULATIVE-GAINS-01",
];

/**
 * Builds the comprehensive Evidence-First Report payload from a calculated chart
 * and KPEngineResult across all key life areas.
 */
export function buildEvidenceFirstReport(
  chart: ChartData,
  kpResult: KPEngineResult
): EvidenceFirstReportPayload {
  const sections: EvidenceFirstSection[] = [];

  for (const ruleId of KEY_REPORT_RULE_IDS) {
    if (KP_EVENT_RULE_REGISTRY[ruleId]) {
      const contract = buildKPPredictiveEvidenceContract(chart, kpResult, ruleId);
      sections.push(buildEvidenceFirstSection(contract));
    }
  }

  return {
    reportId: `ASTROLIFE-EVIDENCE-REPORT-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    sections,
    globalBoundaries: STANDARD_ETHICAL_BOUNDARIES,
  };
}

// ── 5. Lossless Serialization & Deserialization ─────────────────────────────

export function serializeEvidenceFirstReport(payload: EvidenceFirstReportPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function deserializeEvidenceFirstReport(json: string): EvidenceFirstReportPayload {
  const parsed = JSON.parse(json);
  if (!parsed.reportId || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid EvidenceFirstReportPayload JSON format");
  }
  return parsed as EvidenceFirstReportPayload;
}

// ── 6. Presentation Surface Adapters (Semantic Identity Verification) ───────

/**
 * Adapts an EvidenceFirstSection for the PDF renderer design system.
 */
export function renderSectionForPdfAdapter(section: EvidenceFirstSection): Record<string, unknown> {
  return {
    component: "PdfEvidenceSection",
    id: section.sectionId,
    title: section.eventName,
    synthesisBadge: section.synthesis.state,
    whatWasFoundText: section.fivePartNarrative.whatWasFound,
    whyItMattersText: section.fivePartNarrative.whyItMatters,
    ruleCitationText: section.fivePartNarrative.whichRuleProducedIt,
    uncertaintyBox: section.fivePartNarrative.whatIsUncertain,
    boundariesNotice: section.fivePartNarrative.whatWeDoNotClaim,
    findingsCount: section.findings.length,
    underlyingState: section.synthesis.state,
    underlyingRelations: section.progressiveDisclosure.technical.appliedRelations,
    provenanceCitations: section.progressiveDisclosure.technical.sourceCitations,
  };
}

/**
 * Adapts an EvidenceFirstSection for the interactive Dashboard UI.
 */
export function renderSectionForDashboardAdapter(section: EvidenceFirstSection): Record<string, unknown> {
  return {
    component: "DashboardEvidenceDrawer",
    id: section.sectionId,
    eventName: section.eventName,
    stateChip: section.synthesis.state,
    casualView: section.progressiveDisclosure.casual,
    curiousView: section.progressiveDisclosure.curious,
    technicalView: section.progressiveDisclosure.technical,
    findings: section.findings,
    underlyingState: section.synthesis.state,
    underlyingRelations: section.progressiveDisclosure.technical.appliedRelations,
    provenanceCitations: section.progressiveDisclosure.technical.sourceCitations,
  };
}
