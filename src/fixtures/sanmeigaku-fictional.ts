import type { MethodObservation } from "../contracts/daily-run.js";

export const SANMEIGAKU_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "sanmeigaku",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "san.fact.calculation-config",
      category: "synthetic_calculation_configuration",
      statement:
        "This fictional fixture uses a limited direct-state Sanmeigaku research profile with separate Yin Chart and Yang Chart layers. It supplies the calculated state directly rather than selecting an unstated lineage or claiming to represent Sanmeigaku as a whole.",
    },
    {
      id: "san.fact.shared-pillar-input",
      category: "shared_synthetic_stem_branch_input",
      statement:
        "The synthetic natal input is deliberately identical to the existing Four Pillars / BaZi fixture: year Jia-Zi, month Ding-Mao, day Geng-Shen, and hour Ji-Mao. The target-period input likewise reuses Bing-Wu annual, Ding-You monthly, and synthetic Gui-Hai daily influences. None of these values is derived from real birth data or a calendar engine.",
    },
    {
      id: "san.fact.shared-concepts-boundary",
      category: "shared_concepts_and_method_boundary",
      statement:
        "Sanmeigaku and the BaZi fixture share Heavenly Stems, Earthly Branches, yin-yang, and five-element concepts. This profile does not reuse the BaZi fixture's Day Master-relative Ten Gods, useful-element, or clash-scoring interpretation; those remain BaZi-specific inputs in this repository.",
    },
    {
      id: "san.fact.yin-chart",
      category: "selected_yin_chart_pattern",
      statement:
        "The supplied Yin Chart layer retains the repeated Mao Wood branches, the Geng-Shen Metal axis, and the target Gui-Hai Water influence as a synthetic pattern of development pressure, structural discipline, and increased movement or expression. It is a direct fixture state, not a full hidden-stem or school-specific scoring calculation.",
    },
    {
      id: "san.fact.ten-major-stars",
      category: "selected_ten_major_star_positions",
      statement:
        "The Yang Chart layer supplies five positions from the Ten Major Stars system: Gyokudo (玉堂星) in the center, Ryuko (龍高星) in the north, Hohkaku (鳳閣星) in the south, Shaki (車騎星) in the east, and Shiroku (司禄星) in the west. The remaining five major stars and their derivation rules are not modeled.",
    },
    {
      id: "san.fact.twelve-subordinate-stars",
      category: "selected_twelve_subordinate_star_positions",
      statement:
        "Only three structural life-stage markers from the Twelve Subordinate Stars are supplied: Tenki (天貴星) for the early stage, Tensho (天将星) for the middle stage, and Tendo (天堂星) for the later stage. They are retained as background structure and are not treated as target-day timing signals.",
    },
    {
      id: "san.fact.tenchusatsu-scope",
      category: "tenchusatsu_scope",
      statement:
        "Tenchusatsu is not modeled. The fixture does not choose a void-group derivation, start or end boundary, annual, monthly, or daily activation rule, or a school-specific interpretation of the concept.",
    },
    {
      id: "san.fact.target-day-overlay",
      category: "synthetic_target_day_overlay",
      statement:
        "For 2026-09-22, a synthetic target-day overlay gives priority to Gyokudo and Hohkaku for learning and explanation, Shaki for bounded execution, Shiroku for practical stewardship, and Ryuko for reversible exploration. The overlay is supplied directly and is not a generated daily Sanmeigaku chart.",
    },
    {
      id: "san.fact.timing-scope",
      category: "timing_scope",
      statement:
        "No method-native hourly chart, time-block calculation, or defensible intraday activation boundary is supplied, so the fixture does not support morning, afternoon, evening, or late-night differentiation.",
    },
  ],
  interpretations: [
    "[basis: san.fact.ten-major-stars, san.fact.target-day-overlay] Learning, explanation, and creative communication are the clearest supports when ideas are converted into explicit notes or criteria.",
    "[basis: san.fact.yin-chart, san.fact.target-day-overlay] Work and action favor disciplined, bounded execution while leaving room for reversible exploration and adjustment.",
    "[basis: san.fact.ten-major-stars, san.fact.target-day-overlay] Practical stewardship and completion are favored over expanding financial or material commitments without review.",
    "[basis: san.fact.shared-concepts-boundary, san.fact.ten-major-stars] Relationships benefit from direct coordination and steady follow-through rather than assuming shared priorities from common background alone.",
    "[basis: san.fact.twelve-subordinate-stars, san.fact.tenchusatsu-scope] The life-stage markers remain structural context only, and no target-day warning or opportunity is inferred from Tenchusatsu because that layer is excluded.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The shared pillars, Yin Chart state, Yang Chart stars, and target-day overlay are public synthetic test inputs, not personal or private runtime data.",
    "The supplied state is hand-authored fixture data and is not output from a deterministic Sanmeigaku calculation engine or calendrical converter.",
    "Sanmeigaku schools and teaching lineages differ; this fixture implements only the declared direct-state profile and does not silently generalize its star names, positions, or interpretive rules.",
    "The Yin Chart layer is partial, the Yang Chart includes only five Ten Major Star positions and three Twelve Subordinate Star stages, and Tenchusatsu is excluded.",
    "This method deliberately shares its stem-branch input with the Four Pillars / BaZi fixture. The two normalized methods are correlated and are not statistically independent evidence, even though the registry records them as separate descriptive consensus contributors.",
    "Consensus agreement between Sanmeigaku and BaZi must not be described as independent corroboration; Daily Run v0.2 applies no correlation discount or method weighting.",
    "No defensible hour-level calculation is supplied, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not empirically validated predictions, medical guidance, financial guidance, or advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.sanmeigaku.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.2-sanmeigaku-direct-state-profile-001",
    createdAt: "2026-09-24T00:00:00.000Z",
    notes: [
      "Hand-authored to test a limited Sanmeigaku Yin Chart and Yang Chart interpretation without changing the common contract.",
      "The natal and target-period stem-branch vector is intentionally shared with fixture.four-pillars.001, creating known method correlation.",
      "No real identity, birth data, private runtime data, or API credential is included.",
    ],
  },
};
