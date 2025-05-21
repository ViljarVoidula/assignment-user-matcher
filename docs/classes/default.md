[assignment-engine](../README.md) / [Exports](../modules.md) / default

# Class: default

## Table of contents

### Constructors

-   [constructor](default.md#constructor)

### Properties

-   [assignmentsKey](default.md#assignmentskey)
-   [assignmentsRefKey](default.md#assignmentsrefkey)
-   [enableDefaultMatching](default.md#enabledefaultmatching)
-   [maxUserBacklogSize](default.md#maxuserbacklogsize)
-   [redisClient](default.md#redisclient)
-   [redisPrefix](default.md#redisprefix)
-   [relevantBatchSize](default.md#relevantbatchsize)
-   [usersKey](default.md#userskey)

### Accessors

-   [stats](default.md#stats)
-   [usersWithoutAssignment](default.md#userswithoutassignment)

### Methods

-   [addAssignment](default.md#addassignment)
-   [addUser](default.md#adduser)
-   [calculatePriority](default.md#calculatepriority)
-   [getAllAssignments](default.md#getallassignments)
-   [getCurrentAssignmentsForUser](default.md#getcurrentassignmentsforuser)
-   [getUserRelatedAssignments](default.md#getuserrelatedassignments)
-   [initRedis](default.md#initredis)
-   [matchScore](default.md#matchscore)
-   [matchUsersAssignments](default.md#matchusersassignments)
-   [removeAssignment](default.md#removeassignment)
-   [removeUser](default.md#removeuser)
-   [setAssignmentPriority](default.md#setassignmentpriority)

## Constructors

### constructor

• **new default**(`redisClient`, `options?`)

#### Parameters

| Name          | Type                                                                 |
| :------------ | :------------------------------------------------------------------- |
| `redisClient` | `RedisClientType`<`RedisModules`, `RedisFunctions`, `RedisScripts`\> |
| `options?`    | [`options`](../modules.md#options)                                   |

#### Defined in

matcher.class.ts:48

## Properties

### assignmentsKey

• **assignmentsKey**: `string`

#### Defined in

matcher.class.ts:42

---

### assignmentsRefKey

• **assignmentsRefKey**: `string`

#### Defined in

matcher.class.ts:43

---

### enableDefaultMatching

• **enableDefaultMatching**: `boolean`

#### Defined in

matcher.class.ts:46

---

### maxUserBacklogSize

• **maxUserBacklogSize**: `number`

#### Defined in

matcher.class.ts:45

---

### redisClient

• **redisClient**: `RedisClientType`<`RedisModules`, `RedisFunctions`, `RedisScripts`\>

#### Defined in

matcher.class.ts:48

---

### redisPrefix

• **redisPrefix**: `string`

#### Defined in

matcher.class.ts:41

---

### relevantBatchSize

• **relevantBatchSize**: `number`

#### Defined in

matcher.class.ts:40

---

### usersKey

• **usersKey**: `string`

#### Defined in

matcher.class.ts:44

## Accessors

### stats

• `get` **stats**(): `Promise`<[`Stats`](../modules.md#stats)\>

#### Returns

`Promise`<[`Stats`](../modules.md#stats)\>

#### Defined in

matcher.class.ts:164

---

### usersWithoutAssignment

• `get` **usersWithoutAssignment**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

matcher.class.ts:182

## Methods

### addAssignment

▸ **addAssignment**(`assignment`): `Promise`<[`Assignment`](../modules.md#assignment)\>

#### Parameters

| Name         | Type                                     |
| :----------- | :--------------------------------------- |
| `assignment` | [`Assignment`](../modules.md#assignment) |

#### Returns

`Promise`<[`Assignment`](../modules.md#assignment)\>

#### Defined in

matcher.class.ts:83

---

### addUser

▸ **addUser**(`user`): `Promise`<[`User`](../interfaces/User.md)\>

#### Parameters

| Name   | Type                            |
| :----- | :------------------------------ |
| `user` | [`User`](../interfaces/User.md) |

#### Returns

`Promise`<[`User`](../interfaces/User.md)\>

#### Defined in

matcher.class.ts:67

---

### calculatePriority

▸ `Private` **calculatePriority**(`...args`): `Promise`<`number`\>

#### Parameters

| Name      | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `...args` | (`undefined` \| [`Assignment`](../modules.md#assignment))[] |

#### Returns

`Promise`<`number`\>

#### Defined in

matcher.class.ts:159

---

### getAllAssignments

▸ **getAllAssignments**(): `Promise`<[`Assignment`](../modules.md#assignment)[]\>

#### Returns

`Promise`<[`Assignment`](../modules.md#assignment)[]\>

#### Defined in

matcher.class.ts:136

---

### getCurrentAssignmentsForUser

▸ **getCurrentAssignmentsForUser**(`userId`): `Promise`<`string`[]\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `userId` | `string` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

matcher.class.ts:289

---

### getUserRelatedAssignments

▸ `Private` **getUserRelatedAssignments**(`user`): `Promise`<`any`[]\>

#### Parameters

| Name   | Type                            |
| :----- | :------------------------------ |
| `user` | [`User`](../interfaces/User.md) |

#### Returns

`Promise`<`any`[]\>

#### Defined in

matcher.class.ts:203

---

### initRedis

▸ `Private` **initRedis**(): `Promise`<[`default`](default.md)\>

#### Returns

`Promise`<[`default`](default.md)\>

#### Defined in

matcher.class.ts:62

---

### matchScore

▸ `Private` **matchScore**(`user`, `assignmentTags`, `assignmentPriority`, `assignmentId?`): `Promise`<[`number`, `number`]\>

#### Parameters

| Name                 | Type                            |
| :------------------- | :------------------------------ |
| `user`               | [`User`](../interfaces/User.md) |
| `assignmentTags`     | `string`                        |
| `assignmentPriority` | `string` \| `number`            |
| `assignmentId?`      | `string`                        |

#### Returns

`Promise`<[`number`, `number`]\>

#### Defined in

matcher.class.ts:143

---

### matchUsersAssignments

▸ **matchUsersAssignments**(`userId?`): `Promise`<`void`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `userId?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

matcher.class.ts:255

---

### removeAssignment

▸ **removeAssignment**(`id`): `Promise`<`string`\>

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

matcher.class.ts:110

---

### removeUser

▸ **removeUser**(`userId`): `Promise`<`string`\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `userId` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

matcher.class.ts:126

---

### setAssignmentPriority

▸ **setAssignmentPriority**(`id`, `priority`): `Promise`<{ `id`: `string` ; `priority`: `number` }\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `id`       | `string` |
| `priority` | `number` |

#### Returns

`Promise`<{ `id`: `string` ; `priority`: `number` }\>

#### Defined in

matcher.class.ts:195
