import type { MethodObservation } from "../contracts/daily-run.js";

export const WESTERN_ASTROLOGY_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "western_astrology",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "wa.fact.moon-mercury",
      category: "synthetic_transit",
      statement:
        "Synthetic scenario: the transiting Moon forms a trine to fictional natal Mercury during the morning window.",
    },
    {
      id: "wa.fact.mars-saturn",
      category: "synthetic_transit",
      statement:
        "Synthetic scenario: transiting Mars forms a square to fictional natal Saturn throughout the target date.",
    },
    {
      id: "wa.fact.venus-jupiter",
      category: "synthetic_transit",
      statement:
        "Synthetic scenario: transiting Venus forms a sextile to fictional natal Jupiter from afternoon into early evening.",
    },
    {
      id: "wa.fact.moon-late",
      category: "synthetic_lunar_condition",
      statement:
        "Synthetic scenario: lunar momentum is treated as low after 20:30 local time.",
    },
  ],
  interpretations: [
    "Morning conditions support concise communication, review, and organizing near-term priorities.",
    "The Mars-Saturn tension favors measured execution over forcing speed or escalating commitments.",
    "Afternoon social and creative exchanges can be constructive when expectations remain explicit.",
    "Late evening is better suited to closure and recovery than starting an irreversible task.",
  ],
  timingSignals: [
    {
      dayPart: "morning",
      startLocal: "07:00",
      endLocal: "11:00",
      direction: "supportive",
      summary: "Favors clear messages, review, and prioritization.",
      basisFactIds: ["wa.fact.moon-mercury"],
    },
    {
      dayPart: "afternoon",
      startLocal: "13:00",
      endLocal: "17:30",
      direction: "supportive",
      summary: "Favors collaborative or creative work with explicit scope.",
      basisFactIds: ["wa.fact.venus-jupiter", "wa.fact.mars-saturn"],
    },
    {
      dayPart: "evening",
      startLocal: "17:30",
      endLocal: "20:30",
      direction: "neutral",
      summary: "Mixed signal: connection is available, but effort should stay bounded.",
      basisFactIds: ["wa.fact.venus-jupiter", "wa.fact.mars-saturn"],
    },
    {
      dayPart: "late_night",
      startLocal: "20:30",
      endLocal: "23:59",
      direction: "challenging",
      summary: "Prefer closure, rest, and deferring new commitments.",
      basisFactIds: ["wa.fact.moon-late", "wa.fact.mars-saturn"],
    },
  ],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The placements are synthetic test inputs, not an astronomical ephemeris calculation.",
    "Interpretations are bounded research data, not deterministic predictions or advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.western-astrology.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.1",
    createdAt: "2026-09-21T00:00:00.000Z",
    notes: [
      "Hand-authored for public contract and normalization tests.",
      "No real birth data, identity, ephemeris output, or private runtime data is included.",
    ],
  },
};
