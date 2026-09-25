[assignment-user-matcher](../README.md) / [Exports](../modules.md) / NightVolumeQuota

# Interface: NightVolumeQuota

A cap on night-shift count over a rolling window.

## Table of contents

### Properties

- [endingAfter](NightVolumeQuota.md#endingafter)
- [label](NightVolumeQuota.md#label)
- [max](NightVolumeQuota.md#max)
- [windowDays](NightVolumeQuota.md#windowdays)

## Properties

### endingAfter

• `Optional` **endingAfter**: `string`

Only count shifts ending after this wall-clock time (NL counts those past 02:00).

#### Defined in

[src/scheduling/types.ts:550](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L550)

___

### label

• `Optional` **label**: `string`

#### Defined in

[src/scheduling/types.ts:551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L551)

___

### max

• **max**: `number`

#### Defined in

[src/scheduling/types.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L547)

___

### windowDays

• **windowDays**: `number`

#### Defined in

[src/scheduling/types.ts:548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L548)
