[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ScheduleResult

# Interface: ScheduleResult

The outcome of a solve. `'optimal'` means "no known improvement", never a proof.

## Table of contents

### Properties

- [assignments](ScheduleResult.md#assignments)
- [contractHours](ScheduleResult.md#contracthours)
- [cost](ScheduleResult.md#cost)
- [ledger](ScheduleResult.md#ledger)
- [provenance](ScheduleResult.md#provenance)
- [stats](ScheduleResult.md#stats)
- [status](ScheduleResult.md#status)
- [violations](ScheduleResult.md#violations)

## Properties

### assignments

• **assignments**: [`ScheduledAssignment`](ScheduledAssignment.md)[]

#### Defined in

[src/scheduling/types.ts:781](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L781)

___

### contractHours

• `Optional` **contractHours**: [`ContractHoursSummary`](ContractHoursSummary.md)[]

Planned against contracted hours, for every employee whose contracted week resolves.

#### Defined in

[src/scheduling/types.ts:797](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L797)

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

[src/scheduling/types.ts:795](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L795)

___

### ledger

• `Optional` **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Deferred obligations the roster created, such as compensatory rest owed.

#### Defined in

[src/scheduling/types.ts:793](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L793)

___

### provenance

• `Optional` **provenance**: [`ScheduleProvenance`](ScheduleProvenance.md)

What produced this roster. Reproducibility is an audit requirement:
"the roster was lawful under the rules as they stood" is the defence, and
it needs the rules and weights to be identifiable after the fact. In
Germany the objective weights are themselves co-determination subject
matter (BetrVG §87(1)), not internal tuning.

#### Defined in

[src/scheduling/types.ts:791](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L791)

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

[src/scheduling/types.ts:783](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L783)

___

### status

• **status**: ``"optimal"`` \| ``"feasible"`` \| ``"partial"``

#### Defined in

[src/scheduling/types.ts:780](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L780)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:782](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L782)
