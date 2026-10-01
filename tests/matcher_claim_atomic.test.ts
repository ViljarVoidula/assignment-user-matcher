import { expect } from 'chai';
import { createTestClient } from './helpers/redis';
import AssignmentMatcher from '../src/matcher.class';

/**
 * The claim and the queued -> pending move are one step.
 *
 * The HDEL on the queued hash decides who won an assignment. When the pending
 * record was written in a second round trip, the assignment sat in no store at
 * all between the two: a cancel or a GET in that window answered "task not
 * found" for live work (the console's cancel e2e hit it), and a crash there
 * lost the assignment outright. Every write the matcher issues after the claim
 * is probed here: by then the assignment must already read as pending.
 */
describe('claiming moves an assignment to pending in one step', function () {
    let redisClient: any;
    const prefix = 'test:claim_atomic:';

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
    });

    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    for (const enableLearning of [false, true]) {
        it(`is never in no store at all while it is claimed${enableLearning ? ', learning on' : ''}`, async function () {
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: prefix,
                maxUserBacklogSize: 5,
                relevantBatchSize: 50,
                enableLearning,
            });
            await matcher.addUser({ id: 'ana', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 1 });

            const seen: Array<string | null> = [];
            const originalMulti = redisClient.multi.bind(redisClient);
            redisClient.multi = () => {
                const multi = originalMulti();
                const exec = multi.exec.bind(multi);
                multi.exec = async (...args: unknown[]) => {
                    const found = await matcher.getAssignment('a1');
                    seen.push(found?._status ?? null);
                    return exec(...args);
                };
                return multi;
            };
            try {
                await matcher.matchUsersAssignments('ana');
            } finally {
                redisClient.multi = originalMulti;
            }

            expect(seen, 'a write ran while the assignment was in no store').to.not.include(null);
            const after = await matcher.getAssignment('a1');
            expect(after?._status).to.equal('pending');
            expect(await matcher.getCurrentAssignmentsForUser('ana')).to.deep.equal(['a1']);
            if (enableLearning) {
                expect(await matcher.getLearningDecision('a1'), 'the decision is committed with the claim').to.not.equal(
                    null,
                );
            }
        });
    }

    it('a lost claim writes nothing: no pending record, no owner, no decision', async function () {
        const matcher = new AssignmentMatcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 5,
            relevantBatchSize: 50,
            enableLearning: true,
        });
        await matcher.addUser({ id: 'ana', tags: ['support'] });
        await matcher.addUser({ id: 'bo', tags: ['support'] });
        await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 1 });

        await matcher.matchUsersAssignments('ana');
        await matcher.matchUsersAssignments('bo');

        expect(await matcher.getCurrentAssignmentsForUser('ana')).to.deep.equal(['a1']);
        expect(await matcher.getCurrentAssignmentsForUser('bo')).to.deep.equal([]);
    });
});
