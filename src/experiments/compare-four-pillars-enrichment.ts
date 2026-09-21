import {
  DAILY_DOMAINS,
  RELEVANCE_VALUES,
  type DailyDomain,
  type Direction,
  type JevNormalizedMethod,
  type Relevance,
} from "../contracts/daily-run.js";

export interface FourPillarsDomainCoverageSnapshot {
  readonly direction: Direction;
  readonly relevance: Relevance;
  readonly relevant: boolean;
  readonly confidenceMean: number;
}

export interface FourPillarsCoverageSummary {
  readonly domains: Readonly<Record<DailyDomain, FourPillarsDomainCoverageSnapshot>>;
  readonly insufficientSignalCount: number;
  readonly relevantDomainCount: number;
  readonly domainEvidenceConfidenceMean: number;
  readonly usage: {
    readonly inputTokens: number;
    readonly outputTokens: number;
    readonly totalTokens: number;
  };
}

export interface FourPillarsEnrichmentComparison {
  readonly baseline: FourPillarsCoverageSummary;
  readonly experimental: FourPillarsCoverageSummary;
  readonly perDomain: Readonly<
    Record<
      DailyDomain,
      {
        readonly baseline: FourPillarsDomainCoverageSnapshot;
        readonly experimental: FourPillarsDomainCoverageSnapshot;
        readonly directionChanged: boolean;
        readonly relevanceIncreased: boolean;
        readonly relevanceDecreased: boolean;
        readonly becameRelevant: boolean;
        readonly confidenceDelta: number;
      }
    >
  >;
  readonly insufficientToRelevantDomains: readonly DailyDomain[];
  readonly relevanceIncreasedDomains: readonly DailyDomain[];
  readonly relevanceDecreasedDomains: readonly DailyDomain[];
  readonly directionChangedDomains: readonly DailyDomain[];
  readonly coverageDelta: number;
  readonly insufficientSignalDelta: number;
  readonly domainEvidenceConfidenceDelta: number;
  readonly usageDelta: {
    readonly inputTokens: number;
    readonly outputTokens: number;
    readonly totalTokens: number;
  };
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function assertFourPillarsMethod(method: JevNormalizedMethod, label: string): void {
  if (method.methodId !== "four_pillars") {
    throw new Error(`${label} methodId must be four_pillars; received ${method.methodId}.`);
  }
}

export function summarizeFourPillarsCoverage(
  method: JevNormalizedMethod,
): FourPillarsCoverageSummary {
  assertFourPillarsMethod(method, "Coverage");
  const domains = {} as Record<DailyDomain, FourPillarsDomainCoverageSnapshot>;
  const confidences: number[] = [];
  let insufficientSignalCount = 0;
  let relevantDomainCount = 0;

  for (const domain of DAILY_DOMAINS) {
    const signal = method.domains[domain];
    const relevant =
      signal.direction.value !== "insufficient_signal" && signal.relevance.value !== "none";
    const confidenceMean = mean([
      signal.direction.confidence,
      signal.relevance.confidence,
    ]);
    domains[domain] = {
      direction: signal.direction.value,
      relevance: signal.relevance.value,
      relevant,
      confidenceMean,
    };
    confidences.push(signal.direction.confidence, signal.relevance.confidence);
    if (signal.direction.value === "insufficient_signal") insufficientSignalCount += 1;
    if (relevant) relevantDomainCount += 1;
  }

  const inputTokens = method.rawResponse.usage.input_tokens;
  const outputTokens = method.rawResponse.usage.output_tokens;
  return {
    domains,
    insufficientSignalCount,
    relevantDomainCount,
    domainEvidenceConfidenceMean: mean(confidences),
    usage: {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    },
  };
}

export function compareFourPillarsEnrichment(
  baselineMethod: JevNormalizedMethod,
  experimentalMethod: JevNormalizedMethod,
): FourPillarsEnrichmentComparison {
  assertFourPillarsMethod(baselineMethod, "Baseline");
  assertFourPillarsMethod(experimentalMethod, "Experimental");
  if (baselineMethod.subject.id !== experimentalMethod.subject.id) {
    throw new Error("Baseline and experimental subject IDs must match.");
  }
  if (
    baselineMethod.targetDate !== experimentalMethod.targetDate ||
    baselineMethod.targetTimezone !== experimentalMethod.targetTimezone
  ) {
    throw new Error("Baseline and experimental target date/timezone must match.");
  }

  const baseline = summarizeFourPillarsCoverage(baselineMethod);
  const experimental = summarizeFourPillarsCoverage(experimentalMethod);
  const perDomain = {} as Record<
    DailyDomain,
    FourPillarsEnrichmentComparison["perDomain"][DailyDomain]
  >;
  const insufficientToRelevantDomains: DailyDomain[] = [];
  const relevanceIncreasedDomains: DailyDomain[] = [];
  const relevanceDecreasedDomains: DailyDomain[] = [];
  const directionChangedDomains: DailyDomain[] = [];

  for (const domain of DAILY_DOMAINS) {
    const before = baseline.domains[domain];
    const after = experimental.domains[domain];
    const beforeRank = RELEVANCE_VALUES.indexOf(before.relevance);
    const afterRank = RELEVANCE_VALUES.indexOf(after.relevance);
    const directionChanged = before.direction !== after.direction;
    const relevanceIncreased = afterRank > beforeRank;
    const relevanceDecreased = afterRank < beforeRank;
    const becameRelevant = !before.relevant && after.relevant;
    perDomain[domain] = {
      baseline: before,
      experimental: after,
      directionChanged,
      relevanceIncreased,
      relevanceDecreased,
      becameRelevant,
      confidenceDelta: after.confidenceMean - before.confidenceMean,
    };
    if (becameRelevant) insufficientToRelevantDomains.push(domain);
    if (relevanceIncreased) relevanceIncreasedDomains.push(domain);
    if (relevanceDecreased) relevanceDecreasedDomains.push(domain);
    if (directionChanged) directionChangedDomains.push(domain);
  }

  return {
    baseline,
    experimental,
    perDomain,
    insufficientToRelevantDomains,
    relevanceIncreasedDomains,
    relevanceDecreasedDomains,
    directionChangedDomains,
    coverageDelta: experimental.relevantDomainCount - baseline.relevantDomainCount,
    insufficientSignalDelta:
      experimental.insufficientSignalCount - baseline.insufficientSignalCount,
    domainEvidenceConfidenceDelta:
      experimental.domainEvidenceConfidenceMean - baseline.domainEvidenceConfidenceMean,
    usageDelta: {
      inputTokens: experimental.usage.inputTokens - baseline.usage.inputTokens,
      outputTokens: experimental.usage.outputTokens - baseline.usage.outputTokens,
      totalTokens: experimental.usage.totalTokens - baseline.usage.totalTokens,
    },
  };
}
