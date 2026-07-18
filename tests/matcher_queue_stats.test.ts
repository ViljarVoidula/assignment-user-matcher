import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Queue Stats (getQueueStats) Tests', async function () {
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
            redisPrefix: 'test:qstats:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            ...options,
        });
    }

    it('reports zero counts and no wait age on an empty workspace', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });

        const stats = await matcher.getQueueStats();
        expect(stats.queued).to.equal(0);
        expect(stats.pending).to.equal(0);
        expect(stats.oldestWaitingMs).to.equal(null);
        expect(stats.perUser).to.deep.equal([{ userId: 'u1', backlog: 0, maxBacklogSize: 5, paused: false }]);
    });

    it('tracks queued counts and the oldest waiting age', async function () {
        const matcher = createMatcher();
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 10 });
        await sleep(30);
        await matcher.addAssignment({ id: 'a2', tags: ['t1'], priority: 90 });

        const stats = await matcher.getQueueStats();
        expect(stats.queued).to.equal(2);
        // The oldest is a1 (added first), regardless of priority
        expect(stats.oldestWaitingMs).to.be.a('number');
        expect(stats.oldestWaitingMs!).to.be.at.least(30);
    });

    it('keeps counting while an assignment is pending and stops on accept', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 10 });
        await matcher.matchUsersAssignments();

        let stats = await matcher.getQueueStats();
        expect(stats.queued).to.equal(0);
        expect(stats.pending).to.equal(1);
        expect(stats.oldestWaitingMs).to.be.a('number');

        await matcher.acceptAssignment('u1', 'a1');
        stats = await matcher.getQueueStats();
        expect(stats.pending).to.equal(0);
        expect(stats.oldestWaitingMs).to.equal(null);
    });

    it('preserves the original wait clock across a reject-requeue cycle', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 10 });
        await sleep(40);
        await matcher.matchUsersAssignments();
        await matcher.rejectAssignment('u1', 'a1');

        const stats = await matcher.getQueueStats();
        expect(stats.queued).to.equal(1);
        // Still measured from the original enqueue, not the requeue
        expect(stats.oldestWaitingMs!).to.be.at.least(40);
    });

    it('clears the wait clock when an assignment is removed', async function () {
        const matcher = createMatcher();
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 10 });
        await matcher.removeAssignment('a1');

        const stats = await matcher.getQueueStats();
        expect(stats.queued).to.equal(0);
        expect(stats.oldestWaitingMs).to.equal(null);
    });

    it('reports per-user load, effective caps, and paused state', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'busy', tags: ['t1'], maxBacklogSize: 2 });
        await matcher.addUser({ id: 'idle', tags: ['nope'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t1'], priority: 10 });
        await matcher.matchUsersAssignments();
        await matcher.pauseUser('idle');

        const stats = await matcher.getQueueStats();
        const byId = new Map(stats.perUser.map((u) => [u.userId, u]));
        expect(byId.get('busy')).to.deep.equal({ userId: 'busy', backlog: 1, maxBacklogSize: 2, paused: false });
        expect(byId.get('idle')).to.deep.equal({ userId: 'idle', backlog: 0, maxBacklogSize: 5, paused: true });
    });
});
