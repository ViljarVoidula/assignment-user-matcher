/**
 * Volume → people (spec §7.3, as amended by the owner: no naive Erlang C).
 *
 * `staffingNeed` finds, per interval, the fewest people drawn from the
 * declared pool who meet every tag's service target in the discrete-event
 * simulation over all seeds together (the expected service level, which is
 * what Erlang C staffs to); the per-seed answers' p10–p90 is the range.
 * Without patience a floor that cannot keep up with the arrivals is never
 * enough, however a single hour goes. Erlang A only brackets the search.
 * People on shift = working the queue ÷ (1 − shrinkage).
 *
 * `rateNeed` and `headcountNeed` are the two other conversions: volume ÷
 * units per person-hour (warehouses, production), or the series already is
 * people.
 */
import { assertDistribution, createPrng, meanOf } from './distributions';
import { erlangASeed } from './erlang';
import { drawTasks, profileScores, simulate, type SimTag, type SimTasks, type SimWindow } from './simulation';
import type {
    IntervalNeed,
    PoolMember,
    Range,
    StaffingInterval,
    StaffingOptions,
    StaffingResult,
    TagProfile,
} from './types';
import { clamp, quantileSorted } from './stats';

export const DEFAULT_SEEDS = 20;
export const DEFAULT_OVERDISPERSION = 20;
export const DEFAULT_QUANTIZE = 0.05;
export const DEFAULT_MAX_PEOPLE = 500;
const MINUTE = 60_000;

/** Arrivals rounded onto a relative grid, so hours with near-identical load share one simulation. */
export function quantize(value: number, step = DEFAULT_QUANTIZE): number {
    if (value <= 0) return 0;
    if (value < 1) return Math.round(value * 10) / 10;
    const k = Math.log(1 + step);
    return Math.round(Math.exp(Math.round(Math.log(value) / k) * k) * 100) / 100;
}

/**
 * Who is on for a head count of `n`: first one person for every tag with
 * work that somebody in the pool can take (rarest tag first, the most
 * versatile profile that covers it), then the rest in proportion to how many
 * of each profile are still unrostered. The planner would do the same: nobody
 * rosters ten people to get the one German speaker. A profile never gets more
 * people than the pool declares while the pool is big enough; past the pool's
 * size, the extra heads follow the pool's mix (people still to be hired).
 */
export function composeTeam(
    n: number,
    pool: readonly Float64Array[],
    counts: readonly number[],
    busyTags: readonly number[],
): number[] {
    const picked = new Array<number>(pool.length).fill(0);
    let left = n;
    const coverers = (g: number) => pool.map((s, p) => (s[g] >= 0 ? p : -1)).filter((p) => p >= 0);
    const order = [...busyTags].sort((a, b) => coverers(a).length - coverers(b).length || a - b);
    const breadth = (p: number) => busyTags.filter((t) => pool[p][t] >= 0).length;
    for (const g of order) {
        if (left <= 0) break;
        if (picked.some((k, p) => k > 0 && pool[p][g] >= 0)) continue;
        const options = coverers(g);
        if (options.length === 0) continue;
        const best = options.sort((a, b) => breadth(b) - breadth(a) || counts[b] - counts[a] || a - b)[0];
        picked[best] += 1;
        left -= 1;
    }
    const spare = counts.map((c, p) => Math.max(0, c - picked[p]));
    const spareTotal = spare.reduce((a, b) => a + b, 0);
    if (left > 0 && spareTotal >= left) {
        apportion(left, spare).forEach((k, p) => (picked[p] += k));
    } else if (left > 0) {
        // Everybody declared is on; the rest are heads the pool does not have yet, in its mix.
        spare.forEach((k, p) => (picked[p] += k));
        apportion(left - spareTotal, counts).forEach((k, p) => (picked[p] += k));
    }
    return picked;
}

/**
 * Splits `n` in proportion to `weights` by largest remainder (ties to the lower index); never above a weight
 * when n ≤ Σ weights.
 */
function apportion(n: number, weights: readonly number[]): number[] {
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return weights.map(() => 0);
    const exact = weights.map((c) => (c / total) * n);
    const out = exact.map(Math.floor);
    let rest = n - out.reduce((a, b) => a + b, 0);
    const byRemainder = exact.map((e, p) => ({ p, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r || a.p - b.p);
    for (let i = 0; rest > 0; i = (i + 1) % byRemainder.length, rest--) out[byRemainder[i].p] += 1;
    return out;
}

interface Prepared {
    tags: SimTag[];
    /** Mean handle time per tag, ms. */
    meanHandle: number[];
    pool: Float64Array[];
    counts: number[];
    window: SimWindow;
}

function prepare(tags: readonly TagProfile[], pool: readonly PoolMember[], intervalMinutes: number): Prepared {
    const simTags: SimTag[] = tags.map((profile) => {
        assertDistribution(profile.handleMs, `handleMs of ${profile.tag}`);
        if (profile.patienceMs) assertDistribution(profile.patienceMs, `patienceMs of ${profile.tag}`);
        const concurrency = Math.max(1, Math.floor(profile.concurrency ?? 1));
        return { profile, cost: 1 / concurrency, priority: profile.priority ?? 0 };
    });
    const members = pool.filter((m) => m.count > 0);
    const meanHandle = Math.max(...simTags.map((t) => meanOf(t.profile.handleMs)), MINUTE);
    const longestTarget = Math.max(...simTags.map((t) => t.profile.targetWaitMs), 0);
    return {
        tags: simTags,
        meanHandle: simTags.map((t) => meanOf(t.profile.handleMs)),
        pool: members.map((m) => profileScores(m, simTags)),
        counts: members.map((m) => m.count),
        window: {
            warmMs: clamp(3 * meanHandle, 15 * MINUTE, 240 * MINUTE),
            lengthMs: intervalMinutes * MINUTE,
            tailMs: Math.min(longestTarget, 240 * MINUTE),
        },
    };
}

/** Erlang A over the interval's pooled load: only the search's starting point. */
function seedFor(expected: number[], prep: Prepared, max: number): number {
    const total = expected.reduce((a, b) => a + b, 0);
    let handle = 0;
    let patienceRate = 0;
    let target = Infinity;
    let share = 0;
    prep.tags.forEach((t, g) => {
        if (!expected[g]) return;
        const w = expected[g] / total;
        handle += w * prep.meanHandle[g] * t.cost;
        if (t.profile.patienceMs) patienceRate += w / Math.max(1, meanOf(t.profile.patienceMs));
        target = Math.min(target, t.profile.targetWaitMs);
        share = Math.max(share, t.profile.targetShare);
    });
    return erlangASeed(
        {
            lambda: total / prep.window.lengthMs,
            meanHandleMs: Math.max(1, handle),
            meanPatienceMs: patienceRate > 0 ? 1 / patienceRate : Infinity,
            targetMs: target,
        },
        share,
        max,
    );
}

/**
 * The fewest people a seed's arrivals can be served by in steady state: more than the work that never
 * leaves (tags without patience), in person-units. Below it the queue only grows, however well a single
 * hour that started without a backlog seems to go; work that gives up is shed instead, so it sets no floor.
 */
function stableFloor(rate: ArrayLike<number>, prep: Prepared, judged: readonly number[]): number {
    let load = 0;
    for (const g of judged) {
        const t = prep.tags[g];
        if (!t.profile.patienceMs) load += rate[g] * prep.meanHandle[g] * t.cost;
    }
    return Math.floor(load + 1e-9) + 1;
}

/**
 * Fewest people for whom `ok` holds, at least `floor` (`ok` is taken as monotone in the head count). The
 * walk starts at `start` — a good guess lands within a person or two — and gallops away from it, down while
 * it still passes or up until it does, doubling its step, then bisects the last step.
 */
function search(ok: (n: number) => boolean, start: number, floor: number, max: number): { n: number; capped: boolean } {
    const low = Math.min(Math.max(1, floor), max);
    /** Smallest passing head count in [lo, hi], given that hi passes. */
    const bisect = (lo: number, hi: number) => {
        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (ok(mid)) hi = mid;
            else lo = mid + 1;
        }
        return hi;
    };
    const first = clamp(start, low, max);
    let step = 1;
    if (ok(first)) {
        let hi = first;
        while (hi > low) {
            const next = Math.max(low, hi - step);
            if (!ok(next)) return { n: bisect(next + 1, hi), capped: false };
            hi = next;
            step *= 2;
        }
        return { n: hi, capped: false };
    }
    let lo = first;
    while (lo < max) {
        const next = Math.min(max, lo + step);
        if (ok(next)) return { n: bisect(lo + 1, next), capped: false };
        lo = next;
        step *= 2;
    }
    return { n: max, capped: true };
}

/** Whether served counts meet every judged tag's share of arrivals (a tag with none passes). */
const meets = (served: ArrayLike<number>, arrived: ArrayLike<number>, prep: Prepared, judged: readonly number[]) =>
    judged.every((g) => arrived[g] === 0 || served[g] / arrived[g] >= prep.tags[g].profile.targetShare - 1e-9);

export function staffingNeed(
    intervals: readonly StaffingInterval[],
    tags: readonly TagProfile[],
    pool: readonly PoolMember[],
    options: StaffingOptions,
): StaffingResult {
    const started = Date.now();
    const seeds = Math.max(1, options.seeds ?? DEFAULT_SEEDS);
    const baseSeed = options.seed ?? 1;
    const k = options.overdispersion ?? DEFAULT_OVERDISPERSION;
    const step = options.quantizeStep ?? DEFAULT_QUANTIZE;
    const max = options.maxPeople ?? DEFAULT_MAX_PEOPLE;
    const shrinkage = clamp(options.shrinkage, 0, 0.9);
    const prep = prepare(tags, pool, options.intervalMinutes ?? 60);
    const memo = new Map<string, Omit<IntervalNeed, 'startMs'>>();
    let simulations = 0;
    let cacheHits = 0;
    let incomplete = false;

    const out: IntervalNeed[] = intervals.map((interval) => {
        const expected = prep.tags.map((t) => quantize(interval.arrivals[t.profile.tag] ?? 0, step));
        const busy = expected.map((v, g) => (v > 0 ? g : -1)).filter((g) => g >= 0);
        const uncovered = busy.filter((g) => !prep.pool.some((s) => s[g] >= 0)).map((g) => prep.tags[g].profile.tag);
        const judged = busy.filter((g) => prep.pool.some((s) => s[g] >= 0));
        const zero: Range = { low: 0, likely: 0, high: 0 };
        if (judged.length === 0) {
            return {
                startMs: interval.startMs,
                productive: zero,
                onShift: zero,
                serviceByTag: {},
                uncovered,
                erlangSeed: 0,
                method: 'none',
                capped: false,
            };
        }
        const key = expected.join(',');
        const hit = memo.get(key);
        if (hit) {
            cacheHits += 1;
            return { startMs: interval.startMs, ...hit };
        }
        if (options.budgetMs !== undefined && Date.now() - started > options.budgetMs) {
            incomplete = true;
            return {
                startMs: interval.startMs,
                productive: zero,
                onShift: zero,
                serviceByTag: {},
                uncovered,
                erlangSeed: 0,
                method: 'skipped',
                capped: false,
            };
        }
        // Uncovered tags' work would only sit in a queue nobody reads: it is neither drawn nor seeded.
        const offered = expected.map((v, g) => (judged.includes(g) ? v : 0));
        const erlangSeed = seedFor(offered, prep, max);
        const nTags = prep.tags.length;
        const drawn: SimTasks[] = [];
        // Served counts per seed and head count: the per-seed searches and the pooled one share runs.
        const runs: Array<Map<number, Int32Array>> = [];
        const served = (s: number, n: number): Int32Array => {
            let hit = runs[s].get(n);
            if (!hit) {
                const team = composeTeam(n, prep.pool, prep.counts, judged);
                hit = simulate(drawn[s], prep.pool, team, prep.tags, prep.window);
                runs[s].set(n, hit);
            }
            return hit;
        };
        simulations += seeds;
        const perSeed: number[] = [];
        /** Each answer minus the Erlang A seed of that seed's own drawn load: how far the bracket is off. */
        const offsets: number[] = [];
        let capped = false;
        for (let s = 0; s < seeds; s++) {
            // The seed is a function of the load, not of the interval's position:
            // the same load always gets the same draws, so memoised and fresh answers agree.
            const rand = createPrng(hashSeed(baseSeed, key, s));
            const tasks = drawTasks(offered, prep.tags, prep.window, k, rand);
            drawn.push(tasks);
            runs.push(new Map());
            if (judged.every((g) => tasks.measuredByTag[g] === 0)) {
                perSeed.push(0);
                continue;
            }
            // Start from Erlang A on this seed's own drawn rate (the overdispersion draw moves a seed's answer
            // by far more than its arrivals' timing does), corrected by how far it was off for earlier seeds.
            const own = seedFor(
                Array.from(tasks.rate, (r) => r * prep.window.lengthMs),
                prep,
                max,
            );
            const offset = offsets.length > 0 ? [...offsets].sort((a, b) => a - b)[offsets.length >> 1] : 0;
            const found = search(
                (n) => meets(served(s, n), tasks.measuredByTag, prep, judged),
                own + offset,
                stableFloor(tasks.rate, prep, judged),
                max,
            );
            capped ||= found.capped;
            perSeed.push(found.n);
            offsets.push(found.n - own);
        }
        // Likely: the fewest people who meet the target over all seeds together — the expected share of
        // arrivals served in time, the criterion Erlang C staffs to. One hour's service level is skewed (a bad
        // hour is very bad), so the median of per-seed answers sits a person under it even on Poisson
        // arrivals; with the rate noised, the busier draws bring more arrivals too and pull further. Low and
        // high are the seeds' own spread.
        const arrived = new Float64Array(nTags);
        for (const tasks of drawn) for (const g of judged) arrived[g] += tasks.measuredByTag[g];
        const pooledServed = (n: number): Float64Array => {
            const sum = new Float64Array(nTags);
            for (let s = 0; s < seeds; s++) {
                const one = served(s, n);
                for (const g of judged) sum[g] += one[g];
            }
            return sum;
        };
        const sorted = [...perSeed].sort((a, b) => a - b);
        const expectedRate = offered.map((v) => v / prep.window.lengthMs);
        const pooled = judged.some((g) => arrived[g] > 0)
            ? search(
                  (n) => meets(pooledServed(n), arrived, prep, judged),
                  Math.max(1, Math.ceil(quantileSorted(sorted, 0.5))),
                  stableFloor(expectedRate, prep, judged),
                  max,
              )
            : { n: 0, capped: false };
        capped ||= pooled.capped;
        const likely = pooled.n;
        const productive: Range = {
            low: Math.min(likely, Math.floor(quantileSorted(sorted, 0.1))),
            likely,
            high: Math.max(likely, Math.ceil(quantileSorted(sorted, 0.9))),
        };
        const atLikely = pooledServed(likely);
        const serviceByTag: Record<string, number> = {};
        for (const g of judged) {
            const share = arrived[g] > 0 ? atLikely[g] / arrived[g] : 1;
            serviceByTag[prep.tags[g].profile.tag] = Math.round(share * 1000) / 1000;
        }
        const toShift = (n: number) => Math.ceil(n / (1 - shrinkage) - 1e-9);
        const need: Omit<IntervalNeed, 'startMs'> = {
            productive,
            onShift: { low: toShift(productive.low), likely: toShift(productive.likely), high: toShift(productive.high) },
            serviceByTag,
            uncovered,
            erlangSeed,
            method: 'simulation',
            capped,
        };
        memo.set(key, need);
        return { startMs: interval.startMs, ...need };
    });
    return { intervals: out, ms: Date.now() - started, simulations, cacheHits, incomplete };
}

/** FNV-1a over the base seed, the load key and the seed index. */
function hashSeed(base: number, key: string, s: number): number {
    let h = 0x811c9dc5 ^ base;
    const text = `${key}#${s}`;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

/** People on shift for a volume at a fixed rate: units ÷ units per person-hour ÷ (1 − shrinkage), per hour. */
export function rateNeed(unitsPerHour: number, unitsPerPersonHour: number, shrinkage: number): number {
    if (unitsPerHour <= 0) return 0;
    if (!(unitsPerPersonHour > 0)) throw new RangeError('unitsPerPersonHour must be positive');
    return unitsPerHour / unitsPerPersonHour / (1 - clamp(shrinkage, 0, 0.9));
}

/** The series already counts people. */
export function headcountNeed(value: number): number {
    return Math.max(0, value);
}
