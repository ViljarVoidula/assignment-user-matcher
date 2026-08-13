import { expect } from 'chai';
import { solveSchedule, ScheduleValidationError, ShiftScheduler } from '../../src/scheduling';
import type { ScheduleInput } from '../../src/scheduling';

function baseInput(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-07' }, // Mon–Wed
        employees: [
            { id: 'alice', tags: ['nurse'], timeOff: [] },
            { id: 'bob', tags: ['nurse'], timeOff: [] },
            { id: 'carol', tags: ['porter'], timeOff: [] },
        ],
        shifts: [
            {
                id: 'day',
                name: 'Day',
                startTime: '08:00',
                endTime: '16:00',
                minEmployees: 1,
            },
        ],
        timeBudgetMs: 0,
        ...overrides,
    };
}

describe('ShiftScheduler', function () {
    it('fills a simple week and reports optimal', function () {
        const result = solveSchedule(baseInput());
        expect(result.status).to.equal('optimal');
        expect(result.assignments).to.have.length(3);
        expect(result.stats.unfilledSlots).to.equal(0);
        expect(result.violations).to.have.length(0);
        for (const a of result.assignments) {
            expect(a.shiftInstanceId).to.match(/^day@2026-01-0[567]$/);
            expect(a.reasons.length).to.be.greaterThan(0);
        }
    });

    it('is deterministic for identical input and seed', function () {
        const input = baseInput({ seed: 7, objective: 'balanced' });
        const a = solveSchedule(input);
        const b = solveSchedule(input);
        expect(JSON.stringify(a.assignments)).to.equal(JSON.stringify(b.assignments));
        expect(JSON.stringify(a.violations)).to.equal(JSON.stringify(b.violations));
        expect(a.status).to.equal(b.status);
    });

    it('different seeds may pick different but valid rosters', function () {
        const a = solveSchedule(baseInput({ seed: 1 }));
        const b = solveSchedule(baseInput({ seed: 999 }));
        expect(a.stats.unfilledSlots).to.equal(0);
        expect(b.stats.unfilledSlots).to.equal(0);
    });

    it('keeps same-named shifts on different days as distinct instances', function () {
        const result = solveSchedule(baseInput());
        const ids = new Set(result.assignments.map((a) => a.shiftInstanceId));
        expect(ids.size).to.equal(3); // no cross-day name collision
    });

    it('balances hours across employees under the balanced objective', function () {
        const result = solveSchedule(baseInput({ objective: 'balanced', seed: 3 }));
        const perEmployee = new Map<string, number>();
        for (const a of result.assignments) perEmployee.set(a.employeeId, (perEmployee.get(a.employeeId) ?? 0) + 1);
        const counts = [...perEmployee.values()];
        expect(Math.max(...counts) - Math.min(...counts)).to.be.at.most(1);
    });

    it('throws a typed validation error on malformed input', function () {
        expect(() => solveSchedule(baseInput({ period: { startDate: 'not-a-date', endDate: '2026-01-07' } }))).to.throw(
            ScheduleValidationError,
        );
        expect(() =>
            solveSchedule(baseInput({ employees: [{ id: 'x', tags: [], timeOff: [], maxHoursForPeriod: -5 }] })),
        ).to.throw(ScheduleValidationError);
        expect(() => solveSchedule(baseInput({ period: { startDate: '2026-01-07', endDate: '2026-01-05' } }))).to.throw(
            ScheduleValidationError,
        );
        expect(() =>
            solveSchedule(
                baseInput({
                    shifts: [{ id: 's', name: 'S', startTime: '25:00', endTime: '16:00' }],
                }),
            ),
        ).to.throw(ScheduleValidationError);
    });

    it('respects tag requirements when staffing', function () {
        const result = solveSchedule(
            baseInput({
                shifts: [
                    {
                        id: 'day',
                        name: 'Day',
                        startTime: '08:00',
                        endTime: '16:00',
                        minEmployees: 1,
                        tagRequirements: { nurse: 1 },
                    },
                ],
            }),
        );
        expect(result.status).to.equal('optimal');
        for (const a of result.assignments) expect(['alice', 'bob']).to.include(a.employeeId);
    });

    it('runs the LNS loop within its time budget and keeps the roster valid', function () {
        const result = solveSchedule(
            baseInput({
                objective: 'balanced',
                seed: 11,
                timeBudgetMs: 250,
                shifts: [
                    { id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', minEmployees: 1 },
                    { id: 'late', name: 'Late', startTime: '16:00', endTime: '22:00', minEmployees: 1 },
                ],
            }),
        );
        expect(result.stats.evaluatedVariants).to.be.greaterThan(1);
        expect(result.stats.unfilledSlots).to.equal(0);
        // One-shift-per-day still holds after improvement.
        const seen = new Set<string>();
        for (const a of result.assignments) {
            const key = `${a.employeeId}|${a.date}`;
            expect(seen.has(key), `duplicate day for ${key}`).to.be.false;
            seen.add(key);
        }
    });

    it('exposes the facade class for DI-style usage', function () {
        const scheduler = new ShiftScheduler();
        const result = scheduler.solve(baseInput());
        expect(result.status).to.equal('optimal');
    });
});
