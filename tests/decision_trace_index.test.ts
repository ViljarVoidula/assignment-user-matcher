import { expect } from 'chai';
import { DecisionTraceManager } from '../src/managers/DecisionTraceManager';
import { createKeyBuilders } from '../src/utils/keys';
import type { MatchDecisionTrace } from '../src/types/matcher';
import { createTestClient } from './helpers/redis';

const trace = (assignmentId: string, n: number): MatchDecisionTrace =>
    ({ id: `t${n}`, assignmentId, chosenUserId: 'alice', matchedAt: n, mode: 'first-come', candidates: [] }) as never;

/**
 * The per-assignment index must stay exactly in step with the capped stream —
 * whatever several replicas recording into one workspace at once do — or an
 * assignment's trace goes missing while it is still in the stream.
 */
describe('decision trace index', function () {
    let redisClient: any;

    before(async function () {
        redisClient = await createTestClient();
        await redisClient.connect();
    });
    beforeEach(async function () {
        await redisClient.flushDb();
    });
    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    it('indexes every entry still in the stream, and nothing that is not, under concurrent recorders', async function () {
        const keys = createKeyBuilders({ prefix: 'idx_race:' } as never);
        // A connection each, as separate processes have: one shared connection serialises them.
        const clients = await Promise.all(
            [0, 1, 2].map(async () => {
                const client = await createTestClient();
                await client.connect();
                return client;
            }),
        );
        const replicas = clients.map((client) => new DecisionTraceManager(client as never, keys, { maxEntries: 5 }));
        let n = 0;
        for (let round = 0; round < 40; round++) {
            await Promise.all(
                replicas.map((replica) => replica.record([trace(`a${n % 7}`, n++), trace(`a${n % 7}`, n++)], true)),
            );
        }

        const stream = await redisClient.xRange(keys.decisionTraces(), '-', '+');
        expect(stream.length).to.be.at.most(5 + 2 * replicas.length);
        const indexed = new Map<string, string>();
        for (let a = 0; a < 7; a++) {
            for (const id of await redisClient.lRange(keys.decisionTraceIndex(`a${a}`), 0, -1)) indexed.set(id, `a${a}`);
        }
        for (const entry of stream) expect(indexed.get(entry.id), entry.id).to.equal(entry.message.assignmentId);
        expect(indexed.size).to.equal(stream.length);

        await Promise.all(clients.map((client) => client.quit()));
        // And every assignment still in the stream answers a lookup, newest first.
        const manager = new DecisionTraceManager(redisClient, keys, { maxEntries: 5 });
        for (const entry of stream) {
            const [found] = await manager.getTraces({ assignmentId: entry.message.assignmentId, limit: 1 });
            expect(found, entry.message.assignmentId).to.not.equal(undefined);
        }
    });

    it('keeps an index for as long as the stream keeps its entries', async function () {
        const keys = createKeyBuilders({ prefix: 'idx_ttl:' } as never);
        const manager = new DecisionTraceManager(redisClient, keys, { maxEntries: 1000 });
        await manager.record([trace('quiet', 1)], true);
        // A quiet workspace may keep a trace for months: no clock may drop its index.
        expect(await redisClient.pTTL(keys.decisionTraceIndex('quiet'))).to.equal(-1);
    });

    it('records without failing when a concurrent trim or clear has already emptied what it would trim', async function () {
        const keys = createKeyBuilders({ prefix: 'idx_empty:' } as never);
        const manager = new DecisionTraceManager(redisClient, keys, { maxEntries: 1 });
        const original = redisClient.xRange.bind(redisClient);
        // As another replica's trim, or clearDecisionTraces(), would leave it.
        redisClient.xRange = async () => [];
        try {
            await manager.record([trace('a', 1), trace('b', 2)], true);
        } finally {
            redisClient.xRange = original;
        }
    });
});
