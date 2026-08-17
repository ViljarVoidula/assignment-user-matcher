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

[src/scheduling/types.ts:898](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L898)

---

### hardness

• **hardness**: [`Severity`](../modules.md#severity)

Lexicographic level. `'hard'` breaches are never accepted by construction;
`'medium'` and `'soft'` are traded off within their own level by `weight`.

#### Defined in

[src/scheduling/types.ts:894](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L894)

---

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:889](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L889)

---

### weight

• `Optional` **weight**: `number`

Drives soft/medium score contribution, violation severity and repair priority.

#### Defined in

[src/scheduling/types.ts:896](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L896)

## Methods

### delta

▸ **delta**(`state`, `pair`): `number`

Breach magnitude of assigning `pair` in `state`: 0 when compliant,
positive otherwise.

Return _how far_ over the line the assignment is, not a 0/1 flag, where
that is meaningful — a rest gap 10 minutes short and one 6 hours short are
both breaches, but only a graded signal lets local search climb out of an
infeasible region instead of sitting on a plateau.

#### Parameters

| Name    | Type                                  |
| :------ | :------------------------------------ |
| `state` | [`SearchState`](SearchState.md)       |
| `pair`  | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/types.ts:910](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L910)

---

### deltaRemove

▸ **deltaRemove**(`state`, `pair`): `number`

Breach magnitude _removed_ by unassigning `pair`. Defaults to `delta` when
absent, which is right for symmetric rules; rules whose breach depends on
the surrounding sequence should implement it.

#### Parameters

| Name    | Type                                  |
| :------ | :------------------------------------ |
| `state` | [`SearchState`](SearchState.md)       |
| `pair`  | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/types.ts:916](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L916)

---

### evaluate

▸ **evaluate**(`state`): [`ConstraintViolation`](ConstraintViolation.md)[]

Breaches visible only across the whole roster — staffing shortfalls,
per-person window totals, team fairness spread. Pair-scoped `delta`
cannot see these.

#### Parameters

| Name    | Type                            |
| :------ | :------------------------------ |
| `state` | [`SearchState`](SearchState.md) |

#### Returns

[`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:922](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L922)

---

### explain

▸ **explain**(`state`, `pair`): `null` \| `string`

Human-readable breach description for the violation report, or null when compliant.

#### Parameters

| Name    | Type                                  |
| :------ | :------------------------------------ |
| `state` | [`SearchState`](SearchState.md)       |
| `pair`  | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

`null` \| `string`

#### Defined in

[src/scheduling/types.ts:926](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L926)

---

### prune

▸ **prune**(`ctx`, `eligibility`): `void`

Prune ineligible (employee, shiftInstance) pairs before search, in place on `eligibility`.

#### Parameters

| Name          | Type                                 |
| :------------ | :----------------------------------- |
| `ctx`         | [`ModelContext`](ModelContext.md)    |
| `eligibility` | `Map`\<`string`, `Set`\<`string`\>\> |

#### Returns

`void`

#### Defined in

[src/scheduling/types.ts:900](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L900)

---

### verdict

▸ **verdict**(`state`, `pair`): [`RuleVerdict`](RuleVerdict.md)

Structured judgement for explanations and swap validation.

#### Parameters

| Name    | Type                                  |
| :------ | :------------------------------------ |
| `state` | [`SearchState`](SearchState.md)       |
| `pair`  | [`AssignmentPair`](AssignmentPair.md) |

#### Returns

[`RuleVerdict`](RuleVerdict.md)

#### Defined in

[src/scheduling/types.ts:924](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L924)
