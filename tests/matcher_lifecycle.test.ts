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
        expect(allAssignments.find(a => a.id === 'a1')).to.not.be.undefined;
    });

    it('Should process expired matches and return them to pool', async function () {
        const user = { id: 'u1', tags: ['tag1'] };
        const assignment = { id: 'a1', tags: ['tag1'], priority: 10 };

        await matcher.addUser(user);
        await matcher.addAssignment(assignment);
        await matcher.matchUsersAssignments('u1');

        let userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.include('a1');

        // Wait for expiration
        await new Promise(resolve => setTimeout(resolve, 1100));

        const processedCount = await matcher.processExpiredMatches();
        expect(processedCount).to.equal(1);

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.not.include('a1');

        // Verify it's back in the pool
        const allAssignments = await matcher.getAllAssignments();
        expect(allAssignments.find(a => a.id === 'a1')).to.not.be.undefined;
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

        // Start interval with short duration
        matcher.startAutoReleaseInterval(100);

        // Wait for expiration (1000ms) + interval check
        await new Promise(resolve => setTimeout(resolve, 1500));

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.not.include('a1');

        // Verify it's back in the pool
        const allAssignments = await matcher.getAllAssignments();
        expect(allAssignments.find(a => a.id === 'a1')).to.not.be.undefined;

        matcher.stopAutoReleaseInterval();
    });
});
