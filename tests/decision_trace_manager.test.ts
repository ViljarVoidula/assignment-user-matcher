import { expect } from 'chai';
import { createClient } from 'redis';
import { DecisionTraceManager } from '../src/managers/DecisionTraceManager';
import { createKeyBuilders } from '../src/utils/keys';
import type { MatchDecisionTrace } from '../src/types/matcher';

describe('DecisionTraceManager', function () {
    this.timeout(2000);
    let redisClient: any;
    const keys = createKeyBuilders({ prefix: 'test-dtm:' });
    let manager: DecisionTraceManager;

    function trace(overrides: Partial<MatchDecisionTrace> = {}): MatchDecisionTrace {
        return {
            id: 'trace-1',
            assignmentId: 'a1',
            chosenUserId: 'u1',
            matchedAt: Date.now(),
            mode: 'direct',
            candidates: [],
            ...overrides,
        };
    }

    before(async function () {
        redisClient = createClient();
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        manager = new DecisionTraceManager(redisClient, keys, { maxEntries: 100 });
    });

    after(async function () {
        await redisClient.flushAll();
        await redisClient.quit();
    });

    it('no-ops when given an empty trace list', async function () {
        await manager.record([], true);
        expect(await manager.getTraces()).to.deep.equal([]);
    });

    it('returns no traces when the query limit is 0 or negative', async function () {
        await manager.record([trace()], true);
        expect(await manager.getTraces({ limit: 0 })).to.deep.equal([]);
        expect(await manager.getTraces({ limit: -5 })).to.deep.equal([]);
    });

    it('filters by userId, excluding traces chosen for a different user', async function () {
        await manager.record([trace({ id: 't1', chosenUserId: 'u1' }), trace({ id: 't2', chosenUserId: 'u2' })], true);

        const results = await manager.getTraces({ userId: 'u2' });
        expect(results.map((t) => t.id)).to.deep.equal(['t2']);
    });
});
