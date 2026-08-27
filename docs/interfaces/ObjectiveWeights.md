[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ObjectiveWeights

# Interface: ObjectiveWeights

Weights of optional soft-objective terms.

These are co-determination subject matter in some member states (BetrVG
§87(1)), so they live on the input — versioned and hashed with the rules —
rather than being internal tuning.

## Table of contents

### Properties

- [costWeightPerEuro](ObjectiveWeights.md#costweightpereuro)

## Properties

### costWeightPerEuro

• `Optional` **costWeightPerEuro**: `number`

Soft-score points per euro of projected labour cost. Any positive value
makes the solver prefer cheaper rosters *within* the soft level — it can
never buy a hard or coverage breach, because levels are lexicographic.
Unset or 0 leaves cost out of the solve; ranking and the result's cost
summary still use the cost model either way.

#### Defined in

[src/scheduling/types.ts:750](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L750)
