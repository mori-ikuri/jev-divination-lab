import type { MethodObservation } from "../contracts/daily-run.js";

export const NUMEROLOGY_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "numerology",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "num.fact.calculation-config",
      category: "synthetic_calculation_configuration",
      statement:
        "This fictional fixture uses Pythagorean letter values, decimal digit summing, and repeated reduction to 1-9 while preserving 11, 22, and 33 only when they occur as an unreduced total. This is one explicit research convention, not a universal numerology standard.",
    },
    {
      id: "num.fact.fictional-inputs",
      category: "fictional_test_inputs",
      statement:
        "The public test vector uses the explicitly fictional name Aster Vale and fictional birth date 1991-11-03. The values do not describe a real user and are included only to make the arithmetic reproducible.",
    },
    {
      id: "num.fact.life-path",
      category: "life_path_number",
      statement:
        "The fictional birth-date digits sum to 25 and reduce to Life Path 7: 1+9+9+1+1+1+0+3=25, then 2+5=7.",
    },
    {
      id: "num.fact.name-numbers",
      category: "synthetic_name_numbers",
      statement:
        "Under the selected Pythagorean mapping, Aster Vale yields Expression 4 from total 31, Soul Urge 3 from vowel total 12, and Personality 1 from consonant total 19.",
    },
    {
      id: "num.fact.universal-cycles",
      category: "universal_year_month_day",
      statement:
        "For 2026-09-22, the Universal Year is 1, Universal Month is 1, and Universal Day is 5: 2026 reduces to 1; 1+9 reduces to 1; and 1+22 reduces to 5.",
    },
    {
      id: "num.fact.personal-cycles",
      category: "personal_year_month_day",
      statement:
        "Using the fictional birth month and day under the selected convention, the Personal Year is 6, Personal Month is 6, and Personal Day is 1 for 2026-09-22.",
    },
    {
      id: "num.fact.interactions",
      category: "number_interactions",
      statement:
        "The supplied pattern combines reflective Life Path 7 and structured Expression 4 with a Personal Day 1 initiation theme, Universal Day 5 change theme, and Personal Year/Month 6 responsibility theme.",
    },
  ],
  interpretations: [
    "[basis: num.fact.life-path, num.fact.interactions] Reflection, research, and deliberate learning remain stronger supports than acting from unexamined urgency.",
    "[basis: num.fact.name-numbers, num.fact.personal-cycles] Structured execution can support a bounded new start when responsibilities and completion criteria are explicit.",
    "[basis: num.fact.universal-cycles, num.fact.interactions] The contrast between change-oriented 5 and initiating 1 favors reversible action while cautioning against impulsive expansion.",
    "[basis: num.fact.name-numbers, num.fact.personal-cycles] Communication and relationship maintenance are constructive when creative expression does not displace practical obligations.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The name and birth date are public synthetic test inputs, not personal or private runtime data.",
    "The arithmetic is hand-authored fixture data and is not output from a deterministic numerology generator.",
    "Numerology conventions differ; this fixture implements only the explicitly stated Pythagorean reduction profile.",
    "No method-native hour calculation is supplied, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not empirically validated predictions or advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.numerology.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.2-pythagorean-profile-001",
    createdAt: "2026-09-24T00:00:00.000Z",
    notes: [
      "Hand-authored to test separation of numerology-specific facts from common normalization axes.",
      "No real identity, birth data, private runtime data, or API credential is included.",
    ],
  },
};
