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

[src/scheduling/types.ts:1250](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1250)

___

### hardness

• **hardness**: [`Severity`](../modules.md#severity)

Lexicographic level. `'hard'` breaches are never accepted by construction;
`'medium'` and `'soft'` are traded off within their own level by `weight`.

#### Defined in

[src/scheduling/types.ts:1246](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1246)

___

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:1239](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1239)

___

### version

• `Optional` **version**: `string`

Caller-maintained implementation/configuration version, included in the rule hash.

#### Defined in

[src/scheduling/types.ts:1241](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1241)

___

### weight

• `Optional` **weight**: `number`

Drives soft/medium score contribution, violation severity and repair priority.

#### Defined in

[src/scheduling/types.ts:1248](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1248)

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

[src/scheduling/types.ts:1262](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1262)

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

[src/scheduling/types.ts:1268](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1268)

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

[src/scheduling/types.ts:1275](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1275)

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

[src/scheduling/types.ts:1279](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1279)

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

[src/scheduling/types.ts:1252](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1252)

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

[src/scheduling/types.ts:1277](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1277)
