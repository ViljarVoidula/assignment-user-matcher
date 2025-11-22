[assignment-user-matcher](README.md) / Exports

# assignment-user-matcher

## Table of contents

### Classes

- [default](classes/default.md)

### Interfaces

- [User](interfaces/User.md)

### Type Aliases

- [Assignment](modules.md#assignment)
- [RedisClientType](modules.md#redisclienttype)
- [Stats](modules.md#stats)
- [options](modules.md#options)

## Type Aliases

### Assignment

Ƭ **Assignment**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `priority?` | `number` |
| `tags` | `string`[] |

#### Defined in

[src/matcher.class.ts:13](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L13)

___

### RedisClientType

Ƭ **RedisClientType**: `ReturnType`\<typeof `createClient`\>

#### Defined in

[src/matcher.class.ts:2](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L2)

___

### Stats

Ƭ **Stats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `remainingAssignments?` | `number` |
| `users?` | `number` |
| `usersWithoutAssignment?` | `string`[] |

#### Defined in

[src/matcher.class.ts:20](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L20)

___

### options

Ƭ **options**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `enableDefaultMatching?` | `boolean` |
| `matchExpirationMs?` | `number` |
| `matchingFunction?` | (`user`: [`User`](interfaces/User.md), `assignmentTags`: `string`, `assignmentPriority`: `number` \| `string`, `assignmentId?`: `string`) => `Promise`\<[`number`, `number`]\> |
| `maxUserBacklogSize?` | `number` |
| `prioritizationFunction?` | (...`args`: ([`Assignment`](modules.md#assignment) \| `undefined`)[]) => `Promise`\<`number`\> |
| `redisPrefix?` | `string` |
| `relevantBatchSize?` | `number` |

#### Defined in

[src/matcher.class.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/168f33781e93bc95ab7f2c7d42219804cc882522/src/matcher.class.ts#L26)
