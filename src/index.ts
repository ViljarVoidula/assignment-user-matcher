import AssignmentMatcher from './matcher.class';

export type {
    Assignment,
    MatcherOptions,
    options,
    Stats,
    User,
    GeoMatchResult,
    GeoMatchingFunction,
    ReliabilityMetrics,
    AssignmentStatus,
} from './matcher.class';

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
    WorkflowTaskType,
    WorkflowEvent,
    WorkflowEventType,
    AssignmentResult,
    ParallelBranchState,
    DeadLetterEntry,
    AuditEntry,
    CircuitBreakerState,
    WorkflowInstanceWithSnapshot,
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
    PendingAssignmentInfo,
    WorkflowEngineMetrics,
    MachineTaskHandler,
    WorkflowHost,
    PaginationOptions,
    PaginationResult,
    AssignmentCounts,
} from './matcher.class';

// Learning feature helpers (for custom feature extractors)
export { extractMatchFeatures, cosineSimilarity } from './learning/features';
// Automatic routing-weight synthesis (UCB1 policy over learned tag stats)
export { synthesizeRoutingWeights, DEFAULT_AUTO_WEIGHTS_OPTIONS } from './learning/auto-weights';

// Workflow builder DSL
export { WorkflowBuilder, WorkflowStepBuilder, workflow, linearWorkflow, approvalWorkflow } from './workflow-builder';
export { normalizeWorkflowDefinition, validateWorkflowDefinition } from './workflow-validation';

// Utility exports for advanced usage
export * from './utils/cidr';
export * from './utils/geo';
export { createKeyBuilders, type KeyBuilders, type RedisKeyConfig } from './utils/keys';

export { AssignmentMatcher };
export default AssignmentMatcher;
