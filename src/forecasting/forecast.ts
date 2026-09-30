/**
 * `forecastWorkspace` — every series of one workspace, forecast hourly for the
 * next weeks and weekly out to six months, with ranges from its own backtests,
 * its accuracy, the effects it learned, and the recent spikes nobody has
 * explained. Deterministic: the same history, occurrences and `now` give the
 * same numbers.
 *
 * Everything shown by local date is a sum of `projectHour` over that date's
 * local hours — a week row is its 167, 168 or 169 hours added up — so the
 * hours and the weeks a planner reads can never disagree.
 */
import { backtest, borrowed, bucketOf, HIGH_ERROR_WAPE, type BacktestResult } from './backtest';
import { ForecastCalendar, HOUR_MS } from './calendar';
import { DAY_MS, dateOf, mondayOfDay, utcDay } from './days';
import { prepareOccurrences } from './effects';
import { fitSeries, prepareHistory, projectHour, seasonFor, type FittedSeries, type PreparedHistory } from './model';
import { applyNowcast } from './nowcast';
import { detectSpikes } from './spikes';
import type { ForecastWorkspaceInput, ForecastWorkspaceResult, HourForecast, SeriesForecast, WeekForecast } from './types';
import { round } from './stats';

export const DEFAULT_HORIZON_HOURS = 672;
export const DEFAULT_HORIZON_WEEKS = 26;
export const DEFAULT_BACKTEST_ORIGINS = 6;
export const DEFAULT_BACKTEST_SERIES = 10;
/** One-sided z for p10/p90 under Poisson noise: the range is never narrower than counting noise. */
const Z90 = 1.2816;
/** Under this many complete weeks of history the forecast is low confidence. */
const SHORT_HISTORY_WEEKS = 4;

export function forecastWorkspace(input: ForecastWorkspaceInput): ForecastWorkspaceResult {
    const started = Date.now();
    const horizonHours = input.horizonHours ?? DEFAULT_HORIZON_HOURS;
    const horizonWeeks = input.horizonWeeks ?? DEFAULT_HORIZON_WEEKS;
    const origins = input.backtestOrigins ?? DEFAULT_BACKTEST_ORIGINS;
    const occurrences = prepareOccurrences(input.occurrences ?? []);
    const prepared = input.series.map(prepareHistory);
    // The calendar reads hours from the shape window before the earliest
    // backtest origin to the end of the hourly or weekly horizon, whichever is later.
    const calendar = new ForecastCalendar(
        input.timeZone,
        input.now - (origins * 7 + 8 * 7 + 2) * DAY_MS,
        input.now + Math.max((horizonHours + 48) * HOUR_MS, (horizonWeeks * 7 + 9) * DAY_MS),
    );
    const totalName = input.totalSeries ?? '*';
    // Backtests are most of the cost: the total and the busiest series get
    // their own, the long tail borrows the total's ranges.
    const today = utcDay(input.now);
    const recent = (h: PreparedHistory) => {
        let sum = 0;
        for (let d = today - 28; d < today; d++) sum += h.daily[d - h.firstDay] ?? 0;
        return sum;
    };
    const busiest = new Set(
        prepared
            .filter((h) => h.series !== totalName)
            .sort((a, b) => recent(b) - recent(a) || a.series.localeCompare(b.series))
            .slice(0, input.backtestSeries ?? DEFAULT_BACKTEST_SERIES)
            .map((h) => h.series),
    );
    const own = (h: PreparedHistory) => backtest(h, occurrences, calendar, input.now, origins);
    const totalHistory = prepared.find((h) => h.series === totalName);
    const totalBacktest = totalHistory ? own(totalHistory) : null;
    const fitted: FittedSeries[] = [];
    const series = prepared.map((history) => {
        const model = fitSeries(history, occurrences, calendar, input.now);
        fitted.push(model);
        const bt =
            history === totalHistory && totalBacktest
                ? totalBacktest
                : busiest.has(history.series) || !totalBacktest
                  ? own(history)
                  : borrowed(totalBacktest);
        return forecastOne(history, model, bt, calendar, input.now, horizonHours, horizonWeeks);
    });
    const total = fitted.find((m) => m.series === totalName);
    const spikes = total
        ? detectSpikes(
              total,
              fitted.filter((m) => m !== total),
          )
        : [];
    return { series, spikes, ms: Date.now() - started };
}

/**
 * How far a local day's holidays could move volume from their factor, as
 * multipliers on low and high. `projectHour` carries a holiday's factor only
 * (`DayEffect.holiday`), so a first-time default holiday's 0.3–1.2 around 0.7
 * would otherwise be missing from the range; a learned holiday's range is
 * narrower and widens accordingly less.
 */
function holidaySpread(model: FittedSeries, day: number): [number, number] {
    let factor = 1;
    let low = 1;
    let high = 1;
    for (const [occ, effect] of model.effects) {
        if (!occ.holiday || day < occ.from || day > occ.to) continue;
        const shape = effect.shape[Math.min(day - occ.from, effect.shape.length - 1)] ?? 1;
        factor *= effect.size * shape;
        low *= effect.low * shape;
        high *= effect.high * shape;
    }
    // A closed holiday is zero, range and all: the multipliers do not matter.
    if (factor <= 0) return [1, 1];
    return [Math.min(1, low / factor), Math.max(1, high / factor)];
}

function forecastOne(
    history: PreparedHistory,
    model: FittedSeries,
    bt: BacktestResult,
    calendar: ForecastCalendar,
    now: number,
    horizonHours: number,
    horizonWeeks: number,
): SeriesForecast {
    const current = Math.floor(now / HOUR_MS) * HOUR_MS;
    const today = calendar.slot(current);
    const from = calendar.midnight(today.date);
    const spreads = new Map<number, [number, number]>();
    const spreadOn = (day: number) => {
        let spread = spreads.get(day);
        if (!spread) spreads.set(day, (spread = holidaySpread(model, day)));
        return spread;
    };

    const raw: HourForecast[] = [];
    for (let h = 0; h < horizonHours; h++) {
        const at = from + h * HOUR_MS;
        const p = projectHour(model, calendar, at);
        const [lo, hi] = bt.ranges[bucketOf(Math.max(0, (at - current) / HOUR_MS))];
        const [hl, hh] = spreadOn(calendar.slot(at).day);
        const noise = Z90 * Math.sqrt(p.likely);
        raw.push({
            at,
            likely: round(p.likely),
            low: round(Math.max(0, Math.min(p.low * hl * lo, p.likely - noise))),
            high: round(Math.max(p.high * hh * hi, p.likely + noise)),
            components: {
                base: round(p.components.base, 3),
                trend: round(p.components.trend, 4),
                season: round(p.components.season, 4),
                holiday: round(p.components.holiday, 4),
                events: p.components.events.map((e) => ({ label: e.label, factor: round(e.factor, 4) })),
                nowcast: 1,
            },
        });
    }
    const hours = applyNowcast(raw, history.hourlyPoints, now);

    const weeks: WeekForecast[] = [];
    const firstMonday = mondayOfDay(today.day);
    const [lo, hi] = bt.weekRange;
    for (let w = 0; w < horizonWeeks; w++) {
        const monday = firstMonday + 7 * w;
        // A week row is its local hours added up (167 or 169 across a clock change).
        const end = calendar.midnight(dateOf(monday + 7));
        let likely = 0;
        let low = 0;
        let high = 0;
        const labels = new Set<string>();
        for (let at = calendar.midnight(dateOf(monday)); at < end; at += HOUR_MS) {
            const p = projectHour(model, calendar, at);
            const [hl, hh] = spreadOn(calendar.slot(at).day);
            likely += p.likely;
            low += p.low * hl;
            high += p.high * hh;
            for (const e of p.components.events) labels.add(e.label);
        }
        // The weekly spread from backtests covers weeks 1–4; later weeks widen with √(weeks / 4).
        const widen = Math.sqrt(Math.max(1, w / 4));
        weeks.push({
            weekStart: dateOf(monday),
            likely: round(likely, 1),
            low: round(Math.max(0, low * (1 - (1 - lo) * widen)), 1),
            high: round(high * (1 + (hi - 1) * widen), 1),
            season: round(seasonFor(model, monday), 4),
            events: [...labels],
        });
    }

    const reasons: string[] = [];
    if (model.historyWeeks < SHORT_HISTORY_WEEKS) reasons.push('short-history');
    const wape72 = bt.accuracy.wape['72h'];
    if (wape72 !== null && wape72 > HIGH_ERROR_WAPE) reasons.push('high-error');
    if (!model.hasHourlyShape) reasons.push('no-hourly-shape');
    const lastDay = Math.max(today.day + Math.ceil(horizonHours / 24), firstMonday + 7 * horizonWeeks);
    for (const [occ, effect] of model.effects) {
        if (effect.source !== 'default' || occ.holiday) continue;
        if (occ.to < today.day || occ.from > lastDay) continue;
        reasons.push(`first-time-event:${occ.o.label}`);
    }
    const unique = [...new Set(reasons)];
    const effects = new Map<string, SeriesForecast['effects'][number]>();
    for (const effect of [...model.effects.values(), ...model.learned.values()]) effects.set(effect.label, effect);
    return {
        series: history.series,
        from,
        hours,
        weeks,
        accuracy: { ...bt.accuracy, lowConfidence: unique.some((r) => r !== 'no-hourly-shape'), reasons: unique },
        yearly: model.yearly !== null,
        historyWeeks: model.historyWeeks,
        effects: [...effects.values()],
    };
}
