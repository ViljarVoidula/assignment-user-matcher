[assignment-user-matcher](README.md) / Exports

# assignment-user-matcher

## Table of contents

### Classes

- [default](classes/default.md)

### Interfaces

- [AssignmentResult](interfaces/AssignmentResult.md)
- [AuditEntry](interfaces/AuditEntry.md)
- [CircuitBreakerState](interfaces/CircuitBreakerState.md)
- [DeadLetterEntry](interfaces/DeadLetterEntry.md)
- [ParallelBranchState](interfaces/ParallelBranchState.md)
- [User](interfaces/User.md)
- [WorkflowDefinition](interfaces/WorkflowDefinition.md)
- [WorkflowEvent](interfaces/WorkflowEvent.md)
- [WorkflowInstance](interfaces/WorkflowInstance.md)
- [WorkflowInstanceWithSnapshot](interfaces/WorkflowInstanceWithSnapshot.md)
- [WorkflowStep](interfaces/WorkflowStep.md)

### Type Aliases

- [Assignment](modules.md#assignment)
- [MatcherOptions](modules.md#matcheroptions)
- [RedisClientType](modules.md#redisclienttype)
- [Stats](modules.md#stats)
- [WorkflowEventType](modules.md#workfloweventtype)
- [WorkflowTaskType](modules.md#workflowtasktype)
- [options](modules.md#options)

## Type Aliases

### Assignment

Ƭ **Assignment**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowedCidrs?` | `string`[] |
| `id` | `string` |
| `priority?` | `number` |
| `skillThresholds?` | `Record`\<`string`, `number`\> |
| `tags` | `string`[] |

#### Defined in

[src/types/matcher.ts:17](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L17)

___

### MatcherOptions

Ƭ **MatcherOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `enableDefaultMatching?` | `boolean` | - |
| `enableOpenTelemetry?` | `boolean` | Enable OpenTelemetry tracing (default: false) |
| `enableWorkflows?` | `boolean` | Enable workflow orchestration features |
| `matchExpirationMs?` | `number` | - |
| `matchingFunction?` | (`user`: [`User`](interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `number` \| `string`, `assignmentId?`: `string`, `skillThresholds?`: `Record`\<`string`, `number`\>) => `Promise`\<[`number`, `number`]\> | - |
| `maxUserBacklogSize?` | `number` | - |
| `prioritizationFunction?` | (...`args`: ([`Assignment`](modules.md#assignment) \| `undefined`)[]) => `Promise`\<`number`\> | - |
| `redisPrefix?` | `string` | - |
| `relevantBatchSize?` | `number` | - |
| `streamConsumerGroup?` | `string` | Consumer group name for Redis Streams (defaults to 'orchestrator') |
| `streamConsumerName?` | `string` | Consumer name within the group (defaults to random UUID) |
| `workflowAuditEnabled?` | `boolean` | Enable audit trail stream for compliance (default: false) |
| `workflowCircuitBreakerResetMs?` | `number` | Time to wait before attempting to close circuit breaker in ms (default: 30000) |
| `workflowCircuitBreakerThreshold?` | `number` | Number of failures before circuit breaker opens (default: 5) |
| `workflowIdempotencyTtlMs?` | `number` | TTL for idempotency keys in milliseconds (default: 86400000 = 24h) |
| `workflowMaxRetries?` | `number` | Maximum retries for failed workflow events before moving to DLQ (default: 3) |
| `workflowOrphanReclaimMs?` | `number` | Minimum idle time before reclaiming orphaned messages in ms (default: 60000 = 1min) |
| `workflowReclaimPollIntervalMs?` | `number` | Polling interval for reclaim loop in ms (default: 5000) |
| `workflowSnapshotDefinitions?` | `boolean` | Snapshot workflow definitions at instance creation for versioning (default: true) |

#### Defined in

[src/types/matcher.ts:38](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L38)

___

### RedisClientType

Ƭ **RedisClientType**: `ReturnType`\<typeof `createClient`\>

#### Defined in

[src/types/matcher.ts:3](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L3)

___

### Stats

Ƭ **Stats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `remainingAssignments?` | `number` |
| `users?` | `number` |
| `usersWithoutAssignment?` | `string`[] |

#### Defined in

[src/types/matcher.ts:32](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L32)

___

### WorkflowEventType

Ƭ **WorkflowEventType**: ``"STARTED"`` \| ``"COMPLETED"`` \| ``"REJECTED"`` \| ``"EXPIRED"`` \| ``"FAILED"``

Event types for workflow lifecycle

#### Defined in

[src/types/matcher.ts:88](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L88)

___

### WorkflowTaskType

Ƭ **WorkflowTaskType**: ``"assignment"`` \| ``"machine"``

Step execution mode

#### Defined in

[src/types/matcher.ts:91](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L91)

___

### options

Ƭ **options**: [`MatcherOptions`](modules.md#matcheroptions)

**`Deprecated`**

Use MatcherOptions instead

#### Defined in

[src/types/matcher.ts:81](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L81)
