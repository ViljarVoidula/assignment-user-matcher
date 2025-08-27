[assignment-user-matcher](../README.md) / [Exports](../modules.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [assignmentsKey](default.md#assignmentskey)
- [assignmentsRefKey](default.md#assignmentsrefkey)
- [enableDefaultMatching](default.md#enabledefaultmatching)
- [maxUserBacklogSize](default.md#maxuserbacklogsize)
- [redisClient](default.md#redisclient)
- [redisPrefix](default.md#redisprefix)
- [relevantBatchSize](default.md#relevantbatchsize)
- [usersKey](default.md#userskey)

### Accessors

- [stats](default.md#stats)
- [usersWithoutAssignment](default.md#userswithoutassignment)

### Methods

- [addAssignment](default.md#addassignment)
- [addUser](default.md#adduser)
- [calculatePriority](default.md#calculatepriority)
- [getAllAssignments](default.md#getallassignments)
- [getCurrentAssignmentsForUser](default.md#getcurrentassignmentsforuser)
- [getUserRelatedAssignments](default.md#getuserrelatedassignments)
- [initRedis](default.md#initredis)
- [matchScore](default.md#matchscore)
- [matchUsersAssignments](default.md#matchusersassignments)
- [removeAssignment](default.md#removeassignment)
- [removeUser](default.md#removeuser)
- [setAssignmentPriority](default.md#setassignmentpriority)
- [setAssignmentPriorityByTags](default.md#setassignmentprioritybytags)

## Constructors

### constructor

• **new default**(`redisClient`, `options?`): [`default`](default.md)

#### Parameters

| Name          | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `redisClient` | `RedisClientType`\<\{ `bf`: \{ `ADD`: `__module` ; `CARD`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `LOADCHUNK`: `__module` ; `MADD`: `__module` ; `MEXISTS`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `card`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `loadChunk`: `__module` ; `mAdd`: `__module` ; `mExists`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module` } ; `cf`: \{ `ADD`: `__module` ; `ADDNX`: `__module` ; `COUNT`: `__module` ; `DEL`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `INSERTNX`: `__module` ; `LOADCHUNK`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `addNX`: `__module` ; `count`: `__module` ; `del`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `insertNX`: `__module` ; `loadChunk`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module` } ; `cms`: \{ `INCRBY`: `__module` ; `INFO`: `__module` ; `INITBYDIM`: `__module` ; `INITBYPROB`: `__module` ; `MERGE`: `__module` ; `QUERY`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `initByDim`: `__module` ; `initByProb`: `__module` ; `merge`: `__module` ; `query`: `__module` } ; `ft`: \{ `AGGREGATE`: `__module` ; `AGGREGATE_WITHCURSOR`: `__module` ; `ALIASADD`: `__module` ; `ALIASDEL`: `__module` ; `ALIASUPDATE`: `__module` ; `ALTER`: `__module` ; `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `CREATE`: `__module` ; `CURSOR_DEL`: `__module` ; `CURSOR_READ`: `__module` ; `DICTADD`: `__module` ; `DICTDEL`: `__module` ; `DICTDUMP`: `__module` ; `DROPINDEX`: `__module` ; `EXPLAIN`: `__module` ; `EXPLAINCLI`: `__module` ; `INFO`: `__module` ; `PROFILEAGGREGATE`: `__module` ; `PROFILESEARCH`: `__module` ; `SEARCH`: `__module` ; `SEARCH_NOCONTENT`: `__module` ; `SPELLCHECK`: `__module` ; `SUGADD`: `__module` ; `SUGDEL`: `__module` ; `SUGGET`: `__module` ; `SUGGET_WITHPAYLOADS`: `__module` ; `SUGGET_WITHSCORES`: `__module` ; `SUGGET_WITHSCORES_WITHPAYLOADS`: `__module` ; `SUGLEN`: `__module` ; `SYNDUMP`: `__module` ; `SYNUPDATE`: `__module` ; `TAGVALS`: `__module` ; `_LIST`: `__module` ; `_list`: `__module` ; `aggregate`: `__module` ; `aggregateWithCursor`: `__module` ; `aliasAdd`: `__module` ; `aliasDel`: `__module` ; `aliasUpdate`: `__module` ; `alter`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `create`: `__module` ; `cursorDel`: `__module` ; `cursorRead`: `__module` ; `dictAdd`: `__module` ; `dictDel`: `__module` ; `dictDump`: `__module` ; `dropIndex`: `__module` ; `explain`: `__module` ; `explainCli`: `__module` ; `info`: `__module` ; `profileAggregate`: `__module` ; `profileSearch`: `__module` ; `search`: `__module` ; `searchNoContent`: `__module` ; `spellCheck`: `__module` ; `sugAdd`: `__module` ; `sugDel`: `__module` ; `sugGet`: `__module` ; `sugGetWithPayloads`: `__module` ; `sugGetWithScores`: `__module` ; `sugGetWithScoresWithPayloads`: `__module` ; `sugLen`: `__module` ; `synDump`: `__module` ; `synUpdate`: `__module` ; `tagVals`: `__module` } ; `graph`: \{ `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `DELETE`: `__module` ; `EXPLAIN`: `__module` ; `LIST`: `__module` ; `PROFILE`: `__module` ; `QUERY`: `__module` ; `RO_QUERY`: `__module` ; `SLOWLOG`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `delete`: `__module` ; `explain`: `__module` ; `list`: `__module` ; `profile`: `__module` ; `query`: `__module` ; `roQuery`: `__module` ; `slowLog`: `__module` } ; `json`: \{ `ARRAPPEND`: `__module` ; `ARRINDEX`: `__module` ; `ARRINSERT`: `__module` ; `ARRLEN`: `__module` ; `ARRPOP`: `__module` ; `ARRTRIM`: `__module` ; `DEBUG_MEMORY`: `__module` ; `DEL`: `__module` ; `FORGET`: `__module` ; `GET`: `__module` ; `MERGE`: `__module` ; `MGET`: `__module` ; `MSET`: `__module` ; `NUMINCRBY`: `__module` ; `NUMMULTBY`: `__module` ; `OBJKEYS`: `__module` ; `OBJLEN`: `__module` ; `RESP`: `__module` ; `SET`: `__module` ; `STRAPPEND`: `__module` ; `STRLEN`: `__module` ; `TYPE`: `__module` ; `arrAppend`: `__module` ; `arrIndex`: `__module` ; `arrInsert`: `__module` ; `arrLen`: `__module` ; `arrPop`: `__module` ; `arrTrim`: `__module` ; `debugMemory`: `__module` ; `del`: `__module` ; `forget`: `__module` ; `get`: `__module` ; `mGet`: `__module` ; `mSet`: `__module` ; `merge`: `__module` ; `numIncrBy`: `__module` ; `numMultBy`: `__module` ; `objKeys`: `__module` ; `objLen`: `__module` ; `resp`: `__module` ; `set`: `__module` ; `strAppend`: `__module` ; `strLen`: `__module` ; `type`: `__module` } ; `tDigest`: \{ `ADD`: `__module` ; `BYRANK`: `__module` ; `BYREVRANK`: `__module` ; `CDF`: `__module` ; `CREATE`: `__module` ; `INFO`: `__module` ; `MAX`: `__module` ; `MERGE`: `__module` ; `MIN`: `__module` ; `QUANTILE`: `__module` ; `RANK`: `__module` ; `RESET`: `__module` ; `REVRANK`: `__module` ; `TRIMMED_MEAN`: `__module` ; `add`: `__module` ; `byRank`: `__module` ; `byRevRank`: `__module` ; `cdf`: `__module` ; `create`: `__module` ; `info`: `__module` ; `max`: `__module` ; `merge`: `__module` ; `min`: `__module` ; `quantile`: `__module` ; `rank`: `__module` ; `reset`: `__module` ; `revRank`: `__module` ; `trimmedMean`: `__module` } ; `topK`: \{ `ADD`: `__module` ; `COUNT`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `LIST`: `__module` ; `LIST_WITHCOUNT`: `__module` ; `QUERY`: `__module` ; `RESERVE`: `__module` ; `add`: `__module` ; `count`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `list`: `__module` ; `listWithCount`: `__module` ; `query`: `__module` ; `reserve`: `__module` } ; `ts`: \{ `ADD`: `__module` ; `ALTER`: `__module` ; `CREATE`: `__module` ; `CREATERULE`: `__module` ; `DECRBY`: `__module` ; `DEL`: `__module` ; `DELETERULE`: `__module` ; `GET`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `INFO_DEBUG`: `__module` ; `MADD`: `__module` ; `MGET`: `__module` ; `MGET_WITHLABELS`: `__module` ; `MRANGE`: `__module` ; `MRANGE_WITHLABELS`: `__module` ; `MREVRANGE`: `__module` ; `MREVRANGE_WITHLABELS`: `__module` ; `QUERYINDEX`: `__module` ; `RANGE`: `__module` ; `REVRANGE`: `__module` ; `add`: `__module` ; `alter`: `__module` ; `create`: `__module` ; `createRule`: `__module` ; `decrBy`: `__module` ; `del`: `__module` ; `deleteRule`: `__module` ; `get`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `infoDebug`: `__module` ; `mAdd`: `__module` ; `mGet`: `__module` ; `mGetWithLabels`: `__module` ; `mRange`: `__module` ; `mRangeWithLabels`: `__module` ; `mRevRange`: `__module` ; `mRevRangeWithLabels`: `__module` ; `queryIndex`: `__module` ; `range`: `__module` ; `revRange`: `__module` } } & `RedisModules`, `RedisFunctions`, `RedisScripts`\> |
| `options?`    | [`options`](../modules.md#options)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

#### Returns

[`default`](default.md)

#### Defined in

[src/matcher.class.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L49)

## Properties

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

[src/matcher.class.ts:43](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L43)

---

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

[src/matcher.class.ts:44](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L44)

---

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

[src/matcher.class.ts:47](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L47)

---

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

[src/matcher.class.ts:46](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L46)

---

### redisClient

• **redisClient**: `RedisClientType`\<\{ `bf`: \{ `ADD`: `__module` ; `CARD`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `LOADCHUNK`: `__module` ; `MADD`: `__module` ; `MEXISTS`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `card`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `loadChunk`: `__module` ; `mAdd`: `__module` ; `mExists`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module` } ; `cf`: \{ `ADD`: `__module` ; `ADDNX`: `__module` ; `COUNT`: `__module` ; `DEL`: `__module` ; `EXISTS`: `__module` ; `INFO`: `__module` ; `INSERT`: `__module` ; `INSERTNX`: `__module` ; `LOADCHUNK`: `__module` ; `RESERVE`: `__module` ; `SCANDUMP`: `__module` ; `add`: `__module` ; `addNX`: `__module` ; `count`: `__module` ; `del`: `__module` ; `exists`: `__module` ; `info`: `__module` ; `insert`: `__module` ; `insertNX`: `__module` ; `loadChunk`: `__module` ; `reserve`: `__module` ; `scanDump`: `__module` } ; `cms`: \{ `INCRBY`: `__module` ; `INFO`: `__module` ; `INITBYDIM`: `__module` ; `INITBYPROB`: `__module` ; `MERGE`: `__module` ; `QUERY`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `initByDim`: `__module` ; `initByProb`: `__module` ; `merge`: `__module` ; `query`: `__module` } ; `ft`: \{ `AGGREGATE`: `__module` ; `AGGREGATE_WITHCURSOR`: `__module` ; `ALIASADD`: `__module` ; `ALIASDEL`: `__module` ; `ALIASUPDATE`: `__module` ; `ALTER`: `__module` ; `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `CREATE`: `__module` ; `CURSOR_DEL`: `__module` ; `CURSOR_READ`: `__module` ; `DICTADD`: `__module` ; `DICTDEL`: `__module` ; `DICTDUMP`: `__module` ; `DROPINDEX`: `__module` ; `EXPLAIN`: `__module` ; `EXPLAINCLI`: `__module` ; `INFO`: `__module` ; `PROFILEAGGREGATE`: `__module` ; `PROFILESEARCH`: `__module` ; `SEARCH`: `__module` ; `SEARCH_NOCONTENT`: `__module` ; `SPELLCHECK`: `__module` ; `SUGADD`: `__module` ; `SUGDEL`: `__module` ; `SUGGET`: `__module` ; `SUGGET_WITHPAYLOADS`: `__module` ; `SUGGET_WITHSCORES`: `__module` ; `SUGGET_WITHSCORES_WITHPAYLOADS`: `__module` ; `SUGLEN`: `__module` ; `SYNDUMP`: `__module` ; `SYNUPDATE`: `__module` ; `TAGVALS`: `__module` ; `_LIST`: `__module` ; `_list`: `__module` ; `aggregate`: `__module` ; `aggregateWithCursor`: `__module` ; `aliasAdd`: `__module` ; `aliasDel`: `__module` ; `aliasUpdate`: `__module` ; `alter`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `create`: `__module` ; `cursorDel`: `__module` ; `cursorRead`: `__module` ; `dictAdd`: `__module` ; `dictDel`: `__module` ; `dictDump`: `__module` ; `dropIndex`: `__module` ; `explain`: `__module` ; `explainCli`: `__module` ; `info`: `__module` ; `profileAggregate`: `__module` ; `profileSearch`: `__module` ; `search`: `__module` ; `searchNoContent`: `__module` ; `spellCheck`: `__module` ; `sugAdd`: `__module` ; `sugDel`: `__module` ; `sugGet`: `__module` ; `sugGetWithPayloads`: `__module` ; `sugGetWithScores`: `__module` ; `sugGetWithScoresWithPayloads`: `__module` ; `sugLen`: `__module` ; `synDump`: `__module` ; `synUpdate`: `__module` ; `tagVals`: `__module` } ; `graph`: \{ `CONFIG_GET`: `__module` ; `CONFIG_SET`: `__module` ; `DELETE`: `__module` ; `EXPLAIN`: `__module` ; `LIST`: `__module` ; `PROFILE`: `__module` ; `QUERY`: `__module` ; `RO_QUERY`: `__module` ; `SLOWLOG`: `__module` ; `configGet`: `__module` ; `configSet`: `__module` ; `delete`: `__module` ; `explain`: `__module` ; `list`: `__module` ; `profile`: `__module` ; `query`: `__module` ; `roQuery`: `__module` ; `slowLog`: `__module` } ; `json`: \{ `ARRAPPEND`: `__module` ; `ARRINDEX`: `__module` ; `ARRINSERT`: `__module` ; `ARRLEN`: `__module` ; `ARRPOP`: `__module` ; `ARRTRIM`: `__module` ; `DEBUG_MEMORY`: `__module` ; `DEL`: `__module` ; `FORGET`: `__module` ; `GET`: `__module` ; `MERGE`: `__module` ; `MGET`: `__module` ; `MSET`: `__module` ; `NUMINCRBY`: `__module` ; `NUMMULTBY`: `__module` ; `OBJKEYS`: `__module` ; `OBJLEN`: `__module` ; `RESP`: `__module` ; `SET`: `__module` ; `STRAPPEND`: `__module` ; `STRLEN`: `__module` ; `TYPE`: `__module` ; `arrAppend`: `__module` ; `arrIndex`: `__module` ; `arrInsert`: `__module` ; `arrLen`: `__module` ; `arrPop`: `__module` ; `arrTrim`: `__module` ; `debugMemory`: `__module` ; `del`: `__module` ; `forget`: `__module` ; `get`: `__module` ; `mGet`: `__module` ; `mSet`: `__module` ; `merge`: `__module` ; `numIncrBy`: `__module` ; `numMultBy`: `__module` ; `objKeys`: `__module` ; `objLen`: `__module` ; `resp`: `__module` ; `set`: `__module` ; `strAppend`: `__module` ; `strLen`: `__module` ; `type`: `__module` } ; `tDigest`: \{ `ADD`: `__module` ; `BYRANK`: `__module` ; `BYREVRANK`: `__module` ; `CDF`: `__module` ; `CREATE`: `__module` ; `INFO`: `__module` ; `MAX`: `__module` ; `MERGE`: `__module` ; `MIN`: `__module` ; `QUANTILE`: `__module` ; `RANK`: `__module` ; `RESET`: `__module` ; `REVRANK`: `__module` ; `TRIMMED_MEAN`: `__module` ; `add`: `__module` ; `byRank`: `__module` ; `byRevRank`: `__module` ; `cdf`: `__module` ; `create`: `__module` ; `info`: `__module` ; `max`: `__module` ; `merge`: `__module` ; `min`: `__module` ; `quantile`: `__module` ; `rank`: `__module` ; `reset`: `__module` ; `revRank`: `__module` ; `trimmedMean`: `__module` } ; `topK`: \{ `ADD`: `__module` ; `COUNT`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `LIST`: `__module` ; `LIST_WITHCOUNT`: `__module` ; `QUERY`: `__module` ; `RESERVE`: `__module` ; `add`: `__module` ; `count`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `list`: `__module` ; `listWithCount`: `__module` ; `query`: `__module` ; `reserve`: `__module` } ; `ts`: \{ `ADD`: `__module` ; `ALTER`: `__module` ; `CREATE`: `__module` ; `CREATERULE`: `__module` ; `DECRBY`: `__module` ; `DEL`: `__module` ; `DELETERULE`: `__module` ; `GET`: `__module` ; `INCRBY`: `__module` ; `INFO`: `__module` ; `INFO_DEBUG`: `__module` ; `MADD`: `__module` ; `MGET`: `__module` ; `MGET_WITHLABELS`: `__module` ; `MRANGE`: `__module` ; `MRANGE_WITHLABELS`: `__module` ; `MREVRANGE`: `__module` ; `MREVRANGE_WITHLABELS`: `__module` ; `QUERYINDEX`: `__module` ; `RANGE`: `__module` ; `REVRANGE`: `__module` ; `add`: `__module` ; `alter`: `__module` ; `create`: `__module` ; `createRule`: `__module` ; `decrBy`: `__module` ; `del`: `__module` ; `deleteRule`: `__module` ; `get`: `__module` ; `incrBy`: `__module` ; `info`: `__module` ; `infoDebug`: `__module` ; `mAdd`: `__module` ; `mGet`: `__module` ; `mGetWithLabels`: `__module` ; `mRange`: `__module` ; `mRangeWithLabels`: `__module` ; `mRevRange`: `__module` ; `mRevRangeWithLabels`: `__module` ; `queryIndex`: `__module` ; `range`: `__module` ; `revRange`: `__module` } } & `RedisModules`, `RedisFunctions`, `RedisScripts`\>

#### Defined in

[src/matcher.class.ts:50](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L50)

---

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

[src/matcher.class.ts:42](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L42)

---

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

[src/matcher.class.ts:41](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L41)

---

### usersKey

• **usersKey**: `string`

#### Defined in

[src/matcher.class.ts:45](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L45)

## Accessors

### stats

• `get` **stats**(): `Promise`\<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`\<[`Stats`](../modules.md#stats)\>

#### Defined in

[src/matcher.class.ts:207](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L207)

---

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:221](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L221)

## Methods

### addAssignment

▸ **addAssignment**(`assignment`): `Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Parameters

| Name         | Type                                     |
| :----------- | :--------------------------------------- |
| `assignment` | [`Assignment`](../modules.md#assignment) |

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Defined in

[src/matcher.class.ts:86](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L86)

---

### addUser

▸ **addUser**(`user`): `Promise`\<[`User`](../interfaces/User.md)\>

#### Parameters

| Name   | Type                            |
| :----- | :------------------------------ |
| `user` | [`User`](../interfaces/User.md) |

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

#### Defined in

[src/matcher.class.ts:73](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L73)

---

### calculatePriority

▸ **calculatePriority**(`...args`): `Promise`\<`number`\>

#### Parameters

| Name      | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `...args` | (`undefined` \| [`Assignment`](../modules.md#assignment))[] |

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/matcher.class.ts:202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L202)

---

### getAllAssignments

▸ **getAllAssignments**(): `Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

[src/matcher.class.ts:163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L163)

---

### getCurrentAssignmentsForUser

▸ **getCurrentAssignmentsForUser**(`userId`): `Promise`\<`string`[]\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `userId` | `string` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/matcher.class.ts:455](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L455)

---

### getUserRelatedAssignments

▸ **getUserRelatedAssignments**(`user`): `Promise`\<\{ `id`: `string` ; `priority`: `number` }[]\>

#### Parameters

| Name   | Type                            |
| :----- | :------------------------------ |
| `user` | [`User`](../interfaces/User.md) |

#### Returns

`Promise`\<\{ `id`: `string` ; `priority`: `number` }[]\>

#### Defined in

[src/matcher.class.ts:288](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L288)

---

### initRedis

▸ **initRedis**(): `Promise`\<[`default`](default.md)\>

#### Returns

`Promise`\<[`default`](default.md)\>

#### Defined in

[src/matcher.class.ts:65](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L65)

---

### matchScore

▸ **matchScore**(`user`, `assignmentTags`, `assignmentPriority`, `assignmentId?`): `Promise`\<[`number`, `number`]\>

#### Parameters

| Name                 | Type                            |
| :------------------- | :------------------------------ |
| `user`               | [`User`](../interfaces/User.md) |
| `assignmentTags`     | `string`                        |
| `assignmentPriority` | `string` \| `number`            |
| `assignmentId?`      | `string`                        |

#### Returns

`Promise`\<[`number`, `number`]\>

#### Defined in

[src/matcher.class.ts:168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L168)

---

### matchUsersAssignments

▸ **matchUsersAssignments**(`userId?`): `Promise`\<`void`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `userId?` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/matcher.class.ts:404](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L404)

---

### removeAssignment

▸ **removeAssignment**(`id`): `Promise`\<`string`\>

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/matcher.class.ts:128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L128)

---

### removeUser

▸ **removeUser**(`userId`): `Promise`\<`string`\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `userId` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/matcher.class.ts:153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L153)

---

### setAssignmentPriority

▸ **setAssignmentPriority**(`id`, `priority`): `Promise`\<\{ `id`: `string` ; `priority`: `number` }\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `id`       | `string` |
| `priority` | `number` |

#### Returns

`Promise`\<\{ `id`: `string` ; `priority`: `number` }\>

#### Defined in

[src/matcher.class.ts:234](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L234)

---

### setAssignmentPriorityByTags

▸ **setAssignmentPriorityByTags**(`tags`, `priority`): `Promise`\<\{ `id`: `string` = assignment.id; `priority`: `number` }[]\>

#### Parameters

| Name       | Type       |
| :--------- | :--------- |
| `tags`     | `string`[] |
| `priority` | `number`   |

#### Returns

`Promise`\<\{ `id`: `string` = assignment.id; `priority`: `number` }[]\>

#### Defined in

[src/matcher.class.ts:259](https://github.com/ViljarVoidula/assignment-user-matcher/blob/0ce32038c772b4e8d42971554926655878f2eeec/src/matcher.class.ts#L259)
