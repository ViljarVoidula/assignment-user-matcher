[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ScheduleResult

# Interface: ScheduleResult

The outcome of a solve. `'optimal'` means "no known improvement", never a proof.

## Table of contents

### Properties

- [assignments](ScheduleResult.md#assignments)
- [contractHours](ScheduleResult.md#contracthours)
- [cost](ScheduleResult.md#cost)
- [ledger](ScheduleResult.md#ledger)
- [preferences](ScheduleResult.md#preferences)
- [provenance](ScheduleResult.md#provenance)
- [stats](ScheduleResult.md#stats)
- [status](ScheduleResult.md#status)
- [violations](ScheduleResult.md#violations)

## Properties

### assignments

• **assignments**: [`ScheduledAssignment`](ScheduledAssignment.md)[]

#### Defined in

[src/scheduling/types.ts:974](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L974)

___

### contractHours

• `Optional` **contractHours**: [`ContractHoursSummary`](ContractHoursSummary.md)[]

Planned against contracted hours, for every employee whose contracted week resolves.

#### Defined in

[src/scheduling/types.ts:990](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L990)

___

### cost

• `Optional` **cost**: `Object`

Per-person cost breakdown when a cost model was supplied.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `byEmployee` | `Record`\<`string`, `number`\> |
| `totalCents` | `number` |

#### Defined in

[src/scheduling/types.ts:988](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L988)

___

### ledger

• `Optional` **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Deferred obligations the roster created, such as compensatory rest owed.

#### Defined in

[src/scheduling/types.ts:986](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L986)

___

### preferences

• `Optional` **preferences**: `EmployeePreferenceReport`[]

Per person, how each stated preference fared. Present when anyone stated one.

#### Defined in

[src/scheduling/types.ts:992](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L992)

___

### provenance

• `Optional` **provenance**: [`ScheduleProvenance`](ScheduleProvenance.md)

What produced this roster. Reproducibility is an audit requirement:
"the roster was lawful under the rules as they stood" is the defence, and
it needs the rules and weights to be identifiable after the fact. In
Germany the objective weights are themselves co-determination subject
matter (BetrVG §87(1)), not internal tuning.

#### Defined in

[src/scheduling/types.ts:984](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L984)

___

### stats

• **stats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `durationMs` | `number` |
| `evaluatedVariants` | `number` |
| `unfilledSlots` | `number` |

#### Defined in

[src/scheduling/types.ts:976](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L976)

___

### status

• **status**: ``"optimal"`` \| ``"feasible"`` \| ``"partial"``

#### Defined in

[src/scheduling/types.ts:973](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L973)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:975](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L975)
