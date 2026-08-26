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

[src/types/matcher.ts:720](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L720)

___

### blockers

• **blockers**: `Record`\<`string`, `number`\>

Why users are blocked: `MatchTraceReason` kind → how many users it
blocks (e.g. `{ backlogFull: 3, paused: 1 }`). Users excluded purely
by tag/weight mismatch are counted under `noTagMatch`.

#### Defined in

[src/types/matcher.ts:733](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L733)

___

### eligibleUserCount

• **eligibleUserCount**: `number`

Users eligible right now under the full hard rules

#### Defined in

[src/types/matcher.ts:725](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L725)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:721](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L721)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:727](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L727)

___

### waitingMs

• **waitingMs**: ``null`` \| `number`

Ms since first enqueue; null when the wait-clock entry is missing

#### Defined in

[src/types/matcher.ts:723](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L723)
