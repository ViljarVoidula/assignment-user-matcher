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
- [enableDefaultMatching](default.md#enabledefaultmatching)
- [enableWorkflows](default.md#enableworkflows)
- [keys](default.md#keys)
- [luaScriptSha](default.md#luascriptsha)
- [matchExpirationMs](default.md#matchexpirationms)
- [matchScore](default.md#matchscore)
- [maxUserBacklogSize](default.md#maxuserbacklogsize)
- [pendingAssignmentsExpiryKey](default.md#pendingassignmentsexpirykey)
- [pendingAssignmentsKey](default.md#pendingassignmentskey)
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
- [calculatePriority](default.md#calculatepriority)
- [cancelWorkflow](default.md#cancelworkflow)
- [clearDeadLetterQueue](default.md#cleardeadletterqueue)
- [completeAssignment](default.md#completeassignment)
- [defaultMatchScore](default.md#defaultmatchscore)
- [expandTagWildcards](default.md#expandtagwildcards)
- [failAssignment](default.md#failassignment)
- [getActiveWorkflowsForUser](default.md#getactiveworkflowsforuser)
- [getAllAssignments](default.md#getallassignments)
- [getAssignment](default.md#getassignment)
- [getAssignmentCounts](default.md#getassignmentcounts)
- [getAssignmentsByIds](default.md#getassignmentsbyids)
- [getAssignmentsPaginated](default.md#getassignmentspaginated)
- [getAuditEvents](default.md#getauditevents)
- [getCurrentAssignmentsForUser](default.md#getcurrentassignmentsforuser)
- [getDeadLetterEvents](default.md#getdeadletterevents)
- [getDeadLetterQueueSize](default.md#getdeadletterqueuesize)
- [getUserRelatedAssignments](default.md#getuserrelatedassignments)
- [getWorkflowDefinition](default.md#getworkflowdefinition)
- [getWorkflowInstance](default.md#getworkflowinstance)
- [getWorkflowInstanceWithSnapshot](default.md#getworkflowinstancewithsnapshot)
- [getWorkflowTargetedAssignments](default.md#getworkflowtargetedassignments)
- [initRedis](default.md#initredis)
- [initStreamConsumerGroup](default.md#initstreamconsumergroup)
- [listWorkflowDefinitions](default.md#listworkflowdefinitions)
- [loadLuaScripts](default.md#loadluascripts)
- [matchUsersAssignments](default.md#matchusersassignments)
- [processExpiredMatches](default.md#processexpiredmatches)
- [processExpiredWorkflowSteps](default.md#processexpiredworkflowsteps)
- [publishWorkflowEvent](default.md#publishworkflowevent)
- [reclaimOrphanedMessages](default.md#reclaimorphanedmessages)
- [registerWorkflow](default.md#registerworkflow)
- [rejectAssignment](default.md#rejectassignment)
- [removeAssignment](default.md#removeassignment)
- [removeUser](default.md#removeuser)
- [replayDeadLetterEvent](default.md#replaydeadletterevent)
- [setAssignmentPriority](default.md#setassignmentpriority)
- [setAssignmentPriorityByTags](default.md#setassignmentprioritybytags)
- [setTracer](default.md#settracer)
- [startAutoReleaseInterval](default.md#startautoreleaseinterval)
- [startOrchestrator](default.md#startorchestrator)
- [startWorkflow](default.md#startworkflow)
- [stopAutoReleaseInterval](default.md#stopautoreleaseinterval)
- [stopOrchestrator](default.md#stoporchestrator)

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

[src/matcher.class.ts:102](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L102)

## Properties

### acceptedAssignmentsKey

• **acceptedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:86](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L86)

___

### allTagsKey

• **allTagsKey**: `string`

#### Defined in

[src/matcher.class.ts:85](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L85)

___

### assignmentOwnerKey

• **assignmentOwnerKey**: `string`

#### Defined in

[src/matcher.class.ts:84](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L84)

___

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:76](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L76)

___

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:77](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L77)

___

### autoReleaseInterval

• `Private` **autoReleaseInterval**: ``null`` \| `Timeout` = `null`

#### Defined in

[src/matcher.class.ts:1094](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1094)

___

### completedAssignmentsKey

• **completedAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:94](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L94)

___

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:80](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L80)

___

### enableWorkflows

• `Private` **enableWorkflows**: `boolean`

#### Defined in

[src/matcher.class.ts:90](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L90)

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
| `completedAssignments` | () => `string` |
| `deadLetterQueue` | () => `string` |
| `eventRetryCount` | (`eventId`: `string`) => `string` |
| `eventStream` | () => `string` |
| `eventStreamDeadLetter` | () => `string` |
| `pendingAssignmentsData` | () => `string` |
| `pendingAssignmentsExpiry` | () => `string` |
| `processedEvents` | () => `string` |
| `tagAssignments` | (`tag`: `string`) => `string` |
| `tempUserCandidates` | (`userId`: `string`) => `string` |
| `tempUserExclude` | (`userId`: `string`) => `string` |
| `tempUserFinal` | (`userId`: `string`) => `string` |
| `userAssignments` | (`userId`: `string`) => `string` |
| `userRejected` | (`userId`: `string`) => `string` |
| `users` | () => `string` |
| `workflowAssignmentLink` | (`assignmentId`: `string`) => `string` |
| `workflowAuditStream` | () => `string` |
| `workflowDefinition` | (`id`: `string`) => `string` |
| `workflowDefinitions` | () => `string` |
| `workflowInstance` | (`id`: `string`) => `string` |
| `workflowInstances` | () => `string` |
| `workflowInstancesByUser` | (`userId`: `string`) => `string` |
| `workflowStepExpiry` | (`instanceId`: `string`, `stepId`: `string`) => `string` |

#### Defined in

[src/matcher.class.ts:87](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L87)

___

### luaScriptSha

• `Private` **luaScriptSha**: ``null`` \| `string` = `null`

#### Defined in

[src/matcher.class.ts:99](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L99)

___

### matchExpirationMs

• **matchExpirationMs**: `number`

#### Defined in

[src/matcher.class.ts:81](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L81)

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

[src/matcher.class.ts:464](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L464)

___

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:79](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L79)

___

### pendingAssignmentsExpiryKey

• **pendingAssignmentsExpiryKey**: `string`

#### Defined in

[src/matcher.class.ts:83](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L83)

___

### pendingAssignmentsKey

• **pendingAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:82](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L82)

___

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `CARD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `MEXISTS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `card`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `exists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `BfInfoReplyMap` ; `3`: () => `BfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `BfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `mExists`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `errorRate`: `number`, `capacity`: `number`, `options?`: `BfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `BlobStringReply`\<`string`\>]) => \{ `chunk`: `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cf`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `ADDNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `EXISTS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `INSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `INSERTNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `LOADCHUNK`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `SCANDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `addNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `exists`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `item`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NumberReply`\<``0`` \| ``1``\>) => `boolean` ; `3`: () => `BooleanReply`\<`boolean`\>  }  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Size"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of buckets"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Number of filters"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CfInfoReplyMap` ; `3`: () => `CfInfoReplyMap`  }  } ; `insert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `insertNX`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`, `options?`: `CfInsertOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `loadChunk`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`, `chunk`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `capacity`: `number`, `options?`: `CfReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `scanDump`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `iterator`: `number`) => `void` ; `transformReply`: (`this`: `void`, `reply`: [`NumberReply`\<`number`\>, `NullReply` \| `BlobStringReply`\<`string`\>]) => \{ `chunk`: `NullReply` \| `BlobStringReply`\<`string`\> ; `iterator`: `NumberReply`\<`number`\>  }  }  } ; `cms`: \{ `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `INITBYDIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INITBYPROB`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `QUERY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `BfIncrByItem` \| `BfIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"count"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `CmsInfoReply` ; `3`: () => `CmsInfoReply`  }  } ; `initByDim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `width`: `number`, `depth`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `initByProb`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `error`: `number`, `probability`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `BfMergeSketches`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `query`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  }  } ; `ft`: \{ `AGGREGATE`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `AGGREGATE_WITHCURSOR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `ALIASADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALIASUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CONFIG_GET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `CONFIG_SET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_DEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CURSOR_READ`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `DICTADD`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDEL`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DICTDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `DROPINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `EXPLAIN`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `EXPLAINCLI`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `HYBRID`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILEAGGREGATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `PROFILESEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SEARCH_NOCONTENT`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SPELLCHECK`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `SUGADD`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SUGDEL`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `SUGGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `SUGGET_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `SUGGET_WITHSCORES`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGGET_WITHSCORES_WITHPAYLOADS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `SUGLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `SYNDUMP`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `SYNUPDATE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `TAGVALS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_LIST`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `_list`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `aggregate`: \{ `IS_READ_ONLY`: ``false`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [total: UnwrapReply\<NumberReply\<number\>\>, ...results: ArrayReply\<BlobStringReply\<string\>\>[]], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `AggregateReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aggregateWithCursor`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtAggregateWithCursorOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `aliasAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `aliasUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `alias`: `RedisArgument`, `index`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `alter`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `configGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `option`: `string`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `TuplesReply`\<[`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>]\>[]) => `Record`\<`string`, `NullReply` \| `BlobStringReply`\<`string`\>\>  } ; `configSet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `property`: `Buffer` \| `string` & {} \| ``"a"`` \| ``"b"``, `value`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `schema`: `RediSearchSchema`, `options?`: `CreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursorId`: `UnwrapReply`\<`NumberReply`\<`number`\>\>) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `cursorRead`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `cursor`: `UnwrapReply`\<`NumberReply`\<`number`\>\>, `options?`: `FtCursorReadOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [result: [total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], cursor: NumberReply\<number\>]) => `AggregateWithCursorReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `dictAdd`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDel`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`, `term`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `dictDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `dictionary`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `dropIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtDropIndexOptions`) => `void` ; `transformReply`: \{ `2`: () => `SimpleStringReply`\<``"OK"``\> ; `3`: () => `NumberReply`\<`number`\>  }  } ; `explain`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<`string`\>  } ; `explainCli`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtExplainCLIOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `hybrid`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `options?`: `FtHybridOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`) => `any` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `any`[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileAggregate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `string`, `query`: `string`, `options?`: `ProfileOptions` & `FtAggregateOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [[total: UnwrapReply\<NumberReply\<(...)\>\>, ...results: ArrayReply\<BlobStringReply\<(...)\>\>[]], `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `profileSearch`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `ProfileOptions` & `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SearchRawReply`, `ArrayReply`\<`ReplyUnion`\>]) => `ProfileReplyResp2` ; `3`: (`reply`: `ReplyUnion`) => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `search`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `searchNoContent`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSearchOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `SearchRawReply`) => `SearchNoContentReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `spellCheck`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `query`: `RedisArgument`, `options?`: `FtSpellCheckOptions`) => `void` ; `transformReply`: \{ `2`: (`rawReply`: [\_: string, term: string, suggestions: [score: (...), suggestion: (...)][]][]) => \{ `suggestions`: \{ `score`: ... ; `suggestion`: ...  }[] ; `term`: `string`  }[] ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `sugAdd`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`, `score`: `number`, `options?`: `FtSugAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `sugDel`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `string`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<``0`` \| ``1``\>  } ; `sugGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `sugGetWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\>[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<`string`\> ; `suggestion`: `BlobStringReply`\<`string`\>  }[]  } ; `sugGetWithScores`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: (`DoubleReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => ``null`` \| \{ `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugGetWithScoresWithPayloads`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `prefix`: `RedisArgument`, `options?`: `FtSugGetOptions`) => `void` ; `transformReply`: \{ `2`: (`reply`: `NullReply` \| `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[] ; `3`: (`reply`: `NullReply` \| (`DoubleReply`\<...\> \| `BlobStringReply`\<...\>)[]) => ``null`` \| \{ `payload`: `BlobStringReply`\<...\> ; `score`: `DoubleReply`\<...\> ; `suggestion`: `BlobStringReply`\<...\>  }[]  }  } ; `sugLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `synDump`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: (`BlobStringReply`\<`string`\> \| `ArrayReply`\<`BlobStringReply`\<...\>\>)[]) => `Record`\<`string`, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\> ; `3`: () => `MapReply`\<`BlobStringReply`\<`string`\>, `ArrayReply`\<`BlobStringReply`\<`string`\>\>\>  }  } ; `synUpdate`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `groupId`: `RedisArgument`, `terms`: `RedisVariadicArgument`, `options?`: `FtSynUpdateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `tagVals`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `index`: `RedisArgument`, `fieldName`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  }  } ; `json`: \{ `ARRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRINSERT`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `ARRPOP`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| \{ `[key: string]`: `RedisJSON`;  } \| (`NullReply` \| `RedisJSON`)[]  } ; `ARRTRIM`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `CLEAR`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEBUG_MEMORY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `FORGET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `GET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `MSET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `NUMINCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `NUMMULTBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `OBJKEYS`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `OBJLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `SET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `STRAPPEND`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `STRLEN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TOGGLE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `TYPE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  } ; `arrAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrIndex`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonArrIndexOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrInsert`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `index`: `number`, `json`: `RedisJSON`, ...`jsons`: `RedisJSON`[]) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonArrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `arrPop`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `RedisArrPopOptions`) => `void` ; `transformReply`: (`this`: `void`, `reply`: `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => ``null`` \| `string` \| `number` \| `boolean` \| `Date` \| `NullReply` \| (`NullReply` \| `RedisJSON`)[] \| \{ `[key: string]`: `RedisJSON`;  }  } ; `arrTrim`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `start`: `number`, `stop`: `number`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `clear`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonClearOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `debugMemory`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDebugMemoryOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonDelOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `forget`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonForgetOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `get`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonGetOptions`) => `void` ; `transformReply`: (`json`: `NullReply` \| `BlobStringReply`\<`string`\>) => `NullReply` \| `RedisJSON`  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `keys`: `RedisArgument`[], `path`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `reply`: (`NullReply` \| `BlobStringReply`\<`string`\>)[]) => (`NullReply` \| `RedisJSON`)[]  } ; `mSet`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `items`: `JsonMSetItem`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `value`: `RedisJSON`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `numIncrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `numMultBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `by`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `UnwrapReply`\<`BlobStringReply`\<`string`\>\>) => `number` \| (``null`` \| `number`)[] ; `3`: () => `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\> \| `DoubleReply`\<`number`\>\>  }  } ; `objKeys`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjKeysOptions`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> \| `ArrayReply`\<`NullReply` \| `ArrayReply`\<`BlobStringReply`\<...\>\>\>  } ; `objLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonObjLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `set`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`, `json`: `RedisJSON`, `options?`: `JsonSetOptions`) => `void` ; `transformReply`: () => `NullReply` \| `SimpleStringReply`\<``"OK"``\>  } ; `strAppend`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `append`: `string`, `options?`: `JsonStrAppendOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `strLen`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonStrLenOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `toggle`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `path`: `RedisArgument`) => `void` ; `transformReply`: () => `NullReply` \| `NumberReply`\<`number`\> \| `ArrayReply`\<`NullReply` \| `NumberReply`\<`number`\>\>  } ; `type`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `JsonTypeOptions`) => `void` ; `transformReply`: \{ `2`: () => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\> ; `3`: (`reply`: (`NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<... \| ...\>)[]) => `NullReply` \| `BlobStringReply`\<`string`\> \| `ArrayReply`\<`NullReply` \| `BlobStringReply`\<...\>\>  }  }  } ; `tDigest`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `BYRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `BYREVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CDF`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `MAX`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `MERGE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `MIN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `QUANTILE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `RANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `RESET`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `REVRANK`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `TRIMMED_MEAN`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `byRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `byRevRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `ranks`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `cdf`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TDigestCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [`SimpleStringReply`\<``"Compression"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Capacity"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"Merged nodes"``\>, `NumberReply`\<`number`\>], `_`: `any`, `typeMapping?`: `TypeMapping`) => `TdInfoReplyMap` ; `3`: () => `TdInfoReplyMap`  }  } ; `max`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `merge`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `destination`: `RedisArgument`, `source`: `RedisVariadicArgument`, `options?`: `TDigestMergeOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `min`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  } ; `quantile`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `quantiles`: `number`[]) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>[], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\>[] ; `3`: () => `ArrayReply`\<`DoubleReply`\<`number`\>\>  }  } ; `rank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `reset`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `revRank`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `values`: `number`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `trimmedMean`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `lowCutPercentile`: `number`, `highCutPercentile`: `number`) => `void` ; `transformReply`: \{ `2`: (`reply`: `BlobStringReply`\<`string`\>, `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `DoubleReply`\<`number`\> ; `3`: () => `DoubleReply`\<`number`\>  }  }  } ; `topK`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `COUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `LIST`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `LIST_WITHCOUNT`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `QUERY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `RESERVE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `count`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`NumberReply`\<`number`\>\>  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `TopKIncrByItem` \| `TopKIncrByItem`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`NullReply` \| `SimpleStringReply`\<`string`\>\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: [`SimpleStringReply`\<``"k"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"width"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"depth"``\>, `NumberReply`\<`number`\>, `SimpleStringReply`\<``"decay"``\>, `BlobStringReply`\<`string`\>], `preserve?`: `any`, `typeMapping?`: `TypeMapping`) => `TopKInfoReplyMap` ; `3`: () => `TopKInfoReplyMap`  }  } ; `list`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\>  } ; `listWithCount`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`) => `void` ; `transformReply`: (`this`: `void`, `rawReply`: (`NumberReply`\<`number`\> \| `BlobStringReply`\<`string`\>)[]) => \{ `count`: `NumberReply`\<`number`\> ; `item`: `BlobStringReply`\<`string`\>  }[]  } ; `query`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `items`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: (`reply`: `ArrayReply`\<`NumberReply`\<``0`` \| ``1``\>\>) => `boolean`[] ; `3`: () => `ArrayReply`\<`BooleanReply`\<`boolean`\>\>  }  } ; `reserve`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `topK`: `number`, `options?`: `TopKReserveOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  }  } ; `ts`: \{ `ADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `ALTER`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `CREATERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `DECRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DEL`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `DELETERULE`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `GET`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `INCRBY`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `INFO`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `INFO_DEBUG`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `MADD`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `MGET`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `MGET_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MGET_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `MRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `MREVRANGE_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_SELECTED_LABELS`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_SELECTED_LABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `MREVRANGE_WITHLABELS`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `MREVRANGE_WITHLABELS_GROUPBY`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `QUERYINDEX`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `RANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `REVRANGE`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `add`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `timestamp`: `Timestamp`, `value`: `number`, `options?`: `TsAddOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `alter`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsAlterOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `create`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsCreateOptions`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `createRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`, `aggregationType`: `TimeSeriesAggregationType`, `bucketDuration`: `number`, `alignTimestamp?`: `number`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `decrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `del`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `deleteRule`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `sourceKey`: `RedisArgument`, `destinationKey`: `RedisArgument`) => `void` ; `transformReply`: () => `SimpleStringReply`\<``"OK"``\>  } ; `get`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `options?`: `TsGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `UnwrapReply`\<`RespType`\<``42``, [], `never`, []\> \| `RespType`\<``42``, [..., ...], `never`, [..., ...]\>\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  } ; `3`: (`this`: `void`, `reply`: `UnwrapReply`\<`TsGetReply`\>) => ``null`` \| \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }  } ; `incrBy`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `value`: `number`, `options?`: `TsIncrByOptions`) => `void` ; `transformReply`: () => `NumberReply`\<`number`\>  } ; `info`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `InfoRawReply`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `infoDebug`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `string`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: [...InfoRawReplyTypes[], ``"keySelfName"``, `BlobStringReply`\<`string`\>, ``"Chunks"``, [``"startTimestamp"``, `NumberReply`\<...\>, ``"endTimestamp"``, `NumberReply`\<...\>, ``"samples"``, `NumberReply`\<...\>, ``"size"``, `NumberReply`\<...\>, ``"bytesPerSample"``, `SimpleStringReply`\<...\>][]], `_`: `any`, `typeMapping?`: `TypeMapping`) => `InfoDebugReply` ; `3`: () => `ReplyUnion`  } ; `unstableResp3`: ``true``  } ; `mAdd`: \{ `IS_READ_ONLY`: ``false`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `toAdd`: `TsMAddSample`[]) => `void` ; `transformReply`: () => `ArrayReply`\<`SimpleErrorReply` \| `NumberReply`\<`number`\>\>  } ; `mGet`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetRawReply2`, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `sample`: \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }  }\>  }  } ; `mGetSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `selectedLabels`: `RedisVariadicArgument`, `options?`: `TsMGetOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`NullReply` \| `BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`NullReply` \| `BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `NullReply` \| `BlobStringReply`\<...\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mGetWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`, `options?`: `TsMGetWithLabelsOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `MGetLabelsRawReply2`\<`BlobStringReply`\<`string`\>\>, `_`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }  }\> ; `3`: (`this`: `void`, `reply`: `MGetLabelsRawReply3`\<`BlobStringReply`\<`string`\>\>) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<`string`\>, `BlobStringReply`\<`string`\>\> ; `sample`: \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }  }\>  }  } ; `mRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRange`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `number`  }[]\> ; `3`: (`this`: `void`, `reply`: `TsMRangeRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `timestamp`: `NumberReply`\<...\> ; `value`: `DoubleReply`\<...\>  }[]\>  }  } ; `mRevRangeGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeSelectedLabels`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `never` ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeSelectedLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `selectedLabels`: `RedisVariadicArgument`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeSelectedLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, ... \| ...\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `mRevRangeWithLabels`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `Record`\<`string`, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[]  }\>  }  } ; `mRevRangeWithLabelsGroupBy`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`parser`: `CommandParser`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `filter`: `RedisVariadicArgument`, `groupBy`: `TsMRangeGroupBy`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply2`, `_?`: `any`, `typeMapping?`: `TypeMapping`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: ...[] \| ...[]  }\> ; `3`: (`this`: `void`, `reply`: `TsMRangeWithLabelsGroupByRawReply3`) => `MapReply`\<`BlobStringReply`\<`string`\>, \{ `labels`: `MapReply`\<`BlobStringReply`\<...\>, `BlobStringReply`\<...\>\> ; `samples`: \{ `timestamp`: ... ; `value`: ...  }[] ; `sources`: `ArrayReply`\<`BlobStringReply`\<...\>\>  }\>  }  } ; `queryIndex`: \{ `IS_READ_ONLY`: ``true`` ; `NOT_KEYED_COMMAND`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `filter`: `RedisVariadicArgument`) => `void` ; `transformReply`: \{ `2`: () => `ArrayReply`\<`BlobStringReply`\<`string`\>\> ; `3`: () => `SetReply`\<`BlobStringReply`\<`string`\>\>  }  } ; `range`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  } ; `revRange`: \{ `IS_READ_ONLY`: ``true`` ; `parseCommand`: (`this`: `void`, `parser`: `CommandParser`, `key`: `RedisArgument`, `fromTimestamp`: `Timestamp`, `toTimestamp`: `Timestamp`, `options?`: `TsRangeOptions`) => `void` ; `transformReply`: \{ `2`: (`this`: `void`, `reply`: `RespType`\<``42``, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[], `never`, `RespType`\<``42``, [..., ...], `never`, [..., ...]\>[]\>) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `number`  }[] ; `3`: (`this`: `void`, `reply`: `SamplesRawReply`) => \{ `timestamp`: `NumberReply`\<`number`\> ; `value`: `DoubleReply`\<`number`\>  }[]  }  }  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`, `RespVersions`, `TypeMapping`\>

#### Defined in

[src/matcher.class.ts:103](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L103)

___

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:75](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L75)

___

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:74](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L74)

___

### reliability

• `Private` **reliability**: `ReliabilityManager`

#### Defined in

[src/matcher.class.ts:97](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L97)

___

### streamConsumerGroup

• `Private` **streamConsumerGroup**: `string`

#### Defined in

[src/matcher.class.ts:91](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L91)

___

### streamConsumerName

• `Private` **streamConsumerName**: `string`

#### Defined in

[src/matcher.class.ts:92](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L92)

___

### telemetry

• `Private` **telemetry**: `TelemetryManager`

#### Defined in

[src/matcher.class.ts:98](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L98)

___

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:78](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L78)

___

### usingDefaultMatchScore

• `Private` **usingDefaultMatchScore**: `boolean`

#### Defined in

[src/matcher.class.ts:100](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L100)

___

### workflow

• `Private` **workflow**: `WorkflowManager`

#### Defined in

[src/matcher.class.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L93)

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

[src/matcher.class.ts:164](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L164)

___

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:477](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L477)

___

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:491](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L491)

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

[src/matcher.class.ts:800](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L800)

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

[src/matcher.class.ts:313](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L313)

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

[src/matcher.class.ts:300](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L300)

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

[src/matcher.class.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L203)

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

[src/matcher.class.ts:472](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L472)

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

[src/matcher.class.ts:1019](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1019)

___

### clearDeadLetterQueue

▸ **clearDeadLetterQueue**(): `Promise`\<`number`\>

Clear all events from the Dead Letter Queue.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:259](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L259)

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

[src/matcher.class.ts:861](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L861)

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

[src/matcher.class.ts:454](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L454)

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

[src/matcher.class.ts:1143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1143)

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

[src/matcher.class.ts:912](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L912)

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

[src/matcher.class.ts:1012](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1012)

___

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

Get all assignments (queued, pending, and accepted).
For large datasets, prefer using getAssignmentsPaginated() instead.

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:414](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L414)

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

[src/matcher.class.ts:442](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L442)

___

### getAssignmentCounts

▸ **getAssignmentCounts**(): `Promise`\<`AssignmentCounts`\>

Get assignment counts by status without fetching the data.
Efficient for dashboards and monitoring.

#### Returns

`Promise`\<`AssignmentCounts`\>

#### Defined in

[src/matcher.class.ts:435](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L435)

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

[src/matcher.class.ts:449](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L449)

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

[src/matcher.class.ts:427](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L427)

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

[src/matcher.class.ts:266](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L266)

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

[src/matcher.class.ts:794](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L794)

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

[src/matcher.class.ts:228](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L228)

___

### getDeadLetterQueueSize

▸ **getDeadLetterQueueSize**(): `Promise`\<`number`\>

Get Dead Letter Queue size.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:238](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L238)

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

[src/matcher.class.ts:558](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L558)

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

[src/matcher.class.ts:973](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L973)

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

[src/matcher.class.ts:998](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L998)

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

[src/matcher.class.ts:1005](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1005)

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

[src/matcher.class.ts:1114](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1114)

___

### initRedis

▸ **initRedis**(): `Promise`\<[`default`](default.md)\>

#### Returns

`Promise`\<[`default`](default.md)\>

#### Defined in

[src/matcher.class.ts:173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L173)

___

### initStreamConsumerGroup

▸ **initStreamConsumerGroup**(): `Promise`\<`void`\>

Initialize the Redis Stream consumer group for workflow events.
Creates the stream and consumer group if they don't exist.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:285](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L285)

___

### listWorkflowDefinitions

▸ **listWorkflowDefinitions**(): `Promise`\<\{ `id`: `string` ; `name`: `string`  }[]\>

List all registered workflow definitions.

#### Returns

`Promise`\<\{ `id`: `string` ; `name`: `string`  }[]\>

#### Defined in

[src/matcher.class.ts:980](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L980)

___

### loadLuaScripts

▸ **loadLuaScripts**(): `Promise`\<`void`\>

Load Lua scripts into Redis for atomic operations.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:192](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L192)

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

[src/matcher.class.ts:743](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L743)

___

### processExpiredMatches

▸ **processExpiredMatches**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1059](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1059)

___

### processExpiredWorkflowSteps

▸ **processExpiredWorkflowSteps**(): `Promise`\<`number`\>

Check and process expired workflow steps.
Should be called periodically.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:1029](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1029)

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

[src/matcher.class.ts:1037](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1037)

___

### reclaimOrphanedMessages

▸ **reclaimOrphanedMessages**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:221](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L221)

___

### registerWorkflow

▸ **registerWorkflow**(`definition`): `Promise`\<[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)\>

Register a new workflow definition.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md) |

#### Returns

`Promise`\<[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)\>

#### Defined in

[src/matcher.class.ts:966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L966)

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

[src/matcher.class.ts:825](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L825)

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

[src/matcher.class.ts:356](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L356)

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

[src/matcher.class.ts:399](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L399)

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

[src/matcher.class.ts:245](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L245)

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

[src/matcher.class.ts:504](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L504)

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

[src/matcher.class.ts:529](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L529)

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

[src/matcher.class.ts:277](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L277)

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

[src/matcher.class.ts:1096](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1096)

___

### startOrchestrator

▸ **startOrchestrator**(): `Promise`\<`void`\>

Start the workflow orchestrator.
This listens to the event stream and processes workflow transitions.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:1045](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1045)

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

[src/matcher.class.ts:987](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L987)

___

### stopAutoReleaseInterval

▸ **stopAutoReleaseInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:1103](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1103)

___

### stopOrchestrator

▸ **stopOrchestrator**(): `Promise`\<`void`\>

Stop the workflow orchestrator.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:1052](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/matcher.class.ts#L1052)
