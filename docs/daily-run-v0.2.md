# Daily Run v0.2 contract

Contract version: `0.2`

## Purpose

Daily Run v0.2 preserves the method-independent observation and Jev normalization
model from v0.1 while removing the four-method consensus ceiling. It also makes
method selection registry-driven. The registry currently contains seven fictional
methods through `zi_wei_dou_shu`.

The implementation sequence remains:

1. establish all eight methods as fictional `MethodObservation` fixtures;
2. validate common Jev normalization and unweighted consensus;
3. add deterministic generators method by method without replacing the public
   baseline fixtures.

## Registered methods

The canonical v0.2 registry order is:

1. `western_astrology`
2. `four_pillars`
3. `nine_star_ki`
4. `sukuyo`
5. `numerology`
6. `jyotish`
7. `zi_wei_dou_shu`

The remaining planned method is `sanmeigaku`. Draw- or selection-based methods such as Tarot, I Ching, and Rune
are outside this Daily Run target because the current research phase requires
reproducible fixed inputs.

## Contract layers

The three v0.1 layers remain unchanged in purpose:

1. `MethodObservation` preserves method-native calculation facts,
   interpretations, optional timing signals, limitations, and provenance.
2. `JevNormalizedMethod` maps exactly one observation onto the 12 common
   domains and global readiness/risk axes while retaining the raw Jev response.
3. `ConsensusResult` compares one or more normalized methods without method,
   historical-accuracy, or correlation weighting.

The normalization request remains 33 answers for observations without intraday
signals and 37 answers when the four day-part questions are present.

## Arbitrary-count consensus

`computeConsensus` requires at least one unique method and no longer has an
upper count limit.

- one method: `single_method_baseline`
- two methods: `two_method_comparison`
- three methods: `three_method_comparison`
- four methods: `four_method_comparison`
- five or more methods: `multi_method_comparison`

The named one-to-four statuses are retained for downstream compatibility.
For three or more methods, a representative value requires a strict majority of
the full method count. Methods with `relevance=none` or
`direction=insufficient_signal` do not vote for a direction, but they remain
part of the electorate. This prevents sparse coverage from being presented as a
majority.

Agreement, minority, tie, insufficient-coverage, and outlier-candidate fields
remain descriptive comparison evidence. They do not establish truth, predictive
validity, or method accuracy.

## Registry-driven runner

`src/methods/registry.ts` is the canonical list of implemented public fixtures.
`src/run-daily.ts` accepts zero or more method IDs:

- no IDs: run every registered method in registry order;
- one or more IDs: run exactly those registered methods in the supplied order;
- the registry API rejects an explicit empty list;
- unknown or duplicate method IDs are rejected.

Each method is normalized in a separate Jev request so its raw answer,
probabilities, confidence, model, request metadata, and usage remain distinct.

Example:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:seven
```

## Numerology profile

The v0.2 Numerology fixture uses one explicit Pythagorean profile:

- Pythagorean letter values;
- decimal digit summing;
- reduction to 1-9, with 11, 22, and 33 preserved only when they occur as an
  unreduced total;
- an explicitly fictional name and birth date;
- reproducible core, universal-cycle, and personal-cycle arithmetic;
- no hour-level signal.

The fixture is hand-authored test data, not output from a deterministic
generator. Other numerology schools and reduction conventions are not silently
treated as equivalent.

## Jyotish profile

The v0.2 Jyotish fixture uses one explicit, limited research profile:

- sidereal zodiac with Lahiri ayanamsha;
- whole-sign houses;
- the seven classical grahas plus mean Rahu/Ketu;
- limited Parashari-style sign, house, dignity, and special-aspect interpretation;
- a supplied synthetic Vimshottari mahadasha/antardasha state;
- synthetic natal and target-day placements, not ephemeris output;
- no divisional-chart, yoga, shadbala, panchanga, muhurta, rectification, or
  remedial analysis;
- no hour-level signal.

The fixture is hand-authored test data, not output from a deterministic Jyotish
calculation engine. Alternative ayanamshas, house conventions, node models, and
school-specific synthesis rules are not silently treated as equivalent.

## Zi Wei Dou Shu profile

The v0.2 Zi Wei Dou Shu fixture uses an explicit direct-state research profile:

- a supplied twelve-palace state rather than calendar-derived palace placement;
- all twelve palace roles retained, with detailed interpretation limited to Life,
  Career, Wealth, Travel, Spouse, and Fortune;
- selected placements for Zi Wei, Tian Fu, Tian Ji, Wu Qu, Tai Yang, Tai Yin,
  and Tian Liang rather than a complete fourteen-principal-star chart;
- only Wen Chang and Wen Qu from the auxiliary-star systems;
- no Four Transformations, so no Heavenly Stem transformation table is chosen;
- a supplied flowing-day overlay highlighting Career, Travel, Fortune, and Life;
- no flowing-hour or other intraday signal.

The fixture does not perform lunar-calendar conversion, leap-month handling,
birth-hour boundary selection, true-solar-time correction, or a school-specific
star-placement calculation. Alternative palace, star, Four Transformation, and
flowing-period conventions are not silently treated as equivalent.

## Public and private boundary

The repository may contain source, documentation, and explicitly fictional test
vectors only. API credentials, environment files, real identity or birth data,
personal runs, and private runtime output must remain outside the repository.

The runner requires `DAILY_RUN_OUTPUT_ROOT` outside the repository and writes
with exclusive-create semantics. It also requires an explicit IANA execution
timezone. `executionDate` is derived from execution time in that timezone;
`targetDate` remains the date evaluated by the fixtures.
