import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Vetoed Users Tests', function () {
    this.timeout(5000);
    let matcher: Matcher;
    let redisClient: any;
    const prefix = 'veto_test:';

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            redisPrefix: prefix,
        });
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    describe('Tag-based matching', function () {
        it('should NOT match a vetoed user, but match other users', async function () {
            await matcher.addUser({ id: 'vetoed-user', tags: ['support'] });
            await matcher.addUser({ id: 'other-user', tags: ['support'] });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['vetoed-user'],
            });

            await matcher.matchUsersAssignments();

            const vetoedAssignments = await matcher.getCurrentAssignmentsForUser('vetoed-user');
            const otherAssignments = await matcher.getCurrentAssignmentsForUser('other-user');

            expect(vetoedAssignments).to.not.include('assignment1');
            expect(otherAssignments).to.include('assignment1');
        });

        it('should keep the assignment queued when the only user is vetoed', async function () {
            await matcher.addUser({ id: 'vetoed-user', tags: ['support'] });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['vetoed-user'],
            });

            await matcher.matchUsersAssignments();

            const vetoedAssignments = await matcher.getCurrentAssignmentsForUser('vetoed-user');
            expect(vetoedAssignments).to.not.include('assignment1');

            const assignment = await matcher.getAssignment('assignment1');
            expect(assignment).to.not.equal(null);
            expect(assignment?._status).to.equal('queued');
        });

        it('should veto multiple users on the same assignment', async function () {
            await matcher.addUser({ id: 'vetoed-a', tags: ['support'] });
            await matcher.addUser({ id: 'vetoed-b', tags: ['support'] });
            await matcher.addUser({ id: 'allowed', tags: ['support'] });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['vetoed-a', 'vetoed-b'],
            });

            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('vetoed-a')).to.not.include('assignment1');
            expect(await matcher.getCurrentAssignmentsForUser('vetoed-b')).to.not.include('assignment1');
            expect(await matcher.getCurrentAssignmentsForUser('allowed')).to.include('assignment1');
        });

        it('should match everyone when vetoedUsers is an empty array', async function () {
            await matcher.addUser({ id: 'user1', tags: ['support'] });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: [],
            });

            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('user1')).to.include('assignment1');
        });

        it('should match everyone when vetoedUsers is absent', async function () {
            await matcher.addUser({ id: 'user1', tags: ['support'] });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
            });

            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('user1')).to.include('assignment1');
        });
    });

    describe('Weighted routing', function () {
        it('should veto a user even with a high positive routing weight', async function () {
            await matcher.addUser({
                id: 'vetoed-user',
                tags: ['support'],
                routingWeights: { support: 100 },
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['vetoed-user'],
            });

            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('vetoed-user')).to.not.include('assignment1');
        });

        it('should only veto the listed assignment, not other assignments', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                routingWeights: { support: 100 },
            });

            await matcher.addAssignment({
                id: 'vetoed-assignment',
                tags: ['support'],
                priority: 200,
                vetoedUsers: ['user1'],
            });
            await matcher.addAssignment({
                id: 'open-assignment',
                tags: ['support'],
                priority: 100,
            });

            await matcher.matchUsersAssignments();

            const assignments = await matcher.getCurrentAssignmentsForUser('user1');
            expect(assignments).to.not.include('vetoed-assignment');
            expect(assignments).to.include('open-assignment');
        });
    });

    describe('Index cleanup', function () {
        it('should populate forward and reverse veto indexes on addAssignment', async function () {
            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['user-a', 'user-b'],
            });

            const forward = await redisClient.sMembers(`${prefix}assignment:assignment1:vetoed`);
            expect(forward.sort()).to.deep.equal(['user-a', 'user-b']);

            expect(await redisClient.sMembers(`${prefix}user:user-a:vetoed`)).to.deep.equal(['assignment1']);
            expect(await redisClient.sMembers(`${prefix}user:user-b:vetoed`)).to.deep.equal(['assignment1']);
        });

        it('should clean both veto indexes on removeAssignment', async function () {
            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['user-a'],
            });
            // A second assignment vetoing the same user must survive the removal
            await matcher.addAssignment({
                id: 'assignment2',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['user-a'],
            });

            await matcher.removeAssignment('assignment1');

            expect(await redisClient.exists(`${prefix}assignment:assignment1:vetoed`)).to.equal(0);
            expect(await redisClient.sMembers(`${prefix}user:user-a:vetoed`)).to.deep.equal(['assignment2']);
        });

        it('should clean the reverse veto index on removeUser', async function () {
            await matcher.addUser({ id: 'user-a', tags: ['support'] });
            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                vetoedUsers: ['user-a'],
            });

            await matcher.removeUser('user-a');

            expect(await redisClient.exists(`${prefix}user:user-a:vetoed`)).to.equal(0);
        });
    });
});

describe('Matcher Vetoed Users Workflow Tests', function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableWorkflows: true,
            redisPrefix: 'veto_wf_test:',
        });
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
    });

    after(async function () {
        await matcher.stopOrchestrator();
        await matcher.redisClient.flushAll();
        await redisClient.quit();
    });

    it('should NOT deliver a workflow-targeted assignment to a vetoed user', async function () {
        // Tag the user does not have, so only the workflow-targeting path could deliver it
        await matcher.addUser({ id: 'user1', tags: ['support'] });

        await matcher.addAssignment({
            id: 'wf-assignment',
            tags: ['workflow-only'],
            priority: 100,
            vetoedUsers: ['user1'],
            _targetUserId: 'user1',
            _workflowInstanceId: 'wf-instance-1',
        });

        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('user1')).to.not.include('wf-assignment');
    });

    it('should deliver a workflow-targeted assignment when the user is not vetoed', async function () {
        await matcher.addUser({ id: 'user1', tags: ['support'] });

        await matcher.addAssignment({
            id: 'wf-assignment',
            tags: ['workflow-only'],
            priority: 100,
            _targetUserId: 'user1',
            _workflowInstanceId: 'wf-instance-1',
        });

        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('user1')).to.include('wf-assignment');
    });
});
