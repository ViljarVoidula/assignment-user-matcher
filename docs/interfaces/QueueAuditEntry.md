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

[src/types/matcher.ts:776](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L776)

___

### blockers

• **blockers**: `Record`\<`string`, `number`\>

Why users are blocked: `MatchTraceReason` kind → how many users it
blocks (e.g. `{ backlogFull: 3, paused: 1 }`). Users excluded purely
by tag/weight mismatch are counted under `noTagMatch`.

#### Defined in

[src/types/matcher.ts:789](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L789)

___

### eligibleUserCount

• **eligibleUserCount**: `number`

Users eligible right now under the full hard rules

#### Defined in

[src/types/matcher.ts:781](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L781)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:777](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L777)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:783](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L783)

___

### waitingMs

• **waitingMs**: ``null`` \| `number`

Ms since first enqueue; null when the wait-clock entry is missing

#### Defined in

[src/types/matcher.ts:779](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L779)
