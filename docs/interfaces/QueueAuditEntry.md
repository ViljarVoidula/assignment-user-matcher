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

[src/types/matcher.ts:753](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L753)

___

### blockers

• **blockers**: `Record`\<`string`, `number`\>

Why users are blocked: `MatchTraceReason` kind → how many users it
blocks (e.g. `{ backlogFull: 3, paused: 1 }`). Users excluded purely
by tag/weight mismatch are counted under `noTagMatch`.

#### Defined in

[src/types/matcher.ts:766](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L766)

___

### eligibleUserCount

• **eligibleUserCount**: `number`

Users eligible right now under the full hard rules

#### Defined in

[src/types/matcher.ts:758](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L758)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:754](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L754)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:760](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L760)

___

### waitingMs

• **waitingMs**: ``null`` \| `number`

Ms since first enqueue; null when the wait-clock entry is missing

#### Defined in

[src/types/matcher.ts:756](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L756)
