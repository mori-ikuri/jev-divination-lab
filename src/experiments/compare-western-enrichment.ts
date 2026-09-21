import {
  DAILY_DOMAINS,
  RELEVANCE_VALUES,
  type DailyDomain,
  type Direction,
  type JevNormalizedMethod,
  type Relevance,
} from "../contracts/daily-run.js";

export interface DomainCoverageSnapshot {
  readonly direction: Direction;
  readonly relevance: Relevance;
  readonly relevant: boolean;
  readonly confidenceMean: number;
}

export interface CoverageSummary {
  readonly domains: Readonly<Record<DailyDomain, DomainCoverageSnapshot>>;
  readonly insufficientSignalCount: number;
  readonly relevantDomainCount: number;
  readonly domainEvidenceConfidenceMean: number;
  readonly usage: {
    readonly inputTokens: number;
    readonly outputTokens: number;
    readonly totalTokens: number;
  };
}

export interface WesternEnrichmentComparison {
  readonly baseline: CoverageSummary;
  readonly experimental: CoverageSummary;
  readonly perDomain: Readonly<
    Record<
      DailyDomain,
      {
        readonly baseline: DomainCoverageSnapshot;
        readonly experimental: DomainCoverageSnapshot;
        readonly directionChanged: boolean;
        readonly relevanceIncreased: boolean;
        readonly becameRelevant: boolean;
        readonly confidenceDelta: number;
      }
    >
  >;
  readonly insufficientToRelevantDomains: readonly DailyDomain[];
  readonly relevanceIncreasedDomains: readonly DailyDomain[];
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

function assertWesternMethod(method: JevNormalizedMethod, label: string): void {
  if (method.methodId !== "western_astrology") {
    throw new Error(`${label} methodId must be western_astrology; received ${method.methodId}.`);
  }
}

export function summarizeWesternCoverage(method: JevNormalizedMethod): CoverageSummary {
  assertWesternMethod(method, "Coverage");
  const domains = {} as Record<DailyDomain, DomainCoverageSnapshot>;
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

export function compareWesternEnrichment(
  baselineMethod: JevNormalizedMethod,
  experimentalMethod: JevNormalizedMethod,
): WesternEnrichmentComparison {
  assertWesternMethod(baselineMethod, "Baseline");
  assertWesternMethod(experimentalMethod, "Experimental");
  if (baselineMethod.subject.id !== experimentalMethod.subject.id) {
    throw new Error("Baseline and experimental subject IDs must match.");
  }
  if (
    baselineMethod.targetDate !== experimentalMethod.targetDate ||
    baselineMethod.targetTimezone !== experimentalMethod.targetTimezone
  ) {
    throw new Error("Baseline and experimental target date/timezone must match.");
  }

  const baseline = summarizeWesternCoverage(baselineMethod);
  const experimental = summarizeWesternCoverage(experimentalMethod);
  const perDomain = {} as Record<
    DailyDomain,
    WesternEnrichmentComparison["perDomain"][DailyDomain]
  >;
  const insufficientToRelevantDomains: DailyDomain[] = [];
  const relevanceIncreasedDomains: DailyDomain[] = [];
  const directionChangedDomains: DailyDomain[] = [];

  for (const domain of DAILY_DOMAINS) {
    const before = baseline.domains[domain];
    const after = experimental.domains[domain];
    const directionChanged = before.direction !== after.direction;
    const relevanceIncreased =
      RELEVANCE_VALUES.indexOf(after.relevance) > RELEVANCE_VALUES.indexOf(before.relevance);
    const becameRelevant = !before.relevant && after.relevant;
    perDomain[domain] = {
      baseline: before,
      experimental: after,
      directionChanged,
      relevanceIncreased,
      becameRelevant,
      confidenceDelta: after.confidenceMean - before.confidenceMean,
    };
    if (becameRelevant) insufficientToRelevantDomains.push(domain);
    if (relevanceIncreased) relevanceIncreasedDomains.push(domain);
    if (directionChanged) directionChangedDomains.push(domain);
  }

  return {
    baseline,
    experimental,
    perDomain,
    insufficientToRelevantDomains,
    relevanceIncreasedDomains,
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
