import {
  DAILY_DOMAINS,
  DAY_PARTS,
  DIRECTION_VALUES,
  RELEVANCE_VALUES,
  type ConsensusDomainResult,
  type ConsensusResult,
  type DailyDomain,
  type Direction,
  type DisagreementClassification,
  type JevNormalizedMethod,
  type Relevance,
} from "../contracts/daily-run.js";

const relevanceRank = Object.fromEntries(
  RELEVANCE_VALUES.map((value, index) => [value, index]),
) as Record<Relevance, number>;

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function collectConfidence(method: JevNormalizedMethod): number[] {
  const values: number[] = [];
  for (const domain of DAILY_DOMAINS) {
    values.push(method.domains[domain].direction.confidence);
    values.push(method.domains[domain].relevance.confidence);
  }
  values.push(
    method.primarySignal.confidence,
    method.bestFocus.confidence,
    method.cautionFocus.confidence,
    method.decisionReadiness.confidence,
    method.actionReadiness.confidence,
    method.socialOpenness.confidence,
    method.changeReadiness.confidence,
    method.riskLevel.confidence,
    method.hasIntradayTimingSignal.confidence,
  );
  if (method.intradayDirections) {
    for (const dayPart of DAY_PARTS) values.push(method.intradayDirections[dayPart].confidence);
  }
  return values;
}

function majorityValue<T extends string>(values: readonly T[], electorateSize = values.length): T | null {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const required = Math.floor(electorateSize / 2) + 1;
  const winner = [...counts.entries()].find(([, count]) => count >= required);
  return winner?.[0] ?? null;
}

function strongestRelevance(methods: readonly JevNormalizedMethod[], domain: DailyDomain): Relevance {
  return methods.reduce<Relevance>((strongest, method) => {
    const candidate = method.domains[domain].relevance.value;
    return relevanceRank[candidate] > relevanceRank[strongest] ? candidate : strongest;
  }, "none");
}

function directionCounts(
  methods: readonly JevNormalizedMethod[],
  domain: DailyDomain,
): Record<Direction, number> {
  const counts = Object.fromEntries(DIRECTION_VALUES.map((value) => [value, 0])) as Record<
    Direction,
    number
  >;
  for (const method of methods) counts[method.domains[domain].direction.value] += 1;
  return counts;
}

function hasOppositeDirections(directions: readonly Direction[]): boolean {
  const hasNegative = directions.some(
    (direction) => direction === "negative" || direction === "very_negative",
  );
  const hasPositive = directions.some(
    (direction) => direction === "positive" || direction === "very_positive",
  );
  return hasNegative && hasPositive;
}

function compareDomain(
  methods: readonly JevNormalizedMethod[],
  domain: DailyDomain,
): ConsensusDomainResult {
  const methodCount = methods.length;
  const rawDirectionCounts = directionCounts(methods, domain);
  const relevant = methods.filter((method) => {
    const signal = method.domains[domain];
    return signal.relevance.value !== "none" && signal.direction.value !== "insufficient_signal";
  });
  const insufficientMethods = methods
    .filter((method) => !relevant.includes(method))
    .map((method) => method.methodId);
  const contributors = relevant.map((method) => method.methodId);
  const directions = relevant.map((method) => method.domains[domain].direction.value);
  const majorityDirection = majorityValue(directions, methodCount);
  const majorityCount = majorityDirection
    ? directions.filter((direction) => direction === majorityDirection).length
    : directions.length === 0
      ? 0
      : Math.max(
          ...[...new Set(directions)].map(
            (candidate) => directions.filter((direction) => direction === candidate).length,
          ),
        );
  const minorityMethods = majorityDirection
    ? relevant
        .filter((method) => method.domains[domain].direction.value !== majorityDirection)
        .map((method) => method.methodId)
    : [];
  const relevance = strongestRelevance(methods, domain);
  const uniqueDirections = [...new Set(directions)];

  if (methodCount === 1) {
    const methodDirection = methods[0].domains[domain].direction.value;
    return {
      methodCount,
      direction: methodDirection,
      consensusDirection: methodDirection,
      majorityDirection,
      majorityCount,
      relevance,
      agreement: null,
      rawDirectionCounts,
      relevantMethodCount: relevant.length,
      agreementState: "single_method",
      disagreementState:
        relevant.length === 1 ? "no_disagreement" : "insufficient_information",
      tie: false,
      contributors,
      insufficientMethods,
      minorityMethods: [],
      outlierCandidates: [],
    };
  }

  if (relevant.length === 0) {
    return {
      methodCount,
      direction: "insufficient_signal",
      consensusDirection: "insufficient_signal",
      majorityDirection: null,
      majorityCount: 0,
      relevance,
      agreement: null,
      rawDirectionCounts,
      relevantMethodCount: 0,
      agreementState: "insufficient_coverage",
      disagreementState: "insufficient_information",
      tie: false,
      contributors,
      insufficientMethods,
      minorityMethods: [],
      outlierCandidates: [],
    };
  }

  if (methodCount === 2) {
    if (relevant.length === 1) {
      const soleDirection = directions[0];
      return {
        methodCount,
        direction: soleDirection,
        consensusDirection: soleDirection,
        majorityDirection: null,
        majorityCount: 1,
        relevance,
        agreement: null,
        rawDirectionCounts,
        relevantMethodCount: 1,
        agreementState: "insufficient_coverage",
        disagreementState: "insufficient_information",
        tie: false,
        contributors,
        insufficientMethods,
        minorityMethods: [],
        outlierCandidates: [],
      };
    }
    if (uniqueDirections.length === 1) {
      return {
        methodCount,
        direction: directions[0],
        consensusDirection: directions[0],
        majorityDirection: directions[0],
        majorityCount: 2,
        relevance,
        agreement: 1,
        rawDirectionCounts,
        relevantMethodCount: 2,
        agreementState: "agreement",
        disagreementState: "no_disagreement",
        tie: false,
        contributors,
        insufficientMethods,
        minorityMethods: [],
        outlierCandidates: [],
      };
    }
    const opposite = hasOppositeDirections(directions);
    return {
      methodCount,
      direction: null,
      consensusDirection: null,
      majorityDirection: null,
      majorityCount: 1,
      relevance,
      agreement: 0,
      rawDirectionCounts,
      relevantMethodCount: 2,
      agreementState: opposite ? "disagreement" : "partial_disagreement",
      disagreementState: "direction_disagreement",
      tie: true,
      contributors,
      insufficientMethods,
      minorityMethods: [],
      outlierCandidates: contributors,
    };
  }

  if (majorityDirection) {
    const exact = majorityCount === 3;
    return {
      methodCount,
      direction: majorityDirection,
      consensusDirection: majorityDirection,
      majorityDirection,
      majorityCount,
      relevance,
      agreement: majorityCount / methodCount,
      rawDirectionCounts,
      relevantMethodCount: relevant.length,
      agreementState: exact ? "exact_agreement" : "majority_agreement",
      disagreementState:
        minorityMethods.length > 0
          ? "direction_disagreement"
          : insufficientMethods.length > 0
            ? "insufficient_information"
            : "no_disagreement",
      tie: false,
      contributors,
      insufficientMethods,
      minorityMethods,
      outlierCandidates: minorityMethods,
    };
  }

  const insufficientCoverage = insufficientMethods.length > 0;
  const conflict = hasOppositeDirections(directions);
  return {
    methodCount,
    direction: null,
    consensusDirection: null,
    majorityDirection: null,
    majorityCount,
    relevance,
    agreement: insufficientCoverage ? null : 0,
    rawDirectionCounts,
    relevantMethodCount: relevant.length,
    agreementState: insufficientCoverage
      ? "insufficient_coverage"
      : conflict
        ? "no_consensus"
        : "mixed",
    disagreementState: uniqueDirections.length > 1
      ? "direction_disagreement"
      : "insufficient_information",
    tie: relevant.length > 1,
    contributors,
    insufficientMethods,
    minorityMethods: [],
    outlierCandidates: relevant.length > 1 ? contributors : [],
  };
}

function validateComparableMethods(methods: readonly JevNormalizedMethod[]): void {
  if (methods.length < 1 || methods.length > 3) {
    throw new RangeError(
      `Daily Run v0.1 consensus supports one to three normalized methods; received ${methods.length}.`,
    );
  }
  const methodIds = methods.map((method) => method.methodId);
  if (new Set(methodIds).size !== methodIds.length) {
    throw new Error("Consensus source methods must have unique methodId values.");
  }
  const reference = methods[0];
  for (const method of methods.slice(1)) {
    if (method.subject.id !== reference.subject.id) {
      throw new Error("Consensus source methods must refer to the same subject.");
    }
    if (
      method.targetDate !== reference.targetDate ||
      method.targetTimezone !== reference.targetTimezone
    ) {
      throw new Error("Consensus source methods must use the same target date and timezone.");
    }
  }
}

export function computeConsensus(
  normalizedMethods: readonly JevNormalizedMethod[],
): ConsensusResult {
  validateComparableMethods(normalizedMethods);

  const domains = {} as Record<DailyDomain, ConsensusDomainResult>;
  for (const domain of DAILY_DOMAINS) domains[domain] = compareDomain(normalizedMethods, domain);

  const classifications: DisagreementClassification[] = [];
  if (normalizedMethods.length === 1) {
    classifications.push("insufficient_information");
  } else {
    if (
      DAILY_DOMAINS.some(
        (domain) => domains[domain].disagreementState === "direction_disagreement",
      )
    ) {
      classifications.push("direction_disagreement");
    }
    const bestFocusValues = normalizedMethods.map((method) => method.bestFocus.value);
    const cautionFocusValues = normalizedMethods.map((method) => method.cautionFocus.value);
    if (new Set(bestFocusValues).size > 1 || new Set(cautionFocusValues).size > 1) {
      classifications.push("focus_disagreement");
    }
    if (
      DAILY_DOMAINS.some((domain) => domains[domain].agreementState === "insufficient_coverage")
    ) {
      classifications.push("insufficient_information");
    }
    if (classifications.length === 0) classifications.push("no_disagreement");
  }

  const hasIntradayTimingSignal = majorityValue(
    normalizedMethods.map((method) => method.hasIntradayTimingSignal.value),
  );
  let intradayDirections: Partial<Record<(typeof DAY_PARTS)[number], Direction>> | undefined;
  if (hasIntradayTimingSignal === "yes") {
    const commonDirections: Partial<Record<(typeof DAY_PARTS)[number], Direction>> = {};
    for (const dayPart of DAY_PARTS) {
      const available = normalizedMethods
        .filter((method) => method.intradayDirections)
        .map((method) => method.intradayDirections![dayPart].value);
      const value = majorityValue(available, normalizedMethods.length);
      if (value) commonDirections[dayPart] = value;
    }
    if (Object.keys(commonDirections).length > 0) intradayDirections = commonDirections;
  }

  const methodCount = normalizedMethods.length === 1 ? 1 : normalizedMethods.length === 2 ? 2 : 3;
  return {
    status:
      methodCount === 1
        ? "single_method_baseline"
        : methodCount === 2
          ? "two_method_comparison"
          : "three_method_comparison",
    methodCount,
    sourceMethods: normalizedMethods.map((method) => method.methodId),
    domains,
    primarySignal: majorityValue(normalizedMethods.map((method) => method.primarySignal.value)),
    bestFocus: majorityValue(normalizedMethods.map((method) => method.bestFocus.value)),
    cautionFocus: majorityValue(normalizedMethods.map((method) => method.cautionFocus.value)),
    decisionReadiness: majorityValue(
      normalizedMethods.map((method) => method.decisionReadiness.value),
    ),
    actionReadiness: majorityValue(normalizedMethods.map((method) => method.actionReadiness.value)),
    socialOpenness: majorityValue(normalizedMethods.map((method) => method.socialOpenness.value)),
    changeReadiness: majorityValue(normalizedMethods.map((method) => method.changeReadiness.value)),
    riskLevel: majorityValue(normalizedMethods.map((method) => method.riskLevel.value)),
    hasIntradayTimingSignal,
    ...(intradayDirections ? { intradayDirections } : {}),
    disagreementClassifications: classifications,
    evidenceConfidenceMean: mean(normalizedMethods.flatMap(collectConfidence)),
    limitations:
      methodCount === 1
        ? [
            "Cross-method agreement is not measurable with one method.",
            "This baseline must not be described as corroborated consensus.",
          ]
        : methodCount === 2
          ? [
              "Two methods provide a comparison, not a statistically meaningful agreement rate.",
              "No method weighting or historical-accuracy weighting is applied.",
              "When two methods differ, neither can be identified as the actual outlier without a majority.",
            ]
          : [
              "A 2/3 majority is a descriptive comparison, not a truth or accuracy guarantee.",
              "Minority methods are outlier candidates only; they are not judged incorrect.",
              "No method weighting or historical-accuracy weighting is applied.",
            ],
  };
}
