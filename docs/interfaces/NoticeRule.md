[assignment-user-matcher](../README.md) / [Exports](../modules.md) / NoticeRule

# Interface: NoticeRule

Publication and change notice — Directive (EU) 2019/1152 Art 10.

Work outside the reference hours, or notified inside the notice window, may
be refused without detriment; cancelling late can create a pay liability.
These are facts about a *published* roster, so they need `published` on the
input to mean anything.

## Table of contents

### Properties

- [cancellationCompensationMinutes](NoticeRule.md#cancellationcompensationminutes)
- [cancellationDeadlineMinutes](NoticeRule.md#cancellationdeadlineminutes)
- [changeAfterPublication](NoticeRule.md#changeafterpublication)
- [minNoticeMinutes](NoticeRule.md#minnoticeminutes)
- [referenceHours](NoticeRule.md#referencehours)

## Properties

### cancellationCompensationMinutes

• `Optional` **cancellationCompensationMinutes**: `number`

Minutes payable when an assignment is cancelled late (NL pays the called hours).

#### Defined in

[src/scheduling/types.ts:478](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L478)

___

### cancellationDeadlineMinutes

• `Optional` **cancellationDeadlineMinutes**: `number`

After this deadline, cancelling owes compensation.

#### Defined in

[src/scheduling/types.ts:476](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L476)

___

### changeAfterPublication

• `Optional` **changeAfterPublication**: ``"consent"`` \| ``"cause"`` \| ``"free"``

Whether a published roster may be changed at all. Finland requires consent or cause.

#### Defined in

[src/scheduling/types.ts:480](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L480)

___

### minNoticeMinutes

• `Optional` **minNoticeMinutes**: `number`

"Reasonable" notice of an assignment. No EU number exists; member states differ.

#### Defined in

[src/scheduling/types.ts:474](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L474)

___

### referenceHours

• `Optional` **referenceHours**: \{ `daysOfWeek`: `number`[] ; `from`: `string` ; `to`: `string`  }[]

The reference hours and days within which work may be required at all.

#### Defined in

[src/scheduling/types.ts:472](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L472)
