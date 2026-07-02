[assignment-user-matcher](README.md) / Exports

# assignment-user-matcher

## Table of contents

### Classes

- [default](classes/default.md)

### Interfaces

- [AssignmentResult](interfaces/AssignmentResult.md)
- [AuditEntry](interfaces/AuditEntry.md)
- [AutoRoutingWeightsOptions](interfaces/AutoRoutingWeightsOptions.md)
- [CircuitBreakerState](interfaces/CircuitBreakerState.md)
- [DeadLetterEntry](interfaces/DeadLetterEntry.md)
- [LearningAssignmentContext](interfaces/LearningAssignmentContext.md)
- [LearningDecisionRecord](interfaces/LearningDecisionRecord.md)
- [LearningEpisodeRecord](interfaces/LearningEpisodeRecord.md)
- [LearningSample](interfaces/LearningSample.md)
- [LearningStats](interfaces/LearningStats.md)
- [LearningTagStat](interfaces/LearningTagStat.md)
- [ParallelBranchState](interfaces/ParallelBranchState.md)
- [ReliabilityMetrics](interfaces/ReliabilityMetrics.md)
- [User](interfaces/User.md)
- [WorkflowDefinition](interfaces/WorkflowDefinition.md)
- [WorkflowDefinitionInput](interfaces/WorkflowDefinitionInput.md)
- [WorkflowDefinitionSummary](interfaces/WorkflowDefinitionSummary.md)
- [WorkflowEvent](interfaces/WorkflowEvent.md)
- [WorkflowInstance](interfaces/WorkflowInstance.md)
- [WorkflowInstanceWithSnapshot](interfaces/WorkflowInstanceWithSnapshot.md)
- [WorkflowMachineTask](interfaces/WorkflowMachineTask.md)
- [WorkflowStep](interfaces/WorkflowStep.md)

### Type Aliases

- [Assignment](modules.md#assignment)
- [LearningFeatureExtractor](modules.md#learningfeatureextractor)
- [LearningFeatures](modules.md#learningfeatures)
- [LearningOutcome](modules.md#learningoutcome)
- [LearningRewards](modules.md#learningrewards)
- [LearningSignals](modules.md#learningsignals)
- [MachineTaskHandler](modules.md#machinetaskhandler)
- [MatcherOptions](modules.md#matcheroptions)
- [PendingAssignmentInfo](modules.md#pendingassignmentinfo)
- [RedisClientType](modules.md#redisclienttype)
- [Stats](modules.md#stats)
- [WorkflowEngineMetrics](modules.md#workflowenginemetrics)
- [WorkflowEventType](modules.md#workfloweventtype)
- [WorkflowTargetUser](modules.md#workflowtargetuser)
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

[src/types/matcher.ts:17](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L17)

___

### LearningFeatureExtractor

Ƭ **LearningFeatureExtractor**: (`user`: [`User`](interfaces/User.md), `assignment`: [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md)) => [`LearningFeatures`](modules.md#learningfeatures)

Pluggable feature extractor for the learning layer

#### Type declaration

▸ (`user`, `assignment`): [`LearningFeatures`](modules.md#learningfeatures)

##### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](interfaces/User.md) |
| `assignment` | [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md) |

##### Returns

[`LearningFeatures`](modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:456](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L456)

___

### LearningFeatures

Ƭ **LearningFeatures**: `Record`\<`string`, `number`\>

Sparse feature vector describing a user/assignment match context

#### Defined in

[src/types/matcher.ts:446](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L446)

___

### LearningOutcome

Ƭ **LearningOutcome**: ``"accept"`` \| ``"complete"`` \| ``"reject"`` \| ``"expire"`` \| ``"fail"``

Assignment lifecycle outcomes that generate learning rewards

#### Defined in

[src/types/matcher.ts:440](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L440)

___

### LearningRewards

Ƭ **LearningRewards**: `Record`\<[`LearningOutcome`](modules.md#learningoutcome), `number`\>

Reward values per lifecycle outcome

#### Defined in

[src/types/matcher.ts:443](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L443)

___

### LearningSignals

Ƭ **LearningSignals**: `Record`\<`string`, `number`\>

Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 })

#### Defined in

[src/types/matcher.ts:482](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L482)

___

### MachineTaskHandler

Ƭ **MachineTaskHandler**: (`args`: \{ `definition`: [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) ; `instance`: [`WorkflowInstance`](interfaces/WorkflowInstance.md) ; `step`: [`WorkflowStep`](interfaces/WorkflowStep.md)  }) => `Promise`\<`Record`\<`string`, `any`\> \| `void`\>

Signature for machine task handlers registered via registerMachineHandler().

#### Type declaration

▸ (`args`): `Promise`\<`Record`\<`string`, `any`\> \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.definition` | [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) |
| `args.instance` | [`WorkflowInstance`](interfaces/WorkflowInstance.md) |
| `args.step` | [`WorkflowStep`](interfaces/WorkflowStep.md) |

##### Returns

`Promise`\<`Record`\<`string`, `any`\> \| `void`\>

#### Defined in

[src/managers/WorkflowManager.ts:35](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/managers/WorkflowManager.ts#L35)

___

### MatcherOptions

Ƭ **MatcherOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoRoutingWeights?` | [`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md) | Tuning for automatic routing-weight synthesis (UCB1 policy) |
| `circuitBreakerPersistState?` | `boolean` | Persist circuit breaker state to Redis for distributed awareness (default: false) |
| `circuitBreakerShared?` | `boolean` | Share circuit breaker failure counts across replicas via Redis so breakers converge in multi-orchestrator deployments (default: false). |
| `deadLetterQueueAlertThreshold?` | `number` | Alert threshold for Dead Letter Queue size (default: 100) |
| `enableAutoRoutingWeights?` | `boolean` | Track per-user, per-tag reward statistics and enable automatic routingWeights generation from RL outcomes (requires enableLearning). Default: false. |
| `enableDefaultMatching?` | `boolean` | - |
| `enableGracefulDegradation?` | `boolean` | Enable graceful degradation mode when Redis is unavailable (default: false) |
| `enableLearning?` | `boolean` | Enable the contextual-bandit learning layer (default: false) |
| `enableOpenTelemetry?` | `boolean` | Enable OpenTelemetry tracing (default: false) |
| `enableReliabilityMetrics?` | `boolean` | Enable circuit breaker and reliability metrics (default: true when telemetry enabled) |
| `enableWorkflows?` | `boolean` | Enable workflow orchestration features |
| `idleUserTimeoutMs?` | `number` | Opt-in idle user auto-rejection. When set, users that have pending (not yet accepted/rejected) assignments and show no activity for this many milliseconds are removed from the matching pool by processIdleUsers(), and their pending assignments are requeued. Disabled when undefined (default), preserving existing behavior. |
| `learningBoostFactor?` | `number` | Multiplier applied to predicted reward when re-ranking candidates (default: 1) |
| `learningDecisionTtlMs?` | `number` | TTL for stored decision contexts in ms (default: 604800000 = 7 days) |
| `learningExplorationRate?` | `number` | Epsilon-greedy exploration rate in [0, 1] (default: 0.05) |
| `learningFeatureExtractor?` | [`LearningFeatureExtractor`](modules.md#learningfeatureextractor) | Custom feature extractor; defaults to tag/skill/overlap/embedding features |
| `learningFeedbackTtlMs?` | `number` | TTL for archived episodes awaiting external feedback in ms (default: 604800000 = 7 days) |
| `learningRate?` | `number` | SGD learning rate for online model updates (default: 0.1) |
| `learningRewards?` | `Partial`\<[`LearningRewards`](modules.md#learningrewards)\> | Override rewards per lifecycle outcome (merged with defaults) |
| `learningShadowMode?` | `boolean` | Shadow mode: record decisions and learn, but never alter ranking (default: false) |
| `learningSignalWeights?` | `Record`\<`string`, `number`\> | Weights applied to named external feedback signals when computing rewards (default weight: 1) |
| `matchExpirationMs?` | `number` | - |
| `matchingFunction?` | (`user`: [`User`](interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `number` \| `string`, `assignmentId?`: `string`, `skillThresholds?`: `Record`\<`string`, `number`\>) => `Promise`\<[`number`, `number`]\> | - |
| `maxUserBacklogSize?` | `number` | - |
| `prioritizationFunction?` | (...`args`: ([`Assignment`](modules.md#assignment) \| `undefined`)[]) => `Promise`\<`number`\> | - |
| `redisCommandTimeout?` | `number` | Command timeout in ms (default: 3000) |
| `redisConnectTimeout?` | `number` | Connection timeout in ms (default: 10000) |
| `redisEnableOfflineQueue?` | `boolean` | Enable offline queue for commands during disconnect (default: true) |
| `redisEnableReadyCheck?` | `boolean` | Enable ready check before considering connection successful (default: true) |
| `redisHealthCheckInterval?` | `number` | Health check interval in ms (default: 30000) |
| `redisInitialRetryDelay?` | `number` | Initial delay between retries in ms (default: 50) |
| `redisMaxRetries?` | `number` | Maximum number of reconnection attempts (default: 10) |
| `redisMaxRetryDelay?` | `number` | Maximum delay between retries in ms (default: 2000) |
| `redisPrefix?` | `string` | - |
| `relevantBatchSize?` | `number` | - |
| `streamConsumerGroup?` | `string` | Consumer group name for Redis Streams (defaults to 'orchestrator') |
| `streamConsumerName?` | `string` | Consumer name within the group (defaults to random UUID) |
| `workflowAuditEnabled?` | `boolean` | Enable audit trail stream for compliance (default: false) |
| `workflowCircuitBreakerResetMs?` | `number` | Time to wait before attempting to close circuit breaker in ms (default: 30000) |
| `workflowCircuitBreakerThreshold?` | `number` | Number of failures before circuit breaker opens (default: 5) |
| `workflowEventBatchSize?` | `number` | Max stream entries read per orchestrator poll (XREADGROUP COUNT, default: 10) |
| `workflowIdempotencyTtlMs?` | `number` | TTL for idempotency keys in milliseconds (default: 86400000 = 24h) |
| `workflowInstanceRetentionMs?` | `number` | TTL applied to terminal (completed/failed/cancelled) workflow instances, including cleanup of registry, per-user, and active-index entries. When unset (default), terminal instances are kept forever. |
| `workflowMaxEventsPerSecond?` | `number` | Per-replica throttle on workflow event processing (events per second). Applies to orchestrator stream consumption and scheduled-retry draining. When unset (default), events are processed as fast as possible. |
| `workflowMaxRetries?` | `number` | Maximum retries for failed workflow events before moving to DLQ (default: 3) |
| `workflowOrphanReclaimMs?` | `number` | Minimum idle time before reclaiming orphaned messages in ms (default: 60000 = 1min) |
| `workflowPollBlockMs?` | `number` | Blocking wait per orchestrator poll in ms (XREADGROUP BLOCK, default: 5000) |
| `workflowReclaimPollIntervalMs?` | `number` | Polling interval for reclaim loop in ms (default: 5000) |
| `workflowRetryBackoffMs?` | `number` | Initial backoff delay for scheduled workflow event retries in ms (default: 1000) |
| `workflowSnapshotDefinitions?` | `boolean` | Snapshot workflow definitions at instance creation for versioning (default: true) |

#### Defined in

[src/types/matcher.ts:46](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L46)

___

### PendingAssignmentInfo

Ƭ **PendingAssignmentInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `assignment` | [`Assignment`](modules.md#assignment) |
| `expiresAt` | `number` \| ``null`` |
| `ownerId` | `string` \| ``null`` |
| `pendingForMs` | `number` \| ``null`` |
| `pendingSince` | `number` \| ``null`` |

#### Defined in

[src/types/matcher.ts:38](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L38)

___

### RedisClientType

Ƭ **RedisClientType**: `ReturnType`\<typeof `createClient`\>

#### Defined in

[src/types/matcher.ts:3](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L3)

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

[src/types/matcher.ts:32](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L32)

___

### WorkflowEngineMetrics

Ƭ **WorkflowEngineMetrics**: `Object`

Operational metrics for the workflow engine

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `activeInstances` | `number` | Number of active workflow instances (from the active-instance index) |
| `deadLetterQueueSize` | `number` | Number of events in the Dead Letter Queue |
| `scheduledRetries` | `number` | Number of events waiting in the delayed-retry queue |
| `streamLength` | `number` | Total length of the workflow event stream |
| `streamPending` | `number` | Number of pending (delivered but unacknowledged) stream messages |

#### Defined in

[src/types/matcher.ts:179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L179)

___

### WorkflowEventType

Ƭ **WorkflowEventType**: ``"STARTED"`` \| ``"COMPLETED"`` \| ``"REJECTED"`` \| ``"EXPIRED"`` \| ``"FAILED"``

Event types for workflow lifecycle

#### Defined in

[src/types/matcher.ts:197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L197)

___

### WorkflowTargetUser

Ƭ **WorkflowTargetUser**: ``"initiator"`` \| ``"previous"`` \| `string` \| \{ `tag`: `string`  }

Target user selector for workflow assignment steps

#### Defined in

[src/types/matcher.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L203)

___

### WorkflowTaskType

Ƭ **WorkflowTaskType**: ``"assignment"`` \| ``"machine"``

Step execution mode

#### Defined in

[src/types/matcher.ts:200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L200)

___

### options

Ƭ **options**: [`MatcherOptions`](modules.md#matcheroptions)

**`Deprecated`**

Use MatcherOptions instead

#### Defined in

[src/types/matcher.ts:176](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L176)
