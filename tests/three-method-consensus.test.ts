import assert from "node:assert/strict";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { computeConsensus } from "../src/consensus/compute-consensus.js";
import type {
  DailyDomain,
  Direction,
  MethodObservation,
  PrimarySignal,
  Relevance,
} from "../src/contracts/daily-run.js";
import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "../src/fixtures/four-pillars-fictional.js";
import { NINE_STAR_KI_FICTIONAL_FIXTURE } from "../src/fixtures/nine-star-ki-fictional.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "../src/fixtures/western-astrology-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";

interface Scenario {
  readonly directions?: Partial<Record<DailyDomain, Direction>>;
  readonly relevances?: Partial<Record<DailyDomain, Relevance>>;
  readonly bestFocus?: DailyDomain;
  readonly primarySignal?: PrimarySignal;
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

function normalize(observation: MethodObservation, scenario: Scenario = {}) {
  const request = buildNormalizationRequest(observation);
  const answers: Record<string, ChoiceResponse> = {};
  for (const [key, question] of Object.entries(request.questions)) {
    const labels = Object.keys(question.criteria);
    let value = labels[0];
    if (key.endsWith("_direction")) value = "neutral";
    if (key.endsWith("_relevance")) value = "moderate";
    if (key === "primary_signal") value = scenario.primarySignal ?? "reflection";
    if (key === "best_focus") value = scenario.bestFocus ?? "work";
    if (key === "caution_focus") value = "change_movement";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "moderate";
    if (key === "has_intraday_timing_signal") {
      value = observation.timingSignals.length > 0 ? "yes" : "no";
    }
    answers[key] = answer(value, labels);
  }
  for (const [domain, direction] of Object.entries(scenario.directions ?? {}) as [
    DailyDomain,
    Direction,
  ][]) {
    const key = `${domain}_direction`;
    answers[key] = answer(direction, Object.keys(request.questions[key].criteria));
  }
  for (const [domain, relevance] of Object.entries(scenario.relevances ?? {}) as [
    DailyDomain,
    Relevance,
  ][]) {
    const key = `${domain}_relevance`;
    answers[key] = answer(relevance, Object.keys(request.questions[key].criteria));
  }
  const result: NormalizationApiResult = {
    model: "jev-test",
    answers,
    usage: { input_tokens: 100, output_tokens: 200 },
  };
  return mapSystemOneResult(observation, result, { httpStatus: 200, requestId: null });
}

function three(
  western: Scenario,
  fourPillars: Scenario,
  nineStarKi: Scenario,
) {
  return computeConsensus([
    normalize(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, western),
    normalize(FOUR_PILLARS_FICTIONAL_FIXTURE, fourPillars),
    normalize(NINE_STAR_KI_FICTIONAL_FIXTURE, nineStarKi),
  ]);
}

test("three exact directions produce 3/3 exact agreement", () => {
  const result = three(
    { directions: { work: "positive" } },
    { directions: { work: "positive" } },
    { directions: { work: "positive" } },
  ).domains.work;
  assert.equal(result.methodCount, 3);
  assert.equal(result.agreementState, "exact_agreement");
  assert.equal(result.consensusDirection, "positive");
  assert.equal(result.majorityDirection, "positive");
  assert.equal(result.majorityCount, 3);
  assert.equal(result.agreement, 1);
});

test("two matching directions produce a descriptive 2/3 majority", () => {
  const result = three(
    { directions: { work: "positive" } },
    { directions: { work: "positive" } },
    { directions: { work: "negative" } },
  ).domains.work;
  assert.equal(result.agreementState, "majority_agreement");
  assert.equal(result.consensusDirection, "positive");
  assert.equal(result.majorityCount, 2);
  assert.deepEqual(result.minorityMethods, ["nine_star_ki"]);
  assert.deepEqual(result.outlierCandidates, ["nine_star_ki"]);
});

test("two matching relevant methods plus one insufficient still produce a 2/3 majority", () => {
  const result = three(
    { directions: { money: "positive" }, relevances: { money: "strong" } },
    { directions: { money: "positive" }, relevances: { money: "moderate" } },
    { directions: { money: "insufficient_signal" }, relevances: { money: "none" } },
  ).domains.money;
  assert.equal(result.relevantMethodCount, 2);
  assert.equal(result.agreementState, "majority_agreement");
  assert.equal(result.majorityDirection, "positive");
  assert.deepEqual(result.insufficientMethods, ["nine_star_ki"]);
  assert.deepEqual(result.minorityMethods, []);
});

test("one relevant method plus two insufficient methods has no consensus", () => {
  const result = three(
    { directions: { love: "positive" }, relevances: { love: "strong" } },
    { directions: { love: "insufficient_signal" }, relevances: { love: "none" } },
    { directions: { love: "insufficient_signal" }, relevances: { love: "none" } },
  ).domains.love;
  assert.equal(result.relevantMethodCount, 1);
  assert.equal(result.agreementState, "insufficient_coverage");
  assert.equal(result.consensusDirection, null);
  assert.equal(result.majorityDirection, null);
  assert.equal(result.majorityCount, 1);
});

test("three different non-opposite directions are mixed without a representative value", () => {
  const result = three(
    { directions: { action: "neutral" } },
    { directions: { action: "positive" } },
    { directions: { action: "very_positive" } },
  ).domains.action;
  assert.equal(result.agreementState, "mixed");
  assert.equal(result.consensusDirection, null);
  assert.equal(result.tie, true);
  assert.deepEqual(result.outlierCandidates, [
    "western_astrology",
    "four_pillars",
    "nine_star_ki",
  ]);
});

test("opposite directions without a majority produce no consensus", () => {
  const result = three(
    { directions: { relationships: "negative" } },
    { directions: { relationships: "neutral" } },
    { directions: { relationships: "positive" } },
  ).domains.relationships;
  assert.equal(result.agreementState, "no_consensus");
  assert.equal(result.disagreementState, "direction_disagreement");
  assert.equal(result.consensusDirection, null);
});

test("all insufficient is represented explicitly", () => {
  const insufficient = {
    directions: { health_energy: "insufficient_signal" as const },
    relevances: { health_energy: "none" as const },
  };
  const result = three(insufficient, insufficient, insufficient).domains.health_energy;
  assert.equal(result.relevantMethodCount, 0);
  assert.equal(result.consensusDirection, "insufficient_signal");
  assert.equal(result.agreementState, "insufficient_coverage");
  assert.equal(result.majorityCount, 0);
  assert.equal(result.tie, false);
});

test("neutral can be a 2/3 majority while the positive minority stays an outlier candidate", () => {
  const result = three(
    { directions: { decision_making: "neutral" } },
    { directions: { decision_making: "neutral" } },
    { directions: { decision_making: "positive" } },
  ).domains.decision_making;
  assert.equal(result.majorityDirection, "neutral");
  assert.equal(result.agreementState, "majority_agreement");
  assert.deepEqual(result.outlierCandidates, ["nine_star_ki"]);
});

test("global values use a majority and remain null when all three differ", () => {
  const consensus = three(
    { bestFocus: "work", primarySignal: "growth" },
    { bestFocus: "work", primarySignal: "reflection" },
    { bestFocus: "money", primarySignal: "caution" },
  );
  assert.equal(consensus.status, "three_method_comparison");
  assert.equal(consensus.methodCount, 3);
  assert.equal(consensus.bestFocus, "work");
  assert.equal(consensus.primarySignal, null);
  assert.ok(consensus.disagreementClassifications.includes("focus_disagreement"));
});
