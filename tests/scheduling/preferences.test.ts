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
    });
});
