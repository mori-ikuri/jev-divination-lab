import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";

import type { ChoiceResponse } from "@typesafe-ai/sdk";

import { compareFourPillarsEnrichment } from "../src/experiments/compare-four-pillars-enrichment.js";
import {
  DAILY_DOMAINS,
  DAY_PARTS,
  type DailyDomain,
  type Direction,
  type MethodObservation,
  type Relevance,
} from "../src/contracts/daily-run.js";
import { FOUR_PILLARS_ENRICHED_FICTIONAL_FIXTURE } from "../src/fixtures/four-pillars-enriched-fictional.js";
import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "../src/fixtures/four-pillars-fictional.js";
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
    if (key === "best_focus") value = "decision_making";
    if (key === "caution_focus") value = "health_energy";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "moderate";
    if (key === "has_intraday_timing_signal") value = "no";
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

test("enriched Four Pillars fixture contains layered fictional calculation facts", () => {
  const fixture = FOUR_PILLARS_ENRICHED_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "four_pillars");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.subject.id, FOUR_PILLARS_FICTIONAL_FIXTURE.subject.id);
  assert.equal(fixture.targetDate, FOUR_PILLARS_FICTIONAL_FIXTURE.targetDate);
  assert.equal(fixture.timingSignals.length, 0);

  const categories = new Set(fixture.calculationFacts.map((fact) => fact.category));
  for (const category of [
    "synthetic_natal_four_pillars",
    "synthetic_hidden_stems",
    "synthetic_ten_gods_mapping",
    "synthetic_day_master_strength",
    "synthetic_five_elements_distribution",
    "synthetic_seasonal_strength",
    "synthetic_useful_unfavorable_elements",
    "synthetic_heavenly_stem_combinations",
    "synthetic_natal_branch_interactions",
    "synthetic_spouse_palace",
    "synthetic_luck_pillar",
    "synthetic_annual_influence",
    "synthetic_monthly_influence",
    "synthetic_daily_influence",
    "synthetic_layered_stem_interactions",
    "synthetic_layered_branch_clashes",
    "synthetic_layered_harms_combinations",
  ]) {
    assert.ok(categories.has(category), `missing enriched category: ${category}`);
  }

  const facts = fixture.calculationFacts.map((fact) => fact.statement).join(" ");
  assert.match(facts, /year Jia-Zi, month Ding-Mao, day Geng-Shen, and hour Ji-Mao/);
  assert.match(facts, /Zi: Gui/);
  assert.match(facts, /Shen: Geng, Ren, and Wu/);
  assert.match(facts, /Jia is Indirect Wealth/);
  assert.match(facts, /Gui is Hurting Officer/);
  assert.match(facts, /clash/);
  assert.match(facts, /harms/);
  assert.match(facts, /punishment/);
});

test("Four Pillars facts and interpretations remain separate and linked by fact ID", () => {
  const fixture = FOUR_PILLARS_ENRICHED_FICTIONAL_FIXTURE;
  const factIds = new Set(fixture.calculationFacts.map((fact) => fact.id));
  assert.equal(factIds.size, fixture.calculationFacts.length);

  for (const interpretation of fixture.interpretations) {
    const match = /^\[basis: ([^\]]+)\]/.exec(interpretation);
    assert.ok(match, `interpretation lacks basis prefix: ${interpretation}`);
    for (const factId of match[1].split(", ")) {
      assert.ok(factIds.has(factId), `interpretation references unknown fact: ${factId}`);
    }
  }
  assert.ok(
    fixture.provenance.notes.some((note) => note.startsWith("Calculation source/type:")),
  );
  assert.ok(
    fixture.provenance.notes.some((note) => note.startsWith("Interpretation source/type:")),
  );
  assert.ok(
    fixture.provenance.notes.some((note) => note.startsWith("School/version assumptions:")),
  );
});

test("existing Four Pillars baseline fixture remains unchanged", () => {
  const baseline = FOUR_PILLARS_FICTIONAL_FIXTURE;
  assert.equal(baseline.provenance.sourceId, "fixture.four-pillars.001");
  assert.equal(baseline.calculationFacts.length, 8);
  assert.equal(baseline.timingSignals.length, 0);
  assert.ok(baseline.calculationFacts.every((fact) => fact.id.startsWith("fp.fact.")));
});

test("enriched Four Pillars fixture uses the unchanged 33-answer schema", () => {
  const baseline = buildNormalizationRequest(FOUR_PILLARS_FICTIONAL_FIXTURE);
  const enriched = buildNormalizationRequest(FOUR_PILLARS_ENRICHED_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(enriched.questions).length, 33);
  assert.deepEqual(Object.keys(enriched.questions).sort(), Object.keys(baseline.questions).sort());
  for (const domain of DAILY_DOMAINS) {
    assert.ok(enriched.questions[`${domain}_direction`]);
    assert.ok(enriched.questions[`${domain}_relevance`]);
  }
  for (const dayPart of DAY_PARTS) {
    assert.equal(enriched.questions[`${dayPart}_direction`], undefined);
  }
});

test("coverage comparison reports increases, decreases, confidence, and token deltas", () => {
  const baseline = normalizeFixture(FOUR_PILLARS_FICTIONAL_FIXTURE, {
    directions: {
      overall: "insufficient_signal",
      love: "insufficient_signal",
      health_energy: "insufficient_signal",
      inner_state: "insufficient_signal",
    },
    relevances: {
      overall: "none",
      love: "none",
      health_energy: "none",
      inner_state: "none",
      action: "strong",
    },
    usage: { input_tokens: 100, output_tokens: 200 },
  });
  const experimental = normalizeFixture(FOUR_PILLARS_ENRICHED_FICTIONAL_FIXTURE, {
    directions: {
      overall: "neutral",
      love: "neutral",
      health_energy: "neutral",
      inner_state: "neutral",
      action: "positive",
    },
    relevances: {
      overall: "dominant",
      love: "strong",
      health_energy: "moderate",
      inner_state: "moderate",
      action: "moderate",
    },
    usage: { input_tokens: 170, output_tokens: 250 },
  });
  const comparison = compareFourPillarsEnrichment(baseline, experimental);

  assert.deepEqual(comparison.insufficientToRelevantDomains, [
    "overall",
    "love",
    "health_energy",
    "inner_state",
  ]);
  assert.deepEqual(comparison.relevanceIncreasedDomains, [
    "overall",
    "love",
    "health_energy",
    "inner_state",
  ]);
  assert.deepEqual(comparison.relevanceDecreasedDomains, ["action"]);
  assert.deepEqual(comparison.directionChangedDomains, [
    "overall",
    "love",
    "health_energy",
    "inner_state",
    "action",
  ]);
  assert.equal(comparison.coverageDelta, 4);
  assert.equal(comparison.insufficientSignalDelta, -4);
  assert.equal(comparison.domainEvidenceConfidenceDelta, 0);
  assert.deepEqual(comparison.usageDelta, {
    inputTokens: 70,
    outputTokens: 50,
    totalTokens: 120,
  });
});

test("Four Pillars experiment paths must stay outside the public repository", () => {
  const repositoryRoot = resolve("D:\\AI-Work\\JevLab\\jev-divination-lab");
  const privateRoot = resolve("D:\\AI-Work\\JevLab-Data\\runs");
  assert.equal(assertPrivateOutputRoot(repositoryRoot, privateRoot), privateRoot);
  assert.throws(
    () => assertPrivateOutputRoot(repositoryRoot, resolve(repositoryRoot, "experiment-output")),
    /outside the public repository/,
  );
});
