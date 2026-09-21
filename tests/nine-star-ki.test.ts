import assert from "node:assert/strict";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { DAILY_DOMAINS, DAY_PARTS } from "../src/contracts/daily-run.js";
import { NINE_STAR_KI_FICTIONAL_FIXTURE } from "../src/fixtures/nine-star-ki-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";

function answer(choiceValue: string, labels: readonly string[]): ChoiceResponse {
  const confidence = 0.7;
  const remainder = labels.length > 1 ? 0.3 / (labels.length - 1) : 0;
  return {
    type: "choice",
    choice: choiceValue,
    confidence,
    probabilities: Object.fromEntries(
      labels.map((label) => [label, label === choiceValue ? confidence : remainder]),
    ),
  };
}

test("public Nine Star Ki fixture is fictional and method-specific", () => {
  const fixture = NINE_STAR_KI_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "nine_star_ki");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.calculationFacts.length > 0);
  assert.ok(fixture.interpretations.length > 0);
  assert.ok(fixture.limitations.some((value) => value.includes("fictional")));

  const categories = new Set(fixture.calculationFacts.map((fact) => fact.category));
  for (const category of [
    "synthetic_natal_stars",
    "annual_monthly_daily_stars",
    "synthetic_nine_palace_pattern",
    "five_element_relations",
    "directional_conditions",
  ]) {
    assert.ok(categories.has(category), `missing Nine Star Ki category: ${category}`);
  }
});

test("Nine Star Ki maps through the unchanged 33-answer common schema", () => {
  const fixture = NINE_STAR_KI_FICTIONAL_FIXTURE;
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
    if (key === "primary_signal") value = "reflection";
    if (key === "best_focus") value = "creativity_learning";
    if (key === "caution_focus") value = "change_movement";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "moderate";
    if (key === "has_intraday_timing_signal") value = "no";
    answers[key] = answer(value, labels);
  }

  const result: NormalizationApiResult = {
    model: "jev-test",
    answers,
    usage: { input_tokens: 111, output_tokens: 222 },
  };
  const normalized = mapSystemOneResult(fixture, result, {
    httpStatus: 200,
    requestId: "test-request-id",
  });

  assert.equal(normalized.methodId, "nine_star_ki");
  assert.equal(normalized.hasIntradayTimingSignal.value, "no");
  assert.equal(normalized.intradayDirections, undefined);
  assert.equal(Object.keys(normalized.rawResponse.answers).length, 33);
  assert.equal(normalized.rawResponse.answers.primary_signal.confidence, 0.7);
  assert.equal(normalized.rawResponse.answers.primary_signal.probabilities.reflection, 0.7);
  assert.deepEqual(normalized.rawResponse.usage, { input_tokens: 111, output_tokens: 222 });
});
