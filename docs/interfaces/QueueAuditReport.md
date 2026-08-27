[assignment-user-matcher](../README.md) / [Exports](../modules.md) / QueueAuditReport

# Interface: QueueAuditReport

Output of `AssignmentMatcher.auditQueue()`: stuck work plus unswept clocks.

## Table of contents

### Properties

- [entries](QueueAuditReport.md#entries)
- [evaluatedAt](QueueAuditReport.md#evaluatedat)
- [scanned](QueueAuditReport.md#scanned)
- [sweepBacklog](QueueAuditReport.md#sweepbacklog)

## Properties

### entries

• **entries**: [`QueueAuditEntry`](QueueAuditEntry.md)[]

Assignments nobody can take right now (plus healthy ones when requested)

#### Defined in

[src/types/matcher.ts:761](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L761)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:757](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L757)

___

### scanned

• **scanned**: `number`

Queued assignments examined (after `limit` / `minWaitingMs`)

#### Defined in

[src/types/matcher.ts:759](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L759)

___

### sweepBacklog

• **sweepBacklog**: `Object`

Past-due entries sitting in each deadline index. Nonzero values that
persist across calls mean nothing is sweeping — check that
`startMaintenance()` (or a `runMaintenanceOnce()` tick) is running.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `completionDeadlines` | `number` |
| `responseDeadlines` | `number` |
| `scheduleActivations` | `number` |
| `scheduleMisses` | `number` |
| `slaExpiries` | `number` |

#### Defined in

[src/types/matcher.ts:767](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L767)
