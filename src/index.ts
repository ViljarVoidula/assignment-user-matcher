import AssignmentMatcher from './matcher.class';

export type { Assignment, options, Stats, User } from './matcher.class';

// Workflow type exports
export type {
    WorkflowDefinition,
    WorkflowDefinitionInput,
    WorkflowDefinitionSummary,
    WorkflowInstance,
    WorkflowStep,
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
    PendingAssignmentInfo,
} from './matcher.class';

// Learning feature helpers (for custom feature extractors)
export { extractMatchFeatures, cosineSimilarity } from './learning/features';

// Workflow builder DSL
export {
    WorkflowBuilder,
    WorkflowStepBuilder,
    workflow,
    linearWorkflow,
    approvalWorkflow,
} from './workflow-builder';
export { normalizeWorkflowDefinition, validateWorkflowDefinition } from './workflow-validation';

// Utility exports for advanced usage
export * from './utils/cidr';
export { createKeyBuilders, type KeyBuilders, type RedisKeyConfig } from './utils/keys';

export { AssignmentMatcher };
export default AssignmentMatcher;
