import assert from "node:assert/strict";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { DAILY_DOMAINS, DAY_PARTS } from "../src/contracts/daily-run.js";
import { SUKUYO_FICTIONAL_FIXTURE } from "../src/fixtures/sukuyo-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";

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

test("public Sukuyo fixture is fictional and keeps mansion concepts method-specific", () => {
  const fixture = SUKUYO_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "sukuyo");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.interpretations.length > 0);
  assert.ok(fixture.limitations.some((value) => value.includes("fictional")));

  const categories = new Set(fixture.calculationFacts.map((fact) => fact.category));
  for (const category of [
    "mansion_system",
    "synthetic_natal_mansion",
    "synthetic_target_day_mansion",
    "synthetic_distance_relationship",
    "daily_relationship",
    "auspicious_caution_factors",
  ]) {
    assert.ok(categories.has(category), `missing Sukuyo category: ${category}`);
  }
});

test("Sukuyo maps through the unchanged 33-answer common schema", () => {
  const fixture = SUKUYO_FICTIONAL_FIXTURE;
  const request = buildNormalizationRequest(fixture);
  assert.equal(Object.keys(request.questions).length, 33);
  for (const domain of DAILY_DOMAINS) {
    assert.ok(request.questions[`${domain}_direction`]);
    assert.ok(request.questions[`${domain}_relevance`]);
  }
  for (const dayPart of DAY_PARTS) {
    assert.equal(request.questions[`${dayPart}_direction`], undefined);
  }

  const answers: Record<string, ChoiceResponse> = {};
  for (const [key, question] of Object.entries(request.questions)) {
    const labels = Object.keys(question.criteria);
    let value = labels[0];
    if (key.endsWith("_direction")) value = "neutral";
    if (key.endsWith("_relevance")) value = "moderate";
    if (key === "primary_signal") value = "connection";
    if (key === "best_focus") value = "relationships";
    if (key === "caution_focus") value = "decision_making";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "moderate";
    if (key === "has_intraday_timing_signal") value = "no";
    answers[key] = answer(value, labels);
  }
  const result: NormalizationApiResult = {
    model: "jev-test",
    answers,
    usage: { input_tokens: 123, output_tokens: 234 },
  };
  const normalized = mapSystemOneResult(fixture, result, {
    httpStatus: 200,
    requestId: "test-request-id",
  });

  assert.equal(normalized.methodId, "sukuyo");
  assert.equal(normalized.hasIntradayTimingSignal.value, "no");
  assert.equal(normalized.intradayDirections, undefined);
  assert.equal(Object.keys(normalized.rawResponse.answers).length, 33);
  assert.equal(normalized.rawResponse.answers.primary_signal.confidence, 0.7);
  assert.equal(normalized.rawResponse.answers.primary_signal.probabilities.connection, 0.7);
  assert.deepEqual(normalized.rawResponse.usage, { input_tokens: 123, output_tokens: 234 });
});
