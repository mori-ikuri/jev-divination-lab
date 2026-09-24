import type { MethodObservation } from "../contracts/daily-run.js";

export const ZI_WEI_DOU_SHU_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "zi_wei_dou_shu",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "zwd.fact.calculation-config",
      category: "synthetic_calculation_configuration",
      statement:
        "This fictional fixture uses a directly supplied twelve-palace Zi Wei Dou Shu state for contract research. It does not derive the chart from Gregorian-to-lunar conversion, leap-month rules, a birth-hour boundary, true-solar-time correction, or a historical school-specific star-placement algorithm. The direct-state profile is one explicit test convention, not Zi Wei Dou Shu as a whole.",
    },
    {
      id: "zwd.fact.palace-scope",
      category: "synthetic_palace_scope",
      statement:
        "The profile retains the twelve role labels Life, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Fortune, and Parents. Friends is used as the fixture label for the palace also called Servants in some conventions. Detailed interpretation is limited to Life, Career, Wealth, Travel, Spouse, and Fortune; the other palaces remain present but unevaluated.",
    },
    {
      id: "zwd.fact.principal-stars",
      category: "selected_principal_star_placements",
      statement:
        "The supplied fictional state places Zi Wei and Tian Fu in Life, Tian Ji in Career, Wu Qu in Wealth, Tai Yang in Travel, Tai Yin in Spouse, and Tian Liang in Fortune. It does not claim a complete placement of all fourteen principal stars or a chart that can be regenerated from birth data.",
    },
    {
      id: "zwd.fact.auxiliary-stars",
      category: "selected_auxiliary_star_placements",
      statement:
        "Only the literary auxiliary stars Wen Chang in Career and Wen Qu in Fortune are included. Other auspicious auxiliaries, malefic stars, minor stars, brightness states, and star-strength tables are not modeled.",
    },
    {
      id: "zwd.fact.four-transformations",
      category: "four_transformations_scope",
      statement:
        "Hua Lu, Hua Quan, Hua Ke, and Hua Ji, including natal and flowing-period Four Transformations, are not modeled. The fixture therefore does not choose among competing Heavenly Stem transformation tables.",
    },
    {
      id: "zwd.fact.target-day-overlay",
      category: "synthetic_flowing_day_overlay",
      statement:
        "For 2026-09-22, a synthetic flowing-day overlay marks Career and Travel as the primary active palaces, Fortune and Life as reflective counterweights, and Wealth and Spouse as secondary context. This overlay is supplied directly rather than calculated from lunar-calendar or palace-rotation rules.",
    },
    {
      id: "zwd.fact.target-day-relations",
      category: "synthetic_target_day_relations",
      statement:
        "Within the supplied overlay, Tian Ji with Wen Chang emphasizes planning and explanation in Career, Tai Yang emphasizes visible outward action in Travel, Zi Wei with Tian Fu emphasizes bounded coordination in Life, and Tian Liang with Wen Qu emphasizes review and learning in Fortune.",
    },
    {
      id: "zwd.fact.timing-scope",
      category: "timing_scope",
      statement:
        "No flowing-hour palace rotation, hourly stem, double-hour boundary, or other method-native intraday layer is supplied, so the fixture does not support morning, afternoon, evening, or late-night differentiation.",
    },
  ],
  interpretations: [
    "[basis: zwd.fact.principal-stars, zwd.fact.target-day-relations] Career themes favor structured planning, clear explanation, and decisions that can be reviewed against explicit criteria.",
    "[basis: zwd.fact.target-day-overlay, zwd.fact.target-day-relations] Outward action and change are supported when visibility is paired with bounded scope rather than rapid expansion.",
    "[basis: zwd.fact.principal-stars, zwd.fact.target-day-overlay] Wealth and resource themes favor practical stewardship, while relationship themes benefit from quiet expectation-setting rather than assumed agreement.",
    "[basis: zwd.fact.auxiliary-stars, zwd.fact.target-day-relations] Reflection, communication, and creative learning are constructive counterweights to execution pressure.",
    "[basis: zwd.fact.four-transformations, zwd.fact.target-day-overlay] Because Four Transformations are excluded, the daily interpretation remains a limited palace-activation comparison and does not infer transformation-based gains, authority, recognition, or obstruction.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The palace state, star placements, and flowing-day overlay are public synthetic test inputs, not personal or private runtime data.",
    "The supplied state is hand-authored fixture data and is not output from a deterministic Zi Wei Dou Shu calculation engine, lunar-calendar converter, or ephemeris.",
    "Zi Wei Dou Shu schools differ in calendar conversion, leap-month handling, hour boundaries, palace placement, star tables, Four Transformations, and interpretive synthesis; this fixture implements only the declared direct-state profile.",
    "The fixture evaluates selected palaces, seven named principal-star roles, and two literary auxiliary stars; it is not a complete fourteen-principal-star chart.",
    "Four Transformations, minor stars, malefic-star systems, brightness tables, decade, annual, monthly, and flowing-hour calculations are not modeled.",
    "No defensible hour-level calculation is supplied, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not empirically validated predictions, medical guidance, financial guidance, or advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.zi-wei-dou-shu.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.2-zi-wei-direct-state-profile-001",
    createdAt: "2026-09-24T00:00:00.000Z",
    notes: [
      "Hand-authored to test separation of Zi Wei Dou Shu palace and star concepts from common normalization axes.",
      "No real identity, birth data, calendar conversion result, private runtime data, or API credential is included.",
    ],
  },
};
