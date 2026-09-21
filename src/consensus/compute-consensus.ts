import {
  DAILY_DOMAINS,
  DAY_PARTS,
  type ConsensusDomainResult,
  type ConsensusResult,
  type DailyDomain,
  type JevNormalizedMethod,
} from "../contracts/daily-run.js";

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

export function computeConsensus(
  normalizedMethods: readonly JevNormalizedMethod[],
): ConsensusResult {
  if (normalizedMethods.length !== 1) {
    throw new RangeError(
      `Daily Run v0.1 consensus requires exactly one normalized method; received ${normalizedMethods.length}.`,
    );
  }

  const method = normalizedMethods[0];
  const domains = {} as Record<DailyDomain, ConsensusDomainResult>;
  for (const domain of DAILY_DOMAINS) {
    domains[domain] = {
      direction: method.domains[domain].direction.value,
      relevance: method.domains[domain].relevance.value,
      agreement: null,
      contributors: [method.methodId],
    };
  }

  const intraday = method.intradayDirections;
  const intradayDirections = intraday
    ? Object.fromEntries(DAY_PARTS.map((dayPart) => [dayPart, intraday[dayPart].value]))
    : undefined;

  return {
    status: "single_method_baseline",
    methodCount: 1,
    sourceMethods: [method.methodId],
    domains,
    primarySignal: method.primarySignal.value,
    bestFocus: method.bestFocus.value,
    cautionFocus: method.cautionFocus.value,
    decisionReadiness: method.decisionReadiness.value,
    actionReadiness: method.actionReadiness.value,
    socialOpenness: method.socialOpenness.value,
    changeReadiness: method.changeReadiness.value,
    riskLevel: method.riskLevel.value,
    hasIntradayTimingSignal: method.hasIntradayTimingSignal.value,
    ...(intradayDirections ? { intradayDirections } : {}),
    evidenceConfidenceMean: mean(collectConfidence(method)),
    limitations: [
      "Cross-method agreement is not measurable with one method.",
      "This baseline must not be described as corroborated consensus.",
    ],
  };
}
