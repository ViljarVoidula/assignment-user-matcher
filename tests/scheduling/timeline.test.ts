import { expect } from 'chai';
import { PersonTimeline, TimelineIndex, type TimelineEntry } from '../../src/scheduling/engine/timeline';

const H = 60;
const DAY = 24 * H;

/** A shift entry from `startHour` for `hours`, counting fully as working time. */
function shift(id: string, startHour: number, hours: number, tag?: string): TimelineEntry {
    return { id, start: startHour * H, end: (startHour + hours) * H, workingMinutes: hours * H, tag };
}

describe('Scheduling person timeline', function () {
    describe('working minutes in a window', function () {
        it('sums entries fully inside the window', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            t.add(shift('b', 32, 8));
            expect(t.workingMinutesIn({ start: 0, end: 2 * DAY })).to.equal(16 * H);
        });

        it('prorates an entry straddling the window edge', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8)); // 08:00-16:00
            // Window ends at 12:00, so half the shift is inside.
            expect(t.workingMinutesIn({ start: 0, end: 12 * H })).to.equal(4 * H);
        });

        it('prorates a standby duty by its working fraction, not its span', function () {
            const t = new PersonTimeline();
            // A 12h standby span that counts as 3h of working time.
            t.add({ id: 'standby', start: 0, end: 12 * H, workingMinutes: 3 * H });
            // Half the span inside the window contributes half the working time.
            expect(t.workingMinutesIn({ start: 0, end: 6 * H })).to.equal(1.5 * H);
        });

        it('returns zero for an empty or inverted window', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            expect(t.workingMinutesIn({ start: 100, end: 100 })).to.equal(0);
            expect(t.workingMinutesIn({ start: 500, end: 100 })).to.equal(0);
        });

        it('excludes entries wholly outside the window', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            expect(t.workingMinutesIn({ start: 3 * DAY, end: 4 * DAY })).to.equal(0);
        });

        it('tracks the running total across add and remove', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            t.add(shift('b', 32, 8));
            expect(t.totalWorkingMinutes()).to.equal(16 * H);
            expect(t.remove('b')).to.equal(true);
            expect(t.totalWorkingMinutes()).to.equal(8 * H);
            expect(t.remove('nope')).to.equal(false);
        });
    });

    describe('rest', function () {
        it('measures the longest free stretch between two shifts', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8)); // ends 16:00
            t.add(shift('b', 32, 8)); // starts 08:00 next day
            expect(t.longestRestIn({ start: 0, end: 2 * DAY })).to.equal(16 * H);
        });

        it('counts free time at the window edges', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            // Nothing after 16:00, so the tail of a 3-day window is the longest rest.
            expect(t.longestRestIn({ start: 0, end: 3 * DAY })).to.equal(3 * DAY - 16 * H);
        });

        it('treats an empty window as entirely rest', function () {
            const t = new PersonTimeline();
            expect(t.longestRestIn({ start: 0, end: 7 * DAY })).to.equal(7 * DAY);
        });

        it('is not fooled by overlapping entries', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8)); // 08:00-16:00
            t.add(shift('b', 12, 8)); // 12:00-20:00, overlaps
            // The two merge into one busy block 08:00-20:00, leaving an 8h
            // lead-in and a 4h tail — no phantom gap between them.
            expect(t.longestRestIn({ start: 0, end: DAY })).to.equal(8 * H);
        });

        it('reports the smallest gap around a candidate range', function () {
            const t = new PersonTimeline();
            t.add(shift('night', 22, 8)); // 22:00-06:00 next day
            // A shift starting 08:00 next day leaves a 2h gap.
            expect(t.minGapAround({ start: 32 * H, end: 40 * H })).to.equal(2 * H);
        });

        it('returns Infinity when nothing else is scheduled', function () {
            const t = new PersonTimeline();
            expect(t.minGapAround({ start: 0, end: H })).to.equal(Infinity);
        });

        it('returns zero when the candidate overlaps an entry', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            expect(t.minGapAround({ start: 10 * H, end: 12 * H })).to.equal(0);
        });

        it('can exclude an entry, so re-evaluating a placed shift ignores itself', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            expect(t.minGapAround({ start: 8 * H, end: 16 * H }, 'a')).to.equal(Infinity);
        });
    });

    describe('counting and runs', function () {
        it('counts entries in a window, optionally filtered', function () {
            const t = new PersonTimeline();
            t.add(shift('n1', 22, 8, 'night'));
            t.add(shift('d1', 56, 8, 'day'));
            t.add(shift('n2', 70, 8, 'night'));
            const window = { start: 0, end: 5 * DAY };
            expect(t.countIn(window)).to.equal(3);
            expect(t.countIn(window, (e) => e.tag === 'night')).to.equal(2);
        });

        it('measures the longest run of consecutive matching entries', function () {
            const t = new PersonTimeline();
            t.add(shift('n1', 22, 8, 'night'));
            t.add(shift('n2', 46, 8, 'night'));
            t.add(shift('d1', 80, 8, 'day')); // breaks the run
            t.add(shift('n3', 104, 8, 'night'));
            expect(t.longestRun((e) => e.tag === 'night')).to.equal(2);
        });

        it('measures the longest run of consecutive working days', function () {
            const t = new PersonTimeline();
            const dayIndexOf = (minute: number) => Math.floor(minute / DAY);
            for (const day of [0, 1, 2, 4, 5]) t.add(shift(`d${day}`, day * 24 + 8, 8));
            expect(t.longestConsecutiveDays(dayIndexOf)).to.equal(3);
        });

        it('counts a single working day as a run of one', function () {
            const t = new PersonTimeline();
            t.add(shift('a', 8, 8));
            expect(t.longestConsecutiveDays((m) => Math.floor(m / DAY))).to.equal(1);
            expect(new PersonTimeline().longestConsecutiveDays((m) => Math.floor(m / DAY))).to.equal(0);
        });
    });

    describe('history', function () {
        it('seeds entries at negative minutes so windows straddle the period boundary', function () {
            // Previous period: a night shift ending 06:00 on day 0.
            const t = new PersonTimeline([{ id: 'prev', start: -2 * H, end: 6 * H, workingMinutes: 8 * H }]);
            // A shift starting 08:00 on day 0 leaves only 2h rest.
            expect(t.minGapAround({ start: 8 * H, end: 16 * H })).to.equal(2 * H);
        });

        it('counts historical working minutes in a window', function () {
            const t = new PersonTimeline([{ id: 'prev', start: -DAY, end: -DAY + 8 * H, workingMinutes: 8 * H }]);
            expect(t.workingMinutesIn({ start: -2 * DAY, end: DAY })).to.equal(8 * H);
        });

        it('refuses to remove a historical entry', function () {
            const t = new PersonTimeline([{ id: 'prev', start: -DAY, end: -DAY + 8 * H, workingMinutes: 8 * H }]);
            expect(t.remove('prev')).to.equal(false);
            expect(t.has('prev')).to.equal(true);
        });
    });

    describe('TimelineIndex', function () {
        it('creates timelines on demand and keeps people separate', function () {
            const index = new TimelineIndex();
            index.add('alice', shift('a', 8, 8));
            index.add('bob', shift('b', 8, 8));
            index.add('alice', shift('c', 32, 8));
            expect(index.for('alice').totalWorkingMinutes()).to.equal(16 * H);
            expect(index.for('bob').totalWorkingMinutes()).to.equal(8 * H);
            expect(index.personIds().sort()).to.deep.equal(['alice', 'bob']);
        });

        it('aggregates two contracts of the same person onto one timeline (C-585/19)', function () {
            // Two employee records, one natural person: the rest gap must be
            // measured across both, not per contract.
            const index = new TimelineIndex();
            index.add('person-1', shift('contract-a-night', 22, 8)); // ends 06:00
            index.add('person-1', shift('contract-b-morning', 32, 8)); // starts 08:00
            expect(index.for('person-1').minGapAround({ start: 32 * H, end: 40 * H }, 'contract-b-morning')).to.equal(
                2 * H,
            );
        });

        it('seeds per-person history', function () {
            const index = new TimelineIndex(
                new Map([['alice', [{ id: 'prev', start: -2 * H, end: 6 * H, workingMinutes: 8 * H }]]]),
            );
            expect(index.for('alice').minGapAround({ start: 8 * H, end: 16 * H })).to.equal(2 * H);
            expect(index.for('bob').totalWorkingMinutes()).to.equal(0);
        });
    });
});
