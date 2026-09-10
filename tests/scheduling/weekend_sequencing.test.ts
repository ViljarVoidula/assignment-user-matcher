import { expect } from 'chai';
import { checkCompliance, solveSchedule } from '../../src/scheduling';
import type { Employee, ScheduleInput, ScheduledAssignment, ShiftTemplate } from '../../src/scheduling';

/**
 * "Every second weekend off."
 *
 * The most commonly negotiated scheduling term in Europe, and the one shape
 * fairness could not express. `FairnessRule` equalises *counts* — three
 * weekends each — which is satisfied exactly as well by three consecutive
 * weekends followed by three off as by alternating ones. The count is equal and
 * the arrangement is the thing people actually agreed to.
 *
 * So this is a sequence rule, beside the consecutive-days and consecutive-night
 * rules it is a sibling of, rather than a fairness dimension. A weekend is
 * keyed by the Saturday that opens it, so a Saturday and the Sunday after it
 * are one weekend rather than two — otherwise working an ordinary weekend would
 * breach "every second", which is the opposite of what the term asks.
 */

/** Four weeks from Monday 2 March 2026. */
const PERIOD = { startDate: '2026-03-02', endDate: '2026-03-29' };

/** Saturdays and Sundays in that period. */
const WEEKENDS = [
    ['2026-03-07', '2026-03-08'],
    ['2026-03-14', '2026-03-15'],
    ['2026-03-21', '2026-03-22'],
    ['2026-03-28', '2026-03-29'],
];

function shifts(): ShiftTemplate[] {
    return WEEKENDS.flatMap((weekend, index) =>
        weekend.map((date, day) => ({
            id: `w${index}d${day}`,
            name: `W${index}D${day}`,
            startTime: '09:00',
            endTime: '17:00',
            dates: [date],
            minEmployees: 1,
        })),
    );
}

const anna: Employee = { id: 'anna', tags: [], timeOff: [] };

function input(over: Partial<ScheduleInput> = {}): ScheduleInput {
    return { period: PERIOD, employees: [anna], shifts: shifts(), timeBudgetMs: 50, ...over } as ScheduleInput;
}

/** Work the Saturday of each named weekend index. */
function roster(...weekends: number[]): ScheduledAssignment[] {
    return weekends.map((index) => ({
        employeeId: 'anna',
        shiftInstanceId: `w${index}d0@${WEEKENDS[index]![0]}`,
        date: WEEKENDS[index]![0],
        reasons: [],
    }));
}

const breaches = (problem: ScheduleInput, assignments: ScheduledAssignment[]) =>
    checkCompliance(problem, assignments).violations.filter((v) => v.constraintId === 'consecutive-weekends');

describe('weekend sequencing', () => {
    describe('maxConsecutiveWeekends', () => {
        const rules = { consecutive: { maxConsecutiveWeekends: 1 } };

        it('permits alternating weekends', () => {
            expect(breaches(input({ rules }), roster(0, 2))).to.deep.equal([]);
        });

        it('refuses two in a row', () => {
            const found = breaches(input({ rules }), roster(0, 1));
            expect(found).to.not.be.empty;
            expect(found[0]!.message).to.contain('2 weekends in a row');
        });

        it('counts a Saturday and the Sunday after it as one weekend', () => {
            // Otherwise "every second weekend" would be breached by working one
            // ordinary weekend, which is the opposite of what it asks.
            const both: ScheduledAssignment[] = WEEKENDS[0]!.map((date, day) => ({
                employeeId: 'anna',
                shiftInstanceId: `w0d${day}@${date}`,
                date,
                reasons: [],
            }));
            expect(breaches(input({ rules }), both)).to.deep.equal([]);
        });

        it('permits two in a row when the rule allows two', () => {
            const permissive = { consecutive: { maxConsecutiveWeekends: 2 } };
            expect(breaches(input({ rules: permissive }), roster(0, 1))).to.deep.equal([]);
        });

        it('refuses three in a row when the rule allows two', () => {
            const permissive = { consecutive: { maxConsecutiveWeekends: 2 } };
            expect(breaches(input({ rules: permissive }), roster(0, 1, 2))).to.not.be.empty;
        });

        it('marks every shift in the run, not only the last one', () => {
            /*
             * Per assignment, like every other sequence rule here.
             *
             * A run is broken by removing *any* shift in it, so the search
             * needs a gradient on each of them — a single violation pinned to
             * the last one would leave the other moves looking free. It is also
             * what a person sees: the three shifts that together break the
             * agreement are all marked, rather than one arbitrary one.
             */
            const found = breaches(input({ rules }), roster(0, 1, 2));
            expect(found).to.have.lengthOf(3);
            expect(found.every((v) => v.message.includes('3 weekends in a row'))).to.equal(true);
        });

        it('is silent when the rule is not configured', () => {
            expect(breaches(input(), roster(0, 1, 2, 3))).to.deep.equal([]);
        });

        it('is silent for somebody who works no weekends at all', () => {
            expect(breaches(input({ rules }), [])).to.deep.equal([]);
        });

        it('counts each person separately', () => {
            const bo: Employee = { id: 'bo', tags: [], timeOff: [] };
            const both = [
                ...roster(0),
                { employeeId: 'bo', shiftInstanceId: `w1d0@${WEEKENDS[1]![0]}`, date: WEEKENDS[1]![0], reasons: [] },
            ];
            expect(breaches(input({ rules, employees: [anna, bo] }), both)).to.deep.equal([]);
        });

        it('sees a run that started before the period', () => {
            // Without history, every first-of-period roster is compliant by
            // construction — the same reason rest rules need it.
            const withHistory = input({
                rules,
                history: [
                    // The Saturday before the period opens.
                    {
                        employeeId: 'anna',
                        date: '2026-02-28',
                        startTime: '09:00',
                        endTime: '17:00',
                    },
                ],
            });
            expect(breaches(withHistory, roster(0))).to.have.lengthOf(1);
        });

        it('keeps the solver off a second consecutive weekend when it can', () => {
            const result = solveSchedule(
                input({
                    rules,
                    employees: [anna, { id: 'bo', tags: [], timeOff: [] }],
                }),
            );
            const hard = checkCompliance(input({ rules, employees: [anna, { id: 'bo', tags: [], timeOff: [] }] }), result.assignments)
                .violations.filter((v) => v.constraintId === 'consecutive-weekends' && v.severity === 'hard');
            expect(hard, hard.map((v) => v.message).join(' | ')).to.deep.equal([]);
        });
    });
});
