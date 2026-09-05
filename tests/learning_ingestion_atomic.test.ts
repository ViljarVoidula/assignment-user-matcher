import { expect } from 'chai';
import { LearningManager } from '../src/managers/LearningManager';
import { createKeyBuilders } from '../src/utils/keys';
import { createTestClient } from './helpers/redis';

describe('Learning ingestion atomic commit', function () {
    this.timeout(20000);
    let client: any;
    const keys = createKeyBuilders({ prefix: 'atomic-ingestion:' });
    const options = {
        targets: { targets: ['acceptance', 'successGivenAcceptance', 'quality'] as any },
        trackTagStats: true,
        trackPerformance: true,
        rewardAccounting: 'per-attempt' as const,
        autoWeights: { decayHalfLifeMs: 60000 },
    };
    before(async () => {
        client = createTestClient();
        await client.connect();
    });
    beforeEach(async () => {
        await client.flushDb();
    });
    after(async () => {
        await client.quit();
    });

    function intercepted(intercept: (name: string, args: any[], invoke: () => Promise<any>) => Promise<any>) {
        return new Proxy(client, {
            get: (target, name: string) =>
                name === 'multi'
                    ? target.multi.bind(target)
                    : typeof target[name] === 'function'
                      ? (...args: any[]) => intercept(name, args, () => target[name](...args))
                      : target[name],
        });
    }
    async function rejected(promise: Promise<any>) {
        let error: unknown;
        try {
            await promise;
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);
    }

    it('does not consume an event when preparation fails after target updates were staged', async () => {
        let fail = true;
        const m = new LearningManager(
            intercepted(async (name, args, invoke) => {
                if (fail && name === 'hmGet' && args[0] === keys.learningModel()) throw new Error('read failure');
                return invoke();
            }),
            keys,
            options,
        );
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        await rejected(m.applyOutcome('a', 'accept'));
        expect(await client.sMembers(keys.learningApplied(id))).to.deep.equal([]);
        expect(await m.getTargetModel('acceptance')).to.deep.equal({});
        expect((await m.getStats()).rewards).to.equal(0);
        fail = false;
        expect(await m.applyOutcome('a', 'accept')).to.equal(true);
        expect((await m.getStats()).rewards).to.equal(1);
    });

    it('validates a bad late-stage aggregate before writing models or the dedup marker', async () => {
        const m = new LearningManager(client, keys, options);
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        await client.set(keys.learningUserPerformance('u'), 'wrong-type');
        await rejected(m.applyOutcome('a', 'complete'));
        expect(await m.getModel()).to.deep.equal({});
        expect(await m.getTargetModel('successGivenAcceptance')).to.deep.equal({});
        expect(await client.sMembers(keys.learningApplied(id))).to.deep.equal([]);
        expect(await m.getUserTagStats('u')).to.deep.equal([]);
        expect(await m.getDecisionById(id)).not.to.equal(null);
        await client.del(keys.learningUserPerformance('u'));
        expect(await m.applyOutcome('a', 'complete')).to.equal(true);
        expect((await m.getUserTagStats('u'))[0].count).to.be.closeTo(1, 0.01);
    });

    it('replays safely when the commit succeeded but its response was lost', async () => {
        let fail = true;
        const m = new LearningManager(
            intercepted(async (name, args, invoke) => {
                const result = await invoke();
                if (name === 'eval' && fail) {
                    fail = false;
                    throw new Error('response lost');
                }
                return result;
            }),
            keys,
            options,
        );
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        await rejected(m.applyOutcome('a', 'complete'));
        const model = await m.getModel();
        expect(await m.applyOutcome('a', 'complete')).to.equal(false);
        expect(await m.getModel()).to.deep.equal(model);
        expect((await m.getStats()).rewards).to.equal(1);
        expect(await m.getUserAttemptTotal('u')).to.equal(1);
    });

    it('commits concurrent duplicate events once across separate managers', async () => {
        const m = new LearningManager(client, keys, options);
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        const results = await Promise.all(
            Array.from({ length: 12 }, () => new LearningManager(client, keys, options).applyOutcome('a', 'complete')),
        );
        expect(results.filter(Boolean)).to.have.length(1);
        expect((await m.getStats()).rewards).to.equal(1);
        expect(await m.getUserAttemptTotal('u')).to.equal(1);
    });

    it('does not consume an event rejected for incorrect ownership', async () => {
        const m = new LearningManager(client, keys, options);
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        expect(await m.applyOutcome('a', 'accept', { expectedUserId: 'other' })).to.equal(false);
        expect(await client.sMembers(keys.learningApplied(id))).to.deep.equal([]);
        expect(await m.applyOutcome('a', 'accept', { expectedUserId: 'u' })).to.equal(true);
    });

    it('replans distinct concurrent events without losing accrued rewards', async () => {
        const m = new LearningManager(client, keys, options);
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        const results = await Promise.all(
            Array.from({ length: 8 }, (_, i) =>
                new LearningManager(client, keys, options).applyOutcome('a', 'accept', { eventId: `e${i}` }),
            ),
        );
        expect(results.every(Boolean)).to.equal(true);
        expect((await m.getDecisionById(id))!.accruedReward).to.be.closeTo(8 * 0.3, 1e-10);
        expect((await m.getStats()).rewards).to.equal(8);
    });

    it('rechecks generation if a reset occurs while preparing an event', async () => {
        let reset = true;
        const m = new LearningManager(
            intercepted(async (name, args, invoke) => {
                if (name === 'eval' && reset) {
                    reset = false;
                    await client.incr(keys.learningGeneration());
                }
                return invoke();
            }),
            keys,
            options,
        );
        const id = await m.recordDecision('u', 'a', { bias: 1 }, 0, ['t']);
        expect(await m.applyOutcome('a', 'accept')).to.equal(false);
        expect(await m.getModel()).to.deep.equal({});
        expect(await client.sMembers(keys.learningApplied(id))).to.deep.equal([]);
    });
});
