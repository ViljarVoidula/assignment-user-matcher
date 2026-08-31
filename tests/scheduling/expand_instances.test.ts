import { expect } from 'chai';
import { expandShiftInstances, PeriodClock } from '../../src/scheduling';
import type { ScheduleInput } from '../../src/scheduling';

const H = 60;

/**
 * A host that draws a planning grid needs the same dated occurrences the engine
 * judges — ids included. Re-deriving `<templateId>@<date>` in the host is how a
 * grid ends up addressing cells the engine has never heard of, so the expansion
 * is public.
 */
describe('expandShiftInstances', () => {
    function input(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
        return {
            period: { startDate: '2026-09-01', endDate: '2026-09-07', timeZone: 'Europe/Tallinn' },
            employees: [{ id: 'anna', tags: ['support'], timeOff: [] }],
            shifts: [
                {
                    id: 'day',
                    name: 'Day',
                    startTime: '08:00',
                    endTime: '16:00',
                    daysOfWeek: [1, 2, 3, 4, 5],
                    minEmployees: 3,
                    tagRequirements: { support: 2 },
                    unpaidBreakMinutes: 30,
                },
                { id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', daysOfWeek: [1, 2, 3, 4, 5] },
            ],
            ...overrides,
        };
    }

    it('expands every template into dated instances with engine-identical ids', () => {
        const instances = expandShiftInstances(input());

        // Mon 2026-08-31 is outside the period; the week starts Tue 1 Sep.
        expect(instances.filter((i) => i.templateId === 'day').map((i) => i.id)).to.deep.equal([
            'day@2026-09-01',
            'day@2026-09-02',
            'day@2026-09-03',
            'day@2026-09-04',
            'day@2026-09-07',
        ]);
    });

    it('carries the staffing shape a grid renders empty slots from', () => {
        const day = expandShiftInstances(input()).find((i) => i.id === 'day@2026-09-01');

        expect(day).to.include({ minEmployees: 3, durationMinutes: 8 * H, workingMinutes: 7.5 * H });
        expect(day?.tagRequirements).to.deep.equal({ support: 2 });
    });

    it('resolves wall-clock through the period clock, so an overnight shift spans midnight', () => {
        const night = expandShiftInstances(input()).find((i) => i.id === 'night@2026-09-01');
        const clock = new PeriodClock('2026-09-01', 7, 'Europe/Tallinn');

        expect(night?.durationMinutes).to.equal(8 * H);
        expect(clock.toISOString(night!.endMinute)).to.contain('2026-09-02');
    });

    it('rejects a malformed template rather than expanding a wrong grid', () => {
        expect(() =>
            expandShiftInstances(input({ shifts: [{ id: 'bad', name: 'Bad', startTime: '08:00', endTime: '99:00' }] })),
        ).to.throw();
    });
});
