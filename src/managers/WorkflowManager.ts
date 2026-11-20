import { randomUUID, createHash } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
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
    WorkflowInstanceQuery,
    WorkflowInstancePage,
    WorkflowTransition,
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
    /** Checked at run start when a step targets 'initiator' (the default target). Skipped if unimplemented. */
    userExists?(userId: string): Promise<boolean>;
    /** Used by cancelWorkflow to clean up a run's outstanding queued/pending assignment. Skipped if unimplemented. */
    removeAssignment?(assignmentId: string): Promise<any>;
}

/** Signature for machine task handlers registered via registerMachineHandler(). */
export type MachineTaskHandler = (args: {
    instance: WorkflowInstance;
    step: WorkflowStep;
    definition: WorkflowDefinition;
    /** Aborted when the step's timeout fires — stop work and side effects. */
    signal?: AbortSignal;
    /**
     * Id of this attempt of this step. Every retry — including the one that
     * follows a crashed or timed-out attempt — is a new attempt with a new id,
     * so this identifies one execution, not "this step of this run". To make
     * an outside effect happen once per run however often the step is
     * retried, key it on `instance.id` + `step.id` instead.
     */
    attemptId?: string;
}) => Promise<Record<string, any> | void>;

export class WorkflowManager {
    private orchestratorRunning: boolean = false;
    private orchestratorAbortController: AbortController | null = null;
    private subscriberClient: RedisClientType | null = null;
    private subscriberReconnectAttempts: number = 0;
    private luaScriptSha: string | null = null;
    /** Script source, kept so a NOSCRIPT after a Redis restart can re-load it. */
    private luaScriptSource: string | null = null;
    /**
     * Event id being applied by the current call chain — saveInstance stamps
     * its idempotency marker atomically with the CAS write.
     *
     * Scoped per async call chain, not held in a field: one manager applies
     * events concurrently (the stream loop, startWorkflow, machine steps, the
     * retry drain and the reclaim timer all overlap), and a shared field let
     * one event's save stamp another event's marker. An event that then lost
     * its CAS race found "its" marker on the retry and was dropped unapplied —
     * a run stuck forever with nothing in the dead-letter queue.
     *
     * The scope also names the event's own run, and saveInstance stamps only
     * that run's saves: host code reached from inside the scope (an
     * onWorkflowEvent hook or a machine handler that starts or cancels
     * another run) inherits it, and that other run's save must never mark
     * this event as applied. The onWorkflowEvent hook and machine handlers
     * are additionally run outside the scope (the matcher's own lifecycle and
     * decision hooks, reached through addAssignment/matching, are not).
     *
     * The scope also holds the transitions emitted while the event is being
     * applied: they are delivered once the run's save has succeeded and
     * dropped if it fails, so an attempt that loses the version race and is
     * applied again does not report the same transition twice.
     */
    private eventScope = new AsyncLocalStorage<{ eventId: string; instanceId?: string; emits: Array<() => void> }>();
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
            /**
             * Automatically trim the workflow event stream up to the
             * consumption frontier — every entry delivered *and* acknowledged
             * by every consumer group — after event processing and on the
             * reclaim interval. Never trims ahead of consumers, so trimming
             * cannot lose an event; the flip side is that the stream still
             * grows while consumers are down. Unset (default): never trimmed.
             */
            autoTrimEventStream?: boolean;
            /** Initial backoff delay for scheduled event retries (default: 1000ms) */
            retryBackoffMs?: number;
            /** Max stream entries read per orchestrator poll (default: 10) */
            eventBatchSize?: number;
            /** Blocking wait per orchestrator poll in ms (default: 5000) */
            pollBlockMs?: number;
            /** Per-replica cap on processed events per second; unlimited when unset */
            maxEventsPerSecond?: number;
            /** Throttle window length in ms (default: 1000). Internal tuning knob. */
            throttleWindowMs?: number;
            /** Fired after every durably-applied transition; best-effort, errors swallowed */
            onWorkflowEvent?: (transition: WorkflowTransition) => void;
            /**
             * How long a machine step with no timeout of its own may run before
             * the timeout sweep treats it as interrupted and fails/retries it
             * (default 15 minutes; 0 disables). Without it a process that died
             * mid-handler left the run waiting forever.
             */
            machineLeaseMs?: number;
            /**
             * How long after creation a run whose first step was never saved
             * is picked up by the timeout sweep and started (default 30s).
             */
            startRecoveryMs?: number;
        },
    ) {}

    /**
     * Fire the onWorkflowEvent hook, if configured. Best-effort: mirrors
     * onMatchDecision's contract, errors thrown by the callback never affect
     * workflow processing.
     */
    private emitTransition(
        kind: WorkflowTransition['kind'],
        instance: WorkflowInstance,
        extra?: { stepId?: string; assignmentId?: string; payload?: Record<string, any> },
    ): void {
        const hook = this.options.onWorkflowEvent;
        if (!hook) return;
        const scope = this.eventScope.getStore();
        // Held transitions report the run as it was when they happened, not
        // as later steps of the same event left it.
        const snapshot: WorkflowInstance = scope
            ? {
                  ...instance,
                  context: { ...instance.context },
                  history: instance.history.slice(),
                  parallelBranches: instance.parallelBranches?.map((b) => ({ ...b })),
                  failures: instance.failures?.slice(),
              }
            : instance;
        const fire = () => {
            try {
                this.eventScope.exit(() => hook({ kind, instance: snapshot, ...extra }));
            } catch {
                // Swallowed by design — a broken consumer must never affect workflow processing.
            }
        };
        if (scope) scope.emits.push(fire);
        else fire();
    }

    /** Deliver the transitions held for the current event, in order. */
    private flushTransitions(): void {
        const scope = this.eventScope.getStore();
        if (!scope || scope.emits.length === 0) return;
        for (const fire of scope.emits.splice(0)) fire();
    }

    private machineLeaseMs(): number | undefined {
        const lease = this.options.machineLeaseMs ?? 15 * 60_000;
        return lease > 0 ? lease : undefined;
    }

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

    private isNoGroupError(err: unknown): boolean {
        const message = err instanceof Error ? err.message : String(err ?? '');
        return message.includes('NOGROUP');
    }

    setLuaScriptSha(sha: string, source?: string): void {
        this.luaScriptSha = sha;
        if (source !== undefined) this.luaScriptSource = source;
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

    /**
     * Delete a workflow definition and its listing entry. Running instances keep
     * their own `definitionSnapshot`, so in-flight workflows are unaffected.
     * Returns `false` if no definition with that id existed.
     */
    async deleteWorkflowDefinition(id: string): Promise<boolean> {
        const removed = await this.redisClient.del(this.keys.workflowDefinition(id));
        await this.redisClient.hDel(this.keys.workflowDefinitions(), id);
        return removed > 0;
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

            // Conservative guard: any assignment step that targets 'initiator'
            // (the default target when unset) needs a real user to assign to, or
            // the run silently stalls at that step instead of failing fast at
            // start. Machine/external steps don't route to a user, so their
            // (absent) targetUser must not count as targeting the initiator.
            const targetsInitiator = definition.steps.some(
                (s) => (s.taskType ?? 'assignment') === 'assignment' && (s.targetUser ?? 'initiator') === 'initiator',
            );
            if (targetsInitiator && this.host.userExists) {
                const exists = await this.host.userExists(userId);
                if (!exists) {
                    throw new Error(`Initiator user not found: ${userId}`);
                }
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

            // A plain Date.now() score would tie (and, at the exclusive cursor
            // boundary, silently drop) runs started within the same millisecond —
            // realistic under a burst of automated triggers. INCR guarantees a
            // strictly distinct, creation-order-preserving score instead.
            const sequence = await this.redisClient.incr(this.keys.workflowInstanceSequence());

            const multi = this.redisClient.multi();
            const initialData = JSON.stringify(instance);
            multi.hSet(this.keys.workflowInstance(instanceId), {
                data: initialData,
                version: '1',
                sum: WorkflowManager.checksum(initialData),
            });
            // Until its first step is saved the run is only "starting": a
            // crash before that save is recovered by the timeout sweep.
            multi.zAdd(this.keys.workflowInstancesStarting(), { score: now, value: instanceId });
            multi.sAdd(this.keys.workflowInstancesByUser(userId), instanceId);
            multi.hSet(this.keys.workflowInstances(), instanceId, workflowDefinitionId);
            multi.zAdd(this.keys.workflowInstancesActive(), { score: now, value: instanceId });
            multi.zAdd(this.keys.workflowInstancesByTime(), { score: sequence, value: instanceId });
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

            this.emitTransition('run.started', instance, { stepId: definition.initialStepId });

            try {
                await this.executeWorkflowStep(instance, definition.initialStepId, definition);
            } catch (err) {
                // Start recovery got to the first step before this call did:
                // the run is started, just not by us.
                const stored = await this.getWorkflowInstance(instanceId);
                if (!String((err as Error)?.message ?? err).includes('VERSION_MISMATCH')) {
                    if (stored && stored.version > 1) {
                        // The first step was saved before something later
                        // threw (a machine result that could not be saved,
                        // the next step's work failing to queue). The run is
                        // started and its step timeout will settle it, so
                        // the caller gets the run — an error here would
                        // invite a retry and a second live run.
                        console.error(`Workflow run ${instanceId} started, then hit an error:`, err);
                        endSpan();
                        return stored;
                    }
                    // Nothing was saved: the caller is told the start failed,
                    // so the run must not come alive later through recovery.
                    await this.failUnstartedRun(instanceId, err);
                    throw err;
                }
                endSpan();
                return stored ?? instance;
            }

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

    /**
     * List workflow instances (runs) newest-created first, optionally filtered
     * by status and/or workflow definition. Paginated via an opaque cursor
     * (the createdAt score of the last item returned) — pass it back as
     * `cursor` for the next page.
     */
    async listWorkflowInstances(query: WorkflowInstanceQuery = {}): Promise<WorkflowInstancePage> {
        const limit = Math.max(query.limit ?? 50, 1);
        const byTimeKey = this.keys.workflowInstancesByTime();

        const instances: WorkflowInstance[] = [];
        let upperBound: string = query.cursor ? `(${query.cursor}` : '+inf';
        let lastScore: number | undefined;
        const scanBatchSize = Math.max(limit * 2, 20);

        // Scan back in time in batches, filtering status/workflowDefinitionId in
        // memory, until we have `limit` matches or the index is exhausted.
        while (instances.length < limit) {
            const ids = await this.redisClient.zRangeWithScores(byTimeKey, upperBound, '-inf', {
                REV: true,
                BY: 'SCORE',
                LIMIT: { offset: 0, count: scanBatchSize },
            });
            if (!ids.length) break;

            const ghosts: string[] = [];
            for (const { value: id, score } of ids) {
                const instance = await this.getWorkflowInstance(id);
                lastScore = score;
                if (!instance) {
                    // Retention expired the instance hash after the terminal
                    // transition removed its registry entry, so nothing else
                    // can ever clean this member — self-heal on read.
                    ghosts.push(id);
                    continue;
                }
                if (query.status && instance.status !== query.status) continue;
                if (query.workflowDefinitionId && instance.workflowDefinitionId !== query.workflowDefinitionId) continue;
                instances.push(instance);
                if (instances.length >= limit) break;
            }

            if (ghosts.length > 0) {
                await this.redisClient.zRem(byTimeKey, ghosts);
            }

            if (ids.length < scanBatchSize) break; // index exhausted
            upperBound = `(${lastScore}`;
        }

        const nextCursor = instances.length >= limit && lastScore !== undefined ? String(lastScore) : undefined;
        return { instances, nextCursor };
    }

    /**
     * Active runs nothing has happened to for at least `idleMs`, oldest
     * first. A run whose step has no timeout waits for as long as its work
     * does; this is how a host finds the ones that have waited too long
     * (work removed by an operator, a named person who left, nobody eligible).
     */
    async listStalledWorkflowInstances(idleMs: number, limit = 100): Promise<WorkflowInstance[]> {
        const ids = await this.redisClient.zRangeByScore(this.keys.workflowInstancesActive(), '-inf', Date.now() - idleMs, {
            LIMIT: { offset: 0, count: Math.max(limit, 1) },
        });
        const stalled: WorkflowInstance[] = [];
        for (const id of ids) {
            const instance = await this.getWorkflowInstance(id);
            if (instance?.status === 'active') stalled.push(instance);
        }
        return stalled;
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

    /**
     * Cancel a running workflow instance. Cleans up its outstanding
     * assignment(s) — the current step's assignment, or any still-pending
     * parallel branch assignments — so a cancelled run doesn't leave orphaned
     * work queued/pending forever, and clears their step timeouts.
     */
    async cancelWorkflow(instanceId: string): Promise<boolean> {
        const instance = await this.getWorkflowInstance(instanceId);
        if (!instance) {
            throw new Error(`Workflow instance not found: ${instanceId}`);
        }

        // A run that already ended has nothing to cancel; flipping a completed
        // or failed run to cancelled would rewrite its outcome.
        if (instance.status !== 'active') return false;

        const expectedVersion = instance.version;
        instance.status = 'cancelled';

        const outstandingAssignmentIds: string[] = [];
        const outstandingStepIds: string[] = [];
        if (instance.currentAssignmentId) outstandingAssignmentIds.push(instance.currentAssignmentId);
        // Machine and external steps have no assignment but do have a timeout.
        if (instance.currentStepId) outstandingStepIds.push(instance.currentStepId);
        for (const branch of instance.parallelBranches ?? []) {
            if (branch.status === 'pending') {
                outstandingAssignmentIds.push(branch.assignmentId);
                outstandingStepIds.push(branch.stepId);
            }
        }

        await this.saveInstance(instance, expectedVersion);

        for (const stepId of outstandingStepIds) {
            await this.redisClient.zRem(this.keys.workflowStepExpiryIndex(), `${instanceId}|${stepId}`);
            await this.redisClient.del(this.keys.workflowStepExpiry(instanceId, stepId));
        }
        for (const assignmentId of outstandingAssignmentIds) {
            if (this.host.removeAssignment) {
                await this.host.removeAssignment(assignmentId);
            }
            await this.forgetStepWork(assignmentId);
        }

        this.emitTransition('run.cancelled', instance);
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
            const externalParallelSteps: Array<{ stepId: string; assignmentId: string }> = [];

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
                } else if (taskType === 'external') {
                    if (!parallelStep.external?.name) {
                        throw new Error(`External step "${parallelStep.id}" is missing external.name`);
                    }

                    const syntheticAssignmentId = this.deterministicAssignmentId(instance, parallelStepId);
                    externalParallelSteps.push({ stepId: parallelStepId, assignmentId: syntheticAssignmentId });
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

                // Machine branches run one after another, so a branch's lease
                // has to cover the branches ahead of it as well as itself.
                const lease = this.machineLeaseMs();
                const timeoutMs =
                    parallelStep.timeoutMs ??
                    definition.defaultTimeoutMs ??
                    (taskType === 'machine' && lease ? lease * machineParallelSteps.length : undefined);
                if (timeoutMs) {
                    await this.setStepTimeout(instance.id, parallelStepId, timeoutMs);
                }
            }

            instance.parallelBranches = branches;
            instance.parallelForkStepId = stepId;
            instance.currentStepId = null;
            instance.currentAssignmentId = undefined;
            await this.saveInstance(instance, expectedVersion);

            for (const machineStep of machineParallelSteps) {
                const parallelStep = definition.steps.find((s) => s.id === machineStep.stepId);
                if (!parallelStep) continue;
                await this.executeMachineStep(instance, parallelStep, definition, machineStep.assignmentId);
            }

            for (const externalStep of externalParallelSteps) {
                const parallelStep = definition.steps.find((s) => s.id === externalStep.stepId);
                if (!parallelStep) continue;
                this.emitTransition('step.ready', instance, {
                    stepId: externalStep.stepId,
                    assignmentId: externalStep.assignmentId,
                    payload: { name: parallelStep.external!.name, input: parallelStep.external!.input },
                });
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

            const timeoutMs = step.timeoutMs ?? definition.defaultTimeoutMs ?? this.machineLeaseMs();
            if (timeoutMs) {
                await this.setStepTimeout(instance.id, stepId, timeoutMs);
            }

            await this.saveInstance(instance, expectedVersion);
            await this.executeMachineStep(instance, step, definition);
            return;
        }

        if (taskType === 'external') {
            if (!step.external?.name) {
                throw new Error(`External step "${step.id}" is missing external.name`);
            }

            instance.currentAssignmentId = undefined;
            instance.currentStepId = stepId;

            const timeoutMs = step.timeoutMs ?? definition.defaultTimeoutMs;
            if (!timeoutMs) {
                throw new Error(`External step "${step.id}" requires a timeoutMs (or the workflow's defaultTimeoutMs)`);
            }
            await this.setStepTimeout(instance.id, stepId, timeoutMs);

            await this.saveInstance(instance, expectedVersion);
            this.emitTransition('step.ready', instance, {
                stepId,
                assignmentId: this.deterministicAssignmentId(instance, stepId),
                payload: { name: step.external.name, input: step.external.input },
            });
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

        let result: Record<string, any> | void;
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

            const abort = new AbortController();
            const run = Promise.resolve(
                this.eventScope.exit(() =>
                    executor({ instance, step, definition, signal: abort.signal, attemptId: syntheticAssignmentId }),
                ),
            );
            // Prevent unhandled rejections when the handler loses the timeout race
            run.catch(() => {});

            const timeoutMs = step.timeoutMs ?? definition.defaultTimeoutMs;
            if (timeoutMs) {
                let timer: NodeJS.Timeout | undefined;
                const timeout = new Promise<never>((_, reject) => {
                    timer = setTimeout(() => {
                        // Tell the handler to stop: the race below only stops
                        // waiting for it, and its side effects would carry on.
                        abort.abort();
                        reject(new Error(`Machine step "${step.id}" timed out after ${timeoutMs}ms`));
                    }, timeoutMs);
                });
                try {
                    result = await Promise.race([run, timeout]);
                } finally {
                    clearTimeout(timer);
                }
            } else {
                result = await run;
            }
        } catch (err: any) {
            await this.processWorkflowEvent({
                ...eventBase,
                type: 'FAILED',
                payload: {
                    error: err?.message ?? String(err),
                },
            });
            return;
        }

        // Applied outside the handler's try: a save that fails here must not
        // be reported as the handler failing. It propagates instead; the
        // step's timeout (its own, or the machine lease) is still armed —
        // it is cleared only after the save — and recovers the run.
        await this.processWorkflowEvent({
            ...eventBase,
            type: 'COMPLETED',
            payload: result ? { ...result } : undefined,
        });
    }

    /**
     * Drop what is left of a step's superseded work after the matcher has
     * removed it: the link back to the run, and a parked copy. The matcher's
     * removeAssignment leaves the parked store alone (its own park flows rely
     * on that), and a parked record that outlives its step is re-queued, for a
     * step that has already failed, the moment somebody unparks it.
     */
    private async forgetStepWork(assignmentId: string): Promise<void> {
        await this.redisClient
            .multi()
            .del(this.keys.workflowAssignmentLink(assignmentId))
            .hDel(this.keys.parkedAssignments(), assignmentId)
            .exec();
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

    /**
     * Drop a step's timeout once the step has an outcome. Without this every
     * finished step left its entry in the expiry index until the timeout came
     * due — with day-long timeouts, an index the size of a day's traffic that
     * the sweep then had to read an instance for, one by one, to discard.
     */
    /**
     * clearStepTimeout after a save: the event is already applied and marked,
     * so a throw here could not be retried — it would only discard the
     * transitions still waiting to be delivered. A timeout left behind is
     * harmless (the sweep drops it when it comes due).
     */
    private async clearStepTimeoutQuietly(instanceId: string, stepId: string): Promise<void> {
        try {
            await this.clearStepTimeout(instanceId, stepId);
        } catch (err) {
            console.error(`Failed to clear the timeout of step "${stepId}" in workflow ${instanceId}:`, err);
        }
    }

    private async clearStepTimeout(instanceId: string, stepId: string): Promise<void> {
        // Only once the step's outcome is saved, and only if the run is no
        // longer on it. Cleared any earlier, a failure between the clear and
        // the save (creating the next step's work, a lost version race) left
        // the run on this step with nothing to move it — fatal for a machine
        // step, whose result never travels the stream and is never
        // redelivered. Read back rather than trusted from the caller: the
        // advance may have re-entered this step and re-armed its timeout.
        const instance = await this.getWorkflowInstance(instanceId);
        const live =
            !!instance &&
            instance.status === 'active' &&
            (instance.currentStepId === stepId ||
                (instance.parallelBranches?.some((b) => b.stepId === stepId && b.status === 'pending') ?? false));
        if (live) return;
        await this.redisClient
            .multi()
            .zRem(this.keys.workflowStepExpiryIndex(), `${instanceId}|${stepId}`)
            .del(this.keys.workflowStepExpiry(instanceId, stepId))
            .exec();
    }

    /**
     * Start runs whose creation was interrupted before their first step was
     * saved (a crash; a first step that throws fails the run instead). Such a run is active with
     * nothing outstanding and no timeout, so nothing else would ever move it.
     * Runs on the timeout sweep. The version check plus the CAS save mean two
     * replicas — or this and a slow startWorkflow — cannot both start it, and
     * a machine first step runs only after that save, so only once.
     */
    async recoverInterruptedStarts(): Promise<number> {
        const key = this.keys.workflowInstancesStarting();
        const graceMs = this.options.startRecoveryMs ?? 30_000;
        const ids = await this.redisClient.zRangeByScore(key, '-inf', Date.now() - graceMs);
        let recovered = 0;
        for (const id of ids) {
            // One replica per run: the first step creates work before its
            // save, and two replicas doing so queue that work twice.
            const claimed = await this.redisClient.set(this.keys.workflowStartLock(id), this.options.streamConsumerName, {
                NX: true,
                PX: Math.max(graceMs, 10_000),
            });
            if (!claimed) continue;
            try {
                const instance = await this.getWorkflowInstance(id);
                if (!instance || instance.status !== 'active' || instance.version !== 1) {
                    await this.redisClient.zRem(key, id);
                    continue;
                }
                const definition =
                    instance.definitionSnapshot ?? (await this.getWorkflowDefinition(instance.workflowDefinitionId));
                const attempts = await this.redisClient.hIncrBy(this.keys.workflowInstance(id), 'startAttempts', 1);
                if (!definition || attempts > WorkflowManager.MAX_START_RECOVERIES) {
                    await this.failUnstartedRun(
                        id,
                        new Error(definition ? 'first step could not be started' : 'definition not found'),
                    );
                    continue;
                }
                // Retried once per grace period, not on every sweep.
                await this.redisClient.zAdd(key, { score: Date.now(), value: id });
                // The crash may have come before or after the original
                // announcement, so a recovered run is announced again.
                this.emitTransition('run.started', instance, {
                    stepId: instance.currentStepId ?? definition.initialStepId,
                });
                try {
                    await this.executeWorkflowStep(
                        instance,
                        instance.currentStepId ?? definition.initialStepId,
                        definition,
                    );
                    recovered++;
                } catch (err) {
                    if (!String((err as Error)?.message ?? err).includes('VERSION_MISMATCH')) {
                        console.error(`Could not start interrupted workflow run ${id}:`, err);
                    }
                }
            } finally {
                // Past its expiry the lock may be another replica's.
                const lockKey = this.keys.workflowStartLock(id);
                if ((await this.redisClient.get(lockKey)) === this.options.streamConsumerName) {
                    await this.redisClient.del(lockKey);
                }
            }
        }
        return recovered;
    }

    private static readonly MAX_START_RECOVERIES = 5;

    /** Same digest the transition script computes (redis.sha1hex) over the stored JSON. */
    private static checksum(data: string): string {
        return createHash('sha1').update(data).digest('hex');
    }

    /**
     * Fail a run that never got past creation. Only a run still at its first
     * version is touched — one that has been saved since is somebody's live run.
     */
    private async failUnstartedRun(instanceId: string, cause: unknown): Promise<void> {
        try {
            const instance = await this.getWorkflowInstance(instanceId);
            if (!instance || instance.status !== 'active' || instance.version !== 1) {
                await this.redisClient.zRem(this.keys.workflowInstancesStarting(), instanceId);
                return;
            }
            // The first step creates its work and timeouts before its save, so
            // a run that never saved can still have both. Ids are a function
            // of the run's (unchanged) state, so they can be named here.
            const definition =
                instance.definitionSnapshot ?? (await this.getWorkflowDefinition(instance.workflowDefinitionId));
            const firstStepId = instance.currentStepId ?? definition?.initialStepId;
            const firstStep = definition?.steps.find((step) => step.id === firstStepId);
            const stepIds = firstStep ? [firstStep.id, ...(firstStep.parallelStepIds ?? [])] : [];

            instance.status = 'failed';
            await this.saveInstance(instance, 1);
            for (const stepId of stepIds) {
                const workId = this.deterministicAssignmentId({ ...instance, retryCount: 0 }, stepId);
                await this.redisClient
                    .multi()
                    .zRem(this.keys.workflowStepExpiryIndex(), `${instanceId}|${stepId}`)
                    .del(this.keys.workflowStepExpiry(instanceId, stepId))
                    .exec();
                if (this.host.removeAssignment) {
                    await this.host.removeAssignment(workId).catch(() => {
                        /* never created, or not an assignment step */
                    });
                }
                await this.forgetStepWork(workId);
            }
            this.emitTransition('run.failed', instance, {
                stepId: instance.currentStepId ?? undefined,
                payload: { error: (cause as Error)?.message ?? String(cause) },
            });
        } catch (err) {
            console.error(`Could not fail unstarted workflow run ${instanceId}:`, err);
        }
    }

    async processExpiredWorkflowSteps(): Promise<number> {
        if (!this.options.enableWorkflows) return 0;

        try {
            await this.recoverInterruptedStarts();
        } catch (err) {
            console.error('Workflow start recovery failed:', err);
        }

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

    /**
     * Complete (or fail) an external step from outside this process — the
     * counterpart to the `step.ready` transition. Validates the step is
     * actually the run's current step (or a pending parallel branch) and is
     * really an external step, clears its timeout, then publishes the same
     * COMPLETED/FAILED event onto the stream that in-process completions use,
     * so the orchestrator advances the run through the ordinary transition
     * pipeline (idempotency, retries, and DLQ all still apply).
     */
    async completeWorkflowStep(
        instanceId: string,
        stepId: string,
        outcome: { success: boolean; data?: Record<string, any>; error?: string; assignmentId?: string },
    ): Promise<boolean> {
        const instance = await this.getWorkflowInstance(instanceId);
        if (!instance) {
            throw new Error(`Workflow instance not found: ${instanceId}`);
        }
        if (instance.status !== 'active') {
            throw new Error(`Workflow instance ${instanceId} is not active`);
        }

        const branch = instance.parallelBranches?.find((b) => b.stepId === stepId);
        const isCurrentStep = instance.currentStepId === stepId;
        const isPendingBranch = branch?.status === 'pending';
        if (!isCurrentStep && !isPendingBranch) {
            throw new Error(`Step "${stepId}" is not currently active for instance ${instanceId}`);
        }

        const definition = instance.definitionSnapshot ?? (await this.getWorkflowDefinition(instance.workflowDefinitionId));
        const step = definition?.steps.find((s) => s.id === stepId);
        if ((step?.taskType ?? 'assignment') !== 'external') {
            throw new Error(`Step "${stepId}" is not an external step`);
        }

        // The step's timeout is cleared when this event is applied, not here:
        // clearing first and crashing before the publish left an external
        // step with neither a timeout nor an event.
        const assignmentId = branch?.assignmentId ?? this.deterministicAssignmentId(instance, stepId);
        // step.ready carries the attempt's id; a caller that passes it back
        // cannot answer a later attempt of the same step by mistake.
        if (outcome.assignmentId && outcome.assignmentId !== assignmentId) {
            throw new Error(`Step "${stepId}" has moved on to a later attempt for instance ${instanceId}`);
        }
        await this.publishWorkflowEvent({
            eventId: randomUUID(),
            type: outcome.success ? 'COMPLETED' : 'FAILED',
            userId: instance.initiatorUserId,
            assignmentId,
            workflowInstanceId: instanceId,
            stepId,
            timestamp: Date.now(),
            payload: outcome.success ? outcome.data : { error: outcome.error },
        });

        return true;
    }

    private async createWorkflowAssignment(
        instance: WorkflowInstance,
        step: WorkflowStep,
        definition: WorkflowDefinition,
        branchAttempt = 0,
    ): Promise<Assignment> {
        if (!step.assignmentTemplate) {
            throw new Error(`Assignment step "${step.id}" is missing assignmentTemplate`);
        }

        const targetUserSelector = step.targetUser ?? 'initiator';
        let targetUserId: string;
        if (targetUserSelector === 'initiator') {
            targetUserId = instance.initiatorUserId;
        } else if (targetUserSelector === 'previous') {
            // The last person who actually did a step. Escalation hops are
            // recorded in history with no user, so they are skipped: a step
            // reached through one would otherwise lose its target entirely.
            let previousUserId: string | undefined;
            for (let i = instance.history.length - 1; i >= 0 && !previousUserId; i--) {
                previousUserId = instance.history[i].userId || undefined;
            }
            targetUserId = previousUserId ?? instance.initiatorUserId;
        } else if (typeof targetUserSelector === 'object' && 'tag' in targetUserSelector) {
            targetUserId = '';
        } else {
            targetUserId = targetUserSelector as string;
        }

        const assignmentId = this.deterministicAssignmentId(instance, step.id, branchAttempt);
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

    /**
     * Trim the workflow event stream up to the consumption frontier.
     *
     * The frontier is derived per consumer group and the minimum across groups
     * wins: with pending entries a group's threshold is its oldest
     * unacknowledged id (exclusive — that entry must survive); with none,
     * every delivered entry is acked, so the threshold is one past the
     * last-delivered id and deletes through it. Everything below the frontier
     * has been delivered *and* acknowledged by every group, so removing it can
     * never lose an event (XTRIM MINID is not consumer-group-aware on its own;
     * anchoring it here is what makes the trim safe). Returns the number of
     * entries removed, or 0 when there is nothing safe to remove (no groups,
     * unknown group state, or nothing fully consumed yet).
     */
    async trimWorkflowEventStream(): Promise<number> {
        const streamKey = this.keys.eventStream();

        let groups: Array<{ name: string; pending: number; 'last-delivered-id'?: string }>;
        try {
            groups = (await this.redisClient.xInfoGroups(streamKey)) as unknown as typeof groups;
        } catch {
            return 0; // stream or groups do not exist yet — nothing has been consumed
        }

        let frontier: [number, number] | null = null;
        for (const group of groups) {
            const lastDelivered = parseStreamId(group['last-delivered-id']);
            let threshold: [number, number];
            if (Number(group.pending) > 0) {
                const summary = (await this.redisClient.xPending(streamKey, group.name)) as unknown as {
                    firstId?: string | null;
                };
                const firstPending = parseStreamId(summary?.firstId);
                threshold = firstPending ?? [0, 0];
            } else if (lastDelivered) {
                threshold = [lastDelivered[0], lastDelivered[1] + 1];
            } else {
                threshold = [0, 0];
            }
            if (!frontier || compareStreamIds(threshold, frontier) < 0) frontier = threshold;
        }
        if (!frontier || (frontier[0] === 0 && frontier[1] <= 1)) return 0;

        return Number(await this.redisClient.xTrim(streamKey, 'MINID', `${frontier[0]}-${frontier[1]}`));
    }

    /**
     * Non-blocking drain of up to `maxEvents` due workflow events, using the
     * main Redis client (no duplicated subscriber connection, no BLOCK wait).
     * Shares all processing internals with the orchestrator loop — idempotency,
     * circuit breaker, retry scheduling, and DLQ all apply — but is meant to be
     * called periodically by a host sweeping many workspaces/tenants rather
     * than running one dedicated blocking loop per matcher instance. Returns
     * the number of events successfully processed (retried/DLQ'd events still
     * count as handled — only a hard read error returns early).
     */
    async processWorkflowEvents(maxEvents?: number): Promise<number> {
        if (!this.options.enableWorkflows) return 0;

        await this.initStreamConsumerGroup();
        const streamKey = this.keys.eventStream();
        const count = maxEvents ?? this.options.eventBatchSize ?? 10;
        let processed = 0;

        try {
            const response = (await this.redisClient.xReadGroup(
                this.options.streamConsumerGroup,
                this.options.streamConsumerName,
                [{ key: streamKey, id: '>' }],
                { COUNT: count },
            )) as any;

            if (!response) return 0;

            for (const stream of response) {
                for (const message of stream.messages) {
                    const event = this.parseStreamMessage(message);

                    if (await this.reliability.isEventProcessed(event.eventId)) {
                        await this.redisClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                        continue;
                    }

                    await this.applyEventThrottle();

                    try {
                        await this.processWorkflowEvent(event);
                        await this.reliability.markEventProcessed(event.eventId);
                        await this.redisClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                        this.reliability.recordCircuitBreakerSuccess();
                        processed++;
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
                            await this.redisClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                        } else {
                            const nextRetryCount = Number(await this.redisClient.incr(retryKey));
                            await this.redisClient.expire(retryKey, 86400);
                            await this.scheduleEventRetry(event, nextRetryCount);
                            await this.redisClient.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                        }
                    }
                }
            }
        } catch (err: any) {
            if (this.isNoGroupError(err)) {
                await this.initStreamConsumerGroup();
                return processed;
            }
            console.error('processWorkflowEvents read error:', err);
        }

        // Sweep-mode hosts get the auto-trim here: acks above just advanced the
        // frontier, so this is the cheapest point at which trimming is safe.
        if (this.options.autoTrimEventStream) {
            try {
                await this.trimWorkflowEventStream();
            } catch (err) {
                console.error('Event stream trim failed:', err);
            }
        }

        return processed;
    }

    async startOrchestrator(): Promise<void> {
        if (!this.options.enableWorkflows) {
            throw new Error('Workflows are not enabled. Set enableWorkflows: true in options.');
        }
        if (this.orchestratorRunning) return;

        this.orchestratorRunning = true;
        this.orchestratorAbortController = new AbortController();

        // Ensure the stream and group exist even if Redis was flushed since init.
        await this.initStreamConsumerGroup();

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
            console.info('Subscriber client connected');
            this.subscriberReconnectAttempts = 0;
            this.reliability.updateReconnectCount(0);
        });

        this.subscriberClient.on('disconnect', () => {
            console.warn('Subscriber client disconnected');
            this.reliability.updateRedisHealth(false, 'Subscriber client disconnected');
        });

        this.subscriberClient.on('ready', () => {
            console.info('Subscriber client ready');
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
                console.info('Subscriber client reconnected successfully');
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

                    if (this.isNoGroupError(err)) {
                        await this.initStreamConsumerGroup();
                        continue;
                    }

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

    private processWorkflowEvent(event: WorkflowEvent): Promise<void> {
        return this.eventScope.run({ eventId: event.eventId, instanceId: event.workflowInstanceId, emits: [] }, () =>
            this.applyWorkflowEvent(event),
        );
    }

    private async applyWorkflowEvent(event: WorkflowEvent): Promise<void> {
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
                // Re-checked each attempt: a concurrent duplicate delivery loses
                // the CAS race, retries here with fresh state, and must see
                // the winner's marker (written atomically with the winning
                // transition) instead of applying the same event twice.
                if (attempt > 0 && (await this.reliability.isEventProcessed(event.eventId))) {
                    break;
                }
                const instance = await this.getWorkflowInstance(event.workflowInstanceId);
                if (!instance || instance.status !== 'active') {
                    break;
                }

                const definition =
                    instance.definitionSnapshot ?? (await this.getWorkflowDefinition(instance.workflowDefinitionId));
                if (!definition) {
                    break;
                }

                // Consume-time relevance guard, mirroring the publish-time one
                // in processExpiredWorkflowSteps: a stale event for a step the
                // run has moved past (an EXPIRED consumed after an on-time
                // COMPLETED advanced the run, or a late COMPLETED after an
                // escalation) must not fail, escalate, or re-advance the run.
                if (event.stepId) {
                    const isCurrentStep = instance.currentStepId === event.stepId;
                    const isPendingBranch =
                        instance.parallelBranches?.some((b) => b.stepId === event.stepId && b.status === 'pending') ??
                        false;
                    if (!isCurrentStep && !isPendingBranch) {
                        break;
                    }

                    // Same step, earlier visit: a retry, an escalation or a
                    // loop back gives the step new work under a new id, and
                    // a late event still carrying the old id (a completion or
                    // lapse of the superseded work) must not be applied to
                    // the visit that replaced it.
                    if (event.assignmentId) {
                        const pendingBranch = instance.parallelBranches?.find(
                            (b) => b.stepId === event.stepId && b.status === 'pending',
                        );
                        const currentWorkId = pendingBranch
                            ? pendingBranch.assignmentId
                            : (instance.currentAssignmentId ?? this.deterministicAssignmentId(instance, event.stepId));
                        if (currentWorkId !== event.assignmentId) {
                            break;
                        }
                    }
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
                    this.flushTransitions();
                    break;
                } catch (err: any) {
                    // Nothing this attempt reported was saved.
                    const scope = this.eventScope.getStore();
                    if (scope) scope.emits.length = 0;
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
        await this.applyStepCompletion(instance, definition, event);
        if (event.stepId) await this.clearStepTimeoutQuietly(instance.id, event.stepId);
    }

    private async applyStepCompletion(
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

        this.emitTransition('step.completed', instance, {
            stepId,
            assignmentId: event.assignmentId,
            payload: event.payload,
        });

        const expectedVersion = instance.version;
        // Branches still pending when a waitForAll:false group advances lost
        // the race; their work is withdrawn once the advance is saved.
        let losingBranches: ParallelBranchState[] = [];
        let continuation: WorkflowStep = step;
        if (instance.parallelBranches) {
            const branch = instance.parallelBranches.find((b) => b.stepId === stepId);
            if (branch) {
                branch.status = 'completed';
                branch.result = event.payload;
                const fork = this.forkOf(instance, definition);
                const allComplete = instance.parallelBranches.every((b) => b.status === 'completed');
                if (!allComplete && (step.waitForAll ?? fork?.waitForAll) !== false) {
                    await this.saveInstance(instance, expectedVersion);
                    return;
                }
                losingBranches = instance.parallelBranches.filter((b) => b.status === 'pending');
                instance.parallelBranches = undefined;
                instance.parallelForkStepId = undefined;

                // Where a finished group goes next belongs to the step that
                // forked it. Reading it off the branch that happened to finish
                // last made the continuation depend on completion order. A
                // fork that declares no continuation keeps the old behaviour
                // (the finishing branch decides).
                if (fork && ((fork.routing && fork.routing.length > 0) || fork.defaultNextStepId !== undefined)) {
                    continuation = fork;
                }
            }
        }

        let nextStepId: string | null = null;
        if (continuation.routing && continuation.routing.length > 0) {
            for (const route of continuation.routing) {
                if (this.evaluateCondition(route.condition, event.payload, instance.context)) {
                    nextStepId = route.targetStepId;
                    break;
                }
            }
        }

        if (!nextStepId && continuation.defaultNextStepId !== undefined) {
            nextStepId = continuation.defaultNextStepId;
        }

        if (nextStepId) {
            instance.currentStepId = nextStepId;
            instance.currentAssignmentId = undefined;
            // maxRetries is a per-step budget: a new step starts fresh.
            instance.retryCount = 0;
            await this.executeWorkflowStep(instance, nextStepId, definition);
        } else {
            instance.status = 'completed';
            instance.currentStepId = null;
            instance.currentAssignmentId = undefined;
            await this.saveInstance(instance, expectedVersion);
            this.emitTransition('run.completed', instance);
        }

        await this.withdrawBranchesQuietly(instance.id, losingBranches);
    }

    /**
     * withdrawBranches for use after the run has been saved: the event is
     * already marked applied, so a throw could not be retried — it would only
     * fail an event that has in fact been applied.
     */
    private async withdrawBranchesQuietly(instanceId: string, branches: ParallelBranchState[]): Promise<void> {
        if (branches.length === 0) return;
        try {
            await this.withdrawBranches(instanceId, branches);
        } catch (err) {
            console.error(`Failed to withdraw superseded branches of workflow ${instanceId}:`, err);
        }
    }

    /**
     * The step that forked the run's current parallel group. Recorded on the
     * instance when the group starts; runs forked before that field existed
     * fall back to the first step whose parallelStepIds cover the group.
     */
    private forkOf(instance: WorkflowInstance, definition: WorkflowDefinition): WorkflowStep | undefined {
        if (instance.parallelForkStepId) {
            return definition.steps.find((s) => s.id === instance.parallelForkStepId);
        }
        const groupStepIds = (instance.parallelBranches ?? []).map((b) => b.stepId);
        if (groupStepIds.length === 0) return undefined;
        return definition.steps.find(
            (s) => s.parallelStepIds && groupStepIds.every((id) => s.parallelStepIds!.includes(id)),
        );
    }

    /**
     * Clear the timeouts and remove the outstanding work of parallel branches
     * the run no longer waits for. Late events for them are already ignored by
     * the consume-time relevance guard; this stops people working on them.
     */
    private async withdrawBranches(instanceId: string, branches: ParallelBranchState[]): Promise<void> {
        // Read back rather than trust the caller's copy: the advance may have
        // run further steps inline (a machine step that loops straight back to
        // the fork), and only the stored run says which steps are live now.
        const instance = await this.getWorkflowInstance(instanceId);
        for (const branch of branches) {
            // Timeouts are keyed by step, not by visit: when the advance has
            // already re-entered this step (a loop back to the fork, or a
            // route straight to a sibling), the timeout now belongs to the
            // new visit and must survive. Assignment ids are per visit, so
            // removing the old one below is always safe.
            const reentered =
                !!instance &&
                instance.status === 'active' &&
                (instance.currentStepId === branch.stepId ||
                    (instance.parallelBranches?.some((b) => b.stepId === branch.stepId && b.status === 'pending') ??
                        false));
            if (!reentered) {
                await this.redisClient.zRem(this.keys.workflowStepExpiryIndex(), `${instanceId}|${branch.stepId}`);
                await this.redisClient.del(this.keys.workflowStepExpiry(instanceId, branch.stepId));
            }
            if (this.host.removeAssignment) {
                await this.host.removeAssignment(branch.assignmentId).catch(() => {
                    /* machine/external branch, or already gone — nothing to withdraw */
                });
            }
            await this.forgetStepWork(branch.assignmentId);
        }
    }

    private async handleStepFailure(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<void> {
        await this.applyStepFailure(instance, definition, event);
        if (event.stepId) await this.clearStepTimeoutQuietly(instance.id, event.stepId);
    }

    private async applyStepFailure(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<void> {
        const stepId = event.stepId;
        if (!stepId) return;

        const step = definition.steps.find((s) => s.id === stepId);
        if (!step) return;

        const failingBranch = instance.parallelBranches?.find((b) => b.stepId === stepId);
        // A branch's budget may be declared once on the fork, like its policy.
        const maxRetries =
            step.maxRetries ?? (failingBranch ? this.forkOf(instance, definition)?.maxRetries : undefined) ?? 0;
        const expectedVersion = instance.version;

        // history holds what completed; this is the record of what did not.
        const failures = instance.failures ?? [];
        failures.push({
            stepId,
            assignmentId: event.assignmentId,
            userId: event.userId,
            at: event.timestamp,
            reason: event.type === 'EXPIRED' ? 'expired' : 'failed',
            error: event.payload?.error ?? event.payload?.reason,
        });
        instance.failures = failures.slice(-200);

        // Handle parallel branch failure
        if (instance.parallelBranches) {
            const branch = instance.parallelBranches.find((b) => b.stepId === stepId);
            if (branch) {
                const policy = step.failurePolicy ?? this.forkOf(instance, definition)?.failurePolicy ?? 'abort';
                const branchRetries = branch.retryCount ?? 0;
                const retryBranch = policy === 'retry' && branchRetries < maxRetries;
                branch.status = 'failed';
                this.emitTransition('step.failed', instance, {
                    stepId,
                    assignmentId: event.assignmentId,
                    payload: { ...event.payload, willRetry: retryBranch },
                });

                if (retryBranch) {
                    // Retry the branch in place: its own budget, its own new
                    // work id, the rest of the group untouched. (Running it
                    // through the single-step path made the branch the run's
                    // current step, and two retrying branches then dropped
                    // each other's completions.)
                    if (branch.assignmentId && this.host.removeAssignment) {
                        await this.host.removeAssignment(branch.assignmentId).catch(() => {
                            /* machine/external branch, or already gone */
                        });
                        await this.forgetStepWork(branch.assignmentId);
                    }
                    branch.retryCount = branchRetries + 1;
                    branch.status = 'pending';
                    const taskType = step.taskType ?? 'assignment';
                    if (taskType === 'assignment') {
                        branch.assignmentId = (
                            await this.createWorkflowAssignment(instance, step, definition, branch.retryCount)
                        ).id;
                    } else {
                        branch.assignmentId = this.deterministicAssignmentId(instance, stepId, branch.retryCount);
                    }
                    const timeoutMs =
                        step.timeoutMs ??
                        definition.defaultTimeoutMs ??
                        (taskType === 'machine' ? this.machineLeaseMs() : undefined);
                    if (timeoutMs) await this.setStepTimeout(instance.id, stepId, timeoutMs);
                    await this.saveInstance(instance, expectedVersion);
                    if (taskType === 'machine') {
                        await this.executeMachineStep(instance, step, definition, branch.assignmentId);
                    } else if (taskType === 'external') {
                        this.emitTransition('step.ready', instance, {
                            stepId,
                            assignmentId: branch.assignmentId,
                            payload: { name: step.external!.name, input: step.external!.input },
                        });
                    }
                    return;
                }

                // Whatever happens next, this branch's work is finished with;
                // and when the run fails, so is every branch still waiting.
                const failedWork = { ...branch };
                if (policy === 'abort' || policy === 'retry') {
                    // Fail entire workflow
                    const stillPending = instance.parallelBranches
                        .filter((b) => b.status === 'pending')
                        .map((b) => ({ ...b }));
                    instance.status = 'failed';
                    await this.saveInstance(instance, expectedVersion);
                    this.emitTransition('run.failed', instance, { stepId, payload: event.payload });
                    await this.withdrawBranchesQuietly(instance.id, [failedWork, ...stillPending]);
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
                    await this.withdrawBranchesQuietly(instance.id, [failedWork]);
                    return;
                }
            }
        }

        // Retry logic
        const willRetry = instance.retryCount < maxRetries;
        this.emitTransition('step.failed', instance, {
            stepId,
            assignmentId: event.assignmentId,
            payload: { ...event.payload, willRetry },
        });

        // Pull the superseded assignment before retrying or failing the run —
        // the same removal the escalation path does. The matcher's expiry
        // sweep requeues an expired workflow assignment, so a retry would
        // otherwise run TWO live copies of the step, and a failed run would
        // leave matchable work for a dead workflow.
        const supersededId = event.assignmentId || instance.currentAssignmentId;
        if (supersededId && this.host.removeAssignment) {
            await this.host.removeAssignment(supersededId).catch(() => {
                /* already gone (completed, cancelled, swept) — nothing to supersede */
            });
            await this.forgetStepWork(supersededId);
        }

        if (willRetry) {
            instance.retryCount += 1;
            await this.executeWorkflowStep(instance, stepId, definition);
        } else {
            // Workflow failed
            instance.status = 'failed';
            await this.saveInstance(instance, expectedVersion);
            this.emitTransition('run.failed', instance, { stepId, payload: event.payload });
        }
    }

    private async handleStepExpiry(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<void> {
        // A lapsed offer whose work the matcher requeued is ordinary matching,
        // not a step timeout: the step keeps waiting for the next worker, and
        // only its own timeoutMs may fail or escalate it.
        if (event.payload?.requeued === true) return;

        this.emitTransition('step.expired', instance, { stepId: event.stepId, assignmentId: event.assignmentId });

        if (await this.tryEscalateExpiredStep(instance, definition, event)) return;

        await this.handleStepFailure(instance, definition, event);
    }

    /**
     * Advance a timed-out step to its `onTimeoutStepId` instead of failing the
     * run — the escalation ladder (page primary, then secondary, then the
     * manager). Returns false when the step declares no escalation target, or
     * when the run has climbed past `maxEscalationDepth`, in which case the
     * caller falls through to the ordinary failure path.
     */
    private async tryEscalateExpiredStep(
        instance: WorkflowInstance,
        definition: WorkflowDefinition,
        event: WorkflowEvent,
    ): Promise<boolean> {
        const stepId = event.stepId;
        if (!stepId) return false;

        const step = definition.steps.find((s) => s.id === stepId);
        const target = step?.onTimeoutStepId;
        if (!step || !target) return false;

        // A parallel branch has no single "next step" to escalate to; validation
        // rejects the combination, but a hand-written definition could slip past
        // an older registration, so bail out rather than corrupt the branch state.
        if (instance.parallelBranches?.some((b) => b.stepId === stepId)) return false;

        const depth = Number(instance.context._escalationDepth ?? 0) + 1;
        const maxDepth = definition.maxEscalationDepth ?? 10;
        if (depth > maxDepth) return false;

        // Pull the superseded assignment so a late responder on the previous
        // tier cannot act on work the ladder has already moved on from.
        const assignmentId = event.assignmentId || instance.currentAssignmentId;
        if (assignmentId && this.host.removeAssignment) {
            await this.host.removeAssignment(assignmentId).catch(() => {
                /* already gone (accepted, cancelled, swept) — nothing to supersede */
            });
            await this.forgetStepWork(assignmentId);
        }

        instance.history.push({
            stepId,
            assignmentId: assignmentId ?? '',
            userId: '',
            completedAt: Date.now(),
            result: { escalated: true, to: target },
        });
        instance.context._escalatedFrom = stepId;
        instance.context._escalationDepth = depth;

        this.emitTransition('step.escalated', instance, {
            stepId,
            assignmentId,
            payload: { from: stepId, to: target, depth },
        });

        // An escalation is a different step getting the work, not another
        // attempt at the same one: it never consumes a retry, and the target
        // step starts with its own fresh maxRetries budget.
        instance.retryCount = 0;
        await this.executeWorkflowStep(instance, target, definition);
        // An escalation that came from the matcher (a parked or refused
        // offer) rather than from the step's own timeout leaves that timeout
        // in the index.
        await this.clearStepTimeoutQuietly(instance.id, stepId);
        return true;
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
        // Sweep-mode hosts have no subscriber client, but a crashed consumer's
        // delivered-unacked entries still need recovering — XAUTOCLAIM is
        // non-blocking, so the main client serves when no subscriber exists.
        const client = this.subscriberClient?.isOpen ? this.subscriberClient : this.redisClient;
        const streamKey = this.keys.eventStream();
        let totalReclaimed = 0;

        try {
            const result = await client.xAutoClaim(
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
                            await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                            continue;
                        }

                        const retryKey = this.keys.eventRetryCount(event.eventId);
                        const retryCount = Number(await this.redisClient.get(retryKey)) || 0;

                        if (retryCount >= this.reliability.options.workflowMaxRetries!) {
                            await this.reliability.moveToDeadLetter(event, 'Max retries exceeded');
                            await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
                        } else {
                            try {
                                await this.processWorkflowEvent(event);
                                await this.reliability.markEventProcessed(event.eventId);
                                await client.xAck(streamKey, this.options.streamConsumerGroup, message.id);
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
            if (this.isNoGroupError(err)) {
                await this.initStreamConsumerGroup();
                return 0;
            }
            console.error('Error in XAUTOCLAIM:', err);
        }

        // The reclaim interval is the orchestrator-mode trim cadence — it runs
        // whether or not this pass reclaimed anything, because regular event
        // processing advanced the frontier since the last tick.
        if (this.options.autoTrimEventStream) {
            try {
                await this.trimWorkflowEventStream();
            } catch (err) {
                console.error('Event stream trim failed:', err);
            }
        }
        return totalReclaimed;
    }

    private async saveInstance(instance: WorkflowInstance, expectedVersion: number): Promise<void> {
        const instanceKey = this.keys.workflowInstance(instance.id);
        instance.version += 1;
        instance.updatedAt = Date.now();
        const newData = JSON.stringify(instance);

        if (this.luaScriptSha) {
            // The idempotency marker rides in the same atomic script as the
            // CAS write: a crash after the transition but before a separate
            // marker write would otherwise re-apply the event on redelivery.
            const markerTtl = this.reliability.options.workflowIdempotencyTtlMs;
            const scope = this.eventScope.getStore();
            const processingEventId = scope && scope.instanceId === instance.id ? scope.eventId : undefined;
            const keys =
                processingEventId && markerTtl ? [instanceKey, this.keys.processedEvent(processingEventId)] : [instanceKey];
            const args =
                keys.length === 2
                    ? [String(expectedVersion), newData, String(markerTtl)]
                    : [String(expectedVersion), newData];

            let result: string;
            try {
                result = (await this.redisClient.evalSha(this.luaScriptSha, { keys, arguments: args })) as string;
            } catch (err) {
                // A Redis restart/failover empties the script cache; without a
                // reload every transition fails NOSCRIPT until process restart.
                if (!String((err as Error)?.message ?? err).includes('NOSCRIPT') || !this.luaScriptSource) throw err;
                this.luaScriptSha = await this.redisClient.scriptLoad(this.luaScriptSource);
                result = (await this.redisClient.evalSha(this.luaScriptSha, { keys, arguments: args })) as string;
            }
            const parsed = JSON.parse(result);
            if (parsed.err) {
                throw new Error(`Workflow transition failed: ${parsed.err}`);
            }
        } else {
            await this.redisClient.hSet(instanceKey, {
                data: newData,
                version: String(instance.version),
                sum: WorkflowManager.checksum(newData),
            });
        }

        // Saved: what this event reported up to here is now true.
        if (this.eventScope.getStore()?.instanceId === instance.id) this.flushTransitions();

        // The first save is what makes a run "started" (see recoverInterruptedStarts).
        if (expectedVersion === 1) {
            await this.redisClient.zRem(this.keys.workflowInstancesStarting(), instance.id);
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
    private deterministicAssignmentId(instance: WorkflowInstance, stepId: string, branchAttempt = 0): string {
        // A retried parallel branch keeps the run's retryCount and history
        // length, so its attempt number is what makes the new id distinct.
        // Omitted at 0 so every id issued before branch retries is unchanged.
        const attempt = branchAttempt > 0 ? `:b${branchAttempt}` : '';
        return createHash('sha256')
            .update(`wfa:${instance.id}:${stepId}:${instance.retryCount}:${instance.history.length}${attempt}`)
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

        const windowMs = this.options.throttleWindowMs ?? 1000;
        const now = Date.now();
        if (now - this.throttleWindowStart >= windowMs) {
            this.throttleWindowStart = now;
            this.throttleTokensUsed = 0;
        }

        if (this.throttleTokensUsed >= limit) {
            const waitMs = Math.max(this.throttleWindowStart + windowMs - now, 1);
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
                if (!instance) continue;

                await this.redisClient.zAdd(this.keys.workflowInstancesByTime(), {
                    score: instance.createdAt,
                    value: instance.id,
                });

                if (instance.status === 'active') {
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
                multi.zRem(this.keys.workflowInstancesByTime(), instanceId);
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

function parseStreamId(id: string | null | undefined): [number, number] | null {
    if (!id) return null;
    const [ms, seq] = id.split('-').map(Number);
    if (!Number.isFinite(ms)) return null;
    return [ms, Number.isFinite(seq) ? seq : 0];
}

function compareStreamIds(a: [number, number], b: [number, number]): number {
    return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];
}
