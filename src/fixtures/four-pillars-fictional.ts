import type { MethodObservation } from "../contracts/daily-run.js";

export const FOUR_PILLARS_FICTIONAL_FIXTURE: MethodObservation = {
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
      id: "fp.fact.natal-pillars",
      category: "synthetic_natal_pillars",
      statement:
        "Synthetic chart for contract testing: year pillar Jia-Zi, month pillar Ding-Mao, day pillar Geng-Shen, and hour pillar Ji-Mao. These pillars are not derived from a real birth date, time, or place.",
    },
    {
      id: "fp.fact.day-master",
      category: "day_master",
      statement: "The synthetic day master is Geng Metal (yang metal).",
    },
    {
      id: "fp.fact.ten-gods",
      category: "ten_gods",
      statement:
        "Relative to the synthetic Geng Metal day master, Wood is modeled as wealth, Fire as officer influence, Earth as resource, Metal as peer, and Water as output.",
    },
    {
      id: "fp.fact.element-balance",
      category: "five_elements_balance",
      statement:
        "The synthetic natal distribution emphasizes Wood, with moderate Metal and lighter Water, Fire, and Earth representation.",
    },
    {
      id: "fp.fact.luck-cycle",
      category: "luck_cycle_influence",
      statement:
        "The fixture assigns a synthetic Ren-Wu luck-cycle influence, combining Water output with Fire duty pressure.",
    },
    {
      id: "fp.fact.annual-monthly-daily",
      category: "annual_monthly_daily_influences",
      statement:
        "For research input only, the target period is modeled with Bing-Wu annual influence, Ding-You monthly influence, and a synthetic Gui-Hai daily influence; the daily label is not calendar-derived.",
    },
    {
      id: "fp.fact.clash",
      category: "clashes_combinations_harms_punishments",
      statement:
        "The modeled You monthly branch clashes with the two natal Mao branches, while Shen and Zi form only a partial Water affinity rather than a completed combination.",
    },
    {
      id: "fp.fact.useful-elements",
      category: "useful_unfavorable_elements",
      statement:
        "Within this synthetic interpretation, measured Earth and Metal support are treated as stabilizing; excess Wood and Fire pressure is treated as potentially demanding.",
    },
  ],
  interpretations: [
    "The modeled output and resource pattern supports structured learning, careful explanation, and turning observations into practical notes.",
    "The Mao-You clash is interpreted as a change or coordination signal, especially where plans depend on other people or fixed schedules.",
    "Wealth and officer pressure are both present in the synthetic model, favoring bounded commitments over expanding every obligation at once.",
    "Earth and Metal themes favor prioritization, clear criteria, and finishing concrete work before accepting additional scope.",
  ],
  timingSignals: [],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "The natal pillars and daily influence are synthetic research inputs, not the output of a calendrical calculation engine.",
    "No real birth date, birth time, birth place, sex, location, or identity is present.",
    "The supplied facts do not establish a defensible hour-by-hour timing signal, so timingSignals is intentionally empty.",
    "Interpretations are bounded research data, not deterministic predictions or advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.four-pillars.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.1",
    createdAt: "2026-09-21T00:00:00.000Z",
    notes: [
      "Hand-authored to test separation of BaZi-specific observations from common normalization axes.",
      "No real birth data, identity, private runtime data, or API credential is included.",
    ],
  },
};
