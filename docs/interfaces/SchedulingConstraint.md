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

[src/scheduling/types.ts:941](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L941)

___

### hardness

• **hardness**: [`Severity`](../modules.md#severity)

Lexicographic level. `'hard'` breaches are never accepted by construction;
`'medium'` and `'soft'` are traded off within their own level by `weight`.

#### Defined in

[src/scheduling/types.ts:937](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L937)

___

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:932](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L932)

___

### weight

• `Optional` **weight**: `number`

Drives soft/medium score contribution, violation severity and repair priority.

#### Defined in

[src/scheduling/types.ts:939](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L939)

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

[src/scheduling/types.ts:953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L953)

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

[src/scheduling/types.ts:959](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L959)

___

### evaluate

▸ **evaluate**(`state`): [`ConstraintViolation`](ConstraintViolation.md)[]

Breaches visible only across the whole roster — staffing shortfalls,
per-person window totals, team fairness spread. Pair-scoped `delta`
cannot see these.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SearchState`](SearchState.md) |

#### Returns

[`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:965](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L965)

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

[src/scheduling/types.ts:969](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L969)

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

[src/scheduling/types.ts:943](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L943)

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

[src/scheduling/types.ts:967](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L967)
