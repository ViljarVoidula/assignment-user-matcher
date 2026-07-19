import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

describe('Release User Assignments Tests', async function () {
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
            redisPrefix: 'test:release:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            ...options,
        });
    }

    it('requeues all pending assignments and returns their ids', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 1 });
        await matcher.addAssignment({ id: 'a2', tags: ['t1'], priority: 1 });
        await matcher.matchUsersAssignments('u1');
        expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.members(['a1', 'a2']);

        const released = await matcher.releaseUserAssignments('u1');
        expect(released).to.have.members(['a1', 'a2']);

        expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal([]);
        const counts = await matcher.getAssignmentCounts();
        expect(counts.queued).to.equal(2);
        expect(counts.pending).to.equal(0);
    });

    it('released assignments are matchable by another user (indexes restored)', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 1 });
        await matcher.matchUsersAssignments('u1');

        await matcher.releaseUserAssignments('u1');
        await matcher.pauseUser('u1');

        await matcher.addUser({ id: 'u2', tags: ['t1'] });
        await matcher.matchUsersAssignments('u2');
        expect(await matcher.getCurrentAssignmentsForUser('u2')).to.deep.equal(['a1']);
    });

    it('returns [] for a user holding nothing and for an unknown user', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        expect(await matcher.releaseUserAssignments('u1')).to.deep.equal([]);
        expect(await matcher.releaseUserAssignments('ghost')).to.deep.equal([]);
    });

    it('does not touch accepted assignments', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a-working', tags: ['t1'], priority: 2 });
        await matcher.addAssignment({ id: 'a-waiting', tags: ['t1'], priority: 1 });
        await matcher.matchUsersAssignments('u1');
        await matcher.acceptAssignment('u1', 'a-working');

        const released = await matcher.releaseUserAssignments('u1');
        expect(released).to.deep.equal(['a-waiting']);

        const counts = await matcher.getAssignmentCounts();
        expect(counts.accepted).to.equal(1);
        expect(counts.queued).to.equal(1);
    });

    it('preserves the original wait clock on release (queuedAt is not reset)', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 1 });
        const before = await redisClient.zScore('test:release:assignments:queuedAt', 'a1');
        expect(before).to.be.a('number');

        await matcher.matchUsersAssignments('u1');
        await matcher.releaseUserAssignments('u1');

        const after = await redisClient.zScore('test:release:assignments:queuedAt', 'a1');
        expect(after).to.equal(before);
    });

    it('a paused user with a released backlog gets nothing until resumed', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 1 });
        await matcher.matchUsersAssignments('u1');

        await matcher.pauseUser('u1');
        await matcher.releaseUserAssignments('u1');

        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal([]);
        expect((await matcher.getAssignmentCounts()).queued).to.equal(1);

        await matcher.resumeUser('u1');
        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
    });
});
