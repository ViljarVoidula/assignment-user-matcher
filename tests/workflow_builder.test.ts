import { expect } from 'chai';
import { workflow, linearWorkflow } from '../src/workflow-builder';

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
});
