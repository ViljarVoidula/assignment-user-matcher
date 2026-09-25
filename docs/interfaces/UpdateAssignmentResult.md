[assignment-user-matcher](../README.md) / [Exports](../modules.md) / UpdateAssignmentResult

# Interface: UpdateAssignmentResult

## Table of contents

### Properties

- [id](UpdateAssignmentResult.md#id)
- [previousOwnerId](UpdateAssignmentResult.md#previousownerid)
- [priority](UpdateAssignmentResult.md#priority)
- [requeued](UpdateAssignmentResult.md#requeued)
- [status](UpdateAssignmentResult.md#status)
- [tags](UpdateAssignmentResult.md#tags)

## Properties

### id

• **id**: `string`

#### Defined in

[src/updates/assignment-update.ts:39](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L39)

___

### previousOwnerId

• **previousOwnerId**: ``null`` \| `string`

Who held it before the edit, whether or not they kept it.

#### Defined in

[src/updates/assignment-update.ts:47](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L47)

___

### priority

• **priority**: `undefined` \| `number`

#### Defined in

[src/updates/assignment-update.ts:43](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L43)

___

### requeued

• **requeued**: `boolean`

Whether the edit pulled the task off its owner and put it back in the queue.

#### Defined in

[src/updates/assignment-update.ts:45](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L45)

___

### status

• **status**: [`UpdatableStatus`](../modules.md#updatablestatus)

Where the task ended up — `queued` when a retag sent it back for rematching.

#### Defined in

[src/updates/assignment-update.ts:41](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L41)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/updates/assignment-update.ts:42](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L42)
