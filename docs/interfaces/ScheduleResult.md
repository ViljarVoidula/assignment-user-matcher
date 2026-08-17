[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ScheduleResult

# Interface: ScheduleResult

The outcome of a solve. `'optimal'` means "no known improvement", never a proof.

## Table of contents

### Properties

- [assignments](ScheduleResult.md#assignments)
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

[src/scheduling/types.ts:701](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L701)

---

### cost

• `Optional` **cost**: `Object`

Per-person cost breakdown when a cost model was supplied.

#### Type declaration

| Name         | Type                           |
| :----------- | :----------------------------- |
| `byEmployee` | `Record`\<`string`, `number`\> |
| `totalCents` | `number`                       |

#### Defined in

[src/scheduling/types.ts:715](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L715)

---

### ledger

• `Optional` **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Deferred obligations the roster created, such as compensatory rest owed.

#### Defined in

[src/scheduling/types.ts:713](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L713)

---

### provenance

• `Optional` **provenance**: `ScheduleProvenance`

What produced this roster. Reproducibility is an audit requirement:
"the roster was lawful under the rules as they stood" is the defence, and
it needs the rules and weights to be identifiable after the fact. In
Germany the objective weights are themselves co-determination subject
matter (BetrVG §87(1)), not internal tuning.

#### Defined in

[src/scheduling/types.ts:711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L711)

---

### stats

• **stats**: `Object`

#### Type declaration

| Name                | Type     |
| :------------------ | :------- |
| `durationMs`        | `number` |
| `evaluatedVariants` | `number` |
| `unfilledSlots`     | `number` |

#### Defined in

[src/scheduling/types.ts:703](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L703)

---

### status

• **status**: `"optimal"` \| `"feasible"` \| `"partial"`

#### Defined in

[src/scheduling/types.ts:700](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L700)

---

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/types.ts:702](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L702)
