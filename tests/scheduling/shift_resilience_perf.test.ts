import { expect } from 'chai';
import { assessShiftResilience, type ScheduleInput, type ScheduledAssignment } from '../../src/scheduling';

describe('assessShiftResilience performance', () => {
    const site = (full: boolean) => {
        const dates = ['2026-01-06', '2026-01-07', '2026-01-08'];
        const employees = Array.from({ length: 200 }, (_, i) => ({
            id: `e${i}`,
            tags: i % 5 === 0 ? ['picker', 'forklift'] : ['picker'],
            timeOff: [],
        }));
        const shifts = ['06:00-14:00', '14:00-22:00', '22:00-06:00'].map((span, i) => {
            const [startTime, endTime] = span.split('-');
            return {
                id: `s${i}`,
                name: `S${i}`,
                startTime,
                endTime,
                dates,
                minEmployees: 50,
                tagRequirements: { forklift: 5 },
                ...(full ? { maxEmployees: 50, tagMaximums: { forklift: 12 } } : {}),
            };
        });
        const input = {
            period: { startDate: '2026-01-05', endDate: '2026-01-11', timeZone: 'Europe/Tallinn' },
            employees,
            shifts,
            timeBudgetMs: 0,
        } as unknown as ScheduleInput;
        const roster: ScheduledAssignment[] = [];
        dates.forEach((date, d) =>
            shifts.forEach((s, si) => {
                for (let k = 0; k < 50; k++) {
                    const e = (si * 60 + k + d * 7) % 200;
                    roster.push({ employeeId: `e${e}`, shiftInstanceId: `${s.id}@${date}`, date, reasons: [] });
                }
            }),
        );
        return { input, roster };
    };

    it('assesses 72 h of a 200-person site in under 500 ms', function () {
        this.timeout(5000);
        const { input, roster } = site(false);
        const started = Date.now();
        const result = assessShiftResilience(input, roster);
        expect(result).to.have.length(9);
        expect(Date.now() - started).to.be.below(500);
    });

    it('stays under 500 ms when every shift is full and a seat has to be vacated', function () {
        this.timeout(5000);
        const { input, roster } = site(true);
        const started = Date.now();
        const result = assessShiftResilience(input, roster);
        expect(result).to.have.length(9);
        expect(result.every((s) => s.backups > 0)).to.equal(true);
        expect(Date.now() - started).to.be.below(500);
    });
});
