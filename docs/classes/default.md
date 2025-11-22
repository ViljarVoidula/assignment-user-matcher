[assignment-user-matcher](../README.md) / [Exports](../modules.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [allTagsKey](default.md#alltagskey)
- [assignmentOwnerKey](default.md#assignmentownerkey)
- [assignmentsKey](default.md#assignmentskey)
- [assignmentsRefKey](default.md#assignmentsrefkey)
- [autoReleaseInterval](default.md#autoreleaseinterval)
- [enableDefaultMatching](default.md#enabledefaultmatching)
- [matchExpirationMs](default.md#matchexpirationms)
- [maxUserBacklogSize](default.md#maxuserbacklogsize)
- [pendingAssignmentsExpiryKey](default.md#pendingassignmentsexpirykey)
- [pendingAssignmentsKey](default.md#pendingassignmentskey)
- [redisClient](default.md#redisclient)
- [redisPrefix](default.md#redisprefix)
- [relevantBatchSize](default.md#relevantbatchsize)
- [usersKey](default.md#userskey)

### Accessors

- [stats](default.md#stats)
- [usersWithoutAssignment](default.md#userswithoutassignment)

### Methods

- [acceptAssignment](default.md#acceptassignment)
- [addAssignment](default.md#addassignment)
- [addUser](default.md#adduser)
- [calculatePriority](default.md#calculatepriority)
- [expandTagWildcards](default.md#expandtagwildcards)
- [getAllAssignments](default.md#getallassignments)
- [getCurrentAssignmentsForUser](default.md#getcurrentassignmentsforuser)
- [getUserRelatedAssignments](default.md#getuserrelatedassignments)
- [initRedis](default.md#initredis)
- [matchScore](default.md#matchscore)
- [matchUsersAssignments](default.md#matchusersassignments)
- [processExpiredMatches](default.md#processexpiredmatches)
- [rejectAssignment](default.md#rejectassignment)
- [removeAssignment](default.md#removeassignment)
- [removeUser](default.md#removeuser)
- [setAssignmentPriority](default.md#setassignmentpriority)
- [setAssignmentPriorityByTags](default.md#setassignmentprioritybytags)
- [startAutoReleaseInterval](default.md#startautoreleaseinterval)
- [stopAutoReleaseInterval](default.md#stopautoreleaseinterval)

## Constructors

### constructor

• **new default**(`redisClient`, `options?`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `redisClient` | `RedisClientType`\<\{ `bf`: \{ `ADD`: `__module` ; `CARD`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `LOADCHUNK`: `__module` ; `MADD`: `__module` ; `MEXISTS`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `card`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `loadChunk`: `__module` ; `mAdd`: `__module` ; `mExists`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module`  } ; `cf`: \{ `ADD`: `__module` ; `ADDNX`: `__module` ; `COUNT`: `__module` ; `DEL`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `INSERTNX`: `__module` ; `LOADCHUNK`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `addNX`: `__module` ; `count`: `__module` ; `del`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `insertNX`: `__module` ; `loadChunk`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module`  } ; `cms`: \{ `INCRBY`: `__module` ; `INFO`: `__module` ; `INITBYDIM`: `__module` ; `INITBYPROB`: `__module` ; `MERGE`: `__module` ; `QUERY`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `initByDim`: `__module` ; `initByProb`: `__module` ; `merge`: `__module` ; `query`: `__module`  } ; `ft`: \{ `AGGREGATE`: `__module` ; `AGGREGATE_WITHCURSOR`: `__module` ; `ALIASADD`: `__module` ; `ALIASDEL`: `__module` ; `ALIASUPDATE`: `__module` ; `ALTER`: `__module` ; `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `CREATE`: `__module` ; `CURSOR_DEL`: `__module` ; `CURSOR_READ`: `__module` ; `DICTADD`: `__module` ; `DICTDEL`: `__module` ; `DICTDUMP`: `__module` ; `DROPINDEX`: `__module` ; `EXPLAIN`: `__module` ; `EXPLAINCLI`: `__module` ; `INFO`: `__module` ; `PROFILEAGGREGATE`: `__module` ; `PROFILESEARCH`: `__module` ; `SEARCH`: `__module` ; `SEARCH_NOCONTENT`: `__module` ; `SPELLCHECK`: `__module` ; `SUGADD`: `__module` ; `SUGDEL`: `__module` ; `SUGGET`: `__module` ; `SUGGET_WITHPAYLOADS`: `__module` ; `SUGGET_WITHSCORES`: `__module` ; `SUGGET_WITHSCORES_WITHPAYLOADS`: `__module` ; `SUGLEN`: `__module` ; `SYNDUMP`: `__module` ; `SYNUPDATE`: `__module` ; `TAGVALS`: `__module` ; `_LIST`: `__module` ; `_list`: `__module` ; `aggregate`: `__module` ; `aggregateWithCursor`: `__module` ; `aliasAdd`: `__module` ; `aliasDel`: `__module` ; `aliasUpdate`: `__module` ; `alter`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `create`: `__module` ; `cursorDel`: `__module` ; `cursorRead`: `__module` ; `dictAdd`: `__module` ; `dictDel`: `__module` ; `dictDump`: `__module` ; `dropIndex`: `__module` ; `explain`: `__module` ; `explainCli`: `__module` ; `info`: `__module` ; `profileAggregate`: `__module` ; `profileSearch`: `__module` ; `search`: `__module` ; `searchNoContent`: `__module` ; `spellCheck`: `__module` ; `sugAdd`: `__module` ; `sugDel`: `__module` ; `sugGet`: `__module` ; `sugGetWithPayloads`: `__module` ; `sugGetWithScores`: `__module` ; `sugGetWithScoresWithPayloads`: `__module` ; `sugLen`: `__module` ; `synDump`: `__module` ; `synUpdate`: `__module` ; `tagVals`: `__module`  } ; `graph`: \{ `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `DELETE`: `__module` ; `EXPLAIN`: `__module` ; `LIST`: `__module` ; `PROFILE`: `__module` ; `QUERY`: `__module` ; `RO_QUERY`: `__module` ; `SLOWLOG`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `delete`: `__module` ; `explain`: `__module` ; `list`: `__module` ; `profile`: `__module` ; `query`: `__module` ; `roQuery`: `__module` ; `slowLog`: `__module`  } ; `json`: \{ `ARRAPPEND`: `__module` ; `ARRINDEX`: `__module` ; `ARRINSERT`: `__module` ; `ARRLEN`: `__module` ; `ARRPOP`: `__module` ; `ARRTRIM`: `__module` ; `DEBUG_MEMORY`: `__module` ; `DEL`: `__module` ; `FORGET`: `__module` ; `GET`: `__module` ; `MERGE`: `__module` ; `MGET`: `__module` ; `MSET`: `__module` ; `NUMINCRBY`: `__module` ; `NUMMULTBY`: `__module` ; `OBJKEYS`: `__module` ; `OBJLEN`: `__module` ; `RESP`: `__module` ; `SET`: `__module` ; `STRAPPEND`: `__module` ; `STRLEN`: `__module` ; `TYPE`: `__module` ; `arrAppend`: `__module` ; `arrIndex`: `__module` ; `arrInsert`: `__module` ; `arrLen`: `__module` ; `arrPop`: `__module` ; `arrTrim`: `__module` ; `debugMemory`: `__module` ; `del`: `__module` ; `forget`: `__module` ; `get`: `__module` ; `mGet`: `__module` ; `mSet`: `__module` ; `merge`: `__module` ; `numIncrBy`: `__module` ; `numMultBy`: `__module` ; `objKeys`: `__module` ; `objLen`: `__module` ; `resp`: `__module` ; `set`: `__module` ; `strAppend`: `__module` ; `strLen`: `__module` ; `type`: `__module`  } ; `tDigest`: \{ `ADD`: `__module` ; `BYRANK`: `__module` ; `BYREVRANK`: `__module` ; `CDF`: `__module` ; `CREATE`: `__module` ; `INFO`: `__module` ; `MAX`: `__module` ; `MERGE`: `__module` ; `MIN`: `__module` ; `QUANTILE`: `__module` ; `RANK`: `__module` ; `RESET`: `__module` ; `REVRANK`: `__module` ; `TRIMMED_MEAN`: `__module` ; `add`: `__module` ; `byRank`: `__module` ; `byRevRank`: `__module` ; `cdf`: `__module` ; `create`: `__module` ; `info`: `__module` ; `max`: `__module` ; `merge`: `__module` ; `min`: `__module` ; `quantile`: `__module` ; `rank`: `__module` ; `reset`: `__module` ; `revRank`: `__module` ; `trimmedMean`: `__module`  } ; `topK`: \{ `ADD`: `__module` ; `COUNT`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `LIST`: `__module` ; `LIST_WITHCOUNT`: `__module` ; `QUERY`: `__module` ; `RESERVE`: `__module` ; `add`: `__module` ; `count`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `list`: `__module` ; `listWithCount`: `__module` ; `query`: `__module` ; `reserve`: `__module`  } ; `ts`: \{ `ADD`: `__module` ; `ALTER`: `__module` ; `CREATE`: `__module` ; `CREATERULE`: `__module` ; `DECRBY`: `__module` ; `DEL`: `__module` ; `DELETERULE`: `__module` ; `GET`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `INFO_DEBUG`: `__module` ; `MADD`: `__module` ; `MGET`: `__module` ; `MGET_WITHLABELS`: `__module` ; `MRANGE`: `__module` ; `MRANGE_WITHLABELS`: `__module` ; `MREVRANGE`: `__module` ; `MREVRANGE_WITHLABELS`: `__module` ; `QUERYINDEX`: `__module` ; `RANGE`: `__module` ; `REVRANGE`: `__module` ; `add`: `__module` ; `alter`: `__module` ; `create`: `__module` ; `createRule`: `__module` ; `decrBy`: `__module` ; `del`: `__module` ; `deleteRule`: `__module` ; `get`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `infoDebug`: `__module` ; `mAdd`: `__module` ; `mGet`: `__module` ; `mGetWithLabels`: `__module` ; `mRange`: `__module` ; `mRangeWithLabels`: `__module` ; `mRevRange`: `__module` ; `mRevRangeWithLabels`: `__module` ; `queryIndex`: `__module` ; `range`: `__module` ; `revRange`: `__module`  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`\> |
| `options?` | [`options`](../modules.md#options) |

#### Returns

[`default`](default.md)

#### Defined in

[src/matcher.class.ts:55](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L55)

## Properties

### allTagsKey

• **allTagsKey**: `string`

#### Defined in

[src/matcher.class.ts:53](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L53)

___

### assignmentOwnerKey

• **assignmentOwnerKey**: `string`

#### Defined in

[src/matcher.class.ts:52](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L52)

___

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:44](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L44)

___

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:45](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L45)

___

### autoReleaseInterval

• `Private` **autoReleaseInterval**: ``null`` \| `Timeout` = `null`

#### Defined in

[src/matcher.class.ts:600](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L600)

___

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:48](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L48)

___

### matchExpirationMs

• **matchExpirationMs**: `number`

#### Defined in

[src/matcher.class.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L49)

___

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:47](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L47)

___

### pendingAssignmentsExpiryKey

• **pendingAssignmentsExpiryKey**: `string`

#### Defined in

[src/matcher.class.ts:51](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L51)

___

### pendingAssignmentsKey

• **pendingAssignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:50](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L50)

___

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: `__module` ; `CARD`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `LOADCHUNK`: `__module` ; `MADD`: `__module` ; `MEXISTS`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `card`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `loadChunk`: `__module` ; `mAdd`: `__module` ; `mExists`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module`  } ; `cf`: \{ `ADD`: `__module` ; `ADDNX`: `__module` ; `COUNT`: `__module` ; `DEL`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `INSERTNX`: `__module` ; `LOADCHUNK`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `addNX`: `__module` ; `count`: `__module` ; `del`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `insertNX`: `__module` ; `loadChunk`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module`  } ; `cms`: \{ `INCRBY`: `__module` ; `INFO`: `__module` ; `INITBYDIM`: `__module` ; `INITBYPROB`: `__module` ; `MERGE`: `__module` ; `QUERY`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `initByDim`: `__module` ; `initByProb`: `__module` ; `merge`: `__module` ; `query`: `__module`  } ; `ft`: \{ `AGGREGATE`: `__module` ; `AGGREGATE_WITHCURSOR`: `__module` ; `ALIASADD`: `__module` ; `ALIASDEL`: `__module` ; `ALIASUPDATE`: `__module` ; `ALTER`: `__module` ; `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `CREATE`: `__module` ; `CURSOR_DEL`: `__module` ; `CURSOR_READ`: `__module` ; `DICTADD`: `__module` ; `DICTDEL`: `__module` ; `DICTDUMP`: `__module` ; `DROPINDEX`: `__module` ; `EXPLAIN`: `__module` ; `EXPLAINCLI`: `__module` ; `INFO`: `__module` ; `PROFILEAGGREGATE`: `__module` ; `PROFILESEARCH`: `__module` ; `SEARCH`: `__module` ; `SEARCH_NOCONTENT`: `__module` ; `SPELLCHECK`: `__module` ; `SUGADD`: `__module` ; `SUGDEL`: `__module` ; `SUGGET`: `__module` ; `SUGGET_WITHPAYLOADS`: `__module` ; `SUGGET_WITHSCORES`: `__module` ; `SUGGET_WITHSCORES_WITHPAYLOADS`: `__module` ; `SUGLEN`: `__module` ; `SYNDUMP`: `__module` ; `SYNUPDATE`: `__module` ; `TAGVALS`: `__module` ; `_LIST`: `__module` ; `_list`: `__module` ; `aggregate`: `__module` ; `aggregateWithCursor`: `__module` ; `aliasAdd`: `__module` ; `aliasDel`: `__module` ; `aliasUpdate`: `__module` ; `alter`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `create`: `__module` ; `cursorDel`: `__module` ; `cursorRead`: `__module` ; `dictAdd`: `__module` ; `dictDel`: `__module` ; `dictDump`: `__module` ; `dropIndex`: `__module` ; `explain`: `__module` ; `explainCli`: `__module` ; `info`: `__module` ; `profileAggregate`: `__module` ; `profileSearch`: `__module` ; `search`: `__module` ; `searchNoContent`: `__module` ; `spellCheck`: `__module` ; `sugAdd`: `__module` ; `sugDel`: `__module` ; `sugGet`: `__module` ; `sugGetWithPayloads`: `__module` ; `sugGetWithScores`: `__module` ; `sugGetWithScoresWithPayloads`: `__module` ; `sugLen`: `__module` ; `synDump`: `__module` ; `synUpdate`: `__module` ; `tagVals`: `__module`  } ; `graph`: \{ `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `DELETE`: `__module` ; `EXPLAIN`: `__module` ; `LIST`: `__module` ; `PROFILE`: `__module` ; `QUERY`: `__module` ; `RO_QUERY`: `__module` ; `SLOWLOG`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `delete`: `__module` ; `explain`: `__module` ; `list`: `__module` ; `profile`: `__module` ; `query`: `__module` ; `roQuery`: `__module` ; `slowLog`: `__module`  } ; `json`: \{ `ARRAPPEND`: `__module` ; `ARRINDEX`: `__module` ; `ARRINSERT`: `__module` ; `ARRLEN`: `__module` ; `ARRPOP`: `__module` ; `ARRTRIM`: `__module` ; `DEBUG_MEMORY`: `__module` ; `DEL`: `__module` ; `FORGET`: `__module` ; `GET`: `__module` ; `MERGE`: `__module` ; `MGET`: `__module` ; `MSET`: `__module` ; `NUMINCRBY`: `__module` ; `NUMMULTBY`: `__module` ; `OBJKEYS`: `__module` ; `OBJLEN`: `__module` ; `RESP`: `__module` ; `SET`: `__module` ; `STRAPPEND`: `__module` ; `STRLEN`: `__module` ; `TYPE`: `__module` ; `arrAppend`: `__module` ; `arrIndex`: `__module` ; `arrInsert`: `__module` ; `arrLen`: `__module` ; `arrPop`: `__module` ; `arrTrim`: `__module` ; `debugMemory`: `__module` ; `del`: `__module` ; `forget`: `__module` ; `get`: `__module` ; `mGet`: `__module` ; `mSet`: `__module` ; `merge`: `__module` ; `numIncrBy`: `__module` ; `numMultBy`: `__module` ; `objKeys`: `__module` ; `objLen`: `__module` ; `resp`: `__module` ; `set`: `__module` ; `strAppend`: `__module` ; `strLen`: `__module` ; `type`: `__module`  } ; `tDigest`: \{ `ADD`: `__module` ; `BYRANK`: `__module` ; `BYREVRANK`: `__module` ; `CDF`: `__module` ; `CREATE`: `__module` ; `INFO`: `__module` ; `MAX`: `__module` ; `MERGE`: `__module` ; `MIN`: `__module` ; `QUANTILE`: `__module` ; `RANK`: `__module` ; `RESET`: `__module` ; `REVRANK`: `__module` ; `TRIMMED_MEAN`: `__module` ; `add`: `__module` ; `byRank`: `__module` ; `byRevRank`: `__module` ; `cdf`: `__module` ; `create`: `__module` ; `info`: `__module` ; `max`: `__module` ; `merge`: `__module` ; `min`: `__module` ; `quantile`: `__module` ; `rank`: `__module` ; `reset`: `__module` ; `revRank`: `__module` ; `trimmedMean`: `__module`  } ; `topK`: \{ `ADD`: `__module` ; `COUNT`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `LIST`: `__module` ; `LIST_WITHCOUNT`: `__module` ; `QUERY`: `__module` ; `RESERVE`: `__module` ; `add`: `__module` ; `count`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `list`: `__module` ; `listWithCount`: `__module` ; `query`: `__module` ; `reserve`: `__module`  } ; `ts`: \{ `ADD`: `__module` ; `ALTER`: `__module` ; `CREATE`: `__module` ; `CREATERULE`: `__module` ; `DECRBY`: `__module` ; `DEL`: `__module` ; `DELETERULE`: `__module` ; `GET`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `INFO_DEBUG`: `__module` ; `MADD`: `__module` ; `MGET`: `__module` ; `MGET_WITHLABELS`: `__module` ; `MRANGE`: `__module` ; `MRANGE_WITHLABELS`: `__module` ; `MREVRANGE`: `__module` ; `MREVRANGE_WITHLABELS`: `__module` ; `QUERYINDEX`: `__module` ; `RANGE`: `__module` ; `REVRANGE`: `__module` ; `add`: `__module` ; `alter`: `__module` ; `create`: `__module` ; `createRule`: `__module` ; `decrBy`: `__module` ; `del`: `__module` ; `deleteRule`: `__module` ; `get`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `infoDebug`: `__module` ; `mAdd`: `__module` ; `mGet`: `__module` ; `mGetWithLabels`: `__module` ; `mRange`: `__module` ; `mRangeWithLabels`: `__module` ; `mRevRange`: `__module` ; `mRevRangeWithLabels`: `__module` ; `queryIndex`: `__module` ; `range`: `__module` ; `revRange`: `__module`  }  } & `RedisModules`, `RedisFunctions`, `RedisScripts`\>

#### Defined in

[src/matcher.class.ts:56](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L56)

___

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:43](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L43)

___

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:42](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L42)

___

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:46](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L46)

## Accessors

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:260](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L260)

___

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L274)

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

[src/matcher.class.ts:536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L536)

___

### addAssignment

▸ **addAssignment**(`assignment`): `Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignment` | [`Assignment`](../modules.md#assignment) |

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Defined in

[src/matcher.class.ts:97](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L97)

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

[src/matcher.class.ts:84](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L84)

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

[src/matcher.class.ts:255](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L255)

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

[src/matcher.class.ts:616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L616)

___

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L178)

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

[src/matcher.class.ts:530](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L530)

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

[src/matcher.class.ts:341](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L341)

___

### initRedis

▸ **initRedis**(): `Promise`\<[`default`](default.md)\>

#### Returns

`Promise`\<[`default`](default.md)\>

#### Defined in

[src/matcher.class.ts:76](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L76)

___

### matchScore

▸ **matchScore**(`user`, `assignmentTags`, `assignmentPriority`, `assignmentId?`): `Promise`\<[`number`, `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`User`](../interfaces/User.md) |
| `assignmentTags` | `string` |
| `assignmentPriority` | `string` \| `number` |
| `assignmentId?` | `string` |

#### Returns

`Promise`\<[`number`, `number`]\>

#### Defined in

[src/matcher.class.ts:183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L183)

___

### matchUsersAssignments

▸ **matchUsersAssignments**(`userId?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId?` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:479](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L479)

___

### processExpiredMatches

▸ **processExpiredMatches**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:576](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L576)

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

[src/matcher.class.ts:553](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L553)

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

[src/matcher.class.ts:140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L140)

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

[src/matcher.class.ts:168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L168)

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

[src/matcher.class.ts:287](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L287)

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

[src/matcher.class.ts:312](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L312)

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

[src/matcher.class.ts:602](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L602)

___

### stopAutoReleaseInterval

▸ **stopAutoReleaseInterval**(): `void`

#### Returns

`void`

#### Defined in

[src/matcher.class.ts:609](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L609)
