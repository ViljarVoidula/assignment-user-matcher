/**
 * How wrong the model has been, measured the only honest way: refit it as of
 * earlier days (rolling origins, one a week back from today) and compare what
 * it would have said with what happened. The spread of those errors by lead
 * time is the forecast's range; their size is its accuracy (WAPE).
 *
 * Forecast and actual are always compared on the same grain: an hour of
 * `projectHour` against the hourly table's hour, or — for an origin the hourly
 * table does not reach back to — a UTC day of `explainedDay` against the daily
 * table's UTC day. A UTC actual is never set against a local-day sum.
 */
import { ForecastCalendar, HOUR_MS } from './calendar';
import { DAY_MS, mondayOfDay, utcDay } from './days';
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
/** Ratio ranges used until a bucket has enough backtest samples (actual ÷ forecast, p10 / p90). */
export const DEFAULT_RANGES: Record<LeadBucket, [number, number]> = {
    '24h': [0.8, 1.25],
    '72h': [0.75, 1.33],
    '7d': [0.7, 1.4],
    '28d': [0.6, 1.6],
};
export const DEFAULT_WEEK_RANGE: [number, number] = [0.85, 1.18];
/** Samples a bucket needs before its own spread replaces the default. */
const MIN_SAMPLES = 48;
/** An origin needs this many days of history before it. */
const MIN_HISTORY_DAYS = 21;
/** A 72-hour WAPE above this makes the forecast low confidence. */
export const HIGH_ERROR_WAPE = 0.35;
const HORIZON_HOURS = 672;

export interface BacktestResult {
    accuracy: Omit<ForecastAccuracy, 'lowConfidence' | 'reasons'>;
    /** Per lead bucket: [p10, p90] of actual ÷ forecast per hour. */
    ranges: Record<LeadBucket, [number, number]>;
    /** Weekly total [p10, p90] of actual ÷ forecast, for weeks 1–4 ahead. */
    weekRange: [number, number];
}

/** What a series that is not backtested reports: nothing measured, the total's ranges. */
export function borrowed(from: BacktestResult): BacktestResult {
    const none = { '24h': null, '72h': null, '7d': null, '28d': null };
    return {
        accuracy: { wape: none, origins: 0, rangesFrom: from.accuracy.rangesFrom === 'own' ? 'total' : 'default' },
        ranges: from.ranges,
        weekRange: from.weekRange,
    };
}

export const bucketOf = (leadHours: number): LeadBucket =>
    (LEAD_BUCKETS.find((b) => leadHours < b.toHours) ?? LEAD_BUCKETS[LEAD_BUCKETS.length - 1]).bucket;

interface Tally {
    ratios: Record<LeadBucket, number[]>;
    abs: Record<LeadBucket, number>;
    act: Record<LeadBucket, number>;
}

function judge(tally: Tally, bucket: LeadBucket, a: number, f: number): void {
    tally.abs[bucket] += Math.abs(a - f);
    tally.act[bucket] += a;
    if (f >= 0.5) tally.ratios[bucket].push(a / f);
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
        ratios: { '24h': [], '72h': [], '7d': [], '28d': [] },
        abs: { '24h': 0, '72h': 0, '7d': 0, '28d': 0 },
        act: { '24h': 0, '72h': 0, '7d': 0, '28d': 0 },
    };
    const weekRatios: number[] = [];
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
        // Weekly totals of the same grain as the comparison: local weeks of hours, or UTC weeks of days.
        const weekSums = new Map<number, { a: number; f: number }>();
        const addWeek = (week: number, a: number, f: number) => {
            const sum = weekSums.get(week) ?? { a: 0, f: 0 };
            sum.a += a;
            sum.f += f;
            weekSums.set(week, sum);
        };
        if (firstHour <= origin) {
            const originWeek = mondayOfDay(calendar.slot(origin).day);
            for (let h = 0; h < HORIZON_HOURS; h++) {
                const at = origin + h * HOUR_MS;
                if (at >= now) break;
                const f = projectHour(model, calendar, at).likely;
                const a = history.hourly.get(at) ?? 0;
                judge(tally, bucketOf(h), a, f);
                const week = mondayOfDay(calendar.slot(at).day);
                if (week > originWeek) addWeek(week, a, f);
            }
        } else {
            // The hourly table does not reach back this far: judge whole UTC days of the daily table.
            const originWeek = mondayOfDay(utcDay(origin));
            for (let day = Math.ceil(origin / DAY_MS); (day + 1) * DAY_MS <= now; day++) {
                const lead = (day * DAY_MS - origin) / HOUR_MS;
                if (lead >= HORIZON_HOURS) break;
                const f = explainedDay(model, day);
                const a = history.daily[day - history.firstDay] ?? 0;
                judge(tally, bucketOf(lead), a, f);
                if (mondayOfDay(day) > originWeek) addWeek(mondayOfDay(day), a, f);
            }
        }
        for (const sum of weekSums.values()) if (sum.f >= 1) weekRatios.push(sum.a / sum.f);
    }

    const ranges = {} as Record<LeadBucket, [number, number]>;
    const wape = {} as Record<LeadBucket, number | null>;
    for (const { bucket } of LEAD_BUCKETS) {
        const sorted = tally.ratios[bucket].sort((a, b) => a - b);
        ranges[bucket] =
            sorted.length >= MIN_SAMPLES
                ? [Math.min(1, quantileSorted(sorted, 0.1)), Math.max(1, quantileSorted(sorted, 0.9))]
                : DEFAULT_RANGES[bucket];
        wape[bucket] = tally.act[bucket] > 0 ? Math.round((tally.abs[bucket] / tally.act[bucket]) * 1000) / 1000 : null;
    }
    const weeks = weekRatios.sort((a, b) => a - b);
    const weekRange: [number, number] =
        weeks.length >= 4
            ? [Math.min(1, quantileSorted(weeks, 0.1)), Math.max(1, quantileSorted(weeks, 0.9))]
            : DEFAULT_WEEK_RANGE;
    const own = LEAD_BUCKETS.some(({ bucket }) => tally.ratios[bucket].length >= MIN_SAMPLES);
    return { accuracy: { wape, origins: judged, rangesFrom: own ? 'own' : 'default' }, ranges, weekRange };
}
