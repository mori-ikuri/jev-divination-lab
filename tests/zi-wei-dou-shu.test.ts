import assert from "node:assert/strict";
import test from "node:test";

import { ZI_WEI_DOU_SHU_FICTIONAL_FIXTURE } from "../src/fixtures/zi-wei-dou-shu-fictional.js";
import { buildNormalizationRequest } from "../src/jev/normalize-method.js";

test("public Zi Wei Dou Shu fixture is fictional, reproducible, and convention-explicit", () => {
  const fixture = ZI_WEI_DOU_SHU_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "zi_wei_dou_shu");
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.provenance.sourceType, "fictional_fixture");
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.calculationFacts.length >= 8);
  assert.ok(fixture.interpretations.length >= 5);

  const factText = fixture.calculationFacts
    .map((fact) => fact.statement)
    .join(" ");
  for (const declaredScope of [
    "directly supplied twelve-palace",
    "Detailed interpretation is limited",
    "does not claim a complete placement of all fourteen principal stars",
    "Only the literary auxiliary stars Wen Chang",
    "Four Transformations",
    "are not modeled",
    "synthetic flowing-day overlay",
  ]) {
    assert.ok(
      factText.includes(declaredScope),
      `Missing declared scope: ${declaredScope}`,
    );
  }

  assert.ok(fixture.limitations.some((value) => value.includes("fictional")));
  assert.ok(
    fixture.limitations.some((value) =>
      value.includes("deterministic Zi Wei Dou Shu calculation engine"),
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
      "Every Zi Wei Dou Shu interpretation must declare basis fact IDs.",
    );
    for (const id of basis[1].split(",").map((value) => value.trim())) {
      assert.ok(factIds.has(id), `Unknown Zi Wei Dou Shu basis fact ID: ${id}`);
    }
  }
});

test("Zi Wei Dou Shu uses the unchanged no-timing normalization question schema", () => {
  const request = buildNormalizationRequest(ZI_WEI_DOU_SHU_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(request.questions).length, 33);
  assert.equal(
    (request.state as Record<string, unknown>).contract,
    "daily-run-v0.2",
  );
});
