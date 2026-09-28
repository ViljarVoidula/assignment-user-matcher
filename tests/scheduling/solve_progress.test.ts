import { expect } from 'chai';
import { diagnoseInfeasibility, solveSchedule } from '../../src/scheduling';
import type { ScheduleInput, SearchProgress } from '../../src/scheduling';

/**
 * What a person waiting on a solve can be told, and what they can do about it:
 * cheap counts as the search runs, stopping it once the draft is good enough,
 * and — when a shift stays empty — whether anybody could have worked it at all.
 */

const H = 60;
const days = (from: string, n: number) =>
    Array.from({ length: n }, (_, i) => new Date(Date.parse(`${from}T00:00:00Z`) + i * 86_400_000).toISOString().slice(0, 10));

const week: ScheduleInput = {
    period: { startDate: '2026-09-07', endDate: '2026-09-20' },
    employees: Array.from({ length: 10 }, (_, i) => ({ id: `e${i}`, tags: [], timeOff: [] })),
    shifts: [
        { id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', minEmployees: 3, maxEmployees: 4 },
        { id: 'late', name: 'Late', startTime: '14:00', endTime: '22:00', minEmployees: 2 },
    ],
    rules: { dailyRest: { minMinutes: 11 * H }, fairness: [{ dimension: 'minutes', weight: 1 }] },
    objective: 'balanced',
    seed: 5,
};

describe('solve progress', function () {
    it('reports the first draft once, then every round, about the best roster so far', function () {
        const reports: SearchProgress[] = [];
        const result = solveSchedule({ ...week, maxIterations: 6, timeBudgetMs: 60_000, onSearch: (p) => reports.push(p) });

        expect(reports[0].phase).to.equal('draft');
        expect(reports.filter((r) => r.phase === 'draft')).to.have.length(1);
        expect(reports.slice(1).every((r) => r.phase === 'improving')).to.equal(true);
        expect(reports).to.have.length(7);
        const last = reports[reports.length - 1];
        expect(last.assigned).to.equal(result.assignments.length);
        expect(last.unfilledSlots).to.equal(result.stats.unfilledSlots);
        expect(last.evaluatedVariants).to.equal(result.stats.evaluatedVariants);
    });

    it('stops the search when asked and returns the best complete roster so far', function () {
        let rounds = 0;
        const started = Date.now();
        const result = solveSchedule({
            ...week,
            timeBudgetMs: 60_000,
            onSearch: (p) => {
                if (p.phase === 'improving') rounds++;
            },
            shouldStop: () => rounds >= 2,
        });

        expect(Date.now() - started).to.be.lessThan(10_000);
        expect(rounds).to.equal(2);
        expect(result.stats.unfilledSlots).to.equal(0);
        expect(result.violations.filter((v) => v.severity === 'hard')).to.deep.equal([]);
    });

    it('keeps the first draft when asked to stop before the search begins', function () {
        const drafted = solveSchedule({ ...week, timeBudgetMs: 0 });
        const stopped = solveSchedule({ ...week, timeBudgetMs: 60_000, shouldStop: () => true });
        expect(stopped.assignments).to.deep.equal(drafted.assignments);
    });
});

describe('diagnoseInfeasibility: shifts nobody may lawfully work', function () {
    // Clocks go back at 04:00 on 25 Oct 2026 in Tallinn, so 22:00–06:00 that
    // night is 9 real hours — 8.5 worked — against an 8-hour cap.
    const clockChange: ScheduleInput = {
        period: { startDate: '2026-10-23', endDate: '2026-10-26', timeZone: 'Europe/Tallinn' },
        employees: Array.from({ length: 6 }, (_, i) => ({ id: `e${i}`, tags: [], timeOff: [] })),
        shifts: [
            {
                id: 'night',
                name: 'Night',
                startTime: '22:00',
                endTime: '06:00',
                unpaidBreakMinutes: 30,
                minEmployees: 2,
                dates: days('2026-10-23', 4),
            },
        ],
        rules: { workingTime: { maxPerDayMinutes: 8 * H } },
    };

    it('names the clock-change night, and the rule that stops everybody', function () {
        const report = diagnoseInfeasibility(clockChange);
        const findings = report.findings.filter((f) => f.kind === 'noLawfulEmployee');

        expect(report.feasible).to.equal(false);
        expect(findings.map((f) => f.shiftInstanceId)).to.deep.equal(['night@2026-10-24']);
        const [night] = findings;
        expect(night.durationMinutes).to.equal(9 * H);
        expect(night.workingMinutes).to.equal(8.5 * H);
        expect(night.blockers![0]).to.include({ ruleId: 'rolling-hours', employees: 6, required: 8 * H });
    });

    it('stays quiet about shifts somebody can work', function () {
        const plain = { ...clockChange, period: { ...clockChange.period, timeZone: 'UTC' } };
        const report = diagnoseInfeasibility(plain);
        expect(report.findings.filter((f) => f.kind === 'noLawfulEmployee')).to.deep.equal([]);
        expect(report.feasible).to.equal(true);
    });
});
