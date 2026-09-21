import assert from "node:assert/strict";
import test from "node:test";

import type {
  ChoiceQuestion,
  ChoiceResponse,
} from "@typesafe-ai/sdk";

import {
  DAILY_DOMAINS,
  DAY_PARTS,
  DIRECTION_VALUES,
  RELEVANCE_VALUES,
  type MethodObservation,
} from "../src/contracts/daily-run.js";
import { computeConsensus } from "../src/consensus/compute-consensus.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "../src/fixtures/western-astrology-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";
import { deriveExecutionDateKey } from "../src/runtime/run-date.js";

function makeAnswer(choiceValue: string, labels: readonly string[]): ChoiceResponse {
  const selectedProbability = 0.7;
  const remaining = labels.length > 1 ? 0.3 / (labels.length - 1) : 0;
  return {
    type: "choice",
    choice: choiceValue,
    confidence: selectedProbability,
    probabilities: Object.fromEntries(
      labels.map((label) => [label, label === choiceValue ? selectedProbability : remaining]),
    ),
  };
}

function makeFixtureResult(
  questions: Readonly<Record<string, ChoiceQuestion>>,
): NormalizationApiResult {
  const answers: Record<string, ChoiceResponse> = {};
  for (const [key, question] of Object.entries(questions)) {
    const labels = Object.keys(question.criteria);
    let value = labels[0];
    if (key.endsWith("_direction")) value = "neutral";
    if (key.endsWith("_relevance")) value = "moderate";
    if (key === "primary_signal") value = "execution";
    if (key === "best_focus") value = "work";
    if (key === "caution_focus") value = "inner_state";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "low";
    if (key === "has_intraday_timing_signal") value = "yes";
    answers[key] = makeAnswer(value, labels);
  }

  return {
    model: "jev-test",
    answers,
    usage: { input_tokens: 100, output_tokens: 200 },
  };
}

test("public western astrology fixture is explicitly fictional and complete", () => {
  const fixture = WESTERN_ASTROLOGY_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "western_astrology");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.provenance.sourceType, "fictional_fixture");
  assert.ok(fixture.calculationFacts.length > 0);
  assert.ok(fixture.interpretations.length > 0);
  assert.ok(fixture.timingSignals.length > 0);
  assert.ok(fixture.limitations.some((limitation) => limitation.includes("fictional")));
});

test("normalization request contains 12 domain pairs, global axes, and conditional timing", () => {
  assert.deepEqual(DAILY_DOMAINS, [
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
  ]);
  assert.deepEqual(DIRECTION_VALUES, [
    "very_negative",
    "negative",
    "neutral",
    "positive",
    "very_positive",
    "insufficient_signal",
  ]);
  assert.deepEqual(RELEVANCE_VALUES, ["none", "weak", "moderate", "strong", "dominant"]);

  const withTiming = buildNormalizationRequest(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(withTiming.questions).length, 37);

  for (const domain of DAILY_DOMAINS) {
    assert.ok(withTiming.questions[`${domain}_direction`]);
    assert.ok(withTiming.questions[`${domain}_relevance`]);
  }
  for (const dayPart of DAY_PARTS) {
    assert.ok(withTiming.questions[`${dayPart}_direction`]);
  }

  const withoutTiming: MethodObservation = {
    ...WESTERN_ASTROLOGY_FICTIONAL_FIXTURE,
    timingSignals: [],
  };
  const noTimingRequest = buildNormalizationRequest(withoutTiming);
  assert.equal(Object.keys(noTimingRequest.questions).length, 33);
  for (const dayPart of DAY_PARTS) {
    assert.equal(noTimingRequest.questions[`${dayPart}_direction`], undefined);
  }
});

test("runtime path uses the execution date in the execution timezone, not targetDate", () => {
  const executionDate = deriveExecutionDateKey({
    executionTimestamp: "2026-09-21T07:09:42.000Z",
    executionTimezone: "Asia/Tokyo",
  });

  assert.equal(executionDate, "2026-09-21");
});

test("typed mapping preserves raw response evidence and produces one-method baseline", () => {
  const request = buildNormalizationRequest(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE);
  const apiResult = makeFixtureResult(request.questions);
  const normalized = mapSystemOneResult(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, apiResult, {
    httpStatus: 200,
    requestId: "test-request-id",
  });

  assert.equal(normalized.domains.work.direction.value, "neutral");
  assert.equal(normalized.domains.work.relevance.value, "moderate");
  assert.equal(normalized.primarySignal.value, "execution");
  assert.equal(normalized.rawResponse.model, "jev-test");
  assert.equal(normalized.rawResponse.answers.primary_signal.confidence, 0.7);
  assert.equal(normalized.rawResponse.answers.primary_signal.probabilities.execution, 0.7);
  assert.deepEqual(normalized.rawResponse.usage, {
    input_tokens: 100,
    output_tokens: 200,
  });

  const consensus = computeConsensus([normalized]);
  assert.equal(consensus.status, "single_method_baseline");
  assert.equal(consensus.methodCount, 1);
  assert.equal(consensus.domains.work.agreement, null);
  assert.equal(consensus.primarySignal, "execution");
  assert.deepEqual(consensus.disagreementClassifications, ["insufficient_information"]);
  assert.throws(() => computeConsensus([]), /one to four normalized methods/);
  assert.throws(
    () => computeConsensus([normalized, normalized]),
    /unique methodId/,
  );
});
