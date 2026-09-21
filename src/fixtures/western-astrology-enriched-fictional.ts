import type { MethodObservation } from "../contracts/daily-run.js";

export const WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE: MethodObservation = {
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
      id: "wae.fact.chart-config",
      category: "synthetic_calculation_configuration",
      statement:
        "The fictional chart uses the tropical zodiac, geocentric positions, Placidus houses, and a modern-rulership convention with traditional co-rulers noted where applicable. All values are hand-authored test data, not ephemeris output.",
    },
    {
      id: "wae.fact.angles",
      category: "synthetic_natal_angles",
      statement:
        "The fictional Ascendant is 12 degrees Gemini and the fictional Midheaven is 18 degrees Aquarius.",
    },
    {
      id: "wae.fact.house-cusps",
      category: "synthetic_natal_houses",
      statement:
        "The fictional house cusps are: 1st 12 Gemini, 2nd 4 Cancer, 3rd 26 Cancer, 4th 18 Leo, 5th 17 Virgo, 6th 2 Scorpio, 7th 12 Sagittarius, 8th 4 Capricorn, 9th 26 Capricorn, 10th 18 Aquarius, 11th 17 Pisces, and 12th 2 Taurus.",
    },
    {
      id: "wae.fact.house-rulers",
      category: "synthetic_house_rulers",
      statement:
        "Under the selected convention, Mercury rules the 1st and 5th houses; the Moon rules the 2nd and 3rd; the Sun rules the 4th; Mars with modern co-ruler Pluto rules the 6th; Jupiter rules the 7th and traditionally co-rules the 11th; Saturn rules the 8th and 9th and traditionally co-rules the 10th; Uranus is the modern 10th-house ruler; Neptune is the modern 11th-house ruler; and Venus rules the 12th.",
    },
    {
      id: "wae.fact.natal-luminaries",
      category: "synthetic_natal_planet_positions",
      statement:
        "The fictional natal Sun is 22 Virgo in the 5th house and the fictional natal Moon is 9 Taurus in the 12th house.",
    },
    {
      id: "wae.fact.natal-personal-planets",
      category: "synthetic_natal_planet_positions",
      statement:
        "The fictional natal Mercury is 3 Libra in the 5th house, Venus is 17 Libra in the 5th house, and Mars is 20 Scorpio in the 6th house.",
    },
    {
      id: "wae.fact.natal-outer-planets",
      category: "synthetic_natal_planet_positions",
      statement:
        "The fictional natal Jupiter is 18 Sagittarius in the 7th house, Saturn is 22 Aquarius in the 10th house, Uranus is 6 Capricorn in the 8th house, Neptune is 12 Capricorn in the 8th house, and Pluto is 16 Scorpio in the 6th house.",
    },
    {
      id: "wae.fact.transit-luminaries",
      category: "synthetic_target_day_transit_positions",
      statement:
        "At the fictional target-date reference time, the transiting Sun is 29 Virgo in the 5th house and the transiting Moon is 8 Taurus in the 12th house.",
    },
    {
      id: "wae.fact.transit-personal-planets",
      category: "synthetic_target_day_transit_positions",
      statement:
        "At the fictional target-date reference time, transiting Mercury is 2 Libra and Venus is 18 Libra in the 5th house, while transiting Mars is 18 Scorpio in the 6th house.",
    },
    {
      id: "wae.fact.transit-outer-planets",
      category: "synthetic_target_day_transit_positions",
      statement:
        "At the fictional target-date reference time, transiting Jupiter is 9 Cancer in the 2nd house, Saturn is 22 Pisces in the 11th house, Uranus is 26 Taurus in the 12th house, Neptune is 1 Aries in the 11th house, and Pluto is 2 Aquarius in the 9th house.",
    },
    {
      id: "wae.fact.relevant-house-transits",
      category: "synthetic_relevant_house_transits",
      statement:
        "The target-date placements put Jupiter in the 2nd house; the Sun, Mercury, and Venus in the 5th; Mars in the 6th; Pluto in the 9th; Saturn and Neptune in the 11th; and the Moon and Uranus in the 12th. No target-date planet is placed in the 7th or 8th house.",
    },
    {
      id: "wae.fact.moon-aspect",
      category: "synthetic_natal_transit_aspect",
      statement:
        "The transiting Moon at 8 Taurus applies to conjunction with the natal Moon at 9 Taurus with a 1-degree orb in the 12th house.",
    },
    {
      id: "wae.fact.mercury-aspects",
      category: "synthetic_natal_transit_aspect",
      statement:
        "Transiting Mercury at 2 Libra applies to conjunction with natal Mercury at 3 Libra with a 1-degree orb, while transiting Pluto at 2 Aquarius applies to a trine with natal Mercury with a 1-degree orb.",
    },
    {
      id: "wae.fact.venus-aspects",
      category: "synthetic_natal_transit_aspect",
      statement:
        "Transiting Venus at 18 Libra separates from conjunction with natal Venus at 17 Libra by 1 degree and forms an exact sextile to natal Jupiter at 18 Sagittarius.",
    },
    {
      id: "wae.fact.mars-aspects",
      category: "synthetic_natal_transit_aspect",
      statement:
        "Transiting Mars at 18 Scorpio applies to conjunction with natal Mars at 20 Scorpio by 2 degrees and separates from conjunction with natal Pluto at 16 Scorpio by 2 degrees in the 6th house.",
    },
    {
      id: "wae.fact.jupiter-money-aspects",
      category: "synthetic_natal_transit_aspect",
      statement:
        "Transiting Jupiter in the 2nd house forms an exact sextile to the natal Moon, ruler of the 2nd house, and applies to opposition with natal Neptune in the 8th house by 3 degrees.",
    },
    {
      id: "wae.fact.saturn-sun-aspect",
      category: "synthetic_natal_transit_aspect",
      statement:
        "Transiting Saturn at 22 Pisces forms an exact opposition to the natal Sun at 22 Virgo.",
    },
    {
      id: "wae.fact.change-aspects",
      category: "synthetic_natal_transit_aspect",
      statement:
        "Transiting Uranus at 26 Taurus separates from a trine to the natal Sun by 4 degrees, and transiting Neptune at 1 Aries applies to opposition with natal Mercury by 2 degrees.",
    },
    {
      id: "wae.fact.intraday-windows",
      category: "synthetic_intraday_aspect_windows",
      statement:
        "For fixture testing, the Moon-Moon contact is assigned to 07:00-11:00 UTC, the Venus-Jupiter contact to 13:00-17:30, the Mars contacts to 17:30-20:30, and the Saturn-Sun contact remains exact after 20:30. These windows are supplied synthetic calculations rather than ephemeris-derived times.",
    },
  ],
  interpretations: [
    "[basis: wae.fact.relevant-house-transits, wae.fact.saturn-sun-aspect] The day combines visible creative activity with a clear need to limit scope and preserve stamina.",
    "[basis: wae.fact.house-cusps, wae.fact.house-rulers, wae.fact.jupiter-money-aspects] Personal-resource conditions are constructive but mixed: expansion is available, while shared-resource assumptions require verification.",
    "[basis: wae.fact.relevant-house-transits, wae.fact.venus-aspects] Romance, affection, and creative exchange receive a constructive signal through the 5th-house Venus return and exact Venus-Jupiter contact.",
    "[basis: wae.fact.natal-outer-planets, wae.fact.venus-aspects] Partnership exchange can be generous and cooperative, but explicit expectations remain preferable to implied agreement.",
    "[basis: wae.fact.mercury-aspects, wae.fact.change-aspects] Communication and analysis can go deep, although unclear or idealized wording should be checked before commitment.",
    "[basis: wae.fact.natal-personal-planets, wae.fact.mars-aspects, wae.fact.saturn-sun-aspect] Energy is available for bounded work, but intensity and duty pressure make sustainable pacing more important than maximum output.",
    "[basis: wae.fact.natal-luminaries, wae.fact.moon-aspect, wae.fact.change-aspects] The inner-state signal favors reflection and emotional processing while allowing for restlessness beneath the surface.",
    "[basis: wae.fact.relevant-house-transits, wae.fact.mercury-aspects, wae.fact.venus-aspects] Creative work and learning are strongly activated when curiosity is paired with careful revision.",
    "[basis: wae.fact.mercury-aspects, wae.fact.jupiter-money-aspects, wae.fact.saturn-sun-aspect] Consequential decisions benefit from explicit criteria, resource checks, and reversible steps.",
    "[basis: wae.fact.mars-aspects, wae.fact.saturn-sun-aspect] Action is possible, but the strongest execution pattern is focused completion rather than adding unbounded commitments.",
    "[basis: wae.fact.house-cusps, wae.fact.relevant-house-transits, wae.fact.mercury-aspects, wae.fact.change-aspects] Learning, route changes, and changes of perspective are active; practical travel or relocation still requires concrete external information.",
  ],
  timingSignals: [
    {
      dayPart: "morning",
      startLocal: "07:00",
      endLocal: "11:00",
      direction: "supportive",
      summary: "Favors quiet review, emotional processing, and setting a sustainable pace.",
      basisFactIds: ["wae.fact.moon-aspect", "wae.fact.intraday-windows"],
    },
    {
      dayPart: "afternoon",
      startLocal: "13:00",
      endLocal: "17:30",
      direction: "supportive",
      summary: "Favors creative exchange, affection, and collaborative learning.",
      basisFactIds: ["wae.fact.venus-aspects", "wae.fact.intraday-windows"],
    },
    {
      dayPart: "evening",
      startLocal: "17:30",
      endLocal: "20:30",
      direction: "challenging",
      summary: "Use concentrated effort carefully and avoid escalating strain.",
      basisFactIds: ["wae.fact.mars-aspects", "wae.fact.intraday-windows"],
    },
    {
      dayPart: "late_night",
      startLocal: "20:30",
      endLocal: "23:59",
      direction: "challenging",
      summary: "Prefer closure and recovery over proving capacity through additional work.",
      basisFactIds: ["wae.fact.saturn-sun-aspect", "wae.fact.intraday-windows"],
    },
  ],
  limitations: [
    "This is a fictional fixture and does not describe a real person.",
    "All natal positions, house cusps, transit positions, aspects, motion states, and timing windows are synthetic test inputs rather than astronomical calculations.",
    "The fixture does not establish that Western astrology is predictively valid.",
    "The selected zodiac, house, and ruler conventions are fixture-scoped and must not be silently mixed with another convention.",
    "Travel, health, financial, and relationship interpretations are bounded research mappings, not practical, medical, financial, or relationship advice.",
  ],
  provenance: {
    sourceType: "fictional_fixture",
    sourceId: "fixture.western-astrology.enriched.001",
    producer: "Jev Divination Lab synthetic fixture",
    methodVersion: "daily-run-v0.1-western-enrichment",
    createdAt: "2026-09-21T00:00:00.000Z",
    notes: [
      "Fictional chart and fictional target date; no real birth date, time, place, identity, or ephemeris output is included.",
      "Calculation source/type: hand-authored synthetic tropical positions, Placidus houses, house rulerships, transits, aspects, and supplied motion states for a coverage experiment.",
      "Interpretation source/type: hand-authored Western-astrology research interpretations derived only from the listed calculation fact IDs.",
      "This fixture is experimental and does not replace the original Western baseline fixture.",
    ],
  },
};
