import assert from "node:assert/strict";
import test from "node:test";

import { JYOTISH_FICTIONAL_FIXTURE } from "../src/fixtures/jyotish-fictional.js";
import { buildNormalizationRequest } from "../src/jev/normalize-method.js";

test("public Jyotish fixture is fictional, reproducible, and convention-explicit", () => {
  const fixture = JYOTISH_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "jyotish");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.provenance.sourceType, "fictional_fixture");
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.calculationFacts.length >= 8);
  assert.ok(fixture.interpretations.length >= 4);

  const factText = fixture.calculationFacts
    .map((fact) => fact.statement)
    .join(" ");
  for (const convention of [
    "Lahiri ayanamsha",
    "whole-sign houses",
    "mean Rahu/Ketu",
    "Parashari-style",
    "Vimshottari",
  ]) {
    assert.ok(
      factText.includes(convention),
      `Missing convention: ${convention}`,
    );
  }

  assert.ok(fixture.limitations.some((value) => value.includes("fictional")));
  assert.ok(
    fixture.limitations.some((value) =>
      value.includes("deterministic Jyotish calculation engine"),
    ),
  );
  assert.ok(
    fixture.limitations.some((value) =>
      value.includes("timingSignals is intentionally empty"),
    ),
  );

  const factIds = new Set(fixture.calculationFacts.map((fact) => fact.id));
  assert.equal(factIds.size, fixture.calculationFacts.length);
  for (const interpretation of fixture.interpretations) {
    const basis = interpretation.match(/^\[basis: ([^\]]+)\]/);
    assert.ok(
      basis,
      "Every Jyotish interpretation must declare basis fact IDs.",
    );
    for (const id of basis[1].split(",").map((value) => value.trim())) {
      assert.ok(factIds.has(id), `Unknown Jyotish basis fact ID: ${id}`);
    }
  }
});

test("Jyotish uses the unchanged no-timing normalization question schema", () => {
  const request = buildNormalizationRequest(JYOTISH_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(request.questions).length, 33);
  assert.equal(
    (request.state as Record<string, unknown>).contract,
    "daily-run-v0.2",
  );
});
