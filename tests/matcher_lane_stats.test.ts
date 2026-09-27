import { expect } from 'chai';
import { createTestClient } from './helpers/redis';
import AssignmentMatcher from '../src/matcher.class';
import { summarizeLanes, waitDistribution, waitRank } from '../src/queries/lane-stats';

describe('Lane stats (getLaneStats)', function () {
    let redisClient: any;

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();
    });

    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
    });

    function createMatcher(options: Record<string, unknown> = {}) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: 'test:lanes:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 1,
            enableDefaultMatching: false,
            ...options,
        });
    }

    it('reports an empty queue as no lanes and no waits', async function () {
        const matcher = createMatcher();
        const report = await matcher.getLaneStats();
        expect(report.lanes).to.deep.equal([]);
        expect(report.waits).to.deep.equal({ waiting: 0, p50Ms: null, p95Ms: null, oldestMs: null });
        expect(report.sampleComplete).to.equal(true);
    });

    it('counts queued work per tag, deepest lane first, with each lane oldest age', async function () {
        const matcher = createMatcher();
        const now = Date.now();
        await matcher.addAssignment({ id: 'a1', tags: ['returns', 'lang:en'], createdAt: now });
        await matcher.addAssignment({ id: 'a2', tags: ['returns'], createdAt: now });
        await matcher.addAssignment({ id: 'a3', tags: ['billing'], createdAt: now });
        // Backdate the wait clock so ages are distinguishable
        await redisClient.zAdd('test:lanes:assignments:queuedAt', [
            { score: now - 60_000, value: 'a1' },
            { score: now - 30_000, value: 'a2' },
            { score: now - 5_000, value: 'a3' },
        ]);

        const report = await matcher.getLaneStats();
        expect(report.lanes.map((l) => [l.tag, l.queued])).to.deep.equal([
            ['returns', 2],
            ['billing', 1],
            ['lang:en', 1],
        ]);
        const returns = report.lanes.find((l) => l.tag === 'returns')!;
        expect(returns.oldestExact).to.equal(true);
        expect(returns.oldestWaitingMs).to.be.within(59_000, 62_000);
        expect(report.lanes.find((l) => l.tag === 'billing')!.oldestWaitingMs).to.be.within(4_000, 7_000);
        expect(report.waits.waiting).to.equal(3);
        expect(report.waits.oldestMs).to.be.within(59_000, 62_000);
    });

    it('drops a lane once its work is offered, while the offer still counts as waiting', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'u1', tags: ['returns'] });
        await matcher.addAssignment({ id: 'a1', tags: ['returns'] });
        await matcher.addAssignment({ id: 'a2', tags: ['billing'] });
        await matcher.matchUsersAssignments('u1');

        const report = await matcher.getLaneStats();
        expect(report.lanes.map((l) => l.tag)).to.deep.equal(['billing']);
        // The pending offer's wait clock keeps running until accept
        expect(report.waits.waiting).to.equal(2);
    });

    it('marks a lane outside the oldest sample as an upper bound', async function () {
        const matcher = createMatcher();
        const now = Date.now();
        await matcher.addAssignment({ id: 'old', tags: ['returns'] });
        await matcher.addAssignment({ id: 'new', tags: ['chat'] });
        await redisClient.zAdd('test:lanes:assignments:queuedAt', [
            { score: now - 120_000, value: 'old' },
            { score: now - 1_000, value: 'new' },
        ]);

        const report = await matcher.getLaneStats({ oldestSampleSize: 1 });
        expect(report.sampleComplete).to.equal(false);
        const chat = report.lanes.find((l) => l.tag === 'chat')!;
        expect(chat.oldestExact).to.equal(false);
        // Bounded by the last sampled age, never reported younger than it really is
        expect(chat.oldestWaitingMs).to.be.at.least(119_000);
        expect(report.lanes.find((l) => l.tag === 'returns')!.oldestExact).to.equal(true);
    });

    it('names the tags a lane travels with, from the sample and from lanes it missed', async function () {
        const matcher = createMatcher();
        const now = Date.now();
        await matcher.addAssignment({ id: 'a', tags: ['billing', 'priority'] });
        await matcher.addAssignment({ id: 'b', tags: ['billing'] });
        await matcher.addAssignment({ id: 'c', tags: ['chat', 'lang:en'] });
        await redisClient.zAdd('test:lanes:assignments:queuedAt', [
            { score: now - 30_000, value: 'a' },
            { score: now - 20_000, value: 'b' },
            { score: now - 1_000, value: 'c' },
        ]);
        // A sample of two never reaches `chat`/`lang:en`; their members still answer.
        const report = await matcher.getLaneStats({ oldestSampleSize: 2 });
        const also = Object.fromEntries(report.lanes.map((l) => [l.tag, l.alsoTagged]));
        expect(also.priority).to.deep.equal(['billing']);
        expect(also.billing).to.deep.equal(['priority']);
        expect(also.chat).to.deep.equal(['lang:en']);
    });

    it('never lists the injected default tag as a lane', async function () {
        const matcher = createMatcher({ enableDefaultMatching: true });
        await matcher.addAssignment({ id: 'a1', tags: ['returns'] });
        const report = await matcher.getLaneStats();
        expect(report.lanes.map((l) => l.tag)).to.deep.equal(['returns']);
    });

    it('lists a lane’s oldest queued work, skipping other lanes and offered work', async function () {
        const matcher = createMatcher();
        const now = Date.now();
        await matcher.addUser({ id: 'u1', tags: ['returns'] });
        for (const [id, tags] of [
            ['a', ['returns']],
            ['b', ['billing']],
            ['c', ['returns', 'lang:en']],
            ['d', ['returns']],
        ] as [string, string[]][]) {
            await matcher.addAssignment({ id, tags });
        }
        await redisClient.zAdd('test:lanes:assignments:queuedAt', [
            { score: now - 40_000, value: 'a' },
            { score: now - 30_000, value: 'b' },
            { score: now - 20_000, value: 'c' },
            { score: now - 10_000, value: 'd' },
        ]);
        // u1 (cap 1) is offered the highest-priority returns task and it leaves the lane
        await matcher.matchUsersAssignments('u1');
        const offered = (await matcher.getCurrentAssignmentsForUser('u1'))[0];

        const oldest = await matcher.getOldestQueuedInLane('returns', { limit: 5 });
        const expected = ['a', 'c', 'd'].filter((id) => id !== offered);
        expect(oldest.map((o) => o.id)).to.deep.equal(expected);
        expect(oldest[0].waitingMs).to.be.greaterThan(oldest[oldest.length - 1].waitingMs);
        expect(await matcher.getOldestQueuedInLane('returns', { limit: 1 })).to.have.length(1);
        expect(await matcher.getOldestQueuedInLane('nobody')).to.deep.equal([]);
    });

    describe('pure helpers', function () {
        it('reads percentiles by nearest rank, oldest first', function () {
            expect(waitRank(0, 0.5)).to.equal(0);
            expect(waitRank(1, 0.05)).to.equal(0);
            expect(waitRank(101, 0.5)).to.equal(50);
            expect(waitRank(101, 0.05)).to.equal(5);
            expect(waitDistribution(3, { p50: 900, p95: 800, oldest: 700 }, 1000)).to.deep.equal({
                waiting: 3,
                p50Ms: 100,
                p95Ms: 200,
                oldestMs: 300,
            });
        });

        it('skips claimed entries in the sample and zero-depth lanes', function () {
            const lanes = summarizeLanes({
                counts: [
                    { tag: 'a', queued: 1 },
                    { tag: 'gone', queued: 0 },
                ],
                sample: [
                    { tagsCsv: null, queuedAt: 100 },
                    { tagsCsv: 'a', queuedAt: 400 },
                ],
                sampleComplete: true,
                now: 1000,
            });
            expect(lanes).to.deep.equal([{ tag: 'a', queued: 1, oldestWaitingMs: 600, oldestExact: true, alsoTagged: [] }]);
        });
    });
});
