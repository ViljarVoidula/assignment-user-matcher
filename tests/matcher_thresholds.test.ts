import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import { meetsSkillThresholds, getEffectiveWeight } from '../src/scoring/match-score';

describe('Skill Thresholds - Unit Tests', function () {
    describe('getEffectiveWeight', function () {
        it('should return exact match weight', function () {
            const weights = { english: 80, spanish: 60 };
            expect(getEffectiveWeight(weights, 'english')).to.equal(80);
            expect(getEffectiveWeight(weights, 'spanish')).to.equal(60);
        });

        it('should return 0 for missing skill', function () {
            const weights = { english: 80 };
            expect(getEffectiveWeight(weights, 'french')).to.equal(0);
        });

        it('should support wildcard patterns', function () {
            const weights = { 'eng*': 70, 'support': 50 };
            expect(getEffectiveWeight(weights, 'english')).to.equal(70);
            expect(getEffectiveWeight(weights, 'engineering')).to.equal(70);
            expect(getEffectiveWeight(weights, 'support')).to.equal(50);
        });

        it('should prefer exact match over wildcard', function () {
            const weights = { 'english': 100, 'eng*': 50 };
            expect(getEffectiveWeight(weights, 'english')).to.equal(100);
        });
    });

    describe('meetsSkillThresholds', function () {
        it('should return true when no thresholds are specified', function () {
            expect(meetsSkillThresholds({ english: 50 }, undefined)).to.be.true;
            expect(meetsSkillThresholds({ english: 50 }, {})).to.be.true;
        });

        it('should return false when user has no weights but thresholds exist', function () {
            expect(meetsSkillThresholds(undefined, { english: 50 })).to.be.false;
            expect(meetsSkillThresholds({}, { english: 50 })).to.be.false;
        });

        it('should return true when user meets all thresholds', function () {
            const weights = { english: 80, spanish: 60, support: 90 };
            const thresholds = { english: 50, spanish: 50 };
            expect(meetsSkillThresholds(weights, thresholds)).to.be.true;
        });

        it('should return false when user fails any threshold', function () {
            const weights = { english: 80, spanish: 30 };
            const thresholds = { english: 50, spanish: 50 };
            expect(meetsSkillThresholds(weights, thresholds)).to.be.false;
        });

        it('should return false when user is missing a required skill', function () {
            const weights = { english: 80 };
            const thresholds = { english: 50, spanish: 50 };
            expect(meetsSkillThresholds(weights, thresholds)).to.be.false;
        });

        it('should support wildcard weights against specific thresholds', function () {
            const weights = { 'lang*': 70 };
            const thresholds = { language_english: 50, language_spanish: 60 };
            expect(meetsSkillThresholds(weights, thresholds)).to.be.true;
        });

        it('should fail if wildcard weight is below threshold', function () {
            const weights = { 'lang*': 40 };
            const thresholds = { language_english: 50 };
            expect(meetsSkillThresholds(weights, thresholds)).to.be.false;
        });
    });
});

describe('Skill Thresholds - Integration Tests', function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 20,
            redisPrefix: 'test-thresholds:',
        });
        await redisClient.flushAll();
    });

    afterEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    it('should match user who meets skill thresholds', async function () {
        // User with high English skill
        await matcher.addUser({
            id: 'user1',
            tags: ['support'],
            routingWeights: { english: 80, support: 100 },
        });

        // Assignment requiring minimum English skill of 50
        await matcher.addAssignment({
            id: 'assignment1',
            tags: ['support', 'english'],
            skillThresholds: { english: 50 },
        });

        await matcher.matchUsersAssignments('user1');
        const assignments = await matcher.getCurrentAssignmentsForUser('user1');
        
        expect(assignments).to.include('assignment1');
    });

    it('should NOT match user who fails skill thresholds', async function () {
        // User with low English skill
        await matcher.addUser({
            id: 'user2',
            tags: ['support'],
            routingWeights: { english: 30, support: 100 },
        });

        // Assignment requiring minimum English skill of 50
        await matcher.addAssignment({
            id: 'assignment2',
            tags: ['support', 'english'],
            skillThresholds: { english: 50 },
        });

        await matcher.matchUsersAssignments('user2');
        const assignments = await matcher.getCurrentAssignmentsForUser('user2');
        
        expect(assignments).to.not.include('assignment2');
    });

    it('should NOT match user missing a required skill', async function () {
        // User without English skill at all
        await matcher.addUser({
            id: 'user3',
            tags: ['support'],
            routingWeights: { support: 100, spanish: 80 },
        });

        // Assignment requiring English skill
        await matcher.addAssignment({
            id: 'assignment3',
            tags: ['support'],
            skillThresholds: { english: 50 },
        });

        await matcher.matchUsersAssignments('user3');
        const assignments = await matcher.getCurrentAssignmentsForUser('user3');
        
        expect(assignments).to.not.include('assignment3');
    });

    it('should match user with wildcard weights meeting thresholds', async function () {
        // User with wildcard language skill
        await matcher.addUser({
            id: 'user4',
            tags: ['support'],
            routingWeights: { 'lang_*': 70, support: 100 },
        });

        // Assignment requiring specific language threshold
        await matcher.addAssignment({
            id: 'assignment4',
            tags: ['support'],
            skillThresholds: { lang_english: 60 },
        });

        await matcher.matchUsersAssignments('user4');
        const assignments = await matcher.getCurrentAssignmentsForUser('user4');
        
        expect(assignments).to.include('assignment4');
    });

    it('should match assignments without thresholds to any user with matching tags', async function () {
        // User with basic weights
        await matcher.addUser({
            id: 'user5',
            tags: ['support'],
            routingWeights: { support: 50 },
        });

        // Assignment without thresholds
        await matcher.addAssignment({
            id: 'assignment5',
            tags: ['support'],
            // No skillThresholds
        });

        await matcher.matchUsersAssignments('user5');
        const assignments = await matcher.getCurrentAssignmentsForUser('user5');
        
        expect(assignments).to.include('assignment5');
    });

    it('should correctly route high-skill assignments to qualified users only', async function () {
        // High-skill user
        await matcher.addUser({
            id: 'expert',
            tags: ['support'],
            routingWeights: { english: 95, technical: 90, support: 100 },
        });

        // Low-skill user
        await matcher.addUser({
            id: 'junior',
            tags: ['support'],
            routingWeights: { english: 40, technical: 30, support: 100 },
        });

        // High-difficulty assignment
        await matcher.addAssignment({
            id: 'hard-ticket',
            tags: ['support', 'technical'],
            skillThresholds: { english: 80, technical: 70 },
        });

        // Match both users
        await matcher.matchUsersAssignments('expert');
        await matcher.matchUsersAssignments('junior');

        const expertAssignments = await matcher.getCurrentAssignmentsForUser('expert');
        const juniorAssignments = await matcher.getCurrentAssignmentsForUser('junior');

        expect(expertAssignments).to.include('hard-ticket');
        expect(juniorAssignments).to.not.include('hard-ticket');
    });

    it('should handle multiple threshold requirements', async function () {
        await matcher.addUser({
            id: 'user6',
            tags: ['support'],
            routingWeights: { support: 100, english: 80, spanish: 70, technical: 60 },
        });

        // Assignment with multiple thresholds
        await matcher.addAssignment({
            id: 'multilang',
            tags: ['support'],
            skillThresholds: { english: 70, spanish: 60, technical: 50 },
        });

        await matcher.matchUsersAssignments('user6');
        const assignments = await matcher.getCurrentAssignmentsForUser('user6');
        
        expect(assignments).to.include('multilang');
    });

    it('should reject tag-only users (no routingWeights) from threshold assignments', async function () {
        // User with only tags, no routingWeights
        await matcher.addUser({
            id: 'taguser',
            tags: ['support', 'english'],
        });

        // Assignment with thresholds
        await matcher.addAssignment({
            id: 'threshold-assignment',
            tags: ['support', 'english'],
            skillThresholds: { english: 50 },
        });

        await matcher.matchUsersAssignments('taguser');
        const assignments = await matcher.getCurrentAssignmentsForUser('taguser');
        
        expect(assignments).to.not.include('threshold-assignment');
    });
});
