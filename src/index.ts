import AssignmentMatcher from './matcher.class';

export type {
    Assignment,
    MatcherOptions,
    options,
    Stats,
    QueueStats,
    UserLoadInfo,
    User,
    GeoMatchResult,
    GeoMatchingFunction,
    ReliabilityMetrics,
    AssignmentStatus,
    FairnessMode,
    FairnessConfig,
    MatchTraceReason,
    MatchCandidateTrace,
    MatchDecisionTrace,
    MatchDecisionMode,
    MatchExplanation,
    MatchPreview,
    MatchPreviewInput,
    DecisionTraceQuery,
    AssignmentLifecycleEvent,
    EscalationPolicy,
    EscalationSweepResult,
    CompletionDeadlineSweepResult,
    SlaExpirySweepResult,
    SlaPolicy,
    SlaStats,
    SchedulePolicy,
    ScheduleSweepResult,
    AssignmentLintIssue,
    AssignmentLintContext,
    AssignmentReadinessReport,
    QueueAuditOptions,
    QueueAuditEntry,
    QueueAuditReport,
    MaintenanceOptions,
    MaintenanceReport,
} from './matcher.class';

// Pre-flight lint (pure, Redis-free) — usable host-side before addAssignment
export { lintAssignment, userCoversTag } from './validation/assignment-lint';

// Workflow type exports
export type {
    WorkflowDefinition,
    WorkflowDefinitionInput,
    WorkflowDefinitionSummary,
    WorkflowInstance,
    WorkflowInstanceStatus,
    WorkflowStep,
    WorkflowRouting,
    WorkflowTargetUser,
    WorkflowMachineTask,
    WorkflowExternalTask,
    WorkflowTaskType,
    WorkflowEvent,
    WorkflowEventType,
    AssignmentResult,
    ParallelBranchState,
    DeadLetterEntry,
    AuditEntry,
    CircuitBreakerState,
    WorkflowInstanceWithSnapshot,
    WorkflowInstanceQuery,
    WorkflowInstancePage,
    WorkflowTransition,
    LearningOutcome,
    LearningRewards,
    LearningFeatures,
    LearningAssignmentContext,
    LearningFeatureExtractor,
    LearningDecisionRecord,
    LearningEpisodeRecord,
    LearningSignals,
    LearningSample,
    LearningStats,
    LearningTagStat,
    AutoRoutingWeightsOptions,
    AutoRoutingWeightsPolicy,
    PendingAssignmentInfo,
    WorkflowEngineMetrics,
    MachineTaskHandler,
    WorkflowHost,
    PaginationOptions,
    PaginationResult,
    AssignmentCounts,
} from './matcher.class';

// Decision-trace scoring explainer (same numbers as calculateMatchScore, plus reasons)
export { explainMatchScore, type MatchScoreExplanation } from './scoring/match-score';

// Learning feature helpers (for custom feature extractors)
export { extractMatchFeatures, cosineSimilarity } from './learning/features';
// Automatic routing-weight synthesis (UCB1 policy over learned tag stats)
export { synthesizeRoutingWeights, DEFAULT_AUTO_WEIGHTS_OPTIONS } from './learning/auto-weights';

// Shift scheduling (pure, Redis-free rostering engine)
export {
    ShiftScheduler,
    solveSchedule,
    ScheduleValidationError,
    DEFAULT_MIN_REST_MINUTES,
    PeriodClock,
    // Operational APIs: validate a hand-edited roster, explain a candidate,
    // repair around a call-in, diagnose an impossible problem.
    checkCompliance,
    explainCandidate,
    repairSchedule,
    rankCandidates,
    diagnoseInfeasibility,
    // Rule-authoring arithmetic (weekly-average → rolling-window-total, etc.)
    hours,
    days,
    weeklyAverageOver,
    type AssignmentPair,
    type AvailabilityRule,
    type ComplianceReport,
    type ConstraintOptions,
    type ConstraintViolation,
    type DailyRestRule,
    type Disruption,
    type DutyClassification,
    type DutyQuota,
    type Employee,
    type HistoricalAssignment,
    type InfeasibilityReport,
    type LedgerEntry,
    type ModelContext,
    type NightWorkRule,
    type ObjectiveWeights,
    type OvertimeRule,
    type RepairCandidate,
    type RepairResult,
    type RuleVerdict,
    type ScheduleInput,
    type ScheduleResult,
    type ScheduledAssignment,
    type SchedulingConstraint,
    type SearchState,
    type Severity,
    type ShiftInstance,
    type ShiftTemplate,
    type TimeOffEntry,
    type WeeklyRestRule,
    type WorkingTimeLimits,
    type WorkingTimeRules,
} from './scheduling';

// Workflow builder DSL
export { WorkflowBuilder, WorkflowStepBuilder, workflow, linearWorkflow, approvalWorkflow } from './workflow-builder';
export { normalizeWorkflowDefinition, validateWorkflowDefinition } from './workflow-validation';

// Utility exports for advanced usage
export * from './utils/cidr';
export * from './utils/geo';
export { createKeyBuilders, type KeyBuilders, type RedisKeyConfig } from './utils/keys';

export { AssignmentMatcher };
export default AssignmentMatcher;
