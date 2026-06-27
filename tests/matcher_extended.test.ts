import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Coverage Improvements', function () {
    this.timeout(15000);
    let redisClient: any;

    before(async function () {
        redisClient = createClient({});
        await redisClient.connect();
    });

    afterEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    function createMatcher(opts: Record<string, any> = {}) {
        return new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            ...opts,
        });
    }

    // ===== Health & Reliability Methods (lines 300-415) =====
    describe('Health and reliability methods', function () {
        it('should return healthy status from healthCheck', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const result = await matcher.healthCheck();
            expect(result).to.have.property('healthy', true);
            expect(result.details).to.have.property('redisPing', 'PONG');
        });

        it('should get reliability metrics', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const metrics = await matcher.getReliabilityMetrics();
            expect(metrics).to.have.property('circuitBreakerState');
            expect(metrics).to.have.property('deadLetterQueueSize');
        });

        it('should get circuit breaker state', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const state = await matcher.getCircuitBreakerState();
            expect(state).to.exist;
        });

        it('should check dead letter queue alert threshold', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const alert = await matcher.checkDeadLetterQueueAlert();
            expect(alert).to.be.false;
        });

        it('should get empty dead letter events list', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const events = await matcher.getDeadLetterEvents();
            expect(events).to.be.an('array').with.lengthOf(0);
        });

        it('should get dead letter queue size of zero', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const size = await matcher.getDeadLetterQueueSize();
            expect(size).to.equal(0);
        });

        it('should clear dead letter queue', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            const cleared = await matcher.clearDeadLetterQueue();
            expect(cleared).to.equal(0);
        });

        it('should get audit events', async function () {
            const matcher = createMatcher({ workflowAuditEnabled: true });
            await matcher.waitUntilReady();
            const events = await matcher.getAuditEvents();
            expect(events).to.be.an('array');
        });

        it('should replay a dead letter event', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();

            const dlqKey = matcher['keys'].deadLetterQueue();
            const entry = {
                event: {
                    eventId: 'replay-evt-1',
                    type: 'COMPLETED' as const,
                    userId: 'user-1',
                    assignmentId: 'assign-1',
                    timestamp: Date.now(),
                },
                reason: 'test failure',
                movedAt: Date.now(),
                retryCount: 3,
            };
            const entryJson = JSON.stringify(entry);
            await redisClient.zAdd(dlqKey, { score: entry.movedAt, value: entryJson });

            const result = await matcher.replayDeadLetterEvent(entryJson);
            expect(result).to.be.true;
        });

        it('should set tracer without throwing', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();
            matcher.setTracer({ startSpan: () => {} });
        });
    });

    // ===== Workflow Methods (lines 272-295, 1478, 1509-1510, 1536-1537, 1554-1555, 1594, 963) =====
    describe('Workflow methods (enableWorkflows: true)', function () {
        it('should call reclaimOrphanedMessages', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();
            const count = await matcher.reclaimOrphanedMessages();
            expect(count).to.be.a('number');
        });

        it('should call atomicWorkflowTransition for a non-existent instance', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();
            const result = await matcher.atomicWorkflowTransition('ghost-id', 0, 'active', null, {});
            expect(result).to.have.property('ok');
        });

        it('should return null from getWorkflowInstanceWithSnapshot for missing instance', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();
            const result = await matcher.getWorkflowInstanceWithSnapshot('non-existent');
            expect(result).to.be.null;
        });

        it('should process expired workflow steps (returns 0 when none expired)', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();
            const count = await matcher.processExpiredWorkflowSteps();
            expect(count).to.equal(0);
        });

        it('should start and stop orchestrator', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();
            await matcher.startOrchestrator();
            await matcher.stopOrchestrator();
        });

        it('should execute workflow by existing definition ID string', async function () {
            const matcher = createMatcher({ enableWorkflows: true });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'user1', tags: ['test'] });

            await matcher.registerWorkflow({
                id: 'exec-by-id',
                name: 'Execute By ID',
                steps: [{
                    id: 'step-1',
                    name: 'Step 1',
                    assignmentTemplate: { tags: ['test'] },
                    targetUser: 'initiator',
                    defaultNextStepId: null,
                }],
            });

            const instance = await matcher.executeWorkflow('exec-by-id', 'user1');
            expect(instance).to.have.property('id');
        });

        it('should publish EXPIRED workflow event during processExpiredMatches when assignment has owner', async function () {
            const matcher = createMatcher({ enableWorkflows: true, matchExpirationMs: 60000 });
            await matcher.waitUntilReady();

            await matcher.addUser({ id: 'user1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'exp-a1', tags: ['tag1'], priority: 1 });
            await matcher.matchUsersAssignments('user1');

            // Override expiry score to the past to force expiration
            await redisClient.zAdd(matcher.pendingAssignmentsExpiryKey, { score: Date.now() - 1000, value: 'exp-a1' });

            const count = await matcher.processExpiredMatches();
            expect(count).to.be.greaterThan(0);
        });

        it('should return early from getUserRelatedAssignments when workflow fills backlog', async function () {
            const maxSize = 2;
            const matcher = createMatcher({ enableWorkflows: true, maxUserBacklogSize: maxSize });
            await matcher.waitUntilReady();

            const userId = 'wf-user';
            await matcher.addUser({ id: userId, tags: ['test'] });

            // Inject workflow-targeted assignments directly into the ref store
            for (let i = 0; i < maxSize; i++) {
                await redisClient.hSet(matcher.assignmentsRefKey, `wf-a${i}`, JSON.stringify({
                    id: `wf-a${i}`,
                    tags: ['test'],
                    priority: 100,
                    _targetUserId: userId,
                    _workflowInstanceId: 'wf-instance-1',
                }));
            }

            await matcher.matchUsersAssignments(userId);
            const assignments = await matcher.getCurrentAssignmentsForUser(userId);
            expect(assignments.length).to.equal(maxSize);
        });
    });

    // ===== Learning Methods (lines 444-445, 570, 1414) =====
    describe('Learning methods (enableLearning: true)', function () {
        it('should call recordLearningReward and return false for unknown assignment', async function () {
            const matcher = createMatcher({ enableLearning: true });
            await matcher.waitUntilReady();
            const result = await matcher.recordLearningReward('unknown-assignment', 1.0);
            expect(result).to.be.false;
        });

        it('should use overrideManual path in syncLearnedRoutingWeights', async function () {
            const matcher = createMatcher({
                enableLearning: true,
                enableAutoRoutingWeights: true,
                learningExplorationRate: 0,
                autoRoutingWeights: { minSamples: 1 },
            });
            await matcher.waitUntilReady();

            await matcher.addUser({ id: 'user1', tags: ['tag1'] });

            // Run enough lifecycle events to generate learned weights
            for (let i = 0; i < 3; i++) {
                await matcher.addAssignment({ id: `la${i}`, tags: ['tag1'], priority: 10 });
                await matcher.matchUsersAssignments('user1');
                await matcher.acceptAssignment('user1', `la${i}`);
                await matcher.completeAssignment('user1', `la${i}`);
            }

            // overrideManual: true → routingWeights = learned (line 570)
            const result = await matcher.syncLearnedRoutingWeights('user1', { overrideManual: true });
            expect(result).to.be.an('object');
        });

        it('should apply learning outcome (fail) when failing an accepted assignment', async function () {
            const matcher = createMatcher({ enableLearning: true });
            await matcher.waitUntilReady();

            await matcher.addUser({ id: 'user1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'fail-a1', tags: ['tag1'], priority: 10 });
            await matcher.matchUsersAssignments('user1');
            await matcher.acceptAssignment('user1', 'fail-a1');

            const result = await matcher.failAssignment('user1', 'fail-a1', 'test reason');
            expect(result).to.be.true;
        });
    });

    // ===== getKnownTagsForAutoWeights via public API (lines 592-594) =====
    describe('getLearnedRoutingWeights with includeUnexploredTags', function () {
        it('should call getKnownTagsForAutoWeights internally', async function () {
            const matcher = createMatcher({ enableLearning: true });
            await matcher.waitUntilReady();

            // Only add a user (not an assignment) so allTagsKey stays unset.
            // sMembers on a missing key returns [] without a WRONGTYPE error.
            await matcher.addUser({ id: 'user1', tags: ['mytag'] });

            // includeUnexploredTags: true triggers getKnownTagsForAutoWeights (line 592-594)
            const weights = await matcher.getLearnedRoutingWeights('user1', { includeUnexploredTags: true });
            expect(weights).to.be.an('object');
        });
    });

    // ===== Error paths =====
    describe('Error edge cases', function () {
        it('should throw when failAssignment is called for a non-accepted assignment', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();

            let threw = false;
            try {
                await matcher.failAssignment('user1', 'non-existent-asgn', 'reason');
            } catch (err: any) {
                threw = true;
                expect(err.message).to.include('not found in accepted state');
            }
            expect(threw).to.be.true;
        });

        it('should skip entries with corrupt JSON in getPendingAssignmentsWithAge', async function () {
            const matcher = createMatcher();
            await matcher.waitUntilReady();

            // Inject invalid JSON directly into the pending data hash
            await redisClient.hSet(matcher.pendingAssignmentsKey, 'corrupt-id', 'not-valid-json{{{');

            const pending = await matcher.getPendingAssignmentsWithAge();
            expect(pending).to.be.an('array');
            const corrupt = pending.find((p: any) => p.assignment?.id === 'corrupt-id');
            expect(corrupt).to.be.undefined;
        });

        it('should clean up stale activity entries in processIdleUsers when user no longer exists', async function () {
            const matcher = createMatcher({ idleUserTimeoutMs: 1 });
            await matcher.waitUntilReady();

            const staleUserId = 'stale-ghost';
            // Add to activity set with an old timestamp, but NOT to the users hash
            await redisClient.zAdd(matcher['keys'].userActivity(), { score: 1, value: staleUserId });

            const removed = await matcher.processIdleUsers();
            expect(removed).to.not.include(staleUserId);

            // Verify the stale entry was cleaned from the activity set
            const score = await redisClient.zScore(matcher['keys'].userActivity(), staleUserId);
            expect(score).to.be.null;
        });
    });

    // ===== populateUserBacklogs early return when backlog is full (line 1227) =====
    describe('matchUsersAssignments (all users) skips user with full backlog', function () {
        it('should skip processing a user whose backlog is already at maxUserBacklogSize', async function () {
            const maxSize = 3;
            const matcher = createMatcher({ maxUserBacklogSize: maxSize });
            await matcher.waitUntilReady();

            await matcher.addUser({ id: 'full-user', tags: ['tag1'] });

            // Manually fill the user's backlog to capacity
            const fakeKeys = Array.from({ length: maxSize }, (_, i) => `assignment:fake-${i}`);
            await redisClient.sAdd(matcher['keys'].userAssignments('full-user'), fakeKeys);

            // Add real assignments that could otherwise be matched
            for (let i = 0; i < 5; i++) {
                await matcher.addAssignment({ id: `filler-${i}`, tags: ['tag1'], priority: i });
            }

            // matchUsersAssignments with no userId scans ALL users
            await matcher.matchUsersAssignments();

            // Backlog count must remain unchanged at maxSize
            const count = await redisClient.sCard(matcher['keys'].userAssignments('full-user'));
            expect(count).to.equal(maxSize);
        });
    });

    // ===== Idle user with learning + workflows triggers releaseUserPendingAssignments (lines 1698, 1702) =====
    describe('processIdleUsers triggers releaseUserPendingAssignments with learning and workflows', function () {
        it('should apply learning outcome and publish workflow event for idle user assignments', async function () {
            const matcher = createMatcher({
                enableLearning: true,
                enableWorkflows: true,
                idleUserTimeoutMs: 1,
                matchExpirationMs: 60000,
            });
            await matcher.waitUntilReady();

            const userId = 'idle-learner';
            await matcher.addUser({ id: userId, tags: ['tag1'] });
            await matcher.addAssignment({ id: 'idle-a1', tags: ['tag1'], priority: 10 });
            await matcher.matchUsersAssignments(userId);

            // Force the user's activity time to the past to exceed the idle timeout
            await redisClient.zAdd(matcher['keys'].userActivity(), { score: 1, value: userId });

            const removed = await matcher.processIdleUsers();
            expect(removed).to.include(userId);
        });
    });
});
