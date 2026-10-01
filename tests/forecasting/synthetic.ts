/**
 * Seeded synthetic arrival histories for forecasting tests and the benchmark:
 * a weekly total, an hour-of-week shape in local time, optional growth, yearly
 * swing, events with a knock-on wave, and Poisson noise.
 */
import { ForecastCalendar, HOUR_MS } from '../../src/forecasting/calendar';
import { DAY_MS, dateOf, utcDay } from '../../src/forecasting/days';
import { createPrng, samplePoisson } from '../../src/forecasting/distributions';
import type { SeriesHistory } from '../../src/forecasting/types';

export interface SyntheticOptions {
    series?: string;
    timeZone?: string;
    /** "As of"; history ends at the hour before. */
    now: number;
    /** Weeks of daily history (hourly is kept for the last 16 of them). */
    weeks: number;
    /** Expected volume per week at `now`. */
    weeklyTotal: number;
    /** Relative growth per week (0.01 = +1 %/week), applied backwards from `now`. */
    growthPerWeek?: number;
    /** Yearly swing: volume × (1 + amplitude × cos(2π·(dayOfYear − peakDay)/365)). */
    yearly?: { amplitude: number; peakDay: number };
    /** Relative weight per local weekday (1–7) and hour (0–23). */
    shape?: (weekday: number, hour: number) => number;
    /** Multiplies the volume on these local dates; `knockOn` multiplies the days after `to`. */
    events?: Array<{ from: string; to: string; factor: number; knockOn?: { days: number; factor: number } }>;
    seed?: number;
    /** false = expected values exactly, no noise. */
    noise?: boolean;
    /** Keep only daily rows (an imported daily series). */
    dailyOnly?: boolean;
    /**
     * Day-level noise on top of Poisson: each local day's volume is multiplied by a mean-one lognormal
     * factor with this sigma (0.08 ≈ 8 %). Drawn from its own stream, so the Poisson draws do not move.
     */
    dayNoise?: number;
}

/** Office-hours shape: weekdays 8–18 busy, a little in the evening, quiet weekends. */
export const officeShape = (weekday: number, hour: number): number => {
    const day = weekday <= 5 ? 1 : 0.25;
    const h = hour >= 8 && hour < 18 ? (hour === 12 ? 1.4 : 1) : hour >= 18 && hour < 22 ? 0.3 : 0.05;
    return day * h;
};

export function syntheticHistory(options: SyntheticOptions): SeriesHistory {
    const zone = options.timeZone ?? 'Europe/Tallinn';
    const shape = options.shape ?? officeShape;
    const end = Math.floor(options.now / HOUR_MS) * HOUR_MS;
    const start = end - options.weeks * 7 * DAY_MS;
    const calendar = new ForecastCalendar(zone, start, end);
    const rand = createPrng(options.seed ?? 7);
    const dayRand = createPrng(((options.seed ?? 7) * 7919 + 13) >>> 0);
    const dayFactor = new Map<string, number>();
    const dayNoiseOf = (date: string): number => {
        const sigma = options.dayNoise ?? 0;
        if (sigma <= 0) return 1;
        let f = dayFactor.get(date);
        if (f === undefined) {
            const z = Math.sqrt(-2 * Math.log(1 - dayRand())) * Math.cos(2 * Math.PI * dayRand());
            dayFactor.set(date, (f = Math.exp(sigma * z - (sigma * sigma) / 2)));
        }
        return f;
    };
    // Normalise the shape over one local week so `weeklyTotal` is what a week sums to.
    let weekWeight = 0;
    for (let wd = 1; wd <= 7; wd++) for (let h = 0; h < 24; h++) weekWeight += shape(wd, h);

    const hourly: SeriesHistory['hourly'] = [];
    const daily = new Map<string, number>();
    const hourlyFrom = end - 16 * 7 * DAY_MS;
    for (let at = start; at < end; at += HOUR_MS) {
        const slot = calendar.slot(at);
        const weeksBack = (end - at) / (7 * DAY_MS);
        let mean = (options.weeklyTotal * shape(slot.weekday, slot.hour)) / weekWeight;
        mean *= Math.pow(1 + (options.growthPerWeek ?? 0), -weeksBack);
        if (options.yearly) {
            const doy = Math.floor(
                (Date.parse(`${slot.date}T00:00:00Z`) - Date.parse(`${slot.date.slice(0, 4)}-01-01T00:00:00Z`)) / DAY_MS,
            );
            mean *= 1 + options.yearly.amplitude * Math.cos((2 * Math.PI * (doy - options.yearly.peakDay)) / 365);
        }
        for (const e of options.events ?? []) {
            if (slot.date >= e.from && slot.date <= e.to) mean *= e.factor;
            if (e.knockOn) {
                const after = (Date.parse(`${slot.date}T00:00:00Z`) - Date.parse(`${e.to}T00:00:00Z`)) / DAY_MS;
                if (after >= 1 && after <= e.knockOn.days) mean *= e.knockOn.factor;
            }
        }
        mean *= dayNoiseOf(slot.date);
        const value = options.noise === false ? mean : samplePoisson(mean, rand);
        if (value <= 0) continue;
        if (at >= hourlyFrom && !options.dailyOnly) hourly.push({ at, value });
        const date = dateOf(utcDay(at));
        daily.set(date, (daily.get(date) ?? 0) + value);
    }
    return {
        series: options.series ?? '*',
        hourly,
        daily: [...daily].map(([date, value]) => ({ date, value })),
    };
}
