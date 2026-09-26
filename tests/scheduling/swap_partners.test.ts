import { expect } from 'chai';
import { checkSwap, explainCandidate, rankSwapPartners } from '../../src/scheduling';
import type { ScheduleInput, ScheduledAssignment } from '../../src/scheduling';

const H = 60;

/**
 * Three people, a day and a night shift, one person per shift.
 *
 * `maxEmployees: 1` is the point: a hand-over is asked about a shift that is
 * already full — the proposer is on it — so any answer computed without taking
 * them off first reads "no room" for everybody.
 */
function input(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    const week = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'];
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-11', timeZone: 'Europe/Berlin' },
        employees: [
            { id: 'anna', tags: [], timeOff: [] },
            { id: 'bo', tags: [], timeOff: [] },
            { id: 'cara', tags: [], timeOff: [] },
        ],
        shifts: [
            { id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', dates: week, maxEmployees: 1 },
            { id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', dates: week, maxEmployees: 1 },
        ],
        rules: { dailyRest: { minMinutes: 11 * H } },
        timeBudgetMs: 0,
        ...overrides,
    };
}

const at = (employeeId: string, shiftInstanceId: string): ScheduledAssignment => ({
    employeeId,
    shiftInstanceId,
    date: shiftInstanceId.slice(shiftInstanceId.indexOf('@') + 1),
    reasons: [],
});

describe('rankSwapPartners', function () {
    it('judges a hand-over with the proposer taken off the shift', function () {
        const roster = [at('anna', 'day@2026-01-06')];
        const partners = rankSwapPartners(input(), 'day@2026-01-06', 'anna', roster);
        expect(partners.map((p) => p.employeeId).sort()).to.deep.equal(['bo', 'cara']);
        expect(partners.every((p) => p.eligible)).to.equal(true);
    });

    it('never lists the proposer', function () {
        const partners = rankSwapPartners(input(), 'day@2026-01-06', 'anna', [at('anna', 'day@2026-01-06')]);
        expect(partners.find((p) => p.employeeId === 'anna')).to.equal(undefined);
    });

    it('carries the reason a colleague cannot take it', function () {
        // Bo works the night before: 22:00–06:00 then 08:00 is 2h of rest.
        const roster = [at('anna', 'day@2026-01-06'), at('bo', 'night@2026-01-05')];
        const bo = rankSwapPartners(input(), 'day@2026-01-06', 'anna', roster).find((p) => p.employeeId === 'bo')!;
        expect(bo.eligible).to.equal(false);
        expect(bo.blockers.map((b) => b.ruleId)).to.include('daily-rest');
    });

    it('lists a trade only when both people can work the other one’s shift', function () {
        const roster = [
            at('anna', 'day@2026-01-06'),
            at('bo', 'day@2026-01-08'),
            // Anna cannot take Bo's night on the 5th: she would have 2h before her own day on the 6th —
            // except that the 6th is the shift she is giving away, so it is legal once she is off it.
            at('bo', 'night@2026-01-05'),
        ];
        const bo = rankSwapPartners(input(), 'day@2026-01-06', 'anna', roster, { trades: true }).find(
            (p) => p.employeeId === 'bo',
        )!;
        // Bo can take the day on the 6th only once he is off the night of the 5th, so the night is a
        // legal trade (both vacated) and the day on the 8th is not (he keeps the night, 2h rest).
        expect(bo.trades!.map((t) => t.shiftInstanceId)).to.deep.equal(['night@2026-01-05']);
    });

    it('drops a trade the proposer could not work', function () {
        const roster = [
            at('anna', 'day@2026-01-06'),
            at('anna', 'day@2026-01-08'),
            // Cara's night on the 7th ends 06:00 on the 8th: Anna has the day at 08:00.
            at('cara', 'night@2026-01-07'),
            at('cara', 'day@2026-01-09'),
        ];
        const cara = rankSwapPartners(input(), 'day@2026-01-06', 'anna', roster, { trades: true }).find(
            (p) => p.employeeId === 'cara',
        )!;
        expect(cara.trades!.map((t) => t.shiftInstanceId)).to.deep.equal(['day@2026-01-09']);
    });

    it('offers only shifts on or after tradesFrom', function () {
        const roster = [at('anna', 'day@2026-01-08'), at('bo', 'day@2026-01-05'), at('bo', 'day@2026-01-09')];
        const bo = rankSwapPartners(input(), 'day@2026-01-08', 'anna', roster, {
            trades: true,
            tradesFrom: '2026-01-06',
        }).find((p) => p.employeeId === 'bo')!;
        expect(bo.trades!.map((t) => t.shiftInstanceId)).to.deep.equal(['day@2026-01-09']);
    });

    it('leaves trades off unless asked', function () {
        const partners = rankSwapPartners(input(), 'day@2026-01-06', 'anna', [at('anna', 'day@2026-01-06')]);
        expect(partners.every((p) => p.trades === undefined)).to.equal(true);
    });

    it('agrees with explainCandidate on the vacated roster', function () {
        const roster = [at('anna', 'day@2026-01-06'), at('bo', 'night@2026-01-05')];
        const bo = rankSwapPartners(input(), 'day@2026-01-06', 'anna', roster).find((p) => p.employeeId === 'bo')!;
        const verdicts = explainCandidate(input(), 'bo', 'day@2026-01-06', roster.slice(1));
        expect(bo.verdicts).to.deep.equal(verdicts);
    });
});

describe('checkSwap', function () {
    it('fits a give-away exactly when the partner is eligible', function () {
        const roster = [at('anna', 'day@2026-01-06'), at('bo', 'night@2026-01-05')];
        const swap = { fromEmployeeId: 'anna', fromShiftInstanceId: 'day@2026-01-06', toShiftInstanceId: null };
        expect(checkSwap(input(), { ...swap, toEmployeeId: 'cara' }, roster).fits).to.equal(true);
        const bo = checkSwap(input(), { ...swap, toEmployeeId: 'bo' }, roster);
        expect(bo.fits).to.equal(false);
        expect(bo.blockers[0]!.employeeId).to.equal('bo');
        expect(bo.blockers[0]!.ruleId).to.equal('daily-rest');
    });

    it('agrees with rankSwapPartners about a trade', function () {
        const roster = [at('anna', 'day@2026-01-06'), at('anna', 'day@2026-01-08'), at('cara', 'night@2026-01-07')];
        const check = checkSwap(
            input(),
            {
                fromEmployeeId: 'anna',
                fromShiftInstanceId: 'day@2026-01-06',
                toEmployeeId: 'cara',
                toShiftInstanceId: 'night@2026-01-07',
            },
            roster,
        );
        expect(check.fits).to.equal(false);
        expect(check.blockers.every((b) => b.employeeId === 'anna')).to.equal(true);
    });

    it('refuses a pair where either person does not hold the shift named', function () {
        const check = checkSwap(
            input(),
            { fromEmployeeId: 'anna', fromShiftInstanceId: 'day@2026-01-06', toEmployeeId: 'bo', toShiftInstanceId: null },
            [],
        );
        expect(check.fits).to.equal(false);
        expect(check.blockers[0]!.ruleId).to.equal('input');
    });
});
