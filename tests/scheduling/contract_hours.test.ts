import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { scoreLex } from '../../src/scheduling/engine/objective';
import { overtimeLedger } from '../../src/scheduling/constraints/overtime';
import { ScheduleValidationError } from '../../src/scheduling/types';
import {
    checkCompliance,
    contractedPeriodMinutes,
    fullTimeWeeklyMinutes,
    rankCandidates,
    resolveContractedWeeklyMinutes,
    solveSchedule,
} from '../../src/scheduling';
import type { Employee, ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

const H = 60;
/** Mon 5 Jan – Sun 11 Jan 2026: one week, so contracted period minutes equal the weekly figure. */
const WEEK = { startDate: '2026-01-05', endDate: '2026-01-11' };
const WEEK_DATES = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11'];

function emp(id: string, extra: Partial<Employee> = {}): Employee {
    return { id, tags: [], timeOff: [], ...extra };
}

function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

function ctxFor(input: Partial<ScheduleInput>): ModelContext {
    return buildModel({
        period: input.period ?? WEEK,
        employees: input.employees ?? [emp('e1')],
        shifts: input.shifts ?? [],
        rules: input.rules,
        objectives: input.objectives,
    });
}

function stateWith(ctx: ModelContext, pairs: Array<[string, string]>) {
    const state = createState(ctx);
    for (const [employeeId, instanceId] of pairs) assign(state, employeeId, instanceId, []);
    return state;
}

const FULL_TIME: WorkingTimeRules = { contract: { fullTimeWeeklyMinutes: 40 * H } };

describe('contracted hours', function () {
    describe('resolving the contracted week', function () {
        it('takes explicit weekly minutes as they are', function () {
            expect(
                resolveContractedWeeklyMinutes(emp('e', { contract: { kind: 'hours', weeklyMinutes: 30 * H } }), {}),
            ).to.equal(30 * H);
        });

        it('resolves an fte fraction against the full-time week in the rules', function () {
            const half = emp('e', { contract: { kind: 'hours', fte: 0.5 } });
            expect(resolveContractedWeeklyMinutes(half, FULL_TIME)).to.equal(20 * H);
            expect(
                resolveContractedWeeklyMinutes(emp('e', { contract: { kind: 'hours', fte: 0.75 } }), FULL_TIME),
            ).to.equal(30 * H);
        });

        it('falls back to the overtime ordinary week as the full-time baseline', function () {
            const rules: WorkingTimeRules = { overtime: { ordinaryPerWeekMinutes: 38 * H } };
            expect(fullTimeWeeklyMinutes(rules)).to.equal(38 * H);
            expect(resolveContractedWeeklyMinutes(emp('e', { contract: { kind: 'hours', fte: 0.5 } }), rules)).to.equal(
                19 * H,
            );
        });

        it('prefers an explicit contract.fullTimeWeeklyMinutes over the overtime week', function () {
            const rules: WorkingTimeRules = {
                overtime: { ordinaryPerWeekMinutes: 40 * H },
                contract: { fullTimeWeeklyMinutes: 37.5 * H },
            };
            expect(fullTimeWeeklyMinutes(rules)).to.equal(37.5 * H);
        });

        it('explicit weekly minutes win over fte', function () {
            const both = emp('e', { contract: { kind: 'hours', weeklyMinutes: 25 * H, fte: 0.5 } });
            expect(resolveContractedWeeklyMinutes(both, FULL_TIME)).to.equal(25 * H);
        });

        it('rejects an fte with no full-time week rather than guessing one', function () {
            expect(() => ctxFor({ employees: [emp('e1', { contract: { kind: 'hours', fte: 0.5 } })] })).to.throw(
                ScheduleValidationError,
                /no full-time week/,
            );
        });

        it('rejects an fte outside (0, 1]', function () {
            for (const fte of [0, -0.5, 1.5, Number.NaN]) {
                expect(() =>
                    ctxFor({ employees: [emp('e1', { contract: { kind: 'hours', fte } })], rules: FULL_TIME }),
                ).to.throw(ScheduleValidationError, /contract.fte/);
            }
        });

        it('rejects a malformed contract rule', function () {
            expect(() => ctxFor({ rules: { contract: { fullTimeWeeklyMinutes: 0 } } })).to.throw(
                ScheduleValidationError,
                /fullTimeWeeklyMinutes/,
            );
            expect(() => ctxFor({ rules: { contract: { maxOverMinutes: -1 } } })).to.throw(
                ScheduleValidationError,
                /maxOverMinutes/,
            );
            expect(() => ctxFor({ objectives: { contractHoursWeight: -1 } })).to.throw(
                ScheduleValidationError,
                /contractHoursWeight/,
            );
        });

        it('a per-person rule override can carry its own full-time week', function () {
            const ctx = ctxFor({
                employees: [
                    emp('a', { contract: { kind: 'hours', fte: 0.5 } }),
                    emp('b', {
                        contract: { kind: 'hours', fte: 0.5 },
                        rules: { contract: { fullTimeWeeklyMinutes: 36 * H } },
                    }),
                ],
                rules: FULL_TIME,
            });
            expect(ctx.contractedWeeklyMinutes.get('a')).to.equal(20 * H);
            expect(ctx.contractedWeeklyMinutes.get('b')).to.equal(18 * H);
        });

        it('pro-rates the week to the period', function () {
            expect(contractedPeriodMinutes(20 * H, 7)).to.equal(20 * H);
            expect(contractedPeriodMinutes(20 * H, 14)).to.equal(40 * H);
            expect(contractedPeriodMinutes(40 * H, 31)).to.equal(Math.round((40 * H * 31) / 7));
            const ctx = ctxFor({
                period: { startDate: '2026-01-05', endDate: '2026-01-18' },
                employees: [emp('e1', { contract: { kind: 'hours', fte: 0.5 } })],
                rules: FULL_TIME,
            });
            expect(ctx.contractedPeriodMinutes.get('e1')).to.equal(40 * H);
        });
    });

    describe('the rules that read the contracted week', function () {
        it('overtime starts at the fte-derived week, not at full time', function () {
            const rules: WorkingTimeRules = {
                overtime: { ordinaryPerWeekMinutes: 40 * H, requiresConsent: true, compensation: 'timeOff' },
            };
            const shifts = WEEK_DATES.slice(0, 4).map((d, i) => shift(`s${i}`, '08:00', '16:00', [d]));
            const employees = [emp('half', { contract: { kind: 'hours', fte: 0.5 }, overtimeConsent: true })];
            const ctx = ctxFor({ shifts, employees, rules });
            // 4 × 8h = 32h against a 20h week: 12h of overtime.
            const state = stateWith(
                ctx,
                shifts.map((s, i) => ['half', `s${i}@${WEEK_DATES[i]}`] as [string, string]),
            );
            const ledger = overtimeLedger(state);
            expect(ledger).to.have.length(1);
            expect(ledger[0].minutes).to.equal(12 * H);
        });

        it('pro-rata fairness weights a half-timer at half', function () {
            // Two people, fairness on minutes pro rata: 20h + 40h contracted.
            // A 24h/48h split is exactly fair; 36h/36h is not.
            const rules: WorkingTimeRules = {
                ...FULL_TIME,
                fairness: [{ dimension: 'minutes', proRataByContract: true }],
            };
            const dayA = WEEK_DATES.slice(0, 6).map((d, i) => shift(`a${i}`, '06:00', '14:00', [d], { minEmployees: 1 }));
            const dayB = WEEK_DATES.slice(0, 6).map((d, i) => shift(`b${i}`, '15:00', '23:00', [d], { minEmployees: 1 }));
            const employees = [
                emp('half', { contract: { kind: 'hours', fte: 0.5 } }),
                emp('full', { contract: { kind: 'hours', fte: 1 } }),
            ];
            const ctx = ctxFor({ shifts: [...dayA, ...dayB], employees, rules, objectives: { contractHoursWeight: 0 } });

            const proRata = stateWith(ctx, [
                ...dayA.slice(0, 3).map((s, i) => ['half', `a${i}@${WEEK_DATES[i]}`] as [string, string]),
                ...dayA.slice(3).map((s, i) => ['full', `a${i + 3}@${WEEK_DATES[i + 3]}`] as [string, string]),
                ...dayB.map((s, i) => ['full', `b${i}@${WEEK_DATES[i]}`] as [string, string]),
            ]);
            const equal = stateWith(ctx, [
                ...dayA.map((s, i) => ['half', `a${i}@${WEEK_DATES[i]}`] as [string, string]),
                ...dayB.map((s, i) => ['full', `b${i}@${WEEK_DATES[i]}`] as [string, string]),
            ]);
            // Both rosters are fully covered; only the soft level differs.
            const a = scoreLex(ctx, proRata, 'standard', 0);
            const b = scoreLex(ctx, equal, 'standard', 0);
            expect(a.medium).to.equal(b.medium);
            expect(a.soft).to.be.lessThan(b.soft);
        });
    });

    describe('the contract-hours objective', function () {
        const shifts = WEEK_DATES.slice(0, 6).map((d, i) => shift(`s${i}`, '08:00', '16:00', [d], { minEmployees: 1 }));
        const employees = [
            emp('half', { contract: { kind: 'hours', fte: 0.5 } }),
            emp('full', { contract: { kind: 'hours', fte: 1 } }),
        ];

        it('scores distance from the contracted period total, one point per hour by default', function () {
            const ctx = ctxFor({ shifts, employees, rules: FULL_TIME });
            expect(ctx.contractHoursWeight).to.equal(1);
            const empty = createState(ctx);
            // Nobody planned: 20h + 40h short.
            expect(scoreLex(ctx, empty, 'standard', 0).soft).to.equal(60);
            // half on 3 shifts (24h, 4h over), full on 3 (24h, 16h short).
            const state = stateWith(ctx, [
                ['half', `s0@${WEEK_DATES[0]}`],
                ['half', `s1@${WEEK_DATES[1]}`],
                ['half', `s2@${WEEK_DATES[2]}`],
                ['full', `s3@${WEEK_DATES[3]}`],
                ['full', `s4@${WEEK_DATES[4]}`],
                ['full', `s5@${WEEK_DATES[5]}`],
            ]);
            expect(scoreLex(ctx, state, 'standard', 0).soft).to.equal(4 + 16);
        });

        it('is weighted by objectives.contractHoursWeight and off at 0', function () {
            const weighted = ctxFor({ shifts, employees, rules: FULL_TIME, objectives: { contractHoursWeight: 2.5 } });
            expect(scoreLex(weighted, createState(weighted), 'standard', 0).soft).to.equal(150);
            const off = ctxFor({ shifts, employees, rules: FULL_TIME, objectives: { contractHoursWeight: 0 } });
            expect(scoreLex(off, createState(off), 'standard', 0).soft).to.equal(0);
        });

        it('leaves employees without a contract out of the term', function () {
            const ctx = ctxFor({ shifts, employees: [emp('a'), emp('b')] });
            expect(ctx.contractedPeriodMinutes.size).to.equal(0);
            expect(scoreLex(ctx, createState(ctx), 'standard', 0).soft).to.equal(0);
        });

        it('the solver plans a half-timer half the hours of a full-timer', function () {
            // Twelve 8h slots over six days; with the 11h rest floor nobody can
            // hold more than one a day. Three people — one half-time, two
            // full-time — could split them many ways that all cover demand,
            // so what decides the plan is the contract term: 2 + 5 + 5.
            const daily = WEEK_DATES.slice(0, 6).flatMap((d, i) => [
                shift(`m${i}`, '06:00', '14:00', [d], { minEmployees: 1 }),
                shift(`e${i}`, '14:00', '22:00', [d], { minEmployees: 1 }),
            ]);
            const team = [
                emp('half', { contract: { kind: 'hours', fte: 0.5 } }),
                emp('full-a', { contract: { kind: 'hours', fte: 1 } }),
                emp('full-b', { contract: { kind: 'hours', fte: 1 } }),
            ];
            const result = solveSchedule({
                period: WEEK,
                shifts: daily,
                employees: team,
                rules: FULL_TIME,
                timeBudgetMs: 600,
                seed: 7,
            });
            expect(result.stats.unfilledSlots).to.equal(0);
            const byEmployee = new Map(result.contractHours!.map((row) => [row.employeeId, row]));
            const half = byEmployee.get('half')!;
            expect(half.fte).to.equal(0.5);
            expect(half.contractedMinutes).to.equal(20 * H);
            expect(half.plannedMinutes).to.be.within(8 * H, 24 * H);
            for (const id of ['full-a', 'full-b']) {
                const full = byEmployee.get(id)!;
                expect(full.contractedMinutes).to.equal(40 * H);
                expect(full.plannedMinutes).to.be.at.least(32 * H);
                expect(full.plannedMinutes).to.be.greaterThan(half.plannedMinutes);
            }
            expect(half.deltaMinutes).to.equal(half.plannedMinutes - half.contractedMinutes);
        });
    });

    describe('the optional bounds', function () {
        const shifts = WEEK_DATES.slice(0, 4).map((d, i) => shift(`s${i}`, '08:00', '16:00', [d]));
        const pairs = (n: number) =>
            shifts.slice(0, n).map((s, i) => ['half', `s${i}@${WEEK_DATES[i]}`] as [string, string]);
        const half = emp('half', { contract: { kind: 'hours', fte: 0.5 } });

        it('maxOverMinutes caps the period at contract plus the allowance, hard', function () {
            const rules: WorkingTimeRules = { contract: { fullTimeWeeklyMinutes: 40 * H, maxOverMinutes: 4 * H } };
            const ctx = ctxFor({ shifts, employees: [half], rules });
            const contract = ctx.constraints.find((c) => c.id === 'contract')!;
            // 16h held; a third shift makes 24h — within 20h + 4h.
            const two = stateWith(ctx, pairs(2));
            const third = { employeeId: 'half', shiftInstanceId: `s2@${WEEK_DATES[2]}` };
            expect(contract.verdict!(two, third).pass).to.equal(true);
            expect(contract.verdict!(two, third).message).to.match(/24\.0h of 20\.0h contracted/);
            // A fourth makes 32h — over.
            const three = stateWith(ctx, pairs(3));
            const fourth = { employeeId: 'half', shiftInstanceId: `s3@${WEEK_DATES[3]}` };
            const verdict = contract.verdict!(three, fourth);
            expect(verdict.pass).to.equal(false);
            expect(verdict.severity).to.equal('hard');
            expect(verdict.message).to.match(/32\.0h, over their 20\.0h contracted/);
            expect(verdict.required).to.equal(24 * H);
            expect(contract.delta(three, fourth)).to.be.greaterThan(0);
        });

        it('maxOverMinutes: 0 means never over contract', function () {
            const rules: WorkingTimeRules = { contract: { fullTimeWeeklyMinutes: 40 * H, maxOverMinutes: 0 } };
            const ctx = ctxFor({ shifts, employees: [half], rules });
            const report = checkCompliance(
                { period: WEEK, shifts, employees: [half], rules },
                pairs(3).map(([employeeId, shiftInstanceId]) => ({ employeeId, shiftInstanceId, date: '', reasons: [] })),
            );
            expect(report.compliant).to.equal(false);
            expect(report.violations.some((v) => v.constraintId === 'contract' && v.severity === 'hard')).to.equal(true);
            expect(ctx.contractedPeriodMinutes.get('half')).to.equal(20 * H);
        });

        it('without maxOverMinutes, over-contract hours are not a contract breach', function () {
            const report = checkCompliance(
                { period: WEEK, shifts, employees: [half], rules: FULL_TIME },
                pairs(4).map(([employeeId, shiftInstanceId]) => ({ employeeId, shiftInstanceId, date: '', reasons: [] })),
            );
            expect(report.violations.filter((v) => v.constraintId === 'contract')).to.deep.equal([]);
            expect(report.contractHours).to.deep.equal([
                {
                    employeeId: 'half',
                    weeklyMinutes: 20 * H,
                    fte: 0.5,
                    contractedMinutes: 20 * H,
                    plannedMinutes: 32 * H,
                    deltaMinutes: 12 * H,
                },
            ]);
        });

        it('maxUnderMinutes reports a shortfall as a soft violation, never a hard one', function () {
            const rules: WorkingTimeRules = { contract: { fullTimeWeeklyMinutes: 40 * H, maxUnderMinutes: 2 * H } };
            const report = checkCompliance(
                { period: WEEK, shifts, employees: [half], rules },
                pairs(1).map(([employeeId, shiftInstanceId]) => ({ employeeId, shiftInstanceId, date: '', reasons: [] })),
            );
            const shortfall = report.violations.filter((v) => v.constraintId === 'contract');
            expect(shortfall).to.have.length(1);
            expect(shortfall[0].severity).to.equal('soft');
            expect(shortfall[0].message).to.match(/8\.0h against 20\.0h contracted .*\(0\.5 FTE\), 12\.0h short/);
            expect(report.compliant).to.equal(true);

            const within = checkCompliance(
                { period: WEEK, shifts, employees: [half], rules },
                pairs(3).map(([employeeId, shiftInstanceId]) => ({ employeeId, shiftInstanceId, date: '', reasons: [] })),
            );
            expect(within.violations.filter((v) => v.constraintId === 'contract')).to.deep.equal([]);
        });
    });

    describe('summaries and derived fte', function () {
        it('derives fte from explicit weekly minutes when a full-time week is known', function () {
            const shifts = [shift('s0', '08:00', '16:00', [WEEK_DATES[0]])];
            const employees = [emp('e', { contract: { kind: 'hours', weeklyMinutes: 30 * H } })];
            const report = checkCompliance({ period: WEEK, shifts, employees, rules: FULL_TIME }, []);
            expect(report.contractHours[0].fte).to.equal(0.75);
            const noBaseline = checkCompliance({ period: WEEK, shifts, employees }, []);
            expect(noBaseline.contractHours[0].fte).to.equal(undefined);
        });

        it('the solve result carries the same summary, and omits it with no contracts', function () {
            const shifts = [shift('s0', '08:00', '16:00', [WEEK_DATES[0]], { minEmployees: 1 })];
            const withContract = solveSchedule({
                period: WEEK,
                shifts,
                employees: [emp('e', { contract: { kind: 'hours', fte: 0.5 } })],
                rules: FULL_TIME,
                timeBudgetMs: 50,
            });
            expect(withContract.contractHours).to.deep.equal([
                {
                    employeeId: 'e',
                    weeklyMinutes: 20 * H,
                    fte: 0.5,
                    contractedMinutes: 20 * H,
                    plannedMinutes: 8 * H,
                    deltaMinutes: -12 * H,
                },
            ]);
            const without = solveSchedule({ period: WEEK, shifts, employees: [emp('e')], timeBudgetMs: 50 });
            expect(without.contractHours).to.equal(undefined);
        });

        it('rankCandidates prefers the person with contract headroom', function () {
            const shifts = WEEK_DATES.slice(0, 3).map((d, i) => shift(`s${i}`, '08:00', '16:00', [d]));
            const employees = [
                emp('busy', { contract: { kind: 'hours', fte: 0.5 } }),
                emp('spare', { contract: { kind: 'hours', fte: 1 } }),
            ];
            const roster = [0, 1].map((i) => ({
                employeeId: 'busy',
                shiftInstanceId: `s${i}@${WEEK_DATES[i]}`,
                date: WEEK_DATES[i],
                reasons: [],
            }));
            const ranked = rankCandidates(
                { period: WEEK, shifts, employees, rules: FULL_TIME },
                `s2@${WEEK_DATES[2]}`,
                roster,
            );
            expect(ranked.map((c) => c.employeeId)).to.deep.equal(['spare', 'busy']);
            expect(ranked[0].contractDeltaMinutes).to.equal(8 * H - 40 * H);
            expect(ranked[1].contractDeltaMinutes).to.equal(24 * H - 20 * H);
            expect(ranked[1].rationale).to.match(/over contract/);
        });
    });
    describe('filling to contract', function () {
        // Seven daily 8h shifts, one person required on each, no cap on
        // assignees. Minimum cover is 56h; two full-timers are owed 80h.
        const daily = (extra: Partial<ShiftTemplate> = {}) =>
            WEEK_DATES.map((d, i) => shift(`d${i}`, '09:00', '17:00', [d], { minEmployees: 1, ...extra }));
        const team = () => [
            emp('full-a', { contract: { kind: 'hours', fte: 1 } }),
            emp('full-b', { contract: { kind: 'hours', fte: 1 } }),
        ];
        const planned = (result: ReturnType<typeof solveSchedule>) =>
            new Map(result.contractHours!.map((row) => [row.employeeId, row.plannedMinutes]));

        it('plans full-timers to their contracted hours beyond minimum cover when the shift allows it', function () {
            const result = solveSchedule({
                period: WEEK,
                shifts: daily(),
                employees: team(),
                rules: FULL_TIME,
                timeBudgetMs: 300,
                seed: 3,
            });
            expect(result.stats.unfilledSlots).to.equal(0);
            expect(result.violations.filter((v) => v.severity === 'hard')).to.deep.equal([]);
            const hours = planned(result);
            expect(hours.get('full-a')).to.equal(40 * H);
            expect(hours.get('full-b')).to.equal(40 * H);
            // Ten assignments over seven shifts: three days are double-staffed.
            expect(result.assignments).to.have.length(10);
        });

        it('never plans anyone past their contracted total to shrink a deviation', function () {
            // Six 9h shifts and a half-timer on 20h: two of them are 18h, and a
            // third would be 27h — nearer to 20h than 18h is, and still wrong.
            const nine = WEEK_DATES.slice(0, 6).map((d, i) => shift(`n${i}`, '08:00', '17:00', [d], { minEmployees: 1 }));
            const result = solveSchedule({
                period: WEEK,
                shifts: nine,
                employees: [emp('half', { contract: { kind: 'hours', fte: 0.5 } }), ...team()],
                rules: FULL_TIME,
                timeBudgetMs: 200,
                seed: 5,
            });
            const half = result.contractHours!.find((row) => row.employeeId === 'half')!;
            expect(half.plannedMinutes).to.be.at.most(20 * H);

            // Unless the rules already allow a surplus: then the top-up may
            // plan into it, because the employer has said how far over is fine.
            const allowed = solveSchedule({
                period: WEEK,
                shifts: nine,
                employees: [emp('half', { contract: { kind: 'hours', fte: 0.5 } }), ...team()],
                rules: { contract: { fullTimeWeeklyMinutes: 40 * H, maxOverMinutes: 8 * H } },
                timeBudgetMs: 200,
                seed: 5,
            });
            const stretched = allowed.contractHours!.find((row) => row.employeeId === 'half')!;
            expect(stretched.plannedMinutes).to.be.at.most(28 * H);
            expect(stretched.plannedMinutes).to.be.greaterThan(half.plannedMinutes);
        });

        it('never overstaffs past maxEmployees, and never past a hard maxOverMinutes cap', function () {
            const capped = solveSchedule({
                period: WEEK,
                shifts: daily({ maxEmployees: 1 }),
                employees: team(),
                rules: FULL_TIME,
                timeBudgetMs: 200,
                seed: 3,
            });
            expect(capped.assignments).to.have.length(7);

            const noOver = solveSchedule({
                period: WEEK,
                shifts: daily(),
                employees: [emp('half', { contract: { kind: 'hours', fte: 0.5 } }), ...team()],
                rules: { contract: { fullTimeWeeklyMinutes: 40 * H, maxOverMinutes: 0 } },
                timeBudgetMs: 200,
                seed: 3,
            });
            const hours = planned(noOver);
            expect(hours.get('half')).to.be.at.most(20 * H);
            expect(hours.get('full-a')).to.be.at.most(40 * H);
            expect(hours.get('full-b')).to.be.at.most(40 * H);
        });

        it('stops at minimum cover with objectives.fillToContract: false or a zero contract weight', function () {
            for (const objectives of [{ fillToContract: false }, { contractHoursWeight: 0 }]) {
                const result = solveSchedule({
                    period: WEEK,
                    shifts: daily(),
                    employees: team(),
                    rules: FULL_TIME,
                    objectives,
                    timeBudgetMs: 100,
                    seed: 3,
                });
                expect(result.assignments, JSON.stringify(objectives)).to.have.length(7);
            }
        });

        it('fills towards a per-employee minHoursForPeriod floor without a contract', function () {
            const result = solveSchedule({
                period: WEEK,
                shifts: daily(),
                employees: [emp('a', { minHoursForPeriod: 40 }), emp('b', { minHoursForPeriod: 40 })],
                timeBudgetMs: 200,
                seed: 3,
            });
            const byEmployee = new Map<string, number>();
            for (const a of result.assignments) byEmployee.set(a.employeeId, (byEmployee.get(a.employeeId) ?? 0) + 8 * H);
            // A floor, not a target: nobody is left under it, and nothing
            // penalises landing over it.
            expect(byEmployee.get('a')).to.be.at.least(40 * H);
            expect(byEmployee.get('b')).to.be.at.least(40 * H);
        });
    });
});
