[assignment-user-matcher](README.md) / Exports

# assignment-user-matcher

## Table of contents

### References

- [default](modules.md#default)

### Classes

- [AssignmentMatcher](classes/AssignmentMatcher.md)
- [PeriodClock](classes/PeriodClock.md)
- [ScheduleValidationError](classes/ScheduleValidationError.md)
- [ShiftScheduler](classes/ShiftScheduler.md)
- [WorkflowBuilder](classes/WorkflowBuilder.md)
- [WorkflowStepBuilder](classes/WorkflowStepBuilder.md)

### Interfaces

- [AssignmentCounts](interfaces/AssignmentCounts.md)
- [AssignmentLintContext](interfaces/AssignmentLintContext.md)
- [AssignmentLintIssue](interfaces/AssignmentLintIssue.md)
- [AssignmentPair](interfaces/AssignmentPair.md)
- [AssignmentReadinessReport](interfaces/AssignmentReadinessReport.md)
- [AssignmentResult](interfaces/AssignmentResult.md)
- [AuditEntry](interfaces/AuditEntry.md)
- [AutoRoutingWeightsOptions](interfaces/AutoRoutingWeightsOptions.md)
- [AvailabilityRule](interfaces/AvailabilityRule.md)
- [CircuitBreakerState](interfaces/CircuitBreakerState.md)
- [ComplianceReport](interfaces/ComplianceReport.md)
- [ConstraintOptions](interfaces/ConstraintOptions.md)
- [ConstraintViolation](interfaces/ConstraintViolation.md)
- [DailyRestRule](interfaces/DailyRestRule.md)
- [DeadLetterEntry](interfaces/DeadLetterEntry.md)
- [DecisionTraceQuery](interfaces/DecisionTraceQuery.md)
- [DutyClassification](interfaces/DutyClassification.md)
- [DutyQuota](interfaces/DutyQuota.md)
- [Employee](interfaces/Employee.md)
- [EscalationPolicy](interfaces/EscalationPolicy.md)
- [FairnessConfig](interfaces/FairnessConfig.md)
- [HistoricalAssignment](interfaces/HistoricalAssignment.md)
- [InfeasibilityReport](interfaces/InfeasibilityReport.md)
- [LearningAssignmentContext](interfaces/LearningAssignmentContext.md)
- [LearningDecisionRecord](interfaces/LearningDecisionRecord.md)
- [LearningEpisodeRecord](interfaces/LearningEpisodeRecord.md)
- [LearningSample](interfaces/LearningSample.md)
- [LearningStats](interfaces/LearningStats.md)
- [LearningTagStat](interfaces/LearningTagStat.md)
- [LedgerEntry](interfaces/LedgerEntry.md)
- [MatchCandidateTrace](interfaces/MatchCandidateTrace.md)
- [MatchDecisionTrace](interfaces/MatchDecisionTrace.md)
- [MatchExplanation](interfaces/MatchExplanation.md)
- [MatchPreview](interfaces/MatchPreview.md)
- [MatchPreviewInput](interfaces/MatchPreviewInput.md)
- [MatchScoreExplanation](interfaces/MatchScoreExplanation.md)
- [ModelContext](interfaces/ModelContext.md)
- [NightWorkRule](interfaces/NightWorkRule.md)
- [ObjectiveWeights](interfaces/ObjectiveWeights.md)
- [OvertimeRule](interfaces/OvertimeRule.md)
- [PaginationOptions](interfaces/PaginationOptions.md)
- [PaginationResult](interfaces/PaginationResult.md)
- [ParallelBranchState](interfaces/ParallelBranchState.md)
- [QueueAuditEntry](interfaces/QueueAuditEntry.md)
- [QueueAuditOptions](interfaces/QueueAuditOptions.md)
- [QueueAuditReport](interfaces/QueueAuditReport.md)
- [RedisKeyConfig](interfaces/RedisKeyConfig.md)
- [ReliabilityMetrics](interfaces/ReliabilityMetrics.md)
- [RepairCandidate](interfaces/RepairCandidate.md)
- [RepairResult](interfaces/RepairResult.md)
- [RuleVerdict](interfaces/RuleVerdict.md)
- [ScheduleInput](interfaces/ScheduleInput.md)
- [SchedulePolicy](interfaces/SchedulePolicy.md)
- [ScheduleResult](interfaces/ScheduleResult.md)
- [ScheduledAssignment](interfaces/ScheduledAssignment.md)
- [SchedulingConstraint](interfaces/SchedulingConstraint.md)
- [SearchState](interfaces/SearchState.md)
- [ShiftInstance](interfaces/ShiftInstance.md)
- [ShiftTemplate](interfaces/ShiftTemplate.md)
- [SlaPolicy](interfaces/SlaPolicy.md)
- [SlaStats](interfaces/SlaStats.md)
- [TimeOffEntry](interfaces/TimeOffEntry.md)
- [User](interfaces/User.md)
- [WeeklyRestRule](interfaces/WeeklyRestRule.md)
- [WorkflowDefinition](interfaces/WorkflowDefinition.md)
- [WorkflowDefinitionInput](interfaces/WorkflowDefinitionInput.md)
- [WorkflowDefinitionSummary](interfaces/WorkflowDefinitionSummary.md)
- [WorkflowEvent](interfaces/WorkflowEvent.md)
- [WorkflowExternalTask](interfaces/WorkflowExternalTask.md)
- [WorkflowHost](interfaces/WorkflowHost.md)
- [WorkflowInstance](interfaces/WorkflowInstance.md)
- [WorkflowInstancePage](interfaces/WorkflowInstancePage.md)
- [WorkflowInstanceQuery](interfaces/WorkflowInstanceQuery.md)
- [WorkflowInstanceWithSnapshot](interfaces/WorkflowInstanceWithSnapshot.md)
- [WorkflowMachineTask](interfaces/WorkflowMachineTask.md)
- [WorkflowRouting](interfaces/WorkflowRouting.md)
- [WorkflowStep](interfaces/WorkflowStep.md)
- [WorkingTimeLimits](interfaces/WorkingTimeLimits.md)
- [WorkingTimeRules](interfaces/WorkingTimeRules.md)

### Type Aliases

- [Assignment](modules.md#assignment)
- [AssignmentLifecycleEvent](modules.md#assignmentlifecycleevent)
- [AssignmentStatus](modules.md#assignmentstatus)
- [AutoRoutingWeightsPolicy](modules.md#autoroutingweightspolicy)
- [CompletionDeadlineSweepResult](modules.md#completiondeadlinesweepresult)
- [Disruption](modules.md#disruption)
- [EscalationSweepResult](modules.md#escalationsweepresult)
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
- [MaintenanceOptions](modules.md#maintenanceoptions)
- [MaintenanceReport](modules.md#maintenancereport)
- [MatchDecisionMode](modules.md#matchdecisionmode)
- [MatchTraceReason](modules.md#matchtracereason)
- [MatcherOptions](modules.md#matcheroptions)
- [PendingAssignmentInfo](modules.md#pendingassignmentinfo)
- [QueueStats](modules.md#queuestats)
- [ScheduleSweepResult](modules.md#schedulesweepresult)
- [Severity](modules.md#severity)
- [SlaExpirySweepResult](modules.md#slaexpirysweepresult)
- [Stats](modules.md#stats)
- [UserLoadInfo](modules.md#userloadinfo)
- [WorkflowEngineMetrics](modules.md#workflowenginemetrics)
- [WorkflowEventType](modules.md#workfloweventtype)
- [WorkflowInstanceStatus](modules.md#workflowinstancestatus)
- [WorkflowTargetUser](modules.md#workflowtargetuser)
- [WorkflowTaskType](modules.md#workflowtasktype)
- [WorkflowTransition](modules.md#workflowtransition)
- [options](modules.md#options)

### Variables

- [DEFAULT_AUTO_WEIGHTS_OPTIONS](modules.md#default_auto_weights_options)
- [DEFAULT_MIN_REST_MINUTES](modules.md#default_min_rest_minutes)

### Functions

- [approvalWorkflow](modules.md#approvalworkflow)
- [checkCidrMatch](modules.md#checkcidrmatch)
- [checkCompliance](modules.md#checkcompliance)
- [checkGeoMatch](modules.md#checkgeomatch)
- [cosineSimilarity](modules.md#cosinesimilarity)
- [createKeyBuilders](modules.md#createkeybuilders)
- [days](modules.md#days)
- [diagnoseInfeasibility](modules.md#diagnoseinfeasibility)
- [explainCandidate](modules.md#explaincandidate)
- [explainMatchScore](modules.md#explainmatchscore)
- [extractMatchFeatures](modules.md#extractmatchfeatures)
- [hasValidCoordinates](modules.md#hasvalidcoordinates)
- [haversineDistanceKm](modules.md#haversinedistancekm)
- [hours](modules.md#hours)
- [isIpInCidr](modules.md#isipincidr)
- [isValidLatitude](modules.md#isvalidlatitude)
- [isValidLongitude](modules.md#isvalidlongitude)
- [linearWorkflow](modules.md#linearworkflow)
- [lintAssignment](modules.md#lintassignment)
- [normalizeWorkflowDefinition](modules.md#normalizeworkflowdefinition)
- [parseCIDR](modules.md#parsecidr)
- [parseIP](modules.md#parseip)
- [parseIPv4](modules.md#parseipv4)
- [parseIPv6](modules.md#parseipv6)
- [rankCandidates](modules.md#rankcandidates)
- [repairSchedule](modules.md#repairschedule)
- [solveSchedule](modules.md#solveschedule)
- [synthesizeRoutingWeights](modules.md#synthesizeroutingweights)
- [userCoversTag](modules.md#usercoverstag)
- [validateWorkflowDefinition](modules.md#validateworkflowdefinition)
- [weeklyAverageOver](modules.md#weeklyaverageover)
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

| Name               | Type                                                 |
| :----------------- | :--------------------------------------------------- |
| `allowedCidrs?`    | `string`[]                                           |
| `escalation?`      | [`EscalationPolicy`](interfaces/EscalationPolicy.md) |
| `id`               | `string`                                             |
| `latitude?`        | `number`                                             |
| `longitude?`       | `number`                                             |
| `maxDistanceKm?`   | `number`                                             |
| `priority?`        | `number`                                             |
| `requireGeo?`      | `boolean`                                            |
| `schedule?`        | [`SchedulePolicy`](interfaces/SchedulePolicy.md)     |
| `skillThresholds?` | `Record`\<`string`, `number`\>                       |
| `sla?`             | [`SlaPolicy`](interfaces/SlaPolicy.md)               |
| `tags`             | `string`[]                                           |
| `vetoedUsers?`     | `string`[]                                           |

#### Defined in

[src/types/matcher.ts:33](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L33)

---

### AssignmentLifecycleEvent

Ƭ **AssignmentLifecycleEvent**: \{ `expiresAt`: `number` ; `kind`: `"pending"` ; `matchedAt`: `number` ; `taskId`: `string` ; `workerId`: `string` } \| \{ `expiredAt`: `number` ; `kind`: `"expired"` ; `taskId`: `string` ; `workerId`: `string` \| `null` } \| \{ `kind`: `"released"` ; `reason`: `"idle"` \| `"operator"` ; `releasedAt`: `number` ; `taskId`: `string` ; `workerId`: `string` } \| \{ `acceptedAt`: `number` ; `kind`: `"accepted"` ; `taskId`: `string` ; `workerId`: `string` } \| \{ `kind`: `"rejected"` ; `rejectedAt`: `number` ; `taskId`: `string` ; `workerId`: `string` } \| \{ `completedAt`: `number` ; `kind`: `"completed"` ; `taskId`: `string` ; `workerId`: `string` } \| \{ `failedAt`: `number` ; `kind`: `"failed"` ; `reason?`: `string` ; `taskId`: `string` ; `workerId`: `string` } \| \{ `blockedPreviousOwner`: `boolean` ; `escalatedAt`: `number` ; `fromWorkerId`: `string` \| `null` ; `kind`: `"escalated"` ; `level`: `number` ; `reason`: `"no-response"` ; `taskId`: `string` } \| \{ `at`: `number` ; `kind`: `"escalationExhausted"` ; `level`: `number` ; `parked`: `boolean` ; `taskId`: `string` } \| \{ `action`: `"notify"` \| `"requeue"` \| `"fail"` \| `"park"` ; `assignment`: [`Assignment`](modules.md#assignment) ; `at`: `number` ; `kind`: `"completionBreached"` ; `taskId`: `string` ; `workerId`: `string` \| `null` } \| \{ `action`: `"drop"` \| `"park"` ; `assignment`: [`Assignment`](modules.md#assignment) ; `at`: `number` ; `kind`: `"slaExpired"` ; `ownerId`: `string` \| `null` ; `taskId`: `string` } \| \{ `action`: `"park"` \| `"fail"` ; `assignment`: [`Assignment`](modules.md#assignment) ; `at`: `number` ; `kind`: `"rejectionBudgetExhausted"` ; `rejections`: `number` ; `taskId`: `string` } \| \{ `at`: `number` ; `kind`: `"scheduleActivated"` ; `taskId`: `string` } \| \{ `action`: `"park"` \| `"drop"` ; `assignment`: [`Assignment`](modules.md#assignment) ; `at`: `number` ; `kind`: `"scheduleMissed"` ; `ownerId`: `string` \| `null` ; `state`: `"scheduled"` \| `"queued"` \| `"pending"` ; `taskId`: `string` }

#### Defined in

[src/types/matcher.ts:598](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L598)

---

### AssignmentStatus

Ƭ **AssignmentStatus**: `"queued"` \| `"pending"` \| `"accepted"`

#### Defined in

[src/queries/pagination.ts:6](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L6)

---

### AutoRoutingWeightsPolicy

Ƭ **AutoRoutingWeightsPolicy**: `"ucb1"` \| `"confidence"` \| `"thompson"`

Synthesis policy for automatic routing weights.

#### Defined in

[src/types/matcher.ts:1490](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1490)

---

### CompletionDeadlineSweepResult

Ƭ **CompletionDeadlineSweepResult**: `Object`

Outcome of one `processCompletionDeadlines()` sweep.

#### Type declaration

| Name       | Type     | Description                                            |
| :--------- | :------- | :----------------------------------------------------- |
| `breached` | `number` | Accepted assignments whose completion deadline elapsed |

#### Defined in

[src/types/matcher.ts:714](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L714)

---

### Disruption

Ƭ **Disruption**: \{ `employeeId`: `string` ; `from`: `string` ; `kind`: `"absence"` ; `to?`: `string` } \| \{ `employeeId`: `string` ; `kind`: `"noShow"` ; `shiftInstanceId`: `string` } \| \{ `kind`: `"cancelShift"` ; `shiftInstanceId`: `string` }

#### Defined in

[src/scheduling/operations.ts:137](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L137)

---

### EscalationSweepResult

Ƭ **EscalationSweepResult**: `Object`

Outcome of one `processResponseDeadlines()` sweep.

#### Type declaration

| Name          | Type     | Description                                                  |
| :------------ | :------- | :----------------------------------------------------------- |
| `escalations` | `number` | How many of those an escalation policy moved to the next hop |
| `expired`     | `number` | Pending assignments whose response deadline elapsed          |
| `parked`      | `number` | How many exhausted their ladder and were parked              |

#### Defined in

[src/types/matcher.ts:704](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L704)

---

### FairnessMode

Ƭ **FairnessMode**: `"first-come"` \| `"best-match"` \| `"balanced"` \| `"spread-work"`

Bulk-matching fairness policy. See `MatcherOptions.fairness` for what each
value does.

#### Defined in

[src/types/matcher.ts:347](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L347)

---

### GeoMatchResult

Ƭ **GeoMatchResult**: `Object`

#### Type declaration

| Name                      | Type      |
| :------------------------ | :-------- |
| `distanceKm?`             | `number`  |
| `effectiveMaxDistanceKm?` | `number`  |
| `eligible`                | `boolean` |

#### Defined in

[src/types/matcher.ts:291](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L291)

---

### GeoMatchingFunction

Ƭ **GeoMatchingFunction**: (`args`: \{ `assignment`: [`Assignment`](modules.md#assignment) ; `defaultMaxDistanceKm?`: `number` ; `user`: [`User`](interfaces/User.md) }) => `Promise`\<[`GeoMatchResult`](modules.md#geomatchresult)\>

#### Type declaration

▸ (`args`): `Promise`\<[`GeoMatchResult`](modules.md#geomatchresult)\>

##### Parameters

| Name                         | Type                                  |
| :--------------------------- | :------------------------------------ |
| `args`                       | `Object`                              |
| `args.assignment`            | [`Assignment`](modules.md#assignment) |
| `args.defaultMaxDistanceKm?` | `number`                              |
| `args.user`                  | [`User`](interfaces/User.md)          |

##### Returns

`Promise`\<[`GeoMatchResult`](modules.md#geomatchresult)\>

#### Defined in

[src/types/matcher.ts:297](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L297)

---

### KeyBuilders

Ƭ **KeyBuilders**: `ReturnType`\<typeof [`createKeyBuilders`](modules.md#createkeybuilders)\>

#### Defined in

[src/utils/keys.ts:142](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/keys.ts#L142)

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

[src/types/matcher.ts:1436](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1436)

---

### LearningFeatures

Ƭ **LearningFeatures**: `Record`\<`string`, `number`\>

Sparse feature vector describing a user/assignment match context

#### Defined in

[src/types/matcher.ts:1426](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1426)

---

### LearningOutcome

Ƭ **LearningOutcome**: `"accept"` \| `"complete"` \| `"reject"` \| `"expire"` \| `"fail"`

Assignment lifecycle outcomes that generate learning rewards

#### Defined in

[src/types/matcher.ts:1420](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1420)

---

### LearningRewards

Ƭ **LearningRewards**: `Record`\<[`LearningOutcome`](modules.md#learningoutcome), `number`\>

Reward values per lifecycle outcome

#### Defined in

[src/types/matcher.ts:1423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1423)

---

### LearningSignals

Ƭ **LearningSignals**: `Record`\<`string`, `number`\>

Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 })

#### Defined in

[src/types/matcher.ts:1462](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1462)

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

[src/managers/WorkflowManager.ts:42](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/managers/WorkflowManager.ts#L42)

---

### MaintenanceOptions

Ƭ **MaintenanceOptions**: `Object`

Which sweeps `startMaintenance()` runs, and how often.

#### Type declaration

| Name                    | Type      | Description                                                                        |
| :---------------------- | :-------- | :--------------------------------------------------------------------------------- |
| `completionDeadlines?`  | `boolean` | Completion deadlines (SLA `completeWithinMs`). **`Default`** `ts true `            |
| `idleUsers?`            | `boolean` | Idle-user release. **`Default`** true when `idleUserTimeoutMs` is set              |
| `intervalMs?`           | `number`  | Master tick interval for every enabled sweep. **`Default`** `ts 5000 `             |
| `responseDeadlines?`    | `boolean` | Response deadlines / escalation. **`Default`** `ts true `                          |
| `scheduled?`            | `boolean` | Scheduled-assignment activations and offer-window misses. **`Default`** `ts true ` |
| `slaExpiries?`          | `boolean` | Freshness TTL expiries (SLA `expireAfterMs`). **`Default`** `ts true `             |
| `workflowStepTimeouts?` | `boolean` | Workflow step timeouts. **`Default`** true when `enableWorkflows`                  |

#### Defined in

[src/types/matcher.ts:758](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L758)

---

### MaintenanceReport

Ƭ **MaintenanceReport**: `Object`

One pass of `runMaintenanceOnce()`. Counts are per pass, not cumulative.

#### Type declaration

| Name                  | Type     | Description                                                  |
| :-------------------- | :------- | :----------------------------------------------------------- |
| `completionBreaches`  | `number` | Accepted assignments whose completion deadline elapsed (SLA) |
| `escalations`         | `number` | How many of those an escalation policy moved on              |
| `expiredMatches`      | `number` | Pending assignments whose response deadline elapsed          |
| `expiredSteps`        | `number` | Workflow steps whose timeout fired                           |
| `parked`              | `number` | How many exhausted their ladder and were parked              |
| `releasedIdleUsers`   | `number` | Idle users removed from the pool (see `idleUserTimeoutMs`)   |
| `scheduleActivations` | `number` | Held assignments enqueued by the scheduled sweep             |
| `scheduleMisses`      | `number` | Assignments whose offer window (`schedule.notAfter`) elapsed |
| `slaExpiries`         | `number` | Assignments whose freshness TTL elapsed (SLA)                |
| `tookMs`              | `number` | Wall-clock duration of the pass                              |

#### Defined in

[src/types/matcher.ts:734](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L734)

---

### MatchDecisionMode

Ƭ **MatchDecisionMode**: [`FairnessMode`](modules.md#fairnessmode) \| `"direct"` \| `"workflow"` \| `"manual"`

How the winning user of a decision was arbitrated.

#### Defined in

[src/types/matcher.ts:432](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L432)

---

### MatchTraceReason

Ƭ **MatchTraceReason**: \{ `kind`: `"tagWeight"` ; `pattern?`: `string` ; `tag`: `string` ; `weight`: `number` } \| \{ `kind`: `"defaultTag"` ; `weight`: `number` } \| \{ `kind`: `"tagOverlap"` ; `matchedTags`: `string`[] ; `overlapRatio`: `number` } \| \{ `kind`: `"customScore"` ; `score`: `number` } \| \{ `kind`: `"veto"` ; `pattern`: `string` ; `source?`: `"manual"` \| `"learned"` ; `tag`: `string` } \| \{ `kind`: `"assignmentVeto"` } \| \{ `kind`: `"rejectedPreviously"` } \| \{ `kind`: `"noPositiveWeights"` } \| \{ `actual`: `number` ; `kind`: `"skillThreshold"` ; `required`: `number` ; `skill`: `string` } \| \{ `ip?`: `string` ; `kind`: `"cidrMismatch"` } \| \{ `distanceKm?`: `number` ; `kind`: `"geoDistance"` ; `maxDistanceKm?`: `number` ; `withinRange`: `boolean` } \| \{ `boost`: `number` ; `kind`: `"geoBoost"` } \| \{ `backlog`: `number` ; `kind`: `"backlogFull"` ; `limit`: `number` } \| \{ `kind`: `"paused"` } \| \{ `boost`: `number` ; `kind`: `"learningBoost"` ; `predicted`: `number` ; `shadowMode`: `boolean` } \| \{ `kind`: `"workflowTargeted"` } \| \{ `force`: `boolean` ; `kind`: `"manualAssignment"` ; `previousOwnerId`: `string` \| `null` }

One factor that contributed to (or excluded) a candidate in a routing
decision. Discriminated on `kind` so consumers can render/aggregate without
string parsing. Positive factors carry their contribution; exclusions carry
the rule that fired and the values it compared.

#### Defined in

[src/types/matcher.ts:377](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L377)

---

### MatcherOptions

Ƭ **MatcherOptions**: `Object`

#### Type declaration

| Name                                | Type                                                                                                                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoRoutingWeights?`               | [`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md)                                                                                                                                                             | Tuning for automatic routing-weight synthesis (UCB1 policy)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `autoRoutingWeightsSyncIntervalMs?` | `number`                                                                                                                                                                                                                           | Milliseconds between automatic learned routing-weight syncs for all tracked users. When unset (default), sync remains operator-driven. Set on at most one replica per deployment; a Redis lock prevents overlapping runs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `circuitBreakerPersistState?`       | `boolean`                                                                                                                                                                                                                          | Persist circuit breaker state to Redis for distributed awareness (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `circuitBreakerShared?`             | `boolean`                                                                                                                                                                                                                          | Share circuit breaker failure counts across replicas via Redis so breakers converge in multi-orchestrator deployments (default: false).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `deadLetterQueueAlertThreshold?`    | `number`                                                                                                                                                                                                                           | Alert threshold for Dead Letter Queue size (default: 100)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `decisionTraceMaxCandidates?`       | `number`                                                                                                                                                                                                                           | Maximum candidates stored per trace (default: 25). The chosen candidate is always kept; remaining slots go to the highest-ranked candidates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `decisionTraceMaxEntries?`          | `number`                                                                                                                                                                                                                           | Maximum decision traces retained in the Redis stream (default: 1000, approximate trim)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `enableAutoRoutingWeights?`         | `boolean`                                                                                                                                                                                                                          | Track per-user, per-tag reward statistics and enable automatic routingWeights generation from RL outcomes (requires enableLearning). Default: false.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `enableDecisionTraces?`             | `boolean`                                                                                                                                                                                                                          | Persist an auditable decision trace for every routing decision (default: false). Each matched assignment gets a `MatchDecisionTrace` — winner, arbitration mode, and every evaluated candidate with score breakdown and exclusion reasons — appended to a capped Redis stream and queryable via `getDecisionTraces()`. Capture happens during the matching pass itself, so the record reflects what the engine actually did rather than a reconstruction. Toggleable at runtime via `setDecisionTraces()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `enableDefaultMatching?`            | `boolean`                                                                                                                                                                                                                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `enableFairTiebreaker?`             | `boolean`                                                                                                                                                                                                                          | Opt-in global best-match arbitration for bulk matching (default: false, preserving existing behavior). When `matchUsersAssignments()` is called with no userId, every eligible user is normally evaluated in parallel and independently claims every assignment they qualify for — when two or more users are eligible for the same assignment, whichever user's claim reaches Redis first wins, regardless of their relative score. With this enabled, candidates are instead collected across _all_ users first, sorted by score descending, and claimed greedily in that order — so the best-fit eligible candidate wins each assignment deterministically. Uses plain weighted-tag/geo score (the same formula as the non-learning path) as the fairness comparator; the contextual-bandit learning layer, if enabled, still re-ranks each user's own accepted backlog ordering but does not influence which user wins a contested assignment in this mode.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `enableGeoMatching?`                | `boolean`                                                                                                                                                                                                                          | Enable distance-based geolocation matching (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `enableGracefulDegradation?`        | `boolean`                                                                                                                                                                                                                          | Enable graceful degradation mode when Redis is unavailable (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `enableLearning?`                   | `boolean`                                                                                                                                                                                                                          | Enable the contextual-bandit learning layer (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `enableOpenTelemetry?`              | `boolean`                                                                                                                                                                                                                          | Enable OpenTelemetry tracing (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `enableReliabilityMetrics?`         | `boolean`                                                                                                                                                                                                                          | Enable circuit breaker and reliability metrics (default: true when telemetry enabled)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `enableWorkflows?`                  | `boolean`                                                                                                                                                                                                                          | Enable workflow orchestration features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `fairness?`                         | [`FairnessMode`](modules.md#fairnessmode)                                                                                                                                                                                          | One-word fairness policy for bulk matching — the friendly alternative to tuning `enableFairTiebreaker` / `fairnessLoadPenalty` / `fairnessTieBand` by hand: - `'first-come'` (default): whoever's claim reaches Redis first wins a contested assignment — fastest, but the winner is arbitrary. - `'best-match'`: the highest-scoring eligible user wins every contested assignment, deterministically. - `'balanced'`: best match wins, but near-ties (scores within ~5% of the typical candidate score) go to whoever is carrying less work. - `'spread-work'`: work is spread as evenly as skills allow — each assignment already on someone's plate discounts their next bid by half the typical candidate score, so being good (and fast) doesn't mean drowning in work while capable teammates sit idle. The underlying numbers are derived automatically from the candidate scores of each matching pass, so there is nothing to calibrate. `'balanced'` and `'spread-work'` also include a rolling-window guardrail by default: nobody receives at more than double the team's average grant rate over `fairnessWindowMs` (one hour unless changed) — see `fairnessMaxPerWindow` to set an explicit ceiling instead, or pass `Infinity` there to opt out. Setting `fairnessLoadPenalty` / `fairnessTieBand` explicitly overrides the derived values; setting `fairness` overrides `enableFairTiebreaker`. Switchable at runtime via `setFairness(mode)`; every fairness knob (not just the mode) can be retuned live with `setFairnessConfig(config)`. |
| `fairnessLoadPenalty?`              | `number`                                                                                                                                                                                                                           | Load-penalized scoring for fair-tiebreaker arbitration (default: 0, disabled; requires `enableFairTiebreaker`). Each assignment already on a user's backlog — including ones won earlier in the same matching pass — subtracts this amount from their effective score when competing for the next contested assignment. Pure best-score-wins arbitration otherwise saturates the top scorer to `maxUserBacklogSize` every pass; a penalty makes distribution progressive: the specialist still wins their first picks, but once loaded they lose marginal contests to an idle, still-capable candidate. Pick a value relative to your score scale (base priority + summed routing weights).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `fairnessMaxPerWindow?`             | `number`                                                                                                                                                                                                                           | Hard cap on how many assignments a single user may be granted within a rolling time window (default: undefined, disabled; applies in any `fairness` mode other than `'first-come'`). The backlog cap alone can't protect diligent users: someone who accepts and completes work quickly keeps freeing backlog slots and keeps winning, so speed is rewarded with ever more work. This cap counts _granted_ assignments over `fairnessWindowMs` regardless of how fast they were cleared; once a user hits it, contested assignments spill to the next-best eligible user (or stay queued) until the window rolls. Workflow-targeted assignments are direct handoffs and bypass the cap so workflows never stall. When left undefined, the `'balanced'` / `'spread-work'` presets supply a team-relative guardrail automatically: `max(maxUserBacklogSize, 2 x the team's average grants in the window)`, recomputed each pass, so it adapts to any deployment's volume without configuration. Set an explicit number to pin the ceiling, or `Infinity` to disable the window cap entirely.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `fairnessTieBand?`                  | `number`                                                                                                                                                                                                                           | Tie-band arbitration for fair-tiebreaker mode (default: 0, disabled; requires `enableFairTiebreaker`). Candidate scores falling in the same band-sized bucket (`floor(score / fairnessTieBand)`) are treated as tied, and the tie goes to the user currently carrying the least work. Scores in different buckets still resolve strictly by score, so clear skill differences always dominate — only near-ties get load-balanced. Note the bucket boundaries are fixed, so two scores less than a band apart can still straddle a boundary and resolve by score.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `fairnessWindowMs?`                 | `number`                                                                                                                                                                                                                           | Rolling window length in milliseconds for `fairnessMaxPerWindow` (default: 3600000 — one hour).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `geoDefaultMaxDistanceKm?`          | `number`                                                                                                                                                                                                                           | Global fallback cap in kilometers when assignment/user-specific caps are absent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `geoMatchingFunction?`              | [`GeoMatchingFunction`](modules.md#geomatchingfunction)                                                                                                                                                                            | Custom geolocation matcher override                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `geoScoreWeight?`                   | `number`                                                                                                                                                                                                                           | Proximity boost weight added to combined priority (default: 0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `idleUserTimeoutMs?`                | `number`                                                                                                                                                                                                                           | Opt-in idle user auto-rejection. When set, users that have pending (not yet accepted/rejected) assignments and show no activity for this many milliseconds are removed from the matching pool by processIdleUsers(), and their pending assignments are requeued. Disabled when undefined (default), preserving existing behavior.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `learningBoostFactor?`              | `number`                                                                                                                                                                                                                           | Multiplier applied to predicted reward when re-ranking candidates (default: 1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `learningDecisionTtlMs?`            | `number`                                                                                                                                                                                                                           | TTL for stored decision contexts in ms (default: 604800000 = 7 days)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `learningExplorationRate?`          | `number`                                                                                                                                                                                                                           | Epsilon-greedy exploration rate in [0, 1] (default: 0.05)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `learningFeatureExtractor?`         | [`LearningFeatureExtractor`](modules.md#learningfeatureextractor)                                                                                                                                                                  | Custom feature extractor; defaults to tag/skill/overlap/embedding features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `learningFeedbackTtlMs?`            | `number`                                                                                                                                                                                                                           | TTL for archived episodes awaiting external feedback in ms (default: 604800000 = 7 days)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `learningRate?`                     | `number`                                                                                                                                                                                                                           | SGD learning rate for online model updates (default: 0.1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `learningRewards?`                  | `Partial`\<[`LearningRewards`](modules.md#learningrewards)\>                                                                                                                                                                       | Override rewards per lifecycle outcome (merged with defaults)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `learningShadowMode?`               | `boolean`                                                                                                                                                                                                                          | Shadow mode: record decisions and learn, but never alter ranking (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `learningSignalWeights?`            | `Record`\<`string`, `number`\>                                                                                                                                                                                                     | Weights applied to named external feedback signals when computing rewards (default weight: 1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `learningSlaTightnessReferenceMs?`  | `number`                                                                                                                                                                                                                           | Reference duration (ms) used to normalize the `sla:tightness` learning feature (default: 3600000 = 1 hour). An assignment with `sla.completeWithinMs` equal to this value gets tightness 0; shorter deadlines approach 1. Only used by the default feature extractor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `matchExpirationMs?`                | `number`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `matchingFunction?`                 | (`user`: [`User`](interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `number` \| `string`, `assignmentId?`: `string`, `skillThresholds?`: `Record`\<`string`, `number`\>) => `Promise`\<[`number`, `number`]\> | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `maxUserBacklogSize?`               | `number`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `onAssignmentLifecycle?`            | (`event`: [`AssignmentLifecycleEvent`](modules.md#assignmentlifecycleevent)) => `void`                                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `onMatchDecision?`                  | (`trace`: [`MatchDecisionTrace`](interfaces/MatchDecisionTrace.md)) => `void`                                                                                                                                                      | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `onWorkflowEvent?`                  | (`transition`: [`WorkflowTransition`](modules.md#workflowtransition)) => `void`                                                                                                                                                    | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `prioritizationFunction?`           | (...`args`: ([`Assignment`](modules.md#assignment) \| `undefined`)[]) => `Promise`\<`number`\>                                                                                                                                     | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `redisCommandTimeout?`              | `number`                                                                                                                                                                                                                           | Command timeout in ms (default: 3000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `redisConnectTimeout?`              | `number`                                                                                                                                                                                                                           | Connection timeout in ms (default: 10000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `redisEnableOfflineQueue?`          | `boolean`                                                                                                                                                                                                                          | Enable offline queue for commands during disconnect (default: true)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `redisEnableReadyCheck?`            | `boolean`                                                                                                                                                                                                                          | Enable ready check before considering connection successful (default: true)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `redisHealthCheckInterval?`         | `number`                                                                                                                                                                                                                           | Health check interval in ms (default: 30000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `redisInitialRetryDelay?`           | `number`                                                                                                                                                                                                                           | Initial delay between retries in ms (default: 50)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `redisMaxRetries?`                  | `number`                                                                                                                                                                                                                           | Maximum number of reconnection attempts (default: 10)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `redisMaxRetryDelay?`               | `number`                                                                                                                                                                                                                           | Maximum delay between retries in ms (default: 2000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `redisPrefix?`                      | `string`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `relevantBatchSize?`                | `number`                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `streamConsumerGroup?`              | `string`                                                                                                                                                                                                                           | Consumer group name for Redis Streams (defaults to 'orchestrator')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `streamConsumerName?`               | `string`                                                                                                                                                                                                                           | Consumer name within the group (defaults to random UUID)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `workflowAuditEnabled?`             | `boolean`                                                                                                                                                                                                                          | Enable audit trail stream for compliance (default: false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `workflowCircuitBreakerResetMs?`    | `number`                                                                                                                                                                                                                           | Time to wait before attempting to close circuit breaker in ms (default: 30000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `workflowCircuitBreakerThreshold?`  | `number`                                                                                                                                                                                                                           | Number of failures before circuit breaker opens (default: 5)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `workflowEventBatchSize?`           | `number`                                                                                                                                                                                                                           | Max stream entries read per orchestrator poll (XREADGROUP COUNT, default: 10)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `workflowIdempotencyTtlMs?`         | `number`                                                                                                                                                                                                                           | TTL for idempotency keys in milliseconds (default: 86400000 = 24h)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `workflowInstanceRetentionMs?`      | `number`                                                                                                                                                                                                                           | TTL applied to terminal (completed/failed/cancelled) workflow instances, including cleanup of registry, per-user, and active-index entries. When unset (default), terminal instances are kept forever.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `workflowMaxEventsPerSecond?`       | `number`                                                                                                                                                                                                                           | Per-replica throttle on workflow event processing (events per second). Applies to orchestrator stream consumption and scheduled-retry draining. When unset (default), events are processed as fast as possible.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `workflowMaxRetries?`               | `number`                                                                                                                                                                                                                           | Maximum retries for failed workflow events before moving to DLQ (default: 3)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `workflowOrphanReclaimMs?`          | `number`                                                                                                                                                                                                                           | Minimum idle time before reclaiming orphaned messages in ms (default: 60000 = 1min)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `workflowPollBlockMs?`              | `number`                                                                                                                                                                                                                           | Blocking wait per orchestrator poll in ms (XREADGROUP BLOCK, default: 5000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `workflowReclaimPollIntervalMs?`    | `number`                                                                                                                                                                                                                           | Polling interval for reclaim loop in ms (default: 5000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `workflowRetryBackoffMs?`           | `number`                                                                                                                                                                                                                           | Initial backoff delay for scheduled workflow event retries in ms (default: 1000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `workflowSnapshotDefinitions?`      | `boolean`                                                                                                                                                                                                                          | Snapshot workflow definitions at instance creation for versioning (default: true)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### Defined in

[src/types/matcher.ts:775](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L775)

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

[src/types/matcher.ts:335](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L335)

---

### QueueStats

Ƭ **QueueStats**: `Object`

Live operational snapshot from `getQueueStats()`: state counts, the age of
the longest-waiting unaccepted assignment (queued or pending — the clock
starts at first enqueue and survives requeues, stopping only on accept or
removal), and per-user load.

#### Type declaration

| Name              | Type                                        | Description                                                         |
| :---------------- | :------------------------------------------ | :------------------------------------------------------------------ |
| `oldestWaitingMs` | `number` \| `null`                          | Age in ms of the oldest not-yet-accepted assignment; null when none |
| `pending`         | `number`                                    | -                                                                   |
| `perUser`         | [`UserLoadInfo`](modules.md#userloadinfo)[] | -                                                                   |
| `queued`          | `number`                                    | -                                                                   |
| `scheduled`       | `number`                                    | Assignments held by `schedule.notBefore`, not yet in the queue      |

#### Defined in

[src/types/matcher.ts:325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L325)

---

### ScheduleSweepResult

Ƭ **ScheduleSweepResult**: `Object`

Outcome of one `processScheduledAssignments()` sweep.

#### Type declaration

| Name        | Type     | Description                                                          |
| :---------- | :------- | :------------------------------------------------------------------- |
| `activated` | `number` | Held assignments whose `notBefore` arrived and were enqueued         |
| `missed`    | `number` | Un-accepted assignments whose `notAfter` elapsed (parked or dropped) |

#### Defined in

[src/types/matcher.ts:726](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L726)

---

### Severity

Ƭ **Severity**: `"hard"` \| `"medium"` \| `"soft"`

Lexicographic severity levels.

They are compared in order, not summed: no quantity of `soft` improvement can
buy a single `hard` breach. A weighted sum would let a large enough cost
saving purchase a rest violation, which is not a trade the law permits.

`hard` = legally or physically impossible. `medium` = coverage shortfalls.
`soft` = cost, fairness, preferences.

#### Defined in

[src/scheduling/types.ts:661](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L661)

---

### SlaExpirySweepResult

Ƭ **SlaExpirySweepResult**: `Object`

Outcome of one `processSlaExpiries()` sweep.

#### Type declaration

| Name      | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `expired` | `number` | Assignments whose freshness TTL elapsed |

#### Defined in

[src/types/matcher.ts:720](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L720)

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

[src/types/matcher.ts:303](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L303)

---

### UserLoadInfo

Ƭ **UserLoadInfo**: `Object`

One user's live load snapshot inside `QueueStats`.

#### Type declaration

| Name             | Type      | Description                                                           |
| :--------------- | :-------- | :-------------------------------------------------------------------- |
| `backlog`        | `number`  | Current pending-backlog depth                                         |
| `maxBacklogSize` | `number`  | Effective cap (per-user `maxBacklogSize` or the matcher-wide default) |
| `paused`         | `boolean` | -                                                                     |
| `userId`         | `string`  | -                                                                     |

#### Defined in

[src/types/matcher.ts:310](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L310)

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

[src/types/matcher.ts:1070](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1070)

---

### WorkflowEventType

Ƭ **WorkflowEventType**: `"STARTED"` \| `"COMPLETED"` \| `"REJECTED"` \| `"EXPIRED"` \| `"FAILED"`

Event types for workflow lifecycle

#### Defined in

[src/types/matcher.ts:1088](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1088)

---

### WorkflowInstanceStatus

Ƭ **WorkflowInstanceStatus**: `"active"` \| `"completed"` \| `"failed"` \| `"cancelled"`

Status of a workflow instance

#### Defined in

[src/types/matcher.ts:1286](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1286)

---

### WorkflowTargetUser

Ƭ **WorkflowTargetUser**: `"initiator"` \| `"previous"` \| `string` \| \{ `tag`: `string` }

Target user selector for workflow assignment steps

#### Defined in

[src/types/matcher.ts:1094](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1094)

---

### WorkflowTaskType

Ƭ **WorkflowTaskType**: `"assignment"` \| `"machine"` \| `"external"`

Step execution mode

#### Defined in

[src/types/matcher.ts:1091](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1091)

---

### WorkflowTransition

Ƭ **WorkflowTransition**: `Object`

A durably-applied workflow transition, delivered to `MatcherOptions.onWorkflowEvent`
right after it took effect. `instance` is the post-transition snapshot. This is the
single fan-out point a host (e.g. the platform) uses to drive webhooks/notifications
without parsing the underlying Redis stream itself — mirrors `onMatchDecision`'s
contract: fired best-effort, errors thrown by the callback are swallowed and never
affect workflow processing.

#### Type declaration

| Name            | Type                                                                                                                                                                             |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assignmentId?` | `string`                                                                                                                                                                         |
| `instance`      | [`WorkflowInstance`](interfaces/WorkflowInstance.md)                                                                                                                             |
| `kind`          | `"run.started"` \| `"step.ready"` \| `"step.completed"` \| `"step.failed"` \| `"step.expired"` \| `"step.escalated"` \| `"run.completed"` \| `"run.failed"` \| `"run.cancelled"` |
| `payload?`      | `Record`\<`string`, `any`\>                                                                                                                                                      |
| `stepId?`       | `string`                                                                                                                                                                         |

#### Defined in

[src/types/matcher.ts:1267](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1267)

---

### options

Ƭ **options**: [`MatcherOptions`](modules.md#matcheroptions)

**`Deprecated`**

Use MatcherOptions instead

#### Defined in

[src/types/matcher.ts:1067](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1067)

## Variables

### DEFAULT_AUTO_WEIGHTS_OPTIONS

• `Const` **DEFAULT_AUTO_WEIGHTS_OPTIONS**: `Required`\<`Omit`\<[`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md), `"priorWeight"` \| `"maxDeltaPerSync"` \| `"decayHalfLifeMs"` \| `"rng"`\>\> & \{ `priorWeight`: `number` }

#### Defined in

[src/learning/auto-weights.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/learning/auto-weights.ts#L27)

---

### DEFAULT_MIN_REST_MINUTES

• `Const` **DEFAULT_MIN_REST_MINUTES**: `660`

EU floor: Directive 2003/88/EC Article 3 — 11 consecutive hours per 24-hour period.

#### Defined in

[src/scheduling/constraints/min-rest.ts:22](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/constraints/min-rest.ts#L22)

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

[src/workflow-builder.ts:393](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L393)

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

[src/utils/cidr.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/cidr.ts#L139)

---

### checkCompliance

▸ **checkCompliance**(`input`, `roster`): [`ComplianceReport`](interfaces/ComplianceReport.md)

Validate an externally-produced or hand-edited roster.

Runs the same constraints as the solver — there is deliberately no second
validation path, because two paths drift and the one that drifts is always
the one nobody reads.

#### Parameters

| Name     | Type                                                         |
| :------- | :----------------------------------------------------------- |
| `input`  | [`ScheduleInput`](interfaces/ScheduleInput.md)               |
| `roster` | [`ScheduledAssignment`](interfaces/ScheduledAssignment.md)[] |

#### Returns

[`ComplianceReport`](interfaces/ComplianceReport.md)

#### Defined in

[src/scheduling/operations.ts:59](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L59)

---

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

| Name                            | Type                                  |
| :------------------------------ | :------------------------------------ |
| `user`                          | [`User`](interfaces/User.md)          |
| `assignment`                    | [`Assignment`](modules.md#assignment) |
| `options?`                      | `Object`                              |
| `options.defaultMaxDistanceKm?` | `number`                              |
| `options.enabled?`              | `boolean`                             |

#### Returns

[`GeoMatchResult`](modules.md#geomatchresult)

#### Defined in

[src/utils/geo.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/geo.ts#L49)

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

[src/learning/features.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/learning/features.ts#L15)

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

| Name                        | Type                                                     |
| :-------------------------- | :------------------------------------------------------- |
| `acceptedAssignments`       | () => `string`                                           |
| `acceptedAssignmentsExpiry` | () => `string`                                           |
| `allTags`                   | () => `string`                                           |
| `assignmentOwner`           | () => `string`                                           |
| `assignmentPriority`        | (`id`: `string`) => `string`                             |
| `assignmentTags`            | (`id`: `string`) => `string`                             |
| `assignmentVetoed`          | (`id`: `string`) => `string`                             |
| `assignments`               | () => `string`                                           |
| `assignmentsGeo`            | () => `string`                                           |
| `assignmentsQueuedAt`       | () => `string`                                           |
| `assignmentsRef`            | () => `string`                                           |
| `assignmentsSlaExpiry`      | () => `string`                                           |
| `autoWeightsSyncLock`       | () => `string`                                           |
| `circuitBreakerFailures`    | () => `string`                                           |
| `circuitBreakerState`       | () => `string`                                           |
| `completedAssignments`      | () => `string`                                           |
| `deadLetterQueue`           | () => `string`                                           |
| `decisionTraces`            | () => `string`                                           |
| `eventRetryCount`           | (`eventId`: `string`) => `string`                        |
| `eventStream`               | () => `string`                                           |
| `eventStreamDeadLetter`     | () => `string`                                           |
| `eventsRetryScheduled`      | () => `string`                                           |
| `learningDecision`          | (`assignmentId`: `string`) => `string`                   |
| `learningEpisode`           | (`assignmentId`: `string`) => `string`                   |
| `learningModel`             | () => `string`                                           |
| `learningStats`             | () => `string`                                           |
| `learningUserTagCounts`     | (`userId`: `string`) => `string`                         |
| `learningUserTagRewardSq`   | (`userId`: `string`) => `string`                         |
| `learningUserTagRewards`    | (`userId`: `string`) => `string`                         |
| `learningUserTagTs`         | (`userId`: `string`) => `string`                         |
| `learningUsers`             | () => `string`                                           |
| `parkedAssignments`         | () => `string`                                           |
| `pausedUsers`               | () => `string`                                           |
| `pendingAssignmentsData`    | () => `string`                                           |
| `pendingAssignmentsExpiry`  | () => `string`                                           |
| `processedEvent`            | (`eventId`: `string`) => `string`                        |
| `processedEvents`           | () => `string`                                           |
| `reliabilityMetrics`        | () => `string`                                           |
| `scheduleNotAfter`          | () => `string`                                           |
| `scheduledActivateAt`       | () => `string`                                           |
| `scheduledAssignments`      | () => `string`                                           |
| `slaStats`                  | () => `string`                                           |
| `slaTagStats`               | (`tag`: `string`) => `string`                            |
| `tagAssignments`            | (`tag`: `string`) => `string`                            |
| `tempUserCandidates`        | (`userId`: `string`) => `string`                         |
| `tempUserExclude`           | (`userId`: `string`) => `string`                         |
| `tempUserFinal`             | (`userId`: `string`) => `string`                         |
| `userActivity`              | () => `string`                                           |
| `userAssignments`           | (`userId`: `string`) => `string`                         |
| `userRejected`              | (`userId`: `string`) => `string`                         |
| `userVetoed`                | (`userId`: `string`) => `string`                         |
| `userWindowGrants`          | (`userId`: `string`) => `string`                         |
| `users`                     | () => `string`                                           |
| `workflowAssignmentLink`    | (`assignmentId`: `string`) => `string`                   |
| `workflowAuditStream`       | () => `string`                                           |
| `workflowDefinition`        | (`id`: `string`) => `string`                             |
| `workflowDefinitions`       | () => `string`                                           |
| `workflowInstance`          | (`id`: `string`) => `string`                             |
| `workflowInstanceSequence`  | () => `string`                                           |
| `workflowInstances`         | () => `string`                                           |
| `workflowInstancesActive`   | () => `string`                                           |
| `workflowInstancesByTime`   | () => `string`                                           |
| `workflowInstancesByUser`   | (`userId`: `string`) => `string`                         |
| `workflowStepExpiry`        | (`instanceId`: `string`, `stepId`: `string`) => `string` |
| `workflowStepExpiryIndex`   | () => `string`                                           |

#### Defined in

[src/utils/keys.ts:13](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/keys.ts#L13)

---

### days

▸ **days**(`count`): `number`

Days as minutes.

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `count` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/rules.ts:34](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/rules.ts#L34)

---

### diagnoseInfeasibility

▸ **diagnoseInfeasibility**(`input`): [`InfeasibilityReport`](interfaces/InfeasibilityReport.md)

Why the problem cannot be solved, before spending a search budget on it.

Cheap arithmetic catches most real infeasibility: total demand against total
available capacity, per tag. "You are 24 registered-nurse-hours short on
Tuesday to Thursday nights" starts a conversation; "no solution found" ends
one.

#### Parameters

| Name    | Type                                           |
| :------ | :--------------------------------------------- |
| `input` | [`ScheduleInput`](interfaces/ScheduleInput.md) |

#### Returns

[`InfeasibilityReport`](interfaces/InfeasibilityReport.md)

#### Defined in

[src/scheduling/operations.ts:426](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L426)

---

### explainCandidate

▸ **explainCandidate**(`input`, `employeeId`, `shiftInstanceId`, `roster?`): [`RuleVerdict`](interfaces/RuleVerdict.md)[]

Why can — or can't — this person work this shift?

A rule-by-rule scan against live state, not a solve. This is the question
managers actually ask, and answering it with concrete numbers ("clock-out
22:00, shift starts 06:00, that is 8h against an 11h minimum") is what makes
the roster arguable rather than oracular.

#### Parameters

| Name              | Type                                                         | Default value |
| :---------------- | :----------------------------------------------------------- | :------------ |
| `input`           | [`ScheduleInput`](interfaces/ScheduleInput.md)               | `undefined`   |
| `employeeId`      | `string`                                                     | `undefined`   |
| `shiftInstanceId` | `string`                                                     | `undefined`   |
| `roster`          | [`ScheduledAssignment`](interfaces/ScheduledAssignment.md)[] | `[]`          |

#### Returns

[`RuleVerdict`](interfaces/RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:116](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L116)

---

### explainMatchScore

▸ **explainMatchScore**(`user`, `assignmentTags`, `assignmentPriority`, `enableDefaultMatching`, `skillThresholds?`): [`MatchScoreExplanation`](interfaces/MatchScoreExplanation.md)

Explaining twin of `calculateMatchScore`: same inputs, same score and
combined priority (asserted by the parity test in
tests/matcher_decision_traces.test.ts), plus the structured reasons behind
the number — matched weights, vetoes, threshold failures, tag overlap.
Kept separate from `calculateMatchScore` so the hot scoring path never pays
for reason allocation; any change to one function must be mirrored in the
other.

#### Parameters

| Name                    | Type                           |
| :---------------------- | :----------------------------- |
| `user`                  | [`User`](interfaces/User.md)   |
| `assignmentTags`        | `string`                       |
| `assignmentPriority`    | `string` \| `number`           |
| `enableDefaultMatching` | `boolean`                      |
| `skillThresholds?`      | `Record`\<`string`, `number`\> |

#### Returns

[`MatchScoreExplanation`](interfaces/MatchScoreExplanation.md)

#### Defined in

[src/scoring/match-score.ts:167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scoring/match-score.ts#L167)

---

### extractMatchFeatures

▸ **extractMatchFeatures**(`user`, `assignment`, `slaTightnessReferenceMs?`): [`LearningFeatures`](modules.md#learningfeatures)

Default feature extractor: tag matches, normalized skill weights,
tag-overlap ratio, optional embedding similarity, and SLA urgency.

#### Parameters

| Name                      | Type                                                                   | Default value |
| :------------------------ | :--------------------------------------------------------------------- | :------------ |
| `user`                    | [`User`](interfaces/User.md)                                           | `undefined`   |
| `assignment`              | [`LearningAssignmentContext`](interfaces/LearningAssignmentContext.md) | `undefined`   |
| `slaTightnessReferenceMs` | `number`                                                               | `3600000`     |

#### Returns

[`LearningFeatures`](modules.md#learningfeatures)

#### Defined in

[src/learning/features.ts:33](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/learning/features.ts#L33)

---

### hasValidCoordinates

▸ **hasValidCoordinates**(`latitude`, `longitude`): `boolean`

#### Parameters

| Name        | Type      |
| :---------- | :-------- |
| `latitude`  | `unknown` |
| `longitude` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/utils/geo.ts:23](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/geo.ts#L23)

---

### haversineDistanceKm

▸ **haversineDistanceKm**(`lat1`, `lon1`, `lat2`, `lon2`): `number`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `lat1` | `number` |
| `lon1` | `number` |
| `lat2` | `number` |
| `lon2` | `number` |

#### Returns

`number`

#### Defined in

[src/utils/geo.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/geo.ts#L27)

---

### hours

▸ **hours**(`count`): `number`

Hours as minutes, for readability in rule objects.

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `count` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/rules.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/rules.ts#L29)

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

[src/utils/cidr.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/cidr.ts#L119)

---

### isValidLatitude

▸ **isValidLatitude**(`value`): value is number

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `value` | `unknown` |

#### Returns

value is number

#### Defined in

[src/utils/geo.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/geo.ts#L15)

---

### isValidLongitude

▸ **isValidLongitude**(`value`): value is number

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `value` | `unknown` |

#### Returns

value is number

#### Defined in

[src/utils/geo.ts:19](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/geo.ts#L19)

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

[src/workflow-builder.ts:350](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L350)

---

### lintAssignment

▸ **lintAssignment**(`assignment`, `context?`): [`AssignmentLintIssue`](interfaces/AssignmentLintIssue.md)[]

Static pre-flight checks for an assignment declaration. Returns an empty
array when nothing is worth flagging. Purely structural — pair with
`checkAssignmentReadiness()` for checks against the live user pool.

#### Parameters

| Name         | Type                                                           |
| :----------- | :------------------------------------------------------------- |
| `assignment` | [`Assignment`](modules.md#assignment)                          |
| `context`    | [`AssignmentLintContext`](interfaces/AssignmentLintContext.md) |

#### Returns

[`AssignmentLintIssue`](interfaces/AssignmentLintIssue.md)[]

#### Defined in

[src/validation/assignment-lint.ts:41](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/validation/assignment-lint.ts#L41)

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

[src/workflow-validation.ts:133](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-validation.ts#L133)

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

[src/utils/cidr.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/cidr.ts#L93)

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

[src/utils/cidr.ts:69](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/cidr.ts#L69)

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

[src/utils/cidr.ts:9](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/cidr.ts#L9)

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

[src/utils/cidr.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/utils/cidr.ts#L26)

---

### rankCandidates

▸ **rankCandidates**(`input`, `shiftInstanceId`, `roster`, `disruption?`): [`RepairCandidate`](interfaces/RepairCandidate.md)[]

Rank everyone who could take an open shift.

The hard gate and the soft ordering are kept separate on purpose: an
ineligible person is _never_ promoted by being cheap, and the reason they are
ineligible is still reported, because "Anna would be ideal but is 2h short on
rest" is more useful than Anna's silent absence from the list.

Ordering uses cost, fairness debt and stated preference — all facts about
declared data and realised assignments. No reliability score, no acceptance
history, no no-show prediction: those would make this profiling under AI Act
Annex III point 4(b), which is high-risk with no narrow-task exemption.

#### Parameters

| Name              | Type                                                         |
| :---------------- | :----------------------------------------------------------- |
| `input`           | [`ScheduleInput`](interfaces/ScheduleInput.md)               |
| `shiftInstanceId` | `string`                                                     |
| `roster`          | [`ScheduledAssignment`](interfaces/ScheduledAssignment.md)[] |
| `disruption?`     | [`Disruption`](modules.md#disruption)                        |

#### Returns

[`RepairCandidate`](interfaces/RepairCandidate.md)[]

#### Defined in

[src/scheduling/operations.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L222)

---

### repairSchedule

▸ **repairSchedule**(`input`, `disruption`, `published`): [`RepairResult`](interfaces/RepairResult.md)

Re-plan around a disruption, changing as little as possible.

Everything not touched by the disruption is pinned, so the answer is a _diff_
a manager can act on rather than a fresh roster nobody recognises. A full
re-solve at 06:00 returns a different schedule for the whole team, which is
not an answer anyone will accept.

The candidate list is a ranked scan, not a solve — that is what keeps it
interactive, and it is also the more useful output: the gap is filled by
phoning someone, so the operator needs an ordered list with reasons, not a
single name.

#### Parameters

| Name         | Type                                                         |
| :----------- | :----------------------------------------------------------- |
| `input`      | [`ScheduleInput`](interfaces/ScheduleInput.md)               |
| `disruption` | [`Disruption`](modules.md#disruption)                        |
| `published`  | [`ScheduledAssignment`](interfaces/ScheduledAssignment.md)[] |

#### Returns

[`RepairResult`](interfaces/RepairResult.md)

#### Defined in

[src/scheduling/operations.ts:177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L177)

---

### solveSchedule

▸ **solveSchedule**(`input`): [`ScheduleResult`](interfaces/ScheduleResult.md)

One-shot convenience wrapper around `new ShiftScheduler().solve(input)`.

#### Parameters

| Name    | Type                                           |
| :------ | :--------------------------------------------- |
| `input` | [`ScheduleInput`](interfaces/ScheduleInput.md) |

#### Returns

[`ScheduleResult`](interfaces/ScheduleResult.md)

#### Defined in

[src/scheduling/scheduler.class.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/scheduler.class.ts#L175)

---

### synthesizeRoutingWeights

▸ **synthesizeRoutingWeights**(`stats`, `options?`, `knownTags?`, `existingWeights?`): `Record`\<`string`, `number`\>

Synthesize a routingWeights map from per-tag reward statistics.

#### Parameters

| Name               | Type                                                                   | Description                                                                                                                                                 |
| :----------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stats`            | [`LearningTagStat`](interfaces/LearningTagStat.md)[]                   | per-user tag reward statistics (from learned outcomes)                                                                                                      |
| `options?`         | [`AutoRoutingWeightsOptions`](interfaces/AutoRoutingWeightsOptions.md) | synthesis policy and tuning (merged with defaults)                                                                                                          |
| `knownTags?`       | `string`[]                                                             | optional tags to include even without observations; unobserved known tags receive the optimistic prior weight                                               |
| `existingWeights?` | `Record`\<`string`, `number`\>                                         | optional current routingWeights of the user; used as the per-tag prior for under-sampled or unobserved tags instead of the flat `priorWeight` when provided |

#### Returns

`Record`\<`string`, `number`\>

#### Defined in

[src/learning/auto-weights.ts:192](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/learning/auto-weights.ts#L192)

---

### userCoversTag

▸ **userCoversTag**(`user`, `tag`): `boolean`

Whether a user can currently serve a tag, mirroring the matching
semantics: positive routing weights (wildcards honored, weight 0 vetoes)
when the user has any, tag membership (user-side patterns) otherwise.

#### Parameters

| Name   | Type                         |
| :----- | :--------------------------- |
| `user` | [`User`](interfaces/User.md) |
| `tag`  | `string`                     |

#### Returns

`boolean`

#### Defined in

[src/validation/assignment-lint.ts:28](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/validation/assignment-lint.ts#L28)

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

[src/workflow-validation.ts:50](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-validation.ts#L50)

---

### weeklyAverageOver

▸ **weeklyAverageOver**(`hoursPerWeek`, `days`, `label?`): `RollingAverage`

"At most `hoursPerWeek` on average over `days`" as a rolling-window limit.

The conversion is the trap. A rolling average is expressed as a _total_ over
the window, so 48h/week over four months is not `{maxMinutes: 2880,
windowDays: 120}` — that would cap the whole four months at 48 hours. It is
48h × (120 ÷ 7) ≈ 823h. Getting this wrong produces a rule that looks right
and is off by a factor of seventeen.

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `hoursPerWeek` | `number` |
| `days`         | `number` |
| `label?`       | `string` |

#### Returns

`RollingAverage`

#### Defined in

[src/scheduling/rules.ts:20](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/rules.ts#L20)

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

[src/workflow-builder.ts:340](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L340)
