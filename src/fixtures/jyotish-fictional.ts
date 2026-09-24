import type { MethodObservation } from "../contracts/daily-run.js";

export const JYOTISH_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "jyotish",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "jyo.fact.calculation-config",
      category: "synthetic_calculation_configuration",
      statement:
        "This fictional fixture uses a sidereal zodiac with Lahiri ayanamsha, whole-sign houses, the seven classical grahas, and mean Rahu/Ketu. It excludes outer planets, divisional charts, and alternative ayanamsha or house conventions. This is one explicit research profile, not a universal Jyotish standard.",
    },
    {
      id: "jyo.fact.interpretive-config",
      category: "synthetic_interpretive_configuration",
      statement:
        "The fixture uses a limited Parashari-style profile: sign and whole-sign house placement, classical graha dignity, the standard special aspects of Mars, Jupiter, and Saturn, and a supplied Vimshottari dasha state. Node aspects, yogas, shadbala, varga synthesis, and remedial measures are intentionally out of scope.",
    },
    {
      id: "jyo.fact.synthetic-chart",
      category: "fictional_chart_vector",
      statement:
        "The supplied synthetic natal vector assigns Gemini lagna; Moon in Taurus in Rohini; Sun and Mercury in Virgo; Jupiter in Sagittarius; Saturn in Aquarius; Mars in Gemini; Venus in Libra; Rahu in Aries; and Ketu in Libra. These placements are fixture inputs and are not derived from a real birth moment or ephemeris.",
    },
    {
      id: "jyo.fact.chart-emphasis",
      category: "synthetic_natal_emphasis",
      statement:
        "Under the selected profile, Mercury in Virgo emphasizes analysis and communication, Venus in Libra emphasizes creative refinement, Moon in Taurus emphasizes steadiness, and Mars in the lagna adds initiative that benefits from deliberate pacing.",
    },
    {
      id: "jyo.fact.dasha-state",
      category: "synthetic_vimshottari_state",
      statement:
        "For the target date, the fixture supplies a Mercury mahadasha and Jupiter antardasha. The period boundaries are synthetic test data and are not calculated from a birth time or a deterministic dasha engine.",
    },
    {
      id: "jyo.fact.target-transits",
      category: "synthetic_target_day_transits",
      statement:
        "For contract testing on 2026-09-22, the fixture assigns Jupiter to Gemini, Saturn to Pisces, and the Moon to Virgo. These target-day placements are synthetic and must not be read as astronomical positions for that date.",
    },
    {
      id: "jyo.fact.transit-relations",
      category: "synthetic_transit_relations",
      statement:
        "Within the supplied whole-sign model, Jupiter activates the lagna and aspects the relationship sector, Saturn emphasizes structured responsibility in the tenth house, and the Moon joins the Virgo analytical emphasis. These relations are evaluated only under the declared Parashari-style rules.",
    },
    {
      id: "jyo.fact.timing-scope",
      category: "timing_scope",
      statement:
        "No birth-time rectification, muhurta, hora, panchanga interval, or exact transit-ingress window is supplied, so the fixture does not support morning, afternoon, evening, or late-night differentiation.",
    },
  ],
  interpretations: [
    "[basis: jyo.fact.chart-emphasis, jyo.fact.dasha-state] The Mercury-Jupiter emphasis supports analysis, explanation, study, and decisions that can be stated with explicit reasons.",
    "[basis: jyo.fact.target-transits, jyo.fact.transit-relations] Work and public responsibilities favor structure, bounded scope, and completion criteria over rapid expansion.",
    "[basis: jyo.fact.synthetic-chart, jyo.fact.transit-relations] Relationship and collaboration themes are constructive when expectations are made explicit and initiative remains responsive rather than forceful.",
    "[basis: jyo.fact.chart-emphasis, jyo.fact.transit-relations] Creative learning and reflective review are supported, while action and change benefit from deliberate pacing.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The chart vector, dasha state, and target-day transits are public synthetic test inputs, not personal or private runtime data.",
    "The supplied placements are hand-authored fixture data and are not output from a deterministic Jyotish calculation engine or astronomical ephemeris.",
    "Jyotish schools differ; this fixture uses only the explicitly declared Lahiri, whole-sign, mean-node, limited Parashari-style, and Vimshottari profile.",
    "No divisional-chart, yoga, strength, panchanga, muhurta, rectification, or remedial analysis is performed.",
    "No defensible hour-level calculation is supplied, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not empirically validated predictions, medical guidance, financial guidance, or advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.jyotish.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.2-jyotish-lahiri-parashari-profile-001",
    createdAt: "2026-09-24T00:00:00.000Z",
    notes: [
      "Hand-authored to test separation of Jyotish-specific facts from common normalization axes.",
      "Every placement and timing state is explicitly synthetic; no real birth data, identity, private runtime data, or API credential is included.",
    ],
  },
};
