import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import type { WorkflowDefinition } from '../src/types/matcher';

describe('Workflow Tests', function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 8,
            relevantBatchSize: 10,
            enableWorkflows: true,
            matchExpirationMs: 60000,
        });
        await matcher.redisClient.flushAll();
    });

    after(async function () {
        await matcher.stopOrchestrator();
        await matcher.redisClient.flushAll();
        await redisClient.quit();
    });

    describe('Workflow Definition Management', function () {
        it('Should register a workflow definition', async function () {
            const definition: WorkflowDefinition = {
                id: 'onboarding-v1',
                name: 'User Onboarding',
                version: 1,
                initialStepId: 'step-1',
                steps: [
                    {
                        id: 'step-1',
                        name: 'Profile Setup',
                        assignmentTemplate: {
                            tags: ['onboarding', 'profile'],
                        },
                        targetUser: 'initiator',
                        defaultNextStepId: 'step-2',
                    },
                    {
                        id: 'step-2',
                        name: 'Identity Verification',
                        assignmentTemplate: {
                            tags: ['onboarding', 'verification'],
                        },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            const result = await matcher.registerWorkflow(definition);
            expect(result).to.deep.equal(definition);
        });

        it('Should retrieve a registered workflow definition', async function () {
            const definition = await matcher.getWorkflowDefinition('onboarding-v1');
            expect(definition).to.not.be.null;
            expect(definition?.name).to.equal('User Onboarding');
            expect(definition?.steps).to.have.lengthOf(2);
        });

        it('Should list all workflow definitions', async function () {
            const definitions = await matcher.listWorkflowDefinitions();
            expect(definitions).to.be.an('array');
            expect(definitions.some((d) => d.id === 'onboarding-v1')).to.be.true;
        });

        it('Should return null for non-existent workflow', async function () {
            const definition = await matcher.getWorkflowDefinition('non-existent');
            expect(definition).to.be.null;
        });
    });

    describe('Workflow Instance Lifecycle', function () {
        before(async function () {
            // Add a user for workflow tests
            await matcher.addUser({
                id: 'user-workflow-1',
                tags: ['onboarding'],
            });
        });

        it('Should start a workflow instance', async function () {
            const instance = await matcher.startWorkflow(
                'onboarding-v1',
                'user-workflow-1',
                { source: 'test' },
            );

            expect(instance).to.not.be.null;
            expect(instance.id).to.be.a('string');
            expect(instance.workflowDefinitionId).to.equal('onboarding-v1');
            expect(instance.initiatorUserId).to.equal('user-workflow-1');
            expect(instance.status).to.equal('active');
            expect(instance.currentStepId).to.equal('step-1');
            expect(instance.context.source).to.equal('test');
        });

        it('Should retrieve a workflow instance', async function () {
            const activeWorkflows = await matcher.getActiveWorkflowsForUser('user-workflow-1');
            expect(activeWorkflows).to.be.an('array');
            expect(activeWorkflows.length).to.be.greaterThan(0);

            const instance = await matcher.getWorkflowInstance(activeWorkflows[0].id);
            expect(instance).to.not.be.null;
            expect(instance?.status).to.equal('active');
        });

        it('Should create assignment for first workflow step', async function () {
            // The workflow should have created an assignment for the first step
            const assignments = await matcher.getCurrentAssignmentsForUser('user-workflow-1');
            expect(assignments.length).to.be.greaterThan(0);

            // Verify the assignment has workflow metadata
            const assignmentId = assignments[0];
            const assignment = await matcher.getAssignment(assignmentId);
            expect(assignment).to.not.be.null;
            expect(assignment?._workflowInstanceId).to.be.a('string');
            expect(assignment?._workflowStepId).to.equal('step-1');
        });

        it('Should cancel a workflow instance', async function () {
            // Start a new workflow to cancel
            const instance = await matcher.startWorkflow(
                'onboarding-v1',
                'user-workflow-1',
            );

            const result = await matcher.cancelWorkflow(instance.id);
            expect(result).to.be.true;

            const cancelled = await matcher.getWorkflowInstance(instance.id);
            expect(cancelled?.status).to.equal('cancelled');
        });

        it('Should throw error for non-existent workflow definition', async function () {
            try {
                await matcher.startWorkflow('non-existent', 'user-workflow-1');
                expect.fail('Should have thrown an error');
            } catch (err: any) {
                expect(err.message).to.include('Workflow definition not found');
            }
        });
    });

    describe('Complete Assignment with Result', function () {
        let testUserId: string;
        let testAssignmentId: string;

        before(async function () {
            testUserId = 'user-complete-test';
            await matcher.addUser({
                id: testUserId,
                tags: ['test'],
            });

            // Add and match an assignment
            const assignment = await matcher.addAssignment({
                id: 'complete-test-assignment',
                tags: ['test'],
                priority: 100,
            });
            testAssignmentId = assignment.id;

            await matcher.matchUsersAssignments(testUserId);
            await matcher.acceptAssignment(testUserId, testAssignmentId);
        });

        it('Should complete an assignment with result', async function () {
            const result = await matcher.completeAssignment(testUserId, testAssignmentId, {
                success: true,
                data: { score: 95, feedback: 'Great job!' },
            });

            expect(result).to.be.true;
        });

        it('Should throw error when completing non-accepted assignment', async function () {
            try {
                await matcher.completeAssignment(testUserId, 'non-existent');
                expect.fail('Should have thrown an error');
            } catch (err: any) {
                expect(err.message).to.include('not found in accepted state');
            }
        });
    });

    describe('Fail Assignment', function () {
        let testUserId: string;
        let testAssignmentId: string;

        before(async function () {
            testUserId = 'user-fail-test';
            await matcher.addUser({
                id: testUserId,
                tags: ['test-fail'],
            });

            const assignment = await matcher.addAssignment({
                id: 'fail-test-assignment',
                tags: ['test-fail'],
                priority: 100,
            });
            testAssignmentId = assignment.id;

            await matcher.matchUsersAssignments(testUserId);
            await matcher.acceptAssignment(testUserId, testAssignmentId);
        });

        it('Should fail an assignment with reason', async function () {
            const result = await matcher.failAssignment(
                testUserId,
                testAssignmentId,
                'Unable to complete due to technical issues',
            );

            expect(result).to.be.true;
        });
    });

    describe('Workflow with Branching', function () {
        before(async function () {
            // Register a workflow with branching logic
            const branchingWorkflow: WorkflowDefinition = {
                id: 'review-workflow',
                name: 'Review Workflow',
                version: 1,
                initialStepId: 'task',
                steps: [
                    {
                        id: 'task',
                        name: 'Main Task',
                        assignmentTemplate: {
                            tags: ['review', 'task'],
                        },
                        targetUser: 'initiator',
                        routing: [
                            {
                                condition: 'result.approved === true',
                                targetStepId: 'approved-step',
                            },
                            {
                                condition: 'result.approved === false',
                                targetStepId: 'rejected-step',
                            },
                        ],
                        defaultNextStepId: null,
                    },
                    {
                        id: 'approved-step',
                        name: 'Approved Followup',
                        assignmentTemplate: {
                            tags: ['review', 'approved'],
                        },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                    {
                        id: 'rejected-step',
                        name: 'Rejected Retry',
                        assignmentTemplate: {
                            tags: ['review', 'rejected'],
                        },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await matcher.registerWorkflow(branchingWorkflow);

            await matcher.addUser({
                id: 'user-branching',
                tags: ['review'],
            });
        });

        it('Should create workflow with branching definition', async function () {
            const definition = await matcher.getWorkflowDefinition('review-workflow');
            expect(definition).to.not.be.null;
            expect(definition?.steps[0].routing).to.have.lengthOf(2);
        });

        it('Should start workflow and create initial assignment', async function () {
            const instance = await matcher.startWorkflow('review-workflow', 'user-branching');
            expect(instance.currentStepId).to.equal('task');

            const assignments = await matcher.getCurrentAssignmentsForUser('user-branching');
            expect(assignments.length).to.be.greaterThan(0);
        });
    });

    describe('Workflow with Parallel Execution', function () {
        before(async function () {
            // Register a workflow with parallel steps
            const parallelWorkflow: WorkflowDefinition = {
                id: 'parallel-review',
                name: 'Parallel Review Workflow',
                version: 1,
                initialStepId: 'parallel-trigger',
                steps: [
                    {
                        id: 'parallel-trigger',
                        name: 'Trigger Parallel Reviews',
                        assignmentTemplate: {
                            tags: ['parallel'],
                        },
                        targetUser: 'initiator',
                        parallelStepIds: ['review-a', 'review-b'],
                        waitForAll: true,
                        defaultNextStepId: 'final-step',
                    },
                    {
                        id: 'review-a',
                        name: 'Review A',
                        assignmentTemplate: {
                            tags: ['parallel', 'review-a'],
                        },
                        targetUser: 'initiator',
                    },
                    {
                        id: 'review-b',
                        name: 'Review B',
                        assignmentTemplate: {
                            tags: ['parallel', 'review-b'],
                        },
                        targetUser: 'initiator',
                    },
                    {
                        id: 'final-step',
                        name: 'Final Aggregation',
                        assignmentTemplate: {
                            tags: ['parallel', 'final'],
                        },
                        targetUser: 'initiator',
                        defaultNextStepId: null,
                    },
                ],
            };

            await matcher.registerWorkflow(parallelWorkflow);

            await matcher.addUser({
                id: 'user-parallel',
                tags: ['parallel'],
            });
        });

        it('Should register parallel workflow correctly', async function () {
            const definition = await matcher.getWorkflowDefinition('parallel-review');
            expect(definition).to.not.be.null;
            expect(definition?.steps[0].parallelStepIds).to.deep.equal(['review-a', 'review-b']);
            expect(definition?.steps[0].waitForAll).to.be.true;
        });
    });

    describe('Deterministic Matching Priority', function () {
        let workflowUserId: string;

        before(async function () {
            workflowUserId = 'user-priority-test';
            await matcher.addUser({
                id: workflowUserId,
                tags: ['priority-test', 'general'],
            });

            // Add some general pool assignments
            for (let i = 0; i < 5; i++) {
                await matcher.addAssignment({
                    id: `general-${i}`,
                    tags: ['general'],
                    priority: 50,
                });
            }
        });

        it('Should prioritize workflow assignments over general pool', async function () {
            // Start a workflow which creates a targeted assignment
            await matcher.startWorkflow('onboarding-v1', workflowUserId);

            // Match assignments - workflow assignment should come first
            await matcher.matchUsersAssignments(workflowUserId);

            const assignments = await matcher.getCurrentAssignmentsForUser(workflowUserId);
            expect(assignments.length).to.be.greaterThan(0);

            // The first assignment should be from the workflow
            const firstAssignment = await matcher.getAssignment(assignments[0]);
            expect(firstAssignment?._workflowInstanceId).to.be.a('string');
        });
    });
});
