import { randomUUID } from 'crypto';
import { RedisClientType, WorkflowDefinition, WorkflowInstance, WorkflowStep, WorkflowEvent, WorkflowEventType, Assignment, WorkflowInstanceWithSnapshot, ParallelBranchState } from '../types/matcher';
import { KeyBuilders } from '../utils/keys';
import { ReliabilityManager } from './ReliabilityManager';
import { TelemetryManager } from './TelemetryManager';

export interface WorkflowHost {
    addAssignment(assignment: Assignment): Promise<Assignment>;
    matchUsersAssignments(userId: string): Promise<any>;
    executeMachineTask?(args: {
        instance: WorkflowInstance;
        step: WorkflowStep;
        definition: WorkflowDefinition;
    }): Promise<Record<string, any> | void>;
}

export class WorkflowManager {
    private orchestratorRunning: boolean = false;
    private orchestratorAbortController: AbortController | null = null;
    private subscriberClient: RedisClientType | null = null;
    private luaScriptSha: string | null = null;

    constructor(
        private redisClient: RedisClientType,
        private keys: KeyBuilders,
        private reliability: ReliabilityManager,
        private telemetry: TelemetryManager,
        private host: WorkflowHost,
        private options: {
            enableWorkflows: boolean;
            streamConsumerGroup: string;
            streamConsumerName: string;
            reclaimIntervalMs: number;
            reclaimMinIdleMs?: number;
        }
    ) {}

    async init(): Promise<void> {
        if (this.options.enableWorkflows) {
            await this.initStreamConsumerGroup();
        }
    }

    private async initStreamConsumerGroup(): Promise<void> {
        const streamKey = this.keys.eventStream();
        try {
            await this.redisClient.xGroupCreate(streamKey, this.options.streamConsumerGroup, '0', {
                MKSTREAM: true,
            });
        } catch (err: any) {
            if (!err.message?.includes('BUSYGROUP')) {
                throw err;
            }
        }
    }

    setLuaScriptSha(sha: string): void {
        this.luaScriptSha = sha;
    }

    async registerWorkflow(definition: WorkflowDefinition): Promise<WorkflowDefinition> {
        const key = this.keys.workflowDefinition(definition.id);
        await this.redisClient.set(key, JSON.stringify(definition));
        await this.redisClient.hSet(this.keys.workflowDefinitions(), definition.id, definition.name);
        return definition;
    }

    async getWorkflowDefinition(id: string): Promise<WorkflowDefinition | null> {
        const key = this.keys.workflowDefinition(id);
        const json = await this.redisClient.get(key);
        return json ? JSON.parse(json) : null;
    }

    async listWorkflowDefinitions(): Promise<Array<{ id: string; name: string }>> {
        const definitions = await this.redisClient.hGetAll(this.keys.workflowDefinitions());
        return Object.entries(definitions).map(([id, name]) => ({ id, name }));
    }

    async startWorkflow(
        workflowDefinitionId: string,
        userId: string,
        initialContext?: Record<string, any>,
    ): Promise<WorkflowInstance> {
        const { span, end: endSpan } = this.telemetry.startSpan('workflow.start', {
            'workflow.definition_id': workflowDefinitionId,
            'workflow.user_id': userId,
        });

        try {
            const definition = await this.getWorkflowDefinition(workflowDefinitionId);
            if (!definition) {
                throw new Error(`Workflow definition not found: ${workflowDefinitionId}`);
            }

            const now = Date.now();
            const instanceId = randomUUID();

            this.telemetry.setSpanAttributes(span, {
                'workflow.instance_id': instanceId,
                'workflow.definition_version': definition.version,
            });

            const instance: WorkflowInstance = {
                id: instanceId,
                workflowDefinitionId,
                initiatorUserId: userId,
                status: 'active',
                currentStepId: definition.initialStepId,
                context: initialContext ?? {},
                history: [],
                retryCount: 0,
                version: 1,
                createdAt: now,
                updatedAt: now,
                definitionSnapshot: this.reliability.options.workflowSnapshotDefinitions !== false
                    ? JSON.parse(JSON.stringify(definition)) 
                    : undefined,
            };

            await this.redisClient.hSet(this.keys.workflowInstance(instanceId), 'data', JSON.stringify(instance));
            await this.redisClient.sAdd(this.keys.workflowInstancesByUser(userId), instanceId);
            await this.redisClient.hSet(this.keys.workflowInstances(), instanceId, workflowDefinitionId);

            await this.reliability.emitAuditEvent('WORKFLOW_STARTED', instanceId, {
                definitionId: workflowDefinitionId,
                definitionVersion: definition.version,
                userId,
            }, 'workflow_instance');

            if (this.options.enableWorkflows) {
                await this.publishWorkflowEvent({
                    eventId: randomUUID(),
                    type: 'STARTED',
                    userId,
                    assignmentId: '',
                    workflowInstanceId: instanceId,
                    stepId: definition.initialStepId,
                    timestamp: now,
                });
            }

            await this.executeWorkflowStep(instance, definition.initialStepId, definition);

            endSpan();
            return instance;
        } catch (err) {
            this.telemetry.recordSpanError(span, err instanceof Error ? err : new Error(String(err)));
            endSpan();
            throw err;
        }
    }

    async getWorkflowInstance(instanceId: string): Promise<WorkflowInstance | null> {
        const json = await this.redisClient.hGet(this.keys.workflowInstance(instanceId), 'data');
        return json ? JSON.parse(json) : null;
    }

    async getWorkflowInstanceWithSnapshot(instanceId: string): Promise<WorkflowInstanceWithSnapshot | null> {
        const instance = await this.getWorkflowInstance(instanceId);
        if (!instance) return null;

        const definition = instance.definitionSnapshot ?? await this.getWorkflowDefinition(instance.workflowDefinitionId);

        return {
            ...instance,
            resolvedDefinition: definition ?? undefined,
        };
    }

    async getActiveWorkflowsForUser(userId: string): Promise<WorkflowInstance[]> {
        const instanceIds = await this.redisClient.sMembers(this.keys.workflowInstancesByUser(userId));
        const instances: WorkflowInstance[] = [];

        for (const id of instanceIds) {
            const instance = await this.getWorkflowInstance(id);
            if (instance && instance.status === 'active') {
                instances.push(instance);
            }
        }

        return instances;
    }

    async cancelWorkflow(instanceId: string): Promise<boolean> {
        const instance = await this.getWorkflowInstance(instanceId);
        if (!instance) {
            throw new Error(`Workflow instance not found: ${instanceId}`);
        }

        const expectedVersion = instance.version;
        instance.status = 'cancelled';

        await this.saveInstance(instance, expectedVersion);
        return true;
    }

    private async executeWorkflowStep(
        instance: WorkflowInstance,
        stepId: string,
        definition: WorkflowDefinition,
    ): Promise<void> {
        const step = definition.steps.find((s) => s.id === stepId);
        if (!step) {
            throw new Error(`Step not found: ${stepId} in workflow ${definition.id}`);
        }

        const expectedVersion = instance.version;
        if (step.parallelStepIds && step.parallelStepIds.length > 0) {
            const branches: ParallelBranchState[] = [];
            const machineParallelSteps: Array<{ stepId: string; assignmentId: string }> = [];

            for (const parallelStepId of step.parallelStepIds) {
                const parallelStep = definition.steps.find((s) => s.id === parallelStepId);
                if (!parallelStep) continue;

                const taskType = parallelStep.taskType ?? 'assignment';
                if (taskType === 'machine') {
                    if (!parallelStep.machineTask?.handler) {
                        throw new Error(`Machine step "${parallelStep.id}" is missing machineTask.handler`);
                    }

                    const syntheticAssignmentId = randomUUID();
                    machineParallelSteps.push({ stepId: parallelStepId, assignmentId: syntheticAssignmentId });
                    branches.push({
                        stepId: parallelStepId,
                        assignmentId: syntheticAssignmentId,
                        status: 'pending',
                    });
                } else {
                    const assignment = await this.createWorkflowAssignment(instance, parallelStep, definition);
                    branches.push({
                        stepId: parallelStepId,
                        assignmentId: assignment.id,
                        status: 'pending',
                    });
                }

                const timeoutMs = parallelStep.timeoutMs ?? definition.defaultTimeoutMs;
                if (timeoutMs) {
                    await this.setStepTimeout(instance.id, parallelStepId, timeoutMs);
                }
            }

            instance.parallelBranches = branches;
            instance.currentStepId = null;
            instance.currentAssignmentId = undefined;
            await this.saveInstance(instance, expectedVersion);

            for (const machineStep of machineParallelSteps) {
                const parallelStep = definition.steps.find((s) => s.id === machineStep.stepId);
                if (!parallelStep) continue;
                await this.executeMachineStep(instance, parallelStep, definition, machineStep.assignmentId);
            }

            return;
        }

        const taskType = step.taskType ?? 'assignment';
        if (taskType === 'machine') {
            if (!step.machineTask?.handler) {
                throw new Error(`Machine step "${step.id}" is missing machineTask.handler`);
            }

            instance.currentAssignmentId = undefined;
            instance.currentStepId = stepId;

            const timeoutMs = step.timeoutMs ?? definition.defaultTimeoutMs;
            if (timeoutMs) {
                await this.setStepTimeout(instance.id, stepId, timeoutMs);
            }

            await this.saveInstance(instance, expectedVersion);
            await this.executeMachineStep(instance, step, definition);
            return;
        }

        const assignment = await this.createWorkflowAssignment(instance, step, definition);
        instance.currentAssignmentId = assignment.id;
        instance.currentStepId = stepId;

        const timeoutMs = step.timeoutMs ?? definition.defaultTimeoutMs;
        if (timeoutMs) {
            await this.setStepTimeout(instance.id, stepId, timeoutMs);
        }

        await this.saveInstance(instance, expectedVersion);
    }

    private async executeMachineStep(
        instance: WorkflowInstance,
        step: WorkflowStep,
        definition: WorkflowDefinition,
        assignmentId?: string,
    ): Promise<void> {
        const syntheticAssignmentId = assignmentId ?? randomUUID();
        const eventBase: WorkflowEvent = {
            eventId: randomUUID(),
            type: 'COMPLETED',
            userId: instance.initiatorUserId,
            assignmentId: syntheticAssignmentId,
            workflowInstanceId: instance.id,
            stepId: step.id,
            timestamp: Date.now(),
        };

        try {
            if (!this.host.executeMachineTask) {
                throw new Error(
                    `Machine task executor not configured for step "${step.id}" (handler: ${step.machineTask?.handler ?? 'unknown'})`,
                );
            }

            const result = await this.host.executeMachineTask({
                instance,
                step,
                definition,
            });

            await this.processWorkflowEvent({
                ...eventBase,
                type: 'COMPLETED',
                payload: result ? { ...result } : undefined,
            });
        } catch (err: any) {
            await this.processWorkflowEvent({
                ...eventBase,
                type: 'FAILED',
                payload: {
                    error: err?.message ?? String(err),
                },
            });
        }
    }

    private async setStepTimeout(instanceId: string, stepId: string, timeoutMs: number): Promise<void> {
        const expiryKey = this.keys.workflowStepExpiry(instanceId, stepId);
        const expiryTime = Date.now() + timeoutMs;
        await this.redisClient.set(expiryKey, String(expiryTime), { PX: timeoutMs });
    }

    async processExpiredWorkflowSteps(): Promise<number> {
        if (!this.options.enableWorkflows) return 0;

        const instances = await this.redisClient.hGetAll(this.keys.workflowInstances());
        let expiredCount = 0;

        for (const [instanceId] of Object.entries(instances)) {
            const instance = await this.getWorkflowInstance(instanceId);
            if (!instance || instance.status !== 'active') continue;

            const currentStepId = instance.currentStepId;
            if (!currentStepId) continue;

            const expiryKey = this.keys.workflowStepExpiry(instanceId, currentStepId);
            const expiryTimeStr = await this.redisClient.get(expiryKey);

            if (expiryTimeStr === null) {
                const definition = await this.getWorkflowDefinition(instance.workflowDefinitionId);
                if (!definition) continue;

                const step = definition.steps.find((s) => s.id === currentStepId);
                const timeoutMs = step?.timeoutMs ?? definition.defaultTimeoutMs;
                if (!timeoutMs) continue;

                await this.publishWorkflowEvent({
                    eventId: randomUUID(),
                    type: 'EXPIRED',
                    userId: instance.initiatorUserId,
                    assignmentId: instance.currentAssignmentId ?? '',
                    workflowInstanceId: instanceId,
                    stepId: currentStepId,
                    timestamp: Date.now(),
                });

                expiredCount++;
            }
        }

        return expiredCount;
    }

    private async createWorkflowAssignment(
        instance: WorkflowInstance,
        step: WorkflowStep,
        definition: WorkflowDefinition,
    ): Promise<Assignment> {
        if (!step.assignmentTemplate) {
            throw new Error(`Assignment step "${step.id}" is missing assignmentTemplate`);
        }

        const targetUserSelector = step.targetUser ?? 'initiator';
        let targetUserId: string;
        if (targetUserSelector === 'initiator') {
            targetUserId = instance.initiatorUserId;
        } else if (targetUserSelector === 'previous') {
            const lastEntry = instance.history[instance.history.length - 1];
            targetUserId = lastEntry?.userId ?? instance.initiatorUserId;
        } else if (typeof targetUserSelector === 'object' && 'tag' in targetUserSelector) {
            targetUserId = '';
        } else {
            targetUserId = targetUserSelector as string;
        }

        const assignmentId = randomUUID();
        const assignment: Assignment = {
            id: assignmentId,
            tags: step.assignmentTemplate.tags ?? ['workflow'],
            priority: step.assignmentTemplate.priority ?? 1000,
            ...step.assignmentTemplate,
            _workflowInstanceId: instance.id,
            _workflowStepId: step.id,
            _workflowContext: instance.context,
            _targetUserId: targetUserId || undefined,
        };

        await this.host.addAssignment(assignment);

        await this.redisClient.set(
            this.keys.workflowAssignmentLink(assignmentId),
            JSON.stringify({
                instanceId: instance.id,
                stepId: step.id,
                definitionId: definition.id,
            }),
        );

        if (targetUserId) {
            await this.host.matchUsersAssignments(targetUserId);
        }

        return assignment;
    }

    async publishWorkflowEvent(event: WorkflowEvent): Promise<string> {
        const streamKey = this.keys.eventStream();

        if (!event.workflowInstanceId && event.assignmentId) {
            const linkJson = await this.redisClient.get(this.keys.workflowAssignmentLink(event.assignmentId));
            if (linkJson) {
                const link = JSON.parse(linkJson);
                event.workflowInstanceId = link.instanceId;
                event.stepId = link.stepId;
            }
        }

        const messageId = await this.redisClient.xAdd(streamKey, '*', {
            eventId: event.eventId,
            type: event.type,
            userId: event.userId,
            assignmentId: event.assignmentId,
            workflowInstanceId: event.workflowInstanceId ?? '',
            stepId: event.stepId ?? '',
            timestamp: String(event.timestamp),
            payload: event.payload ? JSON.stringify(event.payload) : '',
        });

        return messageId;
    }

    async startOrchestrator(): Promise<void> {
        if (!this.options.enableWorkflows) {
            throw new Error('Workflows are not enabled. Set enableWorkflows: true in options.');
        }
        if (this.orchestratorRunning) return;

        this.orchestratorRunning = true;
        this.orchestratorAbortController = new AbortController();
        this.subscriberClient = this.redisClient.duplicate() as RedisClientType;
        await this.subscriberClient.connect();

        this.orchestratorLoop().catch((err) => {
            if (!this.orchestratorAbortController?.signal.aborted) {
                console.error('Orchestrator error:', err);
            }
        });
    }

    async stopOrchestrator(): Promise<void> {
        this.orchestratorRunning = false;
        this.orchestratorAbortController?.abort();
        if (this.subscriberClient?.isOpen) {
            await this.subscriberClient.quit();
            this.subscriberClient = null;
        }
    }

    private async orchestratorLoop(): Promise<void> {
        const streamKey = this.keys.eventStream();
        const client = this.subscriberClient!;

        const reclaimIntervalHandle = setInterval(async () => {
            try {
                await this.reclaimOrphanedMessages();
            } catch (err) {
                console.error('Error reclaiming orphaned messages:', err);
            }
        }, this.options.reclaimIntervalMs);

        try {
            while (this.orchestratorRunning) {
                try {
                    if (!this.reliability.shouldProcessCircuitBreaker()) {
                        await new Promise((r) => setTimeout(r, 5000));
                        continue;
                    }

                    const response = await client.xReadGroup(
                        this.options.streamConsumerGroup,
                        this.options.streamConsumerName,
                        [{ key: streamKey, id: '>' }],
                        { COUNT: 10, BLOCK: 5000 },
                    ) as any;

                    if (!response) continue;

                    for (const stream of response) {
                        for (const message of stream.messages) {
                            const event = this.parseStreamMessage(message);

                            if (await this.reliability.isEventProcessed(event.eventId)) {
                                await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                continue;
                            }

                            try {
                                await this.processWorkflowEvent(event);
                                await this.reliability.markEventProcessed(event.eventId);
                                await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                this.reliability.recordCircuitBreakerSuccess();
                                await this.reliability.emitAuditEvent('EVENT_PROCESSED', event.eventId, {
                                    type: event.type,
                                    workflowInstanceId: event.workflowInstanceId,
                                }, 'event');
                            } catch (err) {
                                console.error(`Error processing event ${event.eventId}:`, err);
                                this.reliability.recordCircuitBreakerFailure();

                                const retryKey = this.keys.eventRetryCount(event.eventId);
                                const retryCount = Number(await this.redisClient.get(retryKey)) || 0;

                                if (retryCount >= this.reliability.options.workflowMaxRetries!) {
                                    await this.reliability.moveToDeadLetter(
                                        event,
                                        'Processing failed after max retries',
                                        err instanceof Error ? err : new Error(String(err)),
                                    );
                                    await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                } else {
                                    await this.redisClient.incr(retryKey);
                                    await this.redisClient.expire(retryKey, 86400);
                                }
                            }
                        }
                    }
                } catch (err: any) {
                    if (this.orchestratorAbortController?.signal.aborted) break;
                    console.error('Orchestrator read error:', err);
                    this.reliability.recordCircuitBreakerFailure();
                    await new Promise((r) => setTimeout(r, 1000));
                }
            }
        } finally {
            clearInterval(reclaimIntervalHandle);
        }
    }

    private parseStreamMessage(message: { id: string; message: Record<string, string> }): WorkflowEvent {
        const m = message.message;
        return {
            eventId: m.eventId,
            type: m.type as WorkflowEventType,
            userId: m.userId,
            assignmentId: m.assignmentId,
            workflowInstanceId: m.workflowInstanceId || undefined,
            stepId: m.stepId || undefined,
            timestamp: Number(m.timestamp),
            payload: m.payload ? JSON.parse(m.payload) : undefined,
        };
    }

    private async processWorkflowEvent(event: WorkflowEvent): Promise<void> {
        if (!event.workflowInstanceId) return;

        const { span, end: endSpan } = this.telemetry.startSpan('workflow.process_event', {
            'workflow.event_type': event.type,
            'workflow.event_id': event.eventId,
            'workflow.instance_id': event.workflowInstanceId,
            'workflow.step_id': event.stepId ?? '',
        });

        try {
            const instance = await this.getWorkflowInstance(event.workflowInstanceId);
            if (!instance || instance.status !== 'active') {
                endSpan();
                return;
            }

            const definition = instance.definitionSnapshot ?? await this.getWorkflowDefinition(instance.workflowDefinitionId);
            if (!definition) {
                endSpan();
                return;
            }

            switch (event.type) {
                case 'COMPLETED':
                    await this.handleStepCompletion(instance, definition, event);
                    break;
                case 'FAILED':
                    await this.handleStepFailure(instance, definition, event);
                    break;
                case 'EXPIRED':
                    await this.handleStepExpiry(instance, definition, event);
                    break;
            }

            endSpan();
        } catch (err) {
            this.telemetry.recordSpanError(span, err instanceof Error ? err : new Error(String(err)));
            endSpan();
            throw err;
        }
    }

    private async handleStepCompletion(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<void> {
        const stepId = event.stepId;
        if (!stepId) return;

        const step = definition.steps.find((s) => s.id === stepId);
        if (!step) return;

        instance.history.push({
            stepId,
            assignmentId: event.assignmentId,
            userId: event.userId,
            completedAt: event.timestamp,
            result: event.payload,
        });

        if (event.payload) {
            instance.context = { ...instance.context, [`step_${stepId}`]: event.payload };
        }

        const expectedVersion = instance.version;
        if (instance.parallelBranches) {
            const branch = instance.parallelBranches.find((b) => b.stepId === stepId);
            if (branch) {
                branch.status = 'completed';
                branch.result = event.payload;
                const allComplete = instance.parallelBranches.every((b) => b.status === 'completed');
                if (!allComplete && step.waitForAll !== false) {
                    await this.saveInstance(instance, expectedVersion);
                    return;
                }
                instance.parallelBranches = undefined;
            }
        }

        let nextStepId: string | null = null;
        if (step.routing && step.routing.length > 0) {
            for (const route of step.routing) {
                if (this.evaluateCondition(route.condition, event.payload, instance.context)) {
                    nextStepId = route.targetStepId;
                    break;
                }
            }
        }

        if (!nextStepId && step.defaultNextStepId !== undefined) {
            nextStepId = step.defaultNextStepId;
        }

        if (nextStepId) {
            instance.currentStepId = nextStepId;
            instance.currentAssignmentId = undefined;
            await this.executeWorkflowStep(instance, nextStepId, definition);
        } else {
            instance.status = 'completed';
            instance.currentStepId = null;
            instance.currentAssignmentId = undefined;
            await this.saveInstance(instance, expectedVersion);
        }
    }

    private async handleStepFailure(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<void> {
        const stepId = event.stepId;
        if (!stepId) return;

        const step = definition.steps.find((s) => s.id === stepId);
        if (!step) return;

        const maxRetries = step.maxRetries ?? 0;
        const expectedVersion = instance.version;

        // Handle parallel branch failure
        if (instance.parallelBranches) {
            const branch = instance.parallelBranches.find((b) => b.stepId === stepId);
            if (branch) {
                branch.status = 'failed';

                const policy = step.failurePolicy ?? 'abort';
                if (policy === 'abort') {
                    // Fail entire workflow
                    instance.status = 'failed';
                    await this.saveInstance(instance, expectedVersion);
                    return;
                } else if (policy === 'continue') {
                    // Check if remaining branches can complete
                    const allDone = instance.parallelBranches.every(
                        (b) => b.status === 'completed' || b.status === 'failed',
                    );
                    if (allDone) {
                        // Proceed with partial results
                        await this.handleStepCompletion(instance, definition, {
                            ...event,
                            type: 'COMPLETED',
                        });
                    }
                    return;
                }
            }
        }

        // Retry logic
        if (instance.retryCount < maxRetries) {
            instance.retryCount += 1;
            await this.executeWorkflowStep(instance, stepId, definition);
        } else {
            // Workflow failed
            instance.status = 'failed';
            await this.saveInstance(instance, expectedVersion);
        }
    }

    private async handleStepExpiry(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<void> {
        await this.handleStepFailure(instance, definition, event);
    }

    private evaluateCondition(
        condition: string,
        result: Record<string, any> | undefined,
        context: Record<string, any>,
    ): boolean {
        try {
            const match = condition.match(/^(result|context)\.(\w+)\s*(===|!==|==|!=|>=|<=|>|<)\s*(.+)$/);
            if (!match) return false;

            const [, source, field, operator, valueStr] = match;
            const sourceObj = source === 'result' ? result : context;
            const actualValue = sourceObj?.[field];

            let expectedValue: any;
            if (valueStr === 'true') expectedValue = true;
            else if (valueStr === 'false') expectedValue = false;
            else if (valueStr === 'null') expectedValue = null;
            else if (/^['"].*['"]$/.test(valueStr)) expectedValue = valueStr.slice(1, -1);
            else if (!isNaN(Number(valueStr))) expectedValue = Number(valueStr);
            else expectedValue = valueStr;

            switch (operator) {
                case '==':
                case '===': return actualValue === expectedValue;
                case '!=':
                case '!==': return actualValue !== expectedValue;
                case '>': return actualValue > expectedValue;
                case '<': return actualValue < expectedValue;
                case '>=': return actualValue >= expectedValue;
                case '<=': return actualValue <= expectedValue;
                default: return false;
            }
        } catch {
            return false;
        }
    }

    async reclaimOrphanedMessages(): Promise<number> {
        if (!this.subscriberClient?.isOpen) return 0;
        const streamKey = this.keys.eventStream();
        let totalReclaimed = 0;

        try {
            const result = await this.subscriberClient.xAutoClaim(
                streamKey,
                this.options.streamConsumerGroup,
                this.options.streamConsumerName,
                this.options.reclaimMinIdleMs ?? this.options.reclaimIntervalMs,
                '0-0',
                { COUNT: 100 },
            );

            if (result && result.messages && result.messages.length > 0) {
                for (const message of result.messages) {
                    if (!message) continue;
                    const event = this.parseStreamMessage(message as any);
                    try {
                        if (await this.reliability.isEventProcessed(event.eventId)) {
                            await this.subscriberClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                            continue;
                        }

                        const retryKey = this.keys.eventRetryCount(event.eventId);
                        const retryCount = Number(await this.redisClient.get(retryKey)) || 0;

                        if (retryCount >= this.reliability.options.workflowMaxRetries!) {
                            await this.reliability.moveToDeadLetter(event, 'Max retries exceeded');
                            await this.subscriberClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                        } else {
                            try {
                                await this.processWorkflowEvent(event);
                                await this.reliability.markEventProcessed(event.eventId);
                                await this.subscriberClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                totalReclaimed++;
                            } catch (err) {
                                await this.redisClient.incr(retryKey);
                                await this.redisClient.expire(retryKey, 86400);
                                throw err;
                            }
                        }
                    } catch (err) {
                        console.error(`Error processing reclaimed message ${message.id}:`, err);
                    }
                }
            }
        } catch (err) {
            console.error('Error in XAUTOCLAIM:', err);
        }
        return totalReclaimed;
    }

    private async saveInstance(instance: WorkflowInstance, expectedVersion: number): Promise<void> {
        const instanceKey = this.keys.workflowInstance(instance.id);
        instance.version += 1;
        instance.updatedAt = Date.now();
        const newData = JSON.stringify(instance);

        if (this.luaScriptSha) {
            const result = await this.redisClient.evalSha(this.luaScriptSha, {
                keys: [instanceKey],
                arguments: [String(expectedVersion), newData],
            }) as string;
            const parsed = JSON.parse(result);
            if (parsed.err) {
                throw new Error(`Workflow transition failed: ${parsed.err}`);
            }
        } else {
            await this.redisClient.hSet(instanceKey, 'data', newData);
        }
    }

    async atomicWorkflowTransition(
        instanceId: string,
        expectedVersion: number,
        newStatus: WorkflowInstance['status'],
        newStepId: string | null,
        updatedContext: Record<string, any>,
        historyEntry?: WorkflowInstance['history'][0],
    ): Promise<{ ok: boolean; instance?: WorkflowInstance; error?: string }> {
        const instance = await this.getWorkflowInstance(instanceId);
        if (!instance) return { ok: false, error: 'Instance not found' };

        instance.status = newStatus;
        instance.currentStepId = newStepId;
        instance.context = { ...instance.context, ...updatedContext };
        if (historyEntry) instance.history.push(historyEntry);

        try {
            await this.saveInstance(instance, expectedVersion);
            return { ok: true, instance };
        } catch (err: any) {
            return { ok: false, error: err.message };
        }
    }
}
