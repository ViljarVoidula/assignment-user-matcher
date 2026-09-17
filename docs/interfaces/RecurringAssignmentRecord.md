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

[src/types/matcher.ts:369](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L369)

___

### occurrences

• **occurrences**: `number`

Occurrences materialized so far (skipped slots do not count)

#### Defined in

[src/types/matcher.ts:371](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L371)

___

### template

• **template**: [`RecurringAssignment`](../modules.md#recurringassignment)

#### Defined in

[src/types/matcher.ts:367](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L367)
