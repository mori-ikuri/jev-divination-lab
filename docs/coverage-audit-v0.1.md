# Daily Run v0.1 coverage audit

Audit date: 2026-09-21
Audited milestone: `efa82f09b28bd4dc80195185faab429c1d814020`

## Scope

This audit separates limits of the four divination methods from limits of the current fictional `MethodObservation` fixtures. It does not change the Daily Run v0.1 contract, add weights, score methods, claim predictive validity, or use personal data.

The labels mean:

- `supported_in_principle`: the method has a traceable method-native route to the domain, and the current fixture contains at least minimally relevant evidence.
- `fixture_sparse`: the method can reasonably address the domain, but the current fixture lacks the calculated facts or explicit method-native synthesis needed for a direction.
- `unsupported_by_design`: the selected method configuration does not provide a defensible route to the domain. The normalizer should return `insufficient_signal` / `none` rather than infer one.
- `uncertain`: support depends on school, calculation convention, time scale, or an interpretive mapping that is not yet specified well enough to classify.

These are coverage labels, not accuracy judgments. `supported_in_principle` does not mean that the method is empirically validated or that a prediction is correct.

## Coverage matrix

| Common domain | `western_astrology` | `four_pillars` | `nine_star_ki` | `sukuyo` |
| --- | --- | --- | --- | --- |
| `overall` | supported_in_principle | fixture_sparse | fixture_sparse | fixture_sparse |
| `work` | supported_in_principle | supported_in_principle | uncertain | uncertain |
| `money` | fixture_sparse | supported_in_principle | uncertain | unsupported_by_design |
| `love` | fixture_sparse | fixture_sparse | uncertain | uncertain |
| `relationships` | supported_in_principle | supported_in_principle | fixture_sparse | supported_in_principle |
| `communication` | supported_in_principle | supported_in_principle | supported_in_principle | supported_in_principle |
| `health_energy` | supported_in_principle | fixture_sparse | fixture_sparse | unsupported_by_design |
| `inner_state` | supported_in_principle | uncertain | uncertain | uncertain |
| `creativity_learning` | supported_in_principle | supported_in_principle | supported_in_principle | supported_in_principle |
| `decision_making` | supported_in_principle | supported_in_principle | supported_in_principle | supported_in_principle |
| `action` | supported_in_principle | supported_in_principle | fixture_sparse | supported_in_principle |
| `change_movement` | fixture_sparse | supported_in_principle | fixture_sparse | fixture_sparse |

The last four-method live artifact is consistent with a sparse-input diagnosis: `money` had zero relevant contributors; `creativity_learning` and `decision_making` had two; every other domain had one. That observation is not itself proof of method capability because Jev can only normalize supplied evidence.

## Method findings

### Western astrology

A natal chart plus houses, rulers, and dated transits offers conventional routes to material resources, work, relationships, health/routine, learning, and movement. The current fixture already supplies explicit communication, cooperation, pacing, creative, decision, and action observations. It does not supply houses, house rulers, complete natal placements, transit orbs, or money-, romance-, and movement-specific facts. Therefore `money`, `love`, and `change_movement` are fixture gaps rather than design exclusions.

### Four Pillars / BaZi

The fixture includes the Day Master, Ten Gods, five-element balance, period influences, interactions, and useful-element observations. These provide traceable routes to work/duty, wealth, interpersonal coordination, output/communication, resource/learning, practical decisions, action, and change. The current fixture does not supply a clear net favorable/adverse synthesis, spouse-palace or relationship-role analysis, or a bounded health/energy interpretation. Daily `inner_state` remains uncertain because the repository has not specified whether a natal/period tendency may be converted into a same-day mood signal.

### Nine Star Ki

The method has documented annual, monthly, and daily cycles, personal birth stars, compatibility relations, and directionology. The current fixture supplies natal and period stars and general element relations, but it does not calculate the fictional subject's position in each active plate, identify a versioned palace interpretation, or evaluate an actual origin/destination or hour plate. Communication, learning, and discernment are explicit in the current interpretation; most other domains remain sparse or uncertain. Work, money, love, and inner state should stay `uncertain` until the project adopts a documented mapping rather than importing generic fortune-language.

### Sukuyo

The selected 27-mansion fixture has a synthetic natal mansion, target-day mansion, distance relation, daily relation, and activity cautions. This gives a bounded route to interpersonal dynamics, clarification, study/review, commitment decisions, and action. The fixture does not calculate its mansions from a calendar, include a partner mansion, or provide a versioned day-activity table. Under the current daily mansion-relationship design, no method-native money or health/energy evidence is present, so those domains are `unsupported_by_design`. Love and inner state remain uncertain rather than being inferred from general compatibility or personality language.

## Missing information in the current fixtures

### Western astrology

- a complete synthetic natal chart with house cusps and house rulers
- calculated target-date transits with exact orb and applying/separating state
- explicit second/eighth/eleventh-house or equivalent money evidence
- explicit fifth/seventh/eighth-house or equivalent romance evidence
- explicit third/ninth-house, angle, or other method-native movement evidence
- provenance for the ephemeris and house system

### Four Pillars / BaZi

- calendrically derived synthetic pillars with timezone and solar-term boundary rules
- strength, season, roots, combinations, and useful/unfavorable-element synthesis
- a method-native net assessment for each target-period interaction
- spouse-palace and relationship-role evidence where the selected tradition requires it
- a cautious, versioned health/energy mapping rather than free association from elements
- an explicit rule on whether same-day inner state is in scope

### Nine Star Ki

- calculated Honmei and Getsumei stars and the convention used at boundary dates
- the subject's actual palace position in annual, monthly, and daily plates
- versioned palace/star meanings and the interaction with the subject's natal stars
- an hour plate if intraday timing is intended
- origin, destination, distance, and date when real movement direction is evaluated
- explicit rules, if any, for work, money, love, health/energy, and inner-state mappings

### Sukuyo

- a reproducible 27-mansion calendar calculation and its boundary convention
- a computed natal-to-target-day relationship rather than a supplied label
- versioned auspicious/caution activity categories for the target day
- a second fictional person's mansion when interpersonal compatibility is actually evaluated
- explicit method-native facts for work, love, movement, or other requested domains
- a documented reason before any hour-level `timingSignals` are added

## Domains most likely to improve by thickening fixtures

| Domain | First fixture improvements to try |
| --- | --- |
| `overall` | Add explicit, method-native net synthesis to Four Pillars, Nine Star Ki, and Sukuyo without pre-writing a common-domain answer. |
| `work` | Add Four Pillars duty/career synthesis; research a versioned Nine Star Ki work mapping before adding facts. |
| `money` | Add Western house/ruler evidence and Four Pillars wealth-star/period interaction evidence. |
| `love` | Add Western romance/partnership evidence and Four Pillars spouse/relationship evidence; keep Sukuyo daily-love mapping uncertain unless partner or activity rules support it. |
| `relationships` | Add Nine Star Ki compatibility evidence and computed Sukuyo relationship evidence. |
| `communication` | Strengthen fact IDs behind existing interpretations in all four fixtures. |
| `health_energy` | Add Western pacing/health-house evidence and a cautious Four Pillars health/energy profile; do not manufacture Sukuyo coverage. |
| `inner_state` | Strengthen Western Moon/inner-state evidence; research time-scale rules before expanding the other three methods. |
| `creativity_learning` | Add explicit Four Pillars resource/output, Nine Star Ki development, and Sukuyo study/activity facts. |
| `decision_making` | Preserve the existing evidence but link each interpretation to method-native facts more explicitly. |
| `action` | Add personal-plate evidence to Nine Star Ki and activity classifications to Sukuyo. |
| `change_movement` | Add Western movement/transition evidence, personal direction calculations to Nine Star Ki, and relevant Sukuyo activity classifications. |

## Domains that require another method

None of the 12 domains is currently demonstrated to require a fifth method. Existing methods have a plausible route to every common domain, even though individual method/domain pairs are unsupported or uncertain. Fixture thickening and explicit calculation rules should be tested before adding another method solely to increase counts.

A future method addition may be justified if the research goal changes from "at least one defensible source" to "at least two sufficiently independent, method-native sources" for every domain. On the current evidence, `money`, `love`, `health_energy`, and `inner_state` are the first domains to reassess under that stricter requirement, but this is not yet a finding that a new method is necessary.

## Known research questions

1. What minimum calculated facts are required before each method/domain pair may be normalized as relevant?
2. Should coverage provenance distinguish `method_not_applicable`, `calculation_missing`, `interpretation_missing`, and `school_unspecified` instead of relying only on the normalized result?
3. How should daily signals be separated from natal traits and long-cycle tendencies, especially for Four Pillars and Nine Star Ki?
4. Which versioned calculation and interpretation profile governs Nine Star Ki and Sukuyo when schools differ?
5. Can every normalized domain answer be traced to calculation fact IDs instead of relying on unlinked prose interpretations?
6. How should a human domain expert review fixture-to-domain mappings without turning their judgment into an implicit weight?
7. Which methods are sufficiently correlated that a numerical majority would overstate independent evidence?
8. How should method capability be kept separate from empirical predictive accuracy, which is not tested by this audit?
9. When a method gives a general favorable/caution signal, what evidence permits allocating it to one common domain rather than `overall` only?
10. Should intraday timing be audited separately from the 12 domains because three current fixtures intentionally contain no hour-level evidence?

## Reference boundary

External descriptions were used only to check claimed method scope, not to validate divination as predictive science:

- [Astrodienst: The Houses](https://www.astro.com/astrology/in_house2_e.htm?nhor=1&pa=mobile) describes conventional house associations such as material circumstances, work/routine, partnership, worldview, and groups.
- [BaZi introduction](https://www.bazichic.com/uploads/documents/bazichic20200323000001.pdf) describes the Four Pillars and Luck Pillars and associates pillars with relationship, career/business, social circle, and health topics.
- [Nine Star Ki FAQ](https://www.9starki.com/faq.htm) describes personal birth numbers and comparison with annual and monthly cycles; [Takashima Almanac](https://www.takashimakoyomi.co.jp/en/) describes compatibility and time-dependent direction use.
- [Sukuyo calculator notes](https://www.senjutsu.jp/labo/shukuyo-calc/updates) describe natal mansion calculation, daily fortune, and compatibility as core use cases; calculation conventions can differ between 27-mansion implementations.

The repository's own fixture contents remain the controlling evidence for whether the current `MethodObservation` is sufficient.
