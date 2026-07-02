[assignment-user-matcher](README.md) / Exports

# assignment-user-matcher

## Table of contents

### References

- [default](modules.md#default)

### Classes

- [AssignmentMatcher](classes/AssignmentMatcher.md)
- [WorkflowBuilder](classes/WorkflowBuilder.md)
- [WorkflowStepBuilder](classes/WorkflowStepBuilder.md)

### Interfaces

- [AssignmentCounts](interfaces/AssignmentCounts.md)
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
- [PaginationOptions](interfaces/PaginationOptions.md)
- [PaginationResult](interfaces/PaginationResult.md)
- [ParallelBranchState](interfaces/ParallelBranchState.md)
- [RedisKeyConfig](interfaces/RedisKeyConfig.md)
- [ReliabilityMetrics](interfaces/ReliabilityMetrics.md)
- [User](interfaces/User.md)
- [WorkflowDefinition](interfaces/WorkflowDefinition.md)
- [WorkflowDefinitionInput](interfaces/WorkflowDefinitionInput.md)
- [WorkflowDefinitionSummary](interfaces/WorkflowDefinitionSummary.md)
- [WorkflowEvent](interfaces/WorkflowEvent.md)
- [WorkflowHost](interfaces/WorkflowHost.md)
- [WorkflowInstance](interfaces/WorkflowInstance.md)
- [WorkflowInstanceWithSnapshot](interfaces/WorkflowInstanceWithSnapshot.md)
- [WorkflowMachineTask](interfaces/WorkflowMachineTask.md)
- [WorkflowRouting](interfaces/WorkflowRouting.md)
- [WorkflowStep](interfaces/WorkflowStep.md)

### Type Aliases

- [Assignment](modules.md#assignment)
- [AssignmentStatus](modules.md#assignmentstatus)
- [KeyBuilders](modules.md#keybuilders)
- [LearningFeatureExtractor](modules.md#learningfeatureextractor)
- [LearningFeatures](modules.md#learningfeatures)
- [LearningOutcome](modules.md#learningoutcome)
- [LearningRewards](modules.md#learningrewards)
- [LearningSignals](modules.md#learningsignals)
- [MachineTaskHandler](modules.md#machinetaskhandler)
- [MatcherOptions](modules.md#matcheroptions)
- [PendingAssignmentInfo](modules.md#pendingassignmentinfo)
- [Stats](modules.md#stats)
- [WorkflowEngineMetrics](modules.md#workflowenginemetrics)
- [WorkflowEventType](modules.md#workfloweventtype)
- [WorkflowInstanceStatus](modules.md#workflowinstancestatus)
- [WorkflowTargetUser](modules.md#workflowtargetuser)
- [WorkflowTaskType](modules.md#workflowtasktype)
- [options](modules.md#options)

### Variables

- [DEFAULT_AUTO_WEIGHTS_OPTIONS](modules.md#default_auto_weights_options)

### Functions

- [approvalWorkflow](modules.md#approvalworkflow)
- [checkCidrMatch](modules.md#checkcidrmatch)
- [cosineSimilarity](modules.md#cosinesimilarity)
- [createKeyBuilders](modules.md#createkeybuilders)
- [extractMatchFeatures](modules.md#extractmatchfeatures)
- [isIpInCidr](modules.md#isipincidr)
- [linearWorkflow](modules.md#linearworkflow)
- [normalizeWorkflowDefinition](modules.md#normalizeworkflowdefinition)
- [parseCIDR](modules.md#parsecidr)
- [parseIP](modules.md#parseip)
- [parseIPv4](modules.md#parseipv4)
- [parseIPv6](modules.md#parseipv6)
- [synthesizeRoutingWeights](modules.md#synthesizeroutingweights)
- [validateWorkflowDefinition](modules.md#validateworkflowdefinition)
- [workflow](modules.md#workflow)

## References

### default

Renames and re-exports [AssignmentMatcher](classes/AssignmentMatcher.md)

## Type Aliases

### Assignment

Ƭ **Assignment**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name               | Type                           |
| :----------------- | :----------------------------- |
| `allowedCidrs?`    | `string`[]                     |
| `id`               | `string`                       |
| `priority?`        | `number`                       |
| `skillThresholds?` | `Record`\<`string`, `number`\> |
| `tags`             | `string`[]                     |

#### Defined in

[src/types/matcher.ts:17](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L17)

---

### AssignmentStatus

Ƭ **AssignmentStatus**: `"queued"` \| `"pending"` \| `"accepted"`

#### Defined in

[src/queries/pagination.ts:6](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/queries/pagination.ts#L6)

---

### KeyBuilders

Ƭ **KeyBuilders**: `ReturnType`\<typeof [`createKeyBuilders`](modules.md#createkeybuilders)\>

#### Defined in

[src/utils/keys.ts:87](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/keys.ts#L87)

---

### LearningFeatureExtractor

Ƭ **LearningFeatureExtractor**: (`user`: [`User`](interfaces/User.md), `assignment`: [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md)) => [`LearningFeatures`](modules.md#learningfeatures)

Pluggable feature extractor for the learning layer

#### Type declaration

▸ (`user`, `assignment`): [`LearningFeatures`](modules.md#learningfeatures)

##### Parameters

| Name         | Type                                                                   |
| :----------- | :--------------------------------------------------------------------- |
| `user`       | [`User`](interfaces/User.md)                                           |
| `assignment` | [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md) |

##### Returns

[`LearningFeatures`](modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:456](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L456)

---

### LearningFeatures

Ƭ **LearningFeatures**: `Record`\<`string`, `number`\>

Sparse feature vector describing a user/assignment match context

#### Defined in

[src/types/matcher.ts:446](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L446)

---

### LearningOutcome

Ƭ **LearningOutcome**: `"accept"` \| `"complete"` \| `"reject"` \| `"expire"` \| `"fail"`

Assignment lifecycle outcomes that generate learning rewards

#### Defined in

[src/types/matcher.ts:440](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L440)

---

### LearningRewards

Ƭ **LearningRewards**: `Record`\<[`LearningOutcome`](modules.md#learningoutcome), `number`\>

Reward values per lifecycle outcome

#### Defined in

[src/types/matcher.ts:443](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L443)

---

### LearningSignals

Ƭ **LearningSignals**: `Record`\<`string`, `number`\>

Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 })

#### Defined in

[src/types/matcher.ts:482](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L482)

---

### MachineTaskHandler

Ƭ **MachineTaskHandler**: (`args`: \{ `definition`: [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) ; `instance`: [`WorkflowInstance`](interfaces/WorkflowInstance.md) ; `step`: [`WorkflowStep`](interfaces/WorkflowStep.md) }) => `Promise`\<`Record`\<`string`, `any`\> \| `void`\>

Signature for machine task handlers registered via registerMachineHandler().

#### Type declaration

▸ (`args`): `Promise`\<`Record`\<`string`, `any`\> \| `void`\>

##### Parameters

| Name              | Type                                                     |
| :---------------- | :------------------------------------------------------- |
| `args`            | `Object`                                                 |
| `args.definition` | [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) |
| `args.instance`   | [`WorkflowInstance`](interfaces/WorkflowInstance.md)     |
| `args.step`       | [`WorkflowStep`](interfaces/WorkflowStep.md)             |

##### Returns

`Promise`\<`Record`\<`string`, `any`\> \| `void`\>

#### Defined in

[src/managers/WorkflowManager.ts:35](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/managers/WorkflowManager.ts#L35)

---

### MatcherOptions

Ƭ **MatcherOptions**: `Object`

#### Type declaration

| Name                               | Type                                                                                                                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                       |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoRoutingWeights?`              | [`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md)                                                                                                                                                             | Tuning for automatic routing-weight synthesis (UCB1 policy)                                                                                                                                                                                                                                                                       |
| `circuitBreakerPersistState?`      | `boolean`                                                                                                                                                                                                                          | Persist circuit breaker state to Redis for distributed awareness (default: false)                                                                                                                                                                                                                                                 |
| `circuitBreakerShared?`            | `boolean`                                                                                                                                                                                                                          | Share circuit breaker failure counts across replicas via Redis so breakers converge in multi-orchestrator deployments (default: false).                                                                                                                                                                                           |
| `deadLetterQueueAlertThreshold?`   | `number`                                                                                                                                                                                                                           | Alert threshold for Dead Letter Queue size (default: 100)                                                                                                                                                                                                                                                                         |
| `enableAutoRoutingWeights?`        | `boolean`                                                                                                                                                                                                                          | Track per-user, per-tag reward statistics and enable automatic routingWeights generation from RL outcomes (requires enableLearning). Default: false.                                                                                                                                                                              |
| `enableDefaultMatching?`           | `boolean`                                                                                                                                                                                                                          | -                                                                                                                                                                                                                                                                                                                                 |
| `enableGracefulDegradation?`       | `boolean`                                                                                                                                                                                                                          | Enable graceful degradation mode when Redis is unavailable (default: false)                                                                                                                                                                                                                                                       |
| `enableLearning?`                  | `boolean`                                                                                                                                                                                                                          | Enable the contextual-bandit learning layer (default: false)                                                                                                                                                                                                                                                                      |
| `enableOpenTelemetry?`             | `boolean`                                                                                                                                                                                                                          | Enable OpenTelemetry tracing (default: false)                                                                                                                                                                                                                                                                                     |
| `enableReliabilityMetrics?`        | `boolean`                                                                                                                                                                                                                          | Enable circuit breaker and reliability metrics (default: true when telemetry enabled)                                                                                                                                                                                                                                             |
| `enableWorkflows?`                 | `boolean`                                                                                                                                                                                                                          | Enable workflow orchestration features                                                                                                                                                                                                                                                                                            |
| `idleUserTimeoutMs?`               | `number`                                                                                                                                                                                                                           | Opt-in idle user auto-rejection. When set, users that have pending (not yet accepted/rejected) assignments and show no activity for this many milliseconds are removed from the matching pool by processIdleUsers(), and their pending assignments are requeued. Disabled when undefined (default), preserving existing behavior. |
| `learningBoostFactor?`             | `number`                                                                                                                                                                                                                           | Multiplier applied to predicted reward when re-ranking candidates (default: 1)                                                                                                                                                                                                                                                    |
| `learningDecisionTtlMs?`           | `number`                                                                                                                                                                                                                           | TTL for stored decision contexts in ms (default: 604800000 = 7 days)                                                                                                                                                                                                                                                              |
| `learningExplorationRate?`         | `number`                                                                                                                                                                                                                           | Epsilon-greedy exploration rate in [0, 1] (default: 0.05)                                                                                                                                                                                                                                                                         |
| `learningFeatureExtractor?`        | [`LearningFeatureExtractor`](modules.md#learningfeatureextractor)                                                                                                                                                                  | Custom feature extractor; defaults to tag/skill/overlap/embedding features                                                                                                                                                                                                                                                        |
| `learningFeedbackTtlMs?`           | `number`                                                                                                                                                                                                                           | TTL for archived episodes awaiting external feedback in ms (default: 604800000 = 7 days)                                                                                                                                                                                                                                          |
| `learningRate?`                    | `number`                                                                                                                                                                                                                           | SGD learning rate for online model updates (default: 0.1)                                                                                                                                                                                                                                                                         |
| `learningRewards?`                 | `Partial`\<[`LearningRewards`](modules.md#learningrewards)\>                                                                                                                                                                       | Override rewards per lifecycle outcome (merged with defaults)                                                                                                                                                                                                                                                                     |
| `learningShadowMode?`              | `boolean`                                                                                                                                                                                                                          | Shadow mode: record decisions and learn, but never alter ranking (default: false)                                                                                                                                                                                                                                                 |
| `learningSignalWeights?`           | `Record`\<`string`, `number`\>                                                                                                                                                                                                     | Weights applied to named external feedback signals when computing rewards (default weight: 1)                                                                                                                                                                                                                                     |
| `matchExpirationMs?`               | `number`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                 |
| `matchingFunction?`                | (`user`: [`User`](interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `number` \| `string`, `assignmentId?`: `string`, `skillThresholds?`: `Record`\<`string`, `number`\>) => `Promise`\<[`number`, `number`]\> | -                                                                                                                                                                                                                                                                                                                                 |
| `maxUserBacklogSize?`              | `number`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                 |
| `prioritizationFunction?`          | (...`args`: ([`Assignment`](modules.md#assignment) \| `undefined`)[]) => `Promise`\<`number`\>                                                                                                                                     | -                                                                                                                                                                                                                                                                                                                                 |
| `redisCommandTimeout?`             | `number`                                                                                                                                                                                                                           | Command timeout in ms (default: 3000)                                                                                                                                                                                                                                                                                             |
| `redisConnectTimeout?`             | `number`                                                                                                                                                                                                                           | Connection timeout in ms (default: 10000)                                                                                                                                                                                                                                                                                         |
| `redisEnableOfflineQueue?`         | `boolean`                                                                                                                                                                                                                          | Enable offline queue for commands during disconnect (default: true)                                                                                                                                                                                                                                                               |
| `redisEnableReadyCheck?`           | `boolean`                                                                                                                                                                                                                          | Enable ready check before considering connection successful (default: true)                                                                                                                                                                                                                                                       |
| `redisHealthCheckInterval?`        | `number`                                                                                                                                                                                                                           | Health check interval in ms (default: 30000)                                                                                                                                                                                                                                                                                      |
| `redisInitialRetryDelay?`          | `number`                                                                                                                                                                                                                           | Initial delay between retries in ms (default: 50)                                                                                                                                                                                                                                                                                 |
| `redisMaxRetries?`                 | `number`                                                                                                                                                                                                                           | Maximum number of reconnection attempts (default: 10)                                                                                                                                                                                                                                                                             |
| `redisMaxRetryDelay?`              | `number`                                                                                                                                                                                                                           | Maximum delay between retries in ms (default: 2000)                                                                                                                                                                                                                                                                               |
| `redisPrefix?`                     | `string`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                 |
| `relevantBatchSize?`               | `number`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                 |
| `streamConsumerGroup?`             | `string`                                                                                                                                                                                                                           | Consumer group name for Redis Streams (defaults to 'orchestrator')                                                                                                                                                                                                                                                                |
| `streamConsumerName?`              | `string`                                                                                                                                                                                                                           | Consumer name within the group (defaults to random UUID)                                                                                                                                                                                                                                                                          |
| `workflowAuditEnabled?`            | `boolean`                                                                                                                                                                                                                          | Enable audit trail stream for compliance (default: false)                                                                                                                                                                                                                                                                         |
| `workflowCircuitBreakerResetMs?`   | `number`                                                                                                                                                                                                                           | Time to wait before attempting to close circuit breaker in ms (default: 30000)                                                                                                                                                                                                                                                    |
| `workflowCircuitBreakerThreshold?` | `number`                                                                                                                                                                                                                           | Number of failures before circuit breaker opens (default: 5)                                                                                                                                                                                                                                                                      |
| `workflowEventBatchSize?`          | `number`                                                                                                                                                                                                                           | Max stream entries read per orchestrator poll (XREADGROUP COUNT, default: 10)                                                                                                                                                                                                                                                     |
| `workflowIdempotencyTtlMs?`        | `number`                                                                                                                                                                                                                           | TTL for idempotency keys in milliseconds (default: 86400000 = 24h)                                                                                                                                                                                                                                                                |
| `workflowInstanceRetentionMs?`     | `number`                                                                                                                                                                                                                           | TTL applied to terminal (completed/failed/cancelled) workflow instances, including cleanup of registry, per-user, and active-index entries. When unset (default), terminal instances are kept forever.                                                                                                                            |
| `workflowMaxEventsPerSecond?`      | `number`                                                                                                                                                                                                                           | Per-replica throttle on workflow event processing (events per second). Applies to orchestrator stream consumption and scheduled-retry draining. When unset (default), events are processed as fast as possible.                                                                                                                   |
| `workflowMaxRetries?`              | `number`                                                                                                                                                                                                                           | Maximum retries for failed workflow events before moving to DLQ (default: 3)                                                                                                                                                                                                                                                      |
| `workflowOrphanReclaimMs?`         | `number`                                                                                                                                                                                                                           | Minimum idle time before reclaiming orphaned messages in ms (default: 60000 = 1min)                                                                                                                                                                                                                                               |
| `workflowPollBlockMs?`             | `number`                                                                                                                                                                                                                           | Blocking wait per orchestrator poll in ms (XREADGROUP BLOCK, default: 5000)                                                                                                                                                                                                                                                       |
| `workflowReclaimPollIntervalMs?`   | `number`                                                                                                                                                                                                                           | Polling interval for reclaim loop in ms (default: 5000)                                                                                                                                                                                                                                                                           |
| `workflowRetryBackoffMs?`          | `number`                                                                                                                                                                                                                           | Initial backoff delay for scheduled workflow event retries in ms (default: 1000)                                                                                                                                                                                                                                                  |
| `workflowSnapshotDefinitions?`     | `boolean`                                                                                                                                                                                                                          | Snapshot workflow definitions at instance creation for versioning (default: true)                                                                                                                                                                                                                                                 |

#### Defined in

[src/types/matcher.ts:46](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L46)

---

### PendingAssignmentInfo

Ƭ **PendingAssignmentInfo**: `Object`

#### Type declaration

| Name           | Type                                  |
| :------------- | :------------------------------------ |
| `assignment`   | [`Assignment`](modules.md#assignment) |
| `expiresAt`    | `number` \| `null`                    |
| `ownerId`      | `string` \| `null`                    |
| `pendingForMs` | `number` \| `null`                    |
| `pendingSince` | `number` \| `null`                    |

#### Defined in

[src/types/matcher.ts:38](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L38)

---

### Stats

Ƭ **Stats**: `Object`

#### Type declaration

| Name                      | Type       |
| :------------------------ | :--------- |
| `remainingAssignments?`   | `number`   |
| `users?`                  | `number`   |
| `usersWithoutAssignment?` | `string`[] |

#### Defined in

[src/types/matcher.ts:32](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L32)

---

### WorkflowEngineMetrics

Ƭ **WorkflowEngineMetrics**: `Object`

Operational metrics for the workflow engine

#### Type declaration

| Name                  | Type     | Description                                                          |
| :-------------------- | :------- | :------------------------------------------------------------------- |
| `activeInstances`     | `number` | Number of active workflow instances (from the active-instance index) |
| `deadLetterQueueSize` | `number` | Number of events in the Dead Letter Queue                            |
| `scheduledRetries`    | `number` | Number of events waiting in the delayed-retry queue                  |
| `streamLength`        | `number` | Total length of the workflow event stream                            |
| `streamPending`       | `number` | Number of pending (delivered but unacknowledged) stream messages     |

#### Defined in

[src/types/matcher.ts:179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L179)

---

### WorkflowEventType

Ƭ **WorkflowEventType**: `"STARTED"` \| `"COMPLETED"` \| `"REJECTED"` \| `"EXPIRED"` \| `"FAILED"`

Event types for workflow lifecycle

#### Defined in

[src/types/matcher.ts:197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L197)

---

### WorkflowInstanceStatus

Ƭ **WorkflowInstanceStatus**: `"active"` \| `"completed"` \| `"failed"` \| `"cancelled"`

Status of a workflow instance

#### Defined in

[src/types/matcher.ts:306](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L306)

---

### WorkflowTargetUser

Ƭ **WorkflowTargetUser**: `"initiator"` \| `"previous"` \| `string` \| \{ `tag`: `string` }

Target user selector for workflow assignment steps

#### Defined in

[src/types/matcher.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L203)

---

### WorkflowTaskType

Ƭ **WorkflowTaskType**: `"assignment"` \| `"machine"`

Step execution mode

#### Defined in

[src/types/matcher.ts:200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L200)

---

### options

Ƭ **options**: [`MatcherOptions`](modules.md#matcheroptions)

**`Deprecated`**

Use MatcherOptions instead

#### Defined in

[src/types/matcher.ts:176](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L176)

## Variables

### DEFAULT_AUTO_WEIGHTS_OPTIONS

• `Const` **DEFAULT_AUTO_WEIGHTS_OPTIONS**: `Required`\<`Omit`\<[`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md), `"priorWeight"`\>\>

#### Defined in

[src/learning/auto-weights.ts:19](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/learning/auto-weights.ts#L19)

## Functions

### approvalWorkflow

▸ **approvalWorkflow**(`id`, `name`, `options`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

Create an approval workflow with submit -> review -> complete/rejected pattern.

#### Parameters

| Name                          | Type                                               |
| :---------------------------- | :------------------------------------------------- |
| `id`                          | `string`                                           |
| `name`                        | `string`                                           |
| `options`                     | `Object`                                           |
| `options.completeAssignment?` | `Partial`\<[`Assignment`](modules.md#assignment)\> |
| `options.rejectedAssignment?` | `Partial`\<[`Assignment`](modules.md#assignment)\> |
| `options.reviewAssignment`    | `Partial`\<[`Assignment`](modules.md#assignment)\> |
| `options.reviewTimeoutMs?`    | `number`                                           |
| `options.reviewerTag?`        | `string`                                           |
| `options.submitAssignment`    | `Partial`\<[`Assignment`](modules.md#assignment)\> |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-builder.ts:347](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/workflow-builder.ts#L347)

---

### checkCidrMatch

▸ **checkCidrMatch**(`userIp`, `allowedCidrs`): `boolean`

Check if a user's IP matches any of the allowed CIDRs
Returns true if no CIDRs are specified (open assignment) or if IP matches any CIDR

#### Parameters

| Name           | Type                      |
| :------------- | :------------------------ |
| `userIp`       | `undefined` \| `string`   |
| `allowedCidrs` | `undefined` \| `string`[] |

#### Returns

`boolean`

#### Defined in

[src/utils/cidr.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/cidr.ts#L139)

---

### cosineSimilarity

▸ **cosineSimilarity**(`a`, `b`): `number`

Cosine similarity between two numeric vectors.
Returns 0 for mismatched lengths or zero-magnitude vectors.

#### Parameters

| Name | Type       |
| :--- | :--------- |
| `a`  | `number`[] |
| `b`  | `number`[] |

#### Returns

`number`

#### Defined in

[src/learning/features.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/learning/features.ts#L15)

---

### createKeyBuilders

▸ **createKeyBuilders**(`config`): `Object`

Creates Redis key builder functions with a given prefix

#### Parameters

| Name     | Type                                             |
| :------- | :----------------------------------------------- |
| `config` | [`RedisKeyConfig`](interfaces/RedisKeyConfig.md) |

#### Returns

`Object`

| Name                       | Type                                                     |
| :------------------------- | :------------------------------------------------------- |
| `acceptedAssignments`      | () => `string`                                           |
| `allTags`                  | () => `string`                                           |
| `assignmentOwner`          | () => `string`                                           |
| `assignmentPriority`       | (`id`: `string`) => `string`                             |
| `assignmentTags`           | (`id`: `string`) => `string`                             |
| `assignments`              | () => `string`                                           |
| `assignmentsGeo`           | () => `string`                                           |
| `assignmentsRef`           | () => `string`                                           |
| `circuitBreakerFailures`   | () => `string`                                           |
| `circuitBreakerState`      | () => `string`                                           |
| `completedAssignments`     | () => `string`                                           |
| `deadLetterQueue`          | () => `string`                                           |
| `eventRetryCount`          | (`eventId`: `string`) => `string`                        |
| `eventStream`              | () => `string`                                           |
| `eventStreamDeadLetter`    | () => `string`                                           |
| `eventsRetryScheduled`     | () => `string`                                           |
| `learningDecision`         | (`assignmentId`: `string`) => `string`                   |
| `learningEpisode`          | (`assignmentId`: `string`) => `string`                   |
| `learningModel`            | () => `string`                                           |
| `learningStats`            | () => `string`                                           |
| `learningUserTagCounts`    | (`userId`: `string`) => `string`                         |
| `learningUserTagRewards`   | (`userId`: `string`) => `string`                         |
| `learningUsers`            | () => `string`                                           |
| `pendingAssignmentsData`   | () => `string`                                           |
| `pendingAssignmentsExpiry` | () => `string`                                           |
| `processedEvent`           | (`eventId`: `string`) => `string`                        |
| `processedEvents`          | () => `string`                                           |
| `reliabilityMetrics`       | () => `string`                                           |
| `tagAssignments`           | (`tag`: `string`) => `string`                            |
| `tempUserCandidates`       | (`userId`: `string`) => `string`                         |
| `tempUserExclude`          | (`userId`: `string`) => `string`                         |
| `tempUserFinal`            | (`userId`: `string`) => `string`                         |
| `userActivity`             | () => `string`                                           |
| `userAssignments`          | (`userId`: `string`) => `string`                         |
| `userRejected`             | (`userId`: `string`) => `string`                         |
| `users`                    | () => `string`                                           |
| `workflowAssignmentLink`   | (`assignmentId`: `string`) => `string`                   |
| `workflowAuditStream`      | () => `string`                                           |
| `workflowDefinition`       | (`id`: `string`) => `string`                             |
| `workflowDefinitions`      | () => `string`                                           |
| `workflowInstance`         | (`id`: `string`) => `string`                             |
| `workflowInstances`        | () => `string`                                           |
| `workflowInstancesActive`  | () => `string`                                           |
| `workflowInstancesByUser`  | (`userId`: `string`) => `string`                         |
| `workflowStepExpiry`       | (`instanceId`: `string`, `stepId`: `string`) => `string` |
| `workflowStepExpiryIndex`  | () => `string`                                           |

#### Defined in

[src/utils/keys.ts:13](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/keys.ts#L13)

---

### extractMatchFeatures

▸ **extractMatchFeatures**(`user`, `assignment`): [`LearningFeatures`](modules.md#learningfeatures)

Default feature extractor: tag matches, normalized skill weights,
tag-overlap ratio, and optional embedding similarity.

#### Parameters

| Name         | Type                                                                   |
| :----------- | :--------------------------------------------------------------------- |
| `user`       | [`User`](interfaces/User.md)                                           |
| `assignment` | [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md) |

#### Returns

[`LearningFeatures`](modules.md#learningfeatures)

#### Defined in

[src/learning/features.ts:33](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/learning/features.ts#L33)

---

### isIpInCidr

▸ **isIpInCidr**(`ip`, `cidr`): `boolean`

Check if an IP address is within a CIDR range

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `ip`   | `string` |
| `cidr` | `string` |

#### Returns

`boolean`

#### Defined in

[src/utils/cidr.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/cidr.ts#L119)

---

### linearWorkflow

▸ **linearWorkflow**(`id`, `name`, `steps`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

Create a simple linear workflow with automatic step chaining.

#### Parameters

| Name    | Type                                                                                                                                                                                                                                                                                                                                       | Description                  |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| `id`    | `string`                                                                                                                                                                                                                                                                                                                                   | Workflow ID                  |
| `name`  | `string`                                                                                                                                                                                                                                                                                                                                   | Workflow name                |
| `steps` | \{ `assignment`: `Partial`\<[`Assignment`](modules.md#assignment)\> ; `id`: `string` ; `machineTask?`: \{ `handler`: `string` ; `input?`: `Record`\<`string`, `any`\> } ; `name`: `string` ; `targetUser?`: `string` \| \{ `tag`: `string` } ; `taskType?`: [`WorkflowTaskType`](modules.md#workflowtasktype) ; `timeoutMs?`: `number` }[] | Array of step configurations |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-builder.ts:304](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/workflow-builder.ts#L304)

---

### normalizeWorkflowDefinition

▸ **normalizeWorkflowDefinition**(`definition`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Parameters

| Name         | Type                                                                                                                           |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `definition` | [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) \| [`WorkflowDefinitionInput`](interfaces/WorkflowDefinitionInput.md) |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-validation.ts:80](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/workflow-validation.ts#L80)

---

### parseCIDR

▸ **parseCIDR**(`cidr`): \{ `isIPv6`: `boolean` ; `network`: `bigint` ; `prefixLength`: `number` } \| `null`

Parse a CIDR notation string (e.g., '192.168.1.0/24' or '2001:db8::/32')
Returns { network: BigInt, prefixLength: number, isIPv6: boolean } or null

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `cidr` | `string` |

#### Returns

\{ `isIPv6`: `boolean` ; `network`: `bigint` ; `prefixLength`: `number` } \| `null`

#### Defined in

[src/utils/cidr.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/cidr.ts#L93)

---

### parseIP

▸ **parseIP**(`ip`): \{ `isIPv6`: `boolean` ; `value`: `bigint` } \| `null`

Parse an IP address (auto-detect IPv4 or IPv6)
Returns { value: BigInt, isIPv6: boolean } or null if invalid

#### Parameters

| Name | Type     |
| :--- | :------- |
| `ip` | `string` |

#### Returns

\{ `isIPv6`: `boolean` ; `value`: `bigint` } \| `null`

#### Defined in

[src/utils/cidr.ts:69](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/cidr.ts#L69)

---

### parseIPv4

▸ **parseIPv4**(`ip`): `bigint` \| `null`

Parse an IPv4 address into a BigInt representation

#### Parameters

| Name | Type     |
| :--- | :------- |
| `ip` | `string` |

#### Returns

`bigint` \| `null`

#### Defined in

[src/utils/cidr.ts:9](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/cidr.ts#L9)

---

### parseIPv6

▸ **parseIPv6**(`ip`): `bigint` \| `null`

Parse an IPv6 address into a BigInt representation
Handles full, compressed (::), and IPv4-mapped formats

#### Parameters

| Name | Type     |
| :--- | :------- |
| `ip` | `string` |

#### Returns

`bigint` \| `null`

#### Defined in

[src/utils/cidr.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/utils/cidr.ts#L26)

---

### synthesizeRoutingWeights

▸ **synthesizeRoutingWeights**(`stats`, `options?`, `knownTags?`, `existingWeights?`): `Record`\<`string`, `number`\>

Synthesize a routingWeights map from per-tag reward statistics.

#### Parameters

| Name               | Type                                                                   | Description                                                                                                                                                 |
| :----------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stats`            | [`LearningTagStat`](interfaces/LearningTagStat.md)[]                   | per-user tag reward statistics (from learned outcomes)                                                                                                      |
| `options?`         | [`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md) | UCB policy tuning (merged with defaults)                                                                                                                    |
| `knownTags?`       | `string`[]                                                             | optional tags to include even without observations; unobserved known tags receive the optimistic prior weight                                               |
| `existingWeights?` | `Record`\<`string`, `number`\>                                         | optional current routingWeights of the user; used as the per-tag prior for under-sampled or unobserved tags instead of the flat `priorWeight` when provided |

#### Returns

`Record`\<`string`, `number`\>

#### Defined in

[src/learning/auto-weights.ts:37](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/learning/auto-weights.ts#L37)

---

### validateWorkflowDefinition

▸ **validateWorkflowDefinition**(`definition`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Parameters

| Name         | Type                                                     |
| :----------- | :------------------------------------------------------- |
| `definition` | [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-validation.ts:30](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/workflow-validation.ts#L30)

---

### workflow

▸ **workflow**(`id`, `name`): [`WorkflowBuilder`](classes/WorkflowBuilder.md)

Convenience function to create a new workflow builder.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `id`   | `string` |
| `name` | `string` |

#### Returns

[`WorkflowBuilder`](classes/WorkflowBuilder.md)

#### Defined in

[src/workflow-builder.ts:294](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/workflow-builder.ts#L294)
