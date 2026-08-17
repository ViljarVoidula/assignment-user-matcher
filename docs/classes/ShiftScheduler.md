[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ShiftScheduler

# Class: ShiftScheduler

## Table of contents

### Constructors

- [constructor](ShiftScheduler.md#constructor)

### Methods

- [solve](ShiftScheduler.md#solve)

## Constructors

### constructor

• **new ShiftScheduler**(): [`ShiftScheduler`](ShiftScheduler.md)

#### Returns

[`ShiftScheduler`](ShiftScheduler.md)

## Methods

### solve

▸ **solve**(`input`): [`ScheduleResult`](../interfaces/ScheduleResult.md)

Solve a scheduling problem synchronously. Throws `ScheduleValidationError` on malformed input.

#### Parameters

| Name    | Type                                              |
| :------ | :------------------------------------------------ |
| `input` | [`ScheduleInput`](../interfaces/ScheduleInput.md) |

#### Returns

[`ScheduleResult`](../interfaces/ScheduleResult.md)

#### Defined in

[src/scheduling/scheduler.class.ts:40](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/scheduler.class.ts#L40)
