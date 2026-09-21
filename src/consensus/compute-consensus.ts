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
    for (const dayPart of DAY_PARTS) {
      values.push(method.intradayDirections[dayPart].confidence);
    }
  }

  return values;
}

function commonValue<T>(values: readonly T[]): T | null {
  const first = values[0];
  return values.every((value) => value === first) ? first : null;
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
  for (const method of methods) {
    counts[method.domains[domain].direction.value] += 1;
  }
  return counts;
}

function polarity(direction: Direction): -1 | 0 | 1 | null {
  if (direction === "very_negative" || direction === "negative") return -1;
  if (direction === "very_positive" || direction === "positive") return 1;
  if (direction === "neutral") return 0;
  return null;
}

function compareDomain(
  methods: readonly JevNormalizedMethod[],
  domain: DailyDomain,
): ConsensusDomainResult {
  const rawDirectionCounts = directionCounts(methods, domain);
  const relevant = methods.filter((method) => {
    const signal = method.domains[domain];
    return signal.relevance.value !== "none" && signal.direction.value !== "insufficient_signal";
  });
  const insufficientMethods = methods
    .filter((method) => !relevant.includes(method))
    .map((method) => method.methodId);
  const contributors = relevant.map((method) => method.methodId);
  const relevance = strongestRelevance(methods, domain);

  if (methods.length === 1) {
    const method = methods[0];
    const hasSignal = relevant.length === 1;
    return {
      direction: method.domains[domain].direction.value,
      relevance,
      agreement: null,
      rawDirectionCounts,
      relevantMethodCount: relevant.length,
      agreementState: "single_method",
      disagreementState: hasSignal ? "no_disagreement" : "insufficient_information",
      tie: false,
      contributors,
      insufficientMethods,
      outlierCandidates: [],
    };
  }

  if (relevant.length === 0) {
    return {
      direction: "insufficient_signal",
      relevance,
      agreement: null,
      rawDirectionCounts,
      relevantMethodCount: 0,
      agreementState: "insufficient_coverage",
      disagreementState: "insufficient_information",
      tie: false,
      contributors,
      insufficientMethods,
      outlierCandidates: [],
    };
  }

  if (relevant.length === 1) {
    return {
      direction: relevant[0].domains[domain].direction.value,
      relevance,
      agreement: null,
      rawDirectionCounts,
      relevantMethodCount: 1,
      agreementState: "insufficient_coverage",
      disagreementState: "insufficient_information",
      tie: false,
      contributors,
      insufficientMethods,
      outlierCandidates: [],
    };
  }

  const left = relevant[0].domains[domain].direction.value;
  const right = relevant[1].domains[domain].direction.value;
  if (left === right) {
    return {
      direction: left,
      relevance,
      agreement: 1,
      rawDirectionCounts,
      relevantMethodCount: 2,
      agreementState: "agreement",
      disagreementState: "no_disagreement",
      tie: false,
      contributors,
      insufficientMethods,
      outlierCandidates: [],
    };
  }

  const leftPolarity = polarity(left);
  const rightPolarity = polarity(right);
  const isOpposite =
    leftPolarity !== null &&
    rightPolarity !== null &&
    leftPolarity !== 0 &&
    rightPolarity !== 0 &&
    leftPolarity === -rightPolarity;
  return {
    direction: null,
    relevance,
    agreement: 0,
    rawDirectionCounts,
    relevantMethodCount: 2,
    agreementState: isOpposite ? "disagreement" : "partial_disagreement",
    disagreementState: "direction_disagreement",
    tie: true,
    contributors,
    insufficientMethods,
    // With only two equally weighted methods there is no majority. Both remain candidates,
    // and neither may be labeled the actual outlier.
    outlierCandidates: contributors,
  };
}

function validateComparableMethods(methods: readonly JevNormalizedMethod[]): void {
  if (methods.length < 1 || methods.length > 2) {
    throw new RangeError(
      `Daily Run v0.1 consensus supports one or two normalized methods; received ${methods.length}.`,
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
  for (const domain of DAILY_DOMAINS) {
    domains[domain] = compareDomain(normalizedMethods, domain);
  }

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
    if (
      commonValue(normalizedMethods.map((method) => method.bestFocus.value)) === null ||
      commonValue(normalizedMethods.map((method) => method.cautionFocus.value)) === null
    ) {
      classifications.push("focus_disagreement");
    }
    if (
      DAILY_DOMAINS.some((domain) => domains[domain].agreementState === "insufficient_coverage")
    ) {
      classifications.push("insufficient_information");
    }
    if (classifications.length === 0) classifications.push("no_disagreement");
  }

  let intradayDirections: Partial<Record<(typeof DAY_PARTS)[number], Direction>> | undefined;
  if (
    normalizedMethods.every(
      (method) => method.hasIntradayTimingSignal.value === "yes" && method.intradayDirections,
    )
  ) {
    const commonDirections: Partial<Record<(typeof DAY_PARTS)[number], Direction>> = {};
    for (const dayPart of DAY_PARTS) {
      const value = commonValue(
        normalizedMethods.map((method) => method.intradayDirections![dayPart].value),
      );
      if (value !== null) commonDirections[dayPart] = value;
    }
    if (Object.keys(commonDirections).length > 0) intradayDirections = commonDirections;
  }

  return {
    status:
      normalizedMethods.length === 1 ? "single_method_baseline" : "two_method_comparison",
    methodCount: normalizedMethods.length === 1 ? 1 : 2,
    sourceMethods: normalizedMethods.map((method) => method.methodId),
    domains,
    primarySignal: commonValue(normalizedMethods.map((method) => method.primarySignal.value)),
    bestFocus: commonValue(normalizedMethods.map((method) => method.bestFocus.value)),
    cautionFocus: commonValue(normalizedMethods.map((method) => method.cautionFocus.value)),
    decisionReadiness: commonValue(
      normalizedMethods.map((method) => method.decisionReadiness.value),
    ),
    actionReadiness: commonValue(normalizedMethods.map((method) => method.actionReadiness.value)),
    socialOpenness: commonValue(normalizedMethods.map((method) => method.socialOpenness.value)),
    changeReadiness: commonValue(normalizedMethods.map((method) => method.changeReadiness.value)),
    riskLevel: commonValue(normalizedMethods.map((method) => method.riskLevel.value)),
    hasIntradayTimingSignal: commonValue(
      normalizedMethods.map((method) => method.hasIntradayTimingSignal.value),
    ),
    ...(intradayDirections ? { intradayDirections } : {}),
    disagreementClassifications: classifications,
    evidenceConfidenceMean: mean(normalizedMethods.flatMap(collectConfidence)),
    limitations:
      normalizedMethods.length === 1
        ? [
            "Cross-method agreement is not measurable with one method.",
            "This baseline must not be described as corroborated consensus.",
          ]
        : [
            "Two methods provide a comparison, not a statistically meaningful agreement rate.",
            "No method weighting or historical-accuracy weighting is applied.",
            "When two methods differ, neither can be identified as the actual outlier without a majority.",
          ],
  };
}
