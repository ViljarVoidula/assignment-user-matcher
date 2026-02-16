import AssignmentMatcher from './matcher.class';

export type { Assignment, options, Stats, User } from './matcher.class';

// Workflow type exports
export type {
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowStep,
    WorkflowTaskType,
    WorkflowEvent,
    WorkflowEventType,
    AssignmentResult,
    ParallelBranchState,
    DeadLetterEntry,
    AuditEntry,
    CircuitBreakerState,
    WorkflowInstanceWithSnapshot,
} from './matcher.class';

// Workflow builder DSL
export {
    WorkflowBuilder,
    WorkflowStepBuilder,
    workflow,
    linearWorkflow,
    approvalWorkflow,
} from './workflow-builder';

// Utility exports for advanced usage
export * from './utils/cidr';
export { createKeyBuilders, type KeyBuilders, type RedisKeyConfig } from './utils/keys';

export { AssignmentMatcher };
export default AssignmentMatcher;
