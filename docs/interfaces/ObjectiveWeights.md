[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ObjectiveWeights

# Interface: ObjectiveWeights

Weights of optional soft-objective terms.

These are co-determination subject matter in some member states (BetrVG
§87(1)), so they live on the input — versioned and hashed with the rules —
rather than being internal tuning.

## Table of contents

### Properties

- [costWeightPerEuro](ObjectiveWeights.md#costweightpereuro)
- [homeSiteWeight](ObjectiveWeights.md#homesiteweight)

## Properties

### costWeightPerEuro

• `Optional` **costWeightPerEuro**: `number`

Soft-score points per euro of projected labour cost. Any positive value
makes the solver prefer cheaper rosters *within* the soft level — it can
never buy a hard or coverage breach, because levels are lexicographic.
Unset or 0 leaves cost out of the solve; ranking and the result's cost
summary still use the cost model either way.

#### Defined in

[src/scheduling/types.ts:778](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L778)

___

### homeSiteWeight

• `Optional` **homeSiteWeight**: `number`

Soft-score points per assignment away from an employee's `homeSiteId`.
When set positive, the solver prefers assigning people to their home site.
The ranking function does **not** consume behavioural or predictive signals;
this is declared data, kept outside AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:785](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L785)
