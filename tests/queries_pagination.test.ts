import { expect } from 'chai';
import { createClient } from 'redis';
import { getAssignmentsByIdsBatch, getAssignmentsPaginatedFromStores } from '../src/queries/pagination';

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
