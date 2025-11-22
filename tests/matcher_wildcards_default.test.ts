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

    it('Should match default tag when routingWeights are present and enableDefaultMatching is true', async function () {
        // Assignment with ONLY default tag (effectively)
        await matcher.addAssignment({ id: 'a_default', tags: ['some:other'], priority: 10 });

        const user = {
            id: 'u_weighted',
            tags: [],
            routingWeights: {
                'my:tag': 100
            }
        };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u_weighted');
        const assignments = await matcher.getCurrentAssignmentsForUser('u_weighted');

        // Should match because of default tag, even though routingWeights doesn't have it
        expect(assignments).to.include('a_default');
    });
});
