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

[src/types/matcher.ts:798](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L798)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:794](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L794)

___

### scanned

• **scanned**: `number`

Queued assignments examined (after `limit` / `minWaitingMs`)

#### Defined in

[src/types/matcher.ts:796](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L796)

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

[src/types/matcher.ts:804](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L804)
