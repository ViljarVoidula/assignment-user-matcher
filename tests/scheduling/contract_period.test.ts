import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { checkCompliance, solveSchedule, ScheduleValidationError } from '../../src/scheduling';
import type { Employee, ScheduleInput, ScheduledAssignment, ShiftTemplate } from '../../src/scheduling';

/**
 * A contract that does not cover the whole period.
 *
 * `contract.endDate` bounded the tail and nothing bounded the head, so somebody
 * joining on day fifteen of a four-week period was planned a **full period's**
 * contract: 160 hours against a fortnight they were employed for. The
 * contract-hours objective then spent the whole solve trying to close a
 * shortfall that was an artefact of the arithmetic, loading them past everybody
 * who had been there all month.
 *
 * Pro-rating by days in force is the fix, and it is the same rule at both ends —
 * a leaver's last fortnight was already wrong in the same direction, just less
 * visibly, because `endDate` made their shifts ineligible without shrinking
 * what they were owed.
 */

/** Four weeks from Monday 2 March 2026. */
const PERIOD = { startDate: '2026-03-02', endDate: '2026-03-29' };
const WEEK = 5 * 8 * 60;

function shift(id: string, dates: string[]): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: '09:00', endTime: '17:00', dates, minEmployees: 1 };
}

function input(over: Partial<ScheduleInput> = {}): ScheduleInput {
    return { period: PERIOD, employees: [], shifts: [], timeBudgetMs: 50, ...over } as ScheduleInput;
}

const contracted = (id: string, over: Partial<Employee['contract']> = {}): Employee => ({
    id,
    tags: [],
    timeOff: [],
    contract: { kind: 'hours', weeklyMinutes: WEEK, ...over },
});

/** The period total the model plans this person towards. */
function plannedFor(employee: Employee, over: Partial<ScheduleInput> = {}): number | undefined {
    const ctx = buildModel(input({ employees: [employee], ...over }));
    return ctx.contractedPeriodMinutes.get(employee.id);
}

describe('contracts that do not span the period', () => {
    it('pro-rates a whole-period contract to the whole period', () => {
        // Four weeks of a 40h week.
        expect(plannedFor(contracted('full'))).to.equal(4 * WEEK);
    });

    it('halves it for somebody who joins halfway', () => {
        // In force from the 16th: fourteen of twenty-eight days.
        expect(plannedFor(contracted('joiner', { startDate: '2026-03-16' }))).to.equal(2 * WEEK);
    });

    it('halves it for somebody who leaves halfway', () => {
        // In force to the 15th inclusive: fourteen days again.
        expect(plannedFor(contracted('leaver', { endDate: '2026-03-15' }))).to.equal(2 * WEEK);
    });

    it('pro-rates both ends at once', () => {
        // The 9th to the 22nd inclusive is fourteen days.
        expect(plannedFor(contracted('temp', { startDate: '2026-03-09', endDate: '2026-03-22' }))).to.equal(2 * WEEK);
    });

    it('is unchanged by a start before the period', () => {
        expect(plannedFor(contracted('early', { startDate: '2026-01-01' }))).to.equal(4 * WEEK);
    });

    it('is unchanged by an end after the period', () => {
        expect(plannedFor(contracted('late', { endDate: '2026-12-31' }))).to.equal(4 * WEEK);
    });

    it('is nothing for a contract that never overlaps the period', () => {
        // Owed nothing, rather than owed a full period they were not employed
        // for — which is the whole failure this fixes, in its starkest form.
        expect(plannedFor(contracted('gone', { endDate: '2026-02-01' }))).to.equal(0);
        expect(plannedFor(contracted('future', { startDate: '2026-06-01' }))).to.equal(0);
    });

    it('refuses a start after its own end', () => {
        expect(() => plannedFor(contracted('backwards', { startDate: '2026-03-20', endDate: '2026-03-10' }))).to.throw(
            ScheduleValidationError,
        );
    });

    it('refuses a malformed start date', () => {
        expect(() => plannedFor(contracted('bad', { startDate: '16 March' }))).to.throw(ScheduleValidationError);
    });

    describe('eligibility', () => {
        const problem = input({
            employees: [contracted('joiner', { startDate: '2026-03-16' })],
            shifts: [shift('day', ['2026-03-10', '2026-03-20'])],
        });

        const breaches = (roster: ScheduledAssignment[]) =>
            checkCompliance(problem, roster).violations.filter((v) => v.constraintId === 'contract');

        it('refuses a shift before the contract starts', () => {
            const found = breaches([
                { employeeId: 'joiner', shiftInstanceId: 'day@2026-03-10', date: '2026-03-10', reasons: [] },
            ]);
            expect(found).to.have.lengthOf(1);
            expect(found[0]!.message).to.contain('starts 2026-03-16');
        });

        it('accepts one after it', () => {
            expect(
                breaches([
                    { employeeId: 'joiner', shiftInstanceId: 'day@2026-03-20', date: '2026-03-20', reasons: [] },
                ]),
            ).to.deep.equal([]);
        });

        it('keeps the solver off a shift before the start', () => {
            const result = solveSchedule(problem);
            expect(result.assignments.map((a) => a.shiftInstanceId)).to.not.contain('day@2026-03-10');
        });
    });

    describe('an opening balance for a longer reference period', () => {
        it('carries hours already worked into a rolling average', () => {
            /*
             * A twelve-month reference period needed twelve months of
             * shift-level history replayed on every solve, because the only way
             * to put minutes into a window was one assignment at a time. This
             * is the scalar that says "already 1,640 hours into the annual
             * budget" without the replay.
             */
            const rules = {
                workingTime: {
                    rollingAverages: [{ maxMinutes: 100 * 60, windowDays: 365, label: 'annual budget' }],
                },
            };
            const near = contracted('near');
            near.contract!.openingBalanceMinutes = 98 * 60;

            const problem = input({
                employees: [near],
                shifts: [shift('day', ['2026-03-03', '2026-03-04'])],
                rules,
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'near', shiftInstanceId: 'day@2026-03-03', date: '2026-03-03', reasons: [] },
                { employeeId: 'near', shiftInstanceId: 'day@2026-03-04', date: '2026-03-04', reasons: [] },
            ];

            // 98h carried in plus two 8h shifts is 114h, over the 100h budget.
            const found = checkCompliance(problem, roster).violations.filter((v) => v.constraintId === 'rolling-hours');
            expect(found).to.not.be.empty;
        });

        it('changes nothing when no balance is carried', () => {
            const rules = {
                workingTime: {
                    rollingAverages: [{ maxMinutes: 100 * 60, windowDays: 365, label: 'annual budget' }],
                },
            };
            const problem = input({
                employees: [contracted('fresh')],
                shifts: [shift('day', ['2026-03-03'])],
                rules,
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'fresh', shiftInstanceId: 'day@2026-03-03', date: '2026-03-03', reasons: [] },
            ];
            expect(checkCompliance(problem, roster).violations.filter((v) => v.constraintId === 'rolling-hours')).to.deep.equal(
                [],
            );
        });

        it('belongs to the longest window, not to every one of them', () => {
            /*
             * The failure this pins: an annual balance blowing a weekly cap.
             *
             * Hours worked last autumn are inside a 365-day window and are not
             * inside the last seven days. Adding the carried figure to every
             * rolling average made 1,500 hours into the annual budget breach a
             * 48h *week* — so the one configuration the field exists for (an
             * annual reference period beside the ordinary weekly average)
             * produced an empty roster with no error at all.
             */
            const rules = {
                workingTime: {
                    rollingAverages: [
                        { maxMinutes: 48 * 60, windowDays: 7, label: 'weekly' },
                        { maxMinutes: 1800 * 60, windowDays: 365, label: 'annual budget' },
                    ],
                },
            };
            const deep = contracted('deep');
            deep.contract!.openingBalanceMinutes = 1500 * 60;

            const result = solveSchedule(
                input({ employees: [deep], shifts: [shift('day', ['2026-03-03'])], rules }),
            );

            expect(result.assignments).to.have.lengthOf(1);
        });

        it('still breaches the longest window once the balance fills it', () => {
            const rules = {
                workingTime: {
                    rollingAverages: [
                        { maxMinutes: 48 * 60, windowDays: 7, label: 'weekly' },
                        { maxMinutes: 100 * 60, windowDays: 365, label: 'annual budget' },
                    ],
                },
            };
            const nearly = contracted('nearly');
            nearly.contract!.openingBalanceMinutes = 98 * 60;

            const problem = input({ employees: [nearly], shifts: [shift('day', ['2026-03-03', '2026-03-04'])], rules });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'nearly', shiftInstanceId: 'day@2026-03-03', date: '2026-03-03', reasons: [] },
                { employeeId: 'nearly', shiftInstanceId: 'day@2026-03-04', date: '2026-03-04', reasons: [] },
            ];

            const found = checkCompliance(problem, roster).violations.filter((v) => v.constraintId === 'rolling-hours');
            expect(found).to.not.be.empty;
            expect(found[0]!.message).to.contain('annual budget');
        });

        it('refuses a negative balance', () => {
            const odd = contracted('odd');
            odd.contract!.openingBalanceMinutes = -60;
            expect(() => plannedFor(odd)).to.throw(ScheduleValidationError);
        });
    });
});
