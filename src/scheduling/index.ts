/** Public surface of the scheduling module. */
export { ShiftScheduler, solveSchedule, ENGINE_VERSION } from './scheduler.class';
export { ScheduleValidationError } from './types';
/** Directive 2003/88/EC Art 3 floor (11h), the default when `minRestMinutes` is omitted. */
export { DEFAULT_MIN_REST_MINUTES } from './constraints/min-rest';

// Operational APIs: validate, explain, repair, diagnose.
export {
    checkCompliance,
    explainCandidate,
    repairSchedule,
    rankCandidates,
    diagnoseInfeasibility,
    type ComplianceReport,
    type Disruption,
    type RepairCandidate,
    type RepairResult,
    type InfeasibilityReport,
} from './operations';

// Time model, exported so hosts can resolve the same wall-clock the engine does.
export { PeriodClock, type MinuteRange, type ClockRange } from './time';

// The dated occurrences a host draws its planning grid from. Exported so a
// grid addresses the same `<templateId>@<date>` ids the engine judges, rather
// than a re-derivation of them that can drift.
export { expandShiftInstances } from './model';

// Rule-authoring arithmetic (no jurisdiction values, just the conversions
// people get wrong — notably weekly-average → rolling-window-total).
export { hours, days, weeklyAverageOver } from './rules';

// Contracted-hours arithmetic, exported so a host resolves `fte` to the same
// weekly figure the engine plans against (for pay estimates, planned-hours
// reports) rather than a second derivation that can drift.
export {
    DEFAULT_CONTRACT_HOURS_WEIGHT,
    contractedPeriodMinutes,
    fullTimeWeeklyMinutes,
    resolveContractedWeeklyMinutes,
} from './contract-hours';

export type {
    AssignmentPair,
    AvailabilityRule,
    BreakRule,
    ClockRangeConfig,
    ConsecutiveRule,
    ConstraintOptions,
    ConstraintViolation,
    ContractHoursRule,
    ContractHoursSummary,
    DailyRestRule,
    DutyClassification,
    DutyQuota,
    Employee,
    EmployeeContract,
    EmployeeCost,
    EmployeePreferenceReport,
    EmployeeProtection,
    EngagementRule,
    FairnessRule,
    HistoricalAssignment,
    LedgerEntry,
    ModelContext,
    NightVolumeQuota,
    NightWorkRule,
    NoticeRule,
    ObjectiveWeights,
    OvertimeRule,
    PreferenceObjective,
    PreferenceRuleOutcome,
    Qualification,
    RestDayRule,
    RollingAverage,
    RuleVerdict,
    ScheduleInput,
    ScheduleProvenance,
    ScheduleResult,
    ScheduledAssignment,
    SchedulingConstraint,
    SearchState,
    Severity,
    ShiftInstance,
    ShiftTemplate,
    TagRequirement,
    ShiftDemandOverride,
    Site,
    SiteIndex,
    TimeOffEntry,
    WeeklyRestRule,
    WorkingTimeLimits,
    WorkingTimeRules,
} from './types';

// Timeline internals, exported as types so custom-constraint authors can name
// what they receive through `SearchState.timelines` and `ModelContext.history`.
export type { PersonTimeline, TimelineEntry, TimelineIndex } from './engine/timeline';
