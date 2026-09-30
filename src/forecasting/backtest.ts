/**
 * How wrong the model has been, measured the only honest way: refit it as of
 * earlier days (rolling origins, one a week back from today) and compare what
 * it would have said with what happened. The spread of those errors by lead
 * time is the forecast's range; their size is its accuracy (WAPE).
 *
 * Forecast and actual are always compared on the same grain. Where the hourly
 * table reaches back to an origin, ranges are read hour against hour and WAPE
 * on local-day sums of those hours (what a planner reads as "the day"); an
 * origin the hourly table does not reach is judged on UTC days of
 * `explainedDay` against the daily table's UTC days. A UTC actual is never set
 * against a local-day sum.
 *
 * Ranges are a negative binomial around the forecast: variance `f + c·f²`,
 * Poisson counting noise plus a relative model error `c` fitted per lead
 * bucket by moments, `c = max(0, Σ((a − f)² − f) ÷ Σf²)`. A ratio quantile of
 * hours reads a quiet hour's Poisson noise as model error and spreads it over
 * every busy hour, which is why ranges are not built that way.
 */
import { ForecastCalendar, HOUR_MS } from './calendar';
import { DAY_MS, dateOf, mondayOfDay, utcDay } from './days';
import type { Occ } from './effects';
import { explainedDay, fitSeries, projectHour, type PreparedHistory } from './model';
import type { ForecastAccuracy, LeadBucket } from './types';
import { quantileSorted } from './stats';

export const LEAD_BUCKETS: ReadonlyArray<{ bucket: LeadBucket; toHours: number }> = [
    { bucket: '24h', toHours: 24 },
    { bucket: '72h', toHours: 72 },
    { bucket: '7d', toHours: 168 },
    { bucket: '28d', toHours: 672 },
];
/**
 * Relative model error `c` used until a bucket has enough backtest samples: a p10–p90 of roughly ±20 %
 * at 24 hours widening to ±40 % at 28 days, on top of Poisson noise.
 */
export const DEFAULT_DISPERSION: Record<LeadBucket, number> = { '24h': 0.025, '72h': 0.035, '7d': 0.055, '28d': 0.1 };
/** Weekly total [p10, p90] of actual ÷ forecast, and the weekly `c`, used until four weeks were judged. */
export const DEFAULT_WEEK_RANGE: [number, number] = [0.85, 1.18];
export const DEFAULT_WEEK_DISPERSION = 0.015;
/** Samples a bucket needs before its own dispersion replaces the default. */
const MIN_SAMPLES = 48;
/** Complete weeks the weekly range and dispersion need. */
const MIN_WEEKS = 4;
/** An origin needs this many days of history before it. */
const MIN_HISTORY_DAYS = 21;
/** A 72-hour WAPE above this makes the forecast low confidence. */
export const HIGH_ERROR_WAPE = 0.35;
const HORIZON_HOURS = 672;

export interface BacktestResult {
    accuracy: Omit<ForecastAccuracy, 'lowConfidence' | 'reasons'>;
    /** Per lead bucket: relative model error `c` (variance = f + c·f²). */
    dispersion: Record<LeadBucket, number>;
    /** Weekly total [p10, p90] of actual ÷ forecast, from complete weeks after each origin. */
    weekRange: [number, number];
    /** Relative model error `c` of weekly totals. */
    weekDispersion: number;
}

/** What a series that is not backtested reports: nothing measured, the total's ranges. */
export function borrowed(from: BacktestResult): BacktestResult {
    const none = { '24h': null, '72h': null, '7d': null, '28d': null };
    return {
        accuracy: { wape: none, origins: 0, rangesFrom: from.accuracy.rangesFrom === 'own' ? 'total' : 'default' },
        dispersion: from.dispersion,
        weekRange: from.weekRange,
        weekDispersion: from.weekDispersion,
    };
}

export const bucketOf = (leadHours: number): LeadBucket =>
    (LEAD_BUCKETS.find((b) => leadHours < b.toHours) ?? LEAD_BUCKETS[LEAD_BUCKETS.length - 1]).bucket;

const perBucket = (): Record<LeadBucket, number> => ({ '24h': 0, '72h': 0, '7d': 0, '28d': 0 });

/** Moment estimate of the negative binomial's `c`; 0 when the errors are no larger than Poisson. */
const dispersionOf = (excess: number, squares: number): number => (squares > 0 ? Math.max(0, excess / squares) : 0);

interface Tally {
    /** Range samples: Σ((a − f)² − f), Σf², count. */
    excess: Record<LeadBucket, number>;
    squares: Record<LeadBucket, number>;
    samples: Record<LeadBucket, number>;
    /** Error samples: Σ|a − f|, Σa. */
    abs: Record<LeadBucket, number>;
    act: Record<LeadBucket, number>;
}

/** One sample of the range: an hour (or, on the daily grain, a UTC day). */
function judgeRange(tally: Tally, bucket: LeadBucket, a: number, f: number): void {
    if (f <= 0) return;
    tally.excess[bucket] += (a - f) ** 2 - f;
    tally.squares[bucket] += f * f;
    tally.samples[bucket] += 1;
}

/** One sample of the error: a local day of hours (or, on the daily grain, a UTC day). */
function judgeError(tally: Tally, bucket: LeadBucket, a: number, f: number): void {
    tally.abs[bucket] += Math.abs(a - f);
    tally.act[bucket] += a;
}

export function backtest(
    history: PreparedHistory,
    occurrences: readonly Occ[],
    calendar: ForecastCalendar,
    now: number,
    origins: number,
): BacktestResult {
    const firstHour = history.hourlyPoints.length > 0 ? history.hourlyPoints[0].at : Infinity;
    const earliest = history.daily.length > 0 ? history.firstDay * DAY_MS : Infinity;
    const tally: Tally = {
        excess: perBucket(),
        squares: perBucket(),
        samples: perBucket(),
        abs: perBucket(),
        act: perBucket(),
    };
    const weekRatios: number[] = [];
    let weekExcess = 0;
    let weekSquares = 0;
    let judged = 0;

    const today = calendar.slot(Math.floor(now / HOUR_MS) * HOUR_MS);
    const todayMidnight = calendar.midnight(today.date);
    for (let j = 1; j <= origins; j++) {
        // Local midnight 7·j days back; the calendar settles any DST hour in between.
        const origin = calendar.midnight(calendar.slot(todayMidnight - 7 * j * DAY_MS + 12 * HOUR_MS).date);
        if (!Number.isFinite(earliest) || origin - earliest < MIN_HISTORY_DAYS * DAY_MS) continue;
        const model = fitSeries(history, occurrences, calendar, origin);
        if (model.level <= 0) continue;
        judged += 1;
        const horizonEnd = origin + HORIZON_HOURS * HOUR_MS;
        // Weekly totals on the comparison's own grain, for weeks after the origin's.
        const weekSums = new Map<number, { a: number; f: number; end: number }>();
        const addWeek = (week: number, end: number, a: number, f: number) => {
            const sum = weekSums.get(week) ?? { a: 0, f: 0, end };
            sum.a += a;
            sum.f += f;
            weekSums.set(week, sum);
        };
        if (firstHour <= origin) {
            const originWeek = mondayOfDay(calendar.slot(origin).day);
            let day = { day: calendar.slot(origin).day, lead: 0, a: 0, f: 0 };
            for (let h = 0; h < HORIZON_HOURS; h++) {
                const at = origin + h * HOUR_MS;
                if (at >= now) break;
                const slot = calendar.slot(at);
                if (slot.day !== day.day) {
                    // A local day is complete: its sum is one error sample. The last, cut-off day never is.
                    judgeError(tally, bucketOf(day.lead), day.a, day.f);
                    day = { day: slot.day, lead: h, a: 0, f: 0 };
                }
                const f = projectHour(model, calendar, at).likely;
                const a = history.hourly.get(at) ?? 0;
                judgeRange(tally, bucketOf(h), a, f);
                day.a += a;
                day.f += f;
                const week = mondayOfDay(slot.day);
                if (week > originWeek) addWeek(week, calendar.midnight(dateOf(week + 7)), a, f);
            }
        } else {
            // The hourly table does not reach back this far: judge whole UTC days of the daily table.
            const originWeek = mondayOfDay(utcDay(origin));
            for (let day = Math.ceil(origin / DAY_MS); (day + 1) * DAY_MS <= now; day++) {
                const lead = (day * DAY_MS - origin) / HOUR_MS;
                if (lead >= HORIZON_HOURS) break;
                const f = explainedDay(model, day);
                const a = history.daily[day - history.firstDay] ?? 0;
                judgeRange(tally, bucketOf(lead), a, f);
                judgeError(tally, bucketOf(lead), a, f);
                const week = mondayOfDay(day);
                if (week > originWeek) addWeek(week, (week + 7) * DAY_MS, a, f);
            }
        }
        for (const sum of weekSums.values()) {
            // A week `now` or the horizon cuts is partly elapsed: not a week's error.
            if (sum.end > now || sum.end > horizonEnd || sum.f < 1) continue;
            weekRatios.push(sum.a / sum.f);
            weekExcess += (sum.a - sum.f) ** 2 - sum.f;
            weekSquares += sum.f * sum.f;
        }
    }

    const dispersion = {} as Record<LeadBucket, number>;
    const wape = {} as Record<LeadBucket, number | null>;
    for (const { bucket } of LEAD_BUCKETS) {
        dispersion[bucket] =
            tally.samples[bucket] >= MIN_SAMPLES
                ? dispersionOf(tally.excess[bucket], tally.squares[bucket])
                : DEFAULT_DISPERSION[bucket];
        wape[bucket] = tally.act[bucket] > 0 ? Math.round((tally.abs[bucket] / tally.act[bucket]) * 1000) / 1000 : null;
    }
    const weeks = weekRatios.sort((a, b) => a - b);
    const enoughWeeks = weeks.length >= MIN_WEEKS;
    const weekRange: [number, number] = enoughWeeks
        ? [Math.min(1, quantileSorted(weeks, 0.1)), Math.max(1, quantileSorted(weeks, 0.9))]
        : DEFAULT_WEEK_RANGE;
    const own = LEAD_BUCKETS.some(({ bucket }) => tally.samples[bucket] >= MIN_SAMPLES);
    return {
        accuracy: { wape, origins: judged, rangesFrom: own ? 'own' : 'default' },
        dispersion,
        weekRange,
        weekDispersion: enoughWeeks ? dispersionOf(weekExcess, weekSquares) : DEFAULT_WEEK_DISPERSION,
    };
}
