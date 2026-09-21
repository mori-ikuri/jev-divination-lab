import assert from "node:assert/strict";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { computeConsensus } from "../src/consensus/compute-consensus.js";
import type {
  DailyDomain,
  Direction,
  MethodObservation,
  Relevance,
} from "../src/contracts/daily-run.js";
import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "../src/fixtures/four-pillars-fictional.js";
import { NINE_STAR_KI_FICTIONAL_FIXTURE } from "../src/fixtures/nine-star-ki-fictional.js";
import { SUKUYO_FICTIONAL_FIXTURE } from "../src/fixtures/sukuyo-fictional.js";
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
    if (key === "primary_signal") value = "reflection";
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

function four(
  western: Scenario,
  fourPillars: Scenario,
  nineStarKi: Scenario,
  sukuyo: Scenario,
) {
  return computeConsensus([
    normalize(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, western),
    normalize(FOUR_PILLARS_FICTIONAL_FIXTURE, fourPillars),
    normalize(NINE_STAR_KI_FICTIONAL_FIXTURE, nineStarKi),
    normalize(SUKUYO_FICTIONAL_FIXTURE, sukuyo),
  ]);
}

test("four exact directions produce 4/4 exact agreement", () => {
  const scenario = { directions: { work: "positive" as const } };
  const result = four(scenario, scenario, scenario, scenario).domains.work;
  assert.equal(result.methodCount, 4);
  assert.equal(result.agreementState, "exact_agreement");
  assert.equal(result.consensusDirection, "positive");
  assert.equal(result.majorityCount, 4);
  assert.equal(result.agreement, 1);
});

test("three matching directions produce a 3/4 majority and minority candidate", () => {
  const positive = { directions: { work: "positive" as const } };
  const negative = { directions: { work: "negative" as const } };
  const result = four(positive, positive, positive, negative).domains.work;
  assert.equal(result.agreementState, "majority_agreement");
  assert.equal(result.majorityDirection, "positive");
  assert.equal(result.majorityCount, 3);
  assert.deepEqual(result.minorityMethods, ["sukuyo"]);
  assert.deepEqual(result.outlierCandidates, ["sukuyo"]);
});

test("a 2/2 split is a tie with no representative direction", () => {
  const positive = { directions: { action: "positive" as const } };
  const negative = { directions: { action: "negative" as const } };
  const result = four(positive, positive, negative, negative).domains.action;
  assert.equal(result.agreementState, "no_consensus");
  assert.equal(result.majorityDirection, null);
  assert.equal(result.consensusDirection, null);
  assert.equal(result.majorityCount, 2);
  assert.equal(result.tie, true);
});

test("two relevant methods plus two insufficient methods report insufficient coverage", () => {
  const positive = {
    directions: { money: "positive" as const },
    relevances: { money: "strong" as const },
  };
  const insufficient = {
    directions: { money: "insufficient_signal" as const },
    relevances: { money: "none" as const },
  };
  const result = four(positive, positive, insufficient, insufficient).domains.money;
  assert.equal(result.relevantMethodCount, 2);
  assert.equal(result.agreementState, "insufficient_coverage");
  assert.equal(result.consensusDirection, null);
  assert.equal(result.majorityDirection, null);
  assert.equal(result.tie, false);
  assert.deepEqual(result.outlierCandidates, []);
  assert.deepEqual(result.insufficientMethods, ["nine_star_ki", "sukuyo"]);
});

test("four different directions have no majority", () => {
  const result = four(
    { directions: { relationships: "negative" } },
    { directions: { relationships: "neutral" } },
    { directions: { relationships: "positive" } },
    { directions: { relationships: "very_positive" } },
  ).domains.relationships;
  assert.equal(result.agreementState, "no_consensus");
  assert.equal(result.consensusDirection, null);
  assert.equal(result.tie, true);
  assert.deepEqual(result.outlierCandidates, [
    "western_astrology",
    "four_pillars",
    "nine_star_ki",
    "sukuyo",
  ]);
});

test("global values require a 3/4 majority", () => {
  const consensus = four(
    { bestFocus: "work" },
    { bestFocus: "work" },
    { bestFocus: "work" },
    { bestFocus: "money" },
  );
  assert.equal(consensus.status, "four_method_comparison");
  assert.equal(consensus.methodCount, 4);
  assert.equal(consensus.bestFocus, "work");
  assert.ok(consensus.disagreementClassifications.includes("focus_disagreement"));
});
