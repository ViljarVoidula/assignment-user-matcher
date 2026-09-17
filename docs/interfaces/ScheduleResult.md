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

[src/scheduling/types.ts:954](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L954)

___

### contractHours

• `Optional` **contractHours**: [`ContractHoursSummary`](ContractHoursSummary.md)[]

Planned against contracted hours, for every employee whose contracted week resolves.

#### Defined in

[src/scheduling/types.ts:970](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L970)

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

[src/scheduling/types.ts:968](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L968)

___

### ledger

• `Optional` **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Deferred obligations the roster created, such as compensatory rest owed.

#### Defined in

[src/scheduling/types.ts:966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L966)

___

### provenance

• `Optional` **provenance**: [`ScheduleProvenance`](ScheduleProvenance.md)

What produced this roster. Reproducibility is an audit requirement:
"the roster was lawful under the rules as they stood" is the defence, and
it needs the rules and weights to be identifiable after the fact. In
Germany the objective weights are themselves co-determination subject
matter (BetrVG §87(1)), not internal tuning.

#### Defined in

[src/scheduling/types.ts:964](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L964)

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

[src/scheduling/types.ts:956](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L956)

___

### status

• **status**: ``"optimal"`` \| ``"feasible"`` \| ``"partial"``

#### Defined in

[src/scheduling/types.ts:953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L953)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:955](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L955)
