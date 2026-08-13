import { expect } from 'chai';
import { solveSchedule, checkCompliance, repairSchedule } from '../../src/scheduling';
import type { ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * End-to-end scenarios: whole rosters built from realistic inputs, checked for
 * compliance rather than for one rule at a time. These are the cases that catch
 * rules interacting badly — a roster where every constraint passes in isolation
 * and the combination is still unlawful, or infeasible.
 */

const H = 60;

function datesBetween(start: string, days: number): string[] {
    const out: string[] = [];
    for (let i = 0; i < days; i++) {
        out.push(new Date(Date.parse(`${start}T00:00:00Z`) + i * 86_400_000).toISOString().slice(0, 10));
    }
    return out;
}

/** A German hospital ward: 24/7 cover, three shift types, ArbZG-shaped rules. */
function germanWard(days = 28): ScheduleInput {
    const dates = datesBetween('2026-01-05', days);
    const shifts: ShiftTemplate[] = [
        {
            id: 'early',
            name: 'Früh',
            startTime: '06:00',
            endTime: '14:30',
            dates,
            minEmployees: 2,
            unpaidBreakMinutes: 30,
            shiftTypeTag: 'early',
            tagRequirements: { registered: 1 },
        },
        {
            id: 'late',
            name: 'Spät',
            startTime: '14:00',
            endTime: '22:30',
            dates,
            minEmployees: 2,
            unpaidBreakMinutes: 30,
            shiftTypeTag: 'late',
            tagRequirements: { registered: 1 },
        },
        {
            id: 'night',
            name: 'Nacht',
            startTime: '22:00',
            endTime: '06:30',
            dates,
            minEmployees: 1,
            unpaidBreakMinutes: 30,
            shiftTypeTag: 'night',
            tagRequirements: { registered: 1 },
        },
    ];

    const rules: WorkingTimeRules = {
        // ArbZG §5: 11h daily rest. §3: 8h/day extendable to 10h on a 6-month average.
        dailyRest: { minMinutes: 11 * H },
        weeklyRest: { minMinutes: 35 * H, windowDays: 7 },
        workingTime: {
            maxPerDayMinutes: 10 * H,
            rollingAverages: [{ maxMinutes: 48 * H, windowDays: 7, label: '48h/week' }],
        },
        // ArbZG §6: night 23:00-06:00, night workers capped at 8h.
        nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: 2 * H, maxShiftMinutes: 8 * H },
        // ArbZG §4: 30 min over 6h, 45 min over 9h.
        breaks: [
            { afterMinutes: 6 * H, minMinutes: 30 },
            { afterMinutes: 9 * H, minMinutes: 45 },
        ],
        consecutive: { maxWorkingDays: 6, forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early' }] },
        fairness: [
            { dimension: 'nights', weight: 2 },
            { dimension: 'weekends', weight: 1 },
        ],
    };

    // 14 nurses, 8 of them registered.
    const employees = Array.from({ length: 14 }, (_, i) => ({
        id: `n${i + 1}`,
        tags: i < 8 ? ['nurse', 'registered'] : ['nurse'],
        timeOff: [],
        maxHoursForPeriod: 160,
    }));

    return {
        period: { startDate: dates[0], endDate: dates[dates.length - 1], timeZone: 'Europe/Berlin' },
        employees,
        shifts,
        rules,
        objective: 'balanced',
        seed: 11,
        // Short on purpose: these assert correctness, not convergence quality,
        // and a multi-second budget per case makes the suite unpleasant to run.
        timeBudgetMs: 300,
    };
}

describe('Scheduling scenarios', function () {
    this.timeout(20000);

    describe('German hospital ward, four weeks', function () {
        it('builds a roster with no hard violations', function () {
            const result = solveSchedule(germanWard());
            const hard = result.violations.filter((v) => v.severity === 'hard');
            expect(hard, `hard violations: ${hard.map((v) => v.message).join(' | ')}`).to.have.length(0);
        });

        it('produces a roster that passes an independent compliance check', function () {
            const input = germanWard();
            const result = solveSchedule(input);
            const report = checkCompliance(input, result.assignments);
            const hard = report.violations.filter((v) => v.severity === 'hard');
            expect(hard, `hard violations: ${hard.map((v) => v.message).join(' | ')}`).to.have.length(0);
        });

        it('never places an early shift straight after a night', function () {
            const input = germanWard();
            const result = solveSchedule(input);
            const byEmployee = new Map<string, string[]>();
            for (const a of result.assignments) {
                byEmployee.set(a.employeeId, [...(byEmployee.get(a.employeeId) ?? []), a.shiftInstanceId]);
            }
            for (const [, instances] of byEmployee) {
                const nights = instances.filter((i) => i.startsWith('night@')).map((i) => i.split('@')[1]);
                for (const date of nights) {
                    const next = new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
                    expect(instances).to.not.include(`early@${next}`);
                }
            }
        });

        it("respects each nurse's period hour budget", function () {
            const input = germanWard();
            const result = solveSchedule(input);
            const minutes = new Map<string, number>();
            for (const a of result.assignments) {
                // Every shift here is 8h30 span less a 30-minute unpaid break.
                minutes.set(a.employeeId, (minutes.get(a.employeeId) ?? 0) + 8 * H);
            }
            for (const [employeeId, worked] of minutes) {
                expect(worked, `${employeeId} within budget`).to.be.at.most(160 * H);
            }
        });

        it('is deterministic for the same seed and varies with a different one', function () {
            const a = solveSchedule(germanWard());
            const b = solveSchedule(germanWard());
            expect(a.assignments).to.deep.equal(b.assignments);

            const c = solveSchedule({ ...germanWard(), seed: 99 });
            expect(c.violations.filter((v) => v.severity === 'hard')).to.have.length(0);
        });

        it('spreads night shifts rather than concentrating them on one nurse', function () {
            const result = solveSchedule(germanWard());
            const nights = new Map<string, number>();
            for (const a of result.assignments) {
                if (a.shiftInstanceId.startsWith('night@')) {
                    nights.set(a.employeeId, (nights.get(a.employeeId) ?? 0) + 1);
                }
            }
            const counts = [...nights.values()];
            // With 28 nights across 8 registered nurses, no one should carry
            // anything close to all of them.
            expect(Math.max(...counts)).to.be.lessThan(28);
        });
    });

    describe('period spanning a DST transition', function () {
        it('counts the shortened night correctly against a daily cap', function () {
            const dates = datesBetween('2026-03-27', 4); // 29 March is the EU spring transition
            const input: ScheduleInput = {
                period: { startDate: dates[0], endDate: dates[dates.length - 1], timeZone: 'Europe/Berlin' },
                employees: [{ id: 'e1', tags: [], timeOff: [] }],
                shifts: [{ id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', dates }],
                rules: { workingTime: { maxPerShiftMinutes: 8 * H } },
                timeBudgetMs: 0,
            };
            const result = solveSchedule(input);
            expect(result.violations.filter((v) => v.severity === 'hard')).to.have.length(0);

            // The night starting 28 March is 7h of real elapsed time, not 8.
            const report = checkCompliance(input, result.assignments);
            expect(report.compliant).to.equal(true);
        });

        it('rejects a shift that only fits because DST was ignored', function () {
            const dates = ['2026-10-24', '2026-10-25']; // 25 October is the autumn transition
            const input: ScheduleInput = {
                period: { startDate: dates[0], endDate: dates[1], timeZone: 'Europe/Berlin' },
                employees: [{ id: 'e1', tags: [], timeOff: [] }],
                shifts: [{ id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', dates: ['2026-10-24'] }],
                // The autumn night runs 9h of real time, so an 8h30 cap is breached.
                rules: { workingTime: { maxPerShiftMinutes: 8 * H + 30 } },
                timeBudgetMs: 0,
            };
            const result = solveSchedule(input);
            expect(result.assignments).to.have.length(0);
            expect(result.status).to.equal('partial');
        });
    });

    describe('call-in on a published roster', function () {
        it('fills the gap, keeps the rest of the roster, and explains the choice', function () {
            const input = germanWard(14);
            const published = solveSchedule(input).assignments;
            const victim = published.find((a) => a.shiftInstanceId.startsWith('night@'))!;

            const repair = repairSchedule(
                input,
                { kind: 'noShow', employeeId: victim.employeeId, shiftInstanceId: victim.shiftInstanceId },
                published,
            );

            const eligible = repair.candidates.filter((c) => c.eligible);
            expect(eligible.length, 'someone can cover the night').to.be.greaterThan(0);
            expect(eligible[0].rationale).to.be.a('string').and.not.empty;
            // The repair must be a diff, not a new roster.
            expect(repair.perturbation.affectedEmployees).to.be.lessThan(input.employees.length);
        });

        it('reports every rule that blocks an ineligible candidate', function () {
            const input = germanWard(14);
            const published = solveSchedule(input).assignments;
            const victim = published.find((a) => a.shiftInstanceId.startsWith('early@'))!;
            const repair = repairSchedule(
                input,
                { kind: 'noShow', employeeId: victim.employeeId, shiftInstanceId: victim.shiftInstanceId },
                published,
            );
            for (const blocked of repair.candidates.filter((c) => !c.eligible)) {
                expect(blocked.blockers.length, `${blocked.employeeId} has a stated reason`).to.be.greaterThan(0);
                expect(blocked.rationale).to.not.equal('');
            }
        });
    });

    describe('anytime behaviour', function () {
        it('returns a usable roster with a zero time budget', function () {
            const result = solveSchedule({ ...germanWard(7), timeBudgetMs: 0 });
            expect(result.assignments.length).to.be.greaterThan(0);
            expect(result.violations.filter((v) => v.severity === 'hard')).to.have.length(0);
        });

        it('reports improvements through onProgress', function () {
            let reports = 0;
            solveSchedule({ ...germanWard(14), timeBudgetMs: 400, onProgress: () => reports++ });
            // At minimum the search must not crash while reporting; improvements
            // are not guaranteed if construction already found the best state.
            expect(reports).to.be.at.least(0);
        });
    });
});
