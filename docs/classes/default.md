[assignment-user-matcher](../README.md) / [Exports](../modules.md) / default

# Class: default

## Implements

- `WorkflowHost`

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [acceptedAssignmentsKey](default.md#acceptedassignmentskey)
- [allTagsKey](default.md#alltagskey)
- [assignmentOwnerKey](default.md#assignmentownerkey)
- [assignmentsKey](default.md#assignmentskey)
- [assignmentsRefKey](default.md#assignmentsrefkey)
- [autoReleaseInterval](default.md#autoreleaseinterval)
- [completedAssignmentsKey](default.md#completedassignmentskey)
- [enableAutoRoutingWeights](default.md#enableautoroutingweights)
- [enableDefaultMatching](default.md#enabledefaultmatching)
- [enableLearning](default.md#enablelearning)
- [enableWorkflows](default.md#enableworkflows)
- [idleUserInterval](default.md#idleuserinterval)
- [idleUserTimeoutMs](default.md#idleusertimeoutms)
- [keys](default.md#keys)
- [learning](default.md#learning)
- [learningFeatureExtractor](default.md#learningfeatureextractor)
- [luaScriptSha](default.md#luascriptsha)
- [matchExpirationMs](default.md#matchexpirationms)
- [matchScore](default.md#matchscore)
- [maxUserBacklogSize](default.md#maxuserbacklogsize)
- [pendingAssignmentsExpiryKey](default.md#pendingassignmentsexpirykey)
- [pendingAssignmentsKey](default.md#pendingassignmentskey)
- [readyPromise](default.md#readypromise)
- [redisClient](default.md#redisclient)
- [redisPrefix](default.md#redisprefix)
- [relevantBatchSize](default.md#relevantbatchsize)
- [reliability](default.md#reliability)
- [streamConsumerGroup](default.md#streamconsumergroup)
- [streamConsumerName](default.md#streamconsumername)
- [telemetry](default.md#telemetry)
- [usersKey](default.md#userskey)
- [usingDefaultMatchScore](default.md#usingdefaultmatchscore)
- [workflow](default.md#workflow)

### Accessors

- [assignmentStoreKeys](default.md#assignmentstorekeys)
- [stats](default.md#stats)
- [usersWithoutAssignment](default.md#userswithoutassignment)

### Methods

- [acceptAssignment](default.md#acceptassignment)
- [addAssignment](default.md#addassignment)
- [addUser](default.md#adduser)
- [atomicWorkflowTransition](default.md#atomicworkflowtransition)
- [backfillWorkflowIndexes](default.md#backfillworkflowindexes)
- [calculatePriority](default.md#calculatepriority)
- [cancelWorkflow](default.md#cancelworkflow)
- [checkDeadLetterQueueAlert](default.md#checkdeadletterqueuealert)
- [clearDeadLetterQueue](default.md#cleardeadletterqueue)
- [completeAssignment](default.md#completeassignment)
- [defaultMatchScore](default.md#defaultmatchscore)
- [drainScheduledRetries](default.md#drainscheduledretries)
- [executeWorkflow](default.md#executeworkflow)
- [expandTagWildcards](default.md#expandtagwildcards)
- [failAssignment](default.md#failassignment)
- [getActiveWorkflowsForUser](default.md#getactiveworkflowsforuser)
- [getAllAssignments](default.md#getallassignments)
- [getAssignment](default.md#getassignment)
- [getAssignmentCounts](default.md#getassignmentcounts)
- [getAssignmentsByIds](default.md#getassignmentsbyids)
- [getAssignmentsPaginated](default.md#getassignmentspaginated)
- [getAuditEvents](default.md#getauditevents)
- [getCircuitBreakerState](default.md#getcircuitbreakerstate)
- [getCurrentAssignmentsForUser](default.md#getcurrentassignmentsforuser)
- [getDeadLetterEvents](default.md#getdeadletterevents)
- [getDeadLetterQueueSize](default.md#getdeadletterqueuesize)
- [getKnownTagsForAutoWeights](default.md#getknowntagsforautoweights)
- [getLearnedRoutingWeights](default.md#getlearnedroutingweights)
- [getLearnedTagStats](default.md#getlearnedtagstats)
- [getLearningModel](default.md#getlearningmodel)
- [getLearningShadowMode](default.md#getlearningshadowmode)
- [getLearningStats](default.md#getlearningstats)
- [getPendingAssignmentsWithAge](default.md#getpendingassignmentswithage)
- [getReliabilityMetrics](default.md#getreliabilitymetrics)
- [getUserRelatedAssignments](default.md#getuserrelatedassignments)
- [getWorkflowDefinition](default.md#getworkflowdefinition)
- [getWorkflowInstance](default.md#getworkflowinstance)
- [getWorkflowInstanceWithSnapshot](default.md#getworkflowinstancewithsnapshot)
- [getWorkflowMetrics](default.md#getworkflowmetrics)
- [getWorkflowTargetedAssignments](default.md#getworkflowtargetedassignments)
- [healthCheck](default.md#healthcheck)
- [initRedis](default.md#initredis)
- [initStreamConsumerGroup](default.md#initstreamconsumergroup)
- [listWorkflowDefinitions](default.md#listworkflowdefinitions)
- [loadLuaScripts](default.md#loadluascripts)
- [matchUsersAssignments](default.md#matchusersassignments)
- [processExpiredMatches](default.md#processexpiredmatches)
- [processExpiredWorkflowSteps](default.md#processexpiredworkflowsteps)
- [processIdleUsers](default.md#processidleusers)
- [pruneWorkflowInstances](default.md#pruneworkflowinstances)
- [publishWorkflowEvent](default.md#publishworkflowevent)
- [reclaimOrphanedMessages](default.md#reclaimorphanedmessages)
- [recordLearningFeedback](default.md#recordlearningfeedback)
- [recordLearningReward](default.md#recordlearningreward)
- [registerMachineHandler](default.md#registermachinehandler)
- [registerWorkflow](default.md#registerworkflow)
- [rejectAssignment](default.md#rejectassignment)
- [releaseUserPendingAssignments](default.md#releaseuserpendingassignments)
- [removeAssignment](default.md#removeassignment)
- [removeUser](default.md#removeuser)
- [replayDeadLetterEvent](default.md#replaydeadletterevent)
- [resetLearningModel](default.md#resetlearningmodel)
- [setAssignmentPriority](default.md#setassignmentpriority)
- [setAssignmentPriorityByTags](default.md#setassignmentprioritybytags)
- [setLearningShadowMode](default.md#setlearningshadowmode)
- [setTracer](default.md#settracer)
- [startAutoReleaseInterval](default.md#startautoreleaseinterval)
- [startIdleUserInterval](default.md#startidleuserinterval)
- [startOrchestrator](default.md#startorchestrator)
- [startWorkflow](default.md#startworkflow)
- [stopAutoReleaseInterval](default.md#stopautoreleaseinterval)
- [stopIdleUserInterval](default.md#stopidleuserinterval)
- [stopOrchestrator](default.md#stoporchestrator)
- [syncLearnedRoutingWeights](default.md#synclearnedroutingweights)
- [touchUser](default.md#touchuser)
- [trainLearningSamples](default.md#trainlearningsamples)
- [waitUntilReady](default.md#waituntilready)

## Constructors

### constructor

• **new default**(`redisClient`, `options?`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `redisClient` | `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\> |
| `options?` | [`MatcherOptions`](../modules.md#matcheroptions) |

#### Returns

[`default`](default.md)

#### Defined in

[src/matcher.class.ts:152](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L152)

## Properties

### acceptedAssignmentsKey

• **acceptedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:129](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L129)

___

### allTagsKey

• **allTagsKey**: `string`

#### Defined in

[src/matcher.class.ts:128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L128)

___

### assignmentOwnerKey

• **assignmentOwnerKey**: `string`

#### Defined in

[src/matcher.class.ts:127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L127)

___

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:118](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L118)

___

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L119)

___

### autoReleaseInterval

• `Private` **autoReleaseInterval**: ``null`` \| `Timeout` = `null`

#### Defined in

[src/matcher.class.ts:1671](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1671)

___

### completedAssignmentsKey

• **completedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:137](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L137)

___

### enableAutoRoutingWeights

• `Private` **enableAutoRoutingWeights**: `boolean`

#### Defined in

[src/matcher.class.ts:148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L148)

___

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:122](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L122)

___

### enableLearning

• `Private` **enableLearning**: `boolean`

#### Defined in

[src/matcher.class.ts:147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L147)

___

### enableWorkflows

• `Private` **enableWorkflows**: `boolean`

#### Defined in

[src/matcher.class.ts:133](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L133)

___

### idleUserInterval

• `Private` **idleUserInterval**: ``null`` \| `Timeout` = `null`

#### Defined in

[src/matcher.class.ts:1778](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1778)

___

### idleUserTimeoutMs

• **idleUserTimeoutMs**: ``null`` \| `number`

#### Defined in

[src/matcher.class.ts:124](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L124)

___

### keys

• `Private` **keys**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptedAssignments` | () => `string` |
| `allTags` | () => `string` |
| `assignmentOwner` | () => `string` |
| `assignmentPriority` | (`id`: `string`) => `string` |
| `assignmentTags` | (`id`: `string`) => `string` |
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

[src/matcher.class.ts:130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L130)

___

### learning

• `Private` **learning**: `LearningManager`

#### Defined in

[src/matcher.class.ts:149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L149)

___

### learningFeatureExtractor

• `Private` **learningFeatureExtractor**: [`LearningFeatureExtractor`](../modules.md#learningfeatureextractor)

#### Defined in

[src/matcher.class.ts:150](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L150)

___

### luaScriptSha

• `Private` **luaScriptSha**: ``null`` \| `string` = `null`

#### Defined in

[src/matcher.class.ts:142](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L142)

___

### matchExpirationMs

• **matchExpirationMs**: `number`

#### Defined in

[src/matcher.class.ts:123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L123)

___

### matchScore

• `Private` **matchScore**: (`user`: [`User`](../interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `string` \| `number`, `assignmentId?`: `string`, `skillThresholds?`: `Record`\<`string`, `number`\>) => `Promise`\<[`number`, `number`]\>

#### Type declaration

▸ (`user`, `assignmentTags`, `assignmentPriority`, `assignmentId?`, `skillThresholds?`): `Promise`\<[`number`, `number`]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](../interfaces/User.md) |
| `assignmentTags` | `string` |
| `assignmentPriority` | `string` \| `number` |
| `assignmentId?` | `string` |
| `skillThresholds?` | `Record`\<`string`, `number`\> |

##### Returns

`Promise`\<[`number`, `number`]\>

#### Defined in

[src/matcher.class.ts:864](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L864)

___

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L121)

___

### pendingAssignmentsExpiryKey

• **pendingAssignmentsExpiryKey**: `string`

#### Defined in

[src/matcher.class.ts:126](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L126)

___

### pendingAssignmentsKey

• **pendingAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:125](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L125)

___

### readyPromise

• `Private` `Readonly` **readyPromise**: `Promise`\<[`default`](default.md)\>

#### Defined in

[src/matcher.class.ts:144](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L144)

___

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\>

#### Defined in

[src/matcher.class.ts:153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L153)

___

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:117](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L117)

___

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:116](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L116)

___

### reliability

• `Private` **reliability**: `ReliabilityManager`

#### Defined in

[src/matcher.class.ts:140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L140)

___

### streamConsumerGroup

• `Private` **streamConsumerGroup**: `string`

#### Defined in

[src/matcher.class.ts:134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L134)

___

### streamConsumerName

• `Private` **streamConsumerName**: `string`

#### Defined in

[src/matcher.class.ts:135](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L135)

___

### telemetry

• `Private` **telemetry**: `TelemetryManager`

#### Defined in

[src/matcher.class.ts:141](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L141)

___

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:120](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L120)

___

### usingDefaultMatchScore

• `Private` **usingDefaultMatchScore**: `boolean`

#### Defined in

[src/matcher.class.ts:143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L143)

___

### workflow

• `Private` **workflow**: `WorkflowManager`

#### Defined in

[src/matcher.class.ts:136](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L136)

## Accessors

### assignmentStoreKeys

• `get` **assignmentStoreKeys**(): `Object`

Keys for the three assignment stores (used by pagination queries)

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `accepted` | `string` |
| `completed` | `string` |
| `pending` | `string` |
| `queued` | `string` |

#### Defined in

[src/matcher.class.ts:234](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L234)

___

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:877](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L877)

___

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:891](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L891)

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

[src/matcher.class.ts:1282](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1282)

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

WorkflowHost.addAssignment

#### Defined in

[src/matcher.class.ts:649](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L649)

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

[src/matcher.class.ts:632](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L632)

___

### atomicWorkflowTransition

▸ **atomicWorkflowTransition**(`instanceId`, `expectedVersion`, `newStatus`, `newStepId`, `updatedContext`, `historyEntry?`): `Promise`\<\{ `error?`: `string` ; `instance?`: [`WorkflowInstance`](../interfaces/WorkflowInstance.md) ; `ok`: `boolean`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `expectedVersion` | `number` |
| `newStatus` | `WorkflowInstanceStatus` |
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

[src/matcher.class.ts:283](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L283)

___

### backfillWorkflowIndexes

▸ **backfillWorkflowIndexes**(): `Promise`\<`number`\>

Backfill workflow indexes (active-instance index) from records created
before these indexes existed. Safe to run multiple times.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1607](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1607)

___

### calculatePriority

▸ **calculatePriority**(`...args`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | (`undefined` \| [`Assignment`](../modules.md#assignment))[] |

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:872](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L872)

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

[src/matcher.class.ts:1546](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1546)

___

### checkDeadLetterQueueAlert

▸ **checkDeadLetterQueueAlert**(): `Promise`\<`boolean`\>

Check if Dead Letter Queue size exceeds alert threshold

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:380](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L380)

___

### clearDeadLetterQueue

▸ **clearDeadLetterQueue**(): `Promise`\<`number`\>

Clear all events from the Dead Letter Queue.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:343](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L343)

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

[src/matcher.class.ts:1359](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1359)

___

### defaultMatchScore

▸ **defaultMatchScore**(`user`, `assignmentTags`, `assignmentPriority`, `_assignmentId?`, `skillThresholds?`): `Promise`\<[`number`, `number`]\>

Default match score implementation using extracted scoring module

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](../interfaces/User.md) |
| `assignmentTags` | `string` |
| `assignmentPriority` | `string` \| `number` |
| `_assignmentId?` | `string` |
| `skillThresholds?` | `Record`\<`string`, `number`\> |

#### Returns

`Promise`\<[`number`, `number`]\>

#### Defined in

[src/matcher.class.ts:852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L852)

___

### drainScheduledRetries

▸ **drainScheduledRetries**(): `Promise`\<`number`\>

Process due delayed event retries. Called automatically by the
orchestrator; exposed for deployments that run their own schedulers.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1598](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1598)

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

[src/matcher.class.ts:1492](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1492)

___

### expandTagWildcards

▸ **expandTagWildcards**(`tags`): `Promise`\<\{ `tag`: `string` ; `weight`: `number`  }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tags` | \{ `tag`: `string` ; `weight`: `number`  }[] |

#### Returns

`Promise`\<\{ `tag`: `string` ; `weight`: `number`  }[]\>

#### Defined in

[src/matcher.class.ts:1825](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1825)

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

[src/matcher.class.ts:1412](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1412)

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

[src/matcher.class.ts:1538](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1538)

___

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Get all assignments (queued, pending, and accepted).
For large datasets, prefer using getAssignmentsPaginated() instead.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:757](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L757)

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

[src/matcher.class.ts:788](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L788)

___

### getAssignmentCounts

▸ **getAssignmentCounts**(): `Promise`\<`AssignmentCounts`\>

Get assignment counts by status without fetching the data.
Efficient for dashboards and monitoring.

#### Returns

`Promise`\<`AssignmentCounts`\>

#### Defined in

[src/matcher.class.ts:780](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L780)

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

[src/matcher.class.ts:796](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L796)

___

### getAssignmentsPaginated

▸ **getAssignmentsPaginated**(`options?`): `Promise`\<`PaginationResult`\>

Get assignments with pagination support for efficient querying of large datasets.
Uses cursor-based pagination across statuses.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `PaginationOptions` |

#### Returns

`Promise`\<`PaginationResult`\>

#### Defined in

[src/matcher.class.ts:771](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L771)

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

[src/matcher.class.ts:351](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L351)

___

### getCircuitBreakerState

▸ **getCircuitBreakerState**(): `Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

Get current circuit breaker state

#### Returns

`Promise`\<[`CircuitBreakerState`](../interfaces/CircuitBreakerState.md)\>

#### Defined in

[src/matcher.class.ts:372](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L372)

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

[src/matcher.class.ts:1274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1274)

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

[src/matcher.class.ts:311](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L311)

___

### getDeadLetterQueueSize

▸ **getDeadLetterQueueSize**(): `Promise`\<`number`\>

Get Dead Letter Queue size.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:319](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L319)

___

### getKnownTagsForAutoWeights

▸ **getKnownTagsForAutoWeights**(): `Promise`\<`string`[]\>

All known tags except the internal 'default' tag (for exploration priors)

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:597](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L597)

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

[src/matcher.class.ts:525](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L525)

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

[src/matcher.class.ts:511](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L511)

___

### getLearningModel

▸ **getLearningModel**(): `Promise`\<`Record`\<`string`, `string`\>\>

Get the learned model weights (feature -> weight).

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Defined in

[src/matcher.class.ts:433](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L433)

___

### getLearningShadowMode

▸ **getLearningShadowMode**(): `Promise`\<`boolean`\>

Current runtime shadow mode state.

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/matcher.class.ts:498](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L498)

___

### getLearningStats

▸ **getLearningStats**(): `Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

Get aggregate learning statistics (decisions, rewards, average reward).

#### Returns

`Promise`\<[`LearningStats`](../interfaces/LearningStats.md)\>

#### Defined in

[src/matcher.class.ts:441](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L441)

___

### getPendingAssignmentsWithAge

▸ **getPendingAssignmentsWithAge**(): `Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

Get all pending assignments with owner and pending duration metadata.

#### Returns

`Promise`\<[`PendingAssignmentInfo`](../modules.md#pendingassignmentinfo)[]\>

#### Defined in

[src/matcher.class.ts:804](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L804)

___

### getReliabilityMetrics

▸ **getReliabilityMetrics**(): `Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

Get comprehensive reliability metrics including circuit breaker state,
Dead Letter Queue size, and Redis health status.

#### Returns

`Promise`\<[`ReliabilityMetrics`](../interfaces/ReliabilityMetrics.md)\>

#### Defined in

[src/matcher.class.ts:364](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L364)

___

### getUserRelatedAssignments

▸ **getUserRelatedAssignments**(`user`): `Promise`\<\{ `id`: `string` ; `priority`: `number`  }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](../interfaces/User.md) |

#### Returns

`Promise`\<\{ `id`: `string` ; `priority`: `number`  }[]\>

#### Defined in

[src/matcher.class.ts:958](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L958)

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

[src/matcher.class.ts:1476](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1476)

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

[src/matcher.class.ts:1522](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1522)

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

[src/matcher.class.ts:1530](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1530)

___

### getWorkflowMetrics

▸ **getWorkflowMetrics**(): `Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

Operational metrics for the workflow engine: active instances, retry
queue depth, DLQ size, and event stream statistics.

#### Returns

`Promise`\<[`WorkflowEngineMetrics`](../modules.md#workflowenginemetrics)\>

#### Defined in

[src/matcher.class.ts:1625](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1625)

___

### getWorkflowTargetedAssignments

▸ **getWorkflowTargetedAssignments**(`userId`): `Promise`\<\{ `id`: `string` ; `priority`: `number`  }[]\>

Get assignments specifically targeted at a user through active workflows.
These take priority over general pool assignments for deterministic matching.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<\{ `id`: `string` ; `priority`: `number`  }[]\>

#### Defined in

[src/matcher.class.ts:1798](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1798)

___

### healthCheck

▸ **healthCheck**(): `Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

Perform a health check on Redis connection
Returns true if Redis is healthy, false otherwise

#### Returns

`Promise`\<\{ `details`: `Record`\<`string`, `any`\> ; `healthy`: `boolean`  }\>

#### Defined in

[src/matcher.class.ts:389](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L389)

___

### initRedis

▸ **initRedis**(): `Promise`\<[`default`](default.md)\>

#### Returns

`Promise`\<[`default`](default.md)\>

#### Defined in

[src/matcher.class.ts:243](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L243)

___

### initStreamConsumerGroup

▸ **initStreamConsumerGroup**(): `Promise`\<`void`\>

Initialize the Redis Stream consumer group for workflow events.
Creates the stream and consumer group if they don't exist.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:617](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L617)

___

### listWorkflowDefinitions

▸ **listWorkflowDefinitions**(): `Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

List all registered workflow definitions.

#### Returns

`Promise`\<[`WorkflowDefinitionSummary`](../interfaces/WorkflowDefinitionSummary.md)[]\>

#### Defined in

[src/matcher.class.ts:1484](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1484)

___

### loadLuaScripts

▸ **loadLuaScripts**(): `Promise`\<`void`\>

Load Lua scripts into Redis for atomic operations.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:272](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L272)

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

WorkflowHost.matchUsersAssignments

#### Defined in

[src/matcher.class.ts:1221](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1221)

___

### processExpiredMatches

▸ **processExpiredMatches**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1630](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1630)

___

### processExpiredWorkflowSteps

▸ **processExpiredWorkflowSteps**(): `Promise`\<`number`\>

Check and process expired workflow steps.
Should be called periodically.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1555](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1555)

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

[src/matcher.class.ts:1711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1711)

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

[src/matcher.class.ts:1616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1616)

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

[src/matcher.class.ts:1563](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1563)

___

### reclaimOrphanedMessages

▸ **reclaimOrphanedMessages**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:303](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L303)

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

[src/matcher.class.ts:463](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L463)

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

[src/matcher.class.ts:451](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L451)

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

[src/matcher.class.ts:1590](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1590)

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

[src/matcher.class.ts:1468](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1468)

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

[src/matcher.class.ts:1315](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1315)

___

### releaseUserPendingAssignments

▸ **releaseUserPendingAssignments**(`userId`): `Promise`\<`void`\>

Requeue all pending assignments currently held by a user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:1743](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1743)

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

[src/matcher.class.ts:694](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L694)

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

[src/matcher.class.ts:739](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L739)

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

[src/matcher.class.ts:327](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L327)

___

### resetLearningModel

▸ **resetLearningModel**(): `Promise`\<`void`\>

Reset the learned model weights and statistics.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:481](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L481)

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

[src/matcher.class.ts:904](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L904)

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

[src/matcher.class.ts:929](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L929)

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

[src/matcher.class.ts:492](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L492)

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

[src/matcher.class.ts:609](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L609)

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

[src/matcher.class.ts:1673](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1673)

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

[src/matcher.class.ts:1780](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1780)

___

### startOrchestrator

▸ **startOrchestrator**(): `Promise`\<`void`\>

Start the workflow orchestrator.
This listens to the event stream and processes workflow transitions.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:1572](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1572)

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

[src/matcher.class.ts:1510](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1510)

___

### stopAutoReleaseInterval

▸ **stopAutoReleaseInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1680](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1680)

___

### stopIdleUserInterval

▸ **stopIdleUserInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1787](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1787)

___

### stopOrchestrator

▸ **stopOrchestrator**(): `Promise`\<`void`\>

Stop the workflow orchestrator.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:1580](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1580)

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

[src/matcher.class.ts:548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L548)

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

[src/matcher.class.ts:1696](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L1696)

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

[src/matcher.class.ts:473](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L473)

___

### waitUntilReady

▸ **waitUntilReady**(): `Promise`\<[`default`](default.md)\>

Wait until the matcher has connected and initialized workflow internals.

#### Returns

`Promise`\<[`default`](default.md)\>

#### Defined in

[src/matcher.class.ts:265](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/matcher.class.ts#L265)
