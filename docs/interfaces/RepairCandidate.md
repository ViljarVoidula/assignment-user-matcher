[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RepairCandidate

# Interface: RepairCandidate

## Table of contents

### Properties

- [blockers](RepairCandidate.md#blockers)
- [contractDeltaMinutes](RepairCandidate.md#contractdeltaminutes)
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

[src/scheduling/operations.ts:179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L179)

___

### contractDeltaMinutes

• `Optional` **contractDeltaMinutes**: `number`

Where this shift would leave the person against their contracted period
total: `(planned + this shift) − contracted`, negative while still under
contract. Only for employees whose contracted week resolves.

#### Defined in

[src/scheduling/operations.ts:188](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L188)

___

### distanceKm

• `Optional` **distanceKm**: `number`

Straight-line distance from origin to the shift's site, when minutes are unavailable.

#### Defined in

[src/scheduling/operations.ts:197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L197)

___

### eligible

• **eligible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:176](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L176)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/operations.ts:174](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L174)

___

### fairnessDebt

• **fairnessDebt**: `number`

How far below their fair share of extra work this person is. Higher means more owed.

#### Defined in

[src/scheduling/operations.ts:182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L182)

___

### isHomeSite

• **isHomeSite**: `boolean`

Whether the shift is at this employee's home site.

#### Defined in

[src/scheduling/operations.ts:199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L199)

___

### marginalCostCents

• **marginalCostCents**: `number`

#### Defined in

[src/scheduling/operations.ts:180](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L180)

___

### originSiteId

• `Optional` **originSiteId**: `string`

Site the candidate is travelling from (same-day assignment, then home site).

#### Defined in

[src/scheduling/operations.ts:193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L193)

___

### rank

• **rank**: `number`

Lower is a better call.

#### Defined in

[src/scheduling/operations.ts:190](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L190)

___

### rationale

• **rationale**: `string`

#### Defined in

[src/scheduling/operations.ts:191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L191)

___

### shiftInstanceId

• **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/operations.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L175)

___

### travelMinutes

• `Optional` **travelMinutes**: `number`

Estimated travel minutes from origin to the shift's site.

#### Defined in

[src/scheduling/operations.ts:195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L195)

___

### verdicts

• **verdicts**: [`RuleVerdict`](RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L177)
