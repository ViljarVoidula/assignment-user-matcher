[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ObjectiveWeights

# Interface: ObjectiveWeights

Weights of optional soft-objective terms.

These are co-determination subject matter in some member states (BetrVG
§87(1)), so they live on the input — versioned and hashed with the rules —
rather than being internal tuning.

## Table of contents

### Properties

- [contractHoursWeight](ObjectiveWeights.md#contracthoursweight)
- [costWeightPerEuro](ObjectiveWeights.md#costweightpereuro)
- [fillToContract](ObjectiveWeights.md#filltocontract)
- [homeSiteWeight](ObjectiveWeights.md#homesiteweight)

## Properties

### contractHoursWeight

• `Optional` **contractHoursWeight**: `number`

Soft-score points per *hour* a person is planned away from their
contracted period total (see `ContractHoursRule`). Applies only to
employees whose contracted week resolves. Defaults to 1; `0` switches the
term off.

#### Defined in

[src/scheduling/types.ts:1021](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1021)

___

### costWeightPerEuro

• `Optional` **costWeightPerEuro**: `number`

Soft-score points per euro of projected labour cost. Any positive value
makes the solver prefer cheaper rosters *within* the soft level — it can
never buy a hard or coverage breach, because levels are lexicographic.
Unset or 0 leaves cost out of the solve; ranking and the result's cost
summary still use the cost model either way.

#### Defined in

[src/scheduling/types.ts:1007](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1007)

___

### fillToContract

• `Optional` **fillToContract**: `boolean`

Whether the solver plans people *up to* their contracted period total
(or their `minHoursForPeriod` floor) by staffing shifts beyond
`minEmployees`. Defaults to `true`: a full-timer is owed their week
whether or not minimum cover needs them, so once every slot is covered
the solver keeps adding assignments while they close a contract
shortfall, every hard rule still holds, and the shift is under its
`maxEmployees`. `false` staffs minimum cover only, so contracted hours
only *distribute* the demand and never grow it.

#### Defined in

[src/scheduling/types.ts:1032](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1032)

___

### homeSiteWeight

• `Optional` **homeSiteWeight**: `number`

Soft-score points per assignment away from an employee's `homeSiteId`.
When set positive, the solver prefers assigning people to their home site.
The ranking function does **not** consume behavioural or predictive signals;
this is declared data, kept outside AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:1014](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1014)
