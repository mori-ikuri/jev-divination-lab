# Daily Run v0.1 contract

Project started: 2026-09-21
Contract version: `0.1`

## Purpose

Daily Run v0.1 contains fictional `western_astrology` and `four_pillars` observations. Each is normalized independently by Jev / TypeSafe AI onto the same method-independent axes, then passed to either a one-method baseline or an unweighted two-method comparison.

The contract separates three layers:

1. `MethodObservation` preserves method-specific facts, interpretations, timing, limitations, and provenance.
2. `JevNormalizedMethod` maps one observation onto shared domains while retaining typed answer evidence and the raw Jev response.
3. `ConsensusResult` exposes a stable downstream shape. One method remains a baseline; two methods expose exact agreement, disagreement, tie, and coverage evidence without claiming statistical validation.

## Public and private data boundary

Public repository content may contain only source code, documentation, and clearly fictional fixtures. It must not contain API keys, `.env` files, real names, real birth details, personally identifying information, or personal Daily Run output.

Runtime output must be written outside the repository. The local convention is:

```text
D:\AI-Work\JevLab-Data\runs\
```

The live runner requires `DAILY_RUN_OUTPUT_ROOT` and rejects a path inside the repository. `TYPESAFE_API_KEY` is read by the SDK from the process environment and is never persisted or printed.

## Core types

- `DailyRun`: one run containing explicit execution and target dates, its subject reference, independent observations, Jev-normalized methods, and consensus result.
- `SubjectRef`: a non-secret subject identifier and data classification. The public fixture uses `fictional_fixture`.
- `MethodObservation`: an independent method output before common-axis normalization.
- `TimingSignal`: a method-specific intraday interval, direction, summary, and supporting fact references.
- `Provenance`: source classification, source ID, producer, version, creation time, and notes.
- `JevNormalizedMethod`: typed common-axis answers plus exact raw Jev `model`, `answers`, per-answer `confidence` and `probabilities`, and `usage`.
- `ConsensusResult`: the downstream common shape. v0.1 accepts one or two unique methods and reports `single_method_baseline` or `two_method_comparison`.

## Shared domains

| Domain | Meaning |
| --- | --- |
| `overall` | Overall tone after considering all supplied evidence |
| `work` | Work, duties, professional activity, and practical contribution |
| `money` | Income, spending, assets, obligations, and material resources |
| `love` | Romance, affection, attraction, and intimate emotional connection |
| `relationships` | Interpersonal dynamics, cooperation, agreements, and boundaries |
| `communication` | Messages, conversation, coordination, and information exchange |
| `health_energy` | Physical energy, recovery needs, maintenance, and sustainable pacing |
| `inner_state` | Mood, reflection, emotional processing, and internal steadiness |
| `creativity_learning` | Creative work, study, curiosity, practice, and skill development |
| `decision_making` | Clarity and conditions for evaluating and committing to choices |
| `action` | Capacity for execution, initiation, follow-through, and completion |
| `change_movement` | Transitions, adjustments, travel, relocation, and changes of direction |

Each domain receives two independent Jev choice answers:

- `direction`: `very_negative | negative | neutral | positive | very_positive | insufficient_signal`
- `relevance`: `none | weak | moderate | strong | dominant`

`neutral` means sufficient evidence is present and balanced or mixed. It must not be used as a fallback for missing evidence. `insufficient_signal` means direction cannot be determined from the supplied evidence. Likewise, `none` means no supplied evidence meaningfully connects to the domain; `weak` still requires an actual signal.

## Global normalized axes

- `primary_signal`: `growth | connection | execution | reflection | transition | recovery | caution`
- `best_focus`: one of the 12 shared domains
- `caution_focus`: one of the 12 shared domains or `none`
- `decision_readiness`: `low | medium | high`
- `action_readiness`: `low | medium | high`
- `social_openness`: `low | medium | high`
- `change_readiness`: `low | medium | high`
- `risk_level`: `low | moderate | high`
- `has_intraday_timing_signal`: `yes | no`

When the source observation contains at least one `TimingSignal`, Jev also returns `direction` for `morning`, `afternoon`, `evening`, and `late_night`. These four questions are omitted when the observation has no intraday timing evidence.

Method-specific timing inputs may keep a method-native vocabulary such as `challenging | neutral | supportive`. That vocabulary belongs to `MethodObservation` only. Jev converts it, together with the other facts and interpretations, into the common `Direction` schema above.

## Date and timezone responsibilities

- `targetDate`: the date being evaluated by the divination method.
- `targetTimezone`: the timezone used by method-specific calculations and timing windows.
- `executionTimestamp`: the exact UTC instant when the run executes.
- `executionTimezone`: the explicit IANA timezone used to classify the execution into a calendar day.
- `executionDate`: the calendar date derived only from `executionTimestamp` and `executionTimezone`.

The runtime storage key is `executionDate`, not `targetDate`. The runner requires `DAILY_RUN_EXECUTION_TIMEZONE` so storage behavior cannot silently change with the host timezone.

Example:

```text
executionTimestamp = 2026-09-21T07:09:42Z
executionTimezone  = Asia/Tokyo
executionDate      = 2026-09-21
targetDate         = 2026-09-22
runtime directory  = runs/2026-09-21/
```

## Jev request and evidence preservation

- Requested model: `jev-latest`
- SDK: `@typesafe-ai/sdk@0.6.0`
- Execution: TypeScript -> `tsc` -> plain Node.js
- `tsx` is not used.

All questions use SDK `choice(...)` questions. The adapter validates every returned label against the contract vocabulary before producing `JevNormalizedMethod`.

The dependency direction is one-way:

```text
MethodObservation
  -> method-specific calculation facts, interpretations, timing, limitations
  -> Jev normalization
  -> method-neutral common domains
```

Common-domain output must not expose western-astrology-specific house categories or Four Pillars concepts such as pillars, ten gods, element balance, luck cycles, clashes, or useful elements as shared axes.

The unmodified response data is retained under `rawResponse`:

```text
model
answers.<question>.choice
answers.<question>.confidence
answers.<question>.probabilities
usage.input_tokens
usage.output_tokens
```

HTTP status and the optional request ID are stored separately as transport metadata. They are not part of the model response body.

## Method-specific fixture boundary

The public `four_pillars` fixture keeps synthetic natal pillars, day master, ten gods,
five-element balance, luck-cycle and period influences, interactions, and useful-element
observations inside `calculationFacts`. BaZi-system readings derived from those facts are
stored separately in `interpretations`.

The fixture contains no defensible intraday evidence, so `timingSignals` is empty. Jev
therefore receives the same 12 shared domain pairs and global axes but no morning,
afternoon, evening, or late-night direction questions.

## One-method consensus semantics

With one normalized method, v0.1 copies normalized values into the downstream consensus shape and sets:

- `status = single_method_baseline`
- `methodCount = 1`
- every domain `agreement = null`
- limitation: cross-method agreement is not measurable with one method

This avoids presenting a single method as corroborated consensus.

## Two-method comparison semantics

The two-method engine applies no method weighting and no historical-accuracy weighting.
For every shared domain it records:

- raw counts for every `Direction` value
- the number and IDs of methods with both non-`none` relevance and a non-`insufficient_signal` direction
- methods lacking sufficient coverage
- `agreementState`: `agreement`, `partial_disagreement`, `disagreement`, or `insufficient_coverage`
- `disagreementState`: `no_disagreement`, `direction_disagreement`, or `insufficient_information`
- a boolean `tie`
- symmetric `outlierCandidates`

Classification rules are deliberately small:

- two relevant methods with the same exact direction: `agreement`
- one relevant method and one missing/insufficient method: `insufficient_coverage`
- opposite polarities: `disagreement`
- different but non-opposite directions, including neutral versus positive: `partial_disagreement`
- any two different, equally weighted directions: `tie = true`

With only two methods there is no majority. Both differing methods are listed as outlier
candidates, but neither is identified as the actual outlier. The numeric `agreement`
field is `1` only for exact 2/2 agreement, `0` for two differing relevant directions,
and `null` when coverage is insufficient or only one method is present. It is not a
statistically meaningful agreement rate.

Global disagreement classifications are:

- `no_disagreement`
- `direction_disagreement`
- `focus_disagreement`
- `insufficient_information`

Shared scalar fields such as `bestFocus` remain populated only when the methods return
the same value; otherwise they are `null` and the raw per-method normalized results remain
the evidence source. Domain `relevance` is the strongest observed relevance category,
used only as a coverage summary rather than a weighted average.

## Known research question

Future work must distinguish whether `insufficient_signal` means the divination method
intrinsically provides no evidence for a domain, or the current `MethodObservation` lacks
sufficient calculated evidence for Jev to normalize that domain.

## Explicit non-goals

- real user data
- more than two methods
- multi-method weighting or tie resolution
- human-facing Daily report prose
- predictive certainty or removal of method limitations
