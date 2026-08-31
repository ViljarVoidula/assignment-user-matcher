[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RepairCandidate

# Interface: RepairCandidate

## Table of contents

### Properties

- [blockers](RepairCandidate.md#blockers)
- [distanceKm](RepairCandidate.md#distancekm)
- [eligible](RepairCandidate.md#eligible)
- [employeeId](RepairCandidate.md#employeeid)
- [fairnessDebt](RepairCandidate.md#fairnessdebt)
- [isHomeSite](RepairCandidate.md#ishomesite)
- [marginalCostCents](RepairCandidate.md#marginalcostcents)
- [originSiteId](RepairCandidate.md#originsiteid)
- [rank](RepairCandidate.md#rank)
- [rationale](RepairCandidate.md#rationale)
- [shiftInstanceId](RepairCandidate.md#shiftinstanceid)
- [travelMinutes](RepairCandidate.md#travelminutes)
- [verdicts](RepairCandidate.md#verdicts)

## Properties

### blockers

• **blockers**: [`RuleVerdict`](RuleVerdict.md)[]

Failing rules only, for a compact "why not" list.

#### Defined in

[src/scheduling/operations.ts:172](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L172)

___

### distanceKm

• `Optional` **distanceKm**: `number`

Straight-line distance from origin to the shift's site, when minutes are unavailable.

#### Defined in

[src/scheduling/operations.ts:184](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L184)

___

### eligible

• **eligible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L169)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/operations.ts:167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L167)

___

### fairnessDebt

• **fairnessDebt**: `number`

How far below their fair share of extra work this person is. Higher means more owed.

#### Defined in

[src/scheduling/operations.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L175)

___

### isHomeSite

• **isHomeSite**: `boolean`

Whether the shift is at this employee's home site.

#### Defined in

[src/scheduling/operations.ts:186](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L186)

___

### marginalCostCents

• **marginalCostCents**: `number`

#### Defined in

[src/scheduling/operations.ts:173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L173)

___

### originSiteId

• `Optional` **originSiteId**: `string`

Site the candidate is travelling from (same-day assignment, then home site).

#### Defined in

[src/scheduling/operations.ts:180](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L180)

___

### rank

• **rank**: `number`

Lower is a better call.

#### Defined in

[src/scheduling/operations.ts:177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L177)

___

### rationale

• **rationale**: `string`

#### Defined in

[src/scheduling/operations.ts:178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L178)

___

### shiftInstanceId

• **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/operations.ts:168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L168)

___

### travelMinutes

• `Optional` **travelMinutes**: `number`

Estimated travel minutes from origin to the shift's site.

#### Defined in

[src/scheduling/operations.ts:182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L182)

___

### verdicts

• **verdicts**: [`RuleVerdict`](RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:170](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L170)
