import type { WorkflowDefinition, WorkflowDefinitionInput, WorkflowStep } from './types/matcher';

function ensureNonEmpty(value: string | undefined, message: string): string {
    if (!value?.trim()) {
        throw new Error(message);
    }

    return value;
}

function validateStepBasics(step: WorkflowStep): void {
    ensureNonEmpty(step.id, 'Workflow step ID is required');
    ensureNonEmpty(step.name, `Step "${step.id}" must have a name`);

    if (typeof step.targetUser === 'object' && step.targetUser !== null && 'tag' in step.targetUser) {
        ensureNonEmpty(step.targetUser.tag, `Step "${step.id}" must have a non-empty target tag`);
    }

    const taskType = step.taskType ?? 'assignment';
    if (taskType === 'machine') {
        ensureNonEmpty(step.machineTask?.handler, `Step "${step.id}" has taskType "machine" but no machineTask.handler`);
        return;
    }

    if (taskType === 'external') {
        ensureNonEmpty(step.external?.name, `Step "${step.id}" has taskType "external" but no external.name`);
        return;
    }

    if (!step.assignmentTemplate) {
        throw new Error(`Assignment step "${step.id}" is missing assignmentTemplate`);
    }
}

/**
 * External steps must be able to time out — an uncalled-back external step
 * would otherwise hang a run forever. Checked at the definition level (not in
 * validateStepBasics) because a step's effective timeout also depends on the
 * workflow's defaultTimeoutMs.
 */
function validateExternalStepTimeout(definition: WorkflowDefinition): void {
    for (const step of definition.steps) {
        if ((step.taskType ?? 'assignment') !== 'external') continue;
        if (!step.timeoutMs && !definition.defaultTimeoutMs) {
            throw new Error(`External step "${step.id}" requires a timeoutMs (or the workflow's defaultTimeoutMs)`);
        }
    }
}

export function validateWorkflowDefinition(definition: WorkflowDefinition): WorkflowDefinition {
    ensureNonEmpty(definition.id, 'Workflow ID is required');
    ensureNonEmpty(definition.name, 'Workflow name is required');

    if (!definition.steps.length) {
        throw new Error('Workflow must have at least one step');
    }

    validateExternalStepTimeout(definition);

    const stepIds = new Set<string>();
    for (const step of definition.steps) {
        validateStepBasics(step);

        if (stepIds.has(step.id)) {
            throw new Error(`Duplicate workflow step ID "${step.id}"`);
        }

        stepIds.add(step.id);
    }

    ensureNonEmpty(definition.initialStepId, 'Workflow initial step ID is required');

    if (!stepIds.has(definition.initialStepId)) {
        throw new Error(`Initial step "${definition.initialStepId}" not found`);
    }

    for (const step of definition.steps) {
        if (step.routing) {
            for (const route of step.routing) {
                if (!stepIds.has(route.targetStepId)) {
                    throw new Error(`Step "${step.id}" references non-existent step "${route.targetStepId}" in routing`);
                }
            }
        }

        if (step.defaultNextStepId && !stepIds.has(step.defaultNextStepId)) {
            throw new Error(`Step "${step.id}" references non-existent step "${step.defaultNextStepId}" as default next`);
        }

        if (step.parallelStepIds) {
            for (const parallelStepId of step.parallelStepIds) {
                if (!stepIds.has(parallelStepId)) {
                    throw new Error(`Step "${step.id}" references non-existent parallel step "${parallelStepId}"`);
                }
            }
        }
    }

    validateEscalationTargets(definition, stepIds);

    return definition;
}

/**
 * `onTimeoutStepId` turns a timeout into a forward hop instead of a failure.
 * Everything that would make that hop meaningless or non-terminating is
 * rejected at registration rather than discovered at 3am.
 */
function validateEscalationTargets(definition: WorkflowDefinition, stepIds: Set<string>): void {
    const parallelMembers = new Set<string>();
    for (const step of definition.steps) {
        for (const id of step.parallelStepIds ?? []) parallelMembers.add(id);
    }

    for (const step of definition.steps) {
        if (!step.onTimeoutStepId) continue;

        if (!stepIds.has(step.onTimeoutStepId)) {
            throw new Error(`Step "${step.id}" escalates to non-existent step "${step.onTimeoutStepId}" on timeout`);
        }
        if (step.onTimeoutStepId === step.id) {
            throw new Error(`Step "${step.id}" escalates to itself on timeout, which never terminates`);
        }
        if (!step.timeoutMs && !definition.defaultTimeoutMs) {
            throw new Error(`Step "${step.id}" escalates on timeout but has no timeoutMs (or workflow defaultTimeoutMs)`);
        }
        if (parallelMembers.has(step.id)) {
            throw new Error(`Step "${step.id}" is part of a parallel group; escalate-on-timeout is not supported there`);
        }
    }
}

export function normalizeWorkflowDefinition(definition: WorkflowDefinitionInput | WorkflowDefinition): WorkflowDefinition {
    const steps = [...definition.steps];
    if (!steps.length) {
        throw new Error('Workflow must have at least one step');
    }

    const normalized: WorkflowDefinition = {
        id: definition.id,
        name: definition.name,
        version: definition.version ?? 1,
        initialStepId: definition.initialStepId ?? steps[0].id,
        steps,
    };

    if (definition.defaultTimeoutMs !== undefined) {
        normalized.defaultTimeoutMs = definition.defaultTimeoutMs;
    }

    if (definition.maxEscalationDepth !== undefined) {
        normalized.maxEscalationDepth = definition.maxEscalationDepth;
    }

    if (definition.metadata !== undefined) {
        normalized.metadata = definition.metadata;
    }

    return validateWorkflowDefinition(normalized);
}
