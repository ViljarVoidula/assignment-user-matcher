[assignment-engine](README.md) / Exports

# assignment-engine

## Table of contents

### Classes

-   [default](classes/default.md)

### Interfaces

-   [User](interfaces/User.md)

### Type Aliases

-   [Assignment](modules.md#assignment)
-   [RedisClientType](modules.md#redisclienttype)
-   [Stats](modules.md#stats)
-   [options](modules.md#options)

## Type Aliases

### Assignment

Ƭ **Assignment**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name        | Type       |
| :---------- | :--------- |
| `id`        | `string`   |
| `priority?` | `number`   |
| `tags`      | `string`[] |

#### Defined in

matcher.class.ts:10

---

### RedisClientType

Ƭ **RedisClientType**: `ReturnType`<typeof `createClient`\>

#### Defined in

matcher.class.ts:2

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

matcher.class.ts:17

---

### options

Ƭ **options**: `Object`

#### Type declaration

| Name                      | Type                                                                                                                                                                          |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enableDefaultMatching?`  | `boolean`                                                                                                                                                                     |
| `matchingFunction?`       | (`user`: [`User`](interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `number` \| `string`, `assignmentId?`: `string`) => `Promise`<[`number`, `number`]\> |
| `maxUserBacklogSize?`     | `number`                                                                                                                                                                      |
| `prioritizationFunction?` | (...`args`: ([`Assignment`](modules.md#assignment) \| `undefined`)[]) => `Promise`<`number`\>                                                                                 |
| `redisPrefix?`            | `string`                                                                                                                                                                      |
| `relevantBatchSize?`      | `number`                                                                                                                                                                      |

#### Defined in

matcher.class.ts:23
