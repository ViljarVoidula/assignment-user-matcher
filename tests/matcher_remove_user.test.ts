import { expect } from 'chai';
import { createTestClient } from './helpers/redis';
import AssignmentMatcher from '../src/matcher.class';
import type { AssignmentLifecycleEvent } from '../src/types/matcher';

/**
 * Removing a worker hands back everything they held.
 *
 * `removeUser` used to delete the worker's own indexes and nothing else, so
 * their pending offers sat under a person who no longer existed until a
 * response deadline (if any) ran out, and their accepted work never came back
 * at all: nobody else could complete it, and the person who could was gone.
 */
describe('removeUser hands held work back to the queue', function () {
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    const prefix = 'test:remove_user:';

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
        events = [];
    });

    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    function createMatcher(options: Record<string, unknown> = {}) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 5,
            relevantBatchSize: 50,
            onAssignmentLifecycle: (event) => events.push(event),
            ...options,
        });
    }

    const released = () =>
        events
            .filter((e): e is Extract<AssignmentLifecycleEvent, { kind: 'released' }> => e.kind === 'released')
            .map((e) => [e.taskId, e.workerId, e.reason])
            .sort();

    it('requeues pending and accepted work, and a colleague picks both up', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'leaver', tags: ['a'] });
        await matcher.addAssignment({ id: 'offered', tags: ['a'], priority: 1 });
        await matcher.addAssignment({ id: 'underway', tags: ['a'], priority: 2 });
        await matcher.matchUsersAssignments('leaver');
        expect(await matcher.acceptAssignment('leaver', 'underway')).to.equal(true);

        expect(await matcher.getUserHeldWork('leaver')).to.deep.equal({
            pending: ['offered'],
            accepted: ['underway'],
            booked: [],
        });

        await matcher.removeUser('leaver');

        expect(await matcher.getUserHeldWork('leaver')).to.deep.equal({ pending: [], accepted: [], booked: [] });
        expect(released()).to.deep.equal([
            ['offered', 'leaver', 'removed'],
            ['underway', 'leaver', 'removed'],
        ]);
        expect(await redisClient.hLen(`${prefix}assignments:pending:owner`)).to.equal(0);
        expect(await redisClient.hLen(`${prefix}assignments:accepted:owner`)).to.equal(0);
        expect(await redisClient.hLen(`${prefix}assignments:accepted`)).to.equal(0);

        await matcher.addUser({ id: 'colleague', tags: ['a'] });
        await matcher.matchUsersAssignments('colleague');
        const owners = await redisClient.hGetAll(`${prefix}assignments:pending:owner`);
        expect(owners).to.deep.equal({ offered: 'colleague', underway: 'colleague' });
    });

    it('strips the acceptance from requeued work so it reads as unaccepted', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'leaver', tags: ['a'] });
        await matcher.addAssignment({ id: 'underway', tags: ['a'], sla: { completeWithinMs: 60_000 } } as any);
        await matcher.matchUsersAssignments('leaver');
        await matcher.acceptAssignment('leaver', 'underway');

        await matcher.removeUser('leaver');

        const [queued] = (await matcher.getAllAssignments()).filter((a) => a.id === 'underway') as any[];
        expect(queued).to.not.equal(undefined);
        expect(queued._acceptedAt).to.equal(undefined);
        expect(queued._acceptedBy).to.equal(undefined);
        // The completion clock they were working to must not keep running.
        expect(await redisClient.zScore(`${prefix}assignments:accepted:expiry`, 'underway')).to.equal(null);
        // Waiting again, so queue age can see it.
        expect(await redisClient.zScore(`${prefix}assignments:queuedAt`, 'underway')).to.not.equal(null);
    });

    it('is a no-op for held work when the user held nothing', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'idle', tags: ['a'] });
        await matcher.removeUser('idle');
        expect(released()).to.deep.equal([]);
        expect(await matcher.getUser('idle')).to.equal(null);
    });
});
