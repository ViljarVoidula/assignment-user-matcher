import { expect } from 'chai';
import { createClient } from 'redis';
import { WorkflowManager, WorkflowHost } from '../src/managers/WorkflowManager';
import { ReliabilityManager } from '../src/managers/ReliabilityManager';
import { TelemetryManager } from '../src/managers/TelemetryManager';
import { createKeyBuilders } from '../src/utils/keys';
import { WorkflowDefinition, Assignment, WorkflowEvent } from '../src/types/matcher';
import { readFileSync } from 'fs';
import { join } from 'path';
import sinon from 'sinon';

const LUA_SCRIPT = readFileSync(join(__dirname, '../src/lua/workflow-transition.lua'), 'utf-8');

describe('Workflow Scalability & Reliability', function () {
    let redisClient: any;
    let workflowManager: WorkflowManager;
    let reliability: ReliabilityManager;
    let telemetry: TelemetryManager;
    const keys = createKeyBuilders({ prefix: 'test-scale:' });

    const mockHost: WorkflowHost = {
        async addAssignment(assignment: Assignment) {
            return assignment;
        },
        async matchUsersAssignments() {
            return [];
        },
    };

    function makeReliability(overrides: Record<string, any> = {}) {
        return new ReliabilityManager(redisClient, keys, {
            workflowMaxRetries: 3,
            workflowIdempotencyTtlMs: 60000,
            workflowCircuitBreakerThreshold: 5,
            workflowCircuitBreakerResetMs: 30000,
            workflowAuditEnabled: false,
            streamConsumerName: 'scale-consumer',
            ...overrides,
        });
    }

    function makeManager(
        host: WorkflowHost = mockHost,
        options: Record<string, any> = {},
        rel: ReliabilityManager = reliability,
    ) {
        return new WorkflowManager(redisClient, keys, rel, telemetry, host, {
            enableWorkflows: true,
            streamConsumerGroup: 'scale-group',
            streamConsumerName: 'scale-consumer',
            reclaimIntervalMs: 1000,
            ...options,
        });
    }

    const singleStepDef: WorkflowDefinition = {
        id: 'scale-wf-single',
        name: 'Single Step',
        version: 1,
        initialStepId: 's1',
        steps: [
            {
                id: 's1',
                name: 'S1',
                assignmentTemplate: { tags: ['t1'] },
                targetUser: 'initiator',
                defaultNextStepId: null,
            },
        ],
    };

    const twoStepDef: WorkflowDefinition = {
        id: 'scale-wf-two',
        name: 'Two Step',
        version: 1,
        initialStepId: 's1',
        steps: [
            {
                id: 's1',
                name: 'S1',
                assignmentTemplate: { tags: ['t1'] },
                targetUser: 'initiator',
                defaultNextStepId: 's2',
                timeoutMs: 200,
            },
            {
                id: 's2',
                name: 'S2',
                assignmentTemplate: { tags: ['t2'] },
                targetUser: 'initiator',
                defaultNextStepId: null,
            },
        ],
    };

    before(async function () {
        redisClient = createClient();
        await redisClient.connect();
        telemetry = new TelemetryManager(false);
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        reliability = makeReliability();
        workflowManager = makeManager();
        await workflowManager.init();
    });

    after(async function () {
        await redisClient.flushAll();
        await redisClient.quit();
    });

    describe('Step expiry index', function () {
        it('should index step timeouts in a sorted set instead of relying on instance scans', async function () {
            await workflowManager.registerWorkflow(twoStepDef);
            await workflowManager.startWorkflow(twoStepDef.id, 'user-1');

            const count = await redisClient.zCard(keys.workflowStepExpiryIndex());
            expect(count).to.equal(1);
        });

        // Force a step's armed timeout to be due now instead of sleeping past it —
        // the scheduling (setStepTimeout) is verified by the index-population test
        // above; these assert the draining behavior, which only needs a due entry.
        async function forceStepDue(instanceId: string, stepId: string) {
            await redisClient.zAdd(keys.workflowStepExpiryIndex(), { score: Date.now() - 1, value: `${instanceId}|${stepId}` });
        }

        it('should fire an expiry exactly once and be idempotent across calls', async function () {
            await workflowManager.registerWorkflow(twoStepDef);
            const instance = await workflowManager.startWorkflow(twoStepDef.id, 'user-1');
            await forceStepDue(instance.id, 's1');

            const first = await workflowManager.processExpiredWorkflowSteps();
            const second = await workflowManager.processExpiredWorkflowSteps();
            expect(first).to.equal(1);
            expect(second).to.equal(0);
        });

        it('should fire an expiry only on one replica when multiple process concurrently', async function () {
            await workflowManager.registerWorkflow(twoStepDef);
            const instance = await workflowManager.startWorkflow(twoStepDef.id, 'user-1');

            const other = makeManager(mockHost, { streamConsumerName: 'scale-consumer-2' });
            await other.init();

            await forceStepDue(instance.id, 's1');

            const [a, b] = await Promise.all([
                workflowManager.processExpiredWorkflowSteps(),
                other.processExpiredWorkflowSteps(),
            ]);
            expect(a + b).to.equal(1);
        });

        it('should not fire expiry for a step that already completed', async function () {
            await workflowManager.registerWorkflow(twoStepDef);
            const instance = await workflowManager.startWorkflow(twoStepDef.id, 'user-1');

            // Complete step 1 before its timeout elapses (advances currentStepId to s2)
            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-c1',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            // Even if s1's stale timeout comes due, it must not fire — s1 is no longer current.
            await forceStepDue(instance.id, 's1');
            const expired = await workflowManager.processExpiredWorkflowSteps();
            expect(expired).to.equal(0);
        });
    });

    describe('Active instance index', function () {
        it('should add active instances to the index and remove them on completion', async function () {
            await workflowManager.registerWorkflow(singleStepDef);
            const instance = await workflowManager.startWorkflow(singleStepDef.id, 'user-1');

            let score = await redisClient.zScore(keys.workflowInstancesActive(), instance.id);
            expect(score).to.not.equal(null);

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-done',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            score = await redisClient.zScore(keys.workflowInstancesActive(), instance.id);
            expect(score).to.equal(null);
        });

        it('should backfill the active index from legacy instance records', async function () {
            const instanceId = 'legacy-inst-1';
            const instance = {
                id: instanceId,
                workflowDefinitionId: singleStepDef.id,
                initiatorUserId: 'u1',
                status: 'active',
                currentStepId: 's1',
                context: {},
                history: [],
                retryCount: 0,
                version: 1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            await redisClient.hSet(keys.workflowInstance(instanceId), 'data', JSON.stringify(instance));
            await redisClient.hSet(keys.workflowInstances(), instanceId, singleStepDef.id);

            const count = await workflowManager.backfillWorkflowIndexes();
            expect(count).to.equal(1);

            const score = await redisClient.zScore(keys.workflowInstancesActive(), instanceId);
            expect(score).to.not.equal(null);
        });
    });

    describe('Version-conflict retry', function () {
        it('should retry event processing in place on VERSION_MISMATCH', async function () {
            const sha = await redisClient.scriptLoad(LUA_SCRIPT);
            workflowManager.setLuaScriptSha(sha);

            await workflowManager.registerWorkflow(twoStepDef);
            const instance = await workflowManager.startWorkflow(twoStepDef.id, 'user-1');

            // First read of the instance during event processing returns a stale version
            const original = (workflowManager as any).getWorkflowInstance.bind(workflowManager);
            let staleServed = false;
            sinon.stub(workflowManager as any, 'getWorkflowInstance').callsFake(async (id: any) => {
                const inst = await original(id);
                if (!staleServed && inst) {
                    staleServed = true;
                    return { ...inst, version: inst.version - 1 };
                }
                return inst;
            });

            try {
                await (workflowManager as any).processWorkflowEvent({
                    eventId: 'evt-vc',
                    type: 'COMPLETED',
                    userId: 'user-1',
                    assignmentId: instance.currentAssignmentId!,
                    workflowInstanceId: instance.id,
                    stepId: 's1',
                    timestamp: Date.now(),
                });
            } finally {
                sinon.restore();
            }

            const updated = await workflowManager.getWorkflowInstance(instance.id);
            expect(updated!.currentStepId).to.equal('s2');
        });
    });

    describe('Per-event idempotency keys', function () {
        it('should store idempotency markers as per-event keys with their own TTL', async function () {
            await reliability.markEventProcessed('evt-idem-1');
            expect(await reliability.isEventProcessed('evt-idem-1')).to.equal(true);

            const ttl = await redisClient.pTTL(keys.processedEvent('evt-idem-1'));
            expect(ttl).to.be.greaterThan(0);
        });

        it('should still honor legacy set-based markers', async function () {
            await redisClient.sAdd(keys.processedEvents(), 'evt-legacy-1');
            expect(await reliability.isEventProcessed('evt-legacy-1')).to.equal(true);
        });
    });

    describe('Deterministic workflow assignment IDs', function () {
        it('should generate the same assignment id when the same step execution is replayed', async function () {
            const created: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(assignment: Assignment) {
                    created.push(assignment);
                    return assignment;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };
            const mgr = makeManager(host);
            await mgr.init();

            await mgr.registerWorkflow(twoStepDef);
            const instance = await mgr.startWorkflow(twoStepDef.id, 'user-1');
            created.length = 0;

            const snapshot = await redisClient.hGet(keys.workflowInstance(instance.id), 'data');
            const event = {
                eventId: 'evt-replay',
                type: 'COMPLETED' as const,
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            };

            await (mgr as any).processWorkflowEvent(event);
            // Simulate a crash before ack: restore pre-event state and replay
            await redisClient.hSet(keys.workflowInstance(instance.id), 'data', snapshot);
            await (mgr as any).processWorkflowEvent(event);

            expect(created).to.have.length(2);
            expect(created[0].id).to.equal(created[1].id);
        });
    });

    describe('Shared circuit breaker', function () {
        it('should converge breaker state across replicas via a shared failure counter', async function () {
            const relA = makeReliability({ circuitBreakerShared: true, workflowCircuitBreakerThreshold: 5 });
            const relB = makeReliability({ circuitBreakerShared: true, workflowCircuitBreakerThreshold: 5 });

            await relA.recordCircuitBreakerFailure();
            await relA.recordCircuitBreakerFailure();
            await relA.recordCircuitBreakerFailure();
            await relB.recordCircuitBreakerFailure();
            await relB.recordCircuitBreakerFailure();

            // B only saw 2 local failures, but the shared count reached the threshold
            expect(relB.getCircuitBreakerState().state).to.equal('open');
        });

        it('should keep breakers independent when sharing is disabled', async function () {
            const relA = makeReliability({ workflowCircuitBreakerThreshold: 5 });
            const relB = makeReliability({ workflowCircuitBreakerThreshold: 5 });

            await relA.recordCircuitBreakerFailure();
            await relA.recordCircuitBreakerFailure();
            await relA.recordCircuitBreakerFailure();
            await relB.recordCircuitBreakerFailure();
            await relB.recordCircuitBreakerFailure();

            expect(relB.getCircuitBreakerState().state).to.equal('closed');
        });
    });

    describe('Scheduled retries', function () {
        it('should process due scheduled events and skip future ones', async function () {
            await workflowManager.registerWorkflow(twoStepDef);
            const instance = await workflowManager.startWorkflow(twoStepDef.id, 'user-1');

            const dueEvent: WorkflowEvent = {
                eventId: 'evt-sched-due',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            };
            const futureEvent: WorkflowEvent = { ...dueEvent, eventId: 'evt-sched-future' };

            await redisClient.zAdd(keys.eventsRetryScheduled(), [
                { score: Date.now() - 10, value: JSON.stringify(dueEvent) },
                { score: Date.now() + 60000, value: JSON.stringify(futureEvent) },
            ]);

            const processed = await workflowManager.drainScheduledRetries();
            expect(processed).to.equal(1);

            const remaining = await redisClient.zCard(keys.eventsRetryScheduled());
            expect(remaining).to.equal(1);

            const updated = await workflowManager.getWorkflowInstance(instance.id);
            expect(updated!.currentStepId).to.equal('s2');
        });

        it('should schedule an event with backoff', async function () {
            const event: WorkflowEvent = {
                eventId: 'evt-sched-x',
                type: 'COMPLETED',
                userId: 'u',
                assignmentId: 'a',
                workflowInstanceId: 'none',
                stepId: 's1',
                timestamp: Date.now(),
            };
            await workflowManager.scheduleEventRetry(event, 0);

            const entries = await redisClient.zRangeWithScores(keys.eventsRetryScheduled(), 0, -1);
            expect(entries).to.have.length(1);
            expect(entries[0].score).to.be.greaterThan(Date.now());
        });
    });

    describe('Instance retention', function () {
        it('should expire terminal instances and clean indexes when retention is configured', async function () {
            const mgr = makeManager(mockHost, { retentionMs: 60000 });
            await mgr.init();

            await mgr.registerWorkflow(singleStepDef);
            const instance = await mgr.startWorkflow(singleStepDef.id, 'user-1');

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-ret',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const ttl = await redisClient.pTTL(keys.workflowInstance(instance.id));
            expect(ttl).to.be.greaterThan(0);

            expect(Boolean(await redisClient.hExists(keys.workflowInstances(), instance.id))).to.equal(false);
            expect(Boolean(await redisClient.sIsMember(keys.workflowInstancesByUser('user-1'), instance.id))).to.equal(
                false,
            );
            expect(await redisClient.zScore(keys.workflowInstancesActive(), instance.id)).to.equal(null);
        });

        it('should keep terminal instances forever by default (backward compatible)', async function () {
            await workflowManager.registerWorkflow(singleStepDef);
            const instance = await workflowManager.startWorkflow(singleStepDef.id, 'user-1');

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-noret',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const ttl = await redisClient.pTTL(keys.workflowInstance(instance.id));
            expect(ttl).to.equal(-1);
            expect(Boolean(await redisClient.hExists(keys.workflowInstances(), instance.id))).to.equal(true);
        });

        it('should prune old terminal instances on demand', async function () {
            await workflowManager.registerWorkflow(singleStepDef);
            const instance = await workflowManager.startWorkflow(singleStepDef.id, 'user-1');

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-prune',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            // Active instance must survive pruning
            const active = await workflowManager.startWorkflow(singleStepDef.id, 'user-2');

            const pruned = await workflowManager.pruneWorkflowInstances(0);
            expect(pruned).to.equal(1);

            expect(await workflowManager.getWorkflowInstance(instance.id)).to.equal(null);
            expect(Boolean(await redisClient.hExists(keys.workflowInstances(), instance.id))).to.equal(false);
            expect(await workflowManager.getWorkflowInstance(active.id)).to.not.equal(null);
        });
    });

    describe('Machine task registry & timeouts', function () {
        it('should execute machine steps via a registered handler', async function () {
            const def: WorkflowDefinition = {
                id: 'scale-wf-machine',
                name: 'Machine',
                version: 1,
                initialStepId: 'm1',
                steps: [
                    {
                        id: 'm1',
                        name: 'M1',
                        taskType: 'machine',
                        machineTask: { handler: 'generate' },
                        defaultNextStepId: null,
                    },
                ],
            };

            workflowManager.registerMachineHandler('generate', async () => ({ generated: true }));

            await workflowManager.registerWorkflow(def);
            const instance = await workflowManager.startWorkflow(def.id, 'user-1');

            const updated = await workflowManager.getWorkflowInstance(instance.id);
            expect(updated!.status).to.equal('completed');
            expect(updated!.context.step_m1).to.deep.equal({ generated: true });
        });

        it('should fail machine steps that exceed their timeout', async function () {
            this.timeout(5000);
            const def: WorkflowDefinition = {
                id: 'scale-wf-machine-slow',
                name: 'Slow Machine',
                version: 1,
                initialStepId: 'm1',
                steps: [
                    {
                        id: 'm1',
                        name: 'M1',
                        taskType: 'machine',
                        machineTask: { handler: 'slow' },
                        timeoutMs: 50,
                        defaultNextStepId: null,
                    },
                ],
            };

            workflowManager.registerMachineHandler('slow', async () => {
                await new Promise((r) => setTimeout(r, 500));
                return { done: true };
            });

            await workflowManager.registerWorkflow(def);
            const instance = await workflowManager.startWorkflow(def.id, 'user-1');

            const updated = await workflowManager.getWorkflowInstance(instance.id);
            expect(updated!.status).to.equal('failed');
        });
    });

    describe('Workflow engine metrics', function () {
        it('should report active instances, retry queue depth, DLQ size, and stream stats', async function () {
            await workflowManager.registerWorkflow(singleStepDef);
            await workflowManager.startWorkflow(singleStepDef.id, 'user-1');

            const metrics = await workflowManager.getWorkflowMetrics();
            expect(metrics.activeInstances).to.equal(1);
            expect(metrics.scheduledRetries).to.equal(0);
            expect(metrics.deadLetterQueueSize).to.equal(0);
            expect(metrics.streamLength).to.be.greaterThan(0);
            expect(metrics.streamPending).to.be.a('number');
        });
    });

    describe('Flow rate control', function () {
        it('should allow a burst up to maxEventsPerSecond without delay, then throttle', async function () {
            const mgr = makeManager(mockHost, { maxEventsPerSecond: 3 });

            const start = Date.now();
            await (mgr as any).applyEventThrottle();
            await (mgr as any).applyEventThrottle();
            await (mgr as any).applyEventThrottle();
            const burstElapsed = Date.now() - start;
            expect(burstElapsed).to.be.lessThan(200);

            await (mgr as any).applyEventThrottle();
            const throttledElapsed = Date.now() - start;
            expect(throttledElapsed).to.be.at.least(700);
        });

        it('should not throttle when maxEventsPerSecond is unset', async function () {
            const start = Date.now();
            for (let i = 0; i < 50; i++) {
                await (workflowManager as any).applyEventThrottle();
            }
            expect(Date.now() - start).to.be.lessThan(200);
        });

        it('should pace live event processing according to maxEventsPerSecond', async function () {
            this.timeout(10000);

            const mgr = makeManager(mockHost, {
                maxEventsPerSecond: 2,
                pollBlockMs: 100,
                eventBatchSize: 10,
            });
            await mgr.init();
            await mgr.registerWorkflow(singleStepDef);

            const instances = [];
            for (let i = 0; i < 4; i++) {
                instances.push(await mgr.startWorkflow(singleStepDef.id, `user-${i}`));
            }

            const start = Date.now();
            await mgr.startOrchestrator();

            // 4 instances each complete their single step -> 4 completion events
            for (const instance of instances) {
                const assignmentId = (await mgr.getWorkflowInstance(instance.id))!.currentAssignmentId!;
                await mgr.publishWorkflowEvent({
                    eventId: `flow-evt-${instance.id}`,
                    type: 'COMPLETED',
                    userId: instance.initiatorUserId,
                    assignmentId,
                    workflowInstanceId: instance.id,
                    stepId: 's1',
                    timestamp: Date.now(),
                });
            }

            // Wait until all instances are terminal
            const deadline = Date.now() + 8000;
            let completed = 0;
            while (Date.now() < deadline) {
                completed = 0;
                for (const instance of instances) {
                    const current = await mgr.getWorkflowInstance(instance.id);
                    if (current?.status === 'completed') completed++;
                }
                if (completed === instances.length) break;
                await new Promise((r) => setTimeout(r, 50));
            }
            const elapsed = Date.now() - start;
            await mgr.stopOrchestrator();

            expect(completed).to.equal(instances.length);
            // 4 events at 2/sec: burst of 2, then wait ~1s for the next 2
            expect(elapsed).to.be.at.least(900);
        });
    });
});
