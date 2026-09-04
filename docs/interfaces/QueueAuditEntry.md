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

[src/types/matcher.ts:739](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L739)

___

### blockers

• **blockers**: `Record`\<`string`, `number`\>

Why users are blocked: `MatchTraceReason` kind → how many users it
blocks (e.g. `{ backlogFull: 3, paused: 1 }`). Users excluded purely
by tag/weight mismatch are counted under `noTagMatch`.

#### Defined in

[src/types/matcher.ts:752](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L752)

___

### eligibleUserCount

• **eligibleUserCount**: `number`

Users eligible right now under the full hard rules

#### Defined in

[src/types/matcher.ts:744](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L744)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:740](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L740)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:746](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L746)

___

### waitingMs

• **waitingMs**: ``null`` \| `number`

Ms since first enqueue; null when the wait-clock entry is missing

#### Defined in

[src/types/matcher.ts:742](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L742)
