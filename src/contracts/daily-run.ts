export const DAILY_DOMAINS = [
  "overall",
  "work",
  "money",
  "love",
  "relationships",
  "communication",
  "health_energy",
  "inner_state",
  "creativity_learning",
  "decision_making",
  "action",
  "change_movement",
] as const;

export type DailyDomain = (typeof DAILY_DOMAINS)[number];

export const DIRECTION_VALUES = [
  "very_negative",
  "negative",
  "neutral",
  "positive",
  "very_positive",
  "insufficient_signal",
] as const;
export type Direction = (typeof DIRECTION_VALUES)[number];

export const RELEVANCE_VALUES = ["none", "weak", "moderate", "strong", "dominant"] as const;
export type Relevance = (typeof RELEVANCE_VALUES)[number];

export const METHOD_TIMING_DIRECTION_VALUES = [
  "challenging",
  "neutral",
  "supportive",
] as const;
export type MethodTimingDirection = (typeof METHOD_TIMING_DIRECTION_VALUES)[number];

export const LEVEL_VALUES = ["low", "medium", "high"] as const;
export type ReadinessLevel = (typeof LEVEL_VALUES)[number];

export const RISK_VALUES = ["low", "moderate", "high"] as const;
export type RiskLevel = (typeof RISK_VALUES)[number];

export const PRIMARY_SIGNAL_VALUES = [
  "growth",
  "connection",
  "execution",
  "reflection",
  "transition",
  "recovery",
  "caution",
] as const;
export type PrimarySignal = (typeof PRIMARY_SIGNAL_VALUES)[number];

export const DAY_PARTS = ["morning", "afternoon", "evening", "late_night"] as const;
export type DayPart = (typeof DAY_PARTS)[number];

export const YES_NO_VALUES = ["yes", "no"] as const;
export type YesNo = (typeof YES_NO_VALUES)[number];

export const AGREEMENT_STATE_VALUES = [
  "single_method",
  "agreement",
  "partial_disagreement",
  "disagreement",
  "insufficient_coverage",
  "exact_agreement",
  "majority_agreement",
  "mixed",
  "no_consensus",
] as const;
export type AgreementState = (typeof AGREEMENT_STATE_VALUES)[number];

export const DISAGREEMENT_CLASSIFICATION_VALUES = [
  "no_disagreement",
  "direction_disagreement",
  "focus_disagreement",
  "insufficient_information",
] as const;
export type DisagreementClassification =
  (typeof DISAGREEMENT_CLASSIFICATION_VALUES)[number];

export interface SubjectRef {
  readonly id: string;
  readonly label: string;
  readonly dataClass: "fictional_fixture" | "private_runtime";
}

export interface Provenance {
  readonly sourceType: "fictional_fixture" | "calculation_engine" | "research_note";
  readonly sourceId: string;
  readonly producer: string;
  readonly methodVersion: string;
  readonly createdAt: string;
  readonly notes: readonly string[];
}

export interface CalculationFact {
  readonly id: string;
  readonly category: string;
  readonly statement: string;
}

export interface TimingSignal {
  readonly dayPart: DayPart;
  readonly startLocal: string;
  readonly endLocal: string;
  readonly direction: MethodTimingDirection;
  readonly summary: string;
  readonly basisFactIds: readonly string[];
}

export interface MethodObservation {
  readonly methodId: string;
  readonly subject: SubjectRef;
  readonly targetDate: string;
  readonly targetTimezone: string;
  readonly calculationFacts: readonly CalculationFact[];
  readonly interpretations: readonly string[];
  readonly timingSignals: readonly TimingSignal[];
  readonly limitations: readonly string[];
  readonly provenance: Provenance;
}

export interface ChoiceEvidence<T extends string> {
  readonly value: T;
  readonly confidence: number;
  readonly probabilities: Readonly<Record<T, number>>;
}

export interface RawChoiceAnswer {
  readonly type: "choice";
  readonly choice: string;
  readonly confidence: number;
  readonly probabilities: Readonly<Record<string, number>>;
}

export interface JevRawResponse {
  readonly model: string;
  readonly answers: Readonly<Record<string, RawChoiceAnswer>>;
  readonly usage: {
    readonly input_tokens: number;
    readonly output_tokens: number;
  };
}

export interface NormalizedDomainSignal {
  readonly direction: ChoiceEvidence<Direction>;
  readonly relevance: ChoiceEvidence<Relevance>;
}

export interface JevNormalizedMethod {
  readonly methodId: string;
  readonly subject: SubjectRef;
  readonly targetDate: string;
  readonly targetTimezone: string;
  readonly requestedModel: "jev-latest";
  readonly domains: Readonly<Record<DailyDomain, NormalizedDomainSignal>>;
  readonly primarySignal: ChoiceEvidence<PrimarySignal>;
  readonly bestFocus: ChoiceEvidence<DailyDomain>;
  readonly cautionFocus: ChoiceEvidence<DailyDomain | "none">;
  readonly decisionReadiness: ChoiceEvidence<ReadinessLevel>;
  readonly actionReadiness: ChoiceEvidence<ReadinessLevel>;
  readonly socialOpenness: ChoiceEvidence<ReadinessLevel>;
  readonly changeReadiness: ChoiceEvidence<ReadinessLevel>;
  readonly riskLevel: ChoiceEvidence<RiskLevel>;
  readonly hasIntradayTimingSignal: ChoiceEvidence<YesNo>;
  readonly intradayDirections?: Readonly<Record<DayPart, ChoiceEvidence<Direction>>>;
  readonly rawResponse: JevRawResponse;
  readonly transport: {
    readonly httpStatus: number;
    readonly requestId: string | null;
  };
}

export interface ConsensusDomainResult {
  readonly methodCount: number;
  readonly direction: Direction | null;
  readonly consensusDirection: Direction | null;
  readonly majorityDirection: Direction | null;
  readonly majorityCount: number;
  readonly relevance: Relevance;
  readonly agreement: number | null;
  readonly rawDirectionCounts: Readonly<Record<Direction, number>>;
  readonly relevantMethodCount: number;
  readonly agreementState: AgreementState;
  readonly disagreementState: DisagreementClassification;
  readonly tie: boolean;
  readonly contributors: readonly string[];
  readonly insufficientMethods: readonly string[];
  readonly minorityMethods: readonly string[];
  readonly outlierCandidates: readonly string[];
}

export interface ConsensusResult {
  readonly status:
    | "single_method_baseline"
    | "two_method_comparison"
    | "three_method_comparison"
    | "four_method_comparison";
  readonly methodCount: 1 | 2 | 3 | 4;
  readonly sourceMethods: readonly string[];
  readonly domains: Readonly<Record<DailyDomain, ConsensusDomainResult>>;
  readonly primarySignal: PrimarySignal | null;
  readonly bestFocus: DailyDomain | null;
  readonly cautionFocus: DailyDomain | "none" | null;
  readonly decisionReadiness: ReadinessLevel | null;
  readonly actionReadiness: ReadinessLevel | null;
  readonly socialOpenness: ReadinessLevel | null;
  readonly changeReadiness: ReadinessLevel | null;
  readonly riskLevel: RiskLevel | null;
  readonly hasIntradayTimingSignal: YesNo | null;
  readonly intradayDirections?: Readonly<Partial<Record<DayPart, Direction>>>;
  readonly disagreementClassifications: readonly DisagreementClassification[];
  readonly evidenceConfidenceMean: number;
  readonly limitations: readonly string[];
}

export interface DailyRun {
  readonly schemaVersion: "0.1";
  readonly runId: string;
  readonly executionTimestamp: string;
  readonly executionDate: string;
  readonly executionTimezone: string;
  readonly targetDate: string;
  readonly targetTimezone: string;
  readonly subject: SubjectRef;
  readonly observations: readonly MethodObservation[];
  readonly normalizedMethods: readonly JevNormalizedMethod[];
  readonly consensus: ConsensusResult;
}
