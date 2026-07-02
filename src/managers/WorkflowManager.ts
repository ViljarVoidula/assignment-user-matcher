import { randomUUID, createHash } from 'crypto';
import {
    RedisClientType,
    WorkflowDefinition,
    WorkflowDefinitionInput,
    WorkflowDefinitionSummary,
    WorkflowInstance,
    WorkflowStep,
    WorkflowEvent,
    WorkflowEventType,
    Assignment,
    WorkflowInstanceWithSnapshot,
    ParallelBranchState,
    WorkflowEngineMetrics,
} from '../types/matcher';
import { KeyBuilders } from '../utils/keys';
import { ReliabilityManager } from './ReliabilityManager';
import { TelemetryManager } from './TelemetryManager';
import { normalizeWorkflowDefinition } from '../workflow-validation';

// Re-export the static backoff method for convenience
export const { backoff } = ReliabilityManager;

export interface WorkflowHost {
    addAssignment(assignment: Assignment): Promise<Assignment>;
    matchUsersAssignments(userId: string): Promise<any>;
    executeMachineTask?(args: {
        instance: WorkflowInstance;
        step: WorkflowStep;
        definition: WorkflowDefinition;
    }): Promise<Record<string, any> | void>;
}

/** Signature for machine task handlers registered via registerMachineHandler(). */
export type MachineTaskHandler = (args: {
    instance: WorkflowInstance;
    step: WorkflowStep;
    definition: WorkflowDefinition;
}) => Promise<Record<string, any> | void>;

export class WorkflowManager {
    private orchestratorRunning: boolean = false;
    private orchestratorAbortController: AbortController | null = null;
    private subscriberClient: RedisClientType | null = null;
    private subscriberReconnectAttempts: number = 0;
    private luaScriptSha: string | null = null;
    private machineHandlers: Map<string, MachineTaskHandler> = new Map();
    private throttleWindowStart: number = 0;
    private throttleTokensUsed: number = 0;

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
            commandTimeout?: number;
            /** TTL applied to terminal workflow instances; keeps them forever when unset */
            retentionMs?: number;
            /** Initial backoff delay for scheduled event retries (default: 1000ms) */
            retryBackoffMs?: number;
            /** Max stream entries read per orchestrator poll (default: 10) */
            eventBatchSize?: number;
            /** Blocking wait per orchestrator poll in ms (default: 5000) */
            pollBlockMs?: number;
            /** Per-replica cap on processed events per second; unlimited when unset */
            maxEventsPerSecond?: number;
        },
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

    /**
     * Register a machine task handler by name. Machine steps whose
     * machineTask.handler matches the name run through this handler.
     * Falls back to the host's executeMachineTask when no handler matches.
     */
    registerMachineHandler(name: string, handler: MachineTaskHandler): void {
        this.machineHandlers.set(name, handler);
    }

    async registerWorkflow(definition: WorkflowDefinitionInput | WorkflowDefinition): Promise<WorkflowDefinition> {
        const normalizedDefinition = normalizeWorkflowDefinition(definition);
        const key = this.keys.workflowDefinition(normalizedDefinition.id);
        await this.redisClient.set(key, JSON.stringify(normalizedDefinition));
        await this.redisClient.hSet(this.keys.workflowDefinitions(), normalizedDefinition.id, normalizedDefinition.name);
        return normalizedDefinition;
    }

    async getWorkflowDefinition(id: string): Promise<WorkflowDefinition | null> {
        const key = this.keys.workflowDefinition(id);
        const json = await this.redisClient.get(key);
        return json ? JSON.parse(json) : null;
    }

    async listWorkflowDefinitions(): Promise<WorkflowDefinitionSummary[]> {
        const definitions = await this.redisClient.hGetAll(this.keys.workflowDefinitions());
        return Object.entries(definitions).map(([id, name]) => ({ id, name }));
    }

    async startWorkflow(
        workflowDefinitionId: string,
        userId: string,
        initialContext?: Record<string, any>,
    ): Promise<WorkflowInstance> {
        if (!workflowDefinitionId.trim()) {
            throw new Error('Workflow definition ID is required');
        }
        if (!userId.trim()) {
            throw new Error('Workflow user ID is required');
        }

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
                definitionSnapshot:
                    this.reliability.options.workflowSnapshotDefinitions !== false
                        ? JSON.parse(JSON.stringify(definition))
                        : undefined,
            };

            const multi = this.redisClient.multi();
            multi.hSet(this.keys.workflowInstance(instanceId), 'data', JSON.stringify(instance));
            multi.sAdd(this.keys.workflowInstancesByUser(userId), instanceId);
            multi.hSet(this.keys.workflowInstances(), instanceId, workflowDefinitionId);
            multi.zAdd(this.keys.workflowInstancesActive(), { score: now, value: instanceId });
            await multi.exec();

            await this.reliability.emitAuditEvent(
                'WORKFLOW_STARTED',
                instanceId,
                {
                    definitionId: workflowDefinitionId,
                    definitionVersion: definition.version,
                    userId,
                },
                'workflow_instance',
            );

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

        const definition = instance.definitionSnapshot ?? (await this.getWorkflowDefinition(instance.workflowDefinitionId));

        return {
            ...instance,
            resolvedDefinition: definition ?? undefined,
        };
    }

    async getActiveWorkflowsForUser(userId: string): Promise<WorkflowInstance[]> {
        const instanceIds = await this.redisClient.sMembers(this.keys.workflowInstancesByUser(userId));
        if (instanceIds.length === 0) return [];

        const multi = this.redisClient.multi();
        for (const id of instanceIds) {
            multi.hGet(this.keys.workflowInstance(id), 'data');
        }
        const results = (await multi.exec()) as unknown as (string | null)[];

        const instances: WorkflowInstance[] = [];
        for (const json of results) {
            if (!json) continue;
            const instance: WorkflowInstance = JSON.parse(String(json));
            if (instance.status === 'active') {
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

                    const syntheticAssignmentId = this.deterministicAssignmentId(instance, parallelStepId);
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
        const syntheticAssignmentId = assignmentId ?? this.deterministicAssignmentId(instance, step.id);
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
            const handlerName = step.machineTask?.handler;
            const registered = handlerName ? this.machineHandlers.get(handlerName) : undefined;
            const executor: MachineTaskHandler | undefined =
                registered ?? (this.host.executeMachineTask ? (args) => this.host.executeMachineTask!(args) : undefined);

            if (!executor) {
                throw new Error(
                    `Machine task executor not configured for step "${step.id}" (handler: ${step.machineTask?.handler ?? 'unknown'})`,
                );
            }

            const run = Promise.resolve(executor({ instance, step, definition }));
            // Prevent unhandled rejections when the handler loses the timeout race
            run.catch(() => {});

            const timeoutMs = step.timeoutMs ?? definition.defaultTimeoutMs;
            let result: Record<string, any> | void;
            if (timeoutMs) {
                let timer: NodeJS.Timeout | undefined;
                const timeout = new Promise<never>((_, reject) => {
                    timer = setTimeout(
                        () => reject(new Error(`Machine step "${step.id}" timed out after ${timeoutMs}ms`)),
                        timeoutMs,
                    );
                });
                try {
                    result = await Promise.race([run, timeout]);
                } finally {
                    clearTimeout(timer);
                }
            } else {
                result = await run;
            }

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
        const multi = this.redisClient.multi();
        multi.set(expiryKey, String(expiryTime), { PX: timeoutMs });
        multi.zAdd(this.keys.workflowStepExpiryIndex(), {
            score: expiryTime,
            value: `${instanceId}|${stepId}`,
        });
        await multi.exec();
    }

    async processExpiredWorkflowSteps(): Promise<number> {
        if (!this.options.enableWorkflows) return 0;

        const indexKey = this.keys.workflowStepExpiryIndex();
        const due = await this.redisClient.zRangeByScore(indexKey, '-inf', Date.now());
        let expiredCount = 0;

        for (const member of due) {
            // Atomic claim: only the replica that removes the member fires the expiry
            const removed = await this.redisClient.zRem(indexKey, member);
            if (!removed) continue;

            const separatorIndex = member.indexOf('|');
            if (separatorIndex === -1) continue;
            const instanceId = member.slice(0, separatorIndex);
            const stepId = member.slice(separatorIndex + 1);

            const instance = await this.getWorkflowInstance(instanceId);
            if (!instance || instance.status !== 'active') continue;

            const branch = instance.parallelBranches?.find((b) => b.stepId === stepId);
            const isCurrentStep = instance.currentStepId === stepId;
            const isPendingBranch = branch?.status === 'pending';
            if (!isCurrentStep && !isPendingBranch) continue;

            await this.publishWorkflowEvent({
                eventId: randomUUID(),
                type: 'EXPIRED',
                userId: instance.initiatorUserId,
                assignmentId: branch?.assignmentId ?? instance.currentAssignmentId ?? '',
                workflowInstanceId: instanceId,
                stepId,
                timestamp: Date.now(),
            });

            expiredCount++;
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

        const assignmentId = this.deterministicAssignmentId(instance, step.id);
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

        // Setup subscriber client with reconnection handling
        await this.setupSubscriberClient();

        this.orchestratorLoop().catch((err) => {
            if (!this.orchestratorAbortController?.signal.aborted) {
                console.error('Orchestrator error:', err);
            }
        });
    }

    /**
     * Setup subscriber client with comprehensive reconnection handling
     */
    private async setupSubscriberClient(): Promise<void> {
        this.subscriberClient = this.redisClient.duplicate() as RedisClientType;

        // Setup reconnection handling
        this.subscriberClient.on('error', (err) => {
            console.error('Subscriber client error:', err);
            this.subscriberReconnectAttempts++;
            this.reliability.updateReconnectCount(this.subscriberReconnectAttempts);
        });

        this.subscriberClient.on('connect', () => {
            console.log('Subscriber client connected');
            this.subscriberReconnectAttempts = 0;
            this.reliability.updateReconnectCount(0);
        });

        this.subscriberClient.on('disconnect', () => {
            console.warn('Subscriber client disconnected');
            this.reliability.updateRedisHealth(false, 'Subscriber client disconnected');
        });

        this.subscriberClient.on('ready', () => {
            console.log('Subscriber client ready');
            this.reliability.updateRedisHealth(true);
        });

        await this.subscriberClient.connect();
    }

    /**
     * Reconnect subscriber client with exponential backoff
     */
    private async reconnectSubscriberClient(): Promise<void> {
        if (this.subscriberClient?.isOpen) {
            await this.subscriberClient.quit();
        }

        const maxAttempts = 5;
        let attempt = 0;

        while (attempt < maxAttempts && this.orchestratorRunning) {
            try {
                await this.setupSubscriberClient();
                console.log('Subscriber client reconnected successfully');
                return;
            } catch (err) {
                attempt++;
                this.subscriberReconnectAttempts = attempt;

                if (attempt >= maxAttempts) {
                    console.error(`Failed to reconnect subscriber client after ${maxAttempts} attempts`);
                    throw err;
                }

                // Exponential backoff: 100ms, 200ms, 400ms, 800ms, 1600ms
                const delay = Math.min(100 * Math.pow(2, attempt - 1), 2000);
                console.warn(`Subscriber client reconnection attempt ${attempt}/${maxAttempts}, retrying in ${delay}ms`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        throw new Error(`Failed to reconnect subscriber client after ${maxAttempts} attempts`);
    }

    async stopOrchestrator(): Promise<void> {
        this.orchestratorRunning = false;
        this.orchestratorAbortController?.abort();

        if (this.subscriberClient?.isOpen) {
            try {
                await this.subscriberClient.quit();
            } catch (err) {
                console.error('Error closing subscriber client:', err);
            }
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
            try {
                await this.drainScheduledRetries();
            } catch (err) {
                console.error('Error draining scheduled retries:', err);
            }
        }, this.options.reclaimIntervalMs);

        try {
            while (this.orchestratorRunning) {
                try {
                    if (!this.reliability.shouldProcessCircuitBreaker()) {
                        await new Promise((r) => setTimeout(r, 5000));
                        continue;
                    }

                    const response = (await client.xReadGroup(
                        this.options.streamConsumerGroup,
                        this.options.streamConsumerName,
                        [{ key: streamKey, id: '>' }],
                        {
                            COUNT: this.options.eventBatchSize ?? 10,
                            BLOCK: this.options.pollBlockMs ?? 5000,
                        },
                    )) as any;

                    if (!response) continue;

                    for (const stream of response) {
                        for (const message of stream.messages) {
                            const event = this.parseStreamMessage(message);

                            if (await this.reliability.isEventProcessed(event.eventId)) {
                                await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                continue;
                            }

                            await this.applyEventThrottle();

                            try {
                                await this.processWorkflowEvent(event);
                                await this.reliability.markEventProcessed(event.eventId);
                                await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                this.reliability.recordCircuitBreakerSuccess();
                                await this.reliability.emitAuditEvent(
                                    'EVENT_PROCESSED',
                                    event.eventId,
                                    {
                                        type: event.type,
                                        workflowInstanceId: event.workflowInstanceId,
                                    },
                                    'event',
                                );
                            } catch (err) {
                                console.error(`Error processing event ${event.eventId}:`, err);
                                await this.reliability.recordCircuitBreakerFailure();

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
                                    const nextRetryCount = Number(await this.redisClient.incr(retryKey));
                                    await this.redisClient.expire(retryKey, 86400);
                                    // Schedule a delayed retry with backoff and release the
                                    // stream entry instead of waiting for the reclaim idle window.
                                    await this.scheduleEventRetry(event, nextRetryCount);
                                    await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                                }
                            }
                        }
                    }
                } catch (err: any) {
                    if (this.orchestratorAbortController?.signal.aborted) break;

                    console.error('Orchestrator read error:', err);
                    await this.reliability.recordCircuitBreakerFailure();

                    // Check if it's a connection error and try to reconnect
                    const errorMessage = err?.message || String(err);
                    if (
                        errorMessage.includes('connection') ||
                        errorMessage.includes('Socket') ||
                        errorMessage.includes('ECONN')
                    ) {
                        console.warn('Detected connection error, attempting to reconnect subscriber client...');
                        try {
                            await this.reconnectSubscriberClient();
                        } catch (reconnectErr) {
                            console.error('Failed to reconnect subscriber client:', reconnectErr);
                        }
                    }

                    // Exponential backoff before retry
                    await ReliabilityManager.backoff(this.subscriberReconnectAttempts);
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
            const maxAttempts = 3;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const instance = await this.getWorkflowInstance(event.workflowInstanceId);
                if (!instance || instance.status !== 'active') {
                    break;
                }

                const definition =
                    instance.definitionSnapshot ?? (await this.getWorkflowDefinition(instance.workflowDefinitionId));
                if (!definition) {
                    break;
                }

                try {
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
                    break;
                } catch (err: any) {
                    // Optimistic-lock conflicts are retried in place with a fresh
                    // read instead of waiting for the reclaim loop.
                    if (attempt < maxAttempts - 1 && String(err?.message ?? err).includes('VERSION_MISMATCH')) {
                        await ReliabilityManager.backoff(attempt, 25, 250);
                        continue;
                    }
                    throw err;
                }
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
                    } else {
                        await this.saveInstance(instance, expectedVersion);
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
                case '===':
                    return actualValue === expectedValue;
                case '!=':
                case '!==':
                    return actualValue !== expectedValue;
                case '>':
                    return actualValue > expectedValue;
                case '<':
                    return actualValue < expectedValue;
                case '>=':
                    return actualValue >= expectedValue;
                case '<=':
                    return actualValue <= expectedValue;
                default:
                    return false;
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
            const result = (await this.redisClient.evalSha(this.luaScriptSha, {
                keys: [instanceKey],
                arguments: [String(expectedVersion), newData],
            })) as string;
            const parsed = JSON.parse(result);
            if (parsed.err) {
                throw new Error(`Workflow transition failed: ${parsed.err}`);
            }
        } else {
            await this.redisClient.hSet(instanceKey, 'data', newData);
        }

        await this.syncInstanceIndexes(instance);
    }

    /**
     * Keep the active-instance index in sync with instance status and apply
     * the retention policy to terminal instances.
     */
    private async syncInstanceIndexes(instance: WorkflowInstance): Promise<void> {
        const activeKey = this.keys.workflowInstancesActive();

        if (instance.status === 'active') {
            await this.redisClient.zAdd(activeKey, { score: instance.updatedAt, value: instance.id });
            return;
        }

        const multi = this.redisClient.multi();
        multi.zRem(activeKey, instance.id);
        if (this.options.retentionMs) {
            multi.pExpire(this.keys.workflowInstance(instance.id), this.options.retentionMs);
            multi.hDel(this.keys.workflowInstances(), instance.id);
            multi.sRem(this.keys.workflowInstancesByUser(instance.initiatorUserId), instance.id);
        }
        await multi.exec();
    }

    /**
     * Deterministic assignment id for a step execution, so replays of the same
     * event after a crash produce the same assignment instead of duplicates.
     */
    private deterministicAssignmentId(instance: WorkflowInstance, stepId: string): string {
        return createHash('sha256')
            .update(`wfa:${instance.id}:${stepId}:${instance.retryCount}:${instance.history.length}`)
            .digest('hex')
            .slice(0, 32);
    }

    /**
     * Per-replica flow-rate limiter: allows a burst of up to maxEventsPerSecond
     * events per one-second window, then waits for the window to roll over.
     * No-op when maxEventsPerSecond is unset.
     */
    private async applyEventThrottle(): Promise<void> {
        const limit = this.options.maxEventsPerSecond;
        if (!limit || limit <= 0) return;

        const now = Date.now();
        if (now - this.throttleWindowStart >= 1000) {
            this.throttleWindowStart = now;
            this.throttleTokensUsed = 0;
        }

        if (this.throttleTokensUsed >= limit) {
            const waitMs = Math.max(this.throttleWindowStart + 1000 - now, 1);
            await new Promise((r) => setTimeout(r, waitMs));
            this.throttleWindowStart = Date.now();
            this.throttleTokensUsed = 0;
        }

        this.throttleTokensUsed++;
    }

    /**
     * Schedule a failed event for a delayed retry with exponential backoff.
     */
    async scheduleEventRetry(event: WorkflowEvent, attempt: number): Promise<void> {
        const base = this.options.retryBackoffMs ?? 1000;
        const delay = Math.min(base * Math.pow(2, Math.max(attempt - 1, 0)), 60000);
        await this.redisClient.zAdd(this.keys.eventsRetryScheduled(), {
            score: Date.now() + delay,
            value: JSON.stringify(event),
        });
    }

    /**
     * Process due scheduled retries. Entries are claimed atomically (ZREM) so
     * concurrent replicas never process the same retry twice.
     */
    async drainScheduledRetries(): Promise<number> {
        const key = this.keys.eventsRetryScheduled();
        const due = await this.redisClient.zRangeByScore(key, '-inf', Date.now());
        let processed = 0;

        for (const raw of due) {
            const removed = await this.redisClient.zRem(key, raw);
            if (!removed) continue;

            let event: WorkflowEvent;
            try {
                event = JSON.parse(raw);
            } catch {
                continue;
            }

            if (await this.reliability.isEventProcessed(event.eventId)) continue;

            await this.applyEventThrottle();

            try {
                await this.processWorkflowEvent(event);
                await this.reliability.markEventProcessed(event.eventId);
                processed++;
            } catch (err) {
                const retryKey = this.keys.eventRetryCount(event.eventId);
                const retryCount = Number(await this.redisClient.incr(retryKey));
                await this.redisClient.expire(retryKey, 86400);

                if (retryCount >= this.reliability.options.workflowMaxRetries!) {
                    await this.reliability.moveToDeadLetter(
                        event,
                        'Max retries exceeded',
                        err instanceof Error ? err : new Error(String(err)),
                    );
                } else {
                    await this.scheduleEventRetry(event, retryCount);
                }
            }
        }

        return processed;
    }

    /**
     * Backfill the active-instance index from legacy instance records that
     * were created before the index existed. Safe to run multiple times.
     */
    async backfillWorkflowIndexes(): Promise<number> {
        let cursor = '0';
        let indexed = 0;

        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.keys.workflowInstances(), cursor, {
                COUNT: 100,
            });
            cursor = nextCursor;

            for (const entry of entries) {
                const instance = await this.getWorkflowInstance(entry.field);
                if (instance && instance.status === 'active') {
                    await this.redisClient.zAdd(this.keys.workflowInstancesActive(), {
                        score: instance.updatedAt,
                        value: instance.id,
                    });
                    indexed++;
                }
            }
        } while (cursor !== '0');

        return indexed;
    }

    /**
     * Remove terminal (completed/failed/cancelled) workflow instances that
     * were last updated more than olderThanMs ago, including their registry,
     * per-user, and active-index entries.
     */
    async pruneWorkflowInstances(olderThanMs: number): Promise<number> {
        const cutoff = Date.now() - olderThanMs;
        let cursor = '0';
        let pruned = 0;

        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.keys.workflowInstances(), cursor, {
                COUNT: 100,
            });
            cursor = nextCursor;

            for (const entry of entries) {
                const instanceId = entry.field;
                const instance = await this.getWorkflowInstance(instanceId);
                if (!instance) {
                    await this.redisClient.hDel(this.keys.workflowInstances(), instanceId);
                    continue;
                }
                if (instance.status === 'active') continue;
                if (instance.updatedAt > cutoff) continue;

                const multi = this.redisClient.multi();
                multi.del(this.keys.workflowInstance(instanceId));
                multi.hDel(this.keys.workflowInstances(), instanceId);
                multi.sRem(this.keys.workflowInstancesByUser(instance.initiatorUserId), instanceId);
                multi.zRem(this.keys.workflowInstancesActive(), instanceId);
                await multi.exec();
                pruned++;
            }
        } while (cursor !== '0');

        return pruned;
    }

    /**
     * Operational metrics for the workflow engine.
     */
    async getWorkflowMetrics(): Promise<WorkflowEngineMetrics> {
        const [activeInstances, scheduledRetries, deadLetterQueueSize] = await Promise.all([
            this.redisClient.zCard(this.keys.workflowInstancesActive()),
            this.redisClient.zCard(this.keys.eventsRetryScheduled()),
            this.reliability.getDeadLetterQueueSize(),
        ]);

        let streamLength = 0;
        let streamPending = 0;
        try {
            streamLength = Number(await this.redisClient.xLen(this.keys.eventStream()));
        } catch {
            // Stream may not exist yet
        }
        try {
            const pendingInfo = await this.redisClient.xPending(this.keys.eventStream(), this.options.streamConsumerGroup);
            streamPending = Number((pendingInfo as any)?.pending ?? 0);
        } catch {
            // Consumer group may not exist yet
        }

        return {
            activeInstances: Number(activeInstances),
            scheduledRetries: Number(scheduledRetries),
            deadLetterQueueSize,
            streamLength,
            streamPending,
        };
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
