import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import { workflow } from '../src/workflow-builder';
import type { WorkflowTransition } from '../src/types/matcher';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Workflow escalate-on-timeout', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    let transitions: WorkflowTransition[] = [];
    const prefix = 'wf_escalation_test:';

    /** Fire due step timeouts, then drain the events they published. */
    async function tick() {
        const expired = await matcher.processExpiredWorkflowSteps();
        // The escalation is applied while draining the EXPIRED event.
        await matcher.processWorkflowEvents(50);
        return expired;
    }

    /** startWorkflow returns the instance; tests mostly want its id. */
    async function start(definitionId: string): Promise<string> {
        const instance = await matcher.startWorkflow(definitionId, 'ines');
        return instance.id;
    }

    const ladder = () =>
        workflow('oncall-escalation', 'On-call escalation ladder')
            .step('page-primary')
            .name('Page primary')
            .assignment({ tags: ['sev:1', 'oncall-primary'] })
            .targetUser({ tag: 'oncall-primary' })
            .timeout(120)
            .escalateTo('page-secondary')
            .route('result.acked === true', 'mitigate')
            .done()
            .step('page-secondary')
            .name('Escalate to secondary')
            .assignment({ tags: ['sev:1', 'oncall-secondary'] })
            .targetUser({ tag: 'oncall-secondary' })
            .timeout(120)
            .escalateTo('page-manager')
            .route('result.acked === true', 'mitigate')
            .done()
            .step('page-manager')
            .name('Wake the commander')
            .assignment({ tags: ['sev:1', 'oncall-manager'] })
            .targetUser({ tag: 'oncall-manager' })
            .timeout(120)
            .route('result.acked === true', 'mitigate')
            .done()
            .step('mitigate')
            .name('Mitigate')
            .assignment({ tags: ['sev:1', 'mitigation'] })
            .targetUser('previous')
            .defaultNext(null)
            .done()
            .initialStep('page-primary')
            .build();

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 5,
            enableWorkflows: true,
            matchExpirationMs: 60000,
            onWorkflowEvent: (t) => transitions.push(t),
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
        transitions = [];
        // flushAll drops the consumer group; the drain recreates it (and
        // returns 0 for that pass), so prime it before the run starts.
        await matcher.processWorkflowEvents(1);
        await matcher.addUser({ id: 'ines', tags: ['sev:1', 'oncall-primary'] });
    });

    after(async function () {
        await matcher.stopOrchestrator();
        await redisClient.quit();
    });

    it('advances to the escalation target instead of failing the run', async function () {
        await matcher.registerWorkflow(ladder());
        const instanceId = await start('oncall-escalation');

        expect((await matcher.getWorkflowInstance(instanceId))!.currentStepId).to.equal('page-primary');

        await sleep(200);
        expect(await tick()).to.equal(1);

        const instance = (await matcher.getWorkflowInstance(instanceId))!;
        expect(instance.status).to.equal('active');
        expect(instance.currentStepId).to.equal('page-secondary');
        expect(instance.context._escalatedFrom).to.equal('page-primary');
        expect(instance.context._escalationDepth).to.equal(1);
    });

    it('removes the superseded assignment so a late ack cannot land', async function () {
        await matcher.registerWorkflow(ladder());
        const instanceId = await start('oncall-escalation');
        const supersededId = (await matcher.getWorkflowInstance(instanceId))!.currentAssignmentId!;

        await sleep(200);
        await tick();

        expect(await matcher.getAssignment(supersededId)).to.equal(null);
        const current = (await matcher.getWorkflowInstance(instanceId))!.currentAssignmentId;
        expect(current).to.not.equal(supersededId);
    });

    it('emits a step.escalated transition alongside step.expired', async function () {
        await matcher.registerWorkflow(ladder());
        await start('oncall-escalation');

        await sleep(200);
        await tick();

        const kinds = transitions.map((t) => t.kind);
        expect(kinds).to.include('step.expired');
        expect(kinds).to.include('step.escalated');
        expect(kinds).to.not.include('run.failed');

        const escalated = transitions.find((t) => t.kind === 'step.escalated')!;
        expect(escalated.payload).to.include({ from: 'page-primary', to: 'page-secondary', depth: 1 });
    });

    it('terminates: the last tier has no target, so the run fails', async function () {
        await matcher.registerWorkflow(ladder());
        const instanceId = await start('oncall-escalation');

        for (let hop = 0; hop < 3; hop++) {
            await sleep(200);
            await tick();
        }

        const instance = (await matcher.getWorkflowInstance(instanceId))!;
        expect(instance.status).to.equal('failed');
        expect(transitions.map((t) => t.kind)).to.include('run.failed');
    });

    it('does not consume the step retry budget', async function () {
        await matcher.registerWorkflow(ladder());
        const instanceId = await start('oncall-escalation');

        await sleep(200);
        await tick();

        expect((await matcher.getWorkflowInstance(instanceId))!.retryCount).to.equal(0);
    });

    it('falls back to failure once maxEscalationDepth is exceeded', async function () {
        const shallow = workflow('shallow-ladder', 'Shallow ladder')
            .maxEscalationDepth(1)
            .step('tier-1')
            .assignment({ tags: ['t'] })
            .targetUser({ tag: 'oncall-primary' })
            .timeout(120)
            .escalateTo('tier-2')
            .done()
            .step('tier-2')
            .assignment({ tags: ['t'] })
            .targetUser({ tag: 'oncall-primary' })
            .timeout(120)
            .escalateTo('tier-1')
            .done()
            .initialStep('tier-1')
            .build();

        await matcher.registerWorkflow(shallow);
        const instanceId = await start('shallow-ladder');

        // Hop 1 escalates; hop 2 exceeds the depth cap and fails instead of looping.
        for (let hop = 0; hop < 2; hop++) {
            await sleep(200);
            await tick();
        }

        expect((await matcher.getWorkflowInstance(instanceId))!.status).to.equal('failed');
    });

    it('leaves timeout-without-escalation behaviour untouched', async function () {
        const plain = workflow('plain-timeout', 'Plain timeout')
            .step('only')
            .assignment({ tags: ['t'] })
            .targetUser({ tag: 'oncall-primary' })
            .timeout(120)
            .done()
            .initialStep('only')
            .build();

        await matcher.registerWorkflow(plain);
        const instanceId = await start('plain-timeout');

        await sleep(200);
        await tick();

        expect((await matcher.getWorkflowInstance(instanceId))!.status).to.equal('failed');
        expect(transitions.map((t) => t.kind)).to.not.include('step.escalated');
    });

    describe('validation', function () {
        const base = (mutate: (b: any) => any) =>
            mutate(
                workflow('bad', 'Bad')
                    .step('a')
                    .assignment({ tags: ['t'] })
                    .timeout(100),
            );

        it('rejects an unknown escalation target', async function () {
            expect(() => base((b: any) => b.escalateTo('nope').done().initialStep('a').build())).to.throw(
                /escalates to non-existent step/,
            );
        });

        it('rejects self-escalation', async function () {
            expect(() => base((b: any) => b.escalateTo('a').done().initialStep('a').build())).to.throw(
                /escalates to itself/,
            );
        });

        it('rejects escalation without a timeout', async function () {
            const build = () =>
                workflow('no-timeout', 'No timeout')
                    .step('a')
                    .assignment({ tags: ['t'] })
                    .escalateTo('b')
                    .done()
                    .step('b')
                    .assignment({ tags: ['t'] })
                    .done()
                    .initialStep('a')
                    .build();
            expect(build).to.throw(/no timeoutMs/);
        });

        it('rejects escalation from inside a parallel group', async function () {
            const build = () =>
                workflow('parallel', 'Parallel')
                    .step('fan')
                    .assignment({ tags: ['t'] })
                    .parallel(['a'])
                    .done()
                    .step('a')
                    .assignment({ tags: ['t'] })
                    .timeout(100)
                    .escalateTo('b')
                    .done()
                    .step('b')
                    .assignment({ tags: ['t'] })
                    .done()
                    .initialStep('fan')
                    .build();
            expect(build).to.throw(/parallel group/);
        });
    });
});
