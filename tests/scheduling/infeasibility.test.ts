import { expect } from 'chai';
import { solveSchedule } from '../../src/scheduling';
import type { ScheduleInput } from '../../src/scheduling';

function input(overrides: Partial<ScheduleInput>): ScheduleInput {
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-07' },
        employees: [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', minEmployees: 1 }],
        timeBudgetMs: 0,
        ...overrides,
    };
}

describe('Scheduling infeasibility', function () {
    it('reports zero-eligible slots before search and returns partial', function () {
        const result = solveSchedule(
            input({
                employees: [
                    {
                        id: 'e1',
                        tags: [],
                        timeOff: [{ date: '2026-01-05' }, { date: '2026-01-06' }, { date: '2026-01-07' }],
                    },
                ],
            }),
        );
        expect(result.status).to.equal('partial');
        expect(result.stats.unfilledSlots).to.equal(3);
        expect(result.assignments).to.have.length(0);
        const zeroEligible = result.violations.filter((v) => v.message.includes('zero eligible employees'));
        expect(zeroEligible).to.have.length(3);
        expect(zeroEligible[0].severity).to.equal('hard');
    });

    it('returns best-effort partial with an unfilled-slot count when understaffed', function () {
        const result = solveSchedule(
            input({
                shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', minEmployees: 2 }],
            }),
        );
        expect(result.status).to.equal('partial');
        expect(result.stats.unfilledSlots).to.equal(3); // one missing person per day
        expect(result.assignments).to.have.length(3); // the one available employee still works
        const staffing = result.violations.filter((v) => v.constraintId === 'min-staffing');
        expect(staffing.length).to.be.greaterThan(0);
        expect(staffing[0].message).to.include('needs 2 employees, has 1');
    });

    it('returns feasible with a soft min-hours violation when hours fall short', function () {
        const result = solveSchedule(
            input({
                employees: [{ id: 'e1', tags: [], timeOff: [], minHoursForPeriod: 40 }],
            }),
        );
        expect(result.status).to.equal('feasible');
        expect(result.stats.unfilledSlots).to.equal(0);
        const soft = result.violations.filter((v) => v.severity === 'soft');
        expect(soft).to.have.length(1);
        expect(soft[0].constraintId).to.equal('hour-budget');
        expect(soft[0].message).to.include('below the 40h minimum');
    });

    it('reports tag-requirement shortfalls as violations', function () {
        const result = solveSchedule(
            input({
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
        expect(result.status).to.equal('partial');
        const tagViolation = result.violations.find((v) => v.message.includes('tag "nurse"'));
        expect(tagViolation).to.exist;
    });
});
