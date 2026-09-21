import type { MethodObservation } from "../contracts/daily-run.js";

export const NINE_STAR_KI_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "nine_star_ki",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "nsk.fact.natal-stars",
      category: "synthetic_natal_stars",
      statement:
        "Synthetic profile for contract testing: honmei star Six White Metal and getsumei star Three Jade Wood. These stars are not derived from a real birth year or month.",
    },
    {
      id: "nsk.fact.period-stars",
      category: "annual_monthly_daily_stars",
      statement:
        "The fictional target period assigns One White Water to the annual center, Four Green Wood to the monthly center, and Nine Purple Fire to the daily center; these assignments are not calendar-derived.",
    },
    {
      id: "nsk.fact.palace-pattern",
      category: "synthetic_nine_palace_pattern",
      statement:
        "The synthetic daily plate highlights the center, east, and northwest palaces for comparison while leaving other palace signals secondary.",
    },
    {
      id: "nsk.fact.element-relations",
      category: "five_element_relations",
      statement:
        "In the supplied pattern, Water supports Wood, Fire restrains Metal, and Metal restrains Wood, creating both support and control relationships among the active stars.",
    },
    {
      id: "nsk.fact.directional-scope",
      category: "directional_conditions",
      statement:
        "The fixture marks east as a growth-oriented symbolic sector and northwest as a discipline-oriented symbolic sector, without evaluating real travel or relocation directions.",
    },
  ],
  interpretations: [
    "Nine Purple Fire at the synthetic daily center emphasizes visibility, discernment, and the need to separate clear priorities from momentary urgency.",
    "The Water-to-Wood support pattern favors learning, communication, and gradual development when scope remains explicit.",
    "Fire-Metal and Metal-Wood control relationships suggest balancing decisiveness with flexibility rather than forcing one mode throughout the day.",
    "Directional symbolism is retained as method-specific context and does not establish advice about actual movement or relocation.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The natal and period stars are synthetic research inputs, not outputs from a Nine Star Ki calendrical engine.",
    "No real birth data, identity, current location, destination, or travel direction is included.",
    "No hour plate or defensible intraday evidence is supplied, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not deterministic predictions or directional advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.nine-star-ki.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.1",
    createdAt: "2026-09-21T00:00:00.000Z",
    notes: [
      "Hand-authored to test separation of Nine Star Ki concepts from common normalization axes.",
      "No real birth data, identity, private runtime data, or API credential is included.",
    ],
  },
};
