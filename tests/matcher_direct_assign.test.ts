import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

async function expectRejection(promise: Promise<unknown>, messagePart: string) {
    try {
        await promise;
    } catch (err: any) {
        expect(err.message).to.include(messagePart);
        return;
    }
    throw new Error(`Expected rejection containing "${messagePart}"`);
}

describe('Direct Assignment (assignToUser) Tests', async function () {
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

    const PREFIX = 'test:direct:';

    function createMatcher(options: Record<string, unknown> = {}) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: PREFIX,
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            ...options,
        });
    }

    describe('queued assignments', function () {
        it('moves a queued assignment to the user pending state and cleans queue indexes', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1', 't2'], priority: 50 });

            const result = await matcher.assignToUser('a1', 'u1');
            expect(result.previousOwnerId).to.equal(null);

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(0);
            expect(counts.pending).to.equal(1);

            // Queue indexes are gone, exactly like an organic claim
            expect(await redisClient.hGet(`${PREFIX}assignments:ref`, 'a1')).to.equal(null);
            expect(await redisClient.zScore(`${PREFIX}assignments`, 'a1')).to.equal(null);
            expect(await redisClient.zScore(`${PREFIX}tag:t1:assignments`, 'a1')).to.equal(null);
            expect(await redisClient.zScore(`${PREFIX}tag:t2:assignments`, 'a1')).to.equal(null);
        });

        it('assigns to a user the tag model would never pick (supervisor decides)', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['other'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });

            await matcher.assignToUser('a1', 'u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });

        it('follows normal lifecycle after direct assignment (accept/complete)', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });

            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');
            await matcher.completeAssignment('u1', 'a1');
            const counts = await matcher.getAssignmentCounts();
            expect(counts.pending).to.equal(0);
            expect(counts.accepted).to.equal(0);
        });
    });

    describe('reassigning pending work', function () {
        it('transfers a pending assignment between users and releases the old backlog slot', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addUser({ id: 'u2', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });
            await matcher.matchUsersAssignments('u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);

            const result = await matcher.assignToUser('a1', 'u2');
            expect(result.previousOwnerId).to.equal('u1');

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await matcher.getCurrentAssignmentsForUser('u2')).to.deep.equal(['a1']);
            expect(await redisClient.hGet(`${PREFIX}assignments:pending:owner`, 'a1')).to.equal('u2');
        });

        it('is a no-op when the user already owns the assignment', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.assignToUser('a1', 'u1');
            expect(result.previousOwnerId).to.equal('u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });
    });

    describe('validation', function () {
        it('rejects an unknown user', async function () {
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });
            await expectRejection(matcher.assignToUser('a1', 'ghost'), 'User not found');
        });

        it('rejects an unknown assignment', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await expectRejection(matcher.assignToUser('ghost', 'u1'), 'not found');
        });

        it('rejects an accepted assignment', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addUser({ id: 'u2', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            await expectRejection(matcher.assignToUser('a1', 'u2'), 'not found');
        });

        it('rejects a paused user unless forced', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.pauseUser('u1');
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });

            await expectRejection(matcher.assignToUser('a1', 'u1'), 'paused');
            await matcher.assignToUser('a1', 'u1', { force: true });
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });

        it('rejects a full backlog unless forced', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'], maxBacklogSize: 1 });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });
            await matcher.addAssignment({ id: 'a2', tags: ['t1'], priority: 40 });
            await matcher.assignToUser('a1', 'u1');

            await expectRejection(matcher.assignToUser('a2', 'u1'), 'backlog');
            await matcher.assignToUser('a2', 'u1', { force: true });
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(2);
        });

        it('rejects a vetoed user unless forced', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50, vetoedUsers: ['u1'] });

            await expectRejection(matcher.assignToUser('a1', 'u1'), 'vetoed');
            await matcher.assignToUser('a1', 'u1', { force: true });
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });

        it('rejects a user who previously rejected the assignment unless forced', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });
            await matcher.matchUsersAssignments('u1');
            await matcher.rejectAssignment('u1', 'a1');

            await expectRejection(matcher.assignToUser('a1', 'u1'), 'rejected');
            await matcher.assignToUser('a1', 'u1', { force: true });
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });
    });

    describe('decision traces', function () {
        it('records a manual decision trace for the supervisor override', async function () {
            const matcher = createMatcher({ enableDecisionTraces: true });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 50 });

            await matcher.assignToUser('a1', 'u1');

            const traces = await matcher.getDecisionTraces({ assignmentId: 'a1' });
            expect(traces).to.have.length(1);
            expect(traces[0].mode).to.equal('manual');
            expect(traces[0].chosenUserId).to.equal('u1');
            expect(traces[0].candidates[0].reasons.map((r) => r.kind)).to.include('manualAssignment');
        });
    });
});
