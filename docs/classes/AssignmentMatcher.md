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
- [addUser](AssignmentMatcher.md#adduser)
- [assignToUser](AssignmentMatcher.md#assigntouser)
- [atomicWorkflowTransition](AssignmentMatcher.md#atomicworkflowtransition)
- [backfillWorkflowIndexes](AssignmentMatcher.md#backfillworkflowindexes)
- [cancelWorkflow](AssignmentMatcher.md#cancelworkflow)
- [checkDeadLetterQueueAlert](AssignmentMatcher.md#checkdeadletterqueuealert)
- [clearDeadLetterQueue](AssignmentMatcher.md#cleardeadletterqueue)
- [clearDecisionTraces](AssignmentMatcher.md#cleardecisiontraces)
- [completeAssignment](AssignmentMatcher.md#completeassignment)
- [completeWorkflowStep](AssignmentMatcher.md#completeworkflowstep)
- [deleteWorkflowDefinition](AssignmentMatcher.md#deleteworkflowdefinition)
- [drainScheduledRetries](AssignmentMatcher.md#drainscheduledretries)
- [executeWorkflow](AssignmentMatcher.md#executeworkflow)
- [explainMatch](AssignmentMatcher.md#explainmatch)
- [failAssignment](AssignmentMatcher.md#failassignment)
- [getActiveWorkflowsForUser](AssignmentMatcher.md#getactiveworkflowsforuser)
- [getAllAssignments](AssignmentMatcher.md#getallassignments)
- [getAssignment](AssignmentMatcher.md#getassignment)
- [getAssignmentCounts](AssignmentMatcher.md#getassignmentcounts)
- [getAssignmentsByIds](AssignmentMatcher.md#getassignmentsbyids)
- [getAssignmentsPaginated](AssignmentMatcher.md#getassignmentspaginated)
- [getAuditEvents](AssignmentMatcher.md#getauditevents)
- [getCircuitBreakerState](AssignmentMatcher.md#getcircuitbreakerstate)
- [getCurrentAssignmentsForUser](AssignmentMatcher.md#getcurrentassignmentsforuser)
- [getDeadLetterEvents](AssignmentMatcher.md#getdeadletterevents)
- [getDeadLetterQueueSize](AssignmentMatcher.md#getdeadletterqueuesize)
- [getDecisionTraces](AssignmentMatcher.md#getdecisiontraces)
- [getEscalationLevel](AssignmentMatcher.md#getescalationlevel)
- [getFairness](AssignmentMatcher.md#getfairness)
- [getFairnessConfig](AssignmentMatcher.md#getfairnessconfig)
- [getLearnedRoutingWeights](AssignmentMatcher.md#getlearnedroutingweights)
- [getLearnedTagStats](AssignmentMatcher.md#getlearnedtagstats)
- [getLearningModel](AssignmentMatcher.md#getlearningmodel)
- [getLearningShadowMode](AssignmentMatcher.md#getlearningshadowmode)
- [getLearningStats](AssignmentMatcher.md#getlearningstats)
- [getParkedAssignments](AssignmentMatcher.md#getparkedassignments)
- [getPausedUsers](AssignmentMatcher.md#getpausedusers)
- [getPendingAssignmentsWithAge](AssignmentMatcher.md#getpendingassignmentswithage)
- [getQueueStats](AssignmentMatcher.md#getqueuestats)
- [getReliabilityMetrics](AssignmentMatcher.md#getreliabilitymetrics)
- [getSlaStats](AssignmentMatcher.md#getslastats)
- [getUser](AssignmentMatcher.md#getuser)
- [getUsers](AssignmentMatcher.md#getusers)
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
- [listWorkflowDefinitions](AssignmentMatcher.md#listworkflowdefinitions)
- [listWorkflowInstances](AssignmentMatcher.md#listworkflowinstances)
- [matchUsersAssignments](AssignmentMatcher.md#matchusersassignments)
- [pauseUser](AssignmentMatcher.md#pauseuser)
- [previewMatch](AssignmentMatcher.md#previewmatch)
- [processCompletionDeadlines](AssignmentMatcher.md#processcompletiondeadlines)
- [processExpiredMatches](AssignmentMatcher.md#processexpiredmatches)
- [processExpiredWorkflowSteps](AssignmentMatcher.md#processexpiredworkflowsteps)
- [processIdleUsers](AssignmentMatcher.md#processidleusers)
- [processResponseDeadlines](AssignmentMatcher.md#processresponsedeadlines)
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
- [unparkAssignment](AssignmentMatcher.md#unparkassignment)
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

[src/matcher.class.ts:262](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L262)

## Properties

### acceptedAssignmentsKey

• **acceptedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:216](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L216)

___

### allTagsKey

• **allTagsKey**: `string`

#### Defined in

[src/matcher.class.ts:215](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L215)

___

### assignmentOwnerKey

• **assignmentOwnerKey**: `string`

#### Defined in

[src/matcher.class.ts:214](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L214)

___

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L205)

___

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:206](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L206)

___

### completedAssignmentsKey

• **completedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:226](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L226)

___

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:209](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L209)

___

### idleUserTimeoutMs

• **idleUserTimeoutMs**: ``null`` \| `number`

#### Defined in

[src/matcher.class.ts:211](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L211)

___

### matchExpirationMs

• **matchExpirationMs**: `number`

#### Defined in

[src/matcher.class.ts:210](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L210)

___

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:208](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L208)

___

### pendingAssignmentsExpiryKey

• **pendingAssignmentsExpiryKey**: `string`

#### Defined in

[src/matcher.class.ts:213](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L213)

___

### pendingAssignmentsKey

• **pendingAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:212](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L212)

___

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\>

#### Defined in

[src/matcher.class.ts:263](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L263)

___

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L204)

___

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L203)

___

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:207](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L207)

## Accessors

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:1939](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1939)

___

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:1953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1953)

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

[src/matcher.class.ts:2994](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L2994)

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

[src/matcher.class.ts:1510](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1510)

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

[src/matcher.class.ts:1493](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1493)

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

[src/matcher.class.ts:2868](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L2868)

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

[src/matcher.class.ts:527](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L527)

___

### backfillWorkflowIndexes

▸ **backfillWorkflowIndexes**(): `Promise`\<`number`\>

Backfill workflow indexes (active-instance index) from records created
before these indexes existed. Safe to run multiple times.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:3496](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3496)

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

[src/matcher.class.ts:3410](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3410)

___

### checkDeadLetterQueueAlert

▸ **checkDeadLetterQueueAlert**(): `Promise`\<`boolean`\>

Check if Dead Letter Queue size exceeds alert threshold

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:624](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L624)

___

### clearDeadLetterQueue

▸ **clearDeadLetterQueue**(): `Promise`\<`number`\>

Clear all events from the Dead Letter Queue.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:587](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L587)

___

### clearDecisionTraces

▸ **clearDecisionTraces**(): `Promise`\<`number`\>

Delete all recorded decision traces.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:848](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L848)

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

[src/matcher.class.ts:3187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3187)

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

[src/matcher.class.ts:3421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3421)

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

[src/matcher.class.ts:3338](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3338)

___

### drainScheduledRetries

▸ **drainScheduledRetries**(): `Promise`\<`number`\>

Process due delayed event retries. Called automatically by the
orchestrator; exposed for deployments that run their own schedulers.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:3487](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3487)

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

[src/matcher.class.ts:3346](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3346)

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

[src/matcher.class.ts:866](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L866)

___

### failAssignment

▸ **failAssignment**(`userId`, `assignmentId`, `reason?`): `Promise`\<`boolean`\>

Fail an assignment explicitly (e.g., user reports inability to complete).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The user failing the assignment |
| `assignmentId` | `string` | The assignment being failed |
| `reason?` | `string` | Optional reason for failure |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:3254](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3254)

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

[src/matcher.class.ts:3392](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3392)

___

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Get all assignments (queued, pending, and accepted).
For large datasets, prefer using getAssignmentsPaginated() instead.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:1755](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1755)

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

[src/matcher.class.ts:1783](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1783)

___

### getAssignmentCounts

▸ **getAssignmentCounts**(): `Promise`\<[`AssignmentCounts`](../interfaces/AssignmentCounts.md)\>

Get assignment counts by status without fetching the data.
Efficient for dashboards and monitoring.

#### Returns

`Promise`\<[`AssignmentCounts`](../interfaces/AssignmentCounts.md)\>

#### Defined in

[src/matcher.class.ts:1775](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1775)

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

[src/matcher.class.ts:1791](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1791)

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

[src/matcher.class.ts:1766](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1766)

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

[src/matcher.class.ts:595](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L595)

___

### getCircuitBreakerState

▸ **getCircuitBreakerState**(): `Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

Get current circuit breaker state

#### Returns

`Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

#### Defined in

[src/matcher.class.ts:616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L616)

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

[src/matcher.class.ts:2844](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L2844)

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

[src/matcher.class.ts:555](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L555)

___

### getDeadLetterQueueSize

▸ **getDeadLetterQueueSize**(): `Promise`\<`number`\>

Get Dead Letter Queue size.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:563](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L563)

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

[src/matcher.class.ts:842](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L842)

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

[src/matcher.class.ts:3890](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3890)

___

### getFairness

▸ **getFairness**(): [`FairnessMode`](../modules.md#fairnessmode)

Current runtime fairness policy.

#### Returns

[`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/matcher.class.ts:790](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L790)

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

[src/matcher.class.ts:796](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L796)

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

[src/matcher.class.ts:1265](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1265)

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

[src/matcher.class.ts:1251](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1251)

___

### getLearningModel

▸ **getLearningModel**(): `Promise`\<`Record`\<`string`, `string`\>\>

Get the learned model weights (feature -> weight).

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Defined in

[src/matcher.class.ts:677](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L677)

___

### getLearningShadowMode

▸ **getLearningShadowMode**(): `Promise`\<`boolean`\>

Current runtime shadow mode state.

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:742](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L742)

___

### getLearningStats

▸ **getLearningStats**(): `Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

Get aggregate learning statistics (decisions, rewards, average reward).

#### Returns

`Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

#### Defined in

[src/matcher.class.ts:685](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L685)

___

### getParkedAssignments

▸ **getParkedAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Assignments held out of matching because their escalation ladder was
exhausted under `onExhausted: 'park'` — nobody answered, all the way up.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:3852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3852)

___

### getPausedUsers

▸ **getPausedUsers**(): `Promise`\<`string`[]\>

IDs of all currently paused users.

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:1745](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1745)

___

### getPendingAssignmentsWithAge

▸ **getPendingAssignmentsWithAge**(): `Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

Get all pending assignments with owner and pending duration metadata.

#### Returns

`Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

#### Defined in

[src/matcher.class.ts:1842](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1842)

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

[src/matcher.class.ts:1803](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1803)

___

### getReliabilityMetrics

▸ **getReliabilityMetrics**(): `Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

Get comprehensive reliability metrics including circuit breaker state,
Dead Letter Queue size, and Redis health status.

#### Returns

`Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

#### Defined in

[src/matcher.class.ts:608](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L608)

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

[src/matcher.class.ts:458](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L458)

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

[src/matcher.class.ts:1661](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1661)

___

### getUsers

▸ **getUsers**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

All stored users. The pool is small by design; for load metadata see getQueueStats().

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

#### Defined in

[src/matcher.class.ts:1678](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1678)

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

[src/matcher.class.ts:3321](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3321)

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

[src/matcher.class.ts:3376](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3376)

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

[src/matcher.class.ts:3384](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3384)

___

### getWorkflowMetrics

▸ **getWorkflowMetrics**(): `Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

Operational metrics for the workflow engine: active instances, retry
queue depth, DLQ size, and event stream statistics.

#### Returns

`Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

#### Defined in

[src/matcher.class.ts:3514](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3514)

___

### healthCheck

▸ **healthCheck**(): `Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

Perform a health check on Redis connection
Returns true if Redis is healthy, false otherwise

#### Returns

`Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

#### Defined in

[src/matcher.class.ts:633](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L633)

___

### isAutoRoutingWeightsSyncRunning

▸ **isAutoRoutingWeightsSyncRunning**(): `boolean`

Whether the automatic learned-weights sync tick is running.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:1441](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1441)

___

### isDecisionTracesEnabled

▸ **isDecisionTracesEnabled**(): `boolean`

Current runtime decision-trace persistence state.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:833](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L833)

___

### isFairTiebreakerEnabled

▸ **isFairTiebreakerEnabled**(): `boolean`

Current runtime fair-tiebreaker state.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:756](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L756)

___

### isMaintenanceRunning

▸ **isMaintenanceRunning**(): `boolean`

Whether the maintenance tick is currently running.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:3991](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3991)

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

[src/matcher.class.ts:1739](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1739)

___

### listWorkflowDefinitions

▸ **listWorkflowDefinitions**(): `Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

List all registered workflow definitions.

#### Returns

`Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

#### Defined in

[src/matcher.class.ts:3329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3329)

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

[src/matcher.class.ts:3402](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3402)

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

[src/matcher.class.ts:2761](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L2761)

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

[src/matcher.class.ts:1703](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1703)

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

[src/matcher.class.ts:1081](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1081)

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

[src/matcher.class.ts:3675](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3675)

___

### processExpiredMatches

▸ **processExpiredMatches**(): `Promise`\<`number`\>

Backwards-compatible alias of `processResponseDeadlines()` returning
only the number of expired assignments.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:3661](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3661)

___

### processExpiredWorkflowSteps

▸ **processExpiredWorkflowSteps**(): `Promise`\<`number`\>

Check and process expired workflow steps.
Should be called periodically.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:3434](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3434)

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

[src/matcher.class.ts:4046](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L4046)

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

[src/matcher.class.ts:3533](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3533)

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

[src/matcher.class.ts:3768](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3768)

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

[src/matcher.class.ts:3444](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3444)

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

[src/matcher.class.ts:3505](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3505)

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

[src/matcher.class.ts:3452](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3452)

___

### reclaimOrphanedMessages

▸ **reclaimOrphanedMessages**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L547)

___

### recordLearningFeedback

▸ **recordLearningFeedback**(`assignmentId`, `signals`): `Promise`\<`boolean`\>

Feed external post-processing signals into the model for an assignment
(e.g. { accuracy: 0.95, csat: 0.8 }). Works for live decisions and for
archived episodes of already-completed assignments (within the feedback TTL).
Signal values are weighted via the `learningSignalWeights` option (default 1).
Returns false when no learning context exists for the assignment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |
| `signals` | [`LearningSignals`](../modules.md#learningsignals) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:707](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L707)

___

### recordLearningReward

▸ **recordLearningReward**(`assignmentId`, `reward`): `Promise`\<`boolean`\>

Apply a manual reward to a matched assignment's decision context.
Enables custom reward shaping beyond the built-in lifecycle outcomes.
Returns false when no decision context exists for the assignment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |
| `reward` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:695](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L695)

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

[src/matcher.class.ts:3479](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3479)

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

[src/matcher.class.ts:3313](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3313)

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

[src/matcher.class.ts:3061](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3061)

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

[src/matcher.class.ts:1733](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1733)

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

[src/matcher.class.ts:1586](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1586)

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

[src/matcher.class.ts:1641](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1641)

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

[src/matcher.class.ts:571](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L571)

___

### resetLearningModel

▸ **resetLearningModel**(): `Promise`\<`void`\>

Reset the learned model weights and statistics.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:725](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L725)

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

[src/matcher.class.ts:1717](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1717)

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

[src/matcher.class.ts:1376](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1376)

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

[src/matcher.class.ts:3913](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3913)

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

[src/matcher.class.ts:1966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1966)

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

[src/matcher.class.ts:2007](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L2007)

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

[src/matcher.class.ts:828](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L828)

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

[src/matcher.class.ts:751](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L751)

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

[src/matcher.class.ts:765](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L765)

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

[src/matcher.class.ts:777](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L777)

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

[src/matcher.class.ts:736](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L736)

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

[src/matcher.class.ts:1470](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1470)

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

[src/matcher.class.ts:4008](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L4008)

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

[src/matcher.class.ts:1418](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1418)

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

[src/matcher.class.ts:4133](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L4133)

___

### startMaintenance

▸ **startMaintenance**(`options?`): `void`

Start the periodic maintenance tick. Idempotent; a second call with
different options replaces the first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`MaintenanceOptions`](../modules.md#maintenanceoptions) |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:3963](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3963)

___

### startOrchestrator

▸ **startOrchestrator**(): `Promise`\<`void`\>

Start the workflow orchestrator.
This listens to the event stream and processes workflow transitions.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:3461](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3461)

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

[src/matcher.class.ts:3364](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3364)

___

### stopAutoReleaseInterval

▸ **stopAutoReleaseInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:4015](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L4015)

___

### stopAutoRoutingWeightsSync

▸ **stopAutoRoutingWeightsSync**(): `void`

Stop the automatic learned-weights sync tick. Safe when not started.

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1433](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1433)

___

### stopIdleUserInterval

▸ **stopIdleUserInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:4140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L4140)

___

### stopMaintenance

▸ **stopMaintenance**(): `void`

Stop the periodic maintenance tick. Safe to call when not started.

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:3982](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3982)

___

### stopOrchestrator

▸ **stopOrchestrator**(): `Promise`\<`void`\>

Stop the workflow orchestrator.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:3469](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3469)

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

[src/matcher.class.ts:1293](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1293)

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

[src/matcher.class.ts:4031](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L4031)

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

[src/matcher.class.ts:717](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L717)

___

### unparkAssignment

▸ **unparkAssignment**(`id`, `opts?`): `Promise`\<`boolean`\>

Return a parked assignment to the queue, optionally resetting its
escalation level so the ladder can run again from the top.

`resetSla` clears the first-enqueue clock and rejection counter.
Without it an unparked assignment whose freshness TTL already elapsed
will simply expire again on the next TTL sweep.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `opts?` | `Object` |
| `opts.resetEscalation?` | `boolean` |
| `opts.resetSla?` | `boolean` |

#### Returns

`Promise`\<`boolean`\>

false when the id was not parked

#### Defined in

[src/matcher.class.ts:3868](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L3868)

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

[src/matcher.class.ts:1672](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L1672)

___

### waitUntilReady

▸ **waitUntilReady**(): `Promise`\<[`AssignmentMatcher`](AssignmentMatcher.md)\>

Wait until the matcher has connected and initialized workflow internals.

#### Returns

`Promise`\<[`AssignmentMatcher`](AssignmentMatcher.md)\>

#### Defined in

[src/matcher.class.ts:509](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/matcher.class.ts#L509)
