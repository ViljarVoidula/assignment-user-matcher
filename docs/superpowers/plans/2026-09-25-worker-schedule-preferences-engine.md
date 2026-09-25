# Worker Schedule Preferences — Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the scheduling engine take shift-type preferences, two-tier priorities and a per-person preference budget, and report per worker which wishes were met and why not.

**Architecture:** Extend `AvailabilityRule` (no parallel type). Rule matching moves to a new leaf module `src/scheduling/preferences.ts` so `model.ts` can resolve effective weights once at `buildModel` into `ctx.preferenceRules`. Every scorer (`preferencePenalty`, `rankCandidates`) reads those resolved rules, so there is one weighting path. A new `src/scheduling/preference-report.ts` builds `result.preferences` at result assembly and in `checkCompliance`. It never runs in the search loop.

**Tech Stack:** TypeScript, Mocha + Chai (`npx mocha tests/scheduling/<file>.test.ts`). The scheduling tests are pure and need no Redis.

Spec: `docs/superpowers/specs/2026-09-25-worker-schedule-preferences-design.md` (Part 1).

## Global Constraints

- Existing input must produce identical results: without `objectives.preferences`, and without any new rule field, weights are exactly `rule.weight ?? 1`.
- Preferences stay in the **soft** level and never become hard. (`unavailable` + `shiftTypeTags` is hard only because `unavailable` already is.)
- One scoring path: nothing may read `employee.availability[].weight` for scoring after this change. Scorers read `ctx.preferenceRules`.
- Report assembly runs once per result, never inside the objective or search.
- The ranking stays profiling-free: nothing learned or behavioural.
- Library version `1.16.1` → `1.17.0`. `ENGINE_VERSION` stays `'3'`.
- Formatting: 4-space indent, single quotes, width 124 (`pnpm prettier` on your own files only).
- Commits: Conventional Commits, **no `Co-Authored-By` trailer** (repo CLAUDE.md).

## File Structure

| File | Responsibility |
|---|---|
| `src/scheduling/preferences.ts` (new) | Leaf: `availabilityApplies`, `ruleOverlapMinutes`, `ruleMatchesInstance`, `resolvePreferenceRules`, `validatePreferenceObjectives`. Imports only types. |
| `src/scheduling/preference-report.ts` (new) | `preferenceReport(state)`, which builds `EmployeePreferenceReport[]` from a finished state. |
| `src/scheduling/types.ts` | New rule fields, `ObjectiveWeights.preferences`, report types, `ModelContext.preferenceRules`, `ScheduleResult.preferences`. |
| `src/scheduling/model.ts` | Re-exports `availabilityApplies` from the leaf; validates the new fields; fills `ctx.preferenceRules`. |
| `src/scheduling/constraints/availability.ts` | Uses the leaf's matching; `preferencePenalty` reads `ctx.preferenceRules`. |
| `src/scheduling/operations.ts` | `rankCandidates` reads `ctx.preferenceRules`; `checkCompliance` returns `preferences`. |
| `src/scheduling/scheduler.class.ts` | `result.preferences`. |
| `src/scheduling/index.ts` | Exports the new types. |
| `tests/scheduling/preferences.test.ts` (new) | All new behaviour. |

---

### Task 1: Rule fields, shift-type matching, validation

**Files:**
- Create: `src/scheduling/preferences.ts`
- Modify: `src/scheduling/types.ts` (`AvailabilityRule`, ~line 90)
- Modify: `src/scheduling/model.ts` (`validateEmployee` ~line 596, `availabilityApplies` ~line 884)
- Modify: `src/scheduling/constraints/availability.ts` (imports, `overlapsRule`, `preferenceScore`)
- Test: `tests/scheduling/preferences.test.ts`

**Interfaces:**
- Produces:
  - `availabilityApplies(rule: AvailabilityRule, inst: ShiftInstance): boolean`, with the same export name, still re-exported from `model.ts`.
  - `ruleOverlapMinutes(clock: ClockLike, range: {start:number;end:number}, rule: AvailabilityRule): number`
  - `ruleMatchesInstance(clock: ClockLike, rule: AvailabilityRule, inst: ShiftInstance): boolean`
  - Here `ClockLike = Pick<PeriodClock, 'minutesInClockRange'>`.

- [ ] **Step 1: Write the failing tests**

Create `tests/scheduling/preferences.test.ts`:

```ts
import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { preferenceScore } from '../../src/scheduling/constraints/availability';
import { ScheduleValidationError, solveSchedule } from '../../src/scheduling';
import type { AvailabilityRule, Employee, ScheduleInput, ShiftTemplate } from '../../src/scheduling';

/** Mon 5 Jan – Sun 11 Jan 2026. */
const WEEK = { startDate: '2026-01-05', endDate: '2026-01-11' };

function emp(id: string, availability?: AvailabilityRule[], extra: Partial<Employee> = {}): Employee {
    return { id, tags: [], timeOff: [], ...(availability ? { availability } : {}), ...extra };
}

function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

function input(partial: Partial<ScheduleInput>): ScheduleInput {
    return { period: WEEK, employees: [], shifts: [], ...partial };
}

describe('worker schedule preferences', function () {
    describe('shift-type matching', function () {
        const shifts = [
            shift('early', '06:00', '14:00', ['2026-01-05'], { shiftTypeTag: 'early' }),
            shift('night', '22:00', '06:00', ['2026-01-05'], { shiftTypeTag: 'night' }),
        ];

        it('scores a preferred shift type without any clock window', function () {
            const rules: AvailabilityRule[] = [{ kind: 'preferred', shiftTypeTags: ['night'] }];
            const ctx = buildModel(input({ employees: [emp('e1', rules)], shifts }));
            expect(preferenceScore(ctx.clock, rules, ctx.instanceById.get('night@2026-01-05')!)).to.equal(-1);
            expect(preferenceScore(ctx.clock, rules, ctx.instanceById.get('early@2026-01-05')!)).to.equal(0);
        });

        it('ANDs shift types with days of week', function () {
            const rules: AvailabilityRule[] = [{ kind: 'avoid', shiftTypeTags: ['night'], daysOfWeek: [2] }];
            const ctx = buildModel(input({ employees: [emp('e1', rules)], shifts }));
            // 5 Jan 2026 is a Monday — the Tuesday-only rule does not apply.
            expect(preferenceScore(ctx.clock, rules, ctx.instanceById.get('night@2026-01-05')!)).to.equal(0);
        });

        it('blocks only the listed shift type for an unavailable rule', function () {
            const result = solveSchedule(
                input({
                    employees: [emp('e1', [{ kind: 'unavailable', shiftTypeTags: ['night'] }])],
                    shifts: shifts.map((s) => ({ ...s, minEmployees: 1, maxEmployees: 1 })),
                    maxIterations: 50,
                    seed: 1,
                }),
            );
            const held = result.assignments.map((a) => a.shiftInstanceId);
            expect(held).to.include('early@2026-01-05');
            expect(held).to.not.include('night@2026-01-05');
        });
    });

    describe('validation', function () {
        it('refuses an empty shift-type tag', function () {
            expect(() => buildModel(input({ employees: [emp('e1', [{ kind: 'preferred', shiftTypeTags: [''] }])] }))).to.throw(
                ScheduleValidationError,
                /shiftTypeTags/,
            );
        });

        it('refuses an unknown priority', function () {
            const bad = [{ kind: 'preferred', priority: 'urgent' }] as unknown as AvailabilityRule[];
            expect(() => buildModel(input({ employees: [emp('e1', bad)] }))).to.throw(ScheduleValidationError, /priority/);
        });

        it('refuses a priority on a hard kind', function () {
            expect(() =>
                buildModel(input({ employees: [emp('e1', [{ kind: 'unavailable', priority: 'important' }])] })),
            ).to.throw(ScheduleValidationError, /priority/);
        });
    });
});
```

`ScheduleInput.seed` exists, so `seed: 1` is valid.

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx mocha tests/scheduling/preferences.test.ts`
Expected: FAIL. TypeScript errors on `shiftTypeTags` / `priority` (unknown properties), or the assertions fail.

- [ ] **Step 3: Add the rule fields**

In `src/scheduling/types.ts`, inside `interface AvailabilityRule`, after `weight?: number;`:

```ts
    /**
     * Match only occurrences whose `shiftTypeTag` is listed. ANDed with the
     * day, date and clock conditions, so "prefer nights" needs no clock window
     * and survives a change to when nights start.
     */
    shiftTypeTags?: string[];
    /**
     * `important` is multiplied by `objectives.preferences.importantWeight`.
     * Soft kinds only; a wish that cannot be refused is time off, not a
     * preference.
     */
    priority?: 'normal' | 'important';
    /** Caller's identifier for this rule, echoed in `result.preferences`. */
    id?: string;
    /**
     * Leave this rule out of `objectives.preferences.budget` scaling. For
     * imported facts such as calendar busy time, which are not wishes and
     * would otherwise dilute the person's real ones.
     */
    outsideBudget?: boolean;
```

- [ ] **Step 4: Create the leaf matching module**

Create `src/scheduling/preferences.ts`:

```ts
/**
 * Availability-rule matching and preference weights.
 *
 * A leaf module: `model.ts` resolves effective weights through it at build
 * time, and every scorer and the preference report match rules through it, so
 * the question "does this rule touch this shift" has exactly one answer.
 */

import type { AvailabilityRule, ShiftInstance } from './types';
import type { PeriodClock } from './time';

export type ClockLike = Pick<PeriodClock, 'minutesInClockRange'>;

/** Whether an availability rule's day, date and shift-type conditions apply to an occurrence. */
export function availabilityApplies(rule: AvailabilityRule, inst: ShiftInstance): boolean {
    if (rule.daysOfWeek && !rule.daysOfWeek.includes(inst.weekday)) return false;
    if (rule.fromDate && inst.date < rule.fromDate) return false;
    if (rule.toDate && inst.date > rule.toDate) return false;
    if (rule.shiftTypeTags && (inst.shiftTypeTag === undefined || !rule.shiftTypeTags.includes(inst.shiftTypeTag))) {
        return false;
    }
    return true;
}

/** Minutes of `range` inside the rule's clock window; the whole range when the rule has none. */
export function ruleOverlapMinutes(
    clock: ClockLike,
    range: { start: number; end: number },
    rule: AvailabilityRule,
): number {
    if (rule.from === undefined || rule.to === undefined) return range.end - range.start;
    return clock.minutesInClockRange(range, { from: rule.from, to: rule.to });
}

/** Whether the rule touches the occurrence at all. */
export function ruleMatchesInstance(clock: ClockLike, rule: AvailabilityRule, inst: ShiftInstance): boolean {
    if (!availabilityApplies(rule, inst)) return false;
    return ruleOverlapMinutes(clock, { start: inst.startMinute, end: inst.endMinute }, rule) > 0;
}
```

Check that `ShiftInstance` has `shiftTypeTag` (types.ts ~line 1115) and `weekday`. It already does both.

- [ ] **Step 5: Point `model.ts` and `availability.ts` at the leaf**

In `src/scheduling/model.ts`:
- Delete the body of `availabilityApplies` (~lines 883–889).
- Add at the top: `export { availabilityApplies } from './preferences';`

In `validateEmployee`, extend the availability loop:

```ts
    for (const rule of employee.availability ?? []) {
        if (rule.from !== undefined) parseTimeOfDay(rule.from, `employee "${employee.id}" availability.from`);
        if (rule.to !== undefined) parseTimeOfDay(rule.to, `employee "${employee.id}" availability.to`);
        if (rule.fromDate !== undefined) assertIsoDate(rule.fromDate, `employee "${employee.id}" availability.fromDate`);
        if (rule.toDate !== undefined) assertIsoDate(rule.toDate, `employee "${employee.id}" availability.toDate`);
        if (
            rule.shiftTypeTags !== undefined &&
            (!Array.isArray(rule.shiftTypeTags) || rule.shiftTypeTags.some((t) => typeof t !== 'string' || !t))
        ) {
            throw new ScheduleValidationError(
                `employee "${employee.id}" availability.shiftTypeTags must be non-empty strings`,
            );
        }
        if (rule.priority !== undefined) {
            if (rule.priority !== 'normal' && rule.priority !== 'important') {
                throw new ScheduleValidationError(`employee "${employee.id}" availability.priority must be normal or important`);
            }
            if (rule.kind !== 'preferred' && rule.kind !== 'avoid') {
                throw new ScheduleValidationError(
                    `employee "${employee.id}" availability.priority applies only to preferred and avoid rules`,
                );
            }
        }
    }
```

If `model.ts` still uses `availabilityApplies` internally, add `import { availabilityApplies } from './preferences';` alongside the re-export.

In `src/scheduling/constraints/availability.ts`:
- Replace `import { availabilityApplies } from '../model';` with `import { availabilityApplies, ruleOverlapMinutes } from '../preferences';`
- Delete the local `overlapsRule` function and replace its call sites with `ruleOverlapMinutes` (same argument order: `clock, range, rule`).
- Change the `clock` parameter type of `preferenceScore` to `ClockLike` from `../preferences`.

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx mocha tests/scheduling/preferences.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 7: Run the scheduling suite for regressions**

Run: `npx mocha 'tests/scheduling/**/*.test.ts'`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add src/scheduling/preferences.ts src/scheduling/types.ts src/scheduling/model.ts src/scheduling/constraints/availability.ts tests/scheduling/preferences.test.ts
git commit -m "feat(scheduling): match availability rules by shift type, with rule priority"
```

---

### Task 2: Resolved weights — important weight and per-person budget

**Files:**
- Modify: `src/scheduling/preferences.ts` (add `resolvePreferenceRules`, `validatePreferenceObjectives`)
- Modify: `src/scheduling/types.ts` (`ObjectiveWeights`, `ModelContext`)
- Modify: `src/scheduling/model.ts` (`buildModel` return)
- Modify: `src/scheduling/constraints/availability.ts` (`preferencePenalty`)
- Modify: `src/scheduling/operations.ts:338` (`rankCandidates`)
- Test: `tests/scheduling/preferences.test.ts`

**Interfaces:**
- Consumes: `ruleMatchesInstance` (Task 1).
- Produces:
  - `ObjectiveWeights.preferences?: PreferenceObjective`, where `interface PreferenceObjective { budget?: number; importantWeight?: number }`.
  - `ModelContext.preferenceRules: Map<string, AvailabilityRule[]>`: per employee, only the `preferred`/`avoid` rules, each a copy with `weight` set to the resolved effective weight. Employees with none have no entry.
  - `resolvePreferenceRules(employees: Employee[], instances: ShiftInstance[], clock: ClockLike, objective?: PreferenceObjective): Map<string, AvailabilityRule[]>`

- [ ] **Step 1: Write the failing tests**

Append inside the top-level `describe` in `tests/scheduling/preferences.test.ts`:

```ts
    describe('resolved weights', function () {
        const days = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'];
        const shifts = days.map((d) => shift(`day-${d}`, '09:00', '17:00', [d]));
        const total = (rules: AvailabilityRule[] | undefined) =>
            (rules ?? []).reduce((sum, r) => sum + Math.abs(r.weight ?? 1), 0);

        it('uses weights as given when no preference objective is set', function () {
            const ctx = buildModel(
                input({ employees: [emp('e1', [{ kind: 'avoid', weight: 3, daysOfWeek: [1] }])], shifts }),
            );
            expect(ctx.preferenceRules.get('e1')!.map((r) => r.weight)).to.deep.equal([3]);
        });

        it('multiplies important rules by importantWeight', function () {
            const ctx = buildModel(
                input({
                    employees: [emp('e1', [{ kind: 'avoid', priority: 'important', fromDate: days[0], toDate: days[0] }])],
                    shifts,
                    objectives: { preferences: { importantWeight: 4 } },
                }),
            );
            expect(ctx.preferenceRules.get('e1')![0].weight).to.equal(4);
        });

        it('scales every person to the same budget, however many wishes they state', function () {
            const one = emp('one', [{ kind: 'avoid', fromDate: days[0], toDate: days[0] }]);
            const many = emp(
                'many',
                days.flatMap((d) => [
                    { kind: 'avoid' as const, fromDate: d, toDate: d },
                    { kind: 'preferred' as const, fromDate: d, toDate: d, from: '09:00', to: '12:00' },
                ]),
            );
            const ctx = buildModel(
                input({ employees: [one, many], shifts, objectives: { preferences: { budget: 10 } } }),
            );
            expect(total(ctx.preferenceRules.get('one'))).to.be.closeTo(10, 1e-9);
            expect(total(ctx.preferenceRules.get('many'))).to.be.closeTo(10, 1e-9);
        });

        it('leaves rules matching no occurrence out of the budget denominator', function () {
            const ctx = buildModel(
                input({
                    employees: [
                        emp('e1', [
                            { kind: 'avoid', fromDate: days[0], toDate: days[0] },
                            // Saturday: no shift runs, so this wish costs nothing.
                            { kind: 'avoid', fromDate: '2026-01-10', toDate: '2026-01-10' },
                        ]),
                    ],
                    shifts,
                    objectives: { preferences: { budget: 10 } },
                }),
            );
            expect(ctx.preferenceRules.get('e1')!.map((r) => r.weight)).to.deep.equal([10, 0]);
        });

        it('keeps outsideBudget rules at their own weight and out of the denominator', function () {
            const ctx = buildModel(
                input({
                    employees: [
                        emp('e1', [
                            { kind: 'avoid', fromDate: days[0], toDate: days[0] },
                            { kind: 'avoid', weight: 5, outsideBudget: true, fromDate: days[1], toDate: days[1] },
                        ]),
                    ],
                    shifts,
                    objectives: { preferences: { budget: 10 } },
                }),
            );
            expect(ctx.preferenceRules.get('e1')!.map((r) => r.weight)).to.deep.equal([10, 5]);
        });

        it('lets a single wish beat one of many in a contested solve', function () {
            const contested = shift('contested', '09:00', '17:00', [days[0]], { minEmployees: 1, maxEmployees: 1 });
            const others = days.slice(1).map((d) => shift(`other-${d}`, '09:00', '17:00', [d]));
            const one = emp('one', [{ kind: 'avoid', fromDate: days[0], toDate: days[0] }]);
            const many = emp('many', [
                { kind: 'avoid', fromDate: days[0], toDate: days[0] },
                ...days.slice(1).map((d) => ({ kind: 'avoid' as const, fromDate: d, toDate: d })),
            ]);
            const result = solveSchedule(
                input({
                    employees: [one, many],
                    shifts: [contested, ...others],
                    objectives: { preferences: { budget: 10 }, fillToContract: false },
                    maxIterations: 200,
                }),
            );
            const holder = result.assignments.find((a) => a.shiftInstanceId === `contested@${days[0]}`);
            expect(holder?.employeeId).to.equal('many');
        });

        it('feeds rankCandidates from the same resolved weights as the objective', function () {
            const rules: AvailabilityRule[] = [{ kind: 'avoid', fromDate: days[0], toDate: days[0] }];
            const ctx = buildModel(
                input({ employees: [emp('e1', rules)], shifts, objectives: { preferences: { budget: 10 } } }),
            );
            const inst = ctx.instanceById.get(`day-${days[0]}@${days[0]}`)!;
            expect(preferenceScore(ctx.clock, ctx.preferenceRules.get('e1'), inst)).to.equal(10);
        });

        it('refuses a non-positive budget', function () {
            expect(() => buildModel(input({ objectives: { preferences: { budget: 0 } } }))).to.throw(
                ScheduleValidationError,
                /preferences\.budget/,
            );
        });
    });
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx mocha tests/scheduling/preferences.test.ts`
Expected: FAIL. `ctx.preferenceRules` is undefined, and `preferences` is not a known key of `ObjectiveWeights`.

- [ ] **Step 3: Add the types**

In `src/scheduling/types.ts`, inside `interface ObjectiveWeights`, after `fillToContract?: boolean;`:

```ts
    /**
     * How stated preferences (`preferred` / `avoid` availability rules) are
     * weighted. Unset: every rule counts at its own `weight`, as it always
     * has.
     */
    preferences?: PreferenceObjective;
```

After the `ObjectiveWeights` interface, add:

```ts
/** Weighting of stated preferences. Soft level only. */
export interface PreferenceObjective {
    /**
     * Scale each person's preference weights so they sum to this. The sum
     * covers rules that touch at least one occurrence in the period and are
     * not `outsideBudget`. Without it, someone stating twenty wishes pulls
     * twenty times harder than someone stating one.
     */
    budget?: number;
    /** Multiplier for `priority: 'important'` rules. Defaults to 1. */
    importantWeight?: number;
}
```

In `interface ModelContext`, after `fillToContract: boolean;`:

```ts
    /**
     * Each employee's `preferred` / `avoid` rules with `weight` resolved
     * (priority multiplier, then budget scaling). Every preference scorer
     * reads this, never `Employee.availability` weights directly.
     */
    preferenceRules: Map<string, AvailabilityRule[]>;
```

- [ ] **Step 4: Implement resolution in the leaf**

Append to `src/scheduling/preferences.ts`. Extend the type import to `import type { AvailabilityRule, Employee, PreferenceObjective, ShiftInstance } from './types';` and add `import { ScheduleValidationError } from './types';`.

```ts
/** Throws on a malformed preference objective. */
export function validatePreferenceObjectives(objective: PreferenceObjective | undefined): void {
    if (!objective) return;
    const { budget, importantWeight } = objective;
    if (budget !== undefined && (!Number.isFinite(budget) || budget <= 0)) {
        throw new ScheduleValidationError('objectives.preferences.budget must be a positive number');
    }
    if (importantWeight !== undefined && (!Number.isFinite(importantWeight) || importantWeight <= 0)) {
        throw new ScheduleValidationError('objectives.preferences.importantWeight must be a positive number');
    }
}

/**
 * Resolve every employee's soft preference rules to their effective weights,
 * once, at model build. Priority multiplies first. The budget then scales
 * the in-budget rules that touch at least one occurrence, so a wish about a
 * day nothing runs on neither costs budget nor dilutes the rest (such a rule
 * resolves to 0).
 */
export function resolvePreferenceRules(
    employees: Employee[],
    instances: ShiftInstance[],
    clock: ClockLike,
    objective: PreferenceObjective | undefined,
): Map<string, AvailabilityRule[]> {
    const importantWeight = objective?.importantWeight ?? 1;
    const out = new Map<string, AvailabilityRule[]>();
    for (const employee of employees) {
        const soft = (employee.availability ?? []).filter((r) => r.kind === 'preferred' || r.kind === 'avoid');
        if (soft.length === 0) continue;
        const resolved = soft.map((rule) => ({
            ...rule,
            weight: (rule.weight ?? 1) * (rule.priority === 'important' ? importantWeight : 1),
        }));
        if (objective?.budget !== undefined) {
            const live = resolved.map(
                (rule) => !rule.outsideBudget && instances.some((inst) => ruleMatchesInstance(clock, rule, inst)),
            );
            const sum = resolved.reduce((acc, rule, i) => acc + (live[i] ? Math.abs(rule.weight) : 0), 0);
            const scale = sum > 0 ? objective.budget / sum : 0;
            resolved.forEach((rule, i) => {
                if (rule.outsideBudget) return;
                rule.weight = live[i] ? rule.weight * scale : 0;
            });
        }
        out.set(employee.id, resolved);
    }
    return out;
}
```

- [ ] **Step 5: Build the map in `buildModel`**

In `src/scheduling/model.ts`, add `import { resolvePreferenceRules, validatePreferenceObjectives } from './preferences';`. Before the `return {` of `buildModel`, add:

```ts
    validatePreferenceObjectives(input.objectives?.preferences);
    const preferenceRules = resolvePreferenceRules(input.employees, instances, clock, input.objectives?.preferences);
```

Add `preferenceRules,` to the returned object after `fillToContract,`.

- [ ] **Step 6: Point both scorers at the resolved rules**

In `src/scheduling/constraints/availability.ts`, `preferencePenalty`:

```ts
            const rules = state.ctx.preferenceRules.get(employeeId);
```

This replaces `state.ctx.employeeById.get(employeeId)?.availability`.

In `src/scheduling/operations.ts` ~line 338:

```ts
        const preference = preferenceScore(ctx.clock, ctx.preferenceRules.get(employee.id), inst);
```

- [ ] **Step 7: Run the tests and confirm they pass**

Run: `npx mocha tests/scheduling/preferences.test.ts`
Expected: PASS.

If the contested-solve test fails, first check whether `many` got the shift under the default objective. `fillToContract: false` and no contracts should leave preference as the only soft difference. Do not loosen the assertion.

- [ ] **Step 8: Run the scheduling suite for regressions**

Run: `npx mocha 'tests/scheduling/**/*.test.ts'`
Expected: all pass. Existing preference tests are unaffected, because weights are unchanged without the objective.

- [ ] **Step 9: Commit**

```bash
git add src/scheduling/preferences.ts src/scheduling/types.ts src/scheduling/model.ts src/scheduling/constraints/availability.ts src/scheduling/operations.ts tests/scheduling/preferences.test.ts
git commit -m "feat(scheduling): per-person preference budget and important-wish weight"
```

---

### Task 3: Preference report on solve and compliance results

**Files:**
- Create: `src/scheduling/preference-report.ts`
- Modify: `src/scheduling/types.ts` (report types, `ScheduleResult.preferences`)
- Modify: `src/scheduling/operations.ts` (`ComplianceReport.preferences`, `checkCompliance` return ~line 157)
- Modify: `src/scheduling/scheduler.class.ts` (~line 142 and the return)
- Modify: `src/scheduling/index.ts` (type exports)
- Test: `tests/scheduling/preferences.test.ts`

**Interfaces:**
- Consumes: `ctx.preferenceRules` (Task 2), `ruleMatchesInstance` (Task 1), `hardCompliant` (`engine/construction.ts`), `verdictsFor` (`engine/verdicts.ts`).
- Produces:
  - `preferenceReport(state: InternalState): EmployeePreferenceReport[]`
  - `ScheduleResult.preferences?: EmployeePreferenceReport[]`: omitted when empty, like `contractHours`.
  - `ComplianceReport.preferences: EmployeePreferenceReport[]`

The missed-reason codes:
- `'cover'`: the worker was assigned against an `avoid` wish, and nobody else was eligible for that shift.
- `'blocked'`: a `preferred` shift the worker did not get, which they were not eligible for (rest, hours or another hard rule).
- `'tradeoff'`: anything else. Someone else could have taken it, or the worker could have, and the solver chose otherwise.

This adds `'blocked'` to the spec's two reasons. `'cover'` cannot explain a missed `preferred` wish, so without a third code the portal would call a legal block a balancing choice.

- [ ] **Step 1: Write the failing tests**

Append inside the top-level `describe`:

```ts
    describe('preference report', function () {
        const MON = '2026-01-05';
        const TUE = '2026-01-06';
        const cover = (id: string, date: string) => shift(id, '09:00', '17:00', [date], { minEmployees: 1, maxEmployees: 1 });
        const outcomeOf = (report: import('../../src/scheduling').EmployeePreferenceReport[] | undefined, emp: string, id: string) =>
            report?.find((r) => r.employeeId === emp)?.rules.find((r) => r.ruleId === id);

        it('marks a dated avoid met when the worker is left off that day', function () {
            const result = solveSchedule(
                input({
                    employees: [emp('a', [{ id: 'r1', kind: 'avoid', fromDate: MON, toDate: MON }]), emp('b')],
                    shifts: [cover('s', MON)],
                    objectives: { fillToContract: false },
                    maxIterations: 100,
                }),
            );
            expect(outcomeOf(result.preferences, 'a', 'r1')).to.include({ outcome: 'met', matchedInstances: 1, honoured: 1 });
        });

        it('explains a dated avoid missed for cover when nobody else could work', function () {
            const result = solveSchedule(
                input({
                    employees: [emp('a', [{ id: 'r1', kind: 'avoid', priority: 'important', fromDate: MON, toDate: MON }])],
                    shifts: [cover('s', MON)],
                    objectives: { fillToContract: false },
                    maxIterations: 50,
                }),
            );
            const outcome = outcomeOf(result.preferences, 'a', 'r1')!;
            expect(outcome).to.include({ outcome: 'missed', priority: 'important', kind: 'avoid' });
            expect(outcome.missed).to.deep.equal([{ instanceId: `s@${MON}`, reason: 'cover' }]);
        });

        it('marks a dated preferred missed as blocked when the worker was not eligible', function () {
            const result = solveSchedule(
                input({
                    employees: [
                        emp('a', [
                            { id: 'want', kind: 'preferred', fromDate: MON, toDate: MON },
                            { kind: 'unavailable', fromDate: MON, toDate: MON },
                        ]),
                        emp('b'),
                    ],
                    shifts: [cover('s', MON)],
                    objectives: { fillToContract: false },
                    maxIterations: 50,
                }),
            );
            const outcome = outcomeOf(result.preferences, 'a', 'want')!;
            expect(outcome.outcome).to.equal('missed');
            expect(outcome.missed).to.deep.equal([{ instanceId: `s@${MON}`, reason: 'blocked' }]);
        });

        it('reports a weekly avoid partly met with the assigned occurrence listed', function () {
            const report = checkCompliance(
                input({
                    employees: [emp('a', [{ id: 'wk', kind: 'avoid', daysOfWeek: [1, 2] }]), emp('b')],
                    shifts: [cover('m', MON), cover('t', TUE)],
                }),
                [
                    { employeeId: 'a', shiftInstanceId: `m@${MON}`, date: MON, reasons: [] },
                    { employeeId: 'b', shiftInstanceId: `t@${TUE}`, date: TUE, reasons: [] },
                ],
            );
            const outcome = outcomeOf(report.preferences, 'a', 'wk')!;
            expect(outcome).to.include({ outcome: 'partly', matchedInstances: 2, honoured: 1 });
            expect(outcome.missed).to.deep.equal([{ instanceId: `m@${MON}`, reason: 'tradeoff' }]);
        });

        it('reports a weekly preferred met by any matching shift, and lists nothing it missed', function () {
            const report = checkCompliance(
                input({
                    employees: [emp('a', [{ id: 'wk', kind: 'preferred', daysOfWeek: [1, 2] }])],
                    shifts: [cover('m', MON), cover('t', TUE)],
                }),
                [{ employeeId: 'a', shiftInstanceId: `m@${MON}`, date: MON, reasons: [] }],
            );
            expect(outcomeOf(report.preferences, 'a', 'wk')).to.deep.include({
                outcome: 'met',
                honoured: 1,
                missed: [],
            });
        });

        it('reports a rule that touches no occurrence as not-applicable', function () {
            const report = checkCompliance(
                input({
                    employees: [emp('a', [{ id: 'sat', kind: 'avoid', fromDate: '2026-01-10', toDate: '2026-01-10' }])],
                    shifts: [cover('m', MON)],
                }),
                [],
            );
            expect(outcomeOf(report.preferences, 'a', 'sat')).to.include({ outcome: 'not-applicable', matchedInstances: 0 });
        });

        it('omits preferences from the solve result when nobody stated any', function () {
            const result = solveSchedule(input({ employees: [emp('a')], shifts: [cover('m', MON)], maxIterations: 20 }));
            expect(result).to.not.have.property('preferences');
        });
    });
```

Add `checkCompliance` to the import from `'../../src/scheduling'` at the top of the file. `ScheduledAssignment` requires `shiftInstanceId`, `employeeId`, `date` and `reasons`; the literal rosters above carry all four.

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx mocha tests/scheduling/preferences.test.ts`
Expected: FAIL. `result.preferences` / `report.preferences` is undefined.

- [ ] **Step 3: Add the report types**

In `src/scheduling/types.ts`, after `ContractHoursSummary`:

```ts
/** One person's stated preferences and how the roster answered them. */
export interface EmployeePreferenceReport {
    employeeId: string;
    rules: PreferenceRuleOutcome[];
}

/**
 * How one `preferred` / `avoid` rule fared.
 *
 * A dated rule (both `fromDate` and `toDate`) is one wish:
 * - an avoid is missed by any assignment it touches;
 * - a preferred is missed when the person gets none of its occurrences.
 *
 * A weekly rule reports counts:
 * - an avoid is `partly` met when some of its occurrences were assigned;
 * - a preferred is met by any one assigned occurrence and never lists what
 *   it missed, because nobody can work every preferred shift.
 */
export interface PreferenceRuleOutcome {
    ruleId?: string;
    kind: 'preferred' | 'avoid';
    priority: 'normal' | 'important';
    /** Occurrences in the period the rule touches. */
    matchedInstances: number;
    /** Occurrences that went the person's way: not assigned (avoid) or assigned (preferred). */
    honoured: number;
    outcome: 'met' | 'missed' | 'partly' | 'not-applicable';
    missed: Array<{ instanceId: string; reason: 'cover' | 'blocked' | 'tradeoff' }>;
}
```

In `interface ScheduleResult`, after `contractHours?`:

```ts
    /** Per person, how each stated preference fared. Present when anyone stated one. */
    preferences?: EmployeePreferenceReport[];
```

- [ ] **Step 4: Implement the report**

Create `src/scheduling/preference-report.ts`:

```ts
/**
 * Which stated preferences a finished roster honoured, and why the others
 * were not.
 *
 * Assembled once per result, never in the search loop. Eligibility is the
 * same judgement `rankCandidates` makes: no hard verdict against the pair,
 * and `hardCompliant`. So "nobody else could work it" here and an empty
 * candidate list there are one answer.
 */

import type { EmployeePreferenceReport, PreferenceRuleOutcome, ShiftInstance } from './types';
import type { InternalState } from './engine/state';
import { hardCompliant } from './engine/construction';
import { verdictsFor } from './engine/verdicts';
import { ruleMatchesInstance } from './preferences';

function eligible(state: InternalState, employeeId: string, instanceId: string): boolean {
    const blocked = verdictsFor(state, { employeeId, shiftInstanceId: instanceId }).some(
        (v) => !v.pass && v.severity === 'hard',
    );
    return !blocked && hardCompliant(state.ctx, state, employeeId, instanceId);
}

function someoneElseEligible(state: InternalState, employeeId: string, inst: ShiftInstance): boolean {
    return state.ctx.employees.some(
        (other) =>
            other.id !== employeeId && !state.isAssigned(other.id, inst.id) && eligible(state, other.id, inst.id),
    );
}

export function preferenceReport(state: InternalState): EmployeePreferenceReport[] {
    const { ctx } = state;
    const out: EmployeePreferenceReport[] = [];
    for (const employee of ctx.employees) {
        const rules = ctx.preferenceRules.get(employee.id);
        if (!rules?.length) continue;
        const outcomes: PreferenceRuleOutcome[] = rules.map((rule) => {
            const kind = rule.kind as 'preferred' | 'avoid';
            const matching = ctx.instances.filter((inst) => ruleMatchesInstance(ctx.clock, rule, inst));
            const assigned = matching.filter((inst) => state.isAssigned(employee.id, inst.id));
            const dated = rule.fromDate !== undefined && rule.toDate !== undefined;
            const base = {
                ...(rule.id !== undefined ? { ruleId: rule.id } : {}),
                kind,
                priority: rule.priority ?? 'normal',
                matchedInstances: matching.length,
            };
            if (matching.length === 0) {
                return { ...base, honoured: 0, outcome: 'not-applicable', missed: [] };
            }
            if (kind === 'avoid') {
                const missed = assigned.map((inst) => ({
                    instanceId: inst.id,
                    reason: someoneElseEligible(state, employee.id, inst) ? ('tradeoff' as const) : ('cover' as const),
                }));
                const outcome =
                    assigned.length === 0
                        ? 'met'
                        : dated || assigned.length === matching.length
                          ? 'missed'
                          : 'partly';
                return { ...base, honoured: matching.length - assigned.length, outcome, missed };
            }
            if (assigned.length > 0) return { ...base, honoured: assigned.length, outcome: 'met', missed: [] };
            const missed = dated
                ? matching.map((inst) => ({
                      instanceId: inst.id,
                      reason: eligible(state, employee.id, inst.id) ? ('tradeoff' as const) : ('blocked' as const),
                  }))
                : [];
            return { ...base, honoured: 0, outcome: 'missed', missed };
        });
        out.push({ employeeId: employee.id, rules: outcomes });
    }
    return out;
}
```

`eligible` for an unassigned pair evaluates the hard rules as if the pair were added, the same way `rankCandidates` does. Check that `verdictsFor` handles an unassigned pair: `rankCandidates` calls it on unassigned pairs, so it does.

- [ ] **Step 5: Wire it into both results**

In `src/scheduling/scheduler.class.ts`:
- Add `import { preferenceReport } from './preference-report';`
- After `const contractHours = contractHoursSummary(state);`, add `const preferences = preferenceReport(state);`
- In the returned object after the `contractHours` spread, add `...(preferences.length ? { preferences } : {}),`

Before doing so, confirm `state` there is an `InternalState` (`createState` returns one).

In `src/scheduling/operations.ts`:
- Add `import { preferenceReport } from './preference-report';`
- In `interface ComplianceReport`, add after `contractHours`:
  ```ts
      /** How each stated preference fared — the same report the solver attaches. */
      preferences: EmployeePreferenceReport[];
  ```
  Import the type from `./types`.
- In the `checkCompliance` return, add `preferences: preferenceReport(state),`

In `src/scheduling/index.ts`, add `EmployeePreferenceReport`, `PreferenceObjective` and `PreferenceRuleOutcome` to the `export type { … }` list, alphabetically.

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx mocha tests/scheduling/preferences.test.ts`
Expected: PASS.

- [ ] **Step 7: Run the whole suite and build**

Run: `pnpm build && npx mocha 'tests/scheduling/**/*.test.ts'`
Expected: tsc clean, all pass. Tests that deep-equal a whole `ComplianceReport` may now need `preferences: []`. Add it where it is missing; don't delete assertions.

- [ ] **Step 8: Commit**

```bash
git add src/scheduling/preference-report.ts src/scheduling/types.ts src/scheduling/operations.ts src/scheduling/scheduler.class.ts src/scheduling/index.ts tests/scheduling/preferences.test.ts
git commit -m "feat(scheduling): report which stated preferences a roster met, and why not"
```

---

### Task 4: Docs, version, project notes

**Files:**
- Modify: `README.md` (Shift Scheduling section, near line 2155, the rules paragraph)
- Modify: `package.json` (`"version": "1.17.0"`)
- Modify: `CLAUDE.md` (the "Scheduling semantics" list, beside the "Soft preferences are scored, not advisory" bullet)
- Modify: `docs/superpowers/specs/2026-09-25-worker-schedule-preferences-design.md` (add `'blocked'` to the reason union; `ComplianceReport.preferences`)
- Regenerate: `docs/` via `pnpm build:docs`

- [ ] **Step 1: README subsection**

After the paragraph that lists rules (the one containing "availability and preferences"), add:

````markdown
**Worker preferences.** `preferred` / `avoid` availability rules are soft wishes, scored at the soft level, so they never outrank cover or a legal limit.

- **Matching.** `shiftTypeTags: ['night']` matches by shift type rather than by clock window.
- **Priority.** `priority: 'important'` is multiplied by `objectives.preferences.importantWeight`.
- **Budget.** `objectives.preferences.budget` scales each person's wishes to the same total, so someone who states twenty does not out-pull someone who states one. Rules touching no shift in the period cost nothing. Mark imported facts such as calendar busy time `outsideBudget: true`.
- **Report.** `result.preferences` (and `checkCompliance(...).preferences`) reports per person which wishes were met. For each miss it gives a reason:
  - `cover`: nobody else could work it;
  - `blocked`: the person could not legally take the shift they wanted;
  - `tradeoff`: the solver balanced it against the team.

```ts
const result = solveSchedule({
    period,
    shifts,
    employees: [
        {
            id: 'ana',
            tags: [],
            timeOff: [],
            availability: [
                { id: 'nights', kind: 'preferred', shiftTypeTags: ['night'] },
                { id: 'wedding', kind: 'avoid', priority: 'important', fromDate: '2026-06-13', toDate: '2026-06-13' },
            ],
        },
    ],
    objectives: { preferences: { budget: 10, importantWeight: 4 } },
});
result.preferences; // [{ employeeId: 'ana', rules: [{ ruleId: 'wedding', outcome: 'met', ... }, ...] }]
```
````

- [ ] **Step 2: CLAUDE.md bullet**

Add after the "Soft preferences are scored, not advisory" bullet:

```markdown
- **Preference weights resolve once, in `buildModel`, into `ctx.preferenceRules`.** Priority (`importantWeight`) multiplies first, then `objectives.preferences.budget` scales each person's in-budget rules that touch an occurrence to the same total — otherwise the person stating the most wishes wins. `preferencePenalty`, `rankCandidates` and `preferenceReport` all read the resolved rules; never score off `Employee.availability[].weight`. Matching (`availabilityApplies`, `ruleMatchesInstance`, `shiftTypeTags`) lives in the leaf `preferences.ts`. The report (`result.preferences`, `checkCompliance().preferences`) runs at assembly only; its `cover` / `blocked` / `tradeoff` reasons use the same eligibility as `rankCandidates`.
```

- [ ] **Step 3: Spec correction, version, typedoc**

In the spec:
- Change `reason: 'cover' | 'tradeoff'` to `'cover' | 'blocked' | 'tradeoff'`, with one line explaining `blocked`.
- Note that `checkCompliance` returns `preferences` too.

Set `package.json` `"version"` to `"1.17.0"`.

Run: `pnpm build:docs`
Expected: completes. `docs/` is updated.

- [ ] **Step 4: Full verification**

Run: `pnpm build && npx mocha 'tests/scheduling/**/*.test.ts'`
Expected: clean build, all pass.

Then run the full suite on its own, with no other test run in flight against Redis DB 15: `pnpm test`.
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add README.md CLAUDE.md package.json docs/
git commit -m "docs(scheduling): worker preferences — shift types, priority, budget, report; 1.17.0"
```

---

## Out of this plan

The platform half (table, settings, input assembly, API/SDK/MCP, portal screen, console section, e2e) is a separate plan in `platform`. It is written after this ships, against the released 1.17.0 types.
