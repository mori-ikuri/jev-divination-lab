import type { MethodObservation } from "../contracts/daily-run.js";

export const SUKUYO_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "sukuyo",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "sy.fact.system",
      category: "mansion_system",
      statement:
        "This synthetic fixture adopts a 27-mansion Sukuyo system for testing and does not mix it with a 28-mansion calculation.",
    },
    {
      id: "sy.fact.natal-mansion",
      category: "synthetic_natal_mansion",
      statement:
        "The fictional subject is assigned Shitsu-shuku (室宿) as the natal mansion; it is not derived from a real birth date or lunar-calendar calculation.",
    },
    {
      id: "sy.fact.target-mansion",
      category: "synthetic_target_day_mansion",
      statement:
        "The fictional target date is assigned Kaku-shuku (角宿) as the target-day mansion; this assignment is not calendar-derived.",
    },
    {
      id: "sy.fact.relation",
      category: "synthetic_distance_relationship",
      statement:
        "For contract testing, the natal and target-day mansions are labeled as an Ei-Shin (栄・親) style relationship at medium distance; the label is supplied rather than calculated.",
    },
    {
      id: "sy.fact.daily-relation",
      category: "daily_relationship",
      statement:
        "The synthetic daily relationship emphasizes cooperative development and review while retaining caution around assumptions and irreversible commitments.",
    },
    {
      id: "sy.fact.auspicious-caution",
      category: "auspicious_caution_factors",
      statement:
        "The fixture marks study, clarification, and relationship maintenance as constructive themes, with overcommitment and unverified expectations as caution themes.",
    },
  ],
  interpretations: [
    "The supplied Ei-Shin-style relationship favors constructive exchange when expectations and responsibilities are made explicit.",
    "The target-day symbolism supports study, review, and relationship maintenance more strongly than irreversible expansion.",
    "Cooperation remains conditional on clarifying assumptions instead of treating compatibility language as guaranteed agreement.",
    "Sukuyo-specific mansion and distance concepts remain source observations and are not exposed as common normalization domains.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The mansions and relationship label are synthetic inputs, not outputs from a lunar-calendar calculation engine.",
    "No real birth date, identity, location, partner data, or private runtime data is included.",
    "The fixture selects the 27-mansion system only; it does not compare results with a 28-mansion system.",
    "No hour-level calculation is supplied, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not deterministic predictions or relationship advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.sukuyo.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.1",
    createdAt: "2026-09-21T00:00:00.000Z",
    notes: [
      "Hand-authored to test separation of Sukuyo concepts from common normalization axes.",
      "No real birth data, identity, compatibility target, private runtime data, or API credential is included.",
    ],
  },
};
