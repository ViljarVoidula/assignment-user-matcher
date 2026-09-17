[assignment-user-matcher](../README.md) / [Exports](../modules.md) / TimelineEntry

# Interface: TimelineEntry

One occupied span on a person's timeline.

## Hierarchy

- [`MinuteRange`](MinuteRange.md)

  ↳ **`TimelineEntry`**

## Table of contents

### Properties

- [end](TimelineEntry.md#end)
- [historical](TimelineEntry.md#historical)
- [id](TimelineEntry.md#id)
- [siteId](TimelineEntry.md#siteid)
- [start](TimelineEntry.md#start)
- [tag](TimelineEntry.md#tag)
- [workingMinutes](TimelineEntry.md#workingminutes)

## Properties

### end

• **end**: `number`

#### Inherited from

[MinuteRange](MinuteRange.md).[end](MinuteRange.md#end)

#### Defined in

[src/scheduling/time.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/time.ts#L27)

___

### historical

• `Optional` **historical**: `boolean`

Historical entries are immutable and never returned by the mutable views.

#### Defined in

[src/scheduling/engine/timeline.ts:43](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/engine/timeline.ts#L43)

___

### id

• **id**: `string`

Shift instance id, or a synthetic id for historical//absence spans.

#### Defined in

[src/scheduling/engine/timeline.ts:35](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/engine/timeline.ts#L35)

___

### siteId

• `Optional` **siteId**: `string`

Site where this span took place; drives cross-site travel-gap rules.

#### Defined in

[src/scheduling/engine/timeline.ts:41](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/engine/timeline.ts#L41)

___

### start

• **start**: `number`

#### Inherited from

[MinuteRange](MinuteRange.md).[start](MinuteRange.md#start)

#### Defined in

[src/scheduling/time.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/time.ts#L26)

___

### tag

• `Optional` **tag**: `string`

Free-form classification tag used by sequence rules (e.g. a shift type).

#### Defined in

[src/scheduling/engine/timeline.ts:39](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/engine/timeline.ts#L39)

___

### workingMinutes

• **workingMinutes**: `number`

Minutes that count as working time — may differ from the span for standby duties.

#### Defined in

[src/scheduling/engine/timeline.ts:37](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/engine/timeline.ts#L37)
