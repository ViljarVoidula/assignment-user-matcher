[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RecurringAssignmentRecord

# Interface: RecurringAssignmentRecord

A stored recurring template plus its clock, from `getRecurringAssignment()` / `listRecurringAssignments()`.

## Table of contents

### Properties

- [nextAt](RecurringAssignmentRecord.md#nextat)
- [occurrences](RecurringAssignmentRecord.md#occurrences)
- [template](RecurringAssignmentRecord.md#template)

## Properties

### nextAt

• **nextAt**: `number`

Epoch ms the next occurrence's window opens

#### Defined in

[src/types/matcher.ts:386](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L386)

___

### occurrences

• **occurrences**: `number`

Occurrences materialized so far (skipped slots do not count)

#### Defined in

[src/types/matcher.ts:388](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L388)

___

### template

• **template**: [`RecurringAssignment`](../modules.md#recurringassignment)

#### Defined in

[src/types/matcher.ts:384](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L384)
