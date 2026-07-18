import { expect } from 'chai';
import { createClient } from 'redis';
import AssignmentMatcher from '../src/matcher.class';

describe('Per-User Backlog Cap Tests', async function () {
    let redisClient: any;

    before(async function () {
        redisClient = createClient({
            url: 'redis://localhost:6379',
        });
        await redisClient.connect();
        await redisClient.flushDb();
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
            redisPrefix: 'test:ubacklog:',
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            enableDefaultMatching: true,
            ...options,
        });
    }

    async function addAssignments(matcher: AssignmentMatcher, count: number, tags: string[] = ['t1']) {
        for (let i = 1; i <= count; i++) {
            await matcher.addAssignment({ id: `a${i}`, tags, priority: 100 - i });
        }
    }

    it('caps a user below the global limit in the bulk path', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'small', tags: ['t1'], maxBacklogSize: 2 });
        await addAssignments(matcher, 4);

        await matcher.matchUsersAssignments();

        const backlog = await matcher.getCurrentAssignmentsForUser('small');
        expect(backlog).to.have.length(2);
        expect((await matcher.getAssignmentCounts()).queued).to.equal(2);
    });

    it('allows a user above the global limit', async function () {
        const matcher = createMatcher({ maxUserBacklogSize: 2 });
        await matcher.addUser({ id: 'big', tags: ['t1'], maxBacklogSize: 4 });
        await addAssignments(matcher, 6);

        await matcher.matchUsersAssignments();

        const backlog = await matcher.getCurrentAssignmentsForUser('big');
        expect(backlog).to.have.length(4);
        expect((await matcher.getAssignmentCounts()).queued).to.equal(2);
    });

    it('caps the per-user matching path', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'small', tags: ['t1'], maxBacklogSize: 1 });
        await addAssignments(matcher, 3);

        await matcher.matchUsersAssignments('small');
        expect(await matcher.getCurrentAssignmentsForUser('small')).to.have.length(1);

        // Already full: another pass grants nothing more
        await matcher.matchUsersAssignments('small');
        expect(await matcher.getCurrentAssignmentsForUser('small')).to.have.length(1);
    });

    it('a user with maxBacklogSize 0 receives nothing while others still match', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'blocked', tags: ['t1'], maxBacklogSize: 0 });
        await matcher.addUser({ id: 'open', tags: ['t1'] });
        await addAssignments(matcher, 3);

        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('blocked')).to.have.length(0);
        expect(await matcher.getCurrentAssignmentsForUser('open')).to.have.length(3);
    });

    it('caps users independently in the fair path', async function () {
        const matcher = createMatcher({ fairness: 'best-match' });
        // 'strong' would win every contest on score but is capped at 1.
        await matcher.addUser({ id: 'strong', tags: [], routingWeights: { t1: 100 }, maxBacklogSize: 1 });
        await matcher.addUser({ id: 'weak', tags: [], routingWeights: { t1: 10 } });
        await addAssignments(matcher, 4);

        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('strong')).to.have.length(1);
        expect(await matcher.getCurrentAssignmentsForUser('weak')).to.have.length(3);
    });

    it('explainMatch reports backlogFull against the effective per-user limit', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'small', tags: ['t1'], maxBacklogSize: 1 });
        await addAssignments(matcher, 2);

        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('small')).to.have.length(1);

        const explanation = await matcher.explainMatch('a2');
        const candidate = explanation.candidates.find((c) => c.userId === 'small');
        expect(candidate).to.not.equal(undefined);
        expect(candidate!.eligible).to.equal(false);
        const backlogReason = candidate!.reasons.find((r) => r.kind === 'backlogFull') as
            | { kind: 'backlogFull'; backlog: number; limit: number }
            | undefined;
        expect(backlogReason).to.not.equal(undefined);
        expect(backlogReason!.limit).to.equal(1);
    });

    it('ignores invalid maxBacklogSize values and falls back to the global cap', async function () {
        const matcher = createMatcher({ maxUserBacklogSize: 2 });
        await matcher.addUser({ id: 'weird', tags: ['t1'], maxBacklogSize: -3 as any });
        await addAssignments(matcher, 4);

        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('weird')).to.have.length(2);
    });
});
