/**
 * Public surface of the forecasting module (`assignment-user-matcher/forecasting`):
 * work volume per series — forecast, explained and ranged — and the aggregate
 * staffing it takes under the router's own rules. Pure, Redis-free and
 * deterministic; nothing here predicts anything about a person.
 */
export { suggestEffect, DEFAULT_EFFECTS, KNOCK_ON_DAYS } from './effects';
export { YEARLY_MIN_WEEKS, OUTLIER } from './model';
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
