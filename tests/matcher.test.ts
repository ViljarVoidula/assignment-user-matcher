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
