import assert from "node:assert/strict";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { computeConsensus } from "../src/consensus/compute-consensus.js";
import type {
  DailyDomain,
  Direction,
  JevNormalizedMethod,
  MethodObservation,
  Relevance,
} from "../src/contracts/daily-run.js";
import { NUMEROLOGY_FICTIONAL_FIXTURE } from "../src/fixtures/numerology-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";
import {
  DAILY_METHOD_REGISTRY,
  selectRegisteredMethods,
} from "../src/methods/registry.js";
import { buildDailyRun } from "../src/runtime/daily-runner.js";

interface Scenario {
  readonly directions?: Partial<Record<DailyDomain, Direction>>;
  readonly relevances?: Partial<Record<DailyDomain, Relevance>>;
  readonly bestFocus?: DailyDomain;
}

function answer(value: string, labels: readonly string[]): ChoiceResponse {
  const confidence = 0.7;
  const remainder = labels.length > 1 ? 0.3 / (labels.length - 1) : 0;
  return {
    type: "choice",
    choice: value,
    confidence,
    probabilities: Object.fromEntries(
      labels.map((label) => [label, label === value ? confidence : remainder]),
    ),
  };
}

function normalize(
  observation: MethodObservation,
  scenario: Scenario = {},
): JevNormalizedMethod {
  const request = buildNormalizationRequest(observation);
  const answers: Record<string, ChoiceResponse> = {};

  for (const [key, question] of Object.entries(request.questions)) {
    const labels = Object.keys(question.criteria);
    let value = labels[0];
    if (key.endsWith("_direction")) value = "neutral";
    if (key.endsWith("_relevance")) value = "moderate";
    if (key === "primary_signal") value = "reflection";
    if (key === "best_focus") value = scenario.bestFocus ?? "work";
    if (key === "caution_focus") value = "change_movement";
    if (key.endsWith("_readiness") || key === "social_openness")
      value = "medium";
    if (key === "risk_level") value = "moderate";
    if (key === "has_intraday_timing_signal") {
      value = observation.timingSignals.length > 0 ? "yes" : "no";
    }
    answers[key] = answer(value, labels);
  }

  for (const [domain, direction] of Object.entries(
    scenario.directions ?? {},
  ) as [DailyDomain, Direction][]) {
    const key = `${domain}_direction`;
    answers[key] = answer(
      direction,
      Object.keys(request.questions[key].criteria),
    );
  }
  for (const [domain, relevance] of Object.entries(
    scenario.relevances ?? {},
  ) as [DailyDomain, Relevance][]) {
    const key = `${domain}_relevance`;
    answers[key] = answer(
      relevance,
      Object.keys(request.questions[key].criteria),
    );
  }

  const result: NormalizationApiResult = {
    model: "jev-test",
    answers,
    usage: { input_tokens: 100, output_tokens: 200 },
  };
  return mapSystemOneResult(observation, result, {
    httpStatus: 200,
    requestId: null,
  });
}

function five(scenarios: readonly Scenario[]) {
  assert.equal(scenarios.length, 5);
  return computeConsensus(
    DAILY_METHOD_REGISTRY.slice(0, 5).map((method, index) =>
      normalize(method.observation, scenarios[index]),
    ),
  );
}

function six(scenarios: readonly Scenario[]) {
  assert.equal(scenarios.length, 6);
  return computeConsensus(
    DAILY_METHOD_REGISTRY.slice(0, 6).map((method, index) =>
      normalize(method.observation, scenarios[index]),
    ),
  );
}

function seven(scenarios: readonly Scenario[]) {
  assert.equal(scenarios.length, 7);
  return computeConsensus(
    DAILY_METHOD_REGISTRY.slice(0, 7).map((method, index) =>
      normalize(method.observation, scenarios[index]),
    ),
  );
}

function eight(scenarios: readonly Scenario[]) {
  assert.equal(scenarios.length, 8);
  return computeConsensus(
    DAILY_METHOD_REGISTRY.map((method, index) =>
      normalize(method.observation, scenarios[index]),
    ),
  );
}

test("public Numerology fixture is fictional, reproducible, and method-specific", () => {
  const fixture = NUMEROLOGY_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "numerology");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.provenance.sourceType, "fictional_fixture");
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.calculationFacts.length >= 7);
  assert.ok(fixture.interpretations.length >= 4);
  assert.ok(fixture.limitations.some((value) => value.includes("fictional")));
  assert.ok(
    fixture.limitations.some((value) =>
      value.includes("deterministic numerology generator"),
    ),
  );

  const factIds = new Set(fixture.calculationFacts.map((fact) => fact.id));
  assert.equal(factIds.size, fixture.calculationFacts.length);
  for (const interpretation of fixture.interpretations) {
    const basis = interpretation.match(/^\[basis: ([^\]]+)\]/);
    assert.ok(
      basis,
      "Every Numerology interpretation must declare basis fact IDs.",
    );
    for (const id of basis[1].split(",").map((value) => value.trim())) {
      assert.ok(factIds.has(id), `Unknown Numerology basis fact ID: ${id}`);
    }
  }
});

test("Numerology uses the unchanged no-timing normalization question schema", () => {
  const request = buildNormalizationRequest(NUMEROLOGY_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(request.questions).length, 33);
  assert.equal(
    (request.state as Record<string, unknown>).contract,
    "daily-run-v0.2",
  );
});

test("registry preserves canonical order and rejects invalid selections", () => {
  assert.deepEqual(
    DAILY_METHOD_REGISTRY.map((method) => method.id),
    [
      "western_astrology",
      "four_pillars",
      "nine_star_ki",
      "sukuyo",
      "numerology",
      "jyotish",
      "zi_wei_dou_shu",
      "sanmeigaku",
    ],
  );
  assert.deepEqual(
    selectRegisteredMethods(["jyotish", "western_astrology"]).map(
      (method) => method.id,
    ),
    ["jyotish", "western_astrology"],
  );
  const originalFive = [
    "western_astrology",
    "four_pillars",
    "nine_star_ki",
    "sukuyo",
    "numerology",
  ];
  assert.deepEqual(
    selectRegisteredMethods(originalFive).map((method) => method.id),
    originalFive,
  );
  const originalSix = [...originalFive, "jyotish"];
  assert.deepEqual(
    selectRegisteredMethods(originalSix).map((method) => method.id),
    originalSix,
  );
  const originalSeven = [...originalSix, "zi_wei_dou_shu"];
  assert.deepEqual(
    selectRegisteredMethods(originalSeven).map((method) => method.id),
    originalSeven,
  );
  assert.throws(
    () => selectRegisteredMethods([]),
    /At least one registered method/,
  );
  assert.throws(
    () => selectRegisteredMethods(["numerology", "numerology"]),
    /must be unique/,
  );
  assert.throws(
    () => selectRegisteredMethods(["unknown"]),
    /Unknown method ID/,
  );
});

test("five methods support exact agreement and a strict 3/5 majority", () => {
  const positive = { directions: { work: "positive" as const } };
  const exact = five([positive, positive, positive, positive, positive]);
  assert.equal(exact.status, "multi_method_comparison");
  assert.equal(exact.methodCount, 5);
  assert.equal(exact.domains.work.agreementState, "exact_agreement");
  assert.equal(exact.domains.work.agreement, 1);

  const negative = { directions: { work: "negative" as const } };
  const majority = five([positive, positive, positive, negative, negative])
    .domains.work;
  assert.equal(majority.agreementState, "majority_agreement");
  assert.equal(majority.consensusDirection, "positive");
  assert.equal(majority.majorityCount, 3);
  assert.deepEqual(majority.minorityMethods, ["sukuyo", "numerology"]);
});

test("five methods distinguish insufficient coverage from a strict majority", () => {
  const positive = {
    directions: { money: "positive" as const },
    relevances: { money: "strong" as const },
  };
  const insufficient = {
    directions: { money: "insufficient_signal" as const },
    relevances: { money: "none" as const },
  };

  const majority = five([
    positive,
    positive,
    positive,
    insufficient,
    insufficient,
  ]).domains.money;
  assert.equal(majority.agreementState, "majority_agreement");
  assert.equal(majority.consensusDirection, "positive");
  assert.equal(majority.relevantMethodCount, 3);

  const sparse = five([
    positive,
    positive,
    insufficient,
    insufficient,
    insufficient,
  ]).domains.money;
  assert.equal(sparse.agreementState, "insufficient_coverage");
  assert.equal(sparse.consensusDirection, null);
  assert.equal(sparse.majorityDirection, null);
  assert.equal(sparse.relevantMethodCount, 2);
});

test("six methods require a strict 4/6 majority", () => {
  const positive = { directions: { work: "positive" as const } };
  const negative = { directions: { work: "negative" as const } };

  const split = six([
    positive,
    positive,
    positive,
    negative,
    negative,
    negative,
  ]).domains.work;
  assert.equal(split.agreementState, "no_consensus");
  assert.equal(split.consensusDirection, null);
  assert.equal(split.majorityCount, 3);

  const majority = six([
    positive,
    positive,
    positive,
    positive,
    negative,
    negative,
  ]).domains.work;
  assert.equal(majority.agreementState, "majority_agreement");
  assert.equal(majority.consensusDirection, "positive");
  assert.equal(majority.majorityCount, 4);
  assert.deepEqual(majority.minorityMethods, ["numerology", "jyotish"]);
});

test("seven methods require a strict 4/7 majority", () => {
  const positive = { directions: { work: "positive" as const } };
  const negative = { directions: { work: "negative" as const } };
  const neutral = { directions: { work: "neutral" as const } };

  const noMajority = seven([
    positive,
    positive,
    positive,
    negative,
    negative,
    neutral,
    neutral,
  ]).domains.work;
  assert.equal(noMajority.agreementState, "no_consensus");
  assert.equal(noMajority.consensusDirection, null);
  assert.equal(noMajority.majorityCount, 3);

  const consensus = seven([
    positive,
    positive,
    positive,
    positive,
    negative,
    negative,
    negative,
  ]);
  assert.equal(consensus.status, "multi_method_comparison");
  assert.equal(consensus.methodCount, 7);
  assert.equal(consensus.domains.work.agreementState, "majority_agreement");
  assert.equal(consensus.domains.work.consensusDirection, "positive");
  assert.equal(consensus.domains.work.majorityCount, 4);
  assert.deepEqual(consensus.domains.work.minorityMethods, [
    "numerology",
    "jyotish",
    "zi_wei_dou_shu",
  ]);
});

test("eight methods require a strict 5/8 majority and reject a 4/8 split", () => {
  const positive = { directions: { work: "positive" as const } };
  const negative = { directions: { work: "negative" as const } };

  const split = eight([
    positive,
    positive,
    positive,
    positive,
    negative,
    negative,
    negative,
    negative,
  ]).domains.work;
  assert.equal(split.agreementState, "no_consensus");
  assert.equal(split.consensusDirection, null);
  assert.equal(split.majorityCount, 4);
  assert.equal(split.tie, true);

  const consensus = eight([
    positive,
    positive,
    positive,
    positive,
    positive,
    negative,
    negative,
    negative,
  ]);
  assert.equal(consensus.status, "multi_method_comparison");
  assert.equal(consensus.methodCount, 8);
  assert.equal(consensus.domains.work.agreementState, "majority_agreement");
  assert.equal(consensus.domains.work.consensusDirection, "positive");
  assert.equal(consensus.domains.work.majorityCount, 5);
  assert.deepEqual(consensus.domains.work.minorityMethods, [
    "jyotish",
    "zi_wei_dou_shu",
    "sanmeigaku",
  ]);
});

test("eight methods distinguish insufficient coverage from a majority", () => {
  const positive = {
    directions: { work: "positive" as const },
    relevances: { work: "strong" as const },
  };
  const insufficient = {
    directions: { work: "insufficient_signal" as const },
    relevances: { work: "none" as const },
  };

  const sparse = eight([
    positive,
    positive,
    positive,
    positive,
    insufficient,
    insufficient,
    insufficient,
    insufficient,
  ]).domains.work;
  assert.equal(sparse.agreementState, "insufficient_coverage");
  assert.equal(sparse.consensusDirection, null);
  assert.equal(sparse.majorityDirection, null);
  assert.equal(sparse.majorityCount, 4);
  assert.equal(sparse.relevantMethodCount, 4);
});

test("consensus accepts arbitrary method counts beyond the eight-method registry", () => {
  const base = normalize(NUMEROLOGY_FICTIONAL_FIXTURE, {
    directions: { action: "positive" },
  });
  const nine = Array.from({ length: 9 }, (_, index) => ({
    ...base,
    methodId: `synthetic_method_${index + 1}`,
  }));

  const consensus = computeConsensus(nine);
  assert.equal(consensus.status, "multi_method_comparison");
  assert.equal(consensus.methodCount, 9);
  assert.equal(consensus.domains.action.agreementState, "exact_agreement");
  assert.equal(consensus.domains.action.majorityCount, 9);
});

test("registry-driven builder creates an eight-method Daily Run v0.2 artifact", () => {
  const observations = DAILY_METHOD_REGISTRY.map(
    (method) => method.observation,
  );
  const normalizedMethods = observations.map((observation) =>
    normalize(observation),
  );
  const run = buildDailyRun({
    observations,
    normalizedMethods,
    executionTimestamp: "2026-09-24T03:04:05.678Z",
    executionTimezone: "Asia/Tokyo",
  });

  assert.equal(run.schemaVersion, "0.2");
  assert.equal(run.consensus.status, "multi_method_comparison");
  assert.equal(run.consensus.methodCount, 8);
  assert.equal(
    run.runId,
    "daily-v0.2-8-method-fictional-2026-09-24T03-04-05-678Z",
  );
  assert.equal(run.executionDate, "2026-09-24");
  assert.deepEqual(
    run.consensus.sourceMethods,
    DAILY_METHOD_REGISTRY.map((method) => method.id),
  );
});
