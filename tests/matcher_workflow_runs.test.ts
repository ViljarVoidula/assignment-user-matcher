import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import { createKeyBuilders } from '../src/utils/keys';
import type { WorkflowDefinition, WorkflowTransition } from '../src/types/matcher';

/**
 * End-to-end exercise of the platform-facing "runs" surface through the public
 * AssignmentMatcher facade — the exact path the platform's API/worker will use:
 * start a run, let real matching route its step to a worker, complete it and
 * watch the workflow advance, then list/cancel runs and drive an external
 * (callback) step. Black-box through the facade, not the manager internals.
 */
describe('Workflow runs through the facade', function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;
    const transitions: WorkflowTransition[] = [];

    before(async function () {
        redisClient = await createTestClient().connect();
        matcher = new Matcher(redisClient, {
            enableWorkflows: true,
            matchExpirationMs: 60000,
            onWorkflowEvent: (t) => transitions.push(t),
        });
        await matcher.redisClient.flushDb();
    });

    beforeEach(function () {
        transitions.length = 0;
    });

    after(async function () {
        await matcher.redisClient.flushDb();
        await redisClient.quit();
    });

    const twoStepDef: WorkflowDefinition = {
        id: 'facade-two-step',
        name: 'Two Step',
        version: 1,
        initialStepId: 'step-1',
        steps: [
            {
                id: 'step-1',
                name: 'First',
                assignmentTemplate: { tags: ['onboarding'] },
                targetUser: 'initiator',
                defaultNextStepId: 'step-2',
            },
            {
                id: 'step-2',
                name: 'Second',
                assignmentTemplate: { tags: ['onboarding'] },
                targetUser: 'initiator',
                defaultNextStepId: null,
            },
        ],
    };

    it('rejects starting a run for an initiator that is not a registered worker', async function () {
        await matcher.registerWorkflow(twoStepDef);

        let error: Error | undefined;
        try {
            await matcher.startWorkflow(twoStepDef.id, 'ghost-initiator');
        } catch (err) {
            error = err as Error;
        }
        expect(error?.message).to.match(/Initiator user not found/);
    });

    it('advances a run to its next step when the current step is accepted and completed', async function () {
        await matcher.addUser({ id: 'worker-1', tags: ['onboarding'] });
        await matcher.registerWorkflow(twoStepDef);

        const run = await matcher.startWorkflow(twoStepDef.id, 'worker-1');
        const firstAssignmentId = run.currentAssignmentId!;

        // The workflow-targeted assignment lands on worker-1 via real matching.
        await matcher.matchUsersAssignments('worker-1');
        await matcher.acceptAssignment('worker-1', firstAssignmentId);
        await matcher.completeAssignment('worker-1', firstAssignmentId, { success: true, data: {} });

        // completeAssignment publishes a COMPLETED workflow event; drain it.
        await matcher.processWorkflowEvents(10);

        const advanced = await matcher.getWorkflowInstance(run.id);
        expect(advanced!.currentStepId).to.equal('step-2');
        expect(transitions.some((t) => t.kind === 'run.started')).to.equal(true);
        expect(transitions.some((t) => t.kind === 'step.completed')).to.equal(true);
    });

    it('lists runs newest-first and reports whether a worker is registered', async function () {
        await matcher.addUser({ id: 'worker-2', tags: ['onboarding'] });
        await matcher.registerWorkflow({ ...twoStepDef, id: 'facade-list-def' });

        const runA = await matcher.startWorkflow('facade-list-def', 'worker-2');
        const runB = await matcher.startWorkflow('facade-list-def', 'worker-2');

        const page = await matcher.listWorkflowInstances({ workflowDefinitionId: 'facade-list-def', limit: 10 });
        expect(page.instances.map((i) => i.id).slice(0, 2)).to.deep.equal([runB.id, runA.id]);

        expect(await matcher.userExists('worker-2')).to.equal(true);
        expect(await matcher.userExists('nobody')).to.equal(false);
    });

    it('completes an external step through the facade and advances the run', async function () {
        await matcher.addUser({ id: 'worker-3', tags: ['x'] });
        const externalDef: WorkflowDefinition = {
            id: 'facade-external',
            name: 'External',
            version: 1,
            initialStepId: 'ext',
            defaultTimeoutMs: 30000,
            steps: [
                {
                    id: 'ext',
                    name: 'Callback',
                    taskType: 'external',
                    external: { name: 'do-it' },
                    defaultNextStepId: 'finish',
                },
                {
                    id: 'finish',
                    name: 'Finish',
                    assignmentTemplate: { tags: ['x'] },
                    targetUser: 'initiator',
                    defaultNextStepId: null,
                },
            ],
        };
        await matcher.registerWorkflow(externalDef);
        const run = await matcher.startWorkflow(externalDef.id, 'worker-3');

        const ready = transitions.find((t) => t.kind === 'step.ready');
        expect(ready?.payload).to.deep.equal({ name: 'do-it', input: undefined });

        await matcher.completeWorkflowStep(run.id, 'ext', { success: true, data: { ok: true } });
        await matcher.processWorkflowEvents(10);

        const advanced = await matcher.getWorkflowInstance(run.id);
        expect(advanced!.currentStepId).to.equal('finish');
    });

    it('exposes workflow operational methods through the facade', async function () {
        await matcher.addUser({ id: 'worker-ops', tags: ['onboarding'] });
        await matcher.registerWorkflow({ ...twoStepDef, id: 'facade-ops-def' });

        // registerMachineHandler + a machine-step run flowing through it
        matcher.registerMachineHandler('noop', async () => ({ done: true }));

        const run = await matcher.startWorkflow('facade-ops-def', 'worker-ops');
        expect(await matcher.getWorkflowInstance(run.id)).to.not.be.null;

        // Metrics reflect at least one active instance
        const metrics = await matcher.getWorkflowMetrics();
        expect(metrics.activeInstances).to.be.greaterThan(0);

        // These maintenance delegates run cleanly and return numbers
        expect(await matcher.drainScheduledRetries()).to.be.a('number');
        expect(await matcher.backfillWorkflowIndexes()).to.be.a('number');
        expect(await matcher.pruneWorkflowInstances(0)).to.be.a('number');

        // deleteWorkflowDefinition removes the definition but leaves in-flight runs
        expect(await matcher.deleteWorkflowDefinition('facade-ops-def')).to.equal(true);
        expect(await matcher.deleteWorkflowDefinition('facade-ops-def')).to.equal(false);
        expect(await matcher.getWorkflowInstance(run.id)).to.not.be.null;
    });

    it('publishes an EXPIRED workflow event and requeues when a pending match expires', async function () {
        const keys = createKeyBuilders({ prefix: '' });
        await matcher.addUser({ id: 'exp-worker', tags: ['exp'] });
        await matcher.addAssignment({ id: 'exp-task', tags: ['exp'], priority: 10 });

        await matcher.matchUsersAssignments('exp-worker');
        expect(await matcher.getCurrentAssignmentsForUser('exp-worker')).to.include('exp-task');

        // Force the pending-match expiry into the past instead of waiting.
        await matcher.redisClient.zAdd(keys.pendingAssignmentsExpiry(), { score: Date.now() - 1000, value: 'exp-task' });

        const processed = await matcher.processExpiredMatches();
        expect(processed).to.equal(1);
        // Requeued back to the pool, no longer held by the worker.
        expect(await matcher.getCurrentAssignmentsForUser('exp-worker')).to.not.include('exp-task');
        const all = await matcher.getAllAssignments();
        expect(all.find((a) => a.id === 'exp-task')).to.not.be.undefined;
    });

    it('start/stop auto-release and idle intervals are idempotent and safe to call when inactive', function () {
        // stop before start: the no-op guard branch
        matcher.stopAutoReleaseInterval();
        matcher.stopIdleUserInterval();

        matcher.startAutoReleaseInterval(10000);
        matcher.startAutoReleaseInterval(10000); // second call is a no-op (already running)
        matcher.startIdleUserInterval(10000);
        matcher.startIdleUserInterval(10000);

        matcher.stopAutoReleaseInterval();
        matcher.stopIdleUserInterval();
    });

    it('cancels a run and cleans up its outstanding assignment', async function () {
        await matcher.addUser({ id: 'worker-4', tags: ['onboarding'] });
        await matcher.registerWorkflow({ ...twoStepDef, id: 'facade-cancel-def' });
        const run = await matcher.startWorkflow('facade-cancel-def', 'worker-4');
        const assignmentId = run.currentAssignmentId!;

        const cancelled = await matcher.cancelWorkflow(run.id);
        expect(cancelled).to.equal(true);

        const after = await matcher.getWorkflowInstance(run.id);
        expect(after!.status).to.equal('cancelled');
        // The outstanding queued assignment was removed by cancel cleanup.
        expect(await matcher.getAssignment(assignmentId)).to.be.null;
        expect(transitions.some((t) => t.kind === 'run.cancelled')).to.equal(true);
    });

    // Regression: targeted grants must go through the same queued→pending claim
    // as organic matching. Previously they only reached pending when tag
    // overlap happened to select them too — without overlap, accept "succeeded"
    // while storing nothing and complete then threw, wedging the run.
    it('claims a targeted step assignment even when the worker shares no tags with it', async function () {
        // Isolated matcher without default matching: nothing but the targeted
        // grant itself can move this assignment, which is the very case
        // deterministic targeting exists for.
        const isolated = new Matcher(redisClient, {
            redisPrefix: 'wfclaim:',
            enableWorkflows: true,
            enableDefaultMatching: false,
            matchExpirationMs: 60000,
        });
        await isolated.addUser({ id: 'approver-1', tags: ['approvals'] });
        await isolated.registerWorkflow({
            id: 'facade-no-overlap',
            name: 'No Overlap',
            version: 1,
            initialStepId: 'only',
            steps: [
                {
                    id: 'only',
                    name: 'Only',
                    assignmentTemplate: { tags: ['legal-review'] },
                    targetUser: 'initiator',
                    defaultNextStepId: null,
                },
            ],
        });
        const run = await isolated.startWorkflow('facade-no-overlap', 'approver-1');
        const assignmentId = run.currentAssignmentId!;

        await isolated.matchUsersAssignments('approver-1');
        expect(await isolated.getCurrentAssignmentsForUser('approver-1')).to.include(assignmentId);

        await isolated.acceptAssignment('approver-1', assignmentId);
        await isolated.completeAssignment('approver-1', assignmentId, { success: true, data: { approved: true } });
        await isolated.processWorkflowEvents(10);

        const done = await isolated.getWorkflowInstance(run.id);
        expect(done!.status).to.equal('completed');
    });

    it('does not re-grant a targeted assignment its worker already rejected', async function () {
        await matcher.addUser({ id: 'rejector-1', tags: ['approvals'] });
        await matcher.registerWorkflow({
            id: 'facade-reject-def',
            name: 'Reject',
            version: 1,
            initialStepId: 'only',
            steps: [
                {
                    id: 'only',
                    name: 'Only',
                    assignmentTemplate: { tags: ['legal-review'] },
                    targetUser: 'initiator',
                    defaultNextStepId: null,
                },
            ],
        });
        const run = await matcher.startWorkflow('facade-reject-def', 'rejector-1');
        const assignmentId = run.currentAssignmentId!;

        await matcher.matchUsersAssignments('rejector-1');
        await matcher.rejectAssignment('rejector-1', assignmentId);

        await matcher.matchUsersAssignments('rejector-1');
        expect(await matcher.getCurrentAssignmentsForUser('rejector-1')).to.not.include(assignmentId);
    });

    // The one person a step was aimed at saying no is, for the step, the end
    // of that attempt — not work quietly waiting in a queue nobody reads.
    it('fails the step when the person it was aimed at rejects the work', async function () {
        await matcher.addUser({ id: 'rejector-2', tags: ['approvals'] });
        await matcher.registerWorkflow({
            id: 'facade-reject-fails-def',
            name: 'Reject fails',
            initialStepId: 'only',
            steps: [{ id: 'only', name: 'Only', assignmentTemplate: { tags: ['legal-review'] }, targetUser: 'rejector-2' }],
        });
        const run = await matcher.startWorkflow('facade-reject-fails-def', 'rejector-2');
        const assignmentId = run.currentAssignmentId!;
        await matcher.matchUsersAssignments('rejector-2');
        await matcher.rejectAssignment('rejector-2', assignmentId);
        await drainWorkflowEvents();

        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('failed');
        expect(await matcher.getAssignment(assignmentId)).to.be.null;
    });

    it('keeps the step waiting when one of several eligible people rejects the work', async function () {
        await matcher.addUser({ id: 'pool-1', tags: ['pool'] });
        await matcher.addUser({ id: 'pool-2', tags: ['pool'] });
        await matcher.registerWorkflow({
            id: 'facade-reject-pool-def',
            name: 'Reject pool',
            initialStepId: 'only',
            steps: [{ id: 'only', name: 'Only', assignmentTemplate: { tags: ['pool'] }, targetUser: { tag: 'pool' } }],
        });
        const run = await matcher.startWorkflow('facade-reject-pool-def', 'pool-1');
        const assignmentId = run.currentAssignmentId!;
        await matcher.matchUsersAssignments('pool-1');
        await matcher.rejectAssignment('pool-1', assignmentId);
        await drainWorkflowEvents();
        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('active');

        await matcher.matchUsersAssignments('pool-2');
        await matcher.acceptAssignment('pool-2', assignmentId);
        await matcher.completeAssignment('pool-2', assignmentId);
        await drainWorkflowEvents();
        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');
    });

    /** Drain everything the orchestrator would consume. */
    async function drainWorkflowEvents() {
        for (let i = 0; i < 5; i++) await matcher.processWorkflowEvents(50);
    }

    // An unanswered offer is ordinary matching: the work is requeued for the
    // next person. It must not fail the step (or burn its retries); the step's
    // own timeoutMs is the workflow's clock.
    it('keeps a run active when an offer on its step lapses and the work is requeued', async function () {
        const keys = createKeyBuilders({ prefix: '' });
        await matcher.addUser({ id: 'lapse-1', tags: ['lapse'] });
        await matcher.addUser({ id: 'lapse-2', tags: ['lapse'] });
        await matcher.registerWorkflow({
            id: 'facade-lapse-def',
            name: 'Lapse',
            initialStepId: 'only',
            steps: [{ id: 'only', name: 'Only', assignmentTemplate: { tags: ['lapse'] }, targetUser: { tag: 'lapse' } }],
        });
        const run = await matcher.startWorkflow('facade-lapse-def', 'lapse-1');
        const assignmentId = run.currentAssignmentId!;
        await matcher.matchUsersAssignments('lapse-1');
        expect(await matcher.getCurrentAssignmentsForUser('lapse-1')).to.include(assignmentId);

        await matcher.redisClient.zAdd(keys.pendingAssignmentsExpiry(), { score: Date.now() - 1000, value: assignmentId });
        await matcher.processExpiredMatches();
        await drainWorkflowEvents();

        const after = await matcher.getWorkflowInstance(run.id);
        expect(after!.status).to.equal('active');
        expect(after!.currentAssignmentId).to.equal(assignmentId);
        expect(await matcher.getAssignment(assignmentId)).to.not.be.null;
        expect(
            transitions.some((t) => t.instance.id === run.id && (t.kind === 'step.failed' || t.kind === 'step.expired')),
        ).to.equal(false);

        // The requeued work can still finish the run.
        await matcher.matchUsersAssignments('lapse-2');
        await matcher.acceptAssignment('lapse-2', assignmentId);
        await matcher.completeAssignment('lapse-2', assignmentId);
        await drainWorkflowEvents();
        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');
    });

    it('keeps a run active when its step assignment is released from a worker', async function () {
        await matcher.addUser({ id: 'release-1', tags: ['release'] });
        await matcher.registerWorkflow({
            id: 'facade-release-def',
            name: 'Release',
            initialStepId: 'only',
            steps: [
                { id: 'only', name: 'Only', assignmentTemplate: { tags: ['release'] }, targetUser: { tag: 'release' } },
            ],
        });
        const run = await matcher.startWorkflow('facade-release-def', 'release-1');
        await matcher.matchUsersAssignments('release-1');
        expect(await matcher.releaseUserAssignments('release-1')).to.include(run.currentAssignmentId);
        await drainWorkflowEvents();

        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('active');
        expect(await matcher.getAssignment(run.currentAssignmentId!)).to.not.be.null;
    });

    // maxRetries is per step: retries spent on one step must not shrink the
    // next step's budget.
    it('gives every step its own retry budget', async function () {
        await matcher.addUser({ id: 'retry-1', tags: ['retry'] });
        await matcher.registerWorkflow({
            id: 'facade-retry-def',
            name: 'Retry',
            initialStepId: 'a',
            steps: [
                {
                    id: 'a',
                    name: 'A',
                    assignmentTemplate: { tags: ['retry'] },
                    targetUser: 'retry-1',
                    maxRetries: 1,
                    defaultNextStepId: 'b',
                },
                { id: 'b', name: 'B', assignmentTemplate: { tags: ['retry'] }, targetUser: 'retry-1', maxRetries: 1 },
            ],
        });
        const run = await matcher.startWorkflow('facade-retry-def', 'retry-1');
        const act = async (fail: boolean) => {
            const id = (await matcher.getWorkflowInstance(run.id))!.currentAssignmentId!;
            await matcher.matchUsersAssignments('retry-1');
            await matcher.acceptAssignment('retry-1', id);
            if (fail) await matcher.failAssignment('retry-1', id, 'boom');
            else await matcher.completeAssignment('retry-1', id);
            await drainWorkflowEvents();
        };

        await act(true); // a: first failure, retried
        await act(false); // a: done, on to b
        await act(true); // b: first failure — must retry, not fail the run

        const after = (await matcher.getWorkflowInstance(run.id))!;
        expect(after.status).to.equal('active');
        expect(after.currentStepId).to.equal('b');
        expect(after.retryCount).to.equal(1);

        await act(false);
        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');
    });

    it('does not cancel a run that has already ended', async function () {
        await matcher.registerWorkflow({
            id: 'facade-ended-def',
            name: 'Ended',
            initialStepId: 'cb',
            steps: [{ id: 'cb', name: 'Callback', taskType: 'external', external: { name: 'cb' }, timeoutMs: 60000 }],
        });
        const run = await matcher.startWorkflow('facade-ended-def', 'anyone');
        await matcher.completeWorkflowStep(run.id, 'cb', { success: true });
        await drainWorkflowEvents();
        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');

        transitions.length = 0;
        expect(await matcher.cancelWorkflow(run.id)).to.equal(false);
        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');
        expect(transitions.some((t) => t.kind === 'run.cancelled')).to.equal(false);
    });

    // waitForAll: false is a race — the first branch to finish moves the run
    // on, so the branches that lost must not leave live work behind.
    it('withdraws the losing branches when a waitForAll:false group advances', async function () {
        await matcher.addUser({ id: 'race-1', tags: ['race'] });
        await matcher.registerWorkflow({
            id: 'facade-race-def',
            name: 'Race',
            initialStepId: 'fork',
            steps: [
                { id: 'fork', name: 'Fork', assignmentTemplate: { tags: ['race'] }, parallelStepIds: ['left', 'right'] },
                {
                    id: 'left',
                    name: 'Left',
                    taskType: 'external',
                    external: { name: 'left' },
                    timeoutMs: 60000,
                    waitForAll: false,
                },
                {
                    id: 'right',
                    name: 'Right',
                    assignmentTemplate: { tags: ['race'] },
                    targetUser: 'race-1',
                    timeoutMs: 60000,
                    waitForAll: false,
                },
            ],
        });
        const run = await matcher.startWorkflow('facade-race-def', 'race-1');
        const started = (await matcher.getWorkflowInstance(run.id))!;
        const rightId = started.parallelBranches!.find((b) => b.stepId === 'right')!.assignmentId;
        expect(await matcher.getAssignment(rightId)).to.not.be.null;

        await matcher.completeWorkflowStep(run.id, 'left', { success: true });
        await drainWorkflowEvents();

        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');
        expect(await matcher.getAssignment(rightId)).to.be.null;
        const keys = createKeyBuilders({ prefix: '' });
        expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|right`)).to.be.null;
    });
    // Where a parallel group goes next is the fork's decision; it must not
    // depend on which branch happens to finish last.
    it('continues a parallel group from the fork step whatever order the branches finish in', async function () {
        const ext = (id: string, next?: string) => ({
            id,
            name: id,
            taskType: 'external' as const,
            external: { name: id },
            timeoutMs: 60000,
            ...(next ? { defaultNextStepId: next } : {}),
        });
        await matcher.registerWorkflow({
            id: 'facade-join-def',
            name: 'Join',
            initialStepId: 'fork',
            steps: [
                {
                    id: 'fork',
                    name: 'Fork',
                    assignmentTemplate: {},
                    parallelStepIds: ['a', 'b'],
                    defaultNextStepId: 'after',
                },
                ext('a'),
                ext('b', 'elsewhere'),
                ext('after'),
                ext('elsewhere'),
            ],
        });
        for (const order of [
            ['a', 'b'],
            ['b', 'a'],
        ]) {
            const run = await matcher.startWorkflow('facade-join-def', 'race-1');
            for (const stepId of order) await matcher.completeWorkflowStep(run.id, stepId, { success: true });
            await drainWorkflowEvents();
            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.status, order.join(',')).to.equal('active');
            expect(after.currentStepId, order.join(',')).to.equal('after');
        }
    });

    // A race that loops back into the group re-enters the losing branch's
    // step: withdrawing the old visit must not take the new visit's timeout.
    it('keeps the timeout of a branch the run re-entered after a waitForAll:false race', async function () {
        const keys = createKeyBuilders({ prefix: '' });
        await matcher.registerWorkflow({
            id: 'facade-rerace-def',
            name: 'Re-race',
            initialStepId: 'fork',
            steps: [
                { id: 'fork', name: 'Fork', assignmentTemplate: {}, parallelStepIds: ['left', 'right'] },
                {
                    id: 'left',
                    name: 'Left',
                    taskType: 'external',
                    external: { name: 'left' },
                    timeoutMs: 60000,
                    waitForAll: false,
                    defaultNextStepId: 'fork',
                },
                { id: 'right', name: 'Right', taskType: 'external', external: { name: 'right' }, timeoutMs: 60000 },
            ],
        });
        const run = await matcher.startWorkflow('facade-rerace-def', 'race-1');
        await matcher.completeWorkflowStep(run.id, 'left', { success: true });
        await drainWorkflowEvents();

        const after = (await matcher.getWorkflowInstance(run.id))!;
        expect(after.parallelBranches!.map((b) => [b.stepId, b.status])).to.deep.equal([
            ['left', 'pending'],
            ['right', 'pending'],
        ]);
        expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|right`)).to.not.be.null;
        expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|left`)).to.not.be.null;
        await matcher.cancelWorkflow(run.id);
    });

    it("targets 'previous' at the last person who did a step, across an escalation hop", async function () {
        const keys = createKeyBuilders({ prefix: '' });
        await matcher.addUser({ id: 'prev-1', tags: ['prev'] });
        await matcher.registerWorkflow({
            id: 'facade-previous-def',
            name: 'Previous',
            initialStepId: 'first',
            steps: [
                {
                    id: 'first',
                    name: 'First',
                    assignmentTemplate: { tags: ['prev'] },
                    targetUser: 'prev-1',
                    defaultNextStepId: 'wait',
                },
                {
                    id: 'wait',
                    name: 'Wait',
                    taskType: 'external',
                    external: { name: 'wait' },
                    timeoutMs: 60000,
                    onTimeoutStepId: 'follow-up',
                },
                {
                    id: 'follow-up',
                    name: 'Follow up',
                    assignmentTemplate: { tags: ['nobody-has-this'] },
                    targetUser: 'previous',
                },
            ],
        });
        const run = await matcher.startWorkflow('facade-previous-def', 'anyone');
        await matcher.matchUsersAssignments('prev-1');
        await matcher.acceptAssignment('prev-1', run.currentAssignmentId!);
        await matcher.completeAssignment('prev-1', run.currentAssignmentId!);
        await drainWorkflowEvents();

        await matcher.redisClient.zAdd(keys.workflowStepExpiryIndex(), {
            score: Date.now() - 1000,
            value: `${run.id}|wait`,
        });
        await matcher.processExpiredWorkflowSteps();
        await drainWorkflowEvents();

        const after = (await matcher.getWorkflowInstance(run.id))!;
        expect(after.currentStepId).to.equal('follow-up');
        const followUp = (await matcher.getAssignment(after.currentAssignmentId!)) as Record<string, any>;
        expect(followUp._targetUserId).to.equal('prev-1');
        await matcher.cancelWorkflow(run.id);
    });

    // The counterpart to the requeue case: a lapse that leaves nobody able to
    // take the work still reaches the step's failure path.
    it('fails the step when a lapse bars the one person the step was aimed at', async function () {
        const keys = createKeyBuilders({ prefix: '' });
        await matcher.addUser({ id: 'barred-1', tags: ['barred'] });
        await matcher.registerWorkflow({
            id: 'facade-barred-def',
            name: 'Barred',
            initialStepId: 'only',
            steps: [
                {
                    id: 'only',
                    name: 'Only',
                    assignmentTemplate: { tags: ['barred'], escalation: { respondWithinMs: 60000, onNoResponse: 'block' } },
                    targetUser: 'barred-1',
                },
            ],
        });
        const run = await matcher.startWorkflow('facade-barred-def', 'barred-1');
        const assignmentId = run.currentAssignmentId!;
        await matcher.matchUsersAssignments('barred-1');
        expect(await matcher.getCurrentAssignmentsForUser('barred-1')).to.include(assignmentId);

        await matcher.redisClient.zAdd(keys.pendingAssignmentsExpiry(), { score: Date.now() - 1000, value: assignmentId });
        await matcher.processExpiredMatches();
        await drainWorkflowEvents();

        expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('failed');
        expect(transitions.some((t) => t.kind === 'step.expired')).to.equal(true);
        expect(await matcher.getAssignment(assignmentId)).to.be.null;
    });
    // A step aimed at a named person is still ordinary queued work that tag
    // matching can hand to somebody else. Losing that claim must not leave the
    // named person with a copy of work another person holds.
    describe('work aimed at one person but won by another', function () {
        it('does not hand the target a copy of work somebody else claimed', async function () {
            await matcher.addUser({ id: 'aimed-1', tags: ['aimed-other'] });
            await matcher.addUser({ id: 'taker-1', tags: ['aimed'] });
            await matcher.registerWorkflow({
                id: 'facade-aimed-def',
                name: 'Aimed',
                initialStepId: 'only',
                steps: [{ id: 'only', name: 'Only', assignmentTemplate: { tags: ['aimed'] }, targetUser: 'aimed-1' }],
            });
            // The target is away when the step opens, so a colleague takes it.
            await matcher.pauseUser('aimed-1');
            const run = await matcher.startWorkflow('facade-aimed-def', 'aimed-1');
            const assignmentId = run.currentAssignmentId!;
            await matcher.matchUsersAssignments('taker-1');
            expect(await matcher.getCurrentAssignmentsForUser('taker-1')).to.include(assignmentId);
            await matcher.resumeUser('aimed-1');

            // The target's pass read the queue just before the colleague's
            // claim landed: it still lists the work, and loses the claim.
            const m = matcher as any;
            const original = m.getWorkflowTargetedAssignments;
            m.getWorkflowTargetedAssignments = async () => [{ id: assignmentId, priority: 1000, tags: 'aimed' }];
            try {
                await matcher.matchUsersAssignments('aimed-1');
            } finally {
                m.getWorkflowTargetedAssignments = original;
            }
            expect(await matcher.getCurrentAssignmentsForUser('aimed-1')).to.not.include(assignmentId);

            await matcher.acceptAssignment('taker-1', assignmentId);
            await matcher.completeAssignment('taker-1', assignmentId);
            await drainWorkflowEvents();
            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');
        });

        it("refuses an accept on a stale backlog entry and leaves the holder's work intact", async function () {
            const keys = createKeyBuilders({ prefix: '' });
            await matcher.addUser({ id: 'holder-1', tags: ['held'] });
            await matcher.addUser({ id: 'stale-1', tags: ['held-other'] });
            await matcher.addAssignment({ id: 'held-task', tags: ['held'], priority: 10 });
            await matcher.matchUsersAssignments('holder-1');
            expect(await matcher.getCurrentAssignmentsForUser('holder-1')).to.include('held-task');
            await matcher.redisClient.sAdd(keys.userAssignments('stale-1'), 'assignment:held-task');

            let error: Error | undefined;
            try {
                await matcher.acceptAssignment('stale-1', 'held-task');
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/Assignment not found for user/);
            expect(await matcher.getCurrentAssignmentsForUser('stale-1')).to.not.include('held-task');

            await matcher.acceptAssignment('holder-1', 'held-task');
            await matcher.completeAssignment('holder-1', 'held-task');
        });
    });

    // Work aimed at a named person is found through a per-user index rather
    // than by reading the whole queue on every match pass.
    describe('targeted-work index', function () {
        const keys = createKeyBuilders({ prefix: '' });
        const oneStep = (id: string, userId: string) => ({
            id,
            name: id,
            initialStepId: 'only',
            steps: [{ id: 'only', name: 'Only', assignmentTemplate: { tags: ['index-unmatched'] }, targetUser: userId }],
        });

        it('indexes a targeted step and drops the entry once the work is claimed', async function () {
            await matcher.addUser({ id: 'index-1', tags: ['index'] });
            await matcher.registerWorkflow(oneStep('facade-index-def', 'index-1'));
            const run = await matcher.startWorkflow('facade-index-def', 'index-1');
            const assignmentId = run.currentAssignmentId!;

            // startWorkflow matched it straight away, so it is pending and the
            // next pass finds the entry stale and removes it.
            expect(await matcher.getCurrentAssignmentsForUser('index-1')).to.include(assignmentId);
            await matcher.matchUsersAssignments('index-1');
            expect(await matcher.redisClient.sMembers(keys.userTargeted('index-1'))).to.deep.equal([]);

            // A lapse requeues it: the entry is back and the target wins it again.
            await matcher.releaseUserAssignments('index-1');
            expect(await matcher.redisClient.sMembers(keys.userTargeted('index-1'))).to.deep.equal([assignmentId]);
            await matcher.matchUsersAssignments('index-1');
            expect(await matcher.getCurrentAssignmentsForUser('index-1')).to.include(assignmentId);
            await matcher.cancelWorkflow(run.id);
        });

        // The shared `default` tag (on by default) is an index like any other:
        // a targeted claim that leaves its entry behind fills the head of that
        // index with unclaimable ghosts until nobody is offered anything.
        it('leaves no entry in any tag index when the target claims the work', async function () {
            await matcher.addUser({ id: 'index-5', tags: ['index'] });
            await matcher.registerWorkflow(oneStep('facade-index-ghost-def', 'index-5'));
            const run = await matcher.startWorkflow('facade-index-ghost-def', 'index-5');
            const assignmentId = run.currentAssignmentId!;
            expect(await matcher.getCurrentAssignmentsForUser('index-5')).to.include(assignmentId);

            for (const tag of ['index-unmatched', 'default']) {
                expect(await matcher.redisClient.zScore(keys.tagAssignments(tag), assignmentId), tag).to.be.null;
            }
            await matcher.cancelWorkflow(run.id);
        });

        it('finds targeted work that was queued before the index existed', async function () {
            await matcher.addUser({ id: 'index-2', tags: ['index'] });
            await matcher.registerWorkflow(oneStep('facade-index-old-def', 'index-2'));
            const run = await matcher.startWorkflow('facade-index-old-def', 'index-2');
            const assignmentId = run.currentAssignmentId!;
            await matcher.releaseUserAssignments('index-2');

            // Simulate a queue written by a version without the index, read by
            // a freshly started process.
            await matcher.redisClient.del([keys.userTargeted('index-2'), keys.targetedIndexReady()]);
            const fresh = new Matcher(redisClient, { enableWorkflows: true, matchExpirationMs: 60000 });

            await fresh.matchUsersAssignments('index-2');
            expect(await fresh.getCurrentAssignmentsForUser('index-2')).to.include(assignmentId);
            await matcher.cancelWorkflow(run.id);
        });

        it('rebuilds the index through backfillWorkflowIndexes', async function () {
            await matcher.addUser({ id: 'index-3', tags: ['index'] });
            await matcher.registerWorkflow(oneStep('facade-index-repair-def', 'index-3'));
            const run = await matcher.startWorkflow('facade-index-repair-def', 'index-3');
            await matcher.releaseUserAssignments('index-3');
            await matcher.redisClient.del(keys.userTargeted('index-3'));

            await matcher.backfillWorkflowIndexes();
            expect(await matcher.redisClient.sMembers(keys.userTargeted('index-3'))).to.deep.equal([
                run.currentAssignmentId,
            ]);
            await matcher.cancelWorkflow(run.id);
        });

        it('still finds work aimed at a user who was removed and added back', async function () {
            await matcher.addUser({ id: 'index-4', tags: ['index'] });
            await matcher.registerWorkflow(oneStep('facade-index-gone-def', 'index-4'));
            const run = await matcher.startWorkflow('facade-index-gone-def', 'index-4');
            const assignmentId = run.currentAssignmentId!;
            await matcher.removeUser('index-4');
            expect(await matcher.getAssignment(assignmentId)).to.not.be.null;

            await matcher.addUser({ id: 'index-4', tags: ['index'] });
            await matcher.matchUsersAssignments('index-4');
            expect(await matcher.getCurrentAssignmentsForUser('index-4')).to.include(assignmentId);
            await matcher.cancelWorkflow(run.id);
        });
    });
    describe('review hardening', function () {
        const keys = createKeyBuilders({ prefix: '' });
        const ext = (id: string, extra: Record<string, unknown> = {}) => ({
            id,
            name: id,
            taskType: 'external' as const,
            external: { name: id },
            timeoutMs: 60000,
            ...extra,
        });

        // An event's idempotency marker may only be written by a save of the
        // event's own run. A hook that starts another run from inside the
        // event must not get this event marked as applied: if its own save
        // then loses the version race, the retry would skip it for good.
        it('applies an event whose first save loses the race while its hook starts another run', async function () {
            let childStart: Promise<unknown> | undefined;
            const chained = new Matcher(redisClient, {
                enableWorkflows: true,
                matchExpirationMs: 60000,
                onWorkflowEvent: (t) => {
                    if (t.kind === 'step.completed' && t.instance.workflowDefinitionId === 'harden-parent') {
                        childStart = chained.startWorkflow('harden-child', 'anyone');
                    }
                },
            });
            await chained.registerWorkflow({ id: 'harden-parent', name: 'Parent', initialStepId: 'p', steps: [ext('p')] });
            await chained.registerWorkflow({ id: 'harden-child', name: 'Child', initialStepId: 'c', steps: [ext('c')] });
            const parent = await chained.startWorkflow('harden-parent', 'anyone');

            // The parent's first save loses, but only after the child run
            // (started by the hook, inside the event) has saved.
            const wm = (chained as any).workflow;
            const realSave = wm.saveInstance.bind(wm);
            let failed = false;
            wm.saveInstance = async (instance: { id: string }, expectedVersion: number) => {
                if (instance.id === parent.id && !failed) {
                    failed = true;
                    await childStart;
                    throw new Error('Workflow transition failed: VERSION_MISMATCH');
                }
                return realSave(instance, expectedVersion);
            };
            try {
                await chained.completeWorkflowStep(parent.id, 'p', { success: true });
                for (let i = 0; i < 5; i++) await chained.processWorkflowEvents(50);
            } finally {
                wm.saveInstance = realSave;
            }

            expect(failed).to.equal(true);
            expect((await chained.getWorkflowInstance(parent.id))!.status).to.equal('completed');
        });

        it('keeps re-armed branch timeouts when the race winner loops back through a machine step', async function () {
            matcher.registerMachineHandler('harden-hop', async () => ({ ok: true }));
            await matcher.registerWorkflow({
                id: 'harden-loop-def',
                name: 'Loop',
                initialStepId: 'fork',
                steps: [
                    { id: 'fork', name: 'Fork', assignmentTemplate: {}, parallelStepIds: ['left', 'right'] },
                    ext('left', { waitForAll: false, defaultNextStepId: 'hop' }),
                    ext('right'),
                    {
                        id: 'hop',
                        name: 'Hop',
                        taskType: 'machine',
                        machineTask: { handler: 'harden-hop' },
                        defaultNextStepId: 'fork',
                    },
                ],
            });
            const run = await matcher.startWorkflow('harden-loop-def', 'race-1');
            await matcher.completeWorkflowStep(run.id, 'left', { success: true });
            await drainWorkflowEvents();

            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.parallelBranches!.map((b) => b.status)).to.deep.equal(['pending', 'pending']);
            for (const stepId of ['left', 'right']) {
                expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|${stepId}`), stepId).to
                    .not.be.null;
            }
            await matcher.cancelWorkflow(run.id);
        });

        it("retries parallel branches in place, each on its own budget (failurePolicy 'retry')", async function () {
            await matcher.registerWorkflow({
                id: 'harden-branch-retry-def',
                name: 'Branch retry',
                initialStepId: 'fork',
                steps: [
                    { id: 'fork', name: 'Fork', assignmentTemplate: {}, parallelStepIds: ['a', 'b'] },
                    ext('a', { failurePolicy: 'retry', maxRetries: 1 }),
                    ext('b', { failurePolicy: 'retry', maxRetries: 1 }),
                ],
            });
            const run = await matcher.startWorkflow('harden-branch-retry-def', 'race-1');
            // Both branches fail once: both retry, neither becomes "the current step".
            await matcher.completeWorkflowStep(run.id, 'a', { success: false, error: 'x' });
            await matcher.completeWorkflowStep(run.id, 'b', { success: false, error: 'x' });
            await drainWorkflowEvents();
            let now = (await matcher.getWorkflowInstance(run.id))!;
            expect(now.status).to.equal('active');
            expect(now.currentStepId).to.equal(null);
            expect(now.parallelBranches!.map((b) => [b.stepId, b.status, b.retryCount])).to.deep.equal([
                ['a', 'pending', 1],
                ['b', 'pending', 1],
            ]);

            await matcher.completeWorkflowStep(run.id, 'a', { success: true });
            await matcher.completeWorkflowStep(run.id, 'b', { success: true });
            await drainWorkflowEvents();
            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('completed');

            // A branch that fails past its budget fails the run.
            const second = await matcher.startWorkflow('harden-branch-retry-def', 'race-1');
            for (let i = 0; i < 2; i++) {
                await matcher.completeWorkflowStep(second.id, 'a', { success: false, error: 'x' });
                await drainWorkflowEvents();
            }
            now = (await matcher.getWorkflowInstance(second.id))!;
            expect(now.status).to.equal('failed');
        });

        it('ignores a late event from work an earlier attempt of the same step was given', async function () {
            await matcher.addUser({ id: 'visit-1', tags: ['visit'] });
            await matcher.registerWorkflow({
                id: 'harden-visit-def',
                name: 'Visit',
                initialStepId: 'only',
                steps: [
                    {
                        id: 'only',
                        name: 'Only',
                        assignmentTemplate: { tags: ['visit'] },
                        targetUser: 'visit-1',
                        maxRetries: 1,
                    },
                ],
            });
            const run = await matcher.startWorkflow('harden-visit-def', 'visit-1');
            const firstId = run.currentAssignmentId!;
            await matcher.matchUsersAssignments('visit-1');
            await matcher.acceptAssignment('visit-1', firstId);
            await matcher.failAssignment('visit-1', firstId, 'boom');
            await drainWorkflowEvents();
            const retried = (await matcher.getWorkflowInstance(run.id))!;
            expect(retried.currentAssignmentId).to.not.equal(firstId);

            // A completion for the first attempt's work arrives late.
            await matcher.publishWorkflowEvent({
                eventId: 'harden-late-completion',
                type: 'COMPLETED',
                userId: 'visit-1',
                assignmentId: firstId,
                workflowInstanceId: run.id,
                stepId: 'only',
                timestamp: Date.now(),
            });
            await drainWorkflowEvents();

            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.status).to.equal('active');
            expect(after.currentAssignmentId).to.equal(retried.currentAssignmentId);
            await matcher.cancelWorkflow(run.id);
        });

        it('continues from the fork that actually started the group when two forks share branches', async function () {
            await matcher.registerWorkflow({
                id: 'harden-two-forks-def',
                name: 'Two forks',
                initialStepId: 'fork-b',
                steps: [
                    {
                        id: 'fork-a',
                        name: 'A',
                        assignmentTemplate: {},
                        parallelStepIds: ['x', 'y'],
                        defaultNextStepId: 'after-a',
                    },
                    {
                        id: 'fork-b',
                        name: 'B',
                        assignmentTemplate: {},
                        parallelStepIds: ['x', 'y'],
                        defaultNextStepId: 'after-b',
                    },
                    ext('x'),
                    ext('y'),
                    ext('after-a'),
                    ext('after-b'),
                ],
            });
            const run = await matcher.startWorkflow('harden-two-forks-def', 'race-1');
            await matcher.completeWorkflowStep(run.id, 'x', { success: true });
            await matcher.completeWorkflowStep(run.id, 'y', { success: true });
            await drainWorkflowEvents();
            expect((await matcher.getWorkflowInstance(run.id))!.currentStepId).to.equal('after-b');
            await matcher.cancelWorkflow(run.id);
        });

        it('fails the step, and leaves no parked copy, when a lapse parks the work', async function () {
            await matcher.addUser({ id: 'park-1', tags: ['park'] });
            await matcher.registerWorkflow({
                id: 'harden-park-def',
                name: 'Park',
                initialStepId: 'only',
                steps: [
                    {
                        id: 'only',
                        name: 'Only',
                        assignmentTemplate: {
                            tags: ['park'],
                            escalation: { respondWithinMs: 60000, maxEscalations: 0, onExhausted: 'park' },
                        },
                        targetUser: { tag: 'park' },
                    },
                ],
            });
            const run = await matcher.startWorkflow('harden-park-def', 'park-1');
            const assignmentId = run.currentAssignmentId!;
            await matcher.matchUsersAssignments('park-1');
            await matcher.redisClient.zAdd(keys.pendingAssignmentsExpiry(), {
                score: Date.now() - 1000,
                value: assignmentId,
            });
            const sweep = await matcher.processResponseDeadlines();
            expect(sweep.parked).to.equal(1);
            await drainWorkflowEvents();

            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('failed');
            expect(Number(await matcher.redisClient.hExists(keys.parkedAssignments(), assignmentId))).to.equal(0);
        });

        it('accepts nothing, and touches nothing, on a backlog entry with no pending record', async function () {
            await matcher.addUser({ id: 'ghost-1', tags: ['ghost-other'] });
            await matcher.addAssignment({ id: 'ghost-task', tags: ['ghost'], priority: 10 });
            await matcher.redisClient.sAdd(keys.userAssignments('ghost-1'), 'assignment:ghost-task');

            expect(await matcher.acceptAssignment('ghost-1', 'ghost-task')).to.equal(false);
            // Still queued, with its wait clock intact.
            expect(await matcher.redisClient.zScore(keys.assignmentsQueuedAt(), 'ghost-task')).to.not.be.null;
            expect(await matcher.getCurrentAssignmentsForUser('ghost-1')).to.not.include('ghost-task');
            await matcher.removeAssignment('ghost-task');
        });

        it('lists runs nothing has happened to, and clears an external step timeout on cancel', async function () {
            await matcher.registerWorkflow({
                id: 'harden-stalled-def',
                name: 'Stalled',
                initialStepId: 'w',
                steps: [ext('w')],
            });
            const run = await matcher.startWorkflow('harden-stalled-def', 'anyone');

            expect((await matcher.getStalledWorkflowRuns(60 * 60_000, 1000)).map((r) => r.id)).to.not.include(run.id);
            await new Promise((r) => setTimeout(r, 5));
            expect((await matcher.getStalledWorkflowRuns(1, 1000)).map((r) => r.id)).to.include(run.id);

            expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|w`)).to.not.be.null;
            await matcher.cancelWorkflow(run.id);
            expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|w`)).to.be.null;
            expect((await matcher.getStalledWorkflowRuns(1, 1000)).map((r) => r.id)).to.not.include(run.id);
        });

        it('gives the target no copy of work somebody else claimed in a bulk fair pass', async function () {
            const fair = new Matcher(redisClient, {
                enableWorkflows: true,
                matchExpirationMs: 60000,
                fairness: 'best-match',
            });
            await fair.addUser({ id: 'fair-target', tags: ['fair-other'] });
            await fair.addUser({ id: 'fair-taker', tags: ['fair'] });
            await fair.registerWorkflow({
                id: 'harden-fair-def',
                name: 'Fair',
                initialStepId: 'only',
                steps: [{ id: 'only', name: 'Only', assignmentTemplate: { tags: ['fair'] }, targetUser: 'fair-target' }],
            });
            await fair.pauseUser('fair-target');
            const run = await fair.startWorkflow('harden-fair-def', 'fair-target');
            const assignmentId = run.currentAssignmentId!;
            await fair.matchUsersAssignments('fair-taker');
            expect(await fair.getCurrentAssignmentsForUser('fair-taker')).to.include(assignmentId);
            await fair.resumeUser('fair-target');

            const m = fair as any;
            const original = m.getWorkflowTargetedAssignments;
            m.getWorkflowTargetedAssignments = async (userId: string) =>
                userId === 'fair-target' ? [{ id: assignmentId, priority: 1000, tags: 'fair' }] : [];
            try {
                await fair.matchUsersAssignments();
            } finally {
                m.getWorkflowTargetedAssignments = original;
            }
            expect(await fair.getCurrentAssignmentsForUser('fair-target')).to.not.include(assignmentId);
            expect(await fair.getCurrentAssignmentsForUser('fair-taker')).to.include(assignmentId);
            await fair.cancelWorkflow(run.id);
        });
    });
    describe('durability', function () {
        const keys = createKeyBuilders({ prefix: '' });
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const ext = (id: string, extra: Record<string, unknown> = {}) => ({
            id,
            name: id,
            taskType: 'external' as const,
            external: { name: id },
            timeoutMs: 60000,
            ...extra,
        });

        it('compares versions without decoding the run, and still moves runs saved before the version field', async function () {
            await matcher.registerWorkflow({
                id: 'durable-version-def',
                name: 'Version',
                initialStepId: 'a',
                steps: [ext('a', { defaultNextStepId: 'b' }), ext('b')],
            });
            const run = await matcher.startWorkflow('durable-version-def', 'anyone');
            const key = keys.workflowInstance(run.id);
            const stored = (await matcher.getWorkflowInstance(run.id))!;
            expect(await matcher.redisClient.hGet(key, 'version')).to.equal(String(stored.version));

            // A run written by a version that kept the number only in the JSON.
            await matcher.redisClient.hDel(key, 'version');
            await matcher.completeWorkflowStep(run.id, 'a', { success: true });
            await drainWorkflowEvents();
            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.currentStepId).to.equal('b');
            expect(await matcher.redisClient.hGet(key, 'version')).to.equal(String(after.version));
            await matcher.cancelWorkflow(run.id);
        });

        it('reports a transition once when the save behind it has to be retried', async function () {
            await matcher.registerWorkflow({ id: 'durable-once-def', name: 'Once', initialStepId: 'a', steps: [ext('a')] });
            const run = await matcher.startWorkflow('durable-once-def', 'anyone');
            const wm = (matcher as any).workflow;
            const realSave = wm.saveInstance.bind(wm);
            let failed = false;
            wm.saveInstance = async (instance: { id: string }, expectedVersion: number) => {
                if (instance.id === run.id && !failed) {
                    failed = true;
                    throw new Error('Workflow transition failed: VERSION_MISMATCH');
                }
                return realSave(instance, expectedVersion);
            };
            try {
                await matcher.completeWorkflowStep(run.id, 'a', { success: true });
                await drainWorkflowEvents();
            } finally {
                wm.saveInstance = realSave;
            }
            expect(failed).to.equal(true);
            const mine = transitions.filter((t) => t.instance.id === run.id).map((t) => t.kind);
            expect(mine.filter((k) => k === 'step.completed')).to.have.length(1);
            expect(mine.filter((k) => k === 'run.completed')).to.have.length(1);
            expect(mine.indexOf('step.completed')).to.be.lessThan(mine.indexOf('run.completed'));
        });

        it('lets only one of two sweeping replicas act on the same lapsed offer', async function () {
            const expired: string[] = [];
            const options = {
                matchExpirationMs: 60000,
                onAssignmentLifecycle: (e: { kind: string; taskId: string }) => {
                    if (e.kind === 'expired' && e.taskId === 'gate-task') expired.push(e.taskId);
                },
            };
            const second = await createTestClient().connect();
            const a = new Matcher(redisClient, options as any);
            const b = new Matcher(second as any, options as any);
            try {
                await a.addUser({ id: 'gate-1', tags: ['gate'] });
                await a.addAssignment({ id: 'gate-task', tags: ['gate'], priority: 10 });
                await a.matchUsersAssignments('gate-1');
                await a.redisClient.zAdd(keys.pendingAssignmentsExpiry(), { score: Date.now() - 1000, value: 'gate-task' });

                await Promise.all([a.processResponseDeadlines(), b.processResponseDeadlines()]);
                expect(expired).to.have.length(1);
                expect(await a.getAssignment('gate-task')).to.not.be.null;
                await a.removeAssignment('gate-task');
            } finally {
                await second.quit();
            }
        });

        it('fails a machine step that outlives its lease instead of waiting for it forever', async function () {
            const leased = new Matcher(redisClient, {
                enableWorkflows: true,
                matchExpirationMs: 60000,
                workflowMachineLeaseMs: 40,
            });
            let release: () => void = () => undefined;
            const gate = new Promise<void>((r) => (release = r));
            leased.registerMachineHandler('durable-hang', async () => {
                await gate;
                return {};
            });
            await leased.registerWorkflow({
                id: 'durable-lease-def',
                name: 'Lease',
                initialStepId: 'm',
                steps: [{ id: 'm', name: 'M', taskType: 'machine', machineTask: { handler: 'durable-hang' } }],
            });
            // The handler never returns, as after a crash: startWorkflow is left hanging.
            const starting = leased.startWorkflow('durable-lease-def', 'anyone').catch(() => undefined);
            await sleep(80);
            const runs = await leased.listWorkflowInstances({ workflowDefinitionId: 'durable-lease-def' });
            const run = runs.instances[0];
            expect(run.status).to.equal('active');

            expect(await leased.processExpiredWorkflowSteps()).to.be.greaterThan(0);
            for (let i = 0; i < 5; i++) await leased.processWorkflowEvents(50);
            const after = (await leased.getWorkflowInstance(run.id))!;
            expect(after.status).to.equal('failed');
            expect(after.failures!.map((f) => [f.stepId, f.reason])).to.deep.equal([['m', 'expired']]);

            release();
            await starting;
        });

        it('aborts a machine handler when its timeout fires and gives it a stable attempt id', async function () {
            const seen: { aborted?: boolean; attemptId?: string } = {};
            matcher.registerMachineHandler('durable-slow', async ({ signal, attemptId }) => {
                seen.attemptId = attemptId;
                await new Promise<void>((resolve) => signal!.addEventListener('abort', () => resolve()));
                seen.aborted = signal!.aborted;
                return {};
            });
            await matcher.registerWorkflow({
                id: 'durable-abort-def',
                name: 'Abort',
                initialStepId: 'm',
                steps: [
                    { id: 'm', name: 'M', taskType: 'machine', machineTask: { handler: 'durable-slow' }, timeoutMs: 30 },
                ],
            });
            const run = await matcher.startWorkflow('durable-abort-def', 'anyone');
            await sleep(20);
            expect(seen.aborted).to.equal(true);
            expect(seen.attemptId).to.be.a('string').with.length.greaterThan(0);
            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('failed');
        });

        it('records attempts that did not complete on the run', async function () {
            await matcher.addUser({ id: 'durable-fail-1', tags: ['durable-fail'] });
            await matcher.registerWorkflow({
                id: 'durable-failures-def',
                name: 'Failures',
                initialStepId: 'only',
                steps: [
                    {
                        id: 'only',
                        name: 'Only',
                        assignmentTemplate: { tags: ['durable-fail'] },
                        targetUser: 'durable-fail-1',
                        maxRetries: 1,
                    },
                ],
            });
            const run = await matcher.startWorkflow('durable-failures-def', 'durable-fail-1');
            const firstId = run.currentAssignmentId!;
            await matcher.matchUsersAssignments('durable-fail-1');
            await matcher.acceptAssignment('durable-fail-1', firstId);
            await matcher.failAssignment('durable-fail-1', firstId, 'could not reach customer');
            await drainWorkflowEvents();

            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.status).to.equal('active');
            expect(after.history).to.have.length(0);
            expect(after.failures).to.have.length(1);
            expect(after.failures![0]).to.include({
                stepId: 'only',
                assignmentId: firstId,
                userId: 'durable-fail-1',
                reason: 'failed',
                error: 'could not reach customer',
            });
            await matcher.cancelWorkflow(run.id);
        });

        it('starts a run whose creation was interrupted before its first step was saved', async function () {
            const recovering = new Matcher(redisClient, {
                enableWorkflows: true,
                matchExpirationMs: 60000,
                workflowStartRecoveryMs: 0,
            });
            await recovering.registerWorkflow({
                id: 'durable-start-def',
                name: 'Start',
                initialStepId: 'w',
                steps: [ext('w')],
            });
            // Die between writing the run and its first step.
            const wm = (recovering as any).workflow;
            // A dead process runs no cleanup either.
            const realExecute = wm.executeWorkflowStep.bind(wm);
            const realFail = wm.failUnstartedRun.bind(wm);
            wm.executeWorkflowStep = async () => {
                throw new Error('process died');
            };
            wm.failUnstartedRun = async () => undefined;
            let error: Error | undefined;
            try {
                await recovering.startWorkflow('durable-start-def', 'anyone');
            } catch (err) {
                error = err as Error;
            } finally {
                wm.executeWorkflowStep = realExecute;
                wm.failUnstartedRun = realFail;
            }
            expect(error?.message).to.equal('process died');
            const stranded = (await recovering.listWorkflowInstances({ workflowDefinitionId: 'durable-start-def' }))
                .instances[0];
            expect(stranded.version).to.equal(1);
            expect(await recovering.redisClient.zScore(keys.workflowStepExpiryIndex(), `${stranded.id}|w`)).to.be.null;

            // A run that has already used up its recovery attempts is failed,
            // not retried for ever (checked on a second stranded run below).

            // Another replica is already on it: this one leaves the run alone.
            await recovering.redisClient.set(keys.workflowStartLock(stranded.id), 'other-replica');
            await recovering.processExpiredWorkflowSteps();
            expect((await recovering.getWorkflowInstance(stranded.id))!.version).to.equal(1);
            await recovering.redisClient.del(keys.workflowStartLock(stranded.id));

            await recovering.processExpiredWorkflowSteps();

            const after = (await recovering.getWorkflowInstance(stranded.id))!;
            expect(after.version).to.be.greaterThan(1);
            expect(await recovering.redisClient.zScore(keys.workflowStepExpiryIndex(), `${stranded.id}|w`)).to.not.be.null;
            expect(await recovering.redisClient.zScore(keys.workflowInstancesStarting(), stranded.id)).to.be.null;
            await recovering.completeWorkflowStep(stranded.id, 'w', { success: true });
            for (let i = 0; i < 5; i++) await recovering.processWorkflowEvents(50);
            expect((await recovering.getWorkflowInstance(stranded.id))!.status).to.equal('completed');

            // A second stranded run that recovery has already tried five times.
            wm.executeWorkflowStep = async () => {
                throw new Error('process died');
            };
            wm.failUnstartedRun = async () => undefined;
            try {
                await recovering.startWorkflow('durable-start-def', 'anyone');
            } catch {
                /* the simulated crash */
            } finally {
                wm.executeWorkflowStep = realExecute;
                wm.failUnstartedRun = realFail;
            }
            const hopeless = (await recovering.listWorkflowInstances({ workflowDefinitionId: 'durable-start-def' }))
                .instances[0];
            expect(hopeless.id).to.not.equal(stranded.id);
            await recovering.redisClient.hSet(keys.workflowInstance(hopeless.id), 'startAttempts', '5');
            await recovering.processExpiredWorkflowSteps();
            expect((await recovering.getWorkflowInstance(hopeless.id))!.status).to.equal('failed');
        });

        it('fails the run, for good, when its first step throws', async function () {
            const strict = new Matcher(redisClient, {
                enableWorkflows: true,
                matchExpirationMs: 60000,
                workflowStartRecoveryMs: 0,
            });
            await strict.registerWorkflow({
                id: 'durable-throw-def',
                name: 'Throw',
                initialStepId: 'w',
                steps: [ext('w')],
            });
            const wm = (strict as any).workflow;
            const realExecute = wm.executeWorkflowStep.bind(wm);
            wm.executeWorkflowStep = async () => {
                throw new Error('template rejected');
            };
            let error: Error | undefined;
            try {
                await strict.startWorkflow('durable-throw-def', 'anyone');
            } catch (err) {
                error = err as Error;
            } finally {
                wm.executeWorkflowStep = realExecute;
            }
            expect(error?.message).to.equal('template rejected');

            const run = (await strict.listWorkflowInstances({ workflowDefinitionId: 'durable-throw-def' })).instances[0];
            expect(run.status).to.equal('failed');
            // The caller was told it failed, so recovery must not revive it.
            await strict.processExpiredWorkflowSteps();
            expect((await strict.getWorkflowInstance(run.id))!.status).to.equal('failed');
            expect(await strict.redisClient.zScore(keys.workflowInstancesStarting(), run.id)).to.be.null;
        });

        it('still saves a run whose version field an older release left behind', async function () {
            await matcher.registerWorkflow({
                id: 'durable-stale-def',
                name: 'Stale',
                initialStepId: 'a',
                steps: [ext('a', { defaultNextStepId: 'b' }), ext('b')],
            });
            const run = await matcher.startWorkflow('durable-stale-def', 'anyone');
            const key = keys.workflowInstance(run.id);
            // An older replica saved the run: the JSON moved on, the field did not.
            const stored = (await matcher.getWorkflowInstance(run.id))!;
            await matcher.redisClient.hSet(key, 'data', JSON.stringify({ ...stored, version: stored.version + 3 }));

            await matcher.completeWorkflowStep(run.id, 'a', { success: true });
            await drainWorkflowEvents();
            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.currentStepId).to.equal('b');
            expect(await matcher.redisClient.hGet(key, 'version')).to.equal(String(after.version));
            expect(await matcher.getDeadLetterQueueSize()).to.equal(0);
            await matcher.cancelWorkflow(run.id);
        });

        it('refuses a stale save even when an older release left the version field looking current', async function () {
            await matcher.registerWorkflow({ id: 'durable-lost-def', name: 'Lost', initialStepId: 'a', steps: [ext('a')] });
            const run = await matcher.startWorkflow('durable-lost-def', 'anyone');
            const key = keys.workflowInstance(run.id);
            const reader = (await matcher.getWorkflowInstance(run.id))!;

            // An older replica saves the run after our read: the JSON moves to
            // the next version, the field still shows the one we read.
            await matcher.redisClient.hSet(key, 'data', JSON.stringify({ ...reader, version: reader.version + 1 }));
            expect(await matcher.redisClient.hGet(key, 'version')).to.equal(String(reader.version));

            let error: Error | undefined;
            try {
                await (matcher as any).workflow.saveInstance({ ...reader, status: 'cancelled' }, reader.version);
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/VERSION_MISMATCH/);
            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('active');
            await matcher.cancelWorkflow(run.id);
        });

        it('takes the half-created work with it when a run fails before its first save', async function () {
            const strict = new Matcher(redisClient, { enableWorkflows: true, matchExpirationMs: 60000 });
            await strict.addUser({ id: 'durable-orphan-1', tags: ['durable-orphan-other'] });
            await strict.pauseUser('durable-orphan-1');
            await strict.registerWorkflow({
                id: 'durable-orphan-def',
                name: 'Orphan',
                initialStepId: 'only',
                steps: [
                    {
                        id: 'only',
                        name: 'Only',
                        assignmentTemplate: { tags: ['durable-orphan'] },
                        targetUser: 'durable-orphan-1',
                        timeoutMs: 60000,
                    },
                ],
            });
            // The step's work is queued, then its save fails outright.
            const wm = (strict as any).workflow;
            const realSave = wm.saveInstance.bind(wm);
            let failed = false;
            wm.saveInstance = async (instance: { id: string }, expectedVersion: number) => {
                if (!failed) {
                    failed = true;
                    throw new Error('redis unavailable');
                }
                return realSave(instance, expectedVersion);
            };
            let error: Error | undefined;
            try {
                await strict.startWorkflow('durable-orphan-def', 'durable-orphan-1');
            } catch (err) {
                error = err as Error;
            } finally {
                wm.saveInstance = realSave;
            }
            expect(error?.message).to.equal('redis unavailable');

            const run = (await strict.listWorkflowInstances({ workflowDefinitionId: 'durable-orphan-def' })).instances[0];
            expect(run.status).to.equal('failed');
            const leftovers = (await strict.getAllAssignments()).filter(
                (a) => (a as Record<string, any>)._workflowInstanceId === run.id,
            );
            expect(leftovers).to.deep.equal([]);
            expect(await strict.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|only`)).to.be.null;
        });

        it('keeps a machine step timed while its result is unsaved, so the run can still be recovered', async function () {
            const leased = new Matcher(redisClient, {
                enableWorkflows: true,
                matchExpirationMs: 60000,
                workflowMachineLeaseMs: 60000,
            });
            leased.registerMachineHandler('durable-ok', async () => ({ ok: true }));
            await leased.registerWorkflow({
                id: 'durable-unsaved-def',
                name: 'Unsaved',
                initialStepId: 'm',
                steps: [
                    {
                        id: 'm',
                        name: 'M',
                        taskType: 'machine',
                        machineTask: { handler: 'durable-ok' },
                        defaultNextStepId: 'w',
                    },
                    ext('w'),
                ],
            });
            // The handler succeeds; saving its result does not.
            const wm = (leased as any).workflow;
            const realSave = wm.saveInstance.bind(wm);
            let saves = 0;
            wm.saveInstance = async (instance: { id: string }, expectedVersion: number) => {
                if (++saves > 1) throw new Error('redis unavailable');
                return realSave(instance, expectedVersion);
            };
            // The run is started (its first step was saved), so the caller
            // gets the run, not an error that invites a second start.
            let run: Awaited<ReturnType<typeof leased.startWorkflow>>;
            try {
                run = await leased.startWorkflow('durable-unsaved-def', 'anyone');
            } finally {
                wm.saveInstance = realSave;
            }
            expect(saves).to.be.greaterThan(1);
            expect(run.status).to.equal('active');
            expect(run.currentStepId).to.equal('m');
            expect(run.failures ?? []).to.have.length(0);
            expect(await leased.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|m`)).to.not.be.null;

            // The step's lease then settles the run instead of leaving it stuck.
            await leased.redisClient.zAdd(keys.workflowStepExpiryIndex(), {
                score: Date.now() - 1000,
                value: `${run.id}|m`,
            });
            await leased.processExpiredWorkflowSteps();
            for (let i = 0; i < 5; i++) await leased.processWorkflowEvents(50);
            const settled = (await leased.getWorkflowInstance(run.id))!;
            expect(settled.status).to.equal('failed');
            expect(settled.failures!.map((f) => [f.stepId, f.reason])).to.deep.equal([['m', 'expired']]);
        });

        it('leaves no live work when a parallel branch failure ends the run', async function () {
            await matcher.addUser({ id: 'durable-par-1', tags: ['durable-par'] });
            await matcher.addUser({ id: 'durable-par-2', tags: ['durable-par'] });
            const branch = (id: string, userId: string) => ({
                id,
                name: id,
                assignmentTemplate: { tags: ['durable-par'] },
                targetUser: userId,
                timeoutMs: 60000,
            });
            await matcher.registerWorkflow({
                id: 'durable-abort-group-def',
                name: 'Abort group',
                initialStepId: 'fork',
                steps: [
                    { id: 'fork', name: 'Fork', assignmentTemplate: {}, parallelStepIds: ['a', 'b'] },
                    branch('a', 'durable-par-1'),
                    branch('b', 'durable-par-2'),
                ],
            });
            const run = await matcher.startWorkflow('durable-abort-group-def', 'durable-par-1');
            const branches = (await matcher.getWorkflowInstance(run.id))!.parallelBranches!;
            const idOf = (stepId: string) => branches.find((x) => x.stepId === stepId)!.assignmentId;
            await matcher.matchUsersAssignments('durable-par-1');
            await matcher.acceptAssignment('durable-par-1', idOf('a'));
            await matcher.failAssignment('durable-par-1', idOf('a'), 'boom');
            await drainWorkflowEvents();

            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('failed');
            expect(await matcher.getAssignment(idOf('b'))).to.be.null;
            expect(await matcher.redisClient.zScore(keys.workflowStepExpiryIndex(), `${run.id}|b`)).to.be.null;
            expect(await matcher.getCurrentAssignmentsForUser('durable-par-2')).to.not.include(idOf('b'));
        });

        it("reads a branch's retry policy and budget from the fork when the branch declares none", async function () {
            await matcher.registerWorkflow({
                id: 'durable-fork-budget-def',
                name: 'Fork budget',
                initialStepId: 'fork',
                steps: [
                    {
                        id: 'fork',
                        name: 'Fork',
                        assignmentTemplate: {},
                        parallelStepIds: ['a', 'b'],
                        failurePolicy: 'retry',
                        maxRetries: 1,
                    },
                    ext('a'),
                    ext('b'),
                ],
            });
            const run = await matcher.startWorkflow('durable-fork-budget-def', 'race-1');
            await matcher.completeWorkflowStep(run.id, 'a', { success: false, error: 'x' });
            await drainWorkflowEvents();
            const after = (await matcher.getWorkflowInstance(run.id))!;
            expect(after.status).to.equal('active');
            expect(after.parallelBranches!.find((b) => b.stepId === 'a')!.retryCount).to.equal(1);
            await matcher.cancelWorkflow(run.id);
        });

        it('refuses a callback that names an earlier attempt of the step', async function () {
            const ready: Array<{ stepId?: string; assignmentId?: string }> = [];
            await matcher.registerWorkflow({
                id: 'durable-callback-def',
                name: 'Callback',
                initialStepId: 'w',
                steps: [ext('w', { maxRetries: 1 })],
            });
            const run = await matcher.startWorkflow('durable-callback-def', 'anyone');
            ready.push(...transitions.filter((t) => t.kind === 'step.ready' && t.instance.id === run.id));
            const firstAttempt = ready[0].assignmentId!;
            await matcher.completeWorkflowStep(run.id, 'w', { success: false, error: 'x', assignmentId: firstAttempt });
            await drainWorkflowEvents();

            let error: Error | undefined;
            try {
                await matcher.completeWorkflowStep(run.id, 'w', { success: true, assignmentId: firstAttempt });
            } catch (err) {
                error = err as Error;
            }
            expect(error?.message).to.match(/moved on to a later attempt/);
            expect((await matcher.getWorkflowInstance(run.id))!.status).to.equal('active');
            await matcher.cancelWorkflow(run.id);
        });
    });
});
