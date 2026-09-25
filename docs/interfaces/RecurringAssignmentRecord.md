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

[src/types/matcher.ts:532](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L532)

___

### occurrences

• **occurrences**: `number`

Occurrences materialized so far (skipped slots do not count)

#### Defined in

[src/types/matcher.ts:534](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L534)

___

### template

• **template**: [`RecurringAssignment`](../modules.md#recurringassignment)

#### Defined in

[src/types/matcher.ts:530](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L530)
