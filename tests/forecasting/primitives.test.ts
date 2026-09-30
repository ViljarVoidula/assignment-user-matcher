import { expect } from 'chai';
import { ForecastCalendar } from '../../src/forecasting/calendar';
import { DAY_MS, dateOf, dayOf, mondayOfDay, utcDay, weekOfYear, weekdayOf } from '../../src/forecasting/days';
import {
    assertDistribution,
    createPrng,
    exponentialQuantiles,
    meanOf,
    sampleGammaMeanOne,
    samplePoisson,
    sampleQuantiles,
} from '../../src/forecasting/distributions';
import { clamp, mean, median, quantile, quantileSorted, round } from '../../src/forecasting/stats';

describe('forecasting primitives', () => {
    it('reads local hours through the clock, including the fall-back night', () => {
        const cal = new ForecastCalendar(
            'Europe/Tallinn',
            Date.parse('2026-10-20T00:00:00Z'),
            Date.parse('2026-10-30T00:00:00Z'),
        );
        // 25 Oct 2026: 04:00 local (EEST) → 03:00 (EET). 00:00 and 01:00 UTC both read as 03:00 local.
        expect(cal.slot(Date.parse('2026-10-25T00:00:00Z'))).to.include({ date: '2026-10-25', hour: 3, weekday: 7 });
        expect(cal.slot(Date.parse('2026-10-25T01:00:00Z'))).to.include({ date: '2026-10-25', hour: 3 });
        expect(cal.slot(Date.parse('2026-10-25T02:00:00Z')).hour).to.equal(4);
        expect(cal.slot(Date.parse('2026-10-26T07:00:00Z'))).to.include({ date: '2026-10-26', hour: 9, how: 9 });
        expect(cal.midnight('2026-10-26')).to.equal(Date.parse('2026-10-25T22:00:00Z'));
    });

    it('does day arithmetic on integers', () => {
        expect(dateOf(dayOf('2026-10-01'))).to.equal('2026-10-01');
        expect(weekdayOf(dayOf('2026-10-04'))).to.equal(7);
        expect(dateOf(mondayOfDay(dayOf('2026-10-04')))).to.equal('2026-09-28');
        expect(weekOfYear(dayOf('2026-01-05'))).to.equal(0);
        expect(weekOfYear(dayOf('2026-12-28'))).to.equal(51);
    });

    it('samples distributions reproducibly', () => {
        const d = exponentialQuantiles(100);
        expect(meanOf(d)).to.be.within(90, 105);
        const a = createPrng(4);
        const b = createPrng(4);
        expect(samplePoisson(3, a)).to.equal(samplePoisson(3, b));
        expect(samplePoisson(0, a)).to.equal(0);
        expect(samplePoisson(500, createPrng(1))).to.be.within(400, 600);
        const g = Array.from({ length: 2000 }, (_, i) => sampleGammaMeanOne(i % 2 ? 0.5 : 20, createPrng(i)));
        expect(mean(g)).to.be.within(0.9, 1.1);
        expect(sampleGammaMeanOne(Infinity, a)).to.equal(1);
        expect(quantile([], 0.5)).to.be.NaN;
        expect(median([3, 1, 2])).to.equal(2);
        expect(clamp(5, 0, 3)).to.equal(3);
        expect(round(1.23456, 2)).to.equal(1.23);
        expect(sampleQuantiles({ q: [0, 10] }, () => 0.5)).to.equal(5);
        expect(() => assertDistribution({ q: [1] }, 'x')).to.throw(RangeError);
        expect(() => assertDistribution({ q: [2, 1] }, 'x')).to.throw(RangeError);
        expect(() => assertDistribution({ q: [0, Number.NaN] }, 'x')).to.throw(RangeError);
    });

    it('answers repeat questions from its memo and empty samples with NaN', () => {
        const cal = new ForecastCalendar('UTC', Date.parse('2026-10-20T00:00:00Z'), Date.parse('2026-10-21T00:00:00Z'));
        const at = Date.parse('2026-10-20T05:00:00Z');
        expect(cal.slot(at)).to.equal(cal.slot(at));
        expect(weekOfYear(dayOf('2026-12-28'))).to.equal(51);
        expect(utcDay(Date.parse('2026-10-20T23:59:00Z'))).to.equal(Date.parse('2026-10-20T00:00:00Z') / DAY_MS);
        expect(quantileSorted([], 0.5)).to.be.NaN;
        expect(mean([])).to.be.NaN;
        expect(round(1.005)).to.equal(1);
        expect(round(2.5, 0)).to.equal(3);
    });
});
