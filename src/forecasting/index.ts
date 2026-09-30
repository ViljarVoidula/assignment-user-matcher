/**
 * Public surface of the forecasting module (`assignment-user-matcher/forecasting`):
 * work volume per series — forecast, explained and ranged — and the aggregate
 * staffing it takes under the router's own rules. Pure, Redis-free and
 * deterministic; nothing here predicts anything about a person.
 */
export {
    forecastWorkspace,
    DEFAULT_HORIZON_HOURS,
    DEFAULT_HORIZON_WEEKS,
    DEFAULT_BACKTEST_ORIGINS,
    DEFAULT_BACKTEST_SERIES,
} from './forecast';
export { applyNowcast, nowcastRatio, NOWCAST_HOURS, NOWCAST_PRIOR } from './nowcast';
export { suggestEffect, DEFAULT_EFFECTS, KNOCK_ON_DAYS } from './effects';
export { YEARLY_MIN_WEEKS, OUTLIER } from './model';
export { HIGH_ERROR_WAPE, LEAD_BUCKETS } from './backtest';
export { SPIKE_LOOKBACK_DAYS } from './spikes';
export { ForecastCalendar, type LocalSlot } from './calendar';
export { exponentialQuantiles, meanOf, sampleQuantiles, assertDistribution } from './distributions';
export type {
    HourlyPoint,
    DailyPoint,
    SeriesHistory,
    KnownOccurrence,
    EffectSource,
    LearnedEffect,
    HourComponents,
    HourForecast,
    WeekForecast,
    LeadBucket,
    ForecastAccuracy,
    SeriesForecast,
    SpikeSpan,
    ForecastWorkspaceInput,
    ForecastWorkspaceResult,
    QuantileDistribution,
    TagProfile,
    PoolMember,
    StaffingInterval,
    StaffingOptions,
    Range,
    IntervalNeed,
    StaffingResult,
} from './types';
