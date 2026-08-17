[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LedgerEntry

# Interface: LedgerEntry

A dated obligation created by an assignment.

## Table of contents

### Properties

- [citation](LedgerEntry.md#citation)
- [dueBy](LedgerEntry.md#dueby)
- [employeeId](LedgerEntry.md#employeeid)
- [kind](LedgerEntry.md#kind)
- [minutes](LedgerEntry.md#minutes)
- [reason](LedgerEntry.md#reason)

## Properties

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:761](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L761)

---

### dueBy

• `Optional` **dueBy**: `string`

ISO date by which the obligation must be discharged.

#### Defined in

[src/scheduling/types.ts:759](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L759)

---

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:756](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L756)

---

### kind

• **kind**: `"compensatoryRest"` \| `"substituteRestDay"` \| `"lateCancellationPay"` \| `"timeOffInLieu"`

#### Defined in

[src/scheduling/types.ts:755](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L755)

---

### minutes

• `Optional` **minutes**: `number`

#### Defined in

[src/scheduling/types.ts:757](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L757)

---

### reason

• **reason**: `string`

#### Defined in

[src/scheduling/types.ts:760](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L760)
