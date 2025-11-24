import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

describe('Assignment Rejection Tests', async function () {
    let matcher: AssignmentMatcher;
    let redisClient: any;

    before(async function () {
        redisClient = createClient({
            url: 'redis://localhost:6379',
        });
        await redisClient.connect();
        await redisClient.flushDb();
        matcher = new AssignmentMatcher(redisClient, {
            redisPrefix: 'test:rejection:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
        });
    });

    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
    });

    it('Should not re-assign rejected assignment to the same user', async function () {
        // Add user
        await matcher.addUser({
            id: 'user1',
            tags: ['tag1'],
        });

        // Add assignment
        await matcher.addAssignment({
            id: 'task1',
            tags: ['tag1'],
            priority: 100,
        });

        // Match
        await matcher.matchUsersAssignments();
        let assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.include('task1');

        // Reject
        await matcher.rejectAssignment('user1', 'task1');
        
        // Verify removed
        assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.not.include('task1');

        // Match again
        await matcher.matchUsersAssignments();
        
        // Verify not re-assigned
        assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.not.include('task1');
    });

    it('Should allow other users to pick up rejected assignment', async function () {
        // Add user1
        await matcher.addUser({
            id: 'user1',
            tags: ['tag1'],
        });

        // Add assignment
        await matcher.addAssignment({
            id: 'task1',
            tags: ['tag1'],
            priority: 100,
        });

        // Match user1
        await matcher.matchUsersAssignments();
        let assignments1 = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments1).to.include('task1');

        // Reject by user1
        await matcher.rejectAssignment('user1', 'task1');

        // Add user2
        await matcher.addUser({
            id: 'user2',
            tags: ['tag1'],
        });

        // Match again
        await matcher.matchUsersAssignments();

        // Verify user1 still doesn't have it
        assignments1 = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments1).to.not.include('task1');

        // Verify user2 has it
        const assignments2 = await matcher.getCurrentAssignmentsForUser('user2');
        expect(assignments2).to.include('task1');
    });
    
    it('Should clear rejections when user is removed', async function () {
         // Add user
         await matcher.addUser({
            id: 'user1',
            tags: ['tag1'],
        });

        // Add assignment
        await matcher.addAssignment({
            id: 'task1',
            tags: ['tag1'],
            priority: 100,
        });
        
        // Match and reject
        await matcher.matchUsersAssignments();
        await matcher.rejectAssignment('user1', 'task1');
        
        // Remove user
        await matcher.removeUser('user1');
        
        // Check if rejection key is gone
        const rejectedKey = 'test:rejection:user:user1:rejected';
        const exists = await redisClient.exists(rejectedKey);
        expect(exists).to.equal(0);
    });
});
