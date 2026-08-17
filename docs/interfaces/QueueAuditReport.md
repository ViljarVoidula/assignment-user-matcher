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

[src/types/matcher.ts:573](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L573)

---

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:569](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L569)

---

### scanned

• **scanned**: `number`

Queued assignments examined (after `limit` / `minWaitingMs`)

#### Defined in

[src/types/matcher.ts:571](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L571)

---

### sweepBacklog

• **sweepBacklog**: `Object`

Past-due entries sitting in each deadline index. Nonzero values that
persist across calls mean nothing is sweeping — check that
`startMaintenance()` (or a `runMaintenanceOnce()` tick) is running.

#### Type declaration

| Name                  | Type     |
| :-------------------- | :------- |
| `completionDeadlines` | `number` |
| `responseDeadlines`   | `number` |
| `scheduleActivations` | `number` |
| `scheduleMisses`      | `number` |
| `slaExpiries`         | `number` |

#### Defined in

[src/types/matcher.ts:579](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L579)
