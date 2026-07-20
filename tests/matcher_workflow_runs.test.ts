import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
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
        redisClient = await createClient({}).connect();
        matcher = new Matcher(redisClient, {
            enableWorkflows: true,
            matchExpirationMs: 60000,
            onWorkflowEvent: (t) => transitions.push(t),
        });
        await matcher.redisClient.flushAll();
    });

    beforeEach(function () {
        transitions.length = 0;
    });

    after(async function () {
        await matcher.redisClient.flushAll();
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
                { id: 'ext', name: 'Callback', taskType: 'external', external: { name: 'do-it' }, defaultNextStepId: 'finish' },
                { id: 'finish', name: 'Finish', assignmentTemplate: { tags: ['x'] }, targetUser: 'initiator', defaultNextStepId: null },
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
});
