import assert from "node:assert/strict";
import test from "node:test";

import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "../src/fixtures/four-pillars-fictional.js";
import { SANMEIGAKU_FICTIONAL_FIXTURE } from "../src/fixtures/sanmeigaku-fictional.js";
import { buildNormalizationRequest } from "../src/jev/normalize-method.js";

test("public Sanmeigaku fixture is fictional, bounded, and explicit about BaZi correlation", () => {
  const fixture = SANMEIGAKU_FICTIONAL_FIXTURE;
  assert.equal(fixture.methodId, "sanmeigaku");
  assert.notEqual(fixture.methodId, FOUR_PILLARS_FICTIONAL_FIXTURE.methodId);
  assert.equal(fixture.subject.dataClass, "fictional_fixture");
  assert.equal(fixture.provenance.sourceType, "fictional_fixture");
  assert.equal(fixture.timingSignals.length, 0);
  assert.ok(fixture.calculationFacts.length >= 9);
  assert.ok(fixture.interpretations.length >= 5);

  const factText = fixture.calculationFacts
    .map((fact) => fact.statement)
    .join(" ");
  for (const declaredScope of [
    "Yin Chart and Yang Chart",
    "deliberately identical to the existing Four Pillars / BaZi fixture",
    "does not reuse the BaZi fixture's Day Master-relative Ten Gods",
    "Ten Major Stars",
    "Twelve Subordinate Stars",
    "Tenchusatsu is not modeled",
    "synthetic target-day overlay",
  ]) {
    assert.ok(
      factText.includes(declaredScope),
      `Missing declared scope: ${declaredScope}`,
    );
  }

  const sharedPillarFact = fixture.calculationFacts.find(
    (fact) => fact.id === "san.fact.shared-pillar-input",
  );
  const baziPillarFact = FOUR_PILLARS_FICTIONAL_FIXTURE.calculationFacts.find(
    (fact) => fact.id === "fp.fact.natal-pillars",
  );
  assert.ok(sharedPillarFact);
  assert.ok(baziPillarFact);
  for (const pillar of ["Jia-Zi", "Ding-Mao", "Geng-Shen", "Ji-Mao"]) {
    assert.ok(sharedPillarFact.statement.includes(pillar));
    assert.ok(baziPillarFact.statement.includes(pillar));
  }

  assert.ok(fixture.limitations.some((value) => value.includes("fictional")));
  assert.ok(
    fixture.limitations.some((value) =>
      value.includes("deterministic Sanmeigaku calculation engine"),
    ),
  );
  assert.ok(
    fixture.limitations.some((value) =>
      value.includes("not statistically independent evidence"),
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
      "Every Sanmeigaku interpretation must declare basis fact IDs.",
    );
    for (const id of basis[1].split(",").map((value) => value.trim())) {
      assert.ok(factIds.has(id), `Unknown Sanmeigaku basis fact ID: ${id}`);
    }
  }
});

test("Sanmeigaku uses the unchanged no-timing normalization question schema", () => {
  const request = buildNormalizationRequest(SANMEIGAKU_FICTIONAL_FIXTURE);
  assert.equal(Object.keys(request.questions).length, 33);
  assert.equal(
    (request.state as Record<string, unknown>).contract,
    "daily-run-v0.2",
  );
});
