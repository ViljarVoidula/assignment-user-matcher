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
- [atomicWorkflowTransition](AssignmentMatcher.md#atomicworkflowtransition)
- [backfillWorkflowIndexes](AssignmentMatcher.md#backfillworkflowindexes)
- [cancelWorkflow](AssignmentMatcher.md#cancelworkflow)
- [checkDeadLetterQueueAlert](AssignmentMatcher.md#checkdeadletterqueuealert)
- [clearDeadLetterQueue](AssignmentMatcher.md#cleardeadletterqueue)
- [completeAssignment](AssignmentMatcher.md#completeassignment)
- [drainScheduledRetries](AssignmentMatcher.md#drainscheduledretries)
- [executeWorkflow](AssignmentMatcher.md#executeworkflow)
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
- [getFairness](AssignmentMatcher.md#getfairness)
- [getFairnessConfig](AssignmentMatcher.md#getfairnessconfig)
- [getLearnedRoutingWeights](AssignmentMatcher.md#getlearnedroutingweights)
- [getLearnedTagStats](AssignmentMatcher.md#getlearnedtagstats)
- [getLearningModel](AssignmentMatcher.md#getlearningmodel)
- [getLearningShadowMode](AssignmentMatcher.md#getlearningshadowmode)
- [getLearningStats](AssignmentMatcher.md#getlearningstats)
- [getPendingAssignmentsWithAge](AssignmentMatcher.md#getpendingassignmentswithage)
- [getReliabilityMetrics](AssignmentMatcher.md#getreliabilitymetrics)
- [getWorkflowDefinition](AssignmentMatcher.md#getworkflowdefinition)
- [getWorkflowInstance](AssignmentMatcher.md#getworkflowinstance)
- [getWorkflowInstanceWithSnapshot](AssignmentMatcher.md#getworkflowinstancewithsnapshot)
- [getWorkflowMetrics](AssignmentMatcher.md#getworkflowmetrics)
- [healthCheck](AssignmentMatcher.md#healthcheck)
- [isFairTiebreakerEnabled](AssignmentMatcher.md#isfairtiebreakerenabled)
- [listWorkflowDefinitions](AssignmentMatcher.md#listworkflowdefinitions)
- [matchUsersAssignments](AssignmentMatcher.md#matchusersassignments)
- [processExpiredMatches](AssignmentMatcher.md#processexpiredmatches)
- [processExpiredWorkflowSteps](AssignmentMatcher.md#processexpiredworkflowsteps)
- [processIdleUsers](AssignmentMatcher.md#processidleusers)
- [pruneWorkflowInstances](AssignmentMatcher.md#pruneworkflowinstances)
- [publishWorkflowEvent](AssignmentMatcher.md#publishworkflowevent)
- [reclaimOrphanedMessages](AssignmentMatcher.md#reclaimorphanedmessages)
- [recordLearningFeedback](AssignmentMatcher.md#recordlearningfeedback)
- [recordLearningReward](AssignmentMatcher.md#recordlearningreward)
- [registerMachineHandler](AssignmentMatcher.md#registermachinehandler)
- [registerWorkflow](AssignmentMatcher.md#registerworkflow)
- [rejectAssignment](AssignmentMatcher.md#rejectassignment)
- [removeAssignment](AssignmentMatcher.md#removeassignment)
- [removeUser](AssignmentMatcher.md#removeuser)
- [replayDeadLetterEvent](AssignmentMatcher.md#replaydeadletterevent)
- [resetLearningModel](AssignmentMatcher.md#resetlearningmodel)
- [setAssignmentPriority](AssignmentMatcher.md#setassignmentpriority)
- [setAssignmentPriorityByTags](AssignmentMatcher.md#setassignmentprioritybytags)
- [setFairTiebreaker](AssignmentMatcher.md#setfairtiebreaker)
- [setFairness](AssignmentMatcher.md#setfairness)
- [setFairnessConfig](AssignmentMatcher.md#setfairnessconfig)
- [setLearningShadowMode](AssignmentMatcher.md#setlearningshadowmode)
- [setTracer](AssignmentMatcher.md#settracer)
- [startAutoReleaseInterval](AssignmentMatcher.md#startautoreleaseinterval)
- [startIdleUserInterval](AssignmentMatcher.md#startidleuserinterval)
- [startOrchestrator](AssignmentMatcher.md#startorchestrator)
- [startWorkflow](AssignmentMatcher.md#startworkflow)
- [stopAutoReleaseInterval](AssignmentMatcher.md#stopautoreleaseinterval)
- [stopIdleUserInterval](AssignmentMatcher.md#stopidleuserinterval)
- [stopOrchestrator](AssignmentMatcher.md#stoporchestrator)
- [syncLearnedRoutingWeights](AssignmentMatcher.md#synclearnedroutingweights)
- [touchUser](AssignmentMatcher.md#touchuser)
- [trainLearningSamples](AssignmentMatcher.md#trainlearningsamples)
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

[src/matcher.class.ts:174](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L174)

## Properties

### acceptedAssignmentsKey

• **acceptedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:141](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L141)

___

### allTagsKey

• **allTagsKey**: `string`

#### Defined in

[src/matcher.class.ts:140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L140)

___

### assignmentOwnerKey

• **assignmentOwnerKey**: `string`

#### Defined in

[src/matcher.class.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L139)

___

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L130)

___

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:131](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L131)

___

### completedAssignmentsKey

• **completedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L149)

___

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L134)

___

### idleUserTimeoutMs

• **idleUserTimeoutMs**: ``null`` \| `number`

#### Defined in

[src/matcher.class.ts:136](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L136)

___

### matchExpirationMs

• **matchExpirationMs**: `number`

#### Defined in

[src/matcher.class.ts:135](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L135)

___

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:133](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L133)

___

### pendingAssignmentsExpiryKey

• **pendingAssignmentsExpiryKey**: `string`

#### Defined in

[src/matcher.class.ts:138](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L138)

___

### pendingAssignmentsKey

• **pendingAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:137](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L137)

___

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\>

#### Defined in

[src/matcher.class.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L175)

___

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:129](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L129)

___

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L128)

___

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L132)

## Accessors

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:1013](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1013)

___

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:1027](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1027)

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

[src/matcher.class.ts:1731](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1731)

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

[src/matcher.class.ts:749](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L749)

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

[src/matcher.class.ts:732](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L732)

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

[src/matcher.class.ts:316](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L316)

___

### backfillWorkflowIndexes

▸ **backfillWorkflowIndexes**(): `Promise`\<`number`\>

Backfill workflow indexes (active-instance index) from records created
before these indexes existed. Safe to run multiple times.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:2056](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2056)

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

[src/matcher.class.ts:1995](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1995)

___

### checkDeadLetterQueueAlert

▸ **checkDeadLetterQueueAlert**(): `Promise`\<`boolean`\>

Check if Dead Letter Queue size exceeds alert threshold

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:413](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L413)

___

### clearDeadLetterQueue

▸ **clearDeadLetterQueue**(): `Promise`\<`number`\>

Clear all events from the Dead Letter Queue.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:376](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L376)

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

[src/matcher.class.ts:1808](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1808)

___

### drainScheduledRetries

▸ **drainScheduledRetries**(): `Promise`\<`number`\>

Process due delayed event retries. Called automatically by the
orchestrator; exposed for deployments that run their own schedulers.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:2047](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2047)

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

[src/matcher.class.ts:1941](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1941)

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

[src/matcher.class.ts:1861](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1861)

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

[src/matcher.class.ts:1987](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1987)

___

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Get all assignments (queued, pending, and accepted).
For large datasets, prefer using getAssignmentsPaginated() instead.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:872](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L872)

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

[src/matcher.class.ts:900](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L900)

___

### getAssignmentCounts

▸ **getAssignmentCounts**(): `Promise`\<[`AssignmentCounts`](../interfaces/AssignmentCounts.md)\>

Get assignment counts by status without fetching the data.
Efficient for dashboards and monitoring.

#### Returns

`Promise`\<[`AssignmentCounts`](../interfaces/AssignmentCounts.md)\>

#### Defined in

[src/matcher.class.ts:892](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L892)

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

[src/matcher.class.ts:908](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L908)

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

[src/matcher.class.ts:883](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L883)

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

[src/matcher.class.ts:384](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L384)

___

### getCircuitBreakerState

▸ **getCircuitBreakerState**(): `Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

Get current circuit breaker state

#### Returns

`Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

#### Defined in

[src/matcher.class.ts:405](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L405)

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

[src/matcher.class.ts:1723](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1723)

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

[src/matcher.class.ts:344](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L344)

___

### getDeadLetterQueueSize

▸ **getDeadLetterQueueSize**(): `Promise`\<`number`\>

Get Dead Letter Queue size.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:352](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L352)

___

### getFairness

▸ **getFairness**(): [`FairnessMode`](../modules.md#fairnessmode)

Current runtime fairness policy.

#### Returns

[`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/matcher.class.ts:579](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L579)

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

[src/matcher.class.ts:585](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L585)

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

[src/matcher.class.ts:625](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L625)

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

[src/matcher.class.ts:611](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L611)

___

### getLearningModel

▸ **getLearningModel**(): `Promise`\<`Record`\<`string`, `string`\>\>

Get the learned model weights (feature -> weight).

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Defined in

[src/matcher.class.ts:466](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L466)

___

### getLearningShadowMode

▸ **getLearningShadowMode**(): `Promise`\<`boolean`\>

Current runtime shadow mode state.

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:531](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L531)

___

### getLearningStats

▸ **getLearningStats**(): `Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

Get aggregate learning statistics (decisions, rewards, average reward).

#### Returns

`Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

#### Defined in

[src/matcher.class.ts:474](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L474)

___

### getPendingAssignmentsWithAge

▸ **getPendingAssignmentsWithAge**(): `Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

Get all pending assignments with owner and pending duration metadata.

#### Returns

`Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

#### Defined in

[src/matcher.class.ts:916](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L916)

___

### getReliabilityMetrics

▸ **getReliabilityMetrics**(): `Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

Get comprehensive reliability metrics including circuit breaker state,
Dead Letter Queue size, and Redis health status.

#### Returns

`Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

#### Defined in

[src/matcher.class.ts:397](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L397)

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

[src/matcher.class.ts:1925](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1925)

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

[src/matcher.class.ts:1971](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1971)

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

[src/matcher.class.ts:1979](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1979)

___

### getWorkflowMetrics

▸ **getWorkflowMetrics**(): `Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

Operational metrics for the workflow engine: active instances, retry
queue depth, DLQ size, and event stream statistics.

#### Returns

`Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

#### Defined in

[src/matcher.class.ts:2074](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2074)

___

### healthCheck

▸ **healthCheck**(): `Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

Perform a health check on Redis connection
Returns true if Redis is healthy, false otherwise

#### Returns

`Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

#### Defined in

[src/matcher.class.ts:422](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L422)

___

### isFairTiebreakerEnabled

▸ **isFairTiebreakerEnabled**(): `boolean`

Current runtime fair-tiebreaker state.

#### Returns

`boolean`

#### Defined in

[src/matcher.class.ts:545](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L545)

___

### listWorkflowDefinitions

▸ **listWorkflowDefinitions**(): `Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

List all registered workflow definitions.

#### Returns

`Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

#### Defined in

[src/matcher.class.ts:1933](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1933)

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

[src/matcher.class.ts:1666](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1666)

___

### processExpiredMatches

▸ **processExpiredMatches**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:2079](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2079)

___

### processExpiredWorkflowSteps

▸ **processExpiredWorkflowSteps**(): `Promise`\<`number`\>

Check and process expired workflow steps.
Should be called periodically.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:2004](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2004)

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

[src/matcher.class.ts:2160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2160)

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

[src/matcher.class.ts:2065](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2065)

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

[src/matcher.class.ts:2012](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2012)

___

### reclaimOrphanedMessages

▸ **reclaimOrphanedMessages**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:336](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L336)

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

[src/matcher.class.ts:496](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L496)

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

[src/matcher.class.ts:484](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L484)

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

[src/matcher.class.ts:2039](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2039)

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

[src/matcher.class.ts:1917](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1917)

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

[src/matcher.class.ts:1764](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1764)

___

### removeAssignment

▸ **removeAssignment**(`id`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/matcher.class.ts:803](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L803)

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

[src/matcher.class.ts:853](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L853)

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

[src/matcher.class.ts:360](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L360)

___

### resetLearningModel

▸ **resetLearningModel**(): `Promise`\<`void`\>

Reset the learned model weights and statistics.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:514](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L514)

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

[src/matcher.class.ts:1040](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1040)

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

[src/matcher.class.ts:1065](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1065)

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

[src/matcher.class.ts:540](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L540)

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

[src/matcher.class.ts:554](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L554)

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

[src/matcher.class.ts:566](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L566)

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

[src/matcher.class.ts:525](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L525)

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

[src/matcher.class.ts:709](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L709)

___

### startAutoReleaseInterval

▸ **startAutoReleaseInterval**(`intervalMs?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `intervalMs` | `number` | `10000` |

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:2122](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2122)

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

[src/matcher.class.ts:2229](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2229)

___

### startOrchestrator

▸ **startOrchestrator**(): `Promise`\<`void`\>

Start the workflow orchestrator.
This listens to the event stream and processes workflow transitions.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:2021](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2021)

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

[src/matcher.class.ts:1959](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L1959)

___

### stopAutoReleaseInterval

▸ **stopAutoReleaseInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:2129](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2129)

___

### stopIdleUserInterval

▸ **stopIdleUserInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:2236](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2236)

___

### stopOrchestrator

▸ **stopOrchestrator**(): `Promise`\<`void`\>

Stop the workflow orchestrator.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:2029](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2029)

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

Returns the applied weights per user id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId?` | `string` |
| `opts?` | `Object` |
| `opts.includeUnexploredTags?` | `boolean` |
| `opts.overrideManual?` | `boolean` |

#### Returns

`Promise`\<`Record`\<`string`, `Record`\<`string`, `number`\>\>\>

#### Defined in

[src/matcher.class.ts:648](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L648)

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

[src/matcher.class.ts:2145](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L2145)

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

[src/matcher.class.ts:506](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L506)

___

### waitUntilReady

▸ **waitUntilReady**(): `Promise`\<[`AssignmentMatcher`](AssignmentMatcher.md)\>

Wait until the matcher has connected and initialized workflow internals.

#### Returns

`Promise`\<[`AssignmentMatcher`](AssignmentMatcher.md)\>

#### Defined in

[src/matcher.class.ts:298](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/matcher.class.ts#L298)
