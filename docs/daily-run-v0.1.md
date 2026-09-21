# Daily Run v0.1 contract

Project started: 2026-09-21
Contract version: `0.1`

## Purpose

Daily Run v0.1 proves one complete vertical slice before adding more divination methods. A fictional `western_astrology` observation is normalized by Jev / TypeSafe AI onto method-independent axes, then passed to a minimal one-method consensus baseline.

The contract separates three layers:

1. `MethodObservation` preserves method-specific facts, interpretations, timing, limitations, and provenance.
2. `JevNormalizedMethod` maps one observation onto shared domains while retaining typed answer evidence and the raw Jev response.
3. `ConsensusResult` exposes a stable downstream shape. With one method it is explicitly a baseline, not evidence of cross-method agreement.

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
- `ConsensusResult`: the downstream common shape. v0.1 accepts exactly one method and reports `single_method_baseline`.

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

Common-domain output must not expose western-astrology-specific house categories or use them as shared axes.

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

## One-method consensus semantics

v0.1 accepts exactly one normalized method. It copies normalized values into the downstream consensus shape and sets:

- `status = single_method_baseline`
- `methodCount = 1`
- every domain `agreement = null`
- limitation: cross-method agreement is not measurable with one method

This avoids presenting a single method as corroborated consensus. Adding a second method requires a separately specified aggregation and tie policy.

## Explicit non-goals

- real user data
- `four_pillars` or any method other than `western_astrology`
- multi-method weighting or tie resolution
- human-facing Daily report prose
- predictive certainty or removal of method limitations
