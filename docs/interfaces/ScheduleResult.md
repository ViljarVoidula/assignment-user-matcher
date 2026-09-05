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

[src/scheduling/types.ts:842](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L842)

___

### contractHours

• `Optional` **contractHours**: [`ContractHoursSummary`](ContractHoursSummary.md)[]

Planned against contracted hours, for every employee whose contracted week resolves.

#### Defined in

[src/scheduling/types.ts:858](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L858)

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

[src/scheduling/types.ts:856](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L856)

___

### ledger

• `Optional` **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Deferred obligations the roster created, such as compensatory rest owed.

#### Defined in

[src/scheduling/types.ts:854](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L854)

___

### provenance

• `Optional` **provenance**: [`ScheduleProvenance`](ScheduleProvenance.md)

What produced this roster. Reproducibility is an audit requirement:
"the roster was lawful under the rules as they stood" is the defence, and
it needs the rules and weights to be identifiable after the fact. In
Germany the objective weights are themselves co-determination subject
matter (BetrVG §87(1)), not internal tuning.

#### Defined in

[src/scheduling/types.ts:852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L852)

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

[src/scheduling/types.ts:844](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L844)

___

### status

• **status**: ``"optimal"`` \| ``"feasible"`` \| ``"partial"``

#### Defined in

[src/scheduling/types.ts:841](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L841)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L843)
