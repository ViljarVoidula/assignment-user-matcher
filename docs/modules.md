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
- [FairnessConfig](interfaces/FairnessConfig.md)
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
- [FairnessMode](modules.md#fairnessmode)
- [GeoMatchResult](modules.md#geomatchresult)
- [GeoMatchingFunction](modules.md#geomatchingfunction)
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

- [DEFAULT\_AUTO\_WEIGHTS\_OPTIONS](modules.md#default_auto_weights_options)

### Functions

- [approvalWorkflow](modules.md#approvalworkflow)
- [checkCidrMatch](modules.md#checkcidrmatch)
- [checkGeoMatch](modules.md#checkgeomatch)
- [cosineSimilarity](modules.md#cosinesimilarity)
- [createKeyBuilders](modules.md#createkeybuilders)
- [extractMatchFeatures](modules.md#extractmatchfeatures)
- [hasValidCoordinates](modules.md#hasvalidcoordinates)
- [haversineDistanceKm](modules.md#haversinedistancekm)
- [isIpInCidr](modules.md#isipincidr)
- [isValidLatitude](modules.md#isvalidlatitude)
- [isValidLongitude](modules.md#isvalidlongitude)
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

| Name | Type |
| :------ | :------ |
| `allowedCidrs?` | `string`[] |
| `id` | `string` |
| `latitude?` | `number` |
| `longitude?` | `number` |
| `maxDistanceKm?` | `number` |
| `priority?` | `number` |
| `requireGeo?` | `boolean` |
| `skillThresholds?` | `Record`\<`string`, `number`\> |
| `tags` | `string`[] |
| `vetoedUsers?` | `string`[] |

#### Defined in

[src/types/matcher.ts:22](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L22)

___

### AssignmentStatus

Ƭ **AssignmentStatus**: ``"queued"`` \| ``"pending"`` \| ``"accepted"``

#### Defined in

[src/queries/pagination.ts:6](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/queries/pagination.ts#L6)

___

### FairnessMode

Ƭ **FairnessMode**: ``"first-come"`` \| ``"best-match"`` \| ``"balanced"`` \| ``"spread-work"``

Bulk-matching fairness policy. See `MatcherOptions.fairness` for what each
value does.

#### Defined in

[src/types/matcher.ts:77](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L77)

___

### GeoMatchResult

Ƭ **GeoMatchResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `distanceKm?` | `number` |
| `effectiveMaxDistanceKm?` | `number` |
| `eligible` | `boolean` |

#### Defined in

[src/types/matcher.ts:47](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L47)

___

### GeoMatchingFunction

Ƭ **GeoMatchingFunction**: (`args`: \{ `assignment`: [`Assignment`](modules.md#assignment) ; `defaultMaxDistanceKm?`: `number` ; `user`: [`User`](interfaces/User.md)  }) => `Promise`\<[`GeoMatchResult`](modules.md#geomatchresult)\>

#### Type declaration

▸ (`args`): `Promise`\<[`GeoMatchResult`](modules.md#geomatchresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.assignment` | [`Assignment`](modules.md#assignment) |
| `args.defaultMaxDistanceKm?` | `number` |
| `args.user` | [`User`](interfaces/User.md) |

##### Returns

`Promise`\<[`GeoMatchResult`](modules.md#geomatchresult)\>

#### Defined in

[src/types/matcher.ts:53](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L53)

___

### KeyBuilders

Ƭ **KeyBuilders**: `ReturnType`\<typeof [`createKeyBuilders`](modules.md#createkeybuilders)\>

#### Defined in

[src/utils/keys.ts:90](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/keys.ts#L90)

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

[src/types/matcher.ts:611](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L611)

___

### LearningFeatures

Ƭ **LearningFeatures**: `Record`\<`string`, `number`\>

Sparse feature vector describing a user/assignment match context

#### Defined in

[src/types/matcher.ts:601](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L601)

___

### LearningOutcome

Ƭ **LearningOutcome**: ``"accept"`` \| ``"complete"`` \| ``"reject"`` \| ``"expire"`` \| ``"fail"``

Assignment lifecycle outcomes that generate learning rewards

#### Defined in

[src/types/matcher.ts:595](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L595)

___

### LearningRewards

Ƭ **LearningRewards**: `Record`\<[`LearningOutcome`](modules.md#learningoutcome), `number`\>

Reward values per lifecycle outcome

#### Defined in

[src/types/matcher.ts:598](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L598)

___

### LearningSignals

Ƭ **LearningSignals**: `Record`\<`string`, `number`\>

Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 })

#### Defined in

[src/types/matcher.ts:637](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L637)

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

[src/managers/WorkflowManager.ts:35](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/managers/WorkflowManager.ts#L35)

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
| `enableFairTiebreaker?` | `boolean` | Opt-in global best-match arbitration for bulk matching (default: false, preserving existing behavior). When `matchUsersAssignments()` is called with no userId, every eligible user is normally evaluated in parallel and independently claims every assignment they qualify for — when two or more users are eligible for the same assignment, whichever user's claim reaches Redis first wins, regardless of their relative score. With this enabled, candidates are instead collected across *all* users first, sorted by score descending, and claimed greedily in that order — so the best-fit eligible candidate wins each assignment deterministically. Uses plain weighted-tag/geo score (the same formula as the non-learning path) as the fairness comparator; the contextual-bandit learning layer, if enabled, still re-ranks each user's own accepted backlog ordering but does not influence which user wins a contested assignment in this mode. |
| `enableGeoMatching?` | `boolean` | Enable distance-based geolocation matching (default: false) |
| `enableGracefulDegradation?` | `boolean` | Enable graceful degradation mode when Redis is unavailable (default: false) |
| `enableLearning?` | `boolean` | Enable the contextual-bandit learning layer (default: false) |
| `enableOpenTelemetry?` | `boolean` | Enable OpenTelemetry tracing (default: false) |
| `enableReliabilityMetrics?` | `boolean` | Enable circuit breaker and reliability metrics (default: true when telemetry enabled) |
| `enableWorkflows?` | `boolean` | Enable workflow orchestration features |
| `fairness?` | [`FairnessMode`](modules.md#fairnessmode) | One-word fairness policy for bulk matching — the friendly alternative to tuning `enableFairTiebreaker` / `fairnessLoadPenalty` / `fairnessTieBand` by hand: - `'first-come'` (default): whoever's claim reaches Redis first wins a contested assignment — fastest, but the winner is arbitrary. - `'best-match'`: the highest-scoring eligible user wins every contested assignment, deterministically. - `'balanced'`: best match wins, but near-ties (scores within ~5% of the typical candidate score) go to whoever is carrying less work. - `'spread-work'`: work is spread as evenly as skills allow — each assignment already on someone's plate discounts their next bid by half the typical candidate score, so being good (and fast) doesn't mean drowning in work while capable teammates sit idle. The underlying numbers are derived automatically from the candidate scores of each matching pass, so there is nothing to calibrate. `'balanced'` and `'spread-work'` also include a rolling-window guardrail by default: nobody receives at more than double the team's average grant rate over `fairnessWindowMs` (one hour unless changed) — see `fairnessMaxPerWindow` to set an explicit ceiling instead, or pass `Infinity` there to opt out. Setting `fairnessLoadPenalty` / `fairnessTieBand` explicitly overrides the derived values; setting `fairness` overrides `enableFairTiebreaker`. Switchable at runtime via `setFairness(mode)`; every fairness knob (not just the mode) can be retuned live with `setFairnessConfig(config)`. |
| `fairnessLoadPenalty?` | `number` | Load-penalized scoring for fair-tiebreaker arbitration (default: 0, disabled; requires `enableFairTiebreaker`). Each assignment already on a user's backlog — including ones won earlier in the same matching pass — subtracts this amount from their effective score when competing for the next contested assignment. Pure best-score-wins arbitration otherwise saturates the top scorer to `maxUserBacklogSize` every pass; a penalty makes distribution progressive: the specialist still wins their first picks, but once loaded they lose marginal contests to an idle, still-capable candidate. Pick a value relative to your score scale (base priority + summed routing weights). |
| `fairnessMaxPerWindow?` | `number` | Hard cap on how many assignments a single user may be granted within a rolling time window (default: undefined, disabled; applies in any `fairness` mode other than `'first-come'`). The backlog cap alone can't protect diligent users: someone who accepts and completes work quickly keeps freeing backlog slots and keeps winning, so speed is rewarded with ever more work. This cap counts *granted* assignments over `fairnessWindowMs` regardless of how fast they were cleared; once a user hits it, contested assignments spill to the next-best eligible user (or stay queued) until the window rolls. Workflow-targeted assignments are direct handoffs and bypass the cap so workflows never stall. When left undefined, the `'balanced'` / `'spread-work'` presets supply a team-relative guardrail automatically: `max(maxUserBacklogSize, 2 x the team's average grants in the window)`, recomputed each pass, so it adapts to any deployment's volume without configuration. Set an explicit number to pin the ceiling, or `Infinity` to disable the window cap entirely. |
| `fairnessTieBand?` | `number` | Tie-band arbitration for fair-tiebreaker mode (default: 0, disabled; requires `enableFairTiebreaker`). Candidate scores falling in the same band-sized bucket (`floor(score / fairnessTieBand)`) are treated as tied, and the tie goes to the user currently carrying the least work. Scores in different buckets still resolve strictly by score, so clear skill differences always dominate — only near-ties get load-balanced. Note the bucket boundaries are fixed, so two scores less than a band apart can still straddle a boundary and resolve by score. |
| `fairnessWindowMs?` | `number` | Rolling window length in milliseconds for `fairnessMaxPerWindow` (default: 3600000 — one hour). |
| `geoDefaultMaxDistanceKm?` | `number` | Global fallback cap in kilometers when assignment/user-specific caps are absent |
| `geoMatchingFunction?` | [`GeoMatchingFunction`](modules.md#geomatchingfunction) | Custom geolocation matcher override |
| `geoScoreWeight?` | `number` | Proximity boost weight added to combined priority (default: 0) |
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

[src/types/matcher.ts:97](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L97)

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

[src/types/matcher.ts:65](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L65)

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

[src/types/matcher.ts:59](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L59)

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

[src/types/matcher.ts:334](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L334)

___

### WorkflowEventType

Ƭ **WorkflowEventType**: ``"STARTED"`` \| ``"COMPLETED"`` \| ``"REJECTED"`` \| ``"EXPIRED"`` \| ``"FAILED"``

Event types for workflow lifecycle

#### Defined in

[src/types/matcher.ts:352](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L352)

___

### WorkflowInstanceStatus

Ƭ **WorkflowInstanceStatus**: ``"active"`` \| ``"completed"`` \| ``"failed"`` \| ``"cancelled"``

Status of a workflow instance

#### Defined in

[src/types/matcher.ts:461](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L461)

___

### WorkflowTargetUser

Ƭ **WorkflowTargetUser**: ``"initiator"`` \| ``"previous"`` \| `string` \| \{ `tag`: `string`  }

Target user selector for workflow assignment steps

#### Defined in

[src/types/matcher.ts:358](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L358)

___

### WorkflowTaskType

Ƭ **WorkflowTaskType**: ``"assignment"`` \| ``"machine"``

Step execution mode

#### Defined in

[src/types/matcher.ts:355](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L355)

___

### options

Ƭ **options**: [`MatcherOptions`](modules.md#matcheroptions)

**`Deprecated`**

Use MatcherOptions instead

#### Defined in

[src/types/matcher.ts:331](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L331)

## Variables

### DEFAULT\_AUTO\_WEIGHTS\_OPTIONS

• `Const` **DEFAULT\_AUTO\_WEIGHTS\_OPTIONS**: `Required`\<`Omit`\<[`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md), ``"priorWeight"``\>\>

#### Defined in

[src/learning/auto-weights.ts:19](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/learning/auto-weights.ts#L19)

## Functions

### approvalWorkflow

▸ **approvalWorkflow**(`id`, `name`, `options`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

Create an approval workflow with submit -> review -> complete/rejected pattern.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |
| `options` | `Object` |
| `options.completeAssignment?` | `Partial`\<[`Assignment`](modules.md#assignment)\> |
| `options.rejectedAssignment?` | `Partial`\<[`Assignment`](modules.md#assignment)\> |
| `options.reviewAssignment` | `Partial`\<[`Assignment`](modules.md#assignment)\> |
| `options.reviewTimeoutMs?` | `number` |
| `options.reviewerTag?` | `string` |
| `options.submitAssignment` | `Partial`\<[`Assignment`](modules.md#assignment)\> |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-builder.ts:347](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L347)

___

### checkCidrMatch

▸ **checkCidrMatch**(`userIp`, `allowedCidrs`): `boolean`

Check if a user's IP matches any of the allowed CIDRs
Returns true if no CIDRs are specified (open assignment) or if IP matches any CIDR

#### Parameters

| Name | Type |
| :------ | :------ |
| `userIp` | `undefined` \| `string` |
| `allowedCidrs` | `undefined` \| `string`[] |

#### Returns

`boolean`

#### Defined in

[src/utils/cidr.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/cidr.ts#L139)

___

### checkGeoMatch

▸ **checkGeoMatch**(`user`, `assignment`, `options?`): [`GeoMatchResult`](modules.md#geomatchresult)

Check if a user-assignment pair is geo-eligible.

An assignment that never configured coordinates hasn't opted into geo
matching, so it stays open to all users (backward compatible). But once an
assignment does specify coordinates, a user with no location can't satisfy
that distance criterion and is denied by default - mirroring checkCidrMatch's
"restriction present, matching data missing -> deny". requireGeo remains as
an explicit, redundant-but-safe way to force denial in that case.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](interfaces/User.md) |
| `assignment` | [`Assignment`](modules.md#assignment) |
| `options?` | `Object` |
| `options.defaultMaxDistanceKm?` | `number` |
| `options.enabled?` | `boolean` |

#### Returns

[`GeoMatchResult`](modules.md#geomatchresult)

#### Defined in

[src/utils/geo.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/geo.ts#L49)

___

### cosineSimilarity

▸ **cosineSimilarity**(`a`, `b`): `number`

Cosine similarity between two numeric vectors.
Returns 0 for mismatched lengths or zero-magnitude vectors.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number`[] |
| `b` | `number`[] |

#### Returns

`number`

#### Defined in

[src/learning/features.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/learning/features.ts#L15)

___

### createKeyBuilders

▸ **createKeyBuilders**(`config`): `Object`

Creates Redis key builder functions with a given prefix

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`RedisKeyConfig`](interfaces/RedisKeyConfig.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `acceptedAssignments` | () => `string` |
| `allTags` | () => `string` |
| `assignmentOwner` | () => `string` |
| `assignmentPriority` | (`id`: `string`) => `string` |
| `assignmentTags` | (`id`: `string`) => `string` |
| `assignmentVetoed` | (`id`: `string`) => `string` |
| `assignments` | () => `string` |
| `assignmentsGeo` | () => `string` |
| `assignmentsRef` | () => `string` |
| `circuitBreakerFailures` | () => `string` |
| `circuitBreakerState` | () => `string` |
| `completedAssignments` | () => `string` |
| `deadLetterQueue` | () => `string` |
| `eventRetryCount` | (`eventId`: `string`) => `string` |
| `eventStream` | () => `string` |
| `eventStreamDeadLetter` | () => `string` |
| `eventsRetryScheduled` | () => `string` |
| `learningDecision` | (`assignmentId`: `string`) => `string` |
| `learningEpisode` | (`assignmentId`: `string`) => `string` |
| `learningModel` | () => `string` |
| `learningStats` | () => `string` |
| `learningUserTagCounts` | (`userId`: `string`) => `string` |
| `learningUserTagRewards` | (`userId`: `string`) => `string` |
| `learningUsers` | () => `string` |
| `pendingAssignmentsData` | () => `string` |
| `pendingAssignmentsExpiry` | () => `string` |
| `processedEvent` | (`eventId`: `string`) => `string` |
| `processedEvents` | () => `string` |
| `reliabilityMetrics` | () => `string` |
| `tagAssignments` | (`tag`: `string`) => `string` |
| `tempUserCandidates` | (`userId`: `string`) => `string` |
| `tempUserExclude` | (`userId`: `string`) => `string` |
| `tempUserFinal` | (`userId`: `string`) => `string` |
| `userActivity` | () => `string` |
| `userAssignments` | (`userId`: `string`) => `string` |
| `userRejected` | (`userId`: `string`) => `string` |
| `userVetoed` | (`userId`: `string`) => `string` |
| `userWindowGrants` | (`userId`: `string`) => `string` |
| `users` | () => `string` |
| `workflowAssignmentLink` | (`assignmentId`: `string`) => `string` |
| `workflowAuditStream` | () => `string` |
| `workflowDefinition` | (`id`: `string`) => `string` |
| `workflowDefinitions` | () => `string` |
| `workflowInstance` | (`id`: `string`) => `string` |
| `workflowInstances` | () => `string` |
| `workflowInstancesActive` | () => `string` |
| `workflowInstancesByUser` | (`userId`: `string`) => `string` |
| `workflowStepExpiry` | (`instanceId`: `string`, `stepId`: `string`) => `string` |
| `workflowStepExpiryIndex` | () => `string` |

#### Defined in

[src/utils/keys.ts:13](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/keys.ts#L13)

___

### extractMatchFeatures

▸ **extractMatchFeatures**(`user`, `assignment`): [`LearningFeatures`](modules.md#learningfeatures)

Default feature extractor: tag matches, normalized skill weights,
tag-overlap ratio, and optional embedding similarity.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](interfaces/User.md) |
| `assignment` | [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md) |

#### Returns

[`LearningFeatures`](modules.md#learningfeatures)

#### Defined in

[src/learning/features.ts:33](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/learning/features.ts#L33)

___

### hasValidCoordinates

▸ **hasValidCoordinates**(`latitude`, `longitude`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `latitude` | `unknown` |
| `longitude` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/utils/geo.ts:23](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/geo.ts#L23)

___

### haversineDistanceKm

▸ **haversineDistanceKm**(`lat1`, `lon1`, `lat2`, `lon2`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lat1` | `number` |
| `lon1` | `number` |
| `lat2` | `number` |
| `lon2` | `number` |

#### Returns

`number`

#### Defined in

[src/utils/geo.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/geo.ts#L27)

___

### isIpInCidr

▸ **isIpInCidr**(`ip`, `cidr`): `boolean`

Check if an IP address is within a CIDR range

#### Parameters

| Name | Type |
| :------ | :------ |
| `ip` | `string` |
| `cidr` | `string` |

#### Returns

`boolean`

#### Defined in

[src/utils/cidr.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/cidr.ts#L119)

___

### isValidLatitude

▸ **isValidLatitude**(`value`): value is number

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

value is number

#### Defined in

[src/utils/geo.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/geo.ts#L15)

___

### isValidLongitude

▸ **isValidLongitude**(`value`): value is number

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

value is number

#### Defined in

[src/utils/geo.ts:19](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/geo.ts#L19)

___

### linearWorkflow

▸ **linearWorkflow**(`id`, `name`, `steps`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

Create a simple linear workflow with automatic step chaining.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Workflow ID |
| `name` | `string` | Workflow name |
| `steps` | \{ `assignment`: `Partial`\<[`Assignment`](modules.md#assignment)\> ; `id`: `string` ; `machineTask?`: \{ `handler`: `string` ; `input?`: `Record`\<`string`, `any`\>  } ; `name`: `string` ; `targetUser?`: `string` \| \{ `tag`: `string`  } ; `taskType?`: [`WorkflowTaskType`](modules.md#workflowtasktype) ; `timeoutMs?`: `number`  }[] | Array of step configurations |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-builder.ts:304](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L304)

___

### normalizeWorkflowDefinition

▸ **normalizeWorkflowDefinition**(`definition`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) \| [`WorkflowDefinitionInput`](interfaces/WorkflowDefinitionInput.md) |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-validation.ts:80](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-validation.ts#L80)

___

### parseCIDR

▸ **parseCIDR**(`cidr`): \{ `isIPv6`: `boolean` ; `network`: `bigint` ; `prefixLength`: `number`  } \| ``null``

Parse a CIDR notation string (e.g., '192.168.1.0/24' or '2001:db8::/32')
Returns { network: BigInt, prefixLength: number, isIPv6: boolean } or null

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidr` | `string` |

#### Returns

\{ `isIPv6`: `boolean` ; `network`: `bigint` ; `prefixLength`: `number`  } \| ``null``

#### Defined in

[src/utils/cidr.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/cidr.ts#L93)

___

### parseIP

▸ **parseIP**(`ip`): \{ `isIPv6`: `boolean` ; `value`: `bigint`  } \| ``null``

Parse an IP address (auto-detect IPv4 or IPv6)
Returns { value: BigInt, isIPv6: boolean } or null if invalid

#### Parameters

| Name | Type |
| :------ | :------ |
| `ip` | `string` |

#### Returns

\{ `isIPv6`: `boolean` ; `value`: `bigint`  } \| ``null``

#### Defined in

[src/utils/cidr.ts:69](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/cidr.ts#L69)

___

### parseIPv4

▸ **parseIPv4**(`ip`): `bigint` \| ``null``

Parse an IPv4 address into a BigInt representation

#### Parameters

| Name | Type |
| :------ | :------ |
| `ip` | `string` |

#### Returns

`bigint` \| ``null``

#### Defined in

[src/utils/cidr.ts:9](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/cidr.ts#L9)

___

### parseIPv6

▸ **parseIPv6**(`ip`): `bigint` \| ``null``

Parse an IPv6 address into a BigInt representation
Handles full, compressed (::), and IPv4-mapped formats

#### Parameters

| Name | Type |
| :------ | :------ |
| `ip` | `string` |

#### Returns

`bigint` \| ``null``

#### Defined in

[src/utils/cidr.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/utils/cidr.ts#L26)

___

### synthesizeRoutingWeights

▸ **synthesizeRoutingWeights**(`stats`, `options?`, `knownTags?`, `existingWeights?`): `Record`\<`string`, `number`\>

Synthesize a routingWeights map from per-tag reward statistics.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stats` | [`LearningTagStat`](interfaces/LearningTagStat.md)[] | per-user tag reward statistics (from learned outcomes) |
| `options?` | [`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md) | UCB policy tuning (merged with defaults) |
| `knownTags?` | `string`[] | optional tags to include even without observations; unobserved known tags receive the optimistic prior weight |
| `existingWeights?` | `Record`\<`string`, `number`\> | optional current routingWeights of the user; used as the per-tag prior for under-sampled or unobserved tags instead of the flat `priorWeight` when provided |

#### Returns

`Record`\<`string`, `number`\>

#### Defined in

[src/learning/auto-weights.ts:37](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/learning/auto-weights.ts#L37)

___

### validateWorkflowDefinition

▸ **validateWorkflowDefinition**(`definition`): [`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`WorkflowDefinition`](interfaces/WorkflowDefinition.md) |

#### Returns

[`WorkflowDefinition`](interfaces/WorkflowDefinition.md)

#### Defined in

[src/workflow-validation.ts:30](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-validation.ts#L30)

___

### workflow

▸ **workflow**(`id`, `name`): [`WorkflowBuilder`](classes/WorkflowBuilder.md)

Convenience function to create a new workflow builder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |

#### Returns

[`WorkflowBuilder`](classes/WorkflowBuilder.md)

#### Defined in

[src/workflow-builder.ts:294](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L294)
