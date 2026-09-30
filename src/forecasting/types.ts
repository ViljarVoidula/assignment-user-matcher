/**
 * Public types of the forecasting module: work volume per series and the
 * aggregate staffing it takes. Nothing here describes a person — a series is a
 * tag, a site or an imported volume, and a pool member is a declared skill
 * profile with a head count.
 */

/** One UTC clock hour of history. `at` is the epoch ms of the hour's start. */
export interface HourlyPoint {
    at: number;
    value: number;
}

/** One UTC calendar day of history (`YYYY-MM-DD`). */
export interface DailyPoint {
    date: string;
    value: number;
}

/** A series' history. Missing hours and days read as zero once the series has started. */
export interface SeriesHistory {
    series: string;
    /** Recent hourly history (the platform keeps 16 weeks). Drives the hour-of-week shape and the nowcast. */
    hourly: HourlyPoint[];
    /** Long daily history (the platform keeps 3 years). Drives level, trend, the yearly factor and effects. */
    daily: DailyPoint[];
}

/**
 * A dated occurrence of something that moves volume: a sale, a campaign, a
 * closure, a public holiday. Past occurrences are divided out of history and
 * teach the effect; future ones are multiplied back on.
 */
export interface KnownOccurrence {
    /** Links occurrences across years (`winter-sale`); holidays use `holiday:<name>`. */
    label: string;
    /** `sale` | `campaign` | `launch` | `season` | `closure` | `holiday` | anything a planner types. */
    kind: string;
    /** Inclusive local dates. */
    from: string;
    to: string;
    /** The planner's own estimate, in percent, used when history has nothing for this label. */
    planned?: { likely: number; low?: number; high?: number };
    /** The place is shut: the forecast is zero, whatever history says. */
    closed?: boolean;
}

/** Where an effect's numbers came from, strongest first. */
export type EffectSource = 'label' | 'planned' | 'kind' | 'default';

/** What an occurrence does to volume, learned or stated. Factors multiply the baseline. */
export interface LearnedEffect {
    label: string;
    kind: string;
    source: EffectSource;
    /** Past occurrences it was learned from (0 for planned/default). */
    occurrences: number;
    /** Mean factor over the occurrence's days. */
    size: number;
    /** Low and high factor over the occurrence's days (range across past occurrences, or planned low/high). */
    low: number;
    high: number;
    /** Factor per day of the occurrence relative to `size` (day 1 = index 0); the last value repeats. */
    shape: number[];
    /** Factor per day after the occurrence ends (index 0 = the first day after); empty when none was seen. */
    knockOn: number[];
}

/** Why an hour's number is what it is. `likely = base × trend × season × holiday × Π events × nowcast`. */
export interface HourComponents {
    /** The current weekly level spread over this hour of the week, in the series' units. */
    base: number;
    /** Damped trend from the current week to this hour's week, as a factor. */
    trend: number;
    /** Yearly factor for this week (1 without ≥ 56 weeks of history). */
    season: number;
    /** Public-holiday factor (1 on an ordinary day). */
    holiday: number;
    /** Every event touching this hour, with its factor (including knock-on days). */
    events: Array<{ label: string; factor: number }>;
    /** Today's actual/expected rescale, fading to 1 over 72 hours. */
    nowcast: number;
}

export interface HourForecast {
    at: number;
    low: number;
    likely: number;
    high: number;
    components: HourComponents;
}

export interface WeekForecast {
    /** Local date of the week's Monday. */
    weekStart: string;
    low: number;
    likely: number;
    high: number;
    season: number;
    /** Labels of the events touching the week. */
    events: string[];
}

export type LeadBucket = '24h' | '72h' | '7d' | '28d';

export interface ForecastAccuracy {
    /**
     * Weighted absolute percentage error by lead, from rolling-origin backtests, on local-day totals (UTC days
     * of the daily table for a series without hourly history); null without enough history.
     */
    wape: Record<LeadBucket, number | null>;
    /** Backtest origins that could be judged (0 when the ranges were borrowed). */
    origins: number;
    /**
     * Where the ranges came from: this series' own backtests, the total
     * series' (a small series outside the busiest few is not backtested — its
     * ranges are the total's, never narrower than its own counting noise), or
     * the defaults when neither had enough history.
     */
    rangesFrom: 'own' | 'total' | 'default';
    lowConfidence: boolean;
    /** `short-history`, `high-error`, `first-time-event:<label>`, `no-hourly-shape`. */
    reasons: string[];
}

export interface SeriesForecast {
    series: string;
    /** Epoch ms of local midnight on the day `now` falls in: the first hour. */
    from: number;
    hours: HourForecast[];
    weeks: WeekForecast[];
    accuracy: ForecastAccuracy;
    /** Whether a yearly factor was used (≥ 56 weeks of daily history). */
    yearly: boolean;
    /** Complete weeks of daily history the level was fitted on. */
    historyWeeks: number;
    /** Every effect the forecast used or learned, by label. */
    effects: LearnedEffect[];
}

/** A run of days far outside what the model expected, for the "What was this?" inbox. */
export interface SpikeSpan {
    /** Inclusive UTC dates (the daily history's grain). */
    from: string;
    to: string;
    direction: 'up' | 'down';
    /** Actual minus expected over the span, in the series' units. */
    excess: number;
    /** Largest actual/expected day ratio in the span (smallest for a dip). */
    peakRatio: number;
    /** Which series moved, largest share first (at most five). */
    bySeries: Array<{ series: string; excess: number; share: number }>;
}

export interface ForecastWorkspaceInput {
    /** IANA zone the hour-of-week pattern and the occurrences' dates are read in. */
    timeZone: string;
    /** "As of", epoch ms. Nothing at or after it is read as history. */
    now: number;
    series: SeriesHistory[];
    occurrences?: KnownOccurrence[];
    /** Hourly horizon from local midnight today; default 672 (28 days). */
    horizonHours?: number;
    /** Weekly horizon from this week's Monday; default 26. */
    horizonWeeks?: number;
    /** Rolling-origin backtests per series; default 6. */
    backtestOrigins?: number;
    /** The series spikes are found on and the others decompose; default `'*'`. */
    totalSeries?: string;
    /** How many series besides the total get their own backtests (the busiest by the last 28 days); default 10. */
    backtestSeries?: number;
}

export interface ForecastWorkspaceResult {
    series: SeriesForecast[];
    spikes: SpikeSpan[];
    ms: number;
}

/**
 * A distribution given by its quantiles at evenly spaced probabilities,
 * `q[0]` = minimum (p0) … `q[n-1]` = maximum (p100). At least two points,
 * non-decreasing. Sampled by inverse CDF with linear interpolation.
 */
export interface QuantileDistribution {
    q: number[];
}

/** How one kind of work behaves, as measured. Never about a person. */
export interface TagProfile {
    tag: string;
    /** Time a task is in someone's hands, ms. */
    handleMs: QuantileDistribution;
    /** How long queued work waits before it is cancelled or expires, ms; absent = nobody leaves. */
    patienceMs?: QuantileDistribution | null;
    /** Tasks one person works at once on this tag; default 1. */
    concurrency?: number;
    /** The task priority this tag's work usually carries; default 0. */
    priority?: number;
    /** Picked up within this wait counts as served, ms. */
    targetWaitMs: number;
    /** Share of arrivals that must be picked up within `targetWaitMs`, 0–1. */
    targetShare: number;
}

/**
 * A declared skill profile and how many people have it: routing tags (suffix
 * wildcards as the router reads them) and declared routing weights. Never
 * learned weights, never anybody's measured speed.
 */
export interface PoolMember {
    tags: string[];
    weights?: Record<string, number>;
    count: number;
}

/** One interval's expected arrivals per tag. */
export interface StaffingInterval {
    startMs: number;
    arrivals: Record<string, number>;
}

export interface StaffingOptions {
    /** Simulation seeds per interval; default 20. */
    seeds?: number;
    /** Base seed; default 1. Same inputs + seed = same answer. */
    seed?: number;
    /** Gamma shape k of the arrival-rate noise around the forecast (larger = closer to Poisson); default 20. */
    overdispersion?: number;
    /** Share of on-shift time not spent on the queue, 0–0.9. */
    shrinkage: number;
    /** Interval length, minutes; default 60. */
    intervalMinutes?: number;
    /** Stop simulating after this many ms of wall time; remaining intervals come back `method: 'skipped'`. */
    budgetMs?: number;
    /** Relative grid arrivals are rounded to before simulating (memo key); default 0.05. */
    quantizeStep?: number;
    /** The most people the search will try; default 500. */
    maxPeople?: number;
}

export interface Range {
    low: number;
    likely: number;
    high: number;
}

export interface IntervalNeed {
    startMs: number;
    /** People working the queue (after shrinkage is removed), p10 / median / p90 across seeds. */
    productive: Range;
    /** People to have on shift: productive ÷ (1 − shrinkage), rounded up. */
    onShift: Range;
    /** Share served within target per tag at the likely head count, mean across seeds. */
    serviceByTag: Record<string, number>;
    /** Tags with arrivals nobody in the pool can take: left out of the search. */
    uncovered: string[];
    /** The Erlang A head count the search started from. */
    erlangSeed: number;
    /** `simulation`, `none` (no arrivals) or `skipped` (over the time budget). */
    method: 'simulation' | 'none' | 'skipped';
    /** The search hit `maxPeople` without meeting the target. */
    capped: boolean;
}

export interface StaffingResult {
    intervals: IntervalNeed[];
    ms: number;
    simulations: number;
    cacheHits: number;
    incomplete: boolean;
}
