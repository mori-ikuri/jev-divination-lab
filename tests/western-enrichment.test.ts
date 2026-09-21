import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { compareWesternEnrichment } from "../src/experiments/compare-western-enrichment.js";
import {
  DAILY_DOMAINS,
  type DailyDomain,
  type Direction,
  type MethodObservation,
  type Relevance,
} from "../src/contracts/daily-run.js";
import { WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE } from "../src/fixtures/western-astrology-enriched-fictional.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "../src/fixtures/western-astrology-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";
import { assertPrivateOutputRoot } from "../src/runtime/private-output.js";

interface Scenario {
  readonly directions?: Partial<Record<DailyDomain, Direction>>;
  readonly relevances?: Partial<Record<DailyDomain, Relevance>>;
  readonly usage?: { readonly input_tokens: number; readonly output_tokens: number };
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

function normalizeFixture(observation: MethodObservation, scenario: Scenario = {}) {
  const request = buildNormalizationRequest(observation);
  const answers: Record<string, ChoiceResponse> = {};
  for (const [key, question] of Object.entries(request.questions)) {
    const labels = Object.keys(question.criteria);
    let value = labels[0];
    if (key.endsWith("_direction")) value = "neutral";
    if (key.endsWith("_relevance")) value = "moderate";
    if (key === "primary_signal") value = "reflection";
    if (key === "best_focus") value = "creativity_learning";
    if (key === "caution_focus") value = "decision_making";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "moderate";
    if (key === "has_intraday_timing_signal") value = "yes";
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
    usage: scenario.usage ?? { input_tokens: 100, output_tokens: 200 },
  };
  return mapSystemOneResult(observation, result, {
    httpStatus: 200,
    requestId: "test-request-id",
  });
}

test("enriched Western fixture contains fictional chart, house, transit, and aspect facts", () => {
  const fixture = WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "western_astrology");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.subject.id, WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.subject.id);
  assert.equal(fixture.targetDate, WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.targetDate);

  const categories = new Set(fixture.calculationFacts.map((fact) => fact.category));
  for (const category of [
    "synthetic_calculation_configuration",
    "synthetic_natal_angles",
    "synthetic_natal_houses",
    "synthetic_house_rulers",
    "synthetic_natal_planet_positions",
    "synthetic_target_day_transit_positions",
    "synthetic_relevant_house_transits",
    "synthetic_natal_transit_aspect",
    "synthetic_intraday_aspect_windows",
  ]) {
    assert.ok(categories.has(category), `missing enriched category: ${category}`);
  }

  const facts = fixture.calculationFacts.map((fact) => fact.statement).join(" ");
  for (const planet of [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ]) {
    assert.match(facts, new RegExp(`\\b${planet}\\b`));
  }
  for (let house = 1; house <= 12; house += 1) {
    const suffix = house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th";
    assert.match(facts, new RegExp(`\\b${house}${suffix}\\b`));
  }
  assert.match(facts, /applies/);
  assert.match(facts, /separates/);
  assert.match(facts, /exact/);
});

test("calculation facts and interpretations remain separate and traceable", () => {
  const fixture = WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE;
  const factIds = new Set(fixture.calculationFacts.map((fact) => fact.id));
  assert.equal(factIds.size, fixture.calculationFacts.length);

  for (const interpretation of fixture.interpretations) {
    const match = /^\[basis: ([^\]]+)\]/.exec(interpretation);
    assert.ok(match, `interpretation lacks basis prefix: ${interpretation}`);
    for (const factId of match[1].split(", ")) {
      assert.ok(factIds.has(factId), `interpretation references unknown fact: ${factId}`);
    }
  }
  for (const signal of fixture.timingSignals) {
    for (const factId of signal.basisFactIds) {
      assert.ok(factIds.has(factId), `timing signal references unknown fact: ${factId}`);
    }
  }
  assert.ok(
    fixture.provenance.notes.some((note) => note.startsWith("Calculation source/type:")),
  );
  assert.ok(
    fixture.provenance.notes.some((note) => note.startsWith("Interpretation source/type:")),
  );
});

test("existing Western baseline fixture remains unchanged", () => {
  const baseline = WESTERN_ASTROLOGY_FICTIONAL_FIXTURE;
  assert.equal(baseline.provenance.sourceId, "fixture.western-astrology.001");
  assert.equal(baseline.calculationFacts.length, 4);
  assert.equal(baseline.timingSignals.length, 4);
  assert.ok(baseline.calculationFacts.every((fact) => fact.id.startsWith("wa.fact.")));
});

test("enriched fixture uses the unchanged Western normalization schema", () => {
  const baseline = buildNormalizationRequest(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE);
  const enriched = buildNormalizationRequest(WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(enriched.questions).length, 37);
  assert.deepEqual(Object.keys(enriched.questions).sort(), Object.keys(baseline.questions).sort());
  for (const domain of DAILY_DOMAINS) {
    assert.ok(enriched.questions[`${domain}_direction`]);
    assert.ok(enriched.questions[`${domain}_relevance`]);
  }
});

test("coverage comparison reports relevance, confidence, and token deltas", () => {
  const baseline = normalizeFixture(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, {
    directions: { money: "insufficient_signal", change_movement: "insufficient_signal" },
    relevances: { money: "none", change_movement: "none" },
    usage: { input_tokens: 100, output_tokens: 200 },
  });
  const experimental = normalizeFixture(WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE, {
    directions: { money: "positive", change_movement: "positive" },
    relevances: { money: "strong", change_movement: "moderate" },
    usage: { input_tokens: 150, output_tokens: 260 },
  });
  const comparison = compareWesternEnrichment(baseline, experimental);

  assert.deepEqual(comparison.insufficientToRelevantDomains, ["money", "change_movement"]);
  assert.deepEqual(comparison.relevanceIncreasedDomains, ["money", "change_movement"]);
  assert.deepEqual(comparison.directionChangedDomains, ["money", "change_movement"]);
  assert.equal(comparison.coverageDelta, 2);
  assert.equal(comparison.insufficientSignalDelta, -2);
  assert.equal(comparison.domainEvidenceConfidenceDelta, 0);
  assert.deepEqual(comparison.usageDelta, {
    inputTokens: 50,
    outputTokens: 60,
    totalTokens: 110,
  });
});

test("experiment output and baseline paths must stay outside the public repository", () => {
  const repositoryRoot = resolve("D:\\AI-Work\\JevLab\\jev-divination-lab");
  const privateRoot = resolve("D:\\AI-Work\\JevLab-Data\\runs");
  assert.equal(assertPrivateOutputRoot(repositoryRoot, privateRoot), privateRoot);
  assert.throws(
    () => assertPrivateOutputRoot(repositoryRoot, resolve(repositoryRoot, "experiment-output")),
    /outside the public repository/,
  );
});
