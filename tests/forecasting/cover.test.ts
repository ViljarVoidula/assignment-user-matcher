import { expect } from 'chai';
import * as forecasting from '../../src/forecasting';
import { HOUR_MS } from '../../src/forecasting/calendar';
import { coverNeed, coverPersonHours } from '../../src/forecasting/cover';
import { staffingBudgetMs } from '../../src/forecasting/staffing';

describe('forecasting cover and surface', () => {
    it('exports its public surface from the subpath', () => {
        for (const name of [
            'forecastWorkspace',
            'staffingNeed',
            'staffingBudgetMs',
            'applyNowcast',
            'coverNeed',
            'coverPersonHours',
            'suggestEffect',
            'erlangA',
        ]) {
            expect(forecasting).to.have.property(name).that.is.a('function');
        }
        // Validation-only helpers stay off the subpath.
        expect(forecasting).not.to.have.property('erlangAAbandonment');
    });

    it('covers hourly need with the fewest heads on the day’s shifts, floor and ceiling kept', () => {
        const h = (n: number) => n * HOUR_MS;
        const shifts = [
            { id: 'early', startMs: h(6), endMs: h(14), min: 1 },
            { id: 'late', startMs: h(14), endMs: h(22), min: 1, max: 2 },
            { id: 'mid', startMs: h(10), endMs: h(18), min: 0 },
        ];
        const need = [
            { at: h(8), people: 2 },
            { at: h(12), people: 3 },
            { at: h(16), people: 4 },
            { at: h(23), people: 1 },
        ];
        const result = coverNeed(need, shifts);
        // 8am: early → 2. 12pm: mid (ends latest of early/mid) → 1. 4pm: late ×2 (cap), then mid → 2.
        expect(result.counts).to.deep.equal({ early: 2, late: 2, mid: 2 });
        expect(result.unmet).to.deep.equal([{ at: h(23), short: 1, reason: 'no-shift', atMax: [] }]);
        expect(coverNeed([{ at: h(8), people: 0 }], shifts).counts).to.deep.equal({ early: 1, late: 1, mid: 0 });
    });

    it('caps counts at a shift’s max and reports the rest of the hour’s need as unmet, at max', () => {
        const h = (n: number) => n * HOUR_MS;
        const shifts = [{ id: 'late', startMs: h(14), endMs: h(22), min: 0, max: 2 }];
        const result = coverNeed([{ at: h(16), people: 3 }], shifts);
        expect(result.counts).to.deep.equal({ late: 2 });
        expect(result.unmet).to.deep.equal([{ at: h(16), short: 1, reason: 'at-max', atMax: ['late'] }]);
        // No shift overlaps the hour at all.
        expect(coverNeed([{ at: h(3), people: 2 }], shifts).unmet).to.deep.equal([
            { at: h(3), short: 2, reason: 'no-shift', atMax: [] },
        ]);
        // `max: null` is no ceiling (unlike the scheduler, where an unstated maximum is no room).
        expect(coverNeed([{ at: h(16), people: 5 }], [{ ...shifts[0], max: null }])).to.deep.equal({
            counts: { late: 5 },
            unmet: [],
        });
    });

    it('reads need in time order and rounds a fractional need up', () => {
        const h = (n: number) => n * HOUR_MS;
        const shifts = [
            { id: 'a', startMs: h(0), endMs: h(8), min: 0 },
            { id: 'b', startMs: h(4), endMs: h(12), min: 0 },
        ];
        // Given out of order: hour 2 (only a covers it) must be read before hour 6.
        const result = coverNeed(
            [
                { at: h(6), people: 2.2 },
                { at: h(2), people: 1 },
            ],
            shifts,
        );
        expect(result.counts).to.deep.equal({ a: 1, b: 2 });
        expect(result.unmet).to.deep.equal([]);
    });

    it('spreads person-hours over the day’s shifts, longest first', () => {
        const h = (n: number) => n * HOUR_MS;
        const shifts = [
            { id: 'long', startMs: h(6), endMs: h(16), min: 0, max: 1 },
            { id: 'short', startMs: h(16), endMs: h(20), min: 0 },
        ];
        expect(coverPersonHours(18, shifts)).to.deep.equal({ counts: { long: 1, short: 2 }, unmet: [] });
        expect(coverPersonHours(10, [{ id: 'x', startMs: 0, endMs: h(4), min: 0, max: 1 }]).unmet).to.deep.equal([
            { at: 0, short: 6, reason: 'at-max', atMax: ['x'] },
        ]);
        expect(coverPersonHours(5, [])).to.deep.equal({
            counts: {},
            unmet: [{ at: 0, short: 5, reason: 'no-shift', atMax: [] }],
        });
        // Floors already cover the day: nobody is added.
        expect(coverPersonHours(4, [{ id: 'x', startMs: 0, endMs: h(8), min: 1 }]).counts).to.deep.equal({ x: 1 });
    });

    it('scales the staffing time budget with peak volume, within its floor and ceiling', () => {
        expect(staffingBudgetMs(0)).to.equal(6_000);
        expect(staffingBudgetMs(100)).to.equal(6_000);
        expect(staffingBudgetMs(300)).to.equal(6_000);
        expect(staffingBudgetMs(600)).to.equal(12_000);
        expect(staffingBudgetMs(1_000)).to.equal(20_000);
        expect(staffingBudgetMs(5_000)).to.equal(20_000);
        expect(staffingBudgetMs(Number.NaN)).to.equal(6_000);
    });
});
