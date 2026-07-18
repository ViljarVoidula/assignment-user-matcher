import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Worker Availability (pause/resume) Tests', async function () {
    let redisClient: any;

    before(async function () {
        redisClient = createClient({
            url: 'redis://localhost:6379',
        });
        await redisClient.connect();
        await redisClient.flushDb();
    });

    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
    });

    function createMatcher(options: Record<string, unknown> = {}) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: 'test:avail:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            ...options,
        });
    }

    describe('pauseUser / resumeUser state', function () {
        it('reports paused state and lists paused users', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addUser({ id: 'u2', tags: ['t1'] });

            expect(await matcher.isUserPaused('u1')).to.equal(false);
            expect(await matcher.pauseUser('u1')).to.equal(true);
            expect(await matcher.isUserPaused('u1')).to.equal(true);
            expect(await matcher.getPausedUsers()).to.deep.equal(['u1']);

            expect(await matcher.resumeUser('u1')).to.equal(true);
            expect(await matcher.isUserPaused('u1')).to.equal(false);
            expect(await matcher.getPausedUsers()).to.deep.equal([]);
        });

        it('pauseUser returns false for an unknown user and does not track it', async function () {
            const matcher = createMatcher();
            expect(await matcher.pauseUser('ghost')).to.equal(false);
            expect(await matcher.getPausedUsers()).to.deep.equal([]);
        });

        it('resumeUser returns false when the user was not paused', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            expect(await matcher.resumeUser('u1')).to.equal(false);
        });

        it('pauseUser is idempotent', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            expect(await matcher.pauseUser('u1')).to.equal(true);
            expect(await matcher.pauseUser('u1')).to.equal(true);
            expect(await matcher.getPausedUsers()).to.deep.equal(['u1']);
        });

        it('removeUser cleans up the paused marker', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.pauseUser('u1');
            await matcher.removeUser('u1');
            expect(await matcher.getPausedUsers()).to.deep.equal([]);
            expect(await matcher.isUserPaused('u1')).to.equal(false);
        });
    });

    describe('matching skips paused users', function () {
        it('bulk parallel path routes around a paused user', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'paused', tags: ['t1'] });
            await matcher.addUser({ id: 'active', tags: ['t1'] });
            await matcher.pauseUser('paused');

            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('paused')).to.deep.equal([]);
            expect(await matcher.getCurrentAssignmentsForUser('active')).to.deep.equal(['a1']);
        });

        it('per-user path is a no-op for a paused user', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.pauseUser('u1');

            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments('u1');

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal([]);
            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(1);
        });

        it('fair path routes around a paused user', async function () {
            const matcher = createMatcher({ fairness: 'best-match' });
            // The paused user is the better match; the active user must win anyway.
            await matcher.addUser({ id: 'paused', tags: [], routingWeights: { t1: 100 } });
            await matcher.addUser({ id: 'active', tags: [], routingWeights: { t1: 10 } });
            await matcher.pauseUser('paused');

            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('paused')).to.deep.equal([]);
            expect(await matcher.getCurrentAssignmentsForUser('active')).to.deep.equal(['a1']);
        });

        it('an assignment stays queued when every eligible user is paused, then routes on resume', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.pauseUser('u1');

            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments();
            expect((await matcher.getAssignmentCounts()).queued).to.equal(1);

            await matcher.resumeUser('u1');
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });
    });

    describe('pause preserves in-flight work', function () {
        it('keeps the backlog and allows accept/complete while paused', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);

            await matcher.pauseUser('u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);

            await matcher.acceptAssignment('u1', 'a1');
            await matcher.completeAssignment('u1', 'a1');
            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted).to.equal(0);
            expect(counts.queued).to.equal(0);
        });

        it('exempts paused users from idle auto-removal', async function () {
            const matcher = createMatcher({ idleUserTimeoutMs: 50 });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments();
            await matcher.pauseUser('u1');

            await sleep(80);
            const removed = await matcher.processIdleUsers();
            expect(removed).to.deep.equal([]);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });
    });

    describe('decision traces', function () {
        it('records the paused user struck out with a paused reason', async function () {
            const matcher = createMatcher({ enableDecisionTraces: true });
            await matcher.addUser({ id: 'paused', tags: ['t1'] });
            await matcher.addUser({ id: 'active', tags: ['t1'] });
            await matcher.pauseUser('paused');

            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces({ assignmentId: 'a1' });
            expect(traces).to.have.length(1);
            expect(traces[0].chosenUserId).to.equal('active');

            const pausedCandidate = traces[0].candidates.find((c) => c.userId === 'paused');
            expect(pausedCandidate, 'paused user should appear in the trace').to.not.equal(undefined);
            expect(pausedCandidate!.eligible).to.equal(false);
            expect(pausedCandidate!.reasons.map((r) => r.kind)).to.include('paused');
        });

        it('explainMatch reports a queued assignment as ineligible for a paused user', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.pauseUser('u1');
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 100 });

            const explanation = await matcher.explainMatch('a1');
            const candidate = explanation.candidates.find((c) => c.userId === 'u1');
            expect(candidate).to.not.equal(undefined);
            expect(candidate!.eligible).to.equal(false);
            expect(candidate!.reasons.map((r) => r.kind)).to.include('paused');
        });
    });
});
