/**
 * The forecast model for one series: a weekly level with a damped trend, a
 * yearly factor once there is a year of history, the share of a week each
 * weekday carries, the share of a day each hour carries, and the effects of
 * holidays and events — each a plain number a planner can read back.
 *
 * Fitting reads only history strictly before `asOf`, so a rolling-origin
 * backtest is the same function called with an earlier `asOf`.
 *
 * Grains: level, trend, the yearly factor and effects read the daily table's
 * UTC days (`utcDayShare`, `expectedDay`); what an hour is forecast at reads
 * local days (`dayShare` and `hourShape` from hourly history), since a UTC day
 * is up to a day off a local one outside Europe. Shares are pooled ratios, not
 * medians, so a sparse series keeps its quiet hours; learned effects and
 * one-year yearly factors are shrunk towards 1 by their evidence.
 */
import { ForecastCalendar, HOUR_MS } from './calendar';
import { DAY_MS, dayOf, mondayOfDay, utcDay, weekOfYear, weekdayOf } from './days';
import { dayEffect, effectFor, learnEffects, specialDays, type DayEffect, type Occ } from './effects';
import type { HourComponents, LearnedEffect, SeriesHistory } from './types';
import { clamp, median } from './stats';

/** Level smoothing (recency weight), trend smoothing, trend damping per week. */
export const HOLT = { alpha: 0.35, beta: 0.1, phi: 0.9 } as const;
/** Weeks of daily history before a yearly factor is fitted (spec §7.1). */
export const YEARLY_MIN_WEEKS = 56;
/** Recent weeks the weekday and hour shapes are read from. */
const SHAPE_WEEKS = 8;
/** The largest weekly trend, as a share of the level. */
const MAX_TREND = 0.05;
/** A day this far off the model, relatively and in Poisson terms, is an outlier (and a spike candidate). */
export const OUTLIER = { relative: 0.35, sigmas: 3 } as const;

/** A series' history in the form the fit reads: dense daily totals and an hourly lookup. Built once per run. */
export interface PreparedHistory {
    series: string;
    /** Day number of `daily[0]`. */
    firstDay: number;
    /** Daily totals, one per day from `firstDay`; days the daily table lacks are filled from hourly rows. */
    daily: Float64Array;
    /** Hourly values by epoch ms. */
    hourly: Map<number, number>;
    /** Hourly points, oldest first. */
    hourlyPoints: Array<{ at: number; value: number }>;
}

export function prepareHistory(history: SeriesHistory): PreparedHistory {
    const days = new Map<number, number>();
    for (const p of history.daily) days.set(dayOf(p.date), p.value);
    const fromHourly = new Map<number, number>();
    const hourly = new Map<number, number>();
    for (const p of history.hourly) {
        hourly.set(p.at, (hourly.get(p.at) ?? 0) + p.value);
        const d = utcDay(p.at);
        fromHourly.set(d, (fromHourly.get(d) ?? 0) + p.value);
    }
    for (const [d, v] of fromHourly) if (!days.has(d)) days.set(d, v);
    let firstDay = Infinity;
    let lastDay = -Infinity;
    for (const d of days.keys()) {
        if (d < firstDay) firstDay = d;
        if (d > lastDay) lastDay = d;
    }
    if (!Number.isFinite(firstDay)) firstDay = lastDay = 0;
    const daily = new Float64Array(days.size > 0 ? lastDay - firstDay + 1 : 0);
    for (const [d, v] of days) daily[d - firstDay] = v;
    const hourlyPoints = [...hourly].map(([at, value]) => ({ at, value })).sort((a, b) => a.at - b.at);
    return { series: history.series, firstDay, daily, hourly, hourlyPoints };
}

export interface FittedSeries {
    series: string;
    asOf: number;
    history: PreparedHistory;
    /** First and last UTC day number of history used (inclusive); null for an empty series. */
    span: { from: number; to: number } | null;
    /**
     * Share of a week's volume per local ISO weekday (index 0 = Monday); sums to 1. Read from hourly
     * history on local days; a daily-only series falls back to `utcDayShare`. Drives `projectHour`.
     */
    dayShare: number[];
    /** Share of a week's volume per UTC weekday of the daily table; drives weekly totals and `expectedDay`. */
    utcDayShare: number[];
    /** Share of a day's volume per hour of the week; each weekday's 24 values sum to 1. */
    hourShape: number[];
    hasHourlyShape: boolean;
    /** Holt state after the last complete week, deseasonalised, per week. */
    level: number;
    trend: number;
    /** Monday (day number) of the last complete week fitted; null without one. */
    lastWeek: number | null;
    /** One-step-ahead level per fitted week (Monday → level), for in-sample expectations. */
    levels: Map<number, number>;
    /** Week-of-year (0–52) → factor; null under 56 weeks of history. */
    yearly: Map<number, number> | null;
    historyWeeks: number;
    /** Learned effects by label. */
    learned: Map<string, LearnedEffect>;
    /** Every occurrence and the effect it gets. */
    effects: Map<Occ, LearnedEffect>;
    occurrences: readonly Occ[];
}

/** Actual volume on a day inside the fitted span; null outside it. */
export function actualOn(model: FittedSeries, day: number): number | null {
    if (!model.span || day < model.span.from || day > model.span.to) return null;
    return model.history.daily[day - model.history.firstDay] ?? 0;
}

function spanOf(history: PreparedHistory, asOf: number): FittedSeries['span'] {
    const today = utcDay(asOf);
    for (let i = 0; i < history.daily.length; i++) {
        const day = history.firstDay + i;
        if (day >= today) break;
        if (history.daily[i] > 0) return { from: day, to: today - 1 };
    }
    return null;
}

/**
 * Share of a week per weekday as a pooled ratio (Σ weekday ÷ Σ week) over the
 * last clean weeks. A pooled ratio, not a median of per-week shares: a median
 * of shares is biased towards 0 wherever a day is empty in most weeks.
 * Null under two clean weeks.
 */
function pooledDayShare(weeks: ReadonlyArray<readonly number[]>): number[] | null {
    const sums = Array(7).fill(0);
    let total = 0;
    let used = 0;
    for (const days of weeks.slice(-SHAPE_WEEKS)) {
        const week = days.reduce((a, b) => a + b, 0);
        if (week <= 0) continue;
        days.forEach((v, i) => (sums[i] += v));
        total += week;
        used += 1;
    }
    return used < 2 ? null : sums.map((v) => v / total);
}

/** Weekday shares of the daily table's UTC days, for weekly totals and in-sample expectations. */
function fitUtcDayShare(weeks: number[], history: PreparedHistory, special: Set<number>): number[] {
    const at = (d: number) => history.daily[d - history.firstDay] ?? 0;
    const clean = weeks.filter((monday) => [0, 1, 2, 3, 4, 5, 6].every((i) => !special.has(monday + i)));
    return (
        pooledDayShare(clean.map((monday) => Array.from({ length: 7 }, (_, i) => at(monday + i)))) ?? Array(7).fill(1 / 7)
    );
}

/** Tasks' worth of pseudo-count spread evenly over the 24 hours of the pooled shape, so a sparse series keeps every hour. */
const HOUR_PRIOR = 12;
/** Tasks a weekday needs before its own hour shape outweighs the pooled one (weight n / (n + HOUR_SHRINK)). */
const HOUR_SHRINK = 20;

/**
 * The shapes read from hourly history on local days: the share of a day each
 * local hour carries per weekday, and the share of a week each local weekday
 * carries (null without two complete clean local weeks — the UTC table's
 * shares stand in then; a UTC day is up to a day off a local one outside
 * Europe, so hourly history is the only honest source for local weekdays).
 *
 * Hour shares are pooled ratios (Σ hour ÷ Σ day), shrunk towards the shape of
 * all weekdays together by how many tasks the weekday saw, and that pooled
 * shape carries a small even prior: medians of per-day shares collapse to 0
 * on a sparse series, where most days have no task in a given hour.
 */
function fitLocalShapes(
    history: PreparedHistory,
    asOf: number,
    calendar: ForecastCalendar,
    special: Set<number>,
): { shape: number[]; has: boolean; dayShare: number[] | null } {
    const none = { shape: Array(168).fill(1 / 24), has: false, dayShare: null };
    const from = asOf - SHAPE_WEEKS * 7 * DAY_MS;
    const points = history.hourlyPoints.filter((p) => p.at >= from && p.at < asOf);
    if (points.length === 0) return none;
    const today = calendar.slot(Math.floor(asOf / HOUR_MS) * HOUR_MS).day;
    const firstAt = Math.ceil(points[0].at / HOUR_MS) * HOUR_MS;
    // The first local day is partial (the window or the series starts mid-day).
    const partial = calendar.slot(firstAt).day;
    const byDay = new Map<number, { weekday: number; hours: number[] }>();
    // Every local day from the first hourly point on counts, busy or not: a missing hour is a zero.
    for (let at = firstAt; at < asOf; at += HOUR_MS) {
        const slot = calendar.slot(at);
        if (slot.day === partial || slot.day >= today || special.has(slot.day) || byDay.has(slot.day)) continue;
        byDay.set(slot.day, { weekday: slot.weekday, hours: Array(24).fill(0) });
    }
    for (const p of points) {
        const slot = calendar.slot(p.at);
        const day = byDay.get(slot.day);
        if (day) day.hours[slot.hour] += p.value;
    }
    const sums: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    const totals = Array(7).fill(0);
    const pooled = Array(24).fill(0);
    let all = 0;
    const weeks = new Map<number, number[]>();
    for (const [dayNumber, day] of byDay) {
        const total = day.hours.reduce((a, b) => a + b, 0);
        const monday = dayNumber - (day.weekday - 1);
        let week = weeks.get(monday);
        if (!week) weeks.set(monday, (week = Array(7).fill(Number.NaN)));
        week[day.weekday - 1] = total;
        day.hours.forEach((v, h) => {
            sums[day.weekday - 1][h] += v;
            pooled[h] += v;
        });
        totals[day.weekday - 1] += total;
        all += total;
    }
    if (all <= 0) return none;
    const base = pooled.map((v) => (v + HOUR_PRIOR / 24) / (all + HOUR_PRIOR));
    const shape: number[] = [];
    for (let wd = 0; wd < 7; wd++) {
        const n = totals[wd];
        const w = n / (n + HOUR_SHRINK);
        for (let h = 0; h < 24; h++) shape.push(n > 0 ? w * (sums[wd][h] / n) + (1 - w) * base[h] : base[h]);
    }
    const complete = [...weeks.keys()]
        .sort((a, b) => a - b)
        .map((monday) => weeks.get(monday)!)
        .filter((week) => week.every((v) => Number.isFinite(v)));
    return { shape, has: true, dayShare: pooledDayShare(complete) };
}

/** Weight of a week-of-year factor seen in `years` distinct years: 1 year → ½, 2 → ⅔, 3 → ¾. */
const yearlyWeight = (years: number): number => years / (years + 1);

/**
 * Yearly factor per week of year, once ≥ 56 weeks of weekly totals exist.
 * Each week is read against a straight trend line fitted over whole years
 * only (the most recent 52·k weeks), so the season cancels out of the slope
 * and a growing series does not read its latest weeks as "high season".
 * Neighbouring weeks of the year are pooled (±1) and the factors normalised
 * to average 1.
 */
export function fitYearly(weekly: ReadonlyArray<{ monday: number; total: number }>): Map<number, number> | null {
    const known = weekly.filter((w) => Number.isFinite(w.total));
    if (known.length === 0) return null;
    const last = known[known.length - 1].monday;
    const spanWeeks = (last - known[0].monday) / 7 + 1;
    if (spanWeeks < YEARLY_MIN_WEEKS) return null;
    const years = Math.floor(spanWeeks / 52);
    const window = known.filter((w) => (last - w.monday) / 7 < 52 * years);
    const t = (monday: number) => (monday - last) / 7;
    const windowStart = t(window[0].monday);
    const mx = window.reduce((s, w) => s + t(w.monday), 0) / window.length;
    const my = window.reduce((s, w) => s + w.total, 0) / window.length;
    let sxy = 0;
    let sxx = 0;
    for (const w of window) {
        sxy += (t(w.monday) - mx) * (w.total - my);
        sxx += (t(w.monday) - mx) ** 2;
    }
    const slope = sxx > 0 ? sxy / sxx : 0;
    const ratios = new Map<number, number[]>();
    const yearsSeen = new Map<number, Set<number>>();
    for (const w of known) {
        // Weeks older than the whole-years window read the line at its start: a
        // slope extrapolated backwards (a recent step makes it steep) would read
        // an ordinary old week as deep season.
        const line = my + slope * (Math.max(t(w.monday), windowStart) - mx);
        if (line <= 0) continue;
        const k = weekOfYear(w.monday);
        for (const near of [k - 1, k, k + 1]) {
            const key = (near + 53) % 53;
            let list = ratios.get(key);
            if (!list) ratios.set(key, (list = []));
            list.push(w.total / line);
            let seen = yearsSeen.get(key);
            if (!seen) yearsSeen.set(key, (seen = new Set()));
            seen.add(Math.floor((last - w.monday) / 364));
        }
    }
    const factors = new Map<number, number>();
    for (const [k, rs] of ratios) {
        // One year behind a week of the year cannot tell a season from a step
        // that happened to land there: trust it by `yearlyWeight`.
        const f = clamp(median(rs), 0.3, 3);
        factors.set(k, 1 + (f - 1) * yearlyWeight(yearsSeen.get(k)!.size));
    }
    if (factors.size === 0) return null;
    const avg = [...factors.values()].reduce((a, b) => a + b, 0) / factors.size;
    for (const [k, f] of factors) factors.set(k, f / avg);
    return factors;
}

/** Fits one series as of `asOf`, then once more without its outlier days. */
export function fitSeries(
    history: PreparedHistory,
    occurrences: readonly Occ[],
    calendar: ForecastCalendar,
    asOf: number,
): FittedSeries {
    const first = fitWith(history, occurrences, calendar, asOf, new Set());
    const outliers = outlierDays(first);
    if (outliers.size === 0) return first;
    // Known cost: a genuine step change in the most recent week is flagged as outliers on the first pass and left out here, so the level lags it by a week; the nowcast and "What was this?" spans are where a fresh step shows.
    // One refit with the outliers left out, so an unexplained spike cannot
    // drag the level (and hide itself) before anybody has named it.
    return fitWith(history, occurrences, calendar, asOf, outliers);
}

/** Whether an actual is far enough from an expectation to be unexplained. */
export function isOutlier(actual: number, expected: number): boolean {
    if (expected < 1) return false;
    const off = Math.abs(actual - expected);
    return off >= OUTLIER.relative * expected && off >= OUTLIER.sigmas * Math.sqrt(expected);
}

/** Expected volume on a day with every known holiday and event applied. */
export function explainedDay(model: FittedSeries, day: number): number {
    const effect = effectOn(model, day);
    let e = expectedDay(model, day) * effect.holiday;
    for (const ev of effect.events) e *= ev.factor;
    return e;
}

function outlierDays(model: FittedSeries): Set<number> {
    const out = new Set<number>();
    if (!model.span || model.level <= 0) return out;
    const special = specialDays(model.occurrences);
    for (let day = model.span.from + 1; day <= model.span.to; day++) {
        if (special.has(day)) continue;
        if (isOutlier(actualOn(model, day) ?? 0, explainedDay(model, day))) out.add(day);
    }
    return out;
}

function fitWith(
    history: PreparedHistory,
    occurrences: readonly Occ[],
    calendar: ForecastCalendar,
    asOf: number,
    outliers: Set<number>,
): FittedSeries {
    const span = spanOf(history, asOf);
    const special = specialDays(occurrences);
    for (const day of outliers) special.add(day);
    // History rarely starts at midnight: the first day is partial by construction.
    if (span) special.add(span.from);
    const local = fitLocalShapes(history, asOf, calendar, special);
    const { shape: hourShape, has: hasHourlyShape } = local;
    const base: FittedSeries = {
        series: history.series,
        asOf,
        history,
        span,
        dayShare: Array(7).fill(1 / 7),
        utcDayShare: Array(7).fill(1 / 7),
        hourShape,
        hasHourlyShape,
        level: 0,
        trend: 0,
        lastWeek: null,
        levels: new Map(),
        yearly: null,
        historyWeeks: 0,
        learned: new Map(),
        effects: new Map(),
        occurrences,
    };
    if (!span) return withEffects(base);

    let monday = mondayOfDay(span.from);
    if (monday < span.from) monday += 7;
    const weeks: number[] = [];
    for (; monday + 6 <= span.to; monday += 7) weeks.push(monday);
    const utcDayShare = fitUtcDayShare(weeks, history, special);
    const at = (d: number) => history.daily[d - history.firstDay] ?? 0;
    const weekly = weeks.map((m) => {
        let sum = 0;
        let covered = 0;
        for (let i = 0; i < 7; i++) {
            if (special.has(m + i)) continue;
            sum += at(m + i);
            covered += utcDayShare[i];
        }
        return { monday: m, total: covered >= 0.35 ? sum / covered : Number.NaN };
    });
    const yearly = fitYearly(weekly);
    const season = (m: number) => yearly?.get(weekOfYear(m)) ?? 1;

    let level = Number.NaN;
    let trend = 0;
    const levels = new Map<number, number>();
    for (const w of weekly) {
        if (!Number.isFinite(w.total)) {
            if (Number.isFinite(level)) {
                level = Math.max(0, level + HOLT.phi * trend);
                trend *= HOLT.phi;
                levels.set(w.monday, level);
            }
            continue;
        }
        const x = w.total / season(w.monday);
        if (!Number.isFinite(level)) {
            level = x;
            levels.set(w.monday, level);
            continue;
        }
        const previous = level;
        // The in-sample expectation for a week is the one-step-ahead forecast,
        // made before the week is seen: a week never explains itself.
        levels.set(w.monday, Math.max(0, level + HOLT.phi * trend));
        level = Math.max(0, HOLT.alpha * x + (1 - HOLT.alpha) * (level + HOLT.phi * trend));
        trend = HOLT.beta * (level - previous) + (1 - HOLT.beta) * HOLT.phi * trend;
        trend = clamp(trend, -MAX_TREND * level, MAX_TREND * level);
    }
    if (!Number.isFinite(level)) {
        // Under a week of history: the ordinary days there are, as a weekly rate.
        let sum = 0;
        let n = 0;
        for (let d = span.from; d <= span.to; d++) {
            if (special.has(d)) continue;
            sum += at(d);
            n += 1;
        }
        level = n > 0 ? (sum / n) * 7 : 0;
        trend = 0;
    }
    return withEffects({
        ...base,
        dayShare: local.dayShare ?? utcDayShare,
        utcDayShare,
        level,
        trend,
        lastWeek: weeks.length > 0 ? weeks[weeks.length - 1] : null,
        levels,
        yearly,
        historyWeeks: weeks.length,
    });
}

/** Learns effects from past occurrences against the fitted baseline, and resolves every occurrence's effect. */
function withEffects(model: FittedSeries): FittedSeries {
    const today = utcDay(model.asOf);
    const past = model.occurrences.filter((occ) => occ.from < today);
    const learned = learnEffects(
        past,
        (day) => actualOn(model, day),
        (day) => expectedDay(model, day),
    );
    const effects = new Map<Occ, LearnedEffect>();
    for (const occ of model.occurrences) effects.set(occ, effectFor(occ.o, learned));
    return { ...model, learned, effects };
}

/** Deseasonalised weekly level for a week: one-step-ahead in-sample, damped trend beyond. */
export function levelFor(model: FittedSeries, monday: number): number {
    const k = model.lastWeek === null ? 1 : Math.round((monday - model.lastWeek) / 7);
    if (k <= 0) {
        const fitted = model.levels.get(monday);
        if (fitted !== undefined) return fitted;
        const first = model.levels.values().next();
        return first.done ? model.level : first.value;
    }
    let damp = 0;
    let phi = 1;
    for (let i = 1; i <= k; i++) {
        phi *= HOLT.phi;
        damp += phi;
    }
    return Math.max(0, model.level + damp * model.trend);
}

export function seasonFor(model: FittedSeries, monday: number): number {
    return model.yearly?.get(weekOfYear(monday)) ?? 1;
}

/**
 * Baseline volume for a UTC day of the daily table — level × season × UTC weekday share, no holiday
 * or event. It is the in-sample yardstick effects and outliers are judged against, so it reads the
 * table's own grain; an hour's local forecast is `projectHour`.
 */
export function expectedDay(model: FittedSeries, day: number): number {
    const monday = mondayOfDay(day);
    return levelFor(model, monday) * seasonFor(model, monday) * model.utcDayShare[weekdayOf(day) - 1];
}

export function effectOn(model: FittedSeries, day: number): DayEffect {
    return dayEffect(day, model.occurrences, model.effects);
}

/** One hour's expectation with its components (nowcast 1). */
export function projectHour(
    model: FittedSeries,
    calendar: ForecastCalendar,
    at: number,
): { likely: number; low: number; high: number; components: HourComponents } {
    const slot = calendar.slot(at);
    const monday = mondayOfDay(slot.day);
    const share = model.dayShare[slot.weekday - 1] * model.hourShape[slot.how];
    const current = model.level;
    const ahead = levelFor(model, monday);
    const season = seasonFor(model, monday);
    const effect = effectOn(model, slot.day);
    let factor = 1;
    let low = 1;
    let high = 1;
    for (const e of effect.events) {
        factor *= e.factor;
        low *= e.low;
        high *= e.high;
    }
    const plain = ahead * share * season * effect.holiday;
    return {
        likely: plain * factor,
        // Holiday uncertainty is not in low/high (DayEffect.holiday carries a factor only), so a first-time default holiday's wide range is not shown here; the backtest ranges must cover it.
        low: plain * Math.min(low, factor),
        high: plain * Math.max(high, factor),
        components: {
            base: current * share,
            trend: current > 0 ? ahead / current : 1,
            season,
            holiday: effect.holiday,
            events: effect.events.map(({ label, factor: f }) => ({ label, factor: f })),
            nowcast: 1,
        },
    };
}
