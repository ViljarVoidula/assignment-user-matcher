/**
 * Volume → people (spec §7.3, as amended by the owner: no naive Erlang C).
 *
 * `staffingNeed` finds, per interval, the fewest people who meet every tag's
 * service target in the discrete-event simulation over all seeds together —
 * on average, allowing for forecast error (the expected service level Erlang C
 * staffs to); the per-seed answers' p10–p90 is the range. The team for a head
 * count follows the work (`composeTeam`), and says when it needs more of a
 * profile than the pool has. Without patience a floor that cannot keep up with
 * the arrivals is never enough, however a single hour goes. When some tag's
 * target outlasts its hour (≥ 15 min, or ≥ 2 handle times), back-to-back
 * intervals are simulated in sequence, each opening with what the previous one
 * left queued or in progress at its likely head count. Erlang A only brackets
 * the search. People on shift = working the queue ÷ (1 − shrinkage).
 *
 * `rateNeed` and `headcountNeed` are the two other conversions: volume ÷
 * units per person-hour (warehouses, production), or the series already is
 * people.
 */
import { assertDistribution, createPrng, meanOf } from './distributions';
import { erlangA, erlangASeed } from './erlang';
import {
    ageCarry,
    drawTasks,
    profileScores,
    simulate,
    type Carry,
    type SimTag,
    type SimTasks,
    type SimWindow,
} from './simulation';
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
 * Who is on for a head count of `n`. Heads follow the work, not the pool's mix:
 *
 * 1. Every busy tag somebody can take gets one person first (rarest tag first): nobody rosters ten people
 *    to get the one German speaker.
 * 2. Then each next head goes to the worst-served tag — the one with the largest `shortfall(tag, heads it
 *    has)`; by default `1 − heads ÷ load`, and in `staffingNeed` the Erlang A service level it would have
 *    on its own against its target, so a small tag gets the second person it needs instead of a share.
 *
 * A head for a tag goes to a profile that covers it: one the pool still has people of first, the least
 * versatile among those (generalists are kept for the work only they can take), then the one with the
 * most people left.
 * Past the declared pool, the head still goes to the tag that needs it, so `team[p]` can exceed
 * `counts[p]` — the people to hire; `staffingNeed` reports it as `exceedsPool`. Without any work the
 * pool's own mix is used.
 */
export function composeTeam(
    n: number,
    pool: readonly Float64Array[],
    counts: readonly number[],
    load: ArrayLike<number>,
    shortfall?: (tag: number, heads: number) => number,
): number[] {
    const team = pool.map(() => 0);
    if (n <= 0) return team;
    const coverers = (g: number) => pool.map((s, p) => (s[g] >= 0 ? p : -1)).filter((p) => p >= 0);
    const busy: number[] = [];
    for (let g = 0; g < load.length; g++) if (load[g] > 0 && coverers(g).length > 0) busy.push(g);
    if (busy.length === 0) return apportion(n, counts);
    const short = shortfall ?? ((g: number, heads: number) => 1 - heads / load[g]);
    const breadth = pool.map((s) => busy.filter((g) => s[g] >= 0).length);
    const credit = new Float64Array(load.length);
    let placed = 0;
    const place = (g: number) => {
        const p = coverers(g).sort((a, b) => {
            const spareA = counts[a] - team[a];
            const spareB = counts[b] - team[b];
            return Number(spareB > 0) - Number(spareA > 0) || breadth[a] - breadth[b] || spareB - spareA || a - b;
        })[0];
        team[p] += 1;
        credit[g] += 1;
        placed += 1;
    };
    const rarest = [...busy].sort((a, b) => coverers(a).length - coverers(b).length || a - b);
    for (const g of rarest) {
        if (placed >= n) break;
        if (!team.some((k, p) => k > 0 && pool[p][g] >= 0)) place(g);
    }
    while (placed < n) {
        let worst = busy[0];
        let most = -Infinity;
        for (const g of busy) {
            const v = short(g, credit[g]);
            if (v > most) {
                most = v;
                worst = g;
            }
        }
        place(worst);
    }
    return team;
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
    // Remainders compared to 1e-9, so a float tie (2.5 against 7.5000000000000001) goes to the lower index.
    const byRemainder = exact
        .map((e, p) => ({ p, r: Math.round((e - Math.floor(e)) * 1e9) }))
        .sort((a, b) => b.r - a.r || a.p - b.p);
    for (let i = 0; rest > 0; i = (i + 1) % byRemainder.length, rest--) out[byRemainder[i].p] += 1;
    return out;
}

/**
 * The simulated span around one interval: a warm-up of three mean handle times (15–240 min), the
 * interval, and a tail as long as the longest target, so the interval's last arrivals are judged on
 * their whole wait — the run ends at target + interval length.
 */
export function windowFor(tags: readonly TagProfile[], intervalMinutes = 60): SimWindow {
    const meanHandle = Math.max(...tags.map((t) => meanOf(t.handleMs)), MINUTE);
    return {
        warmMs: clamp(3 * meanHandle, 15 * MINUTE, 240 * MINUTE),
        lengthMs: intervalMinutes * MINUTE,
        tailMs: Math.max(...tags.map((t) => t.targetWaitMs), 0),
    };
}

/** A target this long, or this many handle times, makes a tag's queue outlive its hour: chain the hours. */
export const CARRY_TARGET_MS = 15 * MINUTE;
export const CARRY_TARGET_HANDLES = 2;

interface Prepared {
    tags: SimTag[];
    /** Mean handle time per tag, ms. */
    meanHandle: number[];
    pool: Float64Array[];
    counts: number[];
    window: SimWindow;
    /** Some tag's queue outlives its hour: intervals are simulated in sequence, queue carried over. */
    chained: boolean;
}

/**
 * Validates and prepares the inputs. Pool members with the same tags and weights are merged, and the pool
 * is put in a canonical order, so no answer depends on the order the pool was declared in.
 */
function prepare(tags: readonly TagProfile[], pool: readonly PoolMember[], intervalMinutes: number): Prepared {
    const simTags: SimTag[] = tags.map((profile) => {
        assertDistribution(profile.handleMs, `handleMs of ${profile.tag}`);
        if (profile.patienceMs) assertDistribution(profile.patienceMs, `patienceMs of ${profile.tag}`);
        const concurrency = Math.max(1, Math.floor(profile.concurrency ?? 1));
        return { profile, cost: 1 / concurrency, priority: profile.priority ?? 0 };
    });
    const merged = new Map<string, PoolMember>();
    for (const m of pool) {
        if (!(m.count > 0)) continue;
        const weights = m.weights ? Object.entries(m.weights).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)) : [];
        const key = JSON.stringify([[...new Set(m.tags)].sort(), weights]);
        const seen = merged.get(key);
        if (seen) seen.count += m.count;
        else merged.set(key, { tags: m.tags, weights: m.weights, count: m.count });
    }
    const members = [...merged.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([, m]) => m);
    const meanHandle = simTags.map((t) => meanOf(t.profile.handleMs));
    return {
        tags: simTags,
        meanHandle,
        pool: members.map((m) => profileScores(m, simTags)),
        counts: members.map((m) => m.count),
        window: windowFor(tags, intervalMinutes),
        chained: simTags.some(
            (t, g) =>
                t.profile.targetWaitMs >= CARRY_TARGET_MS || t.profile.targetWaitMs >= CARRY_TARGET_HANDLES * meanHandle[g],
        ),
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
    // A floor above the cap: no head count the search may try can keep up with the work.
    if (floor > max) return { n: max, capped: true };
    const low = Math.max(1, floor);
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

/** Seeds every load gets before the adaptive stop may end it early. */
export const MIN_SEEDS = 8;
/** Stop drawing seeds once every judged tag's pooled service level is known to ±this (95 %). */
export const SERVICE_HALF_WIDTH = 0.01;

const quiet = (startMs: number, uncovered: string[], method: 'none' | 'skipped'): IntervalNeed => {
    const zero: Range = { low: 0, likely: 0, high: 0 };
    return {
        startMs,
        productive: zero,
        onShift: zero,
        serviceByTag: {},
        uncovered,
        erlangSeed: 0,
        method,
        capped: false,
        exceedsPool: false,
    };
};

/**
 * 95 % half-width of a pooled share over seeds: by the ratio estimator from the seeds' own spread, never
 * below the binomial error of the arrivals it rests on (Agresti–Coull) — eight perfect hours are not proof
 * that bad hours do not happen.
 */
function halfWidth(served: readonly number[], arrived: readonly number[]): number {
    const n = arrived.length;
    const x = arrived.reduce((a, b) => a + b, 0);
    const y = served.reduce((a, b) => a + b, 0);
    const shrunk = (y + 2) / (x + 4);
    const binomial = 1.96 * Math.sqrt((shrunk * (1 - shrunk)) / (x + 4));
    if (x === 0) return binomial;
    const ratio = y / x;
    let spread = 0;
    for (let i = 0; i < n; i++) spread += (served[i] - ratio * arrived[i]) ** 2;
    return Math.max(binomial, (1.96 * Math.sqrt(spread / (n * (n - 1)))) / (x / n));
}

export function staffingNeed(
    intervals: readonly StaffingInterval[],
    tags: readonly TagProfile[],
    pool: readonly PoolMember[],
    options: StaffingOptions,
): StaffingResult {
    const started = Date.now();
    const maxSeeds = Math.max(1, options.seeds ?? DEFAULT_SEEDS);
    const minSeeds = Math.min(maxSeeds, MIN_SEEDS);
    const baseSeed = options.seed ?? 1;
    const k = options.overdispersion ?? DEFAULT_OVERDISPERSION;
    const step = options.quantizeStep ?? DEFAULT_QUANTIZE;
    const max = options.maxPeople ?? DEFAULT_MAX_PEOPLE;
    const shrinkage = clamp(options.shrinkage, 0, 0.9);
    const prep = prepare(tags, pool, options.intervalMinutes ?? 60);
    const nTags = prep.tags.length;
    const lengthMs = prep.window.lengthMs;
    const memo = new Map<string, Omit<IntervalNeed, 'startMs'>>();
    let simulations = 0;
    let cacheHits = 0;
    let incomplete = false;
    /** Chained runs: each seed's leftovers at the previous interval's likely head count. */
    let carries: Carry[] | null = null;
    let carriedTo = Number.NaN;

    /** One interval, simulated from scratch (`carryIn` null) or opening with the previous one's leftovers. */
    const solve = (offered: number[], judged: number[], seedKey: string, carryIn: Carry[] | null) => {
        const window: SimWindow = carryIn ? { ...prep.window, warmMs: 0 } : prep.window;
        // Work per tag: this interval's arrivals plus what the seeds carried in on average (tasks per ms).
        const rates = offered.map((v) => v / lengthMs);
        if (carryIn) {
            for (const carry of carryIn) {
                for (let i = 0; i < carry.tag.length; i++) rates[carry.tag[i]] += 1 / lengthMs / carryIn.length;
            }
        }
        // Each tag's Erlang A service level with h people on it alone, against its target: the composition
        // gives the next head to the tag furthest short (a small tag needs its second person, not a share).
        const levels = new Map<number, number>();
        const shortfall = (g: number, h: number) => {
            const key = g * 100_000 + h;
            let level = levels.get(key);
            if (level === undefined) {
                const t = prep.tags[g];
                level = erlangA(h, {
                    lambda: rates[g],
                    meanHandleMs: Math.max(1, prep.meanHandle[g] * t.cost),
                    meanPatienceMs: t.profile.patienceMs ? meanOf(t.profile.patienceMs) : Infinity,
                    targetMs: t.profile.targetWaitMs,
                }).serviceLevel;
                levels.set(key, level);
            }
            return t(g) - level;
        };
        const t = (g: number) => prep.tags[g].profile.targetShare;
        const teams = new Map<number, number[]>();
        const teamOf = (n: number) => {
            let team = teams.get(n);
            if (!team) teams.set(n, (team = composeTeam(n, prep.pool, prep.counts, rates, shortfall)));
            return team;
        };
        const erlangSeed = seedFor(offered, prep, max);
        const drawn: SimTasks[] = [];
        const runs: Array<Map<number, { served: Int32Array; carry: Carry | null }>> = [];
        const run = (s: number, n: number) => {
            let hit = runs[s].get(n);
            if (!hit) {
                const out = prep.chained ? { carry: null as Carry | null } : undefined;
                const served = simulate(drawn[s], prep.pool, teamOf(n), prep.tags, window, undefined, out);
                hit = { served, carry: out ? out.carry : null };
                runs[s].set(n, hit);
            }
            return hit;
        };
        const served = (s: number, n: number) => run(s, n).served;
        const perSeed: number[] = [];
        /** Each answer minus the Erlang A seed of that seed's own drawn load: how far the bracket is off. */
        const offsets: number[] = [];
        let capped = false;
        for (let s = 0; s < maxSeeds; s++) {
            // The seed is a function of the load (and, chained, of the interval), not of the position in the
            // list: the same load always gets the same draws, so memoised and fresh answers agree.
            const rand = createPrng(hashSeed(baseSeed, seedKey, s));
            const tasks = drawTasks(offered, prep.tags, window, k, rand, carryIn ? carryIn[s % carryIn.length] : null);
            drawn.push(tasks);
            runs.push(new Map());
            if (judged.every((g) => tasks.measuredByTag[g] === 0)) perSeed.push(0);
            else {
                // Start from Erlang A on this seed's own drawn rate (the overdispersion draw moves a seed's
                // answer by far more than its arrivals' timing does), corrected by how far it was off so far.
                const own = seedFor(
                    Array.from(tasks.rate, (r) => r * lengthMs),
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
            // Adaptive stop: enough seeds once the pooled service level near the answer is pinned down.
            const count = s + 1;
            if (count >= minSeeds && count < maxSeeds && (count - minSeeds) % 4 === 0) {
                const at = Math.max(
                    1,
                    Math.ceil(
                        quantileSorted(
                            [...perSeed].sort((a, b) => a - b),
                            0.5,
                        ),
                    ),
                );
                const settled = judged.every(
                    (g) =>
                        halfWidth(
                            drawn.map((_, j) => served(j, at)[g]),
                            drawn.map((t) => t.measuredByTag[g]),
                        ) < SERVICE_HALF_WIDTH,
                );
                if (settled) break;
            }
        }
        const seeds = drawn.length;
        simulations += seeds;
        // Likely: the fewest people who meet the target over all seeds together — on average, allowing for
        // forecast error (the rate noise), which is the expected share served in time Erlang C staffs to.
        // One hour's service level is skewed (a bad hour is very bad), so the median of per-seed answers
        // sits a person under it even on Poisson arrivals; with the rate noised, the busier draws bring more
        // arrivals too and pull further. Low and high are the seeds' own spread.
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
        const expectedRate = offered.map((v) => v / lengthMs);
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
        const team = teamOf(likely);
        const toShift = (n: number) => Math.ceil(n / (1 - shrinkage) - 1e-9);
        const need: Omit<IntervalNeed, 'startMs'> = {
            productive,
            onShift: { low: toShift(productive.low), likely: toShift(productive.likely), high: toShift(productive.high) },
            serviceByTag,
            uncovered: [],
            erlangSeed,
            method: 'simulation',
            capped,
            exceedsPool: team.some((heads, p) => heads > prep.counts[p]),
        };
        const carryOut = prep.chained ? drawn.map((_, s) => run(s, likely).carry!) : null;
        return { need, carryOut };
    };

    const out: IntervalNeed[] = intervals.map((interval) => {
        // Chained hours never share a simulation, so they are simulated at their own load, not the grid's.
        const expected = prep.tags.map((t) => {
            const value = interval.arrivals[t.profile.tag] ?? 0;
            return prep.chained ? (value > 0 ? Math.round(value * 1e6) / 1e6 : 0) : quantize(value, step);
        });
        const busy = expected.map((v, g) => (v > 0 ? g : -1)).filter((g) => g >= 0);
        const uncovered = busy.filter((g) => !prep.pool.some((s) => s[g] >= 0)).map((g) => prep.tags[g].profile.tag);
        const judged = busy.filter((g) => prep.pool.some((s) => s[g] >= 0));
        // A chain holds only across back-to-back intervals.
        const carryIn = carries && interval.startMs === carriedTo ? carries : null;
        carries = null;
        carriedTo = interval.startMs + lengthMs;
        if (judged.length === 0) {
            // Nobody is needed for new work; whatever was left over runs down or gives up meanwhile.
            if (carryIn) carries = carryIn.map((c) => ageCarry(c, lengthMs));
            return quiet(interval.startMs, uncovered, 'none');
        }
        const key = expected.join(',');
        if (!prep.chained) {
            const hit = memo.get(key);
            if (hit) {
                cacheHits += 1;
                return { startMs: interval.startMs, ...hit, uncovered };
            }
        }
        if (options.budgetMs !== undefined && Date.now() - started > options.budgetMs) {
            incomplete = true;
            return quiet(interval.startMs, uncovered, 'skipped');
        }
        // Uncovered tags' work would only sit in a queue nobody reads: it is neither drawn nor seeded.
        const offered = expected.map((v, g) => (judged.includes(g) ? v : 0));
        const seedKey = prep.chained ? `${key}@${interval.startMs}` : key;
        const { need, carryOut } = solve(offered, judged, seedKey, carryIn);
        carries = carryOut;
        if (!prep.chained) memo.set(key, need);
        return { startMs: interval.startMs, ...need, uncovered };
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
