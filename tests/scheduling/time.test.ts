import { expect } from 'chai';
import {
    PeriodClock,
    MINUTES_PER_DAY,
    overlapMinutes,
    overlaps,
    gapBetween,
    daysBetween,
    addDays,
    isoWeekday,
    parseTimeOfDay,
} from '../../src/scheduling/time';
import { ScheduleValidationError } from '../../src/scheduling/types';

// EU transitions: clocks go forward on the last Sunday of March (01:00 UTC) and
// back on the last Sunday of October. In 2026 that is 29 March and 25 October.
const SPRING_FORWARD = '2026-03-29';
const FALL_BACK = '2026-10-25';

describe('Scheduling time model', function () {
    describe('PeriodClock construction', function () {
        it('rejects an unknown time zone', function () {
            expect(() => new PeriodClock('2026-01-05', 7, 'Mars/Olympus_Mons')).to.throw(ScheduleValidationError);
        });

        it('rejects a malformed start date', function () {
            expect(() => new PeriodClock('05-01-2026', 7, 'UTC')).to.throw(ScheduleValidationError);
        });

        it('rejects a non-positive day count', function () {
            expect(() => new PeriodClock('2026-01-05', 0, 'UTC')).to.throw(ScheduleValidationError);
        });

        it('defaults to UTC', function () {
            expect(new PeriodClock('2026-01-05', 7).timeZone).to.equal('UTC');
        });
    });

    describe('day arithmetic without a transition', function () {
        const clock = new PeriodClock('2026-01-05', 7, 'Europe/Berlin');

        it('advances exactly 1440 minutes per day', function () {
            expect(clock.dayStartMinutes(0)).to.equal(0);
            expect(clock.dayStartMinutes(1)).to.equal(MINUTES_PER_DAY);
            expect(clock.dayStartMinutes(3)).to.equal(3 * MINUTES_PER_DAY);
        });

        it('round-trips a wall-clock time to period minutes', function () {
            expect(clock.toPeriodMinutes('2026-01-05', '08:00')).to.equal(480);
            expect(clock.toPeriodMinutes('2026-01-06', '08:00')).to.equal(MINUTES_PER_DAY + 480);
        });

        it('maps a minute back to its date and weekday', function () {
            expect(clock.dateOfMinute(480)).to.equal('2026-01-05');
            expect(clock.dateOfMinute(MINUTES_PER_DAY + 1)).to.equal('2026-01-06');
            expect(clock.weekdayOfMinute(480)).to.equal(1); // 2026-01-05 is a Monday
        });
    });

    describe('DST — the reason this module exists', function () {
        it('makes a spring-forward night one hour shorter', function () {
            const clock = new PeriodClock(SPRING_FORWARD, 2, 'Europe/Berlin');
            // 22:00 the previous evening is outside the period, so measure the
            // transition day itself: local midnight to local midnight is 23h.
            const dayLength = clock.dayStartMinutes(1) - clock.dayStartMinutes(0);
            expect(dayLength).to.equal(23 * 60);
        });

        it('makes a fall-back night one hour longer', function () {
            const clock = new PeriodClock(FALL_BACK, 2, 'Europe/Berlin');
            const dayLength = clock.dayStartMinutes(1) - clock.dayStartMinutes(0);
            expect(dayLength).to.equal(25 * 60);
        });

        it('reports a 22:00-06:00 shift as 7h across the spring transition', function () {
            // Start the period the day before so the shift sits inside it.
            const clock = new PeriodClock('2026-03-28', 3, 'Europe/Berlin');
            const start = clock.toPeriodMinutes('2026-03-28', '22:00');
            const end = clock.toPeriodMinutes('2026-03-29', '06:00');
            expect(end - start).to.equal(7 * 60);
        });

        it('reports a 22:00-06:00 shift as 9h across the autumn transition', function () {
            const clock = new PeriodClock('2026-10-24', 3, 'Europe/Berlin');
            const start = clock.toPeriodMinutes('2026-10-24', '22:00');
            const end = clock.toPeriodMinutes('2026-10-25', '06:00');
            expect(end - start).to.equal(9 * 60);
        });

        it('keeps the same shift at 8h in a zone without the transition', function () {
            const clock = new PeriodClock('2026-03-28', 3, 'UTC');
            const start = clock.toPeriodMinutes('2026-03-28', '22:00');
            const end = clock.toPeriodMinutes('2026-03-29', '06:00');
            expect(end - start).to.equal(8 * 60);
        });

        it('still maps minutes back to the right date across a transition', function () {
            const clock = new PeriodClock('2026-03-28', 4, 'Europe/Berlin');
            for (const date of ['2026-03-28', '2026-03-29', '2026-03-30']) {
                // Use 12:00, which exists on every day including transition days.
                expect(clock.dateOfMinute(clock.toPeriodMinutes(date, '12:00'))).to.equal(date);
            }
        });
    });

    describe('minutesInClockRange', function () {
        const clock = new PeriodClock('2026-01-05', 5, 'UTC');
        const range = (fromDate: string, fromTime: string, toDate: string, toTime: string) => ({
            start: clock.toPeriodMinutes(fromDate, fromTime),
            end: clock.toPeriodMinutes(toDate, toTime),
        });

        it('counts a non-wrapping window', function () {
            const shift = range('2026-01-05', '08:00', '2026-01-05', '16:00');
            expect(clock.minutesInClockRange(shift, { from: '12:00', to: '13:00' })).to.equal(60);
        });

        it('counts a night window that wraps midnight', function () {
            // 22:00-06:00 shift entirely inside a 23:00-06:00 night band = 7h.
            const shift = range('2026-01-05', '22:00', '2026-01-06', '06:00');
            expect(clock.minutesInClockRange(shift, { from: '23:00', to: '06:00' })).to.equal(7 * 60);
        });

        it('counts only the overlapping part of a day shift', function () {
            // 05:00-09:00 against a 23:00-06:00 night band = 1h.
            const shift = range('2026-01-06', '05:00', '2026-01-06', '09:00');
            expect(clock.minutesInClockRange(shift, { from: '23:00', to: '06:00' })).to.equal(60);
        });

        it('returns zero for a shift clear of the window', function () {
            const shift = range('2026-01-05', '08:00', '2026-01-05', '16:00');
            expect(clock.minutesInClockRange(shift, { from: '23:00', to: '06:00' })).to.equal(0);
        });

        it('accumulates across several days for a multi-day range', function () {
            // Three whole days against a 7h night band = 21h.
            const shift = range('2026-01-05', '00:00', '2026-01-08', '00:00');
            expect(clock.minutesInClockRange(shift, { from: '23:00', to: '06:00' })).to.equal(3 * 7 * 60);
        });

        it('returns zero for an empty range', function () {
            const shift = range('2026-01-05', '08:00', '2026-01-05', '08:00');
            expect(clock.minutesInClockRange(shift, { from: '00:00', to: '23:59' })).to.equal(0);
        });
    });

    describe('interval helpers', function () {
        it('computes overlap and disjointness', function () {
            expect(overlapMinutes({ start: 0, end: 100 }, { start: 50, end: 200 })).to.equal(50);
            expect(overlapMinutes({ start: 0, end: 50 }, { start: 50, end: 200 })).to.equal(0);
            expect(overlaps({ start: 0, end: 100 }, { start: 50, end: 200 })).to.equal(true);
            expect(overlaps({ start: 0, end: 50 }, { start: 50, end: 200 })).to.equal(false);
        });

        it('computes the gap in either direction and zero when overlapping', function () {
            expect(gapBetween({ start: 0, end: 100 }, { start: 160, end: 200 })).to.equal(60);
            expect(gapBetween({ start: 160, end: 200 }, { start: 0, end: 100 })).to.equal(60);
            expect(gapBetween({ start: 0, end: 100 }, { start: 50, end: 200 })).to.equal(0);
        });
    });

    describe('date helpers', function () {
        it('counts days between ISO dates in both directions', function () {
            expect(daysBetween('2026-01-05', '2026-01-08')).to.equal(3);
            expect(daysBetween('2026-01-08', '2026-01-05')).to.equal(-3);
        });

        it('adds days across a month boundary', function () {
            expect(addDays('2026-01-30', 3)).to.equal('2026-02-02');
        });

        it('reports ISO weekdays with Sunday as 7', function () {
            expect(isoWeekday('2026-01-05')).to.equal(1);
            expect(isoWeekday('2026-01-11')).to.equal(7);
        });

        it('parses times of day and rejects nonsense', function () {
            expect(parseTimeOfDay('08:30', 'x')).to.equal(510);
            expect(parseTimeOfDay('24:00', 'x')).to.equal(1440);
            expect(() => parseTimeOfDay('25:00', 'x')).to.throw(ScheduleValidationError);
            expect(() => parseTimeOfDay('08:60', 'x')).to.throw(ScheduleValidationError);
            expect(() => parseTimeOfDay('noon', 'x')).to.throw(ScheduleValidationError);
        });
    });
});
