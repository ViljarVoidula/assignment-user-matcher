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

// Rule-authoring arithmetic (no jurisdiction values, just the conversions
// people get wrong — notably weekly-average → rolling-window-total).
export { hours, days, weeklyAverageOver } from './rules';

export type {
    AssignmentPair,
    AvailabilityRule,
    BreakRule,
    ClockRangeConfig,
    ConsecutiveRule,
    ConstraintOptions,
    ConstraintViolation,
    DailyRestRule,
    DutyClassification,
    DutyQuota,
    Employee,
    EmployeeContract,
    EmployeeCost,
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
    TimeOffEntry,
    WeeklyRestRule,
    WorkingTimeLimits,
    WorkingTimeRules,
} from './types';
