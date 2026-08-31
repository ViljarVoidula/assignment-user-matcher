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

[src/types/matcher.ts:355](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L355)

___

### occurrences

• **occurrences**: `number`

Occurrences materialized so far (skipped slots do not count)

#### Defined in

[src/types/matcher.ts:357](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L357)

___

### template

• **template**: [`RecurringAssignment`](../modules.md#recurringassignment)

#### Defined in

[src/types/matcher.ts:353](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L353)
