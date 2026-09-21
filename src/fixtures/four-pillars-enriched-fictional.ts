import type { MethodObservation } from "../contracts/daily-run.js";

export const FOUR_PILLARS_ENRICHED_FICTIONAL_FIXTURE: MethodObservation = {
  methodId: "four_pillars",
  subject: {
    id: "fictional-aster-001",
    label: "Aster Vale (fictional)",
    dataClass: "fictional_fixture",
  },
  targetDate: "2026-09-22",
  targetTimezone: "Etc/UTC",
  calculationFacts: [
    {
      id: "fpe.fact.calculation-config",
      category: "synthetic_calculation_configuration",
      statement:
        "This fictional experiment uses a Zi Ping-style Day-Master-centered Ten Gods model, standard hidden-stem membership, solar-term month-command logic, and explicitly supplied luck, annual, monthly, and daily pillars. All pillars and period layers are hand-authored test data rather than calendrical output.",
    },
    {
      id: "fpe.fact.natal-pillars",
      category: "synthetic_natal_four_pillars",
      statement:
        "The full fictional natal chart is year Jia-Zi, month Ding-Mao, day Geng-Shen, and hour Ji-Mao. The Day Master is the Geng stem of the day pillar.",
    },
    {
      id: "fpe.fact.hidden-stems",
      category: "synthetic_hidden_stems",
      statement:
        "The branch hidden stems used by this fixture are Zi: Gui; natal Mao: Yi; Shen: Geng, Ren, and Wu; and hour Mao: Yi.",
    },
    {
      id: "fpe.fact.ten-gods-map",
      category: "synthetic_ten_gods_mapping",
      statement:
        "Relative to the fictional Geng Metal Day Master, Jia is Indirect Wealth, Yi Direct Wealth, Bing Seven Killings, Ding Direct Officer, Wu Indirect Resource, Ji Direct Resource, Geng Friend, Xin Rob Wealth, Ren Eating God, and Gui Hurting Officer.",
    },
    {
      id: "fpe.fact.natal-ten-gods",
      category: "synthetic_natal_ten_gods",
      statement:
        "The exposed natal stems are Jia Indirect Wealth, Ding Direct Officer, Geng Day Master/Friend, and Ji Direct Resource. Hidden roles are Gui Hurting Officer in Zi; Yi Direct Wealth in each Mao; and Geng Friend, Ren Eating God, and Wu Indirect Resource in Shen.",
    },
    {
      id: "fpe.fact.month-command",
      category: "synthetic_seasonal_strength",
      statement:
        "Mao is the fictional month command, placing the chart in spring Wood season. Wood receives seasonal command, while Geng Metal is out of season.",
    },
    {
      id: "fpe.fact.day-master-strength",
      category: "synthetic_day_master_strength",
      statement:
        "Under the selected support-and-restraint assessment, Geng Metal is classified as moderately weak but rooted: it has a direct root in the Shen day branch and receives visible Ji plus hidden Wu Earth support, while seasonal Wood, visible Ding Fire, and Water output consume or control part of its capacity. It is not classified as a follow structure.",
    },
    {
      id: "fpe.fact.five-elements",
      category: "synthetic_five_elements_distribution",
      statement:
        "The natal distribution is qualitatively Wood-dominant because of the Mao month command, two Mao branches, and exposed Jia. Metal is rooted in Shen, Earth is visible in Ji and hidden in Shen, Water appears in Zi and Shen, and Fire is exposed as Ding without a natal Fire branch. No numerical element weights are asserted.",
    },
    {
      id: "fpe.fact.useful-elements",
      category: "synthetic_useful_unfavorable_elements",
      statement:
        "Within the selected support-and-restraint school assumption, Earth and Metal are the primary balancing elements for the moderately weak Geng Day Master; limited Water output is conditional, while additional Wood and Fire are treated as potentially overloading. This is a fixture-scoped assessment rather than a school-independent rule.",
    },
    {
      id: "fpe.fact.natal-stem-combinations",
      category: "synthetic_heavenly_stem_combinations",
      statement:
        "Natal Jia and Ji form a recognized Jia-Ji combination toward Earth. The fixture records combination without assuming transformation because transformation conditions are not established.",
    },
    {
      id: "fpe.fact.natal-branch-relations",
      category: "synthetic_natal_branch_interactions",
      statement:
        "Natal Zi and each Mao form a Zi-Mao punishment under the selected convention; the repeated Mao branches are recorded as Mao-Mao self-punishment under the same convention; and natal Shen plus Zi form two members of a Shen-Zi-Chen Water frame with Chen absent.",
    },
    {
      id: "fpe.fact.spouse-palace",
      category: "synthetic_spouse_palace",
      statement:
        "The fictional day branch and partnership palace is Shen, containing hidden Geng Friend, Ren Eating God, and Wu Indirect Resource. The fixture does not select a gender-dependent spouse star because no sex or gender convention is supplied.",
    },
    {
      id: "fpe.fact.luck-pillar",
      category: "synthetic_luck_pillar",
      statement:
        "The fictional current luck pillar is Ren-Wu: Ren is Eating God, while Wu contains hidden Ding Direct Officer and Ji Direct Resource.",
    },
    {
      id: "fpe.fact.annual-influence",
      category: "synthetic_annual_influence",
      statement:
        "The fictional annual pillar is Bing-Wu: Bing is Seven Killings, while Wu contains hidden Ding Direct Officer and Ji Direct Resource.",
    },
    {
      id: "fpe.fact.monthly-influence",
      category: "synthetic_monthly_influence",
      statement:
        "The fictional monthly pillar is Ding-You: Ding is Direct Officer and You contains hidden Xin Rob Wealth.",
    },
    {
      id: "fpe.fact.daily-influence",
      category: "synthetic_daily_influence",
      statement:
        "The fictional daily pillar is Gui-Hai: Gui is Hurting Officer, while Hai contains hidden Ren Eating God and Jia Indirect Wealth.",
    },
    {
      id: "fpe.fact.layered-stem-interactions",
      category: "synthetic_layered_stem_interactions",
      statement:
        "Across natal and period layers, natal Ding and luck-pillar Ren form a Ding-Ren combination toward Wood without assumed transformation; annual Bing adds Seven Killings; monthly Ding repeats Direct Officer; and daily Gui Hurting Officer is simultaneously present with those officer influences.",
    },
    {
      id: "fpe.fact.layered-clashes",
      category: "synthetic_layered_branch_clashes",
      statement:
        "The luck-pillar and annual Wu each clash the natal Zi, while monthly You clashes both natal Mao branches.",
    },
    {
      id: "fpe.fact.layered-harms-combinations",
      category: "synthetic_layered_harms_combinations",
      statement:
        "Daily Hai harms the natal Shen partnership palace and joins each natal Mao as two members of a Hai-Mao-Wei Wood frame with Wei absent. The fixture records partial configuration only and does not assert full transformation.",
    },
    {
      id: "fpe.fact.ten-god-flow",
      category: "synthetic_ten_gods_interactions",
      statement:
        "The combined layers contain Water output through Ren and Gui, Wood wealth through Jia and Yi, Fire officer/Seven Killings through Ding and Bing, Earth resource through Ji and Wu, and Metal peer/root through Geng and incoming You-Xin. The generative sequence Water to Wood to Fire is present alongside Earth-to-Metal support.",
    },
  ],
  interpretations: [
    "[basis: fpe.fact.day-master-strength, fpe.fact.useful-elements, fpe.fact.ten-god-flow, fpe.fact.layered-clashes] The overall target-period signal is mixed and demanding: support exists, but multiple active output, wealth, and authority layers require bounded scope.",
    "[basis: fpe.fact.natal-ten-gods, fpe.fact.annual-influence, fpe.fact.monthly-influence, fpe.fact.useful-elements] Work and duty are prominent through repeated officer pressure, with resource support favoring preparation and explicit priorities over accepting every demand.",
    "[basis: fpe.fact.month-command, fpe.fact.natal-ten-gods, fpe.fact.daily-influence, fpe.fact.ten-god-flow] Wealth signals are visible and seasonally strong, but the moderately weak Day Master makes resource limits and transaction clarity more important than expansion alone.",
    "[basis: fpe.fact.spouse-palace, fpe.fact.layered-harms-combinations, fpe.fact.monthly-influence] Intimate and partnership conditions carry a mixed signal because the partnership palace is directly involved in a daily harm while external relationship structures are also active.",
    "[basis: fpe.fact.natal-branch-relations, fpe.fact.layered-clashes, fpe.fact.layered-harms-combinations] Interpersonal coordination benefits from naming changed expectations, because several natal and incoming branch relations disturb established patterns.",
    "[basis: fpe.fact.daily-influence, fpe.fact.layered-stem-interactions, fpe.fact.ten-god-flow] Expression is active through Eating God and Hurting Officer, but messages should be checked against formal duties and constraints represented by Direct Officer and Seven Killings.",
    "[basis: fpe.fact.day-master-strength, fpe.fact.five-elements, fpe.fact.annual-influence, fpe.fact.useful-elements] For the common health_energy axis only, the symbolic vitality signal favors sustainable pacing and support; it does not imply an organ, disease, diagnosis, or treatment claim.",
    "[basis: fpe.fact.layered-stem-interactions, fpe.fact.daily-influence, fpe.fact.useful-elements] For the common inner_state axis, the fixture treats output-versus-duty tension as a bounded reflection/readiness signal rather than a diagnosis or fixed personality claim.",
    "[basis: fpe.fact.natal-ten-gods, fpe.fact.luck-pillar, fpe.fact.daily-influence] Resource and output roles support study, explanation, and converting observations into a concrete artifact.",
    "[basis: fpe.fact.day-master-strength, fpe.fact.useful-elements, fpe.fact.layered-clashes] Decisions benefit from explicit criteria, reversible commitments, and checking which change is structural rather than reacting to every clash at once.",
    "[basis: fpe.fact.day-master-strength, fpe.fact.annual-influence, fpe.fact.monthly-influence] Action is available through authority pressure and a rooted Day Master, but the preferred pattern is prioritized completion rather than maximum simultaneous effort.",
    "[basis: fpe.fact.natal-branch-relations, fpe.fact.layered-clashes, fpe.fact.layered-harms-combinations] Change and adjustment are leading themes because multiple incoming branches directly activate natal Zi, Mao, and Shen positions.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "All natal and period pillars are synthetic research inputs rather than outputs from a calendrical engine or solar-term calculation.",
    "Day Master strength, useful elements, self-punishment, partnership-palace usage, and transformation rules vary by school; the selected assumptions are recorded in provenance.",
    "No sex or gender-dependent spouse-star convention is applied.",
    "The health_energy and inner_state interpretations are symbolic coverage tests only and are not medical, psychological, diagnostic, or treatment claims.",
    "No hour-by-hour period calculation is supplied, so timingSignals is intentionally empty.",
    "The fixture does not establish that Four Pillars is predictively valid and does not provide practical financial, health, relationship, or career advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.four-pillars.enriched.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.1-four-pillars-enrichment",
    createdAt: "2026-09-21T00:00:00.000Z",
    notes: [
      "Fictional chart and fictional target date; no real birth date, time, place, sex, gender, identity, or private runtime data is included.",
      "Calculation source/type: hand-authored synthetic Zi Ping-style pillars, hidden stems, Ten Gods, seasonal strength, support-and-restraint assessment, and supplied luck/annual/monthly/daily interactions.",
      "Interpretation source/type: hand-authored Four Pillars research interpretations derived only from the listed calculation fact IDs.",
      "School/version assumptions: Day-Master-centered Ten Gods; standard hidden-stem membership; Mao-Mao self-punishment recognized; day branch treated as partnership palace; stem/branch combinations do not transform unless conditions are explicitly established; no gendered spouse-star mapping.",
      "This fixture is experimental and does not replace the original Four Pillars baseline fixture.",
    ],
  },
};
