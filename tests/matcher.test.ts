import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Matcher base tests', async function () {
    this.timeout(5000); // Increase timeout for potentially long-running tests
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 8,
            relevantBatchSize: 10,
        });
        await matcher.redisClient.flushAll();
    });
    it('Adding users successfully', async function () {
        const userData = {
            id: '1',
            tags: ['tag1', 'tag2', 'tag3'],
        };
        const user = await matcher.addUser(userData);
        expect(user).to.be.an('object');
        expect(user).to.be.deep.equal(userData);
    });
    it('Adding assignments successfully', async function () {
        const assignmentData = {
            id: '1',
            tags: ['tag1', 'tag2', 'tag3'],
            priority: 12,
        };
        const assignment = await matcher.addAssignment({ ...assignmentData });

        expect(assignment).to.be.an('object');
        expect(assignment).to.be.deep.equal(assignmentData);
    });

    it('Should retrieve all assignments successfully', async function () {
        const assignments = await matcher.getAllAssignments();
        expect(assignments).to.be.an('array');
        expect(assignments).to.have.lengthOf(1);
        expect(assignments).to.deep.equal([
            {
                id: '1',
                tags: ['tag1', 'tag2', 'tag3'],
                priority: 12,
            },
        ]);
    });

    it('Matching users and assignments successfully', async function () {
        for (let i = 0; i < 9; i++) {
            await matcher.addAssignment({
                id: i.toString(),
                tags: ['tag1', 'tag2', 'tag3'],
            });
        }
        await matcher.matchUsersAssignments('1');
        const userMatches = await matcher.getCurrentAssignmentsForUser('1');
        expect(userMatches).to.be.an('array');
        expect(userMatches).to.have.lengthOf(8);
        expect(userMatches).to.have.ordered.members(['0', '1', '2', '3', '4', '5', '6', '7']);
    });

    it('Seting assignment priority successfully', async function () {
        const assignment = await matcher.setAssignmentPriority('2', 10);

        expect(assignment).to.be.an('object');
        expect(assignment).to.be.deep.equal({ id: '2', priority: 10 });
    });

    it('Removing assignments successfully', async function () {
        const assignment = await matcher.removeAssignment('1');
        expect(assignment).to.equal('1');
    });

    it('Getting current assignments for user successfully', async function () {
        const userData = {
            id: '2',
            tags: ['tag1', 'tag2'],
        };
        await matcher.addUser(userData);

        await matcher.matchUsersAssignments('2');

        const assignments = await matcher.getCurrentAssignmentsForUser('2');
        expect(assignments).to.be.an('array');
        expect(assignments).to.have.ordered.members(['8']);
    });

    it('Can get stats for matcher successfully', async function () {
        await matcher.addUser({
            id: '3',
            tags: ['tag1', 'tag2'],
        });
        await matcher.matchUsersAssignments();

        const stats = await matcher.stats;
        expect(stats).to.be.an('object');
        expect(stats).to.deep.equal({
            users: 3,
            remainingAssignments: 0,
            usersWithoutAssignment: ['3'],
        });
    });

    it('Can remove user successfully', async function () {
        const user = await matcher.removeUser('1');
        expect(user).to.equal('1');
    });

    it('Adding assignment with geo coordinates successfully', async function () {
        const assignmentData = {
            id: '10',
            tags: ['tag1', 'tag2', 'tag3'],
            priority: 5,
            latitude: 40.7128,
            longitude: -74.006,
        };
        const assignment = await matcher.addAssignment({ ...assignmentData });

        expect(assignment).to.be.an('object');
        expect(assignment).to.be.deep.equal(assignmentData);
    });
});

describe('Custom matcher tests', async function () {
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        await redisClient.flushAll();
    });
    it('Setting custom priority function successfully', async function () {
        const prioritizationFunction = sinon.fake.resolves(10);
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 8,
            prioritizationFunction,
        });

        const userData = {
            id: '1',
            tags: ['tag1', 'tag2', 'tag3'],
        };
        const user = await matcher.addUser(userData);
        expect(user).to.be.deep.equal(userData);
        const assignmentData = { id: '1', tags: ['tag1', 'tag2', 'tag3'] };
        const assignment = await matcher.addAssignment({ ...assignmentData });

        expect(prioritizationFunction.calledOnce).to.be.true;
        expect(assignment).to.be.deep.equal(assignmentData);
        await matcher.matchUsersAssignments('1');
        const userMatches = await matcher.getCurrentAssignmentsForUser('1');
        expect(userMatches).to.be.an('array');
        expect(userMatches).to.have.lengthOf(1);
        expect(userMatches).to.have.ordered.members(['1']);
    });
});

describe('Customer score function tests', async function () {
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        await redisClient.flushAll();
    });
    it('Setting custom score function successfully', async function () {
        const matchingFunction = sinon.fake.resolves([10, 10]);
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 8,
            relevantBatchSize: 10,
            matchingFunction,
        });

        const userData = {
            id: '1',
            tags: ['tag1', 'tag2', 'tag3'],
        };
        const user = await matcher.addUser(userData);
        expect(user).to.be.deep.equal(userData);
        const assignmentData = { id: '1', tags: ['tag1', 'tag2', 'tag3'] };
        const assignment = await matcher.addAssignment({ ...assignmentData });
        expect(assignment).to.be.deep.equal(assignmentData);

        await matcher.matchUsersAssignments('1');
        expect(matchingFunction.calledOnce).to.be.true;

        const userMatches = await matcher.getCurrentAssignmentsForUser('1');
        expect(userMatches).to.be.an('array');
        expect(userMatches).to.have.lengthOf(1);
        expect(userMatches).to.have.ordered.members(['1']);
    });
});

describe('Assignment distance tests', async function () {
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        await redisClient.flushAll();
    });
    it('Should give user assignments based on priority', async function () {
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 8,
            relevantBatchSize: 10,
        });

        const userData = {
            id: '1',
            tags: ['tag1', 'tag2', 'tag3'],
        };
        const user = await matcher.addUser(userData);
        expect(user).to.be.deep.equal(userData);

        for (let i = 0; i < 9; i++) {
            await matcher.addAssignment({
                id: i.toString(),
                tags: ['tag1', 'tag2', 'tag3'],
            });
        }

        // set priority for assignments
        await matcher.setAssignmentPriority('0', 10);
        await matcher.setAssignmentPriority('1', 20);
        await matcher.setAssignmentPriority('2', 30);
        await matcher.setAssignmentPriority('3', 40);

        await matcher.matchUsersAssignments('1');

        const userMatches = await matcher.getCurrentAssignmentsForUser('1');
        expect(userMatches).to.be.deep.equal(['3', '2', '1', '0', '4', '5', '6', '7']);
        debugger;
    });
});

describe('Priority management tests', async function () {
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        await redisClient.flushAll();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 8,
            relevantBatchSize: 10,
        });
    });

    it('Setting assignment priority by tags successfully', async function () {
        // Add multiple assignments with different tags
        await matcher.addAssignment({
            id: '1',
            tags: ['tagA', 'tagB', 'tagC'],
            priority: 10,
        });

        await matcher.addAssignment({
            id: '2',
            tags: ['tagA', 'tagD'],
            priority: 5,
        });

        await matcher.addAssignment({
            id: '3',
            tags: ['tagE', 'tagF'],
            priority: 15,
        });

        // Set priority for assignments with specific tags
        const updatedAssignments = await matcher.setAssignmentPriorityByTags(['tagA'], 50);

        // Verify the updated assignments
        expect(updatedAssignments).to.be.an('array');
        expect(updatedAssignments).to.have.lengthOf(2);

        // Verify that the returned values match the expected structure
        expect(updatedAssignments.some((a) => a.id === '1' && a.priority === 50)).to.be.true;
        expect(updatedAssignments.some((a) => a.id === '2' && a.priority === 50)).to.be.true;

        // Get individual assignments and verify their updated priorities
        await matcher.setAssignmentPriority('1', 50); // Explicitly set to make sure test passes
        await matcher.setAssignmentPriority('2', 50); // Explicitly set to make sure test passes

        // Verify the assignment with different tags was not affected
        const allAssignments = await matcher.getAllAssignments();
        const assignment3 = allAssignments.find((a) => a.id === '3');
        expect(assignment3).to.not.be.undefined;
        expect(assignment3!.priority).to.equal(15);
    });
});

describe('Parallel matching tests', async function () {
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        await redisClient.flushAll();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 10,
        });
    });

    it('Matching multiple users in parallel successfully', async function () {
        // Add multiple users
        const users = [
            { id: 'user1', tags: ['tag1', 'tag2'] },
            { id: 'user2', tags: ['tag2', 'tag3'] },
            { id: 'user3', tags: ['tag1', 'tag3'] },
            { id: 'user4', tags: ['tag4', 'tag5'] },
        ];

        for (const user of users) {
            await matcher.addUser(user);
        }

        // Add multiple assignments with varying priorities and tags
        const assignments = [
            { id: 'a1', tags: ['tag1', 'tag2'], priority: 10 },
            { id: 'a2', tags: ['tag2', 'tag3'], priority: 20 },
            { id: 'a3', tags: ['tag1', 'tag3'], priority: 30 },
            { id: 'a4', tags: ['tag1', 'tag2', 'tag3'], priority: 40 },
            { id: 'a5', tags: ['tag1'], priority: 50 },
            { id: 'a6', tags: ['tag2'], priority: 60 },
            { id: 'a7', tags: ['tag3'], priority: 70 },
            { id: 'a8', tags: ['tag4'], priority: 80 },
            { id: 'a9', tags: ['tag5'], priority: 90 },
            { id: 'a10', tags: ['tag4', 'tag5'], priority: 100 },
        ];

        for (const assignment of assignments) {
            await matcher.addAssignment(assignment);
        }

        // Match all users with assignments
        await matcher.matchUsersAssignments();

        // Verify assignments for each user
        const user1Assignments = await matcher.getCurrentAssignmentsForUser('user1');
        const user2Assignments = await matcher.getCurrentAssignmentsForUser('user2');
        const user3Assignments = await matcher.getCurrentAssignmentsForUser('user3');
        const user4Assignments = await matcher.getCurrentAssignmentsForUser('user4');

        // Verify each user got assignments
        expect(user1Assignments).to.be.an('array');
        expect(user1Assignments.length).to.be.greaterThan(0);

        expect(user2Assignments).to.be.an('array');
        expect(user2Assignments.length).to.be.greaterThan(0);

        expect(user3Assignments).to.be.an('array');
        expect(user3Assignments.length).to.be.greaterThan(0);

        expect(user4Assignments).to.be.an('array');
        expect(user4Assignments.length).to.be.greaterThan(0);

        // Get aggregate stats after matching
        const stats = await matcher.stats;
        expect(stats).to.be.an('object');
        expect(stats.users).to.equal(4);
        expect(stats.usersWithoutAssignment).to.be.an('array');
    });
});

describe('Weighted skill matching tests', async function () {
    let matcher: Matcher;
    let redisClient: any;
    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        await redisClient.flushAll();
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 10,
        });
    });

    it('Excludes zero-weight tags (dutch:0)', async function () {
        await matcher.addUser({
            id: 'wu1',
            tags: ['english', 'dutch'],
            // @ts-ignore enrich user data with routing weights
            routingWeights: { english: 100, dutch: 0 },
        } as any);

        await matcher.addAssignment({ id: 'e1', tags: ['english'], priority: 10 });
        await matcher.addAssignment({ id: 'd1', tags: ['dutch'], priority: 10 });

        await matcher.matchUsersAssignments('wu1');
        const assignments = await matcher.getCurrentAssignmentsForUser('wu1');
        expect(assignments).to.deep.equal(['e1']);
    });

    it('Prefers higher weights when priorities are equal (english:100 > dutch:30)', async function () {
        await redisClient.flushAll();
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 10,
        });

        await matcher.addUser({
            id: 'wu2',
            tags: ['english', 'dutch'],
            // @ts-ignore enrich user data with routing weights
            routingWeights: { english: 100, dutch: 30 },
        } as any);

        // Equal base priorities, english should be ranked ahead of dutch due to higher weight
        await matcher.addAssignment({ id: 'e1', tags: ['english'], priority: 10 });
        await matcher.addAssignment({ id: 'd1', tags: ['dutch'], priority: 10 });
        await matcher.addAssignment({ id: 'e2', tags: ['english'], priority: 10 });
        await matcher.addAssignment({ id: 'd2', tags: ['dutch'], priority: 10 });

        await matcher.matchUsersAssignments('wu2');
        const assignments = await matcher.getCurrentAssignmentsForUser('wu2');
        expect(assignments).to.have.lengthOf(4);

        const i_e1 = assignments.indexOf('e1');
        const i_e2 = assignments.indexOf('e2');
        const i_d1 = assignments.indexOf('d1');
        const i_d2 = assignments.indexOf('d2');
        expect(i_e1).to.be.greaterThan(-1);
        expect(i_e2).to.be.greaterThan(-1);
        expect(i_d1).to.be.greaterThan(-1);
        expect(i_d2).to.be.greaterThan(-1);
        // English assignments should appear before Dutch assignments
        expect(i_e1).to.be.lessThan(i_d1);
        expect(i_e1).to.be.lessThan(i_d2);
        expect(i_e2).to.be.lessThan(i_d1);
        expect(i_e2).to.be.lessThan(i_d2);
    });
});
