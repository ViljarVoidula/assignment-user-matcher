import { expect } from 'chai';
import { ForecastCalendar, DAY_MS, HOUR_MS } from '../../src/forecasting/calendar';
import { dayOf } from '../../src/forecasting/days';
import { dayEffect, learnEffects, prepareOccurrences, suggestEffect } from '../../src/forecasting/effects';
import {
    actualOn,
    expectedDay,
    fitSeries,
    fitYearly,
    isOutlier,
    levelFor,
    prepareHistory,
    projectHour,
} from '../../src/forecasting/model';
import type { KnownOccurrence, LearnedEffect } from '../../src/forecasting/types';
import { officeShape, syntheticHistory } from './synthetic';

const ZONE = 'Europe/Tallinn';
const NOW = Date.parse('2026-10-01T09:00:00Z');
const cal = new ForecastCalendar(ZONE, NOW - 900 * DAY_MS, NOW + 200 * DAY_MS);
const at = (date: string, hour: number) => {
    const midnight = cal.midnight(date);
    for (let t = midnight; t < midnight + 26 * HOUR_MS; t += HOUR_MS) {
        const slot = cal.slot(t);
        if (slot.date === date && slot.hour === hour) return t;
    }
    throw new Error(`no ${date} ${hour}:00`);
};
const truth = (weekday: number, hour: number) => {
    let w = 0;
    for (let d = 1; d <= 7; d++) for (let h = 0; h < 24; h++) w += officeShape(d, h);
    return (7000 * officeShape(weekday, hour)) / w;
};
const fit = (options: Parameters<typeof syntheticHistory>[0], occurrences: KnownOccurrence[] = []) =>
    fitSeries(prepareHistory(syntheticHistory(options)), prepareOccurrences(occurrences), cal, NOW);

describe('forecast model', () => {
    it('fits the weekly level and the hour-of-week shape in local time', () => {
        const model = fit({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false });
        expect(model.level).to.be.closeTo(7000, 7000 * 0.03);
        expect(model.hasHourlyShape).to.equal(true);
        expect(projectHour(model, cal, at('2026-10-06', 10)).likely).to.be.closeTo(truth(2, 10), truth(2, 10) * 0.05);
        expect(projectHour(model, cal, at('2026-10-10', 10)).likely).to.be.closeTo(truth(6, 10), truth(6, 10) * 0.05);
    });

    it('reads a trend and damps it', () => {
        const model = fit({ now: NOW, weeks: 16, weeklyTotal: 7000, growthPerWeek: 0.02, noise: false });
        expect(model.trend).to.be.above(0);
        const next = projectHour(model, cal, at('2026-10-06', 10)).components.trend;
        const far = projectHour(model, cal, at('2026-12-01', 10)).components.trend;
        expect(far).to.be.above(next);
        // Damped: nine weeks out is well short of nine weeks of compounding.
        expect(far).to.be.below(Math.pow(1.02, 9));
    });

    it('learns size, shape and knock-on per label and applies them to the next occurrence', () => {
        const model = fit(
            {
                now: NOW,
                weeks: 16,
                weeklyTotal: 7000,
                noise: false,
                events: [{ from: '2026-08-10', to: '2026-08-12', factor: 1.8, knockOn: { days: 7, factor: 1.3 } }],
            },
            [
                { label: 'sale', kind: 'sale', from: '2026-08-10', to: '2026-08-12' },
                { label: 'sale', kind: 'sale', from: '2026-10-05', to: '2026-10-07' },
            ],
        );
        const effect = model.learned.get('sale')!;
        expect(effect).to.include({ source: 'label', occurrences: 1 });
        expect(effect.size).to.be.closeTo(1.8, 0.1);
        expect(effect.shape).to.have.length(3);
        expect(effect.knockOn[0]).to.be.closeTo(1.3, 0.08);
        const inside = projectHour(model, cal, at('2026-10-06', 10));
        expect(inside.components.events[0]).to.include({ label: 'sale' });
        expect(inside.likely).to.be.closeTo(truth(2, 10) * 1.8, truth(2, 10) * 0.15);
        const after = projectHour(model, cal, at('2026-10-09', 10));
        expect(after.likely).to.be.closeTo(truth(5, 10) * 1.3, truth(5, 10) * 0.12);
    });

    it('keeps event days out of the level', () => {
        const model = fit(
            {
                now: NOW,
                weeks: 12,
                weeklyTotal: 7000,
                noise: false,
                events: [{ from: '2026-09-14', to: '2026-09-20', factor: 3 }],
            },
            [{ label: 'big', kind: 'sale', from: '2026-09-14', to: '2026-09-20' }],
        );
        expect(model.level).to.be.closeTo(7000, 7000 * 0.03);
    });

    it('leaves an unexplained outlier out of the level on the refit', () => {
        const model = fit({
            now: NOW,
            weeks: 12,
            weeklyTotal: 7000,
            noise: false,
            events: [{ from: '2026-09-22', to: '2026-09-24', factor: 2.5 }],
        });
        expect(model.level).to.be.closeTo(7000, 7000 * 0.03);
        expect(isOutlier(1818, 1273)).to.equal(true);
        expect(isOutlier(1300, 1273)).to.equal(false);
        expect(isOutlier(3, 0.5)).to.equal(false);
    });

    it('divides public holidays out and applies the learned holiday factor', () => {
        const holidays = ['2026-06-23', '2026-06-24', '2026-08-20'].map((date) => ({
            label: `holiday:${date.slice(5)}`,
            kind: 'holiday',
            from: date,
            to: date,
        }));
        const model = fit(
            {
                now: NOW,
                weeks: 16,
                weeklyTotal: 7000,
                noise: false,
                events: holidays.map((h) => ({ from: h.from, to: h.to, factor: 0.3 })),
            },
            [...holidays, { label: 'holiday:08-20', kind: 'holiday', from: '2026-10-20', to: '2026-10-20' }],
        );
        const day = projectHour(model, cal, at('2026-10-20', 10));
        expect(day.components.holiday).to.be.closeTo(0.3, 0.05);
        expect(day.components.events).to.deep.equal([]);
    });

    it('fits a yearly factor from whole years only', () => {
        const long = fit({
            now: NOW,
            weeks: 120,
            weeklyTotal: 7000,
            noise: false,
            yearly: { amplitude: 0.3, peakDay: 350 },
        });
        expect(long.yearly).to.not.equal(null);
        const dec = expectedDay(long, dayOf('2026-12-16'));
        const oct = expectedDay(long, dayOf('2026-10-07'));
        expect(dec / oct).to.be.within(1.12, 1.3);
        expect(fitYearly([{ monday: dayOf('2026-01-05'), total: 5 }])).to.equal(null);
        expect(fitYearly([])).to.equal(null);
    });

    it('fits nothing from nothing, and a few days as a weekly rate', () => {
        const empty = fitSeries(prepareHistory({ series: 'x', hourly: [], daily: [] }), [], cal, NOW);
        expect(empty.span).to.equal(null);
        expect(empty.level).to.equal(0);
        expect(projectHour(empty, cal, at('2026-10-06', 10)).likely).to.equal(0);
        const days = fitSeries(
            prepareHistory({
                series: 'x',
                hourly: [],
                daily: ['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'].map((date) => ({ date, value: 10 })),
            }),
            [],
            cal,
            NOW,
        );
        // The first day is partial and left out; three days of 10 read as 70 a week.
        expect(days.level).to.be.closeTo(70, 1e-9);
        expect(days.hasHourlyShape).to.equal(false);
    });

    it('suggests an effect: the label, then the planner, then the kind, then the default', () => {
        const learned: LearnedEffect[] = [
            {
                label: 'bf',
                kind: 'sale',
                source: 'label',
                occurrences: 2,
                size: 2,
                low: 1.8,
                high: 2.2,
                shape: [1],
                knockOn: [],
            },
            {
                label: 'spring',
                kind: 'sale',
                source: 'label',
                occurrences: 1,
                size: 1.4,
                low: 1.1,
                high: 1.75,
                shape: [1],
                knockOn: [],
            },
        ];
        const at = { from: '2026-11-27', to: '2026-11-27' };
        expect(suggestEffect({ ...at, label: 'bf', kind: 'sale' }, learned).size).to.equal(2);
        expect(suggestEffect({ ...at, label: 'new', kind: 'sale', planned: { likely: 20 } }, learned)).to.include({
            source: 'planned',
            size: 1.2,
        });
        expect(suggestEffect({ ...at, label: 'new', kind: 'sale' }, learned)).to.include({
            source: 'kind',
            size: 1.7,
            low: 1.1,
            high: 2.2,
        });
        expect(suggestEffect({ ...at, label: 'new', kind: 'launch' }, learned)).to.include({
            source: 'default',
            size: 1.3,
        });
        expect(suggestEffect({ ...at, label: 'x', kind: 'odd' }, [])).to.include({ source: 'default', size: 1.2 });
        expect(suggestEffect({ ...at, label: 'shut', kind: 'closure', closed: true }, learned)).to.include({ size: 0 });
    });
});

describe('forecast model edges', () => {
    const daysFrom = (from: string, to: string, value: number) => {
        const out: Array<{ date: string; value: number }> = [];
        for (let d = dayOf(from); d <= dayOf(to); d++)
            out.push({ date: new Date(d * DAY_MS).toISOString().slice(0, 10), value });
        return out;
    };

    it('learns nothing from closures or unseen days, ranges repeat labels, and reads a knock-on across a gap', () => {
        const occ = prepareOccurrences([
            { label: 'shut', kind: 'closure', from: '2026-01-05', to: '2026-01-05', closed: true },
            { label: 'blind', kind: 'sale', from: '2026-01-10', to: '2026-01-11' },
            { label: 'twice', kind: 'sale', from: '2026-01-20', to: '2026-01-20' },
            { label: 'twice', kind: 'sale', from: '2026-02-20', to: '2026-02-20' },
            { label: 'dead', kind: 'sale', from: '2026-04-06', to: '2026-04-06' },
        ]);
        const known = new Map<number, number | null>([
            [dayOf('2026-01-10'), null],
            [dayOf('2026-01-11'), null],
            [dayOf('2026-01-20'), 20],
            [dayOf('2026-02-20'), 30],
            [dayOf('2026-04-06'), 0],
            [dayOf('2026-04-07'), null],
            [dayOf('2026-04-08'), 30],
            [dayOf('2026-04-09'), 30],
            [dayOf('2026-04-12'), 30],
        ]);
        const learned = learnEffects(
            occ,
            (day) => (known.has(day) ? known.get(day)! : 10),
            () => 10,
        );
        expect([...learned.keys()]).to.deep.equal(['twice', 'dead']);
        // Σa/Σe = 50/20 = 2.5 on 20 expected tasks, shrunk: 1 + 1.5 · 20/70; the range spans both occurrences.
        const twice = learned.get('twice')!;
        expect(twice).to.include({ occurrences: 2 });
        expect(twice.size).to.be.closeTo(1 + (1.5 * 20) / 70, 1e-12);
        expect(twice.low).to.be.closeTo(1 + 20 / 70, 1e-12);
        expect(twice.high).to.be.closeTo(1 + (2 * 20) / 70, 1e-12);
        expect(twice.knockOn).to.deep.equal([]);
        // Nothing on a day expecting 10: shrunk to 1 − 10/60, a Poisson range of ±2·√1/10 around 0…0.83.
        const dead = learned.get('dead')!;
        expect(dead.size).to.be.closeTo(1 - 10 / 60, 1e-12);
        expect(dead.low).to.equal(0);
        expect(dead.high).to.be.closeTo(1 - 10 / 60 + 0.2, 1e-12);
        expect(dead.shape).to.deep.equal([1]);
        // Days 2–3 after are a two-day run 20 tasks (> 2.5·√10) over; day 6 alone is not a wave.
        const k = 1 + (2 * 10) / 60;
        expect(dead.knockOn).to.deep.equal([1, k, k]);
    });

    it('applies only resolved effects, repeats an empty shape as 1, and skips flat or spent knock-on days', () => {
        const [occ, other] = prepareOccurrences([
            { label: 'x', kind: 'sale', from: '2026-10-05', to: '2026-10-06' },
            { label: 'y', kind: 'sale', from: '2026-10-05', to: '2026-10-06' },
        ]);
        const effect: LearnedEffect = {
            label: 'x',
            kind: 'sale',
            source: 'label',
            occurrences: 1,
            size: 2,
            low: 1.5,
            high: 2.5,
            shape: [],
            knockOn: [1, 1.5],
        };
        const effects = new Map([[occ, effect]]);
        const on = (date: string) => dayEffect(dayOf(date), [occ, other], effects);
        expect(on('2026-10-05')).to.deep.equal({ holiday: 1, events: [{ label: 'x', factor: 2, low: 1.5, high: 2.5 }] });
        expect(on('2026-10-07')).to.deep.equal({ holiday: 1, events: [] });
        expect(on('2026-10-08')).to.deep.equal({ holiday: 1, events: [{ label: 'x', factor: 1.5, low: 1.5, high: 1.5 }] });
        expect(on('2026-10-11')).to.deep.equal({ holiday: 1, events: [] });
    });

    it('prefers the daily table over hourly sums and accepts rows in any order', () => {
        const hour = Date.parse('2026-09-02T10:00:00Z');
        const prepared = prepareHistory({
            series: 's',
            hourly: [
                { at: hour, value: 5 },
                { at: hour, value: 2 },
                { at: Date.parse('2026-09-03T10:00:00Z'), value: 4 },
            ],
            daily: [
                { date: '2026-09-02', value: 100 },
                { date: '2026-09-01', value: 50 },
            ],
        });
        expect(prepared.firstDay).to.equal(dayOf('2026-09-01'));
        expect([...prepared.daily]).to.deep.equal([50, 100, 4]);
        expect(prepared.hourly.get(hour)).to.equal(7);
    });

    it('starts at the first non-zero day, ignores today and later, and reads days past the table as zero', () => {
        const history = [
            { date: '2026-08-01', value: 0 },
            ...daysFrom('2026-08-02', '2026-09-30', 10),
            { date: '2026-10-01', value: 999 },
            { date: '2026-10-05', value: 999 },
        ];
        const model = fitSeries(prepareHistory({ series: 's', hourly: [], daily: history }), [], cal, NOW);
        expect(model.span).to.deep.equal({ from: dayOf('2026-08-02'), to: dayOf('2026-09-30') });
        expect(model.level).to.be.closeTo(70, 1e-6);

        const stale = fitSeries(
            prepareHistory({ series: 's', hourly: [], daily: daysFrom('2026-08-03', '2026-09-20', 10) }),
            [],
            cal,
            NOW,
        );
        expect(stale.span).to.deep.equal({ from: dayOf('2026-08-03'), to: dayOf('2026-09-30') });
        expect(actualOn(stale, dayOf('2026-09-25'))).to.equal(0);
        expect(actualOn(stale, dayOf('2026-10-02'))).to.equal(null);
    });

    it('fits no level when every day is special, and reads past weeks at that level', () => {
        const model = fitSeries(
            prepareHistory({ series: 's', hourly: [], daily: daysFrom('2026-09-10', '2026-09-30', 10) }),
            prepareOccurrences([{ label: 'launch', kind: 'launch', from: '2026-09-01', to: '2026-09-30' }]),
            cal,
            NOW,
        );
        expect(model.lastWeek).to.not.equal(null);
        expect(model.levels.size).to.equal(0);
        expect(model.level).to.equal(0);
        expect(levelFor(model, dayOf('2026-09-14'))).to.equal(0);
        expect(model.learned.size).to.equal(0);
    });

    it('falls back to an even week without two clean weeks', () => {
        const model = fitSeries(
            prepareHistory({
                series: 's',
                hourly: [],
                daily: [
                    { date: '2026-09-06', value: 5 },
                    { date: '2026-09-07', value: 70 },
                    { date: '2026-09-15', value: 70 },
                    { date: '2026-09-23', value: 70 },
                ],
            }),
            [],
            cal,
            NOW,
        );
        expect(model.dayShare).to.deep.equal(Array(7).fill(1 / 7));
    });

    it('shrinks thin weekdays to the pooled shape, skips empty days, and needs a finished day for a shape', () => {
        const hourly: Array<{ at: number; value: number }> = [];
        for (let d = dayOf('2026-09-21'); d <= dayOf('2026-09-30'); d++) {
            const date = new Date(d * DAY_MS).toISOString().slice(0, 10);
            if (date === '2026-09-25') continue;
            for (let h = 0; h < 24; h++) hourly.push({ at: cal.midnight(date) + h * HOUR_MS, value: 1 });
        }
        const model = fitSeries(prepareHistory({ series: 's', hourly, daily: [] }), [], cal, NOW);
        expect(model.hasHourlyShape).to.equal(true);
        for (const v of model.hourShape) expect(v).to.be.closeTo(1 / 24, 1e-12);

        const todayOnly = fitSeries(
            prepareHistory({
                series: 's',
                hourly: [
                    { at: NOW - 2 * HOUR_MS, value: 3 },
                    { at: NOW - HOUR_MS, value: 4 },
                ],
                daily: [],
            }),
            [],
            cal,
            NOW,
        );
        expect(todayOnly.hasHourlyShape).to.equal(false);
        expect(todayOnly.span).to.equal(null);
    });

    it('skips weeks whose trend line is not positive when fitting a yearly factor', () => {
        const first = dayOf('2024-08-05');
        const weekly = Array.from({ length: 110 }, (_, i) => ({ monday: first + 7 * i, total: 2 * i - 10 }));
        const yearly = fitYearly(weekly);
        expect(yearly).to.not.equal(null);
        for (const f of yearly!.values()) expect(f).to.be.closeTo(1, 1e-9);
    });

    it('is deterministic: the same input fits the same numbers', () => {
        const options = { now: NOW, weeks: 20, weeklyTotal: 5000, growthPerWeek: 0.01, seed: 11 };
        const a = fit(options);
        const b = fit(options);
        expect(projectHour(a, cal, at('2026-10-14', 15))).to.deep.equal(projectHour(b, cal, at('2026-10-14', 15)));
        expect([a.level, a.trend, a.dayShare, a.hourShape]).to.deep.equal([b.level, b.trend, b.dayShare, b.hourShape]);
    });
});

describe('forecast model: review fixes', () => {
    const weekWeight = (() => {
        let w = 0;
        for (let d = 1; d <= 7; d++) for (let h = 0; h < 24; h++) w += officeShape(d, h);
        return w;
    })();
    const dayTruth = (weekday: number, weeklyTotal: number) => {
        let s = 0;
        for (let h = 0; h < 24; h++) s += officeShape(weekday, h);
        return (weeklyTotal * s) / weekWeight;
    };
    const nextWeek = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11'];
    const forecastDay = (model: ReturnType<typeof fitSeries>, calendar: ForecastCalendar, date: string) => {
        const next = new Date((dayOf(date) + 1) * DAY_MS).toISOString().slice(0, 10);
        let sum = 0;
        for (let t = calendar.midnight(date); t < calendar.midnight(next); t += HOUR_MS)
            sum += projectHour(model, calendar, t).likely;
        return sum;
    };

    for (const zone of ['America/Los_Angeles', 'Pacific/Auckland']) {
        it(`reads weekday shares on local days in ${zone}`, () => {
            const calendar = new ForecastCalendar(zone, NOW - 900 * DAY_MS, NOW + 200 * DAY_MS);
            const history = syntheticHistory({ now: NOW, weeks: 12, weeklyTotal: 7000, noise: false, timeZone: zone });
            const model = fitSeries(prepareHistory(history), [], calendar, NOW);
            nextWeek.forEach((date, i) => {
                const truthDay = dayTruth(i + 1, 7000);
                expect(forecastDay(model, calendar, date), `${zone} ${date}`).to.be.closeTo(truthDay, truthDay * 0.05);
            });
        });
    }

    for (const weeklyTotal of [30, 100]) {
        it(`keeps every busy hour in the shape of a sparse series (${weeklyTotal}/week)`, () => {
            const model = fit({ now: NOW, weeks: 16, weeklyTotal, seed: 3 });
            expect(model.hasHourlyShape).to.equal(true);
            for (const v of model.hourShape) expect(v).to.be.above(0);
            let office = 0;
            let all = 0;
            for (let h = 0; h < 24; h++) {
                all += officeShape(1, h);
                if (h >= 8 && h < 18) office += officeShape(1, h);
            }
            for (let wd = 0; wd < 7; wd++) {
                let share = 0;
                for (let h = 8; h < 18; h++) share += model.hourShape[wd * 24 + h];
                expect(share, `weekday ${wd + 1}`).to.be.closeTo(office / all, 0.1);
            }
        });
    }

    for (const weeklyTotal of [200, 700]) {
        it(`does not overfit one noisy occurrence (${weeklyTotal}/week)`, () => {
            for (const seed of [1, 2, 3]) {
                const model = fit(
                    {
                        now: NOW,
                        weeks: 16,
                        weeklyTotal,
                        seed,
                        events: [{ from: '2026-08-11', to: '2026-08-13', factor: 1.5 }],
                    },
                    [{ label: 'promo', kind: 'sale', from: '2026-08-11', to: '2026-08-13' }],
                );
                const effect = model.learned.get('promo')!;
                expect(effect.knockOn, `seed ${seed}`).to.deep.equal([]);
                expect(effect.size, `seed ${seed}`).to.be.within(1, 1.6);
                expect(effect.low).to.be.below(effect.size);
                expect(effect.high).to.be.above(effect.size);
            }
        });
    }

    const weekAhead = (model: ReturnType<typeof fitSeries>, monday: string) => {
        let week = 0;
        for (let d = 0; d < 7; d++)
            week += forecastDay(model, cal, new Date((dayOf(monday) + d) * DAY_MS).toISOString().slice(0, 10));
        return week;
    };
    const stepped = (weeks: number, from: string) =>
        fit({ now: NOW, weeks, weeklyTotal: 7000, noise: false, events: [{ from, to: '2030-12-31', factor: 1.3 }] });

    it('does not read a recent step as a yearly season on 60 weeks', () => {
        // +30 % from eight weeks ago, no season: every week ahead is 9,100.
        const model = stepped(60, '2026-08-06');
        expect(model.yearly).to.not.equal(null);
        for (const monday of ['2026-10-05', '2026-11-02', '2027-01-04'])
            expect(weekAhead(model, monday), monday).to.be.closeTo(9100, 9100 * 0.03);
    });

    it('does not extrapolate the yearly trend line past its whole years', () => {
        // 100 weeks, a +30 % step 20 weeks ago: last January must not read as deep low season.
        const model = stepped(100, '2026-05-14');
        for (const monday of ['2026-10-05', '2026-11-02', '2027-01-04'])
            expect(weekAhead(model, monday), monday).to.be.closeTo(9100, 9100 * 0.03);
    });

    it('keeps a real knock-on wave through the significance gate on a noisy 700/week series', () => {
        for (const seed of [2, 3, 4]) {
            const model = fit(
                {
                    now: NOW,
                    weeks: 16,
                    weeklyTotal: 700,
                    seed,
                    events: [{ from: '2026-08-10', to: '2026-08-12', factor: 1.5, knockOn: { days: 7, factor: 1.3 } }],
                },
                [{ label: 'sale', kind: 'sale', from: '2026-08-10', to: '2026-08-12' }],
            );
            const { knockOn } = model.learned.get('sale')!;
            // Weekend days expect too few tasks to clear 2.5σ and read as 1; the weekdays survive, shrunk a little.
            const wave = knockOn.filter((k) => k !== 1);
            expect(knockOn.length, `seed ${seed}`).to.be.at.least(3);
            expect(wave.length, `seed ${seed}`).to.be.at.least(3);
            for (const k of wave) expect(k, `seed ${seed}`).to.be.within(1.15, 1.45);
        }
    });

    it('learns nothing where the baseline expects under five tasks a day', () => {
        const occ = prepareOccurrences([{ label: 'thin', kind: 'sale', from: '2026-01-10', to: '2026-01-11' }]);
        expect(
            learnEffects(
                occ,
                () => 8,
                () => 4,
            ).size,
        ).to.equal(0);
    });
});
