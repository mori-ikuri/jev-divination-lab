import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";

import type { ChoiceQuestion, ChoiceResponse } from "@typesafe-ai/sdk";

import { computeConsensus } from "../src/consensus/compute-consensus.js";
import {
  DAILY_DOMAINS,
  DAY_PARTS,
  type DailyDomain,
  type Direction,
  type MethodObservation,
  type Relevance,
} from "../src/contracts/daily-run.js";
import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "../src/fixtures/four-pillars-fictional.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "../src/fixtures/western-astrology-fictional.js";
import {
  buildNormalizationRequest,
  mapSystemOneResult,
  type NormalizationApiResult,
} from "../src/jev/normalize-method.js";
import { assertPrivateOutputRoot } from "../src/runtime/private-output.js";

interface NormalizedScenario {
  readonly directions?: Partial<Record<DailyDomain, Direction>>;
  readonly relevances?: Partial<Record<DailyDomain, Relevance>>;
  readonly bestFocus?: DailyDomain;
  readonly cautionFocus?: DailyDomain | "none";
}

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

function makeNormalized(observation: MethodObservation, scenario: NormalizedScenario = {}) {
  const request = buildNormalizationRequest(observation);
  const answers: Record<string, ChoiceResponse> = {};

  for (const [key, question] of Object.entries(request.questions)) {
    const labels = Object.keys(question.criteria);
    let value = labels[0];
    if (key.endsWith("_direction")) value = "neutral";
    if (key.endsWith("_relevance")) value = "moderate";
    if (key === "primary_signal") value = "execution";
    if (key === "best_focus") value = scenario.bestFocus ?? "work";
    if (key === "caution_focus") value = scenario.cautionFocus ?? "inner_state";
    if (key.endsWith("_readiness") || key === "social_openness") value = "medium";
    if (key === "risk_level") value = "low";
    if (key === "has_intraday_timing_signal") {
      value = observation.timingSignals.length > 0 ? "yes" : "no";
    }
    answers[key] = makeAnswer(value, labels);
  }

  for (const [domain, direction] of Object.entries(scenario.directions ?? {}) as [
    DailyDomain,
    Direction,
  ][]) {
    const key = `${domain}_direction`;
    answers[key] = makeAnswer(direction, Object.keys(request.questions[key].criteria));
  }
  for (const [domain, relevance] of Object.entries(scenario.relevances ?? {}) as [
    DailyDomain,
    Relevance,
  ][]) {
    const key = `${domain}_relevance`;
    answers[key] = makeAnswer(relevance, Object.keys(request.questions[key].criteria));
  }

  const result: NormalizationApiResult = {
    model: "jev-test",
    answers,
    usage: { input_tokens: 123, output_tokens: 456 },
  };
  return mapSystemOneResult(observation, result, {
    httpStatus: 200,
    requestId: "test-request-id",
  });
}

test("public Four Pillars fixture is fictional and keeps method-specific layers separate", () => {
  const fixture = FOUR_PILLARS_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "four_pillars");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.subject.id, WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.subject.id);
  assert.equal(fixture.targetDate, WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.targetDate);
  assert.equal(fixture.targetTimezone, WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.targetTimezone);
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.interpretations.length > 0);
  assert.ok(fixture.limitations.some((limitation) => limitation.includes("fictional")));

  const categories = new Set(fixture.calculationFacts.map((fact) => fact.category));
  for (const category of [
    "synthetic_natal_pillars",
    "day_master",
    "ten_gods",
    "five_elements_balance",
    "luck_cycle_influence",
    "annual_monthly_daily_influences",
    "clashes_combinations_harms_punishments",
    "useful_unfavorable_elements",
  ]) {
    assert.ok(categories.has(category), `missing Four Pillars category: ${category}`);
  }
});

test("Four Pillars uses the unchanged common normalization schema without timing questions", () => {
  const request = buildNormalizationRequest(FOUR_PILLARS_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(request.questions).length, 33);
  for (const domain of DAILY_DOMAINS) {
    assert.ok(request.questions[`${domain}_direction`]);
    assert.ok(request.questions[`${domain}_relevance`]);
  }
  for (const dayPart of DAY_PARTS) {
    assert.equal(request.questions[`${dayPart}_direction`], undefined);
  }

  const normalized = makeNormalized(FOUR_PILLARS_FICTIONAL_FIXTURE);
  assert.equal(normalized.methodId, "four_pillars");
  assert.equal(normalized.hasIntradayTimingSignal.value, "no");
  assert.equal(normalized.intradayDirections, undefined);
  assert.equal(Object.keys(normalized.rawResponse.answers).length, 33);
  assert.equal(normalized.rawResponse.answers.primary_signal.confidence, 0.7);
  assert.equal(normalized.rawResponse.answers.primary_signal.probabilities.execution, 0.7);
});

test("two methods report exact agreement without overstating an agreement rate", () => {
  const western = makeNormalized(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, {
    directions: { work: "positive" },
    relevances: { work: "strong" },
  });
  const fourPillars = makeNormalized(FOUR_PILLARS_FICTIONAL_FIXTURE, {
    directions: { work: "positive" },
    relevances: { work: "strong" },
  });
  const consensus = computeConsensus([western, fourPillars]);

  assert.equal(consensus.status, "two_method_comparison");
  assert.equal(consensus.methodCount, 2);
  assert.equal(consensus.domains.work.direction, "positive");
  assert.equal(consensus.domains.work.rawDirectionCounts.positive, 2);
  assert.equal(consensus.domains.work.relevantMethodCount, 2);
  assert.equal(consensus.domains.work.agreementState, "agreement");
  assert.equal(consensus.domains.work.disagreementState, "no_disagreement");
  assert.equal(consensus.domains.work.tie, false);
  assert.deepEqual(consensus.domains.work.outlierCandidates, []);
  assert.deepEqual(consensus.disagreementClassifications, ["no_disagreement"]);
});

test("opposite directions and different focus are classified as disagreement", () => {
  const western = makeNormalized(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, {
    directions: { work: "positive" },
    relevances: { work: "strong" },
    bestFocus: "work",
  });
  const fourPillars = makeNormalized(FOUR_PILLARS_FICTIONAL_FIXTURE, {
    directions: { work: "negative" },
    relevances: { work: "strong" },
    bestFocus: "relationships",
  });
  const consensus = computeConsensus([western, fourPillars]);

  assert.equal(consensus.domains.work.direction, null);
  assert.equal(consensus.domains.work.rawDirectionCounts.positive, 1);
  assert.equal(consensus.domains.work.rawDirectionCounts.negative, 1);
  assert.equal(consensus.domains.work.agreementState, "disagreement");
  assert.equal(consensus.domains.work.disagreementState, "direction_disagreement");
  assert.equal(consensus.domains.work.tie, true);
  assert.deepEqual(consensus.domains.work.outlierCandidates, [
    "western_astrology",
    "four_pillars",
  ]);
  assert.equal(consensus.bestFocus, null);
  assert.ok(consensus.disagreementClassifications.includes("direction_disagreement"));
  assert.ok(consensus.disagreementClassifications.includes("focus_disagreement"));
});

test("one relevant signal plus one insufficient signal reports insufficient coverage", () => {
  const western = makeNormalized(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, {
    directions: { money: "positive" },
    relevances: { money: "strong" },
  });
  const fourPillars = makeNormalized(FOUR_PILLARS_FICTIONAL_FIXTURE, {
    directions: { money: "insufficient_signal" },
    relevances: { money: "none" },
  });
  const consensus = computeConsensus([western, fourPillars]);

  assert.equal(consensus.domains.money.direction, "positive");
  assert.equal(consensus.domains.money.relevantMethodCount, 1);
  assert.equal(consensus.domains.money.agreement, null);
  assert.equal(consensus.domains.money.agreementState, "insufficient_coverage");
  assert.equal(consensus.domains.money.disagreementState, "insufficient_information");
  assert.equal(consensus.domains.money.tie, false);
  assert.deepEqual(consensus.domains.money.insufficientMethods, ["four_pillars"]);
  assert.ok(consensus.disagreementClassifications.includes("insufficient_information"));
});

test("neutral versus positive is an unweighted partial-disagreement tie", () => {
  const western = makeNormalized(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE, {
    directions: { action: "neutral" },
    relevances: { action: "strong" },
  });
  const fourPillars = makeNormalized(FOUR_PILLARS_FICTIONAL_FIXTURE, {
    directions: { action: "positive" },
    relevances: { action: "strong" },
  });
  const result = computeConsensus([western, fourPillars]).domains.action;

  assert.equal(result.direction, null);
  assert.equal(result.agreementState, "partial_disagreement");
  assert.equal(result.disagreementState, "direction_disagreement");
  assert.equal(result.tie, true);
  assert.equal(result.rawDirectionCounts.neutral, 1);
  assert.equal(result.rawDirectionCounts.positive, 1);
});

test("runtime output root must stay outside the public repository", () => {
  const repositoryRoot = resolve("D:\\Ikuri\\02-Lab\\Projects\\jev-divination-lab");
  const privateRoot = resolve("D:\\Ikuri\\02-Lab\\Data\\jev-divination-lab\\runs");

  assert.equal(assertPrivateOutputRoot(repositoryRoot, privateRoot), privateRoot);
  assert.throws(
    () => assertPrivateOutputRoot(repositoryRoot, resolve(repositoryRoot, "runtime-data")),
    /outside the public repository/,
  );
  assert.throws(
    () => assertPrivateOutputRoot(repositoryRoot, repositoryRoot),
    /outside the public repository/,
  );
});
