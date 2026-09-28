import { expect } from 'chai';
import { rankCandidates, rankShiftsFor, solveSchedule } from '../../src/scheduling';
import type { ScheduleInput } from '../../src/scheduling';

/**
 * `rankShiftsFor` is `rankCandidates` turned on its side: one person, many
 * shifts. A worker's phone asks "which of these open shifts could I take?",
 * and answering that by ranking the whole team once per shift cost one model
 * build and a full team scan per posting. It must be the same judgement, so
 * each answer is checked against the entry the team-wide list gives.
 */

const H = 60;
const dates = Array.from({ length: 14 }, (_, i) => new Date(Date.UTC(2026, 8, 7 + i)).toISOString().slice(0, 10));

const input: ScheduleInput = {
    period: { startDate: dates[0], endDate: dates[13], timeZone: 'Europe/Tallinn' },
    employees: Array.from({ length: 8 }, (_, i) => ({
        id: `e${i}`,
        tags: i % 3 === 0 ? ['lead'] : [],
        timeOff: i === 2 ? [{ date: dates[3] }, { date: dates[4] }] : [],
        contract: { kind: 'hours' as const, weeklyMinutes: (i % 2 ? 20 : 40) * H },
        cost: { hourlyRateCents: 1500 + i * 100 },
        availability: i === 5 ? [{ kind: 'avoid' as const, shiftTypeTags: ['late'] }] : [],
    })),
    shifts: [
        { id: 'early', name: 'Early', startTime: '06:00', endTime: '14:00', dates, minEmployees: 2, maxEmployees: 3, shiftTypeTag: 'early', tagRequirements: { lead: 1 } },
        { id: 'late', name: 'Late', startTime: '14:00', endTime: '22:00', dates, minEmployees: 2, maxEmployees: 3, shiftTypeTag: 'late' },
    ],
    rules: {
        dailyRest: { minMinutes: 11 * H },
        weeklyRest: { minMinutes: 35 * H, windowDays: 7 },
        consecutive: { maxWorkingDays: 5, forbiddenSuccessions: [{ fromTag: 'late', toTag: 'early' }] },
    },
    seed: 3,
    timeBudgetMs: 0,
};

describe('rankShiftsFor', function () {
    const roster = solveSchedule(input).assignments;
    const shifts = dates.flatMap((d) => [`early@${d}`, `late@${d}`]);

    it('gives each shift the same answer the team-wide ranking gives that person', function () {
        let eligible = 0;
        let blocked = 0;
        for (const employee of input.employees) {
            const mine = rankShiftsFor(input, employee.id, shifts, roster);
            for (const candidate of mine) {
                const teamWide = rankCandidates(input, candidate.shiftInstanceId, roster).find(
                    (c) => c.employeeId === employee.id,
                );
                expect(candidate, `${employee.id} on ${candidate.shiftInstanceId}`).to.deep.equal(teamWide);
                if (candidate.eligible) eligible++;
                else blocked++;
            }
        }
        // Both answers occur, so the comparison exercised both.
        expect(eligible).to.be.greaterThan(0);
        expect(blocked).to.be.greaterThan(0);
    });

    it('leaves out shifts the person already holds and ids that name no shift', function () {
        const held = roster.find((a) => a.employeeId === 'e1')!;
        const free = shifts.find((id) => !roster.some((a) => a.employeeId === 'e1' && a.shiftInstanceId === id))!;

        const answer = rankShiftsFor(input, 'e1', [held.shiftInstanceId, 'nope@2026-09-07', free], roster);

        expect(answer.map((c) => c.shiftInstanceId)).to.deep.equal([free]);
    });

    it('answers nothing for somebody the roster does not know', function () {
        expect(rankShiftsFor(input, 'ghost', shifts, roster)).to.deep.equal([]);
    });
});
