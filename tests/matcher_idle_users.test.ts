import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Idle User Auto-Rejection Tests', async function () {
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

    function createMatcher(idleUserTimeoutMs?: number) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: 'test:idle:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            idleUserTimeoutMs,
        });
    }

    it('should remove an idle user with unactioned assignments and requeue them', async function () {
        const matcher = createMatcher(50);

        await matcher.addUser({ id: 'user1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'task1', tags: ['tag1'], priority: 100 });

        await matcher.matchUsersAssignments();
        const assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.include('task1');

        // User goes idle past the timeout
        await sleep(80);

        const removed = await matcher.processIdleUsers();
        expect(removed).to.deep.equal(['user1']);

        // User removed from pool
        const users = await redisClient.hGetAll('test:idle:users');
        expect(users).to.not.have.property('user1');

        // Assignment is requeued and matchable by another user
        await matcher.addUser({ id: 'user2', tags: ['tag1'] });
        await matcher.matchUsersAssignments('user2');
        const assignments2 = await matcher.getCurrentAssignmentsForUser('user2');
        expect(assignments2).to.include('task1');
    });

    it('should not remove a user that keeps signalling activity', async function () {
        const matcher = createMatcher(100);

        await matcher.addUser({ id: 'user1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'task1', tags: ['tag1'], priority: 100 });
        await matcher.matchUsersAssignments();

        await sleep(60);
        await matcher.touchUser('user1'); // heartbeat resets idle clock
        await sleep(60);

        const removed = await matcher.processIdleUsers();
        expect(removed).to.deep.equal([]);

        const assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.include('task1');
    });

    it('should treat accept/reject as activity', async function () {
        const matcher = createMatcher(100);

        await matcher.addUser({ id: 'user1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'task1', tags: ['tag1'], priority: 100 });
        await matcher.addAssignment({ id: 'task2', tags: ['tag1'], priority: 90 });
        await matcher.matchUsersAssignments();

        await sleep(60);
        await matcher.acceptAssignment('user1', 'task1');
        await sleep(60);

        const removed = await matcher.processIdleUsers();
        expect(removed).to.deep.equal([]);
    });

    it('should be a no-op when idleUserTimeoutMs is not configured', async function () {
        const matcher = createMatcher(undefined);

        await matcher.addUser({ id: 'user1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'task1', tags: ['tag1'], priority: 100 });
        await matcher.matchUsersAssignments();

        await sleep(50);
        const removed = await matcher.processIdleUsers();
        expect(removed).to.deep.equal([]);

        const users = await redisClient.hGetAll('test:idle:users');
        expect(users).to.have.property('user1');
    });

    it('should not alter stored user objects (backward compatibility)', async function () {
        const matcher = createMatcher(50);

        await matcher.addUser({ id: 'user1', tags: ['tag1'], routingWeights: { tag1: 10 } });

        const json = await redisClient.hGet('test:idle:users', 'user1');
        const stored = JSON.parse(json);
        expect(Object.keys(stored).sort()).to.deep.equal(['id', 'routingWeights', 'tags']);
    });

    it('should run idle processing via the auto interval', async function () {
        const matcher = createMatcher(50);

        await matcher.addUser({ id: 'user1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'task1', tags: ['tag1'], priority: 100 });
        await matcher.matchUsersAssignments();

        matcher.startIdleUserInterval(25);
        await sleep(150);
        matcher.stopIdleUserInterval();

        const users = await redisClient.hGetAll('test:idle:users');
        expect(users).to.not.have.property('user1');

        // Assignment back in queued state
        const queued = await redisClient.hGetAll('test:idle:assignments:ref');
        expect(queued).to.have.property('task1');
    });

    it('should return pending assignments with age metadata', async function () {
        const matcher = new AssignmentMatcher(redisClient, {
            redisPrefix: 'test:idle:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            matchExpirationMs: 1000,
        });

        await matcher.addUser({ id: 'user1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'task1', tags: ['tag1'], priority: 100 });
        await matcher.matchUsersAssignments('user1');

        await sleep(30);

        const pending = await matcher.getPendingAssignmentsWithAge();
        expect(pending).to.have.length(1);
        expect(pending[0].assignment.id).to.equal('task1');
        expect(pending[0].ownerId).to.equal('user1');
        expect(pending[0].pendingForMs).to.be.greaterThan(0);
        expect(pending[0].pendingSince).to.be.a('number');
        expect(pending[0].expiresAt).to.be.a('number');
        expect((pending[0].expiresAt ?? 0) - (pending[0].pendingSince ?? 0)).to.equal(1000);
    });

    it('should return empty pending list when nothing is pending', async function () {
        const matcher = createMatcher(50);
        const pending = await matcher.getPendingAssignmentsWithAge();
        expect(pending).to.deep.equal([]);
    });
});
