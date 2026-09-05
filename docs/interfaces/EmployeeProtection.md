[assignment-user-matcher](../README.md) / [Exports](../modules.md) / EmployeeProtection

# Interface: EmployeeProtection

A statutory protection that changes which rules apply to a person.

## Table of contents

### Properties

- [fallback](EmployeeProtection.md#fallback)
- [kind](EmployeeProtection.md#kind)

## Properties

### fallback

• `Optional` **fallback**: ``"dayShift"`` \| ``"leave"``

What the employer owes instead. Recorded in the result, not solved for.

#### Defined in

[src/scheduling/types.ts:146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L146)

___

### kind

• **kind**: ``"minor"`` \| ``"hazardousNight"`` \| ``"pregnancyNightExclusion"``

`minor` and `hazardousNight` select stricter limits; `pregnancyNightExclusion`
is a certificate-triggered bar on night work (Directive 92/85/EEC Art 7),
which mandates a day-work alternative rather than mere unavailability.

#### Defined in

[src/scheduling/types.ts:144](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L144)
