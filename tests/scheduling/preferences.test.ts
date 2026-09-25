import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { preferenceScore } from '../../src/scheduling/constraints/availability';
import { rankCandidates, ScheduleValidationError, solveSchedule } from '../../src/scheduling';
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
            expect(() =>
                buildModel(input({ employees: [emp('e1', [{ kind: 'preferred', shiftTypeTags: [''] }])] })),
            ).to.throw(ScheduleValidationError, /shiftTypeTags/);
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

        it('refuses a non-finite availability weight', function () {
            expect(() => buildModel(input({ employees: [emp('e1', [{ kind: 'avoid', weight: NaN }])] }))).to.throw(
                ScheduleValidationError,
                /availability\.weight/,
            );
        });
    });

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
            const ctx = buildModel(input({ employees: [one, many], shifts, objectives: { preferences: { budget: 10 } } }));
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
            // 'many' avoids day0 harder than any of its other days (weight 3
            // vs 1), so raw weights alone already prefer sending 'one' — who
            // only avoids day0 at all — into the contested slot and letting
            // 'many' absorb an evenly-weighted day elsewhere. Only budget
            // scaling, which concentrates 'one's single wish onto weight 10
            // while diluting 'many's five wishes, flips that outcome.
            const contested = shift('contested', '09:00', '17:00', [days[0]], { minEmployees: 1, maxEmployees: 1 });
            const others = days.slice(1).map((d) => shift(`other-${d}`, '09:00', '17:00', [d]));
            const one = emp('one', [{ kind: 'avoid', fromDate: days[0], toDate: days[0] }]);
            const many = emp('many', [
                { kind: 'avoid', weight: 3, fromDate: days[0], toDate: days[0] },
                ...days.slice(1).map((d) => ({ kind: 'avoid' as const, fromDate: d, toDate: d })),
            ]);

            const holderFor = (employees: Employee[], preferences?: { budget?: number }) => {
                const result = solveSchedule(
                    input({
                        employees,
                        shifts: [contested, ...others],
                        objectives: { fillToContract: false, ...(preferences ? { preferences } : {}) },
                        maxIterations: 200,
                    }),
                );
                return result.assignments.find((a) => a.shiftInstanceId === `contested@${days[0]}`)?.employeeId;
            };

            for (const employees of [
                [one, many],
                [many, one],
            ]) {
                expect(holderFor(employees)).to.equal('one');
                expect(holderFor(employees, { budget: 10 })).to.equal('many');
            }
        });

        it('feeds rankCandidates from the same resolved weights as the objective', function () {
            const rules: AvailabilityRule[] = [{ kind: 'avoid', fromDate: days[0], toDate: days[0] }];
            const ctx = buildModel(
                input({ employees: [emp('e1', rules)], shifts, objectives: { preferences: { budget: 10 } } }),
            );
            const inst = ctx.instanceById.get(`day-${days[0]}@${days[0]}`)!;
            expect(preferenceScore(ctx.clock, ctx.preferenceRules.get('e1'), inst)).to.equal(10);

            // Prove rankCandidates itself reads the resolved (budget-scaled)
            // weight, not the raw employee.availability weight: the only
            // thing that changes between the two calls below is the
            // objective, so the rank delta must equal exactly the preference
            // contribution's change (weight 1 -> 10, times the `* 5` factor
            // rankCandidates applies).
            const e1 = emp('e1', rules);
            const e2 = emp('e2');
            const instanceId = `day-${days[0]}@${days[0]}`;
            const rankFor = (objectives?: ScheduleInput['objectives']) =>
                rankCandidates(input({ employees: [e1, e2], shifts, objectives }), instanceId, []).find(
                    (c) => c.employeeId === 'e1',
                )!.rank;
            const withoutBudget = rankFor();
            const withBudget = rankFor({ preferences: { budget: 10 } });
            expect(withBudget - withoutBudget).to.be.closeTo(45, 1e-9);
        });

        it('refuses a non-positive budget', function () {
            expect(() => buildModel(input({ objectives: { preferences: { budget: 0 } } }))).to.throw(
                ScheduleValidationError,
                /preferences\.budget/,
            );
        });

        it('refuses a non-positive importantWeight', function () {
            expect(() => buildModel(input({ objectives: { preferences: { importantWeight: 0 } } }))).to.throw(
                ScheduleValidationError,
                /preferences\.importantWeight/,
            );
        });

        it('combines important priority with budget scaling', function () {
            const ctx = buildModel(
                input({
                    employees: [
                        emp('e1', [
                            { kind: 'avoid', fromDate: days[0], toDate: days[0] },
                            { kind: 'avoid', priority: 'important', fromDate: days[1], toDate: days[1] },
                        ]),
                    ],
                    shifts,
                    objectives: { preferences: { importantWeight: 4, budget: 10 } },
                }),
            );
            expect(ctx.preferenceRules.get('e1')!.map((r) => r.weight)).to.deep.equal([2, 8]);
        });
    });
});
