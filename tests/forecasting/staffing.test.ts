import { expect } from 'chai';
import { createPrng, exponentialQuantiles, meanOf } from '../../src/forecasting/distributions';
import { erlangA, erlangAAbandonment, erlangASeed } from '../../src/forecasting/erlang';
import {
    createSimStats,
    drawTasks,
    profileScores,
    simulate,
    type Carry,
    type SimTag,
} from '../../src/forecasting/simulation';
import {
    DEFAULT_SEEDS,
    composeTeam,
    quantize,
    rateNeed,
    headcountNeed,
    staffingNeed,
    windowFor,
} from '../../src/forecasting/staffing';
import type { PoolMember, TagProfile } from '../../src/forecasting/types';

const MIN = 60_000;
const tag = (name: string, over: Partial<TagProfile> = {}): TagProfile => ({
    tag: name,
    handleMs: exponentialQuantiles(5 * MIN),
    targetWaitMs: MIN,
    targetShare: 0.8,
    ...over,
});
const everyone = (tags: string[], count = 100): PoolMember[] => [{ tags, count }];
const hour = (arrivals: Record<string, number>, startMs = 0) => ({ startMs, arrivals });
const poisson = { shrinkage: 0, overdispersion: Infinity } as const;

describe('Erlang A', () => {
    it('matches Erlang C when nobody leaves', () => {
        // 120 an hour at 5 minutes = 10 erlangs; Erlang C: 13 agents give ~ 83 % within 60 s.
        const input = { lambda: 120 / (60 * MIN), meanHandleMs: 5 * MIN, meanPatienceMs: Infinity, targetMs: MIN };
        expect(erlangA(13, input).serviceLevel).to.be.within(0.8, 0.9);
        expect(erlangA(12, input).serviceLevel).to.be.below(0.8);
        expect(erlangASeed(input, 0.8, 100)).to.equal(13);
        expect(erlangAAbandonment(13, input)).to.equal(0);
    });
    it('needs fewer people when some callers give up', () => {
        const base = { lambda: 120 / (60 * MIN), meanHandleMs: 5 * MIN, targetMs: MIN };
        expect(erlangASeed({ ...base, meanPatienceMs: 2 * MIN }, 0.8, 100)).to.be.at.most(
            erlangASeed({ ...base, meanPatienceMs: Infinity }, 0.8, 100),
        );
        expect(erlangA(5, { ...base, meanPatienceMs: 2 * MIN }).serviceLevel).to.be.above(0);
        expect(erlangAAbandonment(0, { ...base, meanPatienceMs: 2 * MIN })).to.equal(1);
        expect(erlangAAbandonment(5, { ...base, meanPatienceMs: 2 * MIN })).to.be.within(0.2, 0.8);
    });
    it('is unstable without patience when load exceeds servers', () => {
        const input = { lambda: 1, meanHandleMs: 10, meanPatienceMs: 0, targetMs: 1 };
        expect(erlangA(5, input)).to.deep.equal({ pWait: 1, serviceLevel: 0 });
        expect(erlangA(0, input).serviceLevel).to.equal(0);
        expect(erlangA(3, { ...input, lambda: 0 }).serviceLevel).to.equal(1);
        expect(erlangASeed({ ...input, lambda: 0 }, 0.8, 10)).to.equal(0);
        expect(erlangASeed(input, 0.8, 7)).to.equal(7);
    });
});

describe('staffingNeed', () => {
    it('agrees with Erlang C (±1) on the one case Erlang C models exactly', () => {
        const { intervals } = staffingNeed([hour({ chat: 120 })], [tag('chat')], everyone(['chat']), poisson);
        expect(intervals[0].method).to.equal('simulation');
        expect(intervals[0].erlangSeed).to.equal(13);
        expect(intervals[0].productive.likely).to.be.within(12, 14);
        expect(intervals[0].productive.low).to.be.at.most(intervals[0].productive.likely);
        expect(intervals[0].productive.high).to.be.at.least(intervals[0].productive.likely);
        expect(intervals[0].serviceByTag.chat).to.be.at.least(0.78);
    });

    it('counts a multi-skilled person once: a shared pool needs fewer than two separate ones', () => {
        const tags = [tag('en'), tag('fi')];
        const load = hour({ en: 60, fi: 60 });
        const shared = staffingNeed([load], tags, everyone(['en', 'fi']), poisson).intervals[0].productive.likely;
        const en = staffingNeed([hour({ en: 60 })], [tag('en')], everyone(['en']), poisson).intervals[0].productive.likely;
        const fi = staffingNeed([hour({ fi: 60 })], [tag('fi')], everyone(['fi']), poisson).intervals[0].productive.likely;
        expect(shared).to.be.below(en + fi);
    });

    it('needs about a third of the people when each works three tasks at once', () => {
        const one = staffingNeed([hour({ chat: 240 })], [tag('chat')], everyone(['chat']), poisson).intervals[0];
        const three = staffingNeed([hour({ chat: 240 })], [tag('chat', { concurrency: 3 })], everyone(['chat']), poisson)
            .intervals[0];
        expect(three.productive.likely).to.be.within(
            Math.floor(one.productive.likely / 3) - 1,
            Math.ceil(one.productive.likely / 3) + 2,
        );
    });

    it('adds shrinkage on top: people on shift = working ÷ (1 − shrinkage)', () => {
        const { intervals } = staffingNeed([hour({ chat: 120 })], [tag('chat')], everyone(['chat']), {
            ...poisson,
            shrinkage: 0.3,
        });
        expect(intervals[0].onShift.likely).to.equal(Math.ceil(intervals[0].productive.likely / 0.7));
    });

    it('rosters the one person with a rare skill instead of scaling the whole team to reach them', () => {
        const pool: PoolMember[] = [
            { tags: ['en'], count: 19 },
            { tags: ['en', 'de'], count: 1 },
        ];
        const { intervals } = staffingNeed([hour({ en: 12, de: 2 })], [tag('en'), tag('de')], pool, poisson);
        expect(intervals[0].productive.likely).to.be.at.most(5);
        // Work per tag in people: en 12/h × 5 min = 1, de 2/h × 5 min = 1/6.
        expect(composeTeam(2, [Float64Array.from([1, -1]), Float64Array.from([1, 1])], [19, 1], [1, 1 / 6])).to.deep.equal([
            1, 1,
        ]);
    });

    it('reports a tag nobody can take and staffs the rest', () => {
        const { intervals } = staffingNeed([hour({ en: 30, xx: 10 })], [tag('en'), tag('xx')], everyone(['en']), poisson);
        expect(intervals[0].uncovered).to.deep.equal(['xx']);
        expect(intervals[0].productive.likely).to.be.above(0);
    });

    it('never offers a vetoed tag (routing weight 0) and honours wildcards', () => {
        const pool: PoolMember[] = [{ tags: ['lang:*'], weights: { 'lang:*': 50, 'lang:de': 0 }, count: 10 }];
        const { intervals } = staffingNeed(
            [hour({ 'lang:en': 30, 'lang:de': 5 })],
            [tag('lang:en'), tag('lang:de')],
            pool,
            poisson,
        );
        expect(intervals[0].uncovered).to.deep.equal(['lang:de']);
    });

    it('stays finite when people give up waiting', () => {
        const impatient = tag('chat', { patienceMs: exponentialQuantiles(2 * MIN) });
        const { intervals } = staffingNeed([hour({ chat: 120 })], [impatient], everyone(['chat']), poisson);
        expect(intervals[0].capped).to.equal(false);
        expect(intervals[0].productive.likely).to.be.within(8, 16);
    });

    it('serves the higher-priority tag first when people are scarce', () => {
        const pool = everyone(['vip', 'std']);
        const tags = [tag('vip', { priority: 10 }), tag('std')];
        const { intervals } = staffingNeed([hour({ vip: 60, std: 60 })], tags, pool, poisson);
        expect(intervals[0].serviceByTag.vip).to.be.at.least(intervals[0].serviceByTag.std);
    });

    it('answers nothing for a quiet hour, is deterministic, and shares one simulation between equal hours', () => {
        const run = () =>
            staffingNeed(
                [hour({ chat: 0 }, 0), hour({ chat: 50 }, 1), hour({ chat: 50.4 }, 2)],
                [tag('chat')],
                everyone(['chat']),
                { ...poisson, seed: 9 },
            );
        const a = run();
        expect(a.intervals[0].method).to.equal('none');
        expect(a.cacheHits).to.equal(1);
        expect(a.intervals[1].productive).to.deep.equal(a.intervals[2].productive);
        expect(run().intervals).to.deep.equal(a.intervals);
    });

    it('stops at the time budget and says which hours it skipped', () => {
        const result = staffingNeed([hour({ chat: 40 })], [tag('chat')], everyone(['chat']), { ...poisson, budgetMs: -1 });
        expect(result.incomplete).to.equal(true);
        expect(result.intervals[0].method).to.equal('skipped');
    });

    it('caps a search that can never meet the target', () => {
        const slow = tag('chat', { handleMs: exponentialQuantiles(60 * MIN), targetWaitMs: 0, targetShare: 1 });
        const { intervals } = staffingNeed([hour({ chat: 500 })], [slow], everyone(['chat']), {
            ...poisson,
            maxPeople: 20,
            seeds: 2,
        });
        expect(intervals[0].capped).to.equal(true);
        expect(intervals[0].productive.likely).to.equal(20);
    });

    it('refuses a malformed distribution', () => {
        expect(() =>
            staffingNeed([hour({ a: 1 })], [tag('a', { handleMs: { q: [1] } })], everyone(['a']), poisson),
        ).to.throw(RangeError);
        expect(() =>
            staffingNeed([hour({ a: 1 })], [tag('a', { handleMs: { q: [2, 1] } })], everyone(['a']), poisson),
        ).to.throw(RangeError);
        expect(() =>
            staffingNeed([hour({ a: 1 })], [tag('a', { patienceMs: { q: [Number.NaN, 1] } })], everyone(['a']), poisson),
        ).to.throw(RangeError);
    });
});

/**
 * The five ways naive Erlang C gets staffing wrong (infinite patience, one task per person, one skill per
 * person counted once per skill, no shrinkage) and the one case where it is right. Each test below would
 * fail against an Erlang C answer.
 */
describe('staffingNeed against queueing theory', () => {
    const chat = tag('chat');
    const simTag = (profile: TagProfile): SimTag => ({ profile, cost: 1 / (profile.concurrency ?? 1), priority: 0 });
    /**
     * `seeds` independent hours of one tag with `n` people, each after a two-hour warm-up so it starts in
     * steady state. Shares are pooled over the hours, each with its standard error by the ratio estimator
     * from the hours' own spread — an hour's service level swings widely with its arrival count, so the
     * error has to come from the data, not from a binomial over arrivals.
     */
    const longRun = (profile: TagProfile, perHour: number, n: number, seeds = 300) => {
        const tags = [simTag(profile)];
        const pool = [profileScores({ tags: [profile.tag] }, tags)];
        const window = { warmMs: 120 * MIN, lengthMs: 60 * MIN, tailMs: 30 * MIN };
        const rows: Array<{ arrived: number; served: number; delayed: number; abandoned: number }> = [];
        let maxUsed = 0;
        for (let s = 0; s < seeds; s++) {
            const tasks = drawTasks([perHour], tags, window, Infinity, createPrng(1000 + s));
            const stats = createSimStats(1);
            const served = simulate(tasks, pool, [n], tags, window, stats);
            rows.push({
                arrived: tasks.measuredByTag[0],
                served: served[0],
                delayed: stats.delayed[0],
                abandoned: stats.abandoned[0],
            });
            maxUsed = Math.max(maxUsed, stats.maxUsed);
        }
        const share = (key: 'served' | 'delayed' | 'abandoned') => {
            const x = rows.reduce((sum, r) => sum + r.arrived, 0);
            const y = rows.reduce((sum, r) => sum + r[key], 0);
            const ratio = y / x;
            const mean = x / rows.length;
            const spread = rows.reduce((sum, r) => sum + (r[key] - ratio * r.arrived) ** 2, 0);
            return { value: ratio, se: Math.sqrt(spread / (rows.length * (rows.length - 1))) / mean };
        };
        return { serviceLevel: share('served'), pWait: share('delayed'), pAbandon: share('abandoned'), maxUsed };
    };
    /** Four standard errors, plus a little for quantile-sampled "exponential" times (cut at p99.9). */
    const within = (estimate: { value: number; se: number }, theory: number, what: string) =>
        expect(estimate.value, what).to.be.closeTo(theory, 4 * estimate.se + 0.005);

    it('(5) agrees with Erlang C within sampling error when nobody leaves, one task each, one tag', () => {
        // 600 an hour at 5 minutes = 50 erlangs, 80 % within 20 s.
        const profile = tag('chat', { targetWaitMs: 20_000 });
        const input = {
            lambda: 600 / (60 * MIN),
            meanHandleMs: meanOf(profile.handleMs),
            meanPatienceMs: Infinity,
            targetMs: 20_000,
        };
        const seed = erlangASeed(input, 0.8, 200);
        const need = staffingNeed([hour({ chat: 600 })], [profile], everyone(['chat']), poisson).intervals[0];
        expect(need.productive.likely).to.be.within(seed - 1, seed + 1);
        // Head for head, the simulated queue is Erlang C's queue.
        for (const n of [seed - 2, seed, seed + 2]) {
            const run = longRun(profile, 600, n);
            const theory = erlangA(n, input);
            expect(run.pAbandon.value).to.equal(0);
            within(run.pWait, theory.pWait, `pWait n=${n}`);
            within(run.serviceLevel, theory.serviceLevel, `service level n=${n}`);
        }
    });

    it('(1) agrees with Erlang A when patience is exponential: who waits, and who gives up', () => {
        const patience = 2 * MIN;
        const profile = tag('chat', { patienceMs: exponentialQuantiles(patience) });
        for (const n of [8, 10, 12]) {
            const input = {
                lambda: 120 / (60 * MIN),
                meanHandleMs: meanOf(profile.handleMs),
                meanPatienceMs: meanOf(profile.patienceMs!),
                targetMs: MIN,
            };
            const run = longRun(profile, 120, n);
            within(run.pWait, erlangA(n, input).pWait, `pWait n=${n}`);
            within(run.pAbandon, erlangAAbandonment(n, input), `pAbandon n=${n}`);
        }
        // Nobody on: every arrival gives up, after its own patience.
        expect(longRun(profile, 120, 0, 5).pAbandon.value).to.equal(1);
    });

    it('(1) needs fewer people than Erlang C when people give up waiting', () => {
        // 50 erlangs at 80 % within 20 s; Erlang C assumes everyone waits forever and asks for 57.
        const base = tag('chat', { targetWaitMs: 20_000 });
        const input = {
            lambda: 600 / (60 * MIN),
            meanHandleMs: meanOf(base.handleMs),
            meanPatienceMs: Infinity,
            targetMs: 20_000,
        };
        const erlangC = erlangASeed(input, 0.8, 200);
        const need = (patienceMin?: number) =>
            staffingNeed(
                [hour({ chat: 600 })],
                [{ ...base, patienceMs: patienceMin ? exponentialQuantiles(patienceMin * MIN) : undefined }],
                everyone(['chat']),
                poisson,
            ).intervals[0];
        const patient = need();
        expect(patient.productive.likely).to.be.within(erlangC - 1, erlangC + 1);
        // People who leave shorten the queue for everyone behind them — even though each one who leaves
        // counts as not served. The shorter the patience, the fewer people it takes.
        const five = need(5).productive.likely;
        const two = need(2).productive.likely;
        expect(five).to.be.below(erlangC);
        expect(two).to.be.below(five);
        expect(two).to.be.at.most(erlangC - 4);
        // Below the offered load (50) is never enough when nobody leaves; with patience it can be.
        expect(patient.productive.low).to.be.above(50);
        expect(need(1).productive.likely).to.be.below(51);
    });

    it('(2) needs roughly a third of the people at concurrency 3, never exactly a third', () => {
        const one = staffingNeed([hour({ chat: 600 })], [chat], everyone(['chat']), poisson).intervals[0];
        const three = staffingNeed([hour({ chat: 600 })], [tag('chat', { concurrency: 3 })], everyone(['chat']), poisson)
            .intervals[0];
        const third = one.productive.likely / 3;
        expect(three.productive.likely).to.be.within(Math.floor(third) - 1, Math.ceil(third) + 3);
        // Never under the work itself: 50 erlangs at a third of a person each is at least 17 people.
        expect(three.productive.likely).to.be.at.least(Math.ceil((meanOf(chat.handleMs) * (600 / 60 / MIN)) / 3));
        // A person holds at most one unit of work: three tasks at a third each.
        const run = longRun(tag('chat', { concurrency: 3 }), 600, three.productive.likely, 3);
        expect(run.maxUsed).to.be.closeTo(1, 1e-9);
    });

    it('(3) pools a multi-skilled team: fewer people than each tag staffed apart, each person counted once', () => {
        const tags = [tag('en'), tag('fi')];
        const shared = staffingNeed([hour({ en: 120, fi: 120 })], tags, everyone(['en', 'fi']), poisson).intervals[0];
        const en = staffingNeed([hour({ en: 120 })], [tags[0]], everyone(['en']), poisson).intervals[0];
        const fi = staffingNeed([hour({ fi: 120 })], [tags[1]], everyone(['fi']), poisson).intervals[0];
        const single = staffingNeed([hour({ chat: 240 })], [chat], everyone(['chat']), poisson).intervals[0];
        // Pooling gain: 20 erlangs in one queue need fewer than two queues of 10.
        expect(shared.productive.likely).to.be.below(en.productive.likely + fi.productive.likely);
        // Counted once: people who take either tag are exactly one queue of the combined work, no more, no less.
        expect(shared.productive.likely).to.be.within(single.productive.likely - 1, single.productive.likely + 1);
        expect(shared.productive.likely).to.be.above(20);
        // While serving both tags, nobody ever holds more than one person's work.
        const simTags = tags.map(simTag);
        const pool = [profileScores({ tags: ['en', 'fi'] }, simTags)];
        const window = { warmMs: 15 * MIN, lengthMs: 60 * MIN, tailMs: MIN };
        const stats = createSimStats(2);
        simulate(drawTasks([120, 120], simTags, window, Infinity, createPrng(5)), pool, [22], simTags, window, stats);
        expect(stats.maxUsed).to.be.at.most(1 + 1e-9);
        expect(stats.delayed[0]).to.be.above(0);
        expect(stats.delayed[1]).to.be.above(0);
        // Specialists: the same 24 heads split 12 + 12 serve clearly worse than 24 who can take either.
        const split = [profileScores({ tags: ['en'] }, simTags), profileScores({ tags: ['fi'] }, simTags)];
        let arrived = 0;
        let pooledServed = 0;
        let splitServed = 0;
        for (let s = 0; s < 40; s++) {
            const tasks = drawTasks([120, 120], simTags, window, Infinity, createPrng(50 + s));
            const a = simulate(tasks, pool, [24], simTags, window);
            const b = simulate(tasks, split, [12, 12], simTags, window);
            arrived += tasks.measuredByTag[0] + tasks.measuredByTag[1];
            pooledServed += a[0] + a[1];
            splitServed += b[0] + b[1];
        }
        expect(pooledServed / arrived).to.be.at.least(0.8);
        expect(splitServed / arrived).to.be.below(0.8);
    });

    it('(4) applies shrinkage to people on shift, never to the people working the queue', () => {
        const at = (shrinkage: number) =>
            staffingNeed([hour({ chat: 600 })], [chat], everyone(['chat']), { ...poisson, shrinkage }).intervals[0];
        const none = at(0);
        const some = at(0.3);
        expect(none.onShift).to.deep.equal(none.productive);
        expect(some.productive).to.deep.equal(none.productive);
        for (const k of ['low', 'likely', 'high'] as const) {
            expect(some.onShift[k]).to.equal(Math.ceil(some.productive[k] / 0.7 - 1e-9));
            expect(some.onShift[k] * 0.7).to.be.at.least(some.productive[k] - 1e-9);
        }
        // Out of range shrinkage is held to 0–0.9.
        expect(at(0.95).onShift.likely).to.equal(Math.ceil(none.productive.likely / 0.1 - 1e-9));
    });
});

describe('the simulation, case by case', () => {
    const simTag = (profile: TagProfile): SimTag => ({ profile, cost: 1 / (profile.concurrency ?? 1), priority: 0 });
    const window = { warmMs: 0, lengthMs: 60 * MIN, tailMs: MIN };
    const one = (q: number) => ({ q: [q, q] });

    it('gives a person on half a load no call that takes a whole one', () => {
        const tags = [tag('chat', { concurrency: 2, handleMs: one(10 * MIN) }), tag('phone', { handleMs: one(MIN) })].map(
            simTag,
        );
        const pool = [profileScores({ tags: ['chat', 'phone'] }, tags)];
        // A chat at 0, a call at 1 s: the only person is half busy, so the call waits for the chat to end.
        const tasks = {
            tag: Int32Array.from([0, 1]),
            at: Float64Array.from([0, 1000]),
            handle: Float64Array.from([10 * MIN, MIN]),
            leaveAt: Float64Array.from([Infinity, Infinity]),
            measured: Uint8Array.from([1, 1]),
            measuredByTag: Int32Array.from([1, 1]),
            rate: new Float64Array(2),
        };
        const stats = createSimStats(2);
        expect(Array.from(simulate(tasks, pool, [1], tags, window, stats))).to.deep.equal([1, 0]);
        expect(Array.from(stats.delayed)).to.deep.equal([0, 1]);
        // A second chat fits beside the first.
        const chats = { ...tasks, tag: Int32Array.from([0, 0]), measuredByTag: Int32Array.from([2, 0]) };
        expect(Array.from(simulate(chats, pool, [1], tags, window))).to.deep.equal([2, 0]);
    });

    it('puts a second chat beside the first rather than on the idle person, who stays free for a call', () => {
        const tags = [tag('chat', { concurrency: 2, handleMs: one(10 * MIN) }), tag('phone', { handleMs: one(MIN) })].map(
            simTag,
        );
        const pool = [profileScores({ tags: ['chat', 'phone'] }, tags)];
        const tasks = {
            tag: Int32Array.from([0, 0, 1]),
            at: Float64Array.from([0, 1000, 2000]),
            handle: Float64Array.from([10 * MIN, 10 * MIN, MIN]),
            leaveAt: Float64Array.from([Infinity, Infinity, Infinity]),
            measured: Uint8Array.from([1, 1, 1]),
            measuredByTag: Int32Array.from([2, 1]),
            rate: new Float64Array(2),
        };
        const stats = createSimStats(2);
        expect(Array.from(simulate(tasks, pool, [2], tags, { ...window, tailMs: 0 }, stats))).to.deep.equal([2, 1]);
        expect(Array.from(stats.delayed)).to.deep.equal([0, 0]);
    });

    it('draws nothing for a tag without a forecast', () => {
        const tasks = drawTasks([], [simTag(tag('chat'))], window, Infinity, createPrng(1));
        expect(tasks.at.length).to.equal(0);
    });

    it('needs nobody for a trickle hour in which nothing arrived', () => {
        const trickle = (seeds: number) =>
            staffingNeed([hour({ chat: 0.1 })], [tag('chat')], everyone(['chat']), { ...poisson, seeds }).intervals[0];
        const quiet = trickle(1);
        expect(quiet.method).to.equal('simulation');
        expect(quiet.productive).to.deep.equal({ low: 0, likely: 0, high: 0 });
        expect(quiet.serviceByTag).to.deep.equal({ chat: 1 });
        const some = trickle(40);
        expect(some.productive.low).to.equal(0);
        expect(some.productive.likely).to.equal(1);
    });

    it('reads a tag missing from an hour as no work', () => {
        const need = staffingNeed([hour({ en: 30 })], [tag('en'), tag('fi')], everyone(['en', 'fi']), poisson).intervals[0];
        expect(need.uncovered).to.deep.equal([]);
        expect(Object.keys(need.serviceByTag)).to.deep.equal(['en']);
    });

    it('widens the range when the hour’s rate itself is uncertain (overdispersion, by default)', () => {
        const at = (options: Parameters<typeof staffingNeed>[3]) =>
            staffingNeed([hour({ chat: 300 })], [tag('chat')], everyone(['chat']), options).intervals[0].productive;
        const exact = at(poisson);
        const noisy = at({ shrinkage: 0 });
        expect(noisy.high - noisy.low).to.be.above(exact.high - exact.low);
    });
});

describe('composeTeam', () => {
    const en = Float64Array.from([1, -1]);
    const fi = Float64Array.from([-1, 1]);
    const both = Float64Array.from([1, 1]);
    it('fills by where the work is, not by the pool’s mix', () => {
        // 90 en speakers, 10 fi speakers; the hour is almost all fi.
        const team = composeTeam(14, [en, fi], [90, 10], [0.8, 8.3]);
        expect(team.reduce((a, b) => a + b, 0)).to.equal(14);
        expect(team[1]).to.be.above(10); // more fi than the pool has: hire fi
        expect(team[0]).to.be.within(1, 3);
        // Within the pool: specialists for the common work, generalists kept for what only they can take,
        // never over a declared count while the pool has people left.
        expect(composeTeam(10, [en, both], [10, 10], [2, 2])).to.deep.equal([5, 5]);
        expect(composeTeam(14, [en, both], [10, 4], [8, 2])).to.deep.equal([10, 4]);
        expect(composeTeam(0, [en, fi], [90, 10], [1, 1])).to.deep.equal([0, 0]);
    });
    it('covers every busy tag before anything else, and falls back on the pool’s mix with no work', () => {
        // fi's work is tiny but somebody has to be able to take it.
        expect(composeTeam(3, [en, fi], [10, 10], [3, 0.01])).to.deep.equal([2, 1]);
        // A busy tag nobody covers is skipped.
        expect(composeTeam(2, [en, en], [5, 5], [1, 1])).to.deep.equal([1, 1]);
        expect(composeTeam(4, [en, fi], [3, 1], [0, 0])).to.deep.equal([3, 1]);
        expect(composeTeam(2, [en], [0], [0])).to.deep.equal([0]);
        // Fewer heads than busy tags: the rarest first, as far as they go.
        expect(composeTeam(1, [en, fi], [1, 5], [1, 1])).to.deep.equal([1, 0]);
    });
});

describe('staffingNeed: review fixes', () => {
    it('staffs by where the work is and says when it needs more than the pool has (C1, M5)', () => {
        const pool: PoolMember[] = [
            { tags: ['en'], count: 90 },
            { tags: ['fi'], count: 10 },
        ];
        const need = staffingNeed([hour({ en: 10, fi: 100 })], [tag('en'), tag('fi')], pool, poisson).intervals[0];
        // fi alone (8.3 erlangs) needs about 12, en (0.8) about 2: ~14, not a hundred en speakers to reach fi.
        expect(need.productive.likely).to.be.within(12, 16);
        expect(need.exceedsPool).to.equal(true);
        const fits = staffingNeed([hour({ en: 100, fi: 10 })], [tag('en'), tag('fi')], pool, poisson).intervals[0];
        expect(fits.exceedsPool).to.equal(false);
    });

    it('scores and gates like the router (calculateMatchScore), whatever order the pool is declared in (I2)', () => {
        const tags = [tag('lang:en'), tag('lang:de'), tag('lang:fi')].map((profile) => ({
            profile,
            cost: 1,
            priority: 0,
        }));
        // Wildcard and exact weights add up; a zero weight vetoes even next to a positive one.
        expect(Array.from(profileScores({ tags: [], weights: { 'lang:*': 50, 'lang:en': 10 } }, tags))).to.deep.equal([
            60, 50, 50,
        ]);
        expect(Array.from(profileScores({ tags: [], weights: { 'lang:de': 5, 'lang:*': 0 } }, tags))).to.deep.equal([
            -1, -1, -1,
        ]);
        // Without weights: the share of the person's tags the task matches — a specialist outranks a generalist.
        expect(Array.from(profileScores({ tags: ['lang:en', 'lang:de'] }, tags))).to.deep.equal([0.5, 0.5, -1]);
        const pool: PoolMember[] = [
            { tags: ['lang:en', 'lang:de'], count: 6 },
            { tags: ['lang:en'], count: 20 },
            { tags: ['lang:*'], weights: { 'lang:*': 10, 'lang:fi': 30 }, count: 4 },
            { tags: ['lang:de'], count: 3 },
        ];
        const profiles = [tag('lang:en'), tag('lang:de'), tag('lang:fi')];
        const load = [hour({ 'lang:en': 90, 'lang:de': 40, 'lang:fi': 20 })];
        const forward = staffingNeed(load, profiles, pool, poisson);
        const backward = staffingNeed(load, profiles, [...pool].reverse(), poisson);
        expect(backward.intervals).to.deep.equal(forward.intervals);
    });

    it('carries the queue into the next hour for long-target work (I1)', () => {
        // Email: 10 minutes each, 80 % within 30 minutes. A three-hour peak, then a quiet hour.
        const email = tag('email', { handleMs: exponentialQuantiles(10 * MIN), targetWaitMs: 30 * MIN });
        const loads = [20, 120, 120, 120, 40, 20];
        const hours = loads.map((n, h) => hour({ email: n }, h * 60 * MIN));
        const plan = staffingNeed(hours, [email], everyone(['email'], 500), poisson).intervals;
        const after = 4;
        // Replay the day on fresh draws with the planned head counts, the queue carried hour to hour.
        const simTags = [{ profile: email, cost: 1, priority: 0 }];
        const pool = [profileScores({ tags: ['email'] }, simTags)];
        const replay = (heads: number[]) => {
            let served = 0;
            let arrived = 0;
            for (let s = 0; s < 200; s++) {
                const rand = createPrng(70_000 + s);
                let carry: Carry | null = null;
                for (let h = 0; h <= after; h++) {
                    const window = { ...windowFor([email]), ...(carry ? { warmMs: 0 } : {}) };
                    const tasks = drawTasks([loads[h]], simTags, window, Infinity, rand, carry);
                    const out = { carry: null as Carry | null };
                    const done = simulate(tasks, pool, [heads[h]], simTags, window, undefined, out);
                    carry = out.carry;
                    if (h === after) {
                        served += done[0];
                        arrived += tasks.measuredByTag[0];
                    }
                }
            }
            return served / arrived;
        };
        const planned = plan.map((i) => i.productive.likely);
        expect(planned[after]).to.be.above(planned[0]);
        expect(replay(planned)).to.be.at.least(plan[after].serviceByTag.email - 0.03);
        // Staffed as if the hour after the peak started empty, the backlog sinks it.
        const alone = staffingNeed([hours[after]], [email], everyone(['email'], 500), poisson).intervals[0];
        expect(alone.productive.likely).to.be.below(planned[after]);
        const naive = [...planned];
        naive[after] = alone.productive.likely;
        expect(replay(naive)).to.be.below(0.8);
    });

    it('lets a backlog wait through a quiet hour, and starts afresh after a gap (I1)', () => {
        const email = tag('email', { handleMs: exponentialQuantiles(10 * MIN), targetWaitMs: 30 * MIN });
        const H = 60 * MIN;
        const pool = everyone(['email'], 500);
        // At most 20 people: the 150-an-hour peak (25 erlangs) leaves a real backlog behind.
        const run = (hours: ReturnType<typeof hour>[]) =>
            staffingNeed(hours, [email], pool, { ...poisson, maxPeople: 20 }).intervals;
        const day = run([hour({ email: 150 }, 0), hour({ email: 0 }, H), hour({ email: 40 }, 2 * H)]);
        expect(day[0].capped).to.equal(true);
        expect(day[1].method).to.equal('none');
        const alone = run([hour({ email: 40 }, 2 * H)])[0];
        // Nobody works the quiet hour, and email never gives up: the peak's leftovers are still there.
        expect(day[2].productive.likely).to.be.above(alone.productive.likely);
        // A gap breaks the chain: the later hour is staffed as if it started fresh.
        const gap = run([hour({ email: 150 }, 0), hour({ email: 40 }, 5 * H)]);
        expect(gap[1]).to.deep.equal(run([hour({ email: 40 }, 5 * H)])[0]);
        expect(run([hour({ email: 150 }, 0), hour({ email: 0 }, H), hour({ email: 40 }, 2 * H)])).to.deep.equal(day);
    });

    it('merges repeated pool profiles and ignores empty ones', () => {
        const tags = [tag('en'), tag('fi')];
        const load = [hour({ en: 60, fi: 30 })];
        const merged = staffingNeed(
            load,
            tags,
            [
                { tags: ['en', 'fi'], count: 5 },
                { tags: ['en'], count: 10 },
            ],
            poisson,
        );
        const split = staffingNeed(
            load,
            tags,
            [
                { tags: ['en'], count: 4 },
                { tags: ['fi', 'en'], count: 5 },
                { tags: ['en'], count: 6 },
                { tags: ['fi'], count: 0 },
            ],
            poisson,
        );
        expect(split.intervals).to.deep.equal(merged.intervals);
        const weighted = (order: Array<[string, number]>) =>
            staffingNeed(load, tags, [{ tags: ['en', 'fi'], weights: Object.fromEntries(order), count: 9 }], poisson)
                .intervals;
        expect(
            weighted([
                ['fi', 2],
                ['en', 5],
            ]),
        ).to.deep.equal(
            weighted([
                ['en', 5],
                ['fi', 2],
            ]),
        );
    });

    it('packs work onto part-busy people first, so chats leave whole people for calls (M1)', () => {
        const tags = [tag('chat', { concurrency: 3 }), tag('call')];
        const load = [hour({ chat: 300, call: 120 })];
        const shared = staffingNeed(load, tags, everyone(['chat', 'call']), poisson).intervals[0];
        const separate = staffingNeed(
            load,
            tags,
            [
                { tags: ['chat'], count: 50 },
                { tags: ['call'], count: 50 },
            ],
            poisson,
        ).intervals[0];
        expect(shared.productive.likely).to.be.at.most(separate.productive.likely);
    });

    it('judges the hour’s last arrivals on their whole target, however long (M3)', () => {
        const long = tag('backlog', { targetWaitMs: 8 * 60 * MIN });
        expect(windowFor([long, tag('chat')]).tailMs).to.equal(8 * 60 * MIN);
        expect(windowFor([tag('chat')]).tailMs).to.equal(MIN);
    });

    it('stops drawing seeds once the service level is pinned down (adaptive seeds)', () => {
        // A big, steady queue: every seed tells the same story long before twenty.
        const big = tag('chat', { targetWaitMs: 5 * MIN, targetShare: 0.5 });
        const result = staffingNeed([hour({ chat: 2000 })], [big], everyone(['chat'], 1000), poisson);
        expect(result.simulations).to.be.below(DEFAULT_SEEDS);
        expect(result.intervals[0].productive.likely).to.be.above(160);
    });
});

describe('conversions', () => {
    it('quantizes onto a 5 % grid', () => {
        expect(quantize(0)).to.equal(0);
        expect(quantize(0.44)).to.equal(0.4);
        expect(quantize(100)).to.be.closeTo(100, 2.5);
        expect(quantize(100)).to.equal(quantize(99.5));
        expect(quantize(100)).to.not.equal(quantize(103));
    });
    it('converts a rate and a head count', () => {
        expect(rateNeed(700, 100, 0.3)).to.be.closeTo(10, 1e-9);
        expect(rateNeed(0, 100, 0.3)).to.equal(0);
        expect(() => rateNeed(10, 0, 0)).to.throw(RangeError);
        expect(headcountNeed(-2)).to.equal(0);
        expect(headcountNeed(4)).to.equal(4);
    });
});
