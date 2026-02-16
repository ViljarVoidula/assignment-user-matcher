import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Wildcard with Default Matching Tests', async function () {
    this.timeout(5000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 10,
            enableDefaultMatching: true, // Enable default matching
        });
    });

    it('Should match wildcard tags in user tags with default matching enabled', async function () {
        // Assignments with specific tags
        await matcher.addAssignment({ id: 'a1', tags: ['qa:test:unit'], priority: 10 });
        
        // User with wildcard tag
        const user = { id: 'u1', tags: ['qa:test:*'] };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u1');
        const assignments = await matcher.getCurrentAssignmentsForUser('u1');

        expect(assignments).to.include('a1');
    });

    it('Should match default tag even with wildcards', async function () {
        // Assignment with NO matching tags for wildcard, but has default
        await matcher.addAssignment({ id: 'a2', tags: ['other:tag'], priority: 10 });

        const user = { id: 'u1', tags: ['qa:test:*'] };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u1');
        const assignments = await matcher.getCurrentAssignmentsForUser('u1');

        // Should match because of default tag
        expect(assignments).to.include('a2');
    });

    it('Should keep assignment queued when routingWeights have no positive values', async function () {
        await matcher.addAssignment({ id: 'a_default', tags: ['some:other'], priority: 10 });

        const user = {
            id: 'u_weighted',
            tags: [],
            routingWeights: {
                'my:*': 0,
            }
        };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u_weighted');
        const assignments = await matcher.getCurrentAssignmentsForUser('u_weighted');

        expect(assignments).to.have.lengthOf(0);

        const counts = await matcher.getAssignmentCounts();
        expect(counts.queued).to.equal(1);
        expect(counts.pending).to.equal(0);
    });

    it('Should hard-veto default tag with exact zero weight', async function () {
        await matcher.addAssignment({ id: 'a_exact_zero', tags: ['my:tag'], priority: 10 });

        const user = {
            id: 'u_exact_zero',
            tags: [],
            routingWeights: {
                'my:tag': 100,
                default: 0,
            }
        };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u_exact_zero');
        const assignments = await matcher.getCurrentAssignmentsForUser('u_exact_zero');
        expect(assignments).to.have.lengthOf(0);
    });

    it('Should hard-veto default tag with wildcard zero weight', async function () {
        await matcher.addAssignment({ id: 'a_wild_zero', tags: ['my:tag'], priority: 10 });

        const user = {
            id: 'u_wild_zero',
            tags: [],
            routingWeights: {
                'my:tag': 100,
                'def*': 0,
            }
        };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u_wild_zero');
        const assignments = await matcher.getCurrentAssignmentsForUser('u_wild_zero');
        expect(assignments).to.have.lengthOf(0);
    });
});
