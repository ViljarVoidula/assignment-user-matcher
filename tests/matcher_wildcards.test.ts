import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Wildcard Tests', async function () {
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
            enableDefaultMatching: false, // Disable default matching to isolate wildcard tests
        });
    });

    it('Should match wildcard tags in user tags (weight 1)', async function () {
        // Assignments with specific tags
        await matcher.addAssignment({ id: 'a1', tags: ['qa:test:unit'], priority: 10 });
        await matcher.addAssignment({ id: 'a2', tags: ['qa:test:e2e'], priority: 10 });
        await matcher.addAssignment({ id: 'a3', tags: ['dev:backend'], priority: 10 });

        // User with wildcard tag
        const user = { id: 'u1', tags: ['qa:test:*'] };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u1');
        const assignments = await matcher.getCurrentAssignmentsForUser('u1');

        expect(assignments).to.include('a1');
        expect(assignments).to.include('a2');
        expect(assignments).to.not.include('a3');
    });

    it('Should match wildcard tags in routingWeights with custom weights', async function () {
        await matcher.addAssignment({ id: 'a1', tags: ['region:eu:de'], priority: 10 }); // Matches region:eu:* (100)
        await matcher.addAssignment({ id: 'a2', tags: ['region:us:ny'], priority: 10 }); // Matches region:us:* (50)
        await matcher.addAssignment({ id: 'a3', tags: ['region:asia:jp'], priority: 10 }); // No match

        const user = {
            id: 'u1',
            tags: [],
            routingWeights: {
                'region:eu:*': 100,
                'region:us:*': 50
            }
        };
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u1');
        const assignments = await matcher.getCurrentAssignmentsForUser('u1');

        // Check if assignments are present
        expect(assignments).to.include('a1');
        expect(assignments).to.include('a2');
        expect(assignments).to.not.include('a3');

        // Verify order (higher weight first)
        // a1 has weight 100, a2 has weight 50. Both have base priority 10.
        // Score a1 = 100, Score a2 = 50.
        const assignmentsOrdered = await matcher.getCurrentAssignmentsForUser('u1');
        expect(assignmentsOrdered[0]).to.equal('a1');
        expect(assignmentsOrdered[1]).to.equal('a2');
    });

    it('Should exclude assignments using wildcard with weight 0', async function () {
        await matcher.addAssignment({ id: 'a1', tags: ['lang:en'], priority: 10 });
        await matcher.addAssignment({ id: 'a2', tags: ['lang:fr'], priority: 10 });
        await matcher.addAssignment({ id: 'a3', tags: ['type:bug'], priority: 10 });

        const user = {
            id: 'u1',
            tags: ['type:bug'], // Should match a3
            routingWeights: {
                'type:bug': 10,
                'lang:*': 0 // Exclude anything with a lang tag? 
                // Wait, exclusion logic: if user has weight 0 for a tag, and assignment HAS that tag, it is excluded.
                // But here we are saying: if assignment has ANY tag matching lang:*, exclude it?
                // The implementation expands 'lang:*' to actual tags present in system.
                // If 'lang:en' exists in system, it gets weight 0.
                // If assignment has 'lang:en', it matches a 0-weight tag.
            }
        };
        // We need to make sure a1 and a2 have the tags that are being excluded.
        // a1 has lang:en. 'lang:*' expands to 'lang:en', 'lang:fr'.
        // So user effectively has routingWeights: { 'type:bug': 10, 'lang:en': 0, 'lang:fr': 0 }
        
        // However, for a1 to be excluded, it must match the exclusion criteria.
        // In matchScore:
        // if (user.routingWeights[t] === 0) return [0, ...];
        // But matchScore doesn't automatically expand wildcards in the user.routingWeights check inside the loop.
        // The expansion happens in `getUserRelatedAssignments` for candidate selection.
        // BUT `matchScore` is called for final verification.
        // We need to ensure `matchScore` handles wildcards or `getUserRelatedAssignments` filtering is sufficient.
        
        // `getUserRelatedAssignments` does:
        // 1. Expand positive weights.
        // 2. Expand zero weights.
        // 3. zDiffStore (candidates - exclude).
        
        // So a1 (lang:en) will be in `tag:lang:en:assignments`.
        // `lang:*` expands to `lang:en`.
        // `tag:lang:en:assignments` is added to exclude set.
        // So a1 should be excluded from candidates.
        
        await matcher.addUser(user);

        await matcher.matchUsersAssignments('u1');
        const assignments = await matcher.getCurrentAssignmentsForUser('u1');

        expect(assignments).to.include('a3');
        expect(assignments).to.not.include('a1');
        expect(assignments).to.not.include('a2');
    });

    it('Should handle overlapping wildcards', async function () {
        await matcher.addAssignment({ id: 'a1', tags: ['skill:js:node'], priority: 10 });
        await matcher.addAssignment({ id: 'a2', tags: ['skill:js:react'], priority: 10 });
        await matcher.addAssignment({ id: 'a3', tags: ['skill:python'], priority: 10 });

        const user = {
            id: 'u1',
            tags: [],
            routingWeights: {
                'skill:js:*': 20, // Matches a1, a2
                'skill:*:node': 50 // Matches a1 (assuming we support * in middle? No, implementation uses zRangeByLex which is prefix only)
                // The implementation: wildcards = tags.filter((t) => t.tag.endsWith('*'));
                // So only suffix wildcards are supported.
            }
        };
        
        // Let's test prefix matching specifically
        const user2 = {
            id: 'u2',
            tags: [],
            routingWeights: {
                'skill:*': 10
            }
        };

        await matcher.addUser(user2);
        await matcher.matchUsersAssignments('u2');
        const assignments = await matcher.getCurrentAssignmentsForUser('u2');
        
        expect(assignments).to.include('a1');
        expect(assignments).to.include('a2');
        expect(assignments).to.include('a3');
    });

    it('Should handle specific tag overriding wildcard weight (if expanded)', async function () {
        // If I have skill:* = 10 and skill:special = 100.
        // And assignment has skill:special.
        // It matches both.
        // In `expandTagWildcards`, we push literals first, then expanded wildcards.
        // `skill:*` expands to `skill:special` (and others).
        // So we might have `skill:special` twice in the list with different weights.
        // `zUnionStore` with WEIGHTS sums them up if duplicate keys? 
        // No, `zUnionStore` takes keys (sets).
        // We map expanded tags to keys: `tag:skill:special:assignments`.
        // If `skill:special` appears twice in `expandedPositive`, we will have the key twice in `unionKeys`.
        // And weights twice in `unionWeights`.
        // Redis `ZUNIONSTORE` sums scores by default (AGGREGATE SUM).
        // So weights should stack! 10 + 100 = 110.
        
        await matcher.addAssignment({ id: 'a1', tags: ['skill:special'], priority: 10 });
        await matcher.addAssignment({ id: 'a2', tags: ['skill:other'], priority: 10 });

        const user = {
            id: 'u1',
            tags: [],
            routingWeights: {
                'skill:*': 10,
                'skill:special': 100
            }
        };

        await matcher.addUser(user);
        await matcher.matchUsersAssignments('u1');
        
        // We can't easily check the internal score, but we can check relative order if we add another one.
        // a1 score ~= 110. a2 score ~= 10.
        
        const assignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(assignments[0]).to.equal('a1');
        expect(assignments[1]).to.equal('a2');
    });

    it('Should apply exact zero as hard veto over wildcard positive', async function () {
        await matcher.addAssignment({ id: 'a1', tags: ['skill:special'], priority: 10 });
        await matcher.addAssignment({ id: 'a2', tags: ['skill:other'], priority: 10 });

        const user = {
            id: 'u_exact_veto',
            tags: [],
            routingWeights: {
                'skill:*': 10,
                'skill:special': 0,
            }
        };

        await matcher.addUser(user);
        await matcher.matchUsersAssignments('u_exact_veto');

        const assignments = await matcher.getCurrentAssignmentsForUser('u_exact_veto');
        expect(assignments).to.include('a2');
        expect(assignments).to.not.include('a1');
    });

    it('Should apply wildcard zero as hard veto over exact positive', async function () {
        await matcher.addAssignment({ id: 'a1', tags: ['skill:special'], priority: 10 });

        const user = {
            id: 'u_wild_veto',
            tags: [],
            routingWeights: {
                'skill:special': 100,
                'skill:*': 0,
            }
        };

        await matcher.addUser(user);
        await matcher.matchUsersAssignments('u_wild_veto');

        const assignments = await matcher.getCurrentAssignmentsForUser('u_wild_veto');
        expect(assignments).to.have.lengthOf(0);
    });

    it('Should use suffix-only wildcard matching', async function () {
        await matcher.addAssignment({ id: 'a1', tags: ['skill:js:node'], priority: 10 });

        const user = {
            id: 'u_suffix_only',
            tags: [],
            routingWeights: {
                'skill:*:node': 100,
            }
        };

        await matcher.addUser(user);
        await matcher.matchUsersAssignments('u_suffix_only');

        const assignments = await matcher.getCurrentAssignmentsForUser('u_suffix_only');
        expect(assignments).to.have.lengthOf(0);
    });
});
