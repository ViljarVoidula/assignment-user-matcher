import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Lifecycle Tests', async function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000, // Short expiration for testing
        });
    });

    it('Should accept assignment successfully', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        const assignment = { id: 'a1', tags: ['tag1'], priority: 10 };

        await matcher.addUser(user);
        await matcher.addAssignment(assignment);
        await matcher.matchUsersAssignments('u1');

        let userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.include('a1');

        const result = await matcher.acceptAssignment('u1', 'a1');
        expect(result).to.be.true;

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.not.include('a1');

        // Verify it's gone from pending
        const pending = await redisClient.hGet(matcher.pendingAssignmentsKey, 'a1');
        expect(pending).to.be.null;
    });

    it('Should reject assignment and return it to pool', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        const assignment = { id: 'a1', tags: ['tag1'], priority: 10 };

        await matcher.addUser(user);
        await matcher.addAssignment(assignment);
        await matcher.matchUsersAssignments('u1');

        let userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.include('a1');

        const result = await matcher.rejectAssignment('u1', 'a1');
        expect(result).to.be.true;

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.not.include('a1');

        // Verify it's back in the pool
        const allAssignments = await matcher.getAllAssignments();
        expect(allAssignments.find((a) => a.id === 'a1')).to.not.be.undefined;
    });

    it('Should process expired matches and return them to pool', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        const assignment = { id: 'a1', tags: ['tag1'], priority: 10 };

        await matcher.addUser(user);
        await matcher.addAssignment(assignment);
        await matcher.matchUsersAssignments('u1');

        let userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.include('a1');

        // Force the pending match's expiry into the past instead of sleeping past it.
        await redisClient.zAdd(matcher.pendingAssignmentsExpiryKey, { score: Date.now() - 1, value: 'a1' });

        const processedCount = await matcher.processExpiredMatches();
        expect(processedCount).to.equal(1);

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.not.include('a1');

        // Verify it's back in the pool
        const allAssignments = await matcher.getAllAssignments();
        expect(allAssignments.find((a) => a.id === 'a1')).to.not.be.undefined;
    });

    it('Should throw error when accepting non-existent assignment', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        await matcher.addUser(user);

        try {
            await matcher.acceptAssignment('u1', 'non-existent');
            expect.fail('Should have thrown error');
        } catch (e: any) {
            expect(e.message).to.equal('Assignment not found for user');
        }
    });

    it('Should throw error when rejecting non-existent assignment', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        await matcher.addUser(user);

        try {
            await matcher.rejectAssignment('u1', 'non-existent');
            expect.fail('Should have thrown error');
        } catch (e: any) {
            expect(e.message).to.equal('Assignment not found for user');
        }
    });

    it('Should auto-release expired matches via interval', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        const assignment = { id: 'a1', tags: ['tag1'], priority: 10 };

        await matcher.addUser(user);
        await matcher.addAssignment(assignment);
        await matcher.matchUsersAssignments('u1');

        let userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.include('a1');

        // Force the match already-expired, then let the interval sweep pick it up.
        await redisClient.zAdd(matcher.pendingAssignmentsExpiryKey, { score: Date.now() - 1, value: 'a1' });
        matcher.startAutoReleaseInterval(25);

        // Poll until the interval's processExpiredMatches has run (bounded, fast).
        const deadline = Date.now() + 1000;
        while (Date.now() < deadline) {
            userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
            if (!userAssignments.includes('a1')) break;
            await new Promise((resolve) => setTimeout(resolve, 15));
        }

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.not.include('a1');

        // Verify it's back in the pool
        const allAssignments = await matcher.getAllAssignments();
        expect(allAssignments.find((a) => a.id === 'a1')).to.not.be.undefined;

        matcher.stopAutoReleaseInterval();
    });

    it('Should emit pending lifecycle event on match', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');

        expect(events).to.have.lengthOf(1);
        expect(events[0].kind).to.equal('pending');
        expect(events[0].taskId).to.equal('a1');
        expect(events[0].workerId).to.equal('u1');
        expect(events[0].expiresAt).to.equal(events[0].matchedAt + 1000);
    });

    it('Should emit accepted lifecycle event', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');
        events.length = 0;

        await matcher.acceptAssignment('u1', 'a1');

        expect(events).to.have.lengthOf(1);
        expect(events[0].kind).to.equal('accepted');
        expect(events[0].taskId).to.equal('a1');
        expect(events[0].workerId).to.equal('u1');
    });

    it('Should emit rejected lifecycle event and requeue', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');
        events.length = 0;

        await matcher.rejectAssignment('u1', 'a1');

        expect(events).to.have.lengthOf(1);
        expect(events[0].kind).to.equal('rejected');
        expect(events[0].taskId).to.equal('a1');
        expect(events[0].workerId).to.equal('u1');
    });

    it('Should emit completed lifecycle event', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');
        await matcher.acceptAssignment('u1', 'a1');
        events.length = 0;

        await matcher.completeAssignment('u1', 'a1', { success: true, data: { ok: true } });

        expect(events).to.have.lengthOf(1);
        expect(events[0].kind).to.equal('completed');
        expect(events[0].taskId).to.equal('a1');
        expect(events[0].workerId).to.equal('u1');
    });

    it('Should emit expired lifecycle event', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');
        events.length = 0;

        await redisClient.zAdd(matcher.pendingAssignmentsExpiryKey, { score: Date.now() - 1, value: 'a1' });
        await matcher.processExpiredMatches();

        expect(events).to.have.lengthOf(1);
        expect(events[0].kind).to.equal('expired');
        expect(events[0].taskId).to.equal('a1');
        expect(events[0].workerId).to.equal('u1');
    });

    it('Should emit released lifecycle event on manual release', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');
        events.length = 0;

        await matcher.releaseUserAssignments('u1');

        expect(events).to.have.lengthOf(1);
        expect(events[0].kind).to.equal('released');
        expect(events[0].taskId).to.equal('a1');
        expect(events[0].workerId).to.equal('u1');
        expect(events[0].reason).to.equal('operator');
    });

    it('Should emit pending lifecycle event on manual assignment transfer', async function () {
        const events: any[] = [];
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: (event) => events.push(event),
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addUser({ id: 'u2', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');
        events.length = 0;

        await matcher.assignToUser('a1', 'u2');

        const pending = events.filter((e) => e.kind === 'pending');
        expect(pending).to.have.lengthOf(1);
        expect(pending[0].taskId).to.equal('a1');
        expect(pending[0].workerId).to.equal('u2');
    });

    it('Should not break lifecycle transitions when hook throws', async function () {
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
            matchExpirationMs: 1000,
            onAssignmentLifecycle: () => {
                throw new Error('boom');
            },
        });

        await matcher.addUser({ id: 'u1', tags: ['tag1'] });
        await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
        await matcher.matchUsersAssignments('u1');

        const result = await matcher.acceptAssignment('u1', 'a1');
        expect(result).to.be.true;
    });
});
