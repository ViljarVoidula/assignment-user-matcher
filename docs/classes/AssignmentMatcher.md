[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentMatcher

# Class: AssignmentMatcher

## Implements

- [`WorkflowHost`](../interfaces/WorkflowHost.md)

## Table of contents

### Constructors

- [constructor](AssignmentMatcher.md#constructor)

### Properties

- [acceptedAssignmentsKey](AssignmentMatcher.md#acceptedassignmentskey)
- [allTagsKey](AssignmentMatcher.md#alltagskey)
- [assignmentOwnerKey](AssignmentMatcher.md#assignmentownerkey)
- [assignmentsKey](AssignmentMatcher.md#assignmentskey)
- [assignmentsRefKey](AssignmentMatcher.md#assignmentsrefkey)
- [completedAssignmentsKey](AssignmentMatcher.md#completedassignmentskey)
- [enableDefaultMatching](AssignmentMatcher.md#enabledefaultmatching)
- [idleUserTimeoutMs](AssignmentMatcher.md#idleusertimeoutms)
- [matchExpirationMs](AssignmentMatcher.md#matchexpirationms)
- [maxUserBacklogSize](AssignmentMatcher.md#maxuserbacklogsize)
- [pendingAssignmentsExpiryKey](AssignmentMatcher.md#pendingassignmentsexpirykey)
- [pendingAssignmentsKey](AssignmentMatcher.md#pendingassignmentskey)
- [redisClient](AssignmentMatcher.md#redisclient)
- [redisPrefix](AssignmentMatcher.md#redisprefix)
- [relevantBatchSize](AssignmentMatcher.md#relevantbatchsize)
- [usersKey](AssignmentMatcher.md#userskey)

### Accessors

- [stats](AssignmentMatcher.md#stats)
- [usersWithoutAssignment](AssignmentMatcher.md#userswithoutassignment)

### Methods

- [acceptAssignment](AssignmentMatcher.md#acceptassignment)
- [addAssignment](AssignmentMatcher.md#addassignment)
- [addRecurringAssignment](AssignmentMatcher.md#addrecurringassignment)
- [addUser](AssignmentMatcher.md#adduser)
- [assignToUser](AssignmentMatcher.md#assigntouser)
- [atomicWorkflowTransition](AssignmentMatcher.md#atomicworkflowtransition)
- [auditQueue](AssignmentMatcher.md#auditqueue)
- [backfillWorkflowIndexes](AssignmentMatcher.md#backfillworkflowindexes)
- [cancelWorkflow](AssignmentMatcher.md#cancelworkflow)
- [checkAssignmentReadiness](AssignmentMatcher.md#checkassignmentreadiness)
- [checkDeadLetterQueueAlert](AssignmentMatcher.md#checkdeadletterqueuealert)
- [clearDeadLetterQueue](AssignmentMatcher.md#cleardeadletterqueue)
- [clearDecisionTraces](AssignmentMatcher.md#cleardecisiontraces)
- [completeAssignment](AssignmentMatcher.md#completeassignment)
- [completeWorkflowStep](AssignmentMatcher.md#completeworkflowstep)
- [deleteWorkflowDefinition](AssignmentMatcher.md#deleteworkflowdefinition)
- [drainScheduledRetries](AssignmentMatcher.md#drainscheduledretries)
- [executeWorkflow](AssignmentMatcher.md#executeworkflow)
- [explainLearnedRoutingWeights](AssignmentMatcher.md#explainlearnedroutingweights)
- [explainMatch](AssignmentMatcher.md#explainmatch)
- [failAssignment](AssignmentMatcher.md#failassignment)
- [getActiveAssignmentsForUser](AssignmentMatcher.md#getactiveassignmentsforuser)
- [getActiveWorkflowsForUser](AssignmentMatcher.md#getactiveworkflowsforuser)
- [getAllAssignments](AssignmentMatcher.md#getallassignments)
- [getAssignment](AssignmentMatcher.md#getassignment)
- [getAssignmentCounts](AssignmentMatcher.md#getassignmentcounts)
- [getAssignmentsByIds](AssignmentMatcher.md#getassignmentsbyids)
- [getAssignmentsPaginated](AssignmentMatcher.md#getassignmentspaginated)
- [getAuditEvents](AssignmentMatcher.md#getauditevents)
- [getCircuitBreakerState](AssignmentMatcher.md#getcircuitbreakerstate)
- [getCompletedAssignments](AssignmentMatcher.md#getcompletedassignments)
- [getCurrentAssignmentsForUser](AssignmentMatcher.md#getcurrentassignmentsforuser)
- [getDeadLetterEvents](AssignmentMatcher.md#getdeadletterevents)
- [getDeadLetterQueueSize](AssignmentMatcher.md#getdeadletterqueuesize)
- [getDecisionTraces](AssignmentMatcher.md#getdecisiontraces)
- [getEscalationLevel](AssignmentMatcher.md#getescalationlevel)
- [getFairness](AssignmentMatcher.md#getfairness)
- [getFairnessConfig](AssignmentMatcher.md#getfairnessconfig)
- [getLearnedRoutingWeights](AssignmentMatcher.md#getlearnedroutingweights)
- [getLearnedTagStats](AssignmentMatcher.md#getlearnedtagstats)
- [getLearningDecision](AssignmentMatcher.md#getlearningdecision)
- [getLearningDecisionById](AssignmentMatcher.md#getlearningdecisionbyid)
- [getLearningEpisode](AssignmentMatcher.md#getlearningepisode)
- [getLearningModel](AssignmentMatcher.md#getlearningmodel)
- [getLearningShadowMode](AssignmentMatcher.md#getlearningshadowmode)
- [getLearningStats](AssignmentMatcher.md#getlearningstats)
- [getParkedAssignments](AssignmentMatcher.md#getparkedassignments)
- [getPausedUsers](AssignmentMatcher.md#getpausedusers)
- [getPendingAssignmentsWithAge](AssignmentMatcher.md#getpendingassignmentswithage)
- [getQueueStats](AssignmentMatcher.md#getqueuestats)
- [getRecurringAssignment](AssignmentMatcher.md#getrecurringassignment)
- [getReliabilityMetrics](AssignmentMatcher.md#getreliabilitymetrics)
- [getScheduledAssignments](AssignmentMatcher.md#getscheduledassignments)
- [getSlaStats](AssignmentMatcher.md#getslastats)
- [getUser](AssignmentMatcher.md#getuser)
- [getUserSummaries](AssignmentMatcher.md#getusersummaries)
- [getUsers](AssignmentMatcher.md#getusers)
- [getUsersPaginated](AssignmentMatcher.md#getuserspaginated)
- [getWorkflowDefinition](AssignmentMatcher.md#getworkflowdefinition)
- [getWorkflowInstance](AssignmentMatcher.md#getworkflowinstance)
- [getWorkflowInstanceWithSnapshot](AssignmentMatcher.md#getworkflowinstancewithsnapshot)
- [getWorkflowMetrics](AssignmentMatcher.md#getworkflowmetrics)
- [healthCheck](AssignmentMatcher.md#healthcheck)
- [isAutoRoutingWeightsSyncRunning](AssignmentMatcher.md#isautoroutingweightssyncrunning)
- [isDecisionTracesEnabled](AssignmentMatcher.md#isdecisiontracesenabled)
- [isFairTiebreakerEnabled](AssignmentMatcher.md#isfairtiebreakerenabled)
- [isMaintenanceRunning](AssignmentMatcher.md#ismaintenancerunning)
- [isUserPaused](AssignmentMatcher.md#isuserpaused)
- [listRecurringAssignments](AssignmentMatcher.md#listrecurringassignments)
- [listWorkflowDefinitions](AssignmentMatcher.md#listworkflowdefinitions)
- [listWorkflowInstances](AssignmentMatcher.md#listworkflowinstances)
- [matchUsersAssignments](AssignmentMatcher.md#matchusersassignments)
- [pauseUser](AssignmentMatcher.md#pauseuser)
- [previewMatch](AssignmentMatcher.md#previewmatch)
- [processCompletedAssignmentsRetention](AssignmentMatcher.md#processcompletedassignmentsretention)
- [processCompletionDeadlines](AssignmentMatcher.md#processcompletiondeadlines)
- [processExpiredMatches](AssignmentMatcher.md#processexpiredmatches)
- [processExpiredWorkflowSteps](AssignmentMatcher.md#processexpiredworkflowsteps)
- [processIdleUsers](AssignmentMatcher.md#processidleusers)
- [processRecurringAssignments](AssignmentMatcher.md#processrecurringassignments)
- [processResponseDeadlines](AssignmentMatcher.md#processresponsedeadlines)
- [processScheduledAssignments](AssignmentMatcher.md#processscheduledassignments)
- [processSlaExpiries](AssignmentMatcher.md#processslaexpiries)
- [processWorkflowEvents](AssignmentMatcher.md#processworkflowevents)
- [pruneWorkflowInstances](AssignmentMatcher.md#pruneworkflowinstances)
- [publishWorkflowEvent](AssignmentMatcher.md#publishworkflowevent)
- [reclaimOrphanedMessages](AssignmentMatcher.md#reclaimorphanedmessages)
- [recordLearningFeedback](AssignmentMatcher.md#recordlearningfeedback)
- [recordLearningReward](AssignmentMatcher.md#recordlearningreward)
- [registerMachineHandler](AssignmentMatcher.md#registermachinehandler)
- [registerWorkflow](AssignmentMatcher.md#registerworkflow)
- [rejectAssignment](AssignmentMatcher.md#rejectassignment)
- [releaseUserAssignments](AssignmentMatcher.md#releaseuserassignments)
- [removeAssignment](AssignmentMatcher.md#removeassignment)
- [removeRecurringAssignment](AssignmentMatcher.md#removerecurringassignment)
- [removeUser](AssignmentMatcher.md#removeuser)
- [replayDeadLetterEvent](AssignmentMatcher.md#replaydeadletterevent)
- [resetLearningModel](AssignmentMatcher.md#resetlearningmodel)
- [resumeUser](AssignmentMatcher.md#resumeuser)
- [revertLearnedRoutingWeights](AssignmentMatcher.md#revertlearnedroutingweights)
- [runMaintenanceOnce](AssignmentMatcher.md#runmaintenanceonce)
- [setAssignmentPriority](AssignmentMatcher.md#setassignmentpriority)
- [setAssignmentPriorityByTags](AssignmentMatcher.md#setassignmentprioritybytags)
- [setDecisionTraces](AssignmentMatcher.md#setdecisiontraces)
- [setFairTiebreaker](AssignmentMatcher.md#setfairtiebreaker)
- [setFairness](AssignmentMatcher.md#setfairness)
- [setFairnessConfig](AssignmentMatcher.md#setfairnessconfig)
- [setLearningShadowMode](AssignmentMatcher.md#setlearningshadowmode)
- [setTracer](AssignmentMatcher.md#settracer)
- [startAutoReleaseInterval](AssignmentMatcher.md#startautoreleaseinterval)
- [startAutoRoutingWeightsSync](AssignmentMatcher.md#startautoroutingweightssync)
- [startIdleUserInterval](AssignmentMatcher.md#startidleuserinterval)
- [startMaintenance](AssignmentMatcher.md#startmaintenance)
- [startOrchestrator](AssignmentMatcher.md#startorchestrator)
- [startWorkflow](AssignmentMatcher.md#startworkflow)
- [stopAutoReleaseInterval](AssignmentMatcher.md#stopautoreleaseinterval)
- [stopAutoRoutingWeightsSync](AssignmentMatcher.md#stopautoroutingweightssync)
- [stopIdleUserInterval](AssignmentMatcher.md#stopidleuserinterval)
- [stopMaintenance](AssignmentMatcher.md#stopmaintenance)
- [stopOrchestrator](AssignmentMatcher.md#stoporchestrator)
- [syncLearnedRoutingWeights](AssignmentMatcher.md#synclearnedroutingweights)
- [touchUser](AssignmentMatcher.md#touchuser)
- [trainLearningSamples](AssignmentMatcher.md#trainlearningsamples)
- [trimWorkflowEventStream](AssignmentMatcher.md#trimworkfloweventstream)
- [unparkAssignment](AssignmentMatcher.md#unparkassignment)
- [updateAssignment](AssignmentMatcher.md#updateassignment)
- [userExists](AssignmentMatcher.md#userexists)
- [waitUntilReady](AssignmentMatcher.md#waituntilready)

## Constructors

### constructor

• **new AssignmentMatcher**(`redisClient`, `options?`): [`AssignmentMatcher`](AssignmentMatcher.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `redisClient` | `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\> |
| `options?` | [`MatcherOptions`](../modules.md#matcheroptions) |

#### Returns

[`AssignmentMatcher`](AssignmentMatcher.md)

#### Defined in

[src/matcher.class.ts:362](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L362)

## Properties

### acceptedAssignmentsKey

• **acceptedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:307](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L307)

___

### allTagsKey

• **allTagsKey**: `string`

#### Defined in

[src/matcher.class.ts:306](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L306)

___

### assignmentOwnerKey

• **assignmentOwnerKey**: `string`

#### Defined in

[src/matcher.class.ts:305](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L305)

___

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:295](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L295)

___

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:296](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L296)

___

### completedAssignmentsKey

• **completedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L323)

___

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:299](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L299)

___

### idleUserTimeoutMs

• **idleUserTimeoutMs**: ``null`` \| `number`

#### Defined in

[src/matcher.class.ts:301](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L301)

___

### matchExpirationMs

• **matchExpirationMs**: `number`

#### Defined in

[src/matcher.class.ts:300](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L300)

___

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:298](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L298)

___

### pendingAssignmentsExpiryKey

• **pendingAssignmentsExpiryKey**: `string`

#### Defined in

[src/matcher.class.ts:304](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L304)

___

### pendingAssignmentsKey

• **pendingAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:303](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L303)

___

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\>

#### Defined in

[src/matcher.class.ts:363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L363)

___

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:294](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L294)

___

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:293](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L293)

___

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:297](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L297)

## Accessors

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:2596](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2596)

___

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:2610](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2610)

## Methods

### acceptAssignment

▸ **acceptAssignment**(`userId`, `assignmentId`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `assignmentId` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4344](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4344)

___

### addAssignment

▸ **addAssignment**(`assignment`): `Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignment` | [`Assignment`](../modules.md#assignment) |

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Implementation of

[WorkflowHost](../interfaces/WorkflowHost.md).[addAssignment](../interfaces/WorkflowHost.md#addassignment)

#### Defined in

[src/matcher.class.ts:1942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1942)

___

### addRecurringAssignment

▸ **addRecurringAssignment**(`template`): `Promise`\<[`RecurringAssignment`](../modules.md#recurringassignment)\>

Register (or update) a recurring assignment: a standing template whose
recurrence sweep materializes each occurrence as an ordinary scheduled
assignment (id `<templateId>@<openEpochMs>`, offer window derived from
the policy). The template itself is never matchable.

Re-adding an existing id replaces the template but keeps its clock —
occurrences already materialized and the next slot are facts about the
past, not properties of the template. Remove and re-add to restart.

Occurrences fire with sweep granularity: `startMaintenance()` /
`runMaintenanceOnce()` / `processRecurringAssignments()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | [`RecurringAssignment`](../modules.md#recurringassignment) |

#### Returns

`Promise`\<[`RecurringAssignment`](../modules.md#recurringassignment)\>

**`Throws`**

when `recurrence` is unusable (`everyMs` missing, the gap between
        occurrences — `everyMs / times` — under 1000, or `until` before
        `startAt`)

#### Defined in

[src/matcher.class.ts:5471](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5471)

___

### addUser

▸ **addUser**(`user`): `Promise`\<[`User`](../interfaces/User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](../interfaces/User.md) |

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

#### Defined in

[src/matcher.class.ts:1925](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1925)

___

### assignToUser

▸ **assignToUser**(`assignmentId`, `userId`, `options?`): `Promise`\<\{ `previousOwnerId`: ``null`` \| `string`  }\>

Operator override: hand an assignment directly to a user, bypassing
tag/weight selection. Works on queued assignments and on pending ones
held by another user (the previous owner's backlog slot is released).
Idempotent when the user already owns the assignment.

Hard rules still apply unless `force`: the user must not be paused,
their backlog must have headroom, they must not be vetoed on the
assignment, and they must not have previously rejected it. `force`
bypasses those checks (the user must always exist). The learning layer
is never fed by manual assignments.

When tracing is active the override is recorded as a decision trace
with mode `'manual'`, so supervisor actions show up in the same audit
trail as organic matches.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |
| `userId` | `string` |
| `options?` | `Object` |
| `options.force?` | `boolean` |

#### Returns

`Promise`\<\{ `previousOwnerId`: ``null`` \| `string`  }\>

#### Defined in

[src/matcher.class.ts:4073](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4073)

___

### atomicWorkflowTransition

▸ **atomicWorkflowTransition**(`instanceId`, `expectedVersion`, `newStatus`, `newStepId`, `updatedContext`, `historyEntry?`): `Promise`\<\{ `error?`: `string` ; `instance?`: [`WorkflowInstance`](../interfaces/WorkflowInstance.md) ; `ok`: `boolean`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `expectedVersion` | `number` |
| `newStatus` | [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus) |
| `newStepId` | ``null`` \| `string` |
| `updatedContext` | `Record`\<`string`, `any`\> |
| `historyEntry?` | `Object` |
| `historyEntry.assignmentId` | `string` |
| `historyEntry.completedAt` | `number` |
| `historyEntry.result?` | `Record`\<`string`, `any`\> |
| `historyEntry.stepId` | `string` |
| `historyEntry.userId` | `string` |

#### Returns

`Promise`\<\{ `error?`: `string` ; `instance?`: [`WorkflowInstance`](../interfaces/WorkflowInstance.md) ; `ok`: `boolean`  }\>

#### Defined in

[src/matcher.class.ts:660](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L660)

___

### auditQueue

▸ **auditQueue**(`options?`): `Promise`\<[`QueueAuditReport`](../interfaces/QueueAuditReport.md)\>

Queue-wide overlook: why is queued work not moving? Examines the
longest-waiting queued assignments against the current pool (same hard
rules as matching) and reports, per stuck assignment, who is blocked by
what — plus the past-due entries sitting unswept in every deadline
index, which is the tell-tale of a missing or lagging maintenance tick.
Read-only and O(scanned assignments × users): a diagnostic, not a hot
path — cap with `limit` on very large queues.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`QueueAuditOptions`](../interfaces/QueueAuditOptions.md) |

#### Returns

`Promise`\<[`QueueAuditReport`](../interfaces/QueueAuditReport.md)\>

#### Defined in

[src/matcher.class.ts:1398](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1398)

___

### backfillWorkflowIndexes

▸ **backfillWorkflowIndexes**(): `Promise`\<`number`\>

Backfill workflow indexes (active-instance index) from records created
before these indexes existed. Safe to run multiple times.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:4942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4942)

___

### cancelWorkflow

▸ **cancelWorkflow**(`instanceId`): `Promise`\<`boolean`\>

Cancel a workflow instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4844](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4844)

___

### checkAssignmentReadiness

▸ **checkAssignmentReadiness**(`assignment`): `Promise`\<[`AssignmentReadinessReport`](../interfaces/AssignmentReadinessReport.md)\>

Pre-flight check for an assignment before (or without) adding it:
static policy lint (schedule conflicts, policies that would be silently
ignored, missing tags) plus live findings against the current pool —
tags no active user can serve, ids that already exist, and whether
anyone is eligible right now under the same rules as `previewMatch()`.
Read-only: never claims, writes, or records decisions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignment` | [`Assignment`](../modules.md#assignment) |

#### Returns

`Promise`\<[`AssignmentReadinessReport`](../interfaces/AssignmentReadinessReport.md)\>

#### Defined in

[src/matcher.class.ts:1323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1323)

___

### checkDeadLetterQueueAlert

▸ **checkDeadLetterQueueAlert**(): `Promise`\<`boolean`\>

Check if Dead Letter Queue size exceeds alert threshold

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:757](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L757)

___

### clearDeadLetterQueue

▸ **clearDeadLetterQueue**(): `Promise`\<`number`\>

Clear all events from the Dead Letter Queue.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:720](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L720)

___

### clearDecisionTraces

▸ **clearDecisionTraces**(): `Promise`\<`number`\>

Delete all recorded decision traces.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1034](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1034)

___

### completeAssignment

▸ **completeAssignment**(`userId`, `assignmentId`, `result?`): `Promise`\<`boolean`\>

Complete an assignment with a result payload.
Moves the assignment from 'accepted' to 'completed' state and publishes an event
for workflow orchestration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The user completing the assignment |
| `assignmentId` | `string` | The assignment being completed |
| `result?` | [`AssignmentResult`](../interfaces/AssignmentResult.md) | Optional result payload for routing decisions |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4560](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4560)

___

### completeWorkflowStep

▸ **completeWorkflowStep**(`instanceId`, `stepId`, `outcome`): `Promise`\<`boolean`\>

Complete (or fail, via `outcome.success: false`) an external step from
outside this process — the counterpart to the `step.ready` transition
delivered via `onWorkflowEvent`. Throws if the step isn't the run's
current step (or a pending parallel branch) or isn't an external step.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `stepId` | `string` |
| `outcome` | `Object` |
| `outcome.data?` | `Record`\<`string`, `any`\> |
| `outcome.error?` | `string` |
| `outcome.success` | `boolean` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4855](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4855)

___

### deleteWorkflowDefinition

▸ **deleteWorkflowDefinition**(`id`): `Promise`\<`boolean`\>

Delete a workflow definition by ID. Running instances are unaffected
(they carry their own snapshot). Returns `false` if it did not exist.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4772](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4772)

___

### drainScheduledRetries

▸ **drainScheduledRetries**(): `Promise`\<`number`\>

Process due delayed event retries. Called automatically by the
orchestrator; exposed for deployments that run their own schedulers.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:4933](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4933)

___

### executeWorkflow

▸ **executeWorkflow**(`workflowOrId`, `userId`, `initialContext?`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

Register and start a workflow in one call, or start an already-registered workflow by ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `workflowOrId` | `string` \| [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md) \| [`WorkflowDefinitionInput`](../interfaces/WorkflowDefinitionInput.md) |
| `userId` | `string` |
| `initialContext?` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

#### Defined in

[src/matcher.class.ts:4780](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4780)

___

### explainLearnedRoutingWeights

▸ **explainLearnedRoutingWeights**(`userId`, `opts?`): `Promise`\<[`AutoWeightExplanation`](../interfaces/AutoWeightExplanation.md)[]\>

The same synthesis with its reasoning attached, per tag: posterior
estimate and uncertainty, credible bounds, independent attempts,
effective sample size after decay, last observation, decay settings and
— for a lapsed veto — when it will be reassessed.

A hard veto removes a worker's eligibility for a tag outright, so
"the model decided" is not an adequate account of it; this is the API
that makes such a change reviewable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `opts?` | `Object` |
| `opts.includeUnexploredTags?` | `boolean` |

#### Returns

`Promise`\<[`AutoWeightExplanation`](../interfaces/AutoWeightExplanation.md)[]\>

#### Defined in

[src/matcher.class.ts:1678](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1678)

___

### explainMatch

▸ **explainMatch**(`assignmentId`, `opts?`): `Promise`\<[`MatchExplanation`](../interfaces/MatchExplanation.md)\>

Explain, from live state, which users could receive an assignment and
why each one is or is not eligible: vetoes, prior rejections, skill
thresholds, CIDR and geo constraints, backlog, the full score breakdown,
and learning influence. Works for assignments in any lifecycle state;
for matched assignments the current owner is flagged `chosen` (accepted
assignments report `ownerId: null` because ownership metadata is
released on acceptance — decision traces retain the full history).

This is an on-demand recomputation against current state. For the
auditable record of a decision as it actually happened, use
`getDecisionTraces()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |
| `opts?` | `Object` |
| `opts.userIds?` | `string`[] |

#### Returns

`Promise`\<[`MatchExplanation`](../interfaces/MatchExplanation.md)\>

#### Defined in

[src/matcher.class.ts:1052](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1052)

___

### failAssignment

▸ **failAssignment**(`userId`, `assignmentId`, `reason?`, `options?`): `Promise`\<`boolean`\>

Fail an assignment explicitly (e.g., user reports inability to complete).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The user failing the assignment |
| `assignmentId` | `string` | The assignment being failed |
| `reason?` | `string` | Optional reason for failure |
| `options?` | `Object` | - |
| `options.systemFault?` | `boolean` | The failure was a system/platform fault, not the worker's. Under multi-target learning this suppresses the negative `successGivenAcceptance` label (see `learningTargets.systemFaultCountsAsFailure`); the scalar reward is unaffected. |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4644](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4644)

___

### getActiveAssignmentsForUser

▸ **getActiveAssignmentsForUser**(`userId`): `Promise`\<[`ActiveAssignmentInfo`](../modules.md#activeassignmentinfo)[]\>

A user's accepted (in-progress) assignments, newest first, backed by
the per-user accepted index. Verified against the accepted store, so
stale index members (e.g. left by a `removeAssignment` on a non-SLA
assignment, or by an older library version) are dropped and self-healed.

Note: the index is maintained from the version that introduced it —
accepted work that predates it appears only after it cycles.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<[`ActiveAssignmentInfo`](../modules.md#activeassignmentinfo)[]\>

#### Defined in

[src/matcher.class.ts:2219](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2219)

___

### getActiveWorkflowsForUser

▸ **getActiveWorkflowsForUser**(`userId`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

Get all active workflow instances for a user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

#### Defined in

[src/matcher.class.ts:4826](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4826)

___

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Get all assignments (queued, pending, and accepted).
For large datasets, prefer using getAssignmentsPaginated() instead.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:2289](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2289)

___

### getAssignment

▸ **getAssignment**(`id`): `Promise`\<``null`` \| [`Assignment`](../modules.md#assignment) & \{ `_status?`: `string`  }\>

Get a single assignment by ID from any status.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<``null`` \| [`Assignment`](../modules.md#assignment) & \{ `_status?`: `string`  }\>

#### Defined in

[src/matcher.class.ts:2317](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2317)

___

### getAssignmentCounts

▸ **getAssignmentCounts**(): `Promise`\<[`AssignmentCounts`](../interfaces/AssignmentCounts.md)\>

Get assignment counts by status without fetching the data.
Efficient for dashboards and monitoring.

#### Returns

`Promise`\<[`AssignmentCounts`](../interfaces/AssignmentCounts.md)\>

#### Defined in

[src/matcher.class.ts:2309](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2309)

___

### getAssignmentsByIds

▸ **getAssignmentsByIds**(`ids`): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Get multiple assignments by IDs efficiently.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string`[] |

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:2325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2325)

___

### getAssignmentsPaginated

▸ **getAssignmentsPaginated**(`options?`): `Promise`\<[`PaginationResult`](../interfaces/PaginationResult.md)\>

Get assignments with pagination support for efficient querying of large datasets.
Uses cursor-based pagination across statuses.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`PaginationOptions`](../interfaces/PaginationOptions.md) | Pagination options. |

#### Returns

`Promise`\<[`PaginationResult`](../interfaces/PaginationResult.md)\>

#### Defined in

[src/matcher.class.ts:2300](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2300)

___

### getAuditEvents

▸ **getAuditEvents**(`count?`): `Promise`\<[`AuditEntry`](../interfaces/AuditEntry.md)[]\>

Get audit events from the audit stream.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `100` |

#### Returns

`Promise`\<[`AuditEntry`](../interfaces/AuditEntry.md)[]\>

#### Defined in

[src/matcher.class.ts:728](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L728)

___

### getCircuitBreakerState

▸ **getCircuitBreakerState**(): `Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

Get current circuit breaker state

#### Returns

`Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

#### Defined in

[src/matcher.class.ts:749](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L749)

___

### getCompletedAssignments

▸ **getCompletedAssignments**(`options?`): `Promise`\<[`CompletedAssignmentPage`](../modules.md#completedassignmentpage)\>

List terminal assignments from the completed store (both completions and
failures — they share the store, distinguished by the `_status` stamp:
`_completedBy`/`_completedAt` vs `_failedBy`/`_failedAt`). Cursor-paged
over HSCAN. The store is pruned only when
`completedAssignmentsRetentionMs` is set; pagination is best-effort
under a concurrent purge — the cursor is a positional offset over scan
order, so entries deleted between pages can shift what a later page
returns. Loop until `hasMore` is false and re-page if completeness
matters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.cursor?` | ``null`` \| `string` |
| `options.limit?` | `number` |

#### Returns

`Promise`\<[`CompletedAssignmentPage`](../modules.md#completedassignmentpage)\>

#### Defined in

[src/matcher.class.ts:2503](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2503)

___

### getCurrentAssignmentsForUser

▸ **getCurrentAssignmentsForUser**(`userId`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:4049](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4049)

___

### getDeadLetterEvents

▸ **getDeadLetterEvents**(`limit?`, `offset?`): `Promise`\<[`DeadLetterEntry`](../interfaces/DeadLetterEntry.md)[]\>

Get events from the Dead Letter Queue.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `100` |
| `offset` | `number` | `0` |

#### Returns

`Promise`\<[`DeadLetterEntry`](../interfaces/DeadLetterEntry.md)[]\>

#### Defined in

[src/matcher.class.ts:688](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L688)

___

### getDeadLetterQueueSize

▸ **getDeadLetterQueueSize**(): `Promise`\<`number`\>

Get Dead Letter Queue size.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:696](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L696)

___

### getDecisionTraces

▸ **getDecisionTraces**(`query?`): `Promise`\<[`MatchDecisionTrace`](../interfaces/MatchDecisionTrace.md)[]\>

Query recorded decision traces, newest first. Only decisions made while
`enableDecisionTraces` was active are stored — traces are captured as
decisions happen, never reconstructed after the fact.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`DecisionTraceQuery`](../interfaces/DecisionTraceQuery.md) |

#### Returns

`Promise`\<[`MatchDecisionTrace`](../interfaces/MatchDecisionTrace.md)[]\>

#### Defined in

[src/matcher.class.ts:1028](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1028)

___

### getEscalationLevel

▸ **getEscalationLevel**(`id`): `Promise`\<`number`\>

Current escalation level of an assignment (0 = never escalated).

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:5685](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5685)

___

### getFairness

▸ **getFairness**(): [`FairnessMode`](../modules.md#fairnessmode)

Current runtime fairness policy.

#### Returns

[`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/matcher.class.ts:976](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L976)

___

### getFairnessConfig

▸ **getFairnessConfig**(): `Object`

Snapshot of the live fairness configuration.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `enableFairTiebreaker` | `boolean` |
| `fairness` | [`FairnessMode`](../modules.md#fairnessmode) |
| `fairnessLoadPenalty` | `number` |
| `fairnessMaxPerWindow` | `undefined` \| `number` |
| `fairnessTieBand` | `number` |
| `fairnessWindowMs` | `number` |

#### Defined in

[src/matcher.class.ts:982](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L982)

___

### getLearnedRoutingWeights

▸ **getLearnedRoutingWeights**(`userId`, `opts?`): `Promise`\<`Record`\<`string`, `number`\>\>

Synthesize a routingWeights map for a user from learned tag statistics
using a UCB1 bandit policy: high weights for rewarding tags, weight 0
(hard veto) for consistently bad tags, and optimistic priors for
under-explored tags. Does not persist anything.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | - |
| `opts?` | `Object` | - |
| `opts.includeUnexploredTags?` | `boolean` | also assign the exploration prior to every known tag in the system the user has no data for yet |

#### Returns

`Promise`\<`Record`\<`string`, `number`\>\>

#### Defined in

[src/matcher.class.ts:1657](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1657)

___

### getLearnedTagStats

▸ **getLearnedTagStats**(`userId`): `Promise`\<[`LearningTagStat`](../interfaces/LearningTagStat.md)[]\>

Per-user, per-tag reward statistics aggregated from learned outcomes.
Requires `enableLearning` and `enableAutoRoutingWeights`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<[`LearningTagStat`](../interfaces/LearningTagStat.md)[]\>

#### Defined in

[src/matcher.class.ts:1643](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1643)

___

### getLearningDecision

▸ **getLearningDecision**(`assignmentId`): `Promise`\<``null`` \| [`LearningDecisionRecord`](../interfaces/LearningDecisionRecord.md)\>

The learning context of the attempt currently in flight for an
assignment: features, prediction, selection propensity and policy.
Null when there is none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |

#### Returns

`Promise`\<``null`` \| [`LearningDecisionRecord`](../interfaces/LearningDecisionRecord.md)\>

#### Defined in

[src/matcher.class.ts:853](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L853)

___

### getLearningDecisionById

▸ **getLearningDecisionById**(`decisionId`): `Promise`\<``null`` \| [`LearningDecisionRecord`](../interfaces/LearningDecisionRecord.md)\>

The learning context of one specific attempt, by decision id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `decisionId` | `string` |

#### Returns

`Promise`\<``null`` \| [`LearningDecisionRecord`](../interfaces/LearningDecisionRecord.md)\>

#### Defined in

[src/matcher.class.ts:859](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L859)

___

### getLearningEpisode

▸ **getLearningEpisode**(`assignmentId`): `Promise`\<``null`` \| [`LearningEpisodeRecord`](../interfaces/LearningEpisodeRecord.md)\>

The archived episode of the most recent closed attempt for an assignment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |

#### Returns

`Promise`\<``null`` \| [`LearningEpisodeRecord`](../interfaces/LearningEpisodeRecord.md)\>

#### Defined in

[src/matcher.class.ts:865](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L865)

___

### getLearningModel

▸ **getLearningModel**(): `Promise`\<`Record`\<`string`, `string`\>\>

Get the learned model weights (feature -> weight).

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Defined in

[src/matcher.class.ts:810](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L810)

___

### getLearningShadowMode

▸ **getLearningShadowMode**(): `Promise`\<`boolean`\>

Current runtime shadow mode state.

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:928](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L928)

___

### getLearningStats

▸ **getLearningStats**(): `Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

Get aggregate learning statistics (decisions, rewards, average reward).

#### Returns

`Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

#### Defined in

[src/matcher.class.ts:818](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L818)

___

### getParkedAssignments

▸ **getParkedAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Assignments held out of matching because their escalation ladder was
exhausted under `onExhausted: 'park'` — nobody answered, all the way up.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:5434](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5434)

___

### getPausedUsers

▸ **getPausedUsers**(): `Promise`\<`string`[]\>

IDs of all currently paused users.

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:2279](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2279)

___

### getPendingAssignmentsWithAge

▸ **getPendingAssignmentsWithAge**(`options?`): `Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

Get all pending assignments with owner and pending duration metadata.
Reads are bounded: the pending hash is paged with HSCAN and each page's
owner/expiry lookups are batched. Pass `{ limit }` (clamped to 1000) to
hydrate only the top-N longest-pending assignments instead of every one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.limit?` | `number` |

#### Returns

`Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

#### Defined in

[src/matcher.class.ts:2397](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2397)

___

### getQueueStats

▸ **getQueueStats**(): `Promise`\<[`QueueStats`](../modules.md#queuestats)\>

Live operational snapshot for dashboards: queued/pending counts, the
age of the longest-waiting unaccepted assignment, and every user's
backlog depth, effective cap, and paused state. The wait clock starts
at first enqueue and survives reject/expiry requeues; it stops on
accept or removal.

#### Returns

`Promise`\<[`QueueStats`](../modules.md#queuestats)\>

#### Defined in

[src/matcher.class.ts:2337](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2337)

___

### getRecurringAssignment

▸ **getRecurringAssignment**(`id`): `Promise`\<``null`` \| [`RecurringAssignmentRecord`](../interfaces/RecurringAssignmentRecord.md)\>

One recurring template with its clock, or null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<``null`` \| [`RecurringAssignmentRecord`](../interfaces/RecurringAssignmentRecord.md)\>

#### Defined in

[src/matcher.class.ts:5529](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5529)

___

### getReliabilityMetrics

▸ **getReliabilityMetrics**(): `Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

Get comprehensive reliability metrics including circuit breaker state,
Dead Letter Queue size, and Redis health status.

#### Returns

`Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

#### Defined in

[src/matcher.class.ts:741](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L741)

___

### getScheduledAssignments

▸ **getScheduledAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Assignments held out of the queue by `schedule.notBefore`, waiting for
the scheduled sweep to activate them.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:5444](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5444)

___

### getSlaStats

▸ **getSlaStats**(`tag?`): `Promise`\<[`SlaStats`](../interfaces/SlaStats.md)\>

Aggregate SLO attainment counters, globally or for a single tag.
Means are computed from sum/count pairs; 0 when no data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag?` | `string` |

#### Returns

`Promise`\<[`SlaStats`](../interfaces/SlaStats.md)\>

#### Defined in

[src/matcher.class.ts:587](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L587)

___

### getUser

▸ **getUser**(`userId`): `Promise`\<``null`` \| [`User`](../interfaces/User.md)\>

Get one stored user as last written by addUser (including the injected
'default' tag when enableDefaultMatching is on), or null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<``null`` \| [`User`](../interfaces/User.md)\>

#### Defined in

[src/matcher.class.ts:2146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2146)

___

### getUserSummaries

▸ **getUserSummaries**(`userIds`): `Promise`\<[`UserSummary`](../modules.md#usersummary)[]\>

Order-preserving workload summaries for a known set of user ids
(chunked pipelined reads). Missing or corrupt user records are omitted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userIds` | `string`[] |

#### Returns

`Promise`\<[`UserSummary`](../modules.md#usersummary)[]\>

#### Defined in

[src/matcher.class.ts:2205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2205)

___

### getUsers

▸ **getUsers**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

All stored users. The pool is small by design; for load metadata see getQueueStats().

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

#### Defined in

[src/matcher.class.ts:2163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2163)

___

### getUsersPaginated

▸ **getUsersPaginated**(`options?`): `Promise`\<[`UserQueryResult`](../modules.md#userqueryresult)\>

Paginated user query with composable status/workload filters
(`status`, `idleForMs`, `hasBacklog`, `atCapacity`). All reads are
bounded: the users hash is paged with HSCAN and per-page metadata is
batched into one multi(). A scan page is never split, so a page may
exceed `limit` by less than one scan page, and filtered scans may
return short pages with `hasMore: true` — keep consuming until
`hasMore` is false. `status: 'idle'` without an explicit `idleForMs`
falls back to the matcher's `idleUserTimeoutMs` (matches nobody when
that is not configured either).

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`UserQueryOptions`](../modules.md#userqueryoptions) |

#### Returns

`Promise`\<[`UserQueryResult`](../modules.md#userqueryresult)\>

#### Defined in

[src/matcher.class.ts:2192](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2192)

___

### getWorkflowDefinition

▸ **getWorkflowDefinition**(`id`): `Promise`\<``null`` \| [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)\>

Get a workflow definition by ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<``null`` \| [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)\>

#### Defined in

[src/matcher.class.ts:4755](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4755)

___

### getWorkflowInstance

▸ **getWorkflowInstance**(`instanceId`): `Promise`\<``null`` \| [`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

Get a workflow instance by ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

`Promise`\<``null`` \| [`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

#### Defined in

[src/matcher.class.ts:4810](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4810)

___

### getWorkflowInstanceWithSnapshot

▸ **getWorkflowInstanceWithSnapshot**(`instanceId`): `Promise`\<``null`` \| [`WorkflowInstanceWithSnapshot`](../interfaces/WorkflowInstanceWithSnapshot.md)\>

Get a workflow instance with its snapshot definition.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

`Promise`\<``null`` \| [`WorkflowInstanceWithSnapshot`](../interfaces/WorkflowInstanceWithSnapshot.md)\>

#### Defined in

[src/matcher.class.ts:4818](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4818)

___

### getWorkflowMetrics

▸ **getWorkflowMetrics**(): `Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

Operational metrics for the workflow engine: active instances, retry
queue depth, DLQ size, and event stream statistics.

#### Returns

`Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

#### Defined in

[src/matcher.class.ts:4960](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4960)

___

### healthCheck

▸ **healthCheck**(): `Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

Perform a health check on Redis connection
Returns true if Redis is healthy, false otherwise

#### Returns

`Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

#### Defined in

[src/matcher.class.ts:766](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L766)

___

### isAutoRoutingWeightsSyncRunning

▸ **isAutoRoutingWeightsSyncRunning**(): `boolean`

Whether the automatic learned-weights sync tick is running.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:1870](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1870)

___

### isDecisionTracesEnabled

▸ **isDecisionTracesEnabled**(): `boolean`

Current runtime decision-trace persistence state.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:1019](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1019)

___

### isFairTiebreakerEnabled

▸ **isFairTiebreakerEnabled**(): `boolean`

Current runtime fair-tiebreaker state.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L942)

___

### isMaintenanceRunning

▸ **isMaintenanceRunning**(): `boolean`

Whether the maintenance tick is currently running.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:5884](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5884)

___

### isUserPaused

▸ **isUserPaused**(`userId`): `Promise`\<`boolean`\>

Whether a user is currently paused.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:2273](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2273)

___

### listRecurringAssignments

▸ **listRecurringAssignments**(): `Promise`\<[`RecurringAssignmentRecord`](../interfaces/RecurringAssignmentRecord.md)[]\>

Every recurring template with its clock, soonest next occurrence first.

#### Returns

`Promise`\<[`RecurringAssignmentRecord`](../interfaces/RecurringAssignmentRecord.md)[]\>

#### Defined in

[src/matcher.class.ts:5536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5536)

___

### listWorkflowDefinitions

▸ **listWorkflowDefinitions**(): `Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

List all registered workflow definitions.

#### Returns

`Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

#### Defined in

[src/matcher.class.ts:4763](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4763)

___

### listWorkflowInstances

▸ **listWorkflowInstances**(`query?`): `Promise`\<[`WorkflowInstancePage`](../interfaces/WorkflowInstancePage.md)\>

List workflow instances (runs), newest-created first, optionally
filtered by status and/or workflow definition. Paginated via an opaque
cursor from the previous page's `nextCursor`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`WorkflowInstanceQuery`](../interfaces/WorkflowInstanceQuery.md) |

#### Returns

`Promise`\<[`WorkflowInstancePage`](../interfaces/WorkflowInstancePage.md)\>

#### Defined in

[src/matcher.class.ts:4836](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4836)

___

### matchUsersAssignments

▸ **matchUsersAssignments**(`userId?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId?` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[WorkflowHost](../interfaces/WorkflowHost.md).[matchUsersAssignments](../interfaces/WorkflowHost.md#matchusersassignments)

#### Defined in

[src/matcher.class.ts:3958](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L3958)

___

### pauseUser

▸ **pauseUser**(`userId`): `Promise`\<`boolean`\>

Pause a user: they stop receiving new assignments in every matching path
until resumed, but keep their pending backlog and can still accept,
complete, reject, or fail work they already hold. Paused users are also
exempt from idle auto-removal (pausing is deliberate absence, not
idleness). Idempotent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`boolean`\>

false when the user is not in the pool (nothing is recorded)

#### Defined in

[src/matcher.class.ts:2237](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2237)

___

### previewMatch

▸ **previewMatch**(`input`, `opts?`): `Promise`\<[`MatchPreview`](../interfaces/MatchPreview.md)\>

Preview which users would be candidates for a hypothetical assignment
without creating it or claiming anything. Uses the same scoring, hard
rules, and learning re-ranking as real matching, so the ranked result
matches what `explainMatch()` would report if the assignment were added.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`MatchPreviewInput`](../interfaces/MatchPreviewInput.md) |
| `opts?` | `Object` |
| `opts.userIds?` | `string`[] |

#### Returns

`Promise`\<[`MatchPreview`](../interfaces/MatchPreview.md)\>

#### Defined in

[src/matcher.class.ts:1267](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1267)

___

### processCompletedAssignmentsRetention

▸ **processCompletedAssignmentsRetention**(): `Promise`\<[`RetentionSweepResult`](../modules.md#retentionsweepresult)\>

Purge terminal assignments older than `completedAssignmentsRetentionMs`.

The completed store has no expiry of its own — an accepted assignment's
deadlines all die at accept — so without this sweep it grows forever on
busy deployments. The terminal-timestamp index (`completedAssignmentsAt`,
written atomically with each completed hSet) keeps the steady-state pass
O(eligible) — the same shape as every other deadline sweep — and purges
are capped per pass, so enabling retention on a deployment with a large
historical store drains it across ticks instead of in one deletion
storm. The window applies retroactively: pre-existing records older
than it are purged too. Entries without a terminal timestamp
(externally injected or corrupt) are never indexed and never deleted.
No-op, reporting zero, when no retention window is configured.

#### Returns

`Promise`\<[`RetentionSweepResult`](../modules.md#retentionsweepresult)\>

#### Defined in

[src/matcher.class.ts:5714](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5714)

___

### processCompletionDeadlines

▸ **processCompletionDeadlines**(): `Promise`\<[`CompletionDeadlineSweepResult`](../modules.md#completiondeadlinesweepresult)\>

Sweep accepted assignments whose completion deadline
(`sla.completeWithinMs`, measured from accept) has elapsed.

Each breached entry is removed from the deadline index before the
action runs, so a breach fires exactly once: a `'notify'` breach does
not re-fire every tick, and a `'requeue'`d assignment only gets a
fresh completion clock on its next accept.

#### Returns

`Promise`\<[`CompletionDeadlineSweepResult`](../modules.md#completiondeadlinesweepresult)\>

#### Defined in

[src/matcher.class.ts:5122](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5122)

___

### processExpiredMatches

▸ **processExpiredMatches**(): `Promise`\<`number`\>

Backwards-compatible alias of `processResponseDeadlines()` returning
only the number of expired assignments.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:5108](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5108)

___

### processExpiredWorkflowSteps

▸ **processExpiredWorkflowSteps**(): `Promise`\<`number`\>

Check and process expired workflow steps.
Should be called periodically.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:4868](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4868)

___

### processIdleUsers

▸ **processIdleUsers**(): `Promise`\<`string`[]\>

Detect users that have been idle longer than idleUserTimeoutMs while
holding pending (unactioned) assignments. Idle users are removed from
the matching pool and their pending assignments are requeued for
distribution to other users.

No-op (returns []) when idleUserTimeoutMs is not configured.

#### Returns

`Promise`\<`string`[]\>

IDs of users that were removed

#### Defined in

[src/matcher.class.ts:5942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5942)

___

### processRecurringAssignments

▸ **processRecurringAssignments**(): `Promise`\<[`RecurrenceSweepResult`](../modules.md#recurrencesweepresult)\>

Sweep the recurring templates: materialize every due slot (one interval
ahead of its open time, so the next occurrence is visible in the
scheduled store before its window opens) and retire templates whose
bound (`until` / `maxOccurrences`) is reached.

Claims are one-shot zRems like the scheduled sweep, so concurrent
replicas skip templates another sweep already took. A crashed pass is
healed two ways: the due index is re-derived from the template hash at
the top of every sweep (missing entries re-indexed as due now, NX so a
live score is never clobbered), and occurrence ids are deterministic,
so re-materializing a slot that already landed is an idempotent re-add.

#### Returns

`Promise`\<[`RecurrenceSweepResult`](../modules.md#recurrencesweepresult)\>

#### Defined in

[src/matcher.class.ts:5557](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5557)

___

### processResponseDeadlines

▸ **processResponseDeadlines**(): `Promise`\<[`EscalationSweepResult`](../modules.md#escalationsweepresult)\>

Requeue pending assignments whose response deadline elapsed, applying
each assignment's `EscalationPolicy` when it has one.

Assignments without a policy take exactly the path they always did: the
owner loses the assignment, it returns to the open pool, and they may
win it again. With a policy the non-responder can be blocked, the
priority can climb, the tier tags can advance, and an exhausted ladder
can park the assignment instead of recirculating it forever.

The wait clock (`assignmentsQueuedAt`) always survives: the requeue goes
through `addAssignment()`, whose `NX` keeps the original first-enqueue
time, so `oldestWaitingMs` measures the work item and not the tier.

#### Returns

`Promise`\<[`EscalationSweepResult`](../modules.md#escalationsweepresult)\>

#### Defined in

[src/matcher.class.ts:4979](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4979)

___

### processScheduledAssignments

▸ **processScheduledAssignments**(): `Promise`\<[`ScheduleSweepResult`](../modules.md#schedulesweepresult)\>

Sweep the schedule clocks: close offer windows (`schedule.notAfter`)
that elapsed while un-accepted, then enqueue held assignments whose
`notBefore` arrived. Misses run first so an assignment whose whole
window is already past parks/drops directly instead of transiting the
queue. Each zset entry fires once: the zRem claim makes concurrent
replicas skip entries another sweep already took.

#### Returns

`Promise`\<[`ScheduleSweepResult`](../modules.md#schedulesweepresult)\>

#### Defined in

[src/matcher.class.ts:5322](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5322)

___

### processSlaExpiries

▸ **processSlaExpiries**(): `Promise`\<[`SlaExpirySweepResult`](../modules.md#slaexpirysweepresult)\>

Sweep assignments whose freshness TTL (`sla.expireAfterMs`, measured
from first enqueue) has elapsed. Applies in every state — queued,
pending, accepted — because stale work is stale regardless of who
holds it.

#### Returns

`Promise`\<[`SlaExpirySweepResult`](../modules.md#slaexpirysweepresult)\>

#### Defined in

[src/matcher.class.ts:5224](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5224)

___

### processWorkflowEvents

▸ **processWorkflowEvents**(`maxEvents?`): `Promise`\<`number`\>

Non-blocking drain of up to `maxEvents` due workflow events. Intended
for hosts that sweep many matcher instances periodically rather than
running `startOrchestrator()`'s dedicated blocking loop per instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxEvents?` | `number` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:4878](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4878)

___

### pruneWorkflowInstances

▸ **pruneWorkflowInstances**(`olderThanMs`): `Promise`\<`number`\>

Remove terminal workflow instances last updated more than olderThanMs
ago, including registry, per-user, and index entries.

#### Parameters

| Name | Type |
| :------ | :------ |
| `olderThanMs` | `number` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:4951](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4951)

___

### publishWorkflowEvent

▸ **publishWorkflowEvent**(`event`): `Promise`\<`string`\>

Publish a workflow event to the Redis Stream.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`WorkflowEvent`](../interfaces/WorkflowEvent.md) |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/matcher.class.ts:4886](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4886)

___

### reclaimOrphanedMessages

▸ **reclaimOrphanedMessages**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:680](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L680)

___

### recordLearningFeedback

▸ **recordLearningFeedback**(`assignmentId`, `signals`, `options?`): `Promise`\<`boolean`\>

Feed external post-processing signals into the model for an assignment
(e.g. { accuracy: 0.95, csat: 0.8 }). Works for live decisions and for
archived episodes of already-completed assignments (within the feedback TTL).
Signal values are weighted via the `learningSignalWeights` option (default 1).
Returns false when no learning context exists for the assignment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assignmentId` | `string` | - |
| `signals` | [`LearningSignals`](../modules.md#learningsignals) | - |
| `options?` | `Object` | - |
| `options.decisionId?` | `string` | Which attempt the feedback belongs to. Required when the assignment has both a live attempt and an archived one — after a reassignment, assignment-addressed feedback is ambiguous and is rejected rather than guessed. |
| `options.eventId?` | `string` | Idempotency token: replaying the same id applies once |
| `options.expectedUserId?` | `string` | Reject unless the attempt belongs to this worker |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:877](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L877)

___

### recordLearningReward

▸ **recordLearningReward**(`assignmentId`, `reward`, `options?`): `Promise`\<`boolean`\>

Apply a manual reward to a matched assignment's decision context.
Enables custom reward shaping beyond the built-in lifecycle outcomes.
Returns false when no decision context exists for the assignment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assignmentId` | `string` | - |
| `reward` | `number` | - |
| `options?` | `Object` | - |
| `options.eventId?` | `string` | Idempotency token: replaying the same id applies once |
| `options.expectedUserId?` | `string` | Reject unless the in-flight attempt belongs to this worker |
| `options.terminal?` | `boolean` | Close the learning episode (default true, matching the previous behaviour). Pass `false` to shape a reward mid-attempt and let later lifecycle outcomes still produce their own labels. |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:828](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L828)

___

### registerMachineHandler

▸ **registerMachineHandler**(`name`, `handler`): `void`

Register a machine task handler by name. Machine steps with a matching
machineTask.handler run through this handler; unmatched handlers fall
back to the executeMachineTask host hook.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `handler` | [`MachineTaskHandler`](../modules.md#machinetaskhandler) |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:4925](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4925)

___

### registerWorkflow

▸ **registerWorkflow**(`definition`): `Promise`\<[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)\>

Register a new workflow definition.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md) \| [`WorkflowDefinitionInput`](../interfaces/WorkflowDefinitionInput.md) |

#### Returns

`Promise`\<[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)\>

#### Defined in

[src/matcher.class.ts:4747](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4747)

___

### rejectAssignment

▸ **rejectAssignment**(`userId`, `assignmentId`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `assignmentId` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:4431](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4431)

___

### releaseUserAssignments

▸ **releaseUserAssignments**(`userId`): `Promise`\<`string`[]\>

Requeue every pending (matched but not yet accepted) assignment the user
holds so other users can pick them up — the operator's "this person is
gone, redistribute their work" move, typically paired with `pauseUser`
(which alone deliberately preserves the backlog). Accepted assignments
(work in progress) are never touched. Requeued assignments keep their
original wait clock, and a still-paused user won't win them back until
resumed. Returns the released assignment ids ([] when nothing was held).

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:2267](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2267)

___

### removeAssignment

▸ **removeAssignment**(`id`): `Promise`\<`string`\>

Used by cancelWorkflow to clean up a run's outstanding queued/pending assignment. Skipped if unimplemented.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[WorkflowHost](../interfaces/WorkflowHost.md).[removeAssignment](../interfaces/WorkflowHost.md#removeassignment)

#### Defined in

[src/matcher.class.ts:2053](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2053)

___

### removeRecurringAssignment

▸ **removeRecurringAssignment**(`id`, `opts?`): `Promise`\<`boolean`\>

Remove a recurring template: no further occurrences materialize.
Occurrences already cut from it are ordinary assignments and live on —
`dropScheduled: true` additionally removes the ones still sitting
un-activated in the scheduled store (never queued/pending/accepted
work).

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `opts?` | `Object` |
| `opts.dropScheduled?` | `boolean` |

#### Returns

`Promise`\<`boolean`\>

false when the id was not a recurring template

#### Defined in

[src/matcher.class.ts:5504](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5504)

___

### removeUser

▸ **removeUser**(`userId`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/matcher.class.ts:2125](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2125)

___

### replayDeadLetterEvent

▸ **replayDeadLetterEvent**(`eventJson`): `Promise`\<`boolean`\>

Replay a Dead Letter Queue event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventJson` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:704](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L704)

___

### resetLearningModel

▸ **resetLearningModel**(): `Promise`\<`void`\>

Reset the learned model weights and statistics.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:911](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L911)

___

### resumeUser

▸ **resumeUser**(`userId`): `Promise`\<`boolean`\>

Resume a paused user so matching considers them again on the next pass.
Also records activity (resets the idle clock).

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`boolean`\>

false when the user was not paused

#### Defined in

[src/matcher.class.ts:2251](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2251)

___

### revertLearnedRoutingWeights

▸ **revertLearnedRoutingWeights**(`userId?`): `Promise`\<`string`[]\>

Revert learned routing weights for one user (or all users with a
snapshot) to the map saved before the last sync. No-op when no snapshot
exists.

Returns reverted user ids.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId?` | `string` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:1803](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1803)

___

### runMaintenanceOnce

▸ **runMaintenanceOnce**(`options?`): `Promise`\<[`MaintenanceReport`](../modules.md#maintenancereport)\>

Run every enabled maintenance sweep once: response deadlines and
escalations, workflow step timeouts, and idle-user release.

Deadlines are not self-firing — something has to sweep them. Hosts that
already own a tick (a multi-tenant worker, a serverless schedule) should
call this instead of holding a timer per matcher; everyone else should
call `startMaintenance()` once and forget about it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`MaintenanceOptions`](../modules.md#maintenanceoptions) |

#### Returns

`Promise`\<[`MaintenanceReport`](../modules.md#maintenancereport)\>

#### Defined in

[src/matcher.class.ts:5779](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5779)

___

### setAssignmentPriority

▸ **setAssignmentPriority**(`id`, `priority`): `Promise`\<\{ `id`: `string` ; `priority`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `priority` | `number` |

#### Returns

`Promise`\<\{ `id`: `string` ; `priority`: `number`  }\>

#### Defined in

[src/matcher.class.ts:2623](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2623)

___

### setAssignmentPriorityByTags

▸ **setAssignmentPriorityByTags**(`tags`, `priority`): `Promise`\<\{ `id`: `string` = assignment.id; `priority`: `number`  }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tags` | `string`[] |
| `priority` | `number` |

#### Returns

`Promise`\<\{ `id`: `string` = assignment.id; `priority`: `number`  }[]\>

#### Defined in

[src/matcher.class.ts:2664](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2664)

___

### setDecisionTraces

▸ **setDecisionTraces**(`enabled`): `void`

Toggle decision-trace persistence at runtime without reconstructing the
matcher. Takes effect on the next matching pass (a pass already in
flight keeps the value it started with).

#### Parameters

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1014](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1014)

___

### setFairTiebreaker

▸ **setFairTiebreaker**(`enabled`): `void`

Toggle fair-tiebreaker global best-match arbitration at runtime.
See `MatcherOptions.enableFairTiebreaker` for what this changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:937](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L937)

___

### setFairness

▸ **setFairness**(`mode`): `void`

Switch the bulk-matching fairness policy at runtime — shorthand for
`setFairnessConfig({ fairness: mode })`. See `MatcherOptions.fairness`
for what each mode does.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | [`FairnessMode`](../modules.md#fairnessmode) |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:951](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L951)

___

### setFairnessConfig

▸ **setFairnessConfig**(`config`): `void`

Retune any subset of the bulk-matching fairness knobs at runtime without
reconstructing the matcher. Absent fields are left unchanged; the new
values take effect on the next `matchUsersAssignments()` call (a match
already in flight keeps the values it started with). Merge semantics
mirror the constructor exactly — in particular, an explicit `fairness`
overrides `enableFairTiebreaker`. See `MatcherOptions` for each field.

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`FairnessConfig`](../interfaces/FairnessConfig.md) |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:963](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L963)

___

### setLearningShadowMode

▸ **setLearningShadowMode**(`enabled`): `Promise`\<`void`\>

Toggle learning shadow mode at runtime without losing model/state.

`true`: learn-only, ranking unaffected.
`false`: learning predictions can influence ranking.

#### Parameters

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:922](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L922)

___

### setTracer

▸ **setTracer**(`tracer`): `void`

Set the OpenTelemetry tracer instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tracer` | `any` |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1902](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1902)

___

### startAutoReleaseInterval

▸ **startAutoReleaseInterval**(`intervalMs?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `intervalMs` | `number` | `10000` |

#### Returns

`void`

**`Deprecated`**

Use `startMaintenance()`, which also sweeps workflow step timeouts.

#### Defined in

[src/matcher.class.ts:5904](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5904)

___

### startAutoRoutingWeightsSync

▸ **startAutoRoutingWeightsSync**(`intervalMs?`): `void`

Start the automatic learned-weights sync tick. Idempotent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `intervalMs?` | `number` |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1847](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1847)

___

### startIdleUserInterval

▸ **startIdleUserInterval**(`intervalMs?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `intervalMs` | `number` | `10000` |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:6031](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L6031)

___

### startMaintenance

▸ **startMaintenance**(`options?`): `void`

Start the periodic maintenance tick. Idempotent; a second call with
different options replaces the first.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`MaintenanceOptions`](../modules.md#maintenanceoptions) | which sweeps to run, plus `intervalMs` (default 5000) for the tick itself |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:5856](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5856)

___

### startOrchestrator

▸ **startOrchestrator**(): `Promise`\<`void`\>

Start the workflow orchestrator.
This listens to the event stream and processes workflow transitions.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:4907](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4907)

___

### startWorkflow

▸ **startWorkflow**(`workflowDefinitionId`, `userId`, `initialContext?`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

Start a new workflow instance for a user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `workflowDefinitionId` | `string` |
| `userId` | `string` |
| `initialContext?` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

#### Defined in

[src/matcher.class.ts:4798](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4798)

___

### stopAutoReleaseInterval

▸ **stopAutoReleaseInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:5911](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5911)

___

### stopAutoRoutingWeightsSync

▸ **stopAutoRoutingWeightsSync**(): `void`

Stop the automatic learned-weights sync tick. Safe when not started.

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1862](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1862)

___

### stopIdleUserInterval

▸ **stopIdleUserInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:6038](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L6038)

___

### stopMaintenance

▸ **stopMaintenance**(): `void`

Stop the periodic maintenance tick. Safe to call when not started.

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:5875](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5875)

___

### stopOrchestrator

▸ **stopOrchestrator**(): `Promise`\<`void`\>

Stop the workflow orchestrator.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:4915](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4915)

___

### syncLearnedRoutingWeights

▸ **syncLearnedRoutingWeights**(`userId?`, `opts?`): `Promise`\<`Record`\<`string`, `Record`\<`string`, `number`\>\>\>

Apply learned routing weights to one user (or every tracked user when
no id is given), automating tags/weights generation from RL outcomes.

Merge semantics: learned tags always take their learned value; manual
routingWeights entries for tags the learner has no data on are
preserved (set `opts.overrideManual` to replace the map entirely).
The applied learned map is stored on the user as `learnedRoutingWeights`
for observability.

Guardrails: evidence floor (`minTotalSamples`), strict veto gate for
manual tags (`minSamplesForVeto`), and per-sync step clamp
(`maxDeltaPerSync`) are applied automatically. Set `dryRun: true` to
compute the would-be map without writing anything.

Returns the applied weights per user id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId?` | `string` |
| `opts?` | `Object` |
| `opts.dryRun?` | `boolean` |
| `opts.includeUnexploredTags?` | `boolean` |
| `opts.overrideManual?` | `boolean` |

#### Returns

`Promise`\<`Record`\<`string`, `Record`\<`string`, `number`\>\>\>

#### Defined in

[src/matcher.class.ts:1706](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L1706)

___

### touchUser

▸ **touchUser**(`userId`): `Promise`\<`void`\>

Record activity for a user (heartbeat). Resets the idle clock used by
processIdleUsers(). Called automatically on addUser, acceptAssignment,
and rejectAssignment; consumers can also call it directly as a heartbeat.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:5927](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5927)

___

### trainLearningSamples

▸ **trainLearningSamples**(`samples`): `Promise`\<`number`\>

Train the model directly with raw (features, reward) samples from an
external pipeline (offline evaluation jobs, historical data imports).
Returns the number of samples applied.

#### Parameters

| Name | Type |
| :------ | :------ |
| `samples` | [`LearningSample`](../interfaces/LearningSample.md)[] |

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:903](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L903)

___

### trimWorkflowEventStream

▸ **trimWorkflowEventStream**(): `Promise`\<`number`\>

Trim the workflow event stream up to the consumption frontier — every
entry delivered *and* acknowledged by every consumer group. Never trims
ahead of consumers, so no event can be lost to trimming. Runs
automatically after event processing and on the reclaim interval when
`workflowEventStreamAutoTrim` is set; callable directly otherwise.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:4898](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L4898)

___

### unparkAssignment

▸ **unparkAssignment**(`id`, `opts?`): `Promise`\<`boolean`\>

Return a parked assignment to the queue, optionally resetting its
escalation level so the ladder can run again from the top.

`resetSla` clears the first-enqueue clock and rejection counter.
Without it an unparked assignment whose freshness TTL already elapsed
will simply expire again on the next TTL sweep.

`resetSchedule` strips the schedule policy. Without it an assignment
parked by a missed offer window (`schedule.notAfter`) will simply
miss again on the next scheduled sweep.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `opts?` | `Object` |
| `opts.resetEscalation?` | `boolean` |
| `opts.resetSchedule?` | `boolean` |
| `opts.resetSla?` | `boolean` |

#### Returns

`Promise`\<`boolean`\>

false when the id was not parked

#### Defined in

[src/matcher.class.ts:5655](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L5655)

___

### updateAssignment

▸ **updateAssignment**(`id`, `patch`): `Promise`\<``null`` \| [`UpdateAssignmentResult`](../interfaces/UpdateAssignmentResult.md)\>

Edit a task that already exists — including one somebody is holding.

Creation is not the last moment a task's facts are known: a title is
wrong, a description gains the detail that was missing, and — the one
that matters here — the routing tags turn out to describe the wrong kind
of work. `tags` and `priority` decide who should have the task, so
changing them is not a metadata write; it is a re-statement of who this
work is for.

The rule, applied in every state: **retag always, then re-check the
holder.** The new tags are written wherever the task lives, and if the
task is out with somebody, that person is scored against the new tag set
exactly as organic matching would score them. Still eligible and they
keep it — including work they have already accepted, because nothing
about the job changed for them. No longer eligible and the task is taken
back and returned to the queue (`requeued: true`), where the next pass
offers it to somebody the new tags actually reach. That is the whole of
the redistribution: this method never picks the replacement, it only
puts the work back where matching can find it.

An edit that does not touch the tags never moves anything, whoever holds
the task and however they came by it — a typo fixed in a title is not a
reason to pull a job off the person doing it. `updateAssignment` is also
the only path that re-checks eligibility mid-flight; `assignToUser`
remains the operator's deliberate override and is unaffected.

Terminal work cannot be edited: a completed or failed task is a record
of what happened. Returns `null` when no live record exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `patch` | [`AssignmentUpdate`](../interfaces/AssignmentUpdate.md) |

#### Returns

`Promise`\<``null`` \| [`UpdateAssignmentResult`](../interfaces/UpdateAssignmentResult.md)\>

**`Example`**

```typescript
const result = await matcher.updateAssignment('job-12', {
    title: 'Leaking kitchen tap',
    tags: ['plumbing', 'urgent'],
});
if (result?.requeued) {
    // the previous holder no longer matches — it is back in the queue
}
```

#### Defined in

[src/matcher.class.ts:2761](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2761)

___

### userExists

▸ **userExists**(`userId`): `Promise`\<`boolean`\>

Whether a user is registered in the pool. Used by the workflow engine
(via the WorkflowHost interface) to validate an initiator before
starting a run that targets 'initiator'.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[WorkflowHost](../interfaces/WorkflowHost.md).[userExists](../interfaces/WorkflowHost.md#userexists)

#### Defined in

[src/matcher.class.ts:2157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L2157)

___

### waitUntilReady

▸ **waitUntilReady**(): `Promise`\<[`AssignmentMatcher`](AssignmentMatcher.md)\>

Wait until the matcher has connected and initialized workflow internals.

#### Returns

`Promise`\<[`AssignmentMatcher`](AssignmentMatcher.md)\>

#### Defined in

[src/matcher.class.ts:640](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/matcher.class.ts#L640)
