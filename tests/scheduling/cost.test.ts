import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { marginalCostCents, overtimeSurchargeCents, rosterCost, shiftCostCents } from '../../src/scheduling/cost';
import { solveSchedule, rankCandidates } from '../../src/scheduling';
import type { Employee, ModelContext, ScheduleInput, ShiftTemplate } from '../../src/scheduling';

const H = 60;
const PERIOD = { startDate: '2026-01-05', endDate: '2026-01-11' }; // Mon-Sun

function ctxFor(input: Partial<ScheduleInput>): ModelContext {
    return buildModel({
        period: input.period ?? PERIOD,
        employees: input.employees ?? [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: input.shifts ?? [],
        rules: input.rules,
        calendar: input.calendar,
        objectives: input.objectives,
    });
}

function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

function stateWith(ctx: ModelContext, pairs: Array<[string, string]>) {
    const state = createState(ctx);
    for (const [employeeId, instanceId] of pairs) assign(state, employeeId, instanceId, []);
    return state;
}

describe('labour cost', function () {
    describe('shift pricing', function () {
        it('prices working minutes at the rate, uplifted by the applicable premium', function () {
            const ctx = ctxFor({
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05']), shift('sun', '08:00', '16:00', ['2026-01-11'])],
            });
            const cost = { hourlyRateCents: 1500, premiums: [{ predicate: 'sunday' as const, multiplier: 1.5 }] };
            expect(shiftCostCents(ctx.instanceById.get('d@2026-01-05')!, cost)).to.equal(8 * 1500);
            expect(shiftCostCents(ctx.instanceById.get('sun@2026-01-11')!, cost)).to.equal(8 * 1500 * 1.5);
        });

        it('stacks premiums additively when the model says so, by maximum otherwise', function () {
            // A Sunday that is also a public holiday, with night minutes.
            const ctx = ctxFor({
                shifts: [shift('n', '22:00', '06:00', ['2026-01-11'])],
                rules: { nightWork: { window: { from: '22:00', to: '06:00' } } },
                calendar: { publicHolidays: ['2026-01-11'] },
            });
            const inst = ctx.instanceById.get('n@2026-01-11')!;
            const premiums = [
                { predicate: 'night' as const, multiplier: 1.25 },
                { predicate: 'sunday' as const, multiplier: 1.5 },
                { predicate: 'holiday' as const, multiplier: 2 },
            ];
            const base = 8 * 1000;
            expect(shiftCostCents(inst, { hourlyRateCents: 1000, premiums, stacking: 'max' })).to.equal(base * 2);
            // Additive: 1 + 0.25 + 0.5 + 1 = 2.75 — the Romanian shape.
            expect(shiftCostCents(inst, { hourlyRateCents: 1000, premiums, stacking: 'add' })).to.equal(base * 2.75);
        });

        it('pays the stand-by remainder of a duty-classified span at the stand-by fraction', function () {
            const ctx = ctxFor({
                shifts: [
                    shift('sb', '18:00', '06:00', ['2026-01-05'], {
                        shiftTypeTag: 'standby',
                        duty: { countsAsWorkingTime: 0.25, classificationNote: 'on-call, accrues at 25%' },
                    }),
                ],
            });
            const inst = ctx.instanceById.get('sb@2026-01-05')!;
            // 12h span, 3h counts as work, 9h stand-by remainder at 1/10 rate.
            expect(inst.workingMinutes).to.equal(3 * H);
            expect(shiftCostCents(inst, { hourlyRateCents: 1200, standbyRateFraction: 0.1 })).to.equal(
                3 * 1200 + 9 * 120,
            );
            // Without the fraction the remainder is unpaid.
            expect(shiftCostCents(inst, { hourlyRateCents: 1200 })).to.equal(3 * 1200);
        });
    });

    describe('overtime surcharge', function () {
        const cost = { hourlyRateCents: 1000, overtimeAfterMinutes: 8 * H, overtimeMultiplier: 1.5 };

        it('adds the uplift for minutes past the threshold', function () {
            expect(overtimeSurchargeCents(8 * H, cost)).to.equal(0);
            expect(overtimeSurchargeCents(12 * H, cost)).to.equal(4 * 1000 * 0.5);
        });

        it('makes the same shift dearer for someone already at their threshold', function () {
            const ctx = ctxFor({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            const inst = ctx.instanceById.get('d@2026-01-05')!;
            const employee: Employee = { id: 'e1', tags: [], timeOff: [], cost };
            expect(marginalCostCents(inst, employee, 0)).to.equal(8 * 1000);
            expect(marginalCostCents(inst, employee, 8 * H)).to.equal(8 * 1000 + 8 * 1000 * 0.5);
        });
    });

    describe('roster summary', function () {
        it('sums per-shift prices plus each employee’s surcharge, and is absent without a cost model', function () {
            const employees: Employee[] = [
                {
                    id: 'e1',
                    tags: [],
                    timeOff: [],
                    cost: { hourlyRateCents: 1000, overtimeAfterMinutes: 8 * H, overtimeMultiplier: 1.5 },
                },
                { id: 'e2', tags: [], timeOff: [] },
            ];
            const ctx = ctxFor({
                employees,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06'], { maxEmployees: 2, minEmployees: 1 })],
            });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-05'],
                ['e1', 'd@2026-01-06'],
                ['e2', 'd@2026-01-05'],
            ]);
            const summary = rosterCost(state)!;
            // 16h at base plus 8h at the 0.5 uplift; e2 has no cost model.
            expect(summary.byEmployee['e1']).to.equal(16 * 1000 + 8 * 500);
            expect(summary.byEmployee['e2']).to.equal(undefined);
            expect(summary.totalCents).to.equal(16 * 1000 + 8 * 500);

            const bare = ctxFor({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            expect(rosterCost(stateWith(bare, [['e1', 'd@2026-01-05']]))).to.equal(undefined);
        });
    });

    describe('cost as a solve objective', function () {
        const employees: Employee[] = [
            { id: 'cheap', tags: [], timeOff: [], cost: { hourlyRateCents: 1000 } },
            { id: 'dear', tags: [], timeOff: [], cost: { hourlyRateCents: 3000 } },
        ];
        const shifts = [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06', '2026-01-07'], { maxEmployees: 1 })];

        it('registers the cost term only when a weight is set', function () {
            expect(ctxFor({ employees, shifts }).constraints.some((c) => c.id === 'cost')).to.equal(false);
            const weighted = ctxFor({ employees, shifts, objectives: { costWeightPerEuro: 1 } });
            expect(weighted.constraints.some((c) => c.id === 'cost')).to.equal(true);
        });

        it('steers the solve to the cheaper employee and reports the bill', function () {
            const result = solveSchedule({
                period: PERIOD,
                employees,
                shifts,
                objectives: { costWeightPerEuro: 1 },
                seed: 7,
                timeBudgetMs: 500,
            });
            expect(result.assignments).to.have.length(3);
            expect(result.assignments.every((a) => a.employeeId === 'cheap')).to.equal(true);
            expect(result.cost).to.deep.equal({ totalCents: 24 * 1000, byEmployee: { cheap: 24 * 1000 } });
        });

        it('never buys coverage or a hard breach with a cost saving', function () {
            // The cheap employee is blocked on one day, so the dear one must
            // still be rostered there despite tripling the bill.
            const blocked: Employee[] = [
                { ...employees[0], timeOff: [{ date: '2026-01-06' }] },
                employees[1],
            ];
            const result = solveSchedule({
                period: PERIOD,
                employees: blocked,
                shifts,
                objectives: { costWeightPerEuro: 1000 },
                seed: 7,
                timeBudgetMs: 500,
            });
            const byDate = new Map(result.assignments.map((a) => [a.date, a.employeeId]));
            expect(byDate.get('2026-01-06')).to.equal('dear');
            expect(result.stats.unfilledSlots).to.equal(0);
        });

        it('feeds the same marginal number to the repair ranking', function () {
            const roster = [
                { shiftInstanceId: 'd@2026-01-05', employeeId: 'cheap', date: '2026-01-05', reasons: [] },
            ];
            const input: ScheduleInput = { period: PERIOD, employees, shifts };
            const candidates = rankCandidates(input, 'd@2026-01-06', roster);
            const cheap = candidates.find((c) => c.employeeId === 'cheap')!;
            const dear = candidates.find((c) => c.employeeId === 'dear')!;
            expect(cheap.marginalCostCents).to.equal(8 * 1000);
            expect(dear.marginalCostCents).to.equal(8 * 3000);
            expect(cheap.rank).to.be.lessThan(dear.rank);
        });
    });
});
