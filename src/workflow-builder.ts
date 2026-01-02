/**
 * Workflow Builder DSL
 * 
 * Provides a fluent API for constructing workflow definitions programmatically.
 * This makes workflow creation more intuitive and type-safe.
 * 
 * @example
 * ```typescript
 * const workflow = WorkflowBuilder.create('approval-flow', 'Document Approval')
 *   .step('submit')
 *     .name('Submit Document')
 *     .assignment({ tags: ['document'], title: 'Submit your document' })
 *     .targetUser('initiator')
 *     .route('result.approved === true', 'review')
 *     .route('result.approved === false', 'rejected')
 *     .defaultNext('review')
 *     .done()
 *   .step('review')
 *     .name('Manager Review')
 *     .assignment({ tags: ['review'], title: 'Review submission' })
 *     .targetUser({ tag: 'managers' })
 *     .timeout(86400000) // 24 hours
 *     .route('result.decision === "approve"', 'complete')
 *     .route('result.decision === "reject"', 'rejected')
 *     .done()
 *   .step('complete')
 *     .name('Completion')
 *     .assignment({ tags: ['notification'], title: 'Process complete' })
 *     .targetUser('initiator')
 *     .done()
 *   .step('rejected')
 *     .name('Rejection Notice')
 *     .assignment({ tags: ['notification'], title: 'Submission rejected' })
 *     .targetUser('initiator')
 *     .done()
 *   .initialStep('submit')
 *   .build();
 * ```
 */

import type {
    WorkflowDefinition,
    WorkflowStep,
    WorkflowRouting,
    Assignment,
} from './types/matcher';

/**
 * Builder for individual workflow steps.
 */
export class WorkflowStepBuilder {
    private step: WorkflowStep;
    private parentBuilder: WorkflowBuilder;

    constructor(id: string, parentBuilder: WorkflowBuilder) {
        this.parentBuilder = parentBuilder;
        this.step = {
            id,
            name: id,
            assignmentTemplate: {},
            targetUser: 'initiator',
        };
    }

    /**
     * Set the step name.
     */
    name(name: string): this {
        this.step.name = name;
        return this;
    }

    /**
     * Set the assignment template for this step.
     */
    assignment(template: Partial<Assignment>): this {
        this.step.assignmentTemplate = template;
        return this;
    }

    /**
     * Set the target user for this step.
     * @param target - 'initiator' | 'previous' | userId | { tag: string }
     */
    targetUser(target: 'initiator' | 'previous' | string | { tag: string }): this {
        this.step.targetUser = target;
        return this;
    }

    /**
     * Add a routing rule for conditional branching.
     * @param condition - Expression to evaluate (e.g., 'result.approved === true')
     * @param targetStepId - Step to go to if condition is true
     */
    route(condition: string, targetStepId: string): this {
        if (!this.step.routing) {
            this.step.routing = [];
        }
        this.step.routing.push({ condition, targetStepId });
        return this;
    }

    /**
     * Set the default next step if no routing conditions match.
     * @param stepId - Next step ID, or null to end workflow
     */
    defaultNext(stepId: string | null): this {
        this.step.defaultNextStepId = stepId;
        return this;
    }

    /**
     * Configure parallel execution with other steps.
     * @param stepIds - Array of step IDs to execute in parallel with this step
     */
    parallel(stepIds: string[]): this {
        this.step.parallelStepIds = stepIds;
        return this;
    }

    /**
     * Set whether to wait for all parallel branches before continuing.
     */
    waitForAll(wait: boolean = true): this {
        this.step.waitForAll = wait;
        return this;
    }

    /**
     * Set the failure policy for parallel execution.
     */
    failurePolicy(policy: 'abort' | 'continue' | 'retry'): this {
        this.step.failurePolicy = policy;
        return this;
    }

    /**
     * Set the maximum retry count for this step.
     */
    maxRetries(count: number): this {
        this.step.maxRetries = count;
        return this;
    }

    /**
     * Set a timeout for this step in milliseconds.
     */
    timeout(ms: number): this {
        this.step.timeoutMs = ms;
        return this;
    }

    /**
     * Finish configuring this step and return to the parent builder.
     */
    done(): WorkflowBuilder {
        this.parentBuilder._addStep(this.step);
        return this.parentBuilder;
    }

    /**
     * Get the built step (for internal use).
     */
    _getStep(): WorkflowStep {
        return this.step;
    }
}

/**
 * Builder for workflow definitions.
 */
export class WorkflowBuilder {
    private definition: Partial<WorkflowDefinition>;
    private steps: WorkflowStep[] = [];

    private constructor(id: string, name: string) {
        this.definition = {
            id,
            name,
            version: 1,
            steps: [],
        };
    }

    /**
     * Create a new workflow builder.
     * @param id - Unique identifier for the workflow
     * @param name - Human-readable name
     */
    static create(id: string, name: string): WorkflowBuilder {
        return new WorkflowBuilder(id, name);
    }

    /**
     * Set the workflow version.
     */
    version(version: number): this {
        this.definition.version = version;
        return this;
    }

    /**
     * Set workflow metadata.
     */
    metadata(metadata: Record<string, any>): this {
        this.definition.metadata = metadata;
        return this;
    }

    /**
     * Set the default timeout for all steps (in milliseconds).
     */
    defaultTimeout(ms: number): this {
        this.definition.defaultTimeoutMs = ms;
        return this;
    }

    /**
     * Start building a new step.
     * @param id - Unique identifier for the step within this workflow
     */
    step(id: string): WorkflowStepBuilder {
        return new WorkflowStepBuilder(id, this);
    }

    /**
     * Add a pre-built step to the workflow.
     */
    addStep(step: WorkflowStep): this {
        this.steps.push(step);
        return this;
    }

    /**
     * Internal method to add a step from the step builder.
     */
    _addStep(step: WorkflowStep): void {
        this.steps.push(step);
    }

    /**
     * Set the initial (entry point) step ID.
     */
    initialStep(stepId: string): this {
        this.definition.initialStepId = stepId;
        return this;
    }

    /**
     * Build and return the workflow definition.
     * @throws Error if the workflow is invalid
     */
    build(): WorkflowDefinition {
        // Validate
        if (!this.definition.id) {
            throw new Error('Workflow ID is required');
        }
        if (!this.definition.name) {
            throw new Error('Workflow name is required');
        }
        if (this.steps.length === 0) {
            throw new Error('Workflow must have at least one step');
        }
        if (!this.definition.initialStepId) {
            // Default to first step if not specified
            this.definition.initialStepId = this.steps[0].id;
        }

        // Validate initial step exists
        const initialStep = this.steps.find(s => s.id === this.definition.initialStepId);
        if (!initialStep) {
            throw new Error(`Initial step "${this.definition.initialStepId}" not found`);
        }

        // Validate all referenced step IDs exist
        for (const step of this.steps) {
            if (step.routing) {
                for (const route of step.routing) {
                    if (!this.steps.find(s => s.id === route.targetStepId)) {
                        throw new Error(
                            `Step "${step.id}" references non-existent step "${route.targetStepId}" in routing`
                        );
                    }
                }
            }
            if (step.defaultNextStepId && !this.steps.find(s => s.id === step.defaultNextStepId)) {
                throw new Error(
                    `Step "${step.id}" references non-existent step "${step.defaultNextStepId}" as default next`
                );
            }
            if (step.parallelStepIds) {
                for (const parallelId of step.parallelStepIds) {
                    if (!this.steps.find(s => s.id === parallelId)) {
                        throw new Error(
                            `Step "${step.id}" references non-existent parallel step "${parallelId}"`
                        );
                    }
                }
            }
        }

        return {
            id: this.definition.id!,
            name: this.definition.name!,
            version: this.definition.version ?? 1,
            initialStepId: this.definition.initialStepId!,
            steps: this.steps,
            defaultTimeoutMs: this.definition.defaultTimeoutMs,
            metadata: this.definition.metadata,
        };
    }
}

/**
 * Convenience function to create a new workflow builder.
 */
export function workflow(id: string, name: string): WorkflowBuilder {
    return WorkflowBuilder.create(id, name);
}

/**
 * Create a simple linear workflow with automatic step chaining.
 * @param id - Workflow ID
 * @param name - Workflow name
 * @param steps - Array of step configurations
 */
export function linearWorkflow(
    id: string,
    name: string,
    steps: Array<{
        id: string;
        name: string;
        assignment: Partial<Assignment>;
        targetUser?: 'initiator' | 'previous' | string | { tag: string };
        timeoutMs?: number;
    }>
): WorkflowDefinition {
    if (steps.length === 0) {
        throw new Error('Linear workflow must have at least one step');
    }

    const workflowSteps: WorkflowStep[] = steps.map((step, index) => ({
        id: step.id,
        name: step.name,
        assignmentTemplate: step.assignment,
        targetUser: step.targetUser ?? 'initiator',
        defaultNextStepId: index < steps.length - 1 ? steps[index + 1].id : null,
        timeoutMs: step.timeoutMs,
    }));

    return {
        id,
        name,
        version: 1,
        initialStepId: steps[0].id,
        steps: workflowSteps,
    };
}

/**
 * Create an approval workflow with submit -> review -> complete/rejected pattern.
 */
export function approvalWorkflow(
    id: string,
    name: string,
    options: {
        submitAssignment: Partial<Assignment>;
        reviewAssignment: Partial<Assignment>;
        completeAssignment?: Partial<Assignment>;
        rejectedAssignment?: Partial<Assignment>;
        reviewerTag?: string;
        reviewTimeoutMs?: number;
    }
): WorkflowDefinition {
    return WorkflowBuilder.create(id, name)
        .step('submit')
            .name('Submit')
            .assignment(options.submitAssignment)
            .targetUser('initiator')
            .defaultNext('review')
            .done()
        .step('review')
            .name('Review')
            .assignment(options.reviewAssignment)
            .targetUser(options.reviewerTag ? { tag: options.reviewerTag } : 'initiator')
            .timeout(options.reviewTimeoutMs ?? 86400000)
            .route('result.decision === "approve"', 'complete')
            .route('result.decision === "reject"', 'rejected')
            .defaultNext('complete')
            .done()
        .step('complete')
            .name('Completed')
            .assignment(options.completeAssignment ?? { tags: ['notification'], title: 'Approved' })
            .targetUser('initiator')
            .done()
        .step('rejected')
            .name('Rejected')
            .assignment(options.rejectedAssignment ?? { tags: ['notification'], title: 'Rejected' })
            .targetUser('initiator')
            .done()
        .initialStep('submit')
        .build();
}
