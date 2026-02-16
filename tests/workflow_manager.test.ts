import { expect } from 'chai';
import { createClient } from 'redis';
import { WorkflowManager, WorkflowHost } from '../src/managers/WorkflowManager';
import { ReliabilityManager } from '../src/managers/ReliabilityManager';
import { TelemetryManager } from '../src/managers/TelemetryManager';
import { createKeyBuilders } from '../src/utils/keys';
import { WorkflowDefinition, Assignment } from '../src/types/matcher';
import { readFileSync } from 'fs';
import { join } from 'path';
import sinon from 'sinon';

describe('WorkflowManager', function () {
    let redisClient: any;
    let workflowManager: WorkflowManager;
    let reliability: ReliabilityManager;
    let telemetry: TelemetryManager;
    const keys = createKeyBuilders({ prefix: 'test-wf:' });

    const mockHost: WorkflowHost = {
        async addAssignment(assignment: Assignment) { return assignment; },
        async matchUsersAssignments(userId: string) { return []; }
    };

    before(async function () {
        redisClient = createClient();
        await redisClient.connect();
        await redisClient.flushAll();

        reliability = new ReliabilityManager(redisClient, keys, {
            workflowMaxRetries: 3,
            workflowIdempotencyTtlMs: 1000,
            workflowCircuitBreakerThreshold: 5,
            workflowCircuitBreakerResetMs: 30000,
            workflowAuditEnabled: true,
            streamConsumerName: 'test-consumer',
        });

        telemetry = new TelemetryManager(false);

        workflowManager = new WorkflowManager(redisClient, keys, reliability, telemetry, mockHost, {
            enableWorkflows: true,
            streamConsumerGroup: 'test-group',
            streamConsumerName: 'test-consumer',
            reclaimIntervalMs: 1000,
        });

        await workflowManager.init();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        await workflowManager.init();
    });

    after(async function () {
        await workflowManager.stopOrchestrator();
        await redisClient.flushAll();
        await redisClient.quit();
    });

    describe('Workflow Execution', function () {
        const definition: WorkflowDefinition = {
            id: 'test-wf-1',
            name: 'Test Workflow',
            version: 1,
            initialStepId: 'step-1',
            steps: [
                {
                    id: 'step-1',
                    name: 'Step 1',
                    assignmentTemplate: { tags: ['t1'] },
                    targetUser: 'initiator',
                    defaultNextStepId: 'step-2',
                    timeoutMs: 500,
                },
                {
                    id: 'step-2',
                    name: 'Step 2',
                    assignmentTemplate: { tags: ['t2'] },
                    targetUser: 'initiator',
                    defaultNextStepId: null,
                }
            ]
        };

        it('should start a workflow and create first assignment', async function () {
            await workflowManager.registerWorkflow(definition);
            const instance = await workflowManager.startWorkflow(definition.id, 'user-1');
            
            expect(instance.status).to.equal('active');
            expect(instance.currentStepId).to.equal('step-1');
            expect(instance.currentAssignmentId).to.be.a('string');
            
            const link = await redisClient.get(keys.workflowAssignmentLink(instance.currentAssignmentId!));
            expect(link).to.not.be.null;
        });

        it('should handle step expiry', async function () {
            this.timeout(5000);
            await workflowManager.registerWorkflow(definition);
            const instance = await workflowManager.startWorkflow(definition.id, 'user-2');
            const step1Id = 'step-1';
            
            // Wait for timeout
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const expiredCount = await workflowManager.processExpiredWorkflowSteps();
            expect(expiredCount).to.equal(1);
            
            // The orchestrator should pick up the EXPIRED event if it was running
            // But here we are testing the manager methods directly
        });

        it('should not publish STARTED when workflows disabled', async function () {
            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(assignment: Assignment) {
                    createdAssignments.push(assignment);
                    return assignment;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: false,
                streamConsumerGroup: 'disabled-group',
                streamConsumerName: 'disabled-consumer',
                reclaimIntervalMs: 1000,
            });

            await mgr.registerWorkflow(definition);
            const instance = await mgr.startWorkflow(definition.id, 'u-disabled');

            expect(instance.currentAssignmentId).to.be.a('string');
            expect(createdAssignments).to.have.lengthOf(1);

            const len = await redisClient.xLen(keys.eventStream());
            expect(len).to.equal(0);
        });

        it('should route to next step based on result', async function () {
            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    createdAssignments.push(a);
                    return a;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'route-group',
                streamConsumerName: 'route-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-route',
                name: 'Route',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        routing: [
                            { condition: 'result.score >= 80', targetStepId: 's2' },
                            { condition: 'result.score < 80', targetStepId: 's3' },
                        ],
                    },
                    {
                        id: 's2',
                        name: 'S2',
                        assignmentTemplate: { tags: ['s2'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                    {
                        id: 's3',
                        name: 'S3',
                        assignmentTemplate: { tags: ['s3'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            expect(createdAssignments.map((a) => a.tags[0])).to.deep.equal(['s1']);

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-route',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { score: 80 },
            });

            expect(createdAssignments.map((a) => a.tags[0])).to.include('s2');
            expect(createdAssignments.map((a) => a.tags[0])).to.not.include('s3');
        });

        it('should execute machine task step and continue to next assignment step', async function () {
            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    createdAssignments.push(a);
                    return a;
                },
                async matchUsersAssignments() {
                    return [];
                },
                async executeMachineTask() {
                    return { generated: true, score: 99 };
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'machine-group',
                streamConsumerName: 'machine-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-machine-1',
                name: 'Machine then Human',
                version: 1,
                initialStepId: 'machine-step',
                steps: [
                    {
                        id: 'machine-step',
                        name: 'Compute',
                        taskType: 'machine',
                        machineTask: { handler: 'compute.score' },
                        defaultNextStepId: 'human-step',
                    },
                    {
                        id: 'human-step',
                        name: 'Review',
                        assignmentTemplate: { tags: ['human-review'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const started = await mgr.startWorkflow(def.id, 'user-machine-1');
            const current = await mgr.getWorkflowInstance(started.id);

            expect(current?.status).to.equal('active');
            expect(current?.currentStepId).to.equal('human-step');
            expect(current?.history).to.have.lengthOf(1);
            expect(current?.history[0].stepId).to.equal('machine-step');
            expect(createdAssignments).to.have.lengthOf(1);
            expect(createdAssignments[0].tags).to.deep.equal(['human-review']);
        });

        it('should fail machine task step when executor is not configured', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    return a;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'machine-fail-group',
                streamConsumerName: 'machine-fail-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-machine-fail',
                name: 'Machine Fails',
                version: 1,
                initialStepId: 'machine-step',
                steps: [
                    {
                        id: 'machine-step',
                        name: 'Compute',
                        taskType: 'machine',
                        machineTask: { handler: 'compute.score' },
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const started = await mgr.startWorkflow(def.id, 'user-machine-2');
            const current = await mgr.getWorkflowInstance(started.id);

            expect(current?.status).to.equal('failed');
            expect(current?.history).to.have.lengthOf(0);
        });
    });

    describe('Condition Evaluation', function () {
        it('should evaluate numeric conditions', function () {
            const evalCond = (workflowManager as any).evaluateCondition.bind(workflowManager);
            expect(evalCond('result.score > 80', { score: 90 }, {})).to.be.true;
            expect(evalCond('result.score > 80', { score: 70 }, {})).to.be.false;
            expect(evalCond('result.score >= 80', { score: 80 }, {})).to.be.true;
        });

        it('should evaluate string conditions', function () {
            const evalCond = (workflowManager as any).evaluateCondition.bind(workflowManager);
            expect(evalCond('result.status === "ok"', { status: 'ok' }, {})).to.be.true;
            expect(evalCond('result.status === "ok"', { status: 'error' }, {})).to.be.false;
        });

        it('should evaluate context conditions', function () {
            const evalCond = (workflowManager as any).evaluateCondition.bind(workflowManager);
            expect(evalCond('context.isAdmin === true', {}, { isAdmin: true })).to.be.true;
        });

        it('should evaluate null, inequality, and other operators', function () {
            const evalCond = (workflowManager as any).evaluateCondition.bind(workflowManager);

            expect(evalCond('result.value === null', { value: null }, {})).to.be.true;
            expect(evalCond('result.value !== null', { value: null }, {})).to.be.false;

            expect(evalCond('result.count <= 2', { count: 2 }, {})).to.be.true;
            expect(evalCond('result.count < 2', { count: 2 }, {})).to.be.false;

            expect(evalCond('result.status != "ok"', { status: 'error' }, {})).to.be.true;
            expect(evalCond('result.status !== "ok"', { status: 'ok' }, {})).to.be.false;
        });

        it('should evaluate context with string literals', function () {
            const evalCond = (workflowManager as any).evaluateCondition.bind(workflowManager);
            expect(evalCond("context.role === 'admin'", undefined, { role: 'admin' })).to.be.true;
            expect(evalCond("context.role === 'admin'", undefined, { role: 'user' })).to.be.false;
        });

        it('should return false for invalid condition expressions', function () {
            const evalCond = (workflowManager as any).evaluateCondition.bind(workflowManager);
            expect(evalCond('not_a_real_expr', { score: 1 }, {})).to.be.false;
        });
    });

    describe('Init Consumer Group', function () {
        it('should tolerate BUSYGROUP on repeated init', async function () {
            await workflowManager.init();
            await workflowManager.init();
        });
    });

    describe('Event Publishing', function () {
        it('should enrich event with workflow link when publishing', async function () {
            const streamKey = keys.eventStream();
            const assignmentId = 'asgn-linked-1';

            await redisClient.set(
                keys.workflowAssignmentLink(assignmentId),
                JSON.stringify({ instanceId: 'wf-inst-1', stepId: 'step-9', definitionId: 'def-1' }),
            );

            const messageId = await workflowManager.publishWorkflowEvent({
                eventId: 'evt-1',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId,
                timestamp: Date.now(),
                payload: { ok: true },
            });

            const entries = await redisClient.xRange(streamKey, messageId, messageId);
            expect(entries).to.have.lengthOf(1);
            expect(entries[0].message.workflowInstanceId).to.equal('wf-inst-1');
            expect(entries[0].message.stepId).to.equal('step-9');
        });

        it('should publish event without link (empty fields) and parse cleanly', async function () {
            const streamKey = keys.eventStream();

            const messageId = await workflowManager.publishWorkflowEvent({
                eventId: 'evt-no-link',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'asgn-no-link',
                timestamp: Date.now(),
            });

            const entries = await redisClient.xRange(streamKey, messageId, messageId);
            expect(entries).to.have.lengthOf(1);
            expect(entries[0].message.workflowInstanceId).to.equal('');
            expect(entries[0].message.stepId).to.equal('');

            const parsed = (workflowManager as any).parseStreamMessage(entries[0]);
            expect(parsed.workflowInstanceId).to.equal(undefined);
            expect(parsed.stepId).to.equal(undefined);
            expect(parsed.payload).to.equal(undefined);
        });
    });

    describe('Target User Routing', function () {
        it('should target previous user on next step', async function () {
            const createdAssignments: Assignment[] = [];
            const matchedUsers: string[] = [];

            const host: WorkflowHost = {
                async addAssignment(assignment: Assignment) {
                    createdAssignments.push(assignment);
                    return assignment;
                },
                async matchUsersAssignments(userId: string) {
                    matchedUsers.push(userId);
                    return [];
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'test-group',
                streamConsumerName: 'test-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-prev',
                name: 'Prev Target',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 's2',
                    },
                    {
                        id: 's2',
                        name: 'S2',
                        assignmentTemplate: { tags: ['s2'] },
                        targetUser: 'previous',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'initiator-1');

            // First assignment is created for initiator
            expect(createdAssignments).to.have.lengthOf(1);
            expect(createdAssignments[0]._targetUserId).to.equal('initiator-1');
            expect(matchedUsers).to.include('initiator-1');

            // Complete step 1 as a different user (simulating handoff)
            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-complete-1',
                type: 'COMPLETED',
                userId: 'worker-42',
                assignmentId: instance.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { score: 100 },
            });

            // Step 2 assignment should be targeted to previous completing user
            expect(createdAssignments).to.have.lengthOf(2);
            expect(createdAssignments[1].tags).to.deep.equal(['s2']);
            expect(createdAssignments[1]._targetUserId).to.equal('worker-42');
            expect(matchedUsers).to.include('worker-42');
        });

        it('should not set target user for tag selector', async function () {
            const createdAssignments: Assignment[] = [];
            const matchedUsers: string[] = [];

            const host: WorkflowHost = {
                async addAssignment(assignment: Assignment) {
                    createdAssignments.push(assignment);
                    return assignment;
                },
                async matchUsersAssignments(userId: string) {
                    matchedUsers.push(userId);
                    return [];
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'tag-group',
                streamConsumerName: 'tag-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-tag-target',
                name: 'Tag Target',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: { tag: 'vip' },
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            await mgr.startWorkflow(def.id, 'initiator');

            expect(createdAssignments).to.have.lengthOf(1);
            expect((createdAssignments[0] as any)._targetUserId).to.equal(undefined);
            expect(matchedUsers).to.have.lengthOf(0);
        });
    });

    describe('Snapshot & Instance Queries', function () {
        it('should snapshot definition by default', async function () {
            const defV1: WorkflowDefinition = {
                id: 'wf-snap',
                name: 'Snap',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await workflowManager.registerWorkflow(defV1);
            const instance = await workflowManager.startWorkflow(defV1.id, 'u1');

            const withSnap = await workflowManager.getWorkflowInstanceWithSnapshot(instance.id);
            expect(withSnap?.definitionSnapshot?.version).to.equal(1);
            expect(withSnap?.resolvedDefinition?.version).to.equal(1);

            // Update live definition; snapshot should still resolve to v1
            const defV2 = { ...defV1, version: 2, name: 'Snap2' };
            await workflowManager.registerWorkflow(defV2);

            const withSnap2 = await workflowManager.getWorkflowInstanceWithSnapshot(instance.id);
            expect(withSnap2?.resolvedDefinition?.version).to.equal(1);
        });

        it('should resolve live definition when snapshot disabled', async function () {
            const localKeys = createKeyBuilders({ prefix: 'test-wf-nosnap:' });
            const localReliability = new ReliabilityManager(redisClient, localKeys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 1000,
                workflowCircuitBreakerThreshold: 5,
                workflowCircuitBreakerResetMs: 30000,
                workflowAuditEnabled: false,
                workflowSnapshotDefinitions: false,
                streamConsumerName: 'nosnap-consumer',
            });

            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, localKeys, localReliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'nosnap-group',
                streamConsumerName: 'nosnap-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const defV1: WorkflowDefinition = {
                id: 'wf-nosnap',
                name: 'NoSnap',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(defV1);
            const instance = await mgr.startWorkflow(defV1.id, 'u1');

            const saved = await mgr.getWorkflowInstance(instance.id);
            expect(saved?.definitionSnapshot).to.equal(undefined);

            const defV2 = { ...defV1, version: 2, name: 'NoSnap2' };
            await mgr.registerWorkflow(defV2);

            const withResolved = await mgr.getWorkflowInstanceWithSnapshot(instance.id);
            expect(withResolved?.resolvedDefinition?.version).to.equal(2);
        });

        it('should list active workflows and exclude cancelled', async function () {
            const def: WorkflowDefinition = {
                id: 'wf-active',
                name: 'Active',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await workflowManager.registerWorkflow(def);
            const instance = await workflowManager.startWorkflow(def.id, 'user-active');

            const active1 = await workflowManager.getActiveWorkflowsForUser('user-active');
            expect(active1.map((i) => i.id)).to.include(instance.id);

            const cancelled = await workflowManager.cancelWorkflow(instance.id);
            expect(cancelled).to.equal(true);

            const updated = await workflowManager.getWorkflowInstance(instance.id);
            expect(updated?.status).to.equal('cancelled');

            const active2 = await workflowManager.getActiveWorkflowsForUser('user-active');
            expect(active2.map((i) => i.id)).to.not.include(instance.id);
        });
    });

    describe('Retries & Parallel', function () {
        it('should retry a failed step up to maxRetries', async function () {
            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    createdAssignments.push(a);
                    return a;
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'retry-group',
                streamConsumerName: 'retry-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-retry',
                name: 'Retry',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                        maxRetries: 1,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            expect(createdAssignments).to.have.lengthOf(1);

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-fail-1',
                type: 'FAILED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { reason: 'nope' },
            });

            expect(createdAssignments).to.have.lengthOf(2);
            const afterRetry = await mgr.getWorkflowInstance(instance.id);
            expect(afterRetry?.retryCount).to.equal(1);
            expect(afterRetry?.status).to.equal('active');

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-fail-2',
                type: 'FAILED',
                userId: 'u1',
                assignmentId: afterRetry?.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { reason: 'still nope' },
            });

            const failed = await mgr.getWorkflowInstance(instance.id);
            expect(failed?.status).to.equal('failed');
        });

        it('should execute parallel branches and wait for all by default', async function () {
            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    createdAssignments.push(a);
                    return a;
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'par-group',
                streamConsumerName: 'par-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-par',
                name: 'Parallel',
                version: 1,
                initialStepId: 'join',
                steps: [
                    {
                        id: 'join',
                        name: 'Join',
                        assignmentTemplate: { tags: ['join'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['a', 'b'],
                    },
                    {
                        id: 'a',
                        name: 'A',
                        assignmentTemplate: { tags: ['a'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 'after',
                    },
                    {
                        id: 'b',
                        name: 'B',
                        assignmentTemplate: { tags: ['b'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 'after',
                    },
                    {
                        id: 'after',
                        name: 'After',
                        assignmentTemplate: { tags: ['after'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            const started = await mgr.getWorkflowInstance(instance.id);
            expect(started?.parallelBranches).to.have.lengthOf(2);
            expect(createdAssignments.map((a) => a.tags[0]).sort()).to.deep.equal(['a', 'b']);

            const aAsgn = started!.parallelBranches!.find((x) => x.stepId === 'a')!.assignmentId;
            const bAsgn = started!.parallelBranches!.find((x) => x.stepId === 'b')!.assignmentId;

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-a',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: aAsgn,
                workflowInstanceId: instance.id,
                stepId: 'a',
                timestamp: Date.now(),
                payload: { ok: 'a' },
            });

            // Still waiting for b
            expect(createdAssignments.map((a) => a.tags[0])).to.not.include('after');

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-b',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: bAsgn,
                workflowInstanceId: instance.id,
                stepId: 'b',
                timestamp: Date.now(),
                payload: { ok: 'b' },
            });

            expect(createdAssignments.map((a) => a.tags[0])).to.include('after');
            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated?.status).to.equal('active');
            expect(updated?.currentStepId).to.equal('after');
        });

        it('should proceed early when waitForAll is false', async function () {
            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    createdAssignments.push(a);
                    return a;
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'par2-group',
                streamConsumerName: 'par2-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-par2',
                name: 'Parallel2',
                version: 1,
                initialStepId: 'join',
                steps: [
                    {
                        id: 'join',
                        name: 'Join',
                        assignmentTemplate: { tags: ['join'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['a', 'b'],
                    },
                    {
                        id: 'a',
                        name: 'A',
                        assignmentTemplate: { tags: ['a'] },
                        targetUser: 'initiator',
                        waitForAll: false,
                        defaultNextStepId: 'after',
                    },
                    {
                        id: 'b',
                        name: 'B',
                        assignmentTemplate: { tags: ['b'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 'after',
                    },
                    {
                        id: 'after',
                        name: 'After',
                        assignmentTemplate: { tags: ['after'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            const started = await mgr.getWorkflowInstance(instance.id);
            const aAsgn = started!.parallelBranches!.find((x) => x.stepId === 'a')!.assignmentId;

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-a2',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: aAsgn,
                workflowInstanceId: instance.id,
                stepId: 'a',
                timestamp: Date.now(),
                payload: { ok: 'a' },
            });

            expect(createdAssignments.map((a) => a.tags[0])).to.include('after');
        });

        it('should abort workflow on parallel failure policy abort', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'parfail-group',
                streamConsumerName: 'parfail-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-parfail',
                name: 'ParFail',
                version: 1,
                initialStepId: 'join',
                steps: [
                    {
                        id: 'join',
                        name: 'Join',
                        assignmentTemplate: { tags: ['join'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['a'],
                    },
                    {
                        id: 'a',
                        name: 'A',
                        assignmentTemplate: { tags: ['a'] },
                        targetUser: 'initiator',
                        failurePolicy: 'abort',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            const started = await mgr.getWorkflowInstance(instance.id);
            const aAsgn = started!.parallelBranches!.find((x) => x.stepId === 'a')!.assignmentId;

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-abort',
                type: 'FAILED',
                userId: 'u1',
                assignmentId: aAsgn,
                workflowInstanceId: instance.id,
                stepId: 'a',
                timestamp: Date.now(),
                payload: { reason: 'bad' },
            });

            const failed = await mgr.getWorkflowInstance(instance.id);
            expect(failed?.status).to.equal('failed');
        });

        it('should continue on parallel failure when policy continue and allDone', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'parcont-group',
                streamConsumerName: 'parcont-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-parcont',
                name: 'ParCont',
                version: 1,
                initialStepId: 'join',
                steps: [
                    {
                        id: 'join',
                        name: 'Join',
                        assignmentTemplate: { tags: ['join'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['a', 'b'],
                    },
                    {
                        id: 'a',
                        name: 'A',
                        assignmentTemplate: { tags: ['a'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                    {
                        id: 'b',
                        name: 'B',
                        assignmentTemplate: { tags: ['b'] },
                        targetUser: 'initiator',
                        failurePolicy: 'continue',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            const started = await mgr.getWorkflowInstance(instance.id);
            const aAsgn = started!.parallelBranches!.find((x) => x.stepId === 'a')!.assignmentId;
            const bAsgn = started!.parallelBranches!.find((x) => x.stepId === 'b')!.assignmentId;

            // Complete A first
            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-a3',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: aAsgn,
                workflowInstanceId: instance.id,
                stepId: 'a',
                timestamp: Date.now(),
            });

            // Fail B; policy continue + allDone => should complete workflow
            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-b3',
                type: 'FAILED',
                userId: 'u1',
                assignmentId: bAsgn,
                workflowInstanceId: instance.id,
                stepId: 'b',
                timestamp: Date.now(),
                payload: { reason: 'b failed' },
            });

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated?.status).to.equal('completed');
        });
    });

    describe('Orphan Reclaim (XAUTOCLAIM)', function () {
        it('should reclaim and process pending messages', async function () {
            this.timeout(10000);

            const createdAssignments: Assignment[] = [];
            const host: WorkflowHost = {
                async addAssignment(assignment: Assignment) {
                    createdAssignments.push(assignment);
                    return assignment;
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'reclaim-group',
                streamConsumerName: 'reclaim-consumer',
                reclaimIntervalMs: 1,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-reclaim',
                name: 'Reclaim',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            // Publish a completion event
            await mgr.publishWorkflowEvent({
                eventId: 'evt-reclaim-1',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { ok: true },
            });

            // Create a pending message by reading with another consumer and not acking
            const other = redisClient.duplicate();
            await other.connect();
            const streamKey = keys.eventStream();
            const response = await other.xReadGroup(
                'reclaim-group',
                'other-consumer',
                [{ key: streamKey, id: '>' }],
                { COUNT: 10, BLOCK: 1000 },
            ) as any;
            expect(response).to.not.equal(null);

            // Ack any non-COMPLETED messages (e.g. STARTED), leave COMPLETED pending
            for (const stream of response) {
                for (const msg of stream.messages) {
                    if (msg?.message?.type !== 'COMPLETED') {
                        await other.xAck(streamKey, 'reclaim-group', msg.id);
                    }
                }
            }
            await other.quit();

            // Provide a connected subscriberClient for XAUTOCLAIM without starting the orchestrator loop
            const subscriber = redisClient.duplicate();
            await subscriber.connect();
            (mgr as any).subscriberClient = subscriber;

            // Give the message at least minimal idle time
            await new Promise((r) => setTimeout(r, 5));

            const reclaimed = await mgr.reclaimOrphanedMessages();
            expect(reclaimed).to.equal(1);

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated?.status).to.equal('completed');

            // Retry count should remain 0 on successful reclaim processing
            const retryCount = Number(await redisClient.get(keys.eventRetryCount('evt-reclaim-1'))) || 0;
            expect(retryCount).to.equal(0);

            await subscriber.quit();
        });

        it('should return 0 when subscriber client is not connected', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    return a;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'no-sub-group',
                streamConsumerName: 'no-sub-consumer',
                reclaimIntervalMs: 1,
            });
            await mgr.init();

            const reclaimed = await mgr.reclaimOrphanedMessages();
            expect(reclaimed).to.equal(0);
        });

        it('should ack already-processed events without reprocessing', async function () {
            this.timeout(10000);

            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'dedupe-group',
                streamConsumerName: 'dedupe-consumer',
                reclaimIntervalMs: 1,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-dedupe',
                name: 'Dedupe',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            await mgr.publishWorkflowEvent({
                eventId: 'evt-dupe',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const other = redisClient.duplicate();
            await other.connect();
            const streamKey = keys.eventStream();
            const resp = await other.xReadGroup(
                'dedupe-group',
                'other-consumer',
                [{ key: streamKey, id: '>' }],
                { COUNT: 10, BLOCK: 1000 },
            ) as any;
            expect(resp).to.not.equal(null);

            // Ack STARTED; keep COMPLETED pending
            for (const stream of resp) {
                for (const msg of stream.messages) {
                    if (msg?.message?.type !== 'COMPLETED') {
                        await other.xAck(streamKey, 'dedupe-group', msg.id);
                    }
                }
            }
            await other.quit();

            await reliability.markEventProcessed('evt-dupe');

            const subscriber = redisClient.duplicate();
            await subscriber.connect();
            (mgr as any).subscriberClient = subscriber;
            await new Promise((r) => setTimeout(r, 5));

            const reclaimed = await mgr.reclaimOrphanedMessages();
            expect(reclaimed).to.equal(0);

            const pending = await redisClient.sendCommand(['XPENDING', streamKey, 'dedupe-group']) as any;
            expect(Number(pending[0])).to.equal(0);

            await subscriber.quit();
        });

        it('should move to DLQ when max retries exceeded', async function () {
            this.timeout(10000);

            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'dlq-group',
                streamConsumerName: 'dlq-consumer',
                reclaimIntervalMs: 1,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-dlq',
                name: 'DLQ',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            await mgr.publishWorkflowEvent({
                eventId: 'evt-dlq',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            // Force max retries
            await redisClient.set(keys.eventRetryCount('evt-dlq'), String(reliability.options.workflowMaxRetries));

            const other = redisClient.duplicate();
            await other.connect();
            const streamKey = keys.eventStream();
            const resp = await other.xReadGroup(
                'dlq-group',
                'other-consumer',
                [{ key: streamKey, id: '>' }],
                { COUNT: 10, BLOCK: 1000 },
            ) as any;
            expect(resp).to.not.equal(null);

            // Ack STARTED; keep COMPLETED pending
            for (const stream of resp) {
                for (const msg of stream.messages) {
                    if (msg?.message?.type !== 'COMPLETED') {
                        await other.xAck(streamKey, 'dlq-group', msg.id);
                    }
                }
            }
            await other.quit();

            const subscriber = redisClient.duplicate();
            await subscriber.connect();
            (mgr as any).subscriberClient = subscriber;
            await new Promise((r) => setTimeout(r, 5));

            const reclaimed = await mgr.reclaimOrphanedMessages();
            expect(reclaimed).to.equal(0);
            expect(await reliability.getDeadLetterQueueSize()).to.equal(1);

            const pending = await redisClient.sendCommand(['XPENDING', streamKey, 'dlq-group']) as any;
            expect(Number(pending[0])).to.equal(0);

            await subscriber.quit();
        });

        it('should increment retry count on processing error and keep message pending', async function () {
            this.timeout(10000);

            const consoleStub = sinon.stub(console, 'error');

            const host: WorkflowHost = {
                async addAssignment() {
                    throw new Error('downstream failure');
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'err-group',
                streamConsumerName: 'err-consumer',
                reclaimIntervalMs: 1,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-err',
                name: 'Err',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 's2',
                    },
                    {
                        id: 's2',
                        name: 'S2',
                        assignmentTemplate: { tags: ['s2'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(def);

            // Create a new instance directly in Redis with an assignment, since host.addAssignment always throws.
            // We'll bypass startWorkflow and write a minimal instance to Redis.
            const instanceId = 'wf-err-inst';
            const instance: any = {
                id: instanceId,
                workflowDefinitionId: def.id,
                initiatorUserId: 'u1',
                status: 'active',
                currentStepId: 's1',
                currentAssignmentId: 'asgn-err-1',
                context: {},
                history: [],
                retryCount: 0,
                version: 1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                definitionSnapshot: def,
            };
            await redisClient.hSet(keys.workflowInstance(instanceId), 'data', JSON.stringify(instance));
            await redisClient.hSet(keys.workflowInstances(), instanceId, def.id);

            await mgr.publishWorkflowEvent({
                eventId: 'evt-err',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'asgn-err-1',
                workflowInstanceId: instanceId,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const other = redisClient.duplicate();
            await other.connect();
            const streamKey = keys.eventStream();
            const resp = await other.xReadGroup(
                'err-group',
                'other-consumer',
                [{ key: streamKey, id: '>' }],
                { COUNT: 10, BLOCK: 1000 },
            ) as any;
            expect(resp).to.not.equal(null);

            // Ack STARTED (if any); keep COMPLETED pending
            for (const stream of resp) {
                for (const msg of stream.messages) {
                    if (msg?.message?.type !== 'COMPLETED') {
                        await other.xAck(streamKey, 'err-group', msg.id);
                    }
                }
            }
            await other.quit();

            const subscriber = redisClient.duplicate();
            await subscriber.connect();
            (mgr as any).subscriberClient = subscriber;
            await new Promise((r) => setTimeout(r, 5));

            const before = Number(await redisClient.get(keys.eventRetryCount('evt-err'))) || 0;
            expect(before).to.equal(0);

            const reclaimed = await mgr.reclaimOrphanedMessages();
            expect(reclaimed).to.equal(0);

            const after = Number(await redisClient.get(keys.eventRetryCount('evt-err'))) || 0;
            expect(after).to.equal(1);

            const pending = await redisClient.sendCommand(['XPENDING', streamKey, 'err-group']) as any;
            expect(Number(pending[0])).to.be.greaterThan(0);

            await subscriber.quit();

            consoleStub.restore();
        });
    });

    describe('Lua Transitions', function () {
        it('should perform atomic transitions via lua when sha is set', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'lua-group',
                streamConsumerName: 'lua-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const lua = readFileSync(join(process.cwd(), 'src', 'lua', 'workflow-transition.lua'), 'utf8');
            const sha = await redisClient.scriptLoad(lua);
            mgr.setLuaScriptSha(sha);

            const def: WorkflowDefinition = {
                id: 'wf-lua',
                name: 'Lua',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            const current = await mgr.getWorkflowInstance(instance.id);

            const ok = await mgr.atomicWorkflowTransition(instance.id, current!.version, 'cancelled', null, { x: 1 });
            expect(ok.ok).to.equal(true);

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated?.status).to.equal('cancelled');
            expect(updated?.context.x).to.equal(1);
        });

        it('should return error on version mismatch via lua', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'lua2-group',
                streamConsumerName: 'lua2-consumer',
                reclaimIntervalMs: 1000,
            });
            await mgr.init();

            const lua = readFileSync(join(process.cwd(), 'src', 'lua', 'workflow-transition.lua'), 'utf8');
            const sha = await redisClient.scriptLoad(lua);
            mgr.setLuaScriptSha(sha);

            const def: WorkflowDefinition = {
                id: 'wf-lua2',
                name: 'Lua2',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            const res = await mgr.atomicWorkflowTransition(instance.id, 9999, 'cancelled', null, {});
            expect(res.ok).to.equal(false);
            expect(res.error).to.match(/Workflow transition failed/);
        });
    });

    describe('Orchestrator Controls', function () {
        it('should throw when starting orchestrator while workflows disabled', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: false,
                streamConsumerGroup: 'no-orch-group',
                streamConsumerName: 'no-orch-consumer',
                reclaimIntervalMs: 1000,
            });

            let threw = false;
            try {
                await mgr.startOrchestrator();
            } catch {
                threw = true;
            }
            expect(threw).to.equal(true);
        });

        it('should process a COMPLETED event via orchestrator loop', async function () {
            this.timeout(10000);

            const consoleStub = sinon.stub(console, 'error');

            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'orch-group',
                streamConsumerName: 'orch-consumer',
                reclaimIntervalMs: 20,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-orch',
                name: 'Orch',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            await mgr.startOrchestrator();

            await mgr.publishWorkflowEvent({
                eventId: 'evt-orch',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const deadline = Date.now() + 3000;
            while (Date.now() < deadline) {
                const updated = await mgr.getWorkflowInstance(instance.id);
                if (updated?.status === 'completed') break;
                await new Promise((r) => setTimeout(r, 50));
            }

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated?.status).to.equal('completed');

            await mgr.stopOrchestrator();
            consoleStub.restore();
        });

        it('should record retry count when processing fails in orchestrator loop', async function () {
            this.timeout(15000);

            const consoleStub = sinon.stub(console, 'error');

            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    if (a.tags?.includes('s2')) {
                        throw new Error('forced failure');
                    }
                    return a;
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'orcherr-group',
                streamConsumerName: 'orcherr-consumer',
                reclaimIntervalMs: 1000000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-orcherr',
                name: 'OrchErr',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 's2',
                    },
                    {
                        id: 's2',
                        name: 'S2',
                        assignmentTemplate: { tags: ['s2'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            await mgr.startOrchestrator();

            await mgr.publishWorkflowEvent({
                eventId: 'evt-orcherr',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const deadline = Date.now() + 5000;
            while (Date.now() < deadline) {
                const retry = Number(await redisClient.get(keys.eventRetryCount('evt-orcherr'))) || 0;
                if (retry >= 1) break;
                await new Promise((r) => setTimeout(r, 50));
            }

            const retry = Number(await redisClient.get(keys.eventRetryCount('evt-orcherr'))) || 0;
            expect(retry).to.be.greaterThan(0);

            await mgr.stopOrchestrator();
            consoleStub.restore();
        });

        it('should move to DLQ when retry count exceeds max in orchestrator loop', async function () {
            this.timeout(20000);

            const consoleStub = sinon.stub(console, 'error');

            const localReliability = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 0,
                workflowIdempotencyTtlMs: 1000,
                workflowCircuitBreakerThreshold: 50,
                workflowCircuitBreakerResetMs: 1,
                workflowAuditEnabled: true,
                streamConsumerName: 'orchdlq-consumer',
            });

            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    if (a.tags?.includes('s2')) {
                        throw new Error('forced failure for dlq');
                    }
                    return a;
                },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, localReliability, telemetry, host, {
                enableWorkflows: true,
                streamConsumerGroup: 'orchdlq-group',
                streamConsumerName: 'orchdlq-consumer',
                reclaimIntervalMs: 1000000,
            });
            await mgr.init();

            const def: WorkflowDefinition = {
                id: 'wf-orchdlq',
                name: 'OrchDLQ',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: 's2',
                    },
                    {
                        id: 's2',
                        name: 'S2',
                        assignmentTemplate: { tags: ['s2'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');

            await mgr.startOrchestrator();
            await mgr.publishWorkflowEvent({
                eventId: 'evt-orchdlq',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const deadline = Date.now() + 8000;
            while (Date.now() < deadline) {
                const size = await localReliability.getDeadLetterQueueSize();
                if (size >= 1) break;
                await new Promise((r) => setTimeout(r, 50));
            }

            expect(await localReliability.getDeadLetterQueueSize()).to.equal(1);

            await mgr.stopOrchestrator();
            consoleStub.restore();
        });
    });

    describe('Process Expired Workflow Steps', function () {
        it('should return 0 when workflows disabled', async function () {
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) { return a; },
                async matchUsersAssignments() { return []; },
            };

            const mgr = new WorkflowManager(redisClient, keys, reliability, telemetry, host, {
                enableWorkflows: false,
                streamConsumerGroup: 'exp0-group',
                streamConsumerName: 'exp0-consumer',
                reclaimIntervalMs: 1000,
            });

            const count = await mgr.processExpiredWorkflowSteps();
            expect(count).to.equal(0);
        });

        it('should skip non-active instances and instances without timeout', async function () {
            await workflowManager.registerWorkflow({
                id: 'wf-exp-skip',
                name: 'Skip',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            });

            const now = Date.now();
            const inst1: any = {
                id: 'inst-nonactive',
                workflowDefinitionId: 'wf-exp-skip',
                initiatorUserId: 'u1',
                status: 'completed',
                currentStepId: 's1',
                currentAssignmentId: 'a1',
                context: {},
                history: [],
                retryCount: 0,
                version: 1,
                createdAt: now,
                updatedAt: now,
            };

            const inst2: any = {
                id: 'inst-notimeout',
                workflowDefinitionId: 'wf-exp-skip',
                initiatorUserId: 'u2',
                status: 'active',
                currentStepId: 's1',
                currentAssignmentId: 'a2',
                context: {},
                history: [],
                retryCount: 0,
                version: 1,
                createdAt: now,
                updatedAt: now,
            };

            await redisClient.hSet(keys.workflowInstance(inst1.id), 'data', JSON.stringify(inst1));
            await redisClient.hSet(keys.workflowInstance(inst2.id), 'data', JSON.stringify(inst2));
            await redisClient.hSet(keys.workflowInstances(), inst1.id, inst1.workflowDefinitionId);
            await redisClient.hSet(keys.workflowInstances(), inst2.id, inst2.workflowDefinitionId);

            const count = await workflowManager.processExpiredWorkflowSteps();
            expect(count).to.equal(0);
        });
    });

    describe('processWorkflowEvent early returns', function () {
        it('should return early when instance does not exist', async function () {
            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-instance-missing',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'a1',
                workflowInstanceId: 'wf-inst-missing',
                stepId: 's1',
                timestamp: Date.now(),
            });
        });

        it('should return early when instance is not active', async function () {
            const def: WorkflowDefinition = {
                id: 'wf-inactive',
                name: 'Inactive',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };
            await workflowManager.registerWorkflow(def);
            const inst = await workflowManager.startWorkflow(def.id, 'u1');
            inst.status = 'completed';
            await redisClient.hSet(keys.workflowInstance(inst.id), 'data', JSON.stringify(inst));

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-inactive',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: inst.currentAssignmentId!,
                workflowInstanceId: inst.id,
                stepId: 's1',
                timestamp: Date.now(),
            });
        });

        it('should return early when definition cannot be resolved', async function () {
            const instId = 'wf-no-def-inst';
            const now = Date.now();
            const instanceObj: any = {
                id: instId,
                workflowDefinitionId: 'wf-does-not-exist',
                initiatorUserId: 'u1',
                status: 'active',
                currentStepId: 's1',
                currentAssignmentId: 'a1',
                context: {},
                history: [],
                retryCount: 0,
                version: 1,
                createdAt: now,
                updatedAt: now,
            };
            await redisClient.hSet(keys.workflowInstance(instId), 'data', JSON.stringify(instanceObj));

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-no-def',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'a1',
                workflowInstanceId: instId,
                stepId: 's1',
                timestamp: Date.now(),
            });
        });

        it('should complete workflow when no routing and no defaultNextStepId', async function () {
            const def: WorkflowDefinition = {
                id: 'wf-nodefault',
                name: 'NoDefault',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                    } as any,
                ],
            };
            await workflowManager.registerWorkflow(def);
            const inst = await workflowManager.startWorkflow(def.id, 'u1');

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-nodefault',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: inst.currentAssignmentId!,
                workflowInstanceId: inst.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { ok: true },
            });

            const updated = await workflowManager.getWorkflowInstance(inst.id);
            expect(updated?.status).to.equal('completed');
        });
    });

    describe('No-op Event Types', function () {
        it('should ignore events without workflowInstanceId and unsupported types', async function () {
            const def: WorkflowDefinition = {
                id: 'wf-noop',
                name: 'Noop',
                version: 1,
                initialStepId: 's1',
                steps: [
                    {
                        id: 's1',
                        name: 'S1',
                        assignmentTemplate: { tags: ['s1'] },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await workflowManager.registerWorkflow(def);
            const instance = await workflowManager.startWorkflow(def.id, 'u1');
            const before = await workflowManager.getWorkflowInstance(instance.id);

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-noinst',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'a',
                timestamp: Date.now(),
            });

            await (workflowManager as any).processWorkflowEvent({
                eventId: 'evt-rejected',
                type: 'REJECTED',
                userId: 'u1',
                assignmentId: before?.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            const after = await workflowManager.getWorkflowInstance(instance.id);
            expect(after?.status).to.equal(before?.status);
            expect(after?.history.length).to.equal(before?.history.length);
        });
    });
});
