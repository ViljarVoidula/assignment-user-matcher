import { expect } from 'chai';
import { WorkflowBuilder, approvalWorkflow, linearWorkflow, workflow } from '../src/workflow-builder';

describe('WorkflowBuilder', function () {
    it('should default taskType to assignment', function () {
        const definition = workflow('wf-builder-1', 'Builder 1')
            .step('s1')
            .name('Step 1')
            .assignment({ tags: ['a'] })
            .targetUser('initiator')
            .done()
            .initialStep('s1')
            .build();

        expect(definition.steps[0].taskType).to.equal('assignment');
    });

    it('should configure step builder properties before completing the step', function () {
        const builder = WorkflowBuilder.create('wf-step-config', 'Step Config');
        const stepBuilder = builder
            .step('review')
            .taskType('assignment')
            .name('Review Step')
            .assignment({ tags: ['review'], title: 'Review item' })
            .targetUser({ tag: 'reviewers' })
            .route('result.approved === true', 'approved')
            .route('result.approved === false', 'rejected')
            .defaultNext(null)
            .parallel(['approved', 'rejected'])
            .waitForAll()
            .failurePolicy('continue')
            .maxRetries(3)
            .timeout(5000);

        const step = stepBuilder._getStep();

        expect(step.id).to.equal('review');
        expect(step.name).to.equal('Review Step');
        expect(step.taskType).to.equal('assignment');
        expect(step.assignmentTemplate).to.deep.equal({ tags: ['review'], title: 'Review item' });
        expect(step.targetUser).to.deep.equal({ tag: 'reviewers' });
        expect(step.routing).to.deep.equal([
            { condition: 'result.approved === true', targetStepId: 'approved' },
            { condition: 'result.approved === false', targetStepId: 'rejected' },
        ]);
        expect(step.defaultNextStepId).to.equal(null);
        expect(step.parallelStepIds).to.deep.equal(['approved', 'rejected']);
        expect(step.waitForAll).to.equal(true);
        expect(step.failurePolicy).to.equal('continue');
        expect(step.maxRetries).to.equal(3);
        expect(step.timeoutMs).to.equal(5000);
    });

    it('should build machine task steps', function () {
        const definition = workflow('wf-builder-machine', 'Builder Machine')
            .step('s1')
            .name('Machine Step')
            .machineTask('ml.infer', { model: 'v1' })
            .defaultNext(null)
            .done()
            .initialStep('s1')
            .build();

        expect(definition.steps[0].taskType).to.equal('machine');
        expect(definition.steps[0].machineTask?.handler).to.equal('ml.infer');
        expect(definition.steps[0].machineTask?.input).to.deep.equal({ model: 'v1' });
    });

    it('should throw when finishing a machine step without a handler', function () {
        expect(() => {
            workflow('wf-builder-invalid-machine', 'Invalid Machine').step('s1').taskType('machine').done();
        }).to.throw('Machine step "s1" requires machineTask(handler)');
    });

    it('should build a workflow with metadata, default timeout, and inferred initial step', function () {
        const definition = WorkflowBuilder.create('wf-builder-configured', 'Configured Workflow')
            .version(7)
            .metadata({ team: 'ops', priority: 'high' })
            .defaultTimeout(30000)
            .addStep({
                id: 'start',
                name: 'Start',
                taskType: 'assignment',
                assignmentTemplate: { tags: ['start'] },
                targetUser: 'initiator',
                defaultNextStepId: 'finish',
            })
            .step('finish')
            .name('Finish')
            .assignment({ tags: ['done'] })
            .targetUser('previous')
            .waitForAll(false)
            .done()
            .build();

        expect(definition.version).to.equal(7);
        expect(definition.metadata).to.deep.equal({ team: 'ops', priority: 'high' });
        expect(definition.defaultTimeoutMs).to.equal(30000);
        expect(definition.initialStepId).to.equal('start');
        expect(definition.steps).to.have.length(2);
        expect(definition.steps[1].targetUser).to.equal('previous');
        expect(definition.steps[1].waitForAll).to.equal(false);
    });

    it('should validate required workflow fields and references during build', function () {
        expect(() => workflow('', 'Missing ID').step('s1').done().build()).to.throw('Workflow ID is required');

        expect(() => workflow('wf-missing-name', '').step('s1').done().build()).to.throw('Workflow name is required');

        expect(() => workflow('wf-no-steps', 'No Steps').build()).to.throw('Workflow must have at least one step');

        expect(() => {
            workflow('wf-missing-initial', 'Missing Initial').step('s1').done().initialStep('missing').build();
        }).to.throw('Initial step "missing" not found');

        expect(() => {
            WorkflowBuilder.create('wf-bad-machine', 'Bad Machine')
                .addStep({
                    id: 'machine',
                    name: 'Broken Machine',
                    taskType: 'machine',
                    assignmentTemplate: {},
                    targetUser: 'initiator',
                } as any)
                .build();
        }).to.throw('Step "machine" has taskType "machine" but no machineTask.handler');

        expect(() => {
            workflow('wf-bad-route', 'Bad Route').step('start').route('true', 'missing').done().build();
        }).to.throw('Step "start" references non-existent step "missing" in routing');

        expect(() => {
            workflow('wf-bad-default-next', 'Bad Default Next').step('start').defaultNext('missing').done().build();
        }).to.throw('Step "start" references non-existent step "missing" as default next');

        expect(() => {
            workflow('wf-bad-parallel', 'Bad Parallel').step('start').parallel(['missing']).done().build();
        }).to.throw('Step "start" references non-existent parallel step "missing"');
    });

    it('should support machine task metadata in linearWorkflow', function () {
        const definition = linearWorkflow('wf-linear-machine', 'Linear Machine', [
            {
                id: 's1',
                name: 'Machine',
                assignment: {},
                taskType: 'machine',
                machineTask: { handler: 'code.execute' },
            },
            {
                id: 's2',
                name: 'Human',
                assignment: { tags: ['human'] },
                targetUser: 'initiator',
            },
        ]);

        expect(definition.steps[0].taskType).to.equal('machine');
        expect(definition.steps[0].machineTask?.handler).to.equal('code.execute');
        expect(definition.steps[1].taskType).to.equal('assignment');
    });

    it('should build linear workflows with chaining, defaults, and timeout overrides', function () {
        const definition = linearWorkflow('wf-linear-config', 'Linear Config', [
            {
                id: 's1',
                name: 'Collect',
                assignment: { tags: ['collect'] },
                timeoutMs: 1500,
            },
            {
                id: 's2',
                name: 'Verify',
                assignment: { tags: ['verify'] },
                targetUser: { tag: 'verifiers' },
            },
            {
                id: 's3',
                name: 'Close',
                assignment: { tags: ['close'] },
                targetUser: 'previous',
            },
        ]);

        expect(definition.initialStepId).to.equal('s1');
        expect(definition.steps[0].targetUser).to.equal('initiator');
        expect(definition.steps[0].defaultNextStepId).to.equal('s2');
        expect(definition.steps[0].timeoutMs).to.equal(1500);
        expect(definition.steps[1].targetUser).to.deep.equal({ tag: 'verifiers' });
        expect(definition.steps[1].defaultNextStepId).to.equal('s3');
        expect(definition.steps[2].targetUser).to.equal('previous');
        expect(definition.steps[2].defaultNextStepId).to.equal(null);
    });

    it('should reject empty linear workflows', function () {
        expect(() => linearWorkflow('wf-linear-empty', 'Linear Empty', [])).to.throw(
            'Linear workflow must have at least one step',
        );
    });

    it('should build approval workflows with defaults', function () {
        const definition = approvalWorkflow('wf-approval-default', 'Approval Default', {
            submitAssignment: { tags: ['submit'], title: 'Submit request' },
            reviewAssignment: { tags: ['review'], title: 'Review request' },
        });

        expect(definition.initialStepId).to.equal('submit');
        expect(definition.steps.map((step) => step.id)).to.deep.equal(['submit', 'review', 'complete', 'rejected']);
        expect(definition.steps[1].targetUser).to.equal('initiator');
        expect(definition.steps[1].timeoutMs).to.equal(86400000);
        expect(definition.steps[1].routing).to.deep.equal([
            { condition: 'result.decision === "approve"', targetStepId: 'complete' },
            { condition: 'result.decision === "reject"', targetStepId: 'rejected' },
        ]);
        expect(definition.steps[2].assignmentTemplate).to.deep.equal({
            tags: ['notification'],
            title: 'Approved',
        });
        expect(definition.steps[3].assignmentTemplate).to.deep.equal({
            tags: ['notification'],
            title: 'Rejected',
        });
    });

    it('should build approval workflows with overrides', function () {
        const definition = approvalWorkflow('wf-approval-custom', 'Approval Custom', {
            submitAssignment: { tags: ['submit'], title: 'Submit request' },
            reviewAssignment: { tags: ['review'], title: 'Review request' },
            completeAssignment: { tags: ['done'], title: 'Completed' },
            rejectedAssignment: { tags: ['reject'], title: 'Rejected custom' },
            reviewerTag: 'team:reviewers',
            reviewTimeoutMs: 45000,
        });

        expect(definition.steps[1].targetUser).to.deep.equal({ tag: 'team:reviewers' });
        expect(definition.steps[1].timeoutMs).to.equal(45000);
        expect(definition.steps[2].assignmentTemplate).to.deep.equal({
            tags: ['done'],
            title: 'Completed',
        });
        expect(definition.steps[3].assignmentTemplate).to.deep.equal({
            tags: ['reject'],
            title: 'Rejected custom',
        });
    });
});
