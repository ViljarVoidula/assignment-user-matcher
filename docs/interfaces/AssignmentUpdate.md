[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentUpdate

# Interface: AssignmentUpdate

The fields of a stored assignment an operator may edit after creation.

Deliberately narrow. `tags` and `priority` are routing — changing them
changes who should have the task, which is what makes this more than a
metadata write. `title` and `meta` are description, carried on the record so
a list view can render a row without a second store. Everything else about
an assignment (its escalation ladder, its SLA, its offer window, its vetoes)
is a policy chosen when the work was created and is not patched piecemeal —
same reasoning as `resolvePolicy` on the platform side.

A field left `undefined` is untouched; `title` and `meta` accept `null` to
clear them, which is why they are not simply optional.

## Table of contents

### Properties

- [meta](AssignmentUpdate.md#meta)
- [priority](AssignmentUpdate.md#priority)
- [tags](AssignmentUpdate.md#tags)
- [title](AssignmentUpdate.md#title)

## Properties

### meta

• `Optional` **meta**: ``null`` \| `Record`\<`string`, `unknown`\>

#### Defined in

[src/updates/assignment-update.ts:32](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L32)

___

### priority

• `Optional` **priority**: `number`

#### Defined in

[src/updates/assignment-update.ts:30](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L30)

___

### tags

• `Optional` **tags**: `string`[]

#### Defined in

[src/updates/assignment-update.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L29)

___

### title

• `Optional` **title**: ``null`` \| `string`

#### Defined in

[src/updates/assignment-update.ts:31](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/updates/assignment-update.ts#L31)
