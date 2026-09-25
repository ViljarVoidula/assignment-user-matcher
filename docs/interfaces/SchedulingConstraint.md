[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SchedulingConstraint

# Interface: SchedulingConstraint

A self-contained scheduling rule. Built-ins ship in `constraints/`; callers
may register customs via `ConstraintOptions.custom`. A constraint must be
pure with respect to the passed-in state — the engine owns all mutation.

## Table of contents

### Properties

- [citation](SchedulingConstraint.md#citation)
- [hardness](SchedulingConstraint.md#hardness)
- [id](SchedulingConstraint.md#id)
- [version](SchedulingConstraint.md#version)
- [weight](SchedulingConstraint.md#weight)

### Methods

- [delta](SchedulingConstraint.md#delta)
- [deltaRemove](SchedulingConstraint.md#deltaremove)
- [evaluate](SchedulingConstraint.md#evaluate)
- [explain](SchedulingConstraint.md#explain)
- [prune](SchedulingConstraint.md#prune)
- [verdict](SchedulingConstraint.md#verdict)

## Properties

### citation

• `Optional` **citation**: `string`

Legal source, echoed into every violation and verdict this rule produces.

#### Defined in

[src/scheduling/types.ts:1327](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1327)

___

### hardness

• **hardness**: [`Severity`](../modules.md#severity)

Lexicographic level. `'hard'` breaches are never accepted by construction;
`'medium'` and `'soft'` are traded off within their own level by `weight`.

#### Defined in

[src/scheduling/types.ts:1323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1323)

___

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:1316](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1316)

___

### version

• `Optional` **version**: `string`

Caller-maintained implementation/configuration version, included in the rule hash.

#### Defined in

[src/scheduling/types.ts:1318](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1318)

___

### weight

• `Optional` **weight**: `number`

Drives soft/medium score contribution, violation severity and repair priority.

#### Defined in

[src/scheduling/types.ts:1325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1325)

## Methods

### delta

▸ **delta**(`state`, `pair`): `number`

Breach magnitude of assigning `pair` in `state`: 0 when compliant,
positive otherwise.

Return *how far* over the line the assignment is, not a 0/1 flag, where
that is meaningful — a rest gap 10 minutes short and one 6 hours short are
both breaches, but only a graded signal lets local search climb out of an
infeasible region instead of sitting on a plateau.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SearchState`](SearchState.md) |
| `pair` | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/types.ts:1339](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1339)

___

### deltaRemove

▸ **deltaRemove**(`state`, `pair`): `number`

Breach magnitude *removed* by unassigning `pair`. Defaults to `delta` when
absent, which is right for symmetric rules; rules whose breach depends on
the surrounding sequence should implement it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SearchState`](SearchState.md) |
| `pair` | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/types.ts:1345](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1345)

___

### evaluate

▸ **evaluate**(`state`): [`ConstraintViolation`](ConstraintViolation.md)[]

Breaches visible only across the whole roster — staffing shortfalls,
per-person window totals, team fairness spread. Custom aggregate violations
contribute to search scoring as well as final validation. Keep this hook
pure and inexpensive, and avoid repeating breaches already scored by delta.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SearchState`](SearchState.md) |

#### Returns

[`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:1352](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1352)

___

### explain

▸ **explain**(`state`, `pair`): ``null`` \| `string`

Human-readable breach description for the violation report, or null when compliant.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SearchState`](SearchState.md) |
| `pair` | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

``null`` \| `string`

#### Defined in

[src/scheduling/types.ts:1356](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1356)

___

### prune

▸ **prune**(`ctx`, `eligibility`): `void`

Prune ineligible (employee, shiftInstance) pairs before search, in place on `eligibility`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`ModelContext`](ModelContext.md) |
| `eligibility` | `Map`\<`string`, `Set`\<`string`\>\> |

#### Returns

`void`

#### Defined in

[src/scheduling/types.ts:1329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1329)

___

### verdict

▸ **verdict**(`state`, `pair`): [`RuleVerdict`](RuleVerdict.md)

Structured judgement for explanations and swap validation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SearchState`](SearchState.md) |
| `pair` | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

[`RuleVerdict`](RuleVerdict.md)

#### Defined in

[src/scheduling/types.ts:1354](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1354)
