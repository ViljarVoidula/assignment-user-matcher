import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import type { MatchTraceReason } from '../src/types/matcher';

function reasonsOfKind(reasons: MatchTraceReason[], kind: MatchTraceReason['kind']): MatchTraceReason[] {
    return reasons.filter((r) => r.kind === kind);
}

describe('Matcher.previewMatch()', function () {
    this.timeout(10000);
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    let matcher: Matcher;

    beforeEach(async function () {
        matcher = new Matcher(redisClient, { redisPrefix: 'preview_test:' });
        await matcher.waitUntilReady();
    });

    it('ranks weighted candidates and reports hard vetoes', async function () {
        await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
        await matcher.addUser({ id: 'bob', tags: [], routingWeights: { english: 80, german: 0 } });

        const preview = await matcher.previewMatch({ tags: ['english', 'german'], priority: 100 });

        expect(preview.tags).to.deep.equal(['english', 'german']);
        expect(preview.priority).to.equal(100);
        expect(preview.candidates.map((c) => c.userId)).to.include.members(['alice', 'bob']);

        const alice = preview.candidates.find((c) => c.userId === 'alice')!;
        expect(alice.eligible).to.equal(true);
        // english weight 100 + implicit 'default' tag weight 1
        expect(alice.score).to.equal(101);
        expect(reasonsOfKind(alice.reasons, 'tagWeight')).to.have.length.greaterThan(0);

        const bob = preview.candidates.find((c) => c.userId === 'bob')!;
        expect(bob.eligible).to.equal(false);
        const vetoes = reasonsOfKind(bob.reasons, 'veto');
        expect(vetoes).to.have.length(1);
        expect((vetoes[0] as any).tag).to.equal('german');

        expect(preview.candidates[0].userId).to.equal('alice');
    });

    it('produces the same ranking as explainMatch() for an actual assignment', async function () {
        await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
        await matcher.addUser({ id: 'bob', tags: [], routingWeights: { english: 80 } });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });

        const preview = await matcher.previewMatch({ tags: ['english'], priority: 100 });
        const explanation = await matcher.explainMatch('a1');

        const previewOrder = preview.candidates.map((c) => ({ userId: c.userId, eligible: c.eligible, score: c.score }));
        const explainOrder = explanation.candidates.map((c) => ({ userId: c.userId, eligible: c.eligible, score: c.score }));
        expect(previewOrder).to.deep.equal(explainOrder);
    });

    it('reports skill threshold failures with required vs actual', async function () {
        await matcher.addUser({ id: 'junior', tags: [], routingWeights: { english: 20 } });

        const preview = await matcher.previewMatch({
            tags: ['english'],
            priority: 100,
            skillThresholds: { english: 50 },
        });

        const junior = preview.candidates.find((c) => c.userId === 'junior')!;
        expect(junior.eligible).to.equal(false);
        const thresholdReasons = reasonsOfKind(junior.reasons, 'skillThreshold');
        expect(thresholdReasons).to.have.length(1);
        expect((thresholdReasons[0] as any).required).to.equal(50);
        expect((thresholdReasons[0] as any).actual).to.equal(20);
    });

    it('respects full backlogs while still scoring the candidate', async function () {
        const smallMatcher = new Matcher(redisClient, {
            redisPrefix: 'preview_backlog_test:',
            maxUserBacklogSize: 1,
        });
        await smallMatcher.waitUntilReady();
        await smallMatcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
        await smallMatcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
        await smallMatcher.matchUsersAssignments();

        const preview = await smallMatcher.previewMatch({ tags: ['english'], priority: 90 });
        const alice = preview.candidates.find((c) => c.userId === 'alice')!;
        expect(alice.eligible).to.equal(false);
        const backlogReasons = reasonsOfKind(alice.reasons, 'backlogFull');
        expect(backlogReasons).to.have.length(1);
        expect((backlogReasons[0] as any).limit).to.equal(1);
        expect(alice.score).to.equal(101);
    });

    it('reports paused users as excluded', async function () {
        await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
        await matcher.pauseUser('alice');

        const preview = await matcher.previewMatch({ tags: ['english'], priority: 100 });
        const alice = preview.candidates.find((c) => c.userId === 'alice')!;
        expect(alice.eligible).to.equal(false);
        expect(reasonsOfKind(alice.reasons, 'paused')).to.have.length(1);
    });

    it('restricts evaluation to the given userIds', async function () {
        await matcher.addUser({ id: 'alice', tags: ['support'] });
        await matcher.addUser({ id: 'bob', tags: ['support'] });

        const preview = await matcher.previewMatch({ tags: ['support'], priority: 100 }, { userIds: ['bob'] });
        expect(preview.candidates.map((c) => c.userId)).to.deep.equal(['bob']);
    });

    it('does not create or claim any assignment', async function () {
        await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });

        const before = await matcher.getAssignmentCounts();
        const preview = await matcher.previewMatch({ tags: ['english'], priority: 100 });
        const after = await matcher.getAssignmentCounts();

        expect(preview.candidates).to.have.length(1);
        expect(after).to.deep.equal(before);
    });
});
