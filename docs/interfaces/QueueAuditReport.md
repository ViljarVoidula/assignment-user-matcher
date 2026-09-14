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

[src/types/matcher.ts:775](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L775)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:771](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L771)

___

### scanned

• **scanned**: `number`

Queued assignments examined (after `limit` / `minWaitingMs`)

#### Defined in

[src/types/matcher.ts:773](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L773)

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

[src/types/matcher.ts:781](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L781)
