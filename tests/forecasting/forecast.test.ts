import { expect } from 'chai';
import { forecastWorkspace } from '../../src/forecasting/forecast';
import { ForecastCalendar, DAY_MS, HOUR_MS } from '../../src/forecasting/calendar';
import { applyNowcast, nowcastRatio } from '../../src/forecasting/nowcast';
import { backtest, LEAD_BUCKETS } from '../../src/forecasting/backtest';
import { prepareHistory } from '../../src/forecasting/model';
import type { HourForecast } from '../../src/forecasting/types';
import { officeShape, syntheticHistory } from './synthetic';

const round4 = (x: number) => Math.round(x * 10_000) / 10_000;
const hour = (at: number, likely: number): HourForecast => ({
    at,
    likely,
    low: likely * 0.8,
    high: likely * 1.2,
    components: { base: likely, trend: 1, season: 1, holiday: 1, events: [], nowcast: 1 },
});

const ZONE = 'Europe/Tallinn';
// Thursday 2026-10-01 09:00 UTC (12:00 in Tallinn).
const NOW = Date.parse('2026-10-01T09:00:00Z');
const cal = new ForecastCalendar(ZONE, NOW - 200 * DAY_MS, NOW + 200 * DAY_MS);
const localHour = (date: string, hour: number) => {
    const midnight = cal.midnight(date);
    for (let at = midnight; at < midnight + 26 * HOUR_MS; at += HOUR_MS) {
        const slot = cal.slot(at);
        if (slot.date === date && slot.hour === hour) return at;
    }
    throw new Error(`no ${date} ${hour}:00`);
};
/** Office shape normalised to a week of 7000. */
const truth = (weekday: number, hour: number) => {
    let w = 0;
    for (let d = 1; d <= 7; d++) for (let h = 0; h < 24; h++) w += officeShape(d, h);
    return (7000 * officeShape(weekday, hour)) / w;
};

describe('forecastWorkspace', () => {
    it('recovers a weekly hour-of-week pattern in local time', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        const at = (date: string, hour: number) => f.hours.find((h) => h.at === localHour(date, hour))!;
        // Tuesday 6 Oct 10:00 and Saturday 10 Oct 10:00, local.
        expect(at('2026-10-06', 10).likely).to.be.closeTo(truth(2, 10), truth(2, 10) * 0.05);
        expect(at('2026-10-10', 10).likely).to.be.closeTo(truth(6, 10), truth(6, 10) * 0.05);
        expect(at('2026-10-06', 3).likely).to.be.closeTo(truth(2, 3), 1);
        expect(f.weeks[1].likely).to.be.closeTo(7000, 7000 * 0.03);
        expect(f.hours[0].at).to.equal(cal.midnight('2026-10-01'));
        expect(f.yearly).to.equal(false);
    });

    it('keeps the 10am peak at 10am local across the October clock change', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        const at = (date: string, hour: number) => f.hours.find((h) => h.at === localHour(date, hour))!;
        // Clocks go back on Sunday 25 October 2026.
        expect(at('2026-10-23', 10).likely).to.be.closeTo(truth(5, 10), truth(5, 10) * 0.06);
        expect(at('2026-10-26', 10).likely).to.be.closeTo(truth(1, 10), truth(1, 10) * 0.06);
        expect(at('2026-10-26', 3).likely).to.be.below(truth(1, 10) * 0.2);
    });

    it('learns an event from its last occurrence and re-applies it by label', () => {
        const past = { from: '2026-08-20', to: '2026-08-22', factor: 1.8 };
        const history = syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: 7000, noise: false, events: [past] });
        const occurrences = [
            { label: 'winter-sale', kind: 'sale', from: past.from, to: past.to },
            { label: 'winter-sale', kind: 'sale', from: '2026-10-13', to: '2026-10-15' },
        ];
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences }).series;
        const effect = f.effects.find((e) => e.label === 'winter-sale')!;
        expect(effect.source).to.equal('label');
        expect(effect.size).to.be.closeTo(1.8, 0.1);
        const tue = f.hours.find((h) => h.at === localHour('2026-10-13', 10))!;
        expect(tue.likely).to.be.closeTo(truth(2, 10) * 1.8, truth(2, 10) * 0.15);
        expect(tue.components.events).to.deep.equal([{ label: 'winter-sale', factor: tue.components.events[0].factor }]);
        expect(tue.components.events[0].factor).to.be.closeTo(1.8, 0.1);
        // The planner's own figure is not needed: history knew.
        expect(f.accuracy.reasons.filter((r) => r.startsWith('first-time-event'))).to.deep.equal([]);
    });

    it('learns a knock-on wave after an event and forecasts it after the next one', () => {
        const past = { from: '2026-08-10', to: '2026-08-12', factor: 1.5, knockOn: { days: 7, factor: 1.3 } };
        const history = syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: 7000, noise: false, events: [past] });
        const occurrences = [
            { label: 'summer-sale', kind: 'sale', from: past.from, to: past.to },
            { label: 'summer-sale', kind: 'sale', from: '2026-10-05', to: '2026-10-07' },
        ];
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences }).series;
        const effect = f.effects.find((e) => e.label === 'summer-sale')!;
        expect(effect.knockOn.length).to.be.at.least(5);
        expect(effect.knockOn[0]).to.be.closeTo(1.3, 0.08);
        // Mon 12 Oct is five days after the next occurrence ends.
        const after = f.hours.find((h) => h.at === localHour('2026-10-12', 10))!;
        expect(after.likely).to.be.closeTo(truth(1, 10) * 1.3, truth(1, 10) * 0.12);
    });

    it('uses the planner figure for a first-time event and says it is low confidence', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const occurrences = [
            { label: 'launch-x', kind: 'launch', from: '2026-10-14', to: '2026-10-14', planned: { likely: 50 } },
            { label: 'mystery', kind: 'whatever', from: '2026-10-20', to: '2026-10-20' },
        ];
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences }).series;
        const wed = f.hours.find((h) => h.at === localHour('2026-10-14', 10))!;
        expect(wed.likely).to.be.closeTo(truth(3, 10) * 1.5, truth(3, 10) * 0.08);
        expect(f.effects.find((e) => e.label === 'launch-x')!.source).to.equal('planned');
        expect(f.effects.find((e) => e.label === 'mystery')!.source).to.equal('default');
        expect(f.accuracy.reasons).to.include('first-time-event:mystery');
        expect(f.accuracy.lowConfidence).to.equal(true);
    });

    it('zeroes a closure and divides a past closure out of the level', () => {
        const history = syntheticHistory({
            now: NOW,
            weeks: 12,
            weeklyTotal: 7000,
            noise: false,
            events: [{ from: '2026-09-07', to: '2026-09-13', factor: 0 }],
        });
        const occurrences = [
            { label: 'refit', kind: 'closure', from: '2026-09-07', to: '2026-09-13', closed: true },
            { label: 'refit', kind: 'closure', from: '2026-10-19', to: '2026-10-19', closed: true },
        ];
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences }).series;
        expect(f.hours.find((h) => h.at === localHour('2026-10-19', 10))!.likely).to.equal(0);
        expect(f.weeks[1].likely).to.be.closeTo(7000, 7000 * 0.03);
    });

    it('fits a yearly factor only from 56 weeks of history', () => {
        const yearly = { amplitude: 0.3, peakDay: 350 };
        const short = syntheticHistory({ now: NOW, weeks: 40, weeklyTotal: 7000, noise: false, yearly });
        const long = syntheticHistory({ now: NOW, weeks: 120, weeklyTotal: 7000, noise: false, yearly });
        const [s] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [short] }).series;
        const [l] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [long] }).series;
        expect(s.yearly).to.equal(false);
        expect(l.yearly).to.equal(true);
        // Mid-December (peak) against early October: the swing is back on the forecast.
        const dec = l.weeks.find((w) => w.weekStart === '2026-12-14')!;
        const oct = l.weeks.find((w) => w.weekStart === '2026-10-05')!;
        // Truth: 1.3 / 1.09 ≈ 1.19 at these two weeks.
        expect(dec.likely / oct.likely).to.be.within(1.12, 1.3);
        expect(dec.season).to.be.above(1.1);
    });

    it('rescales the next hours by how today has gone, fading over 72 hours', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        // Today (Thursday) so far ran at double.
        const today = cal.midnight('2026-10-01');
        const doubled = history.hourly.map((p) => (p.at >= today ? { ...p, value: p.value * 2 } : p));
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [{ ...history, hourly: doubled }] }).series;
        const next = f.hours.find((h) => h.at === Date.parse('2026-10-01T10:00:00Z'))!;
        // ~463 expected by noon local, ~926 seen: (926 + 25) / (463 + 25) ≈ 1.949, one hour into the fade.
        expect(next.components.nowcast).to.be.closeTo(1 + 0.949 * (71 / 72), 0.01);
        const later = f.hours.find((h) => h.at === Date.parse('2026-10-05T10:00:00Z'))!;
        expect(later.components.nowcast).to.equal(1);
    });

    it('finds an unexplained spike and says which series moved', () => {
        const spike = { from: '2026-09-15', to: '2026-09-17', factor: 2.5 };
        const returns = syntheticHistory({
            series: 'returns',
            now: NOW,
            weeks: 12,
            weeklyTotal: 2000,
            noise: false,
            events: [spike],
        });
        const orders = syntheticHistory({ series: 'orders', now: NOW, weeks: 12, weeklyTotal: 5000, noise: false });
        const sum = new Map<string, number>();
        for (const p of [...returns.daily, ...orders.daily]) sum.set(p.date, (sum.get(p.date) ?? 0) + p.value);
        const hsum = new Map<number, number>();
        for (const p of [...returns.hourly, ...orders.hourly]) hsum.set(p.at, (hsum.get(p.at) ?? 0) + p.value);
        const total = {
            series: '*',
            daily: [...sum].map(([date, value]) => ({ date, value })),
            hourly: [...hsum].map(([at, value]) => ({ at, value })),
        };
        const { spikes } = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [total, returns, orders] });
        expect(spikes).to.have.length(1);
        expect(spikes[0]).to.include({ from: '2026-09-15', to: '2026-09-17', direction: 'up' });
        expect(spikes[0].bySeries[0].series).to.equal('returns');
        expect(spikes[0].bySeries.map((s) => s.series)).to.not.include('orders');
    });

    it('has ranges from its own backtests that contain the truth most of the time', () => {
        const history = syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: 20000, seed: 3 });
        const later = syntheticHistory({ now: NOW + 28 * DAY_MS, weeks: 20, weeklyTotal: 20000, seed: 3 });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        expect(f.accuracy.origins).to.equal(6);
        expect(f.accuracy.wape['24h']).to.be.below(0.25);
        const actual = new Map(later.hourly.map((p) => [p.at, p.value]));
        const judged = f.hours.filter((h) => h.at >= NOW && h.at < NOW + 7 * DAY_MS && h.likely >= 5);
        const inside = judged.filter((h) => {
            const a = actual.get(h.at) ?? 0;
            return a >= h.low && a <= h.high;
        });
        expect(inside.length / judged.length).to.be.above(0.7);
    });

    it('is deterministic', () => {
        const history = syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: 7000, seed: 5 });
        const a = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] });
        const b = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] });
        expect(a.series).to.deep.equal(b.series);
        expect(a.spikes).to.deep.equal(b.spikes);
    });

    it('forecasts an empty series as zero without throwing', () => {
        const [f] = forecastWorkspace({
            timeZone: ZONE,
            now: NOW,
            series: [{ series: 'new', hourly: [], daily: [] }],
        }).series;
        expect(f.hours.every((h) => h.likely === 0)).to.equal(true);
        expect(f.accuracy.reasons).to.include('short-history');
        expect(f.accuracy.wape['24h']).to.equal(null);
    });

    it('reads a daily-only series with an even hourly spread and says so', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false, dailyOnly: true });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        expect(f.accuracy.reasons).to.include('no-hourly-shape');
        expect(f.weeks[1].likely).to.be.closeTo(7000, 7000 * 0.05);
    });

    it('nowcasts from completed hours only, fades over 72 hours, and can be re-applied', () => {
        const start = Date.parse('2026-10-01T00:00:00Z');
        const hours = Array.from({ length: 100 }, (_, h) => hour(start + h * HOUR_MS, 10));
        const now = start + 6 * HOUR_MS + 30 * 60_000;
        const actual = Array.from({ length: 7 }, (_, h) => ({ at: start + h * HOUR_MS, value: 20 }));
        const once = applyNowcast(hours, actual, now);
        // Hour 6 is in progress: its 20 is not counted. 120 seen over 60 expected, shrunk: 145 / 85.
        expect(once[6].components.nowcast).to.equal(1.7059);
        expect(once[6].likely).to.equal(17.06);
        expect(once[5].likely).to.equal(10);
        expect(once[6 + 36].components.nowcast).to.equal(1.3529);
        expect(once[6 + 72].likely).to.equal(10);
        expect(applyNowcast(once, actual, now)).to.deep.equal(once);
        // No actuals is a feed that has not drained yet, not a quiet morning: nothing to rescale by.
        expect(applyNowcast(once, [], now)[6].components.nowcast).to.equal(1);
        expect(applyNowcast(once, [], now)[6].likely).to.equal(10);
        expect(nowcastRatio(4, 4.9)).to.equal(1);
        expect(nowcastRatio(100, 10)).to.equal(3);
        expect(nowcastRatio(1, 10)).to.be.closeTo(26 / 35, 1e-9);
        expect(nowcastRatio(0, 100)).to.equal(0.5);
        // Nothing stored is nothing to rescale; actuals from before the stored hours are not today's.
        expect(applyNowcast([], actual, now)).to.deep.equal([]);
        const yesterday = actual.map((p) => ({ ...p, at: p.at - 24 * HOUR_MS }));
        expect(applyNowcast(hours, [...yesterday, ...actual], now)).to.deep.equal(once);
        // A stored nowcast of 0 (never written by this module) reads as none.
        const zeroed = hours.map((h) => ({ ...h, components: { ...h.components, nowcast: 0 } }));
        expect(applyNowcast(zeroed, actual, now)).to.deep.equal(once);
        // Twelve tasks over six expected is noise, not a doubling.
        expect(nowcastRatio(12, 6)).to.be.closeTo(37 / 31, 1e-9);
    });

    it('nowcasts only up to the latest hour the feed has drained, and not at all from a stale feed', () => {
        const start = Date.parse('2026-10-01T00:00:00Z');
        const hours = Array.from({ length: 100 }, (_, h) => hour(start + h * HOUR_MS, 10));
        const now = start + 6 * HOUR_MS + 30 * 60_000;
        const row = (h: number, value: number) => ({ at: start + h * HOUR_MS, value });
        // Hours 0–3 drained, 4 and 5 not yet: 80 seen over 40 expected, never 80 over 60.
        const lagging = applyNowcast(
            hours,
            [0, 1, 2, 3].map((h) => row(h, 20)),
            now,
        );
        expect(lagging[6].components.nowcast).to.equal(round4(105 / 65));
        // An hour that drained as zero is a zero: hours 0–5 present, 4 and 5 empty.
        const quiet = applyNowcast(hours, [...[0, 1, 2, 3].map((h) => row(h, 20)), row(4, 0), row(5, 0)], now);
        expect(quiet[6].components.nowcast).to.equal(round4(105 / 85));
        // Latest drained hour 3:00 is exactly three hours before 6:00: still read. 2:00 is too old.
        expect(
            applyNowcast(
                hours,
                [0, 1, 2].map((h) => row(h, 40)),
                now,
            )[6].components.nowcast,
        ).to.equal(1);
        expect(
            applyNowcast(
                hours,
                [0, 1, 2].map((h) => row(h, 40)),
                now,
            ),
        ).to.deep.equal(hours);
    });

    it('does not drag the forecast down when the feed has not drained the last hours', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const current = Math.floor(NOW / HOUR_MS) * HOUR_MS;
        const lagged = { ...history, hourly: history.hourly.filter((p) => p.at < current - 2 * HOUR_MS) };
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [lagged] }).series;
        expect(f.hours.find((h) => h.at === current)!.components.nowcast).to.be.closeTo(1, 0.01);
        const stale = { ...history, hourly: history.hourly.filter((p) => p.at < current - 4 * HOUR_MS) };
        const [g] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [stale] }).series;
        expect(g.hours.every((h) => h.components.nowcast === 1)).to.equal(true);
    });

    it('borrows the total series ranges for a series outside the busiest few', () => {
        const now = Date.parse('2026-10-01T09:00:00Z');
        const series = [
            syntheticHistory({ series: '*', now, weeks: 12, weeklyTotal: 20000, seed: 1 }),
            syntheticHistory({ series: 'big', now, weeks: 12, weeklyTotal: 15000, seed: 2 }),
            syntheticHistory({ series: 'small', now, weeks: 12, weeklyTotal: 500, seed: 3 }),
        ];
        const result = forecastWorkspace({ timeZone: 'Europe/Tallinn', now, series, backtestSeries: 1 });
        const by = new Map(result.series.map((s) => [s.series, s]));
        expect(by.get('*')!.accuracy).to.include({ rangesFrom: 'own', origins: 6 });
        expect(by.get('big')!.accuracy.rangesFrom).to.equal('own');
        expect(by.get('small')!.accuracy).to.include({ rangesFrom: 'total', origins: 0 });
        expect(by.get('small')!.accuracy.wape['24h']).to.equal(null);
    });
});

describe('forecastWorkspace: local days and ranges', () => {
    for (const zone of ['Europe/Tallinn', 'America/Los_Angeles', 'Pacific/Auckland']) {
        it(`reports a week as the sum of its local hours (${zone})`, () => {
            const zcal = new ForecastCalendar(zone, NOW - 10 * DAY_MS, NOW + 60 * DAY_MS);
            // An event, its knock-on, a holiday and (in Tallinn) the clock change on 25 October: week 3 is 19–25 October.
            const past = { label: 'autumn', kind: 'sale', from: '2026-08-10', to: '2026-08-11' };
            const occurrences = [
                past,
                { label: 'autumn', kind: 'sale', from: '2026-10-07', to: '2026-10-08' },
                { label: 'fresh', kind: 'launch', from: '2026-10-20', to: '2026-10-20' },
                { label: 'holiday:x', kind: 'holiday', from: '2026-10-22', to: '2026-10-22' },
            ];
            const history = syntheticHistory({
                now: NOW,
                weeks: 12,
                weeklyTotal: 7000,
                seed: 4,
                timeZone: zone,
                events: [{ from: past.from, to: past.to, factor: 1.6, knockOn: { days: 5, factor: 1.3 } }],
            });
            const [f] = forecastWorkspace({ timeZone: zone, now: NOW, series: [history], occurrences }).series;
            for (const w of [1, 2, 3]) {
                const monday = f.weeks[w].weekStart;
                const next = new Date(Date.parse(`${monday}T00:00:00Z`) + 7 * DAY_MS).toISOString().slice(0, 10);
                let sum = 0;
                for (const h of f.hours) if (h.at >= zcal.midnight(monday) && h.at < zcal.midnight(next)) sum += h.likely;
                expect(f.weeks[w].likely, `${zone} ${monday}`).to.be.closeTo(sum, 1);
            }
        });
    }

    it('widens the range on a first-time holiday, which projectHour does not', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const occurrences = [{ label: 'holiday:new', kind: 'holiday', from: '2026-10-14', to: '2026-10-14' }];
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences }).series;
        const holiday = f.hours.find((h) => h.at === localHour('2026-10-14', 10))!;
        const plain = f.hours.find((h) => h.at === localHour('2026-10-21', 10))!;
        expect(holiday.components.holiday).to.equal(0.7);
        expect(holiday.likely).to.be.closeTo(plain.likely * 0.7, plain.likely * 0.05);
        // Default holiday: 0.3–1.2 around 0.7. A clean history backtests to no error, so the plain
        // hour's range is its Poisson floor; the holiday's is its own spread on top of the backtest's.
        expect(holiday.high / holiday.likely).to.be.at.least(1.2 / 0.7 - 0.01);
        expect(holiday.low / holiday.likely).to.be.at.most(0.3 / 0.7 + 0.01);
        expect(plain.high / plain.likely).to.be.below(1.2);
        expect(plain.low / plain.likely).to.be.above(0.8);
        const week = f.weeks.find((w) => w.weekStart === '2026-10-12')!;
        const next = f.weeks.find((w) => w.weekStart === '2026-10-19')!;
        expect(week.high - week.likely).to.be.above(next.high - next.likely);
        expect(week.likely - week.low).to.be.above(next.likely - next.low);
    });

    it('closes the day of a closed holiday, range and all', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const occurrences = [
            { label: 'holiday:shut', kind: 'holiday', from: '2026-10-14', to: '2026-10-14', closed: true },
        ];
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences }).series;
        const shut = f.hours.find((h) => h.at === localHour('2026-10-14', 10))!;
        expect(shut).to.include({ likely: 0, low: 0, high: 0 });
    });

    it('backtests a daily-only series on UTC days against the daily table', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false, dailyOnly: true });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        expect(f.accuracy.origins).to.equal(6);
        for (const bucket of ['24h', '72h', '7d', '28d'] as const) expect(f.accuracy.wape[bucket]).to.be.below(0.02);
    });

    it('backtests an hourly series hour against hour, with near-zero error on a clean pattern', () => {
        const zone = 'America/Los_Angeles';
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false, timeZone: zone });
        const [f] = forecastWorkspace({ timeZone: zone, now: NOW, series: [history] }).series;
        expect(f.accuracy.origins).to.equal(6);
        expect(f.accuracy.wape['24h']).to.be.below(0.05);
        expect(f.accuracy.wape['7d']).to.be.below(0.05);
    });

    it('skips origins without three weeks of history before them', () => {
        // 35 days of history: only the origin a week back has 21 full days before it (two weeks back has 20 and a bit).
        const history = syntheticHistory({ now: NOW, weeks: 5, weeklyTotal: 7000, noise: false });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        expect(f.accuracy.origins).to.equal(1);
    });

    it('forecasts every series without a total, each from its own backtests', () => {
        const series = [
            syntheticHistory({ series: 'a', now: NOW, weeks: 8, weeklyTotal: 3000, seed: 1 }),
            syntheticHistory({ series: 'b', now: NOW, weeks: 8, weeklyTotal: 300, seed: 2 }),
        ];
        const result = forecastWorkspace({ timeZone: ZONE, now: NOW, series, backtestSeries: 0 });
        expect(result.spikes).to.deep.equal([]);
        for (const s of result.series) expect(s.accuracy.origins, s.series).to.be.above(0);
    });

    it('borrows default ranges when the total itself had nothing to measure', () => {
        const series = [
            { series: '*', hourly: [], daily: [] },
            syntheticHistory({ series: 'x', now: NOW, weeks: 8, weeklyTotal: 300, seed: 2 }),
        ];
        const result = forecastWorkspace({ timeZone: ZONE, now: NOW, series, backtestSeries: 0 });
        const x = result.series.find((s) => s.series === 'x')!;
        expect(x.accuracy).to.include({ rangesFrom: 'default', origins: 0 });
    });

    it('reports a dip as a down spike, and none on an empty total', () => {
        const dip = syntheticHistory({
            now: NOW,
            weeks: 12,
            weeklyTotal: 7000,
            noise: false,
            events: [{ from: '2026-09-22', to: '2026-09-22', factor: 0.2 }],
        });
        const { spikes } = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [dip] });
        expect(spikes).to.have.length(1);
        expect(spikes[0]).to.include({ from: '2026-09-22', to: '2026-09-22', direction: 'down' });
        expect(spikes[0].peakRatio).to.be.below(0.4);
        expect(spikes[0].bySeries).to.deep.equal([]);
        const empty = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [{ series: '*', hourly: [], daily: [] }] });
        expect(empty.spikes).to.deep.equal([]);
    });

    it('leaves a spike a known event explains out of the inbox', () => {
        const history = syntheticHistory({
            now: NOW,
            weeks: 12,
            weeklyTotal: 7000,
            noise: false,
            events: [{ from: '2026-09-15', to: '2026-09-17', factor: 2.5 }],
        });
        const occurrences = [{ label: 'named', kind: 'sale', from: '2026-09-15', to: '2026-09-17' }];
        const { spikes } = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history], occurrences });
        expect(spikes).to.deep.equal([]);
    });

    it('reports high error on a series that does not follow its own pattern', () => {
        // Alternate weeks at 1× and 3×: the level never settles and the 72-hour error is large.
        const a = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 3000, seed: 9 });
        const b = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 9000, seed: 10 });
        const odd = (at: number) => Math.floor(at / (7 * DAY_MS)) % 2 === 1;
        const bAt = new Map(b.hourly.map((p) => [p.at, p.value]));
        const hours = new Set([...a.hourly.map((p) => p.at), ...b.hourly.map((p) => p.at)]);
        const aAt = new Map(a.hourly.map((p) => [p.at, p.value]));
        const hourly = [...hours]
            .sort((x, y) => x - y)
            .map((at) => ({ at, value: (odd(at) ? bAt.get(at) : aAt.get(at)) ?? 0 }));
        const daily = new Map<string, number>();
        for (const p of hourly) {
            const date = new Date(p.at).toISOString().slice(0, 10);
            daily.set(date, (daily.get(date) ?? 0) + p.value);
        }
        const history = { series: '*', hourly, daily: [...daily].map(([date, value]) => ({ date, value })) };
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        expect(f.accuracy.reasons).to.include('high-error');
        expect(f.accuracy.lowConfidence).to.equal(true);
    });
});

describe('forecastWorkspace: review fixes', () => {
    const weekTruth = 7000;
    /** Actual volume of a local week in a (later, independent) history. */
    const weekActual = (actual: Map<number, number>, zcal: ForecastCalendar, monday: string) => {
        const next = new Date(Date.parse(`${monday}T00:00:00Z`) + 7 * DAY_MS).toISOString().slice(0, 10);
        let sum = 0;
        for (let t = zcal.midnight(monday); t < zcal.midnight(next); t += HOUR_MS) sum += actual.get(t) ?? 0;
        return sum;
    };
    /** Multiplies every local day by a seeded log-normal factor: volume that is noisier than Poisson. */
    const overdispersed = (h: ReturnType<typeof syntheticHistory>, seed: number, sd: number) => {
        let x = seed * 7919 + 17;
        const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647;
        const factors = new Map<string, number>();
        const factor = (date: string) => {
            let f = factors.get(date);
            if (f === undefined) {
                const z = Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
                factors.set(date, (f = Math.exp(sd * z - (sd * sd) / 2)));
            }
            return f;
        };
        const hourly = h.hourly.map((p) => ({ at: p.at, value: Math.round(p.value * factor(cal.slot(p.at).date)) }));
        const daily = new Map<string, number>();
        for (const p of hourly) {
            const date = new Date(p.at).toISOString().slice(0, 10);
            daily.set(date, (daily.get(date) ?? 0) + p.value);
        }
        const older = h.daily
            .filter((p) => !daily.has(p.date))
            .map((p) => ({ ...p, value: Math.round(p.value * factor(p.date)) }));
        return { ...h, hourly, daily: [...older, ...[...daily].map(([date, value]) => ({ date, value }))] };
    };
    const coverage = (sd: number) => {
        let inside = 0;
        let judged = 0;
        let weeksInside = 0;
        let weeks = 0;
        for (let seed = 1; seed <= 8; seed++) {
            let history = syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: weekTruth, seed });
            let later = syntheticHistory({ now: NOW + 35 * DAY_MS, weeks: 6, weeklyTotal: weekTruth, seed: 1000 + seed });
            if (sd > 0) {
                history = overdispersed(history, seed, sd);
                later = overdispersed(later, 1000 + seed, sd);
            }
            const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
            const actual = new Map(later.hourly.map((p) => [p.at, p.value]));
            for (const h of f.hours) {
                if (h.at <= NOW || h.likely < 20) continue;
                const a = actual.get(h.at) ?? 0;
                judged += 1;
                if (a >= h.low && a <= h.high) inside += 1;
            }
            for (const w of f.weeks.slice(1, 4)) {
                const a = weekActual(actual, cal, w.weekStart);
                weeks += 1;
                if (a >= w.low && a <= w.high) weeksInside += 1;
            }
        }
        return { hours: inside / judged, weeks: weeksInside / weeks };
    };

    it('does not nowcast a daily-only series (no hourly history today)', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false, dailyOnly: true });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        expect(f.hours.every((h) => h.components.nowcast === 1)).to.equal(true);
    });

    for (const sd of [0, 0.15]) {
        it(`has p10–p90 bands that hold about 80 % of later hours, not more (day noise ${sd})`, () => {
            const { hours, weeks } = coverage(sd);
            expect(hours).to.be.within(0.7, 0.9);
            expect(weeks).to.be.at.least(0.7);
        });
    }

    it('follows a step that has lasted two weeks instead of reading it as a spike', () => {
        const history = syntheticHistory({
            now: NOW,
            weeks: 16,
            weeklyTotal: 7000,
            seed: 2,
            events: [{ from: '2026-09-17', to: '2030-12-31', factor: 2 }],
        });
        const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        const monday = f.hours.find((h) => h.at === localHour('2026-10-05', 10))!;
        expect(monday.likely).to.be.closeTo(2 * truth(1, 10), 2 * truth(1, 10) * 0.15);
        expect(f.weeks[2].likely).to.be.closeTo(14000, 14000 * 0.15);
    });

    it('does not call a well-specified 700/week series high-error', () => {
        let flagged = 0;
        for (let seed = 1; seed <= 12; seed++) {
            const history = syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: 700, seed });
            const [f] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
            if (f.accuracy.reasons.includes('high-error')) flagged += 1;
        }
        expect(flagged).to.be.at.most(2);
    });

    it('carries the nowcast its hours carry into this week’s total', () => {
        const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        const today = cal.midnight('2026-10-01');
        const doubled = history.hourly.map((p) => (p.at >= today ? { ...p, value: p.value * 2 } : p));
        const [plain] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [history] }).series;
        const [busy] = forecastWorkspace({ timeZone: ZONE, now: NOW, series: [{ ...history, hourly: doubled }] }).series;
        const weekEnd = cal.midnight('2026-10-05');
        let lift = 0;
        busy.hours.forEach((h, i) => {
            if (h.at < weekEnd) lift += h.likely - plain.hours[i].likely;
        });
        expect(lift).to.be.above(100);
        expect(busy.weeks[0].likely - plain.weeks[0].likely).to.be.closeTo(lift, 1);
        // The nowcast is spent by Sunday: next week is untouched.
        expect(busy.weeks[1].likely).to.equal(plain.weeks[1].likely);
    });

    it('never reads a longer lead as surer than a shorter one', () => {
        // Seed 1 backtests to c(24h) > c(72h) > c(7d) on its own: sampling noise, not a narrower forecast.
        const history = prepareHistory(syntheticHistory({ now: NOW, weeks: 16, weeklyTotal: 7000, seed: 1 }));
        const { dispersion } = backtest(history, [], cal, NOW, 6);
        const ordered = LEAD_BUCKETS.map(({ bucket }) => dispersion[bucket]);
        expect(ordered[0]).to.be.above(0);
        for (let i = 1; i < ordered.length; i++) expect(ordered[i]).to.be.at.least(ordered[i - 1]);
    });
});
