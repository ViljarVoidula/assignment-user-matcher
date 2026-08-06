[assignment-user-matcher](../README.md) / [Exports](../modules.md) / QueueAuditEntry

# Interface: QueueAuditEntry

One queued assignment's stuck-analysis from `auditQueue()`.

## Table of contents

### Properties

- [assignmentId](QueueAuditEntry.md#assignmentid)
- [blockers](QueueAuditEntry.md#blockers)
- [eligibleUserCount](QueueAuditEntry.md#eligibleusercount)
- [tags](QueueAuditEntry.md#tags)
- [uncoveredTags](QueueAuditEntry.md#uncoveredtags)
- [waitingMs](QueueAuditEntry.md#waitingms)

## Properties

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L551)

___

### blockers

• **blockers**: `Record`\<`string`, `number`\>

Why users are blocked: `MatchTraceReason` kind → how many users it
blocks (e.g. `{ backlogFull: 3, paused: 1 }`). Users excluded purely
by tag/weight mismatch are counted under `noTagMatch`.

#### Defined in

[src/types/matcher.ts:564](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L564)

___

### eligibleUserCount

• **eligibleUserCount**: `number`

Users eligible right now under the full hard rules

#### Defined in

[src/types/matcher.ts:556](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L556)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:552](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L552)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:558](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L558)

___

### waitingMs

• **waitingMs**: ``null`` \| `number`

Ms since first enqueue; null when the wait-clock entry is missing

#### Defined in

[src/types/matcher.ts:554](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L554)
