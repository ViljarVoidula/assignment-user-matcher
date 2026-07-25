import { expect } from 'chai';
import { createClient } from 'redis';
import {
    getAssignmentById,
    getAssignmentCountsFromStores,
    getAssignmentsByIdsBatch,
    getAssignmentsPaginatedFromStores,
} from '../src/queries/pagination';

/**
 * Pagination across the three assignment stores (queued/pending/accepted) is
 * the backbone of every listing endpoint — an off-by-one here silently drops
 * or duplicates assignments in a page. Edge cases exercised directly against
 * real Redis rather than through the full matcher, for speed and isolation.
 */
describe('pagination internals', function () {
    this.timeout(2000);
    let redisClient: any;
    const keys = { queued: 'test-pg:queued', pending: 'test-pg:pending', accepted: 'test-pg:accepted' };

    before(async function () {
        redisClient = createClient();
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.del([keys.queued, keys.pending, keys.accepted]);
    });

    after(async function () {
        await redisClient.del([keys.queued, keys.pending, keys.accepted]);
        await redisClient.quit();
    });

    describe('getAssignmentsByIdsBatch', function () {
        it('tags an assignment found only in the accepted store', async function () {
            await redisClient.hSet(keys.accepted, 'a1', JSON.stringify({ id: 'a1', tags: ['t'] }));

            const [result] = await getAssignmentsByIdsBatch(redisClient, keys, ['a1']);
            expect(result._status).to.equal('accepted');
        });
    });

    describe('getAssignmentById', function () {
        // A parked assignment is out of the matching universe but still exists —
        // reading it as "not found" would make an exhausted escalation ladder
        // look like data loss.
        it('tags an assignment found only in the parked store', async function () {
            const parkedKey = 'test-pg:parked';
            await redisClient.hSet(parkedKey, 'a1', JSON.stringify({ id: 'a1', tags: ['t'] }));

            try {
                const result = await getAssignmentById(redisClient, { ...keys, parked: parkedKey }, 'a1');
                expect(result!._status).to.equal('parked');
            } finally {
                await redisClient.del(parkedKey);
            }
        });

        it('returns null for an unknown id without a parked key configured', async function () {
            expect(await getAssignmentById(redisClient, keys, 'missing')).to.equal(null);
        });

        it('returns null for an id absent from every store, parked included', async function () {
            const parkedKey = 'test-pg:parked';
            const result = await getAssignmentById(redisClient, { ...keys, parked: parkedKey }, 'missing');
            expect(result).to.equal(null);
        });
    });

    describe('getAssignmentCountsFromStores', function () {
        it('reports zero parked without a parked key configured', async function () {
            await redisClient.hSet(keys.queued, 'a1', JSON.stringify({ id: 'a1' }));
            await redisClient.hSet(keys.pending, 'a2', JSON.stringify({ id: 'a2' }));

            const counts = await getAssignmentCountsFromStores(redisClient, keys);

            expect(counts).to.include({ queued: 1, pending: 1, accepted: 0, parked: 0, total: 2 });
        });

        it('counts the parked store when one is configured, without folding it into the total', async function () {
            const parkedKey = 'test-pg:parked';
            await redisClient.hSet(keys.queued, 'a1', JSON.stringify({ id: 'a1' }));
            await redisClient.hSet(parkedKey, 'a2', JSON.stringify({ id: 'a2' }));

            try {
                const counts = await getAssignmentCountsFromStores(redisClient, { ...keys, parked: parkedKey });
                expect(counts).to.include({ queued: 1, parked: 1, total: 1 });
            } finally {
                await redisClient.del(parkedKey);
            }
        });
    });

    describe('getAssignmentsPaginatedFromStores', function () {
        it('falls back to offset 0 when the cursor offset segment is not numeric', async function () {
            await redisClient.hSet(keys.queued, 'a1', JSON.stringify({ id: 'a1', tags: ['t'] }));

            const result = await getAssignmentsPaginatedFromStores(redisClient, keys, { cursor: '0:abc', limit: 10 });
            expect(result.assignments).to.have.length(1);
        });

        it('reports hasMore against a later, non-empty status when limit is 0', async function () {
            await redisClient.hSet(keys.pending, 'a1', JSON.stringify({ id: 'a1', tags: ['t'] }));

            const result = await getAssignmentsPaginatedFromStores(redisClient, keys, { limit: 0 });
            expect(result.assignments).to.have.length(0);
            expect(result.hasMore).to.equal(true);
            expect(result.nextCursor).to.equal('1:0');
        });
    });
});
