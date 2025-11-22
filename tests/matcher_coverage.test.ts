import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Coverage Tests', async function () {
    this.timeout(5000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        // Ensure client is closed initially for the initRedis test
    });

    afterEach(async function () {
        if (redisClient.isOpen) {
            await redisClient.flushAll();
            await redisClient.disconnect();
        }
    });

    it('Should connect to redis if client is not open', async function () {
        // redisClient is closed here
        expect(redisClient.isOpen).to.be.false;

        matcher = new Matcher(redisClient);
        // Constructor calls initRedis, which should connect
        // But initRedis is async and not awaited in constructor.
        // We need to wait a bit or check if it connects.

        // Wait for connection
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(redisClient.isOpen).to.be.true;
    });

    it('Should handle removing assignment with missing tags', async function () {
        if (!redisClient.isOpen) await redisClient.connect();
        matcher = new Matcher(redisClient);

        const assignmentId = 'corrupt_assignment';
        const assignmentTagsKey = matcher.redisPrefix + `assignment:${assignmentId}:tags`;

        // Manually set tags to empty string or something that produces empty array
        await redisClient.hSet(assignmentTagsKey, 'tags', '');

        // Also set ref so it "exists"
        await redisClient.hSet(matcher.assignmentsRefKey, assignmentId, '{}');
        await redisClient.zAdd(matcher.assignmentsKey, { score: 1, value: assignmentId });

        // Try to remove it
        const result = await matcher.removeAssignment(assignmentId);
        expect(result).to.equal(assignmentId);

        // Verify it's gone
        const exists = await redisClient.hExists(matcher.assignmentsRefKey, assignmentId);
        expect(exists).to.be.false;
    });

    it('Should handle removing non-existent assignment', async function () {
        if (!redisClient.isOpen) await redisClient.connect();
        matcher = new Matcher(redisClient);

        const result = await matcher.removeAssignment('non-existent');
        expect(result).to.equal('non-existent');
    });

    it('Should return 0 score if tag has 0 weight in matchScore', async function () {
        if (!redisClient.isOpen) await redisClient.connect();
        matcher = new Matcher(redisClient);
        const user = {
            id: 'u1',
            tags: ['tag1'],
            routingWeights: { tag1: 0 },
        };
        // @ts-ignore
        const result = await matcher.matchScore(user, 'tag1', 10);
        expect(result).to.deep.equal([0, 10]);
    });
});
