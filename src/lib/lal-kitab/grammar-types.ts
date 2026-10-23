export type LalKitabPlanet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type LalKitabRuleConfidence =
  | "cross_checked"
  | "draft_candidate"
  | "needs_more_validation";

export type LalKitabPurchaseRule = {
  id: string;
  planet: LalKitabPlanet;
  title: string;
  objects: string[];
  avoidWhen: string[];
  giftCaution: string[];
  purchaseCaution: string[];
  favourableWhen: string[];
  explanation: string;
  sourceBasis: string[];
  confidence: LalKitabRuleConfidence;
};

export type LalKitabPurchaseInput = {
  currentMahadasha?: LalKitabPlanet;
  currentAntardasha?: LalKitabPlanet;
  currentPratyantardasha?: LalKitabPlanet;
  transitHouses?: Partial<Record<LalKitabPlanet, number[]>>;
  activePlanets?: LalKitabPlanet[];
};

export type LalKitabPurchaseResult = LalKitabPurchaseRule & {
  activeTriggers: string[];
  verdict: "SAFE" | "CAUTION" | "AVOID" | "GIFT_CAUTION";
  score: number;
};
