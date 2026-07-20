import { expect } from 'chai';
import { createClient } from 'redis';
import sinon from 'sinon';
import { WorkflowManager, WorkflowHost } from '../src/managers/WorkflowManager';
import { ReliabilityManager } from '../src/managers/ReliabilityManager';
import { TelemetryManager } from '../src/managers/TelemetryManager';
import { createKeyBuilders } from '../src/utils/keys';
import { WorkflowDefinition, Assignment, WorkflowTransition } from '../src/types/matcher';

/**
 * Platform-facing "runs" surface: listing/pagination, the onWorkflowEvent
 * webhook fan-out hook, external (callback) steps, the non-blocking event
 * drain, cancel cleanup, and the initiator-existence guard. These are the
 * primitives the platform's workflow-runs API and worker orchestrator are
 * built on (see PLATFORM_PLAN.md / WORKFLOWS_EXPOSURE_DESIGN.md).
 */
describe('Workflow Runs (platform-facing surface)', function () {
    this.timeout(2000);
    let redisClient: any;
    let reliability: ReliabilityManager;
    let telemetry: TelemetryManager;
    const keys = createKeyBuilders({ prefix: 'test-runs:' });

    function makeAssignmentTrackingHost(): WorkflowHost & { created: Assignment[]; removed: string[] } {
        const created: Assignment[] = [];
        const removed: string[] = [];
        return {
            created,
            removed,
            async addAssignment(assignment: Assignment) {
                created.push(assignment);
                return assignment;
            },
            async matchUsersAssignments() {
                return [];
            },
            async removeAssignment(assignmentId: string) {
                removed.push(assignmentId);
                return assignmentId;
            },
        };
    }

    function makeManager(host: WorkflowHost, options: Record<string, any> = {}, rel: ReliabilityManager = reliability) {
        return new WorkflowManager(redisClient, keys, rel, telemetry, host, {
            enableWorkflows: true,
            streamConsumerGroup: 'runs-group',
            streamConsumerName: 'runs-consumer',
            reclaimIntervalMs: 1000,
            ...options,
        });
    }

    before(async function () {
        redisClient = createClient();
        await redisClient.connect();
        telemetry = new TelemetryManager(false);
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        reliability = new ReliabilityManager(redisClient, keys, {
            workflowMaxRetries: 2,
            workflowIdempotencyTtlMs: 60000,
            workflowCircuitBreakerThreshold: 5,
            workflowCircuitBreakerResetMs: 30000,
            workflowAuditEnabled: false,
            streamConsumerName: 'runs-consumer',
        });
    });

    after(async function () {
        await redisClient.flushAll();
        await redisClient.quit();
    });

    const linearDef: WorkflowDefinition = {
        id: 'runs-linear',
        name: 'Linear',
        version: 1,
        initialStepId: 's1',
        steps: [{ id: 's1', name: 'S1', assignmentTemplate: { tags: ['t1'] }, targetUser: 'initiator', defaultNextStepId: null }],
    };

    const externalDef: WorkflowDefinition = {
        id: 'runs-external',
        name: 'External',
        version: 1,
        initialStepId: 'ext1',
        steps: [
            {
                id: 'ext1',
                name: 'External One',
                taskType: 'external',
                external: { name: 'do-thing', input: { foo: 'bar' } },
                timeoutMs: 30000,
                routing: [
                    { condition: 'result.approved === true', targetStepId: 'approved' },
                    { condition: 'result.approved === false', targetStepId: 'rejected' },
                ],
                defaultNextStepId: 'approved',
            },
            { id: 'approved', name: 'Approved', assignmentTemplate: { tags: ['a'] }, targetUser: 'initiator', defaultNextStepId: null },
            { id: 'rejected', name: 'Rejected', assignmentTemplate: { tags: ['r'] }, targetUser: 'initiator', defaultNextStepId: null },
        ],
    };

    describe('listWorkflowInstances', function () {
        it('returns runs newest-first and paginates via cursor', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);

            const first = await mgr.startWorkflow(linearDef.id, 'u1');
            const second = await mgr.startWorkflow(linearDef.id, 'u2');
            const third = await mgr.startWorkflow(linearDef.id, 'u3');

            const page1 = await mgr.listWorkflowInstances({ limit: 2 });
            expect(page1.instances.map((i) => i.id)).to.deep.equal([third.id, second.id]);
            expect(page1.nextCursor).to.be.a('string');

            const page2 = await mgr.listWorkflowInstances({ limit: 2, cursor: page1.nextCursor });
            expect(page2.instances.map((i) => i.id)).to.deep.equal([first.id]);
            expect(page2.nextCursor).to.be.undefined;
        });

        it('filters by workflowDefinitionId and by status', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);
            await mgr.registerWorkflow({ ...linearDef, id: 'runs-linear-2' });

            const a = await mgr.startWorkflow(linearDef.id, 'u1');
            await mgr.startWorkflow('runs-linear-2', 'u2');
            await mgr.cancelWorkflow(a.id);

            const byDefinition = await mgr.listWorkflowInstances({ workflowDefinitionId: 'runs-linear-2' });
            expect(byDefinition.instances).to.have.length(1);
            expect(byDefinition.instances[0].workflowDefinitionId).to.equal('runs-linear-2');

            const cancelled = await mgr.listWorkflowInstances({ status: 'cancelled' });
            expect(cancelled.instances.map((i) => i.id)).to.deep.equal([a.id]);

            const active = await mgr.listWorkflowInstances({ status: 'active' });
            expect(active.instances.map((i) => i.workflowDefinitionId)).to.deep.equal(['runs-linear-2']);
        });

        it('returns an empty page when no instances exist', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            const page = await mgr.listWorkflowInstances();
            expect(page.instances).to.deep.equal([]);
            expect(page.nextCursor).to.be.undefined;
        });
    });

    describe('onWorkflowEvent transitions', function () {
        it('fires run.started then step.completed and run.completed for a single-step run', async function () {
            const transitions: WorkflowTransition[] = [];
            const mgr = makeManager(makeAssignmentTrackingHost(), { onWorkflowEvent: (t: WorkflowTransition) => transitions.push(t) });
            await mgr.registerWorkflow(linearDef);

            const instance = await mgr.startWorkflow(linearDef.id, 'u1');
            expect(transitions.map((t) => t.kind)).to.deep.equal(['run.started']);

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-1',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            });

            expect(transitions.map((t) => t.kind)).to.deep.equal(['run.started', 'step.completed', 'run.completed']);
            expect(transitions[2].instance.status).to.equal('completed');
        });

        it('fires step.ready with the external step name/input when an external step is reached', async function () {
            const transitions: WorkflowTransition[] = [];
            const mgr = makeManager(makeAssignmentTrackingHost(), { onWorkflowEvent: (t: WorkflowTransition) => transitions.push(t) });
            await mgr.registerWorkflow(externalDef);

            await mgr.startWorkflow(externalDef.id, 'u1');

            const ready = transitions.find((t) => t.kind === 'step.ready');
            expect(ready).to.exist;
            expect(ready!.stepId).to.equal('ext1');
            expect(ready!.payload).to.deep.equal({ name: 'do-thing', input: { foo: 'bar' } });
        });

        it('swallows errors thrown by the onWorkflowEvent callback without affecting processing', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost(), {
                onWorkflowEvent: () => {
                    throw new Error('consumer boom');
                },
            });
            await mgr.registerWorkflow(linearDef);

            const instance = await mgr.startWorkflow(linearDef.id, 'u1');
            expect(instance.status).to.equal('active');
        });

        it('fires step.failed with willRetry then retries, and run.failed once retries are exhausted', async function () {
            const transitions: WorkflowTransition[] = [];
            const retryDef: WorkflowDefinition = {
                ...linearDef,
                id: 'runs-retry',
                steps: [{ ...linearDef.steps[0], maxRetries: 1 }],
            };
            const mgr = makeManager(makeAssignmentTrackingHost(), { onWorkflowEvent: (t: WorkflowTransition) => transitions.push(t) });
            await mgr.registerWorkflow(retryDef);
            const instance = await mgr.startWorkflow(retryDef.id, 'u1');

            const failEvent = {
                eventId: 'evt-fail',
                type: 'FAILED' as const,
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
                payload: { error: 'boom' },
            };

            await (mgr as any).processWorkflowEvent(failEvent);
            const firstFail = transitions.find((t) => t.kind === 'step.failed');
            expect(firstFail!.payload!.willRetry).to.equal(true);
            expect(transitions.some((t) => t.kind === 'run.failed')).to.equal(false);

            await (mgr as any).processWorkflowEvent({ ...failEvent, eventId: 'evt-fail-2' });
            const failures = transitions.filter((t) => t.kind === 'step.failed');
            expect(failures).to.have.length(2);
            expect(failures[1].payload!.willRetry).to.equal(false);
            expect(transitions.some((t) => t.kind === 'run.failed')).to.equal(true);

            const finalInstance = await mgr.getWorkflowInstance(instance.id);
            expect(finalInstance!.status).to.equal('failed');
        });

        it('fires step.expired when a step timeout is processed', async function () {
            const transitions: WorkflowTransition[] = [];
            const mgr = makeManager(makeAssignmentTrackingHost(), { onWorkflowEvent: (t: WorkflowTransition) => transitions.push(t) });
            await mgr.registerWorkflow({ ...linearDef, id: 'runs-timeout', steps: [{ ...linearDef.steps[0], timeoutMs: 30000 }] });
            const instance = await mgr.startWorkflow('runs-timeout', 'u1');

            // Force the already-armed timeout to be due now instead of waiting 30s in real time.
            await redisClient.zAdd(keys.workflowStepExpiryIndex(), {
                score: Date.now() - 1,
                value: `${instance.id}|s1`,
            });

            const expiredCount = await mgr.processExpiredWorkflowSteps();
            expect(expiredCount).to.equal(1);

            // processExpiredWorkflowSteps only publishes the EXPIRED event; the
            // transition (and its emitTransition call) fires once it's drained.
            await mgr.processWorkflowEvents(10);
            expect(transitions.some((t) => t.kind === 'step.expired')).to.equal(true);
        });
    });

    describe('external steps', function () {
        it('rejects registration when an external step has no timeout anywhere', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            const noTimeout: WorkflowDefinition = {
                id: 'runs-ext-no-timeout',
                name: 'No Timeout',
                version: 1,
                initialStepId: 'ext1',
                steps: [{ id: 'ext1', name: 'Ext', taskType: 'external', external: { name: 'do-thing' }, defaultNextStepId: null }],
            };

            let error: Error | undefined;
            try {
                await mgr.registerWorkflow(noTimeout);
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/requires a timeoutMs/);
        });

        it('rejects registration when an external step has no external.name', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            const noName: WorkflowDefinition = {
                id: 'runs-ext-no-name',
                name: 'No Name',
                version: 1,
                initialStepId: 'ext1',
                defaultTimeoutMs: 1000,
                steps: [{ id: 'ext1', name: 'Ext', taskType: 'external', defaultNextStepId: null }],
            };

            let error: Error | undefined;
            try {
                await mgr.registerWorkflow(noName);
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/external\.name/);
        });

        it('advances via routing when completeWorkflowStep succeeds with matching result data', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(externalDef);
            const instance = await mgr.startWorkflow(externalDef.id, 'u1');

            await mgr.completeWorkflowStep(instance.id, 'ext1', { success: true, data: { approved: false } });
            await mgr.processWorkflowEvents(10);

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated!.currentStepId).to.equal('rejected');
        });

        it('fails the step when completeWorkflowStep is called with success: false', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow({ ...externalDef, id: 'runs-ext-fail', steps: [{ ...externalDef.steps[0], maxRetries: 0 }, ...externalDef.steps.slice(1)] });
            const instance = await mgr.startWorkflow('runs-ext-fail', 'u1');

            await mgr.completeWorkflowStep(instance.id, 'ext1', { success: false, error: 'nope' });
            await mgr.processWorkflowEvents(10);

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated!.status).to.equal('failed');
        });

        it('clears the step timeout entry so it cannot also fire as an expiry', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(externalDef);
            const instance = await mgr.startWorkflow(externalDef.id, 'u1');

            await mgr.completeWorkflowStep(instance.id, 'ext1', { success: true, data: { approved: true } });

            const member = await redisClient.zScore(keys.workflowStepExpiryIndex(), `${instance.id}|ext1`);
            expect(member).to.be.null;
        });

        it('throws when completing a step that is not the run\'s current step', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(externalDef);
            const instance = await mgr.startWorkflow(externalDef.id, 'u1');

            let error: Error | undefined;
            try {
                await mgr.completeWorkflowStep(instance.id, 'approved', { success: true });
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/not currently active/);
        });

        it('throws when completing a step that is not an external step', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);
            const instance = await mgr.startWorkflow(linearDef.id, 'u1');

            let error: Error | undefined;
            try {
                await mgr.completeWorkflowStep(instance.id, 's1', { success: true });
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/not an external step/);
        });

        it('throws when the instance does not exist or is not active', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(externalDef);
            const instance = await mgr.startWorkflow(externalDef.id, 'u1');

            let missingError: Error | undefined;
            try {
                await mgr.completeWorkflowStep('does-not-exist', 'ext1', { success: true });
            } catch (err) {
                missingError = err as Error;
            }
            expect(missingError?.message).to.match(/not found/);

            await mgr.cancelWorkflow(instance.id);
            let inactiveError: Error | undefined;
            try {
                await mgr.completeWorkflowStep(instance.id, 'ext1', { success: true });
            } catch (err) {
                inactiveError = err as Error;
            }
            expect(inactiveError?.message).to.match(/not active/);
        });

        it('only advances a parallel join once both an external and an assignment branch resolve', async function () {
            const parallelDef: WorkflowDefinition = {
                id: 'runs-ext-parallel',
                name: 'External Parallel',
                version: 1,
                initialStepId: 'fanout',
                steps: [
                    {
                        id: 'fanout',
                        name: 'Fanout',
                        assignmentTemplate: { tags: ['fanout'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['branchA', 'branchB'],
                    },
                    {
                        id: 'branchA',
                        name: 'Branch A',
                        taskType: 'external',
                        external: { name: 'ext-a' },
                        timeoutMs: 30000,
                        defaultNextStepId: 'join',
                    },
                    { id: 'branchB', name: 'Branch B', assignmentTemplate: { tags: ['b'] }, targetUser: 'initiator', defaultNextStepId: 'join' },
                    { id: 'join', name: 'Join', assignmentTemplate: { tags: ['j'] }, targetUser: 'initiator', defaultNextStepId: null },
                ],
            };
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(parallelDef);
            const instance = await mgr.startWorkflow(parallelDef.id, 'u1');

            const afterA = await mgr.getWorkflowInstance(instance.id);
            const branchB = afterA!.parallelBranches!.find((b) => b.stepId === 'branchB')!;

            await mgr.completeWorkflowStep(instance.id, 'branchA', { success: true });
            await mgr.processWorkflowEvents(10);
            let mid = await mgr.getWorkflowInstance(instance.id);
            expect(mid!.currentStepId).to.be.null;
            expect(mid!.status).to.equal('active');

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-b',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: branchB.assignmentId,
                workflowInstanceId: instance.id,
                stepId: 'branchB',
                timestamp: Date.now(),
            });

            mid = await mgr.getWorkflowInstance(instance.id);
            expect(mid!.currentStepId).to.equal('join');
        });
    });

    describe('processWorkflowEvents (non-blocking drain)', function () {
        it('returns 0 without reading the stream when workflows are disabled', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost(), { enableWorkflows: false });
            const processed = await mgr.processWorkflowEvents();
            expect(processed).to.equal(0);
        });

        it('drains up to maxEvents per call, leaving the rest for the next call', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());

            // No matching instance: processWorkflowEvent no-ops successfully for
            // each (rather than erroring), so every drained event still counts
            // as "processed" — this isolates the maxEvents cap itself.
            for (let i = 0; i < 3; i++) {
                await mgr.publishWorkflowEvent({
                    eventId: `evt-${i}`,
                    type: 'FAILED',
                    userId: 'u1',
                    assignmentId: 'no-such-assignment',
                    workflowInstanceId: 'no-such-instance',
                    stepId: 's1',
                    timestamp: Date.now(),
                });
            }

            const firstBatch = await mgr.processWorkflowEvents(2);
            expect(firstBatch).to.equal(2);

            const secondBatch = await mgr.processWorkflowEvents(2);
            expect(secondBatch).to.equal(1);

            const thirdBatch = await mgr.processWorkflowEvents(2);
            expect(thirdBatch).to.equal(0);
        });

        it('processes an event published via completeWorkflowStep exactly once (idempotent re-drain)', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(externalDef);
            const instance = await mgr.startWorkflow(externalDef.id, 'u1');
            await mgr.processWorkflowEvents(10); // drain the run.started event published by startWorkflow

            await mgr.completeWorkflowStep(instance.id, 'ext1', { success: true, data: { approved: true } });

            const firstDrain = await mgr.processWorkflowEvents(10);
            expect(firstDrain).to.equal(1);

            const secondDrain = await mgr.processWorkflowEvents(10);
            expect(secondDrain).to.equal(0);
        });
    });

    describe('cancelWorkflow cleanup', function () {
        it('removes the current single-step assignment, its workflow link, and its armed timeout', async function () {
            const host = makeAssignmentTrackingHost();
            const mgr = makeManager(host);
            const timedDef: WorkflowDefinition = {
                ...linearDef,
                id: 'runs-cancel-timed',
                steps: [{ ...linearDef.steps[0], timeoutMs: 30000 }],
            };
            await mgr.registerWorkflow(timedDef);
            const instance = await mgr.startWorkflow(timedDef.id, 'u1');

            expect(await redisClient.exists(keys.workflowStepExpiry(instance.id, 's1'))).to.equal(1);

            await mgr.cancelWorkflow(instance.id);

            expect(host.removed).to.deep.equal([instance.currentAssignmentId]);
            const link = await redisClient.get(keys.workflowAssignmentLink(instance.currentAssignmentId!));
            expect(link).to.be.null;
            expect(await redisClient.exists(keys.workflowStepExpiry(instance.id, 's1'))).to.equal(0);
            expect(await redisClient.zScore(keys.workflowStepExpiryIndex(), `${instance.id}|s1`)).to.be.null;
        });

        it('removes only still-pending parallel branch assignments, not completed ones', async function () {
            const host = makeAssignmentTrackingHost();
            const mgr = makeManager(host);
            const def: WorkflowDefinition = {
                id: 'runs-cancel-parallel',
                name: 'Cancel Parallel',
                version: 1,
                initialStepId: 'fanout',
                steps: [
                    {
                        id: 'fanout',
                        name: 'Fanout',
                        assignmentTemplate: { tags: ['fanout'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['a', 'b'],
                    },
                    { id: 'a', name: 'A', assignmentTemplate: { tags: ['a'] }, targetUser: 'initiator', defaultNextStepId: 'join' },
                    { id: 'b', name: 'B', assignmentTemplate: { tags: ['b'] }, targetUser: 'initiator', defaultNextStepId: 'join' },
                    { id: 'join', name: 'Join', assignmentTemplate: { tags: ['j'] }, targetUser: 'initiator', defaultNextStepId: null },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            const branches = (await mgr.getWorkflowInstance(instance.id))!.parallelBranches!;
            const branchA = branches.find((b) => b.stepId === 'a')!;
            const branchB = branches.find((b) => b.stepId === 'b')!;

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-a',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: branchA.assignmentId,
                workflowInstanceId: instance.id,
                stepId: 'a',
                timestamp: Date.now(),
            });

            await mgr.cancelWorkflow(instance.id);

            expect(host.removed).to.deep.equal([branchB.assignmentId]);
        });

        it('succeeds without cleanup when the host does not implement removeAssignment', async function () {
            const bareHost: WorkflowHost = {
                async addAssignment(assignment: Assignment) {
                    return assignment;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };
            const mgr = makeManager(bareHost);
            await mgr.registerWorkflow(linearDef);
            const instance = await mgr.startWorkflow(linearDef.id, 'u1');

            const result = await mgr.cancelWorkflow(instance.id);
            expect(result).to.equal(true);
            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated!.status).to.equal('cancelled');
        });

        it('emits run.cancelled', async function () {
            const transitions: WorkflowTransition[] = [];
            const mgr = makeManager(makeAssignmentTrackingHost(), { onWorkflowEvent: (t: WorkflowTransition) => transitions.push(t) });
            await mgr.registerWorkflow(linearDef);
            const instance = await mgr.startWorkflow(linearDef.id, 'u1');

            await mgr.cancelWorkflow(instance.id);

            expect(transitions.some((t) => t.kind === 'run.cancelled')).to.equal(true);
        });
    });

    describe('initiator validation guard', function () {
        it('rejects starting a run when the initiator is unknown to a host that reports existence', async function () {
            const host: WorkflowHost & { userExists(userId: string): Promise<boolean> } = {
                ...makeAssignmentTrackingHost(),
                async userExists(userId: string) {
                    return userId === 'known-user';
                },
            };
            const mgr = makeManager(host);
            await mgr.registerWorkflow(linearDef);

            let error: Error | undefined;
            try {
                await mgr.startWorkflow(linearDef.id, 'unknown-user');
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/Initiator user not found/);
        });

        it('allows starting a run when the initiator is known', async function () {
            const host: WorkflowHost & { userExists(userId: string): Promise<boolean> } = {
                ...makeAssignmentTrackingHost(),
                async userExists(userId: string) {
                    return userId === 'known-user';
                },
            };
            const mgr = makeManager(host);
            await mgr.registerWorkflow(linearDef);

            const instance = await mgr.startWorkflow(linearDef.id, 'known-user');
            expect(instance.status).to.equal('active');
        });

        it('does not require an initiator for an all-external workflow (external steps have no target)', async function () {
            const host: WorkflowHost & { userExists(userId: string): Promise<boolean> } = {
                ...makeAssignmentTrackingHost(),
                async userExists() {
                    return false; // no worker registered at all
                },
            };
            const mgr = makeManager(host);
            const allExternal: WorkflowDefinition = {
                id: 'runs-all-external',
                name: 'All External',
                version: 1,
                initialStepId: 'ext1',
                defaultTimeoutMs: 1000,
                steps: [{ id: 'ext1', name: 'Ext', taskType: 'external', external: { name: 'x' }, defaultNextStepId: null }],
            };
            await mgr.registerWorkflow(allExternal);

            const instance = await mgr.startWorkflow(allExternal.id, 'api');
            expect(instance.status).to.equal('active');
        });

        it('skips the check entirely when no step targets the initiator', async function () {
            const host: WorkflowHost & { userExists(userId: string): Promise<boolean> } = {
                ...makeAssignmentTrackingHost(),
                async userExists() {
                    return false;
                },
            };
            const mgr = makeManager(host);
            const taggedDef: WorkflowDefinition = {
                ...linearDef,
                id: 'runs-tag-targeted',
                steps: [{ ...linearDef.steps[0], targetUser: { tag: 'reviewers' } }],
            };
            await mgr.registerWorkflow(taggedDef);

            const instance = await mgr.startWorkflow(taggedDef.id, 'whoever-started-it');
            expect(instance.status).to.equal('active');
        });
    });

    describe('listWorkflowInstances pagination edge cases', function () {
        it('keeps scanning across multiple index batches when a page of candidates is entirely filtered out', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow({ ...linearDef, id: 'runs-page-target' });
            await mgr.registerWorkflow({ ...linearDef, id: 'runs-page-noise' });

            // Oldest: the one instance that will match the filter.
            const target = await mgr.startWorkflow('runs-page-target', 'u1');
            // 20 newer instances (scanBatchSize for limit:1 is max(1*2,20)=20) that all get filtered out,
            // forcing the scan loop to fetch a second batch instead of finding a match in the first.
            for (let i = 0; i < 20; i++) {
                await mgr.startWorkflow('runs-page-noise', `noise-${i}`);
            }

            const page = await mgr.listWorkflowInstances({ workflowDefinitionId: 'runs-page-target', limit: 1 });
            expect(page.instances.map((i) => i.id)).to.deep.equal([target.id]);
        });

        it('skips a byTime entry whose instance record no longer exists', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);
            const real = await mgr.startWorkflow(linearDef.id, 'u1');
            await redisClient.zAdd(keys.workflowInstancesByTime(), { score: Date.now(), value: 'ghost-instance' });

            const page = await mgr.listWorkflowInstances();
            expect(page.instances.map((i) => i.id)).to.deep.equal([real.id]);
        });
    });

    describe('getWorkflowInstanceWithSnapshot', function () {
        it('resolves an undefined definition when no snapshot exists and the stored definition was deleted', async function () {
            const noSnapReliability = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 2,
                workflowIdempotencyTtlMs: 60000,
                workflowCircuitBreakerThreshold: 5,
                workflowCircuitBreakerResetMs: 30000,
                workflowAuditEnabled: false,
                workflowSnapshotDefinitions: false,
                streamConsumerName: 'runs-consumer',
            });
            const mgr = makeManager(makeAssignmentTrackingHost(), {}, noSnapReliability);
            const def: WorkflowDefinition = { ...linearDef, id: 'runs-no-snapshot' };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            await mgr.deleteWorkflowDefinition(def.id);

            const withSnapshot = await mgr.getWorkflowInstanceWithSnapshot(instance.id);
            expect(withSnapshot!.resolvedDefinition).to.be.undefined;
        });
    });

    describe('createWorkflowAssignment target-user defaults', function () {
        it('defaults an omitted targetUser to the initiator', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            const def: WorkflowDefinition = {
                ...linearDef,
                id: 'runs-default-target',
                steps: [{ id: 's1', name: 'S1', assignmentTemplate: { tags: ['t1'] }, defaultNextStepId: null }],
            };
            await mgr.registerWorkflow(def);

            const instance = await mgr.startWorkflow(def.id, 'u1');
            expect(instance.currentAssignmentId).to.be.a('string');
        });

        it('falls back to the initiator when targeting "previous" with no history yet', async function () {
            const host = makeAssignmentTrackingHost();
            const mgr = makeManager(host);
            const def: WorkflowDefinition = {
                ...linearDef,
                id: 'runs-previous-empty-history',
                steps: [{ id: 's1', name: 'S1', assignmentTemplate: { tags: ['t1'] }, targetUser: 'previous', defaultNextStepId: null }],
            };
            await mgr.registerWorkflow(def);

            await mgr.startWorkflow(def.id, 'u1');
            expect(host.created[0]._targetUserId).to.equal('u1');
        });
    });

    describe('runtime defensive checks bypassed by direct definition injection', function () {
        // normalizeWorkflowDefinition rejects these at registerWorkflow() time; these
        // tests bypass it (writing the definition straight into Redis, as the
        // pre-existing "missing machine handler" test in workflow_manager.test.ts
        // does) to exercise the matching runtime guard as defense in depth.
        async function injectRawDefinition(def: WorkflowDefinition) {
            await redisClient.set(keys.workflowDefinition(def.id), JSON.stringify(def));
            await redisClient.hSet(keys.workflowDefinitions(), def.id, def.name);
        }

        it('throws at start time if an external step slipped through without external.name', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await injectRawDefinition({
                id: 'runs-raw-ext-no-name',
                name: 'Raw',
                version: 1,
                initialStepId: 'ext1',
                steps: [{ id: 'ext1', name: 'Ext', taskType: 'external', timeoutMs: 1000, defaultNextStepId: null }],
            });

            let error: Error | undefined;
            try {
                await mgr.startWorkflow('runs-raw-ext-no-name', 'u1');
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/external\.name/);
        });

        it('throws at start time if an external step slipped through without any timeout', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await injectRawDefinition({
                id: 'runs-raw-ext-no-timeout',
                name: 'Raw',
                version: 1,
                initialStepId: 'ext1',
                steps: [{ id: 'ext1', name: 'Ext', taskType: 'external', external: { name: 'x' }, defaultNextStepId: null }],
            });

            let error: Error | undefined;
            try {
                await mgr.startWorkflow('runs-raw-ext-no-timeout', 'u1');
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/requires a timeoutMs/);
        });
    });

    describe('processWorkflowEvents error handling', function () {
        it('defaults maxEvents from eventBatchSize when called with no argument', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost(), { eventBatchSize: 5 });
            const processed = await mgr.processWorkflowEvents();
            expect(processed).to.equal(0);
        });

        it('acks and skips a redelivered event whose eventId was already marked processed', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);
            const instance = await mgr.startWorkflow(linearDef.id, 'u1');
            await mgr.processWorkflowEvents(10); // drain run.started

            const event = {
                eventId: 'evt-dup',
                type: 'COMPLETED' as const,
                userId: 'u1',
                assignmentId: instance.currentAssignmentId!,
                workflowInstanceId: instance.id,
                stepId: 's1',
                timestamp: Date.now(),
            };
            await mgr.publishWorkflowEvent(event);
            expect(await mgr.processWorkflowEvents(10)).to.equal(1);

            // Redeliver the same eventId as a brand-new stream message.
            await mgr.publishWorkflowEvent(event);
            expect(await mgr.processWorkflowEvents(10)).to.equal(0);
        });

        it('records a retry count on failure, then moves the event to the DLQ once retries are exhausted', async function () {
            const localReliability = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 1,
                workflowIdempotencyTtlMs: 60000,
                workflowCircuitBreakerThreshold: 50,
                workflowCircuitBreakerResetMs: 30000,
                workflowAuditEnabled: false,
                streamConsumerName: 'runs-consumer',
            });
            const consoleStub = sinon.stub(console, 'error');
            const host: WorkflowHost = {
                async addAssignment(a: Assignment) {
                    if (a.tags?.includes('boom')) throw new Error('forced failure');
                    return a;
                },
                async matchUsersAssignments() {
                    return [];
                },
            };
            const mgr = makeManager(host, {}, localReliability);
            const def: WorkflowDefinition = {
                id: 'runs-drain-err',
                name: 'DrainErr',
                version: 1,
                initialStepId: 's1',
                steps: [
                    { id: 's1', name: 'S1', assignmentTemplate: { tags: ['s1'] }, targetUser: 'initiator', defaultNextStepId: 's2' },
                    { id: 's2', name: 'S2', assignmentTemplate: { tags: ['boom'] }, targetUser: 'initiator', defaultNextStepId: null },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            await mgr.processWorkflowEvents(10); // drain run.started

            try {
                const completeEvent = {
                    eventId: 'evt-boom',
                    type: 'COMPLETED' as const,
                    userId: 'u1',
                    assignmentId: instance.currentAssignmentId!,
                    workflowInstanceId: instance.id,
                    stepId: 's1',
                    timestamp: Date.now(),
                };
                await mgr.publishWorkflowEvent(completeEvent);
                expect(await mgr.processWorkflowEvents(10)).to.equal(0);
                expect(await redisClient.get(keys.eventRetryCount('evt-boom'))).to.equal('1');

                await mgr.publishWorkflowEvent(completeEvent);
                expect(await mgr.processWorkflowEvents(10)).to.equal(0);

                const metrics = await mgr.getWorkflowMetrics();
                expect(metrics.deadLetterQueueSize).to.equal(1);
            } finally {
                consoleStub.restore();
            }
        });

        it('recovers by recreating the consumer group after a NOGROUP read error', async function () {
            const consoleStub = sinon.stub(console, 'error');
            const xReadGroupStub = sinon.stub(redisClient, 'xReadGroup').callThrough();
            xReadGroupStub.onFirstCall().rejects(new Error('NOGROUP No such key or consumer group'));

            try {
                const mgr = makeManager(makeAssignmentTrackingHost());
                await mgr.registerWorkflow(linearDef);
                await mgr.startWorkflow(linearDef.id, 'u1');

                const processed = await mgr.processWorkflowEvents(10);
                expect(processed).to.equal(0);

                // The group was transparently recreated; a normal drain works again.
                const secondDrain = await mgr.processWorkflowEvents(10);
                expect(secondDrain).to.equal(1); // the run.started event, now readable
            } finally {
                xReadGroupStub.restore();
                consoleStub.restore();
            }
        });
    });

    describe('backfillWorkflowIndexes', function () {
        it('reindexes legacy instance records into the byTime and active indexes', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);
            const active = await mgr.startWorkflow(linearDef.id, 'u1');
            const cancelled = await mgr.startWorkflow(linearDef.id, 'u2');
            await mgr.cancelWorkflow(cancelled.id);

            // Simulate legacy records: wipe both indexes, keep the registry hash.
            await redisClient.del(keys.workflowInstancesByTime());
            await redisClient.del(keys.workflowInstancesActive());

            const indexed = await mgr.backfillWorkflowIndexes();
            expect(indexed).to.equal(1); // only the active one counts toward the active index

            // Both instances are back in the byTime index for listing.
            const page = await mgr.listWorkflowInstances({ limit: 10 });
            expect(page.instances.map((i) => i.id).sort()).to.deep.equal([active.id, cancelled.id].sort());
        });
    });

    describe('getActiveWorkflowsForUser', function () {
        it('returns an empty array for a user with no workflow instances', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            const result = await mgr.getActiveWorkflowsForUser('nobody');
            expect(result).to.deep.equal([]);
        });
    });

    describe('machine steps via the host executeMachineTask fallback', function () {
        it('runs a machine step through host.executeMachineTask when no named handler is registered', async function () {
            const host = {
                ...makeAssignmentTrackingHost(),
                async executeMachineTask() {
                    return { computed: 42 };
                },
            };
            const mgr = makeManager(host);
            const def: WorkflowDefinition = {
                id: 'runs-machine-host',
                name: 'Machine Host',
                version: 1,
                initialStepId: 'm1',
                steps: [
                    { id: 'm1', name: 'M1', taskType: 'machine', machineTask: { handler: 'unregistered' }, defaultNextStepId: null },
                ],
            };
            await mgr.registerWorkflow(def);

            const instance = await mgr.startWorkflow(def.id, 'u1');
            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated!.status).to.equal('completed');
            expect(updated!.context.step_m1).to.deep.equal({ computed: 42 });
        });
    });

    describe('completeWorkflowStep without a definition snapshot', function () {
        it('resolves the live definition to validate an external step when snapshots are disabled', async function () {
            const noSnapReliability = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 2,
                workflowIdempotencyTtlMs: 60000,
                workflowCircuitBreakerThreshold: 5,
                workflowCircuitBreakerResetMs: 30000,
                workflowAuditEnabled: false,
                workflowSnapshotDefinitions: false,
                streamConsumerName: 'runs-consumer',
            });
            const mgr = makeManager(makeAssignmentTrackingHost(), {}, noSnapReliability);
            await mgr.registerWorkflow(externalDef);
            const instance = await mgr.startWorkflow(externalDef.id, 'u1');

            const ok = await mgr.completeWorkflowStep(instance.id, 'ext1', { success: true, data: { approved: true } });
            expect(ok).to.equal(true);
            await mgr.processWorkflowEvents(10);

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated!.currentStepId).to.equal('approved');
        });
    });

    describe('handleStepFailure edge cases', function () {
        it('ignores a FAILED event for a stepId that is not part of the definition', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            await mgr.registerWorkflow(linearDef);
            const instance = await mgr.startWorkflow(linearDef.id, 'u1');

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-bogus-step',
                type: 'FAILED',
                userId: 'u1',
                assignmentId: instance.currentAssignmentId,
                workflowInstanceId: instance.id,
                stepId: 'no-such-step',
                timestamp: Date.now(),
            });

            const unchanged = await mgr.getWorkflowInstance(instance.id);
            expect(unchanged!.status).to.equal('active');
        });

        it('falls through to top-level retry logic for an unrecognized parallel failurePolicy', async function () {
            const mgr = makeManager(makeAssignmentTrackingHost());
            const def: WorkflowDefinition = {
                id: 'runs-unknown-policy',
                name: 'Unknown Policy',
                version: 1,
                initialStepId: 'fanout',
                steps: [
                    {
                        id: 'fanout',
                        name: 'Fanout',
                        assignmentTemplate: { tags: ['fanout'] },
                        targetUser: 'initiator',
                        parallelStepIds: ['a', 'b'],
                    },
                    {
                        id: 'a',
                        name: 'A',
                        assignmentTemplate: { tags: ['a'] },
                        targetUser: 'initiator',
                        failurePolicy: 'retry' as any,
                        maxRetries: 0,
                        defaultNextStepId: null,
                    },
                    { id: 'b', name: 'B', assignmentTemplate: { tags: ['b'] }, targetUser: 'initiator', defaultNextStepId: null },
                ],
            };
            await mgr.registerWorkflow(def);
            const instance = await mgr.startWorkflow(def.id, 'u1');
            const branchA = (await mgr.getWorkflowInstance(instance.id))!.parallelBranches!.find((b) => b.stepId === 'a')!;

            await (mgr as any).processWorkflowEvent({
                eventId: 'evt-a-fail',
                type: 'FAILED',
                userId: 'u1',
                assignmentId: branchA.assignmentId,
                workflowInstanceId: instance.id,
                stepId: 'a',
                timestamp: Date.now(),
            });

            const updated = await mgr.getWorkflowInstance(instance.id);
            expect(updated!.status).to.equal('failed');
        });
    });
});
